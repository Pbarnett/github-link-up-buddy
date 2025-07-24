#!/usr/bin/env node

/**
 * Fix duplicate React imports created by the previous script
 */

import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

const PROJECT_ROOT = process.cwd();

async function findTSXFiles() {
  const patterns = [
    'src/**/*.tsx',
    'src/**/*.ts',
    'app/**/*.tsx',
    'app/**/*.ts'
  ];

  const allFiles = [];
  for (const pattern of patterns) {
    const files = await glob(pattern, { 
      cwd: PROJECT_ROOT,
      ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/tests/**'
      ]
    });
    allFiles.push(...files);
  }

  return [...new Set(allFiles)];
}

function fixDuplicateImports(content) {
  const lines = content.split('\n');
  const reactImportIndices = [];
  let hasChanges = false;
  
  // Find all React import lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('import {') && line.includes('from \'react\'')) {
      reactImportIndices.push(i);
    }
  }
  
  // If we have multiple React imports, merge them
  if (reactImportIndices.length > 1) {
    const allHooks = new Set();
    
    // Extract all hooks from all import statements
    for (const index of reactImportIndices) {
      const line = lines[index].trim();
      const match = line.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]react['"]/);
      if (match) {
        const hooks = match[1].split(',').map(h => h.trim()).filter(h => h);
        hooks.forEach(hook => allHooks.add(hook));
      }
    }
    
    // Remove all React import lines
    for (let i = reactImportIndices.length - 1; i >= 0; i--) {
      lines.splice(reactImportIndices[i], 1);
    }
    
    // Add a single merged import line
    if (allHooks.size > 0) {
      const mergedImport = `import { ${Array.from(allHooks).join(', ')} } from 'react';`;
      
      // Find the best place to insert it (after other imports)
      let insertIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import') || lines[i].trim().startsWith('"use client"') || lines[i].trim().startsWith("'use client'")) {
          insertIndex = i + 1;
        } else if (lines[i].trim() === '') {
          break;
        }
      }
      
      lines.splice(insertIndex, 0, mergedImport);
    }
    
    hasChanges = true;
  }
  
  if (hasChanges) {
    return lines.join('\n');
  }
  
  return content;
}

async function processFile(filePath) {
  try {
    const fullPath = path.resolve(PROJECT_ROOT, filePath);
    const content = await fs.readFile(fullPath, 'utf8');
    
    const newContent = fixDuplicateImports(content);
    
    if (newContent !== content) {
      await fs.writeFile(fullPath, newContent);
      console.log(`✅ Fixed duplicate imports in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 Finding files with duplicate React imports...');
  
  const files = await findTSXFiles();
  console.log(`📁 Found ${files.length} files to process`);
  
  let changedFiles = 0;
  
  for (const file of files) {
    const changed = await processFile(file);
    if (changed) {
      changedFiles++;
    }
  }
  
  console.log(`\n🎉 Processing complete!`);
  console.log(`📊 Files processed: ${files.length}`);
  console.log(`✏️  Files changed: ${changedFiles}`);
  
  if (changedFiles > 0) {
    console.log('\n💡 Run `npm run tsc` to check for remaining TypeScript errors.');
  }
}

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
