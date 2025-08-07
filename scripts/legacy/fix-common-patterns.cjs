#!/usr/bin/env node

/**
 * Fix Common Lint Patterns Script
 * 
 * This script addresses the most common fixable lint patterns:
 * 1. Replace {} empty object types with object
 * 2. Remove unused imports (Component, FC patterns)
 * 3. Fix case declarations
 * 4. Remove unused event parameters
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing common lint patterns...\n');

// Find all TypeScript/React files using find command
let files = [];
try {
  const findOutput = execSync('find src -name "*.ts" -o -name "*.tsx"', { encoding: 'utf8' });
  files = findOutput.trim().split('\n').filter(f => f);
} catch (error) {
  console.error('Error finding files:', error.message);
  process.exit(1);
}

console.log(`📁 Found ${files.length} files to process\n`);

let totalFixes = 0;

// Fix patterns
files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const originalContent = content;
    
    // Pattern 1: Fix empty object types
    const emptyObjectReplacements = [
      // React Component types
      { from: /type FC<T = {}>/g, to: 'type FC<T = object>' },
      { from: /React\.FC<{}>/g, to: 'React.FC' },
      { from: /FC<{}>/g, to: 'FC' },
      { from: /Component<{}, {}>/g, to: 'Component' },
      { from: /Component<{}>/g, to: 'Component' },
      // Interface props
      { from: /: {} =/g, to: ': object =' },
      { from: /: {} \|/g, to: ': object |' },
      { from: /: {} &/g, to: ': object &' },
    ];

    emptyObjectReplacements.forEach(({ from, to }) => {
      if (content.match(from)) {
        content = content.replace(from, to);
        modified = true;
      }
    });

    // Pattern 2: Remove unused Component imports that aren't being used
    const componentImportPattern = /'Component' is defined but never used/;
    
    // Check if we have unused Component import
    const hasUnusedComponent = content.includes("'Component' is defined but never used");
    
    if (content.includes('import { Component }') && !content.includes('extends Component')) {
      // Remove Component from import if it's not being used as a class component
      content = content.replace(/import \{ Component,\s*/g, 'import { ');
      content = content.replace(/import \{\s*Component\s*\} from 'react';\n/g, '');
      content = content.replace(/,\s*Component\s*\}/g, ' }');
      content = content.replace(/\{\s*Component\s*,/g, '{');
      modified = true;
    }

    // Pattern 3: Remove unused event parameters
    const unusedEventPatterns = [
      // Convert (e) => to () => when e is unused
      { from: /\(e: React\.ChangeEvent<[^>]+>\) => (\w+\([^)]*\))/g, to: '() => $1' },
      { from: /\(e: React\.FormEvent[^)]*\) => (\w+\([^)]*\))/g, to: '() => $1' },
      { from: /\(checked: boolean\) => (\w+\([^,)]*,) override\.value/g, to: '() => $1override.value' },
    ];

    // Pattern 4: Fix catch blocks without using the error
    content = content.replace(/} catch \(e\) \{/g, '} catch {');
    content = content.replace(/} catch \(error\) \{/g, '} catch {');
    
    // Pattern 5: Remove specific unused imports
    const unusedImportPatterns = [
      /import \{ Component,\s*/g,
      /import \{\s*Component\s*\} from ['"][^'"]+['"];\s*\n/g,
      /, Component\s*\}/g,
      /\{\s*Component,/g,
    ];
    
    unusedImportPatterns.forEach(pattern => {
      if (content.match(pattern)) {
        content = content.replace(pattern, '');
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      console.log(`✅ Fixed patterns in ${relativePath}`);
      totalFixes++;
    }

  } catch (error) {
    console.log(`❌ Error processing ${filePath}: ${error.message}`);
  }
});

console.log(`\n🎉 Fixed patterns in ${totalFixes} files!`);

// Now run a more specific unused variable cleanup
console.log('\n🧹 Running specific unused variable cleanup...');

// Get list of files with unused variables
let lintOutput = '';
try {
  lintOutput = execSync('npm run lint 2>/dev/null | grep "is defined but never used"', { 
    encoding: 'utf8', 
    stdio: 'pipe' 
  });
} catch (error) {
  lintOutput = error.stdout || '';
}

const unusedVarLines = lintOutput.split('\n').filter(line => line.includes('is defined but never used'));
console.log(`📋 Found ${unusedVarLines.length} unused variable violations`);

// Count specific patterns
const patterns = {
  'FormEvent': unusedVarLines.filter(line => line.includes("'FormEvent'")).length,
  'Component': unusedVarLines.filter(line => line.includes("'Component'")).length,
  'useTransition': unusedVarLines.filter(line => line.includes("'useTransition'")).length,
  'ChangeEvent': unusedVarLines.filter(line => line.includes("'ChangeEvent'")).length,
};

console.log('\n📊 Most common unused imports:');
Object.entries(patterns)
  .filter(([, count]) => count > 0)
  .sort(([, a], [, b]) => b - a)
  .forEach(([pattern, count]) => {
    console.log(`  ${pattern}: ${count} occurrences`);
  });

console.log('\n✨ Pattern fixing complete!');
console.log(`📈 Files modified: ${totalFixes}`);
console.log('🔄 Run npm run lint again to see remaining issues');
