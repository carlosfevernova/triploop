'use client';
import { useState, useEffect } from 'react';
import type { ItineraryItem, TripDay } from '@/lib/itinerary/types';
import { opLabel, type ItineraryOp } from '@/lib/itinerary/ai-operations';
import { ErrorState } from '@/components/trip/StateFallbacks';

interface Props {
  open: boolean;
  onClose: () => void;
  slug: string;
  items: ItineraryItem[];
  days: TripDay[];
  locale: 'en' | 'es';
  onApplied: () => void;  // trigger reload
}

const EXAMPLES_EN = [
  'Move Louvre to Thursday',
  'Schedule Tuesday starting at 10:00',
  'Optimize day 2 by distance',
  'Add dinner at 8pm on day 3',
  'Make me a less packed day 1',
  'Lock all hotels so AI won\'t move them'
];
const EXAMPLES_ES = [
  'Mueve el Louvre al jueves',
  'Programa el martes empezando 10:00',
  'Optimiza el día 2 por distancia',
  'Agrega cena a las 8pm el día 3',
  'Hazme el día 1 menos pesado',
  'Fija todos los hoteles para que la IA no los mueva'
];

export function AIAssistantDrawer({ open, onClose, slug, items, days, locale, onApplied }: Props){
  const isEs = locale === 'es';
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [operations, setOperations] = useState<ItineraryOp[]>([]);
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if(e.key === 'Escape') onClose(); };
    if(open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if(!open){ setPrompt(''); setOperations([]); setExplanation(''); setError(null); setApplied(false); }
  }, [open]);

  if(!open) return null;

  const ask = async () => {
    if(!prompt.trim()) return;
    setLoading(true); setError(null); setOperations([]); setExplanation(''); setApplied(false);
    try {
      const r = await fetch(`/api/trips/${slug}/itinerary/ai`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await r.json();
      if(!r.ok){ setError(data.error || 'ai_failed'); return; }
      setOperations(data.operations || []);
      setExplanation(data.explanation || '');
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  const apply = async () => {
    if(operations.length === 0) return;
    setApplying(true);
    try {
      const r = await fetch(`/api/trips/${slug}/itinerary/ai/apply`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ operations })
      });
      const data = await r.json();
      if(r.ok){
        setApplied(true);
        onApplied();
        // Auto-close after 1.5s
        setTimeout(onClose, 1500);
      } else {
        setError(data.error || 'apply_failed');
      }
    } finally { setApplying(false); }
  };

  const examples = isEs ? EXAMPLES_ES : EXAMPLES_EN;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-ink-100 bg-gradient-to-br from-coral-50 via-white to-ocean-400/5 p-5">
          <div>
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <span aria-hidden>✨</span> {isEs ? 'Asistente IA' : 'AI Assistant'}
            </h2>
            <p className="mt-0.5 text-[11px] text-ink-500">
              {isEs ? 'Edita tu itinerario en lenguaje natural' : 'Edit your itinerary in natural language'}
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-ink-400 hover:bg-ink-100">✕</button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {/* Input */}
          <div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
              placeholder={isEs ? 'Ej. "Mueve el Louvre al jueves y agrega cena a las 8pm"' : 'e.g. "Move Louvre to Thursday and add dinner at 8pm"'}
              rows={3}
              autoFocus
              className="w-full rounded-card border border-ink-200 p-3 text-sm outline-none focus:border-ink-900"
            />
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[10px] text-ink-400">{prompt.length}/500</span>
              <button
                onClick={ask}
                disabled={loading || !prompt.trim()}
                className="rounded-pill bg-ink-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-ink-700 disabled:opacity-50"
              >
                {loading ? (isEs ? 'Pensando…' : 'Thinking…') : (isEs ? '✨ Preguntar IA' : '✨ Ask AI')}
              </button>
            </div>
          </div>

          {/* Examples */}
          {operations.length === 0 && !loading && !error && (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                {isEs ? 'Ejemplos' : 'Try'}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {examples.map(e => (
                  <button
                    key={e}
                    onClick={() => setPrompt(e)}
                    className="rounded-pill border border-ink-200 bg-white px-2.5 py-1 text-[11px] text-ink-700 hover:border-ink-500 hover:bg-ink-50"
                  >{e}</button>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && <ErrorState error={error} onRetry={ask} locale={locale} />}

          {/* Applied */}
          {applied && (
            <div className="rounded-card border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-800">
              <div className="mb-1 text-2xl">✓</div>
              {isEs ? '¡Aplicado! Actualizando…' : 'Applied! Updating…'}
            </div>
          )}

          {/* Preview */}
          {operations.length > 0 && !applied && (
            <div className="rounded-card border border-ink-100 bg-white p-4">
              <div className="mb-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                  {isEs ? 'Cambios propuestos' : 'Proposed changes'}
                </div>
                {explanation && <p className="mt-1 text-[13px] text-ink-700">{explanation}</p>}
              </div>
              <ul className="mb-4 space-y-2">
                {operations.map((op, idx) => (
                  <li key={idx} className="rounded-lg border border-ink-100 bg-ink-50/40 px-3 py-2 text-[12px] text-ink-800">
                    <div className="font-semibold">{idx + 1}. {opLabel(op, items, days, isEs)}</div>
                    {'reason' in op && op.reason && <div className="mt-0.5 text-[10px] italic text-ink-500">💡 {op.reason}</div>}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => { setOperations([]); setExplanation(''); }}
                  className="rounded-pill px-4 py-2 text-xs text-ink-600 hover:text-ink-900"
                >{isEs ? 'Descartar' : 'Discard'}</button>
                <button
                  onClick={apply}
                  disabled={applying}
                  className="rounded-pill bg-emerald-500 px-5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                >
                  {applying ? (isEs ? 'Aplicando…' : 'Applying…') : `✓ ${isEs ? `Aplicar ${operations.length} cambios` : `Apply ${operations.length} changes`}`}
                </button>
              </div>
            </div>
          )}

          {/* Empty AI response */}
          {operations.length === 0 && !loading && explanation && (
            <div className="rounded-card border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <p className="font-semibold">💭 {explanation}</p>
              <p className="mt-1 text-[11px]">{isEs ? 'Intenta reformular más específico.' : 'Try rephrasing more specifically.'}</p>
            </div>
          )}
        </div>

        <footer className="border-t border-ink-100 bg-ink-50/30 px-5 py-3 text-[10px] text-ink-400">
          {isEs
            ? '⚡ Powered by OpenRouter · gemma-4 · gratis · cambios revisables antes de aplicar'
            : '⚡ Powered by OpenRouter · gemma-4 · free · changes previewable before apply'}
        </footer>
      </div>
    </div>
  );
}
