#!/usr/bin/env node

const path = require('path');

/**
 * Script to fix React import patterns for TypeScript compatibility
const fs = require('fs');
 * Based on React 19 documentation and TypeScript best practices
 * 
 * This script will:
 * 1. Fix `import React, { useState } from 'react'` patterns
 * 2. Convert to individual hook imports or namespace imports
 * 3. Ensure FC imports are correct
 */

const PROJECT_ROOT = path.resolve(__'..');

// React hooks that commonly need to be imported
const REACT_HOOKS = [
  'useState', 'useEffect', 'useContext', 'useReducer', 'useCallback', 
  'useMemo', 'useRef', 'useImperativeHandle', 'useLayoutEffect', 
  'useDebugValue', 'useDeferredValue', 'useTransition', 'useId',
  'useSyncExternalStore', 'useInsertionEffect'
];

// React utilities and components
const REACT_UTILITIES = [
  'Component', 'PureComponent', 'memo', 'forwardRef', 'lazy', 'Suspense',
  'Fragment', 'createElement', 'createContext', 'createRef', 'Children',
  'cloneElement', 'isValidElement', 'startTransition'
];

// React types
const REACT_TYPES = ['FC', 'ReactNode', 'ReactElement', 'ComponentProps', 'PropsWithChildren'];

async function findTsxFiles(dir) {
  const files = [];
  
  async function traverse(currentDir) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          // Skip node_modules and other build directories
          if (['node_modules', 'dist', 'build', '.git', 'coverage'].includes(entry.name)) {
            continue;
          }
          await traverse(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
          files.push(fullPath);
        }
      }
    } catch {
      console.warn(`Warning: Could not read directory ${currentDir}:`, error.message);
    }
  }
  
  await traverse(dir);
  return files;
}

function analyzeImports(content) {
  const lines = content.split('\n');
  let reactImportLine = -1;
  let reactImportContent = '';
  
  // Find React import line(s)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('import') && line.includes('from \'react\'') || line.includes('from "react"')) {
      reactImportLine = i;
      reactImportContent = line;
      break;
    }
  }
  
  return { reactImportLine, reactImportContent, lines };
}

function extractImports(importContent) {
  const imports = {
    hasReactDefault: false,
    hooks: [],
    utilities: [],
    types: []
  };
  
  // Check for default React import
  if (importContent.includes('import React')) {
    imports.hasReactDefault = true;
  }
  
  // Extract named imports
  const namedImportMatch = importContent.match(/\{([^}]+)\}/);
  if (namedImportMatch) {
    const namedImports = namedImportMatch[1]
      .split(',')
      .map(imp => imp.trim())
      .filter(imp => imp);
    
    namedImports.forEach(imp => {
      if (REACT_HOOKS.includes(imp)) {
        imports.hooks.push(imp);
      } else if (REACT_UTILITIES.includes(imp)) {
        imports.utilities.push(imp);
      } else if (REACT_TYPES.includes(imp)) {
        imports.types.push(imp);
      }
    });
  }
  
  return imports;
}

function generateFixedImport(imports) {
  const importParts = [];
  
  // For hooks and utilities, use individual imports (recommended by React 19 docs)
  if (imports.hooks.length > 0 || imports.utilities.length > 0) {
    const namedImports = [...imports.hooks, ...imports.utilities];
    importParts.push(`import { ${namedImports.join(', ')} } from 'react';`);
  }
  
  // For types, use separate type import (TypeScript best practice)
  if (imports.types.length > 0) {
    importParts.push(`import type { ${imports.types.join(', ')} } from 'react';`);
  }
  
  // If we need React namespace (for JSX or other React.* usage), add it
  if (imports.hasReactDefault) {
    // Check if we actually need React namespace or just hooks
    // For now, we'll be conservative and include it
    if (importParts.length === 0 || imports.utilities.some(u => ['Component', 'PureComponent'].includes(u))) {
      importParts.unshift(`import * as React from 'react';`);
    }
  }
  
  return importParts.join('\n');
}

function needsReactNamespace(content) {
  // Check if code uses React.* patterns that require namespace import
  const reactNamespacePatterns = [
    /React\./,
    /React\.Component/,
    /React\.createElement/,
    /React\.Fragment/,
    /<React\.Fragment/,
    /React\.memo/,
    /React\.forwardRef/
  ];
  
  return reactNamespacePatterns.some(pattern => pattern.test(content));
}

async function fixFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const { reactImportLine, reactImportContent, lines } = analyzeImports(content);
    
    if (reactImportLine === -1) {
      // No React import found, skip
      return { fixed: false, reason: 'No React import found' };
    }
    
    const imports = extractImports(reactImportContent);
    
    // Skip if import is already correct (namespace import)
    if (reactImportContent.includes('import * as React from') && !reactImportContent.includes('{')) {
      return { fixed: false, reason: 'Already using correct namespace import' };
    }
    
    // Generate fixed import
    const fixedImport = generateFixedImport(imports);
    
    // If content uses React.* patterns, ensure we have namespace import
    if (needsReactNamespace(content) && !fixedImport.includes('import * as React')) {
      const namespaceImport = `import * as React from 'react';\n${fixedImport}`;
      lines[reactImportLine] = namespaceImport;
    } else {
      lines[reactImportLine] = fixedImport;
    }
    
    const fixedContent = lines.join('\n');
    await fs.writeFile(filePath, fixedContent, 'utf-8');
    
    return { fixed: true, reason: `Fixed React imports: ${reactImportContent} → ${fixedImport}` };
  } catch (error) {
    return { fixed: false, reason: `Error processing file: ${error.message}` };
  }
}

async function main() {
  console.log('🔧 Fixing React import patterns...\n');
  
  // Find all TypeScript/TSX files
  const srcFiles = await findTsxFiles(path.join(PROJECT_ROOT, 'src'));
  const appFiles = await findTsxFiles(path.join(PROJECT_ROOT, 'app'));
  const allFiles = [...srcFiles, ...appFiles];
  
  console.log(`Found ${allFiles.length} TypeScript files to process\n`);
  
  let fixedCount = 0;
  let skippedCount = 0;
  const results = [];
  
  for (const filePath of allFiles) {
    const relativePath = path.relative(PROJECT_ROOT, filePath);
    const result = await fixFile(filePath);
    
    if (result.fixed) {
      console.log(`✅ ${relativePath}: ${result.reason}`);
      fixedCount++;
    } else {
      console.log(`⏭️  ${relativePath}: ${result.reason}`);
      skippedCount++;
    }
    
    results.push({ file: relativePath, ...result });
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Fixed: ${fixedCount} files`);
  console.log(`   Skipped: ${skippedCount} files`);
  console.log(`   Total: ${allFiles.length} files`);
  
  if (fixedCount > 0) {
    console.log('\n✨ React imports have been fixed! Run `npm run tsc` to verify.');
  }
}

main().catch(console.error);
