'use client';

interface Row {
  feature_en: string;
  feature_es: string;
  triploop: string | boolean;
  wanderlog: string | boolean;
  google_my_maps: string | boolean;
}

const ROWS: Row[] = [
  { feature_en: 'Real drive times with traffic', feature_es: 'Tiempos reales con tráfico', triploop: true, wanderlog: true, google_my_maps: 'Partial' },
  { feature_en: 'Tax-included prices', feature_es: 'Precios con impuestos incluidos', triploop: true, wanderlog: false, google_my_maps: false },
  { feature_en: 'Metric ↔ Imperial toggle', feature_es: 'Toggle km/mi', triploop: true, wanderlog: false, google_my_maps: false },
  { feature_en: 'AI itinerary suggestions', feature_es: 'Sugerencias IA', triploop: 'Open-source models', wanderlog: 'Paid tier', google_my_maps: false },
  { feature_en: 'Offline maps for parks', feature_es: 'Mapas offline en parques', triploop: 'Pro', wanderlog: 'Pro', google_my_maps: false },
  { feature_en: 'Bilingual (EN + ES)', feature_es: 'Bilingüe (EN + ES)', triploop: true, wanderlog: 'EN only', google_my_maps: true },
  { feature_en: 'Public trip templates SEO', feature_es: 'Rutas públicas SEO', triploop: '8 California', wanderlog: 'Community', google_my_maps: false },
  { feature_en: 'PDF export', feature_es: 'Export PDF', triploop: 'Pro', wanderlog: 'Pro', google_my_maps: false },
  { feature_en: 'One-tap hotel booking', feature_es: 'Reservas hotel 1 clic', triploop: 'Booking.com', wanderlog: 'Booking.com', google_my_maps: false },
  { feature_en: 'Price', feature_es: 'Precio', triploop: 'Free / $6.99', wanderlog: 'Free / $6.99', google_my_maps: 'Free' }
];

export function Comparison({ isEs }: { isEs?: boolean }){
  return (
    <section className="border-t border-ink-100 bg-white py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-coral-600">
            {isEs ? 'Comparación honesta' : 'Honest comparison'}
          </p>
          <h2 className="font-display text-display-md text-ink-900 md:text-display-lg">
            {isEs ? 'Cómo se compara TripLoop' : 'How TripLoop compares'}
          </h2>
        </div>
        <div className="overflow-x-auto rounded-card border border-ink-100 shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/50">
                <th className="w-[40%] px-4 py-4 text-left font-display text-xs font-semibold uppercase tracking-wider text-ink-500">
                  {isEs ? 'Feature' : 'Feature'}
                </th>
                <th className="px-4 py-4 text-left font-display text-sm font-semibold text-coral-600">
                  TripLoop
                </th>
                <th className="px-4 py-4 text-left font-display text-sm font-semibold text-ink-500">
                  Wanderlog
                </th>
                <th className="px-4 py-4 text-left font-display text-sm font-semibold text-ink-500">
                  Google My Maps
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-ink-50/30'}>
                  <td className="px-4 py-3 font-semibold text-ink-800">{isEs ? r.feature_es : r.feature_en}</td>
                  <Cell val={r.triploop} highlight />
                  <Cell val={r.wanderlog} />
                  <Cell val={r.google_my_maps} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-[10px] text-ink-400">
          {isEs
            ? 'Datos verificados agosto 2026. Precios y features de competidores pueden cambiar.'
            : 'Verified August 2026. Competitor pricing and features may change.'}
        </p>
      </div>
    </section>
  );
}

function Cell({ val, highlight }: { val: string | boolean; highlight?: boolean }){
  const cls = highlight ? 'font-semibold text-ink-900' : 'text-ink-600';
  if(val === true) return <td className={`px-4 py-3 ${cls}`}><span className="text-emerald-500">✓</span></td>;
  if(val === false) return <td className={`px-4 py-3 ${cls}`}><span className="text-ink-300">—</span></td>;
  return <td className={`px-4 py-3 ${cls}`}>{val}</td>;
}
