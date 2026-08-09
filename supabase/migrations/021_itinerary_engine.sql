-- S44 P0: Itinerary Engine
-- Reemplaza el modelo plano trips.stops[] por una capa temporal-espacial:
-- trip_days (1 por fecha) + itinerary_items (0..N por día, con horario opcional).
-- trips.stops queda intacto como fuente autoritativa hasta que la UI de itinerary lo migre.
-- Modelo pensado para: DÍA → FECHA → HORA → ACTIVIDAD → TRAYECTO → SIGUIENTE ACTIVIDAD.

-- =============================================================
-- TRIP_DAYS: un registro por día del viaje
-- =============================================================
create table if not exists trip_days (
  id bigserial primary key,
  trip_slug text not null,
  day_number int not null,             -- 1..N (day 1 = start_date del trip)
  date date,                            -- fecha absoluta si el trip tiene fechas
  timezone text default 'UTC',          -- IANA (America/Mexico_City, Europe/Paris…)
  title text,                           -- override opcional ("Kioto histórico")
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (trip_slug, day_number)
);

create index if not exists idx_trip_days_slug on trip_days(trip_slug);
create index if not exists idx_trip_days_date on trip_days(date);

alter table trip_days enable row level security;

-- Read público (viajes son shareable por slug; is_public en trips ya gate el listado)
create policy "trip_days_public_read" on trip_days for select using (true);

-- Insert/Update/Delete: solo si el trip padre es del user (o anónimo)
-- Nota: joins en policies con service_role bypass, así que este check redundante lo hace el API.
-- Aún así habilitamos policy permisiva para authenticated users (API es admin client, no RLS).
create policy "trip_days_auth_write_insert" on trip_days for insert with check (auth.role() = 'authenticated' or auth.role() = 'service_role');
create policy "trip_days_auth_write_update" on trip_days for update using (true) with check (true);
create policy "trip_days_auth_write_delete" on trip_days for delete using (true);

-- =============================================================
-- ITINERARY_ITEMS: actividades/paradas con horario opcional
-- =============================================================
create table if not exists itinerary_items (
  id bigserial primary key,
  trip_slug text not null,
  trip_day_id bigint references trip_days(id) on delete set null,  -- null = unscheduled
  position int not null default 100,                                 -- integer gaps (100,200,300…) para reorder sin recalcular todo
  type text not null default 'place',                                -- place|meal|hotel|flight|train|drive|walk|event|note|free_time
  title text not null,
  description text,
  place_id text,                          -- Google Places ID (opcional)
  lat numeric(10, 7),
  lng numeric(10, 7),
  address text,
  start_local time,                       -- HH:MM local time (nullable = sin hora)
  duration_min int,                       -- duración estimada en minutos
  priority text default 'preferred',      -- must|preferred|optional
  fixed boolean default false,            -- 🔒 no lo mueve Optimize/AI (reservas, vuelos)
  reservation_id text,                    -- link a booking (futuro)
  notes text,
  source_stop_id text,                    -- id del stop original en trips.stops[] (backfill)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_itinerary_items_slug on itinerary_items(trip_slug);
create index if not exists idx_itinerary_items_day on itinerary_items(trip_day_id);
create index if not exists idx_itinerary_items_position on itinerary_items(trip_day_id, position);

alter table itinerary_items enable row level security;

create policy "itinerary_items_public_read" on itinerary_items for select using (true);
create policy "itinerary_items_auth_write_insert" on itinerary_items for insert with check (auth.role() = 'authenticated' or auth.role() = 'service_role');
create policy "itinerary_items_auth_write_update" on itinerary_items for update using (true) with check (true);
create policy "itinerary_items_auth_write_delete" on itinerary_items for delete using (true);

-- =============================================================
-- HELPER: función para renormalizar posiciones cuando gaps < 2
-- Llamada opcional después de muchos reorders.
-- =============================================================
create or replace function itinerary_renormalize_positions(p_trip_day_id bigint)
returns void language plpgsql as $$
begin
  with ranked as (
    select id, row_number() over (order by position asc) * 100 as new_pos
    from itinerary_items
    where trip_day_id = p_trip_day_id
  )
  update itinerary_items ii
     set position = r.new_pos, updated_at = now()
    from ranked r
   where ii.id = r.id and ii.position != r.new_pos;
end $$;

-- Reload PostgREST schema cache
notify pgrst, 'reload schema';
