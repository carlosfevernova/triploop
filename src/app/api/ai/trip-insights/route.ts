import { NextResponse } from 'next/server';
import { rateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const maxDuration = 45;

// Cache resultado en trips.metadata JSONB. Regenera solo si stops o days_count cambiaron.
interface Body {
  slug: string;
  locale?: 'en' | 'es';
}

export interface TripInsights {
  warnings: Array<{ severity: 'high' | 'mid' | 'low'; title: string; body: string }>;
  tips: Array<{ category: 'booking' | 'timing' | 'local' | 'safety'; title: string; body: string }>;
  generated_at: string;
  provider: string;
}

const SYSTEM_ES = `Eres un travel-advisor experto que conoce cada región de USA y España. Tu tarea: dado un itinerario, generar 3-5 ALERTAS críticas y 3-5 CONSEJOS locales tipo "no vayas a X, ve a Y".

REGLAS:
- Alertas = riesgos reales o comunes errores turistas (reservas requeridas con anticipación, temporada peligrosa, filas absurdas, timings). Severidad: high (evita perder viaje), mid (evita frustración), low (nice-to-know).
- Consejos = insider knowledge que un local sabría (mejor mirador vs turístico, comida real vs trampa, horarios óptimos, comparaciones "en vez de X mejor Y").
- Categorías tips: booking (reservar antes), timing (mejor hora/día), local (recomendación insider), safety (seguridad).
- Español rioplatense NO — español neutral latinoamericano.
- Responde SOLO JSON válido, sin markdown, formato exacto pedido.`;

const SYSTEM_EN = `You are an expert travel-advisor with local knowledge of every US region and Spain. Task: given an itinerary, generate 3-5 critical WARNINGS and 3-5 local TIPS like "don't go to X, go to Y".

RULES:
- Warnings = real risks or common tourist mistakes (advance-booking required, dangerous season, absurd lines, timings). Severity: high (avoid ruining trip), mid (avoid frustration), low (nice-to-know).
- Tips = insider knowledge locals know (better viewpoint vs tourist trap, real food vs trap, optimal hours, "instead of X better Y").
- Categories tips: booking (book ahead), timing (best hour/day), local (insider rec), safety.
- Respond ONLY valid JSON, no markdown, exact requested format.`;

function schemaHint(locale: 'en' | 'es'){
  const w = locale === 'es' ? 'oraciones' : 'sentences';
  return `{
  "warnings": [
    { "severity": "high"|"mid"|"low", "title": string(< 60 chars), "body": string(1-2 ${w}) }
  ],
  "tips": [
    { "category": "booking"|"timing"|"local"|"safety", "title": string(< 60 chars), "body": string(1-2 ${w}) }
  ]
}`;
}

async function callOpenRouter(system: string, user: string): Promise<TripInsights | null> {
  const key = process.env.OPENROUTER_API_KEY;
  if(!key) return null;
  const models = ['openrouter/free', 'google/gemma-4-31b-it:free'];
  for(const model of models){
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'authorization': `Bearer ${key}`,
          'content-type': 'application/json',
          'HTTP-Referer': 'https://triploop-six.vercel.app',
          'X-Title': 'TripLoop Insights'
        },
        body: JSON.stringify({
          model,
          max_tokens: 1500,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user }
          ]
        })
      });
      clearTimeout(timeout);
      if(!r.ok) continue;
      const data = await r.json();
      const raw = data?.choices?.[0]?.message?.content || '';
      const parsed = extract(raw);
      if(parsed) return { ...parsed, generated_at: new Date().toISOString(), provider: `openrouter/${model}` };
    } catch { continue; }
  }
  return null;
}

function extract(raw: string): { warnings: TripInsights['warnings']; tips: TripInsights['tips'] } | null {
  try {
    const parsed = JSON.parse(raw);
    if(Array.isArray(parsed?.warnings) && Array.isArray(parsed?.tips)) return parsed;
  } catch {}
  const m = raw.match(/\{[\s\S]*\}/);
  if(m){
    try {
      const parsed = JSON.parse(m[0]);
      if(Array.isArray(parsed?.warnings) && Array.isArray(parsed?.tips)) return parsed;
    } catch {}
  }
  return null;
}

function buildContentHash(stops: Array<{ name: string }>, daysCount: number, region: string): string {
  const s = stops.map(s => s.name).join('|') + '|' + daysCount + '|' + region;
  let hash = 0;
  for(let i = 0; i < s.length; i++){
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export async function POST(req: Request){
  const rl = rateLimit(getClientKey(req), { limit: 10, windowSec: 60 });
  if(!rl.ok) return rateLimitResponse(rl);

  try {
    const body = (await req.json()) as Body;
    if(!body.slug) return NextResponse.json({ error: 'slug_required' }, { status: 400 });

    const locale = body.locale || 'en';
    const sb = createAdminClient();
    // Try to select con metadata, fallback sin metadata si columna no existe aún
    interface TripRow {
      slug: string; title: string; origin_city: string | null; destination_city: string | null;
      days_count: number | null; region: string | null; stops: unknown; metadata?: unknown;
    }
    let trip: TripRow | null = null;
    let hasMetadata = true;
    const withMeta = await sb.from('trips')
      .select('slug, title, origin_city, destination_city, days_count, region, stops, metadata')
      .eq('slug', body.slug).maybeSingle();
    if(withMeta.error && withMeta.error.message.includes('metadata')){
      hasMetadata = false;
      const noMeta = await sb.from('trips')
        .select('slug, title, origin_city, destination_city, days_count, region, stops')
        .eq('slug', body.slug).maybeSingle();
      if(noMeta.error || !noMeta.data) return NextResponse.json({ error: 'trip_not_found' }, { status: 404 });
      trip = noMeta.data as unknown as TripRow;
    } else if(withMeta.error || !withMeta.data){
      return NextResponse.json({ error: 'trip_not_found' }, { status: 404 });
    } else {
      trip = withMeta.data as unknown as TripRow;
    }
    if(!trip) return NextResponse.json({ error: 'trip_not_found' }, { status: 404 });

    const stops = (Array.isArray(trip.stops) ? trip.stops : []) as Array<{ name: string }>;
    const region = trip.region || 'unknown';
    const hash = buildContentHash(stops, trip.days_count || 3, region);

    // Cache check via metadata JSONB (soft-fail si columna no existe)
    if(hasMetadata){
      const metadata = (trip.metadata || {}) as Record<string, unknown>;
      const cachedInsights = metadata[`insights_${locale}_${hash}`] as TripInsights | undefined;
      if(cachedInsights) return NextResponse.json({ insights: cachedInsights, source: 'cache' });
    }

    // Prompt
    const system = locale === 'es' ? SYSTEM_ES : SYSTEM_EN;
    const stopsList = stops.map((s: { name: string }, i: number) => `${i + 1}. ${s.name}`).join('\n');
    const userPrompt = `${locale === 'es' ? 'Itinerario' : 'Itinerary'}: ${trip.title}
${locale === 'es' ? 'Región' : 'Region'}: ${region}
${locale === 'es' ? 'Días' : 'Days'}: ${trip.days_count}
${locale === 'es' ? 'Origen → Destino' : 'From → To'}: ${trip.origin_city} → ${trip.destination_city}
${locale === 'es' ? 'Paradas' : 'Stops'}:
${stopsList}

${locale === 'es' ? 'Devuelve JSON con schema' : 'Return JSON with schema'}:
${schemaHint(locale)}`;

    const insights = await callOpenRouter(system, userPrompt);
    if(!insights) return NextResponse.json({ error: 'ai_unavailable' }, { status: 503 });

    // Save to metadata cache (soft-fail si columna no existe)
    if(hasMetadata){
      try {
        const existingMeta = (trip.metadata || {}) as Record<string, unknown>;
        const newMetadata = { ...existingMeta, [`insights_${locale}_${hash}`]: insights };
        await sb.from('trips').update({ metadata: newMetadata }).eq('slug', body.slug);
      } catch { /* cache degrada */ }
    }

    return NextResponse.json({ insights, source: 'ai' });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
