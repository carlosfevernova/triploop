// S46 P4: AI operations schema + validation
// Operations-first: el LLM SIEMPRE devuelve un array de ops estructuradas.
// Nunca UI, nunca prosa; el usuario ve preview y confirma antes de aplicar.

import type { ItineraryItem, TripDay, ItineraryItemType, Priority } from './types';

export type ItineraryOp =
  | { op: 'move_item'; item_id: number; target_day_id: number | null; reason?: string }
  | { op: 'update_time'; item_id: number; start_local: string | null; reason?: string }
  | { op: 'update_duration'; item_id: number; duration_min: number | null; reason?: string }
  | { op: 'add_item'; title: string; type?: ItineraryItemType; trip_day_id?: number | null; start_local?: string | null; duration_min?: number | null; reason?: string }
  | { op: 'remove_item'; item_id: number; reason?: string }
  | { op: 'set_priority'; item_id: number; priority: Priority; reason?: string }
  | { op: 'set_fixed'; item_id: number; fixed: boolean; reason?: string }
  | { op: 'set_notes'; item_id: number; notes: string; reason?: string }
  | { op: 'optimize_day'; day_id: number; reason?: string }
  | { op: 'schedule_day'; day_id: number; start_min?: number; reason?: string };

const VALID_OPS = new Set([
  'move_item','update_time','update_duration','add_item','remove_item',
  'set_priority','set_fixed','set_notes','optimize_day','schedule_day'
]);
const VALID_TYPES: ItineraryItemType[] = ['place','meal','hotel','flight','train','drive','walk','event','note','free_time'];
const VALID_PRIORITY: Priority[] = ['must','preferred','optional'];

// Sanitize + validate ops que vienen del LLM. Descarta las mal formadas.
export function validateOps(rawOps: unknown[], items: ItineraryItem[], days: TripDay[]): ItineraryOp[] {
  if(!Array.isArray(rawOps)) return [];
  const validItemIds = new Set(items.map(i => i.id));
  const validDayIds = new Set(days.map(d => d.id));
  const out: ItineraryOp[] = [];

  for(const r of rawOps){
    if(!r || typeof r !== 'object') continue;
    const raw = r as Record<string, unknown>;
    const op = String(raw.op || '');
    if(!VALID_OPS.has(op)) continue;
    const reason = typeof raw.reason === 'string' ? String(raw.reason).slice(0, 200) : undefined;

    if(op === 'move_item'){
      const item_id = Number(raw.item_id);
      const target_day_id = raw.target_day_id === null ? null : Number(raw.target_day_id);
      if(!validItemIds.has(item_id)) continue;
      if(target_day_id !== null && !validDayIds.has(target_day_id)) continue;
      out.push({ op: 'move_item', item_id, target_day_id, reason });
    } else if(op === 'update_time'){
      const item_id = Number(raw.item_id);
      const start_local = raw.start_local === null ? null : String(raw.start_local).slice(0, 8);
      if(!validItemIds.has(item_id)) continue;
      if(start_local !== null && !/^\d{1,2}:\d{2}/.test(start_local)) continue;
      out.push({ op: 'update_time', item_id, start_local, reason });
    } else if(op === 'update_duration'){
      const item_id = Number(raw.item_id);
      const duration_min = raw.duration_min === null ? null : Number(raw.duration_min);
      if(!validItemIds.has(item_id)) continue;
      if(duration_min !== null && (isNaN(duration_min) || duration_min < 0 || duration_min > 1440)) continue;
      out.push({ op: 'update_duration', item_id, duration_min, reason });
    } else if(op === 'add_item'){
      const title = String(raw.title || '').slice(0, 200);
      if(!title) continue;
      const type = VALID_TYPES.includes(raw.type as ItineraryItemType) ? raw.type as ItineraryItemType : 'place';
      const trip_day_id = raw.trip_day_id === null ? null : (raw.trip_day_id !== undefined ? Number(raw.trip_day_id) : null);
      if(trip_day_id !== null && !validDayIds.has(trip_day_id)) continue;
      const start_local = raw.start_local ? String(raw.start_local).slice(0, 8) : null;
      const duration_min = raw.duration_min !== undefined ? Number(raw.duration_min) : null;
      out.push({ op: 'add_item', title, type, trip_day_id, start_local, duration_min, reason });
    } else if(op === 'remove_item'){
      const item_id = Number(raw.item_id);
      if(!validItemIds.has(item_id)) continue;
      out.push({ op: 'remove_item', item_id, reason });
    } else if(op === 'set_priority'){
      const item_id = Number(raw.item_id);
      const priority = raw.priority as Priority;
      if(!validItemIds.has(item_id) || !VALID_PRIORITY.includes(priority)) continue;
      out.push({ op: 'set_priority', item_id, priority, reason });
    } else if(op === 'set_fixed'){
      const item_id = Number(raw.item_id);
      if(!validItemIds.has(item_id)) continue;
      out.push({ op: 'set_fixed', item_id, fixed: !!raw.fixed, reason });
    } else if(op === 'set_notes'){
      const item_id = Number(raw.item_id);
      const notes = String(raw.notes || '').slice(0, 1000);
      if(!validItemIds.has(item_id)) continue;
      out.push({ op: 'set_notes', item_id, notes, reason });
    } else if(op === 'optimize_day'){
      const day_id = Number(raw.day_id);
      if(!validDayIds.has(day_id)) continue;
      out.push({ op: 'optimize_day', day_id, reason });
    } else if(op === 'schedule_day'){
      const day_id = Number(raw.day_id);
      if(!validDayIds.has(day_id)) continue;
      const start_min = raw.start_min !== undefined ? Number(raw.start_min) : undefined;
      out.push({ op: 'schedule_day', day_id, start_min, reason });
    }
  }

  // Cap: máximo 20 ops por request (evita cascadas destructivas)
  return out.slice(0, 20);
}

// Human-readable label per op (para preview UI)
export function opLabel(op: ItineraryOp, items: ItineraryItem[], days: TripDay[], isEs: boolean): string {
  const findItem = (id: number) => items.find(i => i.id === id);
  const findDay = (id: number | null) => id === null ? null : days.find(d => d.id === id);
  const dayLabel = (id: number | null) => {
    const d = findDay(id);
    if(!d) return isEs ? 'Sin día' : 'Unscheduled';
    return d.date ? `${isEs ? 'Día' : 'Day'} ${d.day_number} · ${d.date}` : `${isEs ? 'Día' : 'Day'} ${d.day_number}`;
  };

  switch(op.op){
    case 'move_item': {
      const i = findItem(op.item_id);
      return isEs
        ? `Mover "${i?.title || op.item_id}" a ${dayLabel(op.target_day_id)}`
        : `Move "${i?.title || op.item_id}" to ${dayLabel(op.target_day_id)}`;
    }
    case 'update_time': {
      const i = findItem(op.item_id);
      return isEs
        ? `Cambiar hora de "${i?.title || op.item_id}" a ${op.start_local || 'sin hora'}`
        : `Change time of "${i?.title || op.item_id}" to ${op.start_local || 'no time'}`;
    }
    case 'update_duration': {
      const i = findItem(op.item_id);
      return isEs
        ? `Duración de "${i?.title || op.item_id}" → ${op.duration_min ? `${op.duration_min} min` : 'sin duración'}`
        : `Duration of "${i?.title || op.item_id}" → ${op.duration_min ? `${op.duration_min} min` : 'no duration'}`;
    }
    case 'add_item':
      return isEs
        ? `Agregar "${op.title}" (${op.type || 'place'}) a ${dayLabel(op.trip_day_id ?? null)}${op.start_local ? ` a las ${op.start_local}` : ''}`
        : `Add "${op.title}" (${op.type || 'place'}) to ${dayLabel(op.trip_day_id ?? null)}${op.start_local ? ` at ${op.start_local}` : ''}`;
    case 'remove_item': {
      const i = findItem(op.item_id);
      return isEs ? `Eliminar "${i?.title || op.item_id}"` : `Remove "${i?.title || op.item_id}"`;
    }
    case 'set_priority': {
      const i = findItem(op.item_id);
      return isEs ? `Prioridad de "${i?.title || op.item_id}" → ${op.priority}` : `Priority of "${i?.title || op.item_id}" → ${op.priority}`;
    }
    case 'set_fixed': {
      const i = findItem(op.item_id);
      return isEs ? `${op.fixed ? 'Fijar' : 'Desfijar'} "${i?.title || op.item_id}"` : `${op.fixed ? 'Lock' : 'Unlock'} "${i?.title || op.item_id}"`;
    }
    case 'set_notes': {
      const i = findItem(op.item_id);
      return isEs ? `Notas de "${i?.title || op.item_id}" (${op.notes.length} chars)` : `Notes for "${i?.title || op.item_id}" (${op.notes.length} chars)`;
    }
    case 'optimize_day':
      return isEs ? `Optimizar ${dayLabel(op.day_id)} (min. distancia)` : `Optimize ${dayLabel(op.day_id)} (min. distance)`;
    case 'schedule_day':
      return isEs ? `Auto-asignar horas en ${dayLabel(op.day_id)}` : `Auto-schedule ${dayLabel(op.day_id)}`;
  }
}
