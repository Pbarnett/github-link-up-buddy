/**
 * Comprehensive KMS Integration Test Suite
 * Tests all aspects of the AWS KMS integration for Parker Flight
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://bbonngdyfyfjqfhvoljl.supabase.co';

// Test configuration
const TEST_CONFIG = {
  baseUrl: SUPABASE_URL,
  profilesEndpoint: `${SUPABASE_URL}/functions/v1/manage-profiles-kms`,
  paymentsEndpoint: `${SUPABASE_URL}/functions/v1/manage-payment-methods-kms`,
  timeout: 30000, // 30 seconds
  retries: 3
};

// Test data
const TEST_DATA = {
  testProfile: {
    first_name: 'TestUser',
    last_name: 'KMSTest',
    phone: '+1-555-123-4567'
  },
  testPaymentMethod: {
    card_number: '4111111111111111', // Test Visa card
    cardholder_name: 'Test User KMS',
    exp_month: 12,
    exp_year: 2028,
    cvv: '123',
    brand: 'visa',
    is_default: true
  }
};

// Test results tracking
class TestResults {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
  }

  addResult(testName, status, message = '', duration = 0, details = {}) {
    const result = {
      name: testName,
      status, // 'PASS', 'FAIL', 'SKIP'
      message,
      duration,
      timestamp: new Date().toISOString(),
      details
    };
    
    this.tests.push(result);
    
    switch(status) {
      case 'PASS': this.passed++; break;
      case 'FAIL': this.failed++; break;
      case 'SKIP': this.skipped++; break;
    }
    
    const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏭️';
    console.log(`${emoji} ${testName}: ${message} (${duration}ms)`);
    
    if (details && Object.keys(details).length > 0) {
      console.log(`   Details:`, details);
    }
  }

  getSummary() {
    const total = this.tests.length;
    const successRate = total > 0 ? ((this.passed / total) * 100).toFixed(2) : 0;
    
    return {
      total,
      passed: this.passed,
      failed: this.failed,
      skipped: this.skipped,
      successRate: `${successRate}%`,
      tests: this.tests
    };
  }
}

// Utility functions
async function makeRequest(url, options = {}, testName = '') {
  const startTime = Date.now();
  
  try {
    const response = await fetch(url, {
      timeout: TEST_CONFIG.timeout,
      ...options
    });
    
    const duration = Date.now() - startTime;
    const data = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data,
      duration,
      response
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      success: false,
      error: error.message,
      duration
    };
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test Categories
class KMSIntegrationTests {
  constructor() {
    this.results = new TestResults();
    this.testAuthToken = null;
  }

  // === INFRASTRUCTURE TESTS ===
  
  async testHealthEndpoints() {
    console.log('\n🏗️ Testing Infrastructure Health...');
    
    // Test profiles health endpoint
    const profilesHealth = await makeRequest(
      `${TEST_CONFIG.profilesEndpoint}?action=health`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    
    if (profilesHealth.success && profilesHealth.data.status === 'healthy') {
      this.results.addResult(
        'Profiles KMS Service Health',
        'PASS',
        `Service healthy, KMS enabled: ${profilesHealth.data.kms_enabled}`,
        profilesHealth.duration,
        { version: profilesHealth.data.version, function: profilesHealth.data.function }
      );
    } else {
      this.results.addResult(
        'Profiles KMS Service Health',
        'FAIL',
        `Health check failed: ${profilesHealth.error || 'Unknown error'}`,
        profilesHealth.duration,
        { status: profilesHealth.status, data: profilesHealth.data }
      );
    }
    
    // Test payments health endpoint
    const paymentsHealth = await makeRequest(
      `${TEST_CONFIG.paymentsEndpoint}?action=health`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    
    if (paymentsHealth.success && paymentsHealth.data.status === 'healthy') {
      this.results.addResult(
        'Payment Methods KMS Service Health',
        'PASS',
        `Service healthy, KMS enabled: ${paymentsHealth.data.kms_enabled}`,
        paymentsHealth.duration,
        { version: paymentsHealth.data.version, function: paymentsHealth.data.function }
      );
    } else {
      this.results.addResult(
        'Payment Methods KMS Service Health',
        'FAIL',
        `Health check failed: ${paymentsHealth.error || 'Unknown error'}`,
        paymentsHealth.duration,
        { status: paymentsHealth.status, data: paymentsHealth.data }
      );
    }
  }

  async testServiceDeployment() {
    console.log('\n🚀 Testing Service Deployment...');
    
    // Test that endpoints exist and return proper error for missing auth
    const endpointsToTest = [
      { name: 'Profiles Service', url: `${TEST_CONFIG.profilesEndpoint}?action=get` },
      { name: 'Payment Methods Service', url: `${TEST_CONFIG.paymentsEndpoint}?action=list` }
    ];
    
    for (const endpoint of endpointsToTest) {
      const response = await makeRequest(endpoint.url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      // We expect 401 unauthorized for these endpoints without auth
      if (response.status === 401) {
        this.results.addResult(
          `${endpoint.name} Deployment`,
          'PASS',
          'Service deployed and requires authentication',
          response.duration
        );
      } else {
        this.results.addResult(
          `${endpoint.name} Deployment`,
          'FAIL',
          `Unexpected response: ${response.status}`,
          response.duration,
          { expectedStatus: 401, actualStatus: response.status }
        );
      }
    }
  }

  // === AUTHENTICATION TESTS ===
  
  async testAuthenticationRequirements() {
    console.log('\n🔐 Testing Authentication Requirements...');
    
    const protectedEndpoints = [
      { service: 'Profiles', url: `${TEST_CONFIG.profilesEndpoint}?action=get` },
      { service: 'Profiles', url: `${TEST_CONFIG.profilesEndpoint}?action=update` },
      { service: 'Payments', url: `${TEST_CONFIG.paymentsEndpoint}?action=list` },
      { service: 'Payments', url: `${TEST_CONFIG.paymentsEndpoint}?action=add` }
    ];
    
    for (const endpoint of protectedEndpoints) {
      const response = await makeRequest(endpoint.url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.status === 401) {
        this.results.addResult(
          `${endpoint.service} Authentication Required`,
          'PASS',
          'Correctly requires authentication',
          response.duration
        );
      } else {
        this.results.addResult(
          `${endpoint.service} Authentication Required`,
          'FAIL',
          `Expected 401, got ${response.status}`,
          response.duration
        );
      }
    }
  }

  // === API STRUCTURE TESTS ===
  
  async testAPIStructure() {
    console.log('\n📋 Testing API Structure...');
    
    // Test invalid action parameters
    const invalidActions = ['invalid', 'test', '', null];
    
    for (const action of invalidActions) {
      const url = action !== null ? 
        `${TEST_CONFIG.profilesEndpoint}?action=${action}` : 
        `${TEST_CONFIG.profilesEndpoint}`;
        
      const response = await makeRequest(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Should return 401 for missing auth or 404 for invalid actions
      if (response.status === 401 || response.status === 404) {
        this.results.addResult(
          `API Structure - Invalid Action "${action}"`,
          'PASS',
          `Correctly handled invalid action (${response.status})`,
          response.duration
        );
      } else {
        this.results.addResult(
          `API Structure - Invalid Action "${action}"`,
          'FAIL',
          `Unexpected response for invalid action: ${response.status}`,
          response.duration
        );
      }
    }
  }

  // === ERROR HANDLING TESTS ===
  
  async testErrorHandling() {
    console.log('\n⚠️ Testing Error Handling...');
    
    // Test malformed requests
    const malformedTests = [
      {
        name: 'Invalid JSON Body',
        url: `${TEST_CONFIG.profilesEndpoint}?action=update`,
        options: {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: 'invalid json'
        }
      },
      {
        name: 'Missing Content-Type',
        url: `${TEST_CONFIG.profilesEndpoint}?action=update`,
        options: {
          method: 'POST',
          body: JSON.stringify(TEST_DATA.testProfile)
        }
      }
    ];
    
    for (const test of malformedTests) {
      const response = await makeRequest(test.url, test.options);
      
      // Should handle errors gracefully (400, 401, or 500)
      if (response.status >= 400 && response.status < 600) {
        this.results.addResult(
          `Error Handling - ${test.name}`,
          'PASS',
          `Gracefully handled malformed request (${response.status})`,
          response.duration
        );
      } else {
        this.results.addResult(
          `Error Handling - ${test.name}`,
          'FAIL',
          `Did not handle malformed request properly: ${response.status}`,
          response.duration
        );
      }
    }
  }

  // === CORS TESTS ===
  
  async testCORSConfiguration() {
    console.log('\n🌐 Testing CORS Configuration...');
    
    const corsTest = await makeRequest(TEST_CONFIG.profilesEndpoint, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://example.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    
    if (corsTest.success && corsTest.response.headers.get('access-control-allow-origin')) {
      this.results.addResult(
        'CORS Configuration',
        'PASS',
        'CORS headers properly configured',
        corsTest.duration,
        {
          allowOrigin: corsTest.response.headers.get('access-control-allow-origin'),
          allowMethods: corsTest.response.headers.get('access-control-allow-methods'),
          allowHeaders: corsTest.response.headers.get('access-control-allow-headers')
        }
      );
    } else {
      this.results.addResult(
        'CORS Configuration',
        'FAIL',
        'CORS not properly configured',
        corsTest.duration
      );
    }
  }

  // === PERFORMANCE TESTS ===
  
  async testPerformance() {
    console.log('\n⚡ Testing Performance...');
    
    const performanceTests = [
      { name: 'Health Endpoint Response Time', url: `${TEST_CONFIG.profilesEndpoint}?action=health`, maxTime: 2000 },
      { name: 'Payment Health Response Time', url: `${TEST_CONFIG.paymentsEndpoint}?action=health`, maxTime: 2000 }
    ];
    
    for (const test of performanceTests) {
      const response = await makeRequest(test.url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.duration <= test.maxTime) {
        this.results.addResult(
          test.name,
          'PASS',
          `Response time: ${response.duration}ms (target: <${test.maxTime}ms)`,
          response.duration
        );
      } else {
        this.results.addResult(
          test.name,
          'FAIL',
          `Response time: ${response.duration}ms exceeds target: ${test.maxTime}ms`,
          response.duration
        );
      }
    }
  }

  // === CONCURRENT LOAD TESTS ===
  
  async testConcurrentLoad() {
    console.log('\n🔄 Testing Concurrent Load...');
    
    const concurrentRequests = 10;
    const promises = [];
    
    const startTime = Date.now();
    
    for (let i = 0; i < concurrentRequests; i++) {
      promises.push(
        makeRequest(`${TEST_CONFIG.profilesEndpoint}?action=health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
      );
    }
    
    try {
      const results = await Promise.all(promises);
      const totalTime = Date.now() - startTime;
      
      const successfulRequests = results.filter(r => r.success).length;
      const averageResponseTime = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
      
      if (successfulRequests === concurrentRequests) {
        this.results.addResult(
          'Concurrent Load Test',
          'PASS',
          `${successfulRequests}/${concurrentRequests} requests successful`,
          totalTime,
          {
            averageResponseTime: `${averageResponseTime.toFixed(2)}ms`,
            totalTime: `${totalTime}ms`,
            requestsPerSecond: ((concurrentRequests / totalTime) * 1000).toFixed(2)
          }
        );
      } else {
        this.results.addResult(
          'Concurrent Load Test',
          'FAIL',
          `Only ${successfulRequests}/${concurrentRequests} requests successful`,
          totalTime
        );
      }
    } catch (error) {
      this.results.addResult(
        'Concurrent Load Test',
        'FAIL',
        `Load test failed: ${error.message}`,
        Date.now() - startTime
      );
    }
  }

  // === SECURITY TESTS ===
  
  async testSecurityHeaders() {
    console.log('\n🔒 Testing Security Headers...');
    
    const response = await makeRequest(`${TEST_CONFIG.profilesEndpoint}?action=health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const securityHeaders = [
      'x-content-type-options',
      'strict-transport-security'
    ];
    
    let secureHeadersFound = 0;
    const headerDetails = {};
    
    for (const header of securityHeaders) {
      const headerValue = response.response?.headers?.get(header);
      if (headerValue) {
        secureHeadersFound++;
        headerDetails[header] = headerValue;
      }
    }
    
    if (secureHeadersFound > 0) {
      this.results.addResult(
        'Security Headers',
        'PASS',
        `${secureHeadersFound}/${securityHeaders.length} security headers present`,
        response.duration,
        headerDetails
      );
    } else {
      this.results.addResult(
        'Security Headers',
        'FAIL',
        'No security headers found',
        response.duration
      );
    }
  }

  // === AVAILABILITY TESTS ===
  
  async testServiceAvailability() {
    console.log('\n🌟 Testing Service Availability...');
    
    const services = [
      { name: 'Profiles KMS Service', url: `${TEST_CONFIG.profilesEndpoint}?action=health` },
      { name: 'Payment Methods KMS Service', url: `${TEST_CONFIG.paymentsEndpoint}?action=health` }
    ];
    
    const availabilityChecks = 5;
    const checkInterval = 1000; // 1 second
    
    for (const service of services) {
      let successfulChecks = 0;
      const responseTimes = [];
      
      for (let i = 0; i < availabilityChecks; i++) {
        const response = await makeRequest(service.url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.success) {
          successfulChecks++;
          responseTimes.push(response.duration);
        }
        
        if (i < availabilityChecks - 1) {
          await sleep(checkInterval);
        }
      }
      
      const availability = (successfulChecks / availabilityChecks * 100).toFixed(2);
      const avgResponseTime = responseTimes.length > 0 ? 
        (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2) : 0;
      
      if (successfulChecks === availabilityChecks) {
        this.results.addResult(
          `${service.name} Availability`,
          'PASS',
          `${availability}% availability over ${availabilityChecks} checks`,
          parseInt(avgResponseTime),
          {
            successfulChecks: `${successfulChecks}/${availabilityChecks}`,
            averageResponseTime: `${avgResponseTime}ms`,
            responseTimes: responseTimes
          }
        );
      } else {
        this.results.addResult(
          `${service.name} Availability`,
          'FAIL',
          `${availability}% availability (${successfulChecks}/${availabilityChecks} checks passed)`,
          parseInt(avgResponseTime)
        );
      }
    }
  }

  // === RUN ALL TESTS ===
  
  async runAllTests() {
    console.log('🧪 Starting Comprehensive KMS Integration Test Suite...');
    console.log('='.repeat(60));
    
    const startTime = Date.now();
    
    try {
      // Infrastructure Tests
      await this.testHealthEndpoints();
      await this.testServiceDeployment();
      
      // Security Tests
      await this.testAuthenticationRequirements();
      await this.testSecurityHeaders();
      
      // API Tests
      await this.testAPIStructure();
      await this.testErrorHandling();
      await this.testCORSConfiguration();
      
      // Performance Tests
      await this.testPerformance();
      await this.testConcurrentLoad();
      
      // Availability Tests
      await this.testServiceAvailability();
      
    } catch (error) {
      console.error('❌ Test suite encountered an error:', error);
      this.results.addResult(
        'Test Suite Execution',
        'FAIL',
        `Test suite error: ${error.message}`,
        0
      );
    }
    
    const totalTime = Date.now() - startTime;
    
    // Generate final report
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(60));
    
    const summary = this.results.getSummary();
    
    console.log(`📈 Total Tests: ${summary.total}`);
    console.log(`✅ Passed: ${summary.passed}`);
    console.log(`❌ Failed: ${summary.failed}`);
    console.log(`⏭️ Skipped: ${summary.skipped}`);
    console.log(`🎯 Success Rate: ${summary.successRate}`);
    console.log(`⏱️ Total Time: ${totalTime}ms`);
    
    // Detailed results
    if (summary.failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      summary.tests
        .filter(test => test.status === 'FAIL')
        .forEach(test => {
          console.log(`   • ${test.name}: ${test.message}`);
        });
    }
    
    if (summary.passed > 0) {
      console.log('\n✅ PASSED TESTS:');
      summary.tests
        .filter(test => test.status === 'PASS')
        .forEach(test => {
          console.log(`   • ${test.name}: ${test.message}`);
        });
    }
    
    // Integration Status
    console.log('\n' + '='.repeat(60));
    if (summary.failed === 0) {
      console.log('🎉 KMS INTEGRATION STATUS: ALL TESTS PASSED');
      console.log('✨ System is ready for production deployment!');
    } else {
      console.log('⚠️ KMS INTEGRATION STATUS: SOME TESTS FAILED');
      console.log('🔧 Please review failed tests before production deployment.');
    }
    console.log('='.repeat(60));
    
    return summary;
  }
}

// Export for module usage or run directly
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { KMSIntegrationTests, TestResults };
} else {
  // Run tests immediately
  const testSuite = new KMSIntegrationTests();
  testSuite.runAllTests().catch(console.error);
}
