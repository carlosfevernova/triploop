'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from './LocaleSwitcher';
import { UserMenu } from './UserMenu';
import type { Locale } from '@/i18n/request';

// S48 UX: Nav rediseñado. Antes: "Rutas" → solo /california (falso — hay 24 regiones).
// Ahora: "Destinos" dropdown con top regiones organizadas por continente + link Itinerario primary + AI Planner.
// S101: hamburger mobile menu añadido para viewports <768px.

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

// S70: labels multilingües para strings del Nav no cubiertos por next-intl messages.
// Fallback: si el locale no está, usa EN. Cubre las 4 lenguas de inuit-studio (EN/ES/PT/DE).
const NAV_LABELS = {
  destinations: { en: 'Destinations', es: 'Destinos', pt: 'Destinos', de: 'Ziele' },
  trips:        { en: 'Trips',        es: 'Rutas',    pt: 'Rotas',    de: 'Reisen' },
  aiPlanner:    { en: 'AI Planner',   es: 'IA Planner', pt: 'Planejador IA', de: 'KI-Planer' },
  agenda:       { en: 'Agenda',       es: 'Agenda',   pt: 'Agenda',   de: 'Agenda' },
  dailyAgenda:  { en: 'Daily agenda', es: 'Agenda diaria', pt: 'Agenda diária', de: 'Tagesagenda' },
  planWithAI:   { en: 'Plan with AI', es: 'Planea con IA', pt: 'Planeje com IA', de: 'Mit KI planen' },
  multiDay:     { en: 'Multi-day trips', es: 'Rutas multi-día', pt: 'Rotas multi-dia', de: 'Mehrtagesreisen' },
  popularDest:  { en: 'Popular destinations', es: 'Destinos populares', pt: 'Destinos populares', de: 'Beliebte Ziele' },
  viewAll:      { en: 'View all 24 regions →', es: 'Ver las 24 regiones →', pt: 'Ver as 24 regiões →', de: 'Alle 24 Regionen ansehen →' },
  openMenu:     { en: 'Open menu',    es: 'Abrir menú', pt: 'Abrir menu', de: 'Menü öffnen' },
  mainMenu:     { en: 'Main menu',    es: 'Menú principal', pt: 'Menu principal', de: 'Hauptmenü' },
  language:     { en: 'Language',     es: 'Idioma',    pt: 'Idioma',   de: 'Sprache' }
} as const;

const L = (locale: Locale, key: keyof typeof NAV_LABELS) => NAV_LABELS[key][locale] ?? NAV_LABELS[key].en;

const CONTINENT_LABELS: Record<string, Record<Locale, string>> = {
  'North America':          { en: 'North America', es: 'Norteamérica', pt: 'América do Norte', de: 'Nordamerika' },
  'Europe':                 { en: 'Europe',        es: 'Europa',       pt: 'Europa',           de: 'Europa' },
  'Latin America':          { en: 'Latin America', es: 'Latinoamérica', pt: 'América Latina',  de: 'Lateinamerika' },
  'Asia · Oceania · Africa':{ en: 'Asia · Oceania · Africa', es: 'Asia · Oceanía · África', pt: 'Ásia · Oceania · África', de: 'Asien · Ozeanien · Afrika' }
};

export function Nav({ locale }: { locale: Locale }){
  const t = useTranslations('nav');
  const [destOpen, setDestOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if(destRef.current && !destRef.current.contains(e.target as Node)) setDestOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if(e.key === 'Escape'){ setDestOpen(false); setMobileOpen(false); }
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); };
  }, []);

  useEffect(() => {
    if(mobileOpen){
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header className="glass sticky top-0 z-40 border-b border-ink-100/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href={`/${locale}`} className="flex items-center gap-2 text-ink-800" onClick={() => setMobileOpen(false)}>
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-coral-500 to-coral-600 text-white shadow-glow">
            <span className="font-display font-semibold">t</span>
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">TripLoop</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href={`/${locale}/agenda`} className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-900">
            <span aria-hidden className="mr-1">🗓</span>
            {L(locale, 'agenda')}
          </Link>
          <Link href={`/${locale}/trip/new`} className="text-sm font-medium text-ink-500 transition hover:text-ink-800">
            {L(locale, 'trips')}
          </Link>
          <div ref={destRef} className="relative">
            <button
              onClick={() => setDestOpen(o => !o)}
              aria-expanded={destOpen}
              aria-haspopup="menu"
              className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 transition hover:text-ink-800"
            >
              {L(locale, 'destinations')}
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
                      {CONTINENT_LABELS[cont.label_en]?.[locale] ?? cont.label_en}
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
                    {L(locale, 'viewAll')}
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link href={`/${locale}/trip/new/ai`} className="inline-flex items-center gap-1 text-sm font-medium text-ocean-700 transition hover:text-ocean-900">
            <span aria-hidden>✨</span>
            {L(locale, 'aiPlanner')}
          </Link>
          <Link href={`/${locale}/blog`} className="text-sm font-medium text-ink-500 transition hover:text-ink-800">Blog</Link>
          <a href="#pricing" className="text-sm font-medium text-ink-500 transition hover:text-ink-800">{t('pricing')}</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop-only: switcher + user menu inline. Mobile los muestra dentro del panel */}
          <div className="hidden md:flex md:items-center md:gap-2 md:sm:gap-3">
            <LocaleSwitcher currentLocale={locale} />
            <UserMenu locale={locale} />
            <Link
              href={`/${locale}/trip/new/ai`}
              className="rounded-pill bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-700"
            >
              {t('getStarted')}
            </Link>
          </div>
          {/* Hamburger mobile — S101 + S70: refactor para dar espacio (target táctil 44px+ WCAG) */}
          <button
            type="button"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={L(locale, 'openMenu')}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-800 shadow-sm transition hover:border-coral-400 md:hidden"
          >
            <span className="relative block h-4 w-5">
              <span className={`absolute left-0 top-0 h-0.5 w-full bg-current transition-transform ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-current transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`absolute bottom-0 left-0 h-0.5 w-full bg-current transition-transform ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile fullscreen menu */}
      {mobileOpen && (
        <div
          id="mobile-nav-panel"
          className="fixed inset-x-0 top-[65px] bottom-0 z-30 overflow-y-auto bg-white/98 backdrop-blur-xl md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={L(locale, 'mainMenu')}
        >
          <div className="mx-auto max-w-md px-6 py-8">
            <div className="mb-6 flex flex-col gap-2">
              <Link
                href={`/${locale}/agenda`}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[56px] items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 font-semibold text-emerald-700"
              >
                <span className="text-xl" aria-hidden>🗓</span>
                <span>{L(locale, 'dailyAgenda')}</span>
              </Link>
              <Link
                href={`/${locale}/trip/new/ai`}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[56px] items-center gap-3 rounded-2xl bg-coral-500 px-5 py-4 font-semibold text-white shadow-md"
              >
                <span className="text-xl" aria-hidden>✨</span>
                <span>{L(locale, 'planWithAI')}</span>
                <span className="ml-auto text-xs opacity-80">30s</span>
              </Link>
              <Link
                href={`/${locale}/trip/new`}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[56px] items-center gap-3 rounded-2xl border border-ink-200 bg-white px-5 py-4 font-semibold text-ink-800"
              >
                <span className="text-xl" aria-hidden>🗺</span>
                <span>{L(locale, 'multiDay')}</span>
              </Link>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-ink-400">
                {L(locale, 'popularDest')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {REGIONS_BY_CONTINENT.flatMap(c => c.regions).slice(0, 12).map(r => (
                  <Link
                    key={r.slug}
                    href={`/${locale}/${r.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-[44px] items-center gap-2 rounded-lg border border-ink-100 bg-white px-3 py-2.5 text-sm text-ink-700 transition hover:border-coral-300 hover:text-coral-700"
                  >
                    <span aria-hidden>{r.flag}</span>
                    <span className="truncate">{r.label}</span>
                  </Link>
                ))}
              </div>
              <Link
                href={`/${locale}/california`}
                onClick={() => setMobileOpen(false)}
                className="mt-3 block text-center text-sm font-semibold text-coral-600"
              >
                {L(locale, 'viewAll')}
              </Link>
            </div>

            <div className="border-t border-ink-100 pt-6">
              <div className="flex flex-col gap-1">
                <Link href={`/${locale}/blog`} onClick={() => setMobileOpen(false)} className="min-h-[44px] px-2 py-2 text-sm font-medium text-ink-700">Blog</Link>
                <a href="#pricing" onClick={() => setMobileOpen(false)} className="min-h-[44px] px-2 py-2 text-sm font-medium text-ink-700">{t('pricing')}</a>
              </div>
            </div>

            {/* S70: LocaleSwitcher + UserMenu movidos aquí para liberar espacio en el header mobile
                (antes competían con el hamburger en 375px → botón comprimido a 27px, sub-target táctil).
                Ahora hamburger = 44x44 (WCAG AA), y el usuario cambia idioma/sesión desde el panel abierto. */}
            <div className="mt-6 border-t border-ink-100 pt-6">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-ink-400">
                {L(locale, 'language')}
              </p>
              <LocaleSwitcher currentLocale={locale} variant="stacked" />
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-ink-100 pt-6">
              <UserMenu locale={locale} />
              <Link
                href={`/${locale}/trip/new/ai`}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[48px] items-center justify-center rounded-pill bg-ink-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink-700"
              >
                {t('getStarted')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
