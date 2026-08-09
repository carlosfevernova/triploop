// S40 P0.3: Single Source of Truth para métricas de plataforma.
// Reemplazar hardcoded strings en Hero, SocialProof, Comparison, FAQ, meta.
// Al agregar nueva región/template, actualizar aquí y todos los componentes usan el nuevo valor.

import { ALL_TEMPLATES, REGION_META } from './templates-seed';
import { CURATED_POIS, totalCuratedPOIs } from './curated-pois';

// Computed lazily (call once at module import, cached per serverless instance)
export const platformStats = {
  templates: ALL_TEMPLATES.length,                          // 60 post-S39
  regions: Object.keys(REGION_META).length,                 // 24 post-S34
  continents: 7,                                            // NA + SA + EU + AS + AF + OC + (LatAm within SA/NA)
  curatedPOIs: totalCuratedPOIs(),                          // 231+ post-S34
  regionsWithPOIs: Object.keys(CURATED_POIS).length,        // 24
  aiEndpoints: 6,                                           // generate-trip, insights, checklist, photo-spots, reshuffle, describe-stop
  streamingSSE: true,                                       // /api/ai/generate-trip/stream
  blogPosts: 16,                                            // 8 EN + 8 ES
  integrations: 20,                                         // Vercel, Supabase (5), Stripe (3), Google (3), Resend, OpenRouter, Fireworks, Groq, Anthropic, OpenChargeMap, Booking+GYG, Twilio, OSM
  languages: 2,                                             // EN + ES
} as const;

export type PlatformStats = typeof platformStats;

// Human-friendly getters for i18n messages / UI
export function statsAsText(locale: 'en' | 'es' = 'en'): {
  templatesLabel: string;
  regionsLabel: string;
  continentsLabel: string;
  poisLabel: string;
  worldwideTagline: string;
} {
  const isEs = locale === 'es';
  return {
    templatesLabel: `${platformStats.templates} ${isEs ? 'rutas curadas' : 'curated routes'}`,
    regionsLabel: `${platformStats.regions} ${isEs ? 'regiones' : 'regions'}`,
    continentsLabel: `${platformStats.continents} ${isEs ? 'continentes' : 'continents'}`,
    poisLabel: `${platformStats.curatedPOIs} ${isEs ? 'POIs verificados' : 'verified POIs'}`,
    worldwideTagline: isEs
      ? `${platformStats.templates} rutas · ${platformStats.regions} regiones · ${platformStats.continents} continentes`
      : `${platformStats.templates} routes · ${platformStats.regions} regions · ${platformStats.continents} continents`
  };
}
