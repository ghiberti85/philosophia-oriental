import type { QuizQuestion } from '@/data/types';
import type { Locale } from '@/lib/i18n';
import { sample, shuffle, type Rng } from '@/lib/random';

export const QUESTIONS_PER_QUIZ = 5;

/** A question prepared for play: localized, with shuffled options. */
export interface PreparedQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/**
 * Builds a fresh quiz round: draws a random subset of the pool and shuffles
 * the answer options of every question, so two rounds are virtually never
 * identical.
 */
export function buildQuiz(
  pool: readonly QuizQuestion[],
  locale: Locale,
  count: number = QUESTIONS_PER_QUIZ,
  rng: Rng = Math.random,
): PreparedQuestion[] {
  const picked = sample(pool, Math.min(count, pool.length), rng);
  return picked.map((q) => prepareQuestion(q, locale, rng));
}

/** Localizes a question and shuffles its options, tracking the correct index. */
export function prepareQuestion(
  question: QuizQuestion,
  locale: Locale,
  rng: Rng = Math.random,
): PreparedQuestion {
  const options = question.options[locale];
  const indices = shuffle(
    options.map((_, i) => i),
    rng,
  );
  return {
    id: question.id,
    prompt: question.prompt[locale],
    options: indices.map((i) => options[i]),
    // Convention: in the data files the first option is always the correct one.
    correctIndex: indices.indexOf(0),
    explanation: question.explanation[locale],
  };
}

/** Maps a score ratio to a feedback dictionary key. */
export function scoreFeedbackKey(
  correct: number,
  total: number,
): 'scorePerfect' | 'scoreGood' | 'scoreOk' | 'scoreLow' {
  if (total <= 0) return 'scoreLow';
  const ratio = correct / total;
  if (ratio === 1) return 'scorePerfect';
  if (ratio >= 0.7) return 'scoreGood';
  if (ratio >= 0.4) return 'scoreOk';
  return 'scoreLow';
}
