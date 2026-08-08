import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createPublicClient } from '@/lib/supabase-admin';
import type { RouteLeg, Trip, TripStop } from '@/lib/types';
import { PrintTrigger, PrintButton } from './PrintTrigger';
import { formatDistance, formatDuration } from '@/lib/format';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Print — ${slug} — TripLoop`, robots: { index: false, follow: false } };
}

// SSR sin caché para siempre reflejar últimos cambios
export const dynamic = 'force-dynamic';

async function getTrip(slug: string): Promise<Trip | null> {
  const sb = createPublicClient();
  const { data } = await sb.from('trips').select('*').eq('slug', slug).maybeSingle();
  return (data as Trip) || null;
}

function staticMapUrl(stops: TripStop[], apiKey: string | undefined){
  if(!apiKey || stops.length === 0) return null;
  const markers = stops.map((s, i) => `markers=color:red%7Clabel:${i + 1}%7C${s.lat},${s.lng}`).join('&');
  const path = stops.length > 1
    ? `&path=color:0xFF5A5FCC|weight:4|` + stops.map(s => `${s.lat},${s.lng}`).join('|')
    : '';
  return `https://maps.googleapis.com/maps/api/staticmap?size=1200x600&scale=2&maptype=roadmap&${markers}${path}&key=${apiKey}`;
}

export default async function TripPrintPage({ params }: PageProps){
  const { locale, slug } = await params;
  const isEs = locale === 'es';
  const trip = await getTrip(slug);
  if(!trip) notFound();

  const stops = trip.stops || [];
  const legs = (trip.route_geometry?.legs || []) as RouteLeg[];
  const totalDist = trip.total_distance_m || 0;
  const totalDur = trip.total_duration_s || 0;
  const mapUrl = staticMapUrl(stops, process.env.GOOGLE_MAPS_API_KEY);

  return (
    <>
      <PrintTrigger />
      <article className="print-doc mx-auto max-w-[900px] bg-white p-8 text-ink-800 print:max-w-full print:p-0">
        {/* Cover */}
        <header className="mb-10 border-b-2 border-coral-500 pb-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-coral-500 text-sm font-semibold text-white">t</div>
              <span className="font-display text-lg font-semibold">TripLoop</span>
            </div>
            <PrintButton label={isEs ? 'Imprimir / PDF' : 'Print / Save as PDF'} />
          </div>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight">{trip.title}</h1>
          <div className="mt-2 text-sm text-ink-500">
            {trip.origin_city}{trip.destination_city && trip.destination_city !== trip.origin_city ? ` → ${trip.destination_city}` : ''}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-4 border-t border-ink-100 pt-4 text-center">
            <Stat label={isEs ? 'Días' : 'Days'} value={String(trip.days_count)} />
            <Stat label={isEs ? 'Paradas' : 'Stops'} value={String(stops.length)} />
            {totalDist > 0 && <Stat label={isEs ? 'Distancia' : 'Distance'} value={formatDistance(totalDist, trip.unit_system)} />}
            {totalDur > 0 && <Stat label={isEs ? 'Manejo' : 'Drive time'} value={formatDuration(totalDur)} />}
          </div>
        </header>

        {/* Static map */}
        {mapUrl && (
          <section className="mb-10 break-inside-avoid">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mapUrl} alt="Trip route" className="w-full rounded-card border border-ink-100" />
            <p className="mt-2 text-center text-[10px] text-ink-400">{isEs ? 'Mapa del recorrido' : 'Route overview map'}</p>
          </section>
        )}

        {/* Itinerary */}
        <section className="mb-10">
          <h2 className="mb-4 font-display text-2xl font-semibold text-ink-900">
            {isEs ? 'Itinerario' : 'Itinerary'}
          </h2>
          <ol className="space-y-3">
            {stops.map((stop, i) => {
              const leg = legs[i];
              return (
                <li key={stop.id || i} className="break-inside-avoid rounded-card border border-ink-100 p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-coral-500 text-xs font-semibold text-white">{i + 1}</div>
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-base font-semibold text-ink-900">{stop.name}</div>
                      {stop.address && <div className="text-xs text-ink-500">{stop.address}</div>}
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-ink-500">
                        {stop.duration_min ? <span>⏱ {formatMin(stop.duration_min, isEs)}</span> : null}
                        {stop.rating ? <span className="text-amber-600">★ {stop.rating.toFixed(1)}</span> : null}
                        {stop.phone ? <span>📞 {stop.phone}</span> : null}
                        {stop.website ? <span className="truncate">🌐 {stop.website.replace(/^https?:\/\//, '').slice(0, 40)}</span> : null}
                      </div>
                      {stop.notes && <p className="mt-2 text-xs text-ink-700">{stop.notes}</p>}
                    </div>
                  </div>
                  {leg && (
                    <div className="ml-11 mt-3 flex items-center gap-2 border-t border-dashed border-ink-100 pt-2 text-[10px] text-ink-500">
                      <span className="text-coral-500">↓</span>
                      <span className="font-semibold text-ink-700">{formatDistance(leg.distance_m, trip.unit_system)}</span>
                      <span>·</span>
                      <span className="font-semibold text-ink-700">{formatDuration(leg.duration_traffic_s || leg.duration_s)}</span>
                      <span>{isEs ? 'al siguiente destino' : 'to next stop'}</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        {/* Booking summary — quick reference para llevar impreso */}
        <section className="mb-10 break-inside-avoid rounded-card border border-ink-200 bg-ink-50/50 p-5">
          <h2 className="mb-3 font-display text-lg font-semibold text-ink-900">
            {isEs ? 'Reservas y contactos' : 'Bookings & contacts'}
          </h2>
          <p className="mb-3 text-xs text-ink-600">
            {isEs
              ? 'Espacio para anotar códigos de reserva, número de habitación, contactos locales.'
              : 'Space to jot down confirmation codes, room numbers, local contacts.'}
          </p>
          <div className="space-y-2">
            {stops.slice(0, 8).map((s, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-ink-100 pb-1">
                <span className="w-6 text-xs font-semibold text-ink-500">{i + 1}.</span>
                <span className="w-40 truncate text-xs font-semibold">{s.name}</span>
                <span className="flex-1 text-[10px] text-ink-400">
                  {isEs ? 'Hotel / Actividad / Confirmación:' : 'Hotel / Activity / Confirmation:'} ______________________
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-ink-100 pt-4 text-center text-[10px] text-ink-400">
          {isEs
            ? `Generado desde triploop-six.vercel.app · ${new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}`
            : `Generated from triploop-six.vercel.app · ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`}
        </footer>
      </article>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }){
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">{label}</div>
      <div className="mt-0.5 font-display text-lg font-semibold text-ink-900">{value}</div>
    </div>
  );
}

function formatMin(min: number, isEs?: boolean){
  if(min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : (isEs ? `${h}h` : `${h}h`);
}
