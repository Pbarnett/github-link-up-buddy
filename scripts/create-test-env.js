#!/usr/bin/env node

/**
 * Create Test Environment Configuration
 * 
 * This script creates a minimal .env.test file for demonstration purposes.
 * It shows the structure needed for external services integration tests.
 */

const fs = require('fs');
const path = require('path');

// Utility functions
// Removed unused log function

const ENV_TEST_FILE = path.join(__dirname, '..', '.env.test');

console.log('📝 Creating demonstration .env.test file...\n');

const envContent = `# External Services Integration Test Configuration
# Generated on ${new Date().toISOString()}
# ⚠️ IMPORTANT: These are PLACEHOLDER values for demonstration only!
# 
# To run actual integration tests, replace these with real test credentials:
# 1. Get Supabase URL and anon key from your Supabase project
# 2. Get Stripe test keys from https://dashboard.stripe.com/test/apikeys  
# 3. Get LaunchDarkly SDK key from your LaunchDarkly project settings

# Supabase Configuration (for local development)
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=placeholder_supabase_anon_key_here

# Stripe Configuration (TEST KEYS ONLY!)
# Replace with actual test key starting with sk_test_
STRIPE_SECRET_KEY=sk_test_placeholder_stripe_key_here

# LaunchDarkly Configuration  
# Replace with actual SDK key starting with sdk-
LAUNCHDARKLY_SDK_KEY=sdk-placeholder-launchdarkly-key-here

# Additional test configuration
NODE_ENV=test
DEBUG=false
`;

try {
  fs.writeFileSync(ENV_TEST_FILE, envContent);
  console.log(`✅ Demonstration configuration created at ${ENV_TEST_FILE}`);
  console.log('\n📋 What this enables:');
  console.log('- Tests will run but skip actual API calls due to placeholder values');
  console.log('- Environment variable structure validation will pass');
  console.log('- Safety checks will detect placeholder values and skip tests gracefully');
  console.log('\n🔧 To enable real integration tests:');
  console.log('1. Edit .env.test with actual test credentials');
  console.log('2. Run: npm run test:integration:external');
  console.log('3. Check results with: npx playwright show-report playwright-report/integration');
} catch (error) {
  console.error('❌ Error creating test configuration:', error.message);
  process.exit(1);
}
