'use client';
import type { ItineraryItem } from '@/lib/itinerary/types';
import { haversineKm } from '@/lib/itinerary/validate';

interface Props {
  from: ItineraryItem;
  to: ItineraryItem;
  locale: 'en' | 'es';
}

// Estimate mode by distance (heurístico simple, sin llamar Routes API)
function estimateMode(km: number): { emoji: string; mode: 'walk' | 'drive' | 'transit'; min: number } {
  if(km < 1) return { emoji: '🚶', mode: 'walk', min: Math.round(km * 15) };  // 4 km/h
  if(km < 8) return { emoji: '🚗', mode: 'drive', min: Math.round(km * 3) };   // 20 km/h urbano
  return { emoji: '🚗', mode: 'drive', min: Math.round(km * 1.5) };            // 40 km/h
}

export function TravelSegment({ from, to, locale }: Props){
  const isEs = locale === 'es';
  if(!from.lat || !from.lng || !to.lat || !to.lng){
    return (
      <div className="my-1 flex items-center gap-2 pl-6 text-[10px] text-ink-400">
        <span aria-hidden>│</span>
        <span>{isEs ? 'sin coordenadas' : 'no coords'}</span>
      </div>
    );
  }
  const km = haversineKm({ lat: from.lat, lng: from.lng }, { lat: to.lat, lng: to.lng });
  const { emoji, mode, min } = estimateMode(km);
  const modeLabel = isEs
    ? { walk: 'a pie', drive: 'auto', transit: 'transporte' }[mode]
    : { walk: 'walking', drive: 'driving', transit: 'transit' }[mode];
  const distStr = km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;

  return (
    <div className="my-0.5 flex items-center gap-2 pl-6 text-[11px] text-ink-500">
      <span aria-hidden className="text-ink-300">│</span>
      <span className="text-base leading-none" aria-hidden>{emoji}</span>
      <span className="font-semibold text-ink-700">{min} min</span>
      <span>·</span>
      <span>{distStr}</span>
      <span className="text-ink-400">· {modeLabel}</span>
    </div>
  );
}
