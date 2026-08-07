import { NextResponse } from 'next/server';
import type { PlaceSuggestion } from '@/lib/types';

export const runtime = 'edge';

// Places API (New) - Text Search
// Docs: https://developers.google.com/maps/documentation/places/web-service/text-search
export async function POST(req: Request){
  try {
    const { query, locationBias } = await req.json();
    if(!query || typeof query !== 'string' || query.length < 2){
      return NextResponse.json({ error: 'query_required' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if(!apiKey) return NextResponse.json({ error: 'maps_not_configured' }, { status: 500 });

    const body: Record<string, unknown> = {
      textQuery: query,
      maxResultCount: 8,
      languageCode: 'en'
    };
    // Bias California default (mientras el MVP es US-CA-focused)
    if(!locationBias){
      body.locationBias = {
        rectangle: {
          low:  { latitude: 32.5, longitude: -124.5 },  // SW California
          high: { latitude: 42.0, longitude: -114.0 }   // NE California
        }
      };
    } else if(typeof locationBias === 'object'){
      body.locationBias = locationBias;
    }

    const r = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.types,places.primaryTypeDisplayName,places.photos',
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if(!r.ok){
      const text = await r.text();
      return NextResponse.json({ error: 'places_api_error', status: r.status, body: text.slice(0, 200) }, { status: 502 });
    }

    const data = await r.json();
    const suggestions: PlaceSuggestion[] = (data.places || []).map((p: any) => ({
      place_id: p.id,
      name: p.displayName?.text || 'Unknown',
      formatted_address: p.formattedAddress || '',
      lat: p.location?.latitude || 0,
      lng: p.location?.longitude || 0,
      types: p.types || [],
      photo_url: p.photos?.[0]?.name
        ? `https://places.googleapis.com/v1/${p.photos[0].name}/media?maxHeightPx=400&key=${apiKey}`
        : undefined
    }));

    return NextResponse.json({ suggestions });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
