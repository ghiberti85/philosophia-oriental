# Security Policy

## Threat model

Philosophia Oriental is a **fully static** site. All content is curated and
compiled into the bundle at build time — there is no database, no server-side
user input, no authentication and no secrets. The only client state is a
best-quiz-score written to `localStorage`. This dramatically narrows the attack
surface: the main concerns are the dependency supply chain and client-side
content rendering.

## Hardening in place

- **Security headers** (`next.config.mjs`): a Content-Security-Policy
  (`default-src 'self'`, scoped Google Fonts, no framing), `X-Frame-Options:
  DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
  `Permissions-Policy` and HSTS.
- **No `dangerouslySetInnerHTML`** — all content is rendered as React text.
- **Input validation** — the only dynamic route parameter, `locale`, is checked
  with `isLocale()` and 404s otherwise.
- **CI** runs lint, tests and a build on every push/PR, plus an informational
  `npm audit`.

## A note on `npm audit`

Most advisories surfaced by `npm audit` are in **build-time / dev** transitive
dependencies (e.g. Workbox's `serialize-javascript`, `esbuild` via Vitest,
`glob`, `postcss`). They do not ship in the static runtime output. The audit
step in CI is therefore informational rather than blocking; dependency bumps are
handled via Dependabot.

## Reporting a vulnerability

Please open a private security advisory on GitHub, or email the maintainer.
Do not open a public issue for undisclosed vulnerabilities. We aim to
acknowledge reports within a few days.
