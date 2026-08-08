-- S27: highway_notes text[] en trips para agregar info de freeways/highways
-- Ejemplo: ['I-5 (Seattle → Portland)', 'US-101 (Olympic Peninsula)', 'PCH (Highway 1)']

alter table if exists trips
  add column if not exists highway_notes text[];

comment on column trips.highway_notes is 'S27: freeway/highway route names visibles en trip header';

notify pgrst, 'reload schema';
