#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to fix based on the production deployment report
const filesToFix = [
  'src/components/forms/FormBuilder.tsx',
  'src/components/forms/SectionEditor.tsx', 
  'src/hooks/useConditionalLogic.ts',
  'src/hooks/useDynamicForm.ts',
  'src/hooks/useFormValidation.ts',
  'src/lib/launchdarkly/client-react.tsx'
];

function fixTypeScriptImports(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Common patterns to fix
  const fixes = [
    // Fix malformed import statements like "import { \nimport * as React"
    {
      pattern: /import\s+\{\s*\nimport\s+\*\s+as\s+React\s+from\s+['"]react['"]\s*;?\s*/g,
      replacement: "import * as React from 'react';\nimport { "
    },
    
    // Fix React import duplicates
    {
      pattern: /import\s+\*\s+as\s+React\s+from\s+['"]react['"]\s*;?\s*\nimport\s+\*\s+as\s+React\s+from\s+['"]react['"]\s*;?\s*/g,
      replacement: "import * as React from 'react';\n"
    },
    
    // Fix incomplete import statements
    {
      pattern: /import\s+\{\s*\n\s*Type,/g,
      replacement: "import {\n  Type,"
    },
    
    // Fix type definitions appearing in wrong places
    {
      pattern: /type\s+_Component<.*?>\s*=\s*React\.Component<.*?>\s*;\s*\ntype\s+FC<.*?>\s*=\s*React\.FC<.*?>\s*;\s*\n(import\s+)/g,
      replacement: "$1"
    },
    
    // Add missing React hook imports
    {
      pattern: /(import\s+\*\s+as\s+React\s+from\s+['"]react['"]\s*;?\s*)\n(?!import\s+\{[^}]*useState)/,
      replacement: (match, reactImport) => {
        const hasUseState = content.includes('useState(');
        const hasUseEffect = content.includes('useEffect(');
        const hasUseCallback = content.includes('useCallback(');
        const hasUseMemo = content.includes('useMemo(');
        const hasUseRef = content.includes('useRef(');
        const hasUseContext = content.includes('useContext(');
        
        const hooks = [];
        if (hasUseState) hooks.push('useState');
        if (hasUseEffect) hooks.push('useEffect');
        if (hasUseCallback) hooks.push('useCallback');
        if (hasUseMemo) hooks.push('useMemo');
        if (hasUseRef) hooks.push('useRef');
        if (hasUseContext) hooks.push('useContext');
        
        if (hooks.length > 0) {
          return `${reactImport}\nimport { ${hooks.join(', ')} } from 'react';\n`;
        }
        return match;
      }
    }
  ];

  // Apply fixes
  fixes.forEach(fix => {
    if (typeof fix.replacement === 'function') {
      content = content.replace(fix.pattern, fix.replacement);
    } else {
      content = content.replace(fix.pattern, fix.replacement);
    }
  });

  // Clean up multiple consecutive newlines
  content = content.replace(/\n{3,}/g, '\n\n');
  
  // Clean up any remaining malformed imports
  content = content.replace(/import\s+\{\s*\n\s*\n/g, 'import {\n  ');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed imports in: ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
  }
}

console.log('🔧 Fixing remaining TypeScript import issues...\n');

filesToFix.forEach(fixTypeScriptImports);

console.log('\n✅ TypeScript import fixes complete!');
