// Feature flags — env-var override + in-memory runtime toggle for admins.
//
// Priority (highest wins):
//   1. In-memory admin override (set via POST /api/admin/flags — reset on process restart)
//   2. Environment variable NEXT_PUBLIC_FLAG_{KEY} = "true" | "false"
//   3. Default from FLAG_DEFAULTS
//
// Design notes:
// - Fully typed via FlagKey — TS enforces you only check flags declared here
// - `getFlag()` returns boolean synchronously (no DB round-trip; safe in RSC + client)
// - `getAllFlags()` used by admin UI to render current state
// - `setFlag()` sets in-memory override (persists until Vercel Fluid Compute instance recycles ~30-60min)
//
// Upgrade path: swap `overrides` Map for Vercel Global Config (formerly Edge Config)
// when persistence-across-instances matters. Interface stays identical.

export type FlagKey =
  | 'ai_streaming_enabled'
  | 'whatsapp_bot_enabled'
  | 'weekly_digest_cron_enabled'
  | 'trial_ending_cron_enabled'
  | 'affiliate_getyourguide_enabled'
  | 'affiliate_booking_enabled'
  | 'pwa_install_prompt_enabled'
  | 'admin_ai_cost_dashboard_enabled'
  | 'realtime_trip_presence_enabled'
  | 'reshuffle_flight_delay_enabled';

interface FlagMeta {
  key: FlagKey;
  default: boolean;
  description: string;
  category: 'ai' | 'growth' | 'billing' | 'ops' | 'ux';
}

export const FLAG_META: readonly FlagMeta[] = [
  { key: 'ai_streaming_enabled',           default: true,  description: 'SSE endpoint /api/ai/generate-trip/stream — first stop in 500ms', category: 'ai' },
  { key: 'reshuffle_flight_delay_enabled', default: false, description: 'Auto-reshuffle itinerary on detected flight delay (needs flight API)', category: 'ai' },
  { key: 'whatsapp_bot_enabled',           default: false, description: 'Twilio WhatsApp webhook — requires TWILIO_* env vars + Meta approval', category: 'growth' },
  { key: 'weekly_digest_cron_enabled',     default: true,  description: 'Vercel Cron sends weekly digest emails Monday 9am', category: 'growth' },
  { key: 'trial_ending_cron_enabled',      default: true,  description: 'Vercel Cron sends trial-ending warning 3 days before expiry', category: 'billing' },
  { key: 'affiliate_getyourguide_enabled', default: true,  description: 'GetYourGuide affiliate widgets on trip pages', category: 'growth' },
  { key: 'affiliate_booking_enabled',      default: true,  description: 'Booking.com affiliate widgets on trip pages', category: 'growth' },
  { key: 'pwa_install_prompt_enabled',     default: true,  description: 'Show iOS/Android install prompt on landing', category: 'ux' },
  { key: 'admin_ai_cost_dashboard_enabled',default: true,  description: 'Show /admin/ai-costs dashboard link in sidebar', category: 'ops' },
  { key: 'realtime_trip_presence_enabled', default: false, description: 'Supabase Realtime presence indicators on shared trips', category: 'ux' }
] as const;

const FLAG_DEFAULTS: Record<FlagKey, boolean> = Object.fromEntries(
  FLAG_META.map((f) => [f.key, f.default])
) as Record<FlagKey, boolean>;

// In-memory overrides (per Vercel Fluid instance). Resets ~30-60min.
const overrides = new Map<FlagKey, boolean>();

/**
 * Parse "true" | "false" | "1" | "0" | undefined → boolean | undefined.
 * Exported for testability.
 */
export function parseFlagEnv(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  const v = value.trim().toLowerCase();
  if (v === 'true' || v === '1' || v === 'on' || v === 'yes') return true;
  if (v === 'false' || v === '0' || v === 'off' || v === 'no') return false;
  return undefined;
}

function envFor(key: FlagKey): boolean | undefined {
  // Use NEXT_PUBLIC_ prefix so client bundle can read it too (safe: booleans, no secrets)
  const envKey = `NEXT_PUBLIC_FLAG_${key.toUpperCase()}`;
  return parseFlagEnv(process.env[envKey]);
}

/**
 * Get boolean value of a flag. Order: in-memory → env → default.
 */
export function getFlag(key: FlagKey): boolean {
  if (overrides.has(key)) return overrides.get(key)!;
  const env = envFor(key);
  if (env !== undefined) return env;
  return FLAG_DEFAULTS[key];
}

/**
 * Set in-memory override for a flag. Returns previous value.
 * Persists until Vercel Fluid instance recycles.
 */
export function setFlag(key: FlagKey, value: boolean): boolean {
  const prev = getFlag(key);
  overrides.set(key, value);
  return prev;
}

/**
 * Clear in-memory override for a flag. Falls back to env → default.
 */
export function clearFlag(key: FlagKey): void {
  overrides.delete(key);
}

/**
 * Snapshot of all flags with their current effective value + source.
 * Used by admin UI.
 */
export function getAllFlags(): Array<{
  key: FlagKey;
  value: boolean;
  source: 'override' | 'env' | 'default';
  meta: FlagMeta;
}> {
  return FLAG_META.map((meta) => {
    let value: boolean;
    let source: 'override' | 'env' | 'default';
    if (overrides.has(meta.key)) {
      value = overrides.get(meta.key)!;
      source = 'override';
    } else {
      const env = envFor(meta.key);
      if (env !== undefined) {
        value = env;
        source = 'env';
      } else {
        value = meta.default;
        source = 'default';
      }
    }
    return { key: meta.key, value, source, meta };
  });
}
