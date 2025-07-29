-- Create stripe_customers table for lifecycle testing
-- This ensures we have actual customer data to process

CREATE TABLE IF NOT EXISTS stripe_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT NOT NULL UNIQUE,
    email TEXT,
    name TEXT,
    phone TEXT,
    
    -- Lifecycle tracking columns
    last_payment_at TIMESTAMPTZ,
    anonymized_at TIMESTAMPTZ,
    anonymization_reason TEXT,
    
    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for lifecycle management
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_stripe_id ON stripe_customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_last_payment_at ON stripe_customers(last_payment_at);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_anonymized_at ON stripe_customers(anonymized_at);

-- Enable RLS
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own stripe customer"
  ON stripe_customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage stripe customers"
  ON stripe_customers FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create test users first
INSERT INTO auth.users (
    id,
    email,
    created_at,
    updated_at,
    email_confirmed_at
) VALUES 
    ('11111111-1111-1111-1111-111111111111', 'old.customer@test.com', '2021-01-01 00:00:00+00', '2021-01-01 00:00:00+00', '2021-01-01 00:00:00+00'),
    ('22222222-2222-2222-2222-222222222222', 'anonymize@test.com', '2020-01-01 00:00:00+00', '2020-01-01 00:00:00+00', '2020-01-01 00:00:00+00'),
    ('33333333-3333-3333-3333-333333333333', 'delete@test.com', '2016-01-01 00:00:00+00', '2016-01-01 00:00:00+00', '2016-01-01 00:00:00+00'),
    ('44444444-4444-4444-4444-444444444444', 'active@test.com', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
    ('55555555-5555-5555-5555-555555555555', 'recent@test.com', NOW() - INTERVAL '500 days', NOW() - INTERVAL '500 days', NOW() - INTERVAL '500 days')
ON CONFLICT (id) DO NOTHING;

-- Insert test data for lifecycle testing
INSERT INTO stripe_customers (
    user_id,
    stripe_customer_id,
    email,
    name,
    last_payment_at,
    created_at
) VALUES 
    -- Inactive customer (over 1 year)
    ('11111111-1111-1111-1111-111111111111', 'cus_test_inactive_old', 'old.customer@test.com', 'Old Customer', '2022-01-01 00:00:00+00', '2021-01-01 00:00:00+00'),
    
    -- Customer ready for anonymization (over 3 years)
    ('22222222-2222-2222-2222-222222222222', 'cus_test_anonymize', 'anonymize@test.com', 'Anonymize Customer', '2021-01-01 00:00:00+00', '2020-01-01 00:00:00+00'),
    
    -- Customer ready for deletion (over 7 years)
    ('33333333-3333-3333-3333-333333333333', 'cus_test_delete', 'delete@test.com', 'Delete Customer', '2017-01-01 00:00:00+00', '2016-01-01 00:00:00+00'),
    
    -- Recent active customer (should be ignored)
    ('44444444-4444-4444-4444-444444444444', 'cus_test_active', 'active@test.com', 'Active Customer', NOW() - INTERVAL '30 days', NOW() - INTERVAL '60 days'),
    
    -- Customer inactive but not yet ready for anonymization
    ('55555555-5555-5555-5555-555555555555', 'cus_test_inactive_recent', 'recent@test.com', 'Recent Inactive', NOW() - INTERVAL '400 days', NOW() - INTERVAL '500 days')
ON CONFLICT (stripe_customer_id) DO NOTHING;

-- Add missing columns to existing payment_methods table if needed
DO $$
BEGIN
    -- Add stripe_customer_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE payment_methods ADD COLUMN stripe_customer_id TEXT;
    END IF;
END
$$;

-- Insert test payment methods using existing schema
INSERT INTO payment_methods (
    user_id,
    stripe_customer_id,
    stripe_pm_id,
    brand,
    last4,
    exp_month,
    exp_year
) VALUES 
    ('11111111-1111-1111-1111-111111111111', 'cus_test_inactive_old', 'pm_test_old_card', 'visa', '4242', 12, 2025),
    ('22222222-2222-2222-2222-222222222222', 'cus_test_anonymize', 'pm_test_anonymize_card', 'mastercard', '5555', 6, 2024),
    ('33333333-3333-3333-3333-333333333333', 'cus_test_delete', 'pm_test_delete_card', 'amex', '1234', 3, 2023),
    ('44444444-4444-4444-4444-444444444444', 'cus_test_active', 'pm_test_active_card', 'visa', '9999', 12, 2026)
ON CONFLICT DO NOTHING;

-- Grant permissions
GRANT ALL ON stripe_customers TO authenticated;
GRANT ALL ON payment_methods TO authenticated;

-- Comments
COMMENT ON TABLE stripe_customers IS 'Test Stripe customer data for lifecycle management testing';
COMMENT ON COLUMN stripe_customers.last_payment_at IS 'Timestamp of last payment activity for lifecycle management';
COMMENT ON COLUMN stripe_customers.anonymized_at IS 'Timestamp when customer data was anonymized';
COMMENT ON COLUMN stripe_customers.anonymization_reason IS 'Reason why customer data was anonymized';
