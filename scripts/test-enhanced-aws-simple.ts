#!/usr/bin/env tsx
/**
 * Simple Enhanced AWS Services Integration Test
 * 
 * A minimal test script to validate the enhanced AWS services work
 */

console.log('🚀 Starting Simple Enhanced AWS Integration Test...');

// Test basic ES module imports
async function testBasicImport() {
  try {
    console.log('📦 Testing basic ES module import...');
    
    // Try importing the client factory
    const { EnhancedAWSClientFactory } = await import('../src/lib/aws-sdk-enhanced/client-factory');
    
    console.log('✅ Successfully imported EnhancedAWSClientFactory');
    
    // Test creating a basic config
    const config = {
      region: 'us-east-1',
      environment: 'development' as const,
      enableMetrics: false,
      enableLogging: true
    };
    
    console.log('✅ Basic configuration created');
    
    // Try creating a health check
    const healthResult = await EnhancedAWSClientFactory.healthCheck(config);
    console.log('✅ Health check completed:', healthResult);
    
    return true;
  } catch (error) {
    console.error('❌ Basic import test failed:', error);
    return false;
  }
}

async function main() {
  console.log('\n=== Simple Enhanced AWS Integration Test ===\n');
  
  try {
    const success = await testBasicImport();
    
    if (success) {
      console.log('\n🎉 Simple test completed successfully!');
    } else {
      console.log('\n💥 Simple test failed!');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n💥 Test suite crashed:', error);
    process.exit(1);
  }
}

// Run the test
main().catch(console.error);
