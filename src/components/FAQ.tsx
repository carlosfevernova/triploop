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
    a_en: 'Top open models with a four-provider safety net — if one goes down, your trip planner keeps working. Answers arrive in seconds, and we never lock into a single vendor so you never pay AI premium.',
    a_es: 'Los mejores modelos abiertos con red de seguridad de cuatro proveedores — si uno cae, tu planeador sigue funcionando. Las respuestas llegan en segundos, y no dependemos de un solo proveedor para que nunca pagues sobreprecio de IA.'
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
    a_en: 'Anonymous trips are public via unique share link. Once you register, your trips are private by default and only readable by you — enforced at the database level, not just the app. No ads, no data selling, ever.',
    a_es: 'Los viajes anónimos son públicos vía link único. Al registrarte, tus viajes son privados por defecto y solo tú los ves — protegido a nivel de base de datos, no solo en la app. Sin ads, sin venta de datos, nunca.'
  },
  {
    q_en: 'Which regions and countries does TripLoop cover?',
    q_es: '¿Qué regiones y países cubre TripLoop?',
    a_en: '24 regions across 7 continents (post-S34): USA (10 regions incl. California PCH, Rockies, Southeast Florida Keys), Europe (Spain, Italy Amalfi, Iceland Ring Road, Ireland Kerry, Germany Romantic Road, Scotland NC500), Asia (Japan Golden Route), Oceania (Australia Great Ocean Road, NZ South Island), Latin America (Mexico Riviera Maya, Chile Carretera Austral, Argentina Ruta 40, Peru Machu Picchu), Canada (Icefields Parkway), Africa (Morocco Sahara). 46 verified iconic routes with highway names.',
    a_es: '24 regiones en 7 continentes (post-S34): USA (10 regiones incl. California PCH, Rockies, Sureste Florida Keys), Europa (España, Italia Amalfi, Islandia Ring Road, Irlanda Kerry, Alemania Ruta Romántica, Escocia NC500), Asia (Japón Ruta Dorada), Oceanía (Australia Great Ocean Road, NZ Isla Sur), América Latina (México Riviera Maya, Chile Carretera Austral, Argentina Ruta 40, Perú Machu Picchu), Canadá (Icefields Parkway), África (Marruecos Sahara). 46 rutas icónicas verificadas con nombres de highway.'
  },
  {
    q_en: 'How fast is the AI Trip Generator?',
    q_es: '¿Qué tan rápido es el AI Trip Generator?',
    a_en: 'Hierarchy: (1) Prompt cache hit ~10ms if you\'ve searched something similar; (2) Curated-first matcher ~50-200ms when your prompt matches one of 46 iconic templates (~40% of queries); (3) AI fresh with Server-Sent Events streaming — first stop visible in ~2-5s, full trip in 15-30s. Curated hits return 0-token because we have 229 POIs verified in DB.',
    a_es: 'Jerarquía: (1) Cache hit prompt ~10ms si buscaste algo similar; (2) Curated-first matcher ~50-200ms cuando tu prompt matchea uno de 46 templates icónicos (~40% de queries); (3) IA fresh con streaming Server-Sent Events — primer stop visible en ~2-5s, viaje completo en 15-30s. Los curated hits gastan 0 tokens porque tenemos 229 POIs verificados en DB.'
  },
  {
    q_en: 'What is the WhatsApp bot?',
    q_es: '¿Qué es el bot de WhatsApp?',
    a_en: 'Bilingual bot that lets you plan trips right from WhatsApp. Commands: /new (new trip), /trips (list), /help. Free-form questions get an AI answer. Ideal for LATAM (98% WhatsApp penetration in MX/AR/CO).',
    a_es: 'Bot bilingüe para planear viajes directo desde WhatsApp. Comandos: /nuevo, /mis-viajes, /help. Consultas libres reciben respuesta con IA. Ideal para LATAM (98% de penetración WhatsApp en MX/AR/CO).'
  },
  {
    q_en: 'Can I add POIs from the map directly?',
    q_es: '¿Puedo agregar POIs desde el mapa directamente?',
    a_en: 'Yes — Discovery chip bar in trip page has 7 categories (🍴 Food · 🎨 Attractions · 🏞️ Nature · ⛽ Gas · 🏨 Hotels · ⚡ EV · 🛍️ Shopping). Tap category, POIs render as markers on map. Tap marker → popup with photo + rating + "+ Add to trip". Google Places under the hood.',
    a_es: 'Sí — Chip bar Discovery en trip page tiene 7 categorías (🍴 Comida · 🎨 Atracciones · 🏞️ Naturaleza · ⛽ Gasolina · 🏨 Hoteles · ⚡ EV · 🛍️ Tiendas). Tap categoría, POIs renderizan como markers. Tap marker → popup con foto + rating + "+ Agregar al viaje". Google Places under-the-hood.'
  }
];

// S71g: partial 4-locale migration — signature accepts locale, but QA still fallback EN for pt/de.
// Full 10-QA translations pending for follow-up sprint.
export function FAQ({ locale, isEs: isEsProp }: { locale?: string; isEs?: boolean }){
  const isEs = isEsProp ?? locale === 'es';
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: QA.map((qa) => ({
      '@type': 'Question',
      name: isEs ? qa.q_es : qa.q_en,
      acceptedAnswer: { '@type': 'Answer', text: isEs ? qa.a_es : qa.a_en }
    }))
  };
  return (
    <section id="faq" className="bg-white py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral-500"
                  aria-expanded={open}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="font-display text-base font-semibold text-ink-900">
                    {isEs ? qa.q_es : qa.q_en}
                  </span>
                  <span aria-hidden className={`grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-coral-50 text-coral-600 transition ${open ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {open && (
                  <div id={`faq-answer-${i}`} className="border-t border-ink-100 bg-ink-50/30 px-5 py-4 text-sm leading-relaxed text-ink-700">
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
