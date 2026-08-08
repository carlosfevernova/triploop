// Rate limiting en memoria (edge-safe, LRU-lite).
// Uso: por IP para endpoints públicos costosos (AI, Google Maps proxies).

interface Bucket {
  count: number;
  resetAt: number;
}

// Un solo Map por instancia edge. Reinicia con cold starts (aceptable).
const BUCKETS = new Map<string, Bucket>();
const MAX_KEYS = 5000; // LRU cap

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(key: string, opts: { limit: number; windowSec: number }): RateLimitResult {
  const now = Date.now();
  const bucket = BUCKETS.get(key);
  if(!bucket || bucket.resetAt < now){
    BUCKETS.set(key, { count: 1, resetAt: now + opts.windowSec * 1000 });
    // LRU: drop oldest si excede
    if(BUCKETS.size > MAX_KEYS){
      const first = BUCKETS.keys().next().value;
      if(first) BUCKETS.delete(first);
    }
    return { ok: true, remaining: opts.limit - 1, resetAt: now + opts.windowSec * 1000 };
  }
  if(bucket.count >= opts.limit){
    return { ok: false, remaining: 0, resetAt: bucket.resetAt };
  }
  bucket.count++;
  return { ok: true, remaining: opts.limit - bucket.count, resetAt: bucket.resetAt };
}

export function getClientKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for') || '';
  const ip = forwarded.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
  return `ip:${ip}`;
}

export function rateLimitResponse(result: RateLimitResult){
  return new Response(JSON.stringify({
    error: 'rate_limit_exceeded',
    remaining: 0,
    reset_at: new Date(result.resetAt).toISOString()
  }), {
    status: 429,
    headers: {
      'content-type': 'application/json',
      'retry-after': String(Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000))),
      'x-ratelimit-remaining': '0',
      'x-ratelimit-reset': String(Math.floor(result.resetAt / 1000))
    }
  });
}
