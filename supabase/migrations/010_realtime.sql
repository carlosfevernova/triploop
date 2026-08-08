-- Enable Realtime broadcast en trips para colaboración
-- Nota: Realtime publication config se hace por dashboard (Database → Replication)
-- pero podemos habilitarlo via ALTER PUBLICATION:
alter publication supabase_realtime add table public.trips;

-- Índice para lookup rápido por slug en presence channels
create index if not exists trips_slug_realtime_idx on public.trips (slug) where is_template = false;

-- RLS ya existe para trips: SELECT public/owner, UPDATE via service_role.
-- Realtime respeta RLS: solo usuarios con SELECT permission ven eventos.
