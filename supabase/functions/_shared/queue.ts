import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

export interface NotificationJob {
  id: string;
  type: string;
  user_id: string;
  notification_id: string;
  channel: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  data: Record<string, any>;
  retry_count?: number;
  scheduled_for?: string;
}

export class NotificationQueue {
  /**
   * Enqueue a notification job for processing
   */
  static async enqueue(job: NotificationJob): Promise<void> {
    const queueName = job.priority === 'critical' ? 'critical_notifications' : 'notifications';
    
    try {
      // For now, we'll use a simple database table as a queue
      // In the future, this can be replaced with PGMQ or another proper queue system
      const { error } = await supabase
        .from('notification_queue')
        .insert({
          id: job.id,
          queue_name: queueName,
          message: job,
          created_at: new Date().toISOString(),
          visible_at: job.scheduled_for || new Date().toISOString()
        });
      
      if (error) {
        // If table doesn't exist, create it on the fly
        if (error.code === '42P01') {
          await this.createQueueTable();
          // Retry the insert
          const { error: retryError } = await supabase
            .from('notification_queue')
            .insert({
              id: job.id,
              queue_name: queueName,
              message: job,
              created_at: new Date().toISOString(),
              visible_at: job.scheduled_for || new Date().toISOString()
            });
          
          if (retryError) throw retryError;
        } else {
          throw error;
        }
      }
      
      console.log(`[NotificationQueue] Enqueued job ${job.id} to ${queueName}`);
    } catch (error) {
      console.error(`[NotificationQueue] Failed to enqueue job ${job.id}:`, error);
      throw error;
    }
  }

  /**
   * Dequeue a notification job for processing
   */
  static async dequeue(queueName: string = 'notifications'): Promise<any> {
    try {
      const { data, error } = await supabase
        .rpc('dequeue_notification_job', {
          p_queue_name: queueName,
          p_visibility_timeout: 30 // 30 second visibility timeout
        });
      
      if (error) {
        console.error(`[NotificationQueue] Failed to dequeue from ${queueName}:`, error);
        return null;
      }
      
      return data?.[0] || null;
    } catch (error) {
      console.error(`[NotificationQueue] Error dequeuing from ${queueName}:`, error);
      return null;
    }
  }

  /**
   * Mark a job as completed and remove from queue
   */
  static async complete(queueName: string, jobId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notification_queue')
        .delete()
        .eq('id', jobId)
        .eq('queue_name', queueName);
      
      if (error) {
        console.error(`[NotificationQueue] Failed to complete job ${jobId}:`, error);
        throw error;
      }
      
      console.log(`[NotificationQueue] Completed job ${jobId} from ${queueName}`);
    } catch (error) {
      console.error(`[NotificationQueue] Error completing job ${jobId}:`, error);
      throw error;
    }
  }

  /**
   * Requeue a job with backoff delay
   */
  static async requeue(job: NotificationJob, delaySeconds: number): Promise<void> {
    const retryJob = {
      ...job,
      retry_count: (job.retry_count || 0) + 1,
      scheduled_for: new Date(Date.now() + delaySeconds * 1000).toISOString()
    };

    await this.enqueue(retryJob);
  }

  /**
   * Create the notification queue table if it doesn't exist
   */
  private static async createQueueTable(): Promise<void> {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.notification_queue (
        id UUID PRIMARY KEY,
        queue_name TEXT NOT NULL,
        message JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        visible_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        processing_started_at TIMESTAMPTZ,
        processed_at TIMESTAMPTZ
      );

      CREATE INDEX IF NOT EXISTS idx_notification_queue_visibility 
      ON public.notification_queue(queue_name, visible_at) 
      WHERE processed_at IS NULL;

      -- RPC function to dequeue jobs atomically
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
    `;

    const { error } = await supabase.rpc('exec', { sql: createTableSQL });
    if (error) {
      console.error('[NotificationQueue] Failed to create queue table:', error);
      throw error;
    }

    console.log('[NotificationQueue] Queue table and functions created successfully');
  }

  /**
   * Get queue statistics
   */
  static async getQueueStats(queueName?: string): Promise<any> {
    try {
      const query = supabase
        .from('notification_queue')
        .select('queue_name, visible_at, processed_at')
        .is('processed_at', null);

      if (queueName) {
        query.eq('queue_name', queueName);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[NotificationQueue] Failed to get queue stats:', error);
        return null;
      }

      const stats = {
        total_pending: data?.length || 0,
        ready_to_process: data?.filter(job => new Date(job.visible_at) <= new Date()).length || 0,
        scheduled_future: data?.filter(job => new Date(job.visible_at) > new Date()).length || 0
      };

      if (queueName) {
        return { [queueName]: stats };
      }

      // Group by queue name
      const statsByQueue: Record<string, any> = {};
      data?.forEach(job => {
        if (!statsByQueue[job.queue_name]) {
          statsByQueue[job.queue_name] = {
            total_pending: 0,
            ready_to_process: 0,
            scheduled_future: 0
          };
        }
        statsByQueue[job.queue_name].total_pending++;
        if (new Date(job.visible_at) <= new Date()) {
          statsByQueue[job.queue_name].ready_to_process++;
        } else {
          statsByQueue[job.queue_name].scheduled_future++;
        }
      });

      return statsByQueue;
    } catch (error) {
      console.error('[NotificationQueue] Error getting queue stats:', error);
      return null;
    }
  }
}
