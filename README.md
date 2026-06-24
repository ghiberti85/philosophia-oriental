# 東 Philosophia Oriental

> **EN** · A bilingual, interactive encyclopedia of the great schools of **Eastern philosophy** — rendered as a navigable **3D knowledge graph**. Select a school in the constellation and its full dossier opens below: sages, core tenets, deep-dive essays, bibliography, connections and quizzes that are different every time you play.
>
> **PT-BR** · Uma enciclopédia interativa e bilíngue das grandes escolas da **filosofia oriental** — apresentada como um **grafo de conhecimento em 3D** navegável. Selecione uma escola na constelação e seu dossiê completo se abre logo abaixo: sábios, ideias centrais, ensaios de aprofundamento, bibliografia, conexões e quizzes diferentes a cada rodada.

![CI](https://github.com/ghiberti85/philosophia-oriental/actions/workflows/ci.yml/badge.svg)

This is the Eastern-philosophy companion to [**philosophia**](https://github.com/ghiberti85/philosophia): same engine and design discipline, but the timeline is replaced by an interactive **graph of influence, lineage, synthesis and dissent** between schools.

## ✨ Features

| Feature | Details |
| --- | --- |
| 🪐 **3D knowledge graph** | Eight schools as nodes in a constellation (react-three-fiber); edges encode lineage, influence, synthesis and opposition. Selecting a node opens its dossier below. |
| 🧭 **Accessible by design** | A keyboard- and screen-reader-friendly list view mirrors the graph and is the default under `prefers-reduced-motion`. |
| 🏯 **8 schools of thought** | Confucianism, Taoism, Legalism, Mohism, Buddhism, Zen, Vedanta, Bushidō — each with core ideas, sages, deep-dive essays and a curated bibliography. |
| 🧙 **15 sages** | Confucius, Mencius, Laozi, Zhuangzi, the Buddha, Nagarjuna, Bodhidharma, Dōgen, Shankara, Musashi and more — each with biography, contributions, sayings, traits and facts. |
| 🕸 **Connections panel** | Every school links back into the graph; jump straight to a related tradition. |
| 🎲 **Randomized quizzes** | Each round draws 5 random questions with shuffled options; best score per school and per sage persisted in `localStorage`. |
| 📜 **Quote of the day** | Deterministic daily rotation across every sage's sayings. |
| 🌗 **Dark / light mode** | `next-themes`, system-aware — "rice paper & cinnabar" (light) and "sumi-ink night & lantern" (dark). |
| 🌍 **i18n (EN / PT-BR)** | Type-safe localization: every `Localized<T>` record fails to compile if a translation is missing. |
| 🎴 **Oriental design system** | Ideographic node emblems (道, 儒, 法, 禅…), ensō, seigaiha and mist motifs — pure CSS, zero binary assets. |
| 📱 **PWA** | Installable, offline-capable via Workbox service worker and Web App Manifest. |
| ✅ **Content & graph integrity tests** | Vitest validates every translation, slug cross-reference, quiz option count, and that the relation graph is connected with no dangling edges. |

> Figure images are lightweight SVG **placeholders** for now; impactful AI-generated art (DALL-E) lands in a later phase.

## 🧱 Tech stack

| Layer | Tech |
| --- | --- |
| Framework | [Next.js 14](https://nextjs.org) — App Router, React 18, TypeScript strict, static generation per locale |
| 3D | [three.js](https://threejs.org) + [react-three-fiber](https://docs.pmnd.rs/react-three-fiber) + [drei](https://github.com/pmndrs/drei) |
| Styling | Tailwind CSS utilities + a custom CSS design system (`color-mix(in oklch)` adaptive tokens) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |
| PWA | [next-pwa](https://github.com/shadowwalker/next-pwa) + Workbox |
| Testing | [Vitest](https://vitest.dev) + Testing Library |

## 🚀 Getting started

```bash
npm install
npm run dev        # http://localhost:3000 (redirects to /en; /pt for Portuguese)
```

Other scripts:

```bash
npm test           # run the test suite once
npm run test:watch # watch mode
npm run lint       # eslint (next/core-web-vitals)
npm run build      # production build (static, per-locale)
npm start          # serve the production build
```

## 📁 Project structure

```
src/
├── app/[locale]/              # App Router — every route pre-rendered in /en and /pt
│   ├── page.tsx               # GraphDashboard (the one-page experience)
│   └── (content)/             # schools/ and philosophers/ index + [slug] detail pages
├── components/
│   ├── graph/                 # GraphDashboard, GraphScene (r3f), GraphNode, GraphFallback
│   └── dashboard/             # SchoolPanels + modals, Philosopher, QuizModal, ui primitives
├── data/                      # types, schools, school-details, philosophers, quizzes, dictionary
├── lib/                       # i18n, graph (pure layout/adjacency), quiz engine, seeded RNG
└── test/                      # Vitest setup
public/figures/                # SVG placeholders (→ DALL-E art later)
docs/                          # ARCHITECTURE.md, DESIGN.md, ADDING-CONTENT.md
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for design decisions, [docs/DESIGN.md](docs/DESIGN.md)
for the oriental design language and graph model, and [docs/ADDING-CONTENT.md](docs/ADDING-CONTENT.md)
to add a school, sage, relation, quiz question or language.

## 🗺 Roadmap (Phase 2 — high "wow factor")

**Shipped:** camera fly-to on selection · energy motes flowing along edges · bloom postprocessing ·
drifting starfield · relation legend · ensō intro animation.

**Next:** DALL-E figures and scenes · procedural 3D busts on sage pages · relation minimap ·
volumetric mist · sound · Vercel deploy with OG images.

## 🔐 Security & 📄 License

See [SECURITY.md](SECURITY.md) for the disclosure policy and a note on the static-site threat model.
Licensed under [MIT](LICENSE) — content curated for educational purposes.

## ☁️ Deployment

Deploys to Vercel. See [docs/DEPLOY.md](docs/DEPLOY.md) for continuous deployment —
either Vercel's native Git integration (recommended) or the in-repo GitHub Actions workflow.
