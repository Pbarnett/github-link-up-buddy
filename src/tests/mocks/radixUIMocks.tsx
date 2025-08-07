/**
 * Enhanced Radix UI Component Mocks
 * 
 * Comprehensive mocks for Radix UI components used in the Trip Request Form.
 * These mocks provide test-friendly versions that maintain the same API surface
 * while being easily testable and providing proper accessibility attributes.
 */

import React from 'react';
import React from 'react'; } from 'vitest';

// Mock Radix UI Popover components
export const mockPopoverComponents = {
  Popover: ({ children, open, onOpenChange, ...props }: any) => {
    return (
      <div 
        data-testid="popover" 
        data-state={open ? 'open' : 'closed'}
        {...props}
      >
        {React.Children.map(children, child => 
          React.isValidElement(child) 
            ? React.cloneElement(child, { open, onOpenChange })
            : child
        )}
      </div>
    );
  },
  
  PopoverTrigger: ({ children, asChild, onClick, ...props }: any) => {
    return asChild && React.isValidElement(children) ? (
      React.cloneElement(children, {
        ...props,
        'data-testid': 'popover-trigger',
        onClick: (e: Event) => {
          onClick?.(e);
          children.props.onClick?.(e);
        },
      })
    ) : (
      <button 
        data-testid="popover-trigger" 
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  },
  
  PopoverContent: ({ children, side, align, ...props }: any) => (
    <div 
      data-testid="popover-content"
      data-side={side}
      data-align={align}
      role="dialog"
      {...props}
    >
      {children}
    </div>
  ),
  
  PopoverArrow: (props: any) => (
    <div data-testid="popover-arrow" {...props} />
  ),
  
  PopoverClose: ({ children, asChild, onClick, ...props }: any) => (
    asChild && React.isValidElement(children) ? (
      React.cloneElement(children, {
        ...props,
        'data-testid': 'popover-close',
        onClick,
      })
    ) : (
      <button 
        data-testid="popover-close" 
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    )
  ),
};

// Mock Radix UI Switch components
export const mockSwitchComponents = {
  Switch: ({ 
    checked, 
    onCheckedChange, 
    disabled, 
    name, 
    value,
    ...props 
  }: any) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
    };
    
    return (
      <button
        role="switch"
        aria-checked={checked}
        data-testid="switch"
        data-state={checked ? 'checked' : 'unchecked'}
        disabled={disabled}
        onClick={() => !disabled && onCheckedChange?.(!checked)}
        {...props}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          name={name}
          value={value}
          style={{ display: 'none' }}
        />
        <span data-testid="switch-thumb" />
      </button>
    );
  },
  
  SwitchThumb: (props: any) => (
    <span data-testid="switch-thumb" {...props} />
  ),
};

// Mock Radix UI Select components
export const mockSelectComponents = {
  Select: ({ 
    children, 
    value, 
    onValueChange, 
    open, 
    onOpenChange,
    disabled,
    name,
    ...props 
  }: any) => {
    const [isOpen, setIsOpen] = React.useState(open || false);
    
    React.useEffect(() => {
      setIsOpen(open || false);
    }, [open]);
    
    const handleOpenChange = (newOpen: boolean) => {
      setIsOpen(newOpen);
      onOpenChange?.(newOpen);
    };
    
    return (
      <div 
        data-testid="select"
        data-state={isOpen ? 'open' : 'closed'}
        {...props}
      >
        {React.Children.map(children, child =>
          React.isValidElement(child)
            ? React.cloneElement(child, {
                value,
                onValueChange,
                open: isOpen,
                onOpenChange: handleOpenChange,
                disabled,
                name,
              })
            : child
        )}
      </div>
    );
  },
  
  SelectTrigger: ({ 
    children, 
    onClick, 
    open, 
    onOpenChange, 
    disabled,
    ...props 
  }: any) => {
    const handleClick = () => {
      if (!disabled) {
        const newOpen = !open;
        onOpenChange?.(newOpen);
        onClick?.();
      }
    };
    
    return (
      <button
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        data-testid="select-trigger"
        data-state={open ? 'open' : 'closed'}
        disabled={disabled}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  },
  
  SelectValue: ({ placeholder, value, ...props }: any) => (
    <span 
      data-testid="select-value" 
      data-placeholder={!value}
      {...props}
    >
      {value || placeholder}
    </span>
  ),
  
  SelectIcon: ({ children, ...props }: any) => (
    <span data-testid="select-icon" {...props}>
      {children || '▼'}
    </span>
  ),
  
  SelectPortal: ({ children, ...props }: any) => (
    <div data-testid="select-portal" {...props}>
      {children}
    </div>
  ),
  
  SelectContent: ({ 
    children, 
    open, 
    position, 
    side, 
    align,
    ...props 
  }: any) => {
    if (!open) return null;
    
    return (
      <div
        role="listbox"
        data-testid="select-content"
        data-state="open"
        data-side={side}
        data-align={align}
        {...props}
      >
        {children}
      </div>
    );
  },
  
  SelectViewport: ({ children, ...props }: any) => (
    <div data-testid="select-viewport" {...props}>
      {children}
    </div>
  ),
  
  SelectGroup: ({ children, ...props }: any) => (
    <div role="group" data-testid="select-group" {...props}>
      {children}
    </div>
  ),
  
  SelectLabel: ({ children, ...props }: any) => (
    <div role="group" data-testid="select-label" {...props}>
      {children}
    </div>
  ),
  
  SelectItem: ({ 
    children, 
    value, 
    onValueChange, 
    disabled,
    ...props 
  }: any) => {
    const handleClick = () => {
      if (!disabled) {
        onValueChange?.(value);
      }
    };
    
    return (
      <div
        role="option"
        aria-selected={false}
        data-testid="select-item"
        data-value={value}
        data-disabled={disabled}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    );
  },
  
  SelectItemText: ({ children, ...props }: any) => (
    <span data-testid="select-item-text" {...props}>
      {children}
    </span>
  ),
  
  SelectItemIndicator: ({ children, ...props }: any) => (
    <span data-testid="select-item-indicator" {...props}>
      {children || '✓'}
    </span>
  ),
  
  SelectScrollUpButton: ({ children, ...props }: any) => (
    <button data-testid="select-scroll-up" {...props}>
      {children || '▲'}
    </button>
  ),
  
  SelectScrollDownButton: ({ children, ...props }: any) => (
    <button data-testid="select-scroll-down" {...props}>
      {children || '▼'}
    </button>
  ),
  
  SelectSeparator: (props: any) => (
    <div role="separator" data-testid="select-separator" {...props} />
  ),
  
  SelectArrow: (props: any) => (
    <div data-testid="select-arrow" {...props} />
  ),
};

// Export all mocks as Vitest mocks
export const radixUIMocks = {
  '@radix-ui/react-popover': () => mockPopoverComponents,
  '@radix-ui/react-switch': () => mockSwitchComponents,
  '@radix-ui/react-select': () => mockSelectComponents,
};

// Convenience function to setup all Radix UI mocks
export function setupRadixUIMocks(): void {
  // Mock Popover components
  vi.mock('@radix-ui/react-popover', () => mockPopoverComponents);
  
  // Mock Switch components
  vi.mock('@radix-ui/react-switch', () => mockSwitchComponents);
  
  // Mock Select components
  vi.mock('@radix-ui/react-select', () => mockSelectComponents);
  
  // Mock other commonly used Radix components
  vi.mock('@radix-ui/react-dialog', () => ({
    Dialog: ({ children, open, onOpenChange, ...props }: any) => (
      <div data-testid="dialog" data-state={open ? 'open' : 'closed'} {...props}>
        {children}
      </div>
    ),
    DialogTrigger: ({ children, asChild, ...props }: any) =>
      asChild ? children : <button data-testid="dialog-trigger" {...props}>{children}</button>,
    DialogContent: ({ children, ...props }: any) => (
      <div role="dialog" data-testid="dialog-content" {...props}>
        {children}
      </div>
    ),
    DialogHeader: ({ children, ...props }: any) => (
      <div data-testid="dialog-header" {...props}>{children}</div>
    ),
    DialogTitle: ({ children, ...props }: any) => (
      <h2 data-testid="dialog-title" {...props}>{children}</h2>
    ),
    DialogDescription: ({ children, ...props }: any) => (
      <p data-testid="dialog-description" {...props}>{children}</p>
    ),
    DialogClose: ({ children, asChild, ...props }: any) =>
      asChild ? children : <button data-testid="dialog-close" {...props}>{children}</button>,
  }));
  
  vi.mock('@radix-ui/react-checkbox', () => ({
    Checkbox: ({ checked, onCheckedChange, disabled, name, value, ...props }: any) => (
      <input
        type="checkbox"
        role="checkbox"
        data-testid="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        disabled={disabled}
        name={name}
        value={value}
        {...props}
      />
    ),
  }));
  
  vi.mock('@radix-ui/react-radio-group', () => ({
    RadioGroup: ({ children, value, onValueChange, ...props }: any) => (
      <div role="radiogroup" data-testid="radio-group" {...props}>
        {React.Children.map(children, child =>
          React.isValidElement(child)
            ? React.cloneElement(child, { groupValue: value, onValueChange })
            : child
        )}
      </div>
    ),
    RadioGroupItem: ({ value, groupValue, onValueChange, ...props }: any) => (
      <input
        type="radio"
        role="radio"
        data-testid="radio-item"
        value={value}
        checked={groupValue === value}
        onChange={() => onValueChange?.(value)}
        {...props}
      />
    ),
  }));
  
  // Mock Tooltip components
  vi.mock('@radix-ui/react-tooltip', () => ({
    TooltipProvider: ({ children, ...props }: any) => (
      <div data-testid="tooltip-provider" {...props}>{children}</div>
    ),
    Tooltip: ({ children, ...props }: any) => (
      <div data-testid="tooltip" {...props}>{children}</div>
    ),
    TooltipTrigger: ({ children, asChild, ...props }: any) =>
      asChild ? children : <div data-testid="tooltip-trigger" {...props}>{children}</div>,
    TooltipContent: ({ children, ...props }: any) => (
      <div role="tooltip" data-testid="tooltip-content" {...props}>
        {children}
      </div>
    ),
  }));
  
  // Mock Label component
  vi.mock('@radix-ui/react-label', () => ({
    Label: ({ children, htmlFor, ...props }: any) => (
      <label data-testid="label" htmlFor={htmlFor} {...props}>
        {children}
      </label>
    ),
  }));
  
  // Mock Separator component
  vi.mock('@radix-ui/react-separator', () => ({
    Separator: ({ orientation = 'horizontal', ...props }: any) => (
      <div
        role="separator"
        data-testid="separator"
        data-orientation={orientation}
        {...props}
      />
    ),
  }));
}

// Enhanced mock with React Hook Form integration
export function createSelectMockWithFormIntegration() {
  return {
    Select: ({ children, value, onValueChange, name, ...props }: any) => {
      const [internalValue, setInternalValue] = React.useState(value);
      
      React.useEffect(() => {
        setInternalValue(value);
      }, [value]);
      
      const handleValueChange = (newValue: string) => {
        setInternalValue(newValue);
        onValueChange?.(newValue);
      };
      
      return (
        <div data-testid="select" data-value={internalValue} {...props}>
          <input 
            type="hidden" 
            name={name} 
            value={internalValue || ''}
            data-testid={`${name}-hidden-input`}
          />
          {React.Children.map(children, child =>
            React.isValidElement(child)
              ? React.cloneElement(child, {
                  value: internalValue,
                  onValueChange: handleValueChange,
                })
              : child
          )}
        </div>
      );
    },
    // ... other select components
    ...mockSelectComponents,
  };
}

// Type-safe mock creator for better TypeScript integration
export function createTypedRadixMock<T extends Record<string, any>>(
  componentName: string,
  mockImplementation: T
): T {
  return Object.keys(mockImplementation).reduce((acc, key) => {
    acc[key] = vi.fn().mockImplementation(mockImplementation[key]);
    return acc;
  }, {} as T);
}

// Export individual component mocks for selective use
export { mockPopoverComponents as PopoverMocks };
export { mockSwitchComponents as SwitchMocks };
export { mockSelectComponents as SelectMocks };
