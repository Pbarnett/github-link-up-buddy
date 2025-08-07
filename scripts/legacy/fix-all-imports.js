#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Find all TypeScript files
const files = glob.sync('src/**/*.{ts,tsx}', { absolute: true });

let fixedFiles = 0;
let totalIssues = 0;

function fixAllImports(content, filePath) {
  let modified = false;
  let newContent = content;
  
  // Fix broken import lines that are missing 'from' clause
  // Pattern: Lines that start with module names like @/, ./, or just a package name followed by ';
  const brokenImportLines = newContent.split('\n');
  let fixedLines = [];
  
  for (let i = 0; i < brokenImportLines.length; i++) {
    const line = brokenImportLines[i];
    const trimmedLine = line.trim();
    
    // Check if this is a broken import line missing 'from'
    // Examples: "@/components/ui/button';" or "./hooks/useAuth';"
    if (
      (trimmedLine.startsWith('@/') || 
       trimmedLine.startsWith('./') || 
       trimmedLine.startsWith('../') ||
       trimmedLine.match(/^[a-z\-@]+\//) ||
       trimmedLine.match(/^[a-z\-@]+'/)) && 
      trimmedLine.endsWith("';")
    ) {
      // This is likely a broken import line
      // Look backwards for the import statement
      let importStart = -1;
      for (let j = i - 1; j >= 0; j--) {
        const prevLine = brokenImportLines[j].trim();
        if (prevLine.startsWith('import ')) {
          importStart = j;
          break;
        }
        // If we hit another complete line, stop searching
        if (prevLine && !prevLine.includes('import') && !prevLine.startsWith('}')) {
          break;
        }
      }
      
      if (importStart !== -1) {
        // Reconstruct the import
        const importLine = brokenImportLines[importStart];
        const module = trimmedLine.replace("';", "");
        
        // If the import line doesn't have a closing } or is incomplete
        if (!importLine.includes('}') || importLine.endsWith('{')) {
          // This is likely an incomplete import - join it properly
          const combinedImport = importLine + ' } from \'' + module + '\';';
          fixedLines.push(combinedImport);
          // Skip the broken line
          continue;
        } else {
          // Import line is complete, this might be a standalone broken line
          fixedLines.push('import {} from \'' + module + '\';');
          modified = true;
          totalIssues++;
          continue;
        }
      }
    }
    
    fixedLines.push(line);
  }
  
  if (fixedLines.join('\n') !== content) {
    newContent = fixedLines.join('\n');
    modified = true;
    totalIssues++;
  }
  
  // Pattern 2: Fix lines that are just standalone package names
  // Examples: "react';" -> should be deleted if not part of an import
  const standalonePackagePattern = /^[a-zA-Z\-@\/]+';$/gm;
  if (standalonePackagePattern.test(newContent)) {
    newContent = newContent.replace(standalonePackagePattern, '');
    modified = true;
    totalIssues++;
  }
  
  // Pattern 3: Clean up duplicate blank lines that may have been created
  newContent = newContent.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Pattern 4: Fix import statements that lost their quotes
  // Pattern: "} from module-name;" -> "} from 'module-name';"
  const unquotedImportPattern = /}\s*from\s+([^'"\s][^;]*);/g;
  if (unquotedImportPattern.test(newContent)) {
    newContent = newContent.replace(unquotedImportPattern, '} from \'$1\';');
    modified = true;
    totalIssues++;
  }
  
  // Pattern 5: Fix import statements with only starting quotes
  // Pattern: "} from 'module-name;" -> "} from 'module-name';"
  const incompleteQuotePattern = /}\s*from\s+'([^']*);/g;
  if (incompleteQuotePattern.test(newContent)) {
    newContent = newContent.replace(incompleteQuotePattern, '} from \'$1\';');
    modified = true;
    totalIssues++;
  }
  
  return { content: newContent, modified };
}

console.log('🔧 Starting comprehensive import fix...');

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = fixAllImports(content, filePath);
    
    if (result.modified) {
      fs.writeFileSync(filePath, result.content, 'utf8');
      fixedFiles++;
      console.log(`Fixed imports in: ${path.relative(process.cwd(), filePath)}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n✅ Final import fix complete!`);
console.log(`📄 Fixed ${fixedFiles} files`);
console.log(`🔧 Resolved ${totalIssues} import issues`);
