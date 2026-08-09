'use client';
import { useRef, useEffect } from 'react';
import type { TripDay } from '@/lib/itinerary/types';
import { formatWeekday, formatDay, isToday } from '@/lib/itinerary/time';

interface Props {
  days: TripDay[];
  selectedDayId: number | null;
  onSelect: (dayId: number | null) => void;
  locale: 'en' | 'es';
  itemsCountByDay: Record<number, number>;
  unscheduledCount?: number;
}

export function DayNavigator({ days, selectedDayId, onSelect, locale, itemsCountByDay, unscheduledCount = 0 }: Props){
  const isEs = locale === 'es';
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Scroll selected into view on mount
  useEffect(() => {
    if(selectedDayId == null) return;
    const el = scrollerRef.current?.querySelector<HTMLButtonElement>(`[data-day-id="${selectedDayId}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [selectedDayId]);

  const scroll = (dir: -1 | 1) => {
    scrollerRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' });
  };

  return (
    <div className="sticky top-0 z-20 border-b border-ink-100 bg-white/95 backdrop-blur">
      <div className="flex items-center gap-1 px-2 py-3">
        <button
          onClick={() => scroll(-1)}
          aria-label={isEs ? 'Anterior' : 'Previous'}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink-200 text-ink-500 transition hover:border-ink-500 hover:text-ink-900"
        >‹</button>

        <div ref={scrollerRef} className="flex flex-1 gap-2 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {/* Unscheduled chip */}
          <button
            data-day-id="null"
            onClick={() => onSelect(null)}
            aria-pressed={selectedDayId === null}
            className={`shrink-0 rounded-2xl border px-3 py-2 text-center transition ${
              selectedDayId === null
                ? 'border-coral-500 bg-coral-500 text-white shadow-card'
                : 'border-ink-200 bg-white text-ink-700 hover:border-coral-400'
            }`}
          >
            <div className="text-[9px] font-bold uppercase tracking-wider opacity-80">{isEs ? 'Ideas' : 'Saved'}</div>
            <div className="mt-0.5 font-display text-lg font-semibold leading-none">{unscheduledCount}</div>
          </button>

          {days.map(d => {
            const active = selectedDayId === d.id;
            const today = isToday(d.date);
            const count = itemsCountByDay[d.id] || 0;
            return (
              <button
                key={d.id}
                data-day-id={d.id}
                onClick={() => onSelect(d.id)}
                aria-pressed={active}
                aria-label={`${isEs ? 'Día' : 'Day'} ${d.day_number}${d.date ? ' · ' + d.date : ''}`}
                className={`relative shrink-0 rounded-2xl border px-3 py-2 text-center transition ${
                  active
                    ? 'border-ink-900 bg-ink-900 text-white shadow-card'
                    : today
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 hover:border-emerald-600'
                      : 'border-ink-200 bg-white text-ink-700 hover:border-ink-500'
                }`}
              >
                {today && <span className="absolute -top-1 -right-1 rounded-pill bg-emerald-500 px-1.5 py-0 text-[8px] font-bold uppercase text-white">{isEs ? 'Hoy' : 'Today'}</span>}
                <div className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                  {d.date ? formatWeekday(d.date, locale) : `${isEs ? 'Día' : 'Day'}`}
                </div>
                <div className="mt-0.5 font-display text-lg font-semibold leading-none">
                  {d.date ? formatDay(d.date) : d.day_number}
                </div>
                {count > 0 && (
                  <div className={`mt-1 text-[9px] font-semibold ${active ? 'text-white/80' : 'text-ink-400'}`}>
                    {count} {isEs ? (count === 1 ? 'parada' : 'paradas') : (count === 1 ? 'stop' : 'stops')}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => scroll(1)}
          aria-label={isEs ? 'Siguiente' : 'Next'}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink-200 text-ink-500 transition hover:border-ink-500 hover:text-ink-900"
        >›</button>
      </div>
    </div>
  );
}
