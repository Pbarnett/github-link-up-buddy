#!/usr/bin/env node

/**
 * Enterprise Code Quality Enforcement
 * 
 * Advanced code quality checks using existing tools:
 * - Cyclomatic complexity analysis
 * - Dead code detection
 * - Architecture violation detection
 * - Performance anti-pattern detection
 * - Security anti-pattern detection
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

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
const step = (message) => log(`🔍 ${message}`, 'cyan');

class EnterpriseCodeQuality {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
      metrics: {}
    };
    this.autoFix = process.argv.includes('--fix');
  }

  async runAll() {
    log('🏗️  Enterprise Code Quality Enforcement', 'bright');
    log('='.repeat(50), 'blue');

    await this.checkComplexity();
    await this.detectDeadCode();
    await this.checkArchitecturalViolations();
    await this.detectPerformanceAntiPatterns();
    await this.detectSecurityAntiPatterns();
    await this.checkCodeDuplication();
    await this.validateImportStructure();
    await this.checkFunctionLength();
    await this.validateNamingConventions();
    await this.checkTypeScriptStrictness();

    await this.generateReport();

    const hasFailures = this.results.failed.length > 0;
    if (hasFailures) {
      error(`❌ Code Quality Failed: ${this.results.failed.length} critical issues`);
      process.exit(1);
    } else {
      success(`🎉 Enterprise Code Quality Standards Met!`);
    }
  }

  async checkComplexity() {
    step('Analyzing cyclomatic complexity...');
    
    try {
      // Use existing TypeScript compiler to analyze complexity
      const tsFiles = this.getTsFiles();
      let highComplexityFiles = 0;
      
      for (const file of tsFiles.slice(0, 20)) { // Sample for performance
        const content = fs.readFileSync(file, 'utf-8');
        const complexity = this.calculateComplexity(content);
        
        if (complexity > 10) {
          highComplexityFiles++;
          this.results.warnings.push(`High complexity in ${file} (${complexity})`);
        }
      }
      
      this.results.metrics.highComplexityFiles = highComplexityFiles;
      
      if (highComplexityFiles === 0) {
        this.results.passed.push('Cyclomatic complexity within limits');
      } else if (highComplexityFiles < 5) {
        this.results.warnings.push(`${highComplexityFiles} files with high complexity`);
      } else {
        this.results.failed.push(`Too many high complexity files: ${highComplexityFiles}`);
      }
    } catch (err) {
      this.results.warnings.push('Complexity analysis failed');
    }
  }

  calculateComplexity(code) {
    // Simple complexity calculation based on control structures
    const patterns = [
      /if\s*\(/g,
      /else\s*if/g,
      /while\s*\(/g,
      /for\s*\(/g,
      /catch\s*\(/g,
      /case\s+/g,
      /&&/g,
      /\|\|/g,
      /\?.*:/g // ternary
    ];
    
    let complexity = 1; // Base complexity
    patterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) complexity += matches.length;
    });
    
    return complexity;
  }

  async detectDeadCode() {
    step('Detecting dead code...');
    
    try {
      // Check for unused exports using TypeScript compiler
      const result = execSync('npx tsc --noEmit --noUnusedLocals --noUnusedParameters 2>&1 || true', { encoding: 'utf-8' });
      
      const unusedLines = result.split('\n').filter(line => 
        line.includes('is declared but never used') || 
        line.includes('is defined but never used')
      );
      
      this.results.metrics.unusedDeclarations = unusedLines.length;
      
      if (unusedLines.length === 0) {
        this.results.passed.push('No unused declarations detected');
      } else if (unusedLines.length < 10) {
        this.results.warnings.push(`${unusedLines.length} unused declarations found`);
      } else {
        this.results.failed.push(`Too many unused declarations: ${unusedLines.length}`);
      }
    } catch (err) {
      this.results.warnings.push('Dead code detection failed');
    }
  }

  async checkArchitecturalViolations() {
    step('Checking architectural violations...');
    
    try {
      const violations = [];
      
      // Check for direct database access from components
      const componentFiles = execSync('find src/components -name "*.ts" -o -name "*.tsx" 2>/dev/null || true', { encoding: 'utf-8' }).trim().split('\n').filter(f => f);
      
      for (const file of componentFiles) {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf-8');
          if (content.includes('supabase.from') || content.includes('createClient')) {
            violations.push(`Direct DB access in component: ${file}`);
          }
        }
      }
      
      // Check for business logic in components
      for (const file of componentFiles) {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf-8');
          if (content.includes('fetch(') && !content.includes('api/')) {
            violations.push(`Direct API calls in component: ${file}`);
          }
        }
      }
      
      this.results.metrics.architecturalViolations = violations.length;
      
      if (violations.length === 0) {
        this.results.passed.push('No architectural violations detected');
      } else {
        violations.forEach(v => this.results.warnings.push(v));
      }
    } catch (err) {
      this.results.warnings.push('Architectural analysis failed');
    }
  }

  async detectPerformanceAntiPatterns() {
    step('Detecting performance anti-patterns...');
    
    try {
      const antiPatterns = [];
      const reactFiles = execSync('find src -name "*.tsx" 2>/dev/null || true', { encoding: 'utf-8' }).trim().split('\n').filter(f => f);
      
      for (const file of reactFiles.slice(0, 50)) { // Sample for performance
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf-8');
          
          // Check for inline object/function creation in JSX
          if (content.match(/\w+={{\s*[^}]+}}/g)) {
            antiPatterns.push(`Inline object creation in ${file}`);
          }
          
          // Check for missing React.memo on components
          if (content.includes('export default function') && !content.includes('React.memo') && !content.includes('memo(')) {
            antiPatterns.push(`Missing memoization in ${file}`);
          }
          
          // Check for array index as key
          if (content.includes('key={index}') || content.includes('key={i}')) {
            antiPatterns.push(`Array index as key in ${file}`);
          }
        }
      }
      
      this.results.metrics.performanceAntiPatterns = antiPatterns.length;
      
      if (antiPatterns.length === 0) {
        this.results.passed.push('No performance anti-patterns detected');
      } else if (antiPatterns.length < 5) {
        antiPatterns.forEach(p => this.results.warnings.push(p));
      } else {
        this.results.failed.push(`Too many performance anti-patterns: ${antiPatterns.length}`);
      }
    } catch (err) {
      this.results.warnings.push('Performance anti-pattern detection failed');
    }
  }

  async detectSecurityAntiPatterns() {
    step('Detecting security anti-patterns...');
    
    try {
      const securityIssues = [];
      const allFiles = this.getTsFiles();
      
      for (const file of allFiles.slice(0, 100)) { // Sample for performance
        const content = fs.readFileSync(file, 'utf-8');
        
        // Check for eval usage
        if (content.includes('eval(')) {
          securityIssues.push(`eval() usage in ${file}`);
        }
        
        // Check for innerHTML without sanitization
        if (content.includes('innerHTML') && !content.includes('DOMPurify')) {
          securityIssues.push(`Unsafe innerHTML in ${file}`);
        }
        
        // Check for document.write
        if (content.includes('document.write')) {
          securityIssues.push(`document.write usage in ${file}`);
        }
        
        // Check for window.open without noopener
        if (content.includes('window.open') && !content.includes('noopener')) {
          securityIssues.push(`Unsafe window.open in ${file}`);
        }
      }
      
      this.results.metrics.securityAntiPatterns = securityIssues.length;
      
      if (securityIssues.length === 0) {
        this.results.passed.push('No security anti-patterns detected');
      } else {
        securityIssues.forEach(issue => this.results.failed.push(issue));
      }
    } catch (err) {
      this.results.warnings.push('Security anti-pattern detection failed');
    }
  }

  async checkCodeDuplication() {
    step('Checking for code duplication...');
    
    try {
      // Simple duplication check using similar function signatures
      const functions = new Map();
      const duplicates = [];
      const tsFiles = this.getTsFiles();
      
      for (const file of tsFiles.slice(0, 50)) {
        const content = fs.readFileSync(file, 'utf-8');
        const functionMatches = content.match(/function\s+(\w+)\s*\([^)]*\)\s*{/g) || [];
        
        functionMatches.forEach(func => {
          const signature = func.replace(/\s+/g, ' ').trim();
          if (functions.has(signature)) {
            duplicates.push(`Duplicate function signature: ${signature}`);
          } else {
            functions.set(signature, file);
          }
        });
      }
      
      this.results.metrics.duplicatedFunctions = duplicates.length;
      
      if (duplicates.length === 0) {
        this.results.passed.push('No code duplication detected');
      } else if (duplicates.length < 3) {
        duplicates.forEach(d => this.results.warnings.push(d));
      } else {
        this.results.failed.push(`Excessive code duplication: ${duplicates.length} cases`);
      }
    } catch (err) {
      this.results.warnings.push('Code duplication analysis failed');
    }
  }

  async validateImportStructure() {
    step('Validating import structure...');
    
    try {
      const importIssues = [];
      const tsFiles = this.getTsFiles();
      
      for (const file of tsFiles.slice(0, 50)) {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        
        let lastImportLine = -1;
        let hasNonImportCode = false;
        
        lines.forEach((line, index) => {
          if (line.trim().startsWith('import ')) {
            if (hasNonImportCode) {
              importIssues.push(`Imports after code in ${file}:${index + 1}`);
            }
            lastImportLine = index;
          } else if (line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('/*')) {
            hasNonImportCode = true;
          }
        });
      }
      
      this.results.metrics.importStructureIssues = importIssues.length;
      
      if (importIssues.length === 0) {
        this.results.passed.push('Import structure is clean');
      } else {
        importIssues.forEach(issue => this.results.warnings.push(issue));
      }
    } catch (err) {
      this.results.warnings.push('Import structure validation failed');
    }
  }

  async checkFunctionLength() {
    step('Checking function length...');
    
    try {
      const longFunctions = [];
      const tsFiles = this.getTsFiles();
      
      for (const file of tsFiles.slice(0, 30)) {
        const content = fs.readFileSync(file, 'utf-8');
        const functions = this.extractFunctions(content);
        
        functions.forEach(func => {
          if (func.lines > 50) {
            longFunctions.push(`Long function in ${file}: ${func.name} (${func.lines} lines)`);
          }
        });
      }
      
      this.results.metrics.longFunctions = longFunctions.length;
      
      if (longFunctions.length === 0) {
        this.results.passed.push('All functions are appropriately sized');
      } else if (longFunctions.length < 5) {
        longFunctions.forEach(f => this.results.warnings.push(f));
      } else {
        this.results.failed.push(`Too many long functions: ${longFunctions.length}`);
      }
    } catch (err) {
      this.results.warnings.push('Function length analysis failed');
    }
  }

  extractFunctions(code) {
    const functions = [];
    const lines = code.split('\n');
    let currentFunction = null;
    let braceCount = 0;
    
    lines.forEach((line, index) => {
      const functionMatch = line.match(/(?:function\s+(\w+)|const\s+(\w+)\s*=.*=>|(\w+)\s*\([^)]*\)\s*{)/);
      
      if (functionMatch && !currentFunction) {
        currentFunction = {
          name: functionMatch[1] || functionMatch[2] || functionMatch[3] || 'anonymous',
          startLine: index,
          lines: 0
        };
        braceCount = (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
      } else if (currentFunction) {
        braceCount += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
        currentFunction.lines++;
        
        if (braceCount === 0) {
          functions.push(currentFunction);
          currentFunction = null;
        }
      }
    });
    
    return functions;
  }

  async validateNamingConventions() {
    step('Validating naming conventions...');
    
    try {
      const namingIssues = [];
      const tsFiles = this.getTsFiles();
      
      for (const file of tsFiles.slice(0, 30)) {
        const content = fs.readFileSync(file, 'utf-8');
        
        // Check component naming (should be PascalCase)
        if (file.includes('/components/')) {
          const componentMatches = content.match(/(?:function|const)\s+([a-z][A-Za-z]*)/g);
          if (componentMatches) {
            componentMatches.forEach(match => {
              const name = match.split(/\s+/)[1];
              if (name && name[0] === name[0].toLowerCase()) {
                namingIssues.push(`Component should be PascalCase: ${name} in ${file}`);
              }
            });
          }
        }
        
        // Check for snake_case in camelCase contexts
        const snakeCaseVars = content.match(/(?:const|let|var)\s+([a-z]+_[a-z_]+)/g);
        if (snakeCaseVars) {
          snakeCaseVars.forEach(match => {
            const name = match.split(/\s+/)[1];
            namingIssues.push(`Use camelCase instead of snake_case: ${name} in ${file}`);
          });
        }
      }
      
      this.results.metrics.namingConventionIssues = namingIssues.length;
      
      if (namingIssues.length === 0) {
        this.results.passed.push('Naming conventions followed');
      } else {
        namingIssues.forEach(issue => this.results.warnings.push(issue));
      }
    } catch (err) {
      this.results.warnings.push('Naming convention validation failed');
    }
  }

  async checkTypeScriptStrictness() {
    step('Checking TypeScript strictness...');
    
    try {
      const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf-8'));
      const strictChecks = {
        'strict': 'Strict mode enabled',
        'noImplicitAny': 'No implicit any',
        'strictNullChecks': 'Strict null checks',
        'noImplicitReturns': 'No implicit returns',
        'strictFunctionTypes': 'Strict function types'
      };
      
      const compilerOptions = tsConfig.compilerOptions || {};
      
      Object.entries(strictChecks).forEach(([option, description]) => {
        if (compilerOptions[option] === true) {
          this.results.passed.push(description);
        } else {
          this.results.warnings.push(`Consider enabling ${option} for better type safety`);
        }
      });
      
      // Check for any types in codebase
      const anyUsage = execSync('grep -r ": any" src/ --include="*.ts" --include="*.tsx" | wc -l || echo 0', { encoding: 'utf-8' }).trim();
      const anyCount = parseInt(anyUsage);
      
      this.results.metrics.anyUsage = anyCount;
      
      if (anyCount === 0) {
        this.results.passed.push('No any types found');
      } else if (anyCount < 10) {
        this.results.warnings.push(`${anyCount} any types found - consider proper typing`);
      } else {
        this.results.failed.push(`Excessive any usage: ${anyCount} occurrences`);
      }
      
    } catch (err) {
      this.results.warnings.push('TypeScript strictness check failed');
    }
  }

  getTsFiles() {
    try {
      const files = execSync('find src -name "*.ts" -o -name "*.tsx" 2>/dev/null || true', { encoding: 'utf-8' })
        .trim()
        .split('\n')
        .filter(f => f && fs.existsSync(f));
      return files;
    } catch (err) {
      return [];
    }
  }

  async generateReport() {
    step('Generating enterprise code quality report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        passed: this.results.passed.length,
        failed: this.results.failed.length,
        warnings: this.results.warnings.length,
        overall: this.results.failed.length === 0 ? 'PASS' : 'FAIL'
      },
      details: this.results,
      metrics: this.results.metrics
    };
    
    fs.writeFileSync('enterprise-code-quality-report.json', JSON.stringify(report, null, 2));
    
    // Console output
    log('\n📊 Enterprise Code Quality Summary:', 'blue');
    log('='.repeat(50), 'blue');
    
    if (this.results.passed.length > 0) {
      log(`\n✅ Passed (${this.results.passed.length}):`, 'green');
      this.results.passed.forEach(item => log(`   • ${item}`, 'green'));
    }
    
    if (this.results.warnings.length > 0) {
      log(`\n⚠️  Warnings (${this.results.warnings.length}):`, 'yellow');
      this.results.warnings.forEach(item => log(`   • ${item}`, 'yellow'));
    }
    
    if (this.results.failed.length > 0) {
      log(`\n❌ Failed (${this.results.failed.length}):`, 'red');
      this.results.failed.forEach(item => log(`   • ${item}`, 'red'));
    }
    
    if (Object.keys(this.results.metrics).length > 0) {
      log('\n📈 Quality Metrics:', 'cyan');
      Object.entries(this.results.metrics).forEach(([key, value]) => {
        log(`   • ${key}: ${value}`, 'cyan');
      });
    }
    
    log(`\nReport saved to: enterprise-code-quality-report.json`, 'blue');
  }
}

// Execute script
if (import.meta.url === `file://${process.argv[1]}`) {
  const enforcer = new EnterpriseCodeQuality();
  enforcer.runAll().catch(err => {
    console.error(`❌ Enterprise code quality check failed: ${err.message}`);
    process.exit(1);
  });
}

export default EnterpriseCodeQuality;
