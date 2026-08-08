'use client';
import { useState, useEffect } from 'react';
import type { TripChecklist } from '@/app/api/ai/trip-checklist/route';

interface Props {
  slug: string;
  locale: 'en' | 'es';
}

const STORAGE_KEY = (slug: string) => `triploop:checklist:${slug}`;

export function ChecklistCard({ slug, locale }: Props){
  const isEs = locale === 'es';
  const [checklist, setChecklist] = useState<TripChecklist | null>(null);
  const [loading, setLoading] = useState(true);
  const [packed, setPacked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY(slug)); if(raw) setPacked(JSON.parse(raw)); } catch {}
  }, [slug]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/ai/trip-checklist', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ slug, locale })
        });
        const data = await r.json();
        if(r.ok && data.checklist) setChecklist(data.checklist);
      } finally { setLoading(false); }
    })();
  }, [slug, locale]);

  const toggle = (id: string) => {
    const next = { ...packed, [id]: !packed[id] };
    setPacked(next);
    try { localStorage.setItem(STORAGE_KEY(slug), JSON.stringify(next)); } catch {}
  };

  if(loading){
    return (
      <div className="rounded-card border border-ink-100 bg-white p-6 shadow-card">
        <div className="flex items-center gap-3">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-emerald-300 border-t-emerald-700" />
          <span className="text-sm text-ink-700">{isEs ? 'Generando checklist personalizado…' : 'Generating personalized checklist…'}</span>
        </div>
      </div>
    );
  }

  if(!checklist) return null;

  const totalItems = checklist.categories.reduce((sum, c) => sum + c.items.length, 0);
  const packedCount = Object.values(packed).filter(Boolean).length;
  const progress = totalItems > 0 ? Math.round((packedCount / totalItems) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-card border border-ink-100 bg-white p-6 shadow-card">
        <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-ink-900">
          <span aria-hidden>📋</span>
          {isEs ? 'Qué llevar' : 'Packing checklist'}
        </h3>
        <p className="mt-1 text-sm text-ink-500">{checklist.context_note}</p>
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-semibold text-ink-700">{packedCount}/{totalItems} {isEs ? 'empacados' : 'packed'}</span>
            <span className="text-emerald-600 font-bold">{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {checklist.categories.map(cat => (
        <div key={cat.key} className="rounded-card border border-ink-100 bg-white p-5 shadow-card">
          <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-ink-700">{cat.label}</h4>
          <div className="space-y-1.5">
            {cat.items.map(item => {
              const isPacked = !!packed[item.id];
              return (
                <label key={item.id} className={`flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition ${isPacked ? 'bg-emerald-50/50' : 'hover:bg-ink-50'}`}>
                  <input type="checkbox" checked={isPacked} onChange={() => toggle(item.id)} className="h-4 w-4 rounded border-ink-300 text-emerald-600 focus:ring-emerald-500" />
                  <span className={`flex-1 text-sm ${isPacked ? 'text-ink-400 line-through' : 'text-ink-800'}`}>
                    {item.label}
                  </span>
                  {item.essential && !isPacked && (
                    <span className="rounded-pill bg-coral-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-coral-700">
                      {isEs ? 'IMP' : 'MUST'}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <p className="text-center text-[10px] text-ink-400">
        {isEs ? 'Progreso guardado en tu dispositivo · ' : 'Progress saved on your device · '}
        {isEs ? 'IA-generado' : 'AI-generated'}
      </p>
    </div>
  );
}
