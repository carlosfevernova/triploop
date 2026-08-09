import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClientFromRequest } from '@/lib/supabase-server';
import { addDaysISO } from '@/lib/itinerary/time';

export const runtime = 'nodejs';

// S54: Append a new day to the trip. Auto-computes day_number = max+1 and date = last_date+1.
// POST /api/trips/[slug]/itinerary/days/new

async function checkWriteAccess(req: Request, slug: string){
  const sb = createAdminClient();
  const { data: trip } = await sb.from('trips').select('owner_id').eq('slug', slug).maybeSingle();
  if(!trip) return { ok: false as const, status: 404 as const, error: 'not_found' };
  if(!trip.owner_id) return { ok: true as const };
  const authClient = createClientFromRequest(req);
  const { data: { user } } = await authClient.auth.getUser();
  if(!user || user.id !== trip.owner_id) return { ok: false as const, status: 403 as const, error: 'not_owner' };
  return { ok: true as const };
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  const check = await checkWriteAccess(req, slug);
  if(!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  const sb = createAdminClient();
  const { data: existing } = await sb.from('trip_days')
    .select('day_number, date, timezone')
    .eq('trip_slug', slug)
    .order('day_number', { ascending: false })
    .limit(1);

  const last = existing?.[0];
  const nextNumber = (last?.day_number || 0) + 1;
  const nextDate = last?.date ? addDaysISO(last.date, 1) : null;
  const tz = last?.timezone || 'UTC';

  const { data, error } = await sb.from('trip_days').insert({
    trip_slug: slug,
    day_number: nextNumber,
    date: nextDate,
    timezone: tz
  }).select().single();
  if(error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Also bump trips.days_count so metadata queries stay accurate
  await sb.from('trips').update({ days_count: nextNumber }).eq('slug', slug);

  return NextResponse.json({ day: data });
}
