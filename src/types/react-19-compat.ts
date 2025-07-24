import * as React from 'react';
/**
 * React 19 Compatibility Types
 *
 * This file provides compatibility types and utilities for React 19
 * that may be missing or changed from previous versions
 */

// Export missing types for React 19 compatibility
export type {
  ComponentType,
  HTMLAttributes,
  ButtonHTMLAttributesProps,
  ElementRef,
  CSSProperties,
} from 'react';

// Additional utility types that might be needed
export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: string;
  className?: string;
  children?: React.ReactNode;
}

// Event handler types - import from our compatibility layer
export type {
  ChangeEventHandler,
  FormEventHandler,
  MouseEventHandler,
  KeyboardEventHandler,
} from '@/lib/react-compat';

// Ref types
export type ForwardedRef<T> = React.ForwardedRef<T>;
export type RefCallback<T> = React.RefCallback<T>;

// Component types
export type FC<P = {}> = React.FC<P>;
export type FunctionComponent<P = {}> = React.FunctionComponent<P>;

// React utilities that might be missing in some contexts
export const memo = memo;
export const forwardRef = forwardRef;
export const _createElement = React.createElement;
export const Fragment = React.Fragment;
export const createContext = createContext;
export const useDeferredValue = React.useDeferredValue;
export const useTransition = React.useTransition;
export const useId = React.useId;

// Default export for convenience
const ReactCompat = {
  memo,
  forwardRef,
  createElement,
  Fragment,
  createContext,
  useDeferredValue,
  useTransition,
  useId,
};

export default ReactCompat;
