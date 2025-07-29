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

async function fixAllReactImports() {
  console.log('Fixing all React import issues...');
  
  const files = await glob('src/**/*.{ts,tsx}', { 
    cwd: process.cwd(),
    absolute: true 
  });
  
  let totalFixed = 0;
  
  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf8');
      let updatedContent = content;
      
      // Skip files that don't have React imports
      if (!updatedContent.includes('import * as React from \'react\'')) {
        continue;
      }
      
      // Find all React types and functions that need to be imported
      const typesToImport = new Set();
      const functionsToImport = new Set();
      
      // Types that need type imports
      if (updatedContent.includes('ComponentPropsWithoutRef')) {
        typesToImport.add('ComponentPropsWithoutRef');
      }
      if (updatedContent.includes('ElementRef')) {
        typesToImport.add('ElementRef');
      }
      if (updatedContent.includes('HTMLAttributes')) {
        typesToImport.add('HTMLAttributes');
      }
      if (updatedContent.includes('ButtonHTMLAttributes')) {
        typesToImport.add('ButtonHTMLAttributes');
      }
      if (updatedContent.includes('InputHTMLAttributes')) {
        typesToImport.add('InputHTMLAttributes');
      }
      if (updatedContent.includes('ReactElement')) {
        typesToImport.add('ReactElement');
      }
      if (updatedContent.includes('ReactNode')) {
        typesToImport.add('ReactNode');
      }
      
      // Functions that need named imports
      if (updatedContent.includes('React.forwardRef') || updatedContent.includes('forwardRef')) {
        functionsToImport.add('forwardRef');
      }
      if (updatedContent.includes('React.memo') || updatedContent.includes('memo')) {
        functionsToImport.add('memo');
      }
      if (updatedContent.includes('React.createContext') || updatedContent.includes('createContext')) {
        functionsToImport.add('createContext');
      }
      
      // Build the new import statements
      let import ';
      
      if (typesToImport.size > 0) {
        imports += `\nimport type { ${[...typesToImport].join(', ')} } from 'react';`;
      }
      
      if (functionsToImport.size > 0) {
        imports += `\nimport { ${[...functionsToImport].join(', ')} } from 'react';`;
      }
      
      // Replace the existing import
      if (typesToImport.size > 0 || functionsToImport.size > 0) {
        updatedContent = updatedContent.replace(
          /import \* as React from 'react';\s*(\r?\n)?/,
          imports + '\n'
        );
      }
      
      // Replace React.* usage with direct imports where appropriate
      if (functionsToImport.has('forwardRef')) {
        updatedContent = updatedContent.replace(/React\.forwardRef/g, 'forwardRef');
      }
      if (functionsToImport.has('memo')) {
        updatedContent = updatedContent.replace(/React\.memo/g, 'memo');
      }
      if (functionsToImport.has('createContext')) {
        updatedContent = updatedContent.replace(/React\.createContext/g, 'createContext');
      }
      
      // Clean up any destructuring that's no longer needed
      updatedContent = updatedContent.replace(/const \{ ([^}]*forwardRef[^}]*) \} = React;\s*\r?\n?/g, '');
      updatedContent = updatedContent.replace(/const \{ ([^}]*memo[^}]*) \} = React;\s*\r?\n?/g, '');
      updatedContent = updatedContent.replace(/const \{ ([^}]*createContext[^}]*) \} = React;\s*\r?\n?/g, '');
      
      if (content !== updatedContent) {
        writeFileSync(file, updatedContent);
        console.log(`Fixed: ${file}`);
        totalFixed++;
      }
      
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
  
  console.log(`\nFixed ${totalFixed} files with React import issues.`);
}

fixAllReactImports().catch(console.error);
