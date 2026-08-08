'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Banner sticky top que se muestra SOLO cuando la cookie admin (Cside) está activa.
// Alerta visual para no confundir preview con estado real de usuario Pro.

export function AdminPreviewBanner(){
  const [show, setShow] = useState(false);
  const [locale, setLocale] = useState<'en' | 'es'>('en');

  useEffect(() => {
    // Detect locale del path
    if(typeof window !== 'undefined'){
      const path = window.location.pathname;
      setLocale(path.startsWith('/es') ? 'es' : 'en');
    }
    // Consulta /api/pro-status para saber si admin override activo
    fetch('/api/pro-status').then(r => r.json()).then(d => {
      if(d?.adminOverride) setShow(true);
    }).catch(() => {});
  }, []);

  if(!show) return null;
  const isEs = locale === 'es';

  return (
    <div className="sticky top-0 z-[60] border-b border-fuchsia-400/40 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-fuchsia-500 px-4 py-2 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 truncate font-semibold">
          <span aria-hidden>🎭</span>
          <span>
            {isEs
              ? 'MODO PREVIEW ADMIN — acceso completo a features Pro (offline, PDF, IA ilimitada). No es cobro real.'
              : 'ADMIN PREVIEW MODE — full access to Pro features (offline, PDF, unlimited AI). No real charge.'}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Link href="/admin" className="rounded-pill bg-white/20 px-3 py-1 font-semibold text-white hover:bg-white/30">
            {isEs ? '→ Admin' : '→ Admin'}
          </Link>
        </div>
      </div>
    </div>
  );
}
