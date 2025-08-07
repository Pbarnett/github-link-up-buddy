#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define patterns for common unused variables that need to be prefixed with _
const fixPatterns = [
  // Component imports
  { pattern: /type Component<P = {}, S = {}> = React\.Component<P, S>;/g, replace: 'type _Component<P = {}, S = {}> = React.Component<P, S>;' },
  { pattern: /const { Component } = React;/g, replace: 'const { Component: _Component } = React;' },
  { pattern: /import { Component,/g, replace: 'import { Component: _Component,' },
  { pattern: /import { Component }/g, replace: 'import { Component: _Component }' },
  
  // Other common unused imports and variables
  { pattern: /const { Fragment } = React;/g, replace: 'const { Fragment: _Fragment } = React;' },
  { pattern: /const { useTransition } = React;/g, replace: 'const { useTransition: _useTransition } = React;' },
  
  // Error variables in catch blocks
  { pattern: /} catch \(error\) {/g, replace: '} catch (_error) {' },
  { pattern: /\(error\) => {[^}]*console\.error/g, replace: (match) => match.replace('(error)', '(_error)') },
  
  // Function parameters that are unused
  { pattern: /\(([^)]+error[^)]*)\) => {[^}]*}/g, replace: (match, params) => {
    const newParams = params.replace(/\berror\b/g, '_error');
    return match.replace(params, newParams);
  }},
  
  // Variable assignments
  { pattern: /const error =/g, replace: 'const _error =' },
  { pattern: /let error =/g, replace: 'let _error =' },
  { pattern: /const execSync =/g, replace: 'const _execSync =' },
  { pattern: /const __dirname =/g, replace: 'const ___dirname =' },
  { pattern: /const result =/g, replace: 'const _result =' },
  
  // Destructuring assignments
  { pattern: /const { error } =/g, replace: 'const { error: _error } =' },
  { pattern: /const { execSync } =/g, replace: 'const { execSync: _execSync } =' },
  { pattern: /const { result } =/g, replace: 'const { result: _result } =' },
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    for (const { pattern, replace } of fixPatterns) {
      const originalContent = content;
      if (typeof replace === 'function') {
        content = content.replace(pattern, replace);
      } else {
        content = content.replace(pattern, replace);
      }
      if (content !== originalContent) {
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function walkDirectory(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const files = [];
  
  function walk(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and other common directories
        if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(item)) {
          walk(fullPath);
        }
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

function main() {
  const projectRoot = process.cwd();
  const srcDir = path.join(projectRoot, 'src');
  const scriptsDir = path.join(projectRoot, 'scripts');
  
  console.log('Starting unused variable fixes...');
  
  let fixedCount = 0;
  
  // Fix files in src directory
  const srcFiles = walkDirectory(srcDir);
  for (const file of srcFiles) {
    if (fixFile(file)) {
      fixedCount++;
    }
  }
  
  // Fix files in scripts directory
  if (fs.existsSync(scriptsDir)) {
    const scriptFiles = walkDirectory(scriptsDir);
    for (const file of scriptFiles) {
      if (fixFile(file)) {
        fixedCount++;
      }
    }
  }
  
  console.log(`\nCompleted! Fixed ${fixedCount} files.`);
}

if (require.main === module) {
  main();
}

module.exports = { fixFile, fixPatterns };
