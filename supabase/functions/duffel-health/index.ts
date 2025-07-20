/**
 * Duffel Health Check Endpoint
 * 
 * Monitors Duffel API connectivity and integration status:
 * - API connection test
 * - Rate limit status
 * - Environment configuration validation
 * - Integration version info
 * - Performance metrics
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Duffel } from 'https://esm.sh/@duffel/api@3.38.0'
import { corsHeaders } from '../_shared/cors.ts'

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  checks: {
    api_connectivity: CheckResult
    environment_config: CheckResult
    rate_limits: CheckResult
    database_connection: CheckResult
    feature_flags: CheckResult
  }
  metadata: {
    mode: 'LIVE' | 'TEST'
    api_version: string
    integration_version: string
    response_time_ms: number
  }
}

interface CheckResult {
  status: 'pass' | 'warn' | 'fail'
  message: string
  details?: Record<string, any>
}

console.log('[DuffelHealth] Function initialized')

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const startTime = performance.now()
  
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    const healthResult: HealthCheckResult = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        api_connectivity: await checkApiConnectivity(),
        environment_config: checkEnvironmentConfig(),
        rate_limits: await checkRateLimits(),
        database_connection: await checkDatabaseConnection(supabaseClient),
        feature_flags: await checkFeatureFlags(supabaseClient)
      },
      metadata: {
        mode: Deno.env.get('DUFFEL_LIVE_ENABLED') === 'true' ? 'LIVE' : 'TEST',
        api_version: 'v2',
        integration_version: '2.0.0-guided',
        response_time_ms: 0
      }
    }

    // Calculate overall status
    const checkResults = Object.values(healthResult.checks)
    const hasFailures = checkResults.some(check => check.status === 'fail')
    const hasWarnings = checkResults.some(check => check.status === 'warn')

    if (hasFailures) {
      healthResult.status = 'unhealthy'
    } else if (hasWarnings) {
      healthResult.status = 'degraded'
    }

    // Calculate response time
    healthResult.metadata.response_time_ms = Math.round(performance.now() - startTime)

    // Return appropriate HTTP status
    const httpStatus = healthResult.status === 'healthy' ? 200 : 
                      healthResult.status === 'degraded' ? 200 : 503

    console.log(`[DuffelHealth] Status: ${healthResult.status}, Response time: ${healthResult.metadata.response_time_ms}ms`)

    return new Response(JSON.stringify(healthResult, null, 2), {
      status: httpStatus,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('[DuffelHealth] Health check failed:', error)

    const errorResult: HealthCheckResult = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: {
        api_connectivity: { status: 'fail', message: 'Health check failed' },
        environment_config: { status: 'fail', message: error.message },
        rate_limits: { status: 'fail', message: 'Unable to check' },
        database_connection: { status: 'fail', message: 'Unable to check' },
        feature_flags: { status: 'fail', message: 'Unable to check' }
      },
      metadata: {
        mode: 'TEST',
        api_version: 'unknown',
        integration_version: '2.0.0-guided',
        response_time_ms: Math.round(performance.now() - startTime)
      }
    }

    return new Response(JSON.stringify(errorResult, null, 2), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

/**
 * Test Duffel API connectivity
 */
async function checkApiConnectivity(): Promise<CheckResult> {
  try {
    const isLive = Deno.env.get('DUFFEL_LIVE_ENABLED') === 'true'
    const apiToken = isLive 
      ? Deno.env.get('DUFFEL_API_TOKEN_LIVE')
      : Deno.env.get('DUFFEL_API_TOKEN_TEST')

    if (!apiToken) {
      return {
        status: 'fail',
        message: `Missing ${isLive ? 'live' : 'test'} API token`,
        details: { mode: isLive ? 'LIVE' : 'TEST' }
      }
    }

    const duffel = new Duffel({ token: apiToken })
    
    // Test with a simple airports call (lightweight)
    const startTime = performance.now()
    const airports = await duffel.airports.list({ limit: 1 })
    const responseTime = Math.round(performance.now() - startTime)

    if (airports.data.length === 0) {
      return {
        status: 'warn',
        message: 'API connected but no data returned',
        details: { 
          response_time_ms: responseTime,
          mode: isLive ? 'LIVE' : 'TEST'
        }
      }
    }

    return {
      status: 'pass',
      message: 'API connectivity successful',
      details: { 
        response_time_ms: responseTime,
        mode: isLive ? 'LIVE' : 'TEST',
        sample_airport: airports.data[0]?.name
      }
    }

  } catch (error: any) {
    return {
      status: 'fail',
      message: `API connectivity failed: ${error.message}`,
      details: { 
        error_type: error.constructor.name,
        status_code: error.status
      }
    }
  }
}

/**
 * Check environment configuration
 */
function checkEnvironmentConfig(): CheckResult {
  const requiredVars = [
    'DUFFEL_API_TOKEN_TEST',
    'DUFFEL_WEBHOOK_SECRET',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ]

  const missingVars = requiredVars.filter(varName => !Deno.env.get(varName))
  
  if (missingVars.length > 0) {
    return {
      status: 'fail',
      message: 'Missing required environment variables',
      details: { missing: missingVars }
    }
  }

  const warnings = []
  
  // Check for live mode configuration
  if (Deno.env.get('DUFFEL_LIVE_ENABLED') === 'true' && !Deno.env.get('DUFFEL_API_TOKEN_LIVE')) {
    warnings.push('Live mode enabled but DUFFEL_API_TOKEN_LIVE not set')
  }

  return {
    status: warnings.length > 0 ? 'warn' : 'pass',
    message: warnings.length > 0 ? 'Configuration warnings detected' : 'Environment properly configured',
    details: { 
      warnings: warnings.length > 0 ? warnings : undefined,
      live_mode: Deno.env.get('DUFFEL_LIVE_ENABLED') === 'true'
    }
  }
}

/**
 * Check rate limit status (simplified)
 */
async function checkRateLimits(): Promise<CheckResult> {
  // In a real implementation, you'd track rate limit usage
  // For now, we'll just return the configured limits
  
  const rateLimits = {
    search: 120,  // requests per minute
    orders: 60,   // requests per minute
    other: 300    // requests per minute
  }

  return {
    status: 'pass',
    message: 'Rate limits configured',
    details: { 
      limits: rateLimits,
      note: 'Actual usage tracking not implemented in health check'
    }
  }
}

/**
 * Check database connectivity
 */
async function checkDatabaseConnection(supabaseClient: any): Promise<CheckResult> {
  try {
    // Test basic database connectivity
    const { data, error } = await supabaseClient
      .from('feature_flags')
      .select('name')
      .limit(1)

    if (error) {
      return {
        status: 'fail',
        message: 'Database connection failed',
        details: { error: error.message }
      }
    }

    // Check if Duffel-related tables exist
    const duffelTables = ['duffel_webhook_events', 'bookings']
    const tableChecks = await Promise.allSettled(
      duffelTables.map(async (table) => {
        const { error } = await supabaseClient
          .from(table)
          .select('*')
          .limit(0)
        return { table, exists: !error }
      })
    )

    const missingTables = tableChecks
      .map((result, index) => {
        if (result.status === 'fulfilled' && !result.value.exists) {
          return duffelTables[index]
        }
        return null
      })
      .filter(Boolean)

    if (missingTables.length > 0) {
      return {
        status: 'warn',
        message: 'Some Duffel tables missing',
        details: { missing_tables: missingTables }
      }
    }

    return {
      status: 'pass',
      message: 'Database connectivity successful',
      details: { tables_checked: duffelTables.length }
    }

  } catch (error: any) {
    return {
      status: 'fail',
      message: 'Database check failed',
      details: { error: error.message }
    }
  }
}

/**
 * Check Duffel-related feature flags
 */
async function checkFeatureFlags(supabaseClient: any): Promise<CheckResult> {
  try {
    const duffelFlags = [
      'auto_booking_enhanced',
      'duffel_payments_enabled',
      'duffel_webhooks_enabled'
    ]

    const { data: flags, error } = await supabaseClient
      .from('feature_flags')
      .select('name, enabled')
      .in('name', duffelFlags)

    if (error) {
      return {
        status: 'warn',
        message: 'Could not check feature flags',
        details: { error: error.message }
      }
    }

    const flagStatus = flags.reduce((acc: any, flag: any) => {
      acc[flag.name] = flag.enabled
      return acc
    }, {})

    const enabledFlags = flags.filter((flag: any) => flag.enabled).length
    const totalFlags = flags.length

    return {
      status: 'pass',
      message: `Feature flags checked (${enabledFlags}/${totalFlags} enabled)`,
      details: flagStatus
    }

  } catch (error: any) {
    return {
      status: 'warn',
      message: 'Feature flag check failed',
      details: { error: error.message }
    }
  }
}
