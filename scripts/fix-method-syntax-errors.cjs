#!/usr/bin/env node

/**
 * Fix malformed method names and console call syntax errors
 */

const fs = require('fs');
const path = require('path');

function fixMethodSyntaxErrors() {
  console.log('🔧 Fixing method syntax and console call errors...\n');
  
  const scriptsDir = 'scripts';
  const files = getAllJsFiles(scriptsDir);
  let fixedFiles = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;
    
    // Fix malformed method declarations
    content = content.replace(/async console\.log\(level, message\) \{/g, 'async log(level, message) {');
    content = content.replace(/async console\.error\(level, message\) \{/g, 'async log(level, message) {');
    content = content.replace(/async console\.info\(level, message\) \{/g, 'async log(level, message) {');
    
    // Fix malformed console calls
    content = content.replace(/console\.console\.log/g, 'console.log');
    content = content.replace(/console\.console\.error/g, 'console.error');
    content = content.replace(/console\.console\.info/g, 'console.info');
    content = content.replace(/console\.console\.warn/g, 'console.warn');
    
    // Fix method calls to use correct method name
    content = content.replace(/this\.console\.log/g, 'this.log');
    content = content.replace(/this\.console\.error/g, 'this.log');
    content = content.replace(/this\.console\.info/g, 'this.log');
    
    // Fix repeat patterns
    content = content.replace(/console\.log\('=' \.repeat\((\d+)\), 'blue'\);/g, 'console.log("=".repeat($1));');
    
    // Fix undefined variables in template literals
    content = content.replace(/const log = \(level = 'info', message\) => \{/g, 'const log = (message, level = \'info\') => {');
    content = content.replace(/\$\{level\.toUpperCase\(\)\}/g, '${(level || "INFO").toUpperCase()}');
    
    // Fix missing imports for path and other modules
    if (content.includes('path.') && !content.includes('require(\'path\')') && !content.includes('import path')) {
      content = content.replace('#!/usr/bin/env node', '#!/usr/bin/env node\n\nconst path = require(\'path\');');
    }
    
    // Fix missing variable declarations
    content = content.replace(/(\s+)(\w+): (\w+)(.message)/g, '$1$2: $3$4');
    
    // Fix export syntax errors
    content = content.replace(/^export \{/gm, 'module.exports = {');
    content = content.replace(/^export default/gm, 'module.exports =');
    
    // Fix TypeScript specific issues
    if (file.endsWith('.ts')) {
      content = content.replace(/flagOperations\.forEach\(\(action, flagKey\) => \{/g, 'flagOperations.forEach((_action, _flagKey) => {');
      content = content.replace(/const execSync = require\('child_process'\)\.execSync;/g, 'import { execSync } from \'child_process\';');
    }
    
    // Fix string literal issues in imports
    content = content.replace(/import.*'([^']*\.\.)([^']*)'/g, "import '$1$2'");
    
    // Fix object syntax issues
    content = content.replace(/(\w+): (\w+)\.(\w+),$/gm, '$1: $2.$3,');
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`✅ Fixed method syntax errors in ${file}`);
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
  console.log('🧹 Starting method syntax error fixes...\n');
  
  const fixes = fixMethodSyntaxErrors();
  
  console.log(`\n🎉 Fixed method syntax errors in ${fixes} files`);
  
  console.log('\n🔍 Checking error count after fixes...');
}

main();
