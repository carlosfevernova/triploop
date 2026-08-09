// S46 P5: Offline mutation queue vía localStorage (simple, no IDB).
// Cuando navigator.onLine === false, encolamos POST/PATCH/DELETE.
// Al detectar online, hacemos flush FIFO. Idempotencia via id local timestamp.

export interface QueuedMutation {
  id: string;                     // ts_random
  method: 'POST' | 'PATCH' | 'DELETE';
  url: string;
  body?: unknown;
  createdAt: number;
  retries: number;
}

const KEY = 'triploop_itinerary_queue_v1';

function readQueue(): QueuedMutation[] {
  if(typeof localStorage === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

function writeQueue(q: QueuedMutation[]){
  if(typeof localStorage === 'undefined') return;
  try { localStorage.setItem(KEY, JSON.stringify(q)); } catch { /* quota */ }
}

export function enqueue(m: Omit<QueuedMutation, 'id' | 'createdAt' | 'retries'>): string {
  const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const queue = readQueue();
  queue.push({ ...m, id, createdAt: Date.now(), retries: 0 });
  writeQueue(queue);
  return id;
}

export function queueLength(): number {
  return readQueue().length;
}

export function clearQueue(){
  writeQueue([]);
}

export async function flushQueue(): Promise<{ succeeded: number; failed: number }> {
  const queue = readQueue();
  if(queue.length === 0) return { succeeded: 0, failed: 0 };
  const remaining: QueuedMutation[] = [];
  let succeeded = 0;
  let failed = 0;

  for(const m of queue){
    try {
      const r = await fetch(m.url, {
        method: m.method,
        headers: m.body ? { 'content-type': 'application/json' } : undefined,
        body: m.body ? JSON.stringify(m.body) : undefined,
        credentials: 'same-origin'
      });
      if(r.ok){ succeeded++; continue; }
      // 4xx: dropear (retry no ayuda)
      if(r.status >= 400 && r.status < 500){ failed++; continue; }
      // 5xx / network: reintentar
      remaining.push({ ...m, retries: m.retries + 1 });
      failed++;
    } catch {
      remaining.push({ ...m, retries: m.retries + 1 });
      failed++;
    }
    // Cap: dropear si retries > 5
    if(m.retries >= 5){ remaining.pop(); }
  }

  writeQueue(remaining);
  return { succeeded, failed };
}

// Wrapper: si offline, encola; si online, ejecuta directo. Retorna promesa que resuelve inmediato si offline.
export async function fetchOrQueue(url: string, opts: { method: 'POST' | 'PATCH' | 'DELETE'; body?: unknown }): Promise<{ queued: boolean; ok: boolean; data?: unknown; error?: string }> {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  if(!isOnline){
    enqueue({ method: opts.method, url, body: opts.body });
    return { queued: true, ok: true };
  }
  try {
    const r = await fetch(url, {
      method: opts.method,
      headers: opts.body ? { 'content-type': 'application/json' } : undefined,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      credentials: 'same-origin'
    });
    const data = await r.json().catch(() => null);
    if(!r.ok){
      // Si servidor falla, encolar para retry
      enqueue({ method: opts.method, url, body: opts.body });
      return { queued: true, ok: false, error: (data && typeof data === 'object' && 'error' in data ? String(data.error) : `http_${r.status}`) };
    }
    return { queued: false, ok: true, data };
  } catch (e) {
    // Network error: encolar
    enqueue({ method: opts.method, url, body: opts.body });
    return { queued: true, ok: false, error: (e as Error).message };
  }
}
