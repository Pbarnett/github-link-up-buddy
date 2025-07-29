#!/usr/bin/env node

/**
 * Fix critical parsing errors and no-undef issues
 */

const fs = require('fs');
const path = require('path');

function fixCriticalErrors() {
  console.log('🚨 Fixing critical parsing errors and no-undef issues...\n');
  
  const scriptsDir = 'scripts';
  const files = getAllJsFiles(scriptsDir);
  let fixedFiles = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;
    
    // Fix malformed console calls
    content = content.replace(/console\.console\.console\./g, 'console.');
    content = content.replace(/console\.console\./g, 'console.');
    
    // Fix stray closing braces and parsing errors
    content = content.replace(/^  console\.log\(`\$\{colors\[color\]\}\$\{message\}\$\{colors\.reset\}`\);\n\};\n$/gm, '');
    content = content.replace(/^\};\n$/gm, '');
    
    // Fix undefined function calls
    content = content.replace(/\blog\(/g, 'console.log(');
    content = content.replace(/\bstep\(/g, 'console.log(');
    content = content.replace(/\berror\(`([^`]*)`\)/g, 'console.error(`$1`)');
    content = content.replace(/\binfo\(`([^`]*)`\)/g, 'console.info(`$1`)');
    content = content.replace(/\bwarning\(`([^`]*)`\)/g, 'console.warn(`$1`)');
    content = content.replace(/\bsuccess\(`([^`]*)`\)/g, 'console.log(`✅ $1`)');
    
    // Fix template literal issues
    content = content.replace(/\$\{error\.message\}/g, '${err.message}');
    content = content.replace(/\$\{_error\.message\}/g, '${err.message}');
    
    // Fix TypeScript specific issues
    if (file.endsWith('.ts')) {
      content = content.replace(/flagOperations\.forEach\(\(action, flagKey\) => \{/g, 'flagOperations.forEach((_action, _flagKey) => {');
      content = content.replace(/const execSync = require\('child_process'\)\.execSync;/g, 'import { execSync } from \'child_process\';');
    }
    
    // Fix spread operator parsing errors
    content = content.replace(/\.\.\./g, '...');
    
    // Fix malformed object/array syntax
    content = content.replace(/,\s*\};\n$/gm, '}');
    content = content.replace(/,\s*\];\n$/gm, ']');
    
    // Remove orphaned closing braces
    const lines = content.split('\n');
    const filteredLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Skip lines that are just closing braces without context
      if (trimmedLine === '};' || trimmedLine === '}') {
        // Check if this is part of a valid structure
        const prevLine = i > 0 ? lines[i-1].trim() : '';
        const nextLine = i < lines.length - 1 ? lines[i+1].trim() : '';
        
        // Skip orphaned closing braces
        if (prevLine.includes('// Removed') || prevLine === '' || nextLine.startsWith('//')) {
          continue;
        }
      }
      
      filteredLines.push(line);
    }
    
    content = filteredLines.join('\n');
    
    // Clean up multiple empty lines
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`✅ Fixed critical errors in ${file}`);
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
  console.log('🧹 Starting critical error fixes...\n');
  
  const fixes = fixCriticalErrors();
  
  console.log(`\n🎉 Fixed critical errors in ${fixes} files`);
  
  console.log('\n🔍 Checking error count after fixes...');
}

main();
