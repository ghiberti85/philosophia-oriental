'use client';

import { Line, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';
import { getSchool, schools } from '@/data/schools';
import type { RelationType } from '@/data/types';
import { buildGraph, isIncident } from '@/lib/graph';
import { t, type Locale } from '@/lib/i18n';
import { GraphNode } from './GraphNode';

const RELATION_COLOR: Record<RelationType, string> = {
  lineage: '#d9ad4f', // gold
  influence: '#5fa97f', // jade
  synthesis: '#df6244', // cinnabar
  opposition: '#8a6d6d', // muted clay
};

function Constellation({
  selectedSlug,
  onSelect,
  locale,
  animate,
}: {
  selectedSlug: string;
  onSelect: (slug: string) => void;
  locale: Locale;
  animate: boolean;
}) {
  const group = useRef<Group>(null);
  const graph = useMemo(() => buildGraph(schools), []);
  const posBySlug = useMemo(() => {
    const m = new Map<string, [number, number, number]>();
    for (const n of graph.nodes) m.set(n.slug, n.position);
    return m;
  }, [graph]);

  const neighborSet = useMemo(() => {
    const s = new Set<string>();
    for (const e of graph.edges) {
      if (e.source === selectedSlug) s.add(e.target);
      if (e.target === selectedSlug) s.add(e.source);
    }
    return s;
  }, [graph, selectedSlug]);

  useFrame((_, delta) => {
    if (group.current && animate) group.current.rotation.y += delta * 0.05;
  });

  return (
    <group ref={group}>
      {graph.edges.map((edge) => {
        const a = posBySlug.get(edge.source);
        const b = posBySlug.get(edge.target);
        if (!a || !b) return null;
        const incident = isIncident(edge, selectedSlug);
        return (
          <Line
            key={`${edge.source}-${edge.target}`}
            points={[a, b]}
            color={RELATION_COLOR[edge.type]}
            lineWidth={incident ? 2.4 : 1.1}
            transparent
            opacity={incident ? 0.95 : 0.4}
            dashed={edge.type === 'opposition'}
            dashSize={0.3}
            gapSize={0.18}
          />
        );
      })}

      {graph.nodes.map((node) => {
        const school = getSchool(node.slug);
        const dimmed =
          selectedSlug !== node.slug && neighborSet.size > 0 && !neighborSet.has(node.slug) && node.slug !== selectedSlug;
        return (
          <GraphNode
            key={node.slug}
            node={node}
            name={school ? t(school.name, locale) : node.slug}
            selected={node.slug === selectedSlug}
            dimmed={dimmed}
            animate={animate}
            onSelect={onSelect}
          />
        );
      })}
    </group>
  );
}

export default function GraphScene({
  selectedSlug,
  onSelect,
  locale,
  animate,
}: {
  selectedSlug: string;
  onSelect: (slug: string) => void;
  locale: Locale;
  animate: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 13], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      frameloop={animate ? 'always' : 'demand'}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -6, -8]} intensity={0.4} color="#d9ad4f" />
      <Constellation selectedSlug={selectedSlug} onSelect={onSelect} locale={locale} animate={animate} />
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={8}
        maxDistance={20}
        autoRotate={false}
        rotateSpeed={0.6}
      />
    </Canvas>
  );
}
