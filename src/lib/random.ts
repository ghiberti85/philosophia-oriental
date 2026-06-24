/**
 * Random utilities used by the quiz engine and the graph layout.
 *
 * All functions accept an optional `rng` so behaviour can be made
 * deterministic in tests (and could later support seeded daily challenges).
 */

export type Rng = () => number;

/** Fisher–Yates shuffle. Returns a new array, never mutates the input. */
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Picks `count` distinct elements at random. Throws if `count` exceeds pool size. */
export function sample<T>(items: readonly T[], count: number, rng: Rng = Math.random): T[] {
  if (count > items.length) {
    throw new RangeError(`Cannot sample ${count} items from a pool of ${items.length}`);
  }
  return shuffle(items, rng).slice(0, count);
}

/** Simple deterministic PRNG (mulberry32) for seeded behaviour in tests and layouts. */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
