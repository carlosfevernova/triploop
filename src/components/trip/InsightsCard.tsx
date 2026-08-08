'use client';
import { useState, useEffect } from 'react';
import type { TripInsights } from '@/app/api/ai/trip-insights/route';

interface Props {
  slug: string;
  locale: 'en' | 'es';
  preloaded?: TripInsights | null;
}

export function InsightsCard({ slug, locale, preloaded }: Props){
  const isEs = locale === 'es';
  const [insights, setInsights] = useState<TripInsights | null>(preloaded || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/ai/trip-insights', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug, locale })
      });
      const data = await r.json();
      if(!r.ok || !data.insights){
        setError(data.error || 'generation_failed');
        setLoading(false);
        return;
      }
      setInsights(data.insights);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!insights && !loading){
      // Auto-generar en primera carga
      generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const severityStyle = (sev: 'high' | 'mid' | 'low') => {
    if(sev === 'high') return { border: 'border-red-300', bg: 'bg-red-50', text: 'text-red-900', dot: 'bg-red-500', label: isEs ? 'CRÍTICO' : 'CRITICAL' };
    if(sev === 'mid')  return { border: 'border-amber-300', bg: 'bg-amber-50', text: 'text-amber-900', dot: 'bg-amber-500', label: isEs ? 'IMPORTANTE' : 'IMPORTANT' };
    return { border: 'border-ink-200', bg: 'bg-ink-50/60', text: 'text-ink-800', dot: 'bg-ink-400', label: isEs ? 'NOTA' : 'NOTE' };
  };

  const catIcon = (cat: 'booking' | 'timing' | 'local' | 'safety') =>
    cat === 'booking' ? '📅' : cat === 'timing' ? '⏰' : cat === 'local' ? '💡' : '🛡️';
  const catLabel = (cat: 'booking' | 'timing' | 'local' | 'safety') =>
    isEs
      ? { booking: 'Reservar', timing: 'Timing', local: 'Local', safety: 'Seguridad' }[cat]
      : { booking: 'Book ahead', timing: 'Timing', local: 'Local tip', safety: 'Safety' }[cat];

  if(loading && !insights){
    return (
      <div className="rounded-card border border-ink-100 bg-white p-6 shadow-card">
        <div className="flex items-center gap-3">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-ocean-300 border-t-ocean-700" />
          <span className="text-sm font-medium text-ink-700">
            {isEs ? 'Generando alertas y consejos locales…' : 'Generating warnings and local tips…'}
          </span>
        </div>
      </div>
    );
  }

  if(error && !insights){
    return (
      <div className="rounded-card border border-ink-100 bg-white p-6 shadow-card">
        <p className="text-sm text-ink-700">{isEs ? 'No se pudo generar. Intenta de nuevo.' : 'Could not generate. Try again.'}</p>
        <button onClick={generate} className="mt-3 rounded-pill bg-ink-900 px-4 py-2 text-xs font-semibold text-white hover:bg-ink-800">
          {isEs ? 'Reintentar' : 'Retry'}
        </button>
      </div>
    );
  }

  if(!insights) return null;

  return (
    <div className="space-y-4">
      {/* Warnings */}
      {insights.warnings.length > 0 && (
        <div className="rounded-card border border-ink-100 bg-white p-6 shadow-card">
          <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-ink-900">
            <span aria-hidden>🚨</span>
            {isEs ? 'Alertas para tu viaje' : 'Warnings for your trip'}
          </h3>
          <div className="space-y-2.5">
            {insights.warnings.map((w, i) => {
              const s = severityStyle(w.severity);
              return (
                <div key={i} className={`rounded-lg border ${s.border} ${s.bg} p-3.5`}>
                  <div className="mb-1 flex items-center gap-2">
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${s.dot}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${s.text}`}>{s.label}</span>
                  </div>
                  <div className={`text-sm font-semibold ${s.text}`}>{w.title}</div>
                  <p className={`mt-1 text-xs leading-relaxed ${s.text} opacity-90`}>{w.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tips */}
      {insights.tips.length > 0 && (
        <div className="rounded-card border border-ink-100 bg-white p-6 shadow-card">
          <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-ink-900">
            <span aria-hidden>💎</span>
            {isEs ? 'Consejos de locales' : 'Local insider tips'}
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {insights.tips.map((t, i) => (
              <div key={i} className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3.5">
                <div className="mb-1 flex items-center gap-2">
                  <span aria-hidden>{catIcon(t.category)}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">{catLabel(t.category)}</span>
                </div>
                <div className="text-sm font-semibold text-ink-900">{t.title}</div>
                <p className="mt-1 text-xs leading-relaxed text-ink-700">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-[10px] text-ink-400">
        {isEs ? 'Generado por IA · ' : 'AI-generated · '}
        <button onClick={generate} className="underline hover:text-ink-700">
          {isEs ? 'Regenerar' : 'Regenerate'}
        </button>
      </p>
    </div>
  );
}
