-- S46 P5: Habilitar Realtime broadcast para itinerary tables (colaboración multi-usuario)
alter publication supabase_realtime add table public.trip_days;
alter publication supabase_realtime add table public.itinerary_items;
