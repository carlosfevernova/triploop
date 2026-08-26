// AI Concierge — contextual chat for a trip.
// Answers "what's near me?", "is X open now?", "budget dinner", "route re-plan tomorrow?" etc.
// Grounded in the trip's own stops + curated region context. Uses free-tier providers.

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 25;

const SYSTEM_PROMPT_EN = `You are TripLoop Concierge — an AI travel assistant embedded inside a user's active trip page.

You have access to:
- The trip's title, dates, and stops (list with name/coords)
- The user's current question

Rules:
- Answer in 2-4 sentences max. Warm but direct — no fluff, no "certainly!", no "I'd be happy to".
- If the question is about a specific stop, name it and give a concrete tip (best time, expected duration, budget hint).
- If asking about "nearby" or "what's near me", suggest 1-2 concrete places by category (food, viewpoint, coffee, restroom).
- If asking about timing ("is X open now"), acknowledge you don't have live hours but suggest checking Google Maps/OpenTable and estimate typical hours for that category.
- If asking about budget/cost, give a range in USD (e.g., "$15-25 per person for casual").
- NEVER hallucinate specific business names for POIs not in the trip. Say "search nearby [category]" if unsure.
- ALWAYS respond in the language the user typed in.`;

const SYSTEM_PROMPT_ES = `Eres TripLoop Concierge — asistente IA embebido dentro del viaje activo del usuario.

Tienes acceso a:
- Título del viaje, fechas y paradas (lista con nombre/coordenadas)
- La pregunta actual del usuario

Reglas:
- Responde en máximo 2-4 oraciones. Cálido pero directo — sin fluff, sin "¡Claro que sí!", sin "Con gusto".
- Si la pregunta es sobre una parada específica, nómbrala y da un tip concreto (mejor hora, duración esperada, presupuesto).
- Si preguntan "cerca de mí", sugiere 1-2 lugares concretos por categoría (comida, mirador, café, baños).
- Si preguntan por horarios ("¿está abierto X?"), reconoce que no tienes horarios en vivo y sugiere Google Maps/OpenTable, más rango típico para esa categoría.
- Si preguntan por presupuesto, da rango en USD (ej. "$15-25 por persona casual").
- NUNCA inventes nombres específicos de negocios que no estén en el viaje. Di "busca [categoría] cerca" si no estás seguro.
- SIEMPRE responde en el idioma en que el usuario preguntó.`;

interface Body {
  question: string;
  locale?: 'en' | 'es' | 'pt' | 'de';
  stops?: Array<{ name: string; lat?: number; lng?: number; day?: number }>;
  currentStopIndex?: number;
}

async function loadTripStops(slug: string): Promise<Array<{ name: string; lat?: number; lng?: number; day?: number }>> {
  try {
    const sb = createAdminClient();
    const { data } = await sb.from('trips').select('stops').eq('slug', slug).maybeSingle();
    const raw = data?.stops as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.map((s) => {
      const stop = s as Record<string, unknown>;
      return {
        name: String(stop.name || ''),
        lat: typeof stop.lat === 'number' ? stop.lat : undefined,
        lng: typeof stop.lng === 'number' ? stop.lng : undefined,
        day: typeof stop.day === 'number' ? stop.day : undefined
      };
    }).filter((s) => s.name);
  } catch {
    return [];
  }
}

function buildUserPrompt(question: string, stops: Body['stops'], currentIdx: number | undefined): string {
  const stopsBlock = (stops || []).slice(0, 15).map((s, i) => {
    const marker = i === currentIdx ? '→ ' : '  ';
    const coords = s.lat != null && s.lng != null ? ` (${s.lat.toFixed(3)},${s.lng.toFixed(3)})` : '';
    return `${marker}${i + 1}. Day ${s.day || 1}: ${s.name}${coords}`;
  }).join('\n');
  return `Trip stops:\n${stopsBlock || '(no stops yet)'}\n\nUser question: ${question}`;
}

async function askOpenRouter(system: string, user: string): Promise<string | null> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;
  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://triploop.app',
        'X-Title': 'TripLoop Concierge'
      },
      body: JSON.stringify({
        model: 'google/gemma-4-26b-a4b-it:free',
        max_tokens: 180,
        temperature: 0.3,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ]
      })
    });
    if (!r.ok) return null;
    const data = await r.json();
    return String(data?.choices?.[0]?.message?.content || '').trim() || null;
  } catch {
    return null;
  }
}

async function askGroq(system: string, user: string): Promise<string | null> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 180,
        temperature: 0.3,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ]
      })
    });
    if (!r.ok) return null;
    const data = await r.json();
    return String(data?.choices?.[0]?.message?.content || '').trim() || null;
  } catch {
    return null;
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
){
  const { slug } = await params;
  const start = Date.now();
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const question = (body.question || '').trim();
  if (!question) return NextResponse.json({ error: 'empty_question' }, { status: 400 });
  if (question.length > 500) return NextResponse.json({ error: 'question_too_long', hint: 'max 500 chars' }, { status: 400 });

  const locale = body.locale || 'en';
  const system = locale === 'es' ? SYSTEM_PROMPT_ES : SYSTEM_PROMPT_EN;

  // Prefer client-provided stops (fewer DB reads); fall back to loading from DB
  const stops = body.stops && body.stops.length > 0 ? body.stops : await loadTripStops(slug);
  const userPrompt = buildUserPrompt(question, stops, body.currentStopIndex);

  // Try OpenRouter free tier → Groq free tier → static fallback
  let answer = await askOpenRouter(system, userPrompt);
  let provider = 'openrouter/gemma-4-26b:free';
  if (!answer) {
    answer = await askGroq(system, userPrompt);
    provider = 'groq/llama-3.3-70b';
  }
  if (!answer) {
    logger.warn('concierge.no_provider_available', { slug, locale });
    return NextResponse.json({
      answer: locale === 'es'
        ? 'El concierge está temporalmente sin conexión. Intenta de nuevo en un momento.'
        : "The concierge is temporarily offline. Please try again in a moment.",
      provider: 'fallback',
      elapsed_ms: Date.now() - start
    }, { status: 503 });
  }

  logger.info('concierge.answered', {
    slug,
    locale,
    provider,
    question_length: question.length,
    answer_length: answer.length,
    elapsed_ms: Date.now() - start,
    stop_count: stops.length
  });

  return NextResponse.json({
    answer,
    provider,
    elapsed_ms: Date.now() - start
  });
}
