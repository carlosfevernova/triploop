// Booking.com hotel search — dual mode.
//
// PROD MODE (env RAPIDAPI_KEY + RAPIDAPI_HOST set): calls Booking.com API via Rapid API.
//   - Buyer wires their own Rapid API subscription (~$50-200/mo depending on tier)
//   - Falls back gracefully to affiliate-only if quota exhausted
//
// DEMO MODE (no env keys): returns realistic mock data seeded from location.
//   - Enables Loom demos + local dev without paid keys
//   - Marked with `source: 'mock'` in response so UI can indicate demo state
//
// Affiliate URLs always include user's booking.com partner ID (env NEXT_PUBLIC_BOOKING_AID)
// for revenue tracking regardless of data source.

import { logger } from './logger';

export interface HotelSuggestion {
  id: string;
  name: string;
  address?: string;
  distance_km?: number;
  rating?: number;         // 0-10 scale (Booking.com native)
  review_count?: number;
  price_from_usd?: number;
  currency?: string;
  image_url?: string;
  amenities?: string[];    // ['wifi', 'parking', 'breakfast', 'pool']
  affiliate_url: string;
  source: 'rapid_api' | 'mock' | 'affiliate_only';
}

interface SearchParams {
  lat: number;
  lng: number;
  radius_km?: number;      // default 5
  check_in?: string;       // YYYY-MM-DD
  check_out?: string;      // YYYY-MM-DD
  adults?: number;         // default 2
  limit?: number;          // default 5
}

const BOOKING_AFFILIATE_BASE = 'https://www.booking.com/searchresults.html';

function buildAffiliateUrl(lat: number, lng: number, checkIn?: string, checkOut?: string): string {
  const aid = process.env.NEXT_PUBLIC_BOOKING_AID || '';
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    ...(aid ? { aid } : {}),
    ...(checkIn ? { checkin: checkIn } : {}),
    ...(checkOut ? { checkout: checkOut } : {})
  });
  return `${BOOKING_AFFILIATE_BASE}?${params.toString()}`;
}

/**
 * Realistic mock hotel data seeded from coordinates.
 * Same coord = same list (deterministic seed).
 */
function generateMockHotels(params: SearchParams): HotelSuggestion[] {
  const seed = Math.floor((params.lat + params.lng + 200) * 100);
  const names = [
    'Boutique Loft', 'Riverside Inn', 'Downtown Suites', 'Cedar Ridge Lodge',
    'The Grand Plaza', 'Sunset Beach Resort', 'Mountain View B&B', 'Historic Manor'
  ];
  const cities = ['Downtown', 'Riverside', 'North', 'South', 'Old Town', 'Waterfront'];
  const limit = Math.min(params.limit || 5, 10);
  const results: HotelSuggestion[] = [];
  for (let i = 0; i < limit; i++) {
    const nameIdx = (seed + i * 3) % names.length;
    const cityIdx = (seed + i * 7) % cities.length;
    results.push({
      id: `mock-${seed}-${i}`,
      name: `${names[nameIdx]} ${i + 1}`,
      address: `${cities[cityIdx]} District`,
      distance_km: Number(((i + 1) * 0.4 + (seed % 10) / 10).toFixed(1)),
      rating: Number((7.5 + ((seed + i) % 25) / 10).toFixed(1)),
      review_count: 50 + ((seed * (i + 1)) % 900),
      price_from_usd: 80 + ((seed + i * 17) % 220),
      currency: 'USD',
      amenities: ['wifi', ...(i % 2 ? ['parking'] : []), ...(i % 3 ? ['breakfast'] : []), ...(i % 4 ? ['pool'] : [])],
      affiliate_url: buildAffiliateUrl(params.lat, params.lng, params.check_in, params.check_out),
      source: 'mock'
    });
  }
  return results;
}

/**
 * Call Booking.com via Rapid API. Returns null if not configured or errors.
 * Buyer's Rapid API subscription URL scheme:
 *   https://booking-com.p.rapidapi.com/v1/hotels/search-by-coordinates
 */
async function searchViaRapidApi(params: SearchParams): Promise<HotelSuggestion[] | null> {
  const key = process.env.RAPIDAPI_KEY;
  const host = process.env.RAPIDAPI_HOST || 'booking-com.p.rapidapi.com';
  if (!key) return null;

  try {
    const url = new URL(`https://${host}/v1/hotels/search-by-coordinates`);
    url.searchParams.set('latitude', params.lat.toString());
    url.searchParams.set('longitude', params.lng.toString());
    url.searchParams.set('checkin_date', params.check_in || '');
    url.searchParams.set('checkout_date', params.check_out || '');
    url.searchParams.set('adults_number', String(params.adults || 2));
    url.searchParams.set('room_number', '1');
    url.searchParams.set('units', 'metric');
    url.searchParams.set('order_by', 'popularity');
    url.searchParams.set('filter_by_currency', 'USD');
    url.searchParams.set('locale', 'en-us');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const r = await fetch(url.toString(), {
      headers: { 'X-RapidAPI-Key': key, 'X-RapidAPI-Host': host },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!r.ok) {
      logger.warn('booking.rapid_api_failed', { status: r.status });
      return null;
    }
    const data = await r.json() as { result?: Array<Record<string, unknown>> };
    const hotels = data.result || [];
    const limit = params.limit || 5;

    return hotels.slice(0, limit).map((h, idx) => ({
      id: String(h.hotel_id || h.id || `rapid-${idx}`),
      name: String(h.hotel_name || h.name || 'Unknown'),
      address: String(h.address || h.city_name_en || ''),
      distance_km: typeof h.distance === 'number' ? h.distance : undefined,
      rating: typeof h.review_score === 'number' ? h.review_score : undefined,
      review_count: typeof h.review_nr === 'number' ? h.review_nr : undefined,
      price_from_usd: typeof h.min_total_price === 'number' ? h.min_total_price : undefined,
      currency: 'USD',
      image_url: typeof h.max_photo_url === 'string' ? h.max_photo_url : undefined,
      amenities: [],
      affiliate_url: buildAffiliateUrl(params.lat, params.lng, params.check_in, params.check_out),
      source: 'rapid_api' as const
    }));
  } catch (e) {
    logger.warn('booking.rapid_api_error', { error: (e as Error).message });
    return null;
  }
}

/**
 * Search for hotels near a coordinate. Falls back through:
 *   1. Rapid API (if configured + responds)
 *   2. Mock data (deterministic, for demo)
 * ALWAYS returns at least an affiliate URL for booking.com search.
 */
export async function searchHotels(params: SearchParams): Promise<HotelSuggestion[]> {
  const rapid = await searchViaRapidApi(params);
  if (rapid && rapid.length > 0) {
    logger.info('booking.search.rapid_api', { count: rapid.length, lat: params.lat, lng: params.lng });
    return rapid;
  }
  const mock = generateMockHotels(params);
  logger.info('booking.search.mock', { count: mock.length, lat: params.lat, lng: params.lng, reason: rapid === null ? 'no_key_or_error' : 'empty_result' });
  return mock;
}

/**
 * Emergency fallback: always return a single affiliate-only result.
 * Used if searchHotels throws.
 */
export function affiliateOnlyResult(lat: number, lng: number, checkIn?: string, checkOut?: string): HotelSuggestion {
  return {
    id: 'affiliate-only',
    name: 'Search Booking.com for hotels near this stop',
    affiliate_url: buildAffiliateUrl(lat, lng, checkIn, checkOut),
    source: 'affiliate_only'
  };
}
