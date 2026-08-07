import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Places API (New) - Nearby Search
// Docs: https://developers.google.com/maps/documentation/places/web-service/nearby-search
export async function POST(req: Request){
  try {
    const { lat, lng, radius = 2000, category, maxResults = 12 } = await req.json();
    if(typeof lat !== 'number' || typeof lng !== 'number'){
      return NextResponse.json({ error: 'lat_lng_required' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if(!apiKey) return NextResponse.json({ error: 'maps_not_configured' }, { status: 500 });

    // Category → Google Places includedTypes
    const CATEGORY_MAP: Record<string, string[]> = {
      food: ['restaurant', 'cafe', 'bakery'],
      attraction: ['tourist_attraction', 'museum', 'art_gallery'],
      nature: ['park', 'national_park', 'hiking_area', 'campground'],
      hotel: ['hotel', 'lodging'],
      shopping: ['shopping_mall', 'store'],
      bar: ['bar', 'night_club']
    };

    const includedTypes = category && CATEGORY_MAP[category] ? CATEGORY_MAP[category] : undefined;

    const body: Record<string, unknown> = {
      maxResultCount: Math.min(20, maxResults),
      languageCode: 'en',
      locationRestriction: {
        circle: { center: { latitude: lat, longitude: lng }, radius: Math.min(50000, radius) }
      },
      rankPreference: 'POPULARITY'
    };
    if(includedTypes) body.includedTypes = includedTypes;

    const r = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.types,places.rating,places.userRatingCount,places.photos,places.priceLevel',
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if(!r.ok){
      return NextResponse.json({ error: 'places_nearby_failed', status: r.status, detail: (await r.text()).slice(0, 200) }, { status: 502 });
    }

    const data = await r.json();
    const suggestions = (data.places || []).map((p: {
      id: string;
      displayName?: { text?: string };
      formattedAddress?: string;
      location?: { latitude?: number; longitude?: number };
      types?: string[];
      rating?: number;
      userRatingCount?: number;
      photos?: { name?: string }[];
      priceLevel?: string;
    }) => ({
      place_id: p.id,
      name: p.displayName?.text || 'Unknown',
      formatted_address: p.formattedAddress || '',
      lat: p.location?.latitude || 0,
      lng: p.location?.longitude || 0,
      types: p.types || [],
      rating: p.rating,
      user_ratings_total: p.userRatingCount,
      photo_url: p.photos?.[0]?.name
        ? `https://places.googleapis.com/v1/${p.photos[0].name}/media?maxHeightPx=400&key=${apiKey}`
        : undefined,
      price_level: typeof p.priceLevel === 'string'
        ? ({ PRICE_LEVEL_FREE: 0, PRICE_LEVEL_INEXPENSIVE: 1, PRICE_LEVEL_MODERATE: 2, PRICE_LEVEL_EXPENSIVE: 3, PRICE_LEVEL_VERY_EXPENSIVE: 4 } as Record<string, number>)[p.priceLevel]
        : undefined
    }));

    return NextResponse.json({ suggestions, count: suggestions.length });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
