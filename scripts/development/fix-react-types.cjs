#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all tsx files in UI components
const findUIComponents = () => {
  try {
    const output = execSync(`find src/components/ui -name "*.tsx"`, { encoding: 'utf8' });
    return output.trim().split('\n').filter(file => file.length > 0);
  } catch (error) {
    console.log('No files found or error:', error.message);
    return [];
  }
};

// React types that need to be imported
const REACT_TYPES = [
  'ComponentPropsWithoutRef', 'ElementRef', 'HTMLAttributes', 
  'ButtonHTMLAttributes', 'InputHTMLAttributes', 'TextareaHTMLAttributes',
  'ThHTMLAttributes', 'TdHTMLAttributes', 'ComponentProps', 'KeyboardEvent',
  'CSSProperties', 'ElementType', 'FC', 'ReactNode', 'ReactElement',
  'ChangeEvent', 'FormEvent'
];

const REACT_FUNCTIONS = [
  'forwardRef', 'createContext', 'useId'
];

// Fix imports in a file
const fixReactTypes = (filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if this file uses React types or functions that need namespace import
    const needsTypeImports = REACT_TYPES.some(type => content.includes(type));
    const needsFunctionImports = REACT_FUNCTIONS.some(fn => content.includes(fn + '(') || content.includes(fn + '<'));
    
    // If file doesn't use any React types/functions, skip
    if (!needsTypeImports && !needsFunctionImports) {
      return { fixed: false, reason: 'No React types needed' };
    }
    
    // Check for problematic import patterns
    const hasProblematicImports = content.match(/import \{ forwardRef.*\} from ['"]react['"];/);
    const hasNamespaceImport = content.includes('import * as React from');
    
    // If already has namespace import and no problematic imports, likely okay
    if (hasNamespaceImport && !hasProblematicImports) {
      return { fixed: false, reason: 'Already using namespace import' };
    }
    
    // Find the first React import line
    const reactImportMatch = content.match(/^import.+from ['"]react['"];$/m);
    if (!reactImportMatch) {
      return { fixed: false, reason: 'No React import found' };
    }
    
    // Build new imports
    let newImports = [];
    
    // Always use namespace import for React to avoid compatibility issues
    newImports.push('import * as React from \'react\';');
    
    // Find what types are actually used
    const usedTypes = REACT_TYPES.filter(type => content.includes(type));
    if (usedTypes.length > 0) {
      newImports.push(`import type { ${usedTypes.join(', ')} } from 'react';`);
    }
    
    // Find what functions are needed
    const usedFunctions = REACT_FUNCTIONS.filter(fn => 
      content.includes(fn + '(') || content.includes(fn + '<')
    );
    if (usedFunctions.length > 0) {
      newImports.push('');
      newImports.push(`const { ${usedFunctions.join(', ')} } = React;`);
    }
    
    // Replace the first React import with our new imports
    const newImportBlock = newImports.join('\n');
    content = content.replace(reactImportMatch[0], newImportBlock);
    modified = true;
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed types in: ${filePath}`);
      return { fixed: true, reason: `Fixed imports: ${usedTypes.concat(usedFunctions).join(', ')}` };
    } else {
      return { fixed: false, reason: 'No changes needed' };
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return { fixed: false, reason: `Error: ${error.message}` };
  }
};

// Main execution
const files = findUIComponents();
console.log(`Found ${files.length} UI component files to fix...`);

let fixedCount = 0;
files.forEach(file => {
  const result = fixReactTypes(file);
  if (result.fixed) {
    fixedCount++;
  }
  console.log(`${result.fixed ? '✅' : '⏭️'} ${file}: ${result.reason}`);
});

console.log(`\n✨ Fixed ${fixedCount} UI component files`);
console.log('Run `npm run tsc --noEmit` to check for remaining errors');
