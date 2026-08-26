'use client';

import { useState, useTransition } from 'react';
import type { FlagKey } from '@/lib/feature-flags';

interface FlagRow {
  key: FlagKey;
  value: boolean;
  source: 'override' | 'env' | 'default';
  meta: { key: FlagKey; default: boolean; description: string; category: 'ai' | 'growth' | 'billing' | 'ops' | 'ux' };
}

const CATEGORY_LABEL: Record<FlagRow['meta']['category'], string> = {
  ai: 'AI',
  growth: 'Growth',
  billing: 'Billing',
  ops: 'Ops',
  ux: 'UX'
};

const CATEGORY_COLOR: Record<FlagRow['meta']['category'], string> = {
  ai: 'bg-violet-100 text-violet-700',
  growth: 'bg-emerald-100 text-emerald-700',
  billing: 'bg-amber-100 text-amber-700',
  ops: 'bg-blue-100 text-blue-700',
  ux: 'bg-pink-100 text-pink-700'
};

const SOURCE_LABEL: Record<FlagRow['source'], string> = {
  override: 'Runtime',
  env: 'Env var',
  default: 'Default'
};

export function FlagsClient({ initialFlags }: { initialFlags: FlagRow[] }){
  const [flags, setFlags] = useState(initialFlags);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggle = (key: FlagKey, newValue: boolean) => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/flags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value: newValue })
        });
        const data = await res.json() as { flags?: FlagRow[]; error?: string };
        if(!res.ok || !data.flags) throw new Error(data.error || 'Toggle failed');
        setFlags(data.flags);
      } catch (e) {
        setError((e as Error).message);
      }
    });
  };

  const clear = (key: FlagKey) => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/flags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, action: 'clear' })
        });
        const data = await res.json() as { flags?: FlagRow[]; error?: string };
        if(!res.ok || !data.flags) throw new Error(data.error || 'Clear failed');
        setFlags(data.flags);
      } catch (e) {
        setError((e as Error).message);
      }
    });
  };

  const grouped = flags.reduce<Record<string, FlagRow[]>>((acc, f) => {
    (acc[f.meta.category] ||= []).push(f);
    return acc;
  }, {});

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-[12px] text-red-800">
          {error}
        </div>
      )}
      <div className="space-y-6">
        {Object.entries(grouped).map(([cat, rows]) => (
          <section key={cat}>
            <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-widest text-ink-700">
              <span className={`rounded-full px-2 py-0.5 text-[11px] ${CATEGORY_COLOR[cat as FlagRow['meta']['category']]}`}>
                {CATEGORY_LABEL[cat as FlagRow['meta']['category']]}
              </span>
              <span className="text-ink-400">{rows.length} flag{rows.length === 1 ? '' : 's'}</span>
            </h2>
            <div className="overflow-hidden rounded-card border border-ink-100 bg-white shadow-card">
              <table className="w-full text-[13px]">
                <thead className="border-b border-ink-100 bg-ink-50/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-ink-700">Flag</th>
                    <th className="px-3 py-2 text-left font-semibold text-ink-700">Description</th>
                    <th className="px-3 py-2 text-right font-semibold text-ink-700">Source</th>
                    <th className="px-3 py-2 text-right font-semibold text-ink-700">Value</th>
                    <th className="px-3 py-2 text-right font-semibold text-ink-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((f, i) => (
                    <tr key={f.key} className={i % 2 ? 'bg-ink-50/30' : ''}>
                      <td className="px-3 py-2 font-mono text-[11px] text-ink-800">{f.key}</td>
                      <td className="px-3 py-2 text-[12px] text-ink-600">{f.meta.description}</td>
                      <td className="px-3 py-2 text-right">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          f.source === 'override' ? 'bg-violet-100 text-violet-700' :
                          f.source === 'env' ? 'bg-blue-100 text-blue-700' :
                          'bg-ink-100 text-ink-600'
                        }`}>
                          {SOURCE_LABEL[f.source]}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          f.value ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {f.value ? 'ON' : 'OFF'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => toggle(f.key, !f.value)}
                            disabled={pending}
                            className="rounded-md border border-ink-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-ink-700 transition hover:border-ink-800 disabled:opacity-40"
                          >
                            {f.value ? 'Turn OFF' : 'Turn ON'}
                          </button>
                          {f.source === 'override' && (
                            <button
                              onClick={() => clear(f.key)}
                              disabled={pending}
                              className="rounded-md border border-ink-200 bg-white px-2.5 py-1 text-[11px] font-medium text-ink-500 transition hover:border-ink-800 hover:text-ink-800 disabled:opacity-40"
                              title="Clear override — falls back to env/default"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      <p className="mt-8 text-center text-[10px] text-ink-400">
        In-memory · resets on Vercel Fluid instance recycle · use env vars for persistence · getFlag() from any RSC/route
      </p>
    </div>
  );
}
