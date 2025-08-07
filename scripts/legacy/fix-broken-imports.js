#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Find all TypeScript files that have broken imports
const files = glob.sync('src/**/*.{ts,tsx}', { absolute: true });

let fixedFiles = 0;
let totalIssues = 0;

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let newContent = content;

    // Fix pattern: "import {\nimport React, { ... } from 'react';\n  someOtherImport" 
    // This happens when React import was inserted in the middle of another import
    const brokenImportPattern = /import\s*{\s*\nimport\s+React,\s*{[^}]*}\s+from\s+['"]react['"];\s*\n\s*([^}]+)\s*}\s*from\s+['"][^'"]*['"];/gm;
    
    if (brokenImportPattern.test(content)) {
      // Extract the broken import and fix it
      newContent = newContent.replace(
        /import\s*{\s*\nimport\s+React,\s*{([^}]*)}\s+from\s+['"]react['"];\s*\n\s*([^}]+)\s*}\s*from\s+(['"][^'"]*['"]);\s*/gm,
        (match, reactImports, otherImports, fromModule) => {
          // Clean up the imports
          const cleanReactImports = reactImports.trim().split(',').map(imp => imp.trim()).filter(imp => imp);
          const cleanOtherImports = otherImports.trim().split(',').map(imp => imp.trim()).filter(imp => imp);
          
          return `import React, { ${cleanReactImports.join(', ')} } from 'react';\nimport {\n  ${cleanOtherImports.join(',\n  ')}\n} from ${fromModule};\n`;
        }
      );
      modified = true;
      totalIssues++;
      console.log(`Fixed broken import pattern in: ${path.relative(process.cwd(), filePath)}`);
    }

    // Fix pattern where React import is duplicated at the start
    const duplicateReactPattern = /^(import\s+React,\s*{[^}]*}\s+from\s+['"]react['"];\s*\n)(.|\n)*?\1/m;
    if (duplicateReactPattern.test(newContent)) {
      // Remove duplicate React imports, keep only the first one
      const lines = newContent.split('\n');
      const reactImportLines = [];
      const otherLines = [];
      let seenReactImport = false;
      
      for (const line of lines) {
        if (line.trim().startsWith('import React,') && line.includes("from 'react'")) {
          if (!seenReactImport) {
            reactImportLines.push(line);
            seenReactImport = true;
          }
          // Skip duplicate React imports
        } else {
          otherLines.push(line);
        }
      }
      
      if (reactImportLines.length > 0) {
        newContent = [...reactImportLines, ...otherLines].join('\n');
        modified = true;
        totalIssues++;
        console.log(`Fixed duplicate React import in: ${path.relative(process.cwd(), filePath)}`);
      }
    }

    // Fix standalone type declarations at the beginning that should be after imports
    const typeBeforeImportPattern = /^type\s+\w+\s*=\s*[^;]+;\s*\n(import\s)/m;
    if (typeBeforeImportPattern.test(newContent)) {
      const lines = newContent.split('\n');
      const typeDeclarations = [];
      const importLines = [];
      const otherLines = [];
      let inImportSection = false;
      let passedImports = false;
      
      for (const line of lines) {
        if (line.trim().startsWith('import ')) {
          inImportSection = true;
          importLines.push(line);
        } else if (inImportSection && !line.trim()) {
          passedImports = true;
          importLines.push(line); // Keep empty lines in import section
        } else if (line.trim().startsWith('type ') && !passedImports) {
          typeDeclarations.push(line);
        } else {
          otherLines.push(line);
          if (inImportSection && line.trim()) {
            passedImports = true;
            inImportSection = false;
          }
        }
      }
      
      if (typeDeclarations.length > 0) {
        newContent = [...importLines, ...typeDeclarations, ...otherLines].join('\n');
        modified = true;
        totalIssues++;
        console.log(`Fixed type declaration order in: ${path.relative(process.cwd(), filePath)}`);
      }
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
console.log(`🔧 Resolved ${totalIssues} broken import issues`);
