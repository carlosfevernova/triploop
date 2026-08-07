'use client';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PlacesAutocomplete } from './PlacesAutocomplete';
import { formatDistance, formatDuration } from '@/lib/format';
import type { PlaceSuggestion, RouteLeg, Trip, TripStop, UnitSystem } from '@/lib/types';

interface Props {
  trip: Trip;
  legs: RouteLeg[];
  onStopsChange: (stops: TripStop[]) => void;
  onHover: (stopId: string | null) => void;
  onSettingsChange: (patch: Partial<Trip>) => void;
  saving?: boolean;
  isEs?: boolean;
}

function SortableStop({ stop, index, leg, unit, isEs, onHover, onRemove }: {
  stop: TripStop; index: number; leg?: RouteLeg; unit: UnitSystem; isEs?: boolean;
  onHover: (id: string | null) => void; onRemove: () => void;
}){
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: stop.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <li
      ref={setNodeRef} style={style}
      onMouseEnter={() => onHover(stop.id)}
      onMouseLeave={() => onHover(null)}
      className={`group rounded-card border border-ink-100 bg-white ${isDragging ? 'shadow-card-hover' : ''}`}
    >
      <div className="flex items-start gap-3 p-4">
        <button {...attributes} {...listeners} className="mt-0.5 cursor-grab touch-none active:cursor-grabbing" aria-label="drag">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-coral-500 text-xs font-semibold text-white">
            {index + 1}
          </div>
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-ink-900">{stop.name}</div>
          {stop.address && <div className="truncate text-xs text-ink-500">{stop.address}</div>}
        </div>
        <button
          onClick={onRemove}
          className="text-ink-300 opacity-0 transition group-hover:opacity-100 hover:text-coral-500"
          aria-label="remove"
        >
          ✕
        </button>
      </div>
      {leg && (
        <div className="flex items-center gap-2 border-t border-dashed border-ink-100 px-4 py-2 text-xs text-ink-500">
          <span className="text-coral-500">↓</span>
          <span className="font-semibold text-ink-700">{formatDistance(leg.distance_m, unit)}</span>
          <span>·</span>
          <span className="font-semibold text-ink-700">{formatDuration(leg.duration_traffic_s || leg.duration_s)}</span>
          {leg.duration_traffic_s && leg.duration_s && leg.duration_traffic_s > leg.duration_s * 1.15 && (
            <span className="ml-1 rounded-pill bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
              {isEs ? 'Tráfico pesado' : 'Heavy traffic'}
            </span>
          )}
        </div>
      )}
    </li>
  );
}

export function ItineraryPanel({ trip, legs, onStopsChange, onHover, onSettingsChange, saving, isEs }: Props){
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if(!over || active.id === over.id) return;
    const oldIdx = trip.stops.findIndex(s => s.id === active.id);
    const newIdx = trip.stops.findIndex(s => s.id === over.id);
    if(oldIdx < 0 || newIdx < 0) return;
    onStopsChange(arrayMove(trip.stops, oldIdx, newIdx));
  };

  const handleAdd = (place: PlaceSuggestion) => {
    const newStop: TripStop = {
      id: crypto.randomUUID(),
      name: place.name,
      address: place.formatted_address,
      lat: place.lat,
      lng: place.lng,
      place_id: place.place_id
    };
    onStopsChange([...trip.stops, newStop]);
  };

  const handleRemove = (id: string) => {
    if(trip.stops.length <= 2) return; // mantener min 2
    onStopsChange(trip.stops.filter(s => s.id !== id));
  };

  const totalDist = trip.route_geometry?.total_distance_m || 0;
  const totalDur = trip.route_geometry?.total_duration_s || 0;

  return (
    <aside className="flex h-full flex-col border-l border-ink-100 bg-ink-50">
      {/* Header */}
      <div className="border-b border-ink-100 bg-white p-6">
        <input
          value={trip.title}
          onChange={(e) => onSettingsChange({ title: e.target.value })}
          className="w-full bg-transparent font-display text-xl font-semibold text-ink-900 outline-none focus:border-b focus:border-coral-500"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {/* Unit toggle */}
          <div className="flex gap-0.5 rounded-pill border border-ink-200 bg-white p-0.5">
            {[['metric','km'],['imperial','mi']].map(([val,label]) => (
              <button key={val}
                onClick={() => onSettingsChange({ unit_system: val as UnitSystem })}
                className={`rounded-pill px-2.5 py-1 text-[10px] font-semibold uppercase transition ${trip.unit_system === val ? 'bg-ink-900 text-white' : 'text-ink-500'}`}
              >{label}</button>
            ))}
          </div>
          <select
            value={trip.currency}
            onChange={(e) => onSettingsChange({ currency: e.target.value as Trip['currency'] })}
            className="rounded-pill border border-ink-200 bg-white px-2 py-1 text-[10px] font-semibold uppercase text-ink-700"
          >
            {['USD','EUR','MXN','GBP','CAD','AUD'].map(c => <option key={c}>{c}</option>)}
          </select>
          <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
            {saving ? (isEs ? 'Guardando…' : 'Saving…') : (isEs ? '✓ Guardado' : '✓ Saved')}
          </span>
        </div>
      </div>

      {/* Totals */}
      {totalDist > 0 && (
        <div className="grid grid-cols-2 gap-2 border-b border-ink-100 bg-white px-6 pb-4">
          <div className="rounded-lg bg-ink-50 p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
              {isEs ? 'Distancia total' : 'Total distance'}
            </div>
            <div className="font-display text-lg font-semibold text-ink-900">{formatDistance(totalDist, trip.unit_system)}</div>
          </div>
          <div className="rounded-lg bg-ink-50 p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
              {isEs ? 'Manejo total' : 'Drive time'}
            </div>
            <div className="font-display text-lg font-semibold text-ink-900">{formatDuration(totalDur)}</div>
          </div>
        </div>
      )}

      {/* Stops list */}
      <div className="flex-1 overflow-auto p-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={trip.stops.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <ul className="space-y-2">
              {trip.stops.map((stop, i) => (
                <SortableStop
                  key={stop.id}
                  stop={stop}
                  index={i}
                  leg={legs[i]}
                  unit={trip.unit_system}
                  isEs={isEs}
                  onHover={onHover}
                  onRemove={() => handleRemove(stop.id)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>

        {/* Add stop */}
        <div className="mt-4">
          <PlacesAutocomplete
            placeholder={isEs ? '+ Agregar parada' : '+ Add stop'}
            onSelect={handleAdd}
          />
        </div>
      </div>
    </aside>
  );
}
