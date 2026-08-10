'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { L } from '@/lib/l4';

const DISMISS_KEY = 'triploop_sticky_dismissed_v1';

// S71g: 4-locale migration. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
export function StickyCta({ locale: localeProp }: { locale?: string }){
  const params = useParams<{ locale: string }>();
  const locale = localeProp || params?.locale || 'en';
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if(typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(DISMISS_KEY);
      if(raw){
        const { at } = JSON.parse(raw);
        if(Date.now() - at < 24 * 60 * 60 * 1000){ setDismissed(true); return; }
      }
    } catch {}
    const onScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setVisible(scrolled > 0.5);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, JSON.stringify({ at: Date.now() })); } catch {}
    setDismissed(true);
  };

  if(dismissed || !visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-4 rounded-pill border border-ink-100 bg-white/95 px-5 py-3 shadow-card-hover backdrop-blur">
        <div className="flex-1 truncate text-sm text-ink-800">
          <span className="font-semibold">
            {L(locale, { en: 'Ready to plan?', es: '¿Listo para empezar?', pt: 'Pronto para planejar?', de: 'Bereit zum Planen?' })}
          </span>{' '}
          <span className="hidden text-ink-500 sm:inline">
            {L(locale, {
              en: 'Full itinerary in 30 seconds, free.',
              es: 'Itinerario completo en 30 segundos, gratis.',
              pt: 'Roteiro completo em 30 segundos, grátis.',
              de: 'Vollständiger Reiseplan in 30 Sekunden, kostenlos.'
            })}
          </span>
        </div>
        <Link
          href={`/${locale}/trip/new/ai`}
          className="whitespace-nowrap rounded-pill bg-coral-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-coral-600"
        >
          {L(locale, { en: '✨ Try AI →', es: '✨ Probar IA →', pt: '✨ Testar IA →', de: '✨ KI testen →' })}
        </Link>
        <button onClick={dismiss} className="text-lg text-ink-400 transition hover:text-ink-800" aria-label={L(locale, { en: 'Dismiss', es: 'Cerrar', pt: 'Fechar', de: 'Schließen' })}>✕</button>
      </div>
    </div>
  );
}
