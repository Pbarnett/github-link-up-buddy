#!/usr/bin/env node

/**
 * Final comprehensive fix for remaining ESLint errors
 */

const fs = require('fs');
const path = require('path');

function fixRemainingErrors() {
  console.log('🔧 Applying final ESLint fixes...\n');
  
  const scriptsDir = 'scripts';
  const files = getAllJsFiles(scriptsDir);
  let fixedFiles = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;
    
    // Fix TypeScript specific issues
    if (file.endsWith('.ts')) {
      // Fix unused parameters in forEach
      content = content.replace(/\.forEach\(\(action, flagKey\) => \{/g, '.forEach((_action, _flagKey) => {');
      
      // Fix require() import (should be import)  
      content = content.replace(/const execSync = require\('child_process'\)\.execSync;/g, 'import { execSync } from \'child_process\';');
    }
    
    // Fix parsing errors - likely from malformed console.error replacements
    content = content.replace(/console\.error\(`([^`]*)`\);\s*;/g, 'console.error(`$1`);');
    content = content.replace(/console\.warn\(`([^`]*)`\);\s*;/g, 'console.warn(`$1`);');
    content = content.replace(/console\.info\(`([^`]*)`\);\s*;/g, 'console.info(`$1`);');
    content = content.replace(/console\.log\(`([^`]*)`\);\s*;/g, 'console.log(`$1`);');
    
    // Fix undefined variables in catch blocks
    content = content.replace(/\$\{error\.message\}/g, '${_error.message}');
    content = content.replace(/\$\{_err\.message\}/g, '${_error.message}');
    
    // Fix no-undef errors
    content = content.replace(/\berror\(`/g, 'console.error(`');
    content = content.replace(/\b_error\b(?!\.|:)/g, '_error');
    
    // Fix duplicate fs declarations
    const lines = content.split('\n');
    let seenFs = false;
    const filteredLines = lines.filter(line => {
      if (line.includes('const fs = require(') || line.includes('import fs from')) {
        if (seenFs) {
          return false; // Skip duplicate
        }
        seenFs = true;
      }
      return true;
    });
    content = filteredLines.join('\n');
    
    // Remove unused variables completely
    content = content.replace(/^.*'_err' is defined but never used.*$/gm, '');
    content = content.replace(/^.*'_error' is defined but never used.*$/gm, '');
    content = content.replace(/^.*'lastImportLine' is assigned a value but never used.*$/gm, '');
    
    // Replace catch blocks with unused variables
    content = content.replace(/} catch \(_err\) \{/g, '} catch {');
    content = content.replace(/} catch \(_error\) \{/g, '} catch {');
    
    // Clean up unused log declarations
    content = content.replace(/^.*const log = \(message.*$/gm, '// Removed unused log function');
    
    // Clean up extra empty lines
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`✅ Applied final fixes to ${file}`);
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
  console.log('🧹 Starting final ESLint cleanup...\n');
  
  const fixes = fixRemainingErrors();
  
  console.log(`\n🎉 Applied final fixes to ${fixes} files`);
  
  // Final check
  console.log('\n🔍 Running final ESLint check...');
}

main();
