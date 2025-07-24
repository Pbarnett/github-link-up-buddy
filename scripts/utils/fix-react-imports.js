#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixReactImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Pattern 1: import { forwardRef } from 'react';
    if (content.includes("import { forwardRef } from 'react';")) {
      content = content.replace(
        /import { forwardRef } from 'react';/g,
        "import * as React from 'react';"
      );
      modified = true;
    }

    // Pattern 2: import { forwardRef, ... } from 'react';
    const reactImportRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]react['"];?/g;
    const matches = content.match(reactImportRegex);
    
    if (matches) {
      for (const match of matches) {
        // Extract the imports
        const importsMatch = match.match(/{\s*([^}]+)\s*}/);
        if (importsMatch) {
          const imports = importsMatch[1].split(',').map(s => s.trim());
          
          // Replace with React namespace import
          content = content.replace(match, "import * as React from 'react';");
          
          // Add type imports if needed
          const typeImports = imports.filter(imp => 
            ['ComponentPropsWithoutRef', 'ElementRef', 'HTMLAttributes', 'ButtonHTMLAttributes', 
             'InputHTMLAttributes', 'TextareaHTMLAttributes', 'ComponentProps', 'ReactElement',
             'KeyboardEvent', 'MouseEvent', 'ChangeEvent', 'FormEvent', 'CSSProperties',
             'ThHTMLAttributes', 'TdHTMLAttributes'].includes(imp)
          );
          
          if (typeImports.length > 0) {
            const typeImportLine = `import type { ${typeImports.join(', ')} } from 'react';`;
            content = content.replace(
              "import * as React from 'react';", 
              `import * as React from 'react';\n${typeImportLine}`
            );
          }
          
          modified = true;
        }
      }
    }

    // Fix forwardRef usage
    if (content.includes('forwardRef<')) {
      content = content.replace(/\bforwardRef</g, 'React.forwardRef<');
      modified = true;
    }

    // Fix ComponentPropsWithoutRef usage
    if (content.includes('ComponentPropsWithoutRef<')) {
      content = content.replace(/\bComponentPropsWithoutRef</g, 'React.ComponentPropsWithoutRef<');
      modified = true;
    }

    // Fix ElementRef usage
    if (content.includes('ElementRef<')) {
      content = content.replace(/\bElementRef</g, 'React.ElementRef<');
      modified = true;
    }

    // Fix HTMLAttributes usage
    if (content.includes('HTMLAttributes<')) {
      content = content.replace(/\bHTMLAttributes</g, 'React.HTMLAttributes<');
      modified = true;
    }

    // Fix ButtonHTMLAttributes usage
    if (content.includes('ButtonHTMLAttributes<')) {
      content = content.replace(/\bButtonHTMLAttributes</g, 'React.ButtonHTMLAttributes<');
      modified = true;
    }

    // Fix ComponentProps usage
    if (content.includes('ComponentProps<')) {
      content = content.replace(/\bComponentProps</g, 'React.ComponentProps<');
      modified = true;
    }

    // Fix JSX namespace
    if (content.includes('React.JSX.')) {
      content = content.replace(/React\.JSX\./g, 'React.');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let fixedCount = 0;

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      fixedCount += processDirectory(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      if (fixReactImports(fullPath)) {
        fixedCount++;
      }
    }
  }

  return fixedCount;
}

console.log('🚀 Starting React imports fix...');
const uiComponentsPath = path.join(process.cwd(), 'src', 'components', 'ui');
const fixedCount = processDirectory(uiComponentsPath);
console.log(`\n✨ Fixed ${fixedCount} files with React import issues!`);
