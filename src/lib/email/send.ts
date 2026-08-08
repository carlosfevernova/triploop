import { Resend } from 'resend';

const FROM_DEFAULT = process.env.EMAIL_FROM || 'TripLoop <hello@triploop.app>';
const REPLY_TO = process.env.EMAIL_REPLY_TO || 'hello@triploop.app';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://triploop-six.vercel.app';

export function isEmailConfigured(){
  return !!process.env.RESEND_API_KEY;
}

interface SendOpts {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  tag?: string;         // Resend tag for analytics
}

export async function sendEmail(opts: SendOpts){
  const key = process.env.RESEND_API_KEY;
  if(!key){
    // Dev / no key: log + return sin fallar
    console.log('[email:mock]', { to: opts.to, subject: opts.subject, tag: opts.tag });
    return { ok: false, mocked: true, reason: 'no_resend_key' };
  }
  const resend = new Resend(key);
  try {
    const { data, error } = await resend.emails.send({
      from: opts.from || FROM_DEFAULT,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      replyTo: REPLY_TO,
      tags: opts.tag ? [{ name: 'campaign', value: opts.tag }] : undefined
    });
    if(error) return { ok: false, error: error.message };
    return { ok: true, id: data?.id };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export function appUrl(path = ''){ return `${APP_URL}${path}`; }
export function unsubscribeUrl(email: string){
  // Simple token: base64(email+secret hash) → verificable server-side
  const secret = process.env.SEED_TOKEN || 'unsub';
  const token = Buffer.from(`${email}:${secret}`).toString('base64url');
  return `${APP_URL}/unsubscribe?t=${token}`;
}

export function verifyUnsubToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const [email, secret] = decoded.split(':');
    const expected = process.env.SEED_TOKEN || 'unsub';
    if(secret !== expected) return null;
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
    return email;
  } catch { return null; }
}
