import { describe, expect, it } from 'vitest';
import { mulberry32, sample, shuffle } from './random';

describe('shuffle', () => {
  it('returns a permutation without mutating the input', () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    const out = shuffle(input, mulberry32(42));
    expect(input).toEqual(copy); // unchanged
    expect([...out].sort((a, b) => a - b)).toEqual(copy);
  });

  it('is deterministic for a fixed seed', () => {
    expect(shuffle([1, 2, 3, 4, 5], mulberry32(7))).toEqual(
      shuffle([1, 2, 3, 4, 5], mulberry32(7)),
    );
  });
});

describe('sample', () => {
  it('draws the requested number of distinct items', () => {
    const out = sample([1, 2, 3, 4, 5], 3, mulberry32(1));
    expect(out).toHaveLength(3);
    expect(new Set(out).size).toBe(3);
  });

  it('throws when asked for more than the pool holds', () => {
    expect(() => sample([1, 2], 5)).toThrow(RangeError);
  });
});

describe('mulberry32', () => {
  it('produces values in [0, 1)', () => {
    const rng = mulberry32(123);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
