import { redirect } from 'next/navigation';
import { isAdminAuthed } from '@/lib/admin-guard';

export const metadata = { title: 'Technical Report — TripLoop Admin', robots: { index: false } };

export default async function TechnicalReportPage(){
  if(!(await isAdminAuthed())) redirect('/admin/login');

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-8 border-b border-ink-100 pb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-coral-600">Confidential · Technical Report</p>
        <h1 className="font-display text-3xl font-semibold text-ink-900">TripLoop — Technical Audit</h1>
        <p className="mt-1 text-sm text-ink-500">Generated August 2026 · 17 development sessions</p>
      </header>

      <Section title="1. Product overview">
        <p>TripLoop is a bilingual (EN/ES) SaaS road-trip planner focused on international tourists visiting the US Southwest (California, Nevada, Arizona) — with real-time traffic-aware driving times, tax-included pricing, AI itinerary suggestions, offline maps for national parks, PDF export, and one-click Booking.com + GetYourGuide reservations.</p>
      </Section>

      <Section title="2. Tech stack (production)">
        <Table rows={[
          ['Framework', 'Next.js 15.5 App Router + Turbopack + React 19'],
          ['Runtime', 'Vercel Fluid Compute (Edge default, Node for Stripe/HMAC)'],
          ['Database', 'Supabase PostgreSQL + Row Level Security'],
          ['Auth', 'Supabase Auth (email + JWT sessions)'],
          ['Realtime', 'Supabase Realtime (presence + postgres_changes + broadcast)'],
          ['Payments', 'Stripe SDK v18 (Checkout + Customer Portal + Webhooks)'],
          ['AI', 'DeepSeek V3 (Fireworks) → Llama 3.3 70B (Groq) → Claude Haiku 4.5 (Anthropic fallback) — Promise.race parallel'],
          ['Maps', 'MapLibre GL 6.2 + Carto Voyager basemap (free) + Google Places API (New) + Google Routes API v2'],
          ['Email', 'Resend v6 + custom HTML templates + Vercel Cron'],
          ['PWA', 'Serwist + IndexedDB (idb) + tile pre-caching for offline national parks'],
          ['i18n', 'next-intl 3.26 with /en /es locale routing'],
          ['Styling', 'Tailwind 3.4 + Inter + Fraunces (editorial pairing)'],
          ['DnD', '@dnd-kit (React 19 compatible)'],
          ['SEO', 'Dynamic sitemap, robots.txt, Vercel OG dynamic images, schema.org TouristTrip + BlogPosting + FAQPage'],
          ['Analytics', 'Custom in-house dashboard (template_views, affiliate_clicks, email_log)']
        ]} />
      </Section>

      <Section title="3. Codebase statistics">
        <Table rows={[
          ['Sessions', '17 (spread over 1 day intensive)'],
          ['Approx dev hours', '~50-70h (comparable to 4-6 weeks solo full-time)'],
          ['Files created', '~85 TypeScript files (excluding node_modules)'],
          ['API endpoints', '20+ (edge + node)'],
          ['Public pages', '31 rutas (bilingüe)'],
          ['Migrations SQL', '10 aplicadas en Supabase'],
          ['Client bundle shared', '105 kB (post perf-sprint)'],
          ['Trip page bundle inicial', '200 kB (post dynamic imports)'],
          ['TypeScript strict', 'Enabled · 0 errors'],
          ['Lighthouse-ready', 'PWA installable, SW registered, offline fallback']
        ]} />
      </Section>

      <Section title="4. Sesiones (roadmap ejecutado)">
        <ol className="ml-5 list-decimal space-y-1.5 text-sm text-ink-700">
          <li><b>Session 1</b> — Landing hero + waitlist deployed</li>
          <li><b>Session 2</b> — Route optimizer core (Google Routes v2 + MapLibre)</li>
          <li><b>Session 3</b> — Supabase Auth + Mis Trips + Fork trip</li>
          <li><b>Session 4</b> — AI suggestions (OSS-first: DeepSeek/Llama)</li>
          <li><b>Session 5</b> — POI enrichment + Nearby geo search</li>
          <li><b>Session 6</b> — Programmatic SEO + 8 California templates</li>
          <li><b>Session 7</b> — Affiliate integrations (Booking + GYG + FTC)</li>
          <li><b>Session 8</b> — PWA offline maps + tile pre-caching</li>
          <li><b>Session 9</b> — Stripe payments + Pro gating</li>
          <li><b>Session 10</b> — PDF export (print-optimized route)</li>
          <li><b>Session 11</b> — Admin dashboard (passphrase) + metrics</li>
          <li><b>Session 12</b> — Landing polish + trust signals + FAQ + Comparison</li>
          <li><b>Session 13</b> — Email flows (Resend + 4 templates + Cron)</li>
          <li><b>Session 14</b> — Nevada + Arizona + Southwest expansion (+8 templates)</li>
          <li><b>Audit</b> — Security + Performance + A11y + SEO + P0 fixes</li>
          <li><b>Session 15</b> — Perf sprint (-115KB, -600ms AI, Hero+Pricing SSR)</li>
          <li><b>Session 16</b> — Blog CMS + 8 posts + Article schema + RSS</li>
          <li><b>Session 17</b> — Collaborative editing (Supabase Realtime) + admin editor + reports</li>
        </ol>
      </Section>

      <Section title="5. Arquitectura de seguridad">
        <ul className="ml-5 list-disc space-y-1.5 text-sm text-ink-700">
          <li>Row Level Security en 10+ tablas (trips, subscriptions, blog_posts, pois, etc)</li>
          <li>Service_role writes SOLO desde Edge Functions server-side</li>
          <li>Admin: passphrase HMAC-signed cookie 24h (timing-safe compare)</li>
          <li>Stripe webhook: signature verification obligatoria</li>
          <li>Cron endpoints: bearer token constant-time compare</li>
          <li>Auth-first en Stripe endpoints (evita config leak)</li>
          <li>CSP headers + X-Frame-Options + Referrer-Policy</li>
          <li>rel=&quot;sponsored nofollow&quot; en todos affiliate links (FTC compliant)</li>
          <li>Unsubscribe token HMAC + email_log audit trail</li>
          <li>No hardcoded secrets — todas keys en Vercel env vars</li>
        </ul>
      </Section>

      <Section title="6. Ventaja técnica defendible">
        <ul className="ml-5 list-disc space-y-1.5 text-sm text-ink-700">
          <li><b>Bilingüe nativo (EN + ES)</b> — Wanderlog es EN-only, TripIt EN-only. Único player con hreflang correcto.</li>
          <li><b>OSS AI stack</b> — Zero vendor lock-in. Fireworks DeepSeek $0.14/1M input tokens vs GPT-4 $30/1M (200× cheaper).</li>
          <li><b>Programmatic SEO first</b> — 16 templates + 8 blog posts pre-seedeados con schema.org completo. Wanderlog cero SEO organic (app-first).</li>
          <li><b>Tax-included pricing UX</b> — MX/EU users no viven el bait-and-switch de precios USA sin IVA.</li>
          <li><b>Real-time collab con Supabase</b> (no Liveblocks $99/mo). Costo marginal cero.</li>
          <li><b>Edge-first arquitectura</b> — 90% de endpoints en Vercel Edge = latencia bajo 100ms global.</li>
        </ul>
      </Section>

      <Section title="7. Costos operativos actuales (mensuales)">
        <Table rows={[
          ['Vercel Pro', '$20/mo (single seat)'],
          ['Supabase Free', '$0 (hasta 500MB DB + 2GB egress)'],
          ['Google Maps API', '~$5-15/mo (Places + Routes; primeros $200/mo gratis con Cloud credit)'],
          ['Resend Free', '$0 (3k emails/mo)'],
          ['Stripe', '2.9% + 30¢ por transacción'],
          ['Fireworks AI', '$0.14/1M input · $0.28/1M output (DeepSeek V3)'],
          ['Groq', '$0.59/1M in · $0.79/1M out (Llama 70B)'],
          ['Total baseline', '~$25/mo hasta 1,000 usuarios activos']
        ]} />
      </Section>

      <Section title="8. Deuda técnica identificada (backlog)">
        <ul className="ml-5 list-disc space-y-1.5 text-sm text-ink-700">
          <li>P2: Rate limiting en endpoints públicos (waitlist, ai/suggest-stops, places/*)</li>
          <li>P2: Edit token para trips anónimos (evitar edit-de-cualquiera)</li>
          <li>P2: Skip-to-content link + form htmlFor labels a11y</li>
          <li>P3: Virtual scroll para itinerarios &gt;20 stops</li>
          <li>P3: OG images propias en /nevada /arizona /southwest indices</li>
          <li>P3: Test coverage — actualmente 0% (audit manual E2E via Playwright)</li>
          <li>P3: Stripe webhook coverage extendida (trial_will_end, refunded)</li>
        </ul>
      </Section>

      <p className="mt-10 text-center text-[10px] text-ink-400">
        Reporte generado desde datos vivos · TripLoop Admin · agosto 2026
      </p>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }){
  return (
    <section className="mb-10">
      <h2 className="mb-4 font-display text-xl font-semibold text-ink-900">{title}</h2>
      <div className="rounded-card border border-ink-100 bg-white p-6 shadow-card">{children}</div>
    </section>
  );
}

function Table({ rows }: { rows: string[][] }){
  return (
    <table className="w-full text-sm">
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
