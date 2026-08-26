import { describe, it, expect } from 'vitest';
import { L } from '@/lib/l4';

describe('L() — locale dictionary helper', () => {
  const dict = {
    en: 'Trip',
    es: 'Viaje',
    pt: 'Viagem',
    de: 'Reise'
  };

  it('returns the correct string for each supported locale', () => {
    expect(L('en', dict)).toBe('Trip');
    expect(L('es', dict)).toBe('Viaje');
    expect(L('pt', dict)).toBe('Viagem');
    expect(L('de', dict)).toBe('Reise');
  });

  it('falls back to en for unknown locale', () => {
    expect(L('fr', dict)).toBe('Trip');
    expect(L('', dict)).toBe('Trip');
    expect(L('zh-CN', dict)).toBe('Trip');
  });

  it('handles empty-string values', () => {
    const emptyEs = { en: 'Hi', es: '', pt: 'Olá', de: 'Hallo' };
    // Empty string is falsy but `??` uses nullish coalescing → empty string is preserved
    expect(L('es', emptyEs)).toBe('');
  });

  it('is safe with mixed-case locale keys — treats as unknown', () => {
    // L accepts any string; only exact lowercase 2-letter locales in dict match
    expect(L('EN', dict)).toBe('Trip'); // falls back to en
    expect(L('En', dict)).toBe('Trip');
  });
});
