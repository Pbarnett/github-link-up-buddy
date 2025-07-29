const fs = require('fs');
const path = require('path');

function fixSyntaxErrors() {
  const srcDir = './src';
  
  function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        processDirectory(fullPath);
      } else if (entry.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
        try {
          processFile(fullPath);
        } catch (error) {
          console.log(`Error processing ${fullPath}: ${error.message}`);
        }
      }
    }
  }
  
  function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix malformed import statements
    const syntaxFixes = [
      // Fix $2import statements (malformed regex replacement)
      { from: /\$2import \* as React from 'react';\s*/g, to: '' },
      
      // Fix React.createContext and React.forwardRef in imports
      { from: /import \{([^}]*),\s*React\.createContext([^}]*)\} from 'react';/g, to: 'import {$1, createContext$2} from \'react\';' },
      { from: /import \{([^}]*),\s*React\.forwardRef([^}]*)\} from 'react';/g, to: 'import {$1, forwardRef$2} from \'react\';' },
      
      // Fix destructuring assignments with React.* in the wrong place
      { from: /const \{ React\.forwardRef \} = React/g, to: 'const { forwardRef } = React' },
      
      // Fix type declarations that were malformed
      { from: /type React\.ComponentPropsWithoutRef<([^>]*)> = React\.React\.ComponentPropsWithoutRef<\1>/g, to: 'type ComponentPropsWithoutRef<$1> = React.ComponentPropsWithoutRef<$1>' },
      { from: /type React\.ComponentPropsWithoutRef<([^>]*)> =/g, to: 'type ComponentPropsWithoutRef<$1> =' },
      { from: /type React\.HTMLAttributes<([^>]*)> = React\.HTMLAttributes<\1>/g, to: 'type HTMLAttributes<$1> = React.HTMLAttributes<$1>' },
      { from: /type React\.HTMLAttributes<T = HTMLElement> = React\.HTMLAttributes<T>/g, to: 'type HTMLAttributes<T = HTMLElement> = React.HTMLAttributes<T>' },
      
      // Fix export statements 
      { from: /export const React\.createContext = React\.React\.createContext;/g, to: 'export const createContext = React.createContext;' },
      { from: /export const React\.forwardRef = React\.React\.forwardRef;/g, to: 'export const forwardRef = React.forwardRef;' },
      { from: /export type React\.ComponentPropsWithoutRef<([^>]*)> =/g, to: 'export type ComponentPropsWithoutRef<$1> =' },
      { from: /export type React\.ComponentProps<([^>]*)> =/g, to: 'export type ComponentProps<$1> =' },
      { from: /export type React\.HTMLAttributes<([^>]*)> = React\.React\.HTMLAttributes<\1>;/g, to: 'export type HTMLAttributes<$1> = React.HTMLAttributes<$1>;' },
      { from: /export type React\.InputHTMLAttributes<([^>]*)> = React\.React\.InputHTMLAttributes<\1>;/g, to: 'export type InputHTMLAttributes<$1> = React.InputHTMLAttributes<$1>;' },
      
      // Fix object properties and exports
      { from: /React\.HTMLAttributes,/g, to: 'HTMLAttributes,' },
      { from: /React\.InputHTMLAttributes,/g, to: 'InputHTMLAttributes,' },
      { from: /React\.ComponentPropsWithoutRef,/g, to: 'ComponentPropsWithoutRef,' },
      { from: /React\.forwardRef,/g, to: 'forwardRef,' },
      { from: /React\.createContext,/g, to: 'createContext,' },
      
      // Fix object literal properties with colons
      { from: /React\.forwardRef: React\.forwardRef,/g, to: 'forwardRef: React.forwardRef,' },
      { from: /React\.createContext: React\.createContext,/g, to: 'createContext: React.createContext,' },
      
      // Fix static method declarations
      { from: /static React\.createContext\(/g, to: 'static createContext(' },
      
      // Fix export object patterns
      { from: /export const React\.forwardRef = React\.forwardRef;/g, to: 'export const forwardRef = React.forwardRef;' },
      { from: /export const React\.createContext = React\.createContext;/g, to: 'export const createContext = React.createContext;' },
    ];
    
    for (const fix of syntaxFixes) {
      const newContent = content.replace(fix.from, fix.to);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
    
    // Remove any remaining duplicate ChevronRight patterns more carefully
    const lines = content.split('\n');
    const processedLines = [];
    let seenChevronRightImport = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip duplicate ChevronRight import lines
      if (line.trim() === "import { ChevronRight } from 'lucide-react';") {
        if (seenChevronRightImport) {
          modified = true;
          continue; // Skip this duplicate
        }
        seenChevronRightImport = true;
      }
      
      processedLines.push(line);
    }
    
    if (modified) {
      content = processedLines.join('\n');
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed syntax errors in: ${filePath}`);
    }
  }
  
  processDirectory(srcDir);
}

fixSyntaxErrors();
console.log('Syntax error fixing complete!');
