#!/usr/bin/env node

/**
 * Fix React 19 imports - use default import + named imports pattern
 * For React 19, we need: import React, { useState, useEffect } from 'react'
 */

import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

const PROJECT_ROOT = process.cwd();

// React hooks and components that need to be imported
const REACT_EXPORTS = [
  'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useContext', 
  'useReducer', 'useLayoutEffect', 'useImperativeHandle', 'useDebugValue',
  'startTransition', 'useTransition', 'useDeferredValue', 'useSyncExternalStore',
  'useId', 'useInsertionEffect', 'ReactNode', 'FC', 'FunctionComponent', 'Component', 
  'PureComponent', 'createElement', 'cloneElement', 'createRef', 'forwardRef', 
  'lazy', 'Suspense', 'memo', 'Fragment', 'FormEvent', 'FormEventHandler',
  'ChangeEvent', 'MouseEvent', 'KeyboardEvent', 'HTMLAttributes', 'CSSProperties',
  'HTMLProps', 'DetailedHTMLProps', 'InputHTMLAttributes', 'HTMLInputElement',
  'ComponentPropsWithoutRef', 'ElementRef', 'PropsWithChildren', 'RefObject',
  'MutableRefObject', 'ComponentType'
];

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

function fixReactImports(content) {
  const lines = content.split('\n');
  let hasChanges = false;
  let reactImportIndices = [];
  
  // Find all React import lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('import') && line.includes('from \'react\'') || line.includes('from "react"')) {
      reactImportIndices.push(i);
    }
  }
  
  if (reactImportIndices.length === 0) {
    // No React imports found, check if React hooks are used
    const usedExports = REACT_EXPORTS.filter(exportName => {
      return content.includes(exportName + '(') || 
             content.includes(exportName + '<') ||
             content.includes(': ' + exportName) ||
             content.includes('React.' + exportName);
    });
    
    if (usedExports.length > 0) {
      // Add React import with the used exports
      const importStatement = `import React, { ${usedExports.join(', ')} } from 'react';`;
      
      // Find insertion point (after other imports)
      let insertIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import') || 
            lines[i].trim().startsWith('"use client"') || 
            lines[i].trim().startsWith("'use client'")) {
          insertIndex = i + 1;
        } else if (lines[i].trim() === '') {
          break;
        }
      }
      
      lines.splice(insertIndex, 0, importStatement);
      hasChanges = true;
    }
  } else {
    // Process existing React imports
    const allUsedExports = new Set();
    
    // Extract all currently imported exports
    for (const index of reactImportIndices) {
      const line = lines[index].trim();
      const match = line.match(/import\s+([^}]+?)\s+from\s*['"]react['"]/);
      if (match) {
        const importPart = match[1];
        
        // Handle different import patterns
        if (importPart.includes('{')) {
          // Extract from destructured imports
          const destructuredMatch = importPart.match(/{\s*([^}]+)\s*}/);
          if (destructuredMatch) {
            const exports = destructuredMatch[1].split(',').map(e => e.trim()).filter(e => e);
            exports.forEach(exp => allUsedExports.add(exp));
          }
        }
      }
    }
    
    // Also check what's actually used in the file
    const usedExports = REACT_EXPORTS.filter(exportName => {
      return content.includes(exportName + '(') || 
             content.includes(exportName + '<') ||
             content.includes(': ' + exportName) ||
             content.includes('React.' + exportName);
    });
    
    usedExports.forEach(exp => allUsedExports.add(exp));
    
    // Remove all existing React imports
    for (let i = reactImportIndices.length - 1; i >= 0; i--) {
      lines.splice(reactImportIndices[i], 1);
    }
    
    // Add single consolidated import
    if (allUsedExports.size > 0) {
      const importStatement = `import React, { ${Array.from(allUsedExports).join(', ')} } from 'react';`;
      
      // Find insertion point
      let insertIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import') || 
            lines[i].trim().startsWith('"use client"') || 
            lines[i].trim().startsWith("'use client'")) {
          insertIndex = i + 1;
        } else if (lines[i].trim() === '') {
          break;
        }
      }
      
      lines.splice(insertIndex, 0, importStatement);
      hasChanges = true;
    }
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
    
    const newContent = fixReactImports(content);
    
    if (newContent !== content) {
      await fs.writeFile(fullPath, newContent);
      console.log(`✅ Fixed React 19 imports in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 Fixing React 19 imports...');
  
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
