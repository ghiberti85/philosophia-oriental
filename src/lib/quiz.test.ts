import { describe, expect, it } from 'vitest';
import type { QuizQuestion } from '@/data/types';
import { mulberry32 } from './random';
import { buildQuiz, prepareQuestion, QUESTIONS_PER_QUIZ, scoreFeedbackKey } from './quiz';

const q: QuizQuestion = {
  id: 'demo-1',
  philosopherSlug: 'laozi',
  prompt: { en: 'Prompt?', pt: 'Pergunta?' },
  options: {
    en: ['correct', 'wrong-1', 'wrong-2', 'wrong-3'],
    pt: ['certo', 'errado-1', 'errado-2', 'errado-3'],
  },
  explanation: { en: 'Because.', pt: 'Porque.' },
};

describe('prepareQuestion', () => {
  it('keeps the correct option tracked through the shuffle', () => {
    const prepared = prepareQuestion(q, 'en', mulberry32(3));
    expect(prepared.options[prepared.correctIndex]).toBe('correct');
    expect(new Set(prepared.options).size).toBe(4);
  });

  it('localizes prompt and explanation', () => {
    const prepared = prepareQuestion(q, 'pt', mulberry32(1));
    expect(prepared.prompt).toBe('Pergunta?');
    expect(prepared.explanation).toBe('Porque.');
    expect(prepared.options).toContain('certo');
  });
});

describe('buildQuiz', () => {
  const pool: QuizQuestion[] = Array.from({ length: 10 }, (_, i) => ({
    ...q,
    id: `demo-${i}`,
  }));

  it('draws the default number of questions', () => {
    const round = buildQuiz(pool, 'en', QUESTIONS_PER_QUIZ, mulberry32(9));
    expect(round).toHaveLength(QUESTIONS_PER_QUIZ);
    expect(new Set(round.map((r) => r.id)).size).toBe(QUESTIONS_PER_QUIZ);
  });

  it('never asks for more than the pool holds', () => {
    const round = buildQuiz(pool.slice(0, 3), 'en', QUESTIONS_PER_QUIZ);
    expect(round).toHaveLength(3);
  });
});

describe('scoreFeedbackKey', () => {
  it('maps ratios to the right feedback bucket', () => {
    expect(scoreFeedbackKey(5, 5)).toBe('scorePerfect');
    expect(scoreFeedbackKey(4, 5)).toBe('scoreGood');
    expect(scoreFeedbackKey(2, 5)).toBe('scoreOk');
    expect(scoreFeedbackKey(1, 5)).toBe('scoreLow');
    expect(scoreFeedbackKey(0, 0)).toBe('scoreLow');
  });
});
