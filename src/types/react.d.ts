// React 19 compatibility fixes
declare module 'react' {
  // Re-export common hooks that might not be properly exported in React 19 types
  export function useState<S>(initialState: S | (() => S)): [S, React.Dispatch<React.SetStateAction<S>>];
  export function useState<S = undefined>(): [S | undefined, React.Dispatch<React.SetStateAction<S | undefined>>];
  
  export function useEffect(effect: React.EffectCallback, deps?: React.DependencyList): void;
  
  export function useCallback<T extends (...args: any[]) => any>(
    callback: T,
    deps: React.DependencyList,
  ): T;
  
  export function useMemo<T>(factory: () => T, deps: React.DependencyList): T;
  
  export function useContext<T>(context: React.Context<T>): T;
  
  export function useReducer<R extends React.Reducer<any, any>, I>(
    reducer: R,
    initializerArg: I,
    initializer: (arg: I) => React.ReducerState<R>
  ): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>];
  
  export function useReducer<R extends React.Reducer<any, any>>(
    reducer: R,
    initialState: React.ReducerState<R>,
    initializer?: undefined
  ): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>];
  
  export function useRef<T>(initialValue: T): React.MutableRefObject<T>;
  export function useRef<T>(initialValue: T | null): React.RefObject<T>;
  export function useRef<T = undefined>(): React.MutableRefObject<T | undefined>;
  
  export function useImperativeHandle<T, R extends T>(
    ref: React.Ref<T> | undefined,
    init: () => R,
    deps?: React.DependencyList
  ): void;
  
  export function useLayoutEffect(
    effect: React.EffectCallback,
    deps?: React.DependencyList,
  ): void;
  
  export function useDebugValue<T>(
    value: T,
    format?: (value: T) => any,
  ): void;
  
  // Common types that should be available
  export type ReactNode = React.ReactNode;
  export type FC<P = {}> = React.FC<P>;
  export type Component<P = {}, S = {}, SS = any> = React.Component<P, S, SS>;
  export type FormEvent<T = Element> = React.FormEvent<T>;
  export type ChangeEvent<T = Element> = React.ChangeEvent<T>;
  export type ComponentType<P = {}> = React.ComponentType<P>;
  export type ErrorInfo = React.ErrorInfo;
  
  // Re-export Component class properly for React 19
  export const Component: {
    new <P = {}, S = {}>(props: P): React.Component<P, S>;
    prototype: React.Component<any, any>;
  };
  
  // Suspense components that might not be available
  export const Suspense: React.SuspenseType;
  export function lazy<T extends React.ComponentType<any>>(
    factory: () => Promise<{ default: T }>
  ): React.LazyExoticComponent<T>;
  
  export function startTransition(callback: () => void): void;
  export function useTransition(): [boolean, (callback: () => void) => void];
}
