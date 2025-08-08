# Google OAuth 2.0 Integration Guide

## Document Overview

This comprehensive guide covers Google's OAuth 2.0 implementation for Parker Flight's integration with Google services. It provides essential information for implementing secure authentication and authorization with Google APIs.

### Quick Start Guide

**Essential Prerequisites:**
- Google Cloud Platform project setup
- OAuth 2.0 client credentials from Google API Console
- Understanding of OAuth 2.0 flow patterns
- SSL/HTTPS enabled for production endpoints

**Core Implementation Steps:**
1. [Obtain OAuth 2.0 credentials](#basic-steps) from Google API Console
2. [Configure application type](#basic-steps) (web, mobile, desktop, service account)
3. [Implement authorization flow](#scenarios) based on your platform
4. [Handle token management](#token-size) and refresh logic
5. [Scope permission management](#oauth-20-scopes-for-google-apis)

### Core Workflows

#### Primary Authentication Patterns
- **Web Server Applications**: Server-side OAuth flow with authorization codes
- **Client-side (JavaScript)**: Browser-based implicit flow for SPAs
- **Installed Applications**: Native app flow with PKCE
- **Limited Input Devices**: Device flow for TVs, IoT devices
- **Service Accounts**: Server-to-server authentication without user consent

#### Token Management
- **Access Tokens**: Short-lived (typically 1 hour) for API requests
- **Refresh Tokens**: Long-lived tokens for obtaining new access tokens
- **Token Validation**: Verify token scopes and expiration
- **Token Revocation**: Handle user revocation and token expiry

### Integration Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Parker App    │    │  Google OAuth    │    │  Google APIs    │
│                 │────│   Authorization  │────│                 │
│ - Auth Handler  │    │     Server       │    │ - Gmail API     │
│ - Token Store   │    │                  │    │ - Calendar API  │
│ - API Client    │    │                  │    │ - Drive API     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Critical Implementation Notes

⚠️ **Security Considerations**
- Never expose client secrets in client-side code
- Use HTTPS for all OAuth flows in production
- Implement CSRF protection with state parameters
- Validate redirect URIs strictly
- Store refresh tokens securely with encryption

⚠️ **Token Limitations**
- Access tokens: Maximum 2048 bytes
- Refresh tokens: Maximum 512 bytes, expire after 6 months of inactivity
- Authorization codes: Maximum 256 bytes
- Rate limits: 100 refresh tokens per client per user

### Scope Management Strategy

**Incremental Authorization Approach:**
- Request minimal scopes initially
- Add scopes as features are used
- Handle scope upgrades gracefully
- Provide clear permission explanations to users

**Common Scopes for Parker Flight:**
- `userinfo.email`: Basic user identification
- `userinfo.profile`: User profile information
- `calendar`: Travel calendar integration
- `gmail.readonly`: Flight confirmation emails
- Custom scopes based on integration needs

### Error Handling Strategy

**Common Error Scenarios:**
- `invalid_grant`: Refresh token expired or revoked
- `admin_policy_enforced`: Organization policy restrictions
- `invalid_scope`: Requested scope not available
- `access_denied`: User denied permission
- `rate_limit_exceeded`: Too many token requests

**Recovery Strategies:**
- Implement exponential backoff for rate limits
- Graceful degradation when scopes are denied
- Re-authentication flow for expired refresh tokens
- Clear error messaging to users

### Testing & Validation

**Development Testing:**
- Use OAuth 2.0 Playground for flow testing
- Test with different application types
- Validate token exchange flows
- Test scope permission scenarios

**Production Checklist:**
- [ ] SSL/HTTPS enabled for all endpoints
- [ ] Redirect URIs properly configured
- [ ] Client secrets secured (server-side only)
- [ ] Token storage encrypted
- [ ] Error handling implemented
- [ ] Logging configured (without token exposure)
- [ ] Rate limiting handled
- [ ] User consent flows tested

### Common Integration Gotchas

1. **Client Type Confusion**: Using wrong client type (web vs native)
2. **Scope Mismatch**: Requesting scopes not matching API requirements
3. **Refresh Token Loss**: Not handling refresh token expiration
4. **State Parameter**: Missing CSRF protection in flows
5. **Token Storage**: Insecure storage of sensitive tokens
6. **Cross-Client Auth**: Not leveraging cross-client authorization

### Parker Flight Integration Status

**Current Implementation:**
- ✅ Basic OAuth 2.0 flow setup
- ✅ User authentication
- ⏳ Email integration (Gmail API)
- ⏳ Calendar integration
- ❌ Advanced scope management
- ❌ Service account integration

**Next Steps:**
1. Implement Gmail API integration for flight confirmations
2. Add Google Calendar integration for travel planning
3. Implement proper token refresh handling
4. Add incremental authorization
5. Set up service account for background tasks

### Strategic Context

This Google OAuth integration enables Parker Flight to:
- **Authenticate users** securely with Google accounts
- **Access Gmail** for flight confirmation parsing
- **Integrate calendars** for travel itinerary management
- **Leverage Google services** for enhanced user experience
- **Maintain security** through industry-standard OAuth flows

---

## Technical Implementation Details
























Home
Products
Google Identity
Google Account Authorization
Was this helpful?
Send feedback
Using OAuth 2.0 to Access Google APIs
bookmark_border
Note: Use of Google's implementation of OAuth 2.0 is governed by the OAuth 2.0 Policies.
Google APIs use the OAuth 2.0 protocol for authentication and authorization. Google supports common OAuth 2.0 scenarios such as those for web server, client-side, installed, and limited-input device applications.
To begin, obtain OAuth 2.0 client credentials from the Google API Console. Then your client application requests an access token from the Google Authorization Server, extracts a token from the response, and sends the token to the Google API that you want to access. For an interactive demonstration of using OAuth 2.0 with Google (including the option to use your own client credentials), experiment with the OAuth 2.0 Playground.
This page gives an overview of the OAuth 2.0 authorization scenarios that Google supports, and provides links to more detailed content. For details about using OAuth 2.0 for authentication, see OpenID Connect.
Note: Given the security implications of getting the implementation correct, we strongly encourage you to use OAuth 2.0 libraries when interacting with Google's OAuth 2.0 endpoints. It is a best practice to use well-debugged code provided by others, and it will help you protect yourself and your users. For more information, see Client libraries.
Basic steps
All applications follow a basic pattern when accessing a Google API using OAuth 2.0. At a high level, you follow five steps:
1. Obtain OAuth 2.0 credentials from the Google API Console.
Visit the Google API Console to obtain OAuth 2.0 credentials such as a client ID and client secret that are known to both Google and your application. The set of values varies based on what type of application you are building. For example, a JavaScript application does not require a secret, but a web server application does.
You must create an OAuth client appropriate for the platform on which your app will run, for example:
code
For server-side or JavaScript web apps use the "web" client type. Do not use this client type for any other application, such as native or mobile apps.
android
For Android apps, use the "Android" client type.
For iOS and macOS apps, use the "iOS" client type.
grid_view
For Universal Windows Platform apps, use the "Universal Windows Platform" client type.
tv
For limited input devices, such as TV or embedded devices, use the "TVs and Limited Input devices" client type.
host
For server-to-server interactions, use service accounts.
2. Obtain an access token from the Google Authorization Server.
Before your application can access private data using a Google API, it must obtain an access token that grants access to that API. A single access token can grant varying degrees of access to multiple APIs. A variable parameter called scope controls the set of resources and operations that an access token permits. During the access-token request, your application sends one or more values in the scope parameter.
There are several ways to make this request, and they vary based on the type of application you are building. For example, a JavaScript application might request an access token using a browser redirect to Google, while an application installed on a device that has no browser uses web service requests.
Some requests require an authentication step where the user logs in with their Google account. After logging in, the user is asked whether they are willing to grant one or more permissions that your application is requesting. This process is called user consent.
If the user grants at least one permission, the Google Authorization Server sends your application an access token (or an authorization code that your application can use to obtain an access token) and a list of scopes of access granted by that token. If the user does not grant the permission, the server returns an error.
It is generally a best practice to request scopes incrementally, at the time access is required, rather than up front. For example, an app that wants to support saving an event to a calendar should not request Google Calendar access until the user presses the "Add to Calendar" button; see Incremental authorization.
3. Examine scopes of access granted by the user.
Compare the scopes included in the access token response to the scopes required to access features and functionality of your application dependent upon access to a related Google API. Disable any features of your app unable to function without access to the related API.
The scope included in your request may not match the scope included in your response, even if the user granted all requested scopes. Refer to the documentation for each Google API for the scopes required for access. An API may map multiple scope string values to a single scope of access, returning the same scope string for all values allowed in the request. Example: the Google People API may return a scope of https://www.googleapis.com/auth/contacts when an app requested a user authorize a scope of https://www.google.com/m8/feeds/; the Google People API method people.updateContact requires a granted scope of https://www.googleapis.com/auth/contacts.
4. Send the access token to an API.
After an application obtains an access token, it sends the token to a Google API in an HTTP Authorization request header. It is possible to send tokens as URI query-string parameters, but we don't recommend it, because URI parameters can end up in log files that are not completely secure. Also, it is good REST practice to avoid creating unnecessary URI parameter names.
Access tokens are valid only for the set of operations and resources described in the scope of the token request. For example, if an access token is issued for the Google Calendar API, it does not grant access to the Google Contacts API. You can, however, send that access token to the Google Calendar API multiple times for similar operations.
5. Refresh the access token, if necessary.
Access tokens have limited lifetimes. If your application needs access to a Google API beyond the lifetime of a single access token, it can obtain a refresh token. A refresh token allows your application to obtain new access tokens.
Note: Save refresh tokens in secure long-term storage and continue to use them as long as they remain valid. Limits apply to the number of refresh tokens that are issued per client-user combination, and per user across all clients, and these limits are different. If your application requests enough refresh tokens to go over one of the limits, older refresh tokens stop working.
Scenarios
Web server applications
The Google OAuth 2.0 endpoint supports web server applications that use languages and frameworks such as PHP, Java, Go, Python, Ruby, and ASP.NET.
The authorization sequence begins when your application redirects a browser to a Google URL; the URL includes query parameters that indicate the type of access being requested. Google handles the user authentication, session selection, and user consent. The result is an authorization code, which the application can exchange for an access token and a refresh token.
The application should store the refresh token for future use and use the access token to access a Google API. Once the access token expires, the application uses the refresh token to obtain a new one.

For details, see Using OAuth 2.0 for Web Server Applications.
Installed applications
The Google OAuth 2.0 endpoint supports applications that are installed on devices such as computers, mobile devices, and tablets. When you create a client ID through the Google API Console, specify that this is an Installed application, then select Android, Chrome app, iOS, Universal Windows Platform (UWP), or Desktop app as the application type.
The process results in a client ID and, in some cases, a client secret, which you embed in the source code of your application. (In this context, the client secret is obviously not treated as a secret.)
The authorization sequence begins when your application redirects a browser to a Google URL; the URL includes query parameters that indicate the type of access being requested. Google handles the user authentication, session selection, and user consent. The result is an authorization code, which the application can exchange for an access token and a refresh token.
The application should store the refresh token for future use and use the access token to access a Google API. Once the access token expires, the application uses the refresh token to obtain a new one.

For details, see Using OAuth 2.0 for Installed Applications.
Client-side (JavaScript) applications
The Google OAuth 2.0 endpoint supports JavaScript applications that run in a browser.
The authorization sequence begins when your application redirects a browser to a Google URL; the URL includes query parameters that indicate the type of access being requested. Google handles the user authentication, session selection, and user consent.
The result is an access token, which the client should validate before including it in a Google API request. When the token expires, the application repeats the process.

For details, see Using OAuth 2.0 for Client-side Applications.
Applications on limited-input devices
The Google OAuth 2.0 endpoint supports applications that run on limited-input devices such as game consoles, video cameras, and printers.
The authorization sequence begins with the application making a web service request to a Google URL for an authorization code. The response contains several parameters, including a URL and a code that the application shows to the user.
The user obtains the URL and code from the device, then switches to a separate device or computer with richer input capabilities. The user launches a browser, navigates to the specified URL, logs in, and enters the code.
Meanwhile, the application polls a Google URL at a specified interval. After the user approves access, the response from the Google server contains an access token and refresh token. The application should store the refresh token for future use and use the access token to access a Google API. Once the access token expires, the application uses the refresh token to obtain a new one.

For details, see Using OAuth 2.0 for Devices.
Service accounts
Google APIs such as the Prediction API and Google Cloud Storage can act on behalf of your application without accessing user information. In these situations your application needs to prove its own identity to the API, but no user consent is necessary. Similarly, in enterprise scenarios, your application can request delegated access to some resources.
For these types of server-to-server interactions you need a service account, which is an account that belongs to your application instead of to an individual end-user. Your application calls Google APIs on behalf of the service account, and user consent is not required. (In non-service-account scenarios, your application calls Google APIs on behalf of end-users, and user consent is sometimes required.)
Note: These service-account scenarios require applications to create and cryptographically sign JSON Web Tokens (JWTs). We strongly encourage you to use a library to perform these tasks. If you write this code without using a library that abstracts token creation and signing, you might make errors that would have a severe impact on the security of your application. For a list of libraries that support this scenario, see the service-account documentation.
A service account's credentials, which you obtain from the Google API Console, include a generated email address that is unique, a client ID, and at least one public/private key pair. You use the client ID and one private key to create a signed JWT and construct an access-token request in the appropriate format. Your application then sends the token request to the Google OAuth 2.0 Authorization Server, which returns an access token. The application uses the token to access a Google API. When the token expires, the application repeats the process.

For details, see the service-account documentation.
Note: Although you can use service accounts in applications that run from a Google Workspace domain, service accounts are not members of your Google Workspace account and aren’t subject to domain policies set by Google Workspace administrators. For example, a policy set in the Google Workspace admin console to restrict the ability of Google Workspace end users to share documents outside of the domain would not apply to service accounts.
Token size
Tokens can vary in size, up to the following limits:
code
Authorization codes
256 bytes
contextual_token
Access tokens
2048 bytes
restore_page
Refresh tokens
512 bytes
Access tokens returned by Google Cloud's Security Token Service API are structured similarly to Google API OAuth 2.0 access tokens but have different token size limits. For details, see the API documentation.
Google reserves the right to change token size within these limits, and your application must support variable token sizes accordingly.
Refresh token expiration
You must write your code to anticipate the possibility that a granted refresh token might no longer work. A refresh token might stop working for one of these reasons:
shield_locked
The user has revoked your app's access.
The refresh token has not been used for six months.
The user changed passwords and the refresh token contains Gmail scopes.
The user account has exceeded a maximum number of granted (live) refresh tokens.
The user granted time-based access to your app and the access expired.
If an admin set any of the services requested in your app's scopes to Restricted (the error is admin_policy_enforced).
cloud_lock
For Google Cloud Platform APIs - the session length set by the admin could have been exceeded.
A Google Cloud Platform project with an OAuth consent screen configured for an external user type and a publishing status of "Testing" is issued a refresh token expiring in 7 days, unless the only OAuth scopes requested are a subset of name, email address, and user profile (through the userinfo.email, userinfo.profile, openid scopes, or their OpenID Connect equivalents).
There is currently a limit of 100 refresh tokens per Google Account per OAuth 2.0 client ID. If the limit is reached, creating a new refresh token automatically invalidates the oldest refresh token without warning. This limit does not apply to service accounts.
There is also a larger limit on the total number of refresh tokens a user account or service account can have across all clients. Most normal users won't exceed this limit but a developer's account used to test an implementation might.
If you need to authorize multiple programs, machines, or devices, one workaround is to limit the number of clients that you authorize per Google Account to 15 or 20. If you are a Google Workspace admin, you can create additional users with administrative privileges and use them to authorize some of the clients.
Dealing with session control policies for Google Cloud Platform (GCP) organizations 
Administrators of GCP organizations might require frequent reauthentication of users while they access GCP resources, using the Google Cloud session control feature. This policy impacts access to Google Cloud Console, the Google Cloud SDK (also known as the gcloud CLI), and any third party OAuth application that requires the Cloud Platform scope. If a user has a session control policy in place then on the expiry of the session duration, your API calls will error out similar to what would happen if the refresh token was revoked - the call will fail with an error type invalid_grant; the error_subtype field can be used to distinguish between a revoked token and a failure due to a session control policy (for example, "error_subtype": "invalid_rapt"). As session durations can be very limited (between 1 hour to 24 hours), this scenario must be handled gracefully by restarting an auth session.
Equally, you must not use, or encourage the use of, user credentials for server-to-server deployment. If user credentials are deployed on a server for long running jobs or operations and a customer applies session control policies on such users, the server application will fail as there will be no way to re-authenticate the user when the session duration expires.
For more information on how to help your customers deploy this feature, refer to this admin-focussed help article.
Client libraries
The following client libraries integrate with popular frameworks, which makes implementing OAuth 2.0 simpler. More features will be added to the libraries over time.
Google API Client Library for Java
Google API Client Library for Python
Google API Client Library for Go
Google API Client Library for .NET
Google API Client Library for Ruby
Google API Client Library for PHP
Google API Client Library for JavaScript
GTMAppAuth - OAuth Client Library for Mac and iOS
Was this helpful?
Send feedback
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-05-19 UTC.
GitHub
Fork our samples and try them yourself
Stack Overflow
Ask a question under the google-oauth tag
Blog
The latest news on the Google Developers blog
Product Info
Terms of Service
APIs User Data Policy
Branding Guidelines
Stack Overflow
Google Identity
Sign In With Google
Google OAuth 2.0 and OpenID Connect
Google Account Linking
Developer consoles
Google API Console
Google Cloud Platform Console
Google Play Console
Firebase Console
Actions on Google Console
Cast SDK Developer Console
Chrome Web Store Dashboard
Google Home Developer Console

Android
Chrome
Firebase
Google Cloud Platform
Google AI
All products
Terms
Privacy
Sign up for the Google for Developers newsletterSubscribe
English
Page info
bug_reportfullscreenclose
On this page


























Key Takeaways
AI-GENERATED
Google APIs use OAuth 2.0 for secure access to user data, requiring applications to obtain credentials and access tokens.
Different application types have specific OAuth 2.0 flows, including web server, installed, client-side, and service accounts.
Refresh tokens enable long-term access but can expire due to various factors, such as user revocation or inactivity.
Service accounts allow server-to-server interactions without user consent using JWTs for authentication.
Client libraries are available to simplify OAuth 2.0 implementation and ensure security best practices.
outlined_flag
Google Developer Program dialog opened
Skip to main content

Authentication
Authorization
Account Authorization
Account Linking
Cross-platform
Cross-Account Protection (RISC)
/
English
Google Account Authorization
App verification to use Google Authorization APIs
Google Account Linking
Resources
























Authorization
Was this helpful?
Cross-client Identity
bookmark_border
When developers build software, it routinely includes modules that run on a web server, other modules that run in the browser, and others that run as native mobile apps. Both developers and the people who use their software typically think of all these modules as part of a single app.
Google’s OAuth 2.0 implementation supports this view of the world. To use any of the OAuth2.0-based services, you must set up your software in the Google API Console. The unit of organization in the API Console is a "project," which can correspond to a multi-component app. For each project, you can provide branding information, and you must specify which APIs the app will access. Each component of a multi-component app is identified by a client ID, a unique string that is generated in the API Console.
Cross-client authorization goals
When an app uses OAuth 2.0 for authorization, the app acts on a user's behalf to request an OAuth 2.0 access token for access to a resource, which the app identifies by one or more scope strings. Normally, the user is asked to approve the access.
When a user grants access to your app for a particular scope, the user is looking at the user consent screen, which includes project-level product branding that you set up in the Google API Console. Therefore, Google considers that when a user has granted access to a particular scope to any client ID in a project, the grant indicates the user's trust in the whole application for that scope.
The effect is that the user should not be prompted to approve access to any resource more than once for the same logical application, whenever the components of the application can be reliably authenticated by Google's authorization infrastructure, which today includes web apps, Android apps, Chrome apps, iOS apps, native desktop apps, and limited-input devices.
Cross-client access tokens
Software can obtain OAuth 2.0 Access tokens in a variety of ways, depending on the platform where the code is running. For details, see Using OAuth 2.0 to Access Google APIs. Normally, user approval is required when granting an access token.
Fortunately, the Google authorization infrastructure can use information about user approvals for a client ID within a given project when evaluating whether to authorize others in the same project.
The effect is that if an Android app requests an access token for a particular scope, and the requesting user has already granted approval to a web application in the same project for that same scope, the user will not be asked once again to approve. This works both ways: if access to a scope has been granted in your Android app, it will not be demanded again from another client in the same project such as a web application.
Was this helpful?
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-05-19 UTC.
Connect
Blog
Instagram
LinkedIn
X (Twitter)
YouTube
Programs
Google Developer Groups
Google Developer Experts
Accelerators
Women Techmakers
Google Cloud & NVIDIA
Developer consoles
Google API Console
Google Cloud Platform Console
Google Play Console
Firebase Console
Actions on Google Console
Cast SDK Developer Console
Chrome Web Store Dashboard
Google Home Developer Console

Android
Chrome
Firebase
Google Cloud Platform
Google AI
All products
Terms
Privacy
Sign up for the Google for Developers newsletterSubscribe
English
Page info
bug_reportfullscreenclose
On this page




Key Takeaways
AI-GENERATED
Google's OAuth 2.0 implementation allows developers to manage authorization for multi-component applications (web, mobile, etc.) under a single project in the Google API Console.
User consent for a specific scope granted to one component (e.g., web app) within a project is extended to other components (e.g., Android app) in the same project, streamlining the authorization process and preventing redundant prompts.
Client IDs, unique identifiers for each application component, are used by Google's authorization infrastructure to manage and track access permissions within a project.
This cross-client authorization ensures a seamless user experience by recognizing prior user consent and leveraging it across different parts of the same application.
Developers can obtain OAuth 2.0 access tokens using various methods depending on the platform, and Google's infrastructure uses existing user approvals to minimize authorization requests.
outlined_flag
The new page has loaded.
Skip to main content

Authentication
Authorization
Cross-platform
Cross-Account Protection (RISC)
/
English
Google Account Authorization
App verification to use Google Authorization APIs
Google Account Linking
Resources
























Authorization
Was this helpful?
OAuth 2.0 Scopes for Google APIs
bookmark_border
This document lists the OAuth 2.0 scopes that you might need to request to access Google APIs, depending on the level of access you need. Sensitive scopes require review by Google and have a sensitive indicator on the Google Cloud Console's OAuth consent screen configuration page. Many scopes overlap, so it's best to use a scope that isn't sensitive. For information about each method's scope requirements, see the individual API documentation.
If your public application uses scopes that permit access to certain user data, it must complete a verification process. If you see unverified app on the screen when testing your application, you must submit a verification request to remove it. Find out more about unverified apps and get answers to frequently asked questions about app verification in the Help Center.
Access Approval API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Access Context Manager API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Ad Exchange Buyer API II, v2beta1
Scope
Description
https://www.googleapis.com/auth/adexchange.buyer
Manage your Ad Exchange buyer account configuration

Address Validation API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Admin SDK API, v1
Scope
Description
https://www.googleapis.com/auth/admin.chrome.printers
See, add, edit, and permanently delete the printers that your organization can use with Chrome
https://www.googleapis.com/auth/admin.chrome.printers.readonly
See the printers that your organization can use with Chrome
https://www.googleapis.com/auth/admin.directory.customer
View and manage customer related information
https://www.googleapis.com/auth/admin.directory.customer.readonly
View customer related information
https://www.googleapis.com/auth/admin.directory.device.chromeos
View and manage your ChromeOS devices' metadata
https://www.googleapis.com/auth/admin.directory.device.chromeos.readonly
View your ChromeOS devices' metadata
https://www.googleapis.com/auth/admin.directory.device.mobile
View and manage your mobile devices' metadata
https://www.googleapis.com/auth/admin.directory.device.mobile.action
Manage your mobile devices by performing administrative tasks
https://www.googleapis.com/auth/admin.directory.device.mobile.readonly
View your mobile devices' metadata
https://www.googleapis.com/auth/admin.directory.domain
View and manage the provisioning of domains for your customers
https://www.googleapis.com/auth/admin.directory.domain.readonly
View domains related to your customers
https://www.googleapis.com/auth/admin.directory.group
View and manage the provisioning of groups on your domain
https://www.googleapis.com/auth/admin.directory.group.member
View and manage group subscriptions on your domain
https://www.googleapis.com/auth/admin.directory.group.member.readonly
View group subscriptions on your domain
https://www.googleapis.com/auth/admin.directory.group.readonly
View groups on your domain
https://www.googleapis.com/auth/admin.directory.orgunit
View and manage organization units on your domain
https://www.googleapis.com/auth/admin.directory.orgunit.readonly
View organization units on your domain
https://www.googleapis.com/auth/admin.directory.resource.calendar
View and manage the provisioning of calendar resources on your domain
https://www.googleapis.com/auth/admin.directory.resource.calendar.readonly
View calendar resources on your domain
https://www.googleapis.com/auth/admin.directory.rolemanagement
Manage delegated admin roles for your domain
https://www.googleapis.com/auth/admin.directory.rolemanagement.readonly
View delegated admin roles for your domain
https://www.googleapis.com/auth/admin.directory.user
View and manage the provisioning of users on your domain
https://www.googleapis.com/auth/admin.directory.user.alias
View and manage user aliases on your domain
https://www.googleapis.com/auth/admin.directory.user.alias.readonly
View user aliases on your domain
https://www.googleapis.com/auth/admin.directory.user.readonly
See info about users on your domain
https://www.googleapis.com/auth/admin.directory.user.security
Manage data access permissions for users on your domain
https://www.googleapis.com/auth/admin.directory.userschema
View and manage the provisioning of user schemas on your domain
https://www.googleapis.com/auth/admin.directory.userschema.readonly
View user schemas on your domain
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Admin SDK Data Transfer API, v1
Scope
Description
https://www.googleapis.com/auth/admin.datatransfer
View and manage data transfers between users in your organization
https://www.googleapis.com/auth/admin.datatransfer.readonly
View data transfers between users in your organization

Admin SDK Reports API, v1
Scope
Description
https://www.googleapis.com/auth/admin.reports.audit.readonly
View audit reports for your G Suite domain
https://www.googleapis.com/auth/admin.reports.usage.readonly
View usage reports for your G Suite domain

AdMob API, v1
Scope
Description
https://www.googleapis.com/auth/admob.readonly
See your AdMob data
https://www.googleapis.com/auth/admob.report
See your AdMob data

AdSense Management API, v2
Scope
Description
https://www.googleapis.com/auth/adsense
View and manage your AdSense data
https://www.googleapis.com/auth/adsense.readonly
View your AdSense data

AdSense Platform API, v1
Scope
Description
https://www.googleapis.com/auth/adsense
View and manage your AdSense data
https://www.googleapis.com/auth/adsense.readonly
View your AdSense data

Advisory Notifications API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

AI Platform Training & Prediction API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloud-platform.read-only
View your data across Google Cloud services and see the email address of your Google Account

Air Quality API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

AlloyDB API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Analytics Hub API, v1
Scope
Description
https://www.googleapis.com/auth/bigquery
View and manage your data in Google BigQuery and see the email address for your Google Account
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Android Management API, v1
Scope
Description
https://www.googleapis.com/auth/androidmanagement
Manage Android devices and apps for your customers

API Gateway API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

API hub API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

API Keys API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloud-platform.read-only
View your data across Google Cloud services and see the email address of your Google Account

API Management API, v1alpha
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Apigee API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Apigee Registry API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

App Engine Admin API, v1
Scope
Description
https://www.googleapis.com/auth/appengine.admin
View and manage your applications deployed on Google App Engine
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloud-platform.read-only
View your data across Google Cloud services and see the email address of your Google Account

App Hub API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Application Integration API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Apps Script API, v1
Scope
Description
https://mail.google.com/
Read, compose, send, and permanently delete all your email from Gmail
https://www.google.com/calendar/feeds
See, edit, share, and permanently delete all the calendars you can access using Google Calendar
https://www.google.com/m8/feeds
See, edit, download, and permanently delete your contacts
https://www.googleapis.com/auth/admin.directory.group
View and manage the provisioning of groups on your domain
https://www.googleapis.com/auth/admin.directory.user
View and manage the provisioning of users on your domain
https://www.googleapis.com/auth/documents
See, edit, create, and delete all your Google Docs documents
https://www.googleapis.com/auth/drive
See, edit, create, and delete all of your Google Drive files
https://www.googleapis.com/auth/forms
View and manage your forms in Google Drive
https://www.googleapis.com/auth/forms.currentonly
View and manage forms that this application has been installed in
https://www.googleapis.com/auth/groups
View and manage your Google Groups
https://www.googleapis.com/auth/script.deployments
Create and update Google Apps Script deployments
https://www.googleapis.com/auth/script.deployments.readonly
View Google Apps Script deployments
https://www.googleapis.com/auth/script.metrics
View Google Apps Script project's metrics
https://www.googleapis.com/auth/script.processes
View Google Apps Script processes
https://www.googleapis.com/auth/script.projects
Create and update Google Apps Script projects
https://www.googleapis.com/auth/script.projects.readonly
View Google Apps Script projects
https://www.googleapis.com/auth/spreadsheets
See, edit, create, and delete all your Google Sheets spreadsheets
https://www.googleapis.com/auth/userinfo.email
See your primary Google Account email address

Area120 Tables API, v1alpha1
Scope
Description
https://www.googleapis.com/auth/drive
See, edit, create, and delete all of your Google Drive files
https://www.googleapis.com/auth/drive.file
See, edit, create, and delete only the specific Google Drive files you use with this app
https://www.googleapis.com/auth/drive.readonly
See and download all your Google Drive files
https://www.googleapis.com/auth/spreadsheets
See, edit, create, and delete all your Google Sheets spreadsheets
https://www.googleapis.com/auth/spreadsheets.readonly
See all your Google Sheets spreadsheets
https://www.googleapis.com/auth/tables
See, edit, create, and delete your tables in Tables by Area 120

Artifact Registry API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloud-platform.read-only
View your data across Google Cloud services and see the email address of your Google Account

Assured Workloads API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Authorized Buyers Marketplace API, v1
Scope
Description
https://www.googleapis.com/auth/authorized-buyers-marketplace
See, create, edit, and delete your Authorized Buyers Marketplace entities.

Backup and DR Service API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Backup for GKE API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Bare Metal Solution API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Batch API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

BeyondCorp API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

BigLake API, v1
Scope
Description
https://www.googleapis.com/auth/bigquery
View and manage your data in Google BigQuery and see the email address for your Google Account
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

BigQuery API, v2
Scope
Description
https://www.googleapis.com/auth/bigquery
View and manage your data in Google BigQuery and see the email address for your Google Account
https://www.googleapis.com/auth/bigquery.insertdata
Insert data into Google BigQuery
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloud-platform.read-only
View your data across Google Cloud services and see the email address of your Google Account
https://www.googleapis.com/auth/devstorage.full_control
Manage your data and permissions in Cloud Storage and see the email address for your Google Account
https://www.googleapis.com/auth/devstorage.read_only
View your data in Google Cloud Storage
https://www.googleapis.com/auth/devstorage.read_write
Manage your data in Cloud Storage and see the email address of your Google Account

BigQuery Connection API, v1
Scope
Description
https://www.googleapis.com/auth/bigquery
View and manage your data in Google BigQuery and see the email address for your Google Account
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

BigQuery Data Policy API, v1
Scope
Description
https://www.googleapis.com/auth/bigquery
View and manage your data in Google BigQuery and see the email address for your Google Account
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

BigQuery Data Transfer API, v1
Scope
Description
https://www.googleapis.com/auth/bigquery
View and manage your data in Google BigQuery and see the email address for your Google Account
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloud-platform.read-only
View your data across Google Cloud services and see the email address of your Google Account

BigQuery Reservation API, v1
Scope
Description
https://www.googleapis.com/auth/bigquery
View and manage your data in Google BigQuery and see the email address for your Google Account
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Binary Authorization API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Blockchain Node Engine API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Blogger API, v3
Scope
Description
https://www.googleapis.com/auth/blogger
Manage your Blogger account
https://www.googleapis.com/auth/blogger.readonly
View your Blogger account

Books API, v1
Scope
Description
https://www.googleapis.com/auth/books
Manage your books

Calendar API, v3
Scope
Description
https://www.googleapis.com/auth/calendar
See, edit, share, and permanently delete all the calendars you can access using Google Calendar
https://www.googleapis.com/auth/calendar.acls
See and change the sharing permissions of Google calendars you own
https://www.googleapis.com/auth/calendar.acls.readonly
See the sharing permissions of Google calendars you own
https://www.googleapis.com/auth/calendar.app.created
Make secondary Google calendars, and see, create, change, and delete events on them
https://www.googleapis.com/auth/calendar.calendarlist
See, add, and remove Google calendars you’re subscribed to
https://www.googleapis.com/auth/calendar.calendarlist.readonly
See the list of Google calendars you’re subscribed to
https://www.googleapis.com/auth/calendar.calendars
See and change the properties of Google calendars you have access to, and create secondary calendars
https://www.googleapis.com/auth/calendar.calendars.readonly
See the title, description, default time zone, and other properties of Google calendars you have access to
https://www.googleapis.com/auth/calendar.events
View and edit events on all your calendars
https://www.googleapis.com/auth/calendar.events.freebusy
See the availability on Google calendars you have access to
https://www.googleapis.com/auth/calendar.events.owned
See, create, change, and delete events on Google calendars you own
https://www.googleapis.com/auth/calendar.events.owned.readonly
See the events on Google calendars you own
https://www.googleapis.com/auth/calendar.events.public.readonly
See the events on public calendars
https://www.googleapis.com/auth/calendar.events.readonly
View events on all your calendars
https://www.googleapis.com/auth/calendar.freebusy
View your availability in your calendars
https://www.googleapis.com/auth/calendar.readonly
See and download any calendar you can access using your Google Calendar
https://www.googleapis.com/auth/calendar.settings.readonly
View your Calendar settings

Campaign Manager 360 API, v4
Scope
Description
https://www.googleapis.com/auth/ddmconversions
Manage DoubleClick Digital Marketing conversions
https://www.googleapis.com/auth/dfareporting
View and manage DoubleClick for Advertisers reports
https://www.googleapis.com/auth/dfatrafficking
View and manage your DoubleClick Campaign Manager's (DCM) display ad campaigns

Certificate Authority API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Certificate Manager API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Chrome Management API, v1
Scope
Description
https://www.googleapis.com/auth/chrome.management.appdetails.readonly
See detailed information about apps installed on Chrome browsers and devices managed by your organization
https://www.googleapis.com/auth/chrome.management.profiles
See, edit, delete, and take other necessary actions on Chrome browser profiles managed by your organization
https://www.googleapis.com/auth/chrome.management.profiles.readonly
See Chrome browser profiles managed by your organization
https://www.googleapis.com/auth/chrome.management.reports.readonly
See reports about devices and Chrome browsers managed within your organization
https://www.googleapis.com/auth/chrome.management.telemetry.readonly
See basic device and telemetry information collected from ChromeOS devices or users managed within your organization

Chrome Policy API, v1
Scope
Description
https://www.googleapis.com/auth/chrome.management.policy
See, edit, create or delete policies applied to ChromeOS and Chrome Browsers managed within your organization
https://www.googleapis.com/auth/chrome.management.policy.readonly
See policies applied to ChromeOS and Chrome Browsers managed within your organization

Chrome Verified Access API, v2
Scope
Description
https://www.googleapis.com/auth/verifiedaccess
Verify your enterprise credentials

Cloud Asset API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Bigtable Admin API, v2
Scope
Description
https://www.googleapis.com/auth/bigtable.admin
Administer your Cloud Bigtable tables and clusters
https://www.googleapis.com/auth/bigtable.admin.cluster
Administer your Cloud Bigtable clusters
https://www.googleapis.com/auth/bigtable.admin.instance
Administer your Cloud Bigtable clusters
https://www.googleapis.com/auth/bigtable.admin.table
Administer your Cloud Bigtable tables
https://www.googleapis.com/auth/cloud-bigtable.admin
Administer your Cloud Bigtable tables and clusters
https://www.googleapis.com/auth/cloud-bigtable.admin.cluster
Administer your Cloud Bigtable clusters
https://www.googleapis.com/auth/cloud-bigtable.admin.table
Administer your Cloud Bigtable tables
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloud-platform.read-only
View your data across Google Cloud services and see the email address of your Google Account

Cloud Billing API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-billing
View and manage your Google Cloud Platform billing accounts
https://www.googleapis.com/auth/cloud-billing.readonly
View your Google Cloud Platform billing accounts
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Billing Budget API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-billing
View and manage your Google Cloud Platform billing accounts
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Build API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Channel API, v1
Scope
Description
https://www.googleapis.com/auth/apps.order
Manage users on your domain
https://www.googleapis.com/auth/apps.reports.usage.readonly
View usage reports for your G Suite domain

Cloud Composer API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Controls Partner API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Data Fusion API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Dataplex API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Dataproc API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Datastore API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/datastore
View and manage your Google Cloud Datastore data

Cloud Deploy API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Deployment Manager V2 API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloud-platform.read-only
View your data across Google Cloud services and see the email address of your Google Account
https://www.googleapis.com/auth/ndev.cloudman
View and manage your Google Cloud Platform management resources and deployment status information
https://www.googleapis.com/auth/ndev.cloudman.readonly
View your Google Cloud Platform management resources and deployment status information

Cloud DNS API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloud-platform.read-only
View your data across Google Cloud services and see the email address of your Google Account
https://www.googleapis.com/auth/ndev.clouddns.readonly
View your DNS records hosted by Google Cloud DNS
https://www.googleapis.com/auth/ndev.clouddns.readwrite
View and manage your DNS records hosted by Google Cloud DNS

Cloud Document AI API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Domains API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Filestore API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Firestore API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/datastore
View and manage your Google Cloud Datastore data

Cloud Functions API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Healthcare API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-healthcare
Read, write and manage healthcare data
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Identity API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-identity.devices.lookup
See your device details
https://www.googleapis.com/auth/cloud-identity.groups
See, change, create, and delete any of the Cloud Identity Groups that you can access, including the members of each group
https://www.googleapis.com/auth/cloud-identity.groups.readonly
See any Cloud Identity Groups that you can access, including group members and their emails
https://www.googleapis.com/auth/cloud-identity.inboundsso
See and edit all of the Inbound SSO profiles and their assignments to any Org Units or Google Groups in your Cloud Identity Organization.
https://www.googleapis.com/auth/cloud-identity.inboundsso.readonly
See all of the Inbound SSO profiles and their assignments to any Org Units or Google Groups in your Cloud Identity Organization.
https://www.googleapis.com/auth/cloud-identity.policies
See and edit policies in your Cloud Identity Organization.
https://www.googleapis.com/auth/cloud-identity.policies.readonly
See policies in your Cloud Identity Organization.
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Identity-Aware Proxy API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud IDS API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Key Management Service (KMS) API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloudkms
View and manage your keys and secrets stored in Cloud Key Management Service

Cloud Life Sciences API, v2beta
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Logging API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloud-platform.read-only
View your data across Google Cloud services and see the email address of your Google Account
https://www.googleapis.com/auth/logging.admin
Administrate log data for your projects
https://www.googleapis.com/auth/logging.read
View log data for your projects
https://www.googleapis.com/auth/logging.write
Submit log data for your projects

Cloud Memorystore for Memcached API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Monitoring API, v3
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/monitoring
View and write monitoring data for all of your Google and third-party Cloud and API projects
https://www.googleapis.com/auth/monitoring.read
View monitoring data for all of your Google Cloud and third-party projects
https://www.googleapis.com/auth/monitoring.write
Publish metric data to your Google Cloud projects

Cloud Natural Language API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-language
Apply machine learning models to reveal the structure and meaning of text
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud OS Login API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloud-platform.read-only
View your data across Google Cloud services and see the email address of your Google Account
https://www.googleapis.com/auth/compute
View and manage your Google Compute Engine resources
https://www.googleapis.com/auth/compute.readonly
View your Google Compute Engine resources

Cloud Profiler API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/monitoring
View and write monitoring data for all of your Google and third-party Cloud and API projects
https://www.googleapis.com/auth/monitoring.write
Publish metric data to your Google Cloud projects

Cloud Pub/Sub API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/pubsub
View and manage Pub/Sub topics and subscriptions

Cloud Resource Manager API, v3
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloud-platform.read-only
View your data across Google Cloud services and see the email address of your Google Account

Cloud Run Admin API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Runtime Configuration API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloudruntimeconfig
Manage your Google Cloud Platform services' runtime configuration

Cloud Scheduler API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Search API, v1
Scope
Description
https://www.googleapis.com/auth/cloud_search
Index and serve your organization's data with Cloud Search
https://www.googleapis.com/auth/cloud_search.debug
Index and serve your organization's data with Cloud Search
https://www.googleapis.com/auth/cloud_search.indexing
Index and serve your organization's data with Cloud Search
https://www.googleapis.com/auth/cloud_search.query
Search your organization's data in the Cloud Search index
https://www.googleapis.com/auth/cloud_search.settings
Index and serve your organization's data with Cloud Search
https://www.googleapis.com/auth/cloud_search.settings.indexing
Index and serve your organization's data with Cloud Search
https://www.googleapis.com/auth/cloud_search.settings.query
Index and serve your organization's data with Cloud Search
https://www.googleapis.com/auth/cloud_search.stats
Index and serve your organization's data with Cloud Search
https://www.googleapis.com/auth/cloud_search.stats.indexing
Index and serve your organization's data with Cloud Search

Cloud Shell API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Spanner API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/spanner.admin
Administer your Spanner databases
https://www.googleapis.com/auth/spanner.data
View and manage the contents of your Spanner databases

Cloud Speech-to-Text API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud SQL Admin API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/sqlservice.admin
Manage your Google SQL Service instances

Cloud Storage for Firebase API, v1beta
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/firebase
View and administer all your Firebase data and settings

Cloud Storage JSON API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
View and manage your data across Google Cloud Platform services
https://www.googleapis.com/auth/cloud-platform.read-only
View your data across Google Cloud Platform services
https://www.googleapis.com/auth/devstorage.full_control
Manage your data and permissions in Google Cloud Storage
https://www.googleapis.com/auth/devstorage.read_only
View your data in Google Cloud Storage
https://www.googleapis.com/auth/devstorage.read_write
Manage your data in Google Cloud Storage

Cloud Talent Solution API, v4
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/jobs
Manage job postings

Cloud Tasks API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Testing API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloud-platform.read-only
View your data across Google Cloud services and see the email address of your Google Account

Cloud Text-to-Speech API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Tool Results API, v1beta3
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud TPU API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Trace API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/trace.append
Write Trace data for a project or application

Cloud Translation API, v3
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloud-translation
Translate text from one language to another using Google Translate

Cloud Video Intelligence API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Cloud Vision API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloud-vision
Apply machine learning models to understand and label images

Cloud Workstations API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Compute Engine API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/compute
View and manage your Google Compute Engine resources
https://www.googleapis.com/auth/compute.readonly
View your Google Compute Engine resources
https://www.googleapis.com/auth/devstorage.full_control
Manage your data and permissions in Cloud Storage and see the email address for your Google Account
https://www.googleapis.com/auth/devstorage.read_only
View your data in Google Cloud Storage
https://www.googleapis.com/auth/devstorage.read_write
Manage your data in Cloud Storage and see the email address of your Google Account

Connectors API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Contact Center AI Insights API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Contact Center AI Platform API, v1alpha1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Container Analysis API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Content API for Shopping, v2.1
Scope
Description
https://www.googleapis.com/auth/content
Manage your product listings and accounts for Google Shopping

CSS API, v1
Scope
Description
https://www.googleapis.com/auth/content
Manage your product listings and accounts for Google Shopping

Data Labeling API, v1beta1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Data Lineage API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Data pipelines API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Data Portability API, v1
Scope
Description
https://www.googleapis.com/auth/dataportability.alerts.subscriptions
Move a copy of the Google Alerts subscriptions you created
https://www.googleapis.com/auth/dataportability.businessmessaging.conversations
Move a copy of messages between you and the businesses you have conversations with across Google services
https://www.googleapis.com/auth/dataportability.chrome.autofill
Move a copy of the information you entered into online forms in Chrome
https://www.googleapis.com/auth/dataportability.chrome.bookmarks
Move a copy of pages you bookmarked in Chrome
https://www.googleapis.com/auth/dataportability.chrome.dictionary
Move a copy of words you added to Chrome's dictionary
https://www.googleapis.com/auth/dataportability.chrome.extensions
Move a copy of extensions you installed from the Chrome Web Store
https://www.googleapis.com/auth/dataportability.chrome.history
Move a copy of sites you visited in Chrome
https://www.googleapis.com/auth/dataportability.chrome.reading_list
Move a copy of pages you added to your reading list in Chrome
https://www.googleapis.com/auth/dataportability.chrome.settings
Move a copy of your settings in Chrome
https://www.googleapis.com/auth/dataportability.discover.follows
Move a copy of searches and sites you follow, saved by Discover
https://www.googleapis.com/auth/dataportability.discover.likes
Move a copy of links to your liked documents, saved by Discover
https://www.googleapis.com/auth/dataportability.discover.not_interested
Move a copy of content you marked as not interested, saved by Discover
https://www.googleapis.com/auth/dataportability.maps.aliased_places
Move a copy of the places you labeled on Maps
https://www.googleapis.com/auth/dataportability.maps.commute_routes
Move a copy of your pinned trips on Maps
https://www.googleapis.com/auth/dataportability.maps.commute_settings
Move a copy of your commute settings on Maps
https://www.googleapis.com/auth/dataportability.maps.ev_profile
Move a copy of your electric vehicle profile on Maps
https://www.googleapis.com/auth/dataportability.maps.factual_contributions
Move a copy of the corrections you made to places or map information on Maps
https://www.googleapis.com/auth/dataportability.maps.offering_contributions
Move a copy of your updates to places on Maps
https://www.googleapis.com/auth/dataportability.maps.photos_videos
Move a copy of the photos and videos you posted on Maps
https://www.googleapis.com/auth/dataportability.maps.questions_answers
Move a copy of the questions and answers you posted on Maps
https://www.googleapis.com/auth/dataportability.maps.reviews
Move a copy of your reviews and posts on Maps
https://www.googleapis.com/auth/dataportability.maps.starred_places
Move a copy of your Starred places list on Maps
https://www.googleapis.com/auth/dataportability.maps.vehicle_profile
Move a copy of your vehicle profile on Maps
https://www.googleapis.com/auth/dataportability.myactivity.maps
Move a copy of your Maps activity
https://www.googleapis.com/auth/dataportability.myactivity.myadcenter
Move a copy of your My Ad Center activity
https://www.googleapis.com/auth/dataportability.myactivity.play
Move a copy of your Google Play activity
https://www.googleapis.com/auth/dataportability.myactivity.search
Move a copy of your Google Search activity
https://www.googleapis.com/auth/dataportability.myactivity.shopping
Move a copy of your Shopping activity
https://www.googleapis.com/auth/dataportability.myactivity.youtube
Move a copy of your YouTube activity
https://www.googleapis.com/auth/dataportability.mymaps.maps
Move a copy of the maps you created in My Maps
https://www.googleapis.com/auth/dataportability.order_reserve.purchases_reservations
Move a copy of your food purchase and reservation activity
https://www.googleapis.com/auth/dataportability.play.devices
Move a copy of information about your devices with Google Play Store installed
https://www.googleapis.com/auth/dataportability.play.grouping
Move a copy of your Google Play Store Grouping tags created by app developers
https://www.googleapis.com/auth/dataportability.play.installs
Move a copy of your Google Play Store app installations
https://www.googleapis.com/auth/dataportability.play.library
Move a copy of your Google Play Store downloads, including books, games, and apps
https://www.googleapis.com/auth/dataportability.play.playpoints
Move a copy of information about your Google Play Store Points
https://www.googleapis.com/auth/dataportability.play.promotions
Move a copy of information about your Google Play Store promotions
https://www.googleapis.com/auth/dataportability.play.purchases
Move a copy of your Google Play Store purchases
https://www.googleapis.com/auth/dataportability.play.redemptions
Move a copy of your Google Play Store redemption activities
https://www.googleapis.com/auth/dataportability.play.subscriptions
Move a copy of your Google Play Store subscriptions
https://www.googleapis.com/auth/dataportability.play.usersettings
Move a copy of your Google Play Store user settings and preferences
https://www.googleapis.com/auth/dataportability.saved.collections
Move a copy of your saved links, images, places, and collections from your use of Google services
https://www.googleapis.com/auth/dataportability.search_ugc.comments
Move a copy of your comments on Google Search
https://www.googleapis.com/auth/dataportability.search_ugc.media.reviews_and_stars
Move a copy of your media reviews on Google Search
https://www.googleapis.com/auth/dataportability.search_ugc.media.streaming_video_providers
Move a copy of your self-reported video streaming provider preferences from Google Search and Google TV
https://www.googleapis.com/auth/dataportability.search_ugc.media.thumbs
Move a copy of your indicated thumbs up and thumbs down on media in Google Search and Google TV
https://www.googleapis.com/auth/dataportability.search_ugc.media.watched
Move a copy of information about the movies and TV shows you marked as watched on Google Search and Google TV
https://www.googleapis.com/auth/dataportability.searchnotifications.settings
Move a copy of your notification settings on the Google Search app
https://www.googleapis.com/auth/dataportability.searchnotifications.subscriptions
Move a copy of your notification subscriptions on Google Search app
https://www.googleapis.com/auth/dataportability.shopping.addresses
Move a copy of your shipping information on Shopping
https://www.googleapis.com/auth/dataportability.shopping.reviews
Move a copy of reviews you wrote about products or online stores on Google Search
https://www.googleapis.com/auth/dataportability.streetview.imagery
Move a copy of the images and videos you uploaded to Street View
https://www.googleapis.com/auth/dataportability.youtube.channel
Move a copy of information about your YouTube channel
https://www.googleapis.com/auth/dataportability.youtube.clips
Move a copy of your YouTube clips metadata
https://www.googleapis.com/auth/dataportability.youtube.comments
Move a copy of your YouTube comments
https://www.googleapis.com/auth/dataportability.youtube.live_chat
Move a copy of your YouTube messages in live chat
https://www.googleapis.com/auth/dataportability.youtube.music
Move a copy of your uploaded YouTube music tracks and your YouTube music library
https://www.googleapis.com/auth/dataportability.youtube.playable
Move a copy of your YouTube playables saved game progress files
https://www.googleapis.com/auth/dataportability.youtube.posts
Move a copy of your YouTube posts
https://www.googleapis.com/auth/dataportability.youtube.private_playlists
Move a copy of your YouTube private playlists
https://www.googleapis.com/auth/dataportability.youtube.private_videos
Move a copy of your private YouTube videos and information about them
https://www.googleapis.com/auth/dataportability.youtube.public_playlists
Move a copy of your public YouTube playlists
https://www.googleapis.com/auth/dataportability.youtube.public_videos
Move a copy of your public YouTube videos and information about them
https://www.googleapis.com/auth/dataportability.youtube.shopping
Move a copy of your YouTube shopping wishlists, and wishlist items
https://www.googleapis.com/auth/dataportability.youtube.subscriptions
Move a copy of your YouTube channel subscriptions, even if they're private
https://www.googleapis.com/auth/dataportability.youtube.unlisted_playlists
Move a copy of your unlisted YouTube playlists
https://www.googleapis.com/auth/dataportability.youtube.unlisted_videos
Move a copy of your unlisted YouTube videos and information about them

Database Migration API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Dataflow API, v1b3
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/compute
View and manage your Google Compute Engine resources

Dataform API, v1beta1
Scope
Description
https://www.googleapis.com/auth/bigquery
View and manage your data in Google BigQuery and see the email address for your Google Account
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Datastream API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Developer Connect API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Dialogflow API, v3
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/dialogflow
View, manage and query your Dialogflow agents

Discovery Engine API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Display & Video 360 API, v4
Scope
Description
https://www.googleapis.com/auth/display-video
Create, see, edit, and permanently delete your Display & Video 360 entities and reports
https://www.googleapis.com/auth/display-video-mediaplanning
Create, see, and edit Display & Video 360 Campaign entities and see billing invoices
https://www.googleapis.com/auth/doubleclickbidmanager
View and manage your reports in DoubleClick Bid Manager

Document AI Warehouse API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

DoubleClick Bid Manager API, v2
Scope
Description
https://www.googleapis.com/auth/doubleclickbidmanager
View and manage your reports in DoubleClick Bid Manager

Drive Activity API, v2
Scope
Description
https://www.googleapis.com/auth/drive.activity
View and add to the activity record of files in your Google Drive
https://www.googleapis.com/auth/drive.activity.readonly
View the activity record of files in your Google Drive

Drive Labels API, v2
Scope
Description
https://www.googleapis.com/auth/drive.admin.labels
See, edit, create, and delete all Google Drive labels in your organization, and see your organization's label-related admin policies
https://www.googleapis.com/auth/drive.admin.labels.readonly
See all Google Drive labels and label-related admin policies in your organization
https://www.googleapis.com/auth/drive.labels
See, edit, create, and delete your Google Drive labels
https://www.googleapis.com/auth/drive.labels.readonly
See your Google Drive labels

Enterprise License Manager API, v1
Scope
Description
https://www.googleapis.com/auth/apps.licensing
View and manage G Suite licenses for your domain

Error Reporting API, v1beta1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Essential Contacts API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Eventarc API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Fact Check Tools API, v1alpha1
Scope
Description
https://www.googleapis.com/auth/factchecktools
Read, create, update, and delete your ClaimReview data.

Firebase App Check API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/firebase
View and administer all your Firebase data and settings

Firebase App Distribution API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Firebase App Hosting API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Firebase Cloud Messaging API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/firebase.messaging
Send messages and manage messaging subscriptions for your Firebase applications

Firebase Cloud Messaging Data API, v1beta1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Firebase Data Connect API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Firebase Dynamic Links API, v1
Scope
Description
https://www.googleapis.com/auth/firebase
View and administer all your Firebase data and settings

Firebase Hosting API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/firebase
View and administer all your Firebase data and settings

Firebase Management API, v1beta1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloud-platform.read-only
View your data across Google Cloud services and see the email address of your Google Account
https://www.googleapis.com/auth/firebase
View and administer all your Firebase data and settings
https://www.googleapis.com/auth/firebase.readonly
View all your Firebase data and settings

Firebase ML API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Firebase Realtime Database Management API, v1beta
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloud-platform.read-only
View your data across Google Cloud services and see the email address of your Google Account
https://www.googleapis.com/auth/firebase
View and administer all your Firebase data and settings
https://www.googleapis.com/auth/firebase.readonly
View all your Firebase data and settings

Firebase Rules API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/firebase
View and administer all your Firebase data and settings
https://www.googleapis.com/auth/firebase.readonly
View all your Firebase data and settings

Fitness API, v1
Scope
Description
https://www.googleapis.com/auth/fitness.activity.read
Use Google Fit to see and store your physical activity data
https://www.googleapis.com/auth/fitness.activity.write
Add to your Google Fit physical activity data
https://www.googleapis.com/auth/fitness.blood_glucose.read
See info about your blood glucose in Google Fit. I consent to Google sharing my blood glucose information with this app.
https://www.googleapis.com/auth/fitness.blood_glucose.write
Add info about your blood glucose to Google Fit. I consent to Google using my blood glucose information with this app.
https://www.googleapis.com/auth/fitness.blood_pressure.read
See info about your blood pressure in Google Fit. I consent to Google sharing my blood pressure information with this app.
https://www.googleapis.com/auth/fitness.blood_pressure.write
Add info about your blood pressure in Google Fit. I consent to Google using my blood pressure information with this app.
https://www.googleapis.com/auth/fitness.body.read
See info about your body measurements in Google Fit
https://www.googleapis.com/auth/fitness.body.write
Add info about your body measurements to Google Fit
https://www.googleapis.com/auth/fitness.body_temperature.read
See info about your body temperature in Google Fit. I consent to Google sharing my body temperature information with this app.
https://www.googleapis.com/auth/fitness.body_temperature.write
Add to info about your body temperature in Google Fit. I consent to Google using my body temperature information with this app.
https://www.googleapis.com/auth/fitness.heart_rate.read
See your heart rate data in Google Fit. I consent to Google sharing my heart rate information with this app.
https://www.googleapis.com/auth/fitness.heart_rate.write
Add to your heart rate data in Google Fit. I consent to Google using my heart rate information with this app.
https://www.googleapis.com/auth/fitness.location.read
See your Google Fit speed and distance data
https://www.googleapis.com/auth/fitness.location.write
Add to your Google Fit location data
https://www.googleapis.com/auth/fitness.nutrition.read
See info about your nutrition in Google Fit
https://www.googleapis.com/auth/fitness.nutrition.write
Add to info about your nutrition in Google Fit
https://www.googleapis.com/auth/fitness.oxygen_saturation.read
See info about your oxygen saturation in Google Fit. I consent to Google sharing my oxygen saturation information with this app.
https://www.googleapis.com/auth/fitness.oxygen_saturation.write
Add info about your oxygen saturation in Google Fit. I consent to Google using my oxygen saturation information with this app.
https://www.googleapis.com/auth/fitness.reproductive_health.read
See info about your reproductive health in Google Fit. I consent to Google sharing my reproductive health information with this app.
https://www.googleapis.com/auth/fitness.reproductive_health.write
Add info about your reproductive health in Google Fit. I consent to Google using my reproductive health information with this app.
https://www.googleapis.com/auth/fitness.sleep.read
See your sleep data in Google Fit. I consent to Google sharing my sleep information with this app.
https://www.googleapis.com/auth/fitness.sleep.write
Add to your sleep data in Google Fit. I consent to Google using my sleep information with this app.

GKE Hub API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

GKE On-Prem API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Gmail API, v1
Scope
Description
https://mail.google.com/
Read, compose, send, and permanently delete all your email from Gmail
https://www.googleapis.com/auth/gmail.addons.current.action.compose
Manage drafts and send emails when you interact with the add-on
https://www.googleapis.com/auth/gmail.addons.current.message.action
View your email messages when you interact with the add-on
https://www.googleapis.com/auth/gmail.addons.current.message.metadata
View your email message metadata when the add-on is running
https://www.googleapis.com/auth/gmail.addons.current.message.readonly
View your email messages when the add-on is running
https://www.googleapis.com/auth/gmail.compose
Manage drafts and send emails
https://www.googleapis.com/auth/gmail.insert
Add emails into your Gmail mailbox
https://www.googleapis.com/auth/gmail.labels
See and edit your email labels
https://www.googleapis.com/auth/gmail.metadata
View your email message metadata such as labels and headers, but not the email body
https://www.googleapis.com/auth/gmail.modify
Read, compose, and send emails from your Gmail account
https://www.googleapis.com/auth/gmail.readonly
View your email messages and settings
https://www.googleapis.com/auth/gmail.send
Send email on your behalf
https://www.googleapis.com/auth/gmail.settings.basic
See, edit, create, or change your email settings and filters in Gmail
https://www.googleapis.com/auth/gmail.settings.sharing
Manage your sensitive mail settings, including who can manage your mail

Gmail Postmaster Tools API, v1
Scope
Description
https://www.googleapis.com/auth/postmaster.readonly
See email traffic metrics for the domains you have registered in Gmail Postmaster Tools

Google Analytics Admin API, v1beta
Scope
Description
https://www.googleapis.com/auth/analytics.edit
Edit Google Analytics management entities
https://www.googleapis.com/auth/analytics.readonly
See and download your Google Analytics data

Google Analytics API, v3
Scope
Description
https://www.googleapis.com/auth/analytics
View and manage your Google Analytics data
https://www.googleapis.com/auth/analytics.edit
Edit Google Analytics management entities
https://www.googleapis.com/auth/analytics.manage.users
Manage Google Analytics Account users by email address
https://www.googleapis.com/auth/analytics.manage.users.readonly
View Google Analytics user permissions
https://www.googleapis.com/auth/analytics.provision
Create a new Google Analytics account along with its default property and view
https://www.googleapis.com/auth/analytics.readonly
View your Google Analytics data
https://www.googleapis.com/auth/analytics.user.deletion
Manage Google Analytics user deletion requests

Google Analytics Data API, v1beta
Scope
Description
https://www.googleapis.com/auth/analytics
View and manage your Google Analytics data
https://www.googleapis.com/auth/analytics.readonly
See and download your Google Analytics data

Google Chat API, v1
Scope
Description
https://www.googleapis.com/auth/chat.admin.delete
Delete conversations and spaces owned by your organization and remove access to associated files in Google Chat
https://www.googleapis.com/auth/chat.admin.memberships
View, add, update and remove members and managers in conversations owned by your organization
https://www.googleapis.com/auth/chat.admin.memberships.readonly
View members and managers in conversations owned by your organization
https://www.googleapis.com/auth/chat.admin.spaces
View or edit display name, description, and other metadata for all Google Chat conversations owned by your organization
https://www.googleapis.com/auth/chat.admin.spaces.readonly
View display name, description, and other metadata for all Google Chat conversations owned by your organization
https://www.googleapis.com/auth/chat.app.delete
On their own behalf, apps in Google Chat can delete conversations and spaces and remove access to associated files
https://www.googleapis.com/auth/chat.app.memberships
On their own behalf, apps in Google Chat can see, add, update, and remove members from conversations and spaces
https://www.googleapis.com/auth/chat.app.spaces
On their own behalf, apps in Google Chat can create conversations and spaces and see or update their metadata (including history settings and access settings)
https://www.googleapis.com/auth/chat.app.spaces.create
On their own behalf, apps in Google Chat can create conversations and spaces
https://www.googleapis.com/auth/chat.customemojis
View, create, and delete custom emoji in Google Chat
https://www.googleapis.com/auth/chat.customemojis.readonly
View custom emoji in Google Chat
https://www.googleapis.com/auth/chat.delete
Delete conversations and spaces and remove access to associated files in Google Chat
https://www.googleapis.com/auth/chat.import
Import spaces, messages, and memberships into Google Chat.
https://www.googleapis.com/auth/chat.memberships
See, add, update, and remove members from conversations and spaces in Google Chat
https://www.googleapis.com/auth/chat.memberships.app
Add and remove itself from conversations and spaces in Google Chat
https://www.googleapis.com/auth/chat.memberships.readonly
View members in Google Chat conversations.
https://www.googleapis.com/auth/chat.messages
See, compose, send, update, and delete messages as well as their message content; add, see, and delete reactions to messages.
https://www.googleapis.com/auth/chat.messages.create
Compose and send messages in Google Chat
https://www.googleapis.com/auth/chat.messages.reactions
See, add, and delete reactions as well as their reaction content to messages in Google Chat
https://www.googleapis.com/auth/chat.messages.reactions.create
Add reactions to messages in Google Chat
https://www.googleapis.com/auth/chat.messages.reactions.readonly
View reactions as well as their reaction content to messages in Google Chat
https://www.googleapis.com/auth/chat.messages.readonly
See messages as well as their reactions and message content in Google Chat
https://www.googleapis.com/auth/chat.spaces
Create conversations and spaces and see or update metadata (including history settings and access settings) in Google Chat
https://www.googleapis.com/auth/chat.spaces.create
Create new conversations and spaces in Google Chat
https://www.googleapis.com/auth/chat.spaces.readonly
View chat and spaces in Google Chat
https://www.googleapis.com/auth/chat.users.readstate
View and modify last read time for Google Chat conversations
https://www.googleapis.com/auth/chat.users.readstate.readonly
View last read time for Google Chat conversations
https://www.googleapis.com/auth/chat.users.spacesettings
Read and update your space settings

Google Classroom API, v1
Scope
Description
https://www.googleapis.com/auth/classroom.addons.student
See and update its own attachments to posts in Google Classroom
https://www.googleapis.com/auth/classroom.addons.teacher
See, create, and update its own attachments to posts in classes you teach in Google Classroom
https://www.googleapis.com/auth/classroom.announcements
View and manage announcements in Google Classroom
https://www.googleapis.com/auth/classroom.announcements.readonly
View announcements in Google Classroom
https://www.googleapis.com/auth/classroom.courses
See, edit, create, and permanently delete your Google Classroom classes
https://www.googleapis.com/auth/classroom.courses.readonly
View your Google Classroom classes
https://www.googleapis.com/auth/classroom.coursework.me
See, create and edit coursework items including assignments, questions, and grades
https://www.googleapis.com/auth/classroom.coursework.me.readonly
View your course work and grades in Google Classroom
https://www.googleapis.com/auth/classroom.coursework.students
Manage course work and grades for students in the Google Classroom classes you teach and view the course work and grades for classes you administer
https://www.googleapis.com/auth/classroom.coursework.students.readonly
View course work and grades for students in the Google Classroom classes you teach or administer
https://www.googleapis.com/auth/classroom.courseworkmaterials
See, edit, and create classwork materials in Google Classroom
https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly
See all classwork materials for your Google Classroom classes
https://www.googleapis.com/auth/classroom.guardianlinks.me.readonly
View your Google Classroom guardians
https://www.googleapis.com/auth/classroom.guardianlinks.students
View and manage guardians for students in your Google Classroom classes
https://www.googleapis.com/auth/classroom.guardianlinks.students.readonly
View guardians for students in your Google Classroom classes
https://www.googleapis.com/auth/classroom.profile.emails
View the email addresses of people in your classes
https://www.googleapis.com/auth/classroom.profile.photos
View the profile photos of people in your classes
https://www.googleapis.com/auth/classroom.push-notifications
Receive notifications about your Google Classroom data
https://www.googleapis.com/auth/classroom.rosters
Manage your Google Classroom class rosters
https://www.googleapis.com/auth/classroom.rosters.readonly
View your Google Classroom class rosters
https://www.googleapis.com/auth/classroom.student-submissions.me.readonly
View your course work and grades in Google Classroom
https://www.googleapis.com/auth/classroom.student-submissions.students.readonly
View course work and grades for students in the Google Classroom classes you teach or administer
https://www.googleapis.com/auth/classroom.topics
See, create, and edit topics in Google Classroom
https://www.googleapis.com/auth/classroom.topics.readonly
View topics in Google Classroom

Google Cloud Data Catalog API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Google Cloud Memorystore for Redis API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Google Cloud Support API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Google Docs API, v1
Scope
Description
https://www.googleapis.com/auth/documents
See, edit, create, and delete all your Google Docs documents
https://www.googleapis.com/auth/documents.readonly
See all your Google Docs documents
https://www.googleapis.com/auth/drive
See, edit, create, and delete all of your Google Drive files
https://www.googleapis.com/auth/drive.file
See, edit, create, and delete only the specific Google Drive files you use with this app
https://www.googleapis.com/auth/drive.readonly
See and download all your Google Drive files

Google Drive API, v3
Scope
Description
https://www.googleapis.com/auth/drive
See, edit, create, and delete all of your Google Drive files
https://www.googleapis.com/auth/drive.appdata
See, create, and delete its own configuration data in your Google Drive
https://www.googleapis.com/auth/drive.apps.readonly
View your Google Drive apps
https://www.googleapis.com/auth/drive.file
See, edit, create, and delete only the specific Google Drive files you use with this app
https://www.googleapis.com/auth/drive.meet.readonly
See and download your Google Drive files that were created or edited by Google Meet.
https://www.googleapis.com/auth/drive.metadata
View and manage metadata of files in your Google Drive
https://www.googleapis.com/auth/drive.metadata.readonly
See information about your Google Drive files
https://www.googleapis.com/auth/drive.photos.readonly
View the photos, videos and albums in your Google Photos
https://www.googleapis.com/auth/drive.readonly
See and download all your Google Drive files
https://www.googleapis.com/auth/drive.scripts
Modify your Google Apps Script scripts' behavior

Google Forms API, v1
Scope
Description
https://www.googleapis.com/auth/drive
See, edit, create, and delete all of your Google Drive files
https://www.googleapis.com/auth/drive.file
See, edit, create, and delete only the specific Google Drive files you use with this app
https://www.googleapis.com/auth/drive.readonly
See and download all your Google Drive files
https://www.googleapis.com/auth/forms.body
See, edit, create, and delete all your Google Forms forms
https://www.googleapis.com/auth/forms.body.readonly
See all your Google Forms forms
https://www.googleapis.com/auth/forms.responses.readonly
See all responses to your Google Forms forms

Google Identity Toolkit API, v3
Scope
Description
https://www.googleapis.com/auth/cloud-platform
View and manage your data across Google Cloud Platform services
https://www.googleapis.com/auth/firebase
View and administer all your Firebase data and settings

Google Keep API, v1
Scope
Description
https://www.googleapis.com/auth/keep
See, edit, create and permanently delete all your Google Keep data
https://www.googleapis.com/auth/keep.readonly
View all your Google Keep data

Google Marketing Platform Admin API, v1alpha
Scope
Description
https://www.googleapis.com/auth/marketingplatformadmin.analytics.read
View your Google Analytics product account data in GMP home
https://www.googleapis.com/auth/marketingplatformadmin.analytics.update
Manage your Google Analytics product account data in GMP home

Google Meet API, v2
Scope
Description
https://www.googleapis.com/auth/meetings.space.created
Create, edit, and see information about your Google Meet conferences created by the app.
https://www.googleapis.com/auth/meetings.space.readonly
Read information about any of your Google Meet conferences
https://www.googleapis.com/auth/meetings.space.settings
Edit, and see settings for all of your Google Meet calls.

Google OAuth2 API, v2
Scope
Description
https://www.googleapis.com/auth/userinfo.email
See your primary Google Account email address
https://www.googleapis.com/auth/userinfo.profile
See your personal info, including any personal info you've made publicly available
openid
Associate you with your personal info on Google

Google Play Android Developer API, v3
Scope
Description
https://www.googleapis.com/auth/androidpublisher
View and manage your Google Play Developer account

Google Play Custom App Publishing API, v1
Scope
Description
https://www.googleapis.com/auth/androidpublisher
View and manage your Google Play Developer account

Google Play Developer Reporting API, v1beta1
Scope
Description
https://www.googleapis.com/auth/playdeveloperreporting
See metrics and data about the apps in your Google Play Developer account

Google Play EMM API, v1
Scope
Description
https://www.googleapis.com/auth/androidenterprise
Manage corporate Android devices

Google Play Games Services API, v1
Scope
Description
https://www.googleapis.com/auth/androidpublisher
View and manage your Google Play Developer account
https://www.googleapis.com/auth/drive.appdata
See, create, and delete its own configuration data in your Google Drive
https://www.googleapis.com/auth/games
Create, edit, and delete your Google Play Games activity

Google Play Games Services Management API, v1management
Scope
Description
https://www.googleapis.com/auth/games
Create, edit, and delete your Google Play Games activity

Google Play Games Services Publishing API, v1configuration
Scope
Description
https://www.googleapis.com/auth/androidpublisher
View and manage your Google Play Developer account

Google Search Console API, v1
Scope
Description
https://www.googleapis.com/auth/webmasters
View and manage Search Console data for your verified sites
https://www.googleapis.com/auth/webmasters.readonly
View Search Console data for your verified sites

Google Sheets API, v4
Scope
Description
https://www.googleapis.com/auth/drive
See, edit, create, and delete all of your Google Drive files
https://www.googleapis.com/auth/drive.file
See, edit, create, and delete only the specific Google Drive files you use with this app
https://www.googleapis.com/auth/drive.readonly
See and download all your Google Drive files
https://www.googleapis.com/auth/spreadsheets
See, edit, create, and delete all your Google Sheets spreadsheets
https://www.googleapis.com/auth/spreadsheets.readonly
See all your Google Sheets spreadsheets

Google Sign-In
Scope
Description
email
See your primary Google Account email address
openid
Associate you with your personal info on Google
profile
See your personal info, including any personal info you've made publicly available

Google Site Verification API, v1
Scope
Description
https://www.googleapis.com/auth/siteverification
Manage the list of sites and domains you control
https://www.googleapis.com/auth/siteverification.verify_only
Manage your new site verifications with Google

Google Slides API, v1
Scope
Description
https://www.googleapis.com/auth/drive
See, edit, create, and delete all of your Google Drive files
https://www.googleapis.com/auth/drive.file
See, edit, create, and delete only the specific Google Drive files you use with this app
https://www.googleapis.com/auth/drive.readonly
See and download all your Google Drive files
https://www.googleapis.com/auth/presentations
See, edit, create, and delete all your Google Slides presentations
https://www.googleapis.com/auth/presentations.readonly
See all your Google Slides presentations
https://www.googleapis.com/auth/spreadsheets
See, edit, create, and delete all your Google Sheets spreadsheets
https://www.googleapis.com/auth/spreadsheets.readonly
See all your Google Sheets spreadsheets

Google Tasks API, v1
Scope
Description
https://www.googleapis.com/auth/tasks
Create, edit, organize, and delete all your tasks
https://www.googleapis.com/auth/tasks.readonly
View your tasks

Google Vault API, v1
Scope
Description
https://www.googleapis.com/auth/ediscovery
Manage your eDiscovery data
https://www.googleapis.com/auth/ediscovery.readonly
View your eDiscovery data

Google Workspace Alert Center API, v1beta1
Scope
Description
https://www.googleapis.com/auth/apps.alerts
See and delete your domain's G Suite alerts, and send alert feedback

Google Workspace Events API, v1
Scope
Description
https://www.googleapis.com/auth/chat.app.memberships
On their own behalf, apps in Google Chat can see, add, update, and remove members from conversations and spaces
https://www.googleapis.com/auth/chat.app.spaces
On their own behalf, apps in Google Chat can create conversations and spaces and see or update their metadata (including history settings and access settings)
https://www.googleapis.com/auth/chat.memberships
See, add, update, and remove members from conversations and spaces in Google Chat
https://www.googleapis.com/auth/chat.memberships.readonly
View members in Google Chat conversations.
https://www.googleapis.com/auth/chat.messages
See, compose, send, update, and delete messages as well as their message content; add, see, and delete reactions to messages.
https://www.googleapis.com/auth/chat.messages.reactions
See, add, and delete reactions as well as their reaction content to messages in Google Chat
https://www.googleapis.com/auth/chat.messages.reactions.readonly
View reactions as well as their reaction content to messages in Google Chat
https://www.googleapis.com/auth/chat.messages.readonly
See messages as well as their reactions and message content in Google Chat
https://www.googleapis.com/auth/chat.spaces
Create conversations and spaces and see or update metadata (including history settings and access settings) in Google Chat
https://www.googleapis.com/auth/chat.spaces.readonly
View chat and spaces in Google Chat
https://www.googleapis.com/auth/drive
See, edit, create, and delete all of your Google Drive files
https://www.googleapis.com/auth/drive.file
See, edit, create, and delete only the specific Google Drive files you use with this app
https://www.googleapis.com/auth/drive.metadata
View and manage metadata of files in your Google Drive
https://www.googleapis.com/auth/drive.metadata.readonly
See information about your Google Drive files
https://www.googleapis.com/auth/drive.readonly
See and download all your Google Drive files
https://www.googleapis.com/auth/meetings.space.created
Create, edit, and see information about your Google Meet conferences created by the app.
https://www.googleapis.com/auth/meetings.space.readonly
Read information about any of your Google Meet conferences

Google Workspace Reseller API, v1
Scope
Description
https://www.googleapis.com/auth/apps.order
Manage users on your domain
https://www.googleapis.com/auth/apps.order.readonly
Manage users on your domain

Groups Migration API, v1
Scope
Description
https://www.googleapis.com/auth/apps.groups.migration
Upload messages to any Google group in your domain

Groups Settings API, v1
Scope
Description
https://www.googleapis.com/auth/apps.groups.settings
View and manage the settings of a G Suite group

IAM Service Account Credentials API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Identity and Access Management (IAM) API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Infrastructure Manager API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

KMS Inventory API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Kubernetes Engine API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Library Agent API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Local Services API, v1
Scope
Description
https://www.googleapis.com/auth/adwords
See, edit, create, and delete your Google Ads accounts and data.

Looker (Google Cloud core) API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Managed Service for Apache Kafka API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Managed Service for Microsoft Active Directory API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Manufacturer Center API, v1
Scope
Description
https://www.googleapis.com/auth/manufacturercenter
Manage your product listings for Google Manufacturer Center

Merchant API, reviews_v1beta
Scope
Description
https://www.googleapis.com/auth/content
Manage your product listings and accounts for Google Shopping

Migration Center API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

NetApp API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Network Connectivity API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Network Management API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Network Security API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Network Services API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Notebooks API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Observability API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

On-Demand Scanning API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

OpenID Connect, 1.0
Scope
Description
email
See your primary Google Account email address
openid
Associate you with your personal info on Google
profile
See your personal info, including any personal info you've made publicly available

Oracle Database@Google Cloud API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Organization Policy API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

OS Config API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

PageSpeed Insights API, v5
Scope
Description
openid
Associate you with your personal info on Google

Parallelstore API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Payments Reseller Subscription API, v1
Scope
Description
https://www.googleapis.com/auth/sdm.service
See and/or control the devices that you selected

People API, v1
Scope
Description
https://www.googleapis.com/auth/contacts
See, edit, download, and permanently delete your contacts
https://www.googleapis.com/auth/contacts.other.readonly
See and download contact info automatically saved in your "Other contacts"
https://www.googleapis.com/auth/contacts.readonly
See and download your contacts
https://www.googleapis.com/auth/directory.readonly
See and download your organization's GSuite directory
https://www.googleapis.com/auth/user.addresses.read
View your street addresses
https://www.googleapis.com/auth/user.birthday.read
See and download your exact date of birth
https://www.googleapis.com/auth/user.emails.read
See and download all of your Google Account email addresses
https://www.googleapis.com/auth/user.gender.read
See your gender
https://www.googleapis.com/auth/user.organization.read
See your education, work history and org info
https://www.googleapis.com/auth/user.phonenumbers.read
See and download your personal phone numbers
https://www.googleapis.com/auth/userinfo.email
See your primary Google Account email address
https://www.googleapis.com/auth/userinfo.profile
See your personal info, including any personal info you've made publicly available

Photos Library API, v1
Scope
Description
https://www.googleapis.com/auth/photoslibrary
See, upload, and organize items in your Google Photos library
https://www.googleapis.com/auth/photoslibrary.appendonly
Add to your Google Photos library
https://www.googleapis.com/auth/photoslibrary.edit.appcreateddata
Edit the info in your photos, videos, and albums created within this app, including titles, descriptions, and covers
https://www.googleapis.com/auth/photoslibrary.readonly
View your Google Photos library
https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata
Manage photos added by this app
https://www.googleapis.com/auth/photoslibrary.sharing
Manage and add to shared albums on your behalf

Places Aggregate API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Places API (New), v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Policy Analyzer API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Policy Simulator API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Policy Troubleshooter API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Pollen API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Pub/Sub Lite API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Public Certificate Authority API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Rapid Migration Assessment API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Real-time Bidding API, v1
Scope
Description
https://www.googleapis.com/auth/realtime-bidding
See, create, edit, and delete your Authorized Buyers and Open Bidding account entities

reCAPTCHA Enterprise API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Recommendations AI (Beta), v1beta1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Recommender API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

SaaS Runtime API, v1beta1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

SAS Portal API, v1alpha1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/sasportal
Read, create, update, and delete your SAS Portal data.

Search Ads 360 API, v2
Scope
Description
https://www.googleapis.com/auth/doubleclicksearch
View and manage your advertising data in DoubleClick Search

Search Ads 360 Reporting API, v0
Scope
Description
https://www.googleapis.com/auth/doubleclicksearch
View and manage your advertising data in DoubleClick Search

Secret Manager API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Security Command Center API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Security Posture API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Sensitive Data Protection (DLP), v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Serverless VPC Access API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Service Consumer Management API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Service Control API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/servicecontrol
Manage your Google Service Control data

Service Directory API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Service Management API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloud-platform.read-only
View your data across Google Cloud services and see the email address of your Google Account
https://www.googleapis.com/auth/service.management
Manage your Google API service configuration
https://www.googleapis.com/auth/service.management.readonly
View your Google API service configuration

Service Networking API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/service.management
Manage your Google API service configuration

Service Usage API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloud-platform.read-only
View your data across Google Cloud services and see the email address of your Google Account
https://www.googleapis.com/auth/service.management
Manage your Google API service configuration

Smart Device Management API, v1
Scope
Description
https://www.googleapis.com/auth/sdm.service
See and/or control the devices that you selected

Solar API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Storage Batch Operations API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Storage Transfer API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Street View Publish API, v1
Scope
Description
https://www.googleapis.com/auth/streetviewpublish
Publish and manage your 360 photos on Google Street View

Tag Manager API, v2
Scope
Description
https://www.googleapis.com/auth/tagmanager.delete.containers
Delete your Google Tag Manager containers
https://www.googleapis.com/auth/tagmanager.edit.containers
Manage your Google Tag Manager container and its subcomponents, excluding versioning and publishing
https://www.googleapis.com/auth/tagmanager.edit.containerversions
Manage your Google Tag Manager container versions
https://www.googleapis.com/auth/tagmanager.manage.accounts
View and manage your Google Tag Manager accounts
https://www.googleapis.com/auth/tagmanager.manage.users
Manage user permissions of your Google Tag Manager account and container
https://www.googleapis.com/auth/tagmanager.publish
Publish your Google Tag Manager container versions
https://www.googleapis.com/auth/tagmanager.readonly
View your Google Tag Manager container and its subcomponents

Traffic Director API, v3
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Transcoder API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Vertex AI API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.
https://www.googleapis.com/auth/cloud-platform.read-only
View your data across Google Cloud services and see the email address of your Google Account

Vertex AI Search for commerce API, v2
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

VM Migration API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

VMware Engine API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Web Risk API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Web Search Indexing API, v3
Scope
Description
https://www.googleapis.com/auth/indexing
Submit data to Google for indexing

Web Security Scanner API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Workflow Executions API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Workflows API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

Workload Manager API, v1
Scope
Description
https://www.googleapis.com/auth/cloud-platform
See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.

YouTube Analytics API, v2
Scope
Description
https://www.googleapis.com/auth/youtube
Manage your YouTube account
https://www.googleapis.com/auth/youtube.readonly
View your YouTube account
https://www.googleapis.com/auth/youtubepartner
View and manage your assets and associated content on YouTube
https://www.googleapis.com/auth/yt-analytics-monetary.readonly
View monetary and non-monetary YouTube Analytics reports for your YouTube content
https://www.googleapis.com/auth/yt-analytics.readonly
View YouTube Analytics reports for your YouTube content

YouTube Data API v3, v3
Scope
Description
https://www.googleapis.com/auth/youtube
Manage your YouTube account
https://www.googleapis.com/auth/youtube.channel-memberships.creator
See a list of your current active channel members, their current level, and when they became a member
https://www.googleapis.com/auth/youtube.force-ssl
See, edit, and permanently delete your YouTube videos, ratings, comments and captions
https://www.googleapis.com/auth/youtube.readonly
View your YouTube account
https://www.googleapis.com/auth/youtube.upload
Manage your YouTube videos
https://www.googleapis.com/auth/youtubepartner
View and manage your assets and associated content on YouTube
https://www.googleapis.com/auth/youtubepartner-channel-audit
View private information of your YouTube channel relevant during the audit process with a YouTube partner

YouTube Reporting API, v1
Scope
Description
https://www.googleapis.com/auth/yt-analytics-monetary.readonly
View monetary and non-monetary YouTube Analytics reports for your YouTube content
https://www.googleapis.com/auth/yt-analytics.readonly
View YouTube Analytics reports for your YouTube content

Was this helpful?
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-06-25 UTC.
Connect
Blog
Instagram
LinkedIn
X (Twitter)
YouTube
Programs
Google Developer Groups
Google Developer Experts
Accelerators
Women Techmakers
Google Cloud & NVIDIA
Developer consoles
Google API Console
Google Cloud Platform Console
Google Play Console
Firebase Console
Actions on Google Console
Cast SDK Developer Console
Chrome Web Store Dashboard
Google Home Developer Console

Android
Chrome
Firebase
Google Cloud Platform
Google AI
All products
Terms
Privacy
Sign up for the Google for Developers newsletterSubscribe
English
Page info
bug_reportfullscreenclose
On this page




















































































































































































































































































































































































































































































































































Key Takeaways
AI-GENERATED
The document lists Google Cloud APIs and their associated OAuth 2.0 scopes, which define the level of access granted to applications.
Scopes are categorized by API and access level, including read-only, read-write, and full control.
Sensitive scopes require Google's review, and public applications using specific scopes might necessitate verification.
Developers should consult the documentation for each API to understand its specific scope requirements.
Common scopes include `cloud-platform` for broad Cloud access and API-specific scopes for finer-grained control over data and resources.
outlined_flag
The new page has loaded..
Skip to main content

Authentication
Authorization
Cross-platform
Cross-Account Protection (RISC)
/
English
Google Account Authorization
App verification to use Google Authorization APIs
Google Account Linking
Resources


























































Authorization
OAuth 2.0 Policies
bookmark_border
Last modified: May 17, 2021
The applications and services you design and build with Google APIs must do more than provide value to users and businesses. We also require that they be secure and provide the appropriate level of privacy demanded by users. The following policies are part of the Google APIs Terms of Service. They apply to all developers who use OAuth 2.0, which includes OpenID Connect for authentication only. The policies below are a minimum set of requirements; we recommend that you take any additional steps necessary to ensure that your applications and systems are safe and secure.
Comply with all terms of service and policies
The use of Google API Services, which includes our implementation of OAuth 2.0, is governed by the Google APIs Terms of Service and Google API Services User Data Policy. In addition, the use of OAuth 2.0 is governed by this policy. Please read these documents carefully, as well as any other terms or policies that apply to any other Google products or services you are using. Be sure to check for updates periodically as these documents are occasionally updated.
Register an appropriate OAuth client
Every app that uses Google's OAuth 2.0 infrastructure for authentication or authorization must have at least one registered OAuth client. You must create a separate OAuth client for each platform on which your app will run, such as a web server, an Android app, an iOS app, or a limited-input device. You must choose the client type that best matches the platform. For instance, you should not use a "web" client type for your native Android or iOS app. You can register OAuth clients in the Google Cloud Console. Note that additional terms apply to your use of the Google Cloud Platform.
If you use Apps Script, OAuth clients are automatically created on your behalf, and you are still subject to the policies on this page. If you need to modify or manage your OAuth clients, you must switch your script project to a standard Cloud project.
Some Google development platforms, such as Firebase and Actions on Google, automatically create Google Cloud projects and OAuth clients on your behalf. If you develop on these platforms, you are still subject to the policies on this page.
Use separate projects for testing and production
For the purposes of these requirements, a "production" app meets the following criteria:
It isn't for personal use. An app is considered to be for personal use if it's not shared with anyone else or will be used by fewer than 100 people (all of whom are known personally to you).
It isn't used for development, testing, or staging.
It isn't for internal use; that is, restricted to people in your Google Workspace or Cloud Identity organization.
Some policies and requirements only apply to production apps. For this reason, you must create separate projects in the Google Cloud Console for each deployment tier, such as development, staging, and production.
Maintain a list of relevant contacts for the project
Project owners and editors must be kept up-to-date. We'll send emails to those accounts when there are notifications about your project or updates to our services. Organization administrators must ensure that a reachable contact is associated with every project in their organization. If we don't have updated contact information for your project, you might miss out on important messages that require your action. This could result in the loss of your access to the Google APIs.
Google Workspace users: Associate your project with an organization
At this time, your projects aren't required to exist within a Google Workspace or Cloud Identity Organization resource. However, you're strongly recommended to create new projects in an organization and migrate existing projects into an organization. This configuration allows your project to benefit from enterprise management including intra-domain usage. It can also prevent your project from becoming orphaned if the current project owner leaves your organization.
Handle client credentials securely
Treat your OAuth client credentials with extreme care, as they allow anyone who has them to use your app's identity to gain access to user information. Store your OAuth client information in a secure place and protect it, especially your client secret, just as you would a password. Where possible, use a secret manager, such as Google Cloud Secret Manager, to store client credentials. You must never commit client credentials into publicly available code repositories. We highly recommend that you avoid committing them to any code repository.
Handle user tokens securely
OAuth 2.0 tokens are entrusted to you by users who give you permission to act and access data on their behalf. Never transmit tokens in plaintext, and always store encrypted tokens at rest to provide an extra layer of protection in the event of a data breach. Revoke tokens when you no longer need access to a user's account or when your app no longer needs access to permissions that a user previously granted. After the tokens are revoked, delete them permanently from your application or system.
Accurately represent your identity
Provide a valid name and (optionally) a logo to show to users. This brand information must accurately represent the identity of the application. App branding information is configured when you set up OAuth 2.0 in the Google Cloud Console Consent Screen page.
For production apps, brand information must be verified. Google can revoke or suspend access to Google API Services and other Google products and services for apps that misrepresent their identity or attempt to deceive users.
If you use Apps Script and want to verify your brand information, you must switch your script project to a standard Cloud project. If you use a Google development platform that manages OAuth clients on your behalf, such as Firebase or Actions on Google, your app settings there are used to configure your brand information. However, you must still use the Google Cloud Console to submit your brand information for review.
Only request scopes that you need
You must only request the smallest set of scopes that are necessary for providing functionality knowingly chosen by the user. You must request scopes that require the least amount of access to user data necessary to provide that functionality. For example, an app that only uses Gmail APIs to occasionally send emails on a user's behalf shouldn't request the scope that provides full access to the user's email data. Data that you receive from Google APIs must only be used in the way that you represent to your users.
Your project configuration in the Google Cloud Console Consent Screen page must match the list of scopes requested by your app. When a change in app functionality or in Google APIs necessitates an update to the scopes that are used, you must revoke the tokens with the previously-used scopes that are no longer in use at the earliest opportunity and update your project configuration in the Google Cloud Console. Proper configuration is particularly important for scopes that require verification; if an app is no longer approved to use them, Google may revoke tokens that contain these scopes at any time without notice.
If you use Apps Script, the OAuth client that's automatically created for you is configured to use the scopes that Apps Script identifies from your script. If your script requires different scopes, you must specify these scopes explicitly in your script's manifest file.
Submit production apps that use sensitive or restricted scopes for verification
Certain scopes are classified as "sensitive" or "restricted," and they can't be used in production apps without review. If your production app uses sensitive or restricted scopes, you must submit your use of those scopes for verification. You can submit for verification in the Google Cloud Console from the Consent Screen page.
If you use Apps Script and you're writing a production script that uses sensitive or restricted scopes, you must switch your script project to a standard Google Cloud Platform project before you submit your use of those scopes for verification.
Only use domains you own
Only use redirect URIs and JavaScript origins that refer to domains that you own, that you have been authorized to use (for example, as part of your employment or as a vendor or contractor of a business), or that you have been explicitly given license to use (for example, as part of a service agreement for an identity management platform).
Host a homepage for production apps
Every production app that uses OAuth 2.0 must have a publicly accessible home page. The homepage must include a description of the app's functionality, as well as links to terms of service and a privacy policy. The homepage must exist on a verified domain under your ownership.
Use secure browsers
A developer must not direct a Google OAuth 2.0 authorization request to an embedded user-agent under the developer's control. Embedded user-agents include, but are not limited to, software libraries that allow a developer to insert arbitrary scripts, alter the default routing of a request to the Google OAuth server, or access session cookies. All browsing environments must allow the user to verify the current connection to the Google OAuth server including the requested URI and connection security information.
Use secure JavaScript origins and redirect URIs
OAuth 2.0 clients for web apps must use redirect URIs and JavaScript origins that are compliant with Google’s validation rules, including using the HTTPS scheme. Google may reject OAuth requests that don't originate from or resolve to a secure context.
Handle consent for multiple scopes
When you obtain consent for multiple scopes, a user might choose to grant one or more requested scopes or deny the request. If a user doesn't grant a scope that you requested, you need to disable any related functionality in your app and not make any related API calls that will fail. If a user doesn't grant a requested scope, you may only request a new authorization after the user clearly indicates an intent to use the feature or functionality provided by the scope. Where possible, you must ask for scopes in context with incremental authorization and provide a justification to the user before you request authorization.
Handle refresh token revocation and expiration
Refresh tokens can be invalidated at any time. For example, the user could choose to revoke access to your app, a manual or automated process designed to protect users could purge the token, or the token could expire. If your app requires notification of token revocation to provide a good experience for users, you must integrate with our Cross-Account Protection service.
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Connect
Blog
Instagram
LinkedIn
X (Twitter)
YouTube
Programs
Google Developer Groups
Google Developer Experts
Accelerators
Women Techmakers
Google Cloud & NVIDIA
Developer consoles
Google API Console
Google Cloud Platform Console
Google Play Console
Firebase Console
Actions on Google Console
Cast SDK Developer Console
Chrome Web Store Dashboard
Google Home Developer Console

Android
Chrome
Firebase
Google Cloud Platform
Google AI
All products
Terms
Privacy
Sign up for the Google for Developers newsletterSubscribe
English
Page info
bug_reportfullscreenclose
On this page
































Key Takeaways
AI-GENERATED
Applications built using Google APIs must prioritize security and user privacy, adhering to Google's Terms of Service and policies, including OAuth 2.0 requirements.
Developers must register an appropriate OAuth client for each platform their application runs on and maintain separate projects for testing and production environments.
Sensitive data like OAuth client credentials and user tokens should be handled securely, stored safely, and never exposed in public code repositories.
Applications must accurately represent their identity with verified brand information, only request necessary user data scopes, and use secure communication protocols.
Developers need to manage consent for multiple user data scopes, handle token revocation and expiration, and ensure their application has a publicly accessible homepage with relevant information.
outlined_flag
The new page has loaded.

Skip to main content
Identity
Authentication
Authorization
Cross-platform
Cross-Account Protection (RISC)
/
English
Authorization
Google Account Authorization
App verification to use Google Authorization APIs
Google Account Linking
Resources
































































Home
Products
Google Identity
Authorization
Google Account Authorization
Was this helpful?
Send feedback
Using OAuth 2.0 for Web Server Applications
bookmark_border
This document explains how web server applications use Google API Client Libraries or Google OAuth 2.0 endpoints to implement OAuth 2.0 authorization to access Google APIs.
OAuth 2.0 allows users to share specific data with an application while keeping their usernames, passwords, and other information private. For example, an application can use OAuth 2.0 to obtain permission from users to store files in their Google Drives.
This OAuth 2.0 flow is specifically for user authorization. It is designed for applications that can store confidential information and maintain state. A properly authorized web server application can access an API while the user interacts with the application or after the user has left the application.
Web server applications frequently also use service accounts to authorize API requests, particularly when calling Cloud APIs to access project-based data rather than user-specific data. Web server applications can use service accounts in conjunction with user authorization.
Note: Given the security implications of getting the implementation correct, we strongly encourage you to use OAuth 2.0 libraries when interacting with Google's OAuth 2.0 endpoints. It is a best practice to use well-debugged code provided by others, and it will help you protect yourself and your users. For more information, see Client libraries.
Client libraries
The language-specific examples on this page use Google API Client Libraries to implement OAuth 2.0 authorization. To run the code samples, you must first install the client library for your language.
When you use a Google API Client Library to handle your application's OAuth 2.0 flow, the client library performs many actions that the application would otherwise need to handle on its own. For example, it determines when the application can use or refresh stored access tokens as well as when the application must reacquire consent. The client library also generates correct redirect URLs and helps to implement redirect handlers that exchange authorization codes for access tokens.
Google API Client Libraries for server-side applications are available for the following languages:
Go
Java
.NET
Node.js
PHP
Python
Ruby
Important: The Google API client library for JavaScript and Sign In With Google are only intended to handle OAuth 2.0 in the user's browser. If you want to use JavaScript on the server-side to manage OAuth 2.0 interactions with Google, consider using the Node.js library on your back-end platform.
Prerequisites
Enable APIs for your project
Any application that calls Google APIs needs to enable those APIs in the API Console.
To enable an API for your project:
Open the API Library in the Google API Console.
If prompted, select a project, or create a new one.
The API Library lists all available APIs, grouped by product family and popularity. If the API you want to enable isn't visible in the list, use search to find it, or click View All in the product family it belongs to.
Select the API you want to enable, then click the Enable button.
If prompted, enable billing.
If prompted, read and accept the API's Terms of Service.
Create authorization credentials
Any application that uses OAuth 2.0 to access Google APIs must have authorization credentials that identify the application to Google's OAuth 2.0 server. The following steps explain how to create credentials for your project. Your applications can then use the credentials to access APIs that you have enabled for that project.
Go to the Clients page.
Click Create Client.
Select the Web application application type.
Fill in the form and click Create. Applications that use languages and frameworks like PHP, Java, Python, Ruby, and .NET must specify authorized redirect URIs. The redirect URIs are the endpoints to which the OAuth 2.0 server can send responses. These endpoints must adhere to Google’s validation rules.
For testing, you can specify URIs that refer to the local machine, such as http://localhost:8080. With that in mind, please note that all of the examples in this document use http://localhost:8080 as the redirect URI.
We recommend that you design your app's auth endpoints so that your application does not expose authorization codes to other resources on the page.
After creating your credentials, download the client_secret.json file from the API Console. Securely store the file in a location that only your application can access.
Important: Do not store the client_secret.json file in a publicly-accessible location. In addition, if you share the source code to your application — for example, on GitHub — store the client_secret.json file outside of your source tree to avoid inadvertently sharing your client credentials.
Identify access scopes
Scopes enable your application to only request access to the resources that it needs while also enabling users to control the amount of access that they grant to your application. Thus, there may be an inverse relationship between the number of scopes requested and the likelihood of obtaining user consent.
Before you start implementing OAuth 2.0 authorization, we recommend that you identify the scopes that your app will need permission to access.
We also recommend that your application request access to authorization scopes via an incremental authorization process, in which your application requests access to user data in context. This best practice helps users to more easily understand why your application needs the access it is requesting.
The OAuth 2.0 API Scopes document contains a full list of scopes that you might use to access Google APIs.
If your public application uses scopes that permit access to certain user data, it must complete a verification process. If you see unverified app on the screen when testing your application, you must submit a verification request to remove it. Find out more about unverified apps and get answers to frequently asked questions about app verification in the Help Center.
Language-specific requirements
To run any of the code samples in this document, you'll need a Google account, access to the Internet, and a web browser. If you are using one of the API client libraries, also see the language-specific requirements below.
PHP
Python
Ruby
Node.js
HTTP/REST
To run the PHP code samples in this document, you'll need:
PHP 8.0 or greater with the command-line interface (CLI) and JSON extension installed.
The Composer dependency management tool.
The Google APIs Client Library for PHP:
composer require google/apiclient:^2.15.0
See Google APIs Client Library for PHP for more information.
Obtaining OAuth 2.0 access tokens
The following steps show how your application interacts with Google's OAuth 2.0 server to obtain a user's consent to perform an API request on the user's behalf. Your application must have that consent before it can execute a Google API request that requires user authorization.
The list below quickly summarizes these steps:
Your application identifies the permissions it needs.
Your application redirects the user to Google along with the list of requested permissions.
The user decides whether to grant the permissions to your application.
Your application finds out what the user decided.
If the user granted the requested permissions, your application retrieves tokens needed to make API requests on the user's behalf.
Step 1: Set authorization parameters
Your first step is to create the authorization request. That request sets parameters that identify your application and define the permissions that the user will be asked to grant to your application.
If you use a Google client library for OAuth 2.0 authentication and authorization, you create and configure an object that defines these parameters.
If you call the Google OAuth 2.0 endpoint directly, you'll generate a URL and set the parameters on that URL.
The tabs below define the supported authorization parameters for web server applications. The language-specific examples also show how to use a client library or authorization library to configure an object that sets those parameters.
PHP
Python
Ruby
Node.js
HTTP/REST
The following code snippet creates a Google\Client() object, which defines the parameters in the authorization request.
That object uses information from your client_secret.json file to identify your application. (See creating authorization credentials for more about that file.) The object also identifies the scopes that your application is requesting permission to access and the URL to your application's auth endpoint, which will handle the response from Google's OAuth 2.0 server. Finally, the code sets the optional access_type and include_granted_scopes parameters.
For example, this code requests read-only, offline access to a user's Google Drive metadata and Calendar events:
use Google\Client;

$client = new Client();

// Required, call the setAuthConfig function to load authorization credentials from
// client_secret.json file.
$client->setAuthConfig('client_secret.json');

// Required, to set the scope value, call the addScope function
$client->addScope([Google\Service\Drive::DRIVE_METADATA_READONLY, Google\Service\Calendar::CALENDAR_READONLY]);

// Required, call the setRedirectUri function to specify a valid redirect URI for the
// provided client_id
$client->setRedirectUri('http://' . $_SERVER['HTTP_HOST'] . '/oauth2callback.php');

// Recommended, offline access will give you both an access and refresh token so that
// your app can refresh the access token without user interaction.
$client->setAccessType('offline');

// Recommended, call the setState function. Using a state value can increase your assurance that
// an incoming connection is the result of an authentication request.
$client->setState($sample_passthrough_value);

// Optional, if your application knows which user is trying to authenticate, it can use this
// parameter to provide a hint to the Google Authentication Server.
$client->setLoginHint('hint@example.com');

// Optional, call the setPrompt function to set "consent" will prompt the user for consent
$client->setPrompt('consent');

// Optional, call the setIncludeGrantedScopes function with true to enable incremental
// authorization
$client->setIncludeGrantedScopes(true);
The Google authorization server supports the following query string parameters for web server applications:
Parameters
client_id
Required
The client ID for your application. You can find this value in the Cloud Console Clients page.
redirect_uri
Required
Determines where the API server redirects the user after the user completes the authorization flow. The value must exactly match one of the authorized redirect URIs for the OAuth 2.0 client, which you configured in your client's Cloud Console Clients page. If this value doesn't match an authorized redirect URI for the provided client_id you will get a redirect_uri_mismatch error.
Note that the http or https scheme, case, and trailing slash ('/') must all match.
response_type
Required
Determines whether the Google OAuth 2.0 endpoint returns an authorization code.
Set the parameter value to code for web server applications.
scope
Required
A space-delimited list of scopes that identify the resources that your application could access on the user's behalf. These values inform the consent screen that Google displays to the user.
Scopes enable your application to only request access to the resources that it needs while also enabling users to control the amount of access that they grant to your application. Thus, there is an inverse relationship between the number of scopes requested and the likelihood of obtaining user consent.
We recommend that your application request access to authorization scopes in context whenever possible. By requesting access to user data in context, via incremental authorization, you help users to more easily understand why your application needs the access it is requesting.
access_type
Recommended
Indicates whether your application can refresh access tokens when the user is not present at the browser. Valid parameter values are online, which is the default value, and offline.
Set the value to offline if your application needs to refresh access tokens when the user is not present at the browser. This is the method of refreshing access tokens described later in this document. This value instructs the Google authorization server to return a refresh token and an access token the first time that your application exchanges an authorization code for tokens.
state
Recommended
Specifies any string value that your application uses to maintain state between your authorization request and the authorization server's response. The server returns the exact value that you send as a name=value pair in the URL query component (?) of the redirect_uri after the user consents to or denies your application's access request.
You can use this parameter for several purposes, such as directing the user to the correct resource in your application, sending nonces, and mitigating cross-site request forgery. Since your redirect_uri can be guessed, using a state value can increase your assurance that an incoming connection is the result of an authentication request. If you generate a random string or encode the hash of a cookie or another value that captures the client's state, you can validate the response to additionally ensure that the request and response originated in the same browser, providing protection against attacks such as cross-site request forgery. See the OpenID Connect documentation for an example of how to create and confirm a state token.
Important: The OAuth client must prevent CSRF as called out in the OAuth2 Specification . One way to achieve this is by using the state parameter to maintain state between your authorization request and the authorization server's response.
include_granted_scopes
Optional
Enables applications to use incremental authorization to request access to additional scopes in context. If you set this parameter's value to true and the authorization request is granted, then the new access token will also cover any scopes to which the user previously granted the application access. See the incremental authorization section for examples.
enable_granular_consent
Optional
Defaults to true. If set to false, more granular Google Account permissions will be disabled for OAuth client IDs created before 2019. No effect for newer OAuth client IDs, since more granular permissions is always enabled for them.
When Google enables granular permissions for an application, this parameter will no longer have any effect.
login_hint
Optional
If your application knows which user is trying to authenticate, it can use this parameter to provide a hint to the Google Authentication Server. The server uses the hint to simplify the login flow either by prefilling the email field in the sign-in form or by selecting the appropriate multi-login session.
Set the parameter value to an email address or sub identifier, which is equivalent to the user's Google ID.
prompt
Optional
A space-delimited, case-sensitive list of prompts to present the user. If you don't specify this parameter, the user will be prompted only the first time your project requests access. See Prompting re-consent for more information.
Possible values are:
none
Do not display any authentication or consent screens. Must not be specified with other values.
consent
Prompt the user for consent.
select_account
Prompt the user to select an account.




Step 2: Redirect to Google's OAuth 2.0 server
Redirect the user to Google's OAuth 2.0 server to initiate the authentication and authorization process. Typically, this occurs when your application first needs to access the user's data. In the case of incremental authorization, this step also occurs when your application first needs to access additional resources that it does not yet have permission to access.
PHP
Python
Ruby
Node.js
HTTP/REST
Generate a URL to request access from Google's OAuth 2.0 server:
$auth_url = $client->createAuthUrl();
Redirect the user to $auth_url:
header('Location: ' . filter_var($auth_url, FILTER_SANITIZE_URL));
Google's OAuth 2.0 server authenticates the user and obtains consent from the user for your application to access the requested scopes. The response is sent back to your application using the redirect URL you specified.
Step 3: Google prompts user for consent
In this step, the user decides whether to grant your application the requested access. At this stage, Google displays a consent window that shows the name of your application and the Google API services that it is requesting permission to access with the user's authorization credentials and a summary of the scopes of access to be granted. The user can then consent to grant access to one or more scopes requested by your application or refuse the request.
Your application doesn't need to do anything at this stage as it waits for the response from Google's OAuth 2.0 server indicating whether any access was granted. That response is explained in the following step.
Errors
Requests to Google's OAuth 2.0 authorization endpoint may display user-facing error messages instead of the expected authentication and authorization flows. Common error codes and suggested resolutions are listed below.
admin_policy_enforced
The Google Account is unable to authorize one or more scopes requested due to the policies of their Google Workspace administrator. See the Google Workspace Admin help article Control which third-party & internal apps access Google Workspace data for more information about how an administrator may restrict access to all scopes or sensitive and restricted scopes until access is explicitly granted to your OAuth client ID.
disallowed_useragent
The authorization endpoint is displayed inside an embedded user-agent disallowed by Google's OAuth 2.0 Policies.
Android
iOS
Android developers may encounter this error message when opening authorization requests in android.webkit.WebView. Developers should instead use Android libraries such as Google Sign-In for Android or OpenID Foundation's AppAuth for Android.
Web developers may encounter this error when an Android app opens a general web link in an embedded user-agent and a user navigates to Google's OAuth 2.0 authorization endpoint from your site. Developers should allow general links to open in the default link handler of the operating system, which includes both Android App Links handlers or the default browser app. The Android Custom Tabs library is also a supported option.
org_internal
The OAuth client ID in the request is part of a project limiting access to Google Accounts in a specific Google Cloud Organization. For more information about this configuration option see the User type section in the Setting up your OAuth consent screen help article.
invalid_client
The OAuth client secret is incorrect. Review the OAuth client configuration, including the client ID and secret used for this request.
deleted_client
The OAuth client being used to make the request has been deleted. Deletion can happen manually or automatically in the case of unused clients . Deleted clients can be restored within 30 days of the deletion. Learn more .
invalid_grant
When refreshing an access token or using incremental authorization, the token may have expired or has been invalidated. Authenticate the user again and ask for user consent to obtain new tokens. If you are continuing to see this error, ensure that your application has been configured correctly and that you are using the correct tokens and parameters in your request. Otherwise, the user account may have been deleted or disabled.
redirect_uri_mismatch
The redirect_uri passed in the authorization request does not match an authorized redirect URI for the OAuth client ID. Review authorized redirect URIs in the Google Cloud Console Clients page.
The redirect_uri parameter may refer to the OAuth out-of-band (OOB) flow that has been deprecated and is no longer supported. Refer to the migration guide to update your integration.
invalid_request
There was something wrong with the request you made. This could be due to a number of reasons:
The request was not properly formatted
The request was missing required parameters
The request uses an authorization method that Google doesn't support. Verify your OAuth integration uses a recommended integration method
Step 4: Handle the OAuth 2.0 server response
Important: Before handling the OAuth 2.0 response on the server, you should confirm that the state received from Google matches the state sent in the authorization request. This verification helps to ensure that the user, not a malicious script, is making the request and reduces the risk of CSRF attacks.
The OAuth 2.0 server responds to your application's access request by using the URL specified in the request.
If the user approves the access request, then the response contains an authorization code. If the user does not approve the request, the response contains an error message. The authorization code or error message that is returned to the web server appears on the query string, as shown below:
An error response:
https://oauth2.example.com/auth?error=access_denied
An authorization code response:
https://oauth2.example.com/auth?code=4/P7q7W91a-oMsCeLvIaQm6bTrgtp7
Important: If your response endpoint renders an HTML page, any resources on that page will be able to see the authorization code in the URL. Scripts can read the URL directly, and the URL in the Referer HTTP header may be sent to any or all resources on the page.
Carefully consider whether you want to send authorization credentials to all resources on that page (especially third-party scripts such as social plugins and analytics). To avoid this issue, we recommend that the server first handle the request, then redirect to another URL that doesn't include the response parameters.
Sample OAuth 2.0 server response
You can test this flow by clicking on the following sample URL, which requests read-only access to view metadata for files in your Google Drive and read-only access to view your Google Calendar events:
https://accounts.google.com/o/oauth2/v2/auth?
 scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly%20https%3A//www.googleapis.com/auth/calendar.readonly&
 access_type=offline&
 include_granted_scopes=true&
 response_type=code&
 state=state_parameter_passthrough_value&
 redirect_uri=https%3A//oauth2.example.com/code&
 client_id=client_id
After completing the OAuth 2.0 flow, you should be redirected to http://localhost/oauth2callback, which will likely yield a 404 NOT FOUND error unless your local machine serves a file at that address. The next step provides more detail about the information returned in the URI when the user is redirected back to your application.
Step 5: Exchange authorization code for refresh and access tokens
After the web server receives the authorization code, it can exchange the authorization code for an access token.
PHP
Python
Ruby
Node.js
HTTP/REST
To exchange an authorization code for an access token, use the fetchAccessTokenWithAuthCode method:
$access_token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
Errors
When exchanging the authorization code for an access token you may encounter the following error instead of the expected response. Common error codes and suggested resolutions are listed below.
invalid_grant
The supplied authorization code is invalid or in the wrong format. Request a new code by restarting the OAuth process to prompt the user for consent again.
Step 6: Check which scopes users granted
When requesting multiple permissions (scopes), users may not grant your app access to all of them. Your app must verify which scopes were actually granted and gracefully handle situations where some permissions are denied, typically by disabling the features that rely on those denied scopes.
However, there are exceptions. Google Workspace Enterprise apps with domain-wide delegation of authority, or apps marked as Trusted, bypass the granular permissions consent screen. For these apps, users won't see the granular permission consent screen. Instead, your app will either receive all requested scopes or none.
For more detailed information, see How to handle granular permissions.
PHP
Python
Ruby
Node.js
HTTP/REST
To check which scopes the user has granted, use the getGrantedScope() method:
// Space-separated string of granted scopes if it exists, otherwise null.
$granted_scopes = $client->getOAuth2Service()->getGrantedScope();

// Determine which scopes user granted and build a dictionary
$granted_scopes_dict = [
  'Drive' => str_contains($granted_scopes, Google\Service\Drive::DRIVE_METADATA_READONLY),
  'Calendar' => str_contains($granted_scopes, Google\Service\Calendar::CALENDAR_READONLY)
];
Call Google APIs
PHP
Python
Ruby
Node.js
HTTP/REST
Use the access token to call Google APIs by completing the following steps:
If you need to apply an access token to a new Google\Client object — for example, if you stored the access token in a user session — use the setAccessToken method:
$client->setAccessToken($access_token);
Build a service object for the API that you want to call. You build a service object by providing an authorized Google\Client object to the constructor for the API you want to call. For example, to call the Drive API:
$drive = new Google\Service\Drive($client);
Make requests to the API service using the interface provided by the service object. For example, to list the files in the authenticated user's Google Drive:
$files = $drive->files->listFiles(array());
Complete example
The following example prints a JSON-formatted list of files in a user's Google Drive after the user authenticates and gives consent for the application to access the user's Drive metadata.
PHP
Python
Ruby
Node.js
HTTP/REST
To run this example:
In the API Console, add the URL of the local machine to the list of redirect URLs. For example, add http://localhost:8080.
Create a new directory and change to it. For example:
mkdir ~/php-oauth2-example
cd ~/php-oauth2-example
Install the Google API Client Library for PHP using Composer:
composer require google/apiclient:^2.15.0
Create the files index.php and oauth2callback.php with the following content.
Run the example with the PHP's built-in test web server:
php -S localhost:8080 ~/php-oauth2-example
index.php
<?php
require_once __DIR__.'/vendor/autoload.php';

session_start();

$client = new Google\Client();
$client->setAuthConfig('client_secret.json');

// User granted permission as an access token is in the session.
if (isset($_SESSION['access_token']) && $_SESSION['access_token'])
{
  $client->setAccessToken($_SESSION['access_token']);
  
  // Check if user granted Drive permission
  if ($_SESSION['granted_scopes_dict']['Drive']) {
    echo "Drive feature is enabled.";
    echo "</br>";
    $drive = new Drive($client);
    $files = array();
    $response = $drive->files->listFiles(array());
    foreach ($response->files as $file) {
        echo "File: " . $file->name . " (" . $file->id . ")";
        echo "</br>";
    }
  } else {
    echo "Drive feature is NOT enabled.";
    echo "</br>";
  }

   // Check if user granted Calendar permission
  if ($_SESSION['granted_scopes_dict']['Calendar']) {
    echo "Calendar feature is enabled.";
    echo "</br>";
  } else {
    echo "Calendar feature is NOT enabled.";
    echo "</br>";
  }
}
else
{
  // Redirect users to outh2call.php which redirects users to Google OAuth 2.0
  $redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . '/oauth2callback.php';
  header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
}
?>
oauth2callback.php
<?php
require_once __DIR__.'/vendor/autoload.php';

session_start();

$client = new Google\Client();

// Required, call the setAuthConfig function to load authorization credentials from
// client_secret.json file.
$client->setAuthConfigFile('client_secret.json');
$client->setRedirectUri('http://' . $_SERVER['HTTP_HOST']. $_SERVER['PHP_SELF']);

// Required, to set the scope value, call the addScope function.
$client->addScope([Google\Service\Drive::DRIVE_METADATA_READONLY, Google\Service\Calendar::CALENDAR_READONLY]);

// Enable incremental authorization. Recommended as a best practice.
$client->setIncludeGrantedScopes(true);

// Recommended, offline access will give you both an access and refresh token so that
// your app can refresh the access token without user interaction.
$client->setAccessType("offline");

// Generate a URL for authorization as it doesn't contain code and error
if (!isset($_GET['code']) && !isset($_GET['error']))
{
  // Generate and set state value
  $state = bin2hex(random_bytes(16));
  $client->setState($state);
  $_SESSION['state'] = $state;

  // Generate a url that asks permissions.
  $auth_url = $client->createAuthUrl();
  header('Location: ' . filter_var($auth_url, FILTER_SANITIZE_URL));
}

// User authorized the request and authorization code is returned to exchange access and
// refresh tokens.
if (isset($_GET['code']))
{
  // Check the state value
  if (!isset($_GET['state']) || $_GET['state'] !== $_SESSION['state']) {
    die('State mismatch. Possible CSRF attack.');
  }

  // Get access and refresh tokens (if access_type is offline)
  $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);

  /** Save access and refresh token to the session variables.
    * ACTION ITEM: In a production app, you likely want to save the
    *              refresh token in a secure persistent storage instead. */
  $_SESSION['access_token'] = $token;
  $_SESSION['refresh_token'] = $client->getRefreshToken();
  
  // Space-separated string of granted scopes if it exists, otherwise null.
  $granted_scopes = $client->getOAuth2Service()->getGrantedScope();

  // Determine which scopes user granted and build a dictionary
  $granted_scopes_dict = [
    'Drive' => str_contains($granted_scopes, Google\Service\Drive::DRIVE_METADATA_READONLY),
    'Calendar' => str_contains($granted_scopes, Google\Service\Calendar::CALENDAR_READONLY)
  ];
  $_SESSION['granted_scopes_dict'] = $granted_scopes_dict;
  
  $redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . '/';
  header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
}

// An error response e.g. error=access_denied
if (isset($_GET['error']))
{
  echo "Error: ". $_GET['error'];
}
?>
Redirect URI validation rules
Google applies the following validation rules to redirect URIs in order to help developers keep their applications secure. Your redirect URIs must adhere to these rules. See RFC 3986 section 3 for the definition of domain, host, path, query, scheme and userinfo, mentioned below.
Validation rules
Scheme
Redirect URIs must use the HTTPS scheme, not plain HTTP. Localhost URIs (including localhost IP address URIs) are exempt from this rule.
Host
Hosts cannot be raw IP addresses. Localhost IP addresses are exempted from this rule.
Domain
Host TLDs (Top Level Domains) must belong to the public suffix list.
Host domains cannot be “googleusercontent.com”.
Redirect URIs cannot contain URL shortener domains (e.g. goo.gl) unless the app owns the domain. Furthermore, if an app that owns a shortener domain chooses to redirect to that domain, that redirect URI must either contain “/google-callback/” in its path or end with “/google-callback”.
Userinfo
Redirect URIs cannot contain the userinfo subcomponent.
Path
Redirect URIs cannot contain a path traversal (also called directory backtracking), which is represented by an “/..” or “\..” or their URL encoding.
Query
Redirect URIs cannot contain open redirects.
Fragment
Redirect URIs cannot contain the fragment component.
Characters
Redirect URIs cannot contain certain characters including:
Wildcard characters ('*')
Non-printable ASCII characters
Invalid percent encodings (any percent encoding that does not follow URL-encoding form of a percent sign followed by two hexadecimal digits)
Null characters (an encoded NULL character, e.g., %00, %C0%80)

Incremental authorization
In the OAuth 2.0 protocol, your app requests authorization to access resources, which are identified by scopes. It is considered a best user-experience practice to request authorization for resources at the time you need them. To enable that practice, Google's authorization server supports incremental authorization. This feature lets you request scopes as they are needed and, if the user grants permission for the new scope, returns an authorization code that may be exchanged for a token containing all scopes the user has granted the project.
For example, an app that lets people sample music tracks and create mixes might need very few resources at sign-in time, perhaps nothing more than the name of the person signing in. However, saving a completed mix would require access to their Google Drive. Most people would find it natural if they only were asked for access to their Google Drive at the time the app actually needed it.
In this case, at sign-in time the app might request the openid and profile scopes to perform basic sign-in, and then later request the https://www.googleapis.com/auth/drive.file scope at the time of the first request to save a mix.
To implement incremental authorization, you complete the normal flow for requesting an access token but make sure that the authorization request includes previously granted scopes. This approach allows your app to avoid having to manage multiple access tokens.
The following rules apply to an access token obtained from an incremental authorization:
The token can be used to access resources corresponding to any of the scopes rolled into the new, combined authorization.
When you use the refresh token for the combined authorization to obtain an access token, the access token represents the combined authorization and can be used for any of the scope values included in the response.
The combined authorization includes all scopes that the user granted to the API project even if the grants were requested from different clients. For example, if a user granted access to one scope using an application's desktop client and then granted another scope to the same application via a mobile client, the combined authorization would include both scopes.
If you revoke a token that represents a combined authorization, access to all of that authorization's scopes on behalf of the associated user are revoked simultaneously.
Caution: choosing to include granted scopes will automatically add scopes previously granted by the user to your authorization request. A warning or error page may be displayed if your app is not currently approved to request all scopes that may be returned in the response. See Unverified apps for more information.
The language-specific code samples in Step 1: Set authorization parameters and the sample HTTP/REST redirect URL in Step 2: Redirect to Google's OAuth 2.0 server all use incremental authorization. The code samples below also show the code that you need to add to use incremental authorization.
PHP
Python
Ruby
Node.js
HTTP/REST
$client->setIncludeGrantedScopes(true);
Refreshing an access token (offline access)
Access tokens periodically expire and become invalid credentials for a related API request. You can refresh an access token without prompting the user for permission (including when the user is not present) if you requested offline access to the scopes associated with the token.
If you use a Google API Client Library, the client object refreshes the access token as needed as long as you configure that object for offline access.
If you are not using a client library, you need to set the access_type HTTP query parameter to offline when redirecting the user to Google's OAuth 2.0 server. In that case, Google's authorization server returns a refresh token when you exchange an authorization code for an access token. Then, if the access token expires (or at any other time), you can use a refresh token to obtain a new access token.
Requesting offline access is a requirement for any application that needs to access a Google API when the user is not present. For example, an app that performs backup services or executes actions at predetermined times needs to be able to refresh its access token when the user is not present. The default style of access is called online.
Server-side web applications, installed applications, and devices all obtain refresh tokens during the authorization process. Refresh tokens are not typically used in client-side (JavaScript) web applications.
PHP
Python
Ruby
Node.js
HTTP/REST
If your application needs offline access to a Google API, set the API client's access type to offline:
$client->setAccessType("offline");
After a user grants offline access to the requested scopes, you can continue to use the API client to access Google APIs on the user's behalf when the user is offline. The client object will refresh the access token as needed.
Revoking a token
In some cases a user may wish to revoke access given to an application. A user can revoke access by visiting Account Settings. See the Remove site or app access section of the Third-party sites & apps with access to your account support document for more information.
It is also possible for an application to programmatically revoke the access given to it. Programmatic revocation is important in instances where a user unsubscribes, removes an application, or the API resources required by an app have significantly changed. In other words, part of the removal process can include an API request to ensure the permissions previously granted to the application are removed.
PHP
Python
Ruby
Node.js
HTTP/REST
To programmatically revoke a token, call revokeToken():
$client->revokeToken();
Note: Following a successful revocation response, it might take some time before the revocation has full effect.
Time-based access
Time-based access allows a user to grant your app access to their data for a limited duration to complete an action. Time-based access is available in select Google products during the consent flow, giving users the option to grant access for a limited period of time. An example is the Data Portability API which enables a one-time transfer of data.
When a user grants your application time-based access, the refresh token will expire after the specified duration. Note that refresh tokens may be invalidated earlier under specific circumstances; see these cases for details. The refresh_token_expires_in field returned in the authorization code exchange response represents the time remaining until the refresh token expires in such cases.
Implementing Cross-Account Protection
An additional step you should take to protect your users' accounts is implementing Cross-Account Protection by utilizing Google's Cross-Account Protection Service. This service lets you subscribe to security event notifications which provide information to your application about major changes to the user account. You can then use the information to take action depending on how you decide to respond to events.
Some examples of the event types sent to your app by Google's Cross-Account Protection Service are:
https://schemas.openid.net/secevent/risc/event-type/sessions-revoked
https://schemas.openid.net/secevent/oauth/event-type/token-revoked
https://schemas.openid.net/secevent/risc/event-type/account-disabled
See the Protect user accounts with Cross-Account Protection page for more information on how to implement Cross Account Protection and for the full list of available events.
Was this helpful?
Send feedback
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-06-25 UTC.
GitHub
Fork our samples and try them yourself
Stack Overflow
Ask a question under the google-oauth tag
Blog
The latest news on the Google Developers blog
Product Info
Terms of Service
APIs User Data Policy
Branding Guidelines
Stack Overflow
Google Identity
Sign In With Google
Google OAuth 2.0 and OpenID Connect
Google Account Linking
Developer consoles
Google API Console
Google Cloud Platform Console
Google Play Console
Firebase Console
Actions on Google Console
Cast SDK Developer Console
Chrome Web Store Dashboard
Google Home Developer Console

Android
Chrome
Firebase
Google Cloud Platform
Google AI
All products
Terms
Privacy
Sign up for the Google for Developers newsletterSubscribe
English
Page info
bug_reportfullscreenclose
Key Takeaways
AI-GENERATED
Applications built using Google APIs must prioritize security and user privacy, adhering to Google's Terms of Service and policies, including OAuth 2.0 requirements.
Developers must register an appropriate OAuth client for each platform their application runs on and maintain separate projects for testing and production environments.
Sensitive data like OAuth client credentials and user tokens should be handled securely, stored safely, and never exposed in public code repositories.
Applications must accurately represent their identity with verified brand information, only request necessary user data scopes, and use secure communication protocols.
Developers need to manage consent for multiple user data scopes, handle token revocation and expiration, and ensure their application has a publicly accessible homepage with relevant information.
outlined_flag
The new page has loaded.
Skip to main content

Authentication
Sign In with Google
Passkeys
Credential sharing
Samples
Authorization
Cross-platform
Cross-Account Protection (RISC)
/
English
Google Account Authorization
App verification to use Google Authorization APIs
Google Account Linking
Resources
























Authorization
Was this helpful?
OAuth 2.0 for Client-side Web Applications
bookmark_border
This document explains how to implement OAuth 2.0 authorization to access Google APIs from a JavaScript web application. OAuth 2.0 allows users to share specific data with an application while keeping their usernames, passwords, and other information private. For example, an application can use OAuth 2.0 to obtain permission from users to store files in their Google Drives.
This OAuth 2.0 flow is called the implicit grant flow. It is designed for applications that access APIs only while the user is present at the application. These applications are not able to store confidential information.
In this flow, your app opens a Google URL that uses query parameters to identify your app and the type of API access that the app requires. You can open the URL in the current browser window or a popup. The user can authenticate with Google and grant the requested permissions. Google then redirects the user back to your app. The redirect includes an access token, which your app verifies and then uses to make API requests.
Google APIs Client Library and Google Identity Services
If you use Google APIs client library for JavaScript to make authorized calls to Google, you should use Google Identity Services JavaScript library to handle the OAuth 2.0 flow. Please see Google identity Services' token model, which is based upon the OAuth 2.0 implicit grant flow.
Note: Given the security implications of getting the implementation correct, we strongly encourage you to use OAuth 2.0 libraries such as Google identity Services' token model when interacting with Google's OAuth 2.0 endpoints. It is a best practice to use well-debugged code provided by others, and it will help you protect yourself and your users.
Rest of this page details how to interact with Google's OAuth 2.0 endpoints directly without using any OAuth 2.0 library.
Prerequisites
Enable APIs for your project
Any application that calls Google APIs needs to enable those APIs in the API Console.
To enable an API for your project:
Open the API Library in the Google API Console.
If prompted, select a project, or create a new one.
The API Library lists all available APIs, grouped by product family and popularity. If the API you want to enable isn't visible in the list, use search to find it, or click View All in the product family it belongs to.
Select the API you want to enable, then click the Enable button.
If prompted, enable billing.
If prompted, read and accept the API's Terms of Service.
Create authorization credentials
Any application that uses OAuth 2.0 to access Google APIs must have authorization credentials that identify the application to Google's OAuth 2.0 server. The following steps explain how to create credentials for your project. Your applications can then use the credentials to access APIs that you have enabled for that project.
Go to the Clients page.
Click Create Client.
Select the Web application application type.
Complete the form. Applications that use JavaScript to make authorized Google API requests must specify authorized JavaScript origins. The origins identify the domains from which your application can send requests to the OAuth 2.0 server. These origins must adhere to Google’s validation rules.
Identify access scopes
Scopes enable your application to only request access to the resources that it needs while also enabling users to control the amount of access that they grant to your application. Thus, there may be an inverse relationship between the number of scopes requested and the likelihood of obtaining user consent.
Before you start implementing OAuth 2.0 authorization, we recommend that you identify the scopes that your app will need permission to access.
The OAuth 2.0 API Scopes document contains a full list of scopes that you might use to access Google APIs.
If your public application uses scopes that permit access to certain user data, it must complete a verification process. If you see unverified app on the screen when testing your application, you must submit a verification request to remove it. Find out more about unverified apps and get answers to frequently asked questions about app verification in the Help Center.
Obtaining OAuth 2.0 access tokens
The following steps show how your application interacts with Google's OAuth 2.0 server to obtain a user's consent to perform an API request on the user's behalf. Your application must have that consent before it can execute a Google API request that requires user authorization.
Step 1: Redirect to Google's OAuth 2.0 server
To request permission to access a user's data, redirect the user to Google's OAuth 2.0 server.
OAuth 2.0 Endpoints
Generate a URL to request access from Google's OAuth 2.0 endpoint at https://accounts.google.com/o/oauth2/v2/auth. This endpoint is accessible over HTTPS; plain HTTP connections are refused.
The Google authorization server supports the following query string parameters for web server applications:
Parameters
client_id
Required
The client ID for your application. You can find this value in the Cloud Console Clients page.
redirect_uri
Required
Determines where the API server redirects the user after the user completes the authorization flow. The value must exactly match one of the authorized redirect URIs for the OAuth 2.0 client, which you configured in your client's Cloud Console Clients page. If this value doesn't match an authorized redirect URI for the provided client_id you will get a redirect_uri_mismatch error.
Note that the http or https scheme, case, and trailing slash ('/') must all match.
response_type
Required
JavaScript applications need to set the parameter's value to token. This value instructs the Google Authorization Server to return the access token as a name=value pair in the fragment identifier of the URI (#) to which the user is redirected after completing the authorization process.
scope
Required
A space-delimited list of scopes that identify the resources that your application could access on the user's behalf. These values inform the consent screen that Google displays to the user.
Scopes enable your application to only request access to the resources that it needs while also enabling users to control the amount of access that they grant to your application. Thus, there is an inverse relationship between the number of scopes requested and the likelihood of obtaining user consent.
We recommend that your application request access to authorization scopes in context whenever possible. By requesting access to user data in context, via incremental authorization, you help users to more easily understand why your application needs the access it is requesting.
state
Recommended
Specifies any string value that your application uses to maintain state between your authorization request and the authorization server's response. The server returns the exact value that you send as a name=value pair in the URL fragment identifier (#) of the redirect_uri after the user consents to or denies your application's access request.
You can use this parameter for several purposes, such as directing the user to the correct resource in your application, sending nonces, and mitigating cross-site request forgery. Since your redirect_uri can be guessed, using a state value can increase your assurance that an incoming connection is the result of an authentication request. If you generate a random string or encode the hash of a cookie or another value that captures the client's state, you can validate the response to additionally ensure that the request and response originated in the same browser, providing protection against attacks such as cross-site request forgery. See the OpenID Connect documentation for an example of how to create and confirm a state token.
Important: The OAuth client must prevent CSRF as called out in the OAuth2 Specification . One way to achieve this is by using the state parameter to maintain state between your authorization request and the authorization server's response.
include_granted_scopes
Optional
Enables applications to use incremental authorization to request access to additional scopes in context. If you set this parameter's value to true and the authorization request is granted, then the new access token will also cover any scopes to which the user previously granted the application access. See the incremental authorization section for examples.
enable_granular_consent
Optional
Defaults to true. If set to false, more granular Google Account permissions will be disabled for OAuth client IDs created before 2019. No effect for newer OAuth client IDs, since more granular permissions is always enabled for them.
When Google enables granular permissions for an application, this parameter will no longer have any effect.
login_hint
Optional
If your application knows which user is trying to authenticate, it can use this parameter to provide a hint to the Google Authentication Server. The server uses the hint to simplify the login flow either by prefilling the email field in the sign-in form or by selecting the appropriate multi-login session.
Set the parameter value to an email address or sub identifier, which is equivalent to the user's Google ID.
prompt
Optional
A space-delimited, case-sensitive list of prompts to present the user. If you don't specify this parameter, the user will be prompted only the first time your project requests access. See Prompting re-consent for more information.
Possible values are:
none
Do not display any authentication or consent screens. Must not be specified with other values.
consent
Prompt the user for consent.
select_account
Prompt the user to select an account.




Sample redirect to Google's authorization server
An example URL is shown below, with line breaks and spaces for readability.
https://accounts.google.com/o/oauth2/v2/auth?
 scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly%20https%3A//www.googleapis.com/auth/calendar.readonly&
 include_granted_scopes=true&
 response_type=token&
 state=state_parameter_passthrough_value&
 redirect_uri=https%3A//oauth2.example.com/code&
 client_id=client_id
After you create the request URL, redirect the user to it.
JavaScript sample code
The following JavaScript snippet shows how to initiate the authorization flow in JavaScript without using the Google APIs Client Library for JavaScript. Since this OAuth 2.0 endpoint does not support Cross-Origin Resource Sharing (CORS), the snippet creates a form that opens the request to that endpoint.
/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
function oauthSignIn() {
  // Google's OAuth 2.0 endpoint for requesting an access token
  var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

  // Create <form> element to submit parameters to OAuth 2.0 endpoint.
  var form = document.createElement('form');
  form.setAttribute('method', 'GET'); // Send as a GET request.
  form.setAttribute('action', oauth2Endpoint);

  // Parameters to pass to OAuth 2.0 endpoint.
  var params = {'client_id': 'YOUR_CLIENT_ID',
                'redirect_uri': 'YOUR_REDIRECT_URI',
                'response_type': 'token',
                'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly',
                'include_granted_scopes': 'true',
                'state': 'pass-through value'};

  // Add form parameters as hidden input values.
  for (var p in params) {
    var input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', p);
    input.setAttribute('value', params[p]);
    form.appendChild(input);
  }

  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  document.body.appendChild(form);
  form.submit();
}
Step 2: Google prompts user for consent
In this step, the user decides whether to grant your application the requested access. At this stage, Google displays a consent window that shows the name of your application and the Google API services that it is requesting permission to access with the user's authorization credentials and a summary of the scopes of access to be granted. The user can then consent to grant access to one or more scopes requested by your application or refuse the request.
Your application doesn't need to do anything at this stage as it waits for the response from Google's OAuth 2.0 server indicating whether any access was granted. That response is explained in the following step.
Errors
Requests to Google's OAuth 2.0 authorization endpoint may display user-facing error messages instead of the expected authentication and authorization flows. Common error codes and suggested resolutions are listed below.
admin_policy_enforced
The Google Account is unable to authorize one or more scopes requested due to the policies of their Google Workspace administrator. See the Google Workspace Admin help article Control which third-party & internal apps access Google Workspace data for more information about how an administrator may restrict access to all scopes or sensitive and restricted scopes until access is explicitly granted to your OAuth client ID.
disallowed_useragent
The authorization endpoint is displayed inside an embedded user-agent disallowed by Google's OAuth 2.0 Policies.
Android
iOS
Android developers may encounter this error message when opening authorization requests in android.webkit.WebView. Developers should instead use Android libraries such as Google Sign-In for Android or OpenID Foundation's AppAuth for Android.
Web developers may encounter this error when an Android app opens a general web link in an embedded user-agent and a user navigates to Google's OAuth 2.0 authorization endpoint from your site. Developers should allow general links to open in the default link handler of the operating system, which includes both Android App Links handlers or the default browser app. The Android Custom Tabs library is also a supported option.
org_internal
The OAuth client ID in the request is part of a project limiting access to Google Accounts in a specific Google Cloud Organization. For more information about this configuration option see the User type section in the Setting up your OAuth consent screen help article.
invalid_client
The origin from which the request was made is not authorized for this client. See origin_mismatch.
deleted_client
The OAuth client being used to make the request has been deleted. Deletion can happen manually or automatically in the case of unused clients . Deleted clients can be restored within 30 days of the deletion. Learn more .
invalid_grant
When using incremental authorization, the token may have expired or has been invalidated. Authenticate the user again and ask for user consent to obtain new tokens. If you are continuing to see this error, ensure that your application has been configured correctly and that you are using the correct tokens and parameters in your request. Otherwise, the user account may have been deleted or disabled.
origin_mismatch
The scheme, domain, and/or port of the JavaScript originating the authorization request may not match an authorized JavaScript origin URI registered for the OAuth client ID. Review authorized JavaScript origins in the Google Cloud Console Clients page.
redirect_uri_mismatch
The redirect_uri passed in the authorization request does not match an authorized redirect URI for the OAuth client ID. Review authorized redirect URIs in the Google Cloud Console Clients page.
The scheme, domain, and/or port of the JavaScript originating the authorization request may not match an authorized JavaScript origin URI registered for the OAuth client ID. Review authorized JavaScript origins in the Google Cloud Console Clients page.
The redirect_uri parameter may refer to the OAuth out-of-band (OOB) flow that has been deprecated and is no longer supported. Refer to the migration guide to update your integration.
invalid_request
There was something wrong with the request you made. This could be due to a number of reasons:
The request was not properly formatted
The request was missing required parameters
The request uses an authorization method that Google doesn't support. Verify your OAuth integration uses a recommended integration method
Step 3: Handle the OAuth 2.0 server response
OAuth 2.0 Endpoints
Important: Before handling the OAuth 2.0 response, you should confirm that the state received from Google matches the state sent in the authorization request. This verification helps to ensure that the user, not a malicious script, is making the request and reduces the risk of CSRF attacks.
The OAuth 2.0 server sends a response to the redirect_uri specified in your access token request.
If the user approves the request, then the response contains an access token. If the user does not approve the request, the response contains an error message. The access token or error message is returned on the hash fragment of the redirect URI, as shown below:
An access token response:
https://oauth2.example.com/callback#access_token=4/P7q7W91&token_type=Bearer&expires_in=3600
In addition to the access_token parameter, the fragment string also contains the token_type parameter, which is always set to Bearer, and the expires_in parameter, which specifies the lifetime of the token, in seconds. If the state parameter was specified in the access token request, its value is also included in the response.
An error response:
https://oauth2.example.com/callback#error=access_denied
Note: Your application should ignore any additional, unrecognized fields included in the query string.
Sample OAuth 2.0 server response
You can test this flow by clicking on the following sample URL, which requests read-only access to view metadata for files in your Google Drive and read-only access to view your Google Calendar events:
https://accounts.google.com/o/oauth2/v2/auth?
 scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly%20https%3A//www.googleapis.com/auth/calendar.readonly&
 include_granted_scopes=true&
 response_type=token&
 state=state_parameter_passthrough_value&
 redirect_uri=https%3A//oauth2.example.com/code&
 client_id=client_id
After completing the OAuth 2.0 flow, you will be redirected to http://localhost/oauth2callback. That URL will yield a 404 NOT FOUND error unless your local machine happens to serve a file at that address. The next step provides more detail about the information returned in the URI when the user is redirected back to your application.
Step 4: Check which scopes users granted
When requesting multiple permissions (scopes), users may not grant your app access to all of them. Your app must verify which scopes were actually granted and gracefully handle situations where some permissions are denied, typically by disabling the features that rely on those denied scopes.
However, there are exceptions. Google Workspace Enterprise apps with domain-wide delegation of authority, or apps marked as Trusted, bypass the granular permissions consent screen. For these apps, users won't see the granular permission consent screen. Instead, your app will either receive all requested scopes or none.
For more detailed information, see How to handle granular permissions.
OAuth 2.0 Endpoints
To check whether the user has granted your application access to a particular scope, exam the scope field in the access token response. The scopes of access granted by the access_token expressed as a list of space-delimited, case-sensitive strings.
For example, the following sample access token response indicates that the user has granted your application access to the read-only Drive activity and Calendar events permissions:
 {
    "access_token": "1/fFAGRNJru1FTz70BzhT3Zg",
    "expires_in": 3920,
    "token_type": "Bearer",
    "scope": "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly",
    "refresh_token": "1//xEoDL4iW3cxlI7yDbSRFYNG01kVKM2C-259HOF2aQbI"
  }
Calling Google APIs
OAuth 2.0 Endpoints
After your application obtains an access token, you can use the token to make calls to a Google API on behalf of a given user account if the scope(s) of access required by the API have been granted. To do this, include the access token in a request to the API by including either an access_token query parameter or an Authorization HTTP header Bearer value. When possible, the HTTP header is preferable, because query strings tend to be visible in server logs. In most cases you can use a client library to set up your calls to Google APIs (for example, when calling the Drive Files API).
You can try out all the Google APIs and view their scopes at the OAuth 2.0 Playground.
HTTP GET examples
A call to the drive.files endpoint (the Drive Files API) using the Authorization: Bearer HTTP header might look like the following. Note that you need to specify your own access token:
GET /drive/v2/files HTTP/1.1
Host: www.googleapis.com
Authorization: Bearer access_token
Here is a call to the same API for the authenticated user using the access_token query string parameter:
GET https://www.googleapis.com/drive/v2/files?access_token=access_token
curl examples
You can test these commands with the curl command-line application. Here's an example that uses the HTTP header option (preferred):
curl -H "Authorization: Bearer access_token" https://www.googleapis.com/drive/v2/files
Or, alternatively, the query string parameter option:
curl https://www.googleapis.com/drive/v2/files?access_token=access_token
JavaScript sample code
The code snippet below demonstrates how to use CORS (Cross-origin resource sharing) to send a request to a Google API. This example does not use the Google APIs Client Library for JavaScript. However, even if you are not using the client library, the CORS support guide in that library's documentation will likely help you to better understand these requests.
In this code snippet, the access_token variable represents the token you have obtained to make API requests on the authorized user's behalf. The complete example demonstrates how to store that token in the browser's local storage and retrieve it when making an API request.
var xhr = new XMLHttpRequest();
xhr.open('GET',
    'https://www.googleapis.com/drive/v3/about?fields=user&' +
    'access_token=' + params['access_token']);
xhr.onreadystatechange = function (e) {
  console.log(xhr.response);
};
xhr.send(null);
Complete example
OAuth 2.0 Endpoints
This code sample demonstrates how to complete the OAuth 2.0 flow in JavaScript without using the Google APIs Client Library for JavaScript. The code is for an HTML page that displays a button to try an API request. If you click the button, the code checks to see whether the page has stored an API access token in your browser's local storage. If so, it executes the API request. Otherwise, it initiates the OAuth 2.0 flow.
For the OAuth 2.0 flow, the page follows these steps:
It directs the user to Google's OAuth 2.0 server, which requests access to the https://www.googleapis.com/auth/drive.metadata.readonly and https://www.googleapis.com/auth/calendar.readonlyscopes.
After granting (or denying) access to one or more requested scopes, the user is redirected to the original page, which parses the access token from the fragment identifier string.
The page checks which scopes user has granted access to the application.
If the user has granted access to the requested scope()s, the page uses the access token to make the sample API request.
The API request calls the Drive API's about.get method to retrieve information about the authorized user's Google Drive account.
If the request executes successfully, the API response is logged in the browser's debugging console.
You can revoke access to the app through the Permissions page for your Google Account. The app will be listed as OAuth 2.0 Demo for Google API Docs.
To run this code locally, you need to set values for the YOUR_CLIENT_ID and YOUR_REDIRECT_URI variables that correspond to your authorization credentials. The YOUR_REDIRECT_URI variable should be set to the same URL where the page is being served. The value must exactly match one of the authorized redirect URIs for the OAuth 2.0 client, which you configured in the Cloud Console Clients page. If this value doesn't match an authorized URI, you will get a redirect_uri_mismatch error. Your project must also have enabled the appropriate API for this request.
<html><head></head><body>
<script>
  var YOUR_CLIENT_ID = 'REPLACE_THIS_VALUE';
  var YOUR_REDIRECT_URI = 'REPLACE_THIS_VALUE';

  // Parse query string to see if page request is coming from OAuth 2.0 server.
  var fragmentString = location.hash.substring(1);
  var params = {};
  var regex = /([^&=]+)=([^&]*)/g, m;
  while (m = regex.exec(fragmentString)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  if (Object.keys(params).length > 0 && params['state']) {
    if (params['state'] == localStorage.getItem('state')) {
      localStorage.setItem('oauth2-test-params', JSON.stringify(params) );

      trySampleRequest();
    } else {
      console.log('State mismatch. Possible CSRF attack');
    }
  }

  // Function to generate a random state value
  function generateCryptoRandomState() {
    const randomValues = new Uint32Array(2);
    window.crypto.getRandomValues(randomValues);

    // Encode as UTF-8
    const utf8Encoder = new TextEncoder();
    const utf8Array = utf8Encoder.encode(
      String.fromCharCode.apply(null, randomValues)
    );

    // Base64 encode the UTF-8 data
    return btoa(String.fromCharCode.apply(null, utf8Array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  // If there's an access token, try an API request.
  // Otherwise, start OAuth 2.0 flow.
  function trySampleRequest() {
    var params = JSON.parse(localStorage.getItem('oauth2-test-params'));
    if (params && params['access_token']) { 
      // User authorized the request. Now, check which scopes were granted.
      if (params['scope'].includes('https://www.googleapis.com/auth/drive.metadata.readonly')) {
        // User authorized read-only Drive activity permission.
        // Calling the APIs, etc.
        var xhr = new XMLHttpRequest();
        xhr.open('GET',
          'https://www.googleapis.com/drive/v3/about?fields=user&' +
          'access_token=' + params['access_token']);
        xhr.onreadystatechange = function (e) {
          if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.response);
          } else if (xhr.readyState === 4 && xhr.status === 401) {
            // Token invalid, so prompt for user permission.
            oauth2SignIn();
          }
        };
        xhr.send(null);
      }
      else {
        // User didn't authorize read-only Drive activity permission.
        // Update UX and application accordingly
        console.log('User did not authorize read-only Drive activity permission.');
      }

      // Check if user authorized Calendar read permission.
      if (params['scope'].includes('https://www.googleapis.com/auth/calendar.readonly')) {
        // User authorized Calendar read permission.
        // Calling the APIs, etc.
        console.log('User authorized Calendar read permission.');
      }
      else {
        // User didn't authorize Calendar read permission.
        // Update UX and application accordingly
        console.log('User did not authorize Calendar read permission.');
      } 
    } else {
      oauth2SignIn();
    }
  }

  /*
   * Create form to request access token from Google's OAuth 2.0 server.
   */
  function oauth2SignIn() {
    // create random state value and store in local storage
    var state = generateCryptoRandomState();
    localStorage.setItem('state', state);

    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create element to open OAuth 2.0 endpoint in new window.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {'client_id': YOUR_CLIENT_ID,
                  'redirect_uri': YOUR_REDIRECT_URI,
                  'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly',
                  'state': state,
                  'include_granted_scopes': 'true',
                  'response_type': 'token'};

    // Add form parameters as hidden input values.
    for (var p in params) {
      var input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  }
</script>

<button onclick="trySampleRequest();">Try sample request</button>
</body></html>
JavaScript origin validation rules
Google applies the following validation rules to JavaScript origins in order to help developers keep their applications secure. Your JavaScript origins must adhere to these rules. See RFC 3986 section 3 for the definition of domain, host and scheme, mentioned below.
Validation rules
Scheme
JavaScript origins must use the HTTPS scheme, not plain HTTP. Localhost URIs (including localhost IP address URIs) are exempt from this rule.
Host
Hosts cannot be raw IP addresses. Localhost IP addresses are exempted from this rule.
Domain
Host TLDs (Top Level Domains) must belong to the public suffix list.
Host domains cannot be “googleusercontent.com”.
JavaScript origins cannot contain URL shortener domains (e.g. goo.gl) unless the app owns the domain.
Userinfo
JavaScript origins cannot contain the userinfo subcomponent.
Path
JavaScript origins cannot contain the path component.
Query
JavaScript origins cannot contain the query component.
Fragment
JavaScript origins cannot contain the fragment component.
Characters
JavaScript origins cannot contain certain characters including:
Wildcard characters ('*')
Non-printable ASCII characters
Invalid percent encodings (any percent encoding that does not follow URL-encoding form of a percent sign followed by two hexadecimal digits)
Null characters (an encoded NULL character, e.g., %00, %C0%80)

Incremental authorization
In the OAuth 2.0 protocol, your app requests authorization to access resources, which are identified by scopes. It is considered a best user-experience practice to request authorization for resources at the time you need them. To enable that practice, Google's authorization server supports incremental authorization. This feature lets you request scopes as they are needed and, if the user grants permission for the new scope, returns an authorization code that may be exchanged for a token containing all scopes the user has granted the project.
For example, an app that lets people sample music tracks and create mixes might need very few resources at sign-in time, perhaps nothing more than the name of the person signing in. However, saving a completed mix would require access to their Google Drive. Most people would find it natural if they only were asked for access to their Google Drive at the time the app actually needed it.
In this case, at sign-in time the app might request the openid and profile scopes to perform basic sign-in, and then later request the https://www.googleapis.com/auth/drive.file scope at the time of the first request to save a mix.
The following rules apply to an access token obtained from an incremental authorization:
The token can be used to access resources corresponding to any of the scopes rolled into the new, combined authorization.
When you use the refresh token for the combined authorization to obtain an access token, the access token represents the combined authorization and can be used for any of the scope values included in the response.
The combined authorization includes all scopes that the user granted to the API project even if the grants were requested from different clients. For example, if a user granted access to one scope using an application's desktop client and then granted another scope to the same application via a mobile client, the combined authorization would include both scopes.
If you revoke a token that represents a combined authorization, access to all of that authorization's scopes on behalf of the associated user are revoked simultaneously.
Caution: choosing to include granted scopes will automatically add scopes previously granted by the user to your authorization request. A warning or error page may be displayed if your app is not currently approved to request all scopes that may be returned in the response. See Unverified apps for more information.
The code samples below show how to add scopes to an existing access token. This approach allows your app to avoid having to manage multiple access tokens.
OAuth 2.0 Endpoints
To add scopes to an existing access token, include the include_granted_scopes parameter in your request to Google's OAuth 2.0 server.
The following code snippet demonstrates how to do that. The snippet assumes that you have stored the scopes for which your access token is valid in the browser's local storage. (The complete example code stores a list of scopes for which the access token is valid by setting the oauth2-test-params.scope property in the browser's local storage.)
The snippet compares the scopes for which the access token is valid to the scope you want to use for a particular query. If the access token does not cover that scope, the OAuth 2.0 flow starts. Here, the oauth2SignIn function is the same as the one that was provided in step 2 (and that is provided later in the complete example).
var SCOPE = 'https://www.googleapis.com/auth/drive.metadata.readonly';
var params = JSON.parse(localStorage.getItem('oauth2-test-params'));

var current_scope_granted = false;
if (params.hasOwnProperty('scope')) {
  var scopes = params['scope'].split(' ');
  for (var s = 0; s < scopes.length; s++) {
    if (SCOPE == scopes[s]) {
      current_scope_granted = true;
    }
  }
}

if (!current_scope_granted) {
  oauth2SignIn(); // This function is defined elsewhere in this document.
} else {
  // Since you already have access, you can proceed with the API request.
}
Revoking a token
In some cases a user may wish to revoke access given to an application. A user can revoke access by visiting Account Settings. See the Remove site or app access section of the Third-party sites & apps with access to your account support document for more information.
It is also possible for an application to programmatically revoke the access given to it. Programmatic revocation is important in instances where a user unsubscribes, removes an application, or the API resources required by an app have significantly changed. In other words, part of the removal process can include an API request to ensure the permissions previously granted to the application are removed.
OAuth 2.0 Endpoints
To programmatically revoke a token, your application makes a request to https://oauth2.googleapis.com/revoke and includes the token as a parameter:
curl -d -X -POST --header "Content-type:application/x-www-form-urlencoded" \
        https://oauth2.googleapis.com/revoke?token={token}
The token can be an access token or a refresh token. If the token is an access token and it has a corresponding refresh token, the refresh token will also be revoked.
Note: Google's OAuth 2.0 endpoint for revoking tokens supports JSONP and form submissions. It does not support Cross-origin Resource Sharing (CORS).
If the revocation is successfully processed, then the HTTP status code of the response is 200. For error conditions, an HTTP status code 400 is returned along with an error code.
The following JavaScript snippet shows how to revoke a token in JavaScript without using the Google APIs Client Library for JavaScript. Since the Google's OAuth 2.0 endpoint for revoking tokens does not support Cross-origin Resource Sharing (CORS), the code creates a form and submits the form to the endpoint rather than using the XMLHttpRequest() method to post the request.
function revokeAccess(accessToken) {
  // Google's OAuth 2.0 endpoint for revoking access tokens.
  var revokeTokenEndpoint = 'https://oauth2.googleapis.com/revoke';

  // Create <form> element to use to POST data to the OAuth 2.0 endpoint.
  var form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', revokeTokenEndpoint);

  // Add access token to the form so it is set as value of 'token' parameter.
  // This corresponds to the sample curl request, where the URL is:
  //      https://oauth2.googleapis.com/revoke?token={token}
  var tokenField = document.createElement('input');
  tokenField.setAttribute('type', 'hidden');
  tokenField.setAttribute('name', 'token');
  tokenField.setAttribute('value', accessToken);
  form.appendChild(tokenField);

  // Add form to page and submit it to actually revoke the token.
  document.body.appendChild(form);
  form.submit();
}
Note: Following a successful revocation response, it might take some time before the revocation has full effect.
Implementing Cross-Account Protection
An additional step you should take to protect your users' accounts is implementing Cross-Account Protection by utilizing Google's Cross-Account Protection Service. This service lets you subscribe to security event notifications which provide information to your application about major changes to the user account. You can then use the information to take action depending on how you decide to respond to events.
Some examples of the event types sent to your app by Google's Cross-Account Protection Service are:
https://schemas.openid.net/secevent/risc/event-type/sessions-revoked
https://schemas.openid.net/secevent/oauth/event-type/token-revoked
https://schemas.openid.net/secevent/risc/event-type/account-disabled
See the Protect user accounts with Cross-Account Protection page for more information on how to implement Cross Account Protection and for the full list of available events.
Was this helpful?
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-06-25 UTC.
Connect
Blog
Instagram
LinkedIn
X (Twitter)
YouTube
Programs
Google Developer Groups
Google Developer Experts
Accelerators
Women Techmakers
Google Cloud & NVIDIA
Developer consoles
Google API Console
Google Cloud Platform Console
Google Play Console
Firebase Console
Actions on Google Console
Cast SDK Developer Console
Chrome Web Store Dashboard
Google Home Developer Console

Android
Chrome
Firebase
Google Cloud Platform
Google AI
All products
Terms
Privacy
Sign up for the Google for Developers newsletterSubscribe
English
Page info
bug_reportfullscreenclose
On this page




























Key Takeaways
AI-GENERATED
JavaScript web applications can integrate with Google APIs securely using OAuth 2.0 for user authorization and data access.
The implicit grant flow is suitable for applications needing API access only during active user sessions.
Secure implementation involves obtaining user consent, handling access tokens, and using libraries like Google Identity Services.
Key security considerations include origin validation, CSRF protection using the `state` parameter, and defining appropriate API scopes.
Developers should follow best practices, leverage Google's tools and libraries, and handle potential errors for a robust and secure integration.
outlined_flag
Tags
HTMLJavaScript
The new page has loaded..
Skip to main content

Authentication
Authorization
Cross-platform
Cross-Account Protection (RISC)
/
English
Google Account Authorization
App verification to use Google Authorization APIs
Google Account Linking
Resources
























Authorization
Was this helpful?
OAuth 2.0 for Mobile & Desktop Apps
bookmark_border
Note: If you are new to OAuth 2.0, we recommend that you read the OAuth 2.0 overview before getting started. The overview summarizes OAuth 2.0 flows that Google supports, which can help you to ensure that you've selected the right flow for your application.
This document explains how applications installed on devices like phones, tablets, and computers use Google's OAuth 2.0 endpoints to authorize access to Google APIs.
OAuth 2.0 allows users to share specific data with an application while keeping their usernames, passwords, and other information private. For example, an application can use OAuth 2.0 to obtain permission from users to store files in their Google Drives.
Installed apps are distributed to individual devices, and it is assumed that these apps cannot keep secrets. They can access Google APIs while the user is present at the app or when the app is running in the background.
This authorization flow is similar to the one used for web server applications. The main difference is that installed apps must open the system browser and supply a local redirect URI to handle responses from Google's authorization server.
Libraries and samples
For mobile apps we recommend using the latest version of the Google Identity Services native library for Android and Google Sign-In native library for iOS. These libraries handle user authorization and they are simpler to implement than the lower-level protocol described here.
For apps running on devices that do not support a system browser or that have limited input capabilities, such as TVs, game consoles, cameras, or printers, see OAuth 2.0 for TVs & Devices or Sign-In on TVs and Limited Input Devices.
Prerequisites
Enable APIs for your project
Any application that calls Google APIs needs to enable those APIs in the API Console.
To enable an API for your project:
Open the API Library in the Google API Console.
If prompted, select a project, or create a new one.
The API Library lists all available APIs, grouped by product family and popularity. If the API you want to enable isn't visible in the list, use search to find it, or click View All in the product family it belongs to.
Select the API you want to enable, then click the Enable button.
If prompted, enable billing.
If prompted, read and accept the API's Terms of Service.
Create authorization credentials
Any application that uses OAuth 2.0 to access Google APIs must have authorization credentials that identify the application to Google's OAuth 2.0 server. The following steps explain how to create credentials for your project. Your applications can then use the credentials to access APIs that you have enabled for that project.
Go to the Clients page.
Click Create client.
The following sections describe the client types that Google's authorization server supports. Choose the client type that is recommended for your application, name your OAuth client, and set the other fields in the form as appropriate.
Android
iOS
UWP
Select the Android application type.
Enter a name for the OAuth client. This name is displayed on your project's Clients page to identify the client.
Enter the package name of your Android app. This value is defined in the package attribute of the <manifest> element in your app manifest file.
Enter the SHA-1 signing certificate fingerprint of the app distribution.
If your app uses app signing by Google Play, copy the SHA-1 fingerprint from the app signing page of the Play Console.
If you manage your own keystore and signing keys, use the keytool utility included with Java to print certificate information in a human-readable format. Copy the SHA1 value in the Certificate fingerprints section of the keytool output. See Authenticating Your Client in the Google APIs for Android documentation for more information.
(Optional) Verify ownership of your Android application.
Click Create.
Identify access scopes
Scopes enable your application to only request access to the resources that it needs while also enabling users to control the amount of access that they grant to your application. Thus, there may be an inverse relationship between the number of scopes requested and the likelihood of obtaining user consent.
Before you start implementing OAuth 2.0 authorization, we recommend that you identify the scopes that your app will need permission to access.
Note: Incremental authorization is not supported for installed apps or devices.
The OAuth 2.0 API Scopes document contains a full list of scopes that you might use to access Google APIs.
If your public application uses scopes that permit access to certain user data, it must complete a verification process. If you see unverified app on the screen when testing your application, you must submit a verification request to remove it. Find out more about unverified apps and get answers to frequently asked questions about app verification in the Help Center.
Obtaining OAuth 2.0 access tokens
The following steps show how your application interacts with Google's OAuth 2.0 server to obtain a user's consent to perform an API request on the user's behalf. Your application must have that consent before it can execute a Google API request that requires user authorization.
Step 1: Generate a code verifier and challenge
Google supports the Proof Key for Code Exchange (PKCE) protocol to make the installed app flow more secure. A unique code verifier is created for every authorization request, and its transformed value, called "code_challenge", is sent to the authorization server to obtain the authorization code.
Create the code verifier
A code_verifier is a high-entropy cryptographic random string using the unreserved characters [A-Z] / [a-z] / [0-9] / "-" / "." / "_" / "~", with a minimum length of 43 characters and a maximum length of 128 characters.
The code verifier should have enough entropy to make it impractical to guess the value.
Create the code challenge
Two methods of creating the code challenge are supported.
Code Challenge Generation Methods
S256 (recommended)
The code challenge is the Base64URL (with no padding) encoded SHA256 hash of the code verifier.
code_challenge = BASE64URL-ENCODE(SHA256(ASCII(code_verifier)))
plain
The code challenge is the same value as the code verifier generated above.
code_challenge = code_verifier

Step 2: Send a request to Google's OAuth 2.0 server
To obtain user authorization, send a request to Google's authorization server at https://accounts.google.com/o/oauth2/v2/auth. This endpoint handles active session lookup, authenticates the user, and obtains user consent. The endpoint is only accessible over SSL, and it refuses HTTP (non-SSL) connections.
The authorization server supports the following query string parameters for installed applications:
Parameters
client_id
Required
The client ID for your application. You can find this value in the Cloud Console Clients page.
redirect_uri
Required
Determines how Google's authorization server sends a response to your app. There are several redirect options available to installed apps, and you will have set up your authorization credentials with a particular redirect method in mind.
The value must exactly match one of the authorized redirect URIs for the OAuth 2.0 client, which you configured in your client's Cloud Console Clients page. If this value doesn't match an authorized URI, you will get a redirect_uri_mismatch error.
The table below shows the appropriate redirect_uri parameter value for each method:
redirect_uri values
Custom URI scheme
com.example.app:redirect_uri_path
or
com.googleusercontent.apps.123:redirect_uri_path
com.example.app is the reverse DNS notation of a domain under your control. The custom scheme must contain a period to be valid.
com.googleusercontent.apps.123 is the reverse DNS notation of the client ID.
redirect_uri_path is an optional path component, such as /oauth2redirect. Note that the path should begin with a single slash, which is different from regular HTTP URLs.
Note : Custom URI schemes are no longer supported on Chrome apps and are disabled by default on Android. Learn more about custom scheme alternatives for Android and Chrome apps.
Loopback IP address
http://127.0.0.1:port or http://[::1]:port
Query your platform for the relevant loopback IP address and start an HTTP listener on a random available port. Substitute port with the actual port number your app listens on.
Note that support for the loopback IP address redirect option on mobile apps is DEPRECATED.



response_type
Required
Determines whether the Google OAuth 2.0 endpoint returns an authorization code.
Set the parameter value to code for installed applications.
scope
Required
A space-delimited list of scopes that identify the resources that your application could access on the user's behalf. These values inform the consent screen that Google displays to the user.
Scopes enable your application to only request access to the resources that it needs while also enabling users to control the amount of access that they grant to your application. Thus, there is an inverse relationship between the number of scopes requested and the likelihood of obtaining user consent.
code_challenge
Recommended
Specifies an encoded code_verifier that will be used as a server-side challenge during authorization code exchange. See create code challenge section above for more information.
code_challenge_method
Recommended
Specifies what method was used to encode a code_verifier that will be used during authorization code exchange. This parameter must be used with the code_challenge parameter described above. The value of the code_challenge_method defaults to plain if not present in the request that includes a code_challenge. The only supported values for this parameter are S256 or plain.
state
Recommended
Specifies any string value that your application uses to maintain state between your authorization request and the authorization server's response. The server returns the exact value that you send as a name=value pair in the URL fragment identifier (#) of the redirect_uri after the user consents to or denies your application's access request.
You can use this parameter for several purposes, such as directing the user to the correct resource in your application, sending nonces, and mitigating cross-site request forgery. Since your redirect_uri can be guessed, using a state value can increase your assurance that an incoming connection is the result of an authentication request. If you generate a random string or encode the hash of a cookie or another value that captures the client's state, you can validate the response to additionally ensure that the request and response originated in the same browser, providing protection against attacks such as cross-site request forgery. See the OpenID Connect documentation for an example of how to create and confirm a state token.
Important: The OAuth client must prevent CSRF as called out in the OAuth2 Specification . One way to achieve this is by using the state parameter to maintain state between your authorization request and the authorization server's response.
login_hint
Optional
If your application knows which user is trying to authenticate, it can use this parameter to provide a hint to the Google Authentication Server. The server uses the hint to simplify the login flow either by prefilling the email field in the sign-in form or by selecting the appropriate multi-login session.
Set the parameter value to an email address or sub identifier, which is equivalent to the user's Google ID.

Note: incremental authorization with installed apps is not supported due to the fact that the client cannot keep the client_secret confidential.
Sample authorization URLs
The tabs below show sample authorization URLs for the different redirect URI options.
The URLs are identical except for the value of the redirect_uri parameter. The URLs also contain the required response_type and client_id parameters as well as the optional state parameter. Each URL contains line breaks and spaces for readability.
Custom URI scheme
Loopback IP address
https://accounts.google.com/o/oauth2/v2/auth?
 scope=email%20profile&
 response_type=code&
 state=security_token%3D138r5719ru3e1%26url%3Dhttps%3A%2F%2Foauth2.example.com%2Ftoken&
 redirect_uri=com.example.app%3A/oauth2redirect&
 client_id=client_id
Step 3: Google prompts user for consent
In this step, the user decides whether to grant your application the requested access. At this stage, Google displays a consent window that shows the name of your application and the Google API services that it is requesting permission to access with the user's authorization credentials and a summary of the scopes of access to be granted. The user can then consent to grant access to one or more scopes requested by your application or refuse the request.
Your application doesn't need to do anything at this stage as it waits for the response from Google's OAuth 2.0 server indicating whether any access was granted. That response is explained in the following step.
Errors
Requests to Google's OAuth 2.0 authorization endpoint may display user-facing error messages instead of the expected authentication and authorization flows. Common error codes and suggested resolutions are listed below.
admin_policy_enforced
The Google Account is unable to authorize one or more scopes requested due to the policies of their Google Workspace administrator. See the Google Workspace Admin help article Control which third-party & internal apps access Google Workspace data for more information about how an administrator may restrict access to all scopes or sensitive and restricted scopes until access is explicitly granted to your OAuth client ID.
disallowed_useragent
The authorization endpoint is displayed inside an embedded user-agent disallowed by Google's OAuth 2.0 Policies.
Android
iOS
Android developers may encounter this error message when opening authorization requests in android.webkit.WebView. Developers should instead use Android libraries such as Google Sign-In for Android or OpenID Foundation's AppAuth for Android.
Web developers may encounter this error when an Android app opens a general web link in an embedded user-agent and a user navigates to Google's OAuth 2.0 authorization endpoint from your site. Developers should allow general links to open in the default link handler of the operating system, which includes both Android App Links handlers or the default browser app. The Android Custom Tabs library is also a supported option.
org_internal
The OAuth client ID in the request is part of a project limiting access to Google Accounts in a specific Google Cloud Organization. For more information about this configuration option see the User type section in the Setting up your OAuth consent screen help article.
deleted_client
The OAuth client being used to make the request has been deleted. Deletion can happen manually or automatically in the case of unused clients . Deleted clients can be restored within 30 days of the deletion. Learn more .
invalid_grant
If you are using a code verifier and challenge, the code_callenge parameter is invalid or missing. Ensure that the code_challenge parameter is set correctly.
When refreshing an access token, the token may have expired or has beeninvalidated. Authenticate the user again and ask for user consent to obtain new tokens. If you are continuing to see this error, ensure that your application has been configured correctly and that you are using the correct tokens and parameters in your request. Otherwise, the user account may have been deleted or disabled.
redirect_uri_mismatch
The redirect_uri passed in the authorization request does not match an authorized redirect URI for the OAuth client ID. Review authorized redirect URIs in the Google Cloud Console Clients page.
The passed redirect_uri may be invalid for the client type.
The redirect_uri parameter may refer to the OAuth out-of-band (OOB) flow that has been deprecated and is no longer supported. Refer to the migration guide to update your integration.
invalid_request
There was something wrong with the request you made. This could be due to a number of reasons:
The request was not properly formatted
The request was missing required parameters
The request uses an authorization method that Google doesn't support. Verify your OAuth integration uses a recommended integration method
A custom scheme is used for the redirect uri : If you see the error message Custom URI scheme is not supported on Chrome apps or Custom URI scheme is not enabled for your Android client, it means you are using a custom URI scheme which isn't supported on Chrome apps and is disabled by default on Android. Learn more about custom URI scheme alternatives
Step 4: Handle the OAuth 2.0 server response
The manner in which your application receives the authorization response depends on the redirect URI scheme that it uses. Regardless of the scheme, the response will either contain an authorization code (code) or an error (error). For example, error=access_denied indicates that the user declined the request.
If the user grants access to your application, you can exchange the authorization code for an access token and a refresh token as described in the next step.
Step 5: Exchange authorization code for refresh and access tokens
To exchange an authorization code for an access token, call the https://oauth2.googleapis.com/token endpoint and set the following parameters:
Fields
client_id
The client ID obtained from the Cloud Console Clients page.
client_secret
The client secret obtained from the Cloud Console Clients page.
code
The authorization code returned from the initial request.
code_verifier
The code verifier you created in Step 1.
grant_type
As defined in the OAuth 2.0 specification, this field's value must be set to authorization_code.
redirect_uri
One of the redirect URIs listed for your project in the Cloud Console Clients page for the given client_id.

The following snippet shows a sample request:
POST /token HTTP/1.1
Host: oauth2.googleapis.com
Content-Type: application/x-www-form-urlencoded

code=4/P7q7W91a-oMsCeLvIaQm6bTrgtp7&
client_id=your_client_id&
client_secret=your_client_secret&
redirect_uri=http://127.0.0.1:9004&
grant_type=authorization_code
Google responds to this request by returning a JSON object that contains a short-lived access token and a refresh token.
The response contains the following fields:
Fields
access_token
The token that your application sends to authorize a Google API request.
expires_in
The remaining lifetime of the access token in seconds.
id_token
Note: This property is only returned if your request included an identity scope, such as openid, profile, or email. The value is a JSON Web Token (JWT) that contains digitally signed identity information about the user.
refresh_token
A token that you can use to obtain a new access token. Refresh tokens are valid until the user revokes access or the refresh token expires. Note that refresh tokens are always returned for installed applications.
refresh_token_expires_in
The remaining lifetime of the refresh token in seconds. This value is only set when the user grants time-based access.
scope
The scopes of access granted by the access_token expressed as a list of space-delimited, case-sensitive strings.
token_type
The type of token returned. At this time, this field's value is always set to Bearer.

Important: Your application should store both tokens in a secure, long-lived location that is accessible between different invocations of your application. The refresh token enables your application to obtain a new access token if the one that you have expires. As such, if your application loses the refresh token, the user will need to repeat the OAuth 2.0 consent flow so that your application can obtain a new refresh token.
The following snippet shows a sample response:
{
  "access_token": "1/fFAGRNJru1FTz70BzhT3Zg",
  "expires_in": 3920,
  "token_type": "Bearer",
  "scope": "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly",
  "refresh_token": "1//xEoDL4iW3cxlI7yDbSRFYNG01kVKM2C-259HOF2aQbI"
}
Note: Your application should ignore any unrecognized fields included in the response.
Step 6: Check which scopes users granted
When requesting multiple permissions (scopes), users may not grant your app access to all of them. Your app must verify which scopes were actually granted and gracefully handle situations where some permissions are denied, typically by disabling the features that rely on those denied scopes.
However, there are exceptions. Google Workspace Enterprise apps with domain-wide delegation of authority, or apps marked as Trusted, bypass the granular permissions consent screen. For these apps, users won't see the granular permission consent screen. Instead, your app will either receive all requested scopes or none.
For more detailed information, see How to handle granular permissions.
To check whether the user has granted your application access to a particular scope, exam the scope field in the access token response. The scopes of access granted by the access_token expressed as a list of space-delimited, case-sensitive strings.
For example, the following sample access token response indicates that the user has granted your application access to the read-only Drive activity and Calendar events permissions:
 {
    "access_token": "1/fFAGRNJru1FTz70BzhT3Zg",
    "expires_in": 3920,
    "token_type": "Bearer",
    "scope": "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly",
    "refresh_token": "1//xEoDL4iW3cxlI7yDbSRFYNG01kVKM2C-259HOF2aQbI"
  }
Calling Google APIs
After your application obtains an access token, you can use the token to make calls to a Google API on behalf of a given user account if the scope(s) of access required by the API have been granted. To do this, include the access token in a request to the API by including either an access_token query parameter or an Authorization HTTP header Bearer value. When possible, the HTTP header is preferable, because query strings tend to be visible in server logs. In most cases you can use a client library to set up your calls to Google APIs (for example, when calling the Drive Files API).
You can try out all the Google APIs and view their scopes at the OAuth 2.0 Playground.
HTTP GET examples
A call to the drive.files endpoint (the Drive Files API) using the Authorization: Bearer HTTP header might look like the following. Note that you need to specify your own access token:
GET /drive/v2/files HTTP/1.1
Host: www.googleapis.com
Authorization: Bearer access_token
Here is a call to the same API for the authenticated user using the access_token query string parameter:
GET https://www.googleapis.com/drive/v2/files?access_token=access_token
curl examples
You can test these commands with the curl command-line application. Here's an example that uses the HTTP header option (preferred):
curl -H "Authorization: Bearer access_token" https://www.googleapis.com/drive/v2/files
Or, alternatively, the query string parameter option:
curl https://www.googleapis.com/drive/v2/files?access_token=access_token
Refreshing an access token
Access tokens periodically expire and become invalid credentials for a related API request. You can refresh an access token without prompting the user for permission (including when the user is not present) if you requested offline access to the scopes associated with the token.
To refresh an access token, your application sends an HTTPS POST request to Google's authorization server (https://oauth2.googleapis.com/token) that includes the following parameters:
Fields
client_id
The client ID obtained from the API Console.
client_secret
The client secret obtained from the API Console. (The client_secret is not applicable to requests from clients registered as Android, iOS, or Chrome applications.)
grant_type
As defined in the OAuth 2.0 specification, this field's value must be set to refresh_token.
refresh_token
The refresh token returned from the authorization code exchange.

The following snippet shows a sample request:
POST /token HTTP/1.1
Host: oauth2.googleapis.com
Content-Type: application/x-www-form-urlencoded

client_id=your_client_id&
client_secret=your_client_secret&
refresh_token=refresh_token&
grant_type=refresh_token
As long as the user has not revoked the access granted to the application, the token server returns a JSON object that contains a new access token. The following snippet shows a sample response:
{
  "access_token": "1/fFAGRNJru1FTz70BzhT3Zg",
  "expires_in": 3920,
  "scope": "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly",
  "token_type": "Bearer"
}
Note that there are limits on the number of refresh tokens that will be issued; one limit per client/user combination, and another per user across all clients. You should save refresh tokens in long-term storage and continue to use them as long as they remain valid. If your application requests too many refresh tokens, it may run into these limits, in which case older refresh tokens will stop working.
Revoking a token
In some cases a user may wish to revoke access given to an application. A user can revoke access by visiting Account Settings. See the Remove site or app access section of the Third-party sites & apps with access to your account support document for more information.
It is also possible for an application to programmatically revoke the access given to it. Programmatic revocation is important in instances where a user unsubscribes, removes an application, or the API resources required by an app have significantly changed. In other words, part of the removal process can include an API request to ensure the permissions previously granted to the application are removed.
To programmatically revoke a token, your application makes a request to https://oauth2.googleapis.com/revoke and includes the token as a parameter:
curl -d -X -POST --header "Content-type:application/x-www-form-urlencoded" \
        https://oauth2.googleapis.com/revoke?token={token}
The token can be an access token or a refresh token. If the token is an access token and it has a corresponding refresh token, the refresh token will also be revoked.
If the revocation is successfully processed, then the HTTP status code of the response is 200. For error conditions, an HTTP status code 400 is returned along with an error code.
Note: Following a successful revocation response, it might take some time before the revocation has full effect.
App redirect methods
Custom URI scheme (Android, iOS, UWP)
Custom URI schemes are a form of deeplinking that use a custom-defined scheme to open your app.
Important: Custom URI schemes are no longer supported on new Chrome apps and are disabled by default on new Android clients due to the risk of app impersonation.
Alternative to using custom URI schemes on Android
Use the recommended alternative which delivers the OAuth 2.0 response directly to your app, eliminating the need for a redirect URI.
How to migrate to the Google Identity Services Android Library
Enable custom URI scheme
If the recommended alternative does not work for you, you can enable custom URI schemes for your Android client by following the below instructions:
Go to your OAuth 2.0 credentials list and select your Android client.
Navigate to the Advanced Settings section, check the Enable Custom URI Scheme checkbox, and click Save to enable custom URI scheme support.
Alternative to using custom URI schemes on Chrome apps
Use the Chrome Identity API which delivers the OAuth 2.0 response directly to your app, eliminating the need for a redirect URI.
Loopback IP address (macOS, Linux, Windows desktop)
Important: The loopback IP address redirect option is DEPRECATED for the Android, Chrome app, and iOS OAuth client types. Review the loopback IP address migration guide for instructions on how to migrate to a supported alternative.
To receive the authorization code using this URL, your application must be listening on the local web server. That is possible on many, but not all, platforms. However, if your platform supports it, this is the recommended mechanism for obtaining the authorization code.
When your app receives the authorization response, for best usability it should respond by displaying an HTML page that instructs the user to close the browser and return to your app.
Recommended usage
macOS, Linux, and Windows desktop (but not Universal Windows Platform) apps
Form values
Set the application type to Desktop app.

Note: See the redirect_uri parameter definition for more information about the loopback IP address. It is also possible to use localhost in place of the loopback IP, but this configuration may cause issues with client firewalls. Most, but not all, firewalls allow loopback communication.
Manual copy/paste (Deprecated)
Important: The manual copy/paste option, also referred to as an out of band (OOB) redirect method, is no longer supported. Review the OOB migration guide for instructions on how to migrate to a secure alternative.
Protect your apps
Verify app ownership (Android, Chrome)
You can verify ownership of your application to reduce the risk of app impersonation.
Android
Chrome
Note: Android app ownership verification is only available for Google Play apps.
To complete the verification process, you can use your Google Play Developer Account if you have one and your app is registered on the Google Play Console. The following requirements must be met for a successful verification:
You must have a registered application in the Google Play Console with the same package name and SHA-1 signing certificate fingerprint as the Android OAuth client you are completing the verification for.
You must have Admin permission for the app in the Google Play Console. Learn more about access management in the Google Play Console.
In the Verify App Ownership section of the Android client, click the Verify Ownership button to complete the verification process.
If the verification is successful, a notification will be displayed to confirm the success of the verification process. Otherwise, an error prompt will be shown.
To fix a failed verification, try the following:
Make sure the app you are verifying is a registered app in the Google Play Console.
Make sure you have Admin permission for the app in the Google Play Console.
App Check (iOS only)
The App Check feature helps safeguard your iOS applications from unauthorized usage by using Apple's App Attest service to verify that requests made to Google OAuth 2.0 endpoints originate from your authentic applications. This helps to reduce the risk of app impersonation.
Enable App Check for your iOS Client
The following requirements must be met to successfully enable App Check for your iOS client:
You must specify a team ID for your iOS client.
You must not use a wildcard in your bundle ID since it can resolve to more than one app. This means that the bundle ID must not include the asterisk (*) symbol.
Warning: When App Check is enabled, you won't be able to edit your OAuth client bundle ID without creating a new client. Before creating your iOS client or enabling App Check, verify that you are using the correct bundle ID. Updating your bundle ID for an existing project can result in a broken experience for users of your apps if you are using the bundle ID as a redirect URI.To enable App Check, turn on the Protect your OAuth client from abuse with Firebase App Check toggle button in the edit view of your iOS client.
After enabling App Check, you will start seeing metrics related to OAuth requests from your client in the edit view of the OAuth client. Requests from unverified sources won't be blocked until you enforce App Check. The information in the metrics monitoring page can help you determine when to start enforcement.
You might see errors related to the App Check feature when enabling App Check for your iOS app. To fix these errors, try the following:
Verify that the bundle ID and team ID you specified are valid.
Verify that you are not using a wildcard for the bundle ID.
Enforce App Check for your iOS Client
Enabling App Check for your app does not automatically block unrecognized requests. To enforce this protection, go to the edit view of your iOS client. There, you will see App Check metrics to the right of the page under the Google Identity for iOS section. The metrics include the following information:
Number of verified requests - requests that have a valid App Check token. After you enable App Check enforcement, only requests in this category will succeed.
Number of unverified requests: likely outdated client requests - requests missing an App Check token; these request may be from an older version of your app that doesn't include an App Check implementation.
Number of unverified requests: unknown origin requests - requests missing an App Check token that don't look like they are coming from your app.
Number of unverified requests: invalid requests - requests with an invalid App Check token, which may be from an inauthentic client attempting to impersonate your app, or from emulated environments.
Review these metrics to understand how enforcing App Check will affect your users.
To enforce App Check, click the ENFORCE button and confirm your choice. Once enforcement is active, all unverified requests from your client will be rejected.
Note: after you enable enforcement, it can take up to 15 minutes for the changes to take effect.
Unenforce App Check for your iOS Client
Unenforcing App Check for your app will stop enforcement and will allow all requests from your client to Google OAuth 2.0 endpoints, including unverified requests.
To unenforce App Check for your iOS client, navigate to the edit view of the iOS client and click the UNENFORCE button and confirm your choice.
Note: after unenforcing App Check, it can take up to 15 minutes for the changes to take effect.
Disable App Check for your iOS Client
Disabling App Check for your app will stop all App Check monitoring and enforcement. Consider unenforcing App Check instead so you can continue monitoring metrics for your client.
To disable App Check for your iOS client, navigate to the edit view of the iOS client and turn off the Protect your OAuth client from abuse with Firebase App Check toggle button.
Note: after disabling App Check, it can take up to 15 minutes for the changes to take effect.
Time-based access
Time-based access allows a user to grant your app access to their data for a limited duration to complete an action. Time-based access is available in select Google products during the consent flow, giving users the option to grant access for a limited period of time. An example is the Data Portability API which enables a one-time transfer of data.
When a user grants your application time-based access, the refresh token will expire after the specified duration. Note that refresh tokens may be invalidated earlier under specific circumstances; see these cases for details. The refresh_token_expires_in field returned in the authorization code exchange response represents the time remaining until the refresh token expires in such cases.
Further Reading
The IETF Best Current Practice OAuth 2.0 for Native Apps establishes many of the best practices documented here.
Implementing Cross-Account Protection
An additional step you should take to protect your users' accounts is implementing Cross-Account Protection by utilizing Google's Cross-Account Protection Service. This service lets you subscribe to security event notifications which provide information to your application about major changes to the user account. You can then use the information to take action depending on how you decide to respond to events.
Some examples of the event types sent to your app by Google's Cross-Account Protection Service are:
https://schemas.openid.net/secevent/risc/event-type/sessions-revoked
https://schemas.openid.net/secevent/oauth/event-type/token-revoked
https://schemas.openid.net/secevent/risc/event-type/account-disabled
See the Protect user accounts with Cross-Account Protection page for more information on how to implement Cross Account Protection and for the full list of available events.
Was this helpful?
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-06-25 UTC.
Connect
Blog
Instagram
LinkedIn
X (Twitter)
YouTube
Programs
Google Developer Groups
Google Developer Experts
Accelerators
Women Techmakers
Google Cloud & NVIDIA
Developer consoles
Google API Console
Google Cloud Platform Console
Google Play Console
Firebase Console
Actions on Google Console
Cast SDK Developer Console
Chrome Web Store Dashboard
Google Home Developer Console

Android
Chrome
Firebase
Google Cloud Platform
Google AI
All products
Terms
Privacy
Sign up for the Google for Developers newsletterSubscribe
English
Page info
bug_reportfullscreenclose
On this page










































Key Takeaways
AI-GENERATED
Installed applications utilize OAuth 2.0 to securely access Google APIs, enabling users to share specific data without revealing their login credentials.
Before obtaining access tokens, developers must enable necessary Google APIs and create OAuth client IDs within the Google API Console.
Access tokens are obtained through an authorization flow involving a code verifier, code challenge, authorization request, and a token exchange for access and refresh tokens.
Security best practices include using PKCE, verifying app ownership (where applicable), and implementing App Check for iOS applications to enhance request authenticity.
Developers are encouraged to utilize Google Sign-In for Android and loopback IP addresses for desktop applications, while custom URI schemes and manual copy/paste methods are discouraged due to security concerns.
outlined_flag
Tags
JavaScript
The new page has loaded.
Skip to main content

Authentication
Authorization
Cross-platform
Cross-Account Protection (RISC)
/
English
Google Account Authorization
App verification to use Google Authorization APIs
Google Account Linking
Resources
























Authorization
Was this helpful?
OAuth 2.0 for TV and Limited-Input Device Applications
bookmark_border
Important note: This OAuth 2.0 flow supports a limited set of scopes.
This document explains how to implement OAuth 2.0 authorization to access Google APIs via applications running on devices like TVs, game consoles, and printers. More specifically, this flow is designed for devices that either do not have access to a browser or have limited input capabilities.
OAuth 2.0 allows users to share specific data with an application while keeping their usernames, passwords, and other information private. For example, a TV application could use OAuth 2.0 to obtain permission to select a file stored on Google Drive.
Since the applications that use this flow are distributed to individual devices, it is assumed that the apps cannot keep secrets. They can access Google APIs while the user is present at the app or when the app is running in the background.
Alternatives
If you are writing an app for a platform like Android, iOS, macOS, Linux, or Windows (including the Universal Windows Platform), that has access to the browser and full input capabilities, use the OAuth 2.0 flow for mobile and desktop applications. (You should use that flow even if your app is a command-line tool without a graphical interface.)
If you only want to sign in users with their Google accounts and use JWT ID token to obtain basic user profile information, see Sign-In on TVs and Limited Input Devices.
Prerequisites
Enable APIs for your project
Any application that calls Google APIs needs to enable those APIs in the API Console.
To enable an API for your project:
Open the API Library in the Google API Console.
If prompted, select a project, or create a new one.
The API Library lists all available APIs, grouped by product family and popularity. If the API you want to enable isn't visible in the list, use search to find it, or click View All in the product family it belongs to.
Select the API you want to enable, then click the Enable button.
If prompted, enable billing.
If prompted, read and accept the API's Terms of Service.
Create authorization credentials
Any application that uses OAuth 2.0 to access Google APIs must have authorization credentials that identify the application to Google's OAuth 2.0 server. The following steps explain how to create credentials for your project. Your applications can then use the credentials to access APIs that you have enabled for that project.
Go to the Clients page.
Click Create Client.
Select the TVs and Limited Input devices application type.
Name your OAuth 2.0 client and click Create.
Identify access scopes
Scopes enable your application to only request access to the resources that it needs while also enabling users to control the amount of access that they grant to your application. Thus, there may be an inverse relationship between the number of scopes requested and the likelihood of obtaining user consent.
Before you start implementing OAuth 2.0 authorization, we recommend that you identify the scopes that your app will need permission to access.
Note: Incremental authorization is not supported for installed apps or devices.
See the Allowed scopes list for installed apps or devices.
If your public application uses scopes that permit access to certain user data, it must complete a verification process. If you see unverified app on the screen when testing your application, you must submit a verification request to remove it. Find out more about unverified apps and get answers to frequently asked questions about app verification in the Help Center.
Obtaining OAuth 2.0 access tokens
Even though your application runs on a device with limited input capabilities, users must have separate access to a device with richer input capabilities to complete this authorization flow. The flow has the following steps:
Your application sends a request to Google's authorization server that identifies the scopes that your application will request permission to access.
The server responds with several pieces of information used in subsequent steps, such as a device code and a user code.
You display information that the user can enter on a separate device to authorize your app.
Your application starts polling Google's authorization server to determine whether the user has authorized your app.
The user switches to a device with richer input capabilities, launches a web browser, navigates to the URL displayed in step 3 and enters a code that is also displayed in step 3. The user can then grant (or deny) access to your application.
The next response to your polling request contains the tokens your app needs to authorize requests on the user's behalf. (If the user refused access to your application, the response does not contain tokens.)
The image below illustrates this process:

The following sections explain these steps in detail. Given the range of capabilities and runtime environments that devices may have, the examples shown in this document use the curl command line utility. These examples should be easy to port to various languages and runtimes.
Step 1: Request device and user codes
In this step, your device sends an HTTP POST request to Google's authorization server, at https://oauth2.googleapis.com/device/code, that identifies your application as well as the access scopes that your application wants to access on the user's behalf. You should retrieve this URL from the Discovery document using the device_authorization_endpoint metadata value. Include the following HTTP request parameters:
Parameters
client_id
Required
The client ID for your application. You can find this value in the Cloud Console Clients page.
scope
Required
A space-delimited list of scopes that identify the resources that your application could access on the user's behalf. These values inform the consent screen that Google displays to the user. See the Allowed scopes list for installed apps or devices.
Scopes enable your application to only request access to the resources that it needs while also enabling users to control the amount of access that they grant to your application. Thus, there is an inverse relationship between the number of scopes requested and the likelihood of obtaining user consent.

Examples
The following snippet shows a sample request:
POST /device/code HTTP/1.1
Host: oauth2.googleapis.com
Content-Type: application/x-www-form-urlencoded

client_id=client_id&scope=email%20profile
This example shows a curl command to send the same request:
curl -d "client_id=client_id&scope=email%20profile" \
     https://oauth2.googleapis.com/device/code

Step 2: Handle the authorization server response
The authorization server will return one of the following responses:
Success response
If the request is valid, your response will be a JSON object containing the following properties:
Properties
device_code
A value that Google uniquely assigns to identify the device that runs the app requesting authorization. The user will be authorizing that device from another device with richer input capabilities. For example, a user might use a laptop or mobile phone to authorize an app running on a TV. In this case, the device_code identifies the TV.
This code lets the device running the app securely determine whether the user has granted or denied access.
expires_in
The length of time, in seconds, that the device_code and user_code are valid. If, in that time, the user doesn't complete the authorization flow and your device doesn't also poll to retrieve information about the user's decision, you might need to restart this process from step 1.
interval
The length of time, in seconds, that your device should wait between polling requests. For example, if the value is 5, your device should send a polling request to Google's authorization server every five seconds. See step 3 for more details.
user_code
A case-sensitive value that identifies to Google the scopes that the application is requesting access to. Your user interface will instruct the user to enter this value on a separate device with richer input capabilities. Google then uses the value to display the correct set of scopes when prompting the user to grant access to your application.
verification_url
A URL that the user must navigate to, on a separate device, to enter the user_code and grant or deny access to your application. Your user interface will also display this value.

The following snippet shows a sample response:
{
  "device_code": "4/4-GMMhmHCXhWEzkobqIHGG_EnNYYsAkukHspeYUk9E8",
  "user_code": "GQVQ-JKEC",
  "verification_url": "https://www.google.com/device",
  "expires_in": 1800,
  "interval": 5
}
Quota exceeded response
If your device code requests have exceeded the quota associated with your client ID, you will receive a 403 response, containing the following error:
{
  "error_code": "rate_limit_exceeded"
}
In that case, use a backoff strategy to reduce the rate of requests.
Step 3: Display the user code
Display the verification_url and user_code obtained in step 2 to the user. Both values can contain any printable character from the US-ASCII character set. The content that you display to the user should instruct the user to navigate to the verification_url on a separate device and enter the user_code.
Design your user interface (UI) with the following rules in mind:
user_code
The user_code must be displayed in a field that can handle 15 'W' size characters. In other words, if you can display the code WWWWWWWWWWWWWWW correctly, your UI is valid, and we recommend using that string value when testing the way the user_code displays in your UI.
The user_code is case-sensitive and should not be modified in any way, such as changing the case or inserting other formatting characters.
verification_url
The space where you display the verification_url must be wide enough to handle a URL string that is 40 characters long.
You should not modify the verification_url in any way, except to optionally remove the scheme for display. If you do plan to strip off the scheme (e.g. https://) from the URL for display reasons, be sure your app can handle both http and https variants.
Warning: Both of these values are subject to change, and you should not hardcode either value in your code. Similarly, you should not modify the values in any way other than optionally removing the scheme from the verification_url.
Step 4: Poll Google's authorization server
Since the user will be using a separate device to navigate to the verification_url and grant (or deny) access, the requesting device is not automatically notified when the user responds to the access request. For that reason, the requesting device needs to poll Google's authorization server to determine when the user has responded to the request.
The requesting device should continue sending polling requests until it receives a response indicating that the user has responded to the access request or until the device_code and user_code obtained in step 2 have expired. The interval returned in step 2 specifies the amount of time, in seconds, to wait between requests.
The URL of the endpoint to poll is https://oauth2.googleapis.com/token. The polling request contains the following parameters:
Parameters
client_id
The client ID for your application. You can find this value in the Cloud Console Clients page.
client_secret
The client secret for the provided client_id. You can find this value in the Cloud Console Clients page.
device_code
The device_code returned by the authorization server in step 2.
grant_type
Set this value to urn:ietf:params:oauth:grant-type:device_code.

Examples
The following snippet shows a sample request:
POST /token HTTP/1.1
Host: oauth2.googleapis.com
Content-Type: application/x-www-form-urlencoded

client_id=client_id&
client_secret=client_secret&
device_code=device_code&
grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Adevice_code
This example shows a curl command to send the same request:
curl -d "client_id=client_id&client_secret=client_secret& \
         device_code=device_code& \
         grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Adevice_code" \
         -H "Content-Type: application/x-www-form-urlencoded" \
         https://oauth2.googleapis.com/token
Step 5: User responds to access request
Note: Your application does not need to do anything at this stage aside from polling the authorization server as described in the previous step.
The following image shows a page similar to what users see when they navigate to the verification_url that you displayed in step 3:

After entering the user_code and, if not already logged-in, logging in to Google, the user sees a consent screen like the one shown below:

Step 6: Handle responses to polling requests
Google's authorization server responds to each polling request with one of the following responses:
Access granted
If the user granted access to the device (by clicking Allow on the consent screen), then the response contains an access token and a refresh token. The tokens enable your device to access Google APIs on the user's behalf. (The scope property in the response determines which APIs the device can access.)
In this case, the API response contains the following fields:
Fields
access_token
The token that your application sends to authorize a Google API request.
expires_in
The remaining lifetime of the access token in seconds.
refresh_token
A token that you can use to obtain a new access token. Refresh tokens are valid until the user revokes access or the refresh token expires. Note that refresh tokens are always returned for devices.
refresh_token_expires_in
The remaining lifetime of the refresh token in seconds. This value is only set when the user grants time-based access.
scope
The scopes of access granted by the access_token expressed as a list of space-delimited, case-sensitive strings.
token_type
The type of token returned. At this time, this field's value is always set to Bearer.

The following snippet shows a sample response:
{
  "access_token": "1/fFAGRNJru1FTz70BzhT3Zg",
  "expires_in": 3920,
  "scope": "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
  "token_type": "Bearer",
  "refresh_token": "1/xEoDL4iW3cxlI7yDbSRFYNG01kVKM2C-259HOF2aQbI"
}
Access tokens have a limited lifetime. If your application needs access to an API over a long period of time, it can use the refresh token to obtain a new access token. If your application needs this type of access, then it should store the refresh token for later use.
Access denied
If the user refuses to grant access to the device, then the server response has a 403 HTTP response status code (Forbidden). The response contains the following error:
{
  "error": "access_denied",
  "error_description": "Forbidden"
}
Authorization pending
If the user has not yet completed the authorization flow, then the server returns a 428 HTTP response status code (Precondition Required). The response contains the following error:
{
  "error": "authorization_pending",
  "error_description": "Precondition Required"
}
Polling too frequently
If the device sends polling requests too frequently, then the server returns a 403 HTTP response status code (Forbidden). The response contains the following error:
{
  "error": "slow_down",
  "error_description": "Forbidden"
}
Other errors
The authorization server also returns errors if the polling request is missing any required parameters or has an incorrect parameter value. These requests usually have a 400 (Bad Request) or 401 (Unauthorized) HTTP response status code. Those errors include:
Error
HTTP Status Code
Description
admin_policy_enforced
400
The Google Account is unable to authorize one or more scopes requested due to the policies of their Google Workspace administrator. See the Google Workspace Admin help article Control which third-party & internal apps access Google Workspace data for more information about how an administrator may restrict access to scopes until access is explicitly granted to your OAuth client ID.
invalid_client
401
The OAuth client was not found. For example, this error occurs if the client_id parameter value is invalid.
The OAuth client type is incorrect. Ensure that the application type for the client id is set to TVs and Limited Input devices.
invalid_grant
400
The code parameter value is invalid, has already been claimed or cannot be parsed.
unsupported_grant_type
400
The grant_type parameter value is invalid.
org_internal
403
The OAuth client ID in the request is part of a project limiting access to Google Accounts in a specific Google Cloud Organization. Confirm the user type configuration for your OAuth application.

Calling Google APIs
After your application obtains an access token, you can use the token to make calls to a Google API on behalf of a given user account if the scope(s) of access required by the API have been granted. To do this, include the access token in a request to the API by including either an access_token query parameter or an Authorization HTTP header Bearer value. When possible, the HTTP header is preferable, because query strings tend to be visible in server logs. In most cases you can use a client library to set up your calls to Google APIs (for example, when calling the Drive Files API).
You can try out all the Google APIs and view their scopes at the OAuth 2.0 Playground.
HTTP GET examples
A call to the drive.files endpoint (the Drive Files API) using the Authorization: Bearer HTTP header might look like the following. Note that you need to specify your own access token:
GET /drive/v2/files HTTP/1.1
Host: www.googleapis.com
Authorization: Bearer access_token
Here is a call to the same API for the authenticated user using the access_token query string parameter:
GET https://www.googleapis.com/drive/v2/files?access_token=access_token
curl examples
You can test these commands with the curl command-line application. Here's an example that uses the HTTP header option (preferred):
curl -H "Authorization: Bearer access_token" https://www.googleapis.com/drive/v2/files
Or, alternatively, the query string parameter option:
curl https://www.googleapis.com/drive/v2/files?access_token=access_token
Refreshing an access token
Access tokens periodically expire and become invalid credentials for a related API request. You can refresh an access token without prompting the user for permission (including when the user is not present) if you requested offline access to the scopes associated with the token.
To refresh an access token, your application sends an HTTPS POST request to Google's authorization server (https://oauth2.googleapis.com/token) that includes the following parameters:
Fields
client_id
The client ID obtained from the API Console.
client_secret
The client secret obtained from the API Console.
grant_type
As defined in the OAuth 2.0 specification, this field's value must be set to refresh_token.
refresh_token
The refresh token returned from the authorization code exchange.

The following snippet shows a sample request:
POST /token HTTP/1.1
Host: oauth2.googleapis.com
Content-Type: application/x-www-form-urlencoded

client_id=your_client_id&
client_secret=your_client_secret&
refresh_token=refresh_token&
grant_type=refresh_token
As long as the user has not revoked the access granted to the application, the token server returns a JSON object that contains a new access token. The following snippet shows a sample response:
{
  "access_token": "1/fFAGRNJru1FTz70BzhT3Zg",
  "expires_in": 3920,
  "scope": "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly",
  "token_type": "Bearer"
}
Note that there are limits on the number of refresh tokens that will be issued; one limit per client/user combination, and another per user across all clients. You should save refresh tokens in long-term storage and continue to use them as long as they remain valid. If your application requests too many refresh tokens, it may run into these limits, in which case older refresh tokens will stop working.
Revoking a token
In some cases a user may wish to revoke access given to an application. A user can revoke access by visiting Account Settings. See the Remove site or app access section of the Third-party sites & apps with access to your account support document for more information.
It is also possible for an application to programmatically revoke the access given to it. Programmatic revocation is important in instances where a user unsubscribes, removes an application, or the API resources required by an app have significantly changed. In other words, part of the removal process can include an API request to ensure the permissions previously granted to the application are removed.
To programmatically revoke a token, your application makes a request to https://oauth2.googleapis.com/revoke and includes the token as a parameter:
curl -d -X -POST --header "Content-type:application/x-www-form-urlencoded" \
        https://oauth2.googleapis.com/revoke?token={token}
The token can be an access token or a refresh token. If the token is an access token and it has a corresponding refresh token, the refresh token will also be revoked.
If the revocation is successfully processed, then the HTTP status code of the response is 200. For error conditions, an HTTP status code 400 is returned along with an error code.
Note: Following a successful revocation response, it might take some time before the revocation has full effect.
Allowed scopes
The OAuth 2.0 flow for devices is supported only for the following scopes:
OpenID Connect, Google Sign-In
email
openid
profile
Drive API
https://www.googleapis.com/auth/drive.appdata
https://www.googleapis.com/auth/drive.file
YouTube API
https://www.googleapis.com/auth/youtube
https://www.googleapis.com/auth/youtube.readonly
Time-based access
Time-based access allows a user to grant your app access to their data for a limited duration to complete an action. Time-based access is available in select Google products during the consent flow, giving users the option to grant access for a limited period of time. An example is the Data Portability API which enables a one-time transfer of data.
When a user grants your application time-based access, the refresh token will expire after the specified duration. Note that refresh tokens may be invalidated earlier under specific circumstances; see these cases for details. The refresh_token_expires_in field returned in the authorization code exchange response represents the time remaining until the refresh token expires in such cases.
Implementing Cross-Account Protection
An additional step you should take to protect your users' accounts is implementing Cross-Account Protection by utilizing Google's Cross-Account Protection Service. This service lets you subscribe to security event notifications which provide information to your application about major changes to the user account. You can then use the information to take action depending on how you decide to respond to events.
Some examples of the event types sent to your app by Google's Cross-Account Protection Service are:
https://schemas.openid.net/secevent/risc/event-type/sessions-revoked
https://schemas.openid.net/secevent/oauth/event-type/token-revoked
https://schemas.openid.net/secevent/risc/event-type/account-disabled
See the Protect user accounts with Cross-Account Protection page for more information on how to implement Cross Account Protection and for the full list of available events.
Was this helpful?
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-06-25 UTC.
Connect
Blog
Instagram
LinkedIn
X (Twitter)
YouTube
Programs
Google Developer Groups
Google Developer Experts
Accelerators
Women Techmakers
Google Cloud & NVIDIA
Developer consoles
Google API Console
Google Cloud Platform Console
Google Play Console
Firebase Console
Actions on Google Console
Cast SDK Developer Console
Chrome Web Store Dashboard
Google Home Developer Console

Android
Chrome
Firebase
Google Cloud Platform
Google AI
All products
Terms
Privacy
Sign up for the Google for Developers newsletterSubscribe
English
Page info
bug_reportfullscreenclose
On this page


































Key Takeaways
AI-GENERATED
OAuth 2.0 Device Flow enables devices with limited input, like TVs, to securely access Google APIs by authorizing on a separate device.
The flow involves requesting device and user codes, displaying them to the user, and polling for authorization.
Users authorize access on a separate, input-rich device using the provided verification URL and user code.
Upon successful authorization, the device receives access tokens for API access, which can be refreshed using refresh tokens.
Devices should handle potential errors, adjust polling frequency as needed, and consider security measures like Cross-Account Protection.
outlined_flag
Tags
JavaScript
The new page has loaded..
Skip to main content

Authentication
Authorization
Account Authorization
Account Linking
Cross-platform
Implement identity for Android ⍈
Implement identity for Web
Implement identity for iOS
Cross-Account Protection (RISC)
/
English
Google Account Authorization
App verification to use Google Authorization APIs
Google Account Linking
Resources
























Authorization
Was this helpful?
Using OAuth 2.0 for Server to Server Applications
bookmark_border
Important: If you are working with Google Cloud Platform, unless you plan to build your own client library, use service accounts and a Cloud Client Library instead of performing authorization explicitly as described in this document. For more information, see Authentication Overview in the Google Cloud Platform documentation.
The Google OAuth 2.0 system supports server-to-server interactions such as those between a web application and a Google service. For this scenario you need a service account, which is an account that belongs to your application instead of to an individual end user. Your application calls Google APIs on behalf of the service account, so users aren't directly involved. This scenario is sometimes called "two-legged OAuth," or "2LO." (The related term "three-legged OAuth" refers to scenarios in which your application calls Google APIs on behalf of end users, and in which user consent is sometimes required.)
Typically, an application uses a service account when the application uses Google APIs to work with its own data rather than a user's data. For example, an application that uses Google Cloud Datastore for data persistence would use a service account to authenticate its calls to the Google Cloud Datastore API.
Google Workspace domain administrators can also grant service accounts domain-wide authority to access user data on behalf of users in the domain.
This document describes how an application can complete the server-to-server OAuth 2.0 flow by using either a Google APIs client library (recommended) or HTTP.
With some Google APIs, you can make authorized API calls using a signed JWT instead of using OAuth 2.0, which can save you a network request. See Addendum: Service account authorization without OAuth.
Overview
To support server-to-server interactions, first create a service account for your project in the API Console. If you want to access user data for users in your Google Workspace account, then delegate domain-wide access to the service account.
Then, your application prepares to make authorized API calls by using the service account's credentials to request an access token from the OAuth 2.0 auth server.
Finally, your application can use the access token to call Google APIs.
Recommendation: Your application can complete these tasks either by using the Google APIs client library for your language, or by directly interacting with the OAuth 2.0 system using HTTP. However, the mechanics of server-to-server authentication interactions require applications to create and cryptographically sign JSON Web Tokens (JWTs), and it's easy to make serious errors that can have a severe impact on the security of your application.
For this reason, we strongly encourage you to use libraries, such as the Google APIs client libraries, that abstract the cryptography away from your application code.
Creating a service account
A service account's credentials include a generated email address that is unique and at least one public/private key pair. If domain-wide delegation is enabled, then a client ID is also part of the service account's credentials.
If your application runs on Google App Engine, a service account is set up automatically when you create your project.
If your application runs on Google Compute Engine, a service account is also set up automatically when you create your project, but you must specify the scopes that your application needs access to when you create a Google Compute Engine instance. For more information, see Preparing an instance to use service accounts.
If your application doesn't run on Google App Engine or Google Compute Engine, you must obtain these credentials in the Google API Console. To generate service-account credentials, or to view the public credentials that you've already generated, do the following:
First, create a service account:
Open the Service accounts page.
If prompted, select a project, or create a new one.
Click add Create service account.
Under Service account details, type a name, ID, and description for the service account, then click Create and continue.
Optional: Under Grant this service account access to project, select the IAM roles to grant to the service account.
Click Continue.
Optional: Under Grant users access to this service account, add the users or groups that are allowed to use and manage the service account.
Click Done.
Next, create a service account key:
Click the email address for the service account you created.
Click the Keys tab.
In the Add key drop-down list, select Create new key.
Click Create.
Your new public/private key pair is generated and downloaded to your machine; it serves as the only copy of the private key. You are responsible for storing it securely. If you lose this key pair, you will need to generate a new one.
You can return to the API Console at any time to view the email address, public key fingerprints, and other information, or to generate additional public/private key pairs. For more details about service account credentials in the API Console, see Service accounts in the API Console help file.
Take note of the service account's email address and store the service account's private key file in a location accessible to your application. Your application needs them to make authorized API calls.
Note: You must store and manage private keys securely in both development and production environments. Google does not keep a copy of your private keys, only your public keys. See the Handle client credentials securely section of OAuth 2.0 Policies for more information.
Delegating domain-wide authority to the service account
Using a Google Workspace account, a Workspace administrator of the organization can authorize an application to access Workspace user data on behalf of users in the Google Workspace domain. For example, an application that uses the Google Calendar API to add events to the calendars of all users in a Google Workspace domain would use a service account to access the Google Calendar API on behalf of users. Authorizing a service account to access data on behalf of users in a domain is sometimes referred to as "delegating domain-wide authority" to a service account.
Note: When you use Google Workspace Marketplace to install an application for your domain, the required permissions are automatically granted to the application during installation. You do not need to manually authorize the service accounts that the application uses.Note: Although you can use service accounts in applications that run from a Google Workspace domain, service accounts are not members of your Google Workspace account and aren't subject to domain policies set by Google Workspace administrators. For example, a policy set in the Google Workspace Admin console to restrict the ability of Google Workspace end users to share documents outside of the domain would not apply to service accounts.
To delegate domain-wide authority to a service account, a super administrator of the Google Workspace domain must complete the following steps:
From your Google Workspace domain's Admin console, go to Main menu menu > Security > Access and data control > API Controls.
In the Domain wide delegation pane, select Manage Domain Wide Delegation.
Click Add new.
In the Client ID field, enter the service account's Client ID. You can find your service account's client ID in the Service accounts page.
In the OAuth scopes (comma-delimited) field, enter the list of scopes that your application should be granted access to. For example, if your application needs domain-wide full access to the Google Drive API and the Google Calendar API, enter: https://www.googleapis.com/auth/drive, https://www.googleapis.com/auth/calendar.
Click Authorize.
Your application now has the authority to make API calls as users in your Workspace domain (to "impersonate" users). When you prepare to make these delegated API calls, you will explicitly specify the user to impersonate.
Note: It usually takes a few minutes for impersonation access to be granted after the client ID was added, but in some cases, it might take up to 24 hours to propagate to all users of your Google Account.
Preparing to make a delegated API call
Java
Python
HTTP/REST
After you obtain the client email address and private key from the API Console, use the Google APIs Client Library for Java to create a GoogleCredential object from the service account's credentials and the scopes your application needs access to. For example:
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.services.sqladmin.SQLAdminScopes;

// ...

GoogleCredential credential = GoogleCredential.fromStream(new FileInputStream("MyProject-1234.json"))
    .createScoped(Collections.singleton(SQLAdminScopes.SQLSERVICE_ADMIN));
If you are developing an app on Google Cloud Platform, you can use the application default credentials instead, which can simplify the process.
Delegate domain-wide authority
If you have delegated domain-wide access to the service account and you want to impersonate a user account, specify the email address of the user account with the createDelegated method of the GoogleCredential object. For example:
GoogleCredential credential = GoogleCredential.fromStream(new FileInputStream("MyProject-1234.json"))
    .createScoped(Collections.singleton(SQLAdminScopes.SQLSERVICE_ADMIN))
    .createDelegated("workspace-user@example.com");
The code above uses the GoogleCredential object to call its createDelegated() method. The argument for the createDelegated() method must be a user which belongs to your Workspace account. Your code making the request will use this credential to call Google APIs using your service account.
Calling Google APIs
Java
Python
HTTP/REST
Use the GoogleCredential object to call Google APIs by completing the following steps:
Create a service object for the API that you want to call using the GoogleCredential object. For example:
SQLAdmin sqladmin =
    new SQLAdmin.Builder(httpTransport, JSON_FACTORY, credential).build();
Make requests to the API service using the interface provided by the service object. For example, to list the instances of Cloud SQL databases in the exciting-example-123 project:
SQLAdmin.Instances.List instances =
    sqladmin.instances().list("exciting-example-123").execute();
JWT error codes
error field
error_description field
Meaning
How to resolve
unauthorized_client
Unauthorized client or scope in request.
If you're trying to use domain-wide delegation, the service account is not authorized in the Admin console of the user's domain.
Ensure that the service account is authorized in the Domain-wide delegation page of the Admin console for the user in the sub claim (field).
While it usually takes a few minutes, it might take up to 24 hours for authorization to propagate to all users in your Google Account.
unauthorized_client
Client is unauthorized to retrieve access tokens using this method, or client not authorized for any of the scopes requested.
A service account was authorized using the client email address rather than the client ID (numeric) in the Admin console.
In the Domain-wide delegation page in the Admin console, remove the client, and re-add it with the numeric ID.
access_denied
(any value)
If you're using Domain-wide delegation, one or more requested scopes aren't authorized in the Admin console.
Ensure that the service account is authorized in the Domain-wide delegation page of the Admin console for the user in the sub claim (field), and that it includes all of the scopes you're requesting in the scope claim of your JWT.
While it usually takes a few minutes, it might take up to 24 hours for authorization to propagate to all users in your Google Account.
admin_policy_enforced
(any value)
The Google Account is unable to authorize one or more scopes requested due to the policies of their Google Workspace administrator.
See the Google Workspace Admin help article Control which third-party & internal apps access Google Workspace data for more information about how an administrator may restrict access to all scopes or sensitive and restricted scopes until access is explicitly granted to your OAuth client ID.
invalid_client
(any value)
The OAuth client or JWT token is invalid or incorrectly configured.
Refer to the error description for details.
Make sure the JWT token is valid and contains correct claims.
Check that the OAuth client and service account are configured correctly and that you are using the correct email address.
Check that the JWT token is correct and was issued for the client ID in the request.
deleted_client
(any value)
The OAuth client being used to make the request has been deleted. Deletion can happen manually or automatically in the case of unused clients . Deleted clients can be restored within 30 days of the deletion. Learn more.
Use a client ID that is still active.
invalid_grant
Not a valid email.
The user doesn't exist.
Check that the email address in the sub claim (field) is correct.
invalid_grant
Invalid JWT: Token must be a short-lived token (60 minutes) and in a reasonable timeframe. Check your 'iat' and 'exp' values and use a clock with skew to account for clock differences between systems.
Usually, it means that the local system time is not correct. It could also happen if the exp value is more than 65 mins in the future from the iat value, or the exp value is lower than iat value.
Make sure that the clock on the system where the JWT is generated is correct. If necessary, sync your time with Google NTP.
invalid_grant
Invalid JWT Signature.
The JWT assertion is signed with a private key not associated with the service account identified by the client email or the key that was used has been deleted, disabled, or has expired.
Alternatively, the JWT assertion might be encoded incorrectly - it must be Base64-encoded, without newlines or padding equal signs.
Decode the JWT claim set and verify the key that signed the assertion is associated with the service account.
Try to use a Google-provided OAuth library to make sure the JWT is generated correctly.
invalid_scope
Invalid OAuth scope or ID token audience provided.
No scopes were requested (empty list of scopes), or one of the requested scopes doesn't exist (i.e. is invalid).
Ensure that the scope claim (field) of the JWT is populated, and compare the scopes that it contains with the documented scopes for the APIs you want to use, to ensure there are no errors or typos.
Note that the list of scopes in the scope claim needs to be separated by spaces, not commas.
disabled_client
The OAuth client was disabled.
The key used to sign the JWT assertion is disabled.
Go to the Google API Console, and under IAM & Admin > Service Accounts, enable the service account which contains the "Key ID" used to sign the assertion.
org_internal
This client is restricted to users within its organization.
The OAuth client ID in the request is part of a project limiting access to Google Accounts in a specific Google Cloud Organization.
Use a service account from the organization to authenticate. Confirm the user type configuration for your OAuth application.

Addendum: Service account authorization without OAuth
With some Google APIs, you can make authorized API calls using a signed JWT directly as a bearer token, rather than an OAuth 2.0 access token. When this is possible, you can avoid having to make a network request to Google's authorization server before making an API call.
If the API you want to call has a service definition published in the Google APIs GitHub repository, you can make authorized API calls using a JWT instead of an access token. To do so:
Create a service account as described above. Be sure to keep the JSON file you get when you create the account.
Using any standard JWT library, such as one found at jwt.io, create a JWT with a header and payload like the following example:
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "abcdef1234567890"
}
.
{
  "iss": "123456-compute@developer.gserviceaccount.com",
  "sub": "123456-compute@developer.gserviceaccount.com",
  "aud": "https://firestore.googleapis.com/",
  "iat": 1511900000,
  "exp": 1511903600
}
For the kid field in the header, specify your service account's private key ID. You can find this value in the private_key_id field of your service account JSON file.
For the iss and sub fields, specify your service account's email address. You can find this value in the client_email field of your service account JSON file.
For the aud field, specify the API endpoint. For example: https://SERVICE.googleapis.com/.
For the iat field, specify the current Unix time, and for the exp field, specify the time exactly 3600 seconds later, when the JWT will expire.
Sign the JWT with RSA-256 using the private key found in your service account JSON file.
For example:
Java
Python
Using google-api-java-client and java-jwt:
GoogleCredential credential =
        GoogleCredential.fromStream(new FileInputStream("MyProject-1234.json"));
PrivateKey privateKey = credential.getServiceAccountPrivateKey();
String privateKeyId = credential.getServiceAccountPrivateKeyId();

long now = System.currentTimeMillis();

try {
    Algorithm algorithm = Algorithm.RSA256(null, privateKey);
    String signedJwt = JWT.create()
        .withKeyId(privateKeyId)
        .withIssuer("123456-compute@developer.gserviceaccount.com")
        .withSubject("123456-compute@developer.gserviceaccount.com")
        .withAudience("https://firestore.googleapis.com/")
        .withIssuedAt(new Date(now))
        .withExpiresAt(new Date(now + 3600 * 1000L))
        .sign(algorithm);
} catch ...
Call the API, using the signed JWT as the bearer token:
GET /v1/projects/abc/databases/123/indexes HTTP/1.1
Authorization: Bearer SIGNED_JWT
Host: firestore.googleapis.com
Implementing Cross-Account Protection
An additional step you should take to protect your users' accounts is implementing Cross-Account Protection by utilizing Google's Cross-Account Protection Service. This service lets you subscribe to security event notifications which provide information to your application about major changes to the user account. You can then use the information to take action depending on how you decide to respond to events.
Some examples of the event types sent to your app by Google's Cross-Account Protection Service are:
https://schemas.openid.net/secevent/risc/event-type/sessions-revoked
https://schemas.openid.net/secevent/oauth/event-type/token-revoked
https://schemas.openid.net/secevent/risc/event-type/account-disabled
See the Protect user accounts with Cross-Account Protection page for more information on how to implement Cross Account Protection and for the full list of available events.
Was this helpful?
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-05-27 UTC.
Connect
Blog
Instagram
LinkedIn
X (Twitter)
YouTube
Programs
Google Developer Groups
Google Developer Experts
Accelerators
Women Techmakers
Google Cloud & NVIDIA
Developer consoles
Google API Console
Google Cloud Platform Console
Google Play Console
Firebase Console
Actions on Google Console
Cast SDK Developer Console
Chrome Web Store Dashboard
Google Home Developer Console



Android
Chrome
Firebase
Google Cloud Platform
Google AI
All products
Terms
Privacy
Sign up for the Google for Developers newsletterSubscribe
English
Page info
bug_reportfullscreenclose
On this page














Key Takeaways
AI-GENERATED
Service accounts enable applications to interact with Google APIs securely without direct user involvement, ideal for managing application-specific data.
They utilize a private key for authentication, requiring secure storage and management, and can be granted domain-wide authority for accessing user data within a Google Workspace domain with admin authorization.
Client libraries are strongly recommended to streamline the authentication process and enhance security by abstracting away complexities.
While some APIs allow direct authorization with signed JWTs, it's generally discouraged due to security risks, with client libraries offering a more robust and secure approach.
Common errors encountered during service account authorization include invalid client/grant/scope, disabled client, and internal restrictions, each with specific causes and solutions detailed in the provided documentation.
outlined_flag
Tags
JavaScriptPythonJava
The new page has loaded.

