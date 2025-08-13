# Testing guide

This repo organizes E2E coverage into a critical always-on lane and optional suites.

Quick start
- Install deps and browsers:
  - pnpm install
  - npx playwright install --with-deps
- Run critical E2E locally (starts dev server automatically):
  - pnpm run test:e2e:critical

Running against a preview server
- Terminal A:
  - pnpm build && PORT=8080 pnpm preview
- Terminal B:
  - E2E_BASE_URL=http://localhost:8080 pnpm run test:e2e:critical

Optional suites (local)
- TripRequestForm (once implemented): pnpm run test:e2e:trip-request
- OAuth callback (mocked): pnpm run test:e2e:callback (optionally set MOCK_GOOGLE_OAUTH=1)
- Visual regression: pnpm run test:visual

CI
- PRs: e2e-smoke workflow runs only the critical suite against a preview server on port 8080.
- Optional workflow (manually trigger or nightly): .github/workflows/e2e-optional.yml
  - Dispatch with inputs run_trip, run_oauth, run_visual to run specific jobs
  - Nightly schedule runs all optional jobs

Notes
- Critical tests rely on test-mode auto-advance flags that avoid real Stripe/OAuth.
- For Stripe flows, the app creates sessions only after auth and binds userId in metadata.
- Visual tests are non-blocking and best run with stable UI baselines.

