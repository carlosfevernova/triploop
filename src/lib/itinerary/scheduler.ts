// S45 P3.2 + P3.3: pure scheduling/optimization functions (testable, no DB/side-effects).

import type { ItineraryItem } from './types';
import { haversineKm } from './validate';
import { parseTimeToMin, formatMinToHHMM } from './time';

const DEFAULT_DURATION_MIN = 90;
const DEFAULT_START_MIN = 9 * 60; // 09:00
const DAY_END_MIN = 22 * 60;      // 22:00
const MIN_BUFFER_MIN = 10;         // buffer entre actividades

// Estimate travel time between two items (min). Simple heurística por distance.
export function estimateTravelMin(a: { lat: number | null; lng: number | null }, b: { lat: number | null; lng: number | null }): number {
  if(a.lat == null || a.lng == null || b.lat == null || b.lng == null) return 0;
  const km = haversineKm({ lat: a.lat, lng: a.lng }, { lat: b.lat, lng: b.lng });
  if(km < 0.5) return Math.round(km * 15);        // walking-ish
  if(km < 5) return Math.round(km * 5);            // urbano 12 km/h
  return Math.round(km * 1.5);                     // 40 km/h
}

// SCHEDULE MY DAY: asigna start_local a items sin hora, respetando fixed y opening (si vienen precomputados en item).
// Retorna array de { id, start_local } cambios.
export function scheduleDay(items: ItineraryItem[], opts?: { startMin?: number }): Array<{ id: number; start_local: string }> {
  const startMin = opts?.startMin ?? DEFAULT_START_MIN;
  const sorted = [...items].sort((a, b) => a.position - b.position);
  if(sorted.length === 0) return [];

  const changes: Array<{ id: number; start_local: string }> = [];
  let currentMin = startMin;

  for(let i = 0; i < sorted.length; i++){
    const item = sorted[i];

    if(item.fixed && item.start_local){
      // Fixed: force our cursor to this time (no override)
      currentMin = Math.max(currentMin, parseTimeToMin(item.start_local) || currentMin);
    } else if(!item.start_local){
      // Not scheduled → assign current cursor time
      if(currentMin > DAY_END_MIN) break; // stop if we're past end-of-day
      changes.push({ id: item.id, start_local: formatMinToHHMM(currentMin) });
    } else {
      // Has time but not fixed → respect it, sync cursor
      currentMin = Math.max(currentMin, parseTimeToMin(item.start_local) || currentMin);
    }

    // Advance cursor by duration + travel to next
    currentMin += (item.duration_min || DEFAULT_DURATION_MIN);
    if(i < sorted.length - 1){
      currentMin += estimateTravelMin(item, sorted[i + 1]);
      currentMin += MIN_BUFFER_MIN;
    }
  }
  return changes;
}

// OPTIMIZE DAY: reordena items no-fixed usando nearest-neighbor para minimizar travel.
// Fixed items mantienen su relative position (anchor points).
// Retorna array de { id, position } con nuevas posiciones (100/200/300…).
export function optimizeDay(items: ItineraryItem[]): Array<{ id: number; position: number }> {
  const withCoords = items.filter(i => i.lat != null && i.lng != null);
  if(withCoords.length < 3) return []; // nada que optimizar

  const sorted = [...withCoords].sort((a, b) => a.position - b.position);

  // Detect fixed anchors — items en posiciones que no se deben mover
  const fixedIdxs = sorted.map((i, idx) => (i.fixed || i.priority === 'must') ? idx : -1).filter(idx => idx >= 0);

  // Simple case: sin fixed → nearest-neighbor greedy desde primer item
  if(fixedIdxs.length === 0){
    const result = greedyNearestNeighbor(sorted);
    return result.map((i, idx) => ({ id: i.id, position: (idx + 1) * 100 }));
  }

  // Con fixed: dividir en segmentos entre fixed points y optimizar cada uno
  const result: ItineraryItem[] = [];
  let prevFixed = -1;
  for(const fIdx of fixedIdxs){
    // Optimize segmento [prevFixed+1, fIdx-1] anchored a sorted[fIdx]
    const segment = sorted.slice(prevFixed + 1, fIdx);
    if(prevFixed >= 0) result.push(sorted[prevFixed]); // push anchor previo
    if(segment.length > 0){
      const anchor = prevFixed >= 0 ? sorted[prevFixed] : segment[0];
      const optimized = greedyNearestNeighborFrom(segment, anchor);
      result.push(...optimized);
    }
    prevFixed = fIdx;
  }
  // Últimos elementos después del último fixed
  const tail = sorted.slice(prevFixed + 1);
  result.push(sorted[prevFixed]);
  if(tail.length > 0){
    const optimized = greedyNearestNeighborFrom(tail, sorted[prevFixed]);
    result.push(...optimized);
  }

  return result.map((i, idx) => ({ id: i.id, position: (idx + 1) * 100 }));
}

function greedyNearestNeighbor(items: ItineraryItem[]): ItineraryItem[] {
  if(items.length <= 1) return items;
  const remaining = [...items];
  const result: ItineraryItem[] = [remaining.shift()!];
  while(remaining.length > 0){
    const last = result[result.length - 1];
    let bestIdx = 0;
    let bestDist = Infinity;
    for(let i = 0; i < remaining.length; i++){
      const d = haversineKm({ lat: last.lat!, lng: last.lng! }, { lat: remaining[i].lat!, lng: remaining[i].lng! });
      if(d < bestDist){ bestDist = d; bestIdx = i; }
    }
    result.push(remaining.splice(bestIdx, 1)[0]);
  }
  return result;
}

function greedyNearestNeighborFrom(items: ItineraryItem[], anchor: ItineraryItem): ItineraryItem[] {
  if(items.length <= 1 || anchor.lat == null || anchor.lng == null) return items;
  const remaining = [...items];
  const result: ItineraryItem[] = [];
  let cursor: { lat: number; lng: number } = { lat: anchor.lat, lng: anchor.lng };
  while(remaining.length > 0){
    let bestIdx = 0;
    let bestDist = Infinity;
    for(let i = 0; i < remaining.length; i++){
      if(remaining[i].lat == null || remaining[i].lng == null) continue;
      const d = haversineKm(cursor, { lat: remaining[i].lat!, lng: remaining[i].lng! });
      if(d < bestDist){ bestDist = d; bestIdx = i; }
    }
    const next = remaining.splice(bestIdx, 1)[0];
    result.push(next);
    if(next.lat != null && next.lng != null) cursor = { lat: next.lat, lng: next.lng };
  }
  return result;
}
