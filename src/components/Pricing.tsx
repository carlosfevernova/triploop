'use client';
import { useTranslations } from 'next-intl';

export function Pricing(){
  const t = useTranslations('pricing');
  const free = t.raw('free') as { name: string; price: string; period: string; cta: string; features: string[] };
  const pro = t.raw('pro') as { name: string; price: string; period: string; badge: string; cta: string; features: string[] };
  return (
    <section id="pricing" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="font-display text-display-lg text-ink-900 text-balance">{t('title')}</h2>
          <p className="mt-4 text-lg text-ink-500 text-balance">{t('subtitle')}</p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Free */}
          <div className="rounded-card border border-ink-100 bg-white p-10">
            <h3 className="font-display text-xl font-semibold text-ink-900">{free.name}</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-5xl font-semibold text-ink-900">{free.price}</span>
              <span className="text-sm text-ink-500">{free.period}</span>
            </div>
            <ul className="mt-8 space-y-3">
              {free.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-0.5 text-emerald-500">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button className="mt-10 w-full rounded-pill border border-ink-200 bg-white py-3 text-sm font-semibold text-ink-800 transition hover:border-ink-800">
              {free.cta}
            </button>
          </div>

          {/* Pro */}
          <div className="relative rounded-card border-2 border-coral-500 bg-white p-10 shadow-card-hover">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill bg-coral-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
              {pro.badge}
            </span>
            <h3 className="font-display text-xl font-semibold text-ink-900">{pro.name}</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-5xl font-semibold text-ink-900">{pro.price}</span>
              <span className="text-sm text-ink-500">{pro.period}</span>
            </div>
            <ul className="mt-8 space-y-3">
              {pro.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-0.5 text-coral-500">✦</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button className="mt-10 w-full rounded-pill bg-coral-500 py-3 text-sm font-semibold text-white transition hover:bg-coral-600 hover:shadow-glow">
              {pro.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
