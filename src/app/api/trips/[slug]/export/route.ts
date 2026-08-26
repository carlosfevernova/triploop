import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { buildIcs, buildWalletPassPayload, type TripExport, type TripStopExport } from '@/lib/trip-export';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface TripRow {
  slug: string;
  title: string;
  description?: string | null;
  start_date?: string | null;
  stops?: TripStopExport[] | null;
  is_public?: boolean | null;
  owner_id?: string | null;
}

async function loadTrip(slug: string): Promise<TripRow | null> {
  try {
    const sb = createAdminClient();
    const { data, error } = await sb
      .from('trips')
      .select('slug,title,description,start_date,stops,is_public,owner_id')
      .eq('slug', slug)
      .maybeSingle();
    if (error || !data) return null;
    return data as TripRow;
  } catch (e) {
    logger.warn('trip.export.load_failed', { slug, error: (e as Error).message });
    return null;
  }
}

function stopsToExport(raw: unknown): TripStopExport[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((s, idx) => {
    const stop = s as Record<string, unknown>;
    return {
      name: String(stop.name || `Stop ${idx + 1}`),
      lat: typeof stop.lat === 'number' ? stop.lat : undefined,
      lng: typeof stop.lng === 'number' ? stop.lng : undefined,
      address: typeof stop.address === 'string' ? stop.address : undefined,
      day: typeof stop.day === 'number' ? stop.day : undefined,
      arrival_hh_mm: typeof stop.arrival_hh_mm === 'string' ? stop.arrival_hh_mm : (typeof stop.time === 'string' ? stop.time : undefined),
      duration_minutes: typeof stop.duration_minutes === 'number' ? stop.duration_minutes : undefined,
      notes: typeof stop.notes === 'string' ? stop.notes : (typeof stop.description === 'string' ? stop.description : undefined),
      url: typeof stop.url === 'string' ? stop.url : undefined
    };
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
){
  const { slug } = await params;
  const url = new URL(request.url);
  const format = (url.searchParams.get('format') || 'ics').toLowerCase();

  const trip = await loadTrip(slug);
  if (!trip) {
    logger.info('trip.export.not_found', { slug, format });
    return NextResponse.json({ error: 'trip_not_found' }, { status: 404 });
  }
  if (trip.is_public === false && !trip.owner_id) {
    // Private trip without owner — nothing to export publicly
    return NextResponse.json({ error: 'trip_private' }, { status: 403 });
  }

  const exportPayload: TripExport = {
    slug: trip.slug,
    title: trip.title,
    description: trip.description || undefined,
    start_date: trip.start_date || undefined,
    stops: stopsToExport(trip.stops),
    organizer_name: 'TripLoop',
    organizer_email: 'hello@triploop.app'
  };

  if (format === 'ics') {
    const ics = buildIcs(exportPayload);
    if (!ics) {
      return NextResponse.json({ error: 'no_stops' }, { status: 422 });
    }
    logger.info('trip.export.ics', { slug, stop_count: exportPayload.stops.length });
    return new NextResponse(ics, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${slug}.ics"`,
        'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300'
      }
    });
  }

  if (format === 'wallet' || format === 'pkpass-json') {
    const payload = buildWalletPassPayload(exportPayload);
    logger.info('trip.export.wallet_json', { slug, stop_count: exportPayload.stops.length });
    return NextResponse.json(payload, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="${slug}.pass.json"`,
        'X-Wallet-Note': 'Unsigned Pass JSON. Downstream service must wrap in .pkpass with Apple Developer certs. See docs/apple-wallet.md.'
      }
    });
  }

  return NextResponse.json({
    error: 'unsupported_format',
    hint: 'Use ?format=ics (default) or ?format=wallet',
    supported: ['ics', 'wallet']
  }, { status: 400 });
}
