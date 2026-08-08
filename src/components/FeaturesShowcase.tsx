import { getLocale } from 'next-intl/server';

// Server component. Todo bilingüe inline (no i18n keys) porque data-driven post S17-S22.
// 3 heroes + 12 secundarios jerárquicos (patrón Linear/Vercel 2026).

interface HeroFeature {
  emoji: string;
  title: { en: string; es: string };
  subtitle: { en: string; es: string };
  bullets: { en: string[]; es: string[] };
  accentColor: 'coral' | 'ocean' | 'emerald';
}

interface SmallFeature {
  emoji: string;
  title: { en: string; es: string };
  body: { en: string; es: string };
  badge?: { en: string; es: string };
}

const HERO_FEATURES: HeroFeature[] = [
  {
    emoji: '✨',
    title: { en: 'AI Trip Generator', es: 'AI Trip Generator' },
    subtitle: {
      en: 'Describe your dream trip in one sentence. Get a complete itinerary with real coordinates in 30 seconds.',
      es: 'Describe tu viaje ideal en una frase. Obtén itinerario completo con coordenadas reales en 30 segundos.'
    },
    bullets: {
      en: [
        'Natural language input — no forms',
        '4-step guided wizard with kid-ages + interests',
        '5-provider AI chain: OpenRouter free tier + fallbacks',
        'Auto-enriches every stop with Google Places'
      ],
      es: [
        'Lenguaje natural — sin formularios',
        'Wizard 4 pasos con edades niños + intereses',
        'Cadena 5 providers IA: OpenRouter gratis + fallbacks',
        'Enriquece cada parada con Google Places'
      ]
    },
    accentColor: 'coral'
  },
  {
    emoji: '🔄',
    title: { en: 'Flight-Delay Reshuffle', es: 'Reorganización de Vuelos' },
    subtitle: {
      en: 'Something went wrong? AI rebuilds your itinerary in seconds based on what you missed and what matters most.',
      es: '¿Algo salió mal? La IA reconstruye tu itinerario en segundos según lo que perdiste y lo que más importa.'
    },
    bullets: {
      en: [
        '5 disruption types (flight, weather, tired, sick, schedule)',
        'Mark must-see stops to protect them',
        'AI can suggest new alternative stops',
        'No competitor has this'
      ],
      es: [
        '5 tipos disrupción (vuelo, clima, cansancio, enfermo)',
        'Marca paradas must-see para protegerlas',
        'La IA puede sugerir nuevas alternativas',
        'Ningún competidor lo tiene'
      ]
    },
    accentColor: 'ocean'
  },
  {
    emoji: '🌍',
    title: { en: 'Bilingual EN+ES · WhatsApp · Widget', es: 'Bilingüe EN+ES · WhatsApp · Widget' },
    subtitle: {
      en: '500M+ Spanish speakers ignored by competitors. Plan trips via WhatsApp. Embed itineraries anywhere.',
      es: '500M+ hispanohablantes ignorados por competencia. Planea viajes vía WhatsApp. Embebe itinerarios donde sea.'
    },
    bullets: {
      en: [
        'Native bilingual with hreflang SEO',
        'Twilio WhatsApp bot with AI fallback',
        'Iframe-friendly widget for blogs',
        '24 templates × 2 languages · 16 blog posts'
      ],
      es: [
        'Bilingüe nativo con hreflang SEO',
        'Bot WhatsApp Twilio con fallback IA',
        'Widget iframe para blogs',
        '24 templates × 2 idiomas · 16 blog posts'
      ]
    },
    accentColor: 'emerald'
  }
];

const SMALL_FEATURES: SmallFeature[] = [
  {
    emoji: '💰',
    title: { en: 'Budget Calculator', es: 'Calculadora Presupuestos' },
    body: {
      en: 'Real 2026 data: gas by region ($4.50 US avg / €1.65/L Spain), hotels tier low/mid/high, food per person. 6 currencies.',
      es: 'Datos reales 2026: gas por región ($4.50 US avg / €1.65/L España), hoteles low/mid/high, food per persona. 6 monedas.'
    },
    badge: { en: '2026 data', es: 'Datos 2026' }
  },
  {
    emoji: '🚨',
    title: { en: 'AI Warnings + Local Tips', es: 'Alertas IA + Tips Locales' },
    body: {
      en: 'Critical warnings (book Alcatraz 3 months ahead, PCH closures) + insider tips ("skip X mall, go to Y") auto-generated per trip.',
      es: 'Alertas críticas (reserva Alcatraz 3 meses, cierres PCH) + tips insider ("saltar mall X, mejor Y") auto-generados.'
    }
  },
  {
    emoji: '📋',
    title: { en: 'Smart Packing List', es: 'Lista de Empaque IA' },
    body: {
      en: 'AI generates checklist tailored to destination + season + kids ages. SPF 50 for Grand Canyon, windbreaker for Big Sur fog.',
      es: 'IA genera checklist según destino + temporada + edades niños. SPF 50 Grand Canyon, chaqueta para fog Big Sur.'
    }
  },
  {
    emoji: '📸',
    title: { en: 'Photo Spots Rated', es: 'Spots de Foto Rated' },
    body: {
      en: 'Every iconic spot rated worth-it / maybe / skip with golden-hour timing, best angle, and typical wait.',
      es: 'Cada spot icónico rated vale / depende / saltar con golden-hour, mejor ángulo y espera típica.'
    }
  },
  {
    emoji: '⚡',
    title: { en: 'EV Chargers on Route', es: 'Cargadores EV en Ruta' },
    body: {
      en: 'OpenChargeMap live data across 8 countries. Filter by radius, see power kW and connector types.',
      es: 'Datos OpenChargeMap en vivo, 8 países. Filtra por radio, ve potencia kW y tipos de conector.'
    }
  },
  {
    emoji: '🤝',
    title: { en: 'Realtime Collaboration', es: 'Colaboración Tiempo Real' },
    body: {
      en: 'Invite friends to co-edit. Live cursors, presence, sync via Supabase Realtime. Zero cost vs Liveblocks $99/mo.',
      es: 'Invita amigos a co-editar. Cursores vivos, presencia, sync Supabase Realtime. Costo $0 vs Liveblocks $99/mo.'
    }
  },
  {
    emoji: '📱',
    title: { en: 'Offline PWA + Maps', es: 'PWA Offline + Mapas' },
    body: {
      en: 'Install as app. Pre-cache map tiles for National Parks. Works in zero-signal zones.',
      es: 'Instala como app. Pre-cachea tiles para Parques Nacionales. Funciona sin señal.'
    },
    badge: { en: 'Pro', es: 'Pro' }
  },
  {
    emoji: '📄',
    title: { en: 'PDF Export Print-Ready', es: 'Export PDF Imprimible' },
    body: {
      en: 'A4 print-optimized with cover page, itinerary, static map, booking summary. Perfect for glove compartment.',
      es: 'A4 imprimible con portada, itinerario, mapa, resumen reservas. Perfecto para guantera.'
    },
    badge: { en: 'Pro', es: 'Pro' }
  },
  {
    emoji: '🏨',
    title: { en: 'Central Hotels by Tier', es: 'Hoteles Céntricos por Tarifa' },
    body: {
      en: 'Filter Booking.com by star tier (1-2★ / 3★ / 4-5★) and downtown proximity. One-tap deep links.',
      es: 'Filtra Booking.com por estrellas (1-2★ / 3★ / 4-5★) y proximidad centro. Deep-links 1 clic.'
    }
  },
  {
    emoji: '🎯',
    title: { en: 'Route Optimizer', es: 'Optimizador de Ruta' },
    body: {
      en: 'Google Routes API v2 with live traffic. Drag-and-drop reorder. Auto-recompute distances + duration.',
      es: 'Google Routes API v2 con tráfico vivo. Drag-and-drop reordenar. Auto-recomputa distancias + duración.'
    }
  },
  {
    emoji: '🎫',
    title: { en: 'Activities & Tours', es: 'Actividades y Tours' },
    body: {
      en: 'GetYourGuide integration for skip-the-line and guided tours at every stop, 24h free cancellation.',
      es: 'Integración GetYourGuide para skip-the-line y tours guiados en cada parada, cancelación 24h gratis.'
    }
  },
  {
    emoji: '📊',
    title: { en: 'Prices with Tax Included', es: 'Precios con Impuestos' },
    body: {
      en: 'No more $89 hotel that becomes $118. All prices show final with tax, so MX/EU visitors are never surprised.',
      es: 'No más hotel $89 que se vuelve $118. Todos los precios finales con impuestos, sin sorpresas para turistas MX/EU.'
    }
  },
  {
    emoji: '⚡',
    title: { en: 'Curated-first Instant Response', es: 'Respuesta Instantánea Curada' },
    body: {
      en: '229 verified POIs + 46 templates. Prompts matching iconic routes return in <100ms with 0 AI tokens.',
      es: '229 POIs verificados + 46 templates. Prompts que matchean rutas icónicas responden <100ms con 0 tokens IA.'
    },
    badge: { en: 'S28', es: 'S28' }
  },
  {
    emoji: '🌊',
    title: { en: 'Streaming SSE Live Map', es: 'Streaming SSE Mapa Vivo' },
    body: {
      en: 'Server-Sent Events: stops appear on map 1-by-1 as AI generates. First stop visible in 500ms curated hit.',
      es: 'Server-Sent Events: paradas aparecen en mapa 1-por-1 mientras la IA genera. Primer stop en 500ms hit curado.'
    },
    badge: { en: 'S30', es: 'S30' }
  },
  {
    emoji: '🔍',
    title: { en: 'POI Discovery Chips', es: 'POI Discovery Chips' },
    body: {
      en: '7 categories floating chip-bar (Food · Nature · Hotels · Gas · EV · Attractions · Shopping). Tap POI → add to trip.',
      es: '7 categorías chip-bar flotante (Comida · Naturaleza · Hoteles · Gasolina · EV · Atracciones · Tiendas). Tap POI → agregar al viaje.'
    },
    badge: { en: 'S25', es: 'S25' }
  },
  {
    emoji: '🛣️',
    title: { en: 'Highway Route Badges', es: 'Badges de Highway' },
    body: {
      en: 'Every template shows highway names (US-101, I-90, PCH, SS163 Amalfi, NC500). No competitor does this.',
      es: 'Cada template muestra nombres de highway (US-101, I-90, PCH, SS163 Amalfi, NC500). Ningún competidor lo hace.'
    },
    badge: { en: 'S27', es: 'S27' }
  }
];

export async function FeaturesShowcase(){
  const locale = await getLocale();
  const isEs = locale === 'es';

  const accentClass = (a: 'coral' | 'ocean' | 'emerald') => ({
    coral: {
      border: 'border-coral-200',
      bg: 'from-coral-50 via-white',
      badge: 'bg-coral-100 text-coral-800',
      emoji: 'bg-coral-500'
    },
    ocean: {
      border: 'border-ocean-400/40',
      bg: 'from-ocean-400/5 via-white',
      badge: 'bg-ocean-400/20 text-ocean-800',
      emoji: 'bg-ocean-500'
    },
    emerald: {
      border: 'border-emerald-200',
      bg: 'from-emerald-50 via-white',
      badge: 'bg-emerald-100 text-emerald-800',
      emoji: 'bg-emerald-500'
    }
  }[a]);

  return (
    <section id="features" className="border-t border-ink-100 bg-white py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-pill border border-coral-200 bg-coral-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-coral-700">
            {isEs ? '35+ features · 6 endpoints IA + SSE · 24 regiones · 7 continentes' : '35+ features · 6 AI endpoints + SSE · 24 regions · 7 continents'}
          </span>
          <h2 className="mx-auto max-w-3xl font-display text-display-md text-ink-900 text-balance md:text-display-lg">
            {isEs
              ? 'Todo lo que Wanderlog no tiene'
              : "Everything Wanderlog doesn't have"}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-500 text-balance">
            {isEs
              ? 'Wanderlog es visual pero solo EN y Norteamérica. Layla es AI-first pero paywall $49/año. TripIt organiza pero no planea. TripLoop es todo-en-uno: bilingüe nativo · 24 regiones · IA gratis · streaming · 229 POIs curados · WhatsApp bot.'
              : "Wanderlog is visual but EN-only and North America. Layla is AI-first but paywalled $49/yr. TripIt organizes but doesn't plan. TripLoop is all-in-one: native bilingual · 24 regions · free AI · streaming · 229 curated POIs · WhatsApp bot."}
          </p>
        </div>

        {/* 3 heroes */}
        <div className="mb-20 grid gap-6 lg:grid-cols-3">
          {HERO_FEATURES.map((f) => {
            const c = accentClass(f.accentColor);
            return (
              <div key={f.title.en} className={`group flex flex-col overflow-hidden rounded-card border-2 ${c.border} bg-gradient-to-br ${c.bg} to-white p-8 transition hover:shadow-card-hover`}>
                <div className={`mb-4 grid h-14 w-14 place-items-center rounded-xl text-white text-2xl shadow-glow ${c.emoji}`} aria-hidden>{f.emoji}</div>
                <h3 className="mb-2 font-display text-2xl font-semibold text-ink-900 tracking-tight">{isEs ? f.title.es : f.title.en}</h3>
                <p className="mb-5 text-sm leading-relaxed text-ink-600">{isEs ? f.subtitle.es : f.subtitle.en}</p>
                <ul className="mt-auto space-y-1.5">
                  {(isEs ? f.bullets.es : f.bullets.en).map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-ink-700">
                      <span className="mt-0.5 shrink-0 text-emerald-600" aria-hidden>✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* 12 secondary features grid */}
        <div className="mb-8">
          <h3 className="mb-6 text-center font-display text-2xl font-semibold text-ink-900">
            {isEs ? 'Más features shipped' : 'More shipped features'}
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SMALL_FEATURES.map((f) => (
              <div key={f.title.en} className="group rounded-card border border-ink-100 bg-white p-5 transition hover:border-ocean-300 hover:shadow-card">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-2xl" aria-hidden>{f.emoji}</span>
                  {f.badge && (
                    <span className="rounded-pill bg-coral-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-coral-700">
                      {isEs ? f.badge.es : f.badge.en}
                    </span>
                  )}
                </div>
                <h4 className="mb-1 font-display text-base font-semibold text-ink-900">{isEs ? f.title.es : f.title.en}</h4>
                <p className="text-xs leading-relaxed text-ink-600">{isEs ? f.body.es : f.body.en}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-ink-400">
          {isEs
            ? 'Todo shipped y funcional en producción. Audit completo en /admin/reports/technical.'
            : 'Everything shipped and functional in production. Full audit at /admin/reports/technical.'}
        </p>
      </div>
    </section>
  );
}
