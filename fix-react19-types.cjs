#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function getAllTsxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !['node_modules', '.git', 'dist', 'build'].includes(item)) {
      files.push(...getAllTsxFiles(fullPath));
    } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function fixReact19TypeIssues(content) {
  let fixedContent = content;
  
  // Fix missing ReactNode import
  if (fixedContent.includes('ReactNode') && !fixedContent.includes('import') && !fixedContent.includes('ReactNode')) {
    // Find existing React import and add ReactNode
    const reactImportMatch = fixedContent.match(/import React(?:, \{([^}]*)\})? from ['"]react['"];/);
    if (reactImportMatch) {
      const existingImports = reactImportMatch[1] ? reactImportMatch[1].split(',').map(s => s.trim()) : [];
      if (!existingImports.includes('ReactNode')) {
        const newImports = [...existingImports, 'ReactNode'];
        const newImportStatement = `import React, { ${newImports.join(', ')} } from "react";`;
        fixedContent = fixedContent.replace(reactImportMatch[0], newImportStatement);
      }
    }
  }
  
  // Fix Badge children prop issues by explicitly adding ReactNode children
  if (fixedContent.includes('BadgeProps') && fixedContent.includes('children')) {
    // Already fixed in Badge component
  }
  
  return fixedContent;
}

function ensureReactNodeImport(content) {
  // Check if file uses ReactNode but doesn't import it
  if (content.includes('ReactNode') && !content.match(/import[^;]*ReactNode[^;]*from ['"]react['"];/)) {
    const reactImportMatch = content.match(/import React(?:, \{([^}]*)\})? from ['"]react['"];/);
    if (reactImportMatch) {
      const existingImports = reactImportMatch[1] ? reactImportMatch[1].split(',').map(s => s.trim()) : [];
      if (!existingImports.includes('ReactNode')) {
        const newImports = [...existingImports, 'ReactNode'];
        const newImportStatement = `import React, { ${newImports.join(', ')} } from "react";`;
        return content.replace(reactImportMatch[0], newImportStatement);
      }
    }
  }
  return content;
}

// Main execution
console.log('Fixing React 19 type issues...');

const files = getAllTsxFiles('./src');
files.push(...getAllTsxFiles('./app'));

let processedCount = 0;
let modifiedCount = 0;

for (const filePath of files) {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    
    // Skip files that don't import React
    if (!originalContent.includes('from "react"') && !originalContent.includes("from 'react'")) {
      continue;
    }
    
    let fixedContent = originalContent;
    
    // Apply type fixes
    fixedContent = fixReact19TypeIssues(fixedContent);
    fixedContent = ensureReactNodeImport(fixedContent);
    
    // Write back if changed
    if (fixedContent !== originalContent) {
      fs.writeFileSync(filePath, fixedContent);
      console.log(`✓ Fixed types in: ${filePath}`);
      modifiedCount++;
    }
    
    processedCount++;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

console.log(`\nProcessed ${processedCount} files, modified ${modifiedCount} files.`);
console.log('React 19 type fixes completed!');
