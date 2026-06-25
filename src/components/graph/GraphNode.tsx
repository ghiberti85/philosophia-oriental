'use client';

import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AdditiveBlending,
  BackSide,
  CanvasTexture,
  DoubleSide,
  type Mesh,
  type MeshStandardMaterial,
  type RingGeometry,
  type Sprite,
  Vector3,
} from 'three';
import type { GraphNode as GraphNodeData } from '@/lib/graph';

/** Soft radial "lantern" glow, shared by every node (tinted per accent). */
let _glow: CanvasTexture | null = null;
function glowTexture(): CanvasTexture {
  if (_glow) return _glow;
  const s = 128;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,0.9)');
  g.addColorStop(0.3, 'rgba(255,255,255,0.35)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2);
  ctx.fill();
  _glow = new CanvasTexture(c);
  return _glow;
}

/** The school's ideogram (道, 儒, ॐ …) painted to a texture for a 3D billboard. */
function glyphTexture(glyph: string): CanvasTexture {
  const s = 200;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, s, s);
  ctx.font = `700 ${Math.round(s * 0.64)}px "Noto Serif","Ma Shan Zheng",Georgia,serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  const cx = s / 2;
  const cy = s / 2 + s * 0.02;
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 10;
  ctx.lineWidth = s * 0.05;
  ctx.strokeStyle = 'rgba(18,13,7,0.7)';
  ctx.strokeText(glyph, cx, cy);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#f7efdd';
  ctx.fillText(glyph, cx, cy);
  const tex = new CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

export function GraphNode({
  node,
  name,
  selected,
  dimmed,
  animate,
  index,
  onSelect,
}: {
  node: GraphNodeData;
  name: string;
  selected: boolean;
  dimmed: boolean;
  animate: boolean;
  index: number;
  onSelect: (slug: string) => void;
}) {
  const core = useRef<Mesh>(null);
  const shell = useRef<Mesh>(null);
  const ring = useRef<Mesh>(null);
  const ringGeom = useRef<RingGeometry>(null);
  const halo = useRef<Sprite>(null);
  const glyphSprite = useRef<Sprite>(null);
  const grow = useRef(selected ? 1.35 : 1);
  const born = useRef<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const active = selected || hovered;

  const { camera } = useThree();
  const nodePos = useMemo(() => new Vector3(...node.position), [node.position]);
  const glow = useMemo(() => glowTexture(), []);

  // Re-paint the glyph once the CJK/Devanagari webfonts have loaded so it isn't
  // baked with a fallback serif on first render.
  const [fontTick, setFontTick] = useState(0);
  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => alive && setFontTick((n) => n + 1));
    return () => {
      alive = false;
    };
  }, []);
  // fontTick intentionally re-runs this once webfonts are ready.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const glyph = useMemo(() => glyphTexture(node.emblem), [node.emblem, fontTick]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Staggered intro: each node eases up from nothing on first appearance.
    let intro = 1;
    if (animate) {
      if (born.current === null) born.current = t;
      const local = (t - born.current - index * 0.09) / 0.6;
      const p = Math.max(0, Math.min(1, local));
      intro = 1 - Math.pow(1 - p, 3); // easeOutCubic
    }

    const targetGrow = active ? 1.35 : 1;
    grow.current = animate
      ? grow.current + (targetGrow - grow.current) * Math.min(1, delta * 6)
      : targetGrow;
    const breathe = selected && animate ? 1 + 0.05 * Math.sin(t * 2.2) : 1;
    const scale = intro * grow.current * breathe;

    if (core.current) {
      core.current.scale.setScalar(scale);
      const m = core.current.material as MeshStandardMaterial;
      m.emissiveIntensity =
        (active ? 0.95 : 0.5) + (selected && animate ? 0.25 * Math.sin(t * 2.2) : 0);
      m.opacity = dimmed ? 0.25 : 1;
    }
    if (shell.current) {
      shell.current.scale.setScalar(scale * 1.55);
      (shell.current.material as MeshStandardMaterial).opacity = (dimmed ? 0.05 : 0.14) * intro;
    }
    if (ring.current) {
      ring.current.scale.setScalar(1);
      ring.current.lookAt(camera.position);
      if (animate) ring.current.rotateZ(t * 0.5);
      (ring.current.material as unknown as { opacity: number }).opacity =
        dimmed ? 0.12 : active ? 0.85 : 0.4;
      // Ensō "brush stroke": reveal the ring's triangles along its arc on intro.
      if (ringGeom.current?.index) {
        const total = ringGeom.current.index.count;
        ringGeom.current.setDrawRange(0, Math.max(0, Math.floor(total * intro)));
      }
    }
    if (halo.current) {
      const hs = (active ? 2.6 : 1.9) * Math.max(0.6, scale);
      halo.current.scale.set(hs, hs, 1);
      (halo.current.material as unknown as { opacity: number }).opacity =
        (dimmed ? 0.15 : active ? 0.9 : 0.5) * intro;
    }
    if (glyphSprite.current) {
      // Keep the ideogram on the camera-facing front of the orb.
      const dir = camera.position.clone().sub(nodePos).normalize();
      glyphSprite.current.position.copy(dir.multiplyScalar(0.42 * Math.max(0.7, scale)));
      const gs = 0.9 * intro * (active ? 1.12 : 1);
      glyphSprite.current.scale.set(gs, gs, 1);
      (glyphSprite.current.material as unknown as { opacity: number }).opacity =
        (dimmed ? 0.3 : 1) * intro;
    }
  });

  const noRaycast = () => null;

  return (
    <group position={node.position}>
      {/* Generous, invisible hit target (good for touch). */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.slug);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>

      {/* Lantern halo */}
      <sprite ref={halo} raycast={noRaycast} renderOrder={-1}>
        <spriteMaterial
          map={glow}
          color={node.accent}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          opacity={0.5}
        />
      </sprite>

      {/* Translucent fresnel-ish shell */}
      <mesh ref={shell} raycast={noRaycast}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial
          color={node.accent}
          emissive={node.accent}
          emissiveIntensity={0.4}
          transparent
          opacity={0.14}
          side={BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Glowing core */}
      <mesh ref={core} raycast={noRaycast}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={node.accent}
          emissive={node.accent}
          emissiveIntensity={0.5}
          roughness={0.32}
          metalness={0.12}
          transparent
        />
      </mesh>

      {/* Open ensō ring */}
      <mesh ref={ring} raycast={noRaycast}>
        <ringGeometry ref={ringGeom} args={[0.6, 0.7, 48, 1, 0, Math.PI * 1.8]} />
        <meshBasicMaterial
          color={node.accent}
          transparent
          opacity={0.4}
          side={DoubleSide}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Ideogram billboard */}
      <sprite ref={glyphSprite} raycast={noRaycast} renderOrder={11}>
        <spriteMaterial map={glyph} transparent depthWrite={false} />
      </sprite>

      <Html
        center
        distanceFactor={10}
        style={{ pointerEvents: dimmed ? 'none' : 'auto', opacity: dimmed ? 0.25 : 1 }}
        zIndexRange={[10, 0]}
      >
        <button
          className={`gnode-label${selected ? ' is-selected' : ''}`}
          onClick={() => onSelect(node.slug)}
          tabIndex={-1}
          style={{ ['--accent-base' as string]: node.accent }}
        >
          <span className="gnode-label__name">{name}</span>
        </button>
      </Html>
    </group>
  );
}
