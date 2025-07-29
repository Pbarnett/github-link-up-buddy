#!/usr/bin/env tsx

/**
 * Test LaunchDarkly integration with different user contexts
 * Verifies flag targeting and user segmentation
 */

import '../src/lib/launchdarkly/server-client';

const testUserContexts = [
  {
    name: 'Regular User',
    context: {
      kind: 'user',
      key: 'user-123',
      email: 'john@example.com',
      name: 'John Doe',
      custom: {
        plan: 'free',
        signupDate: '2024-01-15'
      }
    }
  },
  {
    name: 'Premium User', 
    context: {
      kind: 'user',
      key: 'user-456',
      email: 'jane@premium.com',
      name: 'Jane Smith',
      custom: {
        plan: 'premium',
        signupDate: '2023-12-01'
      }
    }
  },
  {
    name: 'Anonymous User',
    context: {
      kind: 'user',
      key: 'anonymous-789',
      anonymous: true
    }
  }
];

const flagsToTest = [
  'personalization_greeting',
  'personalizedGreetings', 
  'profile_ui_revamp',
  'wallet_ui',
  'sample-feature'
];

async function testLaunchDarklyContexts() {
  console.log('🧪 Testing LaunchDarkly with different user contexts...\n');
  
  try {
    const client = getLaunchDarklyServerClient();
    await client.waitForInitialization();
    console.log('✅ LaunchDarkly client initialized\n');
    
    for (const { name, context } of testUserContexts) {
      console.log(`👤 Testing context: ${name}`);
      console.log(`   User: ${context.email || 'anonymous'} (${context.key})`);
      
      const flagResults: Record<string, unknown> = {};
      
      // Test each flag for this user context
      for (const flagKey of flagsToTest) {
        try {
          const flagValue = await client.variation(flagKey, context, false);
          flagResults[flagKey] = flagValue;
        } catch {
          console.warn(`   ⚠️  Error evaluating flag ${flagKey}:`, error);
          flagResults[flagKey] = 'ERROR';
        }
      }
      
      // Display results in a clean format
      console.log('   Flags:');
      Object.entries(flagResults).forEach(([flag, value]) => {
        const status = value === 'ERROR' ? '❌' : value ? '🟢' : '🔴';
        console.log(`     ${flag}: ${status} ${value}`);
      });
      
      console.log(); // Empty line for readability
    }
    
    console.log('✅ User context testing completed successfully');
    
  } catch {
    console.error('❌ Error testing LaunchDarkly contexts:', error);
    process.exit(1);
  } finally {
    const client = getLaunchDarklyServerClient();
    await client.close();
  }
}

testLaunchDarklyContexts();
