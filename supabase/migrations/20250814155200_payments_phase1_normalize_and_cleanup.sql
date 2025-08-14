-- 20250814155200_payments_phase1_normalize_and_cleanup.sql
-- Phase 1: Normalize payment_methods schema and remove sensitive columns
-- Goals (Stripe-aligned):
-- - Use Stripe tokens only (customer/payment_method). Never store PAN/CVV/client_secret.
-- - Normalize column names to stripe_payment_method_id.
-- - Prepare for decommissioning KMS-based storage.

begin;

-- 1) Ensure canonical column exists alongside legacy names for safe rollout
alter table if exists payment_methods
  add column if not exists stripe_payment_method_id text;

-- Backfill from legacy column if canonical is null and legacy exists
update payment_methods pm
set stripe_payment_method_id = pm.stripe_pm_id
where stripe_payment_method_id is null
  and exists (
    select 1 from information_schema.columns
    where table_name = 'payment_methods' and column_name = 'stripe_pm_id'
  );

-- 2) Drop sensitive columns if they exist (PAN/CVV should never be stored)
-- Note: Using dynamic guard (DO block) because ALTER TABLE IF EXISTS DROP COLUMN IF EXISTS can fail on some Postgres versions

do $$
begin
  if exists (
    select 1 from information_schema.columns 
    where table_name = 'payment_methods' and column_name = 'encrypted_payment_data'
  ) then
    execute 'alter table payment_methods drop column encrypted_payment_data';
  end if;

  if exists (
    select 1 from information_schema.columns 
    where table_name = 'payment_methods' and column_name = 'card_number_encrypted'
  ) then
    execute 'alter table payment_methods drop column card_number_encrypted';
  end if;

  if exists (
    select 1 from information_schema.columns 
    where table_name = 'payment_methods' and column_name = 'cardholder_name_encrypted'
  ) then
    execute 'alter table payment_methods drop column cardholder_name_encrypted';
  end if;

  if exists (
    select 1 from information_schema.columns 
    where table_name = 'payment_methods' and column_name = 'cvv_encrypted'
  ) then
    execute 'alter table payment_methods drop column cvv_encrypted';
  end if;

  if exists (
    select 1 from information_schema.columns 
    where table_name = 'payment_methods' and column_name = 'card_number'
  ) then
    execute 'alter table payment_methods drop column card_number';
  end if;

  if exists (
    select 1 from information_schema.columns 
    where table_name = 'payment_methods' and column_name = 'cvv'
  ) then
    execute 'alter table payment_methods drop column cvv';
  end if;
end $$;

-- 3) Indexing for canonical field
create index if not exists idx_payment_methods_stripe_payment_method_id on payment_methods(stripe_payment_method_id);

-- 4) Orders: ensure checkout_session_id exists and do not misuse payment_intent_id for sessions
alter table if exists orders
  add column if not exists checkout_session_id text;

commit;

