/// <reference lib="deno.ns" />
/**
 * Test Customer Lifecycle Health Check Function
 * 
 * This function provides a simple health check and basic testing
 * for the customer lifecycle management system.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

async function testAuditTableAccess() {
  console.log('[TEST-LIFECYCLE] Testing database connectivity and audit table access');
  
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing required environment variables');
    }
    
    // Test database connection by checking if audit tables exist
    const response = await fetch(`${supabaseUrl}/rest/v1/customer_lifecycle_audit?select=count`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceRoleKey,
        'Authorization': `Bearer ${supabaseServiceRoleKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'count=exact'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('[TEST-LIFECYCLE] Audit table access successful', data);
      return { 
        success: true, 
        message: 'Database connectivity and audit table access verified',
        auditRecordsCount: response.headers.get('content-range') || '0'
      };
    } else {
      const error = await response.text();
      console.error('[TEST-LIFECYCLE] Database access failed:', error);
      return { 
        success: false, 
        error: `Database access failed: ${error}` 
      };
    }
  } catch (error) {
    console.error('[TEST-LIFECYCLE] Test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

async function insertTestAuditRecord() {
  console.log('[TEST-LIFECYCLE] Inserting test audit record');
  
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing required environment variables');
    }
    
    const testRecord = {
      customer_id: 'test_customer_' + Date.now(),
      user_id: null,
      action: 'identified_inactive',
      reason: 'Test lifecycle audit record insertion',
      metadata: {
        test: true,
        timestamp: new Date().toISOString(),
        days_inactive: 400
      },
      performed_at: new Date().toISOString()
    };
    
    const response = await fetch(`${supabaseUrl}/rest/v1/customer_lifecycle_audit`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceRoleKey,
        'Authorization': `Bearer ${supabaseServiceRoleKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testRecord)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('[TEST-LIFECYCLE] Test audit record inserted successfully', data);
      return { 
        success: true, 
        message: 'Test audit record inserted successfully',
        record: data
      };
    } else {
      const error = await response.text();
      console.error('[TEST-LIFECYCLE] Failed to insert test record:', error);
      return { 
        success: false, 
        error: `Failed to insert test record: ${error}` 
      };
    }
  } catch (error) {
    console.error('[TEST-LIFECYCLE] Insert test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

async function getAuditStatistics() {
  console.log('[TEST-LIFECYCLE] Getting audit statistics');
  
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing required environment variables');
    }
    
    // Get counts by action type
    const response = await fetch(`${supabaseUrl}/rest/v1/customer_lifecycle_audit?select=action&action=identified_inactive`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceRoleKey,
        'Authorization': `Bearer ${supabaseServiceRoleKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'count=exact'
      }
    });
    
    if (response.ok) {
      const inactiveCount = response.headers.get('content-range') || '0';
      
      return { 
        success: true, 
        statistics: {
          identified_inactive: parseInt(inactiveCount.split('/')[1] || '0'),
          total_audit_records: parseInt(inactiveCount.split('/')[1] || '0')
        }
      };
    } else {
      const error = await response.text();
      console.error('[TEST-LIFECYCLE] Failed to get statistics:', error);
      return { 
        success: false, 
        error: `Failed to get statistics: ${error}` 
      };
    }
  } catch (error) {
    console.error('[TEST-LIFECYCLE] Statistics test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
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
    const action = url.searchParams.get('action') || 'health';
    
    let result;
    
    switch (action) {
      case 'health': {
        result = await testAuditTableAccess();
        break;
      }
      
      case 'test-insert': {
        result = await insertTestAuditRecord();
        break;
      }
      
      case 'stats': {
        result = await getAuditStatistics();
        break;
      }
      
      case 'full-test': {
        const healthCheck = await testAuditTableAccess();
        if (healthCheck.success) {
          const insertTest = await insertTestAuditRecord();
          if (insertTest.success) {
            const statsTest = await getAuditStatistics();
            result = {
              success: true,
              message: 'All lifecycle tests completed successfully',
              results: {
                health: healthCheck,
                insert: insertTest,
                stats: statsTest
              }
            };
          } else {
            result = insertTest;
          }
        } else {
          result = healthCheck;
        }
        break;
      }
      
      default: {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Unknown action: ${action}. Supported actions: health, test-insert, stats, full-test`,
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
      JSON.stringify({
        ...result,
        timestamp: new Date().toISOString(),
      }),
      {
        status: result.success ? 200 : 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error('[TEST-LIFECYCLE] Unexpected error:', error);
    
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
