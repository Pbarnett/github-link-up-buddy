#!/bin/bash

echo "🔧 Fixing remaining TypeScript import issues..."

# FieldTemplateLibrary.tsx
sed -i '' 's/type FC<T = {}> = React.FC<T>;/import * as React from '\''react'\'';\nimport { useState } from '\''react'\'';\n\ntype FC<T = {}> = React.FC<T>;/' src/components/forms/FieldTemplateLibrary.tsx
sed -i '' 's/import {//' src/components/forms/FieldTemplateLibrary.tsx
sed -i '' 's/import \* as React from '\''react'\'';//' src/components/forms/FieldTemplateLibrary.tsx
sed -i '' '1i\
import * as React from '\''react'\'';\
import { useState } from '\''react'\'';\
\
type FC<T = {}> = React.FC<T>;\
\
import {' src/components/forms/FieldTemplateLibrary.tsx

# FormBuilder.tsx  
sed -i '' 's/type FC<T = {}> = React.FC<T>;/import * as React from '\''react'\'';\nimport { useState, useMemo, useCallback } from '\''react'\'';\n\ntype FC<T = {}> = React.FC<T>;/' src/components/forms/FormBuilder.tsx
sed -i '' 's/import {//' src/components/forms/FormBuilder.tsx
sed -i '' 's/import \* as React from '\''react'\'';//' src/components/forms/FormBuilder.tsx

echo "✅ Fixed core form components"

# SectionEditor.tsx
sed -i '' 's/type FC<T = {}> = React.FC<T>;/import * as React from '\''react'\'';\nimport { useState, useMemo } from '\''react'\'';\n\ntype FC<T = {}> = React.FC<T>;/' src/components/forms/SectionEditor.tsx
sed -i '' 's/import {//' src/components/forms/SectionEditor.tsx
sed -i '' 's/import \* as React from '\''react'\'';//' src/components/forms/SectionEditor.tsx

echo "✅ Fixed section editor"

# WalletProvider.tsx
sed -i '' 's/type FC<T = {}> = React.FC<T>;/import * as React from '\''react'\'';\nimport { createContext, useContext, useState, useEffect } from '\''react'\'';\n\ntype FC<T = {}> = React.FC<T>;/' src/context/WalletProvider.tsx
sed -i '' 's/import {//' src/context/WalletProvider.tsx
sed -i '' 's/import \* as React from '\''react'\'';//' src/context/WalletProvider.tsx

echo "✅ Fixed wallet provider"

# Hook files
for file in src/hooks/useConditionalLogic.ts src/hooks/useDynamicForm.ts src/hooks/useFormValidation.ts; do
    sed -i '' 's/type FC<T = {}> = React.FC<T>;/import * as React from '\''react'\'';\nimport { useMemo, useCallback, useState } from '\''react'\'';\n\ntype FC<T = {}> = React.FC<T>;/' "$file"
    sed -i '' 's/import {//' "$file"
    sed -i '' 's/import \* as React from '\''react'\'';//' "$file"
done

echo "✅ Fixed hook files"

# LaunchDarkly client
sed -i '' 's/type FC<T = {}> = React.FC<T>;/import * as React from '\''react'\'';\nimport { useContext, useEffect, useState, useCallback, useMemo } from '\''react'\'';\n\ntype FC<T = {}> = React.FC<T>;/' src/lib/launchdarkly/client-react.tsx
sed -i '' 's/import {//' src/lib/launchdarkly/client-react.tsx  
sed -i '' 's/import \* as React from '\''react'\'';//' src/lib/launchdarkly/client-react.tsx

echo "✅ Fixed LaunchDarkly client"

echo "🎉 All TypeScript import fixes completed!"
