import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import { platformStats } from '@/lib/platform-stats';
import { L } from '@/lib/l4';
import type { Locale } from '@/i18n/request';

// S48 UX: Quick-access grid post-hero.
// S71g: 4-locale migration. PT-BR + DE-DE authored by Opus 4.7.
// TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de

type LangStr = Record<Locale, string>;
interface QuickFeature {
  emoji: string;
  title: LangStr;
  desc: LangStr;
  href: (locale: string) => string;
  cta: LangStr;
  badge?: { label: string; tone: 'coral' | 'ocean' | 'emerald' | 'amber' };
  featured?: boolean;
}

const FEATURES: QuickFeature[] = [
  {
    emoji: '🗓',
    title: { en: 'Daily Agenda', es: 'Agenda diaria', pt: 'Agenda diária', de: 'Tagesagenda' },
    desc: {
      en: 'Just today. Timeline hour by hour. Restaurants, appointments, attractions, notes. No trip macro needed, no signup.',
      es: 'Solo hoy. Timeline hora por hora. Restaurantes, compromisos, atracciones, notas. Sin viaje macro, sin registro.',
      pt: 'Só hoje. Timeline hora a hora. Restaurantes, compromissos, atrações, notas. Sem viagem macro, sem cadastro.',
      de: 'Nur heute. Zeitleiste Stunde für Stunde. Restaurants, Termine, Sehenswürdigkeiten, Notizen. Ohne große Reise, ohne Anmeldung.'
    },
    href: (l) => `/${l}/agenda`,
    cta: { en: 'Plan today', es: 'Planear hoy', pt: 'Planejar hoje', de: 'Heute planen' },
    badge: { label: 'NEW', tone: 'emerald' },
    featured: true
  },
  {
    emoji: '🌍',
    title: { en: 'Multi-day Trip', es: 'Ruta multi-día', pt: 'Viagem multi-dia', de: 'Mehrtägige Reise' },
    desc: {
      en: 'Full road trip planner: multiple days, cities, drag between days, real-time traffic, offline maps, PDF export.',
      es: 'Planeador road trip completo: varios días, ciudades, DnD entre días, tráfico en vivo, mapas offline, export PDF.',
      pt: 'Planejador road trip completo: vários dias, cidades, arrastar entre dias, trânsito ao vivo, mapas offline, exportar PDF.',
      de: 'Vollständiger Roadtrip-Planer: mehrere Tage, Städte, Ziehen zwischen Tagen, Live-Verkehr, Offline-Karten, PDF-Export.'
    },
    href: (l) => `/${l}/trip/new`,
    cta: { en: 'Start trip', es: 'Empezar viaje', pt: 'Começar viagem', de: 'Reise starten' },
    badge: { label: 'FULL', tone: 'coral' }
  },
  {
    emoji: '✨',
    title: { en: 'AI Trip Generator', es: 'Generador con IA', pt: 'Gerador com IA', de: 'KI-Reiseplaner' },
    desc: {
      en: 'Describe your trip in one sentence. Full itinerary in 30 seconds with real coordinates.',
      es: 'Describe tu viaje en una frase. Itinerario completo en 30 segundos con coordenadas reales.',
      pt: 'Descreva sua viagem em uma frase. Roteiro completo em 30 segundos com coordenadas reais.',
      de: 'Beschreibe deine Reise in einem Satz. Vollständiger Reiseplan in 30 Sekunden mit echten Koordinaten.'
    },
    href: (l) => `/${l}/trip/new/ai`,
    cta: { en: 'Try AI planner', es: 'Probar IA planner', pt: 'Testar IA planner', de: 'KI-Planer testen' },
    badge: { label: 'LIVE', tone: 'emerald' }
  },
  {
    emoji: '🌍',
    title: { en: 'Curated routes', es: 'Rutas curadas', pt: 'Rotas selecionadas', de: 'Kuratierte Routen' },
    desc: {
      en: `${platformStats.templates} iconic road trips across ${platformStats.regions} regions and ${platformStats.continents} continents — verified coords, highway names, best seasons.`,
      es: `${platformStats.templates} road trips icónicos en ${platformStats.regions} regiones y ${platformStats.continents} continentes — coords verificadas, autopistas, temporadas.`,
      pt: `${platformStats.templates} road trips icônicos em ${platformStats.regions} regiões e ${platformStats.continents} continentes — coordenadas verificadas, rodovias, temporadas.`,
      de: `${platformStats.templates} ikonische Roadtrips in ${platformStats.regions} Regionen und ${platformStats.continents} Kontinenten — verifizierte Koordinaten, Autobahnnamen, beste Reisezeiten.`
    },
    href: (l) => `/${l}/california`,
    cta: { en: 'Browse routes', es: 'Ver rutas', pt: 'Ver rotas', de: 'Routen ansehen' },
    badge: { label: `${platformStats.templates}+`, tone: 'ocean' }
  },
  {
    emoji: '👥',
    title: { en: 'Real-time collab', es: 'Colaboración en vivo', pt: 'Colaboração ao vivo', de: 'Live-Zusammenarbeit' },
    desc: {
      en: 'Plan with friends. Vote LIKE/MAYBE/NO on stops. See edits in real time. Free unlimited.',
      es: 'Planea con amigos. Votas LIKE/MAYBE/NO por parada. Cambios en vivo. Ilimitado gratis.',
      pt: 'Planeje com amigos. Vote LIKE/MAYBE/NO em cada parada. Alterações ao vivo. Ilimitado grátis.',
      de: 'Plane mit Freunden. Stimme LIKE/MAYBE/NO für jeden Stopp ab. Änderungen live. Unbegrenzt kostenlos.'
    },
    href: (l) => `/${l}/trip/new`,
    cta: { en: 'Invite friends', es: 'Invitar amigos', pt: 'Convidar amigos', de: 'Freunde einladen' }
  },
  {
    emoji: '📴',
    title: { en: 'Offline PWA', es: 'PWA sin conexión', pt: 'PWA offline', de: 'Offline-PWA' },
    desc: {
      en: 'Save trips to your device. Map tiles cached. Edit offline, syncs when you\'re back.',
      es: 'Guarda viajes en tu dispositivo. Tiles de mapa cacheados. Edita offline, sincroniza al volver.',
      pt: 'Salve viagens no seu dispositivo. Tiles de mapa em cache. Edite offline, sincroniza ao voltar.',
      de: 'Speichere Reisen auf deinem Gerät. Kartenkacheln zwischengespeichert. Bearbeite offline, synchronisiert bei Rückkehr.'
    },
    href: (l) => `/${l}/about`,
    cta: { en: 'How it works', es: 'Cómo funciona', pt: 'Como funciona', de: 'So funktioniert es' }
  },
  {
    emoji: '💬',
    title: { en: 'WhatsApp bot', es: 'Bot de WhatsApp', pt: 'Bot do WhatsApp', de: 'WhatsApp-Bot' },
    desc: {
      en: 'Create trips by chat. Get suggestions, edits, and reminders — where you already talk.',
      es: 'Crea viajes por chat. Recibe sugerencias, cambios y recordatorios donde ya hablas.',
      pt: 'Crie viagens por chat. Receba sugestões, alterações e lembretes — onde você já conversa.',
      de: 'Erstelle Reisen per Chat. Erhalte Vorschläge, Änderungen und Erinnerungen — dort, wo du schon sprichst.'
    },
    href: (l) => `/${l}/whatsapp`,
    cta: { en: 'Try WhatsApp', es: 'Probar WhatsApp', pt: 'Testar WhatsApp', de: 'WhatsApp testen' },
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
  const eyebrow = L(locale, { en: 'Start here', es: 'Empieza aquí', pt: 'Comece aqui', de: 'Hier starten' });
  const heading = L(locale, { en: 'What do you want to do today?', es: '¿Qué quieres hacer hoy?', pt: 'O que você quer fazer hoje?', de: 'Was möchtest du heute tun?' });
  const subheading = L(locale, {
    en: 'Each option takes you straight to the tool. All free to start, no signup required.',
    es: 'Cada opción te lleva directo a la herramienta. Todo gratis para empezar, sin registro.',
    pt: 'Cada opção leva você direto à ferramenta. Tudo grátis para começar, sem cadastro.',
    de: 'Jede Option führt dich direkt zum Tool. Alles kostenlos zum Starten, ohne Anmeldung.'
  });

  return (
    <section className="border-y border-ink-100 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block text-[11px] font-semibold uppercase tracking-widest text-coral-600">
            {eyebrow}
          </span>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl">
            {heading}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-ink-500">
            {subheading}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link
              key={f.title.en}
              href={f.href(locale)}
              data-tilt
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
                {L(locale, f.title)}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                {L(locale, f.desc)}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-coral-600 transition group-hover:gap-2">
                {L(locale, f.cta)}
                <span aria-hidden>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
