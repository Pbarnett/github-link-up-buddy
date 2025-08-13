import { Page, Route, Request } from '@playwright/test';

export type MockResponseConfig<TBody = any> = {
  status?: number;
  body?: TBody;
  delayMs?: number;
};

export type RequestRecord = {
  url: string;
  method: string;
  headers: Record<string, string>;
  postData?: any;
};

export type MockOptions = {
  createPaymentSession?: { client_secret?: string; id?: string; amount?: number; currency?: string; status?: string } & MockResponseConfig;
  duffelCreateCard?: { card_id?: string } & MockResponseConfig;
  duffel3DSSession?: { session_id?: string; status?: string } & MockResponseConfig;
  // When true, captures requests in-memory and returns them via the function return value
  captureRequests?: boolean;
};

export type MockHandle = {
  requests: RequestRecord[];
};

function toLowercaseHeaders(h: Record<string, string | string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(h)) {
    if (typeof v === 'string') out[k.toLowerCase()] = v;
    else if (Array.isArray(v)) out[k.toLowerCase()] = v.join(', ');
  }
  return out;
}

async function captureRequest(req: Request): Promise<RequestRecord> {
  let postData: any = undefined;
  try {
    const text = req.postData();
    if (text) {
      try { postData = JSON.parse(text); } catch { postData = text; }
    }
  } catch {}
  return {
    url: req.url(),
    method: req.method(),
    headers: toLowercaseHeaders(req.headers()),
    postData,
  };
}

export async function mockSupabaseFunctions(page: Page, options?: MockOptions): Promise<MockHandle | undefined> {
  const captured: RequestRecord[] = [];

  await page.route('**/functions/v1/*', async (route: Route) => {
    const req = route.request();
    const url = req.url();

    const fulfill = async (config: MockResponseConfig, defaultBody: any) => {
      const status = typeof config.status === 'number' ? config.status : 200;
      const body = config.body ?? defaultBody;
      const delayMs = config.delayMs ?? 0;
      if (options?.captureRequests) {
        captured.push(await captureRequest(req));
      }
      if (delayMs) await new Promise(r => setTimeout(r, delayMs));
      return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    };

    if (url.includes('/functions/v1/create-payment-session')) {
      const body = {
        client_secret: options?.createPaymentSession?.client_secret || 'cs_test_123',
        id: options?.createPaymentSession?.id || 'pi_test_123',
        amount: options?.createPaymentSession?.amount || 10000,
        currency: options?.createPaymentSession?.currency || 'usd',
        status: options?.createPaymentSession?.status || 'requires_payment_method',
      };
      return fulfill(options?.createPaymentSession || {}, body);
    }

    if (url.includes('/functions/v1/duffel-create-card')) {
      const body = { card_id: options?.duffelCreateCard?.card_id || 'tcd_mock_e2e' };
      return fulfill(options?.duffelCreateCard || {}, body);
    }

    if (url.includes('/functions/v1/duffel-3ds-session')) {
      const body = { session_id: options?.duffel3DSSession?.session_id || '3ds_mock_e2e', status: options?.duffel3DSSession?.status || 'ready_for_payment' };
      return fulfill(options?.duffel3DSSession || {}, body);
    }

    // passthrough
    if (options?.captureRequests) {
      captured.push(await captureRequest(req));
    }
    return route.continue();
  });

  if (options?.captureRequests) {
    return { requests: captured };
  }
  return undefined;
}

