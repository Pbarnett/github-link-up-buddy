RULE – Secrets Guard
Condition
Always applies
Guideline
Block any commit or PR if pre-commit hook or CI git-secrets scan detects high-entropy or known-prefix secrets; never print real or fake keys in output.

RULE – PCI & GDPR Compliance
Condition
When generating payment or PII code
Guideline
Use Stripe tokenization only, store no card data, honor user-delete requests, and update compliance docs for any new personal-data flow.

RULE – Encrypt at Rest
Condition
When persisting sensitive data
Guideline
Use AWS KMS (or Supabase column crypto) for encryption; no custom cryptography.

RULE – Use TypeScript Strict
Condition
Always applies
Guideline
All code must compile with tsconfig.strict.json; avoid any unless commented and ticketed.

RULE – Unit Test Required
Condition
When creating a function, hook, or service
Guideline
Add Vitest unit tests covering happy path, edge cases, and error scenarios in mirrored tests/ path.

RULE – Test Coverage Gate
Condition
Before merge
Guideline
CI blocks unless line coverage ≥ 85 % and Stryker mutation score ≥ 70 %.

RULE – Repository Organization
Condition
When creating, moving, or renaming a file
Guideline
Follow REPOSITORY_ORGANIZATION_GUIDELINES.md; mirror every source file with a test file.

RULE – Zod Everything
Condition
When handling external or user data
Guideline
Validate with Zod; derive types via z.infer and reject invalid payloads.

RULE – Resilient Call Util
Condition
When adding an external-API call
Guideline
Use shared callWithRetry() util (idempotency key, exponential back-off, circuit-breaker state in Redis); never hand-roll retry loops.

RULE – Retry + Circuit Breaker
Condition
Whenever calling an external service
Guideline
Wrap calls in try/catch; three retries with back-off then fail via circuit breaker.

RULE – CI Green First
Condition
Always applies
Guideline
PR must pass ESLint, Prettier, unit + E2E tests, secret scan, Lighthouse CI, and coverage gates before merge.

RULE – Flag Analytics & Kill-Switch
Condition
For any new LaunchDarkly flag
Guideline
Log flag events for experiment analysis and ensure a kill-switch path degrades within ≤ 1 s if toggled off.

RULE – Trace & RED
Condition
When creating HTTP endpoint or job
Guideline
Attach x-correlation-id (generate if absent) and emit RED metrics <route>_req_total, <route>_err_total, <route>_latency_ms.

RULE – React 19 Only
Condition
When generating UI code
Guideline
Use React 19 functional components + hooks, Vite, Radix/ShadCN + Tailwind; no class components.

RULE – File Naming
Condition
Always applies
Guideline
Use kebab-case for all file/dir names (flight-search-form.tsx, booking-service.ts).

RULE – Import Hygiene
Condition
Always applies
Guideline
Use a single ES import line per module, sorted; no require statements.

RULE – E2E for Critical Flows
Condition
When feature touches booking, payments, or auth
Guideline
Write Playwright script covering full user flow plus axe-core a11y check.

RULE – Performance Guard
Condition
When adding or altering an endpoint
Guideline
Provide K6 or Artillery script to prove p95 latency meets SLA; block merge if regression.

RULE – Cache Hot Paths
Condition
When repeated identical queries detected
Guideline
Cache with Redis or React Query; specify key & invalidation strategy.

RULE – Commit Style
Condition
Always applies
Guideline
Suggest Conventional Commits messages and keep PRs small and focused.

RULE – Doc Update
Condition
When introducing new endpoint, env var, or architectural decision
Guideline
Update README/API docs and create an ADR in /docs/adr-<slug>.md.

RULE – Flake Detector
Condition
When tests include static waits or randomness
Guideline
Replace with explicit expect-conditions; mark flaky tests with test.skip and open ticket.
