#!/usr/bin/env node

const path = require('path');

/**
 * Fix React hooks imports for React 19 compatibility
 * This script converts old-style React hook imports to new automatic JSX runtime style
 */

import fs from 'fs/promises';
import { glob } from 'glob';
// Utility functions
// Removed unused info function
// Removed unused warning function
// Removed unused error function
// Removed unused success function

// Utility functions
// Removed unused log function
  console.log(`[${timestamp}] ${(level || "INFO").toUpperCase()}: ${message}`);

const PROJECT_ROOT = process.cwd();

// React hooks that need to be imported separately
const REACT_HOOKS = [
  'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useContext', 
  'useReducer', 'useLayoutEffect', 'useImperativeHandle', 'useDebugValue',
  'startTransition', 'useTransition', 'useDeferredValue', 'useSyncExternalStore',
  'useId', 'useInsertionEffect', 'ReactNode', 'FC', 'FormEvent', 'FormEventHandler',
  'Component', 'PureComponent', 'createElement', 'cloneElement', 'createRef',
  'forwardRef', 'lazy', 'Suspense', 'memo', 'Fragment'
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
  let reactImportIndex = -1;
  let currentReactImport = '';
  
  // Find existing React import
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('import React') && line.includes('from')) {
      reactImportIndex = i;
      currentReactImport = line;
      break;
    }
  }

  if (reactImportIndex === -1) {
    // No React import found, check if hooks are used
    const needsHooks = REACT_HOOKS.some(hook => 
      content.includes(hook + '(') || content.includes(hook + '<')
    );
    
    if (needsHooks) {
      // Add hooks import
      const usedHooks = REACT_HOOKS.filter(hook => 
        content.includes(hook + '(') || content.includes(hook + '<')
      );
      
      if (usedHooks.length > 0) {
        const hooksImport = `import { ${usedHooks.join(', ')} } from 'react';`;
        
        // Find the best place to insert the import
        let insertIndex = 0;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim().startsWith('import')) {
            insertIndex = i + 1;
          } else if (lines[i].trim() === '' && i > 0) {
            break;
          }
        }
        
        lines.splice(insertIndex, 0, hooksImport);
        hasChanges = true;
      }
    }
  } else {
    // Parse existing React import
    const importMatch = currentReactImport.match(/import\s+([^}]+)\s+from\s+['"]react['"]/);
    
    if (importMatch) {
      const importPart = importMatch[1].trim();
      
      // Check different import patterns
      if (importPart.startsWith('React,')) {
        // Pattern: import React, { hooks } from 'react'
        const destructuredPart = importPart.substring(6).trim();
        if (destructuredPart.startsWith('{') && destructuredPart.endsWith('}')) {
          const hooks = destructuredPart.slice(1, -1).split(',').map(h => h.trim());
          const filteredHooks = hooks.filter(h => h && REACT_HOOKS.includes(h));
          
          if (filteredHooks.length > 0) {
            lines[reactImportIndex] = `import { ${filteredHooks.join(', ')} } from 'react';`;
            hasChanges = true;
          } else {
            // No hooks, remove the import entirely
            lines.splice(reactImportIndex, 1);
            hasChanges = true;
          }
        }
      } else if (importPart.startsWith('{') && importPart.endsWith('}')) {
        // Pattern: import { hooks } from 'react'
        // This is already correct for React 19
        const hooks = importPart.slice(1, -1).split(',').map(h => h.trim());
        const validHooks = hooks.filter(h => h && REACT_HOOKS.includes(h));
        
        if (validHooks.length !== hooks.length) {
          lines[reactImportIndex] = `import { ${validHooks.join(', ')} } from 'react';`;
          hasChanges = true;
        }
      } else if (importPart === 'React') {
        // Pattern: import React from 'react'
        // Check if hooks are used
        const usedHooks = REACT_HOOKS.filter(hook => 
          content.includes(hook + '(') || content.includes(hook + '<')
        );
        
        if (usedHooks.length > 0) {
          lines[reactImportIndex] = `import { ${usedHooks.join(', ')} } from 'react';`;
          hasChanges = true;
        } else {
          // No hooks, remove the import
          lines.splice(reactImportIndex, 1);
          hasChanges = true;
        }
      }
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
      console.log(`✅ Fixed React imports in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 Finding TypeScript/TSX files...');
  
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
