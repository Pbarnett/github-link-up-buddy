# Contributing Guide

Thank you for contributing! This project uses pnpm, TypeScript, Vitest, Playwright, and Supabase. Please follow the steps below to get set up and to understand the CI/CD and enforcement policies.

1) Local setup
- Prereqs: Node 20+, pnpm via Corepack (Corepack auto-enabled in CI)
- Install deps: pnpm install
- Dev server: pnpm run dev (Vite app + local Express server)
- Type-check: pnpm run tsc or pnpm run type-check
- Lint: pnpm run lint
- Format: pnpm run format (check-only: pnpm run format:check)

2) Git hooks (required)
- Enable repository hooks (blocks commits/pushes to main, enforces branch naming):
  - ./scripts/development/git-hooks-setup.sh
- Policy: Never commit or push directly to main. Use branches: feat/<topic>, fix/<topic>, etc.

3) Tests
- Unit/integration: pnpm run test (or per-project: test:unit, test:integration)
- Edge functions: pnpm run test:functions (enforces coverage thresholds via edge project)
- E2E full: pnpm run test:e2e (or visual/a11y variants)
- E2E smoke: pnpm run test:smoke (CI runs this on all PRs)

4) CI enforcement summary
- Lint and Type-check: runs on push/PR to main/develop
  - ESLint and Prettier check are enforced (src and tests are linted)
  - Anti-pattern guard: CI fails on remote https imports inside tests/vi.mock
- Unit/Integration: run with coverage on push/PR to main/develop; thresholds enforced
- Edge Functions: functions tests run with coverage thresholds enforced
- E2E Smoke: runs on all PRs (fast, targeted)
- Comprehensive (nightly/main): E2E, visual, Lighthouse, k6, plus reporting
- Supabase CI/CD: type drift check, db tests, deno check; deploy on main with secrets
- Step Functions ASL: validated via asl-validator (and optionally AWS CLI)
- Security & Secrets: npm audit blocks on high/critical; git-secrets blocks on secret findings; custom audit is blocking

5) Monitoring & observability
- Prometheus configs live in monitoring/prometheus
- Render env-specific configs with:
  - ./scripts/monitoring/render-prometheus-config.sh <env> <SUPABASE_PROJECT_ID> <SUPABASE_ANON_KEY>
- Monitor ping CI (scheduled) pushes metrics to Pushgateway and alerts on failures

6) Developer tips
- Use pnpm scripts for consistency
- Start feature branches from up-to-date origin/main
- Keep branches rebased/merged regularly per WARP.md guidelines
- For large/risky changes: take a safety tag/branch (see WARP.md)

7) Repository organization
- Follow docs/REPOSITORY_ORGANIZATION_GUIDELINES.md before creating/moving files
- Mirror src structure in tests when adding unit tests

Questions? Open an issue or draft PR and tag maintainers.

