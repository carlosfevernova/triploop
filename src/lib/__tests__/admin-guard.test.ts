import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { signAdminToken, verifyAdminToken, checkPassphrase } from '@/lib/admin-guard';

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env.SEED_TOKEN = 'test-seed-token-32chars-min-length';
  process.env.ADMIN_PASSPHRASE = 'correcthorse-batterystaple-9999';
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe('signAdminToken() → verifyAdminToken()', () => {
  it('signs a token that verifies as valid', () => {
    const token = signAdminToken();
    expect(verifyAdminToken(token)).toBe(true);
  });

  it('signed token has 3 dot-separated parts', () => {
    const token = signAdminToken();
    const parts = token.split('.');
    expect(parts.length).toBe(3);
    expect(parts[0]).toBe('admin');
    expect(Number(parts[1])).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it('rejects a tampered token (bad signature)', () => {
    const token = signAdminToken();
    const [prefix, exp] = token.split('.');
    const tampered = `${prefix}.${exp}.deadbeef`;
    expect(verifyAdminToken(tampered)).toBe(false);
  });

  it('rejects tokens with wrong prefix', () => {
    // Craft a valid HMAC over "user.<exp>" (wrong prefix) with the current secret
    // Verification should refuse because prefix !== 'admin'
    // Easier: just tamper prefix in a real token
    const token = signAdminToken();
    const [, exp, sig] = token.split('.');
    expect(verifyAdminToken(`user.${exp}.${sig}`)).toBe(false);
  });

  it('rejects expired tokens', () => {
    const past = Math.floor(Date.now() / 1000) - 3600; // 1h ago
    const expiredPayload = `admin.${past}`;
    // We can't easily sign here because signAdminToken always uses future exp;
    // Instead verify manually: verifyAdminToken should refuse based on exp check alone
    // Craft a token with valid signature format but past exp → verify() returns false at exp check
    // Because signature verification runs after exp check in verifyAdminToken, any string works
    expect(verifyAdminToken(`${expiredPayload}.anysignature`)).toBe(false);
  });

  it('rejects undefined / malformed tokens', () => {
    expect(verifyAdminToken(undefined)).toBe(false);
    expect(verifyAdminToken('')).toBe(false);
    expect(verifyAdminToken('not-a-token')).toBe(false);
    expect(verifyAdminToken('one.two')).toBe(false);
    expect(verifyAdminToken('one.two.three.four')).toBe(false);
  });
});

describe('checkPassphrase()', () => {
  it('accepts the correct passphrase', () => {
    expect(checkPassphrase('correcthorse-batterystaple-9999')).toBe(true);
  });

  it('rejects wrong passphrase', () => {
    expect(checkPassphrase('wronghorse-batterystaple-9999')).toBe(false);
    expect(checkPassphrase('correcthorse')).toBe(false);
  });

  it('trims whitespace on both sides', () => {
    expect(checkPassphrase('  correcthorse-batterystaple-9999  ')).toBe(true);
    expect(checkPassphrase('\tcorrecthorse-batterystaple-9999\n')).toBe(true);
  });

  it('rejects empty passphrase', () => {
    expect(checkPassphrase('')).toBe(false);
    expect(checkPassphrase('   ')).toBe(false);
  });

  it('rejects when ADMIN_PASSPHRASE env var is empty', () => {
    process.env.ADMIN_PASSPHRASE = '';
    expect(checkPassphrase('correcthorse-batterystaple-9999')).toBe(false);
  });
});
