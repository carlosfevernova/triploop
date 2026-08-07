-- TripLoop waitlist table (aplicar en Supabase SQL Editor)
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  locale text default 'en',
  referer text,
  user_agent text,
  created_at timestamptz default now()
);

create index if not exists idx_waitlist_email on public.waitlist (email);
create index if not exists idx_waitlist_created_at on public.waitlist (created_at desc);

-- RLS estricta: solo service_role puede leer/escribir (endpoint /api/waitlist usa SUPABASE_SECRET_KEY)
alter table public.waitlist enable row level security;
-- Sin policies para anon → bloquea todo desde cliente
