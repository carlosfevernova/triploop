// S44: helpers de tiempo puros (evita Date/tz bugs)

// Parse "HH:MM" o "HH:MM:SS" → minutos desde 00:00
export function parseTimeToMin(t: string | null | undefined): number | null {
  if(!t) return null;
  const m = t.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if(!m) return null;
  const h = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  if(h < 0 || h > 23 || mm < 0 || mm > 59) return null;
  return h * 60 + mm;
}

// Minutos → "HH:MM"
export function formatMinToHHMM(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Formato humano: 90 → "1h 30m", 45 → "45 min"
export function formatDurationMin(min: number, isEs = false): string {
  if(min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h${isEs ? '' : ''}`;
}

// end = start + duration (en HH:MM local). null si no computable.
export function computeEndLocal(start: string | null, durationMin: number | null): string | null {
  const s = parseTimeToMin(start);
  if(s === null || !durationMin) return null;
  return formatMinToHHMM(s + durationMin);
}

// Format date YYYY-MM-DD → "Tuesday, October 13" según locale
export function formatDateHuman(dateISO: string | null, locale: 'en' | 'es'): string {
  if(!dateISO) return '';
  const d = new Date(dateISO + 'T00:00:00');
  return d.toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });
}

// "Tuesday" corto
export function formatWeekday(dateISO: string | null, locale: 'en' | 'es'): string {
  if(!dateISO) return '';
  const d = new Date(dateISO + 'T00:00:00');
  return d.toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', { weekday: 'short' });
}

// "13" (día del mes)
export function formatDay(dateISO: string | null): string {
  if(!dateISO) return '';
  return String(new Date(dateISO + 'T00:00:00').getDate());
}

// Es hoy? (comparación fecha local del navegador)
export function isToday(dateISO: string | null): boolean {
  if(!dateISO) return false;
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return dateISO === today;
}

// Sumar N días a YYYY-MM-DD → YYYY-MM-DD
export function addDaysISO(dateISO: string, n: number): string {
  const d = new Date(dateISO + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
