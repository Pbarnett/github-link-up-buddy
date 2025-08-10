// src/functions/provider-callback-initiate.ts
// Stores the Step Functions task token for later webhook completion
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { LedgerService } from '@/services/ledgerService';
import { logger } from './_lib/logger';

interface Event {
  correlationId: string;
  payload?: any;
  TaskToken: string;
}

const ddb = new DynamoDBClient({});
const TABLE = process.env.CALLBACK_TABLE || 'pending-callbacks';

export async function handler(event: Event) {
  const { correlationId, TaskToken } = event;
  logger.info('callback_initiate_store_token', { correlationId, step: 'callback_initiate', state: 'storing_token' });

  // Simulated transient failure knob (for testing):
  // - Set env CALLBACK_SIMULATE=transient or include event.payload?.simulate==='transient'
  const simulate = (event.payload && (event.payload as any).simulate) || process.env.CALLBACK_SIMULATE;

  try {
    await ddb.send(new PutItemCommand({
      TableName: TABLE,
      Item: {
        correlationId: { S: correlationId },
        taskToken: { S: TaskToken },
        createdAt: { S: new Date().toISOString() }
      }
    }));
  } catch (err) {
    // Map infra/temporary failures to a typed transient error for SFN retry
    logger.error('callback_token_store_failed', { correlationId, step: 'callback_initiate', state: 'error', errorType: 'DynamoDBWriteFailed' });
    throw new Error('TransientProviderError');
  }

  // Record saga step for observability
  try {
    const ledger = new LedgerService();
    await ledger.recordSagaStep(correlationId, 'callback_token_stored', correlationId, 'store_task_token', 'completed');
  } catch (e) {
    logger.warn('saga_record_failed', { correlationId, step: 'callback_initiate', state: 'record', errorType: 'SagaWriteFailed' });
  }

  if (simulate === 'transient') {
    logger.warn('simulate_transient_error', { correlationId, step: 'callback_initiate', state: 'simulated', errorType: 'TransientProviderError' });
    throw new Error('TransientProviderError');
  }

  // In a real system, you would call the provider and include correlationId for the webhook
  return { ok: true };
}

