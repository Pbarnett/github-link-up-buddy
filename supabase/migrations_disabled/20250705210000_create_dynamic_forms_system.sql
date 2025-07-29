-- Dynamic Forms System Migration
-- Phase 1: Core Infrastructure
-- Created: 2025-07-05

-- Create enums for form system
CREATE TYPE form_status AS ENUM ('draft', 'testing', 'deployed', 'archived');
CREATE TYPE deployment_strategy AS ENUM ('immediate', 'canary', 'blue_green');
CREATE TYPE field_type AS ENUM (
  'text', 'email', 'phone', 'number', 'password', 'textarea',
  'select', 'multi-select', 'radio', 'checkbox', 'switch',
  'date', 'datetime', 'date-range', 'date-range-flexible',
  'airport-autocomplete', 'country-select', 'currency-select',
  'stripe-card', 'stripe-payment', 'address-group',
  'file-upload', 'slider', 'rating',
  'conditional-group', 'section-header', 'divider'
);

-- Main form configurations table
CREATE TABLE form_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  version INTEGER NOT NULL DEFAULT 1,
  status form_status DEFAULT 'draft',
  
  -- Form structure and configuration
  config_data JSONB NOT NULL,
  validation_schema JSONB NOT NULL,
  ui_schema JSONB DEFAULT '{}',
  
  -- Deployment settings
  deployment_strategy deployment_strategy DEFAULT 'immediate',
  canary_percentage INTEGER DEFAULT 0 CHECK (canary_percentage >= 0 AND canary_percentage <= 100),
  rollback_config_id UUID REFERENCES form_configurations(id),
  
  -- Encryption for sensitive configurations
  encrypted_config TEXT, -- KMS encrypted sensitive fields
  encryption_version INTEGER DEFAULT 1,
  encryption_key_type VARCHAR(20) DEFAULT 'PII', -- 'PII' or 'PAYMENT'
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deployed_at TIMESTAMP WITH TIME ZONE,
  archived_at TIMESTAMP WITH TIME ZONE,
  
  -- Version constraints
  UNIQUE(name, version)
);

-- Form deployments tracking
CREATE TABLE form_deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES form_configurations(id) ON DELETE CASCADE,
  deployed_by UUID REFERENCES auth.users(id),
  
  -- Deployment configuration
  deployment_strategy deployment_strategy NOT NULL,
  target_percentage INTEGER DEFAULT 100 CHECK (target_percentage >= 0 AND target_percentage <= 100),
  user_segment JSONB, -- User segmentation rules for canary deployments
  
  -- Status and metrics
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'rolled_back', 'completed')),
  metrics JSONB DEFAULT '{}',
  health_check_results JSONB DEFAULT '{}',
  
  -- Timing
  deployed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rolled_back_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Form usage analytics
CREATE TABLE form_usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES form_configurations(id) ON DELETE CASCADE,
  deployment_id UUID REFERENCES form_deployments(id) ON DELETE SET NULL,
  
  -- User context
  user_id UUID REFERENCES auth.users(id),
  session_id VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  
  -- Event data
  event_type VARCHAR(50) NOT NULL, -- 'view', 'interaction', 'submit', 'error', 'abandon'
  field_id VARCHAR(100),
  event_data JSONB DEFAULT '{}',
  
  -- Performance metrics
  load_time_ms INTEGER,
  interaction_time_ms INTEGER,
  
  -- Timestamp
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A/B testing configurations
CREATE TABLE form_ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  
  -- Test configuration
  control_config_id UUID NOT NULL REFERENCES form_configurations(id),
  variant_config_id UUID NOT NULL REFERENCES form_configurations(id),
  traffic_split INTEGER DEFAULT 50 CHECK (traffic_split >= 0 AND traffic_split <= 100),
  
  -- Test criteria
  success_metric VARCHAR(50) NOT NULL, -- 'conversion_rate', 'completion_rate', 'error_rate'
  minimum_sample_size INTEGER DEFAULT 1000,
  confidence_level DECIMAL(3,2) DEFAULT 0.95,
  
  -- Status and results
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'completed', 'stopped')),
  results JSONB DEFAULT '{}',
  winner_config_id UUID REFERENCES form_configurations(id),
  
  -- Timing
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configuration validation rules
CREATE TABLE form_validation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  
  -- Rule definition
  rule_type VARCHAR(50) NOT NULL, -- 'security', 'business', 'technical', 'compliance'
  rule_data JSONB NOT NULL,
  error_message TEXT NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit log for configuration changes
CREATE TABLE form_config_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES form_configurations(id) ON DELETE CASCADE,
  
  -- Change details
  action VARCHAR(50) NOT NULL, -- 'create', 'update', 'deploy', 'rollback', 'archive'
  changed_by UUID REFERENCES auth.users(id),
  changes JSONB, -- Diff of what changed
  
  -- Security validation
  security_validation JSONB,
  validation_passed BOOLEAN DEFAULT false,
  validation_errors JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamp
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_form_configurations_name_status ON form_configurations(name, status);
CREATE INDEX idx_form_configurations_status_deployed_at ON form_configurations(status, deployed_at);
CREATE INDEX idx_form_deployments_config_status ON form_deployments(config_id, status);
CREATE INDEX idx_form_usage_analytics_config_timestamp ON form_usage_analytics(config_id, timestamp);
CREATE INDEX idx_form_usage_analytics_event_type ON form_usage_analytics(event_type);
CREATE INDEX idx_form_usage_analytics_user_session ON form_usage_analytics(user_id, session_id);
CREATE INDEX idx_form_ab_tests_status ON form_ab_tests(status);
CREATE INDEX idx_form_config_audit_config_timestamp ON form_config_audit(config_id, timestamp);

-- Row Level Security Policies

-- Form Configurations RLS
ALTER TABLE form_configurations ENABLE ROW LEVEL SECURITY;

-- Users can read deployed configurations
CREATE POLICY "Users can read deployed form configurations" 
ON form_configurations FOR SELECT 
USING (status = 'deployed');

-- Form editors can manage their own draft configurations
CREATE POLICY "Form editors can manage draft configurations" 
ON form_configurations FOR ALL 
USING (
  auth.role() = 'service_role' OR 
  (status = 'draft' AND created_by = auth.uid())
);

-- Service role has full access
CREATE POLICY "Service role full access to form configurations" 
ON form_configurations FOR ALL 
USING (auth.role() = 'service_role');

-- Form Deployments RLS
ALTER TABLE form_deployments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages form deployments" 
ON form_deployments FOR ALL 
USING (auth.role() = 'service_role');

-- Form Usage Analytics RLS
ALTER TABLE form_usage_analytics ENABLE ROW LEVEL SECURITY;

-- Users can read their own analytics
CREATE POLICY "Users can read own form analytics" 
ON form_usage_analytics FOR SELECT 
USING (user_id = auth.uid());

-- Service role can manage all analytics
CREATE POLICY "Service role manages form analytics" 
ON form_usage_analytics FOR ALL 
USING (auth.role() = 'service_role');

-- A/B Tests RLS
ALTER TABLE form_ab_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages A/B tests" 
ON form_ab_tests FOR ALL 
USING (auth.role() = 'service_role');

-- Validation Rules RLS
ALTER TABLE form_validation_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages validation rules" 
ON form_validation_rules FOR ALL 
USING (auth.role() = 'service_role');

-- Audit Log RLS
ALTER TABLE form_config_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages config audit log" 
ON form_config_audit FOR ALL 
USING (auth.role() = 'service_role');

-- Functions for form management

-- Function to get active form configuration by name
CREATE OR REPLACE FUNCTION get_active_form_configuration(form_name TEXT)
RETURNS TABLE (
  id UUID,
  name VARCHAR(100),
  version INTEGER,
  config_data JSONB,
  validation_schema JSONB,
  ui_schema JSONB,
  encrypted_config TEXT,
  deployment_id UUID
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  active_deployment RECORD;
BEGIN
  -- First check if there's an active canary deployment
  SELECT fd.*, fc.* INTO active_deployment
  FROM form_deployments fd
  JOIN form_configurations fc ON fc.id = fd.config_id
  WHERE fc.name = form_name 
    AND fd.status = 'active'
    AND fc.status = 'deployed'
  ORDER BY fd.deployed_at DESC
  LIMIT 1;
  
  -- If no active deployment, get the latest deployed configuration
  IF active_deployment IS NULL THEN
    SELECT NULL as deployment_id, fc.* INTO active_deployment
    FROM form_configurations fc
    WHERE fc.name = form_name 
      AND fc.status = 'deployed'
    ORDER BY fc.deployed_at DESC
    LIMIT 1;
  END IF;
  
  -- Return the configuration if found
  IF active_deployment IS NOT NULL THEN
    RETURN QUERY SELECT 
      active_deployment.id,
      active_deployment.name,
      active_deployment.version,
      active_deployment.config_data,
      active_deployment.validation_schema,
      active_deployment.ui_schema,
      active_deployment.encrypted_config,
      active_deployment.deployment_id;
  END IF;
END;
$$;

-- Function to log form usage analytics
CREATE OR REPLACE FUNCTION log_form_usage(
  p_config_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_session_id VARCHAR(100) DEFAULT NULL,
  p_event_type VARCHAR(50) DEFAULT 'view',
  p_field_id VARCHAR(100) DEFAULT NULL,
  p_event_data JSONB DEFAULT '{}',
  p_load_time_ms INTEGER DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  analytics_id UUID;
  deployment_id UUID;
BEGIN
  -- Get the current deployment ID for this configuration
  SELECT fd.id INTO deployment_id
  FROM form_deployments fd
  WHERE fd.config_id = p_config_id 
    AND fd.status = 'active'
  ORDER BY fd.deployed_at DESC
  LIMIT 1;
  
  -- Insert analytics record
  INSERT INTO form_usage_analytics (
    config_id,
    deployment_id,
    user_id,
    session_id,
    ip_address,
    user_agent,
    event_type,
    field_id,
    event_data,
    load_time_ms
  ) VALUES (
    p_config_id,
    deployment_id,
    p_user_id,
    p_session_id,
    p_ip_address::INET,
    p_user_agent,
    p_event_type,
    p_field_id,
    p_event_data,
    p_load_time_ms
  ) RETURNING id INTO analytics_id;
  
  RETURN analytics_id;
END;
$$;

-- Function to update configuration timestamps
CREATE OR REPLACE FUNCTION update_form_configuration_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers
CREATE TRIGGER form_configurations_updated_at
  BEFORE UPDATE ON form_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_form_configuration_timestamp();

CREATE TRIGGER form_ab_tests_updated_at
  BEFORE UPDATE ON form_ab_tests
  FOR EACH ROW
  EXECUTE FUNCTION update_form_configuration_timestamp();

CREATE TRIGGER form_validation_rules_updated_at
  BEFORE UPDATE ON form_validation_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_form_configuration_timestamp();

-- Insert default validation rules
INSERT INTO form_validation_rules (name, description, rule_type, rule_data, error_message, severity) VALUES
  (
    'no_sensitive_data_in_config',
    'Ensure no sensitive data like API keys or secrets are stored in form configuration',
    'security',
    '{"patterns": ["api[_-]?key", "secret", "password", "token", "credential"], "case_insensitive": true}',
    'Sensitive data detected in form configuration. Please use encrypted fields instead.',
    'critical'
  ),
  (
    'https_endpoints_only',
    'All API endpoints must use HTTPS protocol',
    'security',
    '{"require_https": true, "allowed_hosts": []}',
    'API endpoints must use HTTPS protocol for security.',
    'high'
  ),
  (
    'max_fields_per_form',
    'Limit the number of fields per form for performance',
    'technical',
    '{"max_fields": 50}',
    'Form exceeds maximum allowed fields. Consider breaking into multiple steps.',
    'medium'
  ),
  (
    'required_pci_compliance',
    'Payment forms must meet PCI compliance requirements',
    'compliance',
    '{"payment_fields": ["stripe-card", "stripe-payment"], "required_ssl": true}',
    'Payment forms must meet PCI compliance requirements.',
    'critical'
  );

COMMENT ON TABLE form_configurations IS 'Stores dynamic form configurations with versioning and encryption support';
COMMENT ON TABLE form_deployments IS 'Tracks form configuration deployments with canary and blue-green strategies';
COMMENT ON TABLE form_usage_analytics IS 'Analytics data for form usage and performance metrics';
COMMENT ON TABLE form_ab_tests IS 'A/B testing configurations for form experiments';
COMMENT ON TABLE form_validation_rules IS 'Validation rules for form configuration security and compliance';
COMMENT ON TABLE form_config_audit IS 'Audit trail for all form configuration changes';
