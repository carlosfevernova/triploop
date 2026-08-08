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

const SYSTEM_ES = `Experto viajes. Genera CHECKLIST breve de qué llevar personalizada al destino.

REGLAS:
- 4 categorías: essentials, clothing, gear, docs (+ kids si aplica).
- 4-5 items por categoría. essential=true solo IMPRESCINDIBLE.
- Destino-específico ("protector 50+ Grand Canyon", "chaqueta fog Big Sur").
- context_note 1 oración con razón principal.
- SOLO JSON válido, sin markdown, sin explicación.`;

const SYSTEM_EN = `Travel expert. Generate brief packing CHECKLIST tailored to destination.

RULES:
- 4 categories: essentials, clothing, gear, docs (+ kids if applicable).
- 4-5 items per category. essential=true only MUST-haves.
- Destination-specific ("sunscreen 50+ Grand Canyon", "waterproof jacket Big Sur fog").
- context_note 1 sentence with main reason.
- JSON ONLY, no markdown, no explanation.`;

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
    // Cache hit validado: struct debe tener categories:Array. Si no, ignora cache y regenera.
    if(cached && Array.isArray((cached as TripChecklist).categories) && (cached as TripChecklist).categories.length > 0){
      return NextResponse.json({ checklist: cached, source: 'cache' });
    }

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
    }>(system, userPrompt, { maxTokens: 1200, title: 'TripLoop Checklist', timeoutMs: 45000 });

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
