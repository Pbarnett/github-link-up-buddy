#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { glob } from 'glob';

// Common TypeScript fixes
const fixes = [
  // Fix React 19 Context Provider issues
  {
    pattern: /(\w+)Context = createContext\<[\w\s|<>.,\[\]]+\>\(\{\}\);/g,
    replacement: (match, contextName) => {
      return `${contextName}Context = createContext<${contextName}ContextType | null>(null);`;
    }
  },
  
  // Fix forwardRef type issues
  {
    pattern: /const (\w+) = forwardRef<([^,]+), ([^>]+)>/g,
    replacement: 'const $1 = forwardRef<$2, $3>'
  },
  
  // Fix event target type issues
  {
    pattern: /(\w+)\.target\.value/g,
    replacement: '($1.target as HTMLInputElement).value'
  },
  
  // Fix context hook usage
  {
    pattern: /const context = useContext\((\w+)Context\);\s*return context;/g,
    replacement: `const context = useContext($1Context);
  if (!context) {
    throw new Error('use$1 must be used within $1Provider');
  }
  return context;`
  },
  
  // Fix React import issues
  {
    pattern: /import React from ['"]react['"];?\s*import \{ ([^}]+) \} from ['"]react['"];?/g,
    replacement: 'import React, { $1 } from "react";'
  },
  
  // Fix use hook calls that don't exist in React 18
  {
    pattern: /const \w+ = use\(/g,
    replacement: 'const data = React.use('
  }
];

const typeDefinitionFixes = [
  // Fix missing ComponentProps types
  {
    pattern: /ComponentProps</g,
    replacement: 'React.ComponentProps<'
  },
  
  // Fix React namespace type issues
  {
    pattern: /: React\.React\./g,
    replacement: ': React.'
  },
  
  // Fix React element type issues
  {
    pattern: /React\.Element/g,
    replacement: 'React.ReactElement'
  }
];

function applyFixes(content, fixes) {
  let updatedContent = content;
  
  fixes.forEach(fix => {
    if (typeof fix.replacement === 'function') {
      updatedContent = updatedContent.replace(fix.pattern, fix.replacement);
    } else {
      updatedContent = updatedContent.replace(fix.pattern, fix.replacement);
    }
  });
  
  return updatedContent;
}

function fixContextProviders(content) {
  // Fix context provider default values
  const contextProviderPattern = /(\w+)Provider.*?\{\s*const \[[\w\s,]+\] = useState.*?\n\s*return \(\s*<\w+Context\.Provider value=\{\{\}\}>/gs;
  
  return content.replace(contextProviderPattern, (match) => {
    return match.replace('value={{}}', 'value={contextValue}');
  });
}

function fixAsyncAwaitIssues(content) {
  // Fix await operand issues
  const awaitPattern = /await\s+(\w+)(?!\.)/g;
  
  return content.replace(awaitPattern, (match, varName) => {
    if (content.includes(`${varName}: () =>`)) {
      return `await ${varName}()`;
    }
    return match;
  });
}

function fixQueryHookTypes(content) {
  // Fix useQuery type mismatches
  const useQueryPattern = /useQuery\(\s*\{\s*queryKey:\s*\[[^\]]+\],\s*queryFn:\s*([^,}]+)/g;
  
  return content.replace(useQueryPattern, (match, queryFn) => {
    return match.replace(queryFn, `async () => ${queryFn}`);
  });
}

function fixSupabaseTypes(content) {
  // Fix Supabase client type issues
  if (content.includes('SupabaseClient<Database,')) {
    content = content.replace(
      /: SupabaseClient<Database, [^>]+>/g,
      ': SupabaseClient<Database>'
    );
  }
  
  return content;
}

async function processFiles() {
  try {
    const patterns = [
      'src/**/*.{ts,tsx}',
      'src/components/**/*.{ts,tsx}',
      'src/hooks/**/*.{ts,tsx}',
      'src/contexts/**/*.{ts,tsx}'
    ];
    
    let allFiles = [];
    for (const pattern of patterns) {
      const files = await glob(pattern, { ignore: ['node_modules/**', '**/*.test.*', '**/*.spec.*'] });
      allFiles.push(...files);
    }
    
    // Remove duplicates
    allFiles = [...new Set(allFiles)];
    
    console.log(`Found ${allFiles.length} files to process...`);
    
    let fixedCount = 0;
    
    for (const file of allFiles) {
      try {
        if (!existsSync(file)) continue;
        
        const originalContent = readFileSync(file, 'utf-8');
        let updatedContent = originalContent;
        
        // Apply various fixes
        updatedContent = applyFixes(updatedContent, fixes);
        updatedContent = applyFixes(updatedContent, typeDefinitionFixes);
        updatedContent = fixContextProviders(updatedContent);
        updatedContent = fixAsyncAwaitIssues(updatedContent);
        updatedContent = fixQueryHookTypes(updatedContent);
        updatedContent = fixSupabaseTypes(updatedContent);
        
        if (originalContent !== updatedContent) {
          writeFileSync(file, updatedContent);
          console.log(`✅ Fixed: ${file}`);
          fixedCount++;
        }
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
      }
    }
    
    console.log(`✅ Completed! Fixed ${fixedCount} files.`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

processFiles();
