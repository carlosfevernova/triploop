import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
// Stripe webhooks vienen sin body parsing; leemos raw text.

export async function POST(req: Request){
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if(!stripeKey || !webhookSecret) return NextResponse.json({ error: 'not_configured' }, { status: 503 });

  const stripe = new Stripe(stripeKey, { apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion });
  const sig = req.headers.get('stripe-signature');
  if(!sig) return NextResponse.json({ error: 'no_signature' }, { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (e) {
    return NextResponse.json({ error: 'invalid_signature', detail: (e as Error).message }, { status: 400 });
  }

  const sb = createAdminClient();

  // S40 P0.1: Idempotency guard — Stripe entrega events at-least-once
  // Insertar stripe_event_id primero; si duplicado (23505 conflict), skip processing.
  try {
    const { error: dupError } = await sb.from('processed_webhook_events').insert({
      stripe_event_id: event.id,
      event_type: event.type
    });
    if(dupError){
      // Código 23505 = unique violation → ya procesado. 42P01 = table no existe (soft-fail migration pending).
      if(dupError.code === '23505'){
        return NextResponse.json({ received: true, idempotent: true, skipped: 'already_processed' });
      }
      if(dupError.code !== '42P01'){
        // Otro error inesperado — log pero continuar (no bloquear webhook por table gap)
        console.warn('[stripe webhook] idempotency insert failed:', dupError.message);
      }
    }
  } catch (e) {
    // Soft-fail: no bloquear webhook si la tabla aún no existe (migration 017)
    console.warn('[stripe webhook] idempotency check skipped:', (e as Error).message);
  }

  try {
    switch(event.type){
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = (session.metadata?.user_id || session.client_reference_id || '') as string;
        const subId = session.subscription as string | null;
        const customerId = session.customer as string | null;
        if(userId && subId && customerId){
          const sub = await stripe.subscriptions.retrieve(subId);
          await upsertSubscription(sb, userId, customerId, sub);
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = (sub.metadata?.user_id || '') as string;
        const customerId = sub.customer as string;
        if(userId) await upsertSubscription(sb, userId, customerId, sub);
        else {
          // Fallback: match por customer_id existente
          const { data: existing } = await sb.from('subscriptions').select('user_id').eq('stripe_customer_id', customerId).maybeSingle();
          if(existing?.user_id) await upsertSubscription(sb, existing.user_id, customerId, sub);
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        await sb.from('subscriptions').update({ status: 'past_due', updated_at: new Date().toISOString() }).eq('stripe_customer_id', customerId);
        break;
      }
    }
  } catch (e) {
    return NextResponse.json({ error: 'handler_error', detail: (e as Error).message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function upsertSubscription(sb: ReturnType<typeof createAdminClient>, userId: string, customerId: string, sub: Stripe.Subscription){
  const item = sub.items.data[0];
  const priceId = item?.price?.id;
  const interval = item?.price?.recurring?.interval;
  // Stripe API 2025+: period timestamps viven en el item, no en la Subscription
  const periodStart = item?.current_period_start;
  const periodEnd = item?.current_period_end;
  await sb.from('subscriptions').upsert({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: sub.id,
    status: sub.status,
    plan: interval === 'year' ? 'yearly' : 'monthly',
    price_id: priceId,
    current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    cancel_at_period_end: sub.cancel_at_period_end,
    trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });
}
