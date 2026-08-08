'use client';
import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { Trip } from '@/lib/types';

export interface PresenceUser {
  user_id: string;
  email?: string;
  color: string;
  joined_at: number;
}

interface RemoteChange {
  actor_id: string;
  actor_email?: string;
  action: 'add' | 'remove' | 'move' | 'edit';
  stop_name?: string;
  at: number;
}

interface UseTripRealtimeArgs {
  slug: string;
  currentUserId: string | null;
  currentUserEmail?: string | null;
  enabled: boolean;
  onRemoteTripUpdate: (updates: Partial<Trip>) => void;
}

const AVATAR_COLORS = ['#FF5A5F', '#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

function hashColor(id: string): string {
  let h = 0;
  for(let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

export function useTripRealtime({ slug, currentUserId, currentUserEmail, enabled, onRemoteTripUpdate }: UseTripRealtimeArgs){
  const [presence, setPresence] = useState<PresenceUser[]>([]);
  const [lastRemoteChange, setLastRemoteChange] = useState<RemoteChange | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if(!enabled || !slug) return;
    const sb = createClient();
    const channel = sb.channel(`trip:${slug}`, {
      config: { presence: { key: currentUserId || 'anon' } }
    });

    // 1) Presence: track other users viewing this trip
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const users: PresenceUser[] = [];
      for(const key in state){
        const rows = state[key] as Array<{ user_id?: string; email?: string; joined_at?: number }>;
        const row = rows[0];
        if(row?.user_id && row.user_id !== currentUserId){
          users.push({
            user_id: row.user_id,
            email: row.email,
            color: hashColor(row.user_id),
            joined_at: row.joined_at || Date.now()
          });
        }
      }
      setPresence(users);
    });

    // 2) Postgres changes: sync remote stop updates
    channel.on('postgres_changes', {
      event: 'UPDATE', schema: 'public', table: 'trips',
      filter: `slug=eq.${slug}`
    }, (payload) => {
      const newRow = payload.new as Trip & { updated_at?: string };
      // Ignorar self-echo: check payload.old.updated_at vs new (broadcast también nos llega)
      onRemoteTripUpdate({
        stops: newRow.stops,
        route_geometry: newRow.route_geometry,
        total_distance_m: newRow.total_distance_m,
        total_duration_s: newRow.total_duration_s,
        title: newRow.title
      });
    });

    // 3) Broadcast: notifications de acciones específicas ("User added Stop X")
    channel.on('broadcast', { event: 'change' }, (payload) => {
      const change = payload.payload as RemoteChange;
      if(change.actor_id === currentUserId) return; // Ignore self
      setLastRemoteChange(change);
    });

    channel.subscribe(async (status) => {
      if(status === 'SUBSCRIBED' && currentUserId){
        await channel.track({
          user_id: currentUserId,
          email: currentUserEmail,
          joined_at: Date.now()
        });
      }
    });

    channelRef.current = channel;
    return () => {
      channel.unsubscribe();
      sb.removeChannel(channel);
      channelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, currentUserId, enabled]);

  // Broadcast helper
  const broadcastChange = (action: RemoteChange['action'], stop_name?: string) => {
    const ch = channelRef.current;
    if(!ch || !currentUserId) return;
    ch.send({
      type: 'broadcast', event: 'change',
      payload: { actor_id: currentUserId, actor_email: currentUserEmail || undefined, action, stop_name, at: Date.now() } satisfies RemoteChange
    });
  };

  return { presence, lastRemoteChange, broadcastChange };
}
