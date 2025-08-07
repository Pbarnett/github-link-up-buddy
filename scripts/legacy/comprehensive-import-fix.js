#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Find all TypeScript files
const files = glob.sync('src/**/*.{ts,tsx}', { absolute: true });

let fixedFiles = 0;
let totalIssues = 0;

function fixBrokenImports(content, filePath) {
  let modified = false;
  let newContent = content;

  // Pattern 1: Fix import statements in middle of other imports
  // Example: import {\nimport React, ... from 'react';\n  something} from 'module';
  const pattern1 = /import\s*{\s*\nimport\s+([^;]+);\s*\n\s*([^}]+)\s*}\s*from\s*([^;]+);/gm;
  if (pattern1.test(content)) {
    newContent = newContent.replace(pattern1, (match, reactImport, otherImports, fromModule) => {
      const cleanOtherImports = otherImports.trim().split(/,\s*/).filter(imp => imp.trim());
      return `${reactImport.trim()};\nimport {\n  ${cleanOtherImports.join(',\n  ')}\n} from ${fromModule.trim()};`;
    });
    modified = true;
    totalIssues++;
    console.log(`Fixed Pattern 1 in: ${path.relative(process.cwd(), filePath)}`);
  }

  // Pattern 2: Fix broken multi-line imports with React inserted
  const pattern2 = /import\s*{\s*\n([^}]+)\nimport\s+React[^;]+;\s*\n([^}]+)\s*}\s*from\s*([^;]+);/gm;
  if (pattern2.test(newContent)) {
    newContent = newContent.replace(pattern2, (match, before, after, fromModule) => {
      const allImports = [before.trim(), after.trim()].filter(imp => imp.trim());
      return `import React, { useState, useEffect, useCallback, useMemo, useRef, useContext, useReducer, useLayoutEffect, FormEvent, ComponentProps, forwardRef, memo, Fragment, Suspense, ElementRef, ComponentPropsWithoutRef, HTMLAttributes } from 'react';\nimport {\n  ${allImports.join(',\n  ')}\n} from ${fromModule.trim()};`;
    });
    modified = true;
    totalIssues++;
    console.log(`Fixed Pattern 2 in: ${path.relative(process.cwd(), filePath)}`);
  }

  // Pattern 3: Fix type declarations before imports
  const lines = newContent.split('\n');
  const imports = [];
  const types = [];
  const otherLines = [];
  let inImportSection = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('type ') && inImportSection) {
      types.push(lines[i]);
    } else if (line.startsWith('import ')) {
      imports.push(lines[i]);
    } else if (line === '' && inImportSection) {
      // Empty line might separate imports from rest
      if (imports.length > 0) {
        inImportSection = false;
      }
      otherLines.push(lines[i]);
    } else {
      inImportSection = false;
      otherLines.push(lines[i]);
    }
  }

  if (types.length > 0 && imports.length > 0) {
    // Reorganize: imports first, then types, then other content
    const reorganized = [...imports, '', ...types, ...otherLines].join('\n');
    if (reorganized !== newContent) {
      newContent = reorganized;
      modified = true;
      totalIssues++;
      console.log(`Fixed import order in: ${path.relative(process.cwd(), filePath)}`);
    }
  }

  // Pattern 4: Remove any remaining broken import fragments
  // Look for lines that start with random import fragments
  const brokenFragments = /^[^\/\*\n]*}\s*from\s*['"]/gm;
  if (brokenFragments.test(newContent)) {
    newContent = newContent.replace(brokenFragments, '');
    modified = true;
    totalIssues++;
    console.log(`Cleaned broken fragments in: ${path.relative(process.cwd(), filePath)}`);
  }

  // Pattern 5: Fix duplicate React imports
  const reactImports = [];
  const otherImportsLines = [];
  const restLines = [];
  let seenReactImport = false;
  let pastImports = false;

  const finalLines = newContent.split('\n');
  for (let i = 0; i < finalLines.length; i++) {
    const line = finalLines[i];
    
    if (line.trim().startsWith('import React,') && line.includes("from 'react'")) {
      if (!seenReactImport) {
        reactImports.push(line);
        seenReactImport = true;
      }
      // Skip duplicate React imports
    } else if (line.trim().startsWith('import ') && !pastImports) {
      otherImportsLines.push(line);
    } else {
      if (line.trim() && !line.trim().startsWith('import ')) {
        pastImports = true;
      }
      restLines.push(line);
    }
  }

  if (reactImports.length > 0 && seenReactImport) {
    const finalContent = [...reactImports, ...otherImportsLines, ...restLines].join('\n');
    if (finalContent !== newContent) {
      newContent = finalContent;
      modified = true;
      totalIssues++;
      console.log(`Deduplicated React imports in: ${path.relative(process.cwd(), filePath)}`);
    }
  }

  return { content: newContent, modified };
}

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = fixBrokenImports(content, filePath);
    
    if (result.modified) {
      fs.writeFileSync(filePath, result.content, 'utf8');
      fixedFiles++;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n✅ Comprehensive import fix complete!`);
console.log(`📄 Fixed ${fixedFiles} files`);
console.log(`🔧 Resolved ${totalIssues} import issues`);
