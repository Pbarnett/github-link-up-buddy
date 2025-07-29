/// <reference lib="deno.ns" />
/**
 * Automated Cron Scheduler for Customer Lifecycle Management
 * 
 * This function runs on a schedule to automatically process customer lifecycles.
 * Designed to be triggered by Supabase Cron or external schedulers.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LIFECYCLE_SCHEDULER_URL = `${Deno.env.get("SUPABASE_URL")}/functions/v1/customer-lifecycle-scheduler`;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!LIFECYCLE_SCHEDULER_URL || !SERVICE_ROLE_KEY) {
  throw new Error('Missing required environment variables');
}

serve(async (req) => {
  console.log('[LIFECYCLE-CRON] Starting automated lifecycle process');
  
  try {
    // Call the main lifecycle processor
    const response = await fetch(`${LIFECYCLE_SCHEDULER_URL}?action=run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dryRun: false,
        batchSize: 50,
        inactiveThresholdDays: 365,
        anonymizationDelayDays: 1095,
        deletionDelayDays: 2555,
      }),
    });
    
    const result = await response.json();
    
    console.log('[LIFECYCLE-CRON] Lifecycle process completed:', result);
    
    // Log the scheduled run
    if (result.success) {
      console.log(`[LIFECYCLE-CRON] Successfully processed ${result.results.identified} customers`);
      console.log(`[LIFECYCLE-CRON] Anonymized: ${result.results.anonymized}, Deleted: ${result.results.deleted}`);
    } else {
      console.error('[LIFECYCLE-CRON] Lifecycle process failed:', result.error);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Automated lifecycle process completed',
        timestamp: new Date().toISOString(),
        lifecycleResult: result,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
    
  } catch (error) {
    console.error('[LIFECYCLE-CRON] Failed to run automated process:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
