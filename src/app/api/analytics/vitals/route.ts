import { NextResponse } from 'next/server';
import { rateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';

export const runtime = 'edge';

// S42 P1: Web Vitals RUM ingestion
// El cliente envía LCP/INP/CLS/FCP/TTFB via /api/analytics/vitals.
// Log a console + opcional DB (migration 019 pending).

interface VitalPayload {
  name: 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB' | 'FID';
  value: number;
  id: string;
  navigationType?: string;
  path?: string;
  locale?: string;
}

export async function POST(req: Request){
  // Rate limit generoso (RUM se dispara por página)
  const rl = rateLimit(getClientKey(req), { limit: 30, windowSec: 60 });
  if(!rl.ok) return rateLimitResponse(rl);

  try {
    const body = (await req.json()) as VitalPayload;
    if(!body.name || typeof body.value !== 'number') {
      return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
    }
    // Structured log — Vercel Logs pickup
    console.log('[web-vitals]', JSON.stringify({
      metric: body.name,
      value: Math.round(body.value * 100) / 100,
      path: body.path?.slice(0, 200),
      navigationType: body.navigationType,
      id: body.id,
      locale: body.locale,
      ts: Date.now()
    }));
    return NextResponse.json({ received: true }, {
      headers: { 'cache-control': 'no-store' }
    });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
