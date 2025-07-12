#!/usr/bin/env node

/**
 * Business Rules Audit Script
 * 
 * Systematically extracts all hardcoded business rules from the codebase
 * Outputs structured data for migration planning
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Business rule patterns to search for
const RULE_PATTERNS = [
  // Flight search rules
  { pattern: 'nonstop_required.*true', category: 'flight-search', priority: 'high' },
  { pattern: 'round.trip.*true', category: 'flight-search', priority: 'high' },
  { pattern: 'forceRoundTrip', category: 'flight-search', priority: 'high' },
  { pattern: 'always.*round', category: 'flight-search', priority: 'medium' },
  
  // UI visibility rules
  { pattern: 'showAdvancedFilters', category: 'ui', priority: 'medium' },
  { pattern: 'showBudgetSection', category: 'ui', priority: 'medium' },
  { pattern: 'hiddenFields', category: 'ui', priority: 'low' },
  
  // Validation rules
  { pattern: 'min_duration.*[0-9]+', category: 'validation', priority: 'medium' },
  { pattern: 'max_duration.*[0-9]+', category: 'validation', priority: 'medium' },
  { pattern: 'max_price.*[0-9]+', category: 'validation', priority: 'high' },
  
  // Filter configuration
  { pattern: 'addFilter\\(new.*Filter', category: 'filters', priority: 'high' },
  { pattern: 'FilterFactory', category: 'filters', priority: 'high' },
  
  // Auto-booking rules
  { pattern: 'auto_book_enabled', category: 'auto-booking', priority: 'high' },
  { pattern: 'payment.*required', category: 'auto-booking', priority: 'high' },
];

// File patterns to include in search
const INCLUDE_PATTERNS = [
  'src/**/*.tsx',
  'src/**/*.ts',
  'supabase/functions/**/*.ts',
];

// File patterns to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  'dist',
  '*.test.*',
  '*.spec.*',
  '*.d.ts',
];

async function searchPattern(pattern, category, priority) {
  try {
    const { stdout } = await execAsync(
      `grep -r -n --include="*.ts" --include="*.tsx" --exclude-dir="node_modules" --exclude-dir="dist" "${pattern}" src/ supabase/functions/ || true`
    );
    
    const matches = stdout.trim().split('\n').filter(line => line.length > 0);
    
    return matches.map(match => {
      const [filePath, lineNumber, ...contentParts] = match.split(':');
      return {
        category,
        priority,
        pattern,
        filePath: filePath.trim(),
        lineNumber: parseInt(lineNumber) || 1,
        content: contentParts.join(':').trim(),
        timestamp: new Date().toISOString(),
      };
    });
  } catch (error) {
    console.warn(`Warning: Could not search pattern "${pattern}":`, error.message);
    return [];
  }
}

async function auditBusinessRules() {
  console.log('🔍 Starting business rules audit...\n');
  
  const allFindings = [];
  
  for (const { pattern, category, priority } of RULE_PATTERNS) {
    console.log(`Searching for ${category} rules: ${pattern}`);
    const findings = await searchPattern(pattern, category, priority);
    allFindings.push(...findings);
  }
  
  // Group findings by category and file
  const summary = {
    totalFindings: allFindings.length,
    byCategory: {},
    byFile: {},
    byPriority: {},
    recommendations: [],
  };
  
  allFindings.forEach(finding => {
    // By category
    if (!summary.byCategory[finding.category]) {
      summary.byCategory[finding.category] = [];
    }
    summary.byCategory[finding.category].push(finding);
    
    // By file
    if (!summary.byFile[finding.filePath]) {
      summary.byFile[finding.filePath] = [];
    }
    summary.byFile[finding.filePath].push(finding);
    
    // By priority
    if (!summary.byPriority[finding.priority]) {
      summary.byPriority[finding.priority] = [];
    }
    summary.byPriority[finding.priority].push(finding);
  });
  
  // Generate recommendations
  const highPriorityFiles = Object.entries(summary.byFile)
    .filter(([file, findings]) => findings.some(f => f.priority === 'high'))
    .map(([file, findings]) => ({ file, count: findings.length }))
    .sort((a, b) => b.count - a.count);
  
  summary.recommendations = [
    {
      type: 'migration-order',
      title: 'Recommended Migration Order',
      items: highPriorityFiles.slice(0, 5).map(({ file, count }) => 
        `${file} (${count} rules found)`
      ),
    },
    {
      type: 'complexity-assessment',
      title: 'Complexity Assessment',
      items: [
        `High Priority Rules: ${summary.byPriority.high?.length || 0}`,
        `Medium Priority Rules: ${summary.byPriority.medium?.length || 0}`,
        `Low Priority Rules: ${summary.byPriority.low?.length || 0}`,
      ],
    },
    {
      type: 'risk-assessment',
      title: 'Risk Assessment',
      items: Object.entries(summary.byCategory).map(([category, findings]) =>
        `${category}: ${findings.length} rules (${findings.filter(f => f.priority === 'high').length} critical)`
      ),
    },
  ];
  
  // Write detailed report
  const reportPath = path.join(process.cwd(), 'docs/business-rules-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    metadata: {
      auditDate: new Date().toISOString(),
      version: '1.0.0',
      totalFiles: Object.keys(summary.byFile).length,
    },
    summary,
    allFindings,
  }, null, 2));
  
  // Write human-readable summary
  const summaryPath = path.join(process.cwd(), 'docs/business-rules-audit-summary.md');
  const summaryContent = generateMarkdownSummary(summary);
  fs.writeFileSync(summaryPath, summaryContent);
  
  console.log('\n✅ Audit complete!');
  console.log(`📊 Found ${allFindings.length} business rules across ${Object.keys(summary.byFile).length} files`);
  console.log(`📄 Detailed report: ${reportPath}`);
  console.log(`📋 Summary report: ${summaryPath}`);
  
  return summary;
}

function generateMarkdownSummary(summary) {
  return `# Business Rules Audit Summary

## Overview
- **Total Rules Found**: ${summary.totalFindings}
- **Files Affected**: ${Object.keys(summary.byFile).length}
- **High Priority Rules**: ${summary.byPriority.high?.length || 0}

## Rules by Category
${Object.entries(summary.byCategory).map(([category, findings]) => 
  `- **${category}**: ${findings.length} rules`
).join('\n')}

## High Priority Files (Top 10)
${Object.entries(summary.byFile)
  .filter(([file, findings]) => findings.some(f => f.priority === 'high'))
  .sort(([,a], [,b]) => b.length - a.length)
  .slice(0, 10)
  .map(([file, findings]) => `1. \`${file}\` - ${findings.length} rules`)
  .join('\n')}

## Recommendations
${summary.recommendations.map(rec => `
### ${rec.title}
${rec.items.map(item => `- ${item}`).join('\n')}
`).join('\n')}

## Next Steps
1. Review high-priority files first
2. Create business rules configuration for each category
3. Implement gradual migration using feature flags
4. Test extensively before removing hardcoded rules

*Generated on ${new Date().toISOString()}*
`;
}

// Run the audit
if (require.main === module) {
  auditBusinessRules().catch(console.error);
}

module.exports = { auditBusinessRules, RULE_PATTERNS };
