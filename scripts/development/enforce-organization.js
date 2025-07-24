#!/usr/bin/env node

/**
 * Parker Flight - Repository Organization Enforcement Script
 * 
 * This script validates that files are placed according to the
 * REPOSITORY_ORGANIZATION_GUIDELINES.md and suggests corrections.
 */

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

// Utility functions
const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const success = (message) => log(`✅ ${message}`, 'green');
const warning = (message) => log(`⚠️  ${message}`, 'yellow');
const error = (message) => log(`❌ ${message}`, 'red');
const info = (message) => log(`ℹ️  ${message}`, 'blue');
const step = (message) => log(`🔍 ${message}`, 'cyan');

// File placement rules based on REPOSITORY_ORGANIZATION_GUIDELINES.md
const PLACEMENT_RULES = {
  // Root directory - only essential project files
  ROOT_ALLOWED: [
    'README.md',
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'vite.config.ts',
    'vitest.config.ts',
    'playwright.config.ts',
    'tailwind.config.ts',
    'postcss.config.js',
    'eslint.config.js',
    '.env*',
    '.gitignore',
    '.github',
    'LICENSE',
    'components.json',
    'netlify.toml',
    'vercel.json',
    'Dockerfile',
    'docker-compose*.yml',
    'pnpm-lock.yaml',
    'bun.lockb',
    'deno.lock'
  ],

  // Documentation patterns
  DOCS_PATTERNS: {
    'OPERATIONS_RUNBOOK.md': 'docs/deployment/OPERATIONS_RUNBOOK.md',
    '*_DEPLOYMENT*.md': 'docs/deployment/',
    '*_SECURITY*.md': 'docs/security/',
    '*_MONITORING*.md': 'docs/monitoring/',
    '*_PERFORMANCE*.md': 'docs/performance/',
    '*_RESEARCH*.md': 'docs/research/',
    '*_API*.md': 'docs/api/',
    '*_GUIDE*.md': 'docs/guides/',
    '*_IMPLEMENTATION*.md': 'docs/development/',
    '*_PLAYBOOK*.md': 'docs/development/',
    '*_ANALYSIS*.md': 'docs/research/',
    '*_STUDY*.md': 'docs/research/',
    '*_REPORT*.md': 'docs/research/',
    '*_CHECKLIST*.md': 'docs/development/',
    '*_PLAN*.md': 'docs/development/',
    '*_STATUS*.md': 'docs/deployment/',
    '*_SUMMARY*.md': 'docs/deployment/',
    '*_COMPLETE*.md': 'docs/deployment/'
  },

  // Script patterns
  SCRIPT_PATTERNS: {
    '*deploy*.js': 'scripts/deployment/',
    '*deploy*.sh': 'scripts/deployment/',
    '*rollback*.js': 'scripts/deployment/',
    '*monitor*.js': 'scripts/monitoring/',
    '*monitor*.sh': 'scripts/monitoring/',
    '*security*.js': 'scripts/security/',
    '*security*.ts': 'scripts/security/',
    '*backup*.sh': 'scripts/backup/',
    '*test*.js': 'scripts/testing/',
    '*load-test*.js': 'scripts/performance/',
    '*performance*.js': 'scripts/performance/',
    '*analytics*.js': 'scripts/analytics/',
    '*credential*.ts': 'scripts/security/'
  }
};

class OrganizationEnforcer {
  constructor() {
    this.issues = [];
    this.suggestions = [];
    this.autoFix = process.argv.includes('--fix');
    this.verbose = process.argv.includes('--verbose');
  }

  async enforce() {
    try {
      log('🌟 Repository Organization Enforcement Started', 'bright');
      log('='.repeat(60), 'blue');
      
      await this.scanRootDirectory();
      await this.validateFileStructure();
      await this.generateReport();
      
      const issueCount = this.issues.length;
      if (issueCount === 0) {
        success('🎉 Repository organization is perfect!');
      } else {
        warning(`Found ${issueCount} organization issues`);
        if (this.autoFix) {
          await this.applyFixes();
        } else {
          info('Run with --fix to automatically correct issues');
        }
      }
      
    } catch (err) {
      error(`Organization enforcement failed: ${err.message}`);
      process.exit(1);
    }
  }

  async scanRootDirectory() {
    step('Scanning root directory for misplaced files...');
    
    const rootFiles = fs.readdirSync('.');
    
    for (const file of rootFiles) {
      const filePath = path.join('.', file);
      const stat = fs.statSync(filePath);
      
      if (stat.isFile() && this.shouldBeMovedFromRoot(file)) {
        const suggestedPath = this.getSuggestedPath(file);
        this.issues.push({
          type: 'misplaced_root_file',
          current: file,
          suggested: suggestedPath,
          reason: 'Root should only contain essential project files'
        });
      }
    }
  }

  shouldBeMovedFromRoot(filename) {
    // Skip files that are allowed in root
    for (const allowed of PLACEMENT_RULES.ROOT_ALLOWED) {
      if (this.matchesPattern(filename, allowed)) {
        return false;
      }
    }
    
    // Check if it's a documentation file that should be moved
    if (filename.endsWith('.md') && filename !== 'README.md') {
      return true;
    }
    
    // Check if it's a script file that should be moved
    if ((filename.endsWith('.js') || filename.endsWith('.sh') || filename.endsWith('.ts')) 
        && !filename.startsWith('.')) {
      return true;
    }
    
    return false;
  }

  getSuggestedPath(filename) {
    // Check documentation patterns
    for (const [pattern, suggestedDir] of Object.entries(PLACEMENT_RULES.DOCS_PATTERNS)) {
      if (this.matchesPattern(filename, pattern)) {
        if (pattern === filename) {
          return suggestedDir; // Exact match
        }
        return path.join(suggestedDir, filename);
      }
    }
    
    // Check script patterns
    for (const [pattern, suggestedDir] of Object.entries(PLACEMENT_RULES.SCRIPT_PATTERNS)) {
      if (this.matchesPattern(filename, pattern)) {
        return path.join(suggestedDir, filename);
      }
    }
    
    // Default placements
    if (filename.endsWith('.md')) {
      return path.join('docs/general', filename);
    }
    
    if (filename.endsWith('.js') || filename.endsWith('.sh') || filename.endsWith('.ts')) {
      return path.join('scripts/utils', filename);
    }
    
    return path.join('docs/legacy', filename);
  }

  matchesPattern(filename, pattern) {
    if (pattern === filename) return true;
    
    // Handle wildcard patterns
    if (pattern.includes('*')) {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$', 'i');
      return regex.test(filename);
    }
    
    return false;
  }

  async validateFileStructure() {
    step('Validating overall file structure...');
    
    // Check for proper directory structure
    const requiredDirs = [
      'src',
      'tests', 
      'docs',
      'scripts',
      'database'
    ];
    
    for (const dir of requiredDirs) {
      if (!fs.existsSync(dir)) {
        this.issues.push({
          type: 'missing_directory',
          current: null,
          suggested: dir,
          reason: `Required directory ${dir} is missing`
        });
      }
    }
    
    // Check for duplicate test directories
    if (fs.existsSync('src/tests') && fs.existsSync('tests')) {
      this.issues.push({
        type: 'duplicate_structure',
        current: 'src/tests',
        suggested: 'tests',
        reason: 'Tests should be in root-level tests/ directory, not src/tests/'
      });
    }
  }

  async generateReport() {
    step('Generating organization report...');
    
    if (this.issues.length === 0) {
      success('No organization issues found!');
      return;
    }
    
    log('\n📋 Organization Issues Found:', 'yellow');
    log('='.repeat(40), 'yellow');
    
    this.issues.forEach((issue, index) => {
      log(`\n${index + 1}. ${issue.type.replace(/_/g, ' ').toUpperCase()}`, 'red');
      if (issue.current) {
        info(`   Current: ${issue.current}`);
      }
      info(`   Suggested: ${issue.suggested}`);
      log(`   Reason: ${issue.reason}`, 'magenta');
    });
    
    if (this.verbose) {
      log('\n📁 Recommended Directory Structure:', 'blue');
      log('='.repeat(40), 'blue');
      this.showRecommendedStructure();
    }
  }

  showRecommendedStructure() {
    const structure = `
├── src/                    # Application source code
├── tests/                  # All test files
├── docs/                   # Documentation
│   ├── deployment/         # Deployment docs & runbooks
│   ├── development/        # Development guides
│   ├── security/           # Security documentation
│   ├── monitoring/         # Monitoring & observability
│   ├── research/           # Research & analysis
│   └── api/                # API documentation
├── scripts/                # Automation scripts
│   ├── deployment/         # Deployment scripts
│   ├── monitoring/         # Monitoring scripts
│   ├── security/           # Security scripts
│   └── development/        # Development utilities
├── database/               # Database files
└── infra/                  # Infrastructure as code
    `;
    
    log(structure, 'cyan');
  }

  async applyFixes() {
    step('Applying automatic fixes...');
    
    for (const issue of this.issues) {
      try {
        await this.applyFix(issue);
        success(`Fixed: ${issue.current} → ${issue.suggested}`);
      } catch (err) {
        error(`Failed to fix ${issue.current}: ${err.message}`);
      }
    }
    
    await this.updateReferences();
  }

  async applyFix(issue) {
    switch (issue.type) {
      case 'misplaced_root_file':
        await this.moveFile(issue.current, issue.suggested);
        break;
      case 'missing_directory':
        await this.createDirectory(issue.suggested);
        break;
      case 'duplicate_structure':
        await this.consolidateDirectories(issue.current, issue.suggested);
        break;
    }
  }

  async moveFile(source, destination) {
    // Ensure destination directory exists
    const destDir = path.dirname(destination);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Move the file
    fs.renameSync(source, destination);
  }

  async createDirectory(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  async consolidateDirectories(source, destination) {
    // Handle src/tests → tests consolidation specifically
    if (source === 'src/tests' && destination === 'tests') {
      try {
        // The src/tests directory should be consolidated into root tests/
        // Since both exist, we need to warn that manual consolidation may be needed
        warning(`Both src/tests and tests directories exist.`);
        info(`Please manually review and consolidate test files as needed.`);
        info(`Consider removing src/tests after moving any unique files to tests/.`);
      } catch (err) {
        error(`Failed to consolidate ${source}: ${err.message}`);
      }
    } else {
      warning(`Manual intervention required for: ${source} → ${destination}`);
    }
  }

  async updateReferences() {
    step('Updating file references...');
    
    // This would scan package.json, imports, etc. and update paths
    // For now, just warn about manual updates needed
    warning('Please manually update any references to moved files in:');
    info('  - package.json scripts');
    info('  - Import statements');
    info('  - Configuration files');
    info('  - Documentation links');
  }
}

// Execute script
if (import.meta.url === `file://${process.argv[1]}`) {
  const enforcer = new OrganizationEnforcer();
  enforcer.enforce().catch(err => {
    console.error(`❌ Organization enforcement failed: ${err.message}`);
    process.exit(1);
  });
}

export default OrganizationEnforcer;
