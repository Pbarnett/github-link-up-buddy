import React from 'react';
import type {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  KeyboardEvent,
  FocusEvent,
  ElementType,
  CSSProperties,
  ReactNode,
  FC,
  HTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ComponentProps,
} from 'react';

// Common React type imports to reduce repetition across components

// Event handler types for common use cases
export type ChangeEventHandler<T = HTMLInputElement> = (
  event: ChangeEvent<T>
) => void;
export type ClickEventHandler<T = HTMLElement> = (event: MouseEvent<T>) => void;
export type SubmitEventHandler<T = HTMLFormElement> = (
  event: FormEvent<T>
) => void;
export type KeyboardEventHandler<T = HTMLElement> = (
  event: KeyboardEvent<T>
) => void;
export type FocusEventHandler<T = HTMLElement> = (event: FocusEvent<T>) => void;

// Re-export common types
export type {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  KeyboardEvent,
  FocusEvent,
  ElementType,
  CSSProperties,
  ReactNode,
  FC,
  HTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ComponentProps,
};

// Common component prop patterns
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface BaseFormFieldProps extends BaseComponentProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

// Helper for creating properly typed React.forwardRef components
export type ForwardRefComponent<T, P = {}> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<T>
>;
