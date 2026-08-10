'use client';
import { useEffect } from 'react';
import { BudgetCard } from './BudgetCard';
import { FinancialTracker } from './FinancialTracker';
import { calculateBudget } from '@/lib/budget-calculator';
import { InsightsCard } from './InsightsCard';
import { ChecklistCard } from './ChecklistCard';
import { PhotoSpotsCard } from './PhotoSpotsCard';
import { EVChargersCard } from './EVChargersCard';
import type { Trip } from '@/lib/types';
import { L } from '@/lib/l4';
import type { Locale } from '@/i18n/request';

// S71n: 4-locale migration. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
export type SidePanelView = 'budget' | 'insights' | 'checklist' | 'photos' | 'ev';

interface Props {
  open: boolean;
  onClose: () => void;
  view: SidePanelView;
  trip: Trip;
  locale: string;
}

export function TripSidePanel({ open, onClose, view, trip, locale }: Props){
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if(e.key === 'Escape') onClose(); };
    if(open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if(!open) return null;

  const titles: Record<SidePanelView, Record<Locale, string>> = {
    budget:    { en: 'Budget',            es: 'Presupuesto',        pt: 'Orçamento',           de: 'Budget' },
    insights:  { en: 'Warnings & tips',   es: 'Alertas y consejos', pt: 'Alertas e dicas',     de: 'Warnungen & Tipps' },
    checklist: { en: 'What to pack',      es: 'Qué llevar',         pt: 'O que levar',         de: 'Was einpacken' },
    photos:    { en: 'Photo spots',       es: 'Spots de foto',      pt: 'Pontos fotográficos', de: 'Foto-Spots' },
    ev:        { en: 'EV chargers',       es: 'Cargadores EV',      pt: 'Carregadores EV',     de: 'E-Ladestationen' }
  };
  const title = L(locale, titles[view]);

  const firstStop = trip.stops?.[0];

  return (
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-gradient-to-br from-white to-ink-50/40 p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink-900">{title}</h2>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 bg-white text-ink-500 transition hover:border-ink-800 hover:text-ink-800"
            aria-label={L(locale, { en: 'Close', es: 'Cerrar', pt: 'Fechar', de: 'Schließen' })}
          >✕</button>
        </div>

        {view === 'budget' && (
          <div className="space-y-4">
            <BudgetCard
              totalDistanceMeters={trip.total_distance_m || 0}
              daysCount={trip.days_count || 3}
              travelers={trip.travelers_count || 2}
              stops={trip.stops || []}
              region={trip.region || undefined}
              currency={(trip.currency || 'USD') as 'USD' | 'EUR' | 'MXN' | 'GBP' | 'CAD' | 'AUD'}
              locale={locale as 'en' | 'es'}
            />
            {/* S43 P1: Financial tracker (booked/actual/remaining) — requires auth (RLS) */}
            {(() => {
              const b = calculateBudget({
                totalDistanceMeters: trip.total_distance_m || 0,
                daysCount: trip.days_count || 3,
                travelers: trip.travelers_count || 2,
                stopsCount: (trip.stops || []).length,
                region: trip.region || undefined,
                currency: (trip.currency || 'USD') as 'USD' | 'EUR' | 'MXN' | 'GBP' | 'CAD' | 'AUD',
                tier: 'mid'
              });
              return (
                <FinancialTracker
                  slug={trip.slug}
                  budgeted={{ gas: b.gas, hotels: b.hotels, food: b.food, attractions: b.attractions, buffer: b.buffer, total: b.total }}
                  currency={b.currency}
                  symbol={b.symbol}
                  locale={locale as 'en' | 'es'}
                />
              );
            })()}
          </div>
        )}
        {view === 'insights' && <InsightsCard slug={trip.slug} locale={locale as 'en' | 'es'} />}
        {view === 'checklist' && <ChecklistCard slug={trip.slug} locale={locale as 'en' | 'es'} />}
        {view === 'photos' && <PhotoSpotsCard slug={trip.slug} locale={locale as 'en' | 'es'} />}
        {view === 'ev' && firstStop && <EVChargersCard lat={firstStop.lat} lng={firstStop.lng} locale={locale as 'en' | 'es'} />}
        {view === 'ev' && !firstStop && (
          <p className="rounded-card border border-ink-100 bg-white p-6 text-sm text-ink-500">
            {L(locale, {
              en: 'Add at least one stop to search EV chargers nearby.',
              es: 'Agrega al menos una parada para buscar cargadores EV cercanos.',
              pt: 'Adicione pelo menos uma parada para buscar carregadores EV próximos.',
              de: 'Füge mindestens einen Stopp hinzu, um E-Ladestationen in der Nähe zu suchen.'
            })}
          </p>
        )}
      </div>
    </div>
  );
}
