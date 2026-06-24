import type { RelationType, Region, School } from '@/data/types';

/** A node in the knowledge graph (one school). */
export interface GraphNode {
  slug: string;
  emblem: string;
  accent: string;
  region: Region;
  /** Deterministic 3D position on the constellation sphere. */
  position: [number, number, number];
}

/** An undirected edge between two schools, carrying its relation semantics. */
export interface GraphEdge {
  source: string;
  target: string;
  type: RelationType;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/** Radius of the constellation sphere the nodes are laid out on. */
export const GRAPH_RADIUS = 5;

const REGION_ORDER: Region[] = ['china', 'india', 'japan'];

/** Canonical, order-independent key for an unordered pair of slugs. */
function edgeKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/**
 * Distributes `count` points evenly on a unit sphere using the deterministic
 * Fibonacci-sphere method (no randomness — identical output every run, which
 * keeps SSR markup stable and the layout unit-testable).
 */
export function fibonacciSphere(count: number, radius = GRAPH_RADIUS): [number, number, number][] {
  if (count <= 0) return [];
  if (count === 1) return [[0, 0, 0]];
  const points: [number, number, number][] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // from 1 to -1
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    points.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
  }
  return points;
}

/**
 * Builds the knowledge graph from the schools data: one node per school and
 * one undirected edge per relation (reciprocal duplicates collapsed). Nodes
 * are grouped by region before being placed on the sphere so that culturally
 * related schools sit near each other.
 */
export function buildGraph(schools: School[]): Graph {
  const slugSet = new Set(schools.map((s) => s.slug));

  // Cluster by region for a more legible constellation.
  const ordered = [...schools].sort((a, b) => {
    const ra = REGION_ORDER.indexOf(a.region);
    const rb = REGION_ORDER.indexOf(b.region);
    if (ra !== rb) return ra - rb;
    return a.slug.localeCompare(b.slug);
  });

  const positions = fibonacciSphere(ordered.length);
  const nodes: GraphNode[] = ordered.map((school, i) => ({
    slug: school.slug,
    emblem: school.emblem,
    accent: school.accent,
    region: school.region,
    position: positions[i],
  }));

  const seen = new Set<string>();
  const edges: GraphEdge[] = [];
  for (const school of schools) {
    for (const rel of school.relations) {
      if (!slugSet.has(rel.to)) continue; // skip dangling (also caught by tests)
      if (rel.to === school.slug) continue; // no self-loops
      const key = edgeKey(school.slug, rel.to);
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ source: school.slug, target: rel.to, type: rel.type });
    }
  }

  return { nodes, edges };
}

/** Slugs of every school directly connected to `slug` in the graph. */
export function neighbors(graph: Graph, slug: string): string[] {
  const result: string[] = [];
  for (const edge of graph.edges) {
    if (edge.source === slug) result.push(edge.target);
    else if (edge.target === slug) result.push(edge.source);
  }
  return result;
}

/** The relation type between two schools, if an edge connects them. */
export function edgeType(graph: Graph, a: string, b: string): RelationType | undefined {
  const key = edgeKey(a, b);
  return graph.edges.find((e) => edgeKey(e.source, e.target) === key)?.type;
}

/** True when an edge touches `slug` (used to highlight a selected node). */
export function isIncident(edge: GraphEdge, slug: string): boolean {
  return edge.source === slug || edge.target === slug;
}
