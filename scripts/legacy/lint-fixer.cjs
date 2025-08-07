#!/usr/bin/env node

/**
 * Lint Fixer Script
 * 
 * This script helps systematically fix common ESLint issues by:
 * 1. Running lint and parsing the output
 * 2. Categorizing issues by type and priority
 * 3. Providing automated fixes for common patterns
 * 4. Generating a summary report
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Starting lint issue analysis and fixing...\n');

// Run lint and capture output
let lintOutput = '';
try {
  lintOutput = execSync('npm run lint', { encoding: 'utf8', stdio: 'pipe' });
} catch (error) {
  // ESLint returns non-zero exit code when there are issues
  lintOutput = error.stdout || '';
}

// Parse lint output
const lines = lintOutput.split('\n');
const issues = [];
let currentFile = '';

for (const line of lines) {
  if (line.includes('.tsx') || line.includes('.ts')) {
    const match = line.match(/^(.+\.(tsx?))$/);
    if (match) {
      currentFile = match[1];
      continue;
    }
  }
  
  // Parse issue line format: "  69:6  warning  React Hook useEffect..."
  const issueMatch = line.match(/^\s*(\d+):(\d+)\s+(error|warning)\s+(.+?)\s+([@\w-\/]+)$/);
  if (issueMatch && currentFile) {
    const [, lineNum, colNum, severity, message, ruleId] = issueMatch;
    issues.push({
      file: currentFile.trim(),
      line: parseInt(lineNum),
      column: parseInt(colNum),
      severity,
      message: message.trim(),
      ruleId: ruleId.trim()
    });
  }
}

console.log(`📊 Found ${issues.length} total lint issues\n`);

// Categorize issues
const categories = {};
issues.forEach(issue => {
  const category = issue.ruleId;
  if (!categories[category]) {
    categories[category] = [];
  }
  categories[category].push(issue);
});

// Sort categories by frequency
const sortedCategories = Object.entries(categories)
  .sort(([,a], [,b]) => b.length - a.length);

console.log('📋 Issues by category:');
sortedCategories.forEach(([category, issues]) => {
  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  console.log(`  ${category}: ${issues.length} total (${errorCount} errors, ${warningCount} warnings)`);
});

console.log('\n🔧 Automated fixes available for:');

// Define fixable patterns
const fixablePatterns = {
  '@typescript-eslint/no-unused-vars': {
    description: 'Remove unused imports and variables',
    autoFixable: true,
    priority: 'high'
  },
  '@typescript-eslint/no-explicit-any': {
    description: 'Replace any with proper types',
    autoFixable: false,
    priority: 'high',
    guidance: 'Manual review needed - replace any with specific types'
  },
  '@typescript-eslint/no-empty-object-type': {
    description: 'Replace {} with object or unknown',
    autoFixable: true,
    priority: 'medium'
  },
  'react-hooks/exhaustive-deps': {
    description: 'Fix React Hook dependencies',
    autoFixable: false,
    priority: 'medium',
    guidance: 'Add missing dependencies or add useCallback/useMemo'
  },
  'react-refresh/only-export-components': {
    description: 'Move non-component exports to separate files',
    autoFixable: false,
    priority: 'low',
    guidance: 'Extract constants and utilities to separate files'
  },
  'no-useless-escape': {
    description: 'Remove unnecessary escape characters',
    autoFixable: true,
    priority: 'low'
  },
  'no-control-regex': {
    description: 'Fix regex with control characters',
    autoFixable: false,
    priority: 'medium'
  },
  'no-case-declarations': {
    description: 'Add braces around case declarations',
    autoFixable: true,
    priority: 'medium'
  }
};

sortedCategories.forEach(([category, issues]) => {
  const pattern = fixablePatterns[category];
  if (pattern) {
    const icon = pattern.autoFixable ? '🤖' : '👨‍💻';
    const priority = pattern.priority === 'high' ? '🔥' : pattern.priority === 'medium' ? '⚠️' : '📋';
    console.log(`  ${icon} ${priority} ${category} (${issues.length}): ${pattern.description}`);
    if (pattern.guidance) {
      console.log(`      💡 ${pattern.guidance}`);
    }
  }
});

// Generate issue summary by file
console.log('\n📁 Files with most issues:');
const fileIssues = {};
issues.forEach(issue => {
  const file = issue.file.replace(/^.*\//, ''); // Get filename only
  if (!fileIssues[file]) {
    fileIssues[file] = { errors: 0, warnings: 0, total: 0 };
  }
  fileIssues[file][issue.severity === 'error' ? 'errors' : 'warnings']++;
  fileIssues[file].total++;
});

Object.entries(fileIssues)
  .sort(([,a], [,b]) => b.total - a.total)
  .slice(0, 10)
  .forEach(([file, counts]) => {
    console.log(`  ${file}: ${counts.total} total (${counts.errors} errors, ${counts.warnings} warnings)`);
  });

// Quick fixes for common patterns
console.log('\n🚀 Applying automatic fixes...\n');

let fixCount = 0;

// Fix 1: Replace {} with object in type definitions
const emptyObjectIssues = categories['@typescript-eslint/no-empty-object-type'] || [];
const emptyObjectFiles = [...new Set(emptyObjectIssues.map(i => i.file))];

emptyObjectFiles.forEach(filePath => {
  try {
    const fullPath = path.resolve(filePath);
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      // Replace common empty object patterns
      const replacements = [
        // React Component props
        { from: /Component<{},\s*{}>/g, to: 'Component' },
        { from: /Component<{}>/g, to: 'Component' },
        { from: /FC<{}>/g, to: 'FC' },
        { from: /React\.FC<{}>/g, to: 'React.FC' },
        // Type definitions
        { from: /:\s*{}\s*=/g, to: ': object =' },
        { from: /interface\s+\w+Props\s*{\s*}/g, to: 'interface Props {}' }
      ];
      
      replacements.forEach(({ from, to }) => {
        if (content.match(from)) {
          content = content.replace(from, to);
          modified = true;
        }
      });
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Fixed empty object types in ${filePath}`);
        fixCount++;
      }
    }
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}: ${error.message}`);
  }
});

console.log(`\n🎉 Applied ${fixCount} automatic fixes!`);

// Generate actionable recommendations
console.log('\n📝 Next Steps:');
console.log('1. 🔥 High Priority: Fix @typescript-eslint/no-explicit-any violations');
console.log('   - Replace any with specific types (User, Profile, FormData, etc.)');
console.log('   - Use unknown for truly unknown data');
console.log('   - Add proper interface definitions');

console.log('\n2. ⚠️ Medium Priority: Fix React Hook dependencies');
console.log('   - Add missing dependencies to useEffect/useCallback/useMemo');
console.log('   - Use useCallback for functions passed to dependencies');
console.log('   - Consider extracting stable functions outside components');

console.log('\n3. 📋 Low Priority: Clean up React Fast Refresh issues');
console.log('   - Move constants and utility functions to separate files');
console.log('   - Ensure components are the only default exports');

// Create a detailed report file
const report = {
  timestamp: new Date().toISOString(),
  totalIssues: issues.length,
  categoryCounts: Object.fromEntries(sortedCategories),
  topFiles: Object.entries(fileIssues)
    .sort(([,a], [,b]) => b.total - a.total)
    .slice(0, 20)
    .map(([file, counts]) => ({ file, ...counts })),
  fixesApplied: fixCount,
  issues: issues
};

fs.writeFileSync('lint-report.json', JSON.stringify(report, null, 2));
console.log('\n📊 Detailed report saved to: lint-report.json');

console.log('\n✨ Lint fixing session complete!');
console.log(`📈 Progress: Fixed ${fixCount} issues automatically`);
console.log(`🎯 Remaining: ${issues.length - fixCount} issues need manual attention`);
