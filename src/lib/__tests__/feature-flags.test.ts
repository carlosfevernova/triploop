import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getFlag,
  setFlag,
  clearFlag,
  getAllFlags,
  parseFlagEnv,
  FLAG_META,
  type FlagKey
} from '@/lib/feature-flags';

const TEST_KEY: FlagKey = 'ai_streaming_enabled';

describe('parseFlagEnv()', () => {
  it('parses truthy values', () => {
    expect(parseFlagEnv('true')).toBe(true);
    expect(parseFlagEnv('TRUE')).toBe(true);
    expect(parseFlagEnv('1')).toBe(true);
    expect(parseFlagEnv('on')).toBe(true);
    expect(parseFlagEnv('YES')).toBe(true);
  });

  it('parses falsy values', () => {
    expect(parseFlagEnv('false')).toBe(false);
    expect(parseFlagEnv('FALSE')).toBe(false);
    expect(parseFlagEnv('0')).toBe(false);
    expect(parseFlagEnv('off')).toBe(false);
    expect(parseFlagEnv('NO')).toBe(false);
  });

  it('returns undefined for unrecognized or missing values', () => {
    expect(parseFlagEnv(undefined)).toBeUndefined();
    expect(parseFlagEnv('')).toBeUndefined();
    expect(parseFlagEnv('maybe')).toBeUndefined();
    expect(parseFlagEnv('null')).toBeUndefined();
  });
});

describe('getFlag() / setFlag() / clearFlag()', () => {
  beforeEach(() => {
    // Ensure clean state — no overrides from other tests
    FLAG_META.forEach((f) => clearFlag(f.key));
    // Ensure no env var override affects tests
    const envKey = `NEXT_PUBLIC_FLAG_${TEST_KEY.toUpperCase()}`;
    delete process.env[envKey];
  });

  afterEach(() => {
    FLAG_META.forEach((f) => clearFlag(f.key));
  });

  it('returns the default value when no override or env var set', () => {
    const defaultMeta = FLAG_META.find((f) => f.key === TEST_KEY)!;
    expect(getFlag(TEST_KEY)).toBe(defaultMeta.default);
  });

  it('setFlag() applies in-memory override', () => {
    setFlag(TEST_KEY, false);
    expect(getFlag(TEST_KEY)).toBe(false);
    setFlag(TEST_KEY, true);
    expect(getFlag(TEST_KEY)).toBe(true);
  });

  it('setFlag() returns previous value', () => {
    setFlag(TEST_KEY, true);
    const prev = setFlag(TEST_KEY, false);
    expect(prev).toBe(true);
  });

  it('clearFlag() restores default when no env var set', () => {
    setFlag(TEST_KEY, false);
    expect(getFlag(TEST_KEY)).toBe(false);
    clearFlag(TEST_KEY);
    const defaultMeta = FLAG_META.find((f) => f.key === TEST_KEY)!;
    expect(getFlag(TEST_KEY)).toBe(defaultMeta.default);
  });

  it('env var overrides default but override takes highest priority', () => {
    const envKey = `NEXT_PUBLIC_FLAG_${TEST_KEY.toUpperCase()}`;
    // env says OFF
    process.env[envKey] = 'false';
    expect(getFlag(TEST_KEY)).toBe(false);
    // override says ON — should win
    setFlag(TEST_KEY, true);
    expect(getFlag(TEST_KEY)).toBe(true);
    // clear override → env value again
    clearFlag(TEST_KEY);
    expect(getFlag(TEST_KEY)).toBe(false);
    // clean up
    delete process.env[envKey];
  });
});

describe('getAllFlags()', () => {
  beforeEach(() => {
    FLAG_META.forEach((f) => clearFlag(f.key));
  });

  it('returns one entry per declared flag with correct source', () => {
    const all = getAllFlags();
    expect(all.length).toBe(FLAG_META.length);
    for (const flag of all) {
      expect(FLAG_META.some((m) => m.key === flag.key)).toBe(true);
      expect(['override', 'env', 'default']).toContain(flag.source);
      expect(typeof flag.value).toBe('boolean');
      expect(flag.meta.description.length).toBeGreaterThan(0);
    }
  });

  it('marks flags with in-memory overrides as source=override', () => {
    setFlag(TEST_KEY, false);
    const found = getAllFlags().find((f) => f.key === TEST_KEY);
    expect(found?.source).toBe('override');
    expect(found?.value).toBe(false);
    clearFlag(TEST_KEY);
  });
});
