import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

// S45 P2: Compute real route legs for a day's items using Google Routes API v2.
// GET  /api/trips/[slug]/itinerary/route-matrix?day_id=NN  → devuelve caché si válido
// POST /api/trips/[slug]/itinerary/route-matrix { day_id }  → fuerza recompute
//
// Cache strategy: hash del "ordered lat/lng list" del día. Si coincide con route_hash,
// devuelve trip_days.route_cache sin llamar Google. Si no, computa y guarda.

interface Leg {
  from_item_id: number;
  to_item_id: number;
  distance_m: number;
  duration_s: number;
  duration_traffic_s: number;
  polyline?: string;
}

function orderHash(items: Array<{ id: number; lat: number | null; lng: number | null }>): string {
  return items
    .filter(i => i.lat != null && i.lng != null)
    .map(i => `${i.id}:${i.lat!.toFixed(5)},${i.lng!.toFixed(5)}`)
    .join('|');
}

async function computeMatrix(items: Array<{ id: number; lat: number; lng: number }>, apiKey: string){
  if(items.length < 2) return { legs: [], total_distance_m: 0, total_duration_s: 0, polyline: '' };
  const origin = items[0];
  const destination = items[items.length - 1];
  const intermediates = items.slice(1, -1);

  const body = {
    origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
    destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
    intermediates: intermediates.map(s => ({ location: { latLng: { latitude: s.lat, longitude: s.lng } } })),
    travelMode: 'DRIVE',
    routingPreference: 'TRAFFIC_AWARE',
    computeAlternativeRoutes: false,
    polylineQuality: 'OVERVIEW',
    languageCode: 'en',
    units: 'METRIC'
  };

  const r = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    method: 'POST',
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs.duration,routes.legs.distanceMeters,routes.legs.polyline.encodedPolyline,routes.legs.staticDuration',
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if(!r.ok) throw new Error(`routes_api_${r.status}`);
  const data = await r.json();
  const route = data.routes?.[0];
  if(!route) throw new Error('no_route_found');

  const legs: Leg[] = (route.legs || []).map((leg: { duration?: string; staticDuration?: string; distanceMeters?: number; polyline?: { encodedPolyline?: string } }, i: number) => ({
    from_item_id: items[i].id,
    to_item_id: items[i + 1].id,
    distance_m: leg.distanceMeters || 0,
    duration_s: parseInt((leg.staticDuration || '0s').replace('s', '')),
    duration_traffic_s: parseInt((leg.duration || '0s').replace('s', '')),
    polyline: leg.polyline?.encodedPolyline
  }));

  return {
    legs,
    total_distance_m: route.distanceMeters || 0,
    total_duration_s: parseInt((route.duration || '0s').replace('s', '')),
    polyline: route.polyline?.encodedPolyline || ''
  };
}

async function getDayItems(sb: ReturnType<typeof createAdminClient>, slug: string, dayId: number){
  const { data } = await sb.from('itinerary_items')
    .select('id, lat, lng, position')
    .eq('trip_slug', slug)
    .eq('trip_day_id', dayId)
    .order('position', { ascending: true });
  return (data || []).filter((i): i is { id: number; lat: number; lng: number; position: number } =>
    i.lat != null && i.lng != null
  );
}

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  const url = new URL(req.url);
  const dayId = Number(url.searchParams.get('day_id'));
  if(!dayId) return NextResponse.json({ error: 'day_id_required' }, { status: 400 });

  const sb = createAdminClient();
  const { data: day } = await sb.from('trip_days').select('route_cache, route_hash').eq('id', dayId).eq('trip_slug', slug).maybeSingle();
  if(!day) return NextResponse.json({ error: 'day_not_found' }, { status: 404 });

  const items = await getDayItems(sb, slug, dayId);
  const hash = orderHash(items);

  if(day.route_hash === hash && day.route_cache){
    return NextResponse.json({ ...(day.route_cache as object), cached: true });
  }
  // Cache miss / stale → force recompute
  return recompute(sb, slug, dayId, items, hash);
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  const body = await req.json();
  const dayId = Number(body.day_id);
  if(!dayId) return NextResponse.json({ error: 'day_id_required' }, { status: 400 });

  const sb = createAdminClient();
  const items = await getDayItems(sb, slug, dayId);
  const hash = orderHash(items);
  return recompute(sb, slug, dayId, items, hash);
}

async function recompute(
  sb: ReturnType<typeof createAdminClient>,
  slug: string,
  dayId: number,
  items: Array<{ id: number; lat: number; lng: number; position: number }>,
  hash: string
){
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if(!apiKey) return NextResponse.json({ error: 'maps_not_configured' }, { status: 500 });

  if(items.length < 2){
    const empty = { legs: [], total_distance_m: 0, total_duration_s: 0, polyline: '' };
    await sb.from('trip_days').update({ route_cache: empty, route_hash: hash, route_updated_at: new Date().toISOString() })
      .eq('id', dayId).eq('trip_slug', slug);
    return NextResponse.json({ ...empty, cached: false, itemsCount: items.length });
  }

  try {
    const result = await computeMatrix(items, apiKey);
    await sb.from('trip_days').update({
      route_cache: result,
      route_hash: hash,
      route_updated_at: new Date().toISOString()
    }).eq('id', dayId).eq('trip_slug', slug);
    return NextResponse.json({ ...result, cached: false, itemsCount: items.length });
  } catch (e) {
    return NextResponse.json({ error: 'compute_failed', detail: (e as Error).message }, { status: 502 });
  }
}
