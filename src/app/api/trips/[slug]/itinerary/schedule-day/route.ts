import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClientFromRequest } from '@/lib/supabase-server';
import { scheduleDay } from '@/lib/itinerary/scheduler';
import { parseTimeToMin } from '@/lib/itinerary/time';
import type { ItineraryItem } from '@/lib/itinerary/types';

export const runtime = 'nodejs';

// S45 P3.2: Auto-assign start_local a items sin hora del día.
// POST { day_id, start_min? (default 540 = 09:00), preview? (bool) }
// - preview=true → devuelve changes[] sin persistir
// - preview=false → persiste + devuelve items actualizados

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

  try {
    const body = await req.json();
    const dayId = Number(body.day_id);
    if(!dayId) return NextResponse.json({ error: 'day_id_required' }, { status: 400 });
    const startMin = typeof body.start_min === 'number' ? body.start_min : parseTimeToMin(body.start_time || '') ?? 9 * 60;
    const preview = body.preview === true;

    const sb = createAdminClient();
    const { data: items } = await sb.from('itinerary_items')
      .select('*')
      .eq('trip_slug', slug).eq('trip_day_id', dayId)
      .order('position', { ascending: true });

    const changes = scheduleDay((items || []) as ItineraryItem[], { startMin });

    if(preview) return NextResponse.json({ changes, count: changes.length, preview: true });
    if(changes.length === 0) return NextResponse.json({ ok: true, changes: [], count: 0 });

    // Persist en paralelo
    const now = new Date().toISOString();
    await Promise.all(changes.map(c =>
      sb.from('itinerary_items').update({ start_local: c.start_local, updated_at: now })
        .eq('id', c.id).eq('trip_slug', slug)
    ));

    return NextResponse.json({ ok: true, changes, count: changes.length });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
