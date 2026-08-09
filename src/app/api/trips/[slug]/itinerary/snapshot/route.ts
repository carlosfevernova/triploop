import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClientFromRequest } from '@/lib/supabase-server';

export const runtime = 'nodejs';

// S47 P4 undo: snapshot completo del itinerario + restore.
// GET → devuelve todos los items + days actuales (para guardar cliente-side antes de aplicar AI ops)
// POST { items: ItineraryItem[], days: TripDay[] } → restore atómico (delete-all + reinsert)

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

interface SnapshotItem {
  id: number; trip_day_id: number | null; position: number; type: string; title: string;
  description?: string | null; place_id?: string | null; lat?: number | null; lng?: number | null;
  address?: string | null; start_local?: string | null; duration_min?: number | null;
  priority?: string; fixed?: boolean; notes?: string | null;
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  const check = await checkWriteAccess(req, slug);
  if(!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  try {
    const body = await req.json();
    const items: SnapshotItem[] = Array.isArray(body.items) ? body.items : [];
    if(items.length > 500) return NextResponse.json({ error: 'too_many_items' }, { status: 400 });

    const sb = createAdminClient();
    const now = new Date().toISOString();

    // Estrategia: para cada item del snapshot, upsert por id.
    // Items que existan en DB pero NO en snapshot → delete.
    // NO tocamos trip_days (restore es solo de items).
    const { data: currentItems } = await sb.from('itinerary_items')
      .select('id').eq('trip_slug', slug);
    const currentIds = new Set((currentItems || []).map(i => i.id));
    const snapshotIds = new Set(items.map(i => i.id));

    const toDelete = [...currentIds].filter(id => !snapshotIds.has(id));
    const toUpsert = items.map(i => ({
      id: i.id,
      trip_slug: slug,
      trip_day_id: i.trip_day_id,
      position: i.position,
      type: i.type,
      title: i.title,
      description: i.description ?? null,
      place_id: i.place_id ?? null,
      lat: i.lat ?? null,
      lng: i.lng ?? null,
      address: i.address ?? null,
      start_local: i.start_local ?? null,
      duration_min: i.duration_min ?? null,
      priority: i.priority ?? 'preferred',
      fixed: i.fixed ?? false,
      notes: i.notes ?? null,
      updated_at: now
    }));

    // Delete removed
    if(toDelete.length > 0){
      await sb.from('itinerary_items').delete().in('id', toDelete).eq('trip_slug', slug);
    }
    // Upsert existing + new (Postgres UPSERT via .upsert)
    if(toUpsert.length > 0){
      await sb.from('itinerary_items').upsert(toUpsert, { onConflict: 'id' });
    }

    // Invalidar route cache de todos los días
    await sb.from('trip_days').update({ route_hash: null }).eq('trip_slug', slug);

    return NextResponse.json({ ok: true, restored: toUpsert.length, deleted: toDelete.length });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
