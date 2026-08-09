-- S43 P1: Voting grupal por parada
-- Cada usuario puede votar LIKE/MAYBE/NO en cada stop de un trip compartido.
-- Un usuario = un voto por stop_key (UPSERT).

create table if not exists stop_votes (
  id bigserial primary key,
  trip_slug text not null,
  stop_key text not null,          -- placeholder: coord hash or name-slug del stop
  user_id uuid references auth.users(id) on delete cascade,
  vote text not null,               -- 'like' | 'maybe' | 'no'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (trip_slug, stop_key, user_id)
);

create index if not exists idx_stop_votes_trip on stop_votes(trip_slug);
create index if not exists idx_stop_votes_stop on stop_votes(trip_slug, stop_key);

alter table stop_votes enable row level security;

-- Cualquiera con acceso al trip puede leer los votos agregados
-- (el trip_slug ya requiere auth para escribir; para leer permitimos anon
--  para que las URLs compartidas muestren consenso público sin login)
create policy "stop_votes_public_read" on stop_votes
  for select using (true);

-- Solo usuarios autenticados pueden votar
create policy "stop_votes_auth_insert" on stop_votes
  for insert with check (auth.uid() = user_id);

create policy "stop_votes_own_update" on stop_votes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "stop_votes_own_delete" on stop_votes
  for delete using (auth.uid() = user_id);

notify pgrst, 'reload schema';
