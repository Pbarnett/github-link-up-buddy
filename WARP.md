# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

- Primary stack: React + Vite (frontend), Express (local server), Supabase Edge Functions (backend APIs), AWS CDK (infra), Vitest/Playwright/K6/Artillery (tests), ESLint/Prettier/TypeScript (quality)
- Package manager: pnpm (project config), scripts are runnable with npm or pnpm
- Path aliases: '@' -> src, '@shared' -> packages/shared

1) Common commands

Install dependencies
- pnpm install

Develop locally
- pnpm run dev            # Vite app on port 3000 + local Express server
- pnpm run dev:safe       # Includes localhost binding check before starting

Build & preview
- pnpm run build          # Production build
- pnpm run build:dev      # Development-mode build
- pnpm run preview        # Serve built app locally

Lint, format, type-check
- pnpm run lint           # ESLint across repo
- pnpm run format         # Prettier write for src/**/*
- pnpm run format:check   # Prettier check only
- pnpm run type-check     # TS type-check (no emit)
- pnpm run tsc            # Compile TypeScript

Unit/integration tests (Vitest)
- pnpm run test                 # All Vitest tests (non-e2e)
- pnpm run test:watch           # Watch mode
- pnpm run test:unit            # Unit project
- pnpm run test:integration     # Integration project
- pnpm run test:edge            # Edge functions (separate Vitest config)
- pnpm run test:coverage        # Coverage (v8 provider)

Run a single test (Vitest)
- pnpm vitest run path/to/test.ts
- pnpm vitest run --project edge supabase/functions/flight-search-v2/index.test.ts

E2E/visual/accessibility (Playwright)
- pnpm run test:e2e              # All E2E
- pnpm run test:e2e-headed       # Headed
- pnpm run test:e2e-debug        # Debug UI
- pnpm run test:visual           # Visual regression (tests/e2e/visual)
- pnpm run test:accessibility    # Axe-powered a11y set

Run a single E2E spec (Playwright)
- npx playwright test tests/e2e/trip-request-form.spec.ts

Edge function helpers
- pnpm run test:function:local   # Local function test harness
- pnpm run test:function:staging # Staging function checks

Smoke and monitoring utilities
- pnpm run smoke-test
- pnpm run monitor:ping
- pnpm run monitor:up | monitor:down | monitor:logs

Docker/MVP
- pnpm run mvp:deploy   # docker-compose up --build -d
- pnpm run mvp:status   # container status + health check
- pnpm run mvp:logs     # follow logs
- pnpm run mvp:stop     # stop stack

Quality gates and organization
- pnpm run org:check            # Repository organization enforcement
- pnpm run org:fix             # Auto-fix organization issues
- pnpm run quality:check       # Professional quality gates
- pnpm run security:full-audit # Security + secrets scan

2) High-level architecture overview

Frontend (src/)
- React + Vite app
- Components/pages drive the UI. Significant feature areas:
  - Trip request and offers (src/components/trip/*, src/pages/TripOffers*.tsx)
  - Dynamic forms and analytics (src/components/forms/*, src/hooks/useFormAnalytics*)
  - Wallet and payments UI (src/components/wallet/*, src/pages/Wallet.tsx)
  - Personalization and feature flags (src/components/personalization/*, src/lib/personalization/*)
- Hooks provide client logic (src/hooks/*) for fetching, business rules, and state
- Services encapsulate domain logic and external calls (src/services/*)
  - Flight, booking, payments, feature flags, profiles, typed Supabase access
- Shared utility and domain types in src/lib, src/utils, src/types
- Path aliases simplify imports:
  - import ... from '@/services/...'
  - import ... from '@shared/...'

Local server (server/)
- server/index.ts runs an Express server alongside Vite during dev
- server/metrics.ts exposes Prometheus metrics (express-prom-bundle, prom-client)
- Useful for local API proxying/health endpoints during development

Backend (Supabase Edge Functions)
- supabase/functions/* contains Deno/Edge functions for core backend workflows:
  - Flight search and offers (flight-search, flight-search-v2, flight-offers-v2)
  - Booking lifecycle (create-booking, process-booking, cancel-booking, auto-book[-duffel/-production])
  - Payments and wallet (create-payment-session, create-setup-intent, manage-payment-methods[-kms], stripe-webhook[-wallet])
  - Profiles and KMS (manage-profiles-kms, manage-traveler-profiles, kms-* functions)
  - Notifications and communications (send-notification, send-reminder, resend-webhook, templates/*.html)
  - Feature flags and health (flags, health)
- supabase/migrations/* define schemas, RLS policies, enums, and feature-flag tables backing the app
- tests for edge functions live under supabase/functions/**/*.test.ts and tests/edge/**, executed via the dedicated Vitest edge config (vitest.edge-functions.config.ts)

Infrastructure (infra/)
- AWS CDK stack (infra/cdk) provisions cloud resources (e.g., Step Functions, IAM, KMS integration points)
- Step Functions ASL definition under infra/step-functions/auto-booking.asl.json
- CI and workflow automation under .github/workflows/*.yml

Testing strategy
- Unit and integration (Vitest, jsdom/node env, coverage gates in vitest.config.ts)
- Edge functions (Vitest with custom aliases/stubs in vitest.edge-functions.config.ts)
- E2E and visual (Playwright: tests/e2e/* and tests/e2e/visual/*)
- Load/perf (K6 scripts under tests/load, Artillery config in tests/performance)
- Domain-focused tests across src/tests and tests/unit for components, hooks, services

Feature flags and rollout
- Core percentage rollout is implemented with MurmurHash-based bucketing (see README.md: userInBucket(userId, rollout)) for deterministic exposure
- LaunchDarkly client/service wrappers in src/lib/featureFlags and src/services/featureFlags.ts

Configuration and business rules
- Public business rules live in public/config/business-rules.json, loaded/validated via src/lib/business-rules/*
- Environment helpers under src/lib/config.ts and src/flightSearchV2/createEnv.ts

Observability and operations
- Monitoring manifests and dashboards (monitoring/*) for Prometheus/Grafana
- OpenTelemetry collector configuration at config/otel-collector.yaml
- Scripts to deploy/verify and monitor in scripts/* and .github workflows

3) Cross-referenced guidance (do read before making changes)

Repository organization (docs/REPOSITORY_ORGANIZATION_GUIDELINES.md)
- Source of truth for file placement, naming conventions, and mirrored test structure
- Before creating or moving files, verify the correct location and naming

Warp workflow setup (docs/WARP_WORKFLOW_SETUP.md)
- Context refresh pattern for each Warp session and after refactors
- File overview system: .warp_file_overview.txt is the authoritative manifest (version controlled)
- Path alias conventions (TypeScript + Vite) for unambiguous imports
- Task template: list exact paths you will touch and sanity-check their existence before editing

README.md highlights
- userInBucket: deterministic, non-crypto hash-based rollout helper used in feature gating logic

4) Practical tips for future Warp sessions in this repo

- Prefer pnpm for installs; use pnpm run <script> for consistency with packageManager
- When adding imports, use the established aliases ('@', '@shared') to avoid relative path churn
- For backend logic touching Supabase functions, mirror updates in migrations/tests where applicable
- For large refactors: run lint, type-check, unit/integration, edge tests, then E2E
- For infra-related changes (CDK/Step Functions), validate with existing CI workflows and keep ASL/CDK in sync

5) Focused examples

- Run only the edge tests for flight-search-v2
  - pnpm vitest run --project edge supabase/functions/flight-search-v2/index.test.ts

- Run a single unit test for a React component
  - pnpm vitest run src/components/trip/Pools/__tests__/PoolHeader.test.tsx

- Debug a single Playwright spec locally
  - npx playwright test tests/e2e/trip-request-form.spec.ts --debug

- End-to-end wallet smoke suite
  - pnpm run test:wallet-smoke

6) Where to look for deeper context

- docs/architecture/* for high-level flows (e.g., personalization-flow.md)
- docs/deployment/* and infra/* for deployment runbooks and infra code
- src/lib/errors/* and src/lib/security/* for error handling and webhook verification patterns
- packages/shared/* for shared integrations (KMS, Stripe, feature flags)

This WARP.md intentionally focuses on commands and architectural context that are not immediately obvious from a quick file listing, consolidating multi-file patterns and scripts to accelerate future work.

