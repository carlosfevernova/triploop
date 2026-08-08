import { appUrl, unsubscribeUrl } from './send';

// Shared shell — TripLoop editorial minimal, works in all email clients.
function shell(inner: string, unsubEmail?: string){
  const unsub = unsubEmail ? unsubscribeUrl(unsubEmail) : appUrl('/unsubscribe');
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f7f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1F2937;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f7;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <tr><td style="padding:24px 32px 12px 32px;">
          <div style="font-family:Georgia,serif;font-size:20px;font-weight:600;color:#1F2937;">
            <span style="display:inline-block;width:28px;height:28px;background:#FF5A5F;color:white;text-align:center;line-height:28px;border-radius:6px;margin-right:6px;">t</span>
            TripLoop
          </div>
        </td></tr>
        <tr><td style="padding:16px 32px 32px 32px;">
          ${inner}
        </td></tr>
        <tr><td style="padding:16px 32px;border-top:1px solid #eee;text-align:center;font-size:11px;color:#9CA3AF;">
          You're getting this from TripLoop · <a href="${unsub}" style="color:#9CA3AF;">Unsubscribe</a><br>
          Smart California road trips for international travelers.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// ═══ 1. WELCOME (new signup) ═══
export function welcomeEmail(name: string | undefined, email: string, isEs = false){
  const label = name?.split('@')[0] || name || (isEs ? 'viajero' : 'traveler');
  const inner = isEs ? `
    <h1 style="font-family:Georgia,serif;font-size:26px;line-height:1.2;margin:0 0 12px 0;">Hola ${label}, bienvenido a TripLoop.</h1>
    <p style="color:#4B5563;line-height:1.6;">Estás listo para planear tu primer road trip por California con tiempos reales, precios con IVA e IA que sugiere paradas.</p>
    <div style="margin:24px 0;">
      <a href="${appUrl('/es/trip/new')}" style="display:inline-block;background:#FF5A5F;color:white;text-decoration:none;padding:14px 24px;border-radius:9999px;font-weight:600;font-size:14px;">Planear mi primer viaje →</a>
    </div>
    <p style="color:#4B5563;line-height:1.6;">Para arrancar rápido, prueba una <a href="${appUrl('/es/california')}" style="color:#FF5A5F;">ruta lista</a> como <a href="${appUrl('/es/california/pacific-coast-highway-5-days')}" style="color:#FF5A5F;">PCH en 5 días</a> — duplícala y personalízala.</p>
    <p style="color:#4B5563;line-height:1.6;font-size:13px;margin-top:24px;">¿Preguntas? Responde este correo directo.</p>
  ` : `
    <h1 style="font-family:Georgia,serif;font-size:26px;line-height:1.2;margin:0 0 12px 0;">Hi ${label}, welcome to TripLoop.</h1>
    <p style="color:#4B5563;line-height:1.6;">You're all set to plan your first California road trip with real drive times, tax-included prices, and AI that suggests stops.</p>
    <div style="margin:24px 0;">
      <a href="${appUrl('/en/trip/new')}" style="display:inline-block;background:#FF5A5F;color:white;text-decoration:none;padding:14px 24px;border-radius:9999px;font-weight:600;font-size:14px;">Plan my first trip →</a>
    </div>
    <p style="color:#4B5563;line-height:1.6;">Want a head start? Try a <a href="${appUrl('/en/california')}" style="color:#FF5A5F;">ready-made itinerary</a> like <a href="${appUrl('/en/california/pacific-coast-highway-5-days')}" style="color:#FF5A5F;">Pacific Coast Highway 5 days</a> — fork it and customize.</p>
    <p style="color:#4B5563;line-height:1.6;font-size:13px;margin-top:24px;">Questions? Just reply to this email.</p>
  `;
  return {
    subject: isEs ? '¡Bienvenido a TripLoop!' : 'Welcome to TripLoop',
    html: shell(inner, email),
    tag: 'welcome'
  };
}

// ═══ 2. WAITLIST WELCOME ═══
export function waitlistEmail(email: string, isEs = false){
  const inner = isEs ? `
    <h1 style="font-family:Georgia,serif;font-size:26px;line-height:1.2;margin:0 0 12px 0;">Estás en la lista.</h1>
    <p style="color:#4B5563;line-height:1.6;">Gracias por unirte. TripLoop ya está en beta abierta — puedes empezar YA sin esperar:</p>
    <div style="margin:24px 0;">
      <a href="${appUrl('/es')}" style="display:inline-block;background:#FF5A5F;color:white;text-decoration:none;padding:14px 24px;border-radius:9999px;font-weight:600;font-size:14px;">Empezar ahora →</a>
    </div>
    <p style="color:#4B5563;line-height:1.6;">Te avisaremos cuando lancemos nuevas regiones (Nevada, Arizona) y el plan Pro con mapas offline.</p>
  ` : `
    <h1 style="font-family:Georgia,serif;font-size:26px;line-height:1.2;margin:0 0 12px 0;">You're on the list.</h1>
    <p style="color:#4B5563;line-height:1.6;">Thanks for joining. TripLoop is already in open beta — you can start today without waiting:</p>
    <div style="margin:24px 0;">
      <a href="${appUrl('/en')}" style="display:inline-block;background:#FF5A5F;color:white;text-decoration:none;padding:14px 24px;border-radius:9999px;font-weight:600;font-size:14px;">Start now →</a>
    </div>
    <p style="color:#4B5563;line-height:1.6;">We'll ping you when new regions (Nevada, Arizona) and Pro offline maps launch.</p>
  `;
  return {
    subject: isEs ? 'Bienvenido — TripLoop ya está en beta' : 'Welcome — TripLoop is already in beta',
    html: shell(inner, email),
    tag: 'waitlist'
  };
}

// ═══ 3. TRIAL ENDING (3 días antes) ═══
export function trialEndingEmail(email: string, daysLeft: number, isEs = false){
  const inner = isEs ? `
    <h1 style="font-family:Georgia,serif;font-size:26px;line-height:1.2;margin:0 0 12px 0;">Tu prueba Pro termina en ${daysLeft} día${daysLeft === 1 ? '' : 's'}.</h1>
    <p style="color:#4B5563;line-height:1.6;">Cuando termine, seguirás teniendo tus viajes guardados — solo perderás mapas offline, IA ilimitada y export PDF.</p>
    <div style="margin:24px 0;">
      <a href="${appUrl('/es/pricing/upgrade')}" style="display:inline-block;background:#FF5A5F;color:white;text-decoration:none;padding:14px 24px;border-radius:9999px;font-weight:600;font-size:14px;">Mantener Pro · $6.99/mes →</a>
    </div>
    <p style="color:#4B5563;line-height:1.6;font-size:13px;">Puedes cancelar en 1 clic desde <a href="${appUrl('/es/account')}" style="color:#FF5A5F;">tu cuenta</a>.</p>
  ` : `
    <h1 style="font-family:Georgia,serif;font-size:26px;line-height:1.2;margin:0 0 12px 0;">Your Pro trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}.</h1>
    <p style="color:#4B5563;line-height:1.6;">When it ends, you'll still have all your saved trips — you'll just lose offline maps, unlimited AI, and PDF export.</p>
    <div style="margin:24px 0;">
      <a href="${appUrl('/en/pricing/upgrade')}" style="display:inline-block;background:#FF5A5F;color:white;text-decoration:none;padding:14px 24px;border-radius:9999px;font-weight:600;font-size:14px;">Keep Pro · $6.99/mo →</a>
    </div>
    <p style="color:#4B5563;line-height:1.6;font-size:13px;">You can cancel in one click from <a href="${appUrl('/en/account')}" style="color:#FF5A5F;">your account</a>.</p>
  `;
  return {
    subject: isEs ? `Tu prueba Pro termina en ${daysLeft} día${daysLeft === 1 ? '' : 's'}` : `Your Pro trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
    html: shell(inner, email),
    tag: 'trial-ending'
  };
}

// ═══ 4. WEEKLY DIGEST ═══
export function weeklyDigestEmail(email: string, topTemplates: Array<{ slug: string; title: string; days: number }>, isEs = false){
  const list = topTemplates.slice(0, 5).map((t, i) => `
    <li style="margin-bottom:12px;padding:12px;background:#f9fafb;border-radius:8px;list-style:none;">
      <a href="${appUrl(`/${isEs ? 'es' : 'en'}/california/${t.slug}`)}" style="color:#1F2937;text-decoration:none;font-weight:600;">
        ${i + 1}. ${t.title}
      </a>
      <div style="font-size:12px;color:#6B7280;margin-top:2px;">${t.days} ${isEs ? 'días' : 'days'}</div>
    </li>
  `).join('');

  const inner = isEs ? `
    <h1 style="font-family:Georgia,serif;font-size:24px;line-height:1.2;margin:0 0 12px 0;">Rutas populares esta semana</h1>
    <p style="color:#4B5563;line-height:1.6;">Los itinerarios California más vistos por otros viajeros:</p>
    <ul style="padding:0;margin:16px 0;">${list}</ul>
    <p style="color:#4B5563;line-height:1.6;font-size:13px;">Duplica cualquiera con 1 clic y ajusta tus fechas.</p>
  ` : `
    <h1 style="font-family:Georgia,serif;font-size:24px;line-height:1.2;margin:0 0 12px 0;">Popular trips this week</h1>
    <p style="color:#4B5563;line-height:1.6;">The most-viewed California itineraries by fellow travelers:</p>
    <ul style="padding:0;margin:16px 0;">${list}</ul>
    <p style="color:#4B5563;line-height:1.6;font-size:13px;">Fork any of them in one click and adjust your dates.</p>
  `;
  return {
    subject: isEs ? '🗺️ Rutas populares esta semana en TripLoop' : '🗺️ Popular trips this week on TripLoop',
    html: shell(inner, email),
    tag: 'weekly-digest'
  };
}
