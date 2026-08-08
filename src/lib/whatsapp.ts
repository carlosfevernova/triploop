// WhatsApp bot helper — Twilio-backed, env-driven, graceful sin config.

export function isWhatsAppConfigured(){
  return !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.WHATSAPP_FROM_NUMBER);
}

/**
 * Número público al que el usuario escribe. Formato E.164 sin '+' para wa.me URL.
 * Ej: 5215512345678 (México). Sin config → default landing showcase number.
 */
export function getPublicNumber(): string {
  return (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/[^0-9]/g, '') || '';
}

/** wa.me deep-link con mensaje pre-poblado */
export function waLink(text: string, locale: 'es' | 'en' = 'es'): string {
  const number = getPublicNumber();
  const encoded = encodeURIComponent(text || (locale === 'es' ? 'Hola TripLoop, quiero planear un viaje' : 'Hello TripLoop, I want to plan a trip'));
  if(!number) return `https://wa.me/?text=${encoded}`;
  return `https://wa.me/${number}?text=${encoded}`;
}

// ═══ TWILIO SEND ═══
/** Send WhatsApp message via Twilio REST API */
export async function sendWhatsAppMessage(to: string, body: string): Promise<{ ok: boolean; sid?: string; error?: string }> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.WHATSAPP_FROM_NUMBER; // formato 'whatsapp:+14155238886'
  if(!sid || !token || !from){
    return { ok: false, error: 'twilio_not_configured' };
  }
  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const auth = Buffer.from(`${sid}:${token}`).toString('base64');
  const params = new URLSearchParams({
    From: from,
    To: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
    Body: body
  });
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'authorization': `Basic ${auth}`, 'content-type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    if(!r.ok) return { ok: false, error: `twilio_${r.status}` };
    const data = await r.json();
    return { ok: true, sid: data.sid };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

// ═══ BOT LOGIC ═══
export interface BotContext {
  message: string;
  from: string;
  locale: 'es' | 'en';
}

const SITE = 'https://triploop-six.vercel.app';

/** Match keyword commands or fall through to AI */
export async function generateBotReply({ message, locale }: BotContext): Promise<string> {
  const isEs = locale === 'es';
  const msg = message.toLowerCase().trim();

  // Greetings
  if(/^(hola|hi|hello|hey|buenas|qué tal)/i.test(msg)){
    return isEs
      ? `👋 ¡Hola! Soy el bot de TripLoop. Ayudo a planear road trips por California, Nevada y Arizona.\n\n*Comandos:*\n• *rutas* — ver rutas listas\n• *planear* — armar un viaje nuevo\n• *blog* — guías de viaje\n• *precios* — plan Free y Pro\n• *ayuda* — ver este menú`
      : `👋 Hi! I'm the TripLoop bot. I help plan road trips through California, Nevada, and Arizona.\n\n*Commands:*\n• *trips* — see ready templates\n• *plan* — build a new trip\n• *blog* — travel guides\n• *pricing* — Free and Pro plans\n• *help* — see this menu`;
  }

  // Templates / trips
  if(/^(rutas|trips|routes|templates|plantillas)/i.test(msg)){
    return isEs
      ? `🗺 *Rutas listas para duplicar en 1 clic:*\n\n• California → ${SITE}/es/california\n• Nevada → ${SITE}/es/nevada\n• Arizona → ${SITE}/es/arizona\n• Suroeste USA → ${SITE}/es/southwest\n\nCada ruta tiene tiempos reales de manejo, precios con impuestos e IA para sugerir paradas.`
      : `🗺 *Ready-to-fork itineraries:*\n\n• California → ${SITE}/en/california\n• Nevada → ${SITE}/en/nevada\n• Arizona → ${SITE}/en/arizona\n• US Southwest → ${SITE}/en/southwest\n\nEach trip has real drive times with traffic, tax-included pricing, and AI suggestions.`;
  }

  // Plan new trip
  if(/^(planear|plan|nuevo|new|crear|create)/i.test(msg)){
    return isEs
      ? `✨ Arma tu propio viaje aquí:\n${SITE}/es/trip/new\n\nO cuéntame qué buscas (ej: "5 días por California, me gusta la naturaleza") y te sugiero una ruta con IA.`
      : `✨ Build your own trip here:\n${SITE}/en/trip/new\n\nOr tell me what you're looking for (e.g. "5 days in California, I like nature") and I'll suggest a route with AI.`;
  }

  // Blog
  if(/^(blog|guías|guides|posts)/i.test(msg)){
    return isEs
      ? `📖 Guías prácticas sin fluff:\n${SITE}/es/blog\n\nTop guías:\n• Mejor época visitar California\n• ¿Cuánto toma la Pacific Coast Highway?\n• Grand Canyon vs Yosemite\n• Desglose costos Grand Circle 10 días`
      : `📖 Practical guides, no fluff:\n${SITE}/en/blog\n\nTop reads:\n• Best time to visit California\n• How long does the Pacific Coast Highway take?\n• Grand Canyon vs Yosemite\n• Southwest Grand Circle cost breakdown`;
  }

  // Pricing
  if(/^(precios|precio|pricing|price|plan|pro)/i.test(msg)){
    return isEs
      ? `💎 *Planes:*\n\n• *Free* — hasta 3 viajes guardados, IA 3 gens/día\n• *Pro* — $6.99/mes · viajes ilimitados, IA ilimitada, mapas offline, PDF export, colaboración\n\n14 días de prueba gratis: ${SITE}/es/pricing/upgrade`
      : `💎 *Plans:*\n\n• *Free* — up to 3 saved trips, AI 3 gens/day\n• *Pro* — $6.99/mo · unlimited trips, unlimited AI, offline maps, PDF export, collaboration\n\n14-day free trial: ${SITE}/en/pricing/upgrade`;
  }

  // Help / menu
  if(/^(ayuda|help|menú|menu|comandos|commands|\?)/i.test(msg)){
    return isEs
      ? `🤖 *Menú TripLoop bot:*\n\n• *rutas* — plantillas listas\n• *planear* — armar viaje nuevo\n• *blog* — guías de viaje\n• *precios* — planes Free/Pro\n\nO escribe libre — la IA te ayuda: ej. "quiero 5 días por Big Sur en septiembre"`
      : `🤖 *TripLoop bot menu:*\n\n• *trips* — ready templates\n• *plan* — build new trip\n• *blog* — travel guides\n• *pricing* — Free/Pro plans\n\nOr write freely — AI helps: e.g. "I want 5 days along Big Sur in September"`;
  }

  // Fallback → AI generation
  return await generateAiReply(message, locale);
}

async function generateAiReply(message: string, locale: 'es' | 'en'): Promise<string> {
  const key = process.env.FIREWORKS_API_KEY;
  if(!key){
    return locale === 'es'
      ? `🤔 No entendí. Escribe *ayuda* para ver los comandos disponibles, o visita ${SITE}/es`
      : `🤔 Didn't catch that. Type *help* to see commands, or visit ${SITE}/en`;
  }
  const system = locale === 'es'
    ? `Eres el asistente de WhatsApp de TripLoop, planeador de road trips por California, Nevada, Arizona. Respondes máximo 3-4 oraciones. Siempre incluye 1 link útil de ${SITE}. Tono amigable pero directo. Idioma: español mexicano neutro.`
    : `You are the TripLoop WhatsApp assistant, road-trip planner for California, Nevada, Arizona. Reply max 3-4 sentences. Always include 1 useful link from ${SITE}. Friendly but direct tone.`;
  try {
    const r = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
      method: 'POST',
      headers: { 'authorization': `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'accounts/fireworks/models/deepseek-v3',
        max_tokens: 300,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: message }
        ]
      })
    });
    if(!r.ok) throw new Error('ai_failed');
    const data = await r.json();
    return data?.choices?.[0]?.message?.content || (locale === 'es' ? 'Escribe *ayuda* para ver opciones.' : 'Type *help* for options.');
  } catch {
    return locale === 'es'
      ? `Escribe *ayuda* para ver comandos, o visita ${SITE}/es`
      : `Type *help* for commands, or visit ${SITE}/en`;
  }
}

/** Detect language from message text (heuristic simple) */
export function detectLocale(text: string): 'es' | 'en' {
  const esWords = /\b(hola|qué|como|para|puedo|quiero|viaje|dias?|rutas|ayuda|gracias|dónde|cuánto|precio|cuál)\b/i;
  const enWords = /\b(hi|hello|what|how|for|can|want|trip|days?|routes|help|thanks|where|price|which)\b/i;
  const esScore = (text.match(esWords) || []).length;
  const enScore = (text.match(enWords) || []).length;
  return esScore >= enScore ? 'es' : 'en';
}
