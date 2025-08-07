#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { glob } from 'glob';

const componentFixes = [
  // Fix import statements
  {
    pattern: /import \* as React from ['"]react['"];?\s*const \{ ([^}]+) \} = React;/g,
    replacement: 'import React, { $1 } from "react";'
  },
  
  // Fix corrupted type definitions
  {
    pattern: /type React\.ComponentProps<([^>]+)> = React\.React\.ComponentProps<\1>;/g,
    replacement: 'type ComponentProps<$1> = React.ComponentProps<$1>;'
  },
  
  // Fix malformed type declarations
  {
    pattern: /type (\w+)<([^>]*)> = \1<\2>;/g,
    replacement: ''
  },
  
  // Fix React forwardRef usage without proper import
  {
    pattern: /const (\w+) = forwardRef</g,
    replacement: 'const $1 = React.forwardRef<'
  },
  
  // Fix missing ComponentProps in carousel/sidebar
  {
    pattern: /HTMLButtonElementProps<typeof Button>/g,
    replacement: 'React.ComponentProps<typeof Button>'
  },
  
  // Fix context declarations
  {
    pattern: /createContext<([^>]+)>\(undefined\)/g,
    replacement: 'createContext<$1 | null>(null)'
  },
  
  // Fix event.target.value errors
  {
    pattern: /(\w+)\.target\.value/g,
    replacement: '($1.target as HTMLInputElement).value'
  }
];

const specificFileFixes = {
  'src/components/ui/sidebar.tsx': [
    {
      pattern: /type React\.ComponentProps<([^>]+)> = React\.ComponentProps<\1>;/g,
      replacement: ''
    },
    {
      pattern: /variant = "[^"]*", size = "[^"]*"/g,
      replacement: 'variant = "default" as const, size = "default" as const'
    }
  ],
  
  'src/components/ui/carousel.tsx': [
    {
      pattern: /HTMLButtonElementProps<typeof Button>/g,
      replacement: 'React.ComponentProps<typeof Button>'
    }
  ],
  
  'src/types/react-hook-form.ts': [
    {
      pattern: /type (\w+)<([^>]*)> = \1<\2>;/g,
      replacement: ''
    }
  ]
};

async function fixFiles() {
  try {
    const patterns = [
      'src/components/ui/*.{ts,tsx}',
      'src/types/*.{ts,tsx}',
      'src/contexts/*.{ts,tsx}'
    ];
    
    let allFiles = [];
    for (const pattern of patterns) {
      const files = await glob(pattern, { ignore: ['node_modules/**', '**/*.test.*'] });
      allFiles.push(...files);
    }
    
    // Remove duplicates
    allFiles = [...new Set(allFiles)];
    
    console.log(`Found ${allFiles.length} files to fix...`);
    
    let fixedCount = 0;
    
    for (const file of allFiles) {
      if (!existsSync(file)) continue;
      
      try {
        let content = readFileSync(file, 'utf-8');
        const originalContent = content;
        
        // Apply general fixes
        componentFixes.forEach(fix => {
          content = content.replace(fix.pattern, fix.replacement);
        });
        
        // Apply file-specific fixes
        if (specificFileFixes[file]) {
          specificFileFixes[file].forEach(fix => {
            content = content.replace(fix.pattern, fix.replacement);
          });
        }
        
        // Clean up any empty lines created by removals
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
        
        if (content !== originalContent) {
          writeFileSync(file, content);
          console.log(`✅ Fixed: ${file}`);
          fixedCount++;
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
      }
    }
    
    console.log(`✅ Fixed ${fixedCount} files successfully!`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixFiles();
