'use client';
import { useEffect, useState } from 'react';
import type { ItineraryItem } from '@/lib/itinerary/types';

// S47 P4: Undo banner que aparece post-AI-apply. Auto-dismiss 15s.

interface Props {
  slug: string;
  snapshot: ItineraryItem[] | null;
  onCleared: () => void;
  onRestored: () => void;
  locale: 'en' | 'es';
}

export function UndoBanner({ slug, snapshot, onCleared, onRestored, locale }: Props){
  const isEs = locale === 'es';
  const [restoring, setRestoring] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(15);

  useEffect(() => {
    if(!snapshot) return;
    setSecondsLeft(15);
    const timer = setInterval(() => {
      setSecondsLeft(s => {
        if(s <= 1){ clearInterval(timer); onCleared(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [snapshot, onCleared]);

  if(!snapshot) return null;

  const restore = async () => {
    setRestoring(true);
    try {
      const r = await fetch(`/api/trips/${slug}/itinerary/snapshot`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ items: snapshot })
      });
      if(r.ok){
        onRestored();
        onCleared();
      }
    } finally { setRestoring(false); }
  };

  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-pill border border-ink-800 bg-ink-900 px-4 py-3 text-white shadow-2xl flex items-center gap-3 text-sm max-w-md">
      <span aria-hidden>✓</span>
      <span className="font-semibold">
        {isEs ? 'Cambios aplicados' : 'Changes applied'}
      </span>
      <button
        onClick={restore}
        disabled={restoring}
        className="rounded-pill bg-white/10 px-3 py-1 text-xs font-semibold hover:bg-white/20 disabled:opacity-50"
      >
        {restoring ? (isEs ? 'Deshaciendo…' : 'Undoing…') : `↺ ${isEs ? 'Deshacer' : 'Undo'} (${secondsLeft}s)`}
      </button>
      <button
        onClick={onCleared}
        aria-label={isEs ? 'Cerrar' : 'Dismiss'}
        className="text-white/60 hover:text-white"
      >✕</button>
    </div>
  );
}
