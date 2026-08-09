import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClientFromRequest } from '@/lib/supabase-server';
import { addDaysISO } from '@/lib/itinerary/time';

export const runtime = 'nodejs';

// S44 P0: GET/POST el itinerario completo (days + items) por trip_slug.
// GET → { days: TripDay[], items: ItineraryItem[] }
// POST → auto-genera trip_days a partir de trip.start_date/days_count si no existen (idempotente)

async function checkWriteAccess(req: Request, slug: string){
  const sb = createAdminClient();
  const { data: trip } = await sb.from('trips').select('owner_id').eq('slug', slug).maybeSingle();
  if(!trip) return { ok: false as const, status: 404 as const, error: 'not_found' };
  if(!trip.owner_id) return { ok: true as const };  // trip anónimo
  const authClient = createClientFromRequest(req);
  const { data: { user } } = await authClient.auth.getUser();
  if(!user || user.id !== trip.owner_id) return { ok: false as const, status: 403 as const, error: 'not_owner' };
  return { ok: true as const };
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  const sb = createAdminClient();
  const [{ data: days, error: dErr }, { data: items, error: iErr }] = await Promise.all([
    sb.from('trip_days').select('*').eq('trip_slug', slug).order('day_number', { ascending: true }),
    sb.from('itinerary_items').select('*').eq('trip_slug', slug).order('position', { ascending: true })
  ]);
  if(dErr || iErr) return NextResponse.json({ error: (dErr || iErr)?.message }, { status: 500 });
  return NextResponse.json({ days: days || [], items: items || [] });
}

// POST → seed days del trip. Body opcional: { timezone?: string }
export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  const check = await checkWriteAccess(req, slug);
  if(!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  const sb = createAdminClient();
  const { data: trip } = await sb.from('trips').select('start_date, days_count, region').eq('slug', slug).maybeSingle();
  if(!trip) return NextResponse.json({ error: 'trip_not_found' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const timezone: string = body.timezone || 'UTC';
  const daysCount: number = Math.max(1, Math.min(60, trip.days_count || 3));

  // Check existing
  const { data: existing } = await sb.from('trip_days').select('day_number').eq('trip_slug', slug);
  const existingNums = new Set((existing || []).map(d => d.day_number));

  const rows: Array<Record<string, unknown>> = [];
  for(let n = 1; n <= daysCount; n++){
    if(existingNums.has(n)) continue;
    const date = trip.start_date ? addDaysISO(trip.start_date, n - 1) : null;
    rows.push({ trip_slug: slug, day_number: n, date, timezone });
  }
  if(rows.length === 0) return NextResponse.json({ ok: true, seeded: 0 });

  const { data: inserted, error } = await sb.from('trip_days').insert(rows).select();
  if(error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, seeded: inserted?.length || 0, days: inserted });
}
