#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Find all .tsx and .ts files
const files = glob.sync('src/**/*.{ts,tsx}', { absolute: true });

let fixedFiles = 0;
let totalIssues = 0;

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let newContent = content;

    // Pattern 1: Fix destructuring with invalid 'use'
    // Match patterns like: const { useState, useEffect, use } = React;
    const destructuringPattern = /const\s*\{\s*([^}]+),\s*use\s*\}\s*=\s*React;/g;
    if (destructuringPattern.test(content)) {
      newContent = newContent.replace(
        /const\s*\{\s*([^}]+),\s*use\s*\}\s*=\s*React;/g,
        'const { $1 } = React;'
      );
      modified = true;
      totalIssues++;
      console.log(`Fixed destructuring with invalid 'use' in: ${path.relative(process.cwd(), filePath)}`);
    }

    // Pattern 2: Fix destructuring with FC and use
    // Match patterns like: const { FC, use } = React;
    const fcUsePattern = /const\s*\{\s*FC,\s*use\s*\}\s*=\s*React;/g;
    if (fcUsePattern.test(newContent)) {
      newContent = newContent.replace(
        /const\s*\{\s*FC,\s*use\s*\}\s*=\s*React;/g,
        'type FC<T = {}> = React.FC<T>;'
      );
      modified = true;
      totalIssues++;
      console.log(`Fixed FC + use pattern in: ${path.relative(process.cwd(), filePath)}`);
    }

    // Pattern 3: Fix mixed destructuring with FC, hooks, and use
    // Match patterns like: const { useState, useEffect, useCallback, FC, use } = React;
    const mixedPattern = /const\s*\{\s*([^}]*,)\s*FC,\s*use\s*\}\s*=\s*React;/g;
    if (mixedPattern.test(newContent)) {
      newContent = newContent.replace(
        /const\s*\{\s*([^}]*),\s*FC,\s*use\s*\}\s*=\s*React;/g,
        'const { $1 } = React;\ntype FC<T = {}> = React.FC<T>;'
      );
      modified = true;
      totalIssues++;
      console.log(`Fixed mixed FC + use pattern in: ${path.relative(process.cwd(), filePath)}`);
    }

    // Pattern 4: Remove standalone 'use' from destructuring
    // Match patterns where 'use' is at the end: const { useState, useEffect, use } = React;
    const standaloneUsePattern = /const\s*\{\s*([^}]+),\s*use\s*\}\s*=\s*React;/g;
    if (standaloneUsePattern.test(newContent)) {
      newContent = newContent.replace(
        /const\s*\{\s*([^}]+),\s*use\s*\}\s*=\s*React;/g,
        'const { $1 } = React;'
      );
      modified = true;
      totalIssues++;
      console.log(`Fixed standalone use pattern in: ${path.relative(process.cwd(), filePath)}`);
    }

    // Pattern 5: Fix FC and FormEvent destructuring
    // Match patterns like: const { useState, FC, FormEvent } = React;
    const fcFormEventPattern = /const\s*\{\s*([^}]*),\s*FC,\s*FormEvent\s*\}\s*=\s*React;/g;
    if (fcFormEventPattern.test(newContent)) {
      newContent = newContent.replace(
        /const\s*\{\s*([^}]*),\s*FC,\s*FormEvent\s*\}\s*=\s*React;/g,
        'const { $1 } = React;\ntype FC<T = {}> = React.FC<T>;\ntype FormEvent = React.FormEvent;'
      );
      modified = true;
      totalIssues++;
      console.log(`Fixed FC + FormEvent pattern in: ${path.relative(process.cwd(), filePath)}`);
    }

    // Pattern 6: Fix standalone FC destructuring
    // Match patterns like: const { FC } = React;
    const standaloneFC = /const\s*\{\s*([^}]*,\s*)?FC\s*(,\s*[^}]*)?\}\s*=\s*React;/g;
    if (standaloneFC.test(newContent)) {
      newContent = newContent.replace(
        /const\s*\{\s*((?:[^},]*,\s*)?)FC\s*(,\s*([^}]*))?\}\s*=\s*React;/g,
        (match, before, afterComma, after) => {
          let result = '';
          const otherImports = [];
          if (before) otherImports.push(before.replace(/,\s*$/, ''));
          if (after) otherImports.push(after);
          
          if (otherImports.length > 0) {
            result += `const { ${otherImports.join(', ')} } = React;\n`;
          }
          result += 'type FC<T = {}> = React.FC<T>;';
          return result;
        }
      );
      modified = true;
      totalIssues++;
      console.log(`Fixed standalone FC pattern in: ${path.relative(process.cwd(), filePath)}`);
    }

    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      fixedFiles++;
    }

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n✅ Fix complete!`);
console.log(`📄 Fixed ${fixedFiles} files`);
console.log(`🔧 Resolved ${totalIssues} React import issues`);
console.log(`\nAll invalid React 'use' imports have been fixed for React 19 compatibility.`);
