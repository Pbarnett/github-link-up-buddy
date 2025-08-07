#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Function to fix React imports in UI components
function fixReactImports(content) {
  // Replace import pattern
  content = content.replace(
    /import \* as React from ['"']react['"];?/g,
    `import React, { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, HTMLAttributes } from 'react';`
  );

  // Replace React.forwardRef calls
  content = content.replace(/React\.forwardRef</g, 'forwardRef<');
  
  // Replace React.ElementRef calls
  content = content.replace(/React\.ElementRef</g, 'ElementRef<');
  
  // Replace React.ComponentPropsWithoutRef calls
  content = content.replace(/React\.ComponentPropsWithoutRef</g, 'ComponentPropsWithoutRef<');
  
  // Replace React.HTMLAttributes calls
  content = content.replace(/React\.HTMLAttributes</g, 'HTMLAttributes<');

  return content;
}

async function main() {
  try {
    // Find all UI component files
    const files = await glob('src/components/ui/**/*.{ts,tsx}');
    
    console.log(`Found ${files.length} UI component files to process...`);
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check if file needs fixing
        if (
          content.includes('import * as React from') ||
          content.includes('React.forwardRef') ||
          content.includes('React.ElementRef') ||
          content.includes('React.ComponentPropsWithoutRef') ||
          content.includes('React.HTMLAttributes')
        ) {
          const fixedContent = fixReactImports(content);
          fs.writeFileSync(file, fixedContent, 'utf8');
          console.log(`✅ Fixed: ${file}`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
      }
    }
    
    console.log('✨ Batch fix completed!');
  } catch (error) {
    console.error('❌ Batch fix failed:', error.message);
    process.exit(1);
  }
}

main();
