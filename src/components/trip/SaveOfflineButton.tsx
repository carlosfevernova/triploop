'use client';
import { useEffect, useState } from 'react';
import { isTripOffline, saveTripOffline, prefetchTilesForTrip, removeOfflineTrip } from '@/lib/offline-cache';
import type { Trip } from '@/lib/types';

interface Props {
  trip: Trip;
  isEs?: boolean;
}

export function SaveOfflineButton({ trip, isEs }: Props){
  const [saved, setSaved] = useState<boolean | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try { setSaved(await isTripOffline(trip.slug)); } catch { setSaved(false); }
    })();
  }, [trip.slug]);

  const save = async () => {
    setSaving(true);
    setProgress({ done: 0, total: 1 });
    try {
      await saveTripOffline(trip);
      await prefetchTilesForTrip(trip, (done, total) => setProgress({ done, total }));
      setSaved(true);
    } finally {
      setSaving(false);
      setTimeout(() => setProgress(null), 1500);
    }
  };

  const remove = async () => {
    if(!confirm(isEs ? '¿Eliminar copia offline? Los mapas cacheados se conservan.' : 'Remove offline copy? Cached map tiles will remain.')) return;
    await removeOfflineTrip(trip.slug);
    setSaved(false);
  };

  if(saved === null) return null;

  const pct = progress && progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="relative">
      <button
        onClick={saved ? remove : save}
        disabled={saving}
        className={`rounded-pill px-4 py-2 text-xs font-semibold transition disabled:opacity-60 ${
          saved
            ? 'border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            : 'border border-ink-200 bg-white text-ink-700 hover:border-ink-800'
        }`}
      >
        {saving
          ? `${pct}%…`
          : saved
            ? (isEs ? '✓ Offline' : '✓ Offline')
            : (isEs ? '📥 Guardar offline' : '📥 Save offline')}
      </button>
      {saving && progress && (
        <div className="absolute inset-x-0 -bottom-6 rounded-full bg-ink-100">
          <div
            className="h-1 rounded-full bg-coral-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
