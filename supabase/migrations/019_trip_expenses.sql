-- S43 P1: Financial tracker por trip
-- Cada usuario puede registrar gastos reales/booked per categoría en su trip.
-- El BudgetCard muestra: budget vs booked vs actual vs remaining.

create table if not exists trip_expenses (
  id bigserial primary key,
  trip_slug text not null,
  user_id uuid references auth.users(id) on delete cascade,
  category text not null,          -- 'gas' | 'hotels' | 'food' | 'attractions' | 'flights' | 'shopping' | 'other'
  amount numeric(10, 2) not null,
  currency text not null default 'USD',
  kind text not null default 'actual', -- 'booked' | 'actual'
  description text,
  incurred_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_trip_expenses_slug on trip_expenses(trip_slug);
create index if not exists idx_trip_expenses_user on trip_expenses(user_id);
create index if not exists idx_trip_expenses_category on trip_expenses(category);

alter table trip_expenses enable row level security;

-- User puede leer sus propios gastos
create policy "trip_expenses_own_read" on trip_expenses
  for select using (auth.uid() = user_id);

-- User puede insertar sus propios gastos
create policy "trip_expenses_own_insert" on trip_expenses
  for insert with check (auth.uid() = user_id);

-- User puede actualizar sus propios gastos
create policy "trip_expenses_own_update" on trip_expenses
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- User puede borrar sus propios gastos
create policy "trip_expenses_own_delete" on trip_expenses
  for delete using (auth.uid() = user_id);

notify pgrst, 'reload schema';
