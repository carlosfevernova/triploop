// S42 P1: AI cost tracking por provider (structured log to DB).
// Cada llamada AI registra latency, tokens, provider, model, cost estimado.
// Query: SELECT provider, count(*), avg(latency_ms), sum(estimated_cost_usd) FROM ai_calls GROUP BY provider.

import { createAdminClient } from './supabase-admin';

export interface AICallLog {
  endpoint: string;              // 'generate-trip', 'insights', 'checklist', etc
  provider: string;              // 'openrouter/gemma-4-26b', 'fireworks/deepseek', 'curated', 'cache'
  model?: string;
  latency_ms: number;
  input_tokens?: number;
  output_tokens?: number;
  estimated_cost_usd?: number;
  success: boolean;
  fallback_count?: number;       // cuántos providers intentamos antes de éxito
  error_category?: string;       // 'timeout', 'rate_limit', 'invalid_json', 'no_key'
  source?: 'cache' | 'curated' | 'ai';
  metadata?: Record<string, unknown>;
}

// Precios OpenRouter free 2026-08 (aproximados, free tier = $0 pero contamos tokens para observability)
const PRICE_PER_1M_TOKENS: Record<string, { input: number; output: number }> = {
  'openrouter/google/gemma-4-26b-a4b-it:free': { input: 0, output: 0 },
  'openrouter/openai/gpt-oss-20b:free': { input: 0, output: 0 },
  'openrouter/nvidia/nemotron-3-super-120b-a12b:free': { input: 0, output: 0 },
  'fireworks/deepseek-v3': { input: 0.14, output: 0.28 },
  'groq/llama-3.3-70b': { input: 0.59, output: 0.79 },
  'anthropic/claude-haiku-4.5': { input: 1.00, output: 5.00 },
  'default': { input: 0, output: 0 }
};

export function estimateCost(provider: string, inputTokens = 0, outputTokens = 0): number {
  const rate = PRICE_PER_1M_TOKENS[provider] || PRICE_PER_1M_TOKENS.default;
  return (inputTokens * rate.input + outputTokens * rate.output) / 1_000_000;
}

// Soft-fail: si tabla ai_call_log no existe, se logea a console y sigue.
// Migration 018 pending creará la tabla.
export async function logAICall(log: AICallLog): Promise<void> {
  const enriched = {
    ...log,
    estimated_cost_usd: log.estimated_cost_usd ?? estimateCost(log.provider, log.input_tokens, log.output_tokens),
    created_at: new Date().toISOString()
  };
  // Structured console log siempre (Vercel logs pickup)
  try { console.log('[ai-call]', JSON.stringify(enriched)); } catch {}
  // DB persist (soft-fail)
  try {
    const sb = createAdminClient();
    await sb.from('ai_call_log').insert(enriched);
  } catch { /* migration 018 pending, no bloquear */ }
}

// Helper para wrappear un AI call y trackear automáticamente
export async function trackedAICall<T>(
  meta: Pick<AICallLog, 'endpoint' | 'provider' | 'model'>,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    void logAICall({ ...meta, latency_ms: Date.now() - start, success: true });
    return result;
  } catch (e) {
    void logAICall({
      ...meta,
      latency_ms: Date.now() - start,
      success: false,
      error_category: (e as Error).message.slice(0, 100)
    });
    throw e;
  }
}
