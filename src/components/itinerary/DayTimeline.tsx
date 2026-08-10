'use client';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { ItineraryItem, TripDay } from '@/lib/itinerary/types';
import { ItineraryItemCard } from './ItineraryItemCard';
import { TravelSegment } from './TravelSegment';
import { EmptyState } from '@/components/trip/StateFallbacks';
import { validateDay, computeDayTotals } from '@/lib/itinerary/validate';
import { formatDateHuman, formatDurationMin } from '@/lib/itinerary/time';
import { L } from '@/lib/l4';

// S71n: 4-locale migration. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
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
  locale: string;
  selectedItemId: number | null;
  onSelectItem: (id: number | null) => void;
  onReorder: (activeId: number, overId: number) => void;
  onEdit: (item: ItineraryItem) => void;
  onDelete: (item: ItineraryItem) => void;
  onAdd: (prefillHour?: string) => void;
  onScheduleDay?: () => Promise<void>;
  onOptimizeDay?: () => Promise<void>;
  realLegs?: RealLeg[];
  routeLoading?: boolean;
}

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

  const dayWord = L(locale, { en: 'Day', es: 'Día', pt: 'Dia', de: 'Tag' });
  const savedIdeasTitle = L(locale, { en: 'Saved ideas', es: 'Ideas guardadas', pt: 'Ideias salvas', de: 'Gespeicherte Ideen' });
  const title = day
    ? (day.date ? formatDateHuman(day.date, locale) : `${dayWord} ${day.day_number}`)
    : savedIdeasTitle;
  const browserTz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC';
  const showTz = !!(day?.timezone && day.timezone !== 'UTC' && day.timezone !== browserTz);
  const addWord = L(locale, { en: 'Add', es: 'Agregar', pt: 'Adicionar', de: 'Hinzufügen' });

  return (
    <div className="flex-1 overflow-y-auto bg-ink-50/40 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink-900">
            {title}
            {showTz && (
              <span
                className="ml-2 rounded-pill bg-ocean-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ocean-800"
                title={L(locale, { en: 'Day timezone', es: 'Zona horaria del día', pt: 'Fuso horário do dia', de: 'Zeitzone des Tages' })}
              >🌐 {day!.timezone}</span>
            )}
          </h2>
          {day && (
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-500">
              <span>{sorted.length} {L(locale, {
                en: sorted.length === 1 ? 'stop' : 'stops',
                es: sorted.length === 1 ? 'parada' : 'paradas',
                pt: sorted.length === 1 ? 'parada' : 'paradas',
                de: sorted.length === 1 ? 'Stopp' : 'Stopps'
              })}</span>
              {totals.activityMin > 0 && <>
                <span>·</span>
                <span>{formatDurationMin(totals.activityMin, isEs)} {L(locale, { en: 'planned', es: 'planeadas', pt: 'planejadas', de: 'geplant' })}</span>
              </>}
              {totals.travelMin > 0 && <>
                <span>·</span>
                <span>{formatDurationMin(totals.travelMin, isEs)} · {totals.travelKm.toFixed(1)} km {L(locale, { en: 'travel', es: 'traslados', pt: 'traslados', de: 'Fahrten' })}</span>
              </>}
              {warnings.length > 0 && (
                <span className="rounded-pill bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                  ⚠️ {warnings.length} {L(locale, {
                    en: warnings.length === 1 ? 'issue' : 'issues',
                    es: warnings.length === 1 ? 'alerta' : 'alertas',
                    pt: warnings.length === 1 ? 'alerta' : 'alertas',
                    de: warnings.length === 1 ? 'Hinweis' : 'Hinweise'
                  })}
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
              title={L(locale, { en: 'Assign times to unscheduled items', es: 'Asignar horas a items sin hora', pt: 'Atribuir horários a itens sem hora', de: 'Zeiten für ungeplante Elemente zuweisen' })}
            >⏰ {L(locale, { en: 'Schedule day', es: 'Programar día', pt: 'Programar dia', de: 'Tag planen' })}</button>
          )}
          {day && sorted.length >= 3 && onOptimizeDay && (
            <button
              onClick={onOptimizeDay}
              disabled={routeLoading}
              className="rounded-pill border border-emerald-400 bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-800 transition hover:bg-emerald-500 hover:text-white disabled:opacity-50"
              title={L(locale, { en: 'Reorder to minimize distance (respects fixed)', es: 'Reordena minimizando distancia (respeta fijos)', pt: 'Reordena minimizando distância (respeita fixos)', de: 'Neu anordnen, um Distanz zu minimieren (respektiert Fixe)' })}
            >✨ {L(locale, { en: 'Optimize', es: 'Optimizar', pt: 'Otimizar', de: 'Optimieren' })}</button>
          )}
          <button
            onClick={() => onAdd()}
            className="rounded-pill bg-ink-900 px-4 py-2 text-xs font-semibold text-white shadow-card transition hover:bg-ink-700"
          >+ {addWord}</button>
        </div>
      </div>

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

      {sorted.length === 0 && day ? (
        <div>
          <p className="mb-3 text-xs text-ink-500">
            {L(locale, { en: 'Tap an hour to add directly:', es: 'Toca una hora para agregar directamente:', pt: 'Toque em uma hora para adicionar direto:', de: 'Auf eine Uhrzeit tippen, um direkt hinzuzufügen:' })}
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
                    {L(locale, { en: 'Add activity…', es: 'Agregar actividad…', pt: 'Adicionar atividade…', de: 'Aktivität hinzufügen…' })}
                  </span>
                  <span className="text-ink-300 group-hover:text-emerald-600">+</span>
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => onAdd()}
            className="mt-3 w-full rounded-pill border border-ink-300 py-2 text-xs font-semibold text-ink-700 transition hover:border-ink-500"
          >{L(locale, { en: '+ Add with custom time', es: '+ Agregar con hora personalizada', pt: '+ Adicionar com hora personalizada', de: '+ Mit eigener Uhrzeit hinzufügen' })}</button>
        </div>
      ) : sorted.length === 0 && !day ? (
        <EmptyState
          icon="💡"
          title={L(locale, { en: 'No saved ideas', es: 'Sin ideas guardadas', pt: 'Sem ideias salvas', de: 'Keine gespeicherten Ideen' })}
          hint={L(locale, { en: 'Save places to schedule them later.', es: 'Guarda lugares para asignarlos a un día después.', pt: 'Salve lugares para agendá-los depois.', de: 'Speichere Orte, um sie später zu planen.' })}
          cta={{ label: L(locale, { en: '+ Add', es: '+ Agregar', pt: '+ Adicionar', de: '+ Hinzufügen' }), onClick: () => onAdd() }}
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
