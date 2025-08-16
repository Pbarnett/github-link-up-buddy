import { setupServer } from 'msw/node';
import { http } from 'msw';

export const server = setupServer();

export function useMsw() {
  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());
  return server;
}
