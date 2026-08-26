import { describe, it, expect } from 'vitest';
import { estimateCost } from '@/lib/ai-cost-tracker';

describe('estimateCost()', () => {
  it('returns 0 for free OpenRouter tier', () => {
    expect(estimateCost('openrouter/google/gemma-4-26b-a4b-it:free', 1000, 1000)).toBe(0);
    expect(estimateCost('openrouter/openai/gpt-oss-20b:free', 5000, 5000)).toBe(0);
  });

  it('calculates non-zero cost for Fireworks DeepSeek', () => {
    // Fireworks deepseek-v3: input 0.14 / output 0.28 per 1M tokens
    const cost = estimateCost('fireworks/deepseek-v3', 1_000_000, 1_000_000);
    expect(cost).toBeCloseTo(0.42, 5); // 0.14 + 0.28
  });

  it('calculates cost for Groq Llama 3.3', () => {
    // Groq llama-3.3-70b: input 0.59 / output 0.79 per 1M tokens
    const cost = estimateCost('groq/llama-3.3-70b', 500_000, 500_000);
    // (500k × 0.59 + 500k × 0.79) / 1M = 0.295 + 0.395 = 0.69
    expect(cost).toBeCloseTo(0.69, 5);
  });

  it('calculates cost for Anthropic Haiku 4.5', () => {
    // anthropic/claude-haiku-4.5: input 1.00 / output 5.00 per 1M tokens
    const cost = estimateCost('anthropic/claude-haiku-4.5', 100_000, 10_000);
    // (100k × 1.00 + 10k × 5.00) / 1M = 0.1 + 0.05 = 0.15
    expect(cost).toBeCloseTo(0.15, 5);
  });

  it('falls back to $0 pricing for unknown provider', () => {
    expect(estimateCost('unknown/foo-bar', 1_000_000, 1_000_000)).toBe(0);
    expect(estimateCost('brand-new-model', 500_000, 500_000)).toBe(0);
  });

  it('handles zero tokens gracefully', () => {
    expect(estimateCost('groq/llama-3.3-70b', 0, 0)).toBe(0);
    expect(estimateCost('fireworks/deepseek-v3', 0, 0)).toBe(0);
  });

  it('handles missing token args (defaults to 0)', () => {
    expect(estimateCost('fireworks/deepseek-v3')).toBe(0);
    expect(estimateCost('anthropic/claude-haiku-4.5')).toBe(0);
  });
});
