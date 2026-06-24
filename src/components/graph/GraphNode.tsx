'use client';

import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import type { Mesh } from 'three';
import type { GraphNode as GraphNodeData } from '@/lib/graph';

export function GraphNode({
  node,
  name,
  selected,
  dimmed,
  animate,
  onSelect,
}: {
  node: GraphNodeData;
  name: string;
  selected: boolean;
  dimmed: boolean;
  animate: boolean;
  onSelect: (slug: string) => void;
}) {
  const mesh = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const active = selected || hovered;

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const target = active ? 1.35 : 1;
    // ease scale toward target
    const cur = mesh.current.scale.x;
    const next = animate ? cur + (target - cur) * Math.min(1, delta * 6) : target;
    mesh.current.scale.setScalar(next);
  });

  const opacity = dimmed ? 0.25 : 1;

  return (
    <group position={node.position}>
      <mesh
        ref={mesh}
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
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color={node.accent}
          emissive={node.accent}
          emissiveIntensity={active ? 0.9 : 0.45}
          roughness={0.35}
          metalness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>

      <Html center distanceFactor={10} style={{ pointerEvents: dimmed ? 'none' : 'auto', opacity }} zIndexRange={[10, 0]}>
        <button
          className={`gnode-label${selected ? ' is-selected' : ''}`}
          onClick={() => onSelect(node.slug)}
          tabIndex={-1}
          style={{ ['--accent-base' as string]: node.accent }}
        >
          <span className="gnode-label__emblem" aria-hidden="true">{node.emblem}</span>
          <span className="gnode-label__name">{name}</span>
        </button>
      </Html>
    </group>
  );
}
