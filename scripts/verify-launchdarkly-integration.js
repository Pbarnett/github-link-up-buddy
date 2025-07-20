#!/usr/bin/env node

/**
 * LaunchDarkly Integration Verification Script
 * GitHub Link-Up Buddy Project
 * 
 * This script verifies and tests the LaunchDarkly integration across:
 * - Client-side React/Vite application
 * - Server-side Express API
 * - Supabase Edge Functions
 * - Environment configuration
 * - Feature flag functionality
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

class LaunchDarklyVerifier {
  constructor() {
    this.results = {
      environment: {},
      clientSide: {},
      serverSide: {},
      edgeFunctions: {},
      api: {},
      testing: {},
      monitoring: {},
      cicd: {}
    };
    this.issues = [];
    this.recommendations = [];
  }

  log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
  }

  logSection(title) {
    this.log(`\n${colors.bright}${colors.cyan}=== ${title} ===${colors.reset}`);
  }

  logSuccess(message) {
    this.log(`✅ ${message}`, colors.green);
  }

  logWarning(message) {
    this.log(`⚠️  ${message}`, colors.yellow);
  }

  logError(message) {
    this.log(`❌ ${message}`, colors.red);
  }

  logInfo(message) {
    this.log(`ℹ️  ${message}`, colors.blue);
  }

  addIssue(category, issue, severity = 'medium') {
    this.issues.push({ category, issue, severity });
  }

  addRecommendation(category, recommendation) {
    this.recommendations.push({ category, recommendation });
  }

  // Check environment configuration
  checkEnvironmentConfiguration() {
    this.logSection('Environment Configuration');
    
    // Check for environment files
    const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
    const foundEnvFiles = envFiles.filter(file => fs.existsSync(file));
    
    if (foundEnvFiles.length === 0) {
      this.logError('No environment files found');
      this.addIssue('environment', 'No environment files found', 'high');
    } else {
      this.logSuccess(`Found environment files: ${foundEnvFiles.join(', ')}`);
    }

    // Check for LaunchDarkly environment variables
    const requiredEnvVars = [
      'VITE_LAUNCHDARKLY_CLIENT_ID',
      'LAUNCHDARKLY_SDK_KEY',
      'LAUNCHDARKLY_API_TOKEN'
    ];

    foundEnvFiles.forEach(file => {
      this.logInfo(`Checking ${file}...`);
      try {
        const envContent = fs.readFileSync(file, 'utf8');
        const foundVars = requiredEnvVars.filter(varName => 
          envContent.includes(varName)
        );
        
        if (foundVars.length === requiredEnvVars.length) {
          this.logSuccess(`All required LaunchDarkly environment variables found in ${file}`);
        } else {
          const missingVars = requiredEnvVars.filter(varName => !foundVars.includes(varName));
          this.logWarning(`Missing environment variables in ${file}: ${missingVars.join(', ')}`);
          this.addIssue('environment', `Missing LaunchDarkly environment variables in ${file}: ${missingVars.join(', ')}`);
        }
      } catch (error) {
        this.logError(`Error reading ${file}: ${error.message}`);
      }
    });

    // Check for additional environment-specific variables
    const additionalEnvVars = [
      'LAUNCHDARKLY_PROJECT_KEY',
      'LAUNCHDARKLY_ENVIRONMENT_KEY',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY'
    ];

    this.logInfo('Checking for additional environment variables...');
    foundEnvFiles.forEach(file => {
      try {
        const envContent = fs.readFileSync(file, 'utf8');
        const foundAdditional = additionalEnvVars.filter(varName => 
          envContent.includes(varName)
        );
        if (foundAdditional.length > 0) {
          this.logSuccess(`Additional variables found in ${file}: ${foundAdditional.join(', ')}`);
        }
      } catch (error) {
        // Already logged above
      }
    });

    this.results.environment = {
      envFiles: foundEnvFiles,
      hasRequiredVars: foundEnvFiles.length > 0
    };
  }

  // Check client-side implementation
  checkClientSideImplementation() {
    this.logSection('Client-Side Implementation');
    
    // Check for LaunchDarkly client SDK
    const packageJsonPath = 'package.json';
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      const ldClientPackages = [
        'launchdarkly-js-client-sdk',
        '@launchdarkly/js-client-sdk',
        'launchdarkly-react-client-sdk'
      ];
      
      const foundClientPackages = ldClientPackages.filter(pkg => dependencies[pkg]);
      
      if (foundClientPackages.length > 0) {
        this.logSuccess(`LaunchDarkly client SDK found: ${foundClientPackages.join(', ')}`);
      } else {
        this.logError('No LaunchDarkly client SDK found in package.json');
        this.addIssue('clientSide', 'LaunchDarkly client SDK not installed', 'high');
      }
    } else {
      this.logError('package.json not found');
      this.addIssue('clientSide', 'package.json not found', 'high');
    }

    // Check for LaunchDarkly configuration files
    const configFiles = [
      'src/config/launchdarkly.js',
      'src/config/launchdarkly.ts',
      'src/utils/launchdarkly.js',
      'src/utils/launchdarkly.ts',
      'src/lib/launchdarkly.js',
      'src/lib/launchdarkly.ts'
    ];
    
    const foundConfigFiles = configFiles.filter(file => fs.existsSync(file));
    
    if (foundConfigFiles.length > 0) {
      this.logSuccess(`LaunchDarkly configuration files found: ${foundConfigFiles.join(', ')}`);
    } else {
      this.logWarning('No LaunchDarkly configuration files found');
      this.addIssue('clientSide', 'No LaunchDarkly configuration files found');
    }

    // Check for LaunchDarkly provider/context setup
    const providerFiles = [
      'src/providers/LaunchDarklyProvider.jsx',
      'src/providers/LaunchDarklyProvider.tsx',
      'src/contexts/LaunchDarklyContext.jsx',
      'src/contexts/LaunchDarklyContext.tsx'
    ];
    
    const foundProviderFiles = providerFiles.filter(file => fs.existsSync(file));
    
    if (foundProviderFiles.length > 0) {
      this.logSuccess(`LaunchDarkly provider/context files found: ${foundProviderFiles.join(', ')}`);
    } else {
      this.logWarning('No LaunchDarkly provider/context files found');
      this.addIssue('clientSide', 'No LaunchDarkly provider/context setup found');
    }

    // Check for feature flag usage in components
    const srcDir = 'src';
    if (fs.existsSync(srcDir)) {
      const hasFeatureFlagUsage = this.checkDirectoryForPattern(srcDir, /useFlags|useLDClient|useFeatureFlag|ldClient/);
      if (hasFeatureFlagUsage) {
        this.logSuccess('Feature flag usage found in source code');
      } else {
        this.logWarning('No feature flag usage found in source code');
        this.addIssue('clientSide', 'No feature flag usage found in components');
      }
    }

    this.results.clientSide = {
      hasSDK: foundClientPackages.length > 0,
      hasConfig: foundConfigFiles.length > 0,
      hasProvider: foundProviderFiles.length > 0
    };
  }

  // Check server-side implementation
  checkServerSideImplementation() {
    this.logSection('Server-Side Implementation');
    
    // Check for LaunchDarkly server SDK
    const packageJsonPath = 'package.json';
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      const ldServerPackages = [
        'launchdarkly-node-server-sdk',
        '@launchdarkly/node-server-sdk'
      ];
      
      const foundServerPackages = ldServerPackages.filter(pkg => dependencies[pkg]);
      
      if (foundServerPackages.length > 0) {
        this.logSuccess(`LaunchDarkly server SDK found: ${foundServerPackages.join(', ')}`);
      } else {
        this.logError('No LaunchDarkly server SDK found in package.json');
        this.addIssue('serverSide', 'LaunchDarkly server SDK not installed', 'high');
      }
    }

    // Check for server-side configuration
    const serverConfigFiles = [
      'server/config/launchdarkly.js',
      'server/lib/launchdarkly.js',
      'api/config/launchdarkly.js',
      'api/lib/launchdarkly.js',
      'backend/config/launchdarkly.js',
      'backend/lib/launchdarkly.js'
    ];
    
    const foundServerConfigFiles = serverConfigFiles.filter(file => fs.existsSync(file));
    
    if (foundServerConfigFiles.length > 0) {
      this.logSuccess(`Server-side LaunchDarkly configuration found: ${foundServerConfigFiles.join(', ')}`);
    } else {
      this.logWarning('No server-side LaunchDarkly configuration found');
      this.addIssue('serverSide', 'No server-side LaunchDarkly configuration found');
    }

    // Check for server-side feature flag usage
    const serverDirs = ['server', 'api', 'backend'];
    const foundServerDirs = serverDirs.filter(dir => fs.existsSync(dir));
    
    let hasServerFeatureFlagUsage = false;
    foundServerDirs.forEach(dir => {
      if (this.checkDirectoryForPattern(dir, /ldClient|launchdarkly|feature.*flag/i)) {
        hasServerFeatureFlagUsage = true;
      }
    });
    
    if (hasServerFeatureFlagUsage) {
      this.logSuccess('Server-side feature flag usage found');
    } else {
      this.logWarning('No server-side feature flag usage found');
      this.addIssue('serverSide', 'No server-side feature flag usage found');
    }

    this.results.serverSide = {
      hasSDK: foundServerPackages.length > 0,
      hasConfig: foundServerConfigFiles.length > 0,
      hasUsage: hasServerFeatureFlagUsage
    };
  }

  // Check Edge Functions implementation
  checkEdgeFunctionsImplementation() {
    this.logSection('Edge Functions Implementation');
    
    // Check for Supabase Edge Functions
    const edgeFunctionsDir = 'supabase/functions';
    if (fs.existsSync(edgeFunctionsDir)) {
      this.logSuccess(`Edge Functions directory found: ${edgeFunctionsDir}`);
      
      const functions = fs.readdirSync(edgeFunctionsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      if (functions.length > 0) {
        this.logSuccess(`Found Edge Functions: ${functions.join(', ')}`);
        
        // Check for LaunchDarkly usage in Edge Functions
        let hasLDUsage = false;
        functions.forEach(funcName => {
          const funcPath = path.join(edgeFunctionsDir, funcName);
          if (this.checkDirectoryForPattern(funcPath, /launchdarkly|@launchdarkly|edge.*sdk/i)) {
            hasLDUsage = true;
            this.logSuccess(`LaunchDarkly usage found in Edge Function: ${funcName}`);
          }
        });
        
        if (!hasLDUsage) {
          this.logWarning('No LaunchDarkly usage found in Edge Functions');
          this.addIssue('edgeFunctions', 'No LaunchDarkly integration found in Edge Functions');
        }
      } else {
        this.logInfo('No Edge Functions found');
      }
    } else {
      this.logInfo('No Edge Functions directory found');
    }

    // Check for Edge SDK dependencies
    const edgeDependencies = [
      '@launchdarkly/edge-sdk',
      'launchdarkly-edge-sdk'
    ];
    
    // Check in package.json
    const packageJsonPath = 'package.json';
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      const foundEdgePackages = edgeDependencies.filter(pkg => dependencies[pkg]);
      
      if (foundEdgePackages.length > 0) {
        this.logSuccess(`LaunchDarkly Edge SDK found: ${foundEdgePackages.join(', ')}`);
      } else {
        this.logWarning('No LaunchDarkly Edge SDK found in package.json');
        this.addIssue('edgeFunctions', 'LaunchDarkly Edge SDK not installed');
      }
    }

    this.results.edgeFunctions = {
      hasEdgeFunctions: fs.existsSync(edgeFunctionsDir),
      hasLDIntegration: false // Will be updated above
    };
  }

  // Check API integration
  checkAPIIntegration() {
    this.logSection('API Integration');
    
    // Check for API token management
    const apiFiles = [
      'src/utils/api.js',
      'src/utils/api.ts',
      'src/lib/api.js',
      'src/lib/api.ts',
      'server/utils/api.js',
      'server/lib/api.js',
      'api/utils/launchdarkly.js',
      'api/lib/launchdarkly.js'
    ];
    
    const foundAPIFiles = apiFiles.filter(file => fs.existsSync(file));
    
    if (foundAPIFiles.length > 0) {
      this.logSuccess(`API files found: ${foundAPIFiles.join(', ')}`);
      
      // Check for LaunchDarkly API usage
      let hasLDAPIUsage = false;
      foundAPIFiles.forEach(file => {
        try {
          const content = fs.readFileSync(file, 'utf8');
          if (content.includes('launchdarkly.com/api') || content.includes('LD-API-Version')) {
            hasLDAPIUsage = true;
            this.logSuccess(`LaunchDarkly API usage found in: ${file}`);
          }
        } catch (error) {
          this.logError(`Error reading ${file}: ${error.message}`);
        }
      });
      
      if (!hasLDAPIUsage) {
        this.logWarning('No LaunchDarkly API usage found');
        this.addIssue('api', 'No LaunchDarkly API integration found');
      }
    } else {
      this.logWarning('No API files found');
      this.addIssue('api', 'No API files found');
    }

    // Check for webhook endpoints
    const webhookFiles = [
      'server/routes/webhooks.js',
      'server/routes/launchdarkly.js',
      'api/webhooks/launchdarkly.js',
      'api/routes/webhooks.js'
    ];
    
    const foundWebhookFiles = webhookFiles.filter(file => fs.existsSync(file));
    
    if (foundWebhookFiles.length > 0) {
      this.logSuccess(`Webhook files found: ${foundWebhookFiles.join(', ')}`);
    } else {
      this.logWarning('No webhook files found');
      this.addIssue('api', 'No webhook endpoints found for LaunchDarkly');
    }

    this.results.api = {
      hasAPIFiles: foundAPIFiles.length > 0,
      hasWebhooks: foundWebhookFiles.length > 0
    };
  }

  // Check testing implementation
  checkTestingImplementation() {
    this.logSection('Testing Implementation');
    
    // Check for test files
    const testDirs = ['tests', 'test', '__tests__', 'spec'];
    const foundTestDirs = testDirs.filter(dir => fs.existsSync(dir));
    
    if (foundTestDirs.length > 0) {
      this.logSuccess(`Test directories found: ${foundTestDirs.join(', ')}`);
    } else {
      this.logWarning('No test directories found');
    }

    // Check for LaunchDarkly test files
    const testFiles = [
      'tests/launchdarkly.test.js',
      'tests/feature-flags.test.js',
      '__tests__/launchdarkly.test.js',
      '__tests__/feature-flags.test.js',
      'src/__tests__/launchdarkly.test.js',
      'src/tests/launchdarkly.test.js'
    ];
    
    const foundTestFiles = testFiles.filter(file => fs.existsSync(file));
    
    if (foundTestFiles.length > 0) {
      this.logSuccess(`LaunchDarkly test files found: ${foundTestFiles.join(', ')}`);
    } else {
      this.logWarning('No LaunchDarkly-specific test files found');
      this.addIssue('testing', 'No LaunchDarkly test files found');
    }

    // Check for testing utilities
    const testUtils = [
      'src/utils/test-utils.js',
      'src/utils/test-utils.ts',
      'tests/utils/launchdarkly.js',
      'tests/mocks/launchdarkly.js'
    ];
    
    const foundTestUtils = testUtils.filter(file => fs.existsSync(file));
    
    if (foundTestUtils.length > 0) {
      this.logSuccess(`Test utilities found: ${foundTestUtils.join(', ')}`);
    } else {
      this.logWarning('No test utilities found');
      this.addIssue('testing', 'No LaunchDarkly test utilities found');
    }

    this.results.testing = {
      hasTestDirs: foundTestDirs.length > 0,
      hasLDTests: foundTestFiles.length > 0,
      hasTestUtils: foundTestUtils.length > 0
    };
  }

  // Check monitoring and observability
  checkMonitoringImplementation() {
    this.logSection('Monitoring & Observability');
    
    // Check for monitoring configuration
    const monitoringFiles = [
      'src/utils/monitoring.js',
      'src/utils/analytics.js',
      'src/lib/monitoring.js',
      'src/lib/analytics.js',
      'server/utils/monitoring.js',
      'server/lib/monitoring.js'
    ];
    
    const foundMonitoringFiles = monitoringFiles.filter(file => fs.existsSync(file));
    
    if (foundMonitoringFiles.length > 0) {
      this.logSuccess(`Monitoring files found: ${foundMonitoringFiles.join(', ')}`);
    } else {
      this.logWarning('No monitoring files found');
      this.addIssue('monitoring', 'No monitoring configuration found');
    }

    // Check for logging configuration
    const loggingFiles = [
      'src/utils/logger.js',
      'src/lib/logger.js',
      'server/utils/logger.js',
      'server/lib/logger.js'
    ];
    
    const foundLoggingFiles = loggingFiles.filter(file => fs.existsSync(file));
    
    if (foundLoggingFiles.length > 0) {
      this.logSuccess(`Logging files found: ${foundLoggingFiles.join(', ')}`);
    } else {
      this.logWarning('No logging files found');
      this.addIssue('monitoring', 'No logging configuration found');
    }

    this.results.monitoring = {
      hasMonitoring: foundMonitoringFiles.length > 0,
      hasLogging: foundLoggingFiles.length > 0
    };
  }

  // Check CI/CD integration
  checkCICDIntegration() {
    this.logSection('CI/CD Integration');
    
    // Check for CI/CD configuration files
    const cicdFiles = [
      '.github/workflows/deploy.yml',
      '.github/workflows/main.yml',
      '.github/workflows/ci.yml',
      '.gitlab-ci.yml',
      'Jenkinsfile',
      '.circleci/config.yml'
    ];
    
    const foundCICDFiles = cicdFiles.filter(file => fs.existsSync(file));
    
    if (foundCICDFiles.length > 0) {
      this.logSuccess(`CI/CD files found: ${foundCICDFiles.join(', ')}`);
      
      // Check for LaunchDarkly CLI usage
      let hasLDCLIUsage = false;
      foundCICDFiles.forEach(file => {
        try {
          const content = fs.readFileSync(file, 'utf8');
          if (content.includes('ldcli') || content.includes('launchdarkly')) {
            hasLDCLIUsage = true;
            this.logSuccess(`LaunchDarkly CLI usage found in: ${file}`);
          }
        } catch (error) {
          this.logError(`Error reading ${file}: ${error.message}`);
        }
      });
      
      if (!hasLDCLIUsage) {
        this.logWarning('No LaunchDarkly CLI usage found in CI/CD');
        this.addIssue('cicd', 'No LaunchDarkly CLI integration in CI/CD');
      }
    } else {
      this.logWarning('No CI/CD files found');
      this.addIssue('cicd', 'No CI/CD configuration found');
    }

    this.results.cicd = {
      hasCICD: foundCICDFiles.length > 0,
      hasLDCLI: false // Will be updated above
    };
  }

  // Helper method to check directory for pattern
  checkDirectoryForPattern(dir, pattern) {
    try {
      const files = this.getAllFilesRecursively(dir);
      return files.some(file => {
        try {
          const content = fs.readFileSync(file, 'utf8');
          return pattern.test(content);
        } catch (error) {
          return false;
        }
      });
    } catch (error) {
      return false;
    }
  }

  // Helper method to get all files recursively
  getAllFilesRecursively(dir) {
    const files = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
        files.push(...this.getAllFilesRecursively(fullPath));
      } else if (item.isFile() && (item.name.endsWith('.js') || item.name.endsWith('.ts') || item.name.endsWith('.jsx') || item.name.endsWith('.tsx'))) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  // Generate comprehensive report
  generateReport() {
    this.logSection('Comprehensive Report');
    
    // Summary
    this.log(`\n${colors.bright}Summary:${colors.reset}`);
    this.log(`Total Issues Found: ${this.issues.length}`);
    this.log(`High Priority Issues: ${this.issues.filter(i => i.severity === 'high').length}`);
    this.log(`Medium Priority Issues: ${this.issues.filter(i => i.severity === 'medium').length}`);
    this.log(`Low Priority Issues: ${this.issues.filter(i => i.severity === 'low').length}`);
    
    // Issues by category
    if (this.issues.length > 0) {
      this.log(`\n${colors.bright}Issues by Category:${colors.reset}`);
      const issuesByCategory = this.issues.reduce((acc, issue) => {
        if (!acc[issue.category]) acc[issue.category] = [];
        acc[issue.category].push(issue);
        return acc;
      }, {});
      
      Object.entries(issuesByCategory).forEach(([category, issues]) => {
        this.log(`\n${colors.bright}${category.toUpperCase()}:${colors.reset}`);
        issues.forEach(issue => {
          const severity = issue.severity === 'high' ? '🔴' : issue.severity === 'medium' ? '🟡' : '🟢';
          this.log(`  ${severity} ${issue.issue}`);
        });
      });
    }
    
    // Recommendations
    if (this.recommendations.length > 0) {
      this.log(`\n${colors.bright}Recommendations:${colors.reset}`);
      this.recommendations.forEach(rec => {
        this.log(`\n${colors.bright}${rec.category.toUpperCase()}:${colors.reset}`);
        this.log(`  💡 ${rec.recommendation}`);
      });
    }
    
    // Next steps
    this.log(`\n${colors.bright}Next Steps:${colors.reset}`);
    this.log('1. Address high-priority issues first');
    this.log('2. Set up basic LaunchDarkly SDK integration');
    this.log('3. Configure environment variables');
    this.log('4. Implement feature flag usage patterns');
    this.log('5. Add testing and monitoring');
    this.log('6. Set up CI/CD integration');
    
    // Save report to file
    const reportPath = 'launchdarkly-verification-report.json';
    const reportData = {
      timestamp: new Date().toISOString(),
      results: this.results,
      issues: this.issues,
      recommendations: this.recommendations
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    this.log(`\n${colors.bright}Report saved to: ${reportPath}${colors.reset}`);
  }

  // Run all checks
  async run() {
    this.log(`${colors.bright}${colors.magenta}🚀 GitHub Link-Up Buddy - LaunchDarkly Integration Verification${colors.reset}`);
    this.log(`${colors.bright}Starting comprehensive verification...${colors.reset}\n`);
    
    this.checkEnvironmentConfiguration();
    this.checkClientSideImplementation();
    this.checkServerSideImplementation();
    this.checkEdgeFunctionsImplementation();
    this.checkAPIIntegration();
    this.checkTestingImplementation();
    this.checkMonitoringImplementation();
    this.checkCICDIntegration();
    
    this.generateReport();
    
    this.log(`\n${colors.bright}${colors.green}✅ Verification completed!${colors.reset}`);
    
    // Add general recommendations
    this.addRecommendation('general', 'Start with basic client-side SDK integration');
    this.addRecommendation('general', 'Set up environment-specific configuration');
    this.addRecommendation('general', 'Implement server-side SDK for backend feature flags');
    this.addRecommendation('general', 'Add Edge Function integration for Supabase');
    this.addRecommendation('general', 'Set up monitoring and alerting');
    this.addRecommendation('general', 'Create comprehensive test suite');
    this.addRecommendation('general', 'Integrate with CI/CD pipeline');
  }
}

// Run the verification
const verifier = new LaunchDarklyVerifier();
verifier.run().catch(console.error);
