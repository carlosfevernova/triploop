import Link from 'next/link';
import { createPublicClient } from '@/lib/supabase-admin';
import { REGION_META, type Region } from '@/lib/templates-seed';

interface TemplateRow {
  slug: string; title: string; seo_description?: string; days_count: number;
  origin_city?: string; destination_city?: string; hero_image_url?: string;
  stops: unknown[]; total_distance_m?: number; total_duration_s?: number;
}

export async function RegionIndex({ region, locale }: { region: Region; locale: string }){
  const isEs = locale === 'es';
  const meta = REGION_META[region];
  const sb = createPublicClient();
  const { data } = await sb.from('trips')
    .select('slug, title, seo_description, days_count, origin_city, destination_city, hero_image_url, stops, total_distance_m, total_duration_s')
    .eq('is_template', true)
    .eq('is_public', true)
    .eq('region', region)
    .order('days_count', { ascending: true });

  const templates = (data || []) as TemplateRow[];

  return (
    <main className="min-h-screen bg-gradient-to-br from-coral-50/40 via-white to-ocean-400/5">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-coral-600">
            {isEs ? `Rutas ${meta.name_es} · listas para personalizar` : `${meta.name_en} itineraries · ready to customize`}
          </p>
          <h1 className="font-display text-display-lg tracking-tight text-ink-900">
            {isEs ? `Road trips por ${meta.name_es}.` : `${meta.name_en} road trips.`}
          </h1>
          <p className="mt-4 text-lg text-ink-500">
            {isEs ? meta.tagline_es : meta.tagline_en}
          </p>
        </div>

        {templates.length === 0 ? (
          <div className="rounded-card border border-dashed border-ink-200 bg-white p-16 text-center">
            <p className="text-ink-500">{isEs ? 'Aún no hay rutas cargadas para esta región.' : 'No templates for this region yet.'}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              <TemplateCard key={t.slug} tpl={t} locale={locale} regionSlug={meta.slug} isEs={isEs} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function TemplateCard({ tpl, locale, regionSlug, isEs }: { tpl: TemplateRow; locale: string; regionSlug: string; isEs: boolean }){
  const stopsCount = Array.isArray(tpl.stops) ? tpl.stops.length : 0;
  return (
    <Link
      href={`/${locale}/${regionSlug}/${tpl.slug}`}
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
