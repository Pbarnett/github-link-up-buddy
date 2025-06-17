import { renderHook } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useFlightSearchV2Flag } from './useFlightSearchV2Flag';

describe('useFlightSearchV2Flag', () => {
  let originalImportMetaEnv: any;

  beforeEach(() => {
    // Store original import.meta.env and stub it
    originalImportMetaEnv = import.meta.env;
  });

  afterEach(() => {
    // Restore original import.meta.env
    vi.stubGlobal('importMetaEnv', originalImportMetaEnv); // Restore original
    vi.unstubAllGlobals();
  });

  it('should return true when VITE_FLAG_FS_V2 is "true"', () => {
    vi.stubGlobal('importMeta', { env: { VITE_FLAG_FS_V2: 'true' } });
    const { result } = renderHook(() => useFlightSearchV2Flag());
    expect(result.current).toBe(true);
  });

  it('should return false when VITE_FLAG_FS_V2 is "false"', () => {
    vi.stubGlobal('importMeta', { env: { VITE_FLAG_FS_V2: 'false' } });
    const { result } = renderHook(() => useFlightSearchV2Flag());
    expect(result.current).toBe(false);
  });

  it('should return false when VITE_FLAG_FS_V2 is not set (undefined)', () => {
    vi.stubGlobal('importMeta', { env: {} }); // VITE_FLAG_FS_V2 is undefined
    const { result } = renderHook(() => useFlightSearchV2Flag());
    expect(result.current).toBe(false);
  });

  it('should return false when VITE_FLAG_FS_V2 is an empty string', () => {
    vi.stubGlobal('importMeta', { env: { VITE_FLAG_FS_V2: '' } });
    const { result } = renderHook(() => useFlightSearchV2Flag());
    expect(result.current).toBe(false);
  });

  it('should return false when VITE_FLAG_FS_V2 is any string other than "true"', () => {
    vi.stubGlobal('importMeta', { env: { VITE_FLAG_FS_V2: 'enabled' } });
    const { result } = renderHook(() => useFlightSearchV2Flag());
    expect(result.current).toBe(false);
  });
});
