'use client';

import { useState } from 'react';
import { dict } from '@/data/dictionary';
import type { Philosopher } from '@/data/types';
import { t, type Locale } from '@/lib/i18n';
import { Accordion, Icon, Modal } from './ui';

/** Image with a graceful monogram fallback. */
function Portrait({ p, locale, className }: { p: Philosopher; locale: Locale; className?: string }) {
  const [failed, setFailed] = useState(false);
  const initial = t(p.name, locale).charAt(0);
  if (!p.figureImage || failed) {
    return (
      <div className={`portrait portrait--mono ${className ?? ''}`} aria-hidden="true">
        <span>{initial}</span>
      </div>
    );
  }
  return (
    // Plain <img> on purpose: lightweight placeholder with an onError monogram
    // fallback; swapped for optimized art (next/image) in a later phase.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`portrait ${className ?? ''}`}
      src={p.figureImage}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export function PhilosopherCard({
  p,
  locale,
  onOpen,
}: {
  p: Philosopher;
  locale: Locale;
  onOpen: (p: Philosopher) => void;
}) {
  return (
    <button className="thinker-card" onClick={() => onOpen(p)}>
      <Portrait p={p} locale={locale} className="thinker-card__img" />
      <span className="thinker-card__body">
        <span className="thinker-card__name serif">{t(p.name, locale)}</span>
        <span className="thinker-card__epithet mono">{t(p.epithet, locale)}</span>
        <span className="thinker-card__years mono">{t(p.years, locale)}</span>
      </span>
    </button>
  );
}

export function PhilosopherModal({
  p,
  open,
  onClose,
  onQuiz,
  locale,
}: {
  p: Philosopher | null;
  open: boolean;
  onClose: () => void;
  onQuiz: (p: Philosopher) => void;
  locale: Locale;
}) {
  if (!p) return null;

  const sections = [
    {
      id: 'bio',
      title: t(dict.biography, locale),
      glyph: '☰',
      content: (
        <div className="prose">
          {t(p.biography, locale).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      ),
    },
    {
      id: 'contributions',
      title: t(dict.contributions, locale),
      glyph: '◈',
      content: (
        <ul className="list-clean">
          {t(p.contributions, locale).map((c, i) => (
            <li key={i}>
              <span className="mk">{String(i + 1).padStart(2, '0')}</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'quotes',
      title: t(dict.notableQuotes, locale),
      glyph: '❝',
      content: (
        <div className="quotes">
          {p.quotes.map((q, i) => (
            <blockquote key={i} className="quote">
              “{t(q.text, locale)}”
            </blockquote>
          ))}
        </div>
      ),
    },
    {
      id: 'traits',
      title: t(dict.traits, locale),
      glyph: '◉',
      content: (
        <div className="traitwrap">
          {t(p.traits, locale).map((trait, i) => (
            <span className="chip" key={i}>
              {trait}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 'facts',
      title: t(dict.remarkableFacts, locale),
      glyph: '✦',
      content: (
        <ul className="list-clean">
          {t(p.facts, locale).map((f, i) => (
            <li key={i}>
              <span className="mk">{String(i + 1).padStart(2, '0')}</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <Modal open={open} onClose={onClose} labelledby="pm-name" closeLabel={t(dict.close, locale)}>
      <div className="modal__scroll">
        <div className="pm__hero">
          <Portrait p={p} locale={locale} className="pm__img" />
          <div className="pm__heading">
            <h2 className="pm__name serif" id="pm-name">
              {t(p.name, locale)}
            </h2>
            <p className="pm__epithet mono">{t(p.epithet, locale)}</p>
            <p className="pm__meta mono">
              {t(p.years, locale)} · {t(dict.born, locale)} {t(p.birthplace, locale)}
            </p>
            <button className="btn-primary pm__quiz" onClick={() => onQuiz(p)}>
              <Icon name="target" size={16} /> {t(dict.takeQuiz, locale)}
            </button>
          </div>
        </div>
        <div className="tabpanel">
          <Accordion sections={sections} />
        </div>
      </div>
    </Modal>
  );
}
