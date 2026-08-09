'use client';
import { useEffect, useMemo, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DayNavigator } from '@/components/itinerary/DayNavigator';
import { DayTimeline } from '@/components/itinerary/DayTimeline';
import { EditItemDrawer } from '@/components/itinerary/EditItemDrawer';
import { AddItemInline } from '@/components/itinerary/AddItemInline';
import { ErrorState } from '@/components/trip/StateFallbacks';
import { localReorder } from '@/lib/itinerary/positions';
import type { ItineraryItem, TripDay } from '@/lib/itinerary/types';
import type { Trip } from '@/lib/types';

// Map lazy (evita SSR issues MapLibre)
const TripMap = dynamic(() => import('@/components/trip/TripMap').then(m => ({ default: m.TripMap })), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-ink-100" />
});

export default function ItineraryPage(){
  const params = useParams<{ locale: string; slug: string }>();
  const slug = params.slug;
  const locale: 'en' | 'es' = params.locale === 'es' ? 'es' : 'en';
  const isEs = locale === 'es';

  const [trip, setTrip] = useState<Trip | null>(null);
  const [days, setDays] = useState<TripDay[]>([]);
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<ItineraryItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'itinerary' | 'map'>('itinerary');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tripR, itR] = await Promise.all([
        fetch(`/api/trips/${slug}`).then(r => r.json()),
        fetch(`/api/trips/${slug}/itinerary`).then(r => r.json())
      ]);
      if(!tripR.trip) throw new Error(tripR.error || 'trip_not_found');
      setTrip(tripR.trip);
      let daysArr: TripDay[] = itR.days || [];
      const itemsArr: ItineraryItem[] = itR.items || [];

      // Auto-seed days si no existen
      if(daysArr.length === 0){
        const seed = await fetch(`/api/trips/${slug}/itinerary`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ timezone: Intl.DateTimeFormat().resolvedOptions().timeZone })
        }).then(r => r.json());
        if(seed.days) daysArr = seed.days;
      }
      setDays(daysArr);
      setItems(itemsArr);
      // Select first day por default
      if(daysArr.length > 0 && selectedDayId == null){
        setSelectedDayId(daysArr[0].id);
      }
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, [slug, selectedDayId]);

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [slug]);

  const dayItems = useMemo(
    () => items.filter(i => i.trip_day_id === selectedDayId),
    [items, selectedDayId]
  );

  const itemsCountByDay = useMemo(() => {
    const map: Record<number, number> = {};
    for(const i of items) if(i.trip_day_id != null) map[i.trip_day_id] = (map[i.trip_day_id] || 0) + 1;
    return map;
  }, [items]);

  const unscheduledCount = items.filter(i => i.trip_day_id == null).length;

  // ---- Handlers ----

  const handleAdd = async (partial: Partial<ItineraryItem>) => {
    const body = { ...partial, trip_day_id: selectedDayId };
    const r = await fetch(`/api/trips/${slug}/itinerary/items`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    if(r.ok && data.item) setItems(prev => [...prev, data.item]);
  };

  const handleEdit = async (patch: Partial<ItineraryItem>) => {
    if(!editItem) return;
    const r = await fetch(`/api/trips/${slug}/itinerary/items/${editItem.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(patch)
    });
    const data = await r.json();
    if(r.ok && data.item) setItems(prev => prev.map(i => i.id === editItem.id ? data.item : i));
  };

  const handleDelete = async (item: ItineraryItem) => {
    // Optimistic
    setItems(prev => prev.filter(i => i.id !== item.id));
    const r = await fetch(`/api/trips/${slug}/itinerary/items/${item.id}`, { method: 'DELETE' });
    if(!r.ok){ await load(); /* rollback */ }
  };

  const handleReorder = async (activeId: number, overId: number) => {
    // Optimistic reorder local
    const affected = items.filter(i => i.trip_day_id === selectedDayId);
    const reordered = localReorder(affected, activeId, overId);
    const patchMap = new Map(reordered.map(r => [r.id, r.position]));
    setItems(prev => prev.map(i => patchMap.has(i.id) ? { ...i, position: patchMap.get(i.id)! } : i));

    // Persist batch
    const updates = reordered.map(r => ({ id: r.id, position: r.position }));
    const res = await fetch(`/api/trips/${slug}/itinerary/reorder`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ updates })
    });
    if(!res.ok){ await load(); }
  };

  // ---- Map data ----
  const mapStops = useMemo(() => {
    return dayItems
      .filter(i => i.lat && i.lng)
      .sort((a, b) => a.position - b.position)
      .map((i, idx) => ({
        id: String(i.id),
        name: i.title,
        lat: Number(i.lat),
        lng: Number(i.lng),
        day: idx + 1
      }));
  }, [dayItems]);

  if(loading){
    return <div className="grid h-screen place-items-center bg-ink-50 text-sm text-ink-500">
      <div className="animate-pulse">{isEs ? 'Cargando itinerario…' : 'Loading itinerary…'}</div>
    </div>;
  }

  if(error){
    return <div className="mx-auto max-w-md p-8">
      <ErrorState error={error} onRetry={load} locale={locale} />
      <Link href={`/${locale}/trip/${slug}`} className="mt-4 block text-center text-sm text-ocean-600 underline">
        ← {isEs ? 'Volver al viaje' : 'Back to trip'}
      </Link>
    </div>;
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-ink-100 bg-white px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link href={`/${locale}/trip/${slug}`} className="rounded-pill border border-ink-200 px-3 py-1 text-xs font-semibold text-ink-700 hover:border-ink-500">
            ← {isEs ? 'Vista clásica' : 'Classic view'}
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-display text-base font-semibold text-ink-900">{trip?.title}</h1>
            {trip?.start_date && trip?.end_date && (
              <p className="text-[10px] text-ink-500">{trip.start_date} → {trip.end_date}</p>
            )}
          </div>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <span className="rounded-pill bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-800">
            {items.length} {isEs ? 'items' : 'items'}
          </span>
          <span className="rounded-pill bg-ocean-50 px-2 py-1 text-[10px] font-semibold text-ocean-800">
            {days.length} {isEs ? 'días' : 'days'}
          </span>
        </div>
        {/* Mobile toggle */}
        <div className="flex gap-1 rounded-pill border border-ink-200 bg-white p-0.5 md:hidden">
          {(['itinerary', 'map'] as const).map(v => (
            <button
              key={v}
              onClick={() => setMobileView(v)}
              className={`rounded-pill px-3 py-1 text-[11px] font-semibold ${mobileView === v ? 'bg-ink-900 text-white' : 'text-ink-500'}`}
            >{isEs ? (v === 'itinerary' ? 'Plan' : 'Mapa') : (v === 'itinerary' ? 'Plan' : 'Map')}</button>
          ))}
        </div>
      </header>

      {/* Day nav */}
      <DayNavigator
        days={days}
        selectedDayId={selectedDayId}
        onSelect={setSelectedDayId}
        locale={locale}
        itemsCountByDay={itemsCountByDay}
        unscheduledCount={unscheduledCount}
      />

      {/* Main split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Timeline */}
        <div className={`flex flex-1 flex-col ${mobileView === 'map' ? 'hidden md:flex' : 'flex'} md:max-w-xl`}>
          <DayTimeline
            day={days.find(d => d.id === selectedDayId) || null}
            items={dayItems}
            locale={locale}
            selectedItemId={selectedItemId}
            onSelectItem={setSelectedItemId}
            onReorder={handleReorder}
            onEdit={setEditItem}
            onDelete={handleDelete}
            onAdd={() => setAddOpen(true)}
          />
        </div>

        {/* Map */}
        <div className={`flex-1 border-l border-ink-100 ${mobileView === 'itinerary' ? 'hidden md:block' : 'block'}`}>
          {mapStops.length > 0 ? (
            <TripMap
              stops={mapStops}
              hoveredStopId={selectedItemId ? String(selectedItemId) : null}
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-ink-400">
              <div className="text-center">
                <div className="mb-2 text-4xl">🗺️</div>
                <p>{isEs ? 'Agrega paradas con coordenadas para verlas en el mapa.' : 'Add stops with coordinates to see them on the map.'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddItemInline open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} locale={locale} />
      <EditItemDrawer
        open={editItem !== null}
        onClose={() => setEditItem(null)}
        item={editItem}
        days={days}
        locale={locale}
        onSave={handleEdit}
      />
    </div>
  );
}
