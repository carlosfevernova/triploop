'use client';
import { useEffect, useState } from 'react';

interface Change {
  actor_id: string;
  actor_email?: string;
  action: 'add' | 'remove' | 'move' | 'edit';
  stop_name?: string;
  at: number;
}

const ACTION_LABEL: Record<Change['action'], { en: string; es: string; emoji: string }> = {
  add:    { en: 'added', es: 'agregó', emoji: '➕' },
  remove: { en: 'removed', es: 'eliminó', emoji: '✕' },
  move:   { en: 'moved', es: 'movió', emoji: '↕' },
  edit:   { en: 'edited', es: 'editó', emoji: '✎' }
};

export function CollabToast({ change, isEs }: { change: Change | null; isEs?: boolean }){
  const [visible, setVisible] = useState<Change | null>(null);

  useEffect(() => {
    if(!change) return;
    setVisible(change);
    const t = setTimeout(() => setVisible(null), 3500);
    return () => clearTimeout(t);
  }, [change]);

  if(!visible) return null;

  const who = (visible.actor_email || 'Someone').split('@')[0];
  const label = ACTION_LABEL[visible.action];
  const verb = isEs ? label.es : label.en;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-pill border border-ink-200 bg-white px-4 py-2 text-xs shadow-card-hover animate-in fade-in slide-in-from-bottom-4"
    >
      <span aria-hidden className="mr-2">{label.emoji}</span>
      <strong className="font-semibold text-ink-900">{who}</strong>
      <span className="mx-1 text-ink-500">{verb}</span>
      {visible.stop_name && <span className="font-semibold text-ink-800">{visible.stop_name}</span>}
    </div>
  );
}
