'use client';
import { useEffect, useState } from 'react';

interface ProState {
  loading: boolean;
  isPro: boolean;
  isTrialing: boolean;
  adminOverride: boolean;
  cancelAtPeriodEnd: boolean;
  periodEnd: string | null;
  userId: string | null;
}

// Consulta /api/pro-status — respeta admin-cookie override.
// Cache 30s (server-side header) evita spam.
export function usePro(): ProState {
  const [state, setState] = useState<ProState>({
    loading: true, isPro: false, isTrialing: false, adminOverride: false,
    cancelAtPeriodEnd: false, periodEnd: null, userId: null
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch('/api/pro-status', { credentials: 'same-origin' });
        const data = await r.json();
        if(!mounted) return;
        setState({
          loading: false,
          isPro: !!data.isPro,
          isTrialing: data.status === 'trialing',
          adminOverride: !!data.adminOverride,
          cancelAtPeriodEnd: !!data.cancel_at_period_end,
          periodEnd: data.trial_end || null,
          userId: data.userId ?? null
        });
      } catch {
        if(mounted) setState((s) => ({ ...s, loading: false }));
      }
    })();
    return () => { mounted = false; };
  }, []);

  return state;
}
