#!/usr/bin/env node

const path = require('path');

const { glob } = require('glob');
const fs = require('fs');

// Utility functions
// Removed unused log function
  console.log(`[${timestamp}] ${(level || "INFO").toUpperCase()}: ${message}`);

console.log('🚀 Starting final ESLint error fixing...\n');

// Function to fix unused variables that should be prefixed with underscore
function fixUnusedVariables(filePath, content) {
  let fixed = false;
  
  // Fix patterns like: catch(_error) { ... error.message ... }
  // Where the variable is defined with _ but used without _
  const patterns = [
    // Pattern: catch(_error) { ... error is not defined
    {
      search: /catch\s*\(\s*_(\w+)\s*\)\s*\{([^}]*)\b\1\b/g,
      replace: (match, varName, body) => {
        const newBody = body.replace(new RegExp(`\\b${varName}\\b`, 'g'), `_${varName}`);
        return match.replace(body, newBody);
      }
    },
    // Pattern: catch(_err) { ... err is not defined  
    {
      search: /catch\s*\(\s*_(\w+)\s*\)\s*\{([^}]*?)\n([^}]*?)\b\1\b/g,
      replace: (match, varName, body1, body2) => {
        const newMatch = match.replace(new RegExp(`\\b${varName}\\b`, 'g'), `_${varName}`);
        return newMatch;
      }
    }
  ];

  patterns.forEach(pattern => {
    if (pattern.search.test(content)) {
      if (typeof pattern.replace === 'function') {
        content = content.replace(pattern.search, pattern.replace);
      } else {
        content = content.replace(pattern.search, pattern.replace);
      }
      fixed = true;
    }
  });

  // Fix simple cases where variable is defined with _ but used without
  const varMatches = content.match(/catch\s*\(\s*_(\w+)\s*\)/g);
  if (varMatches) {
    varMatches.forEach(match => {
      const varName = match.match(/_(\w+)/)[1];
      // Find usage of the variable without underscore in the same catch block
      const regex = new RegExp(`catch\\s*\\(\\s*_${varName}\\s*\\)\\s*\\{([^}]*?)\\}`, 'g');
      content = content.replace(regex, (fullMatch, catchBody) => {
        const fixedBody = catchBody.replace(new RegExp(`\\b${varName}\\b`, 'g'), `_${varName}`);
        return fullMatch.replace(catchBody, fixedBody);
      });
      fixed = true;
    });
  }

  return { content, fixed };
}

// Function to remove unused variable assignments  
function removeUnusedAssignments(filePath, content) {
  let fixed = false;
  
  // Remove unused __dirname assignments
  if (content.includes("__dirname' is assigned a value but never used")) {
    content = content.replace(/const\s+__dirname\s*=.*?;\s*\n?/g, '');
    content = content.replace(/\s+__dirname\s*=.*?;\s*\n?/g, '');
    fixed = true;
  }

  // Remove other unused assignments that aren't being used
  const unusedPatterns = [
    /const\s+lastImportLine\s*=.*?;\s*\n?/g,
    /let\s+lastImportLine\s*=.*?;\s*\n?/g,
    /const\s+patterns\s*=.*?;\s*\n?/g,
    /let\s+patterns\s*=.*?;\s*\n?/g,
    /const\s+warning\s*=.*?;\s*\n?/g,
    /const\s+info\s*=.*?;\s*\n?/g,
    /const\s+ROLLBACK_DATA_DIR\s*=.*?;\s*\n?/g]
  unusedPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      content = content.replace(pattern, '');
      fixed = true;
    }
  });

  return { content, fixed };
}

// Function to fix import statement issues
function fixImportIssues(filePath, content) {
  let fixed = false;
  
  // Remove unused imports like 'path', 'fs' that are imported but not used
  const importPatterns = [
    // Remove unused path import when not used
    {
      test: /'path' is defined but never used/,
      fix: content => content.replace(/import\s+path\s+from\s+['"]path['"];\s*\n?/g, '')
                          .replace(/const\s+path\s*=\s*require\(['"]path['"]\);\s*\n?/g, '')
    },
    // Remove unused fs import when not used  
    {
      test: /'fs' is defined but never used/,
      fix: content => content.replace(/import\s+fs\s+from\s+['"]fs['"];\s*\n?/g, '')
                          .replace(/const\s+fs\s*=\s*require\(['"]fs['"]\);\s*\n?/g, '')
    },
    // Remove unused glob import
    {
      test: /'glob' is defined but never used/,
      fix: content => content.replace(/import\s+\{\s*glob\s*\}\s+from\s+['"]glob['"];\s*\n?/g, '')
                          .replace(/const\s+\{\s*glob\s*\}\s*=\s*require\(['"]glob['"]\);\s*\n?/g, '')
    }
  ];

  importPatterns.forEach(pattern => {
    if (pattern.test.test && pattern.test.test(content)) {
      content = pattern.fix(content);
      fixed = true;
    }
  });

  return { content, fixed };
}

// Function to fix specific error patterns
function fixSpecificErrors(filePath, content) {
  let fixed = false;
  
  // Fix: 'error' is defined but never used + error is not defined patterns
  if (filePath.includes('ai-code-review.js')) {
    // Fix the error variable issue in ai-code-review.js
    content = content.replace(
      /catch\s*\(\s*error\s*\)\s*\{([^}]*?)console\.error\([^,]*?,\s*error\)/g,
      'catch (_error) {$1console.error($1, _error);'
    );
    fixed = true;
  }

  return { content, fixed };
}

// Main function to process files
async function processFiles() {
  try {
    // Get all JavaScript files that might have errors
    const scriptFiles = await glob('scripts/**/*.js', { cwd: process.cwd() });
    
    let totalFixed = 0;
    
    for (const file of scriptFiles) {
      const filePath = path.resolve(file);
      
      if (!fs.existsSync(filePath)) continue;
      
      let content = fs.readFileSync(filePath, 'utf8');
      let fileFixed = false;
      
      // Apply all fixes
      const fixes = [
        fixUnusedVariables,
        removeUnusedAssignments, 
        fixImportIssues,
        fixSpecificErrors
      ];
      
      for (const fixFunction of fixes) {
        const result = fixFunction(filePath, content);
        content = result.content
        if (result.fixed) {
          fileFixed = true;
        }
      }
      
      if (fileFixed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✅ Fixed ${file}`);
        totalFixed++;
      }
    }
    
    console.log(`\n📊 Fixed ${totalFixed} files\n`);
    
    // Run ESLint to check current status
    console.log('🔍 Running ESLint to check current status...');
    try {
      const { execSync } = require('child_process');
      execSync('npm run lint', { stdio: 'inherit' });
      console.log('  ✅ ESLint passed!');
    } catch (error) {
      console.log('  ⚠️  Some ESLint errors remain');
    }
    
  } catch (error) {
    console.error('❌ Error processing files:', error);
  }
}

// Run if called directly
if (require.main === module) {
  processFiles();
}

module.exports = { processFiles };
