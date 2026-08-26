import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  // Reset log level per-test — module reads env at import time so re-import per test
  vi.resetModules();
  process.env.LOG_LEVEL = 'debug';
  delete process.env.SENTRY_DSN;
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.restoreAllMocks();
});

describe('logger', () => {
  it('emits JSON single-line to console.log for info/debug', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { logger } = await import('@/lib/logger');
    logger.info('test.event', { foo: 'bar' });
    expect(spy).toHaveBeenCalledOnce();
    const entry = JSON.parse(spy.mock.calls[0][0] as string);
    expect(entry.level).toBe('info');
    expect(entry.event).toBe('test.event');
    expect(entry.foo).toBe('bar');
    expect(entry.ts).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('emits error entries to console.error', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { logger } = await import('@/lib/logger');
    logger.error('boom', { detail: 'nope' });
    expect(errSpy).toHaveBeenCalledOnce();
    expect(logSpy).not.toHaveBeenCalled();
    const entry = JSON.parse(errSpy.mock.calls[0][0] as string);
    expect(entry.level).toBe('error');
    expect(entry.event).toBe('boom');
    expect(entry.detail).toBe('nope');
  });

  it('emits warn entries to console.warn', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { logger } = await import('@/lib/logger');
    logger.warn('slow', { latency_ms: 5000 });
    expect(warnSpy).toHaveBeenCalledOnce();
    const entry = JSON.parse(warnSpy.mock.calls[0][0] as string);
    expect(entry.level).toBe('warn');
    expect(entry.latency_ms).toBe(5000);
  });

  it('filters below LOG_LEVEL threshold', async () => {
    process.env.LOG_LEVEL = 'warn';
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { logger } = await import('@/lib/logger');
    logger.debug('should.filter');
    logger.info('should.filter');
    logger.warn('should.pass');
    expect(logSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledOnce();
  });
});

describe('withLog()', () => {
  it('logs success with latency_ms and ok=true', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { withLog } = await import('@/lib/logger');
    const result = await withLog('op.success', async () => 42);
    expect(result).toBe(42);
    expect(logSpy).toHaveBeenCalledOnce();
    const entry = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(entry.event).toBe('op.success');
    expect(entry.ok).toBe(true);
    expect(typeof entry.latency_ms).toBe('number');
    expect(entry.latency_ms).toBeGreaterThanOrEqual(0);
  });

  it('logs failure with ok=false and re-throws', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { withLog } = await import('@/lib/logger');
    await expect(withLog('op.fail', async () => { throw new Error('boom'); })).rejects.toThrow('boom');
    expect(errSpy).toHaveBeenCalledOnce();
    const entry = JSON.parse(errSpy.mock.calls[0][0] as string);
    expect(entry.event).toBe('op.fail');
    expect(entry.ok).toBe(false);
  });

  it('merges provided context with auto fields', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { withLog } = await import('@/lib/logger');
    await withLog('op.ctx', async () => 'x', { user_id: 'u1', trip_slug: 't1' });
    const entry = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(entry.user_id).toBe('u1');
    expect(entry.trip_slug).toBe('t1');
    expect(entry.ok).toBe(true);
  });
});
