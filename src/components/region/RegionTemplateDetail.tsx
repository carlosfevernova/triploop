import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createPublicClient } from '@/lib/supabase-admin';
import { ForkButton } from '@/components/region/ForkButton';
import { ViewTracker } from '@/components/region/ViewTracker';
import { bookingSearchUrl, gygSearchUrl, estimateStayDates } from '@/lib/affiliate';
import { REGION_META, type Region } from '@/lib/templates-seed';
import { L } from '@/lib/l4';
import type { Locale } from '@/i18n/request';
import { locales } from '@/i18n/request';

// S71k: 4-locale migration. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
// REGION_META in templates-seed.ts still has only en/es names; pt uses es fallback, de uses en fallback.

export interface TemplateRow {
  id: string; slug: string; title: string; seo_description?: string;
  seo_keywords?: string[]; days_count: number; travelers_count?: number;
  origin_city?: string; destination_city?: string; hero_image_url?: string;
  region?: string;
  stops: Array<{ id?: string; name: string; address?: string; lat: number; lng: number; duration_min?: number; category?: string }>;
  total_distance_m?: number; total_duration_s?: number;
  is_template?: boolean;
  translations?: Record<string, { title?: string; seo_description?: string; seo_keywords?: string[]; stops?: Array<{ name: string }> }>;
  highway_notes?: string[];
  best_season?: 'spring' | 'summer' | 'fall' | 'winter' | 'year-round' | 'shoulder';
  difficulty?: 'easy' | 'moderate' | 'challenging' | 'epic';
  total_distance_km?: number;
}

export function applyLocale(tpl: TemplateRow, locale: string): TemplateRow {
  if(!tpl.translations || locale === 'en') return tpl;
  const t = tpl.translations[locale];
  if(!t) return tpl;
  return {
    ...tpl,
    title: t.title || tpl.title,
    seo_description: t.seo_description || tpl.seo_description,
    seo_keywords: t.seo_keywords || tpl.seo_keywords,
    stops: t.stops
      ? tpl.stops.map((s, i) => ({ ...s, name: t.stops![i]?.name || s.name }))
      : tpl.stops
  };
}

export async function getTemplateByRegion(region: Region, slug: string): Promise<TemplateRow | null> {
  const sb = createPublicClient();
  const full = await sb.from('trips')
    .select('id, slug, region, title, seo_description, seo_keywords, days_count, travelers_count, origin_city, destination_city, hero_image_url, stops, total_distance_m, total_duration_s, is_template, translations, highway_notes, best_season, difficulty, total_distance_km')
    .eq('slug', slug).eq('is_template', true).eq('region', region).maybeSingle();
  if(!full.error && full.data) return full.data as TemplateRow;
  const basic = await sb.from('trips')
    .select('id, slug, region, title, seo_description, seo_keywords, days_count, travelers_count, origin_city, destination_city, hero_image_url, stops, total_distance_m, total_duration_s, is_template, translations')
    .eq('slug', slug).eq('is_template', true).eq('region', region).maybeSingle();
  return (basic.data as TemplateRow) || null;
}

export async function generateRegionMetadata(region: Region, slug: string, locale: string): Promise<Metadata> {
  const raw = await getTemplateByRegion(region, slug);
  if(!raw) return { title: 'Not found', robots: { index: false } };
  const tpl = applyLocale(raw, locale);
  const title = `${tpl.title} — TripLoop`;
  const descFallback = L(locale, {
    en: `Discover ${tpl.title} — a ${tpl.days_count}-day road trip you can fork and customize.`,
    es: `Descubre ${tpl.title} — un road trip de ${tpl.days_count} días que puedes duplicar y personalizar.`,
    pt: `Descubra ${tpl.title} — uma road trip de ${tpl.days_count} dias que você pode duplicar e personalizar.`,
    de: `Entdecke ${tpl.title} — ein ${tpl.days_count}-tägiger Roadtrip, den du duplizieren und anpassen kannst.`
  });
  const description = tpl.seo_description || descFallback;
  const ogImage = tpl.hero_image_url || `https://triploop-six.vercel.app/api/og?title=${encodeURIComponent(tpl.title)}`;
  return {
    title, description, keywords: tpl.seo_keywords,
    alternates: {
      canonical: `/${locale}/${region}/${slug}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/${region}/${slug}`])),
        'x-default': `/en/${region}/${slug}`
      }
    },
    openGraph: { title, description, type: 'article', images: [{ url: ogImage, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] }
  };
}

export async function RegionTemplateDetail({ region, slug, locale }: { region: Region; slug: string; locale: string }){
  const raw = await getTemplateByRegion(region, slug);
  if(!raw) notFound();
  const tpl = applyLocale(raw, locale);

  const stops = tpl.stops || [];
  const totalDurationHours = tpl.total_duration_s ? Math.round(tpl.total_duration_s / 3600) : null;
  const totalKm = tpl.total_distance_m ? Math.round(tpl.total_distance_m / 1000) : null;
  const meta = REGION_META[region];
  const regionName = locale === 'pt' || locale === 'es' ? meta.name_es : meta.name_en;

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'TouristTrip',
    name: tpl.title, description: tpl.seo_description,
    duration: `P${tpl.days_count}D`, touristType: 'International travelers',
    itinerary: {
      '@type': 'ItemList',
      itemListElement: stops.map((s, i) => ({
        '@type': 'ListItem', position: i + 1,
        item: { '@type': 'TouristAttraction', name: s.name, address: s.address, geo: { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lng } }
      }))
    }
  };

  const backLabel = L(locale, {
    en: `← All ${regionName} trips`,
    es: `← Todas las rutas de ${regionName}`,
    pt: `← Todas as viagens de ${regionName}`,
    de: `← Alle ${regionName}-Reisen`
  });
  const daysWord = L(locale, { en: 'days', es: 'días', pt: 'dias', de: 'Tage' });
  const stopsWord = L(locale, { en: 'stops', es: 'paradas', pt: 'paradas', de: 'Stopps' });
  const driveWord = L(locale, { en: 'drive', es: 'de manejo', pt: 'de direção', de: 'Fahrt' });
  const highwaysLabel = L(locale, { en: 'Highways', es: 'Ruta', pt: 'Rodovias', de: 'Autobahnen' });
  const itineraryHeading = L(locale, { en: 'The itinerary', es: 'Itinerario', pt: 'O roteiro', de: 'Der Reiseplan' });
  const forkCta = L(locale, {
    en: 'Love this trip? Fork it in one click and customize with your own dates and stops.',
    es: '¿Te gustó esta ruta? Duplícala en 1 clic y personalízala con tus fechas y paradas.',
    pt: 'Gostou desta viagem? Duplique em 1 clique e personalize com suas datas e paradas.',
    de: 'Gefällt dir diese Reise? Dupliziere sie mit einem Klick und passe sie mit deinen eigenen Daten und Stopps an.'
  });
  const moreLabel = L(locale, { en: 'More trips', es: 'Más rutas', pt: 'Mais viagens', de: 'Weitere Reisen' });
  const exploreAll = L(locale, {
    en: `Explore all ${regionName} trips →`,
    es: `Explorar todas las rutas de ${regionName} →`,
    pt: `Explore todas as viagens de ${regionName} →`,
    de: `Alle ${regionName}-Reisen entdecken →`
  });

  return (
    <>
      <ViewTracker slug={slug} locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-white">
        <section className="relative isolate overflow-hidden bg-ink-900 text-white">
          {tpl.hero_image_url && (
            <>
              <Image
                src={tpl.hero_image_url}
                alt=""
                aria-hidden
                fill
                sizes="100vw"
                priority
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-ink-900/40 via-ink-900/50 to-ink-900/90" />
            </>
          )}
          <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 md:py-32">
            <Link href={`/${locale}/${region}`} className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-white/80 hover:text-white">
              {backLabel}
            </Link>
            <h1 className="font-display text-display-lg tracking-tight md:text-display-xl">{tpl.title}</h1>
            {tpl.seo_description && <p className="mt-4 max-w-3xl text-lg text-white/90">{tpl.seo_description}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Chip>{tpl.days_count} {daysWord}</Chip>
              <Chip>{stops.length} {stopsWord}</Chip>
              {(tpl.total_distance_km || totalKm) && <Chip>~{tpl.total_distance_km || totalKm} km</Chip>}
              {totalDurationHours && <Chip>~{totalDurationHours}h {driveWord}</Chip>}
              {tpl.best_season && (
                <Chip>{seasonEmoji(tpl.best_season)} {seasonLabel(tpl.best_season, locale)}</Chip>
              )}
              {tpl.difficulty && (
                <Chip>{difficultyEmoji(tpl.difficulty)} {difficultyLabel(tpl.difficulty, locale)}</Chip>
              )}
            </div>
            {tpl.highway_notes && tpl.highway_notes.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-xs font-semibold uppercase tracking-widest text-amber-200">🛣️ {highwaysLabel}</span>
                {tpl.highway_notes.map((h, i) => (
                  <span key={i} className="rounded-pill border border-amber-300/40 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-100">{h}</span>
                ))}
              </div>
            )}
            <div className="mt-8"><ForkButton slug={tpl.slug} locale={locale} /></div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <h2 className="mb-8 font-display text-display-md tracking-tight text-ink-900">
            {itineraryHeading}
          </h2>
          <ol className="space-y-4">
            {stops.map((s, i) => (
              <li key={i} className="flex gap-4 rounded-card border border-ink-100 bg-white p-5 shadow-card">
                <div className="flex-shrink-0">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-coral-500 font-semibold text-white">{i + 1}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-semibold text-ink-900">{s.name}</h3>
                  {s.address && <p className="text-sm text-ink-500">{s.address}</p>}
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-500">
                    {s.duration_min ? <span>⏱ {formatMin(s.duration_min)}</span> : null}
                    {s.category ? <span className="rounded-pill bg-ink-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">{s.category}</span> : null}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 rounded-card border border-coral-200 bg-gradient-to-br from-coral-50 to-white p-8 text-center">
            <p className="mb-4 text-ink-700">{forkCta}</p>
            <ForkButton slug={tpl.slug} locale={locale} big />
          </div>
        </section>

        <BookingSection tpl={tpl} locale={locale} />

        <section className="border-t border-ink-100 bg-ink-50/40 py-16">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-500">{moreLabel}</p>
            <Link href={`/${locale}/${region}`} className="mt-3 inline-block font-display text-display-sm text-ink-900 hover:text-coral-600">
              {exploreAll}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

function Chip({ children }: { children: React.ReactNode }){
  return (
    <span className="rounded-pill bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
      {children}
    </span>
  );
}

function BookingSection({ tpl, locale }: { tpl: TemplateRow; locale: string }){
  const stops = tpl.stops || [];
  const uniqCities = Array.from(new Map(stops.map((s) => [s.name.split(',')[0], s])).values()).slice(0, 6);
  const { checkin, checkout } = estimateStayDates(undefined, tpl.days_count);
  const guests = tpl.travelers_count || 2;
  const heading = L(locale, {
    en: 'Book stays & activities',
    es: 'Reserva mientras planeas',
    pt: 'Reserve hospedagem e passeios',
    de: 'Übernachtungen & Aktivitäten buchen'
  });
  const disclaimer = L(locale, {
    en: 'Tax-included hotels and activities with free cancellation. TripLoop earns a small commission — you never pay extra.',
    es: 'Hoteles con impuestos incluidos y actividades con cancelación gratis. TripLoop recibe una pequeña comisión, tú nunca pagas de más.',
    pt: 'Hotéis com impostos incluídos e atividades com cancelamento grátis. O TripLoop recebe uma pequena comissão — você nunca paga a mais.',
    de: 'Hotels inkl. Steuern und Aktivitäten mit kostenloser Stornierung. TripLoop erhält eine kleine Provision — du zahlst nie mehr.'
  });
  const learnMore = L(locale, { en: 'Learn more', es: 'Ver aviso', pt: 'Saiba mais', de: 'Mehr erfahren' });
  const hotelsLabel = L(locale, { en: 'Hotels', es: 'Hoteles', pt: 'Hotéis', de: 'Hotels' });
  const toursLabel = L(locale, { en: 'Tours', es: 'Tours', pt: 'Passeios', de: 'Touren' });

  return (
    <section className="border-t border-ink-100 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="mb-2 font-display text-display-md text-ink-900">{heading}</h2>
        <p className="mb-6 text-sm text-ink-500">
          {disclaimer}{' '}
          <a href={`/${locale}/affiliate-disclosure`} className="underline hover:text-ink-900">{learnMore}</a>
        </p>
        <ul className="space-y-2">
          {uniqCities.map((s, i) => (
            <li key={i} className="flex items-center gap-2 rounded-card border border-ink-100 bg-white p-4">
              <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-ink-100 text-xs font-semibold text-ink-700">{i + 1}</span>
              <span className="flex-1 truncate text-sm font-semibold text-ink-900">{s.name}</span>
              <a href={bookingSearchUrl(s.name, { checkin, checkout, guests, locale, source: 'template' })}
                target="_blank" rel="noreferrer sponsored nofollow"
                className="rounded-pill bg-ocean-400 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:brightness-110">
                🏨 {hotelsLabel}
              </a>
              <a href={gygSearchUrl(s.name, { locale, source: 'template' })}
                target="_blank" rel="noreferrer sponsored nofollow"
                className="rounded-pill bg-coral-500 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-coral-600">
                🎭 {toursLabel}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function formatMin(min: number){
  if(min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function seasonEmoji(s: string){
  return { spring: '🌸', summer: '☀️', fall: '🍂', winter: '❄️', 'year-round': '🌍', shoulder: '🍃' }[s] || '📅';
}
function seasonLabel(s: string, locale: string): string {
  const labels: Record<string, Record<Locale, string>> = {
    spring:       { en: 'Spring',           es: 'Primavera',       pt: 'Primavera',        de: 'Frühling' },
    summer:       { en: 'Summer',           es: 'Verano',          pt: 'Verão',            de: 'Sommer' },
    fall:         { en: 'Fall',             es: 'Otoño',           pt: 'Outono',           de: 'Herbst' },
    winter:       { en: 'Winter',           es: 'Invierno',        pt: 'Inverno',          de: 'Winter' },
    'year-round': { en: 'Year-round',       es: 'Todo el año',     pt: 'Ano todo',         de: 'Ganzjährig' },
    shoulder:     { en: 'Shoulder season',  es: 'Temporada media', pt: 'Meia temporada',   de: 'Nebensaison' }
  };
  return labels[s] ? L(locale, labels[s]) : s;
}
function difficultyEmoji(d: string){
  return { easy: '🟢', moderate: '🟡', challenging: '🟠', epic: '🔴' }[d] || '⚪';
}
function difficultyLabel(d: string, locale: string): string {
  const labels: Record<string, Record<Locale, string>> = {
    easy:        { en: 'Easy',        es: 'Fácil',       pt: 'Fácil',         de: 'Leicht' },
    moderate:    { en: 'Moderate',    es: 'Moderado',    pt: 'Moderado',      de: 'Mittel' },
    challenging: { en: 'Challenging', es: 'Desafiante',  pt: 'Desafiador',    de: 'Anspruchsvoll' },
    epic:        { en: 'Epic',        es: 'Épico',       pt: 'Épico',         de: 'Episch' }
  };
  return labels[d] ? L(locale, labels[d]) : d;
}
