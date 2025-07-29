#!/usr/bin/env node

/**
 * Fix ESLint import/order violations by removing empty lines between import groups
 * According to ESLint documentation flat config requirements
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);  
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');

function fixImportOrder(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const fixedLines = [];
    let inImportSection = false;
    let lastLineWasImport = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isImportLine = line.trim().startsWith('import ') || 
                          (line.trim().startsWith('} from ') && inImportSection) ||
                          (line.trim().startsWith('from ') && inImportSection);
      const isEmptyLine = line.trim() === '';
      
      if (isImportLine) {
        inImportSection = true;
        fixedLines.push(line);
        lastLineWasImport = true;
      } else if (isEmptyLine && inImportSection && lastLineWasImport) {
        // Skip empty lines between imports
        continue;
      } else {
        if (inImportSection && !isImportLine && !isEmptyLine) {
          inImportSection = false;
        }
        fixedLines.push(line);
        lastLineWasImport = false;
      }
    }
    
    const fixedContent = fixedLines.join('\n');
    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent);
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dir) {
  let filesFixed = 0;
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        filesFixed += processDirectory(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        if (fixImportOrder(fullPath)) {
          filesFixed++;
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return filesFixed;
}

const srcDir = path.join(projectRoot, 'src');
console.log('Fixing import order violations...');
const totalFixed = processDirectory(srcDir);
console.log(`✅ Fixed ${totalFixed} files`);
