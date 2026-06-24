import { describe, expect, it } from 'vitest';
import { schools } from '@/data/schools';
import {
  buildGraph,
  edgeType,
  fibonacciSphere,
  GRAPH_RADIUS,
  isIncident,
  neighbors,
} from './graph';

const graph = buildGraph(schools);

describe('fibonacciSphere', () => {
  it('returns one point per requested count', () => {
    expect(fibonacciSphere(8)).toHaveLength(8);
    expect(fibonacciSphere(0)).toHaveLength(0);
  });

  it('is deterministic', () => {
    expect(fibonacciSphere(8)).toEqual(fibonacciSphere(8));
  });

  it('places points on (or within) the sphere of the given radius', () => {
    for (const [x, y, z] of fibonacciSphere(8)) {
      const r = Math.sqrt(x * x + y * y + z * z);
      expect(r).toBeLessThanOrEqual(GRAPH_RADIUS + 1e-9);
    }
  });
});

describe('buildGraph', () => {
  it('has one node per school', () => {
    expect(graph.nodes).toHaveLength(schools.length);
    expect(new Set(graph.nodes.map((n) => n.slug)).size).toBe(schools.length);
  });

  it('produces edges that reference existing nodes only', () => {
    const slugs = new Set(graph.nodes.map((n) => n.slug));
    for (const edge of graph.edges) {
      expect(slugs.has(edge.source)).toBe(true);
      expect(slugs.has(edge.target)).toBe(true);
      expect(edge.source).not.toBe(edge.target);
    }
  });

  it('collapses reciprocal relations into a single undirected edge', () => {
    const keys = graph.edges.map((e) => [e.source, e.target].sort().join('|'));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('yields a connected graph (every school reachable)', () => {
    const adjacency = new Map<string, string[]>();
    for (const node of graph.nodes) adjacency.set(node.slug, []);
    for (const edge of graph.edges) {
      adjacency.get(edge.source)!.push(edge.target);
      adjacency.get(edge.target)!.push(edge.source);
    }
    const visited = new Set<string>();
    const stack = [graph.nodes[0].slug];
    while (stack.length) {
      const cur = stack.pop()!;
      if (visited.has(cur)) continue;
      visited.add(cur);
      stack.push(...adjacency.get(cur)!);
    }
    expect(visited.size).toBe(graph.nodes.length);
  });
});

describe('neighbors & edgeType', () => {
  it('reports symmetric neighbours', () => {
    for (const edge of graph.edges) {
      expect(neighbors(graph, edge.source)).toContain(edge.target);
      expect(neighbors(graph, edge.target)).toContain(edge.source);
    }
  });

  it('resolves the relation type in both directions', () => {
    const edge = graph.edges[0];
    expect(edgeType(graph, edge.source, edge.target)).toBe(edge.type);
    expect(edgeType(graph, edge.target, edge.source)).toBe(edge.type);
  });

  it('returns undefined for unconnected pairs', () => {
    expect(edgeType(graph, 'does-not-exist-a', 'does-not-exist-b')).toBeUndefined();
  });
});

describe('isIncident', () => {
  it('detects whether an edge touches a node', () => {
    const edge = graph.edges[0];
    expect(isIncident(edge, edge.source)).toBe(true);
    expect(isIncident(edge, edge.target)).toBe(true);
    expect(isIncident(edge, 'unrelated')).toBe(false);
  });
});
