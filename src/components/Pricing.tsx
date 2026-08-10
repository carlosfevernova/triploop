import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface Props { locale: string }

const TRUST_MARKERS = {
  en: ['No credit card to start', 'Cancel anytime', '14-day Pro free trial'],
  es: ['Sin tarjeta para empezar', 'Cancela cuando quieras', '14 días de Pro gratis'],
  pt: ['Sem cartão para começar', 'Cancele quando quiser', '14 dias de Pro grátis'],
  de: ['Ohne Karte starten', 'Jederzeit kündbar', '14 Tage Pro kostenlos']
};

// Server Component — cero JS al bundle inicial
// S102 — visual polish: gradient bg, Pro glow, badge accent, feature icons más premium
export async function Pricing({ locale }: Props){
  const t = await getTranslations('pricing');
  const free = t.raw('free') as { name: string; price: string; period: string; cta: string; features: string[] };
  const pro = t.raw('pro') as { name: string; price: string; period: string; badge: string; cta: string; features: string[] };

  return (
    <section id="pricing" className="relative overflow-hidden bg-gradient-to-b from-white via-coral-50/30 to-white py-28">
      {/* Ambient glow behind Pro card */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-96 w-96 translate-x-40 rounded-full bg-coral-200/40 blur-3xl md:h-[500px] md:w-[500px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-coral-600">
            {t('title').includes('Free forever') || t('title').includes('gratis') ? '' : ''}
            Pricing
          </p>
          <h2 className="font-display text-display-lg text-ink-900 text-balance">{t('title')}</h2>
          <p className="mt-4 text-lg text-ink-500 text-balance">{t('subtitle')}</p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {/* FREE tier */}
          <div className="group relative rounded-card border border-ink-100 bg-white p-10 transition duration-300 hover:-translate-y-1 hover:border-ink-300 hover:shadow-card-hover">
            <h3 className="font-display text-xl font-semibold text-ink-900">{free.name}</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-5xl font-semibold text-ink-900">{free.price}</span>
              <span className="text-sm text-ink-500">{free.period}</span>
            </div>
            <ul className="mt-8 space-y-3">
              {free.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-ink-700">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-50 text-[11px] text-emerald-600" aria-hidden>✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/${locale}/trip/new`}
              className="mt-10 block w-full rounded-pill border border-ink-200 bg-white py-3 text-center text-sm font-semibold text-ink-800 transition hover:border-ink-800"
            >
              {free.cta}
            </Link>
          </div>

          {/* PRO tier — featured */}
          <div className="group relative rounded-card border-2 border-coral-500 bg-white p-10 shadow-card-hover transition duration-300 hover:-translate-y-1 hover:shadow-glow" style={{ boxShadow: '0 0 0 1px rgba(255,90,95,.08), 0 12px 40px -12px rgba(255,90,95,.35)' }}>
            {/* Diagonal shimmer overlay */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-card">
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-coral-50/60 to-transparent" />
            </div>
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill bg-gradient-to-r from-coral-500 to-coral-600 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
              ⭐ {pro.badge}
            </span>

            <div className="relative">
              <h3 className="font-display text-xl font-semibold text-coral-600">{pro.name}</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-5xl font-semibold text-ink-900">{pro.price}</span>
                <span className="text-sm text-ink-500">{pro.period}</span>
              </div>
              <ul className="mt-8 space-y-3">
                {pro.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-ink-700">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-coral-100 text-[11px] text-coral-600" aria-hidden>✦</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/${locale}/pricing/upgrade`}
                data-magnetic
                className="mt-10 block w-full rounded-pill bg-gradient-to-r from-coral-500 to-coral-600 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:shadow-glow"
              >
                {pro.cta}
              </Link>
            </div>
          </div>
        </div>

        {/* Trust markers below — bilingual */}
        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center text-xs text-ink-500">
          {(TRUST_MARKERS[locale as keyof typeof TRUST_MARKERS] || TRUST_MARKERS.en).map((m) => (
            <span key={m} className="inline-flex items-center gap-1.5"><span className="text-emerald-500">✓</span> {m}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
