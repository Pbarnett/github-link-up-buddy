-- Enable flight search V2 feature flag
UPDATE feature_flags SET enabled = true WHERE name = 'flight_search_v2_enabled';

-- Insert the feature flag if it doesn't exist
INSERT INTO feature_flags (name, enabled, description) 
VALUES ('flight_search_v2_enabled', true, 'Enable the V2 flight search workflow with improved carry-on handling')
ON CONFLICT (name) DO UPDATE SET enabled = true;
