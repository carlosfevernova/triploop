'use client';
import { useEffect, useState } from 'react';

// S50: Feature tour first-visit para itinerary.
// Pattern Linear/Notion: overlay con tooltip que apunta al feature + next/skip.
// LocalStorage dismiss permanente.

const KEY = 'triploop_itinerary_tour_v1';

interface Step {
  title: { en: string; es: string };
  body: { en: string; es: string };
  emoji: string;
}

const STEPS: Step[] = [
  {
    emoji: '🗓',
    title: { en: 'Day-by-day timeline', es: 'Timeline día por día' },
    body: {
      en: 'Each day has a horizontal chip in the navigator above. Click one to see its stops with start times, durations, and travel between them.',
      es: 'Cada día tiene un chip horizontal arriba. Toca uno para ver sus paradas con horas, duraciones y traslados entre ellas.'
    }
  },
  {
    emoji: '🔍',
    title: { en: 'Discover nearby', es: 'Descubre paradas cercanas' },
    body: {
      en: 'Below the timeline, expand "Discover stops" to filter by category, rating, and radius. Add directly to the current day with one click.',
      es: 'Debajo del timeline, expande "Descubre paradas" para filtrar por categoría, rating y radio. Agrega al día actual con un clic.'
    }
  },
  {
    emoji: '✨',
    title: { en: 'Edit with AI', es: 'Edita con IA' },
    body: {
      en: 'The ✨ AI button turns natural language into operations. Try "move Louvre to Thursday" or "schedule Tuesday at 10am". Preview before applying.',
      es: 'El botón ✨ IA convierte lenguaje natural en operaciones. Prueba "mueve el Louvre al jueves" o "programa el martes a las 10am". Preview antes de aplicar.'
    }
  },
  {
    emoji: '🚗',
    title: { en: 'Live traffic between stops', es: 'Tráfico en vivo entre paradas' },
    body: {
      en: 'Travel segments show real-time driving times from Google Routes. Optimize the day with ✨ Optimize to minimize distance.',
      es: 'Los traslados muestran tiempos reales de Google Routes con tráfico. Optimiza el día con ✨ Optimizar para minimizar distancia.'
    }
  },
  {
    emoji: '👥',
    title: { en: 'Real-time collab + Offline', es: 'Colab en vivo + Offline' },
    body: {
      en: 'Share the URL to plan with friends. Changes sync in real time. Works offline — your edits queue and sync when you\'re back online.',
      es: 'Comparte la URL para planear con amigos. Los cambios sincronizan en vivo. Funciona offline — tus cambios se encolan y sincronizan al volver.'
    }
  }
];

interface Props {
  locale: 'en' | 'es';
}

export function FeatureTour({ locale }: Props){
  const isEs = locale === 'es';
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if(typeof localStorage === 'undefined') return;
    try {
      if(!localStorage.getItem(KEY)){
        // Delay 800ms para que la página cargue primero
        const timer = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const dismiss = () => {
    try { localStorage.setItem(KEY, JSON.stringify({ at: Date.now() })); } catch {}
    setVisible(false);
  };

  if(!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/60 backdrop-blur-sm px-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-card border border-ink-100 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-coral-600">
            {isEs ? 'Tour rápido' : 'Quick tour'} · {step + 1}/{STEPS.length}
          </span>
          <button
            onClick={dismiss}
            className="text-xs text-ink-500 hover:text-ink-800"
          >{isEs ? 'Saltar' : 'Skip'}</button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <div className="mb-4 text-5xl">{current.emoji}</div>
          <h2 className="mb-2 font-display text-xl font-semibold text-ink-900">
            {isEs ? current.title.es : current.title.en}
          </h2>
          <p className="text-sm leading-relaxed text-ink-600">
            {isEs ? current.body.es : current.body.en}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 pb-4">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-coral-500' : 'w-1.5 bg-ink-200'}`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-ink-100 px-5 py-3">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-pill px-3 py-1.5 text-xs font-semibold text-ink-500 hover:text-ink-900 disabled:opacity-30"
          >← {isEs ? 'Atrás' : 'Back'}</button>
          <button
            onClick={() => isLast ? dismiss() : setStep(s => s + 1)}
            className="rounded-pill bg-ink-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-ink-700"
          >
            {isLast ? (isEs ? '¡Empezar!' : 'Get started!') : `${isEs ? 'Siguiente' : 'Next'} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
