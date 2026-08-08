'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase-browser';

export default function SignInPage(){
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
    setLoading(true); setError(null);
    const sb = createClient();
    const { error: err } = await sb.auth.signInWithPassword({ email, password });
    if(err){
      setError(/invalid|credentials/i.test(err.message) ? t('invalidCredentials') : t('genericError'));
      setLoading(false);
      return;
    }
    router.push(`/${locale}/my-trips`);
    router.refresh();
  };

  return (
    <AuthShell title={t('signInTitle')} subtitle={t('signInSubtitle')}>
      <form onSubmit={submit} className="space-y-4">
        <FormField label={t('email')} type="email" value={email} onChange={setEmail} autoFocus />
        <FormField label={t('password')} type="password" value={password} onChange={setPassword} />
        {error && <div className="rounded-lg bg-coral-50 px-4 py-2 text-sm text-coral-700">{error}</div>}
        <button type="submit" disabled={loading} className="w-full rounded-pill bg-coral-500 py-3.5 text-sm font-semibold text-white transition hover:bg-coral-600 hover:shadow-glow disabled:opacity-50">
          {loading ? '…' : t('signInBtn')}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-500">
        {t('noAccount')} <Link href={`/${locale}/signup`} className="font-semibold text-coral-600 hover:underline">{t('createOne')}</Link>
      </p>
    </AuthShell>
  );
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }){
  return (
    <main className="min-h-screen bg-gradient-to-br from-coral-50 via-white to-ocean-400/10">
      <div className="mx-auto max-w-md px-6 py-8 md:py-12">
        <Link href="/" className="mb-4 inline-flex items-center gap-1.5 rounded-pill border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-ink-800">
          <span aria-hidden>←</span>
          Back
        </Link>
        <Link href="/" className="mb-10 flex items-center justify-center gap-2 text-ink-800">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-coral-500 to-coral-600 text-white shadow-glow">
            <span className="font-display font-semibold">t</span>
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">TripLoop</span>
        </Link>
        <div className="rounded-card border border-ink-100 bg-white p-8 shadow-card">
          <h1 className="mb-2 font-display text-2xl font-semibold text-ink-900">{title}</h1>
          <p className="mb-6 text-sm text-ink-500">{subtitle}</p>
          {children}
        </div>
      </div>
    </main>
  );
}

function FormField({ label, type, value, onChange, autoFocus }: { label: string; type: string; value: string; onChange: (v: string) => void; autoFocus?: boolean }){
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</span>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        autoComplete={type === 'password' ? 'current-password' : 'email'}
        className="w-full rounded-pill border border-ink-200 bg-white px-5 py-3 text-sm text-ink-800 outline-none transition focus:border-coral-500 focus:ring-4 focus:ring-coral-100"
      />
    </label>
  );
}
