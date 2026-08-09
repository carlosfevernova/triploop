import { redirect } from 'next/navigation';
import { isAdminAuthed } from '@/lib/admin-guard';

export const metadata = { title: 'Estado del producto — TripLoop Admin', robots: { index: false } };

export default async function InvestorReportPage(){
  if(!(await isAdminAuthed())) redirect('/admin/login');

  return (
    <main className="mx-auto max-w-4xl px-8 py-10">
      <a href="/admin" className="mb-6 inline-flex items-center gap-1.5 rounded-pill border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-ink-800">
        <span aria-hidden>←</span> Volver al dashboard
      </a>
      <header className="mb-10 border-b border-ink-100 pb-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-ink-400">Confidencial · Estado del producto</p>
        <h1 className="font-display text-[32px] font-semibold tracking-tight text-ink-900">TripLoop — Lo que hemos construido</h1>
        <p className="mt-2 text-[14px] text-ink-500">Vista de socios · 2026-08-08 · Producto en producción · <b>24 regiones · 7 continentes · Streaming SSE · Itinerary AI live (S46: NL edits + realtime collab + offline queue)</b></p>
      </header>

      <Section title="🚀 Qué es TripLoop (en lenguaje simple)">
        <p className="text-[15px] leading-relaxed">
          Una <b>plataforma web + app</b> que ayuda a turistas a planear road trips <b>por todo el mundo</b> — desde California PCH
          hasta Sahara Morocco, desde Japón Golden Route hasta Patagonia Ruta 40. Sin fricciones comunes: tiempos reales de manejo con
          tráfico, precios con impuestos incluidos, funciona sin señal, viene con <b>46 rutas icónicas verificadas</b> con nombres de
          highway (US-101, PCH, NC500, SS163 Amalfi) y stops con coordenadas reales — todo traducido a 2 idiomas.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed">
          <b>100% en producción</b> en <a href="https://triploop-six.vercel.app" className="text-coral-600 underline">triploop-six.vercel.app</a>.
          Diferenciadores clave: <b>AI Trip Generator con streaming SSE</b> (paradas aparecen en el mapa en tiempo real mientras la IA genera),
          <b> curated-first matcher</b> (respuesta &lt; 200ms con 0 tokens si hay match), <b>231 POIs curados verificados</b>,
          <b>bot WhatsApp bilingüe</b>, <b>widget embebible</b> para partners, y <b>bilingüe nativo EN+ES</b> — moat único vs
          Wanderlog (solo EN), Layla ($49/año paywall) y TripIt (solo post-booking).
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-ink-500">
          <b>Cobertura mundial actual (24 regiones · 7 continentes):</b>
          Norteamérica (California PCH, Route 66, Southwest Grand Circle, Utah Mighty 5, Southeast Florida Keys, Rockies Yellowstone,
          Pacific Northwest, Northeast Blue Ridge) · Canadá (Icefields Parkway) · Latinoamérica (México Riviera Maya,
          Chile Carretera Austral, Argentina Ruta 40 Patagonia, Perú Machu Picchu) · Europa (España Andalucía, Italia Amalfi,
          Islandia Ring Road, Irlanda Ring of Kerry, Alemania Ruta Romántica, Escocia NC500) · Asia (Japón Golden Route) ·
          Oceanía (Australia Great Ocean Road, Nueva Zelanda Isla Sur) · África (Marruecos Sahara).
        </p>
      </Section>

      <Section title="📊 El mercado donde jugamos">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard number="$2.34B" label="Mercado apps road trip · 2024" />
          <StatCard number="$6.92B" label="Proyección 2032" />
          <StatCard number="+16.4%" label="Crecimiento anual (CAGR)" />
        </div>
        <p className="mt-4 text-[14px] leading-relaxed text-ink-700">
          El mercado se duplica cada 5 años. El global de apps de viaje es aún mayor:{' '}
          <b>$16B en 2026 → $63B para 2035</b>. TripLoop apunta al nicho de más rápido crecimiento — turistas internacionales
          independientes que no quieren paquetes turísticos pero necesitan ayuda planeando.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-card border border-emerald-200 bg-emerald-50/40 p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">TAM primario</div>
            <p className="mt-1 text-[13px] text-ink-800"><b>500M+ hispanohablantes</b> desatendidos por competidores EN-only (Wanderlog, Layla, TripIt).
              Somos el único player con SEO nativo bilingüe + hreflang correcto.</p>
          </div>
          <div className="rounded-card border border-ocean-400/40 bg-ocean-400/5 p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-ocean-800">Beachhead geo</div>
            <p className="mt-1 text-[13px] text-ink-800"><b>USA road trippers hispanohablantes</b> (~50M en USA + turistas MX/AR/CO
              visitando USA) — mercado con demanda real, sin producto competitivo local.</p>
          </div>
        </div>
        <p className="mt-3 text-[12px] text-ink-400">Fuentes: verifiedmarketresearch, market.us, businessresearchinsights, US Census (Aug 2026).</p>
      </Section>

      <Section title="🥇 Competidores (dónde estamos parados)">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-ink-200 bg-ink-50/50">
              <th className="px-3 py-2.5 text-left font-semibold text-ink-800">Competidor</th>
              <th className="px-3 py-2.5 text-left font-semibold text-ink-800">Revenue</th>
              <th className="px-3 py-2.5 text-left font-semibold text-ink-800">Debilidad frente a nosotros</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-ink-100"><td className="px-3 py-2.5 font-semibold">Wanderlog</td><td className="px-3 py-2.5 tabular-nums">$100K-$5M/año</td><td className="px-3 py-2.5">Solo inglés · sin precios con impuestos · sin streaming AI · SEO débil</td></tr>
            <tr className="border-b border-ink-100 bg-ink-50/30"><td className="px-3 py-2.5 font-semibold">Layla</td><td className="px-3 py-2.5 tabular-nums">$49/año paywall</td><td className="px-3 py-2.5">Paywall duro · AI-generated stops no verificados · sin curated content</td></tr>
            <tr className="border-b border-ink-100"><td className="px-3 py-2.5 font-semibold">TripIt</td><td className="px-3 py-2.5 tabular-nums">$3.3M/año · 30 empleados</td><td className="px-3 py-2.5">Organizador post-reserva, NO planeación real, no IA</td></tr>
            <tr className="border-b border-ink-100 bg-ink-50/30"><td className="px-3 py-2.5 font-semibold">Roadtrippers</td><td className="px-3 py-2.5 tabular-nums">n/d</td><td className="px-3 py-2.5">Solo USA · $50/año Pro caro · no bilingüe · sin IA moderna</td></tr>
            <tr className="border-b border-ink-100"><td className="px-3 py-2.5 font-semibold">Mindtrip</td><td className="px-3 py-2.5">Freemium</td><td className="px-3 py-2.5">Chat-first pero solo EN · no highway names · no widget · no LatAm</td></tr>
            <tr className="border-b border-ink-100 bg-ink-50/30"><td className="px-3 py-2.5 font-semibold">Google My Maps</td><td className="px-3 py-2.5">Gratis</td><td className="px-3 py-2.5">Máx 10 paradas, sin IA, sin colab, sin offline</td></tr>
            <tr><td className="px-3 py-2.5 font-semibold text-coral-600">TripLoop</td><td className="px-3 py-2.5 text-coral-600 text-[12px]">Beta pública · 24 regiones · 7 continentes</td><td className="px-3 py-2.5 text-coral-700 text-[12px]">Único con bilingüe EN+ES · streaming SSE · curated-first · 231 POIs verificados</td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="⭐ Ventajas técnicas defendibles (por qué somos diferentes)">
        <ul className="ml-5 list-disc space-y-2.5 text-[14px] leading-relaxed text-ink-700">
          <li><b>Único bilingüe EN+ES nativo</b> — con hreflang correcto para SEO, <b>24 templates</b> y 16 posts (8×2 idiomas). 500M+ hispanohablantes desatendidos por competencia inglesa.</li>
          <li><b>AI Trip Generator NLP + Onboarding Wizard</b> — usuario describe su viaje en lenguaje natural, o completa cuestionario 4-pasos guiado (tipo viaje, viajeros+edades niños estilo Mindtrip, intereses, presupuesto+ritmo). La IA arma itinerario completo con coords reales. <b>Ningún competidor tiene equivalente</b> sin bolt-on de ChatGPT.</li>
          <li><b>Budget Calculator con datos 2026 reales</b> — gas por región USA/Spain, hoteles/food/attractions tier low/mid/high, multi-currency 6. Wanderlog NO tiene calculadora integrada; Layla solo hoteles.</li>
          <li><b>AI Insights por viaje</b> — warnings críticos (booking Alcatraz 3 meses antes, closures PCH Caltrans) + tips insider ('no vayas a X, ve a Y'). Cache por hash. Genera desde OpenRouter free.</li>
          <li><b>AI Packing Checklist personalizada</b> — genera 4 categorías destino-específicas (sunscreen SPF 50 en Grand Canyon, windbreaker Big Sur fog). Progreso persistido localStorage.</li>
          <li><b>AI Photo Spots con worth-it rating</b> — cada spot con clasificación yes/maybe/skip, best_time (golden/blue hour), wait_time_min. Diferenciador único en travel tech.</li>
          <li><b>Flight-Delay Reshuffle (killer feature)</b> — usuario reporta disrupción (vuelo delay 6h, clima, cansancio), AI reorganiza itinerario con reasoning. Puede agregar stops nuevos alternativos. Ningún competidor tiene esto.</li>
          <li><b>EV Chargers Map</b> — integración OpenChargeMap 8 países, radius selector, connector types en vivo. Único competidor road-trip con EV focus + bilingüe.</li>
          <li><b>Tiempos reales de manejo</b> con Google Routes API v2 con tráfico en vivo. Wanderlog usa estimados estáticos.</li>
          <li><b>Precios con impuestos incluidos</b> en checkout. Visitantes MX/EU no sufren el "$89 acaba siendo $118".</li>
          <li><b>SEO programático first</b>: <b>24 plantillas × 2 idiomas</b> + 16 posts blog ya indexables con schema.org completo. Compite en búsquedas orgánicas antes de gastar en ads.</li>
          <li><b>Stack IA open-source triple fallback</b>: Fireworks DeepSeek V3 (base $0.14/1M vs GPT-4 $30/1M = <b>200× más barato</b>) → Groq Llama (free tier) → Anthropic Claude (premium). Sin vendor lock-in.</li>
          <li><b>Colaboración en tiempo real</b> con Supabase Realtime (costo marginal $0). Wanderlog cobra $39.99/año por esta feature.</li>
          <li><b>Mapas offline PWA</b> para parques sin señal. Paridad con Wanderlog Pro pero infraestructura propia.</li>
          <li><b>WhatsApp bot bilingüe con AI</b> — canal preferido LATAM (98% penetración MX/AR/CO). Ningún competidor lo tiene.</li>
          <li><b>Widget embebible</b> para blogs de viaje y agencias — <b>growth loop distribuido</b>. Estrategia estilo Calendly/Typeform.</li>
          <li><b>Itinerary Engine temporal-espacial (S44 — nuevo)</b> — schema normalizado <code>trip_days</code> + <code>itinerary_items</code> con 10 tipos (place/meal/hotel/flight/train/drive/walk/event/note/free_time), integer position gaps (100/200/300), start_local + duration_min por item, priority (must/preferred/optional), <code>fixed</code> lock para reservas. Vista dedicada <code>/trip/[slug]/itinerary</code> con DayNavigator scrollable, timeline vertical con travel segments haversine-estimados, drag&drop entre días, edit drawer completo, y map sync (highlight item ↔ marker). Diferenciador clave vs Wanderlog: nuestro engine calcula overlaps, travel conflicts (Fase 13 validateDay) y density warnings en cliente sin llamar backend.</li>
          <li><b>Itinerary Intelligence — routing real + opening hours + auto-scheduling (S45 — nuevo)</b> — 4 endpoints nuevos: (1) <code>/route-matrix</code> integra Google Routes v2 traffic-aware con hash-based cache por trip_day (invalidación automática al reordenar); TravelSegment ahora muestra <em>Live badge</em> con duración real. (2) <code>/opening-hours</code> Google Places details con cache 30 días → validateDay detecta <em>closed</em> (severity error), <em>closes_during_visit</em> (warning), <em>doesn't open yet</em> (warning) usando day-of-week. (3) <code>/schedule-day</code> asigna start_local greedy 09:00→22:00 respetando fixed items + duration + travel + buffer 10min. (4) <code>/optimize-day</code> nearest-neighbor TSP con fixed anchors, muestra saved_km en confirm dialog. Estas 4 features cierran el gap con planners premium (Wanderlog Pro paywall) manteniendo bilingüe + open architecture.</li>
          <li><b>Itinerary AI + Realtime Collab + Offline Mutations (S46 — nuevo)</b> — <em>Operations-first AI</em>: el usuario escribe "muéveme el Louvre al jueves y agrega cena a las 8pm" → LLM (OpenRouter gemma-4-26b free) devuelve JSON con 10 ops estructuradas (move_item, update_time, add_item, optimize_day, etc.), validadas server-side contra IDs reales (imposible que el LLM invente rutas o borre lo que no existe). Preview drawer con explicación + botón Apply. <em>Realtime collab</em>: migration 023 habilita Supabase Realtime en trip_days + itinerary_items; hook useItineraryRealtime sincroniza cambios entre colaboradores sin refresh. <em>Offline queue</em>: mutations en localStorage cuando sin conexión, auto-flush FIFO al detectar online. Badge visible del estado de sync. Esta triple capa (AI + realtime + offline) es diferenciador que ningún competidor free tiene junto.</li>
          <li><b>Financial Tracker por trip (S43)</b> — booked vs actual vs remaining por categoría (gas/hoteles/food/attractions/flights/shopping/other) con RLS por user. Complementa el Budget Calculator estimativo con tracking real.</li>
          <li><b>Stop voting grupal (S43)</b> — LIKE/MAYBE/NO por parada, lecturas públicas / escritura autenticada, optimistic UI. Democratiza decisiones en viajes de grupo.</li>
          <li><b>Observabilidad AI de nivel enterprise (S42)</b> — <code>logAICall()</code> tracking (endpoint/provider/latency/tokens/cost) → tabla <code>ai_call_log</code> → dashboard admin <code>/ai-costs</code> con KPIs, breakdown por provider y endpoint, chart 7-day. Web Vitals RUM via <code>sendBeacon</code>. Auditable a nivel per-call para tomar decisiones de vendor mix.</li>
          <li><b>Free geocoding fallback</b> (OpenStreetMap) ahorra ~60-80% Google API quota — margen operativo muy superior.</li>
          <li><b>Expansión geo probada</b> — arquitectura template-first permite añadir país nuevo en &lt;3h (Utah + <b>España</b> probaron el patrón). Escalable a Francia, Italia, México, Japón, NZ.</li>
          <li><b>Revenue híbrido</b>: afiliado Booking + GetYourGuide (2-5% comisión) + suscripción Pro ($6.99/mes). Monetización doble desde día 1.</li>
        </ul>
      </Section>

      <Section title="💎 Valuación de referencia (según comparables 2026)">
        <p className="mb-4 text-[14px] leading-relaxed text-ink-700">
          Las empresas SaaS cotizan hoy entre <b>2.5×–8× ingresos anuales recurrentes (ARR)</b> según tamaño y crecimiento
          (fuente: L40°, Windsor Drake 2026). Travel tech en la banda inferior. Escenarios informativos:
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <ScenarioCard tier="Hoy · Estado actual" arr="Beta · 24 regiones · 7 continentes · streaming SSE" value="$220K-$620K" note="19,380 LOC · 130+ URLs SEO indexables (46 templates × 2 idiomas + 24 landings) · stack IA con streaming SSE + curated-first matcher + 231 POIs verificados · 6 endpoints IA · admin Cside preview · moat bilingüe + WhatsApp + widget + streaming vs Wanderlog EN/Layla paywall/TripIt no-planning/Mindtrip solo EN" tone="coral" />
          <ScenarioCard tier="Año 1 · si convierte 500 Pro" arr="$42K ARR" value="$120K-$220K" note="500 usuarios × $6.99/mes × 12 · múltiplo 2.5-4× ARR banda micro-SaaS + prima diferenciación (AI NLP, WhatsApp)" tone="ocean" />
          <ScenarioCard tier="Año 3 · si escala a 15K Pro" arr="$1.25M ARR" value="$5.5M-$10M" note="15,000 Pro + afiliados + widget embeds · múltiplo 4-8× ARR banda bootstrapped growth con moat AI+bilingüe+geo" tone="emerald" />
        </div>
        <p className="mt-4 text-[12px] text-ink-500">
          Escenarios conservadores contra comparables públicos. Escenario optimista (top decil travel SaaS con AI diferenciador y expansión internacional): 8-12× ARR a escala.
        </p>
      </Section>

      <Section title="🛠 Activos técnicos concretos (lo tangible · S44 snapshot)">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <MiniStat n="~22K" l="Líneas de código TS/TSX" />
          <MiniStat n="42" l="Endpoints API (S43+S44)" />
          <MiniStat n="55+" l="Componentes React" />
          <MiniStat n="65+" l="Páginas producción" />
          <MiniStat n="21" l="Migrations DB aplicadas" />
          <MiniStat n="20" l="Integraciones externas" />
          <MiniStat n="130+" l="URLs indexables SEO" />
          <MiniStat n="60" l="Templates bilingues (24×2 mín)" />
          <MiniStat n="24" l="Regiones · 7 continentes" />
          <MiniStat n="231" l="POIs curados verificados" />
          <MiniStat n="70+" l="Deploys a producción" />
          <MiniStat n="6" l="Endpoints IA + SSE + cost tracking" />
          <MiniStat n="10" l="Tipos itinerary items (S44)" />
          <MiniStat n="3" l="Layers persistencia (Postgres/IDB/Cache)" />
          <MiniStat n="4" l="AI providers fallback chain" />
          <MiniStat n="100%" l="TypeScript strict · 0 tipos errores" />
        </div>
        <p className="mt-4 text-[12px] text-ink-500">
          Todo el código es TypeScript strict, cero errores de tipo, deployado en Vercel Fluid Compute con Supabase Postgres.
          Auditable en el repositorio. <b>Crecimiento post-S40:</b> +6 migrations (webhook idempotency, ai_call_log, trip_expenses, stop_votes, itinerary engine), +Itinerary Engine (P0+P1 fase 0-15), +Financial Tracker, +Stop Voting, +Web Vitals RUM, +AI Cost Dashboard, +StateFallbacks (Error+Retry+offline detection).
        </p>
      </Section>

      <Section title="🌎 Lo que esto nos posiciona a hacer">
        <p className="text-[15px] leading-relaxed">
          TripLoop está <b>arquitecturado para escalar a cualquier región de road-trip globalmente</b>. Agregar Francia, Japón,
          México o Nueva Zelanda toma menos de 3h cada uno (probado con Nevada, Arizona, Southwest, Utah, <b>y España como
          primera bandera europea live desde S19</b>). La base bilingüe ya existe — agregar francés, japonés o cualquier
          idioma usa la misma infraestructura{' '}
          <code className="mx-1 rounded bg-ink-100 px-1 text-[13px]">next-intl</code>{' '}
          y el pattern JSONB translations en trips.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed">
          Adquirentes estratégicos naturales incluyen: <b>Booking.com, Expedia, Airbnb Experiences, Google (Maps), Roadtrippers,
          Wanderlog</b> mismo, o jugadores LATAM (Despegar, Kiwi.com). El AI Trip Generator NLP y el bot de WhatsApp
          son diferenciadores que suben el fit estratégico con jugadores hispanos y LATAM en particular.
        </p>
      </Section>

      <Section title="🧮 Unit economics ya validados (arquitectura)">
        <Table rows={[
          ['Costo usuario free', '~$0.02/usuario/mes (Supabase + Vercel serverless)'],
          ['Revenue usuario Pro', '$6.99/mes (o $59.88/año = $4.99/mes efectivo)'],
          ['Costo usuario Pro', '~$0.15/usuario/mes (IA + Google Maps + email)'],
          ['Margen bruto Pro', '~97% (best-in-class SaaS)'],
          ['Comisión afiliado', '2-5% Booking · 8% GetYourGuide'],
          ['Break-even', '~8-10 usuarios Pro cubren el baseline $25/mes actual'],
          ['Costo operativo actual', '$0-25/mes hasta 1,000 usuarios activos'],
          ['LTV Pro (retención 24m)', '~$168 · LTV:CAC target 10-30×']
        ]} />
      </Section>

      <Section title="✅ Estado actual · resumen ejecutivo">
        <ul className="ml-5 list-disc space-y-2 text-[14px] text-ink-700">
          <li>Producto <b>en producción</b>, no en desarrollo</li>
          <li><b>6 regiones live</b> incluyendo primera bandera europea (España)</li>
          <li><b>AI Trip Generator NLP</b> deployado — diferenciador único vs competencia</li>
          <li>Bot WhatsApp bilingüe + widget embebible ambos live</li>
          <li>Bootstrapped y <b>profitable-by-design</b> (costos <b>$25/mes</b> hasta 1,000 usuarios)</li>
          <li><b>Cero deuda</b> financiera, cero funding recibido, todos los assets propios</li>
          <li>Infraestructura globalmente escalable sin re-arquitectura</li>
          <li>Documentación técnica auditable en el reporte técnico del panel admin</li>
        </ul>
        <p className="mt-4 text-[13px] font-medium text-ink-600">
          Este documento es informativo. No estamos levantando capital actualmente.
        </p>
      </Section>

      <p className="mt-10 text-center text-[10px] font-medium tracking-wider text-ink-300">
        DATOS DE FUENTES PÚBLICAS · SIMILARWEB · DEALROOM · MARKET.US · VERIFIEDMARKETRESEARCH · L40° SAAS MULTIPLES · AGOSTO 2026
      </p>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }){
  return (
    <section className="mb-10">
      <h2 className="mb-4 font-display text-[22px] font-semibold tracking-tight text-ink-900">{title}</h2>
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">{children}</div>
    </section>
  );
}

function StatCard({ number, label }: { number: string; label: string }){
  return (
    <div className="rounded-xl border border-ink-100 bg-gradient-to-br from-coral-50/40 to-white p-4 text-center">
      <div className="font-display text-[28px] font-semibold tabular-nums leading-none text-ink-900">{number}</div>
      <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-ink-500">{label}</div>
    </div>
  );
}

function MiniStat({ n, l }: { n: string; l: string }){
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-3 text-center">
      <div className="font-display text-[22px] font-semibold tabular-nums text-ink-900">{n}</div>
      <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-ink-500">{l}</div>
    </div>
  );
}

function ScenarioCard({ tier, arr, value, note, tone }: { tier: string; arr: string; value: string; note: string; tone: 'coral' | 'ocean' | 'emerald' }){
  const bg = tone === 'coral' ? 'from-coral-50 border-coral-200' : tone === 'ocean' ? 'from-ocean-400/10 border-ocean-400/30' : 'from-emerald-50 border-emerald-200';
  return (
    <div className={`rounded-xl border bg-gradient-to-br to-white p-4 ${bg}`}>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-500">{tier}</div>
      <div className="mt-1 text-[11px] text-ink-600">{arr}</div>
      <div className="mt-2 font-display text-[22px] font-semibold tabular-nums text-ink-900">{value}</div>
      <p className="mt-2 text-[11px] leading-snug text-ink-500">{note}</p>
    </div>
  );
}

function Table({ rows }: { rows: string[][] }){
  return (
    <table className="w-full text-[13px]">
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-ink-50/30'}>
            <td className="border-b border-ink-100 px-3 py-2 font-semibold text-ink-800 align-top w-1/3">{r[0]}</td>
            <td className="border-b border-ink-100 px-3 py-2 text-ink-700">{r[1]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
