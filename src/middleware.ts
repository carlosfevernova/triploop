import createIntlMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n/request';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

// Rutas 100% públicas indexables: NO refrescar Supabase session
// para evitar contaminar SSG con DYNAMIC_SERVER_USAGE.
const PUBLIC_SEO_PREFIXES = [
  '/en/california', '/es/california',
  '/en/nevada', '/es/nevada',
  '/en/arizona', '/es/arizona',
  '/en/southwest', '/es/southwest'
];

export async function middleware(req: NextRequest){
  // 1. i18n primero (redirect a /en o /es)
  const response = intlMiddleware(req);

  const path = req.nextUrl.pathname;
  const isPublicSeo = PUBLIC_SEO_PREFIXES.some(p => path === p || path.startsWith(p + '/'));

  // 2. Refresh session Supabase salvo en rutas SEO estáticas
  if(!isPublicSeo){
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
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|admin|offline|unsubscribe|.*\\..*).*)']
};
