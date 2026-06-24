# Contributing

Thanks for your interest! This is a portfolio project, but contributions and
suggestions are welcome.

## Development

```bash
npm install
npm run dev
```

Before opening a PR, make sure the full check passes locally:

```bash
npm run lint
npm test
npm run build
```

## Guidelines

- **TypeScript strict** — no `any` escape hatches; let the types guide you.
- **Content lives in `src/data/`** as typed `Localized<T>` records. Every string
  must be present in **both** locales (`en` and `pt`) or the build fails. See
  [docs/ADDING-CONTENT.md](docs/ADDING-CONTENT.md).
- **Keep logic out of the WebGL canvas.** Pure, testable logic belongs in
  `src/lib/` (see `graph.ts`, `quiz.ts`).
- **Accessibility is not optional** — every interactive graph affordance must
  have a keyboard/screen-reader equivalent, and animation must respect
  `prefers-reduced-motion`.
- **Tests** — add or extend tests in `src/**/*.test.ts(x)` for new logic or
  content rules.

## Commit style

Small, focused commits with descriptive messages. CI must be green before merge.
