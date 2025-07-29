const fs = require('fs');
const path = require('path');

function fixDuplicateTypes() {
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
    
    // Remove duplicate type declarations that are already available from React
    const duplicatePatterns = [
      /^type FC<[^>]*> = React\.FC<[^>]*>;?\s*$/gm,
      /^type ReactNode = React\.ReactNode;?\s*$/gm,
      /^type FormEvent[^=]*= React\.FormEvent[^;]*;?\s*$/gm,
      /^type ChangeEvent[^=]*= React\.ChangeEvent[^;]*;?\s*$/gm,
      /^type ComponentType[^=]*= React\.ComponentType[^;]*;?\s*$/gm,
      /^type ErrorInfo = React\.ErrorInfo;?\s*$/gm,
      /^type HTMLAttributes[^=]*= React\.HTMLAttributes[^;]*;?\s*$/gm,
    ];
    
    for (const pattern of duplicatePatterns) {
      const newContent = content.replace(pattern, '');
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
    
    // Remove duplicate ChevronRight imports and declarations
    const chevronDuplicatePatterns = [
      // Remove duplicate import lines
      /import { ChevronRight } from 'lucide-react';\s*\n(?=[\s\S]*import.*ChevronRight)/g,
      // Remove duplicate declarations in destructuring
      /(\s+ChevronRight,)\s*\n[\s\S]*?(\s+ChevronRight,)/g,
    ];
    
    for (const pattern of chevronDuplicatePatterns) {
      const newContent = content.replace(pattern, '$2');
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
    
    // Fix React.React.forwardRef to React.forwardRef
    const reactForwardRefFix = content.replace(/React\.React\.forwardRef/g, 'React.forwardRef');
    if (reactForwardRefFix !== content) {
      content = reactForwardRefFix;
      modified = true;
    }
    
    // Fix missing React imports for forwardRef, createContext, etc.
    if (content.includes('forwardRef') || content.includes('createContext') || content.includes('Component')) {
      if (!content.includes('import * as React from \'react\'') && !content.includes('import React')) {
        const importMatch = content.match(/^import[^;]+from ['"][^'"]+['"];?\s*$/m);
        if (importMatch) {
          const importLine = "import * as React from 'react';\n";
          content = importLine + content;
          modified = true;
        }
      }
    }
    
    // Fix type imports that should be available directly
    const typeImportFixes = [
      { from: /import { memo } from '@\/types\/react-compat';/, to: '' },
      { from: /ComponentPropsWithoutRef/g, to: 'React.ComponentPropsWithoutRef' },
      { from: /InputHTMLAttributes/g, to: 'React.InputHTMLAttributes' },
      { from: /HTMLElementPropsWithoutRef/g, to: 'React.ComponentPropsWithoutRef' },
      { from: /HTMLOListElementPropsWithoutRef/g, to: 'React.ComponentPropsWithoutRef' },
      { from: /HTMLLIElementPropsWithoutRef/g, to: 'React.ComponentPropsWithoutRef' },
      { from: /HTMLAnchorElementPropsWithoutRef/g, to: 'React.ComponentPropsWithoutRef' },
      { from: /HTMLSpanElementPropsWithoutRef/g, to: 'React.ComponentPropsWithoutRef' },
      
      // Fix direct usage
      { from: /\bforwardRef\b/g, to: 'React.forwardRef' },
      { from: /\bcreateContext\b/g, to: 'React.createContext' },
      { from: /\bComponentProps\b/g, to: 'React.ComponentProps' },
      { from: /\bHTMLAttributes\b/g, to: 'React.HTMLAttributes' },
      { from: /\bDialogProps\b/g, to: 'React.ComponentProps<typeof Dialog>' },
    ];
    
    for (const fix of typeImportFixes) {
      const newContent = content.replace(fix.from, fix.to);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
    
    // Add missing icon imports
    const iconFixes = [
      { icon: 'ChevronDown', needed: content.includes('<ChevronDown') },
      { icon: 'Check', needed: content.includes('<Check') },
      { icon: 'MoreHorizontal', needed: content.includes('<MoreHorizontal') },
      { icon: 'Slot', needed: content.includes('Slot'), package: '@radix-ui/react-slot' }
    ];
    
    for (const { icon, needed, package: pkg } of iconFixes) {
      if (needed && !content.includes(`import { ${icon} }`)) {
        const importPkg = pkg || 'lucide-react';
        const importLine = `import { ${icon} } from '${importPkg}';\n`;
        content = importLine + content;
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${filePath}`);
    }
  }
  
  processDirectory(srcDir);
}

fixDuplicateTypes();
console.log('Duplicate type fixing complete!');
