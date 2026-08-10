'use client';
import { L } from '@/lib/l4';
import type { Locale } from '@/i18n/request';

// S71g pass 2: full 4-locale rows. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
type LangStr = Record<Locale, string>;

interface Row {
  feature: LangStr;
  triploop: string | boolean;
  wanderlog: string | boolean;
  layla: string | boolean;
  tripit: string | boolean;
  google_my_maps: string | boolean;
  highlight?: boolean;
}

const ROWS: Row[] = [
  { feature: {
    en: 'AI Trip Generator (natural language)',
    es: 'AI Trip Generator (lenguaje natural)',
    pt: 'Gerador de Viagem com IA (linguagem natural)',
    de: 'KI-Reiseplaner (natürliche Sprache)'
  }, triploop: 'Free · 6 providers + SSE stream', wanderlog: false, layla: '$49/yr', tripit: false, google_my_maps: false, highlight: true },
  { feature: {
    en: 'Streaming SSE (stops appear live on map)',
    es: 'Streaming SSE (stops en vivo en mapa)',
    pt: 'Streaming SSE (paradas ao vivo no mapa)',
    de: 'Streaming SSE (Stopps live auf Karte)'
  }, triploop: 'Server-Sent Events', wanderlog: false, layla: false, tripit: false, google_my_maps: false, highlight: true },
  { feature: {
    en: 'Curated-first matcher (0 tokens if match)',
    es: 'Curated-first matcher (0 tokens si match)',
    pt: 'Matcher curated-first (0 tokens se combina)',
    de: 'Curated-first Matcher (0 Tokens bei Treffer)'
  }, triploop: '229 POIs + 46 templates', wanderlog: false, layla: false, tripit: false, google_my_maps: false, highlight: true },
  { feature: {
    en: 'Regions covered (worldwide)',
    es: 'Regiones cubiertas (mundial)',
    pt: 'Regiões cobertas (mundial)',
    de: 'Abgedeckte Regionen (weltweit)'
  }, triploop: '24 · 7 continents', wanderlog: 'Global (unstructured)', layla: 'Global (AI-generated)', tripit: 'Global', google_my_maps: 'Global', highlight: true },
  { feature: {
    en: 'Iconic route templates verified',
    es: 'Templates rutas icónicas verificadas',
    pt: 'Templates de rotas icônicas verificadas',
    de: 'Verifizierte ikonische Routen-Templates'
  }, triploop: '46 curated', wanderlog: 'Community-crowd', layla: 'AI-generated', tripit: false, google_my_maps: false, highlight: true },
  { feature: {
    en: 'Highway names visible (US-101, PCH, NC500)',
    es: 'Nombres highway visible (US-101, PCH, NC500)',
    pt: 'Nomes de rodovia visíveis (US-101, PCH, NC500)',
    de: 'Autobahnnamen sichtbar (US-101, PCH, NC500)'
  }, triploop: true, wanderlog: false, layla: false, tripit: false, google_my_maps: 'Auto-map', highlight: true },
  { feature: {
    en: 'Flight-Delay Reshuffle (AI)',
    es: 'Reorganización por vuelo (IA)',
    pt: 'Reorganização por atraso de voo (IA)',
    de: 'Umplanung bei Flugverspätung (KI)'
  }, triploop: true, wanderlog: false, layla: false, tripit: false, google_my_maps: false, highlight: true },
  { feature: {
    en: 'Multilingual EN·ES·PT·DE (native SEO)',
    es: 'Multilingüe EN·ES·PT·DE (SEO nativo)',
    pt: 'Multilíngue EN·ES·PT·DE (SEO nativo)',
    de: 'Mehrsprachig EN·ES·PT·DE (native SEO)'
  }, triploop: true, wanderlog: 'EN only', layla: 'EN only', tripit: 'EN only', google_my_maps: true, highlight: true },
  { feature: {
    en: 'WhatsApp bot',
    es: 'Bot WhatsApp',
    pt: 'Bot WhatsApp',
    de: 'WhatsApp-Bot'
  }, triploop: 'AI-powered', wanderlog: false, layla: false, tripit: false, google_my_maps: false, highlight: true },
  { feature: {
    en: 'Embeddable widget',
    es: 'Widget embebible',
    pt: 'Widget incorporável',
    de: 'Einbettbares Widget'
  }, triploop: true, wanderlog: false, layla: false, tripit: false, google_my_maps: false, highlight: true },
  { feature: {
    en: 'Budget calculator (real 2026 data)',
    es: 'Calculadora presupuestos (datos 2026)',
    pt: 'Calculadora de orçamento (dados 2026)',
    de: 'Budgetrechner (echte 2026-Daten)'
  }, triploop: true, wanderlog: false, layla: 'Hotels only', tripit: false, google_my_maps: false },
  { feature: {
    en: 'AI warnings + local tips',
    es: 'Alertas IA + tips locales',
    pt: 'Alertas de IA + dicas locais',
    de: 'KI-Warnungen + lokale Tipps'
  }, triploop: true, wanderlog: false, layla: false, tripit: false, google_my_maps: false },
  { feature: {
    en: 'Smart packing checklist AI',
    es: 'Lista de empaque IA',
    pt: 'Lista de bagagem com IA',
    de: 'Intelligente Packliste (KI)'
  }, triploop: true, wanderlog: false, layla: false, tripit: false, google_my_maps: false },
  { feature: {
    en: 'Photo spots (worth-it rated)',
    es: 'Spots de foto (rated)',
    pt: 'Pontos fotográficos (avaliados)',
    de: 'Foto-Spots (bewertet)'
  }, triploop: true, wanderlog: false, layla: false, tripit: false, google_my_maps: false },
  { feature: {
    en: 'EV chargers on route',
    es: 'Cargadores EV en ruta',
    pt: 'Carregadores EV na rota',
    de: 'E-Ladestationen auf Route'
  }, triploop: '8 countries', wanderlog: false, layla: false, tripit: false, google_my_maps: false },
  { feature: {
    en: 'Realtime collaboration',
    es: 'Colaboración tiempo real',
    pt: 'Colaboração em tempo real',
    de: 'Echtzeit-Zusammenarbeit'
  }, triploop: 'Free', wanderlog: '$39/yr', layla: false, tripit: 'Pro', google_my_maps: 'Basic' },
  { feature: {
    en: 'Real drive times with traffic',
    es: 'Tiempos reales con tráfico',
    pt: 'Tempos de direção reais com trânsito',
    de: 'Echte Fahrzeiten mit Verkehr'
  }, triploop: true, wanderlog: true, layla: true, tripit: false, google_my_maps: 'Partial' },
  { feature: {
    en: 'Tax-included prices',
    es: 'Precios con impuestos',
    pt: 'Preços com impostos incluídos',
    de: 'Preise inkl. Steuern'
  }, triploop: true, wanderlog: false, layla: false, tripit: false, google_my_maps: false },
  { feature: {
    en: 'Metric ↔ Imperial toggle',
    es: 'Toggle km ↔ millas',
    pt: 'Alternar km ↔ milhas',
    de: 'Metrisch ↔ Imperial umschalten'
  }, triploop: true, wanderlog: false, layla: false, tripit: false, google_my_maps: false },
  { feature: {
    en: 'Public trip templates SEO',
    es: 'Templates públicos SEO',
    pt: 'Templates públicos SEO',
    de: 'Öffentliche Reise-Templates SEO'
  }, triploop: '24 × 4 langs', wanderlog: 'Community', layla: false, tripit: false, google_my_maps: false },
  { feature: {
    en: 'Blog editorial (SEO)',
    es: 'Blog editorial (SEO)',
    pt: 'Blog editorial (SEO)',
    de: 'Redaktionelles Blog (SEO)'
  }, triploop: '16 posts', wanderlog: 'Company', layla: 'Company', tripit: false, google_my_maps: false },
  { feature: {
    en: 'Offline PWA maps',
    es: 'Mapas offline PWA',
    pt: 'Mapas offline PWA',
    de: 'Offline-PWA-Karten'
  }, triploop: 'Pro', wanderlog: 'Pro', layla: false, tripit: 'Pro', google_my_maps: false },
  { feature: {
    en: 'PDF export print-ready',
    es: 'PDF export imprimible',
    pt: 'Exportação PDF para impressão',
    de: 'PDF-Export druckfertig'
  }, triploop: 'Pro', wanderlog: 'Pro', layla: false, tripit: 'Pro', google_my_maps: false },
  { feature: {
    en: 'One-tap hotel/tour booking',
    es: 'Reservas 1 clic',
    pt: 'Reservas com 1 toque',
    de: 'Hotel-/Tour-Buchung mit einem Klick'
  }, triploop: 'Booking + GYG', wanderlog: 'Booking', layla: 'Skyscanner', tripit: false, google_my_maps: false },
  { feature: {
    en: 'Regions covered',
    es: 'Regiones cubiertas',
    pt: 'Regiões cobertas',
    de: 'Abgedeckte Regionen'
  }, triploop: '24 · 7 continents', wanderlog: 'Global', layla: 'Global', tripit: 'Global', google_my_maps: 'Global' },
  { feature: {
    en: 'Price',
    es: 'Precio',
    pt: 'Preço',
    de: 'Preis'
  }, triploop: 'Free / $6.99', wanderlog: 'Free / $40/yr', layla: '$49/yr', tripit: 'Free / $49/yr', google_my_maps: 'Free' }
];

const COMPETITORS = [
  { key: 'triploop', name: 'TripLoop', accent: true, url: null },
  { key: 'wanderlog', name: 'Wanderlog', accent: false, url: 'https://wanderlog.com' },
  { key: 'layla', name: 'Layla', accent: false, url: 'https://layla.ai' },
  { key: 'tripit', name: 'TripIt', accent: false, url: 'https://tripit.com' },
  { key: 'google_my_maps', name: 'Google My Maps', accent: false, url: 'https://mymaps.google.com' }
];

export function Comparison({ locale: localeProp, isEs: isEsProp }: { locale?: string; isEs?: boolean }){
  const locale = localeProp || (isEsProp ? 'es' : 'en');
  const eyebrow = L(locale, {
    en: 'Honest comparison · verified August 2026',
    es: 'Comparación honesta · verificado agosto 2026',
    pt: 'Comparação honesta · verificado em agosto de 2026',
    de: 'Ehrlicher Vergleich · verifiziert im August 2026'
  });
  const heading = L(locale, {
    en: 'TripLoop vs the big players',
    es: 'TripLoop vs los grandes',
    pt: 'TripLoop vs os grandes',
    de: 'TripLoop vs. die Großen'
  });
  const description = L(locale, {
    en: 'We audited the 4 most-cited apps in 2026 travel AI tier-lists (Layla, MonkeyTravel, Voyaige). Highlighted rows = our unique features.',
    es: 'Auditamos las 4 apps más citadas en tier-list travel AI 2026 (Layla, MonkeyTravel, Voyaige). Filas resaltadas = features únicas nuestras.',
    pt: 'Auditamos os 4 apps mais citados em tier-lists de viagem com IA em 2026 (Layla, MonkeyTravel, Voyaige). Linhas destacadas = features exclusivas nossas.',
    de: 'Wir haben die 4 meistgenannten Apps in 2026-Travel-AI-Rankings (Layla, MonkeyTravel, Voyaige) geprüft. Hervorgehobene Zeilen = unsere exklusiven Features.'
  });
  const swipeHint = L(locale, {
    en: 'Swipe to see full table',
    es: 'Desliza para ver la tabla completa',
    pt: 'Deslize para ver a tabela completa',
    de: 'Wischen, um die ganze Tabelle zu sehen'
  });
  const featureCol = L(locale, { en: 'Feature', es: 'Feature', pt: 'Recurso', de: 'Funktion' });
  const uniqueTitle = L(locale, { en: 'TripLoop only', es: 'Único TripLoop', pt: 'Exclusivo TripLoop', de: 'Nur TripLoop' });
  const footnote = L(locale, {
    en: 'Data from official sites and 2026 tier-lists (Layla, Voyaige, MonkeyTravel). Competitor pricing and features may change.',
    es: 'Datos de sitios oficiales y tier-lists 2026 (Layla, Voyaige, MonkeyTravel). Precios y features de competidores pueden cambiar.',
    pt: 'Dados de sites oficiais e tier-lists de 2026 (Layla, Voyaige, MonkeyTravel). Preços e recursos dos concorrentes podem mudar.',
    de: 'Daten von offiziellen Seiten und 2026-Rankings (Layla, Voyaige, MonkeyTravel). Preise und Features der Wettbewerber können sich ändern.'
  });

  return (
    <section className="border-t border-ink-100 bg-gradient-to-br from-white to-ink-50/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-coral-600">{eyebrow}</p>
          <h2 className="font-display text-display-md text-ink-900 md:text-display-lg">{heading}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-500 text-balance">{description}</p>
        </div>
        <p className="mb-3 flex items-center justify-center gap-2 text-[11px] font-medium text-ink-400 md:hidden">
          <span aria-hidden>↔</span>
          {swipeHint}
        </p>
        <div className="overflow-x-auto rounded-card border border-ink-100 bg-white shadow-card-hover">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-ink-200 bg-gradient-to-br from-ink-50 to-white">
                <th className="sticky left-0 z-10 w-[32%] bg-white px-4 py-4 text-left font-display text-xs font-semibold uppercase tracking-wider text-ink-500">
                  {featureCol}
                </th>
                {COMPETITORS.map(c => (
                  <th key={c.key} className={`px-4 py-4 text-left font-display text-sm font-semibold ${c.accent ? 'text-coral-600' : 'text-ink-500'}`}>
                    {c.url ? <a href={c.url} target="_blank" rel="noreferrer nofollow" className="hover:underline">{c.name}</a> : c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-ink-50/30'} ${r.highlight ? 'ring-1 ring-inset ring-coral-100' : ''}`}>
                  <td className={`sticky left-0 z-10 ${i % 2 === 0 ? 'bg-white' : 'bg-ink-50/70'} ${r.highlight ? 'bg-coral-50/40' : ''} px-4 py-3 font-semibold text-ink-800`}>
                    {r.highlight && <span className="mr-1 text-coral-500" title={uniqueTitle}>⭐</span>}
                    {L(locale, r.feature)}
                  </td>
                  <Cell val={r.triploop} highlight />
                  <Cell val={r.wanderlog} />
                  <Cell val={r.layla} />
                  <Cell val={r.tripit} />
                  <Cell val={r.google_my_maps} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-[10px] text-ink-400">{footnote}</p>
      </div>
    </section>
  );
}

function Cell({ val, highlight }: { val: string | boolean; highlight?: boolean }){
  const cls = highlight ? 'font-semibold text-ink-900' : 'text-ink-600';
  if(val === true) return <td className={`px-4 py-3 ${cls}`}><span className="text-emerald-500 text-lg">✓</span></td>;
  if(val === false) return <td className={`px-4 py-3 ${cls}`}><span className="text-ink-300">—</span></td>;
  return <td className={`px-4 py-3 ${cls} text-xs`}>{val}</td>;
}
