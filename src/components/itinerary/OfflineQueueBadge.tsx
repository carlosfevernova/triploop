'use client';
import { useEffect, useState } from 'react';
import { queueLength, flushQueue } from '@/lib/itinerary/offline-queue';

// S46 P5: Badge indicador de mutaciones offline pendientes.
// Auto-flush al detectar online. Poll length cada 3s (barato, localStorage).

interface Props {
  locale: 'en' | 'es';
  onFlushed?: () => void;
}

export function OfflineQueueBadge({ locale, onFlushed }: Props){
  const isEs = locale === 'es';
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

  // Auto-flush cuando volvemos online
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

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[10px] font-semibold ${
      !online ? 'bg-amber-100 text-amber-800' : 'bg-ocean-100 text-ocean-800'
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${!online ? 'bg-amber-500 animate-pulse' : 'bg-ocean-500'}`} />
      {!online
        ? (isEs ? `📡 Offline · ${pending} pendiente${pending !== 1 ? 's' : ''}` : `📡 Offline · ${pending} pending`)
        : (flushing
          ? (isEs ? `⟳ Sincronizando ${pending}…` : `⟳ Syncing ${pending}…`)
          : (isEs ? `⟳ ${pending} por sincronizar` : `⟳ ${pending} to sync`))
      }
    </div>
  );
}
