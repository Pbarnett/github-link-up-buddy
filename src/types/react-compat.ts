import React from 'react';
import type {
  ReactNode,
  ReactElement,
  FC,
  HTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ChangeEvent,
  FormEvent,
  MouseEvent,
  KeyboardEvent,
  FocusEvent,
  CSSProperties,
  Ref,
  RefObject,
  MutableRefObject,
  ElementType,
  ElementRef,
  ComponentProps,
  ComponentPropsWithoutRef,
} from 'react';

/**
 * React Types Compatibility Helper
 *
 * Based on TypeScript API documentation, this file provides compatibility
 * for React types that may vary across different React versions.
 *
 * Reference: TypeScript API Part 1 & 2 - Module systems and type definitions
 */

// Core React type re-exports for consistency
export type {
  ReactNode,
  ReactElement,
  FC,
  ElementType,
  ElementRef,
  ComponentProps,
  ComponentPropsWithoutRef,
  HTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ChangeEvent,
  FormEvent,
  MouseEvent,
  KeyboardEvent,
  FocusEvent,
  CSSProperties,
  Ref,
  RefObject,
  MutableRefObject,
};

// React utilities re-exports
export const {
  forwardRef,
  memo,
  createContext,
  createElement,
  Fragment,
  useId,
  useDeferredValue,
} = React;

// Type-safe event handler creators
export const createChangeHandler =
  <T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    handler: (value: string) => void
  ) =>
  (e: ChangeEvent<T>) =>
    handler((e.target as T).value);

export const createClickHandler =
  <T extends HTMLElement>(handler: () => void) =>
  (e: MouseEvent<T>) => {
    e.preventDefault();
    handler();
  };

// Type guards for React elements
export const isReactElement = (value: any): value is ReactElement => {
  return React.isValidElement(value);
};

// Component display name helper
export const setDisplayName = <P>(component: FC<P>, name: string): FC<P> => {
  component.displayName = name;
  return component;
};

// Default export for convenience
export default React;
