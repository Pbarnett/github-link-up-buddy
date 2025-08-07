#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Find all UI component files
const files = glob.sync('src/components/ui/**/*.{ts,tsx}', { absolute: true });

let fixedFiles = 0;
let totalIssues = 0;

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let modified = false;

    // Fix pattern: const { ..., ElementRef, ComponentPropsWithoutRef, ... } = React;
    const reactTypesPattern = /const\s*\{\s*([^}]+)\s*\}\s*=\s*React;/g;
    let match;
    
    while ((match = reactTypesPattern.exec(content)) !== null) {
      const items = match[1].split(',').map(item => item.trim());
      const hooks = [];
      const types = [];
      
      items.forEach(item => {
        // React hooks and functions that can be destructured
        if (['useState', 'useEffect', 'useCallback', 'useMemo', 'useContext', 'useReducer', 'useRef', 'useLayoutEffect', 'useImperativeHandle', 'useDebugValue', 'forwardRef', 'createContext', 'memo', 'lazy', 'Suspense', 'Fragment'].includes(item)) {
          hooks.push(item);
        } 
        // React types that should be type aliases
        else if (['FC', 'Component', 'ReactNode', 'FormEvent', 'ChangeEvent', 'MouseEvent', 'KeyboardEvent', 'SyntheticEvent', 'ElementRef', 'ComponentPropsWithoutRef', 'ComponentRef', 'HTMLAttributes', 'SVGAttributes', 'PropsWithChildren', 'PropsWithRef', 'RefObject', 'MutableRefObject'].includes(item)) {
          types.push(item);
        }
        else {
          // Unknown item, keep it as a hook for safety
          hooks.push(item);
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
          case 'ElementRef':
            replacement += 'type ElementRef<T> = React.ElementRef<T>;\n';
            break;
          case 'ComponentPropsWithoutRef':
            replacement += 'type ComponentPropsWithoutRef<T> = React.ComponentPropsWithoutRef<T>;\n';
            break;
          case 'ComponentRef':
            replacement += 'type ComponentRef<T> = React.ComponentRef<T>;\n';
            break;
          case 'HTMLAttributes':
            replacement += 'type HTMLAttributes<T = HTMLElement> = React.HTMLAttributes<T>;\n';
            break;
          case 'SVGAttributes':
            replacement += 'type SVGAttributes<T = SVGElement> = React.SVGAttributes<T>;\n';
            break;
          case 'PropsWithChildren':
            replacement += 'type PropsWithChildren<T = {}> = React.PropsWithChildren<T>;\n';
            break;
          case 'PropsWithRef':
            replacement += 'type PropsWithRef<T = {}> = React.PropsWithRef<T>;\n';
            break;
          case 'RefObject':
            replacement += 'type RefObject<T = any> = React.RefObject<T>;\n';
            break;
          case 'MutableRefObject':
            replacement += 'type MutableRefObject<T = any> = React.MutableRefObject<T>;\n';
            break;
        }
      });
      
      if (replacement && replacement.trim() !== match[0].trim()) {
        newContent = newContent.replace(match[0], replacement.trim());
        modified = true;
        totalIssues++;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      fixedFiles++;
      console.log(`Fixed UI React types in: ${path.relative(process.cwd(), filePath)}`);
    }

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n✅ UI React types fix complete!`);
console.log(`📄 Fixed ${fixedFiles} files`);
console.log(`🔧 Resolved ${totalIssues} React type issues`);

if (fixedFiles === 0) {
  console.log(`\n🎉 All UI React types are now compatible with React 19!`);
} else {
  console.log(`\nAll UI React types have been updated for React 19 compatibility.`);
}
