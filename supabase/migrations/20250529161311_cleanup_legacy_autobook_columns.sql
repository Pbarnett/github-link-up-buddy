-- supabase/migrations/20250529161311_cleanup_legacy_autobook_columns.sql

-- This migration should run AFTER the data migration for notifications.payload
-- (e.g., after 20250529145652_migrate_notification_payload_to_data.sql)
-- and also after 20250530120000_align_schema_auto_booking.sql (which added new columns and renamed auto_book_enabled).

BEGIN;

RAISE NOTICE 'Attempting to drop legacy columns...';

-- Drop booking_requests.error
-- This column was superseded by booking_requests.error_message
ALTER TABLE public.booking_requests
  DROP COLUMN IF EXISTS error;
RAISE NOTICE 'Dropped column "error" from "booking_requests" if it existed.';

-- Drop notifications.payload
-- This column's data should have been migrated to notifications.data
ALTER TABLE public.notifications
  DROP COLUMN IF EXISTS payload;
RAISE NOTICE 'Dropped column "payload" from "notifications" if it existed.';

-- Drop trip_requests.auto_book_enabled
-- This column should have been renamed to 'auto_book' in the 20250530120000_align_schema_auto_booking.sql migration.
-- Dropping it here ensures cleanup if the rename logic didn't execute as expected (e.g., if 'auto_book' already existed
-- and 'auto_book_enabled' was left behind).
ALTER TABLE public.trip_requests
  DROP COLUMN IF EXISTS auto_book_enabled;
RAISE NOTICE 'Dropped column "auto_book_enabled" from "trip_requests" if it existed.';

RAISE NOTICE 'Legacy column cleanup process completed.';

COMMIT;
```
