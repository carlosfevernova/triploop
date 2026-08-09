'use client';
import { useEffect, useState } from 'react';

// S43 P1: Empty / Error / Rate-limit / Offline fallbacks reusables.
// Uso: <ErrorState error={error} onRetry={fetch} locale={locale} />
//      <EmptyState icon="🧭" title="…" hint="…" cta={{label:'…', onClick:…}} />

interface ErrorProps {
  error: string | Error | null;
  onRetry?: () => void | Promise<void>;
  locale: 'en' | 'es';
  compact?: boolean;
}

// Detecta patrones típicos y elige mensaje/emoji/color adecuado.
function classify(err: string): { emoji: string; color: 'coral' | 'amber' | 'ocean'; kind: 'network' | 'rate' | 'timeout' | 'auth' | 'unknown' } {
  const s = err.toLowerCase();
  if(s.includes('failed to fetch') || s.includes('network') || s.includes('offline')) return { emoji: '📡', color: 'ocean', kind: 'network' };
  if(s.includes('rate') || s.includes('429') || s.includes('too many')) return { emoji: '⏳', color: 'amber', kind: 'rate' };
  if(s.includes('timeout') || s.includes('timed out') || s.includes('aborted')) return { emoji: '⏱', color: 'amber', kind: 'timeout' };
  if(s.includes('auth') || s.includes('401') || s.includes('unauthor')) return { emoji: '🔒', color: 'ocean', kind: 'auth' };
  return { emoji: '⚠️', color: 'coral', kind: 'unknown' };
}

const MESSAGES: Record<string, { en: string; es: string }> = {
  network:  { en: 'Connection lost. Check your network.',           es: 'Sin conexión. Revisa tu red.' },
  rate:     { en: 'Rate limit reached — try again in a moment.',    es: 'Límite alcanzado — intenta en un momento.' },
  timeout:  { en: 'Request timed out. The server is slow.',         es: 'La solicitud tardó demasiado.' },
  auth:     { en: 'Sign in required.',                              es: 'Requiere iniciar sesión.' },
  unknown:  { en: 'Something went wrong.',                          es: 'Algo salió mal.' }
};

export function ErrorState({ error, onRetry, locale, compact }: ErrorProps){
  const [retrying, setRetrying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  if(!error) return null;
  const isEs = locale === 'es';
  const raw = typeof error === 'string' ? error : error.message;
  const { emoji, color, kind } = classify(raw);
  const msg = MESSAGES[kind][isEs ? 'es' : 'en'];

  const bg = color === 'coral' ? 'border-coral-200 bg-coral-50 text-coral-800' : color === 'amber' ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-ocean-200 bg-ocean-50 text-ocean-800';
  const btnBg = color === 'coral' ? 'bg-coral-500 hover:bg-coral-600' : color === 'amber' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-ocean-500 hover:bg-ocean-600';

  const handleRetry = async () => {
    if(!onRetry) return;
    setRetrying(true);
    try { await onRetry(); setAttempts(a => a + 1); }
    finally { setRetrying(false); }
  };

  return (
    <div className={`rounded-card border p-${compact ? '3' : '4'} ${bg}`} role="alert">
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden>{emoji}</span>
        <div className="flex-1">
          <div className="text-sm font-semibold">{msg}</div>
          {!compact && raw && raw !== msg && (
            <div className="mt-0.5 text-[10px] opacity-70 font-mono truncate" title={raw}>{raw.slice(0, 120)}</div>
          )}
          {onRetry && (
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={handleRetry}
                disabled={retrying}
                className={`rounded-pill px-3 py-1 text-[11px] font-semibold text-white transition disabled:opacity-50 ${btnBg}`}
              >
                {retrying ? (isEs ? 'Reintentando…' : 'Retrying…') : (isEs ? '🔄 Reintentar' : '🔄 Retry')}
              </button>
              {attempts > 0 && (
                <span className="text-[10px] opacity-60">
                  {isEs ? `${attempts} intento${attempts > 1 ? 's' : ''}` : `${attempts} attempt${attempts > 1 ? 's' : ''}`}
                </span>
              )}
              {kind === 'network' && <OnlineStatus locale={locale} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface EmptyProps {
  icon: string;
  title: string;
  hint?: string;
  cta?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, hint, cta }: EmptyProps){
  return (
    <div className="py-14 text-center text-ink-500">
      <div className="mb-3 text-5xl" aria-hidden>{icon}</div>
      <p className="text-sm font-semibold text-ink-700">{title}</p>
      {hint && <p className="mx-auto mt-1 max-w-xs text-xs text-ink-400">{hint}</p>}
      {cta && (
        <button
          onClick={cta.onClick}
          className="mt-4 inline-flex rounded-pill bg-ink-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-ink-700"
        >
          {cta.label}
        </button>
      )}
    </div>
  );
}

// Live online/offline indicator
function OnlineStatus({ locale }: { locale: 'en' | 'es' }){
  const isEs = locale === 'es';
  const [online, setOnline] = useState<boolean>(typeof navigator === 'undefined' ? true : navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return (
    <span className={`inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[10px] font-semibold ${online ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-emerald-500' : 'bg-red-500'}`} />
      {online ? (isEs ? 'En línea' : 'Online') : (isEs ? 'Sin conexión' : 'Offline')}
    </span>
  );
}
