import { describe, it, expect } from 'vitest';
import {
  haversineKm,
  computeTotalDistanceKm,
  estimateDriveHours,
  computeTripStats
} from '@/lib/trip-stats';

describe('haversineKm()', () => {
  it('returns 0 for same point', () => {
    expect(haversineKm(37.7749, -122.4194, 37.7749, -122.4194)).toBe(0);
  });

  it('computes SF → LA distance ~560km (great-circle)', () => {
    // San Francisco to Los Angeles ~ 559 km great-circle
    const d = haversineKm(37.7749, -122.4194, 34.0522, -118.2437);
    expect(d).toBeGreaterThan(550);
    expect(d).toBeLessThan(570);
  });

  it('symmetric — order of coords doesn\'t matter', () => {
    const a = haversineKm(37.7749, -122.4194, 34.0522, -118.2437);
    const b = haversineKm(34.0522, -118.2437, 37.7749, -122.4194);
    expect(a).toBe(b);
  });
});

describe('computeTotalDistanceKm()', () => {
  it('returns 0 for 0 or 1 stops', () => {
    expect(computeTotalDistanceKm([])).toBe(0);
    expect(computeTotalDistanceKm([{ lat: 37, lng: -122 }])).toBe(0);
  });

  it('sums consecutive pairs with road-factor 1.3×', () => {
    const stops = [
      { lat: 37.7749, lng: -122.4194 },  // SF
      { lat: 34.0522, lng: -118.2437 }   // LA
    ];
    // Great-circle ~559 km × 1.3 road factor = ~727 km
    const total = computeTotalDistanceKm(stops);
    expect(total).toBeGreaterThan(720);
    expect(total).toBeLessThan(740);
  });

  it('skips stops without coordinates', () => {
    const stops = [
      { lat: 37.7749, lng: -122.4194 },  // SF
      { lat: undefined, lng: undefined }, // skipped
      { lat: 34.0522, lng: -118.2437 }   // LA
    ];
    const total = computeTotalDistanceKm(stops);
    // Same as SF → LA direct since undefined is filtered
    expect(total).toBeGreaterThan(720);
    expect(total).toBeLessThan(740);
  });

  it('accepts custom road factor', () => {
    const stops = [
      { lat: 37.7749, lng: -122.4194 },
      { lat: 34.0522, lng: -118.2437 }
    ];
    const noFactor = computeTotalDistanceKm(stops, 1);
    const withFactor = computeTotalDistanceKm(stops, 1.5);
    expect(withFactor / noFactor).toBeCloseTo(1.5, 5);
  });
});

describe('estimateDriveHours()', () => {
  it('900km at 90km/h = 10 hours', () => {
    expect(estimateDriveHours(900, 90)).toBe(10);
  });

  it('returns 0 for invalid speed', () => {
    expect(estimateDriveHours(500, 0)).toBe(0);
    expect(estimateDriveHours(500, -10)).toBe(0);
  });
});

describe('computeTripStats()', () => {
  const stops = [
    { lat: 37.7749, lng: -122.4194, duration_minutes: 120 }, // SF (2h stop)
    { lat: 36.6002, lng: -121.8947, duration_minutes: 60 },  // Monterey (1h)
    { lat: 34.0522, lng: -118.2437, duration_minutes: 180 }  // LA (3h)
  ];

  it('computes total_distance_km with road factor applied', () => {
    const stats = computeTripStats(stops);
    expect(stats.total_distance_km).toBeGreaterThan(500);
    expect(stats.total_distance_km).toBeLessThan(1000);
  });

  it('computes miles from km correctly', () => {
    const stats = computeTripStats(stops);
    expect(stats.total_distance_miles).toBeCloseTo(stats.total_distance_km * 0.621371, 1);
  });

  it('sums stop time (duration_minutes / 60)', () => {
    const stats = computeTripStats(stops);
    // 120 + 60 + 180 = 360 min = 6 hours
    expect(stats.total_stop_time_hours).toBe(6);
  });

  it('total_trip_time = drive + stop', () => {
    const stats = computeTripStats(stops);
    expect(stats.total_trip_time_hours).toBeCloseTo(stats.total_drive_time_hours + stats.total_stop_time_hours, 2);
  });

  it('fuel cost low ≤ high', () => {
    const stats = computeTripStats(stops);
    expect(stats.fuel_cost_usd_low).toBeGreaterThan(0);
    expect(stats.fuel_cost_usd_low).toBeLessThanOrEqual(stats.fuel_cost_usd_high);
  });

  it('segments = stops_with_coords - 1', () => {
    const stats = computeTripStats(stops);
    expect(stats.segments).toBe(2);
    expect(stats.stops_with_coords).toBe(3);
  });

  it('CO2 correlates with fuel_liters at ~2.31 kg/L', () => {
    const stats = computeTripStats(stops);
    // Both values are rounded independently, so ±0.5 kg tolerance is expected
    expect(stats.co2_kg).toBeCloseTo(stats.fuel_liters * 2.31, 0);
  });

  it('respects custom fuel efficiency', () => {
    const gasCar = computeTripStats(stops, { fuel_km_per_liter: 10 });
    const hybrid = computeTripStats(stops, { fuel_km_per_liter: 20 });
    expect(hybrid.fuel_liters).toBeLessThan(gasCar.fuel_liters);
    expect(hybrid.co2_kg).toBeLessThan(gasCar.co2_kg);
  });

  it('handles empty stops gracefully', () => {
    const stats = computeTripStats([]);
    expect(stats.total_distance_km).toBe(0);
    expect(stats.fuel_liters).toBe(0);
    expect(stats.segments).toBe(0);
  });
});
