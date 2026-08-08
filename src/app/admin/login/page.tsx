'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage(){
  const router = useRouter();
  const [passphrase, setPassphrase] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ passphrase })
      });
      if(!r.ok){ setError('Contraseña incorrecta.'); return; }
      router.replace('/admin');
      router.refresh();
    } finally { setLoading(false); }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-white px-6">
      <div className="w-full max-w-[380px]">
        <div className="mb-10 flex items-center justify-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-[10px] bg-ink-900 text-[14px] font-semibold text-white">t</div>
          <div className="text-center">
            <div className="font-display text-[16px] font-semibold leading-tight tracking-tight text-ink-900">TripLoop</div>
            <div className="text-[10px] font-medium uppercase tracking-widest text-ink-400">Admin</div>
          </div>
        </div>
        <form onSubmit={submit} className="rounded-2xl border border-ink-100 bg-white p-8 shadow-sm">
          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-ink-500">Contraseña</span>
            <input
              type="password"
              autoFocus
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-[14px] text-ink-900 outline-none transition focus:border-ink-900 focus:ring-2 focus:ring-ink-100"
              placeholder="••••••••"
            />
          </label>
          {error && (
            <div role="alert" className="mt-3 rounded-lg bg-coral-50 px-3 py-2 text-[12px] text-coral-700">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !passphrase}
            className="mt-6 w-full rounded-xl bg-ink-900 py-3 text-[13px] font-semibold text-white transition hover:bg-ink-800 disabled:opacity-40"
          >
            {loading ? '…' : 'Entrar →'}
          </button>
        </form>
        <p className="mt-6 text-center text-[11px] text-ink-400">
          <a href="/es" className="hover:text-ink-800">← Volver al sitio</a>
        </p>
      </div>
    </main>
  );
}
