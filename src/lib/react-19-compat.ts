

// Re-export React types and functions that may be missing in React 19
export const createContext = React.createContext;
export const forwardRef = React.forwardRef;
export const useId = React.useId;
export const memo = React.memo;
export const useTransition = React.useTransition;
export const useDeferredValue = React.useDeferredValue;
export const Suspense = React.Suspense;
export const Fragment = React.Fragment;
export const createElement = React.createElement;

// Type definitions for compatibility
export type ComponentPropsWithoutRef<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T>;
export type ComponentProps<T extends React.ElementType> =
  React.ComponentProps<T>;
export type ElementRef<T extends React.ElementType> = React.ElementRef<T>;
export type HTMLAttributes<T> = React.HTMLAttributes<T>;
export type CSSProperties = React.CSSProperties;
export type ReactElement = React.ReactElement;
export type KeyboardEvent<T = Element> = React.KeyboardEvent<T>;
export type InputHTMLAttributes<T> = React.InputHTMLAttributes<T>;
export type ButtonHTMLAttributes<T> = React.ButtonHTMLAttributes<T>;
export type TextareaHTMLAttributes<T> = React.TextareaHTMLAttributes<T>;
export type ElementType = React.ElementType;
export type ComponentType<P = {}> = React.ComponentType<P>;
export type Ref<T> = React.Ref<T>;

export default React;
