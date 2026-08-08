'use client';
import { useEffect } from 'react';

export function ViewTracker({ slug, locale }: { slug: string; locale: string }){
  useEffect(() => {
    try {
      fetch('/api/analytics/template-view', {
        method: 'POST',
        keepalive: true,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug, locale })
      }).catch(() => {});
    } catch { /* ignore */ }
  }, [slug, locale]);
  return null;
}
