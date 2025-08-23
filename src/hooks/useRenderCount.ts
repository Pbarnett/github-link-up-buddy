import { useRef } from 'react';

/**
 * Dev-only render counter. Logs counts under a stable label when in Vite dev.
 * Safe to leave during Phase 2; can be removed afterward.
 */
export function useRenderCount(label?: string) {
  const countRef = useRef(0);
  countRef.current += 1;

  if (import.meta.env.DEV && label) {
    // eslint-disable-next-line no-console
    console.count(`render:${label}`);
  }

  return countRef.current;
}

export default useRenderCount;

