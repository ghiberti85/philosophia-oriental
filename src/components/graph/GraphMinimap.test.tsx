import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { GraphMinimap } from './GraphMinimap';
import { buildGraph } from '@/lib/graph';
import { schools } from '@/data/schools';

expect.extend(toHaveNoViolations);

const graph = buildGraph(schools);

describe('GraphMinimap', () => {
  it('renders the SVG minimap with all school nodes', () => {
    const { container } = render(
      <GraphMinimap graph={graph} selectedSlug="confucianism" onSelect={() => {}} />,
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    const circles = container.querySelectorAll('circle');
    // Each node renders at least one circle; selected node gets two.
    expect(circles.length).toBeGreaterThanOrEqual(graph.nodes.length);
  });

  it('matches SVG snapshot', () => {
    const { container } = render(
      <GraphMinimap graph={graph} selectedSlug="confucianism" onSelect={() => {}} />,
    );
    expect(container.querySelector('svg')!.outerHTML).toMatchSnapshot();
  });

  it('highlights the selected node with a gold ring', () => {
    const { container } = render(
      <GraphMinimap graph={graph} selectedSlug="confucianism" onSelect={() => {}} />,
    );
    const rings = Array.from(container.querySelectorAll('circle')).filter(
      (c) => c.getAttribute('stroke') === 'var(--gold)',
    );
    expect(rings).toHaveLength(1);
  });

  it('calls onSelect when a node circle is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const { container } = render(
      <GraphMinimap graph={graph} selectedSlug="confucianism" onSelect={onSelect} />,
    );
    // Click the first <g> group (each wraps a node)
    const firstGroup = container.querySelector('svg g');
    expect(firstGroup).toBeTruthy();
    await user.click(firstGroup!);
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('toggles visibility when the minimap button is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <GraphMinimap graph={graph} selectedSlug="confucianism" onSelect={() => {}} />,
    );
    expect(container.querySelector('svg')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /hide minimap/i }));
    expect(container.querySelector('svg')).toBeNull();
    await user.click(screen.getByRole('button', { name: /show minimap/i }));
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = render(
      <GraphMinimap graph={graph} selectedSlug="confucianism" onSelect={() => {}} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
