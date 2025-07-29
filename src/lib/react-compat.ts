import * as React from 'react';
import {
  Suspense,
  Fragment,
  createElement,
  createContext,
  forwardRef,
  memo,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
  useReducer,
  useLayoutEffect,
  useImperativeHandle,
  useInsertionEffect,
  useDeferredValue,
  useTransition,
  startTransition,
  useSyncExternalStore,
  useId,
} from 'react';

type ComponentType<P = {}> = React.ComponentType<P>;
type ElementType = React.ElementType;

type CSSProperties = React.CSSProperties;
/**
 * React 19 Compatibility Layer
 *
 * This module provides compatibility with React 19 by re-exporting
 * functions and types that may have changed or moved.
 */

// Re-export all React functions and types
export {
  Fragment,
  Suspense,
  createElement,
  createContext,
  forwardRef,
  memo,
  startTransition,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useId,
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from 'react';

// Re-export types that are available but may need explicit imports
export type {
  ComponentPropsWithoutRef,
  ElementRef,
  ElementType,
  HTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  ReactElement,
  CSSProperties,
} from 'react';

// React 19 compatibility: FC was deprecated in React 18 and removed in React 19
// Use ComponentType or create a custom type alias
export type FC<P = {}> = ComponentType<P>;

// React 19 compatibility: Use React's internal event types directly
// Since React 19 doesn't export these types directly, we need to use a different approach
// We'll create type aliases that work with React's event system

// Create a temporary div element to extract React's actual event types from JSX.IntrinsicElements
type ReactDivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
type ReactInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

// Extract event types from React's intrinsic element handlers
export type MouseEvent =
  NonNullable<ReactDivProps['onClick']> extends (e: infer E) => void
    ? E
    : never;
export type KeyboardEvent =
  NonNullable<ReactDivProps['onKeyDown']> extends (e: infer E) => void
    ? E
    : never;
export type ChangeEvent =
  NonNullable<ReactInputProps['onChange']> extends (e: infer E) => void
    ? E
    : never;
export type FocusEvent =
  NonNullable<ReactDivProps['onFocus']> extends (e: infer E) => void
    ? E
    : never;
export type FormEvent =
  NonNullable<
    React.DetailedHTMLProps<
      React.FormHTMLAttributes<HTMLFormElement>,
      HTMLFormElement
    >['onSubmit']
  > extends (e: infer E) => void
    ? E
    : never;

// Event handler types - these match React's expected function signatures
export type MouseEventHandler = NonNullable<ReactDivProps['onClick']>;
export type KeyboardEventHandler = NonNullable<ReactDivProps['onKeyDown']>;
export type ChangeEventHandler = NonNullable<ReactInputProps['onChange']>;
export type FocusEventHandler = NonNullable<ReactDivProps['onFocus']>;
export type FormEventHandler = NonNullable<
  React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  >['onSubmit']
>;

// Provide additional compatibility exports
export const ReactCompat = {
  forwardRef: forwardRef,
  createElement: createElement,
  createContext: createContext,
  Fragment: Fragment,
  memo: memo,
  useDeferredValue: useDeferredValue,
  useId: useId,
  use: React.use as typeof React.use,
};

// Default export for convenience
export default React;
