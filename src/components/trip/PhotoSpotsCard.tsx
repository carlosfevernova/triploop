'use client';
import { useState, useEffect } from 'react';
import type { PhotoSpotsResult } from '@/app/api/ai/photo-spots/route';

interface Props { slug: string; locale: 'en' | 'es'; }

export function PhotoSpotsCard({ slug, locale }: Props){
  const isEs = locale === 'es';
  const [data, setData] = useState<PhotoSpotsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'yes' | 'maybe' | 'skip'>('all');

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/ai/photo-spots', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ slug, locale })
        });
        const j = await r.json();
        if(r.ok && j.photo_spots) setData(j.photo_spots);
      } finally { setLoading(false); }
    })();
  }, [slug, locale]);

  if(loading){
    return (
      <div className="rounded-card border border-ink-100 bg-white p-6 shadow-card">
        <div className="flex items-center gap-3">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-amber-300 border-t-amber-700" />
          <span className="text-sm text-ink-700">{isEs ? 'Buscando spots de foto icónicos…' : 'Finding iconic photo spots…'}</span>
        </div>
      </div>
    );
  }

  if(!data) return null;

  const filtered = filter === 'all' ? data.spots : data.spots.filter(s => s.worth_it === filter);

  const badge = (w: 'yes' | 'maybe' | 'skip') => {
    if(w === 'yes') return { bg: 'bg-emerald-100', text: 'text-emerald-800', label: isEs ? '⭐ Vale la pena' : '⭐ Worth it' };
    if(w === 'skip') return { bg: 'bg-red-100', text: 'text-red-800', label: isEs ? '⛔ Saltar' : '⛔ Skip' };
    return { bg: 'bg-amber-100', text: 'text-amber-800', label: isEs ? '🤔 Depende' : '🤔 Maybe' };
  };

  const counts = {
    yes: data.spots.filter(s => s.worth_it === 'yes').length,
    maybe: data.spots.filter(s => s.worth_it === 'maybe').length,
    skip: data.spots.filter(s => s.worth_it === 'skip').length
  };

  return (
    <div className="space-y-4">
      <div className="rounded-card border border-ink-100 bg-white p-6 shadow-card">
        <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-ink-900">
          <span aria-hidden>📸</span>
          {isEs ? 'Spots de foto' : 'Photo spots'}
        </h3>
        <p className="mt-1 text-sm text-ink-500">
          {isEs ? `${data.spots.length} spots · ${counts.yes} icónicos · ${counts.maybe} opcionales · ${counts.skip} saltar` : `${data.spots.length} spots · ${counts.yes} iconic · ${counts.maybe} optional · ${counts.skip} skip`}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[
            { k: 'all' as const, label: isEs ? 'Todos' : 'All', count: data.spots.length },
            { k: 'yes' as const, label: isEs ? '⭐ Vale' : '⭐ Worth', count: counts.yes },
            { k: 'maybe' as const, label: isEs ? '🤔 Depende' : '🤔 Maybe', count: counts.maybe },
            { k: 'skip' as const, label: isEs ? '⛔ Saltar' : '⛔ Skip', count: counts.skip }
          ].map(f => (
            <button
              key={f.k} onClick={() => setFilter(f.k)}
              className={`rounded-pill px-3 py-1 text-xs font-semibold transition ${filter === f.k ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}
            >{f.label} · {f.count}</button>
          ))}
        </div>
      </div>

      {filtered.map((s, i) => {
        const b = badge(s.worth_it);
        return (
          <div key={i} className="rounded-card border border-ink-100 bg-white p-5 shadow-card">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">{s.stop_name}</div>
                <div className="mt-0.5 font-display text-base font-semibold text-ink-900">{s.spot}</div>
              </div>
              <span className={`shrink-0 rounded-pill px-3 py-1 text-[10px] font-bold ${b.bg} ${b.text}`}>{b.label}</span>
            </div>
            <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
              <div><span className="text-ink-400">⏰ {isEs ? 'Mejor hora' : 'Best time'}</span><br /><span className="text-ink-800 font-medium">{s.best_time}</span></div>
              <div><span className="text-ink-400">📐 {isEs ? 'Ángulo' : 'Angle'}</span><br /><span className="text-ink-800 font-medium">{s.best_angle}</span></div>
              <div><span className="text-ink-400">⏱ {isEs ? 'Espera típica' : 'Typical wait'}</span><br /><span className="text-ink-800 font-medium">{s.wait_time_min} min</span></div>
            </div>
            {s.tips && (
              <div className="mt-3 rounded-lg bg-ocean-50/50 px-3 py-2 text-xs text-ocean-900">
                💡 {s.tips}
              </div>
            )}
          </div>
        );
      })}

      <p className="text-center text-[10px] text-ink-400">{isEs ? 'IA-generado · datos aproximados' : 'AI-generated · approximate data'}</p>
    </div>
  );
}
