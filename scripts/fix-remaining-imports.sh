#!/bin/bash

# Array of files that still need fixing
files=(
  "src/components/forms/ABTestingManager.tsx"
  "src/components/forms/fields/DynamicFieldRenderer.tsx"
  "src/components/forms/FieldTemplateLibrary.tsx"
  "src/components/forms/FormBuilder.tsx"
  "src/components/forms/SectionEditor.tsx"
  "src/context/WalletProvider.tsx"
  "src/hooks/useConditionalLogic.ts"
  "src/hooks/useDynamicForm.ts"
  "src/hooks/useFormValidation.ts"
  "src/lib/launchdarkly/client-react.tsx"
)

echo "🔧 Fixing remaining React import issues..."

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Fixing $file..."
    # Use sed to fix the import pattern - move React import to the top
    sed -i '' '
      # Look for the problematic pattern where React import is inside another import block
      /import {$/{
        :a
        N
        /import \* as React from '\''react'\'';/{
          s/import \* as React from '\''react'\'';/REACT_IMPORT_PLACEHOLDER/
          b cont
        }
        /} from/{
          b cont
        }
        ba
        :cont
        s/REACT_IMPORT_PLACEHOLDER/import * as React from '\''react'\'';\n/
        s/import {\n\([^}]*\)import \* as React from '\''react'\'';\n/import * as React from '\''react'\'';\nimport {\n\1/
      }
    ' "$file"
    echo "✅ Fixed $file"
  else
    echo "❌ File not found: $file"
  fi
done

echo "✨ Finished fixing React imports!"
