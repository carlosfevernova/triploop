'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { L } from '@/lib/l4';
import type { Locale } from '@/i18n/request';

// S71k: 4-locale migration. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
interface Props {
  open: boolean;
  onClose: () => void;
  reason: 'offline' | 'ai' | 'trips' | 'generic';
  isEs?: boolean;
  locale?: string;
}

type LangStr = Record<Locale, string>;
type ReasonCopy = { emoji: string; title: LangStr; body: LangStr };

const COPY: Record<'offline' | 'ai' | 'trips' | 'generic', ReasonCopy> = {
  offline: {
    emoji: '📥',
    title: {
      en: 'Offline maps are a Pro feature',
      es: 'Los mapas offline son Pro',
      pt: 'Mapas offline são um recurso Pro',
      de: 'Offline-Karten sind eine Pro-Funktion'
    },
    body: {
      en: 'Save trips + tile packs for Yosemite, Big Sur and every national park with no signal.',
      es: 'Guarda viajes y paquetes de tiles para Yosemite, Big Sur y todo parque sin señal.',
      pt: 'Salve viagens + pacotes de tiles para Yosemite, Big Sur e todo parque nacional sem sinal.',
      de: 'Speichere Reisen + Kachelpakete für Yosemite, Big Sur und jeden Nationalpark ohne Signal.'
    }
  },
  ai: {
    emoji: '✨',
    title: {
      en: "You've used your free AI generations",
      es: 'Ya usaste tus generaciones IA gratis',
      pt: 'Você usou suas gerações de IA grátis',
      de: 'Du hast deine kostenlosen KI-Generierungen aufgebraucht'
    },
    body: {
      en: 'Free plan includes 3 AI itinerary generations per day. Go Pro for unlimited.',
      es: 'El plan gratis incluye 3 generaciones IA por día. Pro es ilimitado.',
      pt: 'O plano grátis inclui 3 gerações de roteiro por dia. Pro é ilimitado.',
      de: 'Der kostenlose Plan enthält 3 KI-Reisepläne pro Tag. Pro ist unbegrenzt.'
    }
  },
  trips: {
    emoji: '🗺️',
    title: {
      en: 'Free plan limit: 3 saved trips',
      es: 'Límite gratis: 3 viajes guardados',
      pt: 'Limite grátis: 3 viagens salvas',
      de: 'Kostenloses Limit: 3 gespeicherte Reisen'
    },
    body: {
      en: 'Delete an old one or upgrade to Pro for unlimited trips.',
      es: 'Elimina uno viejo o hazte Pro para viajes ilimitados.',
      pt: 'Exclua uma antiga ou faça upgrade para Pro para viagens ilimitadas.',
      de: 'Lösche eine alte oder wechsle zu Pro für unbegrenzte Reisen.'
    }
  },
  generic: {
    emoji: '⭐',
    title: {
      en: 'Upgrade to TripLoop Pro',
      es: 'Hazte TripLoop Pro',
      pt: 'Atualize para TripLoop Pro',
      de: 'Upgrade auf TripLoop Pro'
    },
    body: {
      en: 'Unlimited trips, offline maps, unlimited AI, collaboration and PDF export.',
      es: 'Viajes ilimitados, mapas offline, IA sin límites, colaboración y export PDF.',
      pt: 'Viagens ilimitadas, mapas offline, IA sem limites, colaboração e exportação PDF.',
      de: 'Unbegrenzte Reisen, Offline-Karten, unbegrenzte KI, Zusammenarbeit und PDF-Export.'
    }
  }
};

export function UpgradeModal({ open, onClose, reason, isEs, locale: localeProp }: Props){
  const params = useParams<{ locale: string }>();
  const locale = localeProp || params?.locale || (isEs ? 'es' : 'en');

  useEffect(() => {
    if(!open) return;
    const onKey = (e: KeyboardEvent) => { if(e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if(!open) return null;
  const copy = COPY[reason];

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-50 bg-ink-900/60 backdrop-blur-sm" aria-hidden />
      <div role="dialog" aria-modal="true" aria-labelledby="upgrade-modal-title" className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-card bg-white shadow-2xl">
        <div className="relative bg-gradient-to-br from-coral-500 via-coral-600 to-ink-900 p-8 text-white">
          <button onClick={onClose} className="absolute right-3 top-3 rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white" aria-label={L(locale, { en: 'Close', es: 'Cerrar', pt: 'Fechar', de: 'Schließen' })}>✕</button>
          <div className="text-4xl">{copy.emoji}</div>
          <h2 id="upgrade-modal-title" className="mt-3 font-display text-2xl font-semibold tracking-tight">{L(locale, copy.title)}</h2>
          <p className="mt-2 text-white/85">{L(locale, copy.body)}</p>
        </div>
        <div className="p-6">
          <ul className="mb-4 space-y-2 text-sm text-ink-700">
            <li>✓ {L(locale, { en: 'Unlimited trips', es: 'Viajes ilimitados', pt: 'Viagens ilimitadas', de: 'Unbegrenzte Reisen' })}</li>
            <li>✓ {L(locale, { en: 'Offline maps for national parks', es: 'Mapas offline para parques', pt: 'Mapas offline para parques nacionais', de: 'Offline-Karten für Nationalparks' })}</li>
            <li>✓ {L(locale, { en: 'Unlimited AI regenerations', es: 'IA sin límites', pt: 'Gerações de IA sem limite', de: 'Unbegrenzte KI-Neuerstellungen' })}</li>
            <li>✓ {L(locale, { en: 'PDF export + booking manager', es: 'Export PDF + manager de reservas', pt: 'Exportação PDF + gerente de reservas', de: 'PDF-Export + Buchungsmanager' })}</li>
            <li>✓ {L(locale, { en: 'Real-time collaboration', es: 'Colaboración en tiempo real', pt: 'Colaboração em tempo real', de: 'Echtzeit-Zusammenarbeit' })}</li>
          </ul>
          <div className="mb-4 rounded-lg bg-coral-50 p-3 text-center">
            <div className="font-display text-2xl font-semibold text-ink-900">$6.99<span className="text-sm text-ink-500">/{L(locale, { en: 'mo', es: 'mes', pt: 'mês', de: 'Mon.' })}</span></div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-coral-700">
              {L(locale, {
                en: '14-day free trial · cancel anytime',
                es: '14 días de prueba gratis · cancela cuando quieras',
                pt: 'Teste grátis de 14 dias · cancele quando quiser',
                de: '14 Tage kostenlos testen · jederzeit kündbar'
              })}
            </div>
          </div>
          <Link
            href={`/${locale}/pricing/upgrade`}
            onClick={onClose}
            className="block w-full rounded-pill bg-coral-500 py-3 text-center text-sm font-semibold text-white shadow-glow transition hover:bg-coral-600"
          >
            {L(locale, { en: 'Start free trial →', es: 'Empezar prueba gratis →', pt: 'Começar teste grátis →', de: 'Kostenlose Testphase starten →' })}
          </Link>
          <button onClick={onClose} className="mt-2 w-full text-center text-xs text-ink-400 hover:text-ink-700">
            {L(locale, { en: 'Maybe later', es: 'Ahora no', pt: 'Talvez depois', de: 'Vielleicht später' })}
          </button>
        </div>
      </div>
    </>
  );
}
