'use client';
import { useState } from 'react';
import type { POICategory, DiscoveryPOI } from '@/app/api/places/discover/route';

const CATEGORIES: { key: POICategory; emoji: string; en: string; es: string; color: string }[] = [
  { key: 'food',       emoji: '🍴', en: 'Food',       es: 'Comida',     color: 'bg-pink-500' },
  { key: 'attraction', emoji: '🎨', en: 'Attractions', es: 'Atracciones', color: 'bg-amber-500' },
  { key: 'nature',     emoji: '🏞️', en: 'Nature',     es: 'Naturaleza', color: 'bg-emerald-500' },
  { key: 'hotel',      emoji: '🏨', en: 'Hotels',     es: 'Hoteles',    color: 'bg-purple-500' },
  { key: 'gas',        emoji: '⛽', en: 'Gas',        es: 'Gasolina',   color: 'bg-sky-500' },
  { key: 'ev',         emoji: '⚡', en: 'EV',         es: 'EV',         color: 'bg-lime-500' },
  { key: 'shopping',   emoji: '🛍️', en: 'Shop',       es: 'Tiendas',    color: 'bg-rose-500' }
];

interface Props {
  selected: POICategory | null;
  onSelect: (cat: POICategory | null) => void;
  loading?: boolean;
  count?: number;
  isEs?: boolean;
  selectedPoi?: DiscoveryPOI | null;
  onAddPoi?: (poi: DiscoveryPOI) => void;
  onDismissPoi?: () => void;
}

// Floating chip bar (top-left del mapa) + popup POI selected inline.
export function POIDiscoveryChips({ selected, onSelect, loading, count, isEs, selectedPoi, onAddPoi, onDismissPoi }: Props){
  const [expanded, setExpanded] = useState(false);
  const visibleCats = expanded ? CATEGORIES : CATEGORIES.slice(0, 4);

  return (
    <>
      {/* Chip bar */}
      <div className="pointer-events-auto absolute left-3 top-3 z-10 flex max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-1.5 rounded-pill border border-ink-100 bg-white/95 p-1.5 shadow-card-hover backdrop-blur-md">
        <span className="pl-2 pr-1 text-[10px] font-bold uppercase tracking-widest text-ink-500">
          {isEs ? 'Explorar' : 'Explore'}
        </span>
        {visibleCats.map((c) => (
          <button
            key={c.key}
            onClick={() => onSelect(selected === c.key ? null : c.key)}
            className={`group inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-semibold transition ${
              selected === c.key
                ? `${c.color} text-white shadow-glow`
                : 'bg-ink-50 text-ink-700 hover:bg-ink-100'
            }`}
            title={isEs ? c.es : c.en}
          >
            <span aria-hidden>{c.emoji}</span>
            <span className="hidden md:inline">{isEs ? c.es : c.en}</span>
          </button>
        ))}
        {!expanded && CATEGORIES.length > 4 && (
          <button onClick={() => setExpanded(true)} className="rounded-pill px-2 py-1 text-xs font-semibold text-ink-500 hover:bg-ink-100">+</button>
        )}
        {selected && (
          <div className="ml-1 flex items-center gap-1 border-l border-ink-200 pl-2 text-[10px] font-medium text-ink-500">
            {loading ? (
              <>
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                {isEs ? 'Buscando…' : 'Loading…'}
              </>
            ) : (
              <>
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                {count} {isEs ? 'resultados' : 'results'}
              </>
            )}
          </div>
        )}
      </div>

      {/* Selected POI popup */}
      {selectedPoi && (
        <div className="pointer-events-auto absolute bottom-4 left-1/2 z-20 w-[92%] max-w-md -translate-x-1/2 overflow-hidden rounded-card border border-ink-100 bg-white shadow-2xl">
          {selectedPoi.photo_url && (
            <img src={selectedPoi.photo_url} alt="" className="h-32 w-full object-cover" loading="lazy" />
          )}
          <div className="p-4">
            <div className="mb-1 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="truncate font-display text-base font-semibold text-ink-900">{selectedPoi.name}</h4>
                {selectedPoi.address && <p className="mt-0.5 truncate text-xs text-ink-500">{selectedPoi.address}</p>}
              </div>
              <button onClick={onDismissPoi} className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-400 hover:bg-ink-100 hover:text-ink-800" aria-label="Close">✕</button>
            </div>
            {(selectedPoi.rating || selectedPoi.price_level !== undefined) && (
              <div className="mt-1 flex items-center gap-3 text-xs text-ink-600">
                {selectedPoi.rating && (
                  <span className="flex items-center gap-1"><span className="text-amber-500">★</span>{selectedPoi.rating.toFixed(1)} <span className="text-ink-400">({selectedPoi.user_ratings_total || 0})</span></span>
                )}
                {selectedPoi.price_level !== undefined && (
                  <span className="font-semibold">{'$'.repeat(Math.max(1, selectedPoi.price_level))}</span>
                )}
              </div>
            )}
            <button
              onClick={() => onAddPoi?.(selectedPoi)}
              className="mt-3 w-full rounded-pill bg-coral-500 py-2.5 text-sm font-semibold text-white transition hover:bg-coral-600 hover:shadow-glow"
            >
              + {isEs ? 'Agregar a mi viaje' : 'Add to my trip'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
