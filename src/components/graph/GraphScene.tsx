'use client';

import { Line, OrbitControls, Stars } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useEffect, useMemo, useRef } from 'react';
import { Group, Mesh, Vector3 } from 'three';
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

/** A glowing mote of "energy" travelling along an edge. */
function EdgePulse({
  a,
  b,
  color,
  phase,
  incident,
  animate,
}: {
  a: [number, number, number];
  b: [number, number, number];
  color: string;
  phase: number;
  incident: boolean;
  animate: boolean;
}) {
  const ref = useRef<Mesh>(null);
  const va = useMemo(() => new Vector3(...a), [a]);
  const vb = useMemo(() => new Vector3(...b), [b]);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const frac = animate ? (clock.getElapsedTime() * 0.22 + phase) % 1 : 0.5;
    ref.current.position.lerpVectors(va, vb, frac);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[incident ? 0.1 : 0.07, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={incident ? 1 : 0.7} />
    </mesh>
  );
}

/** Eases the camera and orbit target toward the selected node on change. */
function Rig({ targetPos, animate }: { targetPos: [number, number, number]; animate: boolean }) {
  const controls = useThree((s) => s.controls) as unknown as
    | { target: Vector3; update: () => void }
    | null;
  const { camera } = useThree();
  const flying = useRef(0);
  const node = useMemo(() => new Vector3(...targetPos), [targetPos]);

  // Re-arm the flight whenever the selected node changes.
  useEffect(() => {
    flying.current = animate ? 1 : 0;
    if (!animate && controls) {
      // Reduced motion: snap instantly.
      controls.target.copy(node);
      const dir = node.clone().normalize();
      camera.position.copy(dir.multiplyScalar(node.length() + 8));
      controls.update();
    }
  }, [node, animate, controls, camera]);

  useFrame(() => {
    if (!controls || flying.current === 0) return;
    const desired = node.clone().normalize().multiplyScalar(node.length() + 8);
    controls.target.lerp(node, 0.07);
    camera.position.lerp(desired, 0.07);
    controls.update();
    if (controls.target.distanceTo(node) < 0.05) flying.current = 0;
  });

  return null;
}

/** Slowly drifting starfield for depth (visible mainly in dark mode). */
function DriftingStars({ animate }: { animate: boolean }) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (ref.current && animate) ref.current.rotation.y += delta * 0.01;
  });
  return (
    <group ref={ref}>
      <Stars radius={40} depth={30} count={1400} factor={3} saturation={0} fade speed={0.4} />
    </group>
  );
}

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

  return (
    <group>
      {graph.edges.map((edge, i) => {
        const a = posBySlug.get(edge.source);
        const b = posBySlug.get(edge.target);
        if (!a || !b) return null;
        const incident = isIncident(edge, selectedSlug);
        return (
          <group key={`${edge.source}-${edge.target}`}>
            <Line
              points={[a, b]}
              color={RELATION_COLOR[edge.type]}
              lineWidth={incident ? 2.6 : 1.1}
              transparent
              opacity={incident ? 0.95 : 0.35}
              dashed={edge.type === 'opposition'}
              dashSize={0.3}
              gapSize={0.18}
            />
            <EdgePulse
              a={a}
              b={b}
              color={RELATION_COLOR[edge.type]}
              phase={(i * 0.37) % 1}
              incident={incident}
              animate={animate}
            />
          </group>
        );
      })}

      {graph.nodes.map((node) => {
        const school = getSchool(node.slug);
        const dimmed =
          selectedSlug !== node.slug && neighborSet.size > 0 && !neighborSet.has(node.slug);
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
  dark,
}: {
  selectedSlug: string;
  onSelect: (slug: string) => void;
  locale: Locale;
  animate: boolean;
  dark: boolean;
}) {
  const selectedPos = useMemo<[number, number, number]>(() => {
    const graph = buildGraph(schools);
    return graph.nodes.find((n) => n.slug === selectedSlug)?.position ?? [0, 0, 0];
  }, [selectedSlug]);

  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: 50 }}
      dpr={[1, 2]}
      frameloop={animate ? 'always' : 'demand'}
    >
      {/* Solid, theme-matched backdrop so bloom composites correctly. */}
      <color attach="background" args={[dark ? '#0b0d12' : '#f3ede2']} />
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -6, -8]} intensity={0.4} color="#d9ad4f" />

      <DriftingStars animate={animate} />
      <Constellation selectedSlug={selectedSlug} onSelect={onSelect} locale={locale} animate={animate} />
      <Rig targetPos={selectedPos} animate={animate} />

      <OrbitControls makeDefault enablePan={false} enableZoom minDistance={8} maxDistance={22} rotateSpeed={0.6} />

      <EffectComposer>
        <Bloom
          intensity={dark ? 0.85 : 0.4}
          luminanceThreshold={0.25}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
