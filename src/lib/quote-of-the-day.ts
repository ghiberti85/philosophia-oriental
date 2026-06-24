import { philosophers } from '@/data/philosophers';
import type { Philosopher, Quote } from '@/data/types';

/**
 * Deterministically picks one quote for a given date, cycling through every
 * quote of every philosopher. Same date → same quote for all visitors.
 */
export function quoteOfTheDay(date: Date = new Date()): { quote: Quote; philosopher: Philosopher } {
  const all = philosophers.flatMap((philosopher) =>
    philosopher.quotes.map((quote) => ({ quote, philosopher })),
  );
  // Days since the Unix epoch (UTC) keeps the rotation stable across timezones.
  const dayIndex = Math.floor(date.getTime() / 86_400_000);
  return all[((dayIndex % all.length) + all.length) % all.length];
}
