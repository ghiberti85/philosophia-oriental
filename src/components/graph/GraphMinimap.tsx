'use client';

import { useState } from 'react';
import type { Graph } from '@/lib/graph';

const RELATION_COLOR: Record<string, string> = {
  lineage: '#d9ad4f',
  influence: '#5fa97f',
  synthesis: '#df6244',
  opposition: '#8a6d6d',
};

function project(positions: [number, number, number][], axis: 0 | 1): { min: number; max: number } {
  const vals = positions.map((p) => p[axis]);
  return { min: Math.min(...vals), max: Math.max(...vals) };
}

function normalize(val: number, min: number, max: number, lo = 10, hi = 110): number {
  if (max === min) return (lo + hi) / 2;
  return lo + ((val - min) / (max - min)) * (hi - lo);
}

export function GraphMinimap({
  graph,
  selectedSlug,
  onSelect,
}: {
  graph: Graph;
  selectedSlug: string;
  onSelect: (slug: string) => void;
}) {
  const [visible, setVisible] = useState(true);

  const positions = graph.nodes.map((n) => n.position);
  const xRange = project(positions, 0);
  const yRange = project(positions, 1);

  const nodeCoords = graph.nodes.map((n) => ({
    ...n,
    cx: normalize(n.position[0], xRange.min, xRange.max),
    cy: normalize(-n.position[1], -yRange.max, -yRange.min),
  }));

  const coordMap = new Map(nodeCoords.map((n) => [n.slug, { cx: n.cx, cy: n.cy }]));

  return (
    <div className="graph-minimap">
      <button
        className="minimap-toggle mono"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide minimap' : 'Show minimap'}
        title={visible ? 'Hide minimap' : 'Show minimap'}
      >
        {visible ? '◈' : '◇'}
      </button>
      {visible && (
        <svg
          width={120}
          height={120}
          viewBox="0 0 120 120"
          aria-label="Knowledge graph minimap"
          role="img"
        >
          {graph.edges.map((edge) => {
            const a = coordMap.get(edge.source);
            const b = coordMap.get(edge.target);
            if (!a || !b) return null;
            return (
              <line
                key={`${edge.source}-${edge.target}`}
                x1={a.cx} y1={a.cy}
                x2={b.cx} y2={b.cy}
                stroke={RELATION_COLOR[edge.type]}
                strokeWidth={1}
                opacity={0.5}
              />
            );
          })}
          {nodeCoords.map((n) => {
            const selected = n.slug === selectedSlug;
            return (
              <g key={n.slug} onClick={() => onSelect(n.slug)} style={{ cursor: 'pointer' }}>
                <title>{n.slug}</title>
                {selected && (
                  <circle cx={n.cx} cy={n.cy} r={9} fill="none" stroke="var(--gold)" strokeWidth={1.5} />
                )}
                <circle
                  cx={n.cx}
                  cy={n.cy}
                  r={selected ? 5 : 4}
                  fill={n.accent}
                  opacity={selected ? 1 : 0.8}
                />
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
