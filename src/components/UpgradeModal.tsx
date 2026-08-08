'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Props {
  open: boolean;
  onClose: () => void;
  reason: 'offline' | 'ai' | 'trips' | 'generic';
  isEs?: boolean;
}

const COPY = {
  offline: {
    en: { emoji: '📥', title: 'Offline maps are a Pro feature', body: 'Save trips + tile packs for Yosemite, Big Sur and every national park with no signal.' },
    es: { emoji: '📥', title: 'Los mapas offline son Pro', body: 'Guarda viajes y paquetes de tiles para Yosemite, Big Sur y todo parque sin señal.' }
  },
  ai: {
    en: { emoji: '✨', title: 'You\'ve used your free AI generations', body: 'Free plan includes 3 AI itinerary generations per day. Go Pro for unlimited.' },
    es: { emoji: '✨', title: 'Ya usaste tus generaciones IA gratis', body: 'El plan gratis incluye 3 generaciones IA por día. Pro es ilimitado.' }
  },
  trips: {
    en: { emoji: '🗺️', title: 'Free plan limit: 3 saved trips', body: 'Delete an old one or upgrade to Pro for unlimited trips.' },
    es: { emoji: '🗺️', title: 'Límite gratis: 3 viajes guardados', body: 'Elimina uno viejo o hazte Pro para viajes ilimitados.' }
  },
  generic: {
    en: { emoji: '⭐', title: 'Upgrade to TripLoop Pro', body: 'Unlimited trips, offline maps, unlimited AI, collaboration and PDF export.' },
    es: { emoji: '⭐', title: 'Hazte TripLoop Pro', body: 'Viajes ilimitados, mapas offline, IA sin límites, colaboración y export PDF.' }
  }
} as const;

export function UpgradeModal({ open, onClose, reason, isEs }: Props){
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';
  if(!open) return null;
  const copy = COPY[reason][isEs ? 'es' : 'en'];

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-50 bg-ink-900/60 backdrop-blur-sm" aria-hidden />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-card bg-white shadow-2xl">
        <div className="relative bg-gradient-to-br from-coral-500 via-coral-600 to-ink-900 p-8 text-white">
          <button onClick={onClose} className="absolute right-3 top-3 rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white" aria-label="Close">✕</button>
          <div className="text-4xl">{copy.emoji}</div>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight">{copy.title}</h2>
          <p className="mt-2 text-white/85">{copy.body}</p>
        </div>
        <div className="p-6">
          <ul className="mb-4 space-y-2 text-sm text-ink-700">
            <li>✓ {isEs ? 'Viajes ilimitados' : 'Unlimited trips'}</li>
            <li>✓ {isEs ? 'Mapas offline para parques' : 'Offline maps for national parks'}</li>
            <li>✓ {isEs ? 'IA sin límites' : 'Unlimited AI regenerations'}</li>
            <li>✓ {isEs ? 'Export PDF + manager de reservas' : 'PDF export + booking manager'}</li>
            <li>✓ {isEs ? 'Colaboración en tiempo real' : 'Real-time collaboration'}</li>
          </ul>
          <div className="mb-4 rounded-lg bg-coral-50 p-3 text-center">
            <div className="font-display text-2xl font-semibold text-ink-900">$6.99<span className="text-sm text-ink-500">/mo</span></div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-coral-700">
              {isEs ? '14 días de prueba gratis · cancela cuando quieras' : '14-day free trial · cancel anytime'}
            </div>
          </div>
          <Link
            href={`/${locale}/pricing/upgrade`}
            onClick={onClose}
            className="block w-full rounded-pill bg-coral-500 py-3 text-center text-sm font-semibold text-white shadow-glow transition hover:bg-coral-600"
          >
            {isEs ? 'Empezar prueba gratis →' : 'Start free trial →'}
          </Link>
          <button onClick={onClose} className="mt-2 w-full text-center text-xs text-ink-400 hover:text-ink-700">
            {isEs ? 'Ahora no' : 'Maybe later'}
          </button>
        </div>
      </div>
    </>
  );
}
