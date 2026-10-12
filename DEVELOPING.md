# Developing Market Files

This repository contains everything needed to reproduce the Market Files website.
Nothing important lives outside it.

## Which files to edit

| You want to change… | Edit this | Then |
|---|---|---|
| Anything in the main site experience: homepage, globe, country view, navigation, section pages, Dashboard, Tools, heat map, styling, copy | `experience/source/market-files.html` | `npm run experience:build` and commit the source **and** the regenerated files |
| Live-price behaviour in production | `tools/livefeed.js` (protected) | `npm run experience:build` |
| TradingView, Google search and satellite-globe code that only runs in production | `tools/production.js` (protected) | `npm run experience:build` |
| How the source is turned into production files | `tools/build_experience.py` | `npm run experience:build` |
| Server-rendered pages (`/files`, `/files/[slug]`, `/day/[date]`, `/blog`, `/admin`) | `app/**/page.tsx`, `components/SiteChrome.tsx` | nothing extra |
| API routes (prices, news, top stories, country data, newsletter, Time Machine) | `app/api/**/route.ts`, `lib/**` | nothing extra |
| Articles | `content/articles.json` (the only place articles are edited) | `npm run experience:build` (copies them into the source's generated article region) and commit the result |
| Time Machine events | `content/events.json` | nothing extra |
| Security headers | `next.config.ts` (protected) | nothing extra |

### Never edit these by hand

The region between `ARTICLES:BEGIN` and `ARTICLES:END` inside `experience/source/market-files.html` is also generated, from `content/articles.json`. Change articles there, not in the region. `npm run experience:check` fails if the region is stale.

These three files are **generated** from `experience/source/market-files.html`.
Each starts with a `GENERATED … DO NOT EDIT` line, and any manual edit is overwritten
the next time the generator runs.

- `public/experience/market-files.js`
- `app/globals.css`
- `app/experience-shell.ts`

## The build

```
experience/source/market-files.html   (source of truth)
  + tools/runtime.js, tools/livefeed.js, tools/production.js
        │  npm run experience:build   (python3 tools/build_experience.py)
        ▼
public/experience/market-files.js · app/globals.css · app/experience-shell.ts   (generated, committed)
        │  npm run build   (next build)
        ▼
Vercel deployment
```

- The generator is deterministic: the same source always produces byte-identical output.
- Generated files are committed, so Vercel does not need Python.
- CI runs `npm run experience:check` in the **Build** check. If someone edits the source without
  regenerating, or edits a generated file by hand, the check fails and names the stale file.

## Commands

| Command | What it does |
|---|---|
| `npm ci` | Install exact dependency versions from `package-lock.json` |
| `npm run experience:build` | Regenerate the three generated files from the source |
| `npm run experience:check` | Verify the generated files match the source (no changes made) |
| `npm run typecheck` | TypeScript check |
| `npm run build` | Production Next.js build |
| `npm run test` | Structural smoke tests (needs a production build) |

Requirements: Node 22, Python 3 (generator only).

## Previewing the source on its own

`experience/source/market-files.html` also opens directly in a browser. In that mode it uses
practice prices (clearly labelled "simulated"). Real prices exist only in the Next.js app,
where `tools/livefeed.js` replaces the practice feed and missing prices show as "—".

## Protected systems

Change these only when necessary and justified, in their own pull request:
`lib/market/quotes.ts`, `lib/market/symbols.ts`, `tools/livefeed.js`, `tools/production.js`,
security headers in `next.config.ts`, `app/files`, `app/files/[slug]`, `app/day/[date]`,
sitemap, robots, newsletter API logic, admin authentication.

## Known follow-ups (planned stages, not bugs to fix ad hoc)

- Main sections use `#/` links; real URLs arrive in Stage 5.

See `docs/WORKFLOW.md` for the branch → checks → preview → merge process.
