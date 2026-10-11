# Market Files — development workflow

Every change follows the same path. Nothing is ever pushed directly to `main`.

1. **Branch** — work happens on a development branch (for example `stage-0/safety-ci`).
2. **Checks** — GitHub Actions runs three checks on the pull request:
   - **Typecheck** — `npm ci` + `npm run typecheck`
   - **Build** — `npm ci` + `npm run build`
   - **Smoke tests** — production build + structural browser tests (`tests/smoke`)
3. **Preview** — Vercel builds a private Preview Deployment for the branch (Vercel Authentication).
4. **Review** — the owner opens the pull request, confirms the three checks are green, opens the
   Vercel preview link and inspects the site.
5. **Merge** — only the owner merges into `main`. Vercel then deploys production (MarketFiles.com).

## Rules
- Never push to, force-push or delete `main`.
- One major stage per branch / pull request.
- No unrelated design changes. Preserve Market Files branding and the protected systems
  (price pipeline, globe and country view, TradingView mounting, security headers, /files,
  /day, sitemap, robots, newsletter API logic, admin authentication).

## Repository layout
The repository root must contain `app/`, `components/`, `lib/` (with `lib/market/`),
`content/`, `scripts/`, `tools/`, `public/`, `db/`, `tests/` and `.github/` as folders.
Never upload files individually through GitHub's file picker: it drops the folders, and files
with the same name (`page.tsx`, `route.ts`) overwrite each other.

## Preview environment
Preview builds have no database, newsletter or admin credentials, so they are read-only:
they cannot write Time Machine records or create newsletter subscribers.

## Where to edit
See [DEVELOPING.md](../DEVELOPING.md). The **Build** check also verifies that the generated files
match `experience/source/market-files.html`.
