import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Sentry integration (would require Sentry DSN setup)
// import * as Sentry from "https://esm.sh/@sentry/deno@7.0.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const sentryDsn = Deno.env.get("SENTRY_DSN");

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

// Error severity levels
enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

interface ErrorLogEntry {
  error_type: string;
  error_message: string;
  severity: ErrorSeverity;
  context: any;
  user_id?: string;
  function_name?: string;
  stack_trace?: string;
  environment: string;
}

// Initialize Sentry if DSN is provided
// if (sentryDsn) {
//   Sentry.init({
//     dsn: sentryDsn,
//     tracesSampleRate: 1.0,
//   });
// }

async function logError(errorEntry: ErrorLogEntry) {
  try {
    // Log to database
    const { error: dbError } = await supabase
      .from('error_logs')
      .insert({
        ...errorEntry,
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.error('Failed to log error to database:', dbError);
    }

    // Log to Sentry (if configured)
    // if (sentryDsn) {
    //   Sentry.captureException(new Error(errorEntry.error_message), {
    //     level: errorEntry.severity as any,
    //     contexts: {
    //       profile_system: errorEntry.context
    //     },
    //     user: errorEntry.user_id ? { id: errorEntry.user_id } : undefined
    //   });
    // }

    // Log to AI activity for audit trail
    await supabase.from('ai_activity').insert({
      agent_id: 'warp-agent-error-logger',
      action: 'Error logged',
      result: `${errorEntry.error_type}: ${errorEntry.error_message}`,
      task_context: {
        severity: errorEntry.severity,
        function: errorEntry.function_name,
        environment: errorEntry.environment
      },
      user_id: errorEntry.user_id,
      created_at: new Date().toISOString()
    });

  } catch (loggingError) {
    // Fallback logging
    console.error('Critical: Failed to log error:', loggingError);
    console.error('Original error:', errorEntry);
  }
}

async function handleProfileCompletionError(errorData: any) {
  const errorEntry: ErrorLogEntry = {
    error_type: 'profile_completion_trigger_error',
    error_message: errorData.message || 'Unknown profile completion error',
    severity: ErrorSeverity.MEDIUM,
    context: {
      trigger_name: 'trigger_update_profile_completeness',
      user_id: errorData.user_id,
      profile_id: errorData.profile_id,
      operation: errorData.operation,
      timestamp: new Date().toISOString()
    },
    user_id: errorData.user_id,
    function_name: 'update_profile_completeness',
    stack_trace: errorData.stack_trace,
    environment: Deno.env.get("ENVIRONMENT") || 'development'
  };

  await logError(errorEntry);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, error_data } = await req.json();

    switch (action) {
      case 'log_profile_completion_error':
        await handleProfileCompletionError(error_data);
        break;
      
      case 'log_payment_error':
        await logError({
          error_type: 'payment_processing_error',
          error_message: error_data.message,
          severity: ErrorSeverity.HIGH,
          context: error_data,
          user_id: error_data.user_id,
          function_name: error_data.function_name,
          environment: Deno.env.get("ENVIRONMENT") || 'development'
        });
        break;
      
      case 'log_notification_error':
        await logError({
          error_type: 'notification_delivery_error',
          error_message: error_data.message,
          severity: ErrorSeverity.LOW,
          context: error_data,
          user_id: error_data.user_id,
          function_name: error_data.function_name,
          environment: Deno.env.get("ENVIRONMENT") || 'development'
        });
        break;
      
      case 'log_general_error':
        await logError({
          error_type: error_data.type || 'general_error',
          error_message: error_data.message,
          severity: error_data.severity || ErrorSeverity.MEDIUM,
          context: error_data.context || {},
          user_id: error_data.user_id,
          function_name: error_data.function_name,
          environment: Deno.env.get("ENVIRONMENT") || 'development'
        });
        break;
      
      case 'health':
        return new Response(
          JSON.stringify({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            sentry_configured: !!sentryDsn,
            environment: Deno.env.get("ENVIRONMENT") || 'development'
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      
      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Error logged successfully' }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error logging service error:', error);
    
    // Try to log this meta-error
    try {
      await logError({
        error_type: 'error_logging_service_failure',
        error_message: error.message,
        severity: ErrorSeverity.CRITICAL,
        context: { 
          original_request: req.url,
          service: 'error-logging'
        },
        function_name: 'error-logging-service',
        environment: Deno.env.get("ENVIRONMENT") || 'development'
      });
    } catch (metaError) {
      console.error('Critical: Meta-error logging failed:', metaError);
    }

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
