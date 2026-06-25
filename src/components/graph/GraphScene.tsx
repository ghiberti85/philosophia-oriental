'use client';

import { OrbitControls, QuadraticBezierLine, Stars } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, DepthOfField, EffectComposer, Vignette } from '@react-three/postprocessing';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AdditiveBlending, CanvasTexture, Group, Mesh, Sprite, Vector3 } from 'three';
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

/** Control point for an edge's arc: the midpoint bowed away from the centre. */
function arcControl(a: [number, number, number], b: [number, number, number]): [number, number, number] {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const mz = (a[2] + b[2]) / 2;
  const len = Math.hypot(mx, my, mz) || 1;
  const push = 1 + 1.4 / len; // bow proportionally outward
  return [mx * push, my * push, mz * push];
}

/** Soft radial sprite, used for the nebula clouds behind the constellation. */
let _cloud: CanvasTexture | null = null;
function cloudTexture(): CanvasTexture {
  if (_cloud) return _cloud;
  const s = 128;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,0.55)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.18)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2);
  ctx.fill();
  _cloud = new CanvasTexture(c);
  return _cloud;
}

/** A stream of "chi" motes flowing along an edge in the source→target direction. */
function ChiStream({
  a,
  b,
  control,
  color,
  count,
  incident,
  animate,
}: {
  a: [number, number, number];
  b: [number, number, number];
  control: [number, number, number];
  color: string;
  count: number;
  incident: boolean;
  animate: boolean;
}) {
  const refs = useRef<(Mesh | null)[]>([]);
  const va = useMemo(() => new Vector3(...a), [a]);
  const vb = useMemo(() => new Vector3(...b), [b]);
  const vc = useMemo(() => new Vector3(...control), [control]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const m = refs.current[i];
      if (!m) continue;
      const phase = i / count;
      const f = animate ? (t * 0.22 + phase) % 1 : (i + 0.5) / count;
      const omt = 1 - f;
      // Quadratic Bézier B(f) = (1-f)²A + 2(1-f)f·C + f²B
      m.position.set(
        omt * omt * va.x + 2 * omt * f * vc.x + f * f * vb.x,
        omt * omt * va.y + 2 * omt * f * vc.y + f * f * vb.y,
        omt * omt * va.z + 2 * omt * f * vc.z + f * f * vb.z,
      );
    }
  });
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }}>
          <sphereGeometry args={[incident ? 0.09 : 0.06, 10, 10]} />
          <meshBasicMaterial color={color} transparent opacity={incident ? 1 : 0.6} />
        </mesh>
      ))}
    </>
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

  useEffect(() => {
    flying.current = animate ? 1 : 0;
    if (!animate && controls) {
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

/** Slowly drifting starfield with a faint nebula for depth. */
function Sky({ animate, mobile }: { animate: boolean; mobile: boolean }) {
  const ref = useRef<Group>(null);
  const cloud = useMemo(() => cloudTexture(), []);
  const clouds = useMemo(
    () =>
      (
        [
          { pos: [-14, 8, -20], color: '#d9ad4f', scale: 26 },
          { pos: [16, -6, -22], color: '#5fa97f', scale: 30 },
          { pos: [4, 14, -26], color: '#6a6a9a', scale: 24 },
        ] as const
      ).slice(0, mobile ? 2 : 3),
    [mobile],
  );
  useFrame((_, delta) => {
    if (ref.current && animate) ref.current.rotation.y += delta * 0.01;
  });
  return (
    <group ref={ref}>
      {clouds.map((c, i) => (
        <sprite key={i} position={c.pos} scale={[c.scale, c.scale, 1]} raycast={() => null}>
          <spriteMaterial
            map={cloud}
            color={c.color}
            transparent
            opacity={mobile ? 0.04 : 0.06}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </sprite>
      ))}
      <Stars
        radius={42}
        depth={32}
        count={mobile ? 900 : 1800}
        factor={3.2}
        saturation={0}
        fade
        speed={animate ? 0.6 : 0}
      />
    </group>
  );
}

function Constellation({
  selectedSlug,
  onSelect,
  locale,
  animate,
  mobile,
}: {
  selectedSlug: string;
  onSelect: (slug: string) => void;
  locale: Locale;
  animate: boolean;
  mobile: boolean;
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
      {graph.edges.map((edge) => {
        const a = posBySlug.get(edge.source);
        const b = posBySlug.get(edge.target);
        if (!a || !b) return null;
        const incident = isIncident(edge, selectedSlug);
        const control = arcControl(a, b);
        const count = incident ? (mobile ? 2 : 3) : mobile ? 1 : 2;
        return (
          <group key={`${edge.source}-${edge.target}`}>
            <QuadraticBezierLine
              start={a}
              end={b}
              mid={control}
              color={RELATION_COLOR[edge.type]}
              lineWidth={incident ? 2.6 : 1.1}
              transparent
              opacity={incident ? 0.95 : 0.32}
              dashed={edge.type === 'opposition'}
              dashSize={0.3}
              gapSize={0.18}
            />
            <ChiStream
              a={a}
              b={b}
              control={control}
              color={RELATION_COLOR[edge.type]}
              count={count}
              incident={incident}
              animate={animate}
            />
          </group>
        );
      })}

      {graph.nodes.map((node, i) => {
        const school = getSchool(node.slug);
        const dimmed =
          selectedSlug !== node.slug && neighborSet.size > 0 && !neighborSet.has(node.slug);
        return (
          <GraphNode
            key={node.slug}
            node={node}
            index={i}
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
  const focusTarget = useMemo(() => new Vector3(...selectedPos), [selectedPos]);

  // Lighter effect set on small screens (no DoF, fewer stars/motes/clouds).
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Gentle idle auto-rotation that pauses while the user is dragging and
  // resumes a few seconds after they let go.
  const [autoRotate, setAutoRotate] = useState(animate);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    setAutoRotate(animate);
    return () => clearTimeout(idleTimer.current);
  }, [animate]);

  const bg = dark ? '#0b0d12' : '#f3ede2';

  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: 50 }}
      dpr={[1, 2]}
      frameloop={animate ? 'always' : 'demand'}
    >
      {/* Solid, theme-matched backdrop so bloom composites correctly. */}
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 16, 34]} />
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -6, -8]} intensity={0.4} color="#d9ad4f" />

      <Sky animate={animate} mobile={mobile} />
      <Constellation
        selectedSlug={selectedSlug}
        onSelect={onSelect}
        locale={locale}
        animate={animate}
        mobile={mobile}
      />
      <Rig targetPos={selectedPos} animate={animate} />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        minDistance={8}
        maxDistance={22}
        rotateSpeed={0.6}
        autoRotate={autoRotate}
        autoRotateSpeed={0.45}
        onStart={() => {
          clearTimeout(idleTimer.current);
          setAutoRotate(false);
        }}
        onEnd={() => {
          if (!animate) return;
          idleTimer.current = setTimeout(() => setAutoRotate(true), 3500);
        }}
      />

      <EffectComposer>
        <Bloom
          intensity={dark ? 0.85 : 0.4}
          luminanceThreshold={0.25}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        {/* Cinematic focus on the selected node — desktop only (DoF is costly). */}
        {!mobile && animate ? (
          <DepthOfField target={focusTarget} focalLength={0.015} bokehScale={2.2} height={480} />
        ) : (
          <></>
        )}
        <Vignette eskil={false} offset={0.32} darkness={dark ? 0.7 : 0.45} />
      </EffectComposer>
    </Canvas>
  );
}
