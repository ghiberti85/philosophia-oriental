'use client';

/**
 * Modal components for SchoolPanels — extracted into a separate chunk so they
 * are lazy-loaded via next/dynamic and only downloaded when first opened.
 */

import type { CSSProperties } from 'react';
import { dict } from '@/data/dictionary';
import { getPhilosopher } from '@/data/philosophers';
import { getQuestionsFor } from '@/data/quizzes';
import { getSchool, schools } from '@/data/schools';
import { schoolDetails } from '@/data/school-details';
import { getHistoricalFacts } from '@/data/historical-facts';
import type { Philosopher, RelationType, School } from '@/data/types';
import { buildGraph, neighbors, edgeType } from '@/lib/graph';
import { t, type Locale } from '@/lib/i18n';
import { Icon, Modal } from './ui';

const graph = buildGraph(schools);

const REGION_LABEL = {
  china: dict.regionChina,
  india: dict.regionIndia,
  japan: dict.regionJapan,
} as const;

const RELATION_LABEL: Record<RelationType, (typeof dict)['relLineage']> = {
  influence: dict.relInfluence,
  opposition: dict.relOpposition,
  synthesis: dict.relSynthesis,
  lineage: dict.relLineage,
};

type StatKind = 'sages' | 'tenets' | 'quiz' | 'bibliography' | 'connections';

function cjkNum(n: number): string {
  return String(n);
}

export function StatModal({
  kind,
  school,
  locale,
  poolCount,
  onClose,
  onThinker,
  onIdea,
  onQuiz,
  onSelect,
}: {
  kind: StatKind | null;
  school: School;
  locale: Locale;
  poolCount: number;
  onClose: () => void;
  onThinker: (p: Philosopher) => void;
  onIdea: (i: number) => void;
  onQuiz: () => void;
  onSelect: (slug: string) => void;
}) {
  if (!kind) return null;
  const list = school.philosopherSlugs.map(getPhilosopher).filter((p): p is Philosopher => Boolean(p));
  const titles: Record<StatKind, string> = {
    sages: t(dict.sages, locale),
    tenets: t(dict.coreTenets, locale),
    quiz: t(dict.quizPool, locale),
    bibliography: t(dict.bibliography, locale),
    connections: t(dict.connections, locale),
  };
  const infos: Record<StatKind, string> = {
    sages: t(dict.statSagesInfo, locale),
    tenets: t(dict.statTenetsInfo, locale),
    quiz: t(dict.statQuizInfo, locale),
    bibliography: t(dict.statBibliographyInfo, locale),
    connections: t(dict.statConnectionsInfo, locale),
  };
  const related = neighbors(graph, school.slug);

  return (
    <Modal open onClose={onClose} variant="modal--quiz" labelledby="stat-title" closeLabel={t(dict.close, locale)}>
      <div className="modal__scroll">
        <div className="tabpanel">
          <div className="panel__head">
            <span className="glyph">▣</span>
            <span className="mono" id="stat-title">{titles[kind]} · {t(school.name, locale)}</span>
          </div>
          <p className="context-body" style={{ marginBottom: 18 }}>{infos[kind]}</p>

          {kind === 'sages' && (
            <ul className="list-clean">
              {list.map((p, i) => (
                <li key={p.slug}>
                  <span className="mk">{String(i + 1).padStart(2, '0')}</span>
                  <button className="statlink" onClick={() => { onClose(); onThinker(p); }}>
                    <span className="serif" style={{ fontWeight: 700 }}>{t(p.name, locale)}</span>
                    <span className="statlink__sub mono">{t(p.epithet, locale)} · {t(p.years, locale)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {kind === 'tenets' && (
            <ul className="list-clean">
              {t(school.coreIdeas, locale).map((idea, i) => (
                <li key={i}>
                  <span className="mk">{String(i + 1).padStart(2, '0')}</span>
                  <button className="statlink" onClick={() => { onClose(); onIdea(i); }}>
                    <span>{idea}</span>
                    <span className="statlink__sub mono">{t(dict.inDepth, locale)} →</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {kind === 'quiz' && (
            <>
              <ul className="list-clean" style={{ marginBottom: 18 }}>
                {list.map((p, i) => (
                  <li key={p.slug}>
                    <span className="mk">{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ flex: 1 }}>{t(p.name, locale)}</span>
                    <span className="mono" style={{ color: 'var(--accent)' }}>{cjkNum(getQuestionsFor(p.slug).length)}</span>
                  </li>
                ))}
              </ul>
              <button className="btn-primary" onClick={() => { onClose(); onQuiz(); }}>
                <Icon name="target" size={18} /> {t(dict.startQuiz, locale)} · {poolCount}
              </button>
            </>
          )}

          {kind === 'bibliography' && (
            <ul className="list-clean bib-list">
              {(school.keyWorks ?? []).map((w, i) => (
                <li key={i} className="bib-item">
                  <span className="mk">{String(i + 1).padStart(2, '0')}</span>
                  <span className="bib-item__body">
                    <span className="bib-item__title serif">{t(w.title, locale)}</span>
                    <span className="bib-item__meta mono">{t(w.author, locale)} · {w.year}</span>
                    {w.note && <span className="bib-item__note">{t(w.note, locale)}</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {kind === 'connections' && (
            <ul className="list-clean">
              {related.map((slug, i) => {
                const other = getSchool(slug);
                if (!other) return null;
                const type = edgeType(graph, school.slug, slug);
                return (
                  <li key={slug}>
                    <span className="mk">{String(i + 1).padStart(2, '0')}</span>
                    <button className="statlink" onClick={() => { onClose(); onSelect(slug); }}>
                      <span className="serif" style={{ fontWeight: 700 }}>{other.emblem} {t(other.name, locale)}</span>
                      {type && <span className="statlink__sub mono">{t(RELATION_LABEL[type], locale)} · {t(dict.travelTo, locale)} →</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}

export function IdeaModal({
  ideaIdx,
  school,
  locale,
  onClose,
}: {
  ideaIdx: number | null;
  school: School;
  locale: Locale;
  onClose: () => void;
}) {
  if (ideaIdx == null) return null;
  const ideas = t(school.coreIdeas, locale);
  const detail = schoolDetails[school.slug];
  const text = detail?.ideaDetails ? t(detail.ideaDetails, locale)[ideaIdx] : undefined;
  return (
    <Modal open onClose={onClose} labelledby="idea-title" closeLabel={t(dict.close, locale)}>
      <div className="modal__scroll">
        <div className="tabpanel idea-deep">
          <div className="panel__head">
            <span className="glyph">◉</span>
            <span className="mono">{t(dict.coreIdeas, locale)} · {t(school.name, locale)}</span>
            <span className="count">{String(ideaIdx + 1).padStart(2, '0')} / {String(ideas.length).padStart(2, '0')}</span>
          </div>
          <h2 className="idea-deep__title serif" id="idea-title">{ideas[ideaIdx]}</h2>
          {text ? <p className="idea-deep__body dropcap">{text}</p> : <p className="context-body">{t(school.description, locale)}</p>}
        </div>
      </div>
    </Modal>
  );
}

export function ContextModal({
  open,
  school,
  locale,
  onClose,
}: {
  open: boolean;
  school: School;
  locale: Locale;
  onClose: () => void;
}) {
  if (!open) return null;
  const detail = schoolDetails[school.slug];
  const paras = detail ? t(detail.contextLong, locale) : [t(school.description, locale)];
  const facts = getHistoricalFacts(school.slug);
  return (
    <Modal open onClose={onClose} labelledby="ctx-title" closeLabel={t(dict.close, locale)}>
      <div className="modal__scroll">
        <div className="tabpanel">
          <div className="panel__head">
            <span className="glyph">◉</span>
            <span className="mono" id="ctx-title">{t(dict.historicalContext, locale)} · {t(school.name, locale)}</span>
          </div>
          <div className="prose dropcap">
            {paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {facts.length > 0 && (
            <div className="facts">
              <div className="panel__head" style={{ marginTop: 26 }}>
                <span className="glyph">✦</span>
                <span className="mono">{t(dict.historicalFacts, locale)}</span>
              </div>
              <p className="lead">{t(dict.historicalFactsInfo, locale)}</p>
              <ul className="facts-list">
                {facts.map((f, i) => (
                  <li key={i} className="fact">
                    <span className="fact__year mono">{f.year}</span>
                    <span className="fact__text">{t(f.fact, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export function SchoolModal({
  school,
  open,
  onClose,
  locale,
  onThinker,
}: {
  school: School;
  open: boolean;
  onClose: () => void;
  locale: Locale;
  onThinker: (p: Philosopher) => void;
}) {
  const list = school.philosopherSlugs.map(getPhilosopher).filter((p): p is Philosopher => Boolean(p));
  return (
    <Modal open={open} onClose={onClose} labelledby="sm-name" closeLabel={t(dict.close, locale)}>
      <div className="modal__scroll">
        <div className="sm__hero">
          <span className="sm__emblem" aria-hidden="true" style={{ color: 'var(--accent)' }}>{school.emblem}</span>
          <div>
            <span className="hero__period mono"><Icon name="map" size={14} /> {t(REGION_LABEL[school.region], locale)} · {t(school.period, locale)}</span>
            <h2 className="pm__name serif" id="sm-name" style={{ marginTop: 6 }}>{t(school.name, locale)}</h2>
          </div>
        </div>
        <div className="tabpanel">
          <p className="hero__tagline" style={{ maxWidth: 'none', marginBottom: 18 }}>{t(school.tagline, locale)}</p>
          <p className="context-body dropcap" style={{ marginBottom: 22 }}>{t(school.description, locale)}</p>
          <div className="panel__head"><span className="glyph">◉</span><span className="mono">{t(dict.coreIdeas, locale)}</span></div>
          <ul className="list-clean" style={{ marginBottom: 22 }}>
            {t(school.coreIdeas, locale).map((idea, i) => (
              <li key={i}><span className="mk">{String(i + 1).padStart(2, '0')}</span><span>{idea}</span></li>
            ))}
          </ul>
          <div className="panel__head"><span className="glyph">◈</span><span className="mono">{t(dict.keyThinkers, locale)}</span></div>
          <div className="traitwrap">
            {list.map((p) => (
              <button key={p.slug} className="chip" onClick={() => onThinker(p)} style={{ cursor: 'pointer' }}>
                <Icon name="user" size={14} style={{ color: 'var(--accent)' }} /> {t(p.name, locale)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
