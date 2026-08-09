'use client';
import { useState } from 'react';
import { PlacesAutocomplete } from '@/components/trip/PlacesAutocomplete';
import type { PlaceSuggestion } from '@/lib/types';
import type { ItineraryItem, ItineraryItemType } from '@/lib/itinerary/types';

const TYPES: Array<{ key: ItineraryItemType; emoji: string; label_en: string; label_es: string }> = [
  { key: 'place', emoji: '📍', label_en: 'Place', label_es: 'Lugar' },
  { key: 'meal', emoji: '🍽️', label_en: 'Meal', label_es: 'Comida' },
  { key: 'hotel', emoji: '🏨', label_en: 'Hotel', label_es: 'Hotel' },
  { key: 'flight', emoji: '✈️', label_en: 'Flight', label_es: 'Vuelo' },
  { key: 'train', emoji: '🚆', label_en: 'Train', label_es: 'Tren' },
  { key: 'event', emoji: '🎫', label_en: 'Event', label_es: 'Evento' },
  { key: 'note', emoji: '📝', label_en: 'Note', label_es: 'Nota' },
  { key: 'free_time', emoji: '☕', label_en: 'Free time', label_es: 'Tiempo libre' }
];

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (partial: Partial<ItineraryItem>) => Promise<void>;
  locale: 'en' | 'es';
}

export function AddItemInline({ open, onClose, onAdd, locale }: Props){
  const isEs = locale === 'es';
  const [type, setType] = useState<ItineraryItemType>('place');
  const [customTitle, setCustomTitle] = useState('');
  const [adding, setAdding] = useState(false);

  if(!open) return null;

  const handlePlace = async (p: PlaceSuggestion) => {
    setAdding(true);
    try {
      await onAdd({
        type: 'place',
        title: p.name,
        place_id: p.place_id,
        lat: p.lat,
        lng: p.lng,
        address: p.formatted_address,
        duration_min: 90
      });
      onClose();
    } finally { setAdding(false); }
  };

  const handleCustom = async () => {
    if(!customTitle.trim()) return;
    setAdding(true);
    try {
      await onAdd({ type, title: customTitle.trim(), duration_min: type === 'meal' ? 60 : type === 'note' ? null : 90 });
      setCustomTitle('');
      onClose();
    } finally { setAdding(false); }
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink-900/40" onClick={onClose} />
      <div className="absolute inset-x-4 top-1/2 mx-auto max-w-lg -translate-y-1/2 rounded-card bg-white p-5 shadow-2xl md:inset-x-auto md:left-1/2 md:-translate-x-1/2">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">{isEs ? 'Agregar' : 'Add item'}</h3>
          <button onClick={onClose} className="rounded-full p-1 text-ink-400 hover:bg-ink-100">✕</button>
        </div>

        {/* Type chips */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {TYPES.map(t => (
            <button
              key={t.key}
              onClick={() => setType(t.key)}
              className={`rounded-pill border px-2.5 py-1 text-[11px] font-medium transition ${
                type === t.key ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 text-ink-700 hover:border-ink-500'
              }`}
            >{t.emoji} {isEs ? t.label_es : t.label_en}</button>
          ))}
        </div>

        {/* Search o custom */}
        {type === 'place' ? (
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
              {isEs ? 'Buscar lugar' : 'Search place'}
            </label>
            <div className="mt-1">
              <PlacesAutocomplete placeholder={isEs ? 'Buscar…' : 'Search…'} onSelect={handlePlace} />
            </div>
            <p className="mt-2 text-[10px] text-ink-400">{isEs ? 'Usa Google Places · guarda coordenadas y foto.' : 'Powered by Google Places · saves coords and photo.'}</p>
          </div>
        ) : (
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
              {isEs ? 'Título' : 'Title'}
            </label>
            <input
              autoFocus
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value.slice(0, 200))}
              onKeyDown={(e) => e.key === 'Enter' && handleCustom()}
              placeholder={isEs ? 'ej. "Desayuno en hotel"' : 'e.g. "Breakfast at hotel"'}
              className="mt-1 w-full rounded-pill border border-ink-200 px-3 py-2 text-sm outline-none focus:border-ink-900"
            />
            <button
              onClick={handleCustom}
              disabled={!customTitle.trim() || adding}
              className="mt-3 w-full rounded-pill bg-ink-900 py-2 text-sm font-semibold text-white hover:bg-ink-700 disabled:opacity-50"
            >
              {adding ? (isEs ? 'Agregando…' : 'Adding…') : `+ ${isEs ? 'Agregar' : 'Add'}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
