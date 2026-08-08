import { redirect } from 'next/navigation';
import { isAdminAuthed } from '@/lib/admin-guard';

export const metadata = { title: 'Investor Report — TripLoop Admin', robots: { index: false } };

export default async function InvestorReportPage(){
  if(!(await isAdminAuthed())) redirect('/admin/login');

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-8 border-b border-ink-100 pb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-emerald-600">Confidential · Investor Deck</p>
        <h1 className="font-display text-3xl font-semibold text-ink-900">TripLoop — For partners & investors</h1>
        <p className="mt-1 text-sm text-ink-500">Language: simple · Focus: opportunity + numbers · Aug 2026</p>
      </header>

      <Section title="🚀 What we built (in plain language)">
        <p>
          TripLoop is a website + app that helps <b>international tourists plan road trips through the US Southwest</b>{' '}
          (California, Nevada, Arizona) without the usual pain: real driving times (not the fantasy Google shows), prices
          with tax already included, works offline in national parks, and comes with a menu of pre-made trips they can
          duplicate in one click.
        </p>
        <p className="mt-3">
          The whole product was built in <b>17 focused sessions</b> (roughly <b>50-70 hours</b> of work) — from a blank page
          to a live product with payments, AI, real-time collaboration, blog, and admin panel. Every feature is deployed
          and working in production at <a href="https://triploop-six.vercel.app" className="text-coral-600 underline">triploop-six.vercel.app</a>.
        </p>
      </Section>

      <Section title="📊 The market (why this matters)">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard number="$2.34B" label="US road trip app market · 2024" />
          <StatCard number="$6.92B" label="Projected by 2032" />
          <StatCard number="+16.4%" label="Annual growth (CAGR)" />
        </div>
        <p className="mt-4 text-sm text-ink-700">
          The market is doubling every 5 years. The global travel app market is even bigger:{' '}
          <b>$16B in 2026 → $63B by 2035</b>. TripLoop targets the fastest-growing niche within it — self-directed international
          travelers who don&apos;t want package tours but need help planning.
        </p>
      </Section>

      <Section title="🥇 Competitors (who we&apos;re up against)">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-200 bg-ink-50/50">
              <th className="px-3 py-2 text-left font-semibold text-ink-800">Competitor</th>
              <th className="px-3 py-2 text-left font-semibold text-ink-800">Revenue</th>
              <th className="px-3 py-2 text-left font-semibold text-ink-800">Weakness (for us)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-ink-100"><td className="px-3 py-2 font-semibold">Wanderlog</td><td className="px-3 py-2">$100K-$5M/yr</td><td className="px-3 py-2">EN only · no tax-inclusive prices · app-first (weak SEO)</td></tr>
            <tr className="border-b border-ink-100 bg-ink-50/30"><td className="px-3 py-2 font-semibold">TripIt</td><td className="px-3 py-2">$3.3M/yr · 30 empleados</td><td className="px-3 py-2">Post-booking organizer, NO real planning UX</td></tr>
            <tr className="border-b border-ink-100"><td className="px-3 py-2 font-semibold">Roadtrippers</td><td className="px-3 py-2">n/d</td><td className="px-3 py-2">Solo road trips USA · $50/año Pro caro · no bilingüe</td></tr>
            <tr className="border-b border-ink-100 bg-ink-50/30"><td className="px-3 py-2 font-semibold">Google My Maps</td><td className="px-3 py-2">Free</td><td className="px-3 py-2">Máximo 10 paradas, sin AI, sin colab, sin offline</td></tr>
            <tr><td className="px-3 py-2 font-semibold text-coral-600">TripLoop</td><td className="px-3 py-2">Pre-revenue (MVP)</td><td className="px-3 py-2 text-coral-700">— (below is our edge)</td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="⭐ Why we win (our differentiators)">
        <ul className="ml-5 list-disc space-y-2 text-sm text-ink-700">
          <li><b>Bilingual EN + ES from day 1.</b> Nobody else. 500M+ Spanish speakers globally, 40M+ US Latinos. Huge underserved market.</li>
          <li><b>Real driving times</b> with Google Routes traffic API (v2). Wanderlog uses stale estimates.</li>
          <li><b>Tax-included prices.</b> MX/EU visitors don&apos;t suffer the "$89 becomes $118 at checkout" trap.</li>
          <li><b>Programmatic SEO</b>: 16 pre-built templates + 8 blog posts already indexable. Wanderlog is app-first with weak organic SEO.</li>
          <li><b>Open-source AI</b>: Fireworks DeepSeek V3 costs us $0.14/1M tokens vs Wanderlog paying GPT-4 rates. 200× cheaper unit economics.</li>
          <li><b>Real-time collaboration</b> using Supabase Realtime (cost: $0). Wanderlog charges $39.99/yr for this.</li>
          <li><b>Offline maps for national parks</b> — Pro-only feature. Parity with Wanderlog Pro.</li>
          <li><b>Affiliate + subscription hybrid revenue</b>: we monetize free users via Booking.com + GetYourGuide affiliate (2-5% commission) AND Pro subscriptions ($6.99/mo).</li>
        </ul>
      </Section>

      <Section title="💰 Valuation scenarios">
        <p className="mb-4 text-sm text-ink-700">
          SaaS companies today sell at <b>2.5×–8× annual recurring revenue (ARR)</b> depending on size and growth
          (source: L40°, Windsor Drake 2026 comparables). Travel tech is at the lower end. Here are 3 realistic scenarios:
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <ScenarioCard tier="Today (Aug 2026)" arr="$0 (pre-revenue)" value="$50K-$200K" note="Asset value: MVP working, 17 sessions of code, 24 SEO pages indexable, brand asset" tone="coral" />
          <ScenarioCard tier="Year 1 (Aug 2027)" arr="$42K ARR" value="$100K-$170K" note="500 paying Pro users × $6.99/mo × 12 · 2.5-4× ARR multiple (micro-SaaS band)" tone="ocean" />
          <ScenarioCard tier="Year 3 (Aug 2029)" arr="$1.25M ARR" value="$5M-$7.5M" note="15,000 Pro users + affiliate revenue · 4-6× ARR multiple (bootstrapped $1-5M band)" tone="emerald" />
        </div>
        <p className="mt-4 text-xs text-ink-500">
          These are conservative benchmarks against publicly-available comparables. Optimistic scenario (top decile
          travel SaaS): 8-10× ARR at scale. Wanderlog itself is estimated at $100K-$5M revenue with unknown recent
          valuation but Dealroom lists it as pre-Series-A private.
        </p>
      </Section>

      <Section title="🎯 Growth levers already built">
        <ul className="ml-5 list-disc space-y-2 text-sm text-ink-700">
          <li><b>SEO organic</b>: 24 URLs indexed, hreflang ES/EN, schema.org rich snippets, RSS. Compounding growth channel with zero marginal cost.</li>
          <li><b>Affiliate revenue</b>: Every stop shows Booking + GetYourGuide buttons with our commission ID. Passive income when users click.</li>
          <li><b>Pro subscription</b>: $6.99/mo with 14-day free trial. Stripe wired end-to-end.</li>
          <li><b>Email retention</b>: Welcome + waitlist + trial-ending + weekly digest automated via Resend + Vercel Cron.</li>
          <li><b>PWA installable</b>: "Add to home screen" → app-store-free distribution.</li>
        </ul>
      </Section>

      <Section title="🌎 What this positions us to do">
        <p className="text-sm text-ink-700">
          TripLoop is <b>architected to scale to any road-trip region globally</b>. Adding France, Japan, Mexico, or New
          Zealand takes 1-2 sessions each (proven with Nevada+Arizona+Southwest expansion in Session 14). The
          bilingual foundation is already there — we can add French, Japanese, or any other language with the same
          <code className="mx-1 rounded bg-ink-100 px-1">next-intl</code> infrastructure.
        </p>
        <p className="mt-3 text-sm text-ink-700">
          Strategic acquirers could include: <b>Booking.com, Expedia, Airbnb Experiences, Google (Maps), Roadtrippers,
          Wanderlog</b> itself, or Latin-America-focused travel players (Despegar, Kiwi.com).
        </p>
      </Section>

      <Section title="🧮 Unit economics (illustrative)">
        <Table rows={[
          ['Free user cost', '~$0.02/user/month (Supabase + Vercel serverless)'],
          ['Pro user revenue', '$6.99/mo (or $59.88/yr = $4.99/mo effective)'],
          ['Pro user cost', '~$0.15/user/month (AI + Google Maps + email)'],
          ['Gross margin Pro', '~97% (best-in-class SaaS territory)'],
          ['Affiliate commission avg', '2-5% Booking · 8% GetYourGuide'],
          ['Break-even', '~8-10 Pro users to cover current $25/mo infra baseline'],
          ['CAC blended target', '$5-15 (SEO organic + email retention)'],
          ['LTV Pro (24mo retention)', '~$168 · LTV:CAC ratio 10-30×']
        ]} />
      </Section>

      <Section title="📈 What we&apos;d ask for">
        <p className="text-sm text-ink-700">
          Right now TripLoop is <b>bootstrapped and profitable-by-design</b> — infrastructure costs stay under $50/mo up
          to 1,000 users. A modest capital injection (<b>$30K-$100K</b>) would accelerate:
        </p>
        <ol className="ml-5 mt-3 list-decimal space-y-1.5 text-sm text-ink-700">
          <li>Paid acquisition tests (Meta + Google Ads) to validate CAC before scaling organic</li>
          <li>Content velocity: 50 more blog posts + 30 more templates across 3 new regions</li>
          <li>Sales + community (LATAM outbound, travel bloggers, journalism outreach)</li>
          <li>2nd engineer to unblock founder for growth ops</li>
          <li>Legal + business entity setup (Delaware C-Corp or MX SAPI)</li>
        </ol>
        <p className="mt-4 text-sm font-semibold text-ink-800">
          Ask for a 15-min demo call: hello@triploop.app
        </p>
      </Section>

      <p className="mt-10 text-center text-[10px] text-ink-400">
        Datos consolidados de fuentes públicas (Similarweb, Dealroom, market.us, verifiedmarketresearch, L40° SaaS multiples reports) · Agosto 2026
      </p>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }){
  return (
    <section className="mb-10">
      <h2 className="mb-4 font-display text-2xl font-semibold text-ink-900">{title}</h2>
      <div className="rounded-card border border-ink-100 bg-white p-6 shadow-card">{children}</div>
    </section>
  );
}

function StatCard({ number, label }: { number: string; label: string }){
  return (
    <div className="rounded-card border border-coral-200 bg-gradient-to-br from-coral-50 to-white p-4 text-center">
      <div className="font-display text-3xl font-semibold text-ink-900">{number}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-ink-500">{label}</div>
    </div>
  );
}

function ScenarioCard({ tier, arr, value, note, tone }: { tier: string; arr: string; value: string; note: string; tone: 'coral' | 'ocean' | 'emerald' }){
  const bg = tone === 'coral' ? 'from-coral-50 border-coral-200' : tone === 'ocean' ? 'from-ocean-400/10 border-ocean-400/30' : 'from-emerald-50 border-emerald-200';
  return (
    <div className={`rounded-card border bg-gradient-to-br to-white p-4 ${bg}`}>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">{tier}</div>
      <div className="mt-1 text-xs text-ink-600">{arr}</div>
      <div className="mt-2 font-display text-2xl font-semibold text-ink-900">{value}</div>
      <p className="mt-2 text-xs leading-snug text-ink-500">{note}</p>
    </div>
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
