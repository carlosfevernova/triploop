// S44: integer position gaps para reorder sin recalcular O(N)
// Estrategia: 100, 200, 300…  Al insertar entre A y B: (A+B)/2.
// Cuando gap < 2 → renormalize (call DB function itinerary_renormalize_positions).

import type { ItineraryItem } from './types';

export const POSITION_GAP = 100;

// Posición para agregar al final
export function positionForAppend(items: ItineraryItem[]): number {
  if(items.length === 0) return POSITION_GAP;
  const max = Math.max(...items.map(i => i.position));
  return max + POSITION_GAP;
}

// Posición para insertar antes del item con id `beforeId`
export function positionForInsertBefore(items: ItineraryItem[], beforeId: number): number {
  const sorted = [...items].sort((a, b) => a.position - b.position);
  const idx = sorted.findIndex(i => i.id === beforeId);
  if(idx === -1) return positionForAppend(items);
  if(idx === 0) return Math.max(1, sorted[0].position - POSITION_GAP);
  return Math.floor((sorted[idx - 1].position + sorted[idx].position) / 2);
}

// Detecta si necesitamos renormalize (algún gap < 2 después de un reorder)
export function needsRenormalize(items: ItineraryItem[]): boolean {
  const sorted = [...items].sort((a, b) => a.position - b.position);
  for(let i = 1; i < sorted.length; i++){
    if(sorted[i].position - sorted[i - 1].position < 2) return true;
  }
  return false;
}

// Optimistic reorder local (para UI antes de persistir)
export function localReorder(items: ItineraryItem[], activeId: number, overId: number): ItineraryItem[] {
  const sorted = [...items].sort((a, b) => a.position - b.position);
  const activeIdx = sorted.findIndex(i => i.id === activeId);
  const overIdx = sorted.findIndex(i => i.id === overId);
  if(activeIdx === -1 || overIdx === -1 || activeIdx === overIdx) return sorted;
  const [moved] = sorted.splice(activeIdx, 1);
  sorted.splice(overIdx, 0, moved);
  // Reasignar positions locales (100, 200, 300…)
  return sorted.map((i, idx) => ({ ...i, position: (idx + 1) * POSITION_GAP }));
}
