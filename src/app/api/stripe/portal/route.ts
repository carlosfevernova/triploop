import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClientFromRequest } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

export async function POST(req: Request){
  const authClient = createClientFromRequest(req);
  const { data: { user } } = await authClient.auth.getUser();
  if(!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if(!stripeKey) return NextResponse.json({ error: 'payments_not_configured' }, { status: 503 });

  const sb = createAdminClient();
  const { data: sub } = await sb.from('subscriptions').select('stripe_customer_id').eq('user_id', user.id).maybeSingle();
  if(!sub?.stripe_customer_id) return NextResponse.json({ error: 'no_customer' }, { status: 404 });

  const stripe = new Stripe(stripeKey, { apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion });
  const origin = req.headers.get('origin') || 'https://triploop-six.vercel.app';

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${origin}/en/account`
  });

  return NextResponse.json({ url: session.url });
}
