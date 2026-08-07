'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import type { Locale } from '@/i18n/request';

export function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }){
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = (locale: Locale) => {
    if(locale === currentLocale) return;
    // Replace the leading /en or /es
    const newPath = pathname.replace(/^\/(en|es)/, `/${locale}`);
    startTransition(() => router.replace(newPath || `/${locale}`));
  };

  return (
    <div className="flex items-center gap-1 rounded-pill border border-ink-100 bg-white p-1 text-xs font-semibold">
      {(['en', 'es'] as Locale[]).map((loc) => (
        <button
          key={loc}
          onClick={() => switchTo(loc)}
          disabled={isPending}
          className={`rounded-pill px-2.5 py-1 uppercase tracking-wider transition ${
            currentLocale === loc ? 'bg-ink-900 text-white' : 'text-ink-500 hover:text-ink-800'
          }`}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
