'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PlacesAutocomplete } from '@/components/trip/PlacesAutocomplete';
import type { PlaceSuggestion, TripStop } from '@/lib/types';

export default function NewTripPage(){
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params.locale;

  const [origin, setOrigin] = useState<PlaceSuggestion | null>(null);
  const [destination, setDestination] = useState<PlaceSuggestion | null>(null);
  const [days, setDays] = useState(7);
  const [travelers, setTravelers] = useState(2);
  const [unit, setUnit] = useState<'metric'|'imperial'>('metric');
  const [currency, setCurrency] = useState('USD');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async () => {
    if(!origin || !destination){
      setError(locale === 'es' ? 'Selecciona origen y destino' : 'Select origin and destination');
      return;
    }
    setCreating(true);
    setError(null);
    const uuid = () => crypto.randomUUID();
    const stops: TripStop[] = [
      { id: uuid(), name: origin.name, address: origin.formatted_address, lat: origin.lat, lng: origin.lng, place_id: origin.place_id, day: 1 },
      { id: uuid(), name: destination.name, address: destination.formatted_address, lat: destination.lat, lng: destination.lng, place_id: destination.place_id, day: days }
    ];
    const title = locale === 'es'
      ? `${origin.name} → ${destination.name}, ${days} días`
      : `${origin.name} → ${destination.name}, ${days} days`;
    try {
      const r = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title,
          origin_city: origin.name,
          destination_city: destination.name,
          days_count: days,
          travelers_count: travelers,
          unit_system: unit,
          currency,
          locale,
          stops
        })
      });
      const data = await r.json();
      if(!r.ok || !data.trip) throw new Error(data.error || 'create_failed');
      router.push(`/${locale}/trip/${data.trip.slug}`);
    } catch (e) {
      setError((e as Error).message);
      setCreating(false);
    }
  };

  const isEs = locale === 'es';

  return (
    <main className="min-h-screen bg-gradient-to-br from-coral-50 via-white to-ocean-400/10">
      <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <div className="mb-10 text-center">
          <span className="mb-4 inline-block rounded-pill border border-coral-200 bg-coral-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-coral-700">
            {isEs ? '30 segundos' : '30 seconds'}
          </span>
          <h1 className="font-display text-display-md text-balance text-ink-900 md:text-display-lg">
            {isEs ? 'Cuéntanos tu viaje' : 'Tell us about your trip'}
          </h1>
          <p className="mt-3 text-lg text-ink-500 text-balance">
            {isEs
              ? 'Generamos un itinerario base que puedes editar libremente después.'
              : 'We generate a starting itinerary you can freely edit after.'}
          </p>
        </div>

        <div className="space-y-5 rounded-card border border-ink-100 bg-white p-8 shadow-card">
          {/* Origin */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-500">
              {isEs ? '¿Dónde empiezas?' : 'Where do you start?'}
            </label>
            {origin ? (
              <div className="flex items-center justify-between rounded-pill border border-emerald-200 bg-emerald-50 px-5 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span>📍</span>
                  <span className="truncate text-sm font-semibold text-ink-900">{origin.name}</span>
                </div>
                <button type="button" onClick={() => setOrigin(null)} className="text-xs text-ink-500 hover:text-ink-800">✕</button>
              </div>
            ) : (
              <PlacesAutocomplete
                placeholder={isEs ? 'Ej. San Francisco, LAX, Yosemite...' : 'e.g. San Francisco, LAX, Yosemite...'}
                onSelect={setOrigin}
                autoFocus
              />
            )}
          </div>

          {/* Destination */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-500">
              {isEs ? '¿Dónde terminas?' : 'Where do you end?'}
            </label>
            {destination ? (
              <div className="flex items-center justify-between rounded-pill border border-emerald-200 bg-emerald-50 px-5 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span>🏁</span>
                  <span className="truncate text-sm font-semibold text-ink-900">{destination.name}</span>
                </div>
                <button type="button" onClick={() => setDestination(null)} className="text-xs text-ink-500 hover:text-ink-800">✕</button>
              </div>
            ) : (
              <PlacesAutocomplete
                placeholder={isEs ? 'Ej. Los Angeles, Las Vegas, LAX...' : 'e.g. Los Angeles, Las Vegas, LAX...'}
                onSelect={setDestination}
              />
            )}
          </div>

          {/* Days + Travelers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-500">
                {isEs ? 'Días' : 'Days'}
              </label>
              <input
                type="number" min={1} max={30} value={days}
                onChange={(e) => setDays(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                className="w-full rounded-pill border border-ink-200 bg-white px-5 py-3 text-sm text-ink-800 outline-none focus:border-coral-500 focus:ring-4 focus:ring-coral-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-500">
                {isEs ? 'Viajeros' : 'Travelers'}
              </label>
              <input
                type="number" min={1} max={20} value={travelers}
                onChange={(e) => setTravelers(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                className="w-full rounded-pill border border-ink-200 bg-white px-5 py-3 text-sm text-ink-800 outline-none focus:border-coral-500 focus:ring-4 focus:ring-coral-100"
              />
            </div>
          </div>

          {/* Unit + Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-500">
                {isEs ? 'Sistema' : 'Units'}
              </label>
              <div className="flex gap-1 rounded-pill border border-ink-200 bg-white p-1">
                {[['metric','km'],['imperial','mi']].map(([val, label]) => (
                  <button
                    key={val} type="button"
                    onClick={() => setUnit(val as 'metric'|'imperial')}
                    className={`flex-1 rounded-pill py-2 text-xs font-semibold transition ${unit === val ? 'bg-ink-900 text-white' : 'text-ink-500 hover:text-ink-800'}`}
                  >{label}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-500">
                {isEs ? 'Moneda' : 'Currency'}
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-pill border border-ink-200 bg-white px-5 py-3 text-sm text-ink-800 outline-none focus:border-coral-500"
              >
                {['USD','EUR','MXN','GBP','CAD','AUD'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-coral-50 px-4 py-3 text-sm text-coral-700">{error}</div>
          )}

          <button
            onClick={create}
            disabled={creating || !origin || !destination}
            className="mt-4 w-full rounded-pill bg-coral-500 py-4 text-sm font-semibold text-white transition hover:bg-coral-600 hover:shadow-glow disabled:opacity-50"
          >
            {creating
              ? (isEs ? 'Creando…' : 'Creating…')
              : (isEs ? '🚗 Crear mi viaje' : '🚗 Create my trip')}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-ink-400">
          {isEs
            ? 'Puedes editar todo después. Sin cuenta necesaria para empezar.'
            : 'You can edit everything after. No account needed to start.'}
        </p>
      </div>
    </main>
  );
}
