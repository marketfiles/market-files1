# Market Files Stage 0 workflow

This branch establishes the safety/verification workflow only. It must not change the production site design or behavior.

## Rules
- Never push Phase 1 work directly to `main`.
- Work in a branch and open a pull request.
- GitHub Actions must pass before merge.
- Review the Vercel Preview before merge.
- Do not merge if the globe, country view, live prices, TradingView, dashboard, tools, navigation, or responsive layout regress.

## Stage 0
1. Create a deterministic `package-lock.json`.
2. Add read-only CI for typecheck, build, and smoke tests.
3. Verify a Vercel Preview deployment.
4. Protect `main` after the required check names exist.
5. Stop before Stage 1.

The temporary lockfile bootstrap workflow is removed before Stage 0 is considered complete.
