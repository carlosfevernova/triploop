'use client';
import { useEffect, useState } from 'react';
import { L } from '@/lib/l4';
import type { Locale } from '@/i18n/request';

// S50: Feature tour first-visit para itinerary.
// S71n: 4-locale migration. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
const KEY = 'triploop_itinerary_tour_v1';

type LangStr = Record<Locale, string>;
interface Step { title: LangStr; body: LangStr; emoji: string; }

const STEPS: Step[] = [
  {
    emoji: '🗓',
    title: {
      en: 'Day-by-day timeline',
      es: 'Timeline día por día',
      pt: 'Timeline dia por dia',
      de: 'Zeitleiste Tag für Tag'
    },
    body: {
      en: 'Each day has a horizontal chip in the navigator above. Click one to see its stops with start times, durations, and travel between them.',
      es: 'Cada día tiene un chip horizontal arriba. Toca uno para ver sus paradas con horas, duraciones y traslados entre ellas.',
      pt: 'Cada dia tem um chip horizontal no navegador acima. Toque em um para ver as paradas com horários, durações e traslados entre elas.',
      de: 'Jeder Tag hat einen horizontalen Chip im Navigator oben. Klicke einen an, um seine Stopps mit Startzeiten, Dauern und Reisen dazwischen zu sehen.'
    }
  },
  {
    emoji: '🔍',
    title: {
      en: 'Discover nearby',
      es: 'Descubre paradas cercanas',
      pt: 'Descubra paradas próximas',
      de: 'Entdecke Umgebung'
    },
    body: {
      en: 'Below the timeline, expand "Discover stops" to filter by category, rating, and radius. Add directly to the current day with one click.',
      es: 'Debajo del timeline, expande "Descubre paradas" para filtrar por categoría, rating y radio. Agrega al día actual con un clic.',
      pt: 'Abaixo do timeline, expanda "Descobrir paradas" para filtrar por categoria, avaliação e raio. Adicione ao dia atual com um clique.',
      de: 'Unter der Zeitleiste "Stopps entdecken" aufklappen, um nach Kategorie, Bewertung und Radius zu filtern. Mit einem Klick zum aktuellen Tag hinzufügen.'
    }
  },
  {
    emoji: '✨',
    title: {
      en: 'Edit with AI',
      es: 'Edita con IA',
      pt: 'Edite com IA',
      de: 'Mit KI bearbeiten'
    },
    body: {
      en: 'The ✨ AI button turns natural language into operations. Try "move Louvre to Thursday" or "schedule Tuesday at 10am". Preview before applying.',
      es: 'El botón ✨ IA convierte lenguaje natural en operaciones. Prueba "mueve el Louvre al jueves" o "programa el martes a las 10am". Preview antes de aplicar.',
      pt: 'O botão ✨ IA converte linguagem natural em operações. Tente "mover o Louvre para quinta" ou "agendar terça às 10h". Preview antes de aplicar.',
      de: 'Der ✨ KI-Button verwandelt natürliche Sprache in Operationen. Probiere "Louvre auf Donnerstag verschieben" oder "Dienstag um 10 Uhr planen". Vorschau vor dem Anwenden.'
    }
  },
  {
    emoji: '🚗',
    title: {
      en: 'Live traffic between stops',
      es: 'Tráfico en vivo entre paradas',
      pt: 'Trânsito ao vivo entre paradas',
      de: 'Live-Verkehr zwischen Stopps'
    },
    body: {
      en: 'Travel segments show real-time driving times from Google Routes. Optimize the day with ✨ Optimize to minimize distance.',
      es: 'Los traslados muestran tiempos reales de Google Routes con tráfico. Optimiza el día con ✨ Optimizar para minimizar distancia.',
      pt: 'Os traslados mostram tempos reais do Google Routes com trânsito. Otimize o dia com ✨ Otimizar para minimizar a distância.',
      de: 'Reiseabschnitte zeigen Echtzeit-Fahrzeiten von Google Routes. Optimiere den Tag mit ✨ Optimieren, um die Entfernung zu minimieren.'
    }
  },
  {
    emoji: '👥',
    title: {
      en: 'Real-time collab + Offline',
      es: 'Colab en vivo + Offline',
      pt: 'Colab ao vivo + Offline',
      de: 'Live-Zusammenarbeit + Offline'
    },
    body: {
      en: "Share the URL to plan with friends. Changes sync in real time. Works offline — your edits queue and sync when you're back online.",
      es: 'Comparte la URL para planear con amigos. Los cambios sincronizan en vivo. Funciona offline — tus cambios se encolan y sincronizan al volver.',
      pt: 'Compartilhe a URL para planejar com amigos. As alterações sincronizam ao vivo. Funciona offline — suas edições ficam em fila e sincronizam ao voltar online.',
      de: 'Teile die URL, um mit Freunden zu planen. Änderungen werden live synchronisiert. Funktioniert offline — deine Bearbeitungen werden gepuffert und synchronisiert, sobald du wieder online bist.'
    }
  }
];

interface Props { locale: string; }

export function FeatureTour({ locale }: Props){
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if(typeof localStorage === 'undefined') return;
    try {
      if(!localStorage.getItem(KEY)){
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
  const quickTour = L(locale, { en: 'Quick tour', es: 'Tour rápido', pt: 'Tour rápido', de: 'Kurztour' });
  const skipWord = L(locale, { en: 'Skip', es: 'Saltar', pt: 'Pular', de: 'Überspringen' });
  const backWord = L(locale, { en: 'Back', es: 'Atrás', pt: 'Voltar', de: 'Zurück' });
  const startCta = L(locale, { en: 'Get started!', es: '¡Empezar!', pt: 'Vamos lá!', de: 'Los geht\'s!' });
  const nextWord = L(locale, { en: 'Next', es: 'Siguiente', pt: 'Próximo', de: 'Weiter' });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/60 backdrop-blur-sm px-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-card border border-ink-100 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-coral-600">
            {quickTour} · {step + 1}/{STEPS.length}
          </span>
          <button onClick={dismiss} className="text-xs text-ink-500 hover:text-ink-800">{skipWord}</button>
        </div>

        <div className="px-6 py-6">
          <div className="mb-4 text-5xl">{current.emoji}</div>
          <h2 className="mb-2 font-display text-xl font-semibold text-ink-900">{L(locale, current.title)}</h2>
          <p className="text-sm leading-relaxed text-ink-600">{L(locale, current.body)}</p>
        </div>

        <div className="flex justify-center gap-1.5 pb-4">
          {STEPS.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-coral-500' : 'w-1.5 bg-ink-200'}`} />
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-ink-100 px-5 py-3">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-pill px-3 py-1.5 text-xs font-semibold text-ink-500 hover:text-ink-900 disabled:opacity-30"
          >← {backWord}</button>
          <button
            onClick={() => isLast ? dismiss() : setStep(s => s + 1)}
            className="rounded-pill bg-ink-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-ink-700"
          >
            {isLast ? startCta : `${nextWord} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
