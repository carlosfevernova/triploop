import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClientFromRequest } from '@/lib/supabase-server';
import { rateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// S43 P1: Stop voting grupal.
// GET → devuelve tallies por stop_key { stop_key: { like, maybe, no, myVote } }
// POST → { stop_key, vote } → upsert user's vote
// DELETE → ?stop_key=... → remove user's vote

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  const sb = createAdminClient();
  const { data, error } = await sb.from('stop_votes')
    .select('stop_key, vote, user_id')
    .eq('trip_slug', slug);
  if(error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Get current user (may be null)
  let myUserId: string | null = null;
  try {
    const authClient = createClientFromRequest(req);
    const { data: { user } } = await authClient.auth.getUser();
    myUserId = user?.id || null;
  } catch { /* anon ok */ }

  const tallies: Record<string, { like: number; maybe: number; no: number; myVote: string | null; total: number }> = {};
  for(const v of data || []){
    if(!tallies[v.stop_key]) tallies[v.stop_key] = { like: 0, maybe: 0, no: 0, myVote: null, total: 0 };
    const kind = v.vote as 'like' | 'maybe' | 'no';
    if(tallies[v.stop_key][kind] !== undefined){
      tallies[v.stop_key][kind]++;
      tallies[v.stop_key].total++;
    }
    if(myUserId && v.user_id === myUserId) tallies[v.stop_key].myVote = v.vote;
  }
  return NextResponse.json({ tallies });
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }){
  const rl = rateLimit(getClientKey(req), { limit: 60, windowSec: 60 });
  if(!rl.ok) return rateLimitResponse(rl);

  const { slug } = await params;
  const authClient = createClientFromRequest(req);
  const { data: { user } } = await authClient.auth.getUser();
  if(!user) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  try {
    const body = await req.json();
    const stopKey = String(body.stop_key || '').slice(0, 200);
    const vote = String(body.vote || '');
    if(!stopKey) return NextResponse.json({ error: 'stop_key_required' }, { status: 400 });
    if(!['like', 'maybe', 'no'].includes(vote)) return NextResponse.json({ error: 'invalid_vote' }, { status: 400 });

    const sb = createAdminClient();
    // Upsert: si existe, actualiza el vote
    const { data, error } = await sb.from('stop_votes').upsert({
      trip_slug: slug,
      stop_key: stopKey,
      user_id: user.id,
      vote,
      updated_at: new Date().toISOString()
    }, { onConflict: 'trip_slug,stop_key,user_id' }).select().single();
    if(error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ vote: data });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  const authClient = createClientFromRequest(req);
  const { data: { user } } = await authClient.auth.getUser();
  if(!user) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  const stopKey = new URL(req.url).searchParams.get('stop_key');
  if(!stopKey) return NextResponse.json({ error: 'stop_key_required' }, { status: 400 });

  const sb = createAdminClient();
  const { error } = await sb.from('stop_votes').delete()
    .eq('trip_slug', slug)
    .eq('stop_key', stopKey)
    .eq('user_id', user.id);
  if(error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
