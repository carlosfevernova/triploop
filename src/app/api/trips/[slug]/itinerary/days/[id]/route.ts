import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClientFromRequest } from '@/lib/supabase-server';

export const runtime = 'nodejs';

// PATCH /api/trips/[slug]/itinerary/days/[id] — actualizar title/notes/date/timezone
// DELETE /api/trips/[slug]/itinerary/days/[id] — borrar día (items pasan a unscheduled via ON DELETE SET NULL)

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

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string; id: string }> }){
  const { slug, id } = await params;
  const check = await checkWriteAccess(req, slug);
  if(!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  const patch = await req.json();
  const allowed: Record<string, unknown> = {};
  for(const f of ['title', 'notes', 'date', 'timezone']){
    if(patch[f] !== undefined) allowed[f] = patch[f];
  }
  allowed.updated_at = new Date().toISOString();

  const sb = createAdminClient();
  const { data, error } = await sb.from('trip_days')
    .update(allowed).eq('id', id).eq('trip_slug', slug).select().single();
  if(error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ day: data });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string; id: string }> }){
  const { slug, id } = await params;
  const check = await checkWriteAccess(req, slug);
  if(!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  const sb = createAdminClient();
  const { error } = await sb.from('trip_days').delete().eq('id', id).eq('trip_slug', slug);
  if(error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
