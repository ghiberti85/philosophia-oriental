# Deployment (Vercel)

This project is a static Next.js 14 app and deploys to Vercel with zero special
configuration (`vercel.json` just pins the framework). There are two ways to get
**continuous deployment** — pick **one** (running both deploys twice).

---

## Option A — Vercel native Git integration (recommended) ✅

The same setup as the `philosophia` project: zero secrets, automatic **preview
deployments for every PR**, and production deploys on every push to `main`.

1. Go to <https://vercel.com/new> (team **ghiberti85's projects**).
2. **Import** the `ghiberti85/philosophia-oriental` repository.
3. Framework is auto-detected as **Next.js** — leave the defaults
   (Build `next build`, Output handled automatically). No env vars are needed.
4. Click **Deploy**.

That's it. From now on:
- every push to `main` → **production** deploy;
- every pull request → a **preview** deploy with its own URL (commented on the PR).

To change the production branch or domains later: **Project → Settings → Git / Domains**.

> If you ever rename/remove the repo, reconnect under **Project → Settings → Git**.

---

## Option B — GitHub Actions (in-repo CD) ⚙️

Use this if you prefer the pipeline to live in the repository instead of Vercel's
Git integration. The workflow is `.github/workflows/deploy.yml` and is **inert
until you opt in**.

1. **Variables** (Settings → Secrets and variables → Actions → *Variables*):
   - `ENABLE_VERCEL_DEPLOY` = `true`
2. **Secrets** (Settings → Secrets and variables → Actions → *Secrets*):
   - `VERCEL_TOKEN` — create at <https://vercel.com/account/tokens>
   - `VERCEL_ORG_ID` — `team_fMJ7afMc8d1yvhtffVh2oAMB`
   - `VERCEL_PROJECT_ID` — the project's ID (`prj_…`), found at
     **Project → Settings → General**. The project must exist first — create it
     once with Option A's import, or by running `vercel link` locally.

On push to `main` it deploys to **production**; on PRs it deploys a **preview**.

> Do **not** enable Option B while Option A's Git integration is connected, or
> each push will deploy twice.

---

## Local production check

```bash
npm run build && npm start   # serves the production build at http://localhost:3000
```

## Notes

- Security headers and the `/` → `/en` redirect come from `next.config.mjs` and
  are honored on Vercel automatically.
- `next-pwa` generates the service worker at build time; it is disabled in dev.
