-- S45 P2+P3: Itinerary Intelligence
-- Añade capas de caché para: route matrix (Google Routes v2) y opening hours (Google Places).
-- Evita quemar quota en cada render + habilita conflict detection basado en horarios reales.

-- =============================================================
-- ROUTE CACHE por trip_day (JSONB para no crear tabla nueva)
-- =============================================================
alter table trip_days
  add column if not exists route_cache jsonb,
  add column if not exists route_hash text,               -- hash del orden actual (invalidación)
  add column if not exists route_updated_at timestamptz;

-- =============================================================
-- OPENING HOURS + place details cache por item
-- =============================================================
alter table itinerary_items
  add column if not exists opening_hours jsonb,            -- Google Places weekday_text + periods
  add column if not exists opening_hours_updated_at timestamptz;

-- Índice para invalidar horarios stale (>30 días)
create index if not exists idx_itinerary_items_hours_updated
  on itinerary_items(opening_hours_updated_at)
  where opening_hours is not null;

notify pgrst, 'reload schema';
