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
  prefillStartLocal?: string;  // S54: hora prellenada desde hour slot click
}

// S52: Quick-add shortcuts con presets (Restaurante 60min, Compromiso 60min, Atracción 90min, Café 30min, Nota sin duración)
const SHORTCUTS: Array<{ key: string; emoji: string; label_en: string; label_es: string; type: ItineraryItemType; dur: number | null; startHint?: string }> = [
  { key: 'restaurant', emoji: '🍽️', label_en: 'Restaurant', label_es: 'Restaurante', type: 'meal', dur: 60 },
  { key: 'coffee', emoji: '☕', label_en: 'Coffee', label_es: 'Café', type: 'meal', dur: 30 },
  { key: 'appointment', emoji: '🎫', label_en: 'Appointment', label_es: 'Compromiso', type: 'event', dur: 60 },
  { key: 'attraction', emoji: '🎨', label_en: 'Attraction', label_es: 'Atracción', type: 'place', dur: 90 },
  { key: 'workout', emoji: '🏋️', label_en: 'Workout', label_es: 'Ejercicio', type: 'event', dur: 60 },
  { key: 'shopping', emoji: '🛍️', label_en: 'Shopping', label_es: 'Compras', type: 'place', dur: 60 },
  { key: 'break', emoji: '☕', label_en: 'Break', label_es: 'Descanso', type: 'free_time', dur: 30 },
  { key: 'note', emoji: '📝', label_en: 'Quick note', label_es: 'Nota rápida', type: 'note', dur: null }
];

export function AddItemInline({ open, onClose, onAdd, locale, prefillStartLocal }: Props){
  const isEs = locale === 'es';
  const [type, setType] = useState<ItineraryItemType>('place');
  const [customTitle, setCustomTitle] = useState('');
  const [adding, setAdding] = useState(false);
  const [mode, setMode] = useState<'shortcut' | 'custom'>('shortcut');

  if(!open) return null;

  const handleShortcut = async (s: typeof SHORTCUTS[0]) => {
    setAdding(true);
    try {
      await onAdd({
        type: s.type,
        title: isEs ? s.label_es : s.label_en,
        duration_min: s.dur,
        start_local: prefillStartLocal || null   // S54: usa hora del slot si viene
      });
      onClose();
    } finally { setAdding(false); }
  };

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
        duration_min: 90,
        start_local: prefillStartLocal || null
      });
      onClose();
    } finally { setAdding(false); }
  };

  const handleCustom = async () => {
    if(!customTitle.trim()) return;
    setAdding(true);
    try {
      await onAdd({ type, title: customTitle.trim(), duration_min: type === 'meal' ? 60 : type === 'note' ? null : 90, start_local: prefillStartLocal || null });
      setCustomTitle('');
      onClose();
    } finally { setAdding(false); }
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink-900/40" onClick={onClose} />
      <div className="absolute inset-x-4 top-1/2 mx-auto max-w-lg -translate-y-1/2 rounded-card bg-white p-5 shadow-2xl md:inset-x-auto md:left-1/2 md:-translate-x-1/2">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">{isEs ? 'Agregar' : 'Add item'}</h3>
            {prefillStartLocal && (
              <p className="mt-0.5 text-[11px] text-emerald-700">
                <span aria-hidden>⏰</span> {isEs ? 'A las' : 'At'} {prefillStartLocal}
              </p>
            )}
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-ink-400 hover:bg-ink-100">✕</button>
        </div>

        {/* Mode toggle: shortcuts (agenda) vs custom (avanzado) */}
        <div className="mb-4 flex gap-1 rounded-pill border border-ink-200 bg-ink-50 p-0.5 text-[11px]">
          <button
            onClick={() => setMode('shortcut')}
            className={`flex-1 rounded-pill px-3 py-1.5 font-semibold ${mode === 'shortcut' ? 'bg-ink-900 text-white' : 'text-ink-500'}`}
          >⚡ {isEs ? 'Rápido' : 'Quick'}</button>
          <button
            onClick={() => setMode('custom')}
            className={`flex-1 rounded-pill px-3 py-1.5 font-semibold ${mode === 'custom' ? 'bg-ink-900 text-white' : 'text-ink-500'}`}
          >🔍 {isEs ? 'Personalizado' : 'Custom'}</button>
        </div>

        {/* Shortcuts mode: presets para agenda */}
        {mode === 'shortcut' && (
          <div>
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
              {isEs ? 'Agregar rápido · con duración por defecto' : 'Quick add · with default duration'}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SHORTCUTS.map(s => (
                <button
                  key={s.key}
                  onClick={() => handleShortcut(s)}
                  disabled={adding}
                  className="group flex items-center gap-2 rounded-card border border-ink-100 bg-white p-2.5 text-left transition hover:border-emerald-400 hover:shadow-card disabled:opacity-50"
                >
                  <span className="text-xl leading-none" aria-hidden>{s.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-semibold text-ink-900">{isEs ? s.label_es : s.label_en}</div>
                    <div className="text-[10px] text-ink-500">{s.dur ? `${s.dur} min` : (isEs ? 'sin duración' : 'no duration')}</div>
                  </div>
                  <span className="text-ink-300 group-hover:text-emerald-600">+</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[10px] text-ink-400">
              {isEs ? 'Edita el título y hora después de agregar.' : 'Edit title and time after adding.'}
            </p>
          </div>
        )}

        {/* Custom mode: original UI */}
        {mode === 'custom' && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
