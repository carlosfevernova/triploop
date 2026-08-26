import { redirect } from 'next/navigation';
import { isAdminAuthed } from '@/lib/admin-guard';
import { getAllFlags } from '@/lib/feature-flags';
import { FlagsClient } from '@/components/admin/FlagsClient';

export const metadata = { title: 'Feature Flags — TripLoop Admin', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function FlagsPage(){
  if(!(await isAdminAuthed())) redirect('/admin/login');
  const flags = getAllFlags();

  return (
    <main className="mx-auto max-w-6xl px-8 py-10">
      <a href="/admin" className="mb-6 inline-flex items-center gap-1.5 rounded-pill border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-ink-800">
        <span aria-hidden>←</span> Volver al dashboard
      </a>
      <header className="mb-8 border-b border-ink-100 pb-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-ink-400">Runtime toggles · in-memory override</p>
        <h1 className="font-display text-[32px] font-semibold tracking-tight text-ink-900">Feature Flags</h1>
        <p className="mt-2 text-[14px] text-ink-500">Toggle features sin redeploy · Priority: override → NEXT_PUBLIC_FLAG_&lt;KEY&gt; env → default</p>
      </header>

      <div className="mb-6 rounded-card border border-amber-200 bg-amber-50 p-4 text-[12px] text-amber-800">
        <strong>In-memory only:</strong> overrides persist until the Vercel Fluid instance recycles (~30-60min). For permanent changes set <code className="rounded bg-white/60 px-1">NEXT_PUBLIC_FLAG_&lt;KEY&gt;</code> as an env var and redeploy. For cross-instance persistence, swap to <a className="underline" href="https://vercel.com/docs/edge-config" target="_blank" rel="noreferrer">Vercel Global Config</a>.
      </div>

      <FlagsClient initialFlags={flags} />
    </main>
  );
}
