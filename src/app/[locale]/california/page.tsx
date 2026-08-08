import Link from 'next/link';
import type { Metadata } from 'next';
import { createPublicClient } from '@/lib/supabase-admin';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  const title = isEs
    ? 'Itinerarios California — Rutas listas para personalizar | TripLoop'
    : 'California Road Trip Itineraries — Ready to Customize | TripLoop';
  const description = isEs
    ? '8 rutas de California hechas para turistas internacionales. Duplica cualquiera, ajústala a tus fechas y personalízala. Con tiempos reales, precios con IVA e IA que sugiere paradas.'
    : '8 California road trips built for international travelers. Fork any one, adjust dates and customize. Real drive times, tax-inclusive pricing, AI suggests stops.';
  return {
    title,
    description,
    keywords: ['california road trip', 'california itinerary', 'san francisco road trip', 'los angeles itinerary', 'pacific coast highway'],
    alternates: { canonical: `/${locale}/california`, languages: { en: '/en/california', es: '/es/california' } },
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=1200&q=80' }]
    }
  };
}

export const revalidate = 3600; // ISR: revalida cada 1h

interface TemplateRow {
  slug: string; title: string; seo_description?: string; days_count: number;
  origin_city?: string; destination_city?: string; hero_image_url?: string;
  stops: unknown[]; total_distance_m?: number; total_duration_s?: number;
}

export default async function CaliforniaIndexPage({ params }: PageProps){
  const { locale } = await params;
  const isEs = locale === 'es';
  const sb = createPublicClient();
  const { data } = await sb.from('trips')
    .select('slug, title, seo_description, days_count, origin_city, destination_city, hero_image_url, stops, total_distance_m, total_duration_s')
    .eq('is_template', true)
    .eq('is_public', true)
    .order('days_count', { ascending: true });

  const templates = (data || []) as TemplateRow[];

  return (
    <main className="min-h-screen bg-gradient-to-br from-coral-50/40 via-white to-ocean-400/5">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-coral-600">
            {isEs ? 'Rutas California · listas para personalizar' : 'California itineraries · ready to customize'}
          </p>
          <h1 className="font-display text-display-lg tracking-tight text-ink-900">
            {isEs
              ? 'Rutas por California hechas para turistas.'
              : 'California road trips built for international travelers.'}
          </h1>
          <p className="mt-4 text-lg text-ink-500">
            {isEs
              ? 'Duplica cualquier ruta, ajusta las fechas, cambia paradas y compártela. Tiempos reales con tráfico, precios con IVA y sugerencias de IA cuando quieras más.'
              : 'Fork any trip, adjust dates, swap stops and share it. Real drive times with traffic, tax-included pricing, and AI suggestions when you want more.'}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <TemplateCard key={t.slug} tpl={t} locale={locale} isEs={isEs} />
          ))}
        </div>

        {templates.length === 0 && (
          <p className="rounded-card border border-dashed border-ink-200 bg-white p-16 text-center text-ink-400">
            {isEs ? 'Aún no hay rutas cargadas.' : 'No templates yet.'}
          </p>
        )}
      </div>
    </main>
  );
}

function TemplateCard({ tpl, locale, isEs }: { tpl: TemplateRow; locale: string; isEs: boolean }){
  const stopsCount = Array.isArray(tpl.stops) ? tpl.stops.length : 0;
  return (
    <Link
      href={`/${locale}/california/${tpl.slug}`}
      prefetch
      className="group flex flex-col overflow-hidden rounded-card border border-ink-100 bg-white shadow-card transition hover:shadow-card-hover"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-100">
        {tpl.hero_image_url ? (
          <img
            src={tpl.hero_image_url}
            alt={tpl.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : null}
        <div className="absolute right-3 top-3 rounded-pill bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-800 backdrop-blur">
          {tpl.days_count} {isEs ? 'días' : 'days'}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-ink-900">{tpl.title}</h3>
        {(tpl.origin_city || tpl.destination_city) && (
          <p className="mt-1 text-xs text-ink-500">
            {tpl.origin_city}{tpl.destination_city && tpl.destination_city !== tpl.origin_city ? ` → ${tpl.destination_city}` : ''}
          </p>
        )}
        {tpl.seo_description && (
          <p className="mt-3 line-clamp-2 text-sm text-ink-600">{tpl.seo_description}</p>
        )}
        <div className="mt-4 flex items-center gap-3 border-t border-ink-100 pt-3 text-xs text-ink-500">
          <span>{stopsCount} {isEs ? 'paradas' : 'stops'}</span>
          <span className="ml-auto font-semibold text-coral-600 group-hover:underline">
            {isEs ? 'Ver ruta →' : 'View trip →'}
          </span>
        </div>
      </div>
    </Link>
  );
}
