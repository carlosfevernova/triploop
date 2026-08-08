import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { ALL_TEMPLATES } from '@/lib/templates-seed';
import { TEMPLATE_TRANSLATIONS_ES } from '@/lib/templates-seed-es';

// Node runtime: evita problemas de tree-shaking de imports en edge bundle
export const runtime = 'nodejs';

// One-shot seed endpoint. Idempotent: upserts por slug.
// Protegido con SEED_TOKEN env var (setear en Vercel + llamar con header X-Seed-Token).
export async function POST(req: Request){
  const token = (req.headers.get('x-seed-token') || '').trim();
  const expected = (process.env.SEED_TOKEN || '').trim();
  if(!expected || token !== expected){
    return NextResponse.json({ error: 'unauthorized', hint_len_expected: expected.length, hint_len_got: token.length }, { status: 401 });
  }

  const sb = createAdminClient();
  const results: Array<{ slug: string; ok: boolean; error?: string; translated?: boolean }> = [];
  const translationsKeysCount = Object.keys(TEMPLATE_TRANSLATIONS_ES || {}).length;

  for(const tpl of ALL_TEMPLATES){
    const stops = tpl.stops.map((s, i) => ({
      id: `tpl-${tpl.slug}-${i}`,
      name: s.name,
      address: s.address,
      lat: s.lat,
      lng: s.lng,
      duration_min: s.duration_min,
      category: s.category || 'other'
    }));
    const esTranslation = TEMPLATE_TRANSLATIONS_ES[tpl.slug];
    const translations = esTranslation ? { es: esTranslation } : {};
    // Soft-fail highway_notes column (migration 015 puede no estar aplicada aún)
    const upsertPayload: Record<string, unknown> = {
      slug: tpl.slug,
      region: tpl.region,
      title: tpl.title,
      seo_description: tpl.seo_description,
      seo_keywords: tpl.seo_keywords,
      hero_image_url: tpl.hero_image_url,
      origin_city: tpl.origin_city,
      destination_city: tpl.destination_city,
      days_count: tpl.days_count,
      travelers_count: 2,
      unit_system: 'imperial',
      currency: 'USD',
      locale: 'en',
      stops,
      translations,
      is_template: true,
      is_public: true,
      owner_id: null
    };
    if(tpl.highway_notes) upsertPayload.highway_notes = tpl.highway_notes;
    if(tpl.best_season) upsertPayload.best_season = tpl.best_season;
    if(tpl.difficulty) upsertPayload.difficulty = tpl.difficulty;
    if(tpl.total_distance_km) upsertPayload.total_distance_km = tpl.total_distance_km;
    let { error } = await sb.from('trips').upsert(upsertPayload, { onConflict: 'slug' });
    // Retry loop soft-fail: si columna nueva no existe, remover y reintentar
    const newCols = ['best_season', 'difficulty', 'total_distance_km', 'highway_notes'];
    for(const col of newCols){
      if(error && error.message.toLowerCase().includes(col)){
        delete upsertPayload[col];
        const retry = await sb.from('trips').upsert(upsertPayload, { onConflict: 'slug' });
        error = retry.error;
      }
    }
    results.push({ slug: tpl.slug, ok: !error, error: error?.message, translated: !!esTranslation });
  }

  return NextResponse.json({ seeded: results.length, translations_keys: translationsKeysCount, results });
}

// GET para verificar cuántos templates existen
export async function GET(){
  const sb = createAdminClient();
  const { data, error } = await sb.from('trips').select('slug, title, days_count').eq('is_template', true);
  if(error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ count: data?.length || 0, templates: data });
}
