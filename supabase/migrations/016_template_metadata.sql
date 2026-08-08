-- S36: metadata enrichment for templates
-- best_season · difficulty · total_distance_km

alter table if exists trips
  add column if not exists best_season text,
  add column if not exists difficulty text,
  add column if not exists total_distance_km integer;

comment on column trips.best_season is 'S36: spring/summer/fall/winter/year-round/shoulder';
comment on column trips.difficulty is 'S36: easy/moderate/challenging/epic';
comment on column trips.total_distance_km is 'S36: distancia total aproximada en km';

notify pgrst, 'reload schema';
