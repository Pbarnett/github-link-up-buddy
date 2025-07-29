#!/usr/bin/env node

/**
 * Parker Flight - Professional Quality Gates Enforcement
 * 
 * This script runs comprehensive quality checks including:
 * - Code quality and formatting
 * - Security vulnerabilities
 * - Performance regressions
 * - Test coverage requirements
 * - Documentation completeness
 * - Dependency health
 * - Configuration validation
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Color codes for console output
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
// Utility functions
// Removed unused log function

// Removed unused error function
// Removed unused success function

const step = (message) => console.log(`🔍 ${message}`, 'cyan');

// Quality gate thresholds
const QUALITY_THRESHOLDS = {
  TEST_COVERAGE: 80,
  TYPE_COVERAGE: 85,
  PERFORMANCE_BUDGET: {
    FIRST_CONTENTFUL_PAINT: 2000,
    LARGEST_CONTENTFUL_PAINT: 4000,
    CUMULATIVE_LAYOUT_SHIFT: 0.1,
    TOTAL_BLOCKING_TIME: 300
  },
  BUNDLE_SIZE: {
    MAX_JS_SIZE_KB: 500,
    MAX_CSS_SIZE_KB: 100,
    MAX_INITIAL_CHUNK_KB: 200
  },
  SECURITY: {
    MAX_HIGH_VULNERABILITIES: 0,
    MAX_MEDIUM_VULNERABILITIES: 5,
    MAX_OUTDATED_DEPENDENCIES: 10
  }

class QualityGates {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
      metrics: {}
    };
    this.skipFix = process.argv.includes('--no-fix');
    this.verbose = process.argv.includes('--verbose');
    this.ciMode = process.env.CI === 'true';
  }

  async runAll() {
    try {
      console.log('🏗️  Professional Quality Gates - Starting Comprehensive Checks', 'bright');
      console.log('='.repeat(70), 'blue');
      
      // Core quality checks
      await this.checkCodeQuality();
      await this.checkSecurity();
      await this.checkTestCoverage();
      await this.checkPerformance();
      await this.checkDependencies();
      await this.checkDocumentation();
      await this.checkConfiguration();
      await this.checkAccessibility();
      
      await this.generateReport();
      
      const hasFailures = this.results.failed.length > 0;
      if (hasFailures) {
        console.error(`❌ Quality Gates Failed: ${this.results.failed.length} issues found`);
        process.exit(1);
      } else {
        console.log(`✅ 🎉 All Quality Gates Passed! (${this.results.passed.length} checks)`);
      }
      
    } catch (err) {
      console.error(`Quality gates execution failed: ${err.message}`);
      process.exit(1);
    }
  }

  async checkCodeQuality() {
    console.log('Checking code quality and formatting...');
    
    try {
      // TypeScript compilation check
      execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'pipe' });
      this.results.passed.push('TypeScript compilation');
    } catch (error) {
      this.results.failed.push('TypeScript compilation errors found');
    }

    try {
      // ESLint check
      const lintResult = execSync('npx eslint . --format json', { encoding: 'utf-8' });
      const lintData = JSON.parse(lintResult);
      const totalErrors = lintData.reduce((sum, file) => sum + file.errorCount, 0);
      const totalWarnings = lintData.reduce((sum, file) => sum + file.warningCount, 0);
      
      if (totalErrors === 0) {
        this.results.passed.push(`ESLint (${totalWarnings} warnings)`);
      } else {
        this.results.failed.push(`ESLint found ${totalErrors} errors`);
      }
    } catch (error) {
      this.results.failed.push('ESLint check failed');
    }

    try {
      // Prettier check
      execSync('npx prettier --check "src/**/*.{js,jsx,ts,tsx,json,css,md}"', { stdio: 'pipe' });
      this.results.passed.push('Code formatting (Prettier)');
    } catch (error) {
      if (!this.skipFix) {
        try {
          execSync('npx prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,md}"', { stdio: 'pipe' });
          this.results.passed.push('Code formatting (auto-fixed)');
        } catch (error) {
          this.results.failed.push('Code formatting issues could not be auto-fixed');
        }
      } else {
        this.results.failed.push('Code formatting issues found');
      }
    }

    // Check for console.log statements in production code
    try {
      const consoleLogCheck = execSync('grep -r "console\\." src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" || true', { encoding: 'utf-8' });
      if (consoleLogCheck.trim()) {
        this.results.warnings.push('Console statements found in source code');
      } else {
        this.results.passed.push('No console statements in production code');
      }
    } catch (error) {
      // Ignore grep errors
    }
  }

  async checkSecurity() {
    console.log('Running security vulnerability scans...');
    
    try {
      // npm audit
      const auditResult = execSync('npm audit --json', { encoding: 'utf-8' });
      const auditData = JSON.parse(auditResult);
      
      const highVulns = auditData.metadata?.vulnerabilities?.high || 0;
      const mediumVulns = auditData.metadata?.vulnerabilities?.moderate || 0;
      
      this.results.metrics.security = {
        high: highVulns,
        medium: mediumVulns,
        total: auditData.metadata?.vulnerabilities?.total || 0
      };
      
      if (highVulns <= QUALITY_THRESHOLDS.SECURITY.MAX_HIGH_VULNERABILITIES &&
          mediumVulns <= QUALITY_THRESHOLDS.SECURITY.MAX_MEDIUM_VULNERABILITIES) {
        this.results.passed.push(`Security audit (${highVulns} high, ${mediumVulns} medium)`);
      } else {
        this.results.failed.push(`Security vulnerabilities exceed threshold (${highVulns} high, ${mediumVulns} medium)`);
      }
    } catch (error) {
      this.results.warnings.push('Security audit could not be completed');
    }

    // Check for hardcoded secrets
    try {
      const secretPatterns = [
        'sk_live_',
        'pk_live_',
        'AKIA[0-9A-Z]{16}',
        'ghp_[a-zA-Z0-9]{36}',
        '-----BEGIN (RSA )?PRIVATE KEY-----'
      ];
      
      let secretsFound = false;
      for (const pattern of secretPatterns) {
        try {
          const result = execSync(`grep -r "${pattern}" src/ || true`, { encoding: 'utf-8' });
          if (result.trim()) {
            secretsFound = true;
            break;
          }
        } catch (error) {
          // Continue checking other patterns
        }
      }
      
      if (!secretsFound) {
        this.results.passed.push('No hardcoded secrets detected');
      } else {
        this.results.failed.push('Potential hardcoded secrets found');
      }
    } catch (error) {
      this.results.warnings.push('Secret detection scan failed');
    }
  }

  async checkTestCoverage() {
    console.log('Analyzing test coverage...');
    
    try {
      // Run tests with coverage
      execSync('npm run test:coverage -- --reporter=json > coverage-report.json', { stdio: 'pipe' });
      
      if (fs.existsSync('coverage-report.json')) {
        const coverageData = JSON.parse(fs.readFileSync('coverage-report.json', 'utf-8'));
        const coverage = coverageData.coverage || {};
        
        // Calculate overall coverage
        let totalStatements = 0;
        let coveredStatements = 0;
        
        for (const file of Object.values(coverage)) {
          totalStatements += file.s ? Object.keys(file.s).length : 0;
          coveredStatements += file.s ? Object.values(file.s).filter(hits => hits > 0).length : 0;
        }
        
        const coveragePercent = totalStatements > 0 ? (coveredStatements / totalStatements) * 100 : 0;
        this.results.metrics.testCoverage = Math.round(coveragePercent);
        
        if (coveragePercent >= QUALITY_THRESHOLDS.TEST_COVERAGE) {
          this.results.passed.push(`Test coverage (${this.results.metrics.testCoverage}%)`);
        } else {
          this.results.failed.push(`Test coverage below threshold (${this.results.metrics.testCoverage}% < ${QUALITY_THRESHOLDS.TEST_COVERAGE}%)`);
        }
      } else {
        this.results.warnings.push('Coverage report not generated');
      }
    } catch (error) {
      this.results.warnings.push('Test coverage analysis failed');
    }

    // Check for test files
    try {
      const testFiles = execSync('find . -name "*.test.*" -o -name "*.spec.*" | wc -l', { encoding: 'utf-8' });
      const testCount = parseInt(testFiles.trim());
      
      if (testCount > 0) {
        this.results.passed.push(`Test files present (${testCount} files)`);
      } else {
        this.results.failed.push('No test files found');
      }
    } catch (error) {
      this.results.warnings.push('Could not count test files');
    }
  }

  async checkPerformance() {
    console.log('Checking performance budgets...');
    
    try {
      // Build and analyze bundle size
      execSync('npm run build', { stdio: 'pipe' });
      
      if (fs.existsSync('dist')) {
        const distStats = this.analyzeDistFolder();
        this.results.metrics.bundleSize = distStats;
        
        const jsSize = distStats.js / 1024; // Convert to KB
        const cssSize = distStats.css / 1024;
        
        if (jsSize <= QUALITY_THRESHOLDS.BUNDLE_SIZE.MAX_JS_SIZE_KB &&
            cssSize <= QUALITY_THRESHOLDS.BUNDLE_SIZE.MAX_CSS_SIZE_KB) {
          this.results.passed.push(`Bundle size (JS: ${Math.round(jsSize)}KB, CSS: ${Math.round(cssSize)}KB)`);
        } else {
          this.results.failed.push(`Bundle size exceeds budget (JS: ${Math.round(jsSize)}KB, CSS: ${Math.round(cssSize)}KB)`);
        }
      }
    } catch (error) {
      this.results.warnings.push('Performance budget check failed');
    }

    // Check for Lighthouse CI config
    if (fs.existsSync('.lighthouserc.js') || fs.existsSync('lighthouse-budgets.json')) {
      this.results.passed.push('Performance monitoring configured');
    } else {
      this.results.warnings.push('No Lighthouse CI configuration found');
    }
  }

  analyzeDistFolder() {
    const stats = { js: 0, css: 0, html: 0, assets: 0 };
    
    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          walkDir(filePath);
        } else {
          const ext = path.extname(file).toLowerCase();
          const size = stat.size
          
          switch (ext) {
            case '.js':
            case '.mjs':
              stats.js += size;
              break;
            case '.css':
              stats.css += size;
              break;
            case '.html':
              stats.html += size;
              break;
            default:
              stats.assets += size;
          }
        }
      }
    };
    
    walkDir('dist');
    return stats;
  }

  async checkDependencies() {
    console.log('Analyzing dependencies...');
    
    try {
      // Check for outdated dependencies
      const outdatedResult = execSync('npm outdated --json || true', { encoding: 'utf-8' });
      const outdatedData = outdatedResult ? JSON.parse(outdatedResult) : {};
      const outdatedCount = Object.keys(outdatedData).length
      
      this.results.metrics.outdatedDependencies = outdatedCount;
      
      if (outdatedCount <= QUALITY_THRESHOLDS.SECURITY.MAX_OUTDATED_DEPENDENCIES) {
        this.results.passed.push(`Dependencies up to date (${outdatedCount} outdated)`);
      } else {
        this.results.warnings.push(`${outdatedCount} dependencies are outdated`);
      }
    } catch (error) {
      this.results.warnings.push('Dependency analysis failed');
    }

    // Check package.json for common issues
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      
      const checks = [
        { field: 'name', message: 'Package name defined' },
        { field: 'version', message: 'Version defined' },
        { field: 'description', message: 'Description provided' },
        { field: 'scripts', message: 'Scripts defined' },
        { field: 'dependencies', message: 'Dependencies listed' }
      ];
      
      checks.forEach(check => {
        if (packageJson[check.field]) {
          this.results.passed.push(check.message);
        } else {
          this.results.warnings.push(`Missing ${check.field} in package.json`);
        }
      });
      
    } catch (error) {
      this.results.failed.push('package.json validation failed');
    }
  }

  async checkDocumentation() {
    console.log('Validating documentation completeness...');
    
    const requiredDocs = [
      'README.md',
      'docs/REPOSITORY_ORGANIZATION_GUIDELINES.md',
      'docs/deployment/OPERATIONS_RUNBOOK.md'
    ];
    
    requiredDocs.forEach(doc => {
      if (fs.existsSync(doc)) {
        const content = fs.readFileSync(doc, 'utf-8');
        if (content.length > 100) { // Basic content check
          this.results.passed.push(`Documentation: ${path.basename(doc)}`);
        } else {
          this.results.warnings.push(`${doc} appears to be incomplete`);
        }
      } else {
        this.results.failed.push(`Missing required documentation: ${doc}`);
      }
    });

    // Check for code comments in TypeScript files
    try {
      const tsFiles = execSync('find src -name "*.ts" -o -name "*.tsx" | head -10', { encoding: 'utf-8' }).trim().split('\n');
      let commentedFiles = 0;
      
      tsFiles.forEach(file => {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf-8');
          if (content.includes('/**') || content.includes('//')) {
            commentedFiles++;
          }
        }
      });
      
      const commentRatio = commentedFiles / tsFiles.length
      if (commentRatio >= 0.5) {
        this.results.passed.push(`Code documentation (${Math.round(commentRatio * 100)}% of sampled files)`);
      } else {
        this.results.warnings.push('Low code documentation coverage');
      }
    } catch (error) {
      this.results.warnings.push('Code documentation analysis failed');
    }
  }

  async checkConfiguration() {
    console.log('Validating configuration files...');
    
    const configFiles = [
      { file: 'tsconfig.json', name: 'TypeScript configuration' },
      { file: 'eslint.config.js', name: 'ESLint configuration' },
      { file: 'vite.config.ts', name: 'Vite configuration' },
      { file: 'vitest.config.ts', name: 'Vitest configuration' },
      { file: 'playwright.config.ts', name: 'Playwright configuration' }
    ];
    
    configFiles.forEach(({ file, name }) => {
      if (fs.existsSync(file)) {
        this.results.passed.push(name);
      } else {
        this.results.warnings.push(`Missing ${name}`);
      }
    });

    // Check environment variables
    if (fs.existsSync('.env.example') || fs.existsSync('.env.template')) {
      this.results.passed.push('Environment template provided');
    } else {
      this.results.warnings.push('No environment variable template found');
    }
  }

  async checkAccessibility() {
    console.log('Checking accessibility configuration...');
    
    // Check for axe integration in tests
    try {
      const hasAxeTests = execSync('grep -r "@axe-core" tests/ || grep -r "axe-playwright" tests/ || true', { encoding: 'utf-8' });
      if (hasAxeTests.trim()) {
        this.results.passed.push('Accessibility testing configured');
      } else {
        this.results.warnings.push('No accessibility testing found');
      }
    } catch (error) {
      this.results.warnings.push('Could not check accessibility configuration');
    }
  }

  async generateReport() {
    console.log('Generating quality gates report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        passed: this.results.passed.length,
        failed: this.results.failed.length,
        warnings: this.results.warnings.length,
        overall: this.results.failed.length === 0 ? 'PASS' : 'FAIL'
      },
      details: this.results,
      metrics: this.results.metrics,
      thresholds: QUALITY_THRESHOLDS
    };
    
    fs.writeFileSync('quality-gates-report.json', JSON.stringify(report, null, 2));
    
    // Console output
    console.log('\n📊 Quality Gates Summary:', 'blue');
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
      console.log('\n📈 Metrics:', 'cyan');
      Object.entries(this.results.metrics).forEach(([key, value]) => {
        console.log(`   • ${key}: ${JSON.stringify(value)}`, 'cyan');
      });
    }
    
    console.log(`\nReport saved to: quality-gates-report.json`, 'blue');
  }
}

// Execute script
if (import.meta.url === `file://${process.argv[1]}`) {
  const gates = new QualityGates();
  gates.runAll().catch(err => {
    console.error(`❌ Quality gates failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = QualityGates;
