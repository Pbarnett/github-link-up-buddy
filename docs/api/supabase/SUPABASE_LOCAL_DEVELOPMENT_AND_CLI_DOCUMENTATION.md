
Local Development & CLI
Learn how to develop locally and use the Supabase CLI

Develop locally while running the Supabase stack on your machine.
Quickstart#
Install the Supabase CLI:
npm
yarn
pnpm
brew
npm install supabase --save-dev
In your repo, initialize the Supabase project:
npm
yarn
pnpm
brew
npx supabase init
Start the Supabase stack:
npm
yarn
pnpm
brew
npx supabase start
As a prerequisite, you must install a container runtime compatible with Docker APIs.
Docker Desktop (macOS, Windows, Linux)
Rancher Desktop (macOS, Windows, Linux)
Podman (macOS, Windows, Linux)
OrbStack (macOS)
View your local Supabase instance at http://localhost:54323.
Local development#
Local development with Supabase allows you to work on your projects in a self-contained environment on your local machine. Working locally has several advantages:
Faster development: You can make changes and see results instantly without waiting for remote deployments.
Offline work: You can continue development even without an internet connection.
Cost-effective: Local development is free and doesn't consume your project's quota.
Enhanced privacy: Sensitive data remains on your local machine during development.
Easy testing: You can experiment with different configurations and features without affecting your production environment.
To get started with local development, you'll need to install the Supabase CLI and Docker. The Supabase CLI allows you to start and manage your local Supabase stack, while Docker is used to run the necessary services.
Once set up, you can initialize a new Supabase project, start the local stack, and begin developing your application using local Supabase services. This includes access to a local Postgres database, Auth, Storage, and other Supabase features.
CLI#
The Supabase CLI is a powerful tool that enables developers to manage their Supabase projects directly from the terminal. It provides a suite of commands for various tasks, including:
Setting up and managing local development environments
Generating TypeScript types for your database schema
Handling database migrations
Managing environment variables and secrets
Deploying your project to the Supabase platform
With the CLI, you can streamline your development workflow, automate repetitive tasks, and maintain consistency across different environments. It's an essential tool for both local development and CI/CD pipelines.

Supabase CLI
Develop locally, deploy to the Supabase Platform, and set up CI/CD workflows

The Supabase CLI enables you to run the entire Supabase stack locally, on your machine or in a CI environment. With just two commands, you can set up and start a new local project:
supabase init to create a new local project
supabase start to launch the Supabase services
Installing the Supabase CLI#
macOS
Windows
Linux
nodejs
Run the CLI by prefixing each command with npx or bunx:
npx supabase --help
You can also install the CLI as dev dependency via npm:
npm install supabase --save-dev
Updating the Supabase CLI#
When a new version is released, you can update the CLI using the same methods.
macOS
Windows
Linux
nodejs
If you have installed the CLI as dev dependency via npm, you can update it with:
npm update supabase --save-dev
If you have any Supabase containers running locally, stop them and delete their data volumes before proceeding with the upgrade. This ensures that Supabase managed services can apply new migrations on a clean state of the local database.
Backup and stop running containers
Remember to save any local schema and data changes before stopping because the --no-backup flag will delete them.
supabase db diff -f my_schema
supabase db dump --local --data-only > supabase/seed.sql
supabase stop --no-backup
Running Supabase locally#
The Supabase CLI uses Docker containers to manage the local development stack. Follow the official guide to install and configure Docker Desktop:
macOS
Windows

Alternately, you can use a different container tool that offers Docker compatible APIs.
Rancher Desktop (macOS, Windows, Linux)
Podman (macOS, Windows, Linux)
OrbStack (macOS)
colima (macOS)
Inside the folder where you want to create your project, run:
supabase init
This will create a new supabase folder. It's safe to commit this folder to your version control system.
Now, to start the Supabase stack, run:
supabase start
This takes time on your first run because the CLI needs to download the Docker images to your local machine. The CLI includes the entire Supabase toolset, and a few additional images that are useful for local development (like a local SMTP server and a database diff tool).
Access your project's services#
Once all of the Supabase services are running, you'll see output containing your local Supabase credentials. It should look like this, with urls and keys that you'll use in your local project:
Started supabase local development setup.
        API URL: http://localhost:54321
         DB URL: postgresql://postgres:postgres@localhost:54322/postgres
     Studio URL: http://localhost:54323
   Inbucket URL: http://localhost:54324
       anon key: eyJh......
service_role key: eyJh......
Studio
Postgres
API Gateway
Analytics
# Default URL:
http://localhost:54323
The local development environment includes Supabase Studio, a graphical interface for working with your database.

Stopping local services#
When you are finished working on your Supabase project, you can stop the stack (without resetting your local database):
supabase stop
Learn more#
CLI configuration
CLI reference


Supabase CLI config

A supabase/config.toml file is generated after running supabase init.
You can edit this file to change the settings for your locally running project. After you make changes, you will need to restart using supabase stop and then supabase start for the changes to take effect.
General Config#
project_id#
Name
Default
Required
project_id
None
true

Description
A string used to distinguish different Supabase projects on the same host. Defaults to the working directory name when running supabase init.
Auth Config#
auth.enabled#
Name
Default
Required
auth.enabled
true
false

Description
Enable the local GoTrue service.
See also
Auth Server configuration
auth.site_url#
Name
Default
Required
auth.site_url
"http://localhost:3000"
false

Description
The base URL of your website. Used as an allow-list for redirects and for constructing URLs used in emails.
See also
Auth Server configuration
auth.additional_redirect_urls#
Name
Default
Required
auth.additional_redirect_urls
["https://localhost:3000"]
false

Description
A list of exact URLs that auth providers are permitted to redirect to post authentication.
See also
Auth Server configuration
auth.jwt_expiry#
Name
Default
Required
auth.jwt_expiry
3600
false

Description
How long tokens are valid for, in seconds. Defaults to 3600 (1 hour), maximum 604,800 seconds (one week).
See also
Auth Server configuration
auth.enable_manual_linking#
Name
Default
Required
auth.enable_manual_linking
false
false

Description
Allow testing manual linking of accounts
See also
Anonymous Sign Ins (Manual Linking)
auth.enable_refresh_token_rotation#
Name
Default
Required
auth.enable_refresh_token_rotation
true
false

Description
If disabled, the refresh token will never expire.
See also
Auth Server configuration
auth.refresh_token_reuse_interval#
Name
Default
Required
auth.refresh_token_reuse_interval
10
false

Description
Allows refresh tokens to be reused after expiry, up to the specified interval in seconds. Requires enable_refresh_token_rotation = true.
See also
Auth Server configuration
auth.rate_limit.email_sent#
Name
Default
Required
auth.rate_limit.email_sent
2
false

Description
Number of emails that can be sent per hour. Requires auth.email.smtp to be enabled.
See also
Auth Server configuration
auth.rate_limit.sms_sent#
Name
Default
Required
auth.rate_limit.sms_sent
30
false

Description
Number of SMS messages that can be sent per hour. Requires auth.sms to be enabled.
See also
Auth Server configuration
auth.rate_limit.anonymous_users#
Name
Default
Required
auth.rate_limit.anonymous_users
30
false

Description
Number of anonymous sign-ins that can be made per hour per IP address. Requires enable_anonymous_sign_ins = true.
See also
Auth Server configuration
auth.rate_limit.token_refresh#
Name
Default
Required
auth.rate_limit.token_refresh
150
false

Description
Number of sessions that can be refreshed in a 5 minute interval per IP address.
See also
Auth Server configuration
auth.rate_limit.sign_in_sign_ups#
Name
Default
Required
auth.rate_limit.sign_in_sign_ups
30
false

Description
Number of sign up and sign-in requests that can be made in a 5 minute interval per IP address (excludes anonymous users).
See also
Auth Server configuration
auth.rate_limit.token_verifications#
Name
Default
Required
auth.rate_limit.token_verifications
30
false

Description
Number of OTP / Magic link verifications that can be made in a 5 minute interval per IP address.
See also
Auth Server configuration
auth.enable_signup#
Name
Default
Required
auth.enable_signup
true
false

Description
Allow/disallow new user signups to your project.
See also
Auth Server configuration
auth.enable_anonymous_sign_ins#
Name
Default
Required
auth.enable_anonymous_sign_ins
false
false

Description
Allow/disallow anonymous sign-ins to your project.
See also
Anonymous Sign Ins
auth.email.enable_signup#
Name
Default
Required
auth.email.enable_signup
true
false

Description
Allow/disallow new user signups via email to your project.
See also
Auth Server configuration
auth.email.double_confirm_changes#
Name
Default
Required
auth.email.double_confirm_changes
true
false

Description
If enabled, a user will be required to confirm any email change on both the old, and new email addresses. If disabled, only the new email is required to confirm.
See also
Auth Server configuration
auth.email.enable_confirmations#
Name
Default
Required
auth.email.enable_confirmations
false
false

Description
If enabled, users need to confirm their email address before signing in.
See also
Auth Server configuration
auth.email.secure_password_change#
Name
Default
Required
auth.email.secure_password_change
None
false

Description
If enabled, requires the user's current password to be provided when changing to a new password.
See also
Auth Server configuration
auth.email.max_frequency#
Name
Default
Required
auth.email.max_frequency
1m
false

Description
The minimum amount of time that must pass between email requests.
Helps prevent email spam by limiting how frequently emails can be sent.
Example values: "1m", "1h", "24h"
See also
Auth Server configuration
auth.email.otp_length#
Name
Default
Required
auth.email.otp_length
6
false

Description
The length of the OTP code to be sent in emails.
Must be between 6 and 10 digits.
See also
Auth Server configuration
auth.email.otp_expiry#
Name
Default
Required
auth.email.otp_expiry
3600
false

Description
The expiry time for an OTP code in seconds.
Default is 3600 seconds (1 hour).
See also
Auth Server configuration
auth.email.smtp.host#
Name
Default
Required
auth.email.smtp.host
inbucket
false

Description
Hostname or IP address of the SMTP server.
auth.email.smtp.port#
Name
Default
Required
auth.email.smtp.port
2500
false

Description
Port number of the SMTP server.
auth.email.smtp.user#
Name
Default
Required
auth.email.smtp.user
None
false

Description
Username for authenticating with the SMTP server.
auth.email.smtp.pass#
Name
Default
Required
auth.email.smtp.pass
None
false

Description
Password for authenticating with the SMTP server.
auth.email.smtp.admin_email#
Name
Default
Required
auth.email.smtp.admin_email
admin@email.com
false

Description
Email used as the sender for emails sent from the application.
auth.email.smtp.sender_name#
Name
Default
Required
auth.email.smtp.sender_name
None
false

Description
Display name used as the sender for emails sent from the application.
auth.email.template.<type>.subject#
Name
Default
Required
auth.email.template.type.subject
None
false

Description
The full list of email template types are:
invite
confirmation
recovery
magic_link
email_change
See also
Auth Server configuration
auth.email.template.<type>.content_path#
Name
Default
Required
auth.email.template.type.content_path
None
false

Description
The full list of email template types are:
invite
confirmation
recovery
magic_link
email_change
See also
Auth Server configuration
auth.sms.enable_signup#
Name
Default
Required
auth.sms.enable_signup
true
false

Description
Allow/disallow new user signups via SMS to your project.
See also
Auth Server configuration
auth.sms.enable_confirmations#
Name
Default
Required
auth.sms.enable_confirmations
false
false

Description
If enabled, users need to confirm their phone number before signing in.
See also
Auth Server configuration
auth.sms.test_otp#
Name
Default
Required
auth.sms.test_otp
None
false

Description
Use pre-defined map of phone number to OTP for testing.
Usage
1[auth.sms.test_otp]
24152127777 = "123456"
See also
Auth Server configuration
auth.sms.<provider>.enabled#
Name
Default
Required
auth.sms.provider.enabled
false
false

Description
Use an external SMS provider. The full list of providers are:
twilio
twilio_verify
messagebird
textlocal
vonage
See also
Auth Server configuration
auth.sms.<twilio|twilio_verify>.account_sid#
Name
Default
Required
auth.sms.twilio.account_sid
None
true

Description
Twilio Account SID
See also
Auth Server configuration
auth.sms.<twilio|twilio_verify>.message_service_sid#
Name
Default
Required
auth.sms.twilio.message_service_sid
None
true

Description
Twilio Message Service SID
See also
Auth Server configuration
auth.sms.<twilio|twilio_verify>.auth_token#
Name
Default
Required
auth.sms.twilio.auth_token
env(SUPABASE_AUTH_SMS_TWILIO_AUTH_TOKEN)
true

Description
Twilio Auth Token
DO NOT commit your Twilio auth token to git. Use environment variable substitution instead.
See also
Auth Server configuration
auth.sms.messagebird.originator#
Name
Default
Required
auth.sms.messagebird.originator
None
true

Description
MessageBird Originator
See also
Auth Server configuration
auth.sms.messagebird.access_key#
Name
Default
Required
auth.sms.messagebird.access_key
env(SUPABASE_AUTH_SMS_MESSAGEBIRD_ACCESS_KEY)
true

Description
MessageBird Access Key
DO NOT commit your MessageBird access key to git. Use environment variable substitution instead.
See also
Auth Server configuration
auth.sms.textlocal.sender#
Name
Default
Required
auth.sms.textlocal.sender
None
true

Description
TextLocal Sender
See also
Auth Server configuration
auth.sms.textlocal.api_key#
Name
Default
Required
auth.sms.textlocal.api_key
env(SUPABASE_AUTH_SMS_TEXTLOCAL_API_KEY)
true

Description
TextLocal API Key
DO NOT commit your TextLocal API key to git. Use environment variable substitution instead.
See also
Auth Server configuration
auth.sms.vonage.from#
Name
Default
Required
auth.sms.vonage.from
None
true

Description
Vonage From
See also
Auth Server configuration
auth.sms.vonage.api_key#
Name
Default
Required
auth.sms.vonage.api_key
None
true

Description
Vonage API Key
See also
Auth Server configuration
auth.sms.vonage.api_secret#
Name
Default
Required
auth.sms.vonage.api_secret
env(SUPABASE_AUTH_SMS_VONAGE_API_SECRET)
true

Description
Vonage API Secret
DO NOT commit your Vonage API secret to git. Use environment variable substitution instead.
See also
Auth Server configuration
auth.external.<provider>.enabled#
Name
Default
Required
auth.external.provider.enabled
false
false

Description
Use an external OAuth provider. The full list of providers are:
apple
azure
bitbucket
discord
facebook
github
gitlab
google
kakao
keycloak
linkedin_oidc
notion
twitch
twitter
slack_oidc
spotify
workos
zoom
See also
Auth Server configuration
auth.external.<provider>.client_id#
Name
Default
Required
auth.external.provider.client_id
None
true

Description
Client ID for the external OAuth provider.
See also
Auth Server configuration
auth.external.<provider>.secret#
Name
Default
Required
auth.external.provider.secret
env(SUPABASE_AUTH_EXTERNAL_<PROVIDER>_SECRET)
true

Description
Client secret for the external OAuth provider.
DO NOT commit your OAuth provider secret to git. Use environment variable substitution instead.
See also
Auth Server configuration
auth.external.<provider>.url#
Name
Default
Required
auth.external.provider.url
None
false

Description
The base URL used for constructing the URLs to request authorization and
access tokens. Used by gitlab and keycloak. For gitlab it defaults to
https://gitlab.com. For keycloak you need to set this to your instance,
for example: https://keycloak.example.com/realms/myrealm .
See also
Auth Server configuration
auth.external.<provider>.redirect_uri#
Name
Default
Required
auth.external.provider.redirect_uri
None
false

Description
The URI a OAuth2 provider will redirect to with the code and state values.
See also
Auth Server configuration
auth.external.<provider>.skip_nonce_check#
Name
Default
Required
auth.external.provider.skip_nonce_check
None
false

Description
Disables nonce validation during OIDC authentication flow for the specified provider. Enable only when client libraries cannot properly handle nonce verification. Be aware that this reduces security by allowing potential replay attacks with stolen ID tokens.
See also
Auth Server configuration
auth.hook.<hook_name>.enabled#
Name
Default
Required
auth.hook.<hook_name>.enabled
false
false

Description
Enable Auth Hook. Possible values for hook_name are: custom_access_token, send_sms, send_email, mfa_verification_attempt, and password_verification_attempt.
See also
Auth Hooks
auth.hook.<hook_name>.uri#
Name
Default
Required
auth.hook.<hook_name>.uri
None
false

Description
URI of hook to invoke. Should be a http or https function or Postgres function taking the form: pg-functions://<database>/<schema>/<function-name>. For example, pg-functions://postgres/auth/custom-access-token-hook.
See also
Auth Hooks
auth.hook.<hook_name>.secrets#
Name
Default
Required
auth.hook.<hook_name>.secrets
None
false

Description
Configure when using a HTTP Hooks. Takes a list of base64 comma separated values to allow for secret rotation. Currently, Supabase Auth uses only the first value in the list.
See also
Auth Hooks
auth.mfa.totp.enroll_enabled#
Name
Default
Required
auth.mfa.totp.enroll_enabled
true
false

Description
Enable TOTP enrollment for multi-factor authentication.
See also
Auth Multi-Factor Authentication (TOTP)
auth.mfa.totp.verify_enabled#
Name
Default
Required
auth.mfa.totp.verify_enabled
true
false

Description
Enable TOTP verification for multi-factor authentication.
See also
Auth Multi-Factor Authentication (TOTP)
auth.mfa.max_enrolled_factors#
Name
Default
Required
auth.mfa.max_enrolled_factors
10
false

Description
Control how many MFA factors can be enrolled at once per user.
See also
Auth Multi-Factor Authentication (TOTP)
auth.mfa.phone.enroll_enabled#
Name
Default
Required
auth.mfa.phone.enroll_enabled
false
false

Description
Enable Phone enrollment for multi-factor authentication.
See also
Auth Multi-Factor Authentication (Phone)
auth.mfa.phone.otp_length#
Name
Default
Required
auth.mfa.phone.otp_length
6
false

Description
Length of OTP code sent when using phone multi-factor authentication
See also
Auth Multi-Factor Authentication (Phone)
auth.mfa.phone.max_frequency#
Name
Default
Required
auth.mfa.phone.max_frequency
10s
false

Description
The minimum amount of time that must pass between phone requests.
Helps prevent spam by limiting how frequently messages can be sent.
Example values: "10s", "20s", "1m"
See also
Auth Multi-Factor Authentication (Phone)
auth.mfa.phone.otp_length#
Name
Default
Required
auth.mfa.phone.otp_length
6
false

Description
Length of OTP sent when using phone multi-factor authentication
See also
Auth Multi-Factor Authentication (Phone)
auth.mfa.phone.verify_enabled#
Name
Default
Required
auth.mfa.phone.verify_enabled
false
false

Description
Enable Phone verification for multi-factor authentication.
See also
Auth Multi-Factor Authentication (Phone)
auth.mfa.web_authn.enroll_enabled#
Name
Default
Required
auth.mfa.web_authn.enroll_enabled
false
false

Description
Enable WebAuthn enrollment for multi-factor authentication.
See also
Auth Multi-Factor Authentication
auth.mfa.web_authn.verify_enabled#
Name
Default
Required
auth.mfa.web_authn.verify_enabled
false
false

Description
Enable WebAuthn verification for multi-factor authentication.
See also
Auth Multi-Factor Authentication
auth.sessions.timebox#
Name
Default
Required
auth.sessions.timebox
None
false

Description
Force log out after the specified duration. Sample values include: '50m', '20h'.
See also
Auth Sessions
auth.sessions.inactivity_timeout#
Name
Default
Required
auth.sessions.inactivity_timeout
None
false

Description
Force log out if the user has been inactive longer than the specified duration. Sample values include: '50m', '20h'.
See also
Auth Sessions
auth.third_party.aws_cognito.enabled#
Name
Default
Required
auth.third_party.aws_cognito.enabled
false
false

Description
Enable third party auth with AWS Cognito (Amplify)
See also
Third Party Auth (Cognito)
auth.third_party.aws_cognito.user_pool_id#
Name
Default
Required
auth.third_party.aws_cognito.user_pool_id
false
false

Description
User Pool ID for AWS Cognito (Amplify) that you are integrating with
See also
Third Party Auth (Cognito)
auth.third_party.aws_cognito.user_pool_region#
Name
Default
Required
auth.third_party.aws_cognito.user_pool_region
false
false

Description
User Pool region for AWS Cognito (Amplify) that you are integrating with. Example values: 'ap-southeast-1', 'us-east-1'
See also
Third Party Auth (Cognito)
auth.third_party.auth0.enabled#
Name
Default
Required
auth.third_party.auth0.enabled
false
false

Description
Enable third party auth with Auth0
See also
Third Party Auth (Auth0)
auth.third_party.auth0.tenant#
Name
Default
Required
auth.third_party.auth0.tenant
false
false

Description
Tenant Identifier for Auth0 instance that you are integrating with
See also
Third Party Auth (Auth0)
auth.third_party.tenant_region#
Name
Default
Required
auth.third_party.auth0.tenant_region
false
false

Description
Tenant region for Auth0 instance that you are integrating with
See also
Third Party Auth (Auth0)
auth.third_party.firebase.enabled#
Name
Default
Required
auth.third_party.firebase.enabled
false
false

Description
Enable third party auth with Firebase
See also
Third Party Auth (Firebase)
auth.third_party.firebase.project_id#
Name
Default
Required
auth.third_party.firebase.project_id
false
false

Description
Project ID for Firebase instance that you are integrating with
See also
Third Party Auth (Firebase)
API Config#
api.enabled#
Name
Default
Required
api.enabled
true
false

Description
Enable the local PostgREST service.
See also
PostgREST configuration
api.port#
Name
Default
Required
api.port
54321
false

Description
Port to use for the API URL.
Usage
1[api]
2port = 54321
See also
PostgREST configuration
api.schemas#
Name
Default
Required
api.schemas
["public", "storage", "graphql_public"]
false

Description
Schemas to expose in your API. Tables, views and functions in this schema will get API endpoints. public and storage are always included.
See also
PostgREST configuration
api.extra_search_path#
Name
Default
Required
api.extra_search_path
["public", "extensions"]
false

Description
Extra schemas to add to the search_path of every request. public is always included.
See also
PostgREST configuration
api.max_rows#
Name
Default
Required
api.max_rows
1000
false

Description
The maximum number of rows returned from a view, table, or stored procedure. Limits payload size for accidental or malicious requests.
See also
PostgREST configuration
Database Config#
db.port#
Name
Default
Required
db.port
54322
false

Description
Port to use for the local database URL.
See also
PostgreSQL configuration
db.shadow_port#
Name
Default
Required
db.shadow_port
54320
false

Description
Port to use for the local shadow database.
See also
db.major_version#
Name
Default
Required
db.major_version
15
false

Description
The database major version to use. This has to be the same as your remote database's. Run SHOW server_version; on the remote database to check.
See also
PostgreSQL configuration
db.pooler.enabled#
Name
Default
Required
db.pooler.enabled
false
false

Description
Enable the local PgBouncer service.
See also
PgBouncer Configuration
db.pooler.port#
Name
Default
Required
db.pooler.port
54329
false

Description
Port to use for the local connection pooler.
See also
PgBouncer Configuration
db.pooler.pool_mode#
Name
Default
Required
db.pooler.pool_mode
"transaction"
false

Description
Specifies when a server connection can be reused by other clients. Configure one of the supported pooler modes: transaction, session.
See also
PgBouncer Configuration
db.pooler.default_pool_size#
Name
Default
Required
db.pooler.default_pool_size
20
false

Description
How many server connections to allow per user/database pair.
See also
PgBouncer Configuration
db.settings.effective_cache_size#
Name
Default
Required
db.settings.effective_cache_size
None
false

Description
Sets the planner's assumption about the effective size of the disk cache.
This is a query planner parameter that doesn't affect actual memory allocation.
See also
PostgreSQL configuration
db.settings.logical_decoding_work_mem#
Name
Default
Required
db.settings.logical_decoding_work_mem
None
false

Description
Specifies the amount of memory to be used by logical decoding, before writing data to local disk.
See also
PostgreSQL configuration
db.settings.maintenance_work_mem#
Name
Default
Required
db.settings.maintenance_work_mem
None
false

Description
Specifies the maximum amount of memory to be used by maintenance operations, such as VACUUM, CREATE INDEX, and ALTER TABLE ADD FOREIGN KEY.
See also
PostgreSQL configuration
db.settings.max_connections#
Name
Default
Required
db.settings.max_connections
None
false

Description
Determines the maximum number of concurrent connections to the database server.
Note: Changing this parameter requires a database restart.
See also
PostgreSQL configuration
db.settings.max_locks_per_transaction#
Name
Default
Required
db.settings.max_locks_per_transaction
None
false

Description
Controls the average number of object locks allocated for each transaction.
Note: Changing this parameter requires a database restart.
See also
PostgreSQL configuration
db.settings.max_parallel_maintenance_workers#
Name
Default
Required
db.settings.max_parallel_maintenance_workers
None
false

Description
Sets the maximum number of parallel workers that can be started by a single utility command.
See also
PostgreSQL configuration
db.settings.max_parallel_workers#
Name
Default
Required
db.settings.max_parallel_workers
None
false

Description
Sets the maximum number of parallel workers that the system can support.
Note: Changing this parameter requires a database restart.
See also
PostgreSQL configuration
db.settings.max_parallel_workers_per_gather#
Name
Default
Required
db.settings.max_parallel_workers_per_gather
None
false

Description
Sets the maximum number of parallel workers that can be started by a single Gather or Gather Merge node.
See also
PostgreSQL configuration
db.settings.max_replication_slots#
Name
Default
Required
db.settings.max_replication_slots
None
false

Description
Specifies the maximum number of replication slots that the server can support.
Note: Changing this parameter requires a database restart.
See also
PostgreSQL configuration
db.settings.max_slot_wal_keep_size#
Name
Default
Required
db.settings.max_slot_wal_keep_size
None
false

Description
Specifies the maximum size of WAL files that replication slots are allowed to retain in the pg_wal directory.
See also
PostgreSQL configuration
db.settings.max_standby_archive_delay#
Name
Default
Required
db.settings.max_standby_archive_delay
None
false

Description
Sets the maximum delay before canceling queries when a hot standby server is processing archived WAL data.
See also
PostgreSQL configuration
db.settings.max_standby_streaming_delay#
Name
Default
Required
db.settings.max_standby_streaming_delay
None
false

Description
Sets the maximum delay before canceling queries when a hot standby server is processing streamed WAL data.
See also
PostgreSQL configuration
db.settings.max_wal_size#
Name
Default
Required
db.settings.max_wal_size
None
false

Description
Sets the maximum size of WAL files that the system will keep in the pg_wal directory.
See also
PostgreSQL configuration
db.settings.max_wal_senders#
Name
Default
Required
db.settings.max_wal_senders
None
false

Description
Specifies the maximum number of concurrent connections from standby servers or streaming base backup clients.
Note: Changing this parameter requires a database restart.
See also
PostgreSQL configuration
db.settings.max_worker_processes#
Name
Default
Required
db.settings.max_worker_processes
None
false

Description
Sets the maximum number of background processes that the system can support.
Note: Changing this parameter requires a database restart.
See also
PostgreSQL configuration
db.settings.session_replication_role#
Name
Default
Required
db.settings.session_replication_role
None
false

Description
Controls whether triggers and rewrite rules are enabled. Valid values are: "origin", "replica", or "local".
See also
PostgreSQL configuration
db.settings.shared_buffers#
Name
Default
Required
db.settings.shared_buffers
None
false

Description
Sets the amount of memory the database server uses for shared memory buffers.
Note: Changing this parameter requires a database restart.
See also
PostgreSQL configuration
db.settings.statement_timeout#
Name
Default
Required
db.settings.statement_timeout
None
false

Description
Abort any statement that takes more than the specified amount of time.
See also
PostgreSQL configuration
db.settings.track_activity_query_size#
Name
Default
Required
db.settings.track_activity_query_size
None
false

Description
Sets the maximum size of the query string that will be tracked in pg_stat_activity.current_query field.
Note: Changing this parameter requires a database restart.
See also
PostgreSQL configuration
db.settings.track_commit_timestamp#
Name
Default
Required
db.settings.track_commit_timestamp
None
false

Description
Record commit time of transactions.
Note: Changing this parameter requires a database restart.
See also
PostgreSQL configuration
db.settings.wal_keep_size#
Name
Default
Required
db.settings.wal_keep_size
None
false

Description
Specifies the minimum size of past log file segments kept in the pg_wal directory.
See also
PostgreSQL configuration
db.settings.wal_sender_timeout#
Name
Default
Required
db.settings.wal_sender_timeout
None
false

Description
Terminate replication connections that are inactive for longer than this amount of time.
See also
PostgreSQL configuration
db.settings.work_mem#
Name
Default
Required
db.settings.work_mem
None
false

Description
Specifies the amount of memory to be used by internal sort operations and hash tables before writing to temporary disk files.
See also
PostgreSQL configuration
db.pooler.max_client_conn#
Name
Default
Required
db.pooler.max_client_conn
100
false

Description
Maximum number of client connections allowed.
See also
PgBouncer Configuration
db.seed.enabled#
Name
Default
Required
db.seed.enabled
true
false

Description
Enables running seeds when starting or resetting the database.
See also
db.seed.sql_paths#
Name
Default
Required
db.seed.sql_paths
["./seed.sql"]
false

Description
An array of files or glob patterns to find seeds in.
See also
Seeding your database
Dashboard Config#
studio.enabled#
Name
Default
Required
studio.enabled
true
false

Description
Enable the local Supabase Studio dashboard.
See also
studio.port#
Name
Default
Required
studio.port
54323
false

Description
Port to use for Supabase Studio.
See also
studio.api_url#
Name
Default
Required
studio.api_url
"http://localhost"
false

Description
External URL of the API server that frontend connects to.
See also
studio.openai_api_key#
Name
Default
Required
studio.openai_api_key
env(OPENAI_API_KEY)
false

Description
OpenAI API key used for AI features in the Studio dashboard.
DO NOT commit your OpenAI API key to git. Use environment variable substitution instead.
See also
OpenAI API Keys
Realtime Config#
realtime.enabled#
Name
Default
Required
realtime.enabled
true
false

Description
Enable the local Realtime service.
See also
realtime.ip_version#
Name
Default
Required
realtime.ip_version
"IPv6"
false

Description
Bind realtime via either IPv4 or IPv6. (default: IPv6)
See also
Storage Config#
storage.enabled#
Name
Default
Required
storage.enabled
true
false

Description
Enable the local Storage service.
See also
Storage server configuration
storage.file_size_limit#
Name
Default
Required
storage.file_size_limit
"50MiB"
false

Description
The maximum file size allowed for all buckets in the project.
See also
Storage server configuration
storage.buckets.<bucket_name>.public#
Name
Default
Required
storage.buckets.bucket_name.public
false
false

Description
Enable public access to the bucket.
See also
Storage server configuration
storage.buckets.<bucket_name>.file_size_limit#
Name
Default
Required
storage.buckets.bucket_name.file_size_limit
None
false

Description
The maximum file size allowed (e.g. "5MB", "500KB").
See also
Storage server configuration
storage.buckets.<bucket_name>.allowed_mime_types#
Name
Default
Required
storage.buckets.bucket_name.allowed_mime_types
None
false

Description
The list of allowed MIME types for objects in the bucket.
See also
Storage server configuration
storage.buckets.<bucket_name>.objects_path#
Name
Default
Required
storage.buckets.bucket_name.objects_path
None
false

Description
The local directory to upload objects to the bucket.
See also
Storage server configuration
Edge-Functions Config#
edge_runtime.enabled#
Name
Default
Required
edge_runtime.enabled
true
false

Description
Enable the local Edge Runtime service for Edge Functions.
See also
edge_runtime.policy#
Name
Default
Required
edge_runtime.policy
"oneshot"
false

Description
Configure the request handling policy for Edge Functions. Available options:
oneshot: Recommended for development with hot reload support
per_worker: Recommended for load testing scenarios
See also
edge_runtime.inspector_port#
Name
Default
Required
edge_runtime.inspector_port
8083
false

Description
Port to attach the Chrome inspector for debugging Edge Functions.
See also
functions.<function_name>.enabled#
Name
Default
Required
functions.function_name.enabled
true
false

Description
Controls whether a function is deployed or served. When set to false,
the function will be skipped during deployment and won't be served locally.
This is useful for disabling demo functions or temporarily disabling a function
without removing its code.
See also
`supabase functions` CLI subcommands
functions.<function_name>.verify_jwt#
Name
Default
Required
functions.function_name.verify_jwt
true
false

Description
By default, when you deploy your Edge Functions or serve them locally, it
will reject requests without a valid JWT in the Authorization header.
Setting this configuration changes the default behavior.
Note that the --no-verify-jwt flag overrides this configuration.
See also
`supabase functions` CLI subcommands
functions.<function_name>.import_map#
Name
Default
Required
functions.function_name.import_map
None
false

Description
Specify the Deno import map file to use for the Function.
When not specified, defaults to supabase/functions/<function_name>/deno.json.
Note that the --import-map flag overrides this configuration.
See also
`supabase functions` CLI subcommands
functions.<function_name>.entrypoint#
Name
Default
Required
functions.function_name.entrypoint
None
false

Description
Specify a custom entrypoint path for the function relative to the project root.
When not specified, defaults to supabase/functions/<function_name>/index.ts.
Usage
1[functions.my_function]
2entrypoint = "path/to/custom/function.ts"
See also
`supabase functions` CLI subcommands
functions.<function_name>.static_files#
Name
Default
Required
functions.function_name.static_files
None
false

Description
Specify an array of static files to be bundled with the function. Supports glob patterns.
NOTE: only file paths within functions directory are supported at the moment.
Usage
1[functions.my_function]
2static_files = [ "./functions/MY_FUNCTION_NAME/*.html", "./functions/MY_FUNCTION_NAME/custom.wasm" ]
See also
`supabase functions` CLI subcommands
Analytics Config#
analytics.enabled#
Name
Default
Required
analytics.enabled
false
false

Description
Enable the local Logflare service.
See also
Self-hosted Logflare Configuration
analytics.port#
Name
Default
Required
analytics.port
54327
false

Description
Port to the local Logflare service.
See also
analytics.vector_port#
Name
Default
Required
analytics.vector_port
54328
false

Description
Port to the local syslog ingest service.
See also
analytics.backend#
Name
Default
Required
analytics.backend
"postgres"
false

Description
Configure one of the supported backends:
postgres
bigquery
See also
Self-hosted Logflare Configuration
Experimental Config#
experimental.webhooks.enabled#
Name
Default
Required
experimental.webhooks.enabled
false
false

Description
Automatically enable webhook features on each new created branch
Note: This is an experimental feature and may change in future releases.
See also
experimental.orioledb_version#
Name
Default
Required
experimental.orioledb_version
None
false

Description
Configures Postgres storage engine to use OrioleDB with S3 support.
Note: This is an experimental feature and may change in future releases.
See also
experimental.s3_host#
Name
Default
Required
experimental.s3_host
env(S3_HOST)
false

Description
Configures S3 bucket URL for OrioleDB storage.
Format example: <bucket_name>.s3-<region>.amazonaws.com
Note: This is an experimental feature and may change in future releases.
See also
experimental.s3_region#
Name
Default
Required
experimental.s3_region
env(S3_REGION)
false

Description
Configures S3 bucket region for OrioleDB storage.
Example: us-east-1
Note: This is an experimental feature and may change in future releases.
See also
experimental.s3_access_key#
Name
Default
Required
experimental.s3_access_key
env(S3_ACCESS_KEY)
false

Description
Configures AWS_ACCESS_KEY_ID for S3 bucket access.
DO NOT commit your AWS access key to git. Use environment variable substitution instead.
Note: This is an experimental feature and may change in future releases.
See also
experimental.s3_secret_key#
Name
Default
Required
experimental.s3_secret_key
env(S3_SECRET_KEY)
false

Description
Configures AWS_SECRET_ACCESS_KEY for S3 bucket access.
DO NOT commit your AWS secret key to git. Use environment variable substitution instead.
Note: This is an experimental feature and may change in future releases.
See also
Local Development Config#
inbucket.enabled#
Name
Default
Required
inbucket.enabled
true
false

Description
Enable the local InBucket service.
See also
Inbucket documentation
inbucket.port#
Name
Default
Required
inbucket.port
54324
false

Description
Port to use for the email testing server web interface.
Emails sent with the local dev setup are not actually sent - rather, they are monitored, and you can view the emails that would have been sent from the web interface.
See also
Inbucket documentation
inbucket.smtp_port#
Name
Default
Required
inbucket.smtp_port
54325
false

Description
Port to use for the email testing server SMTP port.
Emails sent with the local dev setup are not actually sent - rather, they are monitored, and you can view the emails that would have been sent from the web interface.
If set, you can access the SMTP server from this port.
See also
Inbucket documentation
inbucket.pop3_port#
Name
Default
Required
inbucket.pop3_port
54326
false

Description
Port to use for the email testing server POP3 port.
Emails sent with the local dev setup are not actually sent - rather, they are monitored, and you can view the emails that would have been sent from the web interface.
If set, you can access the POP3 server from this port.
See also
Inbucket documentation
inbucket.admin_email#
Name
Default
Required
inbucket.admin_email
admin@email.com
false

Description
Email used as the sender for emails sent from the application.
inbucket.sender_name#
Name
Default
Required
inbucket.sender_name
Admin
false

Description
Display name used as the sender for emails sent from the application.
Branching Config#
remotes.<branch_name>.project_id#
Name
Default
Required
remotes.branch_name.project_id
None
true

Description
The project reference ID for a specific persistent Supabase branch.
This ID is used to configure branch-specific settings in your config.toml file for branches deployments.
All other configuration options available in the root config are also supported in the remotes block.
For example, you can specify branch-specific database settings like so:
Usage
1[remotes.<branch_name>]
2project_id = "your-project-ref"
3
4[remotes.<branch_name>.db.seed]
5sql_paths = ["./seeds/staging.sql"]

Supabase CLI
The Supabase CLI provides tools to develop your project locally and deploy to the Supabase Platform.
The CLI is still under development, but it contains all the functionality for working with your Supabase projects and the Supabase Platform.
Run Supabase locally: supabase init and supabase start
Manage database migrations: supabase migration
CI/CD for releasing to production: supabase db push
Manage your Supabase projects: supabase projects
Generate types directly from your database schema: supabase gen types
A community-supported GitHub Action to generate TypeScript types
Shell autocomplete: supabase completion
A community-supported Fig autocomplete spec for macOS terminal
Additional links#
Install the Supabase CLI
Source code
Known bugs and issues
Supabase CLI v1 and Management API Beta
Video: Announcing CLI V1 and Management API Beta

Global flags
Supabase CLI supports global flags for every command.
Flags
--create-ticket
Optional
no type
create a support ticket for any CLI error
--debug
Optional
no type
output debug logs to stderr
--dns-resolver <[ native | https ]>
Optional
no type
lookup domain names using the specified resolver
--experimental
Optional
no type
enable experimental features
-h, --help
Optional
no type
help for supabase
--network-id <string>
Optional
no type
use the specified docker network instead of a generated one
-o, --output <[ env | pretty | json | toml | yaml ]>
Optional
no type
output format of status variables
--workdir <string>
Optional
no type
path to a Supabase project directory

supabase bootstrap
Usage
supabase bootstrap [template] [flags]
Flags
-p, --password <string>Optional
Password to your remote Postgres database.

supabase init
Initialize configurations for Supabase local development.
A supabase/config.toml file is created in your current working directory. This configuration is specific to each local project.
You may override the directory path by specifying the SUPABASE_WORKDIR environment variable or --workdir flag.
In addition to config.toml, the supabase directory may also contain other Supabase objects, such as migrations, functions, tests, etc.
Usage
supabase init [flags]
Flags
--forceOptional
Overwrite existing supabase/config.toml.
--use-orioledbOptional
Use OrioleDB storage engine for Postgres.
--with-intellij-settingsOptional
Generate IntelliJ IDEA settings for Deno.
--with-vscode-settingsOptional
Generate VS Code settings for Deno.
Basic usageInitialize from an existing directory
supabase init
Response
Finished supabase init.

supabase login
Connect the Supabase CLI to your Supabase account by logging in with your personal access token.
Your access token is stored securely in native credentials storage. If native credentials storage is unavailable, it will be written to a plain text file at ~/.supabase/access-token.
If this behavior is not desired, such as in a CI environment, you may skip login by specifying the SUPABASE_ACCESS_TOKEN environment variable in other commands.
The Supabase CLI uses the stored token to access Management APIs for projects, functions, secrets, etc.
Usage
supabase login [flags]
Flags
--name <string>Optional
Name that will be used to store token in your settings
--no-browserOptional
Do not open browser automatically
--token <string>Optional
Use provided token instead of automatic login flow
Basic usage
supabase login
Response
You can generate an access token from https://supabase.com/dashboard/account/tokens
Enter your access token: sbp_****************************************
Finished supabase login.

supabase link
Link your local development project to a hosted Supabase project.
PostgREST configurations are fetched from the Supabase platform and validated against your local configuration file.
Optionally, database settings can be validated if you provide a password. Your database password is saved in native credentials storage if available.
If you do not want to be prompted for the database password, such as in a CI environment, you may specify it explicitly via the SUPABASE_DB_PASSWORD environment variable.
Some commands like db dump, db push, and db pull require your project to be linked first.
Usage
supabase link [flags]
Flags
-p, --password <string>Optional
Password to your remote Postgres database.
--project-ref <string>Optional
Project ref of the Supabase project.
Basic usageLink without database passwordLink using DNS-over-HTTPS resolver
supabase link --project-ref ********************
Response
Enter your database password (or leave blank to skip): ********
Finished supabase link.

supabase start
Starts the Supabase local development stack.
Requires supabase/config.toml to be created in your current working directory by running supabase init.
All service containers are started by default. You can exclude those not needed by passing in -x flag. To exclude multiple containers, either pass in a comma separated string, such as -x gotrue,imgproxy, or specify -x flag multiple times.
It is recommended to have at least 7GB of RAM to start all services.
Health checks are automatically added to verify the started containers. Use --ignore-health-check flag to ignore these errors.
Usage
supabase start [flags]
Flags
-x, --exclude <strings>Optional
Names of containers to not start. [gotrue,realtime,storage-api,imgproxy,kong,mailpit,postgrest,postgres-meta,studio,edge-runtime,logflare,vector,supavisor]
--ignore-health-checkOptional
Ignore unhealthy services and exit 0
Basic usageStart containers without studio and imgproxyIgnore service health checks
supabase start
Response
Creating custom roles supabase/roles.sql...
Applying migration 20220810154536_employee.sql...
Seeding data supabase/seed.sql...
Started supabase local development setup.

supabase stop
Stops the Supabase local development stack.
Requires supabase/config.toml to be created in your current working directory by running supabase init.
All Docker resources are maintained across restarts. Use --no-backup flag to reset your local development data between restarts.
Use the --all flag to stop all local Supabase projects instances on the machine. Use with caution with --no-backup as it will delete all supabase local projects data.
Usage
supabase stop [flags]
Flags
--allOptional
Stop all local Supabase instances from all projects across the machine.
--no-backupOptional
Deletes all data volumes after stopping.
--project-id <string>Optional
Local project ID to stop.
Basic usageClean up local data after stopping
supabase stop
Response
Stopped supabase local development setup.
Local data are backed up to docker volume.

supabase status
Shows status of the Supabase local development stack.
Requires the local development stack to be started by running supabase start or supabase db start.
You can export the connection parameters for initializing supabase-js locally by specifying the -o env flag. Supported parameters include JWT_SECRET, ANON_KEY, and SERVICE_ROLE_KEY.
Usage
supabase status [flags]
Flags
--override-name <strings>Optional
Override specific variable names.
Basic usageFormat status as environment variablesCustomize the names of exported variables
supabase status
Response
supabase local development setup is running.
        API URL: http://127.0.0.1:54321
    GraphQL URL: http://127.0.0.1:54321/graphql/v1
         DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
     Studio URL: http://127.0.0.1:54323
   Inbucket URL: http://127.0.0.1:54324
     JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
       anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

supabase test
Subcommands
supabase test db
supabase test new

supabase test db
Executes pgTAP tests against the local database.
Requires the local development stack to be started by running supabase start.
Runs pg_prove in a container with unit test files volume mounted from supabase/tests directory. The test file can be suffixed by either .sql or .pg extension.
Since each test is wrapped in its own transaction, it will be individually rolled back regardless of success or failure.
Usage
supabase test db [path] ... [flags]
Flags
--db-url <string>Optional
Tests the database specified by the connection string (must be percent-encoded).
--linkedOptional
Runs pgTAP tests on the linked project.
--localOptional
Runs pgTAP tests on the local database.
Basic usage
supabase test db
Response
/tmp/supabase/tests/nested/order_test.pg .. ok
/tmp/supabase/tests/pet_test.sql .......... ok
All tests successful.
Files=2, Tests=2,  6 wallclock secs ( 0.03 usr  0.01 sys +  0.05 cusr  0.02 csys =  0.11 CPU)
Result: PASS

supabase test new
Usage
supabase test new <name> [flags]
Flags
-t, --template <[ pgtap ]>Optional
Template framework to generate.

supabase gen
Automatically generates type definitions based on your Postgres database schema.
This command connects to your database (local or remote) and generates typed definitions that match your database tables, views, and stored procedures. By default, it generates TypeScript definitions, but also supports Go and Swift.
Generated types give you type safety and autocompletion when working with your database in code, helping prevent runtime errors and improving developer experience.
The types respect relationships, constraints, and custom types defined in your database schema.
Subcommands
supabase gen keys
supabase gen types

supabase gen keys
Usage
supabase gen keys [flags]
Flags
--override-name <strings>Optional
Override specific variable names.
--project-ref <string>Optional
Project ref of the Supabase project.
--experimentalRequired
enable experimental features

supabase gen types
Usage
supabase gen types [flags]
Flags
--db-url <string>Optional
Generate types from a database url.
--lang <[ typescript | go | swift ]>Optional
Output language of the generated types.
--linkedOptional
Generate types from the linked project.
--localOptional
Generate types from the local dev database.
--postgrest-v9-compatOptional
Generate types compatible with PostgREST v9 and below. Only use together with --db-url.
--project-id <string>Optional
Generate types from a project ID.
-s, --schema <strings>Optional
Comma separated list of schema to include.
--swift-access-control <[ internal | public ]>Optional
Access control for Swift generated types.

supabase db
Subcommands
supabase db diff
supabase db dump
supabase db lint
supabase db pull
supabase db push
supabase db reset
supabase db start

supabase db pull
Pulls schema changes from a remote database. A new migration file will be created under supabase/migrations directory.
Requires your local project to be linked to a remote database by running supabase link. For self-hosted databases, you can pass in the connection parameters using --db-url flag.
Optionally, a new row can be inserted into the migration history table to reflect the current state of the remote database.
If no entries exist in the migration history table, pg_dump will be used to capture all contents of the remote schemas you have created. Otherwise, this command will only diff schema changes against the remote database, similar to running db diff --linked.
Usage
supabase db pull [migration name] [flags]
Flags
--db-url <string>Optional
Pulls from the database specified by the connection string (must be percent-encoded).
--linkedOptional
Pulls from the linked project.
--localOptional
Pulls from the local database.
-p, --password <string>Optional
Password to your remote Postgres database.
-s, --schema <strings>Optional
Comma separated list of schema to include.
Basic usageLocal studioCustom schemas
supabase db pull
Response
Connecting to remote database...
Schema written to supabase/migrations/20240414044403_remote_schema.sql
Update remote migration history table? [Y/n]
Repaired migration history: [20240414044403] => applied
Finished supabase db pull.
The auth and storage schemas are excluded. Run supabase db pull --schema auth,storage again to diff them.

supabase db push
Pushes all local migrations to a remote database.
Requires your local project to be linked to a remote database by running supabase link. For self-hosted databases, you can pass in the connection parameters using --db-url flag.
The first time this command is run, a migration history table will be created under supabase_migrations.schema_migrations. After successfully applying a migration, a new row will be inserted into the migration history table with timestamp as its unique id. Subsequent pushes will skip migrations that have already been applied.
If you need to mutate the migration history table, such as deleting existing entries or inserting new entries without actually running the migration, use the migration repair command.
Use the --dry-run flag to view the list of changes before applying.
Usage
supabase db push [flags]
Flags
--db-url <string>Optional
Pushes to the database specified by the connection string (must be percent-encoded).
--dry-runOptional
Print the migrations that would be applied, but don't actually apply them.
--include-allOptional
Include all migrations not found on remote history table.
--include-rolesOptional
Include custom roles from supabase/roles.sql.
--include-seedOptional
Include seed data from your config.
--linkedOptional
Pushes to the linked project.
--localOptional
Pushes to the local database.
-p, --password <string>Optional
Password to your remote Postgres database.
Basic usageSelf hostedDry run
supabase db push
Response
Linked project is up to date.

supabase db reset
Resets the local database to a clean state.
Requires the local development stack to be started by running supabase start.
Recreates the local Postgres container and applies all local migrations found in supabase/migrations directory. If test data is defined in supabase/seed.sql, it will be seeded after the migrations are run. Any other data or schema changes made during local development will be discarded.
When running db reset with --linked or --db-url flag, a SQL script is executed to identify and drop all user created entities in the remote database. Since Postgres roles are cluster level entities, any custom roles created through the dashboard or supabase/roles.sql will not be deleted by remote reset.
Usage
supabase db reset [flags]
Flags
--db-url <string>Optional
Resets the database specified by the connection string (must be percent-encoded).
--last <uint>Optional
Reset up to the last n migration versions.
--linkedOptional
Resets the linked project with local migrations.
--localOptional
Resets the local database with local migrations.
--no-seedOptional
Skip running the seed script after reset.
--version <string>Optional
Reset up to the specified version.
Basic usage
supabase db reset
Response
Resetting database...
Initializing schema...
Applying migration 20220810154537_create_employees_table.sql...
Seeding data supabase/seed.sql...
Finished supabase db reset on branch main.

supabase db dump
Dumps contents from a remote database.
Requires your local project to be linked to a remote database by running supabase link. For self-hosted databases, you can pass in the connection parameters using --db-url flag.
Runs pg_dump in a container with additional flags to exclude Supabase managed schemas. The ignored schemas include auth, storage, and those created by extensions.
The default dump does not contain any data or custom roles. To dump those contents explicitly, specify either the --data-only and --role-only flag.
Usage
supabase db dump [flags]
Flags
--data-onlyOptional
Dumps only data records.
--db-url <string>Optional
Dumps from the database specified by the connection string (must be percent-encoded).
--dry-runOptional
Prints the pg_dump script that would be executed.
-x, --exclude <strings>Optional
List of schema.tables to exclude from data-only dump.
-f, --file <string>Optional
File path to save the dumped contents.
--keep-commentsOptional
Keeps commented lines from pg_dump output.
--linkedOptional
Dumps from the linked project.
--localOptional
Dumps from the local database.
-p, --password <string>Optional
Password to your remote Postgres database.
--role-onlyOptional
Dumps only cluster roles.
-s, --schema <strings>Optional
Comma separated list of schema to include.
--use-copyOptional
Uses copy statements in place of inserts.
Basic usageRole onlyData only
supabase db dump -f supabase/schema.sql
Response
Dumping schemas from remote database...
Dumped schema to supabase/schema.sql.

supabase db diff
Diffs schema changes made to the local or remote database.
Requires the local development stack to be running when diffing against the local database. To diff against a remote or self-hosted database, specify the --linked or --db-url flag respectively.
Runs djrobstep/migra in a container to compare schema differences between the target database and a shadow database. The shadow database is created by applying migrations in local supabase/migrations directory in a separate container. Output is written to stdout by default. For convenience, you can also save the schema diff as a new migration file by passing in -f flag.
By default, all schemas in the target database are diffed. Use the --schema public,extensions flag to restrict diffing to a subset of schemas.
While the diff command is able to capture most schema changes, there are cases where it is known to fail. Currently, this could happen if you schema contains:
Changes to publication
Changes to storage buckets
Views with security_invoker attributes
Usage
supabase db diff [flags]
Flags
--db-url <string>Optional
Diffs against the database specified by the connection string (must be percent-encoded).
-f, --file <string>Optional
Saves schema diff to a new migration file.
--linkedOptional
Diffs local migration files against the linked project.
--localOptional
Diffs local migration files against the local database.
-s, --schema <strings>Optional
Comma separated list of schema to include.
--use-migraOptional
Use migra to generate schema diff.
--use-pg-schemaOptional
Use pg-schema-diff to generate schema diff.
--use-pgadminOptional
Use pgAdmin to generate schema diff.
Basic usageAgainst linked projectFor a specific schema
supabase db diff -f my_table
Response
Connecting to local database...
Creating shadow database...
Applying migration 20230425064254_remote_commit.sql...
Diffing schemas: auth,extensions,public,storage
Finished supabase db diff on branch main.
No schema changes found

supabase db lint
Lints local database for schema errors.
Requires the local development stack to be running when linting against the local database. To lint against a remote or self-hosted database, specify the --linked or --db-url flag respectively.
Runs plpgsql_check extension in the local Postgres container to check for errors in all schemas. The default lint level is warning and can be raised to error via the --level flag.
To lint against specific schemas only, pass in the --schema flag.
The --fail-on flag can be used to control when the command should exit with a non-zero status code. The possible values are:
none (default): Always exit with a zero status code, regardless of lint results.
warning: Exit with a non-zero status code if any warnings or errors are found.
error: Exit with a non-zero status code only if errors are found.
This flag is particularly useful in CI/CD pipelines where you want to fail the build based on certain lint conditions.
Usage
supabase db lint [flags]
Flags
--db-url <string>Optional
Lints the database specified by the connection string (must be percent-encoded).
--fail-on <[ none | warning | error ]>Optional
Error level to exit with non-zero status.
--level <[ warning | error ]>Optional
Error level to emit.
--linkedOptional
Lints the linked project for schema errors.
--localOptional
Lints the local database for schema errors.
-s, --schema <strings>Optional
Comma separated list of schema to include.
Basic usageWarnings for a specific schema
supabase db lint
Response
Linting schema: public
No schema errors found

supabase db start
Usage
supabase db start [flags]
Flags
--from-backup <string>Optional
Path to a logical backup file.

supabase migration
Subcommands
supabase migration down
supabase migration fetch
supabase migration list
supabase migration new
supabase migration repair
supabase migration squash
supabase migration up

supabase migration new
Creates a new migration file locally.
A supabase/migrations directory will be created if it does not already exists in your current workdir. All schema migration files must be created in this directory following the pattern <timestamp>_<name>.sql.
Outputs from other commands like db diff may be piped to migration new <name> via stdin.
Usage
supabase migration new <migration name>
Basic usageWith statements piped from stdin
supabase migration new schema_test
Response
Created new migration at supabase/migrations/20230306095710_schema_test.sql.

supabase migration list
Lists migration history in both local and remote databases.
Requires your local project to be linked to a remote database by running supabase link. For self-hosted databases, you can pass in the connection parameters using --db-url flag.
Note that URL strings must be escaped according to RFC 3986.
Local migrations are stored in supabase/migrations directory while remote migrations are tracked in supabase_migrations.schema_migrations table. Only the timestamps are compared to identify any differences.
In case of discrepancies between the local and remote migration history, you can resolve them using the migration repair command.
Usage
supabase migration list [flags]
Flags
--db-url <string>Optional
Lists migrations of the database specified by the connection string (must be percent-encoded).
--linkedOptional
Lists migrations applied to the linked project.
--localOptional
Lists migrations applied to the local database.
-p, --password <string>Optional
Password to your remote Postgres database.
Basic usageConnect to self-hosted database
supabase migration list
Response
LOCAL      │     REMOTE     │     TIME (UTC)
─────────────────┼────────────────┼──────────────────────
                │ 20230103054303 │ 2023-01-03 05:43:03
                │ 20230103093141 │ 2023-01-03 09:31:41
 20230222032233 │                │ 2023-02-22 03:22:33

supabase migration fetch
Usage
supabase migration fetch [flags]
Flags
--db-url <string>Optional
Fetches migrations from the database specified by the connection string (must be percent-encoded).
--linkedOptional
Fetches migration history from the linked project.
--localOptional
Fetches migration history from the local database.

supabase migration repair
Repairs the remote migration history table.
Requires your local project to be linked to a remote database by running supabase link.
If your local and remote migration history goes out of sync, you can repair the remote history by marking specific migrations as --status applied or --status reverted. Marking as reverted will delete an existing record from the migration history table while marking as applied will insert a new record.
For example, your migration history may look like the table below, with missing entries in either local or remote.
$ supabase migration list
        LOCAL      │     REMOTE     │     TIME (UTC)
  ─────────────────┼────────────────┼──────────────────────
                   │ 20230103054303 │ 2023-01-03 05:43:03
   20230103054315  │                │ 2023-01-03 05:43:15

To reset your migration history to a clean state, first delete your local migration file.
$ rm supabase/migrations/20230103054315_remote_commit.sql

$ supabase migration list
        LOCAL      │     REMOTE     │     TIME (UTC)
  ─────────────────┼────────────────┼──────────────────────
                   │ 20230103054303 │ 2023-01-03 05:43:03

Then mark the remote migration 20230103054303 as reverted.
$ supabase migration repair 20230103054303 --status reverted
Connecting to remote database...
Repaired migration history: [20220810154537] => reverted
Finished supabase migration repair.

$ supabase migration list
        LOCAL      │     REMOTE     │     TIME (UTC)
  ─────────────────┼────────────────┼──────────────────────

Now you can run db pull again to dump the remote schema as a local migration file.
$ supabase db pull
Connecting to remote database...
Schema written to supabase/migrations/20240414044403_remote_schema.sql
Update remote migration history table? [Y/n]
Repaired migration history: [20240414044403] => applied
Finished supabase db pull.

$ supabase migration list
        LOCAL      │     REMOTE     │     TIME (UTC)
  ─────────────────┼────────────────┼──────────────────────
    20240414044403 │ 20240414044403 │ 2024-04-14 04:44:03

Usage
supabase migration repair [version] ... [flags]
Flags
--db-url <string>Optional
Repairs migrations of the database specified by the connection string (must be percent-encoded).
--linkedOptional
Repairs the migration history of the linked project.
--localOptional
Repairs the migration history of the local database.
-p, --password <string>Optional
Password to your remote Postgres database.
--status <[ applied | reverted ]>Required
Version status to update.
Mark a migration as revertedMark a migration as applied
supabase migration repair 20230103054303 --status reverted
Response
Repaired migration history: 20230103054303 => reverted

supabase migration squash
Squashes local schema migrations to a single migration file.
The squashed migration is equivalent to a schema only dump of the local database after applying existing migration files. This is especially useful when you want to remove repeated modifications of the same schema from your migration history.
However, one limitation is that data manipulation statements, such as insert, update, or delete, are omitted from the squashed migration. You will have to add them back manually in a new migration file. This includes cron jobs, storage buckets, and any encrypted secrets in vault.
By default, the latest <timestamp>_<name>.sql file will be updated to contain the squashed migration. You can override the target version using the --version <timestamp> flag.
If your supabase/migrations directory is empty, running supabase squash will do nothing.
Usage
supabase migration squash [flags]
Flags
--db-url <string>Optional
Squashes migrations of the database specified by the connection string (must be percent-encoded).
--linkedOptional
Squashes the migration history of the linked project.
--localOptional
Squashes the migration history of the local database.
-p, --password <string>Optional
Password to your remote Postgres database.
--version <string>Optional
Squash up to the specified version.

supabase migration up
Usage
supabase migration up [flags]
Flags
--db-url <string>Optional
Applies migrations to the database specified by the connection string (must be percent-encoded).
--include-allOptional
Include all migrations not found on remote history table.
--linkedOptional
Applies pending migrations to the linked project.
--localOptional
Applies pending migrations to the local database.

supabase seed
Subcommands
supabase seed buckets

supabase seed buckets
Usage
supabase seed buckets
Flags
--linkedOptional
Seeds the linked project.
--localOptional
Seeds the local database.

supabase inspect db
Subcommands
supabase inspect db bloat
supabase inspect db blocking
supabase inspect db cache-hit
supabase inspect db calls
supabase inspect db index-sizes
supabase inspect db index-usage
supabase inspect db locks
supabase inspect db long-running-queries
supabase inspect db outliers
supabase inspect db replication-slots
supabase inspect db role-configs
supabase inspect db role-connections
supabase inspect db seq-scans
supabase inspect db table-index-sizes
supabase inspect db table-record-counts
supabase inspect db table-sizes
supabase inspect db total-index-size
supabase inspect db total-table-sizes
supabase inspect db unused-indexes
supabase inspect db vacuum-stats

supabase inspect db calls
This command is much like the supabase inspect db outliers command, but ordered by the number of times a statement has been called.
You can use this information to see which queries are called most often, which can potentially be good candidates for optimisation.

                        QUERY                      │ TOTAL EXECUTION TIME │ PROPORTION OF TOTAL EXEC TIME │ NUMBER CALLS │  SYNC IO TIME
  ─────────────────────────────────────────────────┼──────────────────────┼───────────────────────────────┼──────────────┼──────────────────
    SELECT * FROM users WHERE id = $1              │ 14:50:11.828939      │ 89.8%                         │  183,389,757 │ 00:00:00.002018
    SELECT * FROM user_events                      │ 01:20:23.466633      │ 1.4%                          │       78,325 │ 00:00:00
    INSERT INTO users (email, name) VALUES ($1, $2)│ 00:40:11.616882      │ 0.8%                          │       54,003 │ 00:00:00.000322


Usage
supabase inspect db calls
Flags
--db-url <string>Optional
Inspect the database specified by the connection string (must be percent-encoded).
--linkedOptional
Inspect the linked project.
--localOptional
Inspect the local database.

supabase inspect db long-running-queries
This command displays currently running queries, that have been running for longer than 5 minutes, descending by duration. Very long running queries can be a source of multiple issues, such as preventing DDL statements completing or vacuum being unable to update relfrozenxid.
 PID  │     DURATION    │                                         QUERY
───────┼─────────────────┼───────────────────────────────────────────────────────────────────────────────────────
 19578 | 02:29:11.200129 | EXPLAIN SELECT  "students".* FROM "students"  WHERE "students"."id" = 1450645 LIMIT 1
 19465 | 02:26:05.542653 | EXPLAIN SELECT  "students".* FROM "students"  WHERE "students"."id" = 1889881 LIMIT 1
 19632 | 02:24:46.962818 | EXPLAIN SELECT  "students".* FROM "students"  WHERE "students"."id" = 1581884 LIMIT 1

Usage
supabase inspect db long-running-queries
Flags
--db-url <string>Optional
Inspect the database specified by the connection string (must be percent-encoded).
--linkedOptional
Inspect the linked project.
--localOptional
Inspect the local database.

supabase inspect db outliers
This command displays statements, obtained from pg_stat_statements, ordered by the amount of time to execute in aggregate. This includes the statement itself, the total execution time for that statement, the proportion of total execution time for all statements that statement has taken up, the number of times that statement has been called, and the amount of time that statement spent on synchronous I/O (reading/writing from the file system).
Typically, an efficient query will have an appropriate ratio of calls to total execution time, with as little time spent on I/O as possible. Queries that have a high total execution time but low call count should be investigated to improve their performance. Queries that have a high proportion of execution time being spent on synchronous I/O should also be investigated.

                 QUERY                   │ EXECUTION TIME   │ PROPORTION OF EXEC TIME │ NUMBER CALLS │ SYNC IO TIME
─────────────────────────────────────────┼──────────────────┼─────────────────────────┼──────────────┼───────────────
 SELECT * FROM archivable_usage_events.. │ 154:39:26.431466 │ 72.2%                   │ 34,211,877   │ 00:00:00
 COPY public.archivable_usage_events (.. │ 50:38:33.198418  │ 23.6%                   │ 13           │ 13:34:21.00108
 COPY public.usage_events (id, reporte.. │ 02:32:16.335233  │ 1.2%                    │ 13           │ 00:34:19.784318
 INSERT INTO usage_events (id, retaine.. │ 01:42:59.436532  │ 0.8%                    │ 12,328,187   │ 00:00:00
 SELECT * FROM usage_events WHERE (alp.. │ 01:18:10.754354  │ 0.6%                    │ 102,114,301  │ 00:00:00

Usage
supabase inspect db outliers
Flags
--db-url <string>Optional
Inspect the database specified by the connection string (must be percent-encoded).
--linkedOptional
Inspect the linked project.
--localOptional
Inspect the local database.

supabase inspect db blocking
This command shows you statements that are currently holding locks and blocking, as well as the statement that is being blocked. This can be used in conjunction with inspect db locks to determine which statements need to be terminated in order to resolve lock contention.
   BLOCKED PID │ BLOCKING STATEMENT           │ BLOCKING DURATION │ BLOCKING PID │ BLOCKED STATEMENT                                                                      │ BLOCKED DURATION
  ──────────────┼──────────────────────────────┼───────────────────┼──────────────┼────────────────────────────────────────────────────────────────────────────────────────┼───────────────────
    253         │ select count(*) from mytable │ 00:00:03.838314   │        13495 │ UPDATE "mytable" SET "updated_at" = '2023─08─03 14:07:04.746688' WHERE "id" = 83719341 │ 00:00:03.821826

Usage
supabase inspect db blocking
Flags
--db-url <string>Optional
Inspect the database specified by the connection string (must be percent-encoded).
--linkedOptional
Inspect the linked project.
--localOptional
Inspect the local database.

supabase inspect db locks
This command displays queries that have taken out an exclusive lock on a relation. Exclusive locks typically prevent other operations on that relation from taking place, and can be a cause of "hung" queries that are waiting for a lock to be granted.
If you see a query that is hanging for a very long time or causing blocking issues you may consider killing the query by connecting to the database and running SELECT pg_cancel_backend(PID); to cancel the query. If the query still does not stop you can force a hard stop by running SELECT pg_terminate_backend(PID);
    PID   │ RELNAME │ TRANSACTION ID │ GRANTED │                  QUERY                  │   AGE
  ─────────┼─────────┼────────────────┼─────────┼─────────────────────────────────────────┼───────────
    328112 │ null    │              0 │ t       │ SELECT * FROM logs;                     │ 00:04:20

Usage
supabase inspect db locks
Flags
--db-url <string>Optional
Inspect the database specified by the connection string (must be percent-encoded).
--linkedOptional
Inspect the linked project.
--localOptional
Inspect the local database.

supabase inspect db total-index-size
This command displays the total size of all indexes on the database. It is calculated by taking the number of pages (reported in relpages) and multiplying it by the page size (8192 bytes).
   SIZE
  ─────────
    12 MB

Usage
supabase inspect db total-index-size
Flags
--db-url <string>Optional
Inspect the database specified by the connection string (must be percent-encoded).
--linkedOptional
Inspect the linked project.
--localOptional
Inspect the local database.

supabase inspect db index-sizes
This command displays the size of each each index in the database. It is calculated by taking the number of pages (reported in relpages) and multiplying it by the page size (8192 bytes).
             NAME              │    SIZE
  ──────────────────────────────┼─────────────
    user_events_index           │ 2082 MB
    job_run_details_pkey        │ 3856 kB
    schema_migrations_pkey      │ 16 kB
    refresh_tokens_token_unique │ 8192 bytes
    users_instance_id_idx       │ 0 bytes
    buckets_pkey                │ 0 bytes

Usage
supabase inspect db index-sizes
Flags
--db-url <string>Optional
Inspect the database specified by the connection string (must be percent-encoded).
--linkedOptional
Inspect the linked project.
--localOptional
Inspect the local database.

supabase inspect db index-usage
This command provides information on the efficiency of indexes, represented as what percentage of total scans were index scans. A low percentage can indicate under indexing, or wrong data being indexed.
      TABLE NAME     │ PERCENTAGE OF TIMES INDEX USED │ ROWS IN TABLE
  ────────────────────┼────────────────────────────────┼────────────────
    user_events       │                             99 │       4225318 
    user_feed         │                             99 │       3581573
    unindexed_table   │                              0 │        322911
    job               │                            100 │         33242
    schema_migrations │                             97 │             0
    migrations        │ Insufficient data              │             0

Usage
supabase inspect db index-usage
Flags
--db-url <string>Optional
Inspect the database specified by the connection string (must be percent-encoded).
--linkedOptional
Inspect the linked project.
--localOptional
Inspect the local database.

supabase inspect db unused-indexes
This command displays indexes that have < 50 scans recorded against them, and are greater than 5 pages in size, ordered by size relative to the number of index scans. This command is generally useful for discovering indexes that are unused. Indexes can impact write performance, as well as read performance should they occupy space in memory, its a good idea to remove indexes that are not needed or being used.
       TABLE        │                   INDEX                    │ INDEX SIZE │ INDEX SCANS
─────────────────────┼────────────────────────────────────────────┼────────────┼──────────────
 public.users        │ user_id_created_at_idx                     │ 97 MB      │           0

Usage
supabase inspect db unused-indexes
Flags
--db-url <string>Optional
Inspect the database specified by the connection string (must be percent-encoded).
--linkedOptional
Inspect the linked project.
--localOptional
Inspect the local database.

supabase inspect db total-table-sizes
This command displays the total size of each table in the database. It is the sum of the values that pg_table_size() and pg_indexes_size() gives for each table. System tables inside pg_catalog and information_schema are not included.
               NAME               │    SIZE
───────────────────────────────────┼─────────────
  job_run_details                  │ 395 MB
  slack_msgs                       │ 648 kB
  emails                           │ 640 kB

Usage
supabase inspect db total-table-sizes
Flags
--db-url <string>Optional
Inspect the database specified by the connection string (must be percent-encoded).
--linkedOptional
Inspect the linked project.
--localOptional
Inspect the local database.

supabase inspect db table-sizes
This command displays the size of each table in the database. It is calculated by using the system administration function pg_table_size(), which includes the size of the main data fork, free space map, visibility map and TOAST data. It does not include the size of the table's indexes.
                 NAME               │    SIZE
  ───────────────────────────────────┼─────────────
    job_run_details                  │ 385 MB
    emails                           │ 584 kB
    job                              │ 40 kB
    sessions                         │ 0 bytes
    prod_resource_notifications_meta │ 0 bytes

Usage
supabase inspect db table-sizes
Flags
--db-url <string>Optional
Inspect the database specified by the connection string (must be percent-encoded).
--linkedOptional
Inspect the linked project.
--localOptional
Inspect the local database.

supabase inspect db table-index-sizes
This command displays the total size of indexes for each table. It is calculated by using the system administration function pg_indexes_size().
                TABLE               │ INDEX SIZE
  ───────────────────────────────────┼─────────────
    job_run_details                  │ 10104 kB
    users                            │ 128 kB
    job                              │ 32 kB
    instances                        │ 8192 bytes
    http_request_queue               │ 0 bytes

Usage
supabase inspect db table-index-sizes
Flags
--db-url <string>Optional
Inspect the database specified by the connection string (must be percent-encoded).
--linkedOptional
Inspect the linked project.
--localOptional
Inspect the local database.

supabase inspect db cache-hit
This command provides information on the efficiency of the buffer cache and how often your queries have to go hit the disk rather than reading from memory. Information on both index reads (index hit rate) as well as table reads (table hit rate) are shown. In general, databases with low cache hit rates perform worse as it is slower to go to disk than retrieve data from memory. If your table hit rate is low, this can indicate that you do not have enough RAM and you may benefit from upgrading to a larger compute addon with more memory. If your index hit rate is low, this may indicate that there is scope to add more appropriate indexes.
The hit rates are calculated as a ratio of number of table or index blocks fetched from the postgres buffer cache against the sum of cached blocks and uncached blocks read from disk.
On smaller compute plans (free, small, medium), a ratio of below 99% can indicate a problem. On larger plans the hit rates may be lower but performance will remain constant as the data may use the OS cache rather than Postgres buffer cache.
        NAME      │  RATIO
  ─────────────────┼───────────
    index hit rate │ 0.996621
    table hit rate │ 0.999341

Usage
supabase inspect db cache-hit
Flags
--db-url <string>Optional
Inspect the database specified by the connection string (must be percent-encoded).
--linkedOptional
Inspect the linked project.
--localOptional
Inspect the local database.

supabase inspect db table-record-counts
This command displays an estimated count of rows per table, descending by estimated count. The estimated count is derived from n_live_tup, which is updated by vacuum operations. Due to the way n_live_tup is populated, sparse vs. dense pages can result in estimations that are significantly out from the real count of rows.
      NAME    │ ESTIMATED COUNT
  ─────────────┼──────────────────
    logs       │          322943
    emails     │            1103
    job        │               1
    migrations │               0

Usage
supabase inspect db table-record-counts
Flags
--db-url <string>Optional
Inspect the database specified by the connection string (must be percent-encoded).
--linkedOptional
Inspect the linked project.
--localOptional
Inspect the local database.

supabase inspect db seq-scans
This command displays the number of sequential scans recorded against all tables, descending by count of sequential scans. Tables that have very high numbers of sequential scans may be underindexed, and it may be worth investigating queries that read from these tables.
                 NAME               │ COUNT
  ───────────────────────────────────┼─────────
    emails                           │ 182435
    users                            │  25063
    job_run_details                  │     60
    schema_migrations                │      0
    migrations                       │      0

Usage
supabase inspect db seq-scans
Flags
--db-url <string>Optional
Inspect the database specified by the connection string (must be percent-encoded).
--linkedOptional
Inspect the linked project.
--localOptional
Inspect the local database.

supabase inspect db replication-slots
This command shows information about logical replication slots that are setup on the database. It shows if the slot is active, the state of the WAL sender process ('startup', 'catchup', 'streaming', 'backup', 'stopping') the replication client address and the replication lag in GB.
This command is useful to check that the amount of replication lag is as low as possible, replication lag can occur due to network latency issues, slow disk I/O, long running transactions or lack of ability for the subscriber to consume WAL fast enough.
                      NAME                    │ ACTIVE │ STATE   │ REPLICATION CLIENT ADDRESS │ REPLICATION LAG GB
  ─────────────────────────────────────────────┼────────┼─────────┼────────────────────────────┼─────────────────────
    supabase_realtime_replication_slot         │ t      │ N/A     │ N/A                        │                  0
    datastream                                 │ t      │ catchup │ 24.201.24.106              │                 45

Usage
supabase inspect db replication-slots
Flags
--db-url <string>Optional
Inspect the database specified by the connection string (must be percent-encoded).
--linkedOptional
Inspect the linked project.
--localOptional
Inspect the local database.

supabase inspect db role-connections
This command shows the number of active connections for each database roles to see which specific role might be consuming more connections than expected.
This is a Supabase specific command. You can see this breakdown on the dashboard as well:
https://app.supabase.com/project/_/database/roles
The maximum number of active connections depends on your instance size. You can manually overwrite the allowed number of connection but it is not advised.


            ROLE NAME         │ ACTIVE CONNCTION
  ────────────────────────────┼───────────────────
    authenticator             │                5
    postgres                  │                5
    supabase_admin            │                1
    pgbouncer                 │                1
    anon                      │                0
    authenticated             │                0
    service_role              │                0
    dashboard_user            │                0
    supabase_auth_admin       │                0
    supabase_storage_admin    │                0
    supabase_functions_admin  │                0
    pgsodium_keyholder        │                0
    pg_read_all_data          │                0
    pg_write_all_data         │                0
    pg_monitor                │                0

Active connections 12/90


Usage
supabase inspect db role-connections
Flags
--db-url <string>Optional
Inspect the database specified by the connection string (must be percent-encoded).
--linkedOptional
Inspect the linked project.
--localOptional
Inspect the local database.

supabase inspect db bloat
This command displays an estimation of table "bloat" - Due to Postgres' MVCC when data is updated or deleted new rows are created and old rows are made invisible and marked as "dead tuples". Usually the autovaccum process will asynchronously clean the dead tuples. Sometimes the autovaccum is unable to work fast enough to reduce or prevent tables from becoming bloated. High bloat can slow down queries, cause excessive IOPS and waste space in your database.
Tables with a high bloat ratio should be investigated to see if there are vacuuming is not quick enough or there are other issues.
   TYPE  │ SCHEMA NAME │        OBJECT NAME         │ BLOAT │ WASTE
  ────────┼─────────────┼────────────────────────────┼───────┼─────────────
    table │ public      │ very_bloated_table         │  41.0 │ 700 MB
    table │ public      │ my_table                   │   4.0 │ 76 MB
    table │ public      │ happy_table                │   1.0 │ 1472 kB
    index │ public      │ happy_table::my_nice_index │   0.7 │ 880 kB

Usage
supabase inspect db bloat
Flags
--db-url <string>Optional
Inspect the database specified by the connection string (must be percent-encoded).
--linkedOptional
Inspect the linked project.
--localOptional
Inspect the local database.

supabase inspect db vacuum-stats
This shows you stats about the vacuum activities for each table. Due to Postgres' MVCC when data is updated or deleted new rows are created and old rows are made invisible and marked as "dead tuples". Usually the autovaccum process will aysnchronously clean the dead tuples.
The command lists when the last vacuum and last auto vacuum took place, the row count on the table as well as the count of dead rows and whether autovacuum is expected to run or not. If the number of dead rows is much higher than the row count, or if an autovacuum is expected but has not been performed for some time, this can indicate that autovacuum is not able to keep up and that your vacuum settings need to be tweaked or that you require more compute or disk IOPS to allow autovaccum to complete.
       SCHEMA        │              TABLE               │ LAST VACUUM │ LAST AUTO VACUUM │      ROW COUNT       │ DEAD ROW COUNT │ EXPECT AUTOVACUUM?
──────────────────────┼──────────────────────────────────┼─────────────┼──────────────────┼──────────────────────┼────────────────┼─────────────────────
 auth                 │ users                            │             │ 2023-06-26 12:34 │               18,030 │              0 │ no
 public               │ profiles                         │             │ 2023-06-26 23:45 │               13,420 │             28 │ no
 public               │ logs                             │             │ 2023-06-26 01:23 │            1,313,033 │      3,318,228 │ yes
 storage              │ objects                          │             │                  │             No stats │              0 │ no
 storage              │ buckets                          │             │                  │             No stats │              0 │ no
 supabase_migrations  │ schema_migrations                │             │                  │             No stats │              0 │ no


Usage
supabase inspect db vacuum-stats
Flags
--db-url <string>Optional
Inspect the database specified by the connection string (must be percent-encoded).
--linkedOptional
Inspect the linked project.
--localOptional
Inspect the local database.

supabase inspect report
Usage
supabase inspect report [flags]
Flags
--output-dir <string>Optional
Path to save CSV files in
--db-url <string>Optional
Inspect the database specified by the connection string (must be percent-encoded).
--linkedOptional
Inspect the linked project.
--localOptional
Inspect the local database.

supabase orgs
Subcommands
supabase orgs create
supabase orgs list

supabase orgs create
Create an organization for the logged-in user.
Usage
supabase orgs create

supabase orgs list
List all organizations the logged-in user belongs.
Usage
supabase orgs list

supabase projects
Provides tools for creating and managing your Supabase projects.
This command group allows you to list all projects in your organizations, create new projects, delete existing projects, and retrieve API keys. These operations help you manage your Supabase infrastructure programmatically without using the dashboard.
Project management via CLI is especially useful for automation scripts and when you need to provision environments in a repeatable way.
Subcommands
supabase projects api-keys
supabase projects create
supabase projects delete
supabase projects list

supabase projects create
Usage
supabase projects create [project name] [flags]
Flags
--db-password <string>Optional
Database password of the project.
--org-id <string>Optional
Organization ID to create the project in.
--region <string>Optional
Select a region close to you for the best performance.
--size <string>Optional
Select a desired instance size for your project.

supabase projects list
List all Supabase projects the logged-in user can access.
Usage
supabase projects list

supabase projects api-keys
Usage
supabase projects api-keys [flags]
Flags
--project-ref <string>Optional
Project ref of the Supabase project.

supabase projects delete
Usage
supabase projects delete <ref>

supabase config
Subcommands
supabase config push

supabase config push
Updates the configurations of a linked Supabase project with the local supabase/config.toml file.
This command allows you to manage project configuration as code by defining settings locally and then pushing them to your remote project.
Usage
supabase config push
Flags
--project-ref <string>Optional
Project ref of the Supabase project.

supabase branches
Subcommands
supabase branches create
supabase branches delete
supabase branches disable
supabase branches get
supabase branches list
supabase branches update

supabase branches create
Create a preview branch for the linked project.
Usage
supabase branches create [name] [flags]
Flags
--persistentOptional
Whether to create a persistent branch.
--region <string>Optional
Select a region to deploy the branch database.
--size <string>Optional
Select a desired instance size for the branch database.
--experimentalRequired
enable experimental features
--project-ref <string>Optional
Project ref of the Supabase project.

supabase branches list
List all preview branches of the linked project.
Usage
supabase branches list
Flags
--experimentalRequired
enable experimental features
--project-ref <string>Optional
Project ref of the Supabase project.

supabase branches get
Retrieve details of the specified preview branch.
Usage
supabase branches get [branch-id]
Flags
--experimentalRequired
enable experimental features
--project-ref <string>Optional
Project ref of the Supabase project.

supabase branches update
Update a preview branch by its name or ID.
Usage
supabase branches update [branch-id] [flags]
Flags
--git-branch <string>Optional
Change the associated git branch.
--name <string>Optional
Rename the preview branch.
--persistentOptional
Switch between ephemeral and persistent branch.
--status <string>Optional
Override the current branch status.
--experimentalRequired
enable experimental features
--project-ref <string>Optional
Project ref of the Supabase project.

supabase branches delete
Delete a preview branch by its name or ID.
Usage
supabase branches delete [branch-id]
Flags
--experimentalRequired
enable experimental features
--project-ref <string>Optional
Project ref of the Supabase project.

supabase branches disable
Disable preview branching for the linked project.
Usage
supabase branches disable
Flags
--experimentalRequired
enable experimental features
--project-ref <string>Optional
Project ref of the Supabase project.

supabase functions
Manage Supabase Edge Functions.
Supabase Edge Functions are server-less functions that run close to your users.
Edge Functions allow you to execute custom server-side code without deploying or scaling a traditional server. They're ideal for handling webhooks, custom API endpoints, data validation, and serving personalized content.
Edge Functions are written in TypeScript and run on Deno compatible edge runtime, which is a secure runtime with no package management needed, fast cold starts, and built-in security.
Subcommands
supabase functions delete
supabase functions deploy
supabase functions download
supabase functions list
supabase functions new
supabase functions serve

supabase functions new
Creates a new Edge Function with boilerplate code in the supabase/functions directory.
This command generates a starter TypeScript file with the necessary Deno imports and a basic function structure. The function is created as a new directory with the name you specify, containing an index.ts file with the function code.
After creating the function, you can edit it locally and then use supabase functions serve to test it before deploying with supabase functions deploy.
Usage
supabase functions new <Function name>

supabase functions list
List all Functions in the linked Supabase project.
Usage
supabase functions list [flags]
Flags
--project-ref <string>Optional
Project ref of the Supabase project.

supabase functions download
Download the source code for a Function from the linked Supabase project.
Usage
supabase functions download <Function name> [flags]
Flags
--legacy-bundleOptional
Use legacy bundling mechanism.
--project-ref <string>Optional
Project ref of the Supabase project.

supabase functions serve
Serve all Functions locally.
supabase functions serve command includes additional flags to assist developers in debugging Edge Functions via the v8 inspector protocol, allowing for debugging via Chrome DevTools, VS Code, and IntelliJ IDEA for example. Refer to the docs guide for setup instructions.
--inspect
Alias of --inspect-mode brk.
--inspect-mode [ run | brk | wait ]
Activates the inspector capability.
run mode simply allows a connection without additional behavior. It is not ideal for short scripts, but it can be useful for long-running scripts where you might occasionally want to set breakpoints.
brk mode same as run mode, but additionally sets a breakpoint at the first line to pause script execution before any code runs.
wait mode similar to brk mode, but instead of setting a breakpoint at the first line, it pauses script execution until an inspector session is connected.
--inspect-main
Can only be used when one of the above two flags is enabled.
By default, creating an inspector session for the main worker is not allowed, but this flag allows it.
Other behaviors follow the inspect-mode flag mentioned above.
Additionally, the following properties can be customized via supabase/config.toml under edge_runtime section.
inspector_port
The port used to listen to the Inspector session, defaults to 8083.
policy
A value that indicates how the edge-runtime should forward incoming HTTP requests to the worker.
per_worker allows multiple HTTP requests to be forwarded to a worker that has already been created.
oneshot will force the worker to process a single HTTP request and then exit. (Debugging purpose, This is especially useful if you want to reflect changes you've made immediately.)
Usage
supabase functions serve [flags]
Flags
--env-file <string>Optional
Path to an env file to be populated to the Function environment.
--import-map <string>Optional
Path to import map file.
--inspectOptional
Alias of --inspect-mode brk.
--inspect-mainOptional
Allow inspecting the main worker.
--inspect-mode <[ run | brk | wait ]>Optional
Activate inspector capability for debugging.
--no-verify-jwtOptional
Disable JWT verification for the Function.

supabase functions deploy
Deploy a Function to the linked Supabase project.
Usage
supabase functions deploy [Function name] [flags]
Flags
--import-map <string>Optional
Path to import map file.
-j, --jobs <uint>Optional
Maximum number of parallel jobs.
--no-verify-jwtOptional
Disable JWT verification for the Function.
--project-ref <string>Optional
Project ref of the Supabase project.
--use-apiOptional
Use Management API to bundle functions.
--use-dockerOptional
Use Docker to bundle functions.

supabase functions delete
Delete a Function from the linked Supabase project. This does NOT remove the Function locally.
Usage
supabase functions delete <Function name> [flags]
Flags
--project-ref <string>Optional
Project ref of the Supabase project.

supabase secrets
Provides tools for managing environment variables and secrets for your Supabase project.
This command group allows you to set, unset, and list secrets that are securely stored and made available to Edge Functions as environment variables.
Secrets management through the CLI is useful for:
Setting environment-specific configuration
Managing sensitive credentials securely
Secrets can be set individually or loaded from .env files for convenience.
Subcommands
supabase secrets list
supabase secrets set
supabase secrets unset

supabase secrets set
Set a secret(s) to the linked Supabase project.
Usage
supabase secrets set <NAME=VALUE> ... [flags]
Flags
--env-file <string>Optional
Read secrets from a .env file.
--project-ref <string>Optional
Project ref of the Supabase project.

supabase secrets list
List all secrets in the linked project.
Usage
supabase secrets list
Flags
--project-ref <string>Optional
Project ref of the Supabase project.

supabase secrets unset
Unset a secret(s) from the linked Supabase project.
Usage
supabase secrets unset [NAME] ...
Flags
--project-ref <string>Optional
Project ref of the Supabase project.

supabase storage
Subcommands
supabase storage cp
supabase storage ls
supabase storage mv
supabase storage rm

supabase storage ls
Usage
supabase storage ls [path] [flags]
Flags
-r, --recursiveOptional
Recursively list a directory.
--experimentalRequired
enable experimental features
--linkedOptional
Connects to Storage API of the linked project.
--localOptional
Connects to Storage API of the local database.

supabase storage cp
Usage
supabase storage cp <src> <dst> [flags]
Flags
--cache-control <string>Optional
Custom Cache-Control header for HTTP upload.
--content-type <string>Optional
Custom Content-Type header for HTTP upload.
-j, --jobs <uint>Optional
Maximum number of parallel jobs.
-r, --recursiveOptional
Recursively copy a directory.
--experimentalRequired
enable experimental features
--linkedOptional
Connects to Storage API of the linked project.
--localOptional
Connects to Storage API of the local database.

supabase storage mv
Usage
supabase storage mv <src> <dst> [flags]
Flags
-r, --recursiveOptional
Recursively move a directory.
--experimentalRequired
enable experimental features
--linkedOptional
Connects to Storage API of the linked project.
--localOptional
Connects to Storage API of the local database.

supabase storage rm
Usage
supabase storage rm <file> ... [flags]
Flags
-r, --recursiveOptional
Recursively remove a directory.
--experimentalRequired
enable experimental features
--linkedOptional
Connects to Storage API of the linked project.
--localOptional
Connects to Storage API of the local database.

supabase encryption
Subcommands
supabase encryption get-root-key
supabase encryption update-root-key

supabase encryption get-root-key
Usage
supabase encryption get-root-key
Flags
--project-ref <string>Optional
Project ref of the Supabase project.

supabase encryption update-root-key
Usage
supabase encryption update-root-key
Flags
--project-ref <string>Optional
Project ref of the Supabase project.

supabase sso
Subcommands
supabase sso add
supabase sso info
supabase sso list
supabase sso remove
supabase sso show
supabase sso update

supabase sso add
Add and configure a new connection to a SSO identity provider to your Supabase project.
Usage
supabase sso add [flags]
Flags
--attribute-mapping-file <string>Optional
File containing a JSON mapping between SAML attributes to custom JWT claims.
--domains <strings>Optional
Comma separated list of email domains to associate with the added identity provider.
--metadata-file <string>Optional
File containing a SAML 2.0 Metadata XML document describing the identity provider.
--metadata-url <string>Optional
URL pointing to a SAML 2.0 Metadata XML document describing the identity provider.
--skip-url-validationOptional
Whether local validation of the SAML 2.0 Metadata URL should not be performed.
-t, --type <[ saml ]>Required
Type of identity provider (according to supported protocol).
--project-ref <string>Optional
Project ref of the Supabase project.
Add with Metadata URLAdd with Metadata File
supabase sso add \
 --project-ref abcdefgijklmnopqrst \
 --type saml \
 --metadata-url 'https://...' \
 --domains company.com
Response
Information about the added identity provider. You can use
company.com as the domain name on the frontend side to initiate a SSO
request to the identity provider.

supabase sso list
List all connections to a SSO identity provider to your Supabase project.
Usage
supabase sso list
Flags
--project-ref <string>Optional
Project ref of the Supabase project.

supabase sso show
Provides the information about an established connection to an identity provider. You can use --metadata to obtain the raw SAML 2.0 Metadata XML document stored in your project's configuration.
Usage
supabase sso show <provider-id> [flags]
Flags
--metadataOptional
Show SAML 2.0 XML Metadata only
--project-ref <string>Optional
Project ref of the Supabase project.
Show informationGet raw SAML 2.0 Metadata XML
supabase sso show 6df4d73f-bf21-405f-a084-b11adf19fea5 \
 --project-ref abcdefghijklmnopqrst
Response
Information about the identity provider in pretty output.

supabase sso info
Returns all of the important SSO information necessary for your project to be registered with a SAML 2.0 compatible identity provider.
Usage
supabase sso info
Flags
--project-ref <string>Optional
Project ref of the Supabase project.
Show project information
supabase sso info --project-ref abcdefghijklmnopqrst
Response
Information about your project's SAML 2.0 configuration.

supabase sso update
Update the configuration settings of a already added SSO identity provider.
Usage
supabase sso update <provider-id> [flags]
Flags
--add-domains <strings>Optional
Add this comma separated list of email domains to the identity provider.
--attribute-mapping-file <string>Optional
File containing a JSON mapping between SAML attributes to custom JWT claims.
--domains <strings>Optional
Replace domains with this comma separated list of email domains.
--metadata-file <string>Optional
File containing a SAML 2.0 Metadata XML document describing the identity provider.
--metadata-url <string>Optional
URL pointing to a SAML 2.0 Metadata XML document describing the identity provider.
--remove-domains <strings>Optional
Remove this comma separated list of email domains from the identity provider.
--skip-url-validationOptional
Whether local validation of the SAML 2.0 Metadata URL should not be performed.
--project-ref <string>Optional
Project ref of the Supabase project.
Replace domainsAdd an additional domainRemove a domain
supabase sso update 6df4d73f-bf21-405f-a084-b11adf19fea5 \
 --project-ref abcdefghijklmnopqrst \
 --domains new-company.com,new-company.net
Response
Information about the updated provider.

supabase sso remove
Remove a connection to an already added SSO identity provider. Removing the provider will prevent existing users from logging in. Please treat this command with care.
Usage
supabase sso remove <provider-id>
Flags
--project-ref <string>Optional
Project ref of the Supabase project.
Remove a provider
supabase sso remove 6df4d73f-bf21-405f-a084-b11adf19fea5 \
 --project-ref abcdefghijklmnopqrst
Response
Information about the removed identity provider. It's a good idea to
save this in case you need it later on.

supabase domains
Manage custom domain names for Supabase projects.
Use of custom domains and vanity subdomains is mutually exclusive.
Subcommands
supabase domains activate
supabase domains create
supabase domains delete
supabase domains get
supabase domains reverify

supabase domains activate
Activates the custom hostname configuration for a project.
This reconfigures your Supabase project to respond to requests on your custom hostname.
After the custom hostname is activated, your project's third-party auth providers will no longer function on the Supabase-provisioned subdomain. Please refer to Prepare to activate your domain section in our documentation to learn more about the steps you need to follow.
Usage
supabase domains activate
Flags
--include-raw-outputOptional
Include raw output (useful for debugging).
--project-ref <string>Optional
Project ref of the Supabase project.

supabase domains create
Create a custom hostname for your Supabase project.
Expects your custom hostname to have a CNAME record to your Supabase project's subdomain.
Usage
supabase domains create [flags]
Flags
--custom-hostname <string>Optional
The custom hostname to use for your Supabase project.
--include-raw-outputOptional
Include raw output (useful for debugging).
--project-ref <string>Optional
Project ref of the Supabase project.

supabase domains get
Retrieve the custom hostname config for your project, as stored in the Supabase platform.
Usage
supabase domains get
Flags
--include-raw-outputOptional
Include raw output (useful for debugging).
--project-ref <string>Optional
Project ref of the Supabase project.

supabase domains reverify
Usage
supabase domains reverify
Flags
--include-raw-outputOptional
Include raw output (useful for debugging).
--project-ref <string>Optional
Project ref of the Supabase project.

supabase domains delete
Usage
supabase domains delete
Flags
--include-raw-outputOptional
Include raw output (useful for debugging).
--project-ref <string>Optional
Project ref of the Supabase project.

supabase vanity-subdomains
Manage vanity subdomains for Supabase projects.
Usage of vanity subdomains and custom domains is mutually exclusive.
Subcommands
supabase vanity-subdomains activate
supabase vanity-subdomains check-availability
supabase vanity-subdomains delete
supabase vanity-subdomains get

supabase vanity-subdomains activate
Activate a vanity subdomain for your Supabase project.
This reconfigures your Supabase project to respond to requests on your vanity subdomain.
After the vanity subdomain is activated, your project's auth services will no longer function on the {project-ref}.{supabase-domain} hostname.
Usage
supabase vanity-subdomains activate [flags]
Flags
--desired-subdomain <string>Optional
The desired vanity subdomain to use for your Supabase project.
--experimentalRequired
enable experimental features
--project-ref <string>Optional
Project ref of the Supabase project.

supabase vanity-subdomains get
Usage
supabase vanity-subdomains get
Flags
--experimentalRequired
enable experimental features
--project-ref <string>Optional
Project ref of the Supabase project.

supabase vanity-subdomains check-availability
Usage
supabase vanity-subdomains check-availability [flags]
Flags
--desired-subdomain <string>Optional
The desired vanity subdomain to use for your Supabase project.
--experimentalRequired
enable experimental features
--project-ref <string>Optional
Project ref of the Supabase project.

supabase vanity-subdomains delete
Deletes the vanity subdomain for a project, and reverts to using the project ref for routing.
Usage
supabase vanity-subdomains delete
Flags
--experimentalRequired
enable experimental features
--project-ref <string>Optional
Project ref of the Supabase project.

supabase network-bans
Network bans are IPs that get temporarily blocked if their traffic pattern looks abusive (e.g. multiple failed auth attempts).
The subcommands help you view the current bans, and unblock IPs if desired.
Subcommands
supabase network-bans get
supabase network-bans remove

supabase network-bans get
Usage
supabase network-bans get
Flags
--experimentalRequired
enable experimental features
--project-ref <string>Optional
Project ref of the Supabase project.

supabase network-bans remove
Usage
supabase network-bans remove [flags]
Flags
--db-unban-ip <strings>Optional
IP to allow DB connections from.
--experimentalRequired
enable experimental features
--project-ref <string>Optional
Project ref of the Supabase project.

supabase network-restrictions
Subcommands
supabase network-restrictions get
supabase network-restrictions update

supabase network-restrictions get
Usage
supabase network-restrictions get
Flags
--experimentalRequired
enable experimental features
--project-ref <string>Optional
Project ref of the Supabase project.

supabase network-restrictions update
Usage
supabase network-restrictions update [flags]
Flags
--bypass-cidr-checksOptional
Bypass some of the CIDR validation checks.
--db-allow-cidr <strings>Optional
CIDR to allow DB connections from.
--experimentalRequired
enable experimental features
--project-ref <string>Optional
Project ref of the Supabase project.

supabase ssl-enforcement
Subcommands
supabase ssl-enforcement get
supabase ssl-enforcement update

supabase ssl-enforcement get
Usage
supabase ssl-enforcement get
Flags
--experimentalRequired
enable experimental features
--project-ref <string>Optional
Project ref of the Supabase project.

supabase ssl-enforcement update
Usage
supabase ssl-enforcement update [flags]
Flags
--disable-db-ssl-enforcementOptional
Whether the DB should disable SSL enforcement for all external connections.
--enable-db-ssl-enforcementOptional
Whether the DB should enable SSL enforcement for all external connections.
--experimentalRequired
enable experimental features
--project-ref <string>Optional
Project ref of the Supabase project.

supabase postgres-config
Subcommands
supabase postgres-config delete
supabase postgres-config get
supabase postgres-config update

supabase postgres-config get
Usage
supabase postgres-config get
Flags
--experimentalRequired
enable experimental features
--project-ref <string>Optional
Project ref of the Supabase project.

supabase postgres-config update
Overriding the default Postgres config could result in unstable database behavior.
Custom configuration also overrides the optimizations generated based on the compute add-ons in use.
Usage
supabase postgres-config update [flags]
Flags
--config <strings>Optional
Config overrides specified as a 'key=value' pair
--no-restartOptional
Do not restart the database after updating config.
--replace-existing-overridesOptional
If true, replaces all existing overrides with the ones provided. If false (default), merges existing overrides with the ones provided.
--experimentalRequired
enable experimental features
--project-ref <string>Optional
Project ref of the Supabase project.

supabase postgres-config delete
Delete specific config overrides, reverting them to their default values.
Usage
supabase postgres-config delete [flags]
Flags
--config <strings>Optional
Config keys to delete (comma-separated)
--no-restartOptional
Do not restart the database after deleting config.
--experimentalRequired
enable experimental features
--project-ref <string>Optional
Project ref of the Supabase project.

supabase snippets
Subcommands
supabase snippets download
supabase snippets list

supabase snippets list
List all SQL snippets of the linked project.
Usage
supabase snippets list
Flags
--project-ref <string>Optional
Project ref of the Supabase project.

supabase snippets download
Download contents of the specified SQL snippet.
Usage
supabase snippets download <snippet-id>
Flags
--project-ref <string>Optional
Project ref of the Supabase project.

supabase services
Usage
supabase services

supabase completion
Generate the autocompletion script for supabase for the specified shell.
See each sub-command's help for details on how to use the generated script.
Subcommands
supabase completion bash
supabase completion fish
supabase completion powershell
supabase completion zsh

supabase completion zsh
Generate the autocompletion script for the zsh shell.
If shell completion is not already enabled in your environment you will need
to enable it. You can execute the following once:
echo "autoload -U compinit; compinit" >> ~/.zshrc

To load completions in your current shell session:
source <(supabase completion zsh)

To load completions for every new session, execute once:
Linux:
supabase completion zsh > "${fpath[1]}/_supabase"

macOS:
supabase completion zsh > $(brew --prefix)/share/zsh/site-functions/_supabase

You will need to start a new shell for this setup to take effect.
Usage
supabase completion zsh [flags]
Flags
--no-descriptionsOptional
disable completion descriptions

supabase completion powershell
Generate the autocompletion script for powershell.
To load completions in your current shell session:
supabase completion powershell | Out-String | Invoke-Expression

To load completions for every new session, add the output of the above command
to your powershell profile.
Usage
supabase completion powershell [flags]
Flags
--no-descriptionsOptional
disable completion descriptions

supabase completion fish
Generate the autocompletion script for the fish shell.
To load completions in your current shell session:
supabase completion fish | source

To load completions for every new session, execute once:
supabase completion fish > ~/.config/fish/completions/supabase.fish

You will need to start a new shell for this setup to take effect.
Usage
supabase completion fish [flags]
Flags
--no-descriptionsOptional
disable completion descriptions

supabase completion bash
Generate the autocompletion script for the bash shell.
This script depends on the 'bash-completion' package.
If it is not installed already, you can install it via your OS's package manager.
To load completions in your current shell session:
source <(supabase completion bash)

To load completions for every new session, execute once:
Linux:
supabase completion bash > /etc/bash_completion.d/supabase

macOS:
supabase completion bash > $(brew --prefix)/etc/bash_completion.d/supabase

You will need to start a new shell for this setup to take effect.
Usage
supabase completion bash
Flags
--no-descriptionsOptional
disable completion descriptions
Need some help?
Contact support
Latest product updates?
See Changelog
Something's not right?
Check system status

© Supabase Inc—ContributingAuthor StyleguideOpen SourceSupaSquadPrivacy Settings
GitHub
Twitter
Discord

Local development with schema migrations
Develop locally with the Supabase CLI and schema migrations.

Supabase is a flexible platform that lets you decide how you want to build your projects. You can use the Dashboard directly to get up and running quickly, or use a proper local setup. We suggest you work locally and deploy your changes to a linked project on the Supabase Platform.
Develop locally using the CLI to run a local Supabase stack. You can use the integrated Studio Dashboard to make changes, then capture your changes in schema migration files, which can be saved in version control.
Alternatively, if you're comfortable with migration files and SQL, you can write your own migrations and push them to the local database for testing before sharing your changes.
Database migrations#
Database changes are managed through "migrations." Database migrations are a common way of tracking changes to your database over time.
For this guide, we'll create a table called employees and see how we can make changes to it.
1
Create your first migration file
To get started, generate a new migration to store the SQL needed to create our employees table
Terminal
supabase migration new create_employees_table
2
Add the SQL to your migration file
This creates a new migration: supabase/migrations/<timestamp>
_create_employees_table.sql.
To that file, add the SQL to create this employees table
20250101000000_create_employees_table.sql
create table employees (
 id bigint primary key generated always as identity,
 name text,
 email text,
 created_at timestamptz default now()
);
3
Apply your migration
Now that you have a migration file, you can run this migration and create the employees table.
Use the reset command here to reset the database to the current migrations
Terminal
supabase db reset
4
Modify your employees table
Now you can visit your new employees table in the Dashboard.
Next, modify your employees table by adding a column for department. Create a new migration file for that.
Terminal
supabase migration new add_department_to_employees_table
5
Add a new column to your table
This creates a new migration file: supabase/migrations/<timestamp>
_add_department_to_employees_table.sql.
To that file, add the SQL to create a new department column
20250101000001_add_department_to_employees_table.sql
alter table if exists public.employees
add department text default 'Hooli';
Add sample data#
Now that you are managing your database with migrations scripts, it would be great have some seed data to use every time you reset the database.
For this, you can create a seed script in supabase/seed.sql.
1
Populate your table
Insert data into your employees table with your supabase/seed.sql file.
supabase/seed.sql
insert into public.employees
 (name)
values
 ('Erlich Bachman'),
 ('Richard Hendricks'),
 ('Monica Hall');
2
Reset your database
Reset your database (apply current migrations), and populate with seed data
Terminal
supabase db reset
You should now see the employees table, along with your seed data in the Dashboard! All of your database changes are captured in code, and you can reset to a known state at any time, complete with seed data.
Diffing changes#
This workflow is great if you know SQL and are comfortable creating tables and columns. If not, you can still use the Dashboard to create tables and columns, and then use the CLI to diff your changes and create migrations.
Create a new table called cities, with columns id, name and population. To see the corresponding SQL for this, you can use the supabase db diff --schema public command. This will show you the SQL that will be run to create the table and columns. The output of supabase db diff will look something like this:
Diffing schemas: public
Finished supabase db diff on branch main.
create table "public"."cities" (
   "id" bigint primary key generated always as identity,
   "name" text,
   "population" bigint
);
Alternately, you can view your table definitions directly from the Table Editor:

You can then copy this SQL into a new migration file, and run supabase db reset to apply the changes.
The last step is deploying these changes to a live Supabase project.
Deploy your project#
You've been developing your project locally, making changes to your tables via migrations. It's time to deploy your project to the Supabase Platform and start scaling up to millions of users! Head over to Supabase and create a new project to deploy to.
Log in to the Supabase CLI#
Terminal
npx
supabase login
Link your project#
Associate your project with your remote project using supabase link.
supabase link --project-ref <project-id>
# You can get <project-id> from your project's dashboard URL: https://supabase.com/dashboard/project/<project-id>
supabase db pull
# Capture any changes that you have made to your remote database before you went through the steps above
# If you have not made any changes to the remote database, skip this step
supabase/migrations is now populated with a migration in <timestamp>_remote_schema.sql.
This migration captures any changes required for your local database to match the schema of your remote Supabase project.
Review the generated migration file and once happy, apply the changes to your local instance:
# To apply the new migration to your local database:
supabase migration up
# To reset your local database completely:
supabase db reset
There are a few commands required to link your project. We are in the process of consolidating these commands into a single command. Bear with us!
Deploy database changes#
Deploy any local database migrations using db push:
supabase db push
Visiting your live project on Supabase, you'll see a new employees table, complete with the department column you added in the second migration above.
Deploy Edge Functions#
If your project uses Edge Functions, you can deploy these using functions deploy:
supabase functions deploy <function_name>
Use Auth locally#
To use Auth locally, update your project's supabase/config.toml file that gets created after running supabase init. Add any providers you want, and set enabled to true.
[auth.external.github]
enabled = true
client_id = "env(SUPABASE_AUTH_GITHUB_CLIENT_ID)"
secret = "env(SUPABASE_AUTH_GITHUB_SECRET)"
redirect_uri = "http://localhost:54321/auth/v1/callback"
As a best practice, any secret values should be loaded from environment variables. You can add them to .env file in your project's root directory for the CLI to automatically substitute them.
SUPABASE_AUTH_GITHUB_CLIENT_ID="redacted"
SUPABASE_AUTH_GITHUB_SECRET="redacted"
For these changes to take effect, you need to run supabase stop and supabase start again.
If you have additional triggers or RLS policies defined on your auth schema, you can pull them as a migration file locally.
supabase db pull --schema auth
Sync storage buckets#
Your RLS policies on storage buckets can be pulled locally by specifying storage schema. For example,
supabase db pull --schema storage
The buckets and objects themselves are rows in the storage tables so they won't appear in your schema. You can instead define them via supabase/config.toml file. For example,
[storage.buckets.images]
public = false
file_size_limit = "50MiB"
allowed_mime_types = ["image/png", "image/jpeg"]
objects_path = "./images"
This will upload files from supabase/images directory to a bucket named images in your project with one command.
supabase seed buckets
Sync any schema with --schema#
You can synchronize your database with a specific schema using the --schema option as follows:
supabase db pull --schema <schema_name>
Using --schema
If the local supabase/migrations directory is empty, the db pull command will ignore the --schema parameter.
To fix this, you can pull twice:
supabase db pull
supabase db pull --schema <schema_name>
Limitations and considerations#
The local development environment is not as feature-complete as the Supabase Platform. Here are some of the differences:
You cannot update your project settings in the Dashboard. This must be done using the local config file.
The CLI version determines the local version of Studio used, so make sure you keep your local Supabase CLI up to date. We're constantly adding new features and bug fixes.
Edit this page on GitHub
Watch video guide

Is this helpful?
No
Yes
On this page
Database migrationsAdd sample dataDiffing changesDeploy your projectLog in to the Supabase CLILink your projectDeploy database changesDeploy Edge FunctionsUse Auth locallySync storage bucketsSync any schema with --schemaLimitations and considerations
Need some help?
Contact support
Latest product updates?
See Changelog
Something's not right?
Check system status

© Supabase Inc—ContributingAuthor StyleguideOpen SourceSupaSquadPrivacy Settings
GitHub
Twitter
Discord

Declarative database schemas
Manage your database schemas in one place and generate versioned migrations.

Overview#
Declarative schemas provide a developer-friendly way to maintain schema migrations.
Migrations are traditionally managed imperatively (you provide the instructions on how exactly to change the database). This can lead to related information being scattered over multiple migration files. With declarative schemas, you instead declare the state you want your database to be in, and the instructions are generated for you.
Schema migrations#
Schema migrations are SQL statements written in Data Definition Language. They are versioned in your supabase/migrations directory to ensure schema consistency between local and remote environments.
Declaring your schema#
1
Create your first schema file
Create a SQL file in supabase/schemas directory that defines an employees table.
supabase/schemas/employees.sql
create table "employees" (
 "id" integer not null,
 "name" text
);
Make sure your local database is stopped before diffing your schema.
2
Generate a migration file
Generate a migration file by diffing against your declared schema.
Terminal
supabase db diff -f create_employees_table
3
Start the local database and apply migrations
Start the local database first. Then, apply the migration manually to see your schema changes in the local Dashboard.
Terminal
supabase start
supabase migration up
Updating your schema#
1
Add a new column
Edit supabase/schemas/employees.sql file to add a new column to employees table.
supabase/schemas/employees.sql
create table "employees" (
 "id" integer not null,
 "name" text,
 "age" smallint not null
);
Some entities like views and enums expect columns to be declared in a specific order. To avoid messy diffs, always append new columns to the end of the table.
2
Generate a new migration
Diff existing migrations against your declared schema.
Terminal
supabase db diff -f add_age
3
Review the generated migration
Verify that the generated migration contain a single incremental change.
supabase/migrations/<timestamp>_add_age.sql
alter table "public"."employees" add column "age" smallint not null;
4
Apply the pending migration
Start the database locally and apply the pending migration.
Terminal
supabase migration up
Deploying your schema changes#
1
Log in to the Supabase CLI
Log in via the Supabase CLI.
Terminal
supabase login
2
Link your remote project
Follow the on-screen prompts to link your remote project.
Terminal
supabase link
3
Deploy database changes
Push your changes to the remote database.
Terminal
supabase db push
Managing dependencies#
As your database schema evolves, you will probably start using more advanced entities like views and functions. These entities are notoriously verbose to manage using plain migrations because the entire body must be recreated whenever there is a change. Using declarative schema, you can now edit them in-place so it’s much easier to review.
supabase/schemas/employees.sql
create table "employees" (
 "id" integer not null,
 "name" text,
 "age" smallint not null
);
create view "profiles" as
 select id, name from "employees";
create function "get_age"(employee_id integer) RETURNS smallint
 LANGUAGE "sql"
AS $$
 select age
 from employees
 where id = employee_id;
$$;
Your schema files are run in lexicographic order by default. The order is important when you have foreign keys between multiple tables as the parent table must be created first. For example, your supabase directory may end up with the following structure.
.
└── supabase/
   ├── schemas/
   │   ├── employees.sql
   │   └── managers.sql
   └── migrations/
       ├── 20241004112233_create_employees_table.sql
       ├── 20241005112233_add_employee_age.sql
       └── 20241006112233_add_managers_table.sql
For small projects with only a few tables, the default schema order may be sufficient. However, as your project grows, you might need more control over the order in which schemas are applied. To specify a custom order for applying the schemas, you can declare them explicitly in config.toml. Any glob patterns will evaluated, deduplicated, and sorted in lexicographic order. For example, the following pattern ensures employees.sql is always executed first.
supabase/config.toml
[db.migrations]
schema_paths = [
 "./schemas/employees.sql",
 "./schemas/*.sql",
]
Pulling in your production schema#
To set up declarative schemas on a existing project, you can pull in your production schema by running:
Terminal
supabase db dump > supabase/schemas/prod.sql
From there, you can start breaking down your schema into smaller files and generate migrations. You can do this all at once, or incrementally as you make changes to your schema.
Rolling back a schema change#
During development, you may want to rollback a migration to keep your new schema changes in a single migration file. This can be done by resetting your local database to a previous version.
Terminal
supabase db reset --version 20241005112233
After a reset, you can edit the schema and regenerate a new migration file. Note that you should not reset a version that's already deployed to production.
If you need to rollback a migration that's already deployed, you should first revert changes to the schema files. Then you can generate a new migration file containing the down migration. This ensures your production migrations are always rolling forward.
SQL statements generated in a down migration are usually destructive. You must review them carefully to avoid unintentional data loss.
Known caveats#
The migra diff tool used for generating schema diff is capable of tracking most database changes. However, there are edge cases where it can fail.
If you need to use any of the entities below, remember to add them through versioned migrations instead.
Data manipulation language#
DML statements such as insert, update, delete, etc., are not captured by schema diff
View ownership#
view owner and grants
security invoker on views
materialized views
doesn’t recreate views when altering column type
RLS policies#
alter policy statements
column privileges
Other entities#
schema privileges are not tracked because each schema is diffed separately
comments are not tracked
partitions are not tracked
alter publication ... add table ...
create domain statements are ignored
grant statements are duplicated from default privileges
Edit this page on GitHub
Is this helpful?
No
Yes
On this page
OverviewSchema migrationsDeclaring your schemaUpdating your schemaDeploying your schema changesManaging dependenciesPulling in your production schemaRolling back a schema changeKnown caveatsData manipulation languageView ownershipRLS policiesOther entities
Need some help?
Contact support
Latest product updates?
See Changelog
Something's not right?
Check system status

© Supabase Inc—ContributingAuthor StyleguideOpen SourceSupaSquadPrivacy Settings
GitHub
Twitter
Discord

Seeding your database
Populate your database with initial data for reproducible environments across local and testing.

What is seed data?#
Seeding is the process of populating a database with initial data, typically used to provide sample or default records for testing and development purposes. You can use this to create "reproducible environments" for local development, staging, and production.
Using seed files#
Seed files are executed every time you run supabase start or supabase db reset. Seeding occurs after all database migrations have been completed. As a best practice, only include data insertions in your seed files, and avoid adding schema statements.
By default, if no specific configuration is provided, the system will look for a seed file matching the pattern supabase/seed.sql. This maintains backward compatibility with earlier versions, where the seed file was placed in the supabase folder.
You can add any SQL statements to this file. For example:
insert into countries
 (name, code)
values
 ('United States', 'US'),
 ('Canada', 'CA'),
 ('Mexico', 'MX');
If you want to manage multiple seed files or organize them across different folders, you can configure additional paths or glob patterns in your config.toml (see the next section for details).
Splitting up your seed file#
For better modularity and maintainability, you can split your seed data into multiple files. For example, you can organize your seeds by table and include files such as countries.sql and cities.sql. Configure them in config.toml like so:
[db.seed]
enabled = true
sql_paths = ['./countries.sql', './cities.sql']
Or to include all .sql files under a specific folder you can do:
[db.seed]
enabled = true
sql_paths = ['./seeds/*.sql']
The CLI processes seed files in the order they are declared in the sql_paths array. If a glob pattern is used and matches multiple files, those files are sorted in lexicographic order to ensure consistent execution. Additionally:
The base folder for the pattern matching is supabase so ./countries.sql will search for supabase/countries.sql
Files matched by multiple patterns will be deduplicated to prevent redundant seeding.
If a pattern does not match any files, a warning will be logged to help you troubleshoot potential configuration issues.
Generating seed data#
You can generate seed data for local development using Snaplet.
To use Snaplet, you need to have Node.js and npm installed. You can add Node.js to your project by running npm init -y in your project directory.
If this is your first time using Snaplet to seed your project, you'll need to set up Snaplet with the following command:
npx @snaplet/seed init
This command will analyze your database and its structure, and then generate a JavaScript client which can be used to define exactly how your data should be generated using code. The init command generates a configuration file, seed.config.ts and an example script, seed.ts, as a starting point.
During init if you are not using an Object Relational Mapper (ORM) or your ORM is not in the supported list, choose node-postgres.
In most cases you only want to generate data for specific schemas or tables. This is defined with select. Here is an example seed.config.ts configuration file:
export default defineConfig({
 adapter: async () => {
   const client = new Client({
     connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres',
   })
   await client.connect()
   return new SeedPg(client)
 },
 // We only want to generate data for the public schema
 select: ['!*', 'public.*'],
})
Suppose you have a database with the following schema:

You can use the seed script example generated by Snaplet seed.ts to define the values you want to generate. For example:
A Post with the title "There is a lot of snow around here!"
The Post.createdBy user with an email address ending in "@acme.org"
Three Post.comments from three different users.
import { createSeedClient } from '@snaplet/seed'
import { copycat } from '@snaplet/copycat'
async function main() {
 const seed = await createSeedClient({ dryRun: true })
 await seed.Post([
   {
     title: 'There is a lot of snow around here!',
     createdBy: {
       email: (ctx) =>
         copycat.email(ctx.seed, {
           domain: 'acme.org',
         }),
     },
     Comment: (x) => x(3),
   },
 ])
 process.exit()
}
main()
Running npx tsx seed.ts > supabase/seed.sql generates the relevant SQL statements inside your supabase/seed.sql file:
-- The `Post.createdBy` user with an email address ending in `"@acme.org"`
INSERT INTO "User" (name, email) VALUES ("John Snow", "snow@acme.org")
--- A `Post` with the title `"There is a lot of snow around here!"`
INSERT INTO "Post" (title, content, createdBy) VALUES (
 "There is a lot of snow around here!",
 "Lorem ipsum dolar",
 1)
--- Three `Post.Comment` from three different users.
INSERT INTO "User" (name, email) VALUES ("Stephanie Shadow", "shadow@domain.com")
INSERT INTO "Comment" (text, userId, postId) VALUES ("I love cheese", 2, 1)
INSERT INTO "User" (name, email) VALUES ("John Rambo", "rambo@trymore.dev")
INSERT INTO "Comment" (text, userId, postId) VALUES ("Lorem ipsum dolar sit", 3, 1)
INSERT INTO "User" (name, email) VALUES ("Steven Plank", "s@plank.org")
INSERT INTO "Comment" (text, userId, postId) VALUES ("Actually, that's not correct...", 4, 1)
Whenever your database structure changes, you will need to regenerate @snaplet/seed to keep it in sync with the new structure. You can do this by running:
npx @snaplet/seed sync
You can further enhance your seed script by using Large Language Models to generate more realistic data. To enable this feature, set one of the following environment variables in your .env file:
OPENAI_API_KEY=<your_openai_api_key>
GROQ_API_KEY=<your_groq_api_key>
After setting the environment variables, run the following commands to sync and generate the seed data:
npx @snaplet/seed sync
npx tsx seed.ts > supabase/seed.sql
For more information, check out Snaplet's seed documentation
Edit this page on GitHub
Is this helpful?
No
Yes
On this page
What is seed data?Using seed filesSplitting up your seed fileGenerating seed data
Need some help?
Contact support
Latest product updates?
See Changelog
Something's not right?
Check system status

© Supabase Inc—ContributingAuthor StyleguideOpen SourceSupaSquadPrivacy Settings
GitHub
Twitter
Discord

Managing config and secrets

The Supabase CLI uses a config.toml file to manage local configuration. This file is located in the supabase directory of your project.
Config reference#
The config.toml file is automatically created when you run supabase init.
There are a wide variety of options available, which can be found in the CLI Config Reference.
For example, to enable the "Apple" OAuth provider for local development, you can append the following information to config.toml:
[auth.external.apple]
enabled = false
client_id = ""
secret = ""
redirect_uri = "" # Overrides the default auth redirectUrl.
Using secrets inside config.toml#
You can reference environment variables within the config.toml file using the env() function. This will detect any values stored in an .env file at the root of your project directory. This is particularly useful for storing sensitive information like API keys, and any other values that you don't want to check into version control.
.
├── .env
├── .env.example
└── supabase
   └── config.toml
Do NOT commit your .env into git. Be sure to configure your .gitignore to exclude this file.
For example, if your .env contained the following values:
GITHUB_CLIENT_ID=""
GITHUB_SECRET=""
Then you would reference them inside of our config.toml like this:
[auth.external.github]
enabled = true
client_id = "env(GITHUB_CLIENT_ID)"
secret = "env(GITHUB_SECRET)"
redirect_uri = "" # Overrides the default auth redirectUrl.
Going further#
For more advanced secrets management workflows, including:
Using dotenvx for encrypted secrets: Learn how to securely manage environment variables across different branches and environments
Branch-specific secrets: Understand how to manage secrets for different deployment environments
Encrypted configuration values: Use encrypted values directly in your config.toml
See the Managing secrets for branches section in our branching documentation, or check out the dotenvx example repository for a complete implementation.
Edit this page on GitHub
Is this helpful?
No
Yes
On this page
Config referenceUsing secrets inside config.tomlGoing further
Need some help?
Contact support
Latest product updates?
See Changelog
Something's not right?
Check system status

© Supabase Inc—ContributingAuthor StyleguideOpen SourceSupaSquadPrivacy Settings
GitHub
Twitter
Discord

Restoring a downloaded backup locally
Restore a backup of a remote database on a local instance to inspect and extract data

If your paused project has exceeded its restoring time limit, you can download a backup from the dashboard and restore it to your local development environment. This might be useful for inspecting and extracting data from your paused project.
If you want to restore your backup to a hosted Supabase project, follow the Migrating within Supabase guide instead.
Downloading your backup#
First, download your project's backup file from dashboard and identify its backup image version (following the PG: prefix):

Restoring your backup#
Given Postgres version 15.6.1.115, start Postgres locally with db_cluster.backup being the path to your backup file.
supabase init
echo '15.6.1.115' > supabase/.temp/postgres-version
supabase db start --from-backup db_cluster.backup
Note that the earliest Supabase Postgres version that supports a local restore is 15.1.0.55. If your hosted project was running on earlier versions, you will likely run into errors during restore. Before submitting any support ticket, make sure you have attached the error logs from supabase_db_* docker container.
Once your local database starts up successfully, you can connect using psql to verify that all your data is restored.
psql 'postgresql://postgres:postgres@localhost:54322/postgres'
If you want to use other services like Auth, Storage, and Studio dashboard together with your restored database, restart the local development stack.
supabase stop
supabase start
A Postgres database started with Supabase CLI is not production ready and should not be used outside of local development.
Edit this page on GitHub
Is this helpful?
No
Yes
On this page
Downloading your backupRestoring your backup
Need some help?
Contact support
Latest product updates?
See Changelog
Something's not right?
Check system status

© Supabase Inc—ContributingAuthor StyleguideOpen SourceSupaSquadPrivacy Settings
GitHub
Twitter
Discord

Customizing email templates
Customizing local email templates using config.toml.

You can customize the email templates for local development using the config.toml settings.
Configuring templates#
You should provide a relative URL to the content_path parameter, pointing to an HTML file which contains the template. For example
supabase/config.toml
supabase/templates/invite.html
[auth.email.template.invite]
subject = "You are invited to Acme Inc"
content_path = "./supabase/templates/invite.html"
Available email templates#
There are several Auth email templates which can be configured. Each template serves a specific authentication flow:
auth.email.template.invite#
Default subject: "You have been invited"
When sent: When a user is invited to join your application via email invitation
Purpose: Allows administrators to invite users who don't have accounts yet
Content: Contains a link for the invited user to accept the invitation and create their account
auth.email.template.confirmation#
Default subject: "Confirm Your Signup"
When sent: When a user signs up and needs to verify their email address
Purpose: Email verification for new user registrations
Content: Contains a confirmation link to verify the user's email address
auth.email.template.recovery#
Default subject: "Reset Your Password"
When sent: When a user requests a password reset
Purpose: Password recovery flow for users who forgot their password
Content: Contains a link to reset the user's password
auth.email.template.magic_link#
Default subject: "Your Magic Link"
When sent: When a user requests a magic link for passwordless authentication
Purpose: Passwordless login using email links
Content: Contains a secure link that automatically logs the user in when clicked
auth.email.template.email_change#
Default subject: "Confirm Email Change"
When sent: When a user requests to change their email address
Purpose: Verification for email address changes
Content: Contains a confirmation link to verify the new email address
auth.email.template.reauthentication#
Default subject: "Confirm Reauthentication"
When sent: When a user needs to re-authenticate for sensitive operations
Purpose: Additional verification for sensitive actions (like changing password, deleting account)
Content: Contains a 6-digit OTP code for verification
Template variables#
The templating system provides the following variables for use:
ConfirmationURL#
Contains the confirmation URL. For example, a signup confirmation URL would look like:
https://project-ref.supabase.co/auth/v1/verify?token={{ .TokenHash }}&type=email&redirect_to=https://example.com/path
Usage
<p>Click here to confirm: {{ .ConfirmationURL }}</p>
Token#
Contains a 6-digit One-Time-Password (OTP) that can be used instead of the ConfirmationURL.
Usage
<p>Here is your one time password: {{ .Token }}</p>
TokenHash#
Contains a hashed version of the Token. This is useful for constructing your own email link in the email template.
Usage
<p>Follow this link to confirm your user:</p>
<p>
 <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email"
   >Confirm your email</a
 >
</p>
SiteURL#
Contains your application's Site URL. This can be configured in your project's authentication settings.
Usage
<p>Visit <a href="{{ .SiteURL }}">here</a> to log in.</p>
Email#
Contains the user's email address.
Usage
<p>A recovery request was sent to {{ .Email }}.</p>
NewEmail#
Contains the new user's email address. This is only available in the email_change email template.
Usage
<p>You are requesting to update your email address to {{ .NewEmail }}.</p>
Deploying email templates#
These settings are for local development. To apply the changes locally, stop and restart the Supabase containers:
supabase stop && supabase start
For hosted projects managed by Supabase, copy the templates into the Email Templates section of the Dashboard.
Edit this page on GitHub
Is this helpful?
No
Yes
On this page
Configuring templatesAvailable email templatesauth.email.template.inviteauth.email.template.confirmationauth.email.template.recoveryauth.email.template.magic_linkauth.email.template.email_changeauth.email.template.reauthenticationTemplate variablesConfirmationURLTokenTokenHashSiteURLEmailNewEmailDeploying email templates
Need some help?
Contact support
Latest product updates?
See Changelog
Something's not right?
Check system status

© Supabase Inc—ContributingAuthor StyleguideOpen SourceSupaSquadPrivacy Settings
GitHub
Twitter
Discord

Testing Overview

Testing is a critical part of database development, especially when working with features like Row Level Security (RLS) policies. This guide provides a comprehensive approach to testing your Supabase database.
Testing approaches#
Database unit testing with pgTAP#
pgTAP is a unit testing framework for Postgres that allows testing:
Database structure: tables, columns, constraints
Row Level Security (RLS) policies
Functions and procedures
Data integrity
This example demonstrates setting up and testing RLS policies for a simple todo application:
Create a test table with RLS enabled:
-- Create a simple todos table
create table todos (
id uuid primary key default gen_random_uuid(),
task text not null,
user_id uuid references auth.users not null,
completed boolean default false
);
-- Enable RLS
alter table todos enable row level security;
-- Create a policy
create policy "Users can only access their own todos"
on todos for all -- this policy applies to all operations
to authenticated
using ((select auth.uid()) = user_id);
Set up your testing environment:
# Create a new test for our policies using supabase cli
supabase test new todos_rls.test
Write your RLS tests:
begin;
-- install tests utilities
-- install pgtap extension for testing
create extension if not exists pgtap with schema extensions;
-- Start declare we'll have 4 test cases in our test suite
select plan(4);
-- Setup our testing data
-- Set up auth.users entries
insert into auth.users (id, email) values
	('123e4567-e89b-12d3-a456-426614174000', 'user1@test.com'),
	('987fcdeb-51a2-43d7-9012-345678901234', 'user2@test.com');
-- Create test todos
insert into public.todos (task, user_id) values
	('User 1 Task 1', '123e4567-e89b-12d3-a456-426614174000'),
	('User 1 Task 2', '123e4567-e89b-12d3-a456-426614174000'),
	('User 2 Task 1', '987fcdeb-51a2-43d7-9012-345678901234');
-- as User 1
set local role authenticated;
set local request.jwt.claim.sub = '123e4567-e89b-12d3-a456-426614174000';
-- Test 1: User 1 should only see their own todos
select results_eq(
	'select count(*) from todos',
	ARRAY[2::bigint],
	'User 1 should only see their 2 todos'
);
-- Test 2: User 1 can create their own todo
select lives_ok(
	$$insert into todos (task, user_id) values ('New Task', '123e4567-e89b-12d3-a456-426614174000'::uuid)$$,
	'User 1 can create their own todo'
);
-- as User 2
set local request.jwt.claim.sub = '987fcdeb-51a2-43d7-9012-345678901234';
-- Test 3: User 2 should only see their own todos
select results_eq(
	'select count(*) from todos',
	ARRAY[1::bigint],
	'User 2 should only see their 1 todo'
);
-- Test 4: User 2 cannot modify User 1's todo
SELECT results_ne(
	$$ update todos set task = 'Hacked!' where user_id = '123e4567-e89b-12d3-a456-426614174000'::uuid returning 1 $$,
	$$ values(1) $$,
	'User 2 cannot modify User 1 todos'
);
select * from finish();
rollback;
Run the tests:
supabase test db
psql:todos_rls.test.sql:4: NOTICE:  extension "pgtap" already exists, skipping
./todos_rls.test.sql .. ok
All tests successful.
Files=1, Tests=6,  0 wallclock secs ( 0.01 usr +  0.00 sys =  0.01 CPU)
Result: PASS
Application-Level testing#
Testing through application code provides end-to-end verification. Unlike database-level testing with pgTAP, application-level tests cannot use transactions for isolation.
Application-level tests should not rely on a clean database state, as resetting the database before each test can be slow and makes tests difficult to parallelize.
Instead, design your tests to be independent by using unique user IDs for each test case.
Here's an example using TypeScript that mirrors the pgTAP tests above:
import { createClient } from '@supabase/supabase-js'
import { beforeAll, describe, expect, it } from 'vitest'
import crypto from 'crypto'
describe('Todos RLS', () => {
 // Generate unique IDs for this test suite to avoid conflicts with other tests
 const USER_1_ID = crypto.randomUUID()
 const USER_2_ID = crypto.randomUUID()
 const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
 beforeAll(async () => {
   // Setup test data specific to this test suite
   const adminSupabase = createClient(process.env.SUPABASE_URL!, process.env.SERVICE_ROLE_KEY!)
   // Create test users with unique IDs
   await adminSupabase.auth.admin.createUser({
     id: USER_1_ID,
     email: `user1-${USER_1_ID}@test.com`,
     password: 'password123',
     // We want the user to be usable right away without email confirmation
     email_confirm: true,
   })
   await adminSupabase.auth.admin.createUser({
     id: USER_2_ID,
     email: `user2-${USER_2_ID}@test.com`,
     password: 'password123',
     email_confirm: true,
   })
   // Create initial todos
   await adminSupabase.from('todos').insert([
     { task: 'User 1 Task 1', user_id: USER_1_ID },
     { task: 'User 1 Task 2', user_id: USER_1_ID },
     { task: 'User 2 Task 1', user_id: USER_2_ID },
   ])
 })
 it('should allow User 1 to only see their own todos', async () => {
   // Sign in as User 1
   await supabase.auth.signInWithPassword({
     email: `user1-${USER_1_ID}@test.com`,
     password: 'password123',
   })
   const { data: todos } = await supabase.from('todos').select('*')
   expect(todos).toHaveLength(2)
   todos?.forEach((todo) => {
     expect(todo.user_id).toBe(USER_1_ID)
   })
 })
 it('should allow User 1 to create their own todo', async () => {
   await supabase.auth.signInWithPassword({
     email: `user1-${USER_1_ID}@test.com`,
     password: 'password123',
   })
   const { error } = await supabase.from('todos').insert({ task: 'New Task', user_id: USER_1_ID })
   expect(error).toBeNull()
 })
 it('should allow User 2 to only see their own todos', async () => {
   // Sign in as User 2
   await supabase.auth.signInWithPassword({
     email: `user2-${USER_2_ID}@test.com`,
     password: 'password123',
   })
   const { data: todos } = await supabase.from('todos').select('*')
   expect(todos).toHaveLength(1)
   todos?.forEach((todo) => {
     expect(todo.user_id).toBe(USER_2_ID)
   })
 })
 it('should prevent User 2 from modifying User 1 todos', async () => {
   await supabase.auth.signInWithPassword({
     email: `user2-${USER_2_ID}@test.com`,
     password: 'password123',
   })
   // Attempt to update the todos we shouldn't have access to
   // result will be a no-op
   await supabase.from('todos').update({ task: 'Hacked!' }).eq('user_id', USER_1_ID)
   // Log back in as User 1 to verify their todos weren't changed
   await supabase.auth.signInWithPassword({
     email: `user1-${USER_1_ID}@test.com`,
     password: 'password123',
   })
   // Fetch User 1's todos
   const { data: todos } = await supabase.from('todos').select('*')
   // Verify that none of the todos were changed to "Hacked!"
   expect(todos).toBeDefined()
   todos?.forEach((todo) => {
     expect(todo.task).not.toBe('Hacked!')
   })
 })
})
Test isolation strategies#
For application-level testing, consider these approaches for test isolation:
Unique Identifiers: Generate unique IDs for each test suite to prevent data conflicts
Cleanup After Tests: If necessary, clean up created data in an afterAll or afterEach hook
Isolated Data Sets: Use prefixes or namespaces in data to separate test cases
Continuous integration testing#
Set up automated database testing in your CI pipeline:
Create a GitHub Actions workflow .github/workflows/db-tests.yml:
name: Database Tests
on:
 push:
   branches: [main]
 pull_request:
   branches: [main]
jobs:
 test:
   runs-on: ubuntu-latest
   steps:
     - uses: actions/checkout@v4
     - name: Setup Supabase CLI
       uses: supabase/setup-cli@v1
     - name: Start Supabase
       run: supabase start
     - name: Run Tests
       run: supabase test db
Best practices#
Test Data Setup
Use begin and rollback to ensure test isolation
Create realistic test data that covers edge cases
Use different user roles and permissions in tests
RLS Policy Testing
Test Create, Read, Update, Delete operations
Test with different user roles: anonymous and authenticated
Test edge cases and potential security bypasses
Always test negative cases: what users should not be able to do
CI/CD Integration
Run tests automatically on every pull request
Include database tests in deployment pipeline
Keep test runs fast using transactions
Real-World examples#
For more complex, real-world examples of database testing, check out:
Database Tests Example Repository - A production-grade example of testing RLS policies
RLS Guide and Best Practices
Troubleshooting#
Common issues and solutions:
Test Failures Due to RLS
Ensure you've set the correct role set local role authenticated;
Verify JWT claims are set set local "request.jwt.claims"
Check policy definitions match your test assumptions
CI Pipeline Issues
Verify Supabase CLI is properly installed
Ensure database migrations are run before tests
Check for proper test isolation using transactions
Additional resources#
pgTAP Documentation
Supabase CLI Reference
pgTAP Supabase reference
Database testing reference
Edit this page on GitHub
Is this helpful?
No
Yes
On this page
Testing approachesDatabase unit testing with pgTAPApplication-Level testingContinuous integration testingBest practicesReal-World examplesTroubleshootingAdditional resources
Need some help?
Contact support
Latest product updates?
See Changelog
Something's not right?
Check system status

© Supabase Inc—ContributingAuthor StyleguideOpen SourceSupaSquadPrivacy Settings
GitHub
Twitter
Discord

Advanced pgTAP Testing

While basic pgTAP provides excellent testing capabilities, you can enhance the testing workflow using database development tools and helper packages. This guide covers advanced testing techniques using database.dev and community-maintained test helpers.
Using database.dev#
Database.dev is a package manager for Postgres that allows installation and use of community-maintained packages, including testing utilities.
Setting up dbdev#
To use database development tools and packages, install some prerequisites:
create extension if not exists http with schema extensions;
create extension if not exists pg_tle;
drop extension if exists "supabase-dbdev";
select pgtle.uninstall_extension_if_exists('supabase-dbdev');
select
   pgtle.install_extension(
       'supabase-dbdev',
       resp.contents ->> 'version',
       'PostgreSQL package manager',
       resp.contents ->> 'sql'
   )
from http(
   (
       'GET',
       'https://api.database.dev/rest/v1/'
       || 'package_versions?select=sql,version'
       || '&package_name=eq.supabase-dbdev'
       || '&order=version.desc'
       || '&limit=1',
       array[
           ('apiKey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdXB0cHBsZnZpaWZyYndtbXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAxMDczNzIsImV4cCI6MTk5NTY4MzM3Mn0.z2CN0mvO2No8wSi46Gw59DFGCTJrzM0AQKsu_5k134s')::http_header
       ],
       null,
       null
   )
) x,
lateral (
   select
       ((row_to_json(x) -> 'content') #>> '{}')::json -> 0
) resp(contents);
create extension "supabase-dbdev";
select dbdev.install('supabase-dbdev');
-- Drop and recreate the extension to ensure a clean installation
drop extension if exists "supabase-dbdev";
create extension "supabase-dbdev";
Installing test helpers#
The Test Helpers package provides utilities that simplify testing Supabase-specific features:
select dbdev.install('basejump-supabase_test_helpers');
create extension if not exists "basejump-supabase_test_helpers" version '0.0.6';
Test helper benefits#
The test helpers package provides several advantages over writing raw pgTAP tests:
Simplified User Management
Create test users with tests.create_supabase_user()
Switch contexts with tests.authenticate_as()
Retrieve user IDs using tests.get_supabase_uid()
Row Level Security (RLS) Testing Utilities
Verify RLS status with tests.rls_enabled()
Test policy enforcement
Simulate different user contexts
Reduced Boilerplate
No need to manually insert auth.users
Simplified JWT claim management
Clean test setup and cleanup
Schema-wide Row Level Security testing#
When working with Row Level Security, it's crucial to ensure that RLS is enabled on all tables that need it. Create a simple test to verify RLS is enabled across an entire schema:
begin;
select plan(1);
-- Verify RLS is enabled on all tables in the public schema
select tests.rls_enabled('public');
select * from finish();
rollback;
Test file organization#
When working with multiple test files that share common setup requirements, it's beneficial to create a single "pre-test" file that handles the global environment setup. This approach reduces duplication and ensures consistent test environments.
Creating a pre-test hook#
Since pgTAP test files are executed in alphabetical order, create a setup file that runs first by using a naming convention like 000-setup-tests-hooks.sql:
supabase test new 000-setup-tests-hooks
This setup file should contain:
All shared extensions and dependencies
Common test utilities
A simple always green test to verify the setup
Here's an example setup file:
-- install tests utilities
-- install pgtap extension for testing
create extension if not exists pgtap with schema extensions;
/*
---------------------
---- install dbdev ----
----------------------
Requires:
 - pg_tle: https://github.com/aws/pg_tle
 - pgsql-http: https://github.com/pramsey/pgsql-http
*/
create extension if not exists http with schema extensions;
create extension if not exists pg_tle;
drop extension if exists "supabase-dbdev";
select pgtle.uninstall_extension_if_exists('supabase-dbdev');
select
   pgtle.install_extension(
       'supabase-dbdev',
       resp.contents ->> 'version',
       'PostgreSQL package manager',
       resp.contents ->> 'sql'
   )
from http(
   (
       'GET',
       'https://api.database.dev/rest/v1/'
       || 'package_versions?select=sql,version'
       || '&package_name=eq.supabase-dbdev'
       || '&order=version.desc'
       || '&limit=1',
       array[
           ('apiKey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdXB0cHBsZnZpaWZyYndtbXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAxMDczNzIsImV4cCI6MTk5NTY4MzM3Mn0.z2CN0mvO2No8wSi46Gw59DFGCTJrzM0AQKsu_5k134s')::http_header
       ],
       null,
       null
   )
) x,
lateral (
   select
       ((row_to_json(x) -> 'content') #>> '{}')::json -> 0
) resp(contents);
create extension "supabase-dbdev";
select dbdev.install('supabase-dbdev');
drop extension if exists "supabase-dbdev";
create extension "supabase-dbdev";
-- Install test helpers
select dbdev.install('basejump-supabase_test_helpers');
create extension if not exists "basejump-supabase_test_helpers" version '0.0.6';
-- Verify setup with a no-op test
begin;
select plan(1);
select ok(true, 'Pre-test hook completed successfully');
select * from finish();
rollback;
Benefits#
This approach provides several advantages:
Reduces code duplication across test files
Ensures consistent test environment setup
Makes it easier to maintain and update shared dependencies
Provides immediate feedback if the setup process fails
Your subsequent test files (001-auth-tests.sql, 002-rls-tests.sql) can focus solely on their specific test cases, knowing that the environment is properly configured.
Example: Advanced RLS testing#
Here's a complete example using test helpers to verify RLS policies putting it all together:
begin;
-- Assuming 000-setup-tests-hooks.sql file is present to use tests helpers
select plan(4);
-- Set up test data
-- Create test supabase users
select tests.create_supabase_user('user1@test.com');
select tests.create_supabase_user('user2@test.com');
-- Create test data
insert into public.todos (task, user_id) values
 ('User 1 Task 1', tests.get_supabase_uid('user1@test.com')),
 ('User 1 Task 2', tests.get_supabase_uid('user1@test.com')),
 ('User 2 Task 1', tests.get_supabase_uid('user2@test.com'));
-- Test as User 1
select tests.authenticate_as('user1@test.com');
-- Test 1: User 1 should only see their own todos
select results_eq(
 'select count(*) from todos',
 ARRAY[2::bigint],
 'User 1 should only see their 2 todos'
);
-- Test 2: User 1 can create their own todo
select lives_ok(
 $$insert into todos (task, user_id) values ('New Task', tests.get_supabase_uid('user1@test.com'))$$,
 'User 1 can create their own todo'
);
-- Test as User 2
select tests.authenticate_as('user2@test.com');
-- Test 3: User 2 should only see their own todos
select results_eq(
 'select count(*) from todos',
 ARRAY[1::bigint],
 'User 2 should only see their 1 todo'
);
-- Test 4: User 2 cannot modify User 1's todo
SELECT results_ne(
   $$ update todos set task = 'Hacked!' where user_id = tests.get_supabase_uid('user1@test.com') returning 1 $$,
   $$ values(1) $$,
   'User 2 cannot modify User 1 todos'
);
select * from finish();
rollback;
Not another todo app: Testing complex organizations#
Todo apps are great for learning, but this section explores testing a more realistic scenario: a multi-tenant content publishing platform. This example demonstrates testing complex permissions, plan restrictions, and content management.
System overview#
This demo app implements:
Organizations with tiered plans (free/pro/enterprise)
Role-based access (owner/admin/editor/viewer)
Content management (posts/comments)
Premium content restrictions
Plan-based limitations
What makes this complex?#
Layered Permissions
Role hierarchies affect access rights
Plan types influence user capabilities
Content state (draft/published) affects permissions
Business Rules
Free plan post limits
Premium content visibility
Cross-organization security
Testing focus areas#
When writing tests, verify:
Organization member access control
Content visibility across roles
Plan limitation enforcement
Cross-organization data isolation
1. App schema definitions#
The app schema tables are defined like this:
create table public.profiles (
 id uuid references auth.users(id) primary key,
 username text unique not null,
 full_name text,
 bio text,
 created_at timestamptz default now(),
 updated_at timestamptz default now()
);
create table public.organizations (
 id bigint primary key generated always as identity,
 name text not null,
 slug text unique not null,
 plan_type text not null check (plan_type in ('free', 'pro', 'enterprise')),
 max_posts int not null default 5,
 created_at timestamptz default now()
);
create table public.org_members (
 org_id bigint references public.organizations(id) on delete cascade,
 user_id uuid references auth.users(id) on delete cascade,
 role text not null check (role in ('owner', 'admin', 'editor', 'viewer')),
 created_at timestamptz default now(),
 primary key (org_id, user_id)
);
create table public.posts (
 id bigint primary key generated always as identity,
 title text not null,
 content text not null,
 author_id uuid references public.profiles(id) not null,
 org_id bigint references public.organizations(id),
 status text not null check (status in ('draft', 'published', 'archived')),
 is_premium boolean default false,
 scheduled_for timestamptz,
 category text,
 view_count int default 0,
 published_at timestamptz,
 created_at timestamptz default now(),
 updated_at timestamptz default now()
);
create table public.comments (
 id bigint primary key generated always as identity,
 post_id bigint references public.posts(id) on delete cascade,
 author_id uuid references public.profiles(id),
 content text not null,
 is_deleted boolean default false,
 created_at timestamptz default now(),
 updated_at timestamptz default now()
);
2. RLS policies declaration#
Now to setup the RLS policies for each tables:
-- Create a private schema to store all security definer functions utils
-- As such functions should never be in a API exposed schema
create schema if not exists private;
-- Helper function for role checks
create or replace function private.get_user_org_role(org_id bigint, user_id uuid)
returns text
set search_path = ''
as $$
 select role from public.org_members
 where org_id = $1 and user_id = $2;
-- Note the use of security definer to avoid RLS checking recursion issue
-- see: https://supabase.com/docs/guides/database/postgres/row-level-security#use-security-definer-functions
$$ language sql security definer;
-- Helper utils to check if an org is below the max post limit
create or replace function private.can_add_post(org_id bigint)
returns boolean
set search_path = ''
as $$
 select (select count(*)
         from public.posts p
         where p.org_id = $1) < o.max_posts
 from public.organizations o
 where o.id = $1
$$ language sql security definer;
-- Enable RLS for all tables
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.org_members enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
-- Profiles policies
create policy "Public profiles are viewable by everyone"
 on public.profiles for select using (true);
create policy "Users can insert their own profile"
 on public.profiles for insert with check ((select auth.uid()) = id);
create policy "Users can update their own profile"
 on public.profiles for update using ((select auth.uid()) = id)
 with check ((select auth.uid()) = id);
-- Organizations policies
create policy "Public org info visible to all"
 on public.organizations for select using (true);
create policy "Org management restricted to owners"
 on public.organizations for all using (
   private.get_user_org_role(id, (select auth.uid())) = 'owner'
 );
-- Org Members policies
create policy "Members visible to org members"
 on public.org_members for select using (
   private.get_user_org_role(org_id, (select auth.uid())) is not null
 );
create policy "Member management restricted to admins and owners"
 on public.org_members for all using (
   private.get_user_org_role(org_id, (select auth.uid())) in ('owner', 'admin')
 );
-- Posts policies
create policy "Complex post visibility"
 on public.posts for select using (
   -- Published non-premium posts are visible to all
   (status = 'published' and not is_premium)
   or
   -- Premium posts visible to org members only
   (status = 'published' and is_premium and
   private.get_user_org_role(org_id, (select auth.uid())) is not null)
   or
   -- All posts visible to editors and above
   private.get_user_org_role(org_id, (select auth.uid())) in ('owner', 'admin', 'editor')
 );
create policy "Post creation rules"
 on public.posts for insert with check (
   -- Must be org member with appropriate role
   private.get_user_org_role(org_id, (select auth.uid())) in ('owner', 'admin', 'editor')
   and
   -- Check org post limits for free plans
   (
     (select o.plan_type != 'free'
     from organizations o
     where o.id = org_id)
     or
     (select private.can_add_post(org_id))
   )
 );
create policy "Post update rules"
 on public.posts for update using (
   exists (
     select 1
     where
       -- Editors can update non-published posts
       (private.get_user_org_role(org_id, (select auth.uid())) = 'editor' and status != 'published')
       or
       -- Admins and owners can update any post
       private.get_user_org_role(org_id, (select auth.uid())) in ('owner', 'admin')
   )
 );
-- Comments policies
create policy "Comments on published posts are viewable by everyone"
 on public.comments for select using (
   exists (
     select 1 from public.posts
     where id = post_id
     and status = 'published'
   )
   and not is_deleted
 );
create policy "Authenticated users can create comments"
 on public.comments for insert with check ((select auth.uid()) = author_id);
create policy "Users can update their own comments"
 on public.comments for update using (author_id = (select auth.uid()));
3. Test cases:#
Now everything is setup, let's write RLS test cases, note that each section could be in its own test:
-- Assuming we already have: 000-setup-tests-hooks.sql file we can use tests helpers
begin;
-- Declare total number of tests
select plan(10);
-- Create test users
select tests.create_supabase_user('org_owner', 'owner@test.com');
select tests.create_supabase_user('org_admin', 'admin@test.com');
select tests.create_supabase_user('org_editor', 'editor@test.com');
select tests.create_supabase_user('premium_user', 'premium@test.com');
select tests.create_supabase_user('free_user', 'free@test.com');
select tests.create_supabase_user('scheduler', 'scheduler@test.com');
select tests.create_supabase_user('free_author', 'free_author@test.com');
-- Create profiles for test users
insert into profiles (id, username, full_name)
values
 (tests.get_supabase_uid('org_owner'), 'org_owner', 'Organization Owner'),
 (tests.get_supabase_uid('org_admin'), 'org_admin', 'Organization Admin'),
 (tests.get_supabase_uid('org_editor'), 'org_editor', 'Organization Editor'),
 (tests.get_supabase_uid('premium_user'), 'premium_user', 'Premium User'),
 (tests.get_supabase_uid('free_user'), 'free_user', 'Free User'),
 (tests.get_supabase_uid('scheduler'), 'scheduler', 'Scheduler User'),
 (tests.get_supabase_uid('free_author'), 'free_author', 'Free Author');
-- First authenticate as service role to bypass RLS for initial setup
select tests.authenticate_as_service_role();
-- Create test organizations and setup data
with new_org as (
 insert into organizations (name, slug, plan_type, max_posts)
 values
   ('Test Org', 'test-org', 'pro', 100),
   ('Premium Org', 'premium-org', 'enterprise', 1000),
   ('Schedule Org', 'schedule-org', 'pro', 100),
   ('Free Org', 'free-org', 'free', 2)
 returning id, slug
),
-- Setup members and posts
member_setup as (
 insert into org_members (org_id, user_id, role)
 select
   org.id,
   user_id,
   role
 from new_org org cross join (
   values
     (tests.get_supabase_uid('org_owner'), 'owner'),
     (tests.get_supabase_uid('org_admin'), 'admin'),
     (tests.get_supabase_uid('org_editor'), 'editor'),
     (tests.get_supabase_uid('premium_user'), 'viewer'),
     (tests.get_supabase_uid('scheduler'), 'editor'),
     (tests.get_supabase_uid('free_author'), 'editor')
 ) as members(user_id, role)
 where org.slug = 'test-org'
    or (org.slug = 'premium-org' and role = 'viewer')
    or (org.slug = 'schedule-org' and role = 'editor')
    or (org.slug = 'free-org' and role = 'editor')
)
-- Setup initial posts
insert into posts (title, content, org_id, author_id, status, is_premium, scheduled_for)
select
 title,
 content,
 org.id,
 author_id,
 status,
 is_premium,
 scheduled_for
from new_org org cross join (
 values
   ('Premium Post', 'Premium content', tests.get_supabase_uid('premium_user'), 'published', true, null),
   ('Free Post', 'Free content', tests.get_supabase_uid('premium_user'), 'published', false, null),
   ('Future Post', 'Future content', tests.get_supabase_uid('scheduler'), 'published', false, '2024-01-02 12:00:00+00'::timestamptz)
) as posts(title, content, author_id, status, is_premium, scheduled_for)
where org.slug in ('premium-org', 'schedule-org');
-- Test owner privileges
select tests.authenticate_as('org_owner');
select lives_ok(
 $$
   update organizations
   set name = 'Updated Org'
   where id = (select id from organizations limit 1)
 $$,
 'Owner can update organization'
);
-- Test admin privileges
select tests.authenticate_as('org_admin');
select results_eq(
   $$select count(*) from org_members$$,
   ARRAY[6::bigint],
   'Admin can view all members'
);
-- Test editor restrictions
select tests.authenticate_as('org_editor');
select throws_ok(
 $$
   insert into org_members (org_id, user_id, role)
   values (
     (select id from organizations limit 1),
     (select tests.get_supabase_uid('org_editor')),
     'viewer'
   )
 $$,
 '42501',
 'new row violates row-level security policy for table "org_members"',
 'Editor cannot manage members'
);
-- Premium Content Access Tests
select tests.authenticate_as('premium_user');
select results_eq(
   $$select count(*) from posts where org_id = (select id from organizations where slug = 'premium-org')$$,
   ARRAY[3::bigint],
   'Premium user can see all posts'
);
select tests.clear_authentication();
select results_eq(
   $$select count(*) from posts where org_id = (select id from organizations where slug = 'premium-org')$$,
   ARRAY[2::bigint],
   'Anonymous users can only see free posts'
);
-- Time-Based Publishing Tests
select tests.authenticate_as('scheduler');
select tests.freeze_time('2024-01-01 12:00:00+00'::timestamptz);
select results_eq(
   $$select count(*) from posts where scheduled_for > now() and org_id = (select id from organizations where slug = 'schedule-org')$$,
   ARRAY[1::bigint],
   'Can see scheduled posts'
);
select tests.freeze_time('2024-01-02 13:00:00+00'::timestamptz);
select results_eq(
   $$select count(*) from posts where scheduled_for < now() and org_id = (select id from organizations where slug = 'schedule-org')$$,
   ARRAY[1::bigint],
   'Can see posts after schedule time'
);
select tests.unfreeze_time();
-- Plan Limit Tests
select tests.authenticate_as('free_author');
select lives_ok(
 $$
   insert into posts (title, content, org_id, author_id, status)
   select 'Post 1', 'Content 1', id, auth.uid(), 'draft'
   from organizations where slug = 'free-org' limit 1
 $$,
 'First post creates successfully'
);
select lives_ok(
 $$
   insert into posts (title, content, org_id, author_id, status)
   select 'Post 2', 'Content 2', id, auth.uid(), 'draft'
   from organizations where slug = 'free-org' limit 1
 $$,
 'Second post creates successfully'
);
select throws_ok(
 $$
   insert into posts (title, content, org_id, author_id, status)
   select 'Post 3', 'Content 3', id, auth.uid(), 'draft'
   from organizations where slug = 'free-org' limit 1
 $$,
 '42501',
 'new row violates row-level security policy for table "posts"',
 'Cannot exceed free plan post limit'
);
select * from finish();
rollback;
Additional resources#
Test Helpers Documentation
Test Helpers Reference
Row Level Security Writing Guide
Database.dev Package Registry
Row Level Security Performance and Best Practices
Edit this page on GitHub
Is this helpful?
No
Yes
On this page
Using database.devSetting up dbdevInstalling test helpersTest helper benefitsSchema-wide Row Level Security testingTest file organizationCreating a pre-test hookBenefitsExample: Advanced RLS testingNot another todo app: Testing complex organizationsSystem overviewWhat makes this complex?Testing focus areasAdditional resources
Need some help?
Contact support
Latest product updates?
See Changelog
Something's not right?
Check system status

© Supabase Inc—ContributingAuthor StyleguideOpen SourceSupaSquadPrivacy Settings
GitHub
Twitter
Discord

Testing Your Database

To ensure that queries return the expected data, RLS policies are correctly applied and etc., we encourage you to write automated tests. There are essentially two approaches to testing:
Firstly, you can write tests that interface with a Supabase client instance (same way you use Supabase client in your application code) in the programming language(s) you use in your application and using your favorite testing framework.
Secondly, you can test through the Supabase CLI, which is a more low-level approach where you write tests in SQL.
Testing using the Supabase CLI
You can use the Supabase CLI to test your database. The minimum required version of the CLI is v1.11.4. To get started:
Install the Supabase CLI on your local machine
Creating a test#
Create a tests folder inside the supabase folder:
mkdir -p ./supabase/tests/database
Create a new file with the .sql extension which will contain the test.
touch ./supabase/tests/database/hello_world.test.sql
Writing tests#
All sql files use pgTAP as the test runner.
Let's write a simple test to check that our auth.users table has an ID column. Open hello_world.test.sql and add the following code:
begin;
select plan(1); -- only one statement to run
SELECT has_column(
   'auth',
   'users',
   'id',
   'id should exist'
);
select * from finish();
rollback;
Running tests#
To run the test, you can use:
supabase test db
This will produce the following output:
$ supabase test db
supabase/tests/database/hello_world.test.sql .. ok
All tests successful.
Files=1, Tests=1,  1 wallclock secs ( 0.01 usr  0.00 sys +  0.04 cusr  0.02 csys =  0.07 CPU)
Result: PASS
More resources#
Testing RLS policies
pgTAP extension
Official pgTAP documentation
Edit this page on GitHub
Is this helpful?
No
Yes
On this page
Creating a testWriting testsRunning testsMore resources
Need some help?
Contact support
Latest product updates?
See Changelog
Something's not right?
Check system status

© Supabase Inc—ContributingAuthor StyleguideOpen SourceSupaSquadPrivacy Settings
GitHub
Twitter
Discord

Customizing Postgres configs

Each Supabase project is a pre-configured Postgres cluster. You can override some configuration settings to suit your needs. This is an advanced topic, and we don't recommend touching these settings unless it is necessary.
Customizing Postgres configurations provides advanced control over your database, but inappropriate settings can lead to severe performance degradation or project instability.
Viewing settings#
To list all Postgres settings and their descriptions, run:
select * from pg_settings;
Configurable settings#
User-context settings#
The pg_settings table's context column specifies the requirements for changing a setting. By default, those with a user context can be changed at the role or database level with SQL.
To list all user-context settings, run:
select * from pg_settings where context = 'user';
As an example, the statement_timeout setting can be altered:
alter database "postgres" set "statement_timeout" TO '60s';
To verify the change, execute:
show "statement_timeout";
Superuser settings#
Some settings can only be modified by a superuser. Supabase pre-enables the supautils extension, which allows the postgres role to retain certain superuser privileges. It enables modification of the below reserved configurations at the role level:
Setting
Description
auto_explain.log_min_duration
Logs query plans taking longer than this duration.
auto_explain.log_nested_statements
Log nested statements' plans.
log_min_messages
Minimum severity level of messages to log.
pg_net.ttl
Sets how long the pg_net extension saves responses
pg_net.batch_size
Sets how many requests the pg_net extension can make per second
pgaudit.*
Configures the PGAudit extension. The log_parameter is still restricted to protect secrets
pgrst.*
PostgREST settings
plan_filter.*
Configures the pg_plan_filter extension
session_replication_role
Sets the session's behavior for triggers and rewrite rules.
track_io_timing
Collects timing statistics for database I/O activity.

For example, to enable log_nested_statements for the postgres role, execute:
alter role "postgres" set "auto_explain.log_nested_statements" to 'on';
To view the change:
select
 rolname,
 rolconfig
from pg_roles
where rolname = 'postgres';
CLI configurable settings#
While many Postgres parameters are configurable directly, some configurations can be changed with the Supabase CLI at the system level.
CLI changes permanently overwrite default settings, so reset all and set to default commands won't revert to the original values.
In order to overwrite the default settings, you must have Owner or Administrator privileges within your organizations.
CLI supported parameters#
If a setting you need is not yet configurable, share your use case with us! Let us know what setting you'd like to control, and we'll consider adding support in future updates.
The following parameters are available for overrides:
effective_cache_size
logical_decoding_work_mem (CLI only)
maintenance_work_mem
max_connections (CLI only)
max_locks_per_transaction (CLI only)
max_parallel_maintenance_workers
max_parallel_workers_per_gather
max_parallel_workers
max_replication_slots (CLI only)
max_slot_wal_keep_size (CLI only)
max_standby_archive_delay (CLI only)
max_standby_streaming_delay (CLI only)
max_wal_size (CLI only)
max_wal_senders (CLI only)
max_worker_processes (CLI only)
session_replication_role
shared_buffers (CLI only)
statement_timeout
track_activity_query_size
track_commit_timestamp
wal_keep_size (CLI only)
wal_sender_timeout (CLI only)
work_mem
Managing Postgres configuration with the CLI#
To start:
Install Supabase CLI 1.69.0+.
Log in to your Supabase account using the CLI.
To update Postgres configurations, use the postgres config command:
supabase --experimental \
--project-ref <project-ref> \
postgres-config update --config shared_buffers=250MB
By default, the CLI will merge any provided config overrides with any existing ones. The --replace-existing-overrides flag can be used to instead force all existing overrides to be replaced with the ones being provided:
supabase --experimental \
--project-ref <project-ref> \
postgres-config update --config max_parallel_workers=3 \
--replace-existing-overrides
To delete specific configuration overrides, use the postgres-config delete command:
supabase --experimental \
--project-ref <project-ref> \
postgres-config delete --config shared_buffers,work_mem
By default, changing the configuration, whether by updating or deleting, causes the database and all associated read replicas to restart. You can use the --no-restart flag to prevent this behavior, and attempt to reload the updated configuration without a restart. Refer to the Postgres documentation to determine if a given parameter can be reloaded without a restart.
Read Replicas and Custom Config
Postgres requires several parameters to be synchronized between the Primary cluster and Read Replicas.
By default, Supabase ensures that this propagation is executed correctly. However, if the --no-restart behavior is used in conjunction with parameters that cannot be reloaded without a restart, the user is responsible for ensuring that both the primaries and the read replicas get restarted in a timely manner to ensure a stable running state. Leaving the configuration updated, but not utilized (via a restart) in such a case can result in read replica failure if the primary, or a read replica, restarts in isolation (e.g. due to an out-of-memory event, or hardware failure).
supabase --experimental \
--project-ref <project-ref> \
postgres-config delete --config shared_buffers --no-restart
Resetting to default config#
To reset a setting to its default value at the database level:
-- reset a single setting at the database level
alter database "postgres" set "<setting_name>" to default;
-- reset all settings at the database level
alter database "postgres" reset all;
For role level configurations, you can run:
alter role "<role_name>" set "<setting_name>" to default;
Considerations#
Changes through the CLI might restart the database causing momentary disruption to existing database connections; in most cases this should not take more than a few seconds. However, you can use the --no-restart flag to bypass the restart and keep the connections intact. Keep in mind that this depends on the specific configuration changes you're making. if the change requires a restart, using the --no-restart flag will prevent the restart but you won't see those changes take effect until a restart is manually triggered. Additionally, some parameters are required to be the same on Primary and Read Replicas; not restarting in these cases can result in read replica failure if the Primary/Read Replicas restart in isolation.
Custom Postgres Config will always override the default optimizations generated by Supabase. When changing compute add-ons, you should also review and update your custom Postgres Config to ensure they remain compatible and effective with the updated compute.
Some parameters (e.g. wal_keep_size) can increase disk utilization, triggering disk expansion, which in turn can lead to increases in your bill.

