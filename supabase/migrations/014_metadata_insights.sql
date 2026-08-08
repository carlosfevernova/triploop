-- S21: metadata JSONB en trips para cachear AI insights (warnings + local tips)
-- Estructura ejemplo:
-- { "insights_en_abc123": { warnings: [...], tips: [...], generated_at, provider },
--   "insights_es_abc123": { ... } }

alter table if exists trips
  add column if not exists metadata jsonb default '{}'::jsonb;

comment on column trips.metadata is 'S21: cache de AI insights (warnings + tips) hasheado por content';

-- Reload PostgREST schema cache
notify pgrst, 'reload schema';
