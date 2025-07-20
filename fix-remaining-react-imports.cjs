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

function aggressivelyFixReactImports(content) {
  let fixedContent = content;
  
  // Find all React imports and normalize them
  const reactImportRegex = /import\s+(?:(?:\*\s+as\s+)?React(?:\s*,\s*\{[^}]*\})?|\{[^}]*\})\s+from\s+['"]react['"];?/g;
  
  let allImports = [];
  let hasReactNamespace = false;
  
  // Find all React-related imports
  const matches = [...fixedContent.matchAll(reactImportRegex)];
  
  if (matches.length === 0) return content;
  
  // Extract all imported items
  for (const match of matches) {
    const importStr = match[0];
    
    // Check for React namespace import
    if (importStr.includes('* as React') || importStr.match(/import\s+React\s+from/)) {
      hasReactNamespace = true;
    }
    
    // Extract named imports
    const namedImportMatch = importStr.match(/\{\s*([^}]+)\s*\}/);
    if (namedImportMatch) {
      const imports = namedImportMatch[1]
        .split(',')
        .map(s => s.trim())
        .filter(s => s && s !== 'React');
      allImports.push(...imports);
    }
  }
  
  // Also scan the file content for used React hooks/types
  const hookPatterns = [
    /\buseState\b/, /\buseEffect\b/, /\buseCallback\b/, /\buseMemo\b/, 
    /\buseRef\b/, /\buseContext\b/, /\buseReducer\b/, /\buseLayoutEffect\b/,
    /\busy\b/, /\bSuspense\b/, /\bstartTransition\b/, /\buseTransition\b/
  ];
  
  const typePatterns = [
    /\bFC\b/, /\bReactNode\b/, /\bFormEvent\b/, /\bChangeEvent\b/, 
    /\bMouseEvent\b/, /\bKeyboardEvent\b/, /\bComponent\b/, 
    /\bComponentType\b/, /\bErrorInfo\b/, /\bReactElement\b/
  ];
  
  // Find used hooks and types in the content
  const usedHooks = [];
  const usedTypes = [];
  
  hookPatterns.forEach(pattern => {
    if (pattern.test(fixedContent)) {
      const hookName = pattern.source.replace(/\\b/g, '');
      if (!allImports.includes(hookName)) {
        usedHooks.push(hookName);
      }
    }
  });
  
  typePatterns.forEach(pattern => {
    if (pattern.test(fixedContent)) {
      const typeName = pattern.source.replace(/\\b/g, '');
      if (!allImports.includes(typeName)) {
        usedTypes.push(typeName);
      }
    }
  });
  
  // Combine all needed imports
  const allNeededImports = [...new Set([...allImports, ...usedHooks, ...usedTypes])];
  
  // Create the new import statement
  let newImportStatement;
  if (allNeededImports.length > 0) {
    newImportStatement = `import React, { ${allNeededImports.join(', ')} } from "react";`;
  } else if (hasReactNamespace || fixedContent.includes('React.')) {
    newImportStatement = `import React from "react";`;
  } else {
    return content; // No React imports needed
  }
  
  // Remove all existing React imports and add the new one
  fixedContent = fixedContent.replace(reactImportRegex, '');
  
  // Find the best place to insert the import (after 'use client' or at the top)
  const lines = fixedContent.split('\n');
  let insertIndex = 0;
  
  // Skip 'use client', 'use server', or other directives
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('"use ') || line.startsWith("'use ") || line === '') {
      insertIndex = i + 1;
    } else {
      break;
    }
  }
  
  lines.splice(insertIndex, 0, newImportStatement);
  fixedContent = lines.join('\n');
  
  return fixedContent;
}

function fixSpecificErrors(content) {
  // Fix specific known patterns that cause errors
  let fixedContent = content;
  
  // Fix React namespace usage that should be direct imports
  const namespaceReplacements = [
    { from: /React\.useState/g, to: 'useState' },
    { from: /React\.useEffect/g, to: 'useEffect' },
    { from: /React\.useCallback/g, to: 'useCallback' },
    { from: /React\.useMemo/g, to: 'useMemo' },
    { from: /React\.useRef/g, to: 'useRef' },
    { from: /React\.useContext/g, to: 'useContext' },
    { from: /React\.FC/g, to: 'FC' },
    { from: /React\.ReactNode/g, to: 'ReactNode' },
    { from: /React\.FormEvent/g, to: 'FormEvent' },
    { from: /React\.ChangeEvent/g, to: 'ChangeEvent' },
    { from: /React\.startTransition/g, to: 'startTransition' },
    { from: /React\.useTransition/g, to: 'useTransition' }
  ];
  
  namespaceReplacements.forEach(({ from, to }) => {
    fixedContent = fixedContent.replace(from, to);
  });
  
  return fixedContent;
}

// Main execution
console.log('🔧 Aggressively fixing remaining React import issues...');

const files = getAllTsxFiles('./src');
files.push(...getAllTsxFiles('./app'));

let processedCount = 0;
let modifiedCount = 0;
const problemFiles = [];

for (const filePath of files) {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    
    // Skip files that don't use React
    if (!originalContent.includes('react') && !originalContent.includes('React')) {
      continue;
    }
    
    let fixedContent = originalContent;
    
    // Apply aggressive fixes
    fixedContent = aggressivelyFixReactImports(fixedContent);
    fixedContent = fixSpecificErrors(fixedContent);
    
    // Write back if changed
    if (fixedContent !== originalContent) {
      fs.writeFileSync(filePath, fixedContent);
      console.log(`✅ Fixed React imports in: ${filePath}`);
      modifiedCount++;
    }
    
    // Check if file still has potential issues
    if (fixedContent.includes("Module 'react' has no exported member") || 
        (fixedContent.includes('useEffect') && !fixedContent.includes('import')) ||
        (fixedContent.includes('useState') && !fixedContent.includes('import'))) {
      problemFiles.push(filePath);
    }
    
    processedCount++;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    problemFiles.push(filePath);
  }
}

console.log(`\n📊 Processed ${processedCount} files, modified ${modifiedCount} files.`);

if (problemFiles.length > 0) {
  console.log(`⚠️  ${problemFiles.length} files may still have issues:`);
  problemFiles.slice(0, 10).forEach(file => console.log(`   - ${file}`));
  if (problemFiles.length > 10) {
    console.log(`   ... and ${problemFiles.length - 10} more`);
  }
}

console.log('✨ Aggressive React import fixes completed!');
