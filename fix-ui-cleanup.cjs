#!/usr/bin/env node

const fs = require('fs');
const { glob } = require('glob');

// Function to clean up React imports in UI components
function cleanupReactImports(content) {
  // Remove old import pattern first
  content = content.replace(/import \* as React from ['"]react['"];?\n?/g, '');
  
  // Remove any destructuring from React
  content = content.replace(/const \{ [^}]+ \} = React;?\n?/g, '');
  
  // Remove duplicate forwardRef imports
  content = content.replace(/import \{ forwardRef \} from 'react';\n?import \{ forwardRef \} from 'react';\n?/g, '');
  
  // Fix button component specific issues
  content = content.replace(
    /extends React\.ButtonHTMLAttributes<HTMLButtonElement>/g,
    'extends ButtonHTMLAttributes<HTMLButtonElement>'
  );
  
  // Ensure we have proper imports at the top
  if (!content.includes('import React') && content.includes('forwardRef')) {
    content = `import React, { forwardRef } from 'react';\nimport type { ComponentPropsWithoutRef, ElementRef, HTMLAttributes, ButtonHTMLAttributes } from 'react';\n\n${content}`;
  }
  
  return content;
}

async function main() {
  try {
    // Find all UI component files
    const files = await glob('src/components/ui/**/*.{ts,tsx}');
    
    console.log(`Found ${files.length} UI component files to clean up...`);
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check if file needs cleaning
        if (
          content.includes('import * as React from') ||
          content.includes('const { forwardRef } = React') ||
          content.includes('React.ButtonHTMLAttributes')
        ) {
          const cleanedContent = cleanupReactImports(content);
          fs.writeFileSync(file, cleanedContent, 'utf8');
          console.log(`✅ Cleaned: ${file}`);
        }
      } catch (error) {
        console.error(`❌ Error cleaning ${file}:`, error.message);
      }
    }
    
    console.log('✨ Cleanup completed!');
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  }
}

main();
