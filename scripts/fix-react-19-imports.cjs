#!/usr/bin/env node

/**
 * Script to fix React 19 import patterns
 * Based on React 19 documentation patterns from the API guides
 */

const fs = require('fs');
const path = require('path');

function findReactFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules, .git, build directories
      if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(entry.name)) {
        findReactFiles(fullPath, files);
      }
    } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function updateReactImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let updatedContent = content;
  let hasChanges = false;

  // Pattern 1: Fix React imports to use named imports consistently
  // From: import React, { useState, useEffect } from 'react';
  // To: import { useState, useEffect } from 'react';
  // And: import * as React from 'react';
  
  const reactImportRegex = /import\s+React(?:\s*,\s*\{([^}]+)\})?\s+from\s+['"]react['"];/g;
  updatedContent = updatedContent.replace(reactImportRegex, (match, namedImports) => {
    hasChanges = true;
    
    if (namedImports) {
      // Has both default and named imports
      const cleanedImports = namedImports.trim();
      // Check if React is actually used as a namespace
      const hasJSX = content.includes('React.') || content.includes('<') || content.includes('React.createElement');
      
      if (hasJSX) {
        return `import * as React from 'react';\nimport { ${cleanedImports} } from 'react';`;
      } else {
        return `import { ${cleanedImports} } from 'react';`;
      }
    } else {
      // Only default import
      return `import * as React from 'react';`;
    }
  });

  // Pattern 2: Fix standalone React import that should be namespace import
  // From: import React from 'react';
  // To: import * as React from 'react';
  if (!updatedContent.includes('import * as React') && !updatedContent.includes('import {')) {
    updatedContent = updatedContent.replace(
      /import\s+React\s+from\s+['"]react['"];/g,
      "import * as React from 'react';"
    );
    if (content !== updatedContent) hasChanges = true;
  }

  // Pattern 3: Add React import if JSX is used but no React import exists
  if ((updatedContent.includes('</') || updatedContent.includes('<')) && 
      !updatedContent.includes('import') && 
      !updatedContent.includes('React')) {
    updatedContent = `import * as React from 'react';\n${updatedContent}`;
    hasChanges = true;
  }

  // Pattern 4: Fix React DOM imports
  const reactDOMImportRegex = /import\s+ReactDOM\s+from\s+['"]react-dom['"];/g;
  updatedContent = updatedContent.replace(reactDOMImportRegex, "import * as ReactDOM from 'react-dom';");
  if (content !== updatedContent) hasChanges = true;

  // Pattern 5: Fix React DOM client imports
  updatedContent = updatedContent.replace(
    /import\s+\{\s*render\s*\}\s+from\s+['"]react-dom['"];/g,
    "import { createRoot } from 'react-dom/client';"
  );
  if (content !== updatedContent) hasChanges = true;

  return { content: updatedContent, hasChanges };
}

function main() {
  const projectRoot = process.cwd();
  const files = findReactFiles(projectRoot);
  
  console.log(`Found ${files.length} React/TypeScript files to process`);
  
  let processedFiles = 0;
  let changedFiles = 0;
  
  for (const filePath of files) {
    try {
      const result = updateReactImports(filePath);
      processedFiles++;
      
      if (result.hasChanges) {
        fs.writeFileSync(filePath, result.content, 'utf-8');
        changedFiles++;
        console.log(`✓ Updated: ${path.relative(projectRoot, filePath)}`);
      }
    } catch (error) {
      console.error(`✗ Error processing ${filePath}:`, error.message);
    }
  }
  
  console.log(`\n✅ Processing complete!`);
  console.log(`📁 Processed: ${processedFiles} files`);
  console.log(`🔄 Updated: ${changedFiles} files`);
  
  if (changedFiles > 0) {
    console.log(`\n🔍 Next steps:`);
    console.log(`   1. Run: npx tsc --noEmit`);
    console.log(`   2. Test your application`);
    console.log(`   3. Run tests: npm test`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { updateReactImports, findReactFiles };
