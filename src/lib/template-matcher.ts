// S28: curated-first matcher — busca template existente matching prompt ANTES de llamar AI.
// Speed: < 100ms vs 15-40s AI. 0 tokens cost.
// Estrategia: extract region keywords + days_count + interests → score match.

import { ALL_TEMPLATES, type SeedTemplate, type Region } from './templates-seed';

interface MatchScore {
  template: SeedTemplate;
  score: number;
  reasons: string[];
}

const REGION_KEYWORDS: Record<Region, string[]> = {
  california: ['california', 'los angeles', 'san francisco', 'lax', 'sfo', 'big sur', 'yosemite', 'napa', 'pch', 'pacific coast', 'ca ', ' la ', ' sf '],
  nevada: ['nevada', 'las vegas', 'reno', 'lake tahoe', 'vegas', 'strip'],
  arizona: ['arizona', 'grand canyon', 'phoenix', 'sedona', 'tucson', 'antelope canyon', 'flagstaff'],
  utah: ['utah', 'zion', 'bryce', 'arches', 'canyonlands', 'moab', 'salt lake', 'mighty 5'],
  southwest: ['southwest', 'route 66', 'grand circle', 'four corners', 'monument valley'],
  spain: ['spain', 'españa', 'madrid', 'barcelona', 'sevilla', 'seville', 'granada', 'andalucia', 'andalucía', 'valencia', 'camino de santiago', 'rioja'],
  'pacific-northwest': ['pacific northwest', 'pnw', 'seattle', 'portland', 'olympic', 'mt rainier', 'mount rainier', 'cascade', 'oregon coast', 'cannon beach'],
  northeast: ['northeast', 'new england', 'boston', 'vermont', 'maine', 'new hampshire', 'acadia', 'kancamagus', 'blue ridge', 'shenandoah', 'smoky mountain', 'appalachian', 'asheville', 'foliage', 'leaf peeping'],
  southeast: ['southeast', 'florida keys', 'key west', 'miami', 'overseas highway', 'seven mile bridge', 'mississippi', 'new orleans', 'memphis', 'blues', 'natchez', 'great river'],
  rockies: ['rockies', 'rocky mountains', 'glacier', 'yellowstone', 'grand teton', 'jackson', 'aspen', 'denver', 'vail', 'montana', 'wyoming', 'colorado', 'going-to-the-sun'],
  italy: ['italy', 'italia', 'amalfi', 'positano', 'cinque terre', 'florence', 'firenze', 'rome', 'roma', 'tuscany', 'toscana', 'naples', 'napoli', 'ravello', 'siena'],
  iceland: ['iceland', 'islandia', 'reykjavik', 'ring road', 'golden circle', 'jökulsárlón', 'jokulsarlon', 'vik', 'akureyri', 'mývatn', 'myvatn', 'snæfellsnes'],
  ireland: ['ireland', 'irlanda', 'kerry', 'killarney', 'kenmare', 'cliffs of moher', 'galway', 'dublin', 'wild atlantic', 'wicklow'],
  australia: ['australia', 'great ocean road', 'twelve apostles', '12 apostles', 'melbourne', 'sydney', 'warrnambool', 'lorne', 'bells beach'],
  'new-zealand': ['new zealand', 'nueva zelanda', 'queenstown', 'milford sound', 'christchurch', 'franz josef', 'wanaka', 'tekapo', 'south island', 'nelson', 'abel tasman'],
  germany: ['germany', 'alemania', 'romantic road', 'neuschwanstein', 'rothenburg', 'würzburg', 'wurzburg', 'füssen', 'fussen', 'bavaria', 'baviera', 'augsburg', 'dinkelsbühl']
};

const INTEREST_KEYWORDS: Record<string, string[]> = {
  nature: ['nature', 'naturaleza', 'park', 'parque', 'national park', 'hiking', 'caminata', 'mountain', 'montaña', 'lake', 'lago', 'forest', 'bosque', 'wildlife'],
  food: ['food', 'comida', 'foodie', 'restaurant', 'restaurante', 'tapas', 'wine', 'vino', 'brewery', 'cerveza', 'coffee', 'café'],
  city: ['city', 'ciudad', 'urban', 'downtown', 'centro'],
  beach: ['beach', 'playa', 'coast', 'costa', 'ocean', 'océano', 'seafood', 'mariscos'],
  photography: ['photo', 'foto', 'instagram', 'sunset', 'atardecer', 'golden hour'],
  culture: ['culture', 'cultura', 'history', 'historia', 'museum', 'museo', 'architecture', 'arquitectura', 'art', 'arte']
};

export interface MatchResult {
  matched: boolean;
  template?: SeedTemplate;
  confidence: number;   // 0-1
  reasons?: string[];
  suggestedDaysCount?: number;
}

export function extractDays(prompt: string): number | null {
  const p = prompt.toLowerCase();
  const m = p.match(/(\d+)\s*(days?|d[íi]as?|weeks?|semanas?)/i);
  if(!m) return null;
  const n = parseInt(m[1], 10);
  if(/week|semana/i.test(m[2])) return n * 7;
  return n;
}

export function extractRegionKey(prompt: string): Region | null {
  const p = prompt.toLowerCase();
  let bestRegion: Region | null = null;
  let bestScore = 0;
  for(const [region, keywords] of Object.entries(REGION_KEYWORDS) as [Region, string[]][]) {
    let score = 0;
    for(const k of keywords){
      if(p.includes(k)) score++;
    }
    if(score > bestScore){
      bestScore = score;
      bestRegion = region;
    }
  }
  return bestRegion;
}

export function matchTemplate(prompt: string): MatchResult {
  const region = extractRegionKey(prompt);
  const days = extractDays(prompt);

  if(!region) return { matched: false, confidence: 0 };

  // Filter templates de esta región
  const candidates = ALL_TEMPLATES.filter(t => t.region === region);
  if(candidates.length === 0) return { matched: false, confidence: 0 };

  // Score cada candidato
  const p = prompt.toLowerCase();
  const scored: MatchScore[] = candidates.map(t => {
    let score = 0;
    const reasons: string[] = [];

    // Days match (±1 día = full match, ±3 = half, else 0)
    if(days){
      const diff = Math.abs(t.days_count - days);
      if(diff === 0){ score += 40; reasons.push(`exact days (${days})`); }
      else if(diff <= 1){ score += 30; reasons.push(`close days (${t.days_count} vs ${days})`); }
      else if(diff <= 3){ score += 15; reasons.push(`similar days (${t.days_count} vs ${days})`); }
    } else {
      // Sin días, penalizar templates muy largos/cortos
      if(t.days_count >= 3 && t.days_count <= 7) score += 10;
    }

    // Region match (ya filtrado, todos +20)
    score += 20;
    reasons.push(`region: ${region}`);

    // SEO keywords match
    const seoWords = (t.seo_keywords || []).join(' ').toLowerCase();
    const seoOverlap = (t.seo_keywords || []).filter(k => p.includes(k.toLowerCase().split(' ')[0])).length;
    if(seoOverlap > 0){ score += seoOverlap * 5; reasons.push(`${seoOverlap} SEO keywords`); }

    // Origin/destination city match
    if(p.includes(t.origin_city.toLowerCase())){ score += 15; reasons.push(`origin: ${t.origin_city}`); }
    if(p.includes(t.destination_city.toLowerCase())){ score += 15; reasons.push(`dest: ${t.destination_city}`); }

    // Stop names match (particular stops mencionados)
    let stopOverlap = 0;
    for(const s of t.stops){
      const firstWord = s.name.toLowerCase().split(/\s+/)[0];
      if(firstWord.length > 3 && p.includes(firstWord)) stopOverlap++;
    }
    if(stopOverlap > 0){ score += stopOverlap * 8; reasons.push(`${stopOverlap} stops matched`); }

    // Interest keywords (bonus)
    for(const [, intKw] of Object.entries(INTEREST_KEYWORDS)){
      const hit = intKw.some(k => p.includes(k));
      if(hit && seoWords.match(new RegExp(intKw[0], 'i'))) score += 5;
    }

    return { template: t, score, reasons };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored[0];

  // Threshold: score >= 45 (region + days close or origin/dest + 1-2 seo/stop match)
  const MATCH_THRESHOLD = 45;
  const confidence = Math.min(1, top.score / 100);

  if(top.score < MATCH_THRESHOLD){
    return { matched: false, confidence, suggestedDaysCount: days || undefined };
  }

  return {
    matched: true,
    template: top.template,
    confidence,
    reasons: top.reasons,
    suggestedDaysCount: days || undefined
  };
}
