-- Create missing queue infrastructure
-- This creates the proper queue table structure and RPC functions

-- 1. Add missing columns to notification_queue table
ALTER TABLE public.notification_queue ADD COLUMN IF NOT EXISTS queue_name TEXT;
ALTER TABLE public.notification_queue ADD COLUMN IF NOT EXISTS visible_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.notification_queue ADD COLUMN IF NOT EXISTS processing_started_at TIMESTAMPTZ;

-- 2. Create index for efficient queue processing
CREATE INDEX IF NOT EXISTS idx_notification_queue_visibility 
ON public.notification_queue(queue_name, visible_at) 
WHERE processed_at IS NULL;

-- 3. Create the dequeue RPC function
CREATE OR REPLACE FUNCTION dequeue_notification_job(
  p_queue_name TEXT,
  p_visibility_timeout INTEGER DEFAULT 30
)
RETURNS TABLE (
  id UUID,
  queue_name TEXT,
  message JSONB,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
DECLARE
  job_record RECORD;
  visibility_deadline TIMESTAMPTZ;
BEGIN
  visibility_deadline := NOW() + (p_visibility_timeout || ' seconds')::INTERVAL;
  
  -- Find and lock the next available job
  SELECT nq.id, nq.queue_name, nq.message, nq.created_at
  INTO job_record
  FROM public.notification_queue nq
  WHERE nq.queue_name = p_queue_name
    AND nq.visible_at <= NOW()
    AND nq.processed_at IS NULL
    AND (nq.processing_started_at IS NULL OR nq.processing_started_at < NOW() - INTERVAL '60 seconds')
  ORDER BY nq.visible_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;
  
  IF FOUND THEN
    -- Mark as being processed
    UPDATE public.notification_queue
    SET processing_started_at = NOW()
    WHERE notification_queue.id = job_record.id;
    
    -- Return the job
    RETURN QUERY SELECT 
      job_record.id,
      job_record.queue_name,
      job_record.message,
      job_record.created_at;
  END IF;
  
  RETURN;
END;
$$;

-- 4. Grant permissions
GRANT EXECUTE ON FUNCTION dequeue_notification_job(TEXT, INTEGER) TO service_role;

-- Queue infrastructure setup complete!
