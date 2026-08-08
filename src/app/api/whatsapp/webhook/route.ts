import { NextResponse } from 'next/server';
import { generateBotReply, detectLocale, sendWhatsAppMessage, isWhatsAppConfigured } from '@/lib/whatsapp';
import { createAdminClient } from '@/lib/supabase-admin';

// Node runtime: Twilio auth Base64 con Buffer
export const runtime = 'nodejs';

/**
 * Twilio POST webhook cuando llega un WhatsApp inbound.
 * Body form-urlencoded: From, Body, To, MessageSid, etc.
 * Respondemos con TwiML <Response><Message>...</Message></Response> (síncrono)
 * O mandamos vía REST API (async).
 */
export async function POST(req: Request){
  if(!isWhatsAppConfigured()){
    return new Response('<Response></Response>', {
      status: 200,
      headers: { 'content-type': 'text/xml' }
    });
  }

  // Twilio signature validation (opcional, recomendado en prod)
  // const twilioSig = req.headers.get('x-twilio-signature');

  const formData = await req.formData();
  const from = String(formData.get('From') || '');           // 'whatsapp:+5215512345678'
  const body = String(formData.get('Body') || '').trim();
  const messageSid = String(formData.get('MessageSid') || '');

  if(!from || !body){
    return new Response('<Response></Response>', { status: 200, headers: { 'content-type': 'text/xml' } });
  }

  const locale = detectLocale(body);

  // Log inbound message (best-effort)
  try {
    const sb = createAdminClient();
    await sb.from('whatsapp_conversations').insert({
      from_number: from,
      direction: 'in',
      body: body.slice(0, 2000),
      locale,
      message_sid: messageSid
    });
  } catch { /* soft-fail */ }

  // Generate reply
  const reply = await generateBotReply({ message: body, from, locale });

  // Send back via REST API (async) + log
  const result = await sendWhatsAppMessage(from, reply);
  try {
    const sb = createAdminClient();
    await sb.from('whatsapp_conversations').insert({
      from_number: from,
      direction: 'out',
      body: reply.slice(0, 2000),
      locale,
      message_sid: result.sid || null,
      error: result.ok ? null : result.error
    });
  } catch {}

  // TwiML empty response (mensaje ya enviado vía REST)
  return new Response('<Response></Response>', {
    status: 200,
    headers: { 'content-type': 'text/xml' }
  });
}

// Health check
export async function GET(){
  return NextResponse.json({
    configured: isWhatsAppConfigured(),
    endpoint: '/api/whatsapp/webhook',
    docs: 'POST from Twilio only — see /es/whatsapp for setup'
  });
}
