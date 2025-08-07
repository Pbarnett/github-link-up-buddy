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

function fixReact19Imports(content) {
  let fixedContent = content;
  
  // Skip files that don't import React
  if (!fixedContent.includes('from "react"') && !fixedContent.includes("from 'react'")) {
    return content;
  }
  
  // Find all React imports and extract what's being imported
  const reactImportRegex = /import\s+(?:React,?\s*)?(?:\{([^}]*)\})?\s+from\s+['"]react['"];?/g;
  
  let allNamedImports = [];
  let hasDefaultReact = false;
  let reactImports = [];
  
  // Collect all React import statements
  const matches = [...fixedContent.matchAll(reactImportRegex)];
  
  for (const match of matches) {
    reactImports.push(match[0]);
    
    // Check for default React import
    if (match[0].includes('React,') || match[0].match(/import\s+React\s+from/) || match[0].includes('* as React')) {
      hasDefaultReact = true;
    }
    
    // Extract named imports
    if (match[1]) {
      const namedImports = match[1]
        .split(',')
        .map(s => s.trim())
        .filter(s => s && s !== 'React');
      allNamedImports.push(...namedImports);
    }
  }
  
  if (reactImports.length === 0) return content;
  
  // Remove duplicate named imports
  allNamedImports = [...new Set(allNamedImports)];
  
  // Scan content for React hooks and types that might be used
  const hooksAndTypes = [
    'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useContext', 
    'useReducer', 'useLayoutEffect', 'useImperativeHandle', 'useInsertionEffect',
    'useDeferredValue', 'useTransition', 'startTransition', 'useSyncExternalStore',
    'useId', 'useActionState', 'useOptimistic', 'use', 'lazy', 'Suspense',
    'FC', 'ReactNode', 'ReactElement', 'ReactPortal', 'Component', 'PureComponent',
    'ComponentType', 'ElementType', 'FormEvent', 'ChangeEvent', 'MouseEvent', 
    'KeyboardEvent', 'TouchEvent', 'FocusEvent', 'UIEvent', 'WheelEvent',
    'ClipboardEvent', 'CompositionEvent', 'DragEvent', 'PointerEvent', 
    'TransitionEvent', 'AnimationEvent', 'SyntheticEvent', 'ErrorInfo',
    'RefObject', 'MutableRefObject', 'Ref', 'ForwardedRef', 'PropsWithChildren',
    'ReactChild', 'ReactText', 'CSSProperties', 'HTMLAttributes', 'SVGAttributes'
  ];
  
  // Find which hooks/types are actually used in the content
  const usedItems = hooksAndTypes.filter(item => {
    // Look for the item being used (not just mentioned in comments)
    const regex = new RegExp(`\\b${item}\\b(?!['":\\/\\*])`, 'g');
    return regex.test(fixedContent) && !allNamedImports.includes(item);
  });
  
  // Add found items to named imports
  allNamedImports.push(...usedItems);
  allNamedImports = [...new Set(allNamedImports)]; // Remove duplicates again
  
  // Remove all existing React imports
  for (const importStatement of reactImports) {
    fixedContent = fixedContent.replace(importStatement, '');
  }
  
  // Create the new React 19 compatible import
  let newImportStatement = '';
  if (allNamedImports.length > 0) {
    // Use namespace import with destructuring for React 19 CommonJS compatibility
    newImportStatement = `import * as React from 'react';\nconst { ${allNamedImports.join(', ')} } = React;`;
  } else if (hasDefaultReact || fixedContent.includes('React.')) {
    // Just namespace import if only React namespace is used
    newImportStatement = `import * as React from 'react';`;
  }
  
  if (newImportStatement) {
    // Find the best place to insert the import
    const lines = fixedContent.split('\n');
    let insertIndex = 0;
    
    // Skip over 'use client', 'use server', empty lines, and comments
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('"use ') || 
          line.startsWith("'use ") || 
          line === '' || 
          line.startsWith('//') || 
          line.startsWith('/*') ||
          line.startsWith('*')) {
        insertIndex = i + 1;
      } else {
        break;
      }
    }
    
    // Insert the new import
    lines.splice(insertIndex, 0, newImportStatement, '');
    fixedContent = lines.join('\n');
  }
  
  // Clean up any double empty lines that might have been created
  fixedContent = fixedContent.replace(/\n\n\n+/g, '\n\n');
  
  return fixedContent;
}

function validateReactUsage(content, filePath) {
  // Check if there are any obvious React usage patterns that might be missed
  const reactUsagePatterns = [
    /\buseState\s*\(/g,
    /\buseEffect\s*\(/g,
    /\buseCallback\s*\(/g,
    /\buseMemo\s*\(/g,
    /\buseRef\s*\(/g,
    /\bFC\s*</g,
    /\bReactNode\b/g,
    /\bFormEvent\b/g,
    /\bChangeEvent\b/g
  ];
  
  const missingPatterns = [];
  for (const pattern of reactUsagePatterns) {
    if (pattern.test(content) && !content.includes('const {') && !content.includes('React.')) {
      const match = content.match(pattern);
      if (match) {
        missingPatterns.push(match[0]);
      }
    }
  }
  
  return missingPatterns;
}

// Main execution
console.log('🚀 Applying final React 19 import fixes...');

const files = getAllTsxFiles('./src');
files.push(...getAllTsxFiles('./app'));

let processedCount = 0;
let modifiedCount = 0;
let validationWarnings = [];

for (const filePath of files) {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    
    // Skip files that don't use React
    if (!originalContent.includes('react') && !originalContent.includes('React')) {
      continue;
    }
    
    let fixedContent = fixReact19Imports(originalContent);
    
    // Validate the fix
    const missingPatterns = validateReactUsage(fixedContent, filePath);
    if (missingPatterns.length > 0) {
      validationWarnings.push({
        file: filePath,
        patterns: missingPatterns
      });
    }
    
    // Write back if changed
    if (fixedContent !== originalContent) {
      fs.writeFileSync(filePath, fixedContent);
      console.log(`✅ Fixed React 19 imports in: ${filePath}`);
      modifiedCount++;
    }
    
    processedCount++;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

console.log(`\n📊 Final Results:`);
console.log(`   - Processed: ${processedCount} files`);
console.log(`   - Modified: ${modifiedCount} files`);

if (validationWarnings.length > 0) {
  console.log(`\n⚠️  Validation warnings for ${validationWarnings.length} files:`);
  validationWarnings.slice(0, 5).forEach(warning => {
    console.log(`   - ${warning.file}: ${warning.patterns.join(', ')}`);
  });
  if (validationWarnings.length > 5) {
    console.log(`   ... and ${validationWarnings.length - 5} more files`);
  }
}

console.log(`\n🎉 React 19 upgrade completed!`);
console.log(`\nNext steps:`);
console.log(`1. Run: tsc --noEmit --skipLibCheck`);
console.log(`2. Test your application`);
console.log(`3. Update any remaining type issues if needed`);
