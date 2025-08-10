export interface RetryOptions {
  retries?: number;
  delayMs?: number;
  jitter?: boolean;
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function retryPromise<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const retries = opts.retries ?? 2;
  const baseDelay = opts.delayMs ?? 300;
  const jitter = opts.jitter ?? true;

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === retries) break;
      const delay = jitter ? baseDelay + Math.floor(Math.random() * baseDelay) : baseDelay;
      await sleep(delay);
    }
  }
  throw lastError;
}
