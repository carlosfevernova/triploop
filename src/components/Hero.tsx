import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import { platformStats } from '@/lib/platform-stats';

// S48 UX rediseño: Hero premium con 3 CTAs diferenciados por intent.
// Reemplaza el waitlist obsoleto (producto vive en producción desde S17+).
// Mockup ahora muestra Timeline day×time (feature core del Itinerary Engine S44+).

export async function Hero(){
  const locale = await getLocale();
  const isEs = locale === 'es';

  const title = isEs ? {
    line1: 'Tu road trip, planeado.',
    line2: 'No una hoja de cálculo.'
  } : {
    line1: 'Your road trip, planned.',
    line2: 'Not a spreadsheet.'
  };
  const subtitle = isEs
    ? `Describe tu viaje en una frase. La IA devuelve un itinerario editable día × hora, con rutas reales, mapas offline y colaboración en vivo. ${platformStats.regions} regiones en ${platformStats.continents} continentes — gratis para empezar, sin registro.`
    : `Describe your trip in one sentence. AI returns an editable day × hour itinerary with real routes, offline maps and live collaboration. ${platformStats.regions} regions across ${platformStats.continents} continents — free to start, no signup.`;

  const primaryCta = isEs ? '🗓 Crea tu itinerario' : '🗓 Create your itinerary';
  const aiCta = isEs ? '✨ Descríbelo a la IA' : '✨ Describe it to AI';
  const exploreCta = isEs ? '🌍 Explorar rutas' : '🌍 Explore routes';

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-coral-50 via-white to-ocean-400/10" />
      <div className="grain absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1.15fr_1fr] md:py-28 lg:gap-16">
        {/* LEFT: Copy + CTAs */}
        <div className="flex flex-col justify-center">
          {/* Live badge (replaces "waitlist" eyebrow) */}
          <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-pill border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            {isEs ? 'Live · 100% gratis para empezar' : 'Live · 100% free to start'}
          </span>

          <h1 className="font-display text-display-xl text-balance text-ink-900 md:text-display-2xl">
            {title.line1}
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 italic text-coral-600">{title.line2}</span>
              <span className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-coral-100/70" />
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600 text-balance">
            {subtitle}
          </p>

          {/* 3 CTAs — 3 intents claros */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={`/${locale}/trip/new`}
              className="group inline-flex items-center justify-center gap-2 rounded-pill bg-ink-900 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-ink-700 hover:shadow-card-hover"
            >
              {primaryCta}
              <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
            </Link>
            <Link
              href={`/${locale}/trip/new/ai`}
              className="group inline-flex items-center justify-center gap-2 rounded-pill border border-coral-400 bg-coral-500 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-coral-600"
            >
              {aiCta}
              <span aria-hidden className="text-xs opacity-80">30s</span>
            </Link>
            <Link
              href={`/${locale}/california`}
              className="inline-flex items-center justify-center gap-2 rounded-pill border border-ink-300 bg-white px-6 py-3 text-sm font-semibold text-ink-800 transition hover:border-ink-500 hover:shadow-card"
            >
              {exploreCta}
            </Link>
          </div>

          {/* Trust row (no email required) */}
          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-ink-500">
            <span className="flex items-center gap-1.5">
              <span aria-hidden>✓</span> {isEs ? 'Sin tarjeta' : 'No credit card'}
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden>✓</span> {isEs ? 'Funciona offline' : 'Works offline'}
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden>✓</span> {isEs ? 'Colaboración en tiempo real' : 'Real-time collab'}
            </span>
          </div>
        </div>

        {/* RIGHT: Timeline mockup (Itinerary Engine core feature) */}
        <div className="relative">
          <div className="relative rounded-card border border-ink-100 bg-white p-5 shadow-card-hover">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b border-ink-100 pb-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                  {isEs ? 'Martes' : 'Tuesday'} · Oct 13
                </div>
                <div className="font-display text-sm font-semibold text-ink-900">
                  Kyoto · {isEs ? 'Día 3' : 'Day 3'}
                </div>
              </div>
              <span className="rounded-pill bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">
                {isEs ? '6 paradas' : '6 stops'}
              </span>
            </div>

            {/* Timeline items */}
            <div className="space-y-1">
              {[
                { time: '08:00', title: isEs ? 'Desayuno hotel' : 'Hotel breakfast', dur: '45m', emoji: '🍳', badge: null },
                { time: '09:00', title: 'Fushimi Inari', dur: '2h', emoji: '⛩️', badge: 'must' },
                { time: '11:30', title: isEs ? 'Comida ramen' : 'Ramen lunch', dur: '1h', emoji: '🍜', badge: null },
                { time: '13:00', title: 'Gion district', dur: '2h', emoji: '📍', badge: null },
                { time: '15:30', title: isEs ? 'Té matcha' : 'Matcha tea', dur: '1h', emoji: '🍵', badge: null },
                { time: '17:00', title: 'Kiyomizu-dera', dur: '1h30', emoji: '🏯', badge: 'must' }
              ].map((item, i, arr) => (
                <div key={item.time}>
                  <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-ink-50/60">
                    <div className="w-11 shrink-0 text-right text-[11px] tabular-nums font-semibold text-ink-800">{item.time}</div>
                    <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-coral-500 text-[10px] font-bold text-white">{i + 1}</div>
                    <span className="text-sm" aria-hidden>{item.emoji}</span>
                    <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink-900">{item.title}</span>
                    {item.badge === 'must' && <span className="text-[10px]" title="Must">⭐</span>}
                    <span className="text-[10px] text-ink-400">{item.dur}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="ml-14 flex items-center gap-1.5 py-0.5 text-[10px] text-ink-400">
                      <span aria-hidden className="text-ink-300">│</span>
                      <span>{i === 0 ? '15 min 🚶' : i === 2 ? '10 min 🚶' : i === 4 ? '18 min 🚗' : '12 min 🚶'}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer stats */}
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-ink-100 pt-3 text-center">
              <div>
                <div className="text-[9px] font-semibold uppercase tracking-wider text-ink-400">{isEs ? 'Planeado' : 'Planned'}</div>
                <div className="font-display text-sm font-semibold text-ink-900">8h 15m</div>
              </div>
              <div>
                <div className="text-[9px] font-semibold uppercase tracking-wider text-ink-400">{isEs ? 'Traslados' : 'Travel'}</div>
                <div className="font-display text-sm font-semibold text-ink-900">55m</div>
              </div>
              <div>
                <div className="text-[9px] font-semibold uppercase tracking-wider text-ink-400">{isEs ? 'A pie' : 'Walking'}</div>
                <div className="font-display text-sm font-semibold text-ink-900">3.8 km</div>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="absolute -right-4 -top-4 rounded-pill border border-ink-100 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 shadow-card">
            ✨ {isEs ? 'IA editable' : 'AI-editable'}
          </div>
          <div className="absolute -bottom-4 -left-4 rounded-pill border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-card">
            🚗 {isEs ? 'Tráfico en vivo' : 'Live traffic'}
          </div>
        </div>
      </div>
    </section>
  );
}
