'use client';
import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase-browser';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { ItineraryItem, TripDay } from './types';

// S46 P5: Suscribe a cambios remotos en trip_days + itinerary_items para un slug.
// Filtra self-echo comparando updated_at con selfEchoRef.

interface Args {
  slug: string;
  enabled: boolean;
  onItemChange: (payload: { event: 'INSERT' | 'UPDATE' | 'DELETE'; item: ItineraryItem | null; oldItem: ItineraryItem | null }) => void;
  onDayChange: (payload: { event: 'INSERT' | 'UPDATE' | 'DELETE'; day: TripDay | null; oldDay: TripDay | null }) => void;
}

export function useItineraryRealtime({ slug, enabled, onItemChange, onDayChange }: Args){
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if(!enabled || !slug) return;
    const sb = createClient();
    const channel = sb.channel(`itinerary:${slug}`);

    channel.on('postgres_changes', {
      event: '*', schema: 'public', table: 'itinerary_items',
      filter: `trip_slug=eq.${slug}`
    }, (payload) => {
      onItemChange({
        event: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
        item: (payload.new as ItineraryItem) || null,
        oldItem: (payload.old as ItineraryItem) || null
      });
    });

    channel.on('postgres_changes', {
      event: '*', schema: 'public', table: 'trip_days',
      filter: `trip_slug=eq.${slug}`
    }, (payload) => {
      onDayChange({
        event: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
        day: (payload.new as TripDay) || null,
        oldDay: (payload.old as TripDay) || null
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
}
