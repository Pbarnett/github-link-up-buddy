#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Find all TypeScript/TSX files in src directory
function findTsxFiles(dir) {
  const files = [];
  
  function walkDir(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        walkDir(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(dir);
  return files;
}

// Analyze React imports in a file
function analyzeReactImports(content) {
  const lines = content.split('\n');
  const imports = {
    react: [],
    hooks: new Set(),
    components: new Set(),
    types: new Set(),
    other: new Set()
  };
  
  const reactImportLines = [];
  
  lines.forEach((line, index) => {
    if (line.trim().startsWith('import') && line.includes('react')) {
      reactImportLines.push({ line: line.trim(), index });
      
      // Parse different import patterns
      if (line.includes("import * as React from 'react'")) {
        imports.react.push('* as React');
      } else if (line.includes("import React")) {
        imports.react.push('React');
      } else if (line.includes("from 'react'") || line.includes('from "react"')) {
        // Extract named imports
        const match = line.match(/import\s+{([^}]+)}\s+from\s+['"]react['"]/);
        if (match) {
          const namedImports = match[1].split(',').map(imp => imp.trim());
          namedImports.forEach(imp => {
            if (['useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useContext', 'useReducer', 'useLayoutEffect', 'useImperativeHandle', 'useDebugValue'].includes(imp)) {
              imports.hooks.add(imp);
            } else if (['createContext', 'forwardRef', 'memo', 'lazy', 'Suspense', 'Fragment'].includes(imp)) {
              imports.components.add(imp);
            } else if (imp.includes('Type') || imp.includes('Props') || ['ReactNode', 'ReactElement', 'ComponentProps', 'HTMLAttributes', 'RefObject'].includes(imp)) {
              imports.types.add(imp);
            } else {
              imports.other.add(imp);
            }
          });
        }
      }
    }
  });
  
  return { imports, reactImportLines };
}

// Check for destructuring assignments from React
function findReactDestructuring(content) {
  const destructuringPattern = /const\s+{\s*([^}]+)\s*}\s*=\s*React;/g;
  const matches = [];
  let match;
  
  while ((match = destructuringPattern.exec(content)) !== null) {
    const destructured = match[1].split(',').map(item => item.trim());
    matches.push({ destructured, fullMatch: match[0] });
  }
  
  return matches;
}

// Generate clean React import
function generateCleanImport(imports) {
  const parts = [];
  
  // Always use named imports instead of namespace imports
  if (imports.react.length > 0 || imports.hooks.size > 0 || imports.components.size > 0 || imports.other.size > 0) {
    const namedImports = [];
    
    // Add hooks
    imports.hooks.forEach(hook => namedImports.push(hook));
    
    // Add components
    imports.components.forEach(comp => namedImports.push(comp));
    
    // Add types
    imports.types.forEach(type => namedImports.push(type));
    
    // Add other imports
    imports.other.forEach(other => namedImports.push(other));
    
    if (namedImports.length > 0) {
      parts.push(`import { ${namedImports.join(', ')} } from 'react';`);
    }
  }
  
  return parts;
}

// Fix React imports in a file
function fixReactImports(filePath) {
  console.log(`\nAnalyzing: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const { imports, reactImportLines } = analyzeReactImports(content);
  const destructuringMatches = findReactDestructuring(content);
  
  // Check if there are issues
  const hasMultipleReactImports = reactImportLines.length > 1;
  const hasDestructuring = destructuringMatches.length > 0;
  const hasDuplicateHooks = imports.hooks.size > 0 && (
    reactImportLines.some(imp => imp.line.includes('useState')) && 
    destructuringMatches.some(dest => dest.destructured.includes('useState'))
  );
  
  if (!hasMultipleReactImports && !hasDestructuring && !hasDuplicateHooks) {
    console.log('  ✅ No issues found');
    return false;
  }
  
  console.log('  🔧 Issues found:');
  if (hasMultipleReactImports) console.log('    - Multiple React import lines');
  if (hasDestructuring) console.log('    - React destructuring assignments');
  if (hasDuplicateHooks) console.log('    - Potential duplicate hook imports');
  
  // Collect all hooks and components from destructuring
  destructuringMatches.forEach(match => {
    match.destructured.forEach(item => {
      if (['useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useContext', 'useReducer', 'useLayoutEffect', 'useImperativeHandle', 'useDebugValue'].includes(item)) {
        imports.hooks.add(item);
      } else if (['createContext', 'forwardRef', 'memo', 'lazy', 'Suspense', 'Fragment'].includes(item)) {
        imports.components.add(item);
      } else {
        imports.other.add(item);
      }
    });
  });
  
  // Remove old React import lines and destructuring
  let newLines = [...lines];
  
  // Remove React import lines (in reverse order to maintain indices)
  reactImportLines.reverse().forEach(impLine => {
    newLines.splice(impLine.index, 1);
  });
  
  // Remove destructuring lines
  destructuringMatches.forEach(match => {
    const lineIndex = newLines.findIndex(line => line.includes(match.fullMatch));
    if (lineIndex !== -1) {
      newLines.splice(lineIndex, 1);
    }
  });
  
  // Generate clean import
  const cleanImports = generateCleanImport(imports);
  
  // Find the best place to insert the new import (after other imports)
  let insertIndex = 0;
  for (let i = 0; i < newLines.length; i++) {
    if (newLines[i].trim().startsWith('import')) {
      insertIndex = i + 1;
    } else if (newLines[i].trim() === '' && insertIndex > 0) {
      break;
    } else if (!newLines[i].trim().startsWith('import') && !newLines[i].trim().startsWith('//') && newLines[i].trim() !== '' && insertIndex > 0) {
      break;
    }
  }
  
  // Insert clean imports
  cleanImports.reverse().forEach(imp => {
    newLines.splice(insertIndex, 0, imp);
  });
  
  // Write the fixed content
  const newContent = newLines.join('\n');
  fs.writeFileSync(filePath, newContent, 'utf8');
  
  console.log('  ✅ Fixed');
  return true;
}

// Main execution
function main() {
  const srcDir = path.join(__dirname, 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.log('❌ src directory not found');
    return;
  }
  
  console.log('🔍 Finding TypeScript files...');
  const files = findTsxFiles(srcDir);
  console.log(`📁 Found ${files.length} TypeScript files`);
  
  let fixedCount = 0;
  
  files.forEach(file => {
    if (fixReactImports(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total files: ${files.length}`);
  console.log(`   Files fixed: ${fixedCount}`);
  console.log(`   Files clean: ${files.length - fixedCount}`);
  
  if (fixedCount > 0) {
    console.log('\n✅ React import issues have been fixed!');
    console.log('🔄 Please restart your dev server to see the changes.');
  } else {
    console.log('\n✅ No React import issues found!');
  }
}

main();
