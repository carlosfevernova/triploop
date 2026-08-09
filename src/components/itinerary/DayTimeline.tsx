'use client';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { ItineraryItem, TripDay } from '@/lib/itinerary/types';
import { ItineraryItemCard } from './ItineraryItemCard';
import { TravelSegment } from './TravelSegment';
import { EmptyState } from '@/components/trip/StateFallbacks';
import { validateDay, computeDayTotals } from '@/lib/itinerary/validate';
import { formatDateHuman, formatDurationMin } from '@/lib/itinerary/time';

interface Props {
  day: TripDay | null;          // null = unscheduled bucket
  items: ItineraryItem[];       // items del día seleccionado
  locale: 'en' | 'es';
  selectedItemId: number | null;
  onSelectItem: (id: number | null) => void;
  onReorder: (activeId: number, overId: number) => void;
  onEdit: (item: ItineraryItem) => void;
  onDelete: (item: ItineraryItem) => void;
  onAdd: () => void;
}

export function DayTimeline({ day, items, locale, selectedItemId, onSelectItem, onReorder, onEdit, onDelete, onAdd }: Props){
  const isEs = locale === 'es';
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if(!over || active.id === over.id) return;
    onReorder(Number(active.id), Number(over.id));
  };

  const sorted = [...items].sort((a, b) => a.position - b.position);
  const warnings = day ? validateDay(sorted) : [];
  const totals = day ? computeDayTotals(sorted) : { activityMin: 0, travelMin: 0, travelKm: 0 };

  const title = day
    ? (day.date ? formatDateHuman(day.date, locale) : `${isEs ? 'Día' : 'Day'} ${day.day_number}`)
    : (isEs ? 'Ideas guardadas' : 'Saved ideas');

  return (
    <div className="flex-1 overflow-y-auto bg-ink-50/40 p-4">
      {/* Day header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink-900">{title}</h2>
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
        <button
          onClick={onAdd}
          className="shrink-0 rounded-pill bg-ink-900 px-4 py-2 text-xs font-semibold text-white shadow-card transition hover:bg-ink-700"
        >+ {isEs ? 'Agregar' : 'Add'}</button>
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
      {sorted.length === 0 ? (
        <EmptyState
          icon={day ? '📅' : '💡'}
          title={day ? (isEs ? 'Sin actividades' : 'No plans yet') : (isEs ? 'Sin ideas guardadas' : 'No saved ideas')}
          hint={day
            ? (isEs ? 'Agrega tu primera parada del día.' : 'Add your first stop of the day.')
            : (isEs ? 'Guarda lugares para asignarlos a un día después.' : 'Save places to schedule them later.')
          }
          cta={{ label: isEs ? '+ Agregar' : '+ Add', onClick: onAdd }}
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
                    <TravelSegment from={item} to={sorted[idx + 1]} locale={locale} />
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
