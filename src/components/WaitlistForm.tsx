'use client';
import { useState } from 'react';

interface Props {
  placeholder: string;
  buttonLabel: string;
  successLabel: string;
  errorLabel: string;
}

export function WaitlistForm({ placeholder, buttonLabel, successLabel, errorLabel }: Props){
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setStatus('loading');
    try {
      const r = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email })
      });
      setStatus(r.ok ? 'success' : 'error');
      if(r.ok) setEmail('');
    } catch { setStatus('error'); }
  };

  return (
    <>
      <form onSubmit={submit} className="mt-10 flex max-w-lg flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading' || status === 'success'}
          className="flex-1 rounded-pill border border-ink-200 bg-white px-5 py-3.5 text-sm text-ink-800 placeholder-ink-400 outline-none transition focus:border-coral-500 focus:ring-4 focus:ring-coral-500/30 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="rounded-pill bg-coral-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-coral-600 hover:shadow-glow disabled:opacity-60"
        >
          {status === 'loading' ? '…' : status === 'success' ? '✓' : buttonLabel}
        </button>
      </form>
      <div aria-live="polite" aria-atomic="true">
        {status === 'success' && <p className="mt-3 text-sm text-emerald-600">{successLabel}</p>}
        {status === 'error' && <p className="mt-3 text-sm text-coral-600">{errorLabel}</p>}
      </div>
    </>
  );
}
