import { vi } from 'vitest';

interface MockFetchOptions {
  status?: number;
  ok?: boolean;
  body?: any;
  headers?: Record<string, string>;
}

export function mockFetch({ status = 200, ok = true, body, headers = {} }: MockFetchOptions) {
  const mockResponse = {
    ok,
    status,
    headers: new Headers(headers),
    json: vi.fn().mockResolvedValue(body),
    text: vi.fn().mockResolvedValue(typeof body === 'string' ? body : JSON.stringify(body)),
    blob: vi.fn().mockResolvedValue(new Blob()),
    arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
  };

  return vi.fn().mockResolvedValue(mockResponse);
}

export function mockFetchSuccess(body: any) {
  return mockFetch({ status: 200, ok: true, body });
}

export function mockFetchError(status: number = 500, body: any = { error: 'Server error' }) {
  return mockFetch({ status, ok: false, body });
}
