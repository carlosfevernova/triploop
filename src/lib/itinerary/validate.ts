// S44: validateDay — detecta overlaps, travel conflicts, densidad, distancia entre items
// Devuelve warnings sin bloquear (usuario decide).

import type { ItineraryItem, DayWarning } from './types';
import { parseTimeToMin } from './time';

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const lat1 = a.lat * Math.PI / 180, lat2 = b.lat * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

// Heurística velocidad: 40 km/h promedio driving urbano
function estimateTravelMin(km: number): number {
  if(km < 0.5) return Math.round(km * 15);           // walking-ish
  if(km < 5) return Math.round(km * 5);               // 12 km/h urbano
  return Math.round(km * 1.5);                         // 40 km/h
}

export function validateDay(items: ItineraryItem[]): DayWarning[] {
  const warnings: DayWarning[] = [];
  const scheduled = items
    .filter(i => i.start_local !== null)
    .map(i => ({ ...i, _startMin: parseTimeToMin(i.start_local)!, _endMin: parseTimeToMin(i.start_local)! + (i.duration_min || 60) }))
    .sort((a, b) => a._startMin - b._startMin);

  // 1) Overlaps
  for(let i = 1; i < scheduled.length; i++){
    const prev = scheduled[i - 1];
    const curr = scheduled[i];
    if(curr._startMin < prev._endMin){
      warnings.push({
        kind: 'overlap',
        severity: 'warning',
        message: `${prev.title} y ${curr.title} se traslapan`,
        itemIds: [prev.id, curr.id]
      });
    }
  }

  // 2) Travel conflicts + huge jumps
  for(let i = 1; i < scheduled.length; i++){
    const prev = scheduled[i - 1];
    const curr = scheduled[i];
    if(prev.lat && prev.lng && curr.lat && curr.lng){
      const km = haversineKm({ lat: prev.lat, lng: prev.lng }, { lat: curr.lat, lng: curr.lng });
      const travelMin = estimateTravelMin(km);
      const gapMin = curr._startMin - prev._endMin;
      if(gapMin > 0 && gapMin < travelMin){
        warnings.push({
          kind: 'travel_conflict',
          severity: 'warning',
          message: `Necesitas ~${travelMin} min para llegar de ${prev.title} a ${curr.title}, pero solo tienes ${gapMin} min`,
          itemIds: [prev.id, curr.id]
        });
      }
      if(km > 300){
        warnings.push({
          kind: 'huge_jump',
          severity: 'info',
          message: `Salto de ${Math.round(km)} km entre ${prev.title} y ${curr.title}`,
          itemIds: [prev.id, curr.id]
        });
      }
    }
  }

  // 3) Density: >8 items scheduled en un día
  if(scheduled.length > 8){
    warnings.push({
      kind: 'dense',
      severity: 'info',
      message: `${scheduled.length} actividades en un solo día — considera partir en dos`,
      itemIds: scheduled.map(s => s.id)
    });
  }

  return warnings;
}

// Duración total (min) considerando actividad + tiempo de traslado estimado
export function computeDayTotals(items: ItineraryItem[]): { activityMin: number; travelMin: number; travelKm: number } {
  let activityMin = 0;
  let travelMin = 0;
  let travelKm = 0;
  const sorted = [...items].sort((a, b) => a.position - b.position);
  for(let i = 0; i < sorted.length; i++){
    activityMin += sorted[i].duration_min || 0;
    if(i > 0){
      const prev = sorted[i - 1];
      const curr = sorted[i];
      if(prev.lat && prev.lng && curr.lat && curr.lng){
        const km = haversineKm({ lat: prev.lat, lng: prev.lng }, { lat: curr.lat, lng: curr.lng });
        travelKm += km;
        travelMin += estimateTravelMin(km);
      }
    }
  }
  return { activityMin, travelMin, travelKm };
}
