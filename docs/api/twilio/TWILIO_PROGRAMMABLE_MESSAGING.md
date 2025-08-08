# Twilio Programmable Messaging

Skip to contentSkip to navigationSkip to topbar
Twilio Docs
General Usage
Get started
Twilio APIs
Webhooks
Preventing Fraud
Troubleshooting and Security
Debug your Twilio application
Debug events webhooks
Alarms
Availability and Reliability
Security
ISO/IEC Certification
Reporting security vulnerabilities
Store Your Twilio Credentials Securely
Secure your app by validating incoming Twilio requests
Twilio products: API docs, quickstarts, and tutorials
Messaging
Voice
Video
Serverless
Flex
Studio
All docs...
SDKs
Help
Log in
Sign up
On this page
Break the problem down
Debugging webhooks
Check the error logs
Run the webhook in your browser
Check for HTTP redirects
Debugging calls to the REST API
Stream error Logs to Amazon Kinesis
Debugging Your Twilio Application

Integrating Twilio products into your software is straightforward, but as you build and test your application, you may run into issues that you didn't expect. Here are some tips that we have found useful to assist your debugging work.

Break the problem down
The first thing to do is break the problem down into smaller parts. For instance, if you are using the REST API to make an outbound phone call, there are various things taking place:
Your code uses a helper library to invoke Twilio's REST API.
Twilio authenticates your HTTP request and validates the provided parameters.
Twilio places an outbound phone call.
Twilio makes an HTTP request to the webhook you specified, once the recipient answers the call.
Twilio parses and executes the TwiML returned from the webhook.
Any of those steps could experience an issue, whether it's a network outage or an invalid TwiML being executed. If possible, test each of these steps independently to isolate the issue.

Debugging webhooks
If you're experiencing an issue with a webhook that you've configured, there are several things you can do to track down the source of the problem.
Check the error logs
First, check out the error logs. When Twilio runs into a problem with your webhook, it will log information about this. The error logs flag these debugging events as either errors or warnings. Warnings mean Twilio encountered an issue but could still process the request. An error is more severe and means that Twilio could not process the request at all. When you review these debugging events, you'll have access to:
The exact error or warning that occurred.
Potential causes for this error.
Suggested solutions.
The entire HTTP request and response associated with this webhook request.
Run the webhook in your browser
Remember, you're writing a web application. There's nothing Twilio does that you can't test right there in your browser. Visit the URLs in your web browser, and check that you don't have any errors.
Firefox treats XML files nicely, highlighting any invalid XML in your document.
Mimic Twilio's data passing by manually adding data to your URLs. For example, if you ask Twilio to digits and the action is http://www.myapp.com/handleDigits.php, you can open your browser to http://www.myapp.com/handleDigits.php?Digits=1 to verify what happens if the user presses 1.
Make sure your application isn't sending debug output because that will nearly always cause problems. You can, however, wrap any such output in XML comment blocks. They're the same as HTML comment blocks: <!-- COMMENTS HERE -->
Check for HTTP redirects
Twilio is a well-behaved HTTP client, so when it receives an HTTP 301 or 302 redirect, it will follow it to the specified URL. However, on the subsequent request, it will not include the original parameters. Occasionally you may see parameters such as Digits or RecordingUrl not arriving where you expect them. In this scenario, make sure the URL is not returning a redirect.
As an example, when a <Gather> request is made to the action URL, the POST request includes a Digits parameter. If the action URL redirects to another URL, Twilio will follow the redirect and issue a GET request to the specified URL. This GET request will include the standard set of parameters included with every Twilio request, but will not include the additional Digits parameter.
Common situations that may return unexpected redirects are:
A server that automatically redirects all HTTP requests to HTTPS.
A URL rewriting rule that rewrites request URLs to include or exclude www..
To see what your server is returning to Twilio, create a test request using curl, Postman
 or your HTTP client of choice and inspect the response returned from your URL.

Debugging calls to the REST API
While errors and warnings related to Twilio invoking your webhooks are available in the error logs, the REST API will synchronously return an error object to your application in the event an error takes place. The error object will contain the HTTP response status code, a Twilio-specific error code, an error message, and a link to the Error Code Reference. For example:
Copy code block
{


 "code": 21211,


 "message": "The 'To' number 5551234567 is not a valid phone number.",


 "more_info": "https://www.twilio.com/docs/errors/21211",


 "status": 400


}
Stream error Logs to Amazon Kinesis
Twilio Event Streams is an API that allows you to subscribe to a unified stream of interactions across different Twilio products. You can stream your data to your existing systems by configuring a streaming technology like Amazon Kinesis, or a webhook. Error log events will be generated on Event Streams for all errors and warnings on your Twilio applications. Learn more about the events here.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Debugging Your Twilio Application | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
General Usage
Get started
Twilio APIs
Webhooks
Preventing Fraud
Troubleshooting and Security
Debug your Twilio application
Debug events webhooks
Alarms
Availability and Reliability
Security
ISO/IEC Certification
Reporting security vulnerabilities
Store Your Twilio Credentials Securely
Secure your app by validating incoming Twilio requests
Twilio products: API docs, quickstarts, and tutorials
Messaging
Voice
Video
Serverless
Flex
Studio
All docs...
SDKs
Help
Log in
Sign up
On this page
Debugging Event Callback Parameters
Payload
Representative Example of a Debugging Event Webhook
Debugging Events Webhook

When an error or warning takes place on your Twilio account, this event is published into Twilio's Debugging System. This is the system that powers the Monitor Alerts API, Alert Triggers and the Console Debugger.
The Console Debugger
 allows developers to configure an optional webhook to receive data about errors and warnings as they happen. This makes it easy for developers to react to problems with their applications promptly.
If the Console Debugger webhook is configured, Twilio will make an HTTP POST request for debugging events as they occur. Below is an overview of the parameters passed.
(information)
Info
Twilio can send your web application an HTTP request when certain events happen, such as an incoming text message to one of your Twilio phone numbers. These requests are called webhooks, or status callbacks. For more, check out our guide to Getting Started with Twilio Webhooks. Find other webhook pages, such as a security guide and an FAQ in the Webhooks section of the docs.

Debugging Event Callback Parameters
Property
Description
Sid
Unique identifier of this Debugger event.
AccountSid
Unique identifier of the account that generated the Debugger event.
ParentAccountSid
Unique identifier of the Parent Account. This parameter only exists if the above account is a subaccount.
Timestamp
Time of occurrence of the Debugger event.
Level
Severity of the Debugger event. Possible values are Error and Warning.
PayloadType
application/json
Payload
JSON data specific to the Debugging Event.

Payload
The payload is a JSON object that provides more information about the Debugging Event in question.
Property
Description
resource_sid
The ID of this Twilio Platform Resource that this error is associated with
service_sid
The ID of the Twilio Platform Service that this error is associated with
error_code
The unique error code for this debugging event
more_info
A subdocument containing more information about this debugging event
webhook
A subdocument containing Information about the request and response of the webhook associated with this debugging event.

more_info
The more_info property of the payload is optional and contains additional information specific to the Twilio product/feature that published this debugging event.
webhook
The webhook property of the payload is optional. It is only present if a webhook request is associated with the debugging event.
Copy code block
{


'request': {


 'method': 'POST',


 'url': 'http://twimlets.com/forward?PhoneNumber=800-421-9004', 


 'headers': {


   'key': 'value' 


 },


 'parameters': {


   'key': 'value' 


 }


 },


 'response': {


   'status_code': 200,


   'headers': {


     'key': 'value'


   },


   'body': '<Response><Dial>800-421-9004</Dial></Response>'


 }


}

Representative Example of a Debugging Event Webhook
This is an example of a debugging event webhook. The details of what will be in this webhook request depend on what type of error the Twilio Debugger handles. For this example, the webhook event was omitted for brevity, but an example of what it might look like is in the previous section.
This HTTP Body is sent as an HTTP POST to your webhook, and encoded as application/x-www-form-urlencoded. Within that request body, the Payload property is a JSON object that you would need to decode.
The X-Twilio-Signature HTTP header will be sent with this HTTP POST, and you should use it to validate that the request is indeed from Twilio. Learn more about Validating Signatures from Twilio
Copy code block
AccountSid    ACxxxxxxxxxxxxxxxxxxxxxxxx


Level    ERROR


ParentAccountSid


Payload    {


 "resource_sid":"CAxxxxxxxx",


 "service_sid":null,


 "error_code":"11200",


 "more_info":{


   "msg":"An attempt to retrieve content from https://yyy.zzz returned the HTTP status code 404",


   "Msg":"An attempt to retrieve content from https://yyy.zzz returned the HTTP status code 404",


   "sourceComponent":"12000",


   "ErrorCode":"11200",


   "httpResponse":"404",


   "url":"https://yyy.zzz",


   "LogLevel":"ERROR"


 },


 "webhook":{


    "type":"application/json",


    "request": <Specific Twilio Request Details to your Webhook here as a JSON Object>


 }


}


PayloadType    application/json


Sid    NOxxxxx


Timestamp    2020-01-01T23:28:54Z
Below is a cURL snippet based on the above example that you can customize to simulate a debugging event webhook.
Copy code block
curl -X "POST" "https://your-server.example.com/webhook" \


    -H 'I-Twilio-Idempotency-Token: idempotency-token-goes-here' \


    -H 'X-Twilio-Signature: correct-signature-goes-here' \


    -H 'Content-Type: application/x-www-form-urlencoded; charset=utf-8' \


    --data-urlencode "AccountSid=ACxxxxxxxxxxxxxxxxxxxxxxxx" \


    --data-urlencode "Level=ERROR" \


    --data-urlencode "ParentAccountSid=" \


    --data-urlencode "Payload={


 \"resource_sid\":\"CAxxxxxxxx\",


 \"service_sid\":null,


 \"error_code\":\"11200\",


 \"more_info\":{


   \"msg\":\"An attempt to retrieve content from https://yyy.zzz returned the HTTP status code 404\",


   \"Msg\":\"An attempt to retrieve content from https://yyy.zzz returned the HTTP status code 404\",


   \"sourceComponent\":\"12000\",


   \"ErrorCode\":\"11200\",


   \"httpResponse\":\"404\",


   \"url\":\"https://yyy.zzz\",


   \"LogLevel\":\"ERROR\"


 },


 \"webhook\":{


    \"type\":\"application/json\",


    \"request\": {}  }


}" \


    --data-urlencode "PayloadType=application/json" \


    --data-urlencode "Sid=NOxxxxx" \


    --data-urlencode "Timestamp=2020-01-01T23:28:54Z"



Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Debugging Events Webhook | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
General Usage
Get started
Twilio APIs
Webhooks
Preventing Fraud
Troubleshooting and Security
Debug your Twilio application
Debug events webhooks
Alarms
Availability and Reliability
Security
ISO/IEC Certification
Reporting security vulnerabilities
Store Your Twilio Credentials Securely
Secure your app by validating incoming Twilio requests
Twilio products: API docs, quickstarts, and tutorials
Messaging
Voice
Video
Serverless
Flex
Studio
All docs...
SDKs
Help
Log in
Sign up
On this page
Getting Started
Configure an Alarm
1. Select an Error Code to monitor
2. Define the Alarm's threshold and period
3. Configure notification preferences
4. Name your Alarm
Manage Alarms
Alarms History
Alarms webhook payload data
Alarms

Alarms for Error Logs is now available for all accounts. You can create and manage Alarms from the Monitor tab in the Twilio Console
. This enhanced monitoring proactively notifies you when spikes in errors occur.

Expand image

Getting Started
There are multiple ways to create an Alarm:
Directly from the Manage Alarms
 page.
From the Error Logs
 view, click +Create Alarm.

Expand image
From the Error Logs view, click the three dots next to an Error and select Create alarm.

Expand image
After taking any of these actions, you'll be taken to the Create Alarm page
. This page allows you to configure your Alarm properties:
The error you are monitoring for.
The threshold and period you want to check against.
Who gets notified when the Alarm is triggered, and how will they be notified.
(warning)
Warning
Alarms are Account-specific and will not aggregate from sub-Accounts up to Parent accounts.

Configure an Alarm
There are 4 main steps to set up an Alarm.
1. Select an Error Code to monitor
The first step is to select an Error Code from the Error code dropdown. You can configure the Alarm to monitor for a specific Error Code or for any error occurrence. The error code selection dropdown is searchable as well.
(information)
Info
For your reference, all of Twilio's Error Codes, with possible causes and solutions, are documented here.
(information)
Info
Creating an Alarm from an individual error event will automatically populate the Error code field with that Error Code for you.
Once you select an Error Code, the page will display a graph showing a visual timeline of the selected error's rate of occurrence.

Expand image
2. Define the Alarm's threshold and period
The Alarm will be triggered when the selected Error exceeds your defined Alarm threshold within the selected Time period. You can choose from the following time boxes to allow for near real-time alerting: 5 minutes, 15 minutes, 1 hour, 12 hours, and 24 hours.

Expand image
3. Configure notification preferences
The notification preferences enable you to be notified in-console, via email, or webhook. You may select any combination of these options. Provide any necessary email addresses and/or a webhook URL if you enable either of those notification types.
If you enable the webhook option, the provided URL will receive a request with a set of key-value pairs that describe the alarm. These keys are documented below.

Expand image
The in-console notification is a red indicator displayed as a badge on the Monitoring tab.

Expand image
(information)
Info
Alarm notifications will be triggered within 15 seconds of exceeding the defined threshold.
4. Name your Alarm
Finally, give your Alarm a friendly name and click Save to activate the Alarm.
The Alarm can now be maintained from the Manage alarms page.

Expand image

Manage Alarms
You can duplicate, delete, or edit any Alarm from the Manage alarms page.
Click the name of an Alarm to perform any edits, or click the three dots to display options to duplicate or delete the Alarm.

Expand image

Alarms History
The Alarms history page shows a list of all triggered Alarms within your account. The Alarms history does not aggregate Alarms from subaccounts. Each account's Alarms are independent.
Clicking on an Alarm occurrence will take you to the Alarm History detail page, which provides additional information about when the Alarm was triggered and troubleshooting steps for the Error that occurred.
Email notifications will contain a link to the Alarm History detail page so that you can access that information quickly and directly.

Expand image

Alarms webhook payload data
If you provide a webhook URL to an Alarm to receive notifications, Twilio will make a POST request to your URL with the following keys as query parameters, similar to all other Twilio Webhook requests:
Parameter
Description
Example
AccountSid
The 34-character ID of the Account this alarm is associated with.
"ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
AppMonitorTriggerSid
The 34-character ID of the Alarm that was triggered
"AKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
CurrentValue
The current error count for the defined TimePeriod that the Alarm is monitoring
2
DateFired
When this notification was triggered, in UTC
"Tue, 09 08 2022 16:51:20 +0000"
Description
A description of the error the Alarm was monitoring
"Any Warning or Error"
ErrorCode
A unique error code for the error condition. You can look up errors, with possible causes and solutions, in our Error Dictionary.
10004
IdempotencyToken
A random token generated by Twilio, and guaranteed to be unique for this particular firing of this Alarm. This is idempotent
.
"ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-FIRES-AKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
Log
The log level. Can be: error or warning.
"error"
TimePeriod
The period over which the Alarm counts errors, one of FIVE_MINS, FIFTEEN_MINS, ONE_HOUR, TWELVE_HOURS, or ONE_DAY. For instance, a daily TimePeriod would reset the error count every day. Periods are in UTC.
"ONE_DAY"
TriggerValue
The error count at which the Alarm fires.
1.000000

We'd love to hear your thoughts about this product—please reach out to our support team if you have any questions, issues, or feedback for us.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Alarms | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
General Usage
Get started
Twilio APIs
Webhooks
Preventing Fraud
Troubleshooting and Security
Debug your Twilio application
Debug events webhooks
Alarms
Availability and Reliability
Security
ISO/IEC Certification
Reporting security vulnerabilities
Store Your Twilio Credentials Securely
Secure your app by validating incoming Twilio requests
Twilio products: API docs, quickstarts, and tutorials
Messaging
Voice
Video
Serverless
Flex
Studio
All docs...
SDKs
Help
Log in
Sign up
On this page
Fallback URLs
Example Use Cases
Availability and Reliability

Fallback URLs
Twilio maintains a redundant, clustered architecture designed to ensure reliable, highly available service. This is only half of the challenge. Because of the distributed nature of a Twilio application, your web application must be reliable and highly available as well. To aid you in this task, Twilio allows the configuration of "Fallback" URLs on incoming phone numbers.
A Fallback URL is a URL that Twilio requests in the event of a fatal error while executing your call. If Twilio is unable to retrieve or execute TwiML from your web server, a request is immediately made to the number's Fallback URL. Twilio will submit the ErrorCode and ErrorUrl parameters, indicating the error code of the failure and what URL the failure occurred on. You can reply to the fallback URL request with more TwiML, a custom application error message, or you can attempt to recover and continue your call or messaging session.
You can set the Fallback URL in the Twilio Console or via the REST API's IncomingPhoneNumbers resource.
To configure the Fallback URL in the Twilio Console, navigate to your Active Numbers and click on the number you wish to configure. Under both the Voice Configuration and Messaging Configuration sections, there is a field called "Primary handler fails"; this is where you can configure the Fallback URL for either voice or messaging use cases. You can also set this fallback option to go to a Studio Flow, TwiML Bin, Twilio Function, or Proxy Service.
In the REST API, you can set the Fallback URL and Fallback method (GET or POST) for voice and SMS when creating the incoming phone number. You can set this URL to be any valid URL, including the Webhook URL for a Studio Flow, TwiML Bin, Twilio Function, or other Twilio service.
Example Use Cases
Primary Web Server Failover
Problem: You want to make sure your Twilio application continues to accept calls even if your primary web server goes down.
Solution: Configure your incoming phone number's Voice URL to "http://www.example.com/index
" and Voice Fallback URL to "http://fallback.example.com/index
". If Twilio requests "http://www.example.com/index
" and receives an HTTP error or connection failure, it will then request "http://fallback.example.com/index
". If that fallback URL responds with valid TwiML, Twilio will use it to continue the call as if there was no problem.
Custom Error Message
Problem: You do not want your callers to hear the default Twilio application error message.
Solution: Create an error TwiML document to <Say> or <Play> a custom error message. Configure the Voice Fallback URL for your phone number to point at this document's URL. If Twilio encounters a fatal error, callers will hear your custom failure message instead of Twilio's.
Example TwiML for this custom error message:
Copy code block
<?xml version="1.0" encoding="UTF-8" ?>


<Response>


   <Say>


     An application error has occurred.


     Please call back later.


   </Say>


</Response>
Catching Errors
Problem: You want to be notified of errors as they occur.
Solution: Configure your Fallback URL to point at a URL that looks for the ErrorCode and ErrorUrl parameters from Twilio's request. Your application can log these errors, email you an alert, etc. You can respond to the request with TwiML containing an error message for the caller or attempt to recover and continue with the call.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Availability and Reliability | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
General Usage
Get started
Twilio APIs
Webhooks
Preventing Fraud
Troubleshooting and Security
Debug your Twilio application
Debug events webhooks
Alarms
Availability and Reliability
Security
ISO/IEC Certification
Reporting security vulnerabilities
Store Your Twilio Credentials Securely
Secure your app by validating incoming Twilio requests
Twilio products: API docs, quickstarts, and tutorials
Messaging
Voice
Video
Serverless
Flex
Studio
All docs...
SDKs
Help
Log in
Sign up
On this page
Encrypted Communication
HTTP Authentication
Protect Media Access with HTTP Basic Authentication
HTTPS/TLS
Validating Requests are coming from Twilio
Explore the algorithm yourself
A Few Notes
Test the validity of your webhook signature
Validation using the Twilio Helper Libraries
Your Auth Token
Products used
Phone numbers
SDKs
Security

Encrypted Communication
Twilio supports encryption to protect communications between Twilio and your web application. Just specify an HTTPS URL. Twilio will not connect to an HTTPS URL with a self-signed certificate, so use a certificate from a provider such as Let's Encrypt
(warning)
Warning
Twilio strongly recommends against pinning certificates. This is an outdated practice as certificates can be rotated at any time.
Twilio can use the HTTP protocol for callbacks - for instance, if you are working on a development environment that does not have SSL certificates installed. On your Twilio project's Settings page in the Console, the SSL Certificate Validation setting enforces validation on webhooks.
Here is the list of supported TLS ciphers for callbacks
.
(warning)
Warning
Twilio supports the TLS cryptographic protocol. Twilio cannot currently handle self-signed certificates, and support for SSLv3 is officially deprecated.

HTTP Authentication
Twilio supports HTTP Basic and Digest Authentication. This allows you to password-protect the TwiML URLs on your web server so that only you and Twilio can access them. You may provide a username and password via the following URL format.
Copy code block
https://username:password@www.myserver.com/my_secure_document
(warning)
Warning
Twilio supports the TLS cryptographic protocol. Twilio cannot currently handle self-signed certificates, and support for SSLv3 is officially deprecated.
(warning)
Warning
Be careful to not include any special characters, such as &,``:, etc., in your username or password.
Twilio will authenticate to your web server using the provided username and password and will remain logged in for the duration of the call. We highly recommend that you use HTTP Authentication in conjunction with encryption. For more information on 
Basic and 
Digest Authentication, refer to your web server documentation.
If you specify a password-protected URL, Twilio will first send a request with no Authorization header. After your server responds with a 401 Unauthorized status code, a WWW-Authenticate header and a realm in the response, Twilio will make the same request with an Authorization header.
Example response from your server:
Copy code block
HTTP/1.1 401 UNAUTHORIZED


WWW-Authenticate: Basic realm="My Realm"


Date: Wed, 21 Jun 2017 01:14:36 GMT


Content-Type: application/xml


Content-Length: 327

Protect Media Access with HTTP Basic Authentication
Media files, such as call recordings in Programmable Voice; or an image associated with any Programmable Messaging channel (eg. MMS, WhatsApp, or Facebook), can be stored in our Services.
Requiring HTTP Basic Authentication for stored media is considered industry best practice, and it is implemented by Twilio for all applicable Services. Some of our products such as Programmable Voice and Programmable Messaging, support HTTP Basic Authentication but aren't enabled by default. It is an opt-in setting that must be enabled for your applicable Twilio Account and sub-accounts.
To protect media access, you can enforce authentication to access them by enabling HTTP Basic Authentication in your Twilio Account. This setting requires your Twilio Account SID and Auth Token or API Key for all requests to access media files.
Twilio highly recommends enabling HTTP Basic Authentication for your media, especially if it contains Sensitive Data.
You'll need to manually enable HTTP Basic Authentication for media access in the following Services and functionalities:
Programmable Messaging (ie. MMS, WhatsApp Facebook Business Messenger, etc)
Programmable Voice (ie. call recordings)

HTTPS/TLS
The first step you should take to secure your web application is to ensure that you are using HTTPS for your web application's endpoint. Twilio will not connect to an HTTPS URL with a self-signed certificate, so use a certificate from a provider such as Let's Encrypt
Twilio can use the HTTP protocol for callbacks - for instance, if you are working on a development environment that does not have SSL certificates installed. On your Twilio project's Settings page in the Console, the SSL Certificate Validation setting enforces validation on webhooks.
Here is the list of supported TLS ciphers for callbacks
.

Validating Requests are coming from Twilio
If your application exposes sensitive data or is possibly mutative to your data, then you may want to be sure that the HTTP requests to your web application are indeed coming from Twilio, and not a malicious third party. To allow you this level of security, Twilio cryptographically signs its requests. Here's how it works:
Turn on TLS on your server and configure your Twilio account to use HTTPS URLs.
Twilio assembles its request to your application, including the final URL and any POST fields. * If your request is a POST, Twilio takes all the POST fields, sorts them alphabetically by their name, and concatenates the parameter name and value to the end of the URL (with no delimiter). Only query parameters get parsed to generate a security token, not the POST body. * If the request is a GET, the final URL includes all of Twilio's request parameters appended in the query string of your original URL using the standard delimiter & between the name/value pairs.
Twilio takes the resulting string (the full URL with the scheme, port, query string and any POST parameters) and signs it using HMAC-SHA1 and your AuthToken as the key.
Twilio sends this signature in an HTTP header called X-Twilio-Signature
Then, on your end, if you want to verify the authenticity of the request, you can leverage the built-in request validation method provided by all of our helper libraries:
Validate Signature of Request (x-www-form-urlencoded body)
Node.jsPythonC#JavaGoPHPRuby
Report code block
Copy code block
// Get twilio-node from twilio.com/docs/libraries/node


const client = require('twilio');





// Your Auth Token from twilio.com/console


const authToken = process.env.TWILIO_AUTH_TOKEN;





// Store Twilio's request URL (the url of your webhook) as a variable


const url = 'https://mycompany.com/myapp';





// Store the application/x-www-form-urlencoded parameters from Twilio's request as a variable


// In practice, this MUST include all received parameters, not a


// hardcoded list of parameters that you receive today. New parameters


// may be added without notice.


const params = {


 CallSid: 'CA1234567890ABCDE',


 Caller: '+12349013030',


 Digits: '1234',


 From: '+12349013030',


 To: '+18005551212',


};





// Store the X-Twilio-Signature header attached to the request as a variable


const twilioSignature = 'Np1nax6uFoY6qpfT5l9jWwJeit0=';





// Check if the incoming signature is valid for your application URL and the incoming parameters


console.log(client.validateRequest(authToken, twilioSignature, url, params));
Validate Signature of Request (application/json body)
Node.jsPythonC#JavaGoPHPRuby
Report code block
Copy code block
// Get twilio-node from twilio.com/docs/libraries/node


const client = require('twilio');





// Your Auth Token from twilio.com/console


const authToken = process.env.TWILIO_AUTH_TOKEN;





// Store Twilio's request URL (the url of your webhook) as a variable


// including all query parameters


const url = 'https://example.com/myapp?bodySHA256=5ccde7145dfb8f56479710896586cb9d5911809d83afbe34627818790db0aec9';





// Store the application/json body from Twilio's request as a variable


// In practice, this MUST include all received parameters, not a


// hardcoded list of parameters that you receive today. New parameters


// may be added without notice.


const body = "{\"CallSid\":\"CA1234567890ABCDE\",\"Caller\":\"+12349013030\"}";





// Store the X-Twilio-Signature header attached to the request as a variable


const twilioSignature = 'hqeF3G9Hrnv6/R0jOhoYDD2PPUs=';





// Check if the incoming signature is valid for your application URL and the incoming body


console.log(client.validateRequestWithBody(authToken, twilioSignature, url, body));
If the method call returns true, then the request can be considered valid and it is safe to proceed with your application logic.
(information)
Info
We highly recommend you use the helper libraries to do signature validation.
Explore the algorithm yourself
Here's how you would perform the validation on your end:
Take the full URL of the request URL you specify for your phone number or app, from the protocol (https...) through the end of the query string (everything after the ?).
If the request is a POST, sort all the POST parameters alphabetically (using Unix-style case-sensitive sorting order).
Iterate through the sorted list of POST parameters, and append the variable name and value (with no delimiters) to the end of the URL string.
Sign the resulting string with HMAC-SHA1 using your AuthToken as the key (remember, your AuthToken's case matters!).
Base64 encodes the resulting hash value.
Compare your hash to ours, submitted in the X-Twilio-Signature header. If they match, then you're good to go.
Let's walk through an example request. Let's say Twilio made a POST to your application as part of an incoming call webhook:
Copy code block
https://example.com/myapp.php?foo=1&bar=2
And let's say Twilio posted some digits from a Gather to that URL, in addition to all the usual POST fields:
Digits: 1234
To: +18005551212
From: +14158675310
Caller: +14158675310
CallSid: CA1234567890ABCDE
Create a string that is your URL with the full query string:
Copy code block
https://example.com/myapp.php?foo=1&bar=2
Then, sort the list of POST variables by the parameter name (using Unix-style case-sensitive sorting order):
CallSid: CA1234567890ABCDE
Caller: +14158675310
Digits: 1234
From: +14158675310
To: +18005551212
Next, append each POST variable, name and value, to the string with no delimiters:
Copy code block
https://example.com/myapp.php?foo=1&bar=2CallSidCA1234567890ABCDECaller+14158675310Digits1234From+14158675310To+18005551212
Hash the resulting string using HMAC-SHA1, using your AuthToken Primary as the key.
Let's suppose your AuthToken is 12345. Then take the hash value returned from the following function call (or its equivalent in your language of choice):
Copy code block
hmac_sha1(https://example.com/myapp.php?foo=1&bar=2CallSidCA1234567890ABCDECaller+14158675310Digits1234From+14158675310To+18005551212, 12345)
Now take the Base64 encoding of the hash value (so it's only ASCII characters):
Copy code block
L/OH5YylLD5NRKLltdqwSvS0BnU=
Finally, compare that to the hash Twilio sent in the X-Twilio-Signature HTTP header. If they match, the request is valid!
(warning)
Warning
This example is for illustrative purposes only. When validating requests in your application, only use the provided helper methods.
A Few Notes
If the Content-Type is application-json, don't use the JSON body to fill in the validator's param for POST parameters.
The query parameter bodySHA256 will be included in the request.
Its value is calculated as the hexadecimal representation of the SHA-256 hash of the request body.
Some frameworks may trim whitespace from POST body fields. A notable example is Laravel, which has the TrimStrings middleware enabled by default. You must disable these behaviors to successfully match signatures generated from fields that have leading or trailing whitespace. Certain Node.js middleware may also trim whitespace from requests.
When manually constructing the request body to be sent (as can be done in the Studio HTTP Request widget) ensure that no hidden whitespaces are in the body.
When creating the hash make sure you are using your Primary AuthToken as the key. If you have recently created a secondary AuthToken, this means you still need to use your old AuthToken until the secondary one has been promoted to your primary AuthToken
.
The HMAC-SHA1 secure hashing algorithm should be available in all major languages, either in the core or via an extension or package.
If your URL uses an "index" page, such as index.php or index.html to handle the request, such as: https://example.com/twilio where the real page is served from https://example.com/twilio/index.php, then Apache or PHP may rewrite that URL so it has a trailing slash, e.g., https://example.com/twilio/. Using the code above, or similar code in another language, you could end up with an incorrect hash, because Twilio built the hash using https://example.com/twilio and you may have built the hash using https://example.com/twilio/.
For SMS and voice callbacks over HTTP:
Twilio will drop the username and password (if any) from the URL before computing the signature.
Twilio will keep the port (if any) in the URL when computing the signature.
For SMS callbacks over HTTPS:
Twilio will drop the username and password (if any) from the URL before computing the signature.
Twilio will keep the port (if any) in the URL when computing the signature.
For voice callbacks over HTTPS:
Twilio will drop the username and password (if any) from the URL before computing the signature.
Twilio will also drop the port (if any) from the URL before computing the signature.
For voice WSS handshake requests:
If you are having trouble verifying a WebSocket handshake request (e.g., for Programmable Voice Media Streams), try appending a trailing / character to the URL that you pass to the signature validation method.
(information)
A note on HMAC-SHA1
Concerned about SHA1 security issues? Twilio does not use SHA-1 alone.
In short, the critical component of HMAC-SHA1 that distinguishes it from SHA-1 alone is the use of your Twilio AuthToken as a complex secret key. While there are possible collision-based attacks on SHA-1
, HMACs
 are not affected by those same attacks - it's the combination of the underlying hashing algorithm (SHA-1) and the strength of the secret key (AuthToken) that protects you in this case.

Test the validity of your webhook signature
(information)
Info
It's a great idea to test your webhooks and ensure that their signatures are secure. The following sample code can test your unique endpoint against both valid and invalid signatures.
To make this test work for you, you'll need to:
Set your Auth Token
 as an environment variable
Set the URL to the endpoint you want to test
If testing BasicAuth, change HTTPDigestAuth to HTTPBasicAuth
Test the validity of your webhook signature (x-www-form-urlencoded body)
Node.jsPythonC#JavaPHPRuby
Report code block
Copy code block
// Get twilio-node from twilio.com/docs/libraries/node


const webhooks = require('twilio/lib/webhooks/webhooks');


const request = require('request');





// Your Auth Token from twilio.com/console


const authToken = process.env.TWILIO_AUTH_TOKEN;





// The Twilio request URL


const url = 'https://mycompany.com/myapp';





// The post variables in Twilio's request


const params = {


 CallSid: 'CA1234567890ABCDE',


 Caller: '+12349013030',


 Digits: '1234',


 From: '+12349013030',


 To: '+18005551212',


};








function testUrl(method, url, params, valid) {


 if(method === "GET") {


   url += "?" + Object.keys(params).map(key => key + '=' + params[key]).join('&');


   params = {};


 }


 const signatureUrl = valid ? url : "http://invalid.com"; 


 const signature = webhooks.getExpectedTwilioSignature(authToken, signatureUrl, params);


 const options = {


     method: method,


     url: url,


     form: params,


     headers: {


       'X-Twilio-Signature': signature


     }


 }





 request(options, function(error, response, body){


     const validStr = valid ? "valid" : "invalid";


     console.log(`HTTP ${method} with ${validStr} signature returned ${response.statusCode}`);


 });


}





testUrl('GET', url, params, true);


testUrl('GET', url, params, false);


testUrl('POST', url, params, true);


testUrl('POST', url, params, false);
Test the validity of your webhook signature (application/json body)
Node.jsPythonC#JavaPHPRuby
Report code block
Copy code block
// Get twilio-node from twilio.com/docs/libraries/node


const webhooks = require('twilio/lib/webhooks/webhooks');


const request = require('request');





// Your Auth Token from twilio.com/console


const authToken = process.env.TWILIO_AUTH_TOKEN;





// The Twilio request URL


const url = 'https://example.com/myapp?bodySHA256=5ccde7145dfb8f56479710896586cb9d5911809d83afbe34627818790db0aec9';





// The post variables in Twilio's request


const params = {};


const body = "{\"CallSid\":\"CA1234567890ABCDE\",\"Caller\":\"+12349013030\"}";








function testUrl(method, url, params, valid) {


 const signatureUrl = valid ? url : "http://invalid.com"; 


 const signature = webhooks.getExpectedTwilioSignature(authToken, signatureUrl, params);


 const options = {


     method: method,


     url: url,


     body: body,


     headers: {


       'X-Twilio-Signature': signature,


       'Content-Type': 'application/json'


     }


 }





 request(options, function(error, response, body){


     const validStr = valid ? "valid" : "invalid";


     console.log(`HTTP ${method} with ${validStr} signature returned ${response.statusCode}`);


 });


}





testUrl('GET', url, params, true);


testUrl('GET', url, params, false);


testUrl('POST', url, params, true);


testUrl('POST', url, params, false);
Validation using the Twilio Helper Libraries
All the official Twilio Helper Libraries ship with a Utilities class which facilitates request validation. Head over to the libraries page to download the library for your language of choice.
Your Auth Token
Please keep your AuthToken secure. It not only enables access to the REST API but also to request signatures. Learn how to secure this token using environment variables.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Security | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
General Usage
Get started
Twilio APIs
Webhooks
Preventing Fraud
Troubleshooting and Security
Debug your Twilio application
Debug events webhooks
Alarms
Availability and Reliability
Security
ISO/IEC Certification
Reporting security vulnerabilities
Store Your Twilio Credentials Securely
Secure your app by validating incoming Twilio requests
Twilio products: API docs, quickstarts, and tutorials
Messaging
Voice
Video
Serverless
Flex
Studio
All docs...
SDKs
Help
Log in
Sign up
On this page
ISMS Scope
Learn More
ISO/IEC Certification

As part of our information security management system (ISMS), Twilio is certified under ISO/IEC 27001, a management system that provides specific requirements and practices intended to bring information security under management control. In addition, we have attestations to ISO/IEC 27017 and ISO/IEC 27018, internationally recognized codes of practice that provide guidance on controls to address cloud-specific information security threats and risks as well as for the protection of personally identifiable information (PII). Our compliance with these standards assures your protection in many ways:
Your data and environment are protected and separated from other customers
Twilio is committed to alignment with globally recognized best practices and maintains a system of precise controls to ensure the integrity of its cloud services
Physical media are managed and controlled to protect Twilio customers' data
Your data won't be used for marketing/advertising without consent
You know what's happening with your PII
We comply only with legally binding requests for disclosure of customer data
Twilio provides customers the ability to manage their data; you control your data and know where it is stored

ISMS Scope
All publicly available Twilio services and features are in scope.

Learn More
Visit iso.org to learn more:
ISO/IEC 27001


ISO/IEC 27017


ISO/IEC 27018



Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
ISO/IEC Certification | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
General Usage
Get started
Twilio APIs
Webhooks
Preventing Fraud
Troubleshooting and Security
Debug your Twilio application
Debug events webhooks
Alarms
Availability and Reliability
Security
ISO/IEC Certification
Reporting security vulnerabilities
Store Your Twilio Credentials Securely
Secure your app by validating incoming Twilio requests
Twilio products: API docs, quickstarts, and tutorials
Messaging
Voice
Video
Serverless
Flex
Studio
All docs...
SDKs
Help
Log in
Sign up
On this page
Vulnerability disclosure program
Bug bounty program
Reporting Security Vulnerabilities

Ensuring the security and integrity of the Twilio platform is critical to the service we provide to you. We are committed to providing a secure product and appreciate your help in responsibly identifying ways for us to improve Twilio. To that end, Twilio accepts vulnerability reports from all sources such as independent security researchers, industry partners, vendors, customers, and consultants.

Vulnerability disclosure program
The Twilio security disclosure program provides two ways to report vulnerabilities in Twilio applications and online services. One way is through the Twilio Vulnerability Disclosure Program. Anyone can report vulnerabilities through this program, even if you don't meet our Twilio Bug Bounty Program requirements. To submit a vulnerability through the Vulnerability Disclosure Program, visit the Twilio Vulnerability Disclosure Program page
. Though this program doesn't offer monetary rewards, we appreciate your contributions.

Bug bounty program
Since 2015
, Twilio has partnered with the global security research community to surface and respond to vulnerabilities through its Bug Bounty program. Twilio offers this Bug Bounty program through the Bugcrowd platform. Participants can earn rewards for reporting vulnerabilities to us through this program. To see the terms of the program and participate, go to Bugcrowd
 and sign up as a tester. You'll need to accept the Twilio Terms of Service to engage in testing. If you have identified a vulnerability, please report it via Bugcrowd to be eligible for a reward.
The contribution of ethical researchers is greatly appreciated. As of March 17, 2025, here are the top five researchers who helped us improve security at Twilio in 2024 and the associated number of valid submissions.
m0chan
, 22
muh404med, 18
Felcity
, 16
kaks3c
, 14
MarsXc0, 12
Finally, to report any SendGrid service-specific abuse, please go to our spam/phishing reporting page
. For all inquiries and document requests regarding Twilio security, check out our Twilio
 and Twilio Segment
 Trust Centers.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Reporting Security Vulnerabilities | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
General Usage
Get started
Twilio APIs
Webhooks
Preventing Fraud
Troubleshooting and Security
Debug your Twilio application
Debug events webhooks
Alarms
Availability and Reliability
Security
ISO/IEC Certification
Reporting security vulnerabilities
Store Your Twilio Credentials Securely
Secure your app by validating incoming Twilio requests
Twilio products: API docs, quickstarts, and tutorials
Messaging
Voice
Video
Serverless
Flex
Studio
All docs...
SDKs
Help
Log in
Sign up
On this page
Set environment variables
Mac & Linux
Windows
Cloud providers
Load credentials from environment variables
Store Your Twilio Credentials Securely

It's important to keep credentials such as your Twilio Account SID and Auth token secure by storing them in a way that prevents unauthorized access. One common method is to store them in environment variables which are then accessed from your app. This keeps them out of code and other places where credentials don't belong. Let's take a look at how to work with environment variables with a variety of operating systems and languages.

Set environment variables
From the command line, set environment variables to contain your credentials. For example:
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
(warning)
Warning
If you store these in a .env file so they persist across reboots, make sure to tell Git to ignore the .env file by adding *.env to your .gitignore file. You do not want your credentials uploaded in plain text to the Git repository.
Mac & Linux
Add your credentials as environment variables in a twilio.env file and source them:
Copy code block
echo "export TWILIO_ACCOUNT_SID='ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'" > twilio.env


echo "export TWILIO_AUTH_TOKEN='your_auth_token'" >> twilio.env


source ./twilio.env
Make sure that Git ignores the twilio.env file:
Copy code block
echo "twilio.env" >> .gitignore
Windows
You can store your credentials in environment variables via the command line. You will have to do this at the start of each command-line session (each time you run cmd.exe or PowerShell).
Windows command line (cmd.exe)
Copy code block
set TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


set TWILIO_AUTH_TOKEN=your_auth_token
PowerShell
Copy code block
$Env:TWILIO_ACCOUNT_SID="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"


$Env:TWILIO_AUTH_TOKEN="your_auth_token"
To make the Windows environment variables permanent, see How to Set Environment Variables
.

Cloud providers
Most cloud providers give you a way to securely configure environment variables for your application.
Heroku


Azure Websites


Azure Functions


AWS


Dockerfile


Docker Run


Google Cloud



Load credentials from environment variables
Once you have stored your credentials in environment variables, they are accessible by name to your apps. Always access your credentials using the variable names and never hard-code credentials in your code. Choose your language to see the right code for you.
Load credentials from environment variables
Node.jsPythonC#JavaPHPRubycurl
Report code block
Copy code block
// Download the Node helper library from twilio.com/docs/node/install


// These are your accountSid and authToken from https://www.twilio.com/console


// To set up environmental variables, see http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;





const client = require('twilio')(accountSid, authToken);





// Make API calls here...

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Store Your Twilio Credentials Securely | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
General Usage
Get started
Twilio APIs
Webhooks
Preventing Fraud
Troubleshooting and Security
Debug your Twilio application
Debug events webhooks
Alarms
Availability and Reliability
Security
ISO/IEC Certification
Reporting security vulnerabilities
Store Your Twilio Credentials Securely
Secure your app by validating incoming Twilio requests
C# / ASP.NET
C# / ASP.NET Core
C# / ASP.NET WEB API
Java / Servlets
Node.js / Express
PHP / Lumen
Python / Django
Python / Flask
Ruby / Sinatra
Go / Gin
Twilio products: API docs, quickstarts, and tutorials
Messaging
Voice
Video
Serverless
Flex
Studio
All docs...
SDKs
Help
Log in
Sign up
On this page
Set environment variables
Mac & Linux
Windows
Cloud providers
Load credentials from environment variables
Store Your Twilio Credentials Securely

It's important to keep credentials such as your Twilio Account SID and Auth token secure by storing them in a way that prevents unauthorized access. One common method is to store them in environment variables which are then accessed from your app. This keeps them out of code and other places where credentials don't belong. Let's take a look at how to work with environment variables with a variety of operating systems and languages.

Set environment variables
From the command line, set environment variables to contain your credentials. For example:
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
(warning)
Warning
If you store these in a .env file so they persist across reboots, make sure to tell Git to ignore the .env file by adding *.env to your .gitignore file. You do not want your credentials uploaded in plain text to the Git repository.
Mac & Linux
Add your credentials as environment variables in a twilio.env file and source them:
Copy code block
echo "export TWILIO_ACCOUNT_SID='ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'" > twilio.env


echo "export TWILIO_AUTH_TOKEN='your_auth_token'" >> twilio.env


source ./twilio.env
Make sure that Git ignores the twilio.env file:
Copy code block
echo "twilio.env" >> .gitignore
Windows
You can store your credentials in environment variables via the command line. You will have to do this at the start of each command-line session (each time you run cmd.exe or PowerShell).
Windows command line (cmd.exe)
Copy code block
set TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


set TWILIO_AUTH_TOKEN=your_auth_token
PowerShell
Copy code block
$Env:TWILIO_ACCOUNT_SID="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"


$Env:TWILIO_AUTH_TOKEN="your_auth_token"
To make the Windows environment variables permanent, see How to Set Environment Variables
.

Cloud providers
Most cloud providers give you a way to securely configure environment variables for your application.
Heroku


Azure Websites


Azure Functions


AWS


Dockerfile


Docker Run


Google Cloud



Load credentials from environment variables
Once you have stored your credentials in environment variables, they are accessible by name to your apps. Always access your credentials using the variable names and never hard-code credentials in your code. Choose your language to see the right code for you.
Load credentials from environment variables
Node.jsPythonC#JavaPHPRubycurl
Report code block
Copy code block
// Download the Node helper library from twilio.com/docs/node/install


// These are your accountSid and authToken from https://www.twilio.com/console


// To set up environmental variables, see http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;





const client = require('twilio')(accountSid, authToken);





// Make API calls here...

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Store Your Twilio Credentials Securely | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
General Usage
Get started
Twilio APIs
Webhooks
Preventing Fraud
Troubleshooting and Security
Debug your Twilio application
Debug events webhooks
Alarms
Availability and Reliability
Security
ISO/IEC Certification
Reporting security vulnerabilities
Store Your Twilio Credentials Securely
Secure your app by validating incoming Twilio requests
C# / ASP.NET
C# / ASP.NET Core
C# / ASP.NET WEB API
Java / Servlets
Node.js / Express
PHP / Lumen
Python / Django
Python / Flask
Ruby / Sinatra
Go / Gin
Twilio products: API docs, quickstarts, and tutorials
Messaging
Voice
Video
Serverless
Flex
Studio
All docs...
SDKs
Help
Log in
Sign up
On this page
Create a custom filter attribute
Use the filter attribute with our Twilio webhooks
Disable request validation during testing
What's next?
Secure your C# / ASP.NET app by validating incoming Twilio requests

(warning)
Warning
See the AspNetCore version of this guide.
In this guide we'll cover how to secure your C# / ASP.NET MVC
 application by validating incoming requests to your Twilio webhooks are, in fact, from Twilio.
With a few lines of code, we'll write a custom filter attribute for our ASP.NET app that uses the Twilio C# SDK
's validator utility. This filter will then be invoked on the controller actions that accept Twilio webhooks to confirm that incoming requests genuinely originated from Twilio.
Let's get started!

Create a custom filter attribute
The Twilio C# SDK includes a RequestValidator class we can use to validate incoming requests.
We could include our request validation code as part of our controller, but this is a perfect opportunity to write an action filter attribute
. This way we can reuse our validation logic across all our controller actions which accept incoming requests from Twilio.
Use filter attribute to validate Twilio requests
Confirm incoming requests to your controllers are genuine with this filter.
Copy code block
using System;


using System.Configuration;


using System.Web;


using System.Net;


using System.Web.Mvc;


using Twilio.Security;





namespace ValidateRequestExample.Filters


{


   [AttributeUsage(AttributeTargets.Method)]


   public class ValidateTwilioRequestAttribute : ActionFilterAttribute


   {


       private readonly RequestValidator _requestValidator;





       public ValidateTwilioRequestAttribute()


       {


           var authToken = ConfigurationManager.AppSettings["TwilioAuthToken"];


           _requestValidator = new RequestValidator(authToken);


       }





       public override void OnActionExecuting(ActionExecutingContext actionContext)


       {


           var context = actionContext.HttpContext;


           if(!IsValidRequest(context.Request))


           {


               actionContext.Result = new HttpStatusCodeResult(HttpStatusCode.Forbidden);


           }





           base.OnActionExecuting(actionContext);


       }





       private bool IsValidRequest(HttpRequestBase request) {


           var signature = request.Headers["X-Twilio-Signature"];


           var requestUrl = request.Url.AbsoluteUri;


           return _requestValidator.Validate(requestUrl, request.Form, signature);


       }


   }


}


To validate an incoming request genuinely originated from Twilio, we first need to create an instance of the RequestValidator class. After that we call its validate method, passing in the request's HTTP context and our Twilio auth token.
That method will return True if the request is valid or False if it isn't. Our filter attribute then either continues processing the action or returns a 403 HTTP response for invalid requests.

Use the filter attribute with our Twilio webhooks
Now we're ready to apply our filter attribute to any controller action in our ASP.NET application that handles incoming requests from Twilio.
Apply the request validation filter attribute to a set of controller methods
Apply a custom Twilio request validation filter attribute to a set of controller methods used for Twilio webhooks.
Copy code block
using System.Web.Mvc;


using Twilio.AspNet.Mvc;


using Twilio.TwiML;


using ValidateRequestExample.Filters;





namespace ValidateRequestExample.Controllers


{


   public class IncomingController : TwilioController


   {


       [ValidateTwilioRequest]


       public ActionResult Voice(string from)


       {


           var message = "Thanks for calling! " +


               $"Your phone number is {from}. " +


               "I got your call because of Twilio's webhook. " +


               "Goodbye!";





           var response = new VoiceResponse();


           response.Say(string.Format(message, from));


           response.Hangup();





           return TwiML(response);


       }





       [ValidateTwilioRequest]


       public ActionResult Message(string body)


       {


           var message = $"Your text to me was {body.Length} characters long. " +


               "Webhooks are neat :)";





           var response = new MessagingResponse();


           response.Message(new Message(message));





           return TwiML(response);


       }


   }


}


To use the filter attribute with an existing view, just put [ValidateTwilioRequest] above the action's definition. In this sample application, we use our filter attribute with two controller actions: one that handles incoming phone calls and another that handles incoming text messages.
Note: If your Twilio webhook URLs start with https:// instead of http://, your request validator may fail locally when you use Ngrok or in production if your stack terminates SSL connections upstream from your app. This is because the request URL that your ASP.NET application sees does not match the URL Twilio used to reach your application.
To fix this for local development with Ngrok, use http:// for your webhook instead of https://. To fix this in your production app, your decorator will need to reconstruct the request's original URL using request headers like X-Original-Host and X-Forwarded-Proto, if available.

Disable request validation during testing
If you write tests for your controller actions, those tests may fail where you use your Twilio request validation filter. Any requests your test suite sends to those actions will fail the filter's validation check.
To fix this problem we recommend adding an extra check in your filter attribute, like so, telling it to only reject incoming requests if your app is running in production.
An improved request validation filter attribute, useful for testing
Use this version of the custom filter attribute if you test your controllers.
Copy code block
using System;


using System.Configuration;


using System.Web;


using System.Net;


using System.Web.Mvc;


using Twilio.Security;





namespace ValidateRequestExample.Filters


{


   [AttributeUsage(AttributeTargets.Method)]


   public class ValidateTwilioRequestAttribute : ActionFilterAttribute


   {


       private readonly RequestValidator _requestValidator;


       private static bool IsTestEnvironment =>


           bool.Parse(ConfigurationManager.AppSettings["IsTestEnvironment"]);





       public ValidateTwilioRequestAttribute()


       {


           var authToken = ConfigurationManager.AppSettings["TwilioAuthToken"];


           _requestValidator = new RequestValidator(authToken);


       }





       public override void OnActionExecuting(ActionExecutingContext actionContext)


       {


           var context = actionContext.HttpContext;


           if (!IsTestEnvironment && !IsValidRequest(context.Request))


           {


               actionContext.Result = new HttpStatusCodeResult(HttpStatusCode.Forbidden);


           }





           base.OnActionExecuting(actionContext);


       }





       private bool IsValidRequest(HttpRequestBase request) {


           var signature = request.Headers["X-Twilio-Signature"];


           var requestUrl = request.RawUrl;


           return _requestValidator.Validate(requestUrl, request.Form, signature);


       }


   }


}



What's next?
Validating requests to your Twilio webhooks is a great first step for securing your Twilio application. We recommend reading over our full security documentation for more advice on protecting your app, and the Anti-Fraud Developer's Guide in particular.
To learn more about securing your ASP.NET MVC application in general, check out the security considerations page in the official ASP.NET docs
.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Secure your C# / ASP.NET app by validating incoming Twilio requests | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
General Usage
Get started
Twilio APIs
Webhooks
Preventing Fraud
Troubleshooting and Security
Debug your Twilio application
Debug events webhooks
Alarms
Availability and Reliability
Security
ISO/IEC Certification
Reporting security vulnerabilities
Store Your Twilio Credentials Securely
Secure your app by validating incoming Twilio requests
C# / ASP.NET
C# / ASP.NET Core
C# / ASP.NET WEB API
Java / Servlets
Node.js / Express
PHP / Lumen
Python / Django
Python / Flask
Ruby / Sinatra
Go / Gin
Twilio products: API docs, quickstarts, and tutorials
Messaging
Voice
Video
Serverless
Flex
Studio
All docs...
SDKs
Help
Log in
Sign up
On this page
Create a custom filter attribute
Use the filter attribute with our Twilio webhooks
Disable request validation during testing
What's next?
Secure your C# / ASP.NET Core app by validating incoming Twilio requests

(warning)
Warning
See the ASP.NET version of thisguide.
In this guide, we'll cover how to secure your C# / ASP.NET Core
 application by validating incoming requests to your Twilio webhooks are, in fact, from Twilio.
With a few lines of code, we'll write a custom filter attribute for our ASP.NET app that uses the Twilio C# SDK
's validator utility. This filter will then be invoked on the controller actions that accept Twilio webhooks to confirm that incoming requests genuinely originated from Twilio.
Let's get started!
(information)
Info
If you don't want to develop your own validation filter, you can install the Twilio helper library for ASP.NET Core
 and use the library's [ValidateRequest] attribute instead that has more features. This library also contains an endpoint filter and a middleware validator.

Create a custom filter attribute
The Twilio C# SDK includes a RequestValidator class we can use to validate incoming requests.
We could include our request validation code as part of our controller, but this is a perfect opportunity to write an action filter attribute
. This way we can reuse our validation logic across all our controllers and actions that accept incoming requests from Twilio.
Use filter attribute to validate Twilio requests
Confirm incoming requests to your controllers are genuine with this filter.
Copy code block
using System;


using System.Collections.Generic;


using System.Linq;


using System.Threading.Tasks;


using Microsoft.AspNetCore.Http;


using Microsoft.AspNetCore.Mvc;


using Microsoft.AspNetCore.Mvc.Filters;


using Microsoft.Extensions.Configuration;


using Twilio.Security;





namespace ValidateRequestExample.Filters


{


   [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]


   public class ValidateTwilioRequestAttribute : TypeFilterAttribute


   {


       public ValidateTwilioRequestAttribute() : base(typeof(ValidateTwilioRequestFilter))


       {


       }


   }





   internal class ValidateTwilioRequestFilter : IAsyncActionFilter


   {


       private readonly RequestValidator _requestValidator;





       public ValidateTwilioRequestFilter(IConfiguration configuration)


       {


           var authToken = configuration["Twilio:AuthToken"] ?? throw new Exception("'Twilio:AuthToken' not configured.");


           _requestValidator = new RequestValidator(authToken);


       }





       public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)


       {


           var httpContext = context.HttpContext;


           var request = httpContext.Request;





           var requestUrl = $"{request.Scheme}://{request.Host}{request.Path}{request.QueryString}";


           Dictionary<string, string> parameters = null;





           if (request.HasFormContentType)


           {


               var form = await request.ReadFormAsync(httpContext.RequestAborted).ConfigureAwait(false);


               parameters = form.ToDictionary(p => p.Key, p => p.Value.ToString());


           }





           var signature = request.Headers["X-Twilio-Signature"];


           var isValid = _requestValidator.Validate(requestUrl, parameters, signature);





           if (!isValid)


           {


               httpContext.Response.StatusCode = StatusCodes.Status403Forbidden;


               return;


           }





           await next();


       }


   }


}
To validate an incoming request genuinely originated from Twilio, we first need to create an instance of the RequestValidator class passing it our Twilio Auth Token. Then we call its Validate method passing the requester URL, the form parameters, and the Twilio request signature.
That method will return True if the request is valid or False if it isn't. Our filter attribute then either continues processing the action or returns a 403 HTTP response for forbidden requests.

Use the filter attribute with our Twilio webhooks
Now we're ready to apply our filter attribute to any controller action in our ASP.NET application that handles incoming requests from Twilio.
Apply the request validation filter attribute to a set of controller methods
Apply a custom Twilio request validation filter attribute to a set of controller methods used for Twilio webhooks.
Copy code block
using Microsoft.AspNetCore.Mvc;


using Twilio.TwiML;


using ValidateRequestExample.Filters;





namespace ValidateRequestExample.Controllers


{


   [Route("[controller]/[action]")]


   public class IncomingController : Controller


   {


       [ValidateTwilioRequest]


       public IActionResult Voice(string from)


       {


           var message = "Thanks for calling! " +


                         $"Your phone number is {from}. " +


                         "I got your call because of Twilio\'s webhook. " +


                         "Goodbye!";





           var response = new VoiceResponse();


           response.Say(string.Format(message, from));


           response.Hangup();





           return Content(response.ToString(), "text/xml");


       }





       [ValidateTwilioRequest]


       public IActionResult Message(string body)


       {


           var message = $"Your text to me was {body.Length} characters long. " +


                         "Webhooks are neat :)";





           var response = new MessagingResponse();


           response.Message(message);





           return Content(response.ToString(), "text/xml");


       }


   }


}
To use the filter attribute with an existing controller action, just put [ValidateTwilioRequest] above the action's definition. In this sample application, we use our filter attribute with two controller actions: one that handles incoming phone calls and another that handles incoming text messages.
(information)
Info
If your Twilio webhook URLs start with https:// instead of http://, your request validator may fail locally when you use Ngrok or in production, if your stack terminates SSL connections upstream from your app. This is because the request URL that your ASP.NET application sees does not match the URL Twilio used to reach your application.
To fix this for local development with ngrok, use http:// for your webhook instead of https://. To fix this in your production app, your method will need to reconstruct the request's original URL using request headers like X-Original-Host and X-Forwarded-Proto, if available.
Before running the application, make sure you configure your Twilio Auth Token
 as the Twilio:AuthToken configuration, using .NET's secrets manager
, environment variables, a vault service, or some other secure configuration source.

Disable request validation during testing
If you write tests for your controller actions, those tests may fail where you use your Twilio request validation filter. Any requests your test suite sends to those actions will fail the filter's validation check.
To fix this problem we recommend adding an extra check in your filter attribute, like so, telling it to only reject incoming requests if your app is running in production.
An improved request validation filter attribute, useful for testing
Use this version of the custom filter attribute if you test your controllers.
Copy code block
using System;


using System.Collections.Generic;


using System.Linq;


using System.Threading.Tasks;


using Microsoft.AspNetCore.Hosting;


using Microsoft.AspNetCore.Http;


using Microsoft.AspNetCore.Mvc;


using Microsoft.AspNetCore.Mvc.Filters;


using Microsoft.Extensions.Configuration;


using Twilio.Security;





namespace ValidateRequestExample.Filters


{


   [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]


   public class ValidateTwilioRequestAttribute : TypeFilterAttribute


   {


       public ValidateTwilioRequestAttribute() : base(typeof(ValidateTwilioRequestFilter))


       {


       }


   }





   internal class ValidateTwilioRequestFilter : IAsyncActionFilter


   {


       private readonly RequestValidator _requestValidator;


       private readonly bool _isEnabled;





       public ValidateTwilioRequestFilter(IConfiguration configuration, IWebHostEnvironment environment)


       {


           var authToken = configuration["Twilio:AuthToken"] ?? throw new Exception("'Twilio:AuthToken' not configured.");


           _requestValidator = new RequestValidator(authToken);


           _isEnabled = configuration.GetValue("Twilio:RequestValidation:Enabled", true);


       }





       public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)


       {


           if (!_isEnabled)


           {


               await next();


               return;


           }





           var httpContext = context.HttpContext;


           var request = httpContext.Request;





           var requestUrl = $"{request.Scheme}://{request.Host}{request.Path}{request.QueryString}";


           Dictionary<string, string> parameters = null;





           if (request.HasFormContentType)


           {


               var form = await request.ReadFormAsync(httpContext.RequestAborted).ConfigureAwait(false);


               parameters = form.ToDictionary(p => p.Key, p => p.Value.ToString());


           }





           var signature = request.Headers["X-Twilio-Signature"];


           var isValid = _requestValidator.Validate(requestUrl, parameters, signature);





           if (!isValid)


           {


               httpContext.Response.StatusCode = StatusCodes.Status403Forbidden;


               return;


           }





           await next();


       }


   }


}
To disable the request validation, you can now configure Twilio:RequestValidation:Enabled to false in your appsettings.json or appsettings.Development.json file.

What's next?
Validating requests to your Twilio webhooks is a great first step for securing your Twilio application. We recommend reading over our full security documentation for more advice on protecting your app, and the Anti-Fraud Developer's Guide in particular.
To learn more about securing your ASP.NET MVC application in general, check out the security considerations page in the official ASP.NET docs
.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Secure your C# / ASP.NET Core app by validating incoming Twilio requests | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
General Usage
Get started
Twilio APIs
Webhooks
Preventing Fraud
Troubleshooting and Security
Debug your Twilio application
Debug events webhooks
Alarms
Availability and Reliability
Security
ISO/IEC Certification
Reporting security vulnerabilities
Store Your Twilio Credentials Securely
Secure your app by validating incoming Twilio requests
C# / ASP.NET
C# / ASP.NET Core
C# / ASP.NET WEB API
Java / Servlets
Node.js / Express
PHP / Lumen
Python / Django
Python / Flask
Ruby / Sinatra
Go / Gin
Twilio products: API docs, quickstarts, and tutorials
Messaging
Voice
Video
Serverless
Flex
Studio
All docs...
SDKs
Help
Log in
Sign up
On this page
Create a custom filter attribute
Use the filter attribute with our Twilio webhooks
Configuration Options
Disable request validation during testing
What's next?
Secure your C# / ASP.NET WEB API app by validating incoming Twilio requests

(warning)
Warning
This guide is for ASP.NET Web API on the .NET Framework. For ASP.NET Core, see this guide. For ASP.NET MVC on the .NET Framework, see this guide.
In this guide, we'll cover how to secure your C# / ASP.NET Web API
 application by validating incoming requests to your Twilio webhooks are, in fact, from Twilio.
With a few lines of code, we'll write a custom filter attribute for our ASP.NET app that uses the Twilio C# SDK
's validator utility. This filter will then be invoked on the controller actions that accept Twilio webhooks to confirm that incoming requests genuinely originated from Twilio.
Let's get started!

Create a custom filter attribute
The Twilio C# SDK includes a RequestValidator class we can use to validate incoming requests.
We could include our request validation code as part of our controller, but this is a perfect opportunity to write an action filter attribute
. This way we can reuse our validation logic across all our controller actions which accept incoming requests from Twilio.
ASP.NET Web API filter attribute to validate Twilio requests
Confirm incoming requests to your controllers are genuine with this filter.
Copy code block
using System;


using System.Collections.Generic;


using System.Configuration;


using System.IO;


using System.Linq;


using System.Net;


using System.Net.Http;


using System.Threading;


using System.Threading.Tasks;


using System.Web.Http.Controllers;


using System.Web.Http.Filters;


using Twilio.Security;





namespace ValidateRequestExample.Filters


{


   [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]


   public class ValidateTwilioRequestAttribute : ActionFilterAttribute


   {


       private readonly string _authToken;


       private readonly string _urlSchemeAndDomain;





       public ValidateTwilioRequestAttribute()


       {


           _authToken = ConfigurationManager.AppSettings["TwilioAuthToken"];


           _urlSchemeAndDomain = ConfigurationManager.AppSettings["TwilioBaseUrl"];


       }





       public override async Task OnActionExecutingAsync(HttpActionContext actionContext, CancellationToken cancellationToken)


       {


           if (!await IsValidRequestAsync(actionContext.Request))


           {


               actionContext.Response = actionContext.Request.CreateErrorResponse(


                   HttpStatusCode.Forbidden,


                   "The Twilio request is invalid"


               );


           }





           await base.OnActionExecutingAsync(actionContext, cancellationToken);


       }





       private async Task<bool> IsValidRequestAsync(HttpRequestMessage request)


       {


           var headerExists = request.Headers.TryGetValues(


               "X-Twilio-Signature", out IEnumerable<string> signature);


           if (!headerExists) return false;





           var requestUrl = _urlSchemeAndDomain + request.RequestUri.PathAndQuery;


           var formData = await GetFormDataAsync(request.Content);


           return new RequestValidator(_authToken).Validate(requestUrl, formData, signature.First());


       }





       private async Task<IDictionary<string, string>> GetFormDataAsync(HttpContent content)


       {


           string postData;


           using (var stream = new StreamReader(await content.ReadAsStreamAsync()))


           {


               stream.BaseStream.Position = 0;


               postData = await stream.ReadToEndAsync();


           }





           if(!String.IsNullOrEmpty(postData) && postData.Contains("="))


           {


               return postData.Split('&')


                   .Select(x => x.Split('='))


                   .ToDictionary(


                       x => Uri.UnescapeDataString(x[0]),


                       x => Uri.UnescapeDataString(x[1].Replace("+", "%20"))


                   );


           }





           return new Dictionary<string, string>();


       }


   }


}


To validate an incoming request genuinely originated from Twilio, we first need to create an instance of the RequestValidator class passing it our Twilio Auth Token. Then we call its Validate method passing the requester URL, the form parameters, and the Twilio request signature.
That method will return True if the request is valid or False if it isn't. Our filter attribute then either continues processing the action or returns a 403 HTTP response for invalid requests.

Use the filter attribute with our Twilio webhooks
Now we're ready to apply our filter attribute to any controller action in our ASP.NET application that handles incoming requests from Twilio.
Apply the request validation filter attribute to a set of ApiController methods
Copy code block
using System.Net.Http;


using System.Text;


using System.Web.Http;


using Twilio.TwiML;


using Twilio.TwiML.Messaging;


using ValidateRequestExample.Filters;





namespace ValidateRequestExample.Controllers


{


   public class TwilioMessagingRequest


   {


       public string Body { get; set; }


   }





   public class TwilioVoiceRequest


   {


       public string From { get; set; }


   }





   public class IncomingController : ApiController


   {


       [Route("voice")]


       [AcceptVerbs("POST")]


       [ValidateTwilioRequest]


       public HttpResponseMessage PostVoice([FromBody] TwilioVoiceRequest voiceRequest)


       {


           var message =


               "Thanks for calling! " +


               $"Your phone number is {voiceRequest.From}. " +


               "I got your call because of Twilio's webhook. " +


               "Goodbye!";





           var response = new VoiceResponse();


           response.Say(message);


           response.Hangup();





           return ToResponseMessage(response.ToString());


       }





       [Route("message")]


       [AcceptVerbs("POST")]


       [ValidateTwilioRequest]


       public HttpResponseMessage PostMessage([FromBody] TwilioMessagingRequest messagingRequest)


       {


           var message =


               $"Your text to me was {messagingRequest.Body.Length} characters long. " +


               "Webhooks are neat :)";





           var response = new MessagingResponse();


           response.Append(new Message(message));





           return ToResponseMessage(response.ToString());


       }





       private static HttpResponseMessage ToResponseMessage(string response)


       {


           return new HttpResponseMessage


           {


               Content = new StringContent(response, Encoding.UTF8, "application/xml")


           };


       }


   }


}


To use the filter attribute with an existing view, just put [ValidateTwilioRequest] above the action's definition. In this sample application, we use our filter attribute with two controller actions: one that handles incoming phone calls and another that handles incoming text messages.
Configuration Options
You will need to add the following to your Web.config file, in the appSettings section:
Copy code block
   <add key="TwilioAuthToken" value="your_auth_token" />


   <add key="TwilioBaseUrl" value="https://????.ngrok.io"/>
You can get your Twilio Auth Token from the Twilio Console. The TwilioBaseUrl setting should be the public protocol and domain that you have configured on your Twilio phone number. For example, if you are using ngrok
, you would put your ngrok URL here. If you are deploying to Azure or another cloud provider, put your publicly accessible domain here and include https or http, as appropriate for your application.

Disable request validation during testing
If you write tests for your controller actions, those tests may fail where you use your Twilio request validation filter. Any requests your test suite sends to those actions will fail the filter's validation check.
To fix this problem we recommend adding an extra check in your filter attribute, like so, telling it to only reject incoming requests if your app is running in production.
An improved ASP.NET Web API request validation filter attribute, useful for testing
Use this version of the custom filter attribute if you test your controllers.
Copy code block
using System;


using System.Collections.Generic;


using System.Configuration;


using System.IO;


using System.Linq;


using System.Net;


using System.Net.Http;


using System.Threading;


using System.Threading.Tasks;


using System.Web.Http.Controllers;


using System.Web.Http.Filters;


using Twilio.Security;





namespace ValidateRequestExample.Filters


{


   [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]


   public class ValidateTwilioRequestImprovedAttribute : ActionFilterAttribute


   {


       private readonly string _authToken;


       private readonly string _urlSchemeAndDomain;


       private static bool IsTestEnvironment =>


           bool.Parse(ConfigurationManager.AppSettings["IsTestEnvironment"]);





       public ValidateTwilioRequestImprovedAttribute()


       {


           _authToken = ConfigurationManager.AppSettings["TwilioAuthToken"];


           _urlSchemeAndDomain = ConfigurationManager.AppSettings["TwilioBaseUrl"];


       }





       public override async Task OnActionExecutingAsync(HttpActionContext actionContext, CancellationToken cancellationToken)


       {


           if (!await IsValidRequestAsync(actionContext.Request) && !IsTestEnvironment)


           {


               actionContext.Response = actionContext.Request.CreateErrorResponse(


                   HttpStatusCode.Forbidden,


                   "The Twilio request is invalid"


               );


           }





           await base.OnActionExecutingAsync(actionContext, cancellationToken);


       }





       private async Task<bool> IsValidRequestAsync(HttpRequestMessage request)


       {


           var headerExists = request.Headers.TryGetValues(


               "X-Twilio-Signature", out IEnumerable<string> signature);


           if (!headerExists) return false;





           var requestUrl = _urlSchemeAndDomain + request.RequestUri.PathAndQuery;


           var formData = await GetFormDataAsync(request.Content);


           return new RequestValidator(_authToken).Validate(requestUrl, formData, signature.First());


       }





       private async Task<IDictionary<string, string>> GetFormDataAsync(HttpContent content)


       {


           string postData;


           using (var stream = new StreamReader(await content.ReadAsStreamAsync()))


           {


               stream.BaseStream.Position = 0;


               postData = await stream.ReadToEndAsync();


           }





           if (!String.IsNullOrEmpty(postData) && postData.Contains("="))


           {


               return postData.Split('&')


                   .Select(x => x.Split('='))


                   .ToDictionary(


                       x => Uri.UnescapeDataString(x[0]),


                       x => Uri.UnescapeDataString(x[1].Replace("+", "%20"))


                   );


           }





           return new Dictionary<string, string>();


       }


   }


}



What's next?
Validating requests to your Twilio webhooks is a great first step for securing your Twilio application. We recommend reading over our full security documentation for more advice on protecting your app, and the Anti-Fraud Developer's Guide in particular.
To learn more about securing your ASP.NET Web API application in general, check out the security considerations in the official ASP.NET Web API docs
.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Secure your C# / ASP.NET WEB API app by validating incoming Twilio requests | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
General Usage
Get started
Twilio APIs
Webhooks
Preventing Fraud
Troubleshooting and Security
Debug your Twilio application
Debug events webhooks
Alarms
Availability and Reliability
Security
ISO/IEC Certification
Reporting security vulnerabilities
Store Your Twilio Credentials Securely
Secure your app by validating incoming Twilio requests
C# / ASP.NET
C# / ASP.NET Core
C# / ASP.NET WEB API
Java / Servlets
Node.js / Express
PHP / Lumen
Python / Django
Python / Flask
Ruby / Sinatra
Go / Gin
Twilio products: API docs, quickstarts, and tutorials
Messaging
Voice
Video
Serverless
Flex
Studio
All docs...
SDKs
Help
Log in
Sign up
On this page
Create a custom filter
Use the filter with our Twilio webhooks
Disable request validation during testing
What's next?
Secure your Servlet app by validating incoming Twilio requests

In this guide we'll cover how to secure your Servlet application by validating incoming requests to your Twilio webhooks that are, in fact, from Twilio.
With a few lines of code, we'll write a custom filter for our Servlet app that uses the Twilio Java SDK's
 validator utility. This filter will then be invoked on the relevant paths that accept Twilio webhooks to confirm that incoming requests genuinely originated from Twilio.
Let's get started!

Create a custom filter
The Twilio Java SDK includes a RequestValidator class we can use to validate incoming requests.
We could include our request validation code as part of our Servlet, but this is a perfect opportunity to write a Java filter
. This way we can reuse our validation logic across all our Servlets which accept incoming requests from Twilio.
Use Servlet filter to validate Twilio requests
Confirm incoming requests to your Servlets are genuine with this filter.
Copy code block
package guide;





import com.twilio.security.RequestValidator;





import javax.servlet.*;


import javax.servlet.http.HttpServletRequest;


import javax.servlet.http.HttpServletResponse;


import java.io.IOException;


import java.util.Arrays;


import java.util.Collections;


import java.util.List;


import java.util.Map;


import java.util.stream.Collectors;





public class TwilioRequestValidatorFilter implements Filter {





   private RequestValidator requestValidator;





   @Override


   public void init(FilterConfig filterConfig) throws ServletException {


       requestValidator = new RequestValidator(System.getenv("TWILIO_AUTH_TOKEN"));


   }





   @Override


   public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)


           throws IOException, ServletException {





       boolean isValidRequest = false;


       if (request instanceof HttpServletRequest) {


           HttpServletRequest httpRequest = (HttpServletRequest) request;





           // Concatenates the request URL with the query string


           String pathAndQueryUrl = getRequestUrlAndQueryString(httpRequest);


           // Extracts only the POST parameters and converts the parameters Map type


           Map<String, String> postParams = extractPostParams(httpRequest);


           String signatureHeader = httpRequest.getHeader("X-Twilio-Signature");





           isValidRequest = requestValidator.validate(


                   pathAndQueryUrl,


                   postParams,


                   signatureHeader);


       }





       if(isValidRequest) {


           chain.doFilter(request, response);


       } else {


           ((HttpServletResponse)response).sendError(HttpServletResponse.SC_FORBIDDEN);


       }


   }





   @Override


   public void destroy() {


       // Nothing to do


   }





   private Map<String, String> extractPostParams(HttpServletRequest request) {


       String queryString = request.getQueryString();


       Map<String, String[]> requestParams = request.getParameterMap();


       List<String> queryStringKeys = getQueryStringKeys(queryString);





       return requestParams.entrySet().stream()


               .filter(e -> !queryStringKeys.contains(e.getKey()))


               .collect(Collectors.toMap(e -> e.getKey(), e -> e.getValue()[0]));


   }





   private List<String> getQueryStringKeys(String queryString) {


       if(queryString == null || queryString.length() == 0) {


           return Collections.emptyList();


       } else {


           return Arrays.stream(queryString.split("&"))


                   .map(pair -> pair.split("=")[0])


                   .collect(Collectors.toList());


       }


   }





   private String getRequestUrlAndQueryString(HttpServletRequest request) {


       String queryString = request.getQueryString();


       String requestUrl = request.getRequestURL().toString();


       if(queryString != null && !queryString.equals("")) {


           return requestUrl + "?" + queryString;


       }


       return requestUrl;


   }


}


The doFilter method will be executed before our Servlet, so it's here where we will validate that the request originated genuinely from Twilio, and prevent it from reaching our Servlet if it didn't. First, we gather the relevant request metadata (URL, query string and X-TWILIO-SIGNATURE header) and the POST parameters. We then pass this data onto the validate method of RequestValidator, which will return whether the validation was successful or not.
If the validation turns out successful, we continue executing other filters and eventually our Servlet. If it is unsuccessful, we stop the request and send a 403 - Forbidden response to the requester, in this case, Twilio.

Use the filter with our Twilio webhooks
Now we're ready to apply our filter to any path in our Servlet application that handles incoming requests from Twilio.
Apply the request validation filter to a set of Servlets
Apply a custom Twilio request validation filter to a set of Servlets used for Twilio webhooks.
Copy code block
<?xml version="1.0" encoding="UTF-8"?>


<web-app version="3.0"


        metadata-complete="true"


        xmlns="http://java.sun.com/xml/ns/javaee"


        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"


        xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd">





   <servlet>


       <servlet-name>voiceHandler</servlet-name>


       <servlet-class>guide.VoiceHandlerServlet</servlet-class>


   </servlet>





   <servlet>


       <servlet-name>messageHandler</servlet-name>


       <servlet-class>guide.MessageHandlerServlet</servlet-class>


   </servlet>





   <servlet-mapping>


       <servlet-name>voiceHandler</servlet-name>


       <url-pattern>/voice</url-pattern>


   </servlet-mapping>





   <servlet-mapping>


       <servlet-name>messageHandler</servlet-name>


       <url-pattern>/message</url-pattern>


   </servlet-mapping>





   <filter>


       <filter-name>requestValidatorFilter</filter-name>


       <filter-class>guide.TwilioRequestValidatorFilter</filter-class>


   </filter>


   <filter-mapping>


       <filter-name>requestValidatorFilter</filter-name>


       <url-pattern>/*</url-pattern>


   </filter-mapping>


</web-app>


To use the filter just add <filter> and <filter-mapping> sections to your web.xml. No changes are needed in the actual Servlets.
In the <filter> section we give a name to be used within your web.xml. In this case requestValidatorFilter. We also point to the filter class using its fully qualified name.
In the <filter-mapping> section, we configure what paths in our container will use TwilioRequestFilter when receiving a request. It uses URL patterns to select those paths, and you can have multiple <url-pattern> elements in this section. Since we want to apply the filter to both Servlets, we use their common root path.
Note: If your Twilio webhook URLs start with https:// instead of http://, your request validator may fail locally when you use Ngrok or in production if your stack terminates SSL connections upstream from your app. This is because the request URL that your Servlet application sees does not match the URL Twilio used to reach your application.
To fix this for local development with Ngrok, use http:// for your webhook instead of https://. To fix this in your production app, your filter will need to reconstruct the request's original URL using request headers like X-Original-Host and X-Forwarded-Proto, if available.

Disable request validation during testing
If you write tests for your Servlets those tests may fail where you use your Twilio request validation filter. Any requests your test suite sends to those Servlets will fail the filter's validation check.
To fix this problem we recommend adding an extra check in your filter, like so, telling it to only reject incoming requests if your app is running in production.
An improved request validation filter, useful for testing
Use this version of the custom filter if you test your Servlets.
Copy code block
package guide;





import com.twilio.security.RequestValidator;





import javax.servlet.*;


import javax.servlet.http.HttpServletRequest;


import javax.servlet.http.HttpServletResponse;


import java.io.IOException;


import java.util.Arrays;


import java.util.Collections;


import java.util.List;


import java.util.Map;


import java.util.stream.Collectors;





public class TwilioRequestValidatorFilter implements Filter {





   private final String currentEnvironment = System.getenv("ENVIRONMENT");





   private RequestValidator requestValidator;





   @Override


   public void init(FilterConfig filterConfig) throws ServletException {


       requestValidator = new RequestValidator(System.getenv("TWILIO_AUTH_TOKEN"));


   }





   @Override


   public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)


           throws IOException, ServletException {





       boolean isValidRequest = false;


       if (request instanceof HttpServletRequest) {


           HttpServletRequest httpRequest = (HttpServletRequest) request;





           // Concatenates the request URL with the query string


           String pathAndQueryUrl = getRequestUrlAndQueryString(httpRequest);


           // Extracts only the POST parameters and converts the parameters Map type


           Map<String, String> postParams = extractPostParams(httpRequest);


           String signatureHeader = httpRequest.getHeader("X-Twilio-Signature");





           isValidRequest = requestValidator.validate(


                   pathAndQueryUrl,


                   postParams,


                   signatureHeader);


       }





       if(isValidRequest || environmentIsTest()) {


           chain.doFilter(request, response);


       } else {


           ((HttpServletResponse)response).sendError(HttpServletResponse.SC_FORBIDDEN);


       }


   }





   @Override


   public void destroy() {


       // Nothing to do


   }





   private boolean environmentIsTest() {


       return "test".equals(currentEnvironment);


   }





   private Map<String, String> extractPostParams(HttpServletRequest request) {


       String queryString = request.getQueryString();


       Map<String, String[]> requestParams = request.getParameterMap();


       List<String> queryStringKeys = getQueryStringKeys(queryString);





       return requestParams.entrySet().stream()


               .filter(e -> !queryStringKeys.contains(e.getKey()))


               .collect(Collectors.toMap(e -> e.getKey(), e -> e.getValue()[0]));


   }





   private List<String> getQueryStringKeys(String queryString) {


       if(queryString == null || queryString.length() == 0) {


           return Collections.emptyList();


       } else {


           return Arrays.stream(queryString.split("&"))


                   .map(pair -> pair.split("=")[0])


                   .collect(Collectors.toList());


       }


   }





   private String getRequestUrlAndQueryString(HttpServletRequest request) {


       String queryString = request.getQueryString();


       String requestUrl = request.getRequestURL().toString();


       if(queryString != null && queryString != "") {


           return requestUrl + "?" + queryString;


       }


       return requestUrl;


   }


}



What's next?
Validating requests to your Twilio webhooks is a great first step for securing your Twilio application. We recommend reading over our full security documentation for more advice on protecting your app, and the Anti-Fraud Developer's Guide in particular.
To learn more about securing your Servlet application in general, check out the security considerations page in the official Oracle docs
.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Secure your Servlet app by validating incoming Twilio requests | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
General Usage
Get started
Twilio APIs
Webhooks
Preventing Fraud
Troubleshooting and Security
Debug your Twilio application
Debug events webhooks
Alarms
Availability and Reliability
Security
ISO/IEC Certification
Reporting security vulnerabilities
Store Your Twilio Credentials Securely
Secure your app by validating incoming Twilio requests
C# / ASP.NET
C# / ASP.NET Core
C# / ASP.NET WEB API
Java / Servlets
Node.js / Express
PHP / Lumen
Python / Django
Python / Flask
Ruby / Sinatra
Go / Gin
Twilio products: API docs, quickstarts, and tutorials
Messaging
Voice
Video
Serverless
Flex
Studio
All docs...
SDKs
Help
Log in
Sign up
On this page
Use Twilio Express request validation middleware
Use a tunnel for your local development environment in order to use live Twilio webhooks
Disable request validation during testing
What's next?
Secure your Express app by validating incoming Twilio requests

In this guide we'll cover how to secure your Express
 application by validating incoming requests to your Twilio webhooks are, in fact, from Twilio.
Securing your Express app with Twilio Node SDK's
 is simple. The Twilio SDK comes with an Express middleware which is ready to use.
Let's get started!

Use Twilio Express request validation middleware
The Twilio Node SDK includes a webhook() method which we can use as an Express middleware to validate incoming requests. When applied to an Express route, if the request is unauthorized the middleware will return a 403 HTTP response.
Use Twilio webhook middleware for Express apps that validates Twilio requests
Confirm incoming requests to your Express routes are genuine with this custom middleware.
Copy code block
// You can find your Twilio Auth Token here: https://www.twilio.com/console


// Set at runtime as follows:


// $ TWILIO_AUTH_TOKEN=XXXXXXXXXXXXXXXXXXX node index.js


//


// This will not work unless you set the TWILIO_AUTH_TOKEN environment


// variable.





const twilio = require('twilio');


const app = require('express')();


const bodyParser = require('body-parser');


const VoiceResponse = require('twilio').twiml.VoiceResponse;


const MessagingResponse = require('twilio').twiml.MessagingResponse;





app.use(bodyParser.urlencoded({ extended: false }));





app.post('/voice', twilio.webhook(), (req, res) => {


 // Twilio Voice URL - receives incoming calls from Twilio


 const response = new VoiceResponse();





 response.say(


   `Thanks for calling!


    Your phone number is ${req.body.From}. I got your call because of Twilio´s


    webhook. Goodbye!`


 );





 res.set('Content-Type', 'text/xml');


 res.send(response.toString());


});





app.post('/message', twilio.webhook(), (req, res) => {


 // Twilio Messaging URL - receives incoming messages from Twilio


 const response = new MessagingResponse();





 response.message(`Your text to me was ${req.body.Body.length} characters long.


                   Webhooks are neat :)`);





 res.set('Content-Type', 'text/xml');


 res.send(response.toString());


});





app.listen(3000);



Use a tunnel for your local development environment in order to use live Twilio webhooks
If your Twilio webhook URLs start with https:// instead of http://, your request validator may fail locally when you use ngrok
 or in production if your stack terminates SSL connections upstream from your app. This is because the request URL that your Express application sees does not match the URL Twilio used to reach your application.
To fix this for local development with ngrok, use ngrok http 3000 to accept requests on your webhooks instead of ngrok https 3000.

Disable request validation during testing
If you write tests for your Express routes those tests may fail for routes where you use the Twilio request validation middleware. Any requests your test suite sends to those routes will fail the middleware validation check.
To fix this problem we recommend passing {validate: false} to the validation middleware twilio.webhook() thus disabling it. In Express applications it's typical to use NODE_ENV as the value to use to determine the environment the application is running in. In the code example, when NODE_ENV is 'test', the validation middleware should be disabled.
Disable Twilio webhook middleware when testing Express routes.
Use environment variable to disable webhook validation during testing.
Copy code block
// You can find your Twilio Auth Token here: https://www.twilio.com/console


// Set at runtime as follows:


// $ TWILIO_AUTH_TOKEN=XXXXXXXXXXXXXXXXXXX node index.js


//


// This will not work unless you set the TWILIO_AUTH_TOKEN environment


// variable.





const twilio = require('twilio');


const app = require('express')();


const bodyParser = require('body-parser');


const VoiceResponse = require('twilio').twiml.VoiceResponse;


const MessagingResponse = require('twilio').twiml.MessagingResponse;





const shouldValidate = process.env.NODE_ENV !== 'test';





app.use(bodyParser.urlencoded({ extended: false }));





app.post('/voice', twilio.webhook({ validate: shouldValidate }), (req, res) => {


 // Twilio Voice URL - receives incoming calls from Twilio


 const response = new VoiceResponse();





 response.say(


   `Thanks for calling!


    Your phone number is ${req.body.From}. I got your call because of Twilio´s


    webhook. Goodbye!`


 );





 res.set('Content-Type', 'text/xml');


 res.send(response.toString());


});





app.post(


 '/message',


 twilio.webhook({ validate: shouldValidate }),


 (req, res) => {


   // Twilio Messaging URL - receives incoming messages from Twilio


   const response = new MessagingResponse();





   response.message(`Your text to me was ${req.body.Body


     .length} characters long.


                   Webhooks are neat :)`);





   res.set('Content-Type', 'text/xml');


   res.send(response.toString());


 }


);





app.listen(3000);



What's next?
Validating requests to your Twilio webhooks is a great first step for securing your Twilio application. We recommend reading over our full security documentation for more advice on protecting your app, and the Anti-Fraud Developer's Guide in particular.
To learn more about securing your Express application in general, check out the security considerations page in the official Express docs.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Secure your Express app by validating incoming Twilio requests | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
General Usage
Get started
Twilio APIs
Webhooks
Preventing Fraud
Troubleshooting and Security
Debug your Twilio application
Debug events webhooks
Alarms
Availability and Reliability
Security
ISO/IEC Certification
Reporting security vulnerabilities
Store Your Twilio Credentials Securely
Secure your app by validating incoming Twilio requests
C# / ASP.NET
C# / ASP.NET Core
C# / ASP.NET WEB API
Java / Servlets
Node.js / Express
PHP / Lumen
Python / Django
Python / Flask
Ruby / Sinatra
Go / Gin
Twilio products: API docs, quickstarts, and tutorials
Messaging
Voice
Video
Serverless
Flex
Studio
All docs...
SDKs
Help
Log in
Sign up
On this page
Create custom middleware
Apply the request validation middleware to webhooks
Use a tunnel for your local development environment in order to use live Twilio webhooks
Disable request validation during testing
What's next?
Secure your PHP/Lumen app by validating incoming Twilio requests

In this guide we'll cover how to secure your Lumen
 application by validating incoming requests to your Twilio webhooks are, in fact, from Twilio.
With a few lines of code we'll write a custom middleware for our Lumen app that uses the Twilio PHP SDK's
 RequestValidator
 utility. We can then use that middleware on our Lumen routes which accept Twilio webhooks to confirm that incoming requests genuinely originated from Twilio.
Let's get started!

Create custom middleware
The Twilio PHP SDK includes a RequestValidator utility which we can use to validate incoming requests.
We could include our request validation code as part of each Lumen route, but this is a perfect opportunity to write Lumen middleware. This way we can reuse our validation logic across all our routes which accept incoming requests from Twilio.
To validate an incoming request genuinely originated from Twilio, we need to call the $requestValidator->validate(...). That method will return true if the request is valid or false if it isn't. Our middleware then either continues processing the view or returns a 403 HTTP response for unauthorized requests.
Create Lumen middleware to handle and validate requests
Use Twilio SDK RequestValidator to validate webhook requests.
Copy code block
<?php





namespace App\Http\Middleware;





use Closure;


use Illuminate\Http\Response;


use Twilio\Security\RequestValidator;





class TwilioRequestValidator


{


   /**


    * Handle an incoming request.


    *


    * @param  \Illuminate\Http\Request  $request


    * @param  \Closure  $next


    * @return mixed


    */


   public function handle($request, Closure $next)


   {


     // Be sure TWILIO_AUTH_TOKEN is set in your .env file.


     // You can get your authentication token in your twilio console https://www.twilio.com/console


     $requestValidator = new RequestValidator(env('TWILIO_AUTH_TOKEN'));





     $requestData = $request->toArray();





     // Switch to the body content if this is a JSON request.


     if (array_key_exists('bodySHA256', $requestData)) {


       $requestData = $request->getContent();


     }





     $isValid = $requestValidator->validate(


       $request->header('X-Twilio-Signature'),


       $request->fullUrl(),


       $requestData


     );





     if ($isValid) {


       return $next($request);


     } else {


       return new Response('You are not Twilio :(', 403);


     }


   }


}



Apply the request validation middleware to webhooks
Apply a custom Twilio request validation middleware to all Lumen routes used for Twilio webhooks.
To use the middleware with your routes, first, you must add the middleware to bootstrap/app.php in the Register Middleware section:
Copy code block
$app->routeMiddleware([


 'TwilioRequestValidator' => App\Http\Middleware\TwilioRequestValidator::class,


]);
Then you must add the middleware to each route as shown here.
Create Lumen routes to handle Twilio requests.
Creates a route for /voice and /message to handle the respective webhooks.
Copy code block
<?php





use Illuminate\Http\Request;


use Twilio\TwiML\MessagingResponse;


use Twilio\TwiML\VoiceResponse;





// Note: $app was changed for $router since Lumen 5.5.0


// Reference: https://lumen.laravel.com/docs/5.5/upgrade#upgrade-5.5.0





$router->post('voice', ['middleware' => 'TwilioRequestValidator',


 function() {


   $twiml = new VoiceResponse();


   $twiml->say('Hello World!');





   return response($twiml)->header('Content-Type', 'text/xml');


 }


]);





$router->post('message', ['middleware' => 'TwilioRequestValidator',


 function(Request $request) {


   $bodyLength = strlen($request->input('Body'));





   $twiml = new MessagingResponse();


   $twiml->message("Your text to me was $bodyLength characters long. ".


                   "Webhooks are neat :)");





   return response($twiml)->header('Content-Type', 'text/xml');


 }


]);



Use a tunnel for your local development environment in order to use live Twilio webhooks
If your Twilio webhook URLs start with https:// instead of http://, your request validator may fail locally when you use ngrok
 or in production if your stack terminates SSL connections upstream from your app. This is because the request URL that your Express application sees does not match the URL Twilio used to reach your application.
To fix this for local development with ngrok, use ngrok http 3000 to accept requests on your webhooks instead of ngrok https 3000.

Disable request validation during testing
If you write tests for your Lumen routes those tests may fail for routes where you use your Twilio request validation middleware. Any requests your test suite sends to those routes will fail the middleware validation check.
To fix this problem we recommend adding an extra check in your middleware, like shown here, telling it to only reject incoming requests if your app is running in production.
Disable Twilio request validation when testing
Use APP_ENV environment variable to disable request validation.
Copy code block
<?php





namespace App\Http\Middleware;





use Closure;


use Illuminate\Http\Response;


use Twilio\Security\RequestValidator;





class TwilioRequestValidator


{


   /**


    * Handle an incoming request.


    *


    * @param  \Illuminate\Http\Request  $request


    * @param  \Closure  $next


    * @return mixed


    */


   public function handle($request, Closure $next)


   {


     if (env('APP_ENV') === 'test') {


       return $next($request);


     }





     // Be sure TWILIO_AUTH_TOKEN is set in your .env file.


     // You can get your authentication token in your twilio console https://www.twilio.com/console


     $requestValidator = new RequestValidator(env('TWILIO_AUTH_TOKEN'));





     $isValid = $requestValidator->validate(


       $request->header('X-Twilio-Signature'),


       $request->fullUrl(),


       $request->toArray()


     );





     if ($isValid) {


       return $next($request);


     } else {


       return new Response('You are not Twilio :(', 403);


     }


   }


}



What's next?
Validating requests to your Twilio webhooks is a great first step for securing your Twilio application. We recommend reading over our full security documentation for more advice on protecting your app, and the Anti-Fraud Developer's Guide in particular.
Learn more about setting up your PHP development environment.
To learn more about securing your Lumen application in general, check out the security considerations page in the official Lumen docs
.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Secure your PHP/Lumen app by validating incoming Twilio requests | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
General Usage
Get started
Twilio APIs
Webhooks
Preventing Fraud
Troubleshooting and Security
Debug your Twilio application
Debug events webhooks
Alarms
Availability and Reliability
Security
ISO/IEC Certification
Reporting security vulnerabilities
Store Your Twilio Credentials Securely
Secure your app by validating incoming Twilio requests
C# / ASP.NET
C# / ASP.NET Core
C# / ASP.NET WEB API
Java / Servlets
Node.js / Express
PHP / Lumen
Python / Django
Python / Flask
Ruby / Sinatra
Go / Gin
Twilio products: API docs, quickstarts, and tutorials
Messaging
Voice
Video
Serverless
Flex
Studio
All docs...
SDKs
Help
Log in
Sign up
On this page
Create a custom decorator
Use the decorator with our Twilio webhooks
Disable request validation during testing
What's next?
Secure your Django project by validating incoming Twilio requests

In this guide we'll cover how to secure your Django
 application by validating incoming requests to your Twilio webhooks are, in fact, from Twilio.
With a few lines of code, we'll write a custom decorator for our Django project that uses the Twilio Python SDK's validator utility. We can then use that decorator on our Django views which accept Twilio webhooks to confirm that incoming requests genuinely originated from Twilio.
Let's get started!

Create a custom decorator
The Twilio Python SDK includes a RequestValidator class we can use to validate incoming requests.
We could include our request validation code as part of our Django views, but this is a perfect opportunity to write a Python decorator
. This way we can reuse our validation logic across all our views which accept incoming requests from Twilio.
Custom decorator for Django projects to validate Twilio requests
Confirm incoming requests to your Django views are genuine with this custom decorator.
Copy code block
from django.http import HttpResponse, HttpResponseForbidden


from functools import wraps


from twilio import twiml


from twilio.request_validator import RequestValidator





import os








def validate_twilio_request(f):


   """Validates that incoming requests genuinely originated from Twilio"""


   @wraps(f)


   def decorated_function(request, *args, **kwargs):


       # Create an instance of the RequestValidator class


       validator = RequestValidator(os.environ.get('TWILIO_AUTH_TOKEN'))





       # Validate the request using its URL, POST data,


       # and X-TWILIO-SIGNATURE header


       request_valid = validator.validate(


           request.build_absolute_uri(),


           request.POST,


           request.META.get('HTTP_X_TWILIO_SIGNATURE', ''))





       # Continue processing the request if it's valid, return a 403 error if


       # it's not


       if request_valid:


           return f(request, *args, **kwargs)


       else:


           return HttpResponseForbidden()


   return decorated_function


To validate an incoming request genuinely originated from Twilio, we first need to create an instance of the RequestValidator class using our Twilio auth token. After that we call its validate method, passing in the request's URL, payload, and the value of the request's X-TWILIO-SIGNATURE header.
That method will return True if the request is valid or False if it isn't. Our decorator then either continues processing the view or returns a 403 HTTP response for inauthentic requests.

Use the decorator with our Twilio webhooks
Now we're ready to apply our decorator to any view in our Django project that handles incoming requests from Twilio.
Apply the request validation decorator to a Django view
Apply a custom Twilio request validation decorator to a Django view used for Twilio webhooks.
Copy code block
from django.http import HttpResponse


from django.views.decorators.csrf import csrf_exempt


from django.views.decorators.http import require_POST


from twilio.twiml.voice_response import VoiceResponse, MessagingResponse








@require_POST


@csrf_exempt


@validate_twilio_request


def incoming_call(request):


   """Twilio Voice URL - receives incoming calls from Twilio"""


   # Create a new TwiML response


   resp = VoiceResponse()





   # <Say> a message to the caller


   from_number = request.POST['From']


   body = """


   Thanks for calling!





   Your phone number is {0}. I got your call because of Twilio's webhook.





   Goodbye!""".format(' '.join(from_number))


   resp.say(body)





   # Return the TwiML


   return HttpResponse(resp)








@require_POST


@csrf_exempt


@validate_twilio_request


def incoming_message(request):


   """Twilio Messaging URL - receives incoming messages from Twilio"""


   # Create a new TwiML response


   resp = MessagingResponse()





   # <Message> a text back to the person who texted us


   body = "Your text to me was {0} characters long. Webhooks are neat :)" \


       .format(len(request.POST['Body']))


   resp.message(body)





   # Return the TwiML


   return HttpResponse(resp)


To use the decorator with an existing view, just put @validate_twilio_request above the view's definition. In this sample application, we use our decorator with two views: one that handles incoming phone calls and another that handles incoming text messages.
Note: If your Twilio webhook URLs start with https:// instead of http://, your request validator may fail locally when you use Ngrok or in production if your stack terminates SSL connections upstream from your app. This is because the request URL that your Django application sees does not match the URL Twilio used to reach your application.
To fix this for local development with Ngrok, use http:// for your webhook instead of https://. To fix this in your production app, your decorator will need to reconstruct the request's original URL using request headers like X-Original-Host and X-Forwarded-Proto, if available.

Disable request validation during testing
If you write tests for your Django views those tests may fail for views where you use your Twilio request validation decorator. Any requests your test suite sends to those views will fail the decorator's validation check.
To fix this problem we recommend adding an extra check in your decorator, like so, telling it to only reject incoming requests if your app is running in production.
An improved Django request validation decorator, useful for testing
Use this version of the custom Django decorator if you test your Django views.
Copy code block
from django.conf import settings


from django.http import HttpResponseForbidden


from functools import wraps


from twilio.request_validator import RequestValidator





import os








def validate_twilio_request(f):


   """Validates that incoming requests genuinely originated from Twilio"""


   @wraps(f)


   def decorated_function(request, *args, **kwargs):


       # Create an instance of the RequestValidator class


       validator = RequestValidator(os.environ.get('TWILIO_AUTH_TOKEN'))





       # Validate the request using its URL, POST data,


       # and X-TWILIO-SIGNATURE header


       request_valid = validator.validate(


           request.build_absolute_uri(),


           request.POST,


           request.META.get('HTTP_X_TWILIO_SIGNATURE', ''))





       # Continue processing the request if it's valid (or if DEBUG is True)


       # and return a 403 error if it's not


       if request_valid or settings.DEBUG:


           return f(request, *args, **kwargs)


       else:


           return HttpResponseForbidden()


   return decorated_function



What's next?
Validating requests to your Twilio webhooks is a great first step for securing your Twilio application. We recommend reading over our full security documentation for more advice on protecting your app, and the Anti-Fraud Developer's Guide in particular.
To learn more about securing your Django application in general, check out the official Django security docs
.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Secure your Django project by validating incoming Twilio requests | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
General Usage
Get started
Twilio APIs
Webhooks
Preventing Fraud
Troubleshooting and Security
Debug your Twilio application
Debug events webhooks
Alarms
Availability and Reliability
Security
ISO/IEC Certification
Reporting security vulnerabilities
Store Your Twilio Credentials Securely
Secure your app by validating incoming Twilio requests
C# / ASP.NET
C# / ASP.NET Core
C# / ASP.NET WEB API
Java / Servlets
Node.js / Express
PHP / Lumen
Python / Django
Python / Flask
Ruby / Sinatra
Go / Gin
Twilio products: API docs, quickstarts, and tutorials
Messaging
Voice
Video
Serverless
Flex
Studio
All docs...
SDKs
Help
Log in
Sign up
On this page
Create a custom decorator
Use the Decorator with our Twilio Webhooks
Disable Request Validation During Testing
Test the validity of your webhook signature
What's next?
Secure your Flask App by Validating Incoming Twilio Requests

In this guide we'll cover how to secure your Flask
 application by validating incoming requests to your Twilio webhooks are, in fact, from Twilio.
With a few lines of code, we'll write a custom decorator for our Flask app that uses the Twilio Python SDK's validator utility. We can then use that decorator on our Flask views which accept Twilio webhooks to confirm that incoming requests genuinely originated from Twilio.
Let's get started!

Create a custom decorator
The Twilio Python SDK includes a RequestValidator class we can use to validate incoming requests.
We could include our request validation code as part of our Flask views, but this is a perfect opportunity to write a Python decorator
. This way we can reuse our validation logic across all our views which accept incoming requests from Twilio.
Custom decorator for Flask apps to validate Twilio requests
Confirm incoming requests to your Flask views are genuine with this custom decorator.
Copy code block
from flask import abort, Flask, request


from functools import wraps


from twilio.request_validator import RequestValidator





import os








app = Flask(__name__)








def validate_twilio_request(f):


   """Validates that incoming requests genuinely originated from Twilio"""


   @wraps(f)


   def decorated_function(*args, **kwargs):


       # Create an instance of the RequestValidator class


       validator = RequestValidator(os.environ.get('TWILIO_AUTH_TOKEN'))





       # Validate the request using its URL, POST data,


       # and X-TWILIO-SIGNATURE header


       request_valid = validator.validate(


           request.url,


           request.form,


           request.headers.get('X-TWILIO-SIGNATURE', ''))





       # Continue processing the request if it's valid, return a 403 error if


       # it's not


       if request_valid:


           return f(*args, **kwargs)


       else:


           return abort(403)


   return decorated_function


To validate an incoming request genuinely originated from Twilio, we first need to create an instance of the RequestValidator class using our Twilio auth token. After that we call its validate method, passing in the request's URL, payload, and the value of the request's X-TWILIO-SIGNATURE header.
That method will return True if the request is valid or False if it isn't. Our decorator then either continues processing the view or returns a 403 HTTP response for inauthentic requests.
(warning)
Warning
If you are passing query string parameters in the URLs used in the webhooks you are validating, you may need to take extra care to encode or decode the URL so that validation passes. Some web frameworks like Flask will sometimes automatically unescape the query string part of the request URL, causing validation to fail.

Use the Decorator with our Twilio Webhooks
Now we're ready to apply our decorator to any view in our Flask application that handles incoming requests from Twilio.
Apply the request validation decorator to a Flask view
Apply a custom Twilio request validation decorator to a Flask view used for Twilio webhooks.
Copy code block
from flask import Flask, request


from twilio.twiml.voice_response import VoiceResponse, MessagingResponse








app = Flask(__name__)








@app.route('/voice', methods=['POST'])


@validate_twilio_request


def incoming_call():


   """Twilio Voice URL - receives incoming calls from Twilio"""


   # Create a new TwiML response


   resp = VoiceResponse()





   # <Say> a message to the caller


   from_number = request.values['From']


   body = """


   Thanks for calling!





   Your phone number is {0}. I got your call because of Twilio's webhook.





   Goodbye!""".format(' '.join(from_number))


   resp.say(body)





   # Return the TwiML


   return str(resp)








@app.route('/message', methods=['POST'])


@validate_twilio_request


def incoming_message():


   """Twilio Messaging URL - receives incoming messages from Twilio"""


   # Create a new TwiML response


   resp = MessagingResponse()





   # <Message> a text back to the person who texted us


   body = "Your text to me was {0} characters long. Webhooks are neat :)" \


       .format(len(request.values['Body']))


   resp.message(body)





   # Return the TwiML


   return str(resp)








if __name__ == '__main__':


   app.run(debug=True)


To use the decorator with an existing view, just put @validate_twilio_request above the view's definition. In this sample application, we use our decorator with two views: one that handles incoming phone calls and another that handles incoming text messages.
(warning)
Warning
If your Twilio webhook URLs start with https\:// instead of http\://, your request validator may fail locally when you use Ngrok or in production if your stack terminates SSL connections upstream from your app. This is because the request URL that your Flask application sees does not match the URL Twilio used to reach your application.
To fix this for local development with Ngrok, use http\:// for your webhook instead of https\://. To fix this in your production app, your decorator will need to reconstruct the request's original URL using request headers like X-Original-Host and X-Forwarded-Proto, if available.

Disable Request Validation During Testing
If you write tests for your Flask views those tests may fail for views where you use your Twilio request validation decorator. Any requests your test suite sends to those views will fail the decorator's validation check.
To fix this problem we recommend adding an extra check in your decorator, like so, telling it to only reject incoming requests if your app is running in production.
An improved Flask request validation decorator, useful for testing
Use this version of the custom Flask decorator if you test your Flask views.
Copy code block
from flask import abort, current_app, request


from functools import wraps


from twilio.request_validator import RequestValidator





import os








def validate_twilio_request(f):


   """Validates that incoming requests genuinely originated from Twilio"""


   @wraps(f)


   def decorated_function(*args, **kwargs):


       # Create an instance of the RequestValidator class


       validator = RequestValidator(os.environ.get('TWILIO_AUTH_TOKEN'))





       # Validate the request using its URL, POST data,


       # and X-TWILIO-SIGNATURE header


       request_valid = validator.validate(


           request.url,


           request.form,


           request.headers.get('X-TWILIO-SIGNATURE', ''))





       # Continue processing the request if it's valid (or if DEBUG is True)


       # and return a 403 error if it's not


       if request_valid or current_app.debug:


           return f(*args, **kwargs)


       else:


           return abort(403)


   return decorated_function



Test the validity of your webhook signature
(information)
Info
It's a great idea to run automated testing against your webhooks to ensure that their signatures are secure. The following Python code can test your unique endpoints against both valid and invalid signatures.
To make this test work for you, you'll need to:
Set your Auth Token
 as an environment variable
Set the URL to the endpoint you want to test
If testing BasicAuth, change HTTPDigestAuth to HTTPBasicAuth
Test the validity of your webhook signature
This sample test will test the validity of your webhook signature with HTTP Basic or Digest authentication.
Copy code block
# Download the twilio-python library from twilio.com/docs/python/install


from twilio.request_validator import RequestValidator


from requests.auth import HTTPDigestAuth


from requests.auth import HTTPBasicAuth


import requests


import urllib


import os





# Your Auth Token from twilio.com/user/account saved as an environment variable


# Remember never to hard code your auth token in code, browser Javascript, or distribute it in mobile apps


auth_token = os.environ.get('TWILIO_AUTH_TOKEN')


validator = RequestValidator(auth_token)





# Replace this URL with your unique URL


url = 'https://example.com/myapp'


# User credentials if required by your web server. Change to 'HTTPBasicAuth' if needed


auth = HTTPDigestAuth('username', 'password')





params = {


   'CallSid': 'CA1234567890ABCDE',


   'Caller': '+12349013030',


   'Digits': '1234',


   'From': '+12349013030',


   'To': '+18005551212'


}





def test_url(method, url, params, valid):


   if method == "GET":


       url = url + '?' + urllib.parse.urlencode(params)


       params = {}





   if valid:


       signature = validator.compute_signature(url, params)


   else:


       signature = validator.compute_signature("http://invalid.com", params)





   headers = {'X-Twilio-Signature': signature}


   response = requests.request(method, url, headers=headers, data=params, auth=auth)


   print('HTTP {0} with {1} signature returned {2}'.format(method, 'valid' if valid else 'invalid', response.status_code))








test_url('GET', url, params, True)


test_url('GET', url, params, False)


test_url('POST', url, params, True)


test_url('POST', url, params, False)

What's next?
Validating requests to your Twilio webhooks is a great first step for securing your Twilio application. We recommend reading over our full security documentation for more advice on protecting your app, and the Anti-Fraud Developer's Guide in particular.
To learn more about securing your Flask application in general, check out the security considerations page in the official Flask docs
.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Secure your Flask App by Validating Incoming Twilio Requests | Twilio

