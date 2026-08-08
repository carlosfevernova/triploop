import { NextResponse } from 'next/server';
import { rateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase-admin';
import { callOpenRouterJson, readTripCache, contentHash } from '@/lib/ai-openrouter';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface Body {
  slug: string;
  locale?: 'en' | 'es';
  season?: 'spring' | 'summer' | 'fall' | 'winter' | 'auto';
  tripType?: 'family' | 'couple' | 'friends' | 'solo' | 'business';
  hasKids?: boolean;
}

export interface ChecklistItem { id: string; label: string; essential: boolean; }
export interface ChecklistCategory {
  key: 'essentials' | 'clothing' | 'gear' | 'docs' | 'health' | 'kids';
  label: string;
  items: ChecklistItem[];
}
export interface TripChecklist {
  categories: ChecklistCategory[];
  context_note: string;
  season: string;
  generated_at: string;
  provider: string;
}

function currentSeason(): 'spring' | 'summer' | 'fall' | 'winter' {
  const m = new Date().getMonth();
  if(m >= 2 && m <= 4) return 'spring';
  if(m >= 5 && m <= 7) return 'summer';
  if(m >= 8 && m <= 10) return 'fall';
  return 'winter';
}

const SYSTEM_ES = `Eres un experto en viajes. Genera CHECKLIST de qué llevar personalizada al destino + temporada + tipo de viaje + si hay niños.

REGLAS:
- 5-6 categorías: essentials (chargers/adaptadores/passport), clothing (por clima), gear (específico al destino), docs (reservas, seguros), health (medicinas región), kids (si aplica).
- 4-8 items por categoría. Marcar essential=true solo lo IMPRESCINDIBLE.
- Específicos al destino: "protector solar 50+ (Grand Canyon UV alto)", "chaqueta impermeable (fog Big Sur)", "adaptador enchufe europeo tipo F (España)".
- Bilingüe: labels en español neutral. context_note 1 oración con razón principal ("Julio en Utah = 40°C, hidratación crítica").
- JSON válido, sin markdown.`;

const SYSTEM_EN = `You are a travel expert. Generate personalized packing CHECKLIST tailored to destination + season + trip type + kids if applicable.

RULES:
- 5-6 categories: essentials (chargers/adapters/passport), clothing (by climate), gear (destination-specific), docs (reservations, insurance), health (region-specific meds), kids (if applicable).
- 4-8 items per category. Mark essential=true only ABSOLUTE must-haves.
- Destination-specific: "sunscreen 50+ (Grand Canyon high UV)", "waterproof jacket (Big Sur fog)", "European plug adapter type F (Spain)".
- context_note 1 sentence with main reason ("July in Utah = 40°C, hydration critical").
- Valid JSON, no markdown.`;

function schema(locale: 'en' | 'es'){
  return `{
  "categories": [
    { "key": "essentials"|"clothing"|"gear"|"docs"|"health"|"kids",
      "label": string(${locale === 'es' ? 'en español' : 'in English'}),
      "items": [ { "id": string(kebab), "label": string(< 60 chars), "essential": boolean } ]
    }
  ],
  "context_note": string(1 sentence),
  "season": "spring"|"summer"|"fall"|"winter"
}`;
}

export async function POST(req: Request){
  const rl = rateLimit(getClientKey(req), { limit: 8, windowSec: 60 });
  if(!rl.ok) return rateLimitResponse(rl);

  try {
    const body = (await req.json()) as Body;
    if(!body.slug) return NextResponse.json({ error: 'slug_required' }, { status: 400 });
    const locale = body.locale || 'en';
    const season = body.season && body.season !== 'auto' ? body.season : currentSeason();

    const sb = createAdminClient();
    const { trip, cached, hasMetadata } = await readTripCache<TripChecklist>(
      sb as unknown as Parameters<typeof readTripCache>[0],
      body.slug,
      `checklist_${locale}_${season}_${body.tripType || 'any'}_${body.hasKids ? 'kids' : 'nokids'}`
    );
    if(!trip) return NextResponse.json({ error: 'trip_not_found' }, { status: 404 });
    if(cached) return NextResponse.json({ checklist: cached, source: 'cache' });

    const stops = (Array.isArray(trip.stops) ? trip.stops : []) as Array<{ name: string }>;
    const system = locale === 'es' ? SYSTEM_ES : SYSTEM_EN;
    const userPrompt = `${locale === 'es' ? 'Viaje' : 'Trip'}: ${trip.title}
${locale === 'es' ? 'Región' : 'Region'}: ${trip.region || 'unknown'}
${locale === 'es' ? 'Días' : 'Days'}: ${trip.days_count}
${locale === 'es' ? 'Temporada actual' : 'Current season'}: ${season}
${locale === 'es' ? 'Tipo' : 'Type'}: ${body.tripType || 'general'}${body.hasKids ? (locale === 'es' ? ' + niños' : ' + kids') : ''}
${locale === 'es' ? 'Paradas' : 'Stops'}: ${stops.map(s => s.name).slice(0, 8).join(', ')}

${locale === 'es' ? 'Devuelve JSON con schema' : 'Return JSON with schema'}:
${schema(locale)}`;

    const result = await callOpenRouterJson<{
      categories: ChecklistCategory[];
      context_note: string;
      season: string;
    }>(system, userPrompt, { maxTokens: 1500, title: 'TripLoop Checklist', timeoutMs: 30000 });

    if(!result) return NextResponse.json({ error: 'ai_unavailable' }, { status: 503 });

    const checklist: TripChecklist = {
      ...result.data,
      generated_at: new Date().toISOString(),
      provider: result.provider
    };

    if(hasMetadata){
      try {
        const existingMeta = (trip.metadata || {}) as Record<string, unknown>;
        const key = `checklist_${locale}_${season}_${body.tripType || 'any'}_${body.hasKids ? 'kids' : 'nokids'}`;
        await sb.from('trips').update({ metadata: { ...existingMeta, [key]: checklist } }).eq('slug', body.slug);
      } catch { /* soft-fail */ }
    }

    return NextResponse.json({ checklist, source: 'ai' });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
