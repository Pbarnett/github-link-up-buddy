const fs = require('fs');
const path = require('path');

function addMissingReactImports() {
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
    
    // Skip files that already have comprehensive React imports or are not components
    if (content.includes('import * as React from \'react\'') || !content.includes('tsx')) {
      return;
    }
    
    // Check what React types/functions are used in the file
    const needsReactNode = content.includes('ReactNode') && !content.includes('import { ReactNode }') && !content.includes('import {ReactNode}');
    const needsFC = content.includes(': FC') && !content.includes('import { FC }') && !content.includes('import {FC}');
    const needsMemo = content.includes('memo(') && !content.includes('import { memo }') && !content.includes('import {memo}');
    const needsErrorInfo = content.includes('ErrorInfo') && !content.includes('import { ErrorInfo }') && !content.includes('import {ErrorInfo}');
    const needsComponentType = content.includes('ComponentType') && !content.includes('import { ComponentType }') && !content.includes('import {ComponentType}');
    
    const missingImports = [];
    if (needsReactNode) missingImports.push('ReactNode');
    if (needsFC) missingImports.push('FC');
    if (needsMemo) missingImports.push('memo');
    if (needsErrorInfo) missingImports.push('ErrorInfo');
    if (needsComponentType) missingImports.push('ComponentType');
    
    // If we need to add imports
    if (missingImports.length > 0) {
      // Check if there's already a React import line
      const reactImportMatch = content.match(/import \{([^}]+)\} from ['"]react['"];?/);
      
      if (reactImportMatch) {
        // Add to existing React import
        const existingImports = reactImportMatch[1].split(',').map(s => s.trim());
        const allImports = [...new Set([...existingImports, ...missingImports])];
        const newImportLine = `import { ${allImports.join(', ')} } from 'react';`;
        content = content.replace(/import \{[^}]+\} from ['"]react['"];?/, newImportLine);
        modified = true;
      } else {
        // Add new React import line at the top
        const importLine = `import { ${missingImports.join(', ')} } from 'react';\n`;
        
        // Find the first import or the start of the file
        const firstImportMatch = content.match(/^import [^;]+;?\s*$/m);
        if (firstImportMatch) {
          // Insert before the first import
          const insertIndex = content.indexOf(firstImportMatch[0]);
          content = content.slice(0, insertIndex) + importLine + content.slice(insertIndex);
        } else {
          // Add at the beginning of the file
          content = importLine + content;
        }
        modified = true;
      }
    }
    
    // Fix remaining duplicate ChevronRight/ChevronDown imports
    const chevronRightMatches = content.match(/import { ChevronRight } from 'lucide-react';/g);
    if (chevronRightMatches && chevronRightMatches.length > 1) {
      // Keep only the first occurrence
      let isFirst = true;
      content = content.replace(/import { ChevronRight } from 'lucide-react';/g, () => {
        if (isFirst) {
          isFirst = false;
          return "import { ChevronRight } from 'lucide-react';";
        }
        return '';
      });
      modified = true;
    }
    
    const chevronDownMatches = content.match(/import { ChevronDown } from 'lucide-react';/g);
    if (chevronDownMatches && chevronDownMatches.length > 1) {
      // Keep only the first occurrence
      let isFirst = true;
      content = content.replace(/import { ChevronDown } from 'lucide-react';/g, () => {
        if (isFirst) {
          isFirst = false;
          return "import { ChevronDown } from 'lucide-react';";
        }
        return '';
      });
      modified = true;
    }
    
    const checkMatches = content.match(/import { Check } from 'lucide-react';/g);
    if (checkMatches && checkMatches.length > 1) {
      // Keep only the first occurrence
      let isFirst = true;
      content = content.replace(/import { Check } from 'lucide-react';/g, () => {
        if (isFirst) {
          isFirst = false;
          return "import { Check } from 'lucide-react';";
        }
        return '';
      });
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Added missing imports to: ${filePath}`);
    }
  }
  
  processDirectory(srcDir);
}

addMissingReactImports();
console.log('Missing React imports addition complete!');
