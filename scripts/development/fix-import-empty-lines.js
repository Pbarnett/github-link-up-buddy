#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';

// Get all TypeScript and JavaScript files that need fixing
function getFilesWithImportIssues() {
  try {
    const result = execSync('npm run lint -- --format json', { encoding: 'utf8' });
    const lintResults = JSON.parse(result);
    
    const filesWithEmptyLineIssues = new Set();
    
    lintResults.forEach(fileResult => {
      fileResult.messages.forEach(message => {
        if (message.ruleId === 'import/order' && 
            message.message.includes('There should be no empty line between import groups')) {
          filesWithEmptyLineIssues.add(fileResult.filePath);
        }
      });
    });
    
    return Array.from(filesWithEmptyLineIssues);
  } catch {
    // If JSON parsing fails, fall back to a list of known problematic files
    return [
      'app/trip/confirm/page.tsx',
      'src/components/AddPaymentMethodForm.tsx',
      'src/components/AuthGuard.tsx',
      'src/components/BehavioralTooltip.tsx',
      'src/components/DynamicSocialProof.tsx',
      'src/components/IdentityVerification.tsx',
      'src/components/NotificationPreferences.tsx',
      'src/components/PhoneNumberSetup.tsx',
      'src/components/ProfileForm.tsx',
      'src/components/ProfileRevamp.tsx',
      'src/components/StripePaymentForm.tsx',
      'src/components/TravelerDataForm.tsx'
    ];
  }
}

function fixEmptyLinesBetweenImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const fixedLines = [];
    let inImportSection = false;
    let lastLineWasImport = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Check if this line is an import
      const isImportLine = trimmedLine.startsWith('import ') || 
                          (lastLineWasImport && trimmedLine.startsWith('} from')) ||
                          (lastLineWasImport && trimmedLine.includes('} from'));
      
      // Check if we're entering the import section
      if (isImportLine && !inImportSection) {
        inImportSection = true;
      }
      
      // Check if we're exiting the import section
      if (inImportSection && !isImportLine && trimmedLine !== '' && !trimmedLine.startsWith('//')) {
        inImportSection = false;
      }
      
      // If we're in the import section and this is an empty line, skip it
      if (inImportSection && trimmedLine === '' && lastLineWasImport) {
        continue; // Skip empty lines between imports
      }
      
      fixedLines.push(line);
      lastLineWasImport = isImportLine;
    }
    
    const fixedContent = fixedLines.join('\n');
    
    // Only write if content changed
    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent);
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('Finding files with import empty line issues...');
  const files = getFilesWithImportIssues();
  
  console.log(`Found ${files.length} files with import issues`);
  
  let fixedCount = 0;
  files.forEach(file => {
    if (fixEmptyLinesBetweenImports(file)) {
      fixedCount++;
    }
  });
  
  console.log(`Fixed ${fixedCount} files`);
  
  // Run linter again to check if issues are resolved
  console.log('Running linter to verify fixes...');
  try {
    execSync('npm run lint -- --max-warnings 0', { stdio: 'pipe' });
    console.log('All import issues resolved!');
  } catch {
    console.log('Some issues remain, but progress made');
  }
}

main();
