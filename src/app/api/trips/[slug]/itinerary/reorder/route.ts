import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClientFromRequest } from '@/lib/supabase-server';

export const runtime = 'nodejs';

// POST /api/trips/[slug]/itinerary/reorder
// Body: { updates: Array<{ id: number, position: number, trip_day_id?: number|null }> }
// Batch update para persistir un drag/drop (item movido entre días o reordenado dentro del mismo).

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
    const updates: Array<{ id: number; position: number; trip_day_id?: number | null }> = body.updates || [];
    if(!Array.isArray(updates) || updates.length === 0) return NextResponse.json({ error: 'no_updates' }, { status: 400 });
    if(updates.length > 200) return NextResponse.json({ error: 'too_many' }, { status: 400 });

    const sb = createAdminClient();
    const now = new Date().toISOString();

    // Execute updates en paralelo (max 200)
    const results = await Promise.all(updates.map(u => {
      const patch: Record<string, unknown> = { position: u.position, updated_at: now };
      if(u.trip_day_id !== undefined) patch.trip_day_id = u.trip_day_id;
      return sb.from('itinerary_items').update(patch).eq('id', u.id).eq('trip_slug', slug);
    }));

    const errors = results.filter(r => r.error).map(r => r.error?.message);
    if(errors.length > 0) return NextResponse.json({ error: 'partial_failure', errors }, { status: 500 });
    return NextResponse.json({ ok: true, updated: updates.length });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
