/**
 * Common TypeScript event handler types for consistent typing across components
 */
// Input element event handlers
export type InputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;
export type TextAreaChangeHandler = (
  e: ChangeEvent<HTMLTextAreaElement>
) => void;
export type SelectChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => void;

// Generic form event handlers
export type FormSubmitHandler = (e: FormEvent) => void;
export type ButtonClickHandler = (e: MouseEvent<HTMLButtonElement>) => void;
export type DivClickHandler = (e: MouseEvent<HTMLDivElement>) => void;
export type KeyPressHandler = (e: KeyboardEvent<HTMLElement>) => void;

// Value-based handlers (for custom components)
export type ValueChangeHandler = (value: string) => void;
export type NumberValueChangeHandler = (value: number) => void;
export type BooleanValueChangeHandler = (value: boolean) => void;

// Array handlers for multi-value components
export type ArrayValueChangeHandler = (values: string[]) => void;
export type NumberArrayValueChangeHandler = (values: number[]) => void;

// Common patterns for React Hook Form
export type FieldChangeHandler<T = any> = (value: T) => void;
export type CheckboxChangeHandler = (checked: boolean) => void;
