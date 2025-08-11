# Auto Booking CDK Stack

This CDK app deploys the auto-booking workflow infrastructure:
- Step Functions state machine from infra/step-functions/auto-booking.asl.json
- Lambda functions:
  - validate-booking-input (validates input)
  - process-auto-booking (processes a confirmed booking)
  - payment-stub (idempotent payment example)
  - payment-stripe (feature-flagged; reads Stripe secret from SSM)
  - provider-callback-initiate (Task Token pattern initiator)
  - provider-webhook-complete (completes the Task Token via webhook)
- DynamoDB tables: payments-idempotency, saga-transactions, pending-callbacks
- CloudWatch: log group, dashboard, and alarm
- EventBridge rule + SNS topic for failure notifications
- HTTP API for provider webhook

Naming and removal policy:
- State machine and log group names are suffixed with the stack name to avoid collisions.
- RemovalPolicy is DESTROY for non-prod and RETAIN for prod. Control via context stage=dev|prod.

## Prerequisites
- Node.js 18+ and npm
- AWS credentials configured (via profile or env vars) with permissions for IAM, Lambda, Step Functions, CloudWatch, DynamoDB, SSM, API Gateway, SNS
- CDK bootstrapped in your account/region (one-time per account/region):

```bash
# install CDK globally if needed
npm i -g aws-cdk
# or run via npx: npx cdk --version

# bootstrap (replace with your account/region and optional profile)
cd infra/cdk
cdk bootstrap aws://YOUR_ACCOUNT/YOUR_REGION --profile YOUR_PROFILE
```

## Install dependencies
```bash
cd infra/cdk
npm install
```

## Build and synthesize
```bash
npm run build
# pass stage via context if desired (defaults to dev)
npm run synth -- -c stage=dev
# or with a profile
CDK_DEFAULT_REGION=us-east-1 CDK_DEFAULT_ACCOUNT=123456789012 npx cdk synth -c stage=dev --profile YOUR_PROFILE
```

## Deploy
```bash
# deploy with stage context and optional profile
npm run deploy -- -c stage=dev --profile YOUR_PROFILE
```

Notes on state machine naming collisions:
- Names are derived from the stack name ("${stackName}-auto-booking"). If you previously had a state machine named auto-booking-workflow, this avoids conflicts.
- For production cutovers, deploy the new state machine alongside the old one, repoint integrations, then decommission the old resource.

## Useful outputs
- StateMachineArn
- WebhookUrl and WebhookSecretParameter
- Lambda ARNs (validate, process, payment)
- DynamoDB table names
- Dashboard and alarm names

## Security and secrets
- Stripe secret is stored in SSM at /auto-booking/stripe-secret (plaintext here for demo; use SecureString in prod and rotate out-of-band).
- The webhook secret is generated at deploy and stored in SSM at /auto-booking/webhook-secret.

## Troubleshooting
- Missing bootstrap: run cdk bootstrap with a working profile.
- Expired credentials: refresh your AWS credentials/profile and retry.
- Large dependency bundling: aws-sdk v3 clients and stripe are marked as nodeModules where needed.
- ASL not found: ensure infra/step-functions/auto-booking.asl.json exists and is valid JSON.

