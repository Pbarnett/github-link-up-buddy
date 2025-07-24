// Global type declarations for missing modules and ambient types

declare module '@aws-sdk/node-http-handler' {
  export interface NodeHttpHandlerOptions {
    httpAgent?: any;
    httpsAgent?: any;
    connectionTimeout?: number;
    socketTimeout?: number;
  }

  export class NodeHttpHandler {
    constructor(options?: NodeHttpHandlerOptions);
  }
}

declare module '@aws-sdk/client-kms' {
  export * from '@aws-sdk/types';

  export class DecryptionFailedException extends Error {
    readonly name = 'DecryptionFailedException';
  }

  export class EncryptionContextNotValidException extends Error {
    readonly name = 'EncryptionContextNotValidException';
  }
}

declare module '@aws-sdk/client-s3' {
  export * from '@aws-sdk/types';

  export class NoSuchBucketException extends Error {
    readonly name = 'NoSuchBucketException';
  }

  export class NoSuchKeyException extends Error {
    readonly name = 'NoSuchKeyException';
  }

  export class InvalidBucketNameException extends Error {
    readonly name = 'InvalidBucketNameException';
  }

  export class BucketAlreadyExistsException extends Error {
    readonly name = 'BucketAlreadyExistsException';
  }

  export class BucketAlreadyOwnedByYouException extends Error {
    readonly name = 'BucketAlreadyOwnedByYouException';
  }

  export class ObjectNotInActiveTierErrorException extends Error {
    readonly name = 'ObjectNotInActiveTierErrorException';
  }
}

declare module '@aws-sdk/client-dynamodb' {
  export * from '@aws-sdk/types';

  export class ValidationException extends Error {
    readonly name = 'ValidationException';
  }
}

// React useActionState hook (for newer versions of React)
declare module 'react' {
  export function useActionState<State, Payload>(
    action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
    initialState: Awaited<State>,
    permalink?: string
  ): [Awaited<State>, (payload: Payload) => void, boolean];
}

// Next.js navigation module
declare module 'next/navigation' {
  export function useRouter(): {
    push: (href: string) => void;
    replace: (href: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
  };

  export function useSearchParams(): URLSearchParams;
  export function usePathname(): string;
}

// Vite environment variables
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_DUFFEL_ENABLED?: string;
  readonly VITE_AMADEUS_ENABLED?: string;
  readonly VITE_AUTO_BOOKING_ENABLED?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_LD_CLIENT_ID?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_ENVIRONMENT?: string;
  readonly VITE_PLAYWRIGHT_TEST?: string;
  readonly VITE_WALLET_UI_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Process environment variables (for Node.js environments)
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV?: string;
    readonly SUPABASE_URL?: string;
    readonly SUPABASE_ANON_KEY?: string;
    readonly DUFFEL_API_TOKEN_TEST?: string;
    readonly DUFFEL_WEBHOOK_SECRET?: string;
    readonly DUFFEL_API_TOKEN_LIVE?: string;
    readonly DUFFEL_LIVE_ENABLED?: string;
    readonly AWS_CONTAINER_CREDENTIALS_RELATIVE_URI?: string;
  }
}

// Deno environment (if used)
declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
  }
}
