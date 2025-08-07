#!/usr/bin/env -S deno run --allow-all

/**
 * Production Deployment Validation Script
 * Validates that the optimized flight search function is working correctly in production
 */

interface ValidationResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  response_time: number;
  details: string;
  url?: string;
}

interface ProductionConfig {
  projectRef: string;
  baseUrl: string;
  functionName: string;
}

class ProductionValidator {
  private config: ProductionConfig;
  private results: ValidationResult[] = [];

  constructor(projectRef: string) {
    this.config = {
      projectRef,
      baseUrl: `https://${projectRef}.supabase.co`,
      functionName: 'flight-search-optimized'
    };
  }

  /**
   * Run all production validation tests
   */
  async runValidation(): Promise<void> {
    console.log('🚀 Production Deployment Validation Starting...\n');
    console.log(`📍 Target: ${this.config.baseUrl}`);
    console.log(`🎯 Function: ${this.config.functionName}\n`);

    this.results = [
      await this.testFunctionAccessibility(),
      await this.testErrorHandling(),
      await this.testPerformanceDashboard(),
      await this.testResponseFormat(),
      await this.testCORSHeaders()
    ];

    this.generateValidationReport();
  }

  /**
   * Test that the function is deployed and accessible
   */
  async testFunctionAccessibility(): Promise<ValidationResult> {
    const testName = 'Function Accessibility';
    const url = `${this.config.baseUrl}/functions/v1/${this.config.functionName}`;
    
    console.log('🧪 Testing Function Accessibility...');
    
    const startTime = performance.now();
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-key'
        },
        body: JSON.stringify({ test: true })
      });

      const duration = performance.now() - startTime;
      const responseText = await response.text();
      
      console.log(`  Status: ${response.status}, Time: ${Math.round(duration)}ms`);

      // Function should be accessible (not 404) but may return 400 for invalid data
      if (response.status === 404) {
        return {
          test: testName,
          status: 'FAIL',
          response_time: duration,
          details: 'Function not found - deployment may have failed',
          url
        };
      } else {
        return {
          test: testName,
          status: 'PASS',
          response_time: duration,
          details: `Function accessible, status: ${response.status}`,
          url
        };
      }
    } catch (error) {
      const duration = performance.now() - startTime;
      console.log(`  Error: ${error.message}`);
      
      return {
        test: testName,
        status: 'FAIL',
        response_time: duration,
        details: `Network error: ${error.message}`,
        url
      };
    }
  }

  /**
   * Test error handling and validation
   */
  async testErrorHandling(): Promise<ValidationResult> {
    const testName = 'Error Handling';
    const url = `${this.config.baseUrl}/functions/v1/${this.config.functionName}`;
    
    console.log('🧪 Testing Error Handling...');
    
    const startTime = performance.now();
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-key'
        },
        body: JSON.stringify({ invalid: 'data' })
      });

      const duration = performance.now() - startTime;
      const responseText = await response.text();
      
      console.log(`  Status: ${response.status}, Response: ${responseText.substring(0, 100)}`);

      // Should return proper error structure for invalid data
      if (response.status >= 400 && responseText.includes('error')) {
        let details = 'Proper error handling detected';
        
        try {
          const errorData = JSON.parse(responseText);
          if (errorData.error) {
            details = `Structured error response: ${errorData.error.substring(0, 50)}`;
          }
        } catch (e) {
          // Non-JSON error response is still acceptable
        }
        
        return {
          test: testName,
          status: 'PASS',
          response_time: duration,
          details,
          url
        };
      } else {
        return {
          test: testName,
          status: 'WARNING',
          response_time: duration,
          details: 'Unexpected response to invalid data',
          url
        };
      }
    } catch (error) {
      const duration = performance.now() - startTime;
      
      return {
        test: testName,
        status: 'FAIL',
        response_time: duration,
        details: `Network error: ${error.message}`,
        url
      };
    }
  }

  /**
   * Test performance dashboard availability
   */
  async testPerformanceDashboard(): Promise<ValidationResult> {
    const testName = 'Performance Dashboard';
    const url = `${this.config.baseUrl}/functions/v1/performance-dashboard`;
    
    console.log('🧪 Testing Performance Dashboard...');
    
    const startTime = performance.now();
    
    try {
      const response = await fetch(`${url}?range=1h&alerts=false`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-key'
        }
      });

      const duration = performance.now() - startTime;
      const responseText = await response.text();
      
      console.log(`  Status: ${response.status}, Time: ${Math.round(duration)}ms`);

      if (response.status === 200) {
        try {
          const dashboardData = JSON.parse(responseText);
          if (dashboardData.metrics && dashboardData.status) {
            return {
              test: testName,
              status: 'PASS',
              response_time: duration,
              details: `Dashboard working, system status: ${dashboardData.status}`,
              url
            };
          }
        } catch (e) {
          // Fall through to warning
        }
        
        return {
          test: testName,
          status: 'WARNING',
          response_time: duration,
          details: 'Dashboard responding but structure may be incorrect',
          url
        };
      } else if (response.status === 404) {
        return {
          test: testName,
          status: 'WARNING',
          response_time: duration,
          details: 'Performance dashboard not deployed (optional)',
          url
        };
      } else {
        return {
          test: testName,
          status: 'FAIL',
          response_time: duration,
          details: `Dashboard error: ${response.status}`,
          url
        };
      }
    } catch (error) {
      const duration = performance.now() - startTime;
      
      return {
        test: testName,
        status: 'WARNING',
        response_time: duration,
        details: `Dashboard not accessible: ${error.message}`,
        url
      };
    }
  }

  /**
   * Test response format and structure
   */
  async testResponseFormat(): Promise<ValidationResult> {
    const testName = 'Response Format';
    const url = `${this.config.baseUrl}/functions/v1/${this.config.functionName}`;
    
    console.log('🧪 Testing Response Format...');
    
    const startTime = performance.now();
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-key'
        },
        body: JSON.stringify({ tripRequestId: 'test-id' })
      });

      const duration = performance.now() - startTime;
      const responseText = await response.text();
      
      console.log(`  Status: ${response.status}, Response type: ${response.headers.get('content-type')}`);

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const data = JSON.parse(responseText);
          
          // For error responses, check if they have proper structure
          if (data.error || data.success || data.data) {
            return {
              test: testName,
              status: 'PASS',
              response_time: duration,
              details: 'JSON response with proper structure',
              url
            };
          } else {
            return {
              test: testName,
              status: 'WARNING',
              response_time: duration,
              details: 'JSON response but unexpected structure',
              url
            };
          }
        } catch (e) {
          return {
            test: testName,
            status: 'WARNING',
            response_time: duration,
            details: 'Invalid JSON response',
            url
          };
        }
      } else {
        return {
          test: testName,
          status: 'WARNING',
          response_time: duration,
          details: 'Non-JSON response format',
          url
        };
      }
    } catch (error) {
      const duration = performance.now() - startTime;
      
      return {
        test: testName,
        status: 'FAIL',
        response_time: duration,
        details: `Network error: ${error.message}`,
        url
      };
    }
  }

  /**
   * Test CORS headers and security settings
   */
  async testCORSHeaders(): Promise<ValidationResult> {
    const testName = 'CORS Headers';
    const url = `${this.config.baseUrl}/functions/v1/${this.config.functionName}`;
    
    console.log('🧪 Testing CORS Headers...');
    
    const startTime = performance.now();
    
    try {
      const response = await fetch(url, {
        method: 'OPTIONS'
      });

      const duration = performance.now() - startTime;
      
      const corsOrigin = response.headers.get('Access-Control-Allow-Origin');
      const corsMethods = response.headers.get('Access-Control-Allow-Methods');
      const corsHeaders = response.headers.get('Access-Control-Allow-Headers');
      
      console.log(`  CORS Origin: ${corsOrigin}`);
      console.log(`  CORS Methods: ${corsMethods}`);
      
      if (corsOrigin && corsMethods) {
        return {
          test: testName,
          status: 'PASS',
          response_time: duration,
          details: `CORS properly configured: ${corsOrigin}`,
          url
        };
      } else {
        return {
          test: testName,
          status: 'WARNING',
          response_time: duration,
          details: 'CORS headers may not be properly configured',
          url
        };
      }
    } catch (error) {
      const duration = performance.now() - startTime;
      
      return {
        test: testName,
        status: 'FAIL',
        response_time: duration,
        details: `CORS test failed: ${error.message}`,
        url
      };
    }
  }

  /**
   * Generate comprehensive validation report
   */
  private generateValidationReport(): void {
    console.log('\n📊 PRODUCTION DEPLOYMENT VALIDATION RESULTS');
    console.log('═'.repeat(60));

    let passCount = 0;
    let warnCount = 0;
    let failCount = 0;

    for (const result of this.results) {
      let statusIcon = '';
      switch (result.status) {
        case 'PASS':
          statusIcon = '✅';
          passCount++;
          break;
        case 'WARNING':
          statusIcon = '⚠️ ';
          warnCount++;
          break;
        case 'FAIL':
          statusIcon = '❌';
          failCount++;
          break;
      }

      console.log(`\n${statusIcon} ${result.test}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Response Time: ${Math.round(result.response_time)}ms`);
      console.log(`   Details: ${result.details}`);
      if (result.url) {
        console.log(`   URL: ${result.url}`);
      }
    }

    console.log('\n' + '═'.repeat(60));
    console.log('📈 VALIDATION SUMMARY');
    console.log(`   Total Tests: ${this.results.length}`);
    console.log(`   Passed: ${passCount}`);
    console.log(`   Warnings: ${warnCount}`);
    console.log(`   Failed: ${failCount}`);

    const successRate = (passCount / this.results.length) * 100;
    console.log(`   Success Rate: ${Math.round(successRate)}%`);

    // Overall status determination
    if (failCount === 0 && warnCount === 0) {
      console.log('\n🎉 DEPLOYMENT VALIDATION: EXCELLENT');
      console.log('   All tests passed successfully!');
    } else if (failCount === 0) {
      console.log('\n✅ DEPLOYMENT VALIDATION: GOOD');
      console.log('   Core functionality working with minor issues.');
    } else if (failCount < 2) {
      console.log('\n⚠️  DEPLOYMENT VALIDATION: NEEDS ATTENTION');
      console.log('   Some critical issues detected. Review failed tests.');
    } else {
      console.log('\n❌ DEPLOYMENT VALIDATION: CRITICAL ISSUES');
      console.log('   Multiple failures detected. Check deployment.');
    }

    console.log('\n🔧 NEXT STEPS:');
    if (failCount > 0) {
      console.log('   1. Fix failed tests before proceeding');
      console.log('   2. Check Supabase function logs for errors');
      console.log('   3. Verify environment variables are set');
    }
    if (warnCount > 0) {
      console.log('   1. Review warnings for potential improvements');
      console.log('   2. Consider deploying missing optional components');
    }
    console.log('   3. Run performance tests: deno run --allow-all supabase/functions/flight-search-optimized/performance-tests.ts');
    console.log('   4. Set up monitoring alerts');
    console.log('   5. Test with real flight search data');

    console.log(`\n📍 Production URLs:`);
    console.log(`   • Main Function: ${this.config.baseUrl}/functions/v1/${this.config.functionName}`);
    console.log(`   • Dashboard: ${this.config.baseUrl}/functions/v1/performance-dashboard`);
    console.log(`   • Admin Panel: https://supabase.com/dashboard/project/${this.config.projectRef}`);
  }
}

// Run validation if this script is executed directly
if (import.meta.main) {
  const args = Deno.args;
  let projectRef = 'kcaedvghixjiwefrmyav'; // Default Parker Flight project
  
  if (args.length > 0) {
    projectRef = args[0];
  }
  
  console.log(`🎯 Validating deployment for project: ${projectRef}\n`);
  
  const validator = new ProductionValidator(projectRef);
  await validator.runValidation();
}

export { ProductionValidator };
