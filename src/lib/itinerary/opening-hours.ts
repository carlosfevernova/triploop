// S45 P3.1: Opening hours helpers — detección de conflictos con horarios reales.

export interface HoursPeriod {
  open?: { day: number; hour: number; minute: number };  // day: 0=Sun...6=Sat
  close?: { day: number; hour: number; minute: number };
}

export interface OpeningHours {
  periods?: HoursPeriod[];
  weekdayDescriptions?: string[];
}

// Devuelve true si el lugar está abierto entre startMin y endMin del día dado (0=Sun..6=Sat)
// Retorna: { openAtStart, openAtEnd, closesDuringVisit, closedAllDay }
export function checkVisitHours(
  hours: OpeningHours | null,
  dayOfWeek: number,
  startMin: number,
  endMin: number
): {
  openAtStart: boolean;
  openAtEnd: boolean;
  closesDuringVisit: boolean;
  closedAllDay: boolean;
  closingTimeMin: number | null;
} {
  if(!hours?.periods || hours.periods.length === 0){
    return { openAtStart: true, openAtEnd: true, closesDuringVisit: false, closedAllDay: false, closingTimeMin: null };
  }

  // Filter periods that apply to this day-of-week
  const applicable = hours.periods.filter(p => p.open?.day === dayOfWeek);
  if(applicable.length === 0){
    return { openAtStart: false, openAtEnd: false, closesDuringVisit: false, closedAllDay: true, closingTimeMin: null };
  }

  for(const p of applicable){
    const openMin = (p.open!.hour * 60) + p.open!.minute;
    // If close is on next day, treat as 24h+
    let closeMin: number;
    if(!p.close){
      closeMin = 24 * 60;  // open 24h
    } else if(p.close.day !== dayOfWeek){
      closeMin = 24 * 60 + (p.close.hour * 60) + p.close.minute;
    } else {
      closeMin = (p.close.hour * 60) + p.close.minute;
    }

    if(startMin >= openMin && startMin < closeMin){
      const openAtEnd = endMin <= closeMin;
      return {
        openAtStart: true,
        openAtEnd,
        closesDuringVisit: !openAtEnd,
        closedAllDay: false,
        closingTimeMin: closeMin
      };
    }
  }

  return { openAtStart: false, openAtEnd: false, closesDuringVisit: false, closedAllDay: false, closingTimeMin: null };
}

// Format closing time HH:MM
export function formatCloseTime(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// dayOfWeek de un YYYY-MM-DD (0=Sun..6=Sat en local time)
export function dayOfWeekFromDate(dateISO: string | null): number | null {
  if(!dateISO) return null;
  return new Date(dateISO + 'T00:00:00').getDay();
}
