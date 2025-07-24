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
    
    // Fix 1: HTMLSelectElement cast to HTMLInputElement
    const selectElementPattern = /\(e\.target as HTMLInputElement\)\.value/g;
    if (content.includes('HTMLSelectElement')) {
      // Only fix if we're dealing with select elements
      content = content.replace(selectElementPattern, '(e.target as HTMLSelectElement).value');
      changed = true;
    }
    
    // Fix 2: Form event generics
    content = content.replace(/FormEvent<HTMLFormElement>/g, 'FormEvent');
    if (content !== fs.readFileSync(filePath, 'utf8')) changed = true;
    
    // Fix 3: Fix empty user objects type assertions
    const emptyUserPattern = /user\?\./g;
    if (content.includes('Property \'email\' does not exist on type \'{}\'')) {
      // Add proper user typing
      content = content.replace(/const.*user.*=.*useUser\(\)/g, 'const { user } = useUser() as { user: { email: string; id: string } | null }');
      changed = true;
    }
    
    // Fix 4: Event target casting for select elements
    const selectEventPattern = /onChange=\{.*?\(e\).*?=>.*?handleInputChange.*?parseInt\(\(e\.target as HTMLInputElement\)\.value\)/g;
    content = content.replace(selectEventPattern, (match) => {
      return match.replace('HTMLInputElement', 'HTMLSelectElement');
    });
    if (content !== fs.readFileSync(filePath, 'utf8')) changed = true;
    
    // Fix 5: Array.push never type issues
    const arrayPushPattern = /const\s+(\w+)\s*=\s*\[\];?\s*\n.*for.*\{\s*\n.*\1\.push/g;
    content = content.replace(arrayPushPattern, (match, arrayName) => {
      return match.replace(`const ${arrayName} = [];`, `const ${arrayName}: string[] = [];`);
    });
    if (content !== fs.readFileSync(filePath, 'utf8')) changed = true;
    
    // Fix 6: Missing component prop interfaces
    if (content.includes('Property \'initialData\' does not exist')) {
      // Add component prop interfaces for wizard steps
      const interfaceToAdd = `
interface StepProps {
  initialData?: any;
  onNext?: (data: any) => void;
  onPrevious?: () => void;
  criteriaData?: any;
  travelerData?: any;
  isLoading?: boolean;
}
`;
      // Insert before the first component definition
      const componentPattern = /(export\s+const\s+\w+.*?:\s*(?:React\.)?FC)/;
      if (componentPattern.test(content)) {
        content = content.replace(componentPattern, interfaceToAdd + '\n$1<StepProps>');
        changed = true;
      }
    }
    
    // Fix 7: Badge onClick prop issue
    if (content.includes('Property \'onClick\' does not exist on type')) {
      content = content.replace(
        /onClick=\{.*?\}/g,
        'className="cursor-pointer" onClick={$&}'
      );
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

function findFilesToFix(dir, extensions = ['.ts', '.tsx']) {
  const files = [];
  
  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && !entry.name.includes('node_modules') && !entry.name.includes('.git')) {
        traverse(fullPath);
      } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
        // Skip declaration files and compatibility file
        if (!entry.name.endsWith('.d.ts') && !entry.name.includes('react-19-compat')) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

function main() {
  console.log('🔧 Fixing common TypeScript issues...\n');
  
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
    console.log('\n✨ Common issues fixed successfully!');
  } else {
    console.log('\n✅ No common issues found to fix.');
  }
}

main();
