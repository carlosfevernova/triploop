-- POI cache: Google Places enriched data, TTL controlado por app (30d)
create table if not exists public.pois (
  id uuid primary key default gen_random_uuid(),
  google_place_id text unique,
  name text not null,
  address text,
  lat double precision,
  lng double precision,
  category text,
  types text[],
  rating numeric(2,1),
  user_ratings_total int,
  phone text,
  website text,
  opening_hours jsonb,
  photo_url text,
  price_level int,
  raw jsonb,
  fetched_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists pois_geo_idx on public.pois (lat, lng);
create index if not exists pois_place_id_idx on public.pois (google_place_id);
create index if not exists pois_fetched_idx on public.pois (fetched_at);

alter table public.pois enable row level security;

drop policy if exists "pois_public_read" on public.pois;
create policy "pois_public_read" on public.pois for select using (true);

-- No insert/update policies → writes only via service_role from Edge Functions
grant select on public.pois to anon, authenticated;
