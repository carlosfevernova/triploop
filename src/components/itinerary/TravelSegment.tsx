'use client';
import { memo } from 'react';
import type { ItineraryItem } from '@/lib/itinerary/types';
import { haversineKm } from '@/lib/itinerary/validate';
import { L } from '@/lib/l4';

// S71m: 4-locale migration. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
interface RealLeg {
  from_item_id: number;
  to_item_id: number;
  distance_m: number;
  duration_s: number;
  duration_traffic_s: number;
}

interface Props {
  from: ItineraryItem;
  to: ItineraryItem;
  locale: string;
  leg?: RealLeg;  // S45 P2: si viene, usar datos reales de Google Routes
}

function estimateMode(km: number): { emoji: string; mode: 'walk' | 'drive' | 'transit'; min: number } {
  if(km < 1) return { emoji: '🚶', mode: 'walk', min: Math.round(km * 15) };
  if(km < 8) return { emoji: '🚗', mode: 'drive', min: Math.round(km * 3) };
  return { emoji: '🚗', mode: 'drive', min: Math.round(km * 1.5) };
}

function TravelSegmentImpl({ from, to, locale, leg }: Props){
  if(leg){
    const km = leg.distance_m / 1000;
    const min = Math.round((leg.duration_traffic_s || leg.duration_s) / 60);
    const hasTraffic = leg.duration_traffic_s > leg.duration_s * 1.15;
    const distStr = km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
    const liveTitle = L(locale, {
      en: 'Google Routes with traffic',
      es: 'Google Routes con tráfico',
      pt: 'Google Routes com trânsito',
      de: 'Google Routes mit Verkehr'
    });
    const trafficLabel = L(locale, { en: 'Traffic', es: 'Tráfico', pt: 'Trânsito', de: 'Verkehr' });
    return (
      <div className="my-0.5 flex items-center gap-2 pl-6 text-[11px] text-ink-500">
        <span aria-hidden className="text-ink-300">│</span>
        <span className="text-base leading-none" aria-hidden>🚗</span>
        <span className="font-semibold text-ink-700">{min} min</span>
        <span>·</span>
        <span>{distStr}</span>
        <span className="rounded-pill bg-emerald-50 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wide text-emerald-700" title={liveTitle}>Live</span>
        {hasTraffic && <span className="rounded-pill bg-amber-100 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wide text-amber-800">⚠ {trafficLabel}</span>}
      </div>
    );
  }

  if(!from.lat || !from.lng || !to.lat || !to.lng){
    return (
      <div className="my-1 flex items-center gap-2 pl-6 text-[10px] text-ink-400">
        <span aria-hidden>│</span>
        <span>{L(locale, { en: 'no coords', es: 'sin coordenadas', pt: 'sem coordenadas', de: 'keine Koordinaten' })}</span>
      </div>
    );
  }
  const km = haversineKm({ lat: from.lat, lng: from.lng }, { lat: to.lat, lng: to.lng });
  const { emoji, mode, min } = estimateMode(km);
  const modeLabels: Record<'walk' | 'drive' | 'transit', Record<'en'|'es'|'pt'|'de', string>> = {
    walk:    { en: 'walking', es: 'a pie',       pt: 'a pé',        de: 'zu Fuß' },
    drive:   { en: 'driving', es: 'auto',        pt: 'de carro',    de: 'mit Auto' },
    transit: { en: 'transit', es: 'transporte',  pt: 'transporte',  de: 'Nahverkehr' }
  };
  const modeLabel = L(locale, modeLabels[mode]);
  const distStr = km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
  const estMark = L(locale, { en: 'est.', es: 'est.', pt: 'est.', de: 'geschätzt' });

  return (
    <div className="my-0.5 flex items-center gap-2 pl-6 text-[11px] text-ink-500">
      <span aria-hidden className="text-ink-300">│</span>
      <span className="text-base leading-none" aria-hidden>{emoji}</span>
      <span className="font-semibold text-ink-700">~{min} min</span>
      <span>·</span>
      <span>{distStr}</span>
      <span className="text-ink-400">· {modeLabel} ({estMark})</span>
    </div>
  );
}

// S66: memo — evita recompute haversine cuando from/to no cambiaron
export const TravelSegment = memo(TravelSegmentImpl);
