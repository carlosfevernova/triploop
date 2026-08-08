import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClientFromRequest } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';
import { STRIPE_PRICES, PRO_TRIAL_DAYS } from '@/lib/stripe-config';

// Node runtime: Stripe SDK requiere Node APIs
export const runtime = 'nodejs';

export async function POST(req: Request){
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if(!stripeKey) return NextResponse.json({ error: 'payments_not_configured' }, { status: 503 });

  const { plan = 'monthly', return_url } = await req.json().catch(() => ({}));
  const priceId = plan === 'yearly' ? STRIPE_PRICES.yearly : STRIPE_PRICES.monthly;
  if(!priceId) return NextResponse.json({ error: 'price_not_configured', plan }, { status: 503 });

  // Auth check
  const authClient = createClientFromRequest(req);
  const { data: { user } } = await authClient.auth.getUser();
  if(!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const sb = createAdminClient();
  const { data: existing } = await sb.from('subscriptions').select('stripe_customer_id').eq('user_id', user.id).maybeSingle();

  const stripe = new Stripe(stripeKey, { apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion });
  const origin = req.headers.get('origin') || 'https://triploop-six.vercel.app';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: existing?.stripe_customer_id || undefined,
    customer_email: existing?.stripe_customer_id ? undefined : user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: PRO_TRIAL_DAYS,
      metadata: { user_id: user.id }
    },
    allow_promotion_codes: true,
    success_url: return_url ? `${return_url}?checkout=success` : `${origin}/en/account?checkout=success`,
    cancel_url: return_url || `${origin}/en/pricing/upgrade?checkout=canceled`,
    metadata: { user_id: user.id },
    client_reference_id: user.id
  });

  return NextResponse.json({ url: session.url, id: session.id });
}
