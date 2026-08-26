import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import type { Locale } from '@/i18n/request';

export const revalidate = 300;
export const metadata = {
  title: 'TripLoop demo — try without signup',
  description: 'Experience TripLoop with a pre-populated 5-day California coast trip. No signup, no email, no card. Try AI Concierge, streaming generation, and more.',
  robots: { index: true, follow: true }
};

// Pre-populated demo trip stops (no DB dependency)
const DEMO_STOPS = [
  { name: 'Golden Gate Bridge', day: 1, arrival: '09:00', duration_min: 60, category: 'landmark', notes: 'Arrive before 10am to skip fog. Free parking on Presidio side.' },
  { name: 'Muir Woods National Monument', day: 1, arrival: '11:30', duration_min: 120, category: 'nature', notes: 'Reserve parking in advance ($9.50/car). No cell signal — download offline map.' },
  { name: 'Sausalito Ferry Terminal', day: 1, arrival: '15:30', duration_min: 45, category: 'city', notes: 'Ferry back to SF at 4:30pm for sunset skyline photo.' },
  { name: 'Half Moon Bay', day: 2, arrival: '10:00', duration_min: 90, category: 'coast', notes: 'Cypress Cove is best for surf photos. Coffee at Cameron\'s Pub.' },
  { name: 'Santa Cruz Boardwalk', day: 2, arrival: '14:00', duration_min: 120, category: 'attraction', notes: 'Vintage carousel + wooden roller coaster. Parking $15 all-day.' },
  { name: 'Monterey Bay Aquarium', day: 3, arrival: '09:30', duration_min: 180, category: 'attraction', notes: 'Book online ($60), arrive early — sea otter feeding at 10:30am.' },
  { name: 'Bixby Bridge Overlook', day: 3, arrival: '14:00', duration_min: 30, category: 'landmark', notes: 'Iconic PCH shot. Small pullout, park on shoulder carefully.' },
  { name: 'Big Sur State Park', day: 3, arrival: '15:30', duration_min: 90, category: 'nature', notes: 'McWay Falls trail is 0.6mi easy. Photograph beach from above at 4pm.' },
  { name: 'Hearst Castle', day: 4, arrival: '10:00', duration_min: 180, category: 'landmark', notes: 'Grand Rooms tour ($30). Meet the guides at visitor center 15 min early.' },
  { name: 'Elephant Seal Rookery', day: 4, arrival: '14:00', duration_min: 45, category: 'nature', notes: 'Free vista point, 5 mi north of Hearst Castle. Best in Dec-Mar season.' },
  { name: 'Solvang', day: 5, arrival: '11:00', duration_min: 120, category: 'city', notes: 'Danish village vibes. Aebleskiver at Solvang Restaurant, wine tasting on Copenhagen Drive.' },
  { name: 'Santa Barbara Waterfront', day: 5, arrival: '15:30', duration_min: 90, category: 'city', notes: 'Stearns Wharf sunset walk. Dinner at The Lark (reserve 2 weeks ahead).' }
];

export default async function DemoPage({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Nav locale={locale as Locale} />
      <main>
        <section className="border-b border-ink-100 bg-ink-50/40 py-8">
          <div className="mx-auto max-w-4xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-coral-600">Public demo · No signup required</p>
                <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-900">California Coast — 5 days</h1>
                <p className="mt-1 text-[13px] text-ink-500">Pre-populated trip · 12 stops · 620 km · fuel ~$85 · CO₂ ~120kg</p>
              </div>
              <div className="flex gap-2">
                <a href={`/${locale}/trip/new`} className="rounded-full bg-ink-900 px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-ink-800">
                  Create your own
                </a>
                <a href={`/${locale}/buy`} className="rounded-full border border-ink-300 bg-white px-5 py-2.5 text-[13px] font-semibold text-ink-800 transition hover:border-ink-800">
                  Acquire TripLoop
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-10">
          <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-[13px] text-blue-900">
            <strong>💡 Demo mode:</strong> This is a static preview. Full TripLoop lets you edit stops, generate AI trips from scratch, chat with AI Concierge, export to Google Calendar, and much more. Try the <a href={`/${locale}/trip/new`} className="underline font-semibold">real thing</a> — no signup.
          </div>

          <div className="space-y-6">
            {Array.from(new Set(DEMO_STOPS.map((s) => s.day))).map((day) => (
              <div key={day}>
                <h2 className="mb-3 flex items-baseline gap-3">
                  <span className="rounded-full bg-coral-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">Day {day}</span>
                  <span className="font-display text-lg font-semibold text-ink-800">
                    {DEMO_STOPS.filter((s) => s.day === day).length} stops
                  </span>
                </h2>
                <div className="space-y-3">
                  {DEMO_STOPS.filter((s) => s.day === day).map((stop, i) => (
                    <div key={`${day}-${i}`} className="flex gap-3 rounded-lg border border-ink-100 bg-white p-4">
                      <div className="flex-shrink-0 grid h-10 w-10 place-items-center rounded-full bg-ink-100 text-[13px] font-bold text-ink-700">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="font-display text-base font-semibold text-ink-900">{stop.name}</h3>
                          <div className="text-[11px] font-mono text-ink-500">
                            {stop.arrival} · {stop.duration_min}min · {stop.category}
                          </div>
                        </div>
                        <p className="mt-1.5 text-[13px] text-ink-600">{stop.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-coral-100 bg-coral-50/60 p-6 text-center">
            <h3 className="font-display text-lg font-semibold text-coral-900">Impressed? Try the real thing.</h3>
            <p className="mt-2 text-[13px] text-coral-800">
              Full app has AI generation, streaming SSE, offline mode, 4 native locales, WhatsApp bot, admin dashboard, and much more.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <a href={`/${locale}/trip/new`} className="rounded-full bg-coral-500 px-6 py-2.5 text-[13px] font-semibold text-white transition hover:bg-coral-600">
                Create trip (no signup)
              </a>
              <a href={`/${locale}/vs`} className="rounded-full border border-coral-300 bg-white px-6 py-2.5 text-[13px] font-semibold text-coral-700 transition hover:border-coral-500">
                See vs competitors
              </a>
              <a href={`/${locale}/buy`} className="rounded-full border border-coral-300 bg-white px-6 py-2.5 text-[13px] font-semibold text-coral-700 transition hover:border-coral-500">
                Acquire the app
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
