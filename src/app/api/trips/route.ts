import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClientFromRequest } from '@/lib/supabase-server';
import { isProSubscription } from '@/lib/stripe-config';
import type { Trip } from '@/lib/types';

export const runtime = 'edge';

const FREE_TRIP_LIMIT = 3;

// POST /api/trips — crear nuevo trip (opcionalmente asigna owner_id si hay sesión)
export async function POST(req: Request){
  try {
    const body = await req.json();
    const {
      title = 'Untitled Trip',
      origin_city = null,
      destination_city = null,
      start_date = null,
      end_date = null,
      days_count = 3,
      travelers_count = 2,
      unit_system = 'metric',
      currency = 'USD',
      locale = 'en',
      stops = []
    } = body;

    if(!title || title.length < 2){
      return NextResponse.json({ error: 'title_required' }, { status: 400 });
    }

    // Extract user from session cookies (opcional — trips anónimos permitidos)
    let owner_id: string | null = null;
    try {
      const authClient = createClientFromRequest(req);
      const { data: { user } } = await authClient.auth.getUser();
      owner_id = user?.id ?? null;
    } catch { /* trip anónimo */ }

    const sb = createAdminClient();

    // Gate free tier: usuarios logeados sin Pro → max 3 trips
    if(owner_id){
      const { data: sub } = await sb.from('subscriptions').select('status').eq('user_id', owner_id).maybeSingle();
      if(!isProSubscription(sub ? { user_id: owner_id, status: sub.status } : null)){
        const { count } = await sb.from('trips').select('id', { count: 'exact', head: true }).eq('owner_id', owner_id);
        if((count || 0) >= FREE_TRIP_LIMIT){
          return NextResponse.json({
            error: 'free_limit_reached',
            limit: FREE_TRIP_LIMIT,
            hint: 'Delete an old trip or upgrade to TripLoop Pro.'
          }, { status: 402 });
        }
      }
    }
    const { data: slugRow, error: slugErr } = await sb.rpc('gen_trip_slug');
    if(slugErr) return NextResponse.json({ error: 'slug_gen_failed', detail: slugErr.message }, { status: 500 });
    const slug = slugRow as string;

    const { data, error } = await sb.from('trips').insert({
      slug,
      title,
      origin_city,
      destination_city,
      start_date,
      end_date,
      days_count,
      travelers_count,
      unit_system,
      currency,
      locale,
      stops,
      is_public: true,
      owner_id
    }).select().single();

    if(error) return NextResponse.json({ error: 'insert_failed', detail: error.message }, { status: 500 });
    return NextResponse.json({ trip: data as Trip });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}

// GET /api/trips — lista trips del user autenticado
export async function GET(req: Request){
  try {
    const authClient = createClientFromRequest(req);
    const { data: { user } } = await authClient.auth.getUser();
    if(!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

    const sb = createAdminClient();
    const { data, error } = await sb
      .from('trips')
      .select('id,slug,title,origin_city,destination_city,days_count,total_distance_m,total_duration_s,stops,updated_at,created_at')
      .eq('owner_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(100);
    if(error) return NextResponse.json({ error: 'list_failed', detail: error.message }, { status: 500 });
    return NextResponse.json({ trips: data || [] });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
