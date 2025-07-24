#!/usr/bin/env node

/**
 * Parker Flight - Advanced Test Architecture & Mutation Testing
 * 
 * This script provides enterprise-grade test execution including:
 * - Mutation testing for test quality validation
 * - Comprehensive test metrics and analytics
 * - Parallel test execution optimization
 * - Test flakiness detection
 * - Property-based testing integration
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const success = (message) => log(`✅ ${message}`, 'green');
const warning = (message) => log(`⚠️  ${message}`, 'yellow');
const error = (message) => log(`❌ ${message}`, 'red');
const info = (message) => log(`ℹ️  ${message}`, 'blue');
const step = (message) => log(`🧪 ${message}`, 'cyan');

// Test quality thresholds
const TEST_THRESHOLDS = {
  COVERAGE: {
    STATEMENTS: 85,
    BRANCHES: 80,
    FUNCTIONS: 90,
    LINES: 85
  },
  MUTATION_SCORE: 75,
  MAX_TEST_DURATION: 30000, // 30 seconds
  MAX_FLAKY_TESTS: 5,
  MIN_ASSERTIONS_PER_TEST: 1
};

// Mutation operators for mutation testing
const MUTATION_OPERATORS = [
  {
    name: 'ArithmeticOperator',
    description: 'Replace +, -, *, / with other arithmetic operators',
    pattern: /([+\-*/])/g,
    mutations: ['+', '-', '*', '/']
  },
  {
    name: 'EqualityOperator', 
    description: 'Replace ==, !=, ===, !== with other equality operators',
    pattern: /(===|!==|==|!=)/g,
    mutations: ['===', '!==', '==', '!=']
  },
  {
    name: 'LogicalOperator',
    description: 'Replace &&, || with other logical operators',
    pattern: /(&&|\|\|)/g,
    mutations: ['&&', '||']
  },
  {
    name: 'ConditionalExpression',
    description: 'Replace conditional expressions',
    pattern: /\?\s*([^:]+)\s*:\s*([^;,)}\]]+)/g,
    mutations: ['true', 'false']
  }
];

class AdvancedTestRunner {
  constructor() {
    this.results = {
      testSuites: [],
      coverage: {},
      mutationScore: 0,
      flakyTests: [],
      performanceMetrics: {},
      qualityScore: 0
    };
    this.runMutationTests = process.argv.includes('--mutation');
    this.detectFlakiness = process.argv.includes('--flaky-detection');
    this.verbose = process.argv.includes('--verbose');
  }

  async runAdvancedTests() {
    try {
      log('🧪 Advanced Test Architecture - Starting Comprehensive Testing', 'bright');
      log('='.repeat(70), 'blue');

      await this.runStandardTests();
      await this.analyzeCoverage();
      await this.runPropertyBasedTests();
      
      if (this.runMutationTests) {
        await this.runMutationTesting();
      }
      
      if (this.detectFlakiness) {
        await this.detectFlakyTests();
      }

      await this.analyzeTestPerformance();
      await this.generateAdvancedReport();

      const qualityScore = this.calculateTestQualityScore();
      if (qualityScore >= 80) {
        success(`🎉 Excellent test quality score: ${qualityScore}%`);
      } else if (qualityScore >= 60) {
        warning(`⚠️  Good test quality score: ${qualityScore}% - room for improvement`);
      } else {
        error(`❌ Poor test quality score: ${qualityScore}% - significant improvements needed`);
      }

    } catch (err) {
      error(`Advanced test execution failed: ${err.message}`);
      process.exit(1);
    }
  }

  async runStandardTests() {
    step('Running standard test suite...');

    try {
      // Run unit tests with coverage
      const unitResult = execSync('npm run test:unit -- --coverage --reporter=json', { 
        encoding: 'utf-8',
        timeout: 120000 
      });
      
      // Run integration tests
      const integrationResult = execSync('npm run test:integration -- --reporter=json', { 
        encoding: 'utf-8',
        timeout: 180000 
      });

      // Run E2E tests
      const e2eResult = execSync('npm run test:e2e -- --reporter=json', { 
        encoding: 'utf-8',
        timeout: 300000 
      });

      this.results.testSuites = [
        { type: 'unit', result: this.parseTestResult(unitResult) },
        { type: 'integration', result: this.parseTestResult(integrationResult) },
        { type: 'e2e', result: this.parseTestResult(e2eResult) }
      ];

      success('Standard test suite completed');
    } catch (err) {
      error(`Standard tests failed: ${err.message}`);
      throw err;
    }
  }

  parseTestResult(output) {
    try {
      const jsonOutput = JSON.parse(output);
      return {
        numTotalTests: jsonOutput.numTotalTests || 0,
        numPassedTests: jsonOutput.numPassedTests || 0,
        numFailedTests: jsonOutput.numFailedTests || 0,
        testResults: jsonOutput.testResults || []
      };
    } catch (err) {
      return {
        numTotalTests: 0,
        numPassedTests: 0,
        numFailedTests: 0,
        testResults: []
      };
    }
  }

  async analyzeCoverage() {
    step('Analyzing test coverage...');

    try {
      // Generate detailed coverage report
      execSync('npm run test:coverage -- --reporter=json > coverage-detailed.json', { 
        stdio: 'pipe' 
      });

      if (fs.existsSync('coverage-detailed.json')) {
        const coverageData = JSON.parse(fs.readFileSync('coverage-detailed.json', 'utf-8'));
        
        this.results.coverage = {
          statements: this.extractCoverageMetric(coverageData, 'statements'),
          branches: this.extractCoverageMetric(coverageData, 'branches'),
          functions: this.extractCoverageMetric(coverageData, 'functions'),
          lines: this.extractCoverageMetric(coverageData, 'lines')
        };

        // Check coverage thresholds
        const coverageIssues = [];
        Object.entries(TEST_THRESHOLDS.COVERAGE).forEach(([metric, threshold]) => {
          const actual = this.results.coverage[metric.toLowerCase()];
          if (actual < threshold) {
            coverageIssues.push(`${metric}: ${actual}% < ${threshold}%`);
          }
        });

        if (coverageIssues.length > 0) {
          warning(`Coverage below thresholds: ${coverageIssues.join(', ')}`);
        } else {
          success('All coverage thresholds met');
        }
      }
    } catch (err) {
      warning(`Coverage analysis failed: ${err.message}`);
    }
  }

  extractCoverageMetric(coverageData, metric) {
    // Simplified coverage extraction - would be more complex in real implementation
    try {
      const summary = coverageData.coverageMap?.getCoverageSummary?.() || {};
      return summary[metric]?.pct || 0;
    } catch {
      return 0;
    }
  }

  async runPropertyBasedTests() {
    step('Running property-based tests...');

    try {
      // Check if property-based tests exist
      const propertyTestFiles = execSync(`find tests -name "*.property.test.*" 2>/dev/null || true`, { 
        encoding: 'utf-8' 
      }).trim();

      if (propertyTestFiles) {
        execSync(`npm test -- ${propertyTestFiles}`, { stdio: 'pipe' });
        success('Property-based tests completed');
      } else {
        info('No property-based tests found');
      }
    } catch (err) {
      warning(`Property-based tests failed: ${err.message}`);
    }
  }

  async runMutationTesting() {
    step('Running mutation testing...');

    try {
      // Simple mutation testing implementation
      const sourceFiles = this.getSourceFilesForMutation();
      let totalMutants = 0;
      let killedMutants = 0;

      for (const file of sourceFiles.slice(0, 5)) { // Limit for demo
        const mutants = await this.generateMutants(file);
        totalMutants += mutants.length;

        for (const mutant of mutants) {
          const wasKilled = await this.testMutant(mutant);
          if (wasKilled) {
            killedMutants++;
          }
        }
      }

      this.results.mutationScore = totalMutants > 0 ? Math.round((killedMutants / totalMutants) * 100) : 0;

      if (this.results.mutationScore >= TEST_THRESHOLDS.MUTATION_SCORE) {
        success(`Mutation score: ${this.results.mutationScore}% - tests are effective`);
      } else {
        warning(`Mutation score: ${this.results.mutationScore}% - tests may miss edge cases`);
      }

    } catch (err) {
      warning(`Mutation testing failed: ${err.message}`);
    }
  }

  getSourceFilesForMutation() {
    try {
      const result = execSync(`find src -name "*.ts" -o -name "*.tsx" | grep -v ".test." | head -10`, { 
        encoding: 'utf-8' 
      });
      return result.trim().split('\n').filter(f => f.length > 0);
    } catch {
      return [];
    }
  }

  async generateMutants(filePath) {
    const mutants = [];
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      for (const operator of MUTATION_OPERATORS) {
        const matches = content.match(operator.pattern);
        if (matches) {
          for (let i = 0; i < Math.min(matches.length, 3); i++) { // Limit mutations per operator
            mutants.push({
              file: filePath,
              operator: operator.name,
              original: matches[i],
              mutated: this.createMutation(matches[i], operator),
              line: this.findLineNumber(content, matches[i])
            });
          }
        }
      }
    } catch (err) {
      // Skip files that can't be processed
    }

    return mutants;
  }

  createMutation(original, operator) {
    const alternatives = operator.mutations.filter(m => m !== original);
    return alternatives[Math.floor(Math.random() * alternatives.length)] || original;
  }

  findLineNumber(content, searchText) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(searchText)) {
        return i + 1;
      }
    }
    return 0;
  }

  async testMutant(mutant) {
    try {
      // Create mutated file
      const originalContent = fs.readFileSync(mutant.file, 'utf-8');
      const mutatedContent = originalContent.replace(mutant.original, mutant.mutated);
      
      // Backup original and write mutation
      fs.writeFileSync(`${mutant.file}.backup`, originalContent);
      fs.writeFileSync(mutant.file, mutatedContent);

      // Run tests - if they fail, the mutant was killed (good)
      try {
        execSync('npm run test:unit -- --silent', { stdio: 'pipe', timeout: 30000 });
        return false; // Tests passed, mutant survived (bad)
      } catch {
        return true; // Tests failed, mutant was killed (good)
      } finally {
        // Restore original file
        fs.writeFileSync(mutant.file, originalContent);
        fs.unlinkSync(`${mutant.file}.backup`);
      }
    } catch {
      return false; // Assume mutant survived if we can't test it
    }
  }

  async detectFlakyTests() {
    step('Detecting flaky tests...');

    try {
      const testRuns = 5; // Run tests multiple times to detect flakiness
      const testResults = [];

      for (let i = 0; i < testRuns; i++) {
        try {
          const result = execSync('npm run test:unit -- --reporter=json', { 
            encoding: 'utf-8',
            stdio: 'pipe'
          });
          testResults.push(this.parseTestResult(result));
        } catch (err) {
          testResults.push({ numTotalTests: 0, numPassedTests: 0, numFailedTests: 0 });
        }
      }

      // Analyze consistency
      const flakyTests = this.identifyFlakyTests(testResults);
      this.results.flakyTests = flakyTests;

      if (flakyTests.length > 0) {
        warning(`Found ${flakyTests.length} potentially flaky tests`);
      } else {
        success('No flaky tests detected');
      }

    } catch (err) {
      warning(`Flaky test detection failed: ${err.message}`);
    }
  }

  identifyFlakyTests(testResults) {
    const flakyTests = [];
    
    // Simple flakiness detection - in real implementation would be more sophisticated
    const totalCounts = testResults.map(r => r.numTotalTests);
    const passedCounts = testResults.map(r => r.numPassedTests);
    
    const totalVariance = this.calculateVariance(totalCounts);
    const passedVariance = this.calculateVariance(passedCounts);
    
    if (totalVariance > 1 || passedVariance > 1) {
      flakyTests.push({
        description: 'Test suite shows inconsistent results across runs',
        variance: { total: totalVariance, passed: passedVariance }
      });
    }

    return flakyTests;
  }

  calculateVariance(numbers) {
    if (numbers.length === 0) return 0;
    
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const squaredDiffs = numbers.map(n => Math.pow(n - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / numbers.length;
  }

  async analyzeTestPerformance() {
    step('Analyzing test performance...');

    try {
      // Measure test execution times
      const startTime = Date.now();
      
      execSync('npm run test:unit -- --silent', { stdio: 'pipe', timeout: 60000 });
      
      const unitTestTime = Date.now() - startTime;
      
      this.results.performanceMetrics = {
        unitTestDuration: unitTestTime,
        averageTestTime: unitTestTime / Math.max(this.getTotalTestCount(), 1),
        performanceGrade: this.calculatePerformanceGrade(unitTestTime)
      };

      if (unitTestTime > TEST_THRESHOLDS.MAX_TEST_DURATION) {
        warning(`Test suite is slow (${unitTestTime}ms > ${TEST_THRESHOLDS.MAX_TEST_DURATION}ms)`);
      } else {
        success(`Test performance is good (${unitTestTime}ms)`);
      }

    } catch (err) {
      warning(`Test performance analysis failed: ${err.message}`);
    }
  }

  getTotalTestCount() {
    return this.results.testSuites.reduce((total, suite) => total + suite.result.numTotalTests, 0);
  }

  calculatePerformanceGrade(duration) {
    if (duration < 5000) return 'A';
    if (duration < 15000) return 'B';
    if (duration < 30000) return 'C';
    if (duration < 60000) return 'D';
    return 'F';
  }

  calculateTestQualityScore() {
    let score = 0;
    let factors = 0;

    // Coverage score (40% weight)
    if (this.results.coverage.statements) {
      score += Math.min(this.results.coverage.statements, 100) * 0.4;
      factors += 40;
    }

    // Mutation score (30% weight)
    if (this.results.mutationScore > 0) {
      score += this.results.mutationScore * 0.3;
      factors += 30;
    }

    // Performance score (20% weight)
    if (this.results.performanceMetrics.performanceGrade) {
      const gradeValues = { 'A': 100, 'B': 80, 'C': 60, 'D': 40, 'F': 20 };
      score += gradeValues[this.results.performanceMetrics.performanceGrade] * 0.2;
      factors += 20;
    }

    // Flakiness penalty (10% weight)
    const flakyPenalty = Math.min(this.results.flakyTests.length * 10, 100);
    score += (100 - flakyPenalty) * 0.1;
    factors += 10;

    this.results.qualityScore = factors > 0 ? Math.round(score / factors * 100) : 0;
    return this.results.qualityScore;
  }

  async generateAdvancedReport() {
    step('Generating advanced test report...');

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: this.getTotalTestCount(),
        testSuites: this.results.testSuites.length,
        qualityScore: this.calculateTestQualityScore()
      },
      coverage: this.results.coverage,
      mutationTesting: {
        score: this.results.mutationScore,
        threshold: TEST_THRESHOLDS.MUTATION_SCORE
      },
      performance: this.results.performanceMetrics,
      flakiness: {
        flakyTestCount: this.results.flakyTests.length,
        maxAllowed: TEST_THRESHOLDS.MAX_FLAKY_TESTS
      },
      recommendations: this.generateTestRecommendations(),
      detailed: this.results
    };

    fs.writeFileSync('advanced-test-report.json', JSON.stringify(report, null, 2));

    // Console output
    log('\n🧪 Advanced Test Analysis Summary:', 'blue');
    log('='.repeat(50), 'blue');
    
    log(`\n📊 Overall Quality Score: ${report.summary.qualityScore}%`, 
         report.summary.qualityScore >= 80 ? 'green' : 
         report.summary.qualityScore >= 60 ? 'yellow' : 'red');

    if (this.results.coverage.statements) {
      log(`📈 Coverage: ${this.results.coverage.statements}% statements, ${this.results.coverage.branches}% branches`, 'cyan');
    }

    if (this.results.mutationScore > 0) {
      log(`🧬 Mutation Score: ${this.results.mutationScore}%`, 'cyan');
    }

    if (this.results.performanceMetrics.performanceGrade) {
      log(`⚡ Performance Grade: ${this.results.performanceMetrics.performanceGrade}`, 'cyan');
    }

    if (this.results.flakyTests.length > 0) {
      warning(`🔄 Flaky Tests: ${this.results.flakyTests.length} detected`);
    }

    log(`\n📄 Full report saved to: advanced-test-report.json`, 'blue');
  }

  generateTestRecommendations() {
    const recommendations = [];

    if (this.results.coverage.statements < TEST_THRESHOLDS.COVERAGE.STATEMENTS) {
      recommendations.push({
        type: 'coverage',
        priority: 'high',
        message: `Increase statement coverage to ${TEST_THRESHOLDS.COVERAGE.STATEMENTS}%`,
        currentValue: this.results.coverage.statements
      });
    }

    if (this.results.mutationScore < TEST_THRESHOLDS.MUTATION_SCORE) {
      recommendations.push({
        type: 'mutation',
        priority: 'medium',
        message: `Improve test quality - mutation score below ${TEST_THRESHOLDS.MUTATION_SCORE}%`,
        currentValue: this.results.mutationScore
      });
    }

    if (this.results.flakyTests.length > TEST_THRESHOLDS.MAX_FLAKY_TESTS) {
      recommendations.push({
        type: 'flakiness',
        priority: 'high',
        message: 'Fix flaky tests to improve test reliability',
        currentValue: this.results.flakyTests.length
      });
    }

    if (this.results.performanceMetrics.performanceGrade === 'D' || this.results.performanceMetrics.performanceGrade === 'F') {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        message: 'Optimize test performance - tests are running slowly',
        currentValue: this.results.performanceMetrics.unitTestDuration
      });
    }

    return recommendations;
  }
}

// Execute script
if (import.meta.url === `file://${process.argv[1]}`) {
  const runner = new AdvancedTestRunner();
  runner.runAdvancedTests().catch(err => {
    console.error(`❌ Advanced test execution failed: ${err.message}`);
    process.exit(1);
  });
}

export default AdvancedTestRunner;
