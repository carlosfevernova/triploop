import createIntlMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n/request';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export async function middleware(req: NextRequest){
  // 1. i18n primero (redirect a /en o /es)
  const response = intlMiddleware(req);

  // 2. Refresh session Supabase (writes cookies actualizadas al response)
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll(){ return req.cookies.getAll(); },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]){
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          }
        }
      }
    );
    await supabase.auth.getUser();
  } catch { /* ignore */ }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
