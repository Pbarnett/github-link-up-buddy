#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import path from 'path';

const fixes = [
  // Fix React namespace imports
  {
    pattern: /React\.forwardRef/g,
    replacement: 'forwardRef'
  },
  {
    pattern: /React\.createContext/g,
    replacement: 'createContext'
  },
  {
    pattern: /React\.useId/g,
    replacement: 'useId'
  },
  {
    pattern: /React\.use/g,
    replacement: 'use'
  },
  // Fix component type imports
  {
    pattern: /React\.ComponentPropsWithoutRef/g,
    replacement: 'ComponentPropsWithoutRef'
  },
  {
    pattern: /React\.ComponentProps/g,
    replacement: 'ComponentProps'
  },
  {
    pattern: /React\.ElementRef/g,
    replacement: 'ElementRef'
  },
  {
    pattern: /React\.HTMLAttributes/g,
    replacement: 'HTMLAttributes'
  },
  {
    pattern: /React\.CSSProperties/g,
    replacement: 'CSSProperties'
  },
  {
    pattern: /React\.ReactElement/g,
    replacement: 'ReactElement'
  },
  {
    pattern: /React\.KeyboardEvent/g,
    replacement: 'KeyboardEvent'
  },
  {
    pattern: /React\.InputHTMLAttributes/g,
    replacement: 'InputHTMLAttributes'
  },
  {
    pattern: /React\.ElementType/g,
    replacement: 'ElementType'
  },
  {
    pattern: /React\.ComponentType/g,
    replacement: 'ComponentType'
  },
  {
    pattern: /React\.Ref/g,
    replacement: 'Ref'
  }
];

const reactImportPattern = /^import React(.*?) from ['"]react['"];?$/gm;

function updateReactImports(content) {
  const hasReactNamespaceUsage = fixes.some(fix => fix.pattern.test(content));
  
  if (!hasReactNamespaceUsage) {
    return content;
  }

  // Extract needed imports
  const neededImports = new Set(['React']);
  
  fixes.forEach(fix => {
    if (fix.pattern.test(content)) {
      const importName = fix.replacement;
      if (!['React'].includes(importName)) {
        neededImports.add(importName);
      }
    }
  });

  // Apply fixes
  let updatedContent = content;
  fixes.forEach(fix => {
    updatedContent = updatedContent.replace(fix.pattern, fix.replacement);
  });

  // Update import statement
  const imports = Array.from(neededImports);
  const mainReactImport = imports.includes('React') ? 'React' : '';
  const namedImports = imports.filter(imp => imp !== 'React');
  
  let newImport = 'import ';
  if (mainReactImport && namedImports.length > 0) {
    newImport += `${mainReactImport}, { ${namedImports.join(', ')} }`;
  } else if (mainReactImport) {
    newImport += mainReactImport;
  } else if (namedImports.length > 0) {
    newImport += `{ ${namedImports.join(', ')} }`;
  }
  newImport += ' from "react";';

  updatedContent = updatedContent.replace(reactImportPattern, newImport);
  
  return updatedContent;
}

function fixNamespaceTypes(content) {
  // Fix namespace type declarations
  const namespaceReplacements = [
    { pattern: /Namespace\s+['"']"react"['"].*/g, replacement: '' },
    { pattern: /export\s+member\s+'[^']+'/g, replacement: '' },
    { pattern: /error\s+TS2694:[^\.]+\./g, replacement: '' }
  ];

  let updatedContent = content;
  namespaceReplacements.forEach(({ pattern, replacement }) => {
    updatedContent = updatedContent.replace(pattern, replacement);
  });

  return updatedContent;
}

async function processFiles() {
  try {
    // Find all TypeScript/JavaScript files in src/components/ui
    const files = await glob('src/components/ui/*.{ts,tsx,js,jsx}', { ignore: 'node_modules/**' });
    
    console.log(`Found ${files.length} UI component files to process...`);

    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf-8');
        const updatedContent = updateReactImports(fixNamespaceTypes(content));
        
        if (content !== updatedContent) {
          writeFileSync(file, updatedContent);
          console.log(`✅ Fixed: ${file}`);
        } else {
          console.log(`⚪ No changes needed: ${file}`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
      }
    }

    console.log('✅ React 19 compatibility fixes completed!');
  } catch (error) {
    console.error('❌ Error finding files:', error.message);
    process.exit(1);
  }
}

processFiles();
