'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function UpgradePage(){
  const params = useParams<{ locale: string }>();
  const router = useRouter();
  const locale = params?.locale || 'en';
  const isEs = locale === 'es';
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      // Verificar auth
      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      if(!user){
        router.push(`/${locale}/signin?next=/${locale}/pricing/upgrade`);
        return;
      }
      const r = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ plan })
      });
      const data = await r.json();
      if(!r.ok || !data.url){
        setError(data.error === 'payments_not_configured'
          ? (isEs ? 'Los pagos aún no están configurados. Contáctanos.' : 'Payments not configured yet. Reach out.')
          : (data.detail || data.error || 'error'));
        return;
      }
      window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-coral-50/40 via-white to-ocean-400/5">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Link href={`/${locale}`} className="mb-6 inline-block text-xs font-semibold uppercase tracking-widest text-ink-500 hover:text-ink-900">
          ← TripLoop
        </Link>
        <h1 className="font-display text-display-lg text-ink-900">
          {isEs ? 'Hazte Pro' : 'Go Pro'}
        </h1>
        <p className="mt-3 text-lg text-ink-500">
          {isEs
            ? '14 días de prueba gratis. Cancela cuando quieras.'
            : 'Start with a 14-day free trial. Cancel anytime.'}
        </p>

        <div className="mt-8 flex gap-2 rounded-pill border border-ink-200 bg-white p-1 text-sm w-fit">
          <button
            onClick={() => setPlan('monthly')}
            className={`rounded-pill px-4 py-2 font-semibold transition ${plan === 'monthly' ? 'bg-ink-900 text-white' : 'text-ink-700'}`}
          >
            {isEs ? 'Mensual' : 'Monthly'}
          </button>
          <button
            onClick={() => setPlan('yearly')}
            className={`rounded-pill px-4 py-2 font-semibold transition ${plan === 'yearly' ? 'bg-ink-900 text-white' : 'text-ink-700'}`}
          >
            {isEs ? 'Anual · 2 meses gratis' : 'Yearly · 2 months free'}
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-card border border-coral-200 bg-white shadow-card">
          <div className="bg-gradient-to-br from-coral-500 to-coral-600 p-6 text-white">
            <div className="text-xs font-semibold uppercase tracking-widest opacity-80">TripLoop Pro</div>
            <div className="mt-1 flex items-baseline gap-2">
              {plan === 'monthly' ? (
                <>
                  <span className="font-display text-5xl font-semibold tracking-tight">$6.99</span>
                  <span className="opacity-85">{isEs ? '/mes' : '/mo'}</span>
                </>
              ) : (
                <>
                  <span className="font-display text-5xl font-semibold tracking-tight">$59.88</span>
                  <span className="opacity-85">{isEs ? '/año' : '/yr'}</span>
                  <span className="ml-2 rounded-pill bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase backdrop-blur">
                    {isEs ? 'Ahorra $23.94' : 'Save $23.94'}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="space-y-3 p-6 text-sm text-ink-700">
            {[
              isEs ? 'Viajes ilimitados' : 'Unlimited saved trips',
              isEs ? 'Mapas offline para parques nacionales' : 'Offline maps for national parks',
              isEs ? 'IA sin límites (sugerencias, itinerarios)' : 'Unlimited AI suggestions & itineraries',
              isEs ? 'Export PDF + manager de reservas' : 'PDF export + booking manager',
              isEs ? 'Colaboración en tiempo real' : 'Real-time collaboration',
              isEs ? 'Soporte prioritario' : 'Priority support'
            ].map((f) => (
              <div key={f} className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-ink-100 bg-ink-50/50 p-6">
            {error && (
              <div className="mb-3 rounded-lg bg-coral-50 p-3 text-xs text-coral-700">{error}</div>
            )}
            <button
              onClick={startCheckout}
              disabled={loading}
              className="w-full rounded-pill bg-coral-500 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-coral-600 disabled:opacity-60"
            >
              {loading ? (isEs ? 'Cargando…' : 'Loading…') : (isEs ? 'Iniciar prueba gratis →' : 'Start free trial →')}
            </button>
            <p className="mt-3 text-center text-[10px] text-ink-400">
              {isEs
                ? 'Powered by Stripe. Se te cobrará después de la prueba.'
                : 'Powered by Stripe. You\'ll be charged after your trial ends.'}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
