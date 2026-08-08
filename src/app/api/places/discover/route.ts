import { NextResponse } from 'next/server';
import { rateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';

export const runtime = 'edge';

// POI discovery por viewport bbox + categoría.
// Pattern Google Maps 2026 "explore" mode.
// Fallback a Nominatim (OSM) si no hay Google Maps API key.

export type POICategory = 'food' | 'attraction' | 'nature' | 'gas' | 'hotel' | 'ev' | 'shopping';

export interface DiscoveryPOI {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  category: POICategory;
  rating?: number;
  user_ratings_total?: number;
  photo_url?: string;
  price_level?: number;
  google_place_id?: string;
}

interface Body {
  bbox: [number, number, number, number]; // [west, south, east, north]
  category: POICategory;
  maxResults?: number;
}

// Google Places includedTypes por categoría
const CATEGORY_GOOGLE_TYPES: Record<POICategory, string[]> = {
  food: ['restaurant', 'cafe'],
  attraction: ['tourist_attraction', 'museum', 'art_gallery'],
  nature: ['park', 'national_park', 'hiking_area'],
  gas: ['gas_station'],
  hotel: ['lodging', 'hotel'],
  ev: [],       // handled by /api/places/ev-chargers (OpenChargeMap)
  shopping: ['shopping_mall', 'clothing_store', 'store']
};

// Nominatim amenity/tourism/leisure keys por categoría
const CATEGORY_NOMINATIM: Record<POICategory, { key: string; values: string[] }[]> = {
  food: [{ key: 'amenity', values: ['restaurant', 'cafe', 'fast_food'] }],
  attraction: [{ key: 'tourism', values: ['attraction', 'museum', 'gallery', 'artwork'] }],
  nature: [{ key: 'leisure', values: ['park', 'nature_reserve'] }, { key: 'boundary', values: ['national_park'] }],
  gas: [{ key: 'amenity', values: ['fuel'] }],
  hotel: [{ key: 'tourism', values: ['hotel', 'hostel', 'guest_house'] }],
  ev: [{ key: 'amenity', values: ['charging_station'] }],
  shopping: [{ key: 'shop', values: ['mall', 'clothes', 'convenience'] }]
};

export async function POST(req: Request){
  const rl = rateLimit(getClientKey(req), { limit: 30, windowSec: 60 });
  if(!rl.ok) return rateLimitResponse(rl);

  try {
    const body = (await req.json()) as Body;
    const bbox = body.bbox;
    if(!Array.isArray(bbox) || bbox.length !== 4){
      return NextResponse.json({ error: 'bbox_required' }, { status: 400 });
    }
    const [west, south, east, north] = bbox;
    if([west, south, east, north].some(v => typeof v !== 'number' || Number.isNaN(v))){
      return NextResponse.json({ error: 'bbox_invalid' }, { status: 400 });
    }
    const category = body.category;
    if(!CATEGORY_GOOGLE_TYPES[category]) return NextResponse.json({ error: 'invalid_category' }, { status: 400 });
    const max = Math.min(30, Math.max(1, body.maxResults || 20));

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const googleTypes = CATEGORY_GOOGLE_TYPES[category];

    // Google Places searchNearby preferred si hay API key
    if(apiKey && googleTypes.length > 0){
      const centerLat = (south + north) / 2;
      const centerLng = (west + east) / 2;
      // Radio = mitad de diagonal del bbox in meters (aprox)
      const latDelta = Math.abs(north - south);
      const lngDelta = Math.abs(east - west);
      const radius = Math.min(50000, Math.max(500, Math.sqrt(latDelta * latDelta + lngDelta * lngDelta) * 55000)); // 111km/deg approx

      const r = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
        method: 'POST',
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.priceLevel,places.types',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          includedTypes: googleTypes,
          maxResultCount: max,
          languageCode: 'en',
          locationRestriction: {
            circle: {
              center: { latitude: centerLat, longitude: centerLng },
              radius
            }
          }
        })
      });
      if(!r.ok) return NextResponse.json({ error: 'places_failed', detail: (await r.text()).slice(0, 200) }, { status: 502 });
      const data = await r.json();
      const pois: DiscoveryPOI[] = (data.places || []).map((p: {
        id: string;
        displayName?: { text?: string };
        formattedAddress?: string;
        location?: { latitude: number; longitude: number };
        rating?: number;
        userRatingCount?: number;
        photos?: Array<{ name: string }>;
        priceLevel?: string;
      }) => ({
        id: `g:${p.id}`,
        name: p.displayName?.text || '',
        lat: p.location?.latitude || 0,
        lng: p.location?.longitude || 0,
        address: p.formattedAddress,
        category,
        rating: p.rating,
        user_ratings_total: p.userRatingCount,
        photo_url: p.photos?.[0]?.name
          ? `https://places.googleapis.com/v1/${p.photos[0].name}/media?maxHeightPx=200&key=${apiKey}`
          : undefined,
        price_level: typeof p.priceLevel === 'string'
          ? ({ PRICE_LEVEL_FREE: 0, PRICE_LEVEL_INEXPENSIVE: 1, PRICE_LEVEL_MODERATE: 2, PRICE_LEVEL_EXPENSIVE: 3, PRICE_LEVEL_VERY_EXPENSIVE: 4 } as Record<string, number>)[p.priceLevel]
          : undefined,
        google_place_id: p.id
      })).filter((p: DiscoveryPOI) => p.lat && p.lng);
      return NextResponse.json({ pois, source: 'google', count: pois.length });
    }

    // Fallback: Nominatim OSM (gratis, sin key)
    const nomKeys = CATEGORY_NOMINATIM[category];
    const q = nomKeys[0].values.slice(0, 3).join(',');
    const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=${max}&viewbox=${west},${north},${east},${south}&bounded=1&${nomKeys[0].key}=${q}`;
    const nr = await fetch(nomUrl, { headers: { 'user-agent': 'TripLoop/1.0 (contact@triploop.app)' } });
    if(!nr.ok) return NextResponse.json({ error: 'nominatim_failed' }, { status: 502 });
    const nomData = (await nr.json()) as Array<{ osm_id: number; display_name: string; lat: string; lon: string; name?: string; type?: string }>;
    const pois: DiscoveryPOI[] = nomData.map((p) => ({
      id: `osm:${p.osm_id}`,
      name: p.name || p.display_name.split(',')[0],
      lat: parseFloat(p.lat),
      lng: parseFloat(p.lon),
      address: p.display_name,
      category
    })).filter((p) => p.lat && p.lng && p.name);
    return NextResponse.json({ pois, source: 'nominatim', count: pois.length });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
