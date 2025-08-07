-- 1️⃣ Trip requests get a nullable mode column
ALTER TABLE trip_requests ADD COLUMN IF NOT EXISTS search_mode text
    CHECK (search_mode IN ('LEGACY','AUTO','MANUAL')) DEFAULT 'LEGACY';

-- 2️⃣ Feature flag table insert (idempotent)
INSERT INTO feature_flags (name, enabled, description, created_at, updated_at)
VALUES ('flight_search_v2_enabled', false,
        'Gate for new flight-search v2 pipeline', NOW(), NOW())
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

