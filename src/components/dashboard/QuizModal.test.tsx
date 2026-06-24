import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getQuestionsFor } from '@/data/quizzes';
import { QuizModal } from './QuizModal';

/**
 * Drives a full quiz round through the real quiz engine (no mocks): start →
 * answer every question → results. This exercises the state machine and the
 * localStorage best-score path end to end.
 */
describe('QuizModal', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('plays a complete round and shows a score', async () => {
    const user = userEvent.setup();
    const pool = getQuestionsFor('confucius');
    expect(pool.length).toBeGreaterThan(0);

    render(
      <QuizModal
        open
        onClose={() => {}}
        pool={pool}
        title="Confucius"
        scoreKey="confucius"
        locale="en"
      />,
    );

    // Intro → start
    await user.click(screen.getByRole('button', { name: /start quiz/i }));

    // Answer every question until the results panel appears.
    for (let guard = 0; guard < 10; guard++) {
      if (screen.queryByText(/your score/i)) break;
      const options = screen.getAllByRole('button').filter((b) => b.className.includes('opt'));
      await user.click(options[0]);
      const advance = await screen.findByRole('button', {
        name: /next question|see results/i,
      });
      await user.click(advance);
    }

    expect(screen.getByText(/your score/i)).toBeInTheDocument();
    // Best score is persisted for this device.
    expect(screen.getByText(/best score/i)).toBeInTheDocument();
  });
});
