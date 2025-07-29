-- Customer Lifecycle Audit Tables for PCI Compliance
-- Add tables to support customer data lifecycle management

-- Table to audit customer lifecycle events
CREATE TABLE IF NOT EXISTS customer_lifecycle_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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

-- Add lifecycle tracking columns to stripe_customers table (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'stripe_customers') THEN
        ALTER TABLE stripe_customers 
        ADD COLUMN IF NOT EXISTS last_payment_at TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS anonymized_at TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS anonymization_reason TEXT;
    END IF;
END
$$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customer_lifecycle_audit_customer_id ON customer_lifecycle_audit(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_lifecycle_audit_user_id ON customer_lifecycle_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_lifecycle_audit_action ON customer_lifecycle_audit(action);
CREATE INDEX IF NOT EXISTS idx_customer_lifecycle_audit_performed_at ON customer_lifecycle_audit(performed_at);

CREATE INDEX IF NOT EXISTS idx_customer_deletion_archive_customer_id ON customer_deletion_archive(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_deletion_archive_deletion_date ON customer_deletion_archive(deletion_date);

-- Create indexes on stripe_customers only if table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'stripe_customers') THEN
        CREATE INDEX IF NOT EXISTS idx_stripe_customers_last_payment_at ON stripe_customers(last_payment_at);
        CREATE INDEX IF NOT EXISTS idx_stripe_customers_anonymized_at ON stripe_customers(anonymized_at);
    END IF;
END
$$;

-- Row Level Security
ALTER TABLE customer_lifecycle_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_deletion_archive ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customer_lifecycle_audit
CREATE POLICY "Users can view their own lifecycle audit" ON customer_lifecycle_audit
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage lifecycle audit" ON customer_lifecycle_audit
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies for customer_deletion_archive  
CREATE POLICY "Users can view their own deletion archive" ON customer_deletion_archive
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage deletion archive" ON customer_deletion_archive
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Function to update last_payment_at when payment events occur
CREATE OR REPLACE FUNCTION update_customer_last_payment()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the last_payment_at timestamp for the customer
    UPDATE stripe_customers 
    SET last_payment_at = NOW()
    WHERE stripe_customer_id = COALESCE(NEW.stripe_customer_id, OLD.stripe_customer_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update last_payment_at when payment methods are used
-- This would be triggered by payment_intents or charges, but we'll handle it in the webhook

-- Create a view for customer lifecycle statistics (if stripe_customers exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'stripe_customers') THEN
        CREATE OR REPLACE VIEW customer_lifecycle_stats AS
        SELECT 
            COUNT(*) as total_customers,
            COUNT(*) FILTER (WHERE last_payment_at < NOW() - INTERVAL '365 days') as inactive_customers,
            COUNT(*) FILTER (WHERE anonymized_at IS NOT NULL) as anonymized_customers,
            COUNT(*) FILTER (WHERE last_payment_at > NOW() - INTERVAL '30 days') as active_customers
        FROM stripe_customers;
    END IF;
END
$$;

-- Grant permissions
GRANT SELECT ON customer_lifecycle_audit TO authenticated;
GRANT SELECT ON customer_deletion_archive TO authenticated;

-- Grant permissions on view only if it exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.views WHERE table_name = 'customer_lifecycle_stats') THEN
        GRANT SELECT ON customer_lifecycle_stats TO authenticated;
    END IF;
END
$$;

-- Comments for documentation
COMMENT ON TABLE customer_lifecycle_audit IS 'Audit trail for customer data lifecycle management actions';
COMMENT ON TABLE customer_deletion_archive IS 'Archive of deleted customer data for compliance requirements';

-- Add comments on stripe_customers columns only if table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'stripe_customers') THEN
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'stripe_customers' AND column_name = 'last_payment_at') THEN
            COMMENT ON COLUMN stripe_customers.last_payment_at IS 'Timestamp of the last payment activity for lifecycle management';
        END IF;
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'stripe_customers' AND column_name = 'anonymized_at') THEN
            COMMENT ON COLUMN stripe_customers.anonymized_at IS 'Timestamp when customer data was anonymized';
        END IF;
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'stripe_customers' AND column_name = 'anonymization_reason') THEN
            COMMENT ON COLUMN stripe_customers.anonymization_reason IS 'Reason why customer data was anonymized';
        END IF;
    END IF;
END
$$;
