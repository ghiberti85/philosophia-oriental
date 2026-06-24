'use client';

import { dict } from '@/data/dictionary';
import type { RelationType } from '@/data/types';
import { t, type Locale } from '@/lib/i18n';

const ITEMS: { type: RelationType; color: string; label: (typeof dict)['legendLineage']; dashed?: boolean }[] = [
  { type: 'lineage', color: '#d9ad4f', label: dict.legendLineage },
  { type: 'influence', color: '#5fa97f', label: dict.legendInfluence },
  { type: 'synthesis', color: '#df6244', label: dict.legendSynthesis },
  { type: 'opposition', color: '#8a6d6d', label: dict.legendOpposition, dashed: true },
];

/** Colour/style key for the graph's edge types. */
export function GraphLegend({ locale }: { locale: Locale }) {
  return (
    <ul className="graph-legend" aria-label={t(dict.legendTitle, locale)}>
      {ITEMS.map((it) => (
        <li key={it.type} className="graph-legend__item">
          <span
            className={`graph-legend__line${it.dashed ? ' is-dashed' : ''}`}
            style={{ ['--line-color' as string]: it.color }}
            aria-hidden="true"
          />
          <span className="graph-legend__label mono">{t(it.label, locale)}</span>
        </li>
      ))}
    </ul>
  );
}
