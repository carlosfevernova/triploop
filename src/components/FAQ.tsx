'use client';
import { useState } from 'react';
import { L } from '@/lib/l4';
import type { Locale } from '@/i18n/request';

// S71g pass 2: full 4-locale QA. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
type LangStr = Record<Locale, string>;

interface QA {
  q: LangStr;
  a: LangStr;
}

const QAS: QA[] = [
  {
    q: {
      en: 'Do I need to sign up to plan a trip?',
      es: '¿Necesito registrarme para planear un viaje?',
      pt: 'Preciso me cadastrar para planejar uma viagem?',
      de: 'Muss ich mich anmelden, um eine Reise zu planen?'
    },
    a: {
      en: 'No. Free plan lets you plan and share up to 3 trips without an account. To save, sync across devices or unlock offline maps, create a free account.',
      es: 'No. El plan gratis te deja planear y compartir hasta 3 viajes sin cuenta. Para guardar, sincronizar entre dispositivos o mapas offline, crea cuenta gratis.',
      pt: 'Não. O plano grátis permite planejar e compartilhar até 3 viagens sem cadastro. Para salvar, sincronizar entre dispositivos ou desbloquear mapas offline, crie uma conta grátis.',
      de: 'Nein. Der kostenlose Plan erlaubt dir, bis zu 3 Reisen ohne Konto zu planen und zu teilen. Um zu speichern, geräteübergreifend zu synchronisieren oder Offline-Karten freizuschalten, erstelle ein kostenloses Konto.'
    }
  },
  {
    q: {
      en: 'How accurate are the drive times?',
      es: '¿Qué tan precisos son los tiempos de manejo?',
      pt: 'Quão precisos são os tempos de direção?',
      de: 'Wie genau sind die Fahrzeiten?'
    },
    a: {
      en: 'We use Google Routes API v2 with live traffic and TRAFFIC_AWARE mode — the same data that powers Google Maps. LA→SF really is 6 hours in bad traffic, not the 2h fantasy some tools show.',
      es: 'Usamos Google Routes API v2 con tráfico en vivo — los mismos datos de Google Maps. LA→SF sí son 6 horas en tráfico real, no las 2h de fantasía de otros planeadores.',
      pt: 'Usamos a Google Routes API v2 com trânsito ao vivo — os mesmos dados que alimentam o Google Maps. LA→SF são realmente 6 horas em trânsito ruim, não as 2h de fantasia que outras ferramentas mostram.',
      de: 'Wir nutzen die Google Routes API v2 mit Live-Verkehr — dieselben Daten wie Google Maps. LA→SF sind bei starkem Verkehr wirklich 6 Stunden, nicht die 2h-Fantasie mancher Tools.'
    }
  },
  {
    q: {
      en: 'What AI does TripLoop use?',
      es: '¿Qué IA usa TripLoop?',
      pt: 'Qual IA o TripLoop usa?',
      de: 'Welche KI verwendet TripLoop?'
    },
    a: {
      en: 'Top open models with a four-provider safety net — if one goes down, your trip planner keeps working. Answers arrive in seconds, and we never lock into a single vendor so you never pay AI premium.',
      es: 'Los mejores modelos abiertos con red de seguridad de cuatro proveedores — si uno cae, tu planeador sigue funcionando. Las respuestas llegan en segundos, y no dependemos de un solo proveedor para que nunca pagues sobreprecio de IA.',
      pt: 'Os melhores modelos abertos com uma rede de segurança de quatro provedores — se um cair, seu planejador continua funcionando. As respostas chegam em segundos, e nunca dependemos de um único fornecedor, então você nunca paga sobretaxa de IA.',
      de: 'Führende offene Modelle mit einem Vier-Anbieter-Sicherheitsnetz — wenn einer ausfällt, funktioniert dein Reiseplaner weiter. Antworten kommen in Sekunden, und wir binden uns nie an einen einzigen Anbieter, sodass du nie einen KI-Aufpreis zahlst.'
    }
  },
  {
    q: {
      en: 'Can I use TripLoop offline in a national park?',
      es: '¿Puedo usar TripLoop offline en un parque nacional?',
      pt: 'Posso usar o TripLoop offline em um parque nacional?',
      de: 'Kann ich TripLoop offline in einem Nationalpark nutzen?'
    },
    a: {
      en: 'Yes — Pro plan pre-caches map tiles + itinerary for any trip you mark "Save offline". Works in Yosemite, Big Sur, Death Valley where signal is zero. Free trial 14 days.',
      es: 'Sí — el plan Pro pre-cachea tiles del mapa + itinerario para cualquier viaje que marques "Guardar offline". Funciona en Yosemite, Big Sur, Death Valley sin señal. Prueba 14 días gratis.',
      pt: 'Sim — o plano Pro faz cache prévio dos tiles do mapa + roteiro para qualquer viagem marcada como "Salvar offline". Funciona em Yosemite, Big Sur, Death Valley sem sinal. Teste grátis de 14 dias.',
      de: 'Ja — der Pro-Plan speichert Kartenkacheln + Reiseplan im Voraus für jede Reise, die du als "Offline speichern" markierst. Funktioniert in Yosemite, Big Sur, Death Valley ohne Signal. 14 Tage kostenlose Testphase.'
    }
  },
  {
    q: {
      en: 'How do I book hotels and activities?',
      es: '¿Cómo reservo hoteles y actividades?',
      pt: 'Como reservo hotéis e atividades?',
      de: 'Wie buche ich Hotels und Aktivitäten?'
    },
    a: {
      en: 'Every stop has 🏨 Hotels (Booking.com) and 🎭 Tours (GetYourGuide) buttons that pre-fill your dates and destination. We earn a small commission — you never pay more.',
      es: 'Cada parada tiene botones 🏨 Hoteles (Booking.com) y 🎭 Tours (GetYourGuide) que pre-llenan tus fechas y destino. Ganamos una comisión pequeña — tú nunca pagas de más.',
      pt: 'Cada parada tem botões 🏨 Hotéis (Booking.com) e 🎭 Passeios (GetYourGuide) que pré-preenchem suas datas e destino. Ganhamos uma pequena comissão — você nunca paga a mais.',
      de: 'Jeder Stopp hat 🏨 Hotels- (Booking.com) und 🎭 Touren-Buttons (GetYourGuide), die deine Daten und dein Ziel vorausfüllen. Wir erhalten eine kleine Provision — du zahlst nie mehr.'
    }
  },
  {
    q: {
      en: 'Is my trip data private?',
      es: '¿Mis datos de viaje son privados?',
      pt: 'Meus dados de viagem são privados?',
      de: 'Sind meine Reisedaten privat?'
    },
    a: {
      en: 'Anonymous trips are public via unique share link. Once you register, your trips are private by default and only readable by you — enforced at the database level, not just the app. No ads, no data selling, ever.',
      es: 'Los viajes anónimos son públicos vía link único. Al registrarte, tus viajes son privados por defecto y solo tú los ves — protegido a nivel de base de datos, no solo en la app. Sin ads, sin venta de datos, nunca.',
      pt: 'Viagens anônimas são públicas via link exclusivo de compartilhamento. Ao se cadastrar, suas viagens são privadas por padrão e apenas você pode lê-las — garantido a nível de banco de dados, não só na aplicação. Sem anúncios, sem venda de dados, nunca.',
      de: 'Anonyme Reisen sind über einen eindeutigen Teilen-Link öffentlich. Nach der Registrierung sind deine Reisen standardmäßig privat und nur für dich lesbar — auf Datenbankebene gesichert, nicht nur in der App. Keine Werbung, kein Datenverkauf, niemals.'
    }
  },
  {
    q: {
      en: 'Which regions and countries does TripLoop cover?',
      es: '¿Qué regiones y países cubre TripLoop?',
      pt: 'Quais regiões e países o TripLoop cobre?',
      de: 'Welche Regionen und Länder deckt TripLoop ab?'
    },
    a: {
      en: '24 regions across 7 continents (post-S34): USA (10 regions incl. California PCH, Rockies, Southeast Florida Keys), Europe (Spain, Italy Amalfi, Iceland Ring Road, Ireland Kerry, Germany Romantic Road, Scotland NC500), Asia (Japan Golden Route), Oceania (Australia Great Ocean Road, NZ South Island), Latin America (Mexico Riviera Maya, Chile Carretera Austral, Argentina Ruta 40, Peru Machu Picchu), Canada (Icefields Parkway), Africa (Morocco Sahara). 60 verified iconic routes with highway names.',
      es: '24 regiones en 7 continentes (post-S34): USA (10 regiones incl. California PCH, Rockies, Sureste Florida Keys), Europa (España, Italia Amalfi, Islandia Ring Road, Irlanda Kerry, Alemania Ruta Romántica, Escocia NC500), Asia (Japón Ruta Dorada), Oceanía (Australia Great Ocean Road, NZ Isla Sur), América Latina (México Riviera Maya, Chile Carretera Austral, Argentina Ruta 40, Perú Machu Picchu), Canadá (Icefields Parkway), África (Marruecos Sahara). 60 rutas icónicas verificadas con nombres de highway.',
      pt: '24 regiões em 7 continentes: EUA (10 regiões incl. California PCH, Rockies, Sudeste Florida Keys), Europa (Espanha, Itália Amalfi, Islândia Ring Road, Irlanda Kerry, Alemanha Rota Romântica, Escócia NC500), Ásia (Japão Rota Dourada), Oceania (Austrália Great Ocean Road, NZ Ilha Sul), América Latina (México Riviera Maya, Chile Carretera Austral, Argentina Ruta 40, Peru Machu Picchu), Canadá (Icefields Parkway), África (Marrocos Saara). 60 rotas icônicas verificadas com nomes de rodovia.',
      de: '24 Regionen auf 7 Kontinenten: USA (10 Regionen inkl. California PCH, Rocky Mountains, Südosten Florida Keys), Europa (Spanien, Italien Amalfi, Island Ringstraße, Irland Kerry, Deutschland Romantische Straße, Schottland NC500), Asien (Japan Goldene Route), Ozeanien (Australien Great Ocean Road, NZ Südinsel), Lateinamerika (Mexiko Riviera Maya, Chile Carretera Austral, Argentinien Ruta 40, Peru Machu Picchu), Kanada (Icefields Parkway), Afrika (Marokko Sahara). 60 verifizierte ikonische Routen mit Autobahnnamen.'
    }
  },
  {
    q: {
      en: 'How fast is the AI Trip Generator?',
      es: '¿Qué tan rápido es el AI Trip Generator?',
      pt: 'Quão rápido é o Gerador de Viagem com IA?',
      de: 'Wie schnell ist der KI-Reiseplaner?'
    },
    a: {
      en: 'Hierarchy: (1) Prompt cache hit ~10ms if you\'ve searched something similar; (2) Curated-first matcher ~50-200ms when your prompt matches one of 46 iconic templates (~40% of queries); (3) AI fresh with Server-Sent Events streaming — first stop visible in ~2-5s, full trip in 15-30s. Curated hits return 0-token because we have 229 POIs verified in DB.',
      es: 'Jerarquía: (1) Cache hit prompt ~10ms si buscaste algo similar; (2) Curated-first matcher ~50-200ms cuando tu prompt matchea uno de 46 templates icónicos (~40% de queries); (3) IA fresh con streaming Server-Sent Events — primer stop visible en ~2-5s, viaje completo en 15-30s. Los curated hits gastan 0 tokens porque tenemos 229 POIs verificados en DB.',
      pt: 'Hierarquia: (1) Cache hit do prompt ~10ms se você buscou algo similar; (2) Matcher curated-first ~50-200ms quando seu prompt combina com um dos 46 templates icônicos (~40% das buscas); (3) IA fresh com streaming Server-Sent Events — primeira parada visível em ~2-5s, viagem completa em 15-30s. Curated hits gastam 0 tokens porque temos 229 POIs verificados no DB.',
      de: 'Hierarchie: (1) Prompt-Cache-Treffer ~10ms, wenn du etwas Ähnliches gesucht hast; (2) Curated-first-Matcher ~50-200ms, wenn dein Prompt zu einem der 46 ikonischen Templates passt (~40% der Anfragen); (3) Frische KI mit Server-Sent-Events-Streaming — erster Stopp in ~2-5s sichtbar, komplette Reise in 15-30s. Curated-Treffer verbrauchen 0 Tokens, weil wir 229 POIs in der DB verifiziert haben.'
    }
  },
  {
    q: {
      en: 'What is the WhatsApp bot?',
      es: '¿Qué es el bot de WhatsApp?',
      pt: 'O que é o bot do WhatsApp?',
      de: 'Was ist der WhatsApp-Bot?'
    },
    a: {
      en: 'Bilingual bot that lets you plan trips right from WhatsApp. Commands: /new (new trip), /trips (list), /help. Free-form questions get an AI answer. Ideal for LATAM (98% WhatsApp penetration in MX/AR/CO).',
      es: 'Bot bilingüe para planear viajes directo desde WhatsApp. Comandos: /nuevo, /mis-viajes, /help. Consultas libres reciben respuesta con IA. Ideal para LATAM (98% de penetración WhatsApp en MX/AR/CO).',
      pt: 'Bot bilíngue para planejar viagens direto do WhatsApp. Comandos: /novo (nova viagem), /viagens (listar), /help. Perguntas abertas recebem resposta com IA. Ideal para a América Latina (98% de penetração do WhatsApp em MX/AR/CO/BR).',
      de: 'Zweisprachiger Bot, der dir erlaubt, Reisen direkt aus WhatsApp zu planen. Befehle: /neu (neue Reise), /reisen (Liste), /help. Freie Fragen erhalten eine KI-Antwort. Ideal für Lateinamerika (98% WhatsApp-Verbreitung in MX/AR/CO).'
    }
  },
  {
    q: {
      en: 'Can I add POIs from the map directly?',
      es: '¿Puedo agregar POIs desde el mapa directamente?',
      pt: 'Posso adicionar POIs direto do mapa?',
      de: 'Kann ich POIs direkt aus der Karte hinzufügen?'
    },
    a: {
      en: 'Yes — Discovery chip bar in trip page has 7 categories (🍴 Food · 🎨 Attractions · 🏞️ Nature · ⛽ Gas · 🏨 Hotels · ⚡ EV · 🛍️ Shopping). Tap category, POIs render as markers on map. Tap marker → popup with photo + rating + "+ Add to trip". Google Places under the hood.',
      es: 'Sí — Chip bar Discovery en trip page tiene 7 categorías (🍴 Comida · 🎨 Atracciones · 🏞️ Naturaleza · ⛽ Gasolina · 🏨 Hoteles · ⚡ EV · 🛍️ Tiendas). Tap categoría, POIs renderizan como markers. Tap marker → popup con foto + rating + "+ Agregar al viaje". Google Places under-the-hood.',
      pt: 'Sim — a barra de chips Discovery na página da viagem tem 7 categorias (🍴 Comida · 🎨 Atrações · 🏞️ Natureza · ⛽ Combustível · 🏨 Hotéis · ⚡ EV · 🛍️ Compras). Toque na categoria, POIs aparecem como marcadores no mapa. Toque no marcador → popup com foto + avaliação + "+ Adicionar à viagem". Google Places por trás.',
      de: 'Ja — die Discovery-Chipleiste auf der Reise-Seite hat 7 Kategorien (🍴 Essen · 🎨 Sehenswürdigkeiten · 🏞️ Natur · ⛽ Tanken · 🏨 Hotels · ⚡ E-Ladung · 🛍️ Einkaufen). Kategorie antippen, POIs erscheinen als Marker auf der Karte. Marker antippen → Popup mit Foto + Bewertung + „+ Zur Reise hinzufügen". Google Places im Hintergrund.'
    }
  }
];

export function FAQ({ locale: localeProp, isEs: isEsProp }: { locale?: string; isEs?: boolean }){
  const locale = localeProp || (isEsProp ? 'es' : 'en');
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const heading = L(locale, { en: 'Frequently asked questions', es: 'Preguntas frecuentes', pt: 'Perguntas frequentes', de: 'Häufig gestellte Fragen' });
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: QAS.map((qa) => ({
      '@type': 'Question',
      name: L(locale, qa.q),
      acceptedAnswer: { '@type': 'Answer', text: L(locale, qa.a) }
    }))
  };
  return (
    <section id="faq" className="bg-white py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-coral-600">FAQ</p>
          <h2 className="font-display text-display-md text-ink-900 md:text-display-lg">{heading}</h2>
        </div>
        <div className="space-y-2">
          {QAS.map((qa, i) => {
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
                    {L(locale, qa.q)}
                  </span>
                  <span aria-hidden className={`grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-coral-50 text-coral-600 transition ${open ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {open && (
                  <div id={`faq-answer-${i}`} className="border-t border-ink-100 bg-ink-50/30 px-5 py-4 text-sm leading-relaxed text-ink-700">
                    {L(locale, qa.a)}
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
