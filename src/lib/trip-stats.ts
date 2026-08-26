// Trip statistics helpers — total distance, drive time, estimated fuel cost.
// Zero deps, pure functions, fully testable.

export interface StopWithCoords {
  lat?: number;
  lng?: number;
  duration_minutes?: number;  // time spent AT the stop, not driving to it
}

export interface TripStats {
  total_distance_km: number;
  total_distance_miles: number;
  total_drive_time_hours: number;
  total_stop_time_hours: number;
  total_trip_time_hours: number;
  fuel_cost_usd_low: number;
  fuel_cost_usd_high: number;
  fuel_liters: number;
  fuel_gallons: number;
  co2_kg: number;
  segments: number;              // number of drive segments (stops - 1)
  stops_with_coords: number;
}

// Great-circle distance (Haversine) in kilometers.
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius km
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Compute total km summing consecutive stop pairs (skips stops without coords).
 * Uses road-factor 1.3× to approximate actual road distance vs great-circle.
 */
export function computeTotalDistanceKm(stops: StopWithCoords[], roadFactor = 1.3): number {
  let total = 0;
  const coordStops = stops.filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lng)) as Array<Required<Pick<StopWithCoords, 'lat' | 'lng'>>>;
  for (let i = 1; i < coordStops.length; i++) {
    total += haversineKm(coordStops[i - 1].lat, coordStops[i - 1].lng, coordStops[i].lat, coordStops[i].lng);
  }
  return total * roadFactor;
}

/**
 * Estimate drive time in hours from total km at avg_speed_kmh (default 90).
 */
export function estimateDriveHours(totalKm: number, avgSpeedKmh = 90): number {
  if (avgSpeedKmh <= 0) return 0;
  return totalKm / avgSpeedKmh;
}

/**
 * Full stats bundle. Pure function.
 * Defaults:
 *   avg_speed_kmh = 90 (US highway average)
 *   fuel_efficiency_km_per_liter = 12 (typical mid-size sedan; SUV lower, hybrid higher)
 *   fuel_price_usd_per_liter_low = 0.85 (US bulk; $3.20/gal)
 *   fuel_price_usd_per_liter_high = 1.15 (US west coast; $4.35/gal)
 *   co2_kg_per_liter = 2.31 (gasoline combustion factor, EPA)
 */
export function computeTripStats(
  stops: StopWithCoords[],
  opts: {
    avg_speed_kmh?: number;
    fuel_km_per_liter?: number;
    fuel_price_usd_low?: number;
    fuel_price_usd_high?: number;
  } = {}
): TripStats {
  const avg_speed_kmh = opts.avg_speed_kmh ?? 90;
  const fuel_km_per_liter = opts.fuel_km_per_liter ?? 12;
  const fuel_price_usd_low = opts.fuel_price_usd_low ?? 0.85;
  const fuel_price_usd_high = opts.fuel_price_usd_high ?? 1.15;

  const total_distance_km = computeTotalDistanceKm(stops);
  const total_drive_time_hours = estimateDriveHours(total_distance_km, avg_speed_kmh);
  const total_stop_time_hours = stops.reduce((s, x) => s + ((x.duration_minutes || 0) / 60), 0);
  const total_trip_time_hours = total_drive_time_hours + total_stop_time_hours;
  const fuel_liters = fuel_km_per_liter > 0 ? total_distance_km / fuel_km_per_liter : 0;
  const co2_kg = fuel_liters * 2.31;
  const stops_with_coords = stops.filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lng)).length;
  const segments = Math.max(0, stops_with_coords - 1);

  return {
    total_distance_km: round(total_distance_km, 1),
    total_distance_miles: round(total_distance_km * 0.621371, 1),
    total_drive_time_hours: round(total_drive_time_hours, 2),
    total_stop_time_hours: round(total_stop_time_hours, 2),
    total_trip_time_hours: round(total_trip_time_hours, 2),
    fuel_cost_usd_low: round(fuel_liters * fuel_price_usd_low, 2),
    fuel_cost_usd_high: round(fuel_liters * fuel_price_usd_high, 2),
    fuel_liters: round(fuel_liters, 1),
    fuel_gallons: round(fuel_liters * 0.264172, 1),
    co2_kg: round(co2_kg, 1),
    segments,
    stops_with_coords
  };
}

function round(n: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}
