'use client';
import { useEffect, useState } from 'react';

export function OfflineBanner(){
  const [online, setOnline] = useState(true);

  useEffect(() => {
    if(typeof navigator === 'undefined') return;
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  if(online) return null;

  return (
    <div className="sticky top-0 z-40 border-b border-amber-300 bg-amber-100 px-4 py-2 text-center text-xs font-semibold text-amber-900">
      📡 You&apos;re offline — showing saved trips and cached maps.
    </div>
  );
}
