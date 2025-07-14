import { vi } from 'vitest';

export interface EdgeFunctionResponse {
  success?: boolean;
  message?: string;
  inserted?: number;
  data?: unknown;
  error?: unknown;
}

export const createEdgeFetchMock = (responseData: EdgeFunctionResponse = { success: true }) => {
  return vi.fn().mockResolvedValue(
    new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  );
};

export const createEdgeFetchErrorMock = (errorMessage: string) => {
  return vi.fn().mockRejectedValue(
    new Error(errorMessage)
  );
};

export const createEdgeFetchWithDelay = (
  responseData: EdgeFunctionResponse = { success: true },
  delayMs: number = 100
) => {
  return vi.fn().mockImplementation(
    () =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve(
              new Response(JSON.stringify(responseData), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              })
            ),
          delayMs
        )
      )
  );
};
