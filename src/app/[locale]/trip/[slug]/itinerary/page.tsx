'use client';
import { useEffect, useMemo, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DayNavigator } from '@/components/itinerary/DayNavigator';
import { DayTimeline } from '@/components/itinerary/DayTimeline';
import { EditItemDrawer } from '@/components/itinerary/EditItemDrawer';
import { AddItemInline } from '@/components/itinerary/AddItemInline';
import { AIAssistantDrawer } from '@/components/itinerary/AIAssistantDrawer';
import { UndoBanner } from '@/components/itinerary/UndoBanner';
import { OfflineQueueBadge } from '@/components/itinerary/OfflineQueueBadge';
import { DiscoveryPanel } from '@/components/itinerary/DiscoveryPanel';
import { FeatureTour } from '@/components/itinerary/FeatureTour';
import { useItineraryRealtime } from '@/lib/itinerary/use-itinerary-realtime';
import { trackItinerary } from '@/lib/itinerary/analytics';
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
  const [aiOpen, setAiOpen] = useState(false);
  const [undoSnapshot, setUndoSnapshot] = useState<ItineraryItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'itinerary' | 'map'>('itinerary');
  // S45 P2: route matrix real por día
  interface RealLeg { from_item_id: number; to_item_id: number; distance_m: number; duration_s: number; duration_traffic_s: number; polyline?: string }
  const [realLegsByDay, setRealLegsByDay] = useState<Record<number, RealLeg[]>>({});
  const [polylineByDay, setPolylineByDay] = useState<Record<number, string>>({});
  const [routeLoading, setRouteLoading] = useState(false);

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
      trackItinerary(slug, 'itinerary_viewed', { days: daysArr.length, items: itemsArr.length });
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, [slug, selectedDayId]);

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [slug]);

  // S46 P5 + S47: Realtime collab con self-echo filter
  const { markLocalMutation } = useItineraryRealtime({
    slug,
    enabled: !loading,
    onItemChange: ({ event, item, oldItem }) => {
      if(event === 'INSERT' && item){
        setItems(prev => prev.some(i => i.id === item.id) ? prev : [...prev, item]);
      } else if(event === 'UPDATE' && item){
        setItems(prev => prev.map(i => i.id === item.id ? item : i));
      } else if(event === 'DELETE' && oldItem){
        setItems(prev => prev.filter(i => i.id !== oldItem.id));
      }
    },
    onDayChange: ({ event, day, oldDay }) => {
      if(event === 'INSERT' && day){
        setDays(prev => prev.some(d => d.id === day.id) ? prev : [...prev, day].sort((a, b) => a.day_number - b.day_number));
      } else if(event === 'UPDATE' && day){
        setDays(prev => prev.map(d => d.id === day.id ? day : d));
      } else if(event === 'DELETE' && oldDay){
        setDays(prev => prev.filter(d => d.id !== oldDay.id));
      }
    }
  });

  // S45 P2: Fetch route matrix cuando cambia día seleccionado (debounced via effect)
  useEffect(() => {
    if(!selectedDayId) return;
    if(realLegsByDay[selectedDayId]) return; // ya cargado
    const dayItems = items.filter(i => i.trip_day_id === selectedDayId && i.lat && i.lng);
    if(dayItems.length < 2) return;
    setRouteLoading(true);
    (async () => {
      try {
        const r = await fetch(`/api/trips/${slug}/itinerary/route-matrix?day_id=${selectedDayId}`);
        const data = await r.json();
        if(r.ok && Array.isArray(data.legs)){
          setRealLegsByDay(prev => ({ ...prev, [selectedDayId]: data.legs }));
          if(data.polyline) setPolylineByDay(prev => ({ ...prev, [selectedDayId]: data.polyline }));
        }
      } catch { /* silent — fallback a haversine */ }
      finally { setRouteLoading(false); }
    })();
  }, [selectedDayId, items, slug, realLegsByDay]);

  // S45 P3.2 Schedule day
  const handleScheduleDay = useCallback(async () => {
    if(!selectedDayId) return;
    trackItinerary(slug, 'day_auto_scheduled', { day_id: selectedDayId });
    const r = await fetch(`/api/trips/${slug}/itinerary/schedule-day`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ day_id: selectedDayId })
    });
    if(r.ok) await load();
  }, [selectedDayId, slug, load]);

  // S45 P3.3 Optimize day
  const handleOptimizeDay = useCallback(async () => {
    if(!selectedDayId) return;
    // Preview first
    const pv = await fetch(`/api/trips/${slug}/itinerary/optimize-day`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ day_id: selectedDayId, preview: true })
    });
    const pvData = await pv.json();
    if(!pv.ok || pvData.saved_km == null || pvData.changes.length === 0){
      alert(isEs ? 'No hay mejora significativa' : 'No significant improvement');
      return;
    }
    const savedStr = pvData.saved_km < 1 ? `${Math.round(pvData.saved_km * 1000)} m` : `${pvData.saved_km.toFixed(1)} km`;
    const ok = confirm(isEs
      ? `Optimizar reduciría ${savedStr} de manejo (de ${pvData.before_km.toFixed(1)} km a ${pvData.after_km.toFixed(1)} km). ¿Aplicar?`
      : `Optimization would save ${savedStr} of driving (from ${pvData.before_km.toFixed(1)} km to ${pvData.after_km.toFixed(1)} km). Apply?`);
    if(!ok) return;
    const r = await fetch(`/api/trips/${slug}/itinerary/optimize-day`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ day_id: selectedDayId })
    });
    if(r.ok){
      trackItinerary(slug, 'route_optimized', { day_id: selectedDayId, saved_km: pvData.saved_km });
      setRealLegsByDay(prev => { const c = {...prev}; delete c[selectedDayId]; return c; });
      setPolylineByDay(prev => { const c = {...prev}; delete c[selectedDayId]; return c; });
      await load();
    }
  }, [selectedDayId, slug, isEs, load]);

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
    if(r.ok && data.item){
      markLocalMutation('item', data.item.id);
      setItems(prev => [...prev, data.item]);
      trackItinerary(slug, 'item_added', { item_id: data.item.id, day_id: selectedDayId, type: data.item.type });
    }
  };

  const handleEdit = async (patch: Partial<ItineraryItem>) => {
    if(!editItem) return;
    markLocalMutation('item', editItem.id);
    const r = await fetch(`/api/trips/${slug}/itinerary/items/${editItem.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(patch)
    });
    const data = await r.json();
    if(r.ok && data.item) setItems(prev => prev.map(i => i.id === editItem.id ? data.item : i));
  };

  const handleDelete = async (item: ItineraryItem) => {
    markLocalMutation('item', item.id);
    setItems(prev => prev.filter(i => i.id !== item.id));
    trackItinerary(slug, 'item_removed', { item_id: item.id, day_id: item.trip_day_id });
    const r = await fetch(`/api/trips/${slug}/itinerary/items/${item.id}`, { method: 'DELETE' });
    if(!r.ok){ await load(); }
  };

  const handleReorder = async (activeId: number, overId: number) => {
    const affected = items.filter(i => i.trip_day_id === selectedDayId);
    const reordered = localReorder(affected, activeId, overId);
    const patchMap = new Map(reordered.map(r => [r.id, r.position]));
    // Mark all reordered as local mutations
    for(const r of reordered) markLocalMutation('item', r.id);
    setItems(prev => prev.map(i => patchMap.has(i.id) ? { ...i, position: patchMap.get(i.id)! } : i));

    const updates = reordered.map(r => ({ id: r.id, position: r.position }));
    trackItinerary(slug, 'item_moved', { count: updates.length, day_id: selectedDayId });
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
          <OfflineQueueBadge locale={locale} onFlushed={load} />
          <Link
            href={`/${locale}/trip/${slug}/itinerary/print`}
            className="rounded-pill border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:border-ink-500"
            title={isEs ? 'Versión imprimible' : 'Printable version'}
          >🖨 {isEs ? 'Imprimir' : 'Print'}</Link>
          <button
            onClick={async () => {
              const url = window.location.href.replace('/itinerary', '/itinerary');
              try {
                if(navigator.share){ await navigator.share({ title: trip?.title, url }); }
                else { await navigator.clipboard.writeText(url); alert(isEs ? 'URL copiada' : 'URL copied'); }
              } catch { /* user cancel */ }
            }}
            className="rounded-pill border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:border-ink-500"
            title={isEs ? 'Compartir itinerario' : 'Share itinerary'}
          >🔗 {isEs ? 'Compartir' : 'Share'}</button>
          <button
            onClick={() => setAiOpen(true)}
            className="rounded-pill border border-coral-400 bg-coral-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-coral-600"
            title={isEs ? 'Asistente IA para editar en lenguaje natural' : 'AI assistant to edit in natural language'}
          >✨ {isEs ? 'IA' : 'AI'}</button>
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
        onSelect={(id) => { setSelectedDayId(id); trackItinerary(slug, 'day_selected', { day_id: id }); }}
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
            onScheduleDay={handleScheduleDay}
            onOptimizeDay={handleOptimizeDay}
            realLegs={selectedDayId ? realLegsByDay[selectedDayId] : undefined}
            routeLoading={routeLoading}
          />
          {/* S50: Discovery panel — filtros de paradas recomendadas */}
          <DiscoveryPanel slug={slug} dayItems={dayItems} locale={locale} onAdd={handleAdd} />
        </div>

        {/* Map */}
        <div className={`flex-1 border-l border-ink-100 ${mobileView === 'itinerary' ? 'hidden md:block' : 'block'}`}>
          {mapStops.length > 0 ? (
            <TripMap
              stops={mapStops}
              hoveredStopId={selectedItemId ? String(selectedItemId) : null}
              polyline={selectedDayId ? polylineByDay[selectedDayId] : undefined}
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
      {/* S50: FeatureTour first-visit */}
      <FeatureTour locale={locale} />

      <AIAssistantDrawer
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        slug={slug}
        items={items}
        days={days}
        locale={locale}
        onApplied={() => {
          trackItinerary(slug, 'ai_edit_applied', { items_before: items.length });
          setRealLegsByDay({}); setPolylineByDay({}); load();
        }}
        onSnapshotSaved={setUndoSnapshot}
      />
      <UndoBanner
        slug={slug}
        snapshot={undoSnapshot}
        onCleared={() => setUndoSnapshot(null)}
        onRestored={() => {
          trackItinerary(slug, 'item_undo', {});
          setRealLegsByDay({}); setPolylineByDay({}); load();
        }}
        locale={locale}
      />
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
