const fs = require('fs');

try {
  const auditData = JSON.parse(fs.readFileSync('docs/business-rules-audit-report.json', 'utf8'));
  
  console.log('📊 Analyzing audit results...\n');
  
  const categories = {
    'flightSearch': [],
    'autoBooking': [],
    'ui': [],
    'filters': [],
    'pricing': []
  };
  
  // Categorize findings based on content analysis
  auditData.allFindings.forEach(rule => {
    const content = rule.content.toLowerCase();
    const pattern = rule.pattern.toLowerCase();
    
    if (content.includes('price') || content.includes('budget') || content.includes('amount') || content.includes('cost')) {
      categories.pricing.push(rule);
    } else if (pattern.includes('booking') || content.includes('booking') || content.includes('auto') || content.includes('payment')) {
      categories.autoBooking.push(rule);
    } else if (pattern.includes('trip') || content.includes('round') || content.includes('nonstop') || content.includes('flight')) {
      categories.flightSearch.push(rule);
    } else if (pattern.includes('filter') || content.includes('filter')) {
      categories.filters.push(rule);
    } else {
      categories.ui.push(rule);
    }
  });
  
  const summary = {
    totalRules: auditData.allFindings.length,
    categories,
    priorityFiles: {},
    recommendations: {
      'High Priority': categories.pricing.length + categories.flightSearch.length,
      'Medium Priority': categories.autoBooking.length,
      'Low Priority': categories.ui.length + categories.filters.length
    },
    migrationStrategy: generateMigrationStrategy(categories)
  };
  
  // Identify files by priority
  const fileImpact = {};
  auditData.allFindings.forEach(rule => {
    if (!fileImpact[rule.filePath]) {
      fileImpact[rule.filePath] = { rules: 0, categories: new Set() };
    }
    fileImpact[rule.filePath].rules++;
    fileImpact[rule.filePath].categories.add(rule.category);
  });
  
  summary.priorityFiles = Object.entries(fileImpact)
    .sort(([,a], [,b]) => b.rules - a.rules)
    .slice(0, 10)
    .map(([file, data]) => ({
      file,
      ruleCount: data.rules,
      categories: Array.from(data.categories)
    }));
  
  // Generate markdown analysis
  const analysisContent = `
# Business Rules Analysis Report

## Executive Summary
- **Total Rules Identified**: ${summary.totalRules}
- **Files Requiring Changes**: ${Object.keys(fileImpact).length}
- **Estimated Migration Complexity**: ${getComplexityRating(summary.totalRules)}

## Category Breakdown
${Object.entries(categories).map(([cat, rules]) => `
### ${cat.charAt(0).toUpperCase() + cat.slice(1)}
- **Rule Count**: ${rules.length}
- **Key Files**: ${getTopFiles(rules, 3).join(', ')}
- **Migration Priority**: ${getMigrationPriority(cat)}
`).join('\n')}

## High-Impact Files (Require Immediate Attention)
${summary.priorityFiles.map((file, i) => `
${i + 1}. **${file.file}**
   - Rules: ${file.ruleCount}
   - Categories: ${file.categories.join(', ')}
   - Impact: ${getImpactLevel(file.ruleCount)}
`).join('\n')}

## Migration Strategy Recommendations
${summary.migrationStrategy.map(step => `
### ${step.phase}
- **Timeline**: ${step.timeline}
- **Focus**: ${step.focus}
- **Files**: ${step.files.slice(0, 3).join(', ')}${step.files.length > 3 ? '...' : ''}
- **Risk Level**: ${step.risk}
`).join('\n')}

## Next Actions
1. **Phase 1**: Start with ${categories.pricing.length + categories.flightSearch.length} high-priority rules
2. **Create Config Schema**: Define schema for each category
3. **Build Adapters**: Create legacy compatibility layer
4. **Test Strategy**: Focus on files with 10+ rules first

*Analysis completed: ${new Date().toISOString()}*
`;
  
  fs.writeFileSync('docs/business-rules-analysis.md', analysisContent);
  
  console.log(`✅ Analysis complete!`);
  console.log(`📊 Category distribution:`);
  Object.entries(categories).forEach(([cat, rules]) => {
    console.log(`   ${cat}: ${rules.length} rules`);
  });
  console.log(`📁 Analysis report saved to: docs/business-rules-analysis.md`);
  
} catch (error) {
  console.error('❌ Error analyzing audit results:', error.message);
  process.exit(1);
}

function generateMigrationStrategy(categories) {
  return [
    {
      phase: 'Phase 1: Critical Business Logic',
      timeline: '3-4 days',
      focus: 'Flight search and pricing rules',
      files: [
        ...categories.flightSearch.map(r => r.filePath),
        ...categories.pricing.map(r => r.filePath)
      ].filter((v, i, a) => a.indexOf(v) === i),
      risk: 'High'
    },
    {
      phase: 'Phase 2: Auto-booking Features',
      timeline: '2-3 days', 
      focus: 'Payment and booking automation',
      files: categories.autoBooking.map(r => r.filePath).filter((v, i, a) => a.indexOf(v) === i),
      risk: 'Medium'
    },
    {
      phase: 'Phase 3: Filters and UI',
      timeline: '2-3 days',
      focus: 'Filter system and UI behavior',
      files: [
        ...categories.filters.map(r => r.filePath),
        ...categories.ui.map(r => r.filePath)
      ].filter((v, i, a) => a.indexOf(v) === i),
      risk: 'Low'
    }
  ];
}

function getTopFiles(rules, count) {
  const fileCount = {};
  rules.forEach(rule => {
    const fileName = rule.filePath.split('/').pop();
    fileCount[fileName] = (fileCount[fileName] || 0) + 1;
  });
  
  return Object.entries(fileCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, count)
    .map(([file]) => file);
}

function getMigrationPriority(category) {
  const priorities = {
    pricing: 'HIGH - Direct business impact',
    flightSearch: 'HIGH - Core functionality',
    autoBooking: 'MEDIUM - Feature enhancement',
    filters: 'LOW - UI enhancement',
    ui: 'LOW - User experience'
  };
  return priorities[category] || 'MEDIUM';
}

function getComplexityRating(ruleCount) {
  if (ruleCount > 150) return 'VERY HIGH';
  if (ruleCount > 100) return 'HIGH';
  if (ruleCount > 50) return 'MEDIUM';
  return 'LOW';
}

function getImpactLevel(ruleCount) {
  if (ruleCount > 20) return 'CRITICAL';
  if (ruleCount > 10) return 'HIGH';
  if (ruleCount > 5) return 'MEDIUM';
  return 'LOW';
}
