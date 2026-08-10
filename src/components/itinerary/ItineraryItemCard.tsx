'use client';
import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ItineraryItem } from '@/lib/itinerary/types';
import { formatDurationMin, computeEndLocal, parseTimeToMin, formatMinToHHMM } from '@/lib/itinerary/time';
import { L } from '@/lib/l4';
import type { Locale } from '@/i18n/request';

// S71n: 4-locale migration. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
type LangStr = Record<Locale, string>;

const TYPE_META: Record<string, { emoji: string; label: LangStr; color: string }> = {
  place:     { emoji: '📍', label: { en: 'Place',      es: 'Lugar',        pt: 'Lugar',        de: 'Ort' },          color: 'coral' },
  meal:      { emoji: '🍽️', label: { en: 'Meal',       es: 'Comida',       pt: 'Refeição',     de: 'Mahlzeit' },     color: 'amber' },
  hotel:     { emoji: '🏨', label: { en: 'Hotel',      es: 'Hotel',        pt: 'Hotel',        de: 'Hotel' },        color: 'ocean' },
  flight:    { emoji: '✈️', label: { en: 'Flight',     es: 'Vuelo',        pt: 'Voo',          de: 'Flug' },         color: 'ink' },
  train:     { emoji: '🚆', label: { en: 'Train',      es: 'Tren',         pt: 'Trem',         de: 'Zug' },          color: 'ink' },
  drive:     { emoji: '🚗', label: { en: 'Drive',      es: 'Manejo',       pt: 'Direção',      de: 'Fahrt' },        color: 'ink' },
  walk:      { emoji: '🚶', label: { en: 'Walk',       es: 'Caminar',      pt: 'Caminhada',    de: 'Zu Fuß' },       color: 'ink' },
  event:     { emoji: '🎫', label: { en: 'Event',      es: 'Evento',       pt: 'Evento',       de: 'Veranstaltung' },color: 'coral' },
  note:      { emoji: '📝', label: { en: 'Note',       es: 'Nota',         pt: 'Nota',         de: 'Notiz' },        color: 'ink' },
  free_time: { emoji: '☕', label: { en: 'Free time',  es: 'Tiempo libre', pt: 'Tempo livre',  de: 'Freie Zeit' },   color: 'emerald' }
};

const PRIORITY_META: Record<string, { icon: string; label: LangStr; color: string }> = {
  must:      { icon: '⭐', label: { en: 'Must',      es: 'Imprescindible', pt: 'Imperdível',   de: 'Muss sein' },   color: 'text-coral-600' },
  preferred: { icon: '',   label: { en: 'Preferred', es: 'Preferido',      pt: 'Preferido',    de: 'Bevorzugt' },   color: '' },
  optional:  { icon: '○',  label: { en: 'Optional',  es: 'Opcional',       pt: 'Opcional',     de: 'Optional' },    color: 'text-ink-400' }
};

interface Props {
  item: ItineraryItem;
  index: number;
  locale: string;
  onEdit: () => void;
  onDelete: () => void;
  onSelect: () => void;
  selected: boolean;
}

function ItineraryItemCardImpl({ item, index, locale, onEdit, onDelete, onSelect, selected }: Props){
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const meta = TYPE_META[item.type] || TYPE_META.place;
  const prio = PRIORITY_META[item.priority] || PRIORITY_META.preferred;
  const endLocal = computeEndLocal(item.start_local, item.duration_min);
  const startMin = parseTimeToMin(item.start_local);
  const isFreeOrNote = item.type === 'free_time' || item.type === 'note';

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group relative flex gap-3 rounded-card border p-3 transition ${
        isFreeOrNote
          ? 'border-dashed border-ink-200 bg-ink-50/40'
          : 'bg-white'
      } ${
        selected ? 'border-ink-900 shadow-card-hover' : (!isFreeOrNote ? 'border-ink-100 hover:border-ink-300 hover:shadow-card' : 'hover:border-ink-400')
      } ${isDragging ? 'shadow-card-hover' : ''}`}
    >
      <div className="flex w-14 shrink-0 flex-col items-end">
        {item.start_local ? (
          <>
            <div className="tabular-nums font-display text-sm font-semibold text-ink-900">
              {startMin !== null ? formatMinToHHMM(startMin) : item.start_local.slice(0, 5)}
            </div>
            {endLocal && <div className="text-[10px] tabular-nums text-ink-400">→ {endLocal}</div>}
          </>
        ) : (
          <div className="text-[10px] text-ink-300">{L(locale, { en: 'no time', es: 'sin hora', pt: 'sem hora', de: 'keine Zeit' })}</div>
        )}
      </div>

      <button
        {...attributes} {...listeners}
        className="grid h-8 w-8 shrink-0 cursor-grab place-items-center rounded-full bg-coral-500 text-xs font-semibold text-white active:cursor-grabbing"
        aria-label={`drag ${item.title}`}
        onClick={(e) => e.stopPropagation()}
      >
        {index + 1}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <span className="text-base leading-tight" aria-hidden>{meta.emoji}</span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-ink-900">
              {prio.icon && <span className={`mr-1 ${prio.color}`}>{prio.icon}</span>}
              {item.title}
              {item.fixed && <span className="ml-1.5 text-[10px]" title={L(locale, { en: 'Fixed', es: 'Fijo', pt: 'Fixo', de: 'Fest' })}>🔒</span>}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-ink-500">
              <span className="uppercase tracking-wide">{L(locale, meta.label)}</span>
              {item.duration_min && (<><span>·</span><span>{formatDurationMin(item.duration_min, locale === 'es')}</span></>)}
              {item.address && (<><span>·</span><span className="truncate">{item.address}</span></>)}
            </div>
            {item.notes && <p className="mt-1 line-clamp-2 text-[11px] text-ink-600">{item.notes}</p>}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="rounded-full p-1 text-ink-400 transition hover:bg-ink-100 hover:text-ink-800"
          aria-label={L(locale, { en: 'Edit', es: 'Editar', pt: 'Editar', de: 'Bearbeiten' })}
        >✎</button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="rounded-full p-1 text-ink-400 transition hover:bg-coral-50 hover:text-coral-600"
          aria-label={L(locale, { en: 'Delete', es: 'Eliminar', pt: 'Excluir', de: 'Löschen' })}
        >✕</button>
      </div>
    </div>
  );
}

export const ItineraryItemCard = memo(ItineraryItemCardImpl);
