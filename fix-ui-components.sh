#!/bin/bash

# List of UI components that still need fixing
components=(
    "enhanced-form.tsx"
    "pagination.tsx" 
    "popover.tsx"
    "input-otp.tsx"
    "chart.tsx"
    "hover-card.tsx"
    "sheet.tsx"
    "scroll-area.tsx"
    "navigation-menu.tsx"
    "drawer.tsx"
    "tooltip.tsx"
    "enhanced-input.tsx"
    "switch.tsx"
    "breadcrumb.tsx"
    "radio-group.tsx"
    "command.tsx"
    "toggle-group.tsx"
    "avatar.tsx"
    "menubar.tsx"
    "modern-scroll-area.tsx"
    "table.tsx"
    "separator.tsx"
    "toggle.tsx"
    "toast.tsx"
    "interactive-button.tsx"
    "dropdown-menu.tsx"
    "context-menu.tsx"
    "form.tsx"
    "carousel.tsx"
)

for component in "${components[@]}"; do
    echo "Processing $component..."
    file_path="src/components/ui/$component"
    
    if [ -f "$file_path" ]; then
        # Add forwardRef destructuring if React.forwardRef is used
        if grep -q "React.forwardRef" "$file_path"; then
            # Check if forwardRef is already destructured
            if ! grep -q "const { forwardRef" "$file_path"; then
                # Add forwardRef destructuring after React import
                sed -i.bak '/import \* as React from '\''react'\'';/a\
const { forwardRef } = React;' "$file_path"
            fi
            
            # Replace React.forwardRef with forwardRef
            sed -i.bak 's/React\.forwardRef</forwardRef</g' "$file_path"
            
            # Replace ElementRef with React.ElementRef
            sed -i.bak 's/ElementRef</React.ElementRef</g' "$file_path"
        fi
        
        # Add memo destructuring if React.memo is used
        if grep -q "React.memo" "$file_path"; then
            if ! grep -q "memo" "$file_path" | head -5; then
                sed -i.bak '/const { forwardRef } = React;/s/forwardRef/forwardRef, memo/' "$file_path"
            fi
            sed -i.bak 's/React\.memo(/memo(/g' "$file_path"
        fi
        
        # Clean up backup files
        rm -f "${file_path}.bak"
        
        echo "Fixed $component"
    else
        echo "File not found: $file_path"
    fi
done

echo "All UI components processed!"
