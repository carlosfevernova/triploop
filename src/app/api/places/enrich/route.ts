import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

export const runtime = 'edge';

interface Body {
  name: string;
  lat?: number;
  lng?: number;
  google_place_id?: string; // si ya la conocemos, saltamos búsqueda
}

interface EnrichedPoi {
  google_place_id: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  types?: string[];
  rating?: number;
  user_ratings_total?: number;
  phone?: string;
  website?: string;
  opening_hours?: Record<string, unknown> | null;
  photo_url?: string;
  price_level?: number;
}

const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

const FIELD_MASK = [
  'id',
  'displayName',
  'formattedAddress',
  'location',
  'types',
  'rating',
  'userRatingCount',
  'internationalPhoneNumber',
  'websiteUri',
  'regularOpeningHours',
  'photos',
  'priceLevel'
].join(',');

export async function POST(req: Request){
  try {
    const body = (await req.json()) as Body;
    if(!body.name && !body.google_place_id){
      return NextResponse.json({ error: 'name_or_place_id_required' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if(!apiKey) return NextResponse.json({ error: 'maps_not_configured' }, { status: 500 });

    const sb = createAdminClient();

    // 1) Si nos pasan place_id → check cache directo (soft-fail si tabla no existe)
    if(body.google_place_id){
      try {
        const cached = await getCached(sb, body.google_place_id);
        if(cached) return NextResponse.json({ poi: cached, source: 'cache' });
      } catch { /* tabla pois puede no existir aún; seguir sin caché */ }
    }

    // 2) Text Search para localizar el place_id
    const searchQuery = body.lat && body.lng
      ? `${body.name}`
      : body.name;

    const searchBody: Record<string, unknown> = {
      textQuery: searchQuery,
      maxResultCount: 1,
      languageCode: 'en'
    };
    if(body.lat && body.lng){
      searchBody.locationBias = {
        circle: { center: { latitude: body.lat, longitude: body.lng }, radius: 5000 }
      };
    }

    const searchRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id',
        'content-type': 'application/json'
      },
      body: JSON.stringify(searchBody)
    });
    if(!searchRes.ok){
      return NextResponse.json({ error: 'places_search_failed', detail: (await searchRes.text()).slice(0, 200) }, { status: 502 });
    }
    const searchData = await searchRes.json();
    const placeId = searchData.places?.[0]?.id;
    if(!placeId){
      return NextResponse.json({ error: 'no_match_found', name: body.name }, { status: 404 });
    }

    // 3) Cache check por placeId real
    try {
      const cached = await getCached(sb, placeId);
      if(cached) return NextResponse.json({ poi: cached, source: 'cache' });
    } catch { /* sin caché → seguir */ }

    // 4) Place Details completo
    const detailsRes = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=en`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': FIELD_MASK
      }
    });
    if(!detailsRes.ok){
      return NextResponse.json({ error: 'places_details_failed', detail: (await detailsRes.text()).slice(0, 200) }, { status: 502 });
    }
    const p = await detailsRes.json();

    const enriched: EnrichedPoi = {
      google_place_id: p.id,
      name: p.displayName?.text || body.name,
      address: p.formattedAddress,
      lat: p.location?.latitude,
      lng: p.location?.longitude,
      types: p.types || [],
      rating: p.rating,
      user_ratings_total: p.userRatingCount,
      phone: p.internationalPhoneNumber,
      website: p.websiteUri,
      opening_hours: p.regularOpeningHours ?? null,
      photo_url: p.photos?.[0]?.name
        ? `https://places.googleapis.com/v1/${p.photos[0].name}/media?maxHeightPx=400&key=${apiKey}`
        : undefined,
      price_level: typeof p.priceLevel === 'string'
        ? ({ PRICE_LEVEL_FREE: 0, PRICE_LEVEL_INEXPENSIVE: 1, PRICE_LEVEL_MODERATE: 2, PRICE_LEVEL_EXPENSIVE: 3, PRICE_LEVEL_VERY_EXPENSIVE: 4 } as Record<string, number>)[p.priceLevel]
        : undefined
    };

    // 5) Upsert cache (soft-fail para no romper la respuesta si tabla falta)
    try {
    await sb.from('pois').upsert({
      google_place_id: enriched.google_place_id,
      name: enriched.name,
      address: enriched.address,
      lat: enriched.lat,
      lng: enriched.lng,
      types: enriched.types,
      rating: enriched.rating,
      user_ratings_total: enriched.user_ratings_total,
      phone: enriched.phone,
      website: enriched.website,
      opening_hours: enriched.opening_hours,
      photo_url: enriched.photo_url,
      price_level: enriched.price_level,
      raw: p,
      fetched_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { onConflict: 'google_place_id' });
    } catch { /* caché opcional */ }

    return NextResponse.json({ poi: enriched, source: 'google' });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}

async function getCached(sb: ReturnType<typeof createAdminClient>, googlePlaceId: string): Promise<EnrichedPoi | null> {
  const { data } = await sb.from('pois').select('*').eq('google_place_id', googlePlaceId).maybeSingle();
  if(!data) return null;
  const fetched = data.fetched_at ? new Date(data.fetched_at).getTime() : 0;
  if(Date.now() - fetched > CACHE_TTL_MS) return null; // expirado
  return {
    google_place_id: data.google_place_id,
    name: data.name,
    address: data.address,
    lat: data.lat,
    lng: data.lng,
    types: data.types,
    rating: data.rating,
    user_ratings_total: data.user_ratings_total,
    phone: data.phone,
    website: data.website,
    opening_hours: data.opening_hours,
    photo_url: data.photo_url,
    price_level: data.price_level
  };
}
