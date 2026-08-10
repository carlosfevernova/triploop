'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { locales, type Locale } from '@/i18n/request';

const LOCALE_PREFIX_RE = new RegExp(`^/(${locales.join('|')})(?=/|$)`);

export function LocaleSwitcher({
  currentLocale,
  variant = 'inline'
}: {
  currentLocale: Locale;
  variant?: 'inline' | 'stacked';
}){
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = (locale: Locale) => {
    if(locale === currentLocale) return;
    const newPath = pathname.replace(LOCALE_PREFIX_RE, `/${locale}`);
    startTransition(() => router.replace(newPath || `/${locale}`));
  };

  const containerClasses = variant === 'stacked'
    ? 'flex flex-wrap items-center gap-2'
    : 'flex items-center gap-1 rounded-pill border border-ink-100 bg-white p-1 text-xs font-semibold';

  const buttonClasses = (active: boolean) => variant === 'stacked'
    ? `min-h-[44px] flex-1 rounded-xl border px-3 py-2 text-sm font-semibold uppercase tracking-wider transition ${
        active
          ? 'border-ink-900 bg-ink-900 text-white'
          : 'border-ink-200 bg-white text-ink-700 hover:border-coral-400 hover:text-coral-700'
      }`
    : `rounded-pill px-2.5 py-1 uppercase tracking-wider transition ${
        active ? 'bg-ink-900 text-white' : 'text-ink-500 hover:text-ink-800'
      }`;

  return (
    <div className={containerClasses}>
      {locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchTo(loc)}
          disabled={isPending}
          aria-current={currentLocale === loc ? 'true' : undefined}
          className={buttonClasses(currentLocale === loc)}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
