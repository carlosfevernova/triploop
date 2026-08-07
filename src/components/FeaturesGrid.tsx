'use client';
import { useTranslations } from 'next-intl';

export function FeaturesGrid(){
  const t = useTranslations('features');
  const items = t.raw('items') as Array<{ title: string; body: string }>;
  return (
    <section id="features" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mx-auto max-w-3xl text-center font-display text-display-lg text-ink-900 text-balance">
          {t('title')}
        </h2>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="group rounded-card border border-ink-100 bg-white p-8 transition hover:border-coral-200 hover:shadow-card"
            >
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-coral-50 font-display text-sm font-semibold text-coral-600 group-hover:bg-coral-500 group-hover:text-white transition">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="mb-3 font-display text-xl font-semibold text-ink-900">{item.title}</h3>
              <p className="text-sm leading-relaxed text-ink-500">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
