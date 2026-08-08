// Affiliate deep link generators con env-based tracking IDs.
// Si el env var no existe, el link sigue funcionando (sin comisión).

// FTC/CMA compliance: siempre mostrar disclosure junto a links generados aquí.

const GYG_PARTNER = process.env.NEXT_PUBLIC_GETYOURGUIDE_PARTNER_ID || '';
const BOOKING_AID = process.env.NEXT_PUBLIC_BOOKING_AID || '';
const CAMPAIGN = 'triploop';

export function isAffiliateActive(){
  return !!(GYG_PARTNER || BOOKING_AID);
}

export function isGygActive(){ return !!GYG_PARTNER; }
export function isBookingActive(){ return !!BOOKING_AID; }

/**
 * GetYourGuide Search deep link.
 * @param query City or attraction name. e.g. "Yosemite Valley", "San Francisco tours"
 * @param locale 'en' | 'es' → maps a subdominio i18n
 * @param date optional YYYY-MM-DD (bias fecha)
 */
export function gygSearchUrl(query: string, opts: { locale?: string; date?: string; source?: string } = {}){
  const { locale = 'en', date, source = 'trip' } = opts;
  const langMap: Record<string, string> = { en: 'en', es: 'es' };
  const langCode = langMap[locale] || 'en';
  const url = new URL(`https://www.getyourguide.com/s/`);
  url.searchParams.set('q', query);
  url.searchParams.set('lang', langCode);
  if(date) url.searchParams.set('date_from', date);
  if(GYG_PARTNER) url.searchParams.set('partner_id', GYG_PARTNER);
  url.searchParams.set('cmp', `${CAMPAIGN}-${source}`);
  return url.toString();
}

/**
 * GetYourGuide Direct product URL (cuando conoces el activity_id).
 */
export function gygActivityUrl(activityId: string | number, opts: { locale?: string; source?: string } = {}){
  const { locale = 'en', source = 'trip' } = opts;
  const langMap: Record<string, string> = { en: 'en', es: 'es' };
  const langCode = langMap[locale] || 'en';
  const url = new URL(`https://www.getyourguide.com/activity/-t${activityId}`);
  url.searchParams.set('lang', langCode);
  if(GYG_PARTNER) url.searchParams.set('partner_id', GYG_PARTNER);
  url.searchParams.set('cmp', `${CAMPAIGN}-${source}`);
  return url.toString();
}

/**
 * Booking.com Search deep link con affiliate ID (aid=).
 * @param destination City name
 * @param checkin YYYY-MM-DD
 * @param checkout YYYY-MM-DD
 * @param guests default 2
 */
export function bookingSearchUrl(destination: string, opts: {
  checkin?: string;
  checkout?: string;
  guests?: number;
  locale?: string;
  source?: string;
} = {}){
  const { checkin, checkout, guests = 2, locale = 'en', source = 'trip' } = opts;
  const langMap: Record<string, string> = { en: 'en-us', es: 'es' };
  const url = new URL('https://www.booking.com/searchresults.html');
  url.searchParams.set('ss', destination);
  url.searchParams.set('lang', langMap[locale] || 'en-us');
  url.searchParams.set('group_adults', String(guests));
  url.searchParams.set('no_rooms', '1');
  if(checkin) url.searchParams.set('checkin', checkin);
  if(checkout) url.searchParams.set('checkout', checkout);
  if(BOOKING_AID) url.searchParams.set('aid', BOOKING_AID);
  url.searchParams.set('label', `${CAMPAIGN}-${source}`);
  return url.toString();
}

/**
 * Estimar checkin/checkout ISO dates dado un trip start_date + days.
 */
export function estimateStayDates(startDate?: string, daysCount = 3): { checkin: string; checkout: string } {
  const base = startDate ? new Date(startDate) : addDays(new Date(), 30); // default 30 días de hoy
  const checkin = toIsoDate(base);
  const checkout = toIsoDate(addDays(base, Math.max(1, Math.min(daysCount, 14))));
  return { checkin, checkout };
}

function addDays(d: Date, n: number){ const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function toIsoDate(d: Date){ return d.toISOString().slice(0, 10); }
