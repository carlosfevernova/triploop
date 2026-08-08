// Helper compartido OpenRouter para todos los endpoints AI de TripLoop
// Usa modelos free 2026-08 con timeout + fallback + JSON extract.

// Ordenados por latencia benchmark 2026-08-08 (ms para 800 tokens JSON):
// gemma-4-26b: 1.6s · gpt-oss-20b: 3s · gemma-4-31b: variable · nemotron-super: 30s+
const OR_MODELS_FREE = [
  'google/gemma-4-26b-a4b-it:free',
  'openai/gpt-oss-20b:free',
  'google/gemma-4-31b-it:free',
  'openrouter/free',
  'nvidia/nemotron-3-super-120b-a12b:free'
];

export async function callOpenRouterJson<T>(
  system: string,
  user: string,
  opts: { maxTokens?: number; timeoutMs?: number; title?: string } = {}
): Promise<{ data: T; provider: string } | null> {
  const key = process.env.OPENROUTER_API_KEY;
  if(!key) return null;
  const maxTokens = opts.maxTokens ?? 2000;
  const timeoutMs = opts.timeoutMs ?? 20000;

  for(const model of OR_MODELS_FREE){
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'authorization': `Bearer ${key}`,
          'content-type': 'application/json',
          'HTTP-Referer': 'https://triploop-six.vercel.app',
          'X-Title': opts.title || 'TripLoop AI'
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user }
          ]
        })
      });
      clearTimeout(timeout);
      if(!r.ok) continue;
      const raw = (await r.json())?.choices?.[0]?.message?.content || '';
      const parsed = extractJson<T>(raw);
      if(parsed) return { data: parsed, provider: `openrouter/${model}` };
    } catch { continue; }
  }
  return null;
}

function extractJson<T>(raw: string): T | null {
  try { return JSON.parse(raw) as T; } catch {}
  const m = raw.match(/\{[\s\S]*\}/);
  if(m){ try { return JSON.parse(m[0]) as T; } catch {} }
  return null;
}

// Helper: cache read + write en trips.metadata JSONB con soft-fail si columna no existe
export async function readTripCache<T>(
  sb: { from: (t: string) => { select: (s: string) => { eq: (k: string, v: string) => { maybeSingle: () => Promise<{ data: unknown; error: { message: string } | null }> } } } },
  slug: string,
  key: string
): Promise<{ trip: Record<string, unknown> | null; cached: T | null; hasMetadata: boolean }> {
  const withMeta = await sb.from('trips')
    .select('slug, title, origin_city, destination_city, days_count, region, stops, metadata')
    .eq('slug', slug).maybeSingle();
  if(withMeta.error && withMeta.error.message.includes('metadata')){
    const noMeta = await sb.from('trips')
      .select('slug, title, origin_city, destination_city, days_count, region, stops')
      .eq('slug', slug).maybeSingle();
    return { trip: (noMeta.data as Record<string, unknown>) || null, cached: null, hasMetadata: false };
  }
  if(withMeta.error || !withMeta.data) return { trip: null, cached: null, hasMetadata: true };
  const trip = withMeta.data as Record<string, unknown>;
  const metadata = (trip.metadata || {}) as Record<string, unknown>;
  const cached = metadata[key] as T | undefined;
  return { trip, cached: cached || null, hasMetadata: true };
}

export function contentHash(input: string): string {
  let hash = 0;
  for(let i = 0; i < input.length; i++){
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
