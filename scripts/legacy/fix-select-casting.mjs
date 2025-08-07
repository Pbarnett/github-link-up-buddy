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
    
    // Look for select elements followed by HTMLInputElement casting
    const selectPattern = /<select[\s\S]*?onChange=\{[^}]*\(e\.target as HTMLInputElement\)\.value[^}]*\}/g;
    
    if (selectPattern.test(content)) {
      content = content.replace(
        /\(e\.target as HTMLInputElement\)\.value/g,
        (match, offset) => {
          // Look back to see if this is within a select element
          const before = content.substring(Math.max(0, offset - 500), offset);
          if (before.includes('<select') && !before.includes('</select>')) {
            return '(e.target as HTMLSelectElement).value';
          }
          return match;
        }
      );
      changed = true;
    }
    
    // Also fix cases where we have select with onChange but using HTMLInputElement
    content = content.replace(
      /<select[^>]*onChange=\{[^}]*\(e\) => [^}]*\(e\.target as HTMLInputElement\)\.value[^}]*\}/g,
      (match) => match.replace('HTMLInputElement', 'HTMLSelectElement')
    );
    
    if (content !== fs.readFileSync(filePath, 'utf8')) {
      changed = true;
    }
    
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

function findFilesToFix(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && !entry.name.includes('node_modules') && !entry.name.includes('.git')) {
        traverse(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function main() {
  console.log('🔧 Fixing HTML select element casting issues...\n');
  
  const srcDir = path.join(projectRoot, 'src');
  const files = findFilesToFix(srcDir);
  
  let processedCount = 0;
  let updatedCount = 0;
  
  for (const file of files) {
    processedCount++;
    if (fixFile(file)) {
      updatedCount++;
      console.log(`✅ Fixed: ${path.relative(projectRoot, file)}`);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Files processed: ${processedCount}`);
  console.log(`   Files updated: ${updatedCount}`);
  console.log(`   Files unchanged: ${processedCount - updatedCount}`);
  
  if (updatedCount > 0) {
    console.log('\n✨ Select element casting issues fixed!');
  } else {
    console.log('\n✅ No select casting issues found.');
  }
}

main();
