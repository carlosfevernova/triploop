// S29: prompt cache LRU in-memory. Hit → 0ms 0 tokens.
// Se comparte entre invocaciones warm de la misma serverless instance.

const MAX_ENTRIES = 100;
const TTL_MS = 60 * 60 * 1000; // 1 hora

interface CacheEntry<T> {
  value: T;
  ts: number;
}

const store = new Map<string, CacheEntry<unknown>>();
const order: string[] = [];

function hash(input: string): string {
  let h = 5381;
  for(let i = 0; i < input.length; i++){
    h = ((h << 5) + h) + input.charCodeAt(i);
    h |= 0;
  }
  return `p${Math.abs(h).toString(36)}`;
}

export function promptCacheGet<T>(prompt: string, locale: string, extraKey?: string): T | null {
  const key = hash(`${locale}:${extraKey || ''}:${prompt.toLowerCase().trim()}`);
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if(!entry) return null;
  if(Date.now() - entry.ts > TTL_MS){
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function promptCacheSet<T>(prompt: string, locale: string, value: T, extraKey?: string): void {
  const key = hash(`${locale}:${extraKey || ''}:${prompt.toLowerCase().trim()}`);
  if(store.has(key)){
    const idx = order.indexOf(key);
    if(idx >= 0) order.splice(idx, 1);
  } else if(order.length >= MAX_ENTRIES){
    const oldest = order.shift();
    if(oldest) store.delete(oldest);
  }
  store.set(key, { value, ts: Date.now() });
  order.push(key);
}

export function promptCacheStats(){
  return { size: store.size, oldest: order[0], newest: order[order.length - 1] };
}
