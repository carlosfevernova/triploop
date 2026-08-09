'use client';
import { useState, useEffect, useCallback } from 'react';

// S43 P1: Voting grupal per stop.
// Uso: <StopVoting slug={trip.slug} stopKey={stableKeyFor(stop)} locale={locale} />
// Se muestra bajo cada stop en el itinerary. Lecturas públicas, escritura requiere auth.

interface Tally { like: number; maybe: number; no: number; myVote: string | null; total: number }

interface Props {
  slug: string;
  stopKey: string;
  locale: 'en' | 'es';
  compact?: boolean;
}

export function StopVoting({ slug, stopKey, locale, compact = false }: Props){
  const isEs = locale === 'es';
  const [tally, setTally] = useState<Tally>({ like: 0, maybe: 0, no: 0, myVote: null, total: 0 });
  const [loading, setLoading] = useState(false);
  const [needAuth, setNeedAuth] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/trips/${slug}/votes`);
      if(!r.ok) return;
      const data = await r.json();
      const t = data.tallies?.[stopKey];
      if(t) setTally(t);
    } catch {}
  }, [slug, stopKey]);

  useEffect(() => { load(); }, [load]);

  const vote = async (v: 'like' | 'maybe' | 'no') => {
    setLoading(true);
    try {
      // Optimistic
      setTally(prev => {
        const next = { ...prev };
        if(prev.myVote === v){
          // toggle off
          next[v] = Math.max(0, prev[v] - 1);
          next.myVote = null;
          next.total = Math.max(0, prev.total - 1);
        } else {
          if(prev.myVote){
            const old = prev.myVote as 'like' | 'maybe' | 'no';
            if(next[old] !== undefined) next[old] = Math.max(0, prev[old] - 1);
          } else {
            next.total = prev.total + 1;
          }
          next[v] = prev[v] + 1;
          next.myVote = v;
        }
        return next;
      });

      if(tally.myVote === v){
        const r = await fetch(`/api/trips/${slug}/votes?stop_key=${encodeURIComponent(stopKey)}`, { method: 'DELETE', credentials: 'same-origin' });
        if(r.status === 401){ setNeedAuth(true); await load(); return; }
      } else {
        const r = await fetch(`/api/trips/${slug}/votes`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ stop_key: stopKey, vote: v })
        });
        if(r.status === 401){ setNeedAuth(true); await load(); return; }
      }
    } finally {
      setLoading(false);
    }
  };

  if(needAuth){
    return (
      <div className="mt-2 text-[10px] text-ocean-700">
        {isEs ? '🔒 Inicia sesión para votar' : '🔒 Sign in to vote'}
      </div>
    );
  }

  const gap = compact ? 'gap-1' : 'gap-1.5';
  const btnBase = compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-[11px]';

  const btn = (v: 'like' | 'maybe' | 'no', emoji: string, labelEs: string, labelEn: string, colorActive: string) => {
    const active = tally.myVote === v;
    const count = tally[v];
    return (
      <button
        onClick={() => vote(v)}
        disabled={loading}
        aria-pressed={active}
        aria-label={isEs ? labelEs : labelEn}
        className={`inline-flex items-center gap-1 rounded-pill border font-semibold transition ${btnBase} ${active ? colorActive : 'border-ink-200 bg-white text-ink-500 hover:border-ink-400 hover:text-ink-800'} disabled:opacity-50`}
      >
        <span aria-hidden>{emoji}</span>
        {count > 0 && <span className="tabular-nums">{count}</span>}
      </button>
    );
  };

  return (
    <div className={`inline-flex items-center ${gap}`}>
      {btn('like', '👍', 'Me gusta', 'Like', 'border-emerald-500 bg-emerald-50 text-emerald-700')}
      {btn('maybe', '🤔', 'Tal vez', 'Maybe', 'border-amber-500 bg-amber-50 text-amber-700')}
      {btn('no', '👎', 'No me gusta', 'Not for me', 'border-red-500 bg-red-50 text-red-700')}
      {tally.total > 0 && !compact && (
        <span className="ml-1 text-[10px] text-ink-400">{tally.total} {isEs ? 'voto' : 'vote'}{tally.total > 1 ? 's' : ''}</span>
      )}
    </div>
  );
}

// Helper: genera key estable para un stop (coord-based)
export function stableStopKey(stop: { lat?: number; lng?: number; name?: string }, index: number): string {
  if(typeof stop.lat === 'number' && typeof stop.lng === 'number'){
    return `${stop.lat.toFixed(4)}_${stop.lng.toFixed(4)}`;
  }
  return `idx_${index}_${(stop.name || '').toLowerCase().replace(/\s+/g, '-').slice(0, 40)}`;
}
