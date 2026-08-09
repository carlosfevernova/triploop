import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import type { Locale } from '@/i18n/request';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Changelog — TripLoop' : 'Changelog — TripLoop',
    description: isEs
      ? 'Historial de features y mejoras de TripLoop. Sprints S40-S51.'
      : 'TripLoop feature history and improvements. Sprints S40-S51.',
    alternates: { canonical: `/${locale}/changelog`, languages: { en: '/en/changelog', es: '/es/changelog' } }
  };
}

interface Release {
  version: string;
  date: string;
  highlights: { en: string[]; es: string[] };
  tag: 'major' | 'feature' | 'fix';
}

const RELEASES: Release[] = [
  {
    version: 'S51', date: '2026-08-08', tag: 'fix',
    highlights: {
      en: ['Fixed 4 broken links (/about, /terms, /privacy, /changelog)', 'Created 4 legal/info pages bilingual', 'Footer dead-links cleanup'],
      es: ['4 broken links arreglados (/about, /terms, /privacy, /changelog)', '4 páginas legales/info bilingües creadas', 'Footer dead-links limpieza']
    }
  },
  {
    version: 'S50', date: '2026-08-08', tag: 'feature',
    highlights: {
      en: ['DiscoveryPanel inside Itinerary with filters (category/radius/rating/sort)', 'Feature Tour first-visit (5 steps)', 'Landing cleanup — CitiesGrid removed'],
      es: ['DiscoveryPanel dentro Itinerary con filtros (categoría/radio/rating/sort)', 'Feature Tour primera visita (5 pasos)', 'Landing cleanup — CitiesGrid removido']
    }
  },
  {
    version: 'S48-S49', date: '2026-08-08', tag: 'major',
    highlights: {
      en: ['Hero redesigned with 3-intent CTAs + Timeline mockup', 'FeatureQuickAccess with 6 features 1-click access', 'Nav Destinations dropdown (24 regions × 4 continents)'],
      es: ['Hero rediseñado 3 CTAs por intent + Timeline mockup', 'FeatureQuickAccess con 6 features de 1-click', 'Nav dropdown Destinos (24 regiones × 4 continentes)']
    }
  },
  {
    version: 'S46-S47', date: '2026-08-08', tag: 'major',
    highlights: {
      en: ['AI Operations Engine — edit itinerary in natural language', 'Realtime collab (Supabase postgres_changes)', 'Offline mutation queue + auto-flush', 'AI Undo, Analytics events, Print/PDF, Share'],
      es: ['Motor AI Operations — edita itinerario en lenguaje natural', 'Colaboración realtime (Supabase postgres_changes)', 'Cola de mutaciones offline + auto-flush', 'AI Undo, Analytics, Print/PDF, Share']
    }
  },
  {
    version: 'S44-S45', date: '2026-08-08', tag: 'major',
    highlights: {
      en: ['Itinerary Engine P0-P3: trip_days + itinerary_items schema', 'Timeline day×time with DnD cross-day', 'Google Routes v2 traffic-aware + cache', 'Opening hours check, Schedule Day, Optimize Day (TSP)'],
      es: ['Motor Itinerary P0-P3: schema trip_days + itinerary_items', 'Timeline día×hora con DnD entre días', 'Google Routes v2 traffic-aware + cache', 'Chequeo horarios, Programar día, Optimizar día (TSP)']
    }
  },
  {
    version: 'S42-S43', date: '2026-08-08', tag: 'feature',
    highlights: {
      en: ['AI Cost Dashboard (/admin/ai-costs)', 'Web Vitals RUM via sendBeacon', 'Financial Tracker (booked/actual/remaining)', 'Stop Voting LIKE/MAYBE/NO'],
      es: ['Dashboard costos IA (/admin/ai-costs)', 'Web Vitals RUM via sendBeacon', 'Tracker financiero (reservado/actual/restante)', 'Votación por parada LIKE/MAYBE/NO']
    }
  }
];

const TAG_STYLES: Record<Release['tag'], string> = {
  major: 'bg-coral-500 text-white',
  feature: 'bg-ocean-500 text-white',
  fix: 'bg-emerald-500 text-white'
};

export default async function ChangelogPage({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;
  const isEs = locale === 'es';

  return (
    <>
      <Nav locale={locale as Locale} />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-semibold text-ink-900">Changelog</h1>
        <p className="mt-2 text-lg text-ink-500">
          {isEs ? 'Todo lo que hemos shippeado, ordenado por sprint.' : 'Everything we\'ve shipped, ordered by sprint.'}
        </p>

        <div className="mt-10 space-y-8">
          {RELEASES.map(r => (
            <article key={r.version} className="rounded-card border border-ink-100 bg-white p-6 shadow-card">
              <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`rounded-pill px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${TAG_STYLES[r.tag]}`}>{r.tag}</span>
                  <h2 className="font-display text-xl font-semibold text-ink-900">{r.version}</h2>
                </div>
                <time className="text-xs text-ink-400">{r.date}</time>
              </header>
              <ul className="ml-5 list-disc space-y-1.5 text-[14px] text-ink-700">
                {(isEs ? r.highlights.es : r.highlights.en).map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-ink-400">
          {isEs ? 'Subscríbete al RSS del blog para más actualizaciones.' : 'Subscribe to the blog RSS for more updates.'}
        </p>
      </main>
      <Footer />
    </>
  );
}
