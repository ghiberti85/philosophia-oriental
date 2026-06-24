'use client';

import { dict } from '@/data/dictionary';
import { schools } from '@/data/schools';
import type { Region } from '@/data/types';
import { t, type Locale } from '@/lib/i18n';

const REGION_ORDER: Region[] = ['china', 'india', 'japan'];
const REGION_LABEL = {
  china: dict.regionChina,
  india: dict.regionIndia,
  japan: dict.regionJapan,
} as const;

/**
 * Accessible, WebGL-free presentation of the same graph: schools grouped by
 * region as a list of buttons. This is the default under `prefers-reduced-motion`
 * and the keyboard/screen-reader path for the 3D constellation.
 */
export function GraphFallback({
  selectedSlug,
  onSelect,
  locale,
}: {
  selectedSlug: string;
  onSelect: (slug: string) => void;
  locale: Locale;
}) {
  return (
    <div className="graph-fallback">
      {REGION_ORDER.map((region) => {
        const inRegion = schools.filter((s) => s.region === region);
        if (inRegion.length === 0) return null;
        return (
          <section className="gf-group" key={region} aria-label={t(REGION_LABEL[region], locale)}>
            <h3 className="gf-group__title mono">{t(REGION_LABEL[region], locale)}</h3>
            <div className="gf-group__items">
              {inRegion.map((s) => (
                <button
                  key={s.slug}
                  className={`gf-node${s.slug === selectedSlug ? ' is-selected' : ''}`}
                  aria-pressed={s.slug === selectedSlug}
                  onClick={() => onSelect(s.slug)}
                  style={{ ['--accent-base' as string]: s.accent }}
                >
                  <span className="gf-node__head">
                    <span className="gf-node__emblem" aria-hidden="true">{s.emblem}</span>
                    <span className="gf-node__name serif">{t(s.name, locale)}</span>
                  </span>
                  <span className="gf-node__period mono">{t(s.period, locale)}</span>
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
