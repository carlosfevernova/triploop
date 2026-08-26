// Trip export helpers — ICS calendar + JSON serialization.
// ICS format follows RFC 5545 for maximum compat (Google Cal, Apple Cal, Outlook, iOS Wallet).
//
// Apple Wallet .pkpass — requires Apple Developer signing certs. Instead of shipping unsigned
// (which iOS rejects), we produce a "Pass JSON" that a downstream signing service can wrap.
// See buildWalletPassPayload() below + docs/apple-wallet.md.

export interface TripStopExport {
  name: string;
  lat?: number;
  lng?: number;
  address?: string;
  day?: number;              // 1-indexed day within trip
  arrival_hh_mm?: string;    // "09:30" if scheduled
  duration_minutes?: number; // 60, 90, etc.
  notes?: string;
  url?: string;
}

export interface TripExport {
  slug: string;
  title: string;
  description?: string;
  start_date?: string;      // "2026-09-15" — anchor for day 1
  timezone?: string;        // "America/Los_Angeles"
  stops: TripStopExport[];
  organizer_email?: string;
  organizer_name?: string;
}

/**
 * Escape a string for ICS TEXT type per RFC 5545 §3.3.11.
 * Escapes: backslash, semicolon, comma, newline.
 */
export function escapeIcs(s: string | undefined): string {
  if (!s) return '';
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Fold long lines per RFC 5545 §3.1 (max 75 octets per line, wrap with CRLF + SPACE).
 */
export function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let i = 0;
  while (i < line.length) {
    chunks.push((i === 0 ? '' : ' ') + line.slice(i, i + 74));
    i += 74;
  }
  return chunks.join('\r\n');
}

/**
 * Build a UTC datetime string for ICS: YYYYMMDDTHHMMSSZ.
 */
export function toIcsDateTimeUTC(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  );
}

/**
 * Compute default start (09:00 local) for a stop given trip start_date + day + arrival_hh_mm.
 * Returns Date in UTC (caller supplies timezone context via start_date).
 */
export function computeStopDateTime(
  startDate: string | undefined,
  day: number | undefined,
  hhmm: string | undefined
): Date | null {
  if (!startDate) return null;
  const base = new Date(startDate + 'T09:00:00Z');
  if (Number.isNaN(base.getTime())) return null;
  const dayOffset = Math.max(0, (day || 1) - 1);
  base.setUTCDate(base.getUTCDate() + dayOffset);
  if (hhmm && /^\d{1,2}:\d{2}$/.test(hhmm)) {
    const [h, m] = hhmm.split(':').map(Number);
    base.setUTCHours(h, m, 0, 0);
  }
  return base;
}

/**
 * Build a full ICS calendar string with one VEVENT per stop.
 * Returns "" if trip has no stops.
 */
export function buildIcs(trip: TripExport): string {
  if (!trip.stops.length) return '';
  const now = toIcsDateTimeUTC(new Date());
  const org = trip.organizer_email
    ? `ORGANIZER;CN=${escapeIcs(trip.organizer_name || 'TripLoop')}:mailto:${trip.organizer_email}`
    : null;

  const events = trip.stops.map((stop, idx) => {
    const start = computeStopDateTime(trip.start_date, stop.day, stop.arrival_hh_mm) || new Date();
    const end = new Date(start.getTime() + (stop.duration_minutes || 60) * 60_000);
    const uid = `${trip.slug}-stop-${idx}@triploop.app`;
    const summary = escapeIcs(stop.name);
    const description = escapeIcs(stop.notes || '');
    const location = escapeIcs(stop.address || (stop.lat && stop.lng ? `${stop.lat.toFixed(5)},${stop.lng.toFixed(5)}` : ''));
    const url = stop.url ? `URL:${stop.url}` : null;
    const geo = stop.lat != null && stop.lng != null ? `GEO:${stop.lat};${stop.lng}` : null;

    return [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${toIcsDateTimeUTC(start)}`,
      `DTEND:${toIcsDateTimeUTC(end)}`,
      `SUMMARY:${summary}`,
      description ? `DESCRIPTION:${description}` : null,
      location ? `LOCATION:${location}` : null,
      geo,
      url,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT'
    ].filter((line): line is string => Boolean(line)).map(foldLine).join('\r\n');
  }).join('\r\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TripLoop//AI Road Trip Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcs(trip.title)}`,
    trip.description ? `X-WR-CALDESC:${escapeIcs(trip.description)}` : null,
    org,
    events,
    'END:VCALENDAR'
  ].filter((line): line is string => Boolean(line)).join('\r\n') + '\r\n';
}

/**
 * Build a Pass JSON payload for Apple Wallet (needs downstream signing).
 * The result is the exact JSON that goes inside pass.json in a signed .pkpass zip.
 * See docs/apple-wallet.md for how to wire a signing service.
 */
export function buildWalletPassPayload(trip: TripExport): Record<string, unknown> {
  const firstStop = trip.stops[0];
  return {
    formatVersion: 1,
    passTypeIdentifier: 'pass.app.triploop.trip',
    serialNumber: trip.slug,
    teamIdentifier: 'REPLACE_WITH_APPLE_TEAM_ID',
    organizationName: 'TripLoop',
    description: trip.description || trip.title,
    logoText: 'TripLoop',
    foregroundColor: 'rgb(255,255,255)',
    backgroundColor: 'rgb(11,18,32)',
    labelColor: 'rgb(203,213,225)',
    generic: {
      primaryFields: [{ key: 'title', label: 'TRIP', value: trip.title }],
      secondaryFields: [
        { key: 'stops', label: 'STOPS', value: String(trip.stops.length) },
        trip.start_date ? { key: 'start', label: 'STARTS', value: trip.start_date } : null
      ].filter(<T>(x: T | null): x is T => x !== null),
      auxiliaryFields: firstStop ? [{ key: 'first', label: 'FIRST STOP', value: firstStop.name.slice(0, 40) }] : [],
      backFields: trip.stops.map((s, i) => ({
        key: `stop-${i}`,
        label: `Day ${s.day || 1} · Stop ${i + 1}`,
        value: `${s.name}${s.arrival_hh_mm ? ` — ${s.arrival_hh_mm}` : ''}${s.notes ? `\n${s.notes}` : ''}`
      }))
    },
    barcode: {
      format: 'PKBarcodeFormatQR',
      message: `https://triploop.app/trip/${trip.slug}`,
      messageEncoding: 'iso-8859-1'
    }
  };
}
