-- Add missing use_new_pools_ui feature flag
INSERT INTO feature_flags (name, enabled, description, created_at, updated_at) 
VALUES (
  'use_new_pools_ui', 
  false, 
  'Enable the new pools-based UI for flight offers display', 
  NOW(), 
  NOW()
) ON CONFLICT (name) DO UPDATE SET 
  enabled = EXCLUDED.enabled,
  description = EXCLUDED.description,
  updated_at = NOW();

