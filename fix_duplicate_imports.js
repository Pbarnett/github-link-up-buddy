import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

// Find all TypeScript files
const files = glob.sync('src/**/*.{ts,tsx}');

let fixedCount = 0;

files.forEach(file => {
  try {
    const content = readFileSync(file, 'utf8');
    const lines = content.split('\n');
    
    // Look for duplicate React imports
    let hasIssue = false;
    let fixedLines = [];
    let reactImportSeen = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip if it's a React import line and we've already seen one
      if (line.includes('import React') || line.includes('import { ') && line.includes('} from \'react\'')) {
        if (reactImportSeen) {
          // Skip this duplicate import line
          hasIssue = true;
          continue;
        } else {
          reactImportSeen = true;
        }
      }
      
      fixedLines.push(line);
    }
    
    if (hasIssue) {
      console.log(`Fixing duplicate imports in ${file}...`);
      const newContent = fixedLines.join('\n');
      writeFileSync(file, newContent, 'utf8');
      fixedCount++;
      console.log(`  ✅ Fixed ${file}`);
    }
    
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\n✅ Fixed ${fixedCount} files with duplicate imports.`);
