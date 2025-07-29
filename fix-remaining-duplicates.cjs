const fs = require('fs');
const path = require('path');

function fixRemainingDuplicates() {
  const srcDir = './src';
  
  function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        processDirectory(fullPath);
      } else if (entry.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
        try {
          processFile(fullPath);
        } catch (error) {
          console.log(`Error processing ${fullPath}: ${error.message}`);
        }
      }
    }
  }
  
  function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove duplicate ChangeEvent type declarations
    const changeEventMatches = content.match(/type ChangeEvent<[^>]*> = React\.ChangeEvent<[^>]*>;?\s*/g);
    if (changeEventMatches && changeEventMatches.length > 1) {
      // Keep only the first occurrence
      let isFirst = true;
      content = content.replace(/type ChangeEvent<[^>]*> = React\.ChangeEvent<[^>]*>;?\s*/g, (match) => {
        if (isFirst) {
          isFirst = false;
          return match;
        }
        return '';
      });
      modified = true;
      console.log(`Removed duplicate ChangeEvent declarations from: ${filePath}`);
    }
    
    // Remove duplicate FormEvent type declarations
    const formEventMatches = content.match(/type FormEvent<[^>]*> = React\.FormEvent<[^>]*>;?\s*/g);
    if (formEventMatches && formEventMatches.length > 1) {
      // Keep only the first occurrence
      let isFirst = true;
      content = content.replace(/type FormEvent<[^>]*> = React\.FormEvent<[^>]*>;?\s*/g, (match) => {
        if (isFirst) {
          isFirst = false;
          return match;
        }
        return '';
      });
      modified = true;
      console.log(`Removed duplicate FormEvent declarations from: ${filePath}`);
    }
    
    // Remove duplicate ComponentType type declarations
    const componentTypeMatches = content.match(/type ComponentType<[^>]*> = React\.ComponentType<[^>]*>;?\s*/g);
    if (componentTypeMatches && componentTypeMatches.length > 1) {
      // Keep only the first occurrence
      let isFirst = true;
      content = content.replace(/type ComponentType<[^>]*> = React\.ComponentType<[^>]*>;?\s*/g, (match) => {
        if (isFirst) {
          isFirst = false;
          return match;
        }
        return '';
      });
      modified = true;
      console.log(`Removed duplicate ComponentType declarations from: ${filePath}`);
    }
    
    // Fix duplicate icon imports that might have been missed
    const duplicateImports = [
      { pattern: /import { ChevronRight } from 'lucide-react';\s*/g, name: 'ChevronRight' },
      { pattern: /import { ChevronDown } from 'lucide-react';\s*/g, name: 'ChevronDown' },
      { pattern: /import { Check } from 'lucide-react';\s*/g, name: 'Check' }
    ];
    
    for (const { pattern, name } of duplicateImports) {
      const matches = content.match(pattern);
      if (matches && matches.length > 1) {
        // Keep only the first occurrence
        let isFirst = true;
        content = content.replace(pattern, (match) => {
          if (isFirst) {
            isFirst = false;
            return match;
          }
          return '';
        });
        modified = true;
        console.log(`Removed duplicate ${name} imports from: ${filePath}`);
      }
    }
    
    // Remove duplicate destructured declarations in import objects
    const lines = content.split('\n');
    const processedLines = [];
    let inIconImportBlock = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check for icon import destructuring blocks like { ChevronRight, ... ChevronRight, }
      if (line.includes('ChevronRight,') || line.includes('ChevronDown,') || line.includes('Check,')) {
        // Remove duplicate entries within the same destructuring block
        const cleanedLine = line
          .replace(/(\s+ChevronRight,)[\s\S]*?(\s+ChevronRight,)/g, '$2')
          .replace(/(\s+ChevronDown,)[\s\S]*?(\s+ChevronDown,)/g, '$2')
          .replace(/(\s+Check,)[\s\S]*?(\s+Check,)/g, '$2');
        
        if (cleanedLine !== line) {
          processedLines.push(cleanedLine);
          modified = true;
        } else {
          processedLines.push(line);
        }
      } else {
        processedLines.push(line);
      }
    }
    
    if (modified) {
      content = processedLines.join('\n');
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
  
  processDirectory(srcDir);
}

fixRemainingDuplicates();
console.log('Remaining duplicates cleanup complete!');
