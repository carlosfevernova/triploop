-- Affiliate click tracking (opcional, soft-fail si no existe)
create table if not exists public.affiliate_clicks (
  id bigserial primary key,
  trip_slug text,
  stop_id text,
  destination text,
  provider text check (provider in ('gyg', 'booking')),
  clicked_at timestamptz default now()
);

create index if not exists affiliate_clicks_provider_idx on public.affiliate_clicks (provider, clicked_at desc);
create index if not exists affiliate_clicks_slug_idx on public.affiliate_clicks (trip_slug, clicked_at desc);

alter table public.affiliate_clicks enable row level security;
-- Solo service_role escribe; nadie lee público (analytics interno)
