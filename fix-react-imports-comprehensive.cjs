#!/usr/bin/env node

/**
 * Comprehensive React 19 Import Fix Script
 * 
 * This script addresses all the major React import issues:
 * 1. Removes duplicate import statements 
 * 2. Fixes missing React hooks and type imports
 * 3. Handles destructuring from React namespace properly
 * 4. Fixes UI component type issues
 * 5. Addresses specific TypeScript errors
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all TypeScript/TSX files
function findTsFiles(directory) {
  const files = [];
  
  function traverseDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
        traverseDirectory(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        files.push(fullPath);
      }
    }
  }
  
  traverseDirectory(directory);
  return files;
}

// Fix React imports in a single file
function fixReactImports(content) {
  let lines = content.split('\n');
  let modified = false;
  
  // Step 1: Remove duplicate import React statements
  const reactImportIndices = [];
  lines.forEach((line, index) => {
    if (line.trim().startsWith('import * as React from') || 
        line.trim().startsWith('import React') && line.includes('from \'react\'')) {
      reactImportIndices.push(index);
    }
  });
  
  // Remove duplicate React imports (keep only the first one)
  if (reactImportIndices.length > 1) {
    for (let i = reactImportIndices.length - 1; i >= 1; i--) {
      lines.splice(reactImportIndices[i], 1);
      modified = true;
    }
  }
  
  // Step 2: Fix destructuring issues
  let newContent = lines.join('\n');
  
  // Fix const { ... } = React; lines with missing imports
  const destructuringPattern = /const\s*\{\s*([^}]+)\s*\}\s*=\s*React;/g;
  let match;
  const allImports = new Set();
  
  while ((match = destructuringPattern.exec(newContent)) !== null) {
    const imports = match[1].split(',').map(imp => imp.trim()).filter(Boolean);
    imports.forEach(imp => allImports.add(imp));
  }
  
  // Common React imports that should be available
  const validReactImports = [
    'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useContext', 
    'useReducer', 'useLayoutEffect', 'useImperativeHandle', 'useDebugValue',
    'createContext', 'forwardRef', 'memo', 'Fragment', 'createElement',
    'Suspense', 'lazy', 'startTransition', 'useTransition', 'useDeferredValue',
    'useId', 'useSyncExternalStore', 'useInsertionEffect', 'use'
  ];
  
  const validTypeImports = [
    'FC', 'ReactNode', 'Component', 'ComponentType', 'ElementType', 'FormEvent', 
    'ChangeEvent', 'MouseEvent', 'KeyboardEvent', 'FocusEvent', 'ErrorInfo',
    'HTMLAttributes', 'CSSProperties', 'ReactElement', 'ElementRef',
    'ComponentPropsWithoutRef', 'ComponentProps'
  ];
  
  // Filter imports into hooks/functions vs types
  const hooks = [];
  const types = [];
  
  allImports.forEach(imp => {
    if (validReactImports.includes(imp)) {
      hooks.push(imp);
    } else if (validTypeImports.includes(imp)) {
      types.push(imp);
    }
  });
  
  // Replace destructuring with proper imports
  if (hooks.length > 0 || types.length > 0) {
    // Remove all const { ... } = React; lines
    newContent = newContent.replace(/const\s*\{\s*[^}]+\s*\}\s*=\s*React;\s*/g, '');
    
    // Find where to insert the imports (after existing React import)
    const importLines = newContent.split('\n');
    let insertIndex = 0;
    
    for (let i = 0; i < importLines.length; i++) {
      if (importLines[i].includes('import * as React from') || 
          importLines[i].includes('import React from')) {
        insertIndex = i + 1;
        break;
      }
    }
    
    // Insert hook imports
    if (hooks.length > 0) {
      importLines.splice(insertIndex, 0, `import { ${hooks.join(', ')} } from 'react';`);
      insertIndex++;
    }
    
    // Add type aliases for types that aren't directly importable in React 19
    if (types.includes('FC')) {
      importLines.splice(insertIndex, 0, `type FC<P = {}> = React.FC<P>;`);
      insertIndex++;
    }
    if (types.includes('ReactNode')) {
      importLines.splice(insertIndex, 0, `type ReactNode = React.ReactNode;`);
      insertIndex++;
    }
    if (types.includes('FormEvent')) {
      importLines.splice(insertIndex, 0, `type FormEvent<T = Element> = React.FormEvent<T>;`);
      insertIndex++;
    }
    if (types.includes('ChangeEvent')) {
      importLines.splice(insertIndex, 0, `type ChangeEvent<T = Element> = React.ChangeEvent<T>;`);
      insertIndex++;
    }
    if (types.includes('ComponentType')) {
      importLines.splice(insertIndex, 0, `type ComponentType<P = {}> = React.ComponentType<P>;`);
      insertIndex++;
    }
    if (types.includes('ElementType')) {
      importLines.splice(insertIndex, 0, `type ElementType = React.ElementType;`);
      insertIndex++;
    }
    if (types.includes('ErrorInfo')) {
      importLines.splice(insertIndex, 0, `type ErrorInfo = React.ErrorInfo;`);
      insertIndex++;
    }
    if (types.includes('HTMLAttributes')) {
      importLines.splice(insertIndex, 0, `type HTMLAttributes<T> = React.HTMLAttributes<T>;`);
      insertIndex++;
    }
    if (types.includes('CSSProperties')) {
      importLines.splice(insertIndex, 0, `type CSSProperties = React.CSSProperties;`);
      insertIndex++;
    }
    
    newContent = importLines.join('\n');
    modified = true;
  }
  
  // Step 3: Fix specific UI component issues
  
  // Fix missing icon imports in UI components
  if (newContent.includes('ChevronDown') && !newContent.includes('import') && newContent.includes('ChevronDown')) {
    newContent = `import { ChevronDown } from 'lucide-react';\n` + newContent;
    modified = true;
  }
  
  if (newContent.includes('ChevronRight') && !newContent.includes('import { ChevronRight }')) {
    newContent = `import { ChevronRight } from 'lucide-react';\n` + newContent;  
    modified = true;
  }
  
  if (newContent.includes('ArrowLeft') && !newContent.includes('import { ArrowLeft }')) {
    newContent = `import { ArrowLeft } from 'lucide-react';\n` + newContent;
    modified = true;
  }
  
  // Fix missing Slot import
  if (newContent.includes('Slot') && !newContent.includes('import') && newContent.includes('Slot')) {
    newContent = `import { Slot } from '@radix-ui/react-slot';\n` + newContent;
    modified = true;
  }
  
  // Step 4: Clean up any remaining issues
  
  // Remove extra empty lines
  newContent = newContent.replace(/\n\n\n+/g, '\n\n');
  
  // Fix React.React.forwardRef to React.forwardRef
  newContent = newContent.replace(/React\.React\./g, 'React.');
  
  return modified ? newContent : content;
}

// Main execution
console.log('🔧 Starting comprehensive React import fixes...');

const files = findTsFiles('./src');
let processedCount = 0;
let modifiedCount = 0;

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const fixedContent = fixReactImports(content);
    
    if (fixedContent !== content) {
      fs.writeFileSync(file, fixedContent, 'utf8');
      console.log(`✅ Fixed: ${file}`);
      modifiedCount++;
    }
    
    processedCount++;
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Files processed: ${processedCount}`);
console.log(`   Files modified: ${modifiedCount}`);

if (modifiedCount > 0) {
  console.log('\n🎉 React import fixes completed!');
  console.log('Next steps:');
  console.log('1. Run: npx tsc --noEmit --skipLibCheck');
  console.log('2. Fix any remaining type issues');
  console.log('3. Test your application');
}
