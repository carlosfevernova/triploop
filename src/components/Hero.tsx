import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import { platformStats } from '@/lib/platform-stats';
import { L } from '@/lib/l4';

// S71g: 4-locale migration — replaced isEs ternaries with L() helper. PT-BR + DE-DE strings
// authored by Opus 4.7 (native-adjacent quality). Marked TRANSLATIONS_NEED_NATIVE_REVIEW for future audit.
// TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de

export async function Hero(){
  const locale = await getLocale();

  const title = {
    line1: L(locale, { en: 'Your road trip, planned.', es: 'Tu road trip, planeado.', pt: 'Sua road trip, planejada.', de: 'Dein Roadtrip, geplant.' }),
    line2: L(locale, { en: 'Not a spreadsheet.', es: 'No una hoja de cálculo.', pt: 'Não uma planilha.', de: 'Keine Tabellenkalkulation.' })
  };
  const subtitle = L(locale, {
    en: `Describe your trip in one sentence. AI returns an editable day × hour itinerary with real routes, offline maps and live collaboration. ${platformStats.regions} regions across ${platformStats.continents} continents — free to start, no signup.`,
    es: `Describe tu viaje en una frase. La IA devuelve un itinerario editable día × hora, con rutas reales, mapas offline y colaboración en vivo. ${platformStats.regions} regiones en ${platformStats.continents} continentes — gratis para empezar, sin registro.`,
    pt: `Descreva sua viagem em uma frase. A IA devolve um roteiro editável dia × hora, com rotas reais, mapas offline e colaboração ao vivo. ${platformStats.regions} regiões em ${platformStats.continents} continentes — grátis para começar, sem cadastro.`,
    de: `Beschreibe deine Reise in einem Satz. Die KI liefert einen bearbeitbaren Tag-für-Stunde-Reiseplan mit echten Routen, Offline-Karten und Live-Zusammenarbeit. ${platformStats.regions} Regionen auf ${platformStats.continents} Kontinenten — kostenlos starten, keine Anmeldung.`
  });

  const primaryCta = L(locale, { en: '🗓 Create your itinerary', es: '🗓 Crea tu itinerario', pt: '🗓 Crie seu roteiro', de: '🗓 Reiseplan erstellen' });
  const aiCta = L(locale, { en: '✨ Describe it to AI', es: '✨ Descríbelo a la IA', pt: '✨ Descreva para a IA', de: '✨ Beschreib es der KI' });
  const exploreCta = L(locale, { en: '🌍 Explore routes', es: '🌍 Explorar rutas', pt: '🌍 Explorar rotas', de: '🌍 Routen entdecken' });
  const liveBadge = L(locale, { en: 'Live · 100% free to start', es: 'Live · 100% gratis para empezar', pt: 'Live · 100% grátis para começar', de: 'Live · 100% kostenlos starten' });
  const trustCard = L(locale, { en: 'No credit card', es: 'Sin tarjeta', pt: 'Sem cartão', de: 'Keine Kreditkarte' });
  const trustOffline = L(locale, { en: 'Works offline', es: 'Funciona offline', pt: 'Funciona offline', de: 'Funktioniert offline' });
  const trustCollab = L(locale, { en: 'Real-time collab', es: 'Colaboración en tiempo real', pt: 'Colaboração em tempo real', de: 'Live-Zusammenarbeit' });

  const dayName = L(locale, { en: 'Tuesday', es: 'Martes', pt: 'Terça', de: 'Dienstag' });
  const dayNum = L(locale, { en: 'Day 3', es: 'Día 3', pt: 'Dia 3', de: 'Tag 3' });
  const stopsBadge = L(locale, { en: '6 stops', es: '6 paradas', pt: '6 paradas', de: '6 Stopps' });
  const breakfast = L(locale, { en: 'Hotel breakfast', es: 'Desayuno hotel', pt: 'Café da manhã no hotel', de: 'Hotelfrühstück' });
  const ramen = L(locale, { en: 'Ramen lunch', es: 'Comida ramen', pt: 'Almoço de ramen', de: 'Ramen-Mittagessen' });
  const matcha = L(locale, { en: 'Matcha tea', es: 'Té matcha', pt: 'Chá matcha', de: 'Matcha-Tee' });
  const statPlanned = L(locale, { en: 'Planned', es: 'Planeado', pt: 'Planejado', de: 'Geplant' });
  const statTravel = L(locale, { en: 'Travel', es: 'Traslados', pt: 'Traslados', de: 'Fahrten' });
  const statWalking = L(locale, { en: 'Walking', es: 'A pie', pt: 'A pé', de: 'Zu Fuß' });
  const badgeAi = L(locale, { en: 'AI-editable', es: 'IA editable', pt: 'IA editável', de: 'KI-bearbeitbar' });
  const badgeTraffic = L(locale, { en: 'Live traffic', es: 'Tráfico en vivo', pt: 'Trânsito ao vivo', de: 'Live-Verkehr' });

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-coral-50 via-white to-ocean-400/10" />
      <div className="grain absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1.15fr_1fr] md:py-28 lg:gap-16">
        {/* LEFT: Copy + CTAs */}
        <div className="flex flex-col justify-center">
          <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-pill border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            {liveBadge}
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

          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-ink-500">
            <span className="flex items-center gap-1.5"><span aria-hidden>✓</span> {trustCard}</span>
            <span className="flex items-center gap-1.5"><span aria-hidden>✓</span> {trustOffline}</span>
            <span className="flex items-center gap-1.5"><span aria-hidden>✓</span> {trustCollab}</span>
          </div>
        </div>

        <div className="relative">
          <div className="relative rounded-card border border-ink-100 bg-white p-5 shadow-card-hover">
            <div className="mb-4 flex items-center justify-between border-b border-ink-100 pb-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                  {dayName} · Oct 13
                </div>
                <div className="font-display text-sm font-semibold text-ink-900">
                  Kyoto · {dayNum}
                </div>
              </div>
              <span className="rounded-pill bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">
                {stopsBadge}
              </span>
            </div>

            <div className="space-y-1">
              {[
                { time: '08:00', title: breakfast, dur: '45m', emoji: '🍳', badge: null },
                { time: '09:00', title: 'Fushimi Inari', dur: '2h', emoji: '⛩️', badge: 'must' },
                { time: '11:30', title: ramen, dur: '1h', emoji: '🍜', badge: null },
                { time: '13:00', title: 'Gion district', dur: '2h', emoji: '📍', badge: null },
                { time: '15:30', title: matcha, dur: '1h', emoji: '🍵', badge: null },
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

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-ink-100 pt-3 text-center">
              <div>
                <div className="text-[9px] font-semibold uppercase tracking-wider text-ink-400">{statPlanned}</div>
                <div className="font-display text-sm font-semibold text-ink-900">8h 15m</div>
              </div>
              <div>
                <div className="text-[9px] font-semibold uppercase tracking-wider text-ink-400">{statTravel}</div>
                <div className="font-display text-sm font-semibold text-ink-900">55m</div>
              </div>
              <div>
                <div className="text-[9px] font-semibold uppercase tracking-wider text-ink-400">{statWalking}</div>
                <div className="font-display text-sm font-semibold text-ink-900">3.8 km</div>
              </div>
            </div>
          </div>

          <div className="absolute -right-4 -top-4 rounded-pill border border-ink-100 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 shadow-card">
            ✨ {badgeAi}
          </div>
          <div className="absolute -bottom-4 -left-4 rounded-pill border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-card">
            🚗 {badgeTraffic}
          </div>
        </div>
      </div>
    </section>
  );
}
