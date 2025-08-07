# Stripe API Reference Documentation

## Document Overview

### Purpose
This document serves as the comprehensive API reference for integrating Stripe payment processing into Parker Flight's platform. Stripe provides a robust, developer-friendly payment infrastructure that enables secure payment processing, subscription billing, marketplace functionality, and financial services for modern businesses.

### Quick Start Guide
1. **Account Setup**: Create Stripe account and obtain API keys
2. **SDK Installation**: Install Stripe SDK for your development platform
3. **Authentication**: Configure API keys for test and live environments
4. **First Payment**: Create a basic payment intent or checkout session
5. **Webhook Integration**: Set up webhook endpoints for event handling

### Core Payment Workflows
- **One-time Payments**: Direct charges, payment intents, and checkout sessions
- **Subscription Billing**: Recurring payments, metered billing, and plan management
- **Marketplace Payments**: Multi-party payments with Connect platform
- **International Payments**: Multi-currency support and local payment methods
- **Refunds & Disputes**: Payment reversals and chargeback management

### Integration Architecture
```
Parker Flight Application
        ↓
  Stripe SDK/API Client
        ↓
    Stripe API
        ↓
   Payment Networks
        ↓
  Financial Settlement
```

### Critical Implementation Notes

#### Security Considerations
- **API Key Management**: Never expose secret keys in client-side code
- **PCI Compliance**: Use Stripe Elements or Checkout for card data handling
- **Webhook Verification**: Always verify webhook signatures for security
- **Test vs Live Mode**: Use separate keys for development and production

#### Payment Processing Best Practices
- **Payment Intents**: Use for complex payment flows with 3D Secure support
- **Idempotency**: Implement idempotent requests to prevent duplicate charges
- **Error Handling**: Implement comprehensive error handling for all payment states
- **Metadata Usage**: Store custom data for tracking and reconciliation

#### Rate Limiting & Performance
- **Rate Limits**: Standard rate limits of 25 requests per second
- **Pagination**: Use cursor-based pagination for large data sets
- **Webhooks**: Handle webhook events asynchronously to avoid timeouts
- **Caching**: Cache static data like product and price information

### Payment Method Strategy

#### Supported Payment Methods
- **Cards**: Visa, Mastercard, American Express, Discover
- **Digital Wallets**: Apple Pay, Google Pay, PayPal
- **Bank Transfers**: ACH, SEPA, wire transfers
- **Buy Now Pay Later**: Klarna, Afterpay, Affirm
- **Local Methods**: Regional payment methods by country

#### Payment Method Configuration
- Configure payment methods per market requirements
- Enable dynamic payment methods based on customer location
- Implement fallback payment methods for failed transactions
- Optimize payment method ordering for conversion

### Subscription & Billing Management

#### Subscription Models
- **Fixed Pricing**: Standard recurring billing with fixed amounts
- **Usage-Based**: Metered billing based on consumption
- **Tiered Pricing**: Progressive pricing tiers
- **Hybrid Models**: Combination of fixed and usage-based components

#### Billing Lifecycle
1. Customer creation and payment method attachment
2. Subscription creation with pricing and billing cycle
3. Invoice generation and payment collection
4. Dunning management for failed payments
5. Subscription modifications and cancellations

### Error Handling Strategy

#### HTTP Response Codes
- **200**: Success - process response data
- **400**: Bad Request - validate request parameters
- **401**: Unauthorized - check API key configuration
- **402**: Payment Required - handle payment failures
- **403**: Forbidden - check account permissions
- **404**: Not Found - verify resource identifiers
- **429**: Rate Limited - implement exponential backoff
- **500**: Server Error - retry with exponential backoff

#### Payment-Specific Error Handling
```javascript
const handlePaymentError = (error) => {
  switch (error.type) {
    case 'card_error':
      // Handle card-specific errors (declined, insufficient funds)
      return { success: false, message: error.message, retryable: false };
    case 'rate_limit_error':
      // Handle rate limiting
      return { success: false, message: 'Rate limited', retryable: true };
    case 'invalid_request_error':
      // Handle malformed requests
      return { success: false, message: 'Invalid request', retryable: false };
    case 'api_error':
      // Handle Stripe API errors
      return { success: false, message: 'API error', retryable: true };
    case 'connection_error':
      // Handle network errors
      return { success: false, message: 'Network error', retryable: true };
    default:
      return { success: false, message: 'Unknown error', retryable: false };
  }
};
```

### Webhook Implementation

#### Critical Webhook Events
- **payment_intent.succeeded**: Payment completed successfully
- **payment_intent.payment_failed**: Payment failed
- **invoice.payment_succeeded**: Subscription payment successful
- **invoice.payment_failed**: Subscription payment failed
- **customer.subscription.deleted**: Subscription cancelled
- **dispute.created**: Chargeback initiated

#### Webhook Security
```javascript
const verifyWebhook = (payload, signature, endpointSecret) => {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      endpointSecret
    );
    return { valid: true, event };
  } catch (err) {
    return { valid: false, error: err.message };
  }
};
```

### Testing & Validation

#### Test Environment Setup
- Use test API keys for development and staging
- Utilize Stripe's test card numbers for payment testing
- Test webhook handling with Stripe CLI
- Validate payment flows across different scenarios

#### Test Card Numbers
- **4242424242424242**: Visa (succeeds)
- **4000000000000002**: Visa (declined)
- **4000000000003220**: Visa (requires 3D Secure)
- **4000002500003155**: Visa (requires 3D Secure, authentication fails)

### API Resource Categories

#### Core Resources
- **Charges**: Direct payment processing
- **Payment Intents**: Advanced payment flows with confirmation
- **Customers**: Customer management and data storage
- **Payment Methods**: Stored payment method management
- **Balance & Transfers**: Account balance and fund transfers

#### Billing Resources
- **Products & Prices**: Catalog management
- **Subscriptions**: Recurring billing management
- **Invoices**: Invoice generation and management
- **Plans**: Legacy subscription plan management
- **Coupons & Discounts**: Promotional pricing

#### Connect Resources
- **Accounts**: Marketplace account management
- **Application Fees**: Platform fee collection
- **Transfers**: Multi-party payment distribution
- **Connect OAuth**: Platform account onboarding

### Common Integration Pitfalls

#### Security Issues
- **Exposed API Keys**: Never commit secret keys to version control
- **Unverified Webhooks**: Always verify webhook signatures
- **Client-side Secrets**: Never use secret keys in frontend code
- **Insufficient Logging**: Log payment events for debugging and compliance

#### Payment Flow Issues
- **Missing 3D Secure**: Implement SCA for European payments
- **Incomplete Error Handling**: Handle all payment states and errors
- **Race Conditions**: Handle concurrent webhook events properly
- **Timezone Issues**: Use UTC for all timestamp comparisons

#### Subscription Management Issues
- **Proration Logic**: Understand Stripe's proration calculations
- **Trial Period Handling**: Properly manage trial-to-paid transitions
- **Dunning Management**: Implement retry logic for failed payments
- **Cancellation Flows**: Handle immediate vs. end-of-period cancellations

### Parker Flight Integration Status

#### Current Implementation
- ✅ **Basic Payment Processing**: Credit card payments implemented
- ✅ **Customer Management**: Customer profiles and payment methods
- ✅ **Webhook Integration**: Core payment event handling
- 🔄 **Subscription Billing**: In development for premium features
- 📋 **Multi-currency Support**: Planned for international expansion
- 📋 **Connect Integration**: Planned for partner marketplace

#### Integration Checkpoints
1. **Security Audit**: Verify API key management and PCI compliance
2. **Error Handling**: Ensure comprehensive error handling across all flows
3. **Webhook Reliability**: Monitor webhook delivery and processing
4. **Payment Analytics**: Implement tracking for payment metrics
5. **Compliance**: Ensure regulatory compliance for target markets

### Financial Operations

#### Revenue Recognition
- Track payment timing vs. service delivery
- Handle refunds and their impact on revenue
- Manage subscription revenue recognition
- Account for processing fees and net revenue

#### Reconciliation
- Match Stripe payouts to bank deposits
- Reconcile payment intents to successful charges
- Track and account for failed payments and retries
- Monitor and resolve payment disputes

### Strategic Integration Context

Stripe serves as Parker Flight's primary payment processor, handling:
- **Flight Booking Payments**: Secure payment processing for flight reservations
- **Premium Services**: Subscription billing for enhanced features
- **Cancellation Management**: Automated refunds for flight cancellations
- **Multi-currency Processing**: International payment support
- **Fraud Prevention**: Advanced fraud detection and prevention
- **Regulatory Compliance**: PCI DSS compliance and data security

The integration prioritizes payment security, user experience, and financial accuracy while maintaining compliance with international payment processing regulations and airline industry requirements.

---

Find anything
/


	•	Introduction   Authentication   Connected Accounts   Errors   Expanding Responses   Idempotent requests   Include-dependent response values (API v2)   Metadata   Pagination   Request IDs   Versioning  
Core Resources

	•	Balance   Balance Transactions   Charges   Customers   Customer Session   Disputes   Events   Eventsv2   Event Destinationsv2   Files   File Links   FX Quotes   Mandates   Payment Intents   Setup Intents   Setup Attempts   Payouts   Refunds   Confirmation Token   Tokens  
Payment Methods

	•	Payment Methods   Payment Method Configurations   Payment Method Domains   Bank Accounts   Cash Balance   Cash Balance Transaction   Cards   Sources  
Products

	•	Products   Prices   Coupons   Promotion Code   Discounts   Tax Code   Tax Rate   Shipping Rates  
Checkout

	•	Checkout Sessions  
Payment Links

	•	Payment Link  
Billing

	•	Credit Note   Customer Balance Transaction   Customer Portal Session   Customer Portal Configuration   Invoices   Invoice Items   Invoice Line Item   Invoice Payment   Invoice Rendering Templates   Alerts   Meters   Meter Events   Meter Eventsv2   Meter Event Adjustment   Meter Event Adjustmentsv2   Meter Event Streamsv2   Meter Event Summary   Credit Grant   Credit Balance Summary   Credit Balance Transaction   Plans   Quote   Subscriptions   Subscription Items   Subscription Schedule   Tax IDs   Test Clocks  
Capital

	•	Financing Offer   Financing Summary  
Connect

	•	Accounts   Login Links   Account Links   Account Session   Application Fees   Application Fee Refunds   Capabilities   Country Specs   External Bank Accounts   External Account Cards   Person   Top-ups   Transfers   Transfer Reversals   Secrets  
Fraud

	•	Early Fraud Warning   Reviews   Value Lists   Value List Items  
Issuing

	•	Authorizations   Cardholders   Cards   Disputes   Funding Instructions   Personalization Designs   Physical Bundles   Tokens   Transactions  
Terminal

Treasury

Entitlements

Sigma

Reporting

Financial Connections

	•	Accounts   Account Owner   Session   Transactions  
Tax

	•	Tax Calculations   Tax Registrations   Tax Transactions   Tax Settings  
Identity

	•	Verification Session   Verification Report  
Crypto

	•	Crypto Onramp Session   Crypto Onramp Quotes  The Crypto Onramp Quote object Retrieve CryptoOnrampQuotes  
Climate

	•	Climate Order   Climate Product   Climate Supplier  
Forwarding

	•	Forwarding Request  
Privacy

	•	Redaction Job   Redaction Job Validation Error  
Webhooks

	•	Webhook Endpoints  

		Node.js SDK 18.3.0 • Basil 
		
		Docs
		Support
		Sign in →
API Reference 
Ask about this section

Copy for LLM


View as Markdown

The Stripe API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.
You can use the Stripe API in test mode, which doesn’t affect your live data or interact with the banking networks. The API key you use to authenticate the request determines whether the request is live mode or test mode.
The Stripe API doesn’t support bulk updates. You can work on only one object per request.
The Stripe API differs for every account as we release new versions and tailor functionality. Log in to see docs with your test key and data.
Just getting started?
Check out our development quickstart guide.
Not a developer?
Use Stripe’s no-code options or apps from our partners to get started with Stripe and to do more with your Stripe account—no code required.
BASE URL


https://api.stripe.com
CLIENT LIBRARIES

Ruby

Python

PHP

Java

Node.js

Go

.NET
npm install --save stripe


STRIPE-NODE


Authentication 
Ask about this section

Copy for LLM


View as Markdown

The Stripe API uses API keys to authenticate requests. You can view and manage your API keys in the Stripe Dashboard.
Test mode secret keys have the prefix sk_test_ and live mode secret keys have the prefix sk_live_. Alternatively, you can use restricted API keys for granular permissions.
Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.
Use your API key by setting it in the initial configuration of stripe. The Node.js library will then automatically send this key in each request.
You can also set a per-request key with an option. This is often useful for Connect applications that use multiple API keys during the lifetime of a process. Methods on the returned object reuse the same API key.
All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.
GLOBAL API KEY
Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET



const Stripe = require('stripe');
const stripe = Stripe('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');
PER-REQUEST API KEY
Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET



var charge = await stripe.charges.retrieve(
  'ch_3LiiC52eZvKYlo2C1da66ZSQ',
  {
    apiKey: '
sk_test_BQokikJOvBiI2HlWgH4olfQ2
'
  }
);
YOUR API KEY
A sample test API key is included in all the examples here, so you can test any example right away. Do not submit any personally identifiable information in requests made with this key.
To test requests using your account, replace the sample API key with your actual API key or sign in.

Connected Accounts 
Ask about this section

Copy for LLM


View as Markdown

To act as connected accounts, clients can issue requests using the Stripe-Account special header. Make sure that this header contains a Stripe account ID, which usually starts with the acct_ prefix.
The value is set per-request as shown in the adjacent code sample. Methods on the returned object reuse the same account ID.
		Related guide: Making API calls for connected accounts
PER-REQUEST ACCOUNT
Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET



stripe.charges.retrieve('ch_3LmjSR2eZvKYlo2C1cPZxlbL', {
  stripeAccount: 'acct_1032D82eZvKYlo2C'
});

Errors 
Ask about this section

Copy for LLM


View as Markdown

Stripe uses conventional HTTP response codes to indicate the success or failure of an API request. In general: Codes in the 2xx range indicate success. Codes in the 4xx range indicate an error that failed given the information provided (e.g., a required parameter was omitted, a charge failed, etc.). Codes in the 5xx range indicate an error with Stripe’s servers (these are rare).
Some 4xx errors that could be handled programmatically (e.g., a card is declined) include an error code that briefly explains the error reported.
	•	Attributes  code nullable string  For some errors that could be handled programmatically, a short string indicating the error code reported.    decline_code nullable string  For card errors resulting from a card issuer decline, a short string indicating the card issuer’s reason for the decline if they provide one.    message nullable string  A human-readable message providing more details about the error. For card errors, these messages can be shown to your users.    param nullable string  If the error is parameter-specific, the parameter related to the error. For example, you can use this to display a message near the correct form field.    payment_intent nullable object  The PaymentIntent object for errors returned on a request involving a PaymentIntent.    type enum  The type of error returned. One of api_error, card_error, idempotency_error, or invalid_request_error Possible enum values
	•	api_error
	•	card_error
	•	idempotency_error
	•	invalid_request_error
	•	 
More
Expand all
	•	   advice_code nullable string     charge nullable string     doc_url nullable string     network_advice_code nullable string     network_decline_code nullable string     payment_method nullable object     payment_method_type nullable string     request_log_url nullable string     setup_intent nullable object     source nullable object 
HTTP STATUS CODE SUMMARY

200
OK
Everything worked as expected.
400
Bad Request
The request was unacceptable, often due to missing a required parameter.
401
Unauthorized
No valid API key provided.
402
Request Failed
The parameters were valid but the request failed.
403
Forbidden
The API key doesn’t have permissions to perform the request.
404
Not Found
The requested resource doesn’t exist.
409
Conflict
The request conflicts with another request (perhaps due to using the same idempotent key).
424
External Dependency Failed
The request couldn’t be completed due to a failure in a dependency external to Stripe.
429
Too Many Requests
Too many requests hit the API too quickly. We recommend an exponential backoff of your requests.
500, 502, 503, 504
Server Errors
Something went wrong on Stripe’s end. (These are rare.)
ERROR TYPES

api_error
API errors cover any other type of problem (e.g., a temporary problem with Stripe’s servers), and are extremely uncommon.
card_error
Card errors are the most common type of error you should expect to handle. They result when the user enters a card that can’t be charged for some reason.
idempotency_error
Idempotency errors occur when an Idempotency-Key is re-used on a request that does not match the first request’s API endpoint and parameters.
invalid_request_error
Invalid request errors arise when your request has invalid parameters.

Handling errors 
Ask about this section

Copy for LLM


View as Markdown

Our Client libraries raise exceptions for many reasons, such as a failed charge, invalid parameters, authentication errors, and network unavailability. We recommend writing code that gracefully handles all possible API exceptions.
		Related guide: Error Handling

Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET



// Note: Node.js API does not throw exceptions, and instead prefers the
// asynchronous style of error handling described below.
//
// An error from the Stripe API or an otherwise asynchronous error
// will be available as the first argument of any Stripe method's callback:
// E.g. stripe.customers.create({...}, function(err, result) {});
//
// Or in the form of a rejected promise.
// E.g. stripe.customers.create({...}).then(
//        function(result) {},
//        function(err) {}
//      );

switch (err.type) {
  case 'StripeCardError':
    // A declined card error
    err.message; // => e.g. "Your card's expiration year is invalid."
    break;
  case 'StripeRateLimitError':
    // Too many requests made to the API too quickly
    break;
  case 'StripeInvalidRequestError':
    // Invalid parameters were supplied to Stripe's API
    break;
  case 'StripeAPIError':
    // An error occurred internally with Stripe's API
    break;
  case 'StripeConnectionError':
    // Some kind of error occurred during the HTTPS communication
    break;
  case 'StripeAuthenticationError':
    // You probably used an incorrect API key
    break;
  default:
    // Handle any other types of unexpected errors
    break;
}

Expanding Responses 
Ask about this section

Copy for LLM


View as Markdown

Many objects allow you to request additional information as an expanded response by using the expand request parameter. This parameter is available on all API requests, and applies to the response of that request only. You can expand responses in two ways.
In many cases, an object contains the ID of a related object in its response properties. For example, a Charge might have an associated Customer ID. You can expand these objects in line with the expand request parameter. The expandable label in this documentation indicates ID fields that you can expand into objects.
Some available fields aren’t included in the responses by default, such as the number and cvc fields for the Issuing Card object. You can request these fields as an expanded response by using the expand request parameter.
You can expand recursively by specifying nested fields after a dot (.). For example, requesting payment_intent.customer on a charge expands the payment_intent property into a full PaymentIntent object, then expands the customer property on that payment intent into a full Customer object.
You can use the expand parameter on any endpoint that returns expandable fields, including list, create, and update endpoints.
Expansions on list requests start with the data property. For example, you can expand data.customers on a request to list charges and associated customers. Performing deep expansions on numerous list requests might result in slower processing times.
Expansions have a maximum depth of four levels (for example, the deepest expansion allowed when listing charges is data.payment_intent.customer.default_source).
You can expand multiple objects at the same time by identifying multiple items in the expand array.
		Related guide: Expanding responses
		Related video: Expand

Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET



const Stripe = require('stripe');
const stripe = Stripe('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');
stripe.charges.retrieve('ch_3Ln0H22eZvKYlo2C0tgkG5bn', {
  expand: ['customer', 'payment_intent.customer'],
});
RESPONSE
{
  "id": "ch_3LmzzQ2eZvKYlo2C0XjzUzJV",
  "object": "charge",
  "customer": {
    "id": "cu_14HOpH2eZvKYlo2CxXIM7Pb2",
    "object": "customer",
    // ...
  },
  "payment_intent": {
    "id": "pi_3MtwBwLkdIwHu7ix28a3tqPa",
    "object": "payment_intent",
    "customer": {
      "id": "cus_NffrFeUfNV2Hib",
      "object": "customer",
      // ...
    },
    // ...
  },
  // ...
}

Idempotent requests 
Ask about this section

Copy for LLM


View as Markdown

The API supports idempotency for safely retrying requests without accidentally performing the same operation twice. When creating or updating an object, use an idempotency key. Then, if a connection error occurs, you can safely repeat the request without risk of creating a second object or performing the update twice.
To perform an idempotent request, provide an additional IdempotencyKey element to the request options.
Stripe’s idempotency works by saving the resulting status code and body of the first request made for any given idempotency key, regardless of whether it succeeds or fails. Subsequent requests with the same key return the same result, including 500 errors.
A client generates an idempotency key, which is a unique key that the server uses to recognize subsequent retries of the same request. How you create unique keys is up to you, but we suggest using V4 UUIDs, or another random string with enough entropy to avoid collisions. Idempotency keys are up to 255 characters long.
You can remove keys from the system automatically after they’re at least 24 hours old. We generate a new request if a key is reused after the original is pruned. The idempotency layer compares incoming parameters to those of the original request and errors if they’re not the same to prevent accidental misuse.
We save results only after the execution of an endpoint begins. If incoming parameters fail validation, or the request conflicts with another request that’s executing concurrently, we don’t save the idempotent result because no API endpoint initiates the execution. You can retry these requests. Learn more about when you can retry idempotent requests.
All POST requests accept idempotency keys. Don’t send idempotency keys in GET and DELETE requests because it has no effect. These requests are idempotent by definition.

Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET



const Stripe = require('stripe');
const stripe = Stripe('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');
const customer = await stripe.customers.create(
  {
    description: 'My First Test Customer (created for API docs at https://docs.stripe.com/api)',
  },
  {
    idempotencyKey: 'KG5LxwFBepaKHyUD',
  }
);

Include-dependent response values (API v2) 
Ask about this section

Copy for LLM


View as Markdown

Some API v2 responses contain null values for certain properties by default, regardless of their actual values. That reduces the size of response payloads while maintaining the basic response structure. To retrieve the actual values for those properties, specify them in the include array request parameter.
To determine whether you need to use the include parameter in a given request, look at the request description. The include parameter’s enum values represent the response properties that depend on the include parameter.
NOTE
Whether a response property defaults to null depends on the request endpoint, not the object that the endpoint references. If multiple endpoints return data from the same object, a particular property can depend on include in one endpoint and return its actual value by default for a different endpoint.
A hash property can depend on a single include value, or on multiple include values associated with its child properties. For example, when updating an Account, to return actual values for the entire identity hash, specify identity in the include parameter. Otherwise, the identity hash is null in the response. However, to return actual values for the configuration hash, you must specify individual configurations in the request. If you specify at least one configuration, but not all of them, specified configurations return actual values and unspecified configurations return null. If you don’t specify any configurations, the configuration hash is null in the response.
If you update an Account v2 to add the customer and merchant configurations, but don’t specify any properties in the include parameter, the response might look like this:



{
  "id": "acct_123",
  "object": "v2.core.account",
  "applied_configurations": [
    "customer",
    "merchant"
  ],
  "configuration": null,
  "contact_email": "furever@example.com",
  "created": "2025-06-09T21:16:03.000Z",
  "dashboard": "full",
  "defaults": null,
  "display_name": "Furever",
  "identity": null,
  "livemode": true,
  "metadata": {},
  "requirements": null
}
If you make the same request, but specify identity and configuration.customer in the include parameter, the response might look like this:



{
  "id": "acct_123",
  "object": "v2.core.account",
  "applied_configurations": [
    "customer",
    "merchant"
  ],
  "configuration": {
    "customer": {
      "automatic_indirect_tax": {
        ...
      },
      "billing": {
        ...
      },
      "capabilities": {
        ...
      },
      ...
    },
    "merchant": null,
    "recipient": null
  },
  "contact_email": "furever@example.com",
  "created": "2025-06-09T21:16:03.000Z",
  "dashboard": "full",
  "defaults": null,
  "display_name": "Furever",
  "identity": {
    "business_details": {
      "doing_business_as": "FurEver",
      "id_numbers": [
        {
          "type": "us_ein"
        }
      ],
      "product_description": "Saas pet grooming platform at furever.dev using Connect embedded components",
      "structure": "sole_proprietorship",
      "url": "http://accessible.stripe.com"
    },
    "country": "US"
  },
  "livemode": true,
  "metadata": {},
  "requirements": null
}

Metadata 
Ask about this section

Copy for LLM


View as Markdown

Updateable Stripe objects—including Account, Charge, Customer, PaymentIntent, Refund, Subscription, and Transfer have a metadata parameter. You can use this parameter to attach key-value data to these Stripe objects.
You can specify up to 50 keys, with key names up to 40 characters long and values up to 500 characters long. Keys and values are stored as strings and can contain any characters with one exception: you can’t use square brackets ([ and ]) in keys.
You can use metadata to store additional, structured information on an object. For example, you could store your user’s full name and corresponding unique identifier from your system on a Stripe Customer object. Stripe doesn’t use metadata—for example, we don’t use it to authorize or decline a charge and it won’t be seen by your users unless you choose to show it to them.
Some of the objects listed above also support a description parameter. You can use the description parameter to annotate a charge-for example, a human-readable description such as 2 shirts for test@example.com. Unlike metadata, description is a single string, which your users might see (for example, in email receipts Stripe sends on your behalf).
Don’t store any sensitive information (bank account numbers, card details, and so on) as metadata or in the description parameter.
		Related guide: Metadata
Sample metadata use cases
	•	Link IDs: Attach your system’s unique IDs to a Stripe object to simplify lookups. For example, add your order number to a charge, your user ID to a customer or recipient, or a unique receipt number to a transfer.
	•	Refund papertrails: Store information about the reason for a refund and the individual responsible for its creation.
	•	Customer details: Annotate a customer by storing an internal ID for your future use.
POST 
/v1/customers
Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET




const stripe = require('stripe')('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');

const customer = await stripe.customers.create({
  metadata: {
    order_id: '6735',
  },
});

{
  "id": "cus_123456789",
  "object": "customer",
  "address": {
    "city": "city",
    "country": "US",
    "line1": "line 1",
    "line2": "line 2",
    "postal_code": "90210",
    "state": "CA"
  },
  "balance": 0,
  "created": 1483565364,
  "currency": null,
  "default_source": null,
  "delinquent": false,
  "description": null,
  "discount": null,
  "email": null,
  "invoice_prefix": "C11F7E1",
  "invoice_settings": {
    "custom_fields": null,
    "default_payment_method": null,
    "footer": null,
    "rendering_options": null
  },
  "livemode": false,
  "metadata": {
    "order_id": "6735"
  },
  "name": null,
  "next_invoice_sequence": 1,
  "phone": null,
  "preferred_locales": [],
  "shipping": null,
  "tax_exempt": "none"
}

Pagination 
Ask about this section

Copy for LLM


View as Markdown

All top-level API resources have support for bulk fetches through “list” API methods. For example, you can list charges, list customers, and list invoices. These list API methods share a common structure and accept, at a minimum, the following three parameters: limit, starting_after, and ending_before.
Stripe’s list API methods use cursor-based pagination through the starting_after and ending_before parameters. Both parameters accept an existing object ID value (see below) and return objects in reverse chronological order. The ending_before parameter returns objects listed before the named object. The starting_after parameter returns objects listed after the named object. These parameters are mutually exclusive. You can use either the starting_after or ending_before parameter, but not both simultaneously.
Our client libraries offer auto-pagination helpers to traverse all pages of a list.
	•		•	Parameters  limit optional, default is 10  This specifies a limit on the number of objects to return, ranging between 1 and 100.    starting_after optional object ID  A cursor to use in pagination. starting_after is an object ID that defines your place in the list. For example, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include starting_after=obj_foo to fetch the next page of the list.    ending_before optional object ID  A cursor to use in pagination. ending_before is an object ID that defines your place in the list. For example, if you make a list request and receive 100 objects, starting with obj_bar, your subsequent call can include ending_before=obj_bar to fetch the previous page of the list.  List Response Format  object string, value is "list"  A string that provides a description of the object type that returns.    data array  An array containing the actual response elements, paginated by any request parameters.    has_more boolean  Whether or not there are more elements available after this set. If false, this set comprises the end of the list.    url url  The URL for accessing this list. 
RESPONSE
{
  "object": "list",
  "url": "/v1/customers",
  "has_more": false,
  "data": [
    {
      "id": "cus_4QFJOjw2pOmAGJ",
      "object": "customer",
      "address": null,
      "balance": 0,
      "created": 1405641735,
      "currency": "usd",
      "default_source": "card_14HOpG2eZvKYlo2Cz4u5AJG5",
      "delinquent": false,
      "description": "New customer",
      "discount": null,
      "email": null,
      "invoice_prefix": "7D11B54",
      "invoice_settings": {
        "custom_fields": null,
        "default_payment_method": null,
        "footer": null,
        "rendering_options": null
      },
      "livemode": false,
      "metadata": {
        "order_id": "6735"
      },
      "name": "cus_4QFJOjw2pOmAGJ",
      "next_invoice_sequence": 25,
      "phone": null,
      "preferred_locales": [],
      "shipping": null,
      "tax_exempt": "none",
      "test_clock": null
    },
  ]
}

Search 
Ask about this section

Copy for LLM


View as Markdown

Some top-level API resource have support for retrieval via “search” API methods. For example, you can search charges, search customers, and search subscriptions.
Stripe’s search API methods utilize cursor-based pagination via the page request parameter and next_page response parameter. For example, if you make a search request and receive "next_page": "pagination_key" in the response, your subsequent call can include page=pagination_key to fetch the next page of results.
Our client libraries offer auto-pagination helpers to easily traverse all pages of a search result.
	•		•	Search request format  query required  The search query string. See search query language.    limit optional  A limit on the number of objects returned. Limit can range between 1 and 100, and the default is 10.    page optional  A cursor for pagination across multiple pages of results. Don’t include this parameter on the first call. Use the next_page value returned in a previous response to request subsequent results.  Search response format  object string, value is "search_result"  A string describing the object type returned.    url string  The URL for accessing this list.    has_more boolean  Whether or not there are more elements available after this set. If false, this set comprises the end of the list.    data array  An array containing the actual response elements, paginated by any request parameters.    next_page string  A cursor for use in pagination. If has_more is true, you can pass the value of next_page to a subsequent call to fetch the next page of results.    total_count optional positive integer or zero  The total number of objects that match the query, only accurate up to 10,000. This field isn’t included by default. To include it in the response, expand the total_count field. 
RESPONSE
{
  "object": "search_result",
  "url": "/v1/customers/search",
  "has_more": false,
  "data": [
    {
      "id": "cus_4QFJOjw2pOmAGJ",
      "object": "customer",
      "address": null,
      "balance": 0,
      "created": 1405641735,
      "currency": "usd",
      "default_source": "card_14HOpG2eZvKYlo2Cz4u5AJG5",
      "delinquent": false,
      "description": "someone@example.com for Coderwall",
      "discount": null,
      "email": null,
      "invoice_prefix": "7D11B54",
      "invoice_settings": {
        "custom_fields": null,
        "default_payment_method": null,
        "footer": null,
        "rendering_options": null
      },
      "livemode": false,
      "metadata": {
        "foo": "bar"
      },
      "name": "fakename",
      "next_invoice_sequence": 25,
      "phone": null,
      "preferred_locales": [],
      "shipping": null,
      "tax_exempt": "none",
      "test_clock": null
    }
  ]
}

Auto-pagination 
Ask about this section

Copy for LLM


View as Markdown

Our libraries support auto-pagination. This feature allows you to easily iterate through large lists of resources without having to manually perform the requests to fetch subsequent pages.
To use the auto-pagination feature in Node 10+, simply iterate over a “list” call with the parameters you need in a for await loop.
To use the auto-pagination feature in older versions of Node, issue a “list” call with the parameters you need, then call autoPagingEach(onItem) on the returned list object to iterate over all objects matching your initial parameters.
Full docs are on the stripe-node GitHub repository.

Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET



const Stripe = require('stripe');
const stripe = Stripe('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');
// In Node 10+:
for await (const customer of stripe.customers.list({limit: 3})) {
  // Do something with customer
}

// In other environments:
stripe.customers.list({limit: 3})
  .autoPagingEach(function(customer) {
    // Do something with customer
  });

Request IDs 
Ask about this section

Copy for LLM


View as Markdown

Each API request has an associated request identifier. You can find this value in the response headers, under Request-Id. You can also find request identifiers in the URLs of individual request logs in your Dashboard.
To expedite the resolution process, provide the request identifier when you contact us about a specific request.

Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET



const Stripe = require('stripe');
const stripe = Stripe('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');
var customer = await stripe.customers.create();
console.log(customer.lastResponse.requestId);

Versioning 
Ask about this section

Copy for LLM


View as Markdown

Each major release, such as Acacia, includes changes that aren’t backward-compatible with previous releases. Upgrading to a new major release can require updates to existing code. Each monthly release includes only backward-compatible changes, and uses the same name as the last major release. You can safely upgrade to a new monthly release without breaking any existing code. The current version is 2025-06-30.basil. For information on all API versions, view our API changelog.
	•	Starting from stripe-node v12, the requests you send using stripe-node align with the API version that was current when your version of stripe-node was released. This ensures that your TypeScript types are compatible with the API version you use.
	•	On stripe-node v11 or lower, requests made with stripe-node use your Stripe account’s default API version (controlled in Workbench).
You can override the API version in your code in all versions.
To override the API version, provide the apiVersion option when initializing the library, or set it per-request. This might cause inaccurate Typescript types.
Webhook events also use your account’s API version by default, unless you set an API version during endpoint creation.
You can upgrade your API version in Workbench. As a precaution, use API versioning to test a new API version before committing to an upgrade.

Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET



const stripe = require('stripe')('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
', {
  apiVersion: '2025-06-30.basil',
});

Balance 
Ask about this section

Copy for LLM


View as Markdown

This is an object representing your Stripe balance. You can retrieve it to see the balance currently on your Stripe account.
You can also retrieve the balance history, which contains a list of transactions that contributed to the balance (charges, payouts, and so forth).
The available and pending amounts for each currency are broken down further by payment source types.
Related guide: Understanding Connect account balances
ENDPOINTS
		GET /v1/balance
SHOW


Balance Transactions 
Ask about this section

Copy for LLM


View as Markdown

Balance transactions represent funds moving through your Stripe account. Stripe creates them for every type of transaction that enters or leaves your Stripe account balance.
Related guide: Balance transaction types
ENDPOINTS
		GET /v1/balance_transactions/:id GET /v1/balance_transactions
SHOW


Charges 
Ask about this section

Copy for LLM


View as Markdown

The Charge object represents a single attempt to move money into your Stripe account. PaymentIntent confirmation is the most common way to create Charges, but transferring money to a different Stripe account through Connect also creates Charges. Some legacy payment flows create Charges directly, which is not recommended for new integrations.
Was this section helpful?
Yes
No
ENDPOINTS
		POST /v1/charges POST /v1/charges/:id GET /v1/charges/:id GET /v1/charges POST /v1/charges/:id/capture GET /v1/charges/search

The Charge object 
Ask about this section

Copy for LLM


View as Markdown

	•	Attributes  id string  Unique identifier for the object.    amount integer  Amount intended to be collected by this payment. A positive integer representing how much to charge in the smallest currency unit (e.g., 100 cents to charge $1.00 or 100 to charge ¥100, a zero-decimal currency). The minimum amount is $0.50 US or equivalent in charge currency. The amount value supports up to eight digits (e.g., a value of 99999999 for a USD charge of $999,999.99).    balance_transaction nullable string Expandable  ID of the balance transaction that describes the impact of this charge on your account balance (not including refunds or disputes).    billing_details object  Billing information associated with the payment method at the time of the transaction.  Show child attributes   currency enum  Three-letter ISO currency code, in lowercase. Must be a supported currency.    customer nullable string Expandable  ID of the customer this charge is for if one exists.    description nullable string  An arbitrary string attached to the object. Often useful for displaying to users.    disputed boolean  Whether the charge has been disputed.    metadata object  Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format.    payment_intent nullable string Expandable  ID of the PaymentIntent associated with this charge, if one exists.    payment_method_details nullable object  Details about the payment method at the time of the transaction.  Show child attributes   receipt_email nullable string  This is the email address that the receipt for this charge was sent to.    refunded boolean  Whether the charge has been fully refunded. If the charge is only partially refunded, this attribute will still be false.    shipping nullable object  Shipping information for the charge.  Show child attributes   statement_descriptor nullable string  For a non-card charge, text that appears on the customer’s statement as the statement descriptor. This value overrides the account’s default statement descriptor. For information about requirements, including the 22-character limit, see the Statement Descriptor docs. For a card charge, this value is ignored unless you don’t specify a statement_descriptor_suffix, in which case this value is used as the suffix.    statement_descriptor_suffix nullable string  Provides information about a card charge. Concatenated to the account’s statement descriptor prefix to form the complete statement descriptor that appears on the customer’s statement. If the account has no prefix value, the suffix is concatenated to the account’s statement descriptor.    status enum  The status of the payment is either succeeded, pending, or failed. 
More attributes
Expand all
	•	   object string     amount_captured integer     amount_refunded integer     application nullable string Expandable Connect only     application_fee nullable string Expandable Connect only     application_fee_amount nullable integer Connect only     calculated_statement_descriptor nullable string     captured boolean     created timestamp     failure_balance_transaction nullable string Expandable     failure_code nullable string     failure_message nullable string     fraud_details nullable object     livemode boolean     on_behalf_of nullable string Expandable Connect only     outcome nullable object     paid boolean     payment_method nullable string     presentment_details nullable object     radar_options nullable object     receipt_number nullable string     receipt_url nullable string     refunds nullable object Expandable     review nullable string Expandable     source_transfer nullable string Expandable Connect only     transfer nullable string Expandable Connect only     transfer_data nullable object Connect only     transfer_group nullable string Connect only 
THE CHARGE OBJECT
{
  "id": "ch_3MmlLrLkdIwHu7ix0snN0B15",
  "object": "charge",
  "amount": 1099,
  "amount_captured": 1099,
  "amount_refunded": 0,
  "application": null,
  "application_fee": null,
  "application_fee_amount": null,
  "balance_transaction": "txn_3MmlLrLkdIwHu7ix0uke3Ezy",
  "billing_details": {
    "address": {
      "city": null,
      "country": null,
      "line1": null,
      "line2": null,
      "postal_code": null,
      "state": null
    },
    "email": null,
    "name": null,
    "phone": null
  },
  "calculated_statement_descriptor": "Stripe",
  "captured": true,
  "created": 1679090539,
  "currency": "usd",
  "customer": null,
  "description": null,
  "disputed": false,
  "failure_balance_transaction": null,
  "failure_code": null,
  "failure_message": null,
  "fraud_details": {},
  "livemode": false,
  "metadata": {},
  "on_behalf_of": null,
  "outcome": {
    "network_status": "approved_by_network",
    "reason": null,
    "risk_level": "normal",
    "risk_score": 32,
    "seller_message": "Payment complete.",
    "type": "authorized"
  },
  "paid": true,
  "payment_intent": null,
  "payment_method": "card_1MmlLrLkdIwHu7ixIJwEWSNR",
  "payment_method_details": {
    "card": {
      "brand": "visa",
      "checks": {
        "address_line1_check": null,
        "address_postal_code_check": null,
        "cvc_check": null
      },
      "country": "US",
      "exp_month": 3,
      "exp_year": 2024,
      "fingerprint": "mToisGZ01V71BCos",
      "funding": "credit",
      "installments": null,
      "last4": "4242",
      "mandate": null,
      "network": "visa",
      "three_d_secure": null,
      "wallet": null
    },
    "type": "card"
  },
  "receipt_email": null,
  "receipt_number": null,
  "receipt_url": "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTTJKVGtMa2RJd0h1N2l4KOvG06AGMgZfBXyr1aw6LBa9vaaSRWU96d8qBwz9z2J_CObiV_H2-e8RezSK_sw0KISesp4czsOUlVKY",
  "refunded": false,
  "review": null,
  "shipping": null,
  "source_transfer": null,
  "statement_descriptor": null,
  "statement_descriptor_suffix": null,
  "status": "succeeded",
  "transfer_data": null,
  "transfer_group": null
}

Create a charge 
Deprecated
Ask about this section

Copy for LLM


View as Markdown

This method is no longer recommended—use the Payment Intents API to initiate a new payment instead. Confirmation of the PaymentIntent creates the Charge object used to request payment.
	•	Parameters  amount integer Required  Amount intended to be collected by this payment. A positive integer representing how much to charge in the smallest currency unit (e.g., 100 cents to charge $1.00 or 100 to charge ¥100, a zero-decimal currency). The minimum amount is $0.50 US or equivalent in charge currency. The amount value supports up to eight digits (e.g., a value of 99999999 for a USD charge of $999,999.99).    currency enum Required  Three-letter ISO currency code, in lowercase. Must be a supported currency.    customer string  The ID of an existing customer that will be charged in this request.    description string  An arbitrary string which you can attach to a Charge object. It is displayed when in the web interface alongside the charge. Note that if you use Stripe to send automatic email receipts to your customers, your receipt emails will include the description of the charge(s) that they are describing.    metadata object  Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format. Individual keys can be unset by posting an empty value to them. All keys can be unset by posting an empty value to metadata.    receipt_email string  The email address to which this charge’s receipt will be sent. The receipt will not be sent until the charge is paid, and no receipts will be sent for test mode charges. If this charge is for a Customer, the email address specified here will override the customer’s email address. If receipt_email is specified for a charge in live mode, a receipt will be sent regardless of your email settings.    shipping object  Shipping information for the charge. Helps prevent fraud on charges for physical goods.  Show child parameters   source string  A payment source to be charged. This can be the ID of a card (i.e., credit or debit card), a bank account, a source, a token, or a connected account. For certain sources—namely, cards, bank accounts, and attached sources—you must also pass the ID of the associated customer.    statement_descriptor string  For a non-card charge, text that appears on the customer’s statement as the statement descriptor. This value overrides the account’s default statement descriptor. For information about requirements, including the 22-character limit, see the Statement Descriptor docs. For a card charge, this value is ignored unless you don’t specify a statement_descriptor_suffix, in which case this value is used as the suffix.    statement_descriptor_suffix string  Provides information about a card charge. Concatenated to the account’s statement descriptor prefix to form the complete statement descriptor that appears on the customer’s statement. If the account has no prefix value, the suffix is concatenated to the account’s statement descriptor. 
More parameters
Expand all
	•	   application_fee_amount integer Connect only     capture boolean     on_behalf_of string Connect only     radar_options object     transfer_data object Connect only     transfer_group string Connect only 
Returns

Returns the charge object if the charge succeeded. This call throws an error if something goes wrong. A common source of error is an invalid or expired card, or a valid card with insufficient available balance.
POST 
/v1/charges
Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET




const stripe = require('stripe')('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');

const charge = await stripe.charges.create({
  amount: 1099,
  currency: 'usd',
  source: 'tok_visa',
});
RESPONSE
{
  "id": "ch_3MmlLrLkdIwHu7ix0snN0B15",
  "object": "charge",
  "amount": 1099,
  "amount_captured": 1099,
  "amount_refunded": 0,
  "application": null,
  "application_fee": null,
  "application_fee_amount": null,
  "balance_transaction": "txn_3MmlLrLkdIwHu7ix0uke3Ezy",
  "billing_details": {
    "address": {
      "city": null,
      "country": null,
      "line1": null,
      "line2": null,
      "postal_code": null,
      "state": null
    },
    "email": null,
    "name": null,
    "phone": null
  },
  "calculated_statement_descriptor": "Stripe",
  "captured": true,
  "created": 1679090539,
  "currency": "usd",
  "customer": null,
  "description": null,
  "disputed": false,
  "failure_balance_transaction": null,
  "failure_code": null,
  "failure_message": null,
  "fraud_details": {},
  "livemode": false,
  "metadata": {},
  "on_behalf_of": null,
  "outcome": {
    "network_status": "approved_by_network",
    "reason": null,
    "risk_level": "normal",
    "risk_score": 32,
    "seller_message": "Payment complete.",
    "type": "authorized"
  },
  "paid": true,
  "payment_intent": null,
  "payment_method": "card_1MmlLrLkdIwHu7ixIJwEWSNR",
  "payment_method_details": {
    "card": {
      "brand": "visa",
      "checks": {
        "address_line1_check": null,
        "address_postal_code_check": null,
        "cvc_check": null
      },
      "country": "US",
      "exp_month": 3,
      "exp_year": 2024,
      "fingerprint": "mToisGZ01V71BCos",
      "funding": "credit",
      "installments": null,
      "last4": "4242",
      "mandate": null,
      "network": "visa",
      "three_d_secure": null,
      "wallet": null
    },
    "type": "card"
  },
  "receipt_email": null,
  "receipt_number": null,
  "receipt_url": "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTTJKVGtMa2RJd0h1N2l4KOvG06AGMgZfBXyr1aw6LBa9vaaSRWU96d8qBwz9z2J_CObiV_H2-e8RezSK_sw0KISesp4czsOUlVKY",
  "refunded": false,
  "review": null,
  "shipping": null,
  "source_transfer": null,
  "statement_descriptor": null,
  "statement_descriptor_suffix": null,
  "status": "succeeded",
  "transfer_data": null,
  "transfer_group": null
}

Update a charge 
Ask about this section

Copy for LLM


View as Markdown

Updates the specified charge by setting the values of the parameters passed. Any parameters not provided will be left unchanged.
	•	Parameters  customer string  The ID of an existing customer that will be associated with this request. This field may only be updated if there is no existing associated customer with this charge.    description string  An arbitrary string which you can attach to a charge object. It is displayed when in the web interface alongside the charge. Note that if you use Stripe to send automatic email receipts to your customers, your receipt emails will include the description of the charge(s) that they are describing.    metadata object  Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format. Individual keys can be unset by posting an empty value to them. All keys can be unset by posting an empty value to metadata.    receipt_email string  This is the email address that the receipt for this charge will be sent to. If this field is updated, then a new email receipt will be sent to the updated address.    shipping object  Shipping information for the charge. Helps prevent fraud on charges for physical goods.  Show child parameters
More parameters
Expand all
	•	   fraud_details object     transfer_group string Connect only 
Returns

Returns the charge object if the update succeeded. This call will throw an error if update parameters are invalid.
POST 
/v1/charges/:id
Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET




const stripe = require('stripe')('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');

const charge = await stripe.charges.update(
  'ch_3MmlLrLkdIwHu7ix0snN0B15',
  {
    metadata: {
      shipping: 'express',
    },
  }
);
RESPONSE
{
  "id": "ch_3MmlLrLkdIwHu7ix0snN0B15",
  "object": "charge",
  "amount": 1099,
  "amount_captured": 1099,
  "amount_refunded": 0,
  "application": null,
  "application_fee": null,
  "application_fee_amount": null,
  "balance_transaction": "txn_3MmlLrLkdIwHu7ix0uke3Ezy",
  "billing_details": {
    "address": {
      "city": null,
      "country": null,
      "line1": null,
      "line2": null,
      "postal_code": null,
      "state": null
    },
    "email": null,
    "name": null,
    "phone": null
  },
  "calculated_statement_descriptor": "Stripe",
  "captured": true,
  "created": 1679090539,
  "currency": "usd",
  "customer": null,
  "description": null,
  "disputed": false,
  "failure_balance_transaction": null,
  "failure_code": null,
  "failure_message": null,
  "fraud_details": {},
  "livemode": false,
  "metadata": {
    "shipping": "express"
  },
  "on_behalf_of": null,
  "outcome": {
    "network_status": "approved_by_network",
    "reason": null,
    "risk_level": "normal",
    "risk_score": 32,
    "seller_message": "Payment complete.",
    "type": "authorized"
  },
  "paid": true,
  "payment_intent": null,
  "payment_method": "card_1MmlLrLkdIwHu7ixIJwEWSNR",
  "payment_method_details": {
    "card": {
      "brand": "visa",
      "checks": {
        "address_line1_check": null,
        "address_postal_code_check": null,
        "cvc_check": null
      },
      "country": "US",
      "exp_month": 3,
      "exp_year": 2024,
      "fingerprint": "mToisGZ01V71BCos",
      "funding": "credit",
      "installments": null,
      "last4": "4242",
      "mandate": null,
      "network": "visa",
      "network_token": {
        "used": false
      },
      "three_d_secure": null,
      "wallet": null
    },
    "type": "card"
  },
  "receipt_email": null,
  "receipt_number": null,
  "receipt_url": "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTTJKVGtMa2RJd0h1N2l4KPDLl6UGMgawkab5iK86LBYtkq0XrhiQf1RsA2ubesH4GHiixEU8_1-Wp7h4oQEdfSUGiZpJwtQHBErT",
  "refunded": false,
  "refunds": {
    "object": "list",
    "data": [],
    "has_more": false,
    "total_count": 0,
    "url": "/v1/charges/ch_3MmlLrLkdIwHu7ix0snN0B15/refunds"
  },
  "review": null,
  "shipping": null,
  "source_transfer": null,
  "statement_descriptor": null,
  "statement_descriptor_suffix": null,
  "status": "succeeded",
  "transfer_data": null,
  "transfer_group": null
}

Retrieve a charge 
Ask about this section

Copy for LLM


View as Markdown

Retrieves the details of a charge that has previously been created. Supply the unique charge ID that was returned from your previous request, and Stripe will return the corresponding charge information. The same information is returned when creating or refunding the charge.
Parameters

No parameters.
Returns

Returns a charge if a valid identifier was provided, and throws an error otherwise.
GET 
/v1/charges/:id
Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET




const stripe = require('stripe')('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');

const charge = await stripe.charges.retrieve('ch_3MmlLrLkdIwHu7ix0snN0B15');
RESPONSE
{
  "id": "ch_3MmlLrLkdIwHu7ix0snN0B15",
  "object": "charge",
  "amount": 1099,
  "amount_captured": 1099,
  "amount_refunded": 0,
  "application": null,
  "application_fee": null,
  "application_fee_amount": null,
  "balance_transaction": "txn_3MmlLrLkdIwHu7ix0uke3Ezy",
  "billing_details": {
    "address": {
      "city": null,
      "country": null,
      "line1": null,
      "line2": null,
      "postal_code": null,
      "state": null
    },
    "email": null,
    "name": null,
    "phone": null
  },
  "calculated_statement_descriptor": "Stripe",
  "captured": true,
  "created": 1679090539,
  "currency": "usd",
  "customer": null,
  "description": null,
  "disputed": false,
  "failure_balance_transaction": null,
  "failure_code": null,
  "failure_message": null,
  "fraud_details": {},
  "livemode": false,
  "metadata": {},
  "on_behalf_of": null,
  "outcome": {
    "network_status": "approved_by_network",
    "reason": null,
    "risk_level": "normal",
    "risk_score": 32,
    "seller_message": "Payment complete.",
    "type": "authorized"
  },
  "paid": true,
  "payment_intent": null,
  "payment_method": "card_1MmlLrLkdIwHu7ixIJwEWSNR",
  "payment_method_details": {
    "card": {
      "brand": "visa",
      "checks": {
        "address_line1_check": null,
        "address_postal_code_check": null,
        "cvc_check": null
      },
      "country": "US",
      "exp_month": 3,
      "exp_year": 2024,
      "fingerprint": "mToisGZ01V71BCos",
      "funding": "credit",
      "installments": null,
      "last4": "4242",
      "mandate": null,
      "network": "visa",
      "three_d_secure": null,
      "wallet": null
    },
    "type": "card"
  },
  "receipt_email": null,
  "receipt_number": null,
  "receipt_url": "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTTJKVGtMa2RJd0h1N2l4KOvG06AGMgZfBXyr1aw6LBa9vaaSRWU96d8qBwz9z2J_CObiV_H2-e8RezSK_sw0KISesp4czsOUlVKY",
  "refunded": false,
  "review": null,
  "shipping": null,
  "source_transfer": null,
  "statement_descriptor": null,
  "statement_descriptor_suffix": null,
  "status": "succeeded",
  "transfer_data": null,
  "transfer_group": null
}

List all charges 
Ask about this section

Copy for LLM


View as Markdown

Returns a list of charges you’ve previously created. The charges are returned in sorted order, with the most recent charges appearing first.
	•	Parameters  customer string  Only return charges for the customer specified by this customer ID. 
More parameters
Expand all
	•	   created object     ending_before string     limit integer     payment_intent string     starting_after string     transfer_group string Connect only 
Returns

A object with a data property that contains an array of up to limit charges, starting after charge starting_after. Each entry in the array is a separate charge object. If no more charges are available, the resulting array will be empty. If you provide a non-existent customer ID, this call throws an error.
GET 
/v1/charges
Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET




const stripe = require('stripe')('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');

const charges = await stripe.charges.list({
  limit: 3,
});
RESPONSE
{
  "object": "list",
  "url": "/v1/charges",
  "has_more": false,
  "data": [
    {
      "id": "ch_3MmlLrLkdIwHu7ix0snN0B15",
      "object": "charge",
      "amount": 1099,
      "amount_captured": 1099,
      "amount_refunded": 0,
      "application": null,
      "application_fee": null,
      "application_fee_amount": null,
      "balance_transaction": "txn_3MmlLrLkdIwHu7ix0uke3Ezy",
      "billing_details": {
        "address": {
          "city": null,
          "country": null,
          "line1": null,
          "line2": null,
          "postal_code": null,
          "state": null
        },
        "email": null,
        "name": null,
        "phone": null
      },
      "calculated_statement_descriptor": "Stripe",
      "captured": true,
      "created": 1679090539,
      "currency": "usd",
      "customer": null,
      "description": null,
      "disputed": false,
      "failure_balance_transaction": null,
      "failure_code": null,
      "failure_message": null,
      "fraud_details": {},
      "livemode": false,
      "metadata": {},
      "on_behalf_of": null,
      "outcome": {
        "network_status": "approved_by_network",
        "reason": null,
        "risk_level": "normal",
        "risk_score": 32,
        "seller_message": "Payment complete.",
        "type": "authorized"
      },
      "paid": true,
      "payment_intent": null,
      "payment_method": "card_1MmlLrLkdIwHu7ixIJwEWSNR",
      "payment_method_details": {
        "card": {
          "brand": "visa",
          "checks": {
            "address_line1_check": null,
            "address_postal_code_check": null,
            "cvc_check": null
          },
          "country": "US",
          "exp_month": 3,
          "exp_year": 2024,
          "fingerprint": "mToisGZ01V71BCos",
          "funding": "credit",
          "installments": null,
          "last4": "4242",
          "mandate": null,
          "network": "visa",
          "three_d_secure": null,
          "wallet": null
        },
        "type": "card"
      },
      "receipt_email": null,
      "receipt_number": null,
      "receipt_url": "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTTJKVGtMa2RJd0h1N2l4KOvG06AGMgZfBXyr1aw6LBa9vaaSRWU96d8qBwz9z2J_CObiV_H2-e8RezSK_sw0KISesp4czsOUlVKY",
      "refunded": false,
      "review": null,
      "shipping": null,
      "source_transfer": null,
      "statement_descriptor": null,
      "statement_descriptor_suffix": null,
      "status": "succeeded",
      "transfer_data": null,
      "transfer_group": null
    }
  ]
}

Capture a charge 
Ask about this section

Copy for LLM


View as Markdown

Capture the payment of an existing, uncaptured charge that was created with the capture option set to false.
Uncaptured payments expire a set number of days after they are created (7 by default), after which they are marked as refunded and capture attempts will fail.
Don’t use this method to capture a PaymentIntent-initiated charge. Use Capture a PaymentIntent.
	•	Parameters  amount integer  The amount to capture, which must be less than or equal to the original amount.    receipt_email string  The email address to send this charge’s receipt to. This will override the previously-specified email address for this charge, if one was set. Receipts will not be sent in test mode.    statement_descriptor string  For a non-card charge, text that appears on the customer’s statement as the statement descriptor. This value overrides the account’s default statement descriptor. For information about requirements, including the 22-character limit, see the Statement Descriptor docs. For a card charge, this value is ignored unless you don’t specify a statement_descriptor_suffix, in which case this value is used as the suffix.    statement_descriptor_suffix string  Provides information about a card charge. Concatenated to the account’s statement descriptor prefix to form the complete statement descriptor that appears on the customer’s statement. If the account has no prefix value, the suffix is concatenated to the account’s statement descriptor. 
More parameters
Expand all
	•	   application_fee_amount integer Connect only     transfer_data object Connect only     transfer_group string Connect only 
Returns

Returns the charge object, with an updated captured property (set to true). Capturing a charge will always succeed, unless the charge is already refunded, expired, captured, or an invalid capture amount is specified, in which case this method will throw an error.
POST 
/v1/charges/:id/capture
Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET




const stripe = require('stripe')('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');

const charge = await stripe.charges.capture('ch_3MrVHGLkdIwHu7ix1mN3zEiP');
RESPONSE
{
  "id": "ch_3MrVHGLkdIwHu7ix1mN3zEiP",
  "object": "charge",
  "amount": 1099,
  "amount_captured": 1099,
  "amount_refunded": 0,
  "application": null,
  "application_fee": null,
  "application_fee_amount": null,
  "balance_transaction": "txn_3MrVHGLkdIwHu7ix1Yb1LdXJ",
  "billing_details": {
    "address": {
      "city": null,
      "country": null,
      "line1": null,
      "line2": null,
      "postal_code": null,
      "state": null
    },
    "email": null,
    "name": null,
    "phone": null
  },
  "calculated_statement_descriptor": "Stripe",
  "captured": true,
  "created": 1680220390,
  "currency": "usd",
  "customer": null,
  "description": null,
  "destination": null,
  "dispute": null,
  "disputed": false,
  "failure_balance_transaction": null,
  "failure_code": null,
  "failure_message": null,
  "fraud_details": {},
  "livemode": false,
  "metadata": {},
  "on_behalf_of": null,
  "order": null,
  "outcome": {
    "network_status": "approved_by_network",
    "reason": null,
    "risk_level": "normal",
    "risk_score": 0,
    "seller_message": "Payment complete.",
    "type": "authorized"
  },
  "paid": true,
  "payment_intent": null,
  "payment_method": "card_1MrVHGLkdIwHu7ix7H1PgERt",
  "payment_method_details": {
    "card": {
      "brand": "visa",
      "checks": {
        "address_line1_check": null,
        "address_postal_code_check": null,
        "cvc_check": null
      },
      "country": "US",
      "exp_month": 3,
      "exp_year": 2024,
      "fingerprint": "mToisGZ01V71BCos",
      "funding": "credit",
      "installments": null,
      "last4": "4242",
      "mandate": null,
      "network": "visa",
      "network_token": {
        "used": false
      },
      "three_d_secure": null,
      "wallet": null
    },
    "type": "card"
  },
  "receipt_email": null,
  "receipt_number": null,
  "receipt_url": "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTTJKVGtMa2RJd0h1N2l4KOfBmKEGMgarecoy8cU6LBYTBSk6QLeqixDK3Wp7agsQfREj3vSXJTrg8SjoxhuNjSJzxMcN6QHTlEDG",
  "refunded": false,
  "review": null,
  "shipping": null,
  "source": {
    "id": "card_1MrVHGLkdIwHu7ix7H1PgERt",
    "object": "card",
    "address_city": null,
    "address_country": null,
    "address_line1": null,
    "address_line1_check": null,
    "address_line2": null,
    "address_state": null,
    "address_zip": null,
    "address_zip_check": null,
    "brand": "Visa",
    "country": "US",
    "customer": null,
    "cvc_check": null,
    "dynamic_last4": null,
    "exp_month": 3,
    "exp_year": 2024,
    "fingerprint": "mToisGZ01V71BCos",
    "funding": "credit",
    "last4": "4242",
    "metadata": {},
    "name": null,
    "tokenization_method": null
  },
  "source_transfer": null,
  "statement_descriptor": null,
  "statement_descriptor_suffix": null,
  "status": "succeeded",
  "transfer_data": null,
  "transfer_group": null
}

Search charges 
Ask about this section

Copy for LLM


View as Markdown

Search for charges you’ve previously created using Stripe’s Search Query Language. Don’t use search in read-after-write flows where strict consistency is necessary. Under normal operating conditions, data is searchable in less than a minute. Occasionally, propagation of new or updated data can be up to an hour behind during outages. Search functionality is not available to merchants in India.
	•	Parameters  query string Required  The search query string. See search query language and the list of supported query fields for charges.    limit integer  A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 10.    page string  A cursor for pagination across multiple pages of results. Don’t include this parameter on the first call. Use the next_page value returned in a previous response to request subsequent results. 
Returns

A dictionary with a data property that contains an array of up to limit charges. If no objects match the query, the resulting array will be empty. See the related guide on expanding properties in lists.
GET 
/v1/charges/search
Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET




const stripe = require('stripe')('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');

const charges = await stripe.charges.search({
  query: 'amount>999 AND metadata[\'order_id\']:\'6735\'',
});
RESPONSE
{
  "object": "search_result",
  "url": "/v1/charges/search",
  "has_more": false,
  "data": [
    {
      "id": "ch_3MrVHGLkdIwHu7ix3VP9P8qH",
      "object": "charge",
      "amount": 1000,
      "amount_captured": 1000,
      "amount_refunded": 0,
      "application": null,
      "application_fee": null,
      "application_fee_amount": null,
      "balance_transaction": "txn_3MrVHGLkdIwHu7ix33fWgyw1",
      "billing_details": {
        "address": {
          "city": null,
          "country": null,
          "line1": null,
          "line2": null,
          "postal_code": null,
          "state": null
        },
        "email": null,
        "name": null,
        "phone": null
      },
      "calculated_statement_descriptor": "Stripe",
      "captured": true,
      "created": 1680220390,
      "currency": "usd",
      "customer": null,
      "description": null,
      "disputed": false,
      "failure_balance_transaction": null,
      "failure_code": null,
      "failure_message": null,
      "fraud_details": {},
      "livemode": false,
      "metadata": {
        "order_id": "6735"
      },
      "on_behalf_of": null,
      "outcome": {
        "network_status": "approved_by_network",
        "reason": null,
        "risk_level": "normal",
        "risk_score": 28,
        "seller_message": "Payment complete.",
        "type": "authorized"
      },
      "paid": true,
      "payment_intent": null,
      "payment_method": "card_1MrVHGLkdIwHu7ixi93aSYS2",
      "payment_method_details": {
        "card": {
          "brand": "visa",
          "checks": {
            "address_line1_check": null,
            "address_postal_code_check": null,
            "cvc_check": null
          },
          "country": "US",
          "exp_month": 3,
          "exp_year": 2024,
          "fingerprint": "mToisGZ01V71BCos",
          "funding": "credit",
          "installments": null,
          "last4": "4242",
          "mandate": null,
          "network": "visa",
          "network_token": {
            "used": false
          },
          "three_d_secure": null,
          "wallet": null
        },
        "type": "card"
      },
      "receipt_email": null,
      "receipt_number": null,
      "receipt_url": "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTTJKVGtMa2RJd0h1N2l4KOfBmKEGMgY6smXCZpA6LBZYyAwZTSPplSpB7KwcptJiKqQfv6nQiL75NRCxebjOIiABDK3odR96wc2r",
      "refunded": false,
      "review": null,
      "shipping": null,
      "source_transfer": null,
      "statement_descriptor": null,
      "statement_descriptor_suffix": null,
      "status": "succeeded",
      "transfer_data": null,
      "transfer_group": null
    }
  ]
}

Customers 
Ask about this section

Copy for LLM


View as Markdown

This object represents a customer of your business. Use it to create recurring charges, save payment and contact information, and track payments that belong to the same customer.
ENDPOINTS
		POST /v1/customers POST /v1/customers/:id GET /v1/customers/:id GET /v1/customers DELETE /v1/customers/:id GET /v1/customers/search
SHOW


Customer Session 
Ask about this section

Copy for LLM


View as Markdown

A Customer Session allows you to grant Stripe’s frontend SDKs (like Stripe.js) client-side access control over a Customer.
Related guides: Customer Session with the Payment Element, Customer Session with the Pricing Table, Customer Session with the Buy Button.
ENDPOINTS
		POST /v1/customer_sessions
SHOW


Disputes 
Ask about this section

Copy for LLM


View as Markdown

A dispute occurs when a customer questions your charge with their card issuer. When this happens, you have the opportunity to respond to the dispute with evidence that shows that the charge is legitimate.
Related guide: Disputes and fraud
ENDPOINTS
		POST /v1/disputes/:id GET /v1/disputes/:id GET /v1/disputes POST /v1/disputes/:id/close
SHOW


Events 
Ask about this section

Copy for LLM


View as Markdown

Events are our way of letting you know when something interesting happens in your account. When an interesting event occurs, we create a new Event object. For example, when a charge succeeds, we create a charge.succeeded event, and when an invoice payment attempt fails, we create an invoice.payment_failed event. Certain API requests might create multiple events. For example, if you create a new subscription for a customer, you receive both a customer.subscription.created event and a charge.succeeded event.
Events occur when the state of another API resource changes. The event’s data field embeds the resource’s state at the time of the change. For example, a charge.succeeded event contains a charge, and an invoice.payment_failed event contains an invoice.
As with other API resources, you can use endpoints to retrieve an individual event or a list of events from the API. We also have a separate webhooks system for sending the Event objects directly to an endpoint on your server. You can manage webhooks in your account settings. Learn how to listen for events so that your integration can automatically trigger reactions.
When using Connect, you can also receive event notifications that occur in connected accounts. For these events, there’s an additional account attribute in the received Event object.
We only guarantee access to events through the Retrieve Event API for 30 days.
ENDPOINTS
		GET /v1/events/:id GET /v1/events
SHOW


Events v2
Ask about this section

Copy for LLM


View as Markdown

Events are generated to keep you informed of activity in your business account. APIs in the /v2 namespace generate thin events which have small, unversioned payloads that include a reference to the ID of the object that has changed. The Events v2 API returns these new thin events. Retrieve the event object for additional data about the event. Use the related object ID in the event payload to fetch the API resource of the object associated with the event. Comparatively, events generated by most API v1 include a versioned snapshot of an API object in their payload.
Learn more about calling API v2 endpoints. 
ENDPOINTS
		GET /v2/core/events/:id GET /v2/core/events POST /v2/core/event_destinations/:id/ping
SHOW


Event Destinations v2
Ask about this section

Copy for LLM


View as Markdown

Set up an event destination to receive events from Stripe across multiple destination types, including webhook endpoints and Amazon EventBridge. Event destinations support receiving thin events and snapshot events.
Learn more about calling API v2 endpoints. 
ENDPOINTS
		POST /v2/core/event_destinations POST /v2/core/event_destinations/:id GET /v2/core/event_destinations/:id GET /v2/core/event_destinations DELETE /v2/core/event_destinations/:id POST /v2/core/event_destinations/:id/disable POST /v2/core/event_destinations/:id/enable
SHOW


Files 
Ask about this section

Copy for LLM


View as Markdown

This object represents files hosted on Stripe’s servers. You can upload files with the create file request (for example, when uploading dispute evidence). Stripe also creates files independently (for example, the results of a Sigma scheduled query).
Related guide: File upload guide
ENDPOINTS
		POST /v1/files GET /v1/files/:id GET /v1/files
SHOW


File Links 
Ask about this section

Copy for LLM


View as Markdown

To share the contents of a File object with non-Stripe users, you can create a FileLink. FileLinks contain a URL that you can use to retrieve the contents of the file without authentication.
ENDPOINTS
		POST /v1/file_links POST /v1/file_links/:id GET /v1/file_links/:id GET /v1/file_links
SHOW


FX Quotes 
Ask about this section

Copy for LLM


View as Markdown

The FX Quotes API provides three functions:
	•	View Stripe’s current exchange rate for any given currency pair.
	•	Extend quoted rates for a 1-hour period or a 24-hour period, minimzing uncertainty from FX fluctuations.
	•	Preview the FX fees Stripe will charge on your FX transaction, allowing you to anticipate specific settlement amounts before payment costs.
View the docs
ENDPOINTS
		POST /v1/fx_quotes GET /v1/fx_quotes/:id GET /v1/fx_quotes
SHOW


Mandates 
Ask about this section

Copy for LLM


View as Markdown

A Mandate is a record of the permission that your customer gives you to debit their payment method.
ENDPOINTS
		GET /v1/mandates/:id
SHOW


Payment Intents 
Ask about this section

Copy for LLM


View as Markdown

A PaymentIntent guides you through the process of collecting a payment from your customer. We recommend that you create exactly one PaymentIntent for each order or customer session in your system. You can reference the PaymentIntent later to see the history of payment attempts for a particular session.
A PaymentIntent transitions through multiple statuses throughout its lifetime as it interfaces with Stripe.js to perform authentication flows and ultimately creates at most one successful charge.
Related guide: Payment Intents API
ENDPOINTS
		POST /v1/payment_intents POST /v1/payment_intents/:id GET /v1/payment_intents/:id GET /v1/payment_intents POST /v1/payment_intents/:id/cancel POST /v1/payment_intents/:id/capture POST /v1/payment_intents/:id/confirm POST /v1/payment_intents/:id/increment_authorization POST /v1/payment_intents/:id/apply_customer_balance GET /v1/payment_intents/search POST /v1/payment_intents/:id/verify_microdeposits
SHOW


Setup Intents 
Ask about this section

Copy for LLM


View as Markdown

A SetupIntent guides you through the process of setting up and saving a customer’s payment credentials for future payments. For example, you can use a SetupIntent to set up and save your customer’s card without immediately collecting a payment. Later, you can use PaymentIntents to drive the payment flow.
Create a SetupIntent when you’re ready to collect your customer’s payment credentials. Don’t maintain long-lived, unconfirmed SetupIntents because they might not be valid. The SetupIntent transitions through multiple statuses as it guides you through the setup process.
Successful SetupIntents result in payment credentials that are optimized for future payments. For example, cardholders in certain regions might need to be run through Strong Customer Authentication during payment method collection to streamline later off-session payments. If you use the SetupIntent with a Customer, it automatically attaches the resulting payment method to that Customer after successful setup. We recommend using SetupIntents or setup_future_usage on PaymentIntents to save payment methods to prevent saving invalid or unoptimized payment methods.
By using SetupIntents, you can reduce friction for your customers, even as regulations change over time.
Related guide: Setup Intents API
ENDPOINTS
		POST /v1/setup_intents POST /v1/setup_intents/:id GET /v1/setup_intents/:id GET /v1/setup_intents POST /v1/setup_intents/:id/cancel POST /v1/setup_intents/:id/confirm POST /v1/setup_intents/:id/verify_microdeposits
SHOW


Setup Attempts 
Ask about this section

Copy for LLM


View as Markdown

A SetupAttempt describes one attempted confirmation of a SetupIntent, whether that confirmation is successful or unsuccessful. You can use SetupAttempts to inspect details of a specific attempt at setting up a payment method using a SetupIntent.
ENDPOINTS
		GET /v1/setup_attempts
SHOW


Payouts 
Ask about this section

Copy for LLM


View as Markdown

A Payout object is created when you receive funds from Stripe, or when you initiate a payout to either a bank account or debit card of a connected Stripe account. You can retrieve individual payouts, and list all payouts. Payouts are made on varying schedules, depending on your country and industry.
Related guide: Receiving payouts
ENDPOINTS
		POST /v1/payouts POST /v1/payouts/:id GET /v1/payouts/:id GET /v1/payouts POST /v1/payouts/:id/cancel POST /v1/payouts/:id/reverse
SHOW


Refunds 
Ask about this section

Copy for LLM


View as Markdown

Refund objects allow you to refund a previously created charge that isn’t refunded yet. Funds are refunded to the credit or debit card that’s initially charged.
Related guide: Refunds
ENDPOINTS
		POST /v1/refunds POST /v1/refunds/:id GET /v1/refunds/:id GET /v1/refunds POST /v1/refunds/:id/cancel
SHOW


Confirmation Token 
Ask about this section

Copy for LLM


View as Markdown

ConfirmationTokens help transport client side data collected by Stripe JS over to your server for confirming a PaymentIntent or SetupIntent. If the confirmation is successful, values present on the ConfirmationToken are written onto the Intent.
To learn more about how to use ConfirmationToken, visit the related guides:
	•	Finalize payments on the server
	•	Build two-step confirmation.
ENDPOINTS
		GET /v1/confirmation_tokens/:id POST /v1/test_helpers/confirmation_tokens
SHOW


Tokens 
Ask about this section

Copy for LLM


View as Markdown

Tokenization is the process Stripe uses to collect sensitive card or bank account details, or personally identifiable information (PII), directly from your customers in a secure manner. A token representing this information is returned to your server to use. Use our recommended payments integrations to perform this process on the client-side. This guarantees that no sensitive card data touches your server, and allows your integration to operate in a PCI-compliant way.
If you can’t use client-side tokenization, you can also create tokens using the API with either your publishable or secret API key. If your integration uses this method, you’re responsible for any PCI compliance that it might require, and you must keep your secret API key safe. Unlike with client-side tokenization, your customer’s information isn’t sent directly to Stripe, so we can’t determine how it’s handled or stored.
You can’t store or use tokens more than once. To store card or bank account information for later use, create Customer objects or External accounts. Radar, our integrated solution for automatic fraud protection, performs best with integrations that use client-side tokenization.
ENDPOINTS
		POST /v1/tokens POST /v1/tokens POST /v1/tokens POST /v1/tokens POST /v1/tokens POST /v1/tokens GET /v1/tokens/:id
SHOW


Payment Methods 
Ask about this section

Copy for LLM


View as Markdown

PaymentMethod objects represent your customer’s payment instruments. You can use them with PaymentIntents to collect payments or save them to Customer objects to store instrument details for future payments.
Related guides: Payment Methods and More Payment Scenarios.
ENDPOINTS
		POST /v1/payment_methods POST /v1/payment_methods/:id GET /v1/customers/:id/payment_methods/:id GET /v1/payment_methods/:id GET /v1/customers/:id/payment_methods GET /v1/payment_methods POST /v1/payment_methods/:id/attach POST /v1/payment_methods/:id/detach
SHOW


Payment Method Configurations 
Ask about this section

Copy for LLM


View as Markdown

PaymentMethodConfigurations control which payment methods are displayed to your customers when you don’t explicitly specify payment method types. You can have multiple configurations with different sets of payment methods for different scenarios.
There are two types of PaymentMethodConfigurations. Which is used depends on the charge type:
Direct configurations apply to payments created on your account, including Connect destination charges, Connect separate charges and transfers, and payments not involving Connect.
Child configurations apply to payments created on your connected accounts using direct charges, and charges with the on_behalf_of parameter.
Child configurations have a parent that sets default values and controls which settings connected accounts may override. You can specify a parent ID at payment time, and Stripe will automatically resolve the connected account’s associated child configuration. Parent configurations are managed in the dashboard and are not available in this API.
Related guides:
	•	Payment Method Configurations API
	•	Multiple configurations on dynamic payment methods
	•	Multiple configurations for your Connect accounts
ENDPOINTS
		POST /v1/payment_method_configurations POST /v1/payment_method_configurations/:id GET /v1/payment_method_configurations/:id GET /v1/payment_method_configurations
SHOW


Payment Method Domains 
Ask about this section

Copy for LLM


View as Markdown

A payment method domain represents a web domain that you have registered with Stripe. Stripe Elements use registered payment method domains to control where certain payment methods are shown.
Related guide: Payment method domains.
ENDPOINTS
		POST /v1/payment_method_domains POST /v1/payment_method_domains/:id GET /v1/payment_method_domains/:id GET /v1/payment_method_domains POST /v1/payment_method_domains/:id/validate
SHOW


Bank Accounts 
Ask about this section

Copy for LLM


View as Markdown

These bank accounts are payment methods on Customer objects.
On the other hand External Accounts are transfer destinations on Account objects for connected accounts. They can be bank accounts or debit cards as well, and are documented in the links above.
Related guide: Bank debits and transfers
ENDPOINTS
		POST /v1/customers/:id/sources POST /v1/customers/:id/sources/:id GET /v1/customers/:id/bank_accounts/:id GET /v1/customers/:id/bank_accounts DELETE /v1/customers/:id/sources/:id POST /v1/customers/:id/sources/:id/verify
SHOW


Cash Balance 
Ask about this section

Copy for LLM


View as Markdown

A customer’s Cash balance represents real funds. Customers can add funds to their cash balance by sending a bank transfer. These funds can be used for payment and can eventually be paid out to your bank account.
ENDPOINTS
		POST /v1/customers/:id/cash_balance GET /v1/customers/:id/cash_balance
SHOW


Cash Balance Transaction 
Ask about this section

Copy for LLM


View as Markdown

Customers with certain payments enabled have a cash balance, representing funds that were paid by the customer to a merchant, but have not yet been allocated to a payment. Cash Balance Transactions represent when funds are moved into or out of this balance. This includes funding by the customer, allocation to payments, and refunds to the customer.
ENDPOINTS
		POST /v1/customers/:id/funding_instructions GET /v1/customers/:id/cash_balance_transactions/:id GET /v1/customers/:id/cash_balance_transactions POST /v1/test_helpers/customers/:id/fund_cash_balance
SHOW


Cards 
Ask about this section

Copy for LLM


View as Markdown

You can store multiple cards on a customer in order to charge the customer later. You can also store multiple debit cards on a recipient in order to transfer to those cards later.
Related guide: Card payments with Sources
ENDPOINTS
		POST /v1/customers/:id/sources POST /v1/customers/:id/sources/:id GET /v1/customers/:id/cards/:id GET /v1/customers/:id/cards DELETE /v1/customers/:id/sources/:id
SHOW


Sources 
Deprecated
Ask about this section

Copy for LLM


View as Markdown

Source objects allow you to accept a variety of payment methods. They represent a customer’s payment instrument, and can be used with the Stripe API just like a Card object: once chargeable, they can be charged, or can be attached to customers.
Stripe doesn’t recommend using the deprecated Sources API. We recommend that you adopt the PaymentMethods API. This newer API provides access to our latest features and payment method types.
Related guides: Sources API and Sources & Customers.
ENDPOINTS
		POST /v1/sources POST /v1/sources/:id GET /v1/sources/:id POST /v1/customers/:id/sources DELETE /v1/customers/:id/sources/:id
SHOW


Products 
Ask about this section

Copy for LLM


View as Markdown

Products describe the specific goods or services you offer to your customers. For example, you might offer a Standard and Premium version of your goods or service; each version would be a separate Product. They can be used in conjunction with Prices to configure pricing in Payment Links, Checkout, and Subscriptions.
Related guides: Set up a subscription, share a Payment Link, accept payments with Checkout, and more about Products and Prices
ENDPOINTS
		POST /v1/products POST /v1/products/:id GET /v1/products/:id GET /v1/products DELETE /v1/products/:id GET /v1/products/search
SHOW


Prices 
Ask about this section

Copy for LLM


View as Markdown

Prices define the unit cost, currency, and (optional) billing cycle for both recurring and one-time purchases of products. Products help you track inventory or provisioning, and prices help you track payment terms. Different physical goods or levels of service should be represented by products, and pricing options should be represented by prices. This approach lets you change prices without having to change your provisioning scheme.
For example, you might have a single “gold” product that has prices for $10/month, $100/year, and €9 once.
Related guides: Set up a subscription, create an invoice, and more about products and prices.
ENDPOINTS
		POST /v1/prices POST /v1/prices/:id GET /v1/prices/:id GET /v1/prices GET /v1/prices/search
SHOW


Coupons 
Ask about this section

Copy for LLM


View as Markdown

A coupon contains information about a percent-off or amount-off discount you might want to apply to a customer. Coupons may be applied to subscriptions, invoices, checkout sessions, quotes, and more. Coupons do not work with conventional one-off charges or payment intents.
ENDPOINTS
		POST /v1/coupons POST /v1/coupons/:id GET /v1/coupons/:id GET /v1/coupons DELETE /v1/coupons/:id
SHOW


Promotion Code 
Ask about this section

Copy for LLM


View as Markdown

A Promotion Code represents a customer-redeemable code for a coupon. It can be used to create multiple codes for a single coupon.
ENDPOINTS
		POST /v1/promotion_codes POST /v1/promotion_codes/:id GET /v1/promotion_codes/:id GET /v1/promotion_codes
SHOW


Discounts 
Ask about this section

Copy for LLM


View as Markdown

A discount represents the actual application of a coupon or promotion code. It contains information about when the discount began, when it will end, and what it is applied to.
Related guide: Applying discounts to subscriptions
ENDPOINTS
		DELETE /v1/customers/:id/discount DELETE /v1/subscriptions/:id/discount
SHOW


Tax Code 
Ask about this section

Copy for LLM


View as Markdown

Tax codes classify goods and services for tax purposes.
ENDPOINTS
		GET /v1/tax_codes/:id GET /v1/tax_codes
SHOW


Tax Rate 
Ask about this section

Copy for LLM


View as Markdown

Tax rates can be applied to invoices, subscriptions and Checkout Sessions to collect tax.
Related guide: Tax rates
ENDPOINTS
		POST /v1/tax_rates POST /v1/tax_rates/:id GET /v1/tax_rates/:id GET /v1/tax_rates
SHOW


Shipping Rates 
Ask about this section

Copy for LLM


View as Markdown

Shipping rates describe the price of shipping presented to your customers and applied to a purchase. For more information, see Charge for shipping.
ENDPOINTS
		POST /v1/shipping_rates POST /v1/shipping_rates/:id GET /v1/shipping_rates/:id GET /v1/shipping_rates
SHOW


Checkout Sessions 
Ask about this section

Copy for LLM


View as Markdown

A Checkout Session represents your customer’s session as they pay for one-time purchases or subscriptions through Checkout or Payment Links. We recommend creating a new Session each time your customer attempts to pay.
Once payment is successful, the Checkout Session will contain a reference to the Customer, and either the successful PaymentIntent or an active Subscription.
You can create a Checkout Session on your server and redirect to its URL to begin Checkout.
Related guide: Checkout quickstart
ENDPOINTS
		POST /v1/checkout/sessions POST /v1/checkout/sessions/:id GET /v1/checkout/sessions/:id GET /v1/checkout/sessions/:id/line_items GET /v1/checkout/sessions POST /v1/checkout/sessions/:id/expire
SHOW


Payment Link 
Ask about this section

Copy for LLM


View as Markdown

A payment link is a shareable URL that will take your customers to a hosted payment page. A payment link can be shared and used multiple times.
When a customer opens a payment link it will open a new checkout session to render the payment page. You can use checkout session events to track payments through payment links.
Related guide: Payment Links API
ENDPOINTS
		POST /v1/payment_links POST /v1/payment_links/:id GET /v1/payment_links/:id/line_items GET /v1/payment_links/:id GET /v1/payment_links
SHOW


Credit Note 
Ask about this section

Copy for LLM


View as Markdown

Issue a credit note to adjust an invoice’s amount after the invoice is finalized.
Related guide: Credit notes
ENDPOINTS
		POST /v1/credit_notes POST /v1/credit_notes/:id GET /v1/credit_notes/:id/lines GET /v1/credit_notes/preview/lines GET /v1/credit_notes/:id GET /v1/credit_notes GET /v1/credit_notes/preview POST /v1/credit_notes/:id/void
SHOW


Customer Balance Transaction 
Ask about this section

Copy for LLM


View as Markdown

Each customer has a Balance value, which denotes a debit or credit that’s automatically applied to their next invoice upon finalization. You may modify the value directly by using the update customer API, or by creating a Customer Balance Transaction, which increments or decrements the customer’s balance by the specified amount.
Related guide: Customer balance
ENDPOINTS
		POST /v1/customers/:id/balance_transactions POST /v1/customers/:id/balance_transactions/:id GET /v1/customers/:id/balance_transactions/:id GET /v1/customers/:id/balance_transactions
SHOW


Customer Portal Session 
Ask about this section

Copy for LLM


View as Markdown

The Billing customer portal is a Stripe-hosted UI for subscription and billing management.
A portal configuration describes the functionality and features that you want to provide to your customers through the portal.
A portal session describes the instantiation of the customer portal for a particular customer. By visiting the session’s URL, the customer can manage their subscriptions and billing details. For security reasons, sessions are short-lived and will expire if the customer does not visit the URL. Create sessions on-demand when customers intend to manage their subscriptions and billing details.
Related guide: Customer management
ENDPOINTS
		POST /v1/billing_portal/sessions
SHOW


Customer Portal Configuration 
Ask about this section

Copy for LLM


View as Markdown

A portal configuration describes the functionality and behavior of a portal session.
ENDPOINTS
		POST /v1/billing_portal/configurations POST /v1/billing_portal/configurations/:id GET /v1/billing_portal/configurations/:id GET /v1/billing_portal/configurations
SHOW


Invoices 
Ask about this section

Copy for LLM


View as Markdown

Invoices are statements of amounts owed by a customer, and are either generated one-off, or generated periodically from a subscription.
They contain invoice items, and proration adjustments that may be caused by subscription upgrades/downgrades (if necessary).
If your invoice is configured to be billed through automatic charges, Stripe automatically finalizes your invoice and attempts payment. Note that finalizing the invoice, when automatic, does not happen immediately as the invoice is created. Stripe waits until one hour after the last webhook was successfully sent (or the last webhook timed out after failing). If you (and the platforms you may have connected to) have no webhooks configured, Stripe waits one hour after creation to finalize the invoice.
If your invoice is configured to be billed by sending an email, then based on your email settings, Stripe will email the invoice to your customer and await payment. These emails can contain a link to a hosted page to pay the invoice.
Stripe applies any customer credit on the account before determining the amount due for the invoice (i.e., the amount that will be actually charged). If the amount due for the invoice is less than Stripe’s minimum allowed charge per currency, the invoice is automatically marked paid, and we add the amount due to the customer’s credit balance which is applied to the next invoice.
More details on the customer’s credit balance are here.
Related guide: Send invoices to customers
ENDPOINTS
		POST /v1/invoices POST /v1/invoices/create_preview POST /v1/invoices/:id GET /v1/invoices/:id GET /v1/invoices DELETE /v1/invoices/:id POST /v1/invoices/:id/attach_payment POST /v1/invoices/:id/finalize POST /v1/invoices/:id/mark_uncollectible POST /v1/invoices/:id/pay GET /v1/invoices/search POST /v1/invoices/:id/send POST /v1/invoices/:id/void
SHOW


Invoice Items 
Ask about this section

Copy for LLM


View as Markdown

Invoice Items represent the component lines of an invoice. When you create an invoice item with an invoice field, it is attached to the specified invoice and included as an invoice line item within invoice.lines.
Invoice Items can be created before you are ready to actually send the invoice. This can be particularly useful when combined with a subscription. Sometimes you want to add a charge or credit to a customer, but actually charge or credit the customer’s card only at the end of a regular billing cycle. This is useful for combining several charges (to minimize per-transaction fees), or for having Stripe tabulate your usage-based billing totals.
Related guides: Integrate with the Invoicing API, Subscription Invoices.
ENDPOINTS
		POST /v1/invoiceitems POST /v1/invoiceitems/:id GET /v1/invoiceitems/:id GET /v1/invoiceitems DELETE /v1/invoiceitems/:id
SHOW


Invoice Line Item 
Ask about this section

Copy for LLM


View as Markdown

Invoice Line Items represent the individual lines within an invoice and only exist within the context of an invoice.
Each line item is backed by either an invoice item or a subscription item.
ENDPOINTS
		POST /v1/invoices/:id/lines/:id GET /v1/invoices/:id/lines POST /v1/invoices/:id/add_lines POST /v1/invoices/:id/remove_lines POST /v1/invoices/:id/update_lines
SHOW


Invoice Payment 
Ask about this section

Copy for LLM


View as Markdown

Invoice Payments represent payments made against invoices. Invoice Payments can be accessed in two ways:
	1	By expanding the payments field on the Invoice resource.
	2	By using the Invoice Payment retrieve and list endpoints.
Invoice Payments include the mapping between payment objects, such as Payment Intent, and Invoices. This resource and its endpoints allows you to easily track if a payment is associated with a specific invoice and monitor the allocation details of the payments.
ENDPOINTS
		GET /v1/invoice_payments/:id GET /v1/invoice_payments
SHOW


Invoice Rendering Templates 
Ask about this section

Copy for LLM


View as Markdown

Invoice Rendering Templates are used to configure how invoices are rendered on surfaces like the PDF. Invoice Rendering Templates can be created from within the Dashboard, and they can be used over the API when creating invoices.
ENDPOINTS
		GET /v1/invoice_rendering_templates/:id GET /v1/invoice_rendering_templates POST /v1/invoice_rendering_templates/:id/archive POST /v1/invoice_rendering_templates/:id/unarchive
SHOW


Alerts 
Ask about this section

Copy for LLM


View as Markdown

A billing alert is a resource that notifies you when a certain usage threshold on a meter is crossed. For example, you might create a billing alert to notify you when a certain user made 100 API requests.
ENDPOINTS
		POST /v1/billing/alerts GET /v1/billing/alerts/:id GET /v1/billing/alerts POST /v1/billing/alerts/:id/activate POST /v1/billing/alerts/:id/archive POST /v1/billing/alerts/:id/deactivate
SHOW


Meters 
Ask about this section

Copy for LLM


View as Markdown

Meters specify how to aggregate meter events over a billing period. Meter events represent the actions that customers take in your system. Meters attach to prices and form the basis of the bill.
Related guide: Usage based billing
ENDPOINTS
		POST /v1/billing/meters POST /v1/billing/meters/:id GET /v1/billing/meters/:id GET /v1/billing/meters POST /v1/billing/meters/:id/deactivate POST /v1/billing/meters/:id/reactivate
SHOW


Meter Events 
Ask about this section

Copy for LLM


View as Markdown

Meter events represent actions that customers take in your system. You can use meter events to bill a customer based on their usage. Meter events are associated with billing meters, which define both the contents of the event’s payload and how to aggregate those events.
ENDPOINTS
		POST /v1/billing/meter_events
SHOW


Meter Events v2
Ask about this section

Copy for LLM


View as Markdown

Meter events are used to report customer usage of your product or service. Meter events are associated with billing meters, which define the shape of the event’s payload and how those events are aggregated. Meter events are processed asynchronously, so they may not be immediately reflected in aggregates or on upcoming invoices.
Learn more about calling API v2 endpoints. 
ENDPOINTS
		POST /v2/billing/meter_events
SHOW


Meter Event Adjustment 
Ask about this section

Copy for LLM


View as Markdown

A billing meter event adjustment is a resource that allows you to cancel a meter event. For example, you might create a billing meter event adjustment to cancel a meter event that was created in error or attached to the wrong customer.
ENDPOINTS
		POST /v1/billing/meter_event_adjustments
SHOW


Meter Event Adjustments v2
Ask about this section

Copy for LLM


View as Markdown

A billing meter event adjustment is a resource that allows you to cancel a meter event. For example, you might create a billing meter event adjustment to cancel a meter event that was created in error or attached to the wrong customer.
Learn more about calling API v2 endpoints. 
ENDPOINTS
		POST /v2/billing/meter_event_adjustments
SHOW


Meter Event Streams v2
Ask about this section

Copy for LLM


View as Markdown

You can send a higher-throughput of meter events using meter event streams. For this flow, you must first create a meter event session, which will provide you with a session token. You can then create meter events through the meter event stream endpoint, using the session token for authentication. The session tokens are short-lived and you will need to create a new meter event session when the token expires.
Learn more about calling API v2 endpoints. 
ENDPOINTS
		POST /v2/billing/meter_event_session POST /v2/billing/meter_event_stream
SHOW


Meter Event Summary 
Ask about this section

Copy for LLM


View as Markdown

A billing meter event summary represents an aggregated view of a customer’s billing meter events within a specified timeframe. It indicates how much usage was accrued by a customer for that period.
Note: Meters events are aggregated asynchronously so the meter event summaries provide an eventually consistent view of the reported usage.
ENDPOINTS
		GET /v1/billing/meters/:id/event_summaries
SHOW


Credit Grant 
Ask about this section

Copy for LLM


View as Markdown

A credit grant is an API resource that documents the allocation of some billing credits to a customer.
Related guide: Billing credits
ENDPOINTS
		POST /v1/billing/credit_grants POST /v1/billing/credit_grants/:id GET /v1/billing/credit_grants/:id GET /v1/billing/credit_grants POST /v1/billing/credit_grants/:id/expire POST /v1/billing/credit_grants/:id/void
SHOW


Credit Balance Summary 
Ask about this section

Copy for LLM


View as Markdown

Indicates the billing credit balance for billing credits granted to a customer.
ENDPOINTS
		GET /v1/billing/credit_balance_summary
SHOW


Credit Balance Transaction 
Ask about this section

Copy for LLM


View as Markdown

A credit balance transaction is a resource representing a transaction (either a credit or a debit) against an existing credit grant.
ENDPOINTS
		GET /v1/billing/credit_balance_transactions/:id GET /v1/billing/credit_balance_transactions
SHOW


Plans 
Ask about this section

Copy for LLM


View as Markdown

You can now model subscriptions more flexibly using the Prices API. It replaces the Plans API and is backwards compatible to simplify your migration.
Plans define the base price, currency, and billing cycle for recurring purchases of products. Products help you track inventory or provisioning, and plans help you track pricing. Different physical goods or levels of service should be represented by products, and pricing options should be represented by plans. This approach lets you change prices without having to change your provisioning scheme.
For example, you might have a single “gold” product that has plans for $10/month, $100/year, €9/month, and €90/year.
Related guides: Set up a subscription and more about products and prices.
ENDPOINTS
		POST /v1/plans POST /v1/plans/:id GET /v1/plans/:id GET /v1/plans DELETE /v1/plans/:id
SHOW


Quote 
Ask about this section

Copy for LLM


View as Markdown

A Quote is a way to model prices that you’d like to provide to a customer. Once accepted, it will automatically create an invoice, subscription or subscription schedule.
ENDPOINTS
		POST /v1/quotes POST /v1/quotes/:id GET /v1/quotes/:id/line_items GET /v1/quotes/:id/computed_upfront_line_items GET /v1/quotes/:id GET /v1/quotes POST /v1/quotes/:id/accept POST /v1/quotes/:id/cancel GET /v1/quotes/:id/pdf POST /v1/quotes/:id/finalize
SHOW


Subscriptions 
Ask about this section

Copy for LLM


View as Markdown

Subscriptions allow you to charge a customer on a recurring basis.
Related guide: Creating subscriptions
ENDPOINTS
		POST /v1/subscriptions POST /v1/subscriptions/:id GET /v1/subscriptions/:id GET /v1/subscriptions DELETE /v1/subscriptions/:id POST /v1/subscriptions/:id/migrate POST /v1/subscriptions/:id/resume GET /v1/subscriptions/search
SHOW


Subscription Items 
Ask about this section

Copy for LLM


View as Markdown

Subscription items allow you to create customer subscriptions with more than one plan, making it easy to represent complex billing relationships.
ENDPOINTS
		POST /v1/subscription_items POST /v1/subscription_items/:id GET /v1/subscription_items/:id GET /v1/subscription_items DELETE /v1/subscription_items/:id
SHOW


Subscription Schedule 
Ask about this section

Copy for LLM


View as Markdown

A subscription schedule allows you to create and manage the lifecycle of a subscription by predefining expected changes.
Related guide: Subscription schedules
ENDPOINTS
		POST /v1/subscription_schedules POST /v1/subscription_schedules/:id GET /v1/subscription_schedules/:id GET /v1/subscription_schedules POST /v1/subscription_schedules/:id/cancel POST /v1/subscription_schedules/:id/release
SHOW


Tax IDs 
Ask about this section

Copy for LLM


View as Markdown

You can add one or multiple tax IDs to a customer or account. Customer and account tax IDs get displayed on related invoices and credit notes.
Related guides: Customer tax identification numbers, Account tax IDs
ENDPOINTS
		POST /v1/customers/:id/tax_ids POST /v1/tax_ids GET /v1/customers/:id/tax_ids/:id GET /v1/tax_ids/:id GET /v1/customers/:id/tax_ids GET /v1/tax_ids DELETE /v1/customers/:id/tax_ids/:id DELETE /v1/tax_ids/:id
SHOW


Test Clocks 
Test helper
Ask about this section

Copy for LLM


View as Markdown

A test clock enables deterministic control over objects in testmode. With a test clock, you can create objects at a frozen time in the past or future, and advance to a specific future time to observe webhooks and state changes. After the clock advances, you can either validate the current state of your scenario (and test your assumptions), change the current state of your scenario (and test more complex scenarios), or keep advancing forward in time.
ENDPOINTS
		POST /v1/test_helpers/test_clocks GET /v1/test_helpers/test_clocks/:id GET /v1/test_helpers/test_clocks DELETE /v1/test_helpers/test_clocks/:id POST /v1/test_helpers/test_clocks/:id/advance
SHOW


Financing Offer 
Preview
Ask about this section

Copy for LLM


View as Markdown

This is an object representing an offer of financing from Stripe Capital to a Connect subaccount.
ENDPOINTS
		GET /v1/capital/financing_offers/:id GET /v1/capital/financing_offers POST /v1/capital/financing_offers/:id/mark_delivered
SHOW


Financing Summary 
Preview
Ask about this section

Copy for LLM


View as Markdown

A financing object describes an account’s current financing state. Used by Connect platforms to read the state of Capital offered to their connected accounts.
ENDPOINTS
		GET /v1/capital/financing_summary
SHOW


Accounts 
Ask about this section

Copy for LLM


View as Markdown

This is an object representing a Stripe account. You can retrieve it to see properties on the account like its current requirements or if the account is enabled to make live charges or receive payouts.
For accounts where controller.requirement_collection is application, which includes Custom accounts, the properties below are always returned.
For accounts where controller.requirement_collection is stripe, which includes Standard and Express accounts, some properties are only returned until you create an Account Link or Account Session to start Connect Onboarding. Learn about the differences between accounts.
ENDPOINTS
		POST /v1/accounts POST /v1/accounts/:id GET /v1/accounts/:id GET /v1/accounts DELETE /v1/accounts/:id POST /v1/accounts/:id/reject
SHOW


Login Links 
Ask about this section

Copy for LLM


View as Markdown

Login Links are single-use URLs that takes an Express account to the login page for their Stripe dashboard. A Login Link differs from an Account Link in that it takes the user directly to their Express dashboard for the specified account
ENDPOINTS
		POST /v1/accounts/:id/login_links
SHOW


Account Links 
Ask about this section

Copy for LLM


View as Markdown

Account Links are the means by which a Connect platform grants a connected account permission to access Stripe-hosted applications, such as Connect Onboarding.
Related guide: Connect Onboarding
ENDPOINTS
		POST /v1/account_links
SHOW


Account Session 
Ask about this section

Copy for LLM


View as Markdown

An AccountSession allows a Connect platform to grant access to a connected account in Connect embedded components.
We recommend that you create an AccountSession each time you need to display an embedded component to your user. Do not save AccountSessions to your database as they expire relatively quickly, and cannot be used more than once.
Related guide: Connect embedded components
ENDPOINTS
		POST /v1/account_sessions
SHOW


Application Fees 
Ask about this section

Copy for LLM


View as Markdown

When you collect a transaction fee on top of a charge made for your user (using Connect), an Application Fee object is created in your account. You can list, retrieve, and refund application fees.
Related guide: Collecting application fees
ENDPOINTS
		GET /v1/application_fees/:id GET /v1/application_fees
SHOW


Application Fee Refunds 
Ask about this section

Copy for LLM


View as Markdown

Application Fee Refund objects allow you to refund an application fee that has previously been created but not yet refunded. Funds will be refunded to the Stripe account from which the fee was originally collected.
Related guide: Refunding application fees
ENDPOINTS
		POST /v1/application_fees/:id/refunds POST /v1/application_fees/:id/refunds/:id GET /v1/application_fees/:id/refunds/:id GET /v1/application_fees/:id/refunds
SHOW


Capabilities 
Ask about this section

Copy for LLM


View as Markdown

This is an object representing a capability for a Stripe account.
Related guide: Account capabilities
ENDPOINTS
		POST /v1/accounts/:id/capabilities/:id GET /v1/accounts/:id/capabilities/:id GET /v1/accounts/:id/capabilities
SHOW


Country Specs 
Ask about this section

Copy for LLM


View as Markdown

Stripe needs to collect certain pieces of information about each account created. These requirements can differ depending on the account’s country. The Country Specs API makes these rules available to your integration.
You can also view the information from this API call as an online guide.
ENDPOINTS
		GET /v1/country_specs/:id GET /v1/country_specs
SHOW


External Bank Accounts 
Ask about this section

Copy for LLM


View as Markdown

External bank accounts are financial accounts associated with a Stripe platform’s connected accounts for the purpose of transferring funds to or from the connected account’s Stripe balance.
ENDPOINTS
		POST /v1/accounts/:id/external_accounts POST /v1/accounts/:id/external_accounts/:id GET /v1/accounts/:id/external_accounts/:id GET /v1/accounts/:id/external_accounts DELETE /v1/accounts/:id/external_accounts/:id
SHOW


External Account Cards 
Ask about this section

Copy for LLM


View as Markdown

External account cards are debit cards associated with a Stripe platform’s connected accounts for the purpose of transferring funds to or from the connected accounts Stripe balance.
This API is only available for users enrolled in the public preview for Accounts v2 on Stripe Connect. If you are not in this preview, please use the Accounts v1 API to manage your connected accounts’ external bank accounts instead.
ENDPOINTS
		POST /v1/accounts/:id/external_accounts POST /v1/accounts/:id/external_accounts/:id GET /v1/accounts/:id/external_accounts/:id GET /v1/accounts/:id/external_accounts DELETE /v1/accounts/:id/external_accounts/:id
SHOW


Person 
Ask about this section

Copy for LLM


View as Markdown

This is an object representing a person associated with a Stripe account.
A platform can only access a subset of data in a person for an account where account.controller.requirement_collection is stripe, which includes Standard and Express accounts, after creating an Account Link or Account Session to start Connect onboarding.
See the Standard onboarding or Express onboarding documentation for information about prefilling information and account onboarding steps. Learn more about handling identity verification with the API.
ENDPOINTS
		POST /v1/accounts/:id/persons POST /v1/accounts/:id/persons/:id GET /v1/accounts/:id/persons/:id GET /v1/accounts/:id/persons DELETE /v1/accounts/:id/persons/:id
SHOW


Top-ups 
Ask about this section

Copy for LLM


View as Markdown

To top up your Stripe balance, you create a top-up object. You can retrieve individual top-ups, as well as list all top-ups. Top-ups are identified by a unique, random ID.
Related guide: Topping up your platform account
ENDPOINTS
		POST /v1/topups POST /v1/topups/:id GET /v1/topups/:id GET /v1/topups POST /v1/topups/:id/cancel
SHOW


Transfers 
Ask about this section

Copy for LLM


View as Markdown

A Transfer object is created when you move funds between Stripe accounts as part of Connect.
Before April 6, 2017, transfers also represented movement of funds from a Stripe account to a card or bank account. This behavior has since been split out into a Payout object, with corresponding payout endpoints. For more information, read about the transfer/payout split.
Related guide: Creating separate charges and transfers
ENDPOINTS
		POST /v1/transfers POST /v1/transfers/:id GET /v1/transfers/:id GET /v1/transfers
SHOW


Transfer Reversals 
Ask about this section

Copy for LLM


View as Markdown

Stripe Connect platforms can reverse transfers made to a connected account, either entirely or partially, and can also specify whether to refund any related application fees. Transfer reversals add to the platform’s balance and subtract from the destination account’s balance.
Reversing a transfer that was made for a destination charge is allowed only up to the amount of the charge. It is possible to reverse a transfer_group transfer only if the destination account has enough balance to cover the reversal.
Related guide: Reverse transfers
ENDPOINTS
		POST /v1/transfers/:id/reversals POST /v1/transfers/:id/reversals/:id GET /v1/transfers/:id/reversals/:id GET /v1/transfers/:id/reversals
SHOW


Secrets 
Ask about this section

Copy for LLM


View as Markdown

Secret Store is an API that allows Stripe Apps developers to securely persist secrets for use by UI Extensions and app backends.
The primary resource in Secret Store is a secret. Other apps can’t view secrets created by an app. Additionally, secrets are scoped to provide further permission control.
All Dashboard users and the app backend share account scoped secrets. Use the account scope for secrets that don’t change per-user, like a third-party API key.
A user scoped secret is accessible by the app backend and one specific Dashboard user. Use the user scope for per-user secrets like per-user OAuth tokens, where different users might have different permissions.
Related guide: Store data between page reloads
ENDPOINTS
		GET /v1/apps/secrets POST /v1/apps/secrets/delete GET /v1/apps/secrets/find POST /v1/apps/secrets
SHOW


Early Fraud Warning 
Ask about this section

Copy for LLM


View as Markdown

An early fraud warning indicates that the card issuer has notified us that a charge may be fraudulent.
Related guide: Early fraud warnings
ENDPOINTS
		GET /v1/radar/early_fraud_warnings/:id GET /v1/radar/early_fraud_warnings
SHOW


Reviews 
Ask about this section

Copy for LLM


View as Markdown

Reviews can be used to supplement automated fraud detection with human expertise.
Learn more about Radar and reviewing payments here.
ENDPOINTS
		GET /v1/reviews/:id GET /v1/reviews POST /v1/reviews/:id/approve
SHOW


Value Lists 
Ask about this section

Copy for LLM


View as Markdown

Value lists allow you to group values together which can then be referenced in rules.
Related guide: Default Stripe lists
ENDPOINTS
		POST /v1/radar/value_lists POST /v1/radar/value_lists/:id GET /v1/radar/value_lists/:id GET /v1/radar/value_lists DELETE /v1/radar/value_lists/:id
SHOW


Value List Items 
Ask about this section

Copy for LLM


View as Markdown

Value list items allow you to add specific values to a given Radar value list, which can then be used in rules.
Related guide: Managing list items
ENDPOINTS
		POST /v1/radar/value_list_items GET /v1/radar/value_list_items/:id GET /v1/radar/value_list_items DELETE /v1/radar/value_list_items/:id
SHOW


Authorizations 
Ask about this section

Copy for LLM


View as Markdown

When an issued card is used to make a purchase, an Issuing Authorization object is created. Authorizations must be approved for the purchase to be completed successfully.
Related guide: Issued card authorizations
ENDPOINTS
		POST /v1/issuing/authorizations/:id GET /v1/issuing/authorizations/:id GET /v1/issuing/authorizations POST /v1/issuing/authorizations/:id/approve POST /v1/issuing/authorizations/:id/decline POST /v1/test_helpers/issuing/authorizations POST /v1/test_helpers/issuing/authorizations/:id/capture POST /v1/test_helpers/issuing/authorizations/:id/expire POST /v1/test_helpers/issuing/authorizations/:id/finalize_amount POST /v1/test_helpers/issuing/authorizations/:id/increment POST /v1/test_helpers/issuing/authorizations/:id/fraud_challenges/respond POST /v1/test_helpers/issuing/authorizations/:id/reverse
SHOW


Cardholders 
Ask about this section

Copy for LLM


View as Markdown

An Issuing Cardholder object represents an individual or business entity who is issued cards.
Related guide: How to create a cardholder
ENDPOINTS
		POST /v1/issuing/cardholders POST /v1/issuing/cardholders/:id GET /v1/issuing/cardholders/:id GET /v1/issuing/cardholders
SHOW


Cards 
Ask about this section

Copy for LLM


View as Markdown

You can create physical or virtual cards that are issued to cardholders.
ENDPOINTS
		POST /v1/issuing/cards POST /v1/issuing/cards/:id GET /v1/issuing/cards/:id GET /v1/issuing/cards POST /v1/test_helpers/issuing/cards/:id/shipping/deliver POST /v1/test_helpers/issuing/cards/:id/shipping/fail POST /v1/test_helpers/issuing/cards/:id/shipping/return POST /v1/test_helpers/issuing/cards/:id/shipping/ship POST /v1/test_helpers/issuing/cards/:id/shipping/submit
SHOW


Disputes 
Ask about this section

Copy for LLM


View as Markdown

As a card issuer, you can dispute transactions that the cardholder does not recognize, suspects to be fraudulent, or has other issues with.
Related guide: Issuing disputes
ENDPOINTS
		POST /v1/issuing/disputes POST /v1/issuing/disputes/:id GET /v1/issuing/disputes/:id GET /v1/issuing/disputes POST /v1/issuing/disputes/:id/submit
SHOW


Funding Instructions 
Ask about this section

Copy for LLM


View as Markdown

Funding Instructions contain reusable bank account and routing information. Push funds to these addresses via bank transfer to top up Issuing Balances.
ENDPOINTS
		POST /v1/issuing/funding_instructions GET /v1/issuing/funding_instructions POST /v1/test_helpers/issuing/fund_balance
SHOW


Personalization Designs 
Ask about this section

Copy for LLM


View as Markdown

A Personalization Design is a logical grouping of a Physical Bundle, card logo, and carrier text that represents a product line.
ENDPOINTS
		POST /v1/issuing/personalization_designs POST /v1/issuing/personalization_designs/:id GET /v1/issuing/personalization_designs/:id GET /v1/issuing/personalization_designs POST /v1/test_helpers/issuing/personalization_designs/:id/activate POST /v1/test_helpers/issuing/personalization_designs/:id/deactivate POST /v1/test_helpers/issuing/personalization_designs/:id/reject
SHOW


Physical Bundles 
Ask about this section

Copy for LLM


View as Markdown

A Physical Bundle represents the bundle of physical items - card stock, carrier letter, and envelope - that is shipped to a cardholder when you create a physical card.
ENDPOINTS
		GET /v1/issuing/physical_bundles/:id GET /v1/issuing/physical_bundles
SHOW


Tokens 
Preview
Ask about this section

Copy for LLM


View as Markdown

An issuing token object is created when an issued card is added to a digital wallet. As a card issuer, you can view and manage these tokens through Stripe.
ENDPOINTS
		POST /v1/issuing/tokens/:id GET /v1/issuing/tokens/:id GET /v1/issuing/tokens
SHOW


Transactions 
Ask about this section

Copy for LLM


View as Markdown

Any use of an issued card that results in funds entering or leaving your Stripe account, such as a completed purchase or refund, is represented by an Issuing Transaction object.
Related guide: Issued card transactions
Was this section helpful?
Yes
No
ENDPOINTS
		POST /v1/issuing/transactions/:id GET /v1/issuing/transactions/:id GET /v1/issuing/transactions POST /v1/test_helpers/issuing/transactions/create_force_capture POST /v1/test_helpers/issuing/transactions/create_unlinked_refund POST /v1/test_helpers/issuing/transactions/:id/refund

The Transaction object 
Ask about this section

Copy for LLM


View as Markdown

	•	Attributes  id string  Unique identifier for the object.    amount integer  The transaction amount, which will be reflected in your balance. This amount is in your currency and in the smallest currency unit.    authorization nullable string Expandable  The Authorization object that led to this transaction.    card string Expandable  The card used to make this transaction.    cardholder nullable string Expandable  The cardholder to whom this transaction belongs.    currency enum  Three-letter ISO currency code, in lowercase. Must be a supported currency.    metadata object  Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format.    type enum  The nature of the transaction. Possible enum values
	•	capture Funds were captured by the acquirer. amount will be negative because funds are moving out of your balance. Not all captures will be linked to an authorization, as acquirers can force capture in some cases. 
	•	refund An acquirer initiated a refund. This transaction might not be linked to an original capture, for example credits are original transactions. amount will be positive for refunds and negative for refund reversals (very rare). 
	•	 
More attributes
Expand all
	•	   object string     amount_details nullable object     balance_transaction nullable string Expandable     created timestamp     dispute nullable string Expandable     livemode boolean     merchant_amount integer     merchant_currency enum     merchant_data object     network_data nullable object     purchase_details nullable object Expandable     token nullable string Preview feature Expandable     wallet nullable enum 
THE TRANSACTION OBJECT
{
  "id": "ipi_1MzFN1K8F4fqH0lBmFq8CjbU",
  "object": "issuing.transaction",
  "amount": -100,
  "amount_details": {
    "atm_fee": null
  },
  "authorization": "iauth_1MzFMzK8F4fqH0lBc9VdaZUp",
  "balance_transaction": "txn_1MzFN1K8F4fqH0lBQPtqUmJN",
  "card": "ic_1MzFMxK8F4fqH0lBjIUITRYi",
  "cardholder": "ich_1MzFMxK8F4fqH0lBXnFW0ROG",
  "created": 1682065867,
  "currency": "usd",
  "dispute": null,
  "livemode": false,
  "merchant_amount": -100,
  "merchant_currency": "usd",
  "merchant_data": {
    "category": "computer_software_stores",
    "category_code": "5734",
    "city": "SAN FRANCISCO",
    "country": "US",
    "name": "WWWW.BROWSEBUG.BIZ",
    "network_id": "1234567890",
    "postal_code": "94103",
    "state": "CA"
  },
  "metadata": {},
  "type": "capture",
  "wallet": null
}

Update a transaction 
Ask about this section

Copy for LLM


View as Markdown

Updates the specified Issuing Transaction object by setting the values of the parameters passed. Any parameters not provided will be left unchanged.
	•	Parameters  metadata object  Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format. Individual keys can be unset by posting an empty value to them. All keys can be unset by posting an empty value to metadata. 
Returns

Returns an updated Issuing Transaction object if a valid identifier was provided.
POST 
/v1/issuing/transactions/:id
Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET




const stripe = require('stripe')('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');

const transaction = await stripe.issuing.transactions.update(
  'ipi_1MzFN1K8F4fqH0lBmFq8CjbU',
  {
    metadata: {
      order_id: '6735',
    },
  }
);
RESPONSE
{
  "id": "ipi_1MzFN1K8F4fqH0lBmFq8CjbU",
  "object": "issuing.transaction",
  "amount": -100,
  "amount_details": {
    "atm_fee": null
  },
  "authorization": "iauth_1MzFMzK8F4fqH0lBc9VdaZUp",
  "balance_transaction": "txn_1MzFN1K8F4fqH0lBQPtqUmJN",
  "card": "ic_1MzFMxK8F4fqH0lBjIUITRYi",
  "cardholder": "ich_1MzFMxK8F4fqH0lBXnFW0ROG",
  "created": 1682065867,
  "currency": "usd",
  "dispute": null,
  "livemode": false,
  "merchant_amount": -100,
  "merchant_currency": "usd",
  "merchant_data": {
    "category": "computer_software_stores",
    "category_code": "5734",
    "city": "SAN FRANCISCO",
    "country": "US",
    "name": "WWWW.BROWSEBUG.BIZ",
    "network_id": "1234567890",
    "postal_code": "94103",
    "state": "CA"
  },
  "metadata": {
    "order_id": "6735"
  },
  "type": "capture",
  "wallet": null
}

Retrieve a transaction 
Ask about this section

Copy for LLM


View as Markdown

Retrieves an Issuing Transaction object.
Parameters

No parameters.
Returns

Returns an Issuing Transaction object if a valid identifier was provided.
GET 
/v1/issuing/transactions/:id
Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET




const stripe = require('stripe')('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');

const transaction = await stripe.issuing.transactions.retrieve(
  'ipi_1MzFN1K8F4fqH0lBmFq8CjbU'
);
RESPONSE
{
  "id": "ipi_1MzFN1K8F4fqH0lBmFq8CjbU",
  "object": "issuing.transaction",
  "amount": -100,
  "amount_details": {
    "atm_fee": null
  },
  "authorization": "iauth_1MzFMzK8F4fqH0lBc9VdaZUp",
  "balance_transaction": "txn_1MzFN1K8F4fqH0lBQPtqUmJN",
  "card": "ic_1MzFMxK8F4fqH0lBjIUITRYi",
  "cardholder": "ich_1MzFMxK8F4fqH0lBXnFW0ROG",
  "created": 1682065867,
  "currency": "usd",
  "dispute": null,
  "livemode": false,
  "merchant_amount": -100,
  "merchant_currency": "usd",
  "merchant_data": {
    "category": "computer_software_stores",
    "category_code": "5734",
    "city": "SAN FRANCISCO",
    "country": "US",
    "name": "WWWW.BROWSEBUG.BIZ",
    "network_id": "1234567890",
    "postal_code": "94103",
    "state": "CA"
  },
  "metadata": {},
  "type": "capture",
  "wallet": null
}

List all transactions 
Ask about this section

Copy for LLM


View as Markdown

Returns a list of Issuing Transaction objects. The objects are sorted in descending order by creation date, with the most recently created object appearing first.
	•	Parameters  card string  Only return transactions that belong to the given card.    cardholder string  Only return transactions that belong to the given cardholder. 
More parameters
Expand all
	•	   created object     ending_before string     limit integer     starting_after string     type enum 
Returns

A object with a data property that contains an array of up to limit transactions, starting after transaction starting_after. Each entry in the array is a separate Issuing Transaction object. If no more transactions are available, the resulting array will be empty.
GET 
/v1/issuing/transactions
Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET




const stripe = require('stripe')('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');

const transactions = await stripe.issuing.transactions.list({
  limit: 3,
});
RESPONSE
{
  "object": "list",
  "url": "/v1/issuing/transactions",
  "has_more": false,
  "data": [
    {
      "id": "ipi_1MzFN1K8F4fqH0lBmFq8CjbU",
      "object": "issuing.transaction",
      "amount": -100,
      "amount_details": {
        "atm_fee": null
      },
      "authorization": "iauth_1MzFMzK8F4fqH0lBc9VdaZUp",
      "balance_transaction": "txn_1MzFN1K8F4fqH0lBQPtqUmJN",
      "card": "ic_1MzFMxK8F4fqH0lBjIUITRYi",
      "cardholder": "ich_1MzFMxK8F4fqH0lBXnFW0ROG",
      "created": 1682065867,
      "currency": "usd",
      "dispute": null,
      "livemode": false,
      "merchant_amount": -100,
      "merchant_currency": "usd",
      "merchant_data": {
        "category": "computer_software_stores",
        "category_code": "5734",
        "city": "SAN FRANCISCO",
        "country": "US",
        "name": "WWWW.BROWSEBUG.BIZ",
        "network_id": "1234567890",
        "postal_code": "94103",
        "state": "CA"
      },
      "metadata": {},
      "type": "capture",
      "wallet": null
    }
  ]
}

Create a test-mode force capture 
Test helper
Ask about this section

Copy for LLM


View as Markdown

Allows the user to capture an arbitrary amount, also known as a forced capture.
	•	Parameters  amount integer Required  The total amount to attempt to capture. This amount is in the provided currency, or defaults to the cards currency, and in the smallest currency unit.    card string Required  Card associated with this transaction.    currency enum  The currency of the capture. If not provided, defaults to the currency of the card. Three-letter ISO currency code, in lowercase. Must be a supported currency. 
More parameters
Expand all
	•	   merchant_data object     purchase_details object 
Returns

A Transaction object
POST 
/v1/test_helpers/issuing/transactions/create_force_capture
Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET




const stripe = require('stripe')('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');

const transaction = await stripe
  .testHelpers
  .issuing
  .transactions
  .createForceCapture({
  amount: 1000,
  card: 'ic_1Gswa82eZvKYlo2CP2jveFil',
});
RESPONSE
{
  "id": "ipi_1GswaK2eZvKYlo2Co7wmNJhD",
  "object": "issuing.transaction",
  "amount": -1000,
  "amount_details": {
    "atm_fee": null,
    "cashback_amount": null
  },
  "authorization": "iauth_1GswaJ2eZvKYlo2Ct9mFMJ4S",
  "balance_transaction": "txn_1GswaK2eZvKYlo2CJAFFIuHg",
  "card": "ic_1Gswa82eZvKYlo2CP2jveFil",
  "cardholder": "ich_1Gswa82eZvKYlo2CvobneLSo",
  "created": 1591905672,
  "currency": "usd",
  "dispute": null,
  "livemode": false,
  "merchant_amount": -1000,
  "merchant_currency": "usd",
  "merchant_data": {
    "category": "computer_software_stores",
    "category_code": "5734",
    "city": "SAN FRANCISCO",
    "country": "US",
    "name": "STRIPE.COM",
    "network_id": "1234567890",
    "postal_code": "94103",
    "state": "CA",
    "terminal_id": null
  },
  "metadata": {
    "order_id": "6735"
  },
  "redaction": null,
  "type": "capture",
  "wallet": null
}

Create a test-mode unlinked refund 
Test helper
Ask about this section

Copy for LLM


View as Markdown

Allows the user to refund an arbitrary amount, also known as a unlinked refund.
	•	Parameters  amount integer Required  The total amount to attempt to refund. This amount is in the provided currency, or defaults to the cards currency, and in the smallest currency unit.    card string Required  Card associated with this unlinked refund transaction.    currency enum  The currency of the unlinked refund. If not provided, defaults to the currency of the card. Three-letter ISO currency code, in lowercase. Must be a supported currency. 
More parameters
Expand all
	•	   merchant_data object     purchase_details object 
Returns

A Transaction object
POST 
/v1/test_helpers/issuing/transactions/create_unlinked_refund
Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET




const stripe = require('stripe')('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');

const transaction = await stripe
  .testHelpers
  .issuing
  .transactions
  .createUnlinkedRefund({
  amount: 1000,
  card: 'ic_1Gswa82eZvKYlo2CP2jveFil',
});
RESPONSE
{
  "id": "ipi_1GswaK2eZvKYlo2Co7wmNJhD",
  "object": "issuing.transaction",
  "amount": -1000,
  "amount_details": {
    "atm_fee": null,
    "cashback_amount": null
  },
  "authorization": "iauth_1GswaJ2eZvKYlo2Ct9mFMJ4S",
  "balance_transaction": "txn_1GswaK2eZvKYlo2CJAFFIuHg",
  "card": "ic_1Gswa82eZvKYlo2CP2jveFil",
  "cardholder": "ich_1Gswa82eZvKYlo2CvobneLSo",
  "created": 1591905672,
  "currency": "usd",
  "dispute": null,
  "livemode": false,
  "merchant_amount": -1000,
  "merchant_currency": "usd",
  "merchant_data": {
    "category": "computer_software_stores",
    "category_code": "5734",
    "city": "SAN FRANCISCO",
    "country": "US",
    "name": "STRIPE.COM",
    "network_id": "1234567890",
    "postal_code": "94103",
    "state": "CA",
    "terminal_id": null
  },
  "metadata": {
    "order_id": "6735"
  },
  "redaction": null,
  "type": "capture",
  "wallet": null
}

Refund a test-mode transaction 
Test helper
Ask about this section

Copy for LLM


View as Markdown

Refund a test-mode Transaction.
	•	Parameters  refund_amount integer  The total amount to attempt to refund. This amount is in the provided currency, or defaults to the cards currency, and in the smallest currency unit. 
Returns

A Transaction object. This will be the Transaction object of type capture referenced in the request’s URL, not the new Transaction object of type refund that will be created as a side-effect of this API call. To find the newly created Transaction object, you can use the Retrieve an authorization API, whose response will contain a list of related Transaction IDs, including the newly created Transaction of type refund. You can also use the List all transactions API, or listen for the issuing_transaction.created webhook event to retrieve the newly created Transaction of type refund.
POST 
/v1/test_helpers/issuing/transactions/:id/refund
Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET




const stripe = require('stripe')('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');

const transaction = await stripe.testHelpers.issuing.transactions.refund(
  'ipi_1GswaK2eZvKYlo2Co7wmNJhD',
  {
    refund_amount: 1000,
  }
);
RESPONSE
{
  "id": "ipi_1GswaK2eZvKYlo2Co7wmNJhD",
  "object": "issuing.transaction",
  "amount": -1000,
  "amount_details": {
    "atm_fee": null,
    "cashback_amount": null
  },
  "authorization": "iauth_1GswaJ2eZvKYlo2Ct9mFMJ4S",
  "balance_transaction": "txn_1GswaK2eZvKYlo2CJAFFIuHg",
  "card": "ic_1Gswa82eZvKYlo2CP2jveFil",
  "cardholder": "ich_1Gswa82eZvKYlo2CvobneLSo",
  "created": 1591905672,
  "currency": "usd",
  "dispute": null,
  "livemode": false,
  "merchant_amount": -1000,
  "merchant_currency": "usd",
  "merchant_data": {
    "category": "computer_software_stores",
    "category_code": "5734",
    "city": "SAN FRANCISCO",
    "country": "US",
    "name": "STRIPE.COM",
    "network_id": "1234567890",
    "postal_code": "94103",
    "state": "CA",
    "terminal_id": null
  },
  "metadata": {
    "order_id": "6735"
  },
  "redaction": null,
  "type": "capture",
  "wallet": null
}

Connection Token 
Ask about this section

Copy for LLM


View as Markdown

A Connection Token is used by the Stripe Terminal SDK to connect to a reader.
Related guide: Fleet management
ENDPOINTS
		POST /v1/terminal/connection_tokens
SHOW


Location 
Ask about this section

Copy for LLM


View as Markdown

A Location represents a grouping of readers.
Related guide: Fleet management
ENDPOINTS
		POST /v1/terminal/locations POST /v1/terminal/locations/:id GET /v1/terminal/locations/:id GET /v1/terminal/locations DELETE /v1/terminal/locations/:id
SHOW


Reader 
Ask about this section

Copy for LLM


View as Markdown

A Reader represents a physical device for accepting payment details.
Related guide: Connecting to a reader
ENDPOINTS
		POST /v1/terminal/readers POST /v1/terminal/readers/:id GET /v1/terminal/readers/:id GET /v1/terminal/readers DELETE /v1/terminal/readers/:id POST /v1/terminal/readers/:id/cancel_action POST /v1/terminal/readers/:id/collect_inputs POST /v1/terminal/readers/:id/confirm_payment_intent POST /v1/terminal/readers/:id/collect_payment_method POST /v1/terminal/readers/:id/process_payment_intent POST /v1/terminal/readers/:id/process_setup_intent POST /v1/terminal/readers/:id/refund_payment POST /v1/terminal/readers/:id/set_reader_display POST /v1/test_helpers/terminal/readers/:id/present_payment_method
SHOW


Terminal Hardware Order 
Preview
Ask about this section

Copy for LLM


View as Markdown

A TerminalHardwareOrder represents an order for Terminal hardware, containing information such as the price, shipping information and the items ordered.
ENDPOINTS
		POST /v1/terminal/hardware_orders GET /v1/terminal/hardware_orders/:id GET /v1/terminal/hardware_orders POST /v1/terminal/hardware_orders/:id/cancel GET /v1/terminal/hardware_orders/preview POST /v1/test_helpers/terminal/hardware_orders/:id/mark_ready_to_ship POST /v1/test_helpers/terminal/hardware_orders/:id/deliver POST /v1/test_helpers/terminal/hardware_orders/:id/ship POST /v1/test_helpers/terminal/hardware_orders/:id/mark_undeliverable
SHOW


Terminal Hardware Product 
Preview
Ask about this section

Copy for LLM


View as Markdown

A TerminalHardwareProduct is a category of hardware devices that are generally similar, but may have variations depending on the country it’s shipped to.
TerminalHardwareSKUs represent variations within the same Product (for example, a country specific device). For example, WisePOS E is a TerminalHardwareProduct and a WisePOS E - US and WisePOS E - UK are TerminalHardwareSKUs.
ENDPOINTS
		GET /v1/terminal/hardware_products/:id GET /v1/terminal/hardware_products
SHOW


Terminal Hardware SKU 
Preview
Ask about this section

Copy for LLM


View as Markdown

A TerminalHardwareSKU represents a SKU for Terminal hardware. A SKU is a representation of a product available for purchase, containing information such as the name, price, and images.
ENDPOINTS
		GET /v1/terminal/hardware_skus/:id GET /v1/terminal/hardware_skus
SHOW


Terminal Hardware Shipping Method 
Preview
Ask about this section

Copy for LLM


View as Markdown

A TerminalHardwareShipping represents a Shipping Method for Terminal hardware. A Shipping Method is a country-specific representation of a way to ship hardware, containing information such as the country, name, and expected delivery date.
ENDPOINTS
		GET /v1/terminal/hardware_shipping_methods/:id GET /v1/terminal/hardware_shipping_methods
SHOW


Configuration 
Ask about this section

Copy for LLM


View as Markdown

A Configurations object represents how features should be configured for terminal readers. For information about how to use it, see the Terminal configurations documentation.
ENDPOINTS
		POST /v1/terminal/configurations POST /v1/terminal/configurations/:id GET /v1/terminal/configurations/:id GET /v1/terminal/configurations DELETE /v1/terminal/configurations/:id
SHOW


Financial Accounts 
Ask about this section

Copy for LLM


View as Markdown

Stripe Treasury provides users with a container for money called a FinancialAccount that is separate from their Payments balance. FinancialAccounts serve as the source and destination of Treasury’s money movement APIs.
ENDPOINTS
		POST /v1/treasury/financial_accounts POST /v1/treasury/financial_accounts/:id GET /v1/treasury/financial_accounts/:id GET /v1/treasury/financial_accounts
SHOW


Financial Account Features 
Ask about this section

Copy for LLM


View as Markdown

Encodes whether a FinancialAccount has access to a particular Feature, with a status enum and associated status_details. Stripe or the platform can control Features via the requested field.
ENDPOINTS
		POST /v1/treasury/financial_accounts/:id/features GET /v1/treasury/financial_accounts/:id/features
SHOW


Transactions 
Ask about this section

Copy for LLM


View as Markdown

Transactions represent changes to a FinancialAccount’s balance.
ENDPOINTS
		GET /v1/treasury/transactions/:id GET /v1/treasury/transactions
SHOW


Transaction Entries 
Ask about this section

Copy for LLM


View as Markdown

TransactionEntries represent individual units of money movements within a single Transaction.
ENDPOINTS
		GET /v1/treasury/transaction_entries/:id GET /v1/treasury/transaction_entries
SHOW


Outbound Transfers 
Ask about this section

Copy for LLM


View as Markdown

Use OutboundTransfers to transfer funds from a FinancialAccount to a PaymentMethod belonging to the same entity. To send funds to a different party, use OutboundPayments instead. You can send funds over ACH rails or through a domestic wire transfer to a user’s own external bank account.
Simulate OutboundTransfer state changes with the /v1/test_helpers/treasury/outbound_transfers endpoints. These methods can only be called on test mode objects.
Related guide: Moving money with Treasury using OutboundTransfer objects
ENDPOINTS
		POST /v1/treasury/outbound_transfers GET /v1/treasury/outbound_transfers/:id GET /v1/treasury/outbound_transfers POST /v1/treasury/outbound_transfers/:id/cancel POST /v1/test_helpers/treasury/outbound_transfers/:id/fail POST /v1/test_helpers/treasury/outbound_transfers/:id/post POST /v1/test_helpers/treasury/outbound_transfers/:id/return POST /v1/test_helpers/treasury/outbound_transfers/:id
SHOW


Outbound Payments 
Ask about this section

Copy for LLM


View as Markdown

Use OutboundPayments to send funds to another party’s external bank account or FinancialAccount. To send money to an account belonging to the same user, use an OutboundTransfer.
Simulate OutboundPayment state changes with the /v1/test_helpers/treasury/outbound_payments endpoints. These methods can only be called on test mode objects.
Related guide: Moving money with Treasury using OutboundPayment objects
ENDPOINTS
		POST /v1/treasury/outbound_payments GET /v1/treasury/outbound_payments/:id GET /v1/treasury/outbound_payments POST /v1/treasury/outbound_payments/:id/cancel POST /v1/test_helpers/treasury/outbound_payments/:id/fail POST /v1/test_helpers/treasury/outbound_payments/:id/post POST /v1/test_helpers/treasury/outbound_payments/:id/return POST /v1/test_helpers/treasury/outbound_payments/:id
SHOW


Inbound Transfers 
Ask about this section

Copy for LLM


View as Markdown

Use InboundTransfers to add funds to your FinancialAccount via a PaymentMethod that is owned by you. The funds will be transferred via an ACH debit.
Related guide: Moving money with Treasury using InboundTransfer objects
ENDPOINTS
		POST /v1/treasury/inbound_transfers GET /v1/treasury/inbound_transfers/:id GET /v1/treasury/inbound_transfers POST /v1/treasury/inbound_transfers/:id/cancel POST /v1/test_helpers/treasury/inbound_transfers/:id/fail POST /v1/test_helpers/treasury/inbound_transfers/:id/return POST /v1/test_helpers/treasury/inbound_transfers/:id/succeed
SHOW


Received Credits 
Ask about this section

Copy for LLM


View as Markdown

ReceivedCredits represent funds sent to a FinancialAccount (for example, via ACH or wire). These money movements are not initiated from the FinancialAccount.
ENDPOINTS
		GET /v1/treasury/received_credits/:id GET /v1/treasury/received_credits POST /v1/test_helpers/treasury/received_credits
SHOW


Received Debits 
Ask about this section

Copy for LLM


View as Markdown

ReceivedDebits represent funds pulled from a FinancialAccount. These are not initiated from the FinancialAccount.
ENDPOINTS
		GET /v1/treasury/received_debits/:id GET /v1/treasury/received_debits POST /v1/test_helpers/treasury/received_debits
SHOW


Credit Reversals 
Ask about this section

Copy for LLM


View as Markdown

You can reverse some ReceivedCredits depending on their network and source flow. Reversing a ReceivedCredit leads to the creation of a new object known as a CreditReversal.
ENDPOINTS
		POST /v1/treasury/credit_reversals GET /v1/treasury/credit_reversals/:id GET /v1/treasury/credit_reversals
SHOW


Debit Reversals 
Ask about this section

Copy for LLM


View as Markdown

You can reverse some ReceivedDebits depending on their network and source flow. Reversing a ReceivedDebit leads to the creation of a new object known as a DebitReversal.
ENDPOINTS
		POST /v1/treasury/debit_reversals GET /v1/treasury/debit_reversals/:id GET /v1/treasury/debit_reversals
SHOW


Feature 
Ask about this section

Copy for LLM


View as Markdown

A feature represents a monetizable ability or functionality in your system. Features can be assigned to products, and when those products are purchased, Stripe will create an entitlement to the feature for the purchasing customer.
ENDPOINTS
		POST /v1/entitlements/features GET /v1/entitlements/features POST /v1/entitlements/features/:id
SHOW


Product Feature 
Ask about this section

Copy for LLM


View as Markdown

A product_feature represents an attachment between a feature and a product. When a product is purchased that has a feature attached, Stripe will create an entitlement to the feature for the purchasing customer.
ENDPOINTS
		GET /v1/products/:id/features POST /v1/products/:id/features DELETE /v1/products/:id/features/:id
SHOW


Active Entitlement 
Ask about this section

Copy for LLM


View as Markdown

An active entitlement describes access to a feature for a customer.
ENDPOINTS
		GET /v1/entitlements/active_entitlements/:id GET /v1/entitlements/active_entitlements
SHOW


Scheduled Queries 
Ask about this section

Copy for LLM


View as Markdown

If you have scheduled a Sigma query, you’ll receive a sigma.scheduled_query_run.created webhook each time the query runs. The webhook contains a ScheduledQueryRun object, which you can use to retrieve the query results.
ENDPOINTS
		GET /v1/sigma/scheduled_query_runs/:id GET /v1/sigma/scheduled_query_runs
SHOW


Query Run 
Ask about this section

Copy for LLM


View as Markdown

Represents an ad-hoc execution of a Sigma query via the API
ENDPOINTS
		POST /v1/sigma/query_runs GET /v1/sigma/query_runs/:id
SHOW


Report Runs 
Ask about this section

Copy for LLM


View as Markdown

The Report Run object represents an instance of a report type generated with specific run parameters. Once the object is created, Stripe begins processing the report. When the report has finished running, it will give you a reference to a file where you can retrieve your results. For an overview, see API Access to Reports.
Note that certain report types can only be run based on your live-mode data (not test-mode data), and will error when queried without a live-mode API key.
ENDPOINTS
		POST /v1/reporting/report_runs GET /v1/reporting/report_runs/:id GET /v1/reporting/report_runs
SHOW


Report Types 
Ask about this section

Copy for LLM


View as Markdown

The Report Type resource corresponds to a particular type of report, such as the “Activity summary” or “Itemized payouts” reports. These objects are identified by an ID belonging to a set of enumerated values. See API Access to Reports documentation for those Report Type IDs, along with required and optional parameters.
Note that certain report types can only be run based on your live-mode data (not test-mode data), and will error when queried without a live-mode API key.
ENDPOINTS
		GET /v1/reporting/report_types/:id GET /v1/reporting/report_types
SHOW


Accounts 
Ask about this section

Copy for LLM


View as Markdown

A Financial Connections Account represents an account that exists outside of Stripe, to which you have been granted some degree of access.
ENDPOINTS
		GET /v1/financial_connections/accounts/:id GET /v1/financial_connections/accounts POST /v1/financial_connections/accounts/:id/disconnect POST /v1/financial_connections/accounts/:id/refresh POST /v1/financial_connections/accounts/:id/subscribe POST /v1/financial_connections/accounts/:id/unsubscribe
SHOW


Account Owner 
Ask about this section

Copy for LLM


View as Markdown

Describes an owner of an account.
ENDPOINTS
		GET /v1/financial_connections/accounts/:id/owners
SHOW


Session 
Ask about this section

Copy for LLM


View as Markdown

A Financial Connections Session is the secure way to programmatically launch the client-side Stripe.js modal that lets your users link their accounts.
ENDPOINTS
		POST /v1/financial_connections/sessions GET /v1/financial_connections/sessions/:id
SHOW


Transactions 
Ask about this section

Copy for LLM


View as Markdown

A Transaction represents a real transaction that affects a Financial Connections Account balance.
ENDPOINTS
		GET /v1/financial_connections/transactions/:id GET /v1/financial_connections/transactions
SHOW


Tax Calculations 
Ask about this section

Copy for LLM


View as Markdown

A Tax Calculation allows you to calculate the tax to collect from your customer.
Related guide: Calculate tax in your custom payment flow
ENDPOINTS
		POST /v1/tax/calculations GET /v1/tax/calculations/:id/line_items GET /v1/tax/calculations/:id
SHOW


Tax Registrations 
Ask about this section

Copy for LLM


View as Markdown

A Tax Registration lets us know that your business is registered to collect tax on payments within a region, enabling you to automatically collect tax.
Stripe doesn’t register on your behalf with the relevant authorities when you create a Tax Registration object. For more information on how to register to collect tax, see our guide.
Related guide: Using the Registrations API
ENDPOINTS
		POST /v1/tax/registrations POST /v1/tax/registrations/:id GET /v1/tax/registrations/:id GET /v1/tax/registrations
SHOW


Tax Transactions 
Ask about this section

Copy for LLM


View as Markdown

A Tax Transaction records the tax collected from or refunded to your customer.
Related guide: Calculate tax in your custom payment flow
ENDPOINTS
		POST /v1/tax/transactions/create_reversal POST /v1/tax/transactions/create_from_calculation GET /v1/tax/transactions/:id/line_items GET /v1/tax/transactions/:id
SHOW


Tax Settings 
Ask about this section

Copy for LLM


View as Markdown

You can use Tax Settings to manage configurations used by Stripe Tax calculations.
Related guide: Using the Settings API
ENDPOINTS
		POST /v1/tax/settings GET /v1/tax/settings
SHOW


Verification Session 
Ask about this section

Copy for LLM


View as Markdown

A VerificationSession guides you through the process of collecting and verifying the identities of your users. It contains details about the type of verification, such as what verification check to perform. Only create one VerificationSession for each verification in your system.
A VerificationSession transitions through multiple statuses throughout its lifetime as it progresses through the verification flow. The VerificationSession contains the user’s verified data after verification checks are complete.
Related guide: The Verification Sessions API
ENDPOINTS
		POST /v1/identity/verification_sessions POST /v1/identity/verification_sessions/:id GET /v1/identity/verification_sessions/:id GET /v1/identity/verification_sessions POST /v1/identity/verification_sessions/:id/cancel POST /v1/identity/verification_sessions/:id/redact
SHOW


Verification Report 
Ask about this section

Copy for LLM


View as Markdown

A VerificationReport is the result of an attempt to collect and verify data from a user. The collection of verification checks performed is determined from the type and options parameters used. You can find the result of each verification check performed in the appropriate sub-resource: document, id_number, selfie.
Each VerificationReport contains a copy of any data collected by the user as well as reference IDs which can be used to access collected images through the FileUpload API. To configure and create VerificationReports, use the VerificationSession API.
Related guide: Accessing verification results.
ENDPOINTS
		GET /v1/identity/verification_reports/:id GET /v1/identity/verification_reports
SHOW


Crypto Onramp Session 
Ask about this section

Copy for LLM


View as Markdown

A Crypto Onramp Session represents your customer’s session as they purchase cryptocurrency through Stripe. Once payment is successful, Stripe will fulfill the delivery of cryptocurrency to your user’s wallet and contain a reference to the crypto transaction ID.
You can create an onramp session on your server and embed the widget on your frontend. Alternatively, you can redirect your users to the standalone hosted onramp.
Related guide: Integrate the onramp
ENDPOINTS
		POST /v1/crypto/onramp_sessions GET /v1/crypto/onramp_sessions/:id GET /v1/crypto/onramp_sessions
SHOW


Crypto Onramp Quotes 
Ask about this section

Copy for LLM


View as Markdown

Crypto Onramp Quotes are estimated quotes for onramp conversions into all the different cryptocurrencies on different networks. The Quotes API allows you to display quotes in your product UI before directing the user to the onramp widget.
Related guide: Quotes API
Was this section helpful?
Yes
No
ENDPOINTS
		GET /v1/crypto/onramp/quotes

The Crypto Onramp Quote object 

	•	Attributes  id string  Unique identifier for the object.    object string  String representing the object’s type. Objects of the same type share the same value.    destination_network_quotes object  A list of destination cryptocurrency networks we can generate quotes for current as of created. We currently support: {ethereum, solana, polygon, bitcoin}  Show child attributes   livemode boolean  Has the value true if the object exists in live mode or the value false if the object exists in test mode.    rate_fetched_at float  The time at which this quote was created (when the prices in quotes are applicable)    source_amount string  The amount of fiat we intend to onramp    source_currency enum  A fiat currency code 
THE CRYPTO ONRAMP QUOTE OBJECT
{
  "id": "610a15d980d48eeaabc3e7375127cd10c8e7a6aad03ecf77d42dfd4c4f881faa",
  "object": "crypto.onramp.quotes",
  "destination_network_quotes": {
    "avalanche": [
      {
        "id": "dec31b3a2ef646c0bbf525774fa767097a334d51567cab715523b19e2d4a83f1",
        "destination_amount": "3.474296399973076273",
        "destination_currency": "avax",
        "destination_network": "avalanche",
        "fees": {
          "network_fee_monetary": "0.03",
          "transaction_fee_monetary": "4.04"
        },
        "source_total_amount": "104.07"
      },
      {
        "id": "3d56a9b2fdf3e5b9666461d5c28ea82ebb24287a8ece19869b02778dc70497e1",
        "destination_amount": "100.000000",
        "destination_currency": "usdc",
        "destination_network": "avalanche",
        "fees": {
          "network_fee_monetary": "0.06",
          "transaction_fee_monetary": "4.04"
        },
        "source_total_amount": "104.10"
      }
    ],
    "base_network": [
      {
        "id": "b2e849efda961116b180c9da75d7f852b9e46593f06a95e1ccd0893099579a9e",
        "destination_amount": "0.029133919178255537",
        "destination_currency": "eth",
        "destination_network": "base",
        "fees": {
          "network_fee_monetary": "0.07",
          "transaction_fee_monetary": "4.04"
        },
        "source_total_amount": "104.11"
      },
      {
        "id": "e8bc97d01c0fbf0d0b18cf5a25f7da6b2f98183fd223ebb866b691bc652109ac",
        "destination_amount": "100.000000",
        "destination_currency": "usdc",
        "destination_network": "base",
        "fees": {
          "network_fee_monetary": "0.17",
          "transaction_fee_monetary": "4.04"
        },
        "source_total_amount": "104.21"
      }
    ],
    "bitcoin": [
      {
        "id": "2a83796a355cfc311aec441170e2448b678828d336828c3ebb427e180e552091",
        "destination_amount": "0.00160673",
        "destination_currency": "btc",
        "destination_network": "bitcoin",
        "fees": {
          "network_fee_monetary": "11.89",
          "transaction_fee_monetary": "4.27"
        },
        "source_total_amount": "116.16"
      }
    ],
    "ethereum": [
      {
        "id": "52670639e0db4e969e472b1e7e1a219fb70d8674200a5ca30bfc941a73200c82",
        "destination_amount": "0.029111240079494021",
        "destination_currency": "eth",
        "destination_network": "ethereum",
        "fees": {
          "network_fee_monetary": "1.25",
          "transaction_fee_monetary": "4.06"
        },
        "source_total_amount": "105.31"
      },
      {
        "id": "1fdae4939338d2ac2fdd2a18909cd570bdb7f412109304fb6965b826741e6f0f",
        "destination_amount": "100.000000",
        "destination_currency": "usdc",
        "destination_network": "ethereum",
        "fees": {
          "network_fee_monetary": "3.76",
          "transaction_fee_monetary": "4.11"
        },
        "source_total_amount": "107.87"
      }
    ],
    "polygon": [
      {
        "id": "3a039af52bb8d7aaab7ce3c89f9445dc58b0a3ef5cf8a5c9ce3e20cc030e1a07",
        "destination_amount": "174.481810700000000000",
        "destination_currency": "matic",
        "destination_network": "polygon",
        "fees": {
          "network_fee_monetary": "0.01",
          "transaction_fee_monetary": "4.04"
        },
        "source_total_amount": "104.05"
      },
      {
        "id": "cce3462ecd4dc451e8ac16af79ada6997e969620547995bb2911e14e95903d6a",
        "destination_amount": "100.000000",
        "destination_currency": "usdc",
        "destination_network": "polygon",
        "fees": {
          "network_fee_monetary": "0.01",
          "transaction_fee_monetary": "4.04"
        },
        "source_total_amount": "104.05"
      }
    ],
    "solana": [
      {
        "id": "733e3fa8578e38020a78c6f45ea5f1da1210bc04b12e554841768ac4f5c505db",
        "destination_amount": "0.653551160",
        "destination_currency": "sol",
        "destination_network": "solana",
        "fees": {
          "network_fee_monetary": "0.01",
          "transaction_fee_monetary": "4.04"
        },
        "source_total_amount": "104.05"
      },
      {
        "id": "c270e59f3e9aaa52662d18699cdff4112568b0dad888d56f37d05dfdedbc76c5",
        "destination_amount": "100.000000",
        "destination_currency": "usdc",
        "destination_network": "solana",
        "fees": {
          "network_fee_monetary": "0.01",
          "transaction_fee_monetary": "4.04"
        },
        "source_total_amount": "104.05"
      }
    ],
    "stellar": [
      {
        "id": "a0c754b8d68155e13318643d71ea1b0d00eba8614f3778d3ddcfe6e8c5ec711e",
        "destination_amount": "1064.71823580",
        "destination_currency": "xlm",
        "destination_network": "stellar",
        "fees": {
          "network_fee_monetary": "0.18",
          "transaction_fee_monetary": "4.04"
        },
        "source_total_amount": "104.22"
      },
      {
        "id": "3e66d98654933b753971ba75f99f7e7fb47e03c5db1b0a4d02e8ec189842ab5b",
        "destination_amount": "100.000000",
        "destination_currency": "usdc",
        "destination_network": "stellar",
        "fees": {
          "network_fee_monetary": "0.18",
          "transaction_fee_monetary": "4.04"
        },
        "source_total_amount": "104.22"
      }
    ]
  },
  "livemode": false,
  "rate_fetched_at": 1719947634.6564176,
  "source_amount": "100.00",
  "source_currency": "usd"
}

Retrieve CryptoOnrampQuotes 

Retrieves CryptoOnrampQuotes.
Related guide: Quotes API
	•	Parameters  destination_amount string  A string representation of the amount of destination_currency to be purchased. If destination_amount is set, source_amount must be null. When specifying this field, you must also set a single value for destination_currencies and a single value for destination_networks (so we know what cryptocurrency to quote).    destination_currencies array of enums  The list of cryptocurrencies you want to generate quotes for. If left null, we retrieve quotes for all destination_currencies that destination_networks supports. Currencies: btc, eth, sol, matic, usdc    destination_networks array of enums  The list of cryptocurrency networks you want to generate quotes for. If left null, we retrieve quotes for destination_currencies in all networks. Networks: bitcoin, ethereum, solana, polygon    source_amount string  A string representation of the fiat amount that you need to onramp. If source_amount is set, destination_amount must be null (they’re mutually exclusive because you can only set a fixed amount for one end of the trade).    source_currency enum  The ISO-4217 Currency code. We only support usd currently. 
Returns

Returns the CryptoOnrampQuotes object
GET 
/v1/crypto/onramp/quotes
cURL



curl https://api.stripe.com/v1/crypto/onramp/quotes \
  -u "
sk_test_BQokikJOvBiI2HlWgH4olfQ2
:"
We show the cURL request because this method is currently unsupported in the Node.js client. To see it in the library, let us know about your use case.
RESPONSE
{
  "id": "610a15d980d48eeaabc3e7375127cd10c8e7a6aad03ecf77d42dfd4c4f881faa",
  "object": "crypto.onramp.quotes",
  "destination_network_quotes": {
    "avalanche": [
      {
        "id": "dec31b3a2ef646c0bbf525774fa767097a334d51567cab715523b19e2d4a83f1",
        "destination_amount": "3.474296399973076273",
        "destination_currency": "avax",
        "destination_network": "avalanche",
        "fees": {
          "network_fee_monetary": "0.03",
          "transaction_fee_monetary": "4.04"
        },
        "source_total_amount": "104.07"
      },
      {
        "id": "3d56a9b2fdf3e5b9666461d5c28ea82ebb24287a8ece19869b02778dc70497e1",
        "destination_amount": "100.000000",
        "destination_currency": "usdc",
        "destination_network": "avalanche",
        "fees": {
          "network_fee_monetary": "0.06",
          "transaction_fee_monetary": "4.04"
        },
        "source_total_amount": "104.10"
      }
    ],
    "base_network": [
      {
        "id": "b2e849efda961116b180c9da75d7f852b9e46593f06a95e1ccd0893099579a9e",
        "destination_amount": "0.029133919178255537",
        "destination_currency": "eth",
        "destination_network": "base",
        "fees": {
          "network_fee_monetary": "0.07",
          "transaction_fee_monetary": "4.04"
        },
        "source_total_amount": "104.11"
      },
      {
        "id": "e8bc97d01c0fbf0d0b18cf5a25f7da6b2f98183fd223ebb866b691bc652109ac",
        "destination_amount": "100.000000",
        "destination_currency": "usdc",
        "destination_network": "base",
        "fees": {
          "network_fee_monetary": "0.17",
          "transaction_fee_monetary": "4.04"
        },
        "source_total_amount": "104.21"
      }
    ],
    "bitcoin": [
      {
        "id": "2a83796a355cfc311aec441170e2448b678828d336828c3ebb427e180e552091",
        "destination_amount": "0.00160673",
        "destination_currency": "btc",
        "destination_network": "bitcoin",
        "fees": {
          "network_fee_monetary": "11.89",
          "transaction_fee_monetary": "4.27"
        },
        "source_total_amount": "116.16"
      }
    ],
    "ethereum": [
      {
        "id": "52670639e0db4e969e472b1e7e1a219fb70d8674200a5ca30bfc941a73200c82",
        "destination_amount": "0.029111240079494021",
        "destination_currency": "eth",
        "destination_network": "ethereum",
        "fees": {
          "network_fee_monetary": "1.25",
          "transaction_fee_monetary": "4.06"
        },
        "source_total_amount": "105.31"
      },
      {
        "id": "1fdae4939338d2ac2fdd2a18909cd570bdb7f412109304fb6965b826741e6f0f",
        "destination_amount": "100.000000",
        "destination_currency": "usdc",
        "destination_network": "ethereum",
        "fees": {
          "network_fee_monetary": "3.76",
          "transaction_fee_monetary": "4.11"
        },
        "source_total_amount": "107.87"
      }
    ],
    "polygon": [
      {
        "id": "3a039af52bb8d7aaab7ce3c89f9445dc58b0a3ef5cf8a5c9ce3e20cc030e1a07",
        "destination_amount": "174.481810700000000000",
        "destination_currency": "matic",
        "destination_network": "polygon",
        "fees": {
          "network_fee_monetary": "0.01",
          "transaction_fee_monetary": "4.04"
        },
        "source_total_amount": "104.05"
      },
      {
        "id": "cce3462ecd4dc451e8ac16af79ada6997e969620547995bb2911e14e95903d6a",
        "destination_amount": "100.000000",
        "destination_currency": "usdc",
        "destination_network": "polygon",
        "fees": {
          "network_fee_monetary": "0.01",
          "transaction_fee_monetary": "4.04"
        },
        "source_total_amount": "104.05"
      }
    ],
    "solana": [
      {
        "id": "733e3fa8578e38020a78c6f45ea5f1da1210bc04b12e554841768ac4f5c505db",
        "destination_amount": "0.653551160",
        "destination_currency": "sol",
        "destination_network": "solana",
        "fees": {
          "network_fee_monetary": "0.01",
          "transaction_fee_monetary": "4.04"
        },
        "source_total_amount": "104.05"
      },
      {
        "id": "c270e59f3e9aaa52662d18699cdff4112568b0dad888d56f37d05dfdedbc76c5",
        "destination_amount": "100.000000",
        "destination_currency": "usdc",
        "destination_network": "solana",
        "fees": {
          "network_fee_monetary": "0.01",
          "transaction_fee_monetary": "4.04"
        },
        "source_total_amount": "104.05"
      }
    ],
    "stellar": [
      {
        "id": "a0c754b8d68155e13318643d71ea1b0d00eba8614f3778d3ddcfe6e8c5ec711e",
        "destination_amount": "1064.71823580",
        "destination_currency": "xlm",
        "destination_network": "stellar",
        "fees": {
          "network_fee_monetary": "0.18",
          "transaction_fee_monetary": "4.04"
        },
        "source_total_amount": "104.22"
      },
      {
        "id": "3e66d98654933b753971ba75f99f7e7fb47e03c5db1b0a4d02e8ec189842ab5b",
        "destination_amount": "100.000000",
        "destination_currency": "usdc",
        "destination_network": "stellar",
        "fees": {
          "network_fee_monetary": "0.18",
          "transaction_fee_monetary": "4.04"
        },
        "source_total_amount": "104.22"
      }
    ]
  },
  "livemode": false,
  "rate_fetched_at": 1719947634.6564176,
  "source_amount": "100.00",
  "source_currency": "usd"
}

Climate Order 
Ask about this section

Copy for LLM


View as Markdown

Orders represent your intent to purchase a particular Climate product. When you create an order, the payment is deducted from your merchant balance.
ENDPOINTS
		POST /v1/climate/orders POST /v1/climate/orders/:id GET /v1/climate/orders/:id GET /v1/climate/orders POST /v1/climate/orders/:id/cancel
SHOW


Climate Product 
Ask about this section

Copy for LLM


View as Markdown

A Climate product represents a type of carbon removal unit available for reservation. You can retrieve it to see the current price and availability.
ENDPOINTS
		GET /v1/climate/products/:id GET /v1/climate/products
SHOW


Climate Supplier 
Ask about this section

Copy for LLM


View as Markdown

A supplier of carbon removal.
ENDPOINTS
		GET /v1/climate/suppliers/:id GET /v1/climate/suppliers
SHOW


Forwarding Request 
Ask about this section

Copy for LLM


View as Markdown

Instructs Stripe to make a request on your behalf using the destination URL. The destination URL is activated by Stripe at the time of onboarding. Stripe verifies requests with your credentials provided during onboarding, and injects card details from the payment_method into the request.
Stripe redacts all sensitive fields and headers, including authentication credentials and card numbers, before storing the request and response data in the forwarding Request object, which are subject to a 30-day retention period.
You can provide a Stripe idempotency key to make sure that requests with the same key result in only one outbound request. The Stripe idempotency key provided should be unique and different from any idempotency keys provided on the underlying third-party request.
Forwarding Requests are synchronous requests that return a response or time out according to Stripe’s limits.
Related guide: Forward card details to third-party API endpoints.
ENDPOINTS
		POST /v1/forwarding/requests GET /v1/forwarding/requests/:id GET /v1/forwarding/requests
SHOW


Redaction Job 
Preview
Ask about this section

Copy for LLM


View as Markdown

The Redaction Job object redacts Stripe objects. You can use it to coordinate the removal of personal information from selected objects, making them permanently inaccessible in the Stripe Dashboard and API.
ENDPOINTS
		POST /v1/privacy/redaction_jobs POST /v1/privacy/redaction_jobs/:id GET /v1/privacy/redaction_jobs/:id GET /v1/privacy/redaction_jobs POST /v1/privacy/redaction_jobs/:id/cancel POST /v1/privacy/redaction_jobs/:id/run POST /v1/privacy/redaction_jobs/:id/validate
SHOW


Redaction Job Validation Error 
Preview
Ask about this section

Copy for LLM


View as Markdown

The Redaction Job validation error object contains information about errors that affect the ability to redact a specific object in a redaction job.
ENDPOINTS
		GET /v1/privacy/redaction_jobs/:id/validation_errors
SHOW


Webhook Endpoints 
Ask about this section

Copy for LLM


View as Markdown

You can configure webhook endpoints via the API to be notified about events that happen in your Stripe account or connected accounts.
Most users configure webhooks from the dashboard, which provides a user interface for registering and testing your webhook endpoints.
Related guide: Setting up webhooks
Was this section helpful?
Yes
No
ENDPOINTS
		POST /v1/webhook_endpoints POST /v1/webhook_endpoints/:id GET /v1/webhook_endpoints/:id GET /v1/webhook_endpoints DELETE /v1/webhook_endpoints/:id

The Webhook Endpoint object 
Ask about this section

Copy for LLM


View as Markdown

	•	Attributes  id string  Unique identifier for the object.    api_version nullable string  The API version events are rendered as for this webhook endpoint.    description nullable string  An optional description of what the webhook is used for.    enabled_events array of strings  The list of events to enable for this endpoint. ['*'] indicates that all events are enabled, except those that require explicit selection.    metadata object  Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format.    secret string  The endpoint’s secret, used to generate webhook signatures. Only returned at creation.    status string  The status of the webhook. It can be enabled or disabled.    url string  The URL of the webhook endpoint. 
More attributes
Expand all
	•	   object string     application nullable string     created timestamp     livemode boolean 
THE WEBHOOK ENDPOINT OBJECT
{
  "id": "we_1Mr5jULkdIwHu7ix1ibLTM0x",
  "object": "webhook_endpoint",
  "api_version": null,
  "application": null,
  "created": 1680122196,
  "description": null,
  "enabled_events": [
    "charge.succeeded",
    "charge.failed"
  ],
  "livemode": false,
  "metadata": {},
  "secret": "whsec_wRNftLajMZNeslQOP6vEPm4iVx5NlZ6z",
  "status": "enabled",
  "url": "https://example.com/my/webhook/endpoint"
}

Create a webhook endpoint 
Ask about this section

Copy for LLM


View as Markdown

A webhook endpoint must have a url and a list of enabled_events. You may optionally specify the Boolean connect parameter. If set to true, then a Connect webhook endpoint that notifies the specified url about events from all connected accounts is created; otherwise an account webhook endpoint that notifies the specified url only about events from your account is created. You can also create webhook endpoints in the webhooks settings section of the Dashboard.
	•	Parameters  enabled_events array of enums Required  The list of events to enable for this endpoint. You may specify ['*'] to enable all events, except those that require explicit selection. Possible enum values
	•	account.application.authorized Occurs whenever a user authorizes an application. Sent to the related application only. 
	•	account.application.deauthorized Occurs whenever a user deauthorizes an application. Sent to the related application only. 
	•	account.external_account.created Occurs whenever an external account is created. 
	•	account.external_account.deleted Occurs whenever an external account is deleted. 
	•	account.external_account.updated Occurs whenever an external account is updated. 
	•	account.updated Occurs whenever an account status or property has changed. 
	•	application_fee.created Occurs whenever an application fee is created on a charge. 
	•	application_fee.refund.updated Occurs whenever an application fee refund is updated. 
	•	application_fee.refunded Occurs whenever an application fee is refunded, whether from refunding a charge or from refunding the application fee directly. This includes partial refunds. 
	•	balance.available Occurs whenever your Stripe balance has been updated (e.g., when a charge is available to be paid out). By default, Stripe automatically transfers funds in your balance to your bank account on a daily basis. This event is not fired for negative transactions. 
	•	Show 202 more
	•	    url string Required  The URL of the webhook endpoint.    api_version string  Events sent to this endpoint will be generated with this Stripe Version instead of your account’s default Stripe Version.    description string  An optional description of what the webhook is used for.    metadata object  Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format. Individual keys can be unset by posting an empty value to them. All keys can be unset by posting an empty value to metadata. 
More parameters
Expand all
	•	   connect boolean 
Returns

Returns the webhook endpoint object with the secret field populated.
POST 
/v1/webhook_endpoints
Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET




const stripe = require('stripe')('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');

const webhookEndpoint = await stripe.webhookEndpoints.create({
  enabled_events: ['charge.succeeded', 'charge.failed'],
  url: 'https://example.com/my/webhook/endpoint',
});
RESPONSE
{
  "id": "we_1Mr5jULkdIwHu7ix1ibLTM0x",
  "object": "webhook_endpoint",
  "api_version": null,
  "application": null,
  "created": 1680122196,
  "description": null,
  "enabled_events": [
    "charge.succeeded",
    "charge.failed"
  ],
  "livemode": false,
  "metadata": {},
  "secret": "whsec_wRNftLajMZNeslQOP6vEPm4iVx5NlZ6z",
  "status": "enabled",
  "url": "https://example.com/my/webhook/endpoint"
}

Update a webhook endpoint 
Ask about this section

Copy for LLM


View as Markdown

Updates the webhook endpoint. You may edit the url, the list of enabled_events, and the status of your endpoint.
	•	Parameters  description string  An optional description of what the webhook is used for.    enabled_events array of enums  The list of events to enable for this endpoint. You may specify ['*'] to enable all events, except those that require explicit selection. Possible enum values
	•	account.application.authorized Occurs whenever a user authorizes an application. Sent to the related application only. 
	•	account.application.deauthorized Occurs whenever a user deauthorizes an application. Sent to the related application only. 
	•	account.external_account.created Occurs whenever an external account is created. 
	•	account.external_account.deleted Occurs whenever an external account is deleted. 
	•	account.external_account.updated Occurs whenever an external account is updated. 
	•	account.updated Occurs whenever an account status or property has changed. 
	•	application_fee.created Occurs whenever an application fee is created on a charge. 
	•	application_fee.refund.updated Occurs whenever an application fee refund is updated. 
	•	application_fee.refunded Occurs whenever an application fee is refunded, whether from refunding a charge or from refunding the application fee directly. This includes partial refunds. 
	•	balance.available Occurs whenever your Stripe balance has been updated (e.g., when a charge is available to be paid out). By default, Stripe automatically transfers funds in your balance to your bank account on a daily basis. This event is not fired for negative transactions. 
	•	Show 202 more
	•	    metadata object  Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format. Individual keys can be unset by posting an empty value to them. All keys can be unset by posting an empty value to metadata.    url string  The URL of the webhook endpoint. 
More parameters
Expand all
	•	   disabled boolean 
Returns

The updated webhook endpoint object if successful. Otherwise, this call throws an error.
POST 
/v1/webhook_endpoints/:id
Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET




const stripe = require('stripe')('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');

const webhookEndpoint = await stripe.webhookEndpoints.update(
  'we_1Mr5jULkdIwHu7ix1ibLTM0x',
  {
    enabled_events: ['charge.succeeded', 'charge.failed'],
    url: 'https://example.com/new_endpoint',
  }
);
RESPONSE
{
  "id": "we_1Mr5jULkdIwHu7ix1ibLTM0x",
  "object": "webhook_endpoint",
  "api_version": null,
  "application": null,
  "created": 1680122196,
  "description": null,
  "enabled_events": [
    "charge.succeeded",
    "charge.failed"
  ],
  "livemode": false,
  "metadata": {},
  "status": "disabled",
  "url": "https://example.com/new_endpoint"
}

Retrieve a webhook endpoint 
Ask about this section

Copy for LLM


View as Markdown

Retrieves the webhook endpoint with the given ID.
Parameters

No parameters.
Returns

Returns a webhook endpoint if a valid webhook endpoint ID was provided. Throws an error otherwise.
GET 
/v1/webhook_endpoints/:id
Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET




const stripe = require('stripe')('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');

const webhookEndpoint = await stripe.webhookEndpoints.retrieve(
  'we_1Mr5jULkdIwHu7ix1ibLTM0x'
);
RESPONSE
{
  "id": "we_1Mr5jULkdIwHu7ix1ibLTM0x",
  "object": "webhook_endpoint",
  "api_version": null,
  "application": null,
  "created": 1680122196,
  "description": null,
  "enabled_events": [
    "charge.succeeded",
    "charge.failed"
  ],
  "livemode": false,
  "metadata": {},
  "status": "enabled",
  "url": "https://example.com/my/webhook/endpoint"
}

List all webhook endpoints 
Ask about this section

Copy for LLM


View as Markdown

Returns a list of your webhook endpoints.
Parameters

No parameters.
More parameters
Expand all
	•	   ending_before string     limit integer     starting_after string 
Returns

A object with a data property that contains an array of up to limit webhook endpoints, starting after webhook endpoint starting_after. Each entry in the array is a separate webhook endpoint object. If no more webhook endpoints are available, the resulting array will be empty. This request should never throw an error.
GET 
/v1/webhook_endpoints
Server-side language
cURL
Stripe CLI
Ruby
Python
PHP
Java
Node.js
Go
.NET




const stripe = require('stripe')('
sk_test_BQokikJOvBiI2HlWgH4olfQ2
');

const webhookEndpoints = await stripe.webhookEndpoints.list({
  limit: 3,
});
RESPONSE
{
  "object": "list",
  "url": "/v1/webhook_endpoints",
  "has_more": false,
  "data": [
    {
      "id": "we_1Mr5jULkdIwHu7ix1ibLTM0x",
      "object": "webhook_endpoint",
      "api_version": null,
      "application": null,
      "created": 1680122196,
      "description": null,
      "enabled_events": [
        "charge.succeeded",
        "charge.failed"
      ],
      "livemode": false,
      "metadata": {},
      "status": "enabled",
      "url": "https://example.com/my/webhook/endpoint"
    }
  ]
}

Delete a webhook endpoint 
Ask about this section

Copy for LLM


View as Markdown

You can also delete webhook endpoints via the webhook endpoint management page of the Stripe dashboard.
Parameters

No parameters.
Returns

An object with the deleted webhook endpoints’s ID. Otherwise, this call throws an error, such as if the webhook endpoint has already been deleted.
