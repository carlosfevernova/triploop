import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import type { Locale } from '@/i18n/request';

export const revalidate = 3600;
export const metadata = {
  title: 'Buy TripLoop (Asset Sale $55K) — pricing + process + FAQ',
  description: 'TripLoop is for sale as an asset. $55K firm / $65K handoff / $60K bundle. 140+ commits, MIT public, live product. Loom demo on request.',
  robots: { index: true, follow: true }
};

const TIERS = [
  { name: 'Asset only', price: '$55,000', desc: 'MIT-licensed source + 25 migrations + 231 POI seed + 60 templates seed + docs.', includes: ['Full source code', '25 Supabase migrations', '231 curated POI seed', '60 template seed', '2h post-sale video support', 'Optional Vercel alias transfer'], featured: false },
  { name: 'Buy It Now (recommended)', price: '$65,000', desc: 'Everything in Asset + 60-day handoff + 8h consulting. Fastest path to running the business yourself.', includes: ['Everything in Asset only', '60-day handoff walkthrough', '8h total consulting (video)', 'Roadmap consulting session', 'Introductions to 2 buyer-friendly investors if requested'], featured: true },
  { name: 'Bundle w/ FiestaMap', price: '$60,000', desc: 'TripLoop + FiestaMap (LATAM events marketplace) at 16% discount vs individual sum. Two verticals, shared stack.', includes: ['Both codebases', 'Both Supabase migrations', 'Cross-project architecture doc', '12h total post-sale support (8 + 4)', 'Bundle process (7-14 days transfer)'], featured: false }
];

const FAQ = [
  { q: 'Why is TripLoop for sale?', a: 'Focus. The maintainer ships multiple products in parallel. TripLoop needs a full-time operator for partnerships, affiliate deals, and content SEO. Rather than half-serve, transfer to someone who can go full time.' },
  { q: 'Is the AI actually working?', a: 'Yes. Live demo at triploop-six.vercel.app. Multi-provider fallback via OpenRouter free tier as primary. Streaming SSE shows first stop in 500ms. AI Concierge chat widget on every trip page.' },
  { q: 'What comparable acquisitions exist?', a: 'Layla acquired by Expedia in July 2026 (AI travel planner, pre-revenue, undisclosed 8-figure). TripLoop is 6-9 months ahead of any team starting today given multi-provider AI + curated moat + 4-locale native.' },
  { q: 'What is NOT included?', a: 'Supabase project (buyer creates own, migrations transfer cleanly in ~30 min), API keys (buyer\'s own for Google Maps, Stripe, Anthropic, Twilio, Resend, OpenRouter), custom domain (buyer registers), MRR (pre-revenue), trademark (negotiable).' },
  { q: 'How does the transfer work?', a: '1. Signed 2-page asset purchase agreement (template available). 2. 50% payment via Wise/Stripe/PayPal/Escrow.com. 3. GitHub repo ownership transfer. 4. Vercel project transfer (optional). 5. Env vars walkthrough on video. 6. Remaining 50% on complete transfer. Total time: 7-10 days with active buyer.' },
  { q: 'Can I try before I buy?', a: 'Yes. Video call walkthrough is free (~45 min). Deeper eval: $500 refundable-on-purchase gets you 3 days of repo cloned to your GitHub for code review.' },
  { q: 'What if we find a bug post-purchase?', a: 'Post-sale support (2h in Asset tier, 8h in BIN, 12h in Bundle) covers first-week bugs + setup issues. Beyond that, $75/hr consulting rate applies.' },
  { q: 'What if I want a specific feature added before buying?', a: 'Available at $75/hr on delivery. Examples: Booking.com Rapid API real integration = 4-6h. Financial tracker in Budget = 8h. TripLoop Live event detection = 12h. All can be scoped in the pre-purchase call.' }
];

export default async function BuyPage({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Nav locale={locale as Locale} />
      <main>
        <section className="mx-auto max-w-4xl px-6 pt-16 pb-12 text-center">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-coral-600">Asset acquisition · 2026-08</p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900 md:text-5xl">
            Acquire TripLoop
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-500">
            140+ commits, MIT public, 89/89 tests, 4 native locales, multi-provider AI, Stripe wired. Ready to hand off.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="https://github.com/carlosfevernova/triploop/blob/master/FOR_SALE.md" className="rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-ink-800">
              Read full pitch (FOR_SALE.md)
            </a>
            <a href="mailto:hola@nano-almacen.mx?subject=TripLoop%20acquisition%20interest" className="rounded-full border border-ink-300 bg-white px-6 py-3 text-sm font-semibold text-ink-900 transition hover:border-ink-800">
              Email for Loom demo
            </a>
          </div>
        </section>

        <section className="bg-ink-50/40 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-8 text-center font-display text-2xl font-semibold text-ink-900">Three ways to acquire</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {TIERS.map((t) => (
                <div key={t.name} className={`rounded-2xl border p-6 shadow-card ${t.featured ? 'border-coral-300 bg-white ring-2 ring-coral-200' : 'border-ink-100 bg-white'}`}>
                  {t.featured && <div className="mb-3 inline-block rounded-full bg-coral-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Recommended</div>}
                  <h3 className="font-display text-xl font-semibold text-ink-900">{t.name}</h3>
                  <div className="mt-2 font-display text-3xl font-bold text-ink-900">{t.price}</div>
                  <p className="mt-3 text-[13px] text-ink-600">{t.desc}</p>
                  <ul className="mt-4 space-y-1.5 text-[13px]">
                    {t.includes.map((inc) => (
                      <li key={inc} className="flex items-start gap-2">
                        <span className="mt-0.5 text-emerald-600">✓</span>
                        <span className="text-ink-700">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-[11px] text-ink-500">
              Fire sale (7-day close): $28,000 floor. All prices USD, firm. Wise / Stripe / PayPal / Escrow.com accepted.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="mb-8 font-display text-2xl font-semibold text-ink-900">FAQ</h2>
          <div className="space-y-6">
            {FAQ.map((item) => (
              <details key={item.q} className="rounded-lg border border-ink-100 bg-white p-4 group">
                <summary className="cursor-pointer font-semibold text-ink-800 group-open:text-coral-700">
                  {item.q}
                </summary>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-600">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="border-t border-ink-100 bg-white py-12">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h3 className="font-display text-xl font-semibold text-ink-900">Ready to talk?</h3>
            <p className="mt-2 text-[14px] text-ink-600">
              Reply with 1-2 lines on who you are + what you\'d do with it. Response within 24h.
            </p>
            <a href="mailto:hola@nano-almacen.mx?subject=TripLoop%20acquisition%20interest&body=Who%20I%20am%3A%20%0A%0AWhat%20I%27d%20do%20with%20it%3A%20%0A%0ATier%3A%20%5BAsset%20%2455K%20%2F%20BIN%20%2465K%20%2F%20Bundle%20%2460K%5D" className="mt-6 inline-flex items-center rounded-full bg-coral-500 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-coral-600">
              Send acquisition inquiry
            </a>
            <p className="mt-4 text-[11px] text-ink-400">
              Or open a GitHub Issue on carlosfevernova/triploop with tag \'acquisition\'.
            </p>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
