# Resend API Reference Documentation

## Document Overview

### Purpose
This document serves as the comprehensive API reference for integrating Resend email services into Parker Flight's platform. Resend provides a modern, developer-friendly email API that enables reliable transactional email delivery, broadcast campaigns, and audience management.

### Quick Start Guide
1. **Authentication Setup**: Obtain API key from Resend dashboard
2. **Initialize Client**: Configure Resend SDK with your API key
3. **Send First Email**: Use the `/emails` endpoint to send transactional emails
4. **Domain Configuration**: Set up and verify your sending domain
5. **Production Deployment**: Configure rate limits and error handling

### Core Email Workflows
- **Transactional Emails**: User confirmations, password resets, notifications
- **Batch Email Processing**: Send up to 100 emails per API call for efficiency
- **Scheduled Emails**: Queue emails for future delivery with precise timing
- **Broadcast Campaigns**: Send marketing emails to managed audiences
- **Email Tracking**: Monitor delivery status, opens, and click-through rates

### Integration Architecture
```
Parker Flight Application
        ↓
  Resend API Client
        ↓
    Resend API
        ↓
   Email Delivery
```

### Critical Implementation Notes

#### Rate Limits & Quotas
- **Default Rate Limit**: 2 requests per second
- **Daily Quota**: Varies by plan tier
- **Batch Processing**: Use `/emails/batch` for bulk operations
- **Rate Limit Headers**: Monitor `ratelimit-*` response headers

#### Security Considerations
- **API Key Protection**: Store API keys securely, never in client-side code
- **Domain Verification**: Verify sending domains via DNS records (SPF, DKIM)
- **TLS Configuration**: Use enforced TLS for sensitive email communications
- **Permission Scoping**: Use `sending_access` keys for email-only operations

#### Email Authentication
- **SPF Records**: Configure sender policy framework
- **DKIM Signing**: Enable DomainKeys Identified Mail
- **Return Path**: Configure custom return paths for bounces
- **Domain Status**: Monitor domain verification status

### Domain Management Strategy

#### Domain Setup Process
1. Create domain via API or dashboard
2. Configure DNS records (SPF, DKIM, MX)
3. Verify domain configuration
4. Monitor domain status and authentication

#### Best Practices
- Use dedicated subdomains for different email types
- Configure custom return paths for bounce handling
- Implement proper DNS record management
- Monitor domain reputation and deliverability

### Error Handling Strategy

#### Response Codes
- **2xx**: Success - process response data
- **400**: Bad Request - validate input parameters
- **401/403**: Authentication - check API key validity
- **422**: Validation Error - review field requirements
- **429**: Rate Limited - implement exponential backoff
- **5xx**: Server Error - retry with jitter

#### Retry Logic Implementation
```javascript
const retryWithBackoff = async (operation, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (error.status === 429 || error.status >= 500) {
        const delay = Math.min(1000 * Math.pow(2, i) + Math.random() * 1000, 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};
```

### Testing & Validation

#### Development Environment
- Use Resend's sandbox mode for testing
- Test with `@resend.dev` email addresses
- Validate DNS configuration before production
- Test rate limiting and error handling

#### Email Validation
- Verify email address format validation
- Test attachment handling (max 40MB)
- Validate HTML and text content rendering
- Test internationalization and character encoding

### API Endpoint Categories

#### Email Operations
- **Send Email**: `/emails` (POST) - Send individual transactional emails
- **Send Batch**: `/emails/batch` (POST) - Send up to 100 emails at once
- **Retrieve Email**: `/emails/:id` (GET) - Get email status and details
- **Update Email**: `/emails/:id` (PATCH) - Modify scheduled emails
- **Cancel Email**: `/emails/:id/cancel` (POST) - Cancel scheduled delivery

#### Domain Management
- **Create Domain**: `/domains` (POST) - Add new sending domain
- **Retrieve Domain**: `/domains/:id` (GET) - Get domain configuration
- **Verify Domain**: `/domains/:id/verify` (POST) - Trigger domain verification
- **Update Domain**: `/domains/:id` (PATCH) - Modify domain settings
- **List Domains**: `/domains` (GET) - Get all configured domains
- **Delete Domain**: `/domains/:id` (DELETE) - Remove domain

#### Authentication Management
- **Create API Key**: `/api-keys` (POST) - Generate new API key
- **List API Keys**: `/api-keys` (GET) - Get all API keys
- **Delete API Key**: `/api-keys/:id` (DELETE) - Revoke API key

#### Broadcast & Audience Management
- **Create Broadcast**: `/broadcasts` (POST) - Create email campaign
- **Manage Audiences**: `/audiences` - Create and manage subscriber lists
- **Contact Management**: `/contacts` - Handle individual subscribers

### Common Integration Pitfalls

#### Email Delivery Issues
- **Missing DNS Records**: Ensure SPF, DKIM, and MX records are configured
- **Invalid From Addresses**: Use verified domains for sender addresses
- **Attachment Size Limits**: Keep attachments under 40MB after Base64 encoding
- **Rate Limit Violations**: Implement proper request throttling

#### Authentication Problems
- **API Key Exposure**: Never commit API keys to version control
- **Insufficient Permissions**: Use appropriate permission scope for operations
- **Key Rotation**: Implement API key rotation for security
- **Domain Verification**: Complete DNS configuration before sending

#### Content & Formatting
- **HTML Rendering**: Test email templates across different clients
- **Character Encoding**: Use UTF-8 for international content
- **Link Tracking**: Configure tracking domains properly
- **Unsubscribe Links**: Include required unsubscribe mechanisms

### Parker Flight Integration Status

#### Current Implementation
- ✅ **Basic Email Sending**: Transactional emails implemented
- ✅ **Domain Configuration**: Production domains verified
- ✅ **Error Handling**: Basic retry logic in place
- 🔄 **Batch Processing**: Under development for bulk notifications
- 📋 **Broadcast Campaigns**: Planned for user engagement
- 📋 **Advanced Analytics**: Planned for email performance tracking

#### Integration Checkpoints
1. **API Key Security**: Verify secure storage and rotation
2. **Domain Health**: Monitor DNS record status
3. **Delivery Rates**: Track email delivery success rates
4. **Error Monitoring**: Implement comprehensive error logging
5. **Performance Metrics**: Monitor API response times and rate limits

### Strategic Integration Context

Resend serves as Parker Flight's primary email delivery platform, handling:
- **User Authentication**: Email verification and password resets
- **Booking Confirmations**: Flight booking and itinerary updates
- **Notification System**: Real-time flight status and gate changes
- **Marketing Communications**: Promotional campaigns and user engagement
- **Support Communications**: Customer service and help desk emails

The integration prioritizes reliability, deliverability, and compliance with email authentication standards to ensure critical flight-related communications reach users promptly and securely.

---

This document provides comprehensive API reference for Resend email service.


Resend home page

Search...
⌘K
Ask AI
Sign In
Get Started


Documentation
API Reference
Knowledge Base
API Reference
Introduction
Errors
Rate Limit
Email
POST
Send Email
POST
Send Batch Emails
GET
Retrieve Email
PATCH
Update Email
POST
Cancel Email
Domains
POST
Create Domain
GET
Retrieve Domain
POST
Verify Domain
PATCH
Update Domain
GET
List Domains
DEL
Delete Domain
API Keys
POST
Create API key
GET
List API keys
DEL
Delete API key
Broadcasts
POST
Create Broadcast
GET
Retrieve Broadcast
PATCH
Update Broadcast
POST
Send Broadcast
DEL
Delete Broadcast
GET
List Broadcasts
Audiences
POST
Create Audience
GET
Retrieve Audience
DEL
Delete Audience
GET
List Audiences
Contacts
POST
Create Contact
GET
Retrieve Contact
PATCH
Update Contact
DEL
Delete Contact
GET
List Contacts
API Reference
Introduction
Understand general concepts, response codes, and authentication strategies.
​
Base URL
The Resend API is built on REST principles. We enforce HTTPS in every request to improve data security, integrity, and privacy. The API does not support HTTP.
All requests contain the following base URL:
Copy
Ask AI
https://api.resend.com

​
Authentication
To authenticate you need to add an Authorization header with the contents of the header being Bearer re_xxxxxxxxx where re_xxxxxxxxx is your API Key.
Copy
Ask AI
Authorization: Bearer re_xxxxxxxxx

​
Response codes
Resend uses standard HTTP codes to indicate the success or failure of your requests.
In general, 2xx HTTP codes correspond to success, 4xx codes are for user-related failures, and 5xx codes are for infrastructure issues.
Status
Description
200
Successful request.
400
Check that the parameters were correct.
401
The API key used was missing.
403
The API key used was invalid.
404
The resource was not found.
429
The rate limit was exceeded.
5xx
Indicates an error with Resend servers.

Check Error Codes for a comprehensive breakdown of all possible API errors.
​
Rate limit
The default maximum rate limit is 2 requests per second. This number can be increased for trusted senders by request. After that, you’ll hit the rate limit and receive a 429 response error code.

Resend home page

Search...
⌘K
Ask AI
Sign In
Get Started


Documentation
API Reference
Knowledge Base
API Reference
Introduction
Errors
Rate Limit
Email
POST
Send Email
POST
Send Batch Emails
GET
Retrieve Email
PATCH
Update Email
POST
Cancel Email
Domains
POST
Create Domain
GET
Retrieve Domain
POST
Verify Domain
PATCH
Update Domain
GET
List Domains
DEL
Delete Domain
API Keys
POST
Create API key
GET
List API keys
DEL
Delete API key
Broadcasts
POST
Create Broadcast
GET
Retrieve Broadcast
PATCH
Update Broadcast
POST
Send Broadcast
DEL
Delete Broadcast
GET
List Broadcasts
Audiences
POST
Create Audience
GET
Retrieve Audience
DEL
Delete Audience
GET
List Audiences
Contacts
POST
Create Contact
GET
Retrieve Contact
PATCH
Update Contact
DEL
Delete Contact
GET
List Contacts
API Reference
Errors
Troubleshoot problems with this comprehensive breakdown of all error codes.
​
Error schema
We use standard HTTP response codes for success and failure notifications, and our errors are further classified by type.
​
invalid_idempotency_key
Status: 400
Message: The key must be between 1-256 chars.
Suggested action: Retry with a valid idempotency key.
​
validation_error
Status: 400
Message: We found an error with one or more fields in the request.
Suggested action: The message will contain more details about what field and error were found.
​
missing_api_key
Status: 401
Message: Missing API key in the authorization header.
Suggested action: Include the following header in the request: Authorization: Bearer YOUR_API_KEY.
​
restricted_api_key
Status: 401
Message: This API key is restricted to only send emails.
Suggested action: Make sure the API key has Full access to perform actions other than sending emails.
​
invalid_api_key
Status: 403
Message: API key is invalid.
Suggested action: Make sure the API key is correct or generate a new API key in the dashboard.
​
validation_error
Status: 403
Message: You can only send testing emails to your own email address (youremail@domain.com).
Suggested action: In Resend’s Domain page, add and verify a domain for which you have DNS access. This allows you to send emails to addresses beyond your own.
​
not_found
Status: 404
Message: The requested endpoint does not exist.
Suggested action: Change your request URL to match a valid API endpoint.
​
method_not_allowed
Status: 405
Message: Method is not allowed for the requested path.
Suggested action: Change your API endpoint to use a valid method.
​
invalid_idempotent_request
Status: 409
Message: Same idempotency key used with a different request payload.
Suggested action: Change your idempotency key or payload.
​
concurrent_idempotent_requests
Status: 409
Message: Same idempotency key used while original request is still in progress.
Suggested action: Try the request again later.
​
invalid_attachment
Status: 422
Message: Attachment must have either a content or path.
Suggested action: Attachments must either have a content (strings, Buffer, or Stream contents) or path to a remote resource (better for larger attachments).
​
invalid_from_address
Status: 422
Message: Invalid from field.
Suggested action: Make sure the from field is a valid. The email address needs to follow the email@example.com or Name <email@example.com> format.
​
invalid_access
Status: 422
Message: Access must be “full_access” | “sending_access”.
Suggested action: Make sure the API key has necessary permissions.
​
invalid_parameter
Status: 422
Message: The parameter must be a valid UUID.
Suggested action: Check the value and make sure it’s valid.
​
invalid_region
Status: 422
Message: Region must be “us-east-1” | “eu-west-1” | “sa-east-1”.
Suggested action: Make sure the correct region is selected.
​
missing_required_field
Status: 422
Message: The request body is missing one or more required fields.
Suggested action: Check the error message to see the list of missing fields.
​
daily_quota_exceeded
Status: 429
Message: You have reached your daily email sending quota.
Suggested action: Upgrade your plan to remove the daily quota limit or wait until 24 hours have passed to continue sending.
​
rate_limit_exceeded
Status: 429
Message: Too many requests. Please limit the number of requests per second. Or contact support to increase rate limit.
Suggested action: You should read the response headers and reduce the rate at which you request the API. This can be done by introducing a queue mechanism or reducing the number of concurrent requests per second. If you have specific requirements, contact support to request a rate increase.
​
security_error
Status: 451
Message: We may have found a security issue with the request.
Suggested action: The message will contain more details. Contact support for more information.
​
application_error
Status: 500
Message: An unexpected error occurred.
Suggested action: Try the request again later. If the error does not resolve, check our status page for service updates.
​
internal_server_error
Status: 500
Message: An unexpected error occurred.
Suggested action: Try the request again later. If the error does not resolve, check our status page for service updates.
Rate Limit
Understand rate limits and how to increase them.
The response headers describe your current rate limit following every request in conformance with the IETF standard:
Header name
Description
ratelimit-limit
Maximum number of requests allowed within a window.
ratelimit-remaining
How many requests you have left within the current window.
ratelimit-reset
How many seconds until the limits are reset.
retry-after
How many seconds you should wait before making a follow-up request.

The default maximum rate limit is 2 requests per second. This number can be increased for trusted senders upon request.
After that, you’ll hit the rate limit and receive a 429 response error code. You can find all 429 responses by filtering for 429 at the Resend Logs page.
To prevent this, we recommend reducing the rate at which you request the API. This can be done by introducing a queue mechanism or reducing the number of concurrent requests per second. If you have specific requirements, contact support to request a rate increase.

Email
Send Email
Start sending emails through the Resend Email API.
POST
/
emails
​# Send Email

> Start sending emails through the Resend Email API.

## Body Parameters

<ParamField body="from" type="string" required>
  Sender email address.

  To include a friendly name, use the format `"Your Name <sender@domain.com>"`.
</ParamField>

<ParamField body="to" type="string | string[]" required>
  Recipient email address. For multiple addresses, send as an array of strings.
  Max 50.
</ParamField>

<ParamField body="subject" type="string" required>
  Email subject.
</ParamField>

<ParamField body="bcc" type="string | string[]">
  Bcc recipient email address. For multiple addresses, send as an array of
  strings.
</ParamField>

<ParamField body="cc" type="string | string[]">
  Cc recipient email address. For multiple addresses, send as an array of
  strings.
</ParamField>

<ParamField body="scheduled_at" type="string">
  Schedule email to be sent later. The date should be in natural language (e.g.: `in 1 min`) or ISO 8601 format (e.g:
  `2024-08-05T11:52:01.858Z`).

  [See examples](/dashboard/emails/schedule-email)
</ParamField>

<ParamField body="reply_to" type="string | string[]">
  Reply-to email address. For multiple addresses, send as an array of strings.
</ParamField>

<ParamField body="html" type="string">
  The HTML version of the message.
</ParamField>

<ParamField body="text" type="string">
  The plain text version of the message.
</ParamField>

<ParamField body="react" type="React.ReactNode">
  The React component used to write the message. *Only available in the Node.js
  SDK.*
</ParamField>

<ParamField body="headers" type="object">
  Custom headers to add to the email.
</ParamField>

<ParamField body="attachments" type="array">
  Filename and content of attachments (max 40MB per email, after Base64 encoding of the attachments).

  [See examples](/dashboard/emails/attachments)

  <Expandable defaultOpen="true" title="properties">
    <ParamField body="content" type="buffer | string">
      Content of an attached file, passed as a buffer or Base64 string.
    </ParamField>

    <ParamField body="filename" type="string">
      Name of attached file.
    </ParamField>

    <ParamField body="path" type="string">
      Path where the attachment file is hosted
    </ParamField>

    <ParamField body="content_type" type="string">
      Content type for the attachment, if not set will be derived from the filename property
    </ParamField>
  </Expandable>
</ParamField>

<ParamField body="tags" type="array">
  Custom data passed in key/value pairs.

  [See examples](/dashboard/emails/tags).

  <Expandable defaultOpen="true" title="properties">
    <ParamField body="name" type="string" required>
      The name of the email tag.

      It can only contain ASCII letters (a–z, A–Z), numbers (0–9), underscores (\_), or dashes (-).

      It can contain no more than 256 characters.
    </ParamField>

    <ParamField body="value" type="string" required>
      The value of the email tag.

      It can only contain ASCII letters (a–z, A–Z), numbers (0–9), underscores (\_), or dashes (-).

      It can contain no more than 256 characters.
    </ParamField>
  </Expandable>
</ParamField>

## Headers

<ParamField header="Idempotency-Key" type="string">
  Add an idempotency key to prevent duplicated emails.

  * Should be **unique per API request**
  * Idempotency keys expire after **24 hours**
  * Have a maximum length of **256 characters**

  [Learn more](/dashboard/emails/idempotency-keys)
</ParamField>

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['delivered@resend.dev'],
    subject: 'hello world',
    html: '<p>it works!</p>',
  });
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->emails->send([
    'from' => 'Acme <onboarding@resend.dev>',
    'to' => ['delivered@resend.dev'],
    'subject' => 'hello world',
    'html' => '<p>it works!</p>'
  ]);
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"

  params: resend.Emails.SendParams = {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "hello world",
    "html": "<p>it works!</p>"
  }

  email = resend.Emails.send(params)
  print(email)
  ```

  ```rb Ruby
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  params = {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "hello world",
    "html": "<p>it works!</p>"
  }

  sent = Resend::Emails.send(params)
  puts sent
  ```

  ```go Go
  import (
  	"fmt"

  	"github.com/resend/resend-go/v2"
  )

  func main() {
    ctx := context.TODO()
    client := resend.NewClient("re_xxxxxxxxx")

    params := &resend.SendEmailRequest{
        From:        "Acme <onboarding@resend.dev>",
        To:          []string{"delivered@resend.dev"},
        Subject:     "hello world",
        Html:        "<p>it works!</p>"
    }

    sent, err := client.Emails.SendWithContext(ctx, params)

    if err != nil {
      panic(err)
    }
    fmt.Println(sent.Id)
  }
  ```

  ```rust Rust
  use resend_rs::types::{CreateEmailBaseOptions};
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let from = "Acme <onboarding@resend.dev>";
    let to = ["delivered@resend.dev"];
    let subject = "hello world";
    let html = "<p>it works!</p>";

    let email = CreateEmailBaseOptions::new(from, to, subject)
      .with_html(html);

    let _email = resend.emails.send(email).await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          CreateEmailOptions params = CreateEmailOptions.builder()
                  .from("Acme <onboarding@resend.dev>")
                  .to("delivered@resend.dev")
                  .subject("hello world")
                  .html("<p>it works!</p>")
                  .build();

          CreateEmailResponse data = resend.emails().send(params);
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.EmailSendAsync( new EmailMessage()
  {
      From = "Acme <onboarding@resend.dev>",
      To = "delivered@resend.dev",
      Subject = "hello world",
      HtmlBody = "<p>it works!</p>",
  } );
  Console.WriteLine( "Email Id={0}", resp.Content );
  ```

  ```bash cURL
  curl -X POST 'https://api.resend.com/emails' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "hello world",
    "html": "<p>it works!</p>"
  }'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
  }
  ```
</ResponseExample>


Body Parameters
​
from
stringrequired
Sender email address.
To include a friendly name, use the format "Your Name <sender@domain.com>".
​
to
string | string[]required
Recipient email address. For multiple addresses, send as an array of strings. Max 50.
​
subject
stringrequired
Email subject.
​
bcc
string | string[]
Bcc recipient email address. For multiple addresses, send as an array of strings.
​
cc
string | string[]
Cc recipient email address. For multiple addresses, send as an array of strings.
​
scheduled_at
string
Schedule email to be sent later. The date should be in natural language (e.g.: in 1 min) or ISO 8601 format (e.g: 2024-08-05T11:52:01.858Z).
See examples
​
reply_to
string | string[]
Reply-to email address. For multiple addresses, send as an array of strings.
​
html
string
The HTML version of the message.
​
text
string
The plain text version of the message.
​
react
React.ReactNode
The React component used to write the message. Only available in the Node.js SDK.
​
headers
object
Custom headers to add to the email.
​
attachments
array
Filename and content of attachments (max 40MB per email, after Base64 encoding of the attachments).
See examples
Hide properties
​
content
buffer | string
Content of an attached file, passed as a buffer or Base64 string.
​
filename
string
Name of attached file.
​
path
string
Path where the attachment file is hosted
​
content_type
string
Content type for the attachment, if not set will be derived from the filename property
​
tags
array
Custom data passed in key/value pairs.
See examples.
Hide properties
​
name
stringrequired
The name of the email tag.
It can only contain ASCII letters (a–z, A–Z), numbers (0–9), underscores (_), or dashes (-).
It can contain no more than 256 characters.
​
value
stringrequired
The value of the email tag.
It can only contain ASCII letters (a–z, A–Z), numbers (0–9), underscores (_), or dashes (-).
It can contain no more than 256 characters.
​
Headers
​
Idempotency-Key
string
Add an idempotency key to prevent duplicated emails.
Should be unique per API request
Idempotency keys expire after 24 hours
Have a maximum length of 256 characters
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

await resend.emails.send({
  from: 'Acme <onboarding@resend.dev>',
  to: ['delivered@resend.dev'],
  subject: 'hello world',
  html: '<p>it works!</p>',
});
{
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}


import resend

resend.api_key = "re_xxxxxxxxx"

params: resend.Emails.SendParams = {
  "from": "Acme <onboarding@resend.dev>",
  "to": ["delivered@resend.dev"],
  "subject": "hello world",
  "html": "<p>it works!</p>"
}

email = resend.Emails.send(params)
print(email)

Response

  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}



# Send Email

> Start sending emails through the Resend Email API.

## Body Parameters

<ParamField body="from" type="string" required>
  Sender email address.

  To include a friendly name, use the format `"Your Name <sender@domain.com>"`.
</ParamField>

<ParamField body="to" type="string | string[]" required>
  Recipient email address. For multiple addresses, send as an array of strings.
  Max 50.
</ParamField>

<ParamField body="subject" type="string" required>
  Email subject.
</ParamField>

<ParamField body="bcc" type="string | string[]">
  Bcc recipient email address. For multiple addresses, send as an array of
  strings.
</ParamField>

<ParamField body="cc" type="string | string[]">
  Cc recipient email address. For multiple addresses, send as an array of
  strings.
</ParamField>

<ParamField body="scheduled_at" type="string">
  Schedule email to be sent later. The date should be in natural language (e.g.: `in 1 min`) or ISO 8601 format (e.g:
  `2024-08-05T11:52:01.858Z`).

  [See examples](/dashboard/emails/schedule-email)
</ParamField>

<ParamField body="reply_to" type="string | string[]">
  Reply-to email address. For multiple addresses, send as an array of strings.
</ParamField>

<ParamField body="html" type="string">
  The HTML version of the message.
</ParamField>

<ParamField body="text" type="string">
  The plain text version of the message.
</ParamField>

<ParamField body="react" type="React.ReactNode">
  The React component used to write the message. *Only available in the Node.js
  SDK.*
</ParamField>

<ParamField body="headers" type="object">
  Custom headers to add to the email.
</ParamField>

<ParamField body="attachments" type="array">
  Filename and content of attachments (max 40MB per email, after Base64 encoding of the attachments).

  [See examples](/dashboard/emails/attachments)

  <Expandable defaultOpen="true" title="properties">
    <ParamField body="content" type="buffer | string">
      Content of an attached file, passed as a buffer or Base64 string.
    </ParamField>

    <ParamField body="filename" type="string">
      Name of attached file.
    </ParamField>

    <ParamField body="path" type="string">
      Path where the attachment file is hosted
    </ParamField>

    <ParamField body="content_type" type="string">
      Content type for the attachment, if not set will be derived from the filename property
    </ParamField>
  </Expandable>
</ParamField>

<ParamField body="tags" type="array">
  Custom data passed in key/value pairs.

  [See examples](/dashboard/emails/tags).

  <Expandable defaultOpen="true" title="properties">
    <ParamField body="name" type="string" required>
      The name of the email tag.

      It can only contain ASCII letters (a–z, A–Z), numbers (0–9), underscores (\_), or dashes (-).

      It can contain no more than 256 characters.
    </ParamField>

    <ParamField body="value" type="string" required>
      The value of the email tag.

      It can only contain ASCII letters (a–z, A–Z), numbers (0–9), underscores (\_), or dashes (-).

      It can contain no more than 256 characters.
    </ParamField>
  </Expandable>
</ParamField>

## Headers

<ParamField header="Idempotency-Key" type="string">
  Add an idempotency key to prevent duplicated emails.

  * Should be **unique per API request**
  * Idempotency keys expire after **24 hours**
  * Have a maximum length of **256 characters**

  [Learn more](/dashboard/emails/idempotency-keys)
</ParamField>

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['delivered@resend.dev'],
    subject: 'hello world',
    html: '<p>it works!</p>',
  });
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->emails->send([
    'from' => 'Acme <onboarding@resend.dev>',
    'to' => ['delivered@resend.dev'],
    'subject' => 'hello world',
    'html' => '<p>it works!</p>'
  ]);
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"

  params: resend.Emails.SendParams = {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "hello world",
    "html": "<p>it works!</p>"
  }

  email = resend.Emails.send(params)
  print(email)
  ```

  ```rb Ruby
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  params = {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "hello world",
    "html": "<p>it works!</p>"
  }

  sent = Resend::Emails.send(params)
  puts sent
  ```

  ```go Go
  import (
  	"fmt"

  	"github.com/resend/resend-go/v2"
  )

  func main() {
    ctx := context.TODO()
    client := resend.NewClient("re_xxxxxxxxx")

    params := &resend.SendEmailRequest{
        From:        "Acme <onboarding@resend.dev>",
        To:          []string{"delivered@resend.dev"},
        Subject:     "hello world",
        Html:        "<p>it works!</p>"
    }

    sent, err := client.Emails.SendWithContext(ctx, params)

    if err != nil {
      panic(err)
    }
    fmt.Println(sent.Id)
  }
  ```

  ```rust Rust
  use resend_rs::types::{CreateEmailBaseOptions};
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let from = "Acme <onboarding@resend.dev>";
    let to = ["delivered@resend.dev"];
    let subject = "hello world";
    let html = "<p>it works!</p>";

    let email = CreateEmailBaseOptions::new(from, to, subject)
      .with_html(html);

    let _email = resend.emails.send(email).await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          CreateEmailOptions params = CreateEmailOptions.builder()
                  .from("Acme <onboarding@resend.dev>")
                  .to("delivered@resend.dev")
                  .subject("hello world")
                  .html("<p>it works!</p>")
                  .build();

          CreateEmailResponse data = resend.emails().send(params);
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.EmailSendAsync( new EmailMessage()
  {
      From = "Acme <onboarding@resend.dev>",
      To = "delivered@resend.dev",
      Subject = "hello world",
      HtmlBody = "<p>it works!</p>",
  } );
  Console.WriteLine( "Email Id={0}", resp.Content );
  ```

  ```bash cURL
  curl -X POST 'https://api.resend.com/emails' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "hello world",
    "html": "<p>it works!</p>"
  }'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
  }
  ```
</ResponseExample>

Email
Send Batch Emails
Trigger up to 100 batch emails at once.
POST
/
emails
/
batch
Instead of sending one email per HTTP request, we provide a batching endpoint that permits you to send up to 100 emails in a single API call.
​
Body Parameters
​
from
stringrequired
Sender email address.
To include a friendly name, use the format "Your Name <sender@domain.com>".
​
to
string | string[]required
Recipient email address. For multiple addresses, send as an array of strings. Max 50.
​
subject
stringrequired
Email subject.
​
bcc
string | string[]
Bcc recipient email address. For multiple addresses, send as an array of strings.
​
cc
string | string[]
Cc recipient email address. For multiple addresses, send as an array of strings.
​
reply_to
string | string[]
Reply-to email address. For multiple addresses, send as an array of strings.
​
html
string
The HTML version of the message.
​
text
string
The plain text version of the message.
​
react
React.ReactNode
The React component used to write the message. Only available in the Node.js SDK.
​
headers
object
Custom headers to add to the email.
​
Headers
​
Idempotency-Key
string
Add an idempotency key to prevent duplicated emails.
Should be unique per API request
Idempotency keys expire after 24 hours
Have a maximum length of 256 characters
Learn more
​
Limitations
The attachments, tags, and scheduled_at fields are not supported yet.

# Send Batch Emails

> Trigger up to 100 batch emails at once.

Instead of sending one email per HTTP request, we provide a batching endpoint that permits you to send up to 100 emails in a single API call.

## Body Parameters

<ParamField body="from" type="string" required>
  Sender email address.

  To include a friendly name, use the format `"Your Name <sender@domain.com>"`.
</ParamField>

<ParamField body="to" type="string | string[]" required>
  Recipient email address. For multiple addresses, send as an array of strings.
  Max 50.
</ParamField>

<ParamField body="subject" type="string" required>
  Email subject.
</ParamField>

<ParamField body="bcc" type="string | string[]">
  Bcc recipient email address. For multiple addresses, send as an array of
  strings.
</ParamField>

<ParamField body="cc" type="string | string[]">
  Cc recipient email address. For multiple addresses, send as an array of
  strings.
</ParamField>

<ParamField body="reply_to" type="string | string[]">
  Reply-to email address. For multiple addresses, send as an array of strings.
</ParamField>

<ParamField body="html" type="string">
  The HTML version of the message.
</ParamField>

<ParamField body="text" type="string">
  The plain text version of the message.
</ParamField>

<ParamField body="react" type="React.ReactNode">
  The React component used to write the message. *Only available in the Node.js
  SDK.*
</ParamField>

<ParamField body="headers" type="object">
  Custom headers to add to the email.
</ParamField>

## Headers

<ParamField header="Idempotency-Key" type="string">
  Add an idempotency key to prevent duplicated emails.

  * Should be **unique per API request**
  * Idempotency keys expire after **24 hours**
  * Have a maximum length of **256 characters**

  [Learn more](/dashboard/emails/idempotency-keys)
</ParamField>

## Limitations

The `attachments`, `tags`, and `scheduled_at` fields are not supported yet.

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  await resend.batch.send([
    {
      from: 'Acme <onboarding@resend.dev>',
      to: ['foo@gmail.com'],
      subject: 'hello world',
      html: '<h1>it works!</h1>',
    },
    {
      from: 'Acme <onboarding@resend.dev>',
      to: ['bar@outlook.com'],
      subject: 'world hello',
      html: '<p>it works!</p>',
    },
  ]);
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->batch->send([
    [
      'from' => 'Acme <onboarding@resend.dev>',
      'to' => ['foo@gmail.com'],
      'subject' => 'hello world',
      'html' => '<h1>it works!</h1>',
    ],
    [
      'from' => 'Acme <onboarding@resend.dev>',
      'to' => ['bar@outlook.com'],
      'subject' => 'world hello',
      'html' => '<p>it works!</p>',
    ]
  ]);
  ```

  ```py Python
  import resend
  from typing import List

  resend.api_key = "re_xxxxxxxxx"

  params: List[resend.Emails.SendParams] = [
    {
      "from": "Acme <onboarding@resend.dev>",
      "to": ["foo@gmail.com"],
      "subject": "hello world",
      "html": "<h1>it works!</h1>",
    },
    {
      "from": "Acme <onboarding@resend.dev>",
      "to": ["bar@outlook.com"],
      "subject": "world hello",
      "html": "<p>it works!</p>",
    }
  ]

  resend.Batch.send(params)
  ```

  ```rb Ruby
  require "resend"

  Resend.api_key = 're_xxxxxxxxx'

  params = [
    {
      "from": "Acme <onboarding@resend.dev>",
      "to": ["foo@gmail.com"],
      "subject": "hello world",
      "html": "<h1>it works!</h1>",
    },
    {
      "from": "Acme <onboarding@resend.dev>",
      "to": ["bar@outlook.com"],
      "subject": "world hello",
      "html": "<p>it works!</p>",
    }
  ]

  Resend::Batch.send(params)
  ```

  ```go Go
  package examples

  import (
  	"fmt"
  	"os"

  	"github.com/resend/resend-go/v2"
  )

  func main() {

    ctx := context.TODO()

    client := resend.NewClient("re_xxxxxxxxx")

    var batchEmails = []*resend.SendEmailRequest{
      {
        From:    "Acme <onboarding@resend.dev>",
        To:      []string{"foo@gmail.com"},
        Subject: "hello world",
        Html:    "<h1>it works!</h1>",
      },
      {
        From:    "Acme <onboarding@resend.dev>",
        To:      []string{"bar@outlook.com"},
        Subject: "world hello",
        Html:    "<p>it works!</p>",
      },
    }

    sent, err := client.Batch.SendWithContext(ctx, batchEmails)

    if err != nil {
      panic(err)
    }
    fmt.Println(sent.Data)
  }
  ```

  ```rust Rust
  use resend_rs::types::CreateEmailBaseOptions;
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let emails = vec![
      CreateEmailBaseOptions::new(
        "Acme <onboarding@resend.dev>",
        vec!["foo@gmail.com"],
        "hello world",
      )
      .with_html("<h1>it works!</h1>"),
      CreateEmailBaseOptions::new(
        "Acme <onboarding@resend.dev>",
        vec!["bar@outlook.com"],
        "world hello",
      )
      .with_html("<p>it works!</p>"),
    ];

    let _emails = resend.batch.send(emails).await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          CreateEmailOptions firstEmail = CreateEmailOptions.builder()
              .from("Acme <onboarding@resend.dev>")
              .to("foo@gmail.com")
              .subject("hello world")
              .html("<h1>it works!</h1>")
              .build();

          CreateEmailOptions secondEmail = CreateEmailOptions.builder()
              .from("Acme <onboarding@resend.dev>")
              .to("bar@outlook.com")
              .subject("world hello")
              .html("<p>it works!</p>")
              .build();

          CreateBatchEmailsResponse data = resend.batch().send(
              Arrays.asList(firstEmail, secondEmail)
          );
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var mail1 = new EmailMessage()
  {
      From = "Acme <onboarding@resend.dev>",
      To = "foo@gmail.com",
      Subject = "hello world",
      HtmlBody = "<p>it works!</p>",
  };

  var mail2 = new EmailMessage()
  {
      From = "Acme <onboarding@resend.dev>",
      To = "bar@outlook.com",
      Subject = "hello world",
      HtmlBody = "<p>it works!</p>",
  };

  var resp = await resend.EmailBatchAsync( [ mail1, mail2 ] );
  Console.WriteLine( "Nr Emails={0}", resp.Content.Count );
  ```

  ```bash cURL
  curl -X POST 'https://api.resend.com/emails/batch' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'[
    {
      "from": "Acme <onboarding@resend.dev>",
      "to": ["foo@gmail.com"],
      "subject": "hello world",
      "html": "<h1>it works!</h1>"
    },
    {
      "from": "Acme <onboarding@resend.dev>",
      "to": ["bar@outlook.com"],
      "subject": "world hello",
      "html": "<p>it works!</p>"
    }
  ]'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "data": [
      {
        "id": "ae2014de-c168-4c61-8267-70d2662a1ce1"
      },
      {
        "id": "faccb7a5-8a28-4e9a-ac64-8da1cc3bc1cb"
      }
    ]
  }
  ```
</ResponseExample>




import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

await resend.batch.send([
  {
    from: 'Acme <onboarding@resend.dev>',
    to: ['foo@gmail.com'],
    subject: 'hello world',
    html: '<h1>it works!</h1>',
  },
  {
    from: 'Acme <onboarding@resend.dev>',
    to: ['bar@outlook.com'],
    subject: 'world hello',
    html: '<p>it works!</p>',
  },
]);

Response

{
  "data": [
    {
      "id": "ae2014de-c168-4c61-8267-70d2662a1ce1"
    },
    {
      "id": "faccb7a5-8a28-4e9a-ac64-8da1cc3bc1cb"
    }
  ]
}


# Retrieve Email

> Retrieve a single email.

## Path Parameters

<ParamField path="id" type="string" required>
  The Email ID.
</ParamField>

<Info>
  See all available `last_event` types in [the Email Events



  Overview]

# Retrieve Email

> Retrieve a single email.

## Path Parameters

<ParamField path="id" type="string" required>
  The Email ID.
</ParamField>

<Info>
  See all available `last_event` types in [the Email Events
  overview](/dashboard/emails/introduction#understand-email-events).
</Info>

<RequestExample>
  ```js Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  resend.emails.get('37e4414c-5e25-4dbc-a071-43552a4bd53b');
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->emails->get('37e4414c-5e25-4dbc-a071-43552a4bd53b');
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"
  resend.Emails.get(email_id="4ef9a417-02e9-4d39-ad75-9611e0fcc33c")
  ```

  ```ruby Ruby
  Resend.api_key = "re_xxxxxxxxx"
  email = Resend::Emails.get("4ef9a417-02e9-4d39-ad75-9611e0fcc33c")
  puts email
  ```

  ```go Go
  import "github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  email, err := client.Emails.Get("4ef9a417-02e9-4d39-ad75-9611e0fcc33c")
  ```

  ```rust Rust
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let _email = resend
      .emails
      .get("4ef9a417-02e9-4d39-ad75-9611e0fcc33c")
      .await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          Email email = resend.emails().get("4ef9a417-02e9-4d39-ad75-9611e0fcc33c");
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.EmailRetrieveAsync( new Guid( "4ef9a417-02e9-4d39-ad75-9611e0fcc33c" ) );
  Console.WriteLine( "Subject={0}", resp.Content.Subject );
  ```

  ```bash cURL
  curl -X GET 'https://api.resend.com/emails/4ef9a417-02e9-4d39-ad75-9611e0fcc33c' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "object": "email",
    "id": "4ef9a417-02e9-4d39-ad75-9611e0fcc33c",
    "to": ["delivered@resend.dev"],
    "from": "Acme <onboarding@resend.dev>",
    "created_at": "2023-04-03T22:13:42.674981+00:00",
    "subject": "Hello World",
    "html": "Congrats on sending your <strong>first email</strong>!",
    "text": null,
    "bcc": [null],
    "cc": [null],
    "reply_to": [null],
    "last_event": "delivered"
  }
  ```
</ResponseExample>


(/dashboard/emails/introduction#understand-email-events).
</Info>

<RequestExample>
  ```js Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  resend.emails.get('37e4414c-5e25-4dbc-a071-43552a4bd53b');
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->emails->get('37e4414c-5e25-4dbc-a071-43552a4bd53b');
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"
  resend.Emails.get(email_id="4ef9a417-02e9-4d39-ad75-9611e0fcc33c")
  ```

  ```ruby Ruby
  Resend.api_key = "re_xxxxxxxxx"
  email = Resend::Emails.get("4ef9a417-02e9-4d39-ad75-9611e0fcc33c")
  puts email
  ```

  ```go Go
  import "github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  email, err := client.Emails.Get("4ef9a417-02e9-4d39-ad75-9611e0fcc33c")
  ```

  ```rust Rust
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let _email = resend
      .emails
      .get("4ef9a417-02e9-4d39-ad75-9611e0fcc33c")
      .await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          Email email = resend.emails().get("4ef9a417-02e9-4d39-ad75-9611e0fcc33c");
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.EmailRetrieveAsync( new Guid( "4ef9a417-02e9-4d39-ad75-9611e0fcc33c" ) );
  Console.WriteLine( "Subject={0}", resp.Content.Subject );
  ```

  ```bash cURL
  curl -X GET 'https://api.resend.com/emails/4ef9a417-02e9-4d39-ad75-9611e0fcc33c' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "object": "email",
    "id": "4ef9a417-02e9-4d39-ad75-9611e0fcc33c",
    "to": ["delivered@resend.dev"],
    "from": "Acme <onboarding@resend.dev>",
    "created_at": "2023-04-03T22:13:42.674981+00:00",
    "subject": "Hello World",
    "html": "Congrats on sending your <strong>first email</strong>!",
    "text": null,
    "bcc": [null],
    "cc": [null],
    "reply_to": [null],
    "last_event": "delivered"
  }
  ```
</ResponseExample>

Retrieve Email
Retrieve a single email.
GET
/
emails
/
:id
​
Path Parameters
​
id
stringrequired
The Email ID.
See all available last_event types in the Email Events overview.

Update Email
Update a scheduled email.
PATCH
/
emails
/
:id
​
Path Parameters
​
id
stringrequired
The Email ID.
​
Body Parameters
​
scheduled_at
string
Schedule email to be sent later. The date should be in ISO 8601 format (e.g: 2024-08-05T11:52:01.858Z).
# Update Email

> Update a scheduled email.

## Path Parameters

<ParamField path="id" type="string" required>
  The Email ID.
</ParamField>

## Body Parameters

<ParamField body="scheduled_at" type="string">
  Schedule email to be sent later. The date should be in ISO 8601 format (e.g:
  2024-08-05T11:52:01.858Z).
</ParamField>

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  const oneMinuteFromNow = new Date(Date.now() + 1000 * 60).toISOString();

  resend.emails.update({
    id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
    scheduledAt: oneMinuteFromNow,
  });
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $oneMinuteFromNow = (new DateTime())->modify('+1 minute')->format(DateTime::ISO8601);

  $resend->emails->update('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794', [
    'scheduled_at' => $oneMinuteFromNow
  ]);
  ```

  ```python Python
  import resend
  from datetime import datetime, timedelta

  resend.api_key = "re_xxxxxxxxx"

  one_minute_from_now = (datetime.now() + timedelta(minutes=1)).isoformat()

  update_params: resend.Emails.UpdateParams = {
    "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",
    "scheduled_at": one_minute_from_now
  }

  resend.Emails.update(params=update_params)
  ```

  ```ruby Ruby
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  one_minute_from_now = (Time.now + 1 * 60).strftime("%Y-%m-%dT%H:%M:%S.%L%z")

  update_params = {
    "email_id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",
    "scheduled_at": one_minute_from_now
  }

  Resend::Emails.update(update_params)
  ```

  ```go Go
  import "github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  oneMinuteFromNow := time.Now().Add(time.Minute * time.Duration(1))
  oneMinuteFromNowISO := oneMinuteFromNow.Format("2006-01-02T15:04:05-0700")

  updateParams := &resend.UpdateEmailRequest{
    Id:          "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",
    ScheduledAt: oneMinuteFromNowISO
  }

  updatedEmail, err := client.Emails.Update(updateParams)

  if err != nil {
    panic(err)
  }
  fmt.Printf("%v\n", updatedEmail)
  ```

  ```rust Rust
  use chrono::{Local, TimeDelta};
  use resend_rs::types::UpdateEmailOptions;
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let one_minute_from_now = Local::now()
      .checked_add_signed(TimeDelta::minutes(1))
      .unwrap()
      .to_rfc3339();

    let update = UpdateEmailOptions::new()
      .with_scheduled_at(&one_minute_from_now);

    let _email = resend
      .emails
      .update("49a3999c-0ce1-4ea6-ab68-afcd6dc2e794", update)
      .await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          String oneMinuteFromNow = Instant
            .now()
            .plus(1, ChronoUnit.MINUTES)
            .toString();

          UpdateEmailOptions updateParams = UpdateEmailOptions.builder()
                  .scheduledAt(oneMinuteFromNow)
                  .build();

          UpdateEmailResponse data = resend.emails().update("49a3999c-0ce1-4ea6-ab68-afcd6dc2e794", updateParams);
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  await resend.EmailRescheduleAsync(
      new Guid( "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" ),
      DateTime.UtcNow.AddMinutes( 1 ) );
  ```

  ```bash cURL
  curl -X PATCH 'https://api.resend.com/emails/49a3999c-0ce1-4ea6-ab68-afcd6dc2e794' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "scheduled_at": "2024-08-05T11:52:01.858Z"
  }'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "object": "email",
    "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
  }
  ```
</ResponseExample>


Cancel Email
Cancel a scheduled email.
POST
/
emails
/
:id
/
cancel
​
Path Parameters
​
id
stringrequired
The Email ID.
Was this page helpful?
Yes

Cancel Email
Cancel a scheduled email.
POST
/
emails
/
:id
/
cancel
​
Path Parameters
​
id
stringrequired
The Email ID.
Was this page helpful?
Yes


Create Domain
Create a domain through the Resend Email API.
POST
/
domains
​
Body Parameters
​
name
stringrequired
The name of the domain you want to create.
​
region
stringdefault:"us-east-1"
The region where emails will be sent from. Possible values: 'us-east-1' | 'eu-west-1' | 'sa-east-1' | 'ap-northeast-1'
​
custom_return_path
stringdefault:"send"
For advanced use cases, choose a subdomain for the Return-Path address. The custom return path is used for SPF authentication, DMARC alignment, and handling bounced emails. Defaults to send (i.e., send.yourdomain.tld). Avoid setting values that could undermine credibility (e.g. testing), as they may be exposed to recipients.
Learn more about custom return paths.
# Create Domain

> Create a domain through the Resend Email API.

## Body Parameters

<ParamField body="name" type="string" required>
  The name of the domain you want to create.
</ParamField>

<ParamField body="region" type="string" default="us-east-1">
  The region where emails will be sent from. Possible values: `'us-east-1' |
    'eu-west-1' | 'sa-east-1' | 'ap-northeast-1'`
</ParamField>

<ParamField body="custom_return_path" type="string" default="send">
  For advanced use cases, choose a subdomain for the Return-Path address. The
  custom return path is used for SPF authentication, DMARC alignment, and
  handling bounced emails. Defaults to `send` (i.e., `send.yourdomain.tld`). Avoid
  setting values that could undermine credibility (e.g. `testing`), as they may
  be exposed to recipients.

  Learn more about [custom return paths](/dashboard/domains/introduction#custom-return-path).
</ParamField>

<Info>
  See all available `status` types in [the Domains
  overview](/dashboard/domains/introduction#understand-a-domain-status).
</Info>

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  resend.domains.create({ name: 'example.com' });
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->domains->create([
    'name' => 'example.com'
  ]);
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"

  params: resend.Domains.CreateParams = {
    "name": "example.com",
  }

  resend.Domains.create(params)
  ```

  ```ruby Ruby
  Resend.api_key = ENV["RESEND_API_KEY"]

  params = {
    name: "example.com",
  }
  domain = Resend::Domains.create(params)
  puts domain
  ```

  ```go Go
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  params := &resend.CreateDomainRequest{
      Name: "example.com",
  }

  domain, err := client.Domains.Create(params)
  ```

  ```rust Rust
  use resend_rs::{types::CreateDomainOptions, Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let _domain = resend
      .domains
      .add(CreateDomainOptions::new("example.com"))
      .await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          CreateDomainOptions params = CreateDomainOptions
                  .builder()
                  .name("example.com").build();

          CreateDomainResponse domain = resend.domains().create(params);
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.DomainAddAsync( "example.com" );
  Console.WriteLine( "Domain Id={0}", resp.Content.Id );
  ```

  ```bash cURL
  curl -X POST 'https://api.resend.com/domains' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "name": "example.com"
  }'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "id": "4dd369bc-aa82-4ff3-97de-514ae3000ee0",
    "name": "example.com",
    "created_at": "2023-03-28T17:12:02.059593+00:00",
    "status": "not_started",
    "records": [
      {
        "record": "SPF",
        "name": "send",
        "type": "MX",
        "ttl": "Auto",
        "status": "not_started",
        "value": "feedback-smtp.us-east-1.amazonses.com",
        "priority": 10
      },
      {
        "record": "SPF",
        "name": "send",
        "value": "\"v=spf1 include:amazonses.com ~all\"",
        "type": "TXT",
        "ttl": "Auto",
        "status": "not_started"
      },
      {
        "record": "DKIM",
        "name": "nhapbbryle57yxg3fbjytyodgbt2kyyg._domainkey",
        "value": "nhapbbryle57yxg3fbjytyodgbt2kyyg.dkim.amazonses.com.",
        "type": "CNAME",
        "status": "not_started",
        "ttl": "Auto"
      },
      {
        "record": "DKIM",
        "name": "xbakwbe5fcscrhzshpap6kbxesf6pfgn._domainkey",
        "value": "xbakwbe5fcscrhzshpap6kbxesf6pfgn.dkim.amazonses.com.",
        "type": "CNAME",
        "status": "not_started",
        "ttl": "Auto"
      },
      {
        "record": "DKIM",
        "name": "txrcreso3dqbvcve45tqyosxwaegvhgn._domainkey",
        "value": "txrcreso3dqbvcve45tqyosxwaegvhgn.dkim.amazonses.com.",
        "type": "CNAME",
        "status": "not_started",
        "ttl": "Auto"
      }
    ],
    "region": "us-east-1"
  }
  ```
</ResponseExample>

Domains
Retrieve Domain
Retrieve a single domain for the authenticated user.
GET
/
domains
/
:domain_id
​
Path Parameters
​
domain_id
stringrequired
The Domain ID.
See all available status types in the Domains overview.
# Retrieve Domain

> Retrieve a single domain for the authenticated user.

## Path Parameters

<ParamField path="domain_id" type="string" required>
  The Domain ID.
</ParamField>

<Info>
  See all available `status` types in [the Domains
  overview](/dashboard/domains/introduction#understand-a-domain-status).
</Info>

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  resend.domains.get('d91cd9bd-1176-453e-8fc1-35364d380206');
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->domains->get('d91cd9bd-1176-453e-8fc1-35364d380206');
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"

  resend.Domains.get(domain_id="d91cd9bd-1176-453e-8fc1-35364d380206")
  ```

  ```ruby Ruby
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  Resend::Domains.get "d91cd9bd-1176-453e-8fc1-35364d380206"
  ```

  ```go Go
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  retrievedDomain, err := client.Domains.Get("d91cd9bd-1176-453e-8fc1-35364d380206")
  ```

  ```rust Rust
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let _domain = resend
      .domains
      .get("d91cd9bd-1176-453e-8fc1-35364d380206")
      .await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          Domain domain = resend.domains().get("d91cd9bd-1176-453e-8fc1-35364d380206");
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.DomainRetrieveAsync( new Guid( "d91cd9bd-1176-453e-8fc1-35364d380206" ) );
  Console.WriteLine( "Domain Id={0}", resp.Content.Name );
  ```

  ```bash cURL
  curl -X GET 'https://api.resend.com/domains/d91cd9bd-1176-453e-8fc1-35364d380206' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "object": "domain",
    "id": "d91cd9bd-1176-453e-8fc1-35364d380206",
    "name": "example.com",
    "status": "not_started",
    "created_at": "2023-04-26T20:21:26.347412+00:00",
    "region": "us-east-1",
    "records": [
      {
        "record": "SPF",
        "name": "send",
        "type": "MX",
        "ttl": "Auto",
        "status": "not_started",
        "value": "feedback-smtp.us-east-1.amazonses.com",
        "priority": 10
      },
      {
        "record": "SPF",
        "name": "send",
        "value": "\"v=spf1 include:amazonses.com ~all\"",
        "type": "TXT",
        "ttl": "Auto",
        "status": "not_started"
      },
      {
        "record": "DKIM",
        "name": "resend._domainkey",
        "value": "p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDsc4Lh8xilsngyKEgN2S84+21gn+x6SEXtjWvPiAAmnmggr5FWG42WnqczpzQ/mNblqHz4CDwUum6LtY6SdoOlDmrhvp5khA3cd661W9FlK3yp7+jVACQElS7d9O6jv8VsBbVg4COess3gyLE5RyxqF1vYsrEXqyM8TBz1n5AGkQIDAQA2",
        "type": "TXT",
        "status": "not_started",
        "ttl": "Auto"
      }
    ]
  }
  ```
</ResponseExample>

Verify Domain
Verify an existing domain.
POST
/
domains
/
:domain_id
/
verify
​
Path Parameters
​
domain_id
stringrequired
The Domain ID.
# Verify Domain

> Verify an existing domain.

## Path Parameters

<ParamField path="domain_id" type="string" required>
  The Domain ID.
</ParamField>

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  resend.domains.verify('d91cd9bd-1176-453e-8fc1-35364d380206');
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->domains->verify('d91cd9bd-1176-453e-8fc1-35364d380206');
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"
  resend.Domains.verify(domain_id="d91cd9bd-1176-453e-8fc1-35364d380206")
  ```

  ```ruby Ruby
  Resend.api_key = ENV["RESEND_API_KEY"]
  Resend::Domains.verify("d91cd9bd-1176-453e-8fc1-35364d380206")
  ```

  ```go Go
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  verified, err := client.Domains.Verify("d91cd9bd-1176-453e-8fc1-35364d380206")
  ```

  ```rust Rust
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    resend
      .domains
      .verify("d91cd9bd-1176-453e-8fc1-35364d380206")
      .await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          VerifyDomainResponse verified = resend.domains().verify("d91cd9bd-1176-453e-8fc1-35364d380206");
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.DomainVerifyAsync( new Guid( "d91cd9bd-1176-453e-8fc1-35364d380206" ) );
  ```

  ```bash cURL
  curl -X POST 'https://api.resend.com/domains/d91cd9bd-1176-453e-8fc1-35364d380206/verify' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "object": "domain",
    "id": "d91cd9bd-1176-453e-8fc1-35364d380206"
  }
  ```
</ResponseExample>

Update Domain
Update an existing domain.
PATCH
/
domains
/
:domain_id
​
Path Parameters
​
domain_id
stringrequired
The Domain ID.
​
Body Parameters
​
click_tracking
boolean
Track clicks within the body of each HTML email.
​
open_tracking
boolean
Track the open rate of each email.
​
tls
stringdefault:"opportunistic"
opportunistic: Opportunistic TLS means that it always attempts to make a secure connection to the receiving mail server. If it can’t establish a secure connection, it sends the message unencrypted.
enforced: Enforced TLS on the other hand, requires that the email communication must use TLS no matter what. If the receiving server does not support TLS, the email will not be sent.
Update Domain
Update an existing domain.
PATCH
/
domains
/
:domain_id
​
Path Parameters
​
domain_id
stringrequired
The Domain ID.
​
Body Parameters
​
click_tracking
boolean
Track clicks within the body of each HTML email.
​
open_tracking
boolean
Track the open rate of each email.
​
tls
stringdefault:"opportunistic"
opportunistic: Opportunistic TLS means that it always attempts to make a secure connection to the receiving mail server. If it can’t establish a secure connection, it sends the message unencrypted.
enforced: Enforced TLS on the other hand, requires that the email communication must use TLS no matter what. If the receiving server does not support TLS, the email will not be sent.
List Domains
Retrieve a list of domains for the authenticated user.
GET
/
domains
See all available status types in the Domains overview.

# List Domains

> Retrieve a list of domains for the authenticated user.

<Info>
  See all available `status` types in [the Domains
  overview](/dashboard/domains/introduction#understand-a-domain-status).
</Info>

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  resend.domains.list();
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->domains->list();
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"
  resend.Domains.list()
  ```

  ```ruby Ruby
  Resend.api_key = ENV["RESEND_API_KEY"]
  Resend::Domains.list
  ```

  ```go Go
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  domains, err := client.Domains.List()
  ```

  ```rust Rust
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let _domains = resend
      .domains
      .list()
      .await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          ListDomainsResponse response = resend.domains().list();
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.DomainListAsync();
  Console.WriteLine( "Nr Domains={0}", resp.Content.Count );
  ```

  ```bash cURL
  curl -X GET 'https://api.resend.com/domains' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "data": [
      {
        "id": "d91cd9bd-1176-453e-8fc1-35364d380206",
        "name": "example.com",
        "status": "not_started",
        "created_at": "2023-04-26T20:21:26.347412+00:00",
        "region": "us-east-1"
      }
    ]
  }
  ```
</ResponseExample>

Delete Domain
Remove an existing domain.
DELETE
/
domains
/
:domain_id
​
Path Parameters
​
domain_id
stringrequired
The Domain ID.

# Delete Domain

> Remove an existing domain.

## Path Parameters

<ParamField path="domain_id" type="string" required>
  The Domain ID.
</ParamField>

<RequestExample>
  ```js Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  resend.domains.remove('d91cd9bd-1176-453e-8fc1-35364d380206');
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->domains->remove('d91cd9bd-1176-453e-8fc1-35364d380206');
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"

  resend.Domains.remove(domain_id="d91cd9bd-1176-453e-8fc1-35364d380206")
  ```

  ```ruby Ruby
  Resend.api_key = ENV["RESEND_API_KEY"]
  Resend::Domains.remove("d91cd9bd-1176-453e-8fc1-35364d380206")
  ```

  ```go Go
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  removed, err := client.Domains.Remove("d91cd9bd-1176-453e-8fc1-35364d380206")
  ```

  ```rust Rust
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let _deleted = resend
      .domains
      .delete("d91cd9bd-1176-453e-8fc1-35364d380206")
      .await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          RemoveDomainResponse removed = resend.domains().remove("d91cd9bd-1176-453e-8fc1-35364d380206");
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  await resend.DomainDeleteAsync( new Guid( "d91cd9bd-1176-453e-8fc1-35364d380206" ) );
  ```

  ```bash cURL
  curl -X DELETE 'https://api.resend.com/domains/d91cd9bd-1176-453e-8fc1-35364d380206' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "object": "domain",
    "id": "d91cd9bd-1176-453e-8fc1-35364d380206",
    "deleted": true
  }
  ```
</ResponseExample>

Create API key
Add a new API key to authenticate communications with Resend.
POST
/
api-keys
​
Body Parameters
​
name
stringrequired
The API key name.
​
permission
full_access | sending_access
The API key can have full access to Resend’s API or be only restricted to send emails. * full_access: Can create, delete, get, and update any resource. * sending_access: Can only send emails.
​
domain_id
string
Restrict an API key to send emails only from a specific domain. This is only used when the permission is set to sending_access.
# Create API key

> Add a new API key to authenticate communications with Resend.

## Body Parameters

<ParamField body="name" type="string" required>
  The API key name.
</ParamField>

<ParamField body="permission" type="full_access | sending_access">
  The API key can have full access to Resend's API or be only restricted to send
  emails. \* `full_access`: Can create, delete, get, and update any resource. \*
  `sending_access`: Can only send emails.
</ParamField>

<ParamField body="domain_id" type="string">
  Restrict an API key to send emails only from a specific domain. This is only
  used when the `permission` is set to `sending_access`.
</ParamField>

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  resend.apiKeys.create({ name: 'Production' });
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->apiKeys->create([
    'name' => 'Production'
  ]);
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"

  params: resend.ApiKeys.CreateParams = {
    "name": "Production",
  }

  resend.ApiKeys.create(params)
  ```

  ```ruby Ruby
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  params = {
    name: "Production"
  }
  Resend::ApiKeys.create(params)
  ```

  ```go Go
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")
  params := &resend.CreateApiKeyRequest{
      Name: "Production",
  }
  apiKey, _ := client.ApiKeys.Create(params)
  ```

  ```rust Rust
  use resend_rs::{types::CreateApiKeyOptions, Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let _api_key = resend
      .api_keys
      .create(CreateApiKeyOptions::new("Production"))
      .await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          CreateApiKeyOptions params = CreateApiKeyOptions
                  .builder()
                  .name("Production").build();

          CreateApiKeyResponse apiKey = resend.apiKeys().create(params);
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.ApiKeyCreateAsync( "Production" );
  Console.WriteLine( "Token={0}", resp.Content.Token );
  ```

  ```bash cURL
  curl -X POST 'https://api.resend.com/api-keys' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "name": "Production"
  }'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "id": "dacf4072-4119-4d88-932f-6202748ac7c8",
    "token": "re_c1tpEyD8_NKFusih9vKVQknRAQfmFcWCv"
  }
  ```
</ResponseExample>

API Keys
List API keys
Retrieve a list of API keys for the authenticated user.
GET
/
api-keys

# List API keys

> Retrieve a list of API keys for the authenticated user.

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  resend.apiKeys.list();
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->apiKeys->list();
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"
  resend.ApiKeys.list()
  ```

  ```ruby Ruby
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  Resend::ApiKeys.list
  ```

  ```go Go
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")
  keys, err := client.ApiKeys.List()
  ```

  ```rust Rust
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let _api_keys = resend.api_keys.list().await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          resend.apiKeys().list();
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.ApiKeyListAsync();
  Console.WriteLine( "Nr keys={0}", resp.Content.Count );
  ```

  ```bash cURL
  curl -X GET 'https://api.resend.com/api-keys' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "data": [
      {
        "id": "91f3200a-df72-4654-b0cd-f202395f5354",
        "name": "Production",
        "created_at": "2023-04-08T00:11:13.110779+00:00"
      }
    ]
  }
  ```
</ResponseExample>

API Keys
Delete API key
Remove an existing API key.
DELETE
/
api-keys
/
:api_key_id
​
Path Parameters
​
api_key_id
stringrequired
The API key ID.

# Delete API key

> Remove an existing API key.

## Path Parameters

<ParamField path="api_key_id" type="string" required>
  The API key ID.
</ParamField>

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  resend.apiKeys.remove('b6d24b8e-af0b-4c3c-be0c-359bbd97381e');
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->apiKeys->remove('b6d24b8e-af0b-4c3c-be0c-359bbd97381e');
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"
  resend.ApiKeys.remove(api_key_id="b6d24b8e-af0b-4c3c-be0c-359bbd97381e")
  ```

  ```ruby Ruby
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  Resend::ApiKeys.remove "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
  ```

  ```go Go
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")
  client.ApiKeys.Remove("b6d24b8e-af0b-4c3c-be0c-359bbd97381e")
  ```

  ```rust Rust
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    resend
      .api_keys
      .delete("b6d24b8e-af0b-4c3c-be0c-359bbd97381e")
      .await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          resend.apiKeys().remove("b6d24b8e-af0b-4c3c-be0c-359bbd97381e");
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  await resend.ApiKeyDeleteAsync( new Guid( "b6d24b8e-af0b-4c3c-be0c-359bbd97381e" ) );
  ```

  ```bash cURL
  curl -X DELETE 'https://api.resend.com/api-keys/b6d24b8e-af0b-4c3c-be0c-359bbd97381e' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json'
  ```
</RequestExample>

<ResponseExample>
  ```text Response
  HTTP 200 OK
  ```
</ResponseExample>

Create Broadcast
Create a new broadcast to send to your audience.
POST
/
broadcasts
​
Body Parameters
​
audience_id
stringrequired
The ID of the audience you want to send to.
​
from
stringrequired
Sender email address.
To include a friendly name, use the format "Your Name <sender@domain.com>".
​
subject
stringrequired
Email subject.
​
reply_to
string | string[]
Reply-to email address. For multiple addresses, send as an array of strings.
​
html
string
The HTML version of the message.
​
text
string
The plain text version of the message.
​
react
React.ReactNode
The React component used to write the message. Only available in the Node.js SDK.
​
name
string
The friendly name of the broadcast. Only used for internal reference.
# Create Broadcast

> Create a new broadcast to send to your audience.

## Body Parameters

<ParamField body="audience_id" type="string" required>
  The ID of the audience you want to send to.
</ParamField>

<ParamField body="from" type="string" required>
  Sender email address.

  To include a friendly name, use the format `"Your Name <sender@domain.com>"`.
</ParamField>

<ParamField body="subject" type="string" required>
  Email subject.
</ParamField>

<ParamField body="reply_to" type="string | string[]">
  Reply-to email address. For multiple addresses, send as an array of strings.
</ParamField>

<ParamField body="html" type="string">
  The HTML version of the message.
</ParamField>

<ParamField body="text" type="string">
  The plain text version of the message.
</ParamField>

<ParamField body="react" type="React.ReactNode">
  The React component used to write the message. *Only available in the Node.js
  SDK.*
</ParamField>

<ParamField body="name" type="string">
  The friendly name of the broadcast. Only used for internal reference.
</ParamField>

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  await resend.broadcasts.create({
    audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
    from: 'Acme <onboarding@resend.dev>',
    subject: 'hello world',
    html: 'Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}',
  });
  ```

  ```rust Rust
  use resend_rs::{types::CreateBroadcastOptions, Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let audience_id = "78261eea-8f8b-4381-83c6-79fa7120f1cf";
    let from = "Acme <onboarding@resend.dev>";
    let subject = "hello world";
    let html = "Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}";

    let opts = CreateBroadcastOptions::new(audience_id, from, subject).with_html(html);

    let _broadcast = resend.broadcasts.create(opts).await?;

    Ok(())
  }
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->broadcasts->create([
    'audience_id' => '78261eea-8f8b-4381-83c6-79fa7120f1cf',
    'from' => 'Acme <onboarding@resend.dev>',
    'subject' => 'hello world',
    'html' => 'Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}',
  ]);
  ```

  ```java Java
  Resend resend = new Resend("re_xxxxxxxxx");

  CreateBroadcastOptions params = CreateBroadcastOptions.builder()
      .audienceId("78261eea-8f8b-4381-83c6-79fa7120f1cf")
      .from("Acme <onboarding@resend.dev>")
      .subject("hello world")
      .html("Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}")
      .build();

  CreateBroadcastResponseSuccess data = resend.broadcasts().create(params);
  ```

  ```py Python
  import resend

  resend.api_key = "re_xxxxxxxxx"

  params: resend.Broadcasts.CreateParams = {
    "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
    "from": "Acme <onboarding@resend.dev>",
    "subject": "Hello, world!",
    "html": "Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}",
  }

  resend.Broadcasts.create(params)
  ```

  ```ruby Ruby
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  params = {
    "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
    "from": "Acme <onboarding@resend.dev>",
    "subject": "hello world",
    "html": "Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}",
  }
  Resend::Broadcasts.create(params)
  ```

  ```go Go
  import "fmt"
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  params := &resend.CreateBroadcastRequest{
    AudienceId: "78261eea-8f8b-4381-83c6-79fa7120f1cf",
    From:       "Acme <onboarding@resend.dev>",
    Html:       "Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}",
    Subject:    "Hello, world!",
  }

  broadcast, _ := client.Broadcasts.Create(params)
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.BroadcastAddAsync(
      new BroadcastData()
      {
          DisplayName = "Example Broadcast",
          AudienceId = new Guid( "78261eea-8f8b-4381-83c6-79fa7120f1cf" ),
          From = "Acme <onboarding@resend.dev>",
          Subject = "Hello, world!",
          HtmlBody = "Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}",
      }
  );
  Console.WriteLine( "Broadcast Id={0}", resp.Content );
  ```

  ```bash cURL
  curl -X POST 'https://api.resend.com/broadcasts' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
    "from": "Acme <onboarding@resend.dev>",
    "subject": "hello world",
    "html": "Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}"
  }'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
  }
  ```
</ResponseExample>

Retrieve Broadcast
Retrieve a single broadcast.
GET
/
broadcasts
/
:broadcast_id
You can retrieve broadcasts created via both this API and the Resend dashboard. Note that currently the API does not return the html and text fields for broadcasts.
​
Path Parameters
​
broadcast_id
stringrequired
The broadcast ID.
See all available status types in the Broadcasts overview.
# Retrieve Broadcast

> Retrieve a single broadcast.

You can retrieve broadcasts created via both this API and the Resend dashboard. Note that currently the API does not return the `html` and `text` fields for broadcasts.

## Path Parameters

<ParamField path="broadcast_id" type="string" required>
  The broadcast ID.
</ParamField>

<Info>
  See all available `status` types in [the Broadcasts
  overview](/dashboard/broadcasts/introduction#understand-broadcast-statuses).
</Info>

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  await resend.broadcasts.get('559ac32e-9ef5-46fb-82a1-b76b840c0f7b');
  ```

  ```rust Rust
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let _broadcast = resend
      .broadcasts
      .get("559ac32e-9ef5-46fb-82a1-b76b840c0f7b")
      .await?;

    Ok(())
  }
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->broadcasts->get('559ac32e-9ef5-46fb-82a1-b76b840c0f7b');
  ```

  ```java Java
  Resend resend = new Resend("re_xxxxxxxxx");

  GetBroadcastResponseSuccess data = resend.broadcasts().get("559ac32e-9ef5-46fb-82a1-b76b840c0f7b");
  ```

  ```py Python
  import resend

  resend.api_key = "re_xxxxxxxxx"

  resend.Broadcasts.get(id="559ac32e-9ef5-46fb-82a1-b76b840c0f7b")
  ```

  ```ruby Ruby
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  Resend::Broadcasts.get("559ac32e-9ef5-46fb-82a1-b76b840c0f7b")
  ```

  ```go Go
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  broadcast, _ := client.Broadcasts.Get("559ac32e-9ef5-46fb-82a1-b76b840c0f7b")
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.BroadcastRetrieveAsync( new Guid( "559ac32e-9ef5-46fb-82a1-b76b840c0f7b" ) );
  Console.WriteLine( "Broadcast name={0}", resp.Content.DisplayName );
  ```

  ```bash cURL
  curl -X GET 'https://api.resend.com/broadcasts/559ac32e-9ef5-46fb-82a1-b76b840c0f7b' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "object": "broadcast",
    "id": "559ac32e-9ef5-46fb-82a1-b76b840c0f7b",
    "name": "Announcements",
    "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
    "from": "Acme <onboarding@resend.dev>",
    "subject": "hello world",
    "reply_to": null,
    "preview_text": "Check out our latest announcements",
    "status": "draft",
    "created_at": "2024-12-01T19:32:22.980Z",
    "scheduled_at": null,
    "sent_at": null
  }
  ```
</ResponseExample>

Update Broadcast
Update a broadcast to send to your audience.
PATCH
/
broadcasts
/
:id
You can update broadcasts only if they were created via the API.
​
Path Parameters
​
id
stringrequired
The ID of the broadcast you want to update.
​
Body Parameters
​
audience_id
string
The ID of the audience you want to send to.
​
from
string
Sender email address.
To include a friendly name, use the format "Your Name <sender@domain.com>".
​
subject
string
Email subject.
​
reply_to
string | string[]
Reply-to email address. For multiple addresses, send as an array of strings.
​
html
string
The HTML version of the message.
​
text
string
The plain text version of the message.
​
react
React.ReactNode
The React component used to write the message. Only available in the Node.js SDK.
​
name
string
The friendly name of the broadcast. Only used for internal reference.
# Update Broadcast

> Update a broadcast to send to your audience.

<Note>You can update broadcasts only if they were created via the API.</Note>

## Path Parameters

<ParamField path="id" type="string" required>
  The ID of the broadcast you want to update.
</ParamField>

## Body Parameters

<ParamField body="audience_id" type="string">
  The ID of the audience you want to send to.
</ParamField>

<ParamField body="from" type="string">
  Sender email address.

  To include a friendly name, use the format `"Your Name <sender@domain.com>"`.
</ParamField>

<ParamField body="subject" type="string">
  Email subject.
</ParamField>

<ParamField body="reply_to" type="string | string[]">
  Reply-to email address. For multiple addresses, send as an array of strings.
</ParamField>

<ParamField body="html" type="string">
  The HTML version of the message.
</ParamField>

<ParamField body="text" type="string">
  The plain text version of the message.
</ParamField>

<ParamField body="react" type="React.ReactNode">
  The React component used to write the message. *Only available in the Node.js
  SDK.*
</ParamField>

<ParamField body="name" type="string">
  The friendly name of the broadcast. Only used for internal reference.
</ParamField>

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  await resend.broadcasts.update({
    id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
    html: 'Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}',
  });
  ```

  ```rust Rust
  use resend_rs::{types::UpdateBroadcastOptions, Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let id = "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794";
    let html = "Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}";

    let opts = UpdateBroadcastOptions::new().with_html(html);

    let _broadcast = resend.broadcasts.update(id, opts).await?;

    Ok(())
  }
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->broadcasts->update('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794', [
    'html' => 'Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}',
  ]);
  ```

  ```java Java
  Resend resend = new Resend("re_xxxxxxxxx");

  UpdateBroadcastOptions params = UpdateBroadcastOptions.builder()
      .id("49a3999c-0ce1-4ea6-ab68-afcd6dc2e794")
      .html("Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}")
      .build();

  UpdateBroadcastResponseSuccess data = resend.broadcasts().update(params);
  ```

  ```py Python
  import resend

  resend.api_key = "re_xxxxxxxxx"

  params: resend.Broadcasts.UpdateParams = {
    "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",
    "html": "Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}"
  }

  resend.Broadcasts.update(params)
  ```

  ```ruby Ruby
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  params = {
    "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",
    "html": "Hi #{FIRST_NAME}, you can unsubscribe here: #{RESEND_UNSUBSCRIBE_URL}",
  }
  Resend::Broadcasts.update(params)
  ```

  ```go Go
  import "fmt"
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  params := &resend.UpdateBroadcastRequest{
    Id: "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",
    Html: fmt.Sprintf("Hi %s, you can unsubscribe here: %s", FIRST_NAME, RESEND_UNSUBSCRIBE_URL),
  }

  broadcast, _ := client.Broadcasts.Update(params)
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.BroadcastUpdateAsync(
      new Guid( "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" ),
      new BroadcastUpdateData()
      {
          HtmlBody = "Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}",
      }
  );
  ```

  ```bash cURL
  curl -X PATCH 'https://api.resend.com/broadcasts/49a3999c-0ce1-4ea6-ab68-afcd6dc2e794' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "html": "Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}"
  }'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
  }
  ```
</ResponseExample>

Broadcasts
Send Broadcast
Start sending broadcasts to your audience through the Resend API.
POST
/
broadcasts
/
:broadcast_id
/
send
You can send broadcasts only if they were created via the API.
​
Path Parameters
​
broadcast_id
stringrequired
The broadcast ID.
​
Body Parameters
​
scheduled_at
string
Schedule email to be sent later. The date should be in natural language (e.g.: in 1 min) or ISO 8601 format (e.g: 2024-08-05T11:52:01.858Z).
# Send Broadcast

> Start sending broadcasts to your audience through the Resend API.

<Note>You can send broadcasts only if they were created via the API.</Note>

## Path Parameters

<ParamField path="broadcast_id" type="string" required>
  The broadcast ID.
</ParamField>

## Body Parameters

<ParamField body="scheduled_at" type="string">
  Schedule email to be sent later. The date should be in natural language (e.g.:
  `in 1 min`) or ISO 8601 format (e.g: `2024-08-05T11:52:01.858Z`).
</ParamField>

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  await resend.broadcasts.send('559ac32e-9ef5-46fb-82a1-b76b840c0f7b', {
    scheduledAt: 'in 1 min',
  });
  ```

  ```rust Rust
  use resend_rs::{types::SendBroadcastOptions, Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let opts =
      SendBroadcastOptions::new("559ac32e-9ef5-46fb-82a1-b76b840c0f7b").with_scheduled_at("in 1 min");

    let _broadcast = resend.broadcasts.send(opts).await?;

    Ok(())
  }
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->broadcasts->send('559ac32e-9ef5-46fb-82a1-b76b840c0f7b', [
    'scheduled_at' => 'in 1 min',
  ]);
  ```

  ```java Java
  Resend resend = new Resend("re_xxxxxxxxx");

  SendBroadcastOptions params = SendBroadcastOptions.builder()
      .scheduledAt("in 1 min")
      .build();

  SendBroadcastResponseSuccess data = resend.broadcasts().send(params,
      "498ee8e4-7aa2-4eb5-9f04-4194848049d1");
  ```

  ```py Python
  import resend

  resend.api_key = "re_xxxxxxxxx"

  params: resend.Broadcasts.SendParams = {
    "broadcast_id": "559ac32e-9ef5-46fb-82a1-b76b840c0f7b",
    "scheduled_at": "in 1 min"
  }
  resend.Broadcasts.send(params)
  ```

  ```ruby Ruby
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  params = {
    broadcast_id: "559ac32e-9ef5-46fb-82a1-b76b840c0f7b",
    scheduled_at: "in 1 min"
  }
  Resend::Broadcasts.send(params)
  ```

  ```go Go
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  sendParams := &resend.SendBroadcastRequest{
    BroadcastId: "559ac32e-9ef5-46fb-82a1-b76b840c0f7b",
    ScheduledAt: "in 1 min",
  }

  sent, _ := client.Broadcasts.Send(sendParams)
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  // Send now
  await resend.BroadcastSendAsync( new Guid( "559ac32e-9ef5-46fb-82a1-b76b840c0f7b" ) );

  // Send in 5 mins
  await resend.BroadcastScheduleAsync(
      new Guid( "559ac32e-9ef5-46fb-82a1-b76b840c0f7b" ),
      DateTime.UtcNow.AddMinutes( 5 ) );
  ```

  ```bash cURL
  curl -X POST 'https://api.resend.com/broadcasts/559ac32e-9ef5-46fb-82a1-b76b840c0f7b/send' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "scheduled_at": "in 1 min"
  }'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
  }
  ```
</ResponseExample>

elete Broadcast
Remove an existing broadcast.
DELETE
/
broadcasts
/
:broadcast_id
You can only delete broadcasts that are in the draft status. In addition, if you delete a broadcast that has already been scheduled to be sent, we will automatically cancel the scheduled delivery and it won’t be sent.
​
Path Parameters
​
broadcast_id
stringrequired
The broadcast ID.
elete Broadcast
Remove an existing broadcast.
DELETE
/
broadcasts
/
:broadcast_id
You can only delete broadcasts that are in the draft status. In addition, if you delete a broadcast that has already been scheduled to be sent, we will automatically cancel the scheduled delivery and it won’t be sent.
​
Path Parameters
​
broadcast_id
stringrequired
The broadcast ID.
List Broadcasts
Retrieve a list of broadcast.
GET
/
broadcasts
See all available status types in the Broadcasts overview.
# List Broadcasts

> Retrieve a list of broadcast.

<Info>
  See all available `status` types in [the Broadcasts
  overview](/dashboard/broadcasts/introduction#understand-broadcast-statuses).
</Info>

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  await resend.broadcasts.list();
  ```

  ```rust Rust
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let _broadcasts = resend.broadcasts.list().await?;

    Ok(())
  }
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->broadcasts->list();
  ```

  ```java Java
  Resend resend = new Resend("re_xxxxxxxxx");

  ListBroadcastsResponseSuccess data = resend.broadcasts().list();
  ```

  ```py Python
  import resend

  resend.api_key = "re_xxxxxxxxx"

  resend.Broadcasts.list()
  ```

  ```ruby Ruby
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  Resend::Broadcasts.list()
  ```

  ```go Go
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  broadcasts, _ := client.Broadcasts.List()
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.BroadcastListAsync();
  Console.WriteLine( "Nr Broadcasts={0}", resp.Content.Count );
  ```

  ```bash cURL
  curl -X GET 'https://api.resend.com/broadcasts' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "object": "list",
    "data": [
      {
        "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",
        "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
        "status": "draft",
        "created_at": "2024-11-01T15:13:31.723Z",
        "scheduled_at": null,
        "sent_at": null
      },
      {
        "id": "559ac32e-9ef5-46fb-82a1-b76b840c0f7b",
        "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
        "status": "sent",
        "created_at": "2024-12-01T19:32:22.980Z",
        "scheduled_at": "2024-12-02T19:32:22.980Z",
        "sent_at": "2024-12-02T19:32:22.980Z"
      }
    ]
  }
  ```
</ResponseExample>

Create Audience
Create a list of contacts.
POST
/
audiences
​
Body Parameters
​
name
stringrequired
The name of the audience you want to create.
# Create Audience

> Create a list of contacts.

## Body Parameters

<ParamField body="name" type="string" required>
  The name of the audience you want to create.
</ParamField>

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  resend.audiences.create({ name: 'Registered Users' });
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->audiences->create([
    'name' => 'Registered Users'
  ]);
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"

  params: resend.Audiences.CreateParams = {
    "name": "Registered Users"
  }

  resend.Audiences.create(params)
  ```

  ```ruby Ruby
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  Resend::Audiences.create({ name: "Registered Users" })
  ```

  ```go Go
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  params := &resend.CreateAudienceRequest{
    Name: "Registered Users",
  }

  audience, err := client.Audiences.Create(params)
  ```

  ```rust Rust
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let _audience = resend.audiences.create("Registered Users").await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          CreateAudienceOptions params = CreateAudienceOptions
                  .builder()
                  .name("Registered Users").build();

          CreateAudienceResponseSuccess data = resend.audiences().create(params);
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.AudienceAddAsync( "Registered Users" );
  Console.WriteLine( "AudienceId={0}", resp.Content );
  ```

  ```bash cURL
  curl -X POST 'https://api.resend.com/audiences' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "name": "Registered Users"
  }'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "object": "audience",
    "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
    "name": "Registered Users"
  }
  ```
</ResponseExample>

Retrieve Audience
Retrieve a single audience.
GET
/
audiences
/
:audience_id


# Retrieve Audience

> Retrieve a single audience.

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  resend.audiences.get('78261eea-8f8b-4381-83c6-79fa7120f1cf');
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->audiences->get('78261eea-8f8b-4381-83c6-79fa7120f1cf');
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"

  resend.Audiences.get("78261eea-8f8b-4381-83c6-79fa7120f1cf")
  ```

  ```ruby Ruby
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  Resend::Audiences.get("78261eea-8f8b-4381-83c6-79fa7120f1cf")
  ```

  ```go Go
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  audience, err := client.Audiences.Get("78261eea-8f8b-4381-83c6-79fa7120f1cf")
  ```

  ```rust Rust
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let _audience = resend
      .audiences
      .get("78261eea-8f8b-4381-83c6-79fa7120f1cf")
      .await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          GetAudienceResponseSuccess data = resend.audiences().get("78261eea-8f8b-4381-83c6-79fa7120f1cf");
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.AudienceRetrieveAsync( new Guid( "78261eea-8f8b-4381-83c6-79fa7120f1cf" ) );
  Console.WriteLine( "Name={0}", resp.Content.Name );
  ```

  ```bash cURL
  curl -X GET 'https://api.resend.com/audiences/78261eea-8f8b-4381-83c6-79fa7120f1cf' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "object": "audience",
    "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
    "name": "Registered Users",
    "created_at": "2023-10-06T22:59:55.977Z"
  }
  ```
</ResponseExample>


Audiences
Delete Audience
Remove an existing audience.
DELETE
/
audiences
/
:audience_id
​
Path Parameters
​
audience_id
stringrequired
The Audience ID.

# Delete Audience

> Remove an existing audience.

## Path Parameters

<ParamField path="audience_id" type="string" required>
  The Audience ID.
</ParamField>

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  resend.audiences.remove('78261eea-8f8b-4381-83c6-79fa7120f1cf');
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->audiences->remove('78261eea-8f8b-4381-83c6-79fa7120f1cf');
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"

  resend.Audiences.remove("78261eea-8f8b-4381-83c6-79fa7120f1cf")
  ```

  ```ruby Ruby
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  Resend::Audiences.remove("78261eea-8f8b-4381-83c6-79fa7120f1cf")
  ```

  ```go Go
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  removed, err := client.Audiences.Remove("78261eea-8f8b-4381-83c6-79fa7120f1cf")
  ```

  ```rust Rust
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let _deleted = resend
      .audiences
      .delete("78261eea-8f8b-4381-83c6-79fa7120f1cf")
      .await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          RemoveAudienceResponseSuccess data = resend.audiences().remove("78261eea-8f8b-4381-83c6-79fa7120f1cf");
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  await resend.AudienceDeleteAsync( new Guid( "78261eea-8f8b-4381-83c6-79fa7120f1cf" ) );
  ```

  ```bash cURL
  curl -X DELETE 'https://api.resend.com/audiences/78261eea-8f8b-4381-83c6-79fa7120f1cf' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "object": "audience",
    "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
    "deleted": true
  }
  ```
</ResponseExample>


Audiences
List Audiences
Retrieve a list of audiences.
GET
/
audiences
# List Audiences

> Retrieve a list of audiences.

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  resend.audiences.list();
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->audiences->list();
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"

  resend.Audiences.list()
  ```

  ```ruby Ruby
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  Resend::Audiences.list
  ```

  ```go Go
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  audiences, err := client.Audiences.List()
  ```

  ```rust Rust
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let _audiences = resend
      .audiences
      .list()
      .await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          ListAudiencesResponseSuccess data = resend.audiences().list();
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.AudienceListAsync();
  Console.WriteLine( "Nr Audience={0}", resp.Content.Count );
  ```

  ```bash cURL
  curl -X GET 'https://api.resend.com/audiences' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "object": "list",
    "data": [
      {
        "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
        "name": "Registered Users",
        "created_at": "2023-10-06T22:59:55.977Z"
      }
    ]
  }
  ```
</ResponseExample>

Create Contact
Create a contact inside an audience.
POST
/
audiences
/
:audience_id
/
contacts
​
Body Parameters
​
email
stringrequired
The email address of the contact.
​
audience_id
stringrequired
The Audience ID.
​
first_name
string
The first name of the contact.
​
last_name
string
The last name of the contact.
​
unsubscribed
boolean
The subscription status.
Create Contact
Create a contact inside an audience.
POST
/
audiences
/
:audience_id
/
contacts
​
Body Parameters
​
email
stringrequired
The email address of the contact.
​
audience_id
stringrequired
The Audience ID.
​
first_name
string
The first name of the contact.
​
last_name
string
The last name of the contact.
​
unsubscribed
boolean
The subscription status.
Retrieve Contact
Retrieve a single contact from an audience.
GET
/
audiences
/
:audience_id
/
contacts
/
:id
​
Path Parameters
​
audienceId
stringrequired
The Audience ID.
Either id or email must be provided.
​
id
string
The Contact ID.
​
email
string
The Contact Email.
Retrieve Contact
Retrieve a single contact from an audience.
GET
/
audiences
/
:audience_id
/
contacts
/
:id
​
Path Parameters
​
audienceId
stringrequired
The Audience ID.
Either id or email must be provided.
​
id
string
The Contact ID.
​
email
string
The Contact Email.
Update Contact
Update an existing contact.
PATCH
/
audiences
/
:audience_id
/
contacts
/
:id
​
Path Parameters
​
audienceId
stringrequired
The Audience ID.
Either id or email must be provided.
​
id
string
The Contact ID.
​
email
string
The Contact Email.
​
Body Parameters
​
first_name
string
The first name of the contact.
​
last_name
string
The last name of the contact.
​
unsubscribed
boolean
The subscription status.
# Update Contact

> Update an existing contact.

## Path Parameters

<ParamField path="audienceId" type="string" required>
  The Audience ID.
</ParamField>

Either `id` or `email` must be provided.

<ParamField path="id" type="string">
  The Contact ID.
</ParamField>

<ParamField path="email" type="string">
  The Contact Email.
</ParamField>

## Body Parameters

<ParamField body="first_name" type="string">
  The first name of the contact.
</ParamField>

<ParamField body="last_name" type="string">
  The last name of the contact.
</ParamField>

<ParamField body="unsubscribed" type="boolean">
  The subscription status.
</ParamField>

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  // Update by contact id
  resend.contacts.update({
    id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
    audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
    unsubscribed: true,
  });

  // Update by contact email
  resend.contacts.update({
    email: 'acme@example.com',
    audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
    unsubscribed: true,
  });
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  // Update by contact id
  $resend->contacts->update(
    audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
    id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
    [
      'unsubscribed' => true
    ]
  );

  // Update by contact email
  $resend->contacts->update(
    audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
    email: 'acme@example.com',
    [
      'unsubscribed' => true
    ]
  );
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"

  # Update by contact id
  params: resend.Contacts.UpdateParams = {
    "id": "e169aa45-1ecf-4183-9955-b1499d5701d3",
    "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
    "unsubscribed": True,
  }

  resend.Contacts.update(params)

  # Update by contact email
  params: resend.Contacts.UpdateParams = {
    "email": "acme@example.com",
    "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
    "unsubscribed": True,
  }

  resend.Contacts.update(params)
  ```

  ```ruby Ruby
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  # Update by contact id
  params = {
    "id": "e169aa45-1ecf-4183-9955-b1499d5701d3",
    "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
    "unsubscribed": true,
  }

  Resend::Contacts.update(params)

  # Update by contact email
  params = {
    "email": "acme@example.com",
    "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
    "unsubscribed": true,
  }

  Resend::Contacts.update(params)
  ```

  ```go Go
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  // Update by contact id
  params := &resend.UpdateContactRequest{
    Id:           "e169aa45-1ecf-4183-9955-b1499d5701d3",
    AudienceId:   "78261eea-8f8b-4381-83c6-79fa7120f1cf",
    Unsubscribed: true,
  }

  contact, err := client.Contacts.Update(params)

  // Update by contact email
  params = &resend.UpdateContactRequest{
    Email:        "acme@example.com",
    AudienceId:   "78261eea-8f8b-4381-83c6-79fa7120f1cf",
    Unsubscribed: true,
  }

  contact, err := client.Contacts.Update(params)
  ```

  ```rust Rust
  use resend_rs::{types::ContactChanges, Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let changes = ContactChanges::new().with_unsubscribed(true);

    // Update by contact id
    let _contact = resend
      .contacts
      .update_by_id(
        "e169aa45-1ecf-4183-9955-b1499d5701d3",
        "78261eea-8f8b-4381-83c6-79fa7120f1cf",
        changes.clone(),
      )
      .await?;

    // Update by contact email
    let _contact = resend
      .contacts
      .update_by_email(
        "acme@example.com",
        "78261eea-8f8b-4381-83c6-79fa7120f1cf",
        changes,
      )
      .await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          // Update by contact id
          UpdateContactOptions params = UpdateContactOptions.builder()
                  .audienceId("78261eea-8f8b-4381-83c6-79fa7120f1cf")
                  .id("e169aa45-1ecf-4183-9955-b1499d5701d3")
                  .unsubscribed(true)
                  .build();

          // Update by contact email
          UpdateContactOptions params = UpdateContactOptions.builder()
                  .audienceId("78261eea-8f8b-4381-83c6-79fa7120f1cf")
                  .email("acme@example.com")
                  .unsubscribed(true)
                  .build();

          UpdateContactResponseSuccess data = resend.contacts().update(params);
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  // By Id
  await resend.ContactUpdateAsync(
      audienceId: new Guid( "78261eea-8f8b-4381-83c6-79fa7120f1cf" ),
      contactId: new Guid( "e169aa45-1ecf-4183-9955-b1499d5701d3" ),
      new ContactData()
      {
          FirstName = "Stevie",
          LastName = "Wozniaks",
          IsUnsubscribed = true,
      }
  );

  // By Email
  await resend.ContactUpdateByEmailAsync(
      new Guid( "78261eea-8f8b-4381-83c6-79fa7120f1cf" ),
      "acme@example.com",
      new ContactData()
      {
          FirstName = "Stevie",
          LastName = "Wozniaks",
          IsUnsubscribed = true,
      }
  );
  ```

  ```bash cURL
  # Update by contact id
  curl -X PATCH 'https://api.resend.com/audiences/78261eea-8f8b-4381-83c6-79fa7120f1cf/contacts/520784e2-887d-4c25-b53c-4ad46ad38100' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "unsubscribed": true
  }'

  # Update by contact email
  curl -X PATCH 'https://api.resend.com/audiences/78261eea-8f8b-4381-83c6-79fa7120f1cf/contacts/acme@example.com' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "unsubscribed": true
  }'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "object": "contact",
    "id": "479e3145-dd38-476b-932c-529ceb705947"
  }
  ```
</ResponseExample>

Delete Contact
Remove an existing contact from an audience.
DELETE
/
audiences
/
:audience_id
/
contacts
/
:id
​
Path Parameters
​
audienceId
stringrequired
The Audience ID.
Either id or email must be provided.
​
id
string
The Contact ID.
​
email
string
The Contact email.


# Delete Contact

> Remove an existing contact from an audience.

## Path Parameters

<ParamField path="audienceId" type="string" required>
  The Audience ID.
</ParamField>

Either `id` or `email` must be provided.

<ParamField path="id" type="string">
  The Contact ID.
</ParamField>

<ParamField path="email" type="string">
  The Contact email.
</ParamField>

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  // Delete by contact id
  resend.contacts.remove({
    id: '520784e2-887d-4c25-b53c-4ad46ad38100',
    audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
  });

  // Delete by contact email
  resend.contacts.remove({
    email: 'acme@example.com',
    audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
  });
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  // Delete by contact id
  $resend->contacts->remove(
    audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
    id: '520784e2-887d-4c25-b53c-4ad46ad38100'
  );

  // Delete by contact email
  $resend->contacts->remove(
    '78261eea-8f8b-4381-83c6-79fa7120f1cf',
    'acme@example.com'
  );
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"

  # Delete by contact id
  resend.Contacts.remove(
    id="520784e2-887d-4c25-b53c-4ad46ad38100",
    audience_id="78261eea-8f8b-4381-83c6-79fa7120f1cf"
  )

  # Delete by contact email
  resend.Contacts.remove(
    email="acme@example.com",
    audience_id="78261eea-8f8b-4381-83c6-79fa7120f1cf"
  )
  ```

  ```ruby Ruby
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  # Delete by contact id
  Resend::Contacts.remove(
    "78261eea-8f8b-4381-83c6-79fa7120f1cf",
    "520784e2-887d-4c25-b53c-4ad46ad38100"
  )

  # Delete by contact email
  Resend::Contacts.remove(
    "78261eea-8f8b-4381-83c6-79fa7120f1cf",
    "acme@example.com"
  )
  ```

  ```go Go
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  // Delete by contact id
  removed, err := client.Contacts.Remove(
    "78261eea-8f8b-4381-83c6-79fa7120f1cf",
    "520784e2-887d-4c25-b53c-4ad46ad38100"
  )

  // Delete by contact email
  removed, err := client.Contacts.Remove(
    "78261eea-8f8b-4381-83c6-79fa7120f1cf",
    "acme@example.com"
  )
  ```

  ```rust Rust
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    // Delete by contact id
    let _deleted = resend
      .contacts
      .delete_by_contact_id(
        "78261eea-8f8b-4381-83c6-79fa7120f1cf",
        "520784e2-887d-4c25-b53c-4ad46ad38100",
      )
      .await?;

    // Delete by contact email
    let _deleted = resend
      .contacts
      .delete_by_email("78261eea-8f8b-4381-83c6-79fa7120f1cf", "acme@example.com")
      .await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          // Delete by contact id
          resend.contacts().remove(ContactRequestOptions.builder()
                          .id("520784e2-887d-4c25-b53c-4ad46ad38100")
                          .audienceId("78261eea-8f8b-4381-83c6-79fa7120f1cf")
                          .build());

          // Delete by contact email
          resend.contacts().remove(ContactRequestOptions.builder()
                          .email("acme@example.com")
                          .audienceId("78261eea-8f8b-4381-83c6-79fa7120f1cf")
                          .build());
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  // By Id
  await resend.ContactDeleteAsync(
      audienceId: new Guid( "78261eea-8f8b-4381-83c6-79fa7120f1cf" ),
      contactId: new Guid( "520784e2-887d-4c25-b53c-4ad46ad38100" )
  );

  // By Email
  await resend.ContactDeleteByEmailAsync(
      new Guid( "78261eea-8f8b-4381-83c6-79fa7120f1cf" ),
      "acme@example.com"
  );
  ```

  ```bash cURL
  # Delete by contact id
  curl -X DELETE 'https://api.resend.com/audiences/78261eea-8f8b-4381-83c6-79fa7120f1cf/contacts/520784e2-887d-4c25-b53c-4ad46ad38100' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json'

  # Deleted by contact email
  curl -X DELETE 'https://api.resend.com/audiences/78261eea-8f8b-4381-83c6-79fa7120f1cf/contacts/acme@example.com' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "object": "contact",
    "contact": "520784e2-887d-4c25-b53c-4ad46ad38100",
    "deleted": true
  }
  ```
</ResponseExample>

List Contacts
Show all contacts from an audience.
GET
/
audiences
/
:audience_id
/
contacts
# List Contacts

> Show all contacts from an audience.

<RequestExample>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  resend.contacts.list({
    audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
  });
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->contacts->get(
    audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf'
  );
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"

  resend.Contacts.list(
    audience_id="78261eea-8f8b-4381-83c6-79fa7120f1cf"
  )
  ```

  ```ruby Ruby
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  Resend::Contacts.list("78261eea-8f8b-4381-83c6-79fa7120f1cf")
  ```

  ```go Go
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  contacts, err := client.Contacts.List("78261eea-8f8b-4381-83c6-79fa7120f1cf")
  ```

  ```rust Rust
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let _contacts = resend
      .contacts
      .list("78261eea-8f8b-4381-83c6-79fa7120f1cf")
      .await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          ListContactsResponseSuccess data = resend.contacts().list("78261eea-8f8b-4381-83c6-79fa7120f1cf");
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.ContactListAsync( new Guid( "78261eea-8f8b-4381-83c6-79fa7120f1cf" ) );
  Console.WriteLine( "Nr Contacts={0}", resp.Content.Count );
  ```

  ```bash cURL
  curl -X GET 'https://api.resend.com/audiences/78261eea-8f8b-4381-83c6-79fa7120f1cf/contacts' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json'
  ```
</RequestExample>

<ResponseExample>
  ```json Response
  {
    "object": "list",
    "data": [
      {
        "id": "e169aa45-1ecf-4183-9955-b1499d5701d3",
        "email": "steve.wozniak@gmail.com",
        "first_name": "Steve",
        "last_name": "Wozniak",
        "created_at": "2023-10-06T23:47:56.678Z",
        "unsubscribed": false
      }
    ]
  }
  ```
</ResponseExample>


