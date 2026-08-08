import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { CALIFORNIA_TEMPLATES } from '@/lib/templates-seed';

export const runtime = 'edge';

// One-shot seed endpoint. Idempotent: upserts por slug.
// Protegido con SEED_TOKEN env var (setear en Vercel + llamar con header X-Seed-Token).
export async function POST(req: Request){
  const token = (req.headers.get('x-seed-token') || '').trim();
  const expected = (process.env.SEED_TOKEN || '').trim();
  if(!expected || token !== expected){
    return NextResponse.json({ error: 'unauthorized', hint_len_expected: expected.length, hint_len_got: token.length }, { status: 401 });
  }

  const sb = createAdminClient();
  const results: Array<{ slug: string; ok: boolean; error?: string }> = [];

  for(const tpl of CALIFORNIA_TEMPLATES){
    const stops = tpl.stops.map((s, i) => ({
      id: `tpl-${tpl.slug}-${i}`,
      name: s.name,
      address: s.address,
      lat: s.lat,
      lng: s.lng,
      duration_min: s.duration_min,
      category: s.category || 'other'
    }));
    const { error } = await sb.from('trips').upsert({
      slug: tpl.slug,
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
      is_template: true,
      is_public: true,
      owner_id: null
    }, { onConflict: 'slug' });
    results.push({ slug: tpl.slug, ok: !error, error: error?.message });
  }

  return NextResponse.json({ seeded: results.length, results });
}

// GET para verificar cuántos templates existen
export async function GET(){
  const sb = createAdminClient();
  const { data, error } = await sb.from('trips').select('slug, title, days_count').eq('is_template', true);
  if(error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ count: data?.length || 0, templates: data });
}
