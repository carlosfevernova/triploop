import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import type { Trip } from '@/lib/types';

export const runtime = 'edge';

// POST /api/trips — crear nuevo trip
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

    const sb = createAdminClient();
    // Generate unique slug via DB function
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
      is_public: true
    }).select().single();

    if(error) return NextResponse.json({ error: 'insert_failed', detail: error.message }, { status: 500 });
    return NextResponse.json({ trip: data as Trip });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
