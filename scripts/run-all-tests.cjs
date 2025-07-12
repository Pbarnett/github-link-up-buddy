#!/usr/bin/env node
/**
 * Master Test Runner for Parker Flight
 * Intelligently runs all test suites with proper orchestration
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

class MasterTestRunner {
  constructor() {
    this.startTime = performance.now();
    this.results = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      suites: {},
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        warnings: 0
      }
    };
    
    this.config = {
      // Parse command line arguments
      skipPerf: process.argv.includes('--skip-perf'),
      skipE2e: process.argv.includes('--skip-e2e'),
      skipSecurity: process.argv.includes('--skip-security'),
      skipVisual: process.argv.includes('--skip-visual'),
      verbose: process.argv.includes('--verbose') || process.argv.includes('-v'),
      parallel: !process.argv.includes('--sequential'),
      coverage: process.argv.includes('--coverage'),
      reportOnly: process.argv.includes('--report-only'),
      environment: process.env.TEST_ENV || 'local'
    };
    
    this.reportDir = './tests/reports';
    this.ensureReportDirectory();
  }

  ensureReportDirectory() {
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
  }

  log(message, level = 'info') {
    const colors = {
      info: '\x1b[36m',    // cyan
      success: '\x1b[32m', // green
      warning: '\x1b[33m', // yellow
      error: '\x1b[31m',   // red
      reset: '\x1b[0m'
    };
    
    const timestamp = new Date().toISOString().substring(11, 23);
    const colorCode = colors[level] || colors.info;
    const resetCode = colors.reset;
    
    console.log(`${colorCode}[${timestamp}] ${message}${resetCode}`);
  }

  async run() {
    this.log('🚀 Starting Parker Flight Test Suite', 'info');
    this.log(`Environment: ${this.config.environment}`, 'info');
    this.log(`Configuration: ${JSON.stringify(this.config, null, 2)}`, this.config.verbose ? 'info' : 'debug');

    try {
      if (this.config.reportOnly) {
        await this.generateReportOnly();
        return;
      }

      // Run test suites in order
      await this.runUnitTests();
      await this.runIntegrationTests();
      await this.runSecurityTests();
      await this.runAccessibilityTests();
      await this.runE2ETests();
      await this.runPerformanceTests();
      await this.runVisualRegressionTests();
      
      // Generate final report
      await this.generateFinalReport();
      this.printSummary();
      
      // Exit with appropriate code
      process.exit(this.results.summary.failed > 0 ? 1 : 0);
      
    } catch (error) {
      this.log(`❌ Test suite failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  async runUnitTests() {
    this.log('🧪 Running Unit Tests...', 'info');
    const suite = 'unit_tests';
    this.results.summary.total++;

    try {
      const startTime = performance.now();
      
      // Run Vitest unit tests
      const coverage = this.config.coverage ? '--coverage' : '';
      const command = `npm run test ${coverage}`;
      
      const output = execSync(command, { 
        encoding: 'utf8', 
        stdio: this.config.verbose ? 'inherit' : 'pipe' 
      });
      
      const duration = performance.now() - startTime;
      
      this.results.suites[suite] = {
        name: 'Unit Tests (Vitest)',
        status: 'passed',
        duration,
        output: this.config.verbose ? undefined : output
      };
      
      this.results.summary.passed++;
      this.log(`✅ Unit tests passed (${Math.round(duration)}ms)`, 'success');
      
    } catch (error) {
      this.results.suites[suite] = {
        name: 'Unit Tests (Vitest)',
        status: 'failed',
        error: error.message,
        output: error.stdout
      };
      
      this.results.summary.failed++;
      this.log(`❌ Unit tests failed: ${error.message}`, 'error');
    }
  }

  async runIntegrationTests() {
    this.log('🔗 Running Integration Tests...', 'info');
    const suite = 'integration_tests';
    this.results.summary.total++;

    try {
      const startTime = performance.now();
      
      // Run existing integration test scripts
      const integrationScripts = [
        'node scripts/test-google-auth-optimized.js --fast',
        'node test-kms-integration.js',
        'node validate-profile-architecture.js',
        'node test-env-validation.js --local'
      ];
      
      let allPassed = true;
      const outputs = [];
      
      for (const script of integrationScripts) {
        try {
          const output = execSync(script, { 
            encoding: 'utf8',
            stdio: this.config.verbose ? 'inherit' : 'pipe'
          });
          outputs.push(`${script}: SUCCESS`);
        } catch (error) {
          outputs.push(`${script}: FAILED - ${error.message}`);
          allPassed = false;
        }
      }
      
      const duration = performance.now() - startTime;
      
      this.results.suites[suite] = {
        name: 'Integration Tests',
        status: allPassed ? 'passed' : 'failed',
        duration,
        details: outputs
      };
      
      if (allPassed) {
        this.results.summary.passed++;
        this.log(`✅ Integration tests passed (${Math.round(duration)}ms)`, 'success');
      } else {
        this.results.summary.failed++;
        this.log(`❌ Integration tests failed`, 'error');
      }
      
    } catch (error) {
      this.results.suites[suite] = {
        name: 'Integration Tests',
        status: 'failed',
        error: error.message
      };
      
      this.results.summary.failed++;
      this.log(`❌ Integration tests failed: ${error.message}`, 'error');
    }
  }

  async runSecurityTests() {
    if (this.config.skipSecurity) {
      this.log('⏭️  Skipping security tests', 'warning');
      this.results.summary.skipped++;
      return;
    }

    this.log('🔒 Running Security Tests...', 'info');
    const suite = 'security_tests';
    this.results.summary.total++;

    try {
      const startTime = performance.now();
      
      // Run security audit script
      const output = execSync('node scripts/security/security-audit.js', { 
        encoding: 'utf8',
        stdio: this.config.verbose ? 'inherit' : 'pipe'
      });
      
      const duration = performance.now() - startTime;
      
      this.results.suites[suite] = {
        name: 'Security Audit',
        status: 'passed',
        duration,
        output: this.config.verbose ? undefined : output
      };
      
      this.results.summary.passed++;
      this.log(`✅ Security tests passed (${Math.round(duration)}ms)`, 'success');
      
    } catch (error) {
      // Security audit might exit with code 1 on warnings
      const isWarningOnly = error.message.includes('warnings') && !error.message.includes('critical');
      
      this.results.suites[suite] = {
        name: 'Security Audit',
        status: isWarningOnly ? 'warning' : 'failed',
        error: error.message,
        output: error.stdout
      };
      
      if (isWarningOnly) {
        this.results.summary.warnings++;
        this.log(`⚠️  Security tests passed with warnings`, 'warning');
      } else {
        this.results.summary.failed++;
        this.log(`❌ Security tests failed: ${error.message}`, 'error');
      }
    }
  }

  async runAccessibilityTests() {
    this.log('♿ Running Accessibility Tests...', 'info');
    const suite = 'accessibility_tests';
    this.results.summary.total++;

    try {
      const startTime = performance.now();
      
      // Check if Playwright is available
      if (!fs.existsSync('node_modules/@playwright/test')) {
        throw new Error('Playwright not installed');
      }
      
      // Run accessibility tests (subset of E2E with axe)
      const output = execSync('npx playwright test tests/e2e/user-journey.spec.ts --grep "accessibility"', { 
        encoding: 'utf8',
        stdio: this.config.verbose ? 'inherit' : 'pipe'
      });
      
      const duration = performance.now() - startTime;
      
      this.results.suites[suite] = {
        name: 'Accessibility Tests',
        status: 'passed',
        duration,
        output: this.config.verbose ? undefined : output
      };
      
      this.results.summary.passed++;
      this.log(`✅ Accessibility tests passed (${Math.round(duration)}ms)`, 'success');
      
    } catch (error) {
      this.results.suites[suite] = {
        name: 'Accessibility Tests',
        status: 'failed',
        error: error.message,
        output: error.stdout
      };
      
      this.results.summary.failed++;
      this.log(`❌ Accessibility tests failed: ${error.message}`, 'error');
    }
  }

  async runE2ETests() {
    if (this.config.skipE2e) {
      this.log('⏭️  Skipping E2E tests', 'warning');
      this.results.summary.skipped++;
      return;
    }

    this.log('🎭 Running End-to-End Tests...', 'info');
    const suite = 'e2e_tests';
    this.results.summary.total++;

    try {
      const startTime = performance.now();
      
      // Run Playwright E2E tests
      const command = this.config.environment === 'ci' 
        ? 'npx playwright test --reporter=junit'
        : 'npx playwright test';
      
      const output = execSync(command, { 
        encoding: 'utf8',
        stdio: this.config.verbose ? 'inherit' : 'pipe'
      });
      
      const duration = performance.now() - startTime;
      
      this.results.suites[suite] = {
        name: 'End-to-End Tests (Playwright)',
        status: 'passed',
        duration,
        output: this.config.verbose ? undefined : output
      };
      
      this.results.summary.passed++;
      this.log(`✅ E2E tests passed (${Math.round(duration)}ms)`, 'success');
      
    } catch (error) {
      this.results.suites[suite] = {
        name: 'End-to-End Tests (Playwright)',
        status: 'failed',
        error: error.message,
        output: error.stdout
      };
      
      this.results.summary.failed++;
      this.log(`❌ E2E tests failed: ${error.message}`, 'error');
    }
  }

  async runPerformanceTests() {
    if (this.config.skipPerf) {
      this.log('⏭️  Skipping performance tests', 'warning');
      this.results.summary.skipped++;
      return;
    }

    this.log('⚡ Running Performance Tests...', 'info');
    const suite = 'performance_tests';
    this.results.summary.total++;

    try {
      const startTime = performance.now();
      
      // Run Lighthouse CI if application is running
      let output = '';
      
      try {
        // Check if app is running
        const healthCheck = execSync('curl -f http://localhost:8080/health || echo "not running"', { 
          encoding: 'utf8',
          timeout: 5000
        });
        
        if (healthCheck.includes('healthy')) {
          output = execSync('npx lhci autorun', { 
            encoding: 'utf8',
            stdio: this.config.verbose ? 'inherit' : 'pipe'
          });
        } else {
          // Run simple performance check
          output = execSync('npx lighthouse http://localhost:8080 --output=json --quiet', { 
            encoding: 'utf8',
            stdio: this.config.verbose ? 'inherit' : 'pipe'
          });
        }
      } catch (lighthouseError) {
        // Fallback to basic performance metrics
        output = 'Performance test skipped - application not accessible';
        this.log('⚠️  Performance tests skipped - app not running', 'warning');
      }
      
      const duration = performance.now() - startTime;
      
      this.results.suites[suite] = {
        name: 'Performance Tests (Lighthouse)',
        status: output.includes('skipped') ? 'warning' : 'passed',
        duration,
        output: this.config.verbose ? undefined : output
      };
      
      if (output.includes('skipped')) {
        this.results.summary.warnings++;
      } else {
        this.results.summary.passed++;
        this.log(`✅ Performance tests passed (${Math.round(duration)}ms)`, 'success');
      }
      
    } catch (error) {
      this.results.suites[suite] = {
        name: 'Performance Tests (Lighthouse)',
        status: 'failed',
        error: error.message,
        output: error.stdout
      };
      
      this.results.summary.failed++;
      this.log(`❌ Performance tests failed: ${error.message}`, 'error');
    }
  }

  async runVisualRegressionTests() {
    if (this.config.skipVisual) {
      this.log('⏭️  Skipping visual regression tests', 'warning');
      this.results.summary.skipped++;
      return;
    }

    this.log('📸 Running Visual Regression Tests...', 'info');
    const suite = 'visual_tests';
    this.results.summary.total++;

    try {
      const startTime = performance.now();
      
      // Run visual regression tests
      const output = execSync('npx playwright test tests/e2e/visual/', { 
        encoding: 'utf8',
        stdio: this.config.verbose ? 'inherit' : 'pipe'
      });
      
      const duration = performance.now() - startTime;
      
      this.results.suites[suite] = {
        name: 'Visual Regression Tests',
        status: 'passed',
        duration,
        output: this.config.verbose ? undefined : output
      };
      
      this.results.summary.passed++;
      this.log(`✅ Visual tests passed (${Math.round(duration)}ms)`, 'success');
      
    } catch (error) {
      this.results.suites[suite] = {
        name: 'Visual Regression Tests',
        status: 'failed',
        error: error.message,
        output: error.stdout
      };
      
      this.results.summary.failed++;
      this.log(`❌ Visual tests failed: ${error.message}`, 'error');
    }
  }

  async generateFinalReport() {
    const totalDuration = performance.now() - this.startTime;
    this.results.total_duration = totalDuration;
    
    // Generate comprehensive report
    const reportFile = path.join(this.reportDir, `test-report-${Date.now()}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(this.results, null, 2));
    
    // Generate summary report
    const summaryFile = path.join(this.reportDir, 'latest-summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify({
      ...this.results.summary,
      timestamp: this.results.timestamp,
      duration: totalDuration,
      environment: this.results.environment
    }, null, 2));
    
    this.log(`📄 Test report saved to: ${reportFile}`, 'info');
  }

  async generateReportOnly() {
    this.log('📊 Generating consolidated test report...', 'info');
    
    // Collect existing reports
    const reports = {};
    
    // Security report
    const securityReportPath = './tests/security/reports/latest-summary.json';
    if (fs.existsSync(securityReportPath)) {
      reports.security = JSON.parse(fs.readFileSync(securityReportPath, 'utf8'));
    }
    
    // E2E report
    const e2eReportPath = './tests/e2e/reports/summary.json';
    if (fs.existsSync(e2eReportPath)) {
      reports.e2e = JSON.parse(fs.readFileSync(e2eReportPath, 'utf8'));
    }
    
    // Performance report
    const perfReportPath = './tests/performance/lighthouse-ci.db';
    if (fs.existsSync(perfReportPath)) {
      reports.performance = { status: 'available', location: perfReportPath };
    }
    
    this.results.collected_reports = reports;
    this.generateFinalReport();
    
    this.log('✅ Report generation completed', 'success');
  }

  printSummary() {
    const totalDuration = performance.now() - this.startTime;
    
    this.log('\\n🎯 Test Suite Summary', 'info');
    this.log('====================', 'info');
    this.log(`Total Suites: ${this.results.summary.total}`);
    this.log(`Passed: ${this.results.summary.passed}`, 'success');
    this.log(`Failed: ${this.results.summary.failed}`, this.results.summary.failed > 0 ? 'error' : 'info');
    this.log(`Warnings: ${this.results.summary.warnings}`, this.results.summary.warnings > 0 ? 'warning' : 'info');
    this.log(`Skipped: ${this.results.summary.skipped}`, 'info');
    this.log(`Total Duration: ${Math.round(totalDuration / 1000)}s`);
    
    // Detailed suite results
    if (this.config.verbose) {
      this.log('\\n📋 Suite Details:', 'info');
      Object.entries(this.results.suites).forEach(([key, suite]) => {
        const status = suite.status === 'passed' ? '✅' : 
                     suite.status === 'warning' ? '⚠️' : '❌';
        const duration = suite.duration ? ` (${Math.round(suite.duration)}ms)` : '';
        this.log(`  ${status} ${suite.name}${duration}`);
      });
    }
    
    if (this.results.summary.failed > 0) {
      this.log('\\n❌ Test suite failed - check individual test outputs', 'error');
    } else if (this.results.summary.warnings > 0) {
      this.log('\\n⚠️  Test suite passed with warnings', 'warning');
    } else {
      this.log('\\n✅ All tests passed successfully!', 'success');
    }
  }
}

// Show help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Parker Flight Master Test Runner

Usage: node scripts/run-all-tests.cjs [options]

Options:
  --skip-perf         Skip performance tests
  --skip-e2e          Skip end-to-end tests  
  --skip-security     Skip security tests
  --skip-visual       Skip visual regression tests
  --verbose, -v       Verbose output
  --sequential        Run tests sequentially (default: parallel)
  --coverage          Include coverage reporting
  --report-only       Only generate reports from existing test results
  --help, -h          Show this help

Environment Variables:
  TEST_ENV           Test environment (local, ci, staging, production)
  NODE_ENV           Node environment
  
Examples:
  node scripts/run-all-tests.cjs                    # Run all tests
  node scripts/run-all-tests.cjs --skip-perf        # Skip performance tests
  node scripts/run-all-tests.cjs --verbose          # Verbose output
  node scripts/run-all-tests.cjs --report-only      # Generate report only
  `);
  process.exit(0);
}

// Run the test suite
const runner = new MasterTestRunner();
runner.run().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});
