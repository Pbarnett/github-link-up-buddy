Supabase Security

Supabase is a hosted platform which makes it very simple to get started without needing to manage any infrastructure. The hosted platform comes with many security and compliance controls managed by Supabase.
Compliance
Supabase is SOC 2 Type 2 compliant and regularly audited. All projects at Supabase are governed by the same set of compliance controls.
The SOC 2 Compliance Guide explains Supabase's SOC 2 responsibilities and controls in more detail.
The HIPAA Compliance Guide explains Supabase's HIPAA responsibilities. Additional security and compliance controls for projects that deal with electronic Protected Health Information (ePHI) and require HIPAA compliance are available through the HIPAA add-on.
Platform configuration
Each product offered by Supabase comes with customizable security controls and these security controls help ensure that applications built on Supabase are secure, compliant, and resilient against various threats.
The security configuration guides provide detailed information for configuring individual products.

Secure configuration of Supabase products

The Supabase production checklist provides detailed advice on preparing an app for production. While our SOC 2 and HIPAA compliance documents outline the roles and responsibilities for building a secure and compliant app.
Various products at Supabase have their own hardening and configuration guides, below is a definitive list of these to help guide your way.
Auth#
Password security
Rate limits
Bot detection / Prevention
JWTs
Database#
Row Level Security
Column Level Security
Hardening the Data API
Additional security controls for the Data API
Custom claims and role based access control
Managing Postgres roles
Managing secrets with Vault
Superuser access and unsupported operations
Storage#
Object ownership
Access control
The Storage API docs contain hints about required RLS policy permissions
Custom roles with the storage schema
Realtime#
Authorization
Security testing of your Supabase projects

Supabase customer support policy for penetration testing
Customers of Supabase are permitted to carry out security assessments or penetration tests of their hosted Supabase project components. This testing may be carried out without prior approval for the customer services listed under permitted services. Supabase does not permit hosting security tooling that may be perceived as malicious or part of a campaign against Supabase customers or external services. This section is covered by the Supabase Acceptable Use Policy (AUP).
It is the customer’s responsibility to ensure that testing activities are aligned with this policy. Any testing performed outside of the policy will be seen as testing directly against Supabase and may be flagged as abuse behaviour. If Supabase receives an abuse report for activities related to your security testing, we will forward these to you. If you discover a security issue within any of the Supabase products, contact Supabase Security immediately.
Furthermore, Supabase runs a Vulnerability Disclosure Program (VDP) with HackerOne, and external security researchers may report any bugs found within the scope of the aforementioned program. Customer penetration testing does not form part of this VDP.
Permitted services#
Authentication
Database
Edge Functions
Storage
Realtime
https://<customer_project_ref>.supabase.co/*
https://db.<customer_project_ref>.supabase.co/*
Prohibited testing and activities#
Any activity contrary to what is listed in the AUP.
Denial of Service (DoS) and Distributed Denial of Service (DDoS) testing.
Cross-tenant attacks, testing that directly targets other Supabase customers' accounts, organizations, and projects not under the customer’s control.
Request flooding.
Terms and conditions#
The customer agrees to the following,
Security testing:
Will be limited to the services within the customer’s project.
Is subject to the general Terms of Service.
Is within the Acceptable Usage Policy.
Will be stopped if contacted by Supabase due to a breach of the above or a negative impact on Supabase and Supabase customers.
Any vulnerabilities discovered directly in a Supabase product will be reported to Supabase Security within 24 hours of completion of testing.


Production Checklist

After developing your project and deciding it's Production Ready, you should run through this checklist to ensure that your project:
is secure
won't falter under the expected load
remains available whilst in production
Security#
Ensure RLS is enabled
Tables that do not have RLS enabled with reasonable policies allow any client to access and modify their data. This is unlikely to be what you want in the majority of cases.
Learn more about RLS.
Enable replication on tables containing sensitive data by enabling Row Level Security (RLS) and setting row security policies:
Go to the Authentication > Policies page in the Supabase Dashboard to enable RLS and create security policies.
Go to the Database > Publications page in the Supabase Dashboard to manage replication tables.
Turn on SSL Enforcement
Enable Network Restrictions for your database.
Ensure that your Supabase Account is protected with multi-factor authentication (MFA).
If using a GitHub signin, enable 2FA on GitHub. Since your GitHub account gives you administrative rights to your Supabase org, you should protect it with a strong password and 2FA using a U2F key or a TOTP app.
If using email+password signin, set up MFA for your Supabase account.
Enable MFA enforcement on your organization. This ensures all users must have a valid MFA backed session to interact with organization and project resources.
Consider adding multiple owners on your Supabase org. This ensures that if one of the owners is unreachable or loses access to their account, you still have Owner access to your org.
Ensure email confirmations are enabled in the Settings > Auth page.
Ensure that you've set the expiry for one-time passwords (OTPs) to a reasonable value that you are comfortable with. We recommend setting this to 3600 seconds (1 hour) or lower.
Increase the length of the OTP if you need a higher level of entropy.
If your application requires a higher level of security, consider setting up multi-factor authentication (MFA) for your users.
Use a custom SMTP server for auth emails so that your users can see that the mails are coming from a trusted domain (preferably the same domain that your app is hosted on). Grab SMTP credentials from any major email provider such as SendGrid, AWS SES, etc.
Think hard about how you would abuse your service as an attacker, and mitigate.
Review these common cybersecurity threats.
Check and review issues in your database using Security Advisor.
Performance#
Ensure that you have suitable indices to cater to your common query patterns
Learn more about indexes in Postgres.
pg_stat_statements can help you identify hot or slow queries.
Perform load testing (preferably on a staging env)
Tools like k6 can simulate traffic from many different users.
Upgrade your database if you require more resources. If you need anything beyond what is listed, contact enterprise@supabase.io.
If you are expecting a surge in traffic (for a big launch) and are on a Team or Enterprise Plan, contact support with more details about your launch and we'll help keep an eye on your project.
If you expect your database size to be > 4 GB, enable the Point in Time Recovery (PITR) add-on. Daily backups can take up resources from your database when the backup is in progress. PITR is more resource efficient, since only the changes to the database are backed up.
Check and review issues in your database using Performance Advisor.
Availability#
Use your own SMTP credentials so that you have full control over the deliverability of your transactional auth emails (see Settings > Auth)
you can grab SMTP credentials from any major email provider such as SendGrid, AWS SES, etc. You can refer to our SMTP guide for more details.
The default rate limit for auth emails when using a custom SMTP provider is 30 new users per hour, if doing a major public announcement you will likely require more than this.
Applications on the Free Plan that exhibit extremely low activity in a 7 day period may be paused by Supabase to save on server resources.
You can restore paused projects from the Supabase dashboard.
Upgrade to Pro to guarantee that your project will not be paused for inactivity.
Database backups are not available for download on the Free Plan.
You can set up your own backup systems using tools like pg_dump or wal-g.
Nightly backups for Pro Plan projects are available on the Supabase dashboard for up to 7 days.
Point in Time Recovery (PITR) allows a project to be backed up at much shorter intervals. This provides users an option to restore to any chosen point of up to seconds in granularity. In terms of Recovery Point Objective (RPO), Daily Backups would be suitable for projects willing to lose up to 24 hours worth of data. If a lower RPO is required, enable PITR.
Supabase Projects use disks that offer 99.8-99.9% durability by default.
Use Read Replicas if you require availability resilience to a disk failure event
Use PITR if you require durability resilience to a disk failure event
Upgrading to the Supabase Pro Plan will give you access to our support team.
Rate limiting, resource allocation, & abuse prevention#
Supabase employs a number of safeguards against bursts of incoming traffic to prevent abuse and help maximize stability across the platform
If you're on a Team or Enterprise Plan and expect high load events, such as production launches, heavy load testing, or prolonged high resource usage, open a ticket via the support form for help. Provide at least 2 weeks notice.
Auth rate limits#
The table below shows the rate limit quotas on the following authentication endpoints. You can configure the auth rate limits for your project here.
Endpoint
Path
Limited By
Rate Limit
All endpoints that send emails
/auth/v1/signup /auth/v1/recover /auth/v1/user[^1]
Sum of combined requests
As of 3 Sep 2024, this has been updated to 2 emails per hour. You can only change this with your own custom SMTP setup.
All endpoints that send One-Time-Passwords (OTP)
/auth/v1/otp
Sum of combined requests
Defaults to 360 OTPs per hour. Is customizable.
Send OTPs or magic links
/auth/v1/otp
Last request
Defaults to 60 seconds window before a new request is allowed. Is customizable.
Signup confirmation request
/auth/v1/signup
Last request
Defaults to 60 seconds window before a new request is allowed. Is customizable.
Password Reset Request
/auth/v1/recover
Last request
Defaults to 60 seconds window before a new request is allowed. Is customizable.
Verification requests
/auth/v1/verify
IP Address
360 requests per hour (with bursts up to 30 requests)
Token refresh requests
/auth/v1/token
IP Address
1800 requests per hour (with bursts up to 30 requests)
Create or Verify an MFA challenge
/auth/v1/factors/:id/challenge /auth/v1/factors/:id/verify
IP Address
15 requests per minute (with bursts up to 30 requests)
Anonymous sign-ins
/auth/v1/signup[^2]
IP Address
30 requests per hour (with bursts up to 30 requests)

Realtime quotas#
Review the Realtime quotas.
If you need quotas increased you can always contact support.
Abuse prevention#
Supabase provides CAPTCHA protection on the signup, sign-in and password reset endpoints. Refer to our guide on how to protect against abuse using this method.
Email link validity#
When working with enterprise systems, email scanners may scan and make a GET request to the reset password link or sign up link in your email. Since links in Supabase Auth are single use, a user who opens an email post-scan to click on a link will receive an error. To get around this problem,
consider altering the email template to replace the original magic link with a link to a domain you control. The domain can present the user with a "Sign-in" button which redirect the user to the original magic link URL when clicked.
When using a custom SMTP service, some services might have link tracking enabled which may overwrite or disform the email confirmation links sent by Supabase Auth. To prevent this from happening, we recommend that you disable link tracking when using a custom SMTP service.
Subscribe to Supabase status page#
Stay informed about Supabase service status by subscribing to the Status Page. We recommend setting up Slack notifications through an RSS feed to ensure your team receives timely updates about service status changes.
Setting up Slack notifications#
Install the RSS app in Slack:
Visit the RSS app page in the Slack marketplace
Click Add to Slack if not already installed
Otherwise you will get straight to next step, no need to reinstall the app
Configure the Supabase status feed:
Create a channel (e.g., #supabase-status-alerts) for status updates
On the RSS app page go to Add a Feed section and set Feed URL to https://status.supabase.com/history.rss
Select your designated channel and click "Subscribe to this feed"
Once configured, your team will receive automatic notifications in Slack whenever the Supabase Status Page is updated.
For detailed setup instructions, see the Add RSS feeds to Slack.
Next steps#
This checklist is always growing so be sure to check back frequently, and also feel free to suggest additions and amendments by making a PR on GitHub.

Hardening the Data API

Your database's auto-generated Data API exposes the public schema by default. You can change this to any schema in your database, or even disable the Data API completely.
Any tables that are accessible through the Data API must have Row Level Security enabled. Row Level Security (RLS) is enabled by default when you create tables from the Supabase Dashboard. If you create a table using the SQL editor or your own SQL client or migration runner, youmust enable RLS yourself.
Shared responsibility#
Your application's security is your responsibility as a developer. This includes RLS, falling under the Shared Responsibility model. To help you:
Supabase sends daily emails warning of any tables that are exposed to the Data API which do not have RLS enabled.
Supabase provides a Security Advisor and other tools in the Supabase Dashboard to fix any issues.
Private schemas#
We highly recommend creating a private schema for storing tables that you do not want to expose via the Data API. These tables can be accessed via Supabase Edge Functions or any other serverside tool. In this model, you should implement your security model in your serverside code. Although it's not required, we still recommend enabling RLS for private tables and then connecting to your database using a Postgres role with bypassrls privileges.
Managing the public schema#
If your public schema is used by other tools as a default space, you might want to lock down this schema. This helps prevent accidental exposure of data that's automatically added to public.
There are two levels of security hardening for the Data API:
Disabling the Data API entirely. This is recommended if you never need to access your database via Supabase client libraries or the REST and GraphQL endpoints.
Removing the public schema from the Data API and replacing it with a custom schema (such as api).
Disabling the Data API#
You can disable the Data API entirely if you never intend to use the Supabase client libraries or the REST and GraphQL data endpoints. For example, if you only access your database via a direct connection on the server, disabling the Data API gives you the greatest layer of protection.
Go to API Settings in the Supabase Dashboard.
Under Data API Settings, toggle Enable Data API off.
Exposing a custom schema instead of public#
If you want to use the Data API but with increased security, you can expose a custom schema instead of public. By not using public, which is often used as a default space and has laxer default permissions, you get more conscious control over your exposed data.
Any data, views, or functions that should be exposed need to be deliberately put within your custom schema (which we will call api), rather than ending up there by default.
Step 1: Remove public from exposed schemas#
Go to API Settings in the Supabase Dashboard.
Under Data API Settings, remove public from Exposed schemas. Also remove public from Extra search path.
Click Save.
Go to Database Extensions and disable the pg_graphql extension.
Step 2: Create an api schema and expose it#
Connect to your database. You can use psql, the Supabase SQL Editor, or the Postgres client of your choice.
Create a new schema named api:
create schema if not exists api;
Grant the anon and authenticated roles usage on this schema.
grant usage on schema api to anon, authenticated;
Go to API Settings in the Supabase Dashboard.
Under Data API Settings, add api to Exposed schemas. Make sure it is the first schema in the list, so that it will be searched first by default.
Under these new settings, anon and authenticated can execute functions defined in the api schema, but they have no automatic permissions on any tables. On a table-by-table basis, you can grant them permissions. For example:
grant select on table api.<your_table> to anon;
grant select, insert, update, delete on table api.<your_table> to authenticated;
Logging

The Supabase Platform includes a Logs Explorer that allows log tracing and debugging. Log retention is based on your project's pricing plan.
Product logs#
Supabase provides a logging interface specific to each product. You can use simple regular expressions for keywords and patterns to search log event messages. You can also export and download the log events matching your query as a spreadsheet.
API
Postgres
Auth
Storage
Realtime
Edge Functions
API logs show all network requests and response for the REST and GraphQL APIs. If Read Replicas are enabled, logs are automatically filtered between databases as well as the API Load Balancer endpoint. Logs for a specific endpoint can be toggled with the Source button on the upper-right section of the dashboard.
When viewing logs originating from the API Load Balancer endpoint, the upstream database or the one that eventually handles the request can be found under the Redirect Identifier field. This is equivalent to metadata.load_balancer_redirect_identifier when querying the underlying logs.


Working with API logs#
API logs run through the Cloudflare edge servers and will have attached Cloudflare metadata under the metadata.request.cf.* fields.
Allowed headers#
A strict list of request and response headers are permitted in the API logs. Request and response headers will still be received by the server(s) and client(s), but will not be attached to the API logs generated.
Request headers:
accept
cf-connecting-ip
cf-ipcountry
host
user-agent
x-forwarded-proto
referer
content-length
x-real-ip
x-client-info
x-forwarded-user-agent
range
prefer
Response headers:
cf-cache-status
cf-ray
content-location
content-range
content-type
content-length
date
transfer-encoding
x-kong-proxy-latency
x-kong-upstream-latency
sb-gateway-mode
sb-gateway-version
Additional request metadata#
To attach additional metadata to a request, it is recommended to use the User-Agent header for purposes such as device or version identification.
For example:
node MyApp/1.2.3 (device-id:abc123)
Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0 MyApp/1.2.3 (Foo v1.3.2; Bar v2.2.2)
Do not log Personal Identifiable Information (PII) within the User-Agent header, to avoid infringing data protection privacy laws. Overly fine-grained and detailed user agents may allow fingerprinting and identification of the end user through PII.
Logging Postgres queries#
To enable query logs for other categories of statements:
Enable the pgAudit extension.
Configure pgaudit.log (see below). Perform a fast reboot if needed.
View your query logs under Logs > Postgres Logs.
Configuring pgaudit.log#
The stored value under pgaudit.log determines the classes of statements that are logged by pgAudit extension. Refer to the pgAudit documentation for the full list of values.
To enable logging for function calls/do blocks, writes, and DDL statements for a single session, execute the following within the session:
-- temporary single-session config update
set pgaudit.log = 'function, write, ddl';
To permanently set a logging configuration (beyond a single session), execute the following, then perform a fast reboot:
-- equivalent permanent config update.
alter role postgres set pgaudit.log to 'function, write, ddl';
To help with debugging, we recommend adjusting the log scope to only relevant statements as having too wide of a scope would result in a lot of noise in your Postgres logs.
Note that in the above example, the role is set to postgres. To log user-traffic flowing through the HTTP APIs powered by PostgREST, set your configuration values for the authenticator.
-- for API-related logs
alter role authenticator set pgaudit.log to 'write';
By default, the log level will be set to log. To view other levels, run the following:
-- adjust log level
alter role postgres set pgaudit.log_level to 'info';
alter role postgres set pgaudit.log_level to 'debug5';
Note that as per the pgAudit log_level documentation, error, fatal, and panic are not allowed.
To reset system-wide settings, execute the following, then perform a fast reboot:
-- resets stored config.
alter role postgres reset pgaudit.log
If any permission errors are encountered when executing alter role postgres ..., it is likely that your project has yet to receive the patch to the latest version of supautils, which is currently being rolled out.
RAISEd log messages in Postgres#
Messages that are manually logged via RAISE INFO, RAISE NOTICE, RAISE WARNING, and RAISE LOG are shown in Postgres Logs. Note that only messages at or above your logging level are shown. Syncing of messages to Postgres Logs may take a few minutes.
If your logs aren't showing, check your logging level by running:
show log_min_messages;
Note that LOG is a higher level than WARNING and ERROR, so if your level is set to LOG, you will not see WARNING and ERROR messages.
Logging realtime connections#
Realtime doesn't log new WebSocket connections or Channel joins by default. Enable connection logging per client by including an info log_level parameter when instantiating the Supabase client.
import { createClient } from '@supabase/supabase-js'
const options = {
 realtime: {
   params: {
     log_level: 'info',
   },
 },
}
const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key', options)
Logs Explorer#
The Logs Explorer exposes logs from each part of the Supabase stack as a separate table that can be queried and joined using SQL.

You can access the following logs from the Sources drop-down:
auth_logs: GoTrue server logs, containing authentication/authorization activity.
edge_logs: Edge network logs, containing request and response metadata retrieved from Cloudflare.
function_edge_logs: Edge network logs for only edge functions, containing network requests and response metadata for each execution.
function_logs: Function internal logs, containing any console logging from within the edge function.
postgres_logs: Postgres database logs, containing statements executed by connected applications.
realtime_logs: Realtime server logs, containing client connection information.
storage_logs: Storage server logs, containing object upload and retrieval information.
Querying with the Logs Explorer#
The Logs Explorer uses BigQuery and supports all available SQL functions and operators.
Timestamp display and behavior#
Each log entry is stored with a timestamp as a TIMESTAMP data type. Use the appropriate timestamp function to utilize the timestamp field in a query.
Raw top-level timestamp values are rendered as unix microsecond. To render the timestamps in a human-readable format, use the DATETIME() function to convert the unix timestamp display into an ISO-8601 timestamp.
-- timestamp column without datetime()
select timestamp from ....
--  1664270180000
-- timestamp column with datetime()
select datetime(timestamp) from ....
-- 2022-09-27T09:17:10.439Z
Unnesting arrays#
Each log event stores metadata an array of objects with multiple levels, and can be seen by selecting single log events in the Logs Explorer. To query arrays, use unnest() on each array field and add it to the query as a join. This allows you to reference the nested objects with an alias and select their individual fields.
For example, to query the edge logs without any joins:
select timestamp, metadata from edge_logs as t;
The resulting metadata key is rendered as an array of objects in the Logs Explorer. In the following diagram, each box represents a nested array of objects:

Perform a cross join unnest() to work with the keys nested in the metadata key.
To query for a nested value, add a join for each array level:
select timestamp, request.method, header.cf_ipcountry
from
 edge_logs as t
 cross join unnest(t.metadata) as metadata
 cross join unnest(metadata.request) as request
 cross join unnest(request.headers) as header;
This surfaces the following columns available for selection:

This allows you to select the method and cf_ipcountry columns. In JS dot notation, the full paths for each selected column are:
metadata[].request[].method
metadata[].request[].headers[].cf_ipcountry
LIMIT and result row limitations#
The Logs Explorer has a maximum of 1000 rows per run. Use LIMIT to optimize your queries by reducing the number of rows returned further.
Best practices#
Include a filter over timestamp
Querying your entire log history might seem appealing. For Enterprise customers that have a large retention range, you run the risk of timeouts due additional time required to scan the larger dataset.
Avoid selecting large nested objects. Select individual values instead.
When querying large objects, the columnar storage engine selects each column associated with each nested key, resulting in a large number of columns being selected. This inadvertently impacts the query speed and may result in timeouts or memory errors, especially for projects with a lot of logs.
Instead, select only the values required.
-- ❌ Avoid doing this
select
 datetime(timestamp),
 m as metadata -- <- metadata contains many nested keys
from
 edge_logs as t
 cross join unnest(t.metadata) as m;
-- ✅ Do this
select
 datetime(timestamp),
 r.method -- <- select only the required values
from
 edge_logs as t
 cross join unnest(t.metadata) as m
 cross join unnest(m.request) as r;
Examples and templates#
The Logs Explorer includes Templates (available in the Templates tab or the dropdown in the Query tab) to help you get started.
For example, you can enter the following query in the SQL Editor to retrieve each user's IP address:
select datetime(timestamp), h.x_real_ip
from
 edge_logs
 cross join unnest(metadata) as m
 cross join unnest(m.request) as r
 cross join unnest(r.headers) as h
where h.x_real_ip is not null and r.method = "GET";
Logs field reference#
Refer to the full field reference for each available source below. Do note that in order to access each nested key, you would need to perform the necessary unnesting joins
API Gateway
Auth
Storage
Function Edge
Function Runtime
Postgres
Realtime
PostgREST
Supavisor (Shared Pooler)
PgBouncer (Dedicated Pooler)
Database Version Upgrade
Path
Type
id
string
timestamp
datetime
event_message
string
identifier
string
metadata.load_balancer_redirect_identifier
string
metadata.request.cf.asOrganization
string
metadata.request.cf.asn
number
metadata.request.cf.botManagement.corporateProxy
boolean
metadata.request.cf.botManagement.detectionIds
number[]
metadata.request.cf.botManagement.ja3Hash
string
metadata.request.cf.botManagement.score
number
metadata.request.cf.botManagement.staticResource
boolean
metadata.request.cf.botManagement.verifiedBot
boolean
metadata.request.cf.city
string
metadata.request.cf.clientTcpRtt
number
metadata.request.cf.clientTrustScore
number
metadata.request.cf.colo
string
metadata.request.cf.continent
string
metadata.request.cf.country
string
metadata.request.cf.edgeRequestKeepAliveStatus
number
metadata.request.cf.httpProtocol
string
metadata.request.cf.latitude
string
metadata.request.cf.longitude
string
metadata.request.cf.metroCode
string
metadata.request.cf.postalCode
string
metadata.request.cf.region
string
metadata.request.cf.timezone
string
metadata.request.cf.tlsCipher
string
metadata.request.cf.tlsClientAuth.certPresented
string
metadata.request.cf.tlsClientAuth.certRevoked
string
metadata.request.cf.tlsClientAuth.certVerified
string
metadata.request.cf.tlsExportedAuthenticator.clientFinished
string
metadata.request.cf.tlsExportedAuthenticator.clientHandshake
string
metadata.request.cf.tlsExportedAuthenticator.serverFinished
string
metadata.request.cf.tlsExportedAuthenticator.serverHandshake
string
metadata.request.cf.tlsVersion
string
metadata.request.headers.cf_connecting_ip
string
metadata.request.headers.cf_ipcountry
string
metadata.request.headers.cf_ray
string
metadata.request.headers.host
string
metadata.request.headers.referer
string
metadata.request.headers.x_client_info
string
metadata.request.headers.x_forwarded_proto
string
metadata.request.headers.x_real_ip
string
metadata.request.host
string
metadata.request.method
string
metadata.request.path
string
metadata.request.protocol
string
metadata.request.search
string
metadata.request.url
string
metadata.response.headers.cf_cache_status
string
metadata.response.headers.cf_ray
string
metadata.response.headers.content_location
string
metadata.response.headers.content_range
string
metadata.response.headers.content_type
string
metadata.response.headers.date
string
metadata.response.headers.sb_gateway_version
string
metadata.response.headers.transfer_encoding
string
metadata.response.headers.x_kong_proxy_latency
string
metadata.response.origin_time
number
metadata.response.status_code
number




Advanced Log Filtering

Querying the logs
Understanding field references#
The log tables are queried with a subset of BigQuery SQL syntax. They all have three columns: event_message, timestamp, and metadata.
column
description
timestamp
time event was recorded
event_message
the log's message
metadata
information about the event

The metadata column is an array of JSON objects that stores important details about each recorded event. For example, in the Postgres table, the metadata.parsed.error_severity field indicates the error level of an event. To work with its values, you need to unnest them using a cross join.
This approach is commonly used with JSON and array columns, so it might look a bit unfamiliar if you're not used to working with these data types.
select
 event_message,
 parsed.error_severity,
 parsed.user_name
from
 postgres_logs
 -- extract first layer
 cross join unnest(postgres_logs.metadata) as metadata
 -- extract second layer
 cross join unnest(metadata.parsed) as parsed;
Expanding results#
Logs returned by queries may be difficult to read in table format. A row can be double-clicked to expand the results into more readable JSON:

Filtering with regular expressions#
The Logs use BigQuery Style regular expressions with the regexp_contains function. In its most basic form, it will check if a string is present in a specified column.
select
 cast(timestamp as datetime) as timestamp,
 event_message,
 metadata
from postgres_logs
where regexp_contains(event_message, 'is present');
There are multiple operators that you should consider using:
Find messages that start with a phrase#
^ only looks for values at the start of a string
-- find only messages that start with connection
regexp_contains(event_message, '^connection')
Find messages that end with a phrase:#
$ only looks for values at the end of the string
-- find only messages that ends with port=12345
regexp_contains(event_message, '$port=12345')
Ignore case sensitivity:#
(?i) ignores capitalization for all proceeding characters
-- find all event_messages with the word "connection"
regexp_contains(event_message, '(?i)COnnecTion')
Wildcards:#
. can represent any string of characters
-- find event_messages like "hello<anything>world"
regexp_contains(event_message, 'hello.world')
Alphanumeric ranges:#
[1-9a-zA-Z] finds any strings with only numbers and letters
-- find event_messages that contain a number between 1 and 5 (inclusive)
regexp_contains(event_message, '[1-5]')
Repeated values:#
x* zero or more x
x+ one or more x
x? zero or one x
x{4,} four or more x
x{3} exactly 3 x
-- find event_messages that contains any sequence of 3 digits
regexp_contains(event_message, '[0-9]{3}')
Escaping reserved characters:#
\. interpreted as period . instead of as a wildcard
-- escapes .
regexp_contains(event_message, 'hello world\.')
or statements:#
x|y any string with x or y present
-- find event_messages that have the word 'started' followed by either the word "host" or "authenticated"
regexp_contains(event_message, 'started host|authenticated')
and/or/not statements in SQL:#
and, or, and not are all native terms in SQL and can be used in conjunction with regular expressions to filter results
select
 cast(timestamp as datetime) as timestamp,
 event_message,
 metadata
from postgres_logs
where
 (regexp_contains(event_message, 'connection') and regexp_contains(event_message, 'host'))
 or not regexp_contains(event_message, 'received');
Filtering and unnesting example#
Filter for Postgres
select
 cast(postgres_logs.timestamp as datetime) as timestamp,
 parsed.error_severity,
 parsed.user_name,
 event_message
from
 postgres_logs
 cross join unnest(metadata) as metadata
 cross join unnest(metadata.parsed) as parsed
where regexp_contains(parsed.error_severity, 'ERROR|FATAL|PANIC')
order by timestamp desc
limit 100;
Limitations#
Log tables cannot be joined together#
Each product table operates independently without the ability to join with other log tables. This may change in the future.
The with keyword and subqueries are not supported#
The parser does not yet support with and subquery statements.
The ilike and similar to keywords are not supported#
Although like and other comparison operators can be used, ilike and similar to are incompatible with BigQuery's variant of SQL. regexp_contains can be used as an alternative.
The wildcard operator * to select columns is not supported#
The log parser is not able to parse the * operator for column selection. Instead, you can access all fields from the metadata column:
select
 cast(postgres_logs.timestamp as datetime) as timestamp,
 event_message,
 metadata
from
 <log_table_name>
order by timestamp desc
limit 100;

Log Drains

Log drains will send all logs of the Supabase stack to one or more desired destinations. It is only available for customers on Team and Enterprise Plans. Log drains is available in the dashboard under Project Settings > Log Drains.
You can read about the initial announcement here and vote for your preferred drains in this discussion.
Supported destinations
The following table lists the supported destinations and the required setup configuration:
Destination
Transport Method
Configuration
Generic HTTP endpoint
HTTP
URL
HTTP Version
Gzip
Headers
DataDog
HTTP
API Key
Region
Loki
HTTP
URL
Headers

HTTP requests are batched with a max of 250 logs or 1 second intervals, whichever happens first. Logs are compressed via Gzip if the destination supports it.
Generic HTTP endpoint#
Logs are sent as a POST request with a JSON body. Both HTTP/1 and HTTP/2 protocols are supported.
Custom headers can optionally be configured for all requests.
Note that requests are unsigned.
Unsigned requests to HTTP endpoints are temporary and all requests will signed in the near future.
Edge Function Walkthrough (Uncompressed)
Edge Function Gzip Example
DataDog logs#
Logs sent to DataDog have the name of the log source set on the service field of the event and the source set to Supabase. Logs are gzipped before they are sent to DataDog.
The payload message is a JSON string of the raw log event, prefixed with the event timestamp.
To setup DataDog log drain, generate a DataDog API key here and the location of your DataDog site.
Walkthrough
Example destination configuration
If you are interested in other log drains, upvote them here
Loki#
Logs sent to the Loki HTTP API are specifically formatted according to the HTTP API requirements. See the official Loki HTTP API documentation for more details.
Events are batched with a maximum of 250 events per request.
The log source and product name will be used as stream labels.
The event_message and timestamp fields will be dropped from the events to avoid duplicate data.
Loki must be configured to accept structured metadata, and it is advised to increase the default maximum number of structured metadata fields to at least 500 to accommodate large log event payloads of different products.
Pricing#
For a detailed breakdown of how charges are calculated, refer to Manage Log Drain usage.
Sentry integration
Integrate Sentry to monitor errors from a Supabase client

You can use Sentry to monitor errors thrown from a Supabase JavaScript client. Install the Supabase Sentry integration to get started.
The Sentry integration supports browser, Node, and edge environments.
Installation#
Install the Sentry integration using your package manager:
npm
yarn
pnpm
npm install @supabase/sentry-js-integration
Use#
If you are using Sentry JavaScript SDK v7, reference supabase-community/sentry-integration-js repository instead.
To use the Supabase Sentry integration, add it to your integrations list when initializing your Sentry client.
You can supply either the Supabase Client constructor or an already-initiated instance of a Supabase Client.
With constructor
With instance
import * as Sentry from '@sentry/browser'
import { SupabaseClient } from '@supabase/supabase-js'
import { supabaseIntegration } from '@supabase/sentry-js-integration'
Sentry.init({
 dsn: SENTRY_DSN,
 integrations: [
   supabaseIntegration(SupabaseClient, Sentry, {
     tracing: true,
     breadcrumbs: true,
     errors: true,
   }),
 ],
})
All available configuration options are available in our supabase-community/sentry-integration-js repository.
Deduplicating spans#
If you're already monitoring HTTP errors in Sentry, for example with the HTTP, Fetch, or Undici integrations, you will get duplicate spans for Supabase calls. You can deduplicate the spans by skipping them in your other integration:
import * as Sentry from '@sentry/browser'
import { SupabaseClient } from '@supabase/supabase-js'
import { supabaseIntegration } from '@supabase/sentry-js-integration'
Sentry.init({
 dsn: SENTRY_DSN,
 integrations: [
   supabaseIntegration(SupabaseClient, Sentry, {
     tracing: true,
     breadcrumbs: true,
     errors: true,
   }),
   // @sentry/browser
   Sentry.browserTracingIntegration({
     shouldCreateSpanForRequest: (url) => {
       return !url.startsWith(`${SUPABASE_URL}/rest`)
     },
   }),
   // or @sentry/node
   Sentry.httpIntegration({
     tracing: {
       ignoreOutgoingRequests: (url) => {
         return url.startsWith(`${SUPABASE_URL}/rest`)
       },
     },
   }),
   // or @sentry/node with Fetch support
   Sentry.nativeNodeFetchIntegration({
     ignoreOutgoingRequests: (url) => {
       return url.startsWith(`${SUPABASE_URL}/rest`)
     },
   }),
   // or @sentry/WinterCGFetch for Next.js Middleware & Edge Functions
   Sentry.winterCGFetchIntegration({
     breadcrumbs: true,
     shouldCreateSpanForRequest: (url) => {
       return !url.startsWith(`${SUPABASE_URL}/rest`)
     },
   }),
 ],
})
Example Next.js configuration#
See this example for a setup with Next.js to cover browser, server, and edge environments. First, run through the Sentry Next.js wizard to generate the base Next.js configuration. Then add the Supabase Sentry Integration to all your Sentry.init calls with the appropriate filters.
Browser
Server
Middleware & Edge
Instrumentation
import * as Sentry from '@sentry/nextjs'
import { SupabaseClient } from '@supabase/supabase-js'
import { supabaseIntegration } from '@supabase/sentry-js-integration'
Sentry.init({
 dsn: SENTRY_DSN,
 integrations: [
   supabaseIntegration(SupabaseClient, Sentry, {
     tracing: true,
     breadcrumbs: true,
     errors: true,
   }),
   Sentry.browserTracingIntegration({
     shouldCreateSpanForRequest: (url) => {
       return !url.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest`)
     },
   }),
 ],
 // Adjust this value in production, or use tracesSampler for greater control
 tracesSampleRate: 1,
 // Setting this option to true will print useful information to the console while you're setting up Sentry.
 debug: true,
})
Afterwards, build your application (npm run build) and start it locally (npm run start). You will now see the transactions being logged in the terminal when making supabase-js requests.

Edge Function 'wall clock time limit reached'
Last edited: 4/23/2025

What Does "Wall Clock Time Limit Reached" Mean?
The message "wall clock time limit reached" typically indicates that a process has reached the maximum time allowed for execution. This time is measured by a clock, similar to a system clock or a clock on the wall. It encompasses the entire duration a process takes to complete, including any periods of inactivity or waiting.
When this message appears in the context of your edge function, it means that the function has emitted a Shutdown event either after reaching the specified wall clock duration or when it hits a resource limit such as CPU time used or memory utilized.
Current Limits Explained
Wall Clock Time Limit: Currently set at 400 seconds for the total duration your edge function can run.
CPU Execution Time: Limited to 200 milliseconds of active computing.
This means that if your edge function completes its task within these time constraints, there's no need to be concerned about the "wall clock time limit reached" error message.
Because the "wall clock time limit reached" warning can be expected in some cases. This message is hard-coded to be printed out when the worker has been terminated, even if it hasn't reached the time limit. However, if your function terminates with this warning and returns a 546 error response, then this indicates that your function is exceeding the allowed execution time, signaling a long-running task.
Steps to Troubleshoot
If you're facing the "wall clock time limit reached" error with a 546 error code, here are actions to take:
Review Your Function's Logic: Examine the operations within your edge function for any inefficiencies or prolonged processes. Consider optimizing code, minimizing unnecessary calculations, and implementing asynchronous operations where possible.
Divide Complex Tasks: For functions handling complex or extensive tasks, try breaking them down into smaller, discrete functions. This approach can help manage workloads more effectively and stay within time limits.
Monitor Execution Time: Use our logging or monitoring tools available to keep an eye on your function's performance. This can pinpoint where optimizations are necessary. To access logs visit: Supabase Project Functions Select your function and click on Logs.
Check Our Guides: For more tips, refer to our debugging guide here: Debugging Edge Functions
Future Considerations
There are plans to make the wall clock time limit configurable per project in the future. However, currently, the only way to adjust this limit is by self-hosting Edge Functions.
Database API 42501 errors
Last edited: 6/5/2025

Postgres 42501 errors, often reported by clients as 401 or 403 errors, imply the request lacked adequate privileges. They can be viewed in the log explorer by running:
select
 cast(postgres_logs.timestamp as datetime) as timestamp,
 event_message,
 parsed.error_severity,
 parsed.user_name,
 parsed.query,
 parsed.detail,
 parsed.hint
from
 postgres_logs
 cross join unnest(metadata) as metadata
 cross join unnest(metadata.parsed) as parsed
where
 regexp_contains(parsed.error_severity, 'ERROR|FATAL|PANIC')
 and parsed.sql_state_code = '42501'
order by timestamp desc
limit 100;
They tend to be caused by one of the following factors.
Attempted to access a forbidden schema#
API roles cannot access certain schemas, most notably auth and vault. This restriction extends to Foreign Data Wrappers relying on vault. While you can bypass it using a security definer function, these schemas are intentionally restricted for security reasons.
Attempted to access a custom schema#
If you created a custom schema, you will have to give the Database API permission to query it. Follow our Using Custom Schemas guide for more directions.
Revoked object level access:#
In rare cases, users may accidentally revoke object-level access in public from their API roles. To regrant full visibility, run the below code:
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all routines in schema public to anon, authenticated, service_role;
grant all ON all sequences in schema public to anon, authenticated, service_role;
alter default privileges for role postgres in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges for role postgres in schema public grant all on routines to anon, authenticated, service_role;
alter default privileges for role postgres in schema public grant all on sequences to anon, authenticated, service_role;
Configured column-level restrictions#
If you've set column-based access in the Dashboard or via SQL, queries will fail with a 42501 error when accessing restricted columns. This includes using select *, as it expands to include forbidden columns.
RLS:#
If the anon or authenticated roles attempt to UPDATE or INSERT values without the necessary RLS permissions, Postgres will return a 42501 error.
Webhook debugging guide
Last edited: 2/21/2025

NOTE: version 0.10.0 of pg*net is out. You should consider updating your database in the Infrastructure Settings if you are on a prior version. If you do not know your version, you can check the Extensions Dashboard.
Debugging Steps
1. Test if webhooks are active:
Webhooks are run in a Postgres background worker. The first debugging step is to see if the worker is active. Run the following SQL code:
select pid from pg_stat_activity where backend_type ilike '%pg_net%';
If it does not return an integer, then the worker has failed and needs to be restarted. If you are running PG_NET 0.8 or later, you can restart the background worker by executing the following function:
select net.worker_restart();
Otherwise, it is necessary to fast reboot your instance in the Dashboard's Settings.
2. Remove any triggers on net tables:
Using pg_net in triggers on most tables is fine; however, do not add triggers to the net._http_response or net.http_request_queue tables.
The net tables are special and if triggers on them fail or call a pg_net function (http_get, http_post, http_delete), it can lead to an infinite loop. This warning is irrelevant to most projects, but it's worth specifying just in case.
3. Check for timeout errors
NOTE: The timeout issue has been patched in pg*net v0.11. It is available in Postgres 15.6.1.135 and above. You can upgrade your version of Postgres in the Infrastructure Settings.
Go to your Table Editor and navigate to the net schema. It will contain two tables:
_http_response
http_request_queue
The _http_response table saves all the response messages from the past 6 hours. If every column contains NULL values, except for the id, error_msg, and created columns, then you are experiencing a timeout bug.
By default, webhooks will execute the next 200 available queued requests. If the requests are too intense, it may result in a mass timeout. In the Webhook Dashboard, you should increase your webhook's timeout to minimize this issue.
4. Inspect endpoints
The below code makes a request to the Postman Echo API through PG_NET
select
net.http_post(
url := 'https://postman-echo.com/post',
body := '{"key1": "value", "key2": 5}'::jsonb
) as request_id;
Postman will then respond with the same payload. This is just a test to confirm that requests are being properly formatted and going through.
You can then view the request in the net._http_response table in the Table Editor or with the following SQL:
select
*
from net._http_response
where id = <request_id>
You should also inspect all the failed responses from the past 6 hours to see if their are any insightful messages:
select
 *
from net._http_response
where "status_code" >= 400 or "error_msg" is not null
order by created desc;
Status codes from a server are described in Mozilla's web docs
5. Create logs
If none of the above suggestions uncovered the cause of the error, for debugging purposes, it may be useful to write a custom webhook that can create logs in the Dashboard's Postgres Logs. The process is outlined in the PG_NET documentation.
Conclusion:
If your issue still persists, document it as an issue in the PG_NET GitHub Repo. You are also welcome to contact Supabase Support from your project's Dashboard for more guidance.
​​Steps to improve query performance with indexes
Last edited: 2/21/2025

Optimizing your database
This is an intermediate and actionable guide for Postgres optimization within the Supabase ecosystem.
Consider checking out Index_advisor and the performance advisor now available in the Dashboard!
Installing Supabase Grafana#
Supabase has an open-source Grafana Repo that displays real-time metrics of your database. Although the Reports Dashboard provides similar metrics, it averages the data by the hour or day. Having visibility over how your database responds to changes helps to ensure that the database is not stressed by the index-building process.
Visual of Grafana Dashboard

It can be run locally within Docker or can be deployed for free to fly.io. Installation instructions can be found in Supabase's metrics docs
Query optimization through indexes#
Disk (storage) is relatively slow compared to memory, so Postgres will take frequently accessed data and cache it in memory for fast access.
Ideally, you want the cache hit rate (cache-hits/total-hits) to be 99%. You should try to run the following query on your instance:
select
 'index hit rate' as name,
 (sum(idx_blks_hit)) / nullif(sum(idx_blks_hit + idx_blks_read), 0) as ratio
from pg_statio_user_indexes
union all
select
 'table hit rate' as name,
 sum(heap_blks_hit) / nullif(sum(heap_blks_hit) + sum(heap_blks_read), 0) as ratio
from pg_statio_user_tables;
If the cache hit rate is relatively low, it often means that you need to increase your memory capacity. The second metric that is often inspected is index usage. Indexes are data structures that allow Postgres to search for information quickly - think of them like you would think of an index at the back of a book. Instead of scanning every page (or row), you can use an index to find the contents you need quickly. For a better understanding of how Postgres decides on whether to use an index or not, check out this explainer.
The index hit rate (how often an index is used) can usually be improved moderately.
There's a query to find out how often an index is used when accessing a table:
select
 relname,
 100 * idx_scan / (seq_scan + idx_scan) as percent_of_times_index_used,
 n_live_tup as rows_in_table
from pg_stat_user_tables
where seq_scan + idx_scan > 0
order by n_live_tup desc;
A lot of the queries for inspecting performance are actually pre-bundled as part of the Supabase CLI. For instance, there is a command for testing which indexes of yours are unnecessary and are needlessly taking up space:
npx supabase login
npx supabase link
npx supabase inspect db unused-indexes
There is an extension called index_advisor that creates virtual indexes on your queries and then checks which ones increase performance the best. Unlike normal index creation, virtual indexes can be made rapidly, which makes uncovering the most performant solutions fast. The Query Performance Advisor in the Dashboard is configured to use index_advisor to make optimization suggestions and you should check it out to see where you can improve.
Index_advisor won't test indexes added through extensions nor will it test GIN/GIST indexes. For JSON or ARRAY columns, consider exploring GIN/GIST indexes separately from index_advisor. If you're using pg_vector, it's crucial to use an HSNW index.
Indexes can significantly speed up reads, sometimes boosting performance by 100 times. However, they come with a trade-off: they need to track all column changes, which can slow down data-modifying queries like UPDATEs, DELETEs, and INSERTs.
Generally, indexes offer more benefits. For example, primary key columns automatically have a B-Tree index, enhancing read and join operations without significantly affecting write queries. Nonetheless, it's wise to avoid carelessly adding indexes.
Some indexes may take a long time to build. A guide was written for applying HSNW indexes, but it can be generalized and referenced for applying others, too.
When building an index, the affected table is locked, preventing write operations. If this poses an issue, use the CONCURRENTLY modifier. However, reserve this for necessary cases only, as it entails building the index twice, prolonging the process and increasing computational costs.
Database Backups

Database backups are an integral part of any disaster recovery plan. Disasters come in many shapes and sizes. It could be as simple as accidentally deleting a table column, the database crashing, or even a natural calamity wiping out the underlying hardware a database is running on. The risks and impact brought by these scenarios can never be fully eliminated, but only minimized or even mitigated. Having database backups is a form of insurance policy. They are essentially snapshots of the database at various points in time. When disaster strikes, database backups allow the project to be brought back to any of these points in time, therefore averting the crisis.
The Supabase team regularly monitors the status of backups. In case of any issues, you can contact support. Also you can check out our status page at any time.
Once a project is deleted all associated data will be permanently removed, including any backups stored in S3. This action is irreversible and should be carefully considered before proceeding.
Types of backups#
Database backups can be categorized into two types: logical and physical. You can learn more about them here.
As a general rule of thumb, projects will either have logical or physical backups based on plan, database size, and add-ons:
Plan
Database Size (0-15GB)
Database Size (>15GB)
PITR
Read Replicas
Pro
logical
physical
physical
physical
Team
logical
physical
physical
physical
Enterprise
physical
physical
physical
physical

Once a project satisfies at least one of the requirements for physical backups then logical backups will no longer be taken. However, your project may revert back to logical backups if add-ons are removed.
You can confirm your project's backup type by navigating to Database Backups > Scheduled backups and if you can download a backup then it is logical, otherwise it is physical.
However, if your project has the Point-in-Time Recovery (PITR) add-on then the backups are physical and you can view them in Database Backups > Point in time.
Frequency of backups#
When deciding how often a database should be backed up, the key business metric Recovery Point Objective (RPO) should be considered. RPO is the threshold for how much data, measured in time, a business could lose when disaster strikes. This amount is fully dependent on a business and its underlying requirements. A low RPO would mean that database backups would have to be taken at an increased cadence throughout the day. Each Supabase project has access to two forms of backups, Daily Backups and Point-in-Time Recovery (PITR). The agreed upon RPO would be a deciding factor in choosing which solution best fits a project.
If you enable PITR, Daily Backups will no longer be taken. PITR provides a finer granularity than Daily Backups, so it's unnecessary to run both.
Database backups do not include objects stored via the Storage API, as the database only includes metadata about these objects. Restoring an old backup does not restore objects that have been deleted since then.
Daily backups#
All Pro, Team and Enterprise Plan Supabase projects are backed up automatically on a daily basis. In terms of Recovery Point Objective (RPO), Daily Backups would be suitable for projects willing to lose up to 24 hours worth of data if disaster hits at the most inopportune time. If a lower RPO is required, enabling Point-in-Time Recovery should be considered.
For security purposes, passwords for custom roles are not stored in daily backups, and will not be found in downloadable files. As such, if you are restoring from a daily backup and are using custom roles, you will need to set their passwords once more following a completed restoration.
Backup process #
The Postgres utility pg_dumpall is used to perform daily backups. An SQL file is generated, zipped up, and sent to our storage servers for safe keeping.
You can access daily backups in the Scheduled backups settings in the Dashboard. Pro Plan projects can access the last 7 days' worth of daily backups. Team Plan projects can access the last 14 days' worth of daily backups, while Enterprise Plan projects can access up to 30 days' worth of daily backups. Users can restore their project to any one of the backups. If you wish to generate a logical backup on your own, you can do so through the Supabase CLI.
You can also manage backups programmatically using the Management API:
# Get your access token from https://supabase.com/dashboard/account/tokens
export SUPABASE_ACCESS_TOKEN="your-access-token"
export PROJECT_REF="your-project-ref"
# List all available backups
curl -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
 "https://api.supabase.com/v1/projects/$PROJECT_REF/database/backups"
# Restore from a PITR (not logical) backup (replace ISO timestamp with desired restore point)
curl -X POST "https://api.supabase.com/v1/projects/$PROJECT_REF/database/backups/restore-pitr" \
 -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
 -H "Content-Type: application/json" \
 -d '{
   "recovery_time_target_unix": "1735689600"
 }'
Backup process for large databases#
Databases larger than 15GB1, if they're on a recent build2 of the Supabase platform, get automatically transitioned3 to use daily physical backups. Physical backups are a more performant backup mechanism that lowers the overhead and impact on the database being backed up, and also avoids holding locks on objects in your database for a long period of time. While restores are unaffected, the backups created using this method cannot be downloaded from the Backups section of the dashboard.
This class of physical backups only allows for recovery to a fixed time each day, similar to daily backups. You can upgrade to PITR for access to more granular recovery options.
Once a database is transitioned to using physical backups, it continues to use physical backups, even if the database size falls back below the threshold for the transition.
Restoration process #
When selecting a backup to restore to, select the closest available one made before the desired point in time to restore to. Earlier backups can always be chosen too but do consider the number of days' worth of data that could be lost.
The Dashboard will then prompt for a confirmation before proceeding with the restoration. The project will be inaccessible following this. As such, do ensure to allot downtime beforehand. This is dependent on the size of the database. The larger it is, the longer the downtime will be. Once the confirmation has been given, the underlying SQL of the chosen backup is then run against the project. The Postgres utility psql is used to facilitate the restoration. The Dashboard will display a notification once the restoration completes.
If your project is using subscriptions or replication slots, you will need to drop them prior to the restoration, and re-create them afterwards. The slot used by Realtime is exempted from this, and will be handled automatically.
Point-in-Time recovery#
Point-in-Time Recovery (PITR) allows a project to be backed up at much shorter intervals. This provides users an option to restore to any chosen point of up to seconds in granularity. Even with daily backups, a day's worth of data could still be lost. With PITR, backups could be performed up to the point of disaster.
Pro, Team and Enterprise Plan projects can enable PITR as an add-on.
Projects interested in PITR will also need to use at least a Small compute add-on, in order to ensure smooth functioning.
If you enable PITR, Daily Backups will no longer be taken. PITR provides a finer granularity than Daily Backups, so it's unnecessary to run both.
Backup process #
As discussed here, PITR is made possible by a combination of taking physical backups of a project, as well as archiving Write Ahead Log (WAL) files. Physical backups provide a snapshot of the underlying directory of the database, while WAL files contain records of every change made in the database.
Supabase uses WAL-G, an open source archival and restoration tool, to handle both aspects of PITR. On a daily basis, a snapshot of the database is taken and sent to our storage servers. Throughout the day, as database transactions occur, WAL files are generated and uploaded.
By default, WAL files are backed up at two minute intervals. If these files cross a certain file size threshold, they are backed up immediately. As such, during periods of high amount of transactions, WAL file backups become more frequent. Conversely, when there is no activity in the database, WAL file backups are not made. Overall, this would mean that at the worst case scenario or disaster, the PITR achieves a Recovery Point Objective (RPO) of two minutes.

You can access PITR in the Point in Time settings in the Dashboard. The recovery period of a project is indicated by the earliest and latest points of recoveries displayed in your preferred timezone. If need be, the maximum amount of this recovery period can be modified accordingly.
Note that the latest restore point of the project could be significantly far from the current time. This occurs when there has not been any recent activity in the database, and therefore no WAL file backups have been made recently. This is perfectly fine as the state of the database at the latest point of recovery would still be indicative of the state of the database at the current time given that no transactions have been made in between.
Restoration process #

A date and time picker will be provided upon pressing the Start a restore button. The process will only proceed if the selected date and time fall within the earliest and latest points of recoveries.

After locking in the desired point in time to recover to, The Dashboard will then prompt for a review and confirmation before proceeding with the restoration. The project will be inaccessible following this. As such, do ensure to allot for downtime beforehand. This is dependent on the size of the database. The larger it is, the longer the downtime will be. Once the confirmation has been given, the latest physical backup available is downloaded to the project and the database is partially restored. WAL files generated after this physical backup up to the specified point-in-time are then downloaded. The underlying records of transactions in these files are replayed against the database to complete the restoration. The Dashboard will display a notification once the restoration completes.
Pricing#
Pricing depends on the recovery retention period, which determines how many days back you can restore data to any chosen point of up to seconds in granularity.
Recovery Retention Period in Days
Hourly Price USD
Monthly Price USD
7
$0.137
$100
14
$0.274
$200
28
$0.55
$400

For a detailed breakdown of how charges are calculated, refer to Manage Point-in-Time Recovery usage.
Restore to a new project#
Supabase provides a convenient way to restore data from an existing project into a completely new one. Whether you're using physical backups or Point-in-Time recovery (PITR), this feature allows you to duplicate project data with ease, perform testing safely, or recover data for analysis. Access to this feature is exclusive to users on paid plans and requires that physical backups are enabled for the source project.
PITR is an additional add-on available for organizations on a paid plan with physical backups enabled.
To begin, switch to the source project—the project containing the data you wish to restore—and go to the database backups page. Select the Restore to a New Project tab.
A list of available backups is displayed. Select the backup you want to use and click the "Restore" button. For projects with PITR enabled, use the date and time selector to specify the exact point in time from which you wish to restore data.
Once you’ve made your choice, Supabase takes care of the rest. A new project is automatically created, replicating key configurations from the original, including the compute instance size, disk attributes, SSL enforcement settings, and network restrictions. The data will remain in the same region as the source project to ensure compliance with data residency requirements. The entire process is fully automated.
The time required to complete the restoration can vary depending largely on the volume of data involved. If you have a large amount of data you can opt for higher performing disk attributes on the source project before starting a clone operation. These disk attributes will be replicated to the new project. This incurs additional costs which will be displayed before starting.
There are a few important restrictions to be aware of with the "Restore to a New Project" process:
Projects that are created through the restoration process cannot themselves be used as a source for further clones at this time.
The feature is only accessible to paid plan users with physical backups enabled, ensuring that the necessary resources and infrastructure are available for the restore process.
Before starting the restoration, you’ll be presented with an overview of the costs associated with creating the new project. The new project will incur additional monthly expenses based on the mirrored resources from the source project. It’s important to review these costs carefully before proceeding.
Once the restoration is complete, the new project will be available in your dashboard and will include all data, tables, schemas, and selected settings from the chosen backup source. It is recommended to thoroughly review the new project and perform any necessary tests to ensure everything has been restored as expected.
New projects are completely independent of their source, and as such can be modified and used as desired.
As the entire database is copied to the new project, this will include all extensions that were enabled at the source. If the source project included extensions that are configured to carry out external operations—for example pg_net, pg_cron, wrappers—these should be disabled once the copy process has completed to avoid any unwanted actions from taking place.
Restoring to a new project is an excellent way to manage environments more effectively. You can use this feature to create staging environments for testing, experiment with changes without risk to production data, or swiftly recover from unexpected data loss scenarios.
Troubleshooting#
Logical backups#
search_path issues#
During the pg_restore process, the search_path is set to an empty string for predictability, and security. Using unqualified references to functions or relations can cause restorations using logical backups to fail, as the database will not be able to locate the function or relation being referenced. This can happen even if the database functions without issues during normal operations, as the search_path is usually set to include several schemas during normal operations. Therefore, you should always use schema-qualified names within your SQL code.
You can refer to an example PR on how to update SQL code to use schema-qualified names.
Invalid check constraints#
Postgres requires that check constraints be:
immutable
not reference table data other than the new or updated row being checked
Violating these requirements can result in numerous failure scenarios, including during logical restorations.
Common examples of check constraints that can result in such failures are:
validating against the current time, e.g. that the row being inserted references a future event
validating the contents of a row against the contents of another table
Footnotes#
The threshold for transitioning will be slowly lowered over time. Eventually, all projects will be transitioned to using physical backups. ↩
Projects created or upgraded after the 14th of July 2022 are eligible. ↩
The transition to physical backups is handled transparently and does not require any user intervention. It involves a single restart of the database to pick up new configuration that can only be loaded at start; the expected downtime for the restart is a few seconds. ↩
Performance Tuning

The Supabase platform automatically optimizes your Postgres database to take advantage of the compute resources of the plan your project is on. However, these optimizations are based on assumptions about the type of workflow the project is being utilized for, and it is likely that better results can be obtained by tuning the database for your particular workflow.
Examining query performance#
Unoptimized queries are a major cause of poor database performance. To analyze the performance of your queries, see the Debugging and monitoring guide.
Optimizing the number of connections#
The default connection limits for Postgres and Supavisor is based on your compute size. See the default connection numbers in the Compute Add-ons section.
If the number of connections is insufficient, you will receive the following error upon connecting to the DB:
$ psql -U postgres -h ...
FATAL: remaining connection slots are reserved for non-replication superuser connections
In such a scenario, you can consider:
upgrading to a larger compute add-on
configuring your clients to use fewer connections
manually configuring the database for a higher number of connections
Configuring clients to use fewer connections#
You can use the pg_stat_activity view to debug which clients are holding open connections on your DB. pg_stat_activity only exposes information on direct connections to the database. Information on the number of connections to Supavisor is available via the metrics endpoint.
Depending on the clients involved, you might be able to configure them to work with fewer connections (e.g. by imposing a limit on the maximum number of connections they're allowed to use), or shift specific workloads to connect via Supavisor instead. Transient workflows, which can quickly scale up and down in response to traffic (e.g. serverless functions), can especially benefit from using a connection pooler rather than connecting to the DB directly.
Allowing higher number of connections#
You can configure Postgres connection limit among other parameters by using Custom Postgres Config.
Enterprise#
Contact us if you need help tuning your database for your specific workflow.

Control your costs

Spend Cap#
The Spend Cap determines whether your organization can exceed your subscription plan's quota for any usage item. Scenarios that could lead to high usage—and thus high costs—include system attacks or bugs in your software. The Spend Cap can protect you from these unexpected costs for certain usage items.
This feature is available only with the Pro Plan. However, you will not be charged while using the Free Plan.
What happens when the Spend Cap is on?#
After exceeding the quota for a usage item, further usage of that item is disallowed until the next billing cycle. You don't get charged for over-usage but your services will be restricted according to our Fair Use Policy if you consistently exceed the quota.
Note that only certain usage items are covered by the Spend Cap.
What happens when the Spend Cap is off?#
Your projects will continue to operate after exceeding the quota for a usage item. Any additional usage will be charged based on the item's cost per unit, as outlined on the pricing page.
When the Spend Cap is off, we recommend monitoring your usage and costs on the organization's
usage page.
Usage items covered by the Spend Cap#
Disk Size
Egress
Edge Function Invocations
Monthly Active Users
Monthly Active SSO Users
Monthly Active Third Party Users
Realtime Messages
Realtime Peak Connections
Storage Image Transformations
Storage Size
Usage items not covered by the Spend Cap#
Usage items that are predictable and explicitly opted into by the user are excluded.
Compute
Branching Compute
Read Replica Compute
Custom Domain
Additionally provisioned Disk IOPS
Additionally provisioned Disk Throughput
IPv4 address
Log Drain Hours
Log Drain Events
Multi-Factor Authentication Phone
Point-in-Time-Recovery
What the Spend Cap is not#
The Spend Cap doesn't allow for fine-grained cost control, such as setting budgets for specific usage item or receiving notifications when certain costs are reached. We plan to make cost control more flexible in the future.
Configure the Spend Cap#
You can configure the Spend Cap when creating an organization on the Pro Plan or at any time in the Cost Control section of the organization's billing page.
Keep track of your usage and costs#
You can monitor your usage on the organization's usage page. The Upcoming Invoice section of the organization's billing page shows your current spending and provides an estimate of your total costs for the billing cycle based on your usage.


