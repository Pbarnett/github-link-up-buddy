# Migrations Reconciliation and Ongoing Process

Context
- Source of truth: Local repo and staging schema (not GitHub history prior to this session).
- Immediate stopgap applied: Added booking_requests.payment_intent_id (text) and a non-unique index in staging. A schema snapshot was saved under backups/.

Goals
- Establish a clean baseline that reflects the current staging schema.
- Ensure all future changes are codified as forward migrations.
- Add CI to dry-run migrations against a disposable Postgres to catch drift early.

Phase 0 – Safety and Baseline
1) Baseline snapshot
   - We captured a schema snapshot from staging to backups/staging-schema-YYYYMMDD-HHMMSS.sql.
   - Keep these snapshots for audit, but do not commit secrets.

2) Record manual change (stopgap)
   - SQL applied:
     - ALTER TABLE public.booking_requests ADD COLUMN IF NOT EXISTS payment_intent_id text;
     - CREATE INDEX IF NOT EXISTS idx_booking_requests_payment_intent_id ON public.booking_requests (payment_intent_id);
   - This will be included in a formal migration in the next commit if not already present.

Phase 1 – Migration History Reconciliation

Added forward migration 20250812T2125_add_payment_intent_id.sql:
- Adds public.booking_requests.payment_intent_id (text) if missing
- Creates non-unique index idx_booking_requests_payment_intent_id
- Idempotent by design to safely apply across environments

Rollback snippet (only if needed and no longer referenced by code):
```sql
DROP INDEX IF EXISTS idx_booking_requests_payment_intent_id;
ALTER TABLE public.booking_requests DROP COLUMN IF EXISTS payment_intent_id;
```
1) Pull remote schema (read-only)
   - supabase db pull (do not push). Alternatively, review backups/staging-schema-*.sql as the baseline.

2) Repair migration history
   - Use supabase migration repair to align local migration state with what’s applied remotely.
   - Create a baseline migration that captures the current schema state. Avoid altering existing tables in the baseline—only reflect current state.

3) Reintroduce local deltas as forward migrations
   - Any intended changes that are not in staging should be authored as new migrations on top of the baseline.
   - Include the stopgap DDL above as a formal migration if it isn’t already represented.

Phase 2 – CI Guardrails
- Run a migrations dry-run in CI on every push/PR:
  - Spin up Postgres 15 service.
  - Install Supabase CLI.
  - Execute supabase db reset --db-url $TEST_DATABASE_URL to apply all migrations to a fresh DB.
  - Fail the build if migrations do not apply cleanly.

Phase 3 – Documentation and Discipline
- All DB changes must be made via migrations.
- Keep APPLY_SAVINGS_FEE and fee parameters configurable via environment variables/secrets.
- Maintain structured logging for payments with keys: booking_request_id, payment_intent_id, booking_id.

Operational Notes
- Idempotency: Webhooks and background jobs must upsert or guard writes with unique keys.
- Rollbacks: Prefer additive changes. For destructive changes, include reversible steps and backups.
- Backfills: If needed, author separate one-time scripts and document them here.

Checklist for new DB changes
- Write a migration file under supabase/migrations.
- Run supabase db reset --db-url $LOCAL_TEST_DATABASE_URL locally to verify it applies cleanly.
- Open a PR; CI should pass the migrations dry-run.
- Deploy to staging; confirm expected behavior; then promote to production.

