'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { L } from '@/lib/l4';

// S71k: 4-locale. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
export function ForkButton({ slug, locale, big }: { slug: string; locale: string; big?: boolean }){
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    try {
      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      if(!user){
        router.push(`/${locale}/signin?next=/${locale}/trip/new`);
        return;
      }
      const r = await fetch(`/api/trips/${slug}/fork`, { method: 'POST' });
      const data = await r.json();
      if(r.ok && data.trip?.slug){
        router.push(`/${locale}/trip/${data.trip.slug}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const base = 'font-semibold text-white shadow-glow transition disabled:opacity-60';
  const size = big ? 'rounded-pill bg-coral-500 px-6 py-3 text-sm hover:bg-coral-600' : 'rounded-pill bg-white/95 px-5 py-2.5 text-sm text-coral-600 hover:bg-white';
  const label = loading
    ? L(locale, { en: 'Duplicating…', es: 'Duplicando…', pt: 'Duplicando…', de: 'Wird dupliziert…' })
    : big
      ? L(locale, { en: '✨ Fork & customize', es: '✨ Duplicar y personalizar', pt: '✨ Duplicar e personalizar', de: '✨ Duplizieren & anpassen' })
      : L(locale, { en: '📋 Fork this trip', es: '📋 Duplicar esta ruta', pt: '📋 Duplicar esta viagem', de: '📋 Diese Reise duplizieren' });

  return (
    <button onClick={handle} disabled={loading} className={`${base} ${size}`}>
      {label}
    </button>
  );
}
