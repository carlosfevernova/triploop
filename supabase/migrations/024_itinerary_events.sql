-- S47 Fase 34: Analytics events del itinerary.
-- Ingesta append-only. Insert-only RLS. Servicio agrega funnels y product metrics.

create table if not exists itinerary_events (
  id bigserial primary key,
  trip_slug text not null,
  event text not null,                 -- itinerary_viewed | day_selected | item_added | item_removed | item_moved | item_time_changed | item_duration_changed | route_viewed | route_optimized | day_auto_scheduled | ai_edit_applied | schedule_warning_shown | schedule_warning_resolved
  props jsonb,                          -- context (day_id, item_id, count, saved_km, etc)
  user_id uuid references auth.users(id) on delete set null,
  session_id text,                      -- client-generated
  created_at timestamptz not null default now()
);

create index if not exists idx_itinerary_events_slug on itinerary_events(trip_slug);
create index if not exists idx_itinerary_events_event on itinerary_events(event);
create index if not exists idx_itinerary_events_created on itinerary_events(created_at desc);

alter table itinerary_events enable row level security;

-- Append-only: cualquier request puede insertar; nadie lee salvo service_role
create policy "itinerary_events_public_insert" on itinerary_events for insert with check (true);
-- No SELECT policy = default deny para clientes (solo admin/service_role)

notify pgrst, 'reload schema';
