'use client';
import { useEffect } from 'react';
import { BudgetCard } from './BudgetCard';
import { InsightsCard } from './InsightsCard';
import type { Trip } from '@/lib/types';

interface Props {
  open: boolean;
  onClose: () => void;
  view: 'budget' | 'insights';
  trip: Trip;
  locale: 'en' | 'es';
}

export function TripSidePanel({ open, onClose, view, trip, locale }: Props){
  const isEs = locale === 'es';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if(e.key === 'Escape') onClose(); };
    if(open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if(!open) return null;

  return (
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-gradient-to-br from-white to-ink-50/40 p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink-900">
            {view === 'budget'
              ? (isEs ? 'Presupuesto' : 'Budget')
              : (isEs ? 'Alertas y consejos' : 'Warnings & tips')}
          </h2>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 bg-white text-ink-500 transition hover:border-ink-800 hover:text-ink-800"
            aria-label={isEs ? 'Cerrar' : 'Close'}
          >✕</button>
        </div>

        {view === 'budget' ? (
          <BudgetCard
            totalDistanceMeters={trip.total_distance_m || 0}
            daysCount={trip.days_count || 3}
            travelers={trip.travelers_count || 2}
            stops={trip.stops || []}
            region={trip.region || undefined}
            currency={(trip.currency || 'USD') as 'USD' | 'EUR' | 'MXN' | 'GBP' | 'CAD' | 'AUD'}
            locale={locale}
          />
        ) : (
          <InsightsCard slug={trip.slug} locale={locale} />
        )}
      </div>
    </div>
  );
}
