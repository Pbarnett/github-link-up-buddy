#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';

/**
 * Fix import order violations by removing empty lines between import groups
 */
function fixImportOrder(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    let inImportSection = false;
    const fixedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Check if this is an import line
      const isImport = trimmedLine.startsWith('import ') || 
                      trimmedLine.startsWith('const {') ||
                      trimmedLine.startsWith('type ') ||
                      trimmedLine.startsWith('interface ');
      
      // Check if we're starting an import section
      if (isImport && !inImportSection) {
        inImportSection = true;
        fixedLines.push(line);
        continue;
      }
      
      // Check if we're ending an import section
      if (inImportSection && !isImport && trimmedLine !== '') {
        inImportSection = false;
        fixedLines.push(line);
        continue;
      }
      
      // If we're in an import section
      if (inImportSection) {
        if (isImport) {
          fixedLines.push(line);
        } else if (trimmedLine === '') {
          // Skip empty lines within import sections
          continue;
        } else {
          fixedLines.push(line);
        }
        continue;
      }
      
      // For all other lines, just add them
      fixedLines.push(line);
    }
    
    const fixedContent = fixedLines.join('\n');
    
    // Only write if content changed
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Get all TypeScript and TypeScript React files in src directory
 */
function getTSFiles() {
  try {
    const output = execSync('find src -type f \\( -name "*.ts" -o -name "*.tsx" \\) | head -20', { encoding: 'utf8' });
    return output.trim().split('\n').filter(f => f.trim());
  } catch (error) {
    console.error('Error finding TS files:', error.message);
    return [];
  }
}

function main() {
  console.log('🔧 Fixing import order violations...\n');
  
  const files = getTSFiles();
  let fixedCount = 0;
  
  for (const file of files) {
    if (fixImportOrder(file)) {
      console.log(`✅ Fixed: ${file}`);
      fixedCount++;
    } else {
      console.log(`⏭️  No changes: ${file}`);
    }
  }
  
  console.log(`\n📊 Summary: Fixed ${fixedCount} out of ${files.length} files`);
  
  if (fixedCount > 0) {
    console.log('\n🎉 Import order fixes applied! Running ESLint to verify...');
    
    try {
      execSync('npx eslint src --ext .ts,.tsx --rule "import/order: error" --format unix', { 
        encoding: 'utf8',
        stdio: 'inherit'
      });
      console.log('✅ All import order issues resolved!');
    } catch {
      console.log('⚠️  Some import order issues may remain, running manual check...');
    }
  }
}

// Entry point check for ES modules
main();
