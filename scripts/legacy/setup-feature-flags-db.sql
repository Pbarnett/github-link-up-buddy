-- Feature Flags Database Setup for Coordinated Rollout
-- This script creates the necessary tables and functions for feature flag management

BEGIN;

-- Create feature_flags table if it doesn't exist
CREATE TABLE IF NOT EXISTS feature_flags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT false,
    rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(255),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create an index on name for fast lookups
CREATE INDEX IF NOT EXISTS idx_feature_flags_name ON feature_flags(name);
CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON feature_flags(enabled);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_feature_flags_updated_at ON feature_flags;
CREATE TRIGGER update_feature_flags_updated_at
    BEFORE UPDATE ON feature_flags
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial feature flags for coordinated rollout
INSERT INTO feature_flags (name, description, enabled, rollout_percentage, created_by)
VALUES 
    ('wallet_ui', 'Primary wallet interface features', false, 0, 'coordinated-rollout-setup'),
    ('profile_ui_revamp', 'Updated profile user interface', false, 0, 'coordinated-rollout-setup')
ON CONFLICT (name) DO NOTHING;

-- Create logs table for audit trail (if it doesn't exist)
CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on logs for performance
CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at);
CREATE INDEX IF NOT EXISTS idx_logs_message_text ON logs USING gin(to_tsvector('english', message));

-- Create function to log feature flag changes
CREATE OR REPLACE FUNCTION log_feature_flag_change()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO logs (level, message, metadata)
    VALUES (
        'INFO',
        CASE 
            WHEN TG_OP = 'INSERT' THEN 'Feature flag created: ' || NEW.name
            WHEN TG_OP = 'UPDATE' THEN 'Feature flag updated: ' || NEW.name
            WHEN TG_OP = 'DELETE' THEN 'Feature flag deleted: ' || OLD.name
        END,
        CASE 
            WHEN TG_OP = 'INSERT' THEN to_jsonb(NEW)
            WHEN TG_OP = 'UPDATE' THEN jsonb_build_object(
                'old', to_jsonb(OLD),
                'new', to_jsonb(NEW),
                'changed_fields', (
                    SELECT jsonb_object_agg(key, value)
                    FROM jsonb_each(to_jsonb(NEW))
                    WHERE to_jsonb(NEW) ->> key IS DISTINCT FROM to_jsonb(OLD) ->> key
                )
            )
            WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
        END
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create audit trigger
DROP TRIGGER IF EXISTS feature_flags_audit_trigger ON feature_flags;
CREATE TRIGGER feature_flags_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON feature_flags
    FOR EACH ROW
    EXECUTE FUNCTION log_feature_flag_change();

-- Create helper function to get feature flag status
CREATE OR REPLACE FUNCTION get_feature_flag_status(flag_name TEXT)
RETURNS TABLE(
    name TEXT,
    enabled BOOLEAN,
    rollout_percentage INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ff.name::TEXT,
        ff.enabled,
        ff.rollout_percentage,
        ff.updated_at
    FROM feature_flags ff
    WHERE ff.name = flag_name;
END;
$$ LANGUAGE plpgsql;

-- Create function to update rollout percentage
CREATE OR REPLACE FUNCTION update_feature_flag_rollout(
    flag_name TEXT,
    new_percentage INTEGER,
    enable_flag BOOLEAN DEFAULT true
)
RETURNS BOOLEAN AS $$
DECLARE
    rows_affected INTEGER;
BEGIN
    -- Validate percentage
    IF new_percentage < 0 OR new_percentage > 100 THEN
        RAISE EXCEPTION 'Rollout percentage must be between 0 and 100, got %', new_percentage;
    END IF;
    
    -- Update the feature flag
    UPDATE feature_flags 
    SET 
        rollout_percentage = new_percentage,
        enabled = enable_flag,
        updated_at = NOW()
    WHERE name = flag_name;
    
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    
    -- Return true if a row was updated
    RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql;

-- Create function to get recent feature flag changes
CREATE OR REPLACE FUNCTION get_recent_feature_flag_changes(hours_back INTEGER DEFAULT 24)
RETURNS TABLE(
    timestamp TIMESTAMP WITH TIME ZONE,
    level TEXT,
    message TEXT,
    flag_name TEXT,
    old_percentage INTEGER,
    new_percentage INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.created_at,
        l.level,
        l.message,
        COALESCE(
            l.metadata->>'name',
            l.metadata->'new'->>'name',
            l.metadata->'old'->>'name'
        )::TEXT,
        COALESCE(
            (l.metadata->'old'->>'rollout_percentage')::INTEGER,
            0
        ),
        COALESCE(
            (l.metadata->'new'->>'rollout_percentage')::INTEGER,
            (l.metadata->>'rollout_percentage')::INTEGER,
            0
        )
    FROM logs l
    WHERE 
        l.created_at > NOW() - INTERVAL '1 hour' * hours_back
        AND l.message LIKE '%Feature flag%'
    ORDER BY l.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions (adjust as needed for your setup)
-- These might need to be adjusted based on your Supabase setup
-- GRANT SELECT, INSERT, UPDATE ON feature_flags TO authenticated;
-- GRANT SELECT ON logs TO authenticated;

COMMIT;

-- Display current feature flags status
SELECT 
    name,
    enabled,
    rollout_percentage,
    created_at,
    updated_at
FROM feature_flags 
ORDER BY name;
