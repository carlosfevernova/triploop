import type { UnitSystem } from './types';

export function formatDistance(meters: number, system: UnitSystem, locale = 'en'): string {
  if(system === 'imperial'){
    const mi = meters / 1609.344;
    return mi < 0.1 ? `${Math.round(meters * 3.28084)} ft`
      : mi < 10 ? `${mi.toFixed(1)} mi`
      : `${Math.round(mi)} mi`;
  }
  const km = meters / 1000;
  return km < 1 ? `${Math.round(meters)} m`
    : km < 10 ? `${km.toFixed(1)} km`
    : `${Math.round(km)} km`;
}

export function formatDuration(seconds: number, locale = 'en'): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  const isEs = locale === 'es';
  if(h === 0) return isEs ? `${m} min` : `${m} min`;
  if(m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatBothUnits(meters: number, locale = 'en'): string {
  const km = Math.round(meters / 1000);
  const mi = Math.round(meters / 1609.344);
  return `${km} km / ${mi} mi`;
}
