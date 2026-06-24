# Design language & graph model

Philosophia Oriental keeps the structural discipline of **philosophia** but
trades its Greco-Roman "Codex × HUD" skin for an **East-Asian** visual language,
and its timeline for a **graph**.

## Palette

Two themes, both built from CSS custom properties in `src/app/globals.css`:

| Token | Light — "rice paper & cinnabar" | Dark — "sumi-ink night & lantern" |
| --- | --- | --- |
| `--bg` | `#fbf8f1` (washi cream) | `#0f1117` (ink night) |
| `--fg` | `#1c1a17` (sumi ink) | `#ece3d2` (warm paper) |
| `--gold` | `#b8860b` | `#d9ad4f` (lantern) |
| `--cinnabar` | `#c8432a` (vermilion seal) | `#df6244` |
| `--jade` | `#3f8a60` | `#5fa97f` |

Each school carries an `accent` hue; `--accent` is derived per school, and dark
mode lifts it toward lamplight with `oklch(from var(--accent-base) …)`.

## Typography

- **Serif** — Noto Serif: headings, names, quotes.
- **Sans** — Noto Sans: body and UI.
- **Mono** — JetBrains Mono: labels, readouts (uppercase, letter-spaced).
- **Brush** — Ma Shan Zheng: the wordmark glyph (東) and 404 (無) only.

## Motifs (zero binary assets)

- **Ideograph emblems** — each school's node and hero use its real glyph
  (道 Taoism, 儒 Confucianism, 法 Legalism, 墨 Mohism, 佛 Buddhism, 禅 Zen,
  ॐ Vedanta, 武 Bushidō). Authentic and free.
- **Ensō** — the incomplete brushed circle behind the hero emblem.
- **Seal-corner brackets** — frame every panel (`.bracket`).
- **Mist** — a soft radial gradient wash behind the page and graph stage.

All are CSS/SVG so they recolor with the theme and add no payload.

## The graph as the organising metaphor

Where philosophia arranges schools along time, here they form a **constellation
of ideas**. Edges are typed and styled:

| RelationType | Meaning | Edge style |
| --- | --- | --- |
| `lineage` | direct descent (Buddhism → Zen) | gold, solid, bold when incident |
| `influence` | shaped another (Confucianism → Bushidō) | jade, solid |
| `synthesis` | fusion (Taoism → Zen) | cinnabar, solid |
| `opposition` | tension/rivalry (Confucianism ↔ Legalism) | clay, **dashed** |

Selecting a node highlights its edges and neighbours and dims the rest, making
each school's place in the web legible at a glance. The **Connections panel**
under the dossier lists those neighbours and lets you travel along an edge.

## Layout

Nodes are placed deterministically on a sphere (Fibonacci distribution),
grouped by `region` (China · India · Japan) so culturally adjacent schools sit
near one another. Determinism keeps SSR stable and the layout unit-testable —
see `src/lib/graph.ts`.

## Accessibility

- The graph has a full **list mirror** (`GraphFallback`), default under
  `prefers-reduced-motion`, with native buttons and `aria-pressed`.
- Animations collapse to near-instant under reduced motion (global CSS rule).
- Color is never the only signal: edges also differ by dash; nodes carry text
  labels; selection uses borders and rings, not just hue.
