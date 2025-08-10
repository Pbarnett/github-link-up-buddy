// src/functions/provider-webhook-complete.ts
// Webhook that completes the Step Functions callback by sending task success
import { DynamoDBClient, GetItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { SFNClient, SendTaskSuccessCommand, SendTaskFailureCommand } from '@aws-sdk/client-sfn';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { createHmac } from 'crypto';
import { LedgerService } from '@/services/ledgerService';
import { logger } from './_lib/logger';

interface WebhookEvent {
  // For direct Lambda invoke
  correlationId?: string;
  status?: 'confirmed' | 'rejected';
  // For API Gateway HTTP API
  headers?: Record<string, string | undefined>;
  body?: string | null;
}

const ddb = new DynamoDBClient({});
const sfn = new SFNClient({});
const ssm = new SSMClient({});
const TABLE = process.env.CALLBACK_TABLE || 'pending-callbacks';
const SECRET_PARAM = process.env.WEBHOOK_SECRET_PARAM || '';

export async function handler(event: WebhookEvent) {
  // Detect HTTP API event (has headers/body) vs direct invoke
  let isHttp = !!event && (typeof event.headers === 'object' || typeof event.body === 'string');

  // Headers (case-insensitive)
  let sigHeader = '';
  let tsHeader = '';
  if (isHttp && event.headers) {
    const h = event.headers;
    sigHeader = (h['X-Signature'] || h['x-signature'] || '') as string;
    tsHeader = (h['X-Timestamp'] || h['x-timestamp'] || '') as string;

    // Content-Type enforcement: must be application/json
    const ct = (h['Content-Type'] || h['content-type'] || '') as string;
    const isJson = /^application\/json(\s*;.*)?$/i.test(ct);
    if (!isJson) {
      logger.warn('unsupported_media_type', { step: 'webhook', state: 'validate', errorType: 'UnsupportedMediaType' });
      return { statusCode: 415, body: JSON.stringify({ ok: false, error: 'UnsupportedMediaType' }) };
    }
  }

  // Parse body (raw string for HMAC)
  const rawBody = isHttp ? (event.body || '') : '';

  // Payload size limit (bytes)
  const MAX_BODY_BYTES = 128 * 1024; // 128 KiB
  if (isHttp) {
    const size = Buffer.byteLength(rawBody, 'utf8');
    if (size > MAX_BODY_BYTES) {
      logger.warn('payload_too_large', { step: 'webhook', state: 'validate', errorType: 'PayloadTooLarge', size });
      return { statusCode: 413, body: JSON.stringify({ ok: false, error: 'PayloadTooLarge' }) };
    }
  }

  let correlationId = event.correlationId;
  let status = event.status as 'confirmed' | 'rejected' | undefined;
  if (isHttp && rawBody) {
    try {
      const parsed = JSON.parse(rawBody);
      correlationId = correlationId || parsed.correlationId;
      status = (status || parsed.status) as any;
    } catch (e) {
      // ignore; will fail validation below
    }
  }

  logger.info('webhook_received', { correlationId, step: 'webhook', state: 'received' });

  // HMAC verification for HTTP requests
  if (isHttp) {
    // Basic header presence
    if (!sigHeader || !tsHeader) {
      logger.warn('missing_signature', { step: 'webhook', state: 'auth', errorType: 'MissingSignature' });
      return { statusCode: 401, body: JSON.stringify({ ok: false, error: 'MissingSignature' }) };
    }
    // Timestamp freshness
    const now = Math.floor(Date.now() / 1000);
    const ts = Number(tsHeader);
    if (!Number.isFinite(ts) || Math.abs(now - ts) > 300) {
      logger.warn('stale_timestamp', { step: 'webhook', state: 'auth', errorType: 'StaleTimestamp' });
      return { statusCode: 401, body: JSON.stringify({ ok: false, error: 'StaleTimestamp' }) };
    }
    // Fetch secret from SSM
    if (!SECRET_PARAM) {
      logger.error('server_misconfigured', { step: 'webhook', state: 'auth', errorType: 'ConfigError' });
      return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'ServerMisconfigured' }) };
    }
    let secret = '';
    try {
      const r = await ssm.send(new GetParameterCommand({ Name: SECRET_PARAM, WithDecryption: true }));
      secret = r.Parameter?.Value || '';
    } catch (e) {
      logger.error('ssm_read_failed', { step: 'webhook', state: 'auth', errorType: 'SecretUnavailable' });
      return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'SecretUnavailable' }) };
    }
    if (!secret) {
      logger.error('secret_unavailable', { step: 'webhook', state: 'auth', errorType: 'SecretUnavailable' });
      return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'SecretUnavailable' }) };
    }
    // Compute expected signature: HMAC-SHA256(secret, rawBody + '.' + timestamp)
    const canonical = `${rawBody}.${ts}`;
    const expected = createHmac('sha256', secret).update(canonical).digest('hex');
    if (expected !== sigHeader) {
      // Structured unauthorized
      logger.warn('invalid_signature', { correlationId, step: 'webhook', state: 'auth', errorType: 'InvalidSignature' });
      return { statusCode: 401, body: JSON.stringify({ ok: false, error: 'InvalidSignature', correlationId: correlationId || null }) };
    }
  }

  if (!correlationId || (status !== 'confirmed' && status !== 'rejected')) {
    const resp = isHttp
      ? { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Invalid payload' }) }
      : { ok: false };
    return resp as any;
  }

  // Record webhook received
  try {
    const ledger = new LedgerService();
    await ledger.recordSagaStep(correlationId, 'webhook_received', correlationId, 'provider_webhook', 'completed');
  } catch (e) {
    logger.warn('saga_record_failed', { correlationId, step: 'webhook', state: 'record', errorType: 'SagaWriteFailed' });
  }

  const res = await ddb.send(new GetItemCommand({
    TableName: TABLE,
    Key: { correlationId: { S: correlationId } }
  }));

  const token = res.Item?.taskToken?.S;
  if (!token) {
    logger.warn('no_task_token', { correlationId, step: 'webhook', state: 'lookup', errorType: 'MissingTaskToken' });
    const resp = isHttp ? { statusCode: 404, body: JSON.stringify({ ok: false }) } : { ok: false };
    return resp as any;
  }

  try {
    if (status === 'confirmed') {
      await sfn.send(new SendTaskSuccessCommand({
        taskToken: token,
        output: JSON.stringify({ status: 'confirmed', correlationId })
      }));
      try {
        const ledger = new LedgerService();
        await ledger.recordSagaStep(correlationId, 'callback_confirmed', correlationId, 'send_task_success', 'completed');
        logger.info('callback_confirmed', { correlationId, step: 'webhook', state: 'success' });
      } catch (e) {
        logger.warn('saga_record_failed', { correlationId, step: 'webhook', state: 'record', errorType: 'SagaWriteFailed' });
      }
    } else {
      await sfn.send(new SendTaskFailureCommand({
        taskToken: token,
        error: 'BookingRejected',
        cause: 'Provider rejected booking'
      }));
      try {
        const ledger = new LedgerService();
        await ledger.recordSagaStep(correlationId, 'callback_rejected', correlationId, 'send_task_failure', 'failed');
        logger.info('callback_rejected', { correlationId, step: 'webhook', state: 'failure' });
      } catch (e) {
        logger.warn('saga_record_failed', { correlationId, step: 'webhook', state: 'record', errorType: 'SagaWriteFailed' });
      }
    }
  } finally {
    await ddb.send(new DeleteItemCommand({
      TableName: TABLE,
      Key: { correlationId: { S: correlationId } }
    }));
  }

  const okResp = isHttp ? { statusCode: 200, body: JSON.stringify({ ok: true }) } : { ok: true };
  return okResp as any;
}

