#!/usr/bin/env node

const path = require('path');

/**
 * MVP Test Summary Generator
 * Provides a quick overview of test coverage and quality metrics
 */

import { execSync } from 'child_process';
const fs = require('fs');
console.log('🧪 MVP Test Quality Summary\n');

// 1. Run test coverage and capture output
console.log('📊 Test Coverage Analysis...');
try {
  const coverageOutput = execSync('npm run test:coverage', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  // Extract key metrics from coverage output
  const lines = coverageOutput.split('\n');
  const coverageLine = lines.find(line => line.includes('All files'));
  
  if (coverageLine) {
    console.log('✅ Coverage:', coverageLine.trim());
  }
} catch {
  console.log('⚠️  Coverage analysis failed - tests may have errors');
}

// 2. Count test files
console.log('\n📁 Test File Analysis...');
const testFiles = [];
const findTestFiles = (dir) => {
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !file.includes('node_modules')) {
        findTestFiles(fullPath);
      } else if (file.endsWith('.test.ts') || file.endsWith('.test.tsx')) {
        testFiles.push(fullPath);
      }
    });
  } catch {
    // Skip directories we can't read
  }

findTestFiles('./src');
console.log(`✅ Found ${testFiles.length} test files`);

// 3. Analyze test quality indicators
console.log('\n🎯 Test Quality Indicators...');

let totalDescribeBlocks = 0;
let totalTestCases = 0;
let hasErrorBoundaries = false;
let hasAccessibilityTests = false;

testFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // Count describe blocks and test cases
    const describes = (content.match(/describe\(/g) || []).length
    const tests = (content.match(/it\(/g) || []).length
    
    totalDescribeBlocks += describes;
    totalTestCases += tests;
    
    // Check for quality indicators
    if (content.includes('error-boundary') || content.includes('ErrorBoundary')) {
      hasErrorBoundaries = true;
    }
    
    if (content.includes('aria-') || content.includes('accessibility') || content.includes('a11y')) {
      hasAccessibilityTests = true;
    }
  } catch {
    // Skip files we can't read
  }
});

console.log(`✅ Test suites: ${totalDescribeBlocks}`);
console.log(`✅ Test cases: ${totalTestCases}`);
console.log(`${hasErrorBoundaries ? '✅' : '⚠️ '} Error boundary testing: ${hasErrorBoundaries ? 'Present' : 'Missing'}`);
console.log(`${hasAccessibilityTests ? '✅' : '⚠️ '} Accessibility testing: ${hasAccessibilityTests ? 'Present' : 'Missing'}`);

// 4. Run quick lint check
console.log('\n🔍 Code Quality Check...');
try {
  execSync('npm run lint -- --max-warnings 0', { stdio: 'pipe' });
  console.log('✅ Linting: Passed');
} catch {
  console.log('⚠️  Linting: Has warnings/errors');
}

// 5. Check for test utilities and helpers
console.log('\n🛠️  Test Infrastructure...');
const hasTestUtils = fs.existsSync('./src/tests/setupTests.ts');
const hasTestHelpers = testFiles.some(file => file.includes('test-utils') || file.includes('helpers'));

console.log(`✅ Test setup: ${hasTestUtils ? 'Configured' : 'Basic'}`);
console.log(`✅ Test helpers: ${hasTestHelpers ? 'Present' : 'Basic'}`);

// 6. MVP Readiness Assessment
console.log('\n🚀 MVP Readiness Assessment');
const checks = [
  testFiles.length >= 5,
  totalTestCases >= 20,
  hasErrorBoundaries,
  hasAccessibilityTests
];

const passedChecks = checks.filter(Boolean).length
const readinessScore = Math.round((passedChecks / checks.length) * 100);

console.log(`📈 Overall Score: ${readinessScore}%`);

if (readinessScore >= 75) {
  console.log('🎉 MVP test quality is EXCELLENT');
} else if (readinessScore >= 50) {
  console.log('👍 MVP test quality is GOOD');
} else {
  console.log('⚠️  MVP test quality needs improvement');
}

console.log('\n📝 Quick Commands:');
console.log('• Run all tests: npm run test');
console.log('• Watch mode: npm run test:watch');
console.log('• Coverage: npm run test:coverage');
console.log('• UI mode: npm run test:ui');
