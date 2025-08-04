/**
 * React 19 Compatibility Types
 *
 * This file provides compatibility types and utilities for React 19
 * that may be missing or changed from previous versions
 */

import * as React from 'react';

// Export standard React types
export type ComponentType<P = {}> = React.ComponentType<P>;
export type HTMLAttributes<T> = React.HTMLAttributes<T>;
export type ButtonHTMLAttributes<T> = React.ButtonHTMLAttributes<T>;
// Simplified ElementRef type to avoid constraint issues
export type ElementRef<T> = any;
export type CSSProperties = React.CSSProperties;

// Additional utility types that might be needed
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  className?: string;
  children?: React.ReactNode;
}

// Event handler types - compatible with both React 18 and 19
export type ChangeEventHandler<T = Element> = React.ChangeEventHandler<T>;
export type FormEventHandler<T = Element> = React.FormEventHandler<T>;
export type MouseEventHandler<T = Element> = React.MouseEventHandler<T>;
export type KeyboardEventHandler<T = Element> = React.KeyboardEventHandler<T>;

// Ref types
export type ForwardedRef<T> = React.ForwardedRef<T>;
export type RefCallback<T> = React.RefCallback<T>;

// Component types
export type FC<P = {}> = React.FC<P>;
export type FunctionComponent<P = {}> = React.FunctionComponent<P>;

// React utilities
export const memo = React.memo;
export const forwardRef = React.forwardRef;
export const createElement = React.createElement;
export const Fragment = React.Fragment;
export const createContext = React.createContext;
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
