'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase-browser';
import { usePro } from '@/lib/use-pro';
import type { User } from '@supabase/supabase-js';
import { L } from '@/lib/l4';

// S71k: 4-locale. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
export function UserMenu({ locale }: { locale: string }){
  const t = useTranslations('nav');
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { isPro, isTrialing } = usePro();

  useEffect(() => {
    const sb = createClient();
    sb.auth.getUser().then(({ data }) => { setUser(data.user); setLoading(false); });
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => { if(!rootRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  if(loading) return <div className="h-8 w-16 rounded-pill bg-ink-100 animate-pulse" />;

  if(!user){
    return (
      <Link href={`/${locale}/signin`} className="text-sm font-semibold text-ink-700 hover:text-ink-900">
        {t('signIn')}
      </Link>
    );
  }

  const initial = (user.email || '?')[0].toUpperCase();

  const signOut = async () => {
    const sb = createClient();
    await sb.auth.signOut();
    setOpen(false);
    router.push(`/${locale}`);
    router.refresh();
  };

  return (
    <div ref={rootRef} className="relative flex items-center gap-2">
      {isPro && (
        <span className="rounded-pill bg-gradient-to-r from-coral-500 to-coral-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          {isTrialing ? 'Trial' : 'Pro'}
        </span>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-coral-500 to-coral-600 text-sm font-semibold text-white transition hover:shadow-glow"
        aria-label={L(locale, { en: 'User menu', es: 'Menú de usuario', pt: 'Menu do usuário', de: 'Benutzermenü' })}
      >{initial}</button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-card border border-ink-100 bg-white shadow-card-hover">
          <div className="border-b border-ink-100 px-4 py-3">
            <div className="text-xs text-ink-400">{L(locale, { en: 'Signed in as', es: 'Sesión iniciada como', pt: 'Conectado como', de: 'Angemeldet als' })}</div>
            <div className="truncate text-sm font-semibold text-ink-800">{user.email}</div>
          </div>
          <Link href={`/${locale}/my-trips`} onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm text-ink-700 transition hover:bg-coral-50">
            {t('myTrips')}
          </Link>
          <Link href={`/${locale}/account`} onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm text-ink-700 transition hover:bg-coral-50">
            {L(locale, { en: 'Account', es: 'Mi cuenta', pt: 'Minha conta', de: 'Konto' })}
          </Link>
          {!isPro && (
            <Link href={`/${locale}/pricing/upgrade`} onClick={() => setOpen(false)} className="block bg-coral-50 px-4 py-2.5 text-sm font-semibold text-coral-700 transition hover:bg-coral-100">
              ⭐ {L(locale, { en: 'Go Pro', es: 'Hazte Pro', pt: 'Seja Pro', de: 'Pro werden' })}
            </Link>
          )}
          <button onClick={signOut} className="block w-full border-t border-ink-100 px-4 py-2.5 text-left text-sm text-ink-700 transition hover:bg-coral-50">
            {t('signOut')}
          </button>
        </div>
      )}
    </div>
  );
}
