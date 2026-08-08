-- Stripe subscriptions mirror. Único source of truth = Stripe;
-- esta tabla es cache local para permitir gating rápido sin round-trip.
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status text check (status in ('trialing','active','past_due','canceled','incomplete','incomplete_expired','unpaid','paused')),
  plan text,                              -- 'monthly' | 'yearly'
  price_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  trial_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists subs_status_idx on public.subscriptions (status);
create index if not exists subs_period_end_idx on public.subscriptions (current_period_end);

alter table public.subscriptions enable row level security;

drop policy if exists "subs_own_read" on public.subscriptions;
create policy "subs_own_read" on public.subscriptions
  for select using (auth.uid() = user_id);
-- Writes solo via service_role (webhook Stripe)

grant select on public.subscriptions to authenticated;
