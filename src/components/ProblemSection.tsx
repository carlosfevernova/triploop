'use client';
import { useTranslations } from 'next-intl';

export function ProblemSection(){
  const t = useTranslations('problem');
  const items = t.raw('items') as Array<{ emoji: string; title: string; body: string }>;
  return (
    <section className="border-y border-ink-100 bg-ink-900 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mx-auto max-w-3xl text-center font-display text-display-lg text-balance">
          {t('title')}
        </h2>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-card border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="mb-4 text-4xl">{item.emoji}</div>
              <h3 className="mb-3 font-display text-2xl font-semibold text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-ink-300">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
