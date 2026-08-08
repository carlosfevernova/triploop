'use client';

interface Row {
  feature: { en: string; es: string };
  triploop: string | boolean;
  wanderlog: string | boolean;
  layla: string | boolean;
  tripit: string | boolean;
  google_my_maps: string | boolean;
  highlight?: boolean;
}

const ROWS: Row[] = [
  { feature: { en: 'AI Trip Generator (natural language)', es: 'AI Trip Generator (lenguaje natural)' }, triploop: 'Free · 6 providers + SSE stream', wanderlog: false, layla: '$49/yr', tripit: false, google_my_maps: false, highlight: true },
  { feature: { en: 'Streaming SSE (stops appear live on map)', es: 'Streaming SSE (stops en vivo en mapa)' }, triploop: 'Server-Sent Events', wanderlog: false, layla: false, tripit: false, google_my_maps: false, highlight: true },
  { feature: { en: 'Curated-first matcher (0 tokens if match)', es: 'Curated-first matcher (0 tokens si match)' }, triploop: '229 POIs + 46 templates', wanderlog: false, layla: false, tripit: false, google_my_maps: false, highlight: true },
  { feature: { en: 'Regions covered (worldwide)', es: 'Regiones cubiertas (mundial)' }, triploop: '24 · 7 continents', wanderlog: 'Global (unstructured)', layla: 'Global (AI-generated)', tripit: 'Global', google_my_maps: 'Global', highlight: true },
  { feature: { en: 'Iconic route templates verified', es: 'Templates rutas icónicas verificadas' }, triploop: '46 curated', wanderlog: 'Community-crowd', layla: 'AI-generated', tripit: false, google_my_maps: false, highlight: true },
  { feature: { en: 'Highway names visible (US-101, PCH, NC500)', es: 'Nombres highway visible (US-101, PCH, NC500)' }, triploop: true, wanderlog: false, layla: false, tripit: false, google_my_maps: 'Auto-map', highlight: true },
  { feature: { en: 'Flight-Delay Reshuffle (AI)', es: 'Reorganización por vuelo (IA)' }, triploop: true, wanderlog: false, layla: false, tripit: false, google_my_maps: false, highlight: true },
  { feature: { en: 'Bilingual EN + ES (native SEO)', es: 'Bilingüe EN + ES (SEO nativo)' }, triploop: true, wanderlog: 'EN only', layla: 'EN only', tripit: 'EN only', google_my_maps: true, highlight: true },
  { feature: { en: 'WhatsApp bot', es: 'Bot WhatsApp' }, triploop: 'Twilio + AI', wanderlog: false, layla: false, tripit: false, google_my_maps: false, highlight: true },
  { feature: { en: 'Embeddable widget', es: 'Widget embebible' }, triploop: true, wanderlog: false, layla: false, tripit: false, google_my_maps: false, highlight: true },
  { feature: { en: 'Budget calculator (real 2026 data)', es: 'Calculadora presupuestos (datos 2026)' }, triploop: true, wanderlog: false, layla: 'Hotels only', tripit: false, google_my_maps: false },
  { feature: { en: 'AI warnings + local tips', es: 'Alertas IA + tips locales' }, triploop: true, wanderlog: false, layla: false, tripit: false, google_my_maps: false },
  { feature: { en: 'Smart packing checklist AI', es: 'Lista de empaque IA' }, triploop: true, wanderlog: false, layla: false, tripit: false, google_my_maps: false },
  { feature: { en: 'Photo spots (worth-it rated)', es: 'Spots de foto (rated)' }, triploop: true, wanderlog: false, layla: false, tripit: false, google_my_maps: false },
  { feature: { en: 'EV chargers on route', es: 'Cargadores EV en ruta' }, triploop: '8 countries', wanderlog: false, layla: false, tripit: false, google_my_maps: false },
  { feature: { en: 'Realtime collaboration', es: 'Colaboración tiempo real' }, triploop: 'Free', wanderlog: '$39/yr', layla: false, tripit: 'Pro', google_my_maps: 'Basic' },
  { feature: { en: 'Real drive times with traffic', es: 'Tiempos reales con tráfico' }, triploop: true, wanderlog: true, layla: true, tripit: false, google_my_maps: 'Partial' },
  { feature: { en: 'Tax-included prices', es: 'Precios con impuestos' }, triploop: true, wanderlog: false, layla: false, tripit: false, google_my_maps: false },
  { feature: { en: 'Metric ↔ Imperial toggle', es: 'Toggle km ↔ millas' }, triploop: true, wanderlog: false, layla: false, tripit: false, google_my_maps: false },
  { feature: { en: 'Public trip templates SEO', es: 'Templates públicos SEO' }, triploop: '24 × 2 langs', wanderlog: 'Community', layla: false, tripit: false, google_my_maps: false },
  { feature: { en: 'Blog editorial (SEO)', es: 'Blog editorial (SEO)' }, triploop: '16 posts', wanderlog: 'Company', layla: 'Company', tripit: false, google_my_maps: false },
  { feature: { en: 'Offline PWA maps', es: 'Mapas offline PWA' }, triploop: 'Pro', wanderlog: 'Pro', layla: false, tripit: 'Pro', google_my_maps: false },
  { feature: { en: 'PDF export print-ready', es: 'PDF export imprimible' }, triploop: 'Pro', wanderlog: 'Pro', layla: false, tripit: 'Pro', google_my_maps: false },
  { feature: { en: 'One-tap hotel/tour booking', es: 'Reservas 1 clic' }, triploop: 'Booking + GYG', wanderlog: 'Booking', layla: 'Skyscanner', tripit: false, google_my_maps: false },
  { feature: { en: 'Regions covered', es: 'Regiones cubiertas' }, triploop: '6 (5 USA + 🇪🇸)', wanderlog: 'Global', layla: 'Global', tripit: 'Global', google_my_maps: 'Global' },
  { feature: { en: 'Price', es: 'Precio' }, triploop: 'Free / $6.99', wanderlog: 'Free / $40/yr', layla: '$49/yr', tripit: 'Free / $49/yr', google_my_maps: 'Free' }
];

const COMPETITORS = [
  { key: 'triploop', name: 'TripLoop', accent: true, url: null },
  { key: 'wanderlog', name: 'Wanderlog', accent: false, url: 'https://wanderlog.com' },
  { key: 'layla', name: 'Layla', accent: false, url: 'https://layla.ai' },
  { key: 'tripit', name: 'TripIt', accent: false, url: 'https://tripit.com' },
  { key: 'google_my_maps', name: 'Google My Maps', accent: false, url: 'https://mymaps.google.com' }
];

export function Comparison({ isEs }: { isEs?: boolean }){
  return (
    <section className="border-t border-ink-100 bg-gradient-to-br from-white to-ink-50/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-coral-600">
            {isEs ? 'Comparación honesta · verificado agosto 2026' : 'Honest comparison · verified August 2026'}
          </p>
          <h2 className="font-display text-display-md text-ink-900 md:text-display-lg">
            {isEs ? 'TripLoop vs los grandes' : 'TripLoop vs the big players'}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-500 text-balance">
            {isEs
              ? 'Auditamos las 4 apps más citadas en tier-list travel AI 2026 (Layla, MonkeyTravel, Voyaige). Filas resaltadas = features únicas nuestras.'
              : 'We audited the 4 most-cited apps in 2026 travel AI tier-lists (Layla, MonkeyTravel, Voyaige). Highlighted rows = our unique features.'}
          </p>
        </div>
        <div className="overflow-x-auto rounded-card border border-ink-100 bg-white shadow-card-hover">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-ink-200 bg-gradient-to-br from-ink-50 to-white">
                <th className="sticky left-0 z-10 w-[32%] bg-white px-4 py-4 text-left font-display text-xs font-semibold uppercase tracking-wider text-ink-500">
                  {isEs ? 'Feature' : 'Feature'}
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
                    {r.highlight && <span className="mr-1 text-coral-500" title={isEs ? 'Único TripLoop' : 'TripLoop only'}>⭐</span>}
                    {isEs ? r.feature.es : r.feature.en}
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
        <p className="mt-4 text-center text-[10px] text-ink-400">
          {isEs
            ? 'Datos de sitios oficiales y tier-lists 2026 (Layla, Voyaige, MonkeyTravel). Precios y features de competidores pueden cambiar.'
            : 'Data from official sites and 2026 tier-lists (Layla, Voyaige, MonkeyTravel). Competitor pricing and features may change.'}
        </p>
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
