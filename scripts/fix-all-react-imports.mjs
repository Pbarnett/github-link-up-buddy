#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Define React types and functions that need the compatibility layer
    const compatTypes = [
      'forwardRef', 'createContext', 'useId', 'memo', 'useDeferredValue', 
      'useTransition', 'Suspense', 'Fragment', 'ElementRef', 
      'ComponentPropsWithoutRef', 'ComponentProps', 'HTMLAttributes', 
      'CSSProperties', 'KeyboardEvent', 'InputHTMLAttributes', 
      'ButtonHTMLAttributes', 'TextareaHTMLAttributes', 'ElementType', 
      'ComponentType', 'createElement'
    ];
    
    // Pattern 1: import React, { ... } from 'react';
    const reactWithDestructurePattern = /import\s+React\s*,\s*\{\s*([^}]+)\s*\}\s*from\s+['"']react['"];?/g;
    content = content.replace(reactWithDestructurePattern, (match, imports) => {
      const importList = imports.split(',').map(imp => imp.trim()).filter(Boolean);
      const needsCompat = importList.filter(imp => compatTypes.includes(imp));
      const remaining = importList.filter(imp => !compatTypes.includes(imp));
      
      let result = `import React from 'react';`;
      
      if (needsCompat.length > 0) {
        result += `\nimport { ${needsCompat.join(', ')} } from '@/lib/react-19-compat';`;
      }
      
      if (remaining.length > 0) {
        result += `\nimport { ${remaining.join(', ')} } from 'react';`;
      }
      
      changed = true;
      return result;
    });
    
    // Pattern 2: import { ... } from 'react'; (without React default)
    const destructureOnlyPattern = /import\s*\{\s*([^}]+)\s*\}\s*from\s+['"']react['"];?/g;
    content = content.replace(destructureOnlyPattern, (match, imports) => {
      const importList = imports.split(',').map(imp => imp.trim()).filter(Boolean);
      const needsCompat = importList.filter(imp => compatTypes.includes(imp));
      const remaining = importList.filter(imp => !compatTypes.includes(imp));
      
      let result = '';
      
      if (needsCompat.length > 0) {
        result = `import { ${needsCompat.join(', ')} } from '@/lib/react-19-compat';`;
      }
      
      if (remaining.length > 0) {
        if (result) result += '\n';
        result += `import { ${remaining.join(', ')} } from 'react';`;
      }
      
      if (result !== match) {
        changed = true;
        return result;
      }
      return match;
    });
    
    // Pattern 3: import type { ... } from 'react';
    const typeImportPattern = /import\s+type\s*\{\s*([^}]+)\s*\}\s*from\s+['"']react['"];?/g;
    content = content.replace(typeImportPattern, (match, imports) => {
      const importList = imports.split(',').map(imp => imp.trim()).filter(Boolean);
      const needsCompat = importList.filter(imp => compatTypes.includes(imp));
      const remaining = importList.filter(imp => !compatTypes.includes(imp));
      
      let result = '';
      
      if (needsCompat.length > 0) {
        result = `import type { ${needsCompat.join(', ')} } from '@/lib/react-19-compat';`;
      }
      
      if (remaining.length > 0) {
        if (result) result += '\n';
        result += `import type { ${remaining.join(', ')} } from 'react';`;
      }
      
      if (result !== match) {
        changed = true;
        return result;
      }
      return match;
    });
    
    // Fix React.* usage
    compatTypes.forEach(type => {
      const pattern = new RegExp(`React\\.${type}`, 'g');
      if (pattern.test(content)) {
        content = content.replace(pattern, type);
        changed = true;
      }
    });
    
    // Fix circular type definitions
    content = content.replace(/type\s+HTMLAttributes<T\s*=\s*HTMLElement>\s*=\s*HTMLAttributes<T>;?/g, '');
    
    // Fix FormEvent generic usage
    content = content.replace(/FormEvent<HTMLFormElement>/g, 'FormEvent');
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function findFilesToFix(dir, extensions = ['.ts', '.tsx']) {
  const files = [];
  
  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && !entry.name.includes('node_modules') && !entry.name.includes('.git')) {
        traverse(fullPath);
      } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
        // Skip declaration files and compatibility file
        if (!entry.name.endsWith('.d.ts') && !entry.name.includes('react-19-compat')) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

function main() {
  console.log('🔧 Fixing React 19 compatibility in all TypeScript files...\n');
  
  const srcDir = path.join(projectRoot, 'src');
  const files = findFilesToFix(srcDir);
  
  let processedCount = 0;
  let updatedCount = 0;
  
  for (const file of files) {
    processedCount++;
    if (fixFile(file)) {
      updatedCount++;
      console.log(`✅ Updated: ${path.relative(projectRoot, file)}`);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Files processed: ${processedCount}`);
  console.log(`   Files updated: ${updatedCount}`);
  console.log(`   Files unchanged: ${processedCount - updatedCount}`);
  
  if (updatedCount > 0) {
    console.log('\n✨ React 19 compatibility fixes applied successfully!');
  } else {
    console.log('\n✅ All files were already compatible.');
  }
}

main();
