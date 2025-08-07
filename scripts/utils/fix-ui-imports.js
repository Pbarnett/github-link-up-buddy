import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

async function fixUIImports() {
  console.log('Fixing React imports in UI components...');
  
  const files = await glob('src/components/ui/*.{ts,tsx}', { 
    cwd: process.cwd(),
    absolute: true 
  });
  
  let totalFixed = 0;
  
  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf8');
      let updatedContent = content;
      
      // If it has namespace import, add proper named imports
      if (updatedContent.includes('import * as React from \'react\'') && 
          !updatedContent.includes('import type {')) {
        
        // Find what React types and functions are used
        const typesToImport = [];
        const functionsToImport = [];
        
        // Check for types
        if (updatedContent.includes('ComponentPropsWithoutRef')) {
          typesToImport.push('ComponentPropsWithoutRef');
        }
        if (updatedContent.includes('ElementRef')) {
          typesToImport.push('ElementRef');
        }
        if (updatedContent.includes('HTMLAttributes')) {
          typesToImport.push('HTMLAttributes');
        }
        if (updatedContent.includes('ButtonHTMLAttributes')) {
          typesToImport.push('ButtonHTMLAttributes');
        }
        if (updatedContent.includes('InputHTMLAttributes')) {
          typesToImport.push('InputHTMLAttributes');
        }
        if (updatedContent.includes('ReactElement')) {
          typesToImport.push('ReactElement');
        }
        if (updatedContent.includes('ReactNode')) {
          typesToImport.push('ReactNode');
        }
        
        // Check for functions
        if (updatedContent.includes('React.forwardRef')) {
          functionsToImport.push('forwardRef');
        }
        if (updatedContent.includes('React.memo')) {
          functionsToImport.push('memo');
        }
        
        // Add imports
        let imports = 'import * as React from \'react\';';
        if (typesToImport.length > 0) {
          imports += `\nimport type { ${[...new Set(typesToImport)].join(', ')} } from 'react';`;
        }
        if (functionsToImport.length > 0) {
          imports += `\nimport { ${[...new Set(functionsToImport)].join(', ')} } from 'react';`;
        }
        
        updatedContent = updatedContent.replace(
          'import * as React from \'react\';',
          imports
        );
        
        // Replace React.forwardRef with just forwardRef if imported
        if (functionsToImport.includes('forwardRef')) {
          updatedContent = updatedContent.replace(/React\.forwardRef/g, 'forwardRef');
        }
        
        // Replace React.memo with just memo if imported
        if (functionsToImport.includes('memo')) {
          updatedContent = updatedContent.replace(/React\.memo/g, 'memo');
        }
      }
      
      if (content !== updatedContent) {
        writeFileSync(file, updatedContent);
        console.log(`Fixed: ${file}`);
        totalFixed++;
      }
      
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
  
  console.log(`\nFixed ${totalFixed} UI component files.`);
}

fixUIImports().catch(console.error);
