'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const REGIONS = [
  {
    slug: 'california', name_en: 'California', name_es: 'California',
    subtitle_en: 'PCH, Yosemite, Napa', subtitle_es: 'PCH, Yosemite, Napa',
    image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800&auto=format&fit=crop',
    trips: 8
  },
  {
    slug: 'nevada', name_en: 'Nevada', name_es: 'Nevada',
    subtitle_en: 'Vegas, Tahoe, Highway 50', subtitle_es: 'Vegas, Tahoe, Highway 50',
    image: 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=800&auto=format&fit=crop',
    trips: 3
  },
  {
    slug: 'arizona', name_en: 'Arizona', name_es: 'Arizona',
    subtitle_en: 'Grand Canyon, Sedona', subtitle_es: 'Grand Canyon, Sedona',
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&auto=format&fit=crop',
    trips: 3
  },
  {
    slug: 'southwest', name_en: 'US Southwest', name_es: 'Suroeste USA',
    subtitle_en: 'Grand Circle, Route 66', subtitle_es: 'Grand Circle, Route 66',
    image: 'https://images.unsplash.com/photo-1547750385-c50c65ff8267?w=800&auto=format&fit=crop',
    trips: 2
  }
];

export function RegionsGrid(){
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';
  const isEs = locale === 'es';
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-coral-600">
            {isEs ? 'Explora por región' : 'Explore by region'}
          </p>
          <h2 className="font-display text-display-lg text-ink-900 text-balance">
            {isEs ? 'Road trips por todo el suroeste' : 'Road trips across the US Southwest'}
          </h2>
          <p className="mt-3 text-lg text-ink-500">
            {isEs ? '16 rutas curadas · 4 regiones · listas para duplicar' : '16 curated itineraries · 4 regions · fork any in one click'}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {REGIONS.map((r) => (
            <Link
              key={r.slug}
              href={`/${locale}/${r.slug}`}
              prefetch
              className="group relative block aspect-[4/5] overflow-hidden rounded-card bg-ink-200 shadow-card transition hover:shadow-card-hover"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={r.image}
                alt={r.name_en}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/30 to-transparent" />
              <span className="absolute right-3 top-3 rounded-pill bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-800 backdrop-blur">
                {r.trips} {isEs ? 'rutas' : 'trips'}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <h3 className="font-display text-2xl font-semibold">
                  {isEs ? r.name_es : r.name_en}
                </h3>
                <p className="mt-1 text-sm text-white/85">{isEs ? r.subtitle_es : r.subtitle_en}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
