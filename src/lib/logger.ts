// Structured logger — JSON to stdout (Vercel picks up), typed levels, optional Sentry.
//
// Design:
//   - JSON single line per event (parseable by Vercel Log Drains / Datadog / Grafana Loki)
//   - Sentry auto-forwards ERROR level if @sentry/nextjs installed + SENTRY_DSN set
//   - Zero deps by default (Sentry is dynamic import, silent no-op if missing)
//   - Correlation via optional `traceId` field (RFC 4122 UUID) for cross-request grouping
//
// Usage:
//   import { logger } from '@/lib/logger';
//   logger.info('trip.generated', { slug, provider: 'openrouter', latency_ms: 1234 });
//   logger.error('ai.fallback_exhausted', { attempts: 5, lastError: err.message });

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

interface LogEntry {
  ts: string;
  level: LogLevel;
  event: string;
  msg?: string;
  [key: string]: unknown;
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  fatal: 50
};

const CURRENT_LEVEL: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) ||
  (process.env.VERCEL_ENV === 'production' ? 'info' : 'debug');

const MIN_PRIORITY = LEVEL_PRIORITY[CURRENT_LEVEL] ?? 20;

// Sentry — dynamic import (zero-dep default; opt-in via @sentry/nextjs install)
let sentryLoaded = false;
let sentryCaptureException: ((e: unknown, ctx?: Record<string, unknown>) => void) | null = null;
let sentryCaptureMessage: ((m: string, level?: string) => void) | null = null;

async function ensureSentry(){
  if (sentryLoaded || !process.env.SENTRY_DSN) return;
  sentryLoaded = true;
  try {
    // @ts-expect-error — optional peer dep, may not be installed
    const Sentry = await import('@sentry/nextjs');
    sentryCaptureException = (e, ctx) => Sentry.captureException(e, { extra: ctx });
    sentryCaptureMessage = (m, level = 'error') => Sentry.captureMessage(m, level as never);
  } catch {
    // @sentry/nextjs not installed — silent no-op
  }
}

function emit(level: LogLevel, event: string, ctx?: Record<string, unknown>){
  if (LEVEL_PRIORITY[level] < MIN_PRIORITY) return;
  const entry: LogEntry = {
    ts: new Date().toISOString(),
    level,
    event,
    ...(ctx || {})
  };
  const serialized = JSON.stringify(entry);
  if (level === 'error' || level === 'fatal') {
    console.error(serialized);
    void ensureSentry().then(() => {
      if (ctx?.error instanceof Error) sentryCaptureException?.(ctx.error, entry);
      else sentryCaptureMessage?.(`${event}: ${entry.msg || ''}`.trim(), level);
    });
    return;
  }
  if (level === 'warn') { console.warn(serialized); return; }
  console.log(serialized);
}

export const logger = {
  debug: (event: string, ctx?: Record<string, unknown>) => emit('debug', event, ctx),
  info: (event: string, ctx?: Record<string, unknown>) => emit('info', event, ctx),
  warn: (event: string, ctx?: Record<string, unknown>) => emit('warn', event, ctx),
  error: (event: string, ctx?: Record<string, unknown>) => emit('error', event, ctx),
  fatal: (event: string, ctx?: Record<string, unknown>) => emit('fatal', event, ctx)
};

/**
 * Wrap an async operation with automatic error logging + optional latency tracking.
 * Returns the fn's result; re-throws on error after logging.
 */
export async function withLog<T>(
  event: string,
  fn: () => Promise<T>,
  ctx?: Record<string, unknown>
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    logger.info(event, { ...ctx, latency_ms: Date.now() - start, ok: true });
    return result;
  } catch (e) {
    logger.error(event, { ...ctx, latency_ms: Date.now() - start, ok: false, error: e });
    throw e;
  }
}
