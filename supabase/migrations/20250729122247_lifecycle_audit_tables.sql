-- Customer Lifecycle Audit Tables Migration
-- Create necessary tables for customer lifecycle management

-- Table to audit customer lifecycle events
CREATE TABLE IF NOT EXISTS customer_lifecycle_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT NOT NULL,
    user_id UUID,
    action TEXT NOT NULL CHECK (action IN ('identified_inactive', 'anonymized', 'deleted', 'retained')),
    reason TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table to archive deleted customer data for compliance
CREATE TABLE IF NOT EXISTS customer_deletion_archive (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT NOT NULL,
    user_id UUID,
    deletion_date TIMESTAMPTZ NOT NULL,
    charges_count INTEGER DEFAULT 0,
    total_amount_processed BIGINT DEFAULT 0, -- in cents
    last_charge_date TIMESTAMPTZ,
    archived_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add lifecycle tracking columns to stripe_customers table
ALTER TABLE stripe_customers 
ADD COLUMN IF NOT EXISTS last_payment_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS anonymized_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS anonymization_reason TEXT;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customer_lifecycle_audit_customer_id ON customer_lifecycle_audit(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_lifecycle_audit_user_id ON customer_lifecycle_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_lifecycle_audit_action ON customer_lifecycle_audit(action);
CREATE INDEX IF NOT EXISTS idx_customer_lifecycle_audit_performed_at ON customer_lifecycle_audit(performed_at);

CREATE INDEX IF NOT EXISTS idx_customer_deletion_archive_customer_id ON customer_deletion_archive(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_deletion_archive_deletion_date ON customer_deletion_archive(deletion_date);

CREATE INDEX IF NOT EXISTS idx_stripe_customers_last_payment_at ON stripe_customers(last_payment_at);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_anonymized_at ON stripe_customers(anonymized_at);

-- Row Level Security
ALTER TABLE customer_lifecycle_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_deletion_archive ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customer_lifecycle_audit
DROP POLICY IF EXISTS "Service role can manage lifecycle audit" ON customer_lifecycle_audit;
CREATE POLICY "Service role can manage lifecycle audit" ON customer_lifecycle_audit
    FOR ALL USING (
        (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
    );

-- RLS Policies for customer_deletion_archive  
DROP POLICY IF EXISTS "Service role can manage deletion archive" ON customer_deletion_archive;
CREATE POLICY "Service role can manage deletion archive" ON customer_deletion_archive
    FOR ALL USING (
        (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
    );

-- Grant permissions
GRANT SELECT ON customer_lifecycle_audit TO authenticated;
GRANT SELECT ON customer_deletion_archive TO authenticated;

-- Comments for documentation
COMMENT ON TABLE customer_lifecycle_audit IS 'Audit trail for customer data lifecycle management actions';
COMMENT ON TABLE customer_deletion_archive IS 'Archive of deleted customer data for compliance requirements';
COMMENT ON COLUMN stripe_customers.last_payment_at IS 'Timestamp of the last payment activity for lifecycle management';
COMMENT ON COLUMN stripe_customers.anonymized_at IS 'Timestamp when customer data was anonymized';
COMMENT ON COLUMN stripe_customers.anonymization_reason IS 'Reason why customer data was anonymized';
