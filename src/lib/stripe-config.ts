// Stripe config compartida cliente + servidor. Los price IDs se leen de env.
export const STRIPE_PRICES = {
  monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || '',
  yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || ''
};

export const PRO_TRIAL_DAYS = 14;

export function isStripeConfigured(){
  return !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && !!STRIPE_PRICES.monthly;
}

// Estados que dan acceso Pro
export const PRO_STATUSES = new Set(['trialing', 'active', 'past_due']);

export interface SubscriptionRow {
  user_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  status?: string;
  plan?: 'monthly' | 'yearly';
  price_id?: string;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
  trial_end?: string;
}

export function isProSubscription(sub: SubscriptionRow | null | undefined): boolean {
  if(!sub || !sub.status) return false;
  return PRO_STATUSES.has(sub.status);
}
