'use client';
import { useEffect, useState } from 'react';
import type { PlaceSuggestion, TripStop } from '@/lib/types';
import { ErrorState, EmptyState } from './StateFallbacks';
import { L } from '@/lib/l4';
import type { Locale } from '@/i18n/request';

// S71n: 4-locale migration. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
interface Props {
  open: boolean;
  onClose: () => void;
  anchor: TripStop | null;
  onAdd: (place: PlaceSuggestion) => void;
  isEs?: boolean;
  locale?: string;
}

type LangStr = Record<Locale, string>;
const CATEGORY_OPTIONS: Array<{ key: string; label: LangStr; emoji: string }> = [
  { key: '',           label: { en: 'All',         es: 'Todo',        pt: 'Tudo',       de: 'Alle' },              emoji: '🌐' },
  { key: 'food',       label: { en: 'Food',        es: 'Comida',      pt: 'Comida',     de: 'Essen' },             emoji: '🍽️' },
  { key: 'attraction', label: { en: 'Attractions', es: 'Atracciones', pt: 'Atrações',   de: 'Sehenswürdigkeiten' },emoji: '🎡' },
  { key: 'nature',     label: { en: 'Nature',      es: 'Naturaleza',  pt: 'Natureza',   de: 'Natur' },             emoji: '🌲' },
  { key: 'hotel',      label: { en: 'Hotels',      es: 'Hoteles',     pt: 'Hotéis',     de: 'Hotels' },            emoji: '🏨' },
  { key: 'bar',        label: { en: 'Bars',        es: 'Bares',       pt: 'Bares',      de: 'Bars' },              emoji: '🍸' }
];

export function NearbyPanel({ open, onClose, anchor, onAdd, isEs, locale: localeProp }: Props){
  const locale = localeProp || (isEs ? 'es' : 'en');
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
                  {L(locale, { en: 'Nearby', es: 'Cerca de', pt: 'Perto de', de: 'In der Nähe' })}
                </h2>
              </div>
              <p className="mt-1 truncate text-sm font-semibold text-ink-700">{anchor.name}</p>
              <p className="text-xs text-ink-500">
                {L(locale, { en: 'Radius', es: 'Radio', pt: 'Raio', de: 'Radius' })}: {(radius / 1000).toFixed(1)} km
              </p>
            </div>
            <button onClick={onClose} className="rounded-full p-1.5 text-ink-500 transition hover:bg-ink-100" aria-label={L(locale, { en: 'Close', es: 'Cerrar', pt: 'Fechar', de: 'Schließen' })}>✕</button>
          </div>

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
                  {opt.emoji} {L(locale, opt.label)}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center gap-2 text-[10px] text-ink-500">
            <span>500m</span>
            <input
              type="range" min={500} max={10000} step={500}
              value={radius} onChange={(e) => setRadius(Number(e.target.value))}
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
            <ErrorState error={error} onRetry={search} locale={(locale === 'es' ? 'es' : 'en') as 'en' | 'es'} />
          )}
          {!loading && !error && results.length === 0 && (
            <EmptyState
              icon="🗺️"
              title={L(locale, { en: 'No results', es: 'Sin resultados', pt: 'Sem resultados', de: 'Keine Ergebnisse' })}
              hint={L(locale, {
                en: 'Try widening the radius or switching category.',
                es: 'Aumenta el radio o cambia la categoría.',
                pt: 'Aumente o raio ou mude a categoria.',
                de: 'Vergrößere den Radius oder wechsle die Kategorie.'
              })}
              cta={{ label: L(locale, { en: '📏 10 km radius', es: '📏 Radio 10 km', pt: '📏 Raio 10 km', de: '📏 Radius 10 km' }), onClick: () => setRadius(10000) }}
            />
          )}
          <ul className="space-y-2">
            {results.map((p) => {
              const isAdded = added.has(p.place_id);
              return (
                <li key={p.place_id} className="group overflow-hidden rounded-card border border-ink-100 bg-white transition hover:border-ocean-400 hover:shadow-card">
                  <div className="flex gap-3">
                    {p.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
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
                          {isAdded
                            ? L(locale, { en: '✓ Added', es: '✓ Agregado', pt: '✓ Adicionado', de: '✓ Hinzugefügt' })
                            : L(locale, { en: '+ Add', es: '+ Agregar', pt: '+ Adicionar', de: '+ Hinzufügen' })}
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
