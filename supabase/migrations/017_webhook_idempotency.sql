-- S40 P0.1: Stripe webhook idempotency
-- Cada evento Stripe llega potencialmente múltiples veces (retry, at-least-once delivery).
-- Insertar stripe_event_id como UNIQUE hace que el 2do intento falle con conflict → skip processing.

create table if not exists processed_webhook_events (
  stripe_event_id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now(),
  metadata jsonb
);

comment on table processed_webhook_events is 'S40 P0.1: idempotency guard para Stripe webhook events (Stripe entrega at-least-once)';

create index if not exists idx_processed_webhook_events_type on processed_webhook_events(event_type);

-- Auto-cleanup events >90 días (opcional, no crítico)
-- Podría añadirse cron: DELETE FROM processed_webhook_events WHERE processed_at < now() - interval '90 days';

alter table processed_webhook_events enable row level security;
-- Sin policies: solo service_role puede leer/escribir (default deny)

notify pgrst, 'reload schema';
