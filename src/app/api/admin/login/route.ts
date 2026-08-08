import { NextResponse } from 'next/server';
import { checkPassphrase, signAdminToken, ADMIN_COOKIE_NAME, ADMIN_COOKIE_MAX_AGE } from '@/lib/admin-guard';

// Node runtime: usa Node crypto para HMAC constant-time
export const runtime = 'nodejs';

export async function POST(req: Request){
  try {
    const { passphrase } = await req.json();
    if(!passphrase || !checkPassphrase(passphrase)){
      // Constant-ish response time para no leak length via 200/400 delta
      await new Promise(r => setTimeout(r, 250));
      return NextResponse.json({ error: 'invalid' }, { status: 401 });
    }
    const token = signAdminToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: ADMIN_COOKIE_MAX_AGE
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
}

export async function DELETE(){
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE_NAME);
  return res;
}
