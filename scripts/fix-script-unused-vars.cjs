#!/usr/bin/env node

/**
 * Fix specific unused variable issues in scripts directory
 */

const fs = require('fs');
const path = require('path');

// Specific fixes for the issues detected by ESLint
const specificFixes = [
  // Remove unused log/error utility functions that are declared but never used
  {
    file: 'scripts/advanced-optimization.js',
    fixes: [
      {
        search: `const error = (msg) => console.log(\`❌ \${msg}\`);\n\nconst log = (message, level = 'info') => {\n  const timestamp = new Date().toISOString();\n  console.log(\`[\${timestamp}] \${level.toUpperCase()}: \${message}\`);\n};`,
        replace: '// Removed unused utility functions'
      }
    ]
  },
  {
    file: 'scripts/create-business-dashboards.js',
    fixes: [
      {
        search: `const error = (msg) => console.log(\`❌ \${msg}\`);\n\nconst log = (message, level = 'info') => {\n  const timestamp = new Date().toISOString();\n  console.log(\`[\${timestamp}] \${level.toUpperCase()}: \${message}\`);\n};`,
        replace: '// Removed unused utility functions'
      }
    ]
  },
  {
    file: 'scripts/create-test-env.js',
    fixes: [
      {
        search: `const log = (message, level = 'info') => {\n  const timestamp = new Date().toISOString();\n  console.log(\`[\${timestamp}] \${level.toUpperCase()}: \${message}\`);\n};`,
        replace: '// Removed unused log function'
      }
    ]
  },
  {
    file: 'scripts/dashboard-best-practices.js',
    fixes: [
      {
        search: `const error = (msg) => console.log(\`❌ \${msg}\`);`,
        replace: '// Removed unused error function'
      }
    ]
  },
  {
    file: 'scripts/deploy-phase2.js',
    fixes: [
      {
        search: `const error = (msg) => console.log(\`❌ \${msg}\`);`,
        replace: '// Removed unused error function'
      }
    ]
  },
  {
    file: 'scripts/deployment/setup-branch-protection.js',
    fixes: [
      {
        search: `const fs = require('fs');`,
        replace: '// const fs = require(\'fs\'); // Unused import removed'
      }
    ]
  },
  {
    file: 'scripts/dev-wrapper.js',
    fixes: [
      {
        search: `const log = (message, level = 'info') => {\n  const timestamp = new Date().toISOString();\n  console.log(\`[\${timestamp}] \${level.toUpperCase()}: \${message}\`);\n};`,
        replace: '// Removed unused log function'
      }
    ]
  },
  // Fix no-undef errors by using the correct variable names
  {
    file: 'scripts/development/ai-code-analysis.js',
    fixes: [
      {
        search: `warning(\`Failed to apply fix to \${suggestion.file}: \${err.message}\`);`,
        replace: `warning(\`Failed to apply fix to \${suggestion.file}: \${_err.message}\`);`
      }
    ]
  },
  {
    file: 'scripts/development/enforce-organization.js',
    fixes: [
      {
        search: `error(\`Failed to fix \${issue.current}: \${err.message}\`);`,
        replace: `console.error(\`Failed to fix \${issue.current}: \${_err.message}\`);`
      },
      {
        search: `error(\`Failed to consolidate \${source}: \${err.message}\`);`,
        replace: `console.error(\`Failed to consolidate \${source}: \${_err.message}\`);`
      }
    ]
  },
  {
    file: 'scripts/development/ai-code-review.js',
    fixes: [
      {
        search: `const log = (message, level = 'info') => {\n  const timestamp = new Date().toISOString();\n  console.log(\`[\${timestamp}] \${level.toUpperCase()}: \${message}\`);\n};`,
        replace: '// Removed unused log function'
      }
    ]
  }
];

function applyFixes() {
  console.log('🔧 Applying targeted fixes for unused variables...\n');
  
  let fixedFiles = 0;
  
  for (const { file, fixes } of specificFixes) {
    if (!fs.existsSync(file)) {
      console.log(`⚠️  Skipping ${file} (not found)`);
      continue;
    }
    
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;
    let fileModified = false;
    
    for (const { search, replace } of fixes) {
      if (content.includes(search)) {
        content = content.replace(search, replace);
        console.log(`   ✓ Applied fix in ${file}`);
        fileModified = true;
      }
    }
    
    // Clean up multiple consecutive empty lines
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`✅ Fixed ${file}`);
      fixedFiles++;
    }
  }
  
  console.log(`\n🎉 Applied fixes to ${fixedFiles} files`);
}

applyFixes();
