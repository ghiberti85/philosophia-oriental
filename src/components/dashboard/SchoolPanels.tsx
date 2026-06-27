'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState, type CSSProperties } from 'react';
import { dict } from '@/data/dictionary';
import { getPhilosopher } from '@/data/philosophers';
import { getQuestionsFor } from '@/data/quizzes';
import { schools, getSchool } from '@/data/schools';
import type { Philosopher, RelationType, School } from '@/data/types';
import { buildGraph, neighbors, edgeType } from '@/lib/graph';
import { t, type Locale } from '@/lib/i18n';
import { PhilosopherCard } from './Philosopher';
import { Brackets, Icon, Panel, cjkNum } from './ui';

// Modais lazy-loaded: o bundle só é baixado quando o modal é aberto pela primeira vez.
const PhilosopherModal = dynamic(() =>
  import('./Philosopher').then((m) => ({ default: m.PhilosopherModal }))
);
const QuizModal = dynamic(() => import('./QuizModal').then((m) => ({ default: m.QuizModal })));
const StatModal = dynamic(() =>
  import('./SchoolPanels.modals').then((m) => ({ default: m.StatModal }))
);
const IdeaModal = dynamic(() =>
  import('./SchoolPanels.modals').then((m) => ({ default: m.IdeaModal }))
);
const ContextModal = dynamic(() =>
  import('./SchoolPanels.modals').then((m) => ({ default: m.ContextModal }))
);
const SchoolModal = dynamic(() =>
  import('./SchoolPanels.modals').then((m) => ({ default: m.SchoolModal }))
);

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

// Re-export for consumers (avoids duplicating the literal union type).
export type { StatKind };

/* ── Hero ────────────────────────────────────────────────────────────── */

function Hero({ school, locale, onDossier }: { school: School; locale: Locale; onDossier: () => void }) {
  return (
    <Panel area="hero" className="hero reveal" style={{ '--d': '0ms' } as CSSProperties} tint>
      <div className="hero__body">
        <span className="hero__period mono">
          <Icon name="map" size={14} /> {t(REGION_LABEL[school.region], locale)} · {t(school.period, locale)}
        </span>
        <h1 className="hero__title serif">{t(school.name, locale)}</h1>
        <p className="hero__tagline">{t(school.tagline, locale)}</p>
        <button className="btn-ghost hero__desc-btn" onClick={onDossier}>
          <Icon name="scroll" size={16} /> {t(dict.readSchool, locale)}
        </button>
      </div>
      <div className="hero__emblem" aria-hidden="true">
        <span className="hero__emblem-glyph" style={{ color: 'var(--accent)' }}>
          {school.emblem}
        </span>
        <span className="enso" />
      </div>
    </Panel>
  );
}

/* ── Stats ───────────────────────────────────────────────────────────── */

function Stats({
  school,
  locale,
  poolCount,
  onOpen,
}: {
  school: School;
  locale: Locale;
  poolCount: number;
  onOpen: (kind: StatKind) => void;
}) {
  const items: { kind: StatKind; glyph: string; label: string; val: string; unit: string }[] = [
    { kind: 'sages', glyph: '◉', label: t(dict.sages, locale), val: cjkNum(school.philosopherSlugs.length), unit: t(dict.thinkers, locale) },
    { kind: 'tenets', glyph: '▣', label: t(dict.coreTenets, locale), val: cjkNum(school.coreIdeas.en.length), unit: t(dict.principles, locale) },
    { kind: 'quiz', glyph: '◈', label: t(dict.quizPool, locale), val: cjkNum(poolCount), unit: t(dict.questionsInPool, locale) },
    { kind: 'bibliography', glyph: '◧', label: t(dict.bibliography, locale), val: cjkNum(school.keyWorks?.length ?? 0), unit: t(dict.keyWorks, locale) },
  ];
  return (
    <Panel area="stats" glyph="▣" label={t(dict.schoolReadout, locale)} className="reveal" style={{ '--d': '80ms' } as CSSProperties}>
      <div className="stats-grid">
        {items.map((s) => (
          <button className="stat" key={s.kind} onClick={() => onOpen(s.kind)}>
            <span className="mono" style={{ color: 'var(--accent)' }}>{s.glyph} {s.label}</span>
            <span className="stat__val">{s.val}</span>
            <span className="stat__unit">{s.unit}</span>
            <span className="stat__more mono">{t(dict.readMore, locale)} →</span>
          </button>
        ))}
      </div>
    </Panel>
  );
}

/* ── Tenets ──────────────────────────────────────────────────────────── */

function Tenets({ school, locale, onIdea }: { school: School; locale: Locale; onIdea: (i: number) => void }) {
  const ideas = t(school.coreIdeas, locale);
  return (
    <Panel area="ideas" glyph="◉" label={t(dict.coreIdeas, locale)} count={cjkNum(ideas.length)} className="reveal" style={{ '--d': '140ms' } as CSSProperties}>
      <ul className="list-clean tenets">
        {ideas.map((idea, i) => (
          <li key={i}>
            <button className="tenet-row" onClick={() => onIdea(i)}>
              <span className="mk">{String(i + 1).padStart(2, '0')}</span>
              <span className="tenet-row__text">{idea}</span>
              <span className="tenet-row__more mono">{t(dict.inDepth, locale)} →</span>
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ── Thinkers ────────────────────────────────────────────────────────── */

function Thinkers({ school, locale, onOpen }: { school: School; locale: Locale; onOpen: (p: Philosopher) => void }) {
  const list = school.philosopherSlugs.map(getPhilosopher).filter((p): p is Philosopher => Boolean(p));
  return (
    <Panel area="thinkers" glyph="◈" label={t(dict.keyThinkers, locale)} count={cjkNum(list.length)} className="reveal panel--col" style={{ '--d': '200ms' } as CSSProperties}>
      <div className="thinkers-row">
        {list.map((p) => (
          <PhilosopherCard key={p.slug} p={p} locale={locale} onOpen={onOpen} />
        ))}
      </div>
    </Panel>
  );
}

/* ── Context + Quiz ──────────────────────────────────────────────────── */

function ContextQuiz({
  school,
  locale,
  onQuiz,
  onContext,
}: {
  school: School;
  locale: Locale;
  onQuiz: () => void;
  onContext: () => void;
}) {
  return (
    <Panel area="context" className="reveal" style={{ '--d': '260ms' } as CSSProperties}>
      <button className="context-open" onClick={onContext}>
        <div className="panel__head"><span className="glyph">◉</span><span className="mono">{t(dict.historicalContext, locale)}</span></div>
        <p className="context-body dropcap">{t(school.description, locale)}</p>
        <span className="context-open__more mono">{t(dict.readMore, locale)} →</span>
      </button>
      <hr className="rule rule--gold" />
      <div className="quiz-cta">
        <div className="panel__head" style={{ margin: 0 }}><span className="glyph">◈</span><span className="mono">{t(dict.quizzes, locale)}</span></div>
        <p className="lead">{t(dict.quizSubtitle, locale)}</p>
        <button className="btn-primary" onClick={onQuiz}>
          <Icon name="target" size={18} /> {t(dict.startQuiz, locale)}
        </button>
      </div>
    </Panel>
  );
}

/* ── Connections ─────────────────────────────────────────────────────── */

function Connections({
  school,
  locale,
  onSelect,
}: {
  school: School;
  locale: Locale;
  onSelect: (slug: string) => void;
}) {
  const related = neighbors(graph, school.slug);
  return (
    <Panel area="connections" glyph="✦" label={t(dict.connections, locale)} count={cjkNum(related.length)} className="reveal" style={{ '--d': '320ms' } as CSSProperties}>
      <p className="lead" style={{ marginBottom: 14 }}>{t(dict.connectionsPanel, locale)}</p>
      <div className="conn-grid">
        {related.map((slug) => {
          const other = getSchool(slug);
          if (!other) return null;
          const type = edgeType(graph, school.slug, slug);
          return (
            <button key={slug} className="conn-card" onClick={() => onSelect(slug)} style={{ '--accent-base': other.accent } as CSSProperties}>
              <span className="conn-card__emblem" aria-hidden="true">{other.emblem}</span>
              <span className="conn-card__body">
                <span className="conn-card__name serif">{t(other.name, locale)}</span>
                {type && <span className="conn-card__rel mono">{t(RELATION_LABEL[type], locale)}</span>}
              </span>
              <Icon name="arrow" size={15} className="conn-card__go" />
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

/* ── Panels host ─────────────────────────────────────────────────────── */

export function SchoolPanels({
  school,
  locale,
  onSelectSchool,
}: {
  school: School;
  locale: Locale;
  onSelectSchool: (slug: string) => void;
}) {
  const [philOpen, setPhilOpen] = useState<Philosopher | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizScope, setQuizScope] = useState<Philosopher | null>(null);
  const [schoolOpen, setSchoolOpen] = useState(false);
  const [statOpen, setStatOpen] = useState<StatKind | null>(null);
  const [ideaOpen, setIdeaOpen] = useState<number | null>(null);
  const [ctxOpen, setCtxOpen] = useState(false);

  const pool = useMemo(
    () => school.philosopherSlugs.flatMap((s) => getQuestionsFor(s)),
    [school],
  );

  const openSchoolQuiz = () => { setQuizScope(null); setQuizOpen(true); };
  const openPhilQuiz = (p: Philosopher) => { setPhilOpen(null); setQuizScope(p); setQuizOpen(true); };

  const quizPool = quizScope ? getQuestionsFor(quizScope.slug) : pool;
  const quizTitle = quizScope ? t(quizScope.name, locale) : t(school.name, locale);
  const quizKey = quizScope ? quizScope.slug : school.slug;

  return (
    <div className="dash-wrap" style={{ '--accent-base': school.accent } as CSSProperties}>
      <main className="dash" key={school.slug}>
        <Hero school={school} locale={locale} onDossier={() => setSchoolOpen(true)} />
        <Stats school={school} locale={locale} poolCount={pool.length} onOpen={setStatOpen} />
        <Tenets school={school} locale={locale} onIdea={setIdeaOpen} />
        <Thinkers school={school} locale={locale} onOpen={setPhilOpen} />
        <ContextQuiz school={school} locale={locale} onQuiz={openSchoolQuiz} onContext={() => setCtxOpen(true)} />
        <Connections school={school} locale={locale} onSelect={onSelectSchool} />
      </main>

      <PhilosopherModal p={philOpen} open={!!philOpen} onClose={() => setPhilOpen(null)} onQuiz={openPhilQuiz} locale={locale} />
      <SchoolModal school={school} open={schoolOpen} onClose={() => setSchoolOpen(false)} locale={locale} onThinker={(p) => { setSchoolOpen(false); setPhilOpen(p); }} />
      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} pool={quizPool} title={quizTitle} scoreKey={quizKey} locale={locale} />
      <StatModal kind={statOpen} school={school} locale={locale} poolCount={pool.length} onClose={() => setStatOpen(null)} onThinker={setPhilOpen} onIdea={setIdeaOpen} onQuiz={openSchoolQuiz} onSelect={onSelectSchool} />
      <IdeaModal ideaIdx={ideaOpen} school={school} locale={locale} onClose={() => setIdeaOpen(null)} />
      <ContextModal open={ctxOpen} school={school} locale={locale} onClose={() => setCtxOpen(false)} />
    </div>
  );
}
