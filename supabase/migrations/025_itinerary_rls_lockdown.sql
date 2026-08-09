-- S69 P0 SECURITY FIX: RLS lockdown en trip_days + itinerary_items
-- Root cause detectado por audit general-purpose: policies UPDATE/DELETE usaban `using(true) with check(true)`,
-- permitiendo que cualquier usuario autenticado modifique/borre el itinerario de cualquier viaje.
-- El comentario "API es admin client, no RLS" asumía solo API server-side, pero el Realtime SDK browser
-- respeta RLS y podría exponer UPDATE/DELETE si el hook cambia en el futuro.
--
-- Fix: policies ahora verifican ownership del trip padre (via trip_slug JOIN a trips.owner_id).
-- APIs server-side siguen bypasseando via service_role (correcto).

-- =============================================================
-- trip_days: reemplazar policies permissivas
-- =============================================================
drop policy if exists "trip_days_auth_write_update" on trip_days;
drop policy if exists "trip_days_auth_write_delete" on trip_days;
drop policy if exists "trip_days_auth_write_insert" on trip_days;

-- INSERT: solo owner del trip (o trip anónimo sin owner)
create policy "trip_days_owner_insert" on trip_days
  for insert with check (
    exists (
      select 1 from trips t
      where t.slug = trip_slug
        and (t.owner_id is null or t.owner_id = auth.uid())
    )
  );

-- UPDATE: solo owner del trip (o trip anónimo)
create policy "trip_days_owner_update" on trip_days
  for update using (
    exists (
      select 1 from trips t
      where t.slug = trip_slug
        and (t.owner_id is null or t.owner_id = auth.uid())
    )
  );

-- DELETE: solo owner del trip (o trip anónimo)
create policy "trip_days_owner_delete" on trip_days
  for delete using (
    exists (
      select 1 from trips t
      where t.slug = trip_slug
        and (t.owner_id is null or t.owner_id = auth.uid())
    )
  );

-- =============================================================
-- itinerary_items: reemplazar policies permissivas
-- =============================================================
drop policy if exists "itinerary_items_auth_write_update" on itinerary_items;
drop policy if exists "itinerary_items_auth_write_delete" on itinerary_items;
drop policy if exists "itinerary_items_auth_write_insert" on itinerary_items;

create policy "itinerary_items_owner_insert" on itinerary_items
  for insert with check (
    exists (
      select 1 from trips t
      where t.slug = trip_slug
        and (t.owner_id is null or t.owner_id = auth.uid())
    )
  );

create policy "itinerary_items_owner_update" on itinerary_items
  for update using (
    exists (
      select 1 from trips t
      where t.slug = trip_slug
        and (t.owner_id is null or t.owner_id = auth.uid())
    )
  );

create policy "itinerary_items_owner_delete" on itinerary_items
  for delete using (
    exists (
      select 1 from trips t
      where t.slug = trip_slug
        and (t.owner_id is null or t.owner_id = auth.uid())
    )
  );

-- Reload PostgREST schema cache
notify pgrst, 'reload schema';
