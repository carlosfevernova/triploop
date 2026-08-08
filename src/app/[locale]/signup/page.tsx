'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase-browser';

export default function SignUpPage(){
  const t = useTranslations('auth');
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params.locale;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(password.length < 8){ setError('Password ≥ 8 chars'); return; }
    setLoading(true); setError(null);
    const sb = createClient();
    const { error: err } = await sb.auth.signUp({ email, password });
    if(err){ setError(err.message); setLoading(false); return; }
    // Fire-and-forget welcome email (Resend soft-fail si no configurado)
    try {
      fetch('/api/emails/welcome', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, locale })
      }).catch(() => {});
    } catch {}
    // Auto-confirm on (config), sesión ya activa
    router.push(`/${locale}/my-trips`);
    router.refresh();
  };

  const isEs = locale === 'es';
  return (
    <main className="min-h-screen bg-gradient-to-br from-coral-50 via-white to-ocean-400/10">
      <div className="mx-auto max-w-md px-6 py-8 md:py-12">
        <Link href={`/${locale}`} className="mb-4 inline-flex items-center gap-1.5 rounded-pill border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-ink-800">
          <span aria-hidden>←</span>
          {isEs ? 'Volver' : 'Back'}
        </Link>
      </div>
      <div className="mx-auto max-w-md px-6 pb-16">
        <Link href="/" className="mb-10 flex items-center justify-center gap-2 text-ink-800">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-coral-500 to-coral-600 text-white shadow-glow">
            <span className="font-display font-semibold">t</span>
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">TripLoop</span>
        </Link>
        <div className="rounded-card border border-ink-100 bg-white p-8 shadow-card">
          <h1 className="mb-2 font-display text-2xl font-semibold text-ink-900">{t('signUpTitle')}</h1>
          <p className="mb-6 text-sm text-ink-500">{t('signUpSubtitle')}</p>
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">{t('email')}</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoFocus autoComplete="email"
                className="w-full rounded-pill border border-ink-200 bg-white px-5 py-3 text-sm text-ink-800 outline-none focus:border-coral-500 focus:ring-4 focus:ring-coral-100" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">{t('password')} <span className="text-ink-400 normal-case">· min 8</span></span>
              <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password"
                className="w-full rounded-pill border border-ink-200 bg-white px-5 py-3 text-sm text-ink-800 outline-none focus:border-coral-500 focus:ring-4 focus:ring-coral-100" />
            </label>
            {error && <div className="rounded-lg bg-coral-50 px-4 py-2 text-sm text-coral-700">{error}</div>}
            <button type="submit" disabled={loading} className="w-full rounded-pill bg-coral-500 py-3.5 text-sm font-semibold text-white transition hover:bg-coral-600 hover:shadow-glow disabled:opacity-50">
              {loading ? '…' : t('signUpBtn')}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-ink-500">
            {t('hasAccount')} <Link href={`/${locale}/signin`} className="font-semibold text-coral-600 hover:underline">{t('signInInstead')}</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
