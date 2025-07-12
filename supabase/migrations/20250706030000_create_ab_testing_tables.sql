-- A/B Testing Tables Migration
-- This creates the core tables needed for A/B testing functionality

-- A/B Tests table - stores test configurations
CREATE TABLE IF NOT EXISTS ab_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    form_id UUID NOT NULL REFERENCES form_configurations(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed')),
    traffic_allocation DECIMAL(3,2) NOT NULL DEFAULT 1.00 CHECK (traffic_allocation >= 0 AND traffic_allocation <= 1),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    confidence_level DECIMAL(3,2) NOT NULL DEFAULT 0.95 CHECK (confidence_level >= 0 AND confidence_level <= 1),
    minimum_sample_size INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    winner_variant_id UUID,
    
    -- Constraints
    CONSTRAINT valid_date_range CHECK (end_date IS NULL OR start_date < end_date),
    CONSTRAINT valid_traffic_allocation CHECK (traffic_allocation > 0)
);

-- A/B Test Variants table - stores different versions of forms
CREATE TABLE IF NOT EXISTS ab_test_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ab_test_id UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_control BOOLEAN NOT NULL DEFAULT FALSE,
    traffic_weight DECIMAL(3,2) NOT NULL DEFAULT 0.50 CHECK (traffic_weight >= 0 AND traffic_weight <= 1),
    form_configuration JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure traffic weights are valid
    CONSTRAINT valid_traffic_weight CHECK (traffic_weight >= 0 AND traffic_weight <= 1)
);

-- A/B Test Assignments table - tracks which users see which variants
CREATE TABLE IF NOT EXISTS ab_test_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ab_test_id UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES ab_test_variants(id) ON DELETE CASCADE,
    user_session_id TEXT NOT NULL, -- Can be anonymous session or user ID
    user_id UUID REFERENCES auth.users(id), -- Optional for logged-in users
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    
    -- Unique constraint to prevent duplicate assignments
    UNIQUE(ab_test_id, user_session_id)
);

-- A/B Test Results table - aggregated metrics per variant
CREATE TABLE IF NOT EXISTS ab_test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ab_test_id UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES ab_test_variants(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Core metrics
    impressions INTEGER NOT NULL DEFAULT 0,
    unique_visitors INTEGER NOT NULL DEFAULT 0,
    form_starts INTEGER NOT NULL DEFAULT 0,
    form_completions INTEGER NOT NULL DEFAULT 0,
    form_submissions INTEGER NOT NULL DEFAULT 0,
    
    -- Calculated rates (stored for performance)
    start_rate DECIMAL(5,4) GENERATED ALWAYS AS (
        CASE WHEN impressions > 0 THEN form_starts::DECIMAL / impressions ELSE 0 END
    ) STORED,
    completion_rate DECIMAL(5,4) GENERATED ALWAYS AS (
        CASE WHEN form_starts > 0 THEN form_completions::DECIMAL / form_starts ELSE 0 END
    ) STORED,
    conversion_rate DECIMAL(5,4) GENERATED ALWAYS AS (
        CASE WHEN impressions > 0 THEN form_submissions::DECIMAL / impressions ELSE 0 END
    ) STORED,
    
    -- Time-based metrics
    avg_time_to_complete INTERVAL,
    avg_time_to_abandon INTERVAL,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint for daily aggregates
    UNIQUE(ab_test_id, variant_id, date)
);

-- A/B Test Events table - raw event tracking
CREATE TABLE IF NOT EXISTS ab_test_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ab_test_id UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES ab_test_variants(id) ON DELETE CASCADE,
    assignment_id UUID NOT NULL REFERENCES ab_test_assignments(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('impression', 'form_start', 'field_interaction', 'form_completion', 'form_submission', 'form_abandonment')),
    event_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Statistical Significance table - tracks test significance calculations
CREATE TABLE IF NOT EXISTS ab_test_significance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ab_test_id UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
    control_variant_id UUID NOT NULL REFERENCES ab_test_variants(id) ON DELETE CASCADE,
    test_variant_id UUID NOT NULL REFERENCES ab_test_variants(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    
    -- Statistical calculations
    control_value DECIMAL(10,6) NOT NULL,
    test_value DECIMAL(10,6) NOT NULL,
    difference DECIMAL(10,6) NOT NULL,
    relative_difference DECIMAL(10,6) NOT NULL,
    
    -- Significance testing
    p_value DECIMAL(10,8),
    confidence_interval_lower DECIMAL(10,6),
    confidence_interval_upper DECIMAL(10,6),
    is_significant BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Sample sizes
    control_sample_size INTEGER NOT NULL,
    test_sample_size INTEGER NOT NULL,
    
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint for metric comparisons
    UNIQUE(ab_test_id, control_variant_id, test_variant_id, metric_name)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ab_test_events_test_variant ON ab_test_events(ab_test_id, variant_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_events_type_date ON ab_test_events(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_ab_test_events_assignment ON ab_test_events(assignment_id);

CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_ab_tests_form_id ON ab_tests(form_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_dates ON ab_tests(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_ab_test_variants_test_id ON ab_test_variants(ab_test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_variants_control ON ab_test_variants(ab_test_id, is_control);

CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_test_id ON ab_test_assignments(ab_test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_session ON ab_test_assignments(user_session_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_user ON ab_test_assignments(user_id);

CREATE INDEX IF NOT EXISTS idx_ab_test_results_test_variant_date ON ab_test_results(ab_test_id, variant_id, date);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_date ON ab_test_results(date);

-- Enable Row Level Security
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_significance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for A/B Testing (allow service role to manage everything)
CREATE POLICY "Service role can manage ab_tests" ON ab_tests FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage ab_test_variants" ON ab_test_variants FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage ab_test_assignments" ON ab_test_assignments FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage ab_test_results" ON ab_test_results FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage ab_test_events" ON ab_test_events FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage ab_test_significance" ON ab_test_significance FOR ALL TO service_role USING (true);

-- Public read access for assignments and events (needed for frontend)
CREATE POLICY "Public can read ab_test_assignments" ON ab_test_assignments FOR SELECT TO public USING (true);
CREATE POLICY "Public can create ab_test_assignments" ON ab_test_assignments FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can create ab_test_events" ON ab_test_events FOR INSERT TO public WITH CHECK (true);

-- Functions to update timestamps
CREATE OR REPLACE FUNCTION update_ab_test_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at timestamps
CREATE TRIGGER update_ab_tests_updated_at
    BEFORE UPDATE ON ab_tests
    FOR EACH ROW
    EXECUTE FUNCTION update_ab_test_updated_at();

CREATE TRIGGER update_ab_test_variants_updated_at
    BEFORE UPDATE ON ab_test_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_ab_test_updated_at();

CREATE TRIGGER update_ab_test_results_updated_at
    BEFORE UPDATE ON ab_test_results
    FOR EACH ROW
    EXECUTE FUNCTION update_ab_test_updated_at();

-- Function to automatically calculate daily aggregates
CREATE OR REPLACE FUNCTION calculate_ab_test_daily_results()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert or update daily results
    INSERT INTO ab_test_results (ab_test_id, variant_id, date, impressions, unique_visitors, form_starts, form_completions, form_submissions)
    VALUES (
        NEW.ab_test_id,
        NEW.variant_id,
        CURRENT_DATE,
        CASE WHEN NEW.event_type = 'impression' THEN 1 ELSE 0 END,
        CASE WHEN NEW.event_type = 'impression' THEN 1 ELSE 0 END, -- Simplified for now
        CASE WHEN NEW.event_type = 'form_start' THEN 1 ELSE 0 END,
        CASE WHEN NEW.event_type = 'form_completion' THEN 1 ELSE 0 END,
        CASE WHEN NEW.event_type = 'form_submission' THEN 1 ELSE 0 END
    )
    ON CONFLICT (ab_test_id, variant_id, date)
    DO UPDATE SET
        impressions = ab_test_results.impressions + CASE WHEN NEW.event_type = 'impression' THEN 1 ELSE 0 END,
        form_starts = ab_test_results.form_starts + CASE WHEN NEW.event_type = 'form_start' THEN 1 ELSE 0 END,
        form_completions = ab_test_results.form_completions + CASE WHEN NEW.event_type = 'form_completion' THEN 1 ELSE 0 END,
        form_submissions = ab_test_results.form_submissions + CASE WHEN NEW.event_type = 'form_submission' THEN 1 ELSE 0 END,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update daily aggregates
CREATE TRIGGER update_ab_test_daily_results
    AFTER INSERT ON ab_test_events
    FOR EACH ROW
    EXECUTE FUNCTION calculate_ab_test_daily_results();

-- Add some sample data for testing
INSERT INTO ab_tests (name, description, form_id, status, traffic_allocation, start_date, confidence_level, minimum_sample_size)
SELECT 
    'Flight Search Form Layout Test',
    'Testing different layouts for the flight search form to improve conversion rates',
    id,
    'running',
    0.50,
    NOW() - INTERVAL '7 days',
    0.95,
    200
FROM form_configurations 
WHERE name = 'Parker Flight Search Form'
LIMIT 1;

-- Add variants for the test
INSERT INTO ab_test_variants (ab_test_id, name, description, is_control, traffic_weight, form_configuration)
SELECT 
    ab_tests.id,
    'Control - Original Layout',
    'Original flight search form layout',
    true,
    0.50,
    form_configurations.config_data
FROM ab_tests
JOIN form_configurations ON ab_tests.form_id = form_configurations.id
WHERE ab_tests.name = 'Flight Search Form Layout Test';

INSERT INTO ab_test_variants (ab_test_id, name, description, is_control, traffic_weight, form_configuration)
SELECT 
    ab_tests.id,
    'Variant A - Simplified Layout',
    'Simplified form with fewer fields visible initially',
    false,
    0.50,
    jsonb_build_object(
        'title', 'Find Your Perfect Flight',
        'description', 'Search for flights with our simplified booking experience',
        'fields', jsonb_build_array(
            jsonb_build_object('id', 'departure_airports', 'type', 'multi-select', 'label', 'From', 'required', true, 'options', jsonb_build_array(
                jsonb_build_object('value', 'JFK', 'label', 'JFK - John F. Kennedy International'),
                jsonb_build_object('value', 'LGA', 'label', 'LGA - LaGuardia'),
                jsonb_build_object('value', 'EWR', 'label', 'EWR - Newark Liberty'),
                jsonb_build_object('value', 'other', 'label', 'Other airport')
            )),
            jsonb_build_object('id', 'destination', 'type', 'text', 'label', 'To', 'required', true, 'placeholder', 'City or airport'),
            jsonb_build_object('id', 'travel_window', 'type', 'date-range', 'label', 'Travel Window', 'required', true, 'description', 'Your flexible departure dates'),
            jsonb_build_object('id', 'budget', 'type', 'number', 'label', 'Budget per person', 'required', true, 'placeholder', '500', 'description', 'Round-trip, nonstop, carry-on included')
        )
    )
FROM ab_tests
WHERE ab_tests.name = 'Flight Search Form Layout Test';

-- Add some sample assignments and events
INSERT INTO ab_test_assignments (ab_test_id, variant_id, user_session_id, assigned_at)
SELECT 
    ab_tests.id,
    ab_test_variants.id,
    'session_' || gen_random_uuid(),
    NOW() - INTERVAL '1 day' * (random() * 6)
FROM ab_tests
CROSS JOIN ab_test_variants
WHERE ab_tests.name = 'Flight Search Form Layout Test'
AND ab_test_variants.ab_test_id = ab_tests.id
LIMIT 50;

-- Add sample events
INSERT INTO ab_test_events (ab_test_id, variant_id, assignment_id, event_type, created_at)
SELECT 
    a.ab_test_id,
    a.variant_id,
    a.id,
    'impression',
    a.assigned_at
FROM ab_test_assignments a
WHERE a.ab_test_id IN (SELECT id FROM ab_tests WHERE name = 'Flight Search Form Layout Test');

-- Add form start events (80% of impressions)
INSERT INTO ab_test_events (ab_test_id, variant_id, assignment_id, event_type, created_at)
SELECT 
    a.ab_test_id,
    a.variant_id,
    a.id,
    'form_start',
    a.assigned_at + INTERVAL '30 seconds'
FROM ab_test_assignments a
WHERE a.ab_test_id IN (SELECT id FROM ab_tests WHERE name = 'Flight Search Form Layout Test')
AND random() < 0.8;

-- Add form completion events (60% of starts)
INSERT INTO ab_test_events (ab_test_id, variant_id, assignment_id, event_type, created_at)
SELECT 
    a.ab_test_id,
    a.variant_id,
    a.id,
    'form_completion',
    a.assigned_at + INTERVAL '2 minutes'
FROM ab_test_assignments a
WHERE a.ab_test_id IN (SELECT id FROM ab_tests WHERE name = 'Flight Search Form Layout Test')
AND a.id IN (
    SELECT assignment_id FROM ab_test_events 
    WHERE event_type = 'form_start' AND assignment_id = a.id
)
AND random() < 0.6;

-- Add form submission events (90% of completions)
INSERT INTO ab_test_events (ab_test_id, variant_id, assignment_id, event_type, created_at)
SELECT 
    a.ab_test_id,
    a.variant_id,
    a.id,
    'form_submission',
    a.assigned_at + INTERVAL '3 minutes'
FROM ab_test_assignments a
WHERE a.ab_test_id IN (SELECT id FROM ab_tests WHERE name = 'Flight Search Form Layout Test')
AND a.id IN (
    SELECT assignment_id FROM ab_test_events 
    WHERE event_type = 'form_completion' AND assignment_id = a.id
)
AND random() < 0.9;

COMMENT ON TABLE ab_tests IS 'Stores A/B test configurations and metadata';
COMMENT ON TABLE ab_test_variants IS 'Stores different versions of forms for A/B testing';
COMMENT ON TABLE ab_test_assignments IS 'Tracks which users see which test variants';
COMMENT ON TABLE ab_test_results IS 'Daily aggregated results for A/B test performance';
COMMENT ON TABLE ab_test_events IS 'Raw events for detailed A/B test tracking';
COMMENT ON TABLE ab_test_significance IS 'Statistical significance calculations for A/B tests';
