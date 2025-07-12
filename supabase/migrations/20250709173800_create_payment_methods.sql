-- Migration: Create payment methods and Stripe customers tables
-- Day 4: Payments & Wallet System
-- Created: 2025-07-09

-- Create Stripe customers table (lazy creation)
create table if not exists stripe_customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique
    references auth.users(id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create payment methods table with encryption
create table if not exists payment_methods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null
    references auth.users(id) on delete cascade,
  stripe_customer_id text not null
    references stripe_customers(stripe_customer_id) on delete cascade,
  stripe_pm_id text not null unique, -- Will be encrypted
  brand text, -- visa, mastercard, amex, etc. (plaintext for UI)
  last4 text check (char_length(last4) = 4), -- Last 4 digits (plaintext for UI)
  exp_month int check (exp_month >= 1 and exp_month <= 12),
  exp_year int check (exp_year >= extract(year from now())),
  billing_zip text,
  is_default boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Constraint: Only one default per user
  constraint one_default_per_user exclude (user_id with =) where (is_default = true)
);

-- Add constraint for maximum cards per user (security measure)
create or replace function check_max_payment_methods()
returns trigger as $$
begin
  if (select count(*) from payment_methods where user_id = NEW.user_id) >= 5 then
    raise exception 'Maximum of 5 payment methods allowed per user';
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger payment_methods_max_check
  before insert on payment_methods
  for each row execute function check_max_payment_methods();

-- Enable Row Level Security
alter table stripe_customers enable row level security;
alter table payment_methods enable row level security;

-- RLS Policies for stripe_customers
create policy "Users can view own Stripe customer"
  on stripe_customers for select
  using (auth.uid() = user_id);

create policy "Users can insert own Stripe customer"
  on stripe_customers for insert
  with check (auth.uid() = user_id);

create policy "Users can update own Stripe customer"
  on stripe_customers for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- RLS Policies for payment_methods
create policy "Users can manage own payment methods"
  on payment_methods for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Indexes for performance
create index idx_stripe_customers_user_id on stripe_customers(user_id);
create index idx_payment_methods_user_id on payment_methods(user_id);
create index if not exists idx_payment_methods_stripe_customer_id on payment_methods(stripe_customer_id);
create index idx_payment_methods_is_default on payment_methods(user_id, is_default) where is_default = true;

-- Function to automatically set is_default for first payment method
create or replace function set_first_payment_method_as_default()
returns trigger as $$
begin
  -- If this is the user's first payment method, make it default
  if not exists (select 1 from payment_methods where user_id = NEW.user_id and id != NEW.id) then
    NEW.is_default = true;
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger payment_methods_first_default
  before insert on payment_methods
  for each row execute function set_first_payment_method_as_default();

-- Function to ensure only one default payment method per user
create or replace function ensure_single_default_payment_method()
returns trigger as $$
begin
  -- If setting a new default, unset all others for this user
  if NEW.is_default = true then
    update payment_methods 
    set is_default = false 
    where user_id = NEW.user_id and id != NEW.id;
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger payment_methods_single_default
  before update on payment_methods
  for each row execute function ensure_single_default_payment_method();

-- Audit logging for payment methods (extends existing audit system)
create or replace function log_payment_method_changes()
returns trigger as $$
declare
  action_type text;
  masked_pm_id text;
begin
  -- Determine action type
  if TG_OP = 'INSERT' then
    action_type = 'ADD_PM';
  elsif TG_OP = 'UPDATE' then
    action_type = 'UPDATE_PM';
  elsif TG_OP = 'DELETE' then
    action_type = 'DELETE_PM';
  end if;

  -- Mask the payment method ID for logging
  masked_pm_id = '****' || right(coalesce(NEW.stripe_pm_id, OLD.stripe_pm_id), 4);

  -- Insert audit log
  insert into traveler_data_audit (
    user_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data,
    created_at
  ) values (
    coalesce(NEW.user_id, OLD.user_id),
    action_type,
    'payment_methods',
    coalesce(NEW.id, OLD.id),
    case when TG_OP != 'INSERT' then json_build_object(
      'brand', OLD.brand,
      'last4', OLD.last4,
      'is_default', OLD.is_default,
      'masked_pm_id', masked_pm_id
    ) else null end,
    case when TG_OP != 'DELETE' then json_build_object(
      'brand', NEW.brand,
      'last4', NEW.last4,
      'is_default', NEW.is_default,
      'masked_pm_id', masked_pm_id
    ) else null end,
    now()
  );

  return coalesce(NEW, OLD);
end;
$$ language plpgsql;

create trigger payment_methods_audit
  after insert or update or delete on payment_methods
  for each row execute function log_payment_method_changes();

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant select on stripe_customers to authenticated;
grant select, insert, update on payment_methods to authenticated;

-- Add helpful comments
comment on table stripe_customers is 'Stripe customer IDs for lazy customer creation';
comment on table payment_methods is 'User payment methods with encrypted Stripe PM tokens';
comment on column payment_methods.stripe_pm_id is 'Encrypted Stripe payment method ID';
comment on column payment_methods.brand is 'Card brand (plaintext for UI display)';
comment on column payment_methods.last4 is 'Last 4 digits (plaintext for UI display)';
