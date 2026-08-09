'use client';
import { useEffect, useState } from 'react';
import type { PlaceSuggestion, TripStop } from '@/lib/types';
import { ErrorState, EmptyState } from './StateFallbacks';

interface Props {
  open: boolean;
  onClose: () => void;
  anchor: TripStop | null;
  onAdd: (place: PlaceSuggestion) => void;
  isEs?: boolean;
}

const CATEGORY_OPTIONS: Array<{ key: string; label_en: string; label_es: string; emoji: string }> = [
  { key: '', label_en: 'All', label_es: 'Todo', emoji: '🌐' },
  { key: 'food', label_en: 'Food', label_es: 'Comida', emoji: '🍽️' },
  { key: 'attraction', label_en: 'Attractions', label_es: 'Atracciones', emoji: '🎡' },
  { key: 'nature', label_en: 'Nature', label_es: 'Naturaleza', emoji: '🌲' },
  { key: 'hotel', label_en: 'Hotels', label_es: 'Hoteles', emoji: '🏨' },
  { key: 'bar', label_en: 'Bars', label_es: 'Bares', emoji: '🍸' }
];

export function NearbyPanel({ open, onClose, anchor, onAdd, isEs }: Props){
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PlaceSuggestion[]>([]);
  const [category, setCategory] = useState('');
  const [radius, setRadius] = useState(2000);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());

  const search = async () => {
    if(!anchor) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/places/nearby', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ lat: anchor.lat, lng: anchor.lng, radius, category: category || undefined, maxResults: 15 })
      });
      const data = await r.json();
      if(!r.ok) throw new Error(data.detail || data.error || 'error');
      setResults(data.suggestions || []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(open && anchor) search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, anchor?.id, category, radius]);

  const handleAdd = (p: PlaceSuggestion) => {
    onAdd(p);
    setAdded((prev) => new Set(prev).add(p.place_id));
  };

  if(!open || !anchor) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm" aria-hidden />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl">
        <header className="border-b border-ink-100 bg-gradient-to-br from-ocean-400/10 via-white to-coral-50 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🔍</span>
                <h2 className="font-display text-xl font-semibold text-ink-900">
                  {isEs ? 'Cerca de' : 'Nearby'}
                </h2>
              </div>
              <p className="mt-1 truncate text-sm font-semibold text-ink-700">{anchor.name}</p>
              <p className="text-xs text-ink-500">
                {isEs ? 'Radio' : 'Radius'}: {(radius / 1000).toFixed(1)} km
              </p>
            </div>
            <button onClick={onClose} className="rounded-full p-1.5 text-ink-500 transition hover:bg-ink-100" aria-label="Close">✕</button>
          </div>

          {/* Category chips */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {CATEGORY_OPTIONS.map((opt) => {
              const active = category === opt.key;
              return (
                <button
                  key={opt.key || 'all'}
                  onClick={() => setCategory(opt.key)}
                  className={`rounded-pill border px-2.5 py-1 text-[11px] font-medium transition ${
                    active
                      ? 'border-ink-900 bg-ink-900 text-white'
                      : 'border-ink-200 bg-white text-ink-700 hover:border-ink-500'
                  }`}
                >
                  {opt.emoji} {isEs ? opt.label_es : opt.label_en}
                </button>
              );
            })}
          </div>

          {/* Radius slider */}
          <div className="mt-3 flex items-center gap-2 text-[10px] text-ink-500">
            <span>500m</span>
            <input
              type="range"
              min={500}
              max={10000}
              step={500}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="flex-1 accent-coral-500"
            />
            <span>10km</span>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4">
          {loading && (
            <div className="space-y-2">
              {[0, 1, 2, 3].map((i) => (<div key={i} className="h-20 animate-pulse rounded-card bg-ink-100" />))}
            </div>
          )}
          {error && (
            <ErrorState error={error} onRetry={search} locale={isEs ? 'es' : 'en'} />
          )}
          {!loading && !error && results.length === 0 && (
            <EmptyState
              icon="🗺️"
              title={isEs ? 'Sin resultados' : 'No results'}
              hint={isEs ? 'Aumenta el radio o cambia la categoría.' : 'Try widening the radius or switching category.'}
              cta={{ label: isEs ? '📏 Radio 10 km' : '📏 10 km radius', onClick: () => setRadius(10000) }}
            />
          )}
          <ul className="space-y-2">
            {results.map((p) => {
              const isAdded = added.has(p.place_id);
              return (
                <li key={p.place_id} className="group overflow-hidden rounded-card border border-ink-100 bg-white transition hover:border-ocean-400 hover:shadow-card">
                  <div className="flex gap-3">
                    {p.photo_url ? (
                      <img src={p.photo_url} alt="" className="h-24 w-24 flex-shrink-0 object-cover" loading="lazy" />
                    ) : (
                      <div className="grid h-24 w-24 flex-shrink-0 place-items-center bg-gradient-to-br from-ink-50 to-ink-100 text-2xl">📍</div>
                    )}
                    <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
                      <div>
                        <h3 className="truncate font-display text-sm font-semibold text-ink-900">{p.name}</h3>
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-ink-500">{p.formatted_address}</p>
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-ink-500">
                          {p.rating ? (
                            <span className="inline-flex items-center gap-0.5 font-semibold text-amber-600">
                              ★ {p.rating.toFixed(1)}
                              {p.user_ratings_total ? <span className="text-ink-400">({p.user_ratings_total})</span> : null}
                            </span>
                          ) : null}
                          {typeof p.price_level === 'number' && p.price_level > 0 ? (
                            <>
                              {p.rating ? <span>·</span> : null}
                              <span className="text-emerald-600">{'$'.repeat(p.price_level)}</span>
                            </>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleAdd(p)}
                          disabled={isAdded}
                          className={`rounded-pill px-3 py-1 text-[11px] font-semibold transition ${
                            isAdded
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-ocean-400 text-white hover:brightness-110'
                          }`}
                        >
                          {isAdded ? (isEs ? '✓ Agregado' : '✓ Added') : (isEs ? '+ Agregar' : '+ Add')}
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
}
