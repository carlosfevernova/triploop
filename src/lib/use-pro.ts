'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { isProSubscription, type SubscriptionRow } from '@/lib/stripe-config';

interface ProState {
  loading: boolean;
  isPro: boolean;
  isTrialing: boolean;
  cancelAtPeriodEnd: boolean;
  periodEnd: string | null;
  userId: string | null;
  sub: SubscriptionRow | null;
}

export function usePro(): ProState {
  const [state, setState] = useState<ProState>({
    loading: true, isPro: false, isTrialing: false, cancelAtPeriodEnd: false,
    periodEnd: null, userId: null, sub: null
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      if(!user){
        if(mounted) setState({ loading: false, isPro: false, isTrialing: false, cancelAtPeriodEnd: false, periodEnd: null, userId: null, sub: null });
        return;
      }
      const { data: sub } = await sb.from('subscriptions').select('*').eq('user_id', user.id).maybeSingle();
      if(!mounted) return;
      const s = sub as SubscriptionRow | null;
      setState({
        loading: false,
        isPro: isProSubscription(s),
        isTrialing: s?.status === 'trialing',
        cancelAtPeriodEnd: !!s?.cancel_at_period_end,
        periodEnd: s?.current_period_end || null,
        userId: user.id,
        sub: s
      });
    })();
    return () => { mounted = false; };
  }, []);

  return state;
}
