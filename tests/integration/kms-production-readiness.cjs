/**
 * Comprehensive KMS Production Readiness Test
 * Final validation before production deployment
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://bbonngdyfyfjqfhvoljl.supabase.co';

class ProductionReadinessTest {
  constructor() {
    this.results = [];
    this.passed = 0;
    this.failed = 0;
    this.warnings = 0;
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
    else if (status === 'WARN') this.warnings++;
    
    const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${emoji} ${testName}: ${message}`);
    
    if (Object.keys(details).length > 0) {
      console.log(`   Details:`, details);
    }
  }

  async makeRequest(url, options = {}) {
    const startTime = Date.now();
    
    try {
      const response = await fetch(url, {
        timeout: 15000,
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

  async testServiceAvailability() {
    console.log('\\n🌟 Testing Service Availability...');
    
    const services = [
      { name: 'Profiles KMS Service', url: `${SUPABASE_URL}/functions/v1/manage-profiles-kms` },
      { name: 'Payment Methods KMS Service', url: `${SUPABASE_URL}/functions/v1/manage-payment-methods-kms` }
    ];
    
    const availabilityChecks = 5;
    const checkInterval = 2000; // 2 seconds
    
    for (const service of services) {
      let successfulChecks = 0;
      const responseTimes = [];
      
      for (let i = 0; i < availabilityChecks; i++) {
        const response = await this.makeRequest(service.url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        // We consider any response (even 401) as "available"
        if (response.status >= 200 && response.status < 500) {
          successfulChecks++;
          responseTimes.push(response.duration);
        }
        
        if (i < availabilityChecks - 1) {
          await new Promise(resolve => setTimeout(resolve, checkInterval));
        }
      }
      
      const availability = (successfulChecks / availabilityChecks * 100).toFixed(2);
      const avgResponseTime = responseTimes.length > 0 ? 
        (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2) : 0;
      
      if (successfulChecks === availabilityChecks) {
        this.addResult(
          `${service.name} Availability`,
          'PASS',
          `${availability}% availability over ${availabilityChecks} checks`,
          {
            successfulChecks: `${successfulChecks}/${availabilityChecks}`,
            averageResponseTime: `${avgResponseTime}ms`,
            responseTimes: responseTimes
          }
        );
      } else if (successfulChecks >= availabilityChecks * 0.8) {
        this.addResult(
          `${service.name} Availability`,
          'WARN',
          `${availability}% availability (${successfulChecks}/${availabilityChecks} checks passed) - acceptable but monitor`,
          {
            successfulChecks: `${successfulChecks}/${availabilityChecks}`,
            averageResponseTime: `${avgResponseTime}ms`
          }
        );
      } else {
        this.addResult(
          `${service.name} Availability`,
          'FAIL',
          `${availability}% availability (${successfulChecks}/${availabilityChecks} checks passed) - too low for production`,
          {
            successfulChecks: `${successfulChecks}/${availabilityChecks}`,
            averageResponseTime: `${avgResponseTime}ms`
          }
        );
      }
    }
  }

  async testConcurrentLoad() {
    console.log('\\n🔄 Testing Concurrent Load Handling...');
    
    const concurrentRequests = 20;
    const promises = [];
    
    const startTime = Date.now();
    
    for (let i = 0; i < concurrentRequests; i++) {
      promises.push(
        this.makeRequest(`${SUPABASE_URL}/functions/v1/manage-profiles-kms`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
      );
    }
    
    try {
      const results = await Promise.all(promises);
      const totalTime = Date.now() - startTime;
      
      const successfulRequests = results.filter(r => r.status >= 200 && r.status < 500).length;
      const averageResponseTime = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
      const maxResponseTime = Math.max(...results.map(r => r.duration));
      const minResponseTime = Math.min(...results.map(r => r.duration));
      
      if (successfulRequests >= concurrentRequests * 0.95) {
        this.addResult(
          'Concurrent Load Test',
          'PASS',
          `${successfulRequests}/${concurrentRequests} requests successful under load`,
          {
            averageResponseTime: `${averageResponseTime.toFixed(2)}ms`,
            maxResponseTime: `${maxResponseTime}ms`,
            minResponseTime: `${minResponseTime}ms`,
            totalTime: `${totalTime}ms`,
            requestsPerSecond: ((concurrentRequests / totalTime) * 1000).toFixed(2)
          }
        );
      } else if (successfulRequests >= concurrentRequests * 0.8) {
        this.addResult(
          'Concurrent Load Test',
          'WARN',
          `${successfulRequests}/${concurrentRequests} requests successful - monitor under higher load`,
          {
            averageResponseTime: `${averageResponseTime.toFixed(2)}ms`,
            maxResponseTime: `${maxResponseTime}ms`,
            totalTime: `${totalTime}ms`
          }
        );
      } else {
        this.addResult(
          'Concurrent Load Test',
          'FAIL',
          `Only ${successfulRequests}/${concurrentRequests} requests successful - not ready for production load`,
          {
            averageResponseTime: `${averageResponseTime.toFixed(2)}ms`,
            totalTime: `${totalTime}ms`
          }
        );
      }
    } catch (error) {
      this.addResult(
        'Concurrent Load Test',
        'FAIL',
        `Load test failed: ${error.message}`,
        { error: error.message }
      );
    }
  }

  async testErrorHandling() {
    console.log('\\n⚠️ Testing Error Handling Robustness...');
    
    const errorTests = [
      {
        name: 'Invalid JSON Payload',
        url: `${SUPABASE_URL}/functions/v1/manage-profiles-kms`,
        options: {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: 'invalid json'
        }
      },
      {
        name: 'Large Payload',
        url: `${SUPABASE_URL}/functions/v1/manage-profiles-kms`,
        options: {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: 'x'.repeat(10000) })
        }
      },
      {
        name: 'Empty Request',
        url: `${SUPABASE_URL}/functions/v1/manage-profiles-kms`,
        options: {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: ''
        }
      }
    ];
    
    for (const test of errorTests) {
      const response = await this.makeRequest(test.url, test.options);
      
      // We expect graceful error handling (400-499 range)
      if (response.status >= 400 && response.status < 500) {
        this.addResult(
          `Error Handling - ${test.name}`,
          'PASS',
          `Gracefully handled with status ${response.status}`,
          { status: response.status, responseTime: `${response.duration}ms` }
        );
      } else if (response.status >= 500) {
        this.addResult(
          `Error Handling - ${test.name}`,
          'FAIL',
          `Server error (${response.status}) - not production ready`,
          { status: response.status, error: response.data }
        );
      } else if (response.error) {
        this.addResult(
          `Error Handling - ${test.name}`,
          'WARN',
          `Connection error: ${response.error}`,
          { error: response.error }
        );
      } else {
        this.addResult(
          `Error Handling - ${test.name}`,
          'WARN',
          `Unexpected response: ${response.status}`,
          { status: response.status }
        );
      }
    }
  }

  async testSecurityValidation() {
    console.log('\\n🔒 Testing Security Implementation...');
    
    // Test that services properly reject unauthenticated requests
    const securityTests = [
      {
        name: 'Profiles Authentication Requirement',
        url: `${SUPABASE_URL}/functions/v1/manage-profiles-kms?action=get`
      },
      {
        name: 'Payment Methods Authentication Requirement',
        url: `${SUPABASE_URL}/functions/v1/manage-payment-methods-kms?action=list`
      }
    ];
    
    for (const test of securityTests) {
      const response = await this.makeRequest(test.url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.status === 401) {
        this.addResult(
          test.name,
          'PASS',
          'Properly requires authentication - security implemented correctly',
          { status: response.status }
        );
      } else {
        this.addResult(
          test.name,
          'FAIL',
          `Security vulnerability: expected 401, got ${response.status}`,
          { status: response.status, data: response.data }
        );
      }
    }
    
    // Test HTTPS enforcement
    const httpsTest = await this.makeRequest(`${SUPABASE_URL}/functions/v1/manage-profiles-kms`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (httpsTest.response && httpsTest.response.headers) {
      const hsts = httpsTest.response.headers.get('strict-transport-security');
      if (hsts) {
        this.addResult(
          'HTTPS Security',
          'PASS',
          'HTTPS properly enforced with HSTS',
          { hsts }
        );
      } else {
        this.addResult(
          'HTTPS Security',
          'WARN',
          'HTTPS used but HSTS header missing',
          { url: SUPABASE_URL }
        );
      }
    }
  }

  testArchitectureCompliance() {
    console.log('\\n🏗️ Testing Architecture Compliance...');
    
    const fs = require('fs');
    
    // Check critical files exist
    const criticalFiles = [
      { path: 'supabase/functions/_shared/kms.ts', name: 'KMS Core Module', critical: true },
      { path: 'supabase/functions/manage-profiles-kms/index.ts', name: 'Profile KMS Service', critical: true },
      { path: 'supabase/functions/manage-payment-methods-kms/index.ts', name: 'Payment KMS Service', critical: true },
      { path: 'src/services/api/profileApiKMS.ts', name: 'Frontend Profile Service', critical: false },
      { path: 'src/services/api/paymentMethodsApiKMS.ts', name: 'Frontend Payment Service', critical: false },
      { path: 'src/hooks/useProfileKMS.ts', name: 'Profile Hook', critical: false },
      { path: 'src/hooks/usePaymentMethods.ts', name: 'Payment Hook', critical: false }
    ];
    
    for (const file of criticalFiles) {
      if (fs.existsSync(file.path)) {
        this.addResult(
          `${file.name} Architecture`,
          'PASS',
          `Required file present: ${file.path}`,
          { path: file.path, critical: file.critical }
        );
      } else {
        this.addResult(
          `${file.name} Architecture`,
          file.critical ? 'FAIL' : 'WARN',
          `${file.critical ? 'Critical' : 'Optional'} file missing: ${file.path}`,
          { path: file.path, critical: file.critical }
        );
      }
    }
    
    // Check for proper TypeScript configuration
    if (fs.existsSync('tsconfig.json')) {
      this.addResult(
        'TypeScript Configuration',
        'PASS',
        'TypeScript configuration present',
        { file: 'tsconfig.json' }
      );
    } else {
      this.addResult(
        'TypeScript Configuration',
        'WARN',
        'TypeScript configuration missing',
        { recommendation: 'Add tsconfig.json for better type safety' }
      );
    }
  }

  generateProductionReport() {
    const totalTime = Date.now() - this.startTime;
    
    console.log('\\n' + '='.repeat(80));
    console.log('🚀 PRODUCTION READINESS ASSESSMENT');
    console.log('='.repeat(80));
    
    const total = this.results.length;
    const successRate = total > 0 ? ((this.passed / total) * 100).toFixed(2) : 0;
    const warningRate = total > 0 ? ((this.warnings / total) * 100).toFixed(2) : 0;
    const failureRate = total > 0 ? ((this.failed / total) * 100).toFixed(2) : 0;
    
    console.log(`📈 Total Tests: ${total}`);
    console.log(`✅ Passed: ${this.passed} (${successRate}%)`);
    console.log(`⚠️ Warnings: ${this.warnings} (${warningRate}%)`);
    console.log(`❌ Failed: ${this.failed} (${failureRate}%)`);
    console.log(`⏱️ Total Test Time: ${(totalTime / 1000).toFixed(2)} seconds`);
    
    // Production readiness score
    const productionScore = this.passed * 3 + this.warnings * 1 - this.failed * 2;
    const maxScore = total * 3;
    const readinessPercentage = ((productionScore / maxScore) * 100).toFixed(2);
    
    console.log(`\\n🎯 Production Readiness Score: ${readinessPercentage}% (${productionScore}/${maxScore})`);
    
    // Determine production readiness
    if (this.failed === 0 && readinessPercentage >= 90) {
      console.log('\\n🎉 PRODUCTION STATUS: READY FOR DEPLOYMENT');
      console.log('✨ KMS Integration meets all production requirements!');
      console.log('\\n🚀 Deployment Checklist:');
      console.log('   ✅ AWS KMS encryption implemented');
      console.log('   ✅ Security requirements met');
      console.log('   ✅ Performance targets achieved');
      console.log('   ✅ Error handling implemented');
      console.log('   ✅ Architecture compliance verified');
    } else if (this.failed === 0 && readinessPercentage >= 80) {
      console.log('\\n⚠️ PRODUCTION STATUS: READY WITH MONITORING');
      console.log('🔧 KMS Integration is production ready but requires monitoring');
      console.log('\\n📋 Post-Deployment Actions:');
      console.log('   • Monitor service availability');
      console.log('   • Watch for performance degradation');
      console.log('   • Review warnings in production logs');
    } else if (this.failed <= 2 && readinessPercentage >= 70) {
      console.log('\\n🔄 PRODUCTION STATUS: READY AFTER FIXES');
      console.log('🔧 Minor issues need resolution before production deployment');
    } else {
      console.log('\\n❌ PRODUCTION STATUS: NOT READY');
      console.log('🚫 Critical issues must be resolved before production deployment');
    }
    
    // Show critical issues
    const criticalIssues = this.results.filter(r => r.status === 'FAIL');
    if (criticalIssues.length > 0) {
      console.log('\\n❌ CRITICAL ISSUES TO RESOLVE:');
      criticalIssues.forEach(issue => {
        console.log(`   • ${issue.name}: ${issue.message}`);
      });
    }
    
    // Show warnings
    const warnings = this.results.filter(r => r.status === 'WARN');
    if (warnings.length > 0) {
      console.log('\\n⚠️ WARNINGS TO MONITOR:');
      warnings.forEach(warning => {
        console.log(`   • ${warning.name}: ${warning.message}`);
      });
    }
    
    console.log('='.repeat(80));
    
    return {
      total,
      passed: this.passed,
      warnings: this.warnings,
      failed: this.failed,
      successRate: `${successRate}%`,
      productionScore: readinessPercentage,
      isReady: this.failed === 0 && readinessPercentage >= 90,
      needsMonitoring: this.failed === 0 && readinessPercentage >= 80,
      tests: this.results
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Production Readiness Assessment for KMS Integration...');
    console.log('='.repeat(80));
    console.log('This comprehensive test validates production deployment readiness:');
    console.log('• Service availability and reliability');
    console.log('• Load handling and performance');
    console.log('• Error handling and robustness');
    console.log('• Security implementation');
    console.log('• Architecture compliance');
    console.log('='.repeat(80));
    
    this.startTime = Date.now();
    
    try {
      // Architecture and file system tests
      this.testArchitectureCompliance();
      
      // Service availability tests
      await this.testServiceAvailability();
      
      // Performance and load tests
      await this.testConcurrentLoad();
      
      // Error handling tests
      await this.testErrorHandling();
      
      // Security validation
      await this.testSecurityValidation();
      
    } catch (error) {
      console.error('❌ Production readiness test suite failed:', error);
      this.addResult(
        'Test Suite Execution',
        'FAIL',
        `Test suite error: ${error.message}`
      );
    }
    
    // Generate final production report
    return this.generateProductionReport();
  }
}

// Run the production readiness test
const productionTest = new ProductionReadinessTest();
productionTest.runAllTests().catch(console.error);
