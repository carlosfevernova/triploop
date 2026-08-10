'use client';
import { useEffect, useState } from 'react';
import { queueLength, flushQueue } from '@/lib/itinerary/offline-queue';
import { L } from '@/lib/l4';

// S46 P5: Badge indicador de mutaciones offline pendientes.
// S71k: 4-locale. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
interface Props {
  locale: string;
  onFlushed?: () => void;
}

export function OfflineQueueBadge({ locale, onFlushed }: Props){
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [pending, setPending] = useState(0);
  const [flushing, setFlushing] = useState(false);

  useEffect(() => {
    const updateOnline = () => setOnline(navigator.onLine);
    const updateCount = () => setPending(queueLength());
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);
    const timer = setInterval(updateCount, 3000);
    updateCount();
    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if(online && pending > 0 && !flushing){
      setFlushing(true);
      flushQueue().then(() => {
        setPending(queueLength());
        onFlushed?.();
      }).finally(() => setFlushing(false));
    }
  }, [online, pending, flushing, onFlushed]);

  if(online && pending === 0) return null;

  const offlineText = L(locale, {
    en: `📡 Offline · ${pending} pending`,
    es: `📡 Offline · ${pending} pendiente${pending !== 1 ? 's' : ''}`,
    pt: `📡 Offline · ${pending} pendente${pending !== 1 ? 's' : ''}`,
    de: `📡 Offline · ${pending} ausstehend`
  });
  const syncingText = L(locale, {
    en: `⟳ Syncing ${pending}…`,
    es: `⟳ Sincronizando ${pending}…`,
    pt: `⟳ Sincronizando ${pending}…`,
    de: `⟳ Synchronisiere ${pending}…`
  });
  const toSyncText = L(locale, {
    en: `⟳ ${pending} to sync`,
    es: `⟳ ${pending} por sincronizar`,
    pt: `⟳ ${pending} para sincronizar`,
    de: `⟳ ${pending} zu synchronisieren`
  });

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[10px] font-semibold ${
      !online ? 'bg-amber-100 text-amber-800' : 'bg-ocean-100 text-ocean-800'
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${!online ? 'bg-amber-500 animate-pulse' : 'bg-ocean-500'}`} />
      {!online ? offlineText : (flushing ? syncingText : toSyncText)}
    </div>
  );
}
