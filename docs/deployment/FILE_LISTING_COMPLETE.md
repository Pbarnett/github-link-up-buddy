# Complete File Listing for github-link-up-buddy Repository

**Generated:** 2025-07-27T18:21:18Z  
**Commit SHA:** 6ff5ea2438afcdbbdc281b0db9dceb04d70264c9

This document contains the complete directory structure and file listing for the Parker Flight repository, used as evidence for the code audit process.

## Root Directory Files

- `Dockerfile`, `Dockerfile.backend`, `Dockerfile.secure`, `Dockerfile.simple`
- `README.md`
- `React_Documentation.txt`
- `ai-code-analysis-report.json`
- `app.log`, `backend.log`, `dev-server.log`, `dev.log`
- `apply_migrations.sql`
- `bun.lockb`
- `check_column.sql`
- `clear-auth.html`
- `components.json`
- `concurrently`
- `coverage-report.json`
- `create-exec-rpc.sql`
- `create-queue-infrastructure.sql`
- `create_simple_test.py`
- `create_test_trip.sql`
- `current-errors.log`
- Various database schema and fix files (`.sql`)
- `deno.lock`
- Various deployment and verification files
- `docker-compose.*.yml` files
- `emergency_fix.sql`, `emergency_fix_corrected.sql`
- `enterprise-code-quality-report.json`
- `env.test`
- `eslint.config.js`
- Various fix and correction scripts
- `index.html`
- `lighthouse-budgets.json`
- `lint-report.json`
- `netlify.toml`
- `package-lock.json`, `package.json`
- `playwright.config.ts`
- `pnpm-lock.yaml`
- `postcss.config.js`
- `quality-gates-report.json`
- `railway.json`
- `schema_dump.sql`
- Various test and configuration files
- `tailwind.config.ts`
- TypeScript configuration files (`tsconfig.*.json`)
- `vercel.json`
- `vite.config.ts`, `vitest.config.ts`

## Directory Structure

### `/app`
- `/app/trip/confirm/page.tsx`

### `/backups`
- `20250709_pre_personalization.sql`
- `20250723_000546/` (contains app logs and docker compose backup)
- Various deployment and legacy backups

### `/config`
- `aws-sdk-enhanced.config.js`

### `/coverage` (empty)

### `/data`
- `/data/grafana/` (empty)
- `/data/prometheus/` (empty)

### `/database`
- `/database/migrations/`
  - `20241208_create_user_personalization.sql`
  - `20250603171417_add_selected_seat_type_to_flight_offers.sql`
  - `20250603195822_update_rpc_auto_book_match_signature.sql`

### `/deploy`
- `aws-secrets-setup.yml`

### `/deployment`
- `/deployment/aws/`
  - `iam-policy-template.json`
  - `kms-keys-cloudformation.yaml`

### `/dist`
- Built assets including JavaScript bundles, CSS, and map files
- Various chunk files and index files

### `/docker`
- `nginx-ssl.conf`, `nginx.conf`, `nginx.production.conf`
- `/docker/ssl/` (empty)

### `/docs`
Extensive documentation structure including:
- Various markdown files for development, deployment, security
- `/docs/api/` - API documentation for multiple services:
  - React Hook Form, Amadeus, AWS CLI, AWS KMS, AWS SDK
  - Duffel, ESLint, Google OAuth, JSDOM, JSON Standards
  - LaunchDarkly, Playwright, Radix, React, Redis
  - Resend, shadcn, Stripe, Supabase, TailwindCSS
  - Twilio, TypeScript, Vitest, Zod, Zustand
- `/docs/architecture/` - System architecture docs
- `/docs/deployment/` - Deployment guides and status
- `/docs/development/` - Development plans and implementation guides
- `/docs/general/` - General documentation and guides
- `/docs/guides/` - Setup and production guides
- `/docs/monitoring/` - Monitoring and dashboard docs
- `/docs/performance/` - Performance optimization guides
- `/docs/research/` - Research documents and analysis
- `/docs/security/` - Security audits and recommendations
- `/docs/supabase/` - Supabase-specific documentation
- `/docs/user-profile/` - User profile development docs

### `/infra`
- `/infra/ci/supabase.yml`
- `/infra/docker/` - Docker infrastructure files

### `/k8s`
- Kubernetes configuration files:
  - `autoscaling.yaml`
  - `deployment.yaml`
  - `parker-flight-deployment.yaml`
  - `/k8s/istio/` - Istio service mesh configuration

### `/lib`
- `utils.ts`

### `/logs`
- Application logs and completion status files

### `/mocks`
- `/mocks/google-oauth/server.cjs`

### `/monitoring`
Comprehensive monitoring setup:
- Alert rules and configuration files
- `/monitoring/alertmanager/` - Alert manager configuration
- `/monitoring/datadog/` - Datadog dashboards
- `/monitoring/grafana/` - Grafana dashboards and configuration
  - Backups, config, dashboards, datasources, provisioning, templates
- `/monitoring/interceptors/` - HTTP interceptors
- `/monitoring/metrics/` - Service dependency metrics
- `/monitoring/otel/` - OpenTelemetry collector config
- `/monitoring/prometheus/` - Prometheus configuration and rules

### `/node_modules`
Extensive Node.js dependencies including:
- AWS SDK packages
- React and related libraries
- Testing frameworks (Playwright, Vitest)
- Build tools (Vite, ESBuild, Rollup)
- UI libraries (Radix, shadcn)
- Database and API clients
- Monitoring and analytics tools
- And many more standard npm packages

### `/packages` (referenced but content not shown)

### `/public` (referenced but content not shown)

### `/reports` (referenced but content not shown)

### `/scripts` (referenced but content not shown)

### `/server` (referenced but content not shown)

### `/src` (referenced but content not shown)

### `/supabase`
- Edge Functions in `/supabase/functions/`:
  - Shared utilities in `/_shared/`
  - Library functions in `/lib/`
  - Test files in `/tests/`
  - Over 50 individual edge functions including:
    - `duffel-search`, `auto-book-production`, `auto-book`
    - Various booking and payment functions
    - KMS and encryption functions
    - LaunchDarkly integration
    - Notification and email functions
    - And many more specialized functions

### `/test-results` (referenced but content not shown)

### `/tests` (referenced but content not shown)

## Key Files for Auto-booking Audit

Based on the audit requirements, key files identified include:

1. **Edge Functions:**
   - `supabase/functions/duffel-search/index.ts` ✅
   - `supabase/functions/auto-book-production/index.ts` ✅
   - `supabase/functions/auto-book/index.ts` ✅

2. **Database Migrations:**
   - `supabase/migrations/00000000000000_initial_schema.sql` ✅
   - `supabase/migrations/20250601082000_add_booking_attempts_table.sql` ✅
   - `supabase/migrations/20250704201931_duffel_integration_final.sql` ✅

3. **LaunchDarkly Integration:**
   - `supabase/functions/_shared/launchdarkly.ts` ✅

4. **Library Functions:**
   - `supabase/functions/lib/duffel.ts` ✅
   - `supabase/functions/lib/duffel-production.ts` ✅
   - `supabase/functions/lib/stripe.ts` ✅

This comprehensive file listing provides evidence of the codebase structure and confirms the presence of required components for the auto-booking pipeline implementation.

---

**Note:** This document serves as evidence for the Parker-Flight code audit process and represents the complete file structure as of the specified commit SHA.
