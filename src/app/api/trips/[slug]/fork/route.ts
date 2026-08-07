import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClientFromRequest } from '@/lib/supabase-server';

export const runtime = 'edge';

// POST /api/trips/[slug]/fork — duplica un trip público como copia del usuario actual
export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  try {
    const authClient = createClientFromRequest(req);
    const { data: { user } } = await authClient.auth.getUser();
    if(!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

    const sb = createAdminClient();
    const { data: source, error: srcErr } = await sb.from('trips').select('*').eq('slug', slug).maybeSingle();
    if(srcErr || !source) return NextResponse.json({ error: 'source_not_found' }, { status: 404 });

    const { data: slugRow } = await sb.rpc('gen_trip_slug');
    const newSlug = slugRow as string;

    const { data, error } = await sb.from('trips').insert({
      slug: newSlug,
      title: `${source.title} (copy)`,
      description: source.description,
      origin_city: source.origin_city,
      destination_city: source.destination_city,
      days_count: source.days_count,
      travelers_count: source.travelers_count,
      unit_system: source.unit_system,
      currency: source.currency,
      locale: source.locale,
      stops: source.stops,
      route_geometry: source.route_geometry,
      total_distance_m: source.total_distance_m,
      total_duration_s: source.total_duration_s,
      is_public: true,
      owner_id: user.id
    }).select().single();
    if(error) return NextResponse.json({ error: 'fork_failed', detail: error.message }, { status: 500 });
    return NextResponse.json({ trip: data });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
