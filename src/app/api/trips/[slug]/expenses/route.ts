import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClientFromRequest } from '@/lib/supabase-server';
import { rateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// S43 P1: Financial tracker per trip. RLS applied via auth.uid().
// GET → list expenses del trip para el user actual
// POST → insertar expense { category, amount, currency, kind, description }
// DELETE → remove por id (query param)

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  const authClient = createClientFromRequest(req);
  const { data: { user } } = await authClient.auth.getUser();
  if(!user) return NextResponse.json({ error: 'auth_required' }, { status: 401 });
  const sb = createAdminClient();
  const { data, error } = await sb.from('trip_expenses')
    .select('*')
    .eq('trip_slug', slug)
    .eq('user_id', user.id)
    .order('incurred_at', { ascending: false });
  if(error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ expenses: data || [] });
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }){
  const rl = rateLimit(getClientKey(req), { limit: 30, windowSec: 60 });
  if(!rl.ok) return rateLimitResponse(rl);

  const { slug } = await params;
  const authClient = createClientFromRequest(req);
  const { data: { user } } = await authClient.auth.getUser();
  if(!user) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  try {
    const body = await req.json();
    const category = String(body.category || 'other');
    const amount = Number(body.amount);
    if(!isFinite(amount) || amount < 0) return NextResponse.json({ error: 'invalid_amount' }, { status: 400 });
    const currency = String(body.currency || 'USD').slice(0, 3);
    const kind = body.kind === 'booked' ? 'booked' : 'actual';
    const description = body.description ? String(body.description).slice(0, 200) : null;
    const incurred_at = body.incurred_at || null;

    const sb = createAdminClient();
    const { data, error } = await sb.from('trip_expenses').insert({
      trip_slug: slug,
      user_id: user.id,
      category,
      amount,
      currency,
      kind,
      description,
      incurred_at
    }).select().single();
    if(error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ expense: data });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  const authClient = createClientFromRequest(req);
  const { data: { user } } = await authClient.auth.getUser();
  if(!user) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  const id = new URL(req.url).searchParams.get('id');
  if(!id) return NextResponse.json({ error: 'id_required' }, { status: 400 });

  const sb = createAdminClient();
  const { error } = await sb.from('trip_expenses').delete().eq('id', id).eq('trip_slug', slug).eq('user_id', user.id);
  if(error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
