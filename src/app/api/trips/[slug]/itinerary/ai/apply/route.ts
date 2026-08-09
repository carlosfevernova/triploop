import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClientFromRequest } from '@/lib/supabase-server';
import { rateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';
import { validateOps, type ItineraryOp } from '@/lib/itinerary/ai-operations';
import { scheduleDay, optimizeDay } from '@/lib/itinerary/scheduler';
import type { ItineraryItem, TripDay } from '@/lib/itinerary/types';

export const runtime = 'nodejs';

// S46 P4: Apply AI-generated operations (with server-side re-validation).
// POST { operations: ItineraryOp[] } → ejecuta y devuelve resultado por op.
// S69 P0 fix: rate-limit missing detectado por audit general-purpose (era gap: /ai tenía 10/60s pero /apply no).

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
  // S69 P0 rate limit fix (audit S69): evita abuso escritura + spam add_item
  const rl = rateLimit(getClientKey(req), { limit: 20, windowSec: 60 });
  if(!rl.ok) return rateLimitResponse(rl);

  const { slug } = await params;
  const check = await checkWriteAccess(req, slug);
  if(!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  try {
    const body = await req.json();
    const rawOps = body.operations || [];

    const sb = createAdminClient();
    const [{ data: days }, { data: items }] = await Promise.all([
      sb.from('trip_days').select('*').eq('trip_slug', slug),
      sb.from('itinerary_items').select('*').eq('trip_slug', slug)
    ]);

    // Re-validate server-side (never trust client-provided ops)
    const ops: ItineraryOp[] = validateOps(rawOps, (items || []) as ItineraryItem[], (days || []) as TripDay[]);
    if(ops.length === 0) return NextResponse.json({ ok: true, applied: 0, results: [] });

    const now = new Date().toISOString();
    const results: Array<{ op: string; ok: boolean; error?: string }> = [];

    for(const op of ops){
      try {
        if(op.op === 'move_item'){
          // Compute new position at end of target day
          const targetDayId = op.target_day_id;
          let position = 100;
          if(targetDayId != null){
            const { data: last } = await sb.from('itinerary_items')
              .select('position').eq('trip_slug', slug).eq('trip_day_id', targetDayId)
              .order('position', { ascending: false }).limit(1).maybeSingle();
            position = (last?.position || 0) + 100;
          }
          const { error } = await sb.from('itinerary_items')
            .update({ trip_day_id: targetDayId, position, updated_at: now })
            .eq('id', op.item_id).eq('trip_slug', slug);
          results.push({ op: op.op, ok: !error, error: error?.message });
        } else if(op.op === 'update_time'){
          const { error } = await sb.from('itinerary_items')
            .update({ start_local: op.start_local, updated_at: now })
            .eq('id', op.item_id).eq('trip_slug', slug);
          results.push({ op: op.op, ok: !error, error: error?.message });
        } else if(op.op === 'update_duration'){
          const { error } = await sb.from('itinerary_items')
            .update({ duration_min: op.duration_min, updated_at: now })
            .eq('id', op.item_id).eq('trip_slug', slug);
          results.push({ op: op.op, ok: !error, error: error?.message });
        } else if(op.op === 'add_item'){
          let position = 100;
          if(op.trip_day_id != null){
            const { data: last } = await sb.from('itinerary_items')
              .select('position').eq('trip_slug', slug).eq('trip_day_id', op.trip_day_id)
              .order('position', { ascending: false }).limit(1).maybeSingle();
            position = (last?.position || 0) + 100;
          }
          const { error } = await sb.from('itinerary_items').insert({
            trip_slug: slug,
            trip_day_id: op.trip_day_id ?? null,
            position,
            type: op.type || 'place',
            title: op.title,
            start_local: op.start_local ?? null,
            duration_min: op.duration_min ?? null
          });
          results.push({ op: op.op, ok: !error, error: error?.message });
        } else if(op.op === 'remove_item'){
          const { error } = await sb.from('itinerary_items').delete()
            .eq('id', op.item_id).eq('trip_slug', slug);
          results.push({ op: op.op, ok: !error, error: error?.message });
        } else if(op.op === 'set_priority'){
          const { error } = await sb.from('itinerary_items')
            .update({ priority: op.priority, updated_at: now })
            .eq('id', op.item_id).eq('trip_slug', slug);
          results.push({ op: op.op, ok: !error, error: error?.message });
        } else if(op.op === 'set_fixed'){
          const { error } = await sb.from('itinerary_items')
            .update({ fixed: op.fixed, updated_at: now })
            .eq('id', op.item_id).eq('trip_slug', slug);
          results.push({ op: op.op, ok: !error, error: error?.message });
        } else if(op.op === 'set_notes'){
          const { error } = await sb.from('itinerary_items')
            .update({ notes: op.notes, updated_at: now })
            .eq('id', op.item_id).eq('trip_slug', slug);
          results.push({ op: op.op, ok: !error, error: error?.message });
        } else if(op.op === 'schedule_day'){
          const { data: dayItems } = await sb.from('itinerary_items').select('*')
            .eq('trip_slug', slug).eq('trip_day_id', op.day_id).order('position');
          const changes = scheduleDay((dayItems || []) as ItineraryItem[], { startMin: op.start_min });
          await Promise.all(changes.map(c =>
            sb.from('itinerary_items').update({ start_local: c.start_local, updated_at: now })
              .eq('id', c.id).eq('trip_slug', slug)
          ));
          results.push({ op: op.op, ok: true });
        } else if(op.op === 'optimize_day'){
          const { data: dayItems } = await sb.from('itinerary_items').select('*')
            .eq('trip_slug', slug).eq('trip_day_id', op.day_id).order('position');
          const changes = optimizeDay((dayItems || []) as ItineraryItem[]);
          await Promise.all(changes.map(c =>
            sb.from('itinerary_items').update({ position: c.position, updated_at: now })
              .eq('id', c.id).eq('trip_slug', slug)
          ));
          // Invalidate route cache
          await sb.from('trip_days').update({ route_hash: null }).eq('id', op.day_id).eq('trip_slug', slug);
          results.push({ op: op.op, ok: true });
        }
      } catch (e) {
        results.push({ op: op.op, ok: false, error: (e as Error).message });
      }
    }

    const applied = results.filter(r => r.ok).length;
    return NextResponse.json({ ok: true, applied, total: results.length, results });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
