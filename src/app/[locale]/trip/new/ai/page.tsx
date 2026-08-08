'use client';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useParams } from 'next/navigation';
import { QuestionnaireWizard, type QuestionnaireAnswers } from '@/components/trip/QuestionnaireWizard';
import { detectRegionHint } from '@/components/trip/AiGeneratorMap';

// Live map lazy-loaded (~85KB MapLibre) — cargar solo cuando el user llega a esta ruta.
const AiGeneratorMap = dynamic(() => import('@/components/trip/AiGeneratorMap').then(m => ({ default: m.AiGeneratorMap })), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-card bg-gradient-to-br from-ocean-100 via-ink-100 to-coral-100" />
});

const EXAMPLES = {
  en: [
    { emoji: '🏝️', text: '7 days along the California coast, seafood and hiking, avoiding highways when possible' },
    { emoji: '🎰', text: '4 days in Vegas + Grand Canyon + Zion for two friends who love photography' },
    { emoji: '🍷', text: '5 days Madrid to Barcelona with a Rioja detour, foodie couple' },
    { emoji: '🏜️', text: '10 days Southwest USA National Parks loop starting and ending in Vegas' },
    { emoji: '🏰', text: '6 days Andalucía from Sevilla to Granada, small towns, tapas, no crowds' }
  ],
  es: [
    { emoji: '🏝️', text: '7 días por la costa de California, mariscos y caminatas, evitando autopistas si se puede' },
    { emoji: '🎰', text: '4 días Las Vegas + Grand Canyon + Zion para dos amigos que aman la fotografía' },
    { emoji: '🍷', text: '5 días Madrid a Barcelona con desvío por La Rioja, pareja foodie' },
    { emoji: '🏜️', text: '10 días loop de Parques Nacionales del Southwest empezando y terminando en Las Vegas' },
    { emoji: '🏰', text: '6 días Andalucía Sevilla a Granada, pueblos pequeños, tapas, sin multitudes' }
  ]
};

const PHASES_EN = [
  'Analyzing your description…',
  'Selecting the best route…',
  'Placing stops with real coordinates…',
  'Almost done — building your trip…'
];
const PHASES_ES = [
  'Analizando tu descripción…',
  'Eligiendo la mejor ruta…',
  'Colocando paradas con coordenadas reales…',
  'Casi listo — armando tu viaje…'
];

interface PreviewStop { name: string; lat: number; lng: number; category?: string; }

export default function AiTripGeneratorPage(){
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = (params.locale === 'es' ? 'es' : 'en') as 'en' | 'es';
  const isEs = locale === 'es';

  const [mode, setMode] = useState<'choose' | 'wizard' | 'free'>('choose');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [wizardAnswers, setWizardAnswers] = useState<QuestionnaireAnswers | null>(null);
  const [previewStops, setPreviewStops] = useState<PreviewStop[]>([]);
  const [redirectingSlug, setRedirectingSlug] = useState<string | null>(null);

  // Región detectada en vivo por keywords (fly-to hint mientras el user escribe)
  const regionHint = useMemo(() => detectRegionHint(prompt), [prompt]);
  const mapPhase = redirectingSlug ? 'complete' : loading ? 'streaming' : (prompt.length > 5 ? 'thinking' : 'idle');

  const submit = async () => {
    if(prompt.trim().length < 10){
      setError(isEs ? 'Describe tu viaje con al menos 10 caracteres.' : 'Describe your trip in at least 10 characters.');
      return;
    }
    setError(null);
    setLoading(true);
    setPhase(0);
    setPreviewStops([]);

    const phases = isEs ? PHASES_ES : PHASES_EN;
    let idx = 0;
    const interval = setInterval(() => {
      idx = Math.min(idx + 1, phases.length - 1);
      setPhase(idx);
    }, 2200);

    try {
      const r = await fetch('/api/ai/generate-trip', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          locale,
          currency: isEs ? 'EUR' : 'USD',
          unit_system: isEs ? 'metric' : 'imperial',
          context: wizardAnswers ? { budget: wizardAnswers.budget, travelers: wizardAnswers.travelers, tripType: wizardAnswers.tripType, interests: wizardAnswers.interests, pace: wizardAnswers.pace, hasKids: wizardAnswers.hasKids, kidAges: wizardAnswers.kidAges, accessibility: wizardAnswers.accessibility } : undefined
        })
      });
      clearInterval(interval);
      const data = await r.json();
      if(!r.ok || !data.trip){
        if(data.error === 'free_limit_reached'){
          setError(isEs ? 'Alcanzaste el límite Free (3 viajes). Sube a Pro.' : 'Free limit reached (3 trips). Upgrade to Pro.');
        } else if(data.error === 'ai_unavailable'){
          setError(isEs ? 'IA no disponible en este momento. Intenta más tarde.' : 'AI temporarily unavailable. Try again later.');
        } else {
          setError(data.error || 'generation_failed');
        }
        setLoading(false);
        return;
      }
      // Reveal animation: preview stops en mapa, redirect después de stagger
      const stops = (data.trip.stops || []) as PreviewStop[];
      setPreviewStops(stops);
      setRedirectingSlug(data.trip.slug);
      // Delay redirect para que se vea la animación completa (350ms/stop + 500ms buffer)
      const revealMs = Math.min(stops.length * 350 + 800, 5000);
      setTimeout(() => {
        router.push(`/${locale}/trip/${data.trip.slug}`);
      }, revealMs);
    } catch (e) {
      clearInterval(interval);
      setError((e as Error).message);
      setLoading(false);
    }
  };

  const examples = EXAMPLES[locale];
  const phaseText = (isEs ? PHASES_ES : PHASES_EN)[phase];

  return (
    <main className="min-h-screen bg-gradient-to-br from-ocean-400/5 via-white to-coral-50">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Back button */}
        <div className="mb-4">
          <a
            href={`/${locale}`}
            className="inline-flex items-center gap-1.5 rounded-pill border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-ink-800 hover:shadow-card"
          >
            <span aria-hidden>←</span>
            {isEs ? 'Volver' : 'Back'}
          </a>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-pill border border-ocean-200 bg-ocean-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-ocean-700">
            <span aria-hidden>✨</span>
            {isEs ? 'IA Trip Generator · con mapa en vivo' : 'AI Trip Generator · with live map'}
          </span>
          <h1 className="font-display text-display-md text-balance text-ink-900 md:text-display-lg">
            {isEs ? 'Describe tu viaje. Míralo en el mapa.' : 'Describe your trip. Watch it appear.'}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-ink-500 text-balance">
            {isEs
              ? 'La IA arma tu itinerario y las paradas aparecen en el mapa en tiempo real. Con coordenadas verificadas.'
              : 'AI plans your itinerary and stops appear on the map in realtime. Verified coordinates.'}
          </p>
        </div>

        {/* Split view: form (izq) + map live (der) */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          {/* LEFT — Form */}
          <div className="flex flex-col">
            {mode === 'choose' && (
              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => setMode('wizard')}
                  className="group flex flex-col items-start gap-2 rounded-card border-2 border-ocean-200 bg-gradient-to-br from-ocean-50 to-white p-5 text-left transition hover:-translate-y-0.5 hover:border-ocean-500 hover:shadow-glow"
                >
                  <span className="inline-flex items-center gap-2 rounded-pill bg-ocean-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ocean-800">
                    {isEs ? '⭐ Recomendado' : '⭐ Recommended'}
                  </span>
                  <h3 className="font-display text-base font-semibold text-ink-900">
                    {isEs ? '🧭 Guiado (4 preguntas)' : '🧭 Guided (4 questions)'}
                  </h3>
                  <p className="text-xs text-ink-600">
                    {isEs ? 'Tipo, viajeros, presupuesto, intereses.' : 'Type, travelers, budget, interests.'}
                  </p>
                </button>
                <button
                  onClick={() => setMode('free')}
                  className="group flex flex-col items-start gap-2 rounded-card border-2 border-ink-100 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-coral-500 hover:shadow-card-hover"
                >
                  <span className="inline-flex items-center gap-2 rounded-pill bg-ink-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink-600">
                    {isEs ? 'Rápido' : 'Fast'}
                  </span>
                  <h3 className="font-display text-base font-semibold text-ink-900">
                    {isEs ? '✏️ Libre (texto)' : '✏️ Free (text)'}
                  </h3>
                  <p className="text-xs text-ink-600">
                    {isEs ? 'Escribe en tus palabras.' : 'Type in your words.'}
                  </p>
                </button>
              </div>
            )}

            {mode === 'wizard' && (
              <QuestionnaireWizard
                locale={locale}
                onSkip={() => setMode('free')}
                onComplete={(answers, suffix) => {
                  setWizardAnswers(answers);
                  const base = isEs
                    ? `Viaje personalizado usando el cuestionario`
                    : `Personalized trip based on questionnaire`;
                  setPrompt(base + suffix);
                  setMode('free');
                }}
              />
            )}

            {mode === 'free' && (
              <div className="rounded-card border border-ink-100 bg-white p-5 shadow-card md:p-6">
                {wizardAnswers && (
                  <div className="mb-3 flex items-center gap-2 rounded-pill bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                    <span aria-hidden>✅</span>
                    {isEs ? 'Cuestionario cargado' : 'Questionnaire loaded'}
                    <button onClick={() => { setWizardAnswers(null); setPrompt(''); setMode('choose'); }} className="ml-auto text-emerald-600 hover:text-emerald-900 underline">
                      {isEs ? 'Reiniciar' : 'Reset'}
                    </button>
                  </div>
                )}
                <label htmlFor="ai-prompt" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-500">
                  {isEs ? 'Describe tu viaje ideal' : 'Describe your ideal trip'}
                </label>
                <textarea
                  id="ai-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value.slice(0, 800))}
                  placeholder={isEs
                    ? 'Ej. 7 días por Andalucía con mi pareja, tapas y arquitectura, empezar en Sevilla y terminar en Granada.'
                    : 'e.g. 7 days through Andalucía with my partner, tapas and architecture, start in Seville end in Granada.'}
                  rows={5}
                  disabled={loading || !!redirectingSlug}
                  className="w-full resize-none rounded-card border border-ink-200 bg-white p-3.5 text-sm leading-relaxed text-ink-800 outline-none transition focus:border-coral-500 focus:ring-4 focus:ring-coral-100 disabled:bg-ink-50"
                />
                <div className="mt-1 flex items-center justify-between text-[11px] text-ink-400">
                  <span>{regionHint && <span className="text-ocean-700 font-semibold">📍 {regionHint.label}</span>}</span>
                  <span>{prompt.length}/800</span>
                </div>

                {error && (
                  <div className="mt-3 rounded-lg bg-coral-50 px-4 py-3 text-sm text-coral-700">{error}</div>
                )}

                {loading ? (
                  <div className="mt-5 flex items-center gap-3 rounded-pill bg-ocean-50 px-4 py-3">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-ocean-300 border-t-ocean-700" />
                    <span className="text-sm font-medium text-ocean-800">{phaseText}</span>
                  </div>
                ) : redirectingSlug ? (
                  <div className="mt-5 flex items-center gap-3 rounded-pill bg-emerald-50 px-4 py-3">
                    <span aria-hidden>🎉</span>
                    <span className="text-sm font-medium text-emerald-800">
                      {isEs ? 'Listo! Redirigiendo a tu viaje…' : 'Done! Redirecting to your trip…'}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={submit}
                    disabled={prompt.trim().length < 10}
                    className="mt-5 w-full rounded-pill bg-ink-900 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ink-800 hover:shadow-glow active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isEs ? '✨ Generar mi viaje con IA' : '✨ Generate my trip with AI'}
                  </button>
                )}
              </div>
            )}

            {/* Examples */}
            <div className="mt-6">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
                {isEs ? 'Prueba con un ejemplo' : 'Try an example'}
              </div>
              <div className="grid gap-1.5">
                {examples.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={loading || !!redirectingSlug}
                    onClick={() => { setPrompt(ex.text); setMode('free'); }}
                    className="group flex items-start gap-2 rounded-lg border border-ink-100 bg-white/70 px-3 py-2 text-left text-xs text-ink-700 transition hover:border-coral-200 hover:bg-white hover:shadow-card disabled:opacity-50"
                  >
                    <span className="text-base" aria-hidden>{ex.emoji}</span>
                    <span className="leading-relaxed">{ex.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Live map */}
          <div className="sticky top-4 h-[calc(100vh-8rem)] min-h-[500px] overflow-hidden rounded-card border border-ink-100 bg-ink-50 shadow-card-hover">
            <AiGeneratorMap
              stops={previewStops}
              hint={regionHint}
              locale={locale}
              phase={mapPhase}
            />
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-ink-400">
          {isEs ? '¿Prefieres armarlo manualmente? ' : 'Prefer to build it manually? '}
          <a href={`/${locale}/trip/new`} className="font-semibold text-ink-700 underline underline-offset-2 hover:text-coral-600">
            {isEs ? 'Planeador clásico' : 'Classic planner'}
          </a>
        </p>
      </div>
    </main>
  );
}
