// src/services/ledgerService.ts
import { DynamoDBClient, PutItemCommand, UpdateItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';

export class LedgerService {
  private ddb: DynamoDBClient;
  private paymentsTable: string;
  private sagaTable: string;

  constructor(region?: string, paymentsTable?: string, sagaTable?: string) {
    this.ddb = new DynamoDBClient({ region });
    // Prefer env-configured table names, fallback to provided args, then sane defaults
    this.paymentsTable = process.env.PAYMENTS_IDEMPOTENCY_TABLE || paymentsTable || 'payments-idempotency';
    this.sagaTable = process.env.SAGA_TRANSACTIONS_TABLE || sagaTable || 'saga-transactions';
  }

  // Charge idempotency
  async recordPaymentAttempt(idempotencyKey: string, correlationId: string, amount: number, ttlSeconds = 24 * 60 * 60) {
    const ttl = Math.floor(Date.now() / 1000) + ttlSeconds;
    await this.ddb.send(new PutItemCommand({
      TableName: this.paymentsTable,
      Item: {
        idempotencyKey: { S: idempotencyKey },
        correlationId: { S: correlationId },
        amount: { N: amount.toString() },
        status: { S: 'pending' },
        createdAt: { S: new Date().toISOString() },
        ttl: { N: ttl.toString() }
      },
      ConditionExpression: 'attribute_not_exists(idempotencyKey)'
    }));
  }

  async markPaymentCompleted(idempotencyKey: string, paymentIntentId: string) {
    await this.ddb.send(new UpdateItemCommand({
      TableName: this.paymentsTable,
      Key: { idempotencyKey: { S: idempotencyKey } },
      UpdateExpression: 'SET #s = :s, paymentIntentId = :pid, completedAt = :ts',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: {
        ':s': { S: 'completed' },
        ':pid': { S: paymentIntentId },
        ':ts': { S: new Date().toISOString() }
      }
    }));
  }

  // Refund idempotency (use distinct idempotency key)
  async recordRefundAttempt(idempotencyKey: string, correlationId: string, amount: number, ttlSeconds = 24 * 60 * 60) {
    const ttl = Math.floor(Date.now() / 1000) + ttlSeconds;
    await this.ddb.send(new PutItemCommand({
      TableName: this.paymentsTable,
      Item: {
        idempotencyKey: { S: idempotencyKey },
        correlationId: { S: correlationId },
        amount: { N: amount.toString() },
        status: { S: 'refund_pending' },
        createdAt: { S: new Date().toISOString() },
        ttl: { N: ttl.toString() }
      },
      ConditionExpression: 'attribute_not_exists(idempotencyKey)'
    }));
  }

  async markRefundCompleted(idempotencyKey: string, refundId: string) {
    await this.ddb.send(new UpdateItemCommand({
      TableName: this.paymentsTable,
      Key: { idempotencyKey: { S: idempotencyKey } },
      UpdateExpression: 'SET #s = :s, refundId = :rid, completedAt = :ts',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: {
        ':s': { S: 'refund_completed' },
        ':rid': { S: refundId },
        ':ts': { S: new Date().toISOString() }
      }
    }));
  }

  // Saga tracking
  async recordSagaStep(transactionId: string, stepId: string, correlationId: string, action: string, status: 'completed' | 'failed', ttlDays = 7) {
    const ttl = Math.floor(Date.now() / 1000) + ttlDays * 24 * 60 * 60;
    await this.ddb.send(new PutItemCommand({
      TableName: this.sagaTable,
      Item: {
        transactionId: { S: transactionId },
        stepId: { S: stepId },
        correlationId: { S: correlationId },
        action: { S: action },
        status: { S: status },
        timestamp: { S: new Date().toISOString() },
        ttl: { N: ttl.toString() }
      }
    }));
  }

  async recordSagaStepOnce(transactionId: string, stepId: string, correlationId: string, action: string, status: 'completed' | 'failed', ttlDays = 7) {
    const ttl = Math.floor(Date.now() / 1000) + ttlDays * 24 * 60 * 60;
    await this.ddb.send(new PutItemCommand({
      TableName: this.sagaTable,
      Item: {
        transactionId: { S: transactionId },
        stepId: { S: stepId },
        correlationId: { S: correlationId },
        action: { S: action },
        status: { S: status },
        timestamp: { S: new Date().toISOString() },
        ttl: { N: ttl.toString() }
      },
      ConditionExpression: 'attribute_not_exists(transactionId) AND attribute_not_exists(stepId)'
    }));
  }

  async getSagaStepsByCorrelation(correlationId: string) {
    const res = await this.ddb.send(new QueryCommand({
      TableName: this.sagaTable,
      IndexName: 'CorrelationIdIndex',
      KeyConditionExpression: 'correlationId = :c',
      ExpressionAttributeValues: { ':c': { S: correlationId } }
    }));
    return res.Items || [];
  }
}

