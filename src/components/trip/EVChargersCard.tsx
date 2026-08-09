'use client';
import { useState, useEffect } from 'react';
import type { EVChargerResult } from '@/app/api/places/ev-chargers/route';
import { ErrorState, EmptyState } from './StateFallbacks';

interface Props {
  lat: number;
  lng: number;
  locale: 'en' | 'es';
}

export function EVChargersCard({ lat, lng, locale }: Props){
  const isEs = locale === 'es';
  const [chargers, setChargers] = useState<EVChargerResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [radiusKm, setRadiusKm] = useState(25);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const r = await fetch('/api/places/ev-chargers', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ lat, lng, radiusKm })
        });
        const data = await r.json();
        if(!r.ok){ setError(data.error || 'load_failed'); return; }
        setChargers(data.chargers || []);
      } catch (e) { setError((e as Error).message); }
      finally { setLoading(false); }
    };
    load();
  }, [lat, lng, radiusKm]);

  if(loading){
    return (
      <div className="rounded-card border border-ink-100 bg-white p-6 shadow-card">
        <div className="flex items-center gap-3">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-ocean-300 border-t-ocean-700" />
          <span className="text-sm text-ink-700">{isEs ? 'Buscando cargadores EV cercanos…' : 'Searching EV chargers nearby…'}</span>
        </div>
      </div>
    );
  }

  if(error){
    return <ErrorState error={error} onRetry={() => setRadiusKm(radiusKm)} locale={locale} />;
  }

  return (
    <div className="rounded-card border border-ink-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-ink-900">
          <span aria-hidden>⚡</span>
          {isEs ? 'Cargadores EV cercanos' : 'EV chargers nearby'}
        </h3>
        <select
          value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))}
          className="rounded-pill border border-ink-200 bg-white px-3 py-1 text-xs font-semibold text-ink-700 focus:border-ocean-500 focus:outline-none"
        >
          <option value={10}>10 km</option>
          <option value={25}>25 km</option>
          <option value={50}>50 km</option>
          <option value={100}>100 km</option>
        </select>
      </div>

      {chargers.length === 0 ? (
        <EmptyState
          icon="⚡"
          title={isEs ? 'Sin cargadores en este radio' : 'No chargers in this radius'}
          hint={isEs ? 'Prueba con 50 km o 100 km.' : 'Try 50 km or 100 km.'}
          cta={radiusKm < 100 ? { label: isEs ? '📏 Ampliar a 100 km' : '📏 Extend to 100 km', onClick: () => setRadiusKm(100) } : undefined}
        />
      ) : (
        <div className="space-y-2">
          {chargers.map(c => (
            <div key={c.id} className="rounded-lg border border-ink-100 bg-white p-3 transition hover:border-ocean-300 hover:shadow-card">
              <div className="mb-1 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {c.operational ? (
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" title={isEs ? 'Operativo' : 'Operational'} />
                    ) : (
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" title={isEs ? 'Verificar estado' : 'Check status'} />
                    )}
                    <span className="truncate text-sm font-semibold text-ink-900">{c.name}</span>
                  </div>
                  {c.address && <div className="mt-0.5 truncate text-[11px] text-ink-500">{c.address}</div>}
                </div>
                <span className="shrink-0 rounded-pill bg-ink-50 px-2 py-0.5 text-[10px] font-bold text-ink-700">
                  {c.distance_km} km
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-ink-600">
                <span className="rounded bg-ocean-50 px-1.5 py-0.5 font-semibold text-ocean-800">⚡ {c.max_power_kw > 0 ? `${c.max_power_kw} kW` : (isEs ? 'Potencia n/d' : 'Power n/a')}</span>
                <span>·</span>
                <span>{c.connectors} {isEs ? 'conectores' : 'connectors'}</span>
                {c.connector_types.length > 0 && (
                  <>
                    <span>·</span>
                    <span className="opacity-75">{c.connector_types.join(', ')}</span>
                  </>
                )}
                {c.operator && c.operator !== 'Unknown' && (
                  <>
                    <span>·</span>
                    <span className="opacity-75">{c.operator}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-[10px] text-ink-400">
        {isEs ? 'Datos: OpenChargeMap · comunidad de EV drivers · actualizado en vivo' : 'Data: OpenChargeMap · EV driver community · live updates'}
      </p>
    </div>
  );
}
