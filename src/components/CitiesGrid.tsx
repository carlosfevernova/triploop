'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

const heroImages: Record<string, string> = {
  'San Francisco': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop',
  'Los Angeles': 'https://images.unsplash.com/photo-1544413164-5f1b361f5ee5?w=800&auto=format&fit=crop',
  'San Diego': 'https://images.unsplash.com/photo-1566288623394-377af472d81b?w=800&auto=format&fit=crop',
  'Yosemite': 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=800&auto=format&fit=crop',
  'Big Sur': 'https://images.unsplash.com/photo-1548783094-f92388978a25?w=800&auto=format&fit=crop',
  'The Grand Loop': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop',
  'El Loop Grande': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop'
};

// Mapping card name → template slug (linkea a /california/[slug])
const NAME_TO_SLUG: Record<string, string> = {
  'San Francisco': 'san-francisco-classic-5-days',
  'Los Angeles': 'los-angeles-highlights-4-days',
  'San Diego': 'san-diego-sunny-3-days',
  'Yosemite': 'yosemite-weekend-3-days',
  'Big Sur': 'pacific-coast-highway-5-days',
  'The Grand Loop': 'grand-california-loop-14-days',
  'El Loop Grande': 'grand-california-loop-14-days'
};

export function CitiesGrid(){
  const t = useTranslations('cities');
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';
  const isEs = locale === 'es';
  const items = t.raw('items') as Array<{ name: string; tag: string; note: string }>;
  return (
    <section className="bg-ink-50 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="font-display text-display-lg text-ink-900 text-balance">{t('title')}</h2>
          <p className="mt-4 text-lg text-ink-500 text-balance">{t('subtitle')}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const slug = NAME_TO_SLUG[item.name];
            const href = slug ? `/${locale}/california/${slug}` : `/${locale}/california`;
            return (
              <Link
                key={item.name}
                href={href}
                prefetch
                className="group relative block overflow-hidden rounded-card bg-white shadow-card transition hover:shadow-card-hover"
              >
                <div className="relative h-56 overflow-hidden bg-ink-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroImages[item.name] || heroImages['San Francisco']}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent" />
                  <span className="absolute right-3 top-3 rounded-pill bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-800 backdrop-blur">
                    {item.tag}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-2xl font-semibold text-white">{item.name}</h3>
                    <p className="mt-1 text-sm text-white/85">{item.note}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Link
            href={`/${locale}/california`}
            className="inline-flex items-center gap-2 rounded-pill border border-ink-900 bg-white px-6 py-3 text-sm font-semibold text-ink-900 transition hover:bg-ink-900 hover:text-white"
          >
            {isEs ? 'Ver todas las rutas de California' : 'See all California itineraries'} →
          </Link>
        </div>
      </div>
    </section>
  );
}
