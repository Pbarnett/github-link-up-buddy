
-- Disable the pools UI feature flag to revert to legacy system
UPDATE feature_flags 
SET enabled = false, updated_at = NOW() 
WHERE name = 'use_new_pools_ui';

-- Ensure the flag exists with disabled state
INSERT INTO feature_flags (name, enabled, description, created_at, updated_at) 
VALUES (
  'use_new_pools_ui', 
  false, 
  'Enable the new pools-based UI for flight offers display', 
  NOW(), 
  NOW()
) ON CONFLICT (name) DO UPDATE SET 
  enabled = false,
  description = EXCLUDED.description,
  updated_at = NOW();
