# Twilio Functions

This document provides documentation for Twilio Functions serverless platform.
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Migration guides
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
Key features
What it does
Get started with Serverless and Twilio Functions
Learn the basics for handling SMS, MMS, and phone calls
Learn how to leverage APIs
Learn how headers and cookies can add extra functionality and security
Learn how to integrate Functions with Twilio Studio
Learn other common use cases
What's next?
Functions

Twilio Functions is a serverless environment that empowers developers to quickly create production-grade, event-driven Twilio applications that scale with their businesses.

Key features
Secure by default - Automatically ensure that only Twilio requests can execute your code
Serverless - Offload your operational burden to Twilio and skip maintaining any infrastructure
Autoscaling - Automatically add capacity to meet the unique demands of your application
Native Twilio integration - Use Functions as a first-class member of the Twilio console with a pre-initialized Twilio Node.js Helper Library
 built in
Familiar - Work in an environment powered by Node 22



What it does

Expand image
Twilio Functions replaces your need to find hosting or stand up a server to serve TwiML or any other HTTP-based responses. With Functions, you no longer have to worry about maintaining or scaling your web infrastructure—it's all managed seamlessly by Twilio, scaling with your use case.
Typical use cases include manipulating voice calls, serving up tokens for our mobile SDKs, or invoking the Twilio REST API in response to an event, such as an inbound SMS.

Get started with Serverless and Twilio Functions
The Twilio Functions and Assets Editor brings together Functions, Assets, Dependencies, Environment Variables, and Debugging in the same window. You can upload and create Assets. You can access all your Functions to edit them in multiple tabs simultaneously.

Expand image
We have put together code examples that you can use to get your application development started with Twilio Functions and Assets.
Learn the basics for handling SMS, MMS, and phone calls
Receive inbound SMS
Send SMS and MMS
Receive incoming phone calls
Make a Call
Learn how to leverage APIs
Make an API request
Learn how headers and cookies can add extra functionality and security
Enable CORS between Flex Plugins and Functions
Validate Webhook requests from SendGrid
Manage application state with cookies
Protect your Function with Basic Auth
Protect your Function with JSON Web Token (JWT)
Learn how to integrate Functions with Twilio Studio
Use the Run Function widget in Studio
Add delay
Normalize telephone numbers
Learn other common use cases
Use Twilio Sync to manage real-time data in your applications
Determine carrier, phone number type, and caller info
Time of day routing
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions

What's next?
Now that you've been introduced to what Functions can do, it's important to also have an understanding of how this all works, particularly the way that requests are sent to your Function.
If you'd rather skip that and get straight to the nuts and bolts of all the values and tools at your disposal from within a Function, we understand.
Understand the mechanics of and limitations on requests to your Twilio Function
Understand the execution process, handler method, and response building processes

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Functions | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Function request flow
Function execution
Visibility of Functions and Assets
Get started
Serverless Toolkit
Developer guides
Examples
Migration guides
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
Supported requests
Request limitations
What's next?
Function Request Flow

The best way to understand how Twilio Functions works is to start by understanding the HTTP request flow and how Twilio ultimately executes your code. Twilio Functions is designed to handle as much of the infrastructure work of building a web app as possible so that you can focus on application logic instead. For Twilio Functions, this work begins at the front door, handling the HTTP request for your Function and continues through the pipeline up to your code.

Expand image
Every Function invocation begins with an HTTP client issuing a request to your Function. For most Functions, the client is the Twilio Voice or Messaging API responding to an incoming phone call or text message.
The Twilio Functions Gateway receives this request and attempts to validate it. If your Function has Signature Validation enabled, the Function Gateway will attempt to validate the signature. If the request or the Twilio Signature are invalid, the request is rejected with an HTTP 400 response.
After the Function Gateway has accepted the request, it will normalize the request into a payload for your Function. The normalized request is provided to your Function as two arguments: context and event. Once the payload has been constructed, it is used to invoke your Function.
At invocation, your Function begins executing the handler code that you have provided. When your Function completes executing, it can emit a response using the callback method. The emitted response will be transmitted to the Function Gateway.
Upon receiving the result from your Function, the Function Gateway will construct an HTTP response and return it to the client that issued the request.

Supported requests
Currently, Twilio Functions only supports HTTP requests. Twilio Functions will respond to three HTTP verbs: GET, POST, and OPTIONS. PUT and DELETE are currently not supported.
For POST requests, Twilio Functions natively supports the application/json and application/x-www-form-urlencoded content types. This means that JSON bodies and form and query parameters will be normalized into the event parameter.

Request limitations
There are several important limitations to Twilio Functions that you should consider when designing your application:
Execution time: Twilio Functions execute for at most 10 seconds. Any Function that exceeds the 10-second limit will be terminated, and the client will receive an HTTP 504 Gateway Time-out response.
Path parameter support: Twilio Functions does not provide support for path parameters. You must provide query parameters or JSON in order to pass information into your application.
Maximum response size: Twilio Functions have a constrained response size of 4MB.
Maximum request size: Twilio Functions can accept payload size up to 1MB including the request headers and cookies.

What's next?
Now that you have an understanding of the request flow to your Functions, it's time to learn about the execution process, handler method, and response building processes.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Function Request Flow | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Function request flow
Function execution
Visibility of Functions and Assets
Get started
Serverless Toolkit
Developer guides
Examples
Migration guides
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
Handler Method
Handler Arguments
Context Object
Helper Methods
Environment Variables
Event Object
Webhook parameters
Parameters from HTTP requests
Parameters from the Run Function Widget
Callback Function
Callback and Asynchronous Limitations
Callback Arguments
How do I return an error?
How do I return a successful response?
How do I return TwiML?
Global classes
Twilio
Runtime
Constructing a Response
Twilio Response Methods
What's next?
Function Execution

The Twilio Function runtime environment is lightweight by design to provide developers with all the flexibility they need. Read on to learn about how your code is executed, what variables and tools this environment provides, and ways you could create a valid response.
During Function invocation, the following steps occur:
Environment Bootstrap - The Twilio Function environment is bootstrapped, and any resources your Function code may rely on are quickly initialized.
Handler Execution - The Twilio Environment will then execute the exports.handler method that your code defines, and provide the context, event, and callback parameters, in addition to a selection of useful global utility methods.
Response Emitted - When your Twilio Function code has completed, your code must call the callback() method in order to emit your response. After executing the callback() method, your Twilio Function execution will be terminated. This includes any asynchronous processes that may still be executing.

Handler Method
The handler method is the interface between Twilio Functions and your application logic. You can think of the handler method as the entry point to your application. This is somewhat analogous to a main() function in Java or __init__ in Python.
Twilio Functions will execute your handler method when it is ready to hand off control of execution to your application logic. If your Function Code does not contain a handler method, Twilio Functions will be unable to execute your logic and will emit an HTTP 500 error.
Handler Arguments
Argument
Type
Description
context
object
Provides information about the current execution environment
event
object
Contains the request parameters passed into your Twilio Function
callback
function
Function used to complete execution and emit responses

Handler Method Boilerplate
Twilio Function Handler Method Boilerplate
Copy code block
exports.handler = (context, event, callback) => {


 // Your application logic





 // To emit a response and stop execution, call the callback() method


 return callback();


};

Context Object
Twilio Functions provides the context object as an interface between the current execution environment and the handler method. The context object provides access to helper methods, as well as your Environment Variables.
Helper Methods
The context object provides helper methods that pre-initialize common utilities and clients that you might find useful when building your application. These helper methods extract all their required configuration from Environment Variables.
Method
Type
Description
getTwilioClient()
Twilio REST Helper
If you have enabled the inclusion of your account credentials in your Function, this will return an initialized Twilio REST Helper Library
. If you have not included account credentials in your Function, calling this method will result in an error. If your code doesn't catch this error, it will result in an HTTP 500 response.

Use built-in Twilio REST Helper to send an SMS Message
Example of using built-in Twilio REST Helper
Copy code block
exports.handler = (context, event, callback) => {


 // Access the pre-initialized Twilio REST client


 const twilioClient = context.getTwilioClient();





 // Determine message details from the incoming event, with fallback values


 const from = event.From || "+15095550100";


 const to = event.To || "+15105550101";


 const body = event.Body || "Ahoy, World!";





 twilioClient.messages


   .create({ to, from, body })


   .then((result) => {


     console.log("Created message using callback");


     console.log(result.sid);


     return callback();


   })


   .catch((error) => {


     console.error(error);


     return callback(error);


   });


};
Environment Variables
We encourage developers to use Environment Variables to separate their code from configuration. Using Environment Variables ensures that your code is portable, and that simple configuration changes can be made instantly.
For a more in-depth explanation and examples, refer to the Environment Variables documentation.
Retrieve Domain from Default Environment Variables
Example of how to access the Default Environment Variables
Copy code block
exports.handler = (context, event, callback) => {


 // Check to see if the Domain name is null


 const domain = context.DOMAIN_NAME || "No Domain available";


 // Respond with the Domain hosting this Function


 return callback(null, domain);


};
Retrieve Environment Variables
Example of how to access Environment Variables
Copy code block
exports.handler = (context, event, callback) => {


 // Get the primary and secondary phone numbers, if set


 const primary = context.PRIMARY_PHONE_NUMBER || "There is no primary number";


 const secondary =


   context.SECONDARY_PHONE_NUMBER || "There is no secondary number!";





 // Build our response object


 const response = {


   phone_numbers: {


     primary,


     backup: secondary,


   },


 };





 // Return the response object as JSON


 return callback(null, response);


};

Event Object
The event object contains the request parameters and headers being passed into your Function. Both POST and GET parameters will be collapsed into the same object. For POST requests, you can pass either form encoded parameters or JSON documents; both will be collapsed into the event object.
The specific values that you'll be able to access on event are dependent on what context your Function is being used in and what parameters it is receiving. We'll cover some common use cases and general scenarios below, so you can get the most out of event.
Webhook parameters
If you have configured your Function to act as the webhook for an action, such as an incoming SMS or phone call, event will contain a very specific set of values related to the phone number in question. These will be values such as event.From, which resolves to the E.164 formatted phone number as a string, event.Body, which returns the text message of an incoming SMS, and many more. For example, an incoming message will result in event having this shape:
Copy code block
{


 "ToCountry": "US",


 "ToState": "CA",


 "SmsMessageSid": "SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "NumMedia": "0",


 "ToCity": "BOULEVARD",


 "FromZip": "",


 "SmsSid": "SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "FromState": "WA",


 "SmsStatus": "received",


 "FromCity": "",


 "Body": "Ahoy!",


 "FromCountry": "US",


 "To": "+15555555555",


 "ToZip": "91934",


 "NumSegments": "1",


 "MessageSid": "SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "AccountSid": "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "From": "+14444444444",


 "ApiVersion": "2010-04-01",


 "request": {


   "headers": { ... },


   "cookies": { ... }


 },


}
Refer to the dedicated Messaging and Voice Webhook documentation to learn the full list of properties which you can leverage in your Functions.
(information)
Info
Webhook properties are always in PascalCase
; check to make sure that you have capitalized the first letter of commonly used variables, such as From.
Access webhook values from event
Example of how to access webhook values by name from the event object in a Function
Copy code block
exports.handler = (context, event, callback) => {


 // Prepare a new messaging response object; no need to import Twilio


 const twiml = new Twilio.twiml.MessagingResponse();


 // Access incoming text information like the from number and contents off of `event`


 // Access environment variables and other runtime data from `context`


 twiml.message({ to: context.MY_NUMBER }, `${event.From}: ${event.Body}`);


 // Remember to return the TwiML as the second argument to `callback`


 return callback(null, twiml);


};
Parameters from HTTP requests
If your Function is being executed in response to an incoming HTTP request, then the contents of event will directly correspond to the request's query parameters and request body (if any).
For example, given a Function with the URL of http-7272.twil.io/response and this request:
Copy code block
curl -X GET 'https://http-7272.twil.io/response?age=42&firstName=Rick'
The resulting event object will be:
Copy code block
{


 "firstName": "Rick",


 "age": "42",


 "request": {


   "headers": { ... },


   "cookies": { ... }


 }


}
Similarly, given a POST request with query parameters, a JSON body, or both such as:
Copy code block
curl -L -X POST 'https://http-7272.twil.io/response?age=42&firstName=Rick' \


 -H 'Content-Type: application/json' \


 --data-raw '{


   "color": "orange"


 }'
the Function of the receiving end will then have access to an event object with these contents:
Copy code block
{


 "firstName": "Rick",


 "age": "42",


 "color": "orange",


 "request": {


   "headers": { ... },


   "cookies": { ... }


 }


}
(warning)
Warning
In the case of a POST request, query parameters and any JSON in the body of the request will be merged into the same object. If a property such as age is defined in both parts of the request, the value defined in the JSON body takes precedence and will overwrite the initial value from the query parameters in event.
(information)
Info
You might have noticed that event also contains a request object with headers and cookies that aren't explicitly part of the request(s). To learn more about this aspect of event and how you can leverage request headers and cookies, refer to the accessing headers and cookies documentation.
Parameters from the Run Function Widget
Similar to a direct HTTP request, a Run Function widget is invoking a Function, that Function's event will be populated by any arguments specified in the configuration of that particular Run Function widget.
Refer to the Use the Run Function widget in Studio example to see what this looks like in practice when combining Functions and Studio Flows.

Callback Function
When you have finished processing your request, you need to invoke the callback function to emit a response and signal that your Function has completed its execution. The callback method will automatically determine the data type of your response and serialize the output appropriately.
You must invoke the callback method when your Function is done processing. Failure to invoke callback will cause your Function to continue running up to the 10-second execution time limit. When your Function reaches the execution time limit, it will be terminated, and a 504 Gateway timeout error will be returned to the client.
Callback and Asynchronous Limitations
It is important to note that when the callback function is invoked, it will terminate all execution of your Function. This includes any asynchronous processes you may have kicked off during the execution of your handler method.
For this reason, if you are using libraries that are natively asynchronous and/or operate using Promises
, you must properly handle this asynchronous behavior. Structure your code to call callback within the correct callback methods, .then chains, or after await in async functions.
Complete Execution with Asynchronous HTTP Request
Example of how to appropriately use callback() with an asynchronous HTTP request
Copy code block
exports.handler = (context, event, callback) => {


 // Fetch the already initialized Twilio REST client


 const client = context.getTwilioClient();





 // Determine message details from the incoming event, with fallback values


 const from = event.From || "+15095550100";


 const to = event.To || "+15105550101";


 const body = event.Body || "Ahoy, World!";





 client.messages


   .create({ to, from, body })


   .then((result) => {


     console.log("Created message using callback");


     console.log(result.sid);


     // Callback is placed inside the successful response of the request


     return callback();


   })


   .catch((error) => {


     console.error(error);


     // Callback is also used in the catch handler to end execution on errors


     return callback(error);


   });





 // If you were to place the callback() function here, instead, then the process would


 // terminate before your API request to create a message could complete.


};
Callback Arguments
Argument
Type
Description
error
string|null
Error indicating what problem was encountered during execution. Defining this value (as anything but null or undefined) will result in the client receiving a HTTP 500 response with the provided payload.
response
string|object|null
Successful response generated by the Function. Providing this argument will result in the client receiving a HTTP 200 response containing the provided value.

How do I return an error?
If you have encountered an exception in your code or otherwise want to indicate an error state, invoke the callback method with the error object or intended message as a single parameter:
Copy code block
return callback(error);
How do I return a successful response?
To signal success and return a value, pass a falsy value such as null or undefined as the first parameter to callback, and your intended response as the second parameter:
Copy code block
return callback(null, response);
(information)
Info
All samples demonstrate using the return keyword before calling callback. This is to prevent subsequent code from unintentionally running before handler is terminated, or from calling callback multiple times, and is considered a best practice when working with Functions.
Return an Error Response
Example of how to return an error message with HTTP 500 Error
Copy code block
exports.handler = (context, event, callback) => {


 // Providing a single string or an Error object will result in a 500 Error


 return callback("Something went very, very wrong.");


};
Return a Simple Successful Response
Example of how to return an empty HTTP 200 OK
Copy code block
exports.handler = (context, event, callback) => {


 // Providing neither error nor response will result in a 200 OK


 return callback();


};
Return a Successful Plaintext Response
Example of how to return plaintext with HTTP 200 OK
Copy code block
exports.handler = (context, event, callback) => {


 // Providing a string will result in a 200 OK


 return callback(null, "This is fine");


};
Return a Successful JSON Response
Example of how to return JSON in HTTP 200 OK
Copy code block
exports.handler = (context, event, callback) => {


 // Construct an object in any way


 const response = { result: "winner winner!" };


 // A JavaScript object as a response will be serialized to JSON and returned


 // with the Content-Type header set to "application/json" automatically


 return callback(null, response);


};
How do I return TwiML?
In addition to the standard response types, Functions has built-in support to allow you to quickly generate and return TwiML for your application's needs.
This is such a common use case that callback directly accepts valid TwiML objects, such as MessagingResponse and VoiceResponse, as the second argument. If you return TwiML in this way, the environment will automatically convert your response to XML without any extra work required on your part. (Such as stringifying the TwiML and specifying a response content type)
Return a static Messaging response to incoming text messages
Copy code block
exports.handler = (context, event, callback) => {


 // Create a new messaging response object


 const twiml = new Twilio.twiml.MessagingResponse();


 // Use any of the Node.js SDK methods, such as `message`, to compose a response


 twiml.message("Hello, World!");


 // Return the TwiML as the second argument to `callback`


 // This will render the response as XML in reply to the webhook request


 return callback(null, twiml);


};
Return a Voice response that includes Say and Play verbs
Copy code block
exports.handler = (context, event, callback) => {


 // Create a new voice response object


 const twiml = new Twilio.twiml.VoiceResponse();


 // Webhook information is accessible as properties of the `event` object


 const city = event.FromCity;


 const number = event.From;





 // You can optionally edit the voice used, template variables into your


 // response, play recorded audio, and more


 twiml.say({ voice: "alice" }, `Never gonna give you up, ${city || number}`);


 twiml.play("https://demo.twilio.com/docs/classic.mp3");


 // Return the TwiML as the second argument to `callback`


 // This will render the response as XML in reply to the webhook request


 return callback(null, twiml);


};

Global classes
In addition to the values and helpers available through the context, event, and callback parameters, you have access to some globally-scoped helper classes that you can access without needing to import any new Dependencies.
Twilio
The Twilio class is accessible at any time. This is commonly used to initialize TwiML or Access Tokens for your Function responses. For example:
Copy code block
// Initialize TwiML without needing to import Twilio


const response = new Twilio.twiml.MessagingResponse();





// Similarly for other utilities, such as Access Tokens


const AccessToken = Twilio.jwt.AccessToken;


const SyncGrant = AccessToken.SyncGrant;
Runtime
The Runtime Client is accessible via Runtime, and exposes helper methods for accessing private Assets, other Functions, and the Sync client. For example:
Copy code block
const text = Runtime.getAssets()["/my-file.txt"].open();


console.log("Your file contents: " + text);

Constructing a Response
In some instances, your Function may need greater control over the response it is going to emit. For those instances, you can use the Twilio Response object that is available in the global scope of your Function by default. No need to import Twilio yourself!
By using the Twilio Response object, you will be able to specify the status code, headers, and body of your response. You can begin constructing a custom response by creating a new Twilio Response object, like so:
Copy code block
// No need to import Twilio; it is globally available in Functions


const response = new Twilio.Response();
Twilio Response Methods
Method
Return Type
Description
setStatusCode(int)
self
Sets the status code in the HTTP response
setBody(mixed)
self
Sets the body of the HTTP response. Takes either an object or string. When setting the body to anything other than text, make sure to set the corresponding Content-Type header with appendHeader()
appendHeader(string, string)
self
Adds a header to the HTTP response. The first argument specifies the header name and the second argument the header value
setHeaders(object)
self
Sets all of the headers for the HTTP response. Takes an object mapping the names of the headers to their respective values

Set a Status Code in a Response
Example of setting a Status Code using Twilio Response
Copy code block
exports.handler = (context, event, callback) => {


 // No need to import Twilio; it is globally available in Functions


 const response = new Twilio.Response();





 // Set the status code to 204 Not Content


 response.setStatusCode(204);





 return callback(null, response);


};
Build a Plaintext Response
Example of building a plaintext response with Twilio Response
Copy code block
exports.handler = (context, event, callback) => {


 // No need to import Twilio; it is globally available in Functions


 const response = new Twilio.Response();





 response


   // Set the status code to 200 OK


   .setStatusCode(200)


   // Set the response body


   .setBody("This is fine");





 return callback(null, response);


};
Building a JSON Response
Example of building a JSON response with Twilio Response
Copy code block
exports.handler = (context, event, callback) => {


 // No need to import Twilio; it is globally available in Functions


 const response = new Twilio.Response();





 response


   // Set the status code to 200 OK


   .setStatusCode(200)


   // Set the Content-Type Header


   .appendHeader("Content-Type", "application/json")


   // Set the response body


   .setBody({


     everything: "is alright",


   });





 return callback(null, response);


};
Set an HTTP Header in a Response
Example of setting an header using Twilio Response
Copy code block
exports.handler = (context, event, callback) => {


 // No need to import Twilio; it is globally available in Functions


 const response = new Twilio.Response();





 response


   // Set the status code to 301 Redirect


   .setStatusCode(301)


   // Set the Location header for redirect


   .appendHeader("Location", "https://twilio.com");





 return callback(null, response);


};
Set Multiple HTTP Headers in a Response
Example of setting multiple headers using Twilio Response
Copy code block
exports.handler = (context, event, callback) => {


 // No need to import Twilio; it is globally available in Functions


 const response = new Twilio.Response();





 // Build a mapping of headers as a way to set many with one command


 const headers = {


   "Access-Control-Allow-Origin": "example.com",


   "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",


   "Access-Control-Allow-Headers": "Content-Type",


 };





 // Set headers in response


 response.setHeaders(headers);





 return callback(null, response);


};

What's next?
By now, you should have a pretty good idea of what goes into writing a Function. (Although there are plenty of specifics and examples yet to learn)
The next important step in your journey is to understand the concept of visibility, and how it affects access to and use of your Functions (and Assets)!

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Function Execution | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Function request flow
Function execution
Visibility of Functions and Assets
Get started
Serverless Toolkit
Developer guides
Examples
Migration guides
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
Public
Protected
Private
How to set Visibility
What's next?
Understanding Visibility of Functions and Assets: Public, Protected and Private

Twilio Functions and Assets can be: public, protected, or private.
Here are the differences between each of the three levels of visibility for Functions and Assets:

Public
A public Function or Asset is publicly accessible on the internet at a specific URL once deployed. For example, if you create a Function with the path /send/sms and deploy to an environment example-1234.twil.io, then your function will be publicly accessible at https://example-1234.twil.io/send/sms.
Similarly, a public Asset called ahoy.mp3 in the same Service would be accessible by anyone from https://example-1234.twil.io/ahoy.mp3.

Protected
A protected Function or Asset can be referenced via a URL as well, but requires a valid Twilio X-Twilio-Signature header in the request in order to be accessed. This empowers you to limit your Functions and Assets to only be accessible by Twilio webhooks such as an incoming call or SMS message, by Twilio Studio widgets such as the Run Function Widget or the Say/Play Widget, or by your own Functions.
This extra layer of protection makes Protected Assets particularly useful for storing sensitive information that needs to be referenced by your code or in a Studio Flow, for example, but not accessible by the public.

Private
Private Functions and Assets are library files intended only for access via other Functions. These files will not be accessible by URL or exposed to the web; rather, they are packaged alongside your Service at build time.
For example, if your Function relies on a JSON file of data to read from, you can deploy that JSON file as a private Asset and read it from the Function.
A private Asset could even be a way for you to store a list of five-letter words for building your own Wordle.
Similarly, private Functions are a great way to reuse code or define private libraries that you want to keep out of reach from the wider web.

How to set Visibility
ConsoleServerless Toolkit
You can specify a Function's or Asset's visibility in the Functions Editor
 by using the visibility dropdown and selecting your desired visibility. Access this dropdown by clicking on the downward-facing arrow next to any Function or Asset, or by clicking on the adjacent text which will say Public, Protected, or Private.
Remember to redeploy your service to make the change take effect.

Expand image

What's next?
That's most of the fundamentals out of the way! Let's apply all of this knowledge and start building by creating your first Service, or by following one of the many examples.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Understanding Visibility of Functions and Assets: Public, Protected and Private | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Create a Service
Assets
Serverless Toolkit
Developer guides
Examples
Migration guides
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
Creating a new Service
Understanding Domains
View and Manage Services
Deleting a Service
Limitations
Create a Service

(warning)
Warning
If you are using Services or Functions(Classic) and have included your auth token directly instead of using a variable, you must wait for 1 minute for the update of your auth token to propagate. Otherwise, those functions and services will fail with a 403 Forbidden error.
A Twilio Service is a container for your Functions, Assets, and Environments.
As you develop applications usingTwilio Functions and Assets, Services can help you organize the Functions and Assets that compose each respective application, keep separate Environments, and control Deployments.

Expand image

Creating a new Service
To create a new Service, click on the Create Service button that's available both from the Services page
 in the Twilio Console and the Functions Overview page
.
You will be prompted to provide a name for the new Service. Click Next once you're satisfied with the new Service name.
The Service will be bootstrapped, and you'll be redirected to the Functions Editor shortly after. There, you can begin adding Functions and Assets.

Expand image
(warning)
Warning
A Service name must be fewer than 50 characters, and may only contain letters, numbers, and dashes.
Once selected, the Service name is permanent and cannot be modified.
Understanding Domains
The name of your Service directly influences the domain that your Functions and Assets will be deployed to. The general URL scheme for a Service is as follows:
Copy code block
https://[service name]-[random numbers]-[environment].twil.io/
This means that a Service named astley will have the following domain by default:
Copy code block
https://astley-3432.twil.io/ # The default, production URL
It could potentially also create these other, Environment-specific domains depending on how you name them and which you choose to deploy:
Copy code block
https://astley-3432-dev.twil.io/ # For an Environment named 'dev'


https://astley-3432-test.twil.io/ # For an Environment named 'test'


https://astley-3432-stage.twil.io/ # For an Environment named 'stage'

View and Manage Services
You can view all of your existing services on the Services page
 in the Twilio Console.
For each existing Service, you can:
Click on the unique name to visit the Functions Editor for that Service and view all Functions and Assets
Click on Service Details to view metadata for the Service and all Functions, Assets, and Environments
Click on Delete to begin the process of deleting the Service

Expand image

Deleting a Service
Clicking on Delete will initiate the process of deleting a Service. First, you will be prompted to verify that you indeed wish to delete the Service. After confirming, the Service and all of its child Functions, Assets, and Environments will be deleted.
(error)
Danger
If the Service is being used by another application like Studio or Flex, those applications will no longer be able to reach the Service and associated Functions or Assets. This poses the risk of breaking dependent applications, and should be taken into consideration before deleting a Service.

Limitations
There is currently a maximum of 50 Services available to each Functions user by default. Once you reach 50 Services, you will no longer be able to add additional Services without deleting an existing Service.
(warning)
Warning
Functions(Classic) does not support Services. If you are using Functions(Classic), you can create functions directly in the editor and attach compatible Assets from Assets(Classic).

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Create a Service | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Create a Service
Assets
Serverless Toolkit
Developer guides
Examples
Migration guides
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
How Assets work
Get started with Assets
Get the URL of an Asset
Using public Assets
Using protected Assets
Using private Assets
Hosting a Root Asset
/
/assets/index.html
Limitations
Assets

Twilio Assets is a static file hosting service that allows developers to quickly upload and serve the files needed to support their applications. With Twilio Assets you can host your files that support web, voice, and messaging applications. Twilio Assets is frequently used to host .mp3 audio files used in TwiML and Studio Flows, to serve images sent through MMS, or to store configuration used by Twilio Functions.

How Assets work
Twilio provides you with three different types of Assets: public, protected, and private. The primary difference between the types is how they are accessed:
Public Assets are served over HTTPS from the Twilio CDN to ensure that they are highly available and secure, and are accessible by anyone with the Asset's URL.
Protected Assets are accessible via the Twilio CDN by URL as well, but require a valid Twilio request signature, or they will return a 403 error.
Private Assets are not accessible by URL or exposed to the web; instead, they are packaged with your Twilio Functions at build time.
If you would like to learn more about Asset visibility, we have a document that goes over the distinctions between public, protected, and private assets in greater detail.
(warning)
Warning about use of public Assets
Anyone with the URL to a public asset will be able to access it. Therefore, customers should be thoughtful about what data they include in a public asset.
(warning)
Metadata warning
Asset files are uploaded as is, with all metadata persisted. If your Asset files contain metadata, that will be stored with the file. An example would be EXIF metadata stored with an image. If you are making files available, metadata is persisted and not removed/changed by the Assets product in any way.

Get started with Assets
Start by opening one of your existing Services, or by creating a new one. Once you're in the Functions Editor UI for your Service there are three points of interest:
The Assets pane, which lists your Assets, their Visibility, a context menu for adjusting visibility, and another menu for other actions.
The Add+ button which allows you to upload files as Assets, or create a new Asset.
The Deploy All button, which will trigger an upload and deploy of your Assets (along with any Functions)

Expand image
Upload a file by clicking Add+ and then Upload File in the resulting menu, which will open up a standard file upload dialogue. Once you've selected a file or files, you'll be presented with options to set the visibility of each Asset, as well as the ability to remove or add other files. Click Upload to begin uploading your selection of files with the desired settings.

Expand image
While the Asset has been uploaded, it will not be immediately accessible via a URL or in your Functions yet. This will be indicated by the gray circle next to the Asset's name. To deploy the Asset (and the rest of your Service), click the Deploy All button. After a brief period, the deployment will finish, and you should see a green check appear next to all deployed Assets.

Expand image
Get the URL of an Asset
In general the URL of one of your Assets can be determined by taking the URL of your Service, for example https://example-1234.twil.io, and appending the name of your Asset.
In the case of an Asset such as example.json in that Service, it can be accessed at https://example-1234.twil.io/example.json.
For a point and click solution, the Functions Editor UI also provides two ways to copy the URL of an Asset to your clipboard:
Open the context menu of an Asset, and click Copy URL
Open an Asset in the Functions Editor, and click the Copy URL button that will appear below the content editor and above the logs pane

Expand image
Using public Assets
Public assets are publicly accessible once deployed, and can be used by referencing their URL. For example: given a Service with the URL of https://example-1234.twil.io and a public Asset named ahoy.mp3, the Asset will be available at https://example-1234.twil.io/ahoy.mp3.
Using protected Assets
The process for determining the URL of a protected Asset is the same as that of a public Asset. However, the Asset will only be accessible from Twilio code such as a Function, Studio Flow, or Flex.
For example, suppose we have an image grumpy.jpg that's been deployed to https://twilio-assets-1967.twil.io/grumpy.jpg. We would like to be able to send this image to users as part of an MMS, but have the file be inaccessible in all other cases. If the following code were deployed to a Function in the same Service and executed, the recipient will receive the image of grumpy cat, but anybody else trying to access the file by URL will be returned a 403 Forbidden error instead.
Use a protected Asset in a Function
Copy code block
exports.handler = (context, event, callback) => {


 // Access the NodeJS Helper Library by calling context.getTwilioClient()


 const client = context.getTwilioClient();


 // Query parameters or values sent in a POST body can be accessed from `event`


 const from = event.From || "+15017122661";


 const to = event.To || "+15558675310";


 const body = event.Body || "Ahoy, World!";





 client.messages


   .create({


     to,


     from,


     body,


     // You will get a 403 if you try to view this image, but Twilio will


     // be able to access it and send it as part of the outgoing MMS


     mediaUrl: "https://twilio-assets-1967.twil.io/grumpy.jpg",


   })


   .then((message) => {


     console.log(`Success! MMS SID: ${message.sid}`);


     return callback(null, message.sid);


   })


   .catch((error) => {


     console.error(error);


     return callback(error);


   });


};
Similarly, suppose you have audio or messaging to include in your Studio Flow, but don't want that audio to be accessible to the entire internet. If the audio were uploaded as protected Asset, you could then reference its URL in the Studio Say/Play widget, and the audio will play for anybody that hits that part of your Flow.
For example, if the audio were a protected Asset deployed at https://twilio-assets-1967.twil.io/sensitive-message.mp3, it could be referenced in your Studio Flow as shown below:

Expand image
Using private Assets
When Twilio builds your Function for deployment it will bundle any and all Private Assets that you have uploaded. This makes Private Assets perfect for storing sensitive configuration files, templates, and shared code that supports your application.
In order to access a private Asset, you will need to leverage the Runtime.getAssets method and open the file directly using either the open helper method, or by using helper methods from the fs module as shown in the following examples.
Read the content of a Private Asset
Example of how to read the contents of a Private Asset
Copy code block
exports.handler = (context, event, callback) => {


 // Access the open helper method for the Asset


 const openFile = Runtime.getAssets()["/my_file.txt"].open;





 // Open the Private Asset and read the contents.


 // Calling open is equivalent to using fs.readFileSync(asset.filePath, 'utf8')


 const text = openFile();


 console.log("Your file contents: " + text);





 return callback();


};
Serve an audio file from a Private Asset
Example of how to serve an audio file from a Private Asset
Copy code block
// Load the fs module


const fs = require("fs");





exports.handler = (context, event, callback) => {


 // Get the path to the Private Asset


 const mp3Path = Runtime.getAssets()["/audio.mp3"].path;





 // Read the file into the buffer and get its metadata


 const buffer = fs.readFileSync(mp3Path);


 const stat = fs.statSync(mp3Path);


 // Create a new Response object


 const response = new Twilio.Response();


 // Send the audio file in the response


 response.setBody(buffer);


 response.appendHeader("Content-Type", "audio/mpeg");


 response.appendHeader("Content-Length", stat.size);





 return callback(null, response);


};

Hosting a Root Asset
In some cases, such as when hosting an app with a landing page, you want the root URL of your Service to return an Asset in the browser. For example, you can visit root-asset-5802.twil.io/
 which serves static HTML solely via Assets.
To reproduce this behavior, you will need to use one of two special paths for a public Asset for your file (whether it be HTML, an image, or anything else).
/
You may rename an Asset's path to /, and that Asset will be served on requests to the root URL of your Service. In the Console UI, it would look like this:

Expand image
/assets/index.html
This path applies only to HTML files. Renaming an HTML file's path to /assets/index.html will cause the Service to return that page on requests to the root URL of your Service. It would look like this in the Console UI:

Expand image
You can practice this yourself using the following index.html example code:
Root Asset index.html
Copy code block
<!DOCTYPE html>


<html lang="en">


 <head>


   <meta charset="UTF-8" />


   <meta name="viewport" content="width=device-width, initial-scale=1.0" />


   <meta http-equiv="X-UA-Compatible" content="ie=edge" />


   <title>Hello Twilio Serverless!</title>


 </head>


 <body>


   <header><h1>Hello from Twilio Serverless!</h1></header>


   <main>


     <p>


       This page is a public Asset that can be accessed from the root URL of


       this Service!


     </p>


   </main>


   <footer>


     <p>


       Made with 💖 by your friends at


       <a href="https://www.twilio.com">Twilio</a>


     </p>


   </footer>


 </body>


</html>
(information)
Info
If you want to deploy a root Asset using the Serverless Toolkit instead, you will need to create the /assets/index.html path within the existing assets/ folder that exists for your project.
The resulting path in your local filesystem will be /assets/assets/index.html, and the folder hierarchy will be as follows:
Copy code block
.


├── assets


│   └── assets


│       └── index.html


├── functions


└── package.json
Limitations
All Builds have limitations on the maximum allowable file size and quantity of each Asset type that can be included:
Asset Type
Maximum Size
Quantity
Public
25 MB
1000 Assets
Private
10 MB
50 Assets
Protected
25 MB
1000 Assets

These limits apply only to individual Builds, so Assets used in a Build by a Subaccount won't affect the limits of other Subaccounts or the main Account.
Using Environments further expands your options, as you can create Builds containing different sets of Assets and deploy them to separate Environments.
(warning)
Warning
When using the Serverless API (either directly, via the Helper Libraries, or through the CLI), you can create more Assets and Asset Versions within a Service, for example, to have different Assets in different Environments. However, a particular Build can only include so many Assets, as indicated in the table above.
This flexibility is currently not supported by the Console UI. Every Asset listed in the UI will be included in the deployed Build, and you will be unable to upload Assets in excess of the stated limits.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Assets | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Serverless Toolkit
Twilio Serverless Toolkit
About
Getting started
General usage
Developing & debugging
Deploying
Configuration and meta files
Examples
Upload assets using the Assets Plugin
Guides
Serverless Toolkit on GitHub
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
What is the Serverless Toolkit?
Let's work together
What's next?
Serverless Toolkit

(information)
This is a Twilio Labs project
This means this project is 100% open-source. You can find its source code in the Twilio Labs GitHub organization
.
We currently don't support the projects through our official support channels. But you are welcome to reach out to us on GitHub for any questions, issues or suggestions or to contribute to this project.
Learn more about Twilio Labs.

What is the Serverless Toolkit?
The Serverless Toolkit is CLI tooling to help you develop locally and deploy to Twilio Functions & Assets.
There are two ways you can use the toolkit. If you are already using the Twilio CLI, you can install it via a plugin. Alternatively, you can use the toolkit as a standalone using twilio-run
 via npm or another Node.js package manager.
Throughout the docs, we primarily use the Twilio CLI unless pointed out.

Let's work together
Everything in this toolkit is released under Twilio Labs
 and fully open-source. If you find any problems with this, please file an issue
 or even create a pull request
 to work together with us on the toolkit. We would love to hear your ideas and feedback!
You can also check out our other related projects there:
@twilio-labs/serverless-api
 is the underlying module that powers most of this tooling
Function Templates
 is the collection of templates powering the new command in the tooling
Serverless Framework integration
 integrates Twilio Functions and Assets with the Serverless Framework
Visual Studio Code Twilio Extension
 is an extension to interact with the Twilio Serverless tooling directly from within VS Code
@twilio-labs/plugin-assets
 is a Twilio CLI plugin to upload and manage assets

What's next?
Now that you know what the Twilio Serverless Toolkit is all about, let's get started working with it.
Getting Started
Install the toolkit
Explore available commands
General Usage
Create a project
Project structure
Start developing locally
Create a new Twilio Function
Deploy a project
Upload Assets with the Assets Plugin
Examples
Guides
Using Twilio Serverless with TypeScript
Using the Serverless Toolkit with multiple Twilio Projects
Continuous Deployment using the Serverless Toolkit

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Serverless Toolkit | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Serverless Toolkit
Twilio Serverless Toolkit
About
Getting started
General usage
Developing & debugging
Deploying
Configuration and meta files
Examples
Upload assets using the Assets Plugin
Guides
Serverless Toolkit on GitHub
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
Install the Twilio Serverless Toolkit
When would I use which version?
Update the Serverless Toolkit
Explore the commands and options
What's next?
Getting Started

(information)
This is a Twilio Labs project
This means this project is 100% open-source. You can find its source code in the Twilio Labs GitHub organization
.
We currently don't support the projects through our official support channels. But you are welcome to reach out to us on GitHub for any questions, issues or suggestions or to contribute to this project.
Learn more about Twilio Labs.

Install the Twilio Serverless Toolkit
Before we can get started using the Twilio Serverless Toolkit, we need to install it.
There are two ways you can use the toolkit. If you are already using the Twilio CLI, you can install it via a plugin. Alternatively, you can use the toolkit as a standalone using twilio-run
 via npm or another Node.js package manager.
Throughout the docs, you'll find all instructions using the Twilio CLI.
When would I use which version?
If you and the people who work with you on the project have the Twilio CLI installed, your best bet will be to use the plugin
. If you intend to install the toolkit as a dependency directly to your project, you can alternatively install twilio-run
 as a devDependency in your Node.js project.
Install Twilio Serverless Toolkit
To get started, you'll have to install the Twilio Serverless Toolkit using the Twilio CLI
Copy code block
# Install the Serverless plugin


twilio plugins:install @twilio-labs/plugin-serverless





# See a list of available commands:


twilio serverless --help

Update the Serverless Toolkit
You can update Twilio CLI plugins by running twilio plugins:update, but this might not pull the very latest version. Instead, uninstall and re-install the plugin.
Update the Serverless Toolkit
Copy code block
# Uninstall the existing Serverless Toolkit


twilio plugins:remove @twilio-labs/plugin-serverless





# Install the latest version of the Serverless Toolkit


twilio plugins:install @twilio-labs/plugin-serverless@latest

Explore the commands and options
You can find all available commands using the --help flag on the toolkit or a specific command.
Get help in Twilio Serverless Toolkit
Copy code block
# List all available commands


twilio serverless --help





# Get available flags and description for a specifically


# for a command like deploy


twilio serverless:deploy --help

What's next?
Now that we have the toolkit installed let's see what we can do with it.
General Usage
Create a project
Project structure
Start developing locally
Create a new Twilio Function
Deploy a project
Examples

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Getting Started | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Serverless Toolkit
Twilio Serverless Toolkit
About
Getting started
General usage
Developing & debugging
Deploying
Configuration and meta files
Examples
Upload assets using the Assets Plugin
Guides
Serverless Toolkit on GitHub
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
Create a Project
Project Structure
Configuration and Meta Files
Project Dependencies
Environment Variables
Functions
Assets
Start developing locally
Create a new Twilio Function
Deploy a project
What's next?
General Usage

(information)
This is a Twilio Labs project
This means this project is 100% open-source. You can find its source code in the Twilio Labs GitHub organization
.
We currently don't support the projects through our official support channels. But you are welcome to reach out to us on GitHub for any questions, issues or suggestions or to contribute to this project.
Learn more about Twilio Labs.
There are two ways you can use the toolkit. If you are already using the Twilio CLI, you can install it via a plugin. Alternatively, you can use the toolkit as a standalone using twilio-run via npm or another Node.js package manager.
Throughout the docs we'll reference the Twilio CLI commands.

Create a Project
There's a variety of ways you can get started with a Twilio Serverless project. If you are intending to use the Twilio Serverless Toolkit, you'll have to have a project that adheres to a certain structure (more below). The toolkit actually supports scaffolding projects to get some example Functions and the right folder structure.
Create Twilio Serverless project
Copy code block
# Initialize a new project with the name my-project


twilio serverless:init my-project





# Change into that new project directory


cd my-project

Project Structure
By default the Twilio Serverless Toolkit uses the filesystem structure of your project to make conclusions of what to do. If you use the Toolkit to create your project, you'll already have a valid structure like this:
Copy code block
my-project


├── .env


├── .gitignore


├── .nvmrc


├── .twilioserverlessrc


├── .twiliodeployinfo


├── assets


│   ├── index.html


│   ├── message.private.js


│   └── style.css


├── functions


│   ├── hello-world.js


│   ├── private-message.js


│   └── sms


│       └── reply.protected.js


├── package-lock.json


└── package.json
Configuration and Meta Files
By default the Twilio Serverless Toolkit uses conventions over configuration. However we do provide some configuration options and store some meta information in your project in the shape of .twilioserverlessrc and .twiliodeployinfo files. You can learn more about them in the Configurations section.
Project Dependencies
Anything that will be found in the dependencies field of your package.json in your project directory will be available both for local development as well as installed in your deployed project.
You can add new dependencies by using any Node.js package manager that writes to the package.json like npm to install dependencies.
(warning)
Warning
Dependencies that are installed locally but are not under dependencies, like anything installed as devDependencies, might be available during local development but will not be available during deployment. The deploy command will list all dependencies that are being installed upon deployment.
Environment Variables
We use .env files for all environment variables. By default we will not make any other environment variables on your system available for your local development. We'll use the same file to determine the values that should be uploaded for deployment. You can change the location of your .env file using the --env flag (for example: --env=./.env.staging) or by using the configuration file.
Learn more about .env files:
Structure of a .env file


A small tutorial on how to use .env files in general


There are a few variables that behave differently. Namely:
DOMAIN_NAME and PATH. These are automatically set both during local development and in your deployed environment unless they are overridden by a value in your .env file.
ACCOUNT_SID and AUTH_TOKEN. During local development these are set through your .env file. During deployment they'll be replaced with the relevant account information you deployed to.
SERVICE_SID and ENVIRONMENT_SID. During local development these will be undefined by default and will log a warning starting with @twilio/runtime-handler version 1.1.2. In your deployed version these will be populated with the relevant information for your deployment unless you overrode the values using the .env file with your own custom values.
How to use SERVICE_SID and ENVIRONMENT_SID in local development
The most common use case for using SERVICE_SID and ENVIRONMENT_SID is to retrieve or manipulate things related to a deployment. For example permanently updating an environment variable by calling the Serverless API directly.
Since your local development environment only imitates the Twilio Functions Runtime there is no actual Service and therefore no Service SID and Environment SID that we can provide. Instead these values will be undefined. You will, however, see a warning emitted into your local development logs when accessing this undefined value to warn you that during deployment these will automatically be populated. You can use this information to gate behavior to only happen in your deployed instance. By writing code similar to this:
Copy code block
exports.handler = function(context, event, callback) {


 if (context.SERVICE_SID) {


    callback(null, 'Ahoy from the Twilio Cloud!');


 } else {


    callback(null, 'Hello from my local environment');


 }


}
Functions
All Functions have to be under a common root directory. By default this will be functions/ but you can alternatively use src/. If neither of them works, there's a flag --functions-folder or functionsFolder config option that you can use to specify a different directory as the root directory for your Functions.
Anything under that root directory will be uploaded as a Twilio Function. The path for each function is relative to the root directory with the .js strapped away.
For example a functions/ directory like this:
Copy code block
my-project


├── functions


│   ├── example.js


│   └── sms


│       └── reply.js
Would result in two Functions being created at the paths /example and /sms/reply.
If you would deploy these files both of these Functions would be publicly accessible. If you want to lock them down to only be accessible by Twilio, for example to use them as a webhook, you can mark a Function as protected. This can be done renaming your file to have an extension of .protected.js.
Note: This will not influence the path of the Function. Meaning a file functions/example.js and functions/example.protected.js will both result in a path of /example but the second one will make sure to enforce a valid Twilio request signature.
Assets
Creating Assets works similar to creating Functions. By default the toolkit will look for an assets/ or alternatively static/ folder. With the --assets-folder flag or assetsFolder config option you can change this directory to any other root directory.
However, Assets will preserve their extensions for the path. So for example a file under assets/index.html would result in a path of /index.html.
Assets are a great way for you to also host resources that you want to access from your Functions that are not other Functions or should not be available to the public. For example configuration files or other JavaScript files you want to require(). You can store those as private Assets.
To mark an Asset as private, include .private. in the filename. This will create a private Asset but the .private. annotation will be removed during upload. In order to accessing a private asset you'll have to use the global Runtime.getAssets() function. You can learn more about it in the Runtime documentation.

Start developing locally
The Twilio Serverless Toolkit allows you to develop locally to test out your Functions and Assets before deploying them to Twilio. It also allows you to attach a debugger to debug your Function logic or even spin up an ngrok tunnel to test your Functions directly with Twilio.
There's a variety of options that you can use when kicking off the local development command but the quick way to get started is to run it without any arguments.
Run a Serverless project locally
Copy code block
# Start the local development environment with live reloading of Functions


twilio serverless:start

Create a new Twilio Function
Since any JavaScript file inside your functions directory of your project will turn into a Function, creating a new Twilio Function can be as quick as creating a new file with this content:
Copy code block
exports.handler = function(context, event, callback) {


 const twiml = new Twilio.twiml.VoiceResponse();


 twiml.say("Hello World!");


 callback(null, twiml);


};
If you want to learn more about the different variables passed into this Function during the execution or other things that will be available during the execution, make sure to check out the documentation of the Twilio Function Runtime.
To make creating a new Twilio Function more convenient and get you started quicker, we added another command that lets you create a new Function and pick from a collection of existing templates.
Create a new Twilio Serverless Function
Copy code block
# Creates a new function with the path and name /my-new-function


twilio serverless:new my-new-function
These templates are dynamically loaded from our Function Templates repository on GitHub
 and we always welcome new contributions.
If you want to see a list of available templates with a short description directly in you terminal, you can use the serverless:list-templates command to list all templates.
List available Function templates
Copy code block
# List all available Function templates


twilio serverless:list-templates

Deploy a project
Once you have your project setup, you are just one command away from deploying your Twilio Serverless project. The deploy command will set some defaults based on your filesystem:
The toolkit will create a Twilio Serverless service for you. By default it will read the name entry in your package.json. You can use the --service-name flag to override this name
Twilio Serverless introduces the concept of Environments. By default the toolkit will deploy to an environment with the domain suffix dev and the name dev-environment. This can be changed through the --environment flag.
The toolkit will upload all variables set in your .env file for your deployment. You can change it to use a different .env file using the --env flag.
Any dependency that is listed in the dependencies field in your package.json will automatically be installed in your deployment.
Deploy a Twilio Serverless project
Copy code block
# Run a basic deployment with default settings


twilio serverless:deploy

What's next?
Now that you were able to deploy your first Twilio Serverless project, it's time to learn more about some of the other options that you have.
Getting Started
Install the toolkit
Explore available commands
Examples

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
General Usage | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Serverless Toolkit
Twilio Serverless Toolkit
About
Getting started
General usage
Developing & debugging
Deploying
Configuration and meta files
Examples
Upload assets using the Assets Plugin
Guides
Serverless Toolkit on GitHub
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
Deploying new code
Replicating an existing deployment
What's next?
Deploying with the Serverless Toolkit

(information)
This is a Twilio Labs project
This means this project is 100% open-source. You can find its source code in the Twilio Labs GitHub organization
.
We currently don't support the projects through our official support channels. But you are welcome to reach out to us on GitHub for any questions, issues or suggestions or to contribute to this project.
Learn more about Twilio Labs.
There are two ways you can use the toolkit. If you are already using the Twilio CLI, you can install it via a plugin. Alternatively, you can use the toolkit as a standalone using twilio-run via npm or another Node.js package manager.
Throughout the docs we'll reference the Twilio CLI commands.
(information)
Info
The Serverless Toolkit will perform a collection of API requests on your behalf and in order to speed things up might do so in parallel. Depending on your account it might get into the situation where you hit issues deploying due to concurrency issues.
To solve this issue, you can set the environment variable
 TWILIO_SERVERLESS_API_CONCURRENCY to a value such as 1 to avoid any requests being performed in parallel.

Deploying new code
The Serverless Toolkit tries to make deploying as seamless and with as little configuration as possible. If you have a project set-up according to the Serverless project structure, all it takes to deploy is one short command.
Deploy a Twilio Serverless project
Copy code block
# Run a basic deployment with default settings


twilio serverless:deploy
By default this will create a new environment for you with the following properties:
Domain Suffix: dev
Unique Name: dev-environment
You can change the environment it deploys to by passing the domain suffix of the environment into the deploy command using the --environment flag. If an environment with that domain suffix already exists, it will deploy to that one, otherwise it will create a new one.
Deploy a Serverless project to a staging environment
Copy code block
twilio serverless:deploy --environment=staging
If you don't pass any other options in, the Functions and Assets that are being deployed will be chosen based on your project structure. If you use a non-default folder name for the deployment of Assets or Functions, you can pass in the --assets-folder or --functions-folder flags to change them. Alternatively you can use the --no-assets and --no-functions flags to turn these features of completely.
Deploy a Serverless project without assets
Copy code block
twilio serverless:deploy --no-assets
Additionally any variables except ACCOUNT_SID and AUTH_TOKEN will be uploaded as part of your deployment. To change the variables that are being uploaded use the --env flag to point against another .env file.
Deploy a Serverless project with different variables
Copy code block
twilio serverless:deploy --env .env.prod
There's a lot more configuration you can do for your deployment. The best way you can find out about the various options is using the --help flag. It will list all options you have available.

Replicating an existing deployment
Aside of deploying code to an environment by uploading everything again, you can take an existing deployment and activate it on another environment using the promote command. For example to move the same build from the dev environment to an environment with the domain suffix staging you can use the activate command.
Promote a build from one environment to another [serverless]
Copy code block
twilio serverless:promote --source-environment=dev --environment=stage

What's next?
Now that you learned how you can deploy your Twilio Functions, why not learn more, like how you can locally develop and debug your Functions.
Getting Started
Install the toolkit
Explore available commands
General Usage
Create a project
Project structure
Start developing locally
Create a new Twilio Function
Deploy a project
Developing and Debugging
Examples
Guides
Using Twilio Serverless with TypeScript

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Deploying with the Serverless Toolkit | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Serverless Toolkit
Twilio Serverless Toolkit
About
Getting started
General usage
Developing & debugging
Deploying
Configuration and meta files
Examples
Upload assets using the Assets Plugin
Guides
Serverless Toolkit on GitHub
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
Configuration
Location and format
Configuration options
Scoped configurations
Deploy info (.twiliodeployinfo)
Deprecated: .twilio-functions
Configuration and Meta Files

The Serverless Toolkit has support for two types of meta files that can be included in your project:
.twilioserverlessrc — a configuration file.
.twiliodeployinfo — an autogenerated meta file.
(information)
Info
These configuration files are only supported by @twilio-labs/plugin-serverless version 2.0.0 or newer and twilio-run version 3.0.0 or newer. For older versions, check out the section for .twilio-functions further down.

Configuration
Location and format
By default, the Serverless Toolkit will try to load any configuration file from the root of your project by looking for .twilioserverlessrc. The format of the configuration file is JSON5
 which supports regular JSON as well as features such as comments. Additionally, we support alternative formats for your configuration file. You can select any of these by adding a suitable file extension:
JavaScript: .twilioserverlessrc.js or .twilioserverlessrc.cjs — Important: you'll have to export an object using module.exports = { ... }
YAML: .twilioserverlessrc.yml
Package.json: add a "twilioserverless" key to your package.json
Config JavaScript file: twilioserverless.config.js
You can also provide a different location for your config file by specifying the location using the -c flag.
In this guide we'll use the JSON5 syntax.
Configuration options
In general, everything that can be configured using a CLI flag with the Serverless Toolkit is also accessible through the configuration. By convention, every configuration value uses lowerCamelCase notation: for example, --service-sid becomes serviceSid in the configuration. Here are some further examples:
Copy code block
{


 "commands": {},


 "environments": {},


 "projects": {},


   // "assets": true                   /* Upload assets. Can be turned off with --no-assets */,


   // "assetsFolder": null             /* Specific folder name to be used for static assets */,


   // "buildSid": null                 /* An existing Build SID to deploy to the new environment */,


   // "config": null                   /* Location of the config file. Absolute path or relative to current working directory (cwd) */,


   // "createEnvironment": false       /* Creates environment if it couldn't find it. */,


   // "cwd": null                      /* Sets the directory of your existing Serverless project. Defaults to current directory */,


   // "detailedLogs": false            /* Toggles detailed request logging by showing request body and query params */,


   // "edge": null                     /* Twilio API Region */,


   // "env": null                      /* Path to .env file for environment variables that should be installed */,


   // "environment": "dev"             /* The environment name (domain suffix) you want to use for your deployment */,


   // "extendedOutput": false          /* Show an extended set of properties on the output */,


   // "force": false                   /* Will run deployment in force mode. Can be dangerous. */,


   // "forkProcess": true              /* Disable forking function processes to emulate production environment */,


   // "functionSid": null              /* Specific Function SID to retrieve logs for */,


   // "functions": true                /* Upload functions. Can be turned off with --no-functions */,


   // "functionsFolder": null          /* Specific folder name to be used for static functions */,


   // "inspect": null                  /* Enables Node.js debugging protocol */,


   // "inspectBrk": null               /* Enables Node.js debugging protocol, stops execution until debugger is attached */,


   // "legacyMode": false              /* Enables legacy mode, it will prefix your asset paths with /assets */,


   // "live": true                     /* Always serve from the current functions (no caching) */,


   // "loadLocalEnv": false            /* Includes the local environment variables */,


   // "loadSystemEnv": false           /* Uses system environment variables as fallback for variables specified in your .env file. Needs to be used with --env explicitly specified. */,


   // "logCacheSize": null             /* Tailing the log endpoint will cache previously seen entries to avoid duplicates. The cache is topped at a maximum of 1000 by default. This option can change that. */,


   // "logLevel": "info"               /* Level of logging messages. */,


   // "logs": true                     /* Toggles request logging */,


   // "ngrok": null                    /* Uses ngrok to create a public url. Pass a string to set the subdomain (requires a paid-for ngrok account). */,


   // "outputFormat": ""               /* Output the log in a different format */,


   // "overrideExistingProject": false /* Deploys Serverless project to existing service if a naming conflict has been found. */,


   // "port": "3000"                   /* Override default port of 3000 */,


   // "production": false              /* Promote build to the production environment (no domain suffix). Overrides environment flag */,


   // "properties": null               /* Specify the output properties you want to see. Works best on single types */,


   // "region": null                   /* Twilio API Region */,


   // "runtime": null                  /* The version of Node.js to deploy the build to. (node10 or node12) */,


   // "serviceName": null              /* Overrides the name of the Serverless project. Default: the name field in your package.json */,


   // "serviceSid": null               /* SID of the Twilio Serverless Service to deploy to */,


   // "sourceEnvironment": null        /* SID or suffix of an existing environment you want to deploy from. */,


   // "tail": false                    /* Continuously stream the logs */,


   // "template": null                 /* undefined */,


}
Scoped configurations
Some configuration properties are shared across multiple commands and will always be executed. However, there are situations where you might want a configuration to apply only in certain scenarios. This is where scoped configurations come into play.
In addition to defining configuration values on a top level, you can scope them to:
commands: based on the CLI command you use, e.g., start, deploy, list, promote, logs, etc.
environments: based on the value you pass to --environment or by using "*" for --production.
projects: based on the Account SID you deploy to. This doesn't work if you use --username and --password with twilio-run unless you specify an Account SID.
Which one you use depends on your set up but some common use cases are:
Scoping using projects for working with multiple Twilio Accounts/Projects
Scoping using commands for your Continuous Delivery flow
Another common example is using different environment variables for different environments. Take the following configuration:
Copy code block
{


 "environments": {


   "dev": {


     "env": ".env.dev"


   },


   "stage": {


     "env": ".env.stage"


   },


   "*": {


     "env": ".env.prod"


   }


 }


}
In this case depending on which value you pass to --environment it will also change the .env file the CLI will read to get environment variables. More specifically:
twilio serverless:deploy uses the file .env.dev
twilio serverless:deploy --environment stage uses the file .env.stage
twilio serverless:deploy --production uses the file .env.prod
twilio serverless:start falls back to the default meaning .env

Deploy info (.twiliodeployinfo)
This file keeps track of information resulting from your latest deployments. It does so on a per-project basis to make sure when you redeploy and switch between CLI profiles, we will still deploy to the right account. This file is autogenerated and you typically do not have to modify it yourself.
By default, this file is included into your .gitignore since it should not be relevant for other people using the same codebase. If you do share Twilio accounts/credentials, you should instead configure the different serviceSid values in the configuration file. Check out this guide for more information.

Deprecated: .twilio-functions
In previous versions of the Serverless Toolkit you might have found a .twilio-functions file. This file was fulfilling the role of the .twilioserverlessrc and .twiliodeployinfo files with less functionality and more confusion. We deprecated this file in new versions. If you have this file in your project and want to upgrade the latest version of the Serverless Toolkit, you should run the following command to migrate:
Copy code block
npx -p twilio-run twilio-upgrade-config
This will convert your .twilio-functions file into a .twiliodeployinfo file. If you are using custom configuration, you might have to copy some of that into the .twilioserverlessrc file manually.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Configuration and Meta Files | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Serverless Toolkit
Twilio Serverless Toolkit
About
Getting started
General usage
Developing & debugging
Deploying
Configuration and meta files
Examples
Upload assets using the Assets Plugin
Guides
Serverless Toolkit on GitHub
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
The list command
Examples

(information)
This is a Twilio Labs project
This means this project is 100% open-source. You can find its source code in the Twilio Labs GitHub organization
.
We currently don't support the projects through our official support channels. But you are welcome to reach out to us on GitHub for any questions, issues or suggestions or to contribute to this project.
Learn more about Twilio Labs.
There is a lot you can do with the Twilio Serverless Toolkit. Here are some common examples of commands you might want to run.
There are two ways you can use the toolkit. If you are already using the Twilio CLI, you can install it via a plugin. Alternatively, you can use the toolkit as a standalone using twilio-run via npm or another Node.js package manager.
Throughout the docs we'll reference the Twilio CLI commands.

The list command
The list command allows you to list out:
Your services that are associated with your account
The environments for a specific service
Available builds in a specific service
As well as the functions, assets and variables currently deployed in a specific environment of a service
Here is some common tasks you might want to do with the list command.
List existing Serverless services
Copy code block
# List all existing Serverless services in a formatted way:





twilio serverless:list services





# Only list the service SIDs and unique names in a table:





twilio serverless:list services --properties sid,unique_name
Promote a deployment from one environment to another
Copy code block
# Activates the same deployment that is on the "dev" environment to the "stage"





twilio serverless:promote \


 --source-environment=dev \


 --environment=stage

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Examples | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Serverless Toolkit
Twilio Serverless Toolkit
About
Getting started
General usage
Developing & debugging
Deploying
Configuration and meta files
Examples
Upload assets using the Assets Plugin
Guides
Serverless Toolkit on GitHub
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
How to use the Assets Plugin
Install the Assets Plugin
Initialize the plugin
Upload an asset
List your assets
Let's work together
Upload assets using the Assets Plugin

The Assets Plugin is a Twilio CLI plugin that is part of the Serverless Toolkit. It allows you to create an Assets service that you can use as a bucket for static assets, like images or audio files, that you want to upload. You can then use these assets in your Twilio applications. For example, you can upload audio files that you then use in a <Play> verb during a Twilio Voice call, or upload images that you can send to your users via MMS or WhatsApp media messages.

How to use the Assets Plugin
Install the Assets Plugin
Before we can get started using the Assets Plugin we need to install it. As the Assets Plugin is a Twilio CLI plugin, you will need to install the Twilio CLI first. If you have already installed the Twilio CLI, carry on, otherwise follow the instructions for installing the Twilio CLI.
Once the Twilio CLI is installed you can install the Assets Plugin with the following command:
Copy code block
twilio plugins:install @twilio-labs/plugin-assets
Initialize the plugin
The Assets Plugin has three commands: init, upload and list. The first thing you should do is run the init command. Running init will call the Twilio Functions and Assets API to create a new service and store the details about that service so that we can use it with the other commands.
Copy code block
twilio assets:init
The service will be given a random name which will feature in the domain name for the service. If you want to provide your own name, you can pass the --service-name flag to the command.
Copy code block
twilio assets:init --service-name my-cool-assets-service
Upload an asset
With the plugin initialized you can now use it to upload static assets with the upload command. Pass the path of the file you want to upload to the command and it will be deployed to your service.
Copy code block
twilio assets:upload path/to/file
If you only want an asset to be accessible by a Twilio request, you can upload it as a protected asset when you pass the --protected flag.
Copy code block
twilio assets:upload path/to/file --protected
List your assets
The last command allows you to list the assets you have uploaded to the service. Run it with:
Copy code block
twilio assets:list
Your assets, their SIDs, paths, URLs and visibility will be listed. If you want more, or fewer, properties you can select them by passing the --properties flag to the command:
Copy code block
twilio assets:list --properties sid,url,date_created
Or you can output all the properties as JSON:
Copy code block
twilio assets:list -o json

Let's work together
The Assets Plugin is open source as part of the Serverless Toolkit
. If you find any problems with this, please file an issue
 or even create a pull request
 to work together with us on the toolkit. We would love to hear your ideas and feedback!

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Upload assets using the Assets Plugin | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Serverless Toolkit
Twilio Serverless Toolkit
About
Getting started
General usage
Developing & debugging
Deploying
Configuration and meta files
Examples
Upload assets using the Assets Plugin
Guides
Use TypeScript
Use multiple Twilio projects
Continuous delivery/deployment
Use a front-end framework
Use Terraform with serverless
Serverless Toolkit on GitHub
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
Creating a new TypeScript Twilio Serverless project
npm init
Converting an existing Twilio Serverless project
Setup TypeScript
Install Twilio Serverless Runtime definitions
Convert your existing Functions
Caveats
What's next?
Using Twilio Serverless with TypeScript

The Twilio Serverless runtime currently does not support running TypeScript by itself but you can use the TypeScript compiler
 to compile your Functions ahead of time.
We published TypeScript definitions for our Serverless Runtime at @twilio-labs/serverless-runtime-types
.

Creating a new TypeScript Twilio Serverless project
You can create a new Twilio Serverless project via npm init or using the serverless plugin
 for the Twilio CLI. Either way you can opt to create your new project using TypeScript.
npm init
To create a new TypeScript based Twilio Serverless project with npm
 you can run npm init twilio-function with the --typescript option.
New TypeScript Twilio Serverless project with npm
Copy code block
npm init twilio-function project-name --typescript
You can also pass the --typescript option to the Twilio CLI serverless plugin's init command
New TypeScript Twilio Serverless project from Twilio CLI
Copy code block
twilio serverless:init project-name --typescript
Both commands will generate a new project with a srcdirectory that contains your TypeScript source files. When you run npm start or npm run deploy the project will automatically be compiled into the dist directory and run or deployed from there.

Converting an existing Twilio Serverless project
Setup TypeScript
Start by installing the TypeScript compiler for your project using npm
 or another Node.js package manager:
Install TypeScript compiler
Copy code block
# Using npm:


npm install --save-dev typescript





# Using yarn


yarn add --dev typescript
Afterwards create your TypeScript configuration
. You can do this by manually creating a tsconfig.json in your project or by using the TypeScript compilers --init flag.
Creating a TypeScript configuration
Copy code block
# Using npm's npx command


npx tsc --init





# Using yarn


yarn tsc





# Without either


node_modules/.bin/tsc --init
Your resulting tsconfig.json should look something like this if you ignore the comments:
Copy code block
{


 "compilerOptions": {


   "target": "es5",


   "module": "commonjs",


   "strict": true,


   "esModuleInterop": true


 }


}


Install Twilio Serverless Runtime definitions
We need to be able to tell TypeScript about the different types related to the Serverless Runtime. These are called TypeScript definitions and the ones for Serverless Runtime are all bundled in the @twilio-labs/serverless-runtime-types module on npm. You'll need to install it as a dependency for your project.
Install Serverless Runtime TypeScript definitions
Copy code block
# Using npm


npm install @twilio-labs/serverless-runtime-types





# Using yarn


yarn add @twilio-labs/serverless-runtime-types
Convert your existing Functions
If you want to convert your existing Functions from JavaScript to TypeScript you'll need to:
Rename your file to end with .ts instead of .js
Change from require() statements to import
Add import '@twilio-labs/serverless-runtime-types'; to the top of your file
Import additional types necessary from @twilio-labs/serverless-runtime-types
Use export const handler instead of exports.handler
This is how an example TypeScript version of a Twilio Function would look like.
Example Twilio Serverless Function in TypeScript
Copy code block
// Imports global types


import '@twilio-labs/serverless-runtime-types';


// Fetches specific types


import {


 Context,


 ServerlessCallback,


 ServerlessFunctionSignature,


} from '@twilio-labs/serverless-runtime-types/types';





export const handler: ServerlessFunctionSignature = function(


 context: Context,


 event: {},


 callback: ServerlessCallback


) {


 const twiml = new Twilio.twiml.VoiceResponse();


 twiml.say('Hello World!');


 callback(null, twiml);


};


Since Twilio Serverless and the Toolkit don't support TypeScript out of the box yet, we need to run the compiler before the local development or deployment.
Run the TypeScript compiler
Copy code block
# Use npm


npx tsc





# Use yarn


yarn tsc





# Run the compiler directly


./node_modules/.bin/tsc
Afterwards you can deploy the project or locally run your project.
Caveats
Right now we are compiling the TypeScript files in a way that results for the JavaScript output files to live side-by-side with the TypeScript files. This is great because that means the Toolkit commands work without any additional arguments.
To move the output somewhere else, set the outDir option of the compilerOptions inside the tsconfig.json file. Afterwards you'll have to call the Toolkit's start and deploy commands with the --functions-folder flag to point again the functions/ directory inside your output directory.

What's next?
Now that you know how to combine Twilio Serverless and TypeScript, why not check out some other resources to see what you can do with the Twilio Serverless Toolkit?
General Usage
Create a project
Project structure
Start developing locally
Create a new Twilio Function
Deploy a project
Examples

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Using Twilio Serverless with TypeScript | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Serverless Toolkit
Twilio Serverless Toolkit
About
Getting started
General usage
Developing & debugging
Deploying
Configuration and meta files
Examples
Upload assets using the Assets Plugin
Guides
Use TypeScript
Use multiple Twilio projects
Continuous delivery/deployment
Use a front-end framework
Use Terraform with serverless
Serverless Toolkit on GitHub
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
Prerequisites
Twilio CLI Setup
Setup your Twilio Serverless project
Deploying to multiple accounts
Configuration for multiple accounts and team members
Match environment variables to accounts
Using Serverless Toolkit with multiple Twilio Projects

Generally we recommend using Twilio Functions' "Environments" feature to deal with multiple deployments of your Functions project — for example, to verify your changes in a development or staging environment.
However, if you are using Functions in combination with Flex, for example, the chances are high that you are using independent Twilio projects with separate Account SIDs for each environment. The following guide shows you how you can make the most of this scenario.
(warning)
Warning
This guide expects you to have a minimum @twilio-labs/plugin-serverless version of 2.0.0 or twilio-run version of 3.0.0.
You can find your plugin-serverless version by running twilio plugins.
You can find your twilio-run version by running npx twilio-run --version inside your project directory.
While some of the following steps can be achieved with twilio-run, we recommend using the Twilio CLI and @twilio-labs/plugin-serverless when working with multiple projects. An exception is making deployments using a Continuous Delivery (CD) system. If you are doing that, please check out this guide instead.

Prerequisites
Twilio CLI Setup
The Twilio CLI supports using several authentication profiles. You can see which profiles you currently have by running:
Copy code block
twilio profiles:list
Create one for each of the Twilio Projects/Accounts that you want to deploy to by running:
Copy code block
twilio profiles:create
You'll be asked to provide a name for your profile. You can use that name later on in any Twilio CLI command to tell the CLI to use those credentials by using the -p <YOUR_PROFILE_NAME> option.
We'll use my-profile and team-profile as examples.
Setup your Twilio Serverless project
If you don't already have an existing project using the Serverless Toolkit, go ahead and create one by following the instructions in our Getting Started guide. Otherwise, keep reading.

Deploying to multiple accounts
Once you have set up your project and your profiles, you can deploy to the respective profiles by running:
Copy code block
twilio serverless:deploy -p <YOUR_PROFILE_NAME>
For example, I would run:
Copy code block
twilio serverless:deploy -p my-profile
You'll see a file in your project called .twiliodeployinfo that gets updated after each deployment. This file makes sure that switching between different accounts is effortless. By default this file is added to your .gitignore file to prevent it from being tracked in your version control system.
If you are working alone on your project and you don't want different environment variables or similar configuration between the different accounts, you are set.

Configuration for multiple accounts and team members
If you are sharing your project with other developers and you all deploy to the same accounts and/or Function services, you should configure the following settings.
Start by creating a .twilioserverlessrc file at the root of your project — if you don't have one in your project already — and add this to it:
Copy code block
{


 "projects": {





 }


}
Inside the projects key you'll place configuration objects specific to an individual Account SID. This is where we can specify the respective Service SIDs that map to our Account SIDs.
(information)
Info
You can actually copy the information from your .twiliodeployinfo file. Copy the file once you are done deploying for the first time, rename the copy .twilioserverlessrc, and delete the lastBuildSid rows.
Your .twilioserverlessrc file should look something like this:
Copy code block
{


 "projects": {


   "AC11111111111111111111111111111111": {


     "serviceSid": "ZS11111111111111111111111111111111"


   }, 


   "AC22222222222222222222222222222222": {


     "serviceSid": "ZS22222222222222222222222222222222"


   }


 }


}
Whenever you run any twilio serverless: command it will look up the Account SID here and apply the configuration you specified for that Account.
Match environment variables to accounts
You might want to configure the use of different environment variables for each Account SID. You can do that by creating a configuration similar to this:
Copy code block
{


 "projects": {


   "AC11111111111111111111111111111111": {


     "serviceSid": "ZS11111111111111111111111111111111",


     "env": ".env.dev"


   }, 


   "AC22222222222222222222222222222222": {


     "serviceSid": "ZS22222222222222222222222222222222",


     "env": ".env.production"


   }


 }


}
In this case if I deploy using twilio serverless:deploy -p my-profile, which maps to AC11111111111111111111111111111111, it will use the .env.dev file. When I run twilio serverless:deploy -p team-profile instead, it will use my .env.production file.
There are many things you can configure here. In general you can specify in the configuration anything that you can pass as a flag to the CLI. Check out our Configuration and Meta Files documentation to learn more about it.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Using Serverless Toolkit with multiple Twilio Projects | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Serverless Toolkit
Twilio Serverless Toolkit
About
Getting started
General usage
Developing & debugging
Deploying
Configuration and meta files
Examples
Upload assets using the Assets Plugin
Guides
Use TypeScript
Use multiple Twilio projects
Continuous delivery/deployment
Use a front-end framework
Use Terraform with serverless
Serverless Toolkit on GitHub
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
Project Setup
Using the Right Tool
Adding Basic Configuration
Using Environment Variables
Updating your CI/CD flow
Continuous Deployment using the Serverless Toolkit

In general the Serverless Toolkit is compatible with any Continuous Integration / Continuous Delivery (CI/CD) system that can install and run Node.js projects. However, some things translate better than others into a CI/CD flow. In this guide we'll cover how you can set up your project to integrate with your CI/CD system. The steps will be independent of any specific CI/CD system but should translate to most major systems.

Project Setup
If you don't have an existing Serverless Toolkit project yet, follow our Getting Started guide to set up your project.

Using the Right Tool
While you can use the Twilio CLI and @twilio-labs/plugin-serverless in your CI/CD system, it might lead to some conflicts and longer execution times. Instead, if you don't do any other configuration using the Twilio CLI other than twilio serverless commands, we recommend to install twilio-run as a developer dependency in your project.
(information)
Info
twilio-run is the core that powers any twilio serverless command but does not come with any additional overhead.
(warning)
Warning
If you do use @twilio-labs/plugin-serverless (twilio serverless) instead of twilio-run, we recommend pinning the version of the plugin to at least the major version you are using. For example for any version 2.x.x:
Copy code block
twilio plugins:install @twilio-labs/plugin-serverless@v2
Otherwise you run into the risk of installing the latest version inside your CI/CD system which might result in your flow breaking due to major version changes.
Important: Make sure the twilio-run version is at least 3.0.0.
Install twilio-run by running inside your project:
Copy code block
npm install --save-dev twilio-run

Adding Basic Configuration
Most of the configuration that we'll do can be handled through command-line flags, but for convenience we'll use a .twilioserverlessrc configuration file instead. If your project doesn't have one yet, start by creating a .twilioserverlessrc file at the root of your project.
Add the following content to it:
Copy code block
{


 "commands": {


   "deploy": {


    /* Your configuration */


   }


 }


}
Anything we specify in the /* Your configuration */ section will now be applied whenever we run twilio-run deploy or twilio serverless:deploy. Alternatively you can scope these configurations to a specific environment or account. Check out our Configuration docs and our guide for working with multiple Twilio accounts for more concrete details on that.
For the purpose of this example we'll only execute deploy from our CI/CD system and hence scope the configuration to the deploy command.
Since twilio-run will not be directly accessible as a command in your CI/CD, make sure your "scripts" section inside the package.json file contains a line such as:
Copy code block
   "deploy": "twilio-run deploy",
This will ensure that you can run npm run deploy which will trigger twilio-run deploy.

Using Environment Variables
By default, the Serverless Toolkit leverages .env files to specify which environment variables should be deployed. However, in your CI/CD system you want to safely store your credentials in the respective secrets store provided by your CI/CD system. Generating a .env file from there can be tedious.
Instead we can use the loadSystemEnv option. If you enable this option you have to specify a "template .env file" through the env option in your configuration. This template file should NOT contain any sensitive information such as secrets. Instead it only lists the keys of the environment variables that should be loaded from the system.
(error)
Danger
Important: You should never check a .env file that contains your credentials into your version control system
Create a file such as .env.example that only contains the key name of an environment variable that will be present in your CI/CD system. For example:
Copy code block
MY_ENVIRONMENT_VALUE_EXAMPLE=
As long as you make sure that this file does not contain the actual secrets, you can check this file into your version control system such as git.
Then adjust your .twilioserverlessrc file accordingly:
Copy code block
{


 "commands": {


   "deploy": {


     "loadSystemEnv": true,


     "env": ".env.example"


   }


 }


}
With these changes during deployment twilio-run will take the keys that are in the .env.example (in this example MY_ENVIRONMENT_VALUE_EXAMPLE) and look up the corresponding values in your CI/CD environment to upload the values into your serverless deployment.
Before we can deploy, however, will have to provide credentials for twilio-run to use when deploying your code. While you could provide those by adding ACCOUNT_SID and AUTH_TOKEN keys to the .env.example file and storing those credentials in your environment, the recommended way is to use an API Key and Secret pair for your account as these are easier to rotate in case they get compromised.
Go into the Twilio Console, generate a new pair of API Key and Secret
 and store these as TWILIO_API_KEY and TWILIO_API_SECRET in the secret storage of your CI/CD system so they get injected into your CI/CD systems environment variables.
Modify your package.json file to update your deploy script to the following:
Copy code block
   "deploy": "twilio-run deploy --username $TWILIO_API_KEY --password $TWILIO_API_SECRET",
This way your credentials are being used to deploy the project but the values themselves are not being uploaded into your deployments environment variables.
Now if you execute npm run deploy it will deploy your project using TWILIO_API_KEY and TWILIO_API_SECRET as credentials. Afterwards it look up the value of the MY_ENVIRONMENT_VALUE_EXAMPLE environment variable on the respective system executing the command and set it as an environment variable on your deployment.

Updating your CI/CD flow
Now that your system is configured you need to update your CI/CD system to:
Store the secrets you want to deploy inside the respective secret store of your CI/CD system
Make sure they are available as environment variables when your CI/CD system runs
Add npm run deploy to the commands executed by your CI/CD system when it is supposed to deploy.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Continuous Deployment using the Serverless Toolkit | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Serverless Toolkit
Twilio Serverless Toolkit
About
Getting started
General usage
Developing & debugging
Deploying
Configuration and meta files
Examples
Upload assets using the Assets Plugin
Guides
Use TypeScript
Use multiple Twilio projects
Continuous delivery/deployment
Use a front-end framework
Use Terraform with serverless
Serverless Toolkit on GitHub
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
Setup
Setup your Twilio Serverless project
Pick your build tool
Define your project structure
Update your gitignore
Install other helpful tools
Configure the Serverless Toolkit
Set up your build steps
Start building your front-end
Installing Dependencies
Multiple file versions
Calling Functions
Static Assets
Limitations
Using a Front-End Framework with Twilio Serverless

Additionally to using Twilio Assets to host audio files for your phone calls or files for shared logic between your Twilio Functions you can also use it to serve front-end web assets such as HTML, JS and CSS files.
In this guide we'll talk about how you can use the Serverless Toolkit to use front-end frameworks to build you web assets. As an example we'll be using React
 as a front-end framework but you can use any common framework including Vue
 and Angular
.

Setup
Setup your Twilio Serverless project
If you don't already have an existing project using the Serverless Toolkit, go ahead and create one by following the instructions in our Getting Started guide. Otherwise, keep reading.
Pick your build tool
In this guide we'll be using Parcel
 as our build tool of choice but you can apply similar steps to Webpack
 or other bundlers.
Make sure to install your bundler tool in the devDependencies section of your package.json.
To install Parcel run:
Copy code block
npm install parcel-bundler --save-dev
Define your project structure
By default a project created with the Serverless Toolkit will contain a functions/ and an assets/ directory. In our case we'll want to keep the two directories but we'll also add two new directories:
src/ will contain our front-end code that we'll end up passing through the Parcel Bundler
dist/ will serve as the source of truth for the assets that we'll deploy. In our case this will be a combination of the bundled assets from src/ and the static files from the assets/ directory.
Create the src/ directory and add an index.html file to it as this will serve as the entry point for our bundler.
This is where you'll reference other files that should be bundled such as stylesheets or JavaScript files. For more information, make sure to check out the Parcel documentation
.
Update your gitignore
Since the dist/ directory contains bundled files it does not make sense to version control this directory. Instead make sure to add it to your .gitignore file at the root of your project.
Copy code block
dist/
Install other helpful tools
We'll be using two other tools:
concurrently
 to run the Parcel build process at the same time as twilio-run to serve our project.
ncp
 to copy files from assets/ to dist/
rimraf
 to delete the dist/ directory before building the Assets
Install the two dependencies by running:
Copy code block
npm install concurrently ncp --save-dev
Configure the Serverless Toolkit
By default the Serverless Toolkit will use the assets/ directory to serve and deploy Twilio Assets.
You can modify this behavior by using the --assets-folder flag but the easier way is by creating/modifying your .twilioserverlessrc file at the root of your project the following way:
Copy code block
{


 "commands": {},


 "environments": {},


 "projects": {},


 // "assets": true     /* Upload assets. Can be turned off with --no-assets */,


 "assetsFolder": "dist"     /* Specific folder name to be used for static assets */,


 // ..


}
Set up your build steps
Next we need to define a couple of "scripts" inside our package.json to make executing the right steps easier.
Modify the scripts section of your package.json the following way:
Copy code block
"scripts": {


 "prebuild": "rimraf dist",


 "build": "parcel build src/index.html -d dist",


 "postbuild": "ncp assets dist",


 "predeploy": "npm run build",


 "deploy": "twilio-run deploy",


 "start:web": "parcel watch src/index.html -d dist",


 "start:twilio": "twilio-run",


 "prestart": "ncp assets dist",


 "start": "concurrently npm:start:web npm:start:twilio"


},
This way you'll have three distinct commands:
npm start will start the build server for Parcel and serve all Assets and Functions locally using twilio-run
npm run build to build all front-end assets and copy over all static files from assets/
npm run deploy will run npm run build and take all files in dist/ and deploy them together with all Functions from functions/ to Twilio Functions.
(information)
Info
If you are using twilio serverless:deploy to deploy your application instead of twilio-run you have to manually run npm run build first and then can normally deploy using twilio serverless:deploy.

Start building your front-end
Now that we set up our build chain you can start developing your project.
Most things should work as you are used to but there are a few things to keep in mind.
Installing Dependencies
All dependencies for your UI should be installed as devDependencies unless they are also used from within your Functions. For example, let's say we want to use React with Twilio's Paste Design System
. We'd install the dependencies the following way:
Copy code block
npm install react react-dom prop-types @twilio-paste/core @twilio-paste/icons --save-dev
Note the --save-dev at the end. If you are using yarn or pnpm both of them support equivalent flags to store dependencies as devDependencies.
If you do not install them as devDependencies but as dependencies instead, they'll be installed in your Twilio Functions deployment which increased deployment times and might cause other unintended side effects including failed builds.
Multiple file versions
When you run npm run deploy or twilio serverless:deploy the tool will automatically deploy everything in the dist/ folder but nothing else. Meaning if you are building your output files with file hashes in the name (e.g. main.a124bfc.js) and the build changes that hash to a different one (e.g. main.a12222f.js) and you deleted the dist/ folder prior to building (default in the scripts above) this will result in main.a124bfc.js to not be served anymore post deployment. The Serverless Toolkit currently does not support additive deployments that would support both versions to be available.
On the flip-side keeping your dist/ folder as lean as possible will reduce the deployment time.
Calling Functions
With the setup described above you should be able to call any of your Functions that exist in the functions/ directory by specifying the absolute path of them. For example for a Function with the file functions/token.js you can make an HTTP request from within your front-end to /token.
For example:
Copy code block
fetch('/token')


 .then(response => response.json())


 .then(data => {


   console.log(data);


 });
Static Assets
We talked about "static" assets above? What are those and why are we keeping those separately in a assets/. With static assets in this case we mean any file we don't want to have processed by our build tooling. Common types of such assets could be media files — for example an mp3 file that you are referencing in the TwiML for your Twilio Voice call — or a private JavaScript module that you are referencing for from one of your Twilio Functions to store shared logic. In general private assets are likely going to be static assets that you might want to store in the assets/ directory.
Limitations
At the current moment Twilio Assets does not support the following two features that you might have to consider when building your front-end on Twilio Serverless:
No URL fallbacks/redirects meaning you cannot use tools such as react-router unless you are operating them in a hash-based routing mechanism. You'll always have to serve to specify the full URL. The only current exception is if you have a file with the path /assets/index.html you can use / to reference the same file. In our case this means that you'd have to have Parcel output a file in the directory dist/assets/index.html which then, once deployed, will be available both at https://<service_name>-<number>-<environment_suffix>.twil.io/ and https://<service_name>-<number>-<environment_suffix>.twil.io/assets/index.html.
No built-in build system you have to build all the respective files and trigger your deployment either locally or using your own CI/CD system of choice. Check out the following guide on using Twilio Serverless from CI/CD for more guidance.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Using a Front-End Framework with Twilio Serverless | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Serverless Toolkit
Twilio Serverless Toolkit
About
Getting started
General usage
Developing & debugging
Deploying
Configuration and meta files
Examples
Upload assets using the Assets Plugin
Guides
Use TypeScript
Use multiple Twilio projects
Continuous delivery/deployment
Use a front-end framework
Use Terraform with serverless
Serverless Toolkit on GitHub
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
Prerequisites
A brief Terraform introduction
1. Provisioning not deployment
2. Maintaining state
3. Providers
4. Common Terraform commands
Write your Terraform script
Use the Twilio provider for Terraform
Define which resources to create
Declare your output
Run your Terraform script
Deploy your code
Create more resources with Terraform
Use a Continuous Delivery system
Use Terraform and Twilio Serverless

Terraform
 is an infrastructure as code (IaC) tool that makes it easier to provision the infrastructure resources for your application. In this guide we will look at how and why you might want to leverage Terraform with your Twilio Functions and Assets project.

Prerequisites
You'll need the latest Terraform CLI
 installed on your system.
Additionally, make sure you have either have the following environment variables defined on your system:
TWILIO_ACCOUNT_SID with the Account SID of the project you want to deploy to
TWILIO_API_KEY with a valid API Key
TWILIO_API_SECRET with a valid secret for your API Key
Make sure you also have the latest version of the Serverless Toolkit installed. In this tutorial we'll be using the Twilio CLI plugin. Install the latest version of the Serverless Toolkit by running:
Copy code block
twilio plugins:remove @twilio-labs/plugin-serverless


twilio plugins:install @twilio-labs/plugin-serverless@latest
You'll also need an existing Twilio Serverless project created with the Serverless Toolkit. If you don't have one you can follow the Getting Started guide.

A brief Terraform introduction
Before we start with the work, there's a couple of things you need to understand about Terraform.
1. Provisioning not deployment
Terraform is primarily used to provision various resources but not for deploying applications. By default when you run twilio serverless:deploy or twilio-run deploy the Serverless Toolkit will handle both provisioning the respective Serverless Service and Environment and afterwards deploy your code to them.
Provisioning in this context is creating a Serverless Service/Environment resource but could also be any other Service you'd be creating using the CLI, API, or the Console. This can even be purchasing a new phone number. Deploying involves taking the respective code for your project and uploading it to those provisioned resources.
With Terraform we are splitting provisioning and deployment into distinct steps. Splitting these two steps has a couple of benefits:
Separation of concerns. With Terraform you can provide a variety of Twilio and non-Twilio resources (more about this later). Grouping all resource provisioning together makes it easier to identify what resources are required for a project.
Predictable and reproducible. Especially if your project involves several Twilio resources having these steps separately means we can rely on the correct resources to be created and can even share it with colleagues working on the same project (see the next section on state).
2. Maintaining state
An important aspect of Terraform is the fact that it maintains state of your resources. It does so by either creating a .tfstate file on your system or by storing it in a backend of your choice
. The Terraform state contains information such as the SIDs of the Twilio resources you might have created through Terraform. By sharing this Terraform state with your colleagues by using a shared backend (you generally don't want to check-in a .tfstate file in your project) you can make sure you are all deploying to the right project.
3. Providers
Terraform providers are essentially integrations that can be used to teach Terraform how to create certain resources. We've released a Twilio provider for Terraform
 that we'll be using as part of this project. If you find any issues with it, don't hesitate to create a GitHub issue on the project
.
In the Terraform Registry
 you can find a wide variety of providers for other platforms.
4. Common Terraform commands
There are a few common Terraform commands that will likely use when working with Terraform.
terraform init is used to set up your project. You'll need to run this for example if you clone your project or if you start using new providers. terraform fmt will make sure your Terraform file is formatted appropriately. terraform validate verifies that your file is correct including using the right resources available through the provider. terraform plan will compute the plan on how Terraform can move from the current state to the new state described in your Terraform file. terraform apply will handle the actual provisioning. It also runs terraform plan under the hood if you didn't run it before.

Write your Terraform script
Start by creating a main.tf file at the root of your project.
All the following code has to be added to this main.tf file in the order mentioned below. At the end of the section you can also find the full file if you want to copy and paste it.
Use the Twilio provider for Terraform
To create the Twilio resources we'll be using the Twilio provider
. In order to make sure you are using the latest version, head over to the Terraform Registry page
. Click the "Use Provider" button and copy the content into your main.tf file.
The result should look like this with possibly a different version.
Copy code block
terraform {


 required_providers {


   twilio = {


     source  = "twilio/twilio"


     version = "0.7.0"


   }


 }


}





provider "twilio" {


 # Configuration options


}
Define which resources to create
From here we can define which resources we want to create with Terraform. You can find a list of all available Twilio resources on GitHub
. In our case we'll create a twilio_serverless_services_v1 and a twilio_serverless_services_environments_v1 as both are required for our Serverless deployment.
Add the following lines to your main.tf file:
Copy code block
resource "twilio_serverless_services_v1" "service" {


 friendly_name       = "Terraform Example Service"


 unique_name         = "terraform-demo"


 include_credentials = true


}





resource "twilio_serverless_services_environments_v1" "environment" {


 service_sid   = twilio_serverless_services_v1.service.sid


 unique_name   = "stage-environment"


 domain_suffix = "stage"


}
The first resource we create is a Serverless Service with the name terraform-demo and friendly name Terraform Example Service. The second resource we create is a Serverless Environment with the domain suffix stage and name stage-environment. For this resource we are passing in the SID of the previously created Service.
This is one of the strengths of us using Terraform for the provisioning as we can immediately define the relationship between the resources.
Declare your output
We'll have to tell the Serverless Toolkit to deploy the code to the Service and Environment we provisioned with Terraform. To do this we have to output the SIDs for the Service and Environment from Terraform.
Add the following code to your main.tf to output the relevant SIDs:
Copy code block
output "serverlessService" {


 value     = twilio_serverless_services_v1.service.sid


 sensitive = true


}





output "serverlessEnvironment" {


 value     = twilio_serverless_services_environments_v1.environment.sid


 sensitive = true


}
This completes our main.tf Terraform file that should look in total like this:
Copy code block
terraform {


 required_providers {


   twilio = {


     source  = "twilio/twilio"


     version = "0.7.0"


   }


 }


}





provider "twilio" {


 # Configuration options


}





resource "twilio_serverless_services_v1" "service" {


 friendly_name       = "Terraform Example Service"


 unique_name         = "terraform-demo"


 include_credentials = true


}





resource "twilio_serverless_services_environments_v1" "environment" {


 service_sid   = twilio_serverless_services_v1.service.sid


 unique_name   = "stage-environment"


 domain_suffix = "stage"


}





output "serverlessService" {


 value     = twilio_serverless_services_v1.service.sid


 sensitive = true


}





output "serverlessEnvironment" {


 value     = twilio_serverless_services_environments_v1.environment.sid


 sensitive = true


}

Run your Terraform script
Now that we have our completed Terraform file it's time to provision our resources.
First, if you have not done so yet, initialize your Terraform project by running:
Copy code block
terraform init
Next ensure that your main.tf is valid by running:
Copy code block
terraform fmt


terraform validate
If you want to get a preview of what will be provisioned run:
Copy code block
terraform plan
Now it's time to provision the resources by running:
Copy code block
terraform apply
Once you confirmed the provisioning with yes all the resources will be created using the credentials in your environment variables.
You should also see the new service that was created in your Twilio Console
.

Deploy your code
Now that the resources have been provisioned we can deploy our code. For this we first have to retrieve the relevant SIDs from Terraform. We can use terraform output for this.
We'll store them in temporary variables using:
Copy code block
SERVERLESS_SID=$(terraform output -raw serverlessService)


ENVIRONMENT_SID=$(terraform output -raw serverlessEnvironment)
With this we can trigger the deployment by passing in the relevant SIDs using --service-sid and --environment:
Copy code block
twilio serverless:deploy \


   --service-sid "$SERVERLESS_SID" \


   --environment "$ENVIRONMENT_SID" \


   --username $TWILIO_API_KEY


   --password $TWILIO_API_SECRET
This will kick of the same deployment that you are used to but it will explicitly deploy to the Service and Environment you have passed in.

Create more resources with Terraform
As mentioned before we can use Terraform to provision a variety of Twilio resources. For example you can use it to provision a Verify service by adding:
Copy code block
resource "twilio_verify_services_v2" "service" {


 friendly_name = "Verify Demo"


}





output "verifyServiceSid" {


 value     = twilio_verify_services_v2.service.sid


 sensitive = true


}
If you want to pass the Service SID to your Twilio Functions deployment you can do this using the Serverless Toolkit by running:
Copy code block
VERIFY_SERVICE_SID=$(terraform output -raw verifyServiceSid)


twilio serverless:env:set --key VERIFY_SERVICE_SID --value "$VERIFY_SERVICE_SID"
Check out more examples on the Twilio Terraform Provider GitHub
.

Use a Continuous Delivery system
With all of this set up we can actually move this into a Continuous Integration / Continuous Delivery (CI/CD) system. How exactly you use Terraform depends on your the system you are using. Make sure to consult the Terraform docs for more information. You will also have to use some backend to store your Terraform state. To learn more on how to use the Serverless Toolkit from CI/CD environments check out our dedicated guide for it.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Use Terraform and Twilio Serverless | Twilio
Skip to content
Navigation Menu
twilio-labs
serverless-toolkit
Type / to search
Code
Issues43
Pull requests11
Actions
Projects
Security
Insights

serverless-toolkit
Public
twilio-labs/serverless-toolkit
t
Name




github-actions[bot]
Version Packages (#536)
d997dfa · 3 months ago
.changeset
Version Packages (#536)
3 months ago
.github
Add no response GH action (#515)
last year
.husky
chore(husky): only force run tests before push (#322)
4 years ago
.vscode
🔧 Add vscode config
7 years ago
docs
FRIDGE-814 upgrade to twilio 4.23.0, fix tests (#509)
last year
images
docs: move docs from serverless-toolkit
5 years ago
packages
Version Packages (#536)
3 months ago
.all-contributorsrc
FRIDGE-734 make serverless-toolkit work with node v18 (#493)
2 years ago
.editorconfig
refactor(plugin-serverless): remove redundant files
5 years ago
.gitattributes
refactor(plugin-serverless): remove redundant files
5 years ago
.gitignore
FRIDGE-814 upgrade to twilio 4.23.0, fix tests (#509)
last year
.npmrc
chore: add npm registry link (#463)
2 years ago
.nvmrc
FRIDGE-734 make serverless-toolkit work with node v18 (#493)
2 years ago
.prettierrc
fix(serverless-api): retries on 429 error for POST request
5 years ago
CODE_OF_CONDUCT.md
docs: update links in CoC to https (#88)
6 years ago
LICENSE
chore(license): update copyright notice
6 years ago
README.md
docs: remove lerna references
2 years ago
commitlint.config.js
chore: replace lerna with changesets
2 years ago
jest.config.base.js
[Snyk] Security upgrade jest from 28.1.3 to 29.0.0 (#491)
last year
jest.config.js
refactor: create monorepo w/ lerna
5 years ago
package.json
fix(twilio-run): handle adding object as header correctly as an error (…
7 months ago
tsconfig.base.json
Update version for default packages (#524)
last year
tsconfig.test.json
build(test): enable incremental builds
5 years ago

Repository files navigation
README
Code of conduct
MIT license
*
Serverless Toolkit

What is the Serverless Toolkit?
The Serverless Toolkit is CLI tooling to help you develop locally and deploy to the Twilio Functions & Assets.
There are two ways you can use the toolkit. If you are already using the Twilio CLI, you can install it via a plugin. Alternatively, you can use the toolkit as a standalone using twilio-run via npm or another Node.js package manager.
Throughout the docs, you can switch in the code snippets between Twilio-CLI and Bash Session to get the commands for both versions.
Let's work together
Everything in this toolkit is released under Twilio Labs and fully open-source. If you find any problems with this, please file an issue or even create a pull request to work together with us on the toolkit. We would love to hear your ideas and feedback!
Project Structure & Contributing
This project is a monorepo, meaning it contains multiple packages in one repository. It consists out of the following packages:
twilio-run - The underlying CLI tool
plugin-serverless - Exposes the twilio-run CLI into the Twilio CLI
create-twilio-function - Handles templating and bootstrapping of new projects and Functions
serverless-api - The module used to interact with the actual Twilio Functions and Assets API
runtime-handler - A version of the Twilio Functions Runtime Handler to be used in local development
plugin-assets - A plugin for the Twilio CLI to easily upload assets to a Twilio Assets service
serverless-runtime-types - TypeScript definitions to define globals for the Twilio Serverless runtime
Also part of the Serverless toolkit, but in another repository:
function-templates - The templates used by the toolkit to create new Functions
To understand more about the structure and the design of the Toolkit check out the design documentation.
Setup & Development
This project uses npm workspaces as a tool to manage the monorepo. If you are unfamiliar with the tool, start by checking out the the npm docs and make sure you use at least npm version 8 or newer (npm install -g npm@8).
git clone git@github.com:twilio-labs/serverless-toolkit.git
cd serverless-toolkit
npm install
npm run build
License
MIT
Disclaimer
Unofficial logo. Not a Twilio logo.
About
CLI tool to develop, debug and deploy Twilio Functions
www.twilio.com/docs/labs/serverless-toolkit
Topics
nodejs cli twilio nodejs-cli twilio-functions twilio-serverless
Resources
 Readme
License
 MIT license
Code of conduct
 Code of conduct
 Activity
 Custom properties
Stars
 121 stars
Watchers
 9 watching
Forks
 63 forks
Report repository
Releases 38
@twilio-labs/serverless-api@5.7.0Latest
on Apr 30
+ 37 releases
Packages
No packages published
Contributors46














+ 32 contributors
Languages
TypeScript76.3% 
JavaScript22.3% 
Other1.4%
Footer
© 2025 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact
Manage cookies
Do not share my personal information
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Runtime Client
Runtime Handler
Environment variables
Regional support
Dependencies
Headers and cookies
Debugging
Frequently asked questions
Examples
Migration guides
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
Methods
getAssets()
getFunctions()
getSync(options?)
Runtime Client

The Twilio Runtime Client provides a direct way of orchestrating the various parts of the Twilio Runtime without requiring an imported module. Using the Runtime Client, developers can reference other Functions to better organize their code, access configuration and files stored in Assets, and manage real-time data via Twilio Sync.
Access the Runtime Client in a Function by referencing Runtime, which exposes the following API:
Methods
getAssets()
getFunction()
getSync()

Methods
getAssets()
The getAssets method returns an object that contains the names each private Asset in a Service. Each Asset name serves as the key to an Asset object that contains the path to that Asset, as well as an open method that can be conveniently used to access its contents. These paths can be used to retrieve files served on Twilio Assets.
For example, executing Runtime.getAssets() could return an object with the following private Assets:
Copy code block
{


 '/names.json': {


   path: '/var/task/files/ZNdad14da2e70d2533f640cf362fec0609',


   open: [Function: open]


 },


 '/rickroll.mp3': {


   path: '/var/task/files/ZNdfbfaf15a02e244fa11337548dabd9d0',


   open: [Function: open]


 },


 '/helper-method.js': {


   path: '/var/task/files/ZN5d6d933785a76da25056328a5764d49b',


   open: [Function: open]


 }


}
(warning)
Warning
getAssets() only returns private Assets. Public and protected assets can be accessed via their publicly facing urls without the need for calling getAssets(). Refer to the visibility guide for more context!
(warning)
Warning
Note that an Asset such as names.json will be returned with a key of '/names.json'. To correctly retrieve the Asset and its path, the leading / and extension must be part of the key used to access the object returned by Runtime.getAssets().
For example: Runtime.getAssets()['/names.json'].path
Asset Properties
Property
Type
Description
path
string
String specifying the location of the private Asset
open
function
Convenience method that returns the contents of the file from path in utf8 encoding

Examples
(information)
Info
If you would like to include a JavaScript module that isn't available on npm, the best way to do so is to upload the module as a private Asset, then use getAssets in order to require the module as shown in the Load a module from an asset code example.
Retrieve the path of an Asset
Example of how to get the file path for an Asset
Copy code block
exports.handler = function (context, event, callback) {


 // Note: the leading slash and file extension are necessary to access the Asset


 const path = Runtime.getAssets()['/my-asset.json'].path;





 console.log('The path is: ' + path);





 return callback();


};
Load a module from an Asset
Example of how to load a third party library stored in an Asset
Copy code block
exports.handler = function (context, event, callback) {


 // First, get the path for the Asset


 const path = Runtime.getAssets()['/answer-generator.js'].path;





 // Next, you can use require() to import the library


 const module = require(path);





 // Finally, use the module as you would any other!


 console.log('The answer to your riddle is: ' + module.getAnswer());





 return callback();


};
Read the contents of an Asset
Leverage the built-in open method for convenience
Copy code block
exports.handler = function (context, event, callback) {


 const openFile = Runtime.getAssets()['/my_file.txt'].open;


 // Calling open is equivalent to using fs.readFileSync(asset.filePath, 'utf8')


 const text = openFile();





 console.log('Your file contents: ' + text);





 return callback();


};
Read the contents of an Asset
Directly read the contents of an Asset using filesystem methods
Copy code block
// We're reading a file from the file system, so we'll need to import fs


const fs = require('fs');





exports.handler = async function (context, event, callback) {


 // Retrieve the path of your file


 const file = Runtime.getAssets()['/my_file.txt'].path;


 // Asynchronously read the file using a different encoding from utf8


 const text = await fs.readFile(file, 'base64');





 console.log('Your file contents: ' + text);





 return callback();


};
getFunctions()
The getFunctions method returns an object that contains the names of every Function in the Service. Each Function name serves as the key to a Function object that contains the path to that Function. These paths can be used to import code from other Functions and to compose code hosted on Twilio Functions.
For example, executing Runtime.getFunctions() could return an object with the following Functions:
Copy code block
{


 'sms/reply': {


   path: '/var/task/handlers/ZNdad14da2e70d2533f640cf362fec0609.js',


 },


 'helper': {


   path: '/var/task/handlers/ZNdfbfaf15a02e244fa11337548dabd9d0.js',


 },


 'example-function': {


   path: '/var/task/handlers/ZN5d6d933785a76da25056328a5764d49b.js',


 },


}
(warning)
Warning
Note that, unlike an Asset, a Function such as sms/reply.js will be returned with a key of "sms/reply". To correctly retrieve the Function and its path, do not include characters such as a leading slash or the .js extension in the key used to access the object returned by Runtime.getFunctions().
For example: Runtime.getFunctions()["sms/reply"].path
Function Properties
Property
Type
Description
path
string
String specifying the location of the Function

Examples
Retrieve the path for a Function
Example of how to retrieve the file path for a Function
Copy code block
exports.handler = function (context, event, callback) {


 // Get the path for the Function. Note that the key of the function


 // is not preceded by a "/" as is the case with Assets


 const path = Runtime.getFunctions()['example-function'].path;





 console.log('The path to your Function is: ' + path);





 return callback();


};
Include a private Function in another Function
Private Functions are a great way to store methods that may be reused between your other Functions. For example, lets say we have a private Function called Zoltar that exports a fortune-generating method, ask:
Define a private helper Function
Implement Zoltar and define an ask method
Copy code block
exports.ask = () => {


 // We're not totally sure if Zoltar's advice is all that helpful


 const fortunes = [


   'A long-forgotten loved one will appear soon.',


   'Are you sure the back door is locked?',


   "Communicate!  It can't make things any worse.",


   'Do not sleep in a eucalyptus tree tonight.',


   'Fine day for friends.',


   'Good news.  Ten weeks from Friday will be a pretty good day.',


   'Living your life is a task so difficult, it has never been attempted before.',


   'Stay away from flying saucers today.',


   'The time is right to make new friends.',


   'Try to relax and enjoy the crisis.',


   'You need more time; and you probably always will.',


   'Your business will assume vast proportions.',


 ];





 // Generate a random index and return the given fortune


 return fortunes[Math.floor(Math.random() * fortunes.length)];


};
You could then access this private method by using Runtime.getFunctions() to get the path for the Zoltar Function, import Zoltar as a JavaScript module using require, and then access the ask method as in the following code sample:
Include code from a Function
Example of how to include code from other Functions
Copy code block
exports.handler = function (context, event, callback) {


 // First, get the path for the Function. Note that the key of the function


 // is not preceded by a "/" as is the case with Assets


 const zoltarPath = Runtime.getFunctions()['zoltar'].path;





 // Next, use require() to import the library


 const zoltar = require(zoltarPath);





 // Finally, use the module as you would any other!


 console.log('The answer to your riddle is: ' + zoltar.ask());





 return callback();


}
getSync(options?)
We've made it convenient for you to access the Sync REST API from Functions. Use the Runtime Client to access any of Sync's real-time data primitives and store information between Function invocations. The same data can be accessed using the Sync API library, making Sync from Functions the perfect way to update your real-time apps and dashboards.
The Runtime Client provides a wrapper around the Twilio REST API Helper for Twilio Sync. By default, calling Runtime.getSync() will return a Sync Service object that has been configured to work with your default Sync Instance.
For added convenience and less typing, the following methods returned from getSync are renamed from their usual name in the Node.js SDK, as you will see in the examples.
Default method name
Method name in Functions
syncMaps
maps
syncLists
lists

Arguments
getSync optionally accepts a configuration object with the following properties.
Parameter
Type
Description
serviceName
string
String specifying either the serviceSid or uniqueName of the Sync Service to connect to. Defaults to default.

Examples
Get the default Sync Service Instance
Example of how to get the default Sync Service Instance
Copy code block
exports.handler = (context, event, callback) => {


 // Use the getSync method with no arguments to get a reference to the default


 // Sync document for your account. Fetch returns a Promise, which will


 // eventually resolve to metadata about the Sync Service, such as its SID


 Runtime.getSync()


   .fetch()


   .then((defaultSyncService) => {


     console.log('Sync Service SID: ', defaultSyncService.sid);


     return callback(null, defaultSyncService.sid);


   })


   .catch((error) => {


     console.log('Sync Error: ', error);


     return callback(error);


   });


};
Get an existing Sync Service Instance
Example of how to use Runtime Client to get an Sync Service Instance by providing the SID
Copy code block
exports.handler = (context, event, callback) => {


 // Pass a serviceName to getSync to get a reference to that specific


 // Sync document on your account. Fetch returns a Promise, which will


 // eventually resolve to metadata about the Sync Service, such as friendlyName


 Runtime.getSync({ serviceName: 'ISXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' })


   .fetch()


   .then((syncService) => {


     console.log('Sync Service Name: ' + syncService.friendlyName);


     return callback(null, syncService.friendlyName);


   })


   .catch((error) => {


     console.log('Sync Error: ', error);


     return callback(error);


   });


};
Create a Sync Map using Runtime Client
Example of how to create a Map in Sync with the Runtime Client
Copy code block
exports.handler = (context, event, callback) => {


 // maps, which is a shortcut to syncMaps, allows you to create a new Sync Map


 // instance. Be sure to provide a uniqueName identifier!


 Runtime.getSync()


   .maps.create({


     uniqueName: 'spaceShips',


   })


   .then((newMap) => {


     console.log(newMap);


     return callback(null, newMap);


   })


   .catch((error) => {


     console.log('Sync Error: ', error);


     return callback(error);


   });


};
Add entry to a Sync Map with Runtime Client
Example of how to add an entry to a Sync Map with the Runtime Client
Copy code block
exports.handler = (context, event, callback) => {


 // Given an existing Sync Map with the uniqueName of spaceShips, you can use


 // syncMapItems.create to add a new key:data pair which will be accessible


 // to any other Function or product with access to the Sync Map!


 Runtime.getSync()


   .maps('spaceShips')


   .syncMapItems.create({


     key: 'fastestShip',


     data: {


       name: 'Millenium Falcon',


     },


   })


   .then((response) => {


     console.log(response);


     return callback(null, response);


   })


   .catch((error) => {


     console.log('Sync Error: ', error);


     return callback(error);


   });


};
Create a Sync List with Runtime Client
Example of how to create Sync List with Runtime Client
Copy code block
exports.handler = (context, event, callback) => {


 // If your use case warrants a list data structure instead of a map, you


 // can instantiate a Sync List. As with Maps, be sure to provide a uniqueName!


 Runtime.getSync()


   .lists.create({


     uniqueName: 'spaceShips',


   })


   .then((newList) => {


     console.log(newList);


     return callback(null, newList);


   })


   .catch((error) => {


     console.log('Sync Error: ', error);


     return callback(error);


   });


};
Append to Sync List with Runtime Client
Example of how to append to a Sync List using the Runtime Client
Copy code block
exports.handler = (context, event, callback) => {


 // Given an existing Sync List with the uniqueName of spaceShips, you can use


 // syncListItems.create to append a new data entry which will be accessible


 // to any other Function or product with access to the Sync List!


 Runtime.getSync()


   .lists('spaceShips')


   .syncListItems.create({


     data: {


       text: 'Millennium Falcon',


     },


   })


   .then((response) => {


     console.log(response);


     return callback(null, response);


   })


   .catch((error) => {


     console.log('Sync Error: ', error);


     return callback(error);


   });


};
Create a Sync Document with Runtime Client
Example of how to create a Sync Document using the Runtime Client
Copy code block
exports.handler = (context, event, callback) => {


 // Last but not least, it's also possible to create Sync Documents.


 // As always, remember to provide a uniqueName to identify your Document.


 Runtime.getSync()


   .documents.create({


     uniqueName: 'userPreferences',


     data: {


       greeting: 'Ahoyhoy!',


     },


   })


   .then((newDoc) => {


     console.log(newDoc);


     return callback(null, newDoc);


   })


   .catch((error) => {


     console.log('Sync Error: ', error);


     return callback(error);


   });


};
Perform multiple Sync actions in a Function
Example of creating a Sync Map and adding data to it in the same Function execution
Copy code block
exports.handler = async (context, event, callback) => {


 // Grab a reference to the Sync object since we'll be using it a few times


 const sync = Runtime.getSync();





 try {


   // First, lets create a brand new Sync Map


   const newMap = await sync.maps.create({ uniqueName: 'quicklyUpdatedMap' });


   console.log('newMap: ', newMap);





   // Now, let's access that map and add a new item to it.


   // Be sure to specify a unique key and data for the item!


   // Creation is an async operation, so we need to await it.


   const newMapItem = await sync.maps(newMap.sid).syncMapItems.create({


     key: 'fastestShip',


     data: {


       name: 'Millenium Falcon',


     },


   });





   // Now that we have a new item, let's log and return it.


   console.log('newMapItem: ', newMapItem);


   return callback(null, newMapItem);


 } catch (error) {


   // Be sure to log and return any errors that occur!


   console.error('Sync Error: ', error);


   return callback(error);


 }


};

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Runtime Client | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Runtime Client
Runtime Handler
Environment variables
Regional support
Dependencies
Headers and cookies
Debugging
Frequently asked questions
Examples
Migration guides
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
Versions
Preview Versions
Default Runtime Handler Version
Managing Versions
Runtime Handler

The Runtime Handler is a necessary dependency for any Twilio Function to be able to execute. It bootstraps the environment for your Function, manages the initialization of the Twilio client, injects the Runtime Client into scope for your convenience, and other critical functions.
(information)
Info
This is different from https://www.npmjs.com/package/@twilio/runtime-handler
 which is used for local development, but we will do our best to keep the version numbers up to date and in sync. This allows for a better local development experience, like using npm install.

Versions
(information)
Info
We follow the principle of Semantic Versioning
 to the best of our ability. We will only introduce breaking changes in major releases, new functionality in minor releases, and backwards compatible bug fixes in patch releases.
Release Version
Description
2.0.1
No changes for the end user. This is the new default version
2.0.0
Node.js 18 is the new default
1.3.1
Minor bump. No changes for the end user
1.3.0
Local development changes for Node.js 16 support
1.2.5
Updated local development dependencies
1.2.4
Local development downstream dependencies update to remove vulnerable dependencies
1.2.3
Local development changes for Node.js 14 support
1.2.2
Bug fixes for local development. Same functionality as 1.2.1
1.2.1
Adds better auto complete in local development when using TypeScript. Currently being rolled out as new default.
1.2.0
Adds support for accessing and modifying incoming headers and cookies from the new event.request object
1.1.3
Bug fixes and minor improvements
1.1.2
Accessing SERVICE_SID or ENVIRONMENT_SID environment variables in local development will now cause a warning to be displayed
1.1.1
Bug fixes and minor improvements
1.1.0
The Twilio library is now lazy-loaded to improve the cold start time of Functions
1.0.2
Provides fixes for bugs in the local development environment
1.0.1
The previous default version, initial release of the Runtime Handler

Preview Versions
(warning)
Warning
The following versions are available as a preview of upcoming versions. They are not meant for production and might contain breaking changes between releases.
Previews are not covered by Twilio support agreements, and will not be supported via chat or paid phone support until after production launch. Twilio's engineers may handle customer help requests for some previews to improve those products for general availability release. Because our engineering team handles these help requests, responses may take longer.
There are currently no preview versions available.
Default Runtime Handler Version
For projects where you don't have a specific Runtime Handler version specified, for example, new projects that you created through the Console, you might receive new Runtime Handler versions as we roll them out gradually to the customer base.
Follow the instructions below to pin the relevant version that you want to use. For new projects created through the Twilio Console, you'll see the default version of the Runtime Handler appear in the Dependencies section after you have deployed to your project for the first time.

Managing Versions
It is important to set the correct version of the Runtime Handler, especially if you want to take advantage of the latest features. The process of setting the version varies depending on whether you're developing using the Console
 or programmatically, such as with the Serverless Toolkit or via the Serverless API. All methods are described below.
(warning)
Warning
The version of Runtime Handler must be exact, such as 1.2.1. Version ranges are not supported.
For example, attempting to use latest or ^1.0.1 will fail when attempting to deploy
Twilio ConsoleServerless ToolkitServerless API
If you created your Function using the Console
, you can set the version of @twilio/runtime-handler via the Console UI. To begin, navigate to the Function Editor for the Service that you want to update. Then complete the following steps:
Under Settings, click on Dependencies. This will open a new tab in the editor, which contains a list of your Node version and all npm modules and their versions
Click the Edit button for @twilio/runtime-handler, enter your desired version, and click Update
When ready, click the Deploy All button to deploy your Service with the updated Runtime Handler in place

Expand image

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Runtime Handler | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Runtime Client
Runtime Handler
Environment variables
Regional support
Dependencies
Headers and cookies
Debugging
Frequently asked questions
Examples
Migration guides
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
Setting Environment Variables
Editing Environment Variables across Environments
Consuming Environment Variables
Default Environment Variables
Limitations
Storing large credentials
Environment Variables

Environment Variables are key/value pairs that you can add to a specific Environment. Use these for storing configuration like API keys rather than hardcoding them into your Functions. Environment Variables are encrypted, so they are the preferred way to store API keys, passwords, and any other secrets that your Function needs to use.
They also prove useful because when an Environment Variable is updated, the new value will instantly reflect in subsequent Function executions without the need for deploying new code. This allows you to adjust configurations on the fly without potentially interrupting your service due to deployments.

Setting Environment Variables
To view and modify the Environment Variables for a given Service, open the Service using the Twilio Console. Once the Functions Editor is open for your Service, in the Settings menu, click on Environment Variables.

Expand image
The resulting UI allows you to add, remove, and update Environment Variables.
Additionally, the Add my Twilio Credentials (ACCOUNT_SID) and (AUTH_TOKEN) to ENV checkbox allows you to choose if you would like for your ACCOUNT SID and AUTH TOKEN to be automatically added to your Function's context. This means both of these values will be accessible as Environment Variables from context, and also that calling context.getTwilioClient() will return an initialized Twilio REST client for making calls to Twilio's API.
(information)
Info
If you're using the Serverless Toolkit, you will instead set your Environment Variables using .env files.
Editing Environment Variables across Environments
If you're using multiple Environments in your application, such as dev, stage, and production, it's common to have the same Environment Variables present in each Environment, but with different values so that each version of your application is connecting to the appropriate resources. These could be various API keys with different levels of access or rate limits for the same service, credentials for different versions of your database, and more.
Using the Console UI, you can switch between which Environment Variables you are adjusting by clicking on your application URL, directly above the Deploy All button. This will render a menu showing your various Environments, and selecting one will put you in the context of that Environment.

Expand image
Any modifications to Environment Variables that follow will only apply to the selected Environment and not affect any others.
(information)
Info
If you're developing using the Serverless Toolkit, check out the specific documentation on how to scope environment variables.

Consuming Environment Variables
Any Environment Variables that have been set will be accessible in your Function as properties of the context object by name. For example, if you set an Environment Variable named API_KEY, it can be retrieved as context.API_KEY in your Function's code.
Suppose an IVR tree you're designing requires some logic to determine if a branch of your business is open that day based on local temperatures. Using the OpenWeather Weather API and an API Key that you've set to an Environment Variable, you could securely retrieve that key from context.API_KEY and make validated requests for weather data to complete your business logic. You can also store a common support phone number as an Environment Variable to share between your Functions.
Copy code block
const axios = require("axios");


const querystring = require("querystring");





exports.handler = async (context, event, callback) => {


 // Environment Variables can be accessed from the context object


 const apiKey = context.API_KEY;


 const supportNumber = context.SUPPORT_PHONE_NUMBER;





 // Query parameters and the request body can be accessed


 // from the event object


 const city = event.city || "Seattle";





 // The Weather API accepts the city and apiKey as query parameters


 const query = querystring.stringify({ q: city, appid: apiKey });


 // Make our OpenWeather API request, and be sure to await it!


 const { data } = await axios.get(


   `https://api.openweathermap.org/data/2.5/weather?${query}`


 );


 // Do some math to convert the returned temperature from Kelvin to F


 const tempInFahrenheit = (data.main.temp - 273.15) * 1.8 + 32;


 // If its too hot, relay this information and the support number


 if (tempInFahrenheit >= 100) {


   return callback(null, {


     isOpen: false,


     message:


       "Due to extreme temperatures and to protect the health " +


       "of our employees, we're closed today. If you'd like to " +


       `speak to our support team, please call ${supportNumber}`,


   });


 }


 // Otherwise, business as usual


 return callback(null, { isOpen: true, message: "We're open!" });


};

Default Environment Variables
The context object provides you with several Environment Variables by default:
Property
Type
Description
ACCOUNT_SID
string|null
If you have chosen to include your account credentials in your Function, this will return the SID identifying the Account that owns this Function. If you have not chosen to include account credentials in your Function, this value will be null.
AUTH_TOKEN
string|null
If you have chosen to include your account credentials in your Function, this will return the Auth Token associated with the owning Account. If you have not chosen to include account credentials in your Function, this value will be null.
DOMAIN_NAME
string
The Domain that is currently serving your Twilio Function.
PATH
string
The path of Twilio Function that is currently being executed.
SERVICE_SID
string
The SID of the Service which the current Function is contained in.
ENVIRONMENT_SID
string
The SID of the Environment which the current Function is hosted in.

(warning)
Warning
For a small number of customers, SERVICE_SID and ENVIRONMENT_SID are not enabled due to the combined size of environment variables in use being too high and approaching the allowed limit of 3kb. In this case, these variables will return undefined.
If you believe you are affected by this issue and wish to enable these variables, please reach out to our support team for assistance.

Limitations
There are limitations on the size of individual Environment Variables depending on your method of deployment. A variable can be no longer than:
255 characters if set using the current V2 Console
150 characters if set using the legacy, Functions(Classic) Console
450 bytes if set using the Serverless Toolkit or the Serverless API
Additionally, there is a maximum limit of approximately 3kb on the combined size of your Environment Variables after they have been JSON encoded.
(error)
Danger
If any Environment Variable exceeds the individual limit or all Variables combined exceed the maximum limit, then your deployments will fail until your Variables have been resized.
Storing large credentials
If you must store an extremely long API key or other credential, such as an RSA key, which will cause you to exceed these limits, we suggest that you instead store the value in a private Asset and ingest it in your code using the Runtime.getAssets helper.
Given these constraints and a large RSA key that you need to store securely, you could store the text of the key in an Asset named credentials.json, and set the Asset's Privacy to private.
Copy code block
{


 "myRsaKey": "xxxxxx..."


}
You could then access the RSA key (or any other stored credentials) in your Function using this code pattern.
Copy code block
exports.handler = (context, event, callback) => {


 // The open method returns the file's contents assuming utf8 encoding.


 // Use JSON.parse to parse the file back into a JavaScript object


 const credentials = JSON.parse(


   Runtime.getAssets()["/credentials.json"].open()


 );





 // Reference the key from the credentials object


 const { myRsaKey } = credentials;





 // Perform any API calls that require this key!...


};

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Environment Variables | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Global Infrastructure
Getting Started
Building with Twilio Regions
Twilio Voice Examples
Other Examples
Functions and Assets
Regional support for Functions and Assets
Conversations
Reference
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
What are Functions and Assets?
Which Regions are Functions and Assets available in?
What are the benefits of regional support?
What should I consider when developing Functions and Assets regionally?
Domains
Deployments
Credentials and Twilio REST APIs
Signature validation
How do I use Functions and Assets in different regions from the Console?
How do I use Functions and Assets in different regions with the CLI?
How do I use the Serverless API in different Regions?
How do I tell which Region my Functions are running in?
Can I use Functions and Assets with different Edges?
How can I use non-regionalized Twilio products from regionalized Functions?
Regional support for Functions and Assets

(information)
Info
This Twilio product is currently available as a Public Beta release. Some features are not yet implemented and others may be changed before the product is declared as Generally Available. Beta products are not covered by a Twilio SLA . Learn more about beta product support
.

What are Functions and Assets?
Functions is a service that lets you run Node.js code without provisioning or managing your own servers, while also providing convenient integrations with the Twilio SDK. Just as Functions lets you host code, Assets allows you to host your static files without needing to think about the underlying infrastructure. With these services, you're free to focus on writing your application, and Twilio will handle the details such as scaling, hosting, and maintenance.

Which Regions are Functions and Assets available in?
Functions and Assets now support the following Regions:
US: US1 (GA)
Ireland: IE1 (Beta)
Australia: AU1 (Upcoming)

What are the benefits of regional support?
Regional isolation : All processing and data storage is specific to your selected Region and cannot be accessed from another Region. This is particularly important if your application data needs to remain within a specific country or region to adhere to data and privacy regulations.
Minimal latency : If your application is used outside the US, but hosted on the default US Region, requests could take an excessive amount of time as your data travels to the US and back. Selecting a geographically closer Region will give you shorter round-trip latency, and a better experience for customers.
(warning)
Warning
Note that during this initial phase of the rollout of Twilio Regions, Twilio does not guarantee that all data will remain within your selected Region.

What should I consider when developing Functions and Assets regionally?
Domains
A Service's domain includes its respective Edge and Region. Existing domains that don't include Region and Edge are implicitly set to the US1 Region and Ashburn Edge.
With that in mind, the pattern for Functions URLs with regional support is:
Copy code block
<unique-name>-<random-four-digits>[-<optional-environment-suffix>].<edge>.<region>.twil.io
Examples:
ahoy-1234.dublin.ie1.twil.io
Deployments
If you want to host a Service in multiple Regions, you must deploy individually to each desired Region. There is currently no Console support for deploying a Service to every desired Region. You could, however, write a script that calls the Serverless Toolkit deploy command for each desired Region, or do so with the Serverless API directly depending on the specifics of your use case.
(warning)
Warning
Deployments that use dependencies will still contact the npm registry for dependencies. We do not have control over whether npm will fetch those dependencies from the US or not.
(warning)
Warning
Because of regional isolation, failures in one Region will not result in traffic being redirected to another Region that is still available (automatic failover
). This might result in lower availability that is outside our control in some cases.
For example, if your application is deployed to both US1 and IE1, and there is an infrastructure outage in IE1, traffic intended for IE1 will not reroute to US1 instances.
Credentials and Twilio REST APIs
Serverless Functions by default provide your Auth Token as an Environment Variable, accessible via context.AUTH_TOKEN, and use it to initialize the built-in Twilio REST Client which is accessible via context.getTwilioClient(). This Auth Token is specific to the region in which the Function is deployed.
This means that your default Twilio client will only be capable of making requests to Twilio products and services in the same Region. Likewise, your Auth Token will only be valid for interacting with regionalized APIs in the same Region.
In order for your Function to use products that are not available in the same Region, you'll have to break out of regional isolation (which is not recommended unless absolutely necessary). You can do so by manually providing credentials for the alternative Region with support for the service that you wish to interact with.
Signature validation
Protected Functions and Assets use signature validation to protect them from requests that don't originate from Twilio products and services (or your own code that generates secure signatures).
Your application auth token, which is used to generate these signatures, is different from Region to Region. This means that Functions and Assets in one Region may only be triggered by Twilio products in that same Region.
You may also send requests to a Protected Function or Asset in a different Region, but you will need to generate a valid X-Twilio-Signature header based on credentials from that same Region.

How do I use Functions and Assets in different regions from the Console?
Go to the Explore page
, click the caret on the Functions and Assets card, and select your Region of choice
The Console navigation bar will update and show a new section dedicated to the Region that you selected.

Expand image
If you expand the newly added Region sub-nav, you will see a new entry for Functions and Assets. When viewing any portion of the Functions and Assets UI for this Region, you'll see a Region indicator along the top of the Console to help you identify which Region you are editing.

Expand image
Create a new Service the same way you would normally with Functions and Assets
You'll see that your URL now includes the region you chose

How do I use Functions and Assets in different regions with the CLI?
Make sure that you have the Twilio CLI and version 3.1.2 or newer of the Serverless Toolkit plugin installed
Create a new regional profile:
Copy code block
# For example, if you are in the ie1 region


TWILIO_EDGE=dublin twilio login --region=ie1
Create and develop a new Service if you don't already have one. (If you do, skip to the next step)
When deploying your Service with the Serverless Toolkit, specify the profile associated with your intended Region: twilio serverless:deploy -p <YOUR_REGIONAL_PROFILE_NAME>
(information)
Info
If you use twilio-run, or if you want to pass the intended credentials directly into your deployment command, you can use the --region flag.
Example 1:
Copy code block
twilio serverless:deploy \


 --region=ie1 \


 --username=<YOUR_TWILIO_REGIONAL_API_KEY> \


 --password=<YOUR_TWILIO_REGIONAL_API_SECRET>
To use different environment variables per Region, you can modify your .twilioserverlessrc configuration file by adding your Account SID and respective Region to the projects section that the settings should be applied to. This works with any configurable setting available in .twilioserverlessrc.
For example:
Copy code block
{


"projects": {


  "AC11111111111111111111111111111111:us1": {


    "env": ".env"


  },


  "AC11111111111111111111111111111111:ie1": {


    "env": ".env.ie1"


  }


}


}

How do I use the Serverless API in different Regions?
The Serverless API works the same way as other Twilio APIs do across Regions, for example, serverless.twilio.com automatically maps to the US Region and Ashland Edge.
If interacting with the Serverless API in a non-US region, be sure to use the appropriate base URL in your HTTP requests:
Ireland: serverless.dublin.ie1.twilio.com
If you're making requests to Twilio in a non-US region with a Twilio Helper Library, you must initialize that SDK's Twilio client with the appropriate values for Region and Edge. This guide goes into detail about how to do so.
(information)
Info
For the @twilio-labs/serverless-api
 library, you can pass region and edge when initializing the client.

How do I tell which Region my Functions are running in?
The Runtime Handler provides Environment Variables to help determine where a given Function is being executed. You may use these in logs or any other logic:
context.TWILIO_REGION
context.TWILIO_EDGE
(information)
Info
If context.TWILIO_REGION is undefined in a deployed Function, you can assume that it is running in the US Region.

Can I use Functions and Assets with different Edges?
There are currently no other Edges available other than the default ones for each region. The default Edges for each Region are:
us1 → ashburn
ie1 → dublin

How can I use non-regionalized Twilio products from regionalized Functions?
(error)
Danger
If your Function interacts with Twilio services in a Region other than where your Function is deployed, the data for those requests will be transmitted to and processed/stored in that Region.
As mentioned earlier, Functions by default are only provided with credentials for and access to Twilio APIs in the same Region. This means that if you deploy to IE1, your Twilio client can only communicate with APIs that are also in IE1.
To create a Twilio client that is capable of communicating with Twilio products in a separate Region:
Create a new API Key SID/Secret pair
 in the Console
Add the API Key SID and Secret as environment variables to your Service, for example: TWILIO_US1_API_KEY_SID and TWILIO_US1_API_KEY_SECRET
In your Function, create a new Twilio client like so:
Copy code block
const clientUs1 = new Twilio(


context.TWILIO_US1_API_KEY_SID,


context.TWILIO_US1_API_KEY_SECRET,


{


  region: 'us1',


  edge: 'ashburn',


  accountSid: context.TWILIO_ACCOUNT_SID


});
Use this US-specific client to make calls to Twilio services in the US, despite your Function operating in another Region (such as Ireland):
Copy code block
clientUs1.messages.create({


 from: context.US_PHONE_NUMBER,


 to: 'some other US number',


 body: 'Ahoy from another region!',


})


.then((message) => {


 console.log({ callSid: message.sid });


 return callback();


})


.catch((error) => {


 console.error(error);


 return callback(error);


});

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Regional support for Functions and Assets | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Runtime Client
Runtime Handler
Environment variables
Regional support
Dependencies
Headers and cookies
Debugging
Frequently asked questions
Examples
Migration guides
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
Default Dependencies
Managing Dependencies
Staying up to date
Limitations
Dependencies

Runtime features an integrated package manager that handles the retrieval, installation, and deployment of third-party packages to support your Functions. This enables developers to access an incredible collection of packages provided by the Node.js community via npm
.

Default Dependencies
The default version of the Twilio SDK and Runtime handler are a part of all Builds.
You will always see twilio and @twilio/runtime-handler in the Dependencies pane of the Twilio Console UI, package.json if using the Serverless Toolkit, and in the Build response returned by the Serverless API.
(information)
Info
@twilio/runtime-handler is not utilized by Functions (Classic), and is not a default dependency in that context.

Managing Dependencies
(warning)
Warning
Only public packages, like those hosted by npm, can be managed by the methods below. If you require a private package, you should add it as a private Asset and access it from your Function's code instead.
Twilio ConsoleServerless ToolkitFunctions (Classic)
Developers can add, remove and update Dependencies through the Console
.
Click the Dependencies option under Settings to see your Dependencies in the Functions Editor.

Expand image
This list includes all the npm modules currently installed for the deployed Function.

Adding a new Dependency
Enter the name and version of the npm module you want to include in the first row of empty fields.
Click Add. This will prepare your next Deployment to install and bundle the npm module with your Functions.

Changing the version of a Dependency
Find the npm module you want to update in the Dependencies list and click Edit. Then, enter the new version you want to use in the Version field.
Click Update. This will update the version of the npm module to the specified version on the next Deployment of your Functions.

Removing a Dependency
Click Delete to remove any package you want to remove from Dependencies. On the next Deployment of your Functions, the package will no longer be included.

Staying up to date
Keeping Twilio helper libraries up to date enables you to take advantage of the latest Twilio product functionality.
You can determine the latest
 version of the Twilio Node helper library, or set the latest Dependencies
 for your Twilio functions by setting them to * or latest in the Twilio Console UI.
If using the Serverless Toolkit and package.json, you could alternatively use a dependency version range
 such as "latest".
(warning)
Warning
The version of @twilio/runtime-handler must be defined as an explicit value, such as 1.2.1. Using version ranges, such as * and latest, will result in a Build failure.

Limitations
Native packages are not supported — Runtime does not provide a C/C++ compiler, which is required to compile native add-on modules. This means modules that depend on node-gyp
 can not be used in your Functions.
npm modules limit — Services are limited in the number of npm modules that may be installed. This is dependent on which version of Runtime you are using:
Current version: 100 modules.
Functions (Classic): 20 modules.
To raise these limits for one of your Services, please contact Twilio Support.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Dependencies | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Runtime Client
Runtime Handler
Environment variables
Regional support
Dependencies
Headers and cookies
Overview
Access values
Set and modify values
Limitations
Examples
Debugging
Frequently asked questions
Examples
Migration guides
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
What are headers?
What are cookies?
Getting started
What's next?
Headers and cookies

(warning)
Warning
Functions allow you to access and set headers and cookies on incoming requests as well as your responses, as set forth in this documentation. Any controls, management, and configuration related to your use of headers and cookies, including compliance with applicable laws, is your responsibility and outside of Twilio's control. If you have questions about your legal obligations with respect to headers and cookies, please consult with your legal counsel.
For users of Runtime Handler 1.2.0 or later, Functions allow developers to access the HTTP Headers passed along with incoming requests. This will enable developers to take advantage of Cookies, CORS, and other features that headers enable.

What are headers?
HTTP headers
 are small pieces of metadata that can be passed between clients and servers as part of the request/response life-cycle. For example, a request might include headers that contain more information about the resource being fetched or the client making the request.
It is also common to pass authentication values and API Keys as headers. For example, Twilio validates its webhook requests by including the X-Twilio-Signature HTTP header in requests.
Using the following request as an example, we can see that it includes headers describing the request's metadata such as Host, Content-Type, and Content-Length. In addition, there is an Authorization header that contains an auth token for identifying the request's user.
Copy code block
GET /example HTTP/1.1


Host: test-4321.twil.io 


Authorization: 123abc


Content-Type: application/json


Content-Length: 23





{


 "body": "Ahoy!"


}
What are cookies?
Cookies
 are a special kind of header which are typically used to tell if requests are coming from the same client or browser. On the web, they are commonly used for tracking session management (your authentication token and/or shopping cart), enabling personalization (site theme and/or preferences), and tracking of your behavior when browsing a site.

Getting started
(warning)
Warning
Header support is not available for Functions Classic. Please consider migrating to the current version of Functions if you are still using Classic.
To enable headers, you must set the @twilio/runtime-handler Dependency version to 1.2.0 or later in the Functions Editor or your project's package.json if using the Serverless Toolkit. Once you redeploy your Function, headers will be accessible in your Function code.

Expand image

What's next?
Now that you have your Runtime Handler updated, you are ready to work with headers and cookies in your Functions! Explore these resources to learn more about how to work with them and what you can build.
Learn how to access headers and cookies that are sent to your Functions
Check out this guide on how to set and modify headers and cookies that your Functions respond with
Make sure you understand the limitations on headers
Learn how to protect access to your Function using Basic Authentication
Validate the identity of users by leveraging JSON Web Token (JWT)
Update your Function to enable CORS between it and a Flex Plugin
Create a Function that integrates with SendGrid and validates incoming events

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Headers and cookies | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Runtime Client
Runtime Handler
Environment variables
Regional support
Dependencies
Headers and cookies
Overview
Access values
Set and modify values
Limitations
Examples
Debugging
Frequently asked questions
Examples
Migration guides
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
Accessing headers
Accessing headers with multiple values
Accessing cookies
Accessing cookies with multiple values
What's next?
Accessing headers and cookies

(information)
Info
Access to incoming headers and cookies is only available when your Function is running @twilio/runtime-handler version 1.2.0 or later. Consult the Runtime Handler guide to learn more about the latest version and how to update.

Accessing headers
Within a Function, headers are stored on the event.request.headers object and can be accessed by name in lowercase.
(warning)
Warning
The names of all headers are lowercased before being passed into your Function. Please reference headers with the correct casing to avoid errors.
For example, the key of the Content-Type header will be content-type.
For example, if the following request is received by your Function:
Copy code block
GET /example HTTP/1.1


Host: test-4321.twil.io


Authorization: 123abc


Content-Type: application/json


Content-Length: 23





{


 "body": "Ahoy!"


}
You can access various headers in the following ways:
Copy code block
exports.handler = (context, event, callback) => {


 // Access the `Authorization` header via dot notation


 const authHeader = event.request.headers.authorization; 


 console.log(authHeader); // '123abc'





 // Access the `Authorization` header via bracket notation


 const alsoTheAuthHeader = event.request.headers['authorization']; 


 console.log(alsoTheAuthHeader); // '123abc'





 // Access headers that include hyphens and other non-alphanumeric


 // characters with bracket notation


 const contentType = event.request.headers['content-type']; 


 console.log(contentType); // 'application/json'





 return callback();


}
Accessing headers with multiple values
It is possible for a request to contain multiple values for a single header.
For example, consider the following incoming request:
Copy code block
GET /example HTTP/1.1


Host: test-4321.twil.io


Content-Type: application/json


Cache-Control: no-cache


Cache-Control: private


Content-Length: 23





{


 "body": "Ahoy!"


}
Here, both no-cache and private have been assigned to the cache-control header. Since cache-control now has multiple values instead of a single value, it will return an array of strings when accessed:
Copy code block
exports.handler = (context, event, callback) => {


 // Access a multivalued header. In this case, `Cache-Control`


 const cacheControl = event.request.headers['cache-control'];


 console.log(cacheControl); // ['no-cache', 'private'];





 return callback();


}
(information)
Info
The order of multivalued headers in a request is preserved.
If you know for certain that the value of interest lies at a particular index of a header, you may access it directly. e.g. event.request.headers['cache-control'][1]

Accessing cookies
Cookies are stored on a separate event.request.cookies object, and can be accessed similarly.
(warning)
Warning
Cookie names are not forced to be lowercase like other headers and should be accessed using the casing in the request.
Given an incoming request like this to your Function:
Copy code block
GET /example HTTP/1.1


Host: test-4321.twil.io


Content-Type: application/json


Cookie: Cookie_1=yummy; sessionToken=abc123


Content-Length: 23





{


 "body": "Ahoy!"


}
The following code provides examples of how to access the provided cookie values:
Copy code block
exports.handler = (context, event, callback) => {


 // Access the `sessionToken` cookie via dot notation


 const sessionToken = event.request.cookies.sessionToken


 console.log(sessionToken); // 'abc123'





 // Access the `sessionToken` cookie via bracket notation


 const alsoTheSessionToken = event.request.cookies['sessionToken'];


 console.log(alsoTheSessionToken); // 'abc123' 





 // The cookie header can contain multiple cookies


 const { cookies } = event.request;


 console.log(cookies); // { Cookie_1: 'yummy', sessionToken: 'abc123' }





 return callback();


}
Accessing cookies with multiple values
Just like headers, is possible for a request to contain multiple cookies with the same name.
(warning)
Warning
In the case of multiple cookies with the same name, the Runtime Handler will only make the first value accessible. It will not convert that cookie into an array that contains all values.
For example, consider the following incoming request:
Copy code block
GET /example HTTP/1.1


Host: test-4321.twil.io


Content-Type: application/json


Cookie: foo=bar; foo=baz


Content-Length: 23





{


 "body": "Ahoy!"


}
If you were to access the cookie foo, you will notice that only the first value of 'bar' is returned instead of both:
Copy code block
exports.handler = (context, event, callback) => {


 // Access the cookie `foo`


 const foo = event.request.cookies.foo


 console.log(foo); // 'bar'





 return callback();


}
What determines the order of cookies when they share the same name? According to RFC-6265
:
Cookies with longer paths are listed before cookies with shorter paths.
Among cookies that have equal-length path fields, cookies with earlier creation times are listed before cookies with later creation times.

What's next?
Now that you know how to access incoming headers and cookies, let's take a look at how you can set and modify headers on your Function responses.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Accessing headers and cookies | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Runtime Client
Runtime Handler
Environment variables
Regional support
Dependencies
Headers and cookies
Overview
Access values
Set and modify values
Limitations
Examples
Debugging
Frequently asked questions
Examples
Migration guides
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
Headers
setHeaders(headers)
appendHeader(key, value)
Cookies
setCookie(key, value, attributes?)
removeCookie(key)
What's next?
Setting and modifying Headers and Cookies

It is also possible to set headers and cookies on the response that your Twilio Function returns. The Response object exposes the following methods to allow you to customize what headers are sent in response to incoming requests.
Headers
setHeaders()
appendHeader()
Cookies
setCookie()
removeCookie()

Headers
setHeaders(headers)
This method allows you to set multiple headers in a single command. It accepts an object of key-value pairs of headers and their corresponding values. You may also set multi-value headers by making the intended header an array.
If you include the Set-Cookie header in this object, cookies will also be set to that value in addition to any other changes. Cookies must be strings with the key and value delimited by an = sign, such as 'Key=Value' or as a list of values such as [‘Key=Value', ‘Agent=Smith'].
Method Parameters
Name
Type
headers
Object<string, string | string[]>

Examples
Copy code block
exports.handler = (context, event, callback) => {


 const response = new Twilio.Response();


 response.setHeaders({


   // Set a single header


   'content-type': 'application/json',


   // You can set a header with multiple values by providing an array


   'cache-control': ['no-cache', 'private'],


   // You may also optionally set cookies via the "Set-Cookie" key


   'set-cookie': 'Foo=Bar',


 });





 return callback(null, response);


};
Copy code block
exports.handler = (context, event, callback) => {


 const response = new Twilio.Response();


 response.setHeaders({


   // You may also set cookie attributes by including a semicolon


   // (`;`) delimited list of attributes


   'set-cookie': ['Foo=Bar;Max-Age=86400', 'Agent=Smith;HttpOnly;Secure'],


 });





 return callback(null, response);


};
appendHeader(key, value)
This method allows you to add a single header to the response. It accepts the name of the header and its intended value.
(information)
Info
If Response.appendHeader is called with the name of a header that already exists, that header will be converted from a string to an array, and the provided value will be concatenated to that array of values.
Method Parameters
Name
Type
Example
key
string
'content-type'
value
string | string[]
'application/json'

Examples
Copy code block
exports.handler = (context, event, callback) => {


 const response = new Twilio.Response();


 response


   .appendHeader('content-type', 'application/json')


   // You can append a multi-value header by passing a list of strings


   .appendHeader('yes', ['no', 'maybe', 'so'])


   // Instead of setting the header to an array, it's also valid to


   // pass a comma-separated string of values


   .appendHeader('cache-control', 'no-store, max-age=0');





 return callback(null, response);


};
Copy code block
exports.handler = (context, event, callback) => {


 const response = new Twilio.Response();


 response


   .appendHeader('never', 'gonna')


   // Appending a header that already exists will convert that header to


   // a multi-value header and concatenate the new value


   .appendHeader('never', 'give')


   .appendHeader('never', 'you')


   .appendHeader('never', 'up');


   // The header is now `'never': ['gonna', 'give', 'you', 'up']`





 return callback(null, response);


};

Cookies
(information)
Info
Commands to set, modify, and delete cookies are only available when your Function is running @twilio/runtime-handler version 1.2.0 or later. Consult the Runtime Handler guide to learn more about the latest version and how to update.
setCookie(key, value, attributes?)
This method allows you to add a cookie to your Function's response. It accepts the name of the cookie, its value, and any optional attributes to be assigned to the cookie.
Method Parameters
Name
Type
Example
key
string
'tz'
value
string | string[]
'America/Los_Angeles'
attributes (optional)
string[]?
['HttpOnly', 'Secure', 'SameSite=Strict', 'Max-Age=86400']

Examples
Copy code block
exports.handler = (context, event, callback) => {


 const response = new Twilio.Response();


 response


   .setCookie('has_recent_activity', 'true')


   .setCookie('tz', 'America/Los_Angeles', [


     'HttpOnly',


     'Secure',


     'SameSite=Strict',


     'Max-Age=86400',


   ]);





 return callback(null, response);


};
(information)
Info
Cookie attributes such as HttpOnly and Secure are shown in these examples, however, you don't need to add them yourself. Runtime automatically adds the HttpOnly and Secure attributes to your cookies by default unless you have already manually set those values.
If you do not set a Max-Age or Expires on a cookie, it will be considered a Session cookie
. If you set both Max-Age and Expires on a cookie, Max-Age takes precedence.
(error)
Danger
If you set the Max-Age or Expires of a cookie to greater than 24 hours, your Function will return a 400 error: Cookies max-age cannot be greater than a day.
removeCookie(key)
This method allows you to effectively remove a specific cookie from the response of your Twilio Function. It accepts the name of the cookie to be removed, and sets the Max-Age attribute of the cookie equal to 0 so that clients and browsers will remove the cookie upon receiving the response.
Method Parameters
Name
Type
Example
key
string
'tz'

Examples
In the following example, the client may contain a cookie tz and send it along with the request. Upon receiving this response from your Function, tz will be removed from the client's cookie store and not sent with subsequent requests to your Function's domain.
Copy code block
exports.handler = (context, event, callback) => {


 const response = new Twilio.Response();


 response.removeCookie('tz');





 return callback(null, response);


};

What's next?
Now that you more about how to set and modify the headers in your Function responses, let's go over some of the limitations on headers and cookies so that you don't encounter as many errors.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Setting and modifying Headers and Cookies | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Runtime Client
Runtime Handler
Environment variables
Regional support
Dependencies
Headers and cookies
Overview
Access values
Set and modify values
Limitations
Examples
Debugging
Frequently asked questions
Examples
Migration guides
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
Headers
Restricted headers
The OPTIONS request
Maximum header size
Cookies
Limitations

Headers
Restricted headers
The following headers are not accessible within a Function. Avoid developing any code that depends on these headers or their variants.
Header Name
Connection Proxy-Connection
Expect
Host
Proxy-Authorization Proxy-Authenticate
Referer
Trailer
Transfer-Encoding
Upgrade
Via
X-Accel-*
X-Forwarded-* X-Real-IP

The OPTIONS request
You cannot interact with the pre-flight OPTIONS request
 that is sent by browsers. The Runtime client will automatically respond to OPTIONS requests with Access-Control-Allow-Headers: *, and pass along all included request headers to the targeted Function (unless they are in the exclusions list above). In addition, the Runtime client allows all origins by returning Access-Control-Allow-Origin: *.
Maximum header size
Headers and cookies in both incoming requests and outgoing responses are subject to these limits:
Max header size: 15kb (including cookies)
Max header count: 90 (including cookies)
If either of these limits is exceeded, your Function will throw a 431 error. The error will include the message Request headers or cookies too long if the limits are exceeded by a request, or Response headers or cookies too long if you've constructed a response that exceeds these limits.
This will also generate a Twilio Error 82008.

Cookies
Runtime automatically adds the HttpOnly and Secure attributes to your cookies by default, unless you manually set those values.
You cannot manually set the value of the Domain attribute on a cookie. The value will be removed and set to the domain of the Function creating the response.
If you do not set a Max-Age or Expires on a cookie, it will be considered a Session cookie
.
If you set both Max-Age and Expires on a cookie, Max-Age takes precedence.
If you set the Max-Age or Expires of a cookie to greater than 24 hours, your Function will return a 400 error with the message Cookies max-age cannot be greater than a day.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Limitations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Migration guides
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
Learn the basics for handling SMS, MMS, and phone calls
Learn how to leverage APIs
Learn how headers and cookies can add extra functionality and security
Learn how to integrate Functions with Twilio Studio
Learn other common use cases
Function Examples

We have put together code examples you can use to get your application development started with Twilio Functions and Assets. These examples illustrate fundamentals and best practices that will help you get the most out of your Functions, and cover some of the most common use cases for Functions.
We hope you can learn from and use these samples as inspiration to support your business use case(s), and to build something incredible.
Learn the basics for handling SMS, MMS, and phone calls
Receive inbound SMS
Send SMS and MMS
Receive incoming phone calls
Make a Call
Learn how to leverage APIs
Make an API request
Learn how headers and cookies can add extra functionality and security
Enable CORS between Flex Plugins and Functions
Validate Webhook requests from SendGrid
Manage application state with cookies
Protect your Function with Basic Auth
Protect your Function with JSON Web Token (JWT)
Learn how to integrate Functions with Twilio Studio
Use the Run Function widget in Studio
Add delay
Normalize telephone numbers
Learn other common use cases
Use Twilio Sync to manage real-time data in your applications
Determine carrier, phone number type, and caller info
Time of day routing
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Function Examples | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Runtime Client
Runtime Handler
Environment variables
Regional support
Dependencies
Headers and cookies
Overview
Access values
Set and modify values
Limitations
Examples
Debugging
Frequently asked questions
Examples
Migration guides
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
Accessing headers
Accessing headers with multiple values
Accessing cookies
Accessing cookies with multiple values
What's next?
Accessing headers and cookies

(information)
Info
Access to incoming headers and cookies is only available when your Function is running @twilio/runtime-handler version 1.2.0 or later. Consult the Runtime Handler guide to learn more about the latest version and how to update.

Accessing headers
Within a Function, headers are stored on the event.request.headers object and can be accessed by name in lowercase.
(warning)
Warning
The names of all headers are lowercased before being passed into your Function. Please reference headers with the correct casing to avoid errors.
For example, the key of the Content-Type header will be content-type.
For example, if the following request is received by your Function:
Copy code block
GET /example HTTP/1.1


Host: test-4321.twil.io


Authorization: 123abc


Content-Type: application/json


Content-Length: 23





{


 "body": "Ahoy!"


}
You can access various headers in the following ways:
Copy code block
exports.handler = (context, event, callback) => {


 // Access the `Authorization` header via dot notation


 const authHeader = event.request.headers.authorization; 


 console.log(authHeader); // '123abc'





 // Access the `Authorization` header via bracket notation


 const alsoTheAuthHeader = event.request.headers['authorization']; 


 console.log(alsoTheAuthHeader); // '123abc'





 // Access headers that include hyphens and other non-alphanumeric


 // characters with bracket notation


 const contentType = event.request.headers['content-type']; 


 console.log(contentType); // 'application/json'





 return callback();


}
Accessing headers with multiple values
It is possible for a request to contain multiple values for a single header.
For example, consider the following incoming request:
Copy code block
GET /example HTTP/1.1


Host: test-4321.twil.io


Content-Type: application/json


Cache-Control: no-cache


Cache-Control: private


Content-Length: 23





{


 "body": "Ahoy!"


}
Here, both no-cache and private have been assigned to the cache-control header. Since cache-control now has multiple values instead of a single value, it will return an array of strings when accessed:
Copy code block
exports.handler = (context, event, callback) => {


 // Access a multivalued header. In this case, `Cache-Control`


 const cacheControl = event.request.headers['cache-control'];


 console.log(cacheControl); // ['no-cache', 'private'];





 return callback();


}
(information)
Info
The order of multivalued headers in a request is preserved.
If you know for certain that the value of interest lies at a particular index of a header, you may access it directly. e.g. event.request.headers['cache-control'][1]

Accessing cookies
Cookies are stored on a separate event.request.cookies object, and can be accessed similarly.
(warning)
Warning
Cookie names are not forced to be lowercase like other headers and should be accessed using the casing in the request.
Given an incoming request like this to your Function:
Copy code block
GET /example HTTP/1.1


Host: test-4321.twil.io


Content-Type: application/json


Cookie: Cookie_1=yummy; sessionToken=abc123


Content-Length: 23





{


 "body": "Ahoy!"


}
The following code provides examples of how to access the provided cookie values:
Copy code block
exports.handler = (context, event, callback) => {


 // Access the `sessionToken` cookie via dot notation


 const sessionToken = event.request.cookies.sessionToken


 console.log(sessionToken); // 'abc123'





 // Access the `sessionToken` cookie via bracket notation


 const alsoTheSessionToken = event.request.cookies['sessionToken'];


 console.log(alsoTheSessionToken); // 'abc123' 





 // The cookie header can contain multiple cookies


 const { cookies } = event.request;


 console.log(cookies); // { Cookie_1: 'yummy', sessionToken: 'abc123' }





 return callback();


}
Accessing cookies with multiple values
Just like headers, is possible for a request to contain multiple cookies with the same name.
(warning)
Warning
In the case of multiple cookies with the same name, the Runtime Handler will only make the first value accessible. It will not convert that cookie into an array that contains all values.
For example, consider the following incoming request:
Copy code block
GET /example HTTP/1.1


Host: test-4321.twil.io


Content-Type: application/json


Cookie: foo=bar; foo=baz


Content-Length: 23





{


 "body": "Ahoy!"


}
If you were to access the cookie foo, you will notice that only the first value of 'bar' is returned instead of both:
Copy code block
exports.handler = (context, event, callback) => {


 // Access the cookie `foo`


 const foo = event.request.cookies.foo


 console.log(foo); // 'bar'





 return callback();


}
What determines the order of cookies when they share the same name? According to RFC-6265
:
Cookies with longer paths are listed before cookies with shorter paths.
Among cookies that have equal-length path fields, cookies with earlier creation times are listed before cookies with later creation times.

What's next?
Now that you know how to access incoming headers and cookies, let's take a look at how you can set and modify headers on your Function responses.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Accessing headers and cookies | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Runtime Client
Runtime Handler
Environment variables
Regional support
Dependencies
Headers and cookies
Overview
Access values
Set and modify values
Limitations
Examples
Debugging
Frequently asked questions
Examples
Migration guides
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
Headers
setHeaders(headers)
appendHeader(key, value)
Cookies
setCookie(key, value, attributes?)
removeCookie(key)
What's next?
Setting and modifying Headers and Cookies

It is also possible to set headers and cookies on the response that your Twilio Function returns. The Response object exposes the following methods to allow you to customize what headers are sent in response to incoming requests.
Headers
setHeaders()
appendHeader()
Cookies
setCookie()
removeCookie()

Headers
setHeaders(headers)
This method allows you to set multiple headers in a single command. It accepts an object of key-value pairs of headers and their corresponding values. You may also set multi-value headers by making the intended header an array.
If you include the Set-Cookie header in this object, cookies will also be set to that value in addition to any other changes. Cookies must be strings with the key and value delimited by an = sign, such as 'Key=Value' or as a list of values such as [‘Key=Value', ‘Agent=Smith'].
Method Parameters
Name
Type
headers
Object<string, string | string[]>

Examples
Copy code block
exports.handler = (context, event, callback) => {


 const response = new Twilio.Response();


 response.setHeaders({


   // Set a single header


   'content-type': 'application/json',


   // You can set a header with multiple values by providing an array


   'cache-control': ['no-cache', 'private'],


   // You may also optionally set cookies via the "Set-Cookie" key


   'set-cookie': 'Foo=Bar',


 });





 return callback(null, response);


};
Copy code block
exports.handler = (context, event, callback) => {


 const response = new Twilio.Response();


 response.setHeaders({


   // You may also set cookie attributes by including a semicolon


   // (`;`) delimited list of attributes


   'set-cookie': ['Foo=Bar;Max-Age=86400', 'Agent=Smith;HttpOnly;Secure'],


 });





 return callback(null, response);


};
appendHeader(key, value)
This method allows you to add a single header to the response. It accepts the name of the header and its intended value.
(information)
Info
If Response.appendHeader is called with the name of a header that already exists, that header will be converted from a string to an array, and the provided value will be concatenated to that array of values.
Method Parameters
Name
Type
Example
key
string
'content-type'
value
string | string[]
'application/json'

Examples
Copy code block
exports.handler = (context, event, callback) => {


 const response = new Twilio.Response();


 response


   .appendHeader('content-type', 'application/json')


   // You can append a multi-value header by passing a list of strings


   .appendHeader('yes', ['no', 'maybe', 'so'])


   // Instead of setting the header to an array, it's also valid to


   // pass a comma-separated string of values


   .appendHeader('cache-control', 'no-store, max-age=0');





 return callback(null, response);


};
Copy code block
exports.handler = (context, event, callback) => {


 const response = new Twilio.Response();


 response


   .appendHeader('never', 'gonna')


   // Appending a header that already exists will convert that header to


   // a multi-value header and concatenate the new value


   .appendHeader('never', 'give')


   .appendHeader('never', 'you')


   .appendHeader('never', 'up');


   // The header is now `'never': ['gonna', 'give', 'you', 'up']`





 return callback(null, response);


};

Cookies
(information)
Info
Commands to set, modify, and delete cookies are only available when your Function is running @twilio/runtime-handler version 1.2.0 or later. Consult the Runtime Handler guide to learn more about the latest version and how to update.
setCookie(key, value, attributes?)
This method allows you to add a cookie to your Function's response. It accepts the name of the cookie, its value, and any optional attributes to be assigned to the cookie.
Method Parameters
Name
Type
Example
key
string
'tz'
value
string | string[]
'America/Los_Angeles'
attributes (optional)
string[]?
['HttpOnly', 'Secure', 'SameSite=Strict', 'Max-Age=86400']

Examples
Copy code block
exports.handler = (context, event, callback) => {


 const response = new Twilio.Response();


 response


   .setCookie('has_recent_activity', 'true')


   .setCookie('tz', 'America/Los_Angeles', [


     'HttpOnly',


     'Secure',


     'SameSite=Strict',


     'Max-Age=86400',


   ]);





 return callback(null, response);


};
(information)
Info
Cookie attributes such as HttpOnly and Secure are shown in these examples, however, you don't need to add them yourself. Runtime automatically adds the HttpOnly and Secure attributes to your cookies by default unless you have already manually set those values.
If you do not set a Max-Age or Expires on a cookie, it will be considered a Session cookie
. If you set both Max-Age and Expires on a cookie, Max-Age takes precedence.
(error)
Danger
If you set the Max-Age or Expires of a cookie to greater than 24 hours, your Function will return a 400 error: Cookies max-age cannot be greater than a day.
removeCookie(key)
This method allows you to effectively remove a specific cookie from the response of your Twilio Function. It accepts the name of the cookie to be removed, and sets the Max-Age attribute of the cookie equal to 0 so that clients and browsers will remove the cookie upon receiving the response.
Method Parameters
Name
Type
Example
key
string
'tz'

Examples
In the following example, the client may contain a cookie tz and send it along with the request. Upon receiving this response from your Function, tz will be removed from the client's cookie store and not sent with subsequent requests to your Function's domain.
Copy code block
exports.handler = (context, event, callback) => {


 const response = new Twilio.Response();


 response.removeCookie('tz');





 return callback(null, response);


};

What's next?
Now that you more about how to set and modify the headers in your Function responses, let's go over some of the limitations on headers and cookies so that you don't encounter as many errors.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Setting and modifying Headers and Cookies | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Runtime Client
Runtime Handler
Environment variables
Regional support
Dependencies
Headers and cookies
Debugging
Frequently asked questions
Examples
Migration guides
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
Debug from the Console
Retrieve logs
Debug in real-time with Node.js
Monitor for errors and failures
Debug your Function(s)

Debug from the Console
If you are actively working on your Function in the Twilio Console, you can display live logs that can aid you in debugging your deployed Functions.
To start, click the Enable live logs button near the bottom-right of the Functions editor. As your Function is invoked, any log statements in your code will be displayed in real time.
Given the following Function code, deployed with Public Visibility:
Copy code block
exports.handler = function(context, event, callback) {


 console.log("Invoked with: ", event);


 return callback(null, "OK");


};
If you invoke the Function with some arguments, you should see their values displayed in the console as shown below.
Copy code block
curl https://your-domain-2242.twil.io/log-demo?key=value

Expand image
In this case, Twilio Functions streamed the start, end, and any console output of the Function into the Twilio console.

Retrieve logs
If you leave your console session by navigating away or closing the browser window, the log messages that your Function(s) generate will still be accessible as Logs via the Serverless API.
For example, suppose the above Function generated logs at different error levels (info, warn, and error). You can use the Twilio CLI to retrieve these logs from the Serverless API:
Copy code block
twilio api:serverless:v1:services:environments:logs:list \


   --service-sid ZSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX \


   --environment-sid ZEXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
The output may look like this:
Copy code block
[ERROR][2021-10-27T22:07:54Z]: Invoked with:  { key: 'value' }


[WARNING][2021-10-27T22:07:54Z]: Invoked with:  { key: 'value' }


[INFO][2021-10-27T22:07:54Z]: Invoked with:  { key: 'value' }
For a less verbose command, you can also install the Serverless Toolkit plugin for the CLI and issue the following command instead:
Copy code block
twilio serverless:logs \


   --service-sid=ZSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX \


   --environment=ZEXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Just as before, the output may look like this:
Copy code block
[ERROR][2021-10-27T22:07:54Z]: Invoked with:  { key: 'value' }


[WARNING][2021-10-27T22:07:54Z]: Invoked with:  { key: 'value' }


[INFO][2021-10-27T22:07:54Z]: Invoked with:  { key: 'value' }
For more information about Logs, other ways to retrieve them, and their limitations, please refer to the Logs API Reference.

Debug in real-time with Node.js
If you want to run your Function with a fully-featured debugger attached and have the ability to step through your code, then you will need to leverage the Serverless Toolkit.
These setup instructions will allow you to run your Function on your local machine and step through its execution using any Node.js supported debugger, such as Visual Studio Code
 or the Chrome Developer Tools
.
(warning)
Warning
You cannot use this method to debug Services that are created from the Console UI. Debugging in this manner is only possible if your project was initially created with the Serverless Toolkit.

Monitor for errors and failures
If your Function returns an error, it will be reported in the Debugger
.
(information)
Info
The Debugger supports search queries, as well as the option to group errors by their Function's URL or by error code.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Debug your Function(s) | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Runtime Client
Runtime Handler
Environment variables
Regional support
Dependencies
Headers and cookies
Debugging
Frequently asked questions
Examples
Migration guides
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
Why does my Function return 'runtime application timed out'?
Why isn't my code running?
Can API Calls occur after a Function Execution has ended?
How do I keep this from happening?
How do I construct Voice TwiML?
How do I construct Messaging TwiML?
How do I return JSON?
Can I interact with the OPTIONS request?
How do I send CORS headers?
How can I use an ES Module in my Function?
Can I execute my Functions on a schedule?
Can I see examples of existing Functions?
How many Functions can I create?
What limits are in place on Function invocation?
Can I create temporary files when executing a Function?
Are there any Twilio resources for learning Node.js?
Which runtimes are available for Twilio Functions?
Functions and Assets FAQ

Why does my Function return 'runtime application timed out'?
There are two likely reasons your Function has completed with the error: 'runtime application timed out'.
The most common reason is that your Function has exceeded the 10-second execution time limit. You can determine this by looking at the execution logs on the Function instance page. The last log line after execution will tell you how many milliseconds the Function took to execute. If the processing time is greater than 10,000 milliseconds, then Twilio terminated your Function.

Expand image
The other, more subtle reason your Function ended with an application timeout is because of an incorrect invocation of callback(). If your Function does not call the callback() method or the method is unreachable, your Function will continue executing until it reaches the time limit and ultimately fails. A very common mistake is to forget to capture the catch() rejected state of a Promise and calling callback() there as well. The Function Execution documentation provides extensive details on the functionality and usage of the callback() method. Below are several examples of correct use of callback() to complete execution and emit a response.
Complete Execution with Asynchronous HTTP Request
Example of how to appropriately use callback() with an asynchronous HTTP request
Copy code block
exports.handler = (context, event, callback) => {


 // Fetch the already initialized Twilio REST client


 const client = context.getTwilioClient();





 // Determine message details from the incoming event, with fallback values


 const from = event.From || '+15095550100';


 const to = event.To || '+15105550101';


 const body = event.Body || 'Ahoy, World!';





 client.messages


   .create({ to, from, body })


   .then((result) => {


     console.log('Created message using callback');


     console.log(result.sid);


     // Callback is placed inside the successful response of the request


     return callback();


   })


   .catch((error) => {


     console.error(error);


     // Callback is also used in the catch handler to end execution on errors


     return callback(error);


   });





// If you were to place the callback() function here, instead, then the process would


// terminate before your API request to create a message could complete.


};
Return a Simple Successful Response
Example of how to return an empty HTTP 200 OK
Copy code block
exports.handler = (context, event, callback) => {


 // Providing neither error nor response will result in a 200 OK


 return callback();


};

Why isn't my code running?
The most common reason we have seen that a Function appears not to run is the misuse of callback. Your Function invocation terminates when it calls callback. If your request is asynchronous, for example, an API call to a Twilio resource, then you must call callback after the success response of the request has resolved. This would be in the then/catch blocks chained to a request, or after a request that uses the await keyword in an async context.

Can API Calls occur after a Function Execution has ended?
Yes! Outgoing API requests from inside a Function (either directly via axios/got, or through an SDK such as Twilio's) can still be in an enqueued state even after the execution of a Function has ended.
This happens if you make an asynchronous request that returns a Promise
, and forget to either await it or chain on a .then handler. Here, the Function may finish execution before the request occurs or completes. Then, your request may be deferred, sit idle, and run on a subsequent Function invocation in your Service before our system cleans it up.
How do I keep this from happening?
Always be sure to wait for the Promises generated by your API calls and methods to resolve before invoking callback. Below are examples of improperly and properly handled asynchronous logic, one which uses .then chaining, and another using async/await syntax.
Copy code block
// An example of an improperly handled Promise


exports.handler = (context, event, callback) => {


 const client = context.getTwilioClient();


 client.messages.create({


   body: "hi",


   to: toNumber,


   from: fromNumber,


 });


 return callback(null, 'success');


};
Using .then chaining
Copy code block
// An example of properly waiting for message creation to


// finish before ending Function execution


exports.handler = (context, event, callback) => {


 const client = context.getTwilioClient();


 client.messages


   .create({


     body: 'hi',


     to: event.toNumber,


     from: event.fromNumber,


   })


   .then((message) => {


     return callback(null, `Success! Message SID: ${message.sid}`);


   });


   // Ideally, you would also have some .catch logic to handle errors


};


Using async/await
Copy code block
// An example of properly waiting for message creation to


// finish before ending Function execution


exports.handler = async (context, event, callback) => {


 const client = context.getTwilioClient();


 const message = await client.messages.create({


   body: 'hi',


   to: event.toNumber,


   from: event.fromNumber,


 });





 return callback(null, `Success! Message SID: ${message.sid}`);


 // Ideally, you would add some try/catch logic to handle errors


};

How do I construct Voice TwiML?
You can generate Voice TwiML using the Twilio Node library,
 which comes packaged within your Function.
Construct Voice TwiML
Node.js
Report code block
Copy code block
exports.handler = (context, event, callback) => {


 const twiml = new Twilio.twiml.VoiceResponse()


 twiml.dial().sip("sip:jack@example.com")


 return callback(null, twiml);


}
Output
Copy output
<?xml version="1.0" encoding="UTF-8"?>


<Response>


 <Dial>


   <Sip>sip:jack@example.com</Sip>


 </Dial


</Response>

How do I construct Messaging TwiML?
You can generate Messaging TwiML using the Twilio Node library
, which comes packaged within your Function.
Construct Messaging TwiML
Node.js
Report code block
Copy code block
exports.handler = (context, event, callback) => {


 const twiml = new Twilio.twiml.MessagingResponse();


 twiml.message('The Robots are coming! Head for the hills!');


 callback(null, twiml);


}
Output
Copy output
<?xml version="1.0" encoding="UTF-8"?>


<Response>


 <Message>The Robots are coming! Head for the hills!</Message>


</Response>

How do I return JSON?
Simply return your object as outlined in the Function Execution documentation or the following sample code:
Return a Successful JSON Response
Example of how to return JSON in HTTP 200 OK
Copy code block
exports.handler = (context, event, callback) => {


 // Construct an object in any way


 const response = { result: 'winner winner!' };


 // A JavaScript object as a response will be serialized to JSON and returned


 // with the Content-Type header set to "application/json" automatically


 return callback(null, response);


};

Can I interact with the OPTIONS request?
No, you cannot interact with the pre-flight OPTIONS request
 that browsers send.
The Runtime client will automatically respond to OPTIONS requests with the following values:
Copy code block
Access-Control-Allow-Origin: *


Access-Control-Allow-Headers: *


Access-Control-Allow-Methods: GET, POST, OPTIONS


This means that all origins may access your Function, all headers are passed through, and that the only methods allowed to access your Function are GET, POST, and OPTIONS.

How do I send CORS headers?
You can send CORS headers by using the Twilio Response object described in this example.

How can I use an ES Module in my Function?
If you've tried to use a package such as got or p-retry in your Functions lately, you may have seen this error in your logs:
Copy code block
Error [ERR_REQUIRE_ESM]: Must use import to load ES Module: /Users/your-name/your-project/node_modules/got/dist/source/index.js


 require() of ES modules is not supported.


 require() of /Users/your-name/your-project/node_modules/got/dist/source/index.js from /Users/your-name/your-project/functions/retry.js is an ES module file as it is a .js file whose nearest parent package.json contains "type": "module" which defines all .js files in that package scope as ES modules.


 Instead rename index.js to end in .cjs, change the requiring code to use import(), or remove "type": "module" from /Users/your-name/your-project/node_modules/got/package.json.





     at new NodeError (internal/errors.js:322:7)


     at Object.Module._extensions..js (internal/modules/cjs/loader.js:1102:13)


     at Module.load (internal/modules/cjs/loader.js:950:32)


     at Function.Module._load (internal/modules/cjs/loader.js:790:12)


     at Module.require (internal/modules/cjs/loader.js:974:19)


     at require (internal/modules/cjs/helpers.js:101:18)


     at Object. (/Users/your-name/your-project/functions/retry.js:2:13)


     at Module._compile (internal/modules/cjs/loader.js:1085:14)


     at Object.Module._extensions..js (internal/modules/cjs/loader.js:1114:10)


     at Module.load (internal/modules/cjs/loader.js:950:32)
This stems from the fact that packages in the Node.js ecosystem are migrating over from the old CommonJS (CJS) standard to the newer, ES Modules (ESM) standard. You can read about the differences in far more detail in this blog post
.
At the moment, Functions only support CJS, but many packages such as p-retry that you might want to use are now only exported as ESM. You could get around this by pinning to an older version of the library that is still CJS, but that opens you up to vulnerabilities and old, unsupported dependencies.
A better solution is to leverage dynamic imports
, which allow you to import and run code from an ESM package even if your Function is still in CJS.
Using the import method in this scenario returns a Promise
, so you will need to properly handle that promise before running the rest of your Function's code. You can do so by nesting your Function's logic within a .then chain, like so:
Copy code block
exports.handler = (context, event, callback) => {


 import('got').then(({ default: got }) => {


   got('https://httpbin.org/anything')


     .json()


     .then((response) => {


       // ... the rest of your Function logic


     });


 });


};
However, it's recommended to leverage async/await syntax
 to handle the promise and minimize the amount of chaining/nesting necessary in your Function:
Copy code block
exports.handler = async (context, event, callback) => {


 const { default: got } = await import('got');





 const response = await got('https://httpbin.org/anything').json();


 // ... the rest of your Function logic


};
Note in the above examples that you are destructuring
 the default export from the got package, and renaming it to the intended name you'd use when importing it with a static require statement. Refer to this guide on API Calls to see a full example of a Function using dynamic imports with an ESM package.
You can use this same strategy for packages that export multiple, named methods:
Copy code block
const { getPhoneNumbers, ahoy } = await import('some-package');
Lastly, you can import all methods from a package to a single variable, and access them by name like so:
Copy code block
const somePackage = await import('some-package');





somePackage.default(); // Runs the default export from 'some-package'


somePackage.getPhoneNumbers();


somePackage.ahoy('hoy');

Can I execute my Functions on a schedule?
Currently, Functions are event-driven and can only be invoked by HTTP.

Can I see examples of existing Functions?
Absolutely! You can find a variety of examples in the navigation bar as well as on our Function Examples page.

How many Functions can I create?
During the Public Beta period, the UI editor can load and present up to 100 Functions or Assets by default. If a service has over 100 Functions or Assets, click on Load more to view the remaining resources, or the next 100 if there are more than that.
The Deploy All and Save buttons, and the ability to change Dependencies, will be disabled until all the Functions and Assets in the service have been loaded. Similarly, it is not possible to delete Functions or Assets until all the Functions or Assets are loaded for view.
To create and manage more Functions and/or Assets, we suggest using the Serverless Toolkit or the Functions and Assets API directly.

What limits are in place on Function invocation?
We limit Functions to 30 concurrent invocations — meaning that if you have over 30 Functions being invoked at the same time, you will see new Function invocations return with a 429 status code. To keep below the threshold, optimize your Functions to return as fast as possible — avoid artificial timeouts and use asynchronous calls to external systems rather than waiting on many API calls to complete.

Can I create temporary files when executing a Function?
Yes. See this blog post
 for a description and samples on how to store files for one-off usage.

Are there any Twilio resources for learning Node.js?
Twilio Quest for JavaScript
#javascript public Slack channel in Twilio Quest Slack
Blog Posts around Asynchronous JavaScript techniques
5 Ways to Make HTTP Requests in Node.js using Async/Await


Async/Await: The Hero JavaScript Deserved


Asynchronous JavaScript: Introducing async and await


Using RxJS Observables With JavaScript Async and Await


Asynchronous JavaScript: Using RxJS Observables with REST APIs in Node.js


Asynchronous JavaScript: Organizing Callbacks for Readability and Reusability


Asynchronous JavaScript: Refactoring Callbacks to Promises in Node.js



Which runtimes are available for Twilio Functions?
The following Node.js runtimes are currently available for Twilio Functions:
runtime
Version
Status
Comments
node18
Node.js 18.16.1
available
Default for new Services on February 1, 2024
node20
Node.js 20.18.3
available


node22
Node.js 22.14.0
available
Will become the default for new Services on June 1, 2025

(information)
Info
The runtime value is a parameter that you can provide at build time. See an example on how to pass this parameter for more context.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Functions and Assets FAQ | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Create and host a Function
Set a Function as a webhook
Respond with a static message
Respond dynamically to an inbound SMS
Forward an inbound SMS
Respond with MMS media from an HTTP request
Receive an inbound SMS

When someone sends a text message to your Twilio number, Twilio can invoke a webhook that you've created to determine what reply to send back using TwiML. On this page, we will be providing some examples of Functions that can serve as the webhook of your Twilio number.
A Function that responds to webhook requests will receive details about the incoming message as properties on the event parameter. These include the incoming number (event.From), the recipient number (event.To), the text body of the message (event.Body), and other relevant data such as the number of media sent and/or geographic metadata about the phone numbers involved. You can view a full list of potential values at Twilio's Request to your Webhook URL.
Once a Function has been invoked on an inbound SMS, any number of actions can be taken. Below are some examples to inspire what you will build.

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
If you prefer a UI-driven approach, creating and deploying a Function can be done entirely using the Twilio Console and the following steps:
Log in to the Twilio Console and navigate to the Functions tab
. If you need an account, you can sign up for a free Twilio account here
!
Functions are contained within Services. Create a Service by clicking the Create Service
 button and providing a name such as test-function.
Once you've been redirected to the new Service, click the Add + button and select Add Function from the dropdown.
This will create a new Protected Function for you with the option to rename it. The name of the file will be path it is accessed from.
Copy any one of the example code snippets from this page that you want to experiment with, and paste the code into your newly created Function. You can quickly switch examples by using the dropdown menu of the code rail.
Click Save to save your Function's contents.
Click Deploy All to build and deploy the Function. After a short delay, your Function will be accessible from: https://<service-name>-<random-characters>-<optional-domain-suffix>.twil.io/<function-path>
For example: test-function-3548.twil.io/hello-world.
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!

Set a Function as a webhook
In order for your Function to react to incoming SMS and/or voice calls, it must be set as a webhook for your Twilio number. There are a variety of methods to set a Function as a webhook, as detailed below:
Twilio ConsoleTwilio CLITwilio SDKs
You can use the Twilio Console
 UI as a straightforward way of connecting your Function as a webhook:
Log in to the Twilio Console's Phone Numbers page
.
Click on the phone number you'd like to have connected to your Function.
If you want the Function to respond to incoming SMS, find the A Message Comes In option under Messaging. If you want the Function to respond to Voice, find the A Call Comes In option under Voice & Fax.
Select Function from the A Message Comes In or A Call Comes In dropdown.
Select the Service that you are using, then the Environment (this will default to ui unless you have created custom domains ), and finally Function Path of your Function from the respective dropdown menus.

Expand image
Alternatively, you could select Webhook instead of Function, and directly paste in the full URL of the Function.

Expand image
Click the Save button.

Respond with a static message
For the most basic possible example, one can reply to the incoming SMS with a hardcoded message. To do so, you can create a new MessagingResponse and declare the intended message contents. Once your message content has been set, you can return the generated TwiML by passing it to the callback function as shown and signaling a successful end to the Function.
Respond to an inbound SMS
Copy code block
exports.handler = (context, event, callback) => {


 // Create a new messaging response object


 const twiml = new Twilio.twiml.MessagingResponse();


 // Use any of the Node.js SDK methods, such as `message`, to compose a response


 twiml.message('Hello, World!');


 // Return the TwiML as the second argument to `callback`


 // This will render the response as XML in reply to the webhook request


 return callback(null, twiml);


};

Respond dynamically to an inbound SMS
Because the contents of the incoming message are accessible from event.Body, it's also possible to tailor the response based on the contents of the message. For example, you could respond with "Hello, there!" to an incoming message that includes the text "hello", say "Goodbye" to any message including "bye", and have a fallback response if neither of those conditions is met.
Dynamically respond to an inbound SMS
Copy code block
exports.handler = (context, event, callback) => {


 // Create a new messaging response object


 const twiml = new Twilio.twiml.MessagingResponse();





 // Access the incoming text content from `event.Body`


 const incomingMessage = event.Body.toLowerCase();





 // Use any of the Node.js SDK methods, such as `message`, to compose a response


 if (incomingMessage.includes('hello')) {


   twiml.message('Hello, there!');


 } else if (incomingMessage.includes('bye')) {


   twiml.message('Goodbye!');


 } else {


   twiml.message('Not sure what you meant! Please say hello or bye!');


 }





 // Return the TwiML as the second argument to `callback`


 // This will render the response as XML in reply to the webhook request


 return callback(null, twiml);


};

Forward an inbound SMS
Another example that uses even more event properties would be a Function that forwards SMS messages from your Twilio phone number to your personal cell phone. This could be handy in a situation where perhaps you don't want to share your real number while selling an item online, you are suspicious of the stranger that just asked for your number, or for any other reason.
This Function will accept an incoming SMS and generate a new TwiML response that contains the number that sent the message followed by the contents of the SMS. Because the TwiML's to property is set to your personal phone number, this new message will be forwarded to you instead of creating a response directly to the sender.
For more information and a more detailed example, please reference this blog post
 on the subject.
Forward an inbound SMS
Copy code block
const MY_NUMBER = "+15095550100";





exports.handler = (context, event, callback) => {


 // Create a new messaging response object


 const twiml = new Twilio.twiml.MessagingResponse();


 // Use any of the Node.js SDK methods, such as `message`, to compose a response


 // Access incoming text information like the from number and contents off of `event`


 // Note: providing a `to` parameter like so will forward this text instead of responding to the sender


 twiml.message({ to: MY_NUMBER }, `${event.From}: ${event.Body}`);


 // Return the TwiML as the second argument to `callback`


 // This will render the response as XML in reply to the webhook request


 return callback(null, twiml);


};
(information)
Info
In this example, your personal number is hardcoded as a string in the Function for convenience. For a more secure approach, consider setting MY_NUMBER as an Environment Variable in the Functions UI instead. It could then be referenced in your code as context.MY_NUMBER, as shown in the following example.
Forward an inbound SMS
Using an environment variable to store sensitive data
Copy code block
exports.handler = (context, event, callback) => {


 // Create a new messaging response object


 const twiml = new Twilio.twiml.MessagingResponse();


 // Use any of the Node.js SDK methods, such as `message`, to compose a response


 // Access incoming text information like the from number and contents off of `event`


 // Access environment variables and other runtime data from `context`


 twiml.message({ to: context.MY_NUMBER }, `${event.From}: ${event.Body}`);


 // Return the TwiML as the second argument to `callback`


 // This will render the response as XML in reply to the webhook request


 return callback(null, twiml);


};

Respond with MMS media from an HTTP request
All the Function examples so far are fully synchronous and only rely on data from the inbound message. Functions can also request data from other services with the ability to rely on modern async/await syntax
.
For example, in response to an incoming SMS, it's possible for a Function to request an online resource (such as a fun image of a doge), and reply back to the sender with an MMS containing said image.
Respond to an inbound SMS with an asynchronously generated MMS
Copy code block
const axios = require('axios');





// Note that the function must be `async` to enable the use of the `await` keyword


exports.handler = async (context, event, callback) => {


 // Create a new messaging response object


 const twiml = new Twilio.twiml.MessagingResponse();





 // You can do anything in a Function, including making async requests for data


 const response = await axios


   .get('https://dog.ceo/api/breed/shiba/images/random')


   .catch((error) => {


     // Be sure to handle any async errors, and return them in a callback to end


     // Function execution if it makes sense for your application logic


     console.error(error);


     return callback(error);


   });





 const imageUrl = response.data.message;





 // Use any of the Node.js SDK methods, such as `message`, to compose a response


 // In this case we're also including the doge image as a media attachment


 // Note: access incoming text details such as the from number on `event`


 twiml


   .message(`Hello, ${event.From}! Enjoy this doge!`)


   .media(imageUrl);





 // Return the TwiML as the second argument to `callback`


 // This will render the response as XML in reply to the webhook request


 return callback(null, twiml);


};
(warning)
Warning
In order to use an npm module such as axios to create HTTP requests, you will need to add it as a Dependency.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Receive an inbound SMS | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Prerequisites
Create and host a Function
How to invoke your Function
Generate a valid X-Twilio-Signature header
Send a single SMS
Send multiple SMS
Include MMS in a message
Send SMS and MMS

All Functions execute with a pre-initialized instance of the Twilio Node.js SDK available for use. This means you can access and utilize any Twilio helper library method in your Function. For example, sending SMS via Twilio's Programmable SMS from a Function is incredibly accessible, as we'll show in the following example snippets.
These examples are not exhaustive, and we encourage you to peruse the Programmable SMS tutorials for more inspiration on what you can build.

Prerequisites
Before you start, be sure to complete the following prerequisites. You can skip to "Create and host a Function" if you've already completed these steps and need to know more about Function deployment and invocation, or you can skip all the way to "Send a single SMS" if you're all ready to go and want to get straight to the code.
A Twilio account
.
A Twilio Phone number
 with SMS (and MMS) capabilities.

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
If you prefer a UI-driven approach, creating and deploying a Function can be done entirely using the Twilio Console and the following steps:
Log in to the Twilio Console and navigate to the Functions tab
. If you need an account, you can sign up for a free Twilio account here
!
Functions are contained within Services. Create a Service by clicking the Create Service
 button and providing a name such as test-function.
Once you've been redirected to the new Service, click the Add + button and select Add Function from the dropdown.
This will create a new Protected Function for you with the option to rename it. The name of the file will be path it is accessed from.
Copy any one of the example code snippets from this page that you want to experiment with, and paste the code into your newly created Function. You can quickly switch examples by using the dropdown menu of the code rail.
Click Save to save your Function's contents.
Click Deploy All to build and deploy the Function. After a short delay, your Function will be accessible from: https://<service-name>-<random-characters>-<optional-domain-suffix>.twil.io/<function-path>
For example: test-function-3548.twil.io/hello-world.
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!

How to invoke your Function
Functions created in the UI are Protected by default, and we highly recommend you to set Functions deployed via the Serverless Toolkit to protected as well by prepending protected before the file extension, for example: send-sms.protected.js. This will help secure your Function and protect it from being accessed by bad actors. However, this also adds an extra layer of complexity if you want to manually invoke and test code, such as the examples on this page.
In order to successfully call your protected Function, you will need to provide a valid X-Twilio-Signature header in your request. You can learn more about the request validation process, but in the meantime, let's get started with some code that will get you up and running fast.
Generate a valid X-Twilio-Signature header
While it's possible to generate the header yourself using HMAC-SHA1, we highly recommend you use the convenience utilities exported by Twilio's Helper Libraries to perform this operation. Head over to the libraries page to download the library for your language of choice.
Once you have the library of your choice installed, you'll need to:
Set your Auth Token
 as an environment variable.
Modify the URL of the example below to match your Service and any intended data that you want to communicate as query parameters, if any, if using Node.js. (Refer to the examples here for how to generate a signature with other SDKs.)
Execute the modified script and save the resulting X-Twilio-Signature for use in the next step.
Here are two examples for if you want to generate a signature for a POST request which includes JSON, or a GET request that communicates its data as query parameters instead:
With a JSON bodyWith Query Parameters
Copy code block
const { getExpectedTwilioSignature } = require('twilio/lib/webhooks/webhooks');





// Retrieve your auth token from the environment instead of hardcoding


const authToken = process.env.TWILIO_AUTH_TOKEN;





// Use the Twilio helper to generate your valid signature!


// The 1st argument is your Twilio auth token.


// The 2nd is the full URL of your Function.


// The 3rd is any application/x-www-form-urlencoded data being sent, which is none!


const xTwilioSignature = getExpectedTwilioSignature(


 authToken,


 'https://example-4321.twil.io/sms/send',


 {} // <- Leave this empty if sending request data via JSON


);





// Print the signature to the console for use with your


// preferred HTTP client


console.log('xTwilioSignature: ', xTwilioSignature);





// For example, the output will look like this:


// xTwilioSignature: coGTEaFEMv8ejgNGtgtUsbL8r7c=
Create a valid request
Once you've generated a valid X-Twilio-Signature value, it's time to use this as a header in a request to your Function. You can do so using a variety of tools, such as curl
, Postman
, and more. Be sure to:
Set the URL of the Function, including the root of your Service and the full path to the deployed Function.
Set the X-Twilio-Signature header and content type header (application/json) for your request.
Define the JSON body that you're sending to the Function
Using curl, the example request above would look like this:
Copy code block
curl -X POST 'http://test-4321.twil.io/sms/send' \


 -H 'X-Twilio-Signature: coGTEaFEMv8ejgNGtgtUsbL8r7c=' \


 -H 'Content-Type: application/json' \


 --data-raw '{


   "Body": "Hello, there!"


 }'

Send a single SMS
(warning)
Warning
For any Function using the built-in Twilio client, the "Add my Twilio Credentials (ACCOUNT_SID) and (AUTH_TOKEN) to ENV" option on the Settings > Environment Variables tab must be enabled.
You can use a Function to send a single SMS from your Twilio phone number via Twilio's Programmable SMS. The To, From, and Body parameters of your message must be specified to successfully send.
You'll tell Twilio which phone number to use to send this message by either providing a From value in your request, or by omitting it and replacing the placeholder default value in the example code with your own Twilio phone number.
Next, specify yourself as the message recipient by either providing a To value in your request, or by omitting it and replacing the default value in the example code with your personal number. The resulting from and to values both must use E.164 formatting ("+" and a country code, e.g., +16175551212).
Finally, the body value determines the contents of the SMS that is being sent. As with the other values, either pass in a Body value in your request to this Function or override the default in the example to your own custom message.
Once you've made any modifications to the sample and have deployed your Function for testing, go ahead and make some test HTTP requests against it. Example code for invoking your Function is described earlier in this document.
Send a single SMS
Copy code block
exports.handler = function (context, event, callback) {


 // The pre-initialized Twilio client is available from the `context` object


 const twilioClient = context.getTwilioClient();





 // Query parameters or values sent in a POST body can be accessed from `event`


 const from = event.From || '+15017122661';


 const to = event.To || '+15558675310';


 const body = event.Body || 'Ahoy, World!';





 // Use `messages.create` to generate a message. Be sure to chain with `then`


 // and `catch` to properly handle the promise and call `callback` _after_ the


 // message is sent successfully!


 twilioClient.messages


   .create({ body, to, from })


   .then((message) => {


     console.log('SMS successfully sent');


     console.log(message.sid);


     // Make sure to only call `callback` once everything is finished, and to pass


     // null as the first parameter to signal successful execution.


     return callback(null, `Success! Message SID: ${message.sid}`);


   })


   .catch((error) => {


     console.error(error);


     return callback(error);


   });


};

Send multiple SMS
You are not limited to sending a single SMS in a Function. For example, suppose you have a list of users to send messages to at the same time. As long as the list is reasonably short to avoid hitting rate limiting (see Messaging Services for how to send high volume messages), you can execute multiple, parallel calls to create a message and await the result in a Function as shown in the example below:
Send multiple SMS
Copy code block
// Note: Since we're using the `await` keyword in this Function, it must be declared as `async`


exports.handler = async function (context, event, callback) {


 // The pre-initialized Twilio client is available from the `context` object


 const twilioClient = context.getTwilioClient();





 // In this example the messages are inlined. They could also be retrieved from


 // a private Asset, an API call, a call to a database, etc to name some options.


 const groupMessages = [


   {


     name: 'Person1',


     to: '+15105550100',


     body: 'Hello Alan',


     from: '+15095550100',


   },


   {


     name: 'Person2',


     to: '+15105550101',


     body: 'Hello Winston',


     from: '+15095550100',


   },


   {


     name: 'Person3',


     to: '+15105550102',


     body: 'Hello Deepa',


     from: '+15095550100',


   },


 ];





 try {


   // Create an array of message promises with `.map`, and await them all in


   // parallel using `Promise.all`. Be sure to use the `await` keyword to wait


   // for the promises to all finish before attempting to log or exit!


   const results = await Promise.all(


     groupMessages.map((message) => twilioClient.messages.create(message))


   );


   results.forEach((result) => console.log(`Success: ${result.sid}`));


   // Make sure to only call `callback` once everything is finished, and to pass


   // null as the first parameter to signal successful execution.


   return callback(null, 'Batch SMS Successful');


 } catch (error) {


   console.error(error);


   return callback(error);


 }


};

Include MMS in a message
Media, such as images, can be included in your text messages by adding the mediaUrl parameter to the call to client.messages.create. This can either be a single string to a publicly accessible URL or an array of multiple media URLs.
Send a MMS
Copy code block
exports.handler = function (context, event, callback) {


 // The pre-initialized Twilio client is available from the `context` object


 const twilioClient = context.getTwilioClient();





 // Query parameters or values sent in a POST body can be accessed from `event`


 const from = event.From || '+15017122661';


 const to = event.To || '+15558675310';


 const body = event.Body || 'This is the ship that made the Kessel Run in fourteen parsecs?';


 // Note that the `mediaUrl` value may be a single string, or an array of strings


 const mediaUrl = event.mediaUrl || 'https://c1.staticflickr.com/3/2899/14341091933_1e92e62d12_b.jpg';





 // Use `messages.create` to generate a message. Be sure to chain with `then`


 // and `catch` to properly handle the promise and call `callback` _after_ the


 // message is sent successfully!


 // Note the addition of the `mediaUrl` value as configuration for `messages.create`.


 twilioClient.messages


   .create({ body, to, from, mediaUrl })


   .then((message) => {


     console.log('MMS successfully sent');


     console.log(message.sid);


     // Make sure to only call `callback` once everything is finished, and to pass


     // null as the first parameter to signal successful execution.


     return callback(null, `Success! Message SID: ${message.sid}`);


   })


   .catch((error) => {


     console.error(error);


     return callback(error);


   });


};

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Send SMS and MMS | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Create and host a Function
Set a Function as a webhook
Respond with a static message
Respond dynamically to an incoming phone call
Forward an incoming phone call
Record an incoming phone call
Creating a moderated conference call
Receive an incoming phone call

When someone calls your Twilio number, Twilio can invoke a webhook that you've created to determine how to respond using TwiML. On this page, we will be providing some examples of Functions that can serve as the webhook of your Twilio number.
A Function that responds to webhook requests will receive details about the incoming phone call as properties on the event parameter. These include the phone number of the caller (event.From), the phone number of the recipient (event.To), and other relevant data such as geographic metadata about the phone numbers involved. You can view a full list of potential values at Twilio's request to your application.
Once a Function has been invoked on an incoming phone call, any number of actions can be taken. Below are some examples to inspire what you will build.

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
If you prefer a UI-driven approach, creating and deploying a Function can be done entirely using the Twilio Console and the following steps:
Log in to the Twilio Console and navigate to the Functions tab
. If you need an account, you can sign up for a free Twilio account here
!
Functions are contained within Services. Create a Service by clicking the Create Service
 button and providing a name such as test-function.
Once you've been redirected to the new Service, click the Add + button and select Add Function from the dropdown.
This will create a new Protected Function for you with the option to rename it. The name of the file will be path it is accessed from.
Copy any one of the example code snippets from this page that you want to experiment with, and paste the code into your newly created Function. You can quickly switch examples by using the dropdown menu of the code rail.
Click Save to save your Function's contents.
Click Deploy All to build and deploy the Function. After a short delay, your Function will be accessible from: https://<service-name>-<random-characters>-<optional-domain-suffix>.twil.io/<function-path>
For example: test-function-3548.twil.io/hello-world.
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!

Set a Function as a webhook
In order for your Function to react to incoming SMS and/or voice calls, it must be set as a webhook for your Twilio number. There are a variety of methods to set a Function as a webhook, as detailed below:
Twilio ConsoleTwilio CLITwilio SDKs
You can use the Twilio Console
 UI as a straightforward way of connecting your Function as a webhook:
Log in to the Twilio Console's Phone Numbers page
.
Click on the phone number you'd like to have connected to your Function.
If you want the Function to respond to incoming SMS, find the A Message Comes In option under Messaging. If you want the Function to respond to Voice, find the A Call Comes In option under Voice & Fax.
Select Function from the A Message Comes In or A Call Comes In dropdown.
Select the Service that you are using, then the Environment (this will default to ui unless you have created custom domains ), and finally Function Path of your Function from the respective dropdown menus.

Expand image
Alternatively, you could select Webhook instead of Function, and directly paste in the full URL of the Function.

Expand image
Click the Save button.

Respond with a static message
For the most basic possible example, one can reply to the incoming phone call with a hardcoded message. To do so, you can create a new VoiceResponse and declare the intended message contents using the say method. Once your voice content has been set, you can return the generated TwiML by passing it to the callback function as shown and signaling a successful end to the function.
Respond to an incoming phone call
Copy code block
exports.handler = (context, event, callback) => {


 // Create a new voice response object


 const twiml = new Twilio.twiml.VoiceResponse();


 // Use any of the Node.js SDK methods, such as `say`, to compose a response


 twiml.say('Ahoy, World!');


 // Return the TwiML as the second argument to `callback`


 // This will render the response as XML in reply to the webhook request


 return callback(null, twiml);


};

Respond dynamically to an incoming phone call
Because information about the incoming phone call is accessible from event object, it's also possible to tailor the response to the call based on that data. For example, you could respond with the city of the caller's phone number, or the number itself. The voice used to respond can also be modified, and pre-recorded audio can be used and/or added as well.
Read the in-depth <Say> documentation for more details about how to configure your response.
Respond dynamically to an incoming phone call
Copy code block
exports.handler = (context, event, callback) => {


 // Create a new voice response object


 const twiml = new Twilio.twiml.VoiceResponse();


 // Webhook information is accessible as properties of the `event` object


 const city = event.FromCity;


 const number = event.From;





 // You can optionally edit the voice used, template variables into your


 // response, play recorded audio, and more


 twiml.say({ voice: 'alice' }, `Never gonna give you up, ${city || number}`);


 twiml.play('https://demo.twilio.com/docs/classic.mp3');


 // Return the TwiML as the second argument to `callback`


 // This will render the response as XML in reply to the webhook request


 return callback(null, twiml);


};

Forward an incoming phone call
Another common use case is call forwarding. This could be handy in a situation where perhaps you don't want to share your real number while selling an item online, or as part of an IVR tree.
In this example, the Function will accept an incoming phone call and generate a new TwiML response that both notifies the user of the call forwarding and initiates a transfer of the call to the new number.
Read the in-depth <Dial>documentation for more details about connecting calls to other parties.
Forward an incoming phone call
Copy code block
const NEW_NUMBER = "+15095550100";





exports.handler = (context, event, callback) => {


 // Create a new voice response object


 const twiml = new Twilio.twiml.VoiceResponse();





 twiml.say('Hello! Forwarding you to our new phone number now!');


 // The `dial` method will forward the call to the provided E.164 phone number


 twiml.dial(NEW_NUMBER);


 // Return the TwiML as the second argument to `callback`


 // This will render the response as XML in reply to the webhook request


 return callback(null, twiml);


};
(information)
Info
In this example, the number for call forwarding is hardcoded as a string in the Function for convenience. For a more secure approach, consider setting NEW_NUMBER as an Environment Variable in the Functions UI instead. It could then be referenced in your code as context.NEW_NUMBER, as shown in the following example.
Forward an incoming phone call
Use environment variables to store sensitive values
Copy code block
exports.handler = (context, event, callback) => {


 // Create a new voice response object


 const twiml = new Twilio.twiml.VoiceResponse();


 // Environment variables that you define can be accessed from `context`


 const forwardTo = context.NEW_NUMBER;





 twiml.say('Hello! Forwarding you to our new phone number now!');


 // The `dial` method will forward the call to the provided E.164 phone number


 twiml.dial(forwardTo);


 // Return the TwiML as the second argument to `callback`


 // This will render the response as XML in reply to the webhook request


 return callback(null, twiml);


};

Record an incoming phone call
Another common use case would be recording the caller's voice as an audio recording which can be retrieved later. Optionally, you can generate text transcriptions of recorded calls by setting the transcribe attribute of <Record> to true.
Read the in-depth <Record> documentation for more details about recording and/or transcribing calls.
Record an incoming phone call
Copy code block
exports.handler = (context, event, callback) => {


 // Create a new voice response object


 const twiml = new Twilio.twiml.VoiceResponse();





 twiml.say('Hello! Please leave a message after the beep.');


 // Use <Record> to record the caller's message


 twiml.record();


 // End the call with <Hangup>


 twiml.hangup();


 // Return the TwiML as the second argument to `callback`


 // This will render the response as XML in reply to the webhook request


 return callback(null, twiml);


};
Record and transcribe an incoming phone call
Use extra options to configure your recording
Copy code block
exports.handler = (context, event, callback) => {


 // Create a new voice response object


 const twiml = new Twilio.twiml.VoiceResponse();





 twiml.say('Hello! Please leave a message after the beep.');


 // Use <Record> to record the caller's message.


 // Provide options such as `transcribe` to enable message transcription.


 twiml.record({ transcribe: true });


 // End the call with <Hangup>


 twiml.hangup();


 // Return the TwiML as the second argument to `callback`


 // This will render the response as XML in reply to the webhook request


 return callback(null, twiml);


};

Creating a moderated conference call
For something more exciting, Functions can also power conference calls. In this example, a "moderator" phone number of your choice will have control of the call in a couple of ways:
startConferenceOnEnter will keep all other callers on hold until the moderator joins
endConferenceOnExit will cause Twilio to end the call for everyone as soon as the moderator leaves
Incoming calls will be checked based on the incoming event.From value. If it matches the moderator's phone number, the call will begin and then end once the moderator leaves. Any other phone number will join normally and have no effect on the call's beginning or end.
Read the in-depth <Conference> documentation to learn more details.
Create a moderated conference call
Copy code block
exports.handler = (context, event, callback) => {


 // Create a new voice response object


 const twiml = new Twilio.twiml.VoiceResponse();





 // Start with a <Dial> verb


 const dial = twiml.dial();


 // If the caller is our MODERATOR, then start the conference when they


 // join and end the conference when they leave


 // The MODERATOR phone number MUST be in E.164 format such as "+15095550100"


 if (event.From === context.MODERATOR) {


   dial.conference('My conference', {


     startConferenceOnEnter: true,


     endConferenceOnExit: true,


   });


 } else {


   // Otherwise have the caller join as a regular participant


   dial.conference('My conference', {


     startConferenceOnEnter: false,


   });


 }


 // Return the TwiML as the second argument to `callback`


 // This will render the response as XML in reply to the webhook request


 return callback(null, twiml);


};

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Receive an incoming phone call | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Prerequisites
Create and host a Function
How to invoke your Function
Generate a valid X-Twilio-Signature header
Make an outbound call
Record an outbound call
Make a Call

(warning)
Warning
To avoid potential issues, we highly suggest that you update your twilio dependency to the latest version before running any of these code samples.
All Functions execute with a pre-initialized instance of the Twilio Node.js SDK available for use. This means you can access and utilize any Twilio helper library method in your Function. For example, you can use a Function to make outbound phone calls via Programmable Voice as we'll show in the following example snippets.
These examples are not exhaustive, and we encourage you to peruse the Programmable Voice documentation for more inspiration on what you can build.

Prerequisites
Before you start, be sure to complete the following prerequisites. You can skip to "Create and host a Function" if you've already completed these steps and need to know more about Function deployment and invocation, or you can skip all the way to "Make an outbound call" if you're all ready to go and want to get straight to the code.
A Twilio account
.
A voice-enabled Twilio Phone number
.

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
If you prefer a UI-driven approach, creating and deploying a Function can be done entirely using the Twilio Console and the following steps:
Log in to the Twilio Console and navigate to the Functions tab
. If you need an account, you can sign up for a free Twilio account here
!
Functions are contained within Services. Create a Service by clicking the Create Service
 button and providing a name such as test-function.
Once you've been redirected to the new Service, click the Add + button and select Add Function from the dropdown.
This will create a new Protected Function for you with the option to rename it. The name of the file will be path it is accessed from.
Copy any one of the example code snippets from this page that you want to experiment with, and paste the code into your newly created Function. You can quickly switch examples by using the dropdown menu of the code rail.
Click Save to save your Function's contents.
Click Deploy All to build and deploy the Function. After a short delay, your Function will be accessible from: https://<service-name>-<random-characters>-<optional-domain-suffix>.twil.io/<function-path>
For example: test-function-3548.twil.io/hello-world.
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!

How to invoke your Function
Functions created in the UI are Protected by default, and we highly recommend you to set Functions deployed via the Serverless Toolkit to protected as well by prepending protected before the file extension, for example: send-sms.protected.js. This will help secure your Function and protect it from being accessed by bad actors. However, this also adds an extra layer of complexity if you want to manually invoke and test code, such as the examples on this page.
In order to successfully call your protected Function, you will need to provide a valid X-Twilio-Signature header in your request. You can learn more about the request validation process, but in the meantime, let's get started with some code that will get you up and running fast.
Generate a valid X-Twilio-Signature header
While it's possible to generate the header yourself using HMAC-SHA1, we highly recommend you use the convenience utilities exported by Twilio's Helper Libraries to perform this operation. Head over to the libraries page to download the library for your language of choice.
Once you have the library of your choice installed, you'll need to:
Set your Auth Token
 as an environment variable.
Modify the URL of the example below to match your Service and any intended data that you want to communicate as query parameters, if any, if using Node.js. (Refer to the examples here for how to generate a signature with other SDKs.)
Execute the modified script and save the resulting X-Twilio-Signature for use in the next step.
Here are two examples for if you want to generate a signature for a POST request which includes JSON, or a GET request that communicates its data as query parameters instead:
With a JSON bodyWith Query Parameters
Copy code block
const { getExpectedTwilioSignature } = require('twilio/lib/webhooks/webhooks');





// Retrieve your auth token from the environment instead of hardcoding


const authToken = process.env.TWILIO_AUTH_TOKEN;





// Use the Twilio helper to generate your valid signature!


// The 1st argument is your Twilio auth token.


// The 2nd is the full URL of your Function.


// The 3rd is any application/x-www-form-urlencoded data being sent, which is none!


const xTwilioSignature = getExpectedTwilioSignature(


 authToken,


 'https://example-4321.twil.io/sms/send',


 {} // <- Leave this empty if sending request data via JSON


);





// Print the signature to the console for use with your


// preferred HTTP client


console.log('xTwilioSignature: ', xTwilioSignature);





// For example, the output will look like this:


// xTwilioSignature: coGTEaFEMv8ejgNGtgtUsbL8r7c=
Create a valid request
Once you've generated a valid X-Twilio-Signature value, it's time to use this as a header in a request to your Function. You can do so using a variety of tools, such as curl
, Postman
, and more. Be sure to:
Set the URL of the Function, including the root of your Service and the full path to the deployed Function.
Set the X-Twilio-Signature header and content type header (application/json) for your request.
Define the JSON body that you're sending to the Function
Using curl, the example request above would look like this:
Copy code block
curl -X POST 'http://test-4321.twil.io/sms/send' \


 -H 'X-Twilio-Signature: coGTEaFEMv8ejgNGtgtUsbL8r7c=' \


 -H 'Content-Type: application/json' \


 --data-raw '{


   "Body": "Hello, there!"


 }'

Make an outbound call
(warning)
Warning
For any Function using the built-in Twilio client, the "Add my Twilio Credentials (ACCOUNT_SID) and (AUTH_TOKEN) to ENV" option on the Settings > Environment Variables tab must be enabled.
You can use a Function to make a call from your Twilio phone number via Programmable Voice. The to and from parameters of your call must be specified to successfully send, and valid TwiML must be provided either via the url or twiml parameters.
You'll tell Twilio which phone number to use to make this call by either providing a From value in your request, or by omitting it and replacing the placeholder default value in the example code with your own Twilio phone number.
Next, specify yourself as the call recipient by either providing a To value in your request, or by omitting it and replacing the default value in the example code with your personal number. The resulting from and to values both must use E.164 formatting ("+" and a country code, e.g., +16175551212).
Finally, the url or twiml value determines the contents of the call that is being sent. As with the other values, either pass in the respective value in your request to this Function or override the default in the example to your own custom value.
Once you've made any modifications to the sample and have deployed your Function for testing, go ahead and make some test HTTP requests against it to get a call to your phone! Example code for invoking your Function is described earlier in this document.
Make an outbound call
Twilio will retrieve the TwiML from the provided URL and use it to handle the call
Copy code block
exports.handler = function (context, event, callback) {


 // The pre-initialized Twilio client is available from the `context` object


 const twilioClient = context.getTwilioClient();





 // Query parameters or values sent in a POST body can be accessed from `event`


 const from = event.From || '+15017122661';


 const to = event.To || '+15558675310';


 // Note that TwiML can be hosted at a URL and accessed by Twilio


 const url = event.Url || 'http://demo.twilio.com/docs/voice.xml';





 // Use `calls.create` to place a phone call. Be sure to chain with `then`


 // and `catch` to properly handle the promise and call `callback` _after_ the


 // call is placed successfully!


 twilioClient.calls


   .create({ to, from, url })


   .then((call) => {


     console.log('Call successfully placed');


     console.log(call.sid);


     // Make sure to only call `callback` once everything is finished, and to pass


     // null as the first parameter to signal successful execution.


     return callback(null, `Success! Call SID: ${call.sid}`);


   })


   .catch((error) => {


     console.error(error);


     return callback(error);


   });


};
Make an outbound call
Directly provide TwiML instructions for how to handle the call
Copy code block
exports.handler = function (context, event, callback) {


 // The pre-initialized Twilio client is available from the `context` object


 const twilioClient = context.getTwilioClient();





 // Query parameters or values sent in a POST body can be accessed from `event`


 const from = event.From || '+15017122661';


 const to = event.To || '+15558675310';


 // Note that the provided TwiML can be serialized as a string and sent!


 const twiml = event.Twiml || '<Response><Say>Ahoy there!</Say></Response>';





 // Use `calls.create` to place a phone call. Be sure to chain with `then`


 // and `catch` to properly handle the promise and call `callback` _after_ the


 // call is placed successfully!


 twilioClient.calls


   .create({ to, from, twiml })


   .then((call) => {


     console.log('Call successfully placed');


     console.log(call.sid);


     // Make sure to only call `callback` once everything is finished, and to pass


     // null as the first parameter to signal successful execution.


     return callback(null, `Success! Call SID: ${call.sid}`);


   })


   .catch((error) => {


     console.error(error);


     return callback(error);


   });


};

Record an outbound call
When making an outgoing call, you can tell Twilio to record the entire call from beginning to end. Add the record argument to your call to calls.create(), set it to true, and Twilio will record the full call on your behalf.
Once the call is complete, you can listen to your recordings either in the Twilio Console
, or access them directly via the REST API for Recordings.
Record an outbound call
Copy code block
exports.handler = function (context, event, callback) {


 // The pre-initialized Twilio client is available from the `context` object


 const twilioClient = context.getTwilioClient();





 // Query parameters or values sent in a POST body can be accessed from `event`


 const from = event.From || '+15017122661';


 const to = event.To || '+15558675310';


 // Note that TwiML can be hosted at a URL and accessed by Twilio


 const url = event.Url || 'http://demo.twilio.com/docs/voice.xml';





 // Use `calls.create` to place a phone call. Be sure to chain with `then`


 // and `catch` to properly handle the promise and call `callback` _after_ the


 // call is placed successfully!


 // Note the addition of the `record` configuration flag for `calls.create`


 twilioClient.calls


   .create({ to, from, record: true, url })


   .then((call) => {


     console.log('Call successfully placed');


     console.log(call.sid);


     // Make sure to only call `callback` once everything is finished, and to pass


     // null as the first parameter to signal successful execution.


     return callback(null, `Success! Call SID: ${call.sid}`);


   })


   .catch((error) => {


     console.error(error);


     return callback(error);


   });


};

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Make a Call | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Create and host a Function
Set a Function as a webhook
Make a single API request
Make sequential API requests
Make parallel API requests
Make a write request to an external API
Make a write request in other formats
Handling unstable APIs
Make a request to an external API

At some point in your application development process, you may find yourself wanting to include dynamic or external data in your responses to users or as part of your application logic. A common way to incorporate this into your application is by making requests to APIs and processing their responses.
There are as many potential use cases as there are developers, so we can't possibly document every possible situation. Instead, we'll provide you with some examples and useful strategies that we've found over the years for making API calls in your Functions.
There are a wide variety of npm modules available for making HTTP requests to external APIs, including but not limited to:
axios


got


node-fetch


For the sake of consistency, all examples will use axios, but the same principles will apply to any HTTP request library. These examples are written assuming that a customer is calling your Twilio phone number and expecting a voice response, but these same concepts apply to any application type.

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
If you prefer a UI-driven approach, creating and deploying a Function can be done entirely using the Twilio Console and the following steps:
Log in to the Twilio Console and navigate to the Functions tab
. If you need an account, you can sign up for a free Twilio account here
!
Functions are contained within Services. Create a Service by clicking the Create Service
 button and providing a name such as test-function.
Once you've been redirected to the new Service, click the Add + button and select Add Function from the dropdown.
This will create a new Protected Function for you with the option to rename it. The name of the file will be path it is accessed from.
Copy any one of the example code snippets from this page that you want to experiment with, and paste the code into your newly created Function. You can quickly switch examples by using the dropdown menu of the code rail.
Click Save to save your Function's contents.
Click Deploy All to build and deploy the Function. After a short delay, your Function will be accessible from: https://<service-name>-<random-characters>-<optional-domain-suffix>.twil.io/<function-path>
For example: test-function-3548.twil.io/hello-world.
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!

Set a Function as a webhook
In order for your Function to react to incoming SMS and/or voice calls, it must be set as a webhook for your Twilio number. There are a variety of methods to set a Function as a webhook, as detailed below:
Twilio ConsoleTwilio CLITwilio SDKs
You can use the Twilio Console
 UI as a straightforward way of connecting your Function as a webhook:
Log in to the Twilio Console's Phone Numbers page
.
Click on the phone number you'd like to have connected to your Function.
If you want the Function to respond to incoming SMS, find the A Message Comes In option under Messaging. If you want the Function to respond to Voice, find the A Call Comes In option under Voice & Fax.
Select Function from the A Message Comes In or A Call Comes In dropdown.
Select the Service that you are using, then the Environment (this will default to ui unless you have created custom domains ), and finally Function Path of your Function from the respective dropdown menus.

Expand image
Alternatively, you could select Webhook instead of Function, and directly paste in the full URL of the Function.

Expand image
Click the Save button.

Make a single API request
Before you can make an API request, you'll need to install axios as a Dependency for your Function. Once axios is installed, copy the following code snippet and paste it as the body of a new, public Function, such as /astro-info. Be sure to use the instructions above to connect this Function as the webhook for incoming calls to your Twilio phone number.
Make a single API request
Copy code block
const axios = require('axios');





exports.handler = async (context, event, callback) => {


 // Create a new voice response object


 const twiml = new Twilio.twiml.VoiceResponse();





 try {


   // Open APIs From Space: http://open-notify.org


   // Number of people in space


   const response = await axios.get(`http://api.open-notify.org/astros.json`);


   const { number, people } = response.data;





   const names = people.map((astronaut) => astronaut.name).sort();


   // Create a list formatter to join the names with commas and 'and'


   // so that the played speech sounds more natural


   const listFormatter = new Intl.ListFormat('en');





   twiml.say(`There are ${number} people in space.`);


   twiml.pause({ length: 1 });


   twiml.say(`Their names are: ${listFormatter.format(names)}`);


   // Return the final TwiML as the second argument to `callback`


   // This will render the response as XML in reply to the webhook request


   // and result in the message being played back to the user


   return callback(null, twiml);


 } catch (error) {


   // In the event of an error, return a 500 error and the error message


   console.error(error);


   return callback(error);


 }


};
This code is:
Initializing a TwiML Voice Response, for speaking back to the incoming caller
Using axios to perform an API request to the astros endpoint, which will return the number of people currently in space, and a list of their names
Performing some operations on the data returned by the API, such as isolating the names into a sorted list, and preparing an Intl.ListFormat
 object for formatting the names
Generating the message to be returned to the caller, and returning it
All of this is wrapped in a try/catch block to handle any exceptions, such as a connection error that could be thrown by the API
There are some key points to keep in mind.
Making an HTTP request to an API is what we call an asynchronous operation, meaning the response from the API will come back to us at a later point in time, and we're free to use computing resources on other tasks in the meantime. Calling axios in this code sample creates a Promise, which will ultimately resolve as the data we want, or reject and throw an exception.
The MDN has an excellent series that introduces asynchronous JavaScript
 and related concepts.
Note that we've declared this Function as async. This means that we can leverage the await keyword and structure our code in a very readable, sequential manner. The request is still fundamentally a Promise, but we can treat it almost like synchronous code without the need for callback hell
 or lengthy then chains. You can learn more about this async/await syntax
 at the MDN.
The other key point is that our code only ever calls callback once our code has successfully completed or if an error has occurred. If the await keyword was removed, or we otherwise didn't wait for the API call to complete before invoking the callback method, this would result in incorrect behavior. If we never invoke callback, the Function will run until the 10-second execution limit is reached, resulting in an error and the customer never receiving a response.

Make sequential API requests
Another common situation you may encounter is the need to make one API request, and then a subsequent request which is dependent on having data from the first request. By properly handling Promises in order, and ensuring that callback is not invoked before our requests have finished, you can make any number of sequential requests in your Function as necessary for your use case (while also keeping in mind that the Function has 10 seconds to complete all requests).
Make sequential API requests
Copy code block
const axios = require('axios');


const qs = require('qs');





exports.handler = async (context, event, callback) => {


 // Create a new voice response object


 const twiml = new Twilio.twiml.VoiceResponse();


 // A pre-initialized Twilio client is available from the `context` object


 const twilioClient = context.getTwilioClient();





 try {


   // Open APIs From Space: http://open-notify.org


   // Number of people in space


   const response = await axios.get(`http://api.open-notify.org/astros.json`);


   const { number, people } = response.data;





   const names = people.map((astronaut) => astronaut.name).sort();





   // Select a random astronaut


   const astronautName = names[Math.floor(Math.random() * names.length)];


   // Search Wikipedia for any article's about the astronaut


   const { data: wikipediaResult } = await axios.get(


     `https://en.wikipedia.org/w/api.php?${qs.stringify({


       origin: '*',


       action: 'opensearch',


       search: astronautName,


     })}`


   );


   // Attempt to select the first relevant article from the nested result


   const article = wikipediaResult[3] ? wikipediaResult[3][0] : undefined;


   // Create a list formatter to join the names with commas and 'and'


   // so that the played speech sounds more natural


   const listFormatter = new Intl.ListFormat('en');





   twiml.say(`There are ${number} people in space.`);


   twiml.pause({ length: 1 });


   twiml.say(`Their names are: ${listFormatter.format(names)}`);


   // If there's a defined article for the astronaut, message the link to the user


   // and tell them they've been sent a message


   if (article) {


     // Use `messages.create` to send a text message to the user that


     // is separate from this call and includes the article


     await twilioClient.messages.create({


       to: event.From,


       from: context.TWILIO_PHONE_NUMBER,


       body: `Learn more about ${astronautName} on Wikipedia at: ${article}`,


     });





     twiml.pause({ length: 1 });


     twiml.say(


       `We've just sent you a message with a Wikipedia article about


        ${astronautName}, enjoy!`


     );


   }





   // Return the final TwiML as the second argument to `callback`


   // This will render the response as XML in reply to the webhook request


   // and result in the message being played back to the user


   return callback(null, twiml);


 } catch (error) {


   // In the event of an error, return a 500 error and the error message


   console.error(error);


   return callback(error);


 }


};
Similar to the previous example, copy the following code snippet and paste it as the body of a new, public Function, such as /detailed-astro-info. In addition, you will need to install the qs module as a Dependency so that we can make an API request that includes search parameters
. Also, for the text messaging to work, you'll need to set your Twilio phone number as an environment variable titled TWILIO_PHONE_NUMBER.
This code is:
Initializing a TwiML Voice Response, for speaking back to the incoming caller
Using axios to perform an API request to the astros endpoint, which will return the number of people currently in space and a list of their names
Performing some operations on the data, and randomly selecting one of the astronaut names
Performing a second API request. This time, querying Wikipedia for any articles about the astronaut, with their name as the search term.
Generating the message to be returned to the caller, sending the caller a text message containing a Wikipedia article (if one is found), and returning the voice message to the caller
All of this is wrapped in a try/catch block to handle any exceptions, such as a connection error that could be thrown by either API

Make parallel API requests
Frequently in applications, we also run into situations where we could make a series of requests one after another, but we can deliver a better and faster experience to users if we perform some requests at the same time.
We can accomplish this in JavaScript by initiating multiple requests, and awaiting their results in parallel using a built-in method, such as Promise.all
.
To get started, copy the following code snippet and paste it as the body of a new, public Function, such as /space-info.
In addition to the axios and qs dependencies installed for previous examples, you will want to get a free API key from positionstack
. This will enable you to perform reverse geolocation on the International Space Station
 or ISS. Set the value of the API key to an environment variable named POSITIONSTACK_API_KEY.
Make parallel API requests
Copy code block
const axios = require('axios');


const qs = require('qs');





exports.handler = async (context, event, callback) => {


 // Create a new voice response object


 const twiml = new Twilio.twiml.VoiceResponse();





 try {


   // Open APIs From Space: http://open-notify.org


   const openNotifyUri = 'http://api.open-notify.org';


   // Create a promise for each API call which can be made


   // independently of each other





   // Number of people in space


   const getAstronauts = axios.get(`${openNotifyUri}/astros.json`);


   // The current position of the ISS


   const getIss = axios.get(`${openNotifyUri}/iss-now.json`);





   // Wait for both requests to be completed in parallel instead of sequentially


   const [astronauts, iss] = await Promise.all([getAstronauts, getIss]);





   const { number, people } = astronauts.data;


   const { latitude, longitude } = iss.data.iss_position;





   const names = people.map((astronaut) => astronaut.name).sort();





   // We can use reverse geocoding to convert the latitude and longitude


   // of the ISS to a human-readable location. We'll use positionstack.com


   // since they provide a free API.


   // Be sure to set your positionstack API key as an environment variable!


   const { data: issLocation } = await axios.get(


     `http://api.positionstack.com/v1/reverse?${qs.stringify({


       access_key: context.POSITIONSTACK_API_KEY,


       query: `${latitude},${longitude}`,


     })}`


   );





   const { label: location } = issLocation.data[0] || 'an unknown location';





   // Create a list formatter to join the names with commas and 'and'


   // so that the played speech sounds more natural


   const listFormatter = new Intl.ListFormat('en');





   twiml.say(`There are ${number} people in space.`);


   twiml.pause({ length: 1 });


   twiml.say(`Their names are: ${listFormatter.format(names)}`);


   twiml.pause({ length: 1 });


   twiml.say(


     `Also, the International Space Station is currently above ${location}`


   );


   // Return the final TwiML as the second argument to `callback`


   // This will render the response as XML in reply to the webhook request


   // and result in the message being played back to the user


   return callback(null, twiml);


 } catch (error) {


   // In the event of an error, return a 500 error and the error message


   console.error(error);


   return callback(error);


 }


};
This code is:
Initializing a TwiML Voice Response, for speaking back to the incoming caller
Using axios to create two requests to the Open Notify API, one for astronaut information and the other for information about the ISS's location, and storing references to the resulting Promises.
awaiting the result of both requests simultaneously using Promise.all
Performing a second API request, this time to convert the latitude and longitude of the ISS into a human-readable location on Earth, such as "North Pacific Ocean"
Generating the message to be returned to the caller based on all of the data gathered so far, and returning the voice message to the caller
All of this is wrapped in a try/catch block to handle any exceptions, such as a connection error that could be thrown by any of the APIs

Make a write request to an external API
Just as you may need to request data in your Serverless applications, there are numerous reasons why you may want to send data to external APIs. Perhaps your Function responds to incoming text messages from customers and attempts to update an internal record about that customer by sending data to an API that manages customer records. Maybe your Function serves as a means to push messages onto a queue, like SQS
 so that some other microservice can handle clearing out that queue.
Regardless of the use case, you are free to make write requests to external APIs from your Functions (assuming you have permission to do so from the API). There are no restrictions imposed on this by Runtime itself.
Depending on the scenario, making a write request will mostly consist of using the same principles from the above examples, but using HTTP verbs such as POST and PUT instead of GET.
The below example demonstrates a simple use case where a Function:
Receives an incoming text message
Derives an identifier from the incoming phone number
Retrieves a record from an API, based on the derived ID
Writes an update to that API, and responds to the sender once all operations are complete
Make a write request to an external API
Copy code block
const axios = require('axios');





exports.handler = async (context, event, callback) => {


 // Create a new message response object


 const twiml = new Twilio.twiml.MessagingResponse();





 // Just for this example, we'll use the first digit of the incoming phone


 // number to identify the call. You'll want to use a more robust mechanism


 // for your own Functions, such as the full phone number.


 const postId = event.From[1];





 // Since we're making multiple requests, we'll create an instance of axios


 // that includes our API's base URL and any custom headers we might want to


 // send with each request. This will simplify the GET and POST request paths.


 // JSONPlaceholder is a fake REST API that you can use for testing and prototyping


 const instance = axios.create({


   baseURL: 'https://jsonplaceholder.typicode.com',


   headers: { 'X-Custom-Header': 'Twilio' },


 });





 try {


   // Get the post based on the derived postId


   // If the postId was 1, this is effectively making a GET request to:


   // https://jsonplaceholder.typicode.com/posts/1


   const { data: post } = await instance.get(`/posts/${postId}`);





   const newCount = (post.messageCount || 0) + 1;





   // Use a POST request to "save" the update to the API


   // In this case, we're merging the new count and message into the


   // existing post object.


   const update = await instance.post('/posts/', {


     ...post,


     messageCount: newCount,


     latestMessage: event.Body,


   });





   console.log(update.data);





   // Add a message to the response to let the user know that everything worked


   twiml.message(


     `Message received! This was message ${newCount} from your phone number. 🎉`


   );


   return callback(null, twiml);


 } catch (error) {


   // As always with async functions, you need to be sure to handle errors


   console.error(error);


   // Add a message to the response to let the user know that something went wrong


   twiml.message(`We received your message, but something went wrong 😭`);


   return callback(error);


 }


};

Make a write request in other formats
Some APIs may not accept write requests that are formatted using JSON (Content-Type: application/json). The approach to handling this situation varies depending on the expected Content-Type and which HTTP library you are using.
One example of a common alternative, which you'll encounter when using some of Twilio's APIs without the aid of a helper library, is Content-Type: application/x-www-form-urlencoded. As detailed in the axios documentation
 and shown in the example below, this requires some slight modifications to the data that you send, the Headers attached to the request, or a combination of both.
Make a write request using x-www-form-urlencoded format
Copy code block
const axios = require('axios');


const qs = require('qs');





exports.handler = async (context, event, callback) => {


 // Create a new message response object


 const twiml = new Twilio.twiml.MessagingResponse();





 // Just for this example, we'll use the first digit of the incoming phone


 // number to identify the call. You'll want to use a more robust mechanism


 // for your own Functions, such as the full phone number.


 const postId = event.From[1];





 // Since we're making multiple requests, we'll create an instance of axios


 // that includes our API's base URL and any custom headers we might want to


 // send with each request. This will simply be our GET and POST request paths.


 // JSONPlaceholder is a fake REST API that you can use for testing and prototyping


 const instance = axios.create({


   baseURL: 'https://jsonplaceholder.typicode.com',


   headers: { 'X-Custom-Header': 'Twilio' },


 });





 try {


   // Get the post based on the derived postId


   // If the postId was 1, this is effectively making a GET request to:


   // https://jsonplaceholder.typicode.com/posts/1


   const { data: post } = await instance.get(`/posts/${postId}`);





   const newCount = (post.messageCount || 0) + 1;





   // Like before, we're merging the new count and message into the


   // existing post object


   // In order to send this data in the application/x-www-form-urlencoded


   // format, the payload must be encoded via a utility such as qs


   const data = qs.stringify({


     ...post,


     messageCount: newCount,


     latestMessage: event.Body,


   });





   // Use a POST request to "save" the update to the API


   const update = await instance.post('/posts/', data);





   console.log(update.data);





   // Add a message to the response to let the user know that everything worked


   twiml.message(


     `Message received! This was message ${newCount} from your phone number. 🎉`


   );


   return callback(null, twiml);


 } catch (error) {


   // As always with async functions, you need to be sure to handle errors


   console.error(error);


   // Add a message to the response to let the user know that something went wrong


   twiml.message(`We received your message, but something went wrong 😭`);


   return callback(error);


 }


};

Handling unstable APIs
API requests aren't always successful. Sometimes the API's server may be under too much load and unable to handle your request, or something simply happened to go wrong with the connection between your server and the API.
A standard approach to this situation is to retry the same request but after a delay. If that fails, subsequent retries are performed but with increasing amounts of delay (also known as exponential backoff
). You could implement this yourself, or use a module such as p-retry
 to handle this logic for you. This behavior is also built into got by default.
To see this more explicitly configured, the following code examples implement some previous examples, but while utilizing an unstable API that only sometimes successfully returns the desired data.
(warning)
Warning
V5 and newer versions of p-retry are exported as ES Modules
, and Functions currently do not support the necessary import syntax. To utilize p-retry (or any other ES Module package) in the meantime, you will need to import it using dynamic import syntax
 inside of your handler method, as highlighted in the following examples.
Configure retries for an API request
Copy code block
const axios = require('axios');





const getAstronauts = () => axios.get('https://unstable-5604.twil.io/astros');





exports.handler = async (context, event, callback) => {


 // We need to asynchronously import p-retry since it is an ESM module


 const { default: pRetry } = await import('p-retry');


 // Create a new voice response object


 const twiml = new Twilio.twiml.VoiceResponse();





 try {


   let attempts = 1;


   // Open APIs From Space: http://open-notify.org


   // Number of people in space


   const response = await pRetry(getAstronauts, {


     retries: 3,


     onFailedAttempt: ({ attemptNumber, retriesLeft }) => {


       attempts = attemptNumber;


       console.log(


         `Attempt ${attemptNumber} failed. There are ${retriesLeft} retries left.`


       );


       // 1st request => "Attempt 1 failed. There are 3 retries left."


       // 2nd request => "Attempt 2 failed. There are 2 retries left."


       // …


     },


   });


   const { number, people } = response.data;





   const names = people.map((astronaut) => astronaut.name).sort();


   // Create a list formatter to join the names with commas and 'and'


   // so that the played speech sounds more natural


   const listFormatter = new Intl.ListFormat('en');





   twiml.say(`There are ${number} people in space.`);


   twiml.pause({ length: 1 });


   twiml.say(`Their names are: ${listFormatter.format(names)}`);


   // If retries were necessary, add that information to the response


   if (attempts > 1) {


     twiml.pause({ length: 1 });


     twiml.say(`It took ${attempts} attempts to retrieve this information.`);


   }


   // Return the final TwiML as the second argument to `callback`


   // This will render the response as XML in reply to the webhook request


   // and result in the message being played back to the user


   return callback(null, twiml);


 } catch (error) {


   // In the event of an error, return a 500 error and the error message


   console.error(error);


   return callback(error);


 }


};
Configure retries for parallel API requests
Copy code block
const axios = require('axios');


const qs = require('qs');





// The root URL for an API which is known to fail on occasion


const unstableSpaceUri = 'https://unstable-5604.twil.io';


// We'll declare these functions outside of the handler since they have no


// dependencies on other values, and this will tidy up our pRetry calls.


const astronautRequest = () => axios.get(`${unstableSpaceUri}/astros`);


const issRequest = () => axios.get(`${unstableSpaceUri}/iss`);


// Use a common object for retry configuration to DRY up our code :)


const retryConfig = (reqName) => ({


 retries: 3,


 onFailedAttempt: () => console.log(`Retrying ${reqName}...`),


});





exports.handler = async (context, event, callback) => {


 // We need to asynchronously import p-retry since it is an ESM module


 const { default: pRetry } = await import('p-retry');


 // Create a new voice response object


 const twiml = new Twilio.twiml.VoiceResponse();





 try {


   // Create a promise with retry for each API call that can be made


   // independently of each other


   const getAstronauts = pRetry(astronautRequest, retryConfig('astros'));


   const getIss = pRetry(issRequest, retryConfig('iss'));


   // pRetry returns a promise, so we can still use Promise.all to await


   // the result of both requests in parallel with retry and backoff enabled!


   const [astronauts, iss] = await Promise.all([getAstronauts, getIss]);





   const { number, people } = astronauts.data;


   const { latitude, longitude } = iss.data.iss_position;





   const names = people.map((astronaut) => astronaut.name).sort();





   // We can use reverse geocoding to convert the latitude and longitude


   // of the ISS to a human-readable location. We'll use positionstack.com


   // since they provide a free API.


   // Be sure to set your positionstack API key as an environment variable!


   const { data: issLocation } = await pRetry(


     () =>


       axios.get(


         `http://api.positionstack.com/v1/reverse?${qs.stringify({


           access_key: context.POSITIONSTACK_API_KEY,


           query: `${latitude},${longitude}`,


         })}`


       ),


     retryConfig('iss location')


   );





   const { label } = issLocation.data[0] || 'an unknown location';





   // Create a list formatter to join the names with commas and 'and'


   // so that the played speech sounds more natural


   const listFormatter = new Intl.ListFormat('en');





   twiml.say(`There are ${number} people in space.`);


   twiml.pause({ length: 1 });


   twiml.say(`Their names are: ${listFormatter.format(names)}`);


   twiml.pause({ length: 1 });


   twiml.say(


     `Also, the International Space Station is currently above ${label}`


   );


   // Return the final TwiML as the second argument to `callback`


   // This will render the response as XML in reply to the webhook request


   // and result in the message being played back to the user


   return callback(null, twiml);


 } catch (error) {


   // In the event of an error, return a 500 error and the error message


   console.error(error);


   return callback(error);


 }


};

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Make a request to an external API | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Create a Studio Flow and a user prompt
Create and host a Function
Install Dependencies and define the Function body
Use the Run Function widget
Consume the output of the Run Function widget
Test it
Go further with loops and failure flows
Use the Run Function widget in Studio

With their lightweight nature and ability to execute JavaScript, Functions are an excellent companion to Studio Flows. Whether you need to gather some data from an API or run any other custom code to fit your business logic, Functions help to fill in the gaps in your application that existing Studio widgets may not cover.
In order to ease the integration of Functions into your Studio Flows, Studio provides the Run Function widget. This widget, as the name implies, allows you to run a Twilio Function; you may pass in any desired parameters, and leverage any generated values later on in your Studio Flow.
To test this out we'll create a Studio Flow that accepts incoming text messages, prompts the user for their desired dog breed, and returns an MMS containing some text and an image of their requested breed (assuming they provided a valid breed). The finished flow would look like this:

Expand image

Create a Studio Flow and a user prompt
If you haven't created a Flow before, we suggest following the Create Your Flow steps in the chatbot tutorial to get one established.
Once you are inside of your newly created Studio Flow, create the prompt for dog breed by dragging a Send & Wait For Reply widget onto the Studio canvas. Name it and provide some text to prompt the user; the text can be anything you'd like for this example, something along the general lines of "which dog breed would you like to see?"
Here, we'll name the widget request-breed, and provide the following prompt:
Copy code block
Hello! Please respond with your requested dog breed to receive a photo! 🐶
Before we can proceed any further, we must first create the Function that we'll be calling in the next step of the Flow.

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
If you prefer a UI-driven approach, creating and deploying a Function can be done entirely using the Twilio Console and the following steps:
Log in to the Twilio Console and navigate to the Functions tab
. If you need an account, you can sign up for a free Twilio account here
!
Functions are contained within Services. Create a Service by clicking the Create Service
 button and providing a name such as test-function.
Once you've been redirected to the new Service, click the Add + button and select Add Function from the dropdown.
This will create a new Protected Function for you with the option to rename it. The name of the file will be path it is accessed from.
Copy any one of the example code snippets from this page that you want to experiment with, and paste the code into your newly created Function. You can quickly switch examples by using the dropdown menu of the code rail.
Click Save to save your Function's contents.
Click Deploy All to build and deploy the Function. After a short delay, your Function will be accessible from: https://<service-name>-<random-characters>-<optional-domain-suffix>.twil.io/<function-path>
For example: test-function-3548.twil.io/hello-world.
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!

Install Dependencies and define the Function body
Studio Widgets can handle the elements of gathering user input and sending back a response text. However, custom logic like handling breed names that contain spaces lives best inside of a Function.
Let's add some code to this Function. Install axios as a Dependency, copy the following code example into your Function, save, and deploy your Service so that we can look more closely at how to integrate the Run Widget into a Studio Flow.
Note that this Function expects an input of breed, and returns JSON that includes some text and an image url.
(information)
Info
If you're curious about why we're using axios and keywords such as async and await, be sure to read up on how to make API requests in Functions.
Return JSON to a Studio Flow based on input parameters
Copy code block
const axios = require('axios');





exports.handler = async (context, event, callback) => {


 // Any parameters provided to the Function will be accessible from `event`.


 // In Function Parameters, we defined `breed` as the inbound Body from


 // our Send & Wait For Reply Widget. We can access that via `event.breed`.


 // To minimize the potential for errors, lowercase and trim the user input.


 let dogBreed = event.breed.toLowerCase().trim();





 // The Dog API also supports sub-breeds, so we need to handle that case.


 // For example, if the user requests "Golden Retriever", we need to format


 // the breed as "retriever/golden".


 if (dogBreed.includes(' ')) {


   const [subBreed, breed] = dogBreed.split(' ');


   dogBreed = `${breed}/${subBreed}`;


 }





 const dogApiUrl = `https://dog.ceo/api/breed/${dogBreed}/images/random`;





 try {


   // Make the request to the Dog API. Remember to use `await` since this


   // is an asynchronous request!


   const response = await axios.get(dogApiUrl);


   // Return the response to the Send & Wait For Reply Widget.


   return callback(null, {


     text: `Here's an image of a ${event.breed}! 🐶`,


     // The `message` property of the response is the URL of the dog image.


     url: response.data.message,


   });


 } catch (error) {


   // Remember to handle any errors that may occur!


   // In the case of a 404, the breed was not found.


   if (error.response && error.response.status === 404) {


     return callback(null, {


       text: `Sorry, we couldn't find any ${event.breed}s 🥲`,


     });


   }


   // Otherwise, there may have been a network or server error.


   return callback(error);


 }


};

Use the Run Function widget
Once your prompt is complete, drag a Run Function widget onto the canvas, and connect it to the Reply condition of the request-breed widget.
You'll be able to provide a name for the widget (get-doge-image), a configuration that will point this widget at your intended Function, and any parameters or arguments that you'd like to pass from the Flow to the Function when it's executed.
For this example, we'll point the Run Function widget at our Function, which was deployed to the doge Service in a production environment, and the path to the Function is /get-doge. Replace the Service, Environment, and Function configuration options with the values specific to the Function you created earlier.

Expand image
The final important configuration to note is the section labeled Function Parameters. Here, we define the parameters that we will pass to the Function's event object.
Here, we want to provide a variable called breed which is equal to the user's response to the prompt. We can do this by creating a new parameter, naming it breed, and setting the value to the user's response to the request-breed widget.
(information)
Info
We are using the Liquid template language to set a variable to the value gathered by the request-breed widget. Read the Studio guide on Liquid to learn more about this syntax and what else you can do with these expressions!

Consume the output of the Run Function widget
With our prompt and Run Function widgets in place, the last step is to generate a response to the user which incorporates the Function's result.
Drag a Send Message widget onto the canvas, and connect it to the Success condition of the get-doge-image widget.
The configuration for this widget is much shorter, and consists only of a name for the widget, the text body, and any media URL (s) you may want to attach. Luckily, the /get-doge Function returns text and uri values for us, so we can template these values into the config using Liquid.
In order to access the return value of a Run Function widget, you will need to access a special property called parsed. This object will contain any and all contents returned by the targeted Function.
(information)
Info
The general syntax to access a property from the result of a Run Function widget is {{widgets.<widget-name>.parsed.<property>}}.
For example, to access the text and url returned from the get-doge-image widget, the respective Liquid template strings would be the following:
Copy code block
{{widgets.get-doge-image.parsed.text}}


{{widgets.get-doge-image.parsed.url}}
Once you have set Message Body to {{widgets.get-doge-image.parsed.text}} and Media URL to {{widgets.get-doge-image.parsed.url}} on the Send Message widget, your configuration should look like this:

Expand image

Test it
With the Function deployed and all the widgets in the Studio Flow connected and configured, all that's left is to see this little application in action. To save all your progress on the Flow and ensure that its code is live, click Publish on the Studio canvas.
Next, connect one of your Twilio phone numbers to this Flow.
Once you have published your Flow and connected it to your Twilio phone number, send it a brief message to start the conversation. A simple "Ahoy!" will do. Respond to the incoming prompt with a breed of dog, and you will see an MMS of that breed after a momentary delay.

Expand image

Go further with loops and failure flows
So far, while the Function code does contain some catch logic, it otherwise doesn't really have any resilience to missing breed types or even network errors, and it definitely doesn't show that to the user. To improve the experience, let's see what happens if we expand our flow to handle the fail condition of get-doge-image.
To get started, drag a new Send Message widget onto the canvas, give it a name such as send-fail-message, and connect it to the Fail transition from get-doge-image. By doing this, we're introducing an alternative flow of logic for our application in case the Function runs into an error.
To take this a step further, connect the Sent condition of the newly made send-fail-message to get-doge-image. In doing so, you've just created a loop! If the Function fails to get a dog image, the flow will send the user a message then try to re-run the Function, and will do so until it succeeds.
Set the message body to {{widgets.get-doge-image.body}} Trying again!, click Save, and finally click Publish to publish this update to the flow.
These connections and the configuration for send-fail-message should appear as shown below:

Expand image
With the flow updated to handle failures from our Function, let's quickly edit our code to make it artificially error-prone; only for the sake of testing, of course!
Randomly return an error instead of JSON
Copy code block
const axios = require('axios');





exports.handler = async (context, event, callback) => {


 // In Function Parameters, we defined `breed` as the inbound Body from


 // our Send & Wait For Reply Widget. We can access that via `event.breed`.


 // To minimize the potential for errors, lowercase and trim the user input.


 let breed = event.breed.toLowerCase().trim();





 // The Dog API also supports sub-breeds, so we need to handle that case.


 // For example, if the user requests "Golden Retriever", we need to format


 // the breed as "retriever/golden".


 if (breed.includes(' ')) {


   const [first, second] = breed.split(' ');


   breed = `${second}/${first}`;


 }





 const dogApiUrl = `https://dog.ceo/api/breed/${breed}/images/random`;





 try {


   // Let's introduce some inconsistency by randomly throwing an error


   if (Math.random() > 0.3) throw new Error('No doge~');


   // Make the request to the Dog API. Remember to use `await` since this


   // is an asynchronous request!


   const response = await axios.get(dogApiUrl);


   // Return the response to the Send & Wait For Reply Widget.


   return callback(null, {


     text: `Here's an image of a ${event.breed}! 🐶`,


     // The `message` property of the response is the URL of the dog image.


     url: response.data.message,


   });


 } catch (error) {


   // Remember to handle any errors that may occur!


   // This error message will be accessible as `widgets.get-doge-image.body`


   return callback(`Sorry, we couldn't find any ${event.breed}s 🥲`);


 }


};
(information)
Info
To get access to a returned error message, you will need to access the body property returned by the Run Function Widget. This will look like {{widgets.<widget-name>.body}} if used in a liquid template.
Deploy your Function with this updated code, and once completed, send a new message to your Twilio phone number. Between this code change and the new widget in the Studio flow, you will (most likely, this is random, of course) see one or more error messages, ultimately followed by an image of your requested dog breed!

Expand image
This is a very brief introduction to what is possible! Instead of a retry loop with a message, you could create an entirely new, logical flow of widgets where you ask the user for other information; your imagination is the only true limit here.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Use the Run Function widget in Studio | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Create and host a Function
Generate Sync Tokens
Append new SMS messages to a Sync List
Host the web client
Deploy the Service
Connect handle-sms to a Twilio Phone Number
Set a Function as a webhook
Test it out
Next steps
Handle real-time data with Twilio Sync

Twilio Sync is a powerful tool that enables you to synchronize the state of your applications across platforms, with only milliseconds of delay. It's commonly used to establish chat services, power live dashboards for information like recent calls to a support agent, and integrates with Twilio Flex.
This guide will show how to combine Functions, Assets, and Sync into a web application that displays incoming text messages in real time. All without the need to run or maintain your own server 24/7.

Expand image
A quick overview of the architecture and tools that will be used:
Assets will host the app's static content, namely the index.html file that users will access
One Function will serve as an API endpoint for users to generate their Sync token. This will grant them access to view the messages
A second Function will be a webhook that accepts incoming messages, and pushes their contents to a Sync List
Sync stores the List of messages which will appear in the app, and sends message updates to the web app
To begin, follow the instructions below to create a Service and the first Function of this app.

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
If you prefer a UI-driven approach, creating and deploying a Function can be done entirely using the Twilio Console and the following steps:
Log in to the Twilio Console and navigate to the Functions tab
. If you need an account, you can sign up for a free Twilio account here
!
Functions are contained within Services. Create a Service by clicking the Create Service
 button and providing a name such as test-function.
Once you've been redirected to the new Service, click the Add + button and select Add Function from the dropdown.
This will create a new Protected Function for you with the option to rename it. The name of the file will be path it is accessed from.
Copy any one of the example code snippets from this page that you want to experiment with, and paste the code into your newly created Function. You can quickly switch examples by using the dropdown menu of the code rail.
Click Save to save your Function's contents.
Click Deploy All to build and deploy the Function. After a short delay, your Function will be accessible from: https://<service-name>-<random-characters>-<optional-domain-suffix>.twil.io/<function-path>
For example: test-function-3548.twil.io/hello-world.
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!

Generate Sync Tokens
When a user visits the application, their browser will make a request to this Function for a Sync Access Token and the name of the Sync List the app will listen to. Name your first new Function access, and paste in the contents of the code sample below.
This code generates a Sync Token using secured Environment Variables, and returns a stringified version of the token along with the name of the Sync List used by the application.
Generate a Sync Access Token and Sync List name
Copy code block
const AccessToken = Twilio.jwt.AccessToken;


const SyncGrant = AccessToken.SyncGrant;





exports.handler = (context, event, callback) => {


 // Create a Sync Grant for a particular Sync service, or use the default one


 const syncGrant = new SyncGrant({


   serviceSid: context.TWILIO_SYNC_SERVICE_SID || 'default',


 });





 // Create an access token which we will sign and return to the client,


 // containing the grant we just created


 // Use environment variables via `context` to keep your credentials secure


 const token = new AccessToken(


   context.ACCOUNT_SID,


   context.TWILIO_API_KEY,


   context.TWILIO_API_SECRET,


   { identity: 'example' }


 );





 token.addGrant(syncGrant);





 // Return two pieces of information: the name of the sync list so it can


 // be referenced by the client, and the JWT form of the access token


 const response = {


   syncListName: context.SYNC_LIST_NAME || 'serverless-sync-demo',


   token: token.toJwt(),


 };





 return callback(null, response);


};
(information)
Info
The examples in this app leverage Environment Variables to share common strings, such as the Service SID and Sync List name, but the samples will work if you don't define your own.
However, you must define, at a minimum, an API Key and API Secret. Your Account SID should already be in your Environmental Variables by default, regardless of whether you're building in the Console or with the Serverless Toolkit.

Append new SMS messages to a Sync List
The next important feature of this application is being able to push the contents of incoming texts to the Sync List, so they can render in real-time in the browser. To do this, create a new Function, and name it handle-sms. Type or copy the contents of the following code sample into the handle-sms Function, and save.
This Function works by leveraging the built-in Runtime.getSync method to bootstrap a Sync Client for you. It then verifies that the Sync List is available, appends the body of the incoming message (event.Body) to the list, and returns an SMS to the sender acknowledging receipt of their text.
Append new SMS messages to a Sync List
Copy code block
exports.handler = async (context, event, callback) => {


 // Make sure the necessary Sync names are defined.


 const syncServiceSid = context.TWILIO_SYNC_SERVICE_SID || 'default';


 const syncListName = context.SYNC_LIST_NAME || 'serverless-sync-demo';


 // You can quickly access a Twilio Sync client via Runtime.getSync()


 const syncClient = Runtime.getSync({ serviceName: syncServiceSid });


 const twiml = new Twilio.twiml.MessagingResponse();





 // Destructure the incoming text message and rename it to `message`


 const { Body: message } = event;





 try {


   // Ensure that the Sync List exists before we try to add a new message to it


   await getOrCreateResource(syncClient.lists, syncListName);


   // Append the incoming message to the list


   await syncClient.lists(syncListName).syncListItems.create({


     data: {


       message,


     },


   });


   // Send a response back to the user to let them know the message was received


   twiml.message('SMS received and added to the list! 🚀');


   return callback(null, twiml);


 } catch (error) {


   // Persist the error to your logs so you can debug


   console.error(error);


   // Send a response back to the user to let them know something went wrong


   twiml.message('Something went wrong with adding your message 😔');


   return callback(null, twiml);


 }


};





// Helper method to simplify getting a Sync resource (Document, List, or Map)


// that handles the case where it may not exist yet.


const getOrCreateResource = async (resource, name, options = {}) => {


 try {


   // Does this resource (Sync Document, List, or Map) exist already? Return it


   return await resource(name).fetch();


 } catch (err) {


   // It doesn't exist, create a new one with the given name and return it


   options.uniqueName = name;


   return resource.create(options);


 }


};

Host the web client
With the necessary Functions in place, it's time to create the front-end of this web application.
ConsoleServerless Toolkit
If you're following this example in the Twilio Console:
Create a file named index.html on your computer.
Copy the following HTML example code into the new index.html file, and save the file.
Upload index.html as a public Asset. You can do so by clicking Add+, selecting Upload File and finding index.html in the upload prompt, setting the visibility as Public, and then finally clicking Upload.
HTML for the web client
Copy code block
<!DOCTYPE html>


<html lang="en">


 <head>


   <meta charset="UTF-8" />


   <meta name="viewport" content="width=device-width, initial-scale=1.0" />


   <meta http-equiv="X-UA-Compatible" content="ie=edge" />


   <title>Runtime + Sync = 🚀!</title>


 </head>


 <body>


   <main>


     <h1>Ahoy there!</h1>


     <p>This is an example of a simple web app hosted by Twilio Runtime.</p>


     <p>


       It fetches a Sync access token from a serverless Twilio Function,


       renders any existing messages from a Sync List, and displays incoming


       messages as you text them to your Twilio phone number.


     </p>


     <h2>Messages:</h2>


     <div id="loading-message">Loading Messages...</div>


     <ul id="messages-list" />


   </main>


   <footer>


     <p>


       Made with 💖 by your friends at


       <a href="https://www.twilio.com">Twilio</a>


     </p>


   </footer>


 </body>


 <script


   type="text/javascript"


   src="//media.twiliocdn.com/sdk/js/sync/v3.0/twilio-sync.min.js"


 ></script>


 <script>


   window.addEventListener('load', async () => {


     const messagesList = document.getElementById('messages-list');


     const loadingMessage = document.getElementById('loading-message');





     try {


       // Get the Sync access token and list name from the serverless function


       const { syncListName, token } = await fetch('/access').then((res) =>


         res.json()


       );


       const syncClient = new Twilio.Sync.Client(token);


       // Fetch a reference to the messages Sync List


       const syncList = await syncClient.list(syncListName);


       // Get the most recent messages (if any) in the List


       const existingMessageItems = await syncList.getItems({ order: 'desc' });


       // Hide the loading message


       loadingMessage.style.display = 'none';


       // Render any existing messages to the page, remember to reverse the order


       // since they're fetched in descending order in this case


       messagesList.innerHTML = existingMessageItems.items


         .reverse()


         .map((item) => `<li>${item.data.message}</li>`)


         .join('');


       // Add an event listener to the List so that incoming messages can


       // be displayed in real-time


       syncList.on('itemAdded', ({ item }) => {


         console.log('Item added:', item);


         // Add the new message to the list by adding a new <li> element


         // containing the incoming message's text


         const newListItem = document.createElement('li');


         messagesList.appendChild(newListItem).innerText = item.data.message;


       });


     } catch (error) {


       console.error(error);


       loadingMessage.innerText = 'Unable to load messages 😭';


       loadingMessage.style.color = 'red';


       loadingMessage.style.fontWeight = 'bold';


     }


   });


 </script>


</html>
The magic here is primarily concentrated in the ul element and accompanying JavaScript. Once the window finishes loading, the script requests the Sync List name and Access Token from the access Function. Once the script has that token, it uses that token with the twilio-sync library
 to create a local Sync Client. With that Sync Client, the script then gets the latest messages, injects them into the ul as more list items, and sets up an event handler that appends new messages as soon as they come in.

Deploy the Service
Now is a good time to save and deploy this Service. Save all file changes, and click Deploy All if you're working from the Twilio Console, or run twilio serverless:deploy from your project's CLI if you're following along with the Serverless Toolkit.
Once you have deployed your code, you could visit the web page, but, sadly, there will be no messages to show yet. We'll address that issue in the next section.

Connect handle-sms to a Twilio Phone Number
To complete this app, you will need to connect the handle-sms Function to one of your Twilio Phone Numbers as a webhook. Follow the directions below, and configure handle-sms as the webhook for incoming messages to your Twilio Phone Number of choice.

Set a Function as a webhook
In order for your Function to react to incoming SMS and/or voice calls, it must be set as a webhook for your Twilio number. There are a variety of methods to set a Function as a webhook, as detailed below:
Twilio ConsoleTwilio CLITwilio SDKs
You can use the Twilio Console
 UI as a straightforward way of connecting your Function as a webhook:
Log in to the Twilio Console's Phone Numbers page
.
Click on the phone number you'd like to have connected to your Function.
If you want the Function to respond to incoming SMS, find the A Message Comes In option under Messaging. If you want the Function to respond to Voice, find the A Call Comes In option under Voice & Fax.
Select Function from the A Message Comes In or A Call Comes In dropdown.
Select the Service that you are using, then the Environment (this will default to ui unless you have created custom domains ), and finally Function Path of your Function from the respective dropdown menus.

Expand image
Alternatively, you could select Webhook instead of Function, and directly paste in the full URL of the Function.

Expand image
Click the Save button.

Test it out
All the pieces are now in place, so now is a great time to test out this application! Open up your app's web page by visiting its URL. This will be your service name, followed by index.html, for example:
Copy code block
https://sync-6475.twil.io/index.html
It should display no messages initially. However, if you send any text messages, they should pop into the messages list almost immediately. If you refresh the page, any previous messages should pop into view first, and new messages will continue adding to the end of the initial list.

Next steps
This app is functional, but its appearance is a little bare bone. It also doesn't handle the inevitable occurrence when the current user's Sync Token will expire after some time. To make this app look cleaner and more resilient to token expiration, add the following, highlighted updates to index.html.
Fully-featured web client HTML
Includes some styling and token refresh logic
Copy code block
<!DOCTYPE html>


<html lang="en">


 <head>


   <meta charset="UTF-8" />


   <meta name="viewport" content="width=device-width, initial-scale=1.0" />


   <meta http-equiv="X-UA-Compatible" content="ie=edge" />


   <title>Runtime + Sync = 🚀!</title>


   <style>


     body {


       font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI',


         Roboto, 'Helvetica Neue', Arial, sans-serif;


       color: #0d122b;


       border-top: 5px solid #f22f46;


     }


     main {


       max-width: 800px;


       margin: 0 auto;


     }


     a {


       color: #008cff;


     }


     footer {


       margin: 0 auto;


       max-width: 800px;


       text-align: center;


     }


     footer p {


       border-top: 1px solid rgba(148, 151, 155, 0.2);


       padding-top: 2em;


       margin: 0 2em;


     }


   </style>


 </head>


 <body>


   <main>


     <h1>Ahoy there!</h1>


     <p>This is an example of a simple web app hosted by Twilio Runtime.</p>


     <p>


       It fetches a Sync access token from a serverless Twilio Function,


       renders any existing messages from a Sync List, and displays incoming


       messages as you text them to your Twilio phone number.


     </p>


     <h2>Messages:</h2>


     <div id="loading-message">Loading Messages...</div>


     <ul id="messages-list" />


   </main>


   <footer>


     <p>


       Made with 💖 by your friends at


       <a href="https://www.twilio.com">Twilio</a>


     </p>


   </footer>


 </body>


 <script


   type="text/javascript"


   src="//media.twiliocdn.com/sdk/js/sync/v3.0/twilio-sync.min.js"


 ></script>


 <script>


   window.addEventListener('load', async () => {


     const messagesList = document.getElementById('messages-list');


     const loadingMessage = document.getElementById('loading-message');





     try {


       // Get the Sync access token and list name from the serverless function


       const { syncListName, token } = await fetch('/access').then((res) =>


         res.json()


       );


       const syncClient = new Twilio.Sync.Client(token);


       // Fetch a reference to the messages Sync List


       const syncList = await syncClient.list(syncListName);


       // Get the most recent messages (if any) in the List


       const existingMessageItems = await syncList.getItems({ order: 'desc' });


       // Hide the loading message


       loadingMessage.style.display = 'none';


       // Render any existing messages to the page, remember to reverse the order


       // since they're fetched in descending order in this case


       messagesList.innerHTML = existingMessageItems.items


         .reverse()


         .map((item) => `<li>${item.data.message}</li>`)


         .join('');


       // Add an event listener to the List so that incoming messages can


       // be displayed in real-time


       syncList.on('itemAdded', ({ item }) => {


         console.log('Item added:', item);


         // Add the new message to the list by adding a new <li> element


         // containing the incoming message's text


         const newListItem = document.createElement('li');


         messagesList.appendChild(newListItem).innerText = item.data.message;


       });





       // Make sure to refresh the access token before it expires for an uninterrupted experience! 


       syncClient.on('tokenAboutToExpire', async () => {


         try {


           // Refresh the access token and update the Sync client


           const refreshAccess = await fetch('/access').then((res) =>


             res.json()


           );


           syncClient.updateToken(refreshAccess.token);


         } catch (error) {


           console.error(error);


           loadingMessage.innerText =


             'Unable to refresh access to messages 😭, try reloading your page!';


           loadingMessage.style.color = 'red';


           loadingMessage.style.fontWeight = 'bold';


         }


       });


     } catch (error) {


       console.error(error);


       loadingMessage.innerText = 'Unable to load messages 😭';


       loadingMessage.style.color = 'red';


       loadingMessage.style.fontWeight = 'bold';


     }


   });


 </script>


</html>
(information)
Info
If you want the ability for users to visit the app at the root URL instead of needing to specify /index.html at the end, such as just https://sync-6475.twil.io/, host index.html as a Root Asset and re-deploy!

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Handle real-time data with Twilio Sync | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Create and host a Function
Configure your Function to require Basic Authentication
Verify that Basic Authentication is working
Protect your Function with Basic Auth

(warning)
Warning
This example uses headers and cookies, which are only accessible when your Function is running @twilio/runtime-handler version 1.2.0 or later. Consult the Runtime Handler guide to learn more about the latest version and how to update.
When protecting your public Functions, and any sensitive data that they can expose, from unwanted requests and bad actors, it is important to consider some form of authentication
 to validate that only intended users are making requests. In this example, we'll be covering one of the most common forms of authentication: Basic Authentication.
If you want to learn an alternative approach, you can also see this example of using JWT for authentication.
Let's create a Function that will only accept requests with valid Basic Authentication, and reject all other traffic.

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
If you prefer a UI-driven approach, creating and deploying a Function can be done entirely using the Twilio Console and the following steps:
Log in to the Twilio Console and navigate to the Functions tab
. If you need an account, you can sign up for a free Twilio account here
!
Functions are contained within Services. Create a Service by clicking the Create Service
 button and providing a name such as test-function.
Once you've been redirected to the new Service, click the Add + button and select Add Function from the dropdown.
This will create a new Protected Function for you with the option to rename it. The name of the file will be path it is accessed from.
Copy any one of the example code snippets from this page that you want to experiment with, and paste the code into your newly created Function. You can quickly switch examples by using the dropdown menu of the code rail.
Click Save to save your Function's contents.
Click Deploy All to build and deploy the Function. After a short delay, your Function will be accessible from: https://<service-name>-<random-characters>-<optional-domain-suffix>.twil.io/<function-path>
For example: test-function-3548.twil.io/hello-world.
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!
Authenticate Function requests using Basic Authorization
Copy code block
exports.handler = (context, event, callback) => {


 // For the purpose of this example, we'll assume that the username and


 // password are hardcoded values. Feel free to set these as other values,


 // or better yet, use environment variables instead!


 const USERNAME = 'twilio';


 const PASSWORD = 'ahoy!';





 // Prepare a new Twilio response for the incoming request


 const response = new Twilio.Response();


 // Grab the standard HTTP Authorization header


 const authHeader = event.request.headers.authorization;





 // Reject requests that don't have an Authorization header


 if (!authHeader) return callback(null, setUnauthorized(response));





 // The auth type and credentials are separated by a space, split them


 const [authType, credentials] = authHeader.split(' ');


 // If the auth type doesn't match Basic, reject the request


 if (authType.toLowerCase() !== 'basic')


   return callback(null, setUnauthorized(response));





 // The credentials are a base64 encoded string of 'username:password',


 // decode and split them back into the username and password


 const [username, password] = Buffer.from(credentials, 'base64')


   .toString()


   .split(':');


 // If the username or password don't match the expected values, reject


 if (username !== USERNAME || password !== PASSWORD)


   return callback(null, setUnauthorized(response));





 // If we've made it this far, the request is authorized!


 // At this point, you could do whatever you want with the request.


 // For this example, we'll just return a 200 OK response.


 return callback(null, 'OK');


};





// Helper method to format the response as a 401 Unauthorized response


// with the appropriate headers and values


const setUnauthorized = (response) => {


 response


   .setBody('Unauthorized')


   .setStatusCode(401)


   .appendHeader(


     'WWW-Authenticate',


     'Basic realm="Authentication Required"'


   );





 return response;


};

Configure your Function to require Basic Authentication
First, create a new auth Service and add a Public /basic Function using the directions above.
Delete the default contents of the Function, and paste in the code snippet provided above.
Save the Function once it contains the new code.
(information)
Info
Remember to change the visibility of your new Function to be Public. By default, the Console UI will create new Functions as Protected, which will prevent access to your Function except by Twilio requests.
Next, deploy the Function by clicking on Deploy All in the Console UI.

Verify that Basic Authentication is working
We can check that authentication is working first by sending an unauthenticated request to our deployed Function. You can get the URL of your Function by clicking the Copy URL button next to the Function.
Then, using your client of choice, make a GET or POST request to your Function. It should return a 401 Unauthorized since the request contains no valid Authorization header.
Copy code block
curl -i -L -X POST 'https://auth-4173-dev.twil.io/basic'
Result:
Copy code block
$ curl -i -L -X POST 'https://auth-4173-dev.twil.io/basic'





HTTP/2 401


date: Tue, 03 Aug 2021 21:55:02 GMT


content-type: application/octet-stream


content-length: 12


www-authenticate: Basic realm="Authentication Required"


x-shenanigans: none





Unauthorized
Great! Requests are successfully being blocked from non-authenticated requests.
To make an authenticated request and get back a 200 OK, we'll need to generate and send a request with the example username and password encoded as the Authorization header credentials. Leverage one of the following methods to encode your Credentials:
Browser Dev ToolsNode.js REPL
First, open your browser's developer tools
. Navigate to the Console tab, where you'll be able to execute the following JavaScript in the browser to generate your encoded credentials:
Copy code block
btoa("<username>:<password>");
The btoa method
 is a built-in browser method for conveniently converting a string to base64 encoding.
For example, with our example credentials, you would input the following into the browser console and get this result:
Copy code block
btoa("twilio:ahoy!")


> "dHdpbGlvOmFob3kh"
Now that you have your encoded credentials, it's time to make an authenticated request to your Function by including them in the Authentication header.
Using cURL with our example credentials would look like this:
Copy code block
curl -i -L -X POST 'https://auth-4173-dev.twil.io/basic' \


-H 'Authorization: Basic dHdpbGlvOmFob3kh'


and the response would be:
Copy code block
$ curl -i -L -X POST 'https://auth-4173-dev.twil.io/basic' \


-H 'Authorization: Basic dHdpbGlvOmFob3kh'





HTTP/2 200


date: Tue, 03 Aug 2021 22:15:37 GMT


content-type: text/plain; charset=utf8


content-length: 2


x-shenanigans: none


x-content-type-options: nosniff


x-xss-protection: 1; mode=block





OK
At this point, Basic Authentication is now working for your Function!
To make this example your own, you could experiment with:
Instead of defining the username and password directly in your Function's code, define other secure values and store them securely as Environment Variables. You could then access them using context.USERNAME and context.PASSWORD respectively, for example.
Take things a bit further and establish a database of authenticated users with hashed passwords. Once you've retrieved the decoded username and password from the Authorization header, perform a lookup of the user by username and validate their password using a library such as bcrypt
. Your hashing secret can be a secure Environment Variable.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Protect your Function with Basic Auth | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Create and host a Function
Configure your Function to require Bearer Authentication
Verify that Bearer Authentication is working
Protect your Function with JSON Web Token

(warning)
Warning
This example uses headers and cookies, which are only accessible when your Function is running @twilio/runtime-handler version 1.2.0 or later. Consult the Runtime Handler guide to learn more about the latest version and how to update.
When protecting your public Functions and any sensitive data that they can expose, from unwanted requests and bad actors, it is important to consider some form of authentication
 to validate that only intended users are making requests. In this example, we'll be covering one of the most common forms of authentication: Bearer Authentication
 using JSON Web Token (JWT)
.
If you want to learn an alternative approach, you can also see this example of using Basic Auth.
Let's create a Function that will only accept requests with valid JWTs, and reject all other traffic.

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
If you prefer a UI-driven approach, creating and deploying a Function can be done entirely using the Twilio Console and the following steps:
Log in to the Twilio Console and navigate to the Functions tab
. If you need an account, you can sign up for a free Twilio account here
!
Functions are contained within Services. Create a Service by clicking the Create Service
 button and providing a name such as test-function.
Once you've been redirected to the new Service, click the Add + button and select Add Function from the dropdown.
This will create a new Protected Function for you with the option to rename it. The name of the file will be path it is accessed from.
Copy any one of the example code snippets from this page that you want to experiment with, and paste the code into your newly created Function. You can quickly switch examples by using the dropdown menu of the code rail.
Click Save to save your Function's contents.
Click Deploy All to build and deploy the Function. After a short delay, your Function will be accessible from: https://<service-name>-<random-characters>-<optional-domain-suffix>.twil.io/<function-path>
For example: test-function-3548.twil.io/hello-world.
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!

Configure your Function to require Bearer Authentication
First, create a new auth Service and add two Public Functions using the directions above. These will be named:
/jwt
/bearer
Replace the default contents of each Function with the JWT generation code (Generate a JSON Web Token for Function Authentication) for /jwt, and the JWT validation snippet (Authenticate Function requests using Bearer Authorization and JWT) for /bearer respectively. Save both Functions once they contain the new code.
Generate a JSON Web Token for Function Authentication
Copy code block
const jwt = require('jsonwebtoken');





// Hardcoded credentials for this example


const creds = {


 username: 'twilio',


 password: 'ahoy',


};


// Hardcoded secret for this example. In a real app, you would


// generate this and store it securely as an environment variable


// and access it via context.SECRET or similar


const secret = 'secret_key';





// Function to generate a JWT token


exports.handler = (context, event, callback) => {


 // Retrieve the username and password from the request


 const { username, password } = event;


 // Prepare a new Twilio response


 const response = new Twilio.Response();





 // If the provided credentials are invalid, return 401 Unauthorized.


 // In a real app you would check the credentials against your database.


 if (username !== creds.username || password !== creds.password) {


   response


     .setBody('Username or password is incorrect')


     .setStatusCode(401);





   return callback(null, response);


 }





 // Create a new signed JWT for the user that will expire in 1 day.


 // To understand more about JWT and what sub, iss, and these


 // other options are, see https://jwt.io/


 const token = jwt.sign(


   {


     sub: username,


     iss: 'twil.io',


     org: 'twilio',


     perms: ['read'],


   },


   secret,


   { expiresIn: '1d' }


 );





 // Set the token as the access_token header and return the response


 response.setBody('OK').appendHeader('access_token', token);





 return callback(null, response);


};
Authenticate Function requests using Bearer Authorization and JWT
Copy code block
const jwt = require('jsonwebtoken');





const employeeSalaries = [


 {


   username: 'jdoe',


   salary: '$2000.00',


 },


 {


   username: 'mturner',


   salary: '$2500.00',


 },


];


const secret = 'secret_key'; // keep this in env variables





// Function that exposes sensitive information and requires


// a valid JWT token to be present in the request header to access.


exports.handler = (context, event, callback) => {


 // Grab the auth token from the request header


 const authHeader = event.request.headers.authorization;


 // Prepare a new Twilio response


 const response = new Twilio.Response();


 // Reject requests that don't have an Authorization header


 if (!authHeader) return callback(null, setUnauthorized(response));





 // The auth type and token are separated by a space, split them


 const [authType, authToken] = authHeader.split(' ');


 // If the auth type is not Bearer, return a 401 Unauthorized response


 if (authType.toLowerCase() !== 'bearer')


   return callback(null, setUnauthorized(response));





 try {


   // Verify the token against the secret. If the token is invalid,


   // jwt.verify will throw an error and we'll proceed to the catch block


   jwt.verify(authToken, secret);


   // At this point, the request has been validated and you could do


   // whatever you want with the request.


   // For this example, we'll just return the employee salaries


   return callback(null, employeeSalaries);


 } catch (e) {


   // If an error was thrown, the token is invalid and we should


   // return a 401 Unauthorized response


   return callback(null, setUnauthorized(response));


 }


};





// Helper method to format the response as a 401 Unauthorized response


// with the appropriate headers and values


const setUnauthorized = (response) => {


 response


   .setBody('Unauthorized')


   .setStatusCode(401)


   .appendHeader(


     'WWW-Authenticate',


     'Bearer realm="Access to read salaries"'


   );





 return response;


};
(information)
Info
Remember to change the visibility of your new Function to be Public. By default, the Console UI will create new Functions as Protected, which will prevent access to your Function except by Twilio requests.
Next, notice that the code snippets require the jsonwebtoken
 dependency. Be sure to add this as a Dependency to your Service.
Once all Functions have been saved and your Dependencies have been set, deploy the Function by clicking on Deploy All in the Console UI.

Verify that Bearer Authentication is working
We can check that authentication is working first by sending an unauthenticated request to our deployed Function. You can get the URL of your Function by clicking the Copy URL button next to the Function.
Then, using your client of choice, make a GET or POST request to your Function. It should return a 401 Unauthorized since the request contains no valid Authorization header.
Copy code block
curl -i -L -X POST 'https://auth-4173-dev.twil.io/bearer'
Result:
Copy code block
$ curl -i -L -X POST 'https://auth-4173-dev.twil.io/bearer' -i





HTTP/2 401


date: Tue, 03 Aug 2021 23:01:55 GMT


content-type: application/octet-stream


content-length: 12


www-authenticate: Bearer realm="Access to read salaries"


x-shenanigans: none





Unauthorized
Great! Requests are successfully being blocked from non-authenticated requests.
To make an authenticated request and get back a 200 OK, we'll need to first generate a valid JWT by calling /jwt. We can then include that token in the Authorization header of our request to /bearer.
To get a valid JWT, we'll need to submit a valid username and password to the /jwt Function. Right now, these are hardcoded in the Function as twilio and ahoy respectively. The JWT generator Function is expecting the username and password to be passed in the body of the request, so you'll need to create a POST request with a JSON body composed of those values. Using cURL, that would look like this:
Copy code block
curl -i -L -X POST 'https://auth-4173-dev.twil.io/jwt' \


-H 'Content-Type: application/json' \


--data-raw '{


   "username": "twilio",


   "password": "ahoy"


}'
and the response would be:
Copy code block
$ curl -i -L -X POST 'https://auth-4173-dev.twil.io/jwt' \


-H 'Content-Type: application/json' \


--data-raw '{


   "username": "twilio",


   "password": "ahoy"


}'





HTTP/2 200


date: Tue, 03 Aug 2021 23:16:35 GMT


content-type: application/octet-stream


content-length: 2


access_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0d2lsaW8iLCJpc3MiOiJ0d2lsLmlvIiwib3JnIjoidHdpbGlvIiwicGVybXMiOlsicmVhZCJdLCJpYXQiOjE2MjgwMzI1OTUsImV4cCI6MTYyODExODk5NX0.uZzHuN5PpK6qM5wCu01_S8lkFPDpIcxQJq6A7sDr6gc


x-shenanigans: none


x-content-type-options: nosniff


x-xss-protection: 1; mode=block





OK
The header access_token contains the valid JWT that was just generated for us. Go ahead and try your request to /bearer again, but this time including the Authorization header including this JWT:
Copy code block
curl -i -L -X POST 'https://auth-4173-dev.twil.io/bearer' \


-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0d2lsaW8iLCJpc3MiOiJ0d2lsLmlvIiwib3JnIjoidHdpbGlvIiwicGVybXMiOlsicmVhZCJdLCJpYXQiOjE2MjgwMzA3ODIsImV4cCI6MTYyODExNzE4Mn0.gBusSFmlRt_o3H3E2UB4GGxjbZJLOOS0bKFXTxAgnlw'
the response should be:
Copy code block
$ curl -i -L -X POST 'https://auth-4173-dev.twil.io/bearer' \


-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0d2lsaW8iLCJpc3MiOiJ0d2lsLmlvIiwib3JnIjoidHdpbGlvIiwicGVybXMiOlsicmVhZCJdLCJpYXQiOjE2MjgwMzA3ODIsImV4cCI6MTYyODExNzE4Mn0.gBusSFmlRt_o3H3E2UB4GGxjbZJLOOS0bKFXTxAgnlw'





HTTP/2 200


date: Tue, 03 Aug 2021 23:20:10 GMT


content-type: application/json


content-length: 84


x-shenanigans: none


x-content-type-options: nosniff


x-xss-protection: 1; mode=block





[{"username":"jdoe","salary":"$2000.00"},{"username":"mturner","salary":"$2500.00"}]
At this point, Bearer Authentication is working for your Function!
To make this example your own, you could experiment with the following:
Refactor the common 'secret_key' into an Environment Variable so that it is stored securely and only needs to be changed in one place.
Use Environment Variables to store the approved credentials, or even create a database of approved usernames and passwords to support multiple users.
Instead of using a hardcoded array of data, retrieve values from a database.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Protect your Function with JSON Web Token | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Create and host a Function
Store application state in a cookie
Set a Function as a webhook
Validate that it works
Set state attributes
Remove or reset state
Validate state reset
Manage application state with cookies

Due to the ephemeral nature of Functions, application state for purely serverless apps has previously been difficult to manage, or required storing such information in a remote database. Luckily, with access to cookies with Runtime Handler version 1.2.1 and later, you can now maintain limited state in your apps through cookies!
Let's create a Function named state that leverages per-phone number cookies to store some application state, just like you would with a more traditional, server-based solution! Use the following directions to create a Service and your state Function:

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
If you prefer a UI-driven approach, creating and deploying a Function can be done entirely using the Twilio Console and the following steps:
Log in to the Twilio Console and navigate to the Functions tab
. If you need an account, you can sign up for a free Twilio account here
!
Functions are contained within Services. Create a Service by clicking the Create Service
 button and providing a name such as test-function.
Once you've been redirected to the new Service, click the Add + button and select Add Function from the dropdown.
This will create a new Protected Function for you with the option to rename it. The name of the file will be path it is accessed from.
Copy any one of the example code snippets from this page that you want to experiment with, and paste the code into your newly created Function. You can quickly switch examples by using the dropdown menu of the code rail.
Click Save to save your Function's contents.
Click Deploy All to build and deploy the Function. After a short delay, your Function will be accessible from: https://<service-name>-<random-characters>-<optional-domain-suffix>.twil.io/<function-path>
For example: test-function-3548.twil.io/hello-world.
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!

Store application state in a cookie
Now that you have your state Function, copy over the following code sample, save the Function, and deploy your Service.
Add counter state to an SMS response
Copy code block
exports.handler = (context, event, callback) => {


 // Initialize a new Response and some TwiML


 const response = new Twilio.Response();


 const twiml = new Twilio.twiml.MessagingResponse();





 // Cookies are accessed by name from the event.request.cookies object


 // If the user doesn't have a count yet, initialize it to zero. Cookies are


 // always strings, so you'll need to convert the count to a number


 const count = Number(event.request.cookies.count) || 0;





 // Return a dynamic message based on if this is the first message or not


 const message =


   count > 0


     ? `Your current count is ${count}`


     : 'Hello, thanks for the new message!';





 twiml.message(message);





 response


   // Add the stringified TwiML to the response body


   .setBody(twiml.toString())


   // Since we're returning TwiML, the content type must be XML


   .appendHeader('Content-Type', 'text/xml')


   // You can increment the count state for the next message, or any other


   // operation that makes sense for your application's needs. Remember


   // that cookies are always stored as strings


   .setCookie('count', (count + 1).toString());





 return callback(null, response);


};
For Twilio SMS, cookies are scoped to the "conversation" between two parties — you can have a unique cookie for each To/From phone number pair. For example, you can store a unique cookie for any messages sent between 415-555-2222 (your number, for example) and 415-555-1111 (the phone number your Function is a webhook for), which will be different from the cookie used between 415-555-3333 and 415-555-1111.
The code here is accepting an incoming Message webhook request, and checking for an incoming cookie named count. If that cookie is not present, count is initialized to 0, the user message is formatted to indicate the start of a conversation, and the count is incremented then set as a cookie along with the response to the sender. If count is already present, its value is included in the message, incremented, and set so that subsequent messages can continue to store the ever-increasing value of count.
To test this and observe your stateless Function managing to track state with cookies, you'll need to set your deployed state Function as the webhook for your Twilio phone number, as shown next.
(warning)
Warning
Cookies created in this specific scenario
 (Twilio forwarding SMS messages to your Function or server) are limited to a maximum lifetime of four hours, so if a conversation remains idle for more than four hours, it will be automatically cleared. If you require longer-lasting state, you will need to store it in an external source such as a database.
In any other scenario, cookies set by your Function are only subject to the usual limitations.

Set a Function as a webhook
In order for your Function to react to incoming SMS and/or voice calls, it must be set as a webhook for your Twilio number. There are a variety of methods to set a Function as a webhook, as detailed below:
Twilio ConsoleTwilio CLITwilio SDKs
You can use the Twilio Console
 UI as a straightforward way of connecting your Function as a webhook:
Log in to the Twilio Console's Phone Numbers page
.
Click on the phone number you'd like to have connected to your Function.
If you want the Function to respond to incoming SMS, find the A Message Comes In option under Messaging. If you want the Function to respond to Voice, find the A Call Comes In option under Voice & Fax.
Select Function from the A Message Comes In or A Call Comes In dropdown.
Select the Service that you are using, then the Environment (this will default to ui unless you have created custom domains ), and finally Function Path of your Function from the respective dropdown menus.

Expand image
Alternatively, you could select Webhook instead of Function, and directly paste in the full URL of the Function.

Expand image
Click the Save button.

Validate that it works
Now that your Twilio phone number is directing incoming SMS messages to your Function, try sending a short message to your Twilio phone number.
You will receive an initial response of Hello, thanks for the new message!, and any subsequent messages you send will then receive a response of Your current count is 1, Your current count is 2, and so on.

Set state attributes
Cookies support several attributes
, which allow you to define aspects such as duration, security, and more. You can set these using the third parameter to setCookie. For example, given the existing call:
Copy code block
response.setCookie('count', (count + 1).toString());
You could modify the count cookie to last for a maximum of 30 minutes (1800 seconds) by setting the Max-Age attribute like so:
Copy code block
response.setCookie('count', (count + 1).toString(), ['Max-Age=1800']);

Remove or reset state
By default, session cookies persisted by Twilio SMS only last for four hours at most, and you cannot exceed this limit. However, it's perfectly valid to remove a cookie at any time to fit your application's needs.
For example, you could clear the count from the previous example once a condition is met, as shown in this sample:
Clear counter state from an SMS conversation
Copy code block
exports.handler = (context, event, callback) => {


 // Initialize a new Response and some TwiML


 const response = new Twilio.Response();


 const twiml = new Twilio.twiml.MessagingResponse();





 // Since we're returning TwiML, the content type must be XML


 response.appendHeader('Content-Type', 'text/xml');





 // Cookies are accessed by name from the event.request.cookies object


 // If the user doesn't have a count yet, initialize it to zero. Cookies are


 // always strings, so you'll need to convert the count to a number


 const count = Number(event.request.cookies.count) || 0;





 if (count > 5) {


   twiml.message("You've reached the end of the count!");


   // In this case we want to remove the count and let the user begin


   // a new conversation


   response.setBody(twiml.toString()).removeCookie('count');


   // Use an early return to respond to the user and avoid other logic paths


   return callback(null, response);


 }





 // Return a dynamic message based on if this is the first message or not


 const message =


   count > 0


     ? `Your current count is ${count}`


     : 'Hello, thanks for the new message! Message again to see your count update.';





 twiml.message(message);





 response.setBody(twiml.toString()).setCookie('count', (count + 1).toString());





 return callback(null, response);


};

Validate state reset
If you save and deploy this new code instead, you should have a very similar interaction with your Twilio phone number. After sending a message, you will receive an initial response, and any subsequent messages you send will then receive a response of Your current count is 1, Your current count is 2, and so on.
The difference is that after reaching a count of five and sending another message, you'll receive You've reached the end of the count!. If you try to message again, you'll find yourself in a completely new conversation. This is a handy way to end interactions, such as if your application has successfully helped a customer, or if your application is a game that the user has won or lost.
(warning)
Warning
These examples demonstrate adding a single state value as a cookie, but you are free to add more to support your application needs!
Keep in mind, there are limitations on how many cookies can be set, how large they can be, and how long they can persist until expiring.
(information)
Info
Curious about what else you can build by using cookies to add statefulness to your Functions? Check out this blog article to see how you can build your own Wordle clone purely with Functions and Assets!

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Manage application state with cookies | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Create and host a Function
Create your Function and connect it to SendGrid
Validate your code
Setup environment variables
Install the helper library
Add and verify a Sender Identity
Send a test email
Check your texts
Validate Webhook requests from SendGrid

(warning)
Warning
This example uses headers and cookies, which are only accessible when your Function is running @twilio/runtime-handler version 1.2.0 or later. Consult the Runtime Handler guide to learn more about the latest version and how to update.
Protecting your Twilio Functions from non-Twilio requests is usually just a matter of setting a Function's visibility to Protected. However, if you'd like to create a Function that's intended to only handle incoming Webhook requests from a product such as SendGrid
, validation will require some manual inspection of headers, which are now accessible!
In this example, we'll create a Function which will serve as the Event Webhook for your SendGrid account. The Function will validate if the incoming request came from SendGrid, and send a text message to a designated phone number if an email has been opened.

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
The Serverless Toolkit enables you with local development, project deployment, and other functionality via the Twilio CLI. To get up and running with these examples using Serverless Toolkit, follow this process:
From the CLI, run twilio serverless:init <your-service-name> --empty to bootstrap your local environment.
Navigate into your new project directory using cd <your-service-name>
In the /functions directory, create a new JavaScript file that is named respective to the purpose of the Function. For example, sms-reply.protected.js for a Protected Function intended to handle incoming SMS.
Populate the file using the code example of your choice and save. Note A Function can only export a single handler. You will want to create separate files if you want to run and/or deploy multiple examples at once.
Once your Function(s) code is written and saved, you can test it either by running it locally (and optionally tunneling requests to it via a tool like ngrok
), or by deploying the Function and executing against the deployed url(s).
Run your Function in local development
Run twilio serverless:start from your CLI to start the project locally. The Function(s) in your project will be accessible from http://localhost:3000/sms-reply
If you want to test a Function as a Twilio webhook, run: twilio phone-numbers:update <your Twilio phone number> --sms-url "http://localhost:3000/sms-reply"
This will automatically generate an ngrok tunnel from Twilio to your locally running Function, so you can start sending texts to it. You can apply the same process but with the voice-url flag instead if you want to test with Twilio Voice.
If your code does not connect to Twilio Voice/Messages as a webhook, you can start your dev server and start an ngrok tunnel in the same command with the ngrok flag. For example: twilio serverless:start --ngrok=""
Deploy your Function
To deploy your Function and have access to live url(s), run twilio serverless:deploy from your CLI. This will deploy your Function(s) to Twilio under a development environment by default, where they can be accessed from:
https://<service-name>-<random-characters>-dev.twil.io/<function-path>
For example: https://incoming-sms-examples-3421-dev.twil.io/sms-reply
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!
Validate Webhook requests from SendGrid
Copy code block
const { EventWebhook, EventWebhookHeader } = require('@sendgrid/eventwebhook');





// Helper method for validating SendGrid requests


const verifyRequest = (publicKey, payload, signature, timestamp) => {


 // Initialize a new SendGrid EventWebhook to expose helpful request


 // validation methods


 const eventWebhook = new EventWebhook();


 // Convert the public key string into an ECPublicKey


 const ecPublicKey = eventWebhook.convertPublicKeyToECDSA(publicKey);


 return eventWebhook.verifySignature(


   ecPublicKey,


   payload,


   signature,


   timestamp


 );


};





exports.handler = async (context, event, callback) => {


 // Access a pre-initialized Twilio client from context


 const twilioClient = context.getTwilioClient();


 // Access sensitive values such as the sendgrid key and phone numbers


 // from Environment Variables


 const publicKey = context.SENDGRID_WEBHOOK_PUBLIC_KEY;


 const twilioPhoneNumber = context.TWILIO_PHONE_NUMBER;


 const numberToNotify = context.NOTIFY_PHONE_NUMBER;





 // The SendGrid EventWebhookHeader provides methods for getting


 // the necessary header names.


 // Remember to cast these header names to lowercase to access them correctly


 const signatureKey = EventWebhookHeader.SIGNATURE().toLowerCase();


 const timestampKey = EventWebhookHeader.TIMESTAMP().toLowerCase();





 // Retrieve SendGrid's headers so they can be used to validate


 // the request


 const signature = event.request.headers[signatureKey];


 const timestamp = event.request.headers[timestampKey];





 // Runtime injects the request object and spreads in the SendGrid events.


 // Isolate the original SendGrid event contents using destructuring


 // and the rest operator


 const { request, ...sendGridEvents } = event;


 // Convert the SendGrid event back into an array of events, which is the


 // format sent by SendGrid initially


 const sendGridPayload = Object.values(sendGridEvents);





 // Stringify the event and add newlines/carriage returns since they're expected by validator


 const rawEvent =


   JSON.stringify(sendGridPayload).split('},{').join('},\r\n{') + '\r\n';





 // Verify the request using the public key, the body of the request,


 // and the SendGrid headers


 const valid = verifyRequest(publicKey, rawEvent, signature, timestamp);


 // Reject invalidated requests!


 if (!valid) return callback("Request didn't come from SendGrid", event);





 // Helper method to simplify repeated calls to send messages with


 // nicely formatted timestamps


 const sendSMSNotification = (recipientEmail, timestamp) => {


   const formattedDateTime = new Intl.DateTimeFormat('en-US', {


     year: 'numeric',


     month: 'numeric',


     day: 'numeric',


     hour: 'numeric',


     minute: 'numeric',


     second: 'numeric',


     hour12: true,


     timeZone: 'America/Los_Angeles',


   }).format(timestamp);





   return twilioClient.messages.create({


     from: twilioPhoneNumber,


     to: numberToNotify,


     body: `Email to ${recipientEmail} was opened on ${formattedDateTime}.`,


   });


 };





 // Convert the original list of events into a condensed version for SMS


 const normalizedEvents = sendGridPayload


   .map((rawEvent) => ({


     to: rawEvent.email,


     timestamp: rawEvent.timestamp * 1000,


     status: rawEvent.event,


     messageId: rawEvent.sg_message_id.split('.')[0],


   }))


   // Ensure that events are sorted by time to ensure they're sent


   // in the correct order


   .sort((a, b) => a.timestamp - b.timestamp);





 // Iterate over each event and wait for a text to be sent before


 // processing the next event


 for (const event of normalizedEvents) {


   // You could also await an async operation to update your db records to


   // reflect the status change here


   // await db.updateEmailStatus(event.messageId, event.status, event.timestamp);


   if (event.status === 'open') {


     await sendSMSNotification(event.to, event.timestamp);


   }


 }





 // Return a 200 OK!


 return callback();


};

Create your Function and connect it to SendGrid
First, create a new sendgrid-email Service and add a Public /events/email Function. Delete the default contents of the Function, and paste in the code snippet provided on this page.
Create a free SendGrid account
.
Follow the instructions here
 to set up a SendGrid Event Webhook. Paste the URL of your newly created Function as the unique URL for the Event Webhook. (it will look like https://sendgrid-email-5877.twil.io/events/email)

Expand image
Follow these steps
 to enable the Signed Event Webhook Requests. This will add signed SendGrid headers to incoming webhook requests, which we can then use to validate requests!

Expand image
Copy the generated Verification Key from the last step, and save it as an Environment variable in Runtime as SENDGRID_WEBHOOK_PUBLIC_KEY. While here, also save your TWILIO_PHONE_NUMBER (from the Twilio console) and a NOTIFY_PHONE_NUMBER (this could be your personal phone number for now)

Expand image
Add the @sendgrid/eventwebhook dependency as *, and ensure that the @twilio/runtime-handler dependency is set to version 1.3.0 or later to enable headers.

Expand image
Save your Function and deploy it by clicking on Deploy All.

Expand image

Validate your code
Now that you've deployed your Function, it's time to validate that your code and its integration with SendGrid is working properly. In order to do so, you'll need to generate some email events. This will be accomplished with a short script written in JavaScript and using the @sendgrid/mail library.
Setup environment variables
First, grab your SendGrid API Key
 (or create one!). For security, we'll be setting it as an environment variable and using it in our code instead of directly hard-coding it. You can do so by performing the following commands in your terminal, making sure to replace the YOUR_API_KEY placeholder with your own key.
Copy code block
echo "export SENDGRID_API_KEY='YOUR_API_KEY'" > sendgrid.env


echo "sendgrid.env" >> .gitignore


source ./sendgrid.env
Install the helper library
Next, use npm
 or yarn to install the Node.js SendGrid helper library which will enable you to send emails using JavaScript. If you already have Node.js
 installed, it's very likely you already have npm available and ready to use.
Copy code block
npm install --save @sendgrid/mail
If you prefer yarn
 instead:
Copy code block
yarn add @sendgrid/mail
Add and verify a Sender Identity
Before you can successfully send an email, you'll need to verify an email address or domain in the Sender Authentication tab
. Without this, you will receive a 403 Forbidden response when attempting to send mail.
Send a test email
Once you have prepared your environment variables, installed the SendGrid helper library, and your email has been validated, you're ready to send some emails and create some events.
Create a new file such as send-email.js, and paste in the following snippet. Be sure to replace the from variable with your verified email address from earlier, as well as the to variable (in this case, you can use your verified email address here as well). Save the file.
Copy code block
// Using Twilio SendGrid's v3 Node.js Library


// https://github.com/sendgrid/sendgrid-nodejs


const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);





sgMail


 .send({


   from: 'test@example.com', // Change to your verified sender


   to: 'test@example.com', // Change to your recipient


   subject: 'Sending with Twilio SendGrid is Fun',


   text: 'and easy to do anywhere, even with Node.js',


   html: '<strong>and easy to do anywhere, even with Node.js</strong>',


 })


 .then(() => {


   console.log('Email sent');


 })


 .catch((error) => {


   console.error(error);


 });
Once the script is saved, you can send your test email by executing the script with Node.js:
Copy code block
node send-email.js
Check your texts
Once you've received your email and opened it, you should receive a text message from your Function a short time later!
If you would like to expedite this process a bit and not wait for the open event itself, you could modify line 95 of the Function body to instead check for delivered events instead. A delivered event will be emitted and processed by your Function almost immediately after executing the send-email script.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Validate Webhook requests from SendGrid | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Create and host a Function
Create your Function and connect it to SendGrid
Validate your code
Setup environment variables
Install the helper library
Add and verify a Sender Identity
Send a test email
Check your texts
Validate Webhook requests from SendGrid

(warning)
Warning
This example uses headers and cookies, which are only accessible when your Function is running @twilio/runtime-handler version 1.2.0 or later. Consult the Runtime Handler guide to learn more about the latest version and how to update.
Protecting your Twilio Functions from non-Twilio requests is usually just a matter of setting a Function's visibility to Protected. However, if you'd like to create a Function that's intended to only handle incoming Webhook requests from a product such as SendGrid
, validation will require some manual inspection of headers, which are now accessible!
In this example, we'll create a Function which will serve as the Event Webhook for your SendGrid account. The Function will validate if the incoming request came from SendGrid, and send a text message to a designated phone number if an email has been opened.

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
If you prefer a UI-driven approach, creating and deploying a Function can be done entirely using the Twilio Console and the following steps:
Log in to the Twilio Console and navigate to the Functions tab
. If you need an account, you can sign up for a free Twilio account here
!
Functions are contained within Services. Create a Service by clicking the Create Service
 button and providing a name such as test-function.
Once you've been redirected to the new Service, click the Add + button and select Add Function from the dropdown.
This will create a new Protected Function for you with the option to rename it. The name of the file will be path it is accessed from.
Copy any one of the example code snippets from this page that you want to experiment with, and paste the code into your newly created Function. You can quickly switch examples by using the dropdown menu of the code rail.
Click Save to save your Function's contents.
Click Deploy All to build and deploy the Function. After a short delay, your Function will be accessible from: https://<service-name>-<random-characters>-<optional-domain-suffix>.twil.io/<function-path>
For example: test-function-3548.twil.io/hello-world.
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!
Validate Webhook requests from SendGrid
Copy code block
const { EventWebhook, EventWebhookHeader } = require('@sendgrid/eventwebhook');





// Helper method for validating SendGrid requests


const verifyRequest = (publicKey, payload, signature, timestamp) => {


 // Initialize a new SendGrid EventWebhook to expose helpful request


 // validation methods


 const eventWebhook = new EventWebhook();


 // Convert the public key string into an ECPublicKey


 const ecPublicKey = eventWebhook.convertPublicKeyToECDSA(publicKey);


 return eventWebhook.verifySignature(


   ecPublicKey,


   payload,


   signature,


   timestamp


 );


};





exports.handler = async (context, event, callback) => {


 // Access a pre-initialized Twilio client from context


 const twilioClient = context.getTwilioClient();


 // Access sensitive values such as the sendgrid key and phone numbers


 // from Environment Variables


 const publicKey = context.SENDGRID_WEBHOOK_PUBLIC_KEY;


 const twilioPhoneNumber = context.TWILIO_PHONE_NUMBER;


 const numberToNotify = context.NOTIFY_PHONE_NUMBER;





 // The SendGrid EventWebhookHeader provides methods for getting


 // the necessary header names.


 // Remember to cast these header names to lowercase to access them correctly


 const signatureKey = EventWebhookHeader.SIGNATURE().toLowerCase();


 const timestampKey = EventWebhookHeader.TIMESTAMP().toLowerCase();





 // Retrieve SendGrid's headers so they can be used to validate


 // the request


 const signature = event.request.headers[signatureKey];


 const timestamp = event.request.headers[timestampKey];





 // Runtime injects the request object and spreads in the SendGrid events.


 // Isolate the original SendGrid event contents using destructuring


 // and the rest operator


 const { request, ...sendGridEvents } = event;


 // Convert the SendGrid event back into an array of events, which is the


 // format sent by SendGrid initially


 const sendGridPayload = Object.values(sendGridEvents);





 // Stringify the event and add newlines/carriage returns since they're expected by validator


 const rawEvent =


   JSON.stringify(sendGridPayload).split('},{').join('},\r\n{') + '\r\n';





 // Verify the request using the public key, the body of the request,


 // and the SendGrid headers


 const valid = verifyRequest(publicKey, rawEvent, signature, timestamp);


 // Reject invalidated requests!


 if (!valid) return callback("Request didn't come from SendGrid", event);





 // Helper method to simplify repeated calls to send messages with


 // nicely formatted timestamps


 const sendSMSNotification = (recipientEmail, timestamp) => {


   const formattedDateTime = new Intl.DateTimeFormat('en-US', {


     year: 'numeric',


     month: 'numeric',


     day: 'numeric',


     hour: 'numeric',


     minute: 'numeric',


     second: 'numeric',


     hour12: true,


     timeZone: 'America/Los_Angeles',


   }).format(timestamp);





   return twilioClient.messages.create({


     from: twilioPhoneNumber,


     to: numberToNotify,


     body: `Email to ${recipientEmail} was opened on ${formattedDateTime}.`,


   });


 };





 // Convert the original list of events into a condensed version for SMS


 const normalizedEvents = sendGridPayload


   .map((rawEvent) => ({


     to: rawEvent.email,


     timestamp: rawEvent.timestamp * 1000,


     status: rawEvent.event,


     messageId: rawEvent.sg_message_id.split('.')[0],


   }))


   // Ensure that events are sorted by time to ensure they're sent


   // in the correct order


   .sort((a, b) => a.timestamp - b.timestamp);





 // Iterate over each event and wait for a text to be sent before


 // processing the next event


 for (const event of normalizedEvents) {


   // You could also await an async operation to update your db records to


   // reflect the status change here


   // await db.updateEmailStatus(event.messageId, event.status, event.timestamp);


   if (event.status === 'open') {


     await sendSMSNotification(event.to, event.timestamp);


   }


 }





 // Return a 200 OK!


 return callback();


};

Create your Function and connect it to SendGrid
First, create a new sendgrid-email Service and add a Public /events/email Function. Delete the default contents of the Function, and paste in the code snippet provided on this page.
Create a free SendGrid account
.
Follow the instructions here
 to set up a SendGrid Event Webhook. Paste the URL of your newly created Function as the unique URL for the Event Webhook. (it will look like https://sendgrid-email-5877.twil.io/events/email)

Expand image
Follow these steps
 to enable the Signed Event Webhook Requests. This will add signed SendGrid headers to incoming webhook requests, which we can then use to validate requests!

Expand image
Copy the generated Verification Key from the last step, and save it as an Environment variable in Runtime as SENDGRID_WEBHOOK_PUBLIC_KEY. While here, also save your TWILIO_PHONE_NUMBER (from the Twilio console) and a NOTIFY_PHONE_NUMBER (this could be your personal phone number for now)

Expand image
Add the @sendgrid/eventwebhook dependency as *, and ensure that the @twilio/runtime-handler dependency is set to version 1.3.0 or later to enable headers.

Expand image
Save your Function and deploy it by clicking on Deploy All.

Expand image

Validate your code
Now that you've deployed your Function, it's time to validate that your code and its integration with SendGrid is working properly. In order to do so, you'll need to generate some email events. This will be accomplished with a short script written in JavaScript and using the @sendgrid/mail library.
Setup environment variables
First, grab your SendGrid API Key
 (or create one!). For security, we'll be setting it as an environment variable and using it in our code instead of directly hard-coding it. You can do so by performing the following commands in your terminal, making sure to replace the YOUR_API_KEY placeholder with your own key.
Copy code block
echo "export SENDGRID_API_KEY='YOUR_API_KEY'" > sendgrid.env


echo "sendgrid.env" >> .gitignore


source ./sendgrid.env
Install the helper library
Next, use npm
 or yarn to install the Node.js SendGrid helper library which will enable you to send emails using JavaScript. If you already have Node.js
 installed, it's very likely you already have npm available and ready to use.
Copy code block
npm install --save @sendgrid/mail
If you prefer yarn
 instead:
Copy code block
yarn add @sendgrid/mail
Add and verify a Sender Identity
Before you can successfully send an email, you'll need to verify an email address or domain in the Sender Authentication tab
. Without this, you will receive a 403 Forbidden response when attempting to send mail.
Send a test email
Once you have prepared your environment variables, installed the SendGrid helper library, and your email has been validated, you're ready to send some emails and create some events.
Create a new file such as send-email.js, and paste in the following snippet. Be sure to replace the from variable with your verified email address from earlier, as well as the to variable (in this case, you can use your verified email address here as well). Save the file.
Copy code block
// Using Twilio SendGrid's v3 Node.js Library


// https://github.com/sendgrid/sendgrid-nodejs


const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);





sgMail


 .send({


   from: 'test@example.com', // Change to your verified sender


   to: 'test@example.com', // Change to your recipient


   subject: 'Sending with Twilio SendGrid is Fun',


   text: 'and easy to do anywhere, even with Node.js',


   html: '<strong>and easy to do anywhere, even with Node.js</strong>',


 })


 .then(() => {


   console.log('Email sent');


 })


 .catch((error) => {


   console.error(error);


 });
Once the script is saved, you can send your test email by executing the script with Node.js:
Copy code block
node send-email.js
Check your texts
Once you've received your email and opened it, you should receive a text message from your Function a short time later!
If you would like to expedite this process a bit and not wait for the open event itself, you could modify line 95 of the Function body to instead check for delivered events instead. A delivered event will be emitted and processed by your Function almost immediately after executing the send-email script.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Validate Webhook requests from SendGrid | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Create and host a Function
Enable CORS between Flex Plugins and Functions

(warning)
Warning
This example uses headers and cookies, which are only accessible when your Function is running @twilio/runtime-handler version 1.2.0 or later. Consult the Runtime Handler guide to learn more about the latest version and how to update.
A common use case is to call Functions from a Flex Plugin to retrieve external data such as statistics. Sometimes, this results in Cross-Origin Resource Sharing (CORS
) restrictions in production environments due to the different hostnames between the Flex Plugin and the Function being called.
Fortunately, CORS errors, in this context or other situations, can be addressed by leveraging the response headers of the Function to allow any Origin, as shown in the following example code.

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
If you prefer a UI-driven approach, creating and deploying a Function can be done entirely using the Twilio Console and the following steps:
Log in to the Twilio Console and navigate to the Functions tab
. If you need an account, you can sign up for a free Twilio account here
!
Functions are contained within Services. Create a Service by clicking the Create Service
 button and providing a name such as test-function.
Once you've been redirected to the new Service, click the Add + button and select Add Function from the dropdown.
This will create a new Protected Function for you with the option to rename it. The name of the file will be path it is accessed from.
Copy any one of the example code snippets from this page that you want to experiment with, and paste the code into your newly created Function. You can quickly switch examples by using the dropdown menu of the code rail.
Click Save to save your Function's contents.
Click Deploy All to build and deploy the Function. After a short delay, your Function will be accessible from: https://<service-name>-<random-characters>-<optional-domain-suffix>.twil.io/<function-path>
For example: test-function-3548.twil.io/hello-world.
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!
Enable CORS
Allow for a client-side Flex Plugin to communicate with a Function on a different host
Copy code block
exports.handler = (context, event, callback) => {


 // Access the NodeJS Helper Library by calling context.getTwilioClient()


 const client = context.getTwilioClient();





 // Create a custom Twilio Response


 const response = new Twilio.Response();


 // Set the CORS headers to allow Flex to make an error-free HTTP request


 // to this Function


 response.appendHeader('Access-Control-Allow-Origin', '*');


 response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');


 response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');





 // Use the NodeJS Helper Library to make an API call and gather


 // statistics for the Flex Plugin.


 // Note that the workspace SID is passed from the event parameter


 // of the incoming request.


 client.taskrouter.v1


   .workspaces(event.WorkspaceSid)


   .workers()


   .cumulativeStatistics()


   .fetch()


   .then((data) => {


     response.appendHeader('Content-Type', 'application/json');


     response.setBody(data);


     // Return a success response using the callback function


     return callback(null, response);


   })


   .catch((err) => {


     response.appendHeader('Content-Type', 'plain/text');


     response.setBody(err.message);


     response.setStatusCode(500);


     // If there's an error, send an error response.


     // Keep using the response object for CORS purposes.


     return callback(null, response);


   });


};
If you want to learn more about Flex Plugins that would be invoking a Function in this way, check out this tutorial on calling a Function from a Flex Plugin.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Enable CORS between Flex Plugins and Functions | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Create and host a Function
Enable CORS between Flex Plugins and Functions

(warning)
Warning
This example uses headers and cookies, which are only accessible when your Function is running @twilio/runtime-handler version 1.2.0 or later. Consult the Runtime Handler guide to learn more about the latest version and how to update.
A common use case is to call Functions from a Flex Plugin to retrieve external data such as statistics. Sometimes, this results in Cross-Origin Resource Sharing (CORS
) restrictions in production environments due to the different hostnames between the Flex Plugin and the Function being called.
Fortunately, CORS errors, in this context or other situations, can be addressed by leveraging the response headers of the Function to allow any Origin, as shown in the following example code.

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
The Serverless Toolkit enables you with local development, project deployment, and other functionality via the Twilio CLI. To get up and running with these examples using Serverless Toolkit, follow this process:
From the CLI, run twilio serverless:init <your-service-name> --empty to bootstrap your local environment.
Navigate into your new project directory using cd <your-service-name>
In the /functions directory, create a new JavaScript file that is named respective to the purpose of the Function. For example, sms-reply.protected.js for a Protected Function intended to handle incoming SMS.
Populate the file using the code example of your choice and save. Note A Function can only export a single handler. You will want to create separate files if you want to run and/or deploy multiple examples at once.
Once your Function(s) code is written and saved, you can test it either by running it locally (and optionally tunneling requests to it via a tool like ngrok
), or by deploying the Function and executing against the deployed url(s).
Run your Function in local development
Run twilio serverless:start from your CLI to start the project locally. The Function(s) in your project will be accessible from http://localhost:3000/sms-reply
If you want to test a Function as a Twilio webhook, run: twilio phone-numbers:update <your Twilio phone number> --sms-url "http://localhost:3000/sms-reply"
This will automatically generate an ngrok tunnel from Twilio to your locally running Function, so you can start sending texts to it. You can apply the same process but with the voice-url flag instead if you want to test with Twilio Voice.
If your code does not connect to Twilio Voice/Messages as a webhook, you can start your dev server and start an ngrok tunnel in the same command with the ngrok flag. For example: twilio serverless:start --ngrok=""
Deploy your Function
To deploy your Function and have access to live url(s), run twilio serverless:deploy from your CLI. This will deploy your Function(s) to Twilio under a development environment by default, where they can be accessed from:
https://<service-name>-<random-characters>-dev.twil.io/<function-path>
For example: https://incoming-sms-examples-3421-dev.twil.io/sms-reply
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!
Enable CORS
Allow for a client-side Flex Plugin to communicate with a Function on a different host
Copy code block
exports.handler = (context, event, callback) => {


 // Access the NodeJS Helper Library by calling context.getTwilioClient()


 const client = context.getTwilioClient();





 // Create a custom Twilio Response


 const response = new Twilio.Response();


 // Set the CORS headers to allow Flex to make an error-free HTTP request


 // to this Function


 response.appendHeader('Access-Control-Allow-Origin', '*');


 response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');


 response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');





 // Use the NodeJS Helper Library to make an API call and gather


 // statistics for the Flex Plugin.


 // Note that the workspace SID is passed from the event parameter


 // of the incoming request.


 client.taskrouter.v1


   .workspaces(event.WorkspaceSid)


   .workers()


   .cumulativeStatistics()


   .fetch()


   .then((data) => {


     response.appendHeader('Content-Type', 'application/json');


     response.setBody(data);


     // Return a success response using the callback function


     return callback(null, response);


   })


   .catch((err) => {


     response.appendHeader('Content-Type', 'plain/text');


     response.setBody(err.message);


     response.setStatusCode(500);


     // If there's an error, send an error response.


     // Keep using the response object for CORS purposes.


     return callback(null, response);


   });


};
If you want to learn more about Flex Plugins that would be invoking a Function in this way, check out this tutorial on calling a Function from a Flex Plugin.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Enable CORS between Flex Plugins and Functions | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Create and host a Function
Create a Delay Function
Refactoring the sleep method
Add delay

(error)
Danger
Functions are subject to a 10-second execution limit before being terminated. Keep this limit in mind when evaluating if this method suits your use case.
Adding a delay to your Function's response is useful in certain use cases, particularly when it comes to interacting with Twilio Studio. One such case is if you are creating a chatbot and want longer, more realistic pauses between responses. Or perhaps you are making an HTTP request in a Studio Flow and want to add a delay to the retry loop on failure.
In all of these situations, the ability to add a delay is incredibly helpful. While Studio does not provide a native "Delay" widget, you can combine the Run Function widget with a Function that has a delayed response to emulate such behavior.
Below are some examples of what such a Function may look like. Before getting deeper into the examples, first, create a Service and Function so that you have a place to write and test your Function code.

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
If you prefer a UI-driven approach, creating and deploying a Function can be done entirely using the Twilio Console and the following steps:
Log in to the Twilio Console and navigate to the Functions tab
. If you need an account, you can sign up for a free Twilio account here
!
Functions are contained within Services. Create a Service by clicking the Create Service
 button and providing a name such as test-function.
Once you've been redirected to the new Service, click the Add + button and select Add Function from the dropdown.
This will create a new Protected Function for you with the option to rename it. The name of the file will be path it is accessed from.
Copy any one of the example code snippets from this page that you want to experiment with, and paste the code into your newly created Function. You can quickly switch examples by using the dropdown menu of the code rail.
Click Save to save your Function's contents.
Click Deploy All to build and deploy the Function. After a short delay, your Function will be accessible from: https://<service-name>-<random-characters>-<optional-domain-suffix>.twil.io/<function-path>
For example: test-function-3548.twil.io/hello-world.
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!

Create a Delay Function
The act of delaying a Function's response is mostly just a matter of using a built-in method, such as setTimeout, to delay the act of calling the callback method and signaling that the Function has completed. If this Function were to be called by a Run Function widget, the Studio Flow containing that call would be delayed until this Function returns a response.
It's also quite possible to provide the value for delay, by defining a value (or dynamic variable) under the Function Parameters config for the Run Function Widget that calls this Function.
To provide a more async/await friendly syntax in your Functions, this example demonstrates how to write a sleep helper method that wraps setTimeout in a Promise
.
If your Function has no other actions to execute or if you don't see the need for Promises in this case, the next example demonstrates the same functionality, but without the async/await abstraction.
Delayed response Function
Copy code block
// Helper function for quickly adding await-able "pauses" to JavaScript


const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));





exports.handler = async (context, event, callback) => {


 // A custom delay value could be passed to the Function, either via


 // request parameters or by the Run Function Widget


 // Default to a 5-second delay


 const delay = event.delay || 5000;


 // Pause Function for the specified number of ms


 await sleep(delay);


 // Once the delay has passed, return a success message, TwiML, or


 // any other content to whatever invoked this Function.


 return callback(null, `Timer up: ${delay}ms`);


};
Delayed response Function
Without async/await or Promises
Copy code block
exports.handler = (context, event, callback) => {


 // A custom delay value could be passed to the Function, either via


 // request parameters or by the Run Function Widget


 // Default to a 5-second delay


 const delay = event.delay || 5000;


 // Set a timer for the specified number of ms. Once the delay has passed,


 // return a success message, TwiML, or any other content to whatever


 // invoked this Function.


 setTimeout(() => callback(null, `Timer Up: ${delay}ms`), delay);


};

Refactoring the sleep method
The sleep method that we created for the previous example is also a great example of a method that could be used across a number of Functions in your Service. In Functions, it's best practice to store shared JavaScript methods such as these in Private Functions, and import them into the various Functions that will make use of them.
To see this in action, first create a new Function named utils, and set its privacy level to Private. Paste in the following code, which exports the sleep helper from before.
Private shared utilities Function
An example of a Private Function which hosts shared methods across Functions
Copy code block
// Helper function for quickly adding await-able "pauses" to JavaScript


exports.sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
Next, open your existing Delay Function, remove the inline declaration of sleep, and add the highlighted line of code. Save and deploy all changes.
This is a demonstration of using the Runtime.getFunctions helper to import shared code from a private Function, which can help to DRY
 up your Functions code.
Delayed response Function
A delayed Function that leverages a utility method instead of defining it inline
Copy code block
exports.handler = async (context, event, callback) => {


 // You can import shared code from a Private Function


 // using the Runtime.getFunctions() helper + require


 const { sleep } = require(Runtime.getFunctions().utils.path);


 // A custom delay value could be passed to the Function, either via


 // request parameters or by the Run Function Widget


 // Default to a 5-second delay


 const delay = event.delay || 5000;


 // Pause Function for the specified number of ms


 await sleep(delay || 5000);


 // Once the delay has passed, return a success message, TwiML, or


 // any other content to whatever invoked this Function.


 return callback(null, `Timer up: ${delay}ms`);


};

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Add delay | Twilio
​​Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Create and host a Function
Identify a phone number's carrier and type
Get a name associated with a phone number
Set a Function as a webhook
Determine carrier, phone number type, and caller info

Twilio Lookup allows you to get information about phone numbers programmatically. This information can include the name of the phone number's carrier, their type (landline, mobile, VoIP, etc.), the name of the caller, and far more than this example page can cover.
All this data can be indispensable in making your applications dynamic and able to handle different carriers. The following examples illustrate a small sample of what Lookup can enable in Twilio Functions, and we can't wait to see what else you will build.
To get started, use the following instructions to create a Function to host your code.

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
The Serverless Toolkit enables you with local development, project deployment, and other functionality via the Twilio CLI. To get up and running with these examples using Serverless Toolkit, follow this process:
From the CLI, run twilio serverless:init <your-service-name> --empty to bootstrap your local environment.
Navigate into your new project directory using cd <your-service-name>
In the /functions directory, create a new JavaScript file that is named respective to the purpose of the Function. For example, sms-reply.protected.js for a Protected Function intended to handle incoming SMS.
Populate the file using the code example of your choice and save. Note A Function can only export a single handler. You will want to create separate files if you want to run and/or deploy multiple examples at once.
Once your Function(s) code is written and saved, you can test it either by running it locally (and optionally tunneling requests to it via a tool like ngrok
), or by deploying the Function and executing against the deployed url(s).
Run your Function in local development
Run twilio serverless:start from your CLI to start the project locally. The Function(s) in your project will be accessible from http://localhost:3000/sms-reply
If you want to test a Function as a Twilio webhook, run: twilio phone-numbers:update <your Twilio phone number> --sms-url "http://localhost:3000/sms-reply"
This will automatically generate an ngrok tunnel from Twilio to your locally running Function, so you can start sending texts to it. You can apply the same process but with the voice-url flag instead if you want to test with Twilio Voice.
If your code does not connect to Twilio Voice/Messages as a webhook, you can start your dev server and start an ngrok tunnel in the same command with the ngrok flag. For example: twilio serverless:start --ngrok=""
Deploy your Function
To deploy your Function and have access to live url(s), run twilio serverless:deploy from your CLI. This will deploy your Function(s) to Twilio under a development environment by default, where they can be accessed from:
https://<service-name>-<random-characters>-dev.twil.io/<function-path>
For example: https://incoming-sms-examples-3421-dev.twil.io/sms-reply
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!

Identify a phone number's carrier and type
The core functionality of Lookup is determining the carrier and type of a phone number. For example, the following Function code returns true for incoming calls from landline or mobile callers, and false for calls from VoIP callers. An application could use this information to filter out unsupported call types in a Studio Flow if called by a Run Function widget, or simply called as a REST API by your application.
Lookup with an E.164 Formatted Number
Copy code block
exports.handler = async (context, event, callback) => {


 // The pre-initialized Twilio client is available from the `context` object


 const client = context.getTwilioClient();





 // Grab the incoming phone number from a call/message webhook via event.From


 // If invoked by a REST API call or Studio Run Function widget, it may be a


 // parameter such as phoneNumber


 // Example: https://x.x.x.x/<path>?phoneNumber=%2b15105550100


 const phoneNumber = event.From || event.phoneNumber || '+15105550100';





 try {


   // Discover the phone number's carrier and type using the Lookup API with


   // the `type: 'carrier'` argument


   const result = await client.lookups


     .phoneNumbers(phoneNumber)


     .fetch({ type: 'carrier' });





   console.log('Carrier name: ', result.carrier.name);


   // 'Carrier name: AT&T'


   console.log('Carrier type: ', result.carrier.type);


   // 'Carrier type: mobile'





   // Reject calls from VoIP numbers, and allow all others


   return callback(null, result.carrier.type !== 'voip');


 } catch (error) {


   console.error(error);


   return callback(error, null);


 }


};

Get a name associated with a phone number
Lookup can also retrieve the name of the individual or business associated with a phone number. Expanding on the previous example, convert the type argument to an array, and add 'caller-name' after 'carrier'.
If available, the response will include a name for the phone number and whether the name is for a business or consumer.
(warning)
Warning
Keep in mind that not all numbers will have names available.
You can then use this information to adjust application logic, format responses to use names to add personalization, and more.
For this example, the code attempts to format the caller's name and use it in a response, falling back to referencing the carrier name if the caller's name isn't accessible. To test this code out, paste the code into your existing Function, and set it as the A Call Comes In webhook handler for the Twilio phone number you wish to test. The following instructions will show you how to do so.
Lookup caller name and type
Copy code block
// lodash is a default dependency for deployed Functions, so it can be imported


// with no changes on your end


const { startCase } = require('lodash');





exports.handler = async (context, event, callback) => {


 // The pre-initialized Twilio client is available from the `context` object


 const client = context.getTwilioClient();





 // Grab the incoming phone number from a call webhook via event.From


 const phoneNumber = event.From;





 try {


   // Create a new voice response object


   const twiml = new Twilio.twiml.VoiceResponse();


   // Discover the phone number's name (if possible) by converting type


   // to an array and appending 'caller-name' to the type argument


   const result = await client.lookups


     .phoneNumbers(phoneNumber)


     .fetch({ type: ['carrier', 'caller-name'] });





   console.log('Carrier name: ', result.carrier.name);


   // 'Carrier name: AT&T'


   console.log('Carrier type: ', result.carrier.type);


   // 'Carrier type: mobile'


   console.log('Caller name: ', result.callerName.caller_name);


   // 'Caller name: DOE,JOHN'


   console.log('Caller type: ', result.callerName.caller_type);


   // Caller type: CONSUMER'





   if (result.callerName.caller_name) {


     // Attempt to nicely format the users name in a response, if it exists


     const [lastName, firstName] = result.callerName.caller_name


       .toLowerCase()


       .split(',');


     const properName = startCase(`${firstName} ${lastName}`);


     twiml.say(`Great to hear from you, ${properName}!`);


   } else {


     // If we don't have a name, fallback to reference the carrier instead


     twiml.say(`We love hearing from ${result.carrier.name} customers!`);


   }





   return callback(null, twiml);


 } catch (error) {


   console.error(error);


   return callback(error, null);


 }


};

Set a Function as a webhook
In order for your Function to react to incoming SMS and/or voice calls, it must be set as a webhook for your Twilio number. There are a variety of methods to set a Function as a webhook, as detailed below:
Twilio ConsoleTwilio CLITwilio SDKs
You can use the Twilio Console
 UI as a straightforward way of connecting your Function as a webhook:
Log in to the Twilio Console's Phone Numbers page
.
Click on the phone number you'd like to have connected to your Function.
If you want the Function to respond to incoming SMS, find the A Message Comes In option under Messaging. If you want the Function to respond to Voice, find the A Call Comes In option under Voice & Fax.
Select Function from the A Message Comes In or A Call Comes In dropdown.
Select the Service that you are using, then the Environment (this will default to ui unless you have created custom domains ), and finally Function Path of your Function from the respective dropdown menus.

Expand image
Alternatively, you could select Webhook instead of Function, and directly paste in the full URL of the Function.

Expand image
Click the Save button.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Determine carrier, phone number type, and caller info | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Create and host a Function
Date and time dependent responses
Set a Function as a webhook
Time of day routing in a Studio Flow
Time of day routing with Functions

A very common use case for Functions is implementing time of day routing in your application. For example, varying your application's response to incoming calls based on what time and day a customer is calling, or which path to take in an IVR being written with Twilio Studio.
Before getting deeper into the example, first create a Service and Function so that you have a place to write and test your Function code.

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
The Serverless Toolkit enables you with local development, project deployment, and other functionality via the Twilio CLI. To get up and running with these examples using Serverless Toolkit, follow this process:
From the CLI, run twilio serverless:init <your-service-name> --empty to bootstrap your local environment.
Navigate into your new project directory using cd <your-service-name>
In the /functions directory, create a new JavaScript file that is named respective to the purpose of the Function. For example, sms-reply.protected.js for a Protected Function intended to handle incoming SMS.
Populate the file using the code example of your choice and save. Note A Function can only export a single handler. You will want to create separate files if you want to run and/or deploy multiple examples at once.
Once your Function(s) code is written and saved, you can test it either by running it locally (and optionally tunneling requests to it via a tool like ngrok
), or by deploying the Function and executing against the deployed url(s).
Run your Function in local development
Run twilio serverless:start from your CLI to start the project locally. The Function(s) in your project will be accessible from http://localhost:3000/sms-reply
If you want to test a Function as a Twilio webhook, run: twilio phone-numbers:update <your Twilio phone number> --sms-url "http://localhost:3000/sms-reply"
This will automatically generate an ngrok tunnel from Twilio to your locally running Function, so you can start sending texts to it. You can apply the same process but with the voice-url flag instead if you want to test with Twilio Voice.
If your code does not connect to Twilio Voice/Messages as a webhook, you can start your dev server and start an ngrok tunnel in the same command with the ngrok flag. For example: twilio serverless:start --ngrok=""
Deploy your Function
To deploy your Function and have access to live url(s), run twilio serverless:deploy from your CLI. This will deploy your Function(s) to Twilio under a development environment by default, where they can be accessed from:
https://<service-name>-<random-characters>-dev.twil.io/<function-path>
For example: https://incoming-sms-examples-3421-dev.twil.io/sms-reply
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!

Date and time dependent responses
One potential implementation is to simply respond to callers with a different message depending on the day and time that they are calling. Suppose your business is located on the East coast of the US, and has hours 9am-5pm, Monday-Friday. Calls on those days and between those hours should receive a response indicating that the business is open, while calls on the weekend or outside of business hours should receive a closed message.
This can be accomplished purely by leveraging built-in JavaScript methods, courtesy of the Internationalization API's Intl.DateTimeFormat
 object. By providing the specific timeZone of your business in the accepted tz format
, you can derive the current day and time, and perform any necessary logic to determine your response.
To test this code out, paste the code into the Function that you just created earlier, and set it as the A Call Comes In webhook handler for the Twilio phone number you wish to test. The following instructions will show you how to do so.
(warning)
Warning
Remember that methods such as new Date() return the local time of the machine that your deployed code is being executed on, not your local time. Functions are typically executing in the UTC time zone. This is why all examples are using Intl.DateTimeFormat
 instead of just the Date object directly.
(information)
Info
We highly recommend using built-in objects such as Intl.DateTimeFormat
 to implement your application logic, or the date-fns
 library if you need more robust date utilities.
Moment.js
 is end of life and should not be used for handling time zone shifts, formatting, etc.
Responding to a call based on date and time of call
Copy code block
exports.handler = (context, event, callback) => {


 // Create a new voice response object


 const twiml = new Twilio.twiml.VoiceResponse();


 // Grab the current date and time. Note that this is the local time where the


 // Function is being executed, not necessarily the time zone of your business!


 const now = new Date();


 // Print the timezone of the instance that's running this code


 const functionTz = Intl.DateTimeFormat().resolvedOptions().timeZone;


 console.log(`This Function is being executed in the ${functionTz} time zone`);


 // You should see: 'This Function is being executed in the UTC time zone'





 // Configure Intl.DateTimeFormat to return a date in the specified


 // time zone and in this format for parsing, for example: 'Monday, 18'


 const formatOptions = {


   hour: 'numeric',


   hour12: false,


   weekday: 'long',


   timeZone: 'America/New_York',


 };


 const formatter = new Intl.DateTimeFormat('en-US', formatOptions);





 // Get the current time and day of the week for your specific time zone


 const formattedDate = formatter.format(now).split(', ');


 const day = formattedDate[0]; // ex. 'Monday'


 const hour = Number(formattedDate[1]); // ex. 18


 // Since we're given days as strings, we can use Array.includes to check


 // against a list of days we want to consider the business closed


 const isWeekend = ['Sunday', 'Saturday'].includes(day);





 // Here the business is considered open M-F, 9am-5pm Eastern Time


 const isOpen = !isWeekend && hour >= 9 && hour < 17;


 // Modify the stated voice response depending on whether the business is open or not


 twiml.say(`Business is ${isOpen ? 'Open' : 'Closed'}`);


 return callback(null, twiml);


};

Set a Function as a webhook
In order for your Function to react to incoming SMS and/or voice calls, it must be set as a webhook for your Twilio number. There are a variety of methods to set a Function as a webhook, as detailed below:
Twilio ConsoleTwilio CLITwilio SDKs
You can use the Twilio Console
 UI as a straightforward way of connecting your Function as a webhook:
Log in to the Twilio Console's Phone Numbers page
.
Click on the phone number you'd like to have connected to your Function.
If you want the Function to respond to incoming SMS, find the A Message Comes In option under Messaging. If you want the Function to respond to Voice, find the A Call Comes In option under Voice & Fax.
Select Function from the A Message Comes In or A Call Comes In dropdown.
Select the Service that you are using, then the Environment (this will default to ui unless you have created custom domains ), and finally Function Path of your Function from the respective dropdown menus.

Expand image
Alternatively, you could select Webhook instead of Function, and directly paste in the full URL of the Function.

Expand image
Click the Save button.

Time of day routing in a Studio Flow
This logic can also be applied in the context of a Studio Flow, such as in an IVR. For example, a Function can return an isOpen property as a Boolean (or a more advanced data structure if you like), and a subsequent Split Based On... Widget could then perform pattern matching on that value to determine how the Flow should advance. The following code sample would generate a Boolean that can be consumed in a Split Based On... Widget by referencing {{widgets.<widget-name>.parsed.isOpen}}.
Check out this section of the Run Function widget example to better understand consuming parsed values and generally how to execute this sample via the Run Function widget.
Support time of day routing in Twilio Studio
Copy code block
exports.handler = (context, event, callback) => {


 // Grab the current date and time. Note that this is the local time where the


 // Function is being executed, not necessarily the time zone of your business!


 const now = new Date();


 // Configure Intl.DateTimeFormat to return a date in the specified


 // time zone and in this format for parsing, for example: 'Monday, 18'


 const formatOptions = {


   hour: 'numeric',


   hour12: false,


   weekday: 'long',


   timeZone: 'America/New_York',


 };


 const formatter = new Intl.DateTimeFormat('en-US', formatOptions);





 // Get the current time and day of the week for your specific time zone


 const formattedDate = formatter.format(now).split(', ');


 const day = formattedDate[0]; // ex. 'Monday'


 const hour = Number(formattedDate[1]); // ex. 18


 // Since we're given days as strings, we can use Array.includes to check


 // against a list of days we want to consider the business closed


 const isWeekend = ['Sunday', 'Saturday'].includes(day);





 // Here the business is considered open M-F, 9am-5pm Eastern Time


 const isOpen = !isWeekend && hour >= 9 && hour < 17;


 // Return isOpen in an object that can be parsed and then


 // used by the Split Based On... Widget for Flow routing


 return callback(null, { isOpen });


};

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Time of day routing with Functions | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Create and host a Function
Respond to a call directly with TwiML
Set a Function as a webhook
Read out phone numbers in a Studio Flow
Create a Studio Flow
Connect and configure your widgets
Update your Function's code
Connect and test your Flow
Normalize telephone numbers

Twilio's APIs consistently use the E.164 standard for phone numbers. This format is fine within your code, but it presents a couple of user-facing issues:
E.164 is difficult to understand when presented as plain text, such as in an SMS
When read aloud by a Twilio Say verb or Say Widget, numbers such as +15095550100 will be read literally as a large number, instead of digit-by-digit. (ex. "Plus fifteen billion, ninety-five million, five hundred fifty thousand, one hundred")
Fortunately, Twilio Lookup enables you to convert a given E.164 phone number into the national format used by that country, which Twilio will read aloud as one would normally say it in their region.
To get started, use the following instructions to create a Function to host your code.

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
The Serverless Toolkit enables you with local development, project deployment, and other functionality via the Twilio CLI. To get up and running with these examples using Serverless Toolkit, follow this process:
From the CLI, run twilio serverless:init <your-service-name> --empty to bootstrap your local environment.
Navigate into your new project directory using cd <your-service-name>
In the /functions directory, create a new JavaScript file that is named respective to the purpose of the Function. For example, sms-reply.protected.js for a Protected Function intended to handle incoming SMS.
Populate the file using the code example of your choice and save. Note A Function can only export a single handler. You will want to create separate files if you want to run and/or deploy multiple examples at once.
Once your Function(s) code is written and saved, you can test it either by running it locally (and optionally tunneling requests to it via a tool like ngrok
), or by deploying the Function and executing against the deployed url(s).
Run your Function in local development
Run twilio serverless:start from your CLI to start the project locally. The Function(s) in your project will be accessible from http://localhost:3000/sms-reply
If you want to test a Function as a Twilio webhook, run: twilio phone-numbers:update <your Twilio phone number> --sms-url "http://localhost:3000/sms-reply"
This will automatically generate an ngrok tunnel from Twilio to your locally running Function, so you can start sending texts to it. You can apply the same process but with the voice-url flag instead if you want to test with Twilio Voice.
If your code does not connect to Twilio Voice/Messages as a webhook, you can start your dev server and start an ngrok tunnel in the same command with the ngrok flag. For example: twilio serverless:start --ngrok=""
Deploy your Function
To deploy your Function and have access to live url(s), run twilio serverless:deploy from your CLI. This will deploy your Function(s) to Twilio under a development environment by default, where they can be accessed from:
https://<service-name>-<random-characters>-dev.twil.io/<function-path>
For example: https://incoming-sms-examples-3421-dev.twil.io/sms-reply
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!

Respond to a call directly with TwiML
The following Function is one which will tell the user their phone number, in the format that they would expect in normal conversation. This will also work for international phone numbers!
To verify this for yourself, paste the code into the Function that you just made, and set it as the A Call Comes In webhook handler for the Twilio phone number you wish to test. The following instructions will show you how to do so.
Convert a number to its national format
Copy code block
exports.handler = async (context, event, callback) => {


 // The pre-initialized Twilio client is available from the `context` object


 const client = context.getTwilioClient();


 // Create a new voice response object


 const twiml = new Twilio.twiml.VoiceResponse();





 // The From value is provided by Twilio to this webhook Function, and contains the caller's


 // phone number in E.164 format, ex. '+15095550100'


 const from = event.From;





 // Call Twilio Lookup to get information about the number, including its national format


 const result = await client.lookups.phoneNumbers(from).fetch();





 // Read back the caller's phone number in the way it would normally spoken, not as a


 // massive integer!


 twiml.say(`Your phone number is ${result.nationalFormat}`);


 return callback(null, twiml);


};

Set a Function as a webhook
In order for your Function to react to incoming SMS and/or voice calls, it must be set as a webhook for your Twilio number. There are a variety of methods to set a Function as a webhook, as detailed below:
Twilio ConsoleTwilio CLITwilio SDKs
You can use the Twilio Console
 UI as a straightforward way of connecting your Function as a webhook:
Log in to the Twilio Console's Phone Numbers page
.
Click on the phone number you'd like to have connected to your Function.
If you want the Function to respond to incoming SMS, find the A Message Comes In option under Messaging. If you want the Function to respond to Voice, find the A Call Comes In option under Voice & Fax.
Select Function from the A Message Comes In or A Call Comes In dropdown.
Select the Service that you are using, then the Environment (this will default to ui unless you have created custom domains ), and finally Function Path of your Function from the respective dropdown menus.

Expand image
Alternatively, you could select Webhook instead of Function, and directly paste in the full URL of the Function.

Expand image
Click the Save button.

Read out phone numbers in a Studio Flow
This functionality also lends itself well to Studio Flows, where you may share a phone number as part of your IVR. The Say widget doesn't natively read E.164 formatted numbers in the national format, but clever use of the Run Function widget with the following sample code will enable this.
Create a Studio Flow
First, create a new Studio Flow. We suggest following the Create Your Flow directions from a Studio tutorial.
Connect and configure your widgets
Once you have created a Flow, drag a Run Function and a Say/Play widget onto the Studio canvas. Connect the Incoming Call trigger to the Run Function widget by dragging from the trigger to on top of the widget, and similarly connect the Run Function widget's "Success" condition to the Say/Play widget.
With the widgets connected, the next step is to configure them.
Click on the Run Function widget, which should cause the Widget Library to show the configuration options for the widget. Name the widget as you like, and use the drop-down menus to select the Service and path of the Function that you created previously. To wrap up the configuration, click Add under Function Parameters, set the "Key" to From, and "Value" to {{contact.channel.address}}. This will cause the phone number of the incoming caller to be passed to the Function as a parameter called From.
Your configuration and connections should look similar to this:

Expand image
Following a similar process, configure the Say/Play widget with your desired name, and paste the following into the "Text to Say" field:
Copy code block
Hi! Your phone number is {{widgets.<widget-name>.parsed.normalizedPhoneNumber}}.
Replace <widget-name> with the name of your Run Function widget. This means the Say/Play widget will access the results of the Run Function widget, retrieve a value named normalizedPhoneNumber, and will attempt to read it back to the caller. You can read here to get more context around the parsed property.
Click Publish to publish your Studio Flow.
Update your Function's code
With the Studio Flow published and expecting new behavior from your Function, it will need some slight modifications.
Edit or replace the body of your Function with the following sample code. Note that it is returning the normalizedPhoneNumber that is expected by the Say/Play widget.
With your code changes complete, save and deploy your Function.
Normalize a phone number for the Say Widget
Provides readable phone numbers to Studio Flows
Copy code block
exports.handler = async (context, event, callback) => {


 // The pre-initialized Twilio client is available from the `context` object


 const client = context.getTwilioClient();


 // The From value should be provided as a parameter by the Run Function widget, and contains


 // the caller's phone number in E.164 format, ex. '+15095550100'


 const from = event.From;





 // Call Twilio Lookup to get information about the number, including its national format


 const result = await client.lookups.phoneNumbers(from).fetch();





 // Return the caller's phone number in the way it would normally spoken


 // Access this in a Studio Flow with `{{widgets.<widget-name>.parsed.normalizedPhoneNumber}}`


 return callback(null, {


   normalizedPhoneNumber: result.nationalFormat,


 });


};
Connect and test your Flow
To test your Flow, connect your Twilio phone number to the Studio Flow.
With your Twilio phone number connected to the Studio Flow, you can call your Twilio phone number and have a synthesized voice read out the number you are calling from in a human-friendly manner.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Normalize telephone numbers | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Create and host a Function
Block calls using a hard-coded list
Set a Function as a webhook
Store the block list as a private Asset
Prevent blocked numbers from calling your application

You may wish to block certain numbers from contacting or spamming your application's phone number. Creating a block list and using a Function that compares the incoming number to its contents will allow you to decide whether to Reject an incoming call, or Redirect it to your actual application.
The following examples will show a couple of approaches to this problem. To get started, use the following directions to create two new Functions that will form the base of this application: /filter-calls and /welcome.

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
The Serverless Toolkit enables you with local development, project deployment, and other functionality via the Twilio CLI. To get up and running with these examples using Serverless Toolkit, follow this process:
From the CLI, run twilio serverless:init <your-service-name> --empty to bootstrap your local environment.
Navigate into your new project directory using cd <your-service-name>
In the /functions directory, create a new JavaScript file that is named respective to the purpose of the Function. For example, sms-reply.protected.js for a Protected Function intended to handle incoming SMS.
Populate the file using the code example of your choice and save. Note A Function can only export a single handler. You will want to create separate files if you want to run and/or deploy multiple examples at once.
Once your Function(s) code is written and saved, you can test it either by running it locally (and optionally tunneling requests to it via a tool like ngrok
), or by deploying the Function and executing against the deployed url(s).
Run your Function in local development
Run twilio serverless:start from your CLI to start the project locally. The Function(s) in your project will be accessible from http://localhost:3000/sms-reply
If you want to test a Function as a Twilio webhook, run: twilio phone-numbers:update <your Twilio phone number> --sms-url "http://localhost:3000/sms-reply"
This will automatically generate an ngrok tunnel from Twilio to your locally running Function, so you can start sending texts to it. You can apply the same process but with the voice-url flag instead if you want to test with Twilio Voice.
If your code does not connect to Twilio Voice/Messages as a webhook, you can start your dev server and start an ngrok tunnel in the same command with the ngrok flag. For example: twilio serverless:start --ngrok=""
Deploy your Function
To deploy your Function and have access to live url(s), run twilio serverless:deploy from your CLI. This will deploy your Function(s) to Twilio under a development environment by default, where they can be accessed from:
https://<service-name>-<random-characters>-dev.twil.io/<function-path>
For example: https://incoming-sms-examples-3421-dev.twil.io/sms-reply
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!

Block calls using a hard-coded list
To introduce the logic and TwiML involved without extra complications, this example code for /filter-calls includes a sample block list hard-coded into its body.
The Function compares the incoming phone number, provided as From when this Function is connected to your Twilio phone number as a webhook, to the contents of the block list. The resulting Boolean is then used to determine whether the result should be a rejection, or a redirect to the /welcome Function.
The /welcome Function returns a welcome message to the user and primarily serves as an example of how you can still leverage Redirect verbs even within a Serverless project such as this. You're able to use the relative URL '/welcome' since the same Service contains both Functions.
To test this out, copy and paste both samples into their respective Functions, and add your personal phone number to the block list in E.164 format. Save and deploy your Service, and use the following directions to set /filter-calls as the A Call Comes In webhook handler for your Twilio phone number. The application will immediately reject your calls. If you remove your number from the block list and re-deploy, you will instead get the welcome message.
Call filter logic
Sample code for /filter-calls
Copy code block
exports.handler = (context, event, callback) => {


 // Prepare a new Voice TwiML object that will control Twilio's response


 // to the incoming call


 const twiml = new Twilio.twiml.VoiceResponse();


 // The incoming phone number is provided by Twilio as the `From` property


 const incomingNumber = event.From;





 // This is an example of a blocklist hard-coded into the Function


 const blockList = ['+14075550100', '+18025550100'];





 const isBlocked = blockList.length > 0 && blockList.includes(incomingNumber);





 if (isBlocked) {


   twiml.reject();


 } else {


   // If the number is not blocked, redirect call to the webhook that


   // handles allowed callers


   twiml.redirect('/welcome');


 }





 return callback(null, twiml);


};
Welcome message
Sample code for /welcome
Copy code block
exports.handler = (context, event, callback) => {


 const twiml = new Twilio.twiml.VoiceResponse();


 twiml.say("Hello, congratulations! You aren't blocked!");


 return callback(null, twiml);


};

Set a Function as a webhook
In order for your Function to react to incoming SMS and/or voice calls, it must be set as a webhook for your Twilio number. There are a variety of methods to set a Function as a webhook, as detailed below:
Twilio ConsoleTwilio CLITwilio SDKs
You can use the Twilio Console
 UI as a straightforward way of connecting your Function as a webhook:
Log in to the Twilio Console's Phone Numbers page
.
Click on the phone number you'd like to have connected to your Function.
If you want the Function to respond to incoming SMS, find the A Message Comes In option under Messaging. If you want the Function to respond to Voice, find the A Call Comes In option under Voice & Fax.
Select Function from the A Message Comes In or A Call Comes In dropdown.
Select the Service that you are using, then the Environment (this will default to ui unless you have created custom domains ), and finally Function Path of your Function from the respective dropdown menus.

Expand image
Alternatively, you could select Webhook instead of Function, and directly paste in the full URL of the Function.

Expand image
Click the Save button.

Store the block list as a private Asset
To keep your block list separate from and independent of your Function's code, one recommendation is to store the list as JSON in a private Asset. Your Function will read and parse the contents of this file using methods provided by the Runtime Client, and achieve the same functionality with more separation of concerns.
First, create a new private Asset named blocklist.json, populate it with the sample contents (and your personal number like before, to verify the blocking works), and save the Asset. Ensure that this Asset is private in order to protect its contents and to enable helper methods such as Runtime.getAssets, which can only retrieve private Assets.
Next, update the existing /filter-calls Function with the highlighted changes. This new code replaces the hard-coded block list array with a synchronous read of blocklist.json, and a quick JSON.parse to convert the file contents to a usable array.
Save your changes to the Function, and deploy your updated Service. Subsequent calls to your Twilio phone number will behave exactly as before!
Block list private Asset
Save as blocklist.json
Copy code block
["+14075550100", "+18025550100"]
Block incoming calls using a private Asset
Updates to /filter-calls
Copy code block
exports.handler = (context, event, callback) => {


 // Prepare a new Voice TwiML object that will control Twilio's response


 // to the incoming call


 const twiml = new Twilio.twiml.VoiceResponse();


 // The incoming phone number is provided by Twilio as the `From` property


 const incomingNumber = event.From;





 // Open the contents of the private Asset containing the blocklist


 const blockListJson = Runtime.getAssets()['/blocklist.json'].open();


 // Parse the string, such as "["+14075550100", "+18025550100"]", to an array


 const blockList = JSON.parse(blockListJson);





 const isBlocked = blockList.length > 0 && blockList.includes(incomingNumber);





 if (isBlocked) {


   twiml.reject();


 } else {


   // If the number is not blocked, redirect call to the webhook that


   // handles allowed callers


   twiml.redirect('/welcome');


 }





 return callback(null, twiml);


};
(warning)
Warning
Ensure that you write the Asset name as '/blocklist.json' and not 'blocklist.json'; the leading slash is necessary, as described in the Runtime.getAssets documentation.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Prevent blocked numbers from calling your application | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Create and host a Function
Log and return version data
Display Node.js and Twilio Helper Library versions

Sometimes, such as when you are migrating to the latest version of Node.js, you want to verify what version of Node.js your Functions are running on. The same can apply to the version of the Twilio Node.js Helper Library
 that you are using, since its version determines what functionality is available via the context.getTwilioClient helper.
The following code sample shows some helpful values that you can return or log for verification. To get started, follow the instructions below to create a Service and Function to host and execute the example.

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
The Serverless Toolkit enables you with local development, project deployment, and other functionality via the Twilio CLI. To get up and running with these examples using Serverless Toolkit, follow this process:
From the CLI, run twilio serverless:init <your-service-name> --empty to bootstrap your local environment.
Navigate into your new project directory using cd <your-service-name>
In the /functions directory, create a new JavaScript file that is named respective to the purpose of the Function. For example, sms-reply.protected.js for a Protected Function intended to handle incoming SMS.
Populate the file using the code example of your choice and save. Note A Function can only export a single handler. You will want to create separate files if you want to run and/or deploy multiple examples at once.
Once your Function(s) code is written and saved, you can test it either by running it locally (and optionally tunneling requests to it via a tool like ngrok
), or by deploying the Function and executing against the deployed url(s).
Run your Function in local development
Run twilio serverless:start from your CLI to start the project locally. The Function(s) in your project will be accessible from http://localhost:3000/sms-reply
If you want to test a Function as a Twilio webhook, run: twilio phone-numbers:update <your Twilio phone number> --sms-url "http://localhost:3000/sms-reply"
This will automatically generate an ngrok tunnel from Twilio to your locally running Function, so you can start sending texts to it. You can apply the same process but with the voice-url flag instead if you want to test with Twilio Voice.
If your code does not connect to Twilio Voice/Messages as a webhook, you can start your dev server and start an ngrok tunnel in the same command with the ngrok flag. For example: twilio serverless:start --ngrok=""
Deploy your Function
To deploy your Function and have access to live url(s), run twilio serverless:deploy from your CLI. This will deploy your Function(s) to Twilio under a development environment by default, where they can be accessed from:
https://<service-name>-<random-characters>-dev.twil.io/<function-path>
For example: https://incoming-sms-examples-3421-dev.twil.io/sms-reply
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!

Log and return version data
Copy and paste the following example code into your newly minted Function. Ensure that your Function is public, save your changes, and deploy the Service that contains this Function.
Log and return versions
Copy code block
exports.handler = (context, event, callback) => {


 // PATH represents the relative path of this function


 // This value does not include the domain name


 const path = context.PATH;


 const nodeVersion = process.version;


 const twilioVersion = require('twilio/package.json').version;





 console.log(`Function path: ${path}`);


 console.log(`Node.js version: ${nodeVersion}`);


 console.log(`Twilio Helper Library version: ${twilioVersion}`);





 return callback(null, {


   status: 'complete',


   path,


   nodeVersion,


   twilioVersion,


 });


};
While running live logs (click Enable live logs in the Console), make a GET request to your Function using a tool such as curl
 or Postman
. You will then see logs displaying the Function's path, as well as the versions of Node.js and the Twilio Helper Library. Your HTTP client will also receive the same data as JSON.
For example, a public Function named /versions would log the following (with different versions, depending on when you're reading this):
Copy code block
Function path: /versions


Node.js version: v14.18.1


Twilio Helper Library version: 3.72.0
It would also return the following JSON response:
Copy code block
{


 "status": "complete",


 "path": "/versions",


 "nodeVersion": "v14.18.1",


 "twilioVersion": "3.72.0"


}
(information)
Info
This sample uses context.PATH to log the relative path of this Function. There are several other helpful, built-in process variables that you may wish to log as well.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Display Node.js and Twilio Helper Library versions | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Create and host a Function
Call a Twilio Function from the Web
Call a Twilio Function from Android
Return JSON from a Twilio Function
Parse JSON from a Twilio Function
How to call Functions from Android

Twilio Functions are a perfect fit for mobile app developers. You can focus on writing your app, and let Twilio host and run the server code you need.
You don't need a special Twilio SDK or library to call Twilio Functions from your mobile app—your Function will respond to a normal HTTP call. We'll use Google's Volley
 HTTP Networking library with this example, but you can use other HTTP libraries for Java or Android if you would like.
In this guide, we'll show you how to set up a Twilio Function, call it from a web browser, and then call that function from an Android application. Our function will return a joke as a string. You could extend it to make it choose a random joke from a list, or by category. We'll keep it brief, and just return a hard coded string.
Let's start by creating a Function and giving it the path of /joke. Be sure to set the visibility of this Function to public, to avoid any hurdles when making your HTTP calls:

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
If you prefer a UI-driven approach, creating and deploying a Function can be done entirely using the Twilio Console and the following steps:
Log in to the Twilio Console and navigate to the Functions tab
. If you need an account, you can sign up for a free Twilio account here
!
Functions are contained within Services. Create a Service by clicking the Create Service
 button and providing a name such as test-function.
Once you've been redirected to the new Service, click the Add + button and select Add Function from the dropdown.
This will create a new Protected Function for you with the option to rename it. The name of the file will be path it is accessed from.
Copy any one of the example code snippets from this page that you want to experiment with, and paste the code into your newly created Function. You can quickly switch examples by using the dropdown menu of the code rail.
Click Save to save your Function's contents.
Click Deploy All to build and deploy the Function. After a short delay, your Function will be accessible from: https://<service-name>-<random-characters>-<optional-domain-suffix>.twil.io/<function-path>
For example: test-function-3548.twil.io/hello-world.
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!
With the Function created, we'll need to edit the boilerplate code that is generated for the Function—by default, it comes with some code to return TwiML. We're only going to return a joke. And it's a bad joke.
Return a Joke with a Twilio Function
Copy code block
exports.handler = (context, event, callback) => {


 const joke = 'How many apples grow on a tree? They all do!';


 return callback(null, joke);


};
Copy the above code into the Twilio Functions code editor. Please, change the joke to something better. Press the Save button to save that code, and click Deploy All to deploy your Function.

Call a Twilio Function from the Web
To call your new Function from the web, get the Function's URL by clicking the Copy URL icon next to the path, and then paste that URL into any web browser (you don't have to be authenticated with Twilio). You'll get a text response containing whatever you return from your Function!

Call a Twilio Function from Android
We are going to use Google's open source Volley
 library to call our Twilio Function. Volley is a great choice, and provides built-in request classes for retrieving strings, JSON objects, and JSON Arrays.
Volley is not part of the Android SDK. You will need to include the Volley library in your build.gradle file as a dependency, like this:
Copy code block
dependecies {


   ...


   compile 'com.android.volley:volley:1.0.0'


   ...


}
If you are using Android Studio, be sure to Sync your gradle file after this edit.
Don't forget to also put the INTERNET permission request into your AndroidManifest.xml file as well, or you will get an exception when you make an HTTP request.
<uses-permission android:name="android.permission.INTERNET"/>
The Volley StringRequest constructor takes the HTTP method used (GET in our case), the URL to retrieve, and two listeners—one for a successful response, and one if there is an error. The onResponse and onErrorResponse methods will be on the main (UI) thread, so you can modify the user interface. In our case, we are just going to log the responses to the console.
Call a Twilio Function from Android
Copy code block
String url = "https://yourdomain.twil.io/joke";


StringRequest request = new StringRequest(Request.Method.GET,


   url,


   new Response.Listener<String>() {


       @Override


       public void onResponse(String response) {


           Log.d("APP", response);


       }


   },


   new Response.ErrorListener() {


       @Override


       public void onErrorResponse(VolleyError error) {


           Log.d("APP", error.getLocalizedMessage());


       }


   }


);


Volley.newRequestQueue(context).add(request);

Return JSON from a Twilio Function
Our previous example Function returned plain text. You can also return JSON from a Twilio Function, by passing a JavaScript object or array to the callback function. For instance, we can create another Twilio Function to return a list of jokes, along with an id and a favorite count. Create a new Function with a path of /jokes.
A Twilio Function that Returns a JSON Array
Copy code block
exports.handler = (context, event, callback) => {


 const knockKnock = { id: 1, text: 'Knock, knock', favorited: 37 };


 const chicken = {


   id: 2,


   text: 'Why did the chicken cross the road?',


   favorited: 12,


 };


 const jokes = [knockKnock, chicken];


 return callback(null, jokes);


};

Parse JSON from a Twilio Function
From Android, we call this Function the same way that we did our first Function (don't forget to change the path to /jokes). We can use Volley's JsonArrayRequest object similarly to how we used StringRequest before.
Call a Twilio Function that returns JSON from Android
Copy code block
String url = "https://yourdomain.twil.io/jokes";


JsonArrayRequest request = new JsonArrayRequest(url,


       new Response.Listener<JSONArray>() {





           @Override


           public void onResponse(JSONArray response) {


               Log.d("APP", response.toString());


           }


       },


       new Response.ErrorListener() {


           @Override


           public void onErrorResponse(VolleyError error) {


               Log.d("APP", error.getLocalizedMessage());


           }


       }


);


Volley.newRequestQueue(context).add(request);
You've now seen how to run Node.js code as a Twilio Function, and how your mobile application can use this as a serverless backend to provide data for your application.
Where to go next? You could extend the Function to choose a random joke from that array. You can also use Twilio functionality from inside your Function, for instance to send an SMS, or to return an access token for Video, Chat, or Sync. Check out the Programmable SMS Quickstart for Twilio Functions and Programmable Voice Quickstart for Twilio Functions for more quick introductions to these key features of Functions.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.


Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Receive an inbound SMS
Send SMS and MMS
Receive an incoming phone call
Make a Call
Make an API request
Use the Run Function widget in Studio
Handle real-time data with Twilio Sync
Protect your Function with Basic Auth
Protect your Function with JSON Web Token
Manage application state with cookies
Validate Webhook requests from SendGrid
Enable CORS between Flex Plugins and Functions
Add delay
Determine carrier, phone number type, and caller info
Time of day routing with Functions
Normalize telephone numbers
Prevent blocked numbers from calling your application
Display Node.js and Twilio Helper Library versions
How to call Functions from Android
How to call Functions from iOS
Migration guides
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
Create and host a Function
Call a Twilio Function from the Web
Call a Twilio Function from iOS
Return JSON from a Twilio Function
Parse JSON from a Twilio Function
How to call Functions from iOS

Twilio Functions are a perfect fit for mobile app developers. You can focus on writing your app, and let Twilio host and run the server code you need.
You don't need a special SDK to call Twilio Functions from your mobile app—your Function will respond to a normal HTTP call, making it accessible from standard iOS Networking code.
In this guide, we'll show you how to set up a Twilio Function, call it from a web browser, and then call that function from an iOS application. Our Function will return a joke as a string. You could extend it to make it choose a random joke from a list, or by category. We'll keep it brief, and just return a hard coded string.
Let's start by creating a Function and giving it the path of /joke. Be sure to set the visibility of this Function to public, to avoid any hurdles when making your HTTP calls:

Create and host a Function
In order to run any of the following examples, you will first need to create a Function into which you can paste the example code. You can create a Function using the Twilio Console or the Serverless Toolkit as explained below:
ConsoleServerless Toolkit
If you prefer a UI-driven approach, creating and deploying a Function can be done entirely using the Twilio Console and the following steps:
Log in to the Twilio Console and navigate to the Functions tab
. If you need an account, you can sign up for a free Twilio account here
!
Functions are contained within Services. Create a Service by clicking the Create Service
 button and providing a name such as test-function.
Once you've been redirected to the new Service, click the Add + button and select Add Function from the dropdown.
This will create a new Protected Function for you with the option to rename it. The name of the file will be path it is accessed from.
Copy any one of the example code snippets from this page that you want to experiment with, and paste the code into your newly created Function. You can quickly switch examples by using the dropdown menu of the code rail.
Click Save to save your Function's contents.
Click Deploy All to build and deploy the Function. After a short delay, your Function will be accessible from: https://<service-name>-<random-characters>-<optional-domain-suffix>.twil.io/<function-path>
For example: test-function-3548.twil.io/hello-world.
Your Function is now ready to be invoked by HTTP requests, set as the webhook of a Twilio phone number, invoked by a Twilio Studio Run Function Widget, and more!
With the Function created, we'll need to edit the boilerplate code that is generated for the Function—by default, it comes with some code to return TwiML. We're only going to return a joke. And it's a bad joke.
Return a Joke with a Twilio Function
Copy code block
exports.handler = (context, event, callback) => {


 const joke = 'How many apples grow on a tree? They all do!';


 return callback(null, joke);


};
Copy the above code into the Twilio Functions code editor. Please, change the joke to something better. Press the Save button to save that code, and Deploy All to deploy your Function.

Call a Twilio Function from the Web
To call your new Function from the web, get the Function's URL by clicking the Copy URL icon next to the path, and then paste that URL into any web browser (you don't have to be authenticated with Twilio). You'll get a text response containing whatever you return from your Function!

Call a Twilio Function from iOS
We can use the standard iOS library to call our Twilio Function. The URLSession (NSURLSession with Objective-C) class lets us create a data task that takes a URL and a closure (completion block in Objective-C) as an argument. Your closure will get the HTTP response, the Data/NSData returned by the server, and an error (if there was one) as arguments. We check to see if the error exists, and if it does not, we create a string from the Data and print it out. Be sure to call resume on the task to initiate the HTTP Request—this step is commonly forgotten.
Call a Twilio Function from iOS
Objective-CSwift
Report code block
Copy code block
NSString* functionURL = @"https://yourdomain.twil.io/joke";


NSURL *url = [NSURL URLWithString:functionURL];


NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithURL:url completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {


   if (error) {


       NSLog(@"Error: %@",error);


   } else {


       NSString *responseString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];


       NSLog(@"Response: %@", responseString);


   }


}];


[task resume];
(warning)
Warning
If you are calling Twilio Functions from an Xcode Playground with Swift, you will need to tell the Playground to run indefinitely (so the HTTP call can return).
To do this, you will need to import the PlaygroundSupport framework, and then include this line of code at the bottom:
PlaygroundPage.current.needsIndefiniteExecution = true

Return JSON from a Twilio Function
Our previous example Function returned plain text. You can also return JSON from a Twilio Function, by passing a JavaScript object or array to the callback function. For instance, we can create another Twilio Function to return a list of jokes, along with an id and a favorite count. Create a new Function with a path of /jokes.
A Twilio Function that Returns a JSON Array
Copy code block
exports.handler = (context, event, callback) => {


 const knockKnock = { id: 1, text: 'Knock, knock', favorited: 37 };


 const chicken = {


   id: 2,


   text: 'Why did the chicken cross the road?',


   favorited: 12,


 };


 const jokes = [knockKnock, chicken];


 return callback(null, jokes);


};

Parse JSON from a Twilio Function
From iOS, we call this Function the same way that we did our first Function (don't forget to change the path to /jokes). Instead of creating a String/NSString from data, we will use iOS's built-in JSON Serialization to parse the response data into an array.
Call a Twilio Function that returns JSON from iOS
Objective-CSwift
Report code block
Copy code block
NSString* functionURL = @"https://yourdomain.twil.io/jokes";


NSURL *url = [NSURL URLWithString:functionURL];


NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithURL:url completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {


   if (error) {


       NSLog(@"Error: %@",error);


   } else {


       NSError *error;


       id responseObject = [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];


       NSLog(@"Response: %@", responseObject);


   }


}];


[task resume];
You've now seen how to run Node.js code as a Twilio Function, and how your mobile application can use this as a serverless backend to provide data for your application.
Where to go next? You could extend the Function to choose a random joke from that array. You can also use Twilio functionality from inside your Function, for instance to send an SMS, or to return an access token for Video, Chat, or Sync. Check out the Programmable SMS Quickstart for Twilio Functions and Programmable Voice Quickstart for Twilio Functions for more quick introductions to these key features of Functions.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
How to call Functions from iOS | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Migration guides
Migrating from Functions(Classic) to the new Functions Editor
Node.js v22 upgrade
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
Advantages
How to migrate functions from Functions(Classic) to the new editor
Migrating from Functions(Classic) to the new Functions Editor

(warning)
Warning
If you are using Services or Functions(Classic) and have included your auth token directly instead of using a variable, you must wait for 1 minute for the update of your auth token to propagate. Otherwise, those functions and services will fail with a 403 Forbidden error.
The Functions Editor is the all-new, redesigned way to experience Twilio Functions.

Expand image
Functions(Classic) now has its own sub-menu in the Twilio Console, within the Functions product menu.

Expand image

Advantages
Advantages of the new editor include:
The new Functions Editor is built on a separate infrastructure from that of Functions(Classic), and utilizes the latest V2 APIs.
The ability to access logs live, or via the Logs endpoint at a later date. In Functions(Classic), logs were only available live while in the Console UI.
Increased reliability and refined user experience.
Easier organization and separation of your Twilio applications via the use of Services.

How to migrate functions from Functions(Classic) to the new editor
Create a Service in the new Functions editor to house your application.
Copy the code from an existing Functions(classic) Function.
Create a Function of the same name within the Service that you just created, using the Add+ button in new Functions Editor.
Paste your code into the new Function, and click Save to save the Function.
Configure any Dependencies for the Service.
Configure any Environment Variables for the Service.
Click Deploy all to deploy your Service and all of its Functions (and Assets, if any).
If you have phone numbers configured to point to your old, Functions(classic) Function, configure the phone numbers to point to the new Function(s) that we just created.
(information)
Info
If you have multiple Twilio applications, create a Service for each application. That way, you can group the Functions that belong to a specific application together under one Service.
(warning)
Warning
Assets(Classic) and new Functions Editor are not compatible. You will need to re-upload any Assets(Classic) as Assets in order to work with them in the new editor.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Migrating from Functions(Classic) to the new Functions Editor | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Functions and Assets
Return to Serverless overview
Overview
Technical concepts
Get started
Serverless Toolkit
Developer guides
Examples
Migration guides
Migrating from Functions(Classic) to the new Functions Editor
Node.js v22 upgrade
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
What do you need to know?
What do you need to do?
What happens if I do nothing?
How do I upgrade to Node.js v22?
Using the Functions Editor UI
Using the Serverless API
Using the Serverless Toolkit
How do I verify that the upgrade was successful?
What if I'm still using Functions(Classic)?
Possible Side Effects
Functions and Assets Node.js v22 Upgrade

What do you need to know?
We are keeping your runtime up to date in accordance with industry standards. Based on the Node.js support schedule
, Node.js v18 is no longer in Maintenance long-term support (LTS). Production applications should only use releases of Node.js that are Active LTS or Maintenance LTS.

What do you need to do?
Re-deploy and test your Functions on the Node.js v22 runtime before November 10th, 2025. A deployment will be required to make your Functions run on the new version of Node.js.
After November 10th, 2025, if you make changes to your Functions, they will need to be deployed on Node.js v20 or v22.
Currently, the Node.js version will only change if you explicitly set it via either the UI dropdown in the Dependencies tab, by passing runtime when using the Serverless Toolkit, or by explicitly setting the runtime parameter when creating a Build.

What happens if I do nothing?
Your currently deployed Functions will continue to execute on the existing Node.js v18 runtime if no changes are made.
After November 10th, 2025, if you create a new Service or deploy a Service that has not yet been deployed, it will use Node.js v22 by default.
If you have an existing build of a Service deployed, it will continue to use the previously set runtime. After November 10th, 2025, any new deployments must be made on Node.js v20 or v22; you will not be able to create any new deployments using Node.js v18.
If a Service contains only Assets, then the default Node.js runtime will be used automatically for builds (regardless of the runtime parameter that is sent as part of the Build request). After June 1st, 2025, the default runtime will be Node.js v22.
(information)
Info
We encourage all customers to upgrade to Node.js v22, even if you are not planning on making any other changes to your Functions.

How do I upgrade to Node.js v22?
Follow the instructions below to upgrade, test, and deploy your code on Node.js v22 before the November 10th, 2025 deadline.
(error)
Danger
While there are no syntax changes required for the upgrade from Node.js v18 to v22, a possible area of impact is your Service's NPM dependencies. It is important to check that the dependencies you include are supported on Node.js v22.
Using the Functions Editor UI
If you have built your application with the latest Functions Editor
, you can update your Node.js runtime by following these steps:
Open the Dependencies tab of an existing Service that you wish to update.
Open the Node Version dropdown menu, and select Node.js v22.
Click the Deploy All button to build and deploy your Service. Once complete, all Functions within that Service will be running on Node.js v22.
Using the Serverless API
If you are using the Serverless API to build and deploy your Services, you can update your Node.js runtime by creating a new Build of your Service with the runtime parameter set to node22.
Using the Twilio CLI and your own Service SID, the command will be:
Copy code block
twilio api:serverless:v1:services:builds:create \


   --service-sid ZSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX \


   --runtime node22
If you'd prefer to use an SDK to trigger this build, refer to the Build documentation for examples of how to trigger a build in every supported programming language.
Using the Serverless Toolkit
(warning)
Warning
Some Serverless Toolkit components depend on 3rd party libraries. These dependencies can be updated by their creators to support Node.js v22 without prior notice. We encourage all customers to upgrade to Node.js v22, even if you are not planning on making any other changes to your Functions.
(warning)
Warning
To avoid unexpected side effects when trying out Node.js v22 make sure to follow these exact steps. Learn more about the possible side effects.
Validate you are on the correct Serverless Toolkit version
You should be using @twilio-labs/plugin-serverless version 3.3.0 or newer. You can run twilio plugins to verify your version.
If your version of the Serverless Toolkit does not meet these requirements, you may upgrade to the latest version using the following commands:
Copy code block
twilio plugins:remove @twilio-labs/plugin-serverless


twilio plugins:install @twilio-labs/plugin-serverless@latest
Define your baseline Node.js version
Open the .twilioserverlessrc configuration file at the root of your project and make sure it includes:
Copy code block
{


 "runtime": "node22"


}
This will ensure that if you don't declare a specific Node.js runtime it will always use Node.js v18 to ensure that you are not accidentally switching to Node.js v22 before verifying it.
If you are working with multiple people or deploying as part of your CI/CD system, make sure that everyone in your team has the updated .twilioserverlessrc file, for example by pushing it to your version control system.
Create your first deployment with Node.js v22
To trigger a new deployment with Node.js v22 you can use the --runtime flag. Ideally deploy to a new environment, so you can verify the functionality in isolation.
The deployment command will be:
Copy code block
twilio serverless:deploy --runtime node22 --environment verify-22
Your Functions will now be deployed and running on the Node.js v22 runtime in that environment.
Finalize your Node.js v22 transition
Once you have verified your code with Node.js v22, you can update the .twilioserverlessrc file to use node22 as the runtime.
Copy code block
{


 "runtime": "node22"


}
That means any future deployments will use Node.js v22 even if you don't pass in the specific runtime using the --runtime flag.

How do I verify that the upgrade was successful?
Your runtime version of Node.js is exposed on the process.version variable, so creating, deploying, and calling a short Function like this will return the current version for verification purposes:
Copy code block
exports.handler = (context, event, callback) => {


 return callback(null, process.version);


};

What if I'm still using Functions(Classic)?
The simplest way to upgrade is to start by using the new Functions editor.
Create a new Service in the New Functions editor
.
Copy your Functions code into the new Service as new Functions.
Copy over any Environment Variables and/or Dependencies that your Function(s) use.
Deploy your new Functions by clicking Deploy All. After June 1st, 2025, your code will be deployed using Node.js v22 by default.
If you wish to test with Node.js v22, you can do so by navigating to the Dependencies tab, selecting Node.js v22 from the Node Version dropdown, and clicking Deploy All for the change to take effect.
Test that your Functions work as expected in the new Service. Once confident, you can switch your Functions to use Node.js v22.
Be sure to update any references to your old Function (e.g. Studio Flows, Twilio number config) to use the new Function URL. You can copy your new Function URL by clicking Copy URL at the bottom right of the Function editor.
(information)
Info
If you would like to change the Node.js runtime within Functions(Classic)
, please reach out to support with your Account SID and request that they change the Node.js runtime for you.

Possible Side Effects
If you are using the API directly or the Serverless Toolkit, you might encounter possible side effects if you don't explicitly specify a runtime with each deployment.
By default, if you are not specifying a runtime when creating a Build the API will use the runtime you used for the last successful Build. That means if you successfully deployed your code with Node.js v22 once, any subsequent deployments that don't specify a specific runtime will automatically use Node.js v22 going forward.
To avoid these side effects:
With the API: Always pass a runtime parameter when creating a Build
With the Serverless Toolkit: Make sure to follow the steps outlined above, especially defining a default runtime in the .twilioserverlessrc file.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Functions and Assets Node.js v22 Upgrade | Twilio

