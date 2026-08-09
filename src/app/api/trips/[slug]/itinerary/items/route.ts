import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClientFromRequest } from '@/lib/supabase-server';
import { rateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// S44 P0: POST /api/trips/[slug]/itinerary/items — create item
// Body: { trip_day_id?, type, title, place_id?, lat?, lng?, address?, start_local?, duration_min?, priority?, notes?, position? }

const ALLOWED_TYPES = ['place','meal','hotel','flight','train','drive','walk','event','note','free_time'];
const ALLOWED_PRIORITY = ['must','preferred','optional'];

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
  const rl = rateLimit(getClientKey(req), { limit: 60, windowSec: 60 });
  if(!rl.ok) return rateLimitResponse(rl);

  const { slug } = await params;
  const check = await checkWriteAccess(req, slug);
  if(!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  try {
    const body = await req.json();
    const type = ALLOWED_TYPES.includes(body.type) ? body.type : 'place';
    const priority = ALLOWED_PRIORITY.includes(body.priority) ? body.priority : 'preferred';
    const title = String(body.title || '').slice(0, 200);
    if(!title) return NextResponse.json({ error: 'title_required' }, { status: 400 });

    const sb = createAdminClient();

    // Compute position si no viene: last + 100
    let position = typeof body.position === 'number' ? body.position : 100;
    if(typeof body.position !== 'number' && body.trip_day_id){
      const { data: last } = await sb.from('itinerary_items')
        .select('position').eq('trip_slug', slug).eq('trip_day_id', body.trip_day_id)
        .order('position', { ascending: false }).limit(1).maybeSingle();
      position = (last?.position || 0) + 100;
    }

    const insert = {
      trip_slug: slug,
      trip_day_id: body.trip_day_id ?? null,
      position,
      type,
      title,
      description: body.description ? String(body.description).slice(0, 500) : null,
      place_id: body.place_id ? String(body.place_id).slice(0, 200) : null,
      lat: typeof body.lat === 'number' ? body.lat : null,
      lng: typeof body.lng === 'number' ? body.lng : null,
      address: body.address ? String(body.address).slice(0, 300) : null,
      start_local: body.start_local ? String(body.start_local).slice(0, 8) : null,
      duration_min: typeof body.duration_min === 'number' ? body.duration_min : null,
      priority,
      fixed: !!body.fixed,
      notes: body.notes ? String(body.notes).slice(0, 1000) : null,
      source_stop_id: body.source_stop_id || null
    };

    const { data, error } = await sb.from('itinerary_items').insert(insert).select().single();
    if(error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ item: data });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
