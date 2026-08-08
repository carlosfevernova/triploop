import { NextResponse } from 'next/server';
import { rateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';
import { CURATED_POIS, getCuratedPOIs, totalCuratedPOIs } from '@/lib/curated-pois';
import type { Region } from '@/lib/templates-seed';

export const runtime = 'edge';

// S29: endpoint público POIs curados verificados.
// Uso: frontend fetch para mostrar shortcut suggestions o autocomplete.

export async function GET(req: Request){
  const rl = rateLimit(getClientKey(req), { limit: 60, windowSec: 60 });
  if(!rl.ok) return rateLimitResponse(rl);

  const url = new URL(req.url);
  const region = url.searchParams.get('region') as Region | null;
  const onlyIconic = url.searchParams.get('iconic') === 'true';
  const limit = parseInt(url.searchParams.get('limit') || '50', 10);

  if(region){
    if(!CURATED_POIS[region]) return NextResponse.json({ error: 'invalid_region', valid: Object.keys(CURATED_POIS) }, { status: 400 });
    const pois = getCuratedPOIs(region, { onlyIconic, limit });
    return NextResponse.json({
      region, pois, count: pois.length, total_in_region: CURATED_POIS[region].length
    }, { headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600' } });
  }

  // Sin región → devolver summary
  const summary = Object.entries(CURATED_POIS).map(([r, arr]) => ({
    region: r,
    count: arr.length,
    iconic_count: arr.filter(p => p.iconic).length
  }));
  return NextResponse.json({
    regions: summary,
    total: totalCuratedPOIs()
  }, { headers: { 'cache-control': 'public, max-age=3600, s-maxage=3600' } });
}
