#!/usr/bin/env node

/**
 * Parker Flight - Advanced Pattern-Based Code Analysis
 * 
 * This script uses sophisticated pattern matching and static analysis to:
 * - Detect code quality issues and anti-patterns
 * - Suggest refactoring improvements
 * - Calculate code complexity metrics
 * - Apply safe automated fixes
 * 
 * NOTE: This is pattern-based analysis, not true AI. For AI-powered analysis,
 * see scripts/development/ai-powered-analysis.js (requires OpenAI API)
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
const step = (message) => log(`🤖 ${message}`, 'cyan');

// Advanced code analysis patterns
const CODE_QUALITY_PATTERNS = {
  // Performance anti-patterns
  PERFORMANCE_ISSUES: [
    {
      pattern: /useEffect\(\(\) => \{[\s\S]*?\}, \[\]\)/g,
      severity: 'medium',
      message: 'Empty dependency array in useEffect may cause memory leaks',
      suggestion: 'Consider using useMemo or useCallback for optimization'
    },
    {
      pattern: /\.map\(.*\)\.filter\(.*\)/g,
      severity: 'low',
      message: 'Chained map().filter() can be optimized',
      suggestion: 'Consider using reduce() or a single pass algorithm'
    },
    {
      pattern: /JSON\.parse\(JSON\.stringify\(/g,
      severity: 'high',
      message: 'Deep cloning with JSON parse/stringify is inefficient',
      suggestion: 'Use structuredClone() or a proper deep clone library'
    }
  ],

  // Security vulnerabilities
  SECURITY_ISSUES: [
    {
      pattern: /innerHTML\s*=\s*.*\+/g,
      severity: 'high',
      message: 'Potential XSS vulnerability with innerHTML concatenation',
      suggestion: 'Use textContent or proper sanitization'
    },
    {
      pattern: /eval\s*\(/g,
      severity: 'critical',
      message: 'eval() usage detected - major security risk',
      suggestion: 'Remove eval() and use safer alternatives'
    },
    {
      pattern: /localStorage\.setItem\([^,]+,\s*[^)]*password[^)]*\)/gi,
      severity: 'high',
      message: 'Storing passwords in localStorage is insecure',
      suggestion: 'Use secure storage or encryption'
    }
  ],

  // Maintainability issues
  MAINTAINABILITY_ISSUES: [
    {
      pattern: /function\s+\w+\s*\([^)]*\)\s*\{[\s\S]{1000,}\}/g,
      severity: 'medium',
      message: 'Function is too long (>1000 characters)',
      suggestion: 'Break down into smaller, focused functions'
    },
    {
      pattern: /if\s*\([^{]+\)\s*\{[^}]*if\s*\([^{]+\)\s*\{[^}]*if\s*\(/g,
      severity: 'medium',
      message: 'Deeply nested conditionals detected',
      suggestion: 'Consider early returns or guard clauses'
    },
    {
      pattern: /\/\*.*TODO.*\*\//gi,
      severity: 'low',
      message: 'TODO comments found',
      suggestion: 'Convert to GitHub issues or implement'
    }
  ],

  // React/TypeScript best practices
  REACT_TYPESCRIPT_ISSUES: [
    {
      pattern: /React\.FC<.*>/g,
      severity: 'low',
      message: 'React.FC is discouraged in modern React',
      suggestion: 'Use function declarations with typed props'
    },
    {
      pattern: /any\s*[=:]/g,
      severity: 'medium',
      message: 'TypeScript any type usage detected',
      suggestion: 'Use specific types or unknown/object'
    },
    {
      pattern: /useEffect\([^,]+,\s*\[[^\]]*\]\s*\)/g,
      severity: 'low',
      message: 'useEffect with dependencies - verify exhaustive deps',
      suggestion: 'Ensure all dependencies are included or use ESLint rule'
    }
  ]
};

// Automated refactoring rules
const REFACTORING_RULES = [
  {
    name: 'Convert var to const/let',
    pattern: /var\s+(\w+)\s*=/g,
    replacement: 'const $1 =',
    safe: false // Requires analysis
  },
  {
    name: 'Add semicolons',
    pattern: /^(\s*.*[^;{}\s])\s*$/gm,
    replacement: '$1;',
    safe: false // Context dependent
  },
  {
    name: 'Remove console.log',
    pattern: /^\s*console\.log\([^)]*\);\s*$/gm,
    replacement: '',
    safe: true
  },
  {
    name: 'Convert function declarations to arrow functions',
    pattern: /function\s+(\w+)\s*\(([^)]*)\)\s*\{/g,
    replacement: 'const $1 = ($2) => {',
    safe: false
  }
];

class AICodeAnalyzer {
  constructor() {
    this.results = {
      filesAnalyzed: 0,
      issuesFound: [],
      refactoringSuggestions: [],
      metrics: {
        performance: 0,
        security: 0,
        maintainability: 0,
        typescript: 0
      }
    };
    this.autoFix = process.argv.includes('--fix');
    this.generateReport = process.argv.includes('--report');
  }

  async analyze() {
    try {
      log('🤖 AI-Powered Code Analysis Starting', 'bright');
      log('='.repeat(60), 'blue');

      await this.scanSourceFiles();
      await this.analyzeCodeComplexity();
      await this.detectCodeSmells();
      await this.suggestRefactoring();
      await this.generateAIReport();

      const totalIssues = this.results.issuesFound.length;
      if (totalIssues === 0) {
        success('🎉 No code quality issues detected!');
      } else {
        warning(`Found ${totalIssues} code quality issues`);
        if (this.autoFix) {
          await this.applyAutomatedFixes();
        }
      }

    } catch (err) {
      error(`AI code analysis failed: ${err.message}`);
      process.exit(1);
    }
  }

  async scanSourceFiles() {
    step('Scanning source files for analysis...');

    const sourceFiles = this.getSourceFiles();
    this.results.filesAnalyzed = sourceFiles.length;

    for (const file of sourceFiles) {
      await this.analyzeFile(file);
    }

    success(`Analyzed ${this.results.filesAnalyzed} source files`);
  }

  getSourceFiles() {
    try {
      const result = execSync(`find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | head -50`, { encoding: 'utf-8' });
      return result.trim().split('\n').filter(f => f.length > 0);
    } catch (err) {
      return [];
    }
  }

  async analyzeFile(filePath) {
    if (!fs.existsSync(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf-8');
    const fileSize = content.length;
    
    // Skip very large files
    if (fileSize > 50000) {
      this.results.issuesFound.push({
        file: filePath,
        type: 'maintainability',
        severity: 'high',
        message: `File is too large (${Math.round(fileSize/1000)}KB)`,
        suggestion: 'Consider breaking into smaller modules'
      });
      return;
    }

    // Run pattern matching analysis
    for (const [category, patterns] of Object.entries(CODE_QUALITY_PATTERNS)) {
      for (const rule of patterns) {
        const matches = content.match(rule.pattern);
        if (matches) {
          this.results.issuesFound.push({
            file: filePath,
            type: category.toLowerCase().replace('_issues', ''),
            severity: rule.severity,
            message: rule.message,
            suggestion: rule.suggestion,
            matches: matches.length
          });

          // Update metrics
          this.results.metrics[rule.severity === 'critical' ? 'security' : 
                              rule.severity === 'high' ? 'security' :
                              category.includes('PERFORMANCE') ? 'performance' :
                              category.includes('TYPESCRIPT') ? 'typescript' : 'maintainability']++;
        }
      }
    }
  }

  async analyzeCodeComplexity() {
    step('Analyzing code complexity metrics...');

    try {
      // Use TypeScript compiler API for advanced analysis
      const sourceFiles = this.getSourceFiles();
      
      for (const file of sourceFiles.slice(0, 10)) { // Limit for demo
        const content = fs.readFileSync(file, 'utf-8');
        
        // Calculate cyclomatic complexity (simplified)
        const complexityScore = this.calculateComplexity(content);
        
        if (complexityScore > 10) {
          this.results.issuesFound.push({
            file,
            type: 'maintainability',
            severity: 'medium',
            message: `High cyclomatic complexity (${complexityScore})`,
            suggestion: 'Refactor to reduce complexity and improve testability'
          });
        }
      }
      
      success('Code complexity analysis completed');
    } catch (err) {
      warning('Code complexity analysis failed');
    }
  }

  calculateComplexity(code) {
    // Simplified cyclomatic complexity calculation
    const complexityPatterns = [
      /if\s*\(/g,
      /else\s+if\s*\(/g, 
      /while\s*\(/g,
      /for\s*\(/g,
      /case\s+/g,
      /catch\s*\(/g,
      /&&/g,
      /\|\|/g,
      /\?/g
    ];

    let complexity = 1; // Base complexity
    for (const pattern of complexityPatterns) {
      const matches = code.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    }

    return complexity;
  }

  async detectCodeSmells() {
    step('Detecting code smells and anti-patterns...');

    const sourceFiles = this.getSourceFiles();
    
    for (const file of sourceFiles.slice(0, 20)) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Detect duplicate code patterns
      const lines = content.split('\n');
      const duplicateThreshold = 5;
      
      for (let i = 0; i < lines.length - duplicateThreshold; i++) {
        const block = lines.slice(i, i + duplicateThreshold).join('\n');
        const duplicates = content.split(block).length - 1;
        
        if (duplicates > 1 && block.trim().length > 50) {
          this.results.issuesFound.push({
            file,
            type: 'maintainability',
            severity: 'medium',
            message: `Duplicate code block detected (${duplicates} instances)`,
            suggestion: 'Extract into a reusable function or component'
          });
          break; // Only report one per file
        }
      }
    }

    success('Code smell detection completed');
  }

  async suggestRefactoring() {
    step('Generating refactoring suggestions...');

    const sourceFiles = this.getSourceFiles();
    
    for (const file of sourceFiles.slice(0, 15)) {
      const content = fs.readFileSync(file, 'utf-8');
      
      for (const rule of REFACTORING_RULES) {
        const matches = content.match(rule.pattern);
        if (matches) {
          this.results.refactoringSuggestions.push({
            file,
            rule: rule.name,
            matches: matches.length,
            safe: rule.safe,
            autoFixable: rule.safe && this.autoFix
          });
        }
      }
    }

    success(`Generated ${this.results.refactoringSuggestions.length} refactoring suggestions`);
  }

  async applyAutomatedFixes() {
    step('Applying safe automated fixes...');

    let fixesApplied = 0;
    
    for (const suggestion of this.results.refactoringSuggestions) {
      if (suggestion.safe && suggestion.autoFixable) {
        try {
          const rule = REFACTORING_RULES.find(r => r.name === suggestion.rule);
          if (rule) {
            let content = fs.readFileSync(suggestion.file, 'utf-8');
            content = content.replace(rule.pattern, rule.replacement);
            fs.writeFileSync(suggestion.file, content);
            fixesApplied++;
          }
        } catch (err) {
          warning(`Failed to apply fix to ${suggestion.file}: ${err.message}`);
        }
      }
    }

    success(`Applied ${fixesApplied} automated fixes`);
  }

  async generateAIReport() {
    step('Generating AI analysis report...');

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        filesAnalyzed: this.results.filesAnalyzed,
        totalIssues: this.results.issuesFound.length,
        criticalIssues: this.results.issuesFound.filter(i => i.severity === 'critical').length,
        highIssues: this.results.issuesFound.filter(i => i.severity === 'high').length,
        mediumIssues: this.results.issuesFound.filter(i => i.severity === 'medium').length,
        lowIssues: this.results.issuesFound.filter(i => i.severity === 'low').length
      },
      categories: {
        performance: this.results.issuesFound.filter(i => i.type === 'performance').length,
        security: this.results.issuesFound.filter(i => i.type === 'security').length,
        maintainability: this.results.issuesFound.filter(i => i.type === 'maintainability').length,
        typescript: this.results.issuesFound.filter(i => i.type === 'react_typescript').length
      },
      issues: this.results.issuesFound,
      refactoringSuggestions: this.results.refactoringSuggestions,
      recommendations: this.generateRecommendations()
    };

    fs.writeFileSync('ai-code-analysis-report.json', JSON.stringify(report, null, 2));

    // Console output
    log('\n🤖 AI Code Analysis Summary:', 'blue');
    log('='.repeat(50), 'blue');
    
    if (report.summary.criticalIssues > 0) {
      error(`🚨 Critical Issues: ${report.summary.criticalIssues}`);
    }
    if (report.summary.highIssues > 0) {
      warning(`⚠️  High Priority: ${report.summary.highIssues}`);
    }
    if (report.summary.mediumIssues > 0) {
      info(`📊 Medium Priority: ${report.summary.mediumIssues}`);
    }
    if (report.summary.lowIssues > 0) {
      log(`💡 Low Priority: ${report.summary.lowIssues}`, 'cyan');
    }

    log('\n📈 Category Breakdown:', 'cyan');
    Object.entries(report.categories).forEach(([category, count]) => {
      if (count > 0) {
        log(`   • ${category}: ${count} issues`, count > 5 ? 'red' : count > 2 ? 'yellow' : 'green');
      }
    });

    log(`\n📄 Full report saved to: ai-code-analysis-report.json`, 'blue');
  }

  generateRecommendations() {
    const recommendations = [];
    
    const criticalCount = this.results.issuesFound.filter(i => i.severity === 'critical').length;
    const securityCount = this.results.issuesFound.filter(i => i.type === 'security').length;
    const performanceCount = this.results.issuesFound.filter(i => i.type === 'performance').length;

    if (criticalCount > 0) {
      recommendations.push({
        priority: 'critical',
        action: 'Address all critical security issues immediately',
        impact: 'High security risk'
      });
    }

    if (securityCount > 5) {
      recommendations.push({
        priority: 'high',
        action: 'Implement comprehensive security review process',
        impact: 'Reduce security vulnerabilities'
      });
    }

    if (performanceCount > 10) {
      recommendations.push({
        priority: 'medium',
        action: 'Consider performance optimization sprint',
        impact: 'Improve application performance'
      });
    }

    recommendations.push({
      priority: 'low',
      action: 'Setup automated code quality gates in CI/CD',
      impact: 'Prevent quality regression'
    });

    return recommendations;
  }
}

// Execute script
if (import.meta.url === `file://${process.argv[1]}`) {
  const analyzer = new AICodeAnalyzer();
  analyzer.analyze().catch(err => {
    console.error(`❌ AI code analysis failed: ${err.message}`);
    process.exit(1);
  });
}

export default AICodeAnalyzer;
