#!/usr/bin/env node

/**
 * Fix specific syntax errors causing parsing failures
 */

const fs = require('fs');
const path = require('path');

function fixSyntaxErrors() {
  console.log('🔧 Fixing specific syntax errors...\n');
  
  const scriptsDir = 'scripts';
  const files = getAllJsFiles(scriptsDir);
  let fixedFiles = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;
    
    // Fix missing closing braces for objects
    content = content.replace(/const colors = \{[^}]+cyan: '\\x1b\[36m'\n$/gm, (match) => {
      if (!match.includes('};')) {
        return match + '\n};';
      }
      return match;
    });
    
    // Fix array syntax errors (semicolon instead of comma)
    content = content.replace(/process\.env\.KMS_PAYMENT_ALIAS;/g, 'process.env.KMS_PAYMENT_ALIAS');
    content = content.replace(/process\.env\.[\w_]+;(\s*\])/g, 'process.env.$1$2');
    
    // Fix template literal issues with extra semicolons
    content = content.replace(/\$\{missing\.join\(', '\);\}/g, '${missing.join(\', \')}');
    content = content.replace(/join\(', ';\)/g, 'join(\', \')');
    
    // Fix unexpected const declarations
    content = content.replace(/^const (\w+) = /gm, (match, varName, offset) => {
      const beforeMatch = content.substring(0, offset);
      const lines = beforeMatch.split('\n');
      const currentLine = lines[lines.length - 1];
      const prevLine = lines.length > 1 ? lines[lines.length - 2] : '';
      
      // If it's after a comment line, it might be orphaned
      if (prevLine.trim().startsWith('//') && prevLine.includes('Removed')) {
        return '';
      }
      
      return match;
    });
    
    // Fix orphaned async function declarations
    content = content.replace(/^async (\w+)\(\) \{$/gm, '');
    
    // Fix export syntax in .js files
    content = content.replace(/^export \{([^}]+)\}$/gm, 'module.exports = {$1};');
    content = content.replace(/^export default (.+)$/gm, 'module.exports = $1;');
    
    // Fix TypeScript-specific issues
    if (file.endsWith('.ts')) {
      content = content.replace(/flagOperations\.forEach\(\(action, flagKey\) => \{/g, 'flagOperations.forEach((_action, _flagKey) => {');
      content = content.replace(/const execSync = require\('child_process'\)\.execSync;/g, 'import { execSync } from \'child_process\';');
    }
    
    // Fix dot notation issues
    content = content.replace(/\.(\w+);$/gm, '.$1');
    
    // Fix path issues without proper require
    if (content.includes('path.') && !content.includes('require(\'path\')') && !content.includes('import path')) {
      if (content.startsWith('#!/usr/bin/env node')) {
        content = content.replace('#!/usr/bin/env node', '#!/usr/bin/env node\n\nconst path = require(\'path\');');
      } else {
        content = "const path = require('path');\n" + content;
      }
    }
    
    // Clean up multiple empty lines
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    // Fix specific parsing patterns
    content = content.replace(/(\w+): (\w+)\.(\w+)$/gm, '$1: $2.$3');
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`✅ Fixed syntax errors in ${file}`);
      fixedFiles++;
    }
  }
  
  return fixedFiles;
}

function getAllJsFiles(dir, extensions = ['.js', '.ts']) {
  const files = [];
  
  function walkDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(item)) {
          walkDirectory(fullPath);
        }
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  walkDirectory(dir);
  return files;
}

function main() {
  console.log('🧹 Starting syntax error fixes...\n');
  
  const fixes = fixSyntaxErrors();
  
  console.log(`\n🎉 Fixed syntax errors in ${fixes} files`);
  
  console.log('\n🔍 Checking error count after syntax fixes...');
}

main();
