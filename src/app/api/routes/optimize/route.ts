import { NextResponse } from 'next/server';
import type { RouteLeg, TripStop } from '@/lib/types';

export const runtime = 'edge';

// Google Routes API v2 — computeRoutes
// Devuelve legs entre stops (en el orden dado) con distance + duration + traffic + polyline
// Docs: https://developers.google.com/maps/documentation/routes/compute_route_directions
export async function POST(req: Request){
  try {
    const { stops }: { stops: TripStop[] } = await req.json();
    if(!Array.isArray(stops) || stops.length < 2){
      return NextResponse.json({ error: 'need_min_2_stops' }, { status: 400 });
    }
    if(stops.length > 25){
      return NextResponse.json({ error: 'max_25_stops', got: stops.length }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if(!apiKey) return NextResponse.json({ error: 'maps_not_configured' }, { status: 500 });

    const origin = stops[0];
    const destination = stops[stops.length - 1];
    const intermediates = stops.slice(1, -1);

    const body = {
      origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
      destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
      intermediates: intermediates.map(s => ({
        location: { latLng: { latitude: s.lat, longitude: s.lng } }
      })),
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

    if(!r.ok){
      const text = await r.text();
      return NextResponse.json({ error: 'routes_api_error', status: r.status, body: text.slice(0, 300) }, { status: 502 });
    }

    const data = await r.json();
    const route = data.routes?.[0];
    if(!route) return NextResponse.json({ error: 'no_route_found' }, { status: 404 });

    const legs: RouteLeg[] = (route.legs || []).map((leg: any, i: number) => ({
      from_stop_id: stops[i].id,
      to_stop_id: stops[i + 1].id,
      distance_m: leg.distanceMeters || 0,
      duration_s: parseInt((leg.staticDuration || '0s').replace('s', '')),
      duration_traffic_s: parseInt((leg.duration || '0s').replace('s', '')),
      polyline: leg.polyline?.encodedPolyline
    }));

    const total_distance_m = route.distanceMeters || 0;
    const total_duration_s = parseInt((route.duration || '0s').replace('s', ''));

    return NextResponse.json({
      legs,
      total_distance_m,
      total_duration_s,
      polyline: route.polyline?.encodedPolyline
    });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
