'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from './LocaleSwitcher';
import { UserMenu } from './UserMenu';
import type { Locale } from '@/i18n/request';

// S48 UX: Nav rediseñado. Antes: "Rutas" → solo /california (falso — hay 24 regiones).
// Ahora: "Destinos" dropdown con top regiones organizadas por continente + link Itinerario primary + AI Planner.

const REGIONS_BY_CONTINENT: Array<{ label_en: string; label_es: string; regions: Array<{ slug: string; label: string; flag: string }> }> = [
  {
    label_en: 'North America', label_es: 'Norteamérica',
    regions: [
      { slug: 'california', label: 'California', flag: '🌴' },
      { slug: 'pacific-northwest', label: 'Pacific NW', flag: '🌲' },
      { slug: 'southwest', label: 'Southwest', flag: '🏜️' },
      { slug: 'utah', label: 'Utah', flag: '🏔️' },
      { slug: 'mexico', label: 'México', flag: '🇲🇽' },
      { slug: 'canada', label: 'Canada', flag: '🇨🇦' }
    ]
  },
  {
    label_en: 'Europe', label_es: 'Europa',
    regions: [
      { slug: 'italy', label: 'Italia', flag: '🇮🇹' },
      { slug: 'spain', label: 'España', flag: '🇪🇸' },
      { slug: 'iceland', label: 'Iceland', flag: '🇮🇸' },
      { slug: 'ireland', label: 'Ireland', flag: '🇮🇪' },
      { slug: 'scotland', label: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
      { slug: 'germany', label: 'Germany', flag: '🇩🇪' }
    ]
  },
  {
    label_en: 'Latin America', label_es: 'Latinoamérica',
    regions: [
      { slug: 'chile', label: 'Chile', flag: '🇨🇱' },
      { slug: 'argentina', label: 'Argentina', flag: '🇦🇷' },
      { slug: 'peru', label: 'Perú', flag: '🇵🇪' }
    ]
  },
  {
    label_en: 'Asia · Oceania · Africa', label_es: 'Asia · Oceanía · África',
    regions: [
      { slug: 'japan', label: 'Japan', flag: '🇯🇵' },
      { slug: 'australia', label: 'Australia', flag: '🇦🇺' },
      { slug: 'new-zealand', label: 'New Zealand', flag: '🇳🇿' },
      { slug: 'morocco', label: 'Morocco', flag: '🇲🇦' }
    ]
  }
];

export function Nav({ locale }: { locale: Locale }){
  const t = useTranslations('nav');
  const isEs = locale === 'es';
  const [destOpen, setDestOpen] = useState(false);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if(destRef.current && !destRef.current.contains(e.target as Node)) setDestOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if(e.key === 'Escape') setDestOpen(false); };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); };
  }, []);

  return (
    <header className="glass sticky top-0 z-40 border-b border-ink-100/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href={`/${locale}`} className="flex items-center gap-2 text-ink-800">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-coral-500 to-coral-600 text-white shadow-glow">
            <span className="font-display font-semibold">t</span>
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">TripLoop</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {/* Agenda diaria (nuevo S52) */}
          <Link href={`/${locale}/agenda`} className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-900">
            <span aria-hidden className="mr-1">🗓</span>
            {isEs ? 'Agenda' : 'Agenda'}
          </Link>

          {/* Ruta multi-día */}
          <Link href={`/${locale}/trip/new`} className="text-sm font-medium text-ink-500 transition hover:text-ink-800">
            {isEs ? 'Rutas' : 'Trips'}
          </Link>

          {/* Destinos dropdown */}
          <div ref={destRef} className="relative">
            <button
              onClick={() => setDestOpen(o => !o)}
              aria-expanded={destOpen}
              aria-haspopup="menu"
              className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 transition hover:text-ink-800"
            >
              {isEs ? 'Destinos' : 'Destinations'}
              <span aria-hidden className={`text-xs transition ${destOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {destOpen && (
              <div
                role="menu"
                className="absolute left-0 top-full mt-2 grid w-[560px] max-w-[92vw] gap-3 rounded-card border border-ink-100 bg-white p-5 shadow-2xl md:grid-cols-2"
              >
                {REGIONS_BY_CONTINENT.map(cont => (
                  <div key={cont.label_en}>
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-ink-400">
                      {isEs ? cont.label_es : cont.label_en}
                    </div>
                    <ul className="space-y-0.5">
                      {cont.regions.map(r => (
                        <li key={r.slug}>
                          <Link
                            href={`/${locale}/${r.slug}`}
                            onClick={() => setDestOpen(false)}
                            className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-ink-700 hover:bg-ink-50 hover:text-ink-900"
                          >
                            <span aria-hidden>{r.flag}</span>
                            <span>{r.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="col-span-full mt-2 border-t border-ink-100 pt-3 text-center">
                  <Link
                    href={`/${locale}/california`}
                    onClick={() => setDestOpen(false)}
                    className="text-sm font-semibold text-coral-600 hover:underline"
                  >
                    {isEs ? 'Ver las 24 regiones →' : 'View all 24 regions →'}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* AI Planner */}
          <Link
            href={`/${locale}/trip/new/ai`}
            className="inline-flex items-center gap-1 text-sm font-medium text-ocean-700 transition hover:text-ocean-900"
          >
            <span aria-hidden>✨</span>
            {isEs ? 'IA Planner' : 'AI Planner'}
          </Link>

          <Link href={`/${locale}/blog`} className="text-sm font-medium text-ink-500 transition hover:text-ink-800">Blog</Link>
          <a href="#pricing" className="text-sm font-medium text-ink-500 transition hover:text-ink-800">{t('pricing')}</a>
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher currentLocale={locale} />
          <UserMenu locale={locale} />
          {/* Get Started ahora apunta a AI Planner (feature con mayor conversion vs blank trip) */}
          <Link
            href={`/${locale}/trip/new/ai`}
            className="hidden rounded-pill bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-700 sm:inline-flex"
          >
            {t('getStarted')}
          </Link>
        </div>
      </div>
    </header>
  );
}
