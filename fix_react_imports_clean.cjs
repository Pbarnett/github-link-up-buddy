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

// Fix React imports in a file
function fixReactImports(filePath) {
  console.log(`Analyzing: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Find all React-related imports and destructuring
  const reactImportIndices = [];
  const destructuringIndices = [];
  const allReactHooks = new Set();
  const allReactComponents = new Set();
  const allReactOther = new Set();
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Find React import lines
    if (trimmedLine.startsWith('import') && (trimmedLine.includes("from 'react'") || trimmedLine.includes('from "react"'))) {
      reactImportIndices.push(index);
      
      // Extract named imports
      const namedImportMatch = trimmedLine.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]react['"]/);
      if (namedImportMatch) {
        const imports = namedImportMatch[1].split(',').map(imp => imp.trim());
        imports.forEach(imp => {
          if (['useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useContext', 'useReducer', 'useLayoutEffect', 'useImperativeHandle', 'useDebugValue'].includes(imp)) {
            allReactHooks.add(imp);
          } else if (['createContext', 'forwardRef', 'memo', 'lazy', 'Suspense', 'Fragment', 'Component', 'PureComponent', 'createElement'].includes(imp)) {
            allReactComponents.add(imp);
          } else if (['ReactNode', 'ReactElement', 'ComponentProps', 'HTMLAttributes', 'RefObject'].includes(imp)) {
            // Skip type imports for now
          } else {
            allReactOther.add(imp);
          }
        });
      }
    }
    
    // Find destructuring assignments from React
    if (trimmedLine.includes('const') && trimmedLine.includes('=') && trimmedLine.includes('React;')) {
      const destructMatch = trimmedLine.match(/const\s*{\s*([^}]+)\s*}\s*=\s*React;/);
      if (destructMatch) {
        destructuringIndices.push(index);
        const destructured = destructMatch[1].split(',').map(item => item.trim());
        destructured.forEach(item => {
          if (['useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useContext', 'useReducer', 'useLayoutEffect', 'useImperativeHandle', 'useDebugValue'].includes(item)) {
            allReactHooks.add(item);
          } else if (['createContext', 'forwardRef', 'memo', 'lazy', 'Suspense', 'Fragment', 'Component', 'PureComponent', 'createElement'].includes(item)) {
            allReactComponents.add(item);
          } else {
            allReactOther.add(item);
          }
        });
      }
    }
  });
  
  // Check if there are any issues to fix
  const hasMultipleReactImports = reactImportIndices.length > 1;
  const hasDestructuring = destructuringIndices.length > 0;
  const hasImportsAndDestructuring = reactImportIndices.length > 0 && destructuringIndices.length > 0;
  
  if (!hasMultipleReactImports && !hasDestructuring && !hasImportsAndDestructuring) {
    console.log('  ✅ No issues found');
    return false;
  }
  
  console.log('  🔧 Fixing React imports...');
  
  // Create a new list of lines without the old React imports and destructuring
  let newLines = [...lines];
  
  // Remove all React import lines and destructuring lines (in reverse order to maintain indices)
  const allIndicesToRemove = [...reactImportIndices, ...destructuringIndices].sort((a, b) => b - a);
  allIndicesToRemove.forEach(index => {
    newLines.splice(index, 1);
  });
  
  // Create the new React import line
  const allImports = [...allReactHooks, ...allReactComponents, ...allReactOther];
  if (allImports.length > 0) {
    const newImportLine = `import { ${allImports.join(', ')} } from 'react';`;
    
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
    
    // Insert the new import line
    newLines.splice(insertIndex, 0, newImportLine);
  }
  
  // Write the fixed content back to the file
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
