'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { ItineraryItem, TripDay } from '@/lib/itinerary/types';
import type { Trip } from '@/lib/types';
import { formatDateHuman, formatDurationMin, computeEndLocal, parseTimeToMin, formatMinToHHMM } from '@/lib/itinerary/time';
import { computeDayTotals } from '@/lib/itinerary/validate';

// S47 Fase 31: Print/PDF-friendly view of itinerary.
// A4 optimizado, no headers/footers TripLoop app, imprimible directamente.

export default function ItineraryPrintPage(){
  const params = useParams<{ locale: string; slug: string }>();
  const slug = params.slug;
  const locale: 'en' | 'es' = params.locale === 'es' ? 'es' : 'en';
  const isEs = locale === 'es';

  const [trip, setTrip] = useState<Trip | null>(null);
  const [days, setDays] = useState<TripDay[]>([]);
  const [items, setItems] = useState<ItineraryItem[]>([]);

  useEffect(() => {
    (async () => {
      const [tripR, itR] = await Promise.all([
        fetch(`/api/trips/${slug}`).then(r => r.json()),
        fetch(`/api/trips/${slug}/itinerary`).then(r => r.json())
      ]);
      setTrip(tripR.trip);
      setDays(itR.days || []);
      setItems(itR.items || []);
      // Auto-print after 500ms
      setTimeout(() => { if(typeof window !== 'undefined') window.print(); }, 500);
    })();
  }, [slug]);

  if(!trip) return <div className="p-8 text-sm text-ink-500">{isEs ? 'Cargando…' : 'Loading…'}</div>;

  return (
    <main className="mx-auto max-w-3xl bg-white p-8 text-ink-900 print:p-4">
      <style>{`
        @page { size: A4; margin: 12mm; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          h1, h2, h3 { break-after: avoid; }
          .day-section { break-inside: avoid; }
        }
      `}</style>

      {/* Header */}
      <header className="mb-8 border-b-2 border-ink-900 pb-4">
        <div className="flex items-baseline justify-between">
          <h1 className="font-display text-3xl font-bold">{trip.title}</h1>
          <span className="text-xs uppercase tracking-widest text-ink-500">TripLoop</span>
        </div>
        {trip.start_date && trip.end_date && (
          <p className="mt-1 text-sm text-ink-600">{formatDateHuman(trip.start_date, locale)} — {formatDateHuman(trip.end_date, locale)}</p>
        )}
        {trip.destination_city && <p className="mt-0.5 text-xs text-ink-500">📍 {trip.destination_city}</p>}
        <div className="mt-2 text-[10px] text-ink-400">
          {days.length} {isEs ? 'días' : 'days'} · {items.length} {isEs ? 'actividades' : 'activities'}
          {trip.travelers_count > 1 && ` · ${trip.travelers_count} ${isEs ? 'viajeros' : 'travelers'}`}
        </div>
      </header>

      {/* Print button (hidden when printing) */}
      <div className="no-print mb-6 flex gap-2">
        <button
          onClick={() => window.print()}
          className="rounded-pill bg-ink-900 px-5 py-2 text-sm font-semibold text-white hover:bg-ink-700"
        >🖨 {isEs ? 'Imprimir' : 'Print'}</button>
        <a
          href={`/${locale}/trip/${slug}/itinerary`}
          className="rounded-pill border border-ink-200 px-5 py-2 text-sm font-semibold text-ink-700 hover:border-ink-500"
        >← {isEs ? 'Volver' : 'Back'}</a>
      </div>

      {/* Days */}
      {days.map((day) => {
        const dayItems = items.filter(i => i.trip_day_id === day.id).sort((a, b) => a.position - b.position);
        const totals = computeDayTotals(dayItems);
        return (
          <section key={day.id} className="day-section mb-8">
            <h2 className="mb-3 border-b border-ink-300 pb-1 font-display text-xl font-semibold">
              {day.date ? formatDateHuman(day.date, locale) : `${isEs ? 'Día' : 'Day'} ${day.day_number}`}
              {day.title && <span className="ml-2 text-sm font-normal text-ink-500">· {day.title}</span>}
            </h2>
            {dayItems.length === 0 ? (
              <p className="pl-4 text-sm italic text-ink-400">{isEs ? '(sin planes)' : '(no plans)'}</p>
            ) : (
              <>
                <div className="mb-3 text-[11px] text-ink-500">
                  {dayItems.length} {isEs ? 'paradas' : 'stops'}
                  {totals.activityMin > 0 && ` · ${formatDurationMin(totals.activityMin, isEs)} ${isEs ? 'planeadas' : 'planned'}`}
                  {totals.travelKm > 0 && ` · ${totals.travelKm.toFixed(1)} km ${isEs ? 'traslados' : 'travel'}`}
                </div>
                <ol className="space-y-2">
                  {dayItems.map((item, idx) => {
                    const startMin = parseTimeToMin(item.start_local);
                    const endLocal = computeEndLocal(item.start_local, item.duration_min);
                    return (
                      <li key={item.id} className="flex gap-3 text-sm">
                        <span className="w-14 shrink-0 pt-0.5 text-right tabular-nums font-semibold text-ink-700">
                          {startMin !== null ? formatMinToHHMM(startMin) : '—'}
                        </span>
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink-900 text-[10px] font-bold text-white">{idx + 1}</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-ink-900">
                            {item.title}
                            {item.fixed && <span className="ml-1 text-xs">🔒</span>}
                          </div>
                          <div className="text-[11px] text-ink-500">
                            {item.type}
                            {item.duration_min && ` · ${formatDurationMin(item.duration_min, isEs)}`}
                            {endLocal && ` → ${endLocal}`}
                            {item.address && ` · ${item.address}`}
                          </div>
                          {item.notes && <p className="mt-0.5 text-[11px] italic text-ink-600">{item.notes}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </>
            )}
          </section>
        );
      })}

      <footer className="mt-8 border-t border-ink-200 pt-3 text-center text-[9px] uppercase tracking-widest text-ink-400">
        Generated {new Date().toISOString().slice(0, 10)} · triploop-six.vercel.app
      </footer>
    </main>
  );
}
