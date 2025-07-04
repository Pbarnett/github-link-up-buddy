-- Quick fix for production database schema
-- This adds missing encryption columns that should exist

-- Add encryption columns to profiles table if they don't exist
DO $$
BEGIN
    -- Add encrypted columns to profiles
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'encrypted_first_name') THEN
        ALTER TABLE public.profiles ADD COLUMN encrypted_first_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'encrypted_last_name') THEN
        ALTER TABLE public.profiles ADD COLUMN encrypted_last_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'encrypted_phone') THEN
        ALTER TABLE public.profiles ADD COLUMN encrypted_phone TEXT;
    END IF;
    
    -- Add encrypted columns to payment_methods
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'encrypted_stripe_pm_id') THEN
        ALTER TABLE public.payment_methods ADD COLUMN encrypted_stripe_pm_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_methods' AND column_name = 'encrypted_last4') THEN
        ALTER TABLE public.payment_methods ADD COLUMN encrypted_last4 TEXT;
    END IF;
    
    -- Fix encryption_audit_log if performed_at column doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'encryption_audit_log' AND column_name = 'performed_at') THEN
        -- Drop table and recreate with correct schema
        DROP TABLE IF EXISTS public.encryption_audit_log;
        
        CREATE TABLE public.encryption_audit_log (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            table_name TEXT NOT NULL,
            record_id UUID NOT NULL,
            operation TEXT NOT NULL,
            key_version INTEGER NOT NULL,
            encryption_version INTEGER NOT NULL,
            performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            performed_by TEXT,
            metadata JSONB
        );
        
        -- Add index
        CREATE INDEX idx_encryption_audit_log_performed_at ON public.encryption_audit_log(performed_at);
        CREATE INDEX idx_encryption_audit_log_table_record ON public.encryption_audit_log(table_name, record_id);
    END IF;
END
$$;
