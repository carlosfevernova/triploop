-- Email preferences + audit log
create table if not exists public.email_unsubscribes (
  email text primary key,
  unsubscribed_at timestamptz default now(),
  reason text
);

create table if not exists public.email_log (
  id bigserial primary key,
  to_email text not null,
  tag text,
  subject text,
  status text check (status in ('sent','failed','mocked')),
  provider_id text,
  error text,
  sent_at timestamptz default now()
);

create index if not exists email_log_tag_idx on public.email_log (tag, sent_at desc);
create index if not exists email_log_to_idx on public.email_log (to_email, sent_at desc);

alter table public.email_unsubscribes enable row level security;
alter table public.email_log enable row level security;
-- Solo service_role reads/writes (privacy)
