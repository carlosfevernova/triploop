import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { searchHotels, affiliateOnlyResult } from '@/lib/booking-search';

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  // Force mock mode by clearing any Rapid API key
  delete process.env.RAPIDAPI_KEY;
  delete process.env.RAPIDAPI_HOST;
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe('searchHotels() — mock mode (no RAPIDAPI_KEY)', () => {
  it('returns non-empty mock list with correct source', async () => {
    const results = await searchHotels({ lat: 37.7749, lng: -122.4194, limit: 5 });
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(5);
    results.forEach((r) => expect(r.source).toBe('mock'));
  });

  it('is deterministic — same coordinates return same mock results', async () => {
    const a = await searchHotels({ lat: 37.7749, lng: -122.4194, limit: 5 });
    const b = await searchHotels({ lat: 37.7749, lng: -122.4194, limit: 5 });
    expect(a.map((h) => h.id)).toEqual(b.map((h) => h.id));
  });

  it('respects limit param', async () => {
    const r1 = await searchHotels({ lat: 40, lng: -75, limit: 1 });
    const r5 = await searchHotels({ lat: 40, lng: -75, limit: 5 });
    expect(r1.length).toBe(1);
    expect(r5.length).toBe(5);
  });

  it('all results include valid affiliate URL', async () => {
    const results = await searchHotels({ lat: 37.7749, lng: -122.4194, limit: 3 });
    for (const r of results) {
      expect(r.affiliate_url).toMatch(/^https:\/\/www\.booking\.com\/searchresults\.html\?/);
      expect(r.affiliate_url).toContain('latitude=37.7749');
    }
  });

  it('mock hotels have realistic rating range 7.5-10.0', async () => {
    const results = await searchHotels({ lat: 34.0522, lng: -118.2437, limit: 8 });
    for (const r of results) {
      expect(r.rating).toBeGreaterThanOrEqual(7.5);
      expect(r.rating).toBeLessThanOrEqual(10.0);
    }
  });

  it('mock hotels have prices in reasonable USD range', async () => {
    const results = await searchHotels({ lat: 34.0522, lng: -118.2437, limit: 5 });
    for (const r of results) {
      expect(r.price_from_usd).toBeGreaterThanOrEqual(80);
      expect(r.price_from_usd).toBeLessThan(400);
      expect(r.currency).toBe('USD');
    }
  });

  it('includes check_in/check_out in affiliate URL when provided', async () => {
    const results = await searchHotels({
      lat: 37.7749,
      lng: -122.4194,
      check_in: '2026-09-15',
      check_out: '2026-09-17',
      limit: 1
    });
    expect(results[0].affiliate_url).toContain('checkin=2026-09-15');
    expect(results[0].affiliate_url).toContain('checkout=2026-09-17');
  });
});

describe('affiliateOnlyResult()', () => {
  it('returns a valid affiliate-only fallback result', () => {
    const r = affiliateOnlyResult(37.7749, -122.4194);
    expect(r.source).toBe('affiliate_only');
    expect(r.name).toContain('Booking.com');
    expect(r.affiliate_url).toMatch(/^https:\/\/www\.booking\.com/);
  });

  it('includes check_in in URL if provided', () => {
    const r = affiliateOnlyResult(37.7, -122.4, '2026-09-15', '2026-09-17');
    expect(r.affiliate_url).toContain('checkin=2026-09-15');
    expect(r.affiliate_url).toContain('checkout=2026-09-17');
  });
});
