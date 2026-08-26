#!/usr/bin/env tsx
/**
 * Auto-generate trip templates via free-tier AI, scoped to a region + persona matrix.
 *
 * Usage:
 *   OPENROUTER_API_KEY=... SUPABASE_URL=... SUPABASE_SECRET_KEY=... \
 *     npx tsx scripts/generate-templates.ts --region california --personas family,foodie,adventure --duration 3,5,7
 *
 * Args:
 *   --region     Region slug (required). Must match a region in the regions table.
 *   --personas   Comma-separated: family, foodie, adventure, romantic, budget, luxury, solo
 *   --duration   Comma-separated day counts: 3,5,7,10
 *   --dry-run    Don't INSERT to Supabase — just print JSON to stdout
 *   --limit      Max templates to generate per run (default 20, safety guard)
 *
 * Output: creates rows in `trips` with is_template=true, is_public=true, seo_* populated.
 *
 * Cost: $0 (uses OpenRouter free tier — 200 requests/day free).
 * Rate limit: 1 req every 4s to stay under 15 req/min free-tier ceiling.
 *
 * SEO impact: each template = one SEO-indexable page /{region}/{template-slug}.
 * Running matrix california × 5 personas × 3 durations = 15 templates.
 * Full run across 24 regions × 7 personas × 4 durations = ~672 potential templates.
 */

import { createClient } from '@supabase/supabase-js';
import { setTimeout as sleep } from 'node:timers/promises';

interface Args {
  region: string;
  personas: string[];
  durations: number[];
  dryRun: boolean;
  limit: number;
}

interface Persona {
  key: string;
  descriptor_en: string;
  descriptor_es: string;
  seo_hook_en: string;
}

const PERSONAS: Record<string, Persona> = {
  family: {
    key: 'family',
    descriptor_en: 'family with kids, safety-first, kid-friendly stops with snacks and restrooms every 90 min',
    descriptor_es: 'familia con niños, seguridad primero, paradas kid-friendly con snacks y baños cada 90 min',
    seo_hook_en: 'family road trip with kids'
  },
  foodie: {
    key: 'foodie',
    descriptor_en: 'culinary traveler, prioritize regional specialties, farm-to-table, iconic local dishes',
    descriptor_es: 'viajero gastronómico, prioriza especialidades regionales, farm-to-table, platillos icónicos',
    seo_hook_en: 'foodie road trip'
  },
  adventure: {
    key: 'adventure',
    descriptor_en: 'outdoor adventurer, hiking, kayaking, off-the-beaten-path stops, sunrise viewpoints',
    descriptor_es: 'aventurero outdoor, hiking, kayak, paradas off-the-beaten-path, miradores de amanecer',
    seo_hook_en: 'adventure road trip'
  },
  romantic: {
    key: 'romantic',
    descriptor_en: 'couples getaway, wineries, sunset viewpoints, boutique hotels, romantic dinners',
    descriptor_es: 'escape en pareja, viñedos, miradores de atardecer, hoteles boutique, cenas románticas',
    seo_hook_en: 'romantic road trip for couples'
  },
  budget: {
    key: 'budget',
    descriptor_en: 'shoestring traveler, free viewpoints, gas station food OK, camping over hotels, under $80/day',
    descriptor_es: 'viajero con presupuesto, miradores gratis, comida de gasolinera OK, camping vs hoteles, menos de $80/día',
    seo_hook_en: 'budget road trip under $100 per day'
  },
  luxury: {
    key: 'luxury',
    descriptor_en: 'premium experience, 5-star hotels, tasting menus, private tours, $500+/day',
    descriptor_es: 'experiencia premium, hoteles 5 estrellas, menús de degustación, tours privados, $500+/día',
    seo_hook_en: 'luxury road trip'
  },
  solo: {
    key: 'solo',
    descriptor_en: 'solo traveler, safe, journal-worthy stops, digital detox spots, meetup-friendly cafes',
    descriptor_es: 'viajero solo, seguro, paradas para journaling, spots de digital detox, cafés meetup-friendly',
    seo_hook_en: 'solo road trip'
  }
};

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const get = (flag: string) => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const region = get('--region');
  if (!region) {
    console.error('Missing --region. Example: --region california');
    process.exit(1);
  }
  return {
    region,
    personas: (get('--personas') || 'family,foodie,adventure').split(',').map((s) => s.trim()).filter(Boolean),
    durations: (get('--duration') || '3,5,7').split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => n > 0 && n < 30),
    dryRun: argv.includes('--dry-run'),
    limit: parseInt(get('--limit') || '20', 10)
  };
}

interface AIStop {
  name: string;
  day: number;
  duration_minutes: number;
  arrival_hh_mm?: string;
  category: string;
  notes: string;
  lat?: number;
  lng?: number;
}

interface AITemplate {
  title: string;
  seo_description: string;
  seo_keywords: string[];
  stops: AIStop[];
}

async function askAI(region: string, persona: Persona, duration: number): Promise<AITemplate | null> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    console.error('Missing OPENROUTER_API_KEY');
    return null;
  }

  const system = `You are a US road trip expert generating an SEO-optimized itinerary template.

Return ONLY valid JSON matching this schema:
{
  "title": "string, 50-70 chars, includes region + persona + duration",
  "seo_description": "155 chars max, natural language, no keyword stuffing",
  "seo_keywords": ["array", "of", "6-10", "keywords"],
  "stops": [
    {
      "name": "specific POI name, real place",
      "day": 1,
      "duration_minutes": 60,
      "arrival_hh_mm": "09:30",
      "category": "landmark|food|nature|museum|activity|lodging|drive",
      "notes": "1-2 sentence tip, best time, insider hint",
      "lat": 34.0,
      "lng": -118.5
    }
  ]
}

Rules:
- Generate 4-6 stops per day × ${duration} days = ${duration * 5} stops total (aim for 5/day).
- Include real POI names — no generic "local diner". If unsure use "Search: [category] in [town name]".
- Coordinates approximate is OK (regional center).
- Notes should be concrete: "arrive before 8am to skip lines", "$25 entry, cash only".`;

  const user = `Region: ${region}
Persona: ${persona.descriptor_en}
Duration: ${duration} days
SEO hook: "${persona.seo_hook_en} ${region}"

Generate the template JSON now.`;

  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://triploop.app',
      'X-Title': 'TripLoop Template Generator'
    },
    body: JSON.stringify({
      model: 'google/gemma-4-26b-a4b-it:free',
      max_tokens: 2000,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    })
  });

  if (!r.ok) {
    console.error(`AI request failed: ${r.status} ${await r.text()}`);
    return null;
  }
  const data = await r.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content || '';
  try {
    return JSON.parse(content) as AITemplate;
  } catch (e) {
    console.error('AI returned invalid JSON:', (e as Error).message);
    console.error('Raw:', content.slice(0, 200));
    return null;
  }
}

function slugify(s: string): string {
  return s.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

async function main(){
  const args = parseArgs();
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;
  if (!args.dryRun && (!supabaseUrl || !supabaseKey)) {
    console.error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY (or use --dry-run)');
    process.exit(1);
  }
  const sb = !args.dryRun ? createClient(supabaseUrl!, supabaseKey!) : null;

  const validPersonas = args.personas.filter((p) => PERSONAS[p]);
  if (validPersonas.length === 0) {
    console.error(`No valid personas. Options: ${Object.keys(PERSONAS).join(', ')}`);
    process.exit(1);
  }

  const combinations = validPersonas.flatMap((p) => args.durations.map((d) => ({ persona: PERSONAS[p], duration: d })));
  const capped = combinations.slice(0, args.limit);
  console.log(`Generating ${capped.length} templates for region "${args.region}" (dry-run: ${args.dryRun})`);

  let created = 0;
  let failed = 0;

  for (const { persona, duration } of capped) {
    const label = `${args.region}/${persona.key}/${duration}d`;
    console.log(`[${created + failed + 1}/${capped.length}] ${label} — asking AI...`);
    const tpl = await askAI(args.region, persona, duration);
    if (!tpl || !tpl.stops || tpl.stops.length === 0) {
      console.log(`  ✗ failed`);
      failed++;
      await sleep(4000); // rate limit even on failure
      continue;
    }
    const slug = `${args.region}-${persona.key}-${duration}d-${Date.now().toString(36)}`;
    const record = {
      slug,
      title: tpl.title,
      seo_description: tpl.seo_description,
      seo_keywords: tpl.seo_keywords,
      is_template: true,
      is_public: true,
      stops: tpl.stops,
      description: `${persona.seo_hook_en} in ${args.region}, ${duration} days.`,
      metadata: { generated_by: 'scripts/generate-templates.ts', persona: persona.key, duration_days: duration, region: args.region }
    };
    if (args.dryRun) {
      console.log(`  ✓ (dry-run) ${slug}`);
      console.log(JSON.stringify(record, null, 2));
    } else {
      const { error } = await sb!.from('trips').insert(record);
      if (error) {
        console.log(`  ✗ insert failed: ${error.message}`);
        failed++;
      } else {
        console.log(`  ✓ created ${slug}`);
        created++;
      }
    }
    // Rate limit: 15 req/min free tier = 4s between requests
    await sleep(4000);
  }

  console.log('\n=== Summary ===');
  console.log(`Created: ${created}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${capped.length}`);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
