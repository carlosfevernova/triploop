import { getLocale } from 'next-intl/server';
import { platformStats } from '@/lib/platform-stats';
import { L } from '@/lib/l4';
import type { Locale } from '@/i18n/request';

// S71g pass 2: full 4-locale features. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
// 3 heroes + 16 secundarios jerárquicos (patrón Linear/Vercel 2026).

type LangStr = Record<Locale, string>;
type LangList = Record<Locale, string[]>;

interface HeroFeature {
  emoji: string;
  title: LangStr;
  subtitle: LangStr;
  bullets: LangList;
  accentColor: 'coral' | 'ocean' | 'emerald';
}

interface SmallFeature {
  emoji: string;
  title: LangStr;
  body: LangStr;
  badge?: LangStr;
}

const HERO_FEATURES: HeroFeature[] = [
  {
    emoji: '✨',
    title: { en: 'AI Trip Generator', es: 'AI Trip Generator', pt: 'Gerador de Viagem com IA', de: 'KI-Reiseplaner' },
    subtitle: {
      en: 'Describe your dream trip in one sentence. Get a complete itinerary with real coordinates in 30 seconds.',
      es: 'Describe tu viaje ideal en una frase. Obtén itinerario completo con coordenadas reales en 30 segundos.',
      pt: 'Descreva sua viagem dos sonhos em uma frase. Receba um roteiro completo com coordenadas reais em 30 segundos.',
      de: 'Beschreibe deine Traumreise in einem Satz. Erhalte einen kompletten Reiseplan mit echten Koordinaten in 30 Sekunden.'
    },
    bullets: {
      en: [
        'Natural language input — no forms',
        '4-step guided wizard with kid-ages + interests',
        'Four-provider AI safety net — never breaks',
        'Auto-enriches every stop with real POI data'
      ],
      es: [
        'Lenguaje natural — sin formularios',
        'Wizard 4 pasos con edades niños + intereses',
        'Red de seguridad IA de cuatro proveedores — nunca falla',
        'Enriquece cada parada con datos POI reales'
      ],
      pt: [
        'Linguagem natural — sem formulários',
        'Assistente de 4 passos com idades das crianças + interesses',
        'Rede de segurança de IA com quatro provedores — nunca falha',
        'Enriquece cada parada com dados de POI reais'
      ],
      de: [
        'Natürliche Spracheingabe — keine Formulare',
        '4-Schritte-Assistent mit Kinderaltern + Interessen',
        'Vier-Anbieter-KI-Sicherheitsnetz — fällt nie aus',
        'Reichert jeden Stopp automatisch mit echten POI-Daten an'
      ]
    },
    accentColor: 'coral'
  },
  {
    emoji: '🔄',
    title: { en: 'Flight-Delay Reshuffle', es: 'Reorganización de Vuelos', pt: 'Reorganização por Atraso de Voo', de: 'Umplanung bei Flugverspätung' },
    subtitle: {
      en: 'Something went wrong? AI rebuilds your itinerary in seconds based on what you missed and what matters most.',
      es: '¿Algo salió mal? La IA reconstruye tu itinerario en segundos según lo que perdiste y lo que más importa.',
      pt: 'Algo deu errado? A IA reconstrói seu roteiro em segundos com base no que você perdeu e no que mais importa.',
      de: 'Etwas ist schiefgelaufen? Die KI erstellt deinen Reiseplan in Sekunden neu — basierend darauf, was du verpasst hast und was am wichtigsten ist.'
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
      ],
      pt: [
        '5 tipos de imprevisto (voo, clima, cansaço, doente, agenda)',
        'Marque paradas imperdíveis para protegê-las',
        'A IA sugere novas paradas alternativas',
        'Nenhum concorrente tem isto'
      ],
      de: [
        '5 Störungstypen (Flug, Wetter, müde, krank, Zeitplan)',
        'Markiere Pflicht-Stopps, um sie zu schützen',
        'KI schlägt neue Alternativen vor',
        'Kein Wettbewerber hat das'
      ]
    },
    accentColor: 'ocean'
  },
  {
    emoji: '🌍',
    title: { en: 'Multilingual EN·ES·PT·DE · WhatsApp · Widget', es: 'Multilingüe EN·ES·PT·DE · WhatsApp · Widget', pt: 'Multilíngue EN·ES·PT·DE · WhatsApp · Widget', de: 'Mehrsprachig EN·ES·PT·DE · WhatsApp · Widget' },
    subtitle: {
      en: '900M+ non-English speakers ignored by competitors (ES + PT + DE). Plan trips via WhatsApp. Embed itineraries anywhere.',
      es: '900M+ no-anglohablantes ignorados por competencia (ES + PT + DE). Planea viajes vía WhatsApp. Embebe itinerarios donde sea.',
      pt: '900M+ falantes não-ingleses ignorados pela concorrência (ES + PT + DE). Planeje viagens via WhatsApp. Incorpore roteiros em qualquer lugar.',
      de: '900M+ nicht-englische Sprecher, die von Wettbewerbern ignoriert werden (ES + PT + DE). Plane Reisen per WhatsApp. Bette Reisepläne überall ein.'
    },
    bullets: {
      en: [
        'Native 4-language, ready for global search',
        'WhatsApp bot with AI-powered replies',
        'Embeddable widget for blogs',
        '24 templates × 4 languages · 16 blog posts'
      ],
      es: [
        'Nativo 4 idiomas, listo para búsqueda global',
        'Bot de WhatsApp con respuestas IA',
        'Widget embebible para blogs',
        '24 templates × 4 idiomas · 16 blog posts'
      ],
      pt: [
        'Nativo em 4 idiomas, pronto para busca global',
        'Bot WhatsApp com respostas de IA',
        'Widget incorporável para blogs',
        '24 templates × 4 idiomas · 16 posts no blog'
      ],
      de: [
        '4 native Sprachen, bereit für globale Suche',
        'WhatsApp-Bot mit KI-Antworten',
        'Einbettbares Widget für Blogs',
        '24 Templates × 4 Sprachen · 16 Blog-Beiträge'
      ]
    },
    accentColor: 'emerald'
  }
];

const SMALL_FEATURES: SmallFeature[] = [
  {
    emoji: '💰',
    title: { en: 'Budget Calculator', es: 'Calculadora Presupuestos', pt: 'Calculadora de Orçamento', de: 'Budgetrechner' },
    body: {
      en: 'Real 2026 data: gas by region ($4.50 US avg / €1.65/L Spain), hotels tier low/mid/high, food per person. 6 currencies.',
      es: 'Datos reales 2026: gas por región ($4.50 US avg / €1.65/L España), hoteles low/mid/high, food per persona. 6 monedas.',
      pt: 'Dados reais de 2026: combustível por região ($4,50 EUA médio / €1,65/L Espanha), hotéis low/mid/high, comida por pessoa. 6 moedas.',
      de: 'Echte 2026-Daten: Kraftstoff nach Region (4,50 $ US-Durchschnitt / 1,65 €/L Spanien), Hotels low/mid/high, Essen pro Person. 6 Währungen.'
    },
    badge: { en: '2026 data', es: 'Datos 2026', pt: 'Dados 2026', de: '2026-Daten' }
  },
  {
    emoji: '🚨',
    title: { en: 'AI Warnings + Local Tips', es: 'Alertas IA + Tips Locales', pt: 'Alertas de IA + Dicas Locais', de: 'KI-Warnungen + lokale Tipps' },
    body: {
      en: 'Critical warnings (book Alcatraz 3 months ahead, PCH closures) + insider tips ("skip X mall, go to Y") auto-generated per trip.',
      es: 'Alertas críticas (reserva Alcatraz 3 meses, cierres PCH) + tips insider ("saltar mall X, mejor Y") auto-generados.',
      pt: 'Alertas críticos (reserve Alcatraz 3 meses antes, fechamentos da PCH) + dicas insider ("pule shopping X, vá ao Y") auto-gerados por viagem.',
      de: 'Kritische Warnungen (Alcatraz 3 Monate im Voraus buchen, PCH-Sperrungen) + Insider-Tipps („Mall X überspringen, zu Y gehen") — pro Reise automatisch generiert.'
    }
  },
  {
    emoji: '📋',
    title: { en: 'Smart Packing List', es: 'Lista de Empaque IA', pt: 'Lista de Bagagem com IA', de: 'Intelligente Packliste' },
    body: {
      en: 'AI generates checklist tailored to destination + season + kids ages. SPF 50 for Grand Canyon, windbreaker for Big Sur fog.',
      es: 'IA genera checklist según destino + temporada + edades niños. SPF 50 Grand Canyon, chaqueta para fog Big Sur.',
      pt: 'IA gera checklist personalizado por destino + estação + idades das crianças. SPF 50 para Grand Canyon, corta-vento para névoa de Big Sur.',
      de: 'KI erstellt Checkliste, angepasst an Ziel + Saison + Kinderalter. LSF 50 für Grand Canyon, Windjacke für Big-Sur-Nebel.'
    }
  },
  {
    emoji: '📸',
    title: { en: 'Photo Spots Rated', es: 'Spots de Foto Rated', pt: 'Pontos Fotográficos Avaliados', de: 'Bewertete Foto-Spots' },
    body: {
      en: 'Every iconic spot rated worth-it / maybe / skip with golden-hour timing, best angle, and typical wait.',
      es: 'Cada spot icónico rated vale / depende / saltar con golden-hour, mejor ángulo y espera típica.',
      pt: 'Cada ponto icônico avaliado como vale a pena / talvez / pule — com hora dourada, melhor ângulo e tempo típico de espera.',
      de: 'Jeder ikonische Spot bewertet als lohnt-sich / vielleicht / überspringen — mit goldener Stunde, bestem Winkel und typischer Wartezeit.'
    }
  },
  {
    emoji: '⚡',
    title: { en: 'EV Chargers on Route', es: 'Cargadores EV en Ruta', pt: 'Carregadores EV na Rota', de: 'E-Ladestationen auf Route' },
    body: {
      en: 'Live charger data across 8 countries. Filter by radius, see power kW and connector types.',
      es: 'Datos de cargadores en vivo, 8 países. Filtra por radio, ve potencia kW y tipos de conector.',
      pt: 'Dados de carregadores ao vivo em 8 países. Filtre por raio, veja potência em kW e tipos de conector.',
      de: 'Live-Ladedaten in 8 Ländern. Nach Radius filtern, kW-Leistung und Steckertypen sehen.'
    }
  },
  {
    emoji: '🤝',
    title: { en: 'Realtime Collaboration', es: 'Colaboración Tiempo Real', pt: 'Colaboração em Tempo Real', de: 'Echtzeit-Zusammenarbeit' },
    body: {
      en: 'Invite friends to co-edit. Live cursors, presence, instant sync — no extra cost, no add-ons.',
      es: 'Invita amigos a co-editar. Cursores vivos, presencia, sync instantáneo — sin costo extra, sin add-ons.',
      pt: 'Convide amigos para co-editar. Cursores ao vivo, presença, sincronização instantânea — sem custo extra, sem add-ons.',
      de: 'Freunde zum Mitbearbeiten einladen. Live-Cursor, Anwesenheit, sofortige Synchronisierung — ohne Aufpreis, ohne Add-ons.'
    }
  },
  {
    emoji: '📱',
    title: { en: 'Offline PWA + Maps', es: 'PWA Offline + Mapas', pt: 'PWA Offline + Mapas', de: 'Offline-PWA + Karten' },
    body: {
      en: 'Install as app. Pre-cache map tiles for National Parks. Works in zero-signal zones.',
      es: 'Instala como app. Pre-cachea tiles para Parques Nacionales. Funciona sin señal.',
      pt: 'Instale como app. Pré-cache dos tiles de mapa para Parques Nacionais. Funciona em áreas sem sinal.',
      de: 'Als App installieren. Kartenkacheln für Nationalparks vorspeichern. Funktioniert in Zonen ohne Signal.'
    },
    badge: { en: 'Pro', es: 'Pro', pt: 'Pro', de: 'Pro' }
  },
  {
    emoji: '📄',
    title: { en: 'PDF Export Print-Ready', es: 'Export PDF Imprimible', pt: 'Exportação PDF para Impressão', de: 'PDF-Export druckfertig' },
    body: {
      en: 'A4 print-optimized with cover page, itinerary, static map, booking summary. Perfect for glove compartment.',
      es: 'A4 imprimible con portada, itinerario, mapa, resumen reservas. Perfecto para guantera.',
      pt: 'A4 otimizado para impressão com capa, roteiro, mapa estático e resumo de reservas. Perfeito para o porta-luvas.',
      de: 'A4-druckoptimiert mit Deckblatt, Reiseplan, statischer Karte, Buchungsübersicht. Perfekt fürs Handschuhfach.'
    },
    badge: { en: 'Pro', es: 'Pro', pt: 'Pro', de: 'Pro' }
  },
  {
    emoji: '🏨',
    title: { en: 'Central Hotels by Tier', es: 'Hoteles Céntricos por Tarifa', pt: 'Hotéis Centrais por Categoria', de: 'Zentrale Hotels nach Kategorie' },
    body: {
      en: 'Filter Booking.com by star tier (1-2★ / 3★ / 4-5★) and downtown proximity. One-tap deep links.',
      es: 'Filtra Booking.com por estrellas (1-2★ / 3★ / 4-5★) y proximidad centro. Deep-links 1 clic.',
      pt: 'Filtre o Booking.com por estrelas (1-2★ / 3★ / 4-5★) e proximidade ao centro. Deep-links com um toque.',
      de: 'Booking.com nach Sternen (1-2★ / 3★ / 4-5★) und Innenstadt-Nähe filtern. Deep-Links mit einem Klick.'
    }
  },
  {
    emoji: '🎯',
    title: { en: 'Route Optimizer', es: 'Optimizador de Ruta', pt: 'Otimizador de Rota', de: 'Routen-Optimierer' },
    body: {
      en: 'Google Routes API v2 with live traffic. Drag-and-drop reorder. Auto-recompute distances + duration.',
      es: 'Google Routes API v2 con tráfico vivo. Drag-and-drop reordenar. Auto-recomputa distancias + duración.',
      pt: 'Google Routes API v2 com trânsito ao vivo. Arrastar e soltar para reordenar. Recálculo automático de distâncias + duração.',
      de: 'Google Routes API v2 mit Live-Verkehr. Drag-and-drop-Neuordnung. Automatische Neuberechnung von Entfernungen + Dauer.'
    }
  },
  {
    emoji: '🎫',
    title: { en: 'Activities & Tours', es: 'Actividades y Tours', pt: 'Atividades e Passeios', de: 'Aktivitäten & Touren' },
    body: {
      en: 'GetYourGuide integration for skip-the-line and guided tours at every stop, 24h free cancellation.',
      es: 'Integración GetYourGuide para skip-the-line y tours guiados en cada parada, cancelación 24h gratis.',
      pt: 'Integração com GetYourGuide para skip-the-line e passeios guiados em cada parada, cancelamento grátis em 24h.',
      de: 'GetYourGuide-Integration für Skip-the-Line und geführte Touren an jedem Stopp, 24h kostenlose Stornierung.'
    }
  },
  {
    emoji: '📊',
    title: { en: 'Prices with Tax Included', es: 'Precios con Impuestos', pt: 'Preços com Impostos Incluídos', de: 'Preise inklusive Steuern' },
    body: {
      en: 'No more $89 hotel that becomes $118. All prices show final with tax, so MX/EU visitors are never surprised.',
      es: 'No más hotel $89 que se vuelve $118. Todos los precios finales con impuestos, sin sorpresas para turistas MX/EU.',
      pt: 'Chega de hotel de $89 que vira $118. Todos os preços exibidos são finais com impostos — sem surpresas para visitantes de MX/EU/BR.',
      de: 'Kein 89-$-Hotel mehr, das zu 118 $ wird. Alle Preise zeigen Endpreis mit Steuern — keine Überraschungen für Besucher aus MX/EU.'
    }
  },
  {
    emoji: '⚡',
    title: { en: 'Curated-first Instant Response', es: 'Respuesta Instantánea Curada', pt: 'Resposta Instantânea Curated-first', de: 'Curated-first Sofortantwort' },
    body: {
      en: '229 verified POIs + 46 templates. Prompts matching iconic routes return in <100ms with 0 AI tokens.',
      es: '229 POIs verificados + 46 templates. Prompts que matchean rutas icónicas responden <100ms con 0 tokens IA.',
      pt: '229 POIs verificados + 46 templates. Prompts que combinam com rotas icônicas respondem em <100ms com 0 tokens de IA.',
      de: '229 verifizierte POIs + 46 Templates. Prompts, die zu ikonischen Routen passen, antworten in <100ms mit 0 KI-Tokens.'
    },
    badge: { en: 'S28', es: 'S28', pt: 'S28', de: 'S28' }
  },
  {
    emoji: '🌊',
    title: { en: 'Streaming SSE Live Map', es: 'Streaming SSE Mapa Vivo', pt: 'Streaming SSE Mapa Ao Vivo', de: 'Streaming SSE Live-Karte' },
    body: {
      en: 'Server-Sent Events: stops appear on map 1-by-1 as AI generates. First stop visible in 500ms curated hit.',
      es: 'Server-Sent Events: paradas aparecen en mapa 1-por-1 mientras la IA genera. Primer stop en 500ms hit curado.',
      pt: 'Server-Sent Events: as paradas aparecem no mapa uma a uma enquanto a IA gera. Primeira parada visível em 500ms em hit curated.',
      de: 'Server-Sent Events: Stopps erscheinen einzeln auf der Karte, während die KI generiert. Erster Stopp in 500ms bei Curated-Treffer sichtbar.'
    },
    badge: { en: 'S30', es: 'S30', pt: 'S30', de: 'S30' }
  },
  {
    emoji: '🔍',
    title: { en: 'POI Discovery Chips', es: 'POI Discovery Chips', pt: 'Chips de Descoberta de POI', de: 'POI-Discovery-Chips' },
    body: {
      en: '7 categories floating chip-bar (Food · Nature · Hotels · Gas · EV · Attractions · Shopping). Tap POI → add to trip.',
      es: '7 categorías chip-bar flotante (Comida · Naturaleza · Hoteles · Gasolina · EV · Atracciones · Tiendas). Tap POI → agregar al viaje.',
      pt: '7 categorias na barra flutuante (Comida · Natureza · Hotéis · Combustível · EV · Atrações · Compras). Toque no POI → adicione à viagem.',
      de: '7 Kategorien in schwebender Chipleiste (Essen · Natur · Hotels · Tanken · E-Ladung · Sehenswürdigkeiten · Einkaufen). POI antippen → zur Reise hinzufügen.'
    },
    badge: { en: 'S25', es: 'S25', pt: 'S25', de: 'S25' }
  },
  {
    emoji: '🛣️',
    title: { en: 'Highway Route Badges', es: 'Badges de Highway', pt: 'Selos de Rodovias', de: 'Autobahn-Badges' },
    body: {
      en: 'Every template shows highway names (US-101, I-90, PCH, SS163 Amalfi, NC500). No competitor does this.',
      es: 'Cada template muestra nombres de highway (US-101, I-90, PCH, SS163 Amalfi, NC500). Ningún competidor lo hace.',
      pt: 'Cada template mostra nomes de rodovia (US-101, I-90, PCH, SS163 Amalfi, NC500). Nenhum concorrente faz isto.',
      de: 'Jedes Template zeigt Autobahnnamen (US-101, I-90, PCH, SS163 Amalfi, NC500). Kein Wettbewerber macht das.'
    },
    badge: { en: 'S27', es: 'S27', pt: 'S27', de: 'S27' }
  }
];

export async function FeaturesShowcase(){
  const locale = await getLocale();

  const eyebrow = L(locale, {
    en: `35+ features · ${platformStats.aiEndpoints} AI endpoints + SSE · ${platformStats.regions} regions · ${platformStats.continents} continents`,
    es: `35+ features · ${platformStats.aiEndpoints} endpoints IA + SSE · ${platformStats.regions} regiones · ${platformStats.continents} continentes`,
    pt: `35+ recursos · ${platformStats.aiEndpoints} endpoints de IA + SSE · ${platformStats.regions} regiões · ${platformStats.continents} continentes`,
    de: `35+ Features · ${platformStats.aiEndpoints} KI-Endpunkte + SSE · ${platformStats.regions} Regionen · ${platformStats.continents} Kontinente`
  });
  const heading = L(locale, {
    en: "Everything Wanderlog doesn't have",
    es: 'Todo lo que Wanderlog no tiene',
    pt: 'Tudo o que o Wanderlog não tem',
    de: 'Alles, was Wanderlog nicht hat'
  });
  const description = L(locale, {
    en: `Wanderlog is visual but EN-only and North America. Layla is AI-first but paywalled $49/yr. TripIt organizes but doesn't plan. TripLoop is all-in-one: native 4 languages · ${platformStats.regions} regions · free AI · streaming · ${platformStats.curatedPOIs} curated POIs · WhatsApp bot.`,
    es: `Wanderlog es visual pero solo EN y Norteamérica. Layla es AI-first pero paywall $49/año. TripIt organiza pero no planea. TripLoop es todo-en-uno: 4 idiomas nativos · ${platformStats.regions} regiones · IA gratis · streaming · ${platformStats.curatedPOIs} POIs curados · WhatsApp bot.`,
    pt: `Wanderlog é visual mas só em EN e América do Norte. Layla é AI-first mas paywall de $49/ano. TripIt organiza mas não planeja. TripLoop é all-in-one: 4 idiomas nativos · ${platformStats.regions} regiões · IA grátis · streaming · ${platformStats.curatedPOIs} POIs selecionados · bot WhatsApp.`,
    de: `Wanderlog ist visuell, aber nur EN und Nordamerika. Layla ist KI-first, aber Paywall 49 $/Jahr. TripIt organisiert, plant aber nicht. TripLoop ist alles-in-einem: 4 native Sprachen · ${platformStats.regions} Regionen · kostenlose KI · Streaming · ${platformStats.curatedPOIs} kuratierte POIs · WhatsApp-Bot.`
  });
  const moreHeading = L(locale, {
    en: 'More shipped features',
    es: 'Más features shipped',
    pt: 'Mais recursos entregues',
    de: 'Weitere ausgelieferte Features'
  });
  const auditNote = L(locale, {
    en: 'Everything shipped and functional in production. Full audit at /admin/reports/technical.',
    es: 'Todo shipped y funcional en producción. Audit completo en /admin/reports/technical.',
    pt: 'Tudo entregue e funcional em produção. Auditoria completa em /admin/reports/technical.',
    de: 'Alles ausgeliefert und in Produktion funktionsfähig. Vollständige Prüfung unter /admin/reports/technical.'
  });

  const accentClass = (a: 'coral' | 'ocean' | 'emerald') => ({
    coral: { border: 'border-coral-200', bg: 'from-coral-50 via-white', badge: 'bg-coral-100 text-coral-800', emoji: 'bg-coral-500' },
    ocean: { border: 'border-ocean-400/40', bg: 'from-ocean-400/5 via-white', badge: 'bg-ocean-400/20 text-ocean-800', emoji: 'bg-ocean-500' },
    emerald: { border: 'border-emerald-200', bg: 'from-emerald-50 via-white', badge: 'bg-emerald-100 text-emerald-800', emoji: 'bg-emerald-500' }
  }[a]);

  return (
    <section id="features" className="border-t border-ink-100 bg-white py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-pill border border-coral-200 bg-coral-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-coral-700">
            {eyebrow}
          </span>
          <h2 className="mx-auto max-w-3xl font-display text-display-md text-ink-900 text-balance md:text-display-lg">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-500 text-balance">
            {description}
          </p>
        </div>

        <div className="mb-20 grid gap-6 lg:grid-cols-3">
          {HERO_FEATURES.map((f) => {
            const c = accentClass(f.accentColor);
            const bullets = (f.bullets as Record<string, string[]>)[locale] ?? f.bullets.en;
            return (
              <div key={f.title.en} className={`group flex flex-col overflow-hidden rounded-card border-2 ${c.border} bg-gradient-to-br ${c.bg} to-white p-8 transition hover:shadow-card-hover`}>
                <div className={`mb-4 grid h-14 w-14 place-items-center rounded-xl text-white text-2xl shadow-glow ${c.emoji}`} aria-hidden>{f.emoji}</div>
                <h3 className="mb-2 font-display text-2xl font-semibold text-ink-900 tracking-tight">{L(locale, f.title)}</h3>
                <p className="mb-5 text-sm leading-relaxed text-ink-600">{L(locale, f.subtitle)}</p>
                <ul className="mt-auto space-y-1.5">
                  {bullets.map((b) => (
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

        <div className="mb-8">
          <h3 className="mb-6 text-center font-display text-2xl font-semibold text-ink-900">
            {moreHeading}
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SMALL_FEATURES.map((f) => (
              <div key={f.title.en} className="group rounded-card border border-ink-100 bg-white p-5 transition hover:border-ocean-300 hover:shadow-card">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-2xl" aria-hidden>{f.emoji}</span>
                  {f.badge && (
                    <span className="rounded-pill bg-coral-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-coral-700">
                      {L(locale, f.badge)}
                    </span>
                  )}
                </div>
                <h4 className="mb-1 font-display text-base font-semibold text-ink-900">{L(locale, f.title)}</h4>
                <p className="text-xs leading-relaxed text-ink-600">{L(locale, f.body)}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-ink-400">
          {auditNote}
        </p>
      </div>
    </section>
  );
}
