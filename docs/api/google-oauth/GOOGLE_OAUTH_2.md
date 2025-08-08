# Google OAuth 2


Skip to main content
Identity
Sign in with Google for Web
/
English
Home
Google Sign-In for Web






























Home
Products
Google Identity
Sign in with Google for Web
Google Sign-In for Web
Was this helpful?
Send feedback
Getting profile information
bookmark_border
Warning: The Google Sign-In library optionally uses FedCM APIs, and their use will become a requirement. Conduct an impact assessment to confirm that user sign-in continues to function as expected.

Support for the Google Sign-In library is deprecated, see the Deprecation and Sunset guide for more.
After you have signed in a user with Google using the default scopes, you can access the user's Google ID, name, profile URL, and email address.
Important: Do not use the Google IDs returned by getId() or the user's profile information to communicate the currently signed in user to your backend server. Instead, send ID tokens, which can be securely validated on the server.
To retrieve profile information for a user, use the getBasicProfile() method. For example:
// auth2 is initialized with gapi.auth2.init() and a user is signed in.

if (auth2.isSignedIn.get()) {
  var profile = auth2.currentUser.get().getBasicProfile();
  console.log('ID: ' + profile.getId());
  console.log('Full Name: ' + profile.getName());
  console.log('Given Name: ' + profile.getGivenName());
  console.log('Family Name: ' + profile.getFamilyName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());
}

Note: A Google account's email address can change, so don't use it to identify a user. Instead, use the account's ID, which you can get on the client with getBasicProfile().getId(), and on the backend from the sub claim of the ID token.
Was this helpful?
Send feedback
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-06-06 UTC.
GitHub
Fork our samples and try them yourself
Stack Overflow
Ask a question under the google-signin tag
Blog
The latest news on the Google Developers blog
Chromium Blog
The latest news on the Chromium blog.
Product Info
Terms of Service
Branding Guidelines
Help
Sign In With Google
Google Identity
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
Google Sign-In is being deprecated; developers should consult the Deprecation and Sunset guide for more information and migration strategies.
To integrate Google Sign-In, you must create authorization credentials in the Google Developers Console and include the Google Platform Library in your web pages.
You can easily add a Google Sign-In button using a provided HTML snippet and retrieve basic user profile information after sign-in.
For server-side authentication, it is crucial to use ID tokens instead of relying on Google IDs or profile information directly.
Users can sign out of your application without signing out of Google using the provided sign-out method.
outlined_flag
Google Developer Program dialog opened

Skip to main content
Identity
Sign in with Google for Web
/
English
Home
Google Sign-In for Web






























Home
Products
Google Identity
Sign in with Google for Web
Google Sign-In for Web
Was this helpful?
Send feedback
Getting profile information
bookmark_border
Warning: The Google Sign-In library optionally uses FedCM APIs, and their use will become a requirement. Conduct an impact assessment to confirm that user sign-in continues to function as expected.

Support for the Google Sign-In library is deprecated, see the Deprecation and Sunset guide for more.
After you have signed in a user with Google using the default scopes, you can access the user's Google ID, name, profile URL, and email address.
Important: Do not use the Google IDs returned by getId() or the user's profile information to communicate the currently signed in user to your backend server. Instead, send ID tokens, which can be securely validated on the server.
To retrieve profile information for a user, use the getBasicProfile() method. For example:
// auth2 is initialized with gapi.auth2.init() and a user is signed in.

if (auth2.isSignedIn.get()) {
  var profile = auth2.currentUser.get().getBasicProfile();
  console.log('ID: ' + profile.getId());
  console.log('Full Name: ' + profile.getName());
  console.log('Given Name: ' + profile.getGivenName());
  console.log('Family Name: ' + profile.getFamilyName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());
}

Note: A Google account's email address can change, so don't use it to identify a user. Instead, use the account's ID, which you can get on the client with getBasicProfile().getId(), and on the backend from the sub claim of the ID token.
Was this helpful?
Send feedback
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-06-06 UTC.
GitHub
Fork our samples and try them yourself
Stack Overflow
Ask a question under the google-signin tag
Blog
The latest news on the Google Developers blog
Chromium Blog
The latest news on the Chromium blog.
Product Info
Terms of Service
Branding Guidelines
Help
Sign In With Google
Google Identity
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
Google Sign-In is being deprecated; developers should consult the Deprecation and Sunset guide for more information and migration strategies.
To integrate Google Sign-In, you must create authorization credentials in the Google Developers Console and include the Google Platform Library in your web pages.
You can easily add a Google Sign-In button using a provided HTML snippet and retrieve basic user profile information after sign-in.
For server-side authentication, it is crucial to use ID tokens instead of relying on Google IDs or profile information directly.
Users can sign out of your application without signing out of Google using the provided sign-out method.
outlined_flag
Google Developer Program dialog opened

Skip to main content
Identity
Sign in with Google for Web
/
English
Home
Google Sign-In for Web






























Home
Products
Google Identity
Sign in with Google for Web
Google Sign-In for Web
Was this helpful?
Send feedback
Authenticate with a backend server
bookmark_border
If you use Google Sign-In with an app or site that communicates with a backend server, you might need to identify the currently signed-in user on the server. To do so securely, after a user successfully signs in, send the user's ID token to your server using HTTPS. Then, on the server, verify the integrity of the ID token and use the user information contained in the token to establish a session or create a new account.
Warning: Do not accept plain user IDs, such as those you can get with the GoogleUser.getId() method, on your backend server. A modified client application can send arbitrary user IDs to your server to impersonate users, so you must instead use verifiable ID tokens to securely get the user IDs of signed-in users on the server side.
Send the ID token to your server
After a user successfully signs in, get the user's ID token:
function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  ...
}
Then, send the ID token to your server with an HTTPS POST request:
var xhr = new XMLHttpRequest();
xhr.open('POST', 'https://yourbackend.example.com/tokensignin');
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.onload = function() {
  console.log('Signed in as: ' + xhr.responseText);
};
xhr.send('idtoken=' + id_token);
Verify the integrity of the ID token
After you receive the ID token by HTTPS POST, you must verify the integrity of the token.
To verify that the token is valid, ensure that the following criteria are satisfied:
The ID token is properly signed by Google. Use Google's public keys (available in JWK or PEM format) to verify the token's signature. These keys are regularly rotated; examine the Cache-Control header in the response to determine when you should retrieve them again.
The value of aud in the ID token is equal to one of your app's client IDs. This check is necessary to prevent ID tokens issued to a malicious app being used to access data about the same user on your app's backend server.
The value of iss in the ID token is equal to accounts.google.com or https://accounts.google.com.
The expiry time (exp) of the ID token has not passed.
If you need to validate that the ID token represents a Google Workspace or Cloud organization account, you can check the hd claim, which indicates the hosted domain of the user. This must be used when restricting access to a resource to only members of certain domains. The absence of this claim indicates that the account does not belong to a Google hosted domain.
Using the email, email_verified and hd fields, you can determine if Google hosts and is authoritative for an email address. In the cases where Google is authoritative, the user is known to be the legitimate account owner, and you may skip password or other challenge methods.
Cases where Google is authoritative:
email has a @gmail.com suffix, this is a Gmail account.
email_verified is true and hd is set, this is a G Suite account.
Users may register for Google Accounts without using Gmail or G Suite. When email does not contain a @gmail.com suffix and hd is absent, Google is not authoritative and password or other challenge methods are recommended to verify the user. email_verified can also be true as Google initially verified the user when the Google account was created, however ownership of the third party email account may have since changed.
Rather than writing your own code to perform these verification steps, we strongly recommend using a Google API client library for your platform, or a general-purpose JWT library. For development and debugging, you can call our tokeninfo validation endpoint.
Using a Google API Client Library
Using one of the Google API Client Libraries (e.g. Java, Node.js, PHP, Python) is the recommended way to validate Google ID tokens in a production environment.
Java
Node.js
PHP
Python
To validate an ID token in Java, use the GoogleIdTokenVerifier object. For example:
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;

...

GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
    // Specify the WEB_CLIENT_ID of the app that accesses the backend:
    .setAudience(Collections.singletonList(WEB_CLIENT_ID))
    // Or, if multiple clients access the backend:
    //.setAudience(Arrays.asList(WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3))
    .build();

// (Receive idTokenString by HTTPS POST)

GoogleIdToken idToken = verifier.verify(idTokenString);
if (idToken != null) {
  Payload payload = idToken.getPayload();

  // Print user identifier
  String userId = payload.getSubject();
  System.out.println("User ID: " + userId);

  // Get profile information from payload
  String email = payload.getEmail();
  boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
  String name = (String) payload.get("name");
  String pictureUrl = (String) payload.get("picture");
  String locale = (String) payload.get("locale");
  String familyName = (String) payload.get("family_name");
  String givenName = (String) payload.get("given_name");

  // Use or store profile information
  // ...

} else {
  System.out.println("Invalid ID token.");
}
The GoogleIdTokenVerifier.verify() method verifies the JWT signature, the aud claim, the iss claim, and the exp claim.
If you need to validate that the ID token represents a Google Workspace or Cloud organization account, you can verify the hd claim by checking the domain name returned by the Payload.getHostedDomain() method. The domain of the email claim is insufficient to ensure that the account is managed by a domain or organization.
Calling the tokeninfo endpoint
An easy way to validate an ID token signature for debugging is to use the tokeninfo endpoint. Calling this endpoint involves an additional network request that does most of the validation for you while you test proper validation and payload extraction in your own code. It is not suitable for use in production code as requests may be throttled or otherwise subject to intermittent errors.
To validate an ID token using the tokeninfo endpoint, make an HTTPS POST or GET request to the endpoint, and pass your ID token in the id_token parameter. For example, to validate the token "XYZ123", make the following GET request:
https://oauth2.googleapis.com/tokeninfo?id_token=XYZ123
If the token is properly signed and the iss and exp claims have the expected values, you will get a HTTP 200 response, where the body contains the JSON-formatted ID token claims. Here's an example response:
{
 // These six fields are included in all Google ID Tokens.
 "iss": "https://accounts.google.com",
 "sub": "110169484474386276334",
 "azp": "1008719970978-hb24n2dstb40o45d4feuo2ukqmcc6381.apps.googleusercontent.com",
 "aud": "1008719970978-hb24n2dstb40o45d4feuo2ukqmcc6381.apps.googleusercontent.com",
 "iat": "1433978353",
 "exp": "1433981953",

 // These seven fields are only included when the user has granted the "profile" and
 // "email" OAuth scopes to the application.
 "email": "testuser@gmail.com",
 "email_verified": "true",
 "name" : "Test User",
 "picture": "https://lh4.googleusercontent.com/-kYgzyAWpZzJ/ABCDEFGHI/AAAJKLMNOP/tIXL9Ir44LE/s99-c/photo.jpg",
 "given_name": "Test",
 "family_name": "User",
 "locale": "en"
}
Warning: Once you get these claims, you still need to check that the aud claim contains one of your app's client IDs. If it does, then the token is both valid and intended for your client, and you can safely retrieve and use the user's unique Google ID from the sub claim.
If you need to validate that the ID token represents a Google Workspace account, you can check the hd claim, which indicates the hosted domain of the user. This must be used when restricting access to a resource to only members of certain domains. The absence of this claim indicates that the account does not belong to a Google Workspace hosted domain.
Create an account or session
After you have verified the token, check if the user is already in your user database. If so, establish an authenticated session for the user. If the user isn't yet in your user database, create a new user record from the information in the ID token payload, and establish a session for the user. You can prompt the user for any additional profile information you require when you detect a newly created user in your app.
Securing your users' accounts with Cross Account Protection
When you rely on Google to sign in a user, you'll automatically benefit from all of the security features and infrastructure Google has built to safeguard the user's data. However, in the unlikely event that the user's Google Account gets compromised or there is some other significant security event, your app can also be vulnerable to attack. To better protect your accounts from any major security events, use Cross Account Protection to receive security alerts from Google. When you receive these events, you gain visibility into important changes to the security of the user's Google account and you can then take action on your service to secure your accounts.
Was this helpful?
Send feedback
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-06-06 UTC.
GitHub
Fork our samples and try them yourself
Stack Overflow
Ask a question under the google-signin tag
Blog
The latest news on the Google Developers blog
Chromium Blog
The latest news on the Chromium blog.
Product Info
Terms of Service
Branding Guidelines
Help
Sign In With Google
Google Identity
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
Google Sign-In is being deprecated; developers should consult the Deprecation and Sunset guide for more information and migration strategies.
To integrate Google Sign-In, you must create authorization credentials in the Google Developers Console and include the Google Platform Library in your web pages.
You can easily add a Google Sign-In button using a provided HTML snippet and retrieve basic user profile information after sign-in.
For server-side authentication, it is crucial to use ID tokens instead of relying on Google IDs or profile information directly.
Users can sign out of your application without signing out of Google using the provided sign-out method.
outlined_flag
Google Developer Program dialog opened

Skip to main content
Identity
Sign in with Google for Web
/
English
Home
Google Sign-In for Web






























Home
Products
Google Identity
Sign in with Google for Web
Google Sign-In for Web
Was this helpful?
Send feedback
Building a custom Google Sign-In button
bookmark_border
Warning: The Google Sign-In library optionally uses FedCM APIs, and their use will become a requirement. Conduct an impact assessment to confirm that user sign-in continues to function as expected.

Support for the Google Sign-In library is deprecated, see the Deprecation and Sunset guide for more.
Customizing the automatically rendered sign-in button (recommended)
To create a Google Sign-In button with custom settings, add an element to contain the sign-in button to your sign-in page, write a function that calls signin2.render() with your style and scope settings, and include the https://apis.google.com/js/platform.js script with the query string onload=YOUR_RENDER_FUNCTION.
The following is an example of a Google Sign-In button that specifies custom style parameters: 
The following HTML, JavaScript, and CSS code produces the button above:
<html>
<head>
  <meta name="google-signin-client_id" content="YOUR_CLIENT_ID.apps.googleusercontent.com">
</head>
<body>
  <div id="my-signin2"></div>
  <script>
    function onSuccess(googleUser) {
      console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    }
    function onFailure(error) {
      console.log(error);
    }
    function renderButton() {
      gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
      });
    }
  </script>

  <script src="https://apis.google.com/js/platform.js?onload=renderButton" async defer></script>
</body>
</html>
You can also specify settings for a custom Google Sign-In button by defining data- attributes to a div element with the class g-signin2. For example:
<div class="g-signin2" data-width="300" data-height="200" data-longtitle="true">

Building a button with a custom graphic
You can build a Google Sign-In button to fit your site's design. You must follow the branding guidelines and use the appropriate colors and icons in your button. The branding guidelines also provide icon assets that you can use to design your button. You must also ensure that your button is as prominent as other third-party login options.
The following is an example of a Google Sign-In button built with a custom graphic: 
The following HTML, JavaScript, and CSS code produces the button above:
<html>
<head>
  <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css">
  <script src="https://apis.google.com/js/api:client.js"></script>
  <script>
  var googleUser = {};
  var startApp = function() {
    gapi.load('auth2', function(){
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      auth2 = gapi.auth2.init({
        client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        // Request scopes in addition to 'profile' and 'email'
        //scope: 'additional_scope'
      });
      attachSignin(document.getElementById('customBtn'));
    });
  };

  function attachSignin(element) {
    console.log(element.id);
    auth2.attachClickHandler(element, {},
        function(googleUser) {
          document.getElementById('name').innerText = "Signed in: " +
              googleUser.getBasicProfile().getName();
        }, function(error) {
          alert(JSON.stringify(error, undefined, 2));
        });
  }
  </script>
  <style type="text/css">
    #customBtn {
      display: inline-block;
      background: white;
      color: #444;
      width: 190px;
      border-radius: 5px;
      border: thin solid #888;
      box-shadow: 1px 1px 1px grey;
      white-space: nowrap;
    }
    #customBtn:hover {
      cursor: pointer;
    }
    span.label {
      font-family: serif;
      font-weight: normal;
    }
    span.icon {
      background: url('/identity/sign-in/g-normal.png') transparent 5px 50% no-repeat;
      display: inline-block;
      vertical-align: middle;
      width: 42px;
      height: 42px;
    }
    span.buttonText {
      display: inline-block;
      vertical-align: middle;
      padding-left: 42px;
      padding-right: 42px;
      font-size: 14px;
      font-weight: bold;
      /* Use the Roboto font that is loaded in the <head> */
      font-family: 'Roboto', sans-serif;
    }
  </style>
  </head>
  <body>
  <!-- In the callback, you would hide the gSignInWrapper element on a
  successful sign in -->
  <div id="gSignInWrapper">
    <span class="label">Sign in with:</span>
    <div id="customBtn" class="customGPlusSignIn">
      <span class="icon"></span>
      <span class="buttonText">Google</span>
    </div>
  </div>
  <div id="name"></div>
  <script>startApp();</script>
</body>
</html>
Was this helpful?
Send feedback
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-06-06 UTC.
GitHub
Fork our samples and try them yourself
Stack Overflow
Ask a question under the google-signin tag
Blog
The latest news on the Google Developers blog
Chromium Blog
The latest news on the Chromium blog.
Product Info
Terms of Service
Branding Guidelines
Help
Sign In With Google
Google Identity
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
Google Sign-In is being deprecated; developers should consult the Deprecation and Sunset guide for more information and migration strategies.
To integrate Google Sign-In, you must create authorization credentials in the Google Developers Console and include the Google Platform Library in your web pages.
You can easily add a Google Sign-In button using a provided HTML snippet and retrieve basic user profile information after sign-in.
For server-side authentication, it is crucial to use ID tokens instead of relying on Google IDs or profile information directly.
Users can sign out of your application without signing out of Google using the provided sign-out method.
outlined_flag
Google Developer Program dialog opened

Skip to main content
Identity
Sign in with Google for Web
/
English
Home
Google Sign-In for Web






























Home
Products
Google Identity
Sign in with Google for Web
Google Sign-In for Web
Was this helpful?
Send feedback
Requesting additional permissions
bookmark_border
Warning: The Google Sign-In library optionally uses FedCM APIs, and their use will become a requirement. Conduct an impact assessment to confirm that user sign-in continues to function as expected.

Support for the Google Sign-In library is deprecated, see the Deprecation and Sunset guide for more.Warning: We are discontinuing the Google Sign-In JavaScript Platform Library for web. For user authorization and to obtain access tokens for use with Google APIs, use the newer Google Identity Services JavaScript library instead. For existing implementations see Migrate to Google Identity Services.
When requesting user permission to access user data or other resources, you can request all scopes up-front in the initial request or request scopes only as needed, using incremental authorization. Using incremental authorization, your app initially requests only the scopes required to start your app, then requests additional scopes as new permissions are required, in a context that identifies the reason for the request to the user.
For example, suppose your app lets users save music playlists to Google Drive; your app can request basic user information at sign-in, and later, when the user is ready to save their first playlist, ask only for Google Drive permissions.
Use this technique if you suspect users are not signing in because your consent screen is overwhelming, or are confused about why they are being asked for certain permissions. The following instructions are for the web, and are derived from the instructions for adding a client-side sign-in button: Building a Google 2.0 Sign-In button. You can read more about incremental authorization for the web in the OAuth 2.0 documentation.
Requesting additional scopes
At sign-in, your app requests "base" scopes, consisting of the sign-in scope profile plus any other initial scopes your app requires for operation. Later, when the user wants to perform an action that requires additional scopes, your app requests those additional scopes and the user authorizes only the new scopes from a consent screen.
Step 1: Request base scopes
Request the base scope profile when you initialize Google Sign-In. This step is included in Building a Google 2.0 Sign-In button.
auth2 = gapi.auth2.init({
    client_id: 'CLIENT_ID.apps.googleusercontent.com',
    cookiepolicy: 'single_host_origin', /** Default value **/
    scope: 'profile' });                /** Base scope **/

Step 2: Request additional scopes
Wherever additional scopes are needed, request them by constructing an options builder with the scopes you want to add and then calling user.grant({scope: [OPTIONS BUILDER]}).then(successFunction, failFunction);:
const options = new gapi.auth2.SigninOptionsBuilder();
options.setScope('email https://www.googleapis.com/auth/drive');

googleUser = auth2.currentUser.get();
googleUser.grant(options).then(
    function(success){
      console.log(JSON.stringify({message: "success", value: success}));
    },
    function(fail){
      alert(JSON.stringify({message: "fail", value: fail}));
    });

Was this helpful?
Send feedback
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-06-06 UTC.
GitHub
Fork our samples and try them yourself
Stack Overflow
Ask a question under the google-signin tag
Blog
The latest news on the Google Developers blog
Chromium Blog
The latest news on the Chromium blog.
Product Info
Terms of Service
Branding Guidelines
Help
Sign In With Google
Google Identity
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
Google Sign-In is being deprecated; developers should consult the Deprecation and Sunset guide for more information and migration strategies.
To integrate Google Sign-In, you must create authorization credentials in the Google Developers Console and include the Google Platform Library in your web pages.
You can easily add a Google Sign-In button using a provided HTML snippet and retrieve basic user profile information after sign-in.
For server-side authentication, it is crucial to use ID tokens instead of relying on Google IDs or profile information directly.
Users can sign out of your application without signing out of Google using the provided sign-out method.
outlined_flag
Google Developer Program dialog opened

Skip to main content
Identity
Sign in with Google for Web
/
English
Home
Google Sign-In for Web






























Home
Products
Google Identity
Sign in with Google for Web
Google Sign-In for Web
Was this helpful?
Send feedback
Integrating Google Sign-In using listeners
bookmark_border
Warning: The Google Sign-In library optionally uses FedCM APIs, and their use will become a requirement. Conduct an impact assessment to confirm that user sign-in continues to function as expected.

Support for the Google Sign-In library is deprecated, see the Deprecation and Sunset guide for more.
Listeners provide a way to automatically respond to changes in the current user's Sign-In session. For example, after your startup method initializes the Google Sign-In auth2 object, you can set up listeners to respond to events like auth2.isSignedIn state changes, or changes in auth2.currentUser.
The following code demonstrates using the 2.0 client method listen() to respond to changes in auth2.isSignedIn and auth2.currentUser.
var auth2; // The Sign-In object.
var googleUser; // The current user.


/**
 * Calls startAuth after Sign in V2 finishes setting up.
 */
var appStart = function() {
  gapi.load('auth2', initSigninV2);
};


/**
 * Initializes Signin v2 and sets up listeners.
 */
var initSigninV2 = function() {
  auth2 = gapi.auth2.init({
      client_id: 'CLIENT_ID.apps.googleusercontent.com',
      scope: 'profile'
  });

  // Listen for sign-in state changes.
  auth2.isSignedIn.listen(signinChanged);

  // Listen for changes to current user.
  auth2.currentUser.listen(userChanged);

  // Sign in the user if they are currently signed in.
  if (auth2.isSignedIn.get() == true) {
    auth2.signIn();
  }

  // Start with the current live values.
  refreshValues();
};


/**
 * Listener method for sign-out live value.
 *
 * @param {boolean} val the updated signed out state.
 */
var signinChanged = function (val) {
  console.log('Signin state changed to ', val);
  document.getElementById('signed-in-cell').innerText = val;
};


/**
 * Listener method for when the user changes.
 *
 * @param {GoogleUser} user the updated user.
 */
var userChanged = function (user) {
  console.log('User now: ', user);
  googleUser = user;
  updateGoogleUser();
  document.getElementById('curr-user-cell').innerText =
    JSON.stringify(user, undefined, 2);
};


/**
 * Updates the properties in the Google User table using the current user.
 */
var updateGoogleUser = function () {
  if (googleUser) {
    document.getElementById('user-id').innerText = googleUser.getId();
    document.getElementById('user-scopes').innerText =
      googleUser.getGrantedScopes();
    document.getElementById('auth-response').innerText =
      JSON.stringify(googleUser.getAuthResponse(), undefined, 2);
  } else {
    document.getElementById('user-id').innerText = '--';
    document.getElementById('user-scopes').innerText = '--';
    document.getElementById('auth-response').innerText = '--';
  }
};


/**
 * Retrieves the current user and signed in states from the GoogleAuth
 * object.
 */
var refreshValues = function() {
  if (auth2){
    console.log('Refreshing values...');

    googleUser = auth2.currentUser.get();

    document.getElementById('curr-user-cell').innerText =
      JSON.stringify(googleUser, undefined, 2);
    document.getElementById('signed-in-cell').innerText =
      auth2.isSignedIn.get();

    updateGoogleUser();
  }
}

Was this helpful?
Send feedback
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-06-06 UTC.
GitHub
Fork our samples and try them yourself
Stack Overflow
Ask a question under the google-signin tag
Blog
The latest news on the Google Developers blog
Chromium Blog
The latest news on the Chromium blog.
Product Info
Terms of Service
Branding Guidelines
Help
Sign In With Google
Google Identity
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
Google Sign-In is being deprecated; developers should consult the Deprecation and Sunset guide for more information and migration strategies.
To integrate Google Sign-In, you must create authorization credentials in the Google Developers Console and include the Google Platform Library in your web pages.
You can easily add a Google Sign-In button using a provided HTML snippet and retrieve basic user profile information after sign-in.
For server-side authentication, it is crucial to use ID tokens instead of relying on Google IDs or profile information directly.
Users can sign out of your application without signing out of Google using the provided sign-out method.
outlined_flag
Google Developer Program dialog opened

Skip to main content
Identity
Sign in with Google for Web
/
English
Home
Google Sign-In for Web






























Home
Products
Google Identity
Sign in with Google for Web
Google Sign-In for Web
Was this helpful?
Send feedback
Google Sign-In for server-side apps
bookmark_border
Warning: The Google Sign-In library optionally uses FedCM APIs, and their use will become a requirement. Conduct an impact assessment to confirm that user sign-in continues to function as expected.

Support for the Google Sign-In library is deprecated, see the Deprecation and Sunset guide for more.
To use Google services on behalf of a user when the user is offline, you must use a hybrid server-side flow where a user authorizes your app on the client side using the JavaScript API client and you send a special one-time authorization code to your server. Your server exchanges this one-time-use code to acquire its own access and refresh tokens from Google for the server to be able to make its own API calls, which can be done while the user is offline. This one-time code flow has security advantages over both a pure server-side flow and over sending access tokens to your server.
Important: The Google Sign-In server-side flow differs from the OAuth 2.0 for Web server applications flow.
The sign-in flow for obtaining an access token for your server-side application is illustrated below.

One-time codes have several security advantages. With codes, Google provides tokens directly to your server without any intermediaries. Although we don't recommend leaking codes, they are very hard to use without your client secret. Keep your client secret secret!
Implementing the one-time-code flow
The Google Sign-In button provides both an access token and an authorization code. The code is a one-time code that your server can exchange with Google's servers for an access token.
The following sample code demonstrates how to do the one-time-code flow.
Authenticating Google Sign-In with one-time-code flow requires you to:
Step 1: Create a client ID and client secret
To create a client ID and client secret, create a Google API Console project, set up an OAuth client ID, and register your JavaScript origins:
Go to the Google API Console.
From the project drop-down, select an existing project, or create a new one by selecting Create a new project.
Note: Use a single project to hold all platform instances of your app (Android, iOS, web, etc.), each with a different Client ID.
In the sidebar under "APIs & Services", select Credentials, then click Configure consent screen.
Choose an Email Address, specify a Product Name, and press Save.
In the Credentials tab, select the Create credentials drop-down list, and choose OAuth client ID.
Under Application type, select Web application.
Register the origins from which your app is allowed to access the Google APIs, as follows. An origin is a unique combination of protocol, hostname, and port.
In the Authorized JavaScript origins field, enter the origin for your app. You can enter multiple origins to allow for your app to run on different protocols, domains, or subdomains. You cannot use wildcards. In the example below, the second URL could be a production URL.
http://localhost:8080
https://myproductionurl.example.com


The Authorized redirect URI field does not require a value. Redirect URIs are not used with JavaScript APIs.
Press the Create button.
From the resulting OAuth client dialog box, copy the Client ID. The Client ID lets your app access enabled Google APIs.
Step 2: Include the Google platform library on your page
Include the following scripts that demonstrate an anonymous function that inserts a script into the DOM of this index.html web page.
<!-- The top of file index.html -->
<html itemscope itemtype="http://schema.org/Article">
<head>
  <!-- BEGIN Pre-requisites -->
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js">
  </script>
  <script src="https://apis.google.com/js/client:platform.js?onload=start" async defer>
  </script>
  <!-- END Pre-requisites -->

Step 3: Initialize the GoogleAuth object
Load the auth2 library and call gapi.auth2.init() to initialize the GoogleAuth object. Specify your client ID and the scopes you want to request when you call init().
<!-- Continuing the <head> section -->
  <script>
    function start() {
      gapi.load('auth2', function() {
        auth2 = gapi.auth2.init({
          client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
          // Scopes to request in addition to 'profile' and 'email'
          //scope: 'additional_scope'
        });
      });
    }
  </script>
</head>
<body>
  <!-- ... -->
</body>
</html>

Step 4: Add the sign-in button to your page
Add the sign-in button to your web page, and attach a click handler to call grantOfflineAccess() to start the one-time-code flow.
<!-- Add where you want your sign-in button to render -->
<!-- Use an image that follows the branding guidelines in a real app -->
<button id="signinButton">Sign in with Google</button>
<script>
  $('#signinButton').click(function() {
    // signInCallback defined in step 6.
    auth2.grantOfflineAccess().then(signInCallback);
  });
</script>

Step 5: Sign in the user
The user clicks the sign-in button and grants your app access to the permissions that you requested. Then, the callback function that you specified in the grantOfflineAccess().then() method is passed a JSON object with an authorization code. For example:
{"code":"4/yU4cQZTMnnMtetyFcIWNItG32eKxxxgXXX-Z4yyJJJo.4qHskT-UtugceFc0ZRONyF4z7U4UmAI"}

Step 6: Send the authorization code to the server
The code is your one-time code that your server can exchange for its own access token and refresh token. You can only obtain a refresh token after the user has been presented an authorization dialog requesting offline access. If you've specified the select-account prompt in the OfflineAccessOptions in step 4, you must store the refresh token that you retrieve for later use because subsequent exchanges will return null for the refresh token. This flow provides increased security over your standard OAuth 2.0 flow.
Access tokens are always returned with the exchange of a valid authorization code.
The following script defines a callback function for the sign-in button. When a sign-in is successful, the function stores the access token for client-side use and sends the one-time code to your server on the same domain.
<!-- Last part of BODY element in file index.html -->
<script>
function signInCallback(authResult) {
  if (authResult['code']) {

    // Hide the sign-in button now that the user is authorized, for example:
    $('#signinButton').attr('style', 'display: none');

    // Send the code to the server
    $.ajax({
      type: 'POST',
      url: 'http://example.com/storeauthcode',
      // Always include an `X-Requested-With` header in every AJAX request,
      // to protect against CSRF attacks.
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      contentType: 'application/octet-stream; charset=utf-8',
      success: function(result) {
        // Handle or verify the server response.
      },
      processData: false,
      data: authResult['code']
    });
  } else {
    // There was an error.
  }
}
</script>

Step 7: Exchange the authorization code for an access token
On the server, exchange the auth code for access and refresh tokens. Use the access token to call Google APIs on behalf of the user and, optionally, store the refresh token to acquire a new access token when the access token expires.
If you requested profile access, you also get an ID token that contains basic profile information for the user.
For example:
Java
Python
// (Receive authCode via HTTPS POST)


if (request.getHeader("X-Requested-With") == null) {
  // Without the `X-Requested-With` header, this request could be forged. Aborts.
}

// Set path to the Web application client_secret_*.json file you downloaded from the
// Google API Console: https://console.cloud.google.com/apis/credentials
// You can also find your Web application client ID and client secret from the
// console and specify them directly when you create the GoogleAuthorizationCodeTokenRequest
// object.
String CLIENT_SECRET_FILE = "/path/to/client_secret.json";

// Exchange auth code for access token
GoogleClientSecrets clientSecrets =
    GoogleClientSecrets.load(
        JacksonFactory.getDefaultInstance(), new FileReader(CLIENT_SECRET_FILE));
GoogleTokenResponse tokenResponse =
          new GoogleAuthorizationCodeTokenRequest(
              new NetHttpTransport(),
              JacksonFactory.getDefaultInstance(),
              "https://oauth2.googleapis.com/token",
              clientSecrets.getDetails().getClientId(),
              clientSecrets.getDetails().getClientSecret(),
              authCode,
              REDIRECT_URI)  // Specify the same redirect URI that you use with your web
                             // app. If you don't have a web version of your app, you can
                             // specify an empty string.
              .execute();

String accessToken = tokenResponse.getAccessToken();

// Use access token to call API
GoogleCredential credential = new GoogleCredential().setAccessToken(accessToken);
Drive drive =
    new Drive.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance(), credential)
        .setApplicationName("Auth Code Exchange Demo")
        .build();
File file = drive.files().get("appfolder").execute();

// Get profile info from ID token
GoogleIdToken idToken = tokenResponse.parseIdToken();
GoogleIdToken.Payload payload = idToken.getPayload();
String userId = payload.getSubject();  // Use this value as a key to identify a user.
String email = payload.getEmail();
boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
String name = (String) payload.get("name");
String pictureUrl = (String) payload.get("picture");
String locale = (String) payload.get("locale");
String familyName = (String) payload.get("family_name");
String givenName = (String) payload.get("given_name");
Was this helpful?
Send feedback
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-06-06 UTC.
GitHub
Fork our samples and try them yourself
Stack Overflow
Ask a question under the google-signin tag
Blog
The latest news on the Google Developers blog
Chromium Blog
The latest news on the Chromium blog.
Product Info
Terms of Service
Branding Guidelines
Help
Sign In With Google
Google Identity
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
Google Sign-In is being deprecated; developers should consult the Deprecation and Sunset guide for more information and migration strategies.
To integrate Google Sign-In, you must create authorization credentials in the Google Developers Console and include the Google Platform Library in your web pages.
You can easily add a Google Sign-In button using a provided HTML snippet and retrieve basic user profile information after sign-in.
For server-side authentication, it is crucial to use ID tokens instead of relying on Google IDs or profile information directly.
Users can sign out of your application without signing out of Google using the provided sign-out method.
outlined_flag
Google Developer Program dialog opened

Skip to main content
Identity
Sign in with Google for Web
/
English
Home
Google Sign-In for Web






























Home
Products
Google Identity
Sign in with Google for Web
Google Sign-In for Web
Was this helpful?
Send feedback
Disconnecting and revoking scopes
bookmark_border
Warning: The Google Sign-In library optionally uses FedCM APIs, and their use will become a requirement. Conduct an impact assessment to confirm that user sign-in continues to function as expected.

Support for the Google Sign-In library is deprecated, see the Deprecation and Sunset guide for more.
It is recommended that your app provide a way to delete the association between your app and a user's account. By adding this capability to your app, you can respond to the event and trigger any appropriate logic such as deleting personal information associated with the account.
The following JavaScript example demonstrates how to revoke a user's scopes programmatically.
var revokeAllScopes = function() {
  gapi.auth2.getAuthInstance().disconnect();
}

Was this helpful?
Send feedback
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-06-06 UTC.
GitHub
Fork our samples and try them yourself
Stack Overflow
Ask a question under the google-signin tag
Blog
The latest news on the Google Developers blog
Chromium Blog
The latest news on the Chromium blog.
Product Info
Terms of Service
Branding Guidelines
Help
Sign In With Google
Google Identity
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
Google Sign-In is being deprecated; developers should consult the Deprecation and Sunset guide for more information and migration strategies.
To integrate Google Sign-In, you must create authorization credentials in the Google Developers Console and include the Google Platform Library in your web pages.
You can easily add a Google Sign-In button using a provided HTML snippet and retrieve basic user profile information after sign-in.
For server-side authentication, it is crucial to use ID tokens instead of relying on Google IDs or profile information directly.
Users can sign out of your application without signing out of Google using the provided sign-out method.
outlined_flag
Google Developer Program dialog opened

Skip to main content
Identity
Sign in with Google for Web
/
English
Home
Google Sign-In for Web






























Home
Products
Google Identity
Sign in with Google for Web
Google Sign-In for Web
Was this helpful?
Send feedback
Disconnecting and revoking scopes
bookmark_border
Warning: The Google Sign-In library optionally uses FedCM APIs, and their use will become a requirement. Conduct an impact assessment to confirm that user sign-in continues to function as expected.

Support for the Google Sign-In library is deprecated, see the Deprecation and Sunset guide for more.
It is recommended that your app provide a way to delete the association between your app and a user's account. By adding this capability to your app, you can respond to the event and trigger any appropriate logic such as deleting personal information associated with the account.
The following JavaScript example demonstrates how to revoke a user's scopes programmatically.
var revokeAllScopes = function() {
  gapi.auth2.getAuthInstance().disconnect();
}

Was this helpful?
Send feedback
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-06-06 UTC.
GitHub
Fork our samples and try them yourself
Stack Overflow
Ask a question under the google-signin tag
Blog
The latest news on the Google Developers blog
Chromium Blog
The latest news on the Chromium blog.
Product Info
Terms of Service
Branding Guidelines
Help
Sign In With Google
Google Identity
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
Google Sign-In is being deprecated; developers should consult the Deprecation and Sunset guide for more information and migration strategies.
To integrate Google Sign-In, you must create authorization credentials in the Google Developers Console and include the Google Platform Library in your web pages.
You can easily add a Google Sign-In button using a provided HTML snippet and retrieve basic user profile information after sign-in.
For server-side authentication, it is crucial to use ID tokens instead of relying on Google IDs or profile information directly.
Users can sign out of your application without signing out of Google using the provided sign-out method.
outlined_flag
Google Developer Program dialog opened

Skip to main content
Identity
Sign in with Google for Web
/
English
Home
Google Sign-In for Web






























Home
Products
Google Identity
Sign in with Google for Web
Google Sign-In for Web
Was this helpful?
Send feedback
Cross-platform single sign-in
bookmark_border
Warning: The Google Sign-In library optionally uses FedCM APIs, and their use will become a requirement. Conduct an impact assessment to confirm that user sign-in continues to function as expected.

Support for the Google Sign-In library is deprecated, see the Deprecation and Sunset guide for more.
When a user signs in with their Google Account in a web browser or on an Android device, they can be seamlessly signed in across web browsers and Android devices using the same Google Account. This feature allows users to get the best experience out of multiple devices by making it easier for them to sign in to your service.
When the button is loaded on the web, it immediately checks to see if the user has authorized the application. This check is called "immediate mode" and if successful, the Google servers return an access token and pass a new authorization result object to the callback. If the button cannot make an immediate-mode authorization, the user must click the sign-in button to trigger the access flow.
To enable cross-platform single sign-on:
The Android and web app must be registered in the same Google API Console project.
The requested scopes on each platform must match the scopes from other platforms.
Cross-platform single sign-on works for the user when the following requirements are met:
The user is signed in to Google in the browser or on the Android device.
The user has previously authorized your app for the same scopes.
This experience is similar to when a user opens an Android app the second time. If the user previously authorized the app, then the user remains signed in: users don't click the sign-in button every time they open the app.
When a user is seamlessly signed in, Google displays a reminder that they are logged in using their Google Account. This reminder only appears once per device.
Was this helpful?
Send feedback
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-06-06 UTC.
GitHub
Fork our samples and try them yourself
Stack Overflow
Ask a question under the google-signin tag
Blog
The latest news on the Google Developers blog
Chromium Blog
The latest news on the Chromium blog.
Product Info
Terms of Service
Branding Guidelines
Help
Sign In With Google
Google Identity
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
Google Sign-In is being deprecated; developers should consult the Deprecation and Sunset guide for more information and migration strategies.
To integrate Google Sign-In, you must create authorization credentials in the Google Developers Console and include the Google Platform Library in your web pages.
You can easily add a Google Sign-In button using a provided HTML snippet and retrieve basic user profile information after sign-in.
For server-side authentication, it is crucial to use ID tokens instead of relying on Google IDs or profile information directly.
Users can sign out of your application without signing out of Google using the provided sign-out method.
outlined_flag
Google Developer Program dialog opened

Skip to main content
Identity
Sign in with Google for Web
/
English
Home
Google Sign-In for Web






























Home
Products
Google Identity
Sign in with Google for Web
Google Sign-In for Web
Was this helpful?
Send feedback
Troubleshooting
bookmark_border
Warning: The Google Sign-In library optionally uses FedCM APIs, and their use will become a requirement. Conduct an impact assessment to confirm that user sign-in continues to function as expected.

Support for the Google Sign-In library is deprecated, see the Deprecation and Sunset guide for more.
Supported environments
Google Sign-In officially supports the following browsers and platforms:
Google Chrome on macOS, Windows, Linux, Android, iOS
Mozilla Firefox on macOS, Windows, Linux
Safari on macOS and iOS
Internet Explorer versions from 8 to 11 on Windows
Microsoft Edge on Windows
Known issues
Third-party cookies and data blocked
When enabled, this privacy feature deactivates all cookies and storage within the iframe, which is required by Google to securely authenticate the user.
One solution is to request users who have disabled third-party data to create an exception for https://accounts.google.com by adding accounts.google.com to the allowed domains. In Chrome, this is done in chrome://settings/content/cookies.
If many of your users have this feature enabled (some companies enforce this setting for all their employees), another workaround is to implement a server-side OAuth 2.0 flow.
Chrome on iOS in Incognito Mode
Google Sign-in is currently not supported in incognito mode on Chrome on iOS.
Safari with Intelligent Tracking Prevention
This new feature of macOS High Sierra and iOS 11 deactivates third-party cookies every 24 hours, unless the user interacts with one of the page of the domain of the third-party. As the Google Sign-in library relies on cookies to securely authenticate the user, it will potentially detect that the user is logged out every 24 hours. The user has to go through the sign in flow again to reactivate the cookies.
Any other issue?
Please go to our GitHub issue tracker for any other issue with the Google Sign-In library.
Was this helpful?
Send feedback
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-06-06 UTC.
GitHub
Fork our samples and try them yourself
Stack Overflow
Ask a question under the google-signin tag
Blog
The latest news on the Google Developers blog
Chromium Blog
The latest news on the Chromium blog.
Product Info
Terms of Service
Branding Guidelines
Help
Sign In With Google
Google Identity
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
Google Sign-In is being deprecated; developers should consult the Deprecation and Sunset guide for more information and migration strategies.
To integrate Google Sign-In, you must create authorization credentials in the Google Developers Console and include the Google Platform Library in your web pages.
You can easily add a Google Sign-In button using a provided HTML snippet and retrieve basic user profile information after sign-in.
For server-side authentication, it is crucial to use ID tokens instead of relying on Google IDs or profile information directly.
Users can sign out of your application without signing out of Google using the provided sign-out method.
outlined_flag
Google Developer Program dialog opened

Skip to main content
Identity
Sign in with Google for Web
/
English
Home
Google Sign-In for Web
























































Home
Products
Google Identity
Sign in with Google for Web
Google Sign-In for Web
Was this helpful?
Send feedback
Google Sign-in with FedCM APIs
bookmark_border
Warning: The Google Sign-In library optionally uses FedCM APIs, and their use will become a requirement. Conduct an impact assessment to confirm that user sign-in continues to function as expected.

Support for the Google Sign-In library is deprecated, see the Deprecation and Sunset guide for more.Caution: If your site uses a cross-origin iframe for sign-in, set use_fedcm to false as Chrome feature support is only available in August 2025 as part of the M139 stable release.
This guide discusses the adoption of FedCM APIs by the Google Sign-in platform library. Topics include the Timeline and Next Steps for a backward compatible update to the library, how to Conduct an impact assessment and verify user sign-in continues to function as expected, and if needed, instructions for updating your web app. Options to Manage the transition period along with how to Get help are also covered.
Status of the library
Any new web apps are blocked from using the deprecated Google Sign-in platform library, while apps using the library can continue until further notice. A final sunset date (shutdown) for the library has not been established. See Deprecation of support and sunset for more.
A backward compatible update adds FedCM APIs to the Google Sign-In library. While most changes are seamless, the update introduces differences to user prompts, iframe permissions-policy, and Content Security Policy (CSP). These changes may affect your web app and require changes to application code and site configuration.
During the transition period a configuration option controls whether or not FedCM APIs are used during user sign-in.
After the transition period, FedCM APIs are mandatory for all web apps using the Google Sign-In library.
Timeline
Last updated April 2025
These are the dates and changes that affect user sign-in behavior:
March 2023 Deprecation of support for the Google Sign-in platform library.
July 2024 Transition period begins, and Google Sign-in platform library support for FedCM APIs is added. By default, Google controls the percentage of user sign-in requests using FedCM during this time and web apps may explicitly override this behavior with the use_fedcm parameter.
August 2025 Mandatory adoption of FedCM APIs by the Google Sign-in platform library.
Next steps
There are three options you may choose to follow:
Conduct an impact assessment, and if needed, update your web app. This approach evaluates if features that require changes to your web app are in use. Instructions are provided in the next section of this guide.
Move to Google Identity Services (GIS) library. Moving to the latest and supported sign-in library is strongly recommended. Do this by following these instructions.
Do nothing. Your web app will automatically be updated when the Google Sign-in library moves to FedCM APIs for user sign-in. This is the least work, but there is some risk of users being unable to sign-in to your web app.
Conduct an impact assessment
Follow these instructions to determine if your web app can be seamlessly updated through a backward compatible update or if changes are necessary to avoid users being unable to sign-in when the Google Sign-in platform library fully adopts FedCM APIs.
Setup
Browser APIs and the latest version of the Google Sign-in platform library are necessary to use FedCM during user sign-in.
Before going further:
Update to the latest version of Chrome for Desktop. Chrome for Android requires release M128 or later and cannot be tested using earlier versions.
Set use_fedcm to true when initializing the Google Sign-in platform library in your web app. Typically, JavaScript initialization looks like:
gapi.client.init({use_fedcm: true}), or
gapi.auth2.init({use_fedcm: true}), or
gapi.auth2.authorize({use_fedcm: true}).
Alternatively, a meta tag can be used to enable FedCM in HTML:
<meta name="google-signin-use_fedcm" content="true">
Invalidate cached versions of the Google Sign-in platform library. Usually this step is unnecessary as the latest version of the library is directly downloaded to the browser by including api.js, client.js, or platform.js in a <script src> tag (the request may use any of these bundle names for the library).
Confirm OAuth settings for your OAuth client ID:
Open the Credentials page of the Google API Console
Verify the URI of your website is included in Authorized JavaScript origins. The URI includes the scheme and fully qualified hostname only. For example, https://www.example.com.
Key Point: For local tests or development add both http://localhost and http://localhost:<port_number>.
Optionally, credentials may be returned using a redirect to an endpoint you host rather than through a JavaScript callback. If this is the case, verify your redirect URIs are included in Authorized redirect URIs. Redirect URIs include the scheme, fully qualified hostname, and path and must comply with Redirect URI validation rules. For example, https://www.example.com/auth-receiver.
Key Point: When testing using http and localhost set the Referrer-Policy header in your web app to Referrer-Policy: no-referrer-when-downgrade.
Testing
After following the instructions in Setup:
Close all existing Chrome Incognito windows, and open a new Incognito window. Doing this clears any cached content or cookies.
Load your user sign-in page and attempt to sign-in.
Follow the instructions in these sections of this guide to identify and fix known issues:
Locate the Google Sign-in library request
Check iframe permissions-policy
Check Content Security Policy
Check for user prompt changes
Look for any errors or warnings in the Console related to the Google Sign-in library.
Repeat this process until no errors occur and you can successfully sign-in. You can verify a successful sign-in by confirming BasicProfile.getEmail() returns your email address and that GoogleUser.isSignedIn() is True.
Locate the Google Sign-in library request
Check if permissions-policy and Content Security Policy changes are necessary by inspecting the request for the Google Sign-in platform library. To do this, locate the request using the name and origin of the library:
In Chrome, Open the DevTools Network panel and reload the page.
Use the values in the Domain and Name columns to locate the library request:
Domain is apis.google.com and
Name is either api.js, client.js, or platform.js. The specific value of Name depends upon the library bundle requested by the document.
For example, filter on apis.google.com in the Domain column and platform.js in the Name column.
Check iframe permissions-policy
Caution: If your site uses a cross-origin iframe for sign-in, set use_fedcm to false as Chrome feature support is only available in August 2025 as part of the M139 stable release.
Your site might use the Google Sign-in platform library inside a cross-origin iframe. If so, an update is needed.
After following the Locate the Google Sign-in library request instructions, select the Google Sign-in library request in the DevTools Network panel and locate the Sec-Fetch-Site header in the Request Headers section in the Headers tab. If the value of the header is:
same-siteor same-origin then cross-origin policies don't apply and no changes are needed.
cross-site changes may be necessary if an iframe is being used.
To confirm if an iframe is present:
Select the Elements panel in Chrome DevTools, and
Use Ctrl-F to find an iframe in the document.
If an iframe is found, inspect the document to check for calls to gapi.auth2 functions or script src directives which load the Google Sign-in library within the iframe. If this is the case:
Add the allow="identity-credentials-get" permissions policy to the parent iframe.
Repeat this process for every iframe in the document. iframes can be nested, so be sure to add the allow directive to all surrounding parent iframes.
Check Content Security Policy
If your site uses a Content Security Policy, you may need to update your CSP to allow use of the Google Sign-in library.
After following the Locate the Google Sign-in library request instructions, select the Google Sign-in library request in the DevTools Network panel and locate the Content-Security-Policy header in the Response Headers section of the Headers tab.
If the header is not found, no changes are necessary. Otherwise, check if any of these CSP directives are defined in the CSP header and update them by:
Adding https://apis.google.com/js/, https://accounts.google.com/gsi/, and https://acounts.google.com/o/fedcm/ to any connect-src, default-src, or frame-src directives.
Adding to https://apis.google.com/js/bundle-name.js to the script-src directive. Replace bundle-name.js with either api.js, client.js, or platform.jsbased upon the library bundle the document requests.
Check for user prompt changes
There are some differences to user prompt behavior, FedCM adds a modal dialog displayed by the browser and updates user activation requirements.
Key Point: Consent is per browser instance, so using Chrome on a different device also requires a one-time consent regardless if users have previously done so on a different device.
Modal dialog

Inspect the layout of your site to confirm that underlying content can be safely overlaid and temporarily obscured by the browser's modal dialog. If this is not the case you may need to adjust the layout or position of some elements of your website.
Note: The size and position of the modal dialog is not available within the JavaScript runtime environment.
User activation
FedCM includes updated user activation requirements. Pressing a button or clicking on a link are examples of user gestures that allow third-party origins to make network requests or to store data. With FedCM, the browser prompts for user consent when:
a user first signs-in to a web app using a new browser instance, or
GoogleAuth.signIn is called.
Today, if the user has signed in to your website before, you are able to obtain the user's sign in information when initializing the Google Sign-In library using gapi.auth2.init, without further user interactions. This is no longer possible unless the user has first gone through the FedCM sign in flow at least once.
By opting in to FedCM and calling GoogleAuth.signIn, the next time the same user visits your website, gapi.auth2.init can obtain the user's sign in information during initialization without user interaction.
Key Point: A user gesture and consent prompt is required the first time GoogleAuth.signIn is called, even if this is occurs within a document onload event.
Common use cases
Developer documentation for the Google Sign-In library includes guides and code samples for common use cases. This section discusses how FedCM affects their behavior.
Integrating Google Sign-In into your web app
In this demo, a <div> element and a class render the button, and for already signed-in users, the page onload event returns user credentials. User interaction is required to sign-in and establish a new session.
Library initialization is done by the g-signin2 class which calls gapi.load and gapi.auth2.init.
A user gesture, a <div> element onclick event, calls auth2.signIn during sign-in or auth2.signOut on sign-out.
Building a custom Google Sign-In button
In demo one, custom attributes are used to control the appearance of the sign-in button and for already signed-in users, the page onload event returns user credentials. User interaction is required to sign-in and establish a new session.
Library initialization is done through an onload event for the platform.js library and the button is displayed by gapi.signin2.render.
A user gesture, pressing the sign-in button, calls auth2.signIn.
In demo two, a <div> element, CSS styles, and a custom graphic are used to control the appearance of the sign-in button. User interaction is required to sign-in and establish a new session.
Library initialization is done on document load using a start function which calls gapi.load, gapi.auth2.init, and gapi.auth2.attachClickHandler.
A user gesture, a <div> element onclick event, calls auth2.signIn using the auth2.attachClickHandler during sign-in or auth2.signOut on sign-out.
Monitoring the user's session state
In this demo, a button press is used for user sign-in and sign-out. User interaction is required to sign-in and establish a new session.
Library initialization is done by directly calling gapi.load, gapi.auth2.init, and gapi.auth2.attachClickHandler() after platform.js is loaded using script src.
A user gesture, a <div> element onclick event, calls auth2.signIn using the auth2.attachClickHandler during sign-in or auth2.signOut on sign-out.
Requesting additional permissions
In this demo, a button press is used to request additional OAuth 2.0 scopes, obtain a new access token, and for already signed-in users, the page onload event returns user credentials. User interaction is required to sign-in and establish a new session.
Library initialization is done by the onload event for the platform.js library through a call to gapi.signin2.render.
A user gesture, clicking on a <button> element, triggers a request for additional OAuth 2.0 scopes using googleUser.grant or auth2.signOut on sign-out.
Integrating Google Sign-In using listeners
In this demo, for already signed-in users, the page onload event returns user credentials. User interaction is required to sign-in and establish a new session.
Library initialization is done on document load using a start function which calls gapi.load, gapi.auth2.init, and gapi.auth2.attachClickHandler. Next, auth2.isSignedIn.listen and auth2.currentUser.listen are used to setup notification of changes to session state. Lastly, auth2.SignIn is called to return credentials for signed-in users.
A user gesture, a <div> element onclick event, calls auth2.signIn using the auth2.attachClickHandler during sign-in or auth2.signOut on sign-out.
Google Sign-In for server-side apps
In this demo, a user gesture is used to request an OAuth 2.0 auth code and a JS callback makes an AJAX call to send the response to the backend server for verification.
Library initialization is done using an onload event for the platform.js library, which uses a start function to call gapi.load and gapi.auth2.init.
A user gesture, clicking on a <button> element, triggers a request for an authorization code by calling auth2.grantOfflineAccess.
Cross platform SSO
FedCM requires consent for every browser instance, even if Android users have already signed in, a one time consent is necessary.
Manage the transition period
During the transition period a percentage of user sign-ins may use FedCM, the exact percentage can vary and may change over time. By default, Google controls how many sign-in requests use FedCM, but you may choose to opt-in or opt-out of using FedCM during the transition period. At the end of the transition period FedCM becomes mandatory and is used for all sign-in requests.
Choosing to opt-in sends the user through the FedCM sign-in flow, while choosing to opt-out sends the users through the existing sign-in flow. This behavior is controlled using the use_fedcm parameter.
Opt-in
It may be helpful to control whether all, or some, sign-in attempts to your site use FedCM APIs. To do this, set use_fedcm to true when initializing the platform library. The user sign-in request uses FedCM APIs in this case.
Opt-out
During the transition period, a percentage of user sign-in attempts to your site will use FedCM APIs by default. If more time is needed to make changes to your app, you may temporarily opt-out of using FedCM APIs. To do this, set use_fedcm to false when initializing the platform library. The user sign-in request won't use FedCM APIs in this case.
After mandatory adoption occurs, any use_fedcm settings are ignored by the Google Sign-in platform library.
Get help
Search or ask questions on StackOverflow using the google-signin tag.
Was this helpful?
Send feedback
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-06-06 UTC.
GitHub
Fork our samples and try them yourself
Stack Overflow
Ask a question under the google-signin tag
Blog
The latest news on the Google Developers blog
Chromium Blog
The latest news on the Chromium blog.
Product Info
Terms of Service
Branding Guidelines
Help
Sign In With Google
Google Identity
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
Google Developer Program dialog opened
Skip to main content
Google Cloud Platform Console
Google Auth Platform
Manage OAuth Clients
Manage OAuth Clients
Your OAuth client is the credential which your application uses when making calls to Google OAuth 2.0 endpoint to receive an access token or ID token. After creating your OAuth client, you will receive a client ID and sometimes, a client secret.
Think of your client ID like your app's unique username when it needs to request an access token or ID token from Google's OAuth 2.0 endpoint. This ID helps Google identify your app and ensure that only authorized applications can access user data.
Client ID and Client Secret
Similar to how you would use a username and password to log to online services, many applications use a client ID paired with a client secret. The client secret adds an extra layer of security, acting like your app's password.
Applications are categorized as either public or private clients:
Private Clients: These apps, like web server applications, can securely store the client secret because they run on servers you control.
Public Clients: Native apps or JavaScript-based apps fall under this category. They cannot securely store secrets, as they reside on user devices and as such do not use client secrets. 
To create an OAuth 2.0 client ID in the console: 
Navigate to the Google Auth Platform Clients page. 
You will be prompted to create a project if you do not have one selected. 
You will be prompted to register your application to use Google Auth if you are yet to do so. This is required before creating a client.   
Click CREATE CLIENT
Select the appropriate application type for your application and enter any additional information required. Application types are described in more detail in the following sections.
Fill out the required information for the select client type and click the CREATE button to create the client.
Note: Your application's client secret will only be shown after you create the client. Store this information in a secure place such as Google Cloud Secret Manager because it will not be visible or accessible again. Learn more.
Application types
 
Web Applications
Native Applications (Android, iOS, Desktop, UWP, Chrome Extensions, TV and Limited Input)
Delete OAuth Clients
To delete a client ID, go to the Clients page, check the box next to the ID you want to delete, and then click the DELETE button.
Before deleting a Client ID, ensure to check the ID is not in use by monitoring your traffic in the overview page.  
You can restore deleted clients within 30 days of the deletion. To restore a recently deleted client, navigate to the Deleted credentials page to find a list of clients you recently deleted and click the RESTORE button for the client you want to restore.  
Any client deleted over 30 days ago cannot be restored and is permanently deleted. 
Note : Clients can also be automatically deleted if they become inactive. Learn more.
Rotating your clients secrets
Client secrets or credentials should be treated with extreme care as described in the OAuth 2.0 policies, because they allow anyone who has them to use your app's identity to gain access to user information. With the client secret rotation feature, you can add a new secret to your OAuth client configuration, migrate to the new secret while the old secret is still usable, and disable the old secret afterwards. This is useful when the client secret has been inadvertently disclosed or leaked. This also ensures good security practices by occasionally rotating your secrets without causing downtime of your app. In addition, Google started to issue more secure client secrets recommended by RFC 6749 in 2021. While apps that were created earlier are able to continue using the old secrets, we recommend that you migrate to the new secret with this rotation feature. 
To rotate your client secret, please follow the following steps:
Step 1: Create a new client secret
Go to the Google Auth Platform Clients page.
If it's not already selected, select the project that you want to update.
From the list of OAuth 2.0 Client IDs, click the client you want to generate a new client secret for.
On the client details page, click Add Secret on the right side to add a new secret. 
A new secret will appear below the old secret. You can also differentiate them by the secret creation time. The new secret will be in "Enabled" state and ready to be used.
Note 1: Both secrets can be used until you manually disable them. You must update your app to use the new secret and disable the old one as soon as possible after creating it to minimize security risks.   
Note 2: You can only have two client secrets at maximum. If the client already has two secrets, to create a new secret, you must first disable and delete an existing secret.
Step 2: Configure your app to use the new secret
Next, update your app to use the new secret. Remember to handle your client secrets securely as described in the OAuth 2.0 policies.
You need to monitor your app and make sure the new secret has fully taken effect. In other words, make sure the old secret is not used anywhere in your app. Check the metrics and configurations used by your app to confirm that only the new client secret is used, for example: 
References in code or configurations.
Your app or server logs.
The rollout status of your updated app version or configuration.
Any other metrics you may have.
Step 3: Disable the old secret
Having more than one enabled secrets for a client increases security risks. Once you confirm that your app has fully migrated to the new secret per the instructions in Step 2, you must disable the old secret. 
Go to the Google Auth Platform Clients page.
From the list of OAuth 2.0 Client IDs, click the client you want to update.
Find the old secret you want to disable. Generally it should be the one with the earlier creation time.
Click Disable on the right side. The old secret will be invalid shortly.
Note: A disabled client secret will be rejected in OAuth flows. You are expected to continuously monitor your app and see if it’s working properly. In case you notice the app is failing because it is still using the old secret, you may click Enable to reinstate the secret on your client details page in the Google Auth Platform Clients page. In this case, you should redo this step after completing the migration.  
Step 4: Delete the old secret
Once you've confirmed that your app is working seamlessly with the new client secret, you are safe to delete the disabled old secret. To delete the secret, click the delete button next to it. Note that this cannot be undone.
 
Unused Client Deletion
OAuth 2.0 clients that have been inactive for six months are automatically deleted. This mitigates risks associated with unused client credentials, such as potential app impersonation or unauthorized data access if credentials are compromised.
An OAuth 2.0 client is considered unused if neither of the following actions have occurred within the past six months:
The client has not been used for any credential or token request via the Google OAuth2.0 endpoint.
The client's settings have not been modified programmatically or manually within the Google Cloud Console. Examples of modifications include changing the client name, rotating the client secret, or updating redirect URIs.
You will receive an email notification 30 days before an inactive client is scheduled for deletion. To prevent the automatic deletion of a client you still require, ensure it is used for an authorization or authorization request before the 30 days elapses. 
A notification will also be sent after the client has been successfully deleted.
Note : You should only take action to prevent deletion if you actively require the client. Keeping unused clients active unnecessarily increases security risk for your application. If you determine a client is no longer needed, delete it yourself via the Google Auth Platform Clients page. Do not wait for the automatic deletion process.
Once an OAuth 2.0 client is deleted:
It can no longer be used for Sign in with Google or for authorization for data access.
Calls to Google APIs using existing access tokens or refresh tokens associated with the deleted client will fail.
Attempts to use the deleted client ID in authorization requests will result in a deleted_client error.
Deleted clients are typically recoverable at least 30 days following deletion. To restore a deleted client, navigate to the Deleted Credentials page. Only restore a client if you have a confirmed, ongoing need for it.   

To ensure that you receive these notifications and others related to your app, review your contact information settings.
 
Client Secret Handling and Visibility
Note: This feature is currently available for new clients created after June 2025 and will be extended to existing clients at a later date.
In April 2025, we announced that client secrets for OAuth 2.0 clients are only visible and downloadable from the Google Cloud Console at the time of their creation. 
Client secrets add a critical layer of security to your OAuth 2.0 client ID, functioning similarly to a password for your application. Protecting these secrets is important for maintaining application security and privacy. To prevent accidental exposure and increase protection, client secrets are hashed. This means you will only be able to view and download the full client secret once, at the time of its creation.
It is important that you download your OAuth 2.0 client secrets immediately upon creation and store them in a secure manner, for example in a secret manager such as Google Cloud Secret Manager.
After the initial creation, the Google Cloud Console will only display the last four characters of the client secret. This truncated version is provided solely for identification purposes, allowing you to distinguish between your client secrets. If you lose your client secret, you can use the client secret rotation feature to get a new one.
Best Practices for Client Secret Management
Never add client secrets directly in your code or check them into version control systems such as Git or Subversion. 
Do not share client secrets in public forums, email, or other insecure communication channels.
Store client secrets securely using a dedicated secret management service like Google Cloud Secret Manager or a similar secure storage solution.
Rotate client secrets periodically and change immediately in the case of a leak.
Manage client's brand configuration
Authorized Domains
Review how to manage authorized domains in the Branding section of the Google Auth Platform. 
User Type
Review how to manage target audience for your app in the Audience section of the Google Auth Platform. 
Give feedback about this article
Was this helpful?YesNo
Google Auth Platform
Get started with the Google Auth Platform
Google Auth Platform Overview
Manage App Audience
Manage OAuth App Branding
Manage OAuth Clients
Manage App Data Access
©2025 Google
  Privacy Policy
  Terms of Service
Language
 Deutsch‎español‎français‎português (Brasil)‎русский‎中文（简体）‎中文（繁體）‎日本語‎한국어‎ English‎ 










Skip to main content
API Console
Setting up OAuth 2.0
To use OAuth 2.0 in your application, you need an OAuth 2.0 client ID, which your application uses when requesting an OAuth 2.0 access token.
To create an OAuth 2.0 client ID in the console: 
Go to the API Console.
From the projects list, select a project or create a new one.
If the APIs & services page isn't already open, open the console left side menu and select APIs & services.
On the left, click Credentials.
Click New Credentials, then select OAuth client ID.
Note: If you're unsure whether OAuth 2.0 is appropriate for your project, select Help me choose and follow the instructions to pick the right credentials.
Select the appropriate application type for your project and enter any additional information required. Application types are described in more detail in the following sections.
If this is your first time creating a client ID, you can also configure your consent screen by clicking Consent Screen. (The following procedure explains how to set up the Consent screen.) You won't be prompted to configure the consent screen after you do it the first time.
Click Create client ID
To delete a client ID, go to the Credentials page, check the box next to the ID, and then click Delete.
User consent
When you use OAuth 2.0 for authentication, your users are authenticated after they agree to terms that are presented to them on a user consent screen. Google verifies public applications that use OAuth 2.0 and meet one or more of the verification criteria.
Learn more about public versus internal applications below. For more information about the verification process, see the OAuth Application Verification FAQ.
If your application uses sensitive scopes without verification, the unverified app screen displays before the consent screen for users who are outside of your G Suite organization. To remove the unverified app screen, you can request OAuth developer verification by our team when you complete the Google API Console OAuth consent screen page.
To set up your project's consent screen and request verification:
Go to the Google API Console OAuth consent screen page.
Add required information like a product name and support email address.
Click Add Scope.
On the dialog that appears, select the scopes your project uses. Sensitive scopes display a lock icon next to the API name.
To select scopes for registration, you need to enable the API, like Drive or Gmail, from APIs & Services > API Library.
You must select all scopes used by the project. 
When you're finished adding details to the OAuth consent screen, click Submit for verification.
A Verification required window displays.
Add scopes justification, a contact email address, and any other information that can help the team with verification, then click Submit.
Note: The consent screen settings within the console are set at the project level, so the information that you specify on the Consent screen page applies across the entire project.
When a project goes through verification, the current status displays under Verification status:
Not Published: your OAuth consent screen is not published and verification is not required for use.
Needs Verification: an OAuth developer verification is needed. To start the verification process, click Submit for Verification. For information about when verification is required, see the FAQ "When does my app have to be verified by Google?".
Being verified: an OAuth developer verification is in progress.
Published: your OAuth consent screen passed the verification and your project is verified.
Failed verification: your OAuth consent screen didn't pass the verification. Your last approved consent screen is still in use. You'll receive more information at the contact email you provided.
For more information about user authentication, see the OAuth 2.0 documentation.
Public and internal applications
A public application allows access to users outside of your organization (@your-organization.com).
Access can be from consumer accounts, like @gmail.com, or other organizations, like @partner-organization.com.
Public applications need to go through verification as detailed above.
An internal application will only allow access to users from your organization (@your-organization.com).
For more information about setting up organizations and organization access, see the GCP Organizations documentation.
Authorized domains
To protect you and your users, Google restricts your OAuth 2.0 application to using Authorized Domains. If you have verified the domain with Google, you can use any Top Private Domain as an Authorized Domain.
After you add an Authorized Domain, you can use any of its subdomains or pages, and any other associated country codes.
Add your Authorized Domains before you add your redirect or origin URIs, your homepage URL, your terms of service URL, or your privacy policy URL.
Service accounts, web applications, and native applications
For information about setting up service accounts, web applications, or device-native applications, see the following topics.
Service accounts
A service account is used in an application that calls APIs on behalf of an application that does not access user information. This type of application needs to prove its own identity, but it does not need a user to authorize requests.
For example, if your project employs server-to-server interactions such as those between a web application and Google Cloud Storage, then you need a private key and other service account credentials. To generate these credentials, or to view the email address and public keys that you've already generated, do the following:
Open the API Console Credentials page.
If it's not already selected, select the project that you're creating credentials for.
To set up a new service account, click New credentials and then select Service account key.
Choose the service account to use for the key.
Choose whether to download the service account's public/private key as a standard P12 file, or as a JSON file that can be loaded by a Google API client library.
Your new public/private key pair is generated and downloaded to your machine; it serves as the only copy of this key. You are responsible for storing it securely.
Your project needs the private key when requesting an OAuth 2.0 access token in server-to-server interactions. Google does not keep a copy of this private key, and this screen is the only place to obtain this particular private key. When you click Download private key, the PKCS #12-formatted private key is downloaded to your local machine. As the screen indicates, you must securely store this key yourself.
The name of the downloaded private key is the key's thumbprint. When inspecting the key on your computer, or using the key in your application, you need to provide the password notasecret. Note that while the password for all Google-issued private keys is the same (notasecret), each key is cryptographically unique.
You can generate multiple public-private key pairs for a single service account. This makes it easier to update credentials or roll them over without application downtime. However, you cannot delete a key pair if it is the only one created for that service account.
Use the email address when granting the service account access to supported Google APIs.
For more details, see the OAuth 2.0 Service Accounts documentation.
Note: When you use a service account, you are subject to the Terms of Service for each product, both as an end user and as a developer.
Web applications
A web application is accessed by web browsers over a network.
Applications that use client-side JavaScript to access Google APIs must specify authorized JavaScript origins. The origins identify the domains from which your application can send API requests.
Applications that access Google APIs from a server (often using languages and frameworks like Node.js, Java, .NET, and Python) must specify authorized redirect URIs. The redirect URIs are the endpoints of your application server to which the OAuth 2.0 server can send responses.
Native applications
If your application is going to be installed on a device or computer (such as a system running Android, iOS, Universal Windows Platform, Chrome, or any desktop OS), you can use Google's OAuth 2.0 Mobile and desktop apps flow. If your application runs on devices with limited input capabilities, such as smart TVs, you can use Google’s OAuth 2.0 TV and limited-input device flow.
Android
Note: Currently, obtaining OAuth 2.0 access tokens via AccountManager works for Android Ice Cream Sandwich (4.0) and newer versions.
You need to specify your Android app's package name and SHA1 fingerprint.
In the Package name field, enter your Android app's package name.
In a terminal, run the keytool utility to get the SHA1 fingerprint for your digitally signed .apk file's public certificate.
keytool -exportcert -alias androiddebugkey -keystore path-to-debug-or-production-keystore -list -v
Note: For the debug.keystore, the password is android. For Android Studio, the debug keystore is typically located at ~/.android/debug.keystore.
The Keytool prints the fingerprint to the shell. For example:
$ keytool -list -v -keystore ~/.android/debug.keystore
Enter keystore password: Type "android" if using debug.keystore
Keystore type: JKS
Keystore provider: SUN

Your keystore contains 1 entry

Alias name: androiddebugkey
Creation date: Mar 13, 2020
Entry type: PrivateKeyEntry
Certificate chain length: 1
Certificate[1]:
Owner: C=US, O=Android, CN=Android Debug
Issuer: C=US, O=Android, CN=Android Debug
Serial number: 1
Valid from: Fri Mar 13 09:59:25 PDT 2020 until: Sun Mar 06 08:59:25 PST 2050
Certificate fingerprints:
	 SHA1: D9:E9:59:FA:7A:46:72:4E:69:1F:96:18:8C:F9:AE:82:3A:5D:2F:03
	 SHA256: 92:59:1E:F4:C9:BC:72:43:1C:59:57:24:AD:78:CA:A2:DB:C7:C5:AC:B1:A3:E8:52:04:B2:00:37:53:04:0B:8E
Signature algorithm name: SHA1withRSA
Subject Public Key Algorithm: 2048-bit RSA key
Version: 1
Copy the SHA1 fingerprint from the results that appear in your terminal.
Important: When you prepare to release your app to your users, follow these steps again in a production project and create a new OAuth 2.0 client ID for your production app. For production apps, use your own private key to sign the production app's .apk file. For more information, see Signing your applications.
Paste the SHA1 fingerprint into the form where requested.
(Optional) Verify ownership of your Android application.
You can verify ownership of your Android application to reduce the risk of app impersonation. Learn more about verifying ownership of your Android application.
Click Create.
Advanced settings 
Custom URI scheme
This setting enables custom URI schemes for your Android client. Custom URI schemes aren’t recommended and are disabled by default on Android because they are vulnerable to app impersonation. Learn more about custom URI schemes and recommended alternatives. 
iOS
If your application accesses APIs directly from iOS, you will need the application's Bundle ID and, optionally, its Apple App Store ID and Team ID:
The application's Bundle ID is the bundle identifier as listed in the app's .plist file. For example: com.example.myapp.
The application's App Store ID is in the app's App Store URL, if the app was published in the Apple App Store. For example, in the app URL https://apps.apple.com/us/app/google/id284815942, the App Store ID is 284815942.
The application's Team ID is a 10-character string that Apple assigns to your team. For information about your Team ID, see Locating your Team ID in the Apple App Distribution Guide.
After creating your iOS credentials and obtaining a Client ID, you use the Installed Application OAuth 2.0 flow to communicate with Google APIs.
Universal Windows Platform (UWP)
If your application runs on Universal Windows Platform, you will need your app’s 12-character Store ID. You can find this value in the Partner Center, on the App identity page of the App management section. This value can also be found as the last part of your app's Microsoft Store URL. For example: https://www.microsoft.com/store/apps/YOUR_STORE_ID
Chrome apps
Google Chrome apps and extensions are a special case of installed applications. Chrome exposes JavaScript APIs to allow your Chrome apps and extensions to perform various operations. Some of these APIs rely on knowing the identity of the user who is signed in to Chrome. If you're writing a Chrome app or extension that calls APIs that need to know the user's identity, and you want your app or extension to get user authorization for these requests using OAuth 2.0, then choose Chrome as the platform when you create your credentials. You will need to enter your Chrome app or extension's Application ID. For more information about these APIs, see the User Authentication documentation.
Verify app ownership
You can verify ownership of your Chrome application to reduce the risk of app impersonation. Learn more about verifying ownership of your Chrome application.
TVs & limited-input devices
The console does not require any additional information to create OAuth 2.0 credentials for applications running on limited-input devices, such as TVs.
Desktop apps
The console does not require any additional information to create OAuth 2.0 credentials for desktop applications.
Rotating your client secrets
Client secrets or credentials should be treated with extreme care as described in the OAuth 2.0 policies, because they allow anyone who has them to use your app's identity to gain access to user information. With the client secret rotation feature, you can add a new secret to your OAuth client configuration, migrate to the new secret while the old secret is still usable, and disable the old secret afterwards. This is useful when the client secret has been inadvertently disclosed or leaked. This also ensures good security practices by occasionally rotating your secrets without causing downtime of your app. In addition, Google started to issue more secure client secrets recommended by RFC 6749 in 2021. While apps that were created earlier are able to continue using the old secrets, we recommend that you migrate to the new secret with this rotation feature. 
To rotate your client secret, please follow the following steps:
Step 1: Create a new client secret
Go to the API Console Credentials page.
If it's not already selected, select the project that you want to update.
From the list of OAuth 2.0 Client IDs, click the client you want to generate a new client secret for.
On the client details page, click Add Secret on the right side to add a new secret. 
A new secret will appear below the old secret. You can also differentiate them by the secret creation time. The new secret will be in "Enabled" state and ready to be used.
Note 1: Both secrets can be used until you manually disable them. You must update your app to use the new secret and disable the old one as soon as possible after creating it to minimize security risks.   
Note 2: You can only have two client secrets at maximum. If the client already has two secrets, to create a new secret, you must first disable and delete an existing secret.
Step 2: Configure your app to use the new secret
Next, update your app to use the new secret. Remember to handle your client secrets securely as described in the OAuth 2.0 policies.
You need to monitor your app and make sure the new secret has fully taken effect. In other words, make sure the old secret is not used anywhere in your app. Check the metrics and configurations used by your app to confirm that only the new client secret is used, for example: 
References in code or configurations.
Your app or server logs.
The rollout status of your updated app version or configuration.
Any other metrics you may have.
Step 3: Disable the old secret
Having more than one enabled secrets for a client increases security risks. Once you confirm that your app has fully migrated to the new secret per the instructions in Step 2, you must disable the old secret. 
Go to the API Console Credentials page.
From the list of OAuth 2.0 Client IDs, click the client you want to update.
Find the old secret you want to disable. Generally it should be the one with the earlier creation time.
Click Disable on the right side. The old secret will be invalid shortly.
Note: A disabled client secret will be rejected in OAuth flows. You are expected to continuously monitor your app and see if it’s working properly. In case you notice the app is failing because it is still using the old secret, you may click Enable to reinstate the secret on your client details page in API Console Credentials page. In this case, you should redo this step after completing the migration.  
Step 4: Delete the old secret
Once you've confirmed that your app is working seamlessly with the new client secret, you are safe to delete the disabled old secret. To delete the secret, click the delete button next to it. Note that this cannot be undone.
Give feedback about this article
Help
Manage APIs in the API Console
Enable and disable APIs
Credentials, access, security, and identity
Setting up OAuth 2.0
Setting up API keys
Best practices for securely using API keys
Monitoring APIs
Capping API usage
APIs and billing
Verifying domains for push notifications
Unverified apps
©2025 Google
  Privacy Policy
  Terms of Service










Skip to main content



Documentation
Technology areas
Cross-product tools
Related sites
/
Language
Console
IAM
Guides
Reference
Samples
Resources
Contact Us












































































IAM 
Documentation 
Guides
Was this helpful?
Send feedback
OAuth application integration overview
bookmark_border
This page provides an overview of OAuth application integration in Google Cloud.
You can use OAuth application integration to integrate your OAuth-based applications with Google Cloud. Federated users can use their identity provider (IdP) to sign in to the applications and access their Google Cloud products and data. OAuth application integration is a feature of Workforce Identity Federation.
To use OAuth application integration, you must first create a workforce identity pool and provider. You can then register the OAuth-based application using OAuth 2.0. Applications must be registered in the organization where your workforce identity pool and provider are configured.
Important: OAuth application integration works only with Identity-Aware Proxy.
OAuth application registration
To configure an application to access Google Cloud, you register the application with Google Cloud by creating OAuth client credentials. The credential contains a client secret. The application uses the access token to access the Google Cloud products and data.
OAuth client and credential security risks and mitigations
You must secure access to the IAM APIs and the client ID and secret. If the client ID and secret is leaked, security issues can result. These issues include the following:
Impersonation: A malicious user with your client ID and secret can create an application that masquerades as your legitimate application. They can then do the following:
Gain unauthorized access to the user data and permissions that your application is entitled to.
Perform actions on the user's behalf, such as posting content, making API calls, or modifying user settings.
Perform phishing attacks, wherein the malicious user creates a fake login page that resembles the OAuth provider. The page can then trick users into entering their credentials, which gives the credentials to the malicious user who can then access their accounts.
Reputational damage: A security breach can harm the reputation of your application and organization, causing users to lose trust.
In the event of a breach, to mitigate these and other risks, assess the nature of the breach and do the following:
Ensure that only trusted users have IAM access to the OAuth client and credential API.
Rotate the client secret immediately, by rotating the client credential, as follows:
Create a new client credential for the OAuth client.
Disable the old client credential.
Delete the old client credential.
What's next
Learn how to Manage OAuth applications.
Was this helpful?
Send feedback
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-07-02 UTC.
Why Google
Choosing Google Cloud
Trust and security
Modern Infrastructure Cloud
Multicloud
Global infrastructure
Customers and case studies
Analyst reports
Whitepapers
Products and pricing
See all products
See all solutions
Google Cloud for Startups
Google Cloud Marketplace
Google Cloud pricing
Contact sales
Support
Google Cloud Community
Support
Release Notes
System status
Resources
GitHub
Getting Started with Google Cloud
Google Cloud documentation
Code samples
Cloud Architecture Center
Training and Certification
Developer Center
Engage
Blog
Events
X (Twitter)
Google Cloud on YouTube
Google Cloud Tech on YouTube
Become a Partner
Google Cloud Affiliate Program
Press Corner
About Google
Privacy
Site terms
Google Cloud terms
Our third decade of climate action: join us
Sign up for the Google Cloud newsletterSubscribe
Language

Skip to main content



Documentation
Technology areas
Cross-product tools
Related sites
/
English
Console
IAM
Guides
Reference
Samples
Resources
Contact Us




































































































IAM 
Documentation 
Guides
Was this helpful?
Send feedback
Manage OAuth application
bookmark_border
This guide shows you how to manage OAuth-based application integrations with Google Cloud.
Important: OAuth application integration works only with Identity-Aware Proxy.
At a high level, to integrate an OAuth-based application, you do the following:
Create an OAuth client.
Create an OAuth client credential.
In the OAuth client credential, obtain the client secret. To learn about risks associated with storing and accessing the client secret and strategies that can help mitigate them, see OAuth client and credential security risks and mitigations.
After you have completed these steps, the OAuth-based application can access Google Cloud products and data.
Before you begin
You must have a Google Cloud organization set up.
After installing the Google Cloud CLI, initialize it by running the following command:
gcloud init
If you're using an external identity provider (IdP), you must first sign in to the gcloud CLI with your federated identity.
Note: If you installed the gcloud CLI previously, make sure you have the latest version by running gcloud components update.
You must have set up a workforce identity pool and provider in the organization in which you will register the OAuth application. Learn how to set up workforce identity federation for Microsoft Entra ID, Okta, and other OIDC and SAML 2.0 providers.
Required roles
To get the permissions that you need to register an OAuth application for your organization, ask your administrator to grant you the IAM OAuth Client Admin (roles/iam.oauthClientAdmin) IAM role on the project. For more information about granting roles, see Manage access to projects, folders, and organizations.
You might also be able to get the required permissions through custom roles or other predefined roles.
Manage OAuth clients
This section shows you how to manage OAuth clients.
Create an OAuth client
To create an OAuth client, do the following:
gcloud
REST
gcloud iam oauth-clients create APP_OAUTH_CLIENT_ID \
    --project=PROJECT_ID \
    --location=global \
    --client-type="CONFIDENTIAL_CLIENT" \
    --display-name="My OAuth application" \
    --description="An application registration for MyApp" \
    --allowed-scopes="https://www.googleapis.com/auth/cloud-platform" \
    --allowed-redirect-uris="REDIRECT_URI" \
    --allowed-grant-types="authorization_code_grant"

Replace the following:
APP_OAUTH_CLIENT_ID: a client ID to represent this OAuth client.
PROJECT_ID: the ID of the project where you created your workforce identity pool and provider. The project must be created in the organization where your workforce pool and provider were created.
REDIRECT_URI: the redirect URI for the OAuth application—for example, https://myapp.com/signin-callback.
After you register the application, you create the OAuth client credential and obtain the secret that the OAuth application uses to access Google Cloud.
List OAuth clients
To list registered OAuth clients, run the following command:
gcloud
REST
gcloud iam oauth-clients list \
    --project=PROJECT_ID \
    --location=global

Replace PROJECT_ID with the ID of the project where your OAuth applications are registered.
Describe an OAuth client
To describe an OAuth client, run the following command:
gcloud
REST
gcloud iam oauth-clients describe APP_OAUTH_CLIENT_ID \
    --project PROJECT_ID \
    --location global

Replace the following:
APP_OAUTH_CLIENT_ID: the ID of the OAuth client that you want to to describe
PROJECT_ID: the ID of the project where you registered your OAuth application
Update an OAuth client
To update an OAuth client, run the following command.
gcloud
REST
gcloud iam oauth-clients update APP_OAUTH_CLIENT_ID \
    --project=PROJECT_ID \
    --location=global \
    --allowed-redirect-uris="REDIRECT_URI"

Replace the following:
APP_OAUTH_CLIENT_ID: the OAuth client ID for the OAuth client that you want to update
PROJECT_ID: the ID of the project where you registered your OAuth application
REDIRECT_URI: the redirect URI for the OAuth application
To update other fields, use flags listed in gcloud iam oauth-clients update.
Delete an OAuth client
To delete an OAuth client, run the following command:
gcloud
REST
gcloud iam oauth-clients delete APP_OAUTH_CLIENT_ID \
    --project PROJECT_ID \
    --location global

Replace the following:
APP_OAUTH_CLIENT_ID: the OAuth client ID to delete
PROJECT_ID: the ID of the project where you registered your OAuth application
Manage OAuth client credentials
This section shows you how to manage OAuth client credentials for the OAuth client.
Create an OAuth client credential
To create an OAuth client credential, run the following command:
gcloud
REST
gcloud iam oauth-clients credentials create APP_OAUTH_CLIENT_CREDENTIAL_ID \
    --oauth-client=APP_OAUTH_CLIENT_ID \
    --display-name='My OAuth client credential' \
    --location='global'

Replace the following:
APP_OAUTH_CLIENT_CREDENTIAL_ID: an ID that represents this client credential
APP_OAUTH_CLIENT_ID: the OAuth client ID you can obtain by describing the registered OAuth client application
List OAuth client credentials
To list OAuth client credentials, run the following command:
gcloud
REST
gcloud iam oauth-clients credentials list \
    --oauth-client=APP_OAUTH_CLIENT_ID \
    --project=PROJECT_ID \
    --location=global

Replace the following:
APP_OAUTH_CLIENT_ID: the OAuth client ID for which to list credentials
PROJECT_ID: the ID of the project where you registered your OAuth application
Describe an OAuth client credential
To describe an OAuth client credential, run the following command. You can obtain the client secret by inspecting the output.
gcloud
REST
gcloud iam oauth-clients credentials describe APP_OAUTH_CLIENT_CREDENTIAL_ID \
    --oauth-client=APP_OAUTH_CLIENT_ID \
    --location='global'

Replace the following:
APP_OAUTH_CLIENT_CREDENTIAL_ID: the redirect URI for the OAuth client
APP_OAUTH_CLIENT_ID: the OAuth client ID you can obtain by describing the client application registration
In the output, clientSecret is the client secret. This is the secret that the OAuth application uses to access Google Cloud.
Warning: The client secret must be stored securely. If the client secret is leaked, you must delete and re-create the client credential. To learn more, see OAuth client and credential security risks and mitigations.
Update an OAuth client credential
To update an OAuth client credential, run the following command:
gcloud
REST
gcloud iam oauth-clients credentials update APP_OAUTH_CLIENT_CREDENTIAL_ID \
    --client-id=APP_OAUTH_CLIENT_ID \
    --display-name="My new credential name" \
    --location=global

Disable an OAuth client credential
Before you can delete an OAuth client credential, you must disable it. To disable the OAuth client credential, run the following command:
gcloud
REST
gcloud iam oauth-clients credentials update APP_OAUTH_CLIENT_CREDENTIAL_ID \
    --oauth-client=APP_OAUTH_CLIENT_ID \
    --disabled \
    --project=PROJECT_ID \
    --location=global

Replace the following:
PROJECT_ID: the ID of the project where you registered your OAuth application
APP_OAUTH_CLIENT_ID: the OAuth client ID
APP_OAUTH_CLIENT_CREDENTIAL_ID: the client credential ID to disable
Delete an OAuth client credential
To delete an OAuth client credential, run the following command:
gcloud
REST
gcloud iam oauth-clients credentials delete APP_OAUTH_CLIENT_CREDENTIAL_ID \
    --project=PROJECT_ID \
    --oauth-client=APP_OAUTH_CLIENT_ID \
    --location=global

Replace the following:
APP_OAUTH_CLIENT_CREDENTIAL_ID: the OAuth client ID
PROJECT_ID: the ID of the project where you registered your OAuth application
APP_OAUTH_CLIENT_ID: the client credential ID
What's next
Learn about Identity-Aware Proxy with workforce identity federation
Was this helpful?
Send feedback
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-07-02 UTC.
Why Google
Choosing Google Cloud
Trust and security
Modern Infrastructure Cloud
Multicloud
Global infrastructure
Customers and case studies
Analyst reports
Whitepapers
Products and pricing
See all products
See all solutions
Google Cloud for Startups
Google Cloud Marketplace
Google Cloud pricing
Contact sales
Support
Google Cloud Community
Support
Release Notes
System status
Resources
GitHub
Getting Started with Google Cloud
Google Cloud documentation
Code samples
Cloud Architecture Center
Training and Certification
Developer Center
Engage
Blog
Events
X (Twitter)
Google Cloud on YouTube
Google Cloud Tech on YouTube
Become a Partner
Google Cloud Affiliate Program
Press Corner
About Google
Privacy
Site terms
Google Cloud terms
Our third decade of climate action: join us
Sign up for the Google Cloud newsletterSubscribe
English

Skip to main content



Documentation
Technology areas
Cross-product tools
Related sites
/
Language
Console
Cloud SDK
Authentication
Guides
Reference
Resources
Contact Us












































































Cloud SDK 
Authentication 
Guides
Was this helpful?
Send feedback
Authentication methods at Google
bookmark_border
This document helps you understand some key authentication methods and concepts, and where to get help with implementing or troubleshooting authentication. The primary focus of the authentication documentation is for Google Cloud services, but the list of authentication use cases and the introductory material on this page includes use cases for other Google products as well.
Introduction
Authentication is the process by which your identity is confirmed through the use of some kind of credential. Authentication is about proving that you are who you say you are.
Google provides many APIs and services, which require authentication to access. Google also provides a number of services that host applications written by our customers; these applications also need to determine the identity of their users.
Google APIs implement and extend the OAuth 2.0 framework.
How to get help with authentication
I want to...
Information
Authenticate to Vertex AI in express mode (Preview).
Use the API key created for you during the sign-on process to authenticate to Vertex AI. For more information, see Vertex AI in express mode overview.
Authenticate to a Google Cloud service from my application using a high-level programming language.
Set up Application Default Credentials, and then use one of the Cloud Client Libraries.
Authenticate to an application that requires an ID token.
Get an OpenID Connect (OIDC) ID token and provide it with your request.
Implement user authentication for an application that accesses Google or Google Cloud services and resources.
See Authenticate application users for a comparison of options.
Try out some gcloud commands in my local development environment.
Initialize the gcloud CLI.
Try out some Google Cloud REST API requests in my local development environment.
Use a command-line tool such as curl to call the REST API.
Try out a code snippet included in my product documentation.
Set up ADC for a local development environment, and install your product's client library in your local environment. The client library finds your credentials automatically.
Get help with another authentication use case.
See the Authentication use cases page.
See a list of the products Google provides in the identity and access management space.
See the Google identity and access management products page.

Choose the right authentication method for your use case
When you access Google Cloud services by using the Google Cloud CLI, Cloud Client Libraries, tools that support Application Default Credentials (ADC) like Terraform, or REST requests, use the following diagram to help you choose an authentication method:

This diagram guides you through the following questions:
Are you running code in a single-user development environment, such as your own workstation, Cloud Shell, or a virtual desktop interface?
If yes, proceed to question 4.
If no, proceed to question 2.
Are you running code in Google Cloud?
If yes, proceed to question 3.
If no, proceed to question 5.
Are you running containers in Google Kubernetes Engine?
If yes, use Workload Identity Federation for GKE to attach service accounts to Kubernetes pods.
If no, attach a service account to the resource.
Does your use case require a service account?
For example, you want to configure authentication and authorization consistently for your application across all environments.
If no, authenticate with user credentials.
If yes, impersonate a service account with user credentials.
Does your workload authenticate with an external identity provider that supports workload identity federation?
If yes, configure Workload Identity Federation to let applications running on-premises or on other cloud providers use a service account.
If no, create a service account key.
Authorization methods for Google Cloud services
Authorization for Google Cloud is primarily handled by Identity and Access Management (IAM). IAM offers granular control by principal and by resource.
You can apply another layer of authorization with OAuth 2.0 scopes. When you authenticate to a Google Cloud service, you can use a global scope that authorizes access to all Google Cloud services (https://www.googleapis.com/auth/cloud-platform), or, if a service supports it, you can restrict access with a more limited scope. Limited scopes can help to reduce risk if your code is running in environments where compromised tokens might be a concern, such as mobile apps.
The authorization scopes that are accepted by an API method are listed in the API reference documentation for each Google Cloud service.
Application Default Credentials
Application Default Credentials (ADC) is a strategy used by the authentication libraries to automatically find credentials based on the application environment. The authentication libraries make those credentials available to Cloud Client Libraries and Google API Client Libraries. When you use ADC, your code can run in either a development or production environment without changing how your application authenticates to Google Cloud services and APIs.
Using ADC can simplify your development process, because it lets you use the same authentication code in a variety of environments. If you're using a service in express mode, however, you don't need to use ADC.
Before you can use ADC, you must provide your credentials to ADC, based on where you want your code to run. ADC automatically locates credentials and gets a token in the background, enabling your authentication code to run in different environments without modification. For example, the same version of your code could authenticate with Google Cloud APIs when running on a development workstation or on Compute Engine.
Your gcloud credentials are not the same as the credentials you provide to ADC using the gcloud CLI. For more information, see gcloud CLI authentication configuration and ADC configuration.
Terminology
The following terms are important to understand when discussing authentication and authorization.
Authentication
Authentication is the process of determining the identity of the principal attempting to access a resource.
Authorization
Authorization is the process of determining whether the principal or application attempting to access a resource has been authorized for that level of access.
Credentials
When this document uses the term user account, it refers to a Google Account, or a user account managed by your identity provider and federated with Workforce Identity Federation.
For authentication, credentials are a digital object that provide proof of identity. Passwords, PINs, and biometric data can all be used as credentials, depending on the application requirements. For example, when you log into your user account, you provide your password and satisfy any two-factor authentication requirement as proof that the account in fact belongs to you, and you are not being spoofed by a bad actor.
Tokens are not credentials. They are a digital object that proves that the caller provided proper credentials.
The type of credential you need to provide depends on what you are authenticating to.
The following types of credentials can be created in the Google Cloud console:
API keys
You can use API keys with APIs that accept them to access the API. API keys that are not bound to a service account provide a project, which is used for billing and quota purposes. If the API key is bound to a service account, the API key also provides the identity and authorization of the service account (Preview).
For more information about API keys, see API keys. For more information about API keys that are bound to a service account, see the Google Cloud express mode FAQ.
OAuth Client IDs
OAuth Client IDs are used to identify an application to Google Cloud. This is necessary when you want to access resources owned by your end users, also called three-legged OAuth (3LO). For more information about how to get and use an OAuth Client ID, see Setting up OAuth 2.0.
Service account keys
Service account keys identify a principal (the service account) and the project associated with the service account.
Note: Service account keys are a security risk if not managed correctly. You should choose a more secure alternative to service account keys whenever possible. If you must authenticate with a service account key, you are responsible for the security of the private key and for other operations described by Best practices for managing service account keys. If you are prevented from creating a service account key, service account key creation might be disabled for your organization. For more information, see Managing secure-by-default organization resources.
If you acquired the service account key from an external source, you must validate it before use. For more information, see Security requirements for externally sourced credentials.
You can also create credentials by using the gcloud CLI. These credentials include the following types:
Local ADC files
Credential configurations used by Workload Identity Federation
Credential configurations used by Workforce Identity Federation
Note: If you are accepting credential configurations (JSON, files, or streams) created by an external organization, you must validate the credential configuration before you use it. For more information, see Security requirements when using credential configurations from an external source.
Principal
A principal is an identity that can be granted access to a resource. For authentication, Google APIs support two types of principals: user accounts and service accounts.
Whether you use a user account or a service account to authenticate depends on your use case. You might use both, each at different stages of your project or in different development environments.
User accounts
User accounts represent a developer, administrator, or any other person who interacts with Google APIs and services.
User accounts are managed as Google Accounts, either with Google Workspace or Cloud Identity. They can also be user accounts that are managed by a third-party identity provider and federated with Workforce Identity Federation.
With a user account, you can authenticate to Google APIs and services in the following ways:
Use the gcloud CLI to set up Application Default Credentials (ADC).
Use your user credentials to sign in to the Google Cloud CLI, and then use the tool to access Google Cloud services.
Use your user credentials to impersonate a service account.
Use your user credentials to sign in to the Google Cloud CLI, and then use the tool to generate access tokens.
For an overview of ways to configure identities for users in Google Cloud, see Identities for users.
Service accounts
Service accounts are accounts that do not represent a human user. They provide a way to manage authentication and authorization when a human is not directly involved, such as when an application needs to access Google Cloud resources. Service accounts are managed by IAM.
The following list provides some methods for using a service account to authenticate to Google APIs and services, in order from most secure to least secure. For more information, see Choose the right authentication method for your use case on this page.
Attach a user-managed service account to the resource and use ADC to authenticate.
This is the recommended way to authenticate production code running on Google Cloud.
Use a service account to impersonate another service account.
Service account impersonation lets you temporarily grant more privileges to a service account. Granting extra privileges on a temporary basis enables that service account to perform the required access without having to permanently acquire more privilege.
Use Workload Identity Federation to authenticate workloads that run on-premises or on a different cloud provider.
Use the default service account.
Using the default service account is not recommended, because by default the default service account is highly privileged, which violates the principle of least privilege.
Use a service account key.
Note: Service account keys are a security risk if not managed correctly. You should choose a more secure alternative to service account keys whenever possible. If you must authenticate with a service account key, you are responsible for the security of the private key and for other operations described by Best practices for managing service account keys. If you are prevented from creating a service account key, service account key creation might be disabled for your organization. For more information, see Managing secure-by-default organization resources.
If you acquired the service account key from an external source, you must validate it before use. For more information, see Security requirements for externally sourced credentials.
For an overview of ways to configure workload identities, including service accounts, for Google Cloud, see Identities for workloads. For best practices, see Best practices for using service accounts.
Token
For authentication and authorization, a token is a digital object that shows that a caller provided proper credentials that were exchanged for that token. The token contains information about the identity of the principal making the request and what kind of access they are authorized to make.
Tokens can be thought of as being like hotel keys. When you check in to a hotel and present the proper documentation to the hotel registration desk, you receive a key that gives you access to specific hotel resources. For example, the key might give you access to your room and the guest elevator, but would not give you access to any other room or the service elevator.
With the exception of API keys, Google APIs do not support credentials directly. Your application must acquire or generate a token and provide it to the API. There are several different types of tokens. For more information, see Token types.
Workload and workforce
Google Cloud identity and access products enable access to Google Cloud services and resources for both programmatic access and human users. Google Cloud uses the terms workload for programmatic access and workforce for user access.
Workload Identity Federation lets you provide access to on-premises or multi-cloud workloads without having to create and manage service account keys.
Workforce Identity Federation lets you use an external identity provider to authenticate and authorize a workforce—a group of users, such as employees, partners, and contractors—using IAM, so that the users can access Google Cloud services.
What's next
Learn more about how Google Cloud services use IAM to control access to Google Cloud resources.
Understand how Application Default Credentials works, and how you can set it up for a variety of development environments.
Was this helpful?
Send feedback
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-07-02 UTC.
Why Google
Choosing Google Cloud
Trust and security
Modern Infrastructure Cloud
Multicloud
Global infrastructure
Customers and case studies
Analyst reports
Whitepapers
Products and pricing
See all products
See all solutions
Google Cloud for Startups
Google Cloud Marketplace
Google Cloud pricing
Contact sales
Support
Google Cloud Community
Support
Release Notes
System status
Resources
GitHub
Getting Started with Google Cloud
Google Cloud documentation
Code samples
Cloud Architecture Center
Training and Certification
Developer Center
Engage
Blog
Events
X (Twitter)
Google Cloud on YouTube
Google Cloud Tech on YouTube
Become a Partner
Google Cloud Affiliate Program
Press Corner
About Google
Privacy
Site terms
Google Cloud terms
Our third decade of climate action: join us
Sign up for the Google Cloud newsletterSubscribe
Language


Skip to main content



Documentation
Technology areas
Cross-product tools
Related sites
/
English
Console
Cloud SDK
Authentication
Guides
Reference
Resources
Contact Us




































































Cloud SDK 
Authentication 
Guides
Was this helpful?
Send feedback
Authenticate for using client libraries
bookmark_border
This page describes how you can use client libraries to access Google APIs.
Client libraries make it easier to access Google Cloud APIs using a supported language. You can use Google Cloud APIs directly by making raw requests to the server, but client libraries provide simplifications that significantly reduce the amount of code you need to write. This is especially true for authentication, because the client libraries support Application Default Credentials (ADC).
If you accept credential configurations (JSON, files, or streams) from an external source (for example, a customer), review the security requirements when using credential configurations from an external source.
Use Application Default Credentials with client libraries
To use Application Default Credentials to authenticate your application, you must first set up ADC for the environment where your application is running. When you use the client library to create a client, the client library automatically checks for and uses the credentials you have provided to ADC to authenticate to the APIs your code uses. Your application does not need to explicitly authenticate or manage tokens; these requirements are managed automatically by the authentication libraries.
For a local development environment, you can set up ADC with your user credentials or with service account impersonation by using the gcloud CLI. For production environments, you set up ADC by attaching a service account.
Example client creation
The following code samples create a client for the Cloud Storage service. Your code is likely to need different clients; these samples are meant only to show how you can create a client and use it without any code to explicitly authenticate.
Before you can run the following samples, you must complete the following steps:
Set up ADC for your environment
Install the Cloud Storage client library
Go
Java
Node.js
PHP
Python
Ruby
import (
	"context"
	"fmt"
	"io"

	"cloud.google.com/go/storage"
	"google.golang.org/api/iterator"
)

// authenticateImplicitWithAdc uses Application Default Credentials
// to automatically find credentials and authenticate.
func authenticateImplicitWithAdc(w io.Writer, projectId string) error {
	// projectId := "your_project_id"

	ctx := context.Background()

	// NOTE: Replace the client created below with the client required for your application.
	// Note that the credentials are not specified when constructing the client.
	// The client library finds your credentials using ADC.
	client, err := storage.NewClient(ctx)
	if err != nil {
		return fmt.Errorf("NewClient: %w", err)
	}
	defer client.Close()

	it := client.Buckets(ctx, projectId)
	for {
		bucketAttrs, err := it.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return err
		}
		fmt.Fprintf(w, "Bucket: %v\n", bucketAttrs.Name)
	}

	fmt.Fprintf(w, "Listed all storage buckets.\n")

	return nil
}

Use API keys with client libraries
You can use an API keys only with client libraries for APIs that accept API keys. In addition, the API key must not have an API restriction that prevents it from being used for the API.
For more information about API keys created in express mode, see the Google Cloud express mode FAQ.
This example uses the Cloud Natural Language API, which accepts API keys, to demonstrate how you would provide an API key to the library.
C#
C++
Go
Node.js
Python
To run this sample, you must install the Natural Language client library.

using Google.Cloud.Language.V1;
using System;

public class UseApiKeySample
{
    public void AnalyzeSentiment(string apiKey)
    {
        LanguageServiceClient client = new LanguageServiceClientBuilder
        {
            ApiKey = apiKey
        }.Build();

        string text = "Hello, world!";

        AnalyzeSentimentResponse response = client.AnalyzeSentiment(Document.FromPlainText(text));
        Console.WriteLine($"Text: {text}");
        Sentiment sentiment = response.DocumentSentiment;
        Console.WriteLine($"Sentiment: {sentiment.Score}, {sentiment.Magnitude}");
        Console.WriteLine("Successfully authenticated using the API key");
    }
}

When you use API keys in your applications, ensure that they are kept secure during both storage and transmission. Publicly exposing your API keys can lead to unexpected charges on your account. For more information, see Best practices for managing API keys.
Security requirements when using credential configurations from an external source
Typically, you generate credential configurations by using gcloud CLI commands or by using the Google Cloud console. For example, you can use the gcloud CLI to generate a local ADC file or a login configuration file. Similarly, you can use the Google Cloud console to create and download a service account key.
For some use cases, however, credential configurations are provided to you by an external entity; these credential configurations are intended to be used to authenticate to Google APIs.
Some types of credential configurations include endpoints and file paths, which the authentication libraries use to acquire a token. When you accept credential configurations from an external source, you must validate the configuration before using it. If you don't validate the configuration, a malicious actor could use the credential to compromise your systems and data.
Validate credential configurations from external sources
How you need to validate your external credentials depends on what types of credential your application accepts.
Validate service account keys
If your application accepts only service account keys, use a credential loader specific to service account keys, as shown in the following examples. The type-specific credential loader parses only the fields present for service account keys, which don't expose any vulnerabilities.
C#
C++
Java
Node.js
PHP
Python
Ruby
var saCredential = ServiceAccountCredential.FromServiceAccountData(stream);

If you can't use a type-specific credential loader, validate the credential by confirming that the value for the type field is service_account. If the value for the type field is any other value, don't use the service account key.
Validate other credential configurations
If your application accepts any type of credential besides a service account key, you must perform additional verification. Examples of other types of credential configurations include ADC credential files, Workload Identity Federation credential files, or Workforce Identity Federation login configuration files.
The following table lists the fields you need to validate, if they are present in your credentials. Not all of these fields are present for all credential configurations.
Important: If any of these fields contain a value that does not conform to the expected value, don't use the credential.
Field
Purpose
Expected value
service_account_impersonation_url
The authentication libraries use this field to access an endpoint to generate an access token for the service account being impersonated.
https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/service account email:generateAccessToken
token_url
The authentication libraries send an external token to this endpoint to exchange it for a federated access token.
https://sts.googleapis.com/v1/token
credential_source.file
The authentication libraries read an external token from the file at the location specified by this field and send it to the token_url endpoint.
The path for a file containing an external token. You should recognize this path.
credential_source.url
An endpoint that returns an external token. The authentication libraries send a request to this URL and send the response to the token_url endpoint.
One of the following items:
A well-known endpoint provided by your cloud provider.
An endpoint that you have explicitly set up to provide tokens.
credential_source.executable.command
If the GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES environment variable is set to 1, the authentication libraries run this command or executable file.
An executable file or command that returns an external token. You should recognize this command and validate that it is safe.
credential_source.aws.url
The authentication libraries issue a request to this URL to retrieve an AWS security token.
Either one of these exact values:
http://169.254.169.254/latest/meta-data/iam/security-credentials
http://[fd00:ec2::254]/latest/meta-data/iam/security-credentials
credential_source.aws.region_url
The authentication libraries issue a request to this URL to retrieve the active AWS region.
Either one of these exact values:
http://169.254.169.254/latest/meta-data/placement/availability-zone
http://[fd00:ec2::254]/latest/meta-data/placement/availability-zone
credential_source.aws.imdsv2_session_token_url
The authentication libraries issue a request to this URL to retrieve the AWS session token.
Either one of these exact values:
http://169.254.169.254/latest/api/token
http://[fd00:ec2::254]/latest/api/token

What's next
Learn more about Application Default Credentials.
Learn more about API keys.
See an overview of Authentication methods.
Was this helpful?
Send feedback
Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.
Last updated 2025-07-02 UTC.
Why Google
Choosing Google Cloud
Trust and security
Modern Infrastructure Cloud
Multicloud
Global infrastructure
Customers and case studies
Analyst reports
Whitepapers
Products and pricing
See all products
See all solutions
Google Cloud for Startups
Google Cloud Marketplace
Google Cloud pricing
Contact sales
Support
Google Cloud Community
Support
Release Notes
System status
Resources
GitHub
Getting Started with Google Cloud
Google Cloud documentation
Code samples
Cloud Architecture Center
Training and Certification
Developer Center
Engage
Blog
Events
X (Twitter)
Google Cloud on YouTube
Google Cloud Tech on YouTube
Become a Partner
Google Cloud Affiliate Program
Press Corner
About Google
Privacy
Site terms
Google Cloud terms
Our third decade of climate action: join us
Sign up for the Google Cloud newsletterSubscribe
English


