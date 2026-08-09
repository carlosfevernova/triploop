// S65 cache fix — wrapper server component para forzar dinamismo en /account (auth-gated 'use client')
// Layout parent [locale]/layout.tsx tiene setRequestLocale para permitir static rendering
// del landing y regiones, pero /account requiere fetch de sesión Supabase en cada request.
export const dynamic = 'force-dynamic';

export default function AccountLayout({ children }: { children: React.ReactNode }){
  return children;
}
