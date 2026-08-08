-- WhatsApp conversations log (audit + analytics)
create table if not exists public.whatsapp_conversations (
  id bigserial primary key,
  from_number text not null,
  direction text check (direction in ('in', 'out')),
  body text,
  locale text,
  message_sid text,
  error text,
  created_at timestamptz default now()
);

create index if not exists wa_conv_from_idx on public.whatsapp_conversations (from_number, created_at desc);
create index if not exists wa_conv_date_idx on public.whatsapp_conversations (created_at desc);

alter table public.whatsapp_conversations enable row level security;
-- Solo service_role (privacy)
