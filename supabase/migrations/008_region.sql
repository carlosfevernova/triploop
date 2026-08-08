-- Region field para templates multi-state (California, Nevada, Arizona, Southwest, etc)
alter table public.trips
  add column if not exists region text;

create index if not exists trips_region_template_idx
  on public.trips (region, is_template, is_public)
  where is_template = true;

-- Backfill: templates existentes son California
update public.trips set region = 'california'
  where is_template = true and region is null;
