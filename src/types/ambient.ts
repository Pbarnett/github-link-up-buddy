// Global ambient module declarations
// For libraries without proper TypeScript support

import * as React from 'react';
type _Component<P = {}, S = {}> = React.Component<P, S>;

declare module 'murmurhash-js' {
  export function murmur3(key: string, seed?: number): number;
  export function murmur2(key: string, seed?: number): number;
}

declare module 'input-otp' {
  export interface OTPInputProps
    extends Omit<React.ComponentProps<'input'>, 'onChange' | 'value'> {
    value: string;
    onChange: (value: string) => void;
    numInputs?: number;
    separator?: ReactNode;
    isDisabled?: boolean;
    hasErrored?: boolean;
    isInputNum?: boolean;
    isInputSecure?: boolean;
    containerStyle?: CSSProperties;
    inputStyle?: CSSProperties;
    focusStyle?: CSSProperties;
    disabledStyle?: CSSProperties;
    errorStyle?: CSSProperties;
    shouldAutoFocus?: boolean;
  }

  export const OTPInput: FC<OTPInputProps>;
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGProps<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

// Environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
    VITE_STRIPE_PUBLISHABLE_KEY: string;
    DATABASE_URL: string;
    STRIPE_SECRET_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
  }
}

// Vite env variables
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_APP_TITLE: string;
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
