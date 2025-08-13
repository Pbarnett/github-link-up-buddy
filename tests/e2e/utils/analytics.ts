import { Page } from '@playwright/test';

export type AnalyticsEvent = { name: string; properties: Record<string, any> };

export async function injectAnalyticsCapture(page: Page) {
  await page.addInitScript(() => {
    (window as any).__events = [];
    (window as any).analytics = {
      track: (name: string, properties: Record<string, any>) => {
        try {
          (window as any).__events.push({ name, properties });
          // Also log for debug visibility
          console.log('[analytics]', name, properties);
        } catch (e) {
          console.warn('Failed to capture analytics event', e);
        }
      },
    };
  });
}

export async function getCapturedEvents(page: Page): Promise<AnalyticsEvent[]> {
  return await page.evaluate(() => (window as any).__events || []);
}

export async function waitForEvent(page: Page, eventName: string, timeoutMs = 3000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const events = await getCapturedEvents(page);
    if (events.some(e => e.name === eventName)) return true;
    await page.waitForTimeout(100);
  }
  throw new Error(`Timed out waiting for analytics event: ${eventName}`);
}

