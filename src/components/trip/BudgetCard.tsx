'use client';
import { useState, useMemo } from 'react';
import { calculateBudget, type BudgetTier, type CurrencyCode } from '@/lib/budget-calculator';
import type { TripStop } from '@/lib/types';

interface Props {
  totalDistanceMeters: number;
  daysCount: number;
  travelers: number;
  stops: TripStop[];
  region?: string;
  currency?: CurrencyCode;
  locale: 'en' | 'es';
}

export function BudgetCard({ totalDistanceMeters, daysCount, travelers, stops, region, currency, locale }: Props){
  const isEs = locale === 'es';
  const [tier, setTier] = useState<BudgetTier>('mid');

  const attractionStopsCount = useMemo(
    () => stops.filter(s => s.category === 'attraction' || s.category === 'nature').length,
    [stops]
  );

  const budget = useMemo(() => calculateBudget({
    totalDistanceMeters,
    daysCount,
    travelers,
    stopsCount: stops.length,
    attractionStopsCount,
    region,
    currency: currency || 'USD',
    tier
  }), [totalDistanceMeters, daysCount, travelers, stops.length, attractionStopsCount, region, currency, tier]);

  const fmt = (n: number) => `${budget.symbol}${n.toLocaleString(isEs ? 'es-MX' : 'en-US')}`;

  const tiers: { k: BudgetTier; label: string; icon: string }[] = [
    { k: 'low', label: isEs ? 'Económico' : 'Budget', icon: '💵' },
    { k: 'mid', label: isEs ? 'Medio' : 'Mid', icon: '💰' },
    { k: 'high', label: isEs ? 'Premium' : 'High', icon: '💎' }
  ];

  const categories = [
    { key: 'gas', label: isEs ? '⛽ Gasolina' : '⛽ Fuel', value: budget.gas, sub: isEs ? `${budget.distanceMiles} mi · ${budget.fuelGallons} gal` : `${budget.distanceMiles} mi · ${budget.fuelGallons} gal` },
    { key: 'hotels', label: isEs ? '🏨 Hoteles' : '🏨 Hotels', value: budget.hotels, sub: isEs ? `${Math.max(1, daysCount - 1)} noches` : `${Math.max(1, daysCount - 1)} nights` },
    { key: 'food', label: isEs ? '🍽️ Comida' : '🍽️ Food', value: budget.food, sub: isEs ? `${travelers}p × ${daysCount}d` : `${travelers}p × ${daysCount}d` },
    { key: 'attractions', label: isEs ? '🎟️ Atracciones' : '🎟️ Attractions', value: budget.attractions, sub: isEs ? `~${Math.ceil(stops.filter(s => s.category === 'attraction' || s.category === 'nature').length)} paradas` : `~${Math.ceil(stops.filter(s => s.category === 'attraction' || s.category === 'nature').length)} stops` },
    { key: 'buffer', label: isEs ? '🎁 Imprevistos (10%)' : '🎁 Buffer (10%)', value: budget.buffer, sub: isEs ? 'recomendado' : 'recommended' }
  ];

  return (
    <div className="rounded-card border border-ink-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold text-ink-900">
          {isEs ? '💰 Presupuesto estimado' : '💰 Estimated budget'}
        </h3>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600">
          {isEs ? 'Datos 2026' : '2026 data'}
        </span>
      </div>

      {/* Tier selector */}
      <div className="mb-5 flex gap-2 rounded-pill border border-ink-100 bg-ink-50/50 p-1">
        {tiers.map(t => (
          <button
            key={t.k} type="button"
            onClick={() => setTier(t.k)}
            className={`flex-1 rounded-pill px-3 py-2 text-xs font-semibold transition ${
              tier === t.k
                ? 'bg-white text-ink-900 shadow-card'
                : 'text-ink-500 hover:text-ink-800'
            }`}
          >
            <span className="mr-1" aria-hidden>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Total hero */}
      <div className="mb-5 rounded-card bg-gradient-to-br from-emerald-50 via-white to-ocean-400/5 p-5 text-center">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-ink-500">
          {isEs ? 'Total estimado' : 'Total estimated'}
        </div>
        <div className="font-display text-4xl font-semibold tabular-nums text-ink-900 md:text-5xl">
          {fmt(budget.total)}
        </div>
        <div className="mt-2 flex items-center justify-center gap-4 text-xs text-ink-500">
          <span>{fmt(budget.totalPerPerson)} <span className="opacity-70">{isEs ? '/persona' : '/person'}</span></span>
          <span className="text-ink-300">·</span>
          <span>{fmt(budget.totalPerDay)} <span className="opacity-70">{isEs ? '/día' : '/day'}</span></span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mb-3 space-y-1.5">
        {categories.map(c => (
          <div key={c.key} className="flex items-baseline justify-between rounded-lg px-2 py-1.5 hover:bg-ink-50/50">
            <div>
              <div className="text-sm font-semibold text-ink-800">{c.label}</div>
              <div className="text-[11px] text-ink-500">{c.sub}</div>
            </div>
            <div className="font-display text-sm font-semibold tabular-nums text-ink-900">{fmt(c.value)}</div>
          </div>
        ))}
      </div>

      {/* Notes */}
      {budget.notes.length > 0 && (
        <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
          {budget.notes.map((n, i) => <div key={i}>ℹ️ {n}</div>)}
        </div>
      )}

      <p className="mt-4 text-[10px] leading-relaxed text-ink-400">
        {isEs
          ? 'Estimación basada en datos 2026 (gas nacional avg $4.50/gal, hoteles avg por tier, food per person). Actual puede variar por temporada + reservas anticipadas.'
          : 'Estimate based on 2026 data (US gas avg $4.50/gal, hotels avg per tier, food per person). Actual may vary by season + advance booking.'}
      </p>
    </div>
  );
}
