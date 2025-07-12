# LaunchDarkly API Documentation

Overview
This documentation describes LaunchDarkly’s REST API.
To access the complete OpenAPI spec directly, use Get OpenAPI spec.
Authentication
LaunchDarkly’s REST API uses the HTTPS protocol with a minimum TLS version of 1.2.
All REST API resources are authenticated with either personal or service access tokens, or session cookies. Other authentication mechanisms are not supported. You can manage personal access tokens on your Authorization page in the LaunchDarkly UI.
LaunchDarkly also has SDK keys, mobile keys, and client-side IDs that are used by our server-side SDKs, mobile SDKs, and JavaScript-based SDKs, respectively. These keys cannot be used to access our REST API. These keys are environment-specific, and can only perform read-only operations such as fetching feature flag settings.
Auth mechanism
Allowed resources
Use cases
Personal or service access tokens
Can be customized on a per-token basis
Building scripts, custom integrations, data export.
SDK keys
Can only access read-only resources specific to server-side SDKs. Restricted to a single environment.
Server-side SDKs
Mobile keys
Can only access read-only resources specific to mobile SDKs, and only for flags marked available to mobile keys. Restricted to a single environment.
Mobile SDKs
Client-side ID
Can only access read-only resources specific to JavaScript-based client-side SDKs, and only for flags marked available to client-side. Restricted to a single environment.
Client-side JavaScript

Keep your access tokens and SDK keys private
Access tokens should never be exposed in untrusted contexts. Never put an access token in client-side JavaScript, or embed it in a mobile application. LaunchDarkly has special mobile keys that you can embed in mobile apps. If you accidentally expose an access token or SDK key, you can reset it from your Authorization page.
The client-side ID is safe to embed in untrusted contexts. It’s designed for use in client-side JavaScript.
Authentication using request header
The preferred way to authenticate with the API is by adding an Authorization header containing your access token to your requests. The value of the Authorization header must be your access token.
Manage personal access tokens from the Authorization page.
Authentication using session cookie
For testing purposes, you can make API calls directly from your web browser. If you are logged in to the LaunchDarkly application, the API will use your existing session to authenticate calls.
Depending on the permissions granted as part of your role, you may not have permission to perform some API calls. You will receive a 401 response code in that case.
Modifying the Origin header causes an error
LaunchDarkly validates that the Origin header for any API request authenticated by a session cookie matches the expected Origin header. The expected Origin header is https://app.launchdarkly.com.
If the Origin header does not match what’s expected, LaunchDarkly returns an error. This error can prevent the LaunchDarkly app from working correctly.
Any browser extension that intentionally changes the Origin header can cause this problem. For example, the Allow-Control-Allow-Origin: * Chrome extension changes the Origin header to http://evil.com and causes the app to fail.
To prevent this error, do not modify your Origin header.
LaunchDarkly does not require origin matching when authenticating with an access token, so this issue does not affect normal API usage.
Representations
All resources expect and return JSON response bodies. Error responses also send a JSON body. To learn more about the error format of the API, read Errors.
In practice this means that you always get a response with a Content-Type header set to application/json.
In addition, request bodies for PATCH, POST, and PUT requests must be encoded as JSON with a Content-Type header set to application/json.
Summary and detailed representations
When you fetch a list of resources, the response includes only the most important attributes of each resource. This is a summary representation of the resource. When you fetch an individual resource, such as a single feature flag, you receive a detailed representation of the resource.
The best way to find a detailed representation is to follow links. Every summary representation includes a link to its detailed representation.
Expanding responses
Sometimes the detailed representation of a resource does not include all of the attributes of the resource by default. If this is the case, the request method will clearly document this and describe which attributes you can include in an expanded response.
To include the additional attributes, append the expand request parameter to your request and add a comma-separated list of the attributes to include. For example, when you append ?expand=members,maintainers to the Get team endpoint, the expanded response includes both of these attributes.
Links and addressability
The best way to navigate the API is by following links. These are attributes in representations that link to other resources. The API always uses the same format for links:
Links to other resources within the API are encapsulated in a _links object
If the resource has a corresponding link to HTML content on the site, it is stored in a special _site link
Each link has two attributes:
An href, which contains the URL
A type, which describes the content type
For example, a feature resource might return the following:
{
 "_links": {
   "parent": {
     "href": "/api/features",
     "type": "application/json"
   },
   "self": {
     "href": "/api/features/sort.order",
     "type": "application/json"
   }
 },
 "_site": {
   "href": "/features/sort.order",
   "type": "text/html"
 }
}

From this, you can navigate to the parent collection of features by following the parent link, or navigate to the site page for the feature by following the _site link.
Collections are always represented as a JSON object with an items attribute containing an array of representations. Like all other representations, collections have _links defined at the top level.
Paginated collections include first, last, next, and prev links containing a URL with the respective set of elements in the collection.
Updates
Resources that accept partial updates use the PATCH verb. Most resources support the JSON patch format. Some resources also support the JSON merge patch format, and some resources support the semantic patch format, which is a way to specify the modifications to perform as a set of executable instructions. Each resource supports optional comments that you can submit with updates. Comments appear in outgoing webhooks, the audit log, and other integrations.
When a resource supports both JSON patch and semantic patch, we document both in the request method. However, the specific request body fields and descriptions included in our documentation only match one type of patch or the other.
Updates using JSON patch
JSON patch is a way to specify the modifications to perform on a resource. JSON patch uses paths and a limited set of operations to describe how to transform the current state of the resource into a new state. JSON patch documents are always arrays, where each element contains an operation, a path to the field to update, and the new value.
For example, in this feature flag representation:
{
   "name": "New recommendations engine",
   "key": "engine.enable",
   "description": "This is the description",
   ...
}

You can change the feature flag’s description with the following patch document:
[{ "op": "replace", "path": "/description", "value": "This is the new description" }]

You can specify multiple modifications to perform in a single request. You can also test that certain preconditions are met before applying the patch:
[
 { "op": "test", "path": "/version", "value": 10 },
 { "op": "replace", "path": "/description", "value": "The new description" }
]

The above patch request tests whether the feature flag’s version is 10, and if so, changes the feature flag’s description.
Attributes that are not editable, such as a resource’s _links, have names that start with an underscore.
Updates using JSON merge patch
JSON merge patch is another format for specifying the modifications to perform on a resource. JSON merge patch is less expressive than JSON patch. However, in many cases it is simpler to construct a merge patch document. For example, you can change a feature flag’s description with the following merge patch document:
{
 "description": "New flag description"
}

Updates using semantic patch
Some resources support the semantic patch format. A semantic patch is a way to specify the modifications to perform on a resource as a set of executable instructions.
Semantic patch allows you to be explicit about intent using precise, custom instructions. In many cases, you can define semantic patch instructions independently of the current state of the resource. This can be useful when defining a change that may be applied at a future date.
To make a semantic patch request, you must append domain-model=launchdarkly.semanticpatch to your Content-Type header.
Here’s how:
Content-Type: application/json; domain-model=launchdarkly.semanticpatch

If you call a semantic patch resource without this header, you will receive a 400 response because your semantic patch will be interpreted as a JSON patch.
The body of a semantic patch request takes the following properties:
comment (string): (Optional) A description of the update.
environmentKey (string): (Required for some resources only) The environment key.
instructions (array): (Required) A list of actions the update should perform. Each action in the list must be an object with a kind property that indicates the instruction. If the instruction requires parameters, you must include those parameters as additional fields in the object. The documentation for each resource that supports semantic patch includes the available instructions and any additional parameters.
For example:
{
 "comment": "optional comment",
 "instructions": [ {"kind": "turnFlagOn"} ]
}

Semantic patches are not applied partially; either all of the instructions are applied or none of them are. If any instruction is invalid, the endpoint returns an error and will not change the resource. If all instructions are valid, the request succeeds and the resources are updated if necessary, or left unchanged if they are already in the state you request.
Updates with comments
You can submit optional comments with PATCH changes.
To submit a comment along with a JSON patch document, use the following format:
{
 "comment": "This is a comment string",
 "patch": [{ "op": "replace", "path": "/description", "value": "The new description" }]
}

To submit a comment along with a JSON merge patch document, use the following format:
{
 "comment": "This is a comment string",
 "merge": { "description": "New flag description" }
}

To submit a comment along with a semantic patch, use the following format:
{
 "comment": "This is a comment string",
 "instructions": [ {"kind": "turnFlagOn"} ]
}

Errors
The API always returns errors in a common format. Here’s an example:
{
 "code": "invalid_request",
 "message": "A feature with that key already exists",
 "id": "30ce6058-87da-11e4-b116-123b93f75cba"
}

The code indicates the general class of error. The message is a human-readable explanation of what went wrong. The id is a unique identifier. Use it when you’re working with LaunchDarkly Support to debug a problem with a specific API call.
HTTP status error response codes
Code
Definition
Description
Possible Solution
400
Invalid request
The request cannot be understood.
Ensure JSON syntax in request body is correct.
401
Invalid access token
Requestor is unauthorized or does not have permission for this API call.
Ensure your API access token is valid and has the appropriate permissions.
403
Forbidden
Requestor does not have access to this resource.
Ensure that the account member or access token has proper permissions set.
404
Invalid resource identifier
The requested resource is not valid.
Ensure that the resource is correctly identified by ID or key.
405
Method not allowed
The request method is not allowed on this resource.
Ensure that the HTTP verb is correct.
409
Conflict
The API request can not be completed because it conflicts with a concurrent API request.
Retry your request.
422
Unprocessable entity
The API request can not be completed because the update description can not be understood.
Ensure that the request body is correct for the type of patch you are using, either JSON patch or semantic patch.
429
Too many requests
Read Rate limiting.
Wait and try again later.

CORS
The LaunchDarkly API supports Cross Origin Resource Sharing (CORS) for AJAX requests from any origin. If an Origin header is given in a request, it will be echoed as an explicitly allowed origin. Otherwise the request returns a wildcard, Access-Control-Allow-Origin: *. For more information on CORS, read the CORS W3C Recommendation. Example CORS headers might look like:
Access-Control-Allow-Headers: Accept, Content-Type, Content-Length, Accept-Encoding, Authorization
Access-Control-Allow-Methods: OPTIONS, GET, DELETE, PATCH
Access-Control-Allow-Origin: *
Access-Control-Max-Age: 300

You can make authenticated CORS calls just as you would make same-origin calls, using either token or session-based authentication. If you are using session authentication, you should set the withCredentials property for your xhr request to true. You should never expose your access tokens to untrusted entities.
Rate limiting
We use several rate limiting strategies to ensure the availability of our APIs. Rate-limited calls to our APIs return a 429 status code. Calls to our APIs include headers indicating the current rate limit status. The specific headers returned depend on the API route being called. The limits differ based on the route, authentication mechanism, and other factors. Routes that are not rate limited may not contain any of the headers described below.
Rate limiting and SDKs
LaunchDarkly SDKs are never rate limited and do not use the API endpoints defined here. LaunchDarkly uses a different set of approaches, including streaming/server-sent events and a global CDN, to ensure availability to the routes used by LaunchDarkly SDKs.
Global rate limits
Authenticated requests are subject to a global limit. This is the maximum number of calls that your account can make to the API per ten seconds. All service and personal access tokens on the account share this limit, so exceeding the limit with one access token will impact other tokens. Calls that are subject to global rate limits may return the headers below:
Header name
Description
X-Ratelimit-Global-Remaining
The maximum number of requests the account is permitted to make per ten seconds.
X-Ratelimit-Reset
The time at which the current rate limit window resets in epoch milliseconds.

We do not publicly document the specific number of calls that can be made globally. This limit may change, and we encourage clients to program against the specification, relying on the two headers defined above, rather than hardcoding to the current limit.
Route-level rate limits
Some authenticated routes have custom rate limits. These also reset every ten seconds. Any service or personal access tokens hitting the same route share this limit, so exceeding the limit with one access token may impact other tokens. Calls that are subject to route-level rate limits return the headers below:
Header name
Description
X-Ratelimit-Route-Remaining
The maximum number of requests to the current route the account is permitted to make per ten seconds.
X-Ratelimit-Reset
The time at which the current rate limit window resets in epoch milliseconds.

A route represents a specific URL pattern and verb. For example, the Delete environment endpoint is considered a single route, and each call to delete an environment counts against your route-level rate limit for that route.
We do not publicly document the specific number of calls that an account can make to each endpoint per ten seconds. These limits may change, and we encourage clients to program against the specification, relying on the two headers defined above, rather than hardcoding to the current limits.
IP-based rate limiting
We also employ IP-based rate limiting on some API routes. If you hit an IP-based rate limit, your API response will include a Retry-After header indicating how long to wait before re-trying the call. Clients must wait at least Retry-After seconds before making additional calls to our API, and should employ jitter and backoff strategies to avoid triggering rate limits again.
OpenAPI (Swagger) and client libraries
We have a complete OpenAPI (Swagger) specification for our API.
We auto-generate multiple client libraries based on our OpenAPI specification. To learn more, visit the collection of client libraries on GitHub. You can also use this specification to generate client libraries to interact with our REST API in your language of choice.
Our OpenAPI specification is supported by several API-based tools such as Postman and Insomnia. In many cases, you can directly import our specification to explore our APIs.
Method overriding
Some firewalls and HTTP clients restrict the use of verbs other than GET and POST. In those environments, our API endpoints that use DELETE, PATCH, and PUT verbs are inaccessible.
To avoid this issue, our API supports the X-HTTP-Method-Override header, allowing clients to “tunnel” DELETE, PATCH, and PUT requests using a POST request.
For example, to call a PATCH endpoint using a POST request, you can include X-HTTP-Method-Override:PATCH as a header.
Beta resources
We sometimes release new API resources in beta status before we release them with general availability.
Resources that are in beta are still undergoing testing and development. They may change without notice, including becoming backwards incompatible.
We try to promote resources into general availability as quickly as possible. This happens after sufficient testing and when we’re satisfied that we no longer need to make backwards-incompatible changes.
We mark beta resources with a “Beta” callout in our documentation, pictured below:
This feature is in beta
To use this feature, pass in a header including the LD-API-Version key with value set to beta. Use this header with each call. To learn more, read Beta resources.
Resources that are in beta are still undergoing testing and development. They may change without notice, including becoming backwards incompatible.
Using beta resources
To use a beta resource, you must include a header in the request. If you call a beta resource without this header, you receive a 403 response.
Use this header:
LD-API-Version: beta

Federal environments
The version of LaunchDarkly that is available on domains controlled by the United States government is different from the version of LaunchDarkly available to the general public. If you are an employee or contractor for a United States federal agency and use LaunchDarkly in your work, you likely use the federal instance of LaunchDarkly.
If you are working in the federal instance of LaunchDarkly, the base URI for each request is https://app.launchdarkly.us.
To learn more, read LaunchDarkly in federal environments.
Versioning
We try hard to keep our REST API backwards compatible, but we occasionally have to make backwards-incompatible changes in the process of shipping new features. These breaking changes can cause unexpected behavior if you don’t prepare for them accordingly.
Updates to our REST API include support for the latest features in LaunchDarkly. We also release a new version of our REST API every time we make a breaking change. We provide simultaneous support for multiple API versions so you can migrate from your current API version to a new version at your own pace.
Setting the API version per request
You can set the API version on a specific request by sending an LD-API-Version header, as shown in the example below:
LD-API-Version: 20240415

The header value is the version number of the API version you would like to request. The number for each version corresponds to the date the version was released in yyyymmdd format. In the example above the version 20240415 corresponds to April 15, 2024.
Setting the API version per access token
When you create an access token, you must specify a specific version of the API to use. This ensures that integrations using this token cannot be broken by version changes.
Tokens created before versioning was released have their version set to 20160426, which is the version of the API that existed before the current versioning scheme, so that they continue working the same way they did before versioning.
If you would like to upgrade your integration to use a new API version, you can explicitly set the header described above.
Best practice: Set the header for every client or integration
We recommend that you set the API version header explicitly in any client or integration you build.
Only rely on the access token API version during manual testing.
API version changelog
Version
Changes
End of life (EOL)
20240415
Changed several endpoints from unpaginated to paginated. Use the limit and offset query parameters to page through the results.
Changed the list access tokens endpoint:
Response is now paginated with a default limit of 25
Changed the list account members endpoint:
The accessCheck filter is no longer available
Changed the list custom roles endpoint:
Response is now paginated with a default limit of 20
Changed the list feature flags endpoint:
Response is now paginated with a default limit of 20
The environments field is now only returned if the request is filtered by environment, using the filterEnv query parameter
The followerId, hasDataExport, status, contextKindTargeted, and segmentTargeted filters are no longer available
The compare query parameter is no longer available
Changed the list segments endpoint:
Response is now paginated with a default limit of 20
Changed the list teams endpoint:
The expand parameter no longer supports including projects or roles
In paginated results, the maximum page size is now 100
Changed the get workflows endpoint:
Response is now paginated with a default limit of 20
The _conflicts field in the response is no longer available
Current
20220603
Changed the list projects return value:
Response is now paginated with a default limit of 20.
Added support for filter and sort.
The project environments field is now expandable. This field is omitted by default.
Changed the get project return value:
The environments field is now expandable. This field is omitted by default.
2025-04-15
20210729
Changed the create approval request return value. It now returns HTTP Status Code 201 instead of 200.
Changed the get user return value. It now returns a user record, not a user.
Added additional optional fields to environment, segments, flags, members, and segments, including the ability to create big segments.
Added default values for flag variations when new environments are created.
Added filtering and pagination for getting flags and members, including limit, number, filter, and sort query parameters.
Added endpoints for expiring user targets for flags and segments, scheduled changes, access tokens, Relay Proxy configuration, integrations and subscriptions, and approvals.
2023-06-03
20191212
List feature flags now defaults to sending summaries of feature flag configurations, equivalent to setting the query parameter summary=true. Summaries omit flag targeting rules and individual user targets from the payload.
Added endpoints for flags, flag status, projects, environments, audit logs, members, users, custom roles, segments, usage, streams, events, and data export.
2022-07-29
20160426
Initial versioning of API. Tokens created before versioning have their version set to this.
2020-12-12

To learn more about how EOL is determined, read LaunchDarkly’s End of Life (EOL) Policy.

Access tokens
The access tokens API allows you to list, create, modify, and delete access tokens programmatically.
When using access tokens to manage access tokens, the following restrictions apply:
Personal tokens can see all service tokens and other personal tokens created by the same team member. If the personal token has the “Admin” role, it may also see other member’s personal tokens. To learn more, read Personal tokens.
Service tokens can see all service tokens. If the token has the “Admin” role, it may also see all personal tokens. To learn more, read Service tokens.
Tokens can only manage other tokens, including themselves, if they have “Admin” role or explicit permission via a custom role. To learn more, read Personal access token actions.
Several of the endpoints in the access tokens API require an access token ID. The access token ID is returned as part of the Create access token and List access tokens responses. It is the _id field, or the _id field of each element in the items array.
To learn more about access tokens, read API access tokens.
​​Get access token
GET
https://app.launchdarkly.com/api/v2/tokens/:id
GET
/api/v2/tokens/:id
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/tokens/id';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_id": "_id",
 "ownerId": "ownerId",
 "memberId": "memberId",
 "creationDate": 1000000,
 "lastModified": 1000000,
 "_links": {
   "parent": {
     "href": "/api/v2/tokens",
     "type": "application/json"
   },
   "self": {
     "href": "/api/v2/tokens/61095542756dba551110ae21",
     "type": "application/json"
   }
 },
 "_member": {
   "_links": {
     "self": {
       "href": "/api/v2/members/569f183514f4432160000007",
       "type": "application/json"
     }
   },
   "_id": "569f183514f4432160000007",
   "role": "admin",
   "email": "ariel@acme.com",
   "firstName": "Ariel",
   "lastName": "Flores"
 },
 "name": "Example reader token",
 "description": "A reader token used in testing and examples",
 "customRoleIds": [
   "customRoleIds"
 ],
 "inlineRole": [
   {
     "effect": "allow",
     "resources": [
       "proj/*:env/*;qa_*:/flag/*"
     ],
     "notResources": [
       "notResources"
     ],
     "actions": [
       "*"
     ],
     "notActions": [
       "notActions"
     ]
   }
 ],
 "role": "reader",
 "token": "1234",
 "serviceToken": false,
 "defaultApiVersion": 20220603,
 "lastUsed": 1000000
}

Get a single access token by ID.
Path parameters
idstringRequired
The ID of the access token
Headers
AuthorizationstringRequired
Response
Access token response
_idstring
The ID of the access token
ownerIdstring
The ID of the owner of the account for the access token
memberIdstring
The ID of the member who created the access token
creationDatelong
Timestamp of when the access token was created
lastModifiedlong
Timestamp of the last modification of the access token
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
_memberobject or null
Details on the member who created the access token
Show 6 properties
namestring or null
A human-friendly name for the access token
descriptionstring or null
A description for the access token
customRoleIdslist of strings or null
A list of custom role IDs to use as access limits for the access token
inlineRolelist of objects or null
An array of policy statements, with three attributes: effect, resources, actions. May be used in place of a role.
Show 5 properties
rolestring or null
Base role for the token
tokenstring or null
The token value. When creating or resetting, contains the entire token value. Otherwise, contains the last four characters.
serviceTokenboolean or null
Whether this is a service token or a personal token
defaultApiVersioninteger or null
The default API version for this token
lastUsedlong or null
Timestamp of when the access token was last used
Errors
401
Get Token Request Unauthorized Error
403
Get Token Request Forbidden Error
404
Get Token Request Not Found Error
429
Get Token Request Too Many Requests Error
List access tokens
GET
https://app.launchdarkly.com/api/v2/tokens
GET
/api/v2/tokens
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/tokens';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "items": [
   {
     "_id": "_id",
     "ownerId": "ownerId",
     "memberId": "memberId",
     "creationDate": 1000000,
     "lastModified": 1000000,
     "_links": {
       "parent": {
         "href": "/api/v2/tokens",
         "type": "application/json"
       },
       "self": {
         "href": "/api/v2/tokens/61095542756dba551110ae21",
         "type": "application/json"
       }
     },
     "_member": {
       "_links": {
         "self": {
           "href": "/api/v2/members/569f183514f4432160000007",
           "type": "application/json"
         }
       },
       "_id": "569f183514f4432160000007",
       "role": "admin",
       "email": "ariel@acme.com",
       "firstName": "Ariel",
       "lastName": "Flores"
     },
     "name": "Example reader token",
     "description": "A reader token used in testing and examples",
     "customRoleIds": [
       "customRoleIds"
     ],
     "inlineRole": [
       {
         "effect": "allow"
       }
     ],
     "role": "reader",
     "token": "1234",
     "serviceToken": false,
     "defaultApiVersion": 20220603,
     "lastUsed": 1000000
   }
 ],
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "totalCount": 1
}

Fetch a list of all access tokens.
Headers
AuthorizationstringRequired
Query parameters
showAllbooleanOptional
If set to true, and the authentication access token has the 'Admin' role, personal access tokens for all members will be retrieved.
limitlongOptional
The number of access tokens to return in the response. Defaults to 25.
offsetlongOptional
Where to start in the list. This is for use with pagination. For example, an offset of 10 skips the first ten items and then returns the next items in the list, up to the query limit.
Response
Access tokens collection response
itemslist of objects or null
An array of access tokens
Show 16 properties
_linksmap from strings to objects or null
Show 2 properties
totalCountinteger or null
The number of access tokens returned
Errors
401
Get Tokens Request Unauthorized Error
403
Get Tokens Request Forbidden Error
429
Get Tokens Request Too Many Requests Error
Patch access token
PATCH
https://app.launchdarkly.com/api/v2/tokens/:id
PATCH
/api/v2/tokens/:id
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/tokens/id';
const options = {
 method: 'PATCH',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"0":{"op":"replace","path":"/role","value":"writer"}}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Updated
{
 "_id": "_id",
 "ownerId": "ownerId",
 "memberId": "memberId",
 "creationDate": 1000000,
 "lastModified": 1000000,
 "_links": {
   "parent": {
     "href": "/api/v2/tokens",
     "type": "application/json"
   },
   "self": {
     "href": "/api/v2/tokens/61095542756dba551110ae21",
     "type": "application/json"
   }
 },
 "_member": {
   "_links": {
     "self": {
       "href": "/api/v2/members/569f183514f4432160000007",
       "type": "application/json"
     }
   },
   "_id": "569f183514f4432160000007",
   "role": "admin",
   "email": "ariel@acme.com",
   "firstName": "Ariel",
   "lastName": "Flores"
 },
 "name": "Example reader token",
 "description": "A reader token used in testing and examples",
 "customRoleIds": [
   "customRoleIds"
 ],
 "inlineRole": [
   {
     "effect": "allow",
     "resources": [
       "proj/*:env/*;qa_*:/flag/*"
     ],
     "notResources": [
       "notResources"
     ],
     "actions": [
       "*"
     ],
     "notActions": [
       "notActions"
     ]
   }
 ],
 "role": "reader",
 "token": "1234",
 "serviceToken": false,
 "defaultApiVersion": 20220603,
 "lastUsed": 1000000
}

Update an access token’s settings. Updating an access token uses a JSON patch representation of the desired changes. To learn more, read Updates.
Path parameters
idstringRequired
The ID of the access token to update
Headers
AuthorizationstringRequired
Request
This endpoint expects a list of objects.
opstringRequired
The type of operation to perform
pathstringRequired
A JSON Pointer string specifying the part of the document to operate on
valueanyOptional
Response
Access token response
_idstring
The ID of the access token
ownerIdstring
The ID of the owner of the account for the access token
memberIdstring
The ID of the member who created the access token
creationDatelong
Timestamp of when the access token was created
lastModifiedlong
Timestamp of the last modification of the access token
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
_memberobject or null
Details on the member who created the access token
Show 6 properties
namestring or null
A human-friendly name for the access token
descriptionstring or null
A description for the access token
customRoleIdslist of strings or null
A list of custom role IDs to use as access limits for the access token
inlineRolelist of objects or null
An array of policy statements, with three attributes: effect, resources, actions. May be used in place of a role.
Show 5 properties
rolestring or null
Base role for the token
tokenstring or null
The token value. When creating or resetting, contains the entire token value. Otherwise, contains the last four characters.
serviceTokenboolean or null
Whether this is a service token or a personal token
defaultApiVersioninteger or null
The default API version for this token
lastUsedlong or null
Timestamp of when the access token was last used
Errors
400
Patch Token Request Bad Request Error
401
Patch Token Request Unauthorized Error
403
Patch Token Request Forbidden Error
404
Patch Token Request Not Found Error
409
Patch Token Request Conflict Error
422
Patch Token Request Unprocessable Entity Error
429
Patch Token Request Too Many Requests Error
Reset access token
POST
https://app.launchdarkly.com/api/v2/tokens/:id/reset
POST
/api/v2/tokens/:id/reset
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/tokens/id/reset';
const options = {method: 'POST', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Successful
{
 "_id": "_id",
 "ownerId": "ownerId",
 "memberId": "memberId",
 "creationDate": 1000000,
 "lastModified": 1000000,
 "_links": {
   "parent": {
     "href": "/api/v2/tokens",
     "type": "application/json"
   },
   "self": {
     "href": "/api/v2/tokens/61095542756dba551110ae21",
     "type": "application/json"
   }
 },
 "_member": {
   "_links": {
     "self": {
       "href": "/api/v2/members/569f183514f4432160000007",
       "type": "application/json"
     }
   },
   "_id": "569f183514f4432160000007",
   "role": "admin",
   "email": "ariel@acme.com",
   "firstName": "Ariel",
   "lastName": "Flores"
 },
 "name": "Example reader token",
 "description": "A reader token used in testing and examples",
 "customRoleIds": [
   "customRoleIds"
 ],
 "inlineRole": [
   {
     "effect": "allow",
     "resources": [
       "proj/*:env/*;qa_*:/flag/*"
     ],
     "notResources": [
       "notResources"
     ],
     "actions": [
       "*"
     ],
     "notActions": [
       "notActions"
     ]
   }
 ],
 "role": "reader",
 "token": "1234",
 "serviceToken": false,
 "defaultApiVersion": 20220603,
 "lastUsed": 1000000
}

Reset an access token's secret key with an optional expiry time for the old key.
Path parameters
idstringRequired
The ID of the access token to update
Headers
AuthorizationstringRequired
Query parameters
expirylongOptional
An expiration time for the old token key, expressed as a Unix epoch time in milliseconds. By default, the token will expire immediately.
Response
Access token response
_idstring
The ID of the access token
ownerIdstring
The ID of the owner of the account for the access token
memberIdstring
The ID of the member who created the access token
creationDatelong
Timestamp of when the access token was created
lastModifiedlong
Timestamp of the last modification of the access token
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
_memberobject or null
Details on the member who created the access token
Show 6 properties
namestring or null
A human-friendly name for the access token
descriptionstring or null
A description for the access token
customRoleIdslist of strings or null
A list of custom role IDs to use as access limits for the access token
inlineRolelist of objects or null
An array of policy statements, with three attributes: effect, resources, actions. May be used in place of a role.
Show 5 properties
rolestring or null
Base role for the token
tokenstring or null
The token value. When creating or resetting, contains the entire token value. Otherwise, contains the last four characters.
serviceTokenboolean or null
Whether this is a service token or a personal token
defaultApiVersioninteger or null
The default API version for this token
lastUsedlong or null
Timestamp of when the access token was last used
Errors
401
Reset Token Request Unauthorized Error
403
Reset Token Request Forbidden Error
404
Reset Token Request Not Found Error
429
Reset Token Request Too Many Requests Error
Add a member to teams
POST
https://app.launchdarkly.com/api/v2/members/:id/teams
POST
/api/v2/members/:id/teams
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/members/id/teams';
const options = {
 method: 'POST',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"teamKeys":["team1","team2"]}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Created
{
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "_id": "507f1f77bcf86cd799439011",
 "role": "reader",
 "email": "ariel@acme.com",
 "_pendingInvite": false,
 "_verified": true,
 "customRoles": [
   "devOps",
   "backend-devs"
 ],
 "mfa": "mfa",
 "_lastSeen": 1000000,
 "creationDate": 1000000,
 "firstName": "Ariel",
 "lastName": "Flores",
 "_pendingEmail": "_pendingEmail",
 "excludedDashboards": [
   "excludedDashboards"
 ],
 "_lastSeenMetadata": {
   "tokenId": "5b52207f8ca8e631d31fdb2b"
 },
 "_integrationMetadata": {
   "externalId": "externalId",
   "externalStatus": {
     "display": "display",
     "value": "value"
   },
   "externalUrl": "externalUrl",
   "lastChecked": 1000000
 },
 "teams": [
   {
     "customRoleKeys": [
       "access-to-test-projects"
     ],
     "key": "team-key-123abc",
     "name": "QA Team",
     "_links": {
       "key": {}
     }
   }
 ],
 "permissionGrants": [
   {
     "resource": "team/qa-team",
     "actionSet": "actionSet",
     "actions": [
       "maintainTeam"
     ]
   }
 ],
 "oauthProviders": [
   "oauthProviders"
 ],
 "version": 1,
 "roleAttributes": {
   "key": [
     "value"
   ]
 }
}

Add one member to one or more teams.
Path parameters
idstringRequired
The member ID
Headers
AuthorizationstringRequired
Request
This endpoint expects an object.
teamKeyslist of stringsRequired
List of team keys
Response
Member response
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
_idstring
The member's ID
rolestring
The member's base role. If the member has no additional roles, this role will be in effect.
emailstring
The member's email address
_pendingInviteboolean
Whether the member has a pending invitation
_verifiedboolean
Whether the member's email address has been verified
customRoleslist of strings
The set of additional roles, besides the base role, assigned to the member
mfastring
Whether multi-factor authentication is enabled for this member
_lastSeenlong
The member’s last session date (as Unix milliseconds since epoch)
creationDatelong
Timestamp of when the member was created
firstNamestring or null
The member's first name
lastNamestring or null
The member's last name
_pendingEmailstring or null
The member's email address before it has been verified, for accounts where email verification is required
excludedDashboardslist of strings or null
Default dashboards that the member has chosen to ignore
_lastSeenMetadataobject or null
Additional metadata associated with the member's last session, for example, whether a token was used
Show 1 properties
_integrationMetadataobject or null
Details on the member account in an external source, if this member is provisioned externally
Show 4 properties
teamslist of objects or null
Details on the teams this member is assigned to
Show 4 properties
permissionGrantslist of objects or null
A list of permission grants. Permission grants allow a member to have access to a specific action, without having to create or update a custom role.
Show 3 properties
oauthProviderslist of strings or null
A list of OAuth providers
versioninteger or null
Version of the current configuration
roleAttributesmap from strings to lists of strings or null
The role attributes for the member
Errors
400
Post Member Teams Request Bad Request Error
401
Post Member Teams Request Unauthorized Error
403
Post Member Teams Request Forbidden Error
404
Post Member Teams Request Not Found Error
409
Post Member Teams Request Conflict Error
429
Post Member Teams Request Too Many Requests Error
Was this page helpful?
Yes

Overview
Account members
The account members API allows you to invite new members to an account by making a POST request to /api/v2/members. When you invite a new member to an account, an invitation is sent to the email you provided. Members with Admin or Owner roles may create new members, as well as anyone with a createMember permission for “member/*”. To learn more, read LaunchDarkly account members.
Any member may request the complete list of account members with a GET to /api/v2/members.
Several of the endpoints in the account members API require a member ID. The member ID is returned as part of the Invite new members and List account members responses. It is the _id field of each element in the items array.
OverviewAccount members
Add a member to teams
POST
https://app.launchdarkly.com/api/v2/members/:id/teams
POST
/api/v2/members/:id/teams
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/members/id/teams';
const options = {
 method: 'POST',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"teamKeys":["team1","team2"]}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Created
{
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "_id": "507f1f77bcf86cd799439011",
 "role": "reader",
 "email": "ariel@acme.com",
 "_pendingInvite": false,
 "_verified": true,
 "customRoles": [
   "devOps",
   "backend-devs"
 ],
 "mfa": "mfa",
 "_lastSeen": 1000000,
 "creationDate": 1000000,
 "firstName": "Ariel",
 "lastName": "Flores",
 "_pendingEmail": "_pendingEmail",
 "excludedDashboards": [
   "excludedDashboards"
 ],
 "_lastSeenMetadata": {
   "tokenId": "5b52207f8ca8e631d31fdb2b"
 },
 "_integrationMetadata": {
   "externalId": "externalId",
   "externalStatus": {
     "display": "display",
     "value": "value"
   },
   "externalUrl": "externalUrl",
   "lastChecked": 1000000
 },
 "teams": [
   {
     "customRoleKeys": [
       "access-to-test-projects"
     ],
     "key": "team-key-123abc",
     "name": "QA Team",
     "_links": {
       "key": {}
     }
   }
 ],
 "permissionGrants": [
   {
     "resource": "team/qa-team",
     "actionSet": "actionSet",
     "actions": [
       "maintainTeam"
     ]
   }
 ],
 "oauthProviders": [
   "oauthProviders"
 ],
 "version": 1,
 "roleAttributes": {
   "key": [
     "value"
   ]
 }
}

Add one member to one or more teams.
Path parameters
idstringRequired
The member ID
Headers
AuthorizationstringRequired
Request
This endpoint expects an object.
teamKeyslist of stringsRequired
List of team keys
Response
Member response
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
_idstring
The member's ID
rolestring
The member's base role. If the member has no additional roles, this role will be in effect.
emailstring
The member's email address
_pendingInviteboolean
Whether the member has a pending invitation
_verifiedboolean
Whether the member's email address has been verified
customRoleslist of strings
The set of additional roles, besides the base role, assigned to the member
mfastring
Whether multi-factor authentication is enabled for this member
_lastSeenlong
The member’s last session date (as Unix milliseconds since epoch)
creationDatelong
Timestamp of when the member was created
firstNamestring or null
The member's first name
lastNamestring or null
The member's last name
_pendingEmailstring or null
The member's email address before it has been verified, for accounts where email verification is required
excludedDashboardslist of strings or null
Default dashboards that the member has chosen to ignore
_lastSeenMetadataobject or null
Additional metadata associated with the member's last session, for example, whether a token was used
Show 1 properties
_integrationMetadataobject or null
Details on the member account in an external source, if this member is provisioned externally
Show 4 properties
teamslist of objects or null
Details on the teams this member is assigned to
Show 4 properties
permissionGrantslist of objects or null
A list of permission grants. Permission grants allow a member to have access to a specific action, without having to create or update a custom role.
Show 3 properties
oauthProviderslist of strings or null
A list of OAuth providers
versioninteger or null
Version of the current configuration
roleAttributesmap from strings to lists of strings or null
The role attributes for the member
Errors
400
Post Member Teams Request Bad Request Error
401
Post Member Teams Request Unauthorized Error
403
Post Member Teams Request Forbidden Error
404
Post Member Teams Request Not Found Error
409
Post Member Teams Request Conflict Error
429
Post Member Teams Request Too Many Requests Error
Delete account member
DELETE
https://app.launchdarkly.com/api/v2/members/:id
DELETE
/api/v2/members/:id
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/members/id';
const options = {method: 'DELETE', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
No Content
{
 "key": "value"
}

Delete a single account member by ID. Requests to delete account members will not work if SCIM is enabled for the account.
Path parameters
idstringRequired
The member ID
Headers
AuthorizationstringRequired
Response
Action succeeded
Errors
401
Delete Member Request Unauthorized Error
403
Delete Member Request Forbidden Error
404
Delete Member Request Not Found Error
409
Delete Member Request Conflict Error
429
Delete Member Request Too Many Requests Error
Get account member
GET
https://app.launchdarkly.com/api/v2/members/:id
GET
/api/v2/members/:id
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/members/id';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "_id": "507f1f77bcf86cd799439011",
 "role": "reader",
 "email": "ariel@acme.com",
 "_pendingInvite": false,
 "_verified": true,
 "customRoles": [
   "devOps",
   "backend-devs"
 ],
 "mfa": "mfa",
 "_lastSeen": 1000000,
 "creationDate": 1000000,
 "firstName": "Ariel",
 "lastName": "Flores",
 "_pendingEmail": "_pendingEmail",
 "excludedDashboards": [
   "excludedDashboards"
 ],
 "_lastSeenMetadata": {
   "tokenId": "5b52207f8ca8e631d31fdb2b"
 },
 "_integrationMetadata": {
   "externalId": "externalId",
   "externalStatus": {
     "display": "display",
     "value": "value"
   },
   "externalUrl": "externalUrl",
   "lastChecked": 1000000
 },
 "teams": [
   {
     "customRoleKeys": [
       "access-to-test-projects"
     ],
     "key": "team-key-123abc",
     "name": "QA Team",
     "_links": {
       "key": {}
     }
   }
 ],
 "permissionGrants": [
   {
     "resource": "team/qa-team",
     "actionSet": "actionSet",
     "actions": [
       "maintainTeam"
     ]
   }
 ],
 "oauthProviders": [
   "oauthProviders"
 ],
 "version": 1,
 "roleAttributes": {
   "key": [
     "value"
   ]
 }
}

Get a single account member by member ID.
me is a reserved value for the id parameter that returns the caller’s member information.
Expanding the member response
LaunchDarkly supports one field for expanding the “Get member” response. By default, this field is not included in the response.
To expand the response, append the expand query parameter and add a comma-separated list with any of the following fields:
roleAttributes includes a list of the role attributes that you have assigned to the member.
For example, expand=roleAttributes includes roleAttributes field in the response.
Path parameters
idstringRequired
The member ID
Headers
AuthorizationstringRequired
Query parameters
expandstringOptional
A comma-separated list of properties that can reveal additional information in the response.
Response
Member response
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
_idstring
The member's ID
rolestring
The member's base role. If the member has no additional roles, this role will be in effect.
emailstring
The member's email address
_pendingInviteboolean
Whether the member has a pending invitation
_verifiedboolean
Whether the member's email address has been verified
customRoleslist of strings
The set of additional roles, besides the base role, assigned to the member
mfastring
Whether multi-factor authentication is enabled for this member
_lastSeenlong
The member’s last session date (as Unix milliseconds since epoch)
creationDatelong
Timestamp of when the member was created
firstNamestring or null
The member's first name
lastNamestring or null
The member's last name
_pendingEmailstring or null
The member's email address before it has been verified, for accounts where email verification is required
excludedDashboardslist of strings or null
Default dashboards that the member has chosen to ignore
_lastSeenMetadataobject or null
Additional metadata associated with the member's last session, for example, whether a token was used
Show 1 properties
_integrationMetadataobject or null
Details on the member account in an external source, if this member is provisioned externally
Show 4 properties
teamslist of objects or null
Details on the teams this member is assigned to
Show 4 properties
permissionGrantslist of objects or null
A list of permission grants. Permission grants allow a member to have access to a specific action, without having to create or update a custom role.
Show 3 properties
oauthProviderslist of strings or null
A list of OAuth providers
versioninteger or null
Version of the current configuration
roleAttributesmap from strings to lists of strings or null
The role attributes for the member
Errors
401
Get Member Request Unauthorized Error
403
Get Member Request Forbidden Error
404
Get Member Request Not Found Error
429
Get Member Request Too Many Requests Error
Invite new members
POST
https://app.launchdarkly.com/api/v2/members
POST
/api/v2/members
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/members';
const options = {
 method: 'POST',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"0":{"email":"sandy@acme.com"}}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Created
{
 "items": [
   {
     "_links": {
       "key": {}
     },
     "_id": "507f1f77bcf86cd799439011",
     "role": "reader",
     "email": "ariel@acme.com",
     "_pendingInvite": false,
     "_verified": true,
     "customRoles": [
       "devOps",
       "backend-devs"
     ],
     "mfa": "mfa",
     "_lastSeen": 1000000,
     "creationDate": 1000000,
     "firstName": "Ariel",
     "lastName": "Flores",
     "_pendingEmail": "_pendingEmail",
     "excludedDashboards": [
       "excludedDashboards"
     ],
     "_lastSeenMetadata": {
       "tokenId": "5b52207f8ca8e631d31fdb2b"
     },
     "_integrationMetadata": {
       "externalId": "externalId",
       "externalStatus": {
         "display": "display",
         "value": "value"
       },
       "externalUrl": "externalUrl",
       "lastChecked": 1000000
     },
     "teams": [
       {
         "customRoleKeys": [
           "access-to-test-projects"
         ],
         "key": "team-key-123abc",
         "name": "QA Team"
       }
     ],
     "permissionGrants": [
       {
         "resource": "team/qa-team"
       }
     ],
     "oauthProviders": [
       "oauthProviders"
     ],
     "version": 1,
     "roleAttributes": {
       "key": [
         "value"
       ]
     }
   }
 ],
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "totalCount": 1
}

Invite one or more new members to join an account. Each member is sent an invitation. Members with Admin or Owner roles may create new members, as well as anyone with a createMember permission for “member/*”. If a member cannot be invited, the entire request is rejected and no members are invited from that request.
Each member must have an email field and either a role or a customRoles field. If any of the fields are not populated correctly, the request is rejected with the reason specified in the “message” field of the response.
Valid base role names that you can provide for the role field include reader, writer, admin, owner/admin, and no_access. To learn more about base roles, read Organization roles.
If you are using the customRoles field instead, you can provide the key for any role that you have created, or for any preset organization role or project role provided by LaunchDarkly. Some preset roles additionally require that you specify roleAttributes. To learn more, read Using role scope.
Requests to create account members will not work if SCIM is enabled for the account.
No more than 50 members may be created per request.
A request may also fail because of conflicts with existing members. These conflicts are reported using the additional code and invalid_emails response fields with the following possible values for code:
email_already_exists_in_account: A member with this email address already exists in this account.
email_taken_in_different_account: A member with this email address exists in another account.
duplicate_emails: This request contains two or more members with the same email address.
A request that fails for one of the above reasons returns an HTTP response code of 400 (Bad Request).
Headers
AuthorizationstringRequired
Request
This endpoint expects a list of objects.
emailstringRequired
The member's email
passwordstringOptional
The member's password
firstNamestringOptional
The member's first name
lastNamestringOptional
The member's last name
roleenumOptional
The member's initial role, if you are using a base role for the initial role
Allowed values:readerwriteradminno_access
customRoleslist of stringsOptional
An array of the member's initial roles, if you are using custom roles or preset roles provided by LaunchDarkly
teamKeyslist of stringsOptional
An array of the member's teams
roleAttributesmap from strings to lists of stringsOptional
An object of role attributes for the member
Response
Member collection response
itemslist of objects
An array of members
Show 21 properties
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
totalCountinteger or null
The number of members returned
Errors
400
Post Members Request Bad Request Error
401
Post Members Request Unauthorized Error
403
Post Members Request Forbidden Error
409
Post Members Request Conflict Error
429
Post Members Request Too Many Requests Error
List account members
GET
https://app.launchdarkly.com/api/v2/members
GET
/api/v2/members
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/members';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "items": [
   {
     "_links": {
       "key": {}
     },
     "_id": "507f1f77bcf86cd799439011",
     "role": "reader",
     "email": "ariel@acme.com",
     "_pendingInvite": false,
     "_verified": true,
     "customRoles": [
       "devOps",
       "backend-devs"
     ],
     "mfa": "mfa",
     "_lastSeen": 1000000,
     "creationDate": 1000000,
     "firstName": "Ariel",
     "lastName": "Flores",
     "_pendingEmail": "_pendingEmail",
     "excludedDashboards": [
       "excludedDashboards"
     ],
     "_lastSeenMetadata": {
       "tokenId": "5b52207f8ca8e631d31fdb2b"
     },
     "_integrationMetadata": {
       "externalId": "externalId",
       "externalStatus": {
         "display": "display",
         "value": "value"
       },
       "externalUrl": "externalUrl",
       "lastChecked": 1000000
     },
     "teams": [
       {
         "customRoleKeys": [
           "access-to-test-projects"
         ],
         "key": "team-key-123abc",
         "name": "QA Team"
       }
     ],
     "permissionGrants": [
       {
         "resource": "team/qa-team"
       }
     ],
     "oauthProviders": [
       "oauthProviders"
     ],
     "version": 1,
     "roleAttributes": {
       "key": [
         "value"
       ]
     }
   }
 ],
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "totalCount": 1
}

Return a list of account members.
By default, this returns the first 20 members. Page through this list with the limit parameter and by following the first, prev, next, and last links in the returned _links field. These links are not present if the pages they refer to don’t exist. For example, the first and prev links will be missing from the response on the first page.
Filtering members
LaunchDarkly supports the following fields for filters:
query is a string that matches against the members’ emails and names. It is not case sensitive.
role is a | separated list of roles and custom roles. It filters the list to members who have any of the roles in the list. For the purposes of this filtering, Owner counts as Admin.
id is a | separated list of member IDs. It filters the list to members who match any of the IDs in the list.
email is a | separated list of member emails. It filters the list to members who match any of the emails in the list.
team is a string that matches against the key of the teams the members belong to. It is not case sensitive.
noteam is a boolean that filters the list of members who are not on a team if true and members on a team if false.
lastSeen is a JSON object in one of the following formats:
{"never": true} - Members that have never been active, such as those who have not accepted their invitation to LaunchDarkly, or have not logged in after being provisioned via SCIM.
{"noData": true} - Members that have not been active since LaunchDarkly began recording last seen timestamps.
{"before": 1608672063611} - Members that have not been active since the provided value, which should be a timestamp in Unix epoch milliseconds.
accessCheck is a string that represents a specific action on a specific resource and is in the format <ActionSpecifier>:<ResourceSpecifier>. It filters the list to members who have the ability to perform that action on that resource. Note: accessCheck is only supported in API version 20220603 and earlier. To learn more, read Versioning.
For example, the filter accessCheck:createApprovalRequest:proj/default:env/test:flag/alternate-page matches members with the ability to create an approval request for the alternate-page flag in the test environment of the default project.
Wildcard and tag filters are not supported when filtering for access.
For example, the filter query:abc,role:admin|customrole matches members with the string abc in their email or name, ignoring case, who also are either an Owner or Admin or have the custom role customrole.
Sorting members
LaunchDarkly supports two fields for sorting: displayName and lastSeen:
displayName sorts by first + last name, using the member’s email if no name is set.
lastSeen sorts by the _lastSeen property. LaunchDarkly considers members that have never been seen or have no data the oldest.
Expanding the members response
LaunchDarkly supports two fields for expanding the “List members” response. By default, these fields are not included in the response.
To expand the response, append the expand query parameter and add a comma-separated list with any of the following fields:
customRoles includes a list of the roles that you have assigned to the member.
roleAttributes includes a list of the role attributes that you have assigned to the member.
For example, expand=roleAttributes includes roleAttributes field in the response.
Headers
AuthorizationstringRequired
Query parameters
limitlongOptional
The number of members to return in the response. Defaults to 20.
offsetlongOptional
Where to start in the list. This is for use with pagination. For example, an offset of 10 skips the first ten items and then returns the next items in the list, up to the query limit.
filterstringOptional
A comma-separated list of filters. Each filter is of the form field:value. Supported fields are explained above.
expandstringOptional
A comma-separated list of properties that can reveal additional information in the response.
sortstringOptional
A comma-separated list of fields to sort by. Fields prefixed by a dash ( - ) sort in descending order.
Response
Members collection response
itemslist of objects
An array of members
Show 21 properties
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
totalCountinteger or null
The number of members returned
Errors
401
Get Members Request Unauthorized Error
403
Get Members Request Forbidden Error
404
Get Members Request Not Found Error
429
Get Members Request Too Many Requests Error
Get account member
GET
https://app.launchdarkly.com/api/v2/members/:id
GET
/api/v2/members/:id
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/members/id';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "_id": "507f1f77bcf86cd799439011",
 "role": "reader",
 "email": "ariel@acme.com",
 "_pendingInvite": false,
 "_verified": true,
 "customRoles": [
   "devOps",
   "backend-devs"
 ],
 "mfa": "mfa",
 "_lastSeen": 1000000,
 "creationDate": 1000000,
 "firstName": "Ariel",
 "lastName": "Flores",
 "_pendingEmail": "_pendingEmail",
 "excludedDashboards": [
   "excludedDashboards"
 ],
 "_lastSeenMetadata": {
   "tokenId": "5b52207f8ca8e631d31fdb2b"
 },
 "_integrationMetadata": {
   "externalId": "externalId",
   "externalStatus": {
     "display": "display",
     "value": "value"
   },
   "externalUrl": "externalUrl",
   "lastChecked": 1000000
 },
 "teams": [
   {
     "customRoleKeys": [
       "access-to-test-projects"
     ],
     "key": "team-key-123abc",
     "name": "QA Team",
     "_links": {
       "key": {}
     }
   }
 ],
 "permissionGrants": [
   {
     "resource": "team/qa-team",
     "actionSet": "actionSet",
     "actions": [
       "maintainTeam"
     ]
   }
 ],
 "oauthProviders": [
   "oauthProviders"
 ],
 "version": 1,
 "roleAttributes": {
   "key": [
     "value"
   ]
 }
}

Get a single account member by member ID.
me is a reserved value for the id parameter that returns the caller’s member information.
Expanding the member response
LaunchDarkly supports one field for expanding the “Get member” response. By default, this field is not included in the response.
To expand the response, append the expand query parameter and add a comma-separated list with any of the following fields:
roleAttributes includes a list of the role attributes that you have assigned to the member.
For example, expand=roleAttributes includes roleAttributes field in the response.
Path parameters
idstringRequired
The member ID
Headers
AuthorizationstringRequired
Query parameters
expandstringOptional
A comma-separated list of properties that can reveal additional information in the response.
Response
Member response
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
_idstring
The member's ID
rolestring
The member's base role. If the member has no additional roles, this role will be in effect.
emailstring
The member's email address
_pendingInviteboolean
Whether the member has a pending invitation
_verifiedboolean
Whether the member's email address has been verified
customRoleslist of strings
The set of additional roles, besides the base role, assigned to the member
mfastring
Whether multi-factor authentication is enabled for this member
_lastSeenlong
The member’s last session date (as Unix milliseconds since epoch)
creationDatelong
Timestamp of when the member was created
firstNamestring or null
The member's first name
lastNamestring or null
The member's last name
_pendingEmailstring or null
The member's email address before it has been verified, for accounts where email verification is required
excludedDashboardslist of strings or null
Default dashboards that the member has chosen to ignore
_lastSeenMetadataobject or null
Additional metadata associated with the member's last session, for example, whether a token was used
Show 1 properties
_integrationMetadataobject or null
Details on the member account in an external source, if this member is provisioned externally
Show 4 properties
teamslist of objects or null
Details on the teams this member is assigned to
Show 4 properties
permissionGrantslist of objects or null
A list of permission grants. Permission grants allow a member to have access to a specific action, without having to create or update a custom role.
Show 3 properties
oauthProviderslist of strings or null
A list of OAuth providers
versioninteger or null
Version of the current configuration
roleAttributesmap from strings to lists of strings or null
The role attributes for the member
Errors
401
Get Member Request Unauthorized Error
403
Get Member Request Forbidden Error
404
Get Member Request Not Found Error
429
Get Member Request Too Many Requests Error
OverviewAccount members
Invite new members
POST
https://app.launchdarkly.com/api/v2/members
POST
/api/v2/members
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/members';
const options = {
 method: 'POST',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"0":{"email":"sandy@acme.com"}}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Created
{
 "items": [
   {
     "_links": {
       "key": {}
     },
     "_id": "507f1f77bcf86cd799439011",
     "role": "reader",
     "email": "ariel@acme.com",
     "_pendingInvite": false,
     "_verified": true,
     "customRoles": [
       "devOps",
       "backend-devs"
     ],
     "mfa": "mfa",
     "_lastSeen": 1000000,
     "creationDate": 1000000,
     "firstName": "Ariel",
     "lastName": "Flores",
     "_pendingEmail": "_pendingEmail",
     "excludedDashboards": [
       "excludedDashboards"
     ],
     "_lastSeenMetadata": {
       "tokenId": "5b52207f8ca8e631d31fdb2b"
     },
     "_integrationMetadata": {
       "externalId": "externalId",
       "externalStatus": {
         "display": "display",
         "value": "value"
       },
       "externalUrl": "externalUrl",
       "lastChecked": 1000000
     },
     "teams": [
       {
         "customRoleKeys": [
           "access-to-test-projects"
         ],
         "key": "team-key-123abc",
         "name": "QA Team"
       }
     ],
     "permissionGrants": [
       {
         "resource": "team/qa-team"
       }
     ],
     "oauthProviders": [
       "oauthProviders"
     ],
     "version": 1,
     "roleAttributes": {
       "key": [
         "value"
       ]
     }
   }
 ],
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "totalCount": 1
}

Invite one or more new members to join an account. Each member is sent an invitation. Members with Admin or Owner roles may create new members, as well as anyone with a createMember permission for “member/*”. If a member cannot be invited, the entire request is rejected and no members are invited from that request.
Each member must have an email field and either a role or a customRoles field. If any of the fields are not populated correctly, the request is rejected with the reason specified in the “message” field of the response.
Valid base role names that you can provide for the role field include reader, writer, admin, owner/admin, and no_access. To learn more about base roles, read Organization roles.
If you are using the customRoles field instead, you can provide the key for any role that you have created, or for any preset organization role or project role provided by LaunchDarkly. Some preset roles additionally require that you specify roleAttributes. To learn more, read Using role scope.
Requests to create account members will not work if SCIM is enabled for the account.
No more than 50 members may be created per request.
A request may also fail because of conflicts with existing members. These conflicts are reported using the additional code and invalid_emails response fields with the following possible values for code:
email_already_exists_in_account: A member with this email address already exists in this account.
email_taken_in_different_account: A member with this email address exists in another account.
duplicate_emails: This request contains two or more members with the same email address.
A request that fails for one of the above reasons returns an HTTP response code of 400 (Bad Request).
Headers
AuthorizationstringRequired
Request
This endpoint expects a list of objects.
emailstringRequired
The member's email
passwordstringOptional
The member's password
firstNamestringOptional
The member's first name
lastNamestringOptional
The member's last name
roleenumOptional
The member's initial role, if you are using a base role for the initial role
Allowed values:readerwriteradminno_access
customRoleslist of stringsOptional
An array of the member's initial roles, if you are using custom roles or preset roles provided by LaunchDarkly
teamKeyslist of stringsOptional
An array of the member's teams
roleAttributesmap from strings to lists of stringsOptional
An object of role attributes for the member
Response
Member collection response
itemslist of objects
An array of members
Show 21 properties
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
totalCountinteger or null
The number of members returned
Errors
400
Post Members Request Bad Request Error
401
Post Members Request Unauthorized Error
403
Post Members Request Forbidden Error
409
Post Members Request Conflict Error
429
Post Members Request Too Many Requests Error
List account members
GET
https://app.launchdarkly.com/api/v2/members
GET
/api/v2/members
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/members';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "items": [
   {
     "_links": {
       "key": {}
     },
     "_id": "507f1f77bcf86cd799439011",
     "role": "reader",
     "email": "ariel@acme.com",
     "_pendingInvite": false,
     "_verified": true,
     "customRoles": [
       "devOps",
       "backend-devs"
     ],
     "mfa": "mfa",
     "_lastSeen": 1000000,
     "creationDate": 1000000,
     "firstName": "Ariel",
     "lastName": "Flores",
     "_pendingEmail": "_pendingEmail",
     "excludedDashboards": [
       "excludedDashboards"
     ],
     "_lastSeenMetadata": {
       "tokenId": "5b52207f8ca8e631d31fdb2b"
     },
     "_integrationMetadata": {
       "externalId": "externalId",
       "externalStatus": {
         "display": "display",
         "value": "value"
       },
       "externalUrl": "externalUrl",
       "lastChecked": 1000000
     },
     "teams": [
       {
         "customRoleKeys": [
           "access-to-test-projects"
         ],
         "key": "team-key-123abc",
         "name": "QA Team"
       }
     ],
     "permissionGrants": [
       {
         "resource": "team/qa-team"
       }
     ],
     "oauthProviders": [
       "oauthProviders"
     ],
     "version": 1,
     "roleAttributes": {
       "key": [
         "value"
       ]
     }
   }
 ],
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "totalCount": 1
}

Return a list of account members.
By default, this returns the first 20 members. Page through this list with the limit parameter and by following the first, prev, next, and last links in the returned _links field. These links are not present if the pages they refer to don’t exist. For example, the first and prev links will be missing from the response on the first page.
Filtering members
LaunchDarkly supports the following fields for filters:
query is a string that matches against the members’ emails and names. It is not case sensitive.
role is a | separated list of roles and custom roles. It filters the list to members who have any of the roles in the list. For the purposes of this filtering, Owner counts as Admin.
id is a | separated list of member IDs. It filters the list to members who match any of the IDs in the list.
email is a | separated list of member emails. It filters the list to members who match any of the emails in the list.
team is a string that matches against the key of the teams the members belong to. It is not case sensitive.
noteam is a boolean that filters the list of members who are not on a team if true and members on a team if false.
lastSeen is a JSON object in one of the following formats:
{"never": true} - Members that have never been active, such as those who have not accepted their invitation to LaunchDarkly, or have not logged in after being provisioned via SCIM.
{"noData": true} - Members that have not been active since LaunchDarkly began recording last seen timestamps.
{"before": 1608672063611} - Members that have not been active since the provided value, which should be a timestamp in Unix epoch milliseconds.
accessCheck is a string that represents a specific action on a specific resource and is in the format <ActionSpecifier>:<ResourceSpecifier>. It filters the list to members who have the ability to perform that action on that resource. Note: accessCheck is only supported in API version 20220603 and earlier. To learn more, read Versioning.
For example, the filter accessCheck:createApprovalRequest:proj/default:env/test:flag/alternate-page matches members with the ability to create an approval request for the alternate-page flag in the test environment of the default project.
Wildcard and tag filters are not supported when filtering for access.
For example, the filter query:abc,role:admin|customrole matches members with the string abc in their email or name, ignoring case, who also are either an Owner or Admin or have the custom role customrole.
Sorting members
LaunchDarkly supports two fields for sorting: displayName and lastSeen:
displayName sorts by first + last name, using the member’s email if no name is set.
lastSeen sorts by the _lastSeen property. LaunchDarkly considers members that have never been seen or have no data the oldest.
Expanding the members response
LaunchDarkly supports two fields for expanding the “List members” response. By default, these fields are not included in the response.
To expand the response, append the expand query parameter and add a comma-separated list with any of the following fields:
customRoles includes a list of the roles that you have assigned to the member.
roleAttributes includes a list of the role attributes that you have assigned to the member.
For example, expand=roleAttributes includes roleAttributes field in the response.
Headers
AuthorizationstringRequired
Query parameters
limitlongOptional
The number of members to return in the response. Defaults to 20.
offsetlongOptional
Where to start in the list. This is for use with pagination. For example, an offset of 10 skips the first ten items and then returns the next items in the list, up to the query limit.
filterstringOptional
A comma-separated list of filters. Each filter is of the form field:value. Supported fields are explained above.
expandstringOptional
A comma-separated list of properties that can reveal additional information in the response.
sortstringOptional
A comma-separated list of fields to sort by. Fields prefixed by a dash ( - ) sort in descending order.
Response
Members collection response
itemslist of objects
An array of members
Show 21 properties
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
totalCountinteger or null
The number of members returned
Errors
401
Get Members Request Unauthorized Error
403
Get Members Request Forbidden Error
404
Get Members Request Not Found Error
429
Get Members Request Too Many Requests Error
Modify an account member
PATCH
https://app.launchdarkly.com/api/v2/members/:id
PATCH
/api/v2/members/:id
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/members/id';
const options = {
 method: 'PATCH',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"0":{"op":"add","path":"/role","value":"writer"}}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Updated
{
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "_id": "507f1f77bcf86cd799439011",
 "role": "reader",
 "email": "ariel@acme.com",
 "_pendingInvite": false,
 "_verified": true,
 "customRoles": [
   "devOps",
   "backend-devs"
 ],
 "mfa": "mfa",
 "_lastSeen": 1000000,
 "creationDate": 1000000,
 "firstName": "Ariel",
 "lastName": "Flores",
 "_pendingEmail": "_pendingEmail",
 "excludedDashboards": [
   "excludedDashboards"
 ],
 "_lastSeenMetadata": {
   "tokenId": "5b52207f8ca8e631d31fdb2b"
 },
 "_integrationMetadata": {
   "externalId": "externalId",
   "externalStatus": {
     "display": "display",
     "value": "value"
   },
   "externalUrl": "externalUrl",
   "lastChecked": 1000000
 },
 "teams": [
   {
     "customRoleKeys": [
       "access-to-test-projects"
     ],
     "key": "team-key-123abc",
     "name": "QA Team",
     "_links": {
       "key": {}
     }
   }
 ],
 "permissionGrants": [
   {
     "resource": "team/qa-team",
     "actionSet": "actionSet",
     "actions": [
       "maintainTeam"
     ]
   }
 ],
 "oauthProviders": [
   "oauthProviders"
 ],
 "version": 1,
 "roleAttributes": {
   "key": [
     "value"
   ]
 }
}

Update a single account member. Updating a member uses a JSON patch representation of the desired changes. To learn more, read Updates.
To update fields in the account member object that are arrays, set the path to the name of the field and then append /<array index>. Use /0 to add to the beginning of the array. Use /- to add to the end of the array. For example, to add a new custom role to a member, use the following request body:
 [
   {
     "op": "add",
     "path": "/customRoles/0",
     "value": "some-role-id"
   }
 ]

You can update only an account member’s role or custom role using a JSON patch. Members can update their own names and email addresses though the LaunchDarkly UI.
When SAML SSO or SCIM is enabled for the account, account members are managed in the Identity Provider (IdP). Requests to update account members will succeed, but the IdP will override the update shortly afterwards.
Path parameters
idstringRequired
The member ID
Headers
AuthorizationstringRequired
Request
This endpoint expects a list of objects.
opstringRequired
The type of operation to perform
pathstringRequired
A JSON Pointer string specifying the part of the document to operate on
valueanyOptional
Response
Member response
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
_idstring
The member's ID
rolestring
The member's base role. If the member has no additional roles, this role will be in effect.
emailstring
The member's email address
_pendingInviteboolean
Whether the member has a pending invitation
_verifiedboolean
Whether the member's email address has been verified
customRoleslist of strings
The set of additional roles, besides the base role, assigned to the member
mfastring
Whether multi-factor authentication is enabled for this member
_lastSeenlong
The member’s last session date (as Unix milliseconds since epoch)
creationDatelong
Timestamp of when the member was created
firstNamestring or null
The member's first name
lastNamestring or null
The member's last name
_pendingEmailstring or null
The member's email address before it has been verified, for accounts where email verification is required
excludedDashboardslist of strings or null
Default dashboards that the member has chosen to ignore
_lastSeenMetadataobject or null
Additional metadata associated with the member's last session, for example, whether a token was used
Show 1 properties
_integrationMetadataobject or null
Details on the member account in an external source, if this member is provisioned externally
Show 4 properties
teamslist of objects or null
Details on the teams this member is assigned to
Show 4 properties
permissionGrantslist of objects or null
A list of permission grants. Permission grants allow a member to have access to a specific action, without having to create or update a custom role.
Show 3 properties
oauthProviderslist of strings or null
A list of OAuth providers
versioninteger or null
Version of the current configuration
roleAttributesmap from strings to lists of strings or null
The role attributes for the member
Errors
400
Patch Member Request Bad Request Error
401
Patch Member Request Unauthorized Error
403
Patch Member Request Forbidden Error
404
Patch Member Request Not Found Error
409
Patch Member Request Conflict Error
429
Patch Member Request Too Many Requests Error
Account members (beta)
This feature is in beta
To use this feature, pass in a header including the LD-API-Version key with value set to beta. Use this header with each call. To learn more, read Beta resources.
Resources that are in beta are still undergoing testing and development. They may change without notice, including becoming backwards incompatible.
Modify account membersBeta
PATCH
https://app.launchdarkly.com/api/v2/members
PATCH
/api/v2/members
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/members';
const options = {
 method: 'PATCH',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"instructions":[{"kind":"replaceMembersRoles","memberIDs":["1234a56b7c89d012345e678f","507f1f77bcf86cd799439011"],"value":"reader"}],"comment":"Optional comment about the update"}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Updated
{
 "members": [
   "1234a56b7c89d012345e678f"
 ],
 "errors": [
   {
     "507f1f77bcf86cd799439011": "you cannot modify your own role"
   }
 ]
}

Full use of this API resource is an Enterprise feature
The ability to perform a partial update to multiple members is available to customers on an Enterprise plan. If you are on another plan, you can update members individually. To learn more, read about our pricing. To upgrade your plan, contact Sales.
Perform a partial update to multiple members. Updating members uses the semantic patch format.
To make a semantic patch request, you must append domain-model=launchdarkly.semanticpatch to your Content-Type header. To learn more, read Updates using semantic patch.
Instructions
Semantic patch requests support the following kind instructions for updating members.
Click to expand instructions for updating members















































































































































Headers
AuthorizationstringRequired
Request
This endpoint expects an object.
instructionslist of maps from strings to anyRequired
The instructions to perform when updating. This should be an array with objects that look like <code>{“kind”: “update_action”}</code>. Some instructions also require additional parameters as part of this object.
commentstringOptional
Optional comment describing the update
Response
Members response
memberslist of strings or null
A list of members IDs of the members who were successfully updated.
errorslist of maps from strings to strings or null
A list of member IDs and errors for the members whose updates failed.
Errors
400
Patch Members Request Bad Request Error
401
Patch Members Request Unauthorized Error
403
Patch Members Request Forbidden Error
409
Patch Members Request Conflict Error
429
Patch Members Request Too Many Requests Error
Account usage (beta)
This feature is in beta
To use this feature, pass in a header including the LD-API-Version key with value set to beta. Use this header with each call. To learn more, read Beta resources.
Resources that are in beta are still undergoing testing and development. They may change without notice, including becoming backwards incompatible.
The account usage API lets you query for metrics about how your account is using LaunchDarkly. To learn more, read Account usage metrics.
Each endpoint returns time-series data in the form of an array of data points with timestamps. Each one contains data for that time from one or more series. It also includes a metadata array describing what each of the series is.
Get data export events usage
GET
https://app.launchdarkly.com/api/v2/usage/data-export-events
GET
/api/v2/usage/data-export-events
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/usage/data-export-events';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "series": [
   {
     "time": 1676332800000,
     "value": 92
   }
 ],
 "_links": {
   "key": "value"
 }
}

Get a time-series array of the number of monthly data export events from your account. The granularity is always daily, with a maximum of 31 days.
Headers
AuthorizationstringRequired
Query parameters
fromstringOptional
The series of data returned starts from this timestamp (Unix seconds). Defaults to the beginning of the current month.
tostringOptional
The series of data returned ends at this timestamp (Unix seconds). Defaults to the current time.
projectKeystringOptional
A project key. If specified, environmentKey is required and results apply to the corresponding environment in this project.
environmentKeystringOptional
An environment key. If specified, projectKey is required and results apply to the corresponding environment in this project.
Response
Usage response
serieslist of objects
An array of timestamps and values for a given meter
Show 2 properties
_linksmap from strings to any
The location and content type of related resources
Errors
400
Get Data Export Events Usage Request Bad Request Error
401
Get Data Export Events Usage Request Unauthorized Error
403
Get Data Export Events Usage Request Forbidden Error
429
Get Data Export Events Usage Request Too Many Requests Error
503
Get Data Export Events Usage Request Service Unavailable Error
Get evaluations usage
GET
https://app.launchdarkly.com/api/v2/usage/evaluations/:projectKey/:environmentKey/:featureFlagKey
GET
/api/v2/usage/evaluations/:projectKey/:environmentKey/:featureFlagKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/usage/evaluations/projectKey/environmentKey/featureFlagKey';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "key": "value"
 },
 "metadata": [
   {
     "key": "value"
   }
 ],
 "series": [
   {
     "0": 11,
     "1": 15,
     "time": 1677888000000
   }
 ]
}

Get time-series arrays of the number of times a flag is evaluated, broken down by the variation that resulted from that evaluation. The granularity of the data depends on the age of the data requested. If the requested range is within the past two hours, minutely data is returned. If it is within the last two days, hourly data is returned. Otherwise, daily data is returned.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
featureFlagKeystringRequired
The feature flag key
Headers
AuthorizationstringRequired
Query parameters
fromstringOptional
The series of data returned starts from this timestamp. Defaults to 30 days ago.
tostringOptional
The series of data returned ends at this timestamp. Defaults to the current time.
tzstringOptional
The timezone to use for breaks between days when returning daily data.
Response
Usage response
_linksmap from strings to any
The location and content type of related resources
metadatalist of maps from strings to any
Metadata about each series
serieslist of maps from strings to integers
An array of data points with timestamps. Each element of the array is an object with a ‘time’ field, whose value is the timestamp, and one or more key fields. If there are multiple key fields, they are labeled ‘0’, ‘1’, and so on, and are explained in the metadata.
Errors
400
Get Evaluations Usage Request Bad Request Error
401
Get Evaluations Usage Request Unauthorized Error
403
Get Evaluations Usage Request Forbidden Error
404
Get Evaluations Usage Request Not Found Error
429
Get Evaluations Usage Request Too Many Requests Error
Get events usage
GET
https://app.launchdarkly.com/api/v2/usage/events/:type
GET
/api/v2/usage/events/:type
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/usage/events/type';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "key": "value"
 },
 "metadata": [
   {
     "key": "value"
   }
 ],
 "series": [
   {
     "0": 11,
     "1": 15,
     "time": 1677888000000
   }
 ]
}

Get time-series arrays of the number of times a flag is evaluated, broken down by the variation that resulted from that evaluation. The granularity of the data depends on the age of the data requested. If the requested range is within the past two hours, minutely data is returned. If it is within the last two days, hourly data is returned. Otherwise, daily data is returned.
Path parameters
typestringRequired
The type of event to retrieve. Must be either received or published.
Headers
AuthorizationstringRequired
Query parameters
fromstringOptional
The series of data returned starts from this timestamp. Defaults to 24 hours ago.
tostringOptional
The series of data returned ends at this timestamp. Defaults to the current time.
Response
Usage response
_linksmap from strings to any
The location and content type of related resources
metadatalist of maps from strings to any
Metadata about each series
serieslist of maps from strings to integers
An array of data points with timestamps. Each element of the array is an object with a ‘time’ field, whose value is the timestamp, and one or more key fields. If there are multiple key fields, they are labeled ‘0’, ‘1’, and so on, and are explained in the metadata.
Errors
400
Get Events Usage Request Bad Request Error
401
Get Events Usage Request Unauthorized Error
403
Get Events Usage Request Forbidden Error
404
Get Events Usage Request Not Found Error
429
Get Events Usage Request Too Many Requests Error
Get events usage
GET
https://app.launchdarkly.com/api/v2/usage/events/:type
GET
/api/v2/usage/events/:type
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/usage/events/type';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "key": "value"
 },
 "metadata": [
   {
     "key": "value"
   }
 ],
 "series": [
   {
     "0": 11,
     "1": 15,
     "time": 1677888000000
   }
 ]
}

Get time-series arrays of the number of times a flag is evaluated, broken down by the variation that resulted from that evaluation. The granularity of the data depends on the age of the data requested. If the requested range is within the past two hours, minutely data is returned. If it is within the last two days, hourly data is returned. Otherwise, daily data is returned.
Path parameters
typestringRequired
The type of event to retrieve. Must be either received or published.
Headers
AuthorizationstringRequired
Query parameters
fromstringOptional
The series of data returned starts from this timestamp. Defaults to 24 hours ago.
tostringOptional
The series of data returned ends at this timestamp. Defaults to the current time.
Response
Usage response
_linksmap from strings to any
The location and content type of related resources
metadatalist of maps from strings to any
Metadata about each series
serieslist of maps from strings to integers
An array of data points with timestamps. Each element of the array is an object with a ‘time’ field, whose value is the timestamp, and one or more key fields. If there are multiple key fields, they are labeled ‘0’, ‘1’, and so on, and are explained in the metadata.
Errors
400
Get Events Usage Request Bad Request Error
401
Get Events Usage Request Unauthorized Error
403
Get Events Usage Request Forbidden Error
404
Get Events Usage Request Not Found Error
429
Get Events Usage Request Too Many Requests Error
Get experimentation keys usage
GET
https://app.launchdarkly.com/api/v2/usage/experimentation-keys
GET
/api/v2/usage/experimentation-keys
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/usage/experimentation-keys';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "series": [
   {
     "time": 1676332800000,
     "value": 92
   }
 ],
 "_links": {
   "key": "value"
 }
}

Get a time-series array of the number of monthly experimentation keys from your account. The granularity is always daily, with a maximum of 31 days.
Headers
AuthorizationstringRequired
Query parameters
fromstringOptional
The series of data returned starts from this timestamp (Unix seconds). Defaults to the beginning of the current month.
tostringOptional
The series of data returned ends at this timestamp (Unix seconds). Defaults to the current time.
projectKeystringOptional
A project key. If specified, environmentKey is required and results apply to the corresponding environment in this project.
environmentKeystringOptional
An environment key. If specified, projectKey is required and results apply to the corresponding environment in this project.
Response
Usage response
serieslist of objects
An array of timestamps and values for a given meter
Show 2 properties
_linksmap from strings to any
The location and content type of related resources
Errors
400
Get Experimentation Keys Usage Request Bad Request Error
401
Get Experimentation Keys Usage Request Unauthorized Error
403
Get Experimentation Keys Usage Request Forbidden Error
429
Get Experimentation Keys Usage Request Too Many Requests Error
503
Get Experimentation Keys Usage Request Service Unavailable Error
Get experimentation units usage
GET
https://app.launchdarkly.com/api/v2/usage/experimentation-units
GET
/api/v2/usage/experimentation-units
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/usage/experimentation-units';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "series": [
   {
     "time": 1676332800000,
     "value": 92
   }
 ],
 "_links": {
   "key": "value"
 }
}

Get a time-series array of the number of monthly experimentation units from your account. The granularity is always daily, with a maximum of 31 days.
Headers
AuthorizationstringRequired
Query parameters
fromstringOptional
The series of data returned starts from this timestamp (Unix seconds). Defaults to the beginning of the current month.
tostringOptional
The series of data returned ends at this timestamp (Unix seconds). Defaults to the current time.
projectKeystringOptional
A project key. If specified, environmentKey is required and results apply to the corresponding environment in this project.
environmentKeystringOptional
An environment key. If specified, projectKey is required and results apply to the corresponding environment in this project.
Response
Usage response
serieslist of objects
An array of timestamps and values for a given meter
Show 2 properties
_linksmap from strings to any
The location and content type of related resources
Errors
400
Get Experimentation Units Usage Request Bad Request Error
401
Get Experimentation Units Usage Request Unauthorized Error
403
Get Experimentation Units Usage Request Forbidden Error
429
Get Experimentation Units Usage Request Too Many Requests Error
503
Get Experimentation Units Usage Request Service Unavailable Error
Get MAU SDKs by type
GET
https://app.launchdarkly.com/api/v2/usage/mau/sdks
GET
/api/v2/usage/mau/sdks
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/usage/mau/sdks';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "key": "value"
 },
 "sdks": [
   "Android",
   "Java",
   "Node.js"
 ]
}

Get a list of SDKs. These are all of the SDKs that have connected to LaunchDarkly by monthly active users (MAU) in the requested time period.

Endpoints for retrieving monthly active users (MAU) do not return information about active context instances. After you have upgraded your LaunchDarkly SDK to use contexts instead of users, you should not rely on this endpoint. To learn more, read Account usage metrics.
Headers
AuthorizationstringRequired
Query parameters
fromstringOptional
The data returned starts from this timestamp. Defaults to seven days ago. The timestamp is in Unix milliseconds, for example, 1656694800000.
tostringOptional
The data returned ends at this timestamp. Defaults to the current time. The timestamp is in Unix milliseconds, for example, 1657904400000.
sdktypestringOptional
The type of SDK with monthly active users (MAU) to list. Must be either client or server.
Response
MAU SDKs response
_linksmap from strings to any
The location and content type of related resources
sdkslist of strings
The list of SDK names
Errors
400
Get Mau SDKs by Type Request Bad Request Error
401
Get Mau SDKs by Type Request Unauthorized Error
403
Get Mau SDKs by Type Request Forbidden Error
429
Get Mau SDKs by Type Request Too Many Requests Error
Get MAU usage
GET
https://app.launchdarkly.com/api/v2/usage/mau
GET
/api/v2/usage/mau
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/usage/mau';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "key": "value"
 },
 "metadata": [
   {
     "key": "value"
   }
 ],
 "series": [
   {
     "0": 11,
     "1": 15,
     "time": 1677888000000
   }
 ]
}

Get a time-series array of the number of monthly active users (MAU) seen by LaunchDarkly from your account. The granularity is always daily.

Endpoints for retrieving monthly active users (MAU) do not return information about active context instances. After you have upgraded your LaunchDarkly SDK to use contexts instead of users, you should not rely on this endpoint. To learn more, read Account usage metrics.
Headers
AuthorizationstringRequired
Query parameters
fromstringOptional
The series of data returned starts from this timestamp. Defaults to 30 days ago.
tostringOptional
The series of data returned ends at this timestamp. Defaults to the current time.
projectstringOptional
A project key to filter results to. Can be specified multiple times, one query parameter per project key, to view data for multiple projects.
environmentstringOptional
An environment key to filter results to. When using this parameter, exactly one project key must also be set. Can be specified multiple times as separate query parameters to view data for multiple environments within a single project.
sdktypestringOptional
An SDK type to filter results to. Can be specified multiple times, one query parameter per SDK type. Valid values: client, server
sdkstringOptional
An SDK name to filter results to. Can be specified multiple times, one query parameter per SDK.
anonymousstringOptional
If specified, filters results to either anonymous or nonanonymous users.
groupbystringOptional
If specified, returns data for each distinct value of the given field. Can be specified multiple times to group data by multiple dimensions (for example, to group by both project and SDK). Valid values: project, environment, sdktype, sdk, anonymous, contextKind, sdkAppId
aggregationTypestringOptional
If specified, queries for rolling 30-day, month-to-date, or daily incremental counts. Default is rolling 30-day. Valid values: rolling_30d, month_to_date, daily_incremental
contextKindstringOptional
Filters results to the specified context kinds. Can be specified multiple times, one query parameter per context kind. If not set, queries for the user context kind.
Response
Usage response
_linksmap from strings to any
The location and content type of related resources
metadatalist of maps from strings to any
Metadata about each series
serieslist of maps from strings to integers
An array of data points with timestamps. Each element of the array is an object with a ‘time’ field, whose value is the timestamp, and one or more key fields. If there are multiple key fields, they are labeled ‘0’, ‘1’, and so on, and are explained in the metadata.
Errors
400
Get Mau Usage Request Bad Request Error
401
Get Mau Usage Request Unauthorized Error
403
Get Mau Usage Request Forbidden Error
429
Get Mau Usage Request Too Many Requests Error
Get MAU usage by category
GET
https://app.launchdarkly.com/api/v2/usage/mau/bycategory
GET
/api/v2/usage/mau/bycategory
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/usage/mau/bycategory';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "key": "value"
 },
 "metadata": [
   {
     "key": "value"
   }
 ],
 "series": [
   {
     "0": 11,
     "1": 15,
     "time": 1677888000000
   }
 ]
}

Get time-series arrays of the number of monthly active users (MAU) seen by LaunchDarkly from your account, broken down by the category of users. The category is either browser, mobile, or backend.

Endpoints for retrieving monthly active users (MAU) do not return information about active context instances. After you have upgraded your LaunchDarkly SDK to use contexts instead of users, you should not rely on this endpoint. To learn more, read Account usage metrics.
Headers
AuthorizationstringRequired
Query parameters
fromstringOptional
The series of data returned starts from this timestamp. Defaults to 30 days ago.
tostringOptional
The series of data returned ends at this timestamp. Defaults to the current time.
Response
Usage response
_linksmap from strings to any
The location and content type of related resources
metadatalist of maps from strings to any
Metadata about each series
serieslist of maps from strings to integers
An array of data points with timestamps. Each element of the array is an object with a ‘time’ field, whose value is the timestamp, and one or more key fields. If there are multiple key fields, they are labeled ‘0’, ‘1’, and so on, and are explained in the metadata.
Errors
400
Get Mau Usage by Category Request Bad Request Error
401
Get Mau Usage by Category Request Unauthorized Error
403
Get Mau Usage by Category Request Forbidden Error
404
Get Mau Usage by Category Request Not Found Error
429
Get Mau Usage by Category Request Too Many Requests Error
Get service connection usage
GET
https://app.launchdarkly.com/api/v2/usage/service-connections
GET
/api/v2/usage/service-connections
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/usage/service-connections';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "series": [
   {
     "time": 1676332800000,
     "value": 92
   }
 ],
 "_links": {
   "key": "value"
 }
}

Get a time-series array of the number of monthly service connections from your account. The granularity is always daily, with a maximum of 31 days.
Headers
AuthorizationstringRequired
Query parameters
fromstringOptional
The series of data returned starts from this timestamp (Unix seconds). Defaults to the beginning of the current month.
tostringOptional
The series of data returned ends at this timestamp (Unix seconds). Defaults to the current time.
projectKeystringOptional
A project key. If specified, environmentKey is required and results apply to the corresponding environment in this project.
environmentKeystringOptional
An environment key. If specified, projectKey is required and results apply to the corresponding environment in this project.
Response
Usage response
serieslist of objects
An array of timestamps and values for a given meter
Show 2 properties
_linksmap from strings to any
The location and content type of related resources
Errors
400
Get Service Connection Usage Request Bad Request Error
401
Get Service Connection Usage Request Unauthorized Error
403
Get Service Connection Usage Request Forbidden Error
429
Get Service Connection Usage Request Too Many Requests Error
503
Get Service Connection Usage Request Service Unavailable Error
Get stream usage
GET
https://app.launchdarkly.com/api/v2/usage/streams/:source
GET
/api/v2/usage/streams/:source
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/usage/streams/source';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "key": "value"
 },
 "metadata": [
   {
     "key": "value"
   }
 ],
 "series": [
   {
     "0": 11,
     "1": 15,
     "time": 1677888000000
   }
 ]
}

Get a time-series array of the number of streaming connections to LaunchDarkly in each time period. The granularity of the data depends on the age of the data requested. If the requested range is within the past two hours, minutely data is returned. If it is within the last two days, hourly data is returned. Otherwise, daily data is returned.
Path parameters
sourcestringRequired
The source of streaming connections to describe. Must be either client or server.
Headers
AuthorizationstringRequired
Query parameters
fromstringOptional
The series of data returned starts from this timestamp. Defaults to 30 days ago.
tostringOptional
The series of data returned ends at this timestamp. Defaults to the current time.
tzstringOptional
The timezone to use for breaks between days when returning daily data.
Response
Usage response
_linksmap from strings to any
The location and content type of related resources
metadatalist of maps from strings to any
Metadata about each series
serieslist of maps from strings to integers
An array of data points with timestamps. Each element of the array is an object with a ‘time’ field, whose value is the timestamp, and one or more key fields. If there are multiple key fields, they are labeled ‘0’, ‘1’, and so on, and are explained in the metadata.
Errors
400
Get Stream Usage Request Bad Request Error
401
Get Stream Usage Request Unauthorized Error
403
Get Stream Usage Request Forbidden Error
404
Get Stream Usage Request Not Found Error
429
Get Stream Usage Request Too Many Requests Error
Get stream usage by SDK version
GET
https://app.launchdarkly.com/api/v2/usage/streams/:source/bysdkversion
GET
/api/v2/usage/streams/:source/bysdkversion
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/usage/streams/source/bysdkversion';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "key": "value"
 },
 "metadata": [
   {
     "key": "value"
   }
 ],
 "series": [
   {
     "0": 11,
     "1": 15,
     "time": 1677888000000
   }
 ]
}

Get multiple series of the number of streaming connections to LaunchDarkly in each time period, separated by SDK type and version. Information about each series is in the metadata array. The granularity of the data depends on the age of the data requested. If the requested range is within the past 2 hours, minutely data is returned. If it is within the last two days, hourly data is returned. Otherwise, daily data is returned.
Path parameters
sourcestringRequired
The source of streaming connections to describe. Must be either client or server.
Headers
AuthorizationstringRequired
Query parameters
fromstringOptional
The series of data returned starts from this timestamp. Defaults to 24 hours ago.
tostringOptional
The series of data returned ends at this timestamp. Defaults to the current time.
tzstringOptional
The timezone to use for breaks between days when returning daily data.
sdkstringOptional
If included, this filters the returned series to only those that match this SDK name.
versionstringOptional
If included, this filters the returned series to only those that match this SDK version.
Response
Usage response
_linksmap from strings to any
The location and content type of related resources
metadatalist of maps from strings to any
Metadata about each series
serieslist of maps from strings to integers
An array of data points with timestamps. Each element of the array is an object with a ‘time’ field, whose value is the timestamp, and one or more key fields. If there are multiple key fields, they are labeled ‘0’, ‘1’, and so on, and are explained in the metadata.
Errors
400
Get Stream Usage by SDK Version Request Bad Request Error
401
Get Stream Usage by SDK Version Request Unauthorized Error
403
Get Stream Usage by SDK Version Request Forbidden Error
404
Get Stream Usage by SDK Version Request Not Found Error
429
Get Stream Usage by SDK Version Request Too Many Requests Error
Get stream usage SDK versions
GET
https://app.launchdarkly.com/api/v2/usage/streams/:source/sdkversions
GET
/api/v2/usage/streams/:source/sdkversions
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/usage/streams/source/sdkversions';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "key": "value"
 },
 "sdkVersions": [
   {
     "sdk": "Android",
     "version": "3.1.2"
   },
   {
     "sdk": "Android",
     "version": "3.1.5"
   },
   {
     "sdk": "C",
     "version": "2.4.6"
   }
 ]
}

Get a list of SDK version objects, which contain an SDK name and version. These are all of the SDKs that have connected to LaunchDarkly from your account in the past 60 days.
Path parameters
sourcestringRequired
The source of streaming connections to describe. Must be either client or server.
Headers
AuthorizationstringRequired
Response
SDK Versions response
_linksmap from strings to any
The location and content type of related resources
sdkVersionslist of objects
The list of SDK names and versions
Show 2 properties
Errors
401
Get Stream Usage Sdkversion Request Unauthorized Error
403
Get Stream Usage Sdkversion Request Forbidden Error
429
Get Stream Usage Sdkversion Request Too Many Requests Error
AI Configs (beta)
This feature is in beta
To use this feature, pass in a header including the LD-API-Version key with value set to beta. Use this header with each call. To learn more, read Beta resources.
Resources that are in beta are still undergoing testing and development. They may change without notice, including becoming backwards incompatible. The AI Configs API allows you to create, retrieve, and edit AI Configs, AI Config variations, and AI model configurations.
An AI Config is a resource in LaunchDarkly that you can use to customize, test, and roll out new large language models (LLMs) within your generative AI applications. Within each AI Config, you define one or more AI Config variations, each of which includes a model configuration and one or more messages. The model configuration can be a standard one from the list provided by LaunchDarkly, or you can define your own custom AI model configuration.
To learn more, read AI Configs.
Was this page helpful?
Yes

Add AI models to the restricted list
POST
https://app.launchdarkly.com/api/v2/projects/:projectKey/ai-configs/model-configs/restricted
POST
/api/v2/projects/:projectKey/ai-configs/model-configs/restricted
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/default/ai-configs/model-configs/restricted';
const options = {
 method: 'POST',
 headers: {
   'LD-API-Version': 'beta',
   Authorization: '<apiKey>',
   'Content-Type': 'application/json'
 },
 body: '{"keys":["keys","keys"]}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Successful
{
 "successes": [
   "successes",
   "successes"
 ],
 "errors": [
   {
     "key": "key",
     "message": "message",
     "code": 0
   },
   {
     "key": "key",
     "message": "message",
     "code": 0
   }
 ]
}

Add AI models, by key, to the restricted list. Keys are included in the response from the List AI model configs endpoint.
Path parameters
projectKeystringRequired
Headers
AuthorizationstringRequired
LD-API-Version"beta"Required
Version of the endpoint.
Request
This endpoint expects an object.
keyslist of stringsRequired
Response
Successful response
successeslist of strings
errorslist of objects
Show 3 properties
Errors
400
Post Restricted Models Request Bad Request Error
403
Post Restricted Models Request Forbidden Error
404
Post Restricted Models Request Not Found Error
500
Post Restricted Models Request Internal Server Error
Create AI Config variation
POST
https://app.launchdarkly.com/api/v2/projects/:projectKey/ai-configs/:configKey/variations
POST
/api/v2/projects/:projectKey/ai-configs/:configKey/variations
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/ai-configs/configKey/variations';
const options = {
 method: 'POST',
 headers: {
   'LD-API-Version': 'beta',
   Authorization: '<apiKey>',
   'Content-Type': 'application/json'
 },
 body: '{"key":"key","messages":[{"content":"content","role":"role"},{"content":"content","role":"role"}],"name":"name","comment":"comment","description":"description","instructions":"instructions","model":{"key":"value"},"modelConfigKey":"modelConfigKey"}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Created
{
 "key": "key",
 "_id": "_id",
 "model": {
   "key": "value"
 },
 "name": "name",
 "createdAt": 6,
 "version": 1,
 "_links": {
   "parent": {
     "href": "href",
     "type": "type"
   }
 },
 "color": "color",
 "comment": "comment",
 "description": "description",
 "instructions": "instructions",
 "messages": [
   {
     "content": "content",
     "role": "role"
   },
   {
     "content": "content",
     "role": "role"
   }
 ],
 "modelConfigKey": "modelConfigKey",
 "state": "state",
 "_archivedAt": 5,
 "_publishedAt": 5
}

Create a new variation for a given AI Config.
The model in the request body requires a modelName and parameters, for example:
 "model": {
   "modelName": "claude-3-opus-20240229",
   "parameters": {
     "max_tokens": 1024
   }
 }

Path parameters
projectKeystringRequired
configKeystringRequired
Headers
AuthorizationstringRequired
LD-API-Version"beta"Required
Version of the endpoint.
Request
This endpoint expects an object.
keystringRequired
messageslist of objectsRequired
Show 2 properties
namestringRequired
commentstringOptional
Human-readable description of this variation
descriptionstringOptional
Returns the description for the agent. This is only returned for agent variations.
instructionsstringOptional
Returns the instructions for the agent. This is only returned for agent variations.
modelmap from strings to anyOptional
modelConfigKeystringOptional
Response
AI Config variation created
keystring
_idstring
modelmap from strings to any
namestring
createdAtlong
versioninteger
_linksobject or null
Show 1 properties
colorstring or null
commentstring or null
descriptionstring or null
Returns the description for the agent. This is only returned for agent variations.
instructionsstring or null
Returns the instructions for the agent. This is only returned for agent variations.
messageslist of objects or null
Show 2 properties
modelConfigKeystring or null
statestring or null
_archivedAtlong or null
_publishedAtlong or null
Errors
400
Post AI Config Variation Request Bad Request Error
403
Post AI Config Variation Request Forbidden Error
500
Post AI Config Variation Request Internal Server Error
Create an AI model config
POST
https://app.launchdarkly.com/api/v2/projects/:projectKey/ai-configs/model-configs
POST
/api/v2/projects/:projectKey/ai-configs/model-configs
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/default/ai-configs/model-configs';
const options = {
 method: 'POST',
 headers: {
   'LD-API-Version': 'beta',
   Authorization: '<apiKey>',
   'Content-Type': 'application/json'
 },
 body: '{"name":"name","key":"key","id":"id","icon":"icon","provider":"provider","params":{"key":"value"},"customParams":{"key":"value"},"tags":["tags","tags"],"costPerInputToken":0.8008281904610115,"costPerOutputToken":6.027456183070403}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Successful
{
 "name": "name",
 "key": "key",
 "id": "id",
 "global": true,
 "tags": [
   "tags",
   "tags"
 ],
 "version": 0,
 "isRestricted": true,
 "_access": {
   "denied": [
     {
       "action": "action",
       "reason": {
         "effect": "allow",
         "resources": [
           "proj/*:env/*;qa_*:/flag/*"
         ],
         "notResources": [
           "notResources",
           "notResources"
         ],
         "actions": [
           "*"
         ],
         "notActions": [
           "notActions",
           "notActions"
         ],
         "role_name": "role_name"
       }
     },
     {
       "action": "action",
       "reason": {
         "effect": "allow",
         "resources": [
           "proj/*:env/*;qa_*:/flag/*"
         ],
         "notResources": [
           "notResources",
           "notResources"
         ],
         "actions": [
           "*"
         ],
         "notActions": [
           "notActions",
           "notActions"
         ],
         "role_name": "role_name"
       }
     }
   ],
   "allowed": [
     {
       "action": "action",
       "reason": {
         "effect": "allow",
         "resources": [
           "proj/*:env/*;qa_*:/flag/*"
         ],
         "notResources": [
           "notResources",
           "notResources"
         ],
         "actions": [
           "*"
         ],
         "notActions": [
           "notActions",
           "notActions"
         ],
         "role_name": "role_name"
       }
     },
     {
       "action": "action",
       "reason": {
         "effect": "allow",
         "resources": [
           "proj/*:env/*;qa_*:/flag/*"
         ],
         "notResources": [
           "notResources",
           "notResources"
         ],
         "actions": [
           "*"
         ],
         "notActions": [
           "notActions",
           "notActions"
         ],
         "role_name": "role_name"
       }
     }
   ]
 },
 "icon": "icon",
 "provider": "provider",
 "params": {
   "key": "value"
 },
 "customParams": {
   "key": "value"
 },
 "costPerInputToken": 6.027456183070403,
 "costPerOutputToken": 1.4658129805029452
}

Create an AI model config. You can use this in any variation for any AI Config in your project.
Path parameters
projectKeystringRequired
Headers
AuthorizationstringRequired
LD-API-Version"beta"Required
Version of the endpoint.
Request
This endpoint expects an object.
namestringRequired
Human readable name of the model
keystringRequired
Unique key for the model
idstringRequired
Identifier for the model, for use with third party providers
iconstringOptional
Icon for the model
providerstringOptional
Provider for the model
paramsmap from strings to anyOptional
customParamsmap from strings to anyOptional
tagslist of stringsOptional
costPerInputTokendoubleOptional
Cost per input token in USD
costPerOutputTokendoubleOptional
Cost per output token in USD
Response
Successful response
namestring
Human readable name of the model
keystring
Unique key for the model
idstring
Identifier for the model, for use with third party providers
globalboolean
Whether the model is global
tagslist of strings
versioninteger
isRestrictedboolean
Whether the model is restricted
_accessobject or null
Show 2 properties
iconstring or null
Icon for the model
providerstring or null
Provider for the model
paramsmap from strings to any or null
customParamsmap from strings to any or null
costPerInputTokendouble or null
Cost per input token in USD
costPerOutputTokendouble or null
Cost per output token in USD
Errors
400
Post Model Config Request Bad Request Error
403
Post Model Config Request Forbidden Error
404
Post Model Config Request Not Found Error
500
Post Model Config Request Internal Server Error

Create new AI Config
POST
https://app.launchdarkly.com/api/v2/projects/:projectKey/ai-configs
POST
/api/v2/projects/:projectKey/ai-configs
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/ai-configs';
const options = {
 method: 'POST',
 headers: {
   'LD-API-Version': 'beta',
   Authorization: '<apiKey>',
   'Content-Type': 'application/json'
 },
 body: '{"key":"key","name":"name","description":"","maintainerId":"maintainerId","maintainerTeamKey":"maintainerTeamKey","mode":"completion","tags":["tags","tags"]}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Created
{
 "description": "description",
 "key": "key",
 "name": "name",
 "tags": [
   "tags",
   "tags"
 ],
 "version": 0,
 "variations": [
   {
     "key": "key",
     "_id": "_id",
     "model": {
       "key": "value"
     },
     "name": "name",
     "createdAt": 6,
     "version": 1,
     "_links": {
       "parent": {
         "href": "href",
         "type": "type"
       }
     },
     "color": "color",
     "comment": "comment",
     "description": "description",
     "instructions": "instructions",
     "messages": [
       {
         "content": "content",
         "role": "role"
       },
       {
         "content": "content",
         "role": "role"
       }
     ],
     "modelConfigKey": "modelConfigKey",
     "state": "state",
     "_archivedAt": 5,
     "_publishedAt": 5
   },
   {
     "key": "key",
     "_id": "_id",
     "model": {
       "key": "value"
     },
     "name": "name",
     "createdAt": 6,
     "version": 1,
     "_links": {
       "parent": {
         "href": "href",
         "type": "type"
       }
     },
     "color": "color",
     "comment": "comment",
     "description": "description",
     "instructions": "instructions",
     "messages": [
       {
         "content": "content",
         "role": "role"
       },
       {
         "content": "content",
         "role": "role"
       }
     ],
     "modelConfigKey": "modelConfigKey",
     "state": "state",
     "_archivedAt": 5,
     "_publishedAt": 5
   }
 ],
 "createdAt": 2,
 "updatedAt": 7,
 "_access": {
   "denied": [
     {
       "action": "action",
       "reason": {
         "effect": "allow",
         "resources": [
           "proj/*:env/*;qa_*:/flag/*"
         ],
         "notResources": [
           "notResources",
           "notResources"
         ],
         "actions": [
           "*"
         ],
         "notActions": [
           "notActions",
           "notActions"
         ],
         "role_name": "role_name"
       }
     },
     {
       "action": "action",
       "reason": {
         "effect": "allow",
         "resources": [
           "proj/*:env/*;qa_*:/flag/*"
         ],
         "notResources": [
           "notResources",
           "notResources"
         ],
         "actions": [
           "*"
         ],
         "notActions": [
           "notActions",
           "notActions"
         ],
         "role_name": "role_name"
       }
     }
   ],
   "allowed": [
     {
       "action": "action",
       "reason": {
         "effect": "allow",
         "resources": [
           "proj/*:env/*;qa_*:/flag/*"
         ],
         "notResources": [
           "notResources",
           "notResources"
         ],
         "actions": [
           "*"
         ],
         "notActions": [
           "notActions",
           "notActions"
         ],
         "role_name": "role_name"
       }
     },
     {
       "action": "action",
       "reason": {
         "effect": "allow",
         "resources": [
           "proj/*:env/*;qa_*:/flag/*"
         ],
         "notResources": [
           "notResources",
           "notResources"
         ],
         "actions": [
           "*"
         ],
         "notActions": [
           "notActions",
           "notActions"
         ],
         "role_name": "role_name"
       }
     }
   ]
 },
 "_links": {
   "self": {
     "href": "href",
     "type": "type"
   },
   "parent": {
     "href": "href",
     "type": "type"
   }
 },
 "_maintainer": {
   "key": "key",
   "name": "name"
 },
 "mode": "completion"
}

Create a new AI Config within the given project.
Path parameters
projectKeystringRequired
Headers
AuthorizationstringRequired
LD-API-Version"beta"Required
Version of the endpoint.
Request
This endpoint expects an object.
keystringRequired
namestringRequired
descriptionstringOptionalDefaults to
maintainerIdstringOptional
maintainerTeamKeystringOptional
modeenumOptionalDefaults to completion
Allowed values:agentcompletion
tagslist of stringsOptional
Response
AI Config created
descriptionstring
keystring
namestring
tagslist of strings
versioninteger
variationslist of objects
Show 16 properties
createdAtlong
updatedAtlong
_accessobject or null
Show 2 properties
_linksobject or null
The location and content type of related resources
Show 2 properties
_maintainerobject or null
Show 2 variants
modeenum or nullDefaults to completion
Allowed values:agentcompletion
Errors
400
Post AI Config Request Bad Request Error
403
Post AI Config Request Forbidden Error
500
Post AI Config Request Internal Server Error
Delete AI Config
DELETE
https://app.launchdarkly.com/api/v2/projects/:projectKey/ai-configs/:configKey
DELETE
/api/v2/projects/:projectKey/ai-configs/:configKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/default/ai-configs/configKey';
const options = {
 method: 'DELETE',
 headers: {'LD-API-Version': 'beta', Authorization: '<apiKey>'}
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
No Content
{
 "key": "value"
}

Delete an existing AI Config.
Path parameters
projectKeystringRequired
configKeystringRequired
Headers
AuthorizationstringRequired
LD-API-Version"beta"Required
Version of the endpoint.
Response
No content
Errors
400
Delete AI Config Request Bad Request Error
403
Delete AI Config Request Forbidden Error
404
Delete AI Config Request Not Found Error
500
Delete AI Config Request Internal Server Error
Delete AI Config variation
DELETE
https://app.launchdarkly.com/api/v2/projects/:projectKey/ai-configs/:configKey/variations/:variationKey
DELETE
/api/v2/projects/:projectKey/ai-configs/:configKey/variations/:variationKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/ai-configs/configKey/variations/variationKey';
const options = {
 method: 'DELETE',
 headers: {'LD-API-Version': 'beta', Authorization: '<apiKey>'}
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
No Content
{
 "key": "value"
}

Delete a specific variation of an AI Config by config key and variation key.
Path parameters
projectKeystringRequired
configKeystringRequired
variationKeystringRequired
Headers
AuthorizationstringRequired
LD-API-Version"beta"Required
Version of the endpoint.
Response
No content
Errors
400
Delete AI Config Variation Request Bad Request Error
403
Delete AI Config Variation Request Forbidden Error
404
Delete AI Config Variation Request Not Found Error
500
Delete AI Config Variation Request Internal Server Error
Delete an AI model config
DELETE
https://app.launchdarkly.com/api/v2/projects/:projectKey/ai-configs/model-configs/:modelConfigKey
DELETE
/api/v2/projects/:projectKey/ai-configs/model-configs/:modelConfigKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/default/ai-configs/model-configs/modelConfigKey';
const options = {
 method: 'DELETE',
 headers: {'LD-API-Version': 'beta', Authorization: '<apiKey>'}
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
No Content
{
 "key": "value"
}

Delete an AI model config.
Path parameters
projectKeystringRequired
modelConfigKeystringRequired
Headers
AuthorizationstringRequired
LD-API-Version"beta"Required
Version of the endpoint.
Response
No content
Errors
400
Delete Model Config Request Bad Request Error
403
Delete Model Config Request Forbidden Error
404
Delete Model Config Request Not Found Error
500
Delete Model Config Request Internal Server Error
Get AI Config
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/ai-configs/:configKey
GET
/api/v2/projects/:projectKey/ai-configs/:configKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/ai-configs/configKey';
const options = {method: 'GET', headers: {'LD-API-Version': 'beta', Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "description": "description",
 "key": "key",
 "name": "name",
 "tags": [
   "tags",
   "tags"
 ],
 "version": 0,
 "variations": [
   {
     "key": "key",
     "_id": "_id",
     "model": {
       "key": "value"
     },
     "name": "name",
     "createdAt": 6,
     "version": 1,
     "_links": {
       "parent": {
         "href": "href",
         "type": "type"
       }
     },
     "color": "color",
     "comment": "comment",
     "description": "description",
     "instructions": "instructions",
     "messages": [
       {
         "content": "content",
         "role": "role"
       },
       {
         "content": "content",
         "role": "role"
       }
     ],
     "modelConfigKey": "modelConfigKey",
     "state": "state",
     "_archivedAt": 5,
     "_publishedAt": 5
   },
   {
     "key": "key",
     "_id": "_id",
     "model": {
       "key": "value"
     },
     "name": "name",
     "createdAt": 6,
     "version": 1,
     "_links": {
       "parent": {
         "href": "href",
         "type": "type"
       }
     },
     "color": "color",
     "comment": "comment",
     "description": "description",
     "instructions": "instructions",
     "messages": [
       {
         "content": "content",
         "role": "role"
       },
       {
         "content": "content",
         "role": "role"
       }
     ],
     "modelConfigKey": "modelConfigKey",
     "state": "state",
     "_archivedAt": 5,
     "_publishedAt": 5
   }
 ],
 "createdAt": 2,
 "updatedAt": 7,
 "_access": {
   "denied": [
     {
       "action": "action",
       "reason": {
         "effect": "allow",
         "resources": [
           "proj/*:env/*;qa_*:/flag/*"
         ],
         "notResources": [
           "notResources",
           "notResources"
         ],
         "actions": [
           "*"
         ],
         "notActions": [
           "notActions",
           "notActions"
         ],
         "role_name": "role_name"
       }
     },
     {
       "action": "action",
       "reason": {
         "effect": "allow",
         "resources": [
           "proj/*:env/*;qa_*:/flag/*"
         ],
         "notResources": [
           "notResources",
           "notResources"
         ],
         "actions": [
           "*"
         ],
         "notActions": [
           "notActions",
           "notActions"
         ],
         "role_name": "role_name"
       }
     }
   ],
   "allowed": [
     {
       "action": "action",
       "reason": {
         "effect": "allow",
         "resources": [
           "proj/*:env/*;qa_*:/flag/*"
         ],
         "notResources": [
           "notResources",
           "notResources"
         ],
         "actions": [
           "*"
         ],
         "notActions": [
           "notActions",
           "notActions"
         ],
         "role_name": "role_name"
       }
     },
     {
       "action": "action",
       "reason": {
         "effect": "allow",
         "resources": [
           "proj/*:env/*;qa_*:/flag/*"
         ],
         "notResources": [
           "notResources",
           "notResources"
         ],
         "actions": [
           "*"
         ],
         "notActions": [
           "notActions",
           "notActions"
         ],
         "role_name": "role_name"
       }
     }
   ]
 },
 "_links": {
   "self": {
     "href": "href",
     "type": "type"
   },
   "parent": {
     "href": "href",
     "type": "type"
   }
 },
 "_maintainer": {
   "key": "key",
   "name": "name"
 },
 "mode": "completion"
}

Retrieve a specific AI Config by its key.
Path parameters
projectKeystringRequired
configKeystringRequired
Headers
AuthorizationstringRequired
LD-API-Version"beta"Required
Version of the endpoint.
Response
AI Config found
descriptionstring
keystring
namestring
tagslist of strings
versioninteger
variationslist of objects
Show 16 properties
createdAtlong
updatedAtlong
_accessobject or null
Show 2 properties
_linksobject or null
The location and content type of related resources
Show 2 properties
_maintainerobject or null
Show 2 variants
modeenum or nullDefaults to completion
Allowed values:agentcompletion
Errors
400
Get AI Config Request Bad Request Error
403
Get AI Config Request Forbidden Error
404
Get AI Config Request Not Found Error
500
Get AI Config Request Internal Server Error
Get AI Config metrics
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/ai-configs/:configKey/metrics
GET
/api/v2/projects/:projectKey/ai-configs/:configKey/metrics
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/ai-configs/configKey/metrics?from=1&to=1&env=env';
const options = {method: 'GET', headers: {'LD-API-Version': 'beta', Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "inputTokens": 0,
 "outputTokens": 6,
 "totalTokens": 1,
 "generationSuccessCount": 5,
 "generationErrorCount": 2,
 "thumbsUp": 7,
 "thumbsDown": 9,
 "durationMs": 3,
 "timeToFirstTokenMs": 2,
 "satisfactionRating": 0.4145608,
 "inputCost": 7.386281948385884,
 "outputCost": 1.2315135367772556,
 "generationCount": 5
}

Retrieve usage metrics for an AI Config by config key.
Path parameters
projectKeystringRequired
configKeystringRequired
Headers
AuthorizationstringRequired
LD-API-Version"beta"Required
Version of the endpoint.
Query parameters
fromintegerRequired
The starting time, as milliseconds since epoch (inclusive).
tointegerRequired
The ending time, as milliseconds since epoch (exclusive). May not be more than 100 days after from.
envstringRequired
An environment key. Only metrics from this environment will be included.
Response
Metrics computed
inputTokensinteger or null
outputTokensinteger or null
totalTokensinteger or null
generationSuccessCountinteger or null
Number of successful generations
generationErrorCountinteger or null
Number of generations with errors
thumbsUpinteger or null
thumbsDowninteger or null
durationMsinteger or null
timeToFirstTokenMsinteger or null
satisfactionRatingdouble or null
A value between 0 and 1 representing satisfaction rating
inputCostdouble or null
Cost of input tokens in USD
outputCostdouble or null
Cost of output tokens in USD
generationCountinteger or nullDeprecated
Number of attempted generations
Errors
400
Get AI Config Metrics Request Bad Request Error
403
Get AI Config Metrics Request Forbidden Error
404
Get AI Config Metrics Request Not Found Error
500
Get AI Config Metrics Request Internal Server Error
Get AI Config metrics by variation
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/ai-configs/:configKey/metrics-by-variation
GET
/api/v2/projects/:projectKey/ai-configs/:configKey/metrics-by-variation
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/ai-configs/configKey/metrics-by-variation?from=1&to=1&env=env';
const options = {method: 'GET', headers: {'LD-API-Version': 'beta', Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
[
 {
   "variationKey": "variationKey",
   "metrics": {
     "inputTokens": 0,
     "outputTokens": 6,
     "totalTokens": 1,
     "generationSuccessCount": 5,
     "generationErrorCount": 2,
     "thumbsUp": 7,
     "thumbsDown": 9,
     "durationMs": 3,
     "timeToFirstTokenMs": 2,
     "satisfactionRating": 0.4145608,
     "inputCost": 7.386281948385884,
     "outputCost": 1.2315135367772556,
     "generationCount": 5
   }
 }
]

Retrieve usage metrics for an AI Config by config key, with results split by variation.
Path parameters
projectKeystringRequired
configKeystringRequired
Headers
AuthorizationstringRequired
LD-API-Version"beta"Required
Version of the endpoint.
Query parameters
fromintegerRequired
The starting time, as milliseconds since epoch (inclusive).
tointegerRequired
The ending time, as milliseconds since epoch (exclusive). May not be more than 100 days after from.
envstringRequired
An environment key. Only metrics from this environment will be included.
Response
Metrics computed
variationKeystring or null
metricsobject or null
Show 13 properties
Errors
400
Get AI Config Metrics by Variation Request Bad Request Error
403
Get AI Config Metrics by Variation Request Forbidden Error
404
Get AI Config Metrics by Variation Request Not Found Error
500
Get AI Config Metrics by Variation Request Internal Server Error
Get AI Config variation
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/ai-configs/:configKey/variations/:variationKey
GET
/api/v2/projects/:projectKey/ai-configs/:configKey/variations/:variationKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/default/ai-configs/default/variations/default';
const options = {method: 'GET', headers: {'LD-API-Version': 'beta', Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "items": [
   {
     "key": "key",
     "_id": "_id",
     "model": {
       "key": "value"
     },
     "name": "name",
     "createdAt": 6,
     "version": 1,
     "_links": {
       "parent": {
         "href": "href",
         "type": "type"
       }
     },
     "color": "color",
     "comment": "comment",
     "description": "description",
     "instructions": "instructions",
     "messages": [
       {
         "content": "content",
         "role": "role"
       },
       {
         "content": "content",
         "role": "role"
       }
     ],
     "modelConfigKey": "modelConfigKey",
     "state": "state",
     "_archivedAt": 5,
     "_publishedAt": 5
   },
   {
     "key": "key",
     "_id": "_id",
     "model": {
       "key": "value"
     },
     "name": "name",
     "createdAt": 6,
     "version": 1,
     "_links": {
       "parent": {
         "href": "href",
         "type": "type"
       }
     },
     "color": "color",
     "comment": "comment",
     "description": "description",
     "instructions": "instructions",
     "messages": [
       {
         "content": "content",
         "role": "role"
       },
       {
         "content": "content",
         "role": "role"
       }
     ],
     "modelConfigKey": "modelConfigKey",
     "state": "state",
     "_archivedAt": 5,
     "_publishedAt": 5
   }
 ],
 "totalCount": 0
}

Get an AI Config variation by key. The response includes all variation versions for the given variation key.
Path parameters
projectKeystringRequired
configKeystringRequired
variationKeystringRequired
Headers
AuthorizationstringRequired
LD-API-Version"beta"Required
Version of the endpoint.
Response
Successful response
itemslist of objects
Show 16 properties
totalCountinteger
Errors
400
Get AI Config Variation Request Bad Request Error
403
Get AI Config Variation Request Forbidden Error
404
Get AI Config Variation Request Not Found Error
500
Get AI Config Variation Request Internal Server Error
Get AI model config
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/ai-configs/model-configs/:modelConfigKey
GET
/api/v2/projects/:projectKey/ai-configs/model-configs/:modelConfigKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/default/ai-configs/model-configs/default';
const options = {method: 'GET', headers: {'LD-API-Version': 'beta', Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "name": "name",
 "key": "key",
 "id": "id",
 "global": true,
 "tags": [
   "tags",
   "tags"
 ],
 "version": 0,
 "isRestricted": true,
 "_access": {
   "denied": [
     {
       "action": "action",
       "reason": {
         "effect": "allow",
         "resources": [
           "proj/*:env/*;qa_*:/flag/*"
         ],
         "notResources": [
           "notResources",
           "notResources"
         ],
         "actions": [
           "*"
         ],
         "notActions": [
           "notActions",
           "notActions"
         ],
         "role_name": "role_name"
       }
     },
     {
       "action": "action",
       "reason": {
         "effect": "allow",
         "resources": [
           "proj/*:env/*;qa_*:/flag/*"
         ],
         "notResources": [
           "notResources",
           "notResources"
         ],
         "actions": [
           "*"
         ],
         "notActions": [
           "notActions",
           "notActions"
         ],
         "role_name": "role_name"
       }
     }
   ],
   "allowed": [
     {
       "action": "action",
       "reason": {
         "effect": "allow",
         "resources": [
           "proj/*:env/*;qa_*:/flag/*"
         ],
         "notResources": [
           "notResources",
           "notResources"
         ],
         "actions": [
           "*"
         ],
         "notActions": [
           "notActions",
           "notActions"
         ],
         "role_name": "role_name"
       }
     },
     {
       "action": "action",
       "reason": {
         "effect": "allow",
         "resources": [
           "proj/*:env/*;qa_*:/flag/*"
         ],
         "notResources": [
           "notResources",
           "notResources"
         ],
         "actions": [
           "*"
         ],
         "notActions": [
           "notActions",
           "notActions"
         ],
         "role_name": "role_name"
       }
     }
   ]
 },
 "icon": "icon",
 "provider": "provider",
 "params": {
   "key": "value"
 },
 "customParams": {
   "key": "value"
 },
 "costPerInputToken": 6.027456183070403,
 "costPerOutputToken": 1.4658129805029452
}

Get an AI model config by key.
Path parameters
projectKeystringRequired
modelConfigKeystringRequired
Headers
AuthorizationstringRequired
LD-API-Version"beta"Required
Version of the endpoint.
Response
Successful response
namestring
Human readable name of the model
keystring
Unique key for the model
idstring
Identifier for the model, for use with third party providers
globalboolean
Whether the model is global
tagslist of strings
versioninteger
isRestrictedboolean
Whether the model is restricted
_accessobject or null
Show 2 properties
iconstring or null
Icon for the model
providerstring or null
Provider for the model
paramsmap from strings to any or null
customParamsmap from strings to any or null
costPerInputTokendouble or null
Cost per input token in USD
costPerOutputTokendouble or null
Cost per output token in USD
Errors
400
Get Model Config Request Bad Request Error
403
Get Model Config Request Forbidden Error
404
Get Model Config Request Not Found Error
500
Get Model Config Request Internal Server Error
List AI Configs
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/ai-configs
GET
/api/v2/projects/:projectKey/ai-configs
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/default/ai-configs';
const options = {method: 'GET', headers: {'LD-API-Version': 'beta', Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "items": [
   {
     "description": "description",
     "key": "key",
     "name": "name",
     "tags": [
       "tags",
       "tags"
     ],
     "version": 0,
     "variations": [
       {
         "key": "key",
         "_id": "_id",
         "model": {
           "key": "value"
         },
         "name": "name",
         "createdAt": 6,
         "version": 1,
         "_links": {
           "parent": {
             "href": "href",
             "type": "type"
           }
         },
         "color": "color",
         "comment": "comment",
         "description": "description",
         "instructions": "instructions",
         "messages": [
           {
             "content": "content",
             "role": "role"
           },
           {
             "content": "content",
             "role": "role"
           }
         ],
         "modelConfigKey": "modelConfigKey",
         "state": "state",
         "_archivedAt": 5,
         "_publishedAt": 5
       },
       {
         "key": "key",
         "_id": "_id",
         "model": {
           "key": "value"
         },
         "name": "name",
         "createdAt": 6,
         "version": 1,
         "_links": {
           "parent": {
             "href": "href",
             "type": "type"
           }
         },
         "color": "color",
         "comment": "comment",
         "description": "description",
         "instructions": "instructions",
         "messages": [
           {
             "content": "content",
             "role": "role"
           },
           {
             "content": "content",
             "role": "role"
           }
         ],
         "modelConfigKey": "modelConfigKey",
         "state": "state",
         "_archivedAt": 5,
         "_publishedAt": 5
       }
     ],
     "createdAt": 2,
     "updatedAt": 7,
     "_access": {
       "denied": [
         {
           "action": "action",
           "reason": {
             "effect": "allow",
             "resources": [
               "proj/*:env/*;qa_*:/flag/*"
             ],
             "notResources": [
               "notResources",
               "notResources"
             ],
             "actions": [
               "*"
             ],
             "notActions": [
               "notActions",
               "notActions"
             ],
             "role_name": "role_name"
           }
         },
         {
           "action": "action",
           "reason": {
             "effect": "allow",
             "resources": [
               "proj/*:env/*;qa_*:/flag/*"
             ],
             "notResources": [
               "notResources",
               "notResources"
             ],
             "actions": [
               "*"
             ],
             "notActions": [
               "notActions",
               "notActions"
             ],
             "role_name": "role_name"
           }
         }
       ],
       "allowed": [
         {
           "action": "action",
           "reason": {
             "effect": "allow",
             "resources": [
               "proj/*:env/*;qa_*:/flag/*"
             ],
             "notResources": [
               "notResources",
               "notResources"
             ],
             "actions": [
               "*"
             ],
             "notActions": [
               "notActions",
               "notActions"
             ],
             "role_name": "role_name"
           }
         },
         {
           "action": "action",
           "reason": {
             "effect": "allow",
             "resources": [
               "proj/*:env/*;qa_*:/flag/*"
             ],
             "notResources": [
               "notResources",
               "notResources"
             ],
             "actions": [
               "*"
             ],
             "notActions": [
               "notActions",
               "notActions"
             ],
             "role_name": "role_name"
           }
         }
       ]
     },
     "_links": {
       "self": {
         "href": "href",
         "type": "type"
       },
       "parent": {
         "href": "href",
         "type": "type"
       }
     },
     "_maintainer": {
       "key": "key",
       "name": "name"
     },
     "mode": "completion"
   },
   {
     "description": "description",
     "key": "key",
     "name": "name",
     "tags": [
       "tags",
       "tags"
     ],
     "version": 0,
     "variations": [
       {
         "key": "key",
         "_id": "_id",
         "model": {
           "key": "value"
         },
         "name": "name",
         "createdAt": 6,
         "version": 1,
         "_links": {
           "parent": {
             "href": "href",
             "type": "type"
           }
         },
         "color": "color",
         "comment": "comment",
         "description": "description",
         "instructions": "instructions",
         "messages": [
           {
             "content": "content",
             "role": "role"
           },
           {
             "content": "content",
             "role": "role"
           }
         ],
         "modelConfigKey": "modelConfigKey",
         "state": "state",
         "_archivedAt": 5,
         "_publishedAt": 5
       },
       {
         "key": "key",
         "_id": "_id",
         "model": {
           "key": "value"
         },
         "name": "name",
         "createdAt": 6,
         "version": 1,
         "_links": {
           "parent": {
             "href": "href",
             "type": "type"
           }
         },
         "color": "color",
         "comment": "comment",
         "description": "description",
         "instructions": "instructions",
         "messages": [
           {
             "content": "content",
             "role": "role"
           },
           {
             "content": "content",
             "role": "role"
           }
         ],
         "modelConfigKey": "modelConfigKey",
         "state": "state",
         "_archivedAt": 5,
         "_publishedAt": 5
       }
     ],
     "createdAt": 2,
     "updatedAt": 7,
     "_access": {
       "denied": [
         {
           "action": "action",
           "reason": {
             "effect": "allow",
             "resources": [
               "proj/*:env/*;qa_*:/flag/*"
             ],
             "notResources": [
               "notResources",
               "notResources"
             ],
             "actions": [
               "*"
             ],
             "notActions": [
               "notActions",
               "notActions"
             ],
             "role_name": "role_name"
           }
         },
         {
           "action": "action",
           "reason": {
             "effect": "allow",
             "resources": [
               "proj/*:env/*;qa_*:/flag/*"
             ],
             "notResources": [
               "notResources",
               "notResources"
             ],
             "actions": [
               "*"
             ],
             "notActions": [
               "notActions",
               "notActions"
             ],
             "role_name": "role_name"
           }
         }
       ],
       "allowed": [
         {
           "action": "action",
           "reason": {
             "effect": "allow",
             "resources": [
               "proj/*:env/*;qa_*:/flag/*"
             ],
             "notResources": [
               "notResources",
               "notResources"
             ],
             "actions": [
               "*"
             ],
             "notActions": [
               "notActions",
               "notActions"
             ],
             "role_name": "role_name"
           }
         },
         {
           "action": "action",
           "reason": {
             "effect": "allow",
             "resources": [
               "proj/*:env/*;qa_*:/flag/*"
             ],
             "notResources": [
               "notResources",
               "notResources"
             ],
             "actions": [
               "*"
             ],
             "notActions": [
               "notActions",
               "notActions"
             ],
             "role_name": "role_name"
           }
         }
       ]
     },
     "_links": {
       "self": {
         "href": "href",
         "type": "type"
       },
       "parent": {
         "href": "href",
         "type": "type"
       }
     },
     "_maintainer": {
       "key": "key",
       "name": "name"
     },
     "mode": "completion"
   }
 ],
 "totalCount": 9,
 "_links": {
   "self": {
     "href": "href",
     "type": "type"
   },
   "first": {
     "href": "href",
     "type": "type"
   },
   "last": {
     "href": "href",
     "type": "type"
   },
   "next": {
     "href": "href",
     "type": "type"
   },
   "prev": {
     "href": "href",
     "type": "type"
   }
 }
}

Get a list of all AI Configs in the given project.
Path parameters
projectKeystringRequired
Headers
AuthorizationstringRequired
LD-API-Version"beta"Required
Version of the endpoint.
Query parameters
sortstringOptional
A sort to apply to the list of AI Configs.
limitintegerOptional
The number of AI Configs to return.
offsetintegerOptional
Where to start in the list. Use this with pagination. For example, an offset of 10 skips the first ten items and then returns the next items in the list, up to the query limit.
filterstringOptional
A filter to apply to the list of AI Configs.
Response
Successful response
itemslist of objects
Show 12 properties
totalCountinteger
_linksobject or null
Show 5 properties
Errors
400
Get AI Configs Request Bad Request Error
403
Get AI Configs Request Forbidden Error
404
Get AI Configs Request Not Found Error
500
Get AI Configs Request Internal Server Error
List AI model configs
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/ai-configs/model-configs
GET
/api/v2/projects/:projectKey/ai-configs/model-configs
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/default/ai-configs/model-configs';
const options = {method: 'GET', headers: {'LD-API-Version': 'beta', Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
[
 {
   "name": "name",
   "key": "key",
   "id": "id",
   "global": true,
   "tags": [
     "tags",
     "tags"
   ],
   "version": 0,
   "isRestricted": true,
   "_access": {
     "denied": [
       {
         "action": "action",
         "reason": {
           "effect": "allow",
           "resources": [
             "proj/*:env/*;qa_*:/flag/*"
           ],
           "notResources": [
             "notResources",
             "notResources"
           ],
           "actions": [
             "*"
           ],
           "notActions": [
             "notActions",
             "notActions"
           ],
           "role_name": "role_name"
         }
       },
       {
         "action": "action",
         "reason": {
           "effect": "allow",
           "resources": [
             "proj/*:env/*;qa_*:/flag/*"
           ],
           "notResources": [
             "notResources",
             "notResources"
           ],
           "actions": [
             "*"
           ],
           "notActions": [
             "notActions",
             "notActions"
           ],
           "role_name": "role_name"
         }
       }
     ],
     "allowed": [
       {
         "action": "action",
         "reason": {
           "effect": "allow",
           "resources": [
             "proj/*:env/*;qa_*:/flag/*"
           ],
           "notResources": [
             "notResources",
             "notResources"
           ],
           "actions": [
             "*"
           ],
           "notActions": [
             "notActions",
             "notActions"
           ],
           "role_name": "role_name"
         }
       },
       {
         "action": "action",
         "reason": {
           "effect": "allow",
           "resources": [
             "proj/*:env/*;qa_*:/flag/*"
           ],
           "notResources": [
             "notResources",
             "notResources"
           ],
           "actions": [
             "*"
           ],
           "notActions": [
             "notActions",
             "notActions"
           ],
           "role_name": "role_name"
         }
       }
     ]
   },
   "icon": "icon",
   "provider": "provider",
   "params": {
     "key": "value"
   },
   "customParams": {
     "key": "value"
   },
   "costPerInputToken": 6.027456183070403,
   "costPerOutputToken": 1.4658129805029452
 }
]

Get all AI model configs for a project.
Path parameters
projectKeystringRequired
Headers
AuthorizationstringRequired
LD-API-Version"beta"Required
Version of the endpoint.
Query parameters
restrictedbooleanOptional
Whether to return only restricted models
Response
Successful response
namestring
Human readable name of the model
keystring
Unique key for the model
idstring
Identifier for the model, for use with third party providers
globalboolean
Whether the model is global
tagslist of strings
versioninteger
isRestrictedboolean
Whether the model is restricted
_accessobject or null
Show 2 properties
iconstring or null
Icon for the model
providerstring or null
Provider for the model
paramsmap from strings to any or null
customParamsmap from strings to any or null
costPerInputTokendouble or null
Cost per input token in USD
costPerOutputTokendouble or null
Cost per output token in USD
Errors
400
List Model Configs Request Bad Request Error
403
List Model Configs Request Forbidden Error
404
List Model Configs Request Not Found Error
500
List Model Configs Request Internal Server Error
Remove AI models from the restricted list
DELETE
https://app.launchdarkly.com/api/v2/projects/:projectKey/ai-configs/model-configs/restricted
DELETE
/api/v2/projects/:projectKey/ai-configs/model-configs/restricted
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/default/ai-configs/model-configs/restricted';
const options = {
 method: 'DELETE',
 headers: {
   'LD-API-Version': 'beta',
   Authorization: '<apiKey>',
   'Content-Type': 'application/json'
 },
 body: '{"keys":["keys","keys"]}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Remove AI models, by key, from the restricted list.
Path parameters
projectKeystringRequired
Headers
AuthorizationstringRequired
LD-API-Version"beta"Required
Version of the endpoint.
Request
This endpoint expects an object.
keyslist of stringsRequired
Errors
400
Delete Restricted Models Request Bad Request Error
403
Delete Restricted Models Request Forbidden Error
404
Delete Restricted Models Request Not Found Error
500
Delete Restricted Models Request Internal Server Error
Show an AI Config's targeting
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/ai-configs/:configKey/targeting
GET
/api/v2/projects/:projectKey/ai-configs/:configKey/targeting
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/ai-configs/configKey/targeting';
const options = {method: 'GET', headers: {'LD-API-Version': 'beta', Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "createdAt": 0,
 "environments": {
   "key": {
     "contextTargets": [
       {
         "contextKind": "contextKind",
         "values": [
           "values",
           "values"
         ],
         "variation": 5
       },
       {
         "contextKind": "contextKind",
         "values": [
           "values",
           "values"
         ],
         "variation": 5
       }
     ],
     "enabled": true,
     "fallthrough": {
       "variation": 5,
       "rollout": {
         "contextKind": "contextKind",
         "variations": [
           {
             "variation": 9,
             "weight": 3,
             "_untracked": true
           },
           {
             "variation": 9,
             "weight": 3,
             "_untracked": true
           }
         ],
         "bucketBy": "bucketBy",
         "experimentAllocation": {
           "canReshuffle": true,
           "defaultVariation": 2,
           "type": "type"
         },
         "seed": 7
       }
     },
     "lastModified": 2,
     "rules": [
       {
         "clauses": [
           {
             "attribute": "attribute",
             "id": "id",
             "negate": true,
             "op": "op",
             "values": [
               "",
               ""
             ]
           },
           {
             "attribute": "attribute",
             "id": "id",
             "negate": true,
             "op": "op",
             "values": [
               "",
               ""
             ]
           }
         ],
         "trackEvents": true
       },
       {
         "clauses": [
           {
             "attribute": "attribute",
             "id": "id",
             "negate": true,
             "op": "op",
             "values": [
               "",
               ""
             ]
           },
           {
             "attribute": "attribute",
             "id": "id",
             "negate": true,
             "op": "op",
             "values": [
               "",
               ""
             ]
           }
         ],
         "trackEvents": true
       }
     ],
     "targets": [
       {
         "contextKind": "contextKind",
         "values": [
           "values",
           "values"
         ],
         "variation": 5
       },
       {
         "contextKind": "contextKind",
         "values": [
           "values",
           "values"
         ],
         "variation": 5
       }
     ],
     "trackEvents": true,
     "trackEventsFallthrough": true,
     "_environmentName": "_environmentName",
     "_version": 7,
     "offVariation": 4
   }
 },
 "experiments": {
   "baselineIdx": 1,
   "items": [
     {
       "metricKey": "my-metric",
       "_metric": {
         "_id": "5902deadbeef667524a01290",
         "_versionId": "version-id-123abc",
         "key": "metric-key-123abc",
         "name": "My metric",
         "kind": "custom",
         "_links": {
           "parent": {
             "href": "/api/v2/metrics/my-project",
             "type": "application/json"
           },
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "tags": [
           "tags"
         ],
         "_creationDate": 1,
         "experimentCount": 0,
         "metricGroupCount": 0,
         "guardedRolloutCount": 0,
         "_attachedFlagCount": 0,
         "_site": {
           "href": "href",
           "type": "type"
         },
         "_access": {
           "denied": [
             {
               "action": "action",
               "reason": {
                 "effect": "allow",
                 "resources": [
                   "proj/*:env/*;qa_*:/flag/*"
                 ],
                 "notResources": [
                   "notResources",
                   "notResources"
                 ],
                 "actions": [
                   "*"
                 ],
                 "notActions": [
                   "notActions",
                   "notActions"
                 ],
                 "role_name": "role_name"
               }
             },
             {
               "action": "action",
               "reason": {
                 "effect": "allow",
                 "resources": [
                   "proj/*:env/*;qa_*:/flag/*"
                 ],
                 "notResources": [
                   "notResources",
                   "notResources"
                 ],
                 "actions": [
                   "*"
                 ],
                 "notActions": [
                   "notActions",
                   "notActions"
                 ],
                 "role_name": "role_name"
               }
             }
           ],
           "allowed": [
             {
               "action": "action",
               "reason": {
                 "effect": "allow",
                 "resources": [
                   "proj/*:env/*;qa_*:/flag/*"
                 ],
                 "notResources": [
                   "notResources",
                   "notResources"
                 ],
                 "actions": [
                   "*"
                 ],
                 "notActions": [
                   "notActions",
                   "notActions"
                 ],
                 "role_name": "role_name"
               }
             },
             {
               "action": "action",
               "reason": {
                 "effect": "allow",
                 "resources": [
                   "proj/*:env/*;qa_*:/flag/*"
                 ],
                 "notResources": [
                   "notResources",
                   "notResources"
                 ],
                 "actions": [
                   "*"
                 ],
                 "notActions": [
                   "notActions",
                   "notActions"
                 ],
                 "role_name": "role_name"
               }
             }
           ]
         },
         "lastModified": {
           "date": "2021-08-05T19:46:31Z"
         },
         "maintainerId": "569fdeadbeef1644facecafe",
         "_maintainer": {
           "_links": {
             "self": {
               "href": "/api/v2/members/569f183514f4432160000007",
               "type": "application/json"
             }
           },
           "_id": "569f183514f4432160000007",
           "role": "admin",
           "email": "ariel@acme.com",
           "firstName": "Ariel",
           "lastName": "Flores"
         },
         "description": "description",
         "category": "Error monitoring",
         "isNumeric": true,
         "successCriteria": "HigherThanBaseline",
         "unit": "unit",
         "eventKey": "Order placed",
         "randomizationUnits": [
           "user"
         ],
         "filters": {
           "type": "contextAttribute",
           "op": "op",
           "values": [
             "JP"
           ],
           "negate": false,
           "attribute": "country",
           "contextKind": "user"
         },
         "unitAggregationType": "average",
         "analysisType": "mean",
         "percentileValue": 95,
         "eventDefault": {
           "disabled": true,
           "value": 0
         }
       },
       "environments": [
         "production",
         "test",
         "my-environment"
       ],
       "_environmentSettings": {
         "key": {
           "startDate": 1,
           "stopDate": 6,
           "enabledPeriods": [
             {
               "startDate": 7,
               "stopDate": 1
             },
             {
               "startDate": 7,
               "stopDate": 1
             }
           ]
         }
       }
     },
     {
       "metricKey": "my-metric",
       "_metric": {
         "_id": "5902deadbeef667524a01290",
         "_versionId": "version-id-123abc",
         "key": "metric-key-123abc",
         "name": "My metric",
         "kind": "custom",
         "_links": {
           "parent": {
             "href": "/api/v2/metrics/my-project",
             "type": "application/json"
           },
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "tags": [
           "tags"
         ],
         "_creationDate": 1,
         "experimentCount": 0,
         "metricGroupCount": 0,
         "guardedRolloutCount": 0,
         "_attachedFlagCount": 0,
         "_site": {
           "href": "href",
           "type": "type"
         },
         "_access": {
           "denied": [
             {
               "action": "action",
               "reason": {
                 "effect": "allow",
                 "resources": [
                   "proj/*:env/*;qa_*:/flag/*"
                 ],
                 "notResources": [
                   "notResources",
                   "notResources"
                 ],
                 "actions": [
                   "*"
                 ],
                 "notActions": [
                   "notActions",
                   "notActions"
                 ],
                 "role_name": "role_name"
               }
             },
             {
               "action": "action",
               "reason": {
                 "effect": "allow",
                 "resources": [
                   "proj/*:env/*;qa_*:/flag/*"
                 ],
                 "notResources": [
                   "notResources",
                   "notResources"
                 ],
                 "actions": [
                   "*"
                 ],
                 "notActions": [
                   "notActions",
                   "notActions"
                 ],
                 "role_name": "role_name"
               }
             }
           ],
           "allowed": [
             {
               "action": "action",
               "reason": {
                 "effect": "allow",
                 "resources": [
                   "proj/*:env/*;qa_*:/flag/*"
                 ],
                 "notResources": [
                   "notResources",
                   "notResources"
                 ],
                 "actions": [
                   "*"
                 ],
                 "notActions": [
                   "notActions",
                   "notActions"
                 ],
                 "role_name": "role_name"
               }
             },
             {
               "action": "action",
               "reason": {
                 "effect": "allow",
                 "resources": [
                   "proj/*:env/*;qa_*:/flag/*"
                 ],
                 "notResources": [
                   "notResources",
                   "notResources"
                 ],
                 "actions": [
                   "*"
                 ],
                 "notActions": [
                   "notActions",
                   "notActions"
                 ],
                 "role_name": "role_name"
               }
             }
           ]
         },
         "lastModified": {
           "date": "2021-08-05T19:46:31Z"
         },
         "maintainerId": "569fdeadbeef1644facecafe",
         "_maintainer": {
           "_links": {
             "self": {
               "href": "/api/v2/members/569f183514f4432160000007",
               "type": "application/json"
             }
           },
           "_id": "569f183514f4432160000007",
           "role": "admin",
           "email": "ariel@acme.com",
           "firstName": "Ariel",
           "lastName": "Flores"
         },
         "description": "description",
         "category": "Error monitoring",
         "isNumeric": true,
         "successCriteria": "HigherThanBaseline",
         "unit": "unit",
         "eventKey": "Order placed",
         "randomizationUnits": [
           "user"
         ],
         "filters": {
           "type": "contextAttribute",
           "op": "op",
           "values": [
             "JP"
           ],
           "negate": false,
           "attribute": "country",
           "contextKind": "user"
         },
         "unitAggregationType": "average",
         "analysisType": "mean",
         "percentileValue": 95,
         "eventDefault": {
           "disabled": true,
           "value": 0
         }
       },
       "environments": [
         "production",
         "test",
         "my-environment"
       ],
       "_environmentSettings": {
         "key": {
           "startDate": 1,
           "stopDate": 6,
           "enabledPeriods": [
             {
               "startDate": 7,
               "stopDate": 1
             },
             {
               "startDate": 7,
               "stopDate": 1
             }
           ]
         }
       }
     }
   ]
 },
 "key": "key",
 "name": "name",
 "tags": [
   "tags",
   "tags"
 ],
 "variations": [
   {
     "_id": "_id",
     "description": "description",
     "name": "name",
     "value": true
   },
   {
     "_id": "_id",
     "description": "description",
     "name": "name",
     "value": true
   }
 ],
 "_version": 4,
 "defaults": {
   "onVariation": 6,
   "offVariation": 1
 }
}

Retrieves a specific AI Config's targeting by its key
Path parameters
projectKeystringRequired
configKeystringRequired
Headers
AuthorizationstringRequired
LD-API-Version"beta"Required
Version of the endpoint.
Response
Successful response
createdAtlong
Unix timestamp in milliseconds
environmentsmap from strings to objects
Show 11 properties
experimentsobject
Show 2 properties
keystring
namestring
tagslist of strings
variationslist of objects
Show 4 properties
_versioninteger
defaultsobject or null
Show 2 properties
Errors
403
Get AI Config Targeting Request Forbidden Error
404
Get AI Config Targeting Request Not Found Error
500
Get AI Config Targeting Request Internal Server Error
Update AI Config
PATCH
https://app.launchdarkly.com/api/v2/projects/:projectKey/ai-configs/:configKey
PATCH
/api/v2/projects/:projectKey/ai-configs/:configKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/ai-configs/configKey';
const options = {
 method: 'PATCH',
 headers: {
   'LD-API-Version': 'beta',
   Authorization: '<apiKey>',
   'Content-Type': 'application/json'
 },
 body: '{"description":"description","maintainerId":"maintainerId","maintainerTeamKey":"maintainerTeamKey","name":"name","tags":["tags","tags"]}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Updated
{
 "description": "description",
 "key": "key",
 "name": "name",
 "tags": [
   "tags",
   "tags"
 ],
 "version": 0,
 "variations": [
   {
     "key": "key",
     "_id": "_id",
     "model": {
       "key": "value"
     },
     "name": "name",
     "createdAt": 6,
     "version": 1,
     "_links": {
       "parent": {
         "href": "href",
         "type": "type"
       }
     },
     "color": "color",
     "comment": "comment",
     "description": "description",
     "instructions": "instructions",
     "messages": [
       {
         "content": "content",
         "role": "role"
       },
       {
         "content": "content",
         "role": "role"
       }
     ],
     "modelConfigKey": "modelConfigKey",
     "state": "state",
     "_archivedAt": 5,
     "_publishedAt": 5
   },
   {
     "key": "key",
     "_id": "_id",
     "model": {
       "key": "value"
     },
     "name": "name",
     "createdAt": 6,
     "version": 1,
     "_links": {
       "parent": {
         "href": "href",
         "type": "type"
       }
     },
     "color": "color",
     "comment": "comment",
     "description": "description",
     "instructions": "instructions",
     "messages": [
       {
         "content": "content",
         "role": "role"
       },
       {
         "content": "content",
         "role": "role"
       }
     ],
     "modelConfigKey": "modelConfigKey",
     "state": "state",
     "_archivedAt": 5,
     "_publishedAt": 5
   }
 ],
 "createdAt": 2,
 "updatedAt": 7,
 "_access": {
   "denied": [
     {
       "action": "action",
       "reason": {
         "effect": "allow",
         "resources": [
           "proj/*:env/*;qa_*:/flag/*"
         ],
         "notResources": [
           "notResources",
           "notResources"
         ],
         "actions": [
           "*"
         ],
         "notActions": [
           "notActions",
           "notActions"
         ],
         "role_name": "role_name"
       }
     },
     {
       "action": "action",
       "reason": {
         "effect": "allow",
         "resources": [
           "proj/*:env/*;qa_*:/flag/*"
         ],
         "notResources": [
           "notResources",
           "notResources"
         ],
         "actions": [
           "*"
         ],
         "notActions": [
           "notActions",
           "notActions"
         ],
         "role_name": "role_name"
       }
     }
   ],
   "allowed": [
     {
       "action": "action",
       "reason": {
         "effect": "allow",
         "resources": [
           "proj/*:env/*;qa_*:/flag/*"
         ],
         "notResources": [
           "notResources",
           "notResources"
         ],
         "actions": [
           "*"
         ],
         "notActions": [
           "notActions",
           "notActions"
         ],
         "role_name": "role_name"
       }
     },
     {
       "action": "action",
       "reason": {
         "effect": "allow",
         "resources": [
           "proj/*:env/*;qa_*:/flag/*"
         ],
         "notResources": [
           "notResources",
           "notResources"
         ],
         "actions": [
           "*"
         ],
         "notActions": [
           "notActions",
           "notActions"
         ],
         "role_name": "role_name"
       }
     }
   ]
 },
 "_links": {
   "self": {
     "href": "href",
     "type": "type"
   },
   "parent": {
     "href": "href",
     "type": "type"
   }
 },
 "_maintainer": {
   "key": "key",
   "name": "name"
 },
 "mode": "completion"
}

Edit an existing AI Config.
The request body must be a JSON object of the fields to update. The values you include replace the existing values for the fields.
Here’s an example:
 {
   "description": "Example updated description",
   "tags": ["new-tag"]
 }

Path parameters
projectKeystringRequired
configKeystringRequired
Headers
AuthorizationstringRequired
LD-API-Version"beta"Required
Version of the endpoint.
Request
This endpoint expects an object.
descriptionstringOptional
maintainerIdstringOptional
maintainerTeamKeystringOptional
namestringOptional
tagslist of stringsOptional
Response
AI Config updated
descriptionstring
keystring
namestring
tagslist of strings
versioninteger
variationslist of objects
Show 16 properties
createdAtlong
updatedAtlong
_accessobject or null
Show 2 properties
_linksobject or null
The location and content type of related resources
Show 2 properties
_maintainerobject or null
Show 2 variants
modeenum or nullDefaults to completion
Allowed values:agentcompletion
Errors
400
Patch AI Config Request Bad Request Error
403
Patch AI Config Request Forbidden Error
404
Patch AI Config Request Not Found Error
500
Patch AI Config Request Internal Server Error
Update AI Config targeting
PATCH
https://app.launchdarkly.com/api/v2/projects/:projectKey/ai-configs/:configKey/targeting
PATCH
/api/v2/projects/:projectKey/ai-configs/:configKey/targeting
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/ai-configs/configKey/targeting';
const options = {
 method: 'PATCH',
 headers: {
   'LD-API-Version': 'beta',
   Authorization: '<apiKey>',
   'Content-Type': 'application/json'
 },
 body: '{"environmentKey":"environmentKey","instructions":[{"key":""},{"key":""}],"comment":"comment"}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Updated
{
 "createdAt": 0,
 "environments": {
   "key": {
     "contextTargets": [
       {
         "contextKind": "contextKind",
         "values": [
           "values",
           "values"
         ],
         "variation": 5
       },
       {
         "contextKind": "contextKind",
         "values": [
           "values",
           "values"
         ],
         "variation": 5
       }
     ],
     "enabled": true,
     "fallthrough": {
       "variation": 5,
       "rollout": {
         "contextKind": "contextKind",
         "variations": [
           {
             "variation": 9,
             "weight": 3,
             "_untracked": true
           },
           {
             "variation": 9,
             "weight": 3,
             "_untracked": true
           }
         ],
         "bucketBy": "bucketBy",
         "experimentAllocation": {
           "canReshuffle": true,
           "defaultVariation": 2,
           "type": "type"
         },
         "seed": 7
       }
     },
     "lastModified": 2,
     "rules": [
       {
         "clauses": [
           {
             "attribute": "attribute",
             "id": "id",
             "negate": true,
             "op": "op",
             "values": [
               "",
               ""
             ]
           },
           {
             "attribute": "attribute",
             "id": "id",
             "negate": true,
             "op": "op",
             "values": [
               "",
               ""
             ]
           }
         ],
         "trackEvents": true
       },
       {
         "clauses": [
           {
             "attribute": "attribute",
             "id": "id",
             "negate": true,
             "op": "op",
             "values": [
               "",
               ""
             ]
           },
           {
             "attribute": "attribute",
             "id": "id",
             "negate": true,
             "op": "op",
             "values": [
               "",
               ""
             ]
           }
         ],
         "trackEvents": true
       }
     ],
     "targets": [
       {
         "contextKind": "contextKind",
         "values": [
           "values",
           "values"
         ],
         "variation": 5
       },
       {
         "contextKind": "contextKind",
         "values": [
           "values",
           "values"
         ],
         "variation": 5
       }
     ],
     "trackEvents": true,
     "trackEventsFallthrough": true,
     "_environmentName": "_environmentName",
     "_version": 7,
     "offVariation": 4
   }
 },
 "experiments": {
   "baselineIdx": 1,
   "items": [
     {
       "metricKey": "my-metric",
       "_metric": {
         "_id": "5902deadbeef667524a01290",
         "_versionId": "version-id-123abc",
         "key": "metric-key-123abc",
         "name": "My metric",
         "kind": "custom",
         "_links": {
           "parent": {
             "href": "/api/v2/metrics/my-project",
             "type": "application/json"
           },
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "tags": [
           "tags"
         ],
         "_creationDate": 1,
         "experimentCount": 0,
         "metricGroupCount": 0,
         "guardedRolloutCount": 0,
         "_attachedFlagCount": 0,
         "_site": {
           "href": "href",
           "type": "type"
         },
         "_access": {
           "denied": [
             {
               "action": "action",
               "reason": {
                 "effect": "allow",
                 "resources": [
                   "proj/*:env/*;qa_*:/flag/*"
                 ],
                 "notResources": [
                   "notResources",
                   "notResources"
                 ],
                 "actions": [
                   "*"
                 ],
                 "notActions": [
                   "notActions",
                   "notActions"
                 ],
                 "role_name": "role_name"
               }
             },
             {
               "action": "action",
               "reason": {
                 "effect": "allow",
                 "resources": [
                   "proj/*:env/*;qa_*:/flag/*"
                 ],
                 "notResources": [
                   "notResources",
                   "notResources"
                 ],
                 "actions": [
                   "*"
                 ],
                 "notActions": [
                   "notActions",
                   "notActions"
                 ],
                 "role_name": "role_name"
               }
             }
           ],
           "allowed": [
             {
               "action": "action",
               "reason": {
                 "effect": "allow",
                 "resources": [
                   "proj/*:env/*;qa_*:/flag/*"
                 ],
                 "notResources": [
                   "notResources",
                   "notResources"
                 ],
                 "actions": [
                   "*"
                 ],
                 "notActions": [
                   "notActions",
                   "notActions"
                 ],
                 "role_name": "role_name"
               }
             },
             {
               "action": "action",
               "reason": {
                 "effect": "allow",
                 "resources": [
                   "proj/*:env/*;qa_*:/flag/*"
                 ],
                 "notResources": [
                   "notResources",
                   "notResources"
                 ],
                 "actions": [
                   "*"
                 ],
                 "notActions": [
                   "notActions",
                   "notActions"
                 ],
                 "role_name": "role_name"
               }
             }
           ]
         },
         "lastModified": {
           "date": "2021-08-05T19:46:31Z"
         },
         "maintainerId": "569fdeadbeef1644facecafe",
         "_maintainer": {
           "_links": {
             "self": {
               "href": "/api/v2/members/569f183514f4432160000007",
               "type": "application/json"
             }
           },
           "_id": "569f183514f4432160000007",
           "role": "admin",
           "email": "ariel@acme.com",
           "firstName": "Ariel",
           "lastName": "Flores"
         },
         "description": "description",
         "category": "Error monitoring",
         "isNumeric": true,
         "successCriteria": "HigherThanBaseline",
         "unit": "unit",
         "eventKey": "Order placed",
         "randomizationUnits": [
           "user"
         ],
         "filters": {
           "type": "contextAttribute",
           "op": "op",
           "values": [
             "JP"
           ],
           "negate": false,
           "attribute": "country",
           "contextKind": "user"
         },
         "unitAggregationType": "average",
         "analysisType": "mean",
         "percentileValue": 95,
         "eventDefault": {
           "disabled": true,
           "value": 0
         }
       },
       "environments": [
         "production",
         "test",
         "my-environment"
       ],
       "_environmentSettings": {
         "key": {
           "startDate": 1,
           "stopDate": 6,
           "enabledPeriods": [
             {
               "startDate": 7,
               "stopDate": 1
             },
             {
               "startDate": 7,
               "stopDate": 1
             }
           ]
         }
       }
     },
     {
       "metricKey": "my-metric",
       "_metric": {
         "_id": "5902deadbeef667524a01290",
         "_versionId": "version-id-123abc",
         "key": "metric-key-123abc",
         "name": "My metric",
         "kind": "custom",
         "_links": {
           "parent": {
             "href": "/api/v2/metrics/my-project",
             "type": "application/json"
           },
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "tags": [
           "tags"
         ],
         "_creationDate": 1,
         "experimentCount": 0,
         "metricGroupCount": 0,
         "guardedRolloutCount": 0,
         "_attachedFlagCount": 0,
         "_site": {
           "href": "href",
           "type": "type"
         },
         "_access": {
           "denied": [
             {
               "action": "action",
               "reason": {
                 "effect": "allow",
                 "resources": [
                   "proj/*:env/*;qa_*:/flag/*"
                 ],
                 "notResources": [
                   "notResources",
                   "notResources"
                 ],
                 "actions": [
                   "*"
                 ],
                 "notActions": [
                   "notActions",
                   "notActions"
                 ],
                 "role_name": "role_name"
               }
             },
             {
               "action": "action",
               "reason": {
                 "effect": "allow",
                 "resources": [
                   "proj/*:env/*;qa_*:/flag/*"
                 ],
                 "notResources": [
                   "notResources",
                   "notResources"
                 ],
                 "actions": [
                   "*"
                 ],
                 "notActions": [
                   "notActions",
                   "notActions"
                 ],
                 "role_name": "role_name"
               }
             }
           ],
           "allowed": [
             {
               "action": "action",
               "reason": {
                 "effect": "allow",
                 "resources": [
                   "proj/*:env/*;qa_*:/flag/*"
                 ],
                 "notResources": [
                   "notResources",
                   "notResources"
                 ],
                 "actions": [
                   "*"
                 ],
                 "notActions": [
                   "notActions",
                   "notActions"
                 ],
                 "role_name": "role_name"
               }
             },
             {
               "action": "action",
               "reason": {
                 "effect": "allow",
                 "resources": [
                   "proj/*:env/*;qa_*:/flag/*"
                 ],
                 "notResources": [
                   "notResources",
                   "notResources"
                 ],
                 "actions": [
                   "*"
                 ],
                 "notActions": [
                   "notActions",
                   "notActions"
                 ],
                 "role_name": "role_name"
               }
             }
           ]
         },
         "lastModified": {
           "date": "2021-08-05T19:46:31Z"
         },
         "maintainerId": "569fdeadbeef1644facecafe",
         "_maintainer": {
           "_links": {
             "self": {
               "href": "/api/v2/members/569f183514f4432160000007",
               "type": "application/json"
             }
           },
           "_id": "569f183514f4432160000007",
           "role": "admin",
           "email": "ariel@acme.com",
           "firstName": "Ariel",
           "lastName": "Flores"
         },
         "description": "description",
         "category": "Error monitoring",
         "isNumeric": true,
         "successCriteria": "HigherThanBaseline",
         "unit": "unit",
         "eventKey": "Order placed",
         "randomizationUnits": [
           "user"
         ],
         "filters": {
           "type": "contextAttribute",
           "op": "op",
           "values": [
             "JP"
           ],
           "negate": false,
           "attribute": "country",
           "contextKind": "user"
         },
         "unitAggregationType": "average",
         "analysisType": "mean",
         "percentileValue": 95,
         "eventDefault": {
           "disabled": true,
           "value": 0
         }
       },
       "environments": [
         "production",
         "test",
         "my-environment"
       ],
       "_environmentSettings": {
         "key": {
           "startDate": 1,
           "stopDate": 6,
           "enabledPeriods": [
             {
               "startDate": 7,
               "stopDate": 1
             },
             {
               "startDate": 7,
               "stopDate": 1
             }
           ]
         }
       }
     }
   ]
 },
 "key": "key",
 "name": "name",
 "tags": [
   "tags",
   "tags"
 ],
 "variations": [
   {
     "_id": "_id",
     "description": "description",
     "name": "name",
     "value": true
   },
   {
     "_id": "_id",
     "description": "description",
     "name": "name",
     "value": true
   }
 ],
 "_version": 4,
 "defaults": {
   "onVariation": 6,
   "offVariation": 1
 }
}

Perform a partial update to an AI Config’s targeting. The request body must be a valid semantic patch.
Using semantic patches on an AI Config
To make a semantic patch request, you must append domain-model=launchdarkly.semanticpatch to your Content-Type header. To learn more, read Updates using semantic patch.
The body of a semantic patch request for updating an AI Config’s targeting takes the following properties:
comment (string): (Optional) A description of the update.
environmentKey (string): The key of the LaunchDarkly environment.
instructions (array): (Required) A list of actions the update should perform. Each action in the list must be an object with a kind property that indicates the instruction. If the action requires parameters, you must include those parameters as additional fields in the object. The body of a single semantic patch can contain many different instructions.
Instructions
Semantic patch requests support the following kind instructions for updating AI Configs.
Click to expand instructions for working with targeting and variations for AI Configs













































































































































































































































































































































































































































































































































































Path parameters
projectKeystringRequired
configKeystringRequired
Headers
AuthorizationstringRequired
LD-API-Version"beta"Required
Version of the endpoint.
Request
This endpoint expects an object.
environmentKeystringRequired
instructionslist of maps from strings to anyRequired
commentstringOptional
Response
AI Config targeting updated
createdAtlong
Unix timestamp in milliseconds
environmentsmap from strings to objects
Show 11 properties
experimentsobject
Show 2 properties
keystring
namestring
tagslist of strings
variationslist of objects
Show 4 properties
_versioninteger
defaultsobject or null
Show 2 properties
Errors
400
Patch AI Config Targeting Request Bad Request Error
403
Patch AI Config Targeting Request Forbidden Error
404
Patch AI Config Targeting Request Not Found Error
500
Patch AI Config Targeting Request Internal Server Error
Update AI Config variation
PATCH
https://app.launchdarkly.com/api/v2/projects/:projectKey/ai-configs/:configKey/variations/:variationKey
PATCH
/api/v2/projects/:projectKey/ai-configs/:configKey/variations/:variationKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/ai-configs/configKey/variations/variationKey';
const options = {
 method: 'PATCH',
 headers: {
   'LD-API-Version': 'beta',
   Authorization: '<apiKey>',
   'Content-Type': 'application/json'
 },
 body: '{"comment":"comment","description":"description","instructions":"instructions","messages":[{"content":"content","role":"role"},{"content":"content","role":"role"}],"model":{"key":"value"},"modelConfigKey":"modelConfigKey","name":"name","published":true,"state":"state"}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Updated
{
 "key": "key",
 "_id": "_id",
 "model": {
   "key": "value"
 },
 "name": "name",
 "createdAt": 6,
 "version": 1,
 "_links": {
   "parent": {
     "href": "href",
     "type": "type"
   }
 },
 "color": "color",
 "comment": "comment",
 "description": "description",
 "instructions": "instructions",
 "messages": [
   {
     "content": "content",
     "role": "role"
   },
   {
     "content": "content",
     "role": "role"
   }
 ],
 "modelConfigKey": "modelConfigKey",
 "state": "state",
 "_archivedAt": 5,
 "_publishedAt": 5
}

Edit an existing variation of an AI Config. This creates a new version of the variation.
The request body must be a JSON object of the fields to update. The values you include replace the existing values for the fields.
Here’s an example:
 {
   "messages": [
     {
       "role": "system",
       "content": "The new message"
     }
   ]
 }

Path parameters
projectKeystringRequired
configKeystringRequired
variationKeystringRequired
Headers
AuthorizationstringRequired
LD-API-Version"beta"Required
Version of the endpoint.
Request
This endpoint expects an object.
commentstringOptional
Human-readable description of what this patch changes
descriptionstringOptional
Description for agent when AI Config is in agent mode.
instructionsstringOptional
Instructions for agent when AI Config is in agent mode.
messageslist of objectsOptional
Show 2 properties
modelmap from strings to anyOptional
modelConfigKeystringOptional
namestringOptional
publishedbooleanOptional
statestringOptional
One of 'archived', 'published'
Response
AI Config variation updated
keystring
_idstring
modelmap from strings to any
namestring
createdAtlong
versioninteger
_linksobject or null
Show 1 properties
colorstring or null
commentstring or null
descriptionstring or null
Returns the description for the agent. This is only returned for agent variations.
instructionsstring or null
Returns the instructions for the agent. This is only returned for agent variations.
messageslist of objects or null
Show 2 properties
modelConfigKeystring or null
statestring or null
_archivedAtlong or null
_publishedAtlong or null
Errors
400
Patch AI Config Variation Request Bad Request Error
403
Patch AI Config Variation Request Forbidden Error
404
Patch AI Config Variation Request Not Found Error
500
Patch AI Config Variation Request Internal Server Error
Applications (beta)
This feature is in beta
To use this feature, pass in a header including the LD-API-Version key with value set to beta. Use this header with each call. To learn more, read Beta resources.
Resources that are in beta are still undergoing testing and development. They may change without notice, including becoming backwards incompatible.
The applications API lets you create, update, delete, and search for applications and application versions.
Each application includes information about the app you’re creating, and a set of versions of the app that you’ve released. You can use applications to target particular application versions in your feature flags more easily, and to handle unsupported application versions more gracefully.
In addition to creating applications through the applications API, you can also create applications in the LaunchDarkly user interface. To learn more, read Applications and application versions. LaunchDarkly also creates applications and application versions automatically when a LaunchDarkly SDK evaluates a feature flag for a context that includes application information. To learn more, read Automatic environment attributes.
You can use an application in any project in your LaunchDarkly account.
Filtering applications and application versions
The filter parameter supports the following operators: equals, notEquals, anyOf, startsWith.
You can also combine filters in the following ways:
Use a comma (,) as an AND operator
Use a vertical bar (|) as an OR operator
Use parentheses (()) to group filters
Supported fields and operators
You can only filter certain fields in applications when using the filter parameter. Additionally, you can only filter some fields with certain operators.
When you search for applications, the filter parameter supports the following fields and operators:
Field
Description
Supported operators
key
The application or application version key, a unique identifier
equals, notEquals, anyOf
name
The application name or application version name
equals, notEquals, anyOf, startsWith
autoAdded
Whether the application or application version was automatically created because it was included in a context when a LaunchDarkly SDK evaluated a feature flag, or was created through the LaunchDarkly UI or REST API
equals, notEquals
kind
The application kind, one of mobile, server, browser. Only available for Get applications.
equals, notEquals, anyOf
supported
Whether a mobile application version is supported or unsupported. Only available for Get application versions by application key.
equals, notEquals

For example, the filter ?filter=kind anyOf ["mobile", "server"] matches applications whose kind is either mobile or server. The filter is not case-sensitive.
The documented values for filter query parameters are prior to URL encoding. For example, the [ in ?filter=kind anyOf ["mobile", "server"] must be encoded to %5B.
Sorting applications and application versions
LaunchDarkly supports the following fields for sorting:
name sorts by application name.
creationDate sorts by the creation date of the application.
By default, the sort is in ascending order. Use - to sort in descending order. For example, ?sort=name sorts the response by application name in ascending order, and ?sort=-name sorts in descending order.
Was this page helpful?
Yes

Delete applicationBeta
DELETE
https://app.launchdarkly.com/api/v2/applications/:applicationKey
DELETE
/api/v2/applications/:applicationKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/applications/applicationKey';
const options = {method: 'DELETE', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
No Content
{
 "key": "value"
}

Delete an application.
Path parameters
applicationKeystringRequired
The application key
Headers
AuthorizationstringRequired
Response
Action succeeded
Errors
401
Delete Application Request Unauthorized Error
403
Delete Application Request Forbidden Error
404
Delete Application Request Not Found Error
429
Delete Application Request Too Many Requests Error
Delete application versionBeta
DELETE
https://app.launchdarkly.com/api/v2/applications/:applicationKey/versions/:versionKey
DELETE
/api/v2/applications/:applicationKey/versions/:versionKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/applications/applicationKey/versions/versionKey';
const options = {method: 'DELETE', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
No Content
{
 "key": "value"
}

Delete an application version.
Path parameters
applicationKeystringRequired
The application key
versionKeystringRequired
The application version key
Headers
AuthorizationstringRequired
Response
Action succeeded
Errors
401
Delete Application Version Request Unauthorized Error
403
Delete Application Version Request Forbidden Error
404
Delete Application Version Request Not Found Error
429
Delete Application Version Request Too Many Requests Error
Get application by keyBeta
GET
https://app.launchdarkly.com/api/v2/applications/:applicationKey
GET
/api/v2/applications/:applicationKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/applications/applicationKey';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "autoAdded": true,
 "key": "com.launchdarkly.cafe",
 "kind": "browser",
 "name": "LaunchDarklyCafe",
 "flags": {
   "items": [
     {
       "name": "Example flag",
       "key": "flag-key-123abc"
     }
   ],
   "totalCount": 1,
   "_links": {
     "key": {}
   }
 },
 "_access": {
   "denied": [
     {
       "action": "action",
       "reason": {
         "effect": "allow"
       }
     }
   ],
   "allowed": [
     {
       "action": "action",
       "reason": {
         "effect": "allow"
       }
     }
   ]
 },
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "_version": 1,
 "creationDate": 1000000,
 "description": "The LaunchDarkly Cafe app",
 "_maintainer": {
   "member": {
     "_links": {
       "self": {
         "href": "/api/v2/members/569f183514f4432160000007",
         "type": "application/json"
       }
     },
     "_id": "569f183514f4432160000007",
     "role": "admin",
     "email": "ariel@acme.com",
     "firstName": "Ariel",
     "lastName": "Flores"
   },
   "team": {
     "customRoleKeys": [
       "access-to-test-projects"
     ],
     "key": "team-key-123abc",
     "name": "QA Team",
     "_links": {
       "key": {}
     }
   }
 }
}

Retrieve an application by the application key.
Expanding the application response
LaunchDarkly supports expanding the “Get application” response to include additional fields.
To expand the response, append the expand query parameter and include the following:
flags includes details on the flags that have been evaluated by the application
For example, use ?expand=flags to include the flags field in the response. By default, this field is not included in the response.
Path parameters
applicationKeystringRequired
The application key
Headers
AuthorizationstringRequired
Query parameters
expandstringOptional
A comma-separated list of properties that can reveal additional information in the response. Options: flags.
Response
Application response
autoAddedboolean
Whether the application was automatically created because it was included in a context when a LaunchDarkly SDK evaluated a feature flag, or was created through the LaunchDarkly UI or REST API.
keystring
The unique identifier of this application
kindenum
To distinguish the kind of application
Allowed values:browsermobileserver
namestring
The name of the application
flagsobject or null
Details about the flags that have been evaluated by the application
Show 3 properties
_accessobject or null
Details on the allowed and denied actions for this application
Show 2 properties
_linksmap from strings to objects or null
The location and content type of related resources
Show 2 properties
_versioninteger or null
Version of the application
creationDatelong or null
Timestamp of when the application version was created
descriptionstring or null
The application description
_maintainerobject or null
Associated maintainer member or team info for the application
Hide 2 properties
memberobject or null
Details on the member who maintains this resource
Show 6 properties
teamobject or null
Details on the team that maintains this resource
Show 4 properties
Errors
400
Get Application Request Bad Request Error
401
Get Application Request Unauthorized Error
403
Get Application Request Forbidden Error
404
Get Application Request Not Found Error
429
Get Application Request Too Many Requests Error

Get application versions by application keyBeta
GET
https://app.launchdarkly.com/api/v2/applications/:applicationKey/versions
GET
/api/v2/applications/:applicationKey/versions
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/applications/applicationKey/versions';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "items": [
   {
     "autoAdded": true,
     "key": "2",
     "name": "01.02.03",
     "_access": {
       "denied": [
         {
           "action": "action",
           "reason": {
             "effect": "allow"
           }
         }
       ],
       "allowed": [
         {
           "action": "action",
           "reason": {
             "effect": "allow"
           }
         }
       ]
     },
     "_links": {
       "key": {}
     },
     "_version": 1,
     "creationDate": 1000000,
     "supported": true
   }
 ],
 "totalCount": 1
}

Get a list of versions for a specific application in an account.
Path parameters
applicationKeystringRequired
The application key
Headers
AuthorizationstringRequired
Query parameters
filterstringOptional
Accepts filter by key, name, supported, and autoAdded. To learn more about the filter syntax, read Filtering applications and application versions.
limitlongOptional
The number of versions to return. Defaults to 50.
offsetlongOptional
Where to start in the list. Use this with pagination. For example, an offset of 10 skips the first ten items and then returns the next items in the list, up to the query limit.
sortstringOptional
Accepts sorting order and fields. Fields can be comma separated. Possible fields are creationDate, name. Examples: sort=name sort by names ascending, sort=-name,creationDate sort by names descending and creationDate ascending.
Response
Application versions response
_linksmap from strings to objects or null
The location and content type of related resources
Show 2 properties
itemslist of objects or null
A list of the versions for this application
Show 8 properties
totalCountinteger or null
The number of versions for this application
Errors
400
Get Application Versions Request Bad Request Error
401
Get Application Versions Request Unauthorized Error
403
Get Application Versions Request Forbidden Error
404
Get Application Versions Request Not Found Error
429
Get Application Versions Request Too Many Requests Error
Get applicationsBeta
GET
https://app.launchdarkly.com/api/v2/applications
GET
/api/v2/applications
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/applications';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "items": [
   {
     "autoAdded": true,
     "key": "com.launchdarkly.cafe",
     "kind": "browser",
     "name": "LaunchDarklyCafe",
     "flags": {
       "items": [
         {
           "name": "Example flag",
           "key": "flag-key-123abc"
         }
       ],
       "totalCount": 1
     },
     "_access": {
       "denied": [
         {
           "action": "action",
           "reason": {
             "effect": "allow"
           }
         }
       ],
       "allowed": [
         {
           "action": "action",
           "reason": {
             "effect": "allow"
           }
         }
       ]
     },
     "_links": {
       "key": {}
     },
     "_version": 1,
     "creationDate": 1000000,
     "description": "The LaunchDarkly Cafe app",
     "_maintainer": {
       "member": {
         "_links": {
           "self": {
             "href": "/api/v2/members/569f183514f4432160000007",
             "type": "application/json"
           }
         },
         "_id": "569f183514f4432160000007",
         "role": "admin",
         "email": "ariel@acme.com",
         "firstName": "Ariel",
         "lastName": "Flores"
       },
       "team": {
         "customRoleKeys": [
           "access-to-test-projects"
         ],
         "key": "team-key-123abc",
         "name": "QA Team"
       }
     }
   }
 ],
 "totalCount": 1
}

Get a list of applications.
Expanding the applications response
LaunchDarkly supports expanding the “Get applications” response to include additional fields.
To expand the response, append the expand query parameter and include the following:
flags includes details on the flags that have been evaluated by the application
For example, use ?expand=flags to include the flags field in the response. By default, this field is not included in the response.
Headers
AuthorizationstringRequired
Query parameters
filterstringOptional
Accepts filter by key, name, kind, and autoAdded. To learn more about the filter syntax, read Filtering applications and application versions.
limitlongOptional
The number of applications to return. Defaults to 10.
offsetlongOptional
Where to start in the list. Use this with pagination. For example, an offset of 10 skips the first ten items and then returns the next items in the list, up to the query limit.
sortstringOptional
Accepts sorting order and fields. Fields can be comma separated. Possible fields are creationDate, name. Examples: sort=name sort by names ascending, sort=-name,creationDate sort by names descending and creationDate ascending.
expandstringOptional
A comma-separated list of properties that can reveal additional information in the response. Options: flags.
Response
Applications response
_linksmap from strings to objects or null
The location and content type of related resources
Show 2 properties
itemslist of objects or null
A list of applications
Hide 11 properties
autoAddedboolean
Whether the application was automatically created because it was included in a context when a LaunchDarkly SDK evaluated a feature flag, or was created through the LaunchDarkly UI or REST API.
keystring
The unique identifier of this application
kindenum
To distinguish the kind of application
Allowed values:browsermobileserver
namestring
The name of the application
flagsobject or null
Details about the flags that have been evaluated by the application
Show 3 properties
_accessobject or null
Details on the allowed and denied actions for this application
Show 2 properties
_linksmap from strings to objects or null
The location and content type of related resources
Show 2 properties
_versioninteger or null
Version of the application
creationDatelong or null
Timestamp of when the application version was created
descriptionstring or null
The application description
_maintainerobject or null
Associated maintainer member or team info for the application
Show 2 properties
totalCountinteger or null
The number of applications
Errors
400
Get Applications Request Bad Request Error
401
Get Applications Request Unauthorized Error
403
Get Applications Request Forbidden Error
404
Get Applications Request Not Found Error
429
Get Applications Request Too Many Requests Error

Update applicationBeta
PATCH
https://app.launchdarkly.com/api/v2/applications/:applicationKey
PATCH
/api/v2/applications/:applicationKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/applications/applicationKey';
const options = {
 method: 'PATCH',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"0":{"op":"replace","path":"/description","value":"Updated description"}}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Updated
{
 "autoAdded": true,
 "key": "com.launchdarkly.cafe",
 "kind": "browser",
 "name": "LaunchDarklyCafe",
 "flags": {
   "items": [
     {
       "name": "Example flag",
       "key": "flag-key-123abc"
     }
   ],
   "totalCount": 1,
   "_links": {
     "key": {}
   }
 },
 "_access": {
   "denied": [
     {
       "action": "action",
       "reason": {
         "effect": "allow"
       }
     }
   ],
   "allowed": [
     {
       "action": "action",
       "reason": {
         "effect": "allow"
       }
     }
   ]
 },
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "_version": 1,
 "creationDate": 1000000,
 "description": "The LaunchDarkly Cafe app",
 "_maintainer": {
   "member": {
     "_links": {
       "self": {
         "href": "/api/v2/members/569f183514f4432160000007",
         "type": "application/json"
       }
     },
     "_id": "569f183514f4432160000007",
     "role": "admin",
     "email": "ariel@acme.com",
     "firstName": "Ariel",
     "lastName": "Flores"
   },
   "team": {
     "customRoleKeys": [
       "access-to-test-projects"
     ],
     "key": "team-key-123abc",
     "name": "QA Team",
     "_links": {
       "key": {}
     }
   }
 }
}

Update an application. You can update the description and kind fields. Requires a JSON patch representation of the desired changes to the application. To learn more, read Updates.
Path parameters
applicationKeystringRequired
The application key
Headers
AuthorizationstringRequired
Request
This endpoint expects a list of objects.
opstringRequired
The type of operation to perform
pathstringRequired
A JSON Pointer string specifying the part of the document to operate on
valueanyOptional
Response
Application response
autoAddedboolean
Whether the application was automatically created because it was included in a context when a LaunchDarkly SDK evaluated a feature flag, or was created through the LaunchDarkly UI or REST API.
keystring
The unique identifier of this application
kindenum
To distinguish the kind of application
Allowed values:browsermobileserver
namestring
The name of the application
flagsobject or null
Details about the flags that have been evaluated by the application
Show 3 properties
_accessobject or null
Details on the allowed and denied actions for this application
Show 2 properties
_linksmap from strings to objects or null
The location and content type of related resources
Show 2 properties
_versioninteger or null
Version of the application
creationDatelong or null
Timestamp of when the application version was created
descriptionstring or null
The application description
_maintainerobject or null
Associated maintainer member or team info for the application
Show 2 properties
Errors
400
Patch Application Request Bad Request Error
401
Patch Application Request Unauthorized Error
403
Patch Application Request Forbidden Error
404
Patch Application Request Not Found Error
429
Patch Application Request Too Many Requests Error
Was this page helpful?
Yes

Update application versionBeta
PATCH
https://app.launchdarkly.com/api/v2/applications/:applicationKey/versions/:versionKey
PATCH
/api/v2/applications/:applicationKey/versions/:versionKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/applications/applicationKey/versions/versionKey';
const options = {
 method: 'PATCH',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"0":{"op":"replace","path":"/supported","value":"false"}}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Updated
{
 "autoAdded": true,
 "key": "2",
 "name": "01.02.03",
 "_access": {
   "denied": [
     {
       "action": "action",
       "reason": {
         "effect": "allow"
       }
     }
   ],
   "allowed": [
     {
       "action": "action",
       "reason": {
         "effect": "allow"
       }
     }
   ]
 },
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "_version": 1,
 "creationDate": 1000000,
 "supported": true
}

Update an application version. You can update the supported field. Requires a JSON patch representation of the desired changes to the application version. To learn more, read Updates.
Path parameters
applicationKeystringRequired
The application key
versionKeystringRequired
The application version key
Headers
AuthorizationstringRequired
Request
This endpoint expects a list of objects.
opstringRequired
The type of operation to perform
pathstringRequired
A JSON Pointer string specifying the part of the document to operate on
valueanyOptional
Response
Application version response
autoAddedboolean
Whether the application version was automatically created, because it was included in a context when a LaunchDarkly SDK evaluated a feature flag, or if the application version was created through the LaunchDarkly UI or REST API.
keystring
The unique identifier of this application version
namestring
The name of this version
_accessobject or null
Details on the allowed and denied actions for this application version
Show 2 properties
_linksmap from strings to objects or null
The location and content type of related resources
Show 2 properties
_versioninteger or null
Version of the application version
creationDatelong or null
Timestamp of when the application version was created
supportedboolean or null
Whether this version is supported. Only applicable if the application kind is mobile.
Errors
400
Patch Application Version Request Bad Request Error
401
Patch Application Version Request Unauthorized Error
403
Patch Application Version Request Forbidden Error
404
Patch Application Version Request Not Found Error
429
Patch Application Version Request Too Many Requests Error
Audit log
LaunchDarkly maintains a record of all the changes made to any resource in the system. You can access this history using the audit log API, including filtering by timestamps, or using a custom policy to select which entries to receive.
Several of the endpoints in the audit log API require an audit log entry ID. The audit log entry ID is returned as part of the List audit log entries response. It is the _id field of each element in the items array.
In the LaunchDarkly UI, this information appears on the Change history page. To learn more, read Change history.
Get audit log entry
GET
https://app.launchdarkly.com/api/v2/auditlog/:id
GET
/api/v2/auditlog/:id
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/auditlog/id';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "_id": "1234a56b7c89d012345e678f",
 "_accountId": "1234a56b7c89d012345e678f",
 "date": 1000000,
 "accesses": [
   {
     "action": "action",
     "resource": "resource"
   }
 ],
 "kind": "kind",
 "name": "Example feature flag",
 "description": "Example, turning on the flag for testing",
 "shortDescription": "Example, turning on the flag",
 "comment": "This is an automated test",
 "subject": {
   "_links": {
     "key": {}
   },
   "name": "name",
   "avatarUrl": "avatarUrl"
 },
 "member": {
   "_links": {
     "key": {}
   },
   "_id": "507f1f77bcf86cd799439011",
   "email": "ariel@acme.com",
   "firstName": "Ariel",
   "lastName": "Flores"
 },
 "token": {
   "_links": {
     "key": {}
   },
   "_id": "_id",
   "name": "DevOps token",
   "ending": "2345",
   "serviceToken": false
 },
 "app": {
   "_links": {
     "key": {}
   },
   "_id": "_id",
   "isScim": true,
   "name": "name",
   "maintainerName": "maintainerName"
 },
 "titleVerb": "turned on the flag",
 "title": "title",
 "target": {
   "_links": {
     "key": {}
   },
   "name": "Example flag name",
   "resources": [
     "proj/example-project:env/production:flag/example-flag"
   ]
 },
 "parent": {
   "_links": {
     "key": {}
   },
   "name": "name",
   "resource": "resource"
 },
 "delta": {
   "key": "value"
 },
 "triggerBody": {
   "key": "value"
 },
 "merge": {
   "key": "value"
 },
 "previousVersion": {
   "key": "value"
 },
 "currentVersion": {
   "key": "value"
 },
 "subentries": [
   {
     "_links": {
       "key": {}
     },
     "_id": "1234a56b7c89d012345e678f",
     "_accountId": "1234a56b7c89d012345e678f",
     "date": 1000000,
     "accesses": [
       {}
     ],
     "kind": "kind",
     "name": "Example feature flag",
     "description": "Example, turning on the flag for testing",
     "shortDescription": "Example, turning on the flag",
     "comment": "This is an automated test",
     "member": {
       "_id": "507f1f77bcf86cd799439011",
       "email": "ariel@acme.com",
       "firstName": "Ariel",
       "lastName": "Flores"
     },
     "token": {
       "name": "DevOps token",
       "ending": "2345",
       "serviceToken": false
     },
     "titleVerb": "turned on the flag",
     "title": "title",
     "target": {
       "name": "Example flag name"
     }
   }
 ]
}

Fetch a detailed audit log entry representation. The detailed representation includes several fields that are not present in the summary representation, including:
delta: the JSON patch body that was used in the request to update the entity
previousVersion: a JSON representation of the previous version of the entity
currentVersion: a JSON representation of the current version of the entity
Path parameters
idstringRequired
The ID of the audit log entry
Headers
AuthorizationstringRequired
Response
Audit log entry response
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring
The ID of the audit log entry
_accountIdstring
The ID of the account to which this audit log entry belongs
datelong
Timestamp of the audit log entry
accesseslist of objects
Details on the actions performed and resources acted on in this audit log entry
Hide 2 properties
actionstring or null
resourcestring or null
kindstring
The type of resource this audit log entry refers to
namestring
The name of the resource this audit log entry refers to
descriptionstring
Description of the change recorded in the audit log entry
shortDescriptionstring
Shorter version of the change recorded in the audit log entry
commentstring or null
Optional comment for the audit log entry
subjectobject or null
Details of the subject who initiated the action described in the audit log entry
Hide 3 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
namestring or null
The subject's name
avatarUrlstring or null
The subject's avatar
memberobject or null
Details of the member who initiated the action described in the audit log entry
Hide 5 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring or null
The member ID
emailstring or null
The member email
firstNamestring or null
The member first name
lastNamestring or null
The member last name
tokenobject or null
Details of the access token that initiated the action described in the audit log entry
Hide 5 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring or null
namestring or null
The name of the token
endingstring or null
The last few characters of the token
serviceTokenboolean or null
Whether this is a service token
appobject or null
Details of the authorized application that initiated the action described in the audit log entry
Hide 5 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring or null
The ID of the authorized application
isScimboolean or null
Whether the application is authorized through SCIM
namestring or null
The authorized application name
maintainerNamestring or null
The name of the maintainer for this authorized application
titleVerbstring or null
The action and resource recorded in this audit log entry
titlestring or null
A description of what occurred, in the format member titleVerb target
targetobject or null
Details of the resource acted upon in this audit log entry
Hide 3 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
namestring or null
The name of the resource
resourceslist of strings or null
The resource specifier
parentobject or null
Hide 3 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
namestring or null
The name of the parent resource
resourcestring or null
The parent's resource specifier
deltaany or null
triggerBodyany or null
mergeany or null
previousVersionany or null
currentVersionany or null
subentrieslist of objects or null
Hide 18 properties
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring
The ID of the audit log entry
_accountIdstring
The ID of the account to which this audit log entry belongs
datelong
Timestamp of the audit log entry
accesseslist of objects
Details on the actions performed and resources acted on in this audit log entry
Hide 2 properties
actionstring or null
resourcestring or null
kindstring
The type of resource this audit log entry refers to
namestring
The name of the resource this audit log entry refers to
descriptionstring
Description of the change recorded in the audit log entry
shortDescriptionstring
Shorter version of the change recorded in the audit log entry
commentstring or null
Optional comment for the audit log entry
subjectobject or null
Details of the subject who initiated the action described in the audit log entry
Hide 3 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
namestring or null
The subject's name
avatarUrlstring or null
The subject's avatar
memberobject or null
Details of the member who initiated the action described in the audit log entry
Hide 5 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring or null
The member ID
emailstring or null
The member email
firstNamestring or null
The member first name
lastNamestring or null
The member last name
tokenobject or null
Details of the access token that initiated the action described in the audit log entry
Hide 5 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring or null
namestring or null
The name of the token
endingstring or null
The last few characters of the token
serviceTokenboolean or null
Whether this is a service token
appobject or null
Details of the authorized application that initiated the action described in the audit log entry
Hide 5 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring or null
The ID of the authorized application
isScimboolean or null
Whether the application is authorized through SCIM
namestring or null
The authorized application name
maintainerNamestring or null
The name of the maintainer for this authorized application
titleVerbstring or null
The action and resource recorded in this audit log entry
titlestring or null
A description of what occurred, in the format member titleVerb target
targetobject or null
Details of the resource acted upon in this audit log entry
Hide 3 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
namestring or null
The name of the resource
resourceslist of strings or null
The resource specifier
parentobject or null
Hide 3 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
namestring or null
The name of the parent resource
resourcestring or null
The parent's resource specifier
Errors
401
Get Audit Log Entry Request Unauthorized Error
403
Get Audit Log Entry Request Forbidden Error
404
Get Audit Log Entry Request Not Found Error
429
Get Audit Log Entry Request Too Many Requests Error
Was this page helpful?
Yes

List audit log entries
GET
https://app.launchdarkly.com/api/v2/auditlog
GET
/api/v2/auditlog
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/auditlog';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "items": [
   {
     "_links": {
       "key": {}
     },
     "_id": "1234a56b7c89d012345e678f",
     "_accountId": "1234a56b7c89d012345e678f",
     "date": 1000000,
     "accesses": [
       {}
     ],
     "kind": "kind",
     "name": "Example feature flag",
     "description": "Example, turning on the flag for testing",
     "shortDescription": "Example, turning on the flag",
     "comment": "This is an automated test",
     "member": {
       "_id": "507f1f77bcf86cd799439011",
       "email": "ariel@acme.com",
       "firstName": "Ariel",
       "lastName": "Flores"
     },
     "token": {
       "name": "DevOps token",
       "ending": "2345",
       "serviceToken": false
     },
     "titleVerb": "turned on the flag",
     "title": "title",
     "target": {
       "name": "Example flag name"
     }
   }
 ],
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 }
}

Get a list of all audit log entries. The query parameters let you restrict the results that return by date ranges, resource specifiers, or a full-text search query.
LaunchDarkly uses a resource specifier syntax to name resources or collections of resources. To learn more, read About the resource specifier syntax.
Headers
AuthorizationstringRequired
Query parameters
beforelongOptional
A timestamp filter, expressed as a Unix epoch time in milliseconds. All entries this returns occurred before the timestamp.
afterlongOptional
A timestamp filter, expressed as a Unix epoch time in milliseconds. All entries this returns occurred after the timestamp.
qstringOptional
Text to search for. You can search for the full or partial name of the resource.
limitlongOptional
A limit on the number of audit log entries that return. Set between 1 and 20. The default is 10.
specstringOptional
A resource specifier that lets you filter audit log listings by resource
Response
Audit log entries response
itemslist of objects
An array of audit log entries
Hide 18 properties
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring
The ID of the audit log entry
_accountIdstring
The ID of the account to which this audit log entry belongs
datelong
Timestamp of the audit log entry
accesseslist of objects
Details on the actions performed and resources acted on in this audit log entry
Hide 2 properties
actionstring or null
resourcestring or null
kindstring
The type of resource this audit log entry refers to
namestring
The name of the resource this audit log entry refers to
descriptionstring
Description of the change recorded in the audit log entry
shortDescriptionstring
Shorter version of the change recorded in the audit log entry
commentstring or null
Optional comment for the audit log entry
subjectobject or null
Details of the subject who initiated the action described in the audit log entry
Hide 3 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
namestring or null
The subject's name
avatarUrlstring or null
The subject's avatar
memberobject or null
Details of the member who initiated the action described in the audit log entry
Hide 5 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring or null
The member ID
emailstring or null
The member email
firstNamestring or null
The member first name
lastNamestring or null
The member last name
tokenobject or null
Details of the access token that initiated the action described in the audit log entry
Hide 5 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring or null
namestring or null
The name of the token
endingstring or null
The last few characters of the token
serviceTokenboolean or null
Whether this is a service token
appobject or null
Details of the authorized application that initiated the action described in the audit log entry
Hide 5 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring or null
The ID of the authorized application
isScimboolean or null
Whether the application is authorized through SCIM
namestring or null
The authorized application name
maintainerNamestring or null
The name of the maintainer for this authorized application
titleVerbstring or null
The action and resource recorded in this audit log entry
titlestring or null
A description of what occurred, in the format member titleVerb target
targetobject or null
Details of the resource acted upon in this audit log entry
Hide 3 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
namestring or null
The name of the resource
resourceslist of strings or null
The resource specifier
parentobject or null
Hide 3 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
namestring or null
The name of the parent resource
resourcestring or null
The parent's resource specifier
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
Errors
400
Get Audit Log Entries Request Bad Request Error
401
Get Audit Log Entries Request Unauthorized Error
403
Get Audit Log Entries Request Forbidden Error
429
Get Audit Log Entries Request Too Many Requests Error
Was this page helpful?
Yes

Search audit log entries
POST
https://app.launchdarkly.com/api/v2/auditlog
POST
/api/v2/auditlog
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/auditlog';
const options = {
 method: 'POST',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"0":{"effect":"allow"}}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Successful
{
 "items": [
   {
     "_links": {
       "key": {}
     },
     "_id": "1234a56b7c89d012345e678f",
     "_accountId": "1234a56b7c89d012345e678f",
     "date": 1000000,
     "accesses": [
       {}
     ],
     "kind": "kind",
     "name": "Example feature flag",
     "description": "Example, turning on the flag for testing",
     "shortDescription": "Example, turning on the flag",
     "comment": "This is an automated test",
     "member": {
       "_id": "507f1f77bcf86cd799439011",
       "email": "ariel@acme.com",
       "firstName": "Ariel",
       "lastName": "Flores"
     },
     "token": {
       "name": "DevOps token",
       "ending": "2345",
       "serviceToken": false
     },
     "titleVerb": "turned on the flag",
     "title": "title",
     "target": {
       "name": "Example flag name"
     }
   }
 ],
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 }
}

Search your audit log entries. The query parameters let you restrict the results that return by date ranges, or a full-text search query. The request body lets you restrict the results that return by resource specifiers.
LaunchDarkly uses a resource specifier syntax to name resources or collections of resources. To learn more, read About the resource specifier syntax.
Headers
AuthorizationstringRequired
Query parameters
beforelongOptional
A timestamp filter, expressed as a Unix epoch time in milliseconds. All entries returned occurred before the timestamp.
afterlongOptional
A timestamp filter, expressed as a Unix epoch time in milliseconds. All entries returned occurred after the timestamp.
qstringOptional
Text to search for. You can search for the full or partial name of the resource.
limitlongOptional
A limit on the number of audit log entries that return. Set between 1 and 20. The default is 10.
Request
This endpoint expects a list of objects.
effectenumRequired
Whether this statement should allow or deny actions on the resources.
Allowed values:allowdeny
resourceslist of stringsOptional
Resource specifier strings
notResourceslist of stringsOptional
Targeted resources are the resources NOT in this list. The resources field must be empty to use this field.
actionslist of stringsOptional
Actions to perform on a resource
notActionslist of stringsOptional
Targeted actions are the actions NOT in this list. The actions field must be empty to use this field.
Response
Audit log entries response
itemslist of objects
An array of audit log entries
Hide 18 properties
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring
The ID of the audit log entry
_accountIdstring
The ID of the account to which this audit log entry belongs
datelong
Timestamp of the audit log entry
accesseslist of objects
Details on the actions performed and resources acted on in this audit log entry
Hide 2 properties
actionstring or null
resourcestring or null
kindstring
The type of resource this audit log entry refers to
namestring
The name of the resource this audit log entry refers to
descriptionstring
Description of the change recorded in the audit log entry
shortDescriptionstring
Shorter version of the change recorded in the audit log entry
commentstring or null
Optional comment for the audit log entry
subjectobject or null
Details of the subject who initiated the action described in the audit log entry
Hide 3 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
namestring or null
The subject's name
avatarUrlstring or null
The subject's avatar
memberobject or null
Details of the member who initiated the action described in the audit log entry
Hide 5 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring or null
The member ID
emailstring or null
The member email
firstNamestring or null
The member first name
lastNamestring or null
The member last name
tokenobject or null
Details of the access token that initiated the action described in the audit log entry
Hide 5 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring or null
namestring or null
The name of the token
endingstring or null
The last few characters of the token
serviceTokenboolean or null
Whether this is a service token
appobject or null
Details of the authorized application that initiated the action described in the audit log entry
Hide 5 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring or null
The ID of the authorized application
isScimboolean or null
Whether the application is authorized through SCIM
namestring or null
The authorized application name
maintainerNamestring or null
The name of the maintainer for this authorized application
titleVerbstring or null
The action and resource recorded in this audit log entry
titlestring or null
A description of what occurred, in the format member titleVerb target
targetobject or null
Details of the resource acted upon in this audit log entry
Hide 3 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
namestring or null
The name of the resource
resourceslist of strings or null
The resource specifier
parentobject or null
Hide 3 properties
_linksmap from strings to objects or null
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
namestring or null
The name of the parent resource
resourcestring or null
The parent's resource specifier
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
Errors
400
Post Audit Log Entries Request Bad Request Error
401
Post Audit Log Entries Request Unauthorized Error
403
Post Audit Log Entries Request Forbidden Error
429
Post Audit Log Entries Request Too Many Requests Error
Contexts
Contexts are people, services, machines, or other resources that encounter feature flags in your product. Contexts are identified by their kind, which describes the type of resources encountering flags, and by their key. Each unique combination of one or more contexts that have encountered a feature flag in your product is called a context instance.
When you use the LaunchDarkly SDK to evaluate a flag, you provide a context to that call. LaunchDarkly records the key and attributes of each context instance. You can view these in the LaunchDarkly user interface from the Contexts list, or use the Context APIs. To learn more, read Contexts.
LaunchDarkly provides APIs for you to:
retrieve contexts, context instances, and context attribute names and values
search for contexts or context instances
delete context instances
fetch context kinds
create and update context kinds
To learn more about context kinds, read Context kinds.
Contexts are always scoped within a project and an environment. Each environment has its own set of context instance records.
Several of the endpoints in the contexts API require a context instance ID or application ID. Both of these IDs are returned as part of the Search for context instances response. The context instance ID is the id field of each element in the items array. The application ID is the applicationId field of each element in the items array. By default, the application ID is set to the SDK you are using. In the LaunchDarkly UI, the application ID and application version appear on the context details page in the “From source” field. You can change the application ID as part of your SDK configuration. To learn more, read Application metadata configuration.
Filtering contexts and context instances
When you search for contexts or context instances, you can filter on certain fields using the filter parameter either as a query parameter or as a request body parameter.
The filter parameter supports the following operators: after, anyOf, before, contains, equals, exists, notEquals, startsWith.
Expand for details on operators and syntax












































You can also combine filters in the following ways:
Use a comma (,) as an AND operator
Use a vertical bar (|) as an OR operator
Use parentheses () to group filters
For example:
myField notEquals 0, myField notEquals 1 returns contexts or context instances where myField is not 0 and is not 1
myFirstField equals "device",(mySecondField equals "iPhone"|mySecondField equals "iPad") returns contexts or context instances where myFirstField is equal to “device” and mySecondField is equal to either “iPhone” or “iPad”
Supported fields and operators
You can only filter certain fields in contexts and context instances when using the filter parameter. Additionally, you can only filter some fields with certain operators.
When you search for contexts, the filter parameter supports the following fields and operators:
Field
Description
Supported operators
applicationId
An identifier representing the application where the LaunchDarkly SDK is running.
equals, notEquals, anyOf
id
Unique identifier for the context.
equals, notEquals, anyOf
key
The context key.
equals, notEquals, anyOf, startsWith
kind
The context kind.
equals, notEquals, anyOf
kinds
A list of all kinds found in the context. Supply a list of strings to the operator.
equals, anyOf, contains
kindKey
The kind and key for the context. They are joined with :, for example, user:user-key-abc123.
equals, notEquals, anyOf
kindKeys
A list of all kinds and keys found in the context. The kind and key are joined with :, for example, user:user-key-abc123. Supply a list of strings to the operator.
equals, anyOf, contains
q
A “fuzzy” search across context attribute values and the context key. Supply a string or list of strings to the operator.
equals
name
The name for the context.
equals, notEquals, exists, anyOf, startsWith
<a kind>.<an attribute name>
A kind and the name of any attribute that appears in a context of that kind, for example, user.email. To filter all kinds, use * in place of the kind, for example, *.email. You can use either a literal attribute name or a JSON path to specify the attribute. If you use a JSON path, then you must escape the / character, using ~1, and the ~ character, using ~0. For example, use user.job/title or user./job~1title to filter the /job/title field in a user context kind. If the field or value includes whitespace, it should be enclosed in double quotes.
equals, notEquals, exists, startsWith, before, after.

When searching for context instances, the filter parameter supports the following fields and operators
Field
Description
Supported operators
applicationId
An identifier representing the application where the LaunchDarkly SDK is running.
equals, notEquals, anyOf
id
Unique identifier for the context instance.
equals, notEquals, anyOf
kinds
A list of all kinds found in the context instance. Supply a list of strings to the operator.
equals, anyOf, contains
kindKeys
A list of all kinds and keys found in the context instance. The kind and key are joined with :, for example, user:user-key-abc123. Supply a list of strings to the operator.
equals, anyOf, contains


Create or update context kind
PUT
https://app.launchdarkly.com/api/v2/projects/:projectKey/context-kinds/:key
PUT
/api/v2/projects/:projectKey/context-kinds/:key
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/context-kinds/key';
const options = {
 method: 'PUT',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"name":"organization"}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Updated
{
 "status": "success",
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 }
}

Create or update a context kind by key. Only the included fields will be updated.
Path parameters
projectKeystringRequired
The project key
keystringRequired
The context kind key
Headers
AuthorizationstringRequired
Request
This endpoint expects an object.
namestringRequired
The context kind name
descriptionstringOptional
The context kind description
hideInTargetingbooleanOptional
Alias for archived.
archivedbooleanOptional
Whether the context kind is archived. Archived context kinds are unavailable for targeting.
versionintegerOptional
The context kind version. If not specified when the context kind is created, defaults to 1.
Response
Context kind upsert response
statusstring or null
The status of the create or update operation
_linksmap from strings to objects or null
The location and content type of related resources
Show 2 properties
Errors
400
Put Context Kind Request Bad Request Error
401
Put Context Kind Request Unauthorized Error
403
Put Context Kind Request Forbidden Error
404
Put Context Kind Request Not Found Error
Delete context instances
DELETE
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey/context-instances/:id
DELETE
/api/v2/projects/:projectKey/environments/:environmentKey/context-instances/:id
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey/context-instances/id';
const options = {method: 'DELETE', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
No Content
{
 "key": "value"
}

Delete context instances by ID.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
idstringRequired
The context instance ID
Headers
AuthorizationstringRequired
Response
Action succeeded
Errors
400
Delete Context Instances Request Bad Request Error
401
Delete Context Instances Request Unauthorized Error
403
Delete Context Instances Request Forbidden Error
404
Delete Context Instances Request Not Found Error
429
Delete Context Instances Request Too Many Requests Error
Evaluate flags for context instance
POST
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey/flags/evaluate
POST
/api/v2/projects/:projectKey/environments/:environmentKey/flags/evaluate
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey/flags/evaluate';
const options = {
 method: 'POST',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"key":"user-key-123abc","kind":"user","otherAttribute":"other attribute value"}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Successful
{
 "items": [
   {
     "name": "SortOrder",
     "key": "sort.order",
     "_value": true,
     "_links": {
       "self": {
         "href": "/api/v2/projects/{projectKey}/environments/{environmentKey}/flags/evaluate",
         "type": "application/json"
       },
       "site": {
         "href": "/my-project/my-environment/features/sort.order/targeting",
         "type": "text/html"
       }
     },
     "reason": {
       "kind": "FALLTHROUGH",
       "ruleIndex": 3,
       "ruleID": "1234567890",
       "prerequisiteKey": "someotherflagkey",
       "inExperiment": true,
       "errorKind": "tried to use uninitialized Context"
     }
   },
   {
     "name": "AlternatePage",
     "key": "alternate.page",
     "_value": false,
     "_links": {
       "self": {
         "href": "/api/v2/projects/{projectKey}/environments/{environmentKey}/flags/evaluate",
         "type": "application/json"
       },
       "site": {
         "href": "/my-project/my-environment/features/alternate.page/targeting",
         "type": "text/html"
       }
     },
     "reason": {
       "kind": "RULE_MATCH",
       "ruleIndex": 1,
       "ruleID": "b2530cdf-14c6-4e16-b660-00239e08f19b",
       "prerequisiteKey": "someotherflagkey",
       "inExperiment": true,
       "errorKind": "tried to use uninitialized Context"
     }
   }
 ],
 "_links": {
   "self": {
     "href": "/api/v2/projects/{projectKey}/environments/{environmentKey}/flags/evaluate",
     "type": "application/json"
   }
 },
 "totalCount": 2
}

Evaluate flags for a context instance, for example, to determine the expected flag variation. Do not use this API instead of an SDK. The LaunchDarkly SDKs are specialized for the tasks of evaluating feature flags in your application at scale and generating analytics events based on those evaluations. This API is not designed for that use case. Any evaluations you perform with this API will not be reflected in features such as flag statuses and flag insights. Context instances evaluated by this API will not appear in the Contexts list. To learn more, read Comparing LaunchDarkly’s SDKs and REST API.
Filtering
LaunchDarkly supports the filter query param for filtering, with the following fields:
query filters for a string that matches against the flags’ keys and names. It is not case sensitive. For example: filter=query equals dark-mode.
tags filters the list to flags that have all of the tags in the list. For example: filter=tags contains ["beta","q1"].
You can also apply multiple filters at once. For example, setting filter=query equals dark-mode, tags contains ["beta","q1"] matches flags which match the key or name dark-mode and are tagged beta and q1.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
Headers
AuthorizationstringRequired
Query parameters
limitlongOptional
The number of feature flags to return. Defaults to -1, which returns all flags
offsetlongOptional
Where to start in the list. Use this with pagination. For example, an offset of 10 skips the first ten items and then returns the next items in the list, up to the query limit.
sortstringOptional
A comma-separated list of fields to sort by. Fields prefixed by a dash ( - ) sort in descending order
filterstringOptional
A comma-separated list of filters. Each filter is of the form field operator value. Supported fields are explained above.
Request
This endpoint expects a map from strings to any.
Response
Flag evaluation collection response
itemslist of objects
Details on the flag evaluations for this context instance
Hide 5 properties
namestring
Name of the flag.
keystring
Key of the flag.
_valueany
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
reasonobject or null
Contains information about why that variation was selected.
Hide 6 properties
kindstring
Describes the general reason that LaunchDarkly selected this variation.
ruleIndexinteger or null
The positional index of the matching rule if the kind is ‘RULE_MATCH’. The index is 0-based.
ruleIDstring or null
The unique identifier of the matching rule if the kind is ‘RULE_MATCH’.
prerequisiteKeystring or null
The key of the flag that failed if the kind is ‘PREREQUISITE_FAILED’.
inExperimentboolean or null
Indicates whether the context was evaluated as part of an experiment.
errorKindstring or null
The specific error type if the kind is 'ERROR'.
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
totalCountinteger or null
The number of flags
Errors
400
Evaluate Context Instance Request Bad Request Error
401
Evaluate Context Instance Request Unauthorized Error
403
Evaluate Context Instance Request Forbidden Error
404
Evaluate Context Instance Request Not Found Error
429
Evaluate Context Instance Request Too Many Requests Error
Get context attribute names
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey/context-attributes
GET
/api/v2/projects/:projectKey/environments/:environmentKey/context-attributes
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey/context-attributes';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "items": [
   {
     "kind": "user",
     "names": [
       {
         "name": "/firstName",
         "weight": 2225,
         "redacted": false
       }
     ]
   }
 ]
}

Get context attribute names.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
Headers
AuthorizationstringRequired
Query parameters
filterstringOptional
A comma-separated list of context filters. This endpoint only accepts kind filters, with the equals operator, and name filters, with the startsWith operator. To learn more about the filter syntax, read Filtering contexts and context instances.
limitlongOptional
Specifies the maximum number of items in the collection to return (max: 100, default: 100)
Response
Context attribute names collection response
itemslist of objects
A collection of context attribute name data grouped by kind.
Hide 2 properties
kindstring
The kind associated with this collection of context attribute names.
nameslist of objects
A collection of context attribute names.
Hide 3 properties
namestring
A context attribute's name.
weightinteger
A relative estimate of the number of contexts seen recently that have an attribute with the associated name.
redactedboolean or null
Whether or not the attribute has one or more redacted values.
Errors
400
Get Context Attribute Names Request Bad Request Error
401
Get Context Attribute Names Request Unauthorized Error
403
Get Context Attribute Names Request Forbidden Error
429
Get Context Attribute Names Request Too Many Requests Error
Get context attribute values
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey/context-attributes/:attributeName
GET
/api/v2/projects/:projectKey/environments/:environmentKey/context-attributes/:attributeName
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey/context-attributes/attributeName';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "items": [
   {
     "kind": "user",
     "values": []
   }
 ]
}

Get context attribute values.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
attributeNamestringRequired
The attribute name
Headers
AuthorizationstringRequired
Query parameters
filterstringOptional
A comma-separated list of context filters. This endpoint only accepts kind filters, with the equals operator, and value filters, with the startsWith operator. To learn more about the filter syntax, read Filtering contexts and context instances.
limitlongOptional
Specifies the maximum number of items in the collection to return (max: 100, default: 50)
Response
Context attribute values collection response
itemslist of objects
A collection of context attribute value data grouped by kind.
Hide 2 properties
kindstring
The kind associated with this collection of context attribute values.
valueslist of objects
A collection of context attribute values.
Hide 2 properties
nameany
weightinteger
A relative estimate of the number of contexts seen recently that have a matching value for a given attribute.
Errors
400
Get Context Attribute Values Request Bad Request Error
401
Get Context Attribute Values Request Unauthorized Error
403
Get Context Attribute Values Request Forbidden Error
429
Get Context Attribute Values Request Too Many Requests Error
Get context instances
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey/context-instances/:id
GET
/api/v2/projects/:projectKey/environments/:environmentKey/context-instances/:id
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey/context-instances/id';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_environmentId": "57be1db38b75bf0772d11384",
 "items": [
   {
     "id": "b3JnOmxhdW5jaGRhcmtseQ",
     "context": {
       "key": "value"
     },
     "lastSeen": "2022-04-15T15:00:57Z",
     "applicationId": "GoSDK/1.2",
     "anonymousKinds": [
       "device",
       "privateKind"
     ],
     "_links": {
       "parent": {
         "href": "/api/v2/projects/my-project/environments/my-environment",
         "type": "application/json"
       },
       "self": {
         "href": "/api/v2/projects/my-project/environments/my-env/context-instances/organization:launch-darkly:user:henry?filter=applicationId:\"GoSDK/1.2\"",
         "type": "application/json"
       },
       "site": {
         "href": "/my-project/my-environment/context-instances/organization:launch-darkly:user:henry",
         "type": "text/html"
       }
     },
     "_access": {
       "denied": [
         {
           "action": "action",
           "reason": {
             "effect": "allow"
           }
         }
       ],
       "allowed": [
         {
           "action": "action",
           "reason": {
             "effect": "allow"
           }
         }
       ]
     }
   }
 ],
 "_links": {
   "next": {
     "href": "/api/v2/projects/my-project/environments/my-env/context-instances/organization:launch-darkly:user:henry?limit=2&continuationToken=2022-04-15T15:00:57.526470334Z",
     "type": "application/json"
   },
   "self": {
     "href": "/api/v2/projects/my-proj/environments/my-env/context-instances/organization:launch-darkly:user:henry-jacobs?limit=2",
     "type": "application/json"
   }
 },
 "totalCount": 100,
 "continuationToken": "QAGFKH1313KUGI2351"
}

Get context instances by ID.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
idstringRequired
The context instance ID
Headers
AuthorizationstringRequired
Query parameters
limitlongOptional
Specifies the maximum number of context instances to return (max: 50, default: 20)
continuationTokenstringOptional
Limits results to context instances with sort values after the value specified. You can use this for pagination, however, we recommend using the next link we provide instead.
sortstringOptional
Specifies a field by which to sort. LaunchDarkly supports sorting by timestamp in ascending order by specifying ts for this value, or descending order by specifying -ts.
filterstringOptional
A comma-separated list of context filters. This endpoint only accepts an applicationId filter. To learn more about the filter syntax, read Filtering contexts and context instances.
includeTotalCountbooleanOptional
Specifies whether to include or omit the total count of matching context instances. Defaults to true.
Response
Context instances collection response
_environmentIdstring
The environment ID
itemslist of objects
A collection of context instances. Can include multiple versions of context instances that have the same id, but different applicationIds.
Hide 7 properties
idstring
The context instance ID
contextany
lastSeendatetime or null
Timestamp of the last time an evaluation occurred for this context instance
applicationIdstring or null
An identifier representing the application where the LaunchDarkly SDK is running
anonymousKindslist of strings or null
A list of the context kinds this context was associated with that the SDK removed because they were marked as anonymous at flag evaluation
_linksmap from strings to objects or null
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_accessobject or null
Details on the allowed and denied actions for this context instance
Show 2 properties
_linksmap from strings to objects or null
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
totalCountinteger or null
The number of unique context instances
continuationTokenstring or null
An obfuscated string that references the last context instance on the previous page of results. You can use this for pagination, however, we recommend using the next link instead.
Errors
400
Get Context Instances Request Bad Request Error
401
Get Context Instances Request Unauthorized Error
403
Get Context Instances Request Forbidden Error
429
Get Context Instances Request Too Many Requests Error
Get context kinds
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/context-kinds
GET
/api/v2/projects/:projectKey/context-kinds
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/context-kinds';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "items": [
   {
     "key": "organization-key-123abc",
     "name": "Organization",
     "description": "An example context kind, to enable targeting based on organization",
     "version": 4,
     "creationDate": 1000000,
     "lastModified": 1000000,
     "createdFrom": "createdFrom",
     "lastSeen": 1000000,
     "hideInTargeting": false,
     "archived": false,
     "_links": {
       "key": {}
     }
   }
 ],
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 }
}

Get all context kinds for a given project.
Path parameters
projectKeystringRequired
The project key
Headers
AuthorizationstringRequired
Response
Context kinds collection response
itemslist of objects
An array of context kinds
Hide 11 properties
keystring
The context kind key
namestring
The context kind name
descriptionstring
The context kind description
versioninteger
The context kind version
creationDatelong
Timestamp of when the context kind was created
lastModifiedlong
Timestamp of when the context kind was most recently changed
createdFromstring
How the context kind was created
lastSeenlong or null
Timestamp of when a context of this context kind was most recently evaluated
hideInTargetingboolean or null
Alias for archived.
archivedboolean or null
Whether the context kind is archived. Archived context kinds are unavailable for targeting.
_linksmap from strings to objects or null
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
Errors
401
Get Context Kinds by Project Key Request Unauthorized Error
403
Get Context Kinds by Project Key Request Forbidden Error
404
Get Context Kinds by Project Key Request Not Found Error
OverviewContexts
Get contexts
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey/contexts/:kind/:key
GET
/api/v2/projects/:projectKey/environments/:environmentKey/contexts/:kind/:key
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey/contexts/kind/key';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_environmentId": "57be1db38b75bf0772d11384",
 "items": [
   {
     "context": {
       "key": "value"
     },
     "lastSeen": "2022-04-15T15:00:57Z",
     "applicationId": "GoSDK/1.2",
     "_links": {
       "parent": {
         "href": "/api/v2/projects/my-project/environments/my-environment",
         "type": "application/json"
       },
       "self": {
         "href": "/api/v2/projects/my-project/environments/my-env/contexts/organization:launch-darkly:user:henry?filter=applicationId:\"GoSDK/1.2\"",
         "type": "application/json"
       },
       "site": {
         "href": "/my-project/my-environment/context/organization:launch-darkly:user:henry",
         "type": "text/html"
       }
     },
     "_access": {
       "denied": [
         {
           "action": "action",
           "reason": {
             "effect": "allow"
           }
         }
       ],
       "allowed": [
         {
           "action": "action",
           "reason": {
             "effect": "allow"
           }
         }
       ]
     },
     "associatedContexts": 0
   }
 ],
 "_links": {
   "next": {
     "href": "/app.launchdarkly.com/api/v2/projects/my-project/environments/my-environment/contexts?filter=kind:{\"equals\": [\"organization\"]}&limit=2&continuationToken=QAGFKH1313KUGI2351",
     "type": "application/json"
   },
   "self": {
     "href": "/api/v2/projects/my-proj/environments/my-env/contexts?filter=kind:{\"equals\": [\"organization\"]}&limit=2&continuationToken=QAGFKH1313KUGI2351",
     "type": "application/json"
   }
 },
 "totalCount": 100,
 "continuationToken": "QAGFKH1313KUGI2351"
}

Get contexts based on kind and key.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
kindstringRequired
The context kind
keystringRequired
The context key
Headers
AuthorizationstringRequired
Query parameters
limitlongOptional
Specifies the maximum number of items in the collection to return (max: 50, default: 20)
continuationTokenstringOptional
Limits results to contexts with sort values after the value specified. You can use this for pagination, however, we recommend using the next link we provide instead.
sortstringOptional
Specifies a field by which to sort. LaunchDarkly supports sorting by timestamp in ascending order by specifying ts for this value, or descending order by specifying -ts.
filterstringOptional
A comma-separated list of context filters. This endpoint only accepts an applicationId filter. To learn more about the filter syntax, read Filtering contexts and context instances.
includeTotalCountbooleanOptional
Specifies whether to include or omit the total count of matching contexts. Defaults to true.
Response
Contexts collection response
_environmentIdstring
The environment ID where the context was evaluated
itemslist of objects
A collection of contexts. Can include multiple versions of contexts that have the same kind and key, but different applicationIds.
Show 6 properties
_linksmap from strings to objects or null
The location and content type of related resources
Show 2 properties
totalCountinteger or null
The number of contexts
continuationTokenstring or null
An obfuscated string that references the last context instance on the previous page of results. You can use this for pagination, however, we recommend using the next link instead.
Errors
400
Get Contexts Request Bad Request Error
401
Get Contexts Request Unauthorized Error
403
Get Contexts Request Forbidden Error
429
Get Contexts Request Too Many Requests Error
Search for context instances
POST
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey/context-instances/search
POST
/api/v2/projects/:projectKey/environments/:environmentKey/context-instances/search
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey/context-instances/search';
const options = {
 method: 'POST',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Successful
{
 "_environmentId": "57be1db38b75bf0772d11384",
 "items": [
   {
     "id": "b3JnOmxhdW5jaGRhcmtseQ",
     "context": {
       "key": "value"
     },
     "lastSeen": "2022-04-15T15:00:57Z",
     "applicationId": "GoSDK/1.2",
     "anonymousKinds": [
       "device",
       "privateKind"
     ],
     "_links": {
       "parent": {
         "href": "/api/v2/projects/my-project/environments/my-environment",
         "type": "application/json"
       },
       "self": {
         "href": "/api/v2/projects/my-project/environments/my-env/context-instances/organization:launch-darkly:user:henry?filter=applicationId:\"GoSDK/1.2\"",
         "type": "application/json"
       },
       "site": {
         "href": "/my-project/my-environment/context-instances/organization:launch-darkly:user:henry",
         "type": "text/html"
       }
     },
     "_access": {
       "denied": [
         {
           "action": "action",
           "reason": {
             "effect": "allow"
           }
         }
       ],
       "allowed": [
         {
           "action": "action",
           "reason": {
             "effect": "allow"
           }
         }
       ]
     }
   }
 ],
 "_links": {
   "next": {
     "href": "/api/v2/projects/my-project/environments/my-env/context-instances/organization:launch-darkly:user:henry?limit=2&continuationToken=2022-04-15T15:00:57.526470334Z",
     "type": "application/json"
   },
   "self": {
     "href": "/api/v2/projects/my-proj/environments/my-env/context-instances/organization:launch-darkly:user:henry-jacobs?limit=2",
     "type": "application/json"
   }
 },
 "totalCount": 100,
 "continuationToken": "QAGFKH1313KUGI2351"
}

Search for context instances.
You can use either the query parameters or the request body parameters. If both are provided, there is an error.
To learn more about the filter syntax, read Filtering contexts and context instances. To learn more about context instances, read Context instances.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
Headers
AuthorizationstringRequired
Query parameters
limitlongOptional
Specifies the maximum number of items in the collection to return (max: 50, default: 20)
continuationTokenstringOptional
Limits results to context instances with sort values after the value specified. You can use this for pagination, however, we recommend using the next link we provide instead.
sortstringOptional
Specifies a field by which to sort. LaunchDarkly supports sorting by timestamp in ascending order by specifying ts for this value, or descending order by specifying -ts.
filterstringOptional
A comma-separated list of context filters. This endpoint only accepts an applicationId filter. To learn more about the filter syntax, read Filtering contexts and context instances.
includeTotalCountbooleanOptional
Specifies whether to include or omit the total count of matching context instances. Defaults to true.
Request
This endpoint expects an object.
filterstringOptional
A collection of context instance filters
sortstringOptional
Specifies a field by which to sort. LaunchDarkly supports sorting by timestamp in ascending order by specifying ts for this value, or descending order by specifying -ts.
limitintegerOptional
Specifies the maximum number of items in the collection to return (max: 50, default: 20)
continuationTokenstringOptional
Limits results to context instances with sort values after the value specified. You can use this for pagination, however, we recommend using the next link instead, because this value is an obfuscated string.
Response
Context instances collection response
_environmentIdstring
The environment ID
itemslist of objects
A collection of context instances. Can include multiple versions of context instances that have the same id, but different applicationIds.
Show 7 properties
_linksmap from strings to objects or null
The location and content type of related resources
Show 2 properties
totalCountinteger or null
The number of unique context instances
continuationTokenstring or null
An obfuscated string that references the last context instance on the previous page of results. You can use this for pagination, however, we recommend using the next link instead.
Errors
400
Search Context Instances Request Bad Request Error
401
Search Context Instances Request Unauthorized Error
403
Search Context Instances Request Forbidden Error
429
Search Context Instances Request Too Many Requests Error
Search for contexts
POST
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey/contexts/search
POST
/api/v2/projects/:projectKey/environments/:environmentKey/contexts/search
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey/contexts/search';
const options = {
 method: 'POST',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Successful
{
 "_environmentId": "57be1db38b75bf0772d11384",
 "items": [
   {
     "context": {
       "key": "value"
     },
     "lastSeen": "2022-04-15T15:00:57Z",
     "applicationId": "GoSDK/1.2",
     "_links": {
       "parent": {
         "href": "/api/v2/projects/my-project/environments/my-environment",
         "type": "application/json"
       },
       "self": {
         "href": "/api/v2/projects/my-project/environments/my-env/contexts/organization:launch-darkly:user:henry?filter=applicationId:\"GoSDK/1.2\"",
         "type": "application/json"
       },
       "site": {
         "href": "/my-project/my-environment/context/organization:launch-darkly:user:henry",
         "type": "text/html"
       }
     },
     "_access": {
       "denied": [
         {
           "action": "action",
           "reason": {
             "effect": "allow"
           }
         }
       ],
       "allowed": [
         {
           "action": "action",
           "reason": {
             "effect": "allow"
           }
         }
       ]
     },
     "associatedContexts": 0
   }
 ],
 "_links": {
   "next": {
     "href": "/app.launchdarkly.com/api/v2/projects/my-project/environments/my-environment/contexts?filter=kind:{\"equals\": [\"organization\"]}&limit=2&continuationToken=QAGFKH1313KUGI2351",
     "type": "application/json"
   },
   "self": {
     "href": "/api/v2/projects/my-proj/environments/my-env/contexts?filter=kind:{\"equals\": [\"organization\"]}&limit=2&continuationToken=QAGFKH1313KUGI2351",
     "type": "application/json"
   }
 },
 "totalCount": 100,
 "continuationToken": "QAGFKH1313KUGI2351"
}

Search for contexts.
You can use either the query parameters or the request body parameters. If both are provided, there is an error.
To learn more about the filter syntax, read Filtering contexts and context instances. To learn more about contexts, read Contexts and context kinds.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
Headers
AuthorizationstringRequired
Query parameters
limitlongOptional
Specifies the maximum number of items in the collection to return (max: 50, default: 20)
continuationTokenstringOptional
Limits results to contexts with sort values after the value specified. You can use this for pagination, however, we recommend using the next link we provide instead.
sortstringOptional
Specifies a field by which to sort. LaunchDarkly supports sorting by timestamp in ascending order by specifying ts for this value, or descending order by specifying -ts.
filterstringOptional
A comma-separated list of context filters. To learn more about the filter syntax, read Filtering contexts and context instances.
includeTotalCountbooleanOptional
Specifies whether to include or omit the total count of matching contexts. Defaults to true.
Request
This endpoint expects an object.
filterstringOptional
A collection of context filters
sortstringOptional
Specifies a field by which to sort. LaunchDarkly supports sorting by timestamp in ascending order by specifying ts for this value, or descending order by specifying -ts.
limitintegerOptional
Specifies the maximum number of items in the collection to return (max: 50, default: 20)
continuationTokenstringOptional
Limits results to contexts with sort values after the value specified. You can use this for pagination, however, we recommend using the next link instead, because this value is an obfuscated string.
Response
Contexts collection response
_environmentIdstring
The environment ID where the context was evaluated
itemslist of objects
A collection of contexts. Can include multiple versions of contexts that have the same kind and key, but different applicationIds.
Hide 6 properties
contextany
lastSeendatetime or null
Timestamp of the last time an evaluation occurred for this context
applicationIdstring or null
An identifier representing the application where the LaunchDarkly SDK is running
_linksmap from strings to objects or null
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_accessobject or null
Details on the allowed and denied actions for this context instance
Hide 2 properties
deniedlist of objects
Hide 2 properties
actionstring
reasonobject
Hide 6 properties
effectenum
Whether this statement should allow or deny actions on the resources.
Allowed values:allowdeny
resourceslist of strings or null
Resource specifier strings
notResourceslist of strings or null
Targeted resources are the resources NOT in this list. The resources and notActions fields must be empty to use this field.
actionslist of strings or null
Actions to perform on a resource
notActionslist of strings or null
Targeted actions are the actions NOT in this list. The actions and notResources fields must be empty to use this field.
role_namestring or null
allowedlist of objects
Hide 2 properties
actionstring
reasonobject
Hide 6 properties
effectenum
Whether this statement should allow or deny actions on the resources.
Allowed values:allowdeny
resourceslist of strings or null
Resource specifier strings
notResourceslist of strings or null
Targeted resources are the resources NOT in this list. The resources and notActions fields must be empty to use this field.
actionslist of strings or null
Actions to perform on a resource
notActionslist of strings or null
Targeted actions are the actions NOT in this list. The actions and notResources fields must be empty to use this field.
role_namestring or null
associatedContextsinteger or null
The total number of associated contexts. Associated contexts are contexts that have appeared in the same context instance, that is, they were part of the same flag evaluation.
_linksmap from strings to objects or null
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
totalCountinteger or null
The number of contexts
continuationTokenstring or null
An obfuscated string that references the last context instance on the previous page of results. You can use this for pagination, however, we recommend using the next link instead.
Errors
400
Search Contexts Request Bad Request Error
401
Search Contexts Request Unauthorized Error
403
Search Contexts Request Forbidden Error
429
Search Contexts Request Too Many Requests Error
Context settings
You can use the context settings API to assign a context to a specific variation for any feature flag. To learn more, read View and manage contexts.
Update flag settings for context
PUT
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey/contexts/:contextKind/:contextKey/flags/:featureFlagKey
PUT
/api/v2/projects/:projectKey/environments/:environmentKey/contexts/:contextKind/:contextKey/flags/:featureFlagKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey/contexts/contextKind/contextKey/flags/featureFlagKey';
const options = {
 method: 'PUT',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
No Content
{
 "key": "value"
}

Enable or disable a feature flag for a context based on its context kind and key.
In the request body, the setting should be the variation value to set for the context. It must match the flag’s variation type. For example, for a boolean flag you can use "setting": true or "setting": false in the request body. For a string flag, you can use "setting": "existing_variation_value_to_use".
Omitting the setting attribute from the request body, or including a setting of null, erases the current setting for a context.
If you previously patched the flag, and the patch included the context’s data, LaunchDarkly continues to use that data. If LaunchDarkly has never encountered the combination of the context’s key and kind before, it calculates the flag values based on the context kind and key.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
contextKindstringRequired
The context kind
contextKeystringRequired
The context key
featureFlagKeystringRequired
The feature flag key
Headers
AuthorizationstringRequired
Request
This endpoint expects an object.
settinganyOptional
commentstringOptional
Optional comment describing the change
Response
Action succeeded
Errors
400
Put Context Flag Setting Request Bad Request Error
401
Put Context Flag Setting Request Unauthorized Error
403
Put Context Flag Setting Request Forbidden Error
404
Put Context Flag Setting Request Not Found Error
429
Put Context Flag Setting Request Too Many Requests Error
Environments
Environments allow you to maintain separate rollout rules in different contexts, from local development to QA, staging, and production. With the LaunchDarkly Environments API, you can programmatically list, create, and manage environments. To learn more, read Environments.
Create environment
POST
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments
POST
/api/v2/projects/:projectKey/environments
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments';
const options = {
 method: 'POST',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"name":"My Environment","key":"environment-key-123abc","color":"DADBEE"}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Created
{
 "_links": {
   "self": {
     "href": "/api/v2/projects/my-project/environments/my-environment",
     "type": "application/json"
   }
 },
 "_id": "57be1db38b75bf0772d11384",
 "key": "environment-key-123abc",
 "name": "My Environment",
 "apiKey": "sdk-xxx",
 "mobileKey": "mob-xxx",
 "color": "F5A623",
 "defaultTtl": 5,
 "secureMode": true,
 "defaultTrackEvents": false,
 "requireComments": true,
 "confirmChanges": true,
 "tags": [
   "ops"
 ],
 "critical": true,
 "approvalSettings": {
   "required": true,
   "bypassApprovalsForPendingChanges": false,
   "minNumApprovals": 1,
   "canReviewOwnRequest": false,
   "canApplyDeclinedChanges": true,
   "serviceKind": "launchdarkly",
   "serviceConfig": {
     "key": "value"
   },
   "requiredApprovalTags": [
     "require-approval"
   ],
   "autoApplyApprovedChanges": true,
   "serviceKindConfigurationId": "1ef45a85-218f-4428-a8b2-a97e5f56c258",
   "resourceKind": "resourceKind"
 },
 "resourceApprovalSettings": {
   "key": {
     "required": true,
     "bypassApprovalsForPendingChanges": false,
     "minNumApprovals": 1,
     "canReviewOwnRequest": false,
     "canApplyDeclinedChanges": true,
     "serviceKind": "launchdarkly",
     "serviceConfig": {
       "key": "value"
     },
     "requiredApprovalTags": [
       "require-approval"
     ],
     "autoApplyApprovedChanges": true,
     "serviceKindConfigurationId": "1ef45a85-218f-4428-a8b2-a97e5f56c258",
     "resourceKind": "resourceKind"
   }
 }
}

Approval settings
The approvalSettings key is only returned when the approvals feature is enabled.
You cannot update approval settings when creating new environments. Update approval settings with the [https://launchdarkly.com/docs/api/environments/patch-environment).
Create a new environment in a specified project with a given name, key, swatch color, and default TTL.
Path parameters
projectKeystringRequired
The project key
Headers
AuthorizationstringRequired
Request
This endpoint expects an object.
namestringRequired
A human-friendly name for the new environment
keystringRequired
A project-unique key for the new environment
colorstringRequired
A color to indicate this environment in the UI
defaultTtlintegerOptional
The default time (in minutes) that the PHP SDK can cache feature flag rules locally
secureModebooleanOptional
Ensures that one end user of the client-side SDK cannot inspect the variations for another end user
defaultTrackEventsbooleanOptional
Enables tracking detailed information for new flags by default
confirmChangesbooleanOptional
Requires confirmation for all flag and segment changes via the UI in this environment
requireCommentsbooleanOptional
Requires comments for all flag and segment changes via the UI in this environment
tagslist of stringsOptional
Tags to apply to the new environment
sourceobjectOptional
Indicates that the new environment created will be cloned from the provided source environment
Show 2 properties
criticalbooleanOptional
Whether the environment is critical
Response
Environment response
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
_idstring
The ID for the environment. Use this as the client-side ID for authorization in some client-side SDKs, and to associate LaunchDarkly environments with CDN integrations in edge SDKs.
keystring
A project-unique key for the new environment
namestring
A human-friendly name for the new environment
apiKeystring
The SDK key for the environment. Use this for authorization in server-side SDKs.
mobileKeystring
The mobile key for the environment. Use this for authorization in mobile SDKs.
colorstring
The color used to indicate this environment in the UI
defaultTtlinteger
The default time (in minutes) that the PHP SDK can cache feature flag rules locally
secureModeboolean
Ensures that one end user of the client-side SDK cannot inspect the variations for another end user
defaultTrackEventsboolean
Enables tracking detailed information for new flags by default
requireCommentsboolean
Whether members who modify flags and segments through the LaunchDarkly user interface are required to add a comment
confirmChangesboolean
Whether members who modify flags and segments through the LaunchDarkly user interface are required to confirm those changes
tagslist of strings
A list of tags for this environment
criticalboolean
Whether the environment is critical
approvalSettingsobject or null
Details on the approval settings for this environment
Show 11 properties
resourceApprovalSettingsmap from strings to objects or null
Details on the approval settings for this environment for each resource kind
Show 11 properties
Errors
400
Post Environment Request Bad Request Error
401
Post Environment Request Unauthorized Error
403
Post Environment Request Forbidden Error
404
Post Environment Request Not Found Error
409
Post Environment Request Conflict Error
429
Post Environment Request Too Many Requests Error
Delete environment
DELETE
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey
DELETE
/api/v2/projects/:projectKey/environments/:environmentKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey';
const options = {method: 'DELETE', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
No Content
{
 "key": "value"
}

Delete a environment by key.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
Headers
AuthorizationstringRequired
Response
Action succeeded
Errors
401
Delete Environment Request Unauthorized Error
403
Delete Environment Request Forbidden Error
404
Delete Environment Request Not Found Error
429
Delete Environment Request Too Many Requests Error
Get environment
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey
GET
/api/v2/projects/:projectKey/environments/:environmentKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "self": {
     "href": "/api/v2/projects/my-project/environments/my-environment",
     "type": "application/json"
   }
 },
 "_id": "57be1db38b75bf0772d11384",
 "key": "environment-key-123abc",
 "name": "My Environment",
 "apiKey": "sdk-xxx",
 "mobileKey": "mob-xxx",
 "color": "F5A623",
 "defaultTtl": 5,
 "secureMode": true,
 "defaultTrackEvents": false,
 "requireComments": true,
 "confirmChanges": true,
 "tags": [
   "ops"
 ],
 "critical": true,
 "approvalSettings": {
   "required": true,
   "bypassApprovalsForPendingChanges": false,
   "minNumApprovals": 1,
   "canReviewOwnRequest": false,
   "canApplyDeclinedChanges": true,
   "serviceKind": "launchdarkly",
   "serviceConfig": {
     "key": "value"
   },
   "requiredApprovalTags": [
     "require-approval"
   ],
   "autoApplyApprovedChanges": true,
   "serviceKindConfigurationId": "1ef45a85-218f-4428-a8b2-a97e5f56c258",
   "resourceKind": "resourceKind"
 },
 "resourceApprovalSettings": {
   "key": {
     "required": true,
     "bypassApprovalsForPendingChanges": false,
     "minNumApprovals": 1,
     "canReviewOwnRequest": false,
     "canApplyDeclinedChanges": true,
     "serviceKind": "launchdarkly",
     "serviceConfig": {
       "key": "value"
     },
     "requiredApprovalTags": [
       "require-approval"
     ],
     "autoApplyApprovedChanges": true,
     "serviceKindConfigurationId": "1ef45a85-218f-4428-a8b2-a97e5f56c258",
     "resourceKind": "resourceKind"
   }
 }
}

Approval settings
The approvalSettings key is only returned when approvals for flags or segments are enabled.
Get an environment given a project and key.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
Headers
AuthorizationstringRequired
Response
Environment response
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
_idstring
The ID for the environment. Use this as the client-side ID for authorization in some client-side SDKs, and to associate LaunchDarkly environments with CDN integrations in edge SDKs.
keystring
A project-unique key for the new environment
namestring
A human-friendly name for the new environment
apiKeystring
The SDK key for the environment. Use this for authorization in server-side SDKs.
mobileKeystring
The mobile key for the environment. Use this for authorization in mobile SDKs.
colorstring
The color used to indicate this environment in the UI
defaultTtlinteger
The default time (in minutes) that the PHP SDK can cache feature flag rules locally
secureModeboolean
Ensures that one end user of the client-side SDK cannot inspect the variations for another end user
defaultTrackEventsboolean
Enables tracking detailed information for new flags by default
requireCommentsboolean
Whether members who modify flags and segments through the LaunchDarkly user interface are required to add a comment
confirmChangesboolean
Whether members who modify flags and segments through the LaunchDarkly user interface are required to confirm those changes
tagslist of strings
A list of tags for this environment
criticalboolean
Whether the environment is critical
approvalSettingsobject or null
Details on the approval settings for this environment
Show 11 properties
resourceApprovalSettingsmap from strings to objects or null
Details on the approval settings for this environment for each resource kind
Show 11 properties
Errors
401
Get Environment Request Unauthorized Error
403
Get Environment Request Forbidden Error
404
Get Environment Request Not Found Error
429
Get Environment Request Too Many Requests Error
Get environment
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey
GET
/api/v2/projects/:projectKey/environments/:environmentKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "self": {
     "href": "/api/v2/projects/my-project/environments/my-environment",
     "type": "application/json"
   }
 },
 "_id": "57be1db38b75bf0772d11384",
 "key": "environment-key-123abc",
 "name": "My Environment",
 "apiKey": "sdk-xxx",
 "mobileKey": "mob-xxx",
 "color": "F5A623",
 "defaultTtl": 5,
 "secureMode": true,
 "defaultTrackEvents": false,
 "requireComments": true,
 "confirmChanges": true,
 "tags": [
   "ops"
 ],
 "critical": true,
 "approvalSettings": {
   "required": true,
   "bypassApprovalsForPendingChanges": false,
   "minNumApprovals": 1,
   "canReviewOwnRequest": false,
   "canApplyDeclinedChanges": true,
   "serviceKind": "launchdarkly",
   "serviceConfig": {
     "key": "value"
   },
   "requiredApprovalTags": [
     "require-approval"
   ],
   "autoApplyApprovedChanges": true,
   "serviceKindConfigurationId": "1ef45a85-218f-4428-a8b2-a97e5f56c258",
   "resourceKind": "resourceKind"
 },
 "resourceApprovalSettings": {
   "key": {
     "required": true,
     "bypassApprovalsForPendingChanges": false,
     "minNumApprovals": 1,
     "canReviewOwnRequest": false,
     "canApplyDeclinedChanges": true,
     "serviceKind": "launchdarkly",
     "serviceConfig": {
       "key": "value"
     },
     "requiredApprovalTags": [
       "require-approval"
     ],
     "autoApplyApprovedChanges": true,
     "serviceKindConfigurationId": "1ef45a85-218f-4428-a8b2-a97e5f56c258",
     "resourceKind": "resourceKind"
   }
 }
}

Approval settings
The approvalSettings key is only returned when approvals for flags or segments are enabled.
Get an environment given a project and key.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
Headers
AuthorizationstringRequired
Response
Environment response
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring
The ID for the environment. Use this as the client-side ID for authorization in some client-side SDKs, and to associate LaunchDarkly environments with CDN integrations in edge SDKs.
keystring
A project-unique key for the new environment
namestring
A human-friendly name for the new environment
apiKeystring
The SDK key for the environment. Use this for authorization in server-side SDKs.
mobileKeystring
The mobile key for the environment. Use this for authorization in mobile SDKs.
colorstring
The color used to indicate this environment in the UI
defaultTtlinteger
The default time (in minutes) that the PHP SDK can cache feature flag rules locally
secureModeboolean
Ensures that one end user of the client-side SDK cannot inspect the variations for another end user
defaultTrackEventsboolean
Enables tracking detailed information for new flags by default
requireCommentsboolean
Whether members who modify flags and segments through the LaunchDarkly user interface are required to add a comment
confirmChangesboolean
Whether members who modify flags and segments through the LaunchDarkly user interface are required to confirm those changes
tagslist of strings
A list of tags for this environment
criticalboolean
Whether the environment is critical
approvalSettingsobject or null
Details on the approval settings for this environment
Hide 11 properties
requiredboolean
If approvals are required for this environment
bypassApprovalsForPendingChangesboolean
Whether to skip approvals for pending changes
minNumApprovalsinteger
Sets the amount of approvals required before a member can apply a change. The minimum is one and the maximum is five.
canReviewOwnRequestboolean
Allow someone who makes an approval request to apply their own change
canApplyDeclinedChangesboolean
Allow applying the change as long as at least one person has approved
serviceKindstring
Which service to use for managing approvals
serviceConfigmap from strings to any
requiredApprovalTagslist of strings
Require approval only on flags with the provided tags. Otherwise all flags will require approval.
autoApplyApprovedChangesboolean or null
Automatically apply changes that have been approved by all reviewers. This field is only applicable for approval services other than LaunchDarkly.
serviceKindConfigurationIdstring or null
Optional field for integration configuration ID of a custom approval integration. This is an Enterprise-only feature.
resourceKindstring or null
The kind of resource for which the approval settings apply, for example, flag or segment
resourceApprovalSettingsmap from strings to objects or null
Details on the approval settings for this environment for each resource kind
Hide 11 properties
requiredboolean
If approvals are required for this environment
bypassApprovalsForPendingChangesboolean
Whether to skip approvals for pending changes
minNumApprovalsinteger
Sets the amount of approvals required before a member can apply a change. The minimum is one and the maximum is five.
canReviewOwnRequestboolean
Allow someone who makes an approval request to apply their own change
canApplyDeclinedChangesboolean
Allow applying the change as long as at least one person has approved
serviceKindstring
Which service to use for managing approvals
serviceConfigmap from strings to any
requiredApprovalTagslist of strings
Require approval only on flags with the provided tags. Otherwise all flags will require approval.
autoApplyApprovedChangesboolean or null
Automatically apply changes that have been approved by all reviewers. This field is only applicable for approval services other than LaunchDarkly.
serviceKindConfigurationIdstring or null
Optional field for integration configuration ID of a custom approval integration. This is an Enterprise-only feature.
resourceKindstring or null
The kind of resource for which the approval settings apply, for example, flag or segment
Errors
401
Get Environment Request Unauthorized Error
403
Get Environment Request Forbidden Error
404
Get Environment Request Not Found Error
429
Get Environment Request Too Many Requests Error
List environments
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments
GET
/api/v2/projects/:projectKey/environments
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "items": [
   {
     "_links": {
       "self": {
         "href": "/api/v2/projects/my-project/environments/my-environment",
         "type": "application/json"
       }
     },
     "_id": "57be1db38b75bf0772d11384",
     "key": "environment-key-123abc",
     "name": "My Environment",
     "apiKey": "sdk-xxx",
     "mobileKey": "mob-xxx",
     "color": "F5A623",
     "defaultTtl": 5,
     "secureMode": true,
     "defaultTrackEvents": false,
     "requireComments": true,
     "confirmChanges": true,
     "tags": [
       "ops"
     ],
     "critical": true,
     "approvalSettings": {
       "required": true,
       "bypassApprovalsForPendingChanges": false,
       "minNumApprovals": 1,
       "canReviewOwnRequest": false,
       "canApplyDeclinedChanges": true,
       "serviceKind": "launchdarkly",
       "serviceConfig": {
         "key": "value"
       },
       "requiredApprovalTags": [
         "require-approval"
       ],
       "autoApplyApprovedChanges": true,
       "serviceKindConfigurationId": "1ef45a85-218f-4428-a8b2-a97e5f56c258"
     },
     "resourceApprovalSettings": {
       "key": {
         "required": true,
         "bypassApprovalsForPendingChanges": false,
         "minNumApprovals": 1,
         "canReviewOwnRequest": false,
         "canApplyDeclinedChanges": true,
         "serviceKind": "launchdarkly",
         "serviceConfig": {
           "key": "value"
         },
         "requiredApprovalTags": [
           "require-approval"
         ],
         "autoApplyApprovedChanges": true,
         "serviceKindConfigurationId": "1ef45a85-218f-4428-a8b2-a97e5f56c258"
       }
     }
   }
 ],
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "totalCount": 2
}

Return a list of environments for the specified project.
By default, this returns the first 20 environments. Page through this list with the limit parameter and by following the first, prev, next, and last links in the _links field that returns. If those links do not appear, the pages they refer to don’t exist. For example, the first and prev links will be missing from the response on the first page, because there is no previous page and you cannot return to the first page when you are already on the first page.
Filtering environments
LaunchDarkly supports two fields for filters:
query is a string that matches against the environments’ names and keys. It is not case sensitive.
tags is a +-separated list of environment tags. It filters the list of environments that have all of the tags in the list.
For example, the filter filter=query:abc,tags:tag-1+tag-2 matches environments with the string abc in their name or key and also are tagged with tag-1 and tag-2. The filter is not case-sensitive.
The documented values for filter query parameters are prior to URL encoding. For example, the + in filter=tags:tag-1+tag-2 must be encoded to %2B.
Sorting environments
LaunchDarkly supports the following fields for sorting:
createdOn sorts by the creation date of the environment.
critical sorts by whether the environments are marked as critical.
name sorts by environment name.
For example, sort=name sorts the response by environment name in ascending order.
Path parameters
projectKeystringRequired
The project key
Headers
AuthorizationstringRequired
Query parameters
limitlongOptional
The number of environments to return in the response. Defaults to 20.
offsetlongOptional
Where to start in the list. This is for use with pagination. For example, an offset of 10 skips the first ten items and then returns the next items in the list, up to the query limit.
filterstringOptional
A comma-separated list of filters. Each filter is of the form field:value.
sortstringOptional
A comma-separated list of fields to sort by. Fields prefixed by a dash ( - ) sort in descending order.
Response
Environments collection response
itemslist of objects
An array of environments
Hide 16 properties
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring
The ID for the environment. Use this as the client-side ID for authorization in some client-side SDKs, and to associate LaunchDarkly environments with CDN integrations in edge SDKs.
keystring
A project-unique key for the new environment
namestring
A human-friendly name for the new environment
apiKeystring
The SDK key for the environment. Use this for authorization in server-side SDKs.
mobileKeystring
The mobile key for the environment. Use this for authorization in mobile SDKs.
colorstring
The color used to indicate this environment in the UI
defaultTtlinteger
The default time (in minutes) that the PHP SDK can cache feature flag rules locally
secureModeboolean
Ensures that one end user of the client-side SDK cannot inspect the variations for another end user
defaultTrackEventsboolean
Enables tracking detailed information for new flags by default
requireCommentsboolean
Whether members who modify flags and segments through the LaunchDarkly user interface are required to add a comment
confirmChangesboolean
Whether members who modify flags and segments through the LaunchDarkly user interface are required to confirm those changes
tagslist of strings
A list of tags for this environment
criticalboolean
Whether the environment is critical
approvalSettingsobject or null
Details on the approval settings for this environment
Hide 11 properties
requiredboolean
If approvals are required for this environment
bypassApprovalsForPendingChangesboolean
Whether to skip approvals for pending changes
minNumApprovalsinteger
Sets the amount of approvals required before a member can apply a change. The minimum is one and the maximum is five.
canReviewOwnRequestboolean
Allow someone who makes an approval request to apply their own change
canApplyDeclinedChangesboolean
Allow applying the change as long as at least one person has approved
serviceKindstring
Which service to use for managing approvals
serviceConfigmap from strings to any
requiredApprovalTagslist of strings
Require approval only on flags with the provided tags. Otherwise all flags will require approval.
autoApplyApprovedChangesboolean or null
Automatically apply changes that have been approved by all reviewers. This field is only applicable for approval services other than LaunchDarkly.
serviceKindConfigurationIdstring or null
Optional field for integration configuration ID of a custom approval integration. This is an Enterprise-only feature.
resourceKindstring or null
The kind of resource for which the approval settings apply, for example, flag or segment
resourceApprovalSettingsmap from strings to objects or null
Details on the approval settings for this environment for each resource kind
Hide 11 properties
requiredboolean
If approvals are required for this environment
bypassApprovalsForPendingChangesboolean
Whether to skip approvals for pending changes
minNumApprovalsinteger
Sets the amount of approvals required before a member can apply a change. The minimum is one and the maximum is five.
canReviewOwnRequestboolean
Allow someone who makes an approval request to apply their own change
canApplyDeclinedChangesboolean
Allow applying the change as long as at least one person has approved
serviceKindstring
Which service to use for managing approvals
serviceConfigmap from strings to any
requiredApprovalTagslist of strings
Require approval only on flags with the provided tags. Otherwise all flags will require approval.
autoApplyApprovedChangesboolean or null
Automatically apply changes that have been approved by all reviewers. This field is only applicable for approval services other than LaunchDarkly.
serviceKindConfigurationIdstring or null
Optional field for integration configuration ID of a custom approval integration. This is an Enterprise-only feature.
resourceKindstring or null
The kind of resource for which the approval settings apply, for example, flag or segment
_linksmap from strings to objects or null
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
totalCountinteger or null
The number of environments returned
Errors
400
Get Environments by Project Request Bad Request Error
401
Get Environments by Project Request Unauthorized Error
403
Get Environments by Project Request Forbidden Error
404
Get Environments by Project Request Not Found Error
405
Get Environments by Project Request Method Not Allowed Error
429
Get Environments by Project Request Too Many Requests Error
Was this page helpful?
Yes

Reset environment mobile SDK key
POST
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey/mobileKey
POST
/api/v2/projects/:projectKey/environments/:environmentKey/mobileKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey/mobileKey';
const options = {method: 'POST', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Successful
{
 "_links": {
   "self": {
     "href": "/api/v2/projects/my-project/environments/my-environment",
     "type": "application/json"
   }
 },
 "_id": "57be1db38b75bf0772d11384",
 "key": "environment-key-123abc",
 "name": "My Environment",
 "apiKey": "sdk-xxx",
 "mobileKey": "mob-xxx",
 "color": "F5A623",
 "defaultTtl": 5,
 "secureMode": true,
 "defaultTrackEvents": false,
 "requireComments": true,
 "confirmChanges": true,
 "tags": [
   "ops"
 ],
 "critical": true,
 "approvalSettings": {
   "required": true,
   "bypassApprovalsForPendingChanges": false,
   "minNumApprovals": 1,
   "canReviewOwnRequest": false,
   "canApplyDeclinedChanges": true,
   "serviceKind": "launchdarkly",
   "serviceConfig": {
     "key": "value"
   },
   "requiredApprovalTags": [
     "require-approval"
   ],
   "autoApplyApprovedChanges": true,
   "serviceKindConfigurationId": "1ef45a85-218f-4428-a8b2-a97e5f56c258",
   "resourceKind": "resourceKind"
 },
 "resourceApprovalSettings": {
   "key": {
     "required": true,
     "bypassApprovalsForPendingChanges": false,
     "minNumApprovals": 1,
     "canReviewOwnRequest": false,
     "canApplyDeclinedChanges": true,
     "serviceKind": "launchdarkly",
     "serviceConfig": {
       "key": "value"
     },
     "requiredApprovalTags": [
       "require-approval"
     ],
     "autoApplyApprovedChanges": true,
     "serviceKindConfigurationId": "1ef45a85-218f-4428-a8b2-a97e5f56c258",
     "resourceKind": "resourceKind"
   }
 }
}

Reset an environment's mobile key. The optional expiry for the old key is deprecated for this endpoint, so the old key will always expire immediately.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
Headers
AuthorizationstringRequired
Response
Environment response
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring
The ID for the environment. Use this as the client-side ID for authorization in some client-side SDKs, and to associate LaunchDarkly environments with CDN integrations in edge SDKs.
keystring
A project-unique key for the new environment
namestring
A human-friendly name for the new environment
apiKeystring
The SDK key for the environment. Use this for authorization in server-side SDKs.
mobileKeystring
The mobile key for the environment. Use this for authorization in mobile SDKs.
colorstring
The color used to indicate this environment in the UI
defaultTtlinteger
The default time (in minutes) that the PHP SDK can cache feature flag rules locally
secureModeboolean
Ensures that one end user of the client-side SDK cannot inspect the variations for another end user
defaultTrackEventsboolean
Enables tracking detailed information for new flags by default
requireCommentsboolean
Whether members who modify flags and segments through the LaunchDarkly user interface are required to add a comment
confirmChangesboolean
Whether members who modify flags and segments through the LaunchDarkly user interface are required to confirm those changes
tagslist of strings
A list of tags for this environment
criticalboolean
Whether the environment is critical
approvalSettingsobject or null
Details on the approval settings for this environment
Hide 11 properties
requiredboolean
If approvals are required for this environment
bypassApprovalsForPendingChangesboolean
Whether to skip approvals for pending changes
minNumApprovalsinteger
Sets the amount of approvals required before a member can apply a change. The minimum is one and the maximum is five.
canReviewOwnRequestboolean
Allow someone who makes an approval request to apply their own change
canApplyDeclinedChangesboolean
Allow applying the change as long as at least one person has approved
serviceKindstring
Which service to use for managing approvals
serviceConfigmap from strings to any
requiredApprovalTagslist of strings
Require approval only on flags with the provided tags. Otherwise all flags will require approval.
autoApplyApprovedChangesboolean or null
Automatically apply changes that have been approved by all reviewers. This field is only applicable for approval services other than LaunchDarkly.
serviceKindConfigurationIdstring or null
Optional field for integration configuration ID of a custom approval integration. This is an Enterprise-only feature.
resourceKindstring or null
The kind of resource for which the approval settings apply, for example, flag or segment
resourceApprovalSettingsmap from strings to objects or null
Details on the approval settings for this environment for each resource kind
Hide 11 properties
requiredboolean
If approvals are required for this environment
bypassApprovalsForPendingChangesboolean
Whether to skip approvals for pending changes
minNumApprovalsinteger
Sets the amount of approvals required before a member can apply a change. The minimum is one and the maximum is five.
canReviewOwnRequestboolean
Allow someone who makes an approval request to apply their own change
canApplyDeclinedChangesboolean
Allow applying the change as long as at least one person has approved
serviceKindstring
Which service to use for managing approvals
serviceConfigmap from strings to any
requiredApprovalTagslist of strings
Require approval only on flags with the provided tags. Otherwise all flags will require approval.
autoApplyApprovedChangesboolean or null
Automatically apply changes that have been approved by all reviewers. This field is only applicable for approval services other than LaunchDarkly.
serviceKindConfigurationIdstring or null
Optional field for integration configuration ID of a custom approval integration. This is an Enterprise-only feature.
resourceKindstring or null
The kind of resource for which the approval settings apply, for example, flag or segment
Errors
400
Reset Environment Mobile Key Request Bad Request Error
401
Reset Environment Mobile Key Request Unauthorized Error
403
Reset Environment Mobile Key Request Forbidden Error
404
Reset Environment Mobile Key Request Not Found Error
409
Reset Environment Mobile Key Request Conflict Error
429
Reset Environment Mobile Key Request Too Many Requests Error
Reset environment SDK key
POST
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey/apiKey
POST
/api/v2/projects/:projectKey/environments/:environmentKey/apiKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey/apiKey';
const options = {method: 'POST', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Successful
{
 "_links": {
   "self": {
     "href": "/api/v2/projects/my-project/environments/my-environment",
     "type": "application/json"
   }
 },
 "_id": "57be1db38b75bf0772d11384",
 "key": "environment-key-123abc",
 "name": "My Environment",
 "apiKey": "sdk-xxx",
 "mobileKey": "mob-xxx",
 "color": "F5A623",
 "defaultTtl": 5,
 "secureMode": true,
 "defaultTrackEvents": false,
 "requireComments": true,
 "confirmChanges": true,
 "tags": [
   "ops"
 ],
 "critical": true,
 "approvalSettings": {
   "required": true,
   "bypassApprovalsForPendingChanges": false,
   "minNumApprovals": 1,
   "canReviewOwnRequest": false,
   "canApplyDeclinedChanges": true,
   "serviceKind": "launchdarkly",
   "serviceConfig": {
     "key": "value"
   },
   "requiredApprovalTags": [
     "require-approval"
   ],
   "autoApplyApprovedChanges": true,
   "serviceKindConfigurationId": "1ef45a85-218f-4428-a8b2-a97e5f56c258",
   "resourceKind": "resourceKind"
 },
 "resourceApprovalSettings": {
   "key": {
     "required": true,
     "bypassApprovalsForPendingChanges": false,
     "minNumApprovals": 1,
     "canReviewOwnRequest": false,
     "canApplyDeclinedChanges": true,
     "serviceKind": "launchdarkly",
     "serviceConfig": {
       "key": "value"
     },
     "requiredApprovalTags": [
       "require-approval"
     ],
     "autoApplyApprovedChanges": true,
     "serviceKindConfigurationId": "1ef45a85-218f-4428-a8b2-a97e5f56c258",
     "resourceKind": "resourceKind"
   }
 }
}

Reset an environment's SDK key with an optional expiry time for the old key.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
Headers
AuthorizationstringRequired
Query parameters
expirylongOptional
The time at which you want the old SDK key to expire, in UNIX milliseconds. By default, the key expires immediately. During the period between this call and the time when the old SDK key expires, both the old SDK key and the new SDK key will work.
Response
Environment response
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring
The ID for the environment. Use this as the client-side ID for authorization in some client-side SDKs, and to associate LaunchDarkly environments with CDN integrations in edge SDKs.
keystring
A project-unique key for the new environment
namestring
A human-friendly name for the new environment
apiKeystring
The SDK key for the environment. Use this for authorization in server-side SDKs.
mobileKeystring
The mobile key for the environment. Use this for authorization in mobile SDKs.
colorstring
The color used to indicate this environment in the UI
defaultTtlinteger
The default time (in minutes) that the PHP SDK can cache feature flag rules locally
secureModeboolean
Ensures that one end user of the client-side SDK cannot inspect the variations for another end user
defaultTrackEventsboolean
Enables tracking detailed information for new flags by default
requireCommentsboolean
Whether members who modify flags and segments through the LaunchDarkly user interface are required to add a comment
confirmChangesboolean
Whether members who modify flags and segments through the LaunchDarkly user interface are required to confirm those changes
tagslist of strings
A list of tags for this environment
criticalboolean
Whether the environment is critical
approvalSettingsobject or null
Details on the approval settings for this environment
Hide 11 properties
requiredboolean
If approvals are required for this environment
bypassApprovalsForPendingChangesboolean
Whether to skip approvals for pending changes
minNumApprovalsinteger
Sets the amount of approvals required before a member can apply a change. The minimum is one and the maximum is five.
canReviewOwnRequestboolean
Allow someone who makes an approval request to apply their own change
canApplyDeclinedChangesboolean
Allow applying the change as long as at least one person has approved
serviceKindstring
Which service to use for managing approvals
serviceConfigmap from strings to any
requiredApprovalTagslist of strings
Require approval only on flags with the provided tags. Otherwise all flags will require approval.
autoApplyApprovedChangesboolean or null
Automatically apply changes that have been approved by all reviewers. This field is only applicable for approval services other than LaunchDarkly.
serviceKindConfigurationIdstring or null
Optional field for integration configuration ID of a custom approval integration. This is an Enterprise-only feature.
resourceKindstring or null
The kind of resource for which the approval settings apply, for example, flag or segment
resourceApprovalSettingsmap from strings to objects or null
Details on the approval settings for this environment for each resource kind
Hide 11 properties
requiredboolean
If approvals are required for this environment
bypassApprovalsForPendingChangesboolean
Whether to skip approvals for pending changes
minNumApprovalsinteger
Sets the amount of approvals required before a member can apply a change. The minimum is one and the maximum is five.
canReviewOwnRequestboolean
Allow someone who makes an approval request to apply their own change
canApplyDeclinedChangesboolean
Allow applying the change as long as at least one person has approved
serviceKindstring
Which service to use for managing approvals
serviceConfigmap from strings to any
requiredApprovalTagslist of strings
Require approval only on flags with the provided tags. Otherwise all flags will require approval.
autoApplyApprovedChangesboolean or null
Automatically apply changes that have been approved by all reviewers. This field is only applicable for approval services other than LaunchDarkly.
serviceKindConfigurationIdstring or null
Optional field for integration configuration ID of a custom approval integration. This is an Enterprise-only feature.
resourceKindstring or null
The kind of resource for which the approval settings apply, for example, flag or segment
Errors
400
Reset Environment SDK Key Request Bad Request Error
401
Reset Environment SDK Key Request Unauthorized Error
403
Reset Environment SDK Key Request Forbidden Error
404
Reset Environment SDK Key Request Not Found Error
409
Reset Environment SDK Key Request Conflict Error
429
Reset Environment SDK Key Request Too Many Requests Error
Update environment
PATCH
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey
PATCH
/api/v2/projects/:projectKey/environments/:environmentKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey';
const options = {
 method: 'PATCH',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"0":{"op":"replace","path":"/requireComments","value":true}}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Updated
{
 "_links": {
   "self": {
     "href": "/api/v2/projects/my-project/environments/my-environment",
     "type": "application/json"
   }
 },
 "_id": "57be1db38b75bf0772d11384",
 "key": "environment-key-123abc",
 "name": "My Environment",
 "apiKey": "sdk-xxx",
 "mobileKey": "mob-xxx",
 "color": "F5A623",
 "defaultTtl": 5,
 "secureMode": true,
 "defaultTrackEvents": false,
 "requireComments": true,
 "confirmChanges": true,
 "tags": [
   "ops"
 ],
 "critical": true,
 "approvalSettings": {
   "required": true,
   "bypassApprovalsForPendingChanges": false,
   "minNumApprovals": 1,
   "canReviewOwnRequest": false,
   "canApplyDeclinedChanges": true,
   "serviceKind": "launchdarkly",
   "serviceConfig": {
     "key": "value"
   },
   "requiredApprovalTags": [
     "require-approval"
   ],
   "autoApplyApprovedChanges": true,
   "serviceKindConfigurationId": "1ef45a85-218f-4428-a8b2-a97e5f56c258",
   "resourceKind": "resourceKind"
 },
 "resourceApprovalSettings": {
   "key": {
     "required": true,
     "bypassApprovalsForPendingChanges": false,
     "minNumApprovals": 1,
     "canReviewOwnRequest": false,
     "canApplyDeclinedChanges": true,
     "serviceKind": "launchdarkly",
     "serviceConfig": {
       "key": "value"
     },
     "requiredApprovalTags": [
       "require-approval"
     ],
     "autoApplyApprovedChanges": true,
     "serviceKindConfigurationId": "1ef45a85-218f-4428-a8b2-a97e5f56c258",
     "resourceKind": "resourceKind"
   }
 }
}

Update an environment. Updating an environment uses a JSON patch representation of the desired changes. To learn more, read Updates.
To update fields in the environment object that are arrays, set the path to the name of the field and then append /<array index>. Using /0 appends to the beginning of the array.
Approval settings
This request only returns the approvalSettings key if the approvals feature is enabled.
Only the canReviewOwnRequest, canApplyDeclinedChanges, minNumApprovals, required and requiredApprovalTagsfields are editable.
If you try to patch the environment by setting both required and requiredApprovalTags, the request fails and an error appears. You can specify either required approvals for all flags in an environment or those with specific tags, but not both.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
Headers
AuthorizationstringRequired
Request
This endpoint expects a list of objects.
opstringRequired
The type of operation to perform
pathstringRequired
A JSON Pointer string specifying the part of the document to operate on
valueanyOptional
Response
Environment response
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring
The ID for the environment. Use this as the client-side ID for authorization in some client-side SDKs, and to associate LaunchDarkly environments with CDN integrations in edge SDKs.
keystring
A project-unique key for the new environment
namestring
A human-friendly name for the new environment
apiKeystring
The SDK key for the environment. Use this for authorization in server-side SDKs.
mobileKeystring
The mobile key for the environment. Use this for authorization in mobile SDKs.
colorstring
The color used to indicate this environment in the UI
defaultTtlinteger
The default time (in minutes) that the PHP SDK can cache feature flag rules locally
secureModeboolean
Ensures that one end user of the client-side SDK cannot inspect the variations for another end user
defaultTrackEventsboolean
Enables tracking detailed information for new flags by default
requireCommentsboolean
Whether members who modify flags and segments through the LaunchDarkly user interface are required to add a comment
confirmChangesboolean
Whether members who modify flags and segments through the LaunchDarkly user interface are required to confirm those changes
tagslist of strings
A list of tags for this environment
criticalboolean
Whether the environment is critical
approvalSettingsobject or null
Details on the approval settings for this environment
Hide 11 properties
requiredboolean
If approvals are required for this environment
bypassApprovalsForPendingChangesboolean
Whether to skip approvals for pending changes
minNumApprovalsinteger
Sets the amount of approvals required before a member can apply a change. The minimum is one and the maximum is five.
canReviewOwnRequestboolean
Allow someone who makes an approval request to apply their own change
canApplyDeclinedChangesboolean
Allow applying the change as long as at least one person has approved
serviceKindstring
Which service to use for managing approvals
serviceConfigmap from strings to any
requiredApprovalTagslist of strings
Require approval only on flags with the provided tags. Otherwise all flags will require approval.
autoApplyApprovedChangesboolean or null
Automatically apply changes that have been approved by all reviewers. This field is only applicable for approval services other than LaunchDarkly.
serviceKindConfigurationIdstring or null
Optional field for integration configuration ID of a custom approval integration. This is an Enterprise-only feature.
resourceKindstring or null
The kind of resource for which the approval settings apply, for example, flag or segment
resourceApprovalSettingsmap from strings to objects or null
Details on the approval settings for this environment for each resource kind
Hide 11 properties
requiredboolean
If approvals are required for this environment
bypassApprovalsForPendingChangesboolean
Whether to skip approvals for pending changes
minNumApprovalsinteger
Sets the amount of approvals required before a member can apply a change. The minimum is one and the maximum is five.
canReviewOwnRequestboolean
Allow someone who makes an approval request to apply their own change
canApplyDeclinedChangesboolean
Allow applying the change as long as at least one person has approved
serviceKindstring
Which service to use for managing approvals
serviceConfigmap from strings to any
requiredApprovalTagslist of strings
Require approval only on flags with the provided tags. Otherwise all flags will require approval.
autoApplyApprovedChangesboolean or null
Automatically apply changes that have been approved by all reviewers. This field is only applicable for approval services other than LaunchDarkly.
serviceKindConfigurationIdstring or null
Optional field for integration configuration ID of a custom approval integration. This is an Enterprise-only feature.
resourceKindstring or null
The kind of resource for which the approval settings apply, for example, flag or segment
Errors
400
Patch Environment Request Bad Request Error
401
Patch Environment Request Unauthorized Error
404
Patch Environment Request Not Found Error
409
Patch Environment Request Conflict Error
429
Patch Environment Request Too Many Requests Error
Experiments
Available for subscription customers
Experimentation is available to all customers on a Developer, Foundation, or Enterprise subscription. If you’re on an older Pro or Enterprise plan, Experimentation is available as an add-on. To learn more, read about our pricing. To change your plan, contact Sales.
This feature is in beta
To use this feature, pass in a header including the LD-API-Version key with value set to beta. Use this header with each call. To learn more, read Beta resources.
Resources that are in beta are still undergoing testing and development. They may change without notice, including becoming backwards incompatible.
Experimentation lets you validate the impact of features you roll out to your app or infrastructure. You can measure things like page views, clicks, load time, infrastructure costs, and more. By connecting metrics you create to flags in your LaunchDarkly environment, you can measure the changes in your customers’ behavior based on what flags they evaluate. You can run experiments with any type of flag, including boolean, string, number, and JSON flags. To learn more, read Experimentation.
You can manage experiments by using the dedicated experiment endpoints described below.
Several of the endpoints require a treatment ID or a flag rule ID. Treatment IDs are returned as part of the Get experiment results response. They are the treatmentId of each element in the treatmentResults array. Winning treatment IDs are also returned as part of the Get experiment response. They are the winningTreatmentId in the currentIteration, the winningTreatmentId in the draftIteration, and the winningTreatmentId in each element of the previousIterations array. In the flags object, the rule ID is the ID of the variation or rollout of the flag. Each flag variation ID is returned as part of the Get feature flag response. It is the _id field in each element of the variations array.
Create experiment
POST
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey/experiments
POST
/api/v2/projects/:projectKey/environments/:environmentKey/experiments
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey/experiments';
const options = {
 method: 'POST',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"name":"Example experiment","key":"experiment-key-123abc","iteration":{"hypothesis":"Example hypothesis, the new button placement will increase conversion","metrics":[{"key":"metric-key-123abc"}],"treatments":[{"name":"Treatment 1","baseline":true,"allocationPercent":"10","parameters":[{"flagKey":"example-flag-for-experiment","variationId":"e432f62b-55f6-49dd-a02f-eb24acf39d05"}]}],"flags":{"key":{"ruleId":"e432f62b-55f6-49dd-a02f-eb24acf39d05","flagConfigVersion":12}}}}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Created
{
 "key": "experiment-key-123abc",
 "name": "Example experiment",
 "_maintainerId": "12ab3c45de678910fgh12345",
 "_creationDate": 1000000,
 "environmentKey": "environmentKey",
 "_links": {
   "parent": {
     "href": "/api/v2/projects/my-project/environments/my-environment",
     "type": "application/json"
   },
   "self": {
     "href": "/api/v2/projects/my-project/environments/my-environment/experiments/my-experiment",
     "type": "application/json"
   }
 },
 "_id": "12ab3c45de678910fgh12345",
 "description": "An example experiment, used in testing",
 "archivedDate": 1000000,
 "holdoutId": "f3b74309-d581-44e1-8a2b-bb2933b4fe40",
 "currentIteration": {
   "hypothesis": "The new button placement will increase conversion",
   "status": "running",
   "createdAt": 1000000,
   "_id": "12ab3c45de678910fgh12345",
   "startedAt": 1000000,
   "endedAt": 1000000,
   "winningTreatmentId": "122c9f3e-da26-4321-ba68-e0fc02eced58",
   "winningReason": "We ran this iteration for two weeks and the winning variation was clear",
   "canReshuffleTraffic": true,
   "flags": {
     "key": {
       "_links": {
         "self": {
           "href": "/api/v2/flags/my-project/my-flag",
           "type": "application/json"
         }
       },
       "targetingRule": "fallthrough",
       "targetingRuleDescription": "Customers who live in Canada",
       "flagConfigVersion": 12,
       "notInExperimentVariationId": "e432f62b-55f6-49dd-a02f-eb24acf39d05"
     }
   },
   "primaryMetric": {
     "key": "metric-key-123abc",
     "_versionId": "_versionId",
     "name": "My metric",
     "kind": "pageview",
     "_links": {
       "self": {
         "href": "/api/v2/metrics/my-project/my-metric",
         "type": "application/json"
       }
     },
     "isGroup": true,
     "isNumeric": true,
     "metrics": [
       {
         "key": "metric-key-123abc",
         "name": "Example metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "_versionId": "version-id-123abc",
         "isNumeric": true,
         "nameInGroup": "Step 1"
       }
     ]
   },
   "primarySingleMetric": {
     "key": "metric-key-123abc",
     "name": "Example metric",
     "kind": "pageview",
     "_links": {
       "self": {
         "href": "/api/v2/metrics/my-project/my-metric",
         "type": "application/json"
       }
     },
     "_versionId": "version-id-123abc",
     "isNumeric": true,
     "unitAggregationType": "sum"
   },
   "primaryFunnel": {
     "key": "metric-group-key-123abc",
     "name": "My metric group",
     "kind": "funnel",
     "_links": {
       "parent": {
         "href": "/api/v2/projects/my-project",
         "type": "application/json"
       },
       "self": {
         "href": "/api/v2/projects/my-project/metric-groups/my-metric-group",
         "type": "application/json"
       }
     },
     "metrics": [
       {
         "key": "metric-key-123abc",
         "name": "Example metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "_versionId": "version-id-123abc",
         "isNumeric": true,
         "nameInGroup": "Step 1"
       }
     ]
   },
   "randomizationUnit": "user",
   "attributes": [
     "attributes"
   ],
   "treatments": [
     {
       "name": "Treatment 1",
       "allocationPercent": "10",
       "_id": "122c9f3e-da26-4321-ba68-e0fc02eced58",
       "baseline": true
     }
   ],
   "metrics": [
     {
       "key": "metric-key-123abc",
       "_versionId": "_versionId",
       "name": "My metric",
       "kind": "pageview",
       "_links": {
         "self": {
           "href": "/api/v2/metrics/my-project/my-metric",
           "type": "application/json"
         }
       },
       "isGroup": true,
       "isNumeric": true,
       "metrics": [
         {
           "key": "metric-key-123abc",
           "name": "Example metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "_versionId": "version-id-123abc",
           "isNumeric": true,
           "nameInGroup": "Step 1"
         }
       ]
     }
   ],
   "layerSnapshot": {
     "key": "checkout-flow",
     "name": "Checkout Flow",
     "reservationPercent": 10,
     "otherReservationPercent": 70
   },
   "secondaryMetrics": [
     {
       "key": "metric-key-123abc",
       "name": "Example metric",
       "kind": "pageview",
       "_links": {
         "self": {
           "href": "/api/v2/metrics/my-project/my-metric",
           "type": "application/json"
         }
       },
       "_versionId": "version-id-123abc",
       "isNumeric": true
     }
   ]
 },
 "draftIteration": {
   "hypothesis": "The new button placement will increase conversion",
   "status": "running",
   "createdAt": 1000000,
   "_id": "12ab3c45de678910fgh12345",
   "startedAt": 1000000,
   "endedAt": 1000000,
   "winningTreatmentId": "122c9f3e-da26-4321-ba68-e0fc02eced58",
   "winningReason": "We ran this iteration for two weeks and the winning variation was clear",
   "canReshuffleTraffic": true,
   "flags": {
     "key": {
       "_links": {
         "self": {
           "href": "/api/v2/flags/my-project/my-flag",
           "type": "application/json"
         }
       },
       "targetingRule": "fallthrough",
       "targetingRuleDescription": "Customers who live in Canada",
       "flagConfigVersion": 12,
       "notInExperimentVariationId": "e432f62b-55f6-49dd-a02f-eb24acf39d05"
     }
   },
   "primaryMetric": {
     "key": "metric-key-123abc",
     "_versionId": "_versionId",
     "name": "My metric",
     "kind": "pageview",
     "_links": {
       "self": {
         "href": "/api/v2/metrics/my-project/my-metric",
         "type": "application/json"
       }
     },
     "isGroup": true,
     "isNumeric": true,
     "metrics": [
       {
         "key": "metric-key-123abc",
         "name": "Example metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "_versionId": "version-id-123abc",
         "isNumeric": true,
         "nameInGroup": "Step 1"
       }
     ]
   },
   "primarySingleMetric": {
     "key": "metric-key-123abc",
     "name": "Example metric",
     "kind": "pageview",
     "_links": {
       "self": {
         "href": "/api/v2/metrics/my-project/my-metric",
         "type": "application/json"
       }
     },
     "_versionId": "version-id-123abc",
     "isNumeric": true,
     "unitAggregationType": "sum"
   },
   "primaryFunnel": {
     "key": "metric-group-key-123abc",
     "name": "My metric group",
     "kind": "funnel",
     "_links": {
       "parent": {
         "href": "/api/v2/projects/my-project",
         "type": "application/json"
       },
       "self": {
         "href": "/api/v2/projects/my-project/metric-groups/my-metric-group",
         "type": "application/json"
       }
     },
     "metrics": [
       {
         "key": "metric-key-123abc",
         "name": "Example metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "_versionId": "version-id-123abc",
         "isNumeric": true,
         "nameInGroup": "Step 1"
       }
     ]
   },
   "randomizationUnit": "user",
   "attributes": [
     "attributes"
   ],
   "treatments": [
     {
       "name": "Treatment 1",
       "allocationPercent": "10",
       "_id": "122c9f3e-da26-4321-ba68-e0fc02eced58",
       "baseline": true
     }
   ],
   "metrics": [
     {
       "key": "metric-key-123abc",
       "_versionId": "_versionId",
       "name": "My metric",
       "kind": "pageview",
       "_links": {
         "self": {
           "href": "/api/v2/metrics/my-project/my-metric",
           "type": "application/json"
         }
       },
       "isGroup": true,
       "isNumeric": true,
       "metrics": [
         {
           "key": "metric-key-123abc",
           "name": "Example metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "_versionId": "version-id-123abc",
           "isNumeric": true,
           "nameInGroup": "Step 1"
         }
       ]
     }
   ],
   "layerSnapshot": {
     "key": "checkout-flow",
     "name": "Checkout Flow",
     "reservationPercent": 10,
     "otherReservationPercent": 70
   },
   "secondaryMetrics": [
     {
       "key": "metric-key-123abc",
       "name": "Example metric",
       "kind": "pageview",
       "_links": {
         "self": {
           "href": "/api/v2/metrics/my-project/my-metric",
           "type": "application/json"
         }
       },
       "_versionId": "version-id-123abc",
       "isNumeric": true
     }
   ]
 },
 "previousIterations": [
   {
     "hypothesis": "The new button placement will increase conversion",
     "status": "running",
     "createdAt": 1000000,
     "_id": "12ab3c45de678910fgh12345",
     "startedAt": 1000000,
     "endedAt": 1000000,
     "winningTreatmentId": "122c9f3e-da26-4321-ba68-e0fc02eced58",
     "winningReason": "We ran this iteration for two weeks and the winning variation was clear",
     "canReshuffleTraffic": true,
     "flags": {
       "key": {
         "_links": {
           "self": {
             "href": "/api/v2/flags/my-project/my-flag",
             "type": "application/json"
           }
         },
         "targetingRule": "fallthrough",
         "targetingRuleDescription": "Customers who live in Canada",
         "flagConfigVersion": 12,
         "notInExperimentVariationId": "e432f62b-55f6-49dd-a02f-eb24acf39d05"
       }
     },
     "primaryMetric": {
       "key": "metric-key-123abc",
       "_versionId": "_versionId",
       "name": "My metric",
       "kind": "pageview",
       "_links": {
         "self": {
           "href": "/api/v2/metrics/my-project/my-metric",
           "type": "application/json"
         }
       },
       "isGroup": true,
       "isNumeric": true,
       "metrics": [
         {
           "key": "metric-key-123abc",
           "name": "Example metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "_versionId": "version-id-123abc",
           "isNumeric": true,
           "nameInGroup": "Step 1"
         }
       ]
     },
     "primarySingleMetric": {
       "key": "metric-key-123abc",
       "name": "Example metric",
       "kind": "pageview",
       "_links": {
         "self": {
           "href": "/api/v2/metrics/my-project/my-metric",
           "type": "application/json"
         }
       },
       "_versionId": "version-id-123abc",
       "isNumeric": true
     },
     "primaryFunnel": {
       "key": "metric-group-key-123abc",
       "name": "My metric group",
       "kind": "funnel",
       "_links": {
         "parent": {
           "href": "/api/v2/projects/my-project",
           "type": "application/json"
         },
         "self": {
           "href": "/api/v2/projects/my-project/metric-groups/my-metric-group",
           "type": "application/json"
         }
       },
       "metrics": [
         {
           "key": "metric-key-123abc",
           "name": "Example metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "_versionId": "version-id-123abc",
           "isNumeric": true,
           "nameInGroup": "Step 1"
         }
       ]
     },
     "randomizationUnit": "user",
     "attributes": [
       "attributes"
     ],
     "treatments": [
       {
         "name": "Treatment 1",
         "allocationPercent": "10",
         "_id": "122c9f3e-da26-4321-ba68-e0fc02eced58",
         "baseline": true
       }
     ],
     "metrics": [
       {
         "key": "metric-key-123abc",
         "_versionId": "_versionId",
         "name": "My metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "isGroup": true,
         "isNumeric": true,
         "metrics": [
           {
             "key": "metric-key-123abc",
             "name": "Example metric",
             "kind": "pageview",
             "_links": {
               "self": {
                 "href": "/api/v2/metrics/my-project/my-metric",
                 "type": "application/json"
               }
             },
             "_versionId": "version-id-123abc",
             "isNumeric": true,
             "nameInGroup": "Step 1"
           }
         ]
       }
     ],
     "layerSnapshot": {
       "key": "checkout-flow",
       "name": "Checkout Flow",
       "reservationPercent": 10,
       "otherReservationPercent": 70
     },
     "secondaryMetrics": [
       {
         "key": "metric-key-123abc",
         "name": "Example metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "_versionId": "version-id-123abc",
         "isNumeric": true
       }
     ]
   }
 ]
}

Create an experiment.
To run this experiment, you’ll need to create an iteration and then update the experiment with the startIteration instruction.
To learn more, read Creating experiments.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
Headers
AuthorizationstringRequired
Request
This endpoint expects an object.
namestringRequired
The experiment name
keystringRequired
The experiment key
iterationobjectRequired
Details on the construction of the initial iteration
Hide 9 properties
hypothesisstringRequired
The expected outcome of this experiment
metricslist of objectsRequired
Details on the metrics for this experiment
Hide 3 properties
keystringRequired
The metric key
isGroupbooleanOptional
Whether this is a metric group (true) or a metric (false). Defaults to false
primarybooleanOptionalDeprecated
Deprecated, use primarySingleMetricKey and primaryFunnelKey. Whether this is a primary metric (true) or a secondary metric (false)
treatmentslist of objectsRequired
Details on the variations you are testing in the experiment. You establish these variations in feature flags, and then reuse them in experiments.
Hide 4 properties
namestringRequired
The treatment name
baselinebooleanRequired
Whether this treatment is the baseline to compare other treatments against
allocationPercentstringRequired
The percentage of traffic allocated to this treatment during the iteration
parameterslist of objectsRequired
Details on the flag and variation to use for this treatment
Hide 2 properties
flagKeystringRequired
The flag key
variationIdstringRequired
The ID of the flag variation
flagsmap from strings to objectsRequired
Details on the feature flag and targeting rules for this iteration
Hide 3 properties
ruleIdstringRequired
The ID of the variation or rollout of the flag to use. Use "fallthrough" for the default targeting behavior when the flag is on.
flagConfigVersionintegerRequired
The flag version
notInExperimentVariationIdstringOptional
The ID of the variation to route traffic not part of the experiment analysis to. Defaults to variation ID of baseline treatment, if set.
canReshuffleTrafficbooleanOptional
Whether to allow the experiment to reassign traffic to different variations when you increase or decrease the traffic in your experiment audience (true) or keep all traffic assigned to its initial variation (false). Defaults to true.
primarySingleMetricKeystringOptional
The key of the primary metric for this experiment. Either primarySingleMetricKey or primaryFunnelKey must be present.
primaryFunnelKeystringOptional
The key of the primary funnel group for this experiment. Either primarySingleMetricKey or primaryFunnelKey must be present.
randomizationUnitstringOptional
The unit of randomization for this iteration. Defaults to user.
attributeslist of stringsOptional
The attributes that this iteration's results can be sliced by
descriptionstringOptional
The experiment description
maintainerIdstringOptional
The ID of the member who maintains this experiment
holdoutIdstringOptional
The ID of the holdout
Response
Experiment response
keystring
The experiment key
namestring
The experiment name
_maintainerIdstring
The ID of the member who maintains this experiment.
_creationDatelong
Timestamp of when the experiment was created
environmentKeystring
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring or null
The experiment ID
descriptionstring or null
The experiment description
archivedDatelong or null
Timestamp of when the experiment was archived
holdoutIdstring or null
The holdout ID
currentIterationobject or null
Details on the current iteration
Hide 19 properties
hypothesisstring
The expected outcome of this experiment
statusstring
The status of the iteration: not_started, running, stopped
createdAtlong
Timestamp of when the iteration was created
_idstring or null
The iteration ID
startedAtlong or null
Timestamp of when the iteration started
endedAtlong or null
Timestamp of when the iteration ended
winningTreatmentIdstring or null
The ID of the treatment chosen when the experiment stopped
winningReasonstring or null
The reason you stopped the experiment
canReshuffleTrafficboolean or null
Whether the experiment may reassign traffic to different variations when the experiment audience changes (true) or must keep all traffic assigned to its initial variation (false).
flagsmap from strings to objects or null
Details on the flag used in this experiment
Hide 6 properties
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
targetingRulestring or null
The targeting rule
targetingRuleDescriptionstring or null
The rule description
targetingRuleClauseslist of any or null
An array of clauses used for individual targeting based on attributes
flagConfigVersioninteger or null
The flag version
notInExperimentVariationIdstring or null
The ID of the variation to route traffic not part of the experiment analysis to
primaryMetricobject or null
Deprecated, use primarySingleMetric and primaryFunnel instead. Details on the primary metric for this experiment.
Hide 8 properties
keystring
A unique key to reference the metric or metric group
_versionIdstring
The version ID of the metric or metric group
namestring
A human-friendly name for the metric or metric group
kindenum
If this is a metric, then it represents the kind of event the metric tracks. If this is a metric group, then it represents the group type
pageviewclickcustomfunnelstandardguardrail
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
isGroupboolean
Whether this is a metric group or a metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
metricslist of objects or null
An ordered list of the metrics in this metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
primarySingleMetricobject or null
Details on the primary metric for this experiment
Hide 7 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
primaryFunnelobject or null
Details on the primary funnel group for this experiment
Hide 5 properties
keystring
A unique key to reference the metric group
namestring
A human-friendly name for the metric group
kindenum
The type of the metric group
Allowed values:funnelstandardguardrail
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
metricslist of objects or null
The metrics in the metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
randomizationUnitstring or null
The unit of randomization for this iteration
attributeslist of strings or null
The available attribute filters for this iteration
treatmentslist of objects or null
Details on the variations you are testing in the experiment
Hide 5 properties
namestring
The treatment name. This is the variation name from the flag.
allocationPercentstring
The percentage of traffic allocated to this treatment during the iteration
_idstring or null
The treatment ID. This is the variation ID from the flag.
baselineboolean or null
Whether this treatment is the baseline to compare other treatments against
parameterslist of objects or null
Details on the flag and variation used for this treatment
Hide 2 properties
variationIdstring or null
flagKeystring or null
metricslist of objects or null
Details on the metrics for this experiment
Hide 8 properties
keystring
A unique key to reference the metric or metric group
_versionIdstring
The version ID of the metric or metric group
namestring
A human-friendly name for the metric or metric group
kindenum
If this is a metric, then it represents the kind of event the metric tracks. If this is a metric group, then it represents the group type
Show 6 enum values
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
isGroupboolean
Whether this is a metric group or a metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
metricslist of objects or null
An ordered list of the metrics in this metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
layerSnapshotobject or null
Snapshot of the layer state on iteration stop, if part of a layer. Otherwise omitted.
Show 4 properties
secondaryMetricslist of objects or nullDeprecated
Deprecated, use metrics instead. Details on the secondary metrics for this experiment.
Hide 7 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
draftIterationobject or null
Details on the current iteration. This iteration may be already started, or may still be a draft.
Hide 19 properties
hypothesisstring
The expected outcome of this experiment
statusstring
The status of the iteration: not_started, running, stopped
createdAtlong
Timestamp of when the iteration was created
_idstring or null
The iteration ID
startedAtlong or null
Timestamp of when the iteration started
endedAtlong or null
Timestamp of when the iteration ended
winningTreatmentIdstring or null
The ID of the treatment chosen when the experiment stopped
winningReasonstring or null
The reason you stopped the experiment
canReshuffleTrafficboolean or null
Whether the experiment may reassign traffic to different variations when the experiment audience changes (true) or must keep all traffic assigned to its initial variation (false).
flagsmap from strings to objects or null
Details on the flag used in this experiment
Hide 6 properties
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
targetingRulestring or null
The targeting rule
targetingRuleDescriptionstring or null
The rule description
targetingRuleClauseslist of any or null
An array of clauses used for individual targeting based on attributes
flagConfigVersioninteger or null
The flag version
notInExperimentVariationIdstring or null
The ID of the variation to route traffic not part of the experiment analysis to
primaryMetricobject or null
Deprecated, use primarySingleMetric and primaryFunnel instead. Details on the primary metric for this experiment.
Hide 8 properties
keystring
A unique key to reference the metric or metric group
_versionIdstring
The version ID of the metric or metric group
namestring
A human-friendly name for the metric or metric group
kindenum
If this is a metric, then it represents the kind of event the metric tracks. If this is a metric group, then it represents the group type
pageviewclickcustomfunnelstandardguardrail
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
isGroupboolean
Whether this is a metric group or a metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
metricslist of objects or null
An ordered list of the metrics in this metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
primarySingleMetricobject or null
Details on the primary metric for this experiment
Hide 7 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
primaryFunnelobject or null
Details on the primary funnel group for this experiment
Hide 5 properties
keystring
A unique key to reference the metric group
namestring
A human-friendly name for the metric group
kindenum
The type of the metric group
Allowed values:funnelstandardguardrail
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
metricslist of objects or null
The metrics in the metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
randomizationUnitstring or null
The unit of randomization for this iteration
attributeslist of strings or null
The available attribute filters for this iteration
treatmentslist of objects or null
Details on the variations you are testing in the experiment
Hide 5 properties
namestring
The treatment name. This is the variation name from the flag.
allocationPercentstring
The percentage of traffic allocated to this treatment during the iteration
_idstring or null
The treatment ID. This is the variation ID from the flag.
baselineboolean or null
Whether this treatment is the baseline to compare other treatments against
parameterslist of objects or null
Details on the flag and variation used for this treatment
Hide 2 properties
variationIdstring or null
flagKeystring or null
metricslist of objects or null
Details on the metrics for this experiment
Hide 8 properties
keystring
A unique key to reference the metric or metric group
_versionIdstring
The version ID of the metric or metric group
namestring
A human-friendly name for the metric or metric group
kindenum
If this is a metric, then it represents the kind of event the metric tracks. If this is a metric group, then it represents the group type
pageviewclickcustomfunnelstandardguardrail
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
isGroupboolean
Whether this is a metric group or a metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
metricslist of objects or null
An ordered list of the metrics in this metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
layerSnapshotobject or null
Snapshot of the layer state on iteration stop, if part of a layer. Otherwise omitted.
Hide 4 properties
keystring
Key of the layer the experiment was part of
namestring
Layer name at the time this experiment iteration was stopped
reservationPercentinteger
Percent of layer traffic that was reserved in the layer for this experiment iteration
otherReservationPercentinteger
Percent of layer traffic that was reserved for other experiments in the same environment, when this experiment iteration was stopped
secondaryMetricslist of objects or nullDeprecated
Deprecated, use metrics instead. Details on the secondary metrics for this experiment.
Hide 7 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
previousIterationslist of objects or null
Details on the previous iterations for this experiment.
Hide 19 properties
hypothesisstring
The expected outcome of this experiment
statusstring
The status of the iteration: not_started, running, stopped
createdAtlong
Timestamp of when the iteration was created
_idstring or null
The iteration ID
startedAtlong or null
Timestamp of when the iteration started
endedAtlong or null
Timestamp of when the iteration ended
winningTreatmentIdstring or null
The ID of the treatment chosen when the experiment stopped
winningReasonstring or null
The reason you stopped the experiment
canReshuffleTrafficboolean or null
Whether the experiment may reassign traffic to different variations when the experiment audience changes (true) or must keep all traffic assigned to its initial variation (false).
flagsmap from strings to objects or null
Details on the flag used in this experiment
Hide 6 properties
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
targetingRulestring or null
The targeting rule
targetingRuleDescriptionstring or null
The rule description
targetingRuleClauseslist of any or null
An array of clauses used for individual targeting based on attributes
flagConfigVersioninteger or null
The flag version
notInExperimentVariationIdstring or null
The ID of the variation to route traffic not part of the experiment analysis to
primaryMetricobject or null
Deprecated, use primarySingleMetric and primaryFunnel instead. Details on the primary metric for this experiment.
Hide 8 properties
keystring
A unique key to reference the metric or metric group
_versionIdstring
The version ID of the metric or metric group
namestring
A human-friendly name for the metric or metric group
kindenum
If this is a metric, then it represents the kind of event the metric tracks. If this is a metric group, then it represents the group type
pageviewclickcustomfunnelstandardguardrail
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
isGroupboolean
Whether this is a metric group or a metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
metricslist of objects or null
An ordered list of the metrics in this metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
primarySingleMetricobject or null
Details on the primary metric for this experiment
Hide 7 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
primaryFunnelobject or null
Details on the primary funnel group for this experiment
Hide 5 properties
keystring
A unique key to reference the metric group
namestring
A human-friendly name for the metric group
kindenum
The type of the metric group
Allowed values:funnelstandardguardrail
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
metricslist of objects or null
The metrics in the metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
randomizationUnitstring or null
The unit of randomization for this iteration
attributeslist of strings or null
The available attribute filters for this iteration
treatmentslist of objects or null
Details on the variations you are testing in the experiment
Hide 5 properties
namestring
The treatment name. This is the variation name from the flag.
allocationPercentstring
The percentage of traffic allocated to this treatment during the iteration
_idstring or null
The treatment ID. This is the variation ID from the flag.
baselineboolean or null
Whether this treatment is the baseline to compare other treatments against
parameterslist of objects or null
Details on the flag and variation used for this treatment
Hide 2 properties
variationIdstring or null
flagKeystring or null
metricslist of objects or null
Details on the metrics for this experiment
Hide 8 properties
keystring
A unique key to reference the metric or metric group
_versionIdstring
The version ID of the metric or metric group
namestring
A human-friendly name for the metric or metric group
kindenum
If this is a metric, then it represents the kind of event the metric tracks. If this is a metric group, then it represents the group type
pageviewclickcustomfunnelstandardguardrail
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
isGroupboolean
Whether this is a metric group or a metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
metricslist of objects or null
An ordered list of the metrics in this metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
layerSnapshotobject or null
Snapshot of the layer state on iteration stop, if part of a layer. Otherwise omitted.
Hide 4 properties
keystring
Key of the layer the experiment was part of
namestring
Layer name at the time this experiment iteration was stopped
reservationPercentinteger
Percent of layer traffic that was reserved in the layer for this experiment iteration
otherReservationPercentinteger
Percent of layer traffic that was reserved for other experiments in the same environment, when this experiment iteration was stopped
secondaryMetricslist of objects or nullDeprecated
Deprecated, use metrics instead. Details on the secondary metrics for this experiment.
Hide 7 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
Errors
400
Create Experiment Request Bad Request Error
401
Create Experiment Request Unauthorized Error
403
Create Experiment Request Forbidden Error
404
Create Experiment Request Not Found Error
429
Create Experiment Request Too Many Requests Error
Was this page helpful?
Yes

Create iteration
POST
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey/experiments/:experimentKey/iterations
POST
/api/v2/projects/:projectKey/environments/:environmentKey/experiments/:experimentKey/iterations
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey/experiments/experimentKey/iterations';
const options = {
 method: 'POST',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"hypothesis":"Example hypothesis, the new button placement will increase conversion","metrics":[{"key":"metric-key-123abc"}],"treatments":[{"name":"Treatment 1","baseline":true,"allocationPercent":"10","parameters":[{"flagKey":"example-flag-for-experiment","variationId":"e432f62b-55f6-49dd-a02f-eb24acf39d05"}]}],"flags":{"key":{"ruleId":"e432f62b-55f6-49dd-a02f-eb24acf39d05","flagConfigVersion":12}}}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Successful
{
 "hypothesis": "The new button placement will increase conversion",
 "status": "running",
 "createdAt": 1000000,
 "_id": "12ab3c45de678910fgh12345",
 "startedAt": 1000000,
 "endedAt": 1000000,
 "winningTreatmentId": "122c9f3e-da26-4321-ba68-e0fc02eced58",
 "winningReason": "We ran this iteration for two weeks and the winning variation was clear",
 "canReshuffleTraffic": true,
 "flags": {
   "key": {
     "_links": {
       "self": {
         "href": "/api/v2/flags/my-project/my-flag",
         "type": "application/json"
       }
     },
     "targetingRule": "fallthrough",
     "targetingRuleDescription": "Customers who live in Canada",
     "flagConfigVersion": 12,
     "notInExperimentVariationId": "e432f62b-55f6-49dd-a02f-eb24acf39d05"
   }
 },
 "primaryMetric": {
   "key": "metric-key-123abc",
   "_versionId": "_versionId",
   "name": "My metric",
   "kind": "pageview",
   "_links": {
     "self": {
       "href": "/api/v2/metrics/my-project/my-metric",
       "type": "application/json"
     }
   },
   "isGroup": true,
   "isNumeric": true,
   "metrics": [
     {
       "key": "metric-key-123abc",
       "name": "Example metric",
       "kind": "pageview",
       "_links": {
         "self": {
           "href": "/api/v2/metrics/my-project/my-metric",
           "type": "application/json"
         }
       },
       "_versionId": "version-id-123abc",
       "isNumeric": true,
       "nameInGroup": "Step 1"
     }
   ]
 },
 "primarySingleMetric": {
   "key": "metric-key-123abc",
   "name": "Example metric",
   "kind": "pageview",
   "_links": {
     "self": {
       "href": "/api/v2/metrics/my-project/my-metric",
       "type": "application/json"
     }
   },
   "_versionId": "version-id-123abc",
   "isNumeric": true,
   "unitAggregationType": "sum"
 },
 "primaryFunnel": {
   "key": "metric-group-key-123abc",
   "name": "My metric group",
   "kind": "funnel",
   "_links": {
     "parent": {
       "href": "/api/v2/projects/my-project",
       "type": "application/json"
     },
     "self": {
       "href": "/api/v2/projects/my-project/metric-groups/my-metric-group",
       "type": "application/json"
     }
   },
   "metrics": [
     {
       "key": "metric-key-123abc",
       "name": "Example metric",
       "kind": "pageview",
       "_links": {
         "self": {
           "href": "/api/v2/metrics/my-project/my-metric",
           "type": "application/json"
         }
       },
       "_versionId": "version-id-123abc",
       "isNumeric": true,
       "nameInGroup": "Step 1"
     }
   ]
 },
 "randomizationUnit": "user",
 "attributes": [
   "attributes"
 ],
 "treatments": [
   {
     "name": "Treatment 1",
     "allocationPercent": "10",
     "_id": "122c9f3e-da26-4321-ba68-e0fc02eced58",
     "baseline": true,
     "parameters": [
       {}
     ]
   }
 ],
 "metrics": [
   {
     "key": "metric-key-123abc",
     "_versionId": "_versionId",
     "name": "My metric",
     "kind": "pageview",
     "_links": {
       "self": {
         "href": "/api/v2/metrics/my-project/my-metric",
         "type": "application/json"
       }
     },
     "isGroup": true,
     "isNumeric": true,
     "metrics": [
       {
         "key": "metric-key-123abc",
         "name": "Example metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "_versionId": "version-id-123abc",
         "isNumeric": true,
         "nameInGroup": "Step 1"
       }
     ]
   }
 ],
 "layerSnapshot": {
   "key": "checkout-flow",
   "name": "Checkout Flow",
   "reservationPercent": 10,
   "otherReservationPercent": 70
 },
 "secondaryMetrics": [
   {
     "key": "metric-key-123abc",
     "name": "Example metric",
     "kind": "pageview",
     "_links": {
       "self": {
         "href": "/api/v2/metrics/my-project/my-metric",
         "type": "application/json"
       }
     },
     "_versionId": "version-id-123abc",
     "isNumeric": true,
     "unitAggregationType": "sum"
   }
 ]
}

Create an experiment iteration.
Experiment iterations let you record experiments in individual blocks of time. Initially, iterations are created with a status of not_started and appear in the draftIteration field of an experiment. To start or stop an iteration, update the experiment with the startIteration or stopIteration instruction.
To learn more, read Start experiment iterations.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
experimentKeystringRequired
The experiment key
Headers
AuthorizationstringRequired
Request
This endpoint expects an object.
hypothesisstringRequired
The expected outcome of this experiment
metricslist of objectsRequired
Details on the metrics for this experiment
Show 3 properties
treatmentslist of objectsRequired
Details on the variations you are testing in the experiment. You establish these variations in feature flags, and then reuse them in experiments.
Hide 4 properties
namestringRequired
The treatment name
baselinebooleanRequired
Whether this treatment is the baseline to compare other treatments against
allocationPercentstringRequired
The percentage of traffic allocated to this treatment during the iteration
parameterslist of objectsRequired
Details on the flag and variation to use for this treatment
Hide 2 properties
flagKeystringRequired
The flag key
variationIdstringRequired
The ID of the flag variation
flagsmap from strings to objectsRequired
Details on the feature flag and targeting rules for this iteration
Hide 3 properties
ruleIdstringRequired
The ID of the variation or rollout of the flag to use. Use "fallthrough" for the default targeting behavior when the flag is on.
flagConfigVersionintegerRequired
The flag version
notInExperimentVariationIdstringOptional
The ID of the variation to route traffic not part of the experiment analysis to. Defaults to variation ID of baseline treatment, if set.
canReshuffleTrafficbooleanOptional
Whether to allow the experiment to reassign traffic to different variations when you increase or decrease the traffic in your experiment audience (true) or keep all traffic assigned to its initial variation (false). Defaults to true.
primarySingleMetricKeystringOptional
The key of the primary metric for this experiment. Either primarySingleMetricKey or primaryFunnelKey must be present.
primaryFunnelKeystringOptional
The key of the primary funnel group for this experiment. Either primarySingleMetricKey or primaryFunnelKey must be present.
randomizationUnitstringOptional
The unit of randomization for this iteration. Defaults to user.
attributeslist of stringsOptional
The attributes that this iteration's results can be sliced by
Response
Iteration response
hypothesisstring
The expected outcome of this experiment
statusstring
The status of the iteration: not_started, running, stopped
createdAtlong
Timestamp of when the iteration was created
_idstring or null
The iteration ID
startedAtlong or null
Timestamp of when the iteration started
endedAtlong or null
Timestamp of when the iteration ended
winningTreatmentIdstring or null
The ID of the treatment chosen when the experiment stopped
winningReasonstring or null
The reason you stopped the experiment
canReshuffleTrafficboolean or null
Whether the experiment may reassign traffic to different variations when the experiment audience changes (true) or must keep all traffic assigned to its initial variation (false).
flagsmap from strings to objects or null
Details on the flag used in this experiment
Hide 6 properties
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
targetingRulestring or null
The targeting rule
targetingRuleDescriptionstring or null
The rule description
targetingRuleClauseslist of any or null
An array of clauses used for individual targeting based on attributes
flagConfigVersioninteger or null
The flag version
notInExperimentVariationIdstring or null
The ID of the variation to route traffic not part of the experiment analysis to
primaryMetricobject or null
Deprecated, use primarySingleMetric and primaryFunnel instead. Details on the primary metric for this experiment.
Hide 8 properties
keystring
A unique key to reference the metric or metric group
_versionIdstring
The version ID of the metric or metric group
namestring
A human-friendly name for the metric or metric group
kindenum
If this is a metric, then it represents the kind of event the metric tracks. If this is a metric group, then it represents the group type
pageviewclickcustomfunnelstandardguardrail
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
isGroupboolean
Whether this is a metric group or a metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
metricslist of objects or null
An ordered list of the metrics in this metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
primarySingleMetricobject or null
Details on the primary metric for this experiment
Hide 7 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
primaryFunnelobject or null
Details on the primary funnel group for this experiment
Hide 5 properties
keystring
A unique key to reference the metric group
namestring
A human-friendly name for the metric group
kindenum
The type of the metric group
Allowed values:funnelstandardguardrail
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
metricslist of objects or null
The metrics in the metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
randomizationUnitstring or null
The unit of randomization for this iteration
attributeslist of strings or null
The available attribute filters for this iteration
treatmentslist of objects or null
Details on the variations you are testing in the experiment
Hide 5 properties
namestring
The treatment name. This is the variation name from the flag.
allocationPercentstring
The percentage of traffic allocated to this treatment during the iteration
_idstring or null
The treatment ID. This is the variation ID from the flag.
baselineboolean or null
Whether this treatment is the baseline to compare other treatments against
parameterslist of objects or null
Details on the flag and variation used for this treatment
Hide 2 properties
variationIdstring or null
flagKeystring or null
metricslist of objects or null
Details on the metrics for this experiment
Hide 8 properties
keystring
A unique key to reference the metric or metric group
_versionIdstring
The version ID of the metric or metric group
namestring
A human-friendly name for the metric or metric group
kindenum
If this is a metric, then it represents the kind of event the metric tracks. If this is a metric group, then it represents the group type
pageviewclickcustomfunnelstandardguardrail
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
isGroupboolean
Whether this is a metric group or a metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
metricslist of objects or null
An ordered list of the metrics in this metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
layerSnapshotobject or null
Snapshot of the layer state on iteration stop, if part of a layer. Otherwise omitted.
Hide 4 properties
keystring
Key of the layer the experiment was part of
namestring
Layer name at the time this experiment iteration was stopped
reservationPercentinteger
Percent of layer traffic that was reserved in the layer for this experiment iteration
otherReservationPercentinteger
Percent of layer traffic that was reserved for other experiments in the same environment, when this experiment iteration was stopped
secondaryMetricslist of objects or nullDeprecated
Deprecated, use metrics instead. Details on the secondary metrics for this experiment.
Hide 7 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
Errors
400
Create Iteration Request Bad Request Error
401
Create Iteration Request Unauthorized Error
403
Create Iteration Request Forbidden Error
404
Create Iteration Request Not Found Error
429
Create Iteration Request Too Many Requests Error
Get experiment
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey/experiments/:experimentKey
GET
/api/v2/projects/:projectKey/environments/:environmentKey/experiments/:experimentKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey/experiments/experimentKey';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "key": "experiment-key-123abc",
 "name": "Example experiment",
 "_maintainerId": "12ab3c45de678910fgh12345",
 "_creationDate": 1000000,
 "environmentKey": "environmentKey",
 "_links": {
   "parent": {
     "href": "/api/v2/projects/my-project/environments/my-environment",
     "type": "application/json"
   },
   "self": {
     "href": "/api/v2/projects/my-project/environments/my-environment/experiments/my-experiment",
     "type": "application/json"
   }
 },
 "_id": "12ab3c45de678910fgh12345",
 "description": "An example experiment, used in testing",
 "archivedDate": 1000000,
 "holdoutId": "f3b74309-d581-44e1-8a2b-bb2933b4fe40",
 "currentIteration": {
   "hypothesis": "The new button placement will increase conversion",
   "status": "running",
   "createdAt": 1000000,
   "_id": "12ab3c45de678910fgh12345",
   "startedAt": 1000000,
   "endedAt": 1000000,
   "winningTreatmentId": "122c9f3e-da26-4321-ba68-e0fc02eced58",
   "winningReason": "We ran this iteration for two weeks and the winning variation was clear",
   "canReshuffleTraffic": true,
   "flags": {
     "key": {
       "_links": {
         "self": {
           "href": "/api/v2/flags/my-project/my-flag",
           "type": "application/json"
         }
       },
       "targetingRule": "fallthrough",
       "targetingRuleDescription": "Customers who live in Canada",
       "flagConfigVersion": 12,
       "notInExperimentVariationId": "e432f62b-55f6-49dd-a02f-eb24acf39d05"
     }
   },
   "primaryMetric": {
     "key": "metric-key-123abc",
     "_versionId": "_versionId",
     "name": "My metric",
     "kind": "pageview",
     "_links": {
       "self": {
         "href": "/api/v2/metrics/my-project/my-metric",
         "type": "application/json"
       }
     },
     "isGroup": true,
     "isNumeric": true,
     "metrics": [
       {
         "key": "metric-key-123abc",
         "name": "Example metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "_versionId": "version-id-123abc",
         "isNumeric": true,
         "nameInGroup": "Step 1"
       }
     ]
   },
   "primarySingleMetric": {
     "key": "metric-key-123abc",
     "name": "Example metric",
     "kind": "pageview",
     "_links": {
       "self": {
         "href": "/api/v2/metrics/my-project/my-metric",
         "type": "application/json"
       }
     },
     "_versionId": "version-id-123abc",
     "isNumeric": true,
     "unitAggregationType": "sum"
   },
   "primaryFunnel": {
     "key": "metric-group-key-123abc",
     "name": "My metric group",
     "kind": "funnel",
     "_links": {
       "parent": {
         "href": "/api/v2/projects/my-project",
         "type": "application/json"
       },
       "self": {
         "href": "/api/v2/projects/my-project/metric-groups/my-metric-group",
         "type": "application/json"
       }
     },
     "metrics": [
       {
         "key": "metric-key-123abc",
         "name": "Example metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "_versionId": "version-id-123abc",
         "isNumeric": true,
         "nameInGroup": "Step 1"
       }
     ]
   },
   "randomizationUnit": "user",
   "attributes": [
     "attributes"
   ],
   "treatments": [
     {
       "name": "Treatment 1",
       "allocationPercent": "10",
       "_id": "122c9f3e-da26-4321-ba68-e0fc02eced58",
       "baseline": true
     }
   ],
   "metrics": [
     {
       "key": "metric-key-123abc",
       "_versionId": "_versionId",
       "name": "My metric",
       "kind": "pageview",
       "_links": {
         "self": {
           "href": "/api/v2/metrics/my-project/my-metric",
           "type": "application/json"
         }
       },
       "isGroup": true,
       "isNumeric": true,
       "metrics": [
         {
           "key": "metric-key-123abc",
           "name": "Example metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "_versionId": "version-id-123abc",
           "isNumeric": true,
           "nameInGroup": "Step 1"
         }
       ]
     }
   ],
   "layerSnapshot": {
     "key": "checkout-flow",
     "name": "Checkout Flow",
     "reservationPercent": 10,
     "otherReservationPercent": 70
   },
   "secondaryMetrics": [
     {
       "key": "metric-key-123abc",
       "name": "Example metric",
       "kind": "pageview",
       "_links": {
         "self": {
           "href": "/api/v2/metrics/my-project/my-metric",
           "type": "application/json"
         }
       },
       "_versionId": "version-id-123abc",
       "isNumeric": true
     }
   ]
 },
 "draftIteration": {
   "hypothesis": "The new button placement will increase conversion",
   "status": "running",
   "createdAt": 1000000,
   "_id": "12ab3c45de678910fgh12345",
   "startedAt": 1000000,
   "endedAt": 1000000,
   "winningTreatmentId": "122c9f3e-da26-4321-ba68-e0fc02eced58",
   "winningReason": "We ran this iteration for two weeks and the winning variation was clear",
   "canReshuffleTraffic": true,
   "flags": {
     "key": {
       "_links": {
         "self": {
           "href": "/api/v2/flags/my-project/my-flag",
           "type": "application/json"
         }
       },
       "targetingRule": "fallthrough",
       "targetingRuleDescription": "Customers who live in Canada",
       "flagConfigVersion": 12,
       "notInExperimentVariationId": "e432f62b-55f6-49dd-a02f-eb24acf39d05"
     }
   },
   "primaryMetric": {
     "key": "metric-key-123abc",
     "_versionId": "_versionId",
     "name": "My metric",
     "kind": "pageview",
     "_links": {
       "self": {
         "href": "/api/v2/metrics/my-project/my-metric",
         "type": "application/json"
       }
     },
     "isGroup": true,
     "isNumeric": true,
     "metrics": [
       {
         "key": "metric-key-123abc",
         "name": "Example metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "_versionId": "version-id-123abc",
         "isNumeric": true,
         "nameInGroup": "Step 1"
       }
     ]
   },
   "primarySingleMetric": {
     "key": "metric-key-123abc",
     "name": "Example metric",
     "kind": "pageview",
     "_links": {
       "self": {
         "href": "/api/v2/metrics/my-project/my-metric",
         "type": "application/json"
       }
     },
     "_versionId": "version-id-123abc",
     "isNumeric": true,
     "unitAggregationType": "sum"
   },
   "primaryFunnel": {
     "key": "metric-group-key-123abc",
     "name": "My metric group",
     "kind": "funnel",
     "_links": {
       "parent": {
         "href": "/api/v2/projects/my-project",
         "type": "application/json"
       },
       "self": {
         "href": "/api/v2/projects/my-project/metric-groups/my-metric-group",
         "type": "application/json"
       }
     },
     "metrics": [
       {
         "key": "metric-key-123abc",
         "name": "Example metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "_versionId": "version-id-123abc",
         "isNumeric": true,
         "nameInGroup": "Step 1"
       }
     ]
   },
   "randomizationUnit": "user",
   "attributes": [
     "attributes"
   ],
   "treatments": [
     {
       "name": "Treatment 1",
       "allocationPercent": "10",
       "_id": "122c9f3e-da26-4321-ba68-e0fc02eced58",
       "baseline": true
     }
   ],
   "metrics": [
     {
       "key": "metric-key-123abc",
       "_versionId": "_versionId",
       "name": "My metric",
       "kind": "pageview",
       "_links": {
         "self": {
           "href": "/api/v2/metrics/my-project/my-metric",
           "type": "application/json"
         }
       },
       "isGroup": true,
       "isNumeric": true,
       "metrics": [
         {
           "key": "metric-key-123abc",
           "name": "Example metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "_versionId": "version-id-123abc",
           "isNumeric": true,
           "nameInGroup": "Step 1"
         }
       ]
     }
   ],
   "layerSnapshot": {
     "key": "checkout-flow",
     "name": "Checkout Flow",
     "reservationPercent": 10,
     "otherReservationPercent": 70
   },
   "secondaryMetrics": [
     {
       "key": "metric-key-123abc",
       "name": "Example metric",
       "kind": "pageview",
       "_links": {
         "self": {
           "href": "/api/v2/metrics/my-project/my-metric",
           "type": "application/json"
         }
       },
       "_versionId": "version-id-123abc",
       "isNumeric": true
     }
   ]
 },
 "previousIterations": [
   {
     "hypothesis": "The new button placement will increase conversion",
     "status": "running",
     "createdAt": 1000000,
     "_id": "12ab3c45de678910fgh12345",
     "startedAt": 1000000,
     "endedAt": 1000000,
     "winningTreatmentId": "122c9f3e-da26-4321-ba68-e0fc02eced58",
     "winningReason": "We ran this iteration for two weeks and the winning variation was clear",
     "canReshuffleTraffic": true,
     "flags": {
       "key": {
         "_links": {
           "self": {
             "href": "/api/v2/flags/my-project/my-flag",
             "type": "application/json"
           }
         },
         "targetingRule": "fallthrough",
         "targetingRuleDescription": "Customers who live in Canada",
         "flagConfigVersion": 12,
         "notInExperimentVariationId": "e432f62b-55f6-49dd-a02f-eb24acf39d05"
       }
     },
     "primaryMetric": {
       "key": "metric-key-123abc",
       "_versionId": "_versionId",
       "name": "My metric",
       "kind": "pageview",
       "_links": {
         "self": {
           "href": "/api/v2/metrics/my-project/my-metric",
           "type": "application/json"
         }
       },
       "isGroup": true,
       "isNumeric": true,
       "metrics": [
         {
           "key": "metric-key-123abc",
           "name": "Example metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "_versionId": "version-id-123abc",
           "isNumeric": true,
           "nameInGroup": "Step 1"
         }
       ]
     },
     "primarySingleMetric": {
       "key": "metric-key-123abc",
       "name": "Example metric",
       "kind": "pageview",
       "_links": {
         "self": {
           "href": "/api/v2/metrics/my-project/my-metric",
           "type": "application/json"
         }
       },
       "_versionId": "version-id-123abc",
       "isNumeric": true
     },
     "primaryFunnel": {
       "key": "metric-group-key-123abc",
       "name": "My metric group",
       "kind": "funnel",
       "_links": {
         "parent": {
           "href": "/api/v2/projects/my-project",
           "type": "application/json"
         },
         "self": {
           "href": "/api/v2/projects/my-project/metric-groups/my-metric-group",
           "type": "application/json"
         }
       },
       "metrics": [
         {
           "key": "metric-key-123abc",
           "name": "Example metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "_versionId": "version-id-123abc",
           "isNumeric": true,
           "nameInGroup": "Step 1"
         }
       ]
     },
     "randomizationUnit": "user",
     "attributes": [
       "attributes"
     ],
     "treatments": [
       {
         "name": "Treatment 1",
         "allocationPercent": "10",
         "_id": "122c9f3e-da26-4321-ba68-e0fc02eced58",
         "baseline": true
       }
     ],
     "metrics": [
       {
         "key": "metric-key-123abc",
         "_versionId": "_versionId",
         "name": "My metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "isGroup": true,
         "isNumeric": true,
         "metrics": [
           {
             "key": "metric-key-123abc",
             "name": "Example metric",
             "kind": "pageview",
             "_links": {
               "self": {
                 "href": "/api/v2/metrics/my-project/my-metric",
                 "type": "application/json"
               }
             },
             "_versionId": "version-id-123abc",
             "isNumeric": true,
             "nameInGroup": "Step 1"
           }
         ]
       }
     ],
     "layerSnapshot": {
       "key": "checkout-flow",
       "name": "Checkout Flow",
       "reservationPercent": 10,
       "otherReservationPercent": 70
     },
     "secondaryMetrics": [
       {
         "key": "metric-key-123abc",
         "name": "Example metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "_versionId": "version-id-123abc",
         "isNumeric": true
       }
     ]
   }
 ]
}

Get details about an experiment.
Expanding the experiment response
LaunchDarkly supports four fields for expanding the “Get experiment” response. By default, these fields are not included in the response.
To expand the response, append the expand query parameter and add a comma-separated list with any of the following fields:
previousIterations includes all iterations prior to the current iteration. By default only the current iteration is included in the response.
draftIteration includes the iteration which has not been started yet, if any.
secondaryMetrics includes secondary metrics. By default only the primary metric is included in the response.
treatments includes all treatment and parameter details. By default treatment data is not included in the response.
For example, expand=draftIteration,treatments includes the draftIteration and treatments fields in the response. If fields that you request with the expand query parameter are empty, they are not included in the response.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
experimentKeystringRequired
The experiment key
Headers
AuthorizationstringRequired
Query parameters
expandstringOptional
A comma-separated list of properties that can reveal additional information in the response. Supported fields are explained above.
Response
Experiment response
keystring
The experiment key
namestring
The experiment name
_maintainerIdstring
The ID of the member who maintains this experiment.
_creationDatelong
Timestamp of when the experiment was created
environmentKeystring
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring or null
The experiment ID
descriptionstring or null
The experiment description
archivedDatelong or null
Timestamp of when the experiment was archived
holdoutIdstring or null
The holdout ID
currentIterationobject or null
Details on the current iteration
Hide 19 properties
hypothesisstring
The expected outcome of this experiment
statusstring
The status of the iteration: not_started, running, stopped
createdAtlong
Timestamp of when the iteration was created
_idstring or null
The iteration ID
startedAtlong or null
Timestamp of when the iteration started
endedAtlong or null
Timestamp of when the iteration ended
winningTreatmentIdstring or null
The ID of the treatment chosen when the experiment stopped
winningReasonstring or null
The reason you stopped the experiment
canReshuffleTrafficboolean or null
Whether the experiment may reassign traffic to different variations when the experiment audience changes (true) or must keep all traffic assigned to its initial variation (false).
flagsmap from strings to objects or null
Details on the flag used in this experiment
Hide 6 properties
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
targetingRulestring or null
The targeting rule
targetingRuleDescriptionstring or null
The rule description
targetingRuleClauseslist of any or null
An array of clauses used for individual targeting based on attributes
flagConfigVersioninteger or null
The flag version
notInExperimentVariationIdstring or null
The ID of the variation to route traffic not part of the experiment analysis to
primaryMetricobject or null
Deprecated, use primarySingleMetric and primaryFunnel instead. Details on the primary metric for this experiment.
Hide 8 properties
keystring
A unique key to reference the metric or metric group
_versionIdstring
The version ID of the metric or metric group
namestring
A human-friendly name for the metric or metric group
kindenum
If this is a metric, then it represents the kind of event the metric tracks. If this is a metric group, then it represents the group type
pageviewclickcustomfunnelstandardguardrail
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
isGroupboolean
Whether this is a metric group or a metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
metricslist of objects or null
An ordered list of the metrics in this metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
primarySingleMetricobject or null
Details on the primary metric for this experiment
Hide 7 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
primaryFunnelobject or null
Details on the primary funnel group for this experiment
Hide 5 properties
keystring
A unique key to reference the metric group
namestring
A human-friendly name for the metric group
kindenum
The type of the metric group
Allowed values:funnelstandardguardrail
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
metricslist of objects or null
The metrics in the metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
randomizationUnitstring or null
The unit of randomization for this iteration
attributeslist of strings or null
The available attribute filters for this iteration
treatmentslist of objects or null
Details on the variations you are testing in the experiment
Hide 5 properties
namestring
The treatment name. This is the variation name from the flag.
allocationPercentstring
The percentage of traffic allocated to this treatment during the iteration
_idstring or null
The treatment ID. This is the variation ID from the flag.
baselineboolean or null
Whether this treatment is the baseline to compare other treatments against
parameterslist of objects or null
Details on the flag and variation used for this treatment
Hide 2 properties
variationIdstring or null
flagKeystring or null
metricslist of objects or null
Details on the metrics for this experiment
Hide 8 properties
keystring
A unique key to reference the metric or metric group
_versionIdstring
The version ID of the metric or metric group
namestring
A human-friendly name for the metric or metric group
kindenum
If this is a metric, then it represents the kind of event the metric tracks. If this is a metric group, then it represents the group type
pageviewclickcustomfunnelstandardguardrail
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
isGroupboolean
Whether this is a metric group or a metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
metricslist of objects or null
An ordered list of the metrics in this metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
layerSnapshotobject or null
Snapshot of the layer state on iteration stop, if part of a layer. Otherwise omitted.
Hide 4 properties
keystring
Key of the layer the experiment was part of
namestring
Layer name at the time this experiment iteration was stopped
reservationPercentinteger
Percent of layer traffic that was reserved in the layer for this experiment iteration
otherReservationPercentinteger
Percent of layer traffic that was reserved for other experiments in the same environment, when this experiment iteration was stopped
secondaryMetricslist of objects or nullDeprecated
Deprecated, use metrics instead. Details on the secondary metrics for this experiment.
Hide 7 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
draftIterationobject or null
Details on the current iteration. This iteration may be already started, or may still be a draft.
Hide 19 properties
hypothesisstring
The expected outcome of this experiment
statusstring
The status of the iteration: not_started, running, stopped
createdAtlong
Timestamp of when the iteration was created
_idstring or null
The iteration ID
startedAtlong or null
Timestamp of when the iteration started
endedAtlong or null
Timestamp of when the iteration ended
winningTreatmentIdstring or null
The ID of the treatment chosen when the experiment stopped
winningReasonstring or null
The reason you stopped the experiment
canReshuffleTrafficboolean or null
Whether the experiment may reassign traffic to different variations when the experiment audience changes (true) or must keep all traffic assigned to its initial variation (false).
flagsmap from strings to objects or null
Details on the flag used in this experiment
Hide 6 properties
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
targetingRulestring or null
The targeting rule
targetingRuleDescriptionstring or null
The rule description
targetingRuleClauseslist of any or null
An array of clauses used for individual targeting based on attributes
flagConfigVersioninteger or null
The flag version
notInExperimentVariationIdstring or null
The ID of the variation to route traffic not part of the experiment analysis to
primaryMetricobject or null
Deprecated, use primarySingleMetric and primaryFunnel instead. Details on the primary metric for this experiment.
Hide 8 properties
keystring
A unique key to reference the metric or metric group
_versionIdstring
The version ID of the metric or metric group
namestring
A human-friendly name for the metric or metric group
kindenum
If this is a metric, then it represents the kind of event the metric tracks. If this is a metric group, then it represents the group type
pageviewclickcustomfunnelstandardguardrail
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
isGroupboolean
Whether this is a metric group or a metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
metricslist of objects or null
An ordered list of the metrics in this metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
primarySingleMetricobject or null
Details on the primary metric for this experiment
Hide 7 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
primaryFunnelobject or null
Details on the primary funnel group for this experiment
Hide 5 properties
keystring
A unique key to reference the metric group
namestring
A human-friendly name for the metric group
kindenum
The type of the metric group
Allowed values:funnelstandardguardrail
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
metricslist of objects or null
The metrics in the metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
randomizationUnitstring or null
The unit of randomization for this iteration
attributeslist of strings or null
The available attribute filters for this iteration
treatmentslist of objects or null
Details on the variations you are testing in the experiment
Hide 5 properties
namestring
The treatment name. This is the variation name from the flag.
allocationPercentstring
The percentage of traffic allocated to this treatment during the iteration
_idstring or null
The treatment ID. This is the variation ID from the flag.
baselineboolean or null
Whether this treatment is the baseline to compare other treatments against
parameterslist of objects or null
Details on the flag and variation used for this treatment
Hide 2 properties
variationIdstring or null
flagKeystring or null
metricslist of objects or null
Details on the metrics for this experiment
Hide 8 properties
keystring
A unique key to reference the metric or metric group
_versionIdstring
The version ID of the metric or metric group
namestring
A human-friendly name for the metric or metric group
kindenum
If this is a metric, then it represents the kind of event the metric tracks. If this is a metric group, then it represents the group type
pageviewclickcustomfunnelstandardguardrail
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
isGroupboolean
Whether this is a metric group or a metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
metricslist of objects or null
An ordered list of the metrics in this metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
layerSnapshotobject or null
Snapshot of the layer state on iteration stop, if part of a layer. Otherwise omitted.
Hide 4 properties
keystring
Key of the layer the experiment was part of
namestring
Layer name at the time this experiment iteration was stopped
reservationPercentinteger
Percent of layer traffic that was reserved in the layer for this experiment iteration
otherReservationPercentinteger
Percent of layer traffic that was reserved for other experiments in the same environment, when this experiment iteration was stopped
secondaryMetricslist of objects or nullDeprecated
Deprecated, use metrics instead. Details on the secondary metrics for this experiment.
Hide 7 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
previousIterationslist of objects or null
Details on the previous iterations for this experiment.
Hide 19 properties
hypothesisstring
The expected outcome of this experiment
statusstring
The status of the iteration: not_started, running, stopped
createdAtlong
Timestamp of when the iteration was created
_idstring or null
The iteration ID
startedAtlong or null
Timestamp of when the iteration started
endedAtlong or null
Timestamp of when the iteration ended
winningTreatmentIdstring or null
The ID of the treatment chosen when the experiment stopped
winningReasonstring or null
The reason you stopped the experiment
canReshuffleTrafficboolean or null
Whether the experiment may reassign traffic to different variations when the experiment audience changes (true) or must keep all traffic assigned to its initial variation (false).
flagsmap from strings to objects or null
Details on the flag used in this experiment
Hide 6 properties
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
targetingRulestring or null
The targeting rule
targetingRuleDescriptionstring or null
The rule description
targetingRuleClauseslist of any or null
An array of clauses used for individual targeting based on attributes
flagConfigVersioninteger or null
The flag version
notInExperimentVariationIdstring or null
The ID of the variation to route traffic not part of the experiment analysis to
primaryMetricobject or null
Deprecated, use primarySingleMetric and primaryFunnel instead. Details on the primary metric for this experiment.
Hide 8 properties
keystring
A unique key to reference the metric or metric group
_versionIdstring
The version ID of the metric or metric group
namestring
A human-friendly name for the metric or metric group
kindenum
If this is a metric, then it represents the kind of event the metric tracks. If this is a metric group, then it represents the group type
pageviewclickcustomfunnelstandardguardrail
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
isGroupboolean
Whether this is a metric group or a metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
metricslist of objects or null
An ordered list of the metrics in this metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
primarySingleMetricobject or null
Details on the primary metric for this experiment
Hide 7 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
primaryFunnelobject or null
Details on the primary funnel group for this experiment
Hide 5 properties
keystring
A unique key to reference the metric group
namestring
A human-friendly name for the metric group
kindenum
The type of the metric group
Allowed values:funnelstandardguardrail
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
metricslist of objects or null
The metrics in the metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
randomizationUnitstring or null
The unit of randomization for this iteration
attributeslist of strings or null
The available attribute filters for this iteration
treatmentslist of objects or null
Details on the variations you are testing in the experiment
Hide 5 properties
namestring
The treatment name. This is the variation name from the flag.
allocationPercentstring
The percentage of traffic allocated to this treatment during the iteration
_idstring or null
The treatment ID. This is the variation ID from the flag.
baselineboolean or null
Whether this treatment is the baseline to compare other treatments against
parameterslist of objects or null
Details on the flag and variation used for this treatment
Hide 2 properties
variationIdstring or null
flagKeystring or null
metricslist of objects or null
Details on the metrics for this experiment
Hide 8 properties
keystring
A unique key to reference the metric or metric group
_versionIdstring
The version ID of the metric or metric group
namestring
A human-friendly name for the metric or metric group
kindenum
If this is a metric, then it represents the kind of event the metric tracks. If this is a metric group, then it represents the group type
pageviewclickcustomfunnelstandardguardrail
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
isGroupboolean
Whether this is a metric group or a metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
metricslist of objects or null
An ordered list of the metrics in this metric group
Hide 9 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
nameInGroupstring or null
Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a funnel.
randomizationUnitslist of strings or null
The randomization units for the metric
layerSnapshotobject or null
Snapshot of the layer state on iteration stop, if part of a layer. Otherwise omitted.
Hide 4 properties
keystring
Key of the layer the experiment was part of
namestring
Layer name at the time this experiment iteration was stopped
reservationPercentinteger
Percent of layer traffic that was reserved in the layer for this experiment iteration
otherReservationPercentinteger
Percent of layer traffic that was reserved for other experiments in the same environment, when this experiment iteration was stopped
secondaryMetricslist of objects or nullDeprecated
Deprecated, use metrics instead. Details on the secondary metrics for this experiment.
Hide 7 properties
keystring
The metric key
namestring
The metric name
kindenum
The kind of event the metric tracks
Allowed values:pageviewclickcustom
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_versionIdstring or null
The version ID of the metric
isNumericboolean or null
For custom metrics, whether to track numeric changes in value against a baseline (true) or to track a conversion when an end user takes an action (false).
unitAggregationTypeenum or null
The type of unit aggregation to use for the metric
Allowed values:sumaverage
Errors
400
Get Experiment Request Bad Request Error
401
Get Experiment Request Unauthorized Error
403
Get Experiment Request Forbidden Error
404
Get Experiment Request Not Found Error
405
Get Experiment Request Method Not Allowed Error
429
Get Experiment Request Too Many Requests Error
Get experiments
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey/experiments
GET
/api/v2/projects/:projectKey/environments/:environmentKey/experiments
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey/experiments';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "items": [
   {
     "key": "experiment-key-123abc",
     "name": "Example experiment",
     "_maintainerId": "12ab3c45de678910fgh12345",
     "_creationDate": 1000000,
     "environmentKey": "environmentKey",
     "_links": {
       "parent": {
         "href": "/api/v2/projects/my-project/environments/my-environment",
         "type": "application/json"
       },
       "self": {
         "href": "/api/v2/projects/my-project/environments/my-environment/experiments/my-experiment",
         "type": "application/json"
       }
     },
     "_id": "12ab3c45de678910fgh12345",
     "description": "An example experiment, used in testing",
     "archivedDate": 1000000,
     "holdoutId": "f3b74309-d581-44e1-8a2b-bb2933b4fe40",
     "currentIteration": {
       "hypothesis": "The new button placement will increase conversion",
       "status": "running",
       "createdAt": 1000000,
       "_id": "12ab3c45de678910fgh12345",
       "winningTreatmentId": "122c9f3e-da26-4321-ba68-e0fc02eced58",
       "winningReason": "We ran this iteration for two weeks and the winning variation was clear",
       "canReshuffleTraffic": true,
       "primaryMetric": {
         "key": "metric-key-123abc",
         "_versionId": "_versionId",
         "name": "My metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "isGroup": true,
         "isNumeric": true,
         "metrics": [
           {
             "key": "metric-key-123abc",
             "name": "Example metric",
             "kind": "pageview",
             "_links": {
               "self": {
                 "href": "/api/v2/metrics/my-project/my-metric",
                 "type": "application/json"
               }
             },
             "_versionId": "version-id-123abc",
             "isNumeric": true,
             "nameInGroup": "Step 1"
           }
         ]
       },
       "primarySingleMetric": {
         "key": "metric-key-123abc",
         "name": "Example metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "_versionId": "version-id-123abc",
         "isNumeric": true
       },
       "primaryFunnel": {
         "key": "metric-group-key-123abc",
         "name": "My metric group",
         "kind": "funnel",
         "_links": {
           "parent": {
             "href": "/api/v2/projects/my-project",
             "type": "application/json"
           },
           "self": {
             "href": "/api/v2/projects/my-project/metric-groups/my-metric-group",
             "type": "application/json"
           }
         },
         "metrics": [
           {
             "key": "metric-key-123abc",
             "name": "Example metric",
             "kind": "pageview",
             "_links": {
               "self": {
                 "href": "/api/v2/metrics/my-project/my-metric",
                 "type": "application/json"
               }
             },
             "_versionId": "version-id-123abc",
             "isNumeric": true,
             "nameInGroup": "Step 1"
           }
         ]
       },
       "randomizationUnit": "user",
       "treatments": [
         {
           "name": "Treatment 1",
           "allocationPercent": "10",
           "_id": "122c9f3e-da26-4321-ba68-e0fc02eced58",
           "baseline": true
         }
       ],
       "metrics": [
         {
           "key": "metric-key-123abc",
           "_versionId": "_versionId",
           "name": "My metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "isGroup": true,
           "isNumeric": true,
           "metrics": [
             {
               "key": "metric-key-123abc",
               "name": "Example metric",
               "kind": "pageview",
               "_links": {
                 "self": {
                   "href": "/api/v2/metrics/my-project/my-metric",
                   "type": "application/json"
                 }
               },
               "_versionId": "version-id-123abc",
               "isNumeric": true,
               "nameInGroup": "Step 1"
             }
           ]
         }
       ],
       "layerSnapshot": {
         "key": "checkout-flow",
         "name": "Checkout Flow",
         "reservationPercent": 10,
         "otherReservationPercent": 70
       },
       "secondaryMetrics": [
         {
           "key": "metric-key-123abc",
           "name": "Example metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "_versionId": "version-id-123abc",
           "isNumeric": true
         }
       ]
     },
     "draftIteration": {
       "hypothesis": "The new button placement will increase conversion",
       "status": "running",
       "createdAt": 1000000,
       "_id": "12ab3c45de678910fgh12345",
       "winningTreatmentId": "122c9f3e-da26-4321-ba68-e0fc02eced58",
       "winningReason": "We ran this iteration for two weeks and the winning variation was clear",
       "canReshuffleTraffic": true,
       "primaryMetric": {
         "key": "metric-key-123abc",
         "_versionId": "_versionId",
         "name": "My metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "isGroup": true,
         "isNumeric": true,
         "metrics": [
           {
             "key": "metric-key-123abc",
             "name": "Example metric",
             "kind": "pageview",
             "_links": {
               "self": {
                 "href": "/api/v2/metrics/my-project/my-metric",
                 "type": "application/json"
               }
             },
             "_versionId": "version-id-123abc",
             "isNumeric": true,
             "nameInGroup": "Step 1"
           }
         ]
       },
       "primarySingleMetric": {
         "key": "metric-key-123abc",
         "name": "Example metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "_versionId": "version-id-123abc",
         "isNumeric": true
       },
       "primaryFunnel": {
         "key": "metric-group-key-123abc",
         "name": "My metric group",
         "kind": "funnel",
         "_links": {
           "parent": {
             "href": "/api/v2/projects/my-project",
             "type": "application/json"
           },
           "self": {
             "href": "/api/v2/projects/my-project/metric-groups/my-metric-group",
             "type": "application/json"
           }
         },
         "metrics": [
           {
             "key": "metric-key-123abc",
             "name": "Example metric",
             "kind": "pageview",
             "_links": {
               "self": {
                 "href": "/api/v2/metrics/my-project/my-metric",
                 "type": "application/json"
               }
             },
             "_versionId": "version-id-123abc",
             "isNumeric": true,
             "nameInGroup": "Step 1"
           }
         ]
       },
       "randomizationUnit": "user",
       "treatments": [
         {
           "name": "Treatment 1",
           "allocationPercent": "10",
           "_id": "122c9f3e-da26-4321-ba68-e0fc02eced58",
           "baseline": true
         }
       ],
       "metrics": [
         {
           "key": "metric-key-123abc",
           "_versionId": "_versionId",
           "name": "My metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "isGroup": true,
           "isNumeric": true,
           "metrics": [
             {
               "key": "metric-key-123abc",
               "name": "Example metric",
               "kind": "pageview",
               "_links": {
                 "self": {
                   "href": "/api/v2/metrics/my-project/my-metric",
                   "type": "application/json"
                 }
               },
               "_versionId": "version-id-123abc",
               "isNumeric": true,
               "nameInGroup": "Step 1"
             }
           ]
         }
       ],
       "layerSnapshot": {
         "key": "checkout-flow",
         "name": "Checkout Flow",
         "reservationPercent": 10,
         "otherReservationPercent": 70
       },
       "secondaryMetrics": [
         {
           "key": "metric-key-123abc",
           "name": "Example metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "_versionId": "version-id-123abc",
           "isNumeric": true
         }
       ]
     },
     "previousIterations": [
       {
         "hypothesis": "The new button placement will increase conversion",
         "status": "running",
         "createdAt": 1000000,
         "_id": "12ab3c45de678910fgh12345",
         "winningTreatmentId": "122c9f3e-da26-4321-ba68-e0fc02eced58",
         "winningReason": "We ran this iteration for two weeks and the winning variation was clear",
         "canReshuffleTraffic": true,
         "primaryMetric": {
           "key": "metric-key-123abc",
           "_versionId": "_versionId",
           "name": "My metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "isGroup": true,
           "isNumeric": true,
           "metrics": [
             {
               "key": "metric-key-123abc",
               "name": "Example metric",
               "kind": "pageview",
               "_links": {
                 "self": {
                   "href": "/api/v2/metrics/my-project/my-metric",
                   "type": "application/json"
                 }
               },
               "_versionId": "version-id-123abc",
               "isNumeric": true,
               "nameInGroup": "Step 1"
             }
           ]
         },
         "primarySingleMetric": {
           "key": "metric-key-123abc",
           "name": "Example metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "_versionId": "version-id-123abc",
           "isNumeric": true
         },
         "primaryFunnel": {
           "key": "metric-group-key-123abc",
           "name": "My metric group",
           "kind": "funnel",
           "_links": {
             "parent": {
               "href": "/api/v2/projects/my-project",
               "type": "application/json"
             },
             "self": {
               "href": "/api/v2/projects/my-project/metric-groups/my-metric-group",
               "type": "application/json"
             }
           },
           "metrics": [
             {
               "key": "metric-key-123abc",
               "name": "Example metric",
               "kind": "pageview",
               "_links": {
                 "self": {
                   "href": "/api/v2/metrics/my-project/my-metric",
                   "type": "application/json"
                 }
               },
               "_versionId": "version-id-123abc",
               "isNumeric": true,
               "nameInGroup": "Step 1"
             }
           ]
         },
         "randomizationUnit": "user",
         "treatments": [
           {
             "name": "Treatment 1",
             "allocationPercent": "10",
             "_id": "122c9f3e-da26-4321-ba68-e0fc02eced58",
             "baseline": true
           }
         ],
         "metrics": [
           {
             "key": "metric-key-123abc",
             "_versionId": "_versionId",
             "name": "My metric",
             "kind": "pageview",
             "_links": {
               "self": {
                 "href": "/api/v2/metrics/my-project/my-metric",
                 "type": "application/json"
               }
             },
             "isGroup": true,
             "isNumeric": true,
             "metrics": [
               {
                 "key": "metric-key-123abc",
                 "name": "Example metric",
                 "kind": "pageview",
                 "_links": {
                   "self": {
                     "href": "/api/v2/metrics/my-project/my-metric",
                     "type": "application/json"
                   }
                 },
                 "_versionId": "version-id-123abc",
                 "isNumeric": true,
                 "nameInGroup": "Step 1"
               }
             ]
           }
         ],
         "layerSnapshot": {
           "key": "checkout-flow",
           "name": "Checkout Flow",
           "reservationPercent": 10,
           "otherReservationPercent": 70
         },
         "secondaryMetrics": [
           {
             "key": "metric-key-123abc",
             "name": "Example metric",
             "kind": "pageview",
             "_links": {
               "self": {
                 "href": "/api/v2/metrics/my-project/my-metric",
                 "type": "application/json"
               }
             },
             "_versionId": "version-id-123abc",
             "isNumeric": true
           }
         ]
       }
     ]
   }
 ],
 "total_count": 1,
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 }
}

Get details about all experiments in an environment.
Filtering experiments
LaunchDarkly supports the filter query param for filtering, with the following fields:
flagKey filters for only experiments that use the flag with the given key.
metricKey filters for only experiments that use the metric with the given key.
status filters for only experiments with an iteration with the given status. An iteration can have the status not_started, running or stopped.
For example, filter=flagKey:my-flag,status:running,metricKey:page-load-ms filters for experiments for the given flag key and the given metric key which have a currently running iteration.
Expanding the experiments response
LaunchDarkly supports four fields for expanding the “Get experiments” response. By default, these fields are not included in the response.
To expand the response, append the expand query parameter and add a comma-separated list with any of the following fields:
previousIterations includes all iterations prior to the current iteration. By default only the current iteration is included in the response.
draftIteration includes the iteration which has not been started yet, if any.
secondaryMetrics includes secondary metrics. By default only the primary metric is included in the response.
treatments includes all treatment and parameter details. By default treatment data is not included in the response.
For example, expand=draftIteration,treatments includes the draftIteration and treatments fields in the response. If fields that you request with the expand query parameter are empty, they are not included in the response.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
Headers
AuthorizationstringRequired
Query parameters
limitlongOptional
The maximum number of experiments to return. Defaults to 20.
offsetlongOptional
Where to start in the list. Use this with pagination. For example, an offset of 10 skips the first ten items and then returns the next items in the list, up to the query limit.
filterstringOptional
A comma-separated list of filters. Each filter is of the form field:value. Supported fields are explained above.
expandstringOptional
A comma-separated list of properties that can reveal additional information in the response. Supported fields are explained above.
lifecycleStatestringOptional
A comma-separated list of experiment archived states. Supports archived, active, or both. Defaults to active experiments.
Response
Experiment collection response
itemslist of objects
An array of experiments
Show 13 properties
total_countinteger or null
The total number of experiments in this project and environment. Does not include legacy experiments.
_linksmap from strings to objects or null
The location and content type of related resources
Show 2 properties
Errors
400
Get Experiments Request Bad Request Error
401
Get Experiments Request Unauthorized Error
403
Get Experiments Request Forbidden Error
404
Get Experiments Request Not Found Error
405
Get Experiments Request Method Not Allowed Error
429
Get Experiments Request Too Many Requests Error
Was this page helpful?
Yes

OverviewExperiments
Get experiments
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey/experiments
GET
/api/v2/projects/:projectKey/environments/:environmentKey/experiments
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey/experiments';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "items": [
   {
     "key": "experiment-key-123abc",
     "name": "Example experiment",
     "_maintainerId": "12ab3c45de678910fgh12345",
     "_creationDate": 1000000,
     "environmentKey": "environmentKey",
     "_links": {
       "parent": {
         "href": "/api/v2/projects/my-project/environments/my-environment",
         "type": "application/json"
       },
       "self": {
         "href": "/api/v2/projects/my-project/environments/my-environment/experiments/my-experiment",
         "type": "application/json"
       }
     },
     "_id": "12ab3c45de678910fgh12345",
     "description": "An example experiment, used in testing",
     "archivedDate": 1000000,
     "holdoutId": "f3b74309-d581-44e1-8a2b-bb2933b4fe40",
     "currentIteration": {
       "hypothesis": "The new button placement will increase conversion",
       "status": "running",
       "createdAt": 1000000,
       "_id": "12ab3c45de678910fgh12345",
       "winningTreatmentId": "122c9f3e-da26-4321-ba68-e0fc02eced58",
       "winningReason": "We ran this iteration for two weeks and the winning variation was clear",
       "canReshuffleTraffic": true,
       "primaryMetric": {
         "key": "metric-key-123abc",
         "_versionId": "_versionId",
         "name": "My metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "isGroup": true,
         "isNumeric": true,
         "metrics": [
           {
             "key": "metric-key-123abc",
             "name": "Example metric",
             "kind": "pageview",
             "_links": {
               "self": {
                 "href": "/api/v2/metrics/my-project/my-metric",
                 "type": "application/json"
               }
             },
             "_versionId": "version-id-123abc",
             "isNumeric": true,
             "nameInGroup": "Step 1"
           }
         ]
       },
       "primarySingleMetric": {
         "key": "metric-key-123abc",
         "name": "Example metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "_versionId": "version-id-123abc",
         "isNumeric": true
       },
       "primaryFunnel": {
         "key": "metric-group-key-123abc",
         "name": "My metric group",
         "kind": "funnel",
         "_links": {
           "parent": {
             "href": "/api/v2/projects/my-project",
             "type": "application/json"
           },
           "self": {
             "href": "/api/v2/projects/my-project/metric-groups/my-metric-group",
             "type": "application/json"
           }
         },
         "metrics": [
           {
             "key": "metric-key-123abc",
             "name": "Example metric",
             "kind": "pageview",
             "_links": {
               "self": {
                 "href": "/api/v2/metrics/my-project/my-metric",
                 "type": "application/json"
               }
             },
             "_versionId": "version-id-123abc",
             "isNumeric": true,
             "nameInGroup": "Step 1"
           }
         ]
       },
       "randomizationUnit": "user",
       "treatments": [
         {
           "name": "Treatment 1",
           "allocationPercent": "10",
           "_id": "122c9f3e-da26-4321-ba68-e0fc02eced58",
           "baseline": true
         }
       ],
       "metrics": [
         {
           "key": "metric-key-123abc",
           "_versionId": "_versionId",
           "name": "My metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "isGroup": true,
           "isNumeric": true,
           "metrics": [
             {
               "key": "metric-key-123abc",
               "name": "Example metric",
               "kind": "pageview",
               "_links": {
                 "self": {
                   "href": "/api/v2/metrics/my-project/my-metric",
                   "type": "application/json"
                 }
               },
               "_versionId": "version-id-123abc",
               "isNumeric": true,
               "nameInGroup": "Step 1"
             }
           ]
         }
       ],
       "layerSnapshot": {
         "key": "checkout-flow",
         "name": "Checkout Flow",
         "reservationPercent": 10,
         "otherReservationPercent": 70
       },
       "secondaryMetrics": [
         {
           "key": "metric-key-123abc",
           "name": "Example metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "_versionId": "version-id-123abc",
           "isNumeric": true
         }
       ]
     },
     "draftIteration": {
       "hypothesis": "The new button placement will increase conversion",
       "status": "running",
       "createdAt": 1000000,
       "_id": "12ab3c45de678910fgh12345",
       "winningTreatmentId": "122c9f3e-da26-4321-ba68-e0fc02eced58",
       "winningReason": "We ran this iteration for two weeks and the winning variation was clear",
       "canReshuffleTraffic": true,
       "primaryMetric": {
         "key": "metric-key-123abc",
         "_versionId": "_versionId",
         "name": "My metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "isGroup": true,
         "isNumeric": true,
         "metrics": [
           {
             "key": "metric-key-123abc",
             "name": "Example metric",
             "kind": "pageview",
             "_links": {
               "self": {
                 "href": "/api/v2/metrics/my-project/my-metric",
                 "type": "application/json"
               }
             },
             "_versionId": "version-id-123abc",
             "isNumeric": true,
             "nameInGroup": "Step 1"
           }
         ]
       },
       "primarySingleMetric": {
         "key": "metric-key-123abc",
         "name": "Example metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "_versionId": "version-id-123abc",
         "isNumeric": true
       },
       "primaryFunnel": {
         "key": "metric-group-key-123abc",
         "name": "My metric group",
         "kind": "funnel",
         "_links": {
           "parent": {
             "href": "/api/v2/projects/my-project",
             "type": "application/json"
           },
           "self": {
             "href": "/api/v2/projects/my-project/metric-groups/my-metric-group",
             "type": "application/json"
           }
         },
         "metrics": [
           {
             "key": "metric-key-123abc",
             "name": "Example metric",
             "kind": "pageview",
             "_links": {
               "self": {
                 "href": "/api/v2/metrics/my-project/my-metric",
                 "type": "application/json"
               }
             },
             "_versionId": "version-id-123abc",
             "isNumeric": true,
             "nameInGroup": "Step 1"
           }
         ]
       },
       "randomizationUnit": "user",
       "treatments": [
         {
           "name": "Treatment 1",
           "allocationPercent": "10",
           "_id": "122c9f3e-da26-4321-ba68-e0fc02eced58",
           "baseline": true
         }
       ],
       "metrics": [
         {
           "key": "metric-key-123abc",
           "_versionId": "_versionId",
           "name": "My metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "isGroup": true,
           "isNumeric": true,
           "metrics": [
             {
               "key": "metric-key-123abc",
               "name": "Example metric",
               "kind": "pageview",
               "_links": {
                 "self": {
                   "href": "/api/v2/metrics/my-project/my-metric",
                   "type": "application/json"
                 }
               },
               "_versionId": "version-id-123abc",
               "isNumeric": true,
               "nameInGroup": "Step 1"
             }
           ]
         }
       ],
       "layerSnapshot": {
         "key": "checkout-flow",
         "name": "Checkout Flow",
         "reservationPercent": 10,
         "otherReservationPercent": 70
       },
       "secondaryMetrics": [
         {
           "key": "metric-key-123abc",
           "name": "Example metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "_versionId": "version-id-123abc",
           "isNumeric": true
         }
       ]
     },
     "previousIterations": [
       {
         "hypothesis": "The new button placement will increase conversion",
         "status": "running",
         "createdAt": 1000000,
         "_id": "12ab3c45de678910fgh12345",
         "winningTreatmentId": "122c9f3e-da26-4321-ba68-e0fc02eced58",
         "winningReason": "We ran this iteration for two weeks and the winning variation was clear",
         "canReshuffleTraffic": true,
         "primaryMetric": {
           "key": "metric-key-123abc",
           "_versionId": "_versionId",
           "name": "My metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "isGroup": true,
           "isNumeric": true,
           "metrics": [
             {
               "key": "metric-key-123abc",
               "name": "Example metric",
               "kind": "pageview",
               "_links": {
                 "self": {
                   "href": "/api/v2/metrics/my-project/my-metric",
                   "type": "application/json"
                 }
               },
               "_versionId": "version-id-123abc",
               "isNumeric": true,
               "nameInGroup": "Step 1"
             }
           ]
         },
         "primarySingleMetric": {
           "key": "metric-key-123abc",
           "name": "Example metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "_versionId": "version-id-123abc",
           "isNumeric": true
         },
         "primaryFunnel": {
           "key": "metric-group-key-123abc",
           "name": "My metric group",
           "kind": "funnel",
           "_links": {
             "parent": {
               "href": "/api/v2/projects/my-project",
               "type": "application/json"
             },
             "self": {
               "href": "/api/v2/projects/my-project/metric-groups/my-metric-group",
               "type": "application/json"
             }
           },
           "metrics": [
             {
               "key": "metric-key-123abc",
               "name": "Example metric",
               "kind": "pageview",
               "_links": {
                 "self": {
                   "href": "/api/v2/metrics/my-project/my-metric",
                   "type": "application/json"
                 }
               },
               "_versionId": "version-id-123abc",
               "isNumeric": true,
               "nameInGroup": "Step 1"
             }
           ]
         },
         "randomizationUnit": "user",
         "treatments": [
           {
             "name": "Treatment 1",
             "allocationPercent": "10",
             "_id": "122c9f3e-da26-4321-ba68-e0fc02eced58",
             "baseline": true
           }
         ],
         "metrics": [
           {
             "key": "metric-key-123abc",
             "_versionId": "_versionId",
             "name": "My metric",
             "kind": "pageview",
             "_links": {
               "self": {
                 "href": "/api/v2/metrics/my-project/my-metric",
                 "type": "application/json"
               }
             },
             "isGroup": true,
             "isNumeric": true,
             "metrics": [
               {
                 "key": "metric-key-123abc",
                 "name": "Example metric",
                 "kind": "pageview",
                 "_links": {
                   "self": {
                     "href": "/api/v2/metrics/my-project/my-metric",
                     "type": "application/json"
                   }
                 },
                 "_versionId": "version-id-123abc",
                 "isNumeric": true,
                 "nameInGroup": "Step 1"
               }
             ]
           }
         ],
         "layerSnapshot": {
           "key": "checkout-flow",
           "name": "Checkout Flow",
           "reservationPercent": 10,
           "otherReservationPercent": 70
         },
         "secondaryMetrics": [
           {
             "key": "metric-key-123abc",
             "name": "Example metric",
             "kind": "pageview",
             "_links": {
               "self": {
                 "href": "/api/v2/metrics/my-project/my-metric",
                 "type": "application/json"
               }
             },
             "_versionId": "version-id-123abc",
             "isNumeric": true
           }
         ]
       }
     ]
   }
 ],
 "total_count": 1,
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 }
}

Get details about all experiments in an environment.
Filtering experiments
LaunchDarkly supports the filter query param for filtering, with the following fields:
flagKey filters for only experiments that use the flag with the given key.
metricKey filters for only experiments that use the metric with the given key.
status filters for only experiments with an iteration with the given status. An iteration can have the status not_started, running or stopped.
For example, filter=flagKey:my-flag,status:running,metricKey:page-load-ms filters for experiments for the given flag key and the given metric key which have a currently running iteration.
Expanding the experiments response
LaunchDarkly supports four fields for expanding the “Get experiments” response. By default, these fields are not included in the response.
To expand the response, append the expand query parameter and add a comma-separated list with any of the following fields:
previousIterations includes all iterations prior to the current iteration. By default only the current iteration is included in the response.
draftIteration includes the iteration which has not been started yet, if any.
secondaryMetrics includes secondary metrics. By default only the primary metric is included in the response.
treatments includes all treatment and parameter details. By default treatment data is not included in the response.
For example, expand=draftIteration,treatments includes the draftIteration and treatments fields in the response. If fields that you request with the expand query parameter are empty, they are not included in the response.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
Headers
AuthorizationstringRequired
Query parameters
limitlongOptional
The maximum number of experiments to return. Defaults to 20.
offsetlongOptional
Where to start in the list. Use this with pagination. For example, an offset of 10 skips the first ten items and then returns the next items in the list, up to the query limit.
filterstringOptional
A comma-separated list of filters. Each filter is of the form field:value. Supported fields are explained above.
expandstringOptional
A comma-separated list of properties that can reveal additional information in the response. Supported fields are explained above.
lifecycleStatestringOptional
A comma-separated list of experiment archived states. Supports archived, active, or both. Defaults to active experiments.
Response
Experiment collection response
itemslist of objects
An array of experiments
Show 13 properties
total_countinteger or null
The total number of experiments in this project and environment. Does not include legacy experiments.
_linksmap from strings to objects or null
The location and content type of related resources
Show 2 properties
Errors
400
Get Experiments Request Bad Request Error
401
Get Experiments Request Unauthorized Error
403
Get Experiments Request Forbidden Error
404
Get Experiments Request Not Found Error
405
Get Experiments Request Method Not Allowed Error
429
Get Experiments Request Too Many Requests Error
Patch experiment
PATCH
https://app.launchdarkly.com/api/v2/projects/:projectKey/environments/:environmentKey/experiments/:experimentKey
PATCH
/api/v2/projects/:projectKey/environments/:environmentKey/experiments/:experimentKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/environments/environmentKey/experiments/experimentKey';
const options = {
 method: 'PATCH',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"instructions":[{"kind":"updateName","value":"Updated experiment name"}],"comment":"Example comment describing the update"}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Updated
{
 "key": "experiment-key-123abc",
 "name": "Example experiment",
 "_maintainerId": "12ab3c45de678910fgh12345",
 "_creationDate": 1000000,
 "environmentKey": "environmentKey",
 "_links": {
   "parent": {
     "href": "/api/v2/projects/my-project/environments/my-environment",
     "type": "application/json"
   },
   "self": {
     "href": "/api/v2/projects/my-project/environments/my-environment/experiments/my-experiment",
     "type": "application/json"
   }
 },
 "_id": "12ab3c45de678910fgh12345",
 "description": "An example experiment, used in testing",
 "archivedDate": 1000000,
 "holdoutId": "f3b74309-d581-44e1-8a2b-bb2933b4fe40",
 "currentIteration": {
   "hypothesis": "The new button placement will increase conversion",
   "status": "running",
   "createdAt": 1000000,
   "_id": "12ab3c45de678910fgh12345",
   "startedAt": 1000000,
   "endedAt": 1000000,
   "winningTreatmentId": "122c9f3e-da26-4321-ba68-e0fc02eced58",
   "winningReason": "We ran this iteration for two weeks and the winning variation was clear",
   "canReshuffleTraffic": true,
   "flags": {
     "key": {
       "_links": {
         "self": {
           "href": "/api/v2/flags/my-project/my-flag",
           "type": "application/json"
         }
       },
       "targetingRule": "fallthrough",
       "targetingRuleDescription": "Customers who live in Canada",
       "flagConfigVersion": 12,
       "notInExperimentVariationId": "e432f62b-55f6-49dd-a02f-eb24acf39d05"
     }
   },
   "primaryMetric": {
     "key": "metric-key-123abc",
     "_versionId": "_versionId",
     "name": "My metric",
     "kind": "pageview",
     "_links": {
       "self": {
         "href": "/api/v2/metrics/my-project/my-metric",
         "type": "application/json"
       }
     },
     "isGroup": true,
     "isNumeric": true,
     "metrics": [
       {
         "key": "metric-key-123abc",
         "name": "Example metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "_versionId": "version-id-123abc",
         "isNumeric": true,
         "nameInGroup": "Step 1"
       }
     ]
   },
   "primarySingleMetric": {
     "key": "metric-key-123abc",
     "name": "Example metric",
     "kind": "pageview",
     "_links": {
       "self": {
         "href": "/api/v2/metrics/my-project/my-metric",
         "type": "application/json"
       }
     },
     "_versionId": "version-id-123abc",
     "isNumeric": true,
     "unitAggregationType": "sum"
   },
   "primaryFunnel": {
     "key": "metric-group-key-123abc",
     "name": "My metric group",
     "kind": "funnel",
     "_links": {
       "parent": {
         "href": "/api/v2/projects/my-project",
         "type": "application/json"
       },
       "self": {
         "href": "/api/v2/projects/my-project/metric-groups/my-metric-group",
         "type": "application/json"
       }
     },
     "metrics": [
       {
         "key": "metric-key-123abc",
         "name": "Example metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "_versionId": "version-id-123abc",
         "isNumeric": true,
         "nameInGroup": "Step 1"
       }
     ]
   },
   "randomizationUnit": "user",
   "attributes": [
     "attributes"
   ],
   "treatments": [
     {
       "name": "Treatment 1",
       "allocationPercent": "10",
       "_id": "122c9f3e-da26-4321-ba68-e0fc02eced58",
       "baseline": true
     }
   ],
   "metrics": [
     {
       "key": "metric-key-123abc",
       "_versionId": "_versionId",
       "name": "My metric",
       "kind": "pageview",
       "_links": {
         "self": {
           "href": "/api/v2/metrics/my-project/my-metric",
           "type": "application/json"
         }
       },
       "isGroup": true,
       "isNumeric": true,
       "metrics": [
         {
           "key": "metric-key-123abc",
           "name": "Example metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "_versionId": "version-id-123abc",
           "isNumeric": true,
           "nameInGroup": "Step 1"
         }
       ]
     }
   ],
   "layerSnapshot": {
     "key": "checkout-flow",
     "name": "Checkout Flow",
     "reservationPercent": 10,
     "otherReservationPercent": 70
   },
   "secondaryMetrics": [
     {
       "key": "metric-key-123abc",
       "name": "Example metric",
       "kind": "pageview",
       "_links": {
         "self": {
           "href": "/api/v2/metrics/my-project/my-metric",
           "type": "application/json"
         }
       },
       "_versionId": "version-id-123abc",
       "isNumeric": true
     }
   ]
 },
 "draftIteration": {
   "hypothesis": "The new button placement will increase conversion",
   "status": "running",
   "createdAt": 1000000,
   "_id": "12ab3c45de678910fgh12345",
   "startedAt": 1000000,
   "endedAt": 1000000,
   "winningTreatmentId": "122c9f3e-da26-4321-ba68-e0fc02eced58",
   "winningReason": "We ran this iteration for two weeks and the winning variation was clear",
   "canReshuffleTraffic": true,
   "flags": {
     "key": {
       "_links": {
         "self": {
           "href": "/api/v2/flags/my-project/my-flag",
           "type": "application/json"
         }
       },
       "targetingRule": "fallthrough",
       "targetingRuleDescription": "Customers who live in Canada",
       "flagConfigVersion": 12,
       "notInExperimentVariationId": "e432f62b-55f6-49dd-a02f-eb24acf39d05"
     }
   },
   "primaryMetric": {
     "key": "metric-key-123abc",
     "_versionId": "_versionId",
     "name": "My metric",
     "kind": "pageview",
     "_links": {
       "self": {
         "href": "/api/v2/metrics/my-project/my-metric",
         "type": "application/json"
       }
     },
     "isGroup": true,
     "isNumeric": true,
     "metrics": [
       {
         "key": "metric-key-123abc",
         "name": "Example metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "_versionId": "version-id-123abc",
         "isNumeric": true,
         "nameInGroup": "Step 1"
       }
     ]
   },
   "primarySingleMetric": {
     "key": "metric-key-123abc",
     "name": "Example metric",
     "kind": "pageview",
     "_links": {
       "self": {
         "href": "/api/v2/metrics/my-project/my-metric",
         "type": "application/json"
       }
     },
     "_versionId": "version-id-123abc",
     "isNumeric": true,
     "unitAggregationType": "sum"
   },
   "primaryFunnel": {
     "key": "metric-group-key-123abc",
     "name": "My metric group",
     "kind": "funnel",
     "_links": {
       "parent": {
         "href": "/api/v2/projects/my-project",
         "type": "application/json"
       },
       "self": {
         "href": "/api/v2/projects/my-project/metric-groups/my-metric-group",
         "type": "application/json"
       }
     },
     "metrics": [
       {
         "key": "metric-key-123abc",
         "name": "Example metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "_versionId": "version-id-123abc",
         "isNumeric": true,
         "nameInGroup": "Step 1"
       }
     ]
   },
   "randomizationUnit": "user",
   "attributes": [
     "attributes"
   ],
   "treatments": [
     {
       "name": "Treatment 1",
       "allocationPercent": "10",
       "_id": "122c9f3e-da26-4321-ba68-e0fc02eced58",
       "baseline": true
     }
   ],
   "metrics": [
     {
       "key": "metric-key-123abc",
       "_versionId": "_versionId",
       "name": "My metric",
       "kind": "pageview",
       "_links": {
         "self": {
           "href": "/api/v2/metrics/my-project/my-metric",
           "type": "application/json"
         }
       },
       "isGroup": true,
       "isNumeric": true,
       "metrics": [
         {
           "key": "metric-key-123abc",
           "name": "Example metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "_versionId": "version-id-123abc",
           "isNumeric": true,
           "nameInGroup": "Step 1"
         }
       ]
     }
   ],
   "layerSnapshot": {
     "key": "checkout-flow",
     "name": "Checkout Flow",
     "reservationPercent": 10,
     "otherReservationPercent": 70
   },
   "secondaryMetrics": [
     {
       "key": "metric-key-123abc",
       "name": "Example metric",
       "kind": "pageview",
       "_links": {
         "self": {
           "href": "/api/v2/metrics/my-project/my-metric",
           "type": "application/json"
         }
       },
       "_versionId": "version-id-123abc",
       "isNumeric": true
     }
   ]
 },
 "previousIterations": [
   {
     "hypothesis": "The new button placement will increase conversion",
     "status": "running",
     "createdAt": 1000000,
     "_id": "12ab3c45de678910fgh12345",
     "startedAt": 1000000,
     "endedAt": 1000000,
     "winningTreatmentId": "122c9f3e-da26-4321-ba68-e0fc02eced58",
     "winningReason": "We ran this iteration for two weeks and the winning variation was clear",
     "canReshuffleTraffic": true,
     "flags": {
       "key": {
         "_links": {
           "self": {
             "href": "/api/v2/flags/my-project/my-flag",
             "type": "application/json"
           }
         },
         "targetingRule": "fallthrough",
         "targetingRuleDescription": "Customers who live in Canada",
         "flagConfigVersion": 12,
         "notInExperimentVariationId": "e432f62b-55f6-49dd-a02f-eb24acf39d05"
       }
     },
     "primaryMetric": {
       "key": "metric-key-123abc",
       "_versionId": "_versionId",
       "name": "My metric",
       "kind": "pageview",
       "_links": {
         "self": {
           "href": "/api/v2/metrics/my-project/my-metric",
           "type": "application/json"
         }
       },
       "isGroup": true,
       "isNumeric": true,
       "metrics": [
         {
           "key": "metric-key-123abc",
           "name": "Example metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "_versionId": "version-id-123abc",
           "isNumeric": true,
           "nameInGroup": "Step 1"
         }
       ]
     },
     "primarySingleMetric": {
       "key": "metric-key-123abc",
       "name": "Example metric",
       "kind": "pageview",
       "_links": {
         "self": {
           "href": "/api/v2/metrics/my-project/my-metric",
           "type": "application/json"
         }
       },
       "_versionId": "version-id-123abc",
       "isNumeric": true
     },
     "primaryFunnel": {
       "key": "metric-group-key-123abc",
       "name": "My metric group",
       "kind": "funnel",
       "_links": {
         "parent": {
           "href": "/api/v2/projects/my-project",
           "type": "application/json"
         },
         "self": {
           "href": "/api/v2/projects/my-project/metric-groups/my-metric-group",
           "type": "application/json"
         }
       },
       "metrics": [
         {
           "key": "metric-key-123abc",
           "name": "Example metric",
           "kind": "pageview",
           "_links": {
             "self": {
               "href": "/api/v2/metrics/my-project/my-metric",
               "type": "application/json"
             }
           },
           "_versionId": "version-id-123abc",
           "isNumeric": true,
           "nameInGroup": "Step 1"
         }
       ]
     },
     "randomizationUnit": "user",
     "attributes": [
       "attributes"
     ],
     "treatments": [
       {
         "name": "Treatment 1",
         "allocationPercent": "10",
         "_id": "122c9f3e-da26-4321-ba68-e0fc02eced58",
         "baseline": true
       }
     ],
     "metrics": [
       {
         "key": "metric-key-123abc",
         "_versionId": "_versionId",
         "name": "My metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "isGroup": true,
         "isNumeric": true,
         "metrics": [
           {
             "key": "metric-key-123abc",
             "name": "Example metric",
             "kind": "pageview",
             "_links": {
               "self": {
                 "href": "/api/v2/metrics/my-project/my-metric",
                 "type": "application/json"
               }
             },
             "_versionId": "version-id-123abc",
             "isNumeric": true,
             "nameInGroup": "Step 1"
           }
         ]
       }
     ],
     "layerSnapshot": {
       "key": "checkout-flow",
       "name": "Checkout Flow",
       "reservationPercent": 10,
       "otherReservationPercent": 70
     },
     "secondaryMetrics": [
       {
         "key": "metric-key-123abc",
         "name": "Example metric",
         "kind": "pageview",
         "_links": {
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "_versionId": "version-id-123abc",
         "isNumeric": true
       }
     ]
   }
 ]
}

Update an experiment. Updating an experiment uses the semantic patch format.
To make a semantic patch request, you must append domain-model=launchdarkly.semanticpatch to your Content-Type header. To learn more, read Updates using semantic patch.
Instructions
Semantic patch requests support the following kind instructions for updating experiments.
updateName
Updates the experiment name.
Parameters
value: The new name.
Here’s an example:
{
 "instructions": [{
   "kind": "updateName",
   "value": "Example updated experiment name"
 }]
}

updateDescription
Updates the experiment description.
Parameters
value: The new description.
Here’s an example:
{
 "instructions": [{
   "kind": "updateDescription",
   "value": "Example updated description"
 }]
}

startIteration
Starts a new iteration for this experiment. You must create a new iteration before calling this instruction.
An iteration may not be started until it meets the following criteria:
Its associated flag is toggled on and is not archived
Its randomizationUnit is set
At least one of its treatments has a non-zero allocationPercent
Parameters
changeJustification: The reason for starting a new iteration. Required when you call startIteration on an already running experiment, otherwise optional.
Here’s an example:
{
 "instructions": [{
   "kind": "startIteration",
   "changeJustification": "It's time to start a new iteration"
 }]
}

stopIteration
Stops the current iteration for this experiment.
Parameters
winningTreatmentId: The ID of the winning treatment. Treatment IDs are returned as part of the Get experiment response. They are the _id of each element in the treatments array.
winningReason: The reason for the winner
Here’s an example:
{
 "instructions": [{
   "kind": "stopIteration",
   "winningTreatmentId": "3a548ec2-72ac-4e59-8518-5c24f5609ccf",
   "winningReason": "Example reason to stop the iteration"
 }]
}

archiveExperiment
Archives this experiment. Archived experiments are hidden by default in the LaunchDarkly user interface. You cannot start new iterations for archived experiments.
Here’s an example:
{
 "instructions": [{ "kind": "archiveExperiment" }]
}

restoreExperiment
Restores an archived experiment. After restoring an experiment, you can start new iterations for it again.
Here’s an example:
{
 "instructions": [{ "kind": "restoreExperiment" }]
}

Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
experimentKeystringRequired
The experiment key
Headers
AuthorizationstringRequired
Request
This endpoint expects an object.
instructionslist of maps from strings to anyRequired
The instructions to perform when updating. This should be an array with objects that look like <code>{“kind”: “update_action”}</code>. Some instructions also require a <code>value</code> field in the array element.
commentstringOptional
Optional comment describing the update
Response
Experiment response
keystring
The experiment key
namestring
The experiment name
_maintainerIdstring
The ID of the member who maintains this experiment.
_creationDatelong
Timestamp of when the experiment was created
environmentKeystring
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
_idstring or null
The experiment ID
descriptionstring or null
The experiment description
archivedDatelong or null
Timestamp of when the experiment was archived
holdoutIdstring or null
The holdout ID
currentIterationobject or null
Details on the current iteration
Show 19 properties
draftIterationobject or null
Details on the current iteration. This iteration may be already started, or may still be a draft.
Show 19 properties
previousIterationslist of objects or null
Details on the previous iterations for this experiment.
Show 19 properties
Errors
400
Patch Experiment Request Bad Request Error
401
Patch Experiment Request Unauthorized Error
403
Patch Experiment Request Forbidden Error
404
Patch Experiment Request Not Found Error
409
Patch Experiment Request Conflict Error
429
Patch Experiment Request Too Many Requests Error
Update experimentation settings
PUT
https://app.launchdarkly.com/api/v2/projects/:projectKey/experimentation-settings
PUT
/api/v2/projects/:projectKey/experimentation-settings
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/experimentation-settings';
const options = {
 method: 'PUT',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"randomizationUnits":[{"randomizationUnit":"user","standardRandomizationUnit":"guest"}]}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Updated
{
 "_projectId": "12345abcde67890fghij",
 "_projectKey": "project-key-123abc",
 "randomizationUnits": [
   {
     "randomizationUnit": "user",
     "standardRandomizationUnit": "user",
     "default": true,
     "_hidden": true,
     "_displayName": "User"
   }
 ],
 "_creationDate": 1000000,
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 }
}

Update experimentation settings for the given project
Path parameters
projectKeystringRequired
The project key
Headers
AuthorizationstringRequired
Request
This endpoint expects an object.
randomizationUnitslist of objectsRequired
An array of randomization units allowed for this project.
Show 3 properties
Response
Experimentation settings response
_projectIdstring or null
The project ID
_projectKeystring or null
The project key
randomizationUnitslist of objects or null
An array of the randomization units in this project
Show 5 properties
_creationDatelong or null
Timestamp of when the experiment was created
_linksmap from strings to objects or null
The location and content type of related resources
Show 2 properties
Errors
400
Put Experimentation Settings Request Bad Request Error
401
Put Experimentation Settings Request Unauthorized Error
403
Put Experimentation Settings Request Forbidden Error
404
Put Experimentation Settings Request Not Found Error
405
Put Experimentation Settings Request Method Not Allowed Error
429
Put Experimentation Settings Request Too Many Requests Error
Feature flags
The feature flags API allows you to list, create, and modify feature flags and their targeting. For example, you can control percentage rollouts, target specific contexts, or even toggle off a feature flag programmatically.
Sample feature flag representation
Every feature flag has a set of top-level attributes, as well as an environments map containing the flag rollout and targeting rules specific to each environment. To learn more, read Using feature flags.
Click to expand an example of a complete feature flag representation

















































































































































































































































































































Anatomy of a feature flag
This section describes the sample feature flag representation in more detail.
Top-level attributes
Most of the top-level attributes have a straightforward interpretation, for example name and description.
The variations array represents the different variation values that a feature flag has. For a boolean flag, there are two variations: true and false. Multivariate flags have more variation values, and those values could be any JSON type: numbers, strings, objects, or arrays. In targeting rules, the variations are referred to by their index into this array.
To update these attributes, read Update feature flag, especially the instructions for updating flag settings.
Per-environment configurations
Each entry in the environments map contains a JSON object that represents the environment-specific flag configuration data available in the flag’s targeting page. To learn more, read Targeting with flags.
To update per-environment information for a flag, read Update feature flag, especially the instructions for turning flags on and off and working with targeting and variations.
Individual context targets
The targets and contextTargets arrays in the per-environment configuration data correspond to the individual context targeting on the flag’s targeting page. To learn more, read Individual targeting.
Each object in the targets and contextTargets arrays represents a list of context keys assigned to a particular variation. The targets array includes contexts with contextKind of “user” and the contextTargets array includes contexts with context kinds other than “user.”
For example:
{
 ...
 "environments" : {
   "production" : {
     ...
     "targets": [
       {
         "values": ["user-key-123abc"],
         "variation": 0,
         "contextKind": "user"
       }
     ],
     "contextTargets": [
       {
         "values": ["org-key-123abc"],
         "variation": 0,
         "contextKind": "organization"
       }
     ]
   }
 }
}

The targets array means that any user context instance with the key user-key-123abc receives the first variation listed in the variations array. The contextTargets array means that any organization context with the key org-key-123abc receives the first variation listed in the variations array. Recall that the variations are stored at the top level of the flag JSON in an array, and the per-environment configuration rules point to indexes into this array. If this is a boolean flag, both contexts are receiving the true variation.
Targeting rules
The rules array corresponds to the rules section of the flag’s targeting page. This is where you can express complex rules on attributes with conditions and operators. For example, you might create a rule that specifies “roll out the true variation to 80% of contexts whose email address ends with gmail.com”. To learn more, read Targeting rules.
The fallthrough rule
The fallthrough object is a special rule that contains no conditions. It is the rollout strategy that is applied when none of the individual or custom targeting rules match. In the LaunchDarkly UI, it is called the “Default rule.”
The off variation
The off variation represents the variation to serve if the feature flag targeting is turned off, meaning the on attribute is false. For boolean flags, this is usually false. For multivariate flags, set the off variation to whatever variation represents the control or baseline behavior for your application. If you don’t set the off variation, LaunchDarkly will serve the fallback value defined in your code.
Percentage rollouts
When you work with targeting rules and with the default rule, you can specify either a single variation or a percentage rollout. The weight attribute defines the percentage rollout for each variation. Weights range from 0 (a 0% rollout) to 100000 (a 100% rollout). The weights are scaled by a factor of 1000 so that fractions of a percent can be represented without using floating-point. For example, a weight of 60000 means that 60% of contexts will receive that variation. The sum of weights across all variations should be 100%.
Create a feature flag
POST
https://app.launchdarkly.com/api/v2/flags/:projectKey
POST
/api/v2/flags/:projectKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/flags/projectKey';
const options = {
 method: 'POST',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"name":"My Flag","key":"flag-key-123abc","clientSideAvailability":{"usingEnvironmentId":true,"usingMobileKey":true}}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Created
{
 "name": "My Flag",
 "kind": "boolean",
 "key": "flag-key-123abc",
 "_version": 1,
 "creationDate": 1000000,
 "variations": [
   {
     "value": true,
     "_id": "e432f62b-55f6-49dd-a02f-eb24acf39d05",
     "description": "description",
     "name": "name"
   },
   {
     "value": false,
     "_id": "a00bf58d-d252-476c-b915-15a74becacb4",
     "description": "description",
     "name": "name"
   }
 ],
 "temporary": true,
 "tags": [
   "example-tag"
 ],
 "_links": {
   "parent": {
     "href": "/api/v2/flags/my-project",
     "type": "application/json"
   },
   "self": {
     "href": "/api/v2/flags/my-project/my-flag",
     "type": "application/json"
   }
 },
 "experiments": {
   "baselineIdx": 1,
   "items": [
     {
       "metricKey": "my-metric",
       "_metric": {
         "_id": "5902deadbeef667524a01290",
         "_versionId": "version-id-123abc",
         "key": "metric-key-123abc",
         "name": "My metric",
         "kind": "pageview",
         "_links": {
           "parent": {
             "href": "/api/v2/metrics/my-project",
             "type": "application/json"
           },
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "tags": [
           "tags"
         ],
         "_creationDate": 1000000,
         "experimentCount": 0,
         "metricGroupCount": 0,
         "_attachedFlagCount": 0,
         "maintainerId": "569fdeadbeef1644facecafe",
         "_maintainer": {
           "_links": {
             "self": {
               "href": "/api/v2/members/569f183514f4432160000007",
               "type": "application/json"
             }
           },
           "_id": "569f183514f4432160000007",
           "role": "admin",
           "email": "ariel@acme.com",
           "firstName": "Ariel",
           "lastName": "Flores"
         },
         "category": "Error monitoring",
         "isNumeric": true,
         "eventKey": "Order placed",
         "filters": {
           "type": "group",
           "op": "op",
           "values": [
             "JP"
           ],
           "negate": false,
           "attribute": "country",
           "contextKind": "user"
         },
         "percentileValue": 95
       }
     }
   ]
 },
 "customProperties": {
   "key": {
     "name": "Jira issues",
     "value": [
       "is-123",
       "is-456"
     ]
   }
 },
 "archived": false,
 "description": "This flag controls the example widgets",
 "clientSideAvailability": {
   "usingMobileKey": true,
   "usingEnvironmentId": true
 },
 "maintainerId": "569f183514f4432160000007",
 "_maintainer": {
   "_links": {
     "self": {
       "href": "/api/v2/members/569f183514f4432160000007",
       "type": "application/json"
     }
   },
   "_id": "569f183514f4432160000007",
   "role": "admin",
   "email": "ariel@acme.com",
   "firstName": "Ariel",
   "lastName": "Flores"
 },
 "maintainerTeamKey": "team-1",
 "_maintainerTeam": {
   "key": "team-key-123abc",
   "name": "Example team",
   "_links": {
     "parent": {
       "href": "/api/v2/teams",
       "type": "application/json"
     },
     "roles": {
       "href": "/api/v2/teams/example-team/roles",
       "type": "application/json"
     },
     "self": {
       "href": "/api/v2/teams/example-team",
       "type": "application/json"
     }
   }
 },
 "archivedDate": 1000000,
 "deprecated": false,
 "deprecatedDate": 1000000,
 "defaults": {
   "onVariation": 0,
   "offVariation": 1
 },
 "_purpose": "_purpose",
 "migrationSettings": {
   "contextKind": "device",
   "stageCount": 6
 },
 "environments": {
   "my-environment": {
     "on": false,
     "archived": false,
     "salt": "61eddeadbeef4da1facecafe3a60a397",
     "sel": "810edeadbeef4844facecafe438f2999492",
     "lastModified": 1627071171347,
     "version": 1,
     "_site": {
       "href": "/default/my-environment/features/client-side-flag",
       "type": "text/html"
     },
     "_environmentName": "My Environment",
     "trackEvents": false,
     "trackEventsFallthrough": false,
     "targets": [
       {
         "values": [
           "user-key-123abc"
         ],
         "variation": 0,
         "contextKind": "user"
       }
     ],
     "contextTargets": [
       {
         "values": [
           "device-key-123abc"
         ],
         "variation": 0,
         "contextKind": "device"
       }
     ],
     "rules": [
       {
         "clauses": [
           {
             "attribute": "attribute",
             "op": "op",
             "values": [],
             "negate": true
           }
         ],
         "trackEvents": true
       }
     ],
     "fallthrough": {
       "variation": 0
     },
     "offVariation": 1,
     "prerequisites": [
       {
         "key": "key",
         "variation": 1
       }
     ],
     "_access": {
       "denied": [
         {
           "action": "action",
           "reason": {
             "effect": "allow"
           }
         }
       ],
       "allowed": [
         {
           "action": "action",
           "reason": {
             "effect": "allow"
           }
         }
       ]
     },
     "_debugEventsUntilDate": 1000000,
     "_summary": {
       "variations": {
         "0": {
           "rules": 0,
           "nullRules": 0,
           "targets": 1,
           "contextTargets": 1,
           "isFallthrough": true
         },
         "1": {
           "rules": 0,
           "nullRules": 0,
           "targets": 0,
           "contextTargets": 1,
           "isOff": true
         }
       },
       "prerequisites": 0
     }
   }
 },
 "includeInSnippet": true,
 "goalIds": [
   "goalIds"
 ]
}

Create a feature flag with the given name, key, and variations.
Click to expand instructions for creating a migration flag

















Path parameters
projectKeystringRequired
The project key
Headers
AuthorizationstringRequired
Query parameters
clonestringOptional
The key of the feature flag to be cloned. The key identifies the flag in your code. For example, setting clone=flagKey copies the full targeting configuration for all environments, including on/off state, from the original flag to the new flag.
Request
This endpoint expects an object.
namestringRequired
A human-friendly name for the feature flag
keystringRequired
A unique key used to reference the flag in your code
descriptionstringOptional
Description of the feature flag. Defaults to an empty string.
clientSideAvailabilityobjectOptional
Which type of client-side SDKs the feature flag is available to
Hide 2 properties
usingEnvironmentIdbooleanRequired
Whether to enable availability for client-side SDKs. Defaults to false.
usingMobileKeybooleanRequired
Whether to enable availability for mobile SDKs. Defaults to true.
variationslist of objectsOptional
An array of possible variations for the flag. The variation values must be unique. If omitted, two boolean variations of true and false will be used.
Hide 4 properties
valueanyRequired
_idstringOptional
The ID of the variation. Leave empty when you are creating a flag.
descriptionstringOptional
Description of the variation. Defaults to an empty string, but is omitted from the response if not set.
namestringOptional
A human-friendly name for the variation. Defaults to an empty string, but is omitted from the response if not set.
temporarybooleanOptional
Whether the flag is a temporary flag. Defaults to true.
tagslist of stringsOptional
Tags for the feature flag. Defaults to an empty array.
customPropertiesmap from strings to objectsOptional
Metadata attached to the feature flag, in the form of the property key associated with a name and array of values for the metadata to associate with this flag. Typically used to store data related to an integration.
Show 2 properties
defaultsobjectOptional
The indices, from the array of variations, for the variations to serve by default when targeting is on and when targeting is off. These variations will be used for this flag in new environments. If omitted, the first and last variation will be used.
Show 2 properties
purposeenumOptional
Purpose of the flag
Allowed values:migrationholdout
migrationSettingsobjectOptional
Settings relevant to flags where purpose is migration
Hide 2 properties
stageCountintegerRequired
contextKindstringOptional
Context kind for a migration with 6 stages, where data is being moved
maintainerIdstringOptional
The ID of the member who maintains this feature flag
maintainerTeamKeystringOptional
The key of the team that maintains this feature flag
initialPrerequisiteslist of objectsOptional
Initial set of prerequisite flags for all environments
Hide 2 properties
keystringRequired
Flag key of the prerequisite flag
variationIdstringRequired
ID of a variation of the prerequisite flag
isFlagOnbooleanOptional
Whether to automatically turn the flag on across all environments at creation. Defaults to false.
includeInSnippetbooleanOptionalDeprecated
Deprecated, use clientSideAvailability. Whether this flag should be made available to the client-side JavaScript SDK. Defaults to false.
Response
Global flag response
namestring
A human-friendly name for the feature flag
kindenum
Kind of feature flag
Allowed values:booleanmultivariate
keystring
A unique key used to reference the flag in your code
_versioninteger
Version of the feature flag
creationDatelong
Timestamp of flag creation date
variationslist of objects
An array of possible variations for the flag
Show 4 properties
temporaryboolean
Whether the flag is a temporary flag
tagslist of strings
Tags for the feature flag
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
experimentsobject
Experimentation data for the feature flag
Hide 2 properties
baselineIdxinteger
itemslist of objects
Show 4 properties
customPropertiesmap from strings to objects
Metadata attached to the feature flag, in the form of the property key associated with a name and array of values for the metadata to associate with this flag. Typically used to store data related to an integration.
Hide 2 properties
namestring
The name of the custom property of this type.
valuelist of strings
An array of values for the custom property data to associate with this flag.
archivedboolean
Boolean indicating if the feature flag is archived
descriptionstring or null
Description of the feature flag
clientSideAvailabilityobject or null
Which type of client-side SDKs the feature flag is available to
Hide 2 properties
usingMobileKeyboolean or null
usingEnvironmentIdboolean or null
maintainerIdstring or null
Associated maintainerId for the feature flag
_maintainerobject or null
Associated maintainer member info for the feature flag
Hide 6 properties
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
_idstring
The member's ID
rolestring
The member's base role. If the member has no additional roles, this role will be in effect.
emailstring
The member's email address
firstNamestring or null
The member's first name
lastNamestring or null
The member's last name
maintainerTeamKeystring or null
The key of the associated team that maintains this feature flag
_maintainerTeamobject or null
Associated maintainer team info for the feature flag
Hide 3 properties
keystring
The key of the maintainer team
namestring
A human-friendly name for the maintainer team
_linksmap from strings to objects or null
The location and content type of related resources
Show 2 properties
archivedDatelong or null
If archived is true, date of archive
deprecatedboolean or null
Boolean indicating if the feature flag is deprecated
deprecatedDatelong or null
If deprecated is true, date of deprecation
defaultsobject or null
The indices, from the array of variations, for the variations to serve by default when targeting is on and when targeting is off. These variations will be used for this flag in new environments. If omitted, the first and last variation will be used.
Hide 2 properties
onVariationinteger
The index, from the array of variations for this flag, of the variation to serve by default when targeting is on.
offVariationinteger
The index, from the array of variations for this flag, of the variation to serve by default when targeting is off.
_purposestring or null
migrationSettingsobject or null
Migration-related settings for the flag
Hide 2 properties
contextKindstring or null
The context kind targeted by this migration flag. Only applicable for six-stage migrations.
stageCountinteger or null
The number of stages for this migration flag
environmentsmap from strings to objects or null
Details on the environments for this flag. Only returned if the request is filtered by environment, using the filterEnv query parameter.
Hide 21 properties
onboolean
Whether the flag is on
archivedboolean
Boolean indicating if the feature flag is archived
saltstring
selstring
lastModifiedlong
Timestamp of when the flag configuration was most recently modified
versioninteger
Version of the feature flag
_siteobject
Details on how to access the flag configuration in the LaunchDarkly UI
Show 2 properties
_environmentNamestring
The environment name
trackEventsboolean
Whether LaunchDarkly tracks events for the feature flag, for all rules
trackEventsFallthroughboolean
Whether LaunchDarkly tracks events for the feature flag, for the default rule
targetslist of objects or null
An array of the individual targets that will receive a specific variation based on their key. Individual targets with a context kind of 'user' are included here.
Show 3 properties
contextTargetslist of objects or null
An array of the individual targets that will receive a specific variation based on their key. Individual targets with context kinds other than 'user' are included here.
Show 3 properties
ruleslist of objects or null
An array of the rules for how to serve a variation to specific targets based on their attributes
Show 7 properties
fallthroughobject or null
Details on the variation or rollout to serve as part of the flag's default rule
Show 2 properties
offVariationinteger or null
The ID of the variation to serve when the flag is off
prerequisiteslist of objects or null
An array of the prerequisite flags and their variations that are required before this flag takes effect
Show 2 properties
_accessobject or null
Details on the allowed and denied actions for this flag
Show 2 properties
_debugEventsUntilDatelong or null
_summaryobject or null
A summary of the prerequisites and variations for this flag
Show 2 properties
evaluationobject or null
Evaluation information for the flag
Show 1 properties
migrationSettingsobject or null
Migration-related settings for the flag configuration
Show 1 properties
includeInSnippetboolean or nullDeprecated
Deprecated, use clientSideAvailability. Whether this flag should be made available to the client-side JavaScript SDK
goalIdslist of strings or nullDeprecated
Deprecated, use experiments instead
Errors
400
Post Feature Flag Request Bad Request Error
401
Post Feature Flag Request Unauthorized Error
409
Post Feature Flag Request Conflict Error
429
Post Feature Flag Request Too Many Requests Error
Delete feature flag
DELETE
https://app.launchdarkly.com/api/v2/flags/:projectKey/:featureFlagKey
DELETE
/api/v2/flags/:projectKey/:featureFlagKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/flags/projectKey/featureFlagKey';
const options = {method: 'DELETE', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
No Content
{
 "key": "value"
}

Delete a feature flag in all environments. Use with caution: only delete feature flags your application no longer uses.
Path parameters
projectKeystringRequired
The project key
featureFlagKeystringRequired
The feature flag key. The key identifies the flag in your code.
Headers
AuthorizationstringRequired
Response
Action succeeded
Errors
401
Delete Feature Flag Request Unauthorized Error
404
Delete Feature Flag Request Not Found Error
409
Delete Feature Flag Request Conflict Error
429
Delete Feature Flag Request Too Many Requests Error
Was this page helpful?
Yes

Get expiring context targets for feature flag
GET
https://app.launchdarkly.com/api/v2/flags/:projectKey/:featureFlagKey/expiring-targets/:environmentKey
GET
/api/v2/flags/:projectKey/:featureFlagKey/expiring-targets/:environmentKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/flags/projectKey/featureFlagKey/expiring-targets/environmentKey';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "items": [
   {
     "_id": "12ab3c45de678910abc12345",
     "_version": 1,
     "expirationDate": 1000000,
     "contextKind": "user",
     "contextKey": "context-key-123abc",
     "_resourceId": {
       "environmentKey": "environment-key-123abc",
       "key": "segment-key-123abc",
       "projectKey": "project-key-123abc"
     },
     "targetType": "included",
     "variationId": "cc4332e2-bd4d-4fe0-b509-dfd2caf8dd73"
   }
 ],
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 }
}

Get a list of context targets on a feature flag that are scheduled for removal.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
featureFlagKeystringRequired
The feature flag key
Headers
AuthorizationstringRequired
Response
Expiring target response
itemslist of objects
A list of expiring targets
Show 8 properties
_linksmap from strings to objects or null
The location and content type of related resources
Show 2 properties
Errors
401
Get Expiring Context Targets Request Unauthorized Error
403
Get Expiring Context Targets Request Forbidden Error
404
Get Expiring Context Targets Request Not Found Error
429
Get Expiring Context Targets Request Too Many Requests Error
Get expiring user targets for feature flag
GET
https://app.launchdarkly.com/api/v2/flags/:projectKey/:featureFlagKey/expiring-user-targets/:environmentKey
GET
/api/v2/flags/:projectKey/:featureFlagKey/expiring-user-targets/:environmentKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/flags/projectKey/featureFlagKey/expiring-user-targets/environmentKey';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "items": [
   {
     "_id": "12ab3c45de678910fgh12345",
     "_version": 1,
     "expirationDate": 1000000,
     "userKey": "example-user-key",
     "_resourceId": {},
     "targetType": "included",
     "variationId": "ce67d625-a8b9-4fb5-a344-ab909d9d4f4d"
   }
 ],
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 }
}

Contexts are now available
After you have upgraded your LaunchDarkly SDK to use contexts instead of users, you should use Get expiring context targets for feature flag instead of this endpoint. To learn more, read Contexts.
Get a list of user targets on a feature flag that are scheduled for removal.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
featureFlagKeystringRequired
The feature flag key
Headers
AuthorizationstringRequired
Response
Expiring user target response
itemslist of objects
An array of expiring user targets
Hide 7 properties
_idstring
The ID of this expiring user target
_versioninteger
The version of this expiring user target
expirationDatelong
A timestamp for when the user target expires
userKeystring
A unique key used to represent the user
_resourceIdobject
Details on the resource from which the user is expiring
Show 5 properties
targetTypestring or null
A segment's target type. Included when expiring user targets are updated on a segment.
variationIdstring or null
A unique key used to represent the flag variation. Included when expiring user targets are updated on a feature flag.
_linksmap from strings to objects or null
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
Errors
401
Get Expiring User Targets Request Unauthorized Error
403
Get Expiring User Targets Request Forbidden Error
404
Get Expiring User Targets Request Not Found Error
429
Get Expiring User Targets Request Too Many Requests Error
Get feature flag
GET
https://app.launchdarkly.com/api/v2/flags/:projectKey/:featureFlagKey
GET
/api/v2/flags/:projectKey/:featureFlagKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/flags/projectKey/featureFlagKey';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "name": "My Flag",
 "kind": "boolean",
 "key": "flag-key-123abc",
 "_version": 1,
 "creationDate": 1000000,
 "variations": [
   {
     "value": true,
     "_id": "e432f62b-55f6-49dd-a02f-eb24acf39d05",
     "description": "description",
     "name": "name"
   },
   {
     "value": false,
     "_id": "a00bf58d-d252-476c-b915-15a74becacb4",
     "description": "description",
     "name": "name"
   }
 ],
 "temporary": true,
 "tags": [
   "example-tag"
 ],
 "_links": {
   "parent": {
     "href": "/api/v2/flags/my-project",
     "type": "application/json"
   },
   "self": {
     "href": "/api/v2/flags/my-project/my-flag",
     "type": "application/json"
   }
 },
 "experiments": {
   "baselineIdx": 1,
   "items": [
     {
       "metricKey": "my-metric",
       "_metric": {
         "_id": "5902deadbeef667524a01290",
         "_versionId": "version-id-123abc",
         "key": "metric-key-123abc",
         "name": "My metric",
         "kind": "pageview",
         "_links": {
           "parent": {
             "href": "/api/v2/metrics/my-project",
             "type": "application/json"
           },
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "tags": [
           "tags"
         ],
         "_creationDate": 1000000,
         "experimentCount": 0,
         "metricGroupCount": 0,
         "_attachedFlagCount": 0,
         "maintainerId": "569fdeadbeef1644facecafe",
         "_maintainer": {
           "_links": {
             "self": {
               "href": "/api/v2/members/569f183514f4432160000007",
               "type": "application/json"
             }
           },
           "_id": "569f183514f4432160000007",
           "role": "admin",
           "email": "ariel@acme.com",
           "firstName": "Ariel",
           "lastName": "Flores"
         },
         "category": "Error monitoring",
         "isNumeric": true,
         "eventKey": "Order placed",
         "filters": {
           "type": "group",
           "op": "op",
           "values": [
             "JP"
           ],
           "negate": false,
           "attribute": "country",
           "contextKind": "user"
         },
         "percentileValue": 95
       }
     }
   ]
 },
 "customProperties": {
   "key": {
     "name": "Jira issues",
     "value": [
       "is-123",
       "is-456"
     ]
   }
 },
 "archived": false,
 "description": "This flag controls the example widgets",
 "clientSideAvailability": {
   "usingMobileKey": true,
   "usingEnvironmentId": true
 },
 "maintainerId": "569f183514f4432160000007",
 "_maintainer": {
   "_links": {
     "self": {
       "href": "/api/v2/members/569f183514f4432160000007",
       "type": "application/json"
     }
   },
   "_id": "569f183514f4432160000007",
   "role": "admin",
   "email": "ariel@acme.com",
   "firstName": "Ariel",
   "lastName": "Flores"
 },
 "maintainerTeamKey": "team-1",
 "_maintainerTeam": {
   "key": "team-key-123abc",
   "name": "Example team",
   "_links": {
     "parent": {
       "href": "/api/v2/teams",
       "type": "application/json"
     },
     "roles": {
       "href": "/api/v2/teams/example-team/roles",
       "type": "application/json"
     },
     "self": {
       "href": "/api/v2/teams/example-team",
       "type": "application/json"
     }
   }
 },
 "archivedDate": 1000000,
 "deprecated": false,
 "deprecatedDate": 1000000,
 "defaults": {
   "onVariation": 0,
   "offVariation": 1
 },
 "_purpose": "_purpose",
 "migrationSettings": {
   "contextKind": "device",
   "stageCount": 6
 },
 "environments": {
   "my-environment": {
     "on": false,
     "archived": false,
     "salt": "61eddeadbeef4da1facecafe3a60a397",
     "sel": "810edeadbeef4844facecafe438f2999492",
     "lastModified": 1627071171347,
     "version": 1,
     "_site": {
       "href": "/default/my-environment/features/client-side-flag",
       "type": "text/html"
     },
     "_environmentName": "My Environment",
     "trackEvents": false,
     "trackEventsFallthrough": false,
     "targets": [
       {
         "values": [
           "user-key-123abc"
         ],
         "variation": 0,
         "contextKind": "user"
       }
     ],
     "contextTargets": [
       {
         "values": [
           "device-key-123abc"
         ],
         "variation": 0,
         "contextKind": "device"
       }
     ],
     "rules": [
       {
         "clauses": [
           {
             "attribute": "attribute",
             "op": "op",
             "values": [],
             "negate": true
           }
         ],
         "trackEvents": true
       }
     ],
     "fallthrough": {
       "variation": 0
     },
     "offVariation": 1,
     "prerequisites": [
       {
         "key": "key",
         "variation": 1
       }
     ],
     "_access": {
       "denied": [
         {
           "action": "action",
           "reason": {
             "effect": "allow"
           }
         }
       ],
       "allowed": [
         {
           "action": "action",
           "reason": {
             "effect": "allow"
           }
         }
       ]
     },
     "_debugEventsUntilDate": 1000000,
     "_summary": {
       "variations": {
         "0": {
           "rules": 0,
           "nullRules": 0,
           "targets": 1,
           "contextTargets": 1,
           "isFallthrough": true
         },
         "1": {
           "rules": 0,
           "nullRules": 0,
           "targets": 0,
           "contextTargets": 1,
           "isOff": true
         }
       },
       "prerequisites": 0
     }
   }
 },
 "includeInSnippet": true,
 "goalIds": [
   "goalIds"
 ]
}

Get a single feature flag by key. By default, this returns the configurations for all environments. You can filter environments with the env query parameter. For example, setting env=production restricts the returned configurations to just the production environment.
Recommended use
This endpoint can return a large amount of information. Specifying one or multiple environments with the env parameter can decrease response time and overall payload size. We recommend using this parameter to return only the environments relevant to your query.
Expanding response
LaunchDarkly supports the expand query param to include additional fields in the response, with the following fields:
evaluation includes evaluation information within returned environments, including which context kinds the flag has been evaluated for in the past 30 days
migrationSettings includes migration settings information within the flag and within returned environments. These settings are only included for migration flags, that is, where purpose is migration.
For example, expand=evaluation includes the evaluation field in the response.
Path parameters
projectKeystringRequired
The project key
featureFlagKeystringRequired
The feature flag key
Headers
AuthorizationstringRequired
Query parameters
envstringOptional
Filter configurations by environment
expandstringOptional
A comma-separated list of fields to expand in the response. Supported fields are explained above.
Response
Global flag response
namestring
A human-friendly name for the feature flag
kindenum
Kind of feature flag
Allowed values:booleanmultivariate
keystring
A unique key used to reference the flag in your code
_versioninteger
Version of the feature flag
creationDatelong
Timestamp of flag creation date
variationslist of objects
An array of possible variations for the flag
Hide 4 properties
valueany
_idstring or null
The ID of the variation. Leave empty when you are creating a flag.
descriptionstring or null
Description of the variation. Defaults to an empty string, but is omitted from the response if not set.
namestring or null
A human-friendly name for the variation. Defaults to an empty string, but is omitted from the response if not set.
temporaryboolean
Whether the flag is a temporary flag
tagslist of strings
Tags for the feature flag
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
experimentsobject
Experimentation data for the feature flag
Hide 2 properties
baselineIdxinteger
itemslist of objects
Show 4 properties
customPropertiesmap from strings to objects
Metadata attached to the feature flag, in the form of the property key associated with a name and array of values for the metadata to associate with this flag. Typically used to store data related to an integration.
Hide 2 properties
namestring
The name of the custom property of this type.
valuelist of strings
An array of values for the custom property data to associate with this flag.
archivedboolean
Boolean indicating if the feature flag is archived
descriptionstring or null
Description of the feature flag
clientSideAvailabilityobject or null
Which type of client-side SDKs the feature flag is available to
Hide 2 properties
usingMobileKeyboolean or null
usingEnvironmentIdboolean or null
maintainerIdstring or null
Associated maintainerId for the feature flag
_maintainerobject or null
Associated maintainer member info for the feature flag
Hide 6 properties
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring
The member's ID
rolestring
The member's base role. If the member has no additional roles, this role will be in effect.
emailstring
The member's email address
firstNamestring or null
The member's first name
lastNamestring or null
The member's last name
maintainerTeamKeystring or null
The key of the associated team that maintains this feature flag
_maintainerTeamobject or null
Associated maintainer team info for the feature flag
Hide 3 properties
keystring
The key of the maintainer team
namestring
A human-friendly name for the maintainer team
_linksmap from strings to objects or null
The location and content type of related resources
Show 2 properties
archivedDatelong or null
If archived is true, date of archive
deprecatedboolean or null
Boolean indicating if the feature flag is deprecated
deprecatedDatelong or null
If deprecated is true, date of deprecation
defaultsobject or null
The indices, from the array of variations, for the variations to serve by default when targeting is on and when targeting is off. These variations will be used for this flag in new environments. If omitted, the first and last variation will be used.
Hide 2 properties
onVariationinteger
The index, from the array of variations for this flag, of the variation to serve by default when targeting is on.
offVariationinteger
The index, from the array of variations for this flag, of the variation to serve by default when targeting is off.
_purposestring or null
migrationSettingsobject or null
Migration-related settings for the flag
Hide 2 properties
contextKindstring or null
The context kind targeted by this migration flag. Only applicable for six-stage migrations.
stageCountinteger or null
The number of stages for this migration flag
environmentsmap from strings to objects or null
Details on the environments for this flag. Only returned if the request is filtered by environment, using the filterEnv query parameter.
Hide 21 properties
onboolean
Whether the flag is on
archivedboolean
Boolean indicating if the feature flag is archived
saltstring
selstring
lastModifiedlong
Timestamp of when the flag configuration was most recently modified
versioninteger
Version of the feature flag
_siteobject
Details on how to access the flag configuration in the LaunchDarkly UI
Show 2 properties
_environmentNamestring
The environment name
trackEventsboolean
Whether LaunchDarkly tracks events for the feature flag, for all rules
trackEventsFallthroughboolean
Whether LaunchDarkly tracks events for the feature flag, for the default rule
targetslist of objects or null
An array of the individual targets that will receive a specific variation based on their key. Individual targets with a context kind of 'user' are included here.
Show 3 properties
contextTargetslist of objects or null
An array of the individual targets that will receive a specific variation based on their key. Individual targets with context kinds other than 'user' are included here.
Show 3 properties
ruleslist of objects or null
An array of the rules for how to serve a variation to specific targets based on their attributes
Show 7 properties
fallthroughobject or null
Details on the variation or rollout to serve as part of the flag's default rule
Show 2 properties
offVariationinteger or null
The ID of the variation to serve when the flag is off
prerequisiteslist of objects or null
An array of the prerequisite flags and their variations that are required before this flag takes effect
Show 2 properties
_accessobject or null
Details on the allowed and denied actions for this flag
Show 2 properties
_debugEventsUntilDatelong or null
_summaryobject or null
A summary of the prerequisites and variations for this flag
Show 2 properties
evaluationobject or null
Evaluation information for the flag
Show 1 properties
migrationSettingsobject or null
Migration-related settings for the flag configuration
Show 1 properties
includeInSnippetboolean or nullDeprecated
Deprecated, use clientSideAvailability. Whether this flag should be made available to the client-side JavaScript SDK
goalIdslist of strings or nullDeprecated
Deprecated, use experiments instead
Errors
401
Get Feature Flag Request Unauthorized Error
403
Get Feature Flag Request Forbidden Error
404
Get Feature Flag Request Not Found Error
429
Get Feature Flag Request Too Many Requests Error
Was this page helpful?
Yes

Get feature flag status
GET
https://app.launchdarkly.com/api/v2/flag-statuses/:projectKey/:environmentKey/:featureFlagKey
GET
/api/v2/flag-statuses/:projectKey/:environmentKey/:featureFlagKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/flag-statuses/projectKey/environmentKey/featureFlagKey';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "name": "new",
 "_links": {
   "parent": {
     "href": "/api/v2/flags/my-project/my-flag",
     "type": "application/json"
   },
   "self": {
     "href": "/api/v2/flag-statuses/my-project/my-flag",
     "type": "application/json"
   }
 },
 "lastRequested": "2020-02-05T18:17:01Z",
 "default": {
   "key": "value"
 }
}

Get the status for a particular feature flag.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
featureFlagKeystringRequired
The feature flag key
Headers
AuthorizationstringRequired
Response
Flag status response
nameenum
Status of the flag
Allowed values:newinactiveactivelaunched
_linksmap from strings to objects
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
lastRequesteddatetime or null
Timestamp of last time flag was requested
defaultany or null
Errors
401
Get Feature Flag Status Request Unauthorized Error
403
Get Feature Flag Status Request Forbidden Error
404
Get Feature Flag Status Request Not Found Error
429
Get Feature Flag Status Request Too Many Requests Error
Was this page helpful?
Yes

Get flag status across environments
GET
https://app.launchdarkly.com/api/v2/flag-status/:projectKey/:featureFlagKey
GET
/api/v2/flag-status/:projectKey/:featureFlagKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/flag-status/projectKey/featureFlagKey';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "environments": {
   "production": {
     "name": "inactive",
     "lastRequested": "2020-02-05T18:17:01Z",
     "default": {
       "key": "value"
     }
   }
 },
 "key": "flag-key-123abc",
 "_links": {
   "parent": {
     "href": "/api/v2/flag-status",
     "type": "application/json"
   },
   "self": {
     "href": "/api/v2/flag-status/my-project/my-flag",
     "type": "application/json"
   }
 }
}

Get the status for a particular feature flag across environments.
Path parameters
projectKeystringRequired
The project key
featureFlagKeystringRequired
The feature flag key
Headers
AuthorizationstringRequired
Query parameters
envstringOptional
Optional environment filter
Response
Flag status across environments response
environmentsmap from strings to objects
Flag status for environment.
Hide 3 properties
nameenum
Status of the flag
Allowed values:newinactiveactivelaunched
lastRequesteddatetime or null
Timestamp of last time flag was requested
defaultany or null
keystring
feature flag key
_linksmap from strings to objects
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
Errors
401
Get Feature Flag Status across Environments Request Unauthorized Error
403
Get Feature Flag Status across Environments Request Forbidden Error
404
Get Feature Flag Status across Environments Request Not Found Error
429
Get Feature Flag Status across Environments Request Too Many Requests Error
Get migration safety issues
POST
https://app.launchdarkly.com/api/v2/projects/:projectKey/flags/:flagKey/environments/:environmentKey/migration-safety-issues
POST
/api/v2/projects/:projectKey/flags/:flagKey/environments/:environmentKey/migration-safety-issues
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/flags/flagKey/environments/environmentKey/migration-safety-issues';
const options = {
 method: 'POST',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"instructions":[{"key":"value"}]}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Successful
[
 {
   "causingRuleId": "causingRuleId",
   "affectedRuleIds": [
     "affectedRuleIds"
   ],
   "issue": "issue",
   "oldSystemAffected": true
 }
]

Returns the migration safety issues that are associated with the POSTed flag patch. The patch must use the semantic patch format for updating feature flags.
Path parameters
projectKeystringRequired
The project key
flagKeystringRequired
The migration flag key
environmentKeystringRequired
The environment key
Headers
AuthorizationstringRequired
Request
This endpoint expects an object.
instructionslist of maps from strings to anyRequired
Semantic patch instructions. The same ones that are valid for flags are valid here.
commentstringOptional
Response
Migration safety issues found
causingRuleIdstring or null
The ID of the rule which caused this issue
affectedRuleIdslist of strings or null
A list of the IDs of the rules which are affected by this issue. fallthrough is a sentinel value for the default rule.
issuestring or null
A description of the issue that causingRuleId has caused for affectedRuleIds.
oldSystemAffectedboolean or null
Whether the changes caused by causingRuleId bring inconsistency to the old system
Errors
400
Post Migration Safety Issues Request Bad Request Error
401
Post Migration Safety Issues Request Unauthorized Error
403
Post Migration Safety Issues Request Forbidden Error
404
Post Migration Safety Issues Request Not Found Error
429
Post Migration Safety Issues Request Too Many Requests Error
503
Post Migration Safety Issues Request Service Unavailable Error
List feature flag statuses
GET
https://app.launchdarkly.com/api/v2/flag-statuses/:projectKey/:environmentKey
GET
/api/v2/flag-statuses/:projectKey/:environmentKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/flag-statuses/projectKey/environmentKey';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "self": {
     "href": "/api/v2/flag-statuses/my-project/my-environment",
     "type": "application/json"
   }
 },
 "items": [
   {
     "name": "new",
     "_links": {
       "parent": {
         "href": "/api/v2/flags/my-project/my-flag",
         "type": "application/json"
       },
       "self": {
         "href": "/api/v2/flag-statuses/my-project/my-flag",
         "type": "application/json"
       }
     },
     "lastRequested": "2020-02-05T18:17:01Z",
     "default": {
       "key": "value"
     }
   }
 ]
}

Get a list of statuses for all feature flags. The status includes the last time the feature flag was requested, as well as a state, which is one of the following:
new: You created the flag fewer than seven days ago and it has never been requested.
active: LaunchDarkly is receiving requests for this flag, but there are either multiple variations configured, or it is toggled off, or there have been changes to configuration in the past seven days.
inactive: You created the feature flag more than seven days ago, and hasn’t been requested within the past seven days.
launched: LaunchDarkly is receiving requests for this flag, it is toggled on, there is only one variation configured, and there have been no changes to configuration in the past seven days.
To learn more, read Flag statuses.
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
Headers
AuthorizationstringRequired
Response
Flag Statuses collection response
_linksmap from strings to objects
Show 2 properties
itemslist of objects or null
Hide 4 properties
nameenum
Status of the flag
Allowed values:newinactiveactivelaunched
_linksmap from strings to objects
Show 2 properties
lastRequesteddatetime or null
Timestamp of last time flag was requested
defaultany or null
Errors
401
Get Feature Flag Statuses Request Unauthorized Error
403
Get Feature Flag Statuses Request Forbidden Error
404
Get Feature Flag Statuses Request Not Found Error
429
Get Feature Flag Statuses Request Too Many Requests Error
List feature flags
GET
https://app.launchdarkly.com/api/v2/flags/:projectKey
GET
/api/v2/flags/:projectKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/flags/projectKey';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "items": [
   {
     "name": "My Flag",
     "kind": "boolean",
     "key": "flag-key-123abc",
     "_version": 1,
     "creationDate": 1000000,
     "variations": [
       {
         "value": true,
         "_id": "e432f62b-55f6-49dd-a02f-eb24acf39d05"
       },
       {
         "value": false,
         "_id": "a00bf58d-d252-476c-b915-15a74becacb4"
       }
     ],
     "temporary": true,
     "tags": [
       "example-tag"
     ],
     "_links": {
       "parent": {
         "href": "/api/v2/flags/my-project",
         "type": "application/json"
       },
       "self": {
         "href": "/api/v2/flags/my-project/my-flag",
         "type": "application/json"
       }
     },
     "experiments": {
       "baselineIdx": 1,
       "items": [
         {
           "metricKey": "my-metric",
           "_metric": {
             "_id": "5902deadbeef667524a01290",
             "_versionId": "version-id-123abc",
             "key": "metric-key-123abc",
             "name": "My metric",
             "kind": "pageview",
             "_links": {
               "parent": {
                 "href": "/api/v2/metrics/my-project",
                 "type": "application/json"
               },
               "self": {
                 "href": "/api/v2/metrics/my-project/my-metric",
                 "type": "application/json"
               }
             },
             "tags": [
               "tags"
             ],
             "_creationDate": 1000000,
             "experimentCount": 0,
             "metricGroupCount": 0,
             "_attachedFlagCount": 0,
             "maintainerId": "569fdeadbeef1644facecafe",
             "_maintainer": {
               "_links": {
                 "self": {
                   "href": "/api/v2/members/569f183514f4432160000007",
                   "type": "application/json"
                 }
               },
               "_id": "569f183514f4432160000007",
               "role": "admin",
               "email": "ariel@acme.com",
               "firstName": "Ariel",
               "lastName": "Flores"
             },
             "category": "Error monitoring",
             "isNumeric": true,
             "eventKey": "Order placed",
             "filters": {
               "type": "group",
               "op": "op",
               "values": [
                 "JP"
               ],
               "negate": false,
               "attribute": "country",
               "contextKind": "user"
             },
             "percentileValue": 95
           }
         }
       ]
     },
     "customProperties": {
       "key": {
         "name": "Jira issues",
         "value": [
           "is-123",
           "is-456"
         ]
       }
     },
     "archived": false,
     "description": "This flag controls the example widgets",
     "maintainerId": "569f183514f4432160000007",
     "_maintainer": {
       "_links": {
         "self": {
           "href": "/api/v2/members/569f183514f4432160000007",
           "type": "application/json"
         }
       },
       "_id": "569f183514f4432160000007",
       "role": "admin",
       "email": "ariel@acme.com",
       "firstName": "Ariel",
       "lastName": "Flores"
     },
     "maintainerTeamKey": "team-1",
     "_maintainerTeam": {
       "key": "team-key-123abc",
       "name": "Example team",
       "_links": {
         "parent": {
           "href": "/api/v2/teams",
           "type": "application/json"
         },
         "roles": {
           "href": "/api/v2/teams/example-team/roles",
           "type": "application/json"
         },
         "self": {
           "href": "/api/v2/teams/example-team",
           "type": "application/json"
         }
       }
     },
     "archivedDate": 1000000,
     "deprecated": false,
     "deprecatedDate": 1000000,
     "defaults": {
       "onVariation": 0,
       "offVariation": 1
     },
     "_purpose": "_purpose",
     "migrationSettings": {
       "contextKind": "device",
       "stageCount": 6
     },
     "environments": {
       "my-environment": {
         "on": false,
         "archived": false,
         "salt": "61eddeadbeef4da1facecafe3a60a397",
         "sel": "810edeadbeef4844facecafe438f2999492",
         "lastModified": 1627071171347,
         "version": 1,
         "_site": {
           "href": "/default/my-environment/features/client-side-flag",
           "type": "text/html"
         },
         "_environmentName": "My Environment",
         "trackEvents": false,
         "trackEventsFallthrough": false,
         "targets": [
           {
             "values": [
               "user-key-123abc"
             ],
             "variation": 0,
             "contextKind": "user"
           }
         ],
         "contextTargets": [
           {
             "values": [
               "device-key-123abc"
             ],
             "variation": 0,
             "contextKind": "device"
           }
         ],
         "rules": [
           {
             "clauses": [
               {
                 "attribute": "attribute",
                 "op": "op",
                 "values": [],
                 "negate": true
               }
             ],
             "trackEvents": true
           }
         ],
         "fallthrough": {
           "variation": 0
         },
         "offVariation": 1,
         "prerequisites": [
           {
             "key": "key",
             "variation": 1
           }
         ],
         "_summary": {
           "variations": {
             "0": {
               "rules": 0,
               "nullRules": 0,
               "targets": 1,
               "contextTargets": 1,
               "isFallthrough": true
             },
             "1": {
               "rules": 0,
               "nullRules": 0,
               "targets": 0,
               "contextTargets": 1,
               "isOff": true
             }
           },
           "prerequisites": 0
         }
       }
     },
     "includeInSnippet": true,
     "goalIds": [
       "goalIds"
     ]
   }
 ],
 "_links": {
   "self": {
     "href": "/api/v2/flags/default",
     "type": "application/json"
   }
 },
 "totalCount": 1,
 "totalCountWithDifferences": 0
}

Get a list of all feature flags in the given project. You can include information specific to different environments by adding env query parameter. For example, setting env=production adds configuration details about your production environment to the response. You can also filter feature flags by tag with the tag query parameter.
Recommended use
This endpoint can return a large amount of information. We recommend using some or all of these query parameters to decrease response time and overall payload size: limit, env, query, and filter=creationDate.
Filtering flags
You can filter on certain fields using the filter query parameter. For example, setting filter=query:dark-mode,tags:beta+test matches flags with the string dark-mode in their key or name, ignoring case, which also have the tags beta and test.
The filter query parameter supports the following arguments:
Filter argument
Description
Example
applicationEvaluated
A string. It filters the list to flags that are evaluated in the application with the given key.
filter=applicationEvaluated:com.launchdarkly.cafe
archived
(deprecated) A boolean value. It filters the list to archived flags.
Use filter=state:archived instead
contextKindsEvaluated
A +-separated list of context kind keys. It filters the list to flags which have been evaluated in the past 30 days for all of the context kinds in the list.
filter=contextKindsEvaluated:user+application
codeReferences.max
An integer value. Use 0 to return flags that do not have code references.
filter=codeReferences.max:0
codeReferences.min
An integer value. Use 1 to return flags that do have code references.
filter=codeReferences.min:1
creationDate
An object with an optional before field whose value is Unix time in milliseconds. It filters the list to flags created before the date.
filter=creationDate:{"before":1690527600000}
evaluated
An object that contains a key of after and a value in Unix time in milliseconds. It filters the list to all flags that have been evaluated since the time you specify, in the environment provided. This filter requires the filterEnv filter.
filter=evaluated:{"after":1690527600000},filterEnv:production
filterEnv
A valid environment key. You must use this field for filters that are environment-specific. If there are multiple environment-specific filters, you only need to include this field once.
filter=evaluated:{"after": 1590768455282},filterEnv:production
guardedRollout
A string, one of any, monitoring, regressed, rolledBack, completed, archived. It filters the list to flags that are part of guarded rollouts.
filter=guardedRollout:monitoring
hasExperiment
A boolean value. It filters the list to flags that are used in an experiment.
filter=hasExperiment:true
maintainerId
A valid member ID. It filters the list to flags that are maintained by this member.
filter=maintainerId:12ab3c45de678910abc12345
maintainerTeamKey
A string. It filters the list to flags that are maintained by the team with this key.
filter=maintainerTeamKey:example-team-key
query
A string. It filters the list to flags that include the specified string in their key or name. It is not case sensitive.
filter=query:example
releasePipeline
A release pipeline key. It filters the list to flags that are either currently active in the release pipeline or have completed the release pipeline.
filter=releasePipeline:default-release-pipeline
state
A string, either live, deprecated, or archived. It filters the list to flags in this state.
filter=state:archived
sdkAvailability
A string, one of client, mobile, anyClient, server. Using client filters the list to flags whose client-side SDK availability is set to use the client-side ID. Using mobile filters to flags set to use the mobile key. Using anyClient filters to flags set to use either the client-side ID or the mobile key. Using server filters to flags set to use neither, that is, to flags only available in server-side SDKs.
filter=sdkAvailability:client
tags
A +-separated list of tags. It filters the list to flags that have all of the tags in the list.
filter=tags:beta+test
type
A string, either temporary or permanent. It filters the list to flags with the specified type.
filter=type:permanent

The documented values for the filter query are prior to URL encoding. For example, the + in filter=tags:beta+test must be encoded to %2B.
By default, this endpoint returns all flags. You can page through the list with the limit parameter and by following the first, prev, next, and last links in the returned _links field. These links will not be present if the pages they refer to don’t exist. For example, the first and prev links will be missing from the response on the first page.
Sorting flags
You can sort flags based on the following fields:
creationDate sorts by the creation date of the flag.
key sorts by the key of the flag.
maintainerId sorts by the flag maintainer.
name sorts by flag name.
tags sorts by tags.
targetingModifiedDate sorts by the date that the flag’s targeting rules were last modified in a given environment. It must be used with env parameter and it can not be combined with any other sort. If multiple env values are provided, it will perform sort using the first one. For example, sort=-targetingModifiedDate&env=production&env=staging returns results sorted by targetingModifiedDate for the production environment.
type sorts by flag type
All fields are sorted in ascending order by default. To sort in descending order, prefix the field with a dash ( - ). For example, sort=-name sorts the response by flag name in descending order.
Expanding response
LaunchDarkly supports the expand query param to include additional fields in the response, with the following fields:
codeReferences includes code references for the feature flag
evaluation includes evaluation information within returned environments, including which context kinds the flag has been evaluated for in the past 30 days
migrationSettings includes migration settings information within the flag and within returned environments. These settings are only included for migration flags, that is, where purpose is migration.
For example, expand=evaluation includes the evaluation field in the response.
Migration flags
For migration flags, the cohort information is included in the rules property of a flag’s response, and default cohort information is included in the fallthrough property of a flag’s response. To learn more, read Migration Flags.
Path parameters
projectKeystringRequired
The project key
Headers
AuthorizationstringRequired
Query parameters
envstringOptional
Filter configurations by environment
tagstringOptional
Filter feature flags by tag
limitlongOptional
The number of feature flags to return. Defaults to 20.
offsetlongOptional
Where to start in the list. Use this with pagination. For example, an offset of 10 skips the first ten items and then returns the next items in the list, up to the query limit.
archivedbooleanOptionalDeprecated
Deprecated, use filter=archived:true instead. A boolean to filter the list to archived flags. When this is absent, only unarchived flags will be returned
summarybooleanOptional
By default, flags do not include their lists of prerequisites, targets, or rules for each environment. Set summary=0 to include these fields for each flag returned.
filterstringOptional
A comma-separated list of filters. Each filter is of the form field:value. Read the endpoint description for a full list of available filter fields.
sortstringOptional
A comma-separated list of fields to sort by. Fields prefixed by a dash ( - ) sort in descending order. Read the endpoint description for a full list of available sort fields.
comparebooleanOptionalDeprecated
Deprecated, unavailable in API version 20240415. A boolean to filter results by only flags that have differences between environments.
expandstringOptional
A comma-separated list of fields to expand in the response. Supported fields are explained above.
Response
Global flags collection response
itemslist of objects
An array of feature flags
Hide 27 properties
namestring
A human-friendly name for the feature flag
kindenum
Kind of feature flag
Allowed values:booleanmultivariate
keystring
A unique key used to reference the flag in your code
_versioninteger
Version of the feature flag
creationDatelong
Timestamp of flag creation date
variationslist of objects
An array of possible variations for the flag
Hide 4 properties
valueany
_idstring or null
The ID of the variation. Leave empty when you are creating a flag.
descriptionstring or null
Description of the variation. Defaults to an empty string, but is omitted from the response if not set.
namestring or null
A human-friendly name for the variation. Defaults to an empty string, but is omitted from the response if not set.
temporaryboolean
Whether the flag is a temporary flag
tagslist of strings
Tags for the feature flag
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
experimentsobject
Experimentation data for the feature flag
Show 2 properties
customPropertiesmap from strings to objects
Metadata attached to the feature flag, in the form of the property key associated with a name and array of values for the metadata to associate with this flag. Typically used to store data related to an integration.
Hide 2 properties
namestring
The name of the custom property of this type.
valuelist of strings
An array of values for the custom property data to associate with this flag.
archivedboolean
Boolean indicating if the feature flag is archived
descriptionstring or null
Description of the feature flag
clientSideAvailabilityobject or null
Which type of client-side SDKs the feature flag is available to
Hide 2 properties
usingMobileKeyboolean or null
usingEnvironmentIdboolean or null
maintainerIdstring or null
Associated maintainerId for the feature flag
_maintainerobject or null
Associated maintainer member info for the feature flag
Hide 6 properties
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring
The member's ID
rolestring
The member's base role. If the member has no additional roles, this role will be in effect.
emailstring
The member's email address
firstNamestring or null
The member's first name
lastNamestring or null
The member's last name
maintainerTeamKeystring or null
The key of the associated team that maintains this feature flag
_maintainerTeamobject or null
Associated maintainer team info for the feature flag
Show 3 properties
archivedDatelong or null
If archived is true, date of archive
deprecatedboolean or null
Boolean indicating if the feature flag is deprecated
deprecatedDatelong or null
If deprecated is true, date of deprecation
defaultsobject or null
The indices, from the array of variations, for the variations to serve by default when targeting is on and when targeting is off. These variations will be used for this flag in new environments. If omitted, the first and last variation will be used.
Show 2 properties
_purposestring or null
migrationSettingsobject or null
Migration-related settings for the flag
Show 2 properties
environmentsmap from strings to objects or null
Details on the environments for this flag. Only returned if the request is filtered by environment, using the filterEnv query parameter.
Show 21 properties
includeInSnippetboolean or nullDeprecated
Deprecated, use clientSideAvailability. Whether this flag should be made available to the client-side JavaScript SDK
goalIdslist of strings or nullDeprecated
Deprecated, use experiments instead
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
totalCountinteger or null
The total number of flags
totalCountWithDifferencesinteger or null
The number of flags that have differences between environments. Only shown when query parameter compare is true.
Errors
400
Get Feature Flags Request Bad Request Error
401
Get Feature Flags Request Unauthorized Error
403
Get Feature Flags Request Forbidden Error
404
Get Feature Flags Request Not Found Error
429
Get Feature Flags Request Too Many Requests Error
vUpdate expiring context targets on feature flag
PATCH
https://app.launchdarkly.com/api/v2/flags/:projectKey/:featureFlagKey/expiring-targets/:environmentKey
PATCH
/api/v2/flags/:projectKey/:featureFlagKey/expiring-targets/:environmentKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/flags/projectKey/featureFlagKey/expiring-targets/environmentKey';
const options = {
 method: 'PATCH',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"instructions":[{"kind":"addExpireUserTargetDate","userKey":"sandy","value":1686412800000,"variationId":"ce12d345-a1b2-4fb5-a123-ab123d4d5f5d"}]}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Updated
{
 "items": [
   {
     "_id": "12ab3c45de678910abc12345",
     "_version": 1,
     "expirationDate": 1000000,
     "contextKind": "user",
     "contextKey": "context-key-123abc",
     "_resourceId": {
       "environmentKey": "environment-key-123abc",
       "key": "segment-key-123abc",
       "projectKey": "project-key-123abc"
     },
     "targetType": "included",
     "variationId": "cc4332e2-bd4d-4fe0-b509-dfd2caf8dd73"
   }
 ],
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "totalInstructions": 1,
 "successfulInstructions": 1,
 "failedInstructions": 1,
 "errors": [
   {
     "instructionIndex": 1,
     "message": "example error message"
   }
 ]
}

Schedule a context for removal from individual targeting on a feature flag. The flag must already individually target the context.
You can add, update, or remove a scheduled removal date. You can only schedule a context for removal on a single variation per flag.
Updating an expiring target uses the semantic patch format. To make a semantic patch request, you must append domain-model=launchdarkly.semanticpatch to your Content-Type header. To learn more, read Updates using semantic patch.
Instructions
Semantic patch requests support the following kind instructions for updating expiring targets.
Click to expand instructions for updating expiring targets















































































Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
featureFlagKeystringRequired
The feature flag key
Headers
AuthorizationstringRequired
Request
This endpoint expects an object.
instructionslist of maps from strings to anyRequired
The instructions to perform when updating
commentstringOptional
Optional comment describing the change
Response
Expiring target response
itemslist of objects
A list of the results from each instruction
Show 8 properties
_linksmap from strings to objects or null
The location and content type of related resources
Show 2 properties
totalInstructionsinteger or null
successfulInstructionsinteger or null
failedInstructionsinteger or null
errorslist of objects or null
Show 2 properties
Errors
400
Patch Expiring Targets Request Bad Request Error
401
Patch Expiring Targets Request Unauthorized Error
403
Patch Expiring Targets Request Forbidden Error
404
Patch Expiring Targets Request Not Found Error
429
Patch Expiring Targets Request Too Many Requests Error
Update expiring user targets on feature flag
PATCH
https://app.launchdarkly.com/api/v2/flags/:projectKey/:featureFlagKey/expiring-user-targets/:environmentKey
PATCH
/api/v2/flags/:projectKey/:featureFlagKey/expiring-user-targets/:environmentKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/flags/projectKey/featureFlagKey/expiring-user-targets/environmentKey';
const options = {
 method: 'PATCH',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"instructions":[{"kind":"addExpireUserTargetDate","userKey":"sandy","value":1686412800000,"variationId":"ce12d345-a1b2-4fb5-a123-ab123d4d5f5d"}]}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Updated
{
 "items": [
   {
     "_id": "12ab3c45de678910fgh12345",
     "_version": 1,
     "expirationDate": 1000000,
     "userKey": "example-user-key",
     "_resourceId": {},
     "targetType": "included",
     "variationId": "ce67d625-a8b9-4fb5-a344-ab909d9d4f4d"
   }
 ],
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "totalInstructions": 1,
 "successfulInstructions": 1,
 "failedInstructions": 0,
 "errors": [
   {
     "instructionIndex": 1,
     "message": "example error message"
   }
 ]
}

Contexts are now available
After you have upgraded your LaunchDarkly SDK to use contexts instead of users, you should use Update expiring context targets on feature flag instead of this endpoint. To learn more, read Contexts.
Schedule a target for removal from individual targeting on a feature flag. The flag must already serve a variation to specific targets based on their key.
You can add, update, or remove a scheduled removal date. You can only schedule a target for removal on a single variation per flag.
Updating an expiring target uses the semantic patch format. To make a semantic patch request, you must append domain-model=launchdarkly.semanticpatch to your Content-Type header. To learn more, read Updates using semantic patch.
Instructions
Semantic patch requests support the following kind instructions for updating expiring user targets.
Click to expand instructions for updating expiring user targets
addExpireUserTargetDate
Adds a date and time that LaunchDarkly will remove the user from the flag’s individual targeting.
Parameters
value: The time, in Unix milliseconds, when LaunchDarkly should remove the user from individual targeting for this flag
variationId: ID of a variation on the flag
userKey: The user key for the user to remove from individual targeting
updateExpireUserTargetDate
Updates the date and time that LaunchDarkly will remove the user from the flag’s individual targeting.
Parameters
value: The time, in Unix milliseconds, when LaunchDarkly should remove the user from individual targeting for this flag
variationId: ID of a variation on the flag
userKey: The user key for the user to remove from individual targeting
version: (Optional) The version of the expiring user target to update. If included, update will fail if version doesn’t match current version of the expiring user target.
removeExpireUserTargetDate
Removes the scheduled removal of the user from the flag’s individual targeting. The user will remain part of the flag’s individual targeting until you explicitly remove them, or until you schedule another removal.
Parameters
variationId: ID of a variation on the flag
userKey: The user key for the user to remove from individual targeting
Path parameters
projectKeystringRequired
The project key
environmentKeystringRequired
The environment key
featureFlagKeystringRequired
The feature flag key
Headers
AuthorizationstringRequired
Request
This endpoint expects an object.
instructionslist of maps from strings to anyRequired
The instructions to perform when updating
commentstringOptional
Optional comment describing the change
Response
Expiring user target response
itemslist of objects
An array of expiring user targets
Hide 7 properties
_idstring
The ID of this expiring user target
_versioninteger
The version of this expiring user target
expirationDatelong
A timestamp for when the user target expires
userKeystring
A unique key used to represent the user
_resourceIdobject
Details on the resource from which the user is expiring
Show 5 properties
targetTypestring or null
A segment's target type. Included when expiring user targets are updated on a segment.
variationIdstring or null
A unique key used to represent the flag variation. Included when expiring user targets are updated on a feature flag.
_linksmap from strings to objects or null
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
totalInstructionsinteger or null
The total count of instructions sent in the PATCH request
successfulInstructionsinteger or null
The total count of successful instructions sent in the PATCH request
failedInstructionsinteger or null
The total count of the failed instructions sent in the PATCH request
errorslist of objects or null
An array of error messages for the failed instructions
Hide 2 properties
instructionIndexinteger
The index of the PATCH instruction where the error occurred
messagestring
The error message related to a failed PATCH instruction
Errors
400
Patch Expiring User Targets Request Bad Request Error
401
Patch Expiring User Targets Request Unauthorized Error
403
Patch Expiring User Targets Request Forbidden Error
404
Patch Expiring User Targets Request Not Found Error
429
Patch Expiring User Targets Request Too Many Requests Error
Update feature flag
PATCH
https://app.launchdarkly.com/api/v2/flags/:projectKey/:featureFlagKey
PATCH
/api/v2/flags/:projectKey/:featureFlagKey
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/flags/projectKey/featureFlagKey';
const options = {
 method: 'PATCH',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"patch":[{"op":"replace","path":"/description","value":"New description for this flag"}]}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Updated
{
 "name": "My Flag",
 "kind": "boolean",
 "key": "flag-key-123abc",
 "_version": 1,
 "creationDate": 1000000,
 "variations": [
   {
     "value": true,
     "_id": "e432f62b-55f6-49dd-a02f-eb24acf39d05",
     "description": "description",
     "name": "name"
   },
   {
     "value": false,
     "_id": "a00bf58d-d252-476c-b915-15a74becacb4",
     "description": "description",
     "name": "name"
   }
 ],
 "temporary": true,
 "tags": [
   "example-tag"
 ],
 "_links": {
   "parent": {
     "href": "/api/v2/flags/my-project",
     "type": "application/json"
   },
   "self": {
     "href": "/api/v2/flags/my-project/my-flag",
     "type": "application/json"
   }
 },
 "experiments": {
   "baselineIdx": 1,
   "items": [
     {
       "metricKey": "my-metric",
       "_metric": {
         "_id": "5902deadbeef667524a01290",
         "_versionId": "version-id-123abc",
         "key": "metric-key-123abc",
         "name": "My metric",
         "kind": "pageview",
         "_links": {
           "parent": {
             "href": "/api/v2/metrics/my-project",
             "type": "application/json"
           },
           "self": {
             "href": "/api/v2/metrics/my-project/my-metric",
             "type": "application/json"
           }
         },
         "tags": [
           "tags"
         ],
         "_creationDate": 1000000,
         "experimentCount": 0,
         "metricGroupCount": 0,
         "_attachedFlagCount": 0,
         "maintainerId": "569fdeadbeef1644facecafe",
         "_maintainer": {
           "_links": {
             "self": {
               "href": "/api/v2/members/569f183514f4432160000007",
               "type": "application/json"
             }
           },
           "_id": "569f183514f4432160000007",
           "role": "admin",
           "email": "ariel@acme.com",
           "firstName": "Ariel",
           "lastName": "Flores"
         },
         "category": "Error monitoring",
         "isNumeric": true,
         "eventKey": "Order placed",
         "filters": {
           "type": "group",
           "op": "op",
           "values": [
             "JP"
           ],
           "negate": false,
           "attribute": "country",
           "contextKind": "user"
         },
         "percentileValue": 95
       }
     }
   ]
 },
 "customProperties": {
   "key": {
     "name": "Jira issues",
     "value": [
       "is-123",
       "is-456"
     ]
   }
 },
 "archived": false,
 "description": "This flag controls the example widgets",
 "clientSideAvailability": {
   "usingMobileKey": true,
   "usingEnvironmentId": true
 },
 "maintainerId": "569f183514f4432160000007",
 "_maintainer": {
   "_links": {
     "self": {
       "href": "/api/v2/members/569f183514f4432160000007",
       "type": "application/json"
     }
   },
   "_id": "569f183514f4432160000007",
   "role": "admin",
   "email": "ariel@acme.com",
   "firstName": "Ariel",
   "lastName": "Flores"
 },
 "maintainerTeamKey": "team-1",
 "_maintainerTeam": {
   "key": "team-key-123abc",
   "name": "Example team",
   "_links": {
     "parent": {
       "href": "/api/v2/teams",
       "type": "application/json"
     },
     "roles": {
       "href": "/api/v2/teams/example-team/roles",
       "type": "application/json"
     },
     "self": {
       "href": "/api/v2/teams/example-team",
       "type": "application/json"
     }
   }
 },
 "archivedDate": 1000000,
 "deprecated": false,
 "deprecatedDate": 1000000,
 "defaults": {
   "onVariation": 0,
   "offVariation": 1
 },
 "_purpose": "_purpose",
 "migrationSettings": {
   "contextKind": "device",
   "stageCount": 6
 },
 "environments": {
   "my-environment": {
     "on": false,
     "archived": false,
     "salt": "61eddeadbeef4da1facecafe3a60a397",
     "sel": "810edeadbeef4844facecafe438f2999492",
     "lastModified": 1627071171347,
     "version": 1,
     "_site": {
       "href": "/default/my-environment/features/client-side-flag",
       "type": "text/html"
     },
     "_environmentName": "My Environment",
     "trackEvents": false,
     "trackEventsFallthrough": false,
     "targets": [
       {
         "values": [
           "user-key-123abc"
         ],
         "variation": 0,
         "contextKind": "user"
       }
     ],
     "contextTargets": [
       {
         "values": [
           "device-key-123abc"
         ],
         "variation": 0,
         "contextKind": "device"
       }
     ],
     "rules": [
       {
         "clauses": [
           {
             "attribute": "attribute",
             "op": "op",
             "values": [],
             "negate": true
           }
         ],
         "trackEvents": true
       }
     ],
     "fallthrough": {
       "variation": 0
     },
     "offVariation": 1,
     "prerequisites": [
       {
         "key": "key",
         "variation": 1
       }
     ],
     "_access": {
       "denied": [
         {
           "action": "action",
           "reason": {
             "effect": "allow"
           }
         }
       ],
       "allowed": [
         {
           "action": "action",
           "reason": {
             "effect": "allow"
           }
         }
       ]
     },
     "_debugEventsUntilDate": 1000000,
     "_summary": {
       "variations": {
         "0": {
           "rules": 0,
           "nullRules": 0,
           "targets": 1,
           "contextTargets": 1,
           "isFallthrough": true
         },
         "1": {
           "rules": 0,
           "nullRules": 0,
           "targets": 0,
           "contextTargets": 1,
           "isOff": true
         }
       },
       "prerequisites": 0
     }
   }
 },
 "includeInSnippet": true,
 "goalIds": [
   "goalIds"
 ]
}

Perform a partial update to a feature flag. The request body must be a valid semantic patch, JSON patch, or JSON merge patch. To learn more the different formats, read Updates.
Using semantic patches on a feature flag
To make a semantic patch request, you must append domain-model=launchdarkly.semanticpatch to your Content-Type header. To learn more, read Updates using semantic patch.
The body of a semantic patch request for updating feature flags takes the following properties:
comment (string): (Optional) A description of the update.
environmentKey (string): (Required for some instructions only) The key of the LaunchDarkly environment.
instructions (array): (Required) A list of actions the update should perform. Each action in the list must be an object with a kind property that indicates the instruction. If the action requires parameters, you must include those parameters as additional fields in the object. The body of a single semantic patch can contain many different instructions.
Instructions
Semantic patch requests support the following kind instructions for updating feature flags.
Click to expand instructions for turning flags on and off




















Click to expand instructions for working with targeting and variations






























































































































































































































































































































































































































































































































































































































































































































































































Click to expand instructions for updating flag settings


































































































































































Click to expand instructions for updating the flag lifecycle







































Using JSON patches on a feature flag
If you do not include the semantic patch header described above, you can use a JSON patch or JSON merge patch representation of the desired changes.
In the JSON patch representation, use a JSON pointer in the path element to describe what field to change. Use the Get feature flag endpoint to find the field you want to update.
There are a few special cases to keep in mind when determining the value of the path element:
To add an individual target to a specific variation if the flag variation already has individual targets, the path for the JSON patch operation is:
[
 {
   "op": "add",
   "path": "/environments/devint/targets/0/values/-",
   "value": "TestClient10"
 }
]

To add an individual target to a specific variation if the flag variation does not already have individual targets, the path for the JSON patch operation is:
[
 {
   "op": "add",
   "path": "/environments/devint/targets/-",
   "value": { "variation": 0, "values": ["TestClient10"] }
 }
]

To add a flag to a release pipeline, the path for the JSON patch operation is:
[
 {
   "op": "add",
   "path": "/releasePipelineKey",
   "value": "example-release-pipeline-key"
 }
]

Required approvals
If a request attempts to alter a flag configuration in an environment where approvals are required for the flag, the request will fail with a 405. Changes to the flag configuration in that environment will require creating an approval request or a workflow.
Conflicts
If a flag configuration change made through this endpoint would cause a pending scheduled change or approval request to fail, this endpoint will return a 400. You can ignore this check by adding an ignoreConflicts query parameter set to true.
Migration flags
For migration flags, the cohort information is included in the rules property of a flag’s response. You can update cohorts by updating rules. Default cohort information is included in the fallthrough property of a flag’s response. You can update the default cohort by updating fallthrough. When you update the rollout for a cohort or the default cohort through the API, provide a rollout instead of a single variationId. To learn more, read Migration flags.
Path parameters
projectKeystringRequired
The project key
featureFlagKeystringRequired
The feature flag key. The key identifies the flag in your code.
Headers
AuthorizationstringRequired
Query parameters
ignoreConflictsbooleanOptional
If true, the patch will be applied even if it causes a pending scheduled change or approval request to fail.
Request
This endpoint expects an object.
patchlist of objectsRequired
A JSON patch representation of the change to make
Hide 3 properties
opstringRequired
The type of operation to perform
pathstringRequired
A JSON Pointer string specifying the part of the document to operate on
valueanyOptional
commentstringOptional
Optional comment
Response
Global flag response
namestring
A human-friendly name for the feature flag
kindenum
Kind of feature flag
Allowed values:booleanmultivariate
keystring
A unique key used to reference the flag in your code
_versioninteger
Version of the feature flag
creationDatelong
Timestamp of flag creation date
variationslist of objects
An array of possible variations for the flag
Show 4 properties
temporaryboolean
Whether the flag is a temporary flag
tagslist of strings
Tags for the feature flag
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
experimentsobject
Experimentation data for the feature flag
Show 2 properties
customPropertiesmap from strings to objects
Metadata attached to the feature flag, in the form of the property key associated with a name and array of values for the metadata to associate with this flag. Typically used to store data related to an integration.
Show 2 properties
archivedboolean
Boolean indicating if the feature flag is archived
descriptionstring or null
Description of the feature flag
clientSideAvailabilityobject or null
Which type of client-side SDKs the feature flag is available to
Show 2 properties
maintainerIdstring or null
Associated maintainerId for the feature flag
_maintainerobject or null
Associated maintainer member info for the feature flag
Hide 6 properties
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
_idstring
The member's ID
rolestring
The member's base role. If the member has no additional roles, this role will be in effect.
emailstring
The member's email address
firstNamestring or null
The member's first name
lastNamestring or null
The member's last name
maintainerTeamKeystring or null
The key of the associated team that maintains this feature flag
_maintainerTeamobject or null
Associated maintainer team info for the feature flag
Hide 3 properties
keystring
The key of the maintainer team
namestring
A human-friendly name for the maintainer team
_linksmap from strings to objects or null
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
archivedDatelong or null
If archived is true, date of archive
deprecatedboolean or null
Boolean indicating if the feature flag is deprecated
deprecatedDatelong or null
If deprecated is true, date of deprecation
defaultsobject or null
The indices, from the array of variations, for the variations to serve by default when targeting is on and when targeting is off. These variations will be used for this flag in new environments. If omitted, the first and last variation will be used.
Hide 2 properties
onVariationinteger
The index, from the array of variations for this flag, of the variation to serve by default when targeting is on.
offVariationinteger
The index, from the array of variations for this flag, of the variation to serve by default when targeting is off.
_purposestring or null
migrationSettingsobject or null
Migration-related settings for the flag
Hide 2 properties
contextKindstring or null
The context kind targeted by this migration flag. Only applicable for six-stage migrations.
stageCountinteger or null
The number of stages for this migration flag
environmentsmap from strings to objects or null
Details on the environments for this flag. Only returned if the request is filtered by environment, using the filterEnv query parameter.
Hide 21 properties
onboolean
Whether the flag is on
archivedboolean
Boolean indicating if the feature flag is archived
saltstring
selstring
lastModifiedlong
Timestamp of when the flag configuration was most recently modified
versioninteger
Version of the feature flag
_siteobject
Details on how to access the flag configuration in the LaunchDarkly UI
Show 2 properties
_environmentNamestring
The environment name
trackEventsboolean
Whether LaunchDarkly tracks events for the feature flag, for all rules
trackEventsFallthroughboolean
Whether LaunchDarkly tracks events for the feature flag, for the default rule
targetslist of objects or null
An array of the individual targets that will receive a specific variation based on their key. Individual targets with a context kind of 'user' are included here.
Show 3 properties
contextTargetslist of objects or null
An array of the individual targets that will receive a specific variation based on their key. Individual targets with context kinds other than 'user' are included here.
Show 3 properties
ruleslist of objects or null
An array of the rules for how to serve a variation to specific targets based on their attributes
Show 7 properties
fallthroughobject or null
Details on the variation or rollout to serve as part of the flag's default rule
Show 2 properties
offVariationinteger or null
The ID of the variation to serve when the flag is off
prerequisiteslist of objects or null
An array of the prerequisite flags and their variations that are required before this flag takes effect
Show 2 properties
_accessobject or null
Details on the allowed and denied actions for this flag
Show 2 properties
_debugEventsUntilDatelong or null
_summaryobject or null
A summary of the prerequisites and variations for this flag
Show 2 properties
evaluationobject or null
Evaluation information for the flag
Show 1 properties
migrationSettingsobject or null
Migration-related settings for the flag configuration
Show 1 properties
includeInSnippetboolean or nullDeprecated
Deprecated, use clientSideAvailability. Whether this flag should be made available to the client-side JavaScript SDK
goalIdslist of strings or nullDeprecated
Deprecated, use experiments instead
Errors
400
Patch Feature Flag Request Bad Request Error
401
Patch Feature Flag Request Unauthorized Error
404
Patch Feature Flag Request Not Found Error
405
Patch Feature Flag Request Method Not Allowed Error
409
Patch Feature Flag Request Conflict Error
429
Patch Feature Flag Request Too Many Requests Error
Was this page helpful?
Yes

OAuth2 Clients
The OAuth2 client API allows you to register a LaunchDarkly OAuth client for use in your own custom integrations. Registering a LaunchDarkly OAuth client allows you to use LaunchDarkly as an identity provider so that account members can log into your application with their LaunchDarkly account.
You can create and manage LaunchDarkly OAuth clients using the LaunchDarkly OAuth client API. This API acknowledges creation of your client with a response containing a one-time, unique _clientSecret. If you lose your client secret, you will have to register a new client. LaunchDarkly does not store client secrets in plain text.
Several of the endpoints in the OAuth2 client API require an OAuth client ID. The OAuth client ID is returned as part of the Create a LaunchDarkly OAuth 2.0 client and Get clients responses. It is the _clientId field, or the _clientId field of each element in the items array.
You must have Admin privileges or an access token created by a member with Admin privileges in order to be able to use this feature.
Please note that redirectUris must be absolute URIs that conform to the https URI scheme. If you wish to register a client with a different URI scheme, please contact LaunchDarkly Support.
Create a LaunchDarkly OAuth 2.0 client
POST
https://app.launchdarkly.com/api/v2/oauth/clients
POST
/api/v2/oauth/clients
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/oauth/clients';
const options = {
 method: 'POST',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Created
{
 "_links": {
   "parent": {
     "href": "/api/v2/oauth/clients",
     "type": "application/json"
   },
   "self": {
     "href": "/api/v2/oauth/clients/50666563-9144-4125-b822-33f308227e45",
     "type": "application/json"
   }
 },
 "name": "name",
 "_accountId": "_accountId",
 "_clientId": "_clientId",
 "redirectUri": "redirectUri",
 "_creationDate": 1000000,
 "description": "description",
 "_clientSecret": "_clientSecret"
}

Create (register) a LaunchDarkly OAuth2 client. OAuth2 clients allow you to build custom integrations using LaunchDarkly as your identity provider.
Headers
AuthorizationstringRequired
Request
This endpoint expects an object.
namestringOptional
The name of your new LaunchDarkly OAuth 2.0 client.
redirectUristringOptional
The redirect URI for your new OAuth 2.0 application. This should be an absolute URL conforming with the standard HTTPS protocol.
descriptionstringOptional
Description of your OAuth 2.0 client.
Response
OAuth 2.0 client response
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
namestring
Client name
_accountIdstring
The account ID the client is registered under
_clientIdstring
The client's unique ID
redirectUristring
The client's redirect URI
_creationDatelong
Timestamp of client creation date
descriptionstring or null
Client description
_clientSecretstring or null
The client secret. This will only be shown upon creation.
Errors
400
Create Oauth2client Request Bad Request Error
401
Create Oauth2client Request Unauthorized Error
403
Create Oauth2client Request Forbidden Error
Delete OAuth 2.0 client
DELETE
https://app.launchdarkly.com/api/v2/oauth/clients/:clientId
DELETE
/api/v2/oauth/clients/:clientId
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/oauth/clients/clientId';
const options = {method: 'DELETE', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
No Content
{
 "key": "value"
}

Delete an existing OAuth 2.0 client by unique client ID.
Path parameters
clientIdstringRequired
The client ID
Headers
AuthorizationstringRequired
Response
Action succeeded
Errors
400
Delete OAuth Client Request Bad Request Error
401
Delete OAuth Client Request Unauthorized Error
403
Delete OAuth Client Request Forbidden Error
404
Delete OAuth Client Request Not Found Error
Was this page helpful?
Yes

Get client by ID
GET
https://app.launchdarkly.com/api/v2/oauth/clients/:clientId
GET
/api/v2/oauth/clients/:clientId
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/oauth/clients/clientId';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "parent": {
     "href": "/api/v2/oauth/clients",
     "type": "application/json"
   },
   "self": {
     "href": "/api/v2/oauth/clients/50666563-9144-4125-b822-33f308227e45",
     "type": "application/json"
   }
 },
 "name": "name",
 "_accountId": "_accountId",
 "_clientId": "_clientId",
 "redirectUri": "redirectUri",
 "_creationDate": 1000000,
 "description": "description",
 "_clientSecret": "_clientSecret"
}

Get a registered OAuth 2.0 client by unique client ID.
Path parameters
clientIdstringRequired
The client ID
Headers
AuthorizationstringRequired
Response
OAuth 2.0 client response
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
namestring
Client name
_accountIdstring
The account ID the client is registered under
_clientIdstring
The client's unique ID
redirectUristring
The client's redirect URI
_creationDatelong
Timestamp of client creation date
descriptionstring or null
Client description
_clientSecretstring or null
The client secret. This will only be shown upon creation.
Errors
400
Get OAuth Client by ID Request Bad Request Error
401
Get OAuth Client by ID Request Unauthorized Error
403
Get OAuth Client by ID Request Forbidden Error
404
Get OAuth Client by ID Request Not Found Error
Get clients
GET
https://app.launchdarkly.com/api/v2/oauth/clients
GET
/api/v2/oauth/clients
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/oauth/clients';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "self": {
     "href": "/api/v2/oauth/clients",
     "type": "application/json"
   }
 },
 "items": [
   {
     "_links": {
       "parent": {
         "href": "/api/v2/oauth/clients",
         "type": "application/json"
       },
       "self": {
         "href": "/api/v2/oauth/clients/50666563-9144-4125-b822-33f308227e45",
         "type": "application/json"
       }
     },
     "name": "name",
     "_accountId": "_accountId",
     "_clientId": "_clientId",
     "redirectUri": "redirectUri",
     "_creationDate": 1000000,
     "description": "description",
     "_clientSecret": "_clientSecret"
   }
 ]
}

Get all OAuth 2.0 clients registered by your account.
Headers
AuthorizationstringRequired
Response
OAuth 2.0 client collection response
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
itemslist of objects
List of client objects
Show 8 properties
Errors
400
Get OAuth Clients Request Bad Request Error
401
Get OAuth Clients Request Unauthorized Error
403
Get OAuth Clients Request Forbidden Error
Patch client by ID
PATCH
https://app.launchdarkly.com/api/v2/oauth/clients/:clientId
PATCH
/api/v2/oauth/clients/:clientId
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/oauth/clients/clientId';
const options = {
 method: 'PATCH',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"0":{"op":"replace","path":"/name","value":"Example Client V2"}}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Updated
{
 "_links": {
   "parent": {
     "href": "/api/v2/oauth/clients",
     "type": "application/json"
   },
   "self": {
     "href": "/api/v2/oauth/clients/50666563-9144-4125-b822-33f308227e45",
     "type": "application/json"
   }
 },
 "name": "name",
 "_accountId": "_accountId",
 "_clientId": "_clientId",
 "redirectUri": "redirectUri",
 "_creationDate": 1000000,
 "description": "description",
 "_clientSecret": "_clientSecret"
}

Patch an existing OAuth 2.0 client by client ID. Updating an OAuth2 client uses a JSON patch representation of the desired changes. To learn more, read Updates. Only name, description, and redirectUri may be patched.
Path parameters
clientIdstringRequired
The client ID
Headers
AuthorizationstringRequired
Request
This endpoint expects a list of objects.
opstringRequired
The type of operation to perform
pathstringRequired
A JSON Pointer string specifying the part of the document to operate on
valueanyOptional
Response
OAuth 2.0 client response
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
namestring
Client name
_accountIdstring
The account ID the client is registered under
_clientIdstring
The client's unique ID
redirectUristring
The client's redirect URI
_creationDatelong
Timestamp of client creation date
descriptionstring or null
Client description
_clientSecretstring or null
The client secret. This will only be shown upon creation.
Errors
400
Patch OAuth Client Request Bad Request Error
401
Patch OAuth Client Request Unauthorized Error
403
Patch OAuth Client Request Forbidden Error
404
Patch OAuth Client Request Not Found Error
Webhooks
The webhooks API lets you build your own integrations that subscribe to activities in LaunchDarkly. When you generate an activity in LaunchDarkly, such as when you change a flag or you create a project, LaunchDarkly sends an HTTP POST payload to the webhook’s URL. Use webhooks to update external issue trackers, update support tickets, notify customers of new feature rollouts, and more.
Several of the endpoints in the webhooks API require a webhook ID. The webhook ID is returned as part of the Creates a webhook and List webhooks responses. It is the _id field, or the _id field of each element in the items array.
Designating the payload
The webhook payload is identical to an audit log entry. To learn more, read Get audit log entry.
Here’s a sample payload:
Webhook delivery order
Webhooks may not be delivered in chronological order. We recommend using the payload’s “date” field as a timestamp to reorder webhooks as they are received.
{
 "_links": {
   "canonical": {
     "href": "/api/v2/projects/alexis/environments/test",
     "type": "application/json"
   },
   "parent": {
     "href": "/api/v2/auditlog",
     "type": "application/json"
   },
   "self": {
     "href": "/api/v2/auditlog/57c0a8e29969090743529965",
     "type": "application/json"
   },
   "site": {
     "href": "/settings#/projects",
     "type": "text/html"
   }
 },
 "_id": "57c0a8e29969090743529965",
 "date": 1472243938774,
 "accesses": [
   {
     "action": "updateName",
     "resource": "proj/alexis:env/test"
   }
 ],
 "kind": "environment",
 "name": "Testing",
 "description": "- Changed the name from ~~Test~~ to *Testing*",
 "member": {
   "_links": {
     "parent": {
       "href": "/internal/account/members",
       "type": "application/json"
     },
     "self": {
       "href": "/internal/account/members/548f6741c1efad40031b18ae",
       "type": "application/json"
     }
   },
   "_id": "548f6741c1efad40031b18ae",
   "email": "ariel@acme.com",
   "firstName": "Ariel",
   "lastName": "Flores"
 },
 "titleVerb": "changed the name of",
 "title": "[Ariel Flores](mailto:ariel@acme.com) changed the name of [Testing](https://app.launchdarkly.com/settings#/projects)",
 "target": {
   "_links": {
     "canonical": {
       "href": "/api/v2/projects/alexis/environments/test",
       "type": "application/json"
     },
     "site": {
       "href": "/settings#/projects",
       "type": "text/html"
     }
   },
   "name": "Testing",
   "resources": ["proj/alexis:env/test"]
 }
}

Signing the webhook
Optionally, you can define a secret when you create a webhook. If you define the secret, the webhook POST request will include an X-LD-Signature header, whose value will contain an HMAC SHA256 hex digest of the webhook payload, using the secret as the key.
Compute the signature of the payload using the same shared secret in your code to verify that the webhook was triggered by LaunchDarkly.
Understanding connection retries
If LaunchDarkly receives a non-2xx response to a webhook POST, it will retry the delivery one time. Webhook delivery is not guaranteed. If you build an integration on webhooks, make sure it is tolerant of delivery failures.
Was this page helpful?
Yes

OverviewWebhooks
Creates a webhook
POST
https://app.launchdarkly.com/api/v2/webhooks
POST
/api/v2/webhooks
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/webhooks';
const options = {
 method: 'POST',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"url":"https://example.com","sign":false,"on":true,"name":"apidocs test webhook","statements":[{"effect":"allow","resources":["proj/test"],"actions":["*"]}],"tags":["example-tag"]}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Successful
{
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "_id": "57be1db38b75bf0772d11384",
 "url": "http://www.example.com",
 "on": true,
 "tags": [
   "examples"
 ],
 "name": "Example hook",
 "secret": "frobozz",
 "statements": [
   {
     "effect": "allow",
     "resources": [
       "proj/*:env/*;qa_*:/flag/*"
     ],
     "notResources": [
       "notResources"
     ],
     "actions": [
       "*"
     ],
     "notActions": [
       "notActions"
     ]
   }
 ],
 "_access": {
   "denied": [
     {
       "action": "action",
       "reason": {
         "effect": "allow"
       }
     }
   ],
   "allowed": [
     {
       "action": "action",
       "reason": {
         "effect": "allow"
       }
     }
   ]
 }
}

Create a new webhook.
Headers
AuthorizationstringRequired
Request
This endpoint expects an object.
urlstringRequired
The URL of the remote webhook
signbooleanRequired
If sign is false, the webhook does not include a signature header, and the secret can be omitted.
onbooleanRequired
Whether or not this webhook is enabled.
namestringOptional
A human-readable name for your webhook
secretstringOptional
If sign is true, and the secret attribute is omitted, LaunchDarkly automatically generates a secret for you.
statementslist of objectsOptional
Represents a Custom role policy, defining a resource kinds filter the webhook should respond to.
Show 5 properties
tagslist of stringsOptional
List of tags for this webhook
Response
Webhook response
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
_idstring
The ID of this webhook
urlstring
The URL to which LaunchDarkly sends an HTTP POST payload for this webhook
onboolean
Whether or not this webhook is enabled
tagslist of strings
List of tags for this webhook
namestring or null
A human-readable name for this webhook
secretstring or null
The secret for this webhook
statementslist of objects or null
Represents a Custom role policy, defining a resource kinds filter the webhook responds to.
Show 5 properties
_accessobject or null
Details on the allowed and denied actions for this webhook
Show 2 properties
Errors
400
Post Webhook Request Bad Request Error
401
Post Webhook Request Unauthorized Error
403
Post Webhook Request Forbidden Error
429
Post Webhook Request Too Many Requests Error
OverviewWebhooks
Delete webhook
DELETE
https://app.launchdarkly.com/api/v2/webhooks/:id
DELETE
/api/v2/webhooks/:id
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/webhooks/id';
const options = {method: 'DELETE', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
No Content
{
 "key": "value"
}

Delete a webhook by ID.
Path parameters
idstringRequired
The ID of the webhook to delete
Headers
AuthorizationstringRequired
Response
Action succeeded
Errors
401
Delete Webhook Request Unauthorized Error
403
Delete Webhook Request Forbidden Error
404
Delete Webhook Request Not Found Error
429
Delete Webhook Request Too Many Requests Error
OverviewWebhooks
Get webhook
GET
https://app.launchdarkly.com/api/v2/webhooks/:id
GET
/api/v2/webhooks/:id
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/webhooks/id';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "_id": "57be1db38b75bf0772d11384",
 "url": "http://www.example.com",
 "on": true,
 "tags": [
   "examples"
 ],
 "name": "Example hook",
 "secret": "frobozz",
 "statements": [
   {
     "effect": "allow",
     "resources": [
       "proj/*:env/*;qa_*:/flag/*"
     ],
     "notResources": [
       "notResources"
     ],
     "actions": [
       "*"
     ],
     "notActions": [
       "notActions"
     ]
   }
 ],
 "_access": {
   "denied": [
     {
       "action": "action",
       "reason": {
         "effect": "allow"
       }
     }
   ],
   "allowed": [
     {
       "action": "action",
       "reason": {
         "effect": "allow"
       }
     }
   ]
 }
}

Get a single webhook by ID.
Path parameters
idstringRequired
The ID of the webhook
Headers
AuthorizationstringRequired
Response
Webhook response
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
_idstring
The ID of this webhook
urlstring
The URL to which LaunchDarkly sends an HTTP POST payload for this webhook
onboolean
Whether or not this webhook is enabled
tagslist of strings
List of tags for this webhook
namestring or null
A human-readable name for this webhook
secretstring or null
The secret for this webhook
statementslist of objects or null
Represents a Custom role policy, defining a resource kinds filter the webhook responds to.
Show 5 properties
_accessobject or null
Details on the allowed and denied actions for this webhook
Show 2 properties
Errors
401
Get Webhook Request Unauthorized Error
403
Get Webhook Request Forbidden Error
404
Get Webhook Request Not Found Error
429
Get Webhook Request Too Many Requests Error
List webhooks
GET
https://app.launchdarkly.com/api/v2/webhooks
GET
/api/v2/webhooks
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/webhooks';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "items": [
   {
     "_links": {
       "key": {}
     },
     "_id": "57be1db38b75bf0772d11384",
     "url": "http://www.example.com",
     "on": true,
     "tags": [
       "examples"
     ],
     "name": "Example hook",
     "secret": "frobozz",
     "statements": [
       {
         "effect": "allow"
       }
     ],
     "_access": {
       "denied": [
         {
           "action": "action",
           "reason": {
             "effect": "allow"
           }
         }
       ],
       "allowed": [
         {
           "action": "action",
           "reason": {
             "effect": "allow"
           }
         }
       ]
     }
   }
 ]
}

Fetch a list of all webhooks.
Headers
AuthorizationstringRequired
Response
Webhooks response
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
itemslist of objects
An array of webhooks
Show 9 properties
Errors
401
Get All Webhooks Request Unauthorized Error
403
Get All Webhooks Request Forbidden Error
429
Get All Webhooks Request Too Many Requests Error
Update webhook
PATCH
https://app.launchdarkly.com/api/v2/webhooks/:id
PATCH
/api/v2/webhooks/:id
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/webhooks/id';
const options = {
 method: 'PATCH',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"0":{"op":"replace","path":"/on","value":false}}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Updated
{
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "_id": "57be1db38b75bf0772d11384",
 "url": "http://www.example.com",
 "on": true,
 "tags": [
   "examples"
 ],
 "name": "Example hook",
 "secret": "frobozz",
 "statements": [
   {
     "effect": "allow",
     "resources": [
       "proj/*:env/*;qa_*:/flag/*"
     ],
     "notResources": [
       "notResources"
     ],
     "actions": [
       "*"
     ],
     "notActions": [
       "notActions"
     ]
   }
 ],
 "_access": {
   "denied": [
     {
       "action": "action",
       "reason": {
         "effect": "allow"
       }
     }
   ],
   "allowed": [
     {
       "action": "action",
       "reason": {
         "effect": "allow"
       }
     }
   ]
 }
}

Update a webhook’s settings. Updating webhook settings uses a JSON patch representation of the desired changes. To learn more, read Updates.
Path parameters
idstringRequired
The ID of the webhook to update
Headers
AuthorizationstringRequired
Request
This endpoint expects a list of objects.
opstringRequired
The type of operation to perform
pathstringRequired
A JSON Pointer string specifying the part of the document to operate on
valueanyOptional
Response
Webhook response
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
_idstring
The ID of this webhook
urlstring
The URL to which LaunchDarkly sends an HTTP POST payload for this webhook
onboolean
Whether or not this webhook is enabled
tagslist of strings
List of tags for this webhook
namestring or null
A human-readable name for this webhook
secretstring or null
The secret for this webhook
statementslist of objects or null
Represents a Custom role policy, defining a resource kinds filter the webhook responds to.
Show 5 properties
_accessobject or null
Details on the allowed and denied actions for this webhook
Show 2 properties
Errors
400
Patch Webhook Request Bad Request Error
401
Patch Webhook Request Unauthorized Error
403
Patch Webhook Request Forbidden Error
404
Patch Webhook Request Not Found Error
429
Patch Webhook Request Too Many Requests Error
Create workflow
POST
https://app.launchdarkly.com/api/v2/projects/:projectKey/flags/:featureFlagKey/environments/:environmentKey/workflows
POST
/api/v2/projects/:projectKey/flags/:featureFlagKey/environments/:environmentKey/workflows
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/flags/featureFlagKey/environments/environmentKey/workflows';
const options = {
 method: 'POST',
 headers: {Authorization: '<apiKey>', 'Content-Type': 'application/json'},
 body: '{"name":"Progressive rollout starting in two days","description":"Turn flag on for 10% of customers each day","stages":[{"name":"10% rollout on day 1","conditions":[{"scheduleKind":"relative","waitDuration":2,"waitDurationUnit":"calendarDay","kind":"schedule"}],"action":{"instructions":[{"kind":"turnFlagOn"},{"kind":"updateFallthroughVariationOrRollout","rolloutWeights":{"452f5fb5-7320-4ba3-81a1-8f4324f79d49":90000,"fc15f6a4-05d3-4aa4-a997-446be461345d":10000}}]}}]}'
};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Created
{
 "_id": "12ab3c4d5ef1a2345bcde67f",
 "_version": 1,
 "_conflicts": [
   {
     "stageId": "12ab3c4d5ef1a2345bcde67f",
     "message": "message"
   }
 ],
 "_creationDate": 1000000,
 "_maintainerId": "12ab3c45de678910abc12345",
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "name": "Progressive rollout starting in two days",
 "_execution": {
   "status": "completed",
   "stopDate": 1000000
 },
 "description": "Turn flag on for 10% of customers each day",
 "kind": "custom",
 "stages": [
   {
     "_id": "12ab3c45de678910abc12345",
     "conditions": [
       {
         "_id": "_id",
         "_execution": {
           "status": "completed"
         },
         "description": "description",
         "notifyMemberIds": [
           "notifyMemberIds"
         ],
         "allReviews": [
           {
             "_id": "_id",
             "kind": "kind"
           }
         ],
         "reviewStatus": "reviewStatus",
         "kind": "schedule",
         "scheduleKind": "relative",
         "waitDuration": 2,
         "waitDurationUnit": "calendarDay"
       }
     ],
     "action": {
       "kind": "patch",
       "instructions": [
         {
           "key": "value"
         }
       ]
     },
     "_execution": {
       "status": "completed"
     },
     "name": "10% rollout on day 1"
   }
 ],
 "meta": {
   "parameters": [
     {}
   ]
 },
 "templateKey": "example-workflow-template"
}

Create a workflow for a feature flag. You can create a workflow directly, or you can apply a template to create a new workflow.
Creating a workflow
You can use the create workflow endpoint to create a workflow directly by adding a stages array to the request body.
For each stage, define the name, conditions when the stage should be executed, and action that describes the stage.
Click to expand example













































































Creating a workflow by applying a workflow template
You can also create a workflow by applying a workflow template. If you pass a valid workflow template key as the templateKey query parameter with the request, the API will attempt to create a new workflow with the stages defined in the workflow template with the corresponding key.
Applicability of stages
Templates are created in the context of a particular flag in a particular environment in a particular project. However, because workflows created from a template can be applied to any project, environment, and flag, some steps of the workflow may need to be updated in order to be applicable for the target resource.
You can pass a dryRun query parameter to tell the API to return a report of which steps of the workflow template are applicable in the target project/environment/flag, and which will need to be updated. When the dryRun query parameter is present the response body includes a meta property that holds a list of parameters that could potentially be inapplicable for the target resource. Each of these parameters will include a valid field. You will need to update any invalid parameters in order to create the new workflow. You can do this using the parameters property, which overrides the workflow template parameters.
Overriding template parameters
You can use the parameters property in the request body to tell the API to override the specified workflow template parameters with new values that are specific to your target project/environment/flag.
Click to expand example









































If there are any steps in the template that are not applicable to the target resource, the workflow will not be created, and the meta property will be included in the response body detailing which parameters need to be updated.
Path parameters
projectKeystringRequired
The project key
featureFlagKeystringRequired
The feature flag key
environmentKeystringRequired
The environment key
Headers
AuthorizationstringRequired
Query parameters
templateKeystringOptional
The template key to apply as a starting point for the new workflow
dryRunbooleanOptional
Whether to call the endpoint in dry-run mode
Request
This endpoint expects an object.
namestringRequired
The workflow name
maintainerIdstringOptional
The ID of the workflow maintainer. Defaults to the workflow creator.
descriptionstringOptional
The workflow description
stageslist of objectsOptional
A list of the workflow stages
Hide 4 properties
namestringOptional
The stage name
executeConditionsInSequencebooleanOptional
Whether to execute the conditions in sequence for the given stage
conditionslist of objectsOptional
An array of conditions for the stage
Show 9 properties
actionobjectOptional
An instructions field containing an array of instructions for the stage. Each object in the array uses the semantic patch format for updating a feature flag.
Show 1 properties
templateKeystringOptional
The template key
Response
Workflow response
_idstring
The ID of the workflow
_versioninteger
The version of the workflow
_conflictslist of objects
Any conflicts that are present in the workflow stages
Hide 2 properties
stageIdstring
The stage ID
messagestring
Message about the conflict
_creationDatelong
Timestamp of when the workflow was created
_maintainerIdstring
The member ID of the maintainer of the workflow. Defaults to the workflow creator.
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
namestring
The name of the workflow
_executionobject
The current execution status of the workflow
Hide 2 properties
statusstring
The status of the execution of this workflow stage
stopDatelong or null
Timestamp of when the workflow was completed.
descriptionstring or null
A brief description of the workflow
kindstring or null
The kind of workflow
stageslist of objects or null
The stages that make up the workflow. Each stage contains conditions and actions.
Hide 5 properties
_idstring
The ID of this stage
conditionslist of objects
An array of conditions for the stage
Hide 12 properties
_idstring
_executionobject
Hide 2 properties
statusstring
The status of the execution of this workflow stage
stopDatelong or null
Timestamp of when the workflow was completed.
descriptionstring
notifyMemberIdslist of strings
allReviewslist of objects
Hide 6 properties
_idstring
kindstring
creationDatelong or null
commentstring or null
memberIdstring or null
serviceTokenIdstring or null
reviewStatusstring
kindstring or null
scheduleKindstring or null
executionDatelong or null
waitDurationinteger or null
waitDurationUnitstring or null
appliedDatelong or null
actionobject
The type of instruction, and an array of instructions for the stage. Each object in the array uses the semantic patch format for updating a feature flag.
Hide 2 properties
kindstring
The type of action for this stage
instructionslist of maps from strings to any
An array of instructions for the stage. Each object in the array uses the semantic patch format for updating a feature flag.
_executionobject
Details on the execution of this stage
Hide 2 properties
statusstring
The status of the execution of this workflow stage
stopDatelong or null
Timestamp of when the workflow was completed.
namestring or null
The stage name
metaobject or null
For workflows being created from a workflow template, this value holds any parameters that could potentially be incompatible with the current project, environment, or flag
Hide 1 properties
parameterslist of objects or null
Hide 4 properties
_idstring or null
The ID of the condition or instruction referenced by this parameter
pathstring or null
The path of the property to parameterize, relative to its parent condition or instruction
defaultobject or null
The default value of the parameter and other relevant metadata
Hide 3 properties
valueany or null
booleanVariationValueboolean or null
Variation value for boolean flags. Not applicable for non-boolean flags.
ruleClauseobject or null
Metadata related to add rule instructions
Hide 3 properties
attributestring or null
The attribute the rule applies to, for example, last name or email address
openum or null
The operator to apply to the given attribute
inendsWithstartsWithmatchescontainslessThanlessThanOrEqualgreaterThangreaterThanOrEqualbeforeaftersegmentMatchsemVerEqualsemVerLessThansemVerGreaterThan
negateboolean or null
Whether the operator should be negated
validboolean or null
Whether the default value is valid for the target flag and environment
templateKeystring or null
For workflows being created from a workflow template, this value is the template's key
Errors
400
Post Workflow Request Bad Request Error
401
Post Workflow Request Unauthorized Error
403
Post Workflow Request Forbidden Error
404
Post Workflow Request Not Found Error
429
Post Workflow Request Too Many Requests Error
Delete workflow
DELETE
https://app.launchdarkly.com/api/v2/projects/:projectKey/flags/:featureFlagKey/environments/:environmentKey/workflows/:workflowId
DELETE
/api/v2/projects/:projectKey/flags/:featureFlagKey/environments/:environmentKey/workflows/:workflowId
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/flags/featureFlagKey/environments/environmentKey/workflows/workflowId';
const options = {method: 'DELETE', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
No Content
{
 "key": "value"
}

Delete a workflow from a feature flag.
Path parameters
projectKeystringRequired
The project key
featureFlagKeystringRequired
The feature flag key
environmentKeystringRequired
The environment key
workflowIdstringRequired
The workflow id
Headers
AuthorizationstringRequired
Response
Action completed successfully
Errors
400
Delete Workflow Request Bad Request Error
401
Delete Workflow Request Unauthorized Error
403
Delete Workflow Request Forbidden Error
404
Delete Workflow Request Not Found Error
429
Delete Workflow Request Too Many Requests Error
Get custom workflow
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/flags/:featureFlagKey/environments/:environmentKey/workflows/:workflowId
GET
/api/v2/projects/:projectKey/flags/:featureFlagKey/environments/:environmentKey/workflows/:workflowId
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/flags/featureFlagKey/environments/environmentKey/workflows/workflowId';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "_id": "12ab3c4d5ef1a2345bcde67f",
 "_version": 1,
 "_conflicts": [
   {
     "stageId": "12ab3c4d5ef1a2345bcde67f",
     "message": "message"
   }
 ],
 "_creationDate": 1000000,
 "_maintainerId": "12ab3c45de678910abc12345",
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 },
 "name": "Progressive rollout starting in two days",
 "_execution": {
   "status": "completed",
   "stopDate": 1000000
 },
 "description": "Turn flag on for 10% of customers each day",
 "kind": "custom",
 "stages": [
   {
     "_id": "12ab3c45de678910abc12345",
     "conditions": [
       {
         "_id": "_id",
         "_execution": {
           "status": "completed"
         },
         "description": "description",
         "notifyMemberIds": [
           "notifyMemberIds"
         ],
         "allReviews": [
           {
             "_id": "_id",
             "kind": "kind"
           }
         ],
         "reviewStatus": "reviewStatus",
         "kind": "schedule",
         "scheduleKind": "relative",
         "waitDuration": 2,
         "waitDurationUnit": "calendarDay"
       }
     ],
     "action": {
       "kind": "patch",
       "instructions": [
         {
           "key": "value"
         }
       ]
     },
     "_execution": {
       "status": "completed"
     },
     "name": "10% rollout on day 1"
   }
 ],
 "meta": {
   "parameters": [
     {}
   ]
 },
 "templateKey": "example-workflow-template"
}

Get a specific workflow by ID.
Path parameters
projectKeystringRequired
The project key
featureFlagKeystringRequired
The feature flag key
environmentKeystringRequired
The environment key
workflowIdstringRequired
The workflow ID
Headers
AuthorizationstringRequired
Response
Workflow response
_idstring
The ID of the workflow
_versioninteger
The version of the workflow
_conflictslist of objects
Any conflicts that are present in the workflow stages
Hide 2 properties
stageIdstring
The stage ID
messagestring
Message about the conflict
_creationDatelong
Timestamp of when the workflow was created
_maintainerIdstring
The member ID of the maintainer of the workflow. Defaults to the workflow creator.
_linksmap from strings to objects
The location and content type of related resources
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
namestring
The name of the workflow
_executionobject
The current execution status of the workflow
Hide 2 properties
statusstring
The status of the execution of this workflow stage
stopDatelong or null
Timestamp of when the workflow was completed.
descriptionstring or null
A brief description of the workflow
kindstring or null
The kind of workflow
stageslist of objects or null
The stages that make up the workflow. Each stage contains conditions and actions.
Hide 5 properties
_idstring
The ID of this stage
conditionslist of objects
An array of conditions for the stage
Hide 12 properties
_idstring
_executionobject
Show 2 properties
descriptionstring
notifyMemberIdslist of strings
allReviewslist of objects
Hide 6 properties
_idstring
kindstring
creationDatelong or null
commentstring or null
memberIdstring or null
serviceTokenIdstring or null
reviewStatusstring
kindstring or null
scheduleKindstring or null
executionDatelong or null
waitDurationinteger or null
waitDurationUnitstring or null
appliedDatelong or null
actionobject
The type of instruction, and an array of instructions for the stage. Each object in the array uses the semantic patch format for updating a feature flag.
Hide 2 properties
kindstring
The type of action for this stage
instructionslist of maps from strings to any
An array of instructions for the stage. Each object in the array uses the semantic patch format for updating a feature flag.
_executionobject
Details on the execution of this stage
Hide 2 properties
statusstring
The status of the execution of this workflow stage
stopDatelong or null
Timestamp of when the workflow was completed.
namestring or null
The stage name
metaobject or null
For workflows being created from a workflow template, this value holds any parameters that could potentially be incompatible with the current project, environment, or flag
Hide 1 properties
parameterslist of objects or null
Hide 4 properties
_idstring or null
The ID of the condition or instruction referenced by this parameter
pathstring or null
The path of the property to parameterize, relative to its parent condition or instruction
defaultobject or null
The default value of the parameter and other relevant metadata
Hide 3 properties
valueany or null
booleanVariationValueboolean or null
Variation value for boolean flags. Not applicable for non-boolean flags.
ruleClauseobject or null
Metadata related to add rule instructions
Hide 3 properties
attributestring or null
The attribute the rule applies to, for example, last name or email address
openum or null
The operator to apply to the given attribute
inendsWithstartsWithmatchescontainslessThanlessThanOrEqualgreaterThangreaterThanOrEqualbeforeaftersegmentMatchsemVerEqualsemVerLessThansemVerGreaterThan
negateboolean or null
Whether the operator should be negated
validboolean or null
Whether the default value is valid for the target flag and environment
templateKeystring or null
For workflows being created from a workflow template, this value is the template's key
Errors
401
Get Custom Workflow Request Unauthorized Error
403
Get Custom Workflow Request Forbidden Error
404
Get Custom Workflow Request Not Found Error
429
Get Custom Workflow Request Too Many Requests Error
Was this page helpful?
Yes

Get workflows
GET
https://app.launchdarkly.com/api/v2/projects/:projectKey/flags/:featureFlagKey/environments/:environmentKey/workflows
GET
/api/v2/projects/:projectKey/flags/:featureFlagKey/environments/:environmentKey/workflows
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/projects/projectKey/flags/featureFlagKey/environments/environmentKey/workflows';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "items": [
   {
     "_id": "12ab3c4d5ef1a2345bcde67f",
     "_version": 1,
     "_conflicts": [
       {
         "stageId": "12ab3c4d5ef1a2345bcde67f",
         "message": "message"
       }
     ],
     "_creationDate": 1000000,
     "_maintainerId": "12ab3c45de678910abc12345",
     "_links": {
       "key": {}
     },
     "name": "Progressive rollout starting in two days",
     "_execution": {
       "status": "completed"
     },
     "description": "Turn flag on for 10% of customers each day",
     "kind": "custom",
     "stages": [
       {
         "_id": "12ab3c45de678910abc12345",
         "conditions": [
           {
             "_id": "_id",
             "_execution": {
               "status": "completed"
             },
             "description": "description",
             "notifyMemberIds": [
               "notifyMemberIds"
             ],
             "allReviews": [
               {
                 "_id": "_id",
                 "kind": "kind"
               }
             ],
             "reviewStatus": "reviewStatus",
             "kind": "schedule",
             "scheduleKind": "relative",
             "waitDuration": 2,
             "waitDurationUnit": "calendarDay"
           }
         ],
         "action": {
           "kind": "patch",
           "instructions": [
             {
               "key": "value"
             }
           ]
         },
         "_execution": {
           "status": "completed"
         },
         "name": "10% rollout on day 1"
       }
     ],
     "templateKey": "example-workflow-template"
   }
 ],
 "totalCount": 1,
 "_links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 }
}

Display workflows associated with a feature flag.
Path parameters
projectKeystringRequired
The project key
featureFlagKeystringRequired
The feature flag key
environmentKeystringRequired
The environment key
Headers
AuthorizationstringRequired
Query parameters
statusstringOptional
Filter results by workflow status. Valid status filters are active, completed, and failed.
sortstringOptional
A field to sort the items by. Prefix field by a dash ( - ) to sort in descending order. This endpoint supports sorting by creationDate or stopDate.
limitlongOptional
The maximum number of workflows to return. Defaults to 20.
offsetlongOptional
Where to start in the list. Defaults to 0. Use this with pagination. For example, an offset of 10 skips the first ten items and then returns the next items in the list, up to the query limit.
Response
Workflows collection response
itemslist of objects
An array of workflows
Show 13 properties
totalCountinteger
Total number of workflows
_linksmap from strings to objects
The location and content type of related resources
Show 2 properties
Errors
401
Get Workflows Request Unauthorized Error
403
Get Workflows Request Forbidden Error
404
Get Workflows Request Not Found Error
429
Get Workflows Request Too Many Requests Error
Root resource
GET
https://app.launchdarkly.com/api/v2
GET
/api/v2
JavaScript
const url = 'https://app.launchdarkly.com/api/v2';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "links": {
   "key": {
     "href": "href",
     "type": "type"
   }
 }
}

Get all of the resource categories the API supports. In the sandbox, click 'Play' and enter any string in the 'Authorization' field to test this endpoint.
Headers
AuthorizationstringRequired
Response
Root response
linksmap from strings to objects
Hide 2 properties
hrefstring or null
The URL of the link
typestring or null
The type of the link
Errors
429
Get Root Request Too Many Requests Error
Identify the caller
GET
https://app.launchdarkly.com/api/v2/caller-identity
GET
/api/v2/caller-identity
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/caller-identity';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "accountId": "accountId",
 "environmentId": "environmentId",
 "projectId": "projectId",
 "environmentName": "environmentName",
 "projectName": "projectName",
 "authKind": "authKind",
 "tokenKind": "tokenKind",
 "clientId": "clientId",
 "tokenName": "tokenName",
 "tokenId": "tokenId",
 "memberId": "memberId",
 "serviceToken": true
}

Get basic information about the identity used (session cookie, API token, SDK keys, etc.) to call the API
Headers
AuthorizationstringRequired
Response
Caller Identity
accountIdstring or null
environmentIdstring or null
projectIdstring or null
environmentNamestring or null
projectNamestring or null
authKindstring or null
tokenKindstring or null
clientIdstring or null
tokenNamestring or null
tokenIdstring or null
memberIdstring or null
serviceTokenboolean or null
Errors
401
Get Caller Identity Request Unauthorized Error
429
Get Caller Identity Request Too Many Requests Error
Gets the public IP list
GET
https://app.launchdarkly.com/api/v2/public-ip-list
GET
/api/v2/public-ip-list
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/public-ip-list';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "addresses": [
   "104.156.80.0/20",
   "151.101.0.0/16"
 ],
 "outboundAddresses": [
   "52.21.152.96/32"
 ]
}

Get a list of IP ranges the LaunchDarkly service uses. You can use this list to allow LaunchDarkly through your firewall. We post upcoming changes to this list in advance on our status page.

In the sandbox, click ‘Play’ and enter any string in the ‘Authorization’ field to test this endpoint.
Headers
AuthorizationstringRequired
Response
Public IP response
addresseslist of strings
A list of the IP addresses LaunchDarkly's service uses
outboundAddresseslist of strings
A list of the IP addresses outgoing webhook notifications use
Errors
429
Get Ips Request Too Many Requests Error
Was this page helpful?
Yes

Gets the OpenAPI spec in json
GET
https://app.launchdarkly.com/api/v2/openapi.json
GET
/api/v2/openapi.json
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/openapi.json';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Get the latest version of the OpenAPI specification for LaunchDarkly's API in JSON format. In the sandbox, click 'Play' and enter any string in the 'Authorization' field to test this endpoint.
Headers
AuthorizationstringRequired
Errors
429
Get Openapi Spec Request Too Many Requests Error
Get version information
GET
https://app.launchdarkly.com/api/v2/versions
GET
/api/v2/versions
JavaScript
const url = 'https://app.launchdarkly.com/api/v2/versions';
const options = {method: 'GET', headers: {Authorization: '<apiKey>'}};


try {
 const response = await fetch(url, options);
 const data = await response.json();
 console.log(data);
} catch (error) {
 console.error(error);
}

Try it
Retrieved
{
 "validVersions": [
   1
 ],
 "latestVersion": 1,
 "currentVersion": 1,
 "beta": false
}

Get the latest API version, the list of valid API versions in ascending order, and the version being used for this request. These are all in the external, date-based format.
Headers
AuthorizationstringRequired
Response
Versions information response
validVersionslist of integers
A list of all valid API versions. To learn more about our versioning, read Versioning.
latestVersioninteger
The most recently released version of the API
currentVersioninteger
The version of the API currently in use. Typically this is the API version specified for your access token. If you add the LD-API-Version: beta header to your request, this will be equal to the latestVersion.
betaboolean or null
Whether the version of the API currently is use is a beta version. This is always true if you add the LD-API-Version: beta header to your request.
Errors
401
Get Versions Request Unauthorized Error
403
Get Versions Request Forbidden Error
429
Get Versions Request Too Many Requests Error
Was this page helpful?
Yes


