const fs = require('fs');

const files = [
  'src/hooks/useConditionalLogic.ts',
  'src/hooks/useDynamicForm.ts', 
  'src/hooks/useFormValidation.ts',
  'src/lib/launchdarkly/client-react.tsx'
];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let fixed = content;
  
  // Fix malformed React import
  fixed = fixed.replace(
    /import\s+\{\s*\nimport\s+\*\s+as\s+React\s+from\s+['"]react['"]\s*;?\s*/g,
    "import * as React from 'react';\nimport { "
  );
  
  // Fix nested import statements
  fixed = fixed.replace(
    /import\s+\{\s+import\s+\{\s+([^}]+)\s+\}\s+from\s+['"]react['"]\s*;?\s*/g,
    "import { $1 } from 'react';"
  );
  
  // Clean up any remaining malformed patterns
  fixed = fixed.replace(/\}\s+from\s+['"][^'"]+['"]\s*;\s*\n\s*import\s+\*\s+as\s+React/g, '} from \'@/types/dynamic-forms\';\n\nimport * as React');
  fixed = fixed.replace(/\}\s+from\s+['"][^'"]+['"]\s*;\s*\n\s*\{/g, '} from \'@/types/dynamic-forms\';\n\nimport {');
  
  if (fixed !== content) {
    fs.writeFileSync(file, fixed);
    console.log(`Fixed: ${file}`);
  }
});
