import { describe, expect, it } from 'vitest';
import { quoteOfTheDay } from './quote-of-the-day';

describe('quoteOfTheDay', () => {
  it('returns the same quote for the same date', () => {
    const date = new Date('2026-06-23T12:00:00Z');
    expect(quoteOfTheDay(date)).toEqual(quoteOfTheDay(date));
  });

  it('returns a fully formed quote and philosopher', () => {
    const { quote, philosopher } = quoteOfTheDay(new Date('2026-01-01T00:00:00Z'));
    expect(quote.text.en).toBeTruthy();
    expect(quote.text.pt).toBeTruthy();
    expect(philosopher.slug).toBeTruthy();
  });
});
