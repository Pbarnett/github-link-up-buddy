#!/bin/bash

# Fix React.forwardRef syntax errors in all UI components
files=(
  "src/components/ui/toast.tsx"
  "src/components/ui/alert-dialog.tsx"
  "src/components/ui/slider.tsx"
  "src/components/ui/progress.tsx"
  "src/components/ui/input-otp.tsx"
  "src/components/ui/hover-card.tsx"
  "src/components/ui/sheet.tsx"
  "src/components/ui/scroll-area.tsx"
  "src/components/ui/navigation-menu.tsx"
  "src/components/ui/accordion.tsx"
  "src/components/ui/drawer.tsx"
  "src/components/ui/tooltip.tsx"
  "src/components/ui/switch.tsx"
  "src/components/ui/breadcrumb.tsx"
  "src/components/ui/radio-group.tsx"
  "src/components/ui/command.tsx"
  "src/components/ui/toggle-group.tsx"
  "src/components/ui/avatar.tsx"
  "src/components/ui/menubar.tsx"
  "src/components/ui/dialog.tsx"
  "src/components/ui/separator.tsx"
  "src/components/ui/toggle.tsx"
  "src/components/ui/checkbox.tsx"
  "src/components/ui/select.tsx"
  "src/components/ui/context-menu.tsx"
  "src/components/ui/form.tsx"
)

for file in "${files[@]}"; do
  echo "Processing $file..."
  # Fix pattern: >PropsWithoutRef< -> >,\n  React.ComponentPropsWithoutRef<
  sed -i '' 's/>PropsWithoutRef</>,\n  React.ComponentPropsWithoutRef</g' "$file"
  
  # Fix pattern: >(\s*$\s*<ComponentName -> >(({ ... }, ref) => (\n  <ComponentName
  # This is more complex, so we'll do it manually for the key files
done

echo "Fixed forwardRef syntax issues"
