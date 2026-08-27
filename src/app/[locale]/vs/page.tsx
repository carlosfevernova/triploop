import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import type { Locale } from '@/i18n/request';

export const revalidate = 3600; // 1h ISR — comparison data changes rarely
export const metadata = {
  title: 'TripLoop vs Wanderlog vs Mindtrip vs Roadtrippers — comparison',
  description: 'How TripLoop compares to Wanderlog, Mindtrip, Roadtrippers, Layla, GuideGeek. AI planning-first + curated content + multi-locale native.',
  robots: { index: true, follow: true }
};

interface Row {
  feature: string;
  triploop: string | boolean;
  wanderlog: string | boolean;
  mindtrip: string | boolean;
  roadtrippers: string | boolean;
  layla: string | boolean;
}

const ROWS: Row[] = [
  { feature: 'AI trip generation (multi-day, full itinerary)', triploop: 'streaming SSE, 6-provider fallback', wanderlog: 'basic AI suggestions', mindtrip: 'chat-first discovery', roadtrippers: false, layla: 'chat-first' },
  { feature: 'Curated content moat (verified POIs)', triploop: '231 across 24 regions', wanderlog: 'user-generated', mindtrip: 'partner-licensed', roadtrippers: '30k+ (legacy)', layla: 'partner data' },
  { feature: 'Streaming responses (first result <1s)', triploop: '500ms first stop', wanderlog: false, mindtrip: '~2s', roadtrippers: false, layla: '~2s' },
  { feature: 'Native locales (hand-authored, not runtime MT)', triploop: 'EN · ES · PT-BR · DE-DE', wanderlog: 'EN only', mindtrip: 'EN only', roadtrippers: 'EN + FR + DE (partial)', layla: 'EN only' },
  { feature: 'PWA with offline queue', triploop: 'Serwist + IndexedDB', wanderlog: 'native app only', mindtrip: false, roadtrippers: 'native app only', layla: false },
  { feature: 'WhatsApp bot integration', triploop: 'Twilio webhook', wanderlog: false, mindtrip: false, roadtrippers: false, layla: false },
  { feature: 'Real-time collab (multi-user editing)', triploop: 'Supabase Realtime + presence', wanderlog: 'yes', mindtrip: false, roadtrippers: 'read-only share', layla: false },
  { feature: 'Trip export (iCal + Wallet)', triploop: 'ICS + Apple Wallet JSON', wanderlog: 'PDF only', mindtrip: false, roadtrippers: 'PDF only', layla: false },
  { feature: 'Stripe subscriptions wired', triploop: 'Checkout + Portal + Webhook + idempotency', wanderlog: 'yes', mindtrip: 'yes', roadtrippers: 'yes', layla: 'yes' },
  { feature: 'Admin AI cost dashboard', triploop: 'per-provider breakdown', wanderlog: false, mindtrip: false, roadtrippers: false, layla: false },
  { feature: 'Feature flags runtime (no redeploy)', triploop: '10 typed flags + admin UI', wanderlog: false, mindtrip: false, roadtrippers: false, layla: false },
  { feature: 'Public MIT-licensed source', triploop: '140+ commits public', wanderlog: false, mindtrip: false, roadtrippers: false, layla: false },
  { feature: 'For sale as asset', triploop: '$35K firm', wanderlog: false, mindtrip: false, roadtrippers: 'acquired 2018', layla: 'acquired by Expedia Jul 2026' }
];

function Cell({ value }: { value: string | boolean }){
  if (value === false) return <span className="text-ink-300">—</span>;
  if (value === true) return <span className="text-emerald-600 font-semibold">✓</span>;
  return <span className="text-ink-700">{value}</span>;
}

export default async function VsPage({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Nav locale={locale as Locale} />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10 text-center">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-coral-600">Comparison · 2026-08</p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900 md:text-5xl">TripLoop vs the rest</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-500">
            How we compare to Wanderlog, Mindtrip, Roadtrippers, and Layla. Feature-by-feature, no hedging.
          </p>
        </header>

        <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-card">
          <table className="w-full text-[13px]">
            <thead className="border-b border-ink-100 bg-ink-50/60 sticky top-0">
              <tr>
                <th className="px-3 py-3 text-left font-semibold text-ink-700 min-w-[240px]">Feature</th>
                <th className="px-3 py-3 text-left font-semibold text-coral-700 bg-coral-50">TripLoop</th>
                <th className="px-3 py-3 text-left font-semibold text-ink-600">Wanderlog</th>
                <th className="px-3 py-3 text-left font-semibold text-ink-600">Mindtrip</th>
                <th className="px-3 py-3 text-left font-semibold text-ink-600">Roadtrippers</th>
                <th className="px-3 py-3 text-left font-semibold text-ink-600">Layla</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row.feature} className={i % 2 ? 'bg-ink-50/30' : ''}>
                  <td className="px-3 py-2.5 font-medium text-ink-800">{row.feature}</td>
                  <td className="px-3 py-2.5 bg-coral-50/50"><Cell value={row.triploop} /></td>
                  <td className="px-3 py-2.5"><Cell value={row.wanderlog} /></td>
                  <td className="px-3 py-2.5"><Cell value={row.mindtrip} /></td>
                  <td className="px-3 py-2.5"><Cell value={row.roadtrippers} /></td>
                  <td className="px-3 py-2.5"><Cell value={row.layla} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-card border border-ink-100 bg-white p-5">
            <h3 className="mb-2 font-display text-lg font-semibold text-ink-900">Where TripLoop wins</h3>
            <ul className="space-y-1 text-[13px] text-ink-600">
              <li>• Multi-provider AI = never blocked</li>
              <li>• 4 native locales (not machine-translated)</li>
              <li>• Full PWA with offline queue</li>
              <li>• AI Concierge in-trip chat</li>
              <li>• Admin cost + flags dashboards</li>
            </ul>
          </div>
          <div className="rounded-card border border-ink-100 bg-white p-5">
            <h3 className="mb-2 font-display text-lg font-semibold text-ink-900">Where competitors win</h3>
            <ul className="space-y-1 text-[13px] text-ink-600">
              <li>• Wanderlog: user-generated content depth</li>
              <li>• Roadtrippers: brand recognition 20+ years</li>
              <li>• Mindtrip: YC-backed distribution</li>
              <li>• Layla: chat UX polish (now Expedia's)</li>
            </ul>
          </div>
          <div className="rounded-card border border-coral-100 bg-coral-50/60 p-5">
            <h3 className="mb-2 font-display text-lg font-semibold text-coral-900">Sector inflection</h3>
            <p className="text-[13px] text-coral-800">
              Layla acquired by Expedia in July 2026 validates AI-travel as strategic priority. TripLoop is 6-9 months ahead of any team starting today.
            </p>
            <a href={`/${locale}/buy`} className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-coral-700 hover:text-coral-900">
              See asset acquisition details →
            </a>
          </div>
        </section>

        <p className="mt-10 text-center text-[11px] text-ink-400">
          Comparison data verified 2026-08-26. Corrections welcome via GitHub Issues.
        </p>
      </main>
      <Footer locale={locale} />
    </>
  );
}
