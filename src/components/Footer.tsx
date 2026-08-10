'use client';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// S102 — premium redesign: gradient bg, brand CTA col-1, trust markers row, better hover
export function Footer(){
  const t = useTranslations('footer');
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';
  const year = new Date().getFullYear();
  const isEs = locale === 'es';

  return (
    <footer className="relative border-t border-ink-100 bg-gradient-to-b from-white to-ink-50/60 py-20">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-coral-500/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand column with CTA */}
          <div className="md:col-span-1">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-ink-800">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 text-white shadow-md">
                <span className="font-display text-lg font-semibold">t</span>
              </div>
              <span className="font-display text-xl font-semibold">TripLoop</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
              {t('tagline')}
            </p>
            <Link
              href={`/${locale}/trip/new/ai`}
              className="mt-5 inline-flex items-center gap-2 rounded-pill bg-ink-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-ink-700 hover:shadow-md"
            >
              <span aria-hidden>✨</span>
              {isEs ? 'Planea con IA' : 'Plan with AI'}
              <span aria-hidden className="text-[10px] opacity-70">30s</span>
            </Link>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-400">{t('product')}</h4>
            <ul className="space-y-2.5 text-sm text-ink-600">
              <li><a href="#features" className="transition hover:text-coral-600">{t('features')}</a></li>
              <li><a href="#pricing" className="transition hover:text-coral-600">{t('pricing')}</a></li>
              <li><a href={`/${locale}/changelog`} className="transition hover:text-coral-600">{t('changelog')}</a></li>
              <li><a href={`/${locale}/agenda`} className="transition hover:text-coral-600">{isEs ? 'Agenda diaria' : 'Daily agenda'}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-400">{t('company')}</h4>
            <ul className="space-y-2.5 text-sm text-ink-600">
              <li><a href={`/${locale}/about`} className="transition hover:text-coral-600">{t('about')}</a></li>
              <li><a href={`/${locale}/blog`} className="transition hover:text-coral-600">{t('blog')}</a></li>
              <li><a href={`/${locale}/whatsapp`} className="transition hover:text-coral-600">WhatsApp</a></li>
              <li><a href="mailto:hello@triploop.app" className="transition hover:text-coral-600">{t('contact')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-400">{t('legal')}</h4>
            <ul className="space-y-2.5 text-sm text-ink-600">
              <li><a href={`/${locale}/terms`} className="transition hover:text-coral-600">{t('terms')}</a></li>
              <li><a href={`/${locale}/privacy`} className="transition hover:text-coral-600">{t('privacy')}</a></li>
              <li><a href={`/${locale}/affiliate-disclosure`} className="transition hover:text-coral-600">{t('affiliate')}</a></li>
            </ul>
          </div>
        </div>

        {/* Trust markers row */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-ink-100 bg-white/60 px-6 py-4 text-center text-xs font-medium text-ink-500 backdrop-blur">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            <span>{isEs ? '24 regiones' : '24 regions'}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-coral-500" aria-hidden />
            <span>{isEs ? '7 continentes' : '7 continents'}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-ocean-500" aria-hidden />
            <span>{isEs ? '60 rutas curadas' : '60 curated routes'}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            <span>{isEs ? 'Bilingüe EN + ES' : 'Bilingual EN + ES'}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-coral-500" aria-hidden />
            <span>{isEs ? 'Offline PWA' : 'Offline PWA'}</span>
          </span>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-ink-100 pt-6 text-xs text-ink-400 sm:flex-row">
          <span>{t('copyright', { year })}</span>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">{isEs ? 'Hecho con ☕ en LATAM' : 'Made with ☕ in LATAM'}</span>
            <a href="/admin/login" className="transition hover:text-ink-800">Admin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
