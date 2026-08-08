import { getTranslations } from 'next-intl/server';
import { WaitlistForm } from './WaitlistForm';

// Server Component: only WaitlistForm es client
export async function Hero(){
  const t = await getTranslations('hero');

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-coral-50 via-white to-ocean-400/10" />
      <div className="grain absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 md:grid-cols-[1.15fr_1fr] md:py-32">
        {/* LEFT: Copy */}
        <div className="flex flex-col justify-center">
          <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-pill border border-coral-200 bg-coral-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-coral-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-coral-500" />
            {t('eyebrow')}
          </span>

          <h1 className="font-display text-display-xl text-balance text-ink-900 md:text-display-2xl">
            {t('titlePart1')}{' '}
            <span className="relative inline-block">
              <span className="relative z-10 italic text-coral-600">{t('titlePart2')}</span>
              <span className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-coral-100/70" />
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-500 text-balance">
            {t('subtitle')}
          </p>

          <WaitlistForm
            placeholder={t('emailPlaceholder')}
            buttonLabel={t('emailButton')}
            successLabel={t('emailSuccess')}
            errorLabel={t('emailError')}
          />

          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2" aria-hidden>
              {['bg-coral-400','bg-ocean-500','bg-emerald-400','bg-amber-400'].map((c, i) => (
                <div key={i} className={`h-8 w-8 rounded-full border-2 border-white ${c}`} />
              ))}
            </div>
            <span className="text-xs font-medium text-ink-500">{t('trustPill')}</span>
          </div>
        </div>

        {/* RIGHT: Visual mockup — pure server-rendered, cero JS */}
        <div className="relative">
          <div className="relative rounded-card border border-ink-100 bg-white p-6 shadow-card-hover">
            <div className="mb-4 flex items-center justify-between border-b border-ink-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-coral-500" />
                <span className="font-display text-sm font-semibold text-ink-800">California Grand Loop</span>
              </div>
              <span className="rounded-pill bg-ink-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-500">14 days</span>
            </div>

            <div className="space-y-3">
              {[
                { day: 1, from: 'LAX', to: 'Santa Monica', dist: '25 km / 15 mi', time: '45 min' },
                { day: 2, from: 'Los Angeles', to: 'Big Sur', dist: '505 km / 314 mi', time: '6h 20m' },
                { day: 4, from: 'Big Sur', to: 'San Francisco', dist: '225 km / 140 mi', time: '3h 15m' },
                { day: 7, from: 'San Francisco', to: 'Yosemite Valley', dist: '340 km / 211 mi', time: '4h 30m' },
                { day: 11, from: 'Yosemite', to: 'Las Vegas', dist: '655 km / 407 mi', time: '8h 10m' }
              ].map((leg) => (
                <div key={leg.day} className="flex items-center gap-3 rounded-lg bg-ink-50/50 p-3 transition hover:bg-coral-50">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-white text-xs font-semibold text-ink-700 shadow-card">
                    {leg.day}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-ink-800">{leg.from} → {leg.to}</div>
                    <div className="text-xs text-ink-500">{leg.dist} · {leg.time}</div>
                  </div>
                  <div className="text-xs text-emerald-600">Traffic OK</div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-ink-100 pt-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">Total (with tax)</div>
                <div className="font-display text-2xl font-semibold text-ink-900">$3,142 USD</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">Drive time</div>
                <div className="font-display text-2xl font-semibold text-ink-900">31h</div>
              </div>
            </div>
          </div>

          <div className="absolute -right-6 -top-6 rounded-pill border border-ink-100 bg-white px-4 py-2 text-xs font-semibold text-ink-700 shadow-card">
            🚗 Optimized · saves 4h vs Google
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-pill border border-ink-100 bg-white px-4 py-2 text-xs font-semibold text-ink-700 shadow-card">
            💰 Prices include CA tax
          </div>
        </div>
      </div>
    </section>
  );
}
