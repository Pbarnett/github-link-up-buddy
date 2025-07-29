const fs = require('fs');
const path = require('path');

function fixReactTypeImports() {
  const srcDir = './src';
  
  function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        processDirectory(fullPath);
      } else if (entry.isFile() && fullPath.endsWith('.tsx')) {
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
    
    // Check what React types/functions are used in the file
    const needsFC = content.includes(': FC') || content.includes('<FC') || content.includes('FC<');
    const needsReactNode = content.includes(': ReactNode') || content.includes('<ReactNode') || content.includes('ReactNode>') || content.includes('children: ReactNode');
    const needsMemo = content.includes('memo(');
    const needsErrorInfo = content.includes('ErrorInfo');
    const needsComponentType = content.includes('ComponentType');
    
    // If the file already imports from React, check what's missing
    const reactImportMatch = content.match(/import \{([^}]+)\} from ['"]react['"];?/);
    const importStarMatch = content.match(/import \* as React from ['"]react['"];?/);
    
    let missingImports = [];
    let existingImports = [];
    
    if (reactImportMatch) {
      existingImports = reactImportMatch[1].split(',').map(s => s.trim());
    }
    
    // Check which imports are missing
    if (needsFC && !existingImports.includes('FC') && !importStarMatch) {
      missingImports.push('FC');
    }
    if (needsReactNode && !existingImports.includes('ReactNode') && !importStarMatch) {
      missingImports.push('ReactNode');
    }
    if (needsMemo && !existingImports.includes('memo') && !importStarMatch) {
      missingImports.push('memo');
    }
    if (needsErrorInfo && !existingImports.includes('ErrorInfo') && !importStarMatch) {
      missingImports.push('ErrorInfo');
    }
    if (needsComponentType && !existingImports.includes('ComponentType') && !importStarMatch) {
      missingImports.push('ComponentType');
    }
    
    // Handle files with "import * as React" pattern differently
    if (importStarMatch && (needsFC || needsReactNode || needsMemo || needsErrorInfo || needsComponentType)) {
      const typesToAdd = [];
      if (needsFC) typesToAdd.push('FC');
      if (needsReactNode) typesToAdd.push('ReactNode');
      if (needsMemo) typesToAdd.push('memo');
      if (needsErrorInfo) typesToAdd.push('ErrorInfo');
      if (needsComponentType) typesToAdd.push('ComponentType');
      
      if (typesToAdd.length > 0) {
        // Add destructured import after the * as React import
        const newImportLine = `import { ${typesToAdd.join(', ')} } from 'react';\n`;
        content = content.replace(/(import \* as React from ['"]react['"];?\s*\n)/, `$1${newImportLine}`);
        modified = true;
        console.log(`Added destructured imports to: ${filePath} - ${typesToAdd.join(', ')}`);
      }
    } else if (missingImports.length > 0) {
      // Add to existing import or create new one
      if (reactImportMatch) {
        // Add to existing React import
        const allImports = [...new Set([...existingImports, ...missingImports])];
        const newImportLine = `import { ${allImports.join(', ')} } from 'react';`;
        content = content.replace(/import \{[^}]+\} from ['"]react['"];?/, newImportLine);
        modified = true;
        console.log(`Extended existing imports in: ${filePath} - added ${missingImports.join(', ')}`);
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
        console.log(`Added new React import to: ${filePath} - ${missingImports.join(', ')}`);
      }
    }
    
    // Clean up duplicate icon imports
    const duplicateImports = [
      { pattern: /import { ChevronRight } from 'lucide-react';/g, name: 'ChevronRight' },
      { pattern: /import { ChevronDown } from 'lucide-react';/g, name: 'ChevronDown' },
      { pattern: /import { Check } from 'lucide-react';/g, name: 'Check' }
    ];
    
    for (const { pattern, name } of duplicateImports) {
      const matches = content.match(pattern);
      if (matches && matches.length > 1) {
        // Keep only the first occurrence
        let isFirst = true;
        content = content.replace(pattern, () => {
          if (isFirst) {
            isFirst = false;
            return `import { ${name} } from 'lucide-react';`;
          }
          return '';
        });
        modified = true;
        console.log(`Removed duplicate ${name} imports from: ${filePath}`);
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
  
  processDirectory(srcDir);
}

fixReactTypeImports();
console.log('React type import fixing complete!');
