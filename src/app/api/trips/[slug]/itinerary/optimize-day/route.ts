import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClientFromRequest } from '@/lib/supabase-server';
import { optimizeDay } from '@/lib/itinerary/scheduler';
import { haversineKm } from '@/lib/itinerary/validate';
import type { ItineraryItem } from '@/lib/itinerary/types';

export const runtime = 'nodejs';

// S45 P3.3: Nearest-neighbor route optimization respetando fixed/must items.
// POST { day_id, preview? }
// Devuelve { changes: [{id, position}], before_km, after_km, saved_km }

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

function totalKm(items: Array<{ lat: number | null; lng: number | null }>): number {
  let total = 0;
  for(let i = 1; i < items.length; i++){
    const a = items[i - 1], b = items[i];
    if(a.lat != null && a.lng != null && b.lat != null && b.lng != null){
      total += haversineKm({ lat: a.lat, lng: a.lng }, { lat: b.lat, lng: b.lng });
    }
  }
  return total;
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  const check = await checkWriteAccess(req, slug);
  if(!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  try {
    const body = await req.json();
    const dayId = Number(body.day_id);
    if(!dayId) return NextResponse.json({ error: 'day_id_required' }, { status: 400 });
    const preview = body.preview === true;

    const sb = createAdminClient();
    const { data: items } = await sb.from('itinerary_items')
      .select('*')
      .eq('trip_slug', slug).eq('trip_day_id', dayId)
      .order('position', { ascending: true });

    const arr = (items || []) as ItineraryItem[];
    const beforeKm = totalKm(arr.sort((a, b) => a.position - b.position));

    const changes = optimizeDay(arr);
    if(changes.length === 0){
      return NextResponse.json({ ok: true, changes: [], before_km: beforeKm, after_km: beforeKm, saved_km: 0, note: 'nothing_to_optimize' });
    }

    // Compute after km using new order
    const positionMap = new Map(changes.map(c => [c.id, c.position]));
    const newOrder = [...arr].sort((a, b) => (positionMap.get(a.id) ?? a.position) - (positionMap.get(b.id) ?? b.position));
    const afterKm = totalKm(newOrder);
    const savedKm = Math.max(0, beforeKm - afterKm);

    if(preview) return NextResponse.json({ changes, before_km: beforeKm, after_km: afterKm, saved_km: savedKm, preview: true });

    const now = new Date().toISOString();
    await Promise.all(changes.map(c =>
      sb.from('itinerary_items').update({ position: c.position, updated_at: now })
        .eq('id', c.id).eq('trip_slug', slug)
    ));

    // Invalidate route cache for this day (positions cambiaron)
    await sb.from('trip_days').update({ route_hash: null, route_updated_at: null })
      .eq('id', dayId).eq('trip_slug', slug);

    return NextResponse.json({ ok: true, changes, before_km: beforeKm, after_km: afterKm, saved_km: savedKm });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
