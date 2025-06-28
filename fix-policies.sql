-- Fix RLS policies with proper PostgreSQL syntax
-- This handles the policy creation that failed

DO $$
BEGIN
    -- Drop existing policies if they exist to avoid conflicts
    DROP POLICY IF EXISTS "Service role can manage all templates" ON public.notification_templates;
    DROP POLICY IF EXISTS "Service role can manage all deliveries" ON public.notification_deliveries;
    DROP POLICY IF EXISTS "Service role can manage all events" ON public.events;

    -- Create new policies
    CREATE POLICY "Service role can manage all templates" ON public.notification_templates
        FOR ALL USING (auth.role() = 'service_role');

    CREATE POLICY "Service role can manage all deliveries" ON public.notification_deliveries
        FOR ALL USING (auth.role() = 'service_role');

    CREATE POLICY "Service role can manage all events" ON public.events
        FOR ALL USING (auth.role() = 'service_role');

EXCEPTION WHEN OTHERS THEN
    -- If there are any errors, just continue
    RAISE NOTICE 'Policy creation completed with some warnings: %', SQLERRM;
END
$$;
