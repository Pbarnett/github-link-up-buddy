import * as React from 'react';
// src/tests/mocks/deno-server.ts
// Mock for Deno's HTTP server module

export function serve(handler: (req: Request) => Promise<Response> | Response) {
  // In tests, we don't actually start a server, just return the handler
  // The test will call the handler directly
  return handler;
}

export default { serve };
