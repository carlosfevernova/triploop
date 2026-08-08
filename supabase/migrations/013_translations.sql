-- Multi-locale translations para templates (mismo slug, contenido en varios idiomas)
alter table public.trips
  add column if not exists translations jsonb default '{}'::jsonb;

comment on column public.trips.translations is 'Locale-keyed content: {"es":{"title":"...","seo_description":"...","stops":[{"name":"..."}]}}';
