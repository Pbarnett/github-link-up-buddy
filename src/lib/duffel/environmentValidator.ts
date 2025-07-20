/**
 * Duffel Environment Validation
 * 
 * Validates environment variables and configuration per DUFFEL_IMPLEMENTATION_GUIDE.md
 * - Required environment variables check
 * - Token format validation
 * - Environment consistency validation
 * - Feature flag validation
 */

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  config: DuffelEnvironmentConfig
}

interface DuffelEnvironmentConfig {
  mode: 'LIVE' | 'TEST'
  apiToken: string
  webhookSecret?: string
  liveEnabled: boolean
  hasLiveToken: boolean
  hasTestToken: boolean
}

/**
 * Validate Duffel environment configuration
 */
export function validateDuffelEnvironment(): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Check for required environment variables
  const requiredVars = {
    DUFFEL_API_TOKEN_TEST: process.env.DUFFEL_API_TOKEN_TEST,
    DUFFEL_WEBHOOK_SECRET: process.env.DUFFEL_WEBHOOK_SECRET,
  }

  const optionalVars = {
    DUFFEL_API_TOKEN_LIVE: process.env.DUFFEL_API_TOKEN_LIVE,
    DUFFEL_LIVE_ENABLED: process.env.DUFFEL_LIVE_ENABLED,
  }

  // Check required variables
  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value) {
      errors.push(`Missing required environment variable: ${key}`)
    }
  })

  // Validate token formats
  const testToken = requiredVars.DUFFEL_API_TOKEN_TEST
  const liveToken = optionalVars.DUFFEL_API_TOKEN_LIVE

  if (testToken && !isValidDuffelToken(testToken)) {
    errors.push('DUFFEL_API_TOKEN_TEST has invalid format (should start with duffel_test_)')
  }

  if (liveToken && !isValidDuffelToken(liveToken)) {
    errors.push('DUFFEL_API_TOKEN_LIVE has invalid format (should start with duffel_live_)')
  }

  // Check live mode configuration
  const liveEnabled = optionalVars.DUFFEL_LIVE_ENABLED === 'true'
  
  if (liveEnabled && !liveToken) {
    errors.push('DUFFEL_LIVE_ENABLED is true but DUFFEL_API_TOKEN_LIVE is not set')
  }

  if (!liveEnabled && liveToken) {
    warnings.push('DUFFEL_API_TOKEN_LIVE is set but DUFFEL_LIVE_ENABLED is not true')
  }

  // Determine current mode and token
  const mode: 'LIVE' | 'TEST' = liveEnabled ? 'LIVE' : 'TEST'
  const apiToken = liveEnabled ? liveToken || '' : testToken || ''

  // Check webhook secret format
  const webhookSecret = requiredVars.DUFFEL_WEBHOOK_SECRET
  if (webhookSecret && webhookSecret.length < 32) {
    warnings.push('DUFFEL_WEBHOOK_SECRET seems too short (should be at least 32 characters)')
  }

  const config: DuffelEnvironmentConfig = {
    mode,
    apiToken,
    webhookSecret,
    liveEnabled,
    hasLiveToken: !!liveToken,
    hasTestToken: !!testToken,
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config
  }
}

/**
 * Validate Duffel API token format
 */
function isValidDuffelToken(token: string): boolean {
  // Duffel tokens should start with duffel_test_ or duffel_live_
  return token.startsWith('duffel_test_') || token.startsWith('duffel_live_')
}

/**
 * Get validated Duffel configuration or throw error
 */
export function getValidatedDuffelConfig(): DuffelEnvironmentConfig {
  const validation = validateDuffelEnvironment()
  
  if (!validation.isValid) {
    throw new Error(
      `Duffel environment validation failed:\n${validation.errors.join('\n')}`
    )
  }

  if (validation.warnings.length > 0) {
    console.warn('Duffel environment warnings:', validation.warnings)
  }

  return validation.config
}

/**
 * Environment validation for Edge Functions (Deno)
 */
export function validateDuffelEnvironmentDeno(): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Check for required environment variables in Deno
  const requiredVars = {
    DUFFEL_API_TOKEN_TEST: Deno.env.get('DUFFEL_API_TOKEN_TEST'),
    DUFFEL_WEBHOOK_SECRET: Deno.env.get('DUFFEL_WEBHOOK_SECRET'),
  }

  const optionalVars = {
    DUFFEL_API_TOKEN_LIVE: Deno.env.get('DUFFEL_API_TOKEN_LIVE'),
    DUFFEL_LIVE_ENABLED: Deno.env.get('DUFFEL_LIVE_ENABLED'),
  }

  // Check required variables
  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value) {
      errors.push(`Missing required environment variable: ${key}`)
    }
  })

  // Validate token formats
  const testToken = requiredVars.DUFFEL_API_TOKEN_TEST
  const liveToken = optionalVars.DUFFEL_API_TOKEN_LIVE

  if (testToken && !isValidDuffelToken(testToken)) {
    errors.push('DUFFEL_API_TOKEN_TEST has invalid format')
  }

  if (liveToken && !isValidDuffelToken(liveToken)) {
    errors.push('DUFFEL_API_TOKEN_LIVE has invalid format')
  }

  // Check live mode configuration
  const liveEnabled = optionalVars.DUFFEL_LIVE_ENABLED === 'true'
  
  if (liveEnabled && !liveToken) {
    errors.push('Live mode enabled but no live token provided')
  }

  const mode: 'LIVE' | 'TEST' = liveEnabled ? 'LIVE' : 'TEST'
  const apiToken = liveEnabled ? liveToken || '' : testToken || ''

  const config: DuffelEnvironmentConfig = {
    mode,
    apiToken,
    webhookSecret: requiredVars.DUFFEL_WEBHOOK_SECRET,
    liveEnabled,
    hasLiveToken: !!liveToken,
    hasTestToken: !!testToken,
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config
  }
}

/**
 * Startup validation - logs and exits if invalid
 */
export function validateDuffelOnStartup(): void {
  const validation = validateDuffelEnvironment()
  
  console.log('🔍 Validating Duffel environment configuration...')
  
  if (validation.warnings.length > 0) {
    validation.warnings.forEach(warning => {
      console.warn(`⚠️  ${warning}`)
    })
  }
  
  if (!validation.isValid) {
    console.error('❌ Duffel environment validation failed:')
    validation.errors.forEach(error => {
      console.error(`   - ${error}`)
    })
    console.error('\n📚 Please check DUFFEL_IMPLEMENTATION_GUIDE.md for setup instructions')
    process.exit(1)
  }
  
  console.log(`✅ Duffel environment valid (${validation.config.mode} mode)`)
}

export default {
  validateDuffelEnvironment,
  getValidatedDuffelConfig,
  validateDuffelEnvironmentDeno,
  validateDuffelOnStartup
}
