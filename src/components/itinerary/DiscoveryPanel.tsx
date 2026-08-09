'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import type { ItineraryItem } from '@/lib/itinerary/types';
import { EmptyState, ErrorState } from '@/components/trip/StateFallbacks';
import { haversineKm } from '@/lib/itinerary/validate';

// S50: Discovery Panel dentro de itinerary — filtros + add directo al día.
// Diferencial vs Wanderlog Discover: usamos /api/places/discover (Google Places + Nominatim fallback)
// con bbox derivado de items existentes → resultados relevantes al viaje real, no lugar aleatorio.

interface DiscoveryPOI {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  category: string;
  rating?: number;
  user_ratings_total?: number;
  photo_url?: string;
  price_level?: number;
  google_place_id?: string;
}

const CATEGORIES: Array<{ key: string; emoji: string; label_en: string; label_es: string }> = [
  { key: 'food', emoji: '🍽️', label_en: 'Food', label_es: 'Comida' },
  { key: 'attraction', emoji: '🎡', label_en: 'Attractions', label_es: 'Atracciones' },
  { key: 'nature', emoji: '🌲', label_en: 'Nature', label_es: 'Naturaleza' },
  { key: 'hotel', emoji: '🏨', label_en: 'Hotels', label_es: 'Hoteles' },
  { key: 'shopping', emoji: '🛍️', label_en: 'Shopping', label_es: 'Compras' },
  { key: 'gas', emoji: '⛽', label_en: 'Gas', label_es: 'Gasolina' },
  { key: 'ev', emoji: '⚡', label_en: 'EV', label_es: 'EV' }
];

type SortKey = 'rating' | 'distance';

interface Props {
  slug: string;
  dayItems: ItineraryItem[];    // items del día seleccionado (para calcular bbox y distance sort)
  locale: 'en' | 'es';
  onAdd: (partial: Partial<ItineraryItem>) => Promise<void> | void;
}

// Bounding box con padding (km) alrededor de items
function computeBbox(items: ItineraryItem[], paddingKm: number): [number, number, number, number] | null {
  const withCoords = items.filter(i => i.lat != null && i.lng != null);
  if(withCoords.length === 0) return null;
  const lats = withCoords.map(i => i.lat!);
  const lngs = withCoords.map(i => i.lng!);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  // 1° lat ≈ 111 km, 1° lng ≈ 111 km * cos(lat)
  const centerLat = (minLat + maxLat) / 2;
  const dLat = paddingKm / 111;
  const dLng = paddingKm / (111 * Math.cos(centerLat * Math.PI / 180));
  return [minLng - dLng, minLat - dLat, maxLng + dLng, maxLat + dLat];
}

function centroid(items: ItineraryItem[]): { lat: number; lng: number } | null {
  const withCoords = items.filter(i => i.lat != null && i.lng != null);
  if(withCoords.length === 0) return null;
  const lat = withCoords.reduce((s, i) => s + i.lat!, 0) / withCoords.length;
  const lng = withCoords.reduce((s, i) => s + i.lng!, 0) / withCoords.length;
  return { lat, lng };
}

export function DiscoveryPanel({ slug: _slug, dayItems, locale, onAdd }: Props){
  const isEs = locale === 'es';
  const [category, setCategory] = useState<string>('attraction');
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [minRating, setMinRating] = useState<number>(0);
  const [sort, setSort] = useState<SortKey>('rating');
  const [results, setResults] = useState<DiscoveryPOI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(false);

  const anchor = useMemo(() => centroid(dayItems), [dayItems]);

  const search = useCallback(async () => {
    const bbox = computeBbox(dayItems, radiusKm);
    if(!bbox){ setResults([]); return; }
    setLoading(true); setError(null);
    try {
      const r = await fetch('/api/places/discover', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ bbox, category, maxResults: 20 })
      });
      const data = await r.json();
      if(!r.ok){ setError(data.error || 'discover_failed'); return; }
      setResults(data.pois || []);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, [dayItems, radiusKm, category]);

  useEffect(() => {
    if(expanded && dayItems.length > 0) search();
  }, [expanded, category, radiusKm, search, dayItems.length]);

  const filtered = useMemo(() => {
    let arr = results.filter(p => (p.rating || 0) >= minRating);
    if(sort === 'rating') arr = arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if(sort === 'distance' && anchor){
      arr = arr.sort((a, b) => haversineKm(anchor, a) - haversineKm(anchor, b));
    }
    return arr;
  }, [results, minRating, sort, anchor]);

  const handleAdd = async (p: DiscoveryPOI) => {
    setAdded(prev => new Set(prev).add(p.id));
    await onAdd({
      type: p.category === 'food' ? 'meal' : p.category === 'hotel' ? 'hotel' : 'place',
      title: p.name,
      place_id: p.google_place_id || p.id,
      lat: p.lat,
      lng: p.lng,
      address: p.address || null,
      duration_min: p.category === 'food' ? 60 : 90
    });
  };

  if(!expanded){
    return (
      <div className="border-t border-ink-100 bg-gradient-to-br from-ocean-400/5 via-white to-coral-50/30 px-4 py-3">
        <button
          onClick={() => setExpanded(true)}
          disabled={dayItems.length === 0}
          className="flex w-full items-center justify-between rounded-pill border border-ink-200 bg-white px-4 py-2.5 text-left text-sm font-semibold text-ink-800 transition hover:border-ocean-500 hover:shadow-card disabled:opacity-50"
        >
          <span className="flex items-center gap-2">
            <span aria-hidden>🔍</span>
            {isEs ? 'Descubre paradas cercanas' : 'Discover nearby stops'}
          </span>
          <span className="text-ocean-600">
            {dayItems.length === 0
              ? (isEs ? 'Agrega paradas primero' : 'Add stops first')
              : `▾`}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-ink-100 bg-gradient-to-br from-ocean-400/5 via-white to-coral-50/30 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-ink-900">
          <span aria-hidden>🔍</span>
          {isEs ? 'Descubre paradas' : 'Discover stops'}
        </h3>
        <button
          onClick={() => setExpanded(false)}
          className="text-xs text-ink-500 hover:text-ink-800"
        >{isEs ? 'Cerrar' : 'Close'} ▴</button>
      </div>

      {/* Category chips */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {CATEGORIES.map(c => {
          const active = category === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`rounded-pill border px-2.5 py-1 text-[11px] font-medium transition ${
                active ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 bg-white text-ink-700 hover:border-ink-500'
              }`}
            >{c.emoji} {isEs ? c.label_es : c.label_en}</button>
          );
        })}
      </div>

      {/* Filters row */}
      <div className="mb-3 grid grid-cols-2 gap-2 rounded-lg border border-ink-100 bg-white p-3 text-xs">
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
            {isEs ? 'Radio' : 'Radius'}: {radiusKm} km
          </span>
          <input
            type="range" min={1} max={50} step={1} value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="mt-1 w-full accent-ocean-500"
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
            {isEs ? 'Rating mínimo' : 'Min rating'}: {minRating === 0 ? (isEs ? 'todos' : 'any') : `${minRating.toFixed(1)}★`}
          </span>
          <input
            type="range" min={0} max={4.5} step={0.5} value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="mt-1 w-full accent-coral-500"
          />
        </label>
        <div className="col-span-2 flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
            {isEs ? 'Ordenar' : 'Sort'}:
          </span>
          <div className="flex gap-1 rounded-pill border border-ink-200 bg-ink-50 p-0.5">
            {(['rating', 'distance'] as const).map(k => (
              <button
                key={k}
                onClick={() => setSort(k)}
                className={`rounded-pill px-2 py-0.5 text-[10px] font-semibold ${sort === k ? 'bg-ink-900 text-white' : 'text-ink-500'}`}
              >
                {k === 'rating' ? (isEs ? '★ Rating' : '★ Rating') : (isEs ? '📏 Distancia' : '📏 Distance')}
              </button>
            ))}
          </div>
          <span className="ml-auto text-[10px] text-ink-400">{filtered.length} {isEs ? 'resultados' : 'results'}</span>
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="space-y-1.5">
          {[0,1,2,3].map(i => <div key={i} className="h-14 animate-pulse rounded-lg bg-ink-100" />)}
        </div>
      )}
      {error && <ErrorState error={error} onRetry={search} locale={locale} compact />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          icon="🔍"
          title={isEs ? 'Sin resultados' : 'No results'}
          hint={isEs ? 'Amplía el radio o cambia categoría.' : 'Widen the radius or change category.'}
        />
      )}
      <ul className="max-h-96 space-y-1.5 overflow-y-auto">
        {filtered.map(p => {
          const dist = anchor ? haversineKm(anchor, p) : null;
          const isAdded = added.has(p.id);
          return (
            <li key={p.id} className="flex gap-2 rounded-lg border border-ink-100 bg-white p-2 hover:border-ocean-400 hover:shadow-card">
              {p.photo_url ? (
                <img src={p.photo_url} alt="" className="h-14 w-14 shrink-0 rounded-md object-cover" loading="lazy" />
              ) : (
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-md bg-ink-50 text-xl">📍</div>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold text-ink-900">{p.name}</div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-ink-500">
                  {p.rating && <span className="font-semibold text-amber-600">★ {p.rating.toFixed(1)}</span>}
                  {p.user_ratings_total && <span className="text-ink-400">({p.user_ratings_total})</span>}
                  {typeof p.price_level === 'number' && p.price_level > 0 && <span className="text-emerald-600">{'$'.repeat(p.price_level)}</span>}
                  {dist !== null && <span>· {dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`}</span>}
                </div>
                {p.address && <p className="mt-0.5 truncate text-[10px] text-ink-400">{p.address}</p>}
              </div>
              <button
                onClick={() => handleAdd(p)}
                disabled={isAdded}
                className={`shrink-0 self-center rounded-pill px-3 py-1 text-[11px] font-semibold transition ${
                  isAdded ? 'bg-emerald-100 text-emerald-700' : 'bg-ocean-500 text-white hover:bg-ocean-600'
                }`}
              >
                {isAdded ? (isEs ? '✓' : '✓') : `+ ${isEs ? 'Agregar' : 'Add'}`}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
