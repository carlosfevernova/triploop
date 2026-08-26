import { NextResponse } from 'next/server';
import { searchHotels, affiliateOnlyResult } from '@/lib/booking-search';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 15;

/**
 * GET /api/booking/search?lat=37.8&lng=-122.4&check_in=2026-09-15&check_out=2026-09-17&adults=2&limit=5
 * Returns hotel suggestions near coordinates with affiliate URL.
 *
 * In demo mode (no RAPIDAPI_KEY set): returns realistic mock data with source='mock'.
 * In prod mode: proxies to Booking.com via Rapid API.
 * Always includes affiliate URL with NEXT_PUBLIC_BOOKING_AID for revenue tracking.
 */
export async function GET(request: Request){
  const url = new URL(request.url);
  const lat = parseFloat(url.searchParams.get('lat') || '');
  const lng = parseFloat(url.searchParams.get('lng') || '');

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: 'invalid_coordinates', hint: 'lat + lng required, must be numbers' }, { status: 400 });
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json({ error: 'coordinates_out_of_range' }, { status: 400 });
  }

  const check_in = url.searchParams.get('check_in') || undefined;
  const check_out = url.searchParams.get('check_out') || undefined;
  const adults = Math.max(1, Math.min(10, parseInt(url.searchParams.get('adults') || '2', 10)));
  const limit = Math.max(1, Math.min(10, parseInt(url.searchParams.get('limit') || '5', 10)));
  const radius_km = Math.max(1, Math.min(20, parseInt(url.searchParams.get('radius_km') || '5', 10)));

  try {
    const results = await searchHotels({ lat, lng, check_in, check_out, adults, limit, radius_km });
    return NextResponse.json({
      results,
      count: results.length,
      source: results[0]?.source || 'affiliate_only',
      demo_mode: results[0]?.source === 'mock'
    }, {
      headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600' }
    });
  } catch (e) {
    logger.error('booking.search.failed', { error: (e as Error).message, lat, lng });
    return NextResponse.json({
      results: [affiliateOnlyResult(lat, lng, check_in, check_out)],
      count: 1,
      source: 'affiliate_only',
      demo_mode: false,
      note: 'search backend failed, returning affiliate fallback'
    }, { status: 200 });
  }
}
