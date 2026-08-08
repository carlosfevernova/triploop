'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

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

export default function AiTripGeneratorPage(){
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = (params.locale === 'es' ? 'es' : 'en') as 'en' | 'es';
  const isEs = locale === 'es';

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if(prompt.trim().length < 10){
      setError(isEs ? 'Describe tu viaje con al menos 10 caracteres.' : 'Describe your trip in at least 10 characters.');
      return;
    }
    setError(null);
    setLoading(true);
    setPhase(0);

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
          unit_system: isEs ? 'metric' : 'imperial'
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
      router.push(`/${locale}/trip/${data.trip.slug}`);
    } catch (e) {
      clearInterval(interval);
      setError((e as Error).message);
      setLoading(false);
    }
  };

  const examples = EXAMPLES[locale];
  const phaseText = (isEs ? PHASES_ES : PHASES_EN)[phase];

  return (
    <main className="min-h-screen bg-gradient-to-br from-ocean-400/10 via-white to-coral-50">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <div className="mb-10 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-pill border border-ocean-200 bg-ocean-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-ocean-700">
            <span aria-hidden>✨</span>
            {isEs ? 'IA Trip Generator · Beta' : 'AI Trip Generator · Beta'}
          </span>
          <h1 className="font-display text-display-md text-balance text-ink-900 md:text-display-lg">
            {isEs ? 'Describe tu viaje. La IA lo arma.' : 'Describe your trip. AI plans it.'}
          </h1>
          <p className="mt-3 text-lg text-ink-500 text-balance">
            {isEs
              ? 'Cuéntanos qué te gusta, cuántos días y a dónde. Generamos itinerario con paradas reales y coordenadas.'
              : 'Tell us what you like, how many days and where. We build an itinerary with real stops and coordinates.'}
          </p>
        </div>

        <div className="rounded-card border border-ink-100 bg-white p-6 shadow-card md:p-8">
          <label htmlFor="ai-prompt" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-500">
            {isEs ? 'Describe tu viaje ideal' : 'Describe your ideal trip'}
          </label>
          <textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, 800))}
            placeholder={isEs
              ? 'Ej. 7 días por Andalucía con mi pareja, nos gustan tapas y arquitectura, empezar en Sevilla y terminar en Granada, presupuesto medio-alto.'
              : 'e.g. 7 days through Andalucía with my partner, we love tapas and architecture, start in Seville and end in Granada, mid-high budget.'}
            rows={5}
            disabled={loading}
            className="w-full resize-none rounded-card border border-ink-200 bg-white p-4 text-sm leading-relaxed text-ink-800 outline-none transition focus:border-coral-500 focus:ring-4 focus:ring-coral-100 disabled:bg-ink-50"
          />
          <div className="mt-1 flex items-center justify-between text-[11px] text-ink-400">
            <span>{isEs ? 'Mínimo 10 caracteres · Máximo 800' : 'Min 10 chars · Max 800'}</span>
            <span>{prompt.length}/800</span>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-coral-50 px-4 py-3 text-sm text-coral-700">{error}</div>
          )}

          {loading ? (
            <div className="mt-6 flex items-center gap-3 rounded-pill bg-ocean-50 px-5 py-4">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-ocean-300 border-t-ocean-700" />
              <span className="text-sm font-medium text-ocean-800">{phaseText}</span>
            </div>
          ) : (
            <button
              onClick={submit}
              disabled={prompt.trim().length < 10}
              className="mt-6 w-full rounded-pill bg-ink-900 py-4 text-sm font-semibold text-white transition hover:bg-ink-800 hover:shadow-glow disabled:opacity-40"
            >
              {isEs ? '✨ Generar mi viaje con IA' : '✨ Generate my trip with AI'}
            </button>
          )}
        </div>

        <div className="mt-10">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
            {isEs ? 'Prueba con un ejemplo' : 'Try an example'}
          </div>
          <div className="grid gap-2">
            {examples.map((ex, i) => (
              <button
                key={i}
                type="button"
                disabled={loading}
                onClick={() => setPrompt(ex.text)}
                className="group flex items-start gap-3 rounded-card border border-ink-100 bg-white/70 px-4 py-3 text-left text-sm text-ink-700 transition hover:border-coral-200 hover:bg-white hover:shadow-card disabled:opacity-50"
              >
                <span className="text-lg" aria-hidden>{ex.emoji}</span>
                <span className="leading-relaxed">{ex.text}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-ink-400">
          {isEs
            ? '¿Prefieres armarlo manualmente? '
            : 'Prefer to build it manually? '}
          <a href={`/${locale}/trip/new`} className="font-semibold text-ink-700 underline underline-offset-2 hover:text-coral-600">
            {isEs ? 'Planeador clásico' : 'Classic planner'}
          </a>
        </p>
      </div>
    </main>
  );
}
