#!/usr/bin/env node

const path = require('path');

/**
 * Setup Script for External Services Integration Tests
 * 
 * This script helps configure the environment for running external services
 * integration tests for Stripe, LaunchDarkly, and Supabase.
 */

import readline from 'readline';
// Utility functions
// Removed unused info function
// Removed unused warning function
// Removed unused error function
// Removed unused success function

const fs = require('fs');
// Utility functions
// Removed unused log function
  console.log(`[${timestamp}] ${(level || "INFO").toUpperCase()}: ${message}`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ENV_TEST_FILE = path.join(__'..', '.env.test');

console.log('🔧 External Services Integration Test Setup\n');
console.log('This script will help you configure environment variables for integration testing.');
console.log('⚠️  IMPORTANT: Only use test/development keys - never production keys!\n');

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupEnvironment() {
  const config = {};

  console.log('📋 Please provide the following configuration:\n');

  // Supabase Configuration
  console.log('1. SUPABASE CONFIGURATION');
  console.log('   For local development, use: http://localhost:54321');
  console.log('   For remote instance, use your Supabase project URL');
  
  config.SUPABASE_URL = await question('   Supabase URL (or press Enter for localhost:54321): ') || 'http://localhost:54321';
  config.SUPABASE_ANON_KEY = await question('   Supabase Anonymous Key: ');

  // Stripe Configuration
  console.log('\n2. STRIPE CONFIGURATION');
  console.log('   ⚠️  Use ONLY test keys (starting with sk_test_)');
  console.log('   Get test keys from: https://dashboard.stripe.com/test/apikeys');
  
  const stripeKey = await question('   Stripe Secret Key (sk_test_...): ');
  
  if (stripeKey && stripeKey.startsWith('sk_live_')) {
    console.log('   ❌ ERROR: Production key detected! Aborting setup for safety.');
    process.exit(1);
  }
  
  if (stripeKey && stripeKey.startsWith('sk_test_')) {
    config.STRIPE_SECRET_KEY = stripeKey;
    console.log('   ✅ Test key format verified');
  } else if (stripeKey) {
    console.log('   ⚠️  Warning: Key format not recognized, but proceeding...');
    config.STRIPE_SECRET_KEY = stripeKey;
  }

  // LaunchDarkly Configuration
  console.log('\n3. LAUNCHDARKLY CONFIGURATION');
  console.log('   Use SDK keys from your LaunchDarkly project settings');
  console.log('   Keys typically start with "sdk-"');
  
  const ldKey = await question('   LaunchDarkly SDK Key: ');
  if (ldKey) {
    config.LAUNCHDARKLY_SDK_KEY = ldKey;
    if (ldKey.startsWith('sdk-')) {
      console.log('   ✅ SDK key format appears valid');
    } else {
      console.log('   ⚠️  Warning: Key format might be incorrect');
    }
  }

  // Generate .env.test file
  console.log('\n📝 Generating .env.test file...');
  
  const envContent = `# External Services Integration Test Configuration
# Generated on ${new Date().toISOString()}
# ⚠️ IMPORTANT: These should be test/development keys only!

# Supabase Configuration
SUPABASE_URL=${config.SUPABASE_URL || ''}
SUPABASE_ANON_KEY=${config.SUPABASE_ANON_KEY || ''}

# Stripe Configuration (TEST KEYS ONLY!)
STRIPE_SECRET_KEY=${config.STRIPE_SECRET_KEY || ''}

# LaunchDarkly Configuration  
LAUNCHDARKLY_SDK_KEY=${config.LAUNCHDARKLY_SDK_KEY || ''}

# Additional test configuration
NODE_ENV=test
`;

  try {
    fs.writeFileSync(ENV_TEST_FILE, envContent);
    console.log(`✅ Configuration saved to ${ENV_TEST_FILE}`);
  } catch (error) {
    console.error('❌ Error writing configuration file:', error.message);
    process.exit(1);
  }

  // Provide next steps
  console.log('\n🎉 Setup Complete!\n');
  console.log('Next steps:');
  console.log('1. Run basic connectivity test:');
  console.log('   npx playwright test tests/integration/external-services-simple.test.ts --config=playwright.integration.config.ts');
  console.log('\n2. Run full integration test suite:');
  console.log('   npm run test:integration:external');
  console.log('\n3. If tests fail, check the troubleshooting guide:');
  console.log('   tests/integration/README.md');

  // Show summary
  console.log('\n📊 Configuration Summary:');
  console.log(`- Supabase: ${config.SUPABASE_URL ? '✅ Configured' : '❌ Missing'}`);
  console.log(`- Stripe: ${config.STRIPE_SECRET_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`- LaunchDarkly: ${config.LAUNCHDARKLY_SDK_KEY ? '✅ Configured' : '❌ Missing'}`);

  const configuredCount = Object.values(config).filter(Boolean).length - 1; // -1 because SUPABASE_URL has default
  const totalCount = 3;
  
  console.log(`\nIntegration test coverage: ${configuredCount}/${totalCount} services configured`);
  
  if (configuredCount === 0) {
    console.log('\n⚠️  No services configured. Tests will run in connectivity-only mode.');
  } else if (configuredCount < totalCount) {
    console.log('\n⚠️  Some services not configured. Related tests will be skipped.');
  } else {
    console.log('\n🎯 All services configured! Full integration tests are ready to run.');
  }

  rl.close();
}

// Main execution
setupEnvironment().catch((_error) => {
  console.error('❌ Setup failed:', error.message);
  rl.close();
  process.exit(1);
});
