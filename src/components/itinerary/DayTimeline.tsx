'use client';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { ItineraryItem, TripDay } from '@/lib/itinerary/types';
import { ItineraryItemCard } from './ItineraryItemCard';
import { TravelSegment } from './TravelSegment';
import { EmptyState } from '@/components/trip/StateFallbacks';
import { validateDay, computeDayTotals } from '@/lib/itinerary/validate';
import { formatDateHuman, formatDurationMin } from '@/lib/itinerary/time';

interface RealLeg {
  from_item_id: number;
  to_item_id: number;
  distance_m: number;
  duration_s: number;
  duration_traffic_s: number;
}

interface Props {
  day: TripDay | null;
  items: ItineraryItem[];
  locale: 'en' | 'es';
  selectedItemId: number | null;
  onSelectItem: (id: number | null) => void;
  onReorder: (activeId: number, overId: number) => void;
  onEdit: (item: ItineraryItem) => void;
  onDelete: (item: ItineraryItem) => void;
  onAdd: (prefillHour?: string) => void;   // S54: acepta hora prellenada
  onScheduleDay?: () => Promise<void>;
  onOptimizeDay?: () => Promise<void>;
  realLegs?: RealLeg[];
  routeLoading?: boolean;
}

// S54: Calendar-style empty hour slots (Google/Notion Calendar pattern)
const EMPTY_HOURS = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30', '21:00'];

export function DayTimeline({ day, items, locale, selectedItemId, onSelectItem, onReorder, onEdit, onDelete, onAdd, onScheduleDay, onOptimizeDay, realLegs, routeLoading }: Props){
  const isEs = locale === 'es';
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if(!over || active.id === over.id) return;
    onReorder(Number(active.id), Number(over.id));
  };

  const sorted = [...items].sort((a, b) => a.position - b.position);
  const warnings = day ? validateDay(sorted, day.date) : [];
  const totals = day ? computeDayTotals(sorted) : { activityMin: 0, travelMin: 0, travelKm: 0 };
  const legByFromId = new Map((realLegs || []).map(l => [l.from_item_id, l]));

  const title = day
    ? (day.date ? formatDateHuman(day.date, locale) : `${isEs ? 'Día' : 'Day'} ${day.day_number}`)
    : (isEs ? 'Ideas guardadas' : 'Saved ideas');
  // S47 audit: mostrar timezone si difiere del navegador
  const browserTz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC';
  const showTz = !!(day?.timezone && day.timezone !== 'UTC' && day.timezone !== browserTz);

  return (
    <div className="flex-1 overflow-y-auto bg-ink-50/40 p-4">
      {/* Day header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink-900">
            {title}
            {showTz && (
              <span className="ml-2 rounded-pill bg-ocean-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ocean-800" title={isEs ? 'Zona horaria del día' : 'Day timezone'}>🌐 {day!.timezone}</span>
            )}
          </h2>
          {day && (
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-500">
              <span>{sorted.length} {isEs ? (sorted.length === 1 ? 'parada' : 'paradas') : (sorted.length === 1 ? 'stop' : 'stops')}</span>
              {totals.activityMin > 0 && <>
                <span>·</span>
                <span>{formatDurationMin(totals.activityMin, isEs)} {isEs ? 'planeadas' : 'planned'}</span>
              </>}
              {totals.travelMin > 0 && <>
                <span>·</span>
                <span>{formatDurationMin(totals.travelMin, isEs)} · {totals.travelKm.toFixed(1)} km {isEs ? 'traslados' : 'travel'}</span>
              </>}
              {warnings.length > 0 && (
                <span className="rounded-pill bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                  ⚠️ {warnings.length} {isEs ? 'alerta' : 'issue'}{warnings.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {day && sorted.length >= 2 && onScheduleDay && (
            <button
              onClick={onScheduleDay}
              disabled={routeLoading}
              className="rounded-pill border border-ocean-400/40 bg-ocean-400/10 px-3 py-2 text-[11px] font-semibold text-ocean-800 transition hover:bg-ocean-400 hover:text-white disabled:opacity-50"
              title={isEs ? 'Asignar horas a items sin hora' : 'Assign times to unscheduled items'}
            >⏰ {isEs ? 'Programar día' : 'Schedule day'}</button>
          )}
          {day && sorted.length >= 3 && onOptimizeDay && (
            <button
              onClick={onOptimizeDay}
              disabled={routeLoading}
              className="rounded-pill border border-emerald-400 bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-800 transition hover:bg-emerald-500 hover:text-white disabled:opacity-50"
              title={isEs ? 'Reordena minimizando distancia (respeta fijos)' : 'Reorder to minimize distance (respects fixed)'}
            >✨ {isEs ? 'Optimizar' : 'Optimize'}</button>
          )}
          <button
            onClick={() => onAdd()}
            className="rounded-pill bg-ink-900 px-4 py-2 text-xs font-semibold text-white shadow-card transition hover:bg-ink-700"
          >+ {isEs ? 'Agregar' : 'Add'}</button>
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mb-4 space-y-1">
          {warnings.map((w, i) => (
            <div key={i} className={`rounded-lg border px-3 py-2 text-xs ${
              w.severity === 'error' ? 'border-red-200 bg-red-50 text-red-800'
              : w.severity === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-800'
              : 'border-ocean-200 bg-ocean-50 text-ocean-800'
            }`}>
              <span aria-hidden className="mr-1">{w.severity === 'error' ? '❌' : w.severity === 'warning' ? '⚠️' : 'ℹ️'}</span>
              {w.message}
            </div>
          ))}
        </div>
      )}

      {/* Items */}
      {sorted.length === 0 && day ? (
        <div>
          <p className="mb-3 text-xs text-ink-500">
            {isEs ? 'Toca una hora para agregar directamente:' : 'Tap an hour to add directly:'}
          </p>
          <ul className="space-y-1">
            {EMPTY_HOURS.map(h => (
              <li key={h}>
                <button
                  onClick={() => onAdd(h)}
                  className="group flex w-full items-center gap-3 rounded-lg border border-dashed border-ink-200 bg-white px-3 py-2 text-left transition hover:border-emerald-500 hover:bg-emerald-50/40"
                >
                  <span className="w-14 shrink-0 text-right tabular-nums text-xs font-semibold text-ink-500">{h}</span>
                  <span className="flex-1 text-[13px] italic text-ink-400 group-hover:text-emerald-700">
                    {isEs ? 'Agregar actividad…' : 'Add activity…'}
                  </span>
                  <span className="text-ink-300 group-hover:text-emerald-600">+</span>
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => onAdd()}
            className="mt-3 w-full rounded-pill border border-ink-300 py-2 text-xs font-semibold text-ink-700 transition hover:border-ink-500"
          >{isEs ? '+ Agregar con hora personalizada' : '+ Add with custom time'}</button>
        </div>
      ) : sorted.length === 0 && !day ? (
        <EmptyState
          icon="💡"
          title={isEs ? 'Sin ideas guardadas' : 'No saved ideas'}
          hint={isEs ? 'Guarda lugares para asignarlos a un día después.' : 'Save places to schedule them later.'}
          cta={{ label: isEs ? '+ Agregar' : '+ Add', onClick: () => onAdd() }}
        />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map(i => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-1">
              {sorted.map((item, idx) => (
                <div key={item.id}>
                  <ItineraryItemCard
                    item={item}
                    index={idx}
                    locale={locale}
                    onEdit={() => onEdit(item)}
                    onDelete={() => onDelete(item)}
                    onSelect={() => onSelectItem(item.id === selectedItemId ? null : item.id)}
                    selected={selectedItemId === item.id}
                  />
                  {idx < sorted.length - 1 && day && (
                    <TravelSegment from={item} to={sorted[idx + 1]} locale={locale} leg={legByFromId.get(item.id)} />
                  )}
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
