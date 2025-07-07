-- Form Analytics Enhancement Migration
-- Adds analytics tracking and dashboard capabilities

-- Enhanced form analytics with more detailed tracking
CREATE TABLE IF NOT EXISTS form_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Form identification
  form_config_id UUID REFERENCES form_configurations(id) ON DELETE CASCADE,
  form_name VARCHAR(100) NOT NULL,
  form_version INTEGER NOT NULL,
  
  -- Session tracking
  session_id VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  
  -- Event details
  event_type VARCHAR(50) NOT NULL, -- 'form_view', 'field_interaction', 'field_error', 'form_submit', 'form_abandon'
  event_data JSONB DEFAULT '{}',
  
  -- Field-specific data (for field-level analytics)
  field_id VARCHAR(100),
  field_type VARCHAR(50),
  field_value TEXT,
  validation_error TEXT,
  
  -- Performance metrics
  timestamp_ms BIGINT NOT NULL, -- Unix timestamp in milliseconds
  duration_ms INTEGER, -- Time spent on field/form
  
  -- User context
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Form completion analytics (aggregated data)
CREATE TABLE IF NOT EXISTS form_completion_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Form identification
  form_config_id UUID REFERENCES form_configurations(id) ON DELETE CASCADE,
  form_name VARCHAR(100) NOT NULL,
  
  -- Time period (daily aggregation)
  date DATE NOT NULL,
  
  -- Completion metrics
  total_views INTEGER DEFAULT 0,
  total_starts INTEGER DEFAULT 0, -- Users who interacted with first field
  total_completions INTEGER DEFAULT 0,
  total_submissions INTEGER DEFAULT 0,
  total_abandons INTEGER DEFAULT 0,
  
  -- Performance metrics
  avg_completion_time_ms INTEGER,
  avg_time_to_first_interaction_ms INTEGER,
  
  -- Field-level metrics
  field_analytics JSONB DEFAULT '{}', -- {"field_id": {"interactions": 0, "errors": 0, "avg_time": 0}}
  
  -- Calculated rates
  completion_rate DECIMAL(5,2), -- (completions / views) * 100
  abandonment_rate DECIMAL(5,2), -- (abandons / starts) * 100
  error_rate DECIMAL(5,2), -- (total_errors / total_interactions) * 100
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(form_config_id, date)
);

-- Form A/B test results
CREATE TABLE IF NOT EXISTS form_ab_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Test identification
  test_name VARCHAR(100) NOT NULL,
  form_a_config_id UUID REFERENCES form_configurations(id),
  form_b_config_id UUID REFERENCES form_configurations(id),
  
  -- Test period
  start_date DATE NOT NULL,
  end_date DATE,
  
  -- Results
  form_a_views INTEGER DEFAULT 0,
  form_a_completions INTEGER DEFAULT 0,
  form_b_views INTEGER DEFAULT 0,
  form_b_completions INTEGER DEFAULT 0,
  
  -- Statistical significance
  confidence_level DECIMAL(4,2), -- e.g., 95.0
  p_value DECIMAL(10,8),
  is_significant BOOLEAN DEFAULT FALSE,
  winner VARCHAR(10), -- 'A', 'B', or 'INCONCLUSIVE'
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_form_analytics_events_config_timestamp 
ON form_analytics_events(form_config_id, created_at);

CREATE INDEX idx_form_analytics_events_session 
ON form_analytics_events(session_id, timestamp_ms);

CREATE INDEX idx_form_analytics_events_type 
ON form_analytics_events(event_type, created_at);

CREATE INDEX idx_form_completion_analytics_date 
ON form_completion_analytics(form_config_id, date);

-- Row Level Security
ALTER TABLE form_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_completion_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_ab_test_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies (service role only for analytics)
CREATE POLICY "Service role manages analytics events" 
ON form_analytics_events FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Service role manages completion analytics" 
ON form_completion_analytics FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Service role manages A/B test results" 
ON form_ab_test_results FOR ALL 
USING (auth.role() = 'service_role');

-- Function to track form events
CREATE OR REPLACE FUNCTION track_form_event(
  p_form_config_id UUID,
  p_form_name VARCHAR(100),
  p_form_version INTEGER,
  p_session_id VARCHAR(100),
  p_user_id UUID DEFAULT NULL,
  p_event_type VARCHAR(50),
  p_event_data JSONB DEFAULT '{}',
  p_field_id VARCHAR(100) DEFAULT NULL,
  p_field_type VARCHAR(50) DEFAULT NULL,
  p_field_value TEXT DEFAULT NULL,
  p_validation_error TEXT DEFAULT NULL,
  p_duration_ms INTEGER DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO form_analytics_events (
    form_config_id,
    form_name,
    form_version,
    session_id,
    user_id,
    event_type,
    event_data,
    field_id,
    field_type,
    field_value,
    validation_error,
    timestamp_ms,
    duration_ms,
    user_agent,
    ip_address,
    referrer
  ) VALUES (
    p_form_config_id,
    p_form_name,
    p_form_version,
    p_session_id,
    p_user_id,
    p_event_type,
    p_event_data,
    p_field_id,
    p_field_type,
    p_field_value,
    p_validation_error,
    EXTRACT(EPOCH FROM NOW()) * 1000, -- Current timestamp in milliseconds
    p_duration_ms,
    p_user_agent,
    p_ip_address::INET,
    p_referrer
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- Function to aggregate daily analytics
CREATE OR REPLACE FUNCTION aggregate_daily_form_analytics(target_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  form_record RECORD;
  analytics_record RECORD;
BEGIN
  -- Loop through each form configuration
  FOR form_record IN 
    SELECT DISTINCT form_config_id, form_name 
    FROM form_analytics_events 
    WHERE DATE(created_at) = target_date
  LOOP
    -- Calculate metrics for this form on this date
    SELECT 
      COUNT(*) FILTER (WHERE event_type = 'form_view') as total_views,
      COUNT(*) FILTER (WHERE event_type = 'field_interaction') as total_starts,
      COUNT(*) FILTER (WHERE event_type = 'form_submit') as total_submissions,
      COUNT(*) FILTER (WHERE event_type = 'form_abandon') as total_abandons,
      AVG(duration_ms) FILTER (WHERE event_type = 'form_submit') as avg_completion_time,
      COUNT(DISTINCT session_id) as unique_sessions
    INTO analytics_record
    FROM form_analytics_events 
    WHERE form_config_id = form_record.form_config_id 
      AND DATE(created_at) = target_date;
    
    -- Insert or update daily analytics
    INSERT INTO form_completion_analytics (
      form_config_id,
      form_name,
      date,
      total_views,
      total_starts,
      total_submissions,
      total_abandons,
      avg_completion_time_ms,
      completion_rate,
      abandonment_rate
    ) VALUES (
      form_record.form_config_id,
      form_record.form_name,
      target_date,
      analytics_record.total_views,
      analytics_record.total_starts,
      analytics_record.total_submissions,
      analytics_record.total_abandons,
      analytics_record.avg_completion_time,
      CASE 
        WHEN analytics_record.total_views > 0 
        THEN (analytics_record.total_submissions::DECIMAL / analytics_record.total_views) * 100
        ELSE 0 
      END,
      CASE 
        WHEN analytics_record.total_starts > 0 
        THEN (analytics_record.total_abandons::DECIMAL / analytics_record.total_starts) * 100
        ELSE 0 
      END
    )
    ON CONFLICT (form_config_id, date) 
    DO UPDATE SET
      total_views = EXCLUDED.total_views,
      total_starts = EXCLUDED.total_starts,
      total_submissions = EXCLUDED.total_submissions,
      total_abandons = EXCLUDED.total_abandons,
      avg_completion_time_ms = EXCLUDED.avg_completion_time_ms,
      completion_rate = EXCLUDED.completion_rate,
      abandonment_rate = EXCLUDED.abandonment_rate,
      updated_at = NOW();
  END LOOP;
END;
$$;

COMMENT ON TABLE form_analytics_events IS 'Individual form interaction events for detailed analytics';
COMMENT ON TABLE form_completion_analytics IS 'Daily aggregated form completion metrics';
COMMENT ON TABLE form_ab_test_results IS 'A/B test results and statistical significance';
