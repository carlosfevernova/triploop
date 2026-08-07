import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

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
export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  try {
    const patch = await req.json();
    // Whitelist campos actualizables
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
