#!/usr/bin/env tsx
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function main() {
  try {
    const apiToken = process.env.LAUNCHDARKLY_API_TOKEN
    if (!apiToken) {
      throw new Error("LAUNCHDARKLY_API_TOKEN is missing from environment variables");
    }

    // Check if API token is still the placeholder
    if (apiToken === 'api-your-api-token-here') {
      throw new Error("LAUNCHDARKLY_API_TOKEN is still set to placeholder value. Please update .env.local with your actual API token.");
    }

    console.log('🔍 Testing LaunchDarkly API integration...');
    console.log(`API Token: ${apiToken.substring(0, 8)}...${apiToken.substring(apiToken.length - 8)}`);

    // Test API connectivity - Get projects
    const projectsResponse = await fetch('https://app.launchdarkly.com/api/v2/projects', {
      headers: {
        'Authorization': apiToken,
        'Content-Type': 'application/json'
      }
    });

    if (!projectsResponse.ok) {
      throw new Error(`API request failed: ${projectsResponse.status} ${projectsResponse.statusText}`);
    }

    const projects = await projectsResponse.json();
    console.log('✅ API connection successful');
    console.log(`📊 Found ${projects.items.length} project(s)`);

    // Test getting feature flags for the first project
    if (projects.items.length > 0) {
      const projectKey = projects.items[0].key
      console.log(`\n🚩 Testing feature flags for project: ${projectKey}`);

      const flagsResponse = await fetch(`https://app.launchdarkly.com/api/v2/flags/${projectKey}`, {
        headers: {
          'Authorization': apiToken,
          'Content-Type': 'application/json'
        }
      });

      if (flagsResponse.ok) {
        const flags = await flagsResponse.json();
        console.log(`✅ Retrieved ${flags.items.length} feature flag(s)`);
        
        // Display first few flags
        flags.items.slice(0, 5).forEach((flag: { key: string; name: string }) => {
          console.log(`  - ${flag.key}: ${flag.name}`);
        });
      } else {
        console.log(`⚠️ Could not retrieve flags: ${flagsResponse.status} ${flagsResponse.statusText}`);
      }
    }

    console.log('\n✅ LaunchDarkly API verification completed successfully');
    console.log('\n💡 Next steps:');
    console.log('  1. Use API for programmatic flag management');
    console.log('  2. Integrate with CI/CD pipelines');
    console.log('  3. Set up automated flag lifecycle management');
    
  } catch (error) {
    console.error(`❌ LaunchDarkly API verification failed: ${error.message}`);
    console.error('\n💡 Common issues:');
    console.error('  - Check if LAUNCHDARKLY_API_TOKEN is correct in .env.local');
    console.error('  - Verify API token has proper permissions');
    console.error('  - Check network connectivity to LaunchDarkly API');
    console.error('  - Ensure API token is not expired');
    console.error('\n🔧 Debug information:');
    console.error(`  API Token: ${process.env.LAUNCHDARKLY_API_TOKEN ? process.env.LAUNCHDARKLY_API_TOKEN.substring(0, 8); + '...' : 'undefined'}`);
    console.error(`  Error type: ${error.constructor.name}`);
    process.exit(1);
  }
}

main().catch((_error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
