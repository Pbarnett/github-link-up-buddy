# Stripe CLI Reference



Find anything
/
Getting started
Introduction
Login
Using Stripe API keys
Configuration options
Set up autocompletion
Global flags
Stripe
See real-time logs
Open browser shortcuts
Webhooks
Listen for events
Trigger events
Resend events
Resources & HTTP
Stripe resources
GET requests
POST requests
DELETE requests
Create and use fixtures
Stripe Samples
Copy Samples locally
List all Samples
Serve a Sample
Additional Commands
Terminal quickstart
Logout
Provide feedback
Help
Current version
Further Information
Use with Docker
Telemetry
License
Sign In →
Stripe CLI
Docs
Support
Sign in →
Stripe CLI reference
This reference documents every command and flag available in Stripe’s command-line interface.

The Stripe CLI helps you build, test, and manage your Stripe integration right from the terminal.

With the CLI, you can:

Create, retrieve, update, and delete API objects.
Tail API request logs in real time.
Securely test webhooks without relying on third-party tunneling software.

Follow the installation guide to set up the Stripe CLI.

Looking for a quickstart guide?
Follow our step-by-step guide to get started with the Stripe CLI.

Have feedback for us?
Please let us know by taking our feedback survey.

Found an issue?
Report bugs and issues on the Stripe CLI issue tracker so we can resolve them.

stripe login [flags]
Connect the CLI to your Stripe account by logging in to persist your secret key locally.

The Stripe CLI runs commands using a global configuration or project-specific configurations. To configure the CLI globally, run:

stripe login

You'll be redirected to the Dashboard to confirm that you want to give the CLI access to your account. After confirming, a new API key will be created for the CLI.

All configurations are stored in ~/.config/stripe/config.toml, including login credentials. You can use the XDG_CONFIG_HOME environment variable to override this location. The configuration file is not automatically removed when the CLI is uninstalled.

Flags
-i, --interactive
Use interactive configuration mode if you cannot open a browser and would like to manually provide an API key.

--project-name=<project>
You can create project-specific configurations with the --project-name flag, which can be used in any context. If you do not provide the --project-name flag for a command, it will default to the global configuration.

Was this section helpful?YesNo


stripe login

stripe login --project-name=rocket-rides

Your pairing code is: excels-champ-wins-quaint
This pairing code verifies your authentication with Stripe.
Press Enter to open the browser
...

stripe login --interactive

Enter your API key:
Your API key is: sk_******************************p7dc
...
Using Stripe API keys
The Stripe CLI supports several different ways to set and use API keys:

stripe login
stripe config
--api-key flag
Environment variables

Each supports a different use case. stripe login is the easiest and recommended way to get started. Running this command will prompt you to log in from your browser and persist your API key locally, rather than requiring it for each command. If you want to provide an API key manually, you can use stripe login --interactive.

Using stripe config allows you to set persistent keys manually:

stripe config --set test_mode_api_key sk_test_REMOVED_FROM_GIT

--api-key is a global flag that overrides your local configuration if you need to run one-off commands with a specific API key.

You can set two environment variables, which take precedence over all other values:

STRIPE_API_KEY: the API key to use for the CLI.
STRIPE_DEVICE_NAME: the device name for the CLI, visible in the Dashboard.

Was this section helpful?YesNo


stripe listen --api-key sk_test_REMOVED_FROM_GIT
stripe config [flags]
Use the config command to manually set configuration options for the CLI. The config command supports:

Setting options
Unsetting options
Listing all configured options
Opening the configuration file with your default editor

All commands support the --project-name global flag. You can define a unique configuration for individual projects.

Flags
-e, --edit
Opens the configuration file in your default editor.

--list
Lists all configured options (including defaults).

--set <option> <value>
string
Set a value for the specified configuration option.

--unset <option>
string
Unset the configuration option and remove the key-value pair from the configuration file.

Was this section helpful?YesNo


stripe config --set color on

stripe config --unset color

stripe config --list

color = "on"

[default]
  device_name = "st-stripe1"
  live_mode_api_key = "rk_live_abc123"
  live_mode_publishable_key = "pk_live_abc123"
  test_mode_api_key = "rk_test_abc123"
  test_mode_publishable_key = "pk_test_abc123"
stripe completion [--shell <platform>]
The Stripe CLI supports autocompletion for macOS and Linux to make it easier to use the right commands with the CLI with the Bash and ZSH shells.

Set up autocompletion by running stripe completion. Depending on your platform and shell, relevant instructions will be displayed.

Details around setting up autocompletion can be also found in the Terminal Autocompletion section of our configuration guide.

Shell completion scripts are not currently supported on Windows.

Flags
--shell <platform>
The shell for which autocompletion commands will be generated. By default the CLI will attempt to autodetect the platform.

Show supported platforms
Was this section helpful?YesNo


stripe completion

stripe completion --shell zsh
stripe {command} <arguments> [flags]
The Stripe CLI supports a number of flags for every command.

Flags
--api-key <stripe_api_key>
string
Use the Stripe account associated with this Stripe API secret key.

--color <setting>
Enable or disable color output.

Show color settings
--config <config_filepath>
string
Use this file path for the CLI's configuration file (default: $HOME/.config/stripe/config.toml).

--device-name <name>
string
Run this command on behalf of another device.

-h, --help
Provides the help documentation for a given command, including the supported flags and arguments.

--log-level <level>
Set the level of detail for log messages (default: info)

Show accepted values
-p, --project-name <name>
string
Define a project name for the CLI's current configuration. Using the --project-name flag enables multiple configurations across Stripe accounts (stored within one configuration file), and any command can run in the context of a project (default: "default").

-v, --version
Prints the version of the Stripe CLI. This flag is meant to run without any other flags or arguments set.

Was this section helpful?YesNo

Stripe commands
Inspect details about your Stripe integration, logs, and service availability.

stripe logs tail [flags]
Establishes a direct connection with Stripe, allowing you to tail your test mode Stripe API request logs in real-time from your terminal.

Multiple filters can be used together and a log entry must match all filters to be shown.

When specifying a filter, multiple values can be provided as a comma-separated list. A log entry only needs to match one of the values.

logs tail only supports displaying test mode request logs.

Flags
--filter-account <values>
Connect Only
Filter request logs by the source and destination account.

Show accepted values
--filter-http-method <values>
Filter request logs by HTTP method.

Show accepted values
--filter-ip-address <values>
Filter request logs by IP address.

--filter-request-path <values>
Filter request logs that directly match any Stripe path (e.g. /v1/charges).

--filter-request-status <values>
Filter request logs by the response status.

Show accepted values
--filter-source <values>
Filter request logs by the source of each request.

Show accepted values
--filter-status-code <values>
Filter request logs by HTTP status code.

--filter-status-code-type <values>
Filter request logs by the type of HTTP status code.

Show accepted values
--format <value>
Specifies the output format for request logs.

Show accepted values
Was this section helpful?YesNo


stripe logs tail

> Ready! You're now waiting to receive API request logs
2022-01-28 09:47:46 [200] POST /v1/customers [req_abc123]
2022-01-28 09:48:22 [200] POST /v1/charges [req_def456]
2022-01-28 09:48:58 [200] POST /v1/charges [req_ghi789]
...

stripe logs tail \
    --filter-http-method POST \
    --filter-status-code-type 4XX

stripe logs tail --filter-http-method GET,POST
stripe open <shortcut> [flags]
Shortcut to open the Stripe documentation or Dashboard in your browser.

Any Dashboard pages (that include /test/ in the URL) can be viewed in live mode with the --live flag.

Arguments
<shortcut>
Shortcut used to quickly open a page on stripe.com.

Show shortcut properties
Flags
--list
List all supported shortcuts.

--live
Open the Dashboard for your live integration (by default, runs in test mode).

Was this section helpful?YesNo


stripe open dashboard/webhooks

stripe open dashboard/apikeys --live

stripe open --live --list

open supports the following shortcuts:

shortcut                              url
--------                              ---------
api               => https://docs.stripe.com/api
apiref            => https://docs.stripe.com/api
cliref            => https://docs.stripe.com/cli
dashboard         => https://dashboard.stripe.com
dashboard/apikeys => https://dashboard.stripe.com/apikeys
dashboard/atlas   => https://dashboard.stripe.com/atlas
...
Webhook commands
Listen for webhook events and forward them to your application. Trigger and resend webhook events.

stripe listen [flags]
Receive webhook events from Stripe on your local machine via a direct connection to Stripe's API. The listen command can receive events based on your account's default API version or the latest version, filter by type of event, or forward events to an application running on a given port.

By default, listen accepts all snapshot webhook events and displays them in your terminal. In order to listen to thin events, you must pass them in via --thin-events.

You don't need to configure any webhook endpoints in your Dashboard to receive webhooks with the CLI.

The webhook signing secret provided will not change between restarts to the listen command.

Flags
-e, --events <events types>
A comma-separated list of which snapshot events to listen for. The event types documentation includes a complete list (default: [*] for all events).

-f, --forward-to <url>
The URL that snapshot webhook events will be forwarded to. Returns a webhook signing secret which you can add to your application's configuration.

-H, --headers <values>
A comma-separated list of custom HTTP headers to forward.

Ex: "Key1:Value1, Key2:Value2"

-c, --forward-connect-to <url>
The URL that Connect webhook events will be forwarded to. By default, the same URL will be used for all snapshot webhook events.

--connect-headers <values>
A comma-separated list of custom HTTP headers to forward to any connected accounts. This is useful when testing a Connect platform.

Ex: "Key1:Value1, Key2:Value2"

--thin-events <events types>
A comma-separated list of which thin events to listen for. The event types documentation includes a complete list. Use [*] for all events. (default: none).

--forward-thin-to <url>
The URL that thin webhook events will be forwarded to. Returns a webhook signing secret which you can add to your application's configuration.

--forward-thin-connect-to <url>
The URL that thin Connect webhook events will be forwarded to. By default, the same URL will be used for all thin webhook events.

-l, --latest
Receive events used in the latest API version. By default, webhook events received will depend on your account's default API version.

--live
Make a live request (by default, runs in test mode).

-a, --load-from-webhooks-api
Listen for all webhook events based on your existing webhook endpoints configured in the Dashboard and API.

-j, --print-json
Print JSON objects to stdout.

--print-secret
Only print the webhook signing secret and exit.

--skip-verify
Skip certificate verification when forwarding to HTTPS endpoints.

Was this section helpful?YesNo


stripe listen

> Ready! Your webhook signing secret is whsec_abcdefg1234567
2022-01-28 09:47:46   --> customer.created [evt_abc123]
2022-01-28 09:48:22   --> charge.succeeded [evt_def456]
2022-01-28 09:48:58   --> charge.succeeded [evt_ghi789]

stripe listen --forward-to http://localhost:4242

stripe listen --events=payment_intent.succeeded
stripe trigger <event> [flags]
Trigger example webhook events to conduct local testing. These test webhook events are based on real API objects and may trigger other webhook events as part of the test (for example, triggering payment_intent.succeeded also triggers payment_intent.created).

The event types documentation includes a complete list of webhook events and when they would be triggered.

Events are triggered by issuing HTTP requests against the Stripe API. Because of this, triggering events causes side effects: all necessary API objects will be created in the process.

Arguments
<event>
The webhook events we currently support are listed below (or using stripe help trigger):

Show supported webhook events
Flags
--stripe-account
Set a header identifying the connected account.

--override [resource]:[path1].[path2]=[value]
Override the param at path1.path2 for the resource. Example: --override plan:product.name=overrideName

--add [resource]:[path1].[path2]=[value]
Add the param path1.path2 to the resource. Example: --add payment_intent:customer=customerId

--remove [resource]:[path1].[path2]
Remove the param at path1.path2 from the resource. Example: --remove customer:description

--skip [param]
Skip specific steps in the trigger. Example: --skip cus_jenny_rosen

--edit
Edit the fixture directly in your default IDE before triggering. Cannot be used with --add, --remove, --override, or --skip.

Was this section helpful?YesNo


stripe trigger invoice.payment_succeeded

Setting up fixture for: customer
Setting up fixture for: invoiceitem
Setting up fixture for: invoice
Setting up fixture for: invoice_pay
Trigger succeeded! Check dashboard for event details.

stripe trigger --help

Supported events:
  balance.available
  charge.captured
  charge.dispute.created
  charge.failed
  charge.refunded
  charge.succeeded
...
stripe events resend <event_id> [flags]
Resend an event to the CLI's local webhook endpoint. You must pass --webhook-endpoint=we_123456 to resend the event to a specific webhook endpoint. You can only resend events that have been created within the last 30 days.

Arguments
<event_id>
The ID of the event to resend.

Flags
--account=<account_id>
To resend an event that's sent to a Connect webhook endpoint on a platform, set this flag to the connected account ID associated with the event. You can't use the --stripe-account parameter with Connect.

-c, --confirm
Skip the warning prompt and automatically confirm the command being entered.

--dark-style
Use a darker color scheme better suited for lighter command-line environments.

-e, --expand <value>
stringArray
Response attributes to expand inline (target nested values with nested[param]=value).

-i, --idempotency <key>
string
Set an idempotency key for the request, preventing the same request from replaying within 24 hours.

--live
Make a live request (by default, runs in test mode).

-s, --show-headers
Show response HTTP headers.

--stripe-account <account_id>
string
Specify the Stripe account to use for this request.

-v, --stripe-version <version>
string
Specify the Stripe API version to use for this request.

--webhook-endpoint=<endpoint_id>
Resend the event to the given webhook endpoint ID (we_123456).

Was this section helpful?YesNo


stripe events resend evt_1PH9HU2eZvKYlo2CrSrLx8y1

{
  "id": "evt_1PH9HU2eZvKYlo2CrSrLx8y1",
  "object": "event",
  "api_version": "2019-02-19",
  "created": 1715885036,
  "data": {
    "object": {
      "id": "card_1PH9HQ2eZvKYlo2CcwDOwdFV",
      "object": "card",
      "address_city": null,
      "address_country": null,
      "address_line1": null,
      "address_line1_check": null,
      "address_line2": null,
      "address_state": null,
      "address_zip": "12345",
      "address_zip_check": "pass",
      "brand": "Visa",
      "country": "US",
      "customer": "cus_Q7O3jQBjZLlpRL",
      "cvc_check": "pass",
      "dynamic_last4": null,
      "exp_month": 12,
      "exp_year": 2034,
      "fingerprint": "Xt5EWLLDS7FJjR1c",
      "funding": "credit",
      "last4": "4242",
      "metadata": {},
      "name": "user@gmail.com",
      "tokenization_method": null,
      "wallet": null
    }
  },
  "livemode": false,
  "pending_webhooks": 0,
  "request": {
    "id": "req_nqyTqVZmNKel38",
    "idempotency_key": "4bbe6edd-6d4e-4770-bf5a-f006cdf0e394"
  },
  "type": "customer.source.created"
}
Resources & HTTP commands
The Stripe CLI supports two ways to create, update, and list objects based on API resources: resource commands and HTTP commands.

Resource commands directly manage API resources and provide different arguments, flags, and functionality based on which API resource is used.

HTTP commands are convenient shorthand for HTTP requests to the Stripe API. These requests can operate on individual API objects or lists of objects.

Was this section helpful?YesNo

stripe {resource command} <operation> [flags]
Resource commands make API requests using the CLI for a given resource. The Stripe CLI has commands to interact with all types of Stripe API resources.

A complete list of available resources and examples are included in the API Reference Guide. Select Stripe CLI from the language dropdown to see a complete example for each resource.

Use the help command on any resource to see what operations you can perform. For example, run stripe charges --help to see help for the Charges resource.

Use stripe resources to see a complete list of available resources.

All commands support making live requests with the --live flag.

Arguments
<operation>
Operation to perform on API object. Each type of API resource includes a set of operations that you can perform (such as delete, list, and retrieve).

Flags
--param=value
Parameters to attach to the operation being performed.

-d, --data <value>
stringArray
Additional data to send with an API request. Supports setting nested values (e.g nested[param]=value).

Was this section helpful?YesNo


stripe charges --help

Available Operations:
  capture
  create
  list
...

stripe charges create \
    --amount=100 \
    --currency=usd \
    --source=tok_visa

stripe charges update ch_1OKcnt2eZvKYlo2C99k9lfXl \
    -d "metadata[key]=value"

stripe charges retrieve ch_1OKcnt2eZvKYlo2C99k9lfXl

{
  "id": "ch_1OKcnt2eZvKYlo2C99k9lfXl",
  "object": "charge",
  "amount": 1000,
  "amount_captured": 1000,
  "amount_refunded": 0,
  "application": null,
  "application_fee": null,
  "application_fee_amount": null,
  "balance_transaction": "txn_1032Rp2eZvKYlo2CpErRBj09",
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
  "created": 1701937169,
  "currency": "usd",
  "customer": null,
  "description": "Created by docs.stripe.com/ demo",
  "disputed": false,
  "failure_balance_transaction": null,
  "failure_code": null,
  "failure_message": null,
  "fraud_details": {},
  "invoice": null,
  "livemode": false,
  "metadata": {
    "order_id": "6735"
  },
  "on_behalf_of": null,
  "outcome": {
    "network_status": "approved_by_network",
    "reason": null,
    "risk_level": "normal",
    "risk_score": 23,
    "seller_message": "Payment complete.",
    "type": "authorized"
  },
  "paid": true,
  "payment_intent": "pi_1Gt0RG2eZvKYlo2CtxkQK2rm",
  "payment_method": "pm_1OKcns2eZvKYlo2CKsdIIi44",
  "payment_method_details": {
    "card": {
      "amount_authorized": 1000,
      "brand": "visa",
      "checks": {
        "address_line1_check": null,
        "address_postal_code_check": null,
        "cvc_check": "pass"
      },
      "country": "US",
      "exp_month": 12,
      "exp_year": 2024,
      "extended_authorization": {
        "status": "disabled"
      },
      "fingerprint": "Xt5EWLLDS7FJjR1c",
      "funding": "credit",
      "incremental_authorization": {
        "status": "unavailable"
      },
      "installments": null,
      "last4": "4242",
      "mandate": null,
      "moto": null,
      "multicapture": {
        "status": "unavailable"
      },
      "network": "visa",
      "network_token": {
        "used": false
      },
      "overcapture": {
        "maximum_amount_capturable": 1000,
        "status": "unavailable"
      },
      "three_d_secure": null,
      "wallet": null
    },
    "type": "card"
  },
  "radar_options": {},
  "receipt_email": null,
  "receipt_number": "1684-0467",
  "receipt_url": "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xMDMyRDgyZVp2S1lsbzJDKP6nmbIGMgY2QUIeNTI6LBaGWNqqEfm4xybvgPh4CLXLNmXvRMDc4iH3dMWsCa2YHb8GTcFcSy9E-6rX",
  "redaction": null,
  "refunded": false,
  "refunds": {
    "object": "list",
    "data": [],
    "has_more": false,
    "url": "/v1/charges/ch_1OKcnt2eZvKYlo2C99k9lfXl/refunds"
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
stripe get <arguments> [flags]
Make GET HTTP requests to retrieve an individual API object (or set of objects).

You can pipe the output of this command to other tools. For example, you could use jq to extract information from JSON the API returns, and then use that information to trigger other API requests.

See the API reference for a complete list of supported URL paths.

Arguments
<id>
string
ID of the API object to retrieve.

<path>
string
URL path of the API object or set of objects to fetch.

Flags
-c, --confirm
Skip the warning prompt and automatically confirm the command being entered.

--dark-style
Use a darker color scheme better suited for lighter command-line environments.

-d, --data <value>
stringArray
Additional data to send with an API request. Supports setting nested values (e.g nested[param]=value).

-b, --ending-before <object_id>
string
Retrieve the previous page in the list. Pagination uses a cursor that depends on the ID of an object in the list.

-e, --expand <value>
stringArray
Response attributes to expand inline (target nested values with nested[param]=value).

-i, --idempotency <key>
string
Set an idempotency key for the request, preventing the same request from replaying within 24 hours.

-l, --limit <number>
integer
Number of objects to return, between 1 and 100 (default: 10).

--live
Make a live request (by default, runs in test mode).

-s, --show-headers
Show response HTTP headers.

-a, --starting-after <object_id>
string
Retrieve the next page in the list. Pagination uses a cursor that depends on the ID of an object in the list.

--stripe-account <account_id>
string
Specify the Stripe account to use for this request.

-v, --stripe-version <version>
string
Specify the Stripe API version to use for this request.

Was this section helpful?YesNo


stripe get ch_1OKcnt2eZvKYlo2C99k9lfXl

{
  "id": "ch_1OKcnt2eZvKYlo2C99k9lfXl",
  "object": "charge",
  "amount": 1000,
  "amount_captured": 1000,
  "amount_refunded": 0,
  "application": null,
  "application_fee": null,
  "application_fee_amount": null,
  "balance_transaction": "txn_1032Rp2eZvKYlo2CpErRBj09",
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
  "created": 1701937169,
  "currency": "usd",
  "customer": null,
  "description": "Created by docs.stripe.com/ demo",
  "disputed": false,
  "failure_balance_transaction": null,
  "failure_code": null,
  "failure_message": null,
  "fraud_details": {},
  "invoice": null,
  "livemode": false,
  "metadata": {
    "order_id": "6735"
  },
  "on_behalf_of": null,
  "outcome": {
    "network_status": "approved_by_network",
    "reason": null,
    "risk_level": "normal",
    "risk_score": 23,
    "seller_message": "Payment complete.",
    "type": "authorized"
  },
  "paid": true,
  "payment_intent": "pi_1Gt0RG2eZvKYlo2CtxkQK2rm",
  "payment_method": "pm_1OKcns2eZvKYlo2CKsdIIi44",
  "payment_method_details": {
    "card": {
      "amount_authorized": 1000,
      "brand": "visa",
      "checks": {
        "address_line1_check": null,
        "address_postal_code_check": null,
        "cvc_check": "pass"
      },
      "country": "US",
      "exp_month": 12,
      "exp_year": 2024,
      "extended_authorization": {
        "status": "disabled"
      },
      "fingerprint": "Xt5EWLLDS7FJjR1c",
      "funding": "credit",
      "incremental_authorization": {
        "status": "unavailable"
      },
      "installments": null,
      "last4": "4242",
      "mandate": null,
      "moto": null,
      "multicapture": {
        "status": "unavailable"
      },
      "network": "visa",
      "network_token": {
        "used": false
      },
      "overcapture": {
        "maximum_amount_capturable": 1000,
        "status": "unavailable"
      },
      "three_d_secure": null,
      "wallet": null
    },
    "type": "card"
  },
  "radar_options": {},
  "receipt_email": null,
  "receipt_number": "1684-0467",
  "receipt_url": "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xMDMyRDgyZVp2S1lsbzJDKP6nmbIGMga3cB9wS6A6LBZL8h0qdoMC7kO1KupX02DAl5VwFXa4PrlrciExsDqlMq4dJYzVswnEzUi4",
  "redaction": null,
  "refunded": false,
  "refunds": {
    "object": "list",
    "data": [],
    "has_more": false,
    "url": "/v1/charges/ch_1OKcnt2eZvKYlo2C99k9lfXl/refunds"
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

stripe get /v1/charges --limit 50

stripe get /v1/subscriptions -d status=past_due \
    | jq ".data[].id" \
    | xargs -I % -p stripe delete /subscriptions/%'
stripe post <path> [flags]
Make POST HTTP requests to the Stripe API. The post command supports API features like idempotency keys and expandable objects.

See the API reference for a complete list of supported URL paths.

Arguments
<path>
string
URL path of the API object to either create or update.

Flags
-c, --confirm
Skip the warning prompt and automatically confirm the command being entered.

--dark-style
Use a darker color scheme better suited for lighter command-line environments.

-d, --data <value>
stringArray
Additional data to send with an API request. Supports setting nested values (e.g nested[param]=value).

-e, --expand <value>
stringArray
Response attributes to expand inline (target nested values with nested[param]=value).

-i, --idempotency <key>
string
Set an idempotency key for the request, preventing the same request from replaying within 24 hours.

--live
Make a live request (by default, runs in test mode).

-s, --show-headers
Show response HTTP headers.

--stripe-account <account_id>
string
Specify the Stripe account to use for this request.

-v, --stripe-version <version>
string
Specify the Stripe API version to use for this request.

Was this section helpful?YesNo


stripe post /v1/payment_intents \
    -d amount=2000 \
    -d currency=usd \
    -d "payment_method_types[]=card"

{
  "id": "pi_1Gt0Ix2eZvKYlo2CwZBLZZfa",
  "object": "payment_intent",
  "amount": 2000,
  "amount_capturable": 0,
  "amount_details": {
    "tip": {}
  },
  "amount_received": 0,
  "application": null,
  "application_fee_amount": null,
  "automatic_payment_methods": null,
  "canceled_at": null,
  "cancellation_reason": null,
  "capture_method": "automatic",
  "client_secret": "pi_1Gt0Ix2eZvKYlo2CwZBLZZfa_secret_3LwqYVg0STglik0tqpkBQodvA",
  "confirmation_method": "automatic",
  "created": 1591919971,
  "currency": "usd",
  "customer": null,
  "description": "Created by docs.stripe.com/ demo",
  "invoice": null,
  "last_payment_error": null,
  "latest_charge": null,
  "livemode": false,
  "metadata": {},
  "next_action": null,
  "on_behalf_of": null,
  "payment_method": null,
  "payment_method_configuration_details": null,
  "payment_method_options": {
    "card": {
      "installments": null,
      "mandate_options": null,
      "network": null,
      "request_three_d_secure": "automatic"
    }
  },
  "payment_method_types": [
    "card"
  ],
  "processing": null,
  "receipt_email": null,
  "redaction": null,
  "review": null,
  "setup_future_usage": null,
  "shipping": null,
  "statement_descriptor": null,
  "statement_descriptor_suffix": null,
  "status": "requires_payment_method",
  "transfer_data": null,
  "transfer_group": null
}
stripe delete <path> [flags]
Make DELETE HTTP requests to the Stripe API.

See the API reference for a complete list of supported URL paths.

Arguments
<path>
string
URL path of the API object to delete.

Flags
-c, --confirm
Skip the warning prompt and automatically confirm the command being entered.

--dark-style
Use a darker color scheme better suited for lighter command-line environments.

-d, --data <value>
stringArray
Additional data to send with an API request. Supports setting nested values (e.g nested[param]=value).

-e, --expand <value>
stringArray
Response attributes to expand inline (target nested values with nested[param]=value).

-i, --idempotency <key>
string
Set an idempotency key for the request, preventing the same request from replaying within 24 hours.

--live
Make a live request (by default, runs in test mode).

-s, --show-headers
Show response HTTP headers.

--stripe-account <account_id>
string
Specify the Stripe account to use for this request.

-v, --stripe-version <version>
string
Specify the Stripe API version to use for this request.

Was this section helpful?YesNo


stripe delete /v1/customers/cus_9s6XKzkNRiz8i3

Are you sure you want to perform the command: DELETE?
Enter 'yes' to confirm:

{
  "id": "cus_9s6XKzkNRiz8i3",
  "object": "customer",
  "deleted": true
}
stripe fixtures <filepath> [flags]
Use a JSON file to issue a series of API requests. This can be useful when generating sample data, executing specific flows, or testing API behavior.

The structure of the JSON file outlines the set of requests to perform, known as fixture requests. When you specify a request's name, the CLI stores the response so you can reference the output in subsequent requests. The path property specifies the Stripe URL route for the API resource used in the request (e.g. /v1/customers).

For example, to reference the response for the request named json_path:

Accessing attributes in responses: ${name:json_path}
Accessing environment variables: ${.env:VARIABLE_NAME|<optional default value>}

Fixture queries must start with ${ and end with } and can be included in fixture requests. name is the name of the request assigned as part of the fixture (fixtures[].name) and json_path is a dot-path to the specific variable requested. For example:

Use ${cus_jenny_rosen:id} to access a top-level attribute.
Use ${cus_jenny_rosen:billing_details.address.country} to access nested data.
Use {cus_jenny_rosen:subscriptions.data.#.id} to access data within a list at index #.
Use ${.env:PHONE} to access environment variables (supports .env files).

Environment variables can specify default values with the pipe character (|). For example:

${.env:EMAIL|jane@stripe.com}
${.env:CUSTOMER|cus_1234}

Arguments
<filepath>
string
Use the JSON file at the given path that includes fixture requests to run.

Fields
_meta
object
Metadata used by CLI during execution.

Show _meta properties
fixtures
object
List of requests to execute.

Show fixture properties
Flags
--override [param]:[path1].[path2]=[value]
Override parameters in the fixture. Example: --override plan:product.name=overrideName

--add [param]:[path1].[path2]=[value]
Add parameters in the fixture. Example: --add customer:name=TestUser

--remove [param]:[path1].[path2]
Remove parameters from the fixture. Example: --remove customer:description

--skip [param]
Skip specific steps in the fixture. Example: --skip cus_jenny_rosen

Was this section helpful?YesNo


{
  "_meta": {
    "template_version": 0
  },
  "fixtures": [
    {
      "name": "cus_jenny_rosen",
      "path": "/v1/customers",
      "method": "post",
      "params": {
        "name": "Jenny Rosen"
      }
    },
    {
      "name": "pi_jenny_rosen",
      "path": "/v1/payment_intents",
      "method": "post",
      "params": {
        "customer": "${cus_jenny_rosen:id}",
        "amount": 2000,
        "currency": "usd",
        "payment_method": "pm_card_visa",
        "capture_method": "manual",
        "return_url": "https://www.example.com",
        "confirm": true
      }
    },
    {
      "name": "pi_jenny_rosen_capture",
      "path": "/v1/payment_intents/${pi_jenny_rosen:id}/capture",
      "method": "post"
    }
  ]
}

stripe fixtures ./fixtures.json

Setting up fixture for: cus_jenny_rosen
Setting up fixture for: pi_jenny_rosen
Setting up fixture for: pi_jenny_rosen_capture
Stripe Samples
Stripe Samples are complete examples that make it easy to get started with a new Stripe integration. Samples are available for different integration patterns, languages, and frameworks.

The Stripe CLI allows you to download, build, and serve samples to a local directory from your command line.

Was this section helpful?YesNo

stripe samples create <arguments> [--force-refresh]
Create a local copy of a sample, choosing which integration pattern and programming language to use for the client and server. The configuration is automatically bootstrapped when possible.

Arguments
<sample>
string
Name of the sample used to create a local copy.

<path>
string
Destination path for the created sample.

Flags
--force-refresh
Force a refresh of the cached list of Stripe Samples.

Was this section helpful?YesNo


stripe samples create accept-a-payment

stripe samples create accept-a-payment ./accept-a-payment-sample
stripe samples list
A list of available Stripe Samples that can be created and bootstrapped by the CLI.

See the complete list of Stripe Samples.

Was this section helpful?YesNo


stripe samples list

A list of available Stripe Samples:

accept-a-payment
Learn how to accept a payment
Repo: https://github.com/stripe-samples/accept-a-payment

card-brand-choice
Supporting Card Brand Choice with Stripe.
Repo: https://github.com/stripe-samples/card-brand-choice

charging-a-saved-card
Learn how to charge a saved card
Repo: https://github.com/stripe-samples/charging-a-saved-card
...
stripe serve <base_path> [--port <port_number>]
Start an HTTP server to serve static files. By default, the current working directory will be used.

This command works well alongside Stripe Samples, so you can easily serve files from any local copy of a Sample.

Arguments
<base_path>
string
Path of the directory to serve files from.

Flags
--port <port_number>
string | integer
Port the HTTP server should use.

Was this section helpful?YesNo


stripe serve ./sales-tax-sample

Starting stripe server at address http://localhost:4242
::1 - - [28/Jan/2022:14:00:00 -0800] "GET / HTTP/1.1" 200 175
...
Additional commands
See additional functionality supported by the Stripe CLI.

stripe terminal quickstart [--api-key=<api-key>]
Use the terminal quickstart command to get up and running fast with Stripe Terminal and the Verifone P400 reader.

Flags
--api-key=<api-key>
This CLI command only supports using the --api-key flag.

Was this section helpful?YesNo


stripe terminal quickstart
stripe logout [flags]
Use the logout command to remove all credentials that connect the CLI to your Stripe account.

By default, credentials will be removed for the default project. Alternatively, you can remove credentials for a specific project or all known projects listed in your configuration file.

It will take about 24 hours from when you log out for your device's name to stop showing up on the account's dashboard.

Flags
-a, --all
Remove credentials for all projects listed in your configuration.

--project-name=<project>
Remove the credentials tied to a specific project in your configuration.

Was this section helpful?YesNo


stripe logout

stripe logout --project-name=rocket-rides

stripe logout --all
stripe feedback
Prints information about how to provide feedback for the Stripe CLI using GitHub issues and the CLI feedback form.

Was this section helpful?YesNo


stripe feedback

We'd love to know what you think of the CLI:

* Report bugs or issues on GitHub:
  https://github.com/stripe/stripe-cli/issues

* Leave us feedback on features you would like to see:
  https://stri.pe/cli-feedback
stripe help
Get help for any command in CLI with stripe help [path to command].

Every command will also accept the -h or --help flag to see help for that command.

Was this section helpful?YesNo


stripe help login

Login to your Stripe account to setup the CLI

Usage:
  stripe login [flags]

Flags:
  -h, --help          help for login
...
stripe version
Get the version of the Stripe CLI and check if software updates are available.

Was this section helpful?YesNo


stripe version

stripe version 1.3.0
A newer version of the Stripe CLI is available.
Further information
See additional information how the Stripe CLI operates.

Using with Docker
A Docker image allows you to run the Stripe CLI in a container.

You can set two environment variables that the CLI will use:

STRIPE_API_KEY: the API key to use for the CLI.
STRIPE_DEVICE_NAME: the device name for the CLI, visible in the Dashboard.

Since Docker containers are ephemeral, stripe-cli login cannot be used without defining a data volume. You can use the --api-key flag instead.

Was this section helpful?YesNo


docker run --rm -it stripe/stripe-cli listen \
    --api-key sk_test_REMOVED_FROM_GIT
Telemetry
The Stripe CLI includes a telemetry feature that collects some usage data. This feature is enabled by default.

To opt out of telemetry, set the STRIPE_CLI_TELEMETRY_OPTOUT environment variable to 1 or true.

License
The Stripe CLI is licensed under the Apache License 2.0 and verified on GitHub as being owned by Stripe.

