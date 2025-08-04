-- Create saga_events table for booking saga pattern implementation
-- Addresses Gap #53: Booking saga compensates failures

-- Create the saga_events table
CREATE TABLE IF NOT EXISTS public.saga_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id text NOT NULL,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS saga_events_transaction_id_idx ON public.saga_events (transaction_id);
CREATE INDEX IF NOT EXISTS saga_events_event_type_idx ON public.saga_events (event_type);
CREATE INDEX IF NOT EXISTS saga_events_created_at_idx ON public.saga_events (created_at DESC);

-- Create composite index for common queries
CREATE INDEX IF NOT EXISTS saga_events_transaction_type_time_idx 
  ON public.saga_events (transaction_id, event_type, created_at DESC);

-- Enable RLS
ALTER TABLE public.saga_events ENABLE ROW LEVEL SECURITY;

-- RLS policies (only service role can access saga events)
CREATE POLICY "Service role full access to saga events" ON public.saga_events
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.saga_events TO service_role;

-- Add comments for documentation
COMMENT ON TABLE public.saga_events IS 'Tracking table for booking saga pattern transactions and compensations';
COMMENT ON COLUMN public.saga_events.transaction_id IS 'Unique identifier for the saga transaction';
COMMENT ON COLUMN public.saga_events.event_type IS 'Type of saga event (SAGA_STARTED, STEP_COMPLETED, COMPENSATION_STARTED, etc.)';
COMMENT ON COLUMN public.saga_events.event_data IS 'Additional event metadata and context';

-- Create a view for saga transaction summaries
CREATE OR REPLACE VIEW saga_transaction_summary AS
SELECT 
  transaction_id,
  MIN(created_at) as started_at,
  MAX(created_at) as last_event_at,
  COUNT(*) as total_events,
  COUNT(CASE WHEN event_type LIKE '%_COMPLETED' THEN 1 END) as completed_steps,
  COUNT(CASE WHEN event_type LIKE '%_FAILED' THEN 1 END) as failed_steps,
  COUNT(CASE WHEN event_type LIKE 'COMPENSATION_%' THEN 1 END) as compensation_events,
  -- Determine current state based on latest events
  CASE 
    WHEN MAX(CASE WHEN event_type = 'SAGA_COMPLETED' THEN created_at END) IS NOT NULL THEN 'COMPLETED'
    WHEN MAX(CASE WHEN event_type = 'COMPENSATION_COMPLETED' THEN created_at END) IS NOT NULL THEN 'COMPENSATED'
    WHEN MAX(CASE WHEN event_type = 'COMPENSATION_PARTIALLY_FAILED' THEN created_at END) IS NOT NULL THEN 'PARTIALLY_COMPENSATED'
    WHEN MAX(CASE WHEN event_type = 'SAGA_FAILED' THEN created_at END) IS NOT NULL THEN 'FAILED'
    WHEN MAX(CASE WHEN event_type LIKE 'COMPENSATION_%' THEN created_at END) IS NOT NULL THEN 'COMPENSATING'
    WHEN MAX(CASE WHEN event_type LIKE '%_FAILED' THEN created_at END) IS NOT NULL THEN 'FAILED'
    ELSE 'IN_PROGRESS'
  END as current_state
FROM public.saga_events
GROUP BY transaction_id
ORDER BY started_at DESC;

-- Grant select access to the view
GRANT SELECT ON saga_transaction_summary TO service_role;

-- Log successful migration
INSERT INTO public.system_logs (
  operation,
  message,
  metadata,
  created_at
)
VALUES (
  'migration_saga_events',
  'Successfully created saga_events table and supporting structures',
  jsonb_build_object(
    'tables_created', 1,
    'indexes_created', 4,
    'views_created', 1,
    'migration_time', NOW()
  ),
  NOW()
);
