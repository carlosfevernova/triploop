-- Hit counter para templates California (analytics)
create table if not exists public.template_views (
  id bigserial primary key,
  template_slug text not null,
  locale text,
  referrer text,
  user_agent_hash text,           -- hashed for privacy (SHA-256 first 12 chars)
  viewed_at timestamptz default now()
);

create index if not exists template_views_slug_idx on public.template_views (template_slug, viewed_at desc);
create index if not exists template_views_date_idx on public.template_views (viewed_at desc);

alter table public.template_views enable row level security;
-- Sin RLS policies → solo service_role reads/writes (analytics interno)
