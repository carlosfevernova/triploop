import { NextResponse } from 'next/server';
import type { TripStop } from '@/lib/types';
import { haversineKm } from '@/lib/itinerary/validate';

export const runtime = 'edge';

// S55: TSP nearest-neighbor sobre stops del trip clásico.
// Preserva origin (index 0) y destination (index N-1) — típicamente hotel/starting point/return.
// Middle stops se reordenan minimizando distancia total.
// POST { stops: TripStop[], preserve_endpoints?: boolean (default true) }
// → { stops: reordered, before_km, after_km, saved_km, saved_pct }

function totalKm(stops: TripStop[]): number {
  let total = 0;
  for(let i = 1; i < stops.length; i++){
    total += haversineKm(stops[i - 1], stops[i]);
  }
  return total;
}

function nearestNeighborFrom(remaining: TripStop[], anchor: { lat: number; lng: number }): TripStop[] {
  const arr = [...remaining];
  const result: TripStop[] = [];
  let cursor = { lat: anchor.lat, lng: anchor.lng };
  while(arr.length > 0){
    let bestIdx = 0;
    let bestDist = Infinity;
    for(let i = 0; i < arr.length; i++){
      const d = haversineKm(cursor, arr[i]);
      if(d < bestDist){ bestDist = d; bestIdx = i; }
    }
    const next = arr.splice(bestIdx, 1)[0];
    result.push(next);
    cursor = { lat: next.lat, lng: next.lng };
  }
  return result;
}

export async function POST(req: Request){
  try {
    const body = await req.json();
    const stops: TripStop[] = Array.isArray(body.stops) ? body.stops : [];
    const preserveEndpoints = body.preserve_endpoints !== false;
    if(stops.length < 4){
      return NextResponse.json({ error: 'need_min_4_stops', got: stops.length }, { status: 400 });
    }

    const beforeKm = totalKm(stops);

    let optimized: TripStop[];
    if(preserveEndpoints){
      const origin = stops[0];
      const destination = stops[stops.length - 1];
      const middle = stops.slice(1, -1);
      // nearest-neighbor desde origin, luego pega destination al final
      const reorderedMiddle = nearestNeighborFrom(middle, origin);
      // Ahora intenta también minimizar el hop final: si destination está lejos del último middle,
      // buscamos si conviene invertir el orden (simple 2-opt lite)
      const orderA = [origin, ...reorderedMiddle, destination];
      const orderB = [origin, ...reorderedMiddle.slice().reverse(), destination];
      optimized = totalKm(orderA) <= totalKm(orderB) ? orderA : orderB;
    } else {
      // Sin restricción — nearest-neighbor desde primer stop
      optimized = [stops[0], ...nearestNeighborFrom(stops.slice(1), stops[0])];
    }

    const afterKm = totalKm(optimized);
    const savedKm = Math.max(0, beforeKm - afterKm);
    const savedPct = beforeKm > 0 ? Math.round((savedKm / beforeKm) * 100) : 0;
    const changed = stops.map(s => s.id).join('|') !== optimized.map(s => s.id).join('|');

    return NextResponse.json({
      stops: optimized,
      before_km: beforeKm,
      after_km: afterKm,
      saved_km: savedKm,
      saved_pct: savedPct,
      changed,
      preserved_endpoints: preserveEndpoints
    });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
