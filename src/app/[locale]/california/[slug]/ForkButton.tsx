'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export function ForkButton({ slug, locale, isEs, big }: { slug: string; locale: string; isEs: boolean; big?: boolean }){
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    try {
      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      if(!user){
        // Redirect to signin with return path
        router.push(`/${locale}/signin?next=/${locale}/california/${slug}`);
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
    ? (isEs ? 'Duplicando…' : 'Duplicating…')
    : big
      ? (isEs ? '✨ Duplicar y personalizar' : '✨ Fork & customize')
      : (isEs ? '📋 Duplicar esta ruta' : '📋 Fork this trip');

  return (
    <button onClick={handle} disabled={loading} className={`${base} ${size}`}>
      {label}
    </button>
  );
}
