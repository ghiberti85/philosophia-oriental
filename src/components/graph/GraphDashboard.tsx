'use client';

import './graph.css';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { dict } from '@/data/dictionary';
import { getSchool, schools } from '@/data/schools';
import { t, type Locale } from '@/lib/i18n';
import { Topbar } from '@/components/Topbar';
import { SchoolPanels } from '@/components/dashboard/SchoolPanels';
import { CommandPalette } from '@/components/CommandPalette';
import { buildGraph } from '@/lib/graph';
import { GraphFallback } from './GraphFallback';
import { GraphLegend } from './GraphLegend';
import { GraphMinimap } from './GraphMinimap';

// The WebGL scene never blocks first paint and is never server-rendered.
const GraphScene = dynamic(() => import('./GraphScene'), {
  ssr: false,
  loading: () => <div className="graph-loading mono">◇ ◇ ◇</div>,
});

const DEFAULT_SLUG = 'confucianism';
const graph = buildGraph(schools);
type View = 'graph' | 'list';

/** Tracks the user's reduced-motion preference. */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

export function GraphDashboard({ locale }: { locale: Locale }) {
  const reducedMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const [selectedSlug, setSelectedSlug] = useState(DEFAULT_SLUG);
  const [view, setView] = useState<View>('graph');
  const [mounted, setMounted] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const panelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Default keyboard/SR and reduced-motion users to the accessible list view.
  useEffect(() => {
    if (reducedMotion) setView('list');
  }, [reducedMotion]);

  const select = useCallback((slug: string) => {
    if (!getSchool(slug)) return;
    // Just update the selection — never auto-scroll. Selecting a node should keep
    // the user on the constellation; the dossier updates in place below.
    setSelectedSlug(slug);
  }, []);

  const school = getSchool(selectedSlug) ?? schools[0];

  return (
    <div className="stage">
      <Topbar locale={locale} />
      <CommandPalette
        locale={locale}
        onSelect={select}
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />

      <section className="graph-section" aria-label={t(dict.graphTitle, locale)}>
        <div className="graph-section__head">
          <div>
            <h2 className="graph-section__title serif">{t(dict.graphTitle, locale)}</h2>
            <p className="graph-section__sub">{t(dict.graphSubtitle, locale)}</p>
          </div>
          <div className="graph-section__controls">
            <GraphLegend locale={locale} />
            <div className="seg" role="group" aria-label="view">
              <button aria-current={view === 'graph'} onClick={() => setView('graph')}>3D</button>
              <button aria-current={view === 'list'} onClick={() => setView('list')}>☰</button>
            </div>
          </div>
        </div>

        <div className="graph-stage">
          {view === 'graph' && mounted ? (
            <>
              <GraphScene
                selectedSlug={selectedSlug}
                onSelect={select}
                locale={locale}
                animate={!reducedMotion}
                dark={resolvedTheme === 'dark'}
              />
              <span className="graph-hint mono" aria-hidden="true">{t(dict.graphHint, locale)}</span>
              <span className="graph-motif" aria-hidden="true" />
              <GraphMinimap graph={graph} selectedSlug={selectedSlug} onSelect={select} />
            </>
          ) : (
            <GraphFallback selectedSlug={selectedSlug} onSelect={select} locale={locale} />
          )}
        </div>
      </section>

      <div ref={panelsRef} className="panels-anchor">
        <SchoolPanels school={school} locale={locale} onSelectSchool={select} />
      </div>
    </div>
  );
}
