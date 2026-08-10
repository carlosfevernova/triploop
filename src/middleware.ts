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
// para evitar contaminar SSG con DYNAMIC_SERVER_USAGE (S65 audit findings — fix TTFB 1.3s → <400ms).
// S70: expandido a 4 locales (en, es, pt, de) matching inuit-studio i18n footprint.
const PUBLIC_SEO_PATHS_NO_PREFIX = [
  '',                        // root /en, /es, /pt, /de
  '/agenda',
  '/about',
  '/terms',
  '/privacy',
  '/changelog',
  '/affiliate-disclosure',
  '/blog',
  '/whatsapp',
  '/california', '/nevada', '/arizona', '/southwest',
  '/utah', '/spain', '/pacific-northwest', '/northeast',
  '/southeast', '/rockies', '/italy', '/iceland', '/ireland',
  '/australia', '/new-zealand', '/germany', '/mexico', '/chile',
  '/argentina', '/peru', '/japan', '/canada',
  '/scotland', '/morocco'
];

const PUBLIC_SEO_PREFIXES = [
  ...locales.flatMap((l) => PUBLIC_SEO_PATHS_NO_PREFIX.map((p) => `/${l}${p}`)),
  '/embed'
];

export async function middleware(req: NextRequest){
  // 1. i18n primero (redirect a /en o /es)
  const response = intlMiddleware(req);

  const path = req.nextUrl.pathname;
  // S65/S70: match exacto para roots (/en, /es, /pt, /de) para no cubrir /en/trip/... como público
  const ROOT_LOCALE_PATHS = locales.map((l) => `/${l}`);
  const isPublicSeo = PUBLIC_SEO_PREFIXES.some(p =>
    ROOT_LOCALE_PATHS.includes(p) ? path === p : (path === p || path.startsWith(p + '/'))
  );

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
  // S71: excluir icon* y apple-touch-icon* para que Next.js sirva los dynamic routes de favicon
  matcher: ['/((?!api|_next|_vercel|admin|offline|unsubscribe|embed|icon|apple-touch-icon|robots|sitemap|manifest|sw|.*\\..*).*)']
};
