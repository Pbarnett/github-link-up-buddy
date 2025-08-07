#!/usr/bin/env tsx
import { init } from 'launchdarkly-node-server-sdk';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Test all known feature flags from the application
const KNOWN_FLAGS = [
  'personalization_greeting',
  'personalizedGreetings',
  'profile_ui_revamp',
  'wallet_ui',
  'sample-feature'
];

async function main() {
  try {
    const sdkKey = process.env.LAUNCHDARKLY_SDK_KEY;
    if (!sdkKey) {
      throw new Error("LAUNCHDARKLY_SDK_KEY is missing from environment variables");
    }

    // Check if SDK key is still the placeholder
    if (sdkKey === 'sdk-your-server-side-key-here') {
      throw new Error("LAUNCHDARKLY_SDK_KEY is still set to placeholder value. Please update .env.local with your actual server-side SDK key.");
    }

    console.log('🔍 Testing LaunchDarkly integration...');
    console.log(`SDK Key: ${sdkKey.substring(0, 8)}...${sdkKey.substring(sdkKey.length - 8)}`);

    // Initialize with server-side SDK
    const client = init(sdkKey);

    console.log('⏳ Waiting for LaunchDarkly client initialization...');
    await client.waitForInitialization();
    console.log("✅ Server SDK initialized successfully");

    // Create a test user context
    const userContext = {
      key: 'verification-test-user',
      email: 'test@example.com',
      kind: 'user',
      name: 'Test User'
    };

    // Test each known flag
    console.log('\n🚩 Testing feature flags:');
    for (const flagKey of KNOWN_FLAGS) {
      try {
        const flagValue = await client.variation(flagKey, userContext, false);
        console.log(`  ${flagKey}: ${flagValue}`);
      } catch (error) {
        console.log(`  ${flagKey}: ERROR - ${error.message}`);
      }
    }

    // Test getting all flags for user
    console.log('\n📊 All flag values for test user:');
    try {
      const allFlags = await client.allFlagsState(userContext);
      const flagsObject = allFlags.toJSON();
      if (Object.keys(flagsObject).length > 0) {
        Object.entries(flagsObject).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      } else {
        console.log('  No flags returned (this might be normal if no flags are configured)');
      }
    } catch (error) {
      console.log(`  ERROR getting all flags: ${error.message}`);
    }

    // Test user context
    console.log('\n👤 Test user context:');
    console.log(`  User key: ${userContext.key}`);
    console.log(`  User email: ${userContext.email}`);
    console.log(`  User name: ${userContext.name}`);

    // Clean up
    client.close();
    console.log('\n✅ LaunchDarkly verification completed successfully');
    console.log('\n💡 Next steps:');
    console.log('  1. Verify flag values match your LaunchDarkly dashboard');
    console.log('  2. Test with different user contexts');
    console.log('  3. Set up the client-side SDK in your React app');
    console.log('  4. Test with actual server-side SDK key (not placeholder)');
    
  } catch (error) {
    console.error(`❌ LaunchDarkly verification failed: ${error.message}`);
    console.error('\n💡 Common issues:');
    console.error('  - Check if LAUNCHDARKLY_SDK_KEY is correct in .env.local');
    console.error('  - Verify network connectivity to LaunchDarkly');
    console.error('  - Ensure SDK key has proper permissions');
    console.error('  - Check if LaunchDarkly project is configured correctly');
    console.error('  - Make sure you\'re using a server-side SDK key, not a client-side ID');
    console.error('\n🔧 Debug information:');
    console.error(`  SDK Key: ${process.env.LAUNCHDARKLY_SDK_KEY ? process.env.LAUNCHDARKLY_SDK_KEY.substring(0, 8) + '...' : 'undefined'}`);
    console.error(`  Error type: ${error.constructor.name}`);
    console.error(`  Error stack: ${error.stack}`);
    process.exit(1);
  }
}

// Handle cleanup on process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Verification interrupted');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Verification terminated');
  process.exit(0);
});

main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
