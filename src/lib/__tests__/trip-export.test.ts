import { describe, it, expect } from 'vitest';
import {
  escapeIcs,
  foldLine,
  toIcsDateTimeUTC,
  computeStopDateTime,
  buildIcs,
  buildWalletPassPayload,
  type TripExport
} from '@/lib/trip-export';

describe('escapeIcs()', () => {
  it('escapes backslash, semicolon, comma, and newlines', () => {
    expect(escapeIcs('a;b')).toBe('a\\;b');
    expect(escapeIcs('a,b')).toBe('a\\,b');
    expect(escapeIcs('a\\b')).toBe('a\\\\b');
    expect(escapeIcs('a\nb')).toBe('a\\nb');
    expect(escapeIcs('a\r\nb')).toBe('a\\nb');
  });

  it('returns empty string for undefined/null', () => {
    expect(escapeIcs(undefined)).toBe('');
  });

  it('preserves already-safe text', () => {
    expect(escapeIcs('Yosemite National Park')).toBe('Yosemite National Park');
  });
});

describe('foldLine()', () => {
  it('leaves short lines unchanged', () => {
    expect(foldLine('SUMMARY:short line')).toBe('SUMMARY:short line');
  });

  it('folds long lines at 74 chars with CRLF + space continuation', () => {
    const long = 'X'.repeat(200);
    const folded = foldLine(long);
    expect(folded).toContain('\r\n ');
    // Each continuation chunk starts with a space
    const chunks = folded.split('\r\n');
    for (let i = 1; i < chunks.length; i++) {
      expect(chunks[i].startsWith(' ')).toBe(true);
    }
  });
});

describe('toIcsDateTimeUTC()', () => {
  it('formats a Date as YYYYMMDDTHHMMSSZ', () => {
    const d = new Date('2026-09-15T14:30:00Z');
    expect(toIcsDateTimeUTC(d)).toBe('20260915T143000Z');
  });

  it('pads single-digit month/day/hour/minute/second', () => {
    const d = new Date('2026-01-05T03:04:05Z');
    expect(toIcsDateTimeUTC(d)).toBe('20260105T030405Z');
  });
});

describe('computeStopDateTime()', () => {
  it('returns null when startDate missing', () => {
    expect(computeStopDateTime(undefined, 1, '09:00')).toBeNull();
  });

  it('applies day offset (day 1 = start_date, day 2 = +1 day)', () => {
    const d1 = computeStopDateTime('2026-09-15', 1, '09:00');
    const d2 = computeStopDateTime('2026-09-15', 2, '09:00');
    expect(d1?.toISOString()).toBe('2026-09-15T09:00:00.000Z');
    expect(d2?.toISOString()).toBe('2026-09-16T09:00:00.000Z');
  });

  it('applies HH:MM to base date', () => {
    const d = computeStopDateTime('2026-09-15', 1, '17:30');
    expect(d?.toISOString()).toBe('2026-09-15T17:30:00.000Z');
  });

  it('defaults day to 1 when missing', () => {
    const d = computeStopDateTime('2026-09-15', undefined, '09:00');
    expect(d?.toISOString()).toBe('2026-09-15T09:00:00.000Z');
  });

  it('ignores invalid hh:mm format', () => {
    const d = computeStopDateTime('2026-09-15', 1, 'invalid');
    // Falls back to base 09:00 default
    expect(d?.toISOString()).toBe('2026-09-15T09:00:00.000Z');
  });
});

describe('buildIcs()', () => {
  const trip: TripExport = {
    slug: 'ca-coast-3d',
    title: 'California Coast 3 Days',
    description: 'Iconic Pacific Coast Highway',
    start_date: '2026-09-15',
    stops: [
      { name: 'Golden Gate Bridge', day: 1, arrival_hh_mm: '09:00', duration_minutes: 60, lat: 37.8199, lng: -122.4783 },
      { name: 'Bixby Bridge', day: 2, arrival_hh_mm: '11:00', duration_minutes: 30, lat: 36.3722, lng: -121.9017 }
    ]
  };

  it('returns empty string when no stops', () => {
    expect(buildIcs({ ...trip, stops: [] })).toBe('');
  });

  it('includes VCALENDAR wrapper with VERSION and PRODID', () => {
    const ics = buildIcs(trip);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('PRODID:-//TripLoop//AI Road Trip Planner//EN');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('emits one VEVENT per stop with unique UIDs', () => {
    const ics = buildIcs(trip);
    const eventCount = (ics.match(/BEGIN:VEVENT/g) || []).length;
    expect(eventCount).toBe(2);
    expect(ics).toContain('UID:ca-coast-3d-stop-0@triploop.app');
    expect(ics).toContain('UID:ca-coast-3d-stop-1@triploop.app');
  });

  it('includes GEO for stops with lat/lng', () => {
    const ics = buildIcs(trip);
    expect(ics).toContain('GEO:37.8199;-122.4783');
    expect(ics).toContain('GEO:36.3722;-121.9017');
  });

  it('escapes special characters in summary/description', () => {
    const risky: TripExport = {
      ...trip,
      title: 'Trip; with, commas',
      stops: [{ name: 'Stop, with; commas\nnewline', day: 1 }]
    };
    const ics = buildIcs(risky);
    expect(ics).toContain('X-WR-CALNAME:Trip\\; with\\, commas');
    expect(ics).toContain('SUMMARY:Stop\\, with\\; commas\\nnewline');
  });

  it('ends with CRLF terminator', () => {
    expect(buildIcs(trip).endsWith('\r\n')).toBe(true);
  });
});

describe('buildWalletPassPayload()', () => {
  const trip: TripExport = {
    slug: 'ca-coast-3d',
    title: 'California Coast 3 Days',
    description: 'Iconic Pacific Coast Highway',
    start_date: '2026-09-15',
    stops: [
      { name: 'Golden Gate Bridge', day: 1, arrival_hh_mm: '09:00' },
      { name: 'Bixby Bridge', day: 2, arrival_hh_mm: '11:00', notes: 'Iconic bridge photo' }
    ]
  };

  it('returns a valid Pass JSON structure', () => {
    const p = buildWalletPassPayload(trip);
    expect(p.formatVersion).toBe(1);
    expect(p.serialNumber).toBe('ca-coast-3d');
    expect(p.organizationName).toBe('TripLoop');
    expect(p.description).toBe('Iconic Pacific Coast Highway');
  });

  it('includes primary field with trip title', () => {
    const p = buildWalletPassPayload(trip) as { generic: { primaryFields: Array<{ value: string }> } };
    expect(p.generic.primaryFields[0].value).toBe('California Coast 3 Days');
  });

  it('includes secondary field with stop count', () => {
    const p = buildWalletPassPayload(trip) as { generic: { secondaryFields: Array<{ key: string; value: string }> } };
    const stopsField = p.generic.secondaryFields.find((f) => f.key === 'stops');
    expect(stopsField?.value).toBe('2');
  });

  it('includes one back field per stop with day + time + notes', () => {
    const p = buildWalletPassPayload(trip) as { generic: { backFields: Array<{ key: string; value: string }> } };
    expect(p.generic.backFields.length).toBe(2);
    expect(p.generic.backFields[0].value).toContain('Golden Gate Bridge');
    expect(p.generic.backFields[0].value).toContain('09:00');
    expect(p.generic.backFields[1].value).toContain('Iconic bridge photo');
  });

  it('includes QR code linking to trip URL', () => {
    const p = buildWalletPassPayload(trip) as { barcode: { message: string; format: string } };
    expect(p.barcode.format).toBe('PKBarcodeFormatQR');
    expect(p.barcode.message).toBe('https://triploop.app/trip/ca-coast-3d');
  });
});
