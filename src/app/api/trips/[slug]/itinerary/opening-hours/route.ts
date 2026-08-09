import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

// S45 P3.1: Fetch opening hours for an itinerary item via Google Places details.
// POST { item_id } → llama Places details con place_id, guarda en itinerary_items.opening_hours
// Cache soft: si opening_hours_updated_at < 30 días, no re-llama.

interface PlacesDetails {
  regularOpeningHours?: {
    periods?: Array<{
      open?: { day: number; hour: number; minute: number };
      close?: { day: number; hour: number; minute: number };
    }>;
    weekdayDescriptions?: string[];
  };
  currentOpeningHours?: {
    periods?: Array<{ open?: { day: number; hour: number; minute: number }; close?: { day: number; hour: number; minute: number } }>;
    weekdayDescriptions?: string[];
  };
}

async function fetchPlaceDetails(placeId: string, apiKey: string): Promise<PlacesDetails | null> {
  const r = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
    method: 'GET',
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'regularOpeningHours,currentOpeningHours'
    }
  });
  if(!r.ok) return null;
  return await r.json();
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  try {
    const body = await req.json();
    const itemId = Number(body.item_id);
    if(!itemId) return NextResponse.json({ error: 'item_id_required' }, { status: 400 });

    const sb = createAdminClient();
    const { data: item } = await sb.from('itinerary_items')
      .select('id, place_id, opening_hours, opening_hours_updated_at')
      .eq('id', itemId).eq('trip_slug', slug).maybeSingle();
    if(!item) return NextResponse.json({ error: 'item_not_found' }, { status: 404 });
    if(!item.place_id) return NextResponse.json({ error: 'no_place_id' }, { status: 400 });

    // Soft cache: 30 días
    if(item.opening_hours && item.opening_hours_updated_at){
      const age = Date.now() - new Date(item.opening_hours_updated_at).getTime();
      if(age < 30 * 24 * 60 * 60 * 1000){
        return NextResponse.json({ opening_hours: item.opening_hours, cached: true });
      }
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if(!apiKey) return NextResponse.json({ error: 'maps_not_configured' }, { status: 500 });

    const details = await fetchPlaceDetails(item.place_id, apiKey);
    const hours = details?.regularOpeningHours || details?.currentOpeningHours || null;

    if(hours){
      await sb.from('itinerary_items').update({
        opening_hours: hours,
        opening_hours_updated_at: new Date().toISOString()
      }).eq('id', itemId).eq('trip_slug', slug);
    }

    return NextResponse.json({ opening_hours: hours, cached: false });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
