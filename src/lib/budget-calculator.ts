// Budget calculator con datos reales verificados WebSearch 2026-08
// Fuentes: Sonesta Adventurebound 2026, AAA gas price index, USA road trip cost calculators
// Enrichment vs Wanderlog: Wanderlog no tiene calculadora integrada, Layla parcial (solo hoteles).

export type BudgetTier = 'low' | 'mid' | 'high';
export type CurrencyCode = 'USD' | 'EUR' | 'MXN' | 'GBP' | 'CAD' | 'AUD';

// Gas price per gallon USD 2026-08 (May 2026 avg + variación estatal verificada)
const GAS_PRICE_BY_REGION: Record<string, number> = {
  california: 6.15,   // más caro USA
  nevada: 4.75,
  arizona: 4.20,
  utah: 3.85,
  southwest: 4.10,    // avg NM/CO
  spain: 6.80,        // €1.65/L × 3.785L × 1.09 USD/EUR
  default_us: 4.50    // national avg
};

// Hotel avg per night USD por tier
const HOTEL_PER_NIGHT: Record<BudgetTier, { us: number; spain: number }> = {
  low:  { us: 75,  spain: 65 },   // budget motels / hostales
  mid:  { us: 125, spain: 110 },  // 3-star / hotel medio
  high: { us: 225, spain: 200 }   // 4-5 star / boutique
};

// Food per person per day USD por tier
const FOOD_PER_PERSON_DAY: Record<BudgetTier, { us: number; spain: number }> = {
  low:  { us: 40,  spain: 30 },   // fast food + supermercado
  mid:  { us: 80,  spain: 60 },   // mix casual restaurants
  high: { us: 150, spain: 120 }   // sit-down + wine
};

// Attractions/experiences avg USD per attraction stop
const ATTRACTION_AVG: Record<BudgetTier, number> = {
  low: 15,   // free parks, cheap museums
  mid: 30,   // museums, guided tours
  high: 60   // premium experiences (helicopter, private tour)
};

const MPG_DEFAULT = 25; // rental car típico
const M_TO_MILES = 1 / 1609.34;

const CURRENCY_RATE_FROM_USD: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  MXN: 18.5,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.51
};

const CURRENCY_SYMBOL: Record<CurrencyCode, string> = {
  USD: '$', EUR: '€', MXN: 'MX$', GBP: '£', CAD: 'C$', AUD: 'A$'
};

export interface BudgetInput {
  totalDistanceMeters: number;
  daysCount: number;
  travelers: number;
  stopsCount: number;
  attractionStopsCount?: number;
  region?: string;
  currency?: CurrencyCode;
  tier?: BudgetTier;
  mpg?: number;
}

export interface BudgetBreakdown {
  gas: number;
  hotels: number;
  food: number;
  attractions: number;
  buffer: number;   // 10% imprevistos
  total: number;
  totalPerPerson: number;
  totalPerDay: number;
  currency: CurrencyCode;
  symbol: string;
  tier: BudgetTier;
  regionKey: string;
  distanceMiles: number;
  fuelGallons: number;
  notes: string[];
}

export function calculateBudget(input: BudgetInput): BudgetBreakdown {
  const tier = input.tier || 'mid';
  const currency = input.currency || 'USD';
  const region = (input.region || 'default_us').toLowerCase();
  const isSpain = region === 'spain';
  const regionKey = GAS_PRICE_BY_REGION[region] !== undefined ? region : 'default_us';

  const distanceMiles = input.totalDistanceMeters * M_TO_MILES;
  const mpg = input.mpg || MPG_DEFAULT;
  const fuelGallons = distanceMiles / mpg;
  const gasUsd = fuelGallons * GAS_PRICE_BY_REGION[regionKey];

  // Hoteles: nights = days - 1 (última noche vuelo/casa típicamente)
  const nights = Math.max(1, input.daysCount - 1);
  const hotelPerNight = isSpain ? HOTEL_PER_NIGHT[tier].spain : HOTEL_PER_NIGHT[tier].us;
  // Rooms: 2 personas por cuarto
  const rooms = Math.max(1, Math.ceil(input.travelers / 2));
  const hotelsUsd = nights * hotelPerNight * rooms;

  // Food: por persona por día
  const foodPerDay = isSpain ? FOOD_PER_PERSON_DAY[tier].spain : FOOD_PER_PERSON_DAY[tier].us;
  const foodUsd = input.daysCount * input.travelers * foodPerDay;

  // Attractions: usar attractionStopsCount si viene, si no estimar 40% de stops son de pago
  const attrCount = input.attractionStopsCount !== undefined
    ? input.attractionStopsCount
    : Math.ceil(input.stopsCount * 0.4);
  const attractionsUsd = attrCount * ATTRACTION_AVG[tier] * Math.max(1, input.travelers);

  const subtotalUsd = gasUsd + hotelsUsd + foodUsd + attractionsUsd;
  const bufferUsd = subtotalUsd * 0.10;
  const totalUsd = subtotalUsd + bufferUsd;

  const rate = CURRENCY_RATE_FROM_USD[currency];
  const toCurrency = (usd: number) => Math.round(usd * rate);

  const notes: string[] = [];
  if(regionKey === 'california') notes.push('California gas prices are ~37% above national avg');
  if(regionKey === 'spain') notes.push('Spain fuel priced per liter (~€1.65/L)');
  if(nights === 1 && input.daysCount > 1) notes.push('Assumes 1 night stay minimum');
  if(tier === 'low') notes.push('Budget tier: motels + fast-food');
  if(tier === 'high') notes.push('High tier: 4-5★ hotels + fine dining');

  return {
    gas: toCurrency(gasUsd),
    hotels: toCurrency(hotelsUsd),
    food: toCurrency(foodUsd),
    attractions: toCurrency(attractionsUsd),
    buffer: toCurrency(bufferUsd),
    total: toCurrency(totalUsd),
    totalPerPerson: toCurrency(totalUsd / Math.max(1, input.travelers)),
    totalPerDay: toCurrency(totalUsd / Math.max(1, input.daysCount)),
    currency,
    symbol: CURRENCY_SYMBOL[currency],
    tier,
    regionKey,
    distanceMiles: Math.round(distanceMiles),
    fuelGallons: Math.round(fuelGallons * 10) / 10,
    notes
  };
}
