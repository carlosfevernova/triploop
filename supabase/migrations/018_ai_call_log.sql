-- S42 P1: AI call observability
-- Log cada llamada AI para dashboard admin AI-cost + performance debugging.

create table if not exists ai_call_log (
  id bigserial primary key,
  endpoint text not null,
  provider text not null,
  model text,
  latency_ms integer,
  input_tokens integer,
  output_tokens integer,
  estimated_cost_usd numeric(12, 8),
  success boolean not null default true,
  fallback_count integer default 0,
  error_category text,
  source text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_call_log_provider on ai_call_log(provider);
create index if not exists idx_ai_call_log_endpoint on ai_call_log(endpoint);
create index if not exists idx_ai_call_log_created on ai_call_log(created_at desc);

alter table ai_call_log enable row level security;
-- No policies: solo service_role (Admin dashboard queries)

notify pgrst, 'reload schema';
