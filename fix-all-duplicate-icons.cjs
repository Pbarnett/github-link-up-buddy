const fs = require('fs');
const path = require('path');

function fixAllDuplicateIcons() {
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
    
    // Fix files that have separate import statements for the same icon from lucide-react
    const iconImportPatterns = [
      'ChevronRight',
      'ChevronDown', 
      'ChevronLeft',
      'ChevronUp',
      'Check',
      'ArrowLeft',
      'ArrowRight'
    ];
    
    for (const icon of iconImportPatterns) {
      // Look for pattern: import { Icon } from 'lucide-react'; followed by a block import that also includes Icon
      const separateImportRegex = new RegExp(`import { ${icon} } from 'lucide-react';\\s*`, 'g');
      const separateImportMatches = content.match(separateImportRegex);
      
      if (separateImportMatches && separateImportMatches.length >= 1) {
        // Check if there's also a multi-icon import block that includes this icon
        const multiImportRegex = new RegExp(`import {[^}]*\\s${icon}[,\\s}]`, 'g');
        const multiImportMatches = content.match(multiImportRegex);
        
        if (multiImportMatches && multiImportMatches.length >= 1) {
          // Remove the separate import since it's duplicated in the multi-import
          content = content.replace(separateImportRegex, '');
          modified = true;
          console.log(`Removed duplicate separate ${icon} import from: ${filePath}`);
        }
      }
    }
    
    // Clean up any empty lines that might have been left
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
  
  processDirectory(srcDir);
}

fixAllDuplicateIcons();
console.log('All duplicate icon imports cleanup complete!');
