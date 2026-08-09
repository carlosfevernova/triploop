'use client';
import { useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase-browser';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { ItineraryItem, TripDay } from './types';

// S46 P5 + S47 audit fix: self-echo filter.
// Cada mutación local marca el id con `markLocalMutation(id, ts)` — postgres_changes que llegue
// dentro de la ventana ECHO_WINDOW_MS con updated_at match se descarta.

const ECHO_WINDOW_MS = 3000;

interface Args {
  slug: string;
  enabled: boolean;
  onItemChange: (payload: { event: 'INSERT' | 'UPDATE' | 'DELETE'; item: ItineraryItem | null; oldItem: ItineraryItem | null }) => void;
  onDayChange: (payload: { event: 'INSERT' | 'UPDATE' | 'DELETE'; day: TripDay | null; oldDay: TripDay | null }) => void;
}

export function useItineraryRealtime({ slug, enabled, onItemChange, onDayChange }: Args){
  const channelRef = useRef<RealtimeChannel | null>(null);
  const localMutationsRef = useRef<Map<string, number>>(new Map()); // key: `item:${id}` | `day:${id}` → timestamp

  // Llamar ANTES de cada mutación local para que el postgres_changes se ignore
  const markLocalMutation = useCallback((kind: 'item' | 'day', id: number | string) => {
    localMutationsRef.current.set(`${kind}:${id}`, Date.now());
    // Auto-cleanup entries > 30s
    if(localMutationsRef.current.size > 100){
      const cutoff = Date.now() - 30_000;
      for(const [k, t] of localMutationsRef.current){
        if(t < cutoff) localMutationsRef.current.delete(k);
      }
    }
  }, []);

  const isSelfEcho = useCallback((kind: 'item' | 'day', id: number | string): boolean => {
    const key = `${kind}:${id}`;
    const ts = localMutationsRef.current.get(key);
    if(!ts) return false;
    const age = Date.now() - ts;
    if(age > ECHO_WINDOW_MS){ localMutationsRef.current.delete(key); return false; }
    return true;
  }, []);

  useEffect(() => {
    if(!enabled || !slug) return;
    const sb = createClient();
    const channel = sb.channel(`itinerary:${slug}`);

    channel.on('postgres_changes', {
      event: '*', schema: 'public', table: 'itinerary_items',
      filter: `trip_slug=eq.${slug}`
    }, (payload) => {
      const newItem = (payload.new as ItineraryItem) || null;
      const oldItem = (payload.old as ItineraryItem) || null;
      const id = newItem?.id ?? oldItem?.id;
      if(id != null && isSelfEcho('item', id)) return; // skip self-echo
      onItemChange({
        event: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
        item: newItem, oldItem
      });
    });

    channel.on('postgres_changes', {
      event: '*', schema: 'public', table: 'trip_days',
      filter: `trip_slug=eq.${slug}`
    }, (payload) => {
      const newDay = (payload.new as TripDay) || null;
      const oldDay = (payload.old as TripDay) || null;
      const id = newDay?.id ?? oldDay?.id;
      if(id != null && isSelfEcho('day', id)) return;
      onDayChange({
        event: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
        day: newDay, oldDay
      });
    });

    channel.subscribe();
    channelRef.current = channel;
    return () => {
      channel.unsubscribe();
      sb.removeChannel(channel);
      channelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, enabled]);

  return { markLocalMutation };
}
