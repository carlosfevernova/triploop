import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import type { Locale } from '@/i18n/request';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs
      ? 'Agenda diaria — Planea tu día en 30 segundos · TripLoop'
      : 'Daily Agenda — Plan your day in 30 seconds · TripLoop',
    description: isEs
      ? 'Agenda diaria estilo Google Calendar + timeline: horas, paradas, restaurantes, compromisos. Sin viaje macro, solo tu día. Gratis, sin cuenta.'
      : 'Daily agenda Google Calendar-style + timeline: times, stops, restaurants, appointments. No macro trip needed, just your day. Free, no account.',
    alternates: { canonical: `/${locale}/agenda`, languages: { en: '/en/agenda', es: '/es/agenda' } }
  };
}

export default async function AgendaLanding({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;
  const isEs = locale === 'es';

  return (
    <>
      <Nav locale={locale as Locale} />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-ocean-400/10">
          <div className="grain absolute inset-0 -z-10" />
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.1fr_1fr] md:py-24">
            <div className="flex flex-col justify-center">
              <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-pill border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                {isEs ? 'Nuevo · sin viaje macro necesario' : 'New · no macro trip needed'}
              </span>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900 md:text-5xl">
                {isEs ? 'Tu día, hora por hora.' : 'Your day, hour by hour.'}
              </h1>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink-600">
                {isEs
                  ? 'Agenda diaria estilo Notion Calendar + timeline visual. Agrega paradas, reserva restaurantes, marca compromisos. Cero setup, sin cuenta.'
                  : 'Daily agenda Notion Calendar-style + visual timeline. Add stops, book restaurants, mark appointments. Zero setup, no account.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/agenda/new`}
                  className="group inline-flex items-center gap-2 rounded-pill bg-ink-900 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-ink-700"
                >
                  🗓 {isEs ? 'Crear mi agenda' : 'Create my agenda'}
                  <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
                </Link>
                <Link
                  href={`/${locale}/trip/new`}
                  className="inline-flex items-center gap-2 rounded-pill border border-ink-300 bg-white px-6 py-3 text-sm font-semibold text-ink-800 transition hover:border-ink-500"
                >
                  {isEs ? '¿Múltiples días? Crear ruta' : 'Multiple days? Create trip'}
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-xs text-ink-500">
                <span className="flex items-center gap-1.5"><span aria-hidden>✓</span> {isEs ? 'Sin cuenta' : 'No account'}</span>
                <span className="flex items-center gap-1.5"><span aria-hidden>✓</span> {isEs ? '10 tipos de items' : '10 item types'}</span>
                <span className="flex items-center gap-1.5"><span aria-hidden>✓</span> {isEs ? 'Compartible por URL' : 'Shareable URL'}</span>
              </div>
            </div>

            {/* Mockup agenda */}
            <div className="relative">
              <div className="relative rounded-card border border-ink-100 bg-white p-5 shadow-card-hover">
                <div className="mb-3 border-b border-ink-100 pb-3">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600">
                    {isEs ? 'Hoy' : 'Today'} · Oct 13
                  </div>
                  <div className="mt-0.5 font-display text-lg font-semibold text-ink-900">
                    {isEs ? 'Mi agenda' : 'My agenda'}
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  {[
                    { time: '09:00', title: isEs ? 'Reunión con equipo' : 'Team meeting', emoji: '🎫', dur: '1h' },
                    { time: '10:30', title: isEs ? 'Café con Ana' : 'Coffee with Ana', emoji: '☕', dur: '45m' },
                    { time: '13:00', title: 'Nobu Malibu', emoji: '🍽️', dur: '1h30', badge: isEs ? 'reserva' : 'booked' },
                    { time: '15:00', title: isEs ? 'Museo Getty' : 'Getty Museum', emoji: '🎨', dur: '2h' },
                    { time: '18:00', title: isEs ? 'Yoga' : 'Yoga class', emoji: '🧘', dur: '1h' },
                    { time: '20:00', title: isEs ? 'Cena Alma' : 'Dinner at Alma', emoji: '🍷', dur: '2h', badge: isEs ? 'reserva' : 'booked' }
                  ].map((i, idx) => (
                    <div key={idx} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-emerald-50/40">
                      <span className="w-11 shrink-0 text-right tabular-nums text-[11px] font-semibold text-ink-800">{i.time}</span>
                      <span className="text-lg leading-none" aria-hidden>{i.emoji}</span>
                      <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink-900">{i.title}</span>
                      {i.badge && <span className="rounded-pill bg-emerald-100 px-1.5 py-0 text-[9px] font-bold uppercase text-emerald-700">📅 {i.badge}</span>}
                      <span className="text-[10px] text-ink-400">{i.dur}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-ink-100 pt-3 text-center text-[10px] text-ink-500">
                  6 {isEs ? 'items · 8h 15m planeadas' : 'items · 8h 15m planned'}
                </div>
              </div>
              <div className="absolute -right-3 -top-3 rounded-pill border border-coral-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-coral-700 shadow-card">
                ✨ {isEs ? 'IA editable' : 'AI-editable'}
              </div>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="border-t border-ink-100 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center font-display text-3xl font-semibold text-ink-900">
              {isEs ? '¿Para qué sirve?' : 'What is it for?'}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-ink-500">
              {isEs
                ? 'La agenda diaria no requiere destino ni fechas de viaje. Úsala para cualquier día.'
                : 'The daily agenda doesn\'t require destination or trip dates. Use it for any day.'}
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                { emoji: '🍽️', title: isEs ? 'Reservas del día' : 'Day\'s reservations', body: isEs ? 'Restaurantes, tours, entradas a museos. Marca fixed 🔒 para que la IA no las mueva.' : 'Restaurants, tours, museum tickets. Mark fixed 🔒 so AI won\'t move them.' },
                { emoji: '🎫', title: isEs ? 'Compromisos' : 'Appointments', body: isEs ? 'Reuniones, citas médicas, eventos. Tipo event con priority must.' : 'Meetings, doctor visits, events. Type event with must priority.' },
                { emoji: '🎨', title: isEs ? 'Atracciones' : 'Attractions', body: isEs ? 'Museos, miradores, actividades. Con horarios de apertura verificados via Google Places.' : 'Museums, viewpoints, activities. With opening hours verified via Google Places.' },
                { emoji: '📝', title: isEs ? 'Notas y recordatorios' : 'Notes & reminders', body: isEs ? 'Ideas sueltas o context sin hora. Tipo note.' : 'Loose ideas or context without time. Type note.' },
                { emoji: '☕', title: isEs ? 'Tiempo libre' : 'Free time', body: isEs ? 'Bloques abiertos entre actividades. Tipo free_time visual distinto.' : 'Open blocks between activities. Type free_time visually distinct.' },
                { emoji: '🚗', title: isEs ? 'Traslados' : 'Travel', body: isEs ? 'Auto muestra tiempo entre paradas con Google Routes traffic-aware.' : 'Auto shows time between stops with Google Routes traffic-aware.' }
              ].map(u => (
                <div key={u.title} className="rounded-card border border-ink-100 bg-white p-5">
                  <div className="mb-2 text-2xl">{u.emoji}</div>
                  <h3 className="font-display text-lg font-semibold text-ink-900">{u.title}</h3>
                  <p className="mt-1 text-sm text-ink-600">{u.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-ink-900 py-16 text-white">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-display text-3xl font-semibold">
              {isEs ? 'Empieza tu agenda de hoy' : 'Start today\'s agenda'}
            </h2>
            <p className="mt-3 text-ink-300">
              {isEs ? 'Cero setup. Cero cuenta. Solo tu día, organizado.' : 'Zero setup. Zero account. Just your day, organized.'}
            </p>
            <Link
              href={`/${locale}/agenda/new`}
              className="mt-6 inline-flex items-center gap-2 rounded-pill bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-emerald-600"
            >
              🗓 {isEs ? 'Crear agenda ahora' : 'Create agenda now'} →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
