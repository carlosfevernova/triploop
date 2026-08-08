import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface Body {
  name: string;
  lat?: number;
  lng?: number;
  locale?: 'en' | 'es';
}

/**
 * Genera una descripción corta (1-2 oraciones) para una parada usando DeepSeek V3.
 * Devuelve fallback vacío si no hay API key configurada.
 */
export async function POST(req: Request){
  try {
    const body = (await req.json()) as Body;
    const { name, lat, lng, locale = 'en' } = body;
    if(!name || name.length < 2) return NextResponse.json({ description: '', mode: 'noop' });

    const key = process.env.FIREWORKS_API_KEY;
    if(!key) return NextResponse.json({ description: '', mode: 'no_api_key' });

    const system = locale === 'es'
      ? `Eres un guía experto en el suroeste de EE.UU. Describes cada parada en 1-2 oraciones (máx 40 palabras), tono cálido pero directo, sin fluff. Menciona qué hacer + un dato práctico (mejor hora, tiempo esperado, o consejo insider).`
      : `You're a US Southwest travel expert. Describe each stop in 1-2 sentences (max 40 words), warm but direct tone, no fluff. Mention what to do + one practical tip (best time, expected duration, or insider hint).`;

    const user = locale === 'es'
      ? `Describe esta parada: "${name}"${lat ? ` (${lat.toFixed(3)}, ${lng?.toFixed(3)})` : ''}. Solo la descripción, sin comillas, sin "Descripción:".`
      : `Describe this stop: "${name}"${lat ? ` (${lat.toFixed(3)}, ${lng?.toFixed(3)})` : ''}. Just the description, no quotes, no "Description:" prefix.`;

    const r = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
      method: 'POST',
      headers: { 'authorization': `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'accounts/fireworks/models/deepseek-v3',
        max_tokens: 120,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ]
      })
    });

    if(!r.ok) return NextResponse.json({ description: '', mode: 'ai_error' });
    const data = await r.json();
    const description = (data?.choices?.[0]?.message?.content || '').trim().replace(/^["']|["']$/g, '');
    return NextResponse.json({ description, mode: 'ai' });
  } catch (e) {
    return NextResponse.json({ description: '', mode: 'error', error: (e as Error).message });
  }
}
