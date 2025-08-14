-- 20250814171600_payments_phase3_drop_legacy_stripe_pm_id.sql
-- Phase 3: Finalize canonical payment method ID and drop legacy column
-- Actions:
-- 1) Backfill stripe_payment_method_id from stripe_pm_id where needed
-- 2) Enforce NOT NULL on stripe_payment_method_id
-- 3) Add UNIQUE index on stripe_payment_method_id (optional but recommended)
-- 4) Drop legacy stripe_pm_id column

begin;

-- 1) Backfill canonical column from legacy, if any rows still missing
update payment_methods
set stripe_payment_method_id = stripe_pm_id
where stripe_payment_method_id is null
  and stripe_pm_id is not null;

-- 2) Enforce NOT NULL on canonical column if there are no remaining NULLs
-- (Guard in case of partial/inconsistent data)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='payment_methods' AND column_name='stripe_payment_method_id'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM payment_methods WHERE stripe_payment_method_id IS NULL
    ) THEN
      EXECUTE 'ALTER TABLE payment_methods ALTER COLUMN stripe_payment_method_id SET NOT NULL';
    END IF;
  END IF;
END $$;

-- 3) Add UNIQUE index to prevent duplicates across users (Stripe PM IDs are globally unique)
create unique index if not exists ux_payment_methods_spmid on payment_methods(stripe_payment_method_id);

-- 4) Drop legacy column (if it still exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='payment_methods' AND column_name='stripe_pm_id'
  ) THEN
    EXECUTE 'ALTER TABLE payment_methods DROP COLUMN stripe_pm_id';
  END IF;
END $$;

commit;

