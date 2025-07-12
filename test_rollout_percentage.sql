-- Test query to verify rollout_percentage column exists
SELECT rollout_percentage FROM feature_flags LIMIT 1;

-- Test inserting a new feature flag with rollout percentage
INSERT INTO feature_flags (name, enabled, rollout_percentage) 
VALUES ('test_rollout_column', true, 5)
ON CONFLICT (name) DO UPDATE SET 
    enabled = EXCLUDED.enabled,
    rollout_percentage = EXCLUDED.rollout_percentage;
