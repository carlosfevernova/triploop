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
      if(!r.ok){ setError('Wrong passphrase.'); return; }
      router.replace('/admin');
      router.refresh();
    } finally { setLoading(false); }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-ink-900 px-6 text-white">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-card bg-ink-800 p-8">
        <div className="mb-2 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-coral-500 text-sm font-semibold text-white">t</div>
          <span className="font-display text-lg font-semibold">TripLoop Admin</span>
        </div>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-white/60">Passphrase</span>
          <input
            type="password"
            autoFocus
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-coral-400 focus:outline-none"
          />
        </label>
        {error && <div className="rounded-lg bg-coral-500/20 px-3 py-2 text-xs text-coral-300">{error}</div>}
        <button
          type="submit"
          disabled={loading || !passphrase}
          className="w-full rounded-pill bg-coral-500 py-3 text-sm font-semibold text-white transition hover:bg-coral-600 disabled:opacity-60"
        >
          {loading ? '…' : 'Enter dashboard'}
        </button>
      </form>
    </main>
  );
}
