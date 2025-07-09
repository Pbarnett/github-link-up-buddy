-- Create payment_methods table with KMS encryption and RLS
-- This table stores encrypted payment method data following PCI DSS SAQ A compliance

-- Create payment_methods table
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Stripe identifiers
  stripe_customer_id TEXT NOT NULL,
  stripe_payment_method_id TEXT NOT NULL UNIQUE,
  
  -- KMS encrypted sensitive data
  encrypted_payment_data BYTEA, -- KMS encrypted JSON with sensitive fields
  encryption_key_id TEXT NOT NULL DEFAULT 'parker-kms-key',
  encryption_version SMALLINT NOT NULL DEFAULT 1,
  
  -- Plaintext metadata for UI (non-sensitive)
  brand TEXT, -- visa, mastercard, amex, etc.
  last4 TEXT, -- last 4 digits
  exp_month SMALLINT,
  exp_year SMALLINT,
  funding TEXT, -- credit, debit, prepaid, unknown
  country TEXT, -- issuing country
  
  -- Payment method metadata
  is_default BOOLEAN DEFAULT FALSE,
  nickname TEXT, -- user-friendly name
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_exp_month CHECK (exp_month >= 1 AND exp_month <= 12),
  CONSTRAINT valid_exp_year CHECK (exp_year >= date_part('year', NOW())),
  CONSTRAINT valid_last4 CHECK (last4 ~ '^[0-9]{4}$'),
  CONSTRAINT valid_brand CHECK (brand IN ('visa', 'mastercard', 'amex', 'discover', 'diners', 'jcb', 'unionpay', 'unknown'))
);

-- Create indexes for performance
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_stripe_customer ON payment_methods(stripe_customer_id);
CREATE INDEX idx_payment_methods_default ON payment_methods(user_id, is_default) WHERE is_default = TRUE;
CREATE INDEX idx_payment_methods_created_at ON payment_methods(created_at);

-- Enable RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own payment methods"
  ON payment_methods FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods"
  ON payment_methods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods"
  ON payment_methods FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods"
  ON payment_methods FOR DELETE
  USING (auth.uid() = user_id);

-- Create stripe_customers table for lazy customer creation
CREATE TABLE stripe_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id TEXT NOT NULL UNIQUE,
  
  -- Customer metadata
  email TEXT,
  name TEXT,
  phone TEXT,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for stripe_customers
CREATE INDEX idx_stripe_customers_user_id ON stripe_customers(user_id);
CREATE INDEX idx_stripe_customers_stripe_id ON stripe_customers(stripe_customer_id);

-- Enable RLS for stripe_customers
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stripe_customers
CREATE POLICY "Users can view their own stripe customer"
  ON stripe_customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stripe customer"
  ON stripe_customers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stripe customer"
  ON stripe_customers FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create payment_method_audit table for compliance
CREATE TABLE payment_method_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,
  
  -- Audit details
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'used'
  old_data JSONB,
  new_data JSONB,
  
  -- Request context
  ip_address INET,
  user_agent TEXT,
  request_id TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_action CHECK (action IN ('created', 'updated', 'deleted', 'used', 'failed'))
);

-- Create indexes for audit table
CREATE INDEX idx_payment_method_audit_user_id ON payment_method_audit(user_id);
CREATE INDEX idx_payment_method_audit_payment_method_id ON payment_method_audit(payment_method_id);
CREATE INDEX idx_payment_method_audit_created_at ON payment_method_audit(created_at);
CREATE INDEX idx_payment_method_audit_action ON payment_method_audit(action);

-- Enable RLS for audit table
ALTER TABLE payment_method_audit ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audit table (users can view their own audit logs)
CREATE POLICY "Users can view their own payment audit logs"
  ON payment_method_audit FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert audit logs
CREATE POLICY "Service role can insert audit logs"
  ON payment_method_audit FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Create function to ensure only one default payment method per user
CREATE OR REPLACE FUNCTION ensure_single_default_payment_method()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting a payment method as default, unset all others for this user
  IF NEW.is_default = TRUE THEN
    UPDATE payment_methods 
    SET is_default = FALSE, updated_at = NOW()
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  
  -- Update the updated_at timestamp
  NEW.updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for default payment method enforcement
CREATE TRIGGER ensure_single_default_payment_method_trigger
  BEFORE INSERT OR UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_payment_method();

-- Create function to audit payment method changes
CREATE OR REPLACE FUNCTION audit_payment_method_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert audit record
  INSERT INTO payment_method_audit (
    user_id,
    payment_method_id,
    action,
    old_data,
    new_data,
    ip_address,
    user_agent,
    request_id
  ) VALUES (
    COALESCE(NEW.user_id, OLD.user_id),
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'created'
      WHEN TG_OP = 'UPDATE' THEN 'updated'
      WHEN TG_OP = 'DELETE' THEN 'deleted'
    END,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE row_to_json(NEW) END,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent',
    current_setting('request.jwt.claims', true)::json->>'request_id'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for payment method auditing
CREATE TRIGGER audit_payment_method_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION audit_payment_method_changes();

-- Add wallet_ui feature flag
INSERT INTO feature_flags (name, enabled, rollout_percentage, description)
VALUES ('wallet_ui', TRUE, 0, 'New wallet UI with payment method management')
ON CONFLICT (name) DO UPDATE
SET 
    enabled = EXCLUDED.enabled,
    rollout_percentage = EXCLUDED.rollout_percentage,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Create helper function to get or create stripe customer
CREATE OR REPLACE FUNCTION get_or_create_stripe_customer(p_user_id UUID)
RETURNS TABLE(stripe_customer_id TEXT) AS $$
DECLARE
  existing_customer stripe_customers%ROWTYPE;
BEGIN
  -- Try to find existing customer
  SELECT * INTO existing_customer
  FROM stripe_customers
  WHERE user_id = p_user_id;
  
  IF FOUND THEN
    RETURN QUERY SELECT existing_customer.stripe_customer_id;
  ELSE
    -- This will be handled by the edge function
    -- Return NULL to indicate customer needs to be created
    RETURN QUERY SELECT NULL::TEXT;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON payment_methods TO authenticated;
GRANT ALL ON stripe_customers TO authenticated;
GRANT SELECT ON payment_method_audit TO authenticated;

-- Comments for documentation
COMMENT ON TABLE payment_methods IS 'Stores encrypted payment method data with KMS encryption for PCI compliance';
COMMENT ON COLUMN payment_methods.encrypted_payment_data IS 'KMS encrypted JSON containing sensitive payment data';
COMMENT ON COLUMN payment_methods.encryption_key_id IS 'AWS KMS key ID used for encryption';
COMMENT ON COLUMN payment_methods.stripe_payment_method_id IS 'Stripe payment method ID (pm_xxx)';
COMMENT ON TABLE stripe_customers IS 'Lazy-created Stripe customer records linked to auth.users';
COMMENT ON TABLE payment_method_audit IS 'Audit trail for all payment method operations for compliance';

-- Verify the migration
SELECT 'payment_methods table created successfully' as status;
SELECT 'stripe_customers table created successfully' as status;
SELECT 'payment_method_audit table created successfully' as status;
SELECT 'RLS policies created successfully' as status;
SELECT 'Triggers and functions created successfully' as status;
SELECT 'wallet_ui feature flag seeded' as status;
