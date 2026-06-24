'use client';

import { useMemo, useState } from 'react';
import { dict } from '@/data/dictionary';
import type { QuizQuestion } from '@/data/types';
import { t, type Locale } from '@/lib/i18n';
import { buildQuiz, QUESTIONS_PER_QUIZ, scoreFeedbackKey, type PreparedQuestion } from '@/lib/quiz';
import { Icon, Modal } from './ui';

type Phase = 'intro' | 'playing' | 'results';

const LS = {
  get(key: string): number {
    try {
      return Number(localStorage.getItem(`philosophia-oriental.${key}`) ?? '0') || 0;
    } catch {
      return 0;
    }
  },
  set(key: string, value: number) {
    try {
      localStorage.setItem(`philosophia-oriental.${key}`, String(value));
    } catch {
      /* private mode */
    }
  },
};

export function QuizModal({
  open,
  onClose,
  pool,
  title,
  scoreKey,
  locale,
}: {
  open: boolean;
  onClose: () => void;
  pool: QuizQuestion[];
  title: string;
  scoreKey: string;
  locale: Locale;
}) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [round, setRound] = useState<PreparedQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [nonce, setNonce] = useState(0);

  const best = useMemo(() => {
    void nonce; // re-read best score after each round
    return open ? LS.get(`best.${scoreKey}`) : 0;
  }, [open, scoreKey, nonce]);

  const start = () => {
    setRound(buildQuiz(pool, locale));
    setCurrent(0);
    setPicked(null);
    setScore(0);
    setPhase('playing');
  };

  const close = () => {
    setPhase('intro');
    onClose();
  };

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === round[current].correctIndex) setScore((s) => s + 1);
  };

  const advance = () => {
    if (current + 1 < round.length) {
      setCurrent((c) => c + 1);
      setPicked(null);
    } else {
      if (score > LS.get(`best.${scoreKey}`)) LS.set(`best.${scoreKey}`, score);
      setNonce((n) => n + 1);
      setPhase('results');
    }
  };

  const total = round.length || Math.min(QUESTIONS_PER_QUIZ, pool.length);

  return (
    <Modal open={open} onClose={close} variant="modal--quiz" labelledby="quiz-title" closeLabel={t(dict.close, locale)}>
      <div className="modal__scroll">
        <div className="quiz">
          <div className="panel__head">
            <span className="glyph">◈</span>
            <span className="mono" id="quiz-title">
              {t(dict.quizzes, locale)} · {title}
            </span>
          </div>

          {phase === 'intro' && (
            <div className="quiz__intro">
              <p className="lead">{t(dict.quizSubtitle, locale)}</p>
              <p className="mono quiz__pool">
                {pool.length} {t(dict.questionsInPool, locale)}
                {best > 0 && (
                  <>
                    {' · '}
                    {t(dict.bestScore, locale)}: {best}/{total}
                  </>
                )}
              </p>
              <button className="btn-primary" onClick={start} disabled={pool.length === 0}>
                <Icon name="target" size={18} /> {t(dict.startQuiz, locale)}
              </button>
            </div>
          )}

          {phase === 'playing' && round[current] && (
            <div className="quiz__play">
              <div className="quiz__progress mono">
                {t(dict.question, locale)} {current + 1} {t(dict.of, locale)} {round.length}
              </div>
              <h3 className="quiz__prompt serif">{round[current].prompt}</h3>
              <ul className="quiz__options">
                {round[current].options.map((opt, i) => {
                  const isCorrect = i === round[current].correctIndex;
                  const state =
                    picked === null
                      ? ''
                      : isCorrect
                        ? ' opt--correct'
                        : i === picked
                          ? ' opt--wrong'
                          : '';
                  return (
                    <li key={i}>
                      <button
                        className={`opt${state}`}
                        onClick={() => choose(i)}
                        disabled={picked !== null}
                      >
                        <span className="opt__marker mono">{String.fromCharCode(65 + i)}</span>
                        <span className="opt__text">{opt}</span>
                        {picked !== null && isCorrect && <Icon name="check" size={16} />}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {picked !== null && (
                <div className="quiz__feedback">
                  <p className={`quiz__verdict ${picked === round[current].correctIndex ? 'is-correct' : 'is-wrong'}`}>
                    {picked === round[current].correctIndex ? t(dict.correct, locale) : t(dict.incorrect, locale)}
                  </p>
                  <p className="quiz__explanation">{round[current].explanation}</p>
                  <button className="btn-primary" onClick={advance}>
                    {current + 1 < round.length ? t(dict.nextQuestion, locale) : t(dict.seeResults, locale)}
                    <Icon name="arrow" size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {phase === 'results' && (
            <div className="quiz__results">
              <p className="quiz__score serif">
                {t(dict.yourScore, locale)}: {score}/{round.length}
              </p>
              <p className="lead">{t(dict[scoreFeedbackKey(score, round.length)], locale)}</p>
              <p className="mono">
                {t(dict.bestScore, locale)}: {best}/{round.length}
              </p>
              <div className="quiz__actions">
                <button className="btn-primary" onClick={start}>
                  <Icon name="refresh" size={16} /> {t(dict.playAgain, locale)}
                </button>
                <button className="btn-ghost" onClick={close}>
                  {t(dict.close, locale)}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
