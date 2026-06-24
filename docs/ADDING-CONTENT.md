# Adding content

All content is typed TypeScript under `src/data/`. The integrity test
(`src/data/data-integrity.test.ts`) will fail CI if anything is missing or a
reference dangles, so follow these steps and run `npm test`.

Every translatable value is a `Localized<T> = { en: …, pt: … }`. Omitting a
locale is a **compile error** — that is intentional.

## Add a school (a graph node)

1. Append a `School` to `src/data/schools.ts`:
   - `slug`, `name`, `period`, `tagline`, `description`, four `coreIdeas`;
   - `region` (`'china' | 'india' | 'japan'`) and a single-glyph `emblem`;
   - `accent` hex color;
   - `philosopherSlugs` (must exist in `philosophers.ts`);
   - `relations`: edges to other schools — list each undirected edge **once**
     (the graph derives the reverse direction). `{ to, type }` where `type` is
     `influence | opposition | synthesis | lineage`.
   - optional `keyWorks` (bilingual title/author/year/note).
2. Optionally add deep-dive essays in `src/data/school-details.ts`:
   `ideaDetails` must have **the same length** as `coreIdeas`.
3. Add at least one sage and quiz questions (below).

## Add a sage (philosopher)

Append a `Philosopher` to `src/data/philosophers.ts` with `slug`, `name`,
`years`, `birthplace`, `epithet`, `schoolSlugs` (each school must list the sage
back in its `philosopherSlugs`), `biography`, `contributions`, `quotes`,
`traits`, `facts`, and an optional `figureImage` (`/figures/<slug>.svg`).

## Add quiz questions

Append `QuizQuestion`s to `src/data/quizzes.ts`. **Every sage must have at least
one question.** Convention: the **first option is the correct answer** — the
engine shuffles options at runtime. Each question needs four **distinct** options
per locale and a unique `id`.

## Add a UI string

Add the key to `src/data/dictionary.ts` (both locales) and use it via
`t(dict.myKey, locale)`.

## Add a language

1. Extend `LOCALES` in `src/lib/i18n.ts` (e.g. `['en', 'pt', 'es']`) and add the
   label / html-lang mappings.
2. The compiler will now flag every `Localized` record missing the new locale.
   Fill them in across the data files.
3. `generateStaticParams` will pre-render the new locale automatically.

## Verify

```bash
npm test      # integrity + logic + component tests
npm run build # type-check + static generation
```
