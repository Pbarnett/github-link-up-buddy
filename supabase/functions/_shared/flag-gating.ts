/**
 * Flag Gating Helper
 * 
 * Provides consistent LaunchDarkly flag checks for auto-booking pipeline functions.
 * Enforces both `auto_booking_pipeline_enabled` and `auto_booking_emergency_disable` flags.
 */

import { evaluateFlag, createUserContext, type LaunchDarklyResponse } from './launchdarkly.ts';

export interface FlagGatingResult {
  allowed: boolean;
  reason: string;
  flags: {
    pipeline_enabled: LaunchDarklyResponse;
    emergency_disable?: LaunchDarklyResponse;
  };
}

/**
 * Check both auto-booking flags for a user
 */
export async function checkAutoBookingFlags(
  userId: string,
  context: Record<string, any> = {}
): Promise<FlagGatingResult> {
  const userContext = createUserContext(userId, context);

  // Check main pipeline flag
  const pipelineEnabled = await evaluateFlag(
    'auto_booking_pipeline_enabled',
    userContext,
    false
  );

  // Check emergency disable flag
  const emergencyDisable = await evaluateFlag(
    'auto_booking_emergency_disable',
    userContext,
    false
  );

  // Pipeline must be enabled AND emergency disable must be false
  const allowed = pipelineEnabled.value === true && emergencyDisable.value === false;

  let reason = '';
  if (!pipelineEnabled.value) {
    reason = 'auto_booking_pipeline_enabled is false';
  } else if (emergencyDisable.value) {
    reason = 'auto_booking_emergency_disable is true';
  } else {
    reason = 'flags allow auto-booking';
  }

  return {
    allowed,
    reason,
    flags: {
      pipeline_enabled: pipelineEnabled,
      emergency_disable: emergencyDisable
    }
  };
}

/**
 * Check auto-booking flags for system-level operations
 */
export async function checkSystemAutoBookingFlags(
  context: Record<string, any> = {}
): Promise<FlagGatingResult> {
  const systemContext = createUserContext('system', {
    service: 'auto-booking-system',
    environment: Deno.env.get('SUPABASE_ENV') || 'development',
    ...context
  });

  return checkAutoBookingFlags('system', systemContext);
}

/**
 * Create a 503 Service Unavailable response for disabled auto-booking
 */
export function createDisabledResponse(result: FlagGatingResult, corsHeaders: Record<string, string>) {
  return new Response(JSON.stringify({
    success: false,
    message: 'Auto-booking is currently disabled',
    reason: result.reason,
    flags: {
      pipeline_enabled: result.flags.pipeline_enabled.value,
      emergency_disable: result.flags.emergency_disable?.value
    }
  }), {
    status: 503,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
