'use client';
import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ItineraryItem } from '@/lib/itinerary/types';
import { formatDurationMin, computeEndLocal, parseTimeToMin, formatMinToHHMM } from '@/lib/itinerary/time';

const TYPE_META: Record<string, { emoji: string; label_en: string; label_es: string; color: string }> = {
  place:     { emoji: '📍', label_en: 'Place',      label_es: 'Lugar',      color: 'coral' },
  meal:      { emoji: '🍽️', label_en: 'Meal',       label_es: 'Comida',     color: 'amber' },
  hotel:     { emoji: '🏨', label_en: 'Hotel',      label_es: 'Hotel',      color: 'ocean' },
  flight:    { emoji: '✈️', label_en: 'Flight',     label_es: 'Vuelo',      color: 'ink' },
  train:     { emoji: '🚆', label_en: 'Train',      label_es: 'Tren',       color: 'ink' },
  drive:     { emoji: '🚗', label_en: 'Drive',      label_es: 'Manejo',     color: 'ink' },
  walk:      { emoji: '🚶', label_en: 'Walk',       label_es: 'Caminar',    color: 'ink' },
  event:     { emoji: '🎫', label_en: 'Event',      label_es: 'Evento',     color: 'coral' },
  note:      { emoji: '📝', label_en: 'Note',       label_es: 'Nota',       color: 'ink' },
  free_time: { emoji: '☕', label_en: 'Free time',  label_es: 'Tiempo libre', color: 'emerald' }
};

const PRIORITY_META: Record<string, { icon: string; label_en: string; label_es: string; color: string }> = {
  must:      { icon: '⭐', label_en: 'Must',      label_es: 'Imprescindible', color: 'text-coral-600' },
  preferred: { icon: '',   label_en: 'Preferred', label_es: 'Preferido',       color: '' },
  optional:  { icon: '○',  label_en: 'Optional',  label_es: 'Opcional',        color: 'text-ink-400' }
};

interface Props {
  item: ItineraryItem;
  index: number;
  locale: 'en' | 'es';
  onEdit: () => void;
  onDelete: () => void;
  onSelect: () => void;
  selected: boolean;
}

function ItineraryItemCardImpl({ item, index, locale, onEdit, onDelete, onSelect, selected }: Props){
  const isEs = locale === 'es';
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const meta = TYPE_META[item.type] || TYPE_META.place;
  const prio = PRIORITY_META[item.priority] || PRIORITY_META.preferred;
  const endLocal = computeEndLocal(item.start_local, item.duration_min);
  const startMin = parseTimeToMin(item.start_local);
  // S47 audit: visual distinto para free_time/note (más discreto)
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
      {/* Time gutter */}
      <div className="flex w-14 shrink-0 flex-col items-end">
        {item.start_local ? (
          <>
            <div className="tabular-nums font-display text-sm font-semibold text-ink-900">
              {startMin !== null ? formatMinToHHMM(startMin) : item.start_local.slice(0, 5)}
            </div>
            {endLocal && <div className="text-[10px] tabular-nums text-ink-400">→ {endLocal}</div>}
          </>
        ) : (
          <div className="text-[10px] text-ink-300">{isEs ? 'sin hora' : 'no time'}</div>
        )}
      </div>

      {/* Number + drag */}
      <button
        {...attributes} {...listeners}
        className="grid h-8 w-8 shrink-0 cursor-grab place-items-center rounded-full bg-coral-500 text-xs font-semibold text-white active:cursor-grabbing"
        aria-label={`drag ${item.title}`}
        onClick={(e) => e.stopPropagation()}
      >
        {index + 1}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <span className="text-base leading-tight" aria-hidden>{meta.emoji}</span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-ink-900">
              {prio.icon && <span className={`mr-1 ${prio.color}`}>{prio.icon}</span>}
              {item.title}
              {item.fixed && <span className="ml-1.5 text-[10px]" title={isEs ? 'Fijo' : 'Fixed'}>🔒</span>}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-ink-500">
              <span className="uppercase tracking-wide">{isEs ? meta.label_es : meta.label_en}</span>
              {item.duration_min && (<><span>·</span><span>{formatDurationMin(item.duration_min, isEs)}</span></>)}
              {item.address && (<><span>·</span><span className="truncate">{item.address}</span></>)}
            </div>
            {item.notes && <p className="mt-1 line-clamp-2 text-[11px] text-ink-600">{item.notes}</p>}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-1 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="rounded-full p-1 text-ink-400 transition hover:bg-ink-100 hover:text-ink-800"
          aria-label={isEs ? 'Editar' : 'Edit'}
        >✎</button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="rounded-full p-1 text-ink-400 transition hover:bg-coral-50 hover:text-coral-600"
          aria-label={isEs ? 'Eliminar' : 'Delete'}
        >✕</button>
      </div>
    </div>
  );
}

// S66: memo — cada card se re-renderiza solo si item/index/locale/selected cambian.
// Con 30+ items en un día, evita 29 re-renders innecesarios cuando 1 item cambia.
export const ItineraryItemCard = memo(ItineraryItemCardImpl);
