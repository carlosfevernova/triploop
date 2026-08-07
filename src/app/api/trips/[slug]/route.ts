import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClientFromRequest } from '@/lib/supabase-server';

export const runtime = 'edge';

// GET /api/trips/[slug] — leer trip público
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  const sb = createAdminClient();
  const { data, error } = await sb.from('trips').select('*').eq('slug', slug).maybeSingle();
  if(error) return NextResponse.json({ error: 'read_failed', detail: error.message }, { status: 500 });
  if(!data) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ trip: data });
}

// PATCH /api/trips/[slug] — actualizar trip
// Reglas:
//   - Trip sin owner_id → cualquiera puede editar (trip anónimo compartido)
//   - Trip con owner_id → solo el owner puede editar
async function checkOwner(req: Request, slug: string){
  const sb = createAdminClient();
  const { data: trip } = await sb.from('trips').select('owner_id').eq('slug', slug).maybeSingle();
  if(!trip) return { ok: false as const, status: 404 as const, error: 'not_found' };
  if(!trip.owner_id) return { ok: true as const };
  const authClient = createClientFromRequest(req);
  const { data: { user } } = await authClient.auth.getUser();
  if(!user || user.id !== trip.owner_id) return { ok: false as const, status: 403 as const, error: 'not_owner' };
  return { ok: true as const };
}

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  try {
    const check = await checkOwner(req, slug);
    if(!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

    const patch = await req.json();
    const allowed: Record<string, unknown> = {};
    const fields = ['title','description','origin_city','destination_city','start_date','end_date','days_count','travelers_count','unit_system','currency','stops','route_geometry','total_distance_m','total_duration_s','is_public'];
    for(const f of fields){ if(patch[f] !== undefined) allowed[f] = patch[f]; }

    const sb = createAdminClient();
    const { data, error } = await sb.from('trips').update(allowed).eq('slug', slug).select().single();
    if(error) return NextResponse.json({ error: 'update_failed', detail: error.message }, { status: 500 });
    return NextResponse.json({ trip: data });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}

// DELETE /api/trips/[slug] — solo owner
export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  const check = await checkOwner(req, slug);
  if(!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });
  const sb = createAdminClient();
  const { error } = await sb.from('trips').delete().eq('slug', slug);
  if(error) return NextResponse.json({ error: 'delete_failed', detail: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
