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

function fixReactImports(content) {
  // Fix various React import patterns for React 19
  const fixes = [
    // Fix 'import * as React from "react"' followed by named imports
    {
      pattern: /import \* as React from ['"]react['"];\s*import \{ ([^}]+) \} from ['"]react['"];/g,
      replacement: 'import React, { $1 } from "react";'
    },
    
    // Fix standalone 'import * as React from "react"'
    {
      pattern: /^import \* as React from ['"]react['"];$/gm,
      replacement: 'import React from "react";'
    },
    
    // Fix duplicate React imports
    {
      pattern: /import \* as React from ['"]react['"];\s*import \* as React from ['"]react['"];/g,
      replacement: 'import React from "react";'
    },
    
    // Fix React namespace usage for hooks in React 19 style
    {
      pattern: /React\.useState/g,
      replacement: 'useState'
    },
    {
      pattern: /React\.useEffect/g,
      replacement: 'useEffect'
    },
    {
      pattern: /React\.useCallback/g,
      replacement: 'useCallback'
    },
    {
      pattern: /React\.useMemo/g,
      replacement: 'useMemo'
    },
    {
      pattern: /React\.useRef/g,
      replacement: 'useRef'
    },
    {
      pattern: /React\.useContext/g,
      replacement: 'useContext'
    },
    {
      pattern: /React\.useReducer/g,
      replacement: 'useReducer'
    },
    {
      pattern: /React\.lazy/g,
      replacement: 'lazy'
    },
    {
      pattern: /React\.Suspense/g,
      replacement: 'Suspense'
    },
    {
      pattern: /React\.startTransition/g,
      replacement: 'startTransition'
    },
    {
      pattern: /React\.useTransition/g,
      replacement: 'useTransition'
    },
    
    // Fix React type imports
    {
      pattern: /React\.FC/g,
      replacement: 'FC'
    },
    {
      pattern: /React\.ReactNode/g,
      replacement: 'ReactNode'
    },
    {
      pattern: /React\.FormEvent/g,
      replacement: 'FormEvent'
    },
    {
      pattern: /React\.ChangeEvent/g,
      replacement: 'ChangeEvent'
    },
    {
      pattern: /React\.MouseEvent/g,
      replacement: 'MouseEvent'
    },
    {
      pattern: /React\.Component/g,
      replacement: 'Component'
    },
    {
      pattern: /React\.ComponentType/g,
      replacement: 'ComponentType'
    },
    {
      pattern: /React\.ErrorInfo/g,
      replacement: 'ErrorInfo'
    }
  ];
  
  let fixedContent = content;
  for (const fix of fixes) {
    fixedContent = fixedContent.replace(fix.pattern, fix.replacement);
  }
  
  return fixedContent;
}

function ensureRequiredImports(content) {
  // Extract existing imports
  const importMatch = content.match(/import[^;]+from ['"]react['"];/);
  if (!importMatch) return content;
  
  const existingImport = importMatch[0];
  
  // Find all used React hooks and types in the file
  const usedHooks = [];
  const usedTypes = [];
  
  // Check for hooks usage
  const hooks = ['useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useContext', 'useReducer', 'lazy', 'Suspense', 'startTransition', 'useTransition'];
  const types = ['FC', 'ReactNode', 'FormEvent', 'ChangeEvent', 'MouseEvent', 'Component', 'ComponentType', 'ErrorInfo'];
  
  for (const hook of hooks) {
    if (content.includes(hook) && !existingImport.includes(hook)) {
      usedHooks.push(hook);
    }
  }
  
  for (const type of types) {
    if (content.includes(type) && !existingImport.includes(type)) {
      usedTypes.push(type);
    }
  }
  
  if (usedHooks.length === 0 && usedTypes.length === 0) {
    return content;
  }
  
  // Build new import statement
  let newImport = existingImport;
  
  // Extract existing named imports
  const namedImportsMatch = existingImport.match(/\{ ([^}]+) \}/);
  let existingImports = namedImportsMatch ? namedImportsMatch[1].split(',').map(s => s.trim()) : [];
  
  // Add missing imports
  const allNewImports = [...new Set([...existingImports, ...usedHooks, ...usedTypes])];
  
  if (allNewImports.length > 0) {
    newImport = `import React, { ${allNewImports.join(', ')} } from "react";`;
  } else {
    newImport = `import React from "react";`;
  }
  
  return content.replace(existingImport, newImport);
}

function fixReactHookFormUsage(content) {
  // Fix React Hook Form patterns for better TypeScript support
  const hookFormFixes = [
    // Update useForm with proper TypeScript generics
    {
      pattern: /useForm\(\)/g,
      replacement: 'useForm<FormData>()'
    },
    
    // Fix controller render prop typing
    {
      pattern: /render=\{\(\{ field \}\) => \(/g,
      replacement: 'render={({ field }) => ('
    }
  ];
  
  let fixedContent = content;
  for (const fix of hookFormFixes) {
    fixedContent = fixedContent.replace(fix.pattern, fix.replacement);
  }
  
  return fixedContent;
}

// Main execution
console.log('Starting React 19 import fixes...');

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
    
    // Apply all fixes
    fixedContent = fixReactImports(fixedContent);
    fixedContent = ensureRequiredImports(fixedContent);
    fixedContent = fixReactHookFormUsage(fixedContent);
    
    // Write back if changed
    if (fixedContent !== originalContent) {
      fs.writeFileSync(filePath, fixedContent);
      console.log(`✓ Fixed imports in: ${filePath}`);
      modifiedCount++;
    }
    
    processedCount++;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

console.log(`\nProcessed ${processedCount} files, modified ${modifiedCount} files.`);
console.log('React 19 import fixes completed!');
