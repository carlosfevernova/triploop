'use client';
import { useState } from 'react';

interface QA {
  q_en: string; q_es: string;
  a_en: string; a_es: string;
}

const QA: QA[] = [
  {
    q_en: 'Do I need to sign up to plan a trip?',
    q_es: '¿Necesito registrarme para planear un viaje?',
    a_en: 'No. Free plan lets you plan and share up to 3 trips without an account. To save, sync across devices or unlock offline maps, create a free account.',
    a_es: 'No. El plan gratis te deja planear y compartir hasta 3 viajes sin cuenta. Para guardar, sincronizar entre dispositivos o mapas offline, crea cuenta gratis.'
  },
  {
    q_en: 'How accurate are the drive times?',
    q_es: '¿Qué tan precisos son los tiempos de manejo?',
    a_en: 'We use Google Routes API v2 with live traffic and TRAFFIC_AWARE mode — the same data that powers Google Maps. LA→SF really is 6 hours in bad traffic, not the 2h fantasy some tools show.',
    a_es: 'Usamos Google Routes API v2 con tráfico en vivo — los mismos datos de Google Maps. LA→SF sí son 6 horas en tráfico real, no las 2h de fantasía de otros planeadores.'
  },
  {
    q_en: 'What AI does TripLoop use?',
    q_es: '¿Qué IA usa TripLoop?',
    a_en: 'Open-source models first: DeepSeek V3 via Fireworks (best cost/quality) with fallback to Llama 3.3 70B via Groq (ultra-fast). Anthropic Claude Haiku as backup. Zero vendor lock-in.',
    a_es: 'Modelos open-source primero: DeepSeek V3 vía Fireworks (mejor costo/calidad) con fallback a Llama 3.3 70B en Groq (ultra rápido). Claude Haiku de Anthropic como respaldo. Cero vendor lock-in.'
  },
  {
    q_en: 'Can I use TripLoop offline in a national park?',
    q_es: '¿Puedo usar TripLoop offline en un parque nacional?',
    a_en: 'Yes — Pro plan pre-caches map tiles + itinerary for any trip you mark "Save offline". Works in Yosemite, Big Sur, Death Valley where signal is zero. Free trial 14 days.',
    a_es: 'Sí — el plan Pro pre-cachea tiles del mapa + itinerario para cualquier viaje que marques "Guardar offline". Funciona en Yosemite, Big Sur, Death Valley sin señal. Prueba 14 días gratis.'
  },
  {
    q_en: 'How do I book hotels and activities?',
    q_es: '¿Cómo reservo hoteles y actividades?',
    a_en: 'Every stop has 🏨 Hotels (Booking.com) and 🎭 Tours (GetYourGuide) buttons that pre-fill your dates and destination. We earn a small commission — you never pay more.',
    a_es: 'Cada parada tiene botones 🏨 Hoteles (Booking.com) y 🎭 Tours (GetYourGuide) que pre-llenan tus fechas y destino. Ganamos una comisión pequeña — tú nunca pagas de más.'
  },
  {
    q_en: 'Is my trip data private?',
    q_es: '¿Mis datos de viaje son privados?',
    a_en: 'Anonymous trips are public via unique share link. Once you register, your trips are private by default and only readable by you (enforced via Supabase Row Level Security). No ads, no data selling.',
    a_es: 'Los viajes anónimos son públicos vía link único. Al registrarte, tus viajes son privados por defecto y solo tú los ves (Row Level Security en Supabase). Sin ads, sin venta de datos.'
  }
];

export function FAQ({ isEs }: { isEs?: boolean }){
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-coral-600">FAQ</p>
          <h2 className="font-display text-display-md text-ink-900 md:text-display-lg">
            {isEs ? 'Preguntas frecuentes' : 'Frequently asked questions'}
          </h2>
        </div>
        <div className="space-y-2">
          {QA.map((qa, i) => {
            const open = openIdx === i;
            return (
              <div key={i} className="overflow-hidden rounded-card border border-ink-100 bg-white shadow-card transition hover:shadow-card-hover">
                <button
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={open}
                >
                  <span className="font-display text-base font-semibold text-ink-900">
                    {isEs ? qa.q_es : qa.q_en}
                  </span>
                  <span className={`grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-coral-50 text-coral-600 transition ${open ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {open && (
                  <div className="border-t border-ink-100 bg-ink-50/30 px-5 py-4 text-sm leading-relaxed text-ink-700">
                    {isEs ? qa.a_es : qa.a_en}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
