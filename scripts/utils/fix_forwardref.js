import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
// Utility functions
// Removed unused info function
// Removed unused warning function
// Removed unused error function
// Removed unused success function

// Utility functions
// Removed unused log function
  console.log(`[${timestamp}] ${(level || "INFO").toUpperCase()}: ${message}`);

// Find all TypeScript files in UI components that use forwardRef
const files = glob.sync('src/components/ui/*.tsx');

let fixedCount = 0;

files.forEach(file => {
  try {
    const content = readFileSync(file, 'utf8');
    
    // Check if file uses forwardRef but doesn't import it properly
    const usesForwardRef = content.includes('forwardRef<');
    const hasReactImport = content.includes('import React');
    const hasForwardRefImport = content.includes('forwardRef') && (
      content.includes('import { forwardRef }') || 
      content.includes('React.forwardRef')
    );
    
    if (usesForwardRef && hasReactImport && !hasForwardRefImport) {
      console.log(`Fixing ${file}...`);
      
      // Replace React import to include forwardRef
      let newContent = content.replace(
        /import React from ["']react["'];/,
        "import React, { forwardRef } from 'react';"
      );
      
      // If that didn't work, try other React import patterns
      if (newContent === content) {
        newContent = content.replace(
          /import \* as React from ["']react["'];/,
          "import React, { forwardRef } from 'react';"
        );
      }
      
      if (newContent !== content) {
        writeFileSync(file, newContent, 'utf8');
        fixedCount++;
        console.log(`  ✅ Fixed ${file}`);
      } else {
        console.log(`  ⚠️  Could not fix ${file} - manual review needed`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\n✅ Fixed ${fixedCount} files with forwardRef import issues.`);
