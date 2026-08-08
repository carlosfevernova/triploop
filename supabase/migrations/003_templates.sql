-- Template trips: iconic California itineraries indexables SEO
alter table public.trips
  add column if not exists is_template boolean default false,
  add column if not exists seo_description text,
  add column if not exists seo_keywords text[],
  add column if not exists hero_image_url text;

create index if not exists trips_template_public_idx
  on public.trips (is_template, is_public)
  where is_template = true and is_public = true;

-- Templates son públicos y RLS ya permite SELECT is_public=true (o is_template).
