import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

// Find all TypeScript files that might use createContext or other React hooks
const files = glob.sync('src/**/*.{ts,tsx}');

let fixedCount = 0;

files.forEach(file => {
  try {
    const content = readFileSync(file, 'utf8');
    
    // Check if file uses React hooks but doesn't import them properly
    const usesCreateContext = content.includes('createContext(') && !content.includes('React.createContext');
    const usesUseState = content.includes('useState(') && !content.includes('React.useState');
    const usesUseEffect = content.includes('useEffect(') && !content.includes('React.useEffect');
    const usesUseContext = content.includes('useContext(') && !content.includes('React.useContext');
    const usesUseCallback = content.includes('useCallback(') && !content.includes('React.useCallback');
    const usesUseMemo = content.includes('useMemo(') && !content.includes('React.useMemo');
    
    const hasReactImport = content.includes('import React');
    
    // Skip files that don't have React imports or don't need fixing
    if (!hasReactImport || (!usesCreateContext && !usesUseState && !usesUseEffect && 
                         !usesUseContext && !usesUseCallback && !usesUseMemo)) {
      return;
    }
    
    // Determine what hooks are needed
    const neededHooks = [];
    if (usesCreateContext) neededHooks.push('createContext');
    if (usesUseState) neededHooks.push('useState');
    if (usesUseEffect) neededHooks.push('useEffect');
    if (usesUseContext) neededHooks.push('useContext');
    if (usesUseCallback) neededHooks.push('useCallback');
    if (usesUseMemo) neededHooks.push('useMemo');
    
    if (neededHooks.length === 0) return;
    
    console.log(`Fixing ${file}... (adding: ${neededHooks.join(', ')})`);
    
    let newContent = content;
    
    // Check current import pattern and update accordingly
    if (content.includes('import React, { forwardRef }')) {
      // Already has named imports, add to them
      const existingImports = /import React, \{ ([^}]+) \}/.exec(content);
      if (existingImports) {
        const currentImports = existingImports[1].split(',').map(s => s.trim());
        const allImports = [...new Set([...currentImports, ...neededHooks])].sort();
        newContent = content.replace(
          /import React, \{ [^}]+ \}/,
          `import React, { ${allImports.join(', ')} }`
        );
      }
    } else if (content.includes('import React from')) {
      // Simple React import, add named imports
      newContent = content.replace(
        /import React from ["']react["'];/,
        `import React, { ${neededHooks.join(', ')} } from 'react';`
      );
    }
    
    if (newContent !== content) {
      writeFileSync(file, newContent, 'utf8');
      fixedCount++;
      console.log(`  ✅ Fixed ${file}`);
    } else {
      console.log(`  ⚠️  Could not fix ${file} - manual review needed`);
    }
    
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\n✅ Fixed ${fixedCount} files with React hooks import issues.`);
