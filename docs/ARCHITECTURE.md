# Architecture

This document explains the main design decisions behind Philosophia Oriental.
It is the Eastern-philosophy companion to **philosophia**, sharing its engine
and conventions; the defining difference is that a **24-century timeline is
replaced by an interactive knowledge graph**.

## Goals

1. **Portfolio quality** — clean, idiomatic, typed, tested code.
2. **Performance** — everything that can be static *is* static. The whole site
   is pre-rendered per locale at build time; the only meaningful client-side
   JavaScript is the quiz engine and the WebGL graph (never server-rendered,
   never blocking first paint).
3. **Wow factor on a budget** — no heavy binary assets committed: figures are
   tiny SVG placeholders, node emblems are real ideographs, and every motif
   (ensō, seigaiha, mist) is pure CSS.

## Stack choice

**Next.js 14 (App Router)** with React 18 and TypeScript strict. Because all
content is curated (not user-generated) there is no database — content lives in
typed TypeScript modules under `src/data/`, giving compile-time validation of
every record and translation, zero-latency "queries", and diffable content in
code review.

## The knowledge graph

The conceptual heart of the project. The data shape lives in `src/data/types.ts`:

```ts
type RelationType = 'influence' | 'opposition' | 'synthesis' | 'lineage';
interface SchoolRelation { to: string; type: RelationType; note?: Localized }
interface School { /* … */ region: Region; emblem: string; relations: SchoolRelation[] }
```

`src/lib/graph.ts` is a **pure, fully unit-tested** module — no WebGL — that:

- `buildGraph(schools)` turns schools into nodes and **undirected** edges
  (reciprocal relations collapsed; self-loops and dangling targets dropped);
- lays nodes out **deterministically** on a sphere via the Fibonacci-sphere
  method, grouped by `region`, so SSR markup is stable and the layout is
  testable (`fibonacciSphere`);
- exposes `neighbors`, `edgeType` and `isIncident` for the UI.

Keeping all graph logic outside the canvas means the WebGL surface stays near
zero and the interesting behaviour is covered by `src/lib/graph.test.ts` and the
data-integrity suite (which asserts the graph is connected with no dangling
edges).

## Page composition

`src/app/[locale]/page.tsx` renders `GraphDashboard`, the one-page experience:

| Region | Component | Description |
|---|---|---|
| top | `GraphScene` / `GraphFallback` | The constellation (3D) or its accessible list mirror |
| below | `SchoolPanels` | The selected school's dossier |

`GraphDashboard` owns `selectedSlug`. Selecting a node (in 3D, in the fallback
list, or via the Connections panel) updates it and smoothly scrolls the dossier
into view. The default node is the graph's hub, Confucianism.

### The 3D scene

`GraphScene` is loaded with `next/dynamic` + `ssr: false`. It renders nodes as
emissive spheres with ideograph labels (drei `Html`), edges as `Line`s colored
and dashed by relation type, and orbit controls. Hovering or selecting a node
highlights its incident edges and dims the rest. Auto-rotation and scale easing
are disabled under `prefers-reduced-motion` (the scene then runs `frameloop="demand"`).

The background `Sky` component layers translucent nebula sprites with a
custom `TwinklingStars` — a `ShaderMaterial`-based `Points` mesh where
per-vertex attributes (`twinkleSpeed`, `twinklePhase`, `twinkleBase`) drive
independent GLSL flicker animations: ~40 % of stars flicker fast, ~30 % pulse
slowly, and ~30 % remain static, creating natural variety at zero JS cost.

### Accessibility

`GraphFallback` presents the same graph as schools grouped by region — native
focusable buttons with `aria-pressed`. It is the **default** under reduced
motion and is always reachable via the 3D / ☰ toggle, so keyboard and
screen-reader users have a first-class path to every school.

## Dashboard panels

`SchoolPanels` (`src/components/dashboard/`) renders six framed panels:

| Area | Component | Description |
|---|---|---|
| hero | `Hero` | School name + emblem, region · period, tagline, dossier button |
| stats | `Stats` + `StatModal` | Sages, Core Tenets, Quiz Pool, Bibliography |
| ideas | `Tenets` + `IdeaModal` | Core ideas; each opens a deep-dive essay |
| thinkers | `Thinkers` + `PhilosopherModal` | Sage cards → accordion dossier |
| context | `ContextQuiz` + `ContextModal` | Description + long context + quiz CTA |
| connections | `Connections` | Related schools → re-select that node in the graph |

The **Connections panel replaces philosophia's historical-events panel**, tying
each dossier back into the graph.

## Internationalization

A deliberate lightweight custom i18n layer (`src/lib/i18n.ts`): the URL carries
the locale (`/en`, `/pt`; `/` redirects via `next.config.mjs`), and every
translatable value is a `Localized<T> = Record<Locale, T>`. Adding a locale
means extending one tuple; the compiler then flags every missing translation,
and `data-integrity.test.ts` double-checks at runtime. `generateStaticParams`
pre-renders every page in every locale.

## Theming

`next-themes` toggles a `.dark` class on `<html>`. CSS custom properties
(`--bg`, `--fg`, `--accent`, …) drive everything; per-school accent colors use
`color-mix(in oklch)`, and dark mode lifts each hue toward lantern light via
`oklch(from …)`.

## Quiz engine

Pure logic in `src/lib/quiz.ts` + `src/lib/random.ts`: `sample` draws N
questions, `prepareQuestion` shuffles the four options (convention: first option
= correct, tracked through the shuffle), both accept an injectable RNG
(`mulberry32`) for deterministic tests. `QuizModal` is an `intro → playing →
results` state machine persisting the best score per scope in `localStorage`.

## Testing strategy

- **Pure logic**: exhaustive unit tests with seeded RNG (shuffle, sample, score
  boundaries) and the graph (connectivity, dedup, deterministic layout).
- **Content**: a data-integrity suite validates every translation, slug
  cross-reference, relation target, emblem, option count and id uniqueness —
  content bugs fail CI, not production.
- **Components**: Testing Library drives a full quiz round through the real
  engine (no mocks).
- The WebGL canvas is intentionally not unit-tested (jsdom has no GL); its logic
  lives in `lib/graph.ts`.

## CI

`.github/workflows/ci.yml` runs lint, tests and a production build on every
push/PR, plus an informational `npm audit`.
