'use client';
import { useTranslations } from 'next-intl';

export function Footer(){
  const t = useTranslations('footer');
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-ink-100 bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-ink-800">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-coral-500 to-coral-600 text-white">
                <span className="font-display font-semibold">t</span>
              </div>
              <span className="font-display text-xl font-semibold">TripLoop</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
              {t('tagline')}
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-400">{t('product')}</h4>
            <ul className="space-y-2 text-sm text-ink-600">
              <li><a href="#features" className="hover:text-ink-900">{t('features')}</a></li>
              <li><a href="#pricing" className="hover:text-ink-900">{t('pricing')}</a></li>
              <li><a href="#" className="hover:text-ink-900">{t('changelog')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-400">{t('company')}</h4>
            <ul className="space-y-2 text-sm text-ink-600">
              <li><a href="#" className="hover:text-ink-900">{t('about')}</a></li>
              <li><a href="#" className="hover:text-ink-900">{t('blog')}</a></li>
              <li><a href="#" className="hover:text-ink-900">{t('contact')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-400">{t('legal')}</h4>
            <ul className="space-y-2 text-sm text-ink-600">
              <li><a href="#" className="hover:text-ink-900">{t('terms')}</a></li>
              <li><a href="#" className="hover:text-ink-900">{t('privacy')}</a></li>
              <li><a href="#" className="hover:text-ink-900">{t('affiliate')}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-ink-100 pt-6 text-center text-xs text-ink-400">
          {t('copyright', { year })}
        </div>
      </div>
    </footer>
  );
}
