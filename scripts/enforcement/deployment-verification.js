#!/usr/bin/env node

/**
 * Enterprise Deployment Verification
 * 
 * Automated smoke tests and deployment verification using existing tools:
 * - Health check endpoints
 * - Critical path validation
 * - Performance regression detection
 * - Database connectivity
 * - Feature flag validation
 */

import { execSync } from 'child_process';
const fs = require('fs');
import {} from 'path';
// Utility functions
// Removed unused info function
// Removed unused warning function
// Removed unused error function
// Removed unused success function

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m', 
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'

};
// Removed unused log function

const step = (message) => console.log(`🔍 ${message}`, 'cyan');

class DeploymentVerification {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
      metrics: {}
    };
    this.environment = process.env.NODE_ENV || 'development';
    this.baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  }

  async verifyAll() {
    console.log('🚀 Enterprise Deployment Verification', 'bright');
    console.log('='.repeat(50), 'blue');
    console.log(`Environment: ${this.environment}`, 'cyan');
    console.log(`Base URL: ${this.baseUrl}`, 'cyan');

    await this.verifyBuildArtifacts();
    await this.verifyHealthEndpoints();
    await this.verifyCriticalPaths();
    await this.verifyDatabaseConnectivity();
    await this.verifyFeatureFlags();
    await this.verifyPerformanceBaseline();
    await this.verifySecurityHeaders();
    await this.verifyEnvironmentConfig();

    await this.generateReport();

    const hasFailures = this.results.failed.length > 0;
    if (hasFailures) {
      console.error(`❌ Deployment Verification Failed: ${this.results.failed.length} critical issues`);
      process.exit(1);
    } else {
      console.log(`✅ 🎉 Deployment Verification Passed!`);
    }
  }

  async verifyBuildArtifacts() {
    console.log('Verifying build artifacts...');
    
    try {
      // Check if build directory exists and has content
      if (!fs.existsSync('dist')) {
        this.results.failed.push('Build directory (dist) not found');
        return;
      }

      const distFiles = fs.readdirSync('dist');
      if (distFiles.length === 0) {
        this.results.failed.push('Build directory is empty');
        return;
      }

      // Check for essential files
      const essentialFiles = ['index.html'];
      const missingFiles = essentialFiles.filter(file => !distFiles.includes(file));
      
      if (missingFiles.length > 0) {
        this.results.failed.push(`Missing essential build files: ${missingFiles.join(', ')}`);
      } else {
        this.results.passed.push('Build artifacts present');
      }

      // Check build size
      const buildSize = this.calculateDirectorySize('dist');
      this.results.metrics.buildSizeKB = Math.round(buildSize / 1024);
      
      if (buildSize > 10 * 1024 * 1024) { // 10MB
        this.results.warnings.push(`Large build size: ${Math.round(buildSize / 1024 / 1024)}MB`);
      } else {
        this.results.passed.push(`Build size within limits: ${Math.round(buildSize / 1024)}KB`);
      }

    } catch (err) {
      this.results.failed.push(`Build artifact verification failed: ${err.message}`);
    }
  }

  calculateDirectorySize(dir) {
    let size = 0;
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = `${dir}/${file}`;
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        size += this.calculateDirectorySize(filePath);
      } else {
        size += stat.size
      }
    }
    
    return size;
  }

  async verifyHealthEndpoints() {
    console.log('Verifying health endpoints...');
    
    try {
      // Start the application in background for testing
      const healthEndpoints = [
        '/api/health',
        '/health',
        '/'
      ];

      for (const endpoint of healthEndpoints) {
        try {
          const result = execSync(`curl -f -s -o /dev/null -w "%{http_code}" ${this.baseUrl}${endpoint} || echo "0"`, {
            encoding: 'utf-8',
            timeout: 10000 
          });
          
          const statusCode = parseInt(result.trim());
          
          if (statusCode === 200) {
            this.results.passed.push(`Health endpoint ${endpoint} responding`);
            break; // At least one health endpoint is working
          } else if (statusCode === 0) {
            this.results.warnings.push(`Health endpoint ${endpoint} not reachable`);
          } else {
            this.results.warnings.push(`Health endpoint ${endpoint} returned ${statusCode}`);
          }
        } catch (error) {
          this.results.warnings.push(`Health check failed for ${endpoint}: ${error.message}`);
        }
      }
    } catch (err) {
      this.results.failed.push(`Health endpoint verification failed: ${err.message}`);
    }
  }

  async verifyCriticalPaths() {
    console.log('Verifying critical application paths...');
    
    try {
      // Test critical routes that should exist
      const criticalPaths = [
        '/',
        '/login',
        '/dashboard',
        '/api'
      ];

      let workingPaths = 0;

      for (const path of criticalPaths) {
        try {
          const result = execSync(`curl -f -s -o /dev/null -w "%{http_code}" ${this.baseUrl}${path} || echo "0"`, {
            encoding: 'utf-8',
            timeout: 5000 
          });
          
          const statusCode = parseInt(result.trim());
          
          if (statusCode >= 200 && statusCode < 400) {
            workingPaths++;
            this.results.passed.push(`Critical path ${path} accessible`);
          } else if (statusCode === 404) {
            this.results.warnings.push(`Path ${path} returns 404 - may be expected`);
          } else {
            this.results.warnings.push(`Path ${path} returned ${statusCode}`);
          }
        } catch (error) {
          this.results.warnings.push(`Critical path test failed for ${path}`);
        }
      }

      this.results.metrics.accessiblePaths = workingPaths;
      
      if (workingPaths === 0) {
        this.results.failed.push('No critical paths are accessible');
      }

    } catch (err) {
      this.results.failed.push(`Critical path verification failed: ${err.message}`);
    }
  }

  async verifyDatabaseConnectivity() {
    console.log('Verifying database connectivity...');
    
    try {
      // Check if database connection scripts exist and run them
      const dbTestScripts = [
        'scripts/test-db-connection.js',
        'scripts/utils/test-db.js'
      ];

      let dbTestFound = false;

      for (const script of dbTestScripts) {
        if (fs.existsSync(script)) {
          dbTestFound = true;
          try {
            execSync(`node ${script}`, { 
              stdio: 'pipe',
              timeout: 10000 
            });
            this.results.passed.push('Database connectivity verified');
            break;
          } catch (err) {
            this.results.failed.push(`Database connectivity test failed: ${err.message}`);
          }
        }
      }

      if (!dbTestFound) {
        // Try basic environment variable checks
        const dbEnvVars = ['DATABASE_URL', 'SUPABASE_URL', 'DB_HOST'];
        const presentVars = dbEnvVars.filter(env => process.env[env]);
        
        if (presentVars.length > 0) {
          this.results.passed.push(`Database configuration present: ${presentVars.join(', ')}`);
        } else {
          this.results.warnings.push('No database configuration found');
        }
      }

    } catch (err) {
      this.results.warnings.push(`Database verification failed: ${err.message}`);
    }
  }

  async verifyFeatureFlags() {
    console.log('Verifying feature flag configuration...');
    
    try {
      // Check LaunchDarkly or other feature flag configurations
      const featureFlagEnvs = ['LAUNCHDARKLY_SDK_KEY', 'LD_CLIENT_SIDE_ID'];
      const presentFlags = featureFlagEnvs.filter(env => process.env[env]);
      
      if (presentFlags.length > 0) {
        this.results.passed.push(`Feature flags configured: ${presentFlags.length} keys`);
        
        // Try to verify LaunchDarkly connectivity if script exists
        if (fs.existsSync('scripts/verify-launchdarkly-integration.js')) {
          try {
            execSync('node scripts/verify-launchdarkly-integration.js', { 
              stdio: 'pipe',
              timeout: 10000 
            });
            this.results.passed.push('Feature flag service connectivity verified');
          } catch (error) {
            this.results.warnings.push('Feature flag service test failed');
          }
        }
      } else {
        this.results.warnings.push('No feature flag configuration found');
      }

    } catch (err) {
      this.results.warnings.push(`Feature flag verification failed: ${err.message}`);
    }
  }

  async verifyPerformanceBaseline() {
    console.log('Verifying performance baseline...');
    
    try {
      // Use existing build to check bundle sizes
      if (fs.existsSync('dist')) {
        const jsFiles = execSync('find dist -name "*.js" -type f', { encoding: 'utf-8' }).trim().split('\n').filter(f => f);
        const cssFiles = execSync('find dist -name "*.css" -type f', { encoding: 'utf-8' }).trim().split('\n').filter(f => f);
        
        let totalJsSize = 0;
        let totalCssSize = 0;
        
        jsFiles.forEach(file => {
          if (fs.existsSync(file)) {
            totalJsSize += fs.statSync(file).size
          }
        });
        
        cssFiles.forEach(file => {
          if (fs.existsSync(file)) {
            totalCssSize += fs.statSync(file).size
          }
        });
        
        this.results.metrics.bundleSizeJs = Math.round(totalJsSize / 1024);
        this.results.metrics.bundleSizeCss = Math.round(totalCssSize / 1024);
        
        const thresholds = { js: 500, css: 100 }; // KB
        
        if (totalJsSize / 1024 <= thresholds.js && totalCssSize / 1024 <= thresholds.css) {
          this.results.passed.push(`Bundle sizes within limits (JS: ${Math.round(totalJsSize/1024)}KB, CSS: ${Math.round(totalCssSize/1024)}KB)`);
        } else {
          this.results.warnings.push(`Bundle sizes exceed recommended limits (JS: ${Math.round(totalJsSize/1024)}KB, CSS: ${Math.round(totalCssSize/1024)}KB)`);
        }
      }

      // Basic response time check
      try {
        const start = Date.now();
        execSync(`curl -f -s ${this.baseUrl}/ > /dev/null`, { timeout: 5000 });
        const responseTime = Date.now() - start;
        
        this.results.metrics.responseTimeMs = responseTime;
        
        if (responseTime < 2000) {
          this.results.passed.push(`Response time acceptable: ${responseTime}ms`);
        } else {
          this.results.warnings.push(`Slow response time: ${responseTime}ms`);
        }
      } catch (error) {
        this.results.warnings.push('Could not measure response time');
      }

    } catch (err) {
      this.results.warnings.push(`Performance baseline verification failed: ${err.message}`);
    }
  }

  async verifySecurityHeaders() {
    console.log('Verifying security headers...');
    
    try {
      const result = execSync(`curl -I -s ${this.baseUrl}/ || echo "FAILED"`, { 
        encoding: 'utf-8',
        timeout: 5000 
      });
      
      if (result.includes('FAILED')) {
        this.results.warnings.push('Could not fetch security headers');
        return;
      }
      
      const securityHeaders = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY|SAMEORIGIN',
        'X-XSS-Protection': '1',
        'Strict-Transport-Security': 'max-age'
      };
      
      const headers = result.toLowerCase();
      let secureHeaders = 0;
      
      Object.entries(securityHeaders).forEach(([header, pattern]) => {
        const headerKey = header.toLowerCase();
        if (headers.includes(headerKey)) {
          secureHeaders++;
          this.results.passed.push(`Security header present: ${header}`);
        } else {
          this.results.warnings.push(`Missing security header: ${header}`);
        }
      });
      
      this.results.metrics.securityHeaders = secureHeaders;
      
    } catch (err) {
      this.results.warnings.push(`Security header verification failed: ${err.message}`);
    }
  }

  async verifyEnvironmentConfig() {
    console.log('Verifying environment configuration...');
    
    try {
      // Check for required environment variables
      const requiredEnvVars = [
        'NODE_ENV',
        'PORT'
      ];
      
      const productionEnvVars = [
        'DATABASE_URL',
        'JWT_SECRET',
        'API_URL'
      ];
      
      const envVarsToCheck = this.environment === 'production' 
        ? [...requiredEnvVars, ...productionEnvVars]
        : requiredEnvVars;
      
      const missingVars = envVarsToCheck.filter(env => !process.env[env]);
      const presentVars = envVarsToCheck.filter(env => process.env[env]);
      
      this.results.metrics.environmentVariables = presentVars.length
      
      if (missingVars.length === 0) {
        this.results.passed.push(`All required environment variables present (${presentVars.length})`);
      } else {
        this.results.warnings.push(`Missing environment variables: ${missingVars.join(', ')}`);
      }
      
      // Check for development artifacts in production
      if (this.environment === 'production') {
        const devArtifacts = [
          'console.log',
          'debugger',
          'TODO',
          'FIXME'
        ];
        
        let foundDevArtifacts = 0;
        
        for (const artifact of devArtifacts) {
          try {
            const result = execSync(`grep -r "${artifact}" dist/ --include="*.js" | wc -l || echo 0`, { encoding: 'utf-8' });
            const count = parseInt(result.trim());
            if (count > 0) {
              foundDevArtifacts += count;
            }
          } catch (error) {
            // Ignore grep errors
          }
        }
        
        if (foundDevArtifacts === 0) {
          this.results.passed.push('No development artifacts in production build');
        } else {
          this.results.warnings.push(`Found ${foundDevArtifacts} development artifacts in production build`);
        }
      }
      
    } catch (err) {
      this.results.warnings.push(`Environment configuration verification failed: ${err.message}`);
    }
  }

  async generateReport() {
    console.log('Generating deployment verification report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      environment: this.environment,
      baseUrl: this.baseUrl,
      summary: {
        passed: this.results.passed.length,
        failed: this.results.failed.length,
        warnings: this.results.warnings.length,
        overall: this.results.failed.length === 0 ? 'PASS' : 'FAIL'
      },
      details: this.results,
      metrics: this.results.metrics
    };
    
    fs.writeFileSync('deployment-verification-report.json', JSON.stringify(report, null, 2));
    
    // Console output
    console.log('\n📊 Deployment Verification Summary:', 'blue');
    console.log('='.repeat(50), 'blue');
    
    if (this.results.passed.length > 0) {
      console.log(`\n✅ Passed (${this.results.passed.length}):`, 'green');
      this.results.passed.forEach(item => console.log(`   • ${item}`, 'green'));
    }
    
    if (this.results.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${this.results.warnings.length}):`, 'yellow');
      this.results.warnings.forEach(item => console.log(`   • ${item}`, 'yellow'));
    }
    
    if (this.results.failed.length > 0) {
      console.log(`\n❌ Failed (${this.results.failed.length}):`, 'red');
      this.results.failed.forEach(item => console.log(`   • ${item}`, 'red'));
    }
    
    if (Object.keys(this.results.metrics).length > 0) {
      console.log('\n📈 Deployment Metrics:', 'cyan');
      Object.entries(this.results.metrics).forEach(([key, value]) => {
        console.log(`   • ${key}: ${value}`, 'cyan');
      });
    }
    
    console.log(`\nReport saved to: deployment-verification-report.json`, 'blue');
  }
}

// Execute script
if (import.meta.url === `file://${process.argv[1]}`) {
  const verifier = new DeploymentVerification();
  verifier.verifyAll().catch(err => {
    console.error(`❌ Deployment verification failed: ${error.message}`);
    process.exit(1);    
  });
}

module.exports = DeploymentVerification;
