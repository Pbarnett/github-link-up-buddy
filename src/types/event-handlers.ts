import * as React from 'react';
/**
 * Common TypeScript event handler types for consistent typing across components
 */
// Input element event handlers
export type InputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;
export type TextAreaChangeHandler = (
  e: React.ChangeEvent<HTMLTextAreaElement>
) => void;
export type SelectChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => void;

// Generic form event handlers
export type FormSubmitHandler = (e: React.FormEvent) => void;
export type ButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => void;
export type DivClickHandler = (e: React.MouseEvent<HTMLDivElement>) => void;
export type KeyPressHandler = (e: React.KeyboardEvent<HTMLElement>) => void;

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
