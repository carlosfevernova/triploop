'use client';
import { useMemo, useState } from 'react';
import type { Trip, TripStop } from '@/lib/types';
import { bookingSearchUrl, gygSearchUrl, estimateStayDates, isAffiliateActive, type HotelTier } from '@/lib/affiliate';

interface Props {
  open: boolean;
  onClose: () => void;
  trip: Trip;
  isEs?: boolean;
  locale?: string;
}

type Tab = 'stays' | 'activities';

export function StaysAndActivitiesPanel({ open, onClose, trip, isEs, locale = 'en' }: Props){
  const [tab, setTab] = useState<Tab>('stays');
  const [selectedStopId, setSelectedStopId] = useState<string>(trip.stops[0]?.id || '');
  const [tier, setTier] = useState<HotelTier | 'any'>('any');
  const [centralOnly, setCentralOnly] = useState(false);

  // Unique cities: usa el nombre del stop, deduplicated
  const cities = useMemo(() => {
    const seen = new Set<string>();
    const list: TripStop[] = [];
    for(const s of trip.stops){
      const key = (s.address || s.name).split(',')[0].trim().toLowerCase();
      if(!seen.has(key)){ seen.add(key); list.push(s); }
    }
    return list;
  }, [trip.stops]);

  const selectedStop = trip.stops.find((s) => s.id === selectedStopId) || trip.stops[0];
  const { checkin, checkout } = estimateStayDates(trip.start_date, Math.max(2, Math.floor(trip.days_count / Math.max(1, cities.length))));

  const track = (destination: string, provider: 'gyg' | 'booking') => {
    // Fire-and-forget analytics ping. No aggressive gating (comisión ya tracked via cmp= param).
    try {
      fetch('/api/analytics/affiliate-click', {
        method: 'POST',
        keepalive: true,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slug: trip.slug, stop_id: selectedStopId, destination, provider, ts: Date.now()
        })
      }).catch(() => {});
    } catch { /* ignore */ }
  };

  if(!open) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm" aria-hidden />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl">
        {/* Header */}
        <header className="border-b border-ink-100 bg-gradient-to-br from-emerald-50 via-white to-ocean-400/5 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🎫</span>
                <h2 className="font-display text-xl font-semibold text-ink-900">
                  {isEs ? 'Hospedaje y actividades' : 'Stays & activities'}
                </h2>
              </div>
              <p className="mt-1 text-xs text-ink-500">
                {isEs
                  ? 'Reserva hoteles y tours para cada parada.'
                  : 'Book hotels and tours for every stop in your trip.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-ink-500 transition hover:bg-ink-100"
              aria-label="Close"
            >✕</button>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-1 rounded-pill border border-ink-200 bg-white p-0.5">
            <button
              onClick={() => setTab('stays')}
              className={`flex-1 rounded-pill py-2 text-xs font-semibold transition ${tab === 'stays' ? 'bg-ink-900 text-white' : 'text-ink-700 hover:bg-ink-50'}`}
            >
              🏨 {isEs ? 'Hospedaje' : 'Stays'}
            </button>
            <button
              onClick={() => setTab('activities')}
              className={`flex-1 rounded-pill py-2 text-xs font-semibold transition ${tab === 'activities' ? 'bg-ink-900 text-white' : 'text-ink-700 hover:bg-ink-50'}`}
            >
              🎭 {isEs ? 'Actividades' : 'Activities'}
            </button>
          </div>

          {/* Stop selector */}
          <div className="mt-3">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-ink-400">
              {isEs ? 'Buscar para' : 'Search for'}
            </label>
            <select
              value={selectedStopId}
              onChange={(e) => setSelectedStopId(e.target.value)}
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800 focus:border-ink-500 focus:outline-none"
            >
              {trip.stops.map((s, i) => (
                <option key={s.id} value={s.id}>{i + 1}. {s.name}</option>
              ))}
            </select>
          </div>
        </header>

        {/* FTC disclosure (persistent) */}
        <div className="border-b border-amber-200 bg-amber-50 px-6 py-2 text-[10px] text-amber-800">
          {isEs
            ? 'Aviso: TripLoop recibe una comisión de socios (Booking, GetYourGuide) cuando reservas mediante estos links. Tú no pagas de más. '
            : 'Disclosure: TripLoop earns a commission from partners (Booking, GetYourGuide) when you book through these links. You never pay more. '}
          <a href={`/${locale}/affiliate-disclosure`} className="font-semibold underline">
            {isEs ? 'Ver aviso completo →' : 'Learn more →'}
          </a>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-4">
          {!selectedStop ? (
            <p className="py-16 text-center text-sm text-ink-400">
              {isEs ? 'Agrega paradas al viaje para buscar aquí.' : 'Add stops to your trip to search here.'}
            </p>
          ) : tab === 'stays' ? (
            <>
              {/* Tier + central filters */}
              <div className="mb-3 space-y-2 rounded-card border border-ink-100 bg-ink-50/30 p-3">
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-ink-500">
                    {isEs ? 'Tarifa' : 'Tier'}
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { k: 'any' as const, label: isEs ? 'Todas' : 'All' },
                      { k: 'low' as const, label: isEs ? '💵 Econ (1-2★)' : '💵 Budget (1-2★)' },
                      { k: 'mid' as const, label: isEs ? '💰 Medio (3★)' : '💰 Mid (3★)' },
                      { k: 'high' as const, label: isEs ? '💎 Alto (4-5★)' : '💎 High (4-5★)' }
                    ].map(t => (
                      <button
                        key={t.k} onClick={() => setTier(t.k)}
                        className={`rounded-pill px-2.5 py-1 text-[11px] font-semibold transition ${tier === t.k ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 border border-ink-200 hover:border-ink-500'}`}
                      >{t.label}</button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-ink-700">
                  <input type="checkbox" checked={centralOnly} onChange={(e) => setCentralOnly(e.target.checked)} className="h-4 w-4" />
                  {isEs ? '📍 Solo hoteles céntricos (downtown, cerca de puntos icónicos)' : '📍 Central hotels only (downtown, near landmarks)'}
                </label>
              </div>
              <StaysCard stop={selectedStop} checkin={checkin} checkout={checkout} guests={trip.travelers_count || 2} isEs={isEs} locale={locale} onTrack={track} tier={tier === 'any' ? undefined : tier} centralOnly={centralOnly} />
            </>
          ) : (
            <ActivitiesCard stop={selectedStop} isEs={isEs} locale={locale} onTrack={track} />
          )}

          {/* Bulk actions: aplica a todas las ciudades del trip */}
          <div className="mt-6 border-t border-ink-100 pt-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
              {isEs ? 'Búsqueda multi-ciudad' : 'Multi-city quick search'}
            </p>
            <ul className="space-y-1.5">
              {cities.slice(0, 6).map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-2 rounded-lg border border-ink-100 bg-white px-3 py-2 text-xs">
                  <span className="truncate font-semibold text-ink-800">{s.name}</span>
                  <span className="flex gap-1">
                    <a
                      href={bookingSearchUrl(s.name, { checkin, checkout, guests: trip.travelers_count || 2, locale, source: 'bulk' })}
                      target="_blank" rel="noreferrer sponsored nofollow"
                      onClick={() => track(s.name, 'booking')}
                      className="rounded-pill bg-ocean-400 px-2.5 py-1 text-[10px] font-semibold text-white hover:brightness-110"
                    >🏨</a>
                    <a
                      href={gygSearchUrl(s.name, { locale, source: 'bulk' })}
                      target="_blank" rel="noreferrer sponsored nofollow"
                      onClick={() => track(s.name, 'gyg')}
                      className="rounded-pill bg-coral-500 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-coral-600"
                    >🎭</a>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {!isAffiliateActive() && (
            <div className="mt-4 rounded-card border border-dashed border-ink-200 bg-ink-50/50 p-3 text-[10px] text-ink-500">
              <strong>Dev mode:</strong> setea <code>NEXT_PUBLIC_GETYOURGUIDE_PARTNER_ID</code> y{' '}
              <code>NEXT_PUBLIC_BOOKING_AID</code> en Vercel para activar tracking de comisión.
              Los links funcionan sin ellos (sin revenue).
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function StaysCard({ stop, checkin, checkout, guests, isEs, locale, onTrack, tier, centralOnly }: {
  stop: TripStop; checkin: string; checkout: string; guests: number;
  isEs?: boolean; locale: string; onTrack: (dest: string, p: 'gyg' | 'booking') => void;
  tier?: HotelTier; centralOnly?: boolean;
}){
  const url = bookingSearchUrl(stop.name, { checkin, checkout, guests, locale, source: 'panel', tier, centralOnly });
  return (
    <div className="overflow-hidden rounded-card border border-ink-100 bg-white shadow-card">
      {stop.photo_url ? (
        <img src={stop.photo_url} alt="" className="h-40 w-full object-cover" loading="lazy" />
      ) : (
        <div className="grid h-40 w-full place-items-center bg-gradient-to-br from-ocean-400/20 to-ocean-400/5 text-4xl">🏨</div>
      )}
      <div className="p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-ink-900">
            {isEs ? 'Hoteles en' : 'Hotels near'} {stop.name}
          </h3>
          <div className="flex gap-1">
            {tier && (
              <span className="rounded-pill bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                {tier === 'low' ? '1-2★' : tier === 'mid' ? '3★' : '4-5★'}
              </span>
            )}
            {centralOnly && (
              <span className="rounded-pill bg-ocean-100 px-2 py-0.5 text-[10px] font-bold text-ocean-800">
                📍 {isEs ? 'Céntrico' : 'Central'}
              </span>
            )}
          </div>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-ink-500">
          <div>
            <div className="font-semibold text-ink-800">{formatDate(checkin, isEs)}</div>
            <div>{isEs ? 'llegada' : 'check-in'}</div>
          </div>
          <div>
            <div className="font-semibold text-ink-800">{formatDate(checkout, isEs)}</div>
            <div>{isEs ? 'salida' : 'check-out'}</div>
          </div>
          <div>
            <div className="font-semibold text-ink-800">{guests}</div>
            <div>{isEs ? 'huéspedes' : 'guests'}</div>
          </div>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer sponsored nofollow"
          onClick={() => onTrack(stop.name, 'booking')}
          className="mt-5 block w-full rounded-pill bg-ocean-400 py-3 text-center text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
        >
          {isEs ? 'Ver hoteles en Booking.com →' : 'Find hotels on Booking.com →'}
        </a>
        <p className="mt-2 text-[10px] text-ink-400">
          {isEs
            ? 'Precios reales con impuestos incluidos en Booking. Cancelación gratis en la mayoría.'
            : 'Booking.com shows tax-included prices. Free cancellation on most rooms.'}
        </p>
      </div>
    </div>
  );
}

function ActivitiesCard({ stop, isEs, locale, onTrack }: {
  stop: TripStop; isEs?: boolean; locale: string; onTrack: (dest: string, p: 'gyg' | 'booking') => void;
}){
  const url = gygSearchUrl(stop.name, { locale, source: 'panel' });
  return (
    <div className="overflow-hidden rounded-card border border-ink-100 bg-white shadow-card">
      {stop.photo_url ? (
        <img src={stop.photo_url} alt="" className="h-40 w-full object-cover" loading="lazy" />
      ) : (
        <div className="grid h-40 w-full place-items-center bg-gradient-to-br from-coral-500/20 to-coral-500/5 text-4xl">🎭</div>
      )}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-ink-900">
          {isEs ? 'Actividades y tours en' : 'Tours & activities in'} {stop.name}
        </h3>
        <p className="mt-2 text-xs text-ink-500">
          {isEs
            ? 'Skip-the-line, tours guiados y experiencias con cancelación 24h antes.'
            : 'Skip-the-line, guided tours and experiences with free cancellation up to 24h before.'}
        </p>
        <a
          href={url}
          target="_blank"
          rel="noreferrer sponsored nofollow"
          onClick={() => onTrack(stop.name, 'gyg')}
          className="mt-5 block w-full rounded-pill bg-coral-500 py-3 text-center text-sm font-semibold text-white shadow-glow transition hover:bg-coral-600"
        >
          {isEs ? 'Ver actividades en GetYourGuide →' : 'Find activities on GetYourGuide →'}
        </a>
      </div>
    </div>
  );
}

function formatDate(iso: string, isEs?: boolean){
  const d = new Date(iso);
  return d.toLocaleDateString(isEs ? 'es-MX' : 'en-US', { month: 'short', day: 'numeric' });
}
