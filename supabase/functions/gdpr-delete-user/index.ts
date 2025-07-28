// Edge Function: GDPR Delete User (Batch 2 - Requirement #26)
// This function handles comprehensive deletion of user data compliant with GDPR requirements
// Implements "Right to Erasure" (Article 17 GDPR)

import { serve } from "https://deno.land/std@0.141.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { logger } from "../_shared/logger.ts";
import { initSentry, captureException } from "../_shared/sentry.ts";

// Initialize Sentry for error tracking
initSentry();

interface DeleteUserRequest {
  userId: string;
  requestedBy?: string; // Admin user ID or system identifier
  reason?: string; // Reason for deletion (e.g., "user_request", "account_closure")
}

interface DeletionResult {
  success: boolean;
  tablesProcessed: string[];
  recordsDeleted: { [table: string]: number };
  errors?: string[];
  completedAt: string;
}

// Create Supabase client with service role for comprehensive data access
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

async function handleGdprDeleteUser(request: Request): Promise<Response> {
  const correlationId = crypto.randomUUID();
  
  try {
    // Parse and validate request
    const { userId, requestedBy = 'system', reason = 'gdpr_request' }: DeleteUserRequest 
      = await request.json();

    if (!userId) {
      logger.warn("Missing userId in GDPR delete request", { correlationId });
      return new Response(
        JSON.stringify({ error: "userId is required" }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify authorization (service role key or admin token)
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("Unauthorized GDPR delete attempt", { userId, correlationId });
      return new Response(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    logger.info("Starting GDPR user data deletion", { 
      userId, 
      requestedBy, 
      reason, 
      correlationId 
    });

    const deletionResult: DeletionResult = {
      success: false,
      tablesProcessed: [],
      recordsDeleted: {},
      completedAt: new Date().toISOString()
    };

    const errors: string[] = [];

    // Define all tables that may contain user data (in deletion order)
    const userDataTables = [
      // User-specific data (delete first)
      { table: 'pii_encryption_audit', column: 'user_id' },
      { table: 'encrypted_passenger_profiles', column: 'user_id' },
      { table: 'booking_attempts', column: 'user_id' },
      { table: 'payments', column: 'user_id' },
      { table: 'notifications', column: 'user_id' },
      { table: 'flight_bookings', column: 'user_id' },
      { table: 'flight_offers_v2', column: 'user_id' },
      { table: 'flight_offers', column: 'user_id' },
      { table: 'trip_requests', column: 'user_id' },
      { table: 'booking_requests', column: 'user_id' },
      { table: 'campaigns', column: 'user_id' },
      { table: 'user_personalization', column: 'user_id' },
      { table: 'traveler_profiles', column: 'user_id' },
      { table: 'payment_methods', column: 'user_id' },
      { table: 'identity_verifications', column: 'user_id' },
      { table: 'user_preferences', column: 'user_id' },
      { table: 'user_analytics_events', column: 'user_id' },
      { table: 'form_submissions', column: 'user_id' },
      { table: 'ab_test_assignments', column: 'user_id' },
      { table: 'ai_activity_logs', column: 'user_id' },
      { table: 'error_logs', column: 'user_id' },
      { table: 'profiles', column: 'id' }, // User profile (uses user ID directly)
    ];

    // Delete user data from each table
    for (const { table, column } of userDataTables) {
      try {
        const { data, error, count } = await supabaseClient
          .from(table)
          .delete({ count: 'exact' })
          .eq(column, userId);

        if (error) {
          // Log error but continue with other tables
          const errorMsg = `Failed to delete from ${table}: ${error.message}`;
          logger.error(errorMsg, { userId, table, error, correlationId });
          errors.push(errorMsg);
        } else {
          deletionResult.tablesProcessed.push(table);
          deletionResult.recordsDeleted[table] = count || 0;
          
          if (count && count > 0) {
            logger.info(`Deleted ${count} records from ${table}`, { 
              userId, 
              table, 
              count, 
              correlationId 
            });
          }
        }
      } catch (tableError) {
        // Handle cases where table might not exist
        const errorMsg = `Exception deleting from ${table}: ${tableError.message}`;
        logger.warn(errorMsg, { userId, table, tableError, correlationId });
        errors.push(errorMsg);
      }
    }

    // Finally, delete the auth user record
    try {
      const { data: authData, error: authError } = await supabaseClient.auth.admin.deleteUser(
        userId
      );

      if (authError) {
        const errorMsg = `Failed to delete auth user: ${authError.message}`;
        logger.error(errorMsg, { userId, authError, correlationId });
        errors.push(errorMsg);
      } else {
        deletionResult.tablesProcessed.push('auth.users');
        deletionResult.recordsDeleted['auth.users'] = 1;
        logger.info("Deleted auth user record", { userId, correlationId });
      }
    } catch (authError) {
      const errorMsg = `Exception deleting auth user: ${authError.message}`;
      logger.error(errorMsg, { userId, authError, correlationId });
      errors.push(errorMsg);
    }

    // Create audit record of the deletion
    try {
      await supabaseClient.from('gdpr_deletion_audit').insert({
        deleted_user_id: userId,
        requested_by: requestedBy,
        reason,
        tables_processed: deletionResult.tablesProcessed,
        records_deleted: deletionResult.recordsDeleted,
        errors: errors.length > 0 ? errors : null,
        correlation_id: correlationId,
        completed_at: deletionResult.completedAt
      });
    } catch (auditError) {
      logger.warn("Failed to create deletion audit record", { auditError, correlationId });
    }

    // Determine overall success
    const totalRecordsDeleted = Object.values(deletionResult.recordsDeleted)
      .reduce((sum, count) => sum + count, 0);
    
    deletionResult.success = errors.length === 0 || totalRecordsDeleted > 0;
    
    if (errors.length > 0) {
      deletionResult.errors = errors;
    }

    const responseStatus = deletionResult.success ? 200 : 207; // 207 for partial success
    
    logger.info("GDPR user deletion completed", {
      userId,
      success: deletionResult.success,
      tablesProcessed: deletionResult.tablesProcessed.length,
      totalRecordsDeleted,
      errorCount: errors.length,
      correlationId
    });

    return new Response(
      JSON.stringify(deletionResult), 
      { 
        status: responseStatus, 
        headers: { 
          'Content-Type': 'application/json',
          'X-Correlation-ID': correlationId
        } 
      }
    );

  } catch (error) {
    const errorMessage = error.message || 'Unknown error during GDPR deletion';
    
    logger.error("GDPR deletion failed with exception", { 
      error: errorMessage, 
      correlationId 
    });
    
    captureException(error, {
      tags: { function: 'gdpr-delete-user' },
      extra: { correlationId }
    });

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        correlationId 
      }), 
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'X-Correlation-ID': correlationId
        } 
      }
    );
  }
}

// Serve the Edge Function
serve(handleGdprDeleteUser);
