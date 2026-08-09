// S40 P0.2: Trip Validator — constraint engine básico.
// Detecta issues comunes en itinerarios generados por IA o creados por usuarios.
// No inventa datos: si algo no puede validarse, retorna severity=warning con `unverifiable=true`.

import type { TripStop } from './types';

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  severity: ValidationSeverity;
  code: string;
  message: string;
  stopIds?: string[];
  unverifiable?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  score: number; // 0-100, 100 = perfect trip
}

// Distancia Haversine entre 2 puntos (km)
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Valida un array de stops según constraints básicos.
 * Constraints implementados:
 *   1. Coords válidas (-90..90 lat, -180..180 lng, no (0,0))
 *   2. Sin duplicates exactos (mismo place_id o mismo lat+lng)
 *   3. Sin distancias imposibles entre stops consecutivos (>2000 km salto = probable bug AI)
 *   4. Sin stops sin nombre
 *   5. duration_min razonable (>0, <24h)
 *
 * NO detecta aún (P1+):
 *   - Overlap horario (necesita start_time por stop)
 *   - Opening hours (necesita Google Places details)
 *   - Weather closures
 *   - Reservations required
 */
export function validateTrip(stops: TripStop[], daysCount?: number): ValidationResult {
  const issues: ValidationIssue[] = [];

  if(!Array.isArray(stops) || stops.length === 0){
    return { valid: false, issues: [{ severity: 'error', code: 'no_stops', message: 'Trip has no stops' }], score: 0 };
  }

  // 1. Validate each stop
  const seenPlaceIds = new Set<string>();
  const seenCoords = new Set<string>();
  stops.forEach((s, i) => {
    if(!s.name || s.name.trim().length < 2){
      issues.push({ severity: 'error', code: 'invalid_name', message: `Stop #${i + 1} has invalid name`, stopIds: s.id ? [s.id] : undefined });
    }
    if(typeof s.lat !== 'number' || typeof s.lng !== 'number' ||
       s.lat < -90 || s.lat > 90 || s.lng < -180 || s.lng > 180 ||
       (s.lat === 0 && s.lng === 0)){
      issues.push({ severity: 'error', code: 'invalid_coords', message: `Stop "${s.name}" has invalid coordinates (${s.lat},${s.lng})`, stopIds: s.id ? [s.id] : undefined });
    }
    if(typeof s.duration_min === 'number' && (s.duration_min < 0 || s.duration_min > 24 * 60)){
      issues.push({ severity: 'warning', code: 'unusual_duration', message: `Stop "${s.name}" has unusual duration (${s.duration_min} min)`, stopIds: s.id ? [s.id] : undefined });
    }

    // Duplicates
    if(s.place_id){
      if(seenPlaceIds.has(s.place_id)){
        issues.push({ severity: 'warning', code: 'duplicate_place', message: `Stop "${s.name}" duplicates an earlier place_id`, stopIds: s.id ? [s.id] : undefined });
      }
      seenPlaceIds.add(s.place_id);
    }
    const coordKey = `${s.lat?.toFixed(4)},${s.lng?.toFixed(4)}`;
    if(seenCoords.has(coordKey)){
      issues.push({ severity: 'warning', code: 'duplicate_coords', message: `Stop "${s.name}" has same coordinates as another stop`, stopIds: s.id ? [s.id] : undefined });
    }
    seenCoords.add(coordKey);
  });

  // 2. Impossible distances between consecutive stops (>2000 km jump = probable AI hallucination)
  const MAX_JUMP_KM = 2000;
  for(let i = 1; i < stops.length; i++){
    const prev = stops[i - 1];
    const curr = stops[i];
    if(typeof prev.lat === 'number' && typeof curr.lat === 'number'){
      const km = haversineKm(prev.lat, prev.lng, curr.lat, curr.lng);
      if(km > MAX_JUMP_KM){
        issues.push({
          severity: 'warning',
          code: 'huge_jump',
          message: `${Math.round(km)} km jump between "${prev.name}" and "${curr.name}" — verify order or add intermediate stops`,
          stopIds: [prev.id, curr.id].filter(Boolean) as string[]
        });
      }
    }
  }

  // 3. Density check: too many stops per day is unrealistic
  if(daysCount && daysCount > 0){
    const stopsPerDay = stops.length / daysCount;
    if(stopsPerDay > 5){
      issues.push({
        severity: 'info',
        code: 'dense_schedule',
        message: `${stops.length} stops in ${daysCount} days = ${stopsPerDay.toFixed(1)}/day. Consider fewer or longer days.`,
        unverifiable: true
      });
    }
  }

  // Score: base 100, -20 por error, -5 por warning, -1 por info
  const score = Math.max(0, 100 -
    issues.filter(i => i.severity === 'error').length * 20 -
    issues.filter(i => i.severity === 'warning').length * 5 -
    issues.filter(i => i.severity === 'info').length * 1
  );
  const hasErrors = issues.some(i => i.severity === 'error');

  return { valid: !hasErrors, issues, score };
}
