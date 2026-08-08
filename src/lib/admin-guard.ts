// Admin guard con passphrase compartida (env ADMIN_PASSPHRASE).
// Cookie 'triploop_admin' setea sesión 24h tras login exitoso.

import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'triploop_admin';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24h

function secret(){
  return process.env.SEED_TOKEN || 'change-me-in-prod-must-be-random-32chars';
}

export function signAdminToken(){
  const exp = Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE;
  const payload = `admin.${exp}`;
  const sig = createHmac('sha256', secret()).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if(!token) return false;
  const parts = token.split('.');
  if(parts.length !== 3) return false;
  const [prefix, expStr, sig] = parts;
  if(prefix !== 'admin') return false;
  const exp = parseInt(expStr, 10);
  if(!exp || exp < Math.floor(Date.now() / 1000)) return false;
  const expected = createHmac('sha256', secret()).update(`${prefix}.${expStr}`).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch { return false; }
}

export function checkPassphrase(input: string): boolean {
  const expected = (process.env.ADMIN_PASSPHRASE || '').trim();
  const got = (input || '').trim();
  if(!expected) return false;
  if(got.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(got), Buffer.from(expected));
  } catch { return false; }
}

export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return verifyAdminToken(token);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
export const ADMIN_COOKIE_MAX_AGE = COOKIE_MAX_AGE;
