#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Find all TypeScript files
const files = glob.sync('src/**/*.{ts,tsx}', { absolute: true });

let fixedFiles = 0;
let totalIssues = 0;

function fixTypescriptErrors(content, filePath) {
  let modified = false;
  let newContent = content;
  
  // Pattern 1: Fix incomplete import statements
  // Look for imports that are missing their closing } or from clause
  const lines = newContent.split('\n');
  const fixedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Fix import statements that are missing closing brace and from clause
    if (line.trim().startsWith('import {') && !line.includes('}') && !line.includes('from')) {
      // Look ahead to find the package name or closing brace
      let j = i + 1;
      let foundClosing = false;
      let importItems = [line.replace('import {', '').trim()];
      
      while (j < lines.length && !foundClosing) {
        const nextLine = lines[j].trim();
        
        if (nextLine.includes('}') && nextLine.includes('from')) {
          // This line has both closing brace and from clause
          const match = nextLine.match(/}\s*from\s*['"]([^'"]+)['"]/);
          if (match) {
            const packageName = match[1];
            // Reconstruct the import
            line = `import { ${importItems.join(', ').replace(/,$/, '')} } from '${packageName}';`;
            foundClosing = true;
            i = j; // Skip the lines we processed
          }
        } else if (nextLine.includes('}')) {
          // This line has closing brace but might be missing from clause
          importItems.push(nextLine.replace('}', '').trim());
          // Look for the package name in following lines
          if (j + 1 < lines.length) {
            const packageLine = lines[j + 1].trim();
            if (packageLine.includes('from')) {
              const match = packageLine.match(/from\s*['"]([^'"]+)['"]/);
              if (match) {
                const packageName = match[1];
                line = `import { ${importItems.join(', ').replace(/,$/, '')} } from '${packageName}';`;
                foundClosing = true;
                i = j + 1; // Skip the lines we processed
              }
            }
          }
        } else if (!nextLine.startsWith('type ') && !nextLine.startsWith('interface ') && nextLine !== '') {
          // This line contains import items
          importItems.push(nextLine.replace(/,$/, '').trim());
        } else {
          break;
        }
        j++;
      }
      
      if (!foundClosing) {
        // Try to guess common patterns
        const lastItem = importItems[importItems.length - 1];
        if (lastItem.includes('@/') || lastItem.includes('./') || lastItem.includes('../')) {
          line = `import { ${importItems.slice(0, -1).join(', ').replace(/,$/, '')} } from '${lastItem.replace(/['";]/g, '')}';`;
          foundClosing = true;
        }
      }
      
      if (foundClosing) {
        modified = true;
        totalIssues++;
      }
    }
    
    // Pattern 2: Fix type declarations that got mixed with imports
    if (line.trim().startsWith('type ') && i > 0 && lines[i-1].trim().includes('import')) {
      // Move type declarations after imports
      const typeDeclaration = line;
      line = ''; // Remove from current position
      
      // Find where to insert it (after all imports)
      let insertIndex = i + 1;
      while (insertIndex < lines.length && lines[insertIndex].trim().startsWith('import')) {
        insertIndex++;
      }
      
      if (insertIndex < lines.length) {
        lines.splice(insertIndex, 0, typeDeclaration);
        modified = true;
        totalIssues++;
      }
    }
    
    // Pattern 3: Fix standalone package names that should be imports
    const standalonePackageMatch = line.trim().match(/^(@?[a-z][a-z0-9\-]*(?:\/[a-z][a-z0-9\-]*)*);?$/);
    if (standalonePackageMatch && i > 0) {
      // Check if previous line is an incomplete import
      const prevLine = lines[i - 1].trim();
      if (prevLine.includes('import {') && !prevLine.includes('}')) {
        // This is likely the package name for the previous import
        const packageName = standalonePackageMatch[1];
        
        // Find all import items by going backwards
        let importStart = i - 1;
        let importItems = [];
        
        while (importStart >= 0 && lines[importStart].trim().includes('import')) {
          const importLine = lines[importStart].trim();
          const itemMatch = importLine.match(/import\s*{\s*([^}]*)/);
          if (itemMatch) {
            importItems.unshift(itemMatch[1].trim());
            break;
          }
          importStart--;
        }
        
        if (importItems.length > 0) {
          const newImport = `import { ${importItems.join(', ').replace(/,$/, '')} } from '${packageName}';`;
          lines[importStart] = newImport;
          line = ''; // Remove current line
          modified = true;
          totalIssues++;
        }
      }
    }
    
    // Pattern 4: Fix missing semicolons on import statements
    if (line.trim().includes('import') && line.trim().includes('from') && !line.trim().endsWith(';')) {
      line = line.trim() + ';';
      modified = true;
      totalIssues++;
    }
    
    // Pattern 5: Fix unterminated regular expressions (often from bad regex in comments)
    if (line.includes('* @') || line.includes('//')) {
      // Check for problematic regex patterns
      line = line.replace(/\/([^\/\n]*)\//g, (match, content) => {
        if (content.includes('*') || content.includes('+') || content.includes('?')) {
          // This might be a regex pattern, make sure it's properly escaped
          return `/${content.replace(/\*/g, '\\*').replace(/\+/g, '\\+').replace(/\?/g, '\\?')}/`;
        }
        return match;
      });
    }
    
    fixedLines.push(line);
  }
  
  if (modified) {
    newContent = fixedLines.join('\n');
  }
  
  // Pattern 6: Clean up duplicate empty lines
  newContent = newContent.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Pattern 7: Fix common React import issues
  if (!newContent.includes('import React') && newContent.includes('React.')) {
    // Add React import if React is used but not imported
    const importInsertIndex = newContent.indexOf('import');
    if (importInsertIndex !== -1) {
      newContent = newContent.substring(0, importInsertIndex) + 
                  "import React from 'react';\n" + 
                  newContent.substring(importInsertIndex);
      modified = true;
      totalIssues++;
    }
  }
  
  return { content: newContent, modified };
}

console.log('🔧 Starting comprehensive TypeScript error fix...');

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = fixTypescriptErrors(content, filePath);
    
    if (result.modified) {
      fs.writeFileSync(filePath, result.content, 'utf8');
      fixedFiles++;
      console.log(`Fixed TypeScript errors in: ${path.relative(process.cwd(), filePath)}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n✅ TypeScript error fix complete!`);
console.log(`📄 Fixed ${fixedFiles} files`);
console.log(`🔧 Resolved ${totalIssues} TypeScript issues`);
