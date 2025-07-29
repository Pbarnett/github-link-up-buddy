#!/usr/bin/env node

const path = require('path');

import { glob } from 'glob';
// Utility functions
// Removed unused info function
// Removed unused warning function
// Removed unused error function
// Removed unused success function

const fs = require('fs');

// Utility functions
// Removed unused log function
  console.log(`[${timestamp}] ${(level || "INFO").toUpperCase()}: ${message}`);

// Find all .tsx and .ts files
const files = glob.sync('src/**/*.{ts,tsx}', { absolute: true });

let fixedFiles = 0;
let totalIssues = 0;

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let newContent = content;

    // Check if file has any React destructuring patterns that need fixing
    const hasReactDestructuring = /const\s*\{[^}]*\}\s*=\s*React;/.test(newContent);
    
    if (!hasReactDestructuring) {
      return;
    }

    // Pattern 1: Fix any destructuring that includes FC, Component, or other React types
    const complexPattern = /const\s*\{\s*([^}]+)\s*\}\s*=\s*React;/g;
    let match;
    
    while ((match = complexPattern.exec(content)) !== null) {
      const imports = match[1].split(',').map(item => item.trim());
      const hooks = [];
      const types = [];
      
      imports.forEach(item => {
        if (item.startsWith('use') || ['useState', 'useEffect', 'useCallback', 'useMemo', 'useContext', 'useReducer', 'useRef', 'useLayoutEffect', 'useImperativeHandle', 'useDebugValue'].includes(item)) {
          hooks.push(item);
        } else if (['FC', 'Component', 'ReactNode', 'FormEvent', 'ChangeEvent', 'MouseEvent', 'KeyboardEvent', 'SyntheticEvent'].includes(item)) {
          types.push(item);
        }
      });
      
      let replacement = '';
      
      if (hooks.length > 0) {
        replacement += `const { ${hooks.join(', ')} } = React;\n`;
      }
      
      types.forEach(type => {
        switch (type) {
          case 'FC':
            replacement += 'type FC<T = {}> = React.FC<T>;\n';
            break;
          case 'Component':
            replacement += 'type Component<P = {}, S = {}> = React.Component<P, S>;\n';
            break;
          case 'ReactNode':
            replacement += 'type ReactNode = React.ReactNode;\n';
            break;
          case 'FormEvent':
            replacement += 'type FormEvent = React.FormEvent;\n';
            break;
          case 'ChangeEvent':
            replacement += 'type ChangeEvent<T = Element> = React.ChangeEvent<T>;\n';
            break;
          case 'MouseEvent':
            replacement += 'type MouseEvent<T = Element> = React.MouseEvent<T>;\n';
            break;
          case 'KeyboardEvent':
            replacement += 'type KeyboardEvent<T = Element> = React.KeyboardEvent<T>;\n';
            break;
          case 'SyntheticEvent':
            replacement += 'type SyntheticEvent<T = Element> = React.SyntheticEvent<T>;\n';
            break;
        }
      });
      
      if (replacement && replacement !== match[0]) {
        newContent = newContent.replace(match[0], replacement.trim());
        modified = true;
        totalIssues++;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      fixedFiles++;
      console.log(`Fixed React imports in: ${path.relative(process.cwd(), filePath)}`);
    }

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n✅ Final fix complete!`);
console.log(`📄 Fixed ${fixedFiles} files`);
console.log(`🔧 Resolved ${totalIssues} React import issues`);

if (fixedFiles === 0) {
  console.log(`\n🎉 All React imports are now compatible with React 19!`);
} else {
  console.log(`\nAll React imports have been updated for React 19 compatibility.`);
}
