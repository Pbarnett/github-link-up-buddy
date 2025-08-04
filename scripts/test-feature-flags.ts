/**
 * Test LaunchDarkly feature flags for auto-booking
 */

import { config } from 'dotenv';

// Load environment variables
config();

async function testFeatureFlags() {
  console.log('🎛️  Testing LaunchDarkly Feature Flags...\n');

  // Check environment variables
  const clientId = process.env.VITE_LD_CLIENT_ID;
  const serverKey = process.env.LAUNCHDARKLY_SERVER_SDK_KEY || process.env.LD_SDK_KEY;

  console.log('📋 Environment Variables:');
  console.log(`  VITE_LD_CLIENT_ID: ${clientId ? '✅ Set' : '❌ Missing'}`);
  console.log(`  LAUNCHDARKLY_SERVER_SDK_KEY: ${serverKey ? '✅ Set' : '❌ Missing'}\n`);

  if (!clientId || !serverKey) {
    console.log('❌ LaunchDarkly credentials not found in environment variables');
    console.log('\n🔧 To fix this:');
    console.log('1. Go to https://app.launchdarkly.com/');
    console.log('2. Navigate to Account Settings > Projects');
    console.log('3. Copy your client-side ID and server-side SDK key');
    console.log('4. Update your .env file with:');
    console.log('   VITE_LD_CLIENT_ID=your-client-id');
    console.log('   LAUNCHDARKLY_SERVER_SDK_KEY=your-server-key');
    console.log('\n📚 Then create these feature flags:');
    console.log('   - auto_booking_pipeline_enabled (boolean, default: false)');
    console.log('   - auto_booking_emergency_disable (boolean, default: false)');
    return;
  }

  console.log('🧪 Testing LaunchDarkly connection...\n');

  try {
    // Test server-side SDK (for Edge Functions)
    console.log('  ├── Testing server-side SDK...');
    
    // Simple REST API test to verify server key works
    const response = await fetch(`https://app.launchdarkly.com/api/v2/flags/default`, {
      headers: {
        'Authorization': serverKey,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      console.log('  ├── ✅ Server SDK key is valid');
      
      // Try to get the specific flags we need
      const flags = await response.json();
      const requiredFlags = ['auto_booking_pipeline_enabled', 'auto_booking_emergency_disable'];
      const existingFlags = flags.items?.map((f: any) => f.key) || [];
      
      console.log('  ├── Checking required feature flags...');
      for (const flagKey of requiredFlags) {
        if (existingFlags.includes(flagKey)) {
          console.log(`  ├── ✅ Flag '${flagKey}' exists`);
        } else {
          console.log(`  ├── ⚠️  Flag '${flagKey}' not found - needs to be created`);
        }
      }
    } else if (response.status === 401) {
      console.log('  ├── ❌ Server SDK key is invalid or expired');
    } else {
      console.log(`  ├── ⚠️  Server SDK test failed: ${response.status} ${response.statusText}`);
    }

    // Test client-side ID format (just validation)
    console.log('  ├── Testing client-side ID format...');
    if (clientId.length > 10 && !clientId.includes('sdk-')) {
      console.log('  ├── ✅ Client-side ID format looks correct');
    } else {
      console.log('  ├── ⚠️  Client-side ID format may be incorrect (should not contain "sdk-")');
    }

    console.log('\n📋 Setup Status:');
    
    if (response.ok) {
      console.log('✅ LaunchDarkly connection working');
      console.log('✅ Server SDK key valid');
      console.log('✅ Client ID configured');
      
      console.log('\n🚀 Next Steps:');
      console.log('1. Create the required feature flags in LaunchDarkly dashboard');
      console.log('2. Set up targeting rules for internal team testing');
      console.log('3. Test the auto-booking UI component');
      console.log('\n📖 See docs/LAUNCHDARKLY_AUTO_BOOKING_SETUP.md for detailed instructions');
    } else {
      console.log('⚠️  LaunchDarkly connection issues detected');
      console.log('Please verify your SDK keys and create the required flags');
    }

  } catch (error) {
    console.error('\n❌ LaunchDarkly test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your LaunchDarkly SDK keys are correct');
    console.log('2. Ensure your LaunchDarkly project is active');
    console.log('3. Verify network connectivity');
    console.log('4. Check if your account has API access permissions');
  }
}

// Run the test
testFeatureFlags().catch(error => {
  console.error('Test script failed:', error);
  process.exit(1);
});
