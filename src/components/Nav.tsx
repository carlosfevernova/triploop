'use client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from './LocaleSwitcher';
import { UserMenu } from './UserMenu';
import type { Locale } from '@/i18n/request';

export function Nav({ locale }: { locale: Locale }){
  const t = useTranslations('nav');
  return (
    <header className="glass sticky top-0 z-40 border-b border-ink-100/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href={`/${locale}`} className="flex items-center gap-2 text-ink-800">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-coral-500 to-coral-600 text-white shadow-glow">
            <span className="font-display font-semibold">t</span>
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">TripLoop</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link href={`/${locale}/california`} className="text-sm font-medium text-ink-500 transition hover:text-ink-800">{locale === 'es' ? 'Rutas' : 'Trips'}</Link>
          <Link href={`/${locale}/blog`} className="text-sm font-medium text-ink-500 transition hover:text-ink-800">Blog</Link>
          <a href="#pricing" className="text-sm font-medium text-ink-500 transition hover:text-ink-800">{t('pricing')}</a>
        </nav>
        <div className="flex items-center gap-3">
          <LocaleSwitcher currentLocale={locale} />
          <UserMenu locale={locale} />
          <Link
            href={`/${locale}/trip/new`}
            className="rounded-pill bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-700"
          >
            {t('getStarted')}
          </Link>
        </div>
      </div>
    </header>
  );
}
