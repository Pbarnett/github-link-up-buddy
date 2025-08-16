import * as path from 'node:path';
import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigwv2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AutoBookingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stage = this.node.tryGetContext('stage') ?? 'dev';
    const isProd = stage === 'prod';
    const stackName = cdk.Stack.of(this).stackName;

    // Ensure NodejsFunction bundling can locate a lock file during synth
    const depsLockFilePath = path.join(__dirname, '../../package-lock.json');

    // Log group for the state machine
    const logGroup = new logs.LogGroup(this, 'AutoBookingStateMachineLogs', {
      logGroupName: `/aws/stepfunctions/auto-booking-${stackName}`,
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    // Lambda for input validation (Node.js 20, from monorepo source)
const validateInputFn = new NodejsFunction(this, 'ValidateBookingInputFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
entry: path.join(__dirname, '../../../../src/functions/validate-booking-input.ts'),
      handler: 'handler',
      functionName: `validate-booking-input`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      tracing: lambda.Tracing.ACTIVE,
      bundling: {
        minify: true,
        sourceMap: false,
        format: OutputFormat.ESM,
        target: 'es2022',
        externalModules: [],
      },
      environment: {},
      depsLockFilePath,
    });

    // Execution role for the state machine (least privilege)
    const sfnRole = new iam.Role(this, 'AutoBookingStateMachineRole', {
      assumedBy: new iam.ServicePrincipal('states.amazonaws.com'),
      description: 'Role for Auto Booking State Machine to invoke lambdas and write logs',
    });

    validateInputFn.grantInvoke(sfnRole);

    // Process booking Lambda (placeholder)
const processBookingFn = new NodejsFunction(this, 'ProcessAutoBookingFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
entry: path.join(__dirname, '../../../../src/functions/process-auto-booking.ts'),
      handler: 'handler',
      functionName: `process-auto-booking`,
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      tracing: lambda.Tracing.ACTIVE,
      bundling: {
        minify: true,
        sourceMap: false,
        // Use CommonJS to avoid ESM dynamic require issues from dependencies that reference 'buffer'
        format: OutputFormat.CJS,
        target: 'es2022',
        externalModules: [],
        nodeModules: ['@aws-sdk/client-dynamodb']
      },
      environment: {},
      depsLockFilePath,
    });
    processBookingFn.grantInvoke(sfnRole);

    // Refund payment stub Lambda
const refundPaymentFn = new NodejsFunction(this, 'RefundPaymentStubFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
entry: path.join(__dirname, '../../../../src/functions/refund-payment-stub.ts'),
      handler: 'handler',
      functionName: 'refund-payment-stub',
      timeout: cdk.Duration.seconds(15),
      memorySize: 256,
      tracing: lambda.Tracing.ACTIVE,
      bundling: { minify: true, sourceMap: false, format: OutputFormat.ESM, target: 'es2022', externalModules: [], nodeModules: ['@aws-sdk/client-dynamodb'] },
      environment: {
        PAYMENTS_IDEMPOTENCY_TABLE: '',
        SAGA_TRANSACTIONS_TABLE: ''
      },
      depsLockFilePath,
    });
    refundPaymentFn.grantInvoke(sfnRole);

    // Cancel booking stub Lambda
const cancelBookingFn = new NodejsFunction(this, 'CancelBookingStubFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
entry: path.join(__dirname, '../../../../src/functions/cancel-booking-stub.ts'),
      handler: 'handler',
      functionName: 'cancel-booking-stub',
      timeout: cdk.Duration.seconds(15),
      memorySize: 256,
      tracing: lambda.Tracing.ACTIVE,
      bundling: { minify: true, sourceMap: false, format: OutputFormat.ESM, target: 'es2022', externalModules: [], nodeModules: ['@aws-sdk/client-dynamodb'] },
      environment: {
        PAYMENTS_IDEMPOTENCY_TABLE: '',
        SAGA_TRANSACTIONS_TABLE: ''
      },
      depsLockFilePath,
    });
    cancelBookingFn.grantInvoke(sfnRole);

    // Payment stub Lambda (idempotent)
const paymentStubFn = new NodejsFunction(this, 'PaymentStubFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
entry: path.join(__dirname, '../../../../src/functions/payment-stub.ts'),
      handler: 'handler',
      functionName: 'payment-stub',
      timeout: cdk.Duration.seconds(15),
      memorySize: 256,
      tracing: lambda.Tracing.ACTIVE,
      bundling: { minify: true, sourceMap: false, format: OutputFormat.ESM, target: 'es2022', externalModules: [], nodeModules: ['@aws-sdk/client-ssm', '@aws-sdk/client-dynamodb', 'stripe'] },
      environment: {
        PAYMENTS_IDEMPOTENCY_TABLE: '', // set after table defined
        SAGA_TRANSACTIONS_TABLE: ''
      },
      depsLockFilePath,
    });
    paymentStubFn.grantInvoke(sfnRole);

    // Stripe payment Lambda (feature-flagged) - legacy plaintext param remains for now
    // Removed plaintext parameter creation. Use pre-provisioned SecureString only.

    // Prepare new SecureString parameter (added now, wired later)
    const secureStripeParamName = '/auto-booking/secure/stripe-secret';
    const secureStripeParamRef = ssm.StringParameter.fromStringParameterName(this, 'SecureStripeSecretParamRef', secureStripeParamName);

const paymentStripeFn = new NodejsFunction(this, 'PaymentStripeFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
entry: path.join(__dirname, '../../../../src/functions/payment-stripe.ts'),
      handler: 'handler',
      functionName: 'payment-stripe',
      timeout: cdk.Duration.seconds(20),
      memorySize: 256,
      tracing: lambda.Tracing.ACTIVE,
      bundling: { minify: true, sourceMap: false, format: OutputFormat.ESM, target: 'es2022', externalModules: [], nodeModules: ['@aws-sdk/client-ssm', '@aws-sdk/client-dynamodb', 'stripe'] },
      environment: {
        ENABLE_STRIPE: 'false',
        STRIPE_SECRET_PARAM: secureStripeParamRef.parameterName,
        PAYMENTS_IDEMPOTENCY_TABLE: '', // set after table defined
        SAGA_TRANSACTIONS_TABLE: ''
      },
      depsLockFilePath,
    });

    paymentStripeFn.grantInvoke(sfnRole);
    // Grant read on new SecureString only (legacy grant removed post-cutover)
    secureStripeParamRef.grantRead(paymentStripeFn);

    // Callback Lambdas and storage table
    const callbackTable = new dynamodb.Table(this, 'PendingCallbacksTable', {
      tableName: `${stackName}-pending-callbacks`,
      partitionKey: { name: 'correlationId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    // Generate or retrieve a webhook secret (simple generation at deploy time)
    // Webhook secret must be pre-provisioned in SSM as SecureString; reference only.

    // Prepare new SecureString parameter (added now, wired later)
    const secureWebhookParamName = '/auto-booking/secure/webhook-secret';
    const secureWebhookParamRef = ssm.StringParameter.fromStringParameterName(this, 'SecureWebhookSecretParamRef', secureWebhookParamName);


const callbackInitiateFn = new NodejsFunction(this, 'ProviderCallbackInitiateFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
entry: path.join(__dirname, '../../../../src/functions/provider-callback-initiate.ts'),
      handler: 'handler',
      functionName: 'provider-callback-initiate',
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      tracing: lambda.Tracing.ACTIVE,
      bundling: { minify: true, sourceMap: false, format: OutputFormat.ESM, target: 'es2022', externalModules: [], nodeModules: ['@aws-sdk/client-dynamodb'] },
      environment: { CALLBACK_TABLE: callbackTable.tableName },
      depsLockFilePath,
    });

    const webhookCompleteFn = new NodejsFunction(this, 'ProviderWebhookCompleteFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
entry: path.join(__dirname, '../../../../src/functions/provider-webhook-complete.ts'),
      handler: 'handler',
      functionName: 'provider-webhook-complete',
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      tracing: lambda.Tracing.ACTIVE,
      bundling: { minify: true, sourceMap: false, format: OutputFormat.ESM, target: 'es2022', externalModules: [], nodeModules: ['@aws-sdk/client-sfn', '@aws-sdk/client-dynamodb', '@aws-sdk/client-ssm'] },
      environment: { CALLBACK_TABLE: callbackTable.tableName, WEBHOOK_SECRET_PARAM: secureWebhookParamRef.parameterName },
      depsLockFilePath,
    });
    

    callbackTable.grantReadWriteData(callbackInitiateFn);
    callbackTable.grantReadWriteData(webhookCompleteFn);

    // Allow webhook to read the new SecureString secret only (legacy grant removed)
    secureWebhookParamRef.grantRead(webhookCompleteFn);

    // Allow webhook to complete callbacks via Step Functions
    webhookCompleteFn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['states:SendTaskSuccess', 'states:SendTaskFailure'],
      // SendTask* APIs do not support resource-level permissions; must be '*'
      resources: ['*'],
    }));

    callbackInitiateFn.grantInvoke(sfnRole);

    // Load ASL definition from repo
    const aslPath = path.join(__dirname, '../../../step-functions/auto-booking.asl.json');
    if (!fs.existsSync(aslPath)) {
      throw new Error(`ASL definition not found at ${aslPath}`);
    }
    const definitionBody = sfn.DefinitionBody.fromFile(aslPath);

    const stateMachine = new sfn.StateMachine(this, 'AutoBookingStateMachine', {
      stateMachineName: `${stackName}-auto-booking`,
      definitionBody,
      tracingEnabled: true,
      logs: {
        destination: logGroup,
        level: sfn.LogLevel.ALL,
        includeExecutionData: true,
      },
      role: sfnRole,
    });

    // Allow state machine to invoke the validation and process Lambdas
    sfnRole.addToPolicy(new iam.PolicyStatement({
      actions: ['lambda:InvokeFunction'],
      resources: [validateInputFn.functionArn],
    }));
    sfnRole.addToPolicy(new iam.PolicyStatement({
      actions: ['lambda:InvokeFunction'],
      resources: [processBookingFn.functionArn],
    }));

    // Allow writing logs
    logGroup.grantWrite(sfnRole);

    // DynamoDB tables for idempotency and saga tracking
    const paymentsIdempotencyTable = new dynamodb.Table(this, 'PaymentsIdempotencyTable', {
      tableName: `${stackName}-payments-idempotency`,
      partitionKey: { name: 'idempotencyKey', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'ttl',
      removalPolicy: isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true,
    });
    
    // Wire environment variables now that tables are defined
    paymentStubFn.addEnvironment('PAYMENTS_IDEMPOTENCY_TABLE', paymentsIdempotencyTable.tableName);
    paymentStripeFn.addEnvironment('PAYMENTS_IDEMPOTENCY_TABLE', paymentsIdempotencyTable.tableName);
    refundPaymentFn.addEnvironment('PAYMENTS_IDEMPOTENCY_TABLE', paymentsIdempotencyTable.tableName);
    cancelBookingFn.addEnvironment('PAYMENTS_IDEMPOTENCY_TABLE', paymentsIdempotencyTable.tableName);

    const sagaTransactionsTable = new dynamodb.Table(this, 'SagaTransactionsTable', {
      tableName: `${stackName}-saga-transactions`,
      partitionKey: { name: 'transactionId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'stepId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'ttl',
      removalPolicy: isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true,
    });

    paymentStubFn.addEnvironment('SAGA_TRANSACTIONS_TABLE', sagaTransactionsTable.tableName);
    paymentStripeFn.addEnvironment('SAGA_TRANSACTIONS_TABLE', sagaTransactionsTable.tableName);
    refundPaymentFn.addEnvironment('SAGA_TRANSACTIONS_TABLE', sagaTransactionsTable.tableName);
    cancelBookingFn.addEnvironment('SAGA_TRANSACTIONS_TABLE', sagaTransactionsTable.tableName);

    sagaTransactionsTable.addGlobalSecondaryIndex({
      indexName: 'CorrelationIdIndex',
      partitionKey: { name: 'correlationId', type: dynamodb.AttributeType.STRING },
    });

    // Allow webhook to write saga/ledger entries
    sagaTransactionsTable.grantWriteData(webhookCompleteFn);

    // Allow callback initiator to write saga/ledger entries if it records steps
    sagaTransactionsTable.grantWriteData(callbackInitiateFn);

    // Grant payment lambdas access to ledger tables
    paymentsIdempotencyTable.grantReadWriteData(paymentStubFn);
    sagaTransactionsTable.grantReadWriteData(paymentStubFn);
    paymentsIdempotencyTable.grantReadWriteData(paymentStripeFn);
    sagaTransactionsTable.grantReadWriteData(paymentStripeFn);
    paymentsIdempotencyTable.grantReadWriteData(refundPaymentFn);
    sagaTransactionsTable.grantReadWriteData(refundPaymentFn);
    paymentsIdempotencyTable.grantReadWriteData(cancelBookingFn);
    sagaTransactionsTable.grantReadWriteData(cancelBookingFn);

    // CloudWatch Dashboard and Alarms for Step Functions
    const dashboard = new cloudwatch.Dashboard(this, 'AutoBookingDashboard', {
      dashboardName: 'auto-booking-dashboard',
    });

    const executionsSucceeded = new cloudwatch.Metric({
      namespace: 'AWS/States',
      metricName: 'ExecutionsSucceeded',
      statistic: 'Sum',
      period: cdk.Duration.minutes(5),
      dimensionsMap: { StateMachineArn: stateMachine.stateMachineArn },
    });

    const executionsFailed = new cloudwatch.Metric({
      namespace: 'AWS/States',
      metricName: 'ExecutionsFailed',
      statistic: 'Sum',
      period: cdk.Duration.minutes(5),
      dimensionsMap: { StateMachineArn: stateMachine.stateMachineArn },
    });

    const executionTime = new cloudwatch.Metric({
      namespace: 'AWS/States',
      metricName: 'ExecutionTime',
      statistic: 'Average',
      period: cdk.Duration.minutes(5),
      dimensionsMap: { StateMachineArn: stateMachine.stateMachineArn },
    });

    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'Executions Succeeded/Failed',
        left: [executionsSucceeded],
        right: [executionsFailed],
        width: 12,
        height: 6,
      }),
      new cloudwatch.GraphWidget({
        title: 'Execution Time (ms)',
        left: [executionTime],
        width: 12,
        height: 6,
      })
    );

    // Alarm on failures > 0 in two consecutive 5-min periods
    const failuresAlarm = new cloudwatch.Alarm(this, 'AutoBookingFailuresAlarm', {
      alarmName: 'auto-booking-failures',
      alarmDescription: 'Step Functions executions failing',
      metric: executionsFailed,
      threshold: 1,
      evaluationPeriods: 2,
      datapointsToAlarm: 2,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    });

    new cdk.CfnOutput(this, 'StateMachineArn', { value: stateMachine.stateMachineArn });
    new cdk.CfnOutput(this, 'ValidateInputLambdaArn', { value: validateInputFn.functionArn });
    new cdk.CfnOutput(this, 'ProcessBookingLambdaArn', { value: processBookingFn.functionArn });
    new cdk.CfnOutput(this, 'PaymentStubLambdaArn', { value: paymentStubFn.functionArn });
    new cdk.CfnOutput(this, 'RefundPaymentLambdaArn', { value: refundPaymentFn.functionArn });
    new cdk.CfnOutput(this, 'CancelBookingLambdaArn', { value: cancelBookingFn.functionArn });
    new cdk.CfnOutput(this, 'PaymentsIdempotencyTableName', { value: paymentsIdempotencyTable.tableName });
    new cdk.CfnOutput(this, 'SagaTransactionsTableName', { value: sagaTransactionsTable.tableName });
    new cdk.CfnOutput(this, 'CallbackTableName', { value: callbackTable.tableName });
    new cdk.CfnOutput(this, 'ProviderCallbackInitiateArn', { value: callbackInitiateFn.functionArn });
    new cdk.CfnOutput(this, 'ProviderWebhookCompleteArn', { value: webhookCompleteFn.functionArn });
    new cdk.CfnOutput(this, 'DashboardName', { value: dashboard.dashboardName });
    new cdk.CfnOutput(this, 'FailuresAlarmName', { value: failuresAlarm.alarmName });

    // EventBridge rule to route failed Step Functions executions to SNS
    const failuresTopic = new sns.Topic(this, 'AutoBookingFailuresTopic', {
      topicName: 'auto-booking-failures-topic',
      displayName: 'Auto Booking Failures',
    });

    const rule = new events.Rule(this, 'SfnFailuresRule', {
      description: 'Route Step Functions failed/timed-out/aborted executions to SNS',
      eventPattern: {
        source: ['aws.states'],
        detailType: ['Step Functions Execution Status Change'],
        detail: {
          status: ['FAILED', 'TIMED_OUT', 'ABORTED'],
          stateMachineArn: [stateMachine.stateMachineArn],
        },
      },
    });
    rule.addTarget(new targets.SnsTopic(failuresTopic));

    // Subscribe email for failure notifications (requires email confirmation)
    failuresTopic.addSubscription(new subs.EmailSubscription('prkr.sb@gmail.com'));

    new cdk.CfnOutput(this, 'FailuresSnsTopicArn', { value: failuresTopic.topicArn });

    // API Gateway HTTP API fronting the provider webhook lambda
    const httpApi = new apigwv2.HttpApi(this, 'AutoBookingHttpApi', {
      apiName: 'auto-booking-api'
    });

    const webhookIntegration = new apigwv2Integrations.HttpLambdaIntegration(
      'WebhookIntegration',
      webhookCompleteFn
    );

    httpApi.addRoutes({
      path: '/provider/webhook',
      methods: [apigwv2.HttpMethod.POST],
      integration: webhookIntegration,
    });

    new cdk.CfnOutput(this, 'WebhookUrl', { value: `${httpApi.apiEndpoint}/provider/webhook` });
    new cdk.CfnOutput(this, 'WebhookSecretParameter', { value: secureWebhookParamName });
  }
}

