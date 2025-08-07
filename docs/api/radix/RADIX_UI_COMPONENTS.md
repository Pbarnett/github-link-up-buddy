# Radix UI Components API Documentation

## Overview
Comprehensive documentation for Radix UI components used in the Trip Request Form, including TypeScript types, props, and React Hook Form integration patterns.

## @radix-ui/react-popover

### Installation
```bash
npm install @radix-ui/react-popover
```

### Components

#### Popover (Root)
```tsx
interface PopoverProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

const Popover: React.FC<PopoverProps>
```

#### PopoverTrigger
```tsx
interface PopoverTriggerProps {
  asChild?: boolean;
}

const PopoverTrigger: React.ForwardRefExoticComponent<PopoverTriggerProps & React.RefAttributes<HTMLButtonElement>>
```

#### PopoverContent
```tsx
interface PopoverContentProps {
  asChild?: boolean;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;
  onFocusOutside?: (event: FocusOutsideEvent) => void;
  onInteractOutside?: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void;
  forceMount?: true;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionBoundary?: Element | null | Array<Element | null>;
  collisionPadding?: number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;
  arrowPadding?: number;
  sticky?: 'partial' | 'always';
  hideWhenDetached?: boolean;
}

const PopoverContent: React.ForwardRefExoticComponent<PopoverContentProps & React.RefAttributes<HTMLDivElement>>
```

#### PopoverArrow
```tsx
interface PopoverArrowProps {
  asChild?: boolean;
  width?: number;
  height?: number;
}

const PopoverArrow: React.ForwardRefExoticComponent<PopoverArrowProps & React.RefAttributes<SVGSVGElement>>
```

#### PopoverClose
```tsx
interface PopoverCloseProps {
  asChild?: boolean;
}

const PopoverClose: React.ForwardRefExoticComponent<PopoverCloseProps & React.RefAttributes<HTMLButtonElement>>
```

### Usage with React Hook Form
```tsx
import { Controller } from "react-hook-form";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";

function DatePickerField({ control, name, ...props }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Popover>
          <PopoverTrigger asChild>
            <button type="button">
              {field.value ? format(field.value, "PP") : "Pick a date"}
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
    />
  );
}
```

## @radix-ui/react-switch

### Installation
```bash
npm install @radix-ui/react-switch
```

### Components

#### Switch (Root)
```tsx
interface SwitchProps {
  asChild?: boolean;
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
}

const Switch: React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<HTMLButtonElement>>
```

#### SwitchThumb
```tsx
interface SwitchThumbProps {
  asChild?: boolean;
}

const SwitchThumb: React.ForwardRefExoticComponent<SwitchThumbProps & React.RefAttributes<HTMLSpanElement>>
```

### Usage with React Hook Form
```tsx
import { Controller } from "react-hook-form";
import { Switch, SwitchThumb } from "@radix-ui/react-switch";

function SwitchField({ control, name, label, ...props }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, ...field } }) => (
        <div className="flex items-center space-x-2">
          <Switch
            {...field}
            checked={value}
            onCheckedChange={onChange}
            {...props}
          >
            <SwitchThumb />
          </Switch>
          {label && <label>{label}</label>}
        </div>
      )}
    />
  );
}
```

## @radix-ui/react-select

### Installation
```bash
npm install @radix-ui/react-select
```

### Components

#### Select (Root)
```tsx
interface SelectProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  dir?: 'ltr' | 'rtl';
  name?: string;
  disabled?: boolean;
  required?: boolean;
}

const Select: React.FC<SelectProps>
```

#### SelectTrigger
```tsx
interface SelectTriggerProps {
  asChild?: boolean;
}

const SelectTrigger: React.ForwardRefExoticComponent<SelectTriggerProps & React.RefAttributes<HTMLButtonElement>>
```

#### SelectValue
```tsx
interface SelectValueProps {
  asChild?: boolean;
  placeholder?: React.ReactNode;
}

const SelectValue: React.ForwardRefExoticComponent<SelectValueProps & React.RefAttributes<HTMLSpanElement>>
```

#### SelectIcon
```tsx
interface SelectIconProps {
  asChild?: boolean;
}

const SelectIcon: React.ForwardRefExoticComponent<SelectIconProps & React.RefAttributes<HTMLSpanElement>>
```

#### SelectPortal
```tsx
interface SelectPortalProps {
  forceMount?: true;
  container?: HTMLElement;
}

const SelectPortal: React.FC<SelectPortalProps>
```

#### SelectContent
```tsx
interface SelectContentProps {
  asChild?: boolean;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;
  position?: 'item-aligned' | 'popper';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionBoundary?: Element | null | Array<Element | null>;
  collisionPadding?: number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;
  arrowPadding?: number;
  sticky?: 'partial' | 'always';
  hideWhenDetached?: boolean;
}

const SelectContent: React.ForwardRefExoticComponent<SelectContentProps & React.RefAttributes<HTMLDivElement>>
```

#### SelectViewport
```tsx
interface SelectViewportProps {
  asChild?: boolean;
}

const SelectViewport: React.ForwardRefExoticComponent<SelectViewportProps & React.RefAttributes<HTMLDivElement>>
```

#### SelectGroup
```tsx
interface SelectGroupProps {
  asChild?: boolean;
}

const SelectGroup: React.ForwardRefExoticComponent<SelectGroupProps & React.RefAttributes<HTMLDivElement>>
```

#### SelectLabel
```tsx
interface SelectLabelProps {
  asChild?: boolean;
}

const SelectLabel: React.ForwardRefExoticComponent<SelectLabelProps & React.RefAttributes<HTMLDivElement>>
```

#### SelectItem
```tsx
interface SelectItemProps {
  asChild?: boolean;
  value: string;
  disabled?: boolean;
  textValue?: string;
}

const SelectItem: React.ForwardRefExoticComponent<SelectItemProps & React.RefAttributes<HTMLDivElement>>
```

#### SelectItemText
```tsx
interface SelectItemTextProps {
  asChild?: boolean;
}

const SelectItemText: React.ForwardRefExoticComponent<SelectItemTextProps & React.RefAttributes<HTMLSpanElement>>
```

#### SelectItemIndicator
```tsx
interface SelectItemIndicatorProps {
  asChild?: boolean;
  forceMount?: true;
}

const SelectItemIndicator: React.ForwardRefExoticComponent<SelectItemIndicatorProps & React.RefAttributes<HTMLSpanElement>>
```

#### SelectScrollUpButton
```tsx
interface SelectScrollUpButtonProps {
  asChild?: boolean;
}

const SelectScrollUpButton: React.ForwardRefExoticComponent<SelectScrollUpButtonProps & React.RefAttributes<HTMLDivElement>>
```

#### SelectScrollDownButton
```tsx
interface SelectScrollDownButtonProps {
  asChild?: boolean;
}

const SelectScrollDownButton: React.ForwardRefExoticComponent<SelectScrollDownButtonProps & React.RefAttributes<HTMLDivElement>>
```

#### SelectSeparator
```tsx
interface SelectSeparatorProps {
  asChild?: boolean;
}

const SelectSeparator: React.ForwardRefExoticComponent<SelectSeparatorProps & React.RefAttributes<HTMLDivElement>>
```

#### SelectArrow
```tsx
interface SelectArrowProps {
  asChild?: boolean;
  width?: number;
  height?: number;
}

const SelectArrow: React.ForwardRefExoticComponent<SelectArrowProps & React.RefAttributes<SVGSVGElement>>
```

### Usage with React Hook Form
```tsx
import { Controller } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";

function SelectField({ control, name, options, placeholder, ...props }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value} {...props}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}
```

## Common TypeScript Integration Patterns

### Form Data Type Safety
```tsx
interface TripFormData {
  dates: { from: Date; to: Date };
  auto_book_enabled: boolean;
  payment_method?: string;
  max_price?: number;
}

// Ensure your form types match component expectations
type FormFieldProps<T extends FieldPath<TripFormData>> = {
  control: Control<TripFormData>;
  name: T;
};

function AutoBookSwitch({ control, name }: FormFieldProps<"auto_book_enabled">) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <Switch checked={value} onCheckedChange={onChange}>
          <SwitchThumb />
        </Switch>
      )}
    />
  );
}
```

### Error Handling Integration
```tsx
import { FieldError } from "react-hook-form";

function FormField({ 
  control, 
  name, 
  error 
}: {
  control: Control<TripFormData>;
  name: keyof TripFormData;
  error?: FieldError;
}) {
  return (
    <div>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          // Your Radix UI component here
        )}
      />
      {error && (
        <span className="text-red-500 text-sm">{error.message}</span>
      )}
    </div>
  );
}
```

## Testing Patterns

### Mocking Radix UI Components
```tsx
// In your test setup or __mocks__ directory
jest.mock('@radix-ui/react-popover', () => ({
  Popover: ({ children, ...props }) => <div data-testid="popover" {...props}>{children}</div>,
  PopoverTrigger: ({ children, ...props }) => <button data-testid="popover-trigger" {...props}>{children}</button>,
  PopoverContent: ({ children, ...props }) => <div data-testid="popover-content" {...props}>{children}</div>,
}));

jest.mock('@radix-ui/react-switch', () => ({
  Switch: (props) => <input type="checkbox" data-testid="switch" {...props} />,
  SwitchThumb: () => <span data-testid="switch-thumb" />,
}));

jest.mock('@radix-ui/react-select', () => ({
  Select: ({ children, onValueChange, ...props }) => (
    <div data-testid="select" {...props}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { onValueChange })
      )}
    </div>
  ),
  SelectTrigger: ({ children, ...props }) => <button data-testid="select-trigger" {...props}>{children}</button>,
  SelectValue: ({ placeholder, ...props }) => <span data-testid="select-value" {...props}>{placeholder}</span>,
  SelectContent: ({ children, ...props }) => <div data-testid="select-content" {...props}>{children}</div>,
  SelectItem: ({ children, value, ...props }) => (
    <div data-testid="select-item" data-value={value} {...props}>{children}</div>
  ),
}));
```

### Testing Component Interactions
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { useForm } from 'react-hook-form';

function TestComponent() {
  const { control } = useForm<TripFormData>();
  return <AutoBookSwitch control={control} name="auto_book_enabled" />;
}

test('switch toggles auto booking', async () => {
  render(<TestComponent />);
  
  const switchElement = screen.getByTestId('switch');
  expect(switchElement).not.toBeChecked();
  
  fireEvent.click(switchElement);
  expect(switchElement).toBeChecked();
});
```

---
