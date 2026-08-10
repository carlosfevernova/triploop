'use client';
import { useState } from 'react';
import { PlacesAutocomplete } from '@/components/trip/PlacesAutocomplete';
import type { PlaceSuggestion } from '@/lib/types';
import type { ItineraryItem, ItineraryItemType } from '@/lib/itinerary/types';
import { L } from '@/lib/l4';
import type { Locale } from '@/i18n/request';

// S71n: 4-locale migration. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
type LangStr = Record<Locale, string>;

const TYPES: Array<{ key: ItineraryItemType; emoji: string; label: LangStr }> = [
  { key: 'place',     emoji: '📍', label: { en: 'Place',      es: 'Lugar',        pt: 'Lugar',        de: 'Ort' } },
  { key: 'meal',      emoji: '🍽️', label: { en: 'Meal',       es: 'Comida',       pt: 'Refeição',     de: 'Mahlzeit' } },
  { key: 'hotel',     emoji: '🏨', label: { en: 'Hotel',      es: 'Hotel',        pt: 'Hotel',        de: 'Hotel' } },
  { key: 'flight',    emoji: '✈️', label: { en: 'Flight',     es: 'Vuelo',        pt: 'Voo',          de: 'Flug' } },
  { key: 'train',     emoji: '🚆', label: { en: 'Train',      es: 'Tren',         pt: 'Trem',         de: 'Zug' } },
  { key: 'event',     emoji: '🎫', label: { en: 'Event',      es: 'Evento',       pt: 'Evento',       de: 'Veranstaltung' } },
  { key: 'note',      emoji: '📝', label: { en: 'Note',       es: 'Nota',         pt: 'Nota',         de: 'Notiz' } },
  { key: 'free_time', emoji: '☕', label: { en: 'Free time',  es: 'Tiempo libre', pt: 'Tempo livre',  de: 'Freie Zeit' } }
];

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (partial: Partial<ItineraryItem>) => Promise<void>;
  locale: string;
  prefillStartLocal?: string;
}

const SHORTCUTS: Array<{ key: string; emoji: string; label: LangStr; type: ItineraryItemType; dur: number | null; startHint?: string }> = [
  { key: 'restaurant',  emoji: '🍽️', label: { en: 'Restaurant',  es: 'Restaurante', pt: 'Restaurante',  de: 'Restaurant' },   type: 'meal',       dur: 60 },
  { key: 'coffee',      emoji: '☕', label: { en: 'Coffee',      es: 'Café',        pt: 'Café',         de: 'Kaffee' },       type: 'meal',       dur: 30 },
  { key: 'appointment', emoji: '🎫', label: { en: 'Appointment', es: 'Compromiso',  pt: 'Compromisso',  de: 'Termin' },       type: 'event',      dur: 60 },
  { key: 'attraction',  emoji: '🎨', label: { en: 'Attraction',  es: 'Atracción',   pt: 'Atração',      de: 'Sehenswürdigkeit'}, type: 'place',    dur: 90 },
  { key: 'workout',     emoji: '🏋️', label: { en: 'Workout',     es: 'Ejercicio',   pt: 'Exercício',    de: 'Training' },     type: 'event',      dur: 60 },
  { key: 'shopping',    emoji: '🛍️', label: { en: 'Shopping',    es: 'Compras',     pt: 'Compras',      de: 'Einkaufen' },    type: 'place',      dur: 60 },
  { key: 'break',       emoji: '☕', label: { en: 'Break',       es: 'Descanso',    pt: 'Pausa',        de: 'Pause' },        type: 'free_time',  dur: 30 },
  { key: 'note',        emoji: '📝', label: { en: 'Quick note',  es: 'Nota rápida', pt: 'Nota rápida',  de: 'Kurznotiz' },    type: 'note',       dur: null }
];

export function AddItemInline({ open, onClose, onAdd, locale, prefillStartLocal }: Props){
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
        title: L(locale, s.label),
        duration_min: s.dur,
        start_local: prefillStartLocal || null
      });
      onClose();
    } finally { setAdding(false); }
  };

  const handlePlace = async (p: PlaceSuggestion) => {
    setAdding(true);
    try {
      await onAdd({
        type: 'place', title: p.name, place_id: p.place_id, lat: p.lat, lng: p.lng,
        address: p.formatted_address, duration_min: 90, start_local: prefillStartLocal || null
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

  const noDurationLabel = L(locale, { en: 'no duration', es: 'sin duración', pt: 'sem duração', de: 'keine Dauer' });
  const addingLabel = L(locale, { en: 'Adding…', es: 'Agregando…', pt: 'Adicionando…', de: 'Wird hinzugefügt…' });
  const addWord = L(locale, { en: 'Add', es: 'Agregar', pt: 'Adicionar', de: 'Hinzufügen' });

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink-900/40" onClick={onClose} />
      <div className="absolute inset-x-4 top-1/2 mx-auto max-w-lg -translate-y-1/2 rounded-card bg-white p-5 shadow-2xl md:inset-x-auto md:left-1/2 md:-translate-x-1/2">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">
              {L(locale, { en: 'Add item', es: 'Agregar', pt: 'Adicionar item', de: 'Element hinzufügen' })}
            </h3>
            {prefillStartLocal && (
              <p className="mt-0.5 text-[11px] text-emerald-700">
                <span aria-hidden>⏰</span> {L(locale, { en: 'At', es: 'A las', pt: 'Às', de: 'Um' })} {prefillStartLocal}
              </p>
            )}
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-ink-400 hover:bg-ink-100" aria-label={L(locale, { en: 'Close', es: 'Cerrar', pt: 'Fechar', de: 'Schließen' })}>✕</button>
        </div>

        <div className="mb-4 flex gap-1 rounded-pill border border-ink-200 bg-ink-50 p-0.5 text-[11px]">
          <button
            onClick={() => setMode('shortcut')}
            className={`flex-1 rounded-pill px-3 py-1.5 font-semibold ${mode === 'shortcut' ? 'bg-ink-900 text-white' : 'text-ink-500'}`}
          >⚡ {L(locale, { en: 'Quick', es: 'Rápido', pt: 'Rápido', de: 'Schnell' })}</button>
          <button
            onClick={() => setMode('custom')}
            className={`flex-1 rounded-pill px-3 py-1.5 font-semibold ${mode === 'custom' ? 'bg-ink-900 text-white' : 'text-ink-500'}`}
          >🔍 {L(locale, { en: 'Custom', es: 'Personalizado', pt: 'Personalizado', de: 'Individuell' })}</button>
        </div>

        {mode === 'shortcut' && (
          <div>
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
              {L(locale, {
                en: 'Quick add · with default duration',
                es: 'Agregar rápido · con duración por defecto',
                pt: 'Adição rápida · com duração padrão',
                de: 'Schnell hinzufügen · mit Standarddauer'
              })}
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
                    <div className="truncate text-[13px] font-semibold text-ink-900">{L(locale, s.label)}</div>
                    <div className="text-[10px] text-ink-500">{s.dur ? `${s.dur} min` : noDurationLabel}</div>
                  </div>
                  <span className="text-ink-300 group-hover:text-emerald-600">+</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[10px] text-ink-400">
              {L(locale, {
                en: 'Edit title and time after adding.',
                es: 'Edita el título y hora después de agregar.',
                pt: 'Edite o título e a hora após adicionar.',
                de: 'Titel und Uhrzeit nach dem Hinzufügen bearbeiten.'
              })}
            </p>
          </div>
        )}

        {mode === 'custom' && (
          <>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {TYPES.map(t => (
                <button
                  key={t.key}
                  onClick={() => setType(t.key)}
                  className={`rounded-pill border px-2.5 py-1 text-[11px] font-medium transition ${
                    type === t.key ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 text-ink-700 hover:border-ink-500'
                  }`}
                >{t.emoji} {L(locale, t.label)}</button>
              ))}
            </div>

            {type === 'place' ? (
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
                  {L(locale, { en: 'Search place', es: 'Buscar lugar', pt: 'Buscar lugar', de: 'Ort suchen' })}
                </label>
                <div className="mt-1">
                  <PlacesAutocomplete placeholder={L(locale, { en: 'Search…', es: 'Buscar…', pt: 'Buscar…', de: 'Suchen…' })} onSelect={handlePlace} />
                </div>
                <p className="mt-2 text-[10px] text-ink-400">{L(locale, {
                  en: 'Powered by Google Places · saves coords and photo.',
                  es: 'Usa Google Places · guarda coordenadas y foto.',
                  pt: 'Usa Google Places · salva coordenadas e foto.',
                  de: 'Nutzt Google Places · speichert Koordinaten und Foto.'
                })}</p>
              </div>
            ) : (
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
                  {L(locale, { en: 'Title', es: 'Título', pt: 'Título', de: 'Titel' })}
                </label>
                <input
                  autoFocus
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value.slice(0, 200))}
                  onKeyDown={(e) => e.key === 'Enter' && handleCustom()}
                  placeholder={L(locale, {
                    en: 'e.g. "Breakfast at hotel"',
                    es: 'ej. "Desayuno en hotel"',
                    pt: 'ex. "Café da manhã no hotel"',
                    de: 'z. B. "Frühstück im Hotel"'
                  })}
                  className="mt-1 w-full rounded-pill border border-ink-200 px-3 py-2 text-sm outline-none focus:border-ink-900"
                />
                <button
                  onClick={handleCustom}
                  disabled={!customTitle.trim() || adding}
                  className="mt-3 w-full rounded-pill bg-ink-900 py-2 text-sm font-semibold text-white hover:bg-ink-700 disabled:opacity-50"
                >
                  {adding ? addingLabel : `+ ${addWord}`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
