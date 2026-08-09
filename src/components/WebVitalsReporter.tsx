'use client';
import { useEffect } from 'react';

// S42 P1: Web Vitals RUM reporter.
// Loads web-vitals dynamically only when browser supports it.
// Envía cada metric a /api/analytics/vitals con navigator.sendBeacon (no bloquea unload).

interface Metric {
  name: string;
  value: number;
  id: string;
  navigationType?: string;
}

function send(metric: Metric){
  try {
    const payload = JSON.stringify({
      name: metric.name,
      value: metric.value,
      id: metric.id,
      navigationType: metric.navigationType,
      path: window.location.pathname,
      locale: window.location.pathname.startsWith('/es') ? 'es' : 'en'
    });
    if(navigator.sendBeacon){
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/vitals', blob);
    } else {
      fetch('/api/analytics/vitals', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(() => {});
    }
  } catch { /* silent */ }
}

export function WebVitalsReporter(){
  useEffect(() => {
    // Dynamic import web-vitals para no cargar en initial bundle
    import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
      onCLS(send);
      onINP(send);
      onLCP(send);
      onFCP(send);
      onTTFB(send);
    }).catch(() => { /* web-vitals not installed yet */ });
  }, []);
  return null;
}
