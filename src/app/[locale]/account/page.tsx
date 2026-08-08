'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { usePro } from '@/lib/use-pro';

export default function AccountPage(){
  const params = useParams<{ locale: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = params?.locale || 'en';
  const isEs = locale === 'es';
  const { loading, isPro, isTrialing, cancelAtPeriodEnd, periodEnd, userId } = usePro();
  const [portalLoading, setPortalLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const justCheckedOut = searchParams?.get('checkout') === 'success';

  const managePortal = async () => {
    setPortalLoading(true);
    try {
      const r = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await r.json();
      if(r.ok && data.url) window.location.href = data.url;
      else alert(data.error || 'error');
    } finally {
      setPortalLoading(false);
    }
  };

  const signOut = async () => {
    setSigningOut(true);
    await createClient().auth.signOut();
    router.push(`/${locale}`);
  };

  if(loading) return <div className="grid min-h-screen place-items-center text-ink-500">…</div>;
  if(!userId){
    if(typeof window !== 'undefined') router.replace(`/${locale}/signin`);
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-coral-50/30 via-white to-ocean-400/5">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Link href={`/${locale}`} className="mb-6 inline-block text-xs font-semibold uppercase tracking-widest text-ink-500 hover:text-ink-900">
          ← TripLoop
        </Link>
        <h1 className="font-display text-display-md text-ink-900">{isEs ? 'Mi cuenta' : 'Account'}</h1>

        {justCheckedOut && (
          <div className="mt-4 rounded-card border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            🎉 {isEs ? 'Bienvenido a TripLoop Pro! Tu prueba de 14 días arrancó.' : 'Welcome to TripLoop Pro! Your 14-day trial just started.'}
          </div>
        )}

        <section className="mt-8 overflow-hidden rounded-card border border-ink-100 bg-white shadow-card">
          <div className="border-b border-ink-100 bg-ink-50/50 p-5">
            <h2 className="font-display text-lg font-semibold text-ink-900">{isEs ? 'Suscripción' : 'Subscription'}</h2>
          </div>
          <div className="p-5">
            {isPro ? (
              <>
                <div className="mb-4 flex items-center gap-2">
                  <span className="rounded-pill bg-gradient-to-r from-coral-500 to-coral-600 px-3 py-1 text-xs font-semibold text-white">
                    {isTrialing ? (isEs ? 'Prueba activa' : 'Trialing') : 'Pro'}
                  </span>
                  <span className="text-xs text-ink-500">
                    {isEs ? 'Plan Pro' : 'Pro plan'}
                  </span>
                </div>
                {periodEnd && (
                  <p className="mb-4 text-sm text-ink-600">
                    {cancelAtPeriodEnd
                      ? (isEs ? 'Se cancela el ' : 'Cancels on ')
                      : isTrialing
                        ? (isEs ? 'Prueba gratis termina ' : 'Trial ends ')
                        : (isEs ? 'Próximo cobro ' : 'Next renewal ')}
                    <strong>{new Date(periodEnd).toLocaleDateString(isEs ? 'es-MX' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                  </p>
                )}
                <button
                  onClick={managePortal}
                  disabled={portalLoading}
                  className="w-full rounded-pill border border-ink-800 bg-white px-5 py-3 text-sm font-semibold text-ink-800 transition hover:bg-ink-900 hover:text-white disabled:opacity-60"
                >
                  {portalLoading ? (isEs ? 'Abriendo…' : 'Opening…') : (isEs ? 'Gestionar suscripción' : 'Manage subscription')}
                </button>
              </>
            ) : (
              <>
                <p className="mb-4 text-sm text-ink-600">
                  {isEs ? 'Estás en el plan gratis. Actualiza a Pro para desbloquear todo.' : 'You\'re on the free plan. Upgrade to Pro to unlock everything.'}
                </p>
                <Link
                  href={`/${locale}/pricing/upgrade`}
                  className="block w-full rounded-pill bg-coral-500 px-5 py-3 text-center text-sm font-semibold text-white shadow-glow transition hover:bg-coral-600"
                >
                  {isEs ? '⭐ Hazte Pro — 14 días gratis' : '⭐ Go Pro — 14 days free'}
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-card border border-ink-100 bg-white shadow-card">
          <div className="border-b border-ink-100 bg-ink-50/50 p-5">
            <h2 className="font-display text-lg font-semibold text-ink-900">{isEs ? 'Sesión' : 'Session'}</h2>
          </div>
          <div className="flex items-center justify-between gap-4 p-5">
            <span className="truncate text-sm text-ink-600">{userId}</span>
            <button
              onClick={signOut}
              disabled={signingOut}
              className="rounded-pill border border-ink-200 px-4 py-2 text-xs font-semibold text-ink-700 transition hover:border-coral-500 hover:text-coral-600 disabled:opacity-60"
            >
              {signingOut ? '…' : (isEs ? 'Cerrar sesión' : 'Sign out')}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
