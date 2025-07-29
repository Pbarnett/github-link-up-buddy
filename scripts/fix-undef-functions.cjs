#!/usr/bin/env node

/**
 * Fix no-undef errors by replacing undefined function calls with console.log
 */

const fs = require('fs');
const path = require('path');

function fixUndefFunctions() {
  console.log('🔧 Fixing no-undef function calls...\n');
  
  const scriptsDir = 'scripts';
  const files = getAllJsFiles(scriptsDir);
  let fixedFiles = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;
    
    // Replace undefined function calls with console equivalents
    content = content.replace(/\berror\(`([^`]*)`\);?/g, 'console.error(`$1`);');
    content = content.replace(/\bwarning\(`([^`]*)`\);?/g, 'console.warn(`$1`);');
    content = content.replace(/\binfo\(`([^`]*)`\);?/g, 'console.info(`$1`);');
    content = content.replace(/\bsuccess\(`([^`]*)`\);?/g, 'console.log(`✅ $1`);');
    
    // Handle template literals and other patterns
    content = content.replace(/\berror\(([^)]+)\);?/g, 'console.error($1);');
    content = content.replace(/\bwarning\(([^)]+)\);?/g, 'console.warn($1);');
    content = content.replace(/\binfo\(([^)]+)\);?/g, 'console.info($1);');
    content = content.replace(/\bsuccess\(([^)]+)\);?/g, 'console.log($1);');
    
    // Fix TypeScript unused parameters
    if (file.endsWith('.ts')) {
      content = content.replace(/flagOperations\.forEach\(\(action, flagKey\) => \{/g, 'flagOperations.forEach((_action, _flagKey) => {');
      content = content.replace(/const execSync = require\('child_process'\)\.execSync;/g, 'import { execSync } from \'child_process\';');
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`✅ Fixed undefined functions in ${file}`);
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
  console.log('🧹 Starting function undefined fixes...\n');
  
  const fixes = fixUndefFunctions();
  
  console.log(`\n🎉 Fixed ${fixes} files with undefined function calls`);
  
  console.log('\n🔍 Checking remaining errors...');
}

main();
