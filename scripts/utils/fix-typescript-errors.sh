#!/bin/bash

# TypeScript Error Fix Script
# This script addresses common TypeScript errors in the React project

echo "Starting TypeScript error fixes..."

# First, let's create a helper file for common React type imports
cat > src/types/react-helpers.ts << 'EOF'
// Common React type imports to reduce repetition
import type {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  KeyboardEvent,
  FocusEvent,
  ComponentType,
  ElementType,
  CSSProperties,
  ReactNode,
  FC,
  HTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ComponentProps,
  memo,
  createContext,
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  Fragment,
  Suspense,
  useDeferredValue,
  useTransition,
  useId,
  createElement
} from 'react';

// Event handler types
export type ChangeEventHandler<T = HTMLInputElement> = (event: ChangeEvent<T>) => void;
export type ClickEventHandler<T = HTMLElement> = (event: MouseEvent<T>) => void;
export type SubmitEventHandler<T = HTMLFormElement> = (event: FormEvent<T>) => void;

// Common component prop types
export type { 
  ChangeEvent,
  FormEvent,
  MouseEvent,
  KeyboardEvent,
  FocusEvent,
  ComponentType,
  ElementType,
  CSSProperties,
  ReactNode,
  FC,
  HTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ComponentProps,
  memo,
  createContext,
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  Fragment,
  Suspense,
  useDeferredValue,
  useTransition,
  useId,
  createElement
};
EOF

echo "Created React types helper file."

# Fix common missing React imports by adding them to files that need them
files_to_fix=(
  "src/components/forms/FieldTemplateLibrary.tsx"
  "src/components/profile/ProfileCompletenessIndicator.tsx"
  "src/components/profile/SimpleProfileStatus.tsx"
  "src/components/providers/ShadCNThemeProvider.tsx"
  "src/components/search/DeferredSearchDemo.tsx"
  "src/components/ThreeStepExplainer.tsx"
  "src/components/ProfileRevamp.tsx"
)

# Function to add missing React imports
add_react_imports() {
  local file=$1
  if [[ -f "$file" ]]; then
    # Check if file already has React imports
    if ! grep -q "import.*React" "$file"; then
      # Add React import at the beginning
      sed -i '1i\import * as React from "react";' "$file"
      echo "Added React import to $file"
    fi
  fi
}

# Add React imports to files that need them
for file in "${files_to_fix[@]}"; do
  add_react_imports "$file"
done

echo "TypeScript error fixes completed!"
echo "Next steps:"
echo "1. Run 'npm run type-check' to verify fixes"
echo "2. Address remaining errors manually"
echo "3. Update any remaining implicit 'any' types with proper event handler types from src/types/react-helpers.ts"
