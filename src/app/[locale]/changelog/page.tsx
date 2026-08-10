import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import type { Locale } from '@/i18n/request';
import { locales } from '@/i18n/request';
import { L } from '@/lib/l4';

// S71l: 4-locale migration. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;
  const title = 'Changelog — TripLoop';
  const description = L(locale, {
    en: 'TripLoop feature history and improvements. Sprints S40-S71.',
    es: 'Historial de features y mejoras de TripLoop. Sprints S40-S71.',
    pt: 'Histórico de recursos e melhorias do TripLoop. Sprints S40-S71.',
    de: 'TripLoop Feature-Historie und Verbesserungen. Sprints S40-S71.'
  });
  return {
    title, description,
    alternates: {
      canonical: `/${locale}/changelog`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/changelog`])),
        'x-default': '/en/changelog'
      }
    }
  };
}

type LangList = Record<Locale, string[]>;

interface Release {
  version: string;
  date: string;
  highlights: LangList;
  tag: 'major' | 'feature' | 'fix';
}

const RELEASES: Release[] = [
  {
    version: 'S71', date: '2026-08-10', tag: 'major',
    highlights: {
      en: ['Landing 100% multilingual native (EN·ES·PT·DE)', 'Mobile drawer Portal fix (11px → 92% viewport)', 'LocaleSwitcher a11y with role=group + aria-label', 'Favicon rewrite + hreflang covers 4 locales'],
      es: ['Landing 100% multilingüe nativo (EN·ES·PT·DE)', 'Fix drawer mobile con Portal (11px → 92% viewport)', 'LocaleSwitcher a11y con role=group + aria-label', 'Rewrite favicon + hreflang cubre 4 locales'],
      pt: ['Landing 100% multilíngue nativa (EN·ES·PT·DE)', 'Fix drawer mobile com Portal (11px → 92% viewport)', 'LocaleSwitcher com role=group + aria-label', 'Rewrite favicon + hreflang cobre 4 locales'],
      de: ['Landing 100% mehrsprachig nativ (EN·ES·PT·DE)', 'Mobile-Drawer Portal-Fix (11px → 92% Viewport)', 'LocaleSwitcher a11y mit role=group + aria-label', 'Favicon-Rewrite + hreflang deckt 4 Locales ab']
    }
  },
  {
    version: 'S70', date: '2026-08-10', tag: 'major',
    highlights: {
      en: ['4-locale expansion (EN·ES·PT·DE) — added Portuguese + German', 'Multi-locale SEO refactor (sitemap, OpenGraph, canonicals)', 'Mobile hamburger 44×44 WCAG AA + full drawer'],
      es: ['Expansión a 4 idiomas (EN·ES·PT·DE) — Portugués y Alemán agregados', 'Refactor SEO multi-locale (sitemap, OpenGraph, canonicals)', 'Hamburger mobile 44×44 WCAG AA + drawer completo'],
      pt: ['Expansão para 4 idiomas (EN·ES·PT·DE) — Português e Alemão adicionados', 'Refactor SEO multi-idioma (sitemap, OpenGraph, canonicals)', 'Hambúrguer mobile 44×44 WCAG AA + drawer completo'],
      de: ['Erweiterung auf 4 Sprachen (EN·ES·PT·DE) — Portugiesisch und Deutsch hinzugefügt', 'Mehrsprachige SEO-Überarbeitung (Sitemap, OpenGraph, Canonicals)', 'Mobile Hamburger 44×44 WCAG AA + vollständiger Drawer']
    }
  },
  {
    version: 'S51', date: '2026-08-08', tag: 'fix',
    highlights: {
      en: ['Fixed 4 broken links (/about, /terms, /privacy, /changelog)', 'Created 4 legal/info pages bilingual', 'Footer dead-links cleanup'],
      es: ['4 broken links arreglados (/about, /terms, /privacy, /changelog)', '4 páginas legales/info bilingües creadas', 'Footer dead-links limpieza'],
      pt: ['4 links quebrados corrigidos (/about, /terms, /privacy, /changelog)', '4 páginas legais/info bilíngues criadas', 'Limpeza de dead-links no rodapé'],
      de: ['4 defekte Links behoben (/about, /terms, /privacy, /changelog)', '4 zweisprachige Rechts-/Info-Seiten erstellt', 'Footer-Toter-Link-Bereinigung']
    }
  },
  {
    version: 'S50', date: '2026-08-08', tag: 'feature',
    highlights: {
      en: ['DiscoveryPanel inside Itinerary with filters (category/radius/rating/sort)', 'Feature Tour first-visit (5 steps)', 'Landing cleanup — CitiesGrid removed'],
      es: ['DiscoveryPanel dentro Itinerary con filtros (categoría/radio/rating/sort)', 'Feature Tour primera visita (5 pasos)', 'Landing cleanup — CitiesGrid removido'],
      pt: ['DiscoveryPanel dentro do Itinerary com filtros (categoria/raio/rating/ordenação)', 'Feature Tour primeira visita (5 passos)', 'Limpeza da landing — CitiesGrid removido'],
      de: ['DiscoveryPanel im Itinerary mit Filtern (Kategorie/Radius/Bewertung/Sortierung)', 'Feature-Tour beim ersten Besuch (5 Schritte)', 'Landing-Bereinigung — CitiesGrid entfernt']
    }
  },
  {
    version: 'S48-S49', date: '2026-08-08', tag: 'major',
    highlights: {
      en: ['Hero redesigned with 3-intent CTAs + Timeline mockup', 'FeatureQuickAccess with 6 features 1-click access', 'Nav Destinations dropdown (24 regions × 4 continents)'],
      es: ['Hero rediseñado 3 CTAs por intent + Timeline mockup', 'FeatureQuickAccess con 6 features de 1-click', 'Nav dropdown Destinos (24 regiones × 4 continentes)'],
      pt: ['Hero redesenhado com 3 CTAs por intent + Timeline mockup', 'FeatureQuickAccess com 6 recursos de 1 clique', 'Nav dropdown Destinos (24 regiões × 4 continentes)'],
      de: ['Hero neu gestaltet mit 3 CTAs pro Intent + Timeline-Mockup', 'FeatureQuickAccess mit 6 Features per 1-Klick', 'Nav-Dropdown Ziele (24 Regionen × 4 Kontinente)']
    }
  },
  {
    version: 'S46-S47', date: '2026-08-08', tag: 'major',
    highlights: {
      en: ['AI Operations Engine — edit itinerary in natural language', 'Realtime collab (Supabase postgres_changes)', 'Offline mutation queue + auto-flush', 'AI Undo, Analytics events, Print/PDF, Share'],
      es: ['Motor AI Operations — edita itinerario en lenguaje natural', 'Colaboración realtime (Supabase postgres_changes)', 'Cola de mutaciones offline + auto-flush', 'AI Undo, Analytics, Print/PDF, Share'],
      pt: ['Motor AI Operations — edita roteiro em linguagem natural', 'Colaboração realtime (Supabase postgres_changes)', 'Fila de mutações offline + auto-flush', 'AI Undo, Analytics, Print/PDF, Compartilhar'],
      de: ['KI-Operations-Engine — Reiseplan in natürlicher Sprache bearbeiten', 'Echtzeit-Zusammenarbeit (Supabase postgres_changes)', 'Offline-Mutations-Warteschlange + Auto-Flush', 'KI-Rückgängig, Analytics, Print/PDF, Teilen']
    }
  },
  {
    version: 'S44-S45', date: '2026-08-08', tag: 'major',
    highlights: {
      en: ['Itinerary Engine P0-P3: trip_days + itinerary_items schema', 'Timeline day×time with DnD cross-day', 'Google Routes v2 traffic-aware + cache', 'Opening hours check, Schedule Day, Optimize Day (TSP)'],
      es: ['Motor Itinerary P0-P3: schema trip_days + itinerary_items', 'Timeline día×hora con DnD entre días', 'Google Routes v2 traffic-aware + cache', 'Chequeo horarios, Programar día, Optimizar día (TSP)'],
      pt: ['Motor Itinerary P0-P3: schema trip_days + itinerary_items', 'Timeline dia×hora com DnD entre dias', 'Google Routes v2 traffic-aware + cache', 'Verificação de horários, Programar dia, Otimizar dia (TSP)'],
      de: ['Itinerary-Engine P0-P3: trip_days + itinerary_items Schema', 'Timeline Tag×Stunde mit DnD zwischen Tagen', 'Google Routes v2 verkehrsbewusst + Cache', 'Öffnungszeiten-Check, Tag planen, Tag optimieren (TSP)']
    }
  },
  {
    version: 'S42-S43', date: '2026-08-08', tag: 'feature',
    highlights: {
      en: ['AI Cost Dashboard (/admin/ai-costs)', 'Web Vitals RUM via sendBeacon', 'Financial Tracker (booked/actual/remaining)', 'Stop Voting LIKE/MAYBE/NO'],
      es: ['Dashboard costos IA (/admin/ai-costs)', 'Web Vitals RUM via sendBeacon', 'Tracker financiero (reservado/actual/restante)', 'Votación por parada LIKE/MAYBE/NO'],
      pt: ['Dashboard de custos de IA (/admin/ai-costs)', 'Web Vitals RUM via sendBeacon', 'Tracker financeiro (reservado/atual/restante)', 'Votação por parada LIKE/MAYBE/NO'],
      de: ['KI-Kosten-Dashboard (/admin/ai-costs)', 'Web Vitals RUM via sendBeacon', 'Finanz-Tracker (gebucht/aktuell/verbleibend)', 'Stopp-Abstimmung LIKE/MAYBE/NO']
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

  const subtitle = L(locale, {
    en: "Everything we've shipped, ordered by sprint.",
    es: 'Todo lo que hemos shippeado, ordenado por sprint.',
    pt: 'Tudo o que entregamos, ordenado por sprint.',
    de: 'Alles, was wir ausgeliefert haben, nach Sprint sortiert.'
  });
  const footer = L(locale, {
    en: 'Subscribe to the blog RSS for more updates.',
    es: 'Subscríbete al RSS del blog para más actualizaciones.',
    pt: 'Assine o RSS do blog para mais atualizações.',
    de: 'Abonniere den Blog-RSS für weitere Updates.'
  });

  return (
    <>
      <Nav locale={locale as Locale} />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-semibold text-ink-900">Changelog</h1>
        <p className="mt-2 text-lg text-ink-500">{subtitle}</p>

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
                {((r.highlights as Record<string, string[]>)[locale] ?? r.highlights.en).map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-ink-400">{footer}</p>
      </main>
      <Footer locale={locale} />
    </>
  );
}
