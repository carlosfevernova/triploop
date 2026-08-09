import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import { platformStats } from '@/lib/platform-stats';

// S48 UX: Quick-access grid post-hero.
// Objetivo: usuario que sabe qué quiere hacer llega en 1 click.
// Antes: enterrado en FeaturesShowcase (10+ features). Ahora: 6 features de intent primario.

interface QuickFeature {
  emoji: string;
  title: { en: string; es: string };
  desc: { en: string; es: string };
  href: (locale: string) => string;
  cta: { en: string; es: string };
  badge?: { label: string; tone: 'coral' | 'ocean' | 'emerald' | 'amber' };
  featured?: boolean;
}

const FEATURES: QuickFeature[] = [
  {
    emoji: '🗓',
    title: { en: 'Daily Agenda', es: 'Agenda diaria' },
    desc: {
      en: 'Just today. Timeline hour by hour. Restaurants, appointments, attractions, notes. No trip macro needed, no signup.',
      es: 'Solo hoy. Timeline hora por hora. Restaurantes, compromisos, atracciones, notas. Sin viaje macro, sin registro.'
    },
    href: (l) => `/${l}/agenda`,
    cta: { en: 'Plan today', es: 'Planear hoy' },
    badge: { label: 'NEW', tone: 'emerald' },
    featured: true
  },
  {
    emoji: '🌍',
    title: { en: 'Multi-day Trip', es: 'Ruta multi-día' },
    desc: {
      en: 'Full road trip planner: multiple days, cities, drag between days, real-time traffic, offline maps, PDF export.',
      es: 'Planeador road trip completo: varios días, ciudades, DnD entre días, tráfico en vivo, mapas offline, export PDF.'
    },
    href: (l) => `/${l}/trip/new`,
    cta: { en: 'Start trip', es: 'Empezar viaje' },
    badge: { label: 'FULL', tone: 'coral' }
  },
  {
    emoji: '✨',
    title: { en: 'AI Trip Generator', es: 'Generador con IA' },
    desc: {
      en: 'Describe your trip in one sentence. Full itinerary in 30 seconds with real coordinates.',
      es: 'Describe tu viaje en una frase. Itinerario completo en 30 segundos con coordenadas reales.'
    },
    href: (l) => `/${l}/trip/new/ai`,
    cta: { en: 'Try AI planner', es: 'Probar IA planner' },
    badge: { label: 'LIVE', tone: 'emerald' }
  },
  {
    emoji: '🌍',
    title: { en: 'Curated routes', es: 'Rutas curadas' },
    desc: {
      en: `${platformStats.templates} iconic road trips across ${platformStats.regions} regions and ${platformStats.continents} continents — verified coords, highway names, best seasons.`,
      es: `${platformStats.templates} road trips icónicos en ${platformStats.regions} regiones y ${platformStats.continents} continentes — coords verificadas, autopistas, temporadas.`
    },
    href: (l) => `/${l}/california`,
    cta: { en: 'Browse routes', es: 'Ver rutas' },
    badge: { label: `${platformStats.templates}+`, tone: 'ocean' }
  },
  {
    emoji: '👥',
    title: { en: 'Real-time collab', es: 'Colaboración en vivo' },
    desc: {
      en: 'Plan with friends. Vote LIKE/MAYBE/NO on stops. See edits in real time. Free unlimited.',
      es: 'Planea con amigos. Votas LIKE/MAYBE/NO por parada. Cambios en vivo. Ilimitado gratis.'
    },
    href: (l) => `/${l}/trip/new`,
    cta: { en: 'Invite friends', es: 'Invitar amigos' }
  },
  {
    emoji: '📴',
    title: { en: 'Offline PWA', es: 'PWA sin conexión' },
    desc: {
      en: 'Save trips to your device. Map tiles cached. Edit offline, syncs when you\'re back.',
      es: 'Guarda viajes en tu dispositivo. Tiles de mapa cacheados. Edita offline, sincroniza al volver.'
    },
    href: (l) => `/${l}/about`,
    cta: { en: 'How it works', es: 'Cómo funciona' }
  },
  {
    emoji: '💬',
    title: { en: 'WhatsApp bot', es: 'Bot de WhatsApp' },
    desc: {
      en: 'Create trips by chat. Get suggestions, edits, and reminders — where you already talk.',
      es: 'Crea viajes por chat. Recibe sugerencias, cambios y recordatorios donde ya hablas.'
    },
    href: (l) => `/${l}/whatsapp`,
    cta: { en: 'Try WhatsApp', es: 'Probar WhatsApp' },
    badge: { label: 'BETA', tone: 'amber' }
  }
];

const TONE_STYLES: Record<string, string> = {
  coral: 'bg-coral-500 text-white',
  ocean: 'bg-ocean-500 text-white',
  emerald: 'bg-emerald-500 text-white',
  amber: 'bg-amber-500 text-white'
};

export async function FeatureQuickAccess(){
  const locale = await getLocale();
  const isEs = locale === 'es';

  return (
    <section className="border-y border-ink-100 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block text-[11px] font-semibold uppercase tracking-widest text-coral-600">
            {isEs ? 'Empieza aquí' : 'Start here'}
          </span>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl">
            {isEs ? '¿Qué quieres hacer hoy?' : 'What do you want to do today?'}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-ink-500">
            {isEs
              ? 'Cada opción te lleva directo a la herramienta. Todo gratis para empezar, sin registro.'
              : 'Each option takes you straight to the tool. All free to start, no signup required.'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link
              key={f.title.en}
              href={f.href(locale)}
              className={`group relative flex flex-col rounded-card border p-5 transition ${
                f.featured
                  ? 'border-coral-300 bg-gradient-to-br from-coral-50/50 via-white to-white hover:border-coral-500 hover:shadow-card-hover'
                  : 'border-ink-100 bg-white hover:border-ink-400 hover:shadow-card'
              }`}
            >
              {f.badge && (
                <span className={`absolute right-4 top-4 rounded-pill px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${TONE_STYLES[f.badge.tone]}`}>
                  {f.badge.label}
                </span>
              )}
              <div className="mb-3 text-3xl leading-none" aria-hidden>{f.emoji}</div>
              <h3 className="font-display text-lg font-semibold text-ink-900">
                {isEs ? f.title.es : f.title.en}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                {isEs ? f.desc.es : f.desc.en}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-coral-600 transition group-hover:gap-2">
                {isEs ? f.cta.es : f.cta.en}
                <span aria-hidden>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
