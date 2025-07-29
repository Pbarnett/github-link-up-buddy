/// <reference lib="deno.ns" />
/**
 * Scheduled Customer Lifecycle Management Function
 * 
 * This function runs customer lifecycle management processes on a schedule:
 * - Identifies inactive customers
 * - Anonymizes customers after retention period
 * - Deletes customers after extended retention period
 * - Maintains audit logs for all actions
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Environment validation
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") || 'test_key_placeholder';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

async function runLifecycleProcess(config: any = {}) {
  console.log('[LIFECYCLE-SCHEDULER] Starting customer lifecycle process');
  
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  
  const lifecycleConfig = {
    inactiveThresholdDays: config.inactiveThresholdDays || 365,  // 1 year
    anonymizationDelayDays: config.anonymizationDelayDays || 1095, // 3 years
    deletionDelayDays: config.deletionDelayDays || 2555,        // 7 years
    batchSize: config.batchSize || 10,
    dryRun: config.dryRun !== false, // Default to dry run for safety
  };

  const results = {
    identified: 0,
    anonymized: 0,
    deleted: 0,
    errors: 0,
    processedCustomers: [],
  };

  try {
    console.log('[LIFECYCLE-SCHEDULER] Configuration:', lifecycleConfig);
    
    // Step 1: Identify inactive customers
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - lifecycleConfig.inactiveThresholdDays);
    
    console.log('[LIFECYCLE-SCHEDULER] Querying for inactive customers since:', cutoffDate.toISOString());
    
    const { data: inactiveCustomers, error: queryError } = await supabase
      .from('stripe_customers')
      .select('*')
      .lt('last_payment_at', cutoffDate.toISOString())
      .is('anonymized_at', null) // Not already anonymized
      .order('last_payment_at', { ascending: true })
      .limit(lifecycleConfig.batchSize);
    
    if (queryError) {
      throw new Error(`Failed to query inactive customers: ${queryError.message}`);
    }
    
    console.log('[LIFECYCLE-SCHEDULER] Found inactive customers:', inactiveCustomers?.length || 0);
    
    if (!inactiveCustomers || inactiveCustomers.length === 0) {
      console.log('[LIFECYCLE-SCHEDULER] No inactive customers found');
      return {
        success: true,
        results,
        config: lifecycleConfig,
        message: 'No inactive customers found to process',
        timestamp: new Date().toISOString(),
      };
    }
    
    // Process each inactive customer
    for (const customer of inactiveCustomers) {
      try {
        const lastActivity = new Date(customer.last_payment_at);
        const daysInactive = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
        
        console.log(`[LIFECYCLE-SCHEDULER] Processing customer ${customer.stripe_customer_id}, inactive for ${daysInactive} days`);
        
        // Log identification
        await supabase
          .from('customer_lifecycle_audit')
          .insert({
            customer_id: customer.stripe_customer_id,
            user_id: customer.user_id,
            action: 'identified_inactive',
            reason: `Customer inactive for ${daysInactive} days`,
            metadata: {
              days_inactive: daysInactive,
              email: customer.email,
              dry_run: lifecycleConfig.dryRun,
            },
            performed_at: new Date().toISOString(),
          });
        
        results.identified++;
        results.processedCustomers.push({
          customer_id: customer.stripe_customer_id,
          days_inactive: daysInactive,
          action_taken: 'identified'
        });
        
        // Determine action based on inactivity period
        if (daysInactive >= lifecycleConfig.deletionDelayDays) {
          // Ready for deletion
          if (!lifecycleConfig.dryRun) {
            await performCustomerDeletion(supabase, customer, daysInactive);
          } else {
            console.log(`[LIFECYCLE-SCHEDULER] DRY RUN: Would delete customer ${customer.stripe_customer_id}`);
          }
          results.deleted++;
          results.processedCustomers[results.processedCustomers.length - 1].action_taken = 'deleted';
          
        } else if (daysInactive >= lifecycleConfig.anonymizationDelayDays) {
          // Ready for anonymization
          if (!lifecycleConfig.dryRun) {
            await performCustomerAnonymization(supabase, customer, daysInactive);
          } else {
            console.log(`[LIFECYCLE-SCHEDULER] DRY RUN: Would anonymize customer ${customer.stripe_customer_id}`);
          }
          results.anonymized++;
          results.processedCustomers[results.processedCustomers.length - 1].action_taken = 'anonymized';
        }
        
      } catch (customerError) {
        console.error(`[LIFECYCLE-SCHEDULER] Error processing customer ${customer.stripe_customer_id}:`, customerError);
        results.errors++;
      }
    }
    
    console.log('[LIFECYCLE-SCHEDULER] Process completed:', results);
    
    return {
      success: true,
      results,
      config: lifecycleConfig,
      message: `Processed ${results.identified} customers: ${results.anonymized} anonymized, ${results.deleted} deleted`,
      timestamp: new Date().toISOString(),
    };
    
  } catch (error) {
    console.error('[LIFECYCLE-SCHEDULER] Process failed:', error);
    results.errors++;
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      results,
      timestamp: new Date().toISOString(),
    };
  }
}

// Helper function for customer anonymization
async function performCustomerAnonymization(supabase: any, customer: any, daysInactive: number) {
  console.log(`[LIFECYCLE-SCHEDULER] Anonymizing customer ${customer.stripe_customer_id}`);
  
  // Anonymize the customer data
  const anonymizedEmail = `anonymized-${customer.stripe_customer_id.slice(-8)}@deleted.local`;
  
  const { error: updateError } = await supabase
    .from('stripe_customers')
    .update({
      email: anonymizedEmail,
      name: 'ANONYMIZED',
      phone: null,
      anonymized_at: new Date().toISOString(),
      anonymization_reason: 'Automatic lifecycle management - customer inactive',
    })
    .eq('stripe_customer_id', customer.stripe_customer_id);
  
  if (updateError) {
    throw new Error(`Failed to anonymize customer: ${updateError.message}`);
  }
  
  // Remove payment methods
  const { error: pmError } = await supabase
    .from('payment_methods')
    .delete()
    .eq('stripe_customer_id', customer.stripe_customer_id);
  
  if (pmError) {
    console.warn(`[LIFECYCLE-SCHEDULER] Failed to delete payment methods for ${customer.stripe_customer_id}:`, pmError.message);
  }
  
  // Log the anonymization
  await supabase
    .from('customer_lifecycle_audit')
    .insert({
      customer_id: customer.stripe_customer_id,
      user_id: customer.user_id,
      action: 'anonymized',
      reason: `Customer anonymized after ${daysInactive} days of inactivity`,
      metadata: {
        days_inactive: daysInactive,
        anonymized_email: anonymizedEmail,
        original_email: customer.email,
      },
      performed_at: new Date().toISOString(),
    });
  
  console.log(`[LIFECYCLE-SCHEDULER] Successfully anonymized customer ${customer.stripe_customer_id}`);
}

// Helper function for customer deletion
async function performCustomerDeletion(supabase: any, customer: any, daysInactive: number) {
  console.log(`[LIFECYCLE-SCHEDULER] Deleting customer ${customer.stripe_customer_id}`);
  
  // Archive customer data before deletion
  const archiveData = {
    customer_id: customer.stripe_customer_id,
    user_id: customer.user_id,
    deletion_date: new Date().toISOString(),
    charges_count: 0, // Would need Stripe API for real count
    total_amount_processed: 0, // Would need Stripe API for real amount
    last_charge_date: customer.last_payment_at,
    archived_data: {
      email: customer.email,
      name: customer.name,
      created_at: customer.created_at,
    },
  };
  
  const { error: archiveError } = await supabase
    .from('customer_deletion_archive')
    .insert(archiveData);
  
  if (archiveError) {
    throw new Error(`Failed to archive customer data: ${archiveError.message}`);
  }
  
  // Delete payment methods first
  await supabase
    .from('payment_methods')
    .delete()
    .eq('stripe_customer_id', customer.stripe_customer_id);
  
  // Delete customer record
  const { error: deleteError } = await supabase
    .from('stripe_customers')
    .delete()
    .eq('stripe_customer_id', customer.stripe_customer_id);
  
  if (deleteError) {
    throw new Error(`Failed to delete customer: ${deleteError.message}`);
  }
  
  // Log the deletion
  await supabase
    .from('customer_lifecycle_audit')
    .insert({
      customer_id: customer.stripe_customer_id,
      user_id: customer.user_id,
      action: 'deleted',
      reason: `Customer deleted after ${daysInactive} days of inactivity`,
      metadata: {
        days_inactive: daysInactive,
        archived: true,
      },
      performed_at: new Date().toISOString(),
    });
  
  console.log(`[LIFECYCLE-SCHEDULER] Successfully deleted customer ${customer.stripe_customer_id}`);
}

async function getLifecycleStats() {
  console.log('[LIFECYCLE-SCHEDULER] Fetching lifecycle stats');
  
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    // Get audit statistics from database
    const { data: auditStats, error: auditError } = await supabase
      .from('customer_lifecycle_audit')
      .select('action')
      .order('created_at', { ascending: false })
      .limit(1000);
    
    if (auditError) {
      throw new Error(`Failed to fetch audit stats: ${auditError.message}`);
    }
    
    // Count actions by type
    const actionCounts = (auditStats || []).reduce((counts: any, record: any) => {
      counts[record.action] = (counts[record.action] || 0) + 1;
      return counts;
    }, {});
    
    // Get total count from archive table
    const { count: archivedCount, error: archiveError } = await supabase
      .from('customer_deletion_archive')
      .select('*', { count: 'exact', head: true });
    
    if (archiveError) {
      console.warn('[LIFECYCLE-SCHEDULER] Could not fetch archive count:', archiveError.message);
    }
    
    const stats = {
      total_audit_records: auditStats?.length || 0,
      identified_inactive: actionCounts.identified_inactive || 0,
      anonymized: actionCounts.anonymized || 0,
      deleted: actionCounts.deleted || 0,
      retained: actionCounts.retained || 0,
      archived_customers: archivedCount || 0,
      last_updated: new Date().toISOString(),
    };
    
    console.log('[LIFECYCLE-SCHEDULER] Stats retrieved:', stats);
    
    return {
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[LIFECYCLE-SCHEDULER] Failed to get stats:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'run';
    
    let result;
    
    switch (action) {
      case 'run': {
        // Run the lifecycle process
        const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
        result = await runLifecycleProcess(body);
        break;
      }
      
      case 'stats': {
        // Get lifecycle statistics
        result = await getLifecycleStats();
        break;
      }
      
      case 'health': {
        // Health check endpoint
        result = {
          success: true,
          message: 'Customer lifecycle scheduler is healthy',
          timestamp: new Date().toISOString(),
        };
        break;
      }
      
      default: {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Unknown action: ${action}. Supported actions: run, stats, health`,
          }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    return new Response(
      JSON.stringify(result),
      {
        status: result.success ? 200 : 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error('[LIFECYCLE-SCHEDULER] Unexpected error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unexpected error',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
