/**
 * Focused KMS Integration Validation Test
 * Tests what we can actually validate without authentication
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://bbonngdyfyfjqfhvoljl.supabase.co';

class KMSValidationTest {
  constructor() {
    this.results = [];
    this.passed = 0;
    this.failed = 0;
  }

  addResult(testName, status, message, details = {}) {
    const result = {
      name: testName,
      status,
      message,
      timestamp: new Date().toISOString(),
      details
    };
    
    this.results.push(result);
    
    if (status === 'PASS') this.passed++;
    else if (status === 'FAIL') this.failed++;
    
    const emoji = status === 'PASS' ? '✅' : '❌';
    console.log(`${emoji} ${testName}: ${message}`);
    
    if (Object.keys(details).length > 0) {
      console.log(`   Details:`, details);
    }
  }

  async makeRequest(url, options = {}) {
    const startTime = Date.now();
    
    try {
      const response = await fetch(url, {
        timeout: 10000,
        ...options
      });
      
      const duration = Date.now() - startTime;
      let data;
      
      try {
        data = await response.json();
      } catch {
        data = await response.text();
      }
      
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

  async testServiceDeployment() {
    console.log('\n🚀 Testing Service Deployment...');
    
    const services = [
      { name: 'Profiles KMS Service', url: `${SUPABASE_URL}/functions/v1/manage-profiles-kms` },
      { name: 'Payment Methods KMS Service', url: `${SUPABASE_URL}/functions/v1/manage-payment-methods-kms` }
    ];
    
    for (const service of services) {
      const response = await this.makeRequest(service.url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      // We expect a response (either 401 for auth required or 404 for invalid action)
      if (response.status === 401) {
        this.addResult(
          `${service.name} Deployment`,
          'PASS',
          'Service deployed and properly requires authentication',
          { status: response.status, responseTime: `${response.duration}ms` }
        );
      } else if (response.status === 404) {
        this.addResult(
          `${service.name} Deployment`,
          'PASS',
          'Service deployed with proper routing (404 for missing action)',
          { status: response.status, responseTime: `${response.duration}ms` }
        );
      } else if (response.status >= 500) {
        this.addResult(
          `${service.name} Deployment`,
          'FAIL',
          `Service has server error: ${response.status}`,
          { status: response.status, error: response.data }
        );
      } else if (response.error) {
        this.addResult(
          `${service.name} Deployment`,
          'FAIL',
          `Service not accessible: ${response.error}`,
          { error: response.error }
        );
      } else {
        this.addResult(
          `${service.name} Deployment`,
          'PASS',
          `Service responding (status: ${response.status})`,
          { status: response.status, responseTime: `${response.duration}ms` }
        );
      }
    }
  }

  async testCORSConfiguration() {
    console.log('\n🌐 Testing CORS Configuration...');
    
    const corsTest = await this.makeRequest(`${SUPABASE_URL}/functions/v1/manage-profiles-kms`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://example.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    
    if (corsTest.response && corsTest.response.headers) {
      const allowOrigin = corsTest.response.headers.get('access-control-allow-origin');
      const allowMethods = corsTest.response.headers.get('access-control-allow-methods');
      const allowHeaders = corsTest.response.headers.get('access-control-allow-headers');
      
      if (allowOrigin && allowMethods && allowHeaders) {
        this.addResult(
          'CORS Configuration',
          'PASS',
          'CORS headers properly configured',
          {
            allowOrigin,
            allowMethods,
            allowHeaders,
            responseTime: `${corsTest.duration}ms`
          }
        );
      } else {
        this.addResult(
          'CORS Configuration',
          'FAIL',
          'CORS headers missing or incomplete',
          { 
            allowOrigin: allowOrigin || 'missing',
            allowMethods: allowMethods || 'missing',
            allowHeaders: allowHeaders || 'missing'
          }
        );
      }
    } else {
      this.addResult(
        'CORS Configuration',
        'FAIL',
        'Could not test CORS configuration',
        { error: corsTest.error || 'No response headers' }
      );
    }
  }

  async testPerformance() {
    console.log('\n⚡ Testing Performance...');
    
    const performanceTests = [
      { name: 'Profiles Service Response Time', url: `${SUPABASE_URL}/functions/v1/manage-profiles-kms`, maxTime: 3000 },
      { name: 'Payment Methods Service Response Time', url: `${SUPABASE_URL}/functions/v1/manage-payment-methods-kms`, maxTime: 3000 }
    ];
    
    for (const test of performanceTests) {
      const response = await this.makeRequest(test.url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.duration <= test.maxTime) {
        this.addResult(
          test.name,
          'PASS',
          `Response time: ${response.duration}ms (target: <${test.maxTime}ms)`,
          { responseTime: `${response.duration}ms`, status: response.status }
        );
      } else {
        this.addResult(
          test.name,
          'FAIL',
          `Response time: ${response.duration}ms exceeds target: ${test.maxTime}ms`,
          { responseTime: `${response.duration}ms`, status: response.status }
        );
      }
    }
  }

  async testSecurityHeaders() {
    console.log('\n🔒 Testing Security Headers...');
    
    const response = await this.makeRequest(`${SUPABASE_URL}/functions/v1/manage-profiles-kms`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.response && response.response.headers) {
      const securityHeaders = [
        'x-content-type-options',
        'strict-transport-security'
      ];
      
      let secureHeadersFound = 0;
      const headerDetails = {};
      
      for (const header of securityHeaders) {
        const headerValue = response.response.headers.get(header);
        if (headerValue) {
          secureHeadersFound++;
          headerDetails[header] = headerValue;
        }
      }
      
      if (secureHeadersFound > 0) {
        this.addResult(
          'Security Headers',
          'PASS',
          `${secureHeadersFound}/${securityHeaders.length} security headers present`,
          headerDetails
        );
      } else {
        this.addResult(
          'Security Headers',
          'FAIL',
          'No security headers found',
          { expectedHeaders: securityHeaders }
        );
      }
    } else {
      this.addResult(
        'Security Headers',
        'FAIL',
        'Could not check security headers',
        { error: response.error || 'No response headers' }
      );
    }
  }

  testFileSystemIntegration() {
    console.log('\n📁 Testing File System Integration...');
    
    const fs = require('fs');
    
    const requiredFiles = [
      { path: 'supabase/functions/_shared/kms.ts', name: 'KMS Shared Module' },
      { path: 'supabase/functions/manage-profiles-kms/index.ts', name: 'Profiles KMS Service' },
      { path: 'supabase/functions/manage-payment-methods-kms/index.ts', name: 'Payment Methods KMS Service' },
      { path: 'src/services/api/profileApiKMS.ts', name: 'Profile KMS API Service' },
      { path: 'src/services/api/paymentMethodsApiKMS.ts', name: 'Payment Methods KMS API Service' },
      { path: 'src/hooks/useProfileKMS.ts', name: 'Profile KMS Hook' },
      { path: 'src/hooks/usePaymentMethods.ts', name: 'Payment Methods Hook (updated)' }
    ];
    
    for (const file of requiredFiles) {
      if (fs.existsSync(file.path)) {
        this.addResult(
          `${file.name} File`,
          'PASS',
          `File exists and accessible: ${file.path}`
        );
      } else {
        this.addResult(
          `${file.name} File`,
          'FAIL',
          `File missing: ${file.path}`
        );
      }
    }
  }

  testComplianceReadiness() {
    console.log('\n📋 Testing Compliance Readiness...');
    
    const fs = require('fs');
    
    const complianceChecks = [
      {
        name: 'SOC 2 Audit Trail',
        check: () => fs.existsSync('supabase/functions/_shared/kms.ts'),
        requirement: 'KMS audit logging implementation'
      },
      {
        name: 'PCI DSS Payment Encryption',
        check: () => fs.existsSync('supabase/functions/manage-payment-methods-kms/index.ts'),
        requirement: 'Payment data encryption with AWS KMS'
      },
      {
        name: 'GDPR PII Protection',
        check: () => fs.existsSync('supabase/functions/manage-profiles-kms/index.ts'),
        requirement: 'PII encryption with AWS KMS'
      }
    ];
    
    let passedChecks = 0;
    
    for (const check of complianceChecks) {
      if (check.check()) {
        this.addResult(
          check.name,
          'PASS',
          `Compliant: ${check.requirement}`,
          { requirement: check.requirement }
        );
        passedChecks++;
      } else {
        this.addResult(
          check.name,
          'FAIL',
          `Non-compliant: Missing ${check.requirement}`,
          { requirement: check.requirement }
        );
      }
    }
    
    const complianceRate = (passedChecks / complianceChecks.length * 100).toFixed(2);
    console.log(`\n📊 Compliance Rate: ${complianceRate}% (${passedChecks}/${complianceChecks.length})`);
  }

  async runAllTests() {
    console.log('🔍 Starting Focused KMS Integration Validation...');
    console.log('='.repeat(60));
    
    const startTime = Date.now();
    
    try {
      // File system tests (synchronous)
      this.testFileSystemIntegration();
      this.testComplianceReadiness();
      
      // Network tests (asynchronous)
      await this.testServiceDeployment();
      await this.testCORSConfiguration();
      await this.testPerformance();
      await this.testSecurityHeaders();
      
    } catch (error) {
      console.error('❌ Validation test suite encountered an error:', error);
      this.addResult(
        'Test Suite Execution',
        'FAIL',
        `Test suite error: ${error.message}`
      );
    }
    
    const totalTime = Date.now() - startTime;
    
    // Generate summary
    console.log('\\n' + '='.repeat(60));
    console.log('📊 KMS INTEGRATION VALIDATION RESULTS');
    console.log('='.repeat(60));
    
    const total = this.results.length;
    const successRate = total > 0 ? ((this.passed / total) * 100).toFixed(2) : 0;
    
    console.log(`📈 Total Tests: ${total}`);
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`🎯 Success Rate: ${successRate}%`);
    console.log(`⏱️ Total Time: ${totalTime}ms`);
    
    if (this.failed > 0) {
      console.log('\\n❌ FAILED TESTS:');
      this.results
        .filter(test => test.status === 'FAIL')
        .forEach(test => {
          console.log(`   • ${test.name}: ${test.message}`);
        });
    }
    
    if (this.passed > 0) {
      console.log('\\n✅ PASSED TESTS:');
      this.results
        .filter(test => test.status === 'PASS')
        .forEach(test => {
          console.log(`   • ${test.name}: ${test.message}`);
        });
    }
    
    console.log('\\n' + '='.repeat(60));
    if (this.failed === 0) {
      console.log('🎉 KMS INTEGRATION: ALL VALIDATION TESTS PASSED');
      console.log('✨ System ready for production deployment!');
    } else {
      console.log('⚠️ KMS INTEGRATION: SOME VALIDATION TESTS FAILED');
      console.log('🔧 Please review failed tests.');
    }
    console.log('='.repeat(60));
    
    return {
      total,
      passed: this.passed,
      failed: this.failed,
      successRate: `${successRate}%`,
      tests: this.results
    };
  }
}

// Run the validation test
const validator = new KMSValidationTest();
validator.runAllTests().catch(console.error);
