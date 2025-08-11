# Twilio Conversations
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
Overview
Conversations API Quickstart
Exploring the Conversations JavaScript Quickstart
Exploring the Conversations Swift Quickstart (iOS)
Exploring the Conversations Android Quickstart
API Reference
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
What is a Conversation?
What is a Message?
How do I connect Conversations to my application?
What are Users?
How do I join a Conversation?
How does Twilio handle incoming messages?
What is a Service?
How do I use Conversations in Flex?
What's next?
Twilio Conversations Overview

Twilio Conversations is an omni-channel messaging product. You can use it to build engaging experiences on any channel we support.
With Twilio Conversations, you can, for example:
Connect customers with support agents via chat using our SDK
Bridge previously siloed channels with each other, like SMS and WhatsApp
Support customers on the channel they prefer from inside your existing tools
Reduce friction by handling requests using bots
Proxy messages between two SMS numbers
Any channel we support can be connected together. Conversations also supports common chat features like typing indicators and read horizon to enable pure chat applications.
(information)
Info
Use of the Conversations API is limited to interactions involving at least one human participant. For application to application communication, please see www.twilio.com/sync.
Let's dive into a few of the key concepts you'll need to know while working with Conversations. Let's get started!

What is a Conversation?
The Conversation object is a core component of Twilio Conversations. A Conversation is a distinct message thread that contains Participant objects, which represent humans or bots who are participating in the Conversation. A Participant sends a Message, which is relayed to every other Participant in the Conversation.

Expand image
Messages are routed to a real-world endpoint, like an application that uses the Conversations SDK, a mobile phone's SMS application, or a user's inbox on Facebook Messenger.
Users connected via the Conversations SDK will be uniquely identified by their identity. This value is set in the Access Token you'll generate and provide to your application.
For external channels like SMS, WhatsApp, and Messenger, the external address is mapped to a Twilio-controlled proxy address, like a Twilio phone number, a Twilio WhatsApp sender, or a Facebook page you connected to Twilio. This pair of addresses (external and Twilio-controlled) uniquely identifies a non-chat Participant in Conversations, and the proxy address acts as the external user's "window" into the Conversation.

What is a Message?
Messages in a Conversation can contain text, media, or both. You can attach up to ten Media objects to a single Message. Because different channels support different file types and file sizes, resizing and delivery of media is the best effort, and you should ensure that media conforms to the limits of the channels involved in your Conversations.

Expand image
You can learn more about Media Messaging in the SDK and in the REST API.

How do I connect Conversations to my application?
Twilio provides SDKs for JavaScript
, iOS
, and Android
 so that you can integrate Conversations into your client-side applications. Our SDK connects your application to Conversations via a WebSocket, which allows you to receive events and objects that are relevant to your application's user in real time.

Expand image
To connect, you'll generate a time-sensitive user-specific Access Token on your server and return it to your client-side application. The identity that you set in the Access Token will determine which User the SDK connects as.
(warning)
Warning
Never store your Twilio account credentials in your client-side application.
Once you've initialized the SDK, you can retrieve, create, modify, and delete Conversations, Messages, and other objects. Twilio also sends you real-time events when changes happen, like when a new Message is added to a Conversation or when your User is added to a new Conversation. You can use this information to build your user interface.

What are Users?
Your client-side application connects to Conversations as a specific User. Users can only access Conversations they have been added to. To add someone, you'll need to create a new Participant in the Conversation. A User controls a unique Participant in each Conversation they're a member of.

Expand image

How do I join a Conversation?
When joining a Conversation from an external channel, you will be mapped to the Conversation via a channel-appropriate address controlled by Twilio. Examples of these include phone numbers you've purchased from Twilio, WhatsApp senders you've applied for on the Twilio's platform, and Facebook pages you linked via the Twilio Console. These addresses are known as Proxy Addresses.
The Proxy Address acts as the person's "window" into the Conversation. In other words, they'll be exchanging messages natively with that address. For example, if someone using SMS was added to a Conversation, they'd receive Conversation Messages as SMS originating from the Proxy Address. To reply, they'd send an SMS back to the Proxy Address.

Expand image

How does Twilio handle incoming messages?
When Twilio receives a message from an external channel, we check the to and the from addresses. If this pair matches an existing mapping to a Conversation, we'll insert it into the Conversation as a Message from the Participant that uses that mapping. This mapping is known as a Messaging Binding.
If an incoming message doesn't match an existing mapping, we'll check to see if you've used the Address Configuration API or a Messaging Service to enable autocreation for that Proxy Address. If you did, we'll automatically create a Conversation, add a Participant to it with that Messaging Binding, and insert the Message into the Conversation.

Expand image

What is a Service?
A Service is a unique instance of Twilio Conversations. If you have multiple Services, you'll notice that Conversations, Users, and other objects in one Service can't interact with objects from another Service - it's an opaque partition. Generally, use cases call for one Service. If you're an ISV or have another use case that you believe requires multiple instances, Subaccounts are usually a better option.

Expand image

How do I use Conversations in Flex?
If your organization uses Flex for its contact center, the Flex Conversations architecture lets you use Twilio Conversations to enable async channel capabilities. To implement Conversations in Flex, you also need to use the Interactions API for the functionality to work correctly. To get started using Conversations to send and receive messages in Flex, see the following Flex developer guides:
Receive Inbound Messages with Flex Conversations Channels
Send Outbound Messages with Flex Conversations Channels

What's next?
Now that you know the basics of Conversations, you might want to check out these resources:
Create your first Conversation with the Conversations Quickstart
Explore the Conversations JavaScript Quickstart
Learn more with our REST API documentation

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Twilio Conversations Overview | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
Overview
Conversations API Quickstart
Exploring the Conversations JavaScript Quickstart
Exploring the Conversations Swift Quickstart (iOS)
Exploring the Conversations Android Quickstart
API Reference
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Sign up for Twilio and provision your first SMS-enabled number
Install twilio-cli
Log in to twilio-cli
Create your first Conversation
Add an SMS participant to a Conversation
Configure the Conversations demo application using CodeSandbox.io
Sign into CodeSandbox and fork our demo application
Use twilio-cli to install the Twilio token plugin and generate your token
Add a chat participant to a Conversation
Talk amongst "yourself"
What's Next?
Conversations API Quickstart

With Twilio's Conversations API, you can build virtual spaces ("conversations") for customers to communicate across multiple channels.
Instead of building separate solutions for online chat versus SMS engagement, you now have one API to create customer engagement across all of them.
This Quickstart will cover:
Signing up for Twilio and provisioning your first SMS-enabled phone number
Creating your first Conversation with the Conversations API
Connecting an SMS Participant to a Conversation
Configuring a demo Conversations application
Adding a chat Participant to a Conversation to talk with the SMS Participant
You will need:
Your Twilio credentials (Twilio Account SID and Twilio Auth Token) found in the Console


An installed version of the twilio-cli (We'll go over how to install and set this up.)
A CodeSandbox
 account
(information)
Info
Twilio Conversations is built on top of several Twilio products. It may also be useful to pull up a document or sticky note to keep track of the various values that you'll need throughout this Quickstart.

Sign up for Twilio and provision your first SMS-enabled number
(information)
Info
If you've already signed up for Twilio and have an SMS-enabled phone number, you can skip ahead to installing the Twilio CLI.
Before you create your first Conversation, you'll need to sign up for a Twilio account
 or sign into your existing account.
You can sign up for a free Twilio trial account here
.
When you sign up, you'll be asked to verify your personal phone number. This helps Twilio verify your identity and also allows you to send test messages to your phone from your Twilio account while in trial mode.
Once you verify your number, you'll be asked a series of questions to customize your experience.
Once you finish the onboarding flow, you'll arrive at your project dashboard in the Twilio Console
. This is where you'll be able to access your Account SID, authentication token, find a Twilio phone number, and more.
If you don't currently own a Twilio phone number with SMS functionality, you'll need to purchase one. After navigating to the Buy a Number
 page, check the SMS box and click Search.

Expand image
You'll then see a list of available phone numbers and their capabilities. Find a number that suits your fancy and click Buy to add it to your account.

Expand image
Next, we'll install the Twilio CLI and log in to it.

Install twilio-cli
First, install twilio-cli if you haven't done so already:
macOSWindowsLinux
The suggested way to install twilio-cli on macOS is to use Homebrew
. If you don't already have it installed, visit the Homebrew site
 for installation instructions and then return here.
Once you have installed Homebrew, run the following command to install twilio-cli:
Copy code block
brew tap twilio/brew && brew install twilio
(information)
Info
For other installation methods, see the Twilio CLI Quickstart.
Log in to twilio-cli
To access your Twilio account, you must provide your Twilio credentials to twilio-cli. This can be done by running this command:
Copy code block
twilio login
You will be prompted for:
A shorthand identifier for your profile: This can be anything, e.g., project-danger.
Your Account SID and Auth Token, both of which you can find on the dashboard of your Twilio Console
.
This will create an API Key for you that will be stored securely for future use.
Now that you have a Twilio account, the Twilio CLI, and a programmable phone number, you can start writing some code.

Create your first Conversation
It's time to make our first Conversation! In the sample code, replace the Account SID and Auth Token with the values from your Twilio Console:
Create your first Conversation
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversation() {


 const conversation = await client.conversations.v1.conversations.create({


   friendlyName: "My First Conversation",


 });





 console.log(conversation.sid);


}





createConversation();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "My First Conversation",


 "unique_name": "unique_name",


 "attributes": "{ \"topic\": \"feedback\" }",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "state": "inactive",


 "timers": {


   "date_inactive": "2015-12-16T22:19:38Z",


   "date_closed": "2015-12-16T22:28:38Z"


 },


 "bindings": {},


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "participants": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",


   "messages": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",


   "webhooks": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks",


   "export": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Export"


 }


}
(information)
Info
It's okay to hardcode your credentials when testing locally, but you should use environment variables to keep them secret before committing any code or deploying to production. Check out How to Set Environment Variables
 for more information.
Copy down the Conversation SID (It starts with CHXXX). Now, let's use it to fetch that Conversation we just created.
Fetch your new Conversation
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchConversation() {


 const conversation = await client.conversations.v1


   .conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .fetch();





 console.log(conversation.chatServiceSid);


}





fetchConversation();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "My First Conversation",


 "unique_name": "first_conversation",


 "attributes": "{ \"topic\": \"feedback\" }",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "state": "active",


 "timers": {


   "date_inactive": "2015-12-16T22:19:38Z",


   "date_closed": "2015-12-16T22:28:38Z"


 },


 "bindings": {},


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "participants": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",


   "messages": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",


   "webhooks": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks",


   "export": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Export"


 }


}
Copy down the Conversation Service SID (It starts with ISXXX), and make sure you've copied the Conversation SID (It starts with CHXXX) as well. We'll be using these values in the next few steps when we add participants to the Conversation you just created.

Add an SMS participant to a Conversation
You've created a Conversation, which you can think of as a virtual space for users to join from the channel of their choice.
Next, you'll add your first Participant: someone connecting to the Conversation with an SMS-enabled phone number. (Hint: Use the number that you purchased above.)
For the following code sample, replace the placeholder values for:
CHXXX...: use the Conversation SID you just copied
<Your Personal Mobile Number>: your own mobile number, in E.164 format
<Your Purchased Twilio Phone Number>: the Twilio number you purchased in step 1, in E.164 format
TWILIO_ACCOUNT_SID: Your Twilio Account SID
TWILIO_AUTH_TOKEN: Your Twilio Auth Token
Add a Conversation Participant (SMS)
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationParticipant() {


 const participant = await client.conversations.v1


   .conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .participants.create({


     "messagingBinding.address": "<Your Personal Mobile Number>",


     "messagingBinding.proxyAddress": "<Your Purchased Twilio Phone Number>",


   });





 console.log(participant.sid);


}





createConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "identity": null,


 "attributes": "{ \"role\": \"driver\" }",


 "messaging_binding": {


   "type": "sms",


   "address": "+15558675310",


   "proxy_address": "+15017122661"


 },


 "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}
Now you have one SMS Participant in the Conversation that you created!

Configure the Conversations demo application using CodeSandbox.io
Great, you've got a Conversation with an SMS Participant. Just one problem: it's quiet because it's hard to have a conversation with just one person.
It's time to add a second chat Participant to talk with your SMS Participant (which we just created).
Sign into CodeSandbox and fork our demo application
For this Quickstart, we'll be using a basic chat-interface application to join our Conversation. We need to take a quick detour to set up the sample Conversations application.
For your convenience, we've created a demo application that provides a basic JavaScript-based chat interface in which you can send and receive messages in your new Conversation.
Sign in to Codesandbox.io
 and fork the demo app
 into your own Sandbox. CodeSandbox is a cloud-based online editor that we can use to host, update, and edit our sample chat application.
You will need a CodeSandbox
 account, which uses your Github credentials.
Go to our conversations-demo application Sandbox
 and fork it to your own account with the "Fork" button in the upper right corner

Expand image
Now that you have forked the demo application, you have your own sandbox and online editor to adapt the code. Your changes will be instantly reflected in the deployed application.
Use twilio-cli to install the Twilio token plugin and generate your token
In order for your Conversations demo application to work, we need to authenticate our chat user by retrieving a short-lived token attached to your API Key. We'll use twilio-cli to generate a token that you can use in your application.
Run the following command to add the Twilio token plugin
 that handles token generation:
Copy code block
twilio plugins:install @twilio-labs/plugin-token
You can create a token with this command, replacing the arguments with your own values:
Copy code block
twilio token:chat --identity testPineapple --chat-service-sid ISXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX --profile project-danger
For the value you pass to identity, use the username that your chat Participant will use to log into the chat demo application. Use any identity that you like. May we suggest testPineapple?
For your chat-service-sid, use the unique Conversation Service SID starting with ISXXX that you copied after creating your Conversation.
For the profile, enter what you used as the shorthand identifier for your profile when setting up the Twilio CLI. In this instance, we used project-danger.
Copy the token returned from the previous command and paste it into the ConversationsApp.js placeholder field in the getToken function.

Expand image
Reload your Conversations demo application, which now includes a token for your chosen chat identity (i.e., the one you just attached to the token we created). Log in with that identity in the web interface.

Expand image
Once you see "You are connected." You know that you have logged into the Conversations demo application:

Expand image
Phew! Your Conversations demo application is all set up and ready to go. We're on to the last part: adding this chat Participant to your Conversation.

Add a chat participant to a Conversation
Let's add a chat participant to our Conversation so it isn't so lonely in there. The following code sample adds a chat Participant to the Conversation. You will need to replace the following information:
Conversation SID: the same CHXXX SID that you used previously
Identity: the identity that you just created in the Conversations demo application (For this example, we'll use testPineapple)
Add a Conversation Participant (Chat)
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationParticipant() {


 const participant = await client.conversations.v1


   .conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .participants.create({ identity: "testPineapple" });





 console.log(participant.sid);


}





createConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "identity": "testPineapple",


 "attributes": "{ \"role\": \"driver\" }",


 "messaging_binding": {


   "type": "sms",


   "address": "+15558675310",


   "proxy_address": "+15017122661"


 },


 "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}
After you run this code, you should see a link with your Conversation's "friendly name" pop up in the Conversations Demo Application. That means you're connected and can start chatting!

Expand image

Talk amongst "yourself"
New Conversation? Check. Working demo application? Check. Two Participants? Check.
It's time to start talking. On your mobile phone, send a text message to the Twilio number you used to set up your Conversation. Your Conversations demo application should receive the same message almost immediately!

Expand image
If you reply in the demo application browser, you'll receive the message as a text on your phone. Notice how all of this routing between the two channels (SMS and chat) is done automatically on your behalf. Three REST requests in, and you have a working use-case, congratulations!

What's Next?
From here, you can add more participants to your Conversation via chat, SMS, or even WhatsApp. New participants start receiving new messages automatically, and deleting those same participants removes them from the Conversation.
Subject to regional SMS limitations, you can have any number of SMS participants ("user address") for each Twilio number ("proxy address"), or you can have a separate proxy address for each of your users. However, a mobile phone number can be in only one conversation with any given Twilio number—you cannot have multiple conversations containing the same Twilio number and mobile phone number pair.
Want to know more about the Twilio Conversations API?
Check out the Conversations API Reference docs
Add a WhatsApp participant to a Conversation
Learn about Webhooks in Conversations
Learn more about how Conversations works by Exploring the Conversations JavaScript Quickstart

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Conversations API Quickstart | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
Overview
Conversations API Quickstart
Exploring the Conversations JavaScript Quickstart
Exploring the Conversations Swift Quickstart (iOS)
Exploring the Conversations Android Quickstart
API Reference
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Quickstart Overview
Adding Twilio Conversations to your Application
Conversations JavaScript Client SDK
Twilio Helper Library
Understanding Identity, Access Tokens, and Chat Grants
Difference between Access Tokens, Auth Tokens and API Keys
Access Tokens
Auth Tokens
API Keys and Secrets
Storing Credentials Securely
Retrieving a Conversations Access Token
Initializing the JS Conversations Client
Client Connection State
Joining and Leaving a Conversation
Sending Messages to a Conversation
Receiving and Displaying Messages
Displaying Existing Messages
Displaying New Messages Added to the Conversation
Conclusion/Next Steps
Exploring the Conversations JavaScript Quickstart

What does the Conversations JavaScript Quickstart do? How does it work? How would you add something similar to your own project? We'll cover all of these questions and more in this behind-the-scenes look at the example application code.
If you haven't had a chance to try out the Conversations demo application, follow the instructions in the Twilio Conversations Quickstart guide to get it up and running.

Quickstart Overview
The example application code has two pieces - a large front-end Single Page Application (SPA) written with JavaScript and React, and a small back end written with JavaScript and Node.js. We created the project using the create-react-app
 command line tool.
Within the quickstart application, you will find examples of the following:
Using an access token to initialize the front-end SPA
Joining or leaving a conversation
Sending messages to a conversation
Receiving and displaying messages from a conversation
When you build an application that uses Conversations, you may be able to use several of the React components from the quickstart, or you may customize them to fit your use case. You also do not have to use React with Conversations - it works with vanilla JS, Angular
, Vue
, or any other JavaScript framework for the web browser.

Adding Twilio Conversations to your Application
When you build your solutions with Twilio Conversations, you need a Conversations Client JavaScript SDK that runs in your end user's web browser. You can install this library using Node Package Manager (NPM), Yarn, or with an HTML Script tag that points to the Twilio CDN.
You also need to integrate a Twilio helper library into your back-end application. These libraries exist for Java, C#, PHP, Node.js/JavaScript, Ruby, and Python. You can use these libraries with almost any server framework that works with these languages.
Conversations JavaScript Client SDK
To install the JavaScript Conversations Client library in your web application's front end, use npm (or yarn):
Copy code block
npm install --save @twilio/conversations
There is also a CDN installation, if you prefer:
Copy code block
<script src="https://media.twiliocdn.com/sdk/js/conversations/releases/2.1.0/twilio-conversations.min.js"


       integrity="sha256-v2SFLWujVq0wnwHpcxct7bzTP8wII7sumEhAKMEqgHQ="


       crossorigin="anonymous"></script>


You would typically start by adding the Conversations.Client from this SDK to your project, and then work with Conversation objects to send and retrieve Message objects for a given Conversation. Other important classes are User, Participant, and Media.
While we cover some of the basics of the Conversations JS SDK in this Quickstart, you can find reference documentation for each class as JSDocs
. We also consider some of these topics in more detail on other pages in our docs, which we will link to in each section that has a corresponding guide.
These JavaScript libraries are not the libraries you need for a back-end, Node.js application. If you are building a web application with Node.js, you need the JavaScript Twilio Helper Library.
Twilio Helper Library
For your chosen language and/or platform, pick the appropriate Twilio Helper Library:
Java


C#/.NET


JavaScript/Node.js


Ruby


Python


PHP


On each of these pages, you will find instructions for setting up the Twilio helper library (also called a "server-side SDK"). We recommend using dependency management for the Twilio libraries, and you'll find directions for the most common build tools for your platform.
(information)
Info
If you don't already have a Twilio account, sign up for a Twilio trial account
, and then create a new project. You'll also need to create an API Key and API Secret pair to call Twilio's REST API, whether you use one of the Twilio helper libraries, or make the API calls yourself.

Understanding Identity, Access Tokens, and Chat Grants
Each chat user in your Conversations project needs an identity - this could be their user id, their username, or some kind of other identifier. You could certainly have anonymous users in your Conversations - for instance, a web chat popup with a customer service agent on an e-commerce website - but in that case, you would still want to issue some kind of identifier from your application.
Once you build Twilio Conversations into your project, you should generate an access token with a ChatGrant for end users, along with the identity value.
With the Conversations JS Quickstart, the easiest way to get started is to create an access token from the Twilio Command Line Interface (CLI).

Difference between Access Tokens, Auth Tokens and API Keys
As part of this project, you will see that there are three different ways of providing credentials for Twilio - access tokens, auth tokens, and API keys. What is the difference between all of these different styles?
Access Tokens
Access tokens provide short-lived credentials for a single end user to work with your Twilio service from a JavaScript application running in a web browser, or from a native iOS or Android mobile application. Use the Twilio helper libraries in your back-end web services to create access tokens for your front-end applications to consume. Alternatively, use the Twilio CLI to create access tokens for testing. These access tokens have a built-in expiration, and need to be refreshed from your server if your users have long-running connections. The Conversations client will update your application when access tokens are about to expire, or if they have expired, so that you can refresh the token.
Auth Tokens
Although the names are similar, authentication (or auth) tokens are not the same as access tokens, and cannot be used in the same way. The auth token pairs with your Twilio account identifier (also called the account SID) to provide authentication for the Twilio REST API. Your auth token should be treated with the same care that you would use to secure your Twilio password, and should never be included directly in source code, made available to a client application, or checked into a file in source control.
API Keys and Secrets
Similar to auth tokens, API key/secret pairs secure access to the Twilio REST API for your account. When you create an API key and secret pair from the Twilio console, the secret will only be shown once, and then it won't be recoverable. In your back-end application, you would authenticate to Twilio with a combination of your account identifier (also known as the "Account SID"), an API key, and an API secret.
The advantage of API keys over auth tokens is that you can rotate API keys on your server application, especially if you use one API key and secret pair for each application cluster or instance. This way, you can have multiple credentials under your Twilio account, and if you need to swap out a key pair and then deactivate it, you can do it on an application basis, not on an account basis.
Storing Credentials Securely
Whether you use auth tokens or API keys, we suggest that you store those credentials securely, and do not check them into source control. There are many different options for managing secure credentials that depend on how and where you run your development, staging, and production environments.
When you develop locally, look into using a .env file with your project, usually in conjunction with a library named dotenv. For .NET Core, read our article on Setting Twilio Environment Variables in Windows 10 with PowerShell and .NET Core 3.0
 to learn a lot more about this topic!

Retrieving a Conversations Access Token
In the Conversations JS Quickstart, you can generate an access token using the Twilio Command Line Interface (CLI), and then paste that into the ConversationsApp.js file. While this works for getting the quickstart up and running, you will want to replace this with your own function that retrieves an access token.
You can use fetch, axios, or another client-side JS library to make an authenticated HTTP request to your server, where you would provide an access token with a ChatGrant that sets the identity for the user based on your own authentication mechanism (such as a session cookie).
Ideally, this method would be usable for three different scenarios:
Initializing the Conversations JS Client when the React component mounts
Refreshing the access token when the Conversations JS Client notifies your application that the token is about to expire
Refreshing the access token when the Conversations JS Client notifies your application that the token did expire

Initializing the JS Conversations Client
The first step is to get an access token. Once you have an access token (It is a string value.), you can initialize a Twilio Conversations Client. This client is the central class in the Conversations JS SDK, and you need to keep it around after initialization. The client is designed to be long-lived, and it will fire events off that your project can subscribe to.
Initializing the Conversations Client
Copy code block
import React from "react";


import { Badge, Icon, Layout, Spin, Typography } from "antd";


import { Client as ConversationsClient } from "@twilio/conversations";





import "./assets/Conversation.css";


import "./assets/ConversationSection.css";


import { ReactComponent as Logo } from "./assets/twilio-mark-red.svg";





import Conversation from "./Conversation";


import LoginPage from "./LoginPage";


import { ConversationsList } from "./ConversationsList";


import { HeaderItem } from "./HeaderItem";





const { Content, Sider, Header } = Layout;


const { Text } = Typography;





class ConversationsApp extends React.Component {


 constructor(props) {


   super(props);





   const name = localStorage.getItem("name") || "";


   const loggedIn = name !== "";





   this.state = {


     name,


     loggedIn,


     token: null,


     statusString: null,


     conversationsReady: false,


     conversations: [],


     selectedConversationSid: null,


     newMessage: ""


   };


 }





 componentDidMount = () => {


   if (this.state.loggedIn) {


     this.getToken();


     this.setState({ statusString: "Fetching credentials…" });


   }


 };





 logIn = (name) => {


   if (name !== "") {


     localStorage.setItem("name", name);


     this.setState({ name, loggedIn: true }, this.getToken);


   }


 };





 logOut = (event) => {


   if (event) {


     event.preventDefault();


   }





   this.setState({


     name: "",


     loggedIn: false,


     token: "",


     conversationsReady: false,


     messages: [],


     newMessage: "",


     conversations: []


   });





   localStorage.removeItem("name");


   this.conversationsClient.shutdown();


 };





 getToken = () => {


   // Paste your unique Chat token function


   const myToken = "<Your token here>";


   this.setState({ token: myToken }, this.initConversations);


 };





 initConversations = async () => {


   window.conversationsClient = ConversationsClient;


   this.conversationsClient = new ConversationsClient(this.state.token);


   this.setState({ statusString: "Connecting to Twilio…" });





   this.conversationsClient.on("connectionStateChanged", (state) => {


     if (state === "connecting")


       this.setState({


         statusString: "Connecting to Twilio…",


         status: "default"


       });


     if (state === "connected") {


       this.setState({


         statusString: "You are connected.",


         status: "success"


       });


     }


     if (state === "disconnecting")


       this.setState({


         statusString: "Disconnecting from Twilio…",


         conversationsReady: false,


         status: "default"


       });


     if (state === "disconnected")


       this.setState({


         statusString: "Disconnected.",


         conversationsReady: false,


         status: "warning"


       });


     if (state === "denied")


       this.setState({


         statusString: "Failed to connect.",


         conversationsReady: false,


         status: "error"


       });


   });


   this.conversationsClient.on("conversationJoined", (conversation) => {


     this.setState({ conversations: [...this.state.conversations, conversation] });


   });


   this.conversationsClient.on("conversationLeft", (thisConversation) => {


     this.setState({


       conversations: [...this.state.conversations.filter((it) => it !== thisConversation)]


     });


   });


 };





 render() {


   const { conversations, selectedConversationSid, status } = this.state;


   const selectedConversation = conversations.find(


     (it) => it.sid === selectedConversationSid


   );





   let conversationContent;


   if (selectedConversation) {


     conversationContent = (


       <Conversation


         conversationProxy={selectedConversation}


         myIdentity={this.state.name}


       />


     );


   } else if (status !== "success") {


     conversationContent = "Loading your conversation!";


   } else {


     conversationContent = "";


   }





   if (this.state.loggedIn) {


     return (


       <div className="conversations-window-wrapper">


         <Layout className="conversations-window-container">


           <Header


             style={{ display: "flex", alignItems: "center", padding: 0 }}


           >


             <div


               style={{


                 maxWidth: "250px",


                 width: "100%",


                 display: "flex",


                 alignItems: "center"


               }}


             >


               <HeaderItem style={{ paddingRight: "0", display: "flex" }}>


                 <Logo />


               </HeaderItem>


               <HeaderItem>


                 <Text strong style={{ color: "white" }}>


                   Conversations


                 </Text>


               </HeaderItem>


             </div>


             <div style={{ display: "flex", width: "100%" }}>


               <HeaderItem>


                 <Text strong style={{ color: "white" }}>


                   {selectedConversation &&


                     (selectedConversation.friendlyName || selectedConversation.sid)}


                 </Text>


               </HeaderItem>


               <HeaderItem style={{ float: "right", marginLeft: "auto" }}>


                 <span


                   style={{ color: "white" }}


                 >{` ${this.state.statusString}`}</span>


                 <Badge


                   dot={true}


                   status={this.state.status}


                   style={{ marginLeft: "1em" }}


                 />


               </HeaderItem>


               <HeaderItem>


                 <Icon


                   type="poweroff"


                   onClick={this.logOut}


                   style={{


                     color: "white",


                     fontSize: "20px",


                     marginLeft: "auto"


                   }}


                 />


               </HeaderItem>


             </div>


           </Header>


           <Layout>


             <Sider theme={"light"} width={250}>


               <ConversationsList


                 conversations={conversations}


                 selectedConversationSid={selectedConversationSid}


                 onConversationClick={(item) => {


                   this.setState({ selectedConversationSid: item.sid });


                 }}


               />


             </Sider>


             <Content className="conversation-section">


               <div id="SelectedConversation">{conversationContent}</div>


             </Content>


           </Layout>


         </Layout>


       </div>


     );


   }





   return <LoginPage onSubmit={this.logIn} />;


 }


}





export default ConversationsApp;
Client Connection State
After you initialize the Conversations client, the connectionStateChanged event will fire any time the user's connection changes. The possible states handled in the Conversations JS Quickstart are:
connecting
connected
disconnecting
disconnected
denied
Once the user is connected, they are able to chat with others in conversations.
Managing the Connection State
Copy code block
import React from "react";


import { Badge, Icon, Layout, Spin, Typography } from "antd";


import { Client as ConversationsClient } from "@twilio/conversations";





import "./assets/Conversation.css";


import "./assets/ConversationSection.css";


import { ReactComponent as Logo } from "./assets/twilio-mark-red.svg";





import Conversation from "./Conversation";


import LoginPage from "./LoginPage";


import { ConversationsList } from "./ConversationsList";


import { HeaderItem } from "./HeaderItem";





const { Content, Sider, Header } = Layout;


const { Text } = Typography;





class ConversationsApp extends React.Component {


 constructor(props) {


   super(props);





   const name = localStorage.getItem("name") || "";


   const loggedIn = name !== "";





   this.state = {


     name,


     loggedIn,


     token: null,


     statusString: null,


     conversationsReady: false,


     conversations: [],


     selectedConversationSid: null,


     newMessage: ""


   };


 }





 componentDidMount = () => {


   if (this.state.loggedIn) {


     this.getToken();


     this.setState({ statusString: "Fetching credentials…" });


   }


 };





 logIn = (name) => {


   if (name !== "") {


     localStorage.setItem("name", name);


     this.setState({ name, loggedIn: true }, this.getToken);


   }


 };





 logOut = (event) => {


   if (event) {


     event.preventDefault();


   }





   this.setState({


     name: "",


     loggedIn: false,


     token: "",


     conversationsReady: false,


     messages: [],


     newMessage: "",


     conversations: []


   });





   localStorage.removeItem("name");


   this.conversationsClient.shutdown();


 };





 getToken = () => {


   // Paste your unique Chat token function


   const myToken = "<Your token here>";


   this.setState({ token: myToken }, this.initConversations);


 };





 initConversations = async () => {


   window.conversationsClient = ConversationsClient;


   this.conversationsClient = new ConversationsClient(this.state.token);


   this.setState({ statusString: "Connecting to Twilio…" });





   this.conversationsClient.on("connectionStateChanged", (state) => {


     if (state === "connecting")


       this.setState({


         statusString: "Connecting to Twilio…",


         status: "default"


       });


     if (state === "connected") {


       this.setState({


         statusString: "You are connected.",


         status: "success"


       });


     }


     if (state === "disconnecting")


       this.setState({


         statusString: "Disconnecting from Twilio…",


         conversationsReady: false,


         status: "default"


       });


     if (state === "disconnected")


       this.setState({


         statusString: "Disconnected.",


         conversationsReady: false,


         status: "warning"


       });


     if (state === "denied")


       this.setState({


         statusString: "Failed to connect.",


         conversationsReady: false,


         status: "error"


       });


   });


   this.conversationsClient.on("conversationJoined", (conversation) => {


     this.setState({ conversations: [...this.state.conversations, conversation] });


   });


   this.conversationsClient.on("conversationLeft", (thisConversation) => {


     this.setState({


       conversations: [...this.state.conversations.filter((it) => it !== thisConversation)]


     });


   });


 };





 render() {


   const { conversations, selectedConversationSid, status } = this.state;


   const selectedConversation = conversations.find(


     (it) => it.sid === selectedConversationSid


   );





   let conversationContent;


   if (selectedConversation) {


     conversationContent = (


       <Conversation


         conversationProxy={selectedConversation}


         myIdentity={this.state.name}


       />


     );


   } else if (status !== "success") {


     conversationContent = "Loading your conversation!";


   } else {


     conversationContent = "";


   }





   if (this.state.loggedIn) {


     return (


       <div className="conversations-window-wrapper">


         <Layout className="conversations-window-container">


           <Header


             style={{ display: "flex", alignItems: "center", padding: 0 }}


           >


             <div


               style={{


                 maxWidth: "250px",


                 width: "100%",


                 display: "flex",


                 alignItems: "center"


               }}


             >


               <HeaderItem style={{ paddingRight: "0", display: "flex" }}>


                 <Logo />


               </HeaderItem>


               <HeaderItem>


                 <Text strong style={{ color: "white" }}>


                   Conversations


                 </Text>


               </HeaderItem>


             </div>


             <div style={{ display: "flex", width: "100%" }}>


               <HeaderItem>


                 <Text strong style={{ color: "white" }}>


                   {selectedConversation &&


                     (selectedConversation.friendlyName || selectedConversation.sid)}


                 </Text>


               </HeaderItem>


               <HeaderItem style={{ float: "right", marginLeft: "auto" }}>


                 <span


                   style={{ color: "white" }}


                 >{` ${this.state.statusString}`}</span>


                 <Badge


                   dot={true}


                   status={this.state.status}


                   style={{ marginLeft: "1em" }}


                 />


               </HeaderItem>


               <HeaderItem>


                 <Icon


                   type="poweroff"


                   onClick={this.logOut}


                   style={{


                     color: "white",


                     fontSize: "20px",


                     marginLeft: "auto"


                   }}


                 />


               </HeaderItem>


             </div>


           </Header>


           <Layout>


             <Sider theme={"light"} width={250}>


               <ConversationsList


                 conversations={conversations}


                 selectedConversationSid={selectedConversationSid}


                 onConversationClick={(item) => {


                   this.setState({ selectedConversationSid: item.sid });


                 }}


               />


             </Sider>


             <Content className="conversation-section">


               <div id="SelectedConversation">{conversationContent}</div>


             </Content>


           </Layout>


         </Layout>


       </div>


     );


   }





   return <LoginPage onSubmit={this.logIn} />;


 }


}





export default ConversationsApp;

Joining and Leaving a Conversation
The Conversation class is the building block of your Conversations application. In the JS Quickstart, as the user joins or leaves conversations, conversationJoined and conversationLeft events from the ConversationsClient get fired with the Conversation object as an argument. The React application maintains the list of conversations in its state, and then displays those conversations to the user in the ConversationsList.js
 component.
Joining and Leaving Conversations
Copy code block
import React from "react";


import { Badge, Icon, Layout, Spin, Typography } from "antd";


import { Client as ConversationsClient } from "@twilio/conversations";





import "./assets/Conversation.css";


import "./assets/ConversationSection.css";


import { ReactComponent as Logo } from "./assets/twilio-mark-red.svg";





import Conversation from "./Conversation";


import LoginPage from "./LoginPage";


import { ConversationsList } from "./ConversationsList";


import { HeaderItem } from "./HeaderItem";





const { Content, Sider, Header } = Layout;


const { Text } = Typography;





class ConversationsApp extends React.Component {


 constructor(props) {


   super(props);





   const name = localStorage.getItem("name") || "";


   const loggedIn = name !== "";





   this.state = {


     name,


     loggedIn,


     token: null,


     statusString: null,


     conversationsReady: false,


     conversations: [],


     selectedConversationSid: null,


     newMessage: ""


   };


 }





 componentDidMount = () => {


   if (this.state.loggedIn) {


     this.getToken();


     this.setState({ statusString: "Fetching credentials…" });


   }


 };





 logIn = (name) => {


   if (name !== "") {


     localStorage.setItem("name", name);


     this.setState({ name, loggedIn: true }, this.getToken);


   }


 };





 logOut = (event) => {


   if (event) {


     event.preventDefault();


   }





   this.setState({


     name: "",


     loggedIn: false,


     token: "",


     conversationsReady: false,


     messages: [],


     newMessage: "",


     conversations: []


   });





   localStorage.removeItem("name");


   this.conversationsClient.shutdown();


 };





 getToken = () => {


   // Paste your unique Chat token function


   const myToken = "<Your token here>";


   this.setState({ token: myToken }, this.initConversations);


 };





 initConversations = async () => {


   window.conversationsClient = ConversationsClient;


   this.conversationsClient = new ConversationsClient(this.state.token);


   this.setState({ statusString: "Connecting to Twilio…" });





   this.conversationsClient.on("connectionStateChanged", (state) => {


     if (state === "connecting")


       this.setState({


         statusString: "Connecting to Twilio…",


         status: "default"


       });


     if (state === "connected") {


       this.setState({


         statusString: "You are connected.",


         status: "success"


       });


     }


     if (state === "disconnecting")


       this.setState({


         statusString: "Disconnecting from Twilio…",


         conversationsReady: false,


         status: "default"


       });


     if (state === "disconnected")


       this.setState({


         statusString: "Disconnected.",


         conversationsReady: false,


         status: "warning"


       });


     if (state === "denied")


       this.setState({


         statusString: "Failed to connect.",


         conversationsReady: false,


         status: "error"


       });


   });


   this.conversationsClient.on("conversationJoined", (conversation) => {


     this.setState({ conversations: [...this.state.conversations, conversation] });


   });


   this.conversationsClient.on("conversationLeft", (thisConversation) => {


     this.setState({


       conversations: [...this.state.conversations.filter((it) => it !== thisConversation)]


     });


   });


 };





 render() {


   const { conversations, selectedConversationSid, status } = this.state;


   const selectedConversation = conversations.find(


     (it) => it.sid === selectedConversationSid


   );





   let conversationContent;


   if (selectedConversation) {


     conversationContent = (


       <Conversation


         conversationProxy={selectedConversation}


         myIdentity={this.state.name}


       />


     );


   } else if (status !== "success") {


     conversationContent = "Loading your conversation!";


   } else {


     conversationContent = "";


   }





   if (this.state.loggedIn) {


     return (


       <div className="conversations-window-wrapper">


         <Layout className="conversations-window-container">


           <Header


             style={{ display: "flex", alignItems: "center", padding: 0 }}


           >


             <div


               style={{


                 maxWidth: "250px",


                 width: "100%",


                 display: "flex",


                 alignItems: "center"


               }}


             >


               <HeaderItem style={{ paddingRight: "0", display: "flex" }}>


                 <Logo />


               </HeaderItem>


               <HeaderItem>


                 <Text strong style={{ color: "white" }}>


                   Conversations


                 </Text>


               </HeaderItem>


             </div>


             <div style={{ display: "flex", width: "100%" }}>


               <HeaderItem>


                 <Text strong style={{ color: "white" }}>


                   {selectedConversation &&


                     (selectedConversation.friendlyName || selectedConversation.sid)}


                 </Text>


               </HeaderItem>


               <HeaderItem style={{ float: "right", marginLeft: "auto" }}>


                 <span


                   style={{ color: "white" }}


                 >{` ${this.state.statusString}`}</span>


                 <Badge


                   dot={true}


                   status={this.state.status}


                   style={{ marginLeft: "1em" }}


                 />


               </HeaderItem>


               <HeaderItem>


                 <Icon


                   type="poweroff"


                   onClick={this.logOut}


                   style={{


                     color: "white",


                     fontSize: "20px",


                     marginLeft: "auto"


                   }}


                 />


               </HeaderItem>


             </div>


           </Header>


           <Layout>


             <Sider theme={"light"} width={250}>


               <ConversationsList


                 conversations={conversations}


                 selectedConversationSid={selectedConversationSid}


                 onConversationClick={(item) => {


                   this.setState({ selectedConversationSid: item.sid });


                 }}


               />


             </Sider>


             <Content className="conversation-section">


               <div id="SelectedConversation">{conversationContent}</div>


             </Content>


           </Layout>


         </Layout>


       </div>


     );


   }





   return <LoginPage onSubmit={this.logIn} />;


 }


}





export default ConversationsApp;

Sending Messages to a Conversation
To send a message (with text content) to a conversation that a user has joined, you need to call the sendMessage() method on the Conversation instance. In the quickstart, we update the React component's state for the newMessage variable to be empty, leaving the text input field open for another message.
While the Conversations JS Quickstart does not implement them, you can find a list of webhooks that you can enable for your Conversations project. These webhooks include onMessageAdd, which is a pre-action webhook that could filter the text in the message, and onMessageAdded, which is a post-action webhook that could take action based on the contents of a message (such as updating a CRM).
The Conversations JS Quickstart also demonstrates how to send media, such as images, through the web browser interface using drag and drop. This functionality is in the Conversation.js
 file.
Sending a Message to a Conversation
Copy code block
import React, { Component } from 'react';


import './assets/Conversation.css';


import MessageBubble from './MessageBubble'


import Dropzone from 'react-dropzone';


import styles from './assets/Conversation.module.css'


import {Button, Form, Icon, Input} from "antd";


import ConversationsMessages from "./ConversationsMessages";


import PropTypes from "prop-types";





class Conversation extends Component {


 constructor(props) {


   super(props);


   this.state = {


       newMessage: '',


       conversationProxy: props.conversationProxy,


       messages: [],


       loadingState: 'initializing',


       boundConversations: new Set()


   };


 }





 loadMessagesFor = (thisConversation) => {


   if (this.state.conversationProxy === thisConversation) {


       thisConversation.getMessages()


           .then(messagePaginator => {


               if (this.state.conversationProxy === thisConversation) {


                   this.setState({ messages: messagePaginator.items, loadingState: 'ready' });


               }


           })


           .catch(err => {


               console.error("Couldn't fetch messages IMPLEMENT RETRY", err);


               this.setState({ loadingState: "failed" });


           });


   }


 };





 componentDidMount = () => {


     if (this.state.conversationProxy) {


       this.loadMessagesFor(this.state.conversationProxy);





       if (!this.state.boundConversations.has(this.state.conversationProxy)) {


           let newConversation = this.state.conversationProxy;


           newConversation.on('messageAdded', m => this.messageAdded(m, newConversation));


           this.setState({boundConversations: new Set([...this.state.boundConversations, newConversation])});


       }


     }


 }





 componentDidUpdate = (oldProps, oldState) => {


   if (this.state.conversationProxy !== oldState.conversationProxy) {


       this.loadMessagesFor(this.state.conversationProxy);





       if (!this.state.boundConversations.has(this.state.conversationProxy)) {


           let newConversation = this.state.conversationProxy;


           newConversation.on('messageAdded', m => this.messageAdded(m, newConversation));


           this.setState({boundConversations: new Set([...this.state.boundConversations, newConversation])});


       }


   }


 };





 static getDerivedStateFromProps(newProps, oldState) {


   let logic = (oldState.loadingState === 'initializing') || oldState.conversationProxy !== newProps.conversationProxy;


   if (logic) {


     return { loadingState: 'loading messages', conversationProxy: newProps.conversationProxy };


   } else {


     return null;


   }


 }





 messageAdded = (message, targetConversation) => {


   if (targetConversation === this.state.conversationProxy)


       this.setState((prevState, props) => ({


           messages: [...prevState.messages, message]


       }));


 };





 onMessageChanged = event => {


   this.setState({ newMessage: event.target.value });


 };





 sendMessage = event => {


   event.preventDefault();


   const message = this.state.newMessage;


   this.setState({ newMessage: '' });


   this.state.conversationProxy.sendMessage(message);


 };





 onDrop = acceptedFiles => {


   this.state.conversationProxy.sendMessage({contentType: acceptedFiles[0].type, media: acceptedFiles[0]});


 };





 render = () => {


   return (


       <Dropzone


           onDrop={this.onDrop}


           accept="image/*">


         {({getRootProps, getInputProps, isDragActive}) => (


             <div


                 {...getRootProps()}


                 onClick={() => {


                 }}


                 id="OpenChannel"


                 style={{position: "relative", top: 0}}>





               {isDragActive &&


               <div className={styles.drop}>


                 <Icon type={"cloud-upload"}


                       style={{fontSize: "5em", color: "#fefefe"}}/>


                 <h3 style={{color: "#fefefe"}}>Release to Upload</h3>


               </div>


               }


               <div


                   className={styles.messages}


                   style={{


                     filter: `blur(${isDragActive ? 4 : 0}px)`,


                   }}


               >


                 <input id="files" {...getInputProps()} />


                 <div style={{flexBasis: "100%", flexGrow: 2, flexShrink: 1, overflowY: "scroll"}}>


                   <ConversationsMessages


                       identity={this.props.myIdentity}


                       messages={this.state.messages}/>


                 </div>


                 <div>


                   <Form onSubmit={this.sendMessage}>


                     <Input.Group compact={true} style={{


                       width: "100%",


                       display: "flex",


                       flexDirection: "row"


                     }}>


                       <Input


                           style={{flexBasis: "100%"}}


                           placeholder={"Type your message here..."}


                           type={"text"}


                           name={"message"}


                           id={styles['type-a-message']}


                           autoComplete={"off"}


                           disabled={this.state.loadingState !== 'ready'}


                           onChange={this.onMessageChanged}


                           value={this.state.newMessage}


                       />


                       <Button icon="enter" htmlType="submit" type={"submit"}/>


                     </Input.Group>


                   </Form>


                 </div>


               </div>


             </div>


         )}





       </Dropzone>


   );


 }


}





Conversation.propTypes = {


 myIdentity: PropTypes.string.isRequired


};





export default Conversation;

Receiving and Displaying Messages
In the React Conversations demo, we created a Conversation React component, which you can find in the src/Conversation.js
 file in the GitHub repo. As part of that component, we listen to the messageAdded event on the SDK's Conversation object. To distinguish between the React component and the representation of a conversation in the Twilio SDK, we will call the SDK version a conversation proxy here. This conversation proxy gets passed into the React component as a property, and then the React component interacts with the SDK by calling methods on it, or adding listeners.
Displaying Existing Messages
The React Conversation component loads the existing messages from the conversation proxy, using the getMessages() method on the Twilio SDK Conversation class. This returns a paginator, and we load the messages from the first page of results up to display to the user when they join a conversation.
Conversations JS Quickstart - Conversation.js
Copy code block
import React, { Component } from 'react';


import './assets/Conversation.css';


import MessageBubble from './MessageBubble'


import Dropzone from 'react-dropzone';


import styles from './assets/Conversation.module.css'


import {Button, Form, Icon, Input} from "antd";


import ConversationsMessages from "./ConversationsMessages";


import PropTypes from "prop-types";





class Conversation extends Component {


 constructor(props) {


   super(props);


   this.state = {


       newMessage: '',


       conversationProxy: props.conversationProxy,


       messages: [],


       loadingState: 'initializing',


       boundConversations: new Set()


   };


 }





 loadMessagesFor = (thisConversation) => {


   if (this.state.conversationProxy === thisConversation) {


       thisConversation.getMessages()


           .then(messagePaginator => {


               if (this.state.conversationProxy === thisConversation) {


                   this.setState({ messages: messagePaginator.items, loadingState: 'ready' });


               }


           })


           .catch(err => {


               console.error("Couldn't fetch messages IMPLEMENT RETRY", err);


               this.setState({ loadingState: "failed" });


           });


   }


 };





 componentDidMount = () => {


     if (this.state.conversationProxy) {


       this.loadMessagesFor(this.state.conversationProxy);





       if (!this.state.boundConversations.has(this.state.conversationProxy)) {


           let newConversation = this.state.conversationProxy;


           newConversation.on('messageAdded', m => this.messageAdded(m, newConversation));


           this.setState({boundConversations: new Set([...this.state.boundConversations, newConversation])});


       }


     }


 }





 componentDidUpdate = (oldProps, oldState) => {


   if (this.state.conversationProxy !== oldState.conversationProxy) {


       this.loadMessagesFor(this.state.conversationProxy);





       if (!this.state.boundConversations.has(this.state.conversationProxy)) {


           let newConversation = this.state.conversationProxy;


           newConversation.on('messageAdded', m => this.messageAdded(m, newConversation));


           this.setState({boundConversations: new Set([...this.state.boundConversations, newConversation])});


       }


   }


 };





 static getDerivedStateFromProps(newProps, oldState) {


   let logic = (oldState.loadingState === 'initializing') || oldState.conversationProxy !== newProps.conversationProxy;


   if (logic) {


     return { loadingState: 'loading messages', conversationProxy: newProps.conversationProxy };


   } else {


     return null;


   }


 }





 messageAdded = (message, targetConversation) => {


   if (targetConversation === this.state.conversationProxy)


       this.setState((prevState, props) => ({


           messages: [...prevState.messages, message]


       }));


 };





 onMessageChanged = event => {


   this.setState({ newMessage: event.target.value });


 };





 sendMessage = event => {


   event.preventDefault();


   const message = this.state.newMessage;


   this.setState({ newMessage: '' });


   this.state.conversationProxy.sendMessage(message);


 };





 onDrop = acceptedFiles => {


   this.state.conversationProxy.sendMessage({contentType: acceptedFiles[0].type, media: acceptedFiles[0]});


 };





 render = () => {


   return (


       <Dropzone


           onDrop={this.onDrop}


           accept="image/*">


         {({getRootProps, getInputProps, isDragActive}) => (


             <div


                 {...getRootProps()}


                 onClick={() => {


                 }}


                 id="OpenChannel"


                 style={{position: "relative", top: 0}}>





               {isDragActive &&


               <div className={styles.drop}>


                 <Icon type={"cloud-upload"}


                       style={{fontSize: "5em", color: "#fefefe"}}/>


                 <h3 style={{color: "#fefefe"}}>Release to Upload</h3>


               </div>


               }


               <div


                   className={styles.messages}


                   style={{


                     filter: `blur(${isDragActive ? 4 : 0}px)`,


                   }}


               >


                 <input id="files" {...getInputProps()} />


                 <div style={{flexBasis: "100%", flexGrow: 2, flexShrink: 1, overflowY: "scroll"}}>


                   <ConversationsMessages


                       identity={this.props.myIdentity}


                       messages={this.state.messages}/>


                 </div>


                 <div>


                   <Form onSubmit={this.sendMessage}>


                     <Input.Group compact={true} style={{


                       width: "100%",


                       display: "flex",


                       flexDirection: "row"


                     }}>


                       <Input


                           style={{flexBasis: "100%"}}


                           placeholder={"Type your message here..."}


                           type={"text"}


                           name={"message"}


                           id={styles['type-a-message']}


                           autoComplete={"off"}


                           disabled={this.state.loadingState !== 'ready'}


                           onChange={this.onMessageChanged}


                           value={this.state.newMessage}


                       />


                       <Button icon="enter" htmlType="submit" type={"submit"}/>


                     </Input.Group>


                   </Form>


                 </div>


               </div>


             </div>


         )}





       </Dropzone>


   );


 }


}





Conversation.propTypes = {


 myIdentity: PropTypes.string.isRequired


};





export default Conversation;
Displaying New Messages Added to the Conversation
Using React also lets us handle the case where a new message gets added to the conversation. We listen to the messageAdded event from the Twilio Conversations SDK Conversation object, and then append that message to the messages we already have, and then set the state for the React component.
React handles the rendering for us as the messages list changes, which is much easier than trying to keep the DOM in sync with the message list manually.
Conversations JS Quickstart - Conversation.js
Copy code block
import React, { Component } from 'react';


import './assets/Conversation.css';


import MessageBubble from './MessageBubble'


import Dropzone from 'react-dropzone';


import styles from './assets/Conversation.module.css'


import {Button, Form, Icon, Input} from "antd";


import ConversationsMessages from "./ConversationsMessages";


import PropTypes from "prop-types";





class Conversation extends Component {


 constructor(props) {


   super(props);


   this.state = {


       newMessage: '',


       conversationProxy: props.conversationProxy,


       messages: [],


       loadingState: 'initializing',


       boundConversations: new Set()


   };


 }





 loadMessagesFor = (thisConversation) => {


   if (this.state.conversationProxy === thisConversation) {


       thisConversation.getMessages()


           .then(messagePaginator => {


               if (this.state.conversationProxy === thisConversation) {


                   this.setState({ messages: messagePaginator.items, loadingState: 'ready' });


               }


           })


           .catch(err => {


               console.error("Couldn't fetch messages IMPLEMENT RETRY", err);


               this.setState({ loadingState: "failed" });


           });


   }


 };





 componentDidMount = () => {


     if (this.state.conversationProxy) {


       this.loadMessagesFor(this.state.conversationProxy);





       if (!this.state.boundConversations.has(this.state.conversationProxy)) {


           let newConversation = this.state.conversationProxy;


           newConversation.on('messageAdded', m => this.messageAdded(m, newConversation));


           this.setState({boundConversations: new Set([...this.state.boundConversations, newConversation])});


       }


     }


 }





 componentDidUpdate = (oldProps, oldState) => {


   if (this.state.conversationProxy !== oldState.conversationProxy) {


       this.loadMessagesFor(this.state.conversationProxy);





       if (!this.state.boundConversations.has(this.state.conversationProxy)) {


           let newConversation = this.state.conversationProxy;


           newConversation.on('messageAdded', m => this.messageAdded(m, newConversation));


           this.setState({boundConversations: new Set([...this.state.boundConversations, newConversation])});


       }


   }


 };





 static getDerivedStateFromProps(newProps, oldState) {


   let logic = (oldState.loadingState === 'initializing') || oldState.conversationProxy !== newProps.conversationProxy;


   if (logic) {


     return { loadingState: 'loading messages', conversationProxy: newProps.conversationProxy };


   } else {


     return null;


   }


 }





 messageAdded = (message, targetConversation) => {


   if (targetConversation === this.state.conversationProxy)


       this.setState((prevState, props) => ({


           messages: [...prevState.messages, message]


       }));


 };





 onMessageChanged = event => {


   this.setState({ newMessage: event.target.value });


 };





 sendMessage = event => {


   event.preventDefault();


   const message = this.state.newMessage;


   this.setState({ newMessage: '' });


   this.state.conversationProxy.sendMessage(message);


 };





 onDrop = acceptedFiles => {


   this.state.conversationProxy.sendMessage({contentType: acceptedFiles[0].type, media: acceptedFiles[0]});


 };





 render = () => {


   return (


       <Dropzone


           onDrop={this.onDrop}


           accept="image/*">


         {({getRootProps, getInputProps, isDragActive}) => (


             <div


                 {...getRootProps()}


                 onClick={() => {


                 }}


                 id="OpenChannel"


                 style={{position: "relative", top: 0}}>





               {isDragActive &&


               <div className={styles.drop}>


                 <Icon type={"cloud-upload"}


                       style={{fontSize: "5em", color: "#fefefe"}}/>


                 <h3 style={{color: "#fefefe"}}>Release to Upload</h3>


               </div>


               }


               <div


                   className={styles.messages}


                   style={{


                     filter: `blur(${isDragActive ? 4 : 0}px)`,


                   }}


               >


                 <input id="files" {...getInputProps()} />


                 <div style={{flexBasis: "100%", flexGrow: 2, flexShrink: 1, overflowY: "scroll"}}>


                   <ConversationsMessages


                       identity={this.props.myIdentity}


                       messages={this.state.messages}/>


                 </div>


                 <div>


                   <Form onSubmit={this.sendMessage}>


                     <Input.Group compact={true} style={{


                       width: "100%",


                       display: "flex",


                       flexDirection: "row"


                     }}>


                       <Input


                           style={{flexBasis: "100%"}}


                           placeholder={"Type your message here..."}


                           type={"text"}


                           name={"message"}


                           id={styles['type-a-message']}


                           autoComplete={"off"}


                           disabled={this.state.loadingState !== 'ready'}


                           onChange={this.onMessageChanged}


                           value={this.state.newMessage}


                       />


                       <Button icon="enter" htmlType="submit" type={"submit"}/>


                     </Input.Group>


                   </Form>


                 </div>


               </div>


             </div>


         )}





       </Dropzone>


   );


 }


}





Conversation.propTypes = {


 myIdentity: PropTypes.string.isRequired


};





export default Conversation;

Conclusion/Next Steps
Now that you've seen how the Conversations JavaScript Quickstart implements several key pieces of functionality, you can see how to add the Conversations SDK to your React or JavaScript project. You can re-use these React components within your own web application's front end. If you're using Angular or Vue, some of the patterns in this React project should be applicable to your solution.
For more information, check out these helpful links:
Twilio Conversations Quickstart
Initializing Conversations SDK Clients
Creating Access Tokens
Best Practices Using the Conversations SDK

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Exploring the Conversations JavaScript Quickstart | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
API Base URL
Authentication
Resources
Getting started
The Conversations API Overview

The Conversations API allows you to create conversational (back-and-forth) messaging across multiple channels: Chat, WhatsApp, and SMS.

API Base URL
All URLs in the reference documentation use the following base URL:
Copy code block
https://conversations.twilio.com/v1


(information)
Info
You can control your connectivity into Twilio's platform by including your specific edge location in the subdomain. This will allow you to bring Twilio's public or private network connectivity closer to your applications for improved performance.
For instance customers with infrastructure in Australia can make use of the sydney edge location by using the base url of:
Copy code block
https://conversations.sydney.us1.twilio.com/v1

Authentication
To authenticate requests to the Twilio APIs, Twilio supports HTTP Basic authentication
. Use your API key as the username and your API key secret as the password. You can create an API key either in the Twilio Console or using the API.
Note: Twilio recommends using API keys for authentication in production apps. For local testing, you can use your Account SID as the username and your Auth token as the password. You can find your Account SID and Auth Token in the Twilio Console
.
Learn more about Twilio API authentication.

Resources
The Conversation resource is the primary resource, representing a unique thread of a conversation.
A Conversation has the following sub-resources:
Conversation Participants
Conversation Messages
Conversation-Scoped Webhooks.
The Conversation Webhook resource covers webhook configurations for all Conversations.

Getting started
Refer to our quickstart guide for a step by step introduction to Conversations and an overview of commonly used features.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
The Conversations API Overview | Twilio
​​Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
API Base URL
Using the shortened base URL
Message Properties
Create a ConversationMessage resource
Headers
Path parameters
Request body parameters
Fetch a ConversationMessage resource
Path parameters
List all Conversation Message(s)
Path parameters
Query parameters
Update a ConversationMessage resource
Headers
Path parameters
Request body parameters
Delete a ConversationMessage resource
Headers
Path parameters
Conversation Message Resource

API Base URL
All URLs in the reference documentation use the following base URL:
Copy code block
https://conversations.twilio.com/v1
Using the shortened base URL
Using the REST API, you can interact with Conversation Message resources in the default Conversation Service instance via a "shortened" URL that does not include the Conversation Service instance SID ("ISXXX..."). If you are only using one Conversation Service (the default), you do not need to include the Conversation Service SID in your URL, e.g.
Copy code block
GET /v1/Conversations/CHxx/Messages


For Conversations applications that build on more than one Conversation Service instance, you will need to specify the Conversation Service SID in the REST API call:
Copy code block
GET /v1/Services/ISxx/Conversations/CHxx/Messages

Message Properties
Property nameTypeRequiredDescriptionChild properties
accountSidSID<AC>
Optional
Not PII
The unique ID of the Account responsible for this message.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidSID<CH>
Optional
Not PII
The unique ID of the Conversation for this message.
Pattern:^CH[0-9a-fA-F]{32}$Min length:34Max length:34

sidSID<IM>
Optional
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^IM[0-9a-fA-F]{32}$Min length:34Max length:34

indexinteger
Optional
Not PII
The index of the message within the Conversation. Indices may skip numbers, but will always be in order of when the message was received.
Default:0

authorstring
Optional
PII MTL: 30 days
The channel specific identifier of the message's author. Defaults to system.

bodystring
Optional
PII MTL: 30 days
The content of the message, can be up to 1,600 characters long.

mediaarray[object]
Optional
PII MTL: 30 days
An array of objects that describe the Message's media, if the message contains media. Each object contains these fields: content_type with the MIME type of the media, filename with the name of the media, sid with the SID of the Media resource, and size with the media object's file size in bytes. If the Message has no media, this value is null.

attributesstring
Optional
PII MTL: 30 days
A string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set "{}" will be returned.

participantSidSID<MB>
Optional
Not PII
The unique ID of messages's author participant. Null in case of system sent message.
Pattern:^MB[0-9a-fA-F]{32}$Min length:34Max length:34

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated. null if the message has not been edited.

urlstring<uri>
Optional
Not PII
An absolute API resource API URL for this message.

deliveryobject
Optional
Not PII
An object that contains the summary of delivery statuses for the message to non-chat participants.

linksobject<uri-map>
Optional
Not PII
Contains an absolute API resource URL to access the delivery & read receipts of this message.

contentSidSID<HX>
Optional
Not PII
The unique ID of the multi-channel Rich Content template.
Pattern:^HX[0-9a-fA-F]{32}$Min length:34Max length:34

Create a ConversationMessage resource
POST https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Messages
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Path parameters
Property nameTypeRequiredPIIDescription
conversationSidstring
required
Not PII
The unique ID of the Conversation for this message.
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
authorstring
Optional
PII MTL: 30 days
The channel specific identifier of the message's author. Defaults to system.

bodystring
Optional
PII MTL: 30 days
The content of the message, can be up to 1,600 characters long.

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated. null if the message has not been edited.

attributesstring
Optional
PII MTL: 30 days
A string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set "{}" will be returned.

mediaSidSID<ME>
Optional
Not PII
The Media SID to be attached to the new Message.
Pattern:^ME[0-9a-fA-F]{32}$Min length:34Max length:34

contentSidSID<HX>
Optional
Not PII
The unique ID of the multi-channel Rich Content template, required for template-generated messages. Note that if this field is set, Body and MediaSid parameters are ignored.
Pattern:^HX[0-9a-fA-F]{32}$Min length:34Max length:34

contentVariablesstring
Optional
Not PII
A structurally valid JSON string that contains values to resolve Rich Content template variables.

subjectstring
Optional
Not PII
The subject of the message, can be up to 256 characters long.
Create a Conversation Message
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationMessage() {


 const message = await client.conversations.v1


   .conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .messages.create({


     author: "smee",


     body: "Ahoy there!",


   });





 console.log(message.sid);


}





createConversationMessage();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "body": "Ahoy there!",


 "media": null,


 "author": "smee",


 "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "attributes": "{ \"importance\": \"high\" }",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "index": 0,


 "delivery": {


   "total": 2,


   "sent": "all",


   "delivered": "some",


   "read": "some",


   "failed": "none",


   "undelivered": "none"


 },


 "content_sid": null,


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",


   "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"


 }


}

Fetch a ConversationMessage resource
GET https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Messages/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
conversationSidstring
required
Not PII
The unique ID of the Conversation for this message.

sidSID<IM>
required
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^IM[0-9a-fA-F]{32}$Min length:34Max length:34
Fetch a Conversation Message
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchConversationMessage() {


 const message = await client.conversations.v1


   .conversations("ConversationSid")


   .messages("IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .fetch();





 console.log(message.accountSid);


}





fetchConversationMessage();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "body": "Welcome!",


 "media": null,


 "author": "system",


 "participant_sid": null,


 "attributes": "{ \"importance\": \"high\" }",


 "date_created": "2016-03-24T20:37:57Z",


 "date_updated": "2016-03-24T20:37:57Z",


 "index": 0,


 "delivery": {


   "total": 2,


   "sent": "all",


   "delivered": "some",


   "read": "some",


   "failed": "none",


   "undelivered": "none"


 },


 "content_sid": null,


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",


   "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"


 }


}

List all Conversation Message(s)
GET https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Messages
Path parameters
Property nameTypeRequiredPIIDescription
conversationSidstring
required
Not PII
The unique ID of the Conversation for messages.
Query parameters
Property nameTypeRequiredPIIDescription
orderenum<string>
Optional
Not PII
The sort order of the returned messages. Can be: asc (ascending) or desc (descending), with asc as the default.
Possible values:
ascdesc

pageSizeinteger<int64>
Optional
Not PII
How many resources to return in each list page. The default is 50, and the maximum is 100.
Minimum:1Maximum:100

pageinteger
Optional
Not PII
The page index. This value is simply for client state.
Minimum:0

pageTokenstring
Optional
Not PII
The page token. This is provided by the API.
List all Conversation Messages
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function listConversationMessage() {


 const messages = await client.conversations.v1


   .conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .messages.list({ limit: 20 });





 messages.forEach((m) => console.log(m.accountSid));


}





listConversationMessage();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "meta": {


   "page": 0,


   "page_size": 50,


   "first_page_url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages?PageSize=50&Page=0",


   "previous_page_url": null,


   "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages?PageSize=50&Page=0",


   "next_page_url": null,


   "key": "messages"


 },


 "messages": [


   {


     "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "body": "I like pie.",


     "media": null,


     "author": "pie_preferrer",


     "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "attributes": "{ \"importance\": \"high\" }",


     "date_created": "2016-03-24T20:37:57Z",


     "date_updated": "2016-03-24T20:37:57Z",


     "index": 0,


     "delivery": {


       "total": 2,


       "sent": "all",


       "delivered": "some",


       "read": "some",


       "failed": "none",


       "undelivered": "none"


     },


     "content_sid": null,


     "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "links": {


       "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",


       "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"


     }


   },


   {


     "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "body": "Cake is my favorite!",


     "media": null,


     "author": "cake_lover",


     "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "attributes": "{ \"importance\": \"high\" }",


     "date_created": "2016-03-24T20:38:21Z",


     "date_updated": "2016-03-24T20:38:21Z",


     "index": 5,


     "delivery": {


       "total": 2,


       "sent": "all",


       "delivered": "some",


       "read": "some",


       "failed": "none",


       "undelivered": "none"


     },


     "content_sid": null,


     "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "links": {


       "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",


       "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"


     }


   },


   {


     "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "body": null,


     "media": [


       {


         "sid": "MEaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


         "size": 42056,


         "content_type": "image/jpeg",


         "filename": "car.jpg"


       }


     ],


     "author": "cake_lover",


     "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "attributes": "{ \"importance\": \"high\" }",


     "date_created": "2016-03-24T20:38:21Z",


     "date_updated": "2016-03-24T20:38:21Z",


     "index": 9,


     "delivery": {


       "total": 2,


       "sent": "all",


       "delivered": "some",


       "read": "some",


       "failed": "none",


       "undelivered": "none"


     },


     "content_sid": null,


     "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "links": {


       "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",


       "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"


     }


   }


 ]


}
Fetch the latest Conversation Message
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function listConversationMessage() {


 const messages = await client.conversations.v1


   .conversations("ConversationSid")


   .messages.list({


     order: "desc",


     limit: 20,


   });





 messages.forEach((m) => console.log(m.accountSid));


}





listConversationMessage();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "meta": {


   "page": 0,


   "page_size": 1,


   "first_page_url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages?Order=desc&PageSize=1&Page=0",


   "previous_page_url": null,


   "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages?Order=desc&PageSize=1&Page=0",


   "next_page_url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages?Order=desc&PageSize=1&Page=1&PageToken=PAIMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


   "key": "messages"


 },


 "messages": [


   {


     "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "body": null,


     "media": [


       {


         "sid": "MEaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


         "size": 42056,


         "content_type": "image/jpeg",


         "filename": "car.jpg"


       }


     ],


     "author": "cake_lover",


     "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "attributes": "{ \"importance\": \"high\" }",


     "date_created": "2016-03-24T20:38:21Z",


     "date_updated": "2016-03-24T20:38:21Z",


     "index": 9,


     "delivery": {


       "total": 2,


       "sent": "all",


       "delivered": "some",


       "read": "some",


       "failed": "none",


       "undelivered": "none"


     },


     "content_sid": null,


     "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "links": {


       "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",


       "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"


     }


   }


 ]


}

Update a ConversationMessage resource
POST https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Messages/{Sid}
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Path parameters
Property nameTypeRequiredPIIDescription
conversationSidstring
required
Not PII
The unique ID of the Conversation for this message.

sidSID<IM>
required
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^IM[0-9a-fA-F]{32}$Min length:34Max length:34
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
authorstring
Optional
PII MTL: 30 days
The channel specific identifier of the message's author. Defaults to system.

bodystring
Optional
PII MTL: 30 days
The content of the message, can be up to 1,600 characters long.

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated. null if the message has not been edited.

attributesstring
Optional
PII MTL: 30 days
A string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set "{}" will be returned.

subjectstring
Optional
Not PII
The subject of the message, can be up to 256 characters long.
Update a Conversation Message
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateConversationMessage() {


 const message = await client.conversations.v1


   .conversations("ConversationSid")


   .messages("IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .update({


     author: "regretfulUser",


     body: "I take back what I said",


   });





 console.log(message.accountSid);


}





updateConversationMessage();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "body": "I take back what I said",


 "media": null,


 "author": "regretfulUser",


 "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "attributes": "{ \"importance\": \"high\" }",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "index": 0,


 "delivery": {


   "total": 2,


   "sent": "all",


   "delivered": "some",


   "read": "some",


   "failed": "none",


   "undelivered": "none"


 },


 "content_sid": null,


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",


   "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"


 }


}

Delete a ConversationMessage resource
DELETE https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Messages/{Sid}
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Path parameters
Property nameTypeRequiredPIIDescription
conversationSidstring
required
Not PII
The unique ID of the Conversation for this message.

sidSID<IM>
required
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^IM[0-9a-fA-F]{32}$Min length:34Max length:34
Delete a Conversation Message
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function deleteConversationMessage() {


 await client.conversations.v1


   .conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .messages("IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .remove();


}





deleteConversationMessage();

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Conversation Message Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Authentication
Properties
Create/Upload a new Media resource
Headers
Body
Curl Example
Retrieve a Media resource
Curl Example for retrieving a media resource
Conversations Media Resource

The Media resource in Twilio's Media Content Service allows you to upload/download files for use in other Twilio products. You can attach these media files to Conversation Messages as part of the Media Messaging feature.
Note: The Media REST resource is accessed via a separate sub-domain from Chat and other Twilio products. The base URL for Media via the Media Content Service (MCS) is:
Copy code block
https://mcs.us1.twilio.com/v1

Authentication
To authenticate requests to the Twilio APIs, Twilio supports HTTP Basic authentication
. Use your API key as the username and your API key secret as the password. You can create an API key either in the Twilio Console or using the API.
Note: Twilio recommends using API keys for authentication in production apps. For local testing, you can use your Account SID as the username and your Auth token as the password. You can find your Account SID and Auth Token in the Twilio Console
.
Learn more about Twilio API authentication.
Copy code block
curl -G https://mcs.us1.twilio.com/v1/Services \


   -u $TWILIO_API_KEY:$TWILIO_API_KEY_SECRET
(information)
Info
The Twilio Helper Libraries or Twilio CLI don't support the Media resource.

Properties
Each Media resource instance has these properties:
name
description
sid
A 34-character string that uniquely identifies this resource.
account_sid
The unique id of the Account responsible for this message.
service_sid
The unique id of the Chat Service this message belongs to.
date_created
The date that this resource was created.
date_updated
The date that this resource was last updated, null if the message has not been edited.
channel_sid
The unique id of the Conversation (same as the underlying Chat Channel) containing the Message that this media instance was added to.
message_sid
The unique id of the Conversation Message this media instance was added to.
size
The size of the file this Media instance represents in BYTES
content_type
The MIME type of the file this Media instance represents. Please refer to the MIME Types
 for a list of valid MIME types.
file_name
The filename of the underlying media file as specified when uploaded
author
The identity of the User that uploaded the Media instance. This is automatically set to sender when using the REST API.
url
An absolute URL for this media instance
links
Links to access the underlying media file (content) and a temporary URL to use to access this (content_direct_temporary)


Create/Upload a new Media resource
Copy code block
POST /Services/{Chat Service SID}/Media
Note: The Chat Service SID must be the Chat Service Instance that this Media instance will be used for. You can find the Chat Service SID as a property of the Conversation to which you want to add a new media message.
To create a new media instance, you should upload the media file itself as content on the POST request. (See Curl Example below.)
Ultimately, this will be converted into a POST request, containing the following headers and the file itself as the request body.
Headers
name
description
Content-Type
The MIME type of the file this Media instance represents. Please refer to the MIME Types
 for a list of valid MIME types. This should be set explicitly by the API caller or automatically detected by the client.
Content-Size
The size of the media (the file) being uploaded in bytes

Body
The body or content of the POST must be the file itself in binary format.
Curl Example
Copy code block
curl -u "<account_sid>:<account_secret>" --data-binary @<filename.png> -H "Content-Type: <content-type of upload>" https://mcs.us1.twilio.com/v1/Services/<chat_service_sid>/Media

Retrieve a Media resource
You can retrieve an uploaded Media resource by issuing a GET request with the SID of the media instance:
Copy code block
GET /Services/{Chat Service SID}/Media/{Media SID}
Curl Example for retrieving a media resource
Copy code block
curl -u “<account_sid>:<account_secret>” -G https://mcs.us1.twilio.com/v1/Services/<chat_service_sid>/Media/<Media SID>

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Conversations Media Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
API Base URL
Using the shortened base URL
Participant Properties
Add a Conversation Participant (SMS)
Headers
Path parameters
Request body parameters
Fetch a ConversationParticipant resource
Path parameters
Read multiple ConversationParticipant resources
Path parameters
Query parameters
Update a ConversationParticipant resource
Headers
Path parameters
Request body parameters
Delete a ConversationParticipant resource
Headers
Path parameters
Conversation Participant Resource

Each Participant in a Conversation represents one real (probably human) participant in a Conversation.
Creating a Participant joins them with the conversation, and the connected person will receive all subsequent messages.
Deleting a participant removes them from the conversation. They will receive no new messages after that point, but their previous messages will remain in the conversation.

API Base URL
All URLs in the reference documentation use the following base URL:
Copy code block
https://conversations.twilio.com/v1
Using the shortened base URL
Using the REST API, you can interact with Conversation Participant resources in the default Conversation Service instance via a "shortened" URL that does not include the Conversation Service instance SID ("ISXXX..."). If you are only using one Conversation Service (the default), you do not need to include the Conversation Service SID in your URL, e.g.
Copy code block
GET /v1/Conversations/CHxx/Participants


For Conversations applications that build on more than one Conversation Service instance, you will need to specify the Conversation Service SID in the REST API call:
Copy code block
GET /v1/Services/ISxx/Conversations/CHxx/Participants

Participant Properties
Property nameTypeRequiredDescriptionChild properties
accountSidSID<AC>
Optional
Not PII
The unique ID of the Account responsible for this participant.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidSID<CH>
Optional
Not PII
The unique ID of the Conversation for this participant.
Pattern:^CH[0-9a-fA-F]{32}$Min length:34Max length:34

sidSID<MB>
Optional
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^MB[0-9a-fA-F]{32}$Min length:34Max length:34

identitystring
Optional
PII MTL: 30 days
A unique string identifier for the conversation participant as Conversation User. This parameter is non-null if (and only if) the participant is using the Conversations SDK to communicate. Limited to 256 characters.

attributesstring
Optional
PII MTL: 30 days
An optional string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set "{}" will be returned.

messagingBindingobject
Optional
PII MTL: 30 days
Information about how this participant exchanges messages with the conversation. A JSON parameter consisting of type and address fields of the participant.

roleSidSID<RL>
Optional
Not PII
The SID of a conversation-level Role to assign to the participant.
Pattern:^RL[0-9a-fA-F]{32}$Min length:34Max length:34

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated.

urlstring<uri>
Optional
Not PII
An absolute API resource URL for this participant.

lastReadMessageIndexinteger
Optional
Not PII
Index of last “read” message in the Conversation for the Participant.

lastReadTimestampstring
Optional
Not PII
Timestamp of last “read” message in the Conversation for the Participant.

Add a Conversation Participant (SMS)
POST https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Participants
Adding a new participant to an ongoing conversation immediately allows them to see all subsequent communications. The same person (i.e., a single personal phone number) can be part of any number of conversations concurrently, as long as the address they are in contact with (the ProxyAddress) is unique.
To create a Conversation Participant by SMS, you must enter:
Their phone number as the messagingbinding.address
Your Twilio number as the messagingbinding.proxyaddress.
To create a Conversation Participant by Chat, you must enter the Chat User Identity as the identity parameter.
We recommend following the standard URI specification and avoid the following reserved characters ! * ' ( ) ; : @ & = + $ , / ? % # [ ] for values such as identity and friendly name.
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Path parameters
Property nameTypeRequiredPIIDescription
conversationSidstring
required
Not PII
The unique ID of the Conversation for this participant.
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
identitystring
Optional
PII MTL: 30 days
A unique string identifier for the conversation participant as Conversation User. This parameter is non-null if (and only if) the participant is using the Conversations SDK to communicate. Limited to 256 characters.

messagingBinding.addressstring
Optional
Not PII
The address of the participant's device, e.g. a phone or WhatsApp number. Together with the Proxy address, this determines a participant uniquely. This field (with proxy_address) is only null when the participant is interacting from an SDK endpoint (see the 'identity' field).

messagingBinding.proxyAddressstring
Optional
Not PII
The address of the Twilio phone number (or WhatsApp number) that the participant is in contact with. This field, together with participant address, is only null when the participant is interacting from an SDK endpoint (see the 'identity' field).

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated.

attributesstring
Optional
PII MTL: 30 days
An optional string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set "{}" will be returned.

messagingBinding.projectedAddressstring
Optional
Not PII
The address of the Twilio phone number that is used in Group MMS. Communication mask for the Conversation participant with Identity.

roleSidSID<RL>
Optional
Not PII
The SID of a conversation-level Role to assign to the participant.
Pattern:^RL[0-9a-fA-F]{32}$Min length:34Max length:34
Create Conversation Participant (SMS)
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationParticipant() {


 const participant = await client.conversations.v1


   .conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .participants.create({


     "messagingBinding.address": "+15558675310",


     "messagingBinding.proxyAddress": "<Your Twilio Number>",


   });





 console.log(participant.sid);


}





createConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "identity": null,


 "attributes": "{ \"role\": \"driver\" }",


 "messaging_binding": {


   "type": "sms",


   "address": "+15558675310",


   "proxy_address": "+15017122661"


 },


 "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}
Create Conversation Participant (Chat)
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationParticipant() {


 const participant = await client.conversations.v1


   .conversations("ConversationSid")


   .participants.create({ identity: "<Chat User Identity>" });





 console.log(participant.sid);


}





createConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "identity": "<Chat User Identity>",


 "attributes": "{ \"role\": \"driver\" }",


 "messaging_binding": null,


 "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}

Fetch a ConversationParticipant resource
GET https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Participants/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
conversationSidstring
required
Not PII
The unique ID of the Conversation for this participant.

sidstring
required
Not PII
A 34 character string that uniquely identifies this resource. Alternatively, you can pass a Participant's identity rather than the SID.
Fetch Conversation Participant by SID
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchConversationParticipant() {


 const participant = await client.conversations.v1


   .conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .participants("MBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .fetch();





 console.log(participant.accountSid);


}





fetchConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "sid": "MBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "identity": null,


 "attributes": "{ \"role\": \"driver\" }",


 "messaging_binding": {


   "type": "sms",


   "address": "+15558675310",


   "proxy_address": "+15017122661"


 },


 "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "date_created": "2016-03-24T21:05:50Z",


 "date_updated": "2016-03-24T21:05:50Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}
You can also fetch a Conversation Participant by their identity. Pass their identity as the value for the sid argument.
Fetch Conversation Participant by identity
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchConversationParticipant() {


 const participant = await client.conversations.v1


   .conversations("ConversationSid")


   .participants("alice")


   .fetch();





 console.log(participant.accountSid);


}





fetchConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "alice",


 "identity": "alice",


 "attributes": "{ \"role\": \"driver\" }",


 "messaging_binding": {


   "type": "sms",


   "address": "+15558675310",


   "proxy_address": "+15017122661"


 },


 "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "date_created": "2016-03-24T21:05:50Z",


 "date_updated": "2016-03-24T21:05:50Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}

Read multiple ConversationParticipant resources
GET https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Participants
Path parameters
Property nameTypeRequiredPIIDescription
conversationSidstring
required
Not PII
The unique ID of the Conversation for participants.
Query parameters
Property nameTypeRequiredPIIDescription
pageSizeinteger<int64>
Optional
Not PII
How many resources to return in each list page. The default is 50, and the maximum is 100.
Minimum:1Maximum:100

pageinteger
Optional
Not PII
The page index. This value is simply for client state.
Minimum:0

pageTokenstring
Optional
Not PII
The page token. This is provided by the API.
List Conversation Participant(s)
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function listConversationParticipant() {


 const participants = await client.conversations.v1


   .conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .participants.list({ limit: 20 });





 participants.forEach((p) => console.log(p.accountSid));


}





listConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "meta": {


   "page": 0,


   "page_size": 50,


   "first_page_url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants?PageSize=50&Page=0",


   "previous_page_url": null,


   "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants?PageSize=50&Page=0",


   "next_page_url": null,


   "key": "participants"


 },


 "participants": [


   {


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "identity": null,


     "attributes": "{ \"role\": \"driver\" }",


     "messaging_binding": {


       "type": "sms",


       "address": "+15558675310",


       "proxy_address": "+15017122661"


     },


     "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "date_created": "2016-03-24T21:05:50Z",


     "date_updated": "2016-03-24T21:05:50Z",


     "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "last_read_message_index": null,


     "last_read_timestamp": null


   },


   {


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "identity": "IDENTITY",


     "attributes": "{ \"role\": \"driver\" }",


     "messaging_binding": null,


     "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "date_created": "2016-03-24T21:05:50Z",


     "date_updated": "2016-03-24T21:05:50Z",


     "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "last_read_message_index": null,


     "last_read_timestamp": null


   }


 ]


}

Update a ConversationParticipant resource
POST https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Participants/{Sid}
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Path parameters
Property nameTypeRequiredPIIDescription
conversationSidstring
required
Not PII
The unique ID of the Conversation for this participant.

sidstring
required
Not PII
A 34 character string that uniquely identifies this resource.
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated.

attributesstring
Optional
PII MTL: 30 days
An optional string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set "{}" will be returned.

roleSidSID<RL>
Optional
Not PII
The SID of a conversation-level Role to assign to the participant.
Pattern:^RL[0-9a-fA-F]{32}$Min length:34Max length:34

messagingBinding.proxyAddressstring
Optional
Not PII
The address of the Twilio phone number that the participant is in contact with. 'null' value will remove it.

messagingBinding.projectedAddressstring
Optional
Not PII
The address of the Twilio phone number that is used in Group MMS. 'null' value will remove it.

identitystring
Optional
PII MTL: 30 days
A unique string identifier for the conversation participant as Conversation User. This parameter is non-null if (and only if) the participant is using the Conversations SDK to communicate. Limited to 256 characters.

lastReadMessageIndexinteger
Optional
Not PII
Index of last “read” message in the Conversation for the Participant.

lastReadTimestampstring
Optional
Not PII
Timestamp of last “read” message in the Conversation for the Participant.
Update Conversation Participant
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateConversationParticipant() {


 const participant = await client.conversations.v1


   .conversations("ConversationSid")


   .participants("Sid")


   .update({ dateUpdated: new Date("2019-05-15 13:37:35") });





 console.log(participant.accountSid);


}





updateConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "Sid",


 "identity": null,


 "attributes": "{ \"role\": \"driver\" }",


 "messaging_binding": {


   "type": "sms",


   "address": "+15558675310",


   "proxy_address": "+15017122661"


 },


 "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2019-05-15T13:37:35Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}
Update attributes for a Conversation Participant
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateConversationParticipant() {


 const participant = await client.conversations.v1


   .conversations("ConversationSid")


   .participants("Sid")


   .update({ attributes: JSON.stringify({ role: "driver" }) });





 console.log(participant.accountSid);


}





updateConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "Sid",


 "identity": null,


 "attributes": "{\"role\": \"driver\"}",


 "messaging_binding": {


   "type": "sms",


   "address": "+15558675310",


   "proxy_address": "+15017122661"


 },


 "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}

Delete a ConversationParticipant resource
DELETE https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Participants/{Sid}
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Path parameters
Property nameTypeRequiredPIIDescription
conversationSidstring
required
Not PII
The unique ID of the Conversation for this participant.

sidstring
required
Not PII
A 34 character string that uniquely identifies this resource.
Delete Conversation Participant
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function deleteConversationParticipant() {


 await client.conversations.v1


   .conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .participants("MBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .remove();


}





deleteConversationParticipant();

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Conversation Participant Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
API Base URL
Using the shortened base URL
ConversationWithParticipant Properties
Create a Conversation with Participants resource
Headers
Request body parameters
Conversation with Participants Resource

The ConversationWithParticipants resource accepts all the details for a conversation and allows up to 10 participants in one request. It is especially helpful for situations where you want to send group texts. It helps prevent issues that might occur with existing conversations when you add participants individually.

API Base URL
All URLs in the reference documentation use the following base URL:
Copy code block
https://conversations.twilio.com/v1
Using the shortened base URL
Using the REST API, you can create Conversation with Participants in the default Conversation Service instance via a "shortened" URL that doesn't include the Conversation Service instance SID (ISXXX...). If you are only using one Conversation Service (the default), you don't need to include the Conversation Service SID in your URL, e.g.
Copy code block
POST /v1/ConversationWithParticipants
For Conversations applications that build on more than one Conversation Service instance, you will need to specify the Conversation Service SID in the REST API call:
Copy code block
POST /v1/Services/ISxx/ConversationWithParticipants

ConversationWithParticipant Properties
Property nameTypeRequiredDescriptionChild properties
accountSidSID<AC>
Optional
Not PII
The unique ID of the Account responsible for this conversation.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

chatServiceSidSID<IS>
Optional
Not PII
The unique ID of the Conversation Service this conversation belongs to.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

messagingServiceSidSID<MG>
Optional
Not PII
The unique ID of the Messaging Service this conversation belongs to.
Pattern:^MG[0-9a-fA-F]{32}$Min length:34Max length:34

sidSID<CH>
Optional
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^CH[0-9a-fA-F]{32}$Min length:34Max length:34

friendlyNamestring
Optional
PII MTL: 30 days
The human-readable name of this conversation, limited to 256 characters. Optional.

uniqueNamestring
Optional
PII MTL: 30 days
An application-defined string that uniquely identifies the resource. It can be used to address the resource in place of the resource's sid in the URL.

attributesstring
Optional
PII MTL: 30 days
An optional string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set "{}" will be returned.

stateenum<string>
Optional
Not PII
Current state of this conversation. Can be either initializing, active, inactive or closed and defaults to active
Possible values:
inactiveactiveclosed

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated.

timersobject
Optional
Not PII
Timer date values representing state update for this conversation.

linksobject<uri-map>
Optional
Not PII
Contains absolute URLs to access the participants, messages and webhooks of this conversation.

bindingsobject
Optional
Not PII

urlstring<uri>
Optional
Not PII
An absolute API resource URL for this conversation.

Create a Conversation with Participants resource
POST https://conversations.twilio.com/v1/ConversationWithParticipants
This resource behaves differently than most other Conversations API resources. Here's how it works:
Parameter validation: It validates all conversation and participant parameters and returns various possible conversations errors.
Conversations are created synchronously: If the request is valid, a conversation will be created and returned in the response. This conversation will be in the state initializing while the participants are added. In this state, the conversation cannot be updated.
Participants are added to the conversation asynchronously: Once all participants are added, the conversation state will be set to active and the conversation can be used. Listening to the onConversationStateUpdated webhook event or polling the conversations GET endpoint are both acceptable ways to check if the conversation is ready to be used.
System Errors: If any unexpected errors happen while adding the participants, the conversation state will be set to closed. You can view the error logs in the Twilio Console
, and in your webhook notifications if you subscribe to them.
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
friendlyNamestring
Optional
PII MTL: 30 days
The human-readable name of this conversation, limited to 256 characters. Optional.

uniqueNamestring
Optional
PII MTL: 30 days
An application-defined string that uniquely identifies the resource. It can be used to address the resource in place of the resource's sid in the URL.

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated.

messagingServiceSidSID<MG>
Optional
Not PII
The unique ID of the Messaging Service this conversation belongs to.
Pattern:^MG[0-9a-fA-F]{32}$Min length:34Max length:34

attributesstring
Optional
PII MTL: 30 days
An optional string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set "{}" will be returned.

stateenum<string>
Optional
Not PII
Current state of this conversation. Can be either initializing, active, inactive or closed and defaults to active
Possible values:
inactiveactiveclosed

timers.inactivestring
Optional
Not PII
ISO8601 duration when conversation will be switched to inactive state. Minimum value for this timer is 1 minute.

timers.closedstring
Optional
Not PII
ISO8601 duration when conversation will be switched to closed state. Minimum value for this timer is 10 minutes.

bindings.email.addressstring
Optional
Not PII
The default email address that will be used when sending outbound emails in this conversation.

bindings.email.namestring
Optional
Not PII
The default name that will be used when sending outbound emails in this conversation.

participantarray[string]
Optional
Not PII
The participant to be added to the conversation in JSON format. The JSON object attributes are as parameters in Participant Resource. The maximum number of participants that can be added in a single request is 10.
Create Conversation with Participants
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationWithParticipants() {


 const conversationWithParticipant =


   await client.conversations.v1.conversationWithParticipants.create({


     friendlyName: "Friendly Conversation",


     participant: [


       '{"messaging_binding": {"address": "<External Participant Number>", "proxy_address": "<Your Twilio Number>"}}',


       '{"identity": "<Chat User Identity>"}',


     ],


   });





 console.log(conversationWithParticipant.sid);


}





createConversationWithParticipants();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "Friendly Conversation",


 "unique_name": "unique_name",


 "attributes": "{ \"topic\": \"feedback\" }",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "state": "inactive",


 "timers": {


   "date_inactive": "2015-12-16T22:19:38Z",


   "date_closed": "2015-12-16T22:28:38Z"


 },


 "bindings": {},


 "links": {


   "participants": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",


   "messages": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",


   "webhooks": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks"


 },


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}
Create GMMS Conversation with Participants
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationWithParticipants() {


 const conversationWithParticipant =


   await client.conversations.v1.conversationWithParticipants.create({


     friendlyName: "Friendly Conversation",


     participant: [


       '{"messaging_binding": {"address": "<External Participant Number>"}}',


       '{"messaging_binding": {"address": "<External Participant Number>"}}',


       '{"messaging_binding": {"projected_address": "<Your Twilio Number>"}}',


     ],


   });





 console.log(conversationWithParticipant.sid);


}





createConversationWithParticipants();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "Friendly Conversation",


 "unique_name": "unique_name",


 "attributes": "{ \"topic\": \"feedback\" }",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "state": "inactive",


 "timers": {


   "date_inactive": "2015-12-16T22:19:38Z",


   "date_closed": "2015-12-16T22:28:38Z"


 },


 "bindings": {},


 "links": {


   "participants": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",


   "messages": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",


   "webhooks": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks"


 },


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Conversation with Participants Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
API Base URL
Using the shortened base URL
User Properties
Create a Conversations User
Headers
Request body parameters
Fetch a specific User Resource
Path parameters
Read multiple ConversationUser resources
Query parameters
Update a ConversationUser resource
Headers
Path parameters
Request body parameters
Delete a User resource
Headers
Path parameters
Conversations User Resource

In Conversations, Users are Participants with privileges such as the ability to edit and delete Messages.
Every Conversation Participant who connects with a Chat SDK (browser or mobile) is backed by a User. Participants over SMS or other non-chat channel, in contrast, do not have a corresponding User. Attached to the User is:
the Role assigned to the User, which determines their permissions in your application
a JSON blob of arbitrary Attributes, which you can use to store profile information for display in your application
Online/Offline status, determined by whether the User is presently connected through a frontend SDK
the Identity string, which uniquely identifies a user in each Conversation Service.
We recommend following the standard URI specification and avoid the following reserved characters ! * ' ( ) ; : @ & = + $ , / ? % # [ ] for values such as identity and friendly name.

API Base URL
All URLs in the reference documentation use the following base URL:
Copy code block
https://conversations.twilio.com/v1


Using the shortened base URL
Using the REST API, you can interact with User resources in the default Conversation Service instance via a "shortened" URL that does not include the Conversation Service instance SID ("ISXXX..."). If you are only using one Conversation Service (the default), you do not need to include the Conversation Service SID in your URL, e.g.
Copy code block
GET /v1/Users/


For Conversations applications that build on more than one Conversation Service instance, you will need to specify the Conversation Service SID in the REST API call:
Copy code block
GET /v1/Services/<Service SID, ISXXX...>/Users/

User Properties
Property nameTypeRequiredDescriptionChild properties
sidSID<US>
Optional
Not PII
The unique string that we created to identify the User resource.
Pattern:^US[0-9a-fA-F]{32}$Min length:34Max length:34

accountSidSID<AC>
Optional
Not PII
The SID of the Account that created the User resource.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

chatServiceSidSID<IS>
Optional
Not PII
The SID of the Conversation Service the User resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

roleSidSID<RL>
Optional
Not PII
The SID of a service-level Role assigned to the user.
Pattern:^RL[0-9a-fA-F]{32}$Min length:34Max length:34

identitystring
Optional
PII MTL: 30 days
The application-defined string that uniquely identifies the resource's User within the Conversation Service. This value is often a username or an email address, and is case-sensitive.

friendlyNamestring
Optional
PII MTL: 30 days
The string that you assigned to describe the resource.

attributesstring
Optional
PII MTL: 30 days
The JSON Object string that stores application-specific data. If attributes have not been set, {} is returned.

isOnlineboolean
Optional
Not PII
Whether the User is actively connected to this Conversations Service and online. This value is only returned by Fetch actions that return a single resource and null is always returned by a Read action. This value is null if the Service's reachability_enabled is false, if the User has never been online for this Conversations Service, even if the Service's reachability_enabled is true.

isNotifiableboolean
Optional
Not PII
Whether the User has a potentially valid Push Notification registration (APN or GCM) for this Conversations Service. If at least one registration exists, true; otherwise false. This value is only returned by Fetch actions that return a single resource and null is always returned by a Read action. This value is null if the Service's reachability_enabled is false, and if the User has never had a notification registration, even if the Service's reachability_enabled is true.

dateCreatedstring<date-time>
Optional
Not PII
The date and time in GMT when the resource was created specified in ISO 8601
 format.

dateUpdatedstring<date-time>
Optional
Not PII
The date and time in GMT when the resource was last updated specified in ISO 8601
 format.

urlstring<uri>
Optional
Not PII
An absolute API resource URL for this user.

linksobject<uri-map>
Optional
Not PII

Create a Conversations User
POST https://conversations.twilio.com/v1/Users
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
identitystring
required
PII MTL: 30 days
The application-defined string that uniquely identifies the resource's User within the Conversation Service. This value is often a username or an email address, and is case-sensitive.

friendlyNamestring
Optional
PII MTL: 30 days
The string that you assigned to describe the resource.

attributesstring
Optional
PII MTL: 30 days
The JSON Object string that stores application-specific data. If attributes have not been set, {} is returned.

roleSidSID<RL>
Optional
Not PII
The SID of a service-level Role to assign to the user.
Pattern:^RL[0-9a-fA-F]{32}$Min length:34Max length:34
Create a User
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createUser() {


 const user = await client.conversations.v1.users.create({


   identity: "RedgrenGrumbholdt",


 });





 console.log(user.sid);


}





createUser();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "USaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "identity": "RedgrenGrumbholdt",


 "friendly_name": "name",


 "attributes": "{ \"duty\": \"tech\" }",


 "is_online": true,


 "is_notifiable": null,


 "date_created": "2019-12-16T22:18:37Z",


 "date_updated": "2019-12-16T22:18:38Z",


 "url": "https://conversations.twilio.com/v1/Users/USaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "user_conversations": "https://conversations.twilio.com/v1/Users/USaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations"


 }


}

Fetch a specific User Resource
GET https://conversations.twilio.com/v1/Users/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
sidstring
required
Not PII
The SID of the User resource to fetch. This value can be either the sid or the identity of the User resource to fetch.
Fetch an User
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchUser() {


 const user = await client.conversations.v1.users("Sid").fetch();





 console.log(user.sid);


}





fetchUser();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "Sid",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "identity": "admin",


 "friendly_name": "name",


 "attributes": "{ \"duty\": \"tech\" }",


 "is_online": true,


 "is_notifiable": null,


 "date_created": "2019-12-16T22:18:37Z",


 "date_updated": "2019-12-16T22:18:38Z",


 "url": "https://conversations.twilio.com/v1/Users/USaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "user_conversations": "https://conversations.twilio.com/v1/Users/USaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations"


 }


}

Read multiple ConversationUser resources
GET https://conversations.twilio.com/v1/Users
Query parameters
Property nameTypeRequiredPIIDescription
pageSizeinteger<int64>
Optional
Not PII
How many resources to return in each list page. The default is 50, and the maximum is 50.
Minimum:1Maximum:50

pageinteger
Optional
Not PII
The page index. This value is simply for client state.
Minimum:0

pageTokenstring
Optional
Not PII
The page token. This is provided by the API.
List multiple Users
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function listUser() {


 const users = await client.conversations.v1.users.list({ limit: 20 });





 users.forEach((u) => console.log(u.sid));


}





listUser();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "meta": {


   "page": 0,


   "page_size": 50,


   "first_page_url": "https://conversations.twilio.com/v1/Users?PageSize=50&Page=0",


   "previous_page_url": null,


   "url": "https://conversations.twilio.com/v1/Users?PageSize=50&Page=0",


   "next_page_url": null,


   "key": "users"


 },


 "users": [


   {


     "sid": "USaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "identity": "admin",


     "friendly_name": "name",


     "attributes": "{ \"duty\": \"tech\" }",


     "is_online": true,


     "is_notifiable": null,


     "date_created": "2019-12-16T22:18:37Z",


     "date_updated": "2019-12-16T22:18:38Z",


     "url": "https://conversations.twilio.com/v1/Users/USaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "links": {


       "user_conversations": "https://conversations.twilio.com/v1/Users/USaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations"


     }


   },


   {


     "sid": "USaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "identity": "agent0034",


     "friendly_name": "John from customs",


     "attributes": "{ \"duty\": \"agent\" }",


     "is_online": false,


     "is_notifiable": null,


     "date_created": "2020-03-24T20:38:21Z",


     "date_updated": "2020-03-24T20:38:21Z",


     "url": "https://conversations.twilio.com/v1/Users/USaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "links": {


       "user_conversations": "https://conversations.twilio.com/v1/Users/USaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations"


     }


   }


 ]


}

Update a ConversationUser resource
POST https://conversations.twilio.com/v1/Users/{Sid}
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Path parameters
Property nameTypeRequiredPIIDescription
sidstring
required
Not PII
The SID of the User resource to update. This value can be either the sid or the identity of the User resource to update.
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
friendlyNamestring
Optional
PII MTL: 30 days
The string that you assigned to describe the resource.

attributesstring
Optional
PII MTL: 30 days
The JSON Object string that stores application-specific data. If attributes have not been set, {} is returned.

roleSidSID<RL>
Optional
Not PII
The SID of a service-level Role to assign to the user.
Pattern:^RL[0-9a-fA-F]{32}$Min length:34Max length:34
Update a User
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateUser() {


 const user = await client.conversations.v1.users("Sid").update({


   friendlyName: "new name",


   roleSid: "RLXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 });





 console.log(user.sid);


}





updateUser();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "Sid",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "role_sid": "RLXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "identity": "admin",


 "friendly_name": "new name",


 "attributes": "{ \"duty\": \"tech\", \"team\": \"internals\" }",


 "is_online": true,


 "is_notifiable": null,


 "date_created": "2019-12-16T22:18:37Z",


 "date_updated": "2019-12-16T22:18:38Z",


 "url": "https://conversations.twilio.com/v1/Users/USaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "user_conversations": "https://conversations.twilio.com/v1/Users/USaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations"


 }


}

Delete a User resource
DELETE https://conversations.twilio.com/v1/Users/{Sid}
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Path parameters
Property nameTypeRequiredPIIDescription
sidstring
required
Not PII
The SID of the User resource to delete. This value can be either the sid or the identity of the User resource to delete.
Delete an User
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function deleteUser() {


 await client.conversations.v1.users("Sid").remove();


}





deleteUser();

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Conversations User Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
API Base URL
Using the shortened base URL
Role Properties
Create a Role resource
Request body parameters
Fetch a Role resource
Path parameters
Read multiple Role resources
Query parameters
Update a Role resource
Path parameters
Request body parameters
Delete a Role resource
Path parameters
Permission Values
Service-scope permissions
Conversation-scope permissions
Role Resource

In Twilio Conversations, the Role Resource represents what a User can do within the Service and individual Conversations. Roles are scoped to either a Service or a Conversation.
Users are assigned a Role at the Service level. This determines what they can do within the chat Service instance, such as create and destroy Conversations within the Service.
Participants are assigned a Role at the Conversation level. This determines what they are able to do within a particular Conversation, such as invite Participants to be members of the Conversation, post Messages, and remove other Participants from the Conversation.
See Permission Values for information about the permissions that can be assigned in each scope.
(error)
Do not use Personally Identifiable Information (PII) for the friendlyName field
Avoid using a person's name, home address, email, phone number, or other PII in the friendlyName field. Use some form of pseudonymized identifier, instead.
You can learn more about how we process your data in our privacy policy.

API Base URL
All URLs in the reference documentation use the following base URL:
Copy code block
https://conversations.twilio.com/v1
Using the shortened base URL
Using the REST API, you can interact with Role resources in the default Conversation Service instance via a "shortened" URL that does not include the Conversation Service instance SID ("ISXXX..."). If you are only using one Conversation Service (the default), you do not need to include the Conversation Service SID in your URL, e.g.
Copy code block
GET /v1/Roles/
For Conversations applications that build on more than one Conversation Service instance, you will need to specify the Conversation Service SID in the REST API call.
Copy code block
GET /v1/Services/<Service SID, ISXXX...>/Roles/



Role Properties
Each Role resource contains these properties.
Property nameTypeRequiredDescriptionChild properties
sidSID<RL>
Optional
Not PII
The unique string that we created to identify the Role resource.
Pattern:^RL[0-9a-fA-F]{32}$Min length:34Max length:34

accountSidSID<AC>
Optional
Not PII
The SID of the Account that created the Role resource.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

chatServiceSidSID<IS>
Optional
Not PII
The SID of the Conversation Service the Role resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

friendlyNamestring
Optional
PII MTL: 30 days
The string that you assigned to describe the resource.

typeenum<string>
Optional
Not PII
The type of role. Can be: conversation for Conversation roles or service for Conversation Service roles.
Possible values:
conversationservice

permissionsarray[string]
Optional
Not PII
An array of the permissions the role has been granted.

dateCreatedstring<date-time>
Optional
Not PII
The date and time in GMT when the resource was created specified in ISO 8601
 format.

dateUpdatedstring<date-time>
Optional
Not PII
The date and time in GMT when the resource was last updated specified in ISO 8601
 format.

urlstring<uri>
Optional
Not PII
An absolute API resource URL for this user role.

Create a Role resource
POST https://conversations.twilio.com/v1/Roles
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
friendlyNamestring
required
PII MTL: 30 days
A descriptive string that you create to describe the new resource. It can be up to 64 characters long.

typeenum<string>
required
Not PII
The type of role. Can be: conversation for Conversation roles or service for Conversation Service roles.
Possible values:
conversationservice

permissionarray[string]
required
Not PII
A permission that you grant to the new role. Only one permission can be granted per parameter. To assign more than one permission, repeat this parameter for each permission value. The values for this parameter depend on the role's type.
Create a Role
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createRole() {


 const role = await client.conversations.v1.roles.create({


   friendlyName: "FriendlyName",


   permission: ["addParticipant"],


   type: "conversation",


 });





 console.log(role.sid);


}





createRole();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "FriendlyName",


 "type": "conversation",


 "permissions": [


   "sendMessage",


   "leaveConversation",


   "editOwnMessage",


   "deleteOwnMessage"


 ],


 "date_created": "2016-03-03T19:47:15Z",


 "date_updated": "2016-03-03T19:47:15Z",


 "url": "https://conversations.twilio.com/v1/Roles/RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Fetch a Role resource
GET https://conversations.twilio.com/v1/Roles/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
sidSID<RL>
required
Not PII
The SID of the Role resource to fetch.
Pattern:^RL[0-9a-fA-F]{32}$Min length:34Max length:34
Fetch a Role
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchRole() {


 const role = await client.conversations.v1


   .roles("RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .fetch();





 console.log(role.sid);


}





fetchRole();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "Conversation Role",


 "type": "conversation",


 "permissions": [


   "sendMessage",


   "leaveConversation",


   "editOwnMessage",


   "deleteOwnMessage"


 ],


 "date_created": "2016-03-03T19:47:15Z",


 "date_updated": "2016-03-03T19:47:15Z",


 "url": "https://conversations.twilio.com/v1/Roles/RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Read multiple Role resources
GET https://conversations.twilio.com/v1/Roles
Query parameters
Property nameTypeRequiredPIIDescription
pageSizeinteger<int64>
Optional
Not PII
How many resources to return in each list page. The default is 50, and the maximum is 50.
Minimum:1Maximum:50

pageinteger
Optional
Not PII
The page index. This value is simply for client state.
Minimum:0

pageTokenstring
Optional
Not PII
The page token. This is provided by the API.
List multiple Roles
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function listRole() {


 const roles = await client.conversations.v1.roles.list({ limit: 20 });





 roles.forEach((r) => console.log(r.sid));


}





listRole();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "meta": {


   "page": 0,


   "page_size": 50,


   "first_page_url": "https://conversations.twilio.com/v1/Roles?PageSize=50&Page=0",


   "previous_page_url": null,


   "url": "https://conversations.twilio.com/v1/Roles?PageSize=50&Page=0",


   "next_page_url": null,


   "key": "roles"


 },


 "roles": [


   {


     "sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "friendly_name": "Conversation Role",


     "type": "conversation",


     "permissions": [


       "sendMessage",


       "leaveConversation",


       "editOwnMessage",


       "deleteOwnMessage"


     ],


     "date_created": "2016-03-03T19:47:15Z",


     "date_updated": "2016-03-03T19:47:15Z",


     "url": "https://conversations.twilio.com/v1/Roles/RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


   }


 ]


}

Update a Role resource
POST https://conversations.twilio.com/v1/Roles/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
sidSID<RL>
required
Not PII
The SID of the Role resource to update.
Pattern:^RL[0-9a-fA-F]{32}$Min length:34Max length:34
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
permissionarray[string]
required
Not PII
A permission that you grant to the role. Only one permission can be granted per parameter. To assign more than one permission, repeat this parameter for each permission value. Note that the update action replaces all previously assigned permissions with those defined in the update action. To remove a permission, do not include it in the subsequent update action. The values for this parameter depend on the role's type.
Update a Conversation Role
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateRole() {


 const role = await client.conversations.v1


   .roles("New_Chat_Service_SID")


   .update({ permission: ["Permission"] });





 console.log(role.sid);


}





updateRole();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "New_Chat_Service_SID",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "Conversation Role",


 "type": "conversation",


 "permissions": [


   "sendMessage",


   "leaveConversation",


   "editOwnMessage",


   "deleteOwnMessage"


 ],


 "date_created": "2016-03-03T19:47:15Z",


 "date_updated": "2016-03-03T19:47:15Z",


 "url": "https://conversations.twilio.com/v1/Roles/RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Delete a Role resource
DELETE https://conversations.twilio.com/v1/Roles/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
sidSID<RL>
required
Not PII
The SID of the Role resource to delete.
Pattern:^RL[0-9a-fA-F]{32}$Min length:34Max length:34
Delete a Role
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function deleteRole() {


 await client.conversations.v1


   .roles("RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .remove();


}





deleteRole();

Permission Values
Service-scope permissions
These are the available permissions entries for roles where type = service.
Permission
Enables User to:
addParticipant
Add other users as Participants of a Conversation
createConversation
Create new Conversations
deleteAnyMessage
Delete any Message in the Service
deleteConversation
Delete Conversations
editAnyMessage
Edit any Message in the Service
editAnyMessageAttributes
Edit any Message attributes in the Service
editAnyUserInfo
Edit other User's User Info properties
editConversationAttributes
Update the optional attributes metadata field on a Conversation
editConversationName
Change the name of a Conversation
editOwnMessage
Edit their own Messages in the Service
editOwnMessageAttributes
Edit the own Message attributes in the Service
editOwnUserInfo
Edit their own User Info properties
joinConversation
Join Conversations
removeParticipant
Remove Participants from a Conversation

Conversation-scope permissions
These are the available permissions entries for roles where type = conversation.
Permission
Enables User to:
addParticipant
Add other users as Participants of a Conversation
deleteAnyMessage
Delete any Message in the Service
deleteOwnMessage
Delete their own Messages in the Service
deleteConversation
Delete Conversations
editAnyMessage
Edit any Message in the Service
editAnyMessageAttributes
Edit any Message attributes in the Service
editAnyUserInfo
Edit other User's User Info properties
editConversationAttributes
Update the optional attributes metadata field on a Conversation
editConversationName
Change the name of a Conversation
editOwnMessage
Edit their own Messages in the Service
editOwnMessageAttributes
Edit the own Message attributes in the Service
editOwnUserInfo
Edit their own User Info properties
leaveConversation
Leave a Conversation
removeParticipant
Remove Participants from a Conversation
sendMediaMessage
Send media Messages to Conversations
sendMessage
Send Messages to Conversations


Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Role Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Configuration Properties
Fetch a Configuration resource
Update a Configuration resource
Request body parameters
Configuration Resource

The Twilio Conversations' Configuration resource represents settings applied at the account level, across all Conversation Services.

Configuration Properties
Property nameTypeRequiredDescriptionChild properties
accountSidSID<AC>
Optional
Not PII
The SID of the Account responsible for this configuration.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

defaultChatServiceSidSID<IS>
Optional
Not PII
The SID of the default Conversation Service used when creating a conversation.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

defaultMessagingServiceSidSID<MG>
Optional
Not PII
The SID of the default Messaging Service used when creating a conversation.
Pattern:^MG[0-9a-fA-F]{32}$Min length:34Max length:34

defaultInactiveTimerstring
Optional
Not PII
Default ISO8601 duration when conversation will be switched to inactive state. Minimum value for this timer is 1 minute.

defaultClosedTimerstring
Optional
Not PII
Default ISO8601 duration when conversation will be switched to closed state. Minimum value for this timer is 10 minutes.

urlstring<uri>
Optional
Not PII
An absolute API resource URL for this global configuration.

linksobject<uri-map>
Optional
Not PII
Contains absolute API resource URLs to access the webhook and default service configurations.

Fetch a Configuration resource
GET https://conversations.twilio.com/v1/Configuration
Fetch a Configuration
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchConfiguration() {


 const configuration = await client.conversations.v1.configuration().fetch();





 console.log(configuration.accountSid);


}





fetchConfiguration();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "default_chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "default_messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "default_inactive_timer": "PT1M",


 "default_closed_timer": "PT10M",


 "url": "https://conversations.twilio.com/v1/Configuration",


 "links": {


   "service": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Configuration",


   "webhooks": "https://conversations.twilio.com/v1/Configuration/Webhooks"


 }


}

Update a Configuration resource
POST https://conversations.twilio.com/v1/Configuration
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
defaultChatServiceSidSID<IS>
Optional
Not PII
The SID of the default Conversation Service to use when creating a conversation.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

defaultMessagingServiceSidSID<MG>
Optional
Not PII
The SID of the default Messaging Service to use when creating a conversation.
Pattern:^MG[0-9a-fA-F]{32}$Min length:34Max length:34

defaultInactiveTimerstring
Optional
Not PII
Default ISO8601 duration when conversation will be switched to inactive state. Minimum value for this timer is 1 minute.

defaultClosedTimerstring
Optional
Not PII
Default ISO8601 duration when conversation will be switched to closed state. Minimum value for this timer is 10 minutes.
Update a Configuration
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateConfiguration() {


 const configuration = await client.conversations.v1


   .configuration()


   .update({ defaultChatServiceSid: "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" });





 console.log(configuration.accountSid);


}





updateConfiguration();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "default_chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "default_messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "default_inactive_timer": "PT1M",


 "default_closed_timer": "PT10M",


 "url": "https://conversations.twilio.com/v1/Configuration",


 "links": {


   "service": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Configuration",


   "webhooks": "https://conversations.twilio.com/v1/Configuration/Webhooks"


 }


}

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Configuration Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
AddressConfiguration properties
Create an AddressConfiguration resource
Request body parameters
Fetch an AddressConfiguration resource
Path parameters
Read multiple AddressConfiguration resources
Query parameters
Update an AddressConfiguration resource
Path parameters
Request body parameters
Delete an AddressConfiguration resource
Path parameters
Address Configuration Resource

The Address Configuration resource manages the configurations related to a unique address within the Conversations product, allowing you to specify which addresses should auto-create a Conversation upon receiving an inbound message.
The unique address must be a single address (i.e. a WhatsApp or SMS phone number) that belongs to your Twilio Account.
The configuration can optionally include automatically attaching a Conversation-scoped Webhook to the auto-created conversations.

AddressConfiguration properties
Property nameTypeRequiredDescriptionChild properties
sidSID<IG>
Optional
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^IG[0-9a-fA-F]{32}$Min length:34Max length:34

accountSidSID<AC>
Optional
Not PII
The unique ID of the Account the address belongs to
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

typestring
Optional
Not PII
Type of Address, value can be whatsapp or sms.

addressstring
Optional
PII MTL: 30 days
The unique address to be configured. The address can be a whatsapp address or phone number

friendlyNamestring
Optional
Not PII
The human-readable name of this configuration, limited to 256 characters. Optional.

autoCreationobject
Optional
Not PII
Auto Creation configuration for the address.

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated.

urlstring<uri>
Optional
Not PII
An absolute API resource URL for this address configuration.

addressCountrystring
Optional
Not PII
An ISO 3166-1 alpha-2n country code which the address belongs to. This is currently only applicable to short code addresses.

Create an AddressConfiguration resource
POST https://conversations.twilio.com/v1/Configuration/Addresses
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
typeenum<string>
required
Not PII
Type of Address, value can be whatsapp or sms.
Possible values:
smswhatsappmessengergbmemailrcsapplechat

addressstring
required
PII MTL: 30 days
The unique address to be configured. The address can be a whatsapp address or phone number

friendlyNamestring
Optional
Not PII
The human-readable name of this configuration, limited to 256 characters. Optional.

autoCreation.enabledboolean
Optional
Not PII
Enable/Disable auto-creating conversations for messages to this address

autoCreation.typeenum<string>
Optional
Not PII
Possible values:
webhookstudiodefault

autoCreation.conversationServiceSidSID<IS>
Optional
Not PII
Conversation Service for the auto-created conversation. If not set, the conversation is created in the default service.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

autoCreation.webhookUrlstring
Optional
Not PII
For type webhook, the url for the webhook request.

autoCreation.webhookMethodenum<string>
Optional
Not PII
Possible values:
GETPOST

autoCreation.webhookFiltersarray[string]
Optional
Not PII
The list of events, firing webhook event for this Conversation. Values can be any of the following: onMessageAdded, onMessageUpdated, onMessageRemoved, onConversationUpdated, onConversationStateUpdated, onConversationRemoved, onParticipantAdded, onParticipantUpdated, onParticipantRemoved, onDeliveryUpdated

autoCreation.studioFlowSidSID<FW>
Optional
Not PII
For type studio, the studio flow SID where the webhook should be sent to.
Pattern:^FW[0-9a-fA-F]{32}$Min length:34Max length:34

autoCreation.studioRetryCountinteger
Optional
Not PII
For type studio, number of times to retry the webhook request

addressCountrystring
Optional
Not PII
An ISO 3166-1 alpha-2n country code which the address belongs to. This is currently only applicable to short code addresses.
Create Address Configuration
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConfigurationAddress() {


 const addressConfiguration =


   await client.conversations.v1.addressConfigurations.create({


     address: "+37256123457",


     "autoCreation.conversationServiceSid": "ISXXXXXXXXXXXXXXXXXXXXXX",


     "autoCreation.enabled": true,


     "autoCreation.type": "webhook",


     "autoCreation.webhookFilters": ["onParticipantAdded", "onMessageAdded"],


     "autoCreation.webhookMethod": "POST",


     "autoCreation.webhookUrl": "https://example.com",


     friendlyName: "My Test Configuration",


     type: "sms",


   });





 console.log(addressConfiguration.sid);


}





createConfigurationAddress();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "sid": "IGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "address": "+37256123457",


 "type": "sms",


 "friendly_name": "My Test Configuration",


 "address_country": "CA",


 "auto_creation": {


   "enabled": true,


   "type": "webhook",


   "conversation_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


   "webhook_url": "https://example.com",


   "webhook_method": "POST",


   "webhook_filters": [


     "onParticipantAdded",


     "onMessageAdded"


   ]


 },


 "date_created": "2016-03-24T21:05:50Z",


 "date_updated": "2016-03-24T21:05:50Z",


 "url": "https://conversations.twilio.com/v1/Configuration/Addresses/IGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Fetch an AddressConfiguration resource
GET https://conversations.twilio.com/v1/Configuration/Addresses/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
sidstring
required
Not PII
The SID of the Address Configuration resource. This value can be either the sid or the address of the configuration
Fetch Address Configuration
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchConfigurationAddress() {


 const addressConfiguration = await client.conversations.v1


   .addressConfigurations("IGXXXXXXXXXXXXXXXXXXXXXXXX")


   .fetch();





 console.log(addressConfiguration.sid);


}





fetchConfigurationAddress();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "sid": "IGXXXXXXXXXXXXXXXXXXXXXXXX",


 "address": "+37256123457",


 "type": "sms",


 "friendly_name": "My Test Configuration",


 "address_country": "CA",


 "auto_creation": {


   "enabled": true,


   "type": "webhook",


   "conversation_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


   "webhook_url": "https://example.com",


   "webhook_method": "POST",


   "webhook_filters": [


     "onParticipantAdded",


     "onMessageAdded"


   ]


 },


 "date_created": "2016-03-24T21:05:50Z",


 "date_updated": "2016-03-24T21:05:50Z",


 "url": "https://conversations.twilio.com/v1/Configuration/Addresses/IGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Read multiple AddressConfiguration resources
GET https://conversations.twilio.com/v1/Configuration/Addresses
Query parameters
Property nameTypeRequiredPIIDescription
typestring
Optional
Not PII
Filter the address configurations by its type. This value can be one of: whatsapp, sms.

pageSizeinteger<int64>
Optional
Not PII
How many resources to return in each list page. The default is 50, and the maximum is 50.
Minimum:1Maximum:50

pageinteger
Optional
Not PII
The page index. This value is simply for client state.
Minimum:0

pageTokenstring
Optional
Not PII
The page token. This is provided by the API.
List Address Configurations
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function listConfigurationAddress() {


 const addressConfigurations =


   await client.conversations.v1.addressConfigurations.list({ limit: 20 });





 addressConfigurations.forEach((a) => console.log(a.sid));


}





listConfigurationAddress();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "meta": {


   "page": 0,


   "page_size": 50,


   "first_page_url": "https://conversations.twilio.com/v1/Configuration/Addresses?PageSize=50&Page=0",


   "previous_page_url": null,


   "url": "https://conversations.twilio.com/v1/Configuration/Addresses?PageSize=50&Page=0",


   "next_page_url": null,


   "key": "address_configurations"


 },


 "address_configurations": [


   {


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "sid": "IGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "address": "+37256123457",


     "type": "sms",


     "friendly_name": "My Test Configuration",


     "address_country": "CA",


     "auto_creation": {


       "enabled": true,


       "type": "webhook",


       "conversation_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


       "webhook_url": "https://example.com",


       "webhook_method": "POST",


       "webhook_filters": [


         "onParticipantAdded",


         "onMessageAdded"


       ]


     },


     "date_created": "2016-03-24T21:05:50Z",


     "date_updated": "2016-03-24T21:05:50Z",


     "url": "https://conversations.twilio.com/v1/Configuration/Addresses/IGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


   },


   {


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "sid": "IGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab",


     "address": "+37256123458",


     "type": "sms",


     "friendly_name": "Studio Test Configuration",


     "address_country": "US",


     "auto_creation": {


       "enabled": false,


       "type": "studio",


       "conversation_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


       "studio_flow_sid": "FWaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


       "studio_retry_count": 3


     },


     "date_created": "2016-03-24T21:05:50Z",


     "date_updated": "2016-03-24T21:05:50Z",


     "url": "https://conversations.twilio.com/v1/Configuration/Addresses/IGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab"


   },


   {


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "sid": "IGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac",


     "address": "+37256123459",


     "type": "sms",


     "friendly_name": "Default Test Configuration",


     "address_country": "NG",


     "auto_creation": {


       "enabled": true,


       "type": "default"


     },


     "date_created": "2016-03-24T21:05:50Z",


     "date_updated": "2016-03-24T21:05:50Z",


     "url": "https://conversations.twilio.com/v1/Configuration/Addresses/IGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac"


   }


 ]


}

Update an AddressConfiguration resource
POST https://conversations.twilio.com/v1/Configuration/Addresses/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
sidstring
required
Not PII
The SID of the Address Configuration resource. This value can be either the sid or the address of the configuration
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
friendlyNamestring
Optional
Not PII
The human-readable name of this configuration, limited to 256 characters. Optional.

autoCreation.enabledboolean
Optional
Not PII
Enable/Disable auto-creating conversations for messages to this address

autoCreation.typeenum<string>
Optional
Not PII
Possible values:
webhookstudiodefault

autoCreation.conversationServiceSidSID<IS>
Optional
Not PII
Conversation Service for the auto-created conversation. If not set, the conversation is created in the default service.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

autoCreation.webhookUrlstring
Optional
Not PII
For type webhook, the url for the webhook request.

autoCreation.webhookMethodenum<string>
Optional
Not PII
Possible values:
GETPOST

autoCreation.webhookFiltersarray[string]
Optional
Not PII
The list of events, firing webhook event for this Conversation. Values can be any of the following: onMessageAdded, onMessageUpdated, onMessageRemoved, onConversationUpdated, onConversationStateUpdated, onConversationRemoved, onParticipantAdded, onParticipantUpdated, onParticipantRemoved, onDeliveryUpdated

autoCreation.studioFlowSidSID<FW>
Optional
Not PII
For type studio, the studio flow SID where the webhook should be sent to.
Pattern:^FW[0-9a-fA-F]{32}$Min length:34Max length:34

autoCreation.studioRetryCountinteger
Optional
Not PII
For type studio, number of times to retry the webhook request
Update Address Configuration
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateConfigurationAddress() {


 const addressConfiguration = await client.conversations.v1


   .addressConfigurations("IGXXXXXXXXXXXXXXXXXXXXXXX")


   .update({


     "autoCreation.enabled": false,


     "autoCreation.studioFlowSid": "FWXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


     "autoCreation.studioRetryCount": 3,


     "autoCreation.type": "studio",


     friendlyName: "My Test Configuration Updated",


   });





 console.log(addressConfiguration.sid);


}





updateConfigurationAddress();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "sid": "IGXXXXXXXXXXXXXXXXXXXXXXX",


 "address": "+37256123457",


 "type": "sms",


 "friendly_name": "My Test Configuration Updated",


 "address_country": "CA",


 "auto_creation": {


   "enabled": false,


   "type": "studio",


   "conversation_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


   "studio_flow_sid": "FWaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


   "studio_retry_count": 3


 },


 "date_created": "2016-03-24T21:05:50Z",


 "date_updated": "2016-03-24T21:05:51Z",


 "url": "https://conversations.twilio.com/v1/Configuration/Addresses/IGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Delete an AddressConfiguration resource
DELETE https://conversations.twilio.com/v1/Configuration/Addresses/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
sidstring
required
Not PII
The SID of the Address Configuration resource. This value can be either the sid or the address of the configuration
Delete Address Configuration
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function deleteConfigurationAddress() {


 await client.conversations.v1


   .addressConfigurations("IGXXXXXXXXXXXXXXXXXXX")


   .remove();


}





deleteConfigurationAddress();

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Address Configuration Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Webhook Properties
Fetch a ConfigurationWebhook resource
Update a ConfigurationWebhook resource
Request body parameters
Webhook Configuration Resource

The Webhook Configuration resource allows you to precisely control the effects of account-scoped webhooks. Sending a POST request to the Webhook Configuration endpoint is equivalent to configuring session webhooks in the Twilio Console
.
Good applications of the configured webhooks in Conversations include:
Implementing an archival system for all Conversations
Feeding messages into Elasticsearch
Implementing a profanity filter across all Conversations
Note: You can send pre-hooks and post-hooks to different targets.
Our guide to Conversations Webhooks includes the specific pre- and post-event webhooks that fire, as well as the webhook payloads.

Webhook Properties
Property nameTypeRequiredDescriptionChild properties
accountSidSID<AC>
Optional
Not PII
The unique ID of the Account responsible for this conversation.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

methodenum<string>
Optional
Not PII
The HTTP method to be used when sending a webhook request.
Possible values:
GETPOST

filtersarray[string]
Optional
Not PII
The list of webhook event triggers that are enabled for this Service: onMessageAdded, onMessageUpdated, onMessageRemoved, onMessageAdd, onMessageUpdate, onMessageRemove, onConversationUpdated, onConversationRemoved, onConversationAdd, onConversationAdded, onConversationRemove, onConversationUpdate, onConversationStateUpdated, onParticipantAdded, onParticipantUpdated, onParticipantRemoved, onParticipantAdd, onParticipantRemove, onParticipantUpdate, onDeliveryUpdated, onUserAdded, onUserUpdate, onUserUpdated

preWebhookUrlstring
Optional
Not PII
The absolute url the pre-event webhook request should be sent to.

postWebhookUrlstring
Optional
Not PII
The absolute url the post-event webhook request should be sent to.

targetenum<string>
Optional
Not PII
The routing target of the webhook. Can be ordinary or route internally to Flex
Possible values:
webhookflex

urlstring<uri>
Optional
Not PII
An absolute API resource API resource URL for this webhook.

Fetch a ConfigurationWebhook resource
GET https://conversations.twilio.com/v1/Configuration/Webhooks
FETCH: Retrieve a Webhook Configuration Resource
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchConfigurationWebhook() {


 const webhook = await client.conversations.v1.configuration


   .webhooks()


   .fetch();





 console.log(webhook.accountSid);


}





fetchConfigurationWebhook();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "pre_webhook_url": "https://example.com/pre",


 "post_webhook_url": "https://example.com/post",


 "method": "GET",


 "filters": [


   "onMessageSend",


   "onConversationUpdated"


 ],


 "target": "webhook",


 "url": "https://conversations.twilio.com/v1/Configuration/Webhooks"


}

Update a ConfigurationWebhook resource
POST https://conversations.twilio.com/v1/Configuration/Webhooks
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
methodstring
Optional
Not PII
The HTTP method to be used when sending a webhook request.

filtersarray[string]
Optional
Not PII
The list of webhook event triggers that are enabled for this Service: onMessageAdded, onMessageUpdated, onMessageRemoved, onMessageAdd, onMessageUpdate, onMessageRemove, onConversationUpdated, onConversationRemoved, onConversationAdd, onConversationAdded, onConversationRemove, onConversationUpdate, onConversationStateUpdated, onParticipantAdded, onParticipantUpdated, onParticipantRemoved, onParticipantAdd, onParticipantRemove, onParticipantUpdate, onDeliveryUpdated, onUserAdded, onUserUpdate, onUserUpdated

preWebhookUrlstring
Optional
Not PII
The absolute url the pre-event webhook request should be sent to.

postWebhookUrlstring
Optional
Not PII
The absolute url the post-event webhook request should be sent to.

targetenum<string>
Optional
Not PII
The routing target of the webhook. Can be ordinary or route internally to Flex
Possible values:
webhookflex
UPDATE: Enable all Webhooks with filters
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateConfigurationWebhook() {


 const webhook = await client.conversations.v1.configuration


   .webhooks()


   .update({


     filters: ["onConversationUpdated", "onMessageRemoved"],


     method: "POST",


     postWebhookUrl: "https://example.com/archive-every-action",


     preWebhookUrl: "https://example.com/filtering-and-permissions",


   });





 console.log(webhook.accountSid);


}





updateConfigurationWebhook();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "pre_webhook_url": "https://example.com/filtering-and-permissions",


 "post_webhook_url": "https://example.com/archive-every-action",


 "method": "POST",


 "filters": [


   "onConversationUpdated"


 ],


 "target": "webhook",


 "url": "https://conversations.twilio.com/v1/Configuration/Webhooks"


}

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Webhook Configuration Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
API Base URL
Using the shortened base URL
Webhook Properties
Create a ConversationScopedWebhook resource
Path parameters
Request body parameters
Fetch a ConversationScopedWebhook resource
Path parameters
Read multiple ConversationScopedWebhook resources
Path parameters
Query parameters
Update a ConversationScopedWebhook resource
Path parameters
Request body parameters
Delete a ConversationScopedWebhook resource
Path parameters
Conversation Scoped Webhook Resource

Conversation Scoped Webhooks provide a way to attach a unique monitor, bot, or other integration to each conversation.
Each individual Conversation can have as many as five such webhooks, as needed for your use case. This is your go-to tool for adding integrations with third-party bots or Twilio Studio.
For bot integrations, in particular, pay specific attention to the ReplayAfter parameter to ensure that you don't miss any messages that arrive while you're configuring the integration.
(information)
Info
Only post-event webhooks are supported by the Conversation-Scoped Webhooks.

API Base URL
All URLs in the reference documentation use the following base URL:
Copy code block
https://conversations.twilio.com/v1
Using the shortened base URL
Using the REST API, you can interact with Conversation Scoped Webhook resources in the default Conversation Service instance via a "shortened" URL that does not include the Conversation Service instance SID ("ISXXX..."). If you are only using one Conversation Service (the default), you do not need to include the Conversation Service SID in your URL, e.g.
Copy code block
GET /v1/Conversations/CHxxx/Webhooks


For Conversations applications that build on more than one Conversation Service instance, you will need to specify the Conversation Service SID in the REST API call:
Copy code block
GET /v1/Services/ISxx/Conversations/CHxx/Webhooks

Webhook Properties
Property nameTypeRequiredDescriptionChild properties
sidSID<WH>
Optional
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^WH[0-9a-fA-F]{32}$Min length:34Max length:34

accountSidSID<AC>
Optional
Not PII
The unique ID of the Account responsible for this conversation.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidSID<CH>
Optional
Not PII
The unique ID of the Conversation for this webhook.
Pattern:^CH[0-9a-fA-F]{32}$Min length:34Max length:34

targetstring
Optional
Not PII
The target of this webhook: webhook, studio, trigger

urlstring<uri>
Optional
Not PII
An absolute API resource URL for this webhook.

configurationobject
Optional
Not PII
The configuration of this webhook. Is defined based on target.

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated.

Create a ConversationScopedWebhook resource
POST https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Webhooks
Path parameters
Property nameTypeRequiredPIIDescription
conversationSidstring
required
Not PII
The unique ID of the Conversation for this webhook.
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
targetenum<string>
required
Not PII
The target of this webhook: webhook, studio, trigger
Possible values:
webhooktriggerstudio

configuration.urlstring
Optional
Not PII
The absolute url the webhook request should be sent to.

configuration.methodenum<string>
Optional
Not PII
Possible values:
GETPOST

configuration.filtersarray[string]
Optional
Not PII
The list of events, firing webhook event for this Conversation.

configuration.triggersarray[string]
Optional
Not PII
The list of keywords, firing webhook event for this Conversation.

configuration.flowSidSID<FW>
Optional
Not PII
The studio flow SID, where the webhook should be sent to.
Pattern:^FW[0-9a-fA-F]{32}$Min length:34Max length:34

configuration.replayAfterinteger
Optional
Not PII
The message index for which and it's successors the webhook will be replayed. Not set by default
CREATE: Attach a new Conversation Scoped Webhook
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationScopedWebhook() {


 const webhook = await client.conversations.v1


   .conversations("ConversationSid")


   .webhooks.create({


     "configuration.filters": ["onMessageAdded", "onConversationRemoved"],


     "configuration.method": "GET",


     "configuration.url": "https://example.com",


     target: "webhook",


   });





 console.log(webhook.sid);


}





createConversationScopedWebhook();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "target": "webhook",


 "configuration": {


   "url": "https://example.com",


   "method": "get",


   "filters": [


     "onMessageSent",


     "onConversationDestroyed"


   ]


 },


 "date_created": "2016-03-24T21:05:50Z",


 "date_updated": "2016-03-24T21:05:50Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks/WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Fetch a ConversationScopedWebhook resource
GET https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Webhooks/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
conversationSidstring
required
Not PII
The unique ID of the Conversation for this webhook.

sidSID<WH>
required
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^WH[0-9a-fA-F]{32}$Min length:34Max length:34
FETCH: Retrieve a Conversation Scoped Webhook
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchConversationScopedWebhook() {


 const webhook = await client.conversations.v1


   .conversations("ConversationSid")


   .webhooks("WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .fetch();





 console.log(webhook.sid);


}





fetchConversationScopedWebhook();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "target": "studio",


 "configuration": {


   "flow_sid": "FWaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


 },


 "date_created": "2016-03-24T21:05:50Z",


 "date_updated": "2016-03-24T21:05:50Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks/WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Read multiple ConversationScopedWebhook resources
GET https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Webhooks
Path parameters
Property nameTypeRequiredPIIDescription
conversationSidstring
required
Not PII
The unique ID of the Conversation for this webhook.
Query parameters
Property nameTypeRequiredPIIDescription
pageSizeinteger<int64>
Optional
Not PII
How many resources to return in each list page. The default is 5, and the maximum is 5.
Minimum:1Maximum:5

pageinteger
Optional
Not PII
The page index. This value is simply for client state.
Minimum:0

pageTokenstring
Optional
Not PII
The page token. This is provided by the API.
READ: List all Conversation Scoped Webhooks
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function listConversationScopedWebhook() {


 const webhooks = await client.conversations.v1


   .conversations("ConversationSid")


   .webhooks.list({ limit: 20 });





 webhooks.forEach((w) => console.log(w.sid));


}





listConversationScopedWebhook();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "meta": {


   "page": 0,


   "page_size": 5,


   "first_page_url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks?PageSize=5&Page=0",


   "previous_page_url": null,


   "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks?PageSize=5&Page=0",


   "next_page_url": null,


   "key": "webhooks"


 },


 "webhooks": [


   {


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "sid": "WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "target": "webhook",


     "configuration": {


       "url": "https://example.com",


       "method": "get",


       "filters": [


         "onMessageSent",


         "onConversationDestroyed"


       ]


     },


     "date_created": "2016-03-24T21:05:50Z",


     "date_updated": "2016-03-24T21:05:50Z",


     "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks/WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


   },


   {


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "sid": "WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "target": "trigger",


     "configuration": {


       "url": "https://example.com",


       "method": "post",


       "filters": [


         "keyword1",


         "keyword2"


       ]


     },


     "date_created": "2016-03-24T21:05:50Z",


     "date_updated": "2016-03-24T21:05:50Z",


     "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks/WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


   },


   {


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "sid": "WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "target": "studio",


     "configuration": {


       "flow_sid": "FWaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


     },


     "date_created": "2016-03-24T21:05:50Z",


     "date_updated": "2016-03-24T21:05:50Z",


     "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks/WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


   }


 ]


}

Update a ConversationScopedWebhook resource
POST https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Webhooks/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
conversationSidstring
required
Not PII
The unique ID of the Conversation for this webhook.

sidSID<WH>
required
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^WH[0-9a-fA-F]{32}$Min length:34Max length:34
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
configuration.urlstring
Optional
Not PII
The absolute url the webhook request should be sent to.

configuration.methodenum<string>
Optional
Not PII
Possible values:
GETPOST

configuration.filtersarray[string]
Optional
Not PII
The list of events, firing webhook event for this Conversation.

configuration.triggersarray[string]
Optional
Not PII
The list of keywords, firing webhook event for this Conversation.

configuration.flowSidSID<FW>
Optional
Not PII
The studio flow SID, where the webhook should be sent to.
Pattern:^FW[0-9a-fA-F]{32}$Min length:34Max length:34
UPDATE: Configure a Conversation Scoped Webhook
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateConversationScopedWebhook() {


 const webhook = await client.conversations.v1


   .conversations("ConversationSid")


   .webhooks("WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .update({ "configuration.filters": ["keyword1", "keyword2"] });





 console.log(webhook.configuration);


}





updateConversationScopedWebhook();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "target": "trigger",


 "configuration": {


   "url": "https://example.com",


   "method": "post",


   "filters": [


     "keyword1",


     "keyword2"


   ]


 },


 "date_created": "2016-03-24T21:05:50Z",


 "date_updated": "2016-03-24T21:05:51Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks/WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Delete a ConversationScopedWebhook resource
DELETE https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Webhooks/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
conversationSidstring
required
Not PII
The unique ID of the Conversation for this webhook.

sidSID<WH>
required
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^WH[0-9a-fA-F]{32}$Min length:34Max length:34
DELETE: Detach a Conversation Scoped Webhook
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function deleteConversationScopedWebhook() {


 await client.conversations.v1


   .conversations("ConversationSid")


   .webhooks("WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .remove();


}





deleteConversationScopedWebhook();

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Conversation Scoped Webhook Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
API Base URL
Using the shortened base URL
Receipt Properties
Fetch a ConversationMessageReceipt resource
Path parameters
Read multiple ConversationMessageReceipt resources
Path parameters
Query parameters
Conversation Message Receipt Resource

Delivery Receipts in Conversations provide visibility into the status of Conversation Messages sent across different channels.
Using Delivery Receipts, you can verify that Messages have been sent, delivered, or even read (for OTT) by Conversations Participants.

API Base URL
All URLs in the reference documentation use the following base URL:
Copy code block
https://conversations.twilio.com/v1
Using the shortened base URL
Using the REST API, you can interact with Conversation Message Receipt resources in the default Conversation Service instance via a "shortened" URL that does not include the Conversation Service instance SID ("ISXXX..."). If you are only using one Conversation Service (the default), you do not need to include the Conversation Service SID in your URL, e.g.
Copy code block
GET /v1/Conversations/CHxx/Messages/IMXXX/Receipts


For Conversations applications that build on more than one Conversation Service instance, you will need to specify the Conversation Service SID in the REST API call:
Copy code block
GET /v1/Services/ISxx/Conversations/CHxx/Messages/IMXXX/Receipts

Receipt Properties
Property nameTypeRequiredDescriptionChild properties
accountSidSID<AC>
Optional
Not PII
The unique ID of the Account responsible for this participant.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidSID<CH>
Optional
Not PII
The unique ID of the Conversation for this message.
Pattern:^CH[0-9a-fA-F]{32}$Min length:34Max length:34

sidSID<DY>
Optional
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^DY[0-9a-fA-F]{32}$Min length:34Max length:34

messageSidSID<IM>
Optional
Not PII
The SID of the message within a Conversation the delivery receipt belongs to
Pattern:^IM[0-9a-fA-F]{32}$Min length:34Max length:34

channelMessageSidSID
Optional
Not PII
A messaging channel-specific identifier for the message delivered to participant e.g. SMxx for SMS, WAxx for Whatsapp etc.
Pattern:^[a-zA-Z]{2}[0-9a-fA-F]{32}$Min length:34Max length:34

participantSidSID<MB>
Optional
Not PII
The unique ID of the participant the delivery receipt belongs to.
Pattern:^MB[0-9a-fA-F]{32}$Min length:34Max length:34

statusenum<string>
Optional
Not PII
The message delivery status, can be read, failed, delivered, undelivered, sent or null.
Possible values:
readfaileddeliveredundeliveredsent

errorCodeinteger
Optional
Not PII
The message delivery error code for a failed status,
Default:0

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated. null if the delivery receipt has not been updated.

urlstring<uri>
Optional
Not PII
An absolute API resource URL for this delivery receipt.

Fetch a ConversationMessageReceipt resource
GET https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Messages/{MessageSid}/Receipts/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
conversationSidstring
required
Not PII
The unique ID of the Conversation for this message.

messageSidSID<IM>
required
Not PII
The SID of the message within a Conversation the delivery receipt belongs to.
Pattern:^IM[0-9a-fA-F]{32}$Min length:34Max length:34

sidSID<DY>
required
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^DY[0-9a-fA-F]{32}$Min length:34Max length:34
Fetch a Receipt
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchConversationMessageReceipt() {


 const deliveryReceipt = await client.conversations.v1


   .conversations("ConversationSid")


   .messages("IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .deliveryReceipts("DYaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .fetch();





 console.log(deliveryReceipt.accountSid);


}





fetchConversationMessageReceipt();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "DYaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "message_sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "channel_message_sid": "SMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "status": "failed",


 "error_code": 3000,


 "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "date_created": "2016-03-24T20:37:57Z",


 "date_updated": "2016-03-24T20:37:57Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts/DYaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Read multiple ConversationMessageReceipt resources
GET https://conversations.twilio.com/v1/Conversations/{ConversationSid}/Messages/{MessageSid}/Receipts
Path parameters
Property nameTypeRequiredPIIDescription
conversationSidstring
required
Not PII
The unique ID of the Conversation for this message.

messageSidSID<IM>
required
Not PII
The SID of the message within a Conversation the delivery receipt belongs to.
Pattern:^IM[0-9a-fA-F]{32}$Min length:34Max length:34
Query parameters
Property nameTypeRequiredPIIDescription
pageSizeinteger<int64>
Optional
Not PII
How many resources to return in each list page. The default is 50, and the maximum is 50.
Minimum:1Maximum:50

pageinteger
Optional
Not PII
The page index. This value is simply for client state.
Minimum:0

pageTokenstring
Optional
Not PII
The page token. This is provided by the API.
List multiple Receipts
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function listConversationMessageReceipt() {


 const deliveryReceipts = await client.conversations.v1


   .conversations("ConversationSid")


   .messages("IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .deliveryReceipts.list({ limit: 20 });





 deliveryReceipts.forEach((d) => console.log(d.accountSid));


}





listConversationMessageReceipt();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "meta": {


   "page": 0,


   "page_size": 50,


   "first_page_url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts?PageSize=50&Page=0",


   "previous_page_url": null,


   "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts?PageSize=50&Page=0",


   "next_page_url": null,


   "key": "delivery_receipts"


 },


 "delivery_receipts": [


   {


     "sid": "DYaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "message_sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "channel_message_sid": "SMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "status": "failed",


     "error_code": 3000,


     "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "date_created": "2016-03-24T20:37:57Z",


     "date_updated": "2016-03-24T20:37:57Z",


     "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts/DYaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


   },


   {


     "sid": "DYaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "message_sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "channel_message_sid": "SMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "status": "failed",


     "error_code": 3000,


     "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "date_created": "2016-03-24T20:37:57Z",


     "date_updated": "2016-03-24T20:37:57Z",


     "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts/DYaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


   },


   {


     "sid": "DYaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "message_sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "channel_message_sid": "SMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "status": "failed",


     "error_code": 3000,


     "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "date_created": "2016-03-24T20:37:57Z",


     "date_updated": "2016-03-24T20:37:57Z",


     "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts/DYaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


   }


 ]


}

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Conversation Message Receipt Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Conversation Properties
Fetch a specific conversation
Path parameters
List All of a User's Conversations
Path parameters
Query parameters
Update a specific conversation
Path parameters
Request body parameters
Set the NotificationLevel for a conversation
Path parameters
Request body parameters
Remove a User from one of their Conversations
Path parameters
User Conversation Resource

The UserConversation resource lists the Conversations in which a particular User is an active Participant. Use this resource to:
list a user's conversations, present or historical,
mute a user's push notifications for specific channels, or
count a user's unread messages
(information)
Info
UnreadMessageCount returns a maximum value of 1000

Conversation Properties
Each UserConversation resource contains these properties.
Property nameTypeRequiredDescriptionChild properties
accountSidSID<AC>
Optional
Not PII
The unique ID of the Account responsible for this conversation.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

chatServiceSidSID<IS>
Optional
Not PII
The unique ID of the Conversation Service this conversation belongs to.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidSID<CH>
Optional
Not PII
The unique ID of the Conversation for this User Conversation.
Pattern:^CH[0-9a-fA-F]{32}$Min length:34Max length:34

unreadMessagesCountinteger
Optional
Not PII
The number of unread Messages in the Conversation for the Participant.

lastReadMessageIndexinteger
Optional
Not PII
The index of the last Message in the Conversation that the Participant has read.

participantSidSID<MB>
Optional
Not PII
The unique ID of the participant the user conversation belongs to.
Pattern:^MB[0-9a-fA-F]{32}$Min length:34Max length:34

userSidSID<US>
Optional
Not PII
The unique string that identifies the User resource.
Pattern:^US[0-9a-fA-F]{32}$Min length:34Max length:34

friendlyNamestring
Optional
PII MTL: 30 days
The human-readable name of this conversation, limited to 256 characters. Optional.

conversationStateenum<string>
Optional
Not PII
The current state of this User Conversation. One of inactive, active or closed.
Possible values:
inactiveactiveclosed

timersobject
Optional
Not PII
Timer date values representing state update for this conversation.

attributesstring
Optional
PII MTL: 30 days
An optional string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set "{}" will be returned.

dateCreatedstring<date-time>
Optional
Not PII
The date that this conversation was created, given in ISO 8601 format.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this conversation was last updated, given in ISO 8601 format.

createdBystring
Optional
Not PII
Identity of the creator of this Conversation.

notificationLevelenum<string>
Optional
Not PII
The Notification Level of this User Conversation. One of default or muted.
Possible values:
defaultmuted

uniqueNamestring
Optional
PII MTL: 30 days
An application-defined string that uniquely identifies the Conversation resource. It can be used to address the resource in place of the resource's conversation_sid in the URL.

urlstring<uri>
Optional
Not PII

linksobject<uri-map>
Optional
Not PII
Contains absolute URLs to access the participant and conversation of this conversation.

Fetch a specific conversation
GET https://conversations.twilio.com/v1/Users/{UserSid}/Conversations/{ConversationSid}
The {UserSid} value can be either the sid or the identity of the User resource and the {ConversationSid} value can be either the sid or the unique_name of the Conversation to fetch.
Path parameters
Property nameTypeRequiredPIIDescription
userSidstring
required
Not PII
The unique SID identifier of the User resource. This value can be either the sid or the identity of the User resource.

conversationSidstring
required
Not PII
The unique SID identifier of the Conversation. This value can be either the sid or the unique_name of the Conversation resource.
Fetch a specific conversation
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchUserConversation() {


 const userConversation = await client.conversations.v1


   .users("USXXXXXXXXXXXXX")


   .userConversations("CHXXXXXXXXXXXXX")


   .fetch();





 console.log(userConversation.accountSid);


}





fetchUserConversation();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "CHXXXXXXXXXXXXX",


 "unread_messages_count": 100,


 "last_read_message_index": 100,


 "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "user_sid": "USXXXXXXXXXXXXX",


 "friendly_name": "friendly_name",


 "conversation_state": "inactive",


 "timers": {


   "date_inactive": "2015-12-16T22:19:38Z",


   "date_closed": "2015-12-16T22:28:38Z"


 },


 "attributes": "{}",


 "date_created": "2015-07-30T20:00:00Z",


 "date_updated": "2015-07-30T20:00:00Z",


 "created_by": "created_by",


 "notification_level": "default",


 "unique_name": "unique_name",


 "url": "https://conversations.twilio.com/v1/Users/USaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "participant": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


   "conversation": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


 }


}

List All of a User's Conversations
GET https://conversations.twilio.com/v1/Users/{UserSid}/Conversations
The {UserSid} value can be either the sid or the identity of the User resource to read UserConversation resources from.
Path parameters
Property nameTypeRequiredPIIDescription
userSidstring
required
Not PII
The unique SID identifier of the User resource. This value can be either the sid or the identity of the User resource.
Query parameters
Property nameTypeRequiredPIIDescription
pageSizeinteger<int64>
Optional
Not PII
How many resources to return in each list page. The default is 50, and the maximum is 50.
Minimum:1Maximum:50

pageinteger
Optional
Not PII
The page index. This value is simply for client state.
Minimum:0

pageTokenstring
Optional
Not PII
The page token. This is provided by the API.
List All of a User's Conversations
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function listUserConversation() {


 const userConversations = await client.conversations.v1


   .users("USXXXXXXXXXXXXX")


   .userConversations.list({ limit: 20 });





 userConversations.forEach((u) => console.log(u.accountSid));


}





listUserConversation();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "conversations": [],


 "meta": {


   "page": 0,


   "page_size": 50,


   "first_page_url": "https://conversations.twilio.com/v1/Users/USaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations?PageSize=50&Page=0",


   "previous_page_url": null,


   "url": "https://conversations.twilio.com/v1/Users/USaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations?PageSize=50&Page=0",


   "next_page_url": null,


   "key": "conversations"


 }


}

Update a specific conversation
POST https://conversations.twilio.com/v1/Users/{UserSid}/Conversations/{ConversationSid}
Path parameters
Property nameTypeRequiredPIIDescription
userSidstring
required
Not PII
The unique SID identifier of the User resource. This value can be either the sid or the identity of the User resource.

conversationSidstring
required
Not PII
The unique SID identifier of the Conversation. This value can be either the sid or the unique_name of the Conversation resource.
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
notificationLevelenum<string>
Optional
Not PII
The Notification Level of this User Conversation. One of default or muted.
Possible values:
defaultmuted

lastReadTimestampstring<date-time>
Optional
Not PII
The date of the last message read in conversation by the user, given in ISO 8601 format.

lastReadMessageIndexinteger
Optional
Not PII
The index of the last Message in the Conversation that the Participant has read.
Update a specific conversation
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateUserConversation() {


 const userConversation = await client.conversations.v1


   .users("USXXXXXXXXXXXXX")


   .userConversations("CHXXXXXXXXXXXXX")


   .update({ notificationLevel: "default" });





 console.log(userConversation.accountSid);


}





updateUserConversation();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "CHXXXXXXXXXXXXX",


 "unread_messages_count": 100,


 "last_read_message_index": 100,


 "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "user_sid": "USXXXXXXXXXXXXX",


 "friendly_name": "friendly_name",


 "conversation_state": "inactive",


 "timers": {


   "date_inactive": "2015-12-16T22:19:38Z",


   "date_closed": "2015-12-16T22:28:38Z"


 },


 "attributes": "{}",


 "date_created": "2015-07-30T20:00:00Z",


 "date_updated": "2015-07-30T20:00:00Z",


 "created_by": "created_by",


 "notification_level": "default",


 "unique_name": "unique_name",


 "url": "https://conversations.twilio.com/v1/Users/USaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "participant": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


   "conversation": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


 }


}

Set the NotificationLevel for a conversation
POST https://conversations.twilio.com/v1/Users/{UserSid}/Conversations/{ConversationSid}
The NotificationLevel property expresses whether a user receives pushes for this conversation or not. This can be set separately for each user/conversation pair.
Path parameters
Property nameTypeRequiredPIIDescription
userSidstring
required
Not PII
The unique SID identifier of the User resource. This value can be either the sid or the identity of the User resource.

conversationSidstring
required
Not PII
The unique SID identifier of the Conversation. This value can be either the sid or the unique_name of the Conversation resource.
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
notificationLevelenum<string>
Optional
Not PII
The Notification Level of this User Conversation. One of default or muted.
Possible values:
defaultmuted

lastReadTimestampstring<date-time>
Optional
Not PII
The date of the last message read in conversation by the user, given in ISO 8601 format.

lastReadMessageIndexinteger
Optional
Not PII
The index of the last Message in the Conversation that the Participant has read.
Mute Notifications for a Conversation
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateUserConversation() {


 const userConversation = await client.conversations.v1


   .users("UserSid")


   .userConversations("ConversationSid")


   .update({ notificationLevel: "muted" });





 console.log(userConversation.notificationLevel);


}





updateUserConversation();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "unread_messages_count": 100,


 "last_read_message_index": 100,


 "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "user_sid": "UserSid",


 "friendly_name": "friendly_name",


 "conversation_state": "inactive",


 "timers": {


   "date_inactive": "2015-12-16T22:19:38Z",


   "date_closed": "2015-12-16T22:28:38Z"


 },


 "attributes": "{}",


 "date_created": "2015-07-30T20:00:00Z",


 "date_updated": "2015-07-30T20:00:00Z",


 "created_by": "created_by",


 "notification_level": "muted",


 "unique_name": "unique_name",


 "url": "https://conversations.twilio.com/v1/Users/USaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "participant": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


   "conversation": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


 }


}

Remove a User from one of their Conversations
DELETE https://conversations.twilio.com/v1/Users/{UserSid}/Conversations/{ConversationSid}
Path parameters
Property nameTypeRequiredPIIDescription
userSidstring
required
Not PII
The unique SID identifier of the User resource. This value can be either the sid or the identity of the User resource.

conversationSidstring
required
Not PII
The unique SID identifier of the Conversation. This value can be either the sid or the unique_name of the Conversation resource.
Remove a User from one of their Conversations
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function deleteUserConversation() {


 await client.conversations.v1


   .users("USXXXXXXXXXXXXX")


   .userConversations("CHXXXXXXXXXXXXX")


   .remove();


}





deleteUserConversation();

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
User Conversation Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
ParticipantConversation Properties
List All of a Participant's Conversations
Query parameters
Participant Conversation Resource

The ParticipantConversation resource lists all the Conversations for a specific participant. It performs the lookup using an exact match to the participant identifier.
This resource supports the lookup of conversations for a specific participant based on two types of query parameters:
Identity: for Chat users,
Address: for non-Chat members, e.g., SMS or WhatsApp addresses.
Users can provide only one parameter at a time, i.e. either identity or address. The returned data will be sorted by the conversationSid alphabetically.

ParticipantConversation Properties
Each Participant Conversation resource contains these properties.
Property nameTypeRequiredDescriptionChild properties
accountSidSID<AC>
Optional
Not PII
The unique ID of the Account responsible for this conversation.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

chatServiceSidSID<IS>
Optional
Not PII
The unique ID of the Conversation Service this conversation belongs to.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

participantSidSID<MB>
Optional
Not PII
The unique ID of the Participant.
Pattern:^MB[0-9a-fA-F]{32}$Min length:34Max length:34

participantUserSidSID<US>
Optional
Not PII
The unique string that identifies the conversation participant as Conversation User.
Pattern:^US[0-9a-fA-F]{32}$Min length:34Max length:34

participantIdentitystring
Optional
PII MTL: 30 days
A unique string identifier for the conversation participant as Conversation User. This parameter is non-null if (and only if) the participant is using the Conversations SDK to communicate. Limited to 256 characters.

participantMessagingBindingobject
Optional
PII MTL: 30 days
Information about how this participant exchanges messages with the conversation. A JSON parameter consisting of type and address fields of the participant.

conversationSidSID<CH>
Optional
Not PII
The unique ID of the Conversation this Participant belongs to.
Pattern:^CH[0-9a-fA-F]{32}$Min length:34Max length:34

conversationUniqueNamestring
Optional
PII MTL: 30 days
An application-defined string that uniquely identifies the Conversation resource.

conversationFriendlyNamestring
Optional
PII MTL: 30 days
The human-readable name of this conversation, limited to 256 characters. Optional.

conversationAttributesstring
Optional
PII MTL: 30 days
An optional string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set "{}" will be returned.

conversationDateCreatedstring<date-time>
Optional
Not PII
The date that this conversation was created, given in ISO 8601 format.

conversationDateUpdatedstring<date-time>
Optional
Not PII
The date that this conversation was last updated, given in ISO 8601 format.

conversationCreatedBystring
Optional
Not PII
Identity of the creator of this Conversation.

conversationStateenum<string>
Optional
Not PII
The current state of this User Conversation. One of inactive, active or closed.
Possible values:
inactiveactiveclosed

conversationTimersobject
Optional
Not PII
Timer date values representing state update for this conversation.

linksobject<uri-map>
Optional
Not PII
Contains absolute URLs to access the participant and conversation of this conversation.

List All of a Participant's Conversations
GET https://conversations.twilio.com/v1/ParticipantConversations
The ParticipantConversation resource also supports pagination via additional parameters like: PageSize and PageToken.
(information)
Info
It's expected that you will encode the url for the ParticipantConversations endpoint, for example, if a phone number is passed as an address parameter the + character should be encoded as %2B.
(warning)
Warning
In the Group MMS use case, it may happen that the participant might not have an identifier (no address and no identity). So, this endpoint will not return conversations for this participant. Similarly if the identity of this participant with Projected Address is created later then this endpoint will not return conversations to which this participant was added when it was without identity.
Query parameters
Property nameTypeRequiredPIIDescription
identitystring
Optional
Not PII
A unique string identifier for the conversation participant as Conversation User. This parameter is non-null if (and only if) the participant is using the Conversations SDK to communicate. Limited to 256 characters.

addressstring
Optional
Not PII
A unique string identifier for the conversation participant who's not a Conversation User. This parameter could be found in messaging_binding.address field of Participant resource. It should be url-encoded.

pageSizeinteger<int64>
Optional
Not PII
How many resources to return in each list page. The default is 50, and the maximum is 50.
Minimum:1Maximum:50

pageinteger
Optional
Not PII
The page index. This value is simply for client state.
Minimum:0

pageTokenstring
Optional
Not PII
The page token. This is provided by the API.
List All of a Participant's Conversations
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function listParticipantConversation() {


 const participantConversations =


   await client.conversations.v1.participantConversations.list({


     address: "+375255555555",


     limit: 20,


   });





 participantConversations.forEach((p) => console.log(p.accountSid));


}





listParticipantConversation();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "conversations": [


   {


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_friendly_name": "friendly_name",


     "conversation_state": "inactive",


     "conversation_timers": {


       "date_inactive": "2015-12-16T22:19:38Z",


       "date_closed": "2015-12-16T22:28:38Z"


     },


     "conversation_attributes": "{}",


     "conversation_date_created": "2015-07-30T20:00:00Z",


     "conversation_date_updated": "2015-07-30T20:00:00Z",


     "conversation_created_by": "created_by",


     "conversation_unique_name": "unique_name",


     "participant_user_sid": null,


     "participant_identity": null,


     "participant_messaging_binding": {


       "address": "+375255555555",


       "proxy_address": "+12345678910",


       "type": "sms",


       "level": null,


       "name": null,


       "projected_address": null


     },


     "links": {


       "participant": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


       "conversation": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


     }


   }


 ],


 "meta": {


   "page": 0,


   "page_size": 50,


   "first_page_url": "https://conversations.twilio.com/v1/ParticipantConversations?Address=%2B375255555555&PageSize=50&Page=0",


   "previous_page_url": null,


   "url": "https://conversations.twilio.com/v1/ParticipantConversations?Address=%2B375255555555&PageSize=50&Page=0",


   "next_page_url": null,


   "key": "conversations"


 }


}

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Participant Conversation Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service-Scoped Notification
Service Binding
Credential
Service Configuration
Multiservice
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
API Base URL
Notification Properties
Fetch a ServiceNotification resource
Path parameters
Update a ServiceNotification resource
Path parameters
Request body parameters
Service-Scoped Notification Resource

The Twilio Conversations Service Notification resource manages a set of settings to determine push notification Service Binding behavior for a specific Conversation Service.

API Base URL
All URLs in the reference documentation use the following base URL:
Copy code block
https://conversations.twilio.com/v1


For Conversations applications that build on more than one Conversation Service instance, you will need to specify the Conversation Service SID in the REST API call:
Copy code block
GET /v1/Services/ISxx/Conversations/CHxx/Messages



Notification Properties
Property nameTypeRequiredDescriptionChild properties
accountSidSID<AC>
Optional
Not PII
The unique ID of the Account responsible for this configuration.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

chatServiceSidSID<IS>
Optional
Not PII
The SID of the Conversation Service the Configuration applies to.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

newMessageobject
Optional
Not PII
The Push Notification configuration for New Messages.

addedToConversationobject
Optional
Not PII
The Push Notification configuration for being added to a Conversation.

removedFromConversationobject
Optional
Not PII
The Push Notification configuration for being removed from a Conversation.

logEnabledboolean
Optional
Not PII
Weather the notification logging is enabled.

urlstring<uri>
Optional
Not PII
An absolute API resource URL for this configuration.

Fetch a ServiceNotification resource
GET https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Configuration/Notifications
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Configuration applies to.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34
Fetch a Notification
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchServiceNotification() {


 const notification = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .configuration.notifications()


   .fetch();





 console.log(notification.accountSid);


}





fetchServiceNotification();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "log_enabled": false,


 "added_to_conversation": {


   "enabled": true,


   "template": "You have been added to a Conversation: ${CONVERSATION}",


   "sound": "ring"


 },


 "new_message": {


   "enabled": true,


   "template": "You have a new message in ${CONVERSATION} from ${PARTICIPANT}: ${MESSAGE}",


   "badge_count_enabled": false,


   "sound": "ring",


   "with_media": {


     "enabled": false,


     "template": "You have a new message in ${CONVERSATION} with ${MEDIA_COUNT} media files: ${MEDIA}"


   }


 },


 "removed_from_conversation": {


   "enabled": true,


   "template": "You have been removed from a Conversation: ${CONVERSATION}",


   "sound": "ring"


 },


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Configuration/Notifications"


}

Update a ServiceNotification resource
POST https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Configuration/Notifications
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Configuration applies to.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
logEnabledboolean
Optional
Not PII
Weather the notification logging is enabled.

newMessage.enabledboolean
Optional
Not PII
Whether to send a notification when a new message is added to a conversation. The default is false.

newMessage.templatestring
Optional
Not PII
The template to use to create the notification text displayed when a new message is added to a conversation and new_message.enabled is true.

newMessage.soundstring
Optional
Not PII
The name of the sound to play when a new message is added to a conversation and new_message.enabled is true.

newMessage.badgeCountEnabledboolean
Optional
Not PII
Whether the new message badge is enabled. The default is false.

addedToConversation.enabledboolean
Optional
Not PII
Whether to send a notification when a participant is added to a conversation. The default is false.

addedToConversation.templatestring
Optional
Not PII
The template to use to create the notification text displayed when a participant is added to a conversation and added_to_conversation.enabled is true.

addedToConversation.soundstring
Optional
Not PII
The name of the sound to play when a participant is added to a conversation and added_to_conversation.enabled is true.

removedFromConversation.enabledboolean
Optional
Not PII
Whether to send a notification to a user when they are removed from a conversation. The default is false.

removedFromConversation.templatestring
Optional
Not PII
The template to use to create the notification text displayed to a user when they are removed from a conversation and removed_from_conversation.enabled is true.

removedFromConversation.soundstring
Optional
Not PII
The name of the sound to play to a user when they are removed from a conversation and removed_from_conversation.enabled is true.

newMessage.withMedia.enabledboolean
Optional
Not PII
Whether to send a notification when a new message with media/file attachments is added to a conversation. The default is false.

newMessage.withMedia.templatestring
Optional
Not PII
The template to use to create the notification text displayed when a new message with media/file attachments is added to a conversation and new_message.attachments.enabled is true.
Update a Notification
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateServiceNotification() {


 const notification = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .configuration.notifications()


   .update({ logEnabled: false });





 console.log(notification.accountSid);


}





updateServiceNotification();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "log_enabled": false,


 "added_to_conversation": {


   "enabled": false,


   "template": "You have been added to a Conversation: ${CONVERSATION}",


   "sound": "ring"


 },


 "new_message": {


   "enabled": false,


   "template": "You have a new message in ${CONVERSATION} from ${PARTICIPANT}: ${MESSAGE}",


   "badge_count_enabled": true,


   "sound": "ring",


   "with_media": {


     "enabled": false,


     "template": "You have a new message in ${CONVERSATION} with ${MEDIA_COUNT} media files: ${MEDIA}"


   }


 },


 "removed_from_conversation": {


   "enabled": false,


   "template": "You have been removed from a Conversation: ${CONVERSATION}",


   "sound": "ring"


 },


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Configuration/Notifications"


}

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Service-Scoped Notification Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service-Scoped Notification
Service Binding
Credential
Service Configuration
Multiservice
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Binding Properties
Fetch a ServiceBinding resource
Path parameters
Read multiple ServiceBinding resources
Path parameters
Query parameters
Delete a ServiceBinding resource
Path parameters
Service Binding Resource

A Binding resource in Twilio Conversations represents a Push notification subscription for a User within their Service instance. Bindings are unique per Service instance, User identity, device, and notification channel (such as APNS, GCM, FCM).

Binding Properties
Each Binding resource has the following properties:
Property nameTypeRequiredDescriptionChild properties
sidSID<BS>
Optional
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^BS[0-9a-fA-F]{32}$Min length:34Max length:34

accountSidSID<AC>
Optional
Not PII
The unique ID of the Account responsible for this binding.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

chatServiceSidSID<IS>
Optional
Not PII
The SID of the Conversation Service the Binding resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

credentialSidSID<CR>
Optional
Not PII
The SID of the Credential for the binding. See push notification configuration for more info.
Pattern:^CR[0-9a-fA-F]{32}$Min length:34Max length:34

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated.

endpointstring
Optional
PII MTL: 30 days
The unique endpoint identifier for the Binding. The format of this value depends on the binding_type.

identitystring
Optional
PII MTL: 30 days
The application-defined string that uniquely identifies the Conversation User within the Conversation Service. See access tokens for more info.

bindingTypeenum<string>
Optional
Not PII
The push technology to use for the Binding. Can be: apn, gcm, or fcm. See push notification configuration for more info.
Possible values:
apngcmfcm

messageTypesarray[string]
Optional
Not PII
The Conversation message types the binding is subscribed to.

urlstring<uri>
Optional
Not PII
An absolute API resource URL for this binding.

Fetch a ServiceBinding resource
GET https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Bindings/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Binding resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

sidSID<BS>
required
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^BS[0-9a-fA-F]{32}$Min length:34Max length:34
Fetch a Binding
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchServiceBinding() {


 const binding = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .bindings("BSaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .fetch();





 console.log(binding.sid);


}





fetchServiceBinding();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "BSaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "date_created": "2016-10-21T11:37:03Z",


 "date_updated": "2016-10-21T11:37:03Z",


 "endpoint": "TestUser-endpoint",


 "identity": "TestUser",


 "binding_type": "gcm",


 "credential_sid": "CRaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "message_types": [


   "removed_from_conversation",


   "new_message",


   "added_to_conversation"


 ],


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Bindings/BSaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Read multiple ServiceBinding resources
GET https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Bindings
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Binding resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34
Query parameters
Property nameTypeRequiredPIIDescription
bindingTypearray[enum<string>]
Optional
Not PII
The push technology used by the Binding resources to read. Can be: apn, gcm, or fcm. See push notification configuration for more info.
Possible values:
apngcmfcm

identityarray[string]
Optional
PII MTL: 30 days
The identity of a Conversation User this binding belongs to. See access tokens for more details.

pageSizeinteger<int64>
Optional
Not PII
How many resources to return in each list page. The default is 50, and the maximum is 100.
Minimum:1Maximum:100

pageinteger
Optional
Not PII
The page index. This value is simply for client state.
Minimum:0

pageTokenstring
Optional
Not PII
The page token. This is provided by the API.
List multiple Bindings
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function listServiceBinding() {


 const bindings = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .bindings.list({ limit: 20 });





 bindings.forEach((b) => console.log(b.sid));


}





listServiceBinding();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "meta": {


   "page": 0,


   "page_size": 50,


   "first_page_url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Bindings?PageSize=50&Page=0",


   "previous_page_url": null,


   "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Bindings?PageSize=50&Page=0",


   "next_page_url": null,


   "key": "bindings"


 },


 "bindings": [


   {


     "sid": "BSaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "date_created": "2016-10-21T11:37:03Z",


     "date_updated": "2016-10-21T11:37:03Z",


     "endpoint": "TestUser-endpoint",


     "identity": "TestUser",


     "binding_type": "gcm",


     "credential_sid": "CRaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "message_types": [


       "removed_from_conversation",


       "new_message",


       "added_to_conversation"


     ],


     "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Bindings/BSaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


   }


 ]


}

Delete a ServiceBinding resource
DELETE https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Bindings/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service to delete the Binding resource from.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

sidSID<BS>
required
Not PII
The SID of the Binding resource to delete.
Pattern:^BS[0-9a-fA-F]{32}$Min length:34Max length:34
Delete a Binding
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function deleteServiceBinding() {


 await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .bindings("BSaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .remove();


}





deleteServiceBinding();

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Service Binding Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service-Scoped Notification
Service Binding
Credential
Service Configuration
Multiservice
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Credential Properties
Create a Credential resource
Request body parameters
Fetch a Credential resource
Path parameters
Read multiple Credential resources
Query parameters
Update a Credential resource
Path parameters
Request body parameters
Delete a Credential resource
Path parameters
Credential Resource

The Credential resource represents one credential record for a specific push notifications channel. Twilio Conversations supports the APNS, FCM, and GCM push notification channels. Each push notification channel vendor issues its own Credentials, and they can vary between vendors. The Credential resource allows you to save the Credentials that should be used for push notifications to a specific channel.

Credential Properties
The Credential resource contains these properties:
Property nameTypeRequiredDescriptionChild properties
sidSID<CR>
Optional
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^CR[0-9a-fA-F]{32}$Min length:34Max length:34

accountSidSID<AC>
Optional
Not PII
The unique ID of the Account responsible for this credential.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

friendlyNamestring
Optional
PII MTL: 30 days
The human-readable name of this credential, limited to 64 characters. Optional.

typeenum<string>
Optional
Not PII
The type of push-notification service the credential is for. Can be: fcm, gcm, or apn.
Possible values:
apngcmfcm

sandboxstring
Optional
Not PII
[APN only] Whether to send the credential to sandbox APNs. Can be true to send to sandbox APNs or false to send to production.

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated.

urlstring<uri>
Optional
Not PII
An absolute API resource URL for this credential.

Create a Credential resource
POST https://conversations.twilio.com/v1/Credentials
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
typeenum<string>
required
Not PII
The type of push-notification service the credential is for. Can be: fcm, gcm, or apn.
Possible values:
apngcmfcm

friendlyNamestring
Optional
PII MTL: 30 days
A descriptive string that you create to describe the new resource. It can be up to 64 characters long.

certificatestring
Optional
Not PII
[APN only] The URL encoded representation of the certificate. For example, -----BEGIN CERTIFICATE----- MIIFnTCCBIWgAwIBAgIIAjy9H849+E8wDQYJKoZIhvcNAQEF.....A== -----END CERTIFICATE-----.

privateKeystring
Optional
Not PII
[APN only] The URL encoded representation of the private key. For example, -----BEGIN RSA PRIVATE KEY----- MIIEpQIBAAKCAQEAuyf/lNrH9ck8DmNyo3fG... -----END RSA PRIVATE KEY-----.

sandboxboolean
Optional
Not PII
[APN only] Whether to send the credential to sandbox APNs. Can be true to send to sandbox APNs or false to send to production.

apiKeystring
Optional
Not PII
[GCM only] The API key for the project that was obtained from the Google Developer console for your GCM Service application credential.

secretstring
Optional
Not PII
[FCM only] The Server key of your project from the Firebase console, found under Settings / Cloud messaging.
Create a Credential
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createCredential() {


 const credential = await client.conversations.v1.credentials.create({


   type: "apn",


 });





 console.log(credential.sid);


}





createCredential();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "CRaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "Test slow create",


 "type": "apn",


 "sandbox": "False",


 "date_created": "2015-10-07T17:50:01Z",


 "date_updated": "2015-10-07T17:50:01Z",


 "url": "https://conversations.twilio.com/v1/Credentials/CRaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Fetch a Credential resource
GET https://conversations.twilio.com/v1/Credentials/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
sidSID<CR>
required
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^CR[0-9a-fA-F]{32}$Min length:34Max length:34
Fetch a Credential
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchCredential() {


 const credential = await client.conversations.v1


   .credentials("CRaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .fetch();





 console.log(credential.sid);


}





fetchCredential();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "CRaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "Test slow create",


 "type": "apn",


 "sandbox": "False",


 "date_created": "2015-10-07T17:50:01Z",


 "date_updated": "2015-10-07T17:50:01Z",


 "url": "https://conversations.twilio.com/v1/Credentials/CRaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Read multiple Credential resources
GET https://conversations.twilio.com/v1/Credentials
Query parameters
Property nameTypeRequiredPIIDescription
pageSizeinteger<int64>
Optional
Not PII
How many resources to return in each list page. The default is 50, and the maximum is 100.
Minimum:1Maximum:100

pageinteger
Optional
Not PII
The page index. This value is simply for client state.
Minimum:0

pageTokenstring
Optional
Not PII
The page token. This is provided by the API.
List multiple Credentials
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function listCredential() {


 const credentials = await client.conversations.v1.credentials.list({


   limit: 20,


 });





 credentials.forEach((c) => console.log(c.sid));


}





listCredential();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "credentials": [


   {


     "sid": "CRaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "friendly_name": "Test slow create",


     "type": "apn",


     "sandbox": "False",


     "date_created": "2015-10-07T17:50:01Z",


     "date_updated": "2015-10-07T17:50:01Z",


     "url": "https://conversations.twilio.com/v1/Credentials/CRaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


   }


 ],


 "meta": {


   "page": 0,


   "page_size": 50,


   "first_page_url": "https://conversations.twilio.com/v1/Credentials?PageSize=50&Page=0",


   "previous_page_url": null,


   "url": "https://conversations.twilio.com/v1/Credentials?PageSize=50&Page=0",


   "next_page_url": null,


   "key": "credentials"


 }


}

Update a Credential resource
POST https://conversations.twilio.com/v1/Credentials/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
sidSID<CR>
required
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^CR[0-9a-fA-F]{32}$Min length:34Max length:34
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
typeenum<string>
Optional
Not PII
The type of push-notification service the credential is for. Can be: fcm, gcm, or apn.
Possible values:
apngcmfcm

friendlyNamestring
Optional
PII MTL: 30 days
A descriptive string that you create to describe the new resource. It can be up to 64 characters long.

certificatestring
Optional
Not PII
[APN only] The URL encoded representation of the certificate. For example, -----BEGIN CERTIFICATE----- MIIFnTCCBIWgAwIBAgIIAjy9H849+E8wDQYJKoZIhvcNAQEF.....A== -----END CERTIFICATE-----.

privateKeystring
Optional
Not PII
[APN only] The URL encoded representation of the private key. For example, -----BEGIN RSA PRIVATE KEY----- MIIEpQIBAAKCAQEAuyf/lNrH9ck8DmNyo3fG... -----END RSA PRIVATE KEY-----.

sandboxboolean
Optional
Not PII
[APN only] Whether to send the credential to sandbox APNs. Can be true to send to sandbox APNs or false to send to production.

apiKeystring
Optional
Not PII
[GCM only] The API key for the project that was obtained from the Google Developer console for your GCM Service application credential.

secretstring
Optional
Not PII
[FCM only] The Server key of your project from the Firebase console, found under Settings / Cloud messaging.
Update a Credential
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateCredential() {


 const credential = await client.conversations.v1


   .credentials("CRaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .update({ type: "apn" });





 console.log(credential.sid);


}





updateCredential();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "CRaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "Test slow create",


 "type": "apn",


 "sandbox": "False",


 "date_created": "2015-10-07T17:50:01Z",


 "date_updated": "2015-10-07T17:50:01Z",


 "url": "https://conversations.twilio.com/v1/Credentials/CRaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Delete a Credential resource
DELETE https://conversations.twilio.com/v1/Credentials/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
sidSID<CR>
required
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^CR[0-9a-fA-F]{32}$Min length:34Max length:34
Delete a Credential
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function deleteCredential() {


 await client.conversations.v1


   .credentials("CRaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .remove();


}





deleteCredential();

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Credential Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Configuration Properties
Fetch a ServiceConfiguration resource
Path parameters
Update a ServiceConfiguration resource
Path parameters
Request body parameters
Service Configuration Resource

The Configuration Resource represents all of the configuration settings for a Conversation Service, such as the default roles assigned to Users.

Configuration Properties
Property nameTypeRequiredDescriptionChild properties
chatServiceSidSID<IS>
Optional
Not PII
The unique string that we created to identify the Service configuration resource.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

defaultConversationCreatorRoleSidSID<RL>
Optional
Not PII
The conversation-level role assigned to a conversation creator when they join a new conversation. See Conversation Role for more info about roles.
Pattern:^RL[0-9a-fA-F]{32}$Min length:34Max length:34

defaultConversationRoleSidSID<RL>
Optional
Not PII
The conversation-level role assigned to users when they are added to a conversation. See Conversation Role for more info about roles.
Pattern:^RL[0-9a-fA-F]{32}$Min length:34Max length:34

defaultChatServiceRoleSidSID<RL>
Optional
Not PII
The service-level role assigned to users when they are added to the service. See Conversation Role for more info about roles.
Pattern:^RL[0-9a-fA-F]{32}$Min length:34Max length:34

urlstring<uri>
Optional
Not PII
An absolute API resource URL for this service configuration.

linksobject<uri-map>
Optional
Not PII
Contains an absolute API resource URL to access the push notifications configuration of this service.

reachabilityEnabledboolean
Optional
Not PII
Whether the Reachability Indicator is enabled for this Conversations Service. The default is false.

Fetch a ServiceConfiguration resource
GET https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Configuration
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Service configuration resource to fetch.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34
Fetch a Configuration
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchServiceConfiguration() {


 const configuration = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .configuration()


   .fetch();





 console.log(configuration.chatServiceSid);


}





fetchServiceConfiguration();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "default_conversation_creator_role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "default_conversation_role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "default_chat_service_role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "reachability_enabled": false,


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Configuration",


 "links": {


   "notifications": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Configuration/Notifications",


   "webhooks": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Configuration/Webhooks"


 }


}

Update a ServiceConfiguration resource
POST https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Configuration
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Service configuration resource to update.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
defaultConversationCreatorRoleSidSID<RL>
Optional
Not PII
The conversation-level role assigned to a conversation creator when they join a new conversation. See Conversation Role for more info about roles.
Pattern:^RL[0-9a-fA-F]{32}$Min length:34Max length:34

defaultConversationRoleSidSID<RL>
Optional
Not PII
The conversation-level role assigned to users when they are added to a conversation. See Conversation Role for more info about roles.
Pattern:^RL[0-9a-fA-F]{32}$Min length:34Max length:34

defaultChatServiceRoleSidSID<RL>
Optional
Not PII
The service-level role assigned to users when they are added to the service. See Conversation Role for more info about roles.
Pattern:^RL[0-9a-fA-F]{32}$Min length:34Max length:34

reachabilityEnabledboolean
Optional
Not PII
Whether the Reachability Indicator is enabled for this Conversations Service. The default is false.
Update a Configuration
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateServiceConfiguration() {


 const configuration = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .configuration()


   .update({


     defaultConversationCreatorRoleSid: "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


   });





 console.log(configuration.chatServiceSid);


}





updateServiceConfiguration();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "default_conversation_creator_role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "default_conversation_role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "default_chat_service_role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "reachability_enabled": false,


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Configuration",


 "links": {


   "notifications": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Configuration/Notifications",


   "webhooks": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Configuration/Webhooks"


 }


}

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Service Configuration Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Service
Conversation
Participant
Conversation with Participants
Message
Delivery Receipt
Conversation-Scoped Webhook
Per-Service Webhook
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Service Defaults in the Twilio Console
Service Properties
Create a Service resource
Request body parameters
Fetch a Service resource
Path parameters
Read multiple Service resources
Query parameters
Delete a Service resource
Path parameters
Conversation Service Resource

A Conversation Service is the top-level container for other resources in the Twilio Conversations REST API. All other Twilio Conversations resources, such as Conversations, Users, Messages, Bindings, and Credentials belong to a specific Service.
Services allow you to:
Create multiple, distinct environments (such as dev, stage, and prod) under a single Twilio account
Scope access to resources through both the REST and client APIs
Configure different Service instances with specific behaviors
A Service can also send HTTPS requests (webhooks) to URLs that you define to let you know of specific events. See what events you can subscribe to in our webhook reference
.
(error)
Do not use Personally Identifiable Information (PII) for the friendlyName field
Avoid using a person's name, home address, email, phone number, or other PII in the friendlyName field. Use some form of pseudonymized identifier, instead.
You can learn more about how we process your data in our privacy policy.

Service Defaults in the Twilio Console
You can use the REST API to configure your Conversation Service instances. (See the following examples.)
You can also find the default Conversation Service instance under Defaults in the Conversations Section
 of the Twilio Console.
You may have created non-default Conversation Service resources to separate messaging traffic, create development environments, etc. To access any non-default Conversation Service resources, the Service Sid (ISXXX) has to be a part of the url, as shown below:
Copy code block
https://conversations.twilio.com/v1/Services/ISXXX





https://conversations.twilio.com/v1/Services/ISXXX/Conversations





https://conversations.twilio.com/v1/Services/ISXXX/Conversations/CHXXX/Participants





https://conversations.twilio.com/v1/Services/ISXXX/Conversations/CHXXX/Messages

Service Properties
The Service resource contains these properties:
Property nameTypeRequiredDescriptionChild properties
accountSidSID<AC>
Optional
Not PII
The unique ID of the Account responsible for this service.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

sidSID<IS>
Optional
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

friendlyNamestring
Optional
PII MTL: 30 days
The human-readable name of this service, limited to 256 characters. Optional.

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated.

urlstring<uri>
Optional
Not PII
An absolute API resource URL for this service.

linksobject<uri-map>
Optional
Not PII
Contains absolute API resource URLs to access conversations, users, roles, bindings and configuration of this service.

Create a Service resource
POST https://conversations.twilio.com/v1/Services
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
friendlyNamestring
required
PII MTL: 30 days
The human-readable name of this service, limited to 256 characters. Optional.
Create a Service
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createService() {


 const service = await client.conversations.v1.services.create({


   friendlyName: "FriendlyName",


 });





 console.log(service.accountSid);


}





createService();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "FriendlyName",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "conversations": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations",


   "users": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Users",


   "roles": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Roles",


   "bindings": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Bindings",


   "configuration": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Configuration",


   "participant_conversations": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ParticipantConversations",


   "conversation_with_participants": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ConversationWithParticipants"


 }


}

Fetch a Service resource
GET https://conversations.twilio.com/v1/Services/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
sidSID<IS>
required
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34
Fetch a Service
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchService() {


 const service = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .fetch();





 console.log(service.accountSid);


}





fetchService();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "My First Service",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "conversations": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations",


   "users": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Users",


   "roles": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Roles",


   "bindings": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Bindings",


   "configuration": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Configuration",


   "participant_conversations": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ParticipantConversations",


   "conversation_with_participants": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ConversationWithParticipants"


 }


}

Read multiple Service resources
GET https://conversations.twilio.com/v1/Services
Query parameters
Property nameTypeRequiredPIIDescription
pageSizeinteger<int64>
Optional
Not PII
How many resources to return in each list page. The default is 50, and the maximum is 100.
Minimum:1Maximum:100

pageinteger
Optional
Not PII
The page index. This value is simply for client state.
Minimum:0

pageTokenstring
Optional
Not PII
The page token. This is provided by the API.
List multiple Services
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function listService() {


 const services = await client.conversations.v1.services.list({ limit: 20 });





 services.forEach((s) => console.log(s.accountSid));


}





listService();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "services": [


   {


     "sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "friendly_name": "Home Service",


     "date_created": "2015-12-16T22:18:37Z",


     "date_updated": "2015-12-16T22:18:38Z",


     "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "links": {


       "conversations": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations",


       "users": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Users",


       "roles": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Roles",


       "bindings": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Bindings",


       "configuration": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Configuration",


       "participant_conversations": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ParticipantConversations",


       "conversation_with_participants": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ConversationWithParticipants"


     }


   }


 ],


 "meta": {


   "page": 0,


   "page_size": 50,


   "first_page_url": "https://conversations.twilio.com/v1/Services?PageSize=50&Page=0",


   "previous_page_url": null,


   "url": "https://conversations.twilio.com/v1/Services?PageSize=50&Page=0",


   "next_page_url": null,


   "key": "services"


 }


}

Delete a Service resource
DELETE https://conversations.twilio.com/v1/Services/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
sidSID<IS>
required
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34
Delete a Service
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function deleteService() {


 await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .remove();


}





deleteService();

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Conversation Service Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Service
Conversation
Participant
Conversation with Participants
Message
Delivery Receipt
Conversation-Scoped Webhook
Per-Service Webhook
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
API Base URL
Service-Scoped Conversation Properties
Create a Service-Scoped Conversation
Headers
Path parameters
Request body parameters
Fetch a Service-Scoped Conversation
Path parameters
Read multiple Service-Scoped Conversation resources
Path parameters
Query parameters
Update a Service-Scoped Conversation resource
Headers
Path parameters
Request body parameters
Delete a Service-Scoped Conversation
Headers
Path parameters
Service-Scoped Conversation Resource

A Service-scoped Conversation is a unique thread of a conversation that is scoped or limited to a specific, non-default Conversation Service.
Please see the Conversation Resource for Conversations within the default Conversation Service instance.

API Base URL
All URLs in the reference documentation use the following base URL:
Copy code block
https://conversations.twilio.com/v1


For Conversations applications that build on more than one Conversation Service instance, you will need to specify the Conversation Service SID in the REST API call:
Copy code block
GET /v1/Services/ISxx/Conversations/CHxx/Messages



Service-Scoped Conversation Properties
Property nameTypeRequiredDescriptionChild properties
accountSidSID<AC>
Optional
Not PII
The unique ID of the Account responsible for this conversation.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

chatServiceSidSID<IS>
Optional
Not PII
The unique ID of the Conversation Service this conversation belongs to.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

messagingServiceSidSID<MG>
Optional
Not PII
The unique ID of the Messaging Service this conversation belongs to.
Pattern:^MG[0-9a-fA-F]{32}$Min length:34Max length:34

sidSID<CH>
Optional
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^CH[0-9a-fA-F]{32}$Min length:34Max length:34

friendlyNamestring
Optional
PII MTL: 30 days
The human-readable name of this conversation, limited to 256 characters. Optional.

uniqueNamestring
Optional
PII MTL: 30 days
An application-defined string that uniquely identifies the resource. It can be used to address the resource in place of the resource's sid in the URL.

attributesstring
Optional
PII MTL: 30 days
An optional string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set "{}" will be returned.

stateenum<string>
Optional
Not PII
Current state of this conversation. Can be either initializing, active, inactive or closed and defaults to active
Possible values:
inactiveactiveclosed

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated.

timersobject
Optional
Not PII
Timer date values representing state update for this conversation.

urlstring<uri>
Optional
Not PII
An absolute API resource URL for this conversation.

linksobject<uri-map>
Optional
Not PII
Contains absolute URLs to access the participants, messages and webhooks of this conversation.

bindingsobject
Optional
Not PII

Create a Service-Scoped Conversation
POST https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Conversations
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Conversation resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
friendlyNamestring
Optional
PII MTL: 30 days
The human-readable name of this conversation, limited to 256 characters. Optional.

uniqueNamestring
Optional
PII MTL: 30 days
An application-defined string that uniquely identifies the resource. It can be used to address the resource in place of the resource's sid in the URL.

attributesstring
Optional
PII MTL: 30 days
An optional string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set "{}" will be returned.

messagingServiceSidSID<MG>
Optional
Not PII
The unique ID of the Messaging Service this conversation belongs to.
Pattern:^MG[0-9a-fA-F]{32}$Min length:34Max length:34

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated.

stateenum<string>
Optional
Not PII
Current state of this conversation. Can be either initializing, active, inactive or closed and defaults to active
Possible values:
inactiveactiveclosed

timers.inactivestring
Optional
Not PII
ISO8601 duration when conversation will be switched to inactive state. Minimum value for this timer is 1 minute.

timers.closedstring
Optional
Not PII
ISO8601 duration when conversation will be switched to closed state. Minimum value for this timer is 10 minutes.

bindings.email.addressstring
Optional
Not PII
The default email address that will be used when sending outbound emails in this conversation.

bindings.email.namestring
Optional
Not PII
The default name that will be used when sending outbound emails in this conversation.
Create a Conversation
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createServiceConversation() {


 const conversation = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations.create();





 console.log(conversation.accountSid);


}





createServiceConversation();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "friendly_name",


 "unique_name": "unique_name",


 "attributes": "{ \"topic\": \"feedback\" }",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "state": "inactive",


 "timers": {


   "date_inactive": "2015-12-16T22:19:38Z",


   "date_closed": "2015-12-16T22:28:38Z"


 },


 "bindings": {},


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "participants": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",


   "messages": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",


   "webhooks": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks",


   "export": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Export"


 }


}

Fetch a Service-Scoped Conversation
GET https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Conversations/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Conversation resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

sidstring
required
Not PII
A 34 character string that uniquely identifies this resource. Can also be the unique_name of the Conversation.
Fetch a Conversation
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchServiceConversation() {


 const conversation = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations("Sid")


   .fetch();





 console.log(conversation.accountSid);


}





fetchServiceConversation();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "Sid",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "My First Conversation",


 "unique_name": "first_conversation",


 "attributes": "{ \"topic\": \"feedback\" }",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "state": "active",


 "timers": {


   "date_inactive": "2015-12-16T22:19:38Z",


   "date_closed": "2015-12-16T22:28:38Z"


 },


 "bindings": {},


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "participants": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",


   "messages": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",


   "webhooks": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks",


   "export": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Export"


 }


}

Read multiple Service-Scoped Conversation resources
GET https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Conversations
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Conversation resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34
Query parameters
Property nameTypeRequiredPIIDescription
startDatestring
Optional
Not PII
Specifies the beginning of the date range for filtering Conversations based on their creation date. Conversations that were created on or after this date will be included in the results. The date must be in ISO8601 format, specifically starting at the beginning of the specified date (YYYY-MM-DDT00:00:00Z), for precise filtering. This parameter can be combined with other filters. If this filter is used, the returned list is sorted by latest conversation creation date in descending order.

endDatestring
Optional
Not PII
Defines the end of the date range for filtering conversations by their creation date. Only conversations that were created on or before this date will appear in the results. The date must be in ISO8601 format, specifically capturing up to the end of the specified date (YYYY-MM-DDT23:59:59Z), to ensure that conversations from the entire end day are included. This parameter can be combined with other filters. If this filter is used, the returned list is sorted by latest conversation creation date in descending order.

stateenum<string>
Optional
Not PII
State for sorting and filtering list of Conversations. Can be active, inactive or closed
Possible values:
inactiveactiveclosed

pageSizeinteger<int64>
Optional
Not PII
How many resources to return in each list page. The default is 50, and the maximum is 100.
Minimum:1Maximum:100

pageinteger
Optional
Not PII
The page index. This value is simply for client state.
Minimum:0

pageTokenstring
Optional
Not PII
The page token. This is provided by the API.
List multiple Conversations
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function listServiceConversation() {


 const conversations = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations.list({ limit: 20 });





 conversations.forEach((c) => console.log(c.accountSid));


}





listServiceConversation();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "conversations": [


   {


     "sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "friendly_name": "Home Repair Visit",


     "unique_name": null,


     "attributes": "{ \"topic\": \"feedback\" }",


     "date_created": "2015-12-16T22:18:37Z",


     "date_updated": "2015-12-16T22:18:38Z",


     "state": "active",


     "timers": {


       "date_inactive": "2015-12-16T22:19:38Z",


       "date_closed": "2015-12-16T22:28:38Z"


     },


     "bindings": {},


     "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "links": {


       "participants": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",


       "messages": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",


       "webhooks": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks",


       "export": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Export"


     }


   }


 ],


 "meta": {


   "page": 0,


   "page_size": 50,


   "first_page_url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations?PageSize=50&Page=0",


   "previous_page_url": null,


   "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations?PageSize=50&Page=0",


   "next_page_url": null,


   "key": "conversations"


 }


}

Update a Service-Scoped Conversation resource
POST https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Conversations/{Sid}
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Conversation resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

sidstring
required
Not PII
A 34 character string that uniquely identifies this resource. Can also be the unique_name of the Conversation.
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
friendlyNamestring
Optional
PII MTL: 30 days
The human-readable name of this conversation, limited to 256 characters. Optional.

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated.

attributesstring
Optional
PII MTL: 30 days
An optional string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set "{}" will be returned.

messagingServiceSidSID<MG>
Optional
Not PII
The unique ID of the Messaging Service this conversation belongs to.
Pattern:^MG[0-9a-fA-F]{32}$Min length:34Max length:34

stateenum<string>
Optional
Not PII
Current state of this conversation. Can be either initializing, active, inactive or closed and defaults to active
Possible values:
inactiveactiveclosed

timers.inactivestring
Optional
Not PII
ISO8601 duration when conversation will be switched to inactive state. Minimum value for this timer is 1 minute.

timers.closedstring
Optional
Not PII
ISO8601 duration when conversation will be switched to closed state. Minimum value for this timer is 10 minutes.

uniqueNamestring
Optional
PII MTL: 30 days
An application-defined string that uniquely identifies the resource. It can be used to address the resource in place of the resource's sid in the URL.

bindings.email.addressstring
Optional
Not PII
The default email address that will be used when sending outbound emails in this conversation.

bindings.email.namestring
Optional
Not PII
The default name that will be used when sending outbound emails in this conversation.
Update a Conversation
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateServiceConversation() {


 const conversation = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations("Sid")


   .update({ friendlyName: "FriendlyName" });





 console.log(conversation.accountSid);


}





updateServiceConversation();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "Sid",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab",


 "friendly_name": "FriendlyName",


 "unique_name": "unique_name",


 "attributes": "{ \"topic\": \"feedback\" }",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "state": "inactive",


 "timers": {


   "date_inactive": "2015-12-16T22:19:38Z",


   "date_closed": "2015-12-16T22:28:38Z"


 },


 "bindings": {},


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "participants": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",


   "messages": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",


   "webhooks": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks",


   "export": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Export"


 }


}

Delete a Service-Scoped Conversation
DELETE https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Conversations/{Sid}
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Conversation resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

sidstring
required
Not PII
A 34 character string that uniquely identifies this resource. Can also be the unique_name of the Conversation.
Delete a Conversation
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function deleteServiceConversation() {


 await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations("Sid")


   .remove();


}





deleteServiceConversation();

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Service-Scoped Conversation Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Service
Conversation
Participant
Conversation with Participants
Message
Delivery Receipt
Conversation-Scoped Webhook
Per-Service Webhook
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
API Base URL
Service-Scoped Conversation Participant Properties
Create a Service-Scoped Participant resource
Headers
Path parameters
Request body parameters
Fetch a Service-Scoped Participant resource
Path parameters
Read multiple Service-Scoped Participant resources
Path parameters
Query parameters
Update a Service-Scoped Participant resource
Headers
Path parameters
Request body parameters
Delete a Service-Scoped Conversation Participant resource
Headers
Path parameters
Service-Scoped Conversation Participant Resource

Each service-scoped Participant in a Conversation represents one real (probably human) participant in a non-default, service-scoped Conversation.

API Base URL
All URLs in the reference documentation use the following base URL:
Copy code block
https://conversations.twilio.com/v1


For Conversations applications that build on more than one Conversation Service instance, you will need to specify the Conversation Service SID (ISxx) and the Conversation SID (CHxx) in the REST API call:
Copy code block
GET /v1/Services/ISxx/Conversations/CHxx/Messages



Service-Scoped Conversation Participant Properties
Property nameTypeRequiredDescriptionChild properties
accountSidSID<AC>
Optional
Not PII
The unique ID of the Account responsible for this participant.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

chatServiceSidSID<IS>
Optional
Not PII
The SID of the Conversation Service the Participant resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidSID<CH>
Optional
Not PII
The unique ID of the Conversation for this participant.
Pattern:^CH[0-9a-fA-F]{32}$Min length:34Max length:34

sidSID<MB>
Optional
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^MB[0-9a-fA-F]{32}$Min length:34Max length:34

identitystring
Optional
PII MTL: 30 days
A unique string identifier for the conversation participant as Conversation User. This parameter is non-null if (and only if) the participant is using the Conversation SDK to communicate. Limited to 256 characters.

attributesstring
Optional
PII MTL: 30 days
An optional string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set {} will be returned.

messagingBindingobject
Optional
PII MTL: 30 days
Information about how this participant exchanges messages with the conversation. A JSON parameter consisting of type and address fields of the participant.

roleSidSID<RL>
Optional
Not PII
The SID of a conversation-level Role to assign to the participant.
Pattern:^RL[0-9a-fA-F]{32}$Min length:34Max length:34

dateCreatedstring<date-time>
Optional
Not PII
The date on which this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date on which this resource was last updated.

urlstring<uri>
Optional
Not PII
An absolute API resource URL for this participant.

lastReadMessageIndexinteger
Optional
Not PII
Index of last “read” message in the Conversation for the Participant.

lastReadTimestampstring
Optional
Not PII
Timestamp of last “read” message in the Conversation for the Participant.

Create a Service-Scoped Participant resource
POST https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Conversations/{ConversationSid}/Participants
Creating a Participant joins them to the Conversation, and the connected person will receive all subsequent messages.
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Participant resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidstring
required
Not PII
The unique ID of the Conversation for this participant.
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
identitystring
Optional
PII MTL: 30 days
A unique string identifier for the conversation participant as Conversation User. This parameter is non-null if (and only if) the participant is using the Conversation SDK to communicate. Limited to 256 characters.

messagingBinding.addressstring
Optional
Not PII
The address of the participant's device, e.g. a phone or WhatsApp number. Together with the Proxy address, this determines a participant uniquely. This field (with proxy_address) is only null when the participant is interacting from an SDK endpoint (see the identity field).

messagingBinding.proxyAddressstring
Optional
Not PII
The address of the Twilio phone number (or WhatsApp number) that the participant is in contact with. This field, together with participant address, is only null when the participant is interacting from an SDK endpoint (see the identity field).

dateCreatedstring<date-time>
Optional
Not PII
The date on which this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date on which this resource was last updated.

attributesstring
Optional
PII MTL: 30 days
An optional string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set {} will be returned.

messagingBinding.projectedAddressstring
Optional
Not PII
The address of the Twilio phone number that is used in Group MMS.

roleSidSID<RL>
Optional
Not PII
The SID of a conversation-level Role to assign to the participant.
Pattern:^RL[0-9a-fA-F]{32}$Min length:34Max length:34
Create a Participant
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createServiceConversationParticipant() {


 const participant = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations("ConversationSid")


   .participants.create();





 console.log(participant.accountSid);


}





createServiceConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "identity": "null",


 "attributes": "{ \"role\": \"driver\" }",


 "messaging_binding": {


   "type": "sms",


   "address": "+15558675310",


   "proxy_address": "+15017122661"


 },


 "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}

Fetch a Service-Scoped Participant resource
GET https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Conversations/{ConversationSid}/Participants/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Participant resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidstring
required
Not PII
The unique ID of the Conversation for this participant.

sidstring
required
Not PII
A 34 character string that uniquely identifies this resource. Alternatively, you can pass a Participant's identity rather than the SID.
Fetch a Service-Scoped Participant resource by SID
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchServiceConversationParticipant() {


 const participant = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations("ConversationSid")


   .participants("Sid")


   .fetch();





 console.log(participant.accountSid);


}





fetchServiceConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "Sid",


 "identity": null,


 "attributes": "{ \"role\": \"driver\" }",


 "messaging_binding": {


   "type": "sms",


   "address": "+15558675310",


   "proxy_address": "+15017122661"


 },


 "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "date_created": "2016-03-24T21:05:50Z",


 "date_updated": "2016-03-24T21:05:50Z",


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}
You can also fetch a Service-Scoped Conversation Participant by their identity. Pass their identity as the value for the sid argument.
Fetch a Service-Scoped Participant resource by identity
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchServiceConversationParticipant() {


 const participant = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations("ConversationSid")


   .participants("alice")


   .fetch();





 console.log(participant.accountSid);


}





fetchServiceConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "alice",


 "identity": "alice",


 "attributes": "{ \"role\": \"driver\" }",


 "messaging_binding": {


   "type": "sms",


   "address": "+15558675310",


   "proxy_address": "+15017122661"


 },


 "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "date_created": "2016-03-24T21:05:50Z",


 "date_updated": "2016-03-24T21:05:50Z",


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}

Read multiple Service-Scoped Participant resources
GET https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Conversations/{ConversationSid}/Participants
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Participant resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidstring
required
Not PII
The unique ID of the Conversation for participants.
Query parameters
Property nameTypeRequiredPIIDescription
pageSizeinteger<int64>
Optional
Not PII
How many resources to return in each list page. The default is 50, and the maximum is 100.
Minimum:1Maximum:100

pageinteger
Optional
Not PII
The page index. This value is simply for client state.
Minimum:0

pageTokenstring
Optional
Not PII
The page token. This is provided by the API.
List multiple Participants
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function listServiceConversationParticipant() {


 const participants = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations("ConversationSid")


   .participants.list({ limit: 20 });





 participants.forEach((p) => console.log(p.accountSid));


}





listServiceConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "meta": {


   "page": 0,


   "page_size": 50,


   "first_page_url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants?PageSize=50&Page=0",


   "previous_page_url": null,


   "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants?PageSize=50&Page=0",


   "next_page_url": null,


   "key": "participants"


 },


 "participants": [


   {


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "identity": null,


     "attributes": "{ \"role\": \"driver\" }",


     "messaging_binding": {


       "type": "sms",


       "address": "+15558675310",


       "proxy_address": "+15017122661"


     },


     "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "date_created": "2016-03-24T21:05:50Z",


     "date_updated": "2016-03-24T21:05:50Z",


     "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "last_read_message_index": null,


     "last_read_timestamp": null


   },


   {


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "identity": "IDENTITY",


     "attributes": "{ \"role\": \"driver\" }",


     "messaging_binding": null,


     "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "date_created": "2016-03-24T21:05:50Z",


     "date_updated": "2016-03-24T21:05:50Z",


     "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "last_read_message_index": null,


     "last_read_timestamp": null


   }


 ]


}

Update a Service-Scoped Participant resource
POST https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Conversations/{ConversationSid}/Participants/{Sid}
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Participant resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidstring
required
Not PII
The unique ID of the Conversation for this participant.

sidstring
required
Not PII
A 34 character string that uniquely identifies this resource.
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
dateCreatedstring<date-time>
Optional
Not PII
The date on which this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date on which this resource was last updated.

identitystring
Optional
PII MTL: 30 days
A unique string identifier for the conversation participant as Conversation User. This parameter is non-null if (and only if) the participant is using the Conversation SDK to communicate. Limited to 256 characters.

attributesstring
Optional
PII MTL: 30 days
An optional string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set {} will be returned.

roleSidSID<RL>
Optional
Not PII
The SID of a conversation-level Role to assign to the participant.
Pattern:^RL[0-9a-fA-F]{32}$Min length:34Max length:34

messagingBinding.proxyAddressstring
Optional
Not PII
The address of the Twilio phone number that the participant is in contact with. 'null' value will remove it.

messagingBinding.projectedAddressstring
Optional
Not PII
The address of the Twilio phone number that is used in Group MMS. 'null' value will remove it.

lastReadMessageIndexinteger
Optional
Not PII
Index of last “read” message in the Conversation for the Participant.

lastReadTimestampstring
Optional
Not PII
Timestamp of last “read” message in the Conversation for the Participant.
Update a Participant
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateServiceConversationParticipant() {


 const participant = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations("ConversationSid")


   .participants("Sid")


   .update({ dateCreated: new Date("2009-07-06 20:30:00") });





 console.log(participant.accountSid);


}





updateServiceConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "Sid",


 "identity": null,


 "attributes": "{ \"role\": \"driver\" }",


 "messaging_binding": {


   "type": "sms",


   "address": "+15558675310",


   "proxy_address": "+15017122661"


 },


 "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "date_created": "2009-07-06T20:30:00Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}

Delete a Service-Scoped Conversation Participant resource
DELETE https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Conversations/{ConversationSid}/Participants/{Sid}
Deleting a participant removes them from the Conversation; they will receive no new messages after that point.
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Participant resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidstring
required
Not PII
The unique ID of the Conversation for this participant.

sidstring
required
Not PII
A 34 character string that uniquely identifies this resource.
Delete a Participant
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function deleteServiceConversationParticipant() {


 await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations("ConversationSid")


   .participants("Sid")


   .remove();


}





deleteServiceConversationParticipant();

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Service-Scoped Conversation Participant Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Service
Conversation
Participant
Conversation with Participants
Message
Delivery Receipt
Conversation-Scoped Webhook
Per-Service Webhook
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
API Base URL
ConversationWithParticipant Properties
Create a new conversation with the list of participants in your account's default service
Headers
Path parameters
Request body parameters
Service-Scoped Conversation with Participants Resource

The Service-scoped ConversationWithParticipants resource accepts all the details for a conversation and allows up to 10 participants in one request. This resource is especially helpful for situations where you want to send group texts. It helps prevent issues that might occur with existing conversations when you add participants individually.
Please see the Conversation with Participants Resource for Conversations within the default Conversation Service instance.

API Base URL
All URLs in the reference documentation use the following base URL:
Copy code block
https://conversations.twilio.com/v1
For Conversations applications that build on more than one Conversation Service instance, you will need to specify the Conversation Service SID in the REST API call:
Copy code block
POSt /v1/Services/ISxx/ConversationWithParticipants

ConversationWithParticipant Properties
Property nameTypeRequiredDescriptionChild properties
accountSidSID<AC>
Optional
Not PII
The unique ID of the Account responsible for this conversation.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

chatServiceSidSID<IS>
Optional
Not PII
The unique ID of the Conversation Service this conversation belongs to.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

messagingServiceSidSID<MG>
Optional
Not PII
The unique ID of the Messaging Service this conversation belongs to.
Pattern:^MG[0-9a-fA-F]{32}$Min length:34Max length:34

sidSID<CH>
Optional
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^CH[0-9a-fA-F]{32}$Min length:34Max length:34

friendlyNamestring
Optional
PII MTL: 30 days
The human-readable name of this conversation, limited to 256 characters. Optional.

uniqueNamestring
Optional
PII MTL: 30 days
An application-defined string that uniquely identifies the resource. It can be used to address the resource in place of the resource's sid in the URL.

attributesstring
Optional
PII MTL: 30 days
An optional string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set "{}" will be returned.

stateenum<string>
Optional
Not PII
Current state of this conversation. Can be either initializing, active, inactive or closed and defaults to active
Possible values:
inactiveactiveclosed

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated.

timersobject
Optional
Not PII
Timer date values representing state update for this conversation.

linksobject<uri-map>
Optional
Not PII
Contains absolute URLs to access the participants, messages and webhooks of this conversation.

bindingsobject
Optional
Not PII

urlstring<uri>
Optional
Not PII
An absolute API resource URL for this conversation.

Create a new conversation with the list of participants in your account's default service
POST https://conversations.twilio.com/v1/Services/{ChatServiceSid}/ConversationWithParticipants
This resource behaves differently than most other Conversations API resources. Here's how it works:
Parameter validation: It validates all conversation and participant parameters and returns various possible conversations errors.
Conversations are created synchronously: If the request is valid, a conversation will be created and returned in the response. This conversation will be in the state initializing while the participants are added. In this state, the conversation cannot be updated.
Participants are added to the conversation asynchronously: When all participants are added, the conversation state will be set to active and the conversation can be used. Listening to the onConversationStateUpdated webhook event and polling the conversations GET endpoint are both acceptable ways to check if the conversation is ready to be used.
System Errors: If any unexpected errors happen while adding the participants, the conversation state will be set to closed. Errors from this process will appear in the Console Error Logs, which can also be subscribed via webhooks.
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Conversation resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
friendlyNamestring
Optional
PII MTL: 30 days
The human-readable name of this conversation, limited to 256 characters. Optional.

uniqueNamestring
Optional
PII MTL: 30 days
An application-defined string that uniquely identifies the resource. It can be used to address the resource in place of the resource's sid in the URL.

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated.

messagingServiceSidSID<MG>
Optional
Not PII
The unique ID of the Messaging Service this conversation belongs to.
Pattern:^MG[0-9a-fA-F]{32}$Min length:34Max length:34

attributesstring
Optional
PII MTL: 30 days
An optional string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set "{}" will be returned.

stateenum<string>
Optional
Not PII
Current state of this conversation. Can be either initializing, active, inactive or closed and defaults to active
Possible values:
inactiveactiveclosed

timers.inactivestring
Optional
Not PII
ISO8601 duration when conversation will be switched to inactive state. Minimum value for this timer is 1 minute.

timers.closedstring
Optional
Not PII
ISO8601 duration when conversation will be switched to closed state. Minimum value for this timer is 10 minutes.

bindings.email.addressstring
Optional
Not PII
The default email address that will be used when sending outbound emails in this conversation.

bindings.email.namestring
Optional
Not PII
The default name that will be used when sending outbound emails in this conversation.

participantarray[string]
Optional
Not PII
The participant to be added to the conversation in JSON format. The JSON object attributes are as parameters in Participant Resource. The maximum number of participants that can be added in a single request is 10.
Create Conversation with Participants
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createServiceConversationWithParticipants() {


 const conversationWithParticipant = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversationWithParticipants.create({


     friendlyName: "Friendly Conversation",


     participant: [


       '{"messaging_binding": {"address": "<External Participant Number>", "proxy_address": "<Your Twilio Number>"}}',


       '{"identity": "<Chat User Identity>"}',


     ],


   });





 console.log(conversationWithParticipant.sid);


}





createServiceConversationWithParticipants();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "Friendly Conversation",


 "unique_name": "unique_name",


 "attributes": "{ \"topic\": \"feedback\" }",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "state": "inactive",


 "timers": {


   "date_inactive": "2015-12-16T22:19:38Z",


   "date_closed": "2015-12-16T22:28:38Z"


 },


 "bindings": {},


 "links": {


   "participants": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",


   "messages": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",


   "webhooks": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks"


 },


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}
Create GMMS Conversation with Participants
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createServiceConversationWithParticipants() {


 const conversationWithParticipant = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversationWithParticipants.create({


     friendlyName: "Friendly Conversation",


     participant: [


       '{"messaging_binding": {"address": "<External Participant Number>"}}',


       '{"messaging_binding": {"address": "<External Participant Number>"}}',


       '{"messaging_binding": {"projected_address": "<Your Twilio Number>"}}',


     ],


   });





 console.log(conversationWithParticipant.sid);


}





createServiceConversationWithParticipants();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "Friendly Conversation",


 "unique_name": "unique_name",


 "attributes": "{ \"topic\": \"feedback\" }",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "state": "inactive",


 "timers": {


   "date_inactive": "2015-12-16T22:19:38Z",


   "date_closed": "2015-12-16T22:28:38Z"


 },


 "bindings": {},


 "links": {


   "participants": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",


   "messages": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",


   "webhooks": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks"


 },


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Service-Scoped Conversation with Participants Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Service
Conversation
Participant
Conversation with Participants
Message
Delivery Receipt
Conversation-Scoped Webhook
Per-Service Webhook
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
API Base URL
Service-Scoped Conversation Message Properties
Create a Service-Scoped Conversation Message resource
Headers
Path parameters
Request body parameters
Fetch a Service-Scoped Conversation Message resource
Path parameters
Read all Service-Scoped Conversation Message resources
Path parameters
Query parameters
Update a Service-Scoped Conversation Message resource
Headers
Path parameters
Request body parameters
Delete a Service-Scoped Conversation Message resource
Headers
Path parameters
Service-Scoped Conversation Message Resource

Use the Service-scoped Conversation Message resource to interact with messages in Conversations that belong to a non-default, service-scoped Conversation resource.
Please see the Conversation Message Resource API Reference page for Messages that belong to Conversations in the default Conversation Service.

API Base URL
All URLs in the reference documentation use the following base URL:
Copy code block
https://conversations.twilio.com/v1


For Conversations applications that build on more than one Conversation Service instance, you will need to specify the Conversation Service SID in the REST API call:
Copy code block
GET /v1/Services/ISxx/Conversations/CHxx/Messages



Service-Scoped Conversation Message Properties
Property nameTypeRequiredDescriptionChild properties
accountSidSID<AC>
Optional
Not PII
The unique ID of the Account responsible for this message.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

chatServiceSidSID<IS>
Optional
Not PII
The SID of the Conversation Service the Participant resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidSID<CH>
Optional
Not PII
The unique ID of the Conversation for this message.
Pattern:^CH[0-9a-fA-F]{32}$Min length:34Max length:34

sidSID<IM>
Optional
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^IM[0-9a-fA-F]{32}$Min length:34Max length:34

indexinteger
Optional
Not PII
The index of the message within the Conversation.
Default:0

authorstring
Optional
PII MTL: 30 days
The channel specific identifier of the message's author. Defaults to system.

bodystring
Optional
PII MTL: 30 days
The content of the message, can be up to 1,600 characters long.

mediaarray[object]
Optional
PII MTL: 30 days
An array of objects that describe the Message's media, if the message contains media. Each object contains these fields: content_type with the MIME type of the media, filename with the name of the media, sid with the SID of the Media resource, and size with the media object's file size in bytes. If the Message has no media, this value is null.

attributesstring
Optional
PII MTL: 30 days
A string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set "{}" will be returned.

participantSidSID<MB>
Optional
Not PII
The unique ID of messages's author participant. Null in case of system sent message.
Pattern:^MB[0-9a-fA-F]{32}$Min length:34Max length:34

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated. null if the message has not been edited.

deliveryobject
Optional
Not PII
An object that contains the summary of delivery statuses for the message to non-chat participants.

urlstring<uri>
Optional
Not PII
An absolute API resource URL for this message.

linksobject<uri-map>
Optional
Not PII
Contains an absolute API resource URL to access the delivery & read receipts of this message.

contentSidSID<HX>
Optional
Not PII
The unique ID of the multi-channel Rich Content template.
Pattern:^HX[0-9a-fA-F]{32}$Min length:34Max length:34

Create a Service-Scoped Conversation Message resource
POST https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Conversations/{ConversationSid}/Messages
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Participant resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidstring
required
Not PII
The unique ID of the Conversation for this message.
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
authorstring
Optional
PII MTL: 30 days
The channel specific identifier of the message's author. Defaults to system.

bodystring
Optional
PII MTL: 30 days
The content of the message, can be up to 1,600 characters long.

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated. null if the message has not been edited.

attributesstring
Optional
PII MTL: 30 days
A string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set "{}" will be returned.

mediaSidSID<ME>
Optional
Not PII
The Media SID to be attached to the new Message.
Pattern:^ME[0-9a-fA-F]{32}$Min length:34Max length:34

contentSidSID<HX>
Optional
Not PII
The unique ID of the multi-channel Rich Content template, required for template-generated messages. Note that if this field is set, Body and MediaSid parameters are ignored.
Pattern:^HX[0-9a-fA-F]{32}$Min length:34Max length:34

contentVariablesstring
Optional
Not PII
A structurally valid JSON string that contains values to resolve Rich Content template variables.

subjectstring
Optional
Not PII
The subject of the message, can be up to 256 characters long.
Create a Message
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createServiceConversationMessage() {


 const message = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations("ConversationSid")


   .messages.create();





 console.log(message.accountSid);


}





createServiceConversationMessage();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "body": "Hello",


 "media": null,


 "author": "message author",


 "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "attributes": "{ \"importance\": \"high\" }",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "index": 0,


 "delivery": {


   "total": 2,


   "sent": "all",


   "delivered": "some",


   "read": "some",


   "failed": "none",


   "undelivered": "none"


 },


 "content_sid": null,


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "delivery_receipts": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",


   "channel_metadata": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"


 }


}

Fetch a Service-Scoped Conversation Message resource
GET https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Conversations/{ConversationSid}/Messages/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Participant resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidstring
required
Not PII
The unique ID of the Conversation for this message.

sidSID<IM>
required
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^IM[0-9a-fA-F]{32}$Min length:34Max length:34
Fetch a Message
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchServiceConversationMessage() {


 const message = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations("ConversationSid")


   .messages("IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .fetch();





 console.log(message.accountSid);


}





fetchServiceConversationMessage();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "body": "Welcome!",


 "media": null,


 "author": "system",


 "participant_sid": null,


 "attributes": "{ \"importance\": \"high\" }",


 "date_created": "2016-03-24T20:37:57Z",


 "date_updated": "2016-03-24T20:37:57Z",


 "index": 0,


 "delivery": {


   "total": 2,


   "sent": "all",


   "delivered": "some",


   "read": "some",


   "failed": "none",


   "undelivered": "none"


 },


 "content_sid": null,


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "delivery_receipts": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",


   "channel_metadata": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"


 }


}

Read all Service-Scoped Conversation Message resources
GET https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Conversations/{ConversationSid}/Messages
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Participant resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidstring
required
Not PII
The unique ID of the Conversation for messages.
Query parameters
Property nameTypeRequiredPIIDescription
orderenum<string>
Optional
Not PII
The sort order of the returned messages. Can be: asc (ascending) or desc (descending), with asc as the default.
Possible values:
ascdesc

pageSizeinteger<int64>
Optional
Not PII
How many resources to return in each list page. The default is 50, and the maximum is 100.
Minimum:1Maximum:100

pageinteger
Optional
Not PII
The page index. This value is simply for client state.
Minimum:0

pageTokenstring
Optional
Not PII
The page token. This is provided by the API.
List multiple Messages
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function listServiceConversationMessage() {


 const messages = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations("ConversationSid")


   .messages.list({ limit: 20 });





 messages.forEach((m) => console.log(m.accountSid));


}





listServiceConversationMessage();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "meta": {


   "page": 0,


   "page_size": 50,


   "first_page_url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages?PageSize=50&Page=0",


   "previous_page_url": null,


   "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages?PageSize=50&Page=0",


   "next_page_url": null,


   "key": "messages"


 },


 "messages": [


   {


     "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "body": "I like pie.",


     "media": null,


     "author": "pie_preferrer",


     "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "attributes": "{ \"importance\": \"high\" }",


     "date_created": "2016-03-24T20:37:57Z",


     "date_updated": "2016-03-24T20:37:57Z",


     "index": 0,


     "delivery": {


       "total": 2,


       "sent": "all",


       "delivered": "some",


       "read": "some",


       "failed": "none",


       "undelivered": "none"


     },


     "content_sid": null,


     "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "links": {


       "delivery_receipts": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",


       "channel_metadata": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"


     }


   },


   {


     "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "body": "Cake is my favorite!",


     "media": null,


     "author": "cake_lover",


     "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "attributes": "{ \"importance\": \"high\" }",


     "date_created": "2016-03-24T20:38:21Z",


     "date_updated": "2016-03-24T20:38:21Z",


     "index": 0,


     "delivery": {


       "total": 2,


       "sent": "all",


       "delivered": "some",


       "read": "some",


       "failed": "none",


       "undelivered": "none"


     },


     "content_sid": null,


     "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "links": {


       "delivery_receipts": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",


       "channel_metadata": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"


     }


   },


   {


     "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "body": null,


     "media": [


       {


         "sid": "MEaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


         "size": 42056,


         "content_type": "image/jpeg",


         "filename": "car.jpg"


       }


     ],


     "author": "cake_lover",


     "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "attributes": "{ \"importance\": \"high\" }",


     "date_created": "2016-03-24T20:38:21Z",


     "date_updated": "2016-03-24T20:38:21Z",


     "index": 0,


     "delivery": {


       "total": 2,


       "sent": "all",


       "delivered": "some",


       "read": "some",


       "failed": "none",


       "undelivered": "none"


     },


     "content_sid": null,


     "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "links": {


       "delivery_receipts": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",


       "channel_metadata": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"


     }


   }


 ]


}

Update a Service-Scoped Conversation Message resource
POST https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Conversations/{ConversationSid}/Messages/{Sid}
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Participant resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidstring
required
Not PII
The unique ID of the Conversation for this message.

sidSID<IM>
required
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^IM[0-9a-fA-F]{32}$Min length:34Max length:34
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
authorstring
Optional
PII MTL: 30 days
The channel specific identifier of the message's author. Defaults to system.

bodystring
Optional
PII MTL: 30 days
The content of the message, can be up to 1,600 characters long.

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated. null if the message has not been edited.

attributesstring
Optional
PII MTL: 30 days
A string metadata field you can use to store any data you wish. The string value must contain structurally valid JSON if specified. Note that if the attributes are not set "{}" will be returned.

subjectstring
Optional
Not PII
The subject of the message, can be up to 256 characters long.
Update a Message
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateServiceConversationMessage() {


 const message = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations("ConversationSid")


   .messages("IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .update({ author: "Author" });





 console.log(message.accountSid);


}





updateServiceConversationMessage();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "body": "Hello",


 "media": null,


 "author": "Author",


 "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "attributes": "{ \"importance\": \"high\" }",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "index": 0,


 "delivery": {


   "total": 2,


   "sent": "all",


   "delivered": "some",


   "read": "some",


   "failed": "none",


   "undelivered": "none"


 },


 "content_sid": null,


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "delivery_receipts": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",


   "channel_metadata": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"


 }


}

Delete a Service-Scoped Conversation Message resource
DELETE https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Conversations/{ConversationSid}/Messages/{Sid}
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Participant resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidstring
required
Not PII
The unique ID of the Conversation for this message.

sidSID<IM>
required
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^IM[0-9a-fA-F]{32}$Min length:34Max length:34
Delete a Message
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function deleteServiceConversationMessage() {


 await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations("ConversationSid")


   .messages("IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .remove();


}





deleteServiceConversationMessage();

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Service-Scoped Conversation Message Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Service
Conversation
Participant
Conversation with Participants
Message
Delivery Receipt
Conversation-Scoped Webhook
Per-Service Webhook
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
API Base URL
Receipt Properties
Service-Scoped Delivery Receipt Resource

Service-Scoped Delivery Receipts in Conversations provide visibility into the status of Service-Scoped Conversation Messages sent across different Conversations within a non-default Conversation Service.
Using Service-Scoped Delivery Receipts, you can verify that Messages have been sent, delivered, or even read (for OTT) by Conversations Participants within a non-default, service-scoped Conversation Service.

API Base URL
All URLs in the reference documentation use the following base URL:
Copy code block
https://conversations.twilio.com/v1


For Conversations applications that build on more than one Conversation Service instance, you will need to specify the Conversation Service SID in the REST API call:
Copy code block
GET /v1/Services/ISxx/Conversations/CHxx/Messages



Receipt Properties
Property nameTypeRequiredDescriptionChild properties
accountSidSID<AC>
Optional
Not PII
The unique ID of the Account responsible for this participant.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

chatServiceSidSID<IS>
Optional
Not PII
The SID of the Conversation Service the Message resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidSID<CH>
Optional
Not PII
The unique ID of the Conversation for this message.
Pattern:^CH[0-9a-fA-F]{32}$Min length:34Max length:34

messageSidSID<IM>
Optional
Not PII
The SID of the message within a Conversation the delivery receipt belongs to
Pattern:^IM[0-9a-fA-F]{32}$Min length:34Max length:34

sidSID<DY>
Optional
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^DY[0-9a-fA-F]{32}$Min length:34Max length:34

channelMessageSidSID
Optional
Not PII
A messaging channel-specific identifier for the message delivered to participant e.g. SMxx for SMS, WAxx for Whatsapp etc.
Pattern:^[a-zA-Z]{2}[0-9a-fA-F]{32}$Min length:34Max length:34

participantSidSID<MB>
Optional
Not PII
The unique ID of the participant the delivery receipt belongs to.
Pattern:^MB[0-9a-fA-F]{32}$Min length:34Max length:34

statusenum<string>
Optional
Not PII
The message delivery status, can be read, failed, delivered, undelivered, sent or null.
Possible values:
readfaileddeliveredundeliveredsent

errorCodeinteger
Optional
Not PII
The message delivery error code for a failed status,
Default:0

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated. null if the delivery receipt has not been updated.

urlstring<uri>
Optional
Not PII
An absolute API resource URL for this delivery receipt.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Service-Scoped Delivery Receipt Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Service
Conversation
Participant
Conversation with Participants
Message
Delivery Receipt
Conversation-Scoped Webhook
Per-Service Webhook
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
API Base URL
Service-Scoped Conversation-Scoped Webhook Properties
Create a Service-Scoped Conversation-Scoped Webhook resource
Path parameters
Request body parameters
Fetch a Service-Scoped Conversation-Scoped Webhook resource
Path parameters
Read multiple Service-Scoped Conversation-Scoped Webhook resources
Path parameters
Query parameters
Update a Service-Scoped Conversation-Scoped Webhook resources
Path parameters
Request body parameters
Delete a Service-Scoped, Conversation-Scoped Webhook resource
Path parameters
Service-Scoped Conversation-Scoped Webhook Resource

Service-Scoped Conversation-Scoped Webhooks provide a way to attach a unique monitor, bot, or other integration to each service-scoped Conversation within a non-default Conversation Service.
Each individual service-scoped Conversation can have as many as five such webhooks, as needed for your use case.
Please see the API Reference for the Conversation-Scoped Webhook resource for creating and managing Conversation-Scoped Webhooks within the default Conversation Service.

API Base URL
All URLs in the reference documentation use the following base URL:
Copy code block
https://conversations.twilio.com/v1


For Conversations applications that build on more than one Conversation Service instance, you will need to specify the Conversation Service SID in the REST API call:
Copy code block
GET /v1/Services/ISxx/Conversations/CHxx/Messages



Service-Scoped Conversation-Scoped Webhook Properties
Property nameTypeRequiredDescriptionChild properties
sidSID<WH>
Optional
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^WH[0-9a-fA-F]{32}$Min length:34Max length:34

accountSidSID<AC>
Optional
Not PII
The unique ID of the Account responsible for this conversation.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

chatServiceSidSID<IS>
Optional
Not PII
The SID of the Conversation Service the Participant resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidSID<CH>
Optional
Not PII
The unique ID of the Conversation for this webhook.
Pattern:^CH[0-9a-fA-F]{32}$Min length:34Max length:34

targetstring
Optional
Not PII
The target of this webhook: webhook, studio, trigger

urlstring<uri>
Optional
Not PII
An absolute API resource URL for this webhook.

configurationobject
Optional
Not PII
The configuration of this webhook. Is defined based on target.

dateCreatedstring<date-time>
Optional
Not PII
The date that this resource was created.

dateUpdatedstring<date-time>
Optional
Not PII
The date that this resource was last updated.

Create a Service-Scoped Conversation-Scoped Webhook resource
POST https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Conversations/{ConversationSid}/Webhooks
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Participant resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidstring
required
Not PII
The unique ID of the Conversation for this webhook.
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
targetenum<string>
required
Not PII
The target of this webhook: webhook, studio, trigger
Possible values:
webhooktriggerstudio

configuration.urlstring
Optional
Not PII
The absolute url the webhook request should be sent to.

configuration.methodenum<string>
Optional
Not PII
Possible values:
GETPOST

configuration.filtersarray[string]
Optional
Not PII
The list of events, firing webhook event for this Conversation.

configuration.triggersarray[string]
Optional
Not PII
The list of keywords, firing webhook event for this Conversation.

configuration.flowSidSID<FW>
Optional
Not PII
The studio flow SID, where the webhook should be sent to.
Pattern:^FW[0-9a-fA-F]{32}$Min length:34Max length:34

configuration.replayAfterinteger
Optional
Not PII
The message index for which and it's successors the webhook will be replayed. Not set by default
Create a Webhook
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createServiceConversationScopedWebhook() {


 const webhook = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations("ConversationSid")


   .webhooks.create({ target: "webhook" });





 console.log(webhook.sid);


}





createServiceConversationScopedWebhook();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "target": "webhook",


 "configuration": {


   "url": "https://example.com",


   "method": "get",


   "filters": [


     "onMessageSent",


     "onConversationDestroyed"


   ]


 },


 "date_created": "2016-03-24T21:05:50Z",


 "date_updated": "2016-03-24T21:05:50Z",


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks/WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Fetch a Service-Scoped Conversation-Scoped Webhook resource
GET https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Conversations/{ConversationSid}/Webhooks/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Participant resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidstring
required
Not PII
The unique ID of the Conversation for this webhook.

sidSID<WH>
required
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^WH[0-9a-fA-F]{32}$Min length:34Max length:34
Fetch a Webhook
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchServiceConversationScopedWebhook() {


 const webhook = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations("ConversationSid")


   .webhooks("WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .fetch();





 console.log(webhook.sid);


}





fetchServiceConversationScopedWebhook();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "target": "studio",


 "configuration": {


   "flow_sid": "FWaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


 },


 "date_created": "2016-03-24T21:05:50Z",


 "date_updated": "2016-03-24T21:05:50Z",


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks/WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Read multiple Service-Scoped Conversation-Scoped Webhook resources
GET https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Conversations/{ConversationSid}/Webhooks
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Participant resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidstring
required
Not PII
The unique ID of the Conversation for this webhook.
Query parameters
Property nameTypeRequiredPIIDescription
pageSizeinteger<int64>
Optional
Not PII
How many resources to return in each list page. The default is 5, and the maximum is 5.
Minimum:1Maximum:5

pageinteger
Optional
Not PII
The page index. This value is simply for client state.
Minimum:0

pageTokenstring
Optional
Not PII
The page token. This is provided by the API.
List multiple Webhooks
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function listServiceConversationScopedWebhook() {


 const webhooks = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations("ConversationSid")


   .webhooks.list({ limit: 20 });





 webhooks.forEach((w) => console.log(w.sid));


}





listServiceConversationScopedWebhook();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "meta": {


   "page": 0,


   "page_size": 5,


   "first_page_url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks?PageSize=5&Page=0",


   "previous_page_url": null,


   "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks?PageSize=5&Page=0",


   "next_page_url": null,


   "key": "webhooks"


 },


 "webhooks": [


   {


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "sid": "WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "target": "webhook",


     "configuration": {


       "url": "https://example.com",


       "method": "get",


       "filters": [


         "onMessageSent",


         "onConversationDestroyed"


       ]


     },


     "date_created": "2016-03-24T21:05:50Z",


     "date_updated": "2016-03-24T21:05:50Z",


     "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks/WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


   },


   {


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "sid": "WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "target": "trigger",


     "configuration": {


       "url": "https://example.com",


       "method": "post",


       "filters": [


         "keyword1",


         "keyword2"


       ]


     },


     "date_created": "2016-03-24T21:05:50Z",


     "date_updated": "2016-03-24T21:05:50Z",


     "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks/WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


   },


   {


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "sid": "WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "target": "studio",


     "configuration": {


       "flow_sid": "FWaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


     },


     "date_created": "2016-03-24T21:05:50Z",


     "date_updated": "2016-03-24T21:05:50Z",


     "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks/WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


   }


 ]


}

Update a Service-Scoped Conversation-Scoped Webhook resources
POST https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Conversations/{ConversationSid}/Webhooks/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Participant resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidstring
required
Not PII
The unique ID of the Conversation for this webhook.

sidSID<WH>
required
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^WH[0-9a-fA-F]{32}$Min length:34Max length:34
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
configuration.urlstring
Optional
Not PII
The absolute url the webhook request should be sent to.

configuration.methodenum<string>
Optional
Not PII
Possible values:
GETPOST

configuration.filtersarray[string]
Optional
Not PII
The list of events, firing webhook event for this Conversation.

configuration.triggersarray[string]
Optional
Not PII
The list of keywords, firing webhook event for this Conversation.

configuration.flowSidSID<FW>
Optional
Not PII
The studio flow SID, where the webhook should be sent to.
Pattern:^FW[0-9a-fA-F]{32}$Min length:34Max length:34
Update a Webhook
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateServiceConversationScopedWebhook() {


 const webhook = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations("ConversationSid")


   .webhooks("WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .update({ "configuration.url": "Configuration.Url" });





 console.log(webhook.sid);


}





updateServiceConversationScopedWebhook();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "target": "trigger",


 "configuration": {


   "url": "https://example.com",


   "method": "post",


   "filters": [


     "keyword1",


     "keyword2"


   ]


 },


 "date_created": "2016-03-24T21:05:50Z",


 "date_updated": "2016-03-24T21:05:51Z",


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks/WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Delete a Service-Scoped, Conversation-Scoped Webhook resource
DELETE https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Conversations/{ConversationSid}/Webhooks/{Sid}
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The SID of the Conversation Service the Participant resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

conversationSidstring
required
Not PII
The unique ID of the Conversation for this webhook.

sidSID<WH>
required
Not PII
A 34 character string that uniquely identifies this resource.
Pattern:^WH[0-9a-fA-F]{32}$Min length:34Max length:34
Delete a Webhook
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function deleteServiceConversationScopedWebhook() {


 await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .conversations("ConversationSid")


   .webhooks("WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .remove();


}





deleteServiceConversationScopedWebhook();

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Service-Scoped Conversation-Scoped Webhook Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Service
Conversation
Participant
Conversation with Participants
Message
Delivery Receipt
Conversation-Scoped Webhook
Per-Service Webhook
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Webhook Properties
Fetch a ServiceWebhookConfiguration resource
Path parameters
Update a ServiceWebhookConfiguration resource
Path parameters
Request body parameters
Per-Service Webhook Resource

The Per-Service Webhook resource allows you to control the effects of webhooks in a particular Conversation Service. The webhooks will only fire for activity at the service-level.
Services allow you to:
Create multiple, distinct environments (such as dev, stage, and prod) under a single Twilio account
Scope access to resources through both the REST and client APIs
Configure different service instances with specific behaviors
Every service can have unique webhook targets. This means you can include different metadata in the URLs or even trigger different behavior for different services.
Webhook targets for the Service Instance (the URL that Twilio will invoke) are configured in the Twilio Console.
If configured, service-scoped webhooks will override your global webhook settings such that only the service-scoped hooks will fire. This applies only to the services where service-level hooks are configured. See Conversations Webhooksfor more information.

Webhook Properties
Property nameTypeRequiredDescriptionChild properties
accountSidSID<AC>
Optional
Not PII
The unique ID of the Account responsible for this service.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

chatServiceSidSID<IS>
Optional
Not PII
The unique ID of the Conversation Service this conversation belongs to.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

preWebhookUrlstring<uri>
Optional
Not PII
The absolute url the pre-event webhook request should be sent to.

postWebhookUrlstring<uri>
Optional
Not PII
The absolute url the post-event webhook request should be sent to.

filtersarray[string]
Optional
Not PII
The list of events that your configured webhook targets will receive. Events not configured here will not fire. Possible values are onParticipantAdd, onParticipantAdded, onDeliveryUpdated, onConversationUpdated, onConversationRemove, onParticipantRemove, onConversationUpdate, onMessageAdd, onMessageRemoved, onParticipantUpdated, onConversationAdded, onMessageAdded, onConversationAdd, onConversationRemoved, onParticipantUpdate, onMessageRemove, onMessageUpdated, onParticipantRemoved, onMessageUpdate or onConversationStateUpdated.

methodenum<string>
Optional
Not PII
The HTTP method to be used when sending a webhook request. One of GET or POST.
Possible values:
GETPOST

urlstring<uri>
Optional
Not PII
An absolute API resource URL for this webhook.

Fetch a ServiceWebhookConfiguration resource
GET https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Configuration/Webhooks
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The unique ID of the Conversation Service this conversation belongs to.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34
Fetch a Service Webhook
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchServiceWebhookConfiguration() {


 const webhook = await client.conversations.v1


   .services("ISXXXXXXXXXXXXXXXXXXXXXX")


   .configuration.webhooks()


   .fetch();





 console.log(webhook.accountSid);


}





fetchServiceWebhookConfiguration();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISXXXXXXXXXXXXXXXXXXXXXX",


 "pre_webhook_url": "https://www.example.com/pre",


 "post_webhook_url": "https://www.example.com/post",


 "filters": [


   "onMessageRemove",


   "onParticipantAdd"


 ],


 "method": "POST",


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Configuration/Webhooks"


}

Update a ServiceWebhookConfiguration resource
POST https://conversations.twilio.com/v1/Services/{ChatServiceSid}/Configuration/Webhooks
Path parameters
Property nameTypeRequiredPIIDescription
chatServiceSidSID<IS>
required
Not PII
The unique ID of the Conversation Service this conversation belongs to.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
preWebhookUrlstring<uri>
Optional
Not PII
The absolute url the pre-event webhook request should be sent to.

postWebhookUrlstring<uri>
Optional
Not PII
The absolute url the post-event webhook request should be sent to.

filtersarray[string]
Optional
Not PII
The list of events that your configured webhook targets will receive. Events not configured here will not fire. Possible values are onParticipantAdd, onParticipantAdded, onDeliveryUpdated, onConversationUpdated, onConversationRemove, onParticipantRemove, onConversationUpdate, onMessageAdd, onMessageRemoved, onParticipantUpdated, onConversationAdded, onMessageAdded, onConversationAdd, onConversationRemoved, onParticipantUpdate, onMessageRemove, onMessageUpdated, onParticipantRemoved, onMessageUpdate or onConversationStateUpdated.

methodstring
Optional
Not PII
The HTTP method to be used when sending a webhook request. One of GET or POST.
Update a Service Webhook
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateServiceWebhookConfiguration() {


 const webhook = await client.conversations.v1


   .services("ISXXXXXXXXXXXXXXXXXXXXXX")


   .configuration.webhooks()


   .update({


     filters: ["onConversationUpdated", "onMessageRemoved"],


     method: "POST",


     postWebhookUrl: "https://example.com/archive-every-action",


     preWebhookUrl: "https://example.com/filtering-and-permissions",


   });





 console.log(webhook.accountSid);


}





updateServiceWebhookConfiguration();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISXXXXXXXXXXXXXXXXXXXXXX",


 "pre_webhook_url": "https://example.com/filtering-and-permissions",


 "post_webhook_url": "https://example.com/archive-every-action",


 "filters": [


   "onMessageRemoved",


   "onParticipantAdded"


 ],


 "method": "POST",


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Configuration/Webhooks"


}

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Per-Service Webhook Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Overview
Conversation
Message
Media
Participant
Conversation with Participants
User
Role
Configuration
Address Configuration
Webhook Configuration
Conversation-Scoped Webhook
Delivery Receipt
User Conversation
Participant Conversation
Push Notifications
Service Configuration
Multiservice
Chat Channel Migration
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
API Base URL
Channel Properties
Update Channel Type
Headers
Path parameters
Request body parameters
Chat Channel Migration Resource

A Channel is a Programmable Chat object that is equivalent to a Conversation in the Conversations API.
Please see the Conversation Resource for Conversations that are already available to your Conversations application.
Only 'private' type Channels are automatically migrated to Conversations. For 'public' type Channels, please use this API to migrate them to 'private' type.

API Base URL
Copy code block
https://chat.twilio.com/v3


There is only one API endpoint on the v3 Chat API:
Copy code block
POST /Services/ISxx/Channels/CHxx



Channel Properties
Property nameTypeRequiredDescriptionChild properties
sidSID<CH>
Optional
Not PII
The unique string that we created to identify the Channel resource.
Pattern:^CH[0-9a-fA-F]{32}$Min length:34Max length:34

accountSidSID<AC>
Optional
Not PII
The SID of the Account that created the Channel resource.
Pattern:^AC[0-9a-fA-F]{32}$Min length:34Max length:34

serviceSidSID<IS>
Optional
Not PII
The SID of the Service the Channel resource is associated with.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

friendlyNamestring
Optional
PII MTL: 30 days
The string that you assigned to describe the resource.

uniqueNamestring
Optional
PII MTL: 30 days
An application-defined string that uniquely identifies the resource. It can be used to address the resource in place of the resource's sid in the URL.

attributesstring
Optional
PII MTL: 30 days
The JSON string that stores application-specific data. If attributes have not been set, {} is returned.

typeenum<string>
Optional
Not PII
The visibility of the channel. Can be: public or private.
Possible values:
publicprivate

dateCreatedstring<date-time>
Optional
Not PII
The date and time in GMT when the resource was created specified in ISO 8601
 format.

dateUpdatedstring<date-time>
Optional
Not PII
The date and time in GMT when the resource was last updated specified in ISO 8601
 format.

createdBystring
Optional
PII MTL: 30 days
The identity of the User that created the channel. If the Channel was created by using the API, the value is system.

membersCountinteger
Optional
Not PII
The number of Members in the Channel.
Default:0

messagesCountinteger
Optional
Not PII
The number of Messages that have been passed in the Channel.
Default:0

messagingServiceSidSID<MG>
Optional
Not PII
The unique ID of the Messaging Service this channel belongs to.
Pattern:^MG[0-9a-fA-F]{32}$Min length:34Max length:34

urlstring<uri>
Optional
Not PII
The absolute URL of the Channel resource.

Update Channel Type
POST https://chat.twilio.com/v3/Services/{ServiceSid}/Channels/{Sid}
Use this API to change a Channel's type from public to private. This makes it available in Conversations.
(information)
Info
Read here to determine if you need to include a Messaging Service SID in your request.
Headers
Property nameTypeRequiredPIIDescription
x-Twilio-Webhook-Enabledenum<string>
Optional
Not PII
The X-Twilio-Webhook-Enabled HTTP request header
Possible values:
truefalse
Path parameters
Property nameTypeRequiredPIIDescription
serviceSidSID<IS>
required
Not PII
The unique SID identifier of the Service.
Pattern:^IS[0-9a-fA-F]{32}$Min length:34Max length:34

sidstring
required
Not PII
A 34 character string that uniquely identifies this Channel.
Request body parameters
Encoding type:application/x-www-form-urlencoded
SchemaExample
Property nameTypeRequiredDescriptionChild properties
typeenum<string>
Optional
Not PII
The visibility of the channel. Can be: public or private.
Possible values:
publicprivate

messagingServiceSidSID<MG>
Optional
Not PII
The unique ID of the Messaging Service this channel belongs to.
Pattern:^MG[0-9a-fA-F]{32}$Min length:34Max length:34
Migrate public Channel to Conversations
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateChannel() {


 const channel = await client.chat.v3


   .channels("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "Sid")


   .update({


     messagingServiceSid: "MGXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


     type: "private",


   });





 console.log(channel.sid);


}





updateChannel();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "Sid",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "messaging_service_sid": "MGXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "friendly_name": "friendly_name",


 "unique_name": "unique_name",


 "attributes": "{ \"foo\": \"bar\" }",


 "type": "private",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "created_by": "username",


 "members_count": 0,


 "messages_count": 0,


 "url": "https://chat.twilio.com/v3/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Channels/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Chat Channel Migration Resource | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations Fundamentals
Conversations Limits
Media Support in Conversations
Conversations Webhooks
Using WhatsApp with Conversations
Using States and Timers in Conversations
Delivery Receipts in Conversations
Group Texting in Conversations
Inbound Message Handling & Autocreation
Push Notification Configuration for Conversations
Push Notifications on Android for Conversations
Push Notifications on iOS for Conversations
Push Notifications on Web
A2P 10DLC Registration in Conversations
Reachability Indicator
Send Rich Content Messages with Conversations
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Data types
Conversation Services and Messaging Services in Conversations
Conversations
Messages
Conversation Participants
The Conversations REST API
The Conversations SDKs
First-person client SDKs
SDK connectivity
Access Tokens
Asynchronous interactions
Where next?
Conversations Fundamentals

Twilio Conversations is a cloud-based messaging product that natively supports conversations via SMS, MMS, and WhatsApp as well as chat. It provides a number of client SDKs and a REST API for integrating multichannel capabilities into your applications and websites.

Data types
In Twilio Conversations, there are several core data types or objects that you will interact with.
Conversation Services and Messaging Services in Conversations
Resource Object
SID Format
Conversation Service Instance
ISXXX...
Messaging Service Instance
MGXXX...

Conversations is a multichannel messaging API, so you can connect people ("Participants") over various channels, all in one interaction ("Conversation"). Underneath each Conversation are both Conversation Service Instances and Messaging Services, which provide the ability for chat and non-chat Participants to join.
If you want to have both chat and non-chat (e.g., SMS or WhatsApp) channels in the same Conversation, you need to configure two different types of services.
First, you need a Conversation Service in order to create a chat-to-chat Conversation. This Conversation Service instance is where all the Conversations, Messages, Participants, and other resources within a Conversation instance live. While you can have many Services in a Twilio Account, Conversation Service instances are entirely isolated from one another and do not overlap or interact in any way.
If you wish to add non-chat Participants to a Conversation, i.e., Participants using SMS, MMS, or WhatsApp, you must create and/or attach a Messaging Service to the Conversation instance. A Messaging Service is a Messaging Resource.
Configuring default Conversation Services and Messaging Services
You can find your "Defaults" (the default Chat and Messaging Services) in the Conversations Section of the Twilio Console
.
You can create and configure Conversation Service instances in the following places and ways:
Using the Twilio Console.
Using the REST API Conversations Services endpoint.
You can create and configure Messaging Services in the following places and ways:
Using the Twilio Console
.
Using the REST API Messaging Services endpoint.
Conversations
(information)
Info
Conversations can only be private. There are no public Conversations.
Resource Object
SID Format
Conversation Instance (Formerly Chat Channel SID)
CHXXX...

Conversations are the heart of all activity within the Conversation Service instance. Conversation Participants send Messages to the Conversation; these are then distributed to other Participants in the Conversation.
Conversations are private, so Participants must be added to a Conversation before they can see and interact with it. There are two ways to add Participants to Conversation:
Another Participant with sufficient permissions adds the Participant to the Conversation.
Your business logic on the backend uses the Conversations REST API to add the Participant to a Conversation.
Messages
Resource Object
SID Format
Conversation Message
IMXXX...

All chat, SMS and WhatsApp Messages exist within a Conversation Service Instance as part of a Conversation. The Conversations API stores Messages in the order in which they were sent, and all Participants of a Conversation can access Messages and create new ones.
Messages can also be edited and removed (subject to Role permissions).
(information)
Info
Every Conversation has an underlying Conversation Service. This Service instance captures all of the Conversation Messages, even if there are only non-chat Participants (SMS and WhatsApp).
Conversation Participants
Resource Object
SID Format
Conversation Participant Instance
MBXXX...

Conversations is a Participant-centric system; a Participant is an entity that joins and interacts — reads and sends messages — within a Conversation.
Within the Conversation Service instance underneath a Conversation, everyone has an identity. Each unique chat identity that connects to a Conversation Service instance also creates a Conversation Participant.
Remember: If you add non-chat Participants to a Conversation, you must add them as part of the Messaging Service that is linked to the Conversation. This is often the default Conversations Message Service. Once added to a Messaging Service, a Participant can interact with chat and non-chat Participants by sending and receiving messages on their handset. The Conversations API sends these Conversation Messages as native SMS, WhatsApp, or chat messages, depending on the other Participants' channels.
Participant Roles in Conversations
The same person (i.e., a single personal phone or WhatsApp number) can be a non-chat Participant in multiple Conversations concurrently as long as the address they are in contact with (the ProxyAddress) is unique.
A chat Participant can interact in multiple Conversations concurrently with the same identity. You can read more about user identities and "active" users here.
Each Participant has an assigned Role within a given Conversation that dictates what they can do within that Conversation. For example, every Participant has the ability to send Messages as part of their Role. You can also create administrator-type Roles, with the ability to add Conversations, delete Conversations, or invite new Participants to a Conversation.
Adding a new non-chat Participant to an ongoing Conversation immediately allows them to see all subsequent communications.
(information)
Info
You can modify Participant permissions to limit the actions and data allowed within a Conversation via their assigned Role.

The Conversations REST API
Your backend services make requests to the Conversations REST API to handle and delegate system usage. With the REST API, your backend logic can control most aspects of a Service including creating Conversations, adding or removing Participants, sending Messages, and more.
For example, you can use the REST API to create a Conversation and add to it Participants representing a customer service agent and a customer.

The Conversations SDKs
The Conversations SDKs are intended for mobile and web apps. They share many of the API's fundamentals — understanding these will help you build smoothly and efficiently with the SDKs. The guide to initializing SDK clients introduces these fundamentals and provides code samples for each SDK.
First-person client SDKs
The Conversations SDKs are used to build end-user Conversations experiences in mobile and web apps. These experiences are designed to be Participant-centric, authenticated, and identified by your backend.
All access and interactions from the Conversations SDK client endpoints happen in the context of a Participant identity interacting with Conversations and Messages Services from within the Conversation Service instance. It is therefore important for your application to perform any necessary authentication and authorization of the Participant before generating an Access Token for their identity.
SDK connectivity
The client SDKs interact with the Conversation Service instance over a WebSocket connection. The Conversations SDK establishes and maintains this connection. Communication with the Conversation Service is in real-time and is bi-directional in nature. The following protocols and hostnames are used to communicate with Twilio's cloud. If necessary, use this information to configure your firewall to enable communication with Twilio.
Region ID
Location
Host Name
Port and Protocol
us1
US East Coast (Virginia)
wss://tsock.us1.twilio.com
443 WSS (websocket over TLS)
us1
US East Coast (Virginia)
https://media.us1.twilio.com
443 HTTPS (HTTP over TLS)
us1
US East Coast (Virginia)
https://mcs.us1.twilio.com
443 HTTPS (HTTP over TLS)

Unfortunately, at this moment it is not possible to use static IP addresses. This is due to the nature of the load-balancing setup. In case an allow-list is required, it is still possible to enable a larger range of Amazon Web Service IP addresses
.
Access Tokens
To interact with a Conversation from an SDK client, you need a valid Access Token. This Access Token is generated by your backend using the relevant Twilio Helper Library and is cryptographically signed to ensure the contents are trusted by the Conversation Service.
You will also need to implement the Access Token refresh logic if your client uses Access Tokens that are shorter-lived than your chat client sessions in Conversations.
Read more about generating Access Tokens and managing Token lifecycles.
Asynchronous interactions
The Conversations SDKs all follow an asynchronous model of interaction with the Conversation Service instance. This means that commands from the SDK clients do not block while waiting for the final result of the command, though they will receive a response from the Service upon command acceptance. You implement event handlers (variously called "callbacks", "handlers" or "listeners") on the client side to receive and process the asynchronous responses from the Conversation Service instance.
Each SDK has a particular mechanism for asynchronous event handlers:
1. JavaScript promises.
2. iOS delegates and blocks.
3. Android listeners.
Examples of how these work within the Conversations SDKs can be found in our guide to Initializing SDK Clients.

Where next?
This guide discusses the fundamental building blocks and data primitives of Twilio Conversations. Continue your Conversations building journey with the following resources:
Initializing SDK Clients.
Creating Access Tokens for Conversations SDKs.
The Conversations REST API.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Conversations Fundamentals | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations Fundamentals
Conversations Limits
Media Support in Conversations
Conversations Webhooks
Using WhatsApp with Conversations
Using States and Timers in Conversations
Delivery Receipts in Conversations
Group Texting in Conversations
Inbound Message Handling & Autocreation
Push Notification Configuration for Conversations
Push Notifications on Android for Conversations
Push Notifications on iOS for Conversations
Push Notifications on Web
A2P 10DLC Registration in Conversations
Reachability Indicator
Send Rich Content Messages with Conversations
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Length limits
Counter limits
Participants per Conversation
Maximum channels/conversations per identity
Channels per Service Instance
Media limits
Media limits from Chat Participants
Media limits from non-Chat participants
Operational limits
APS ("Actions per Second")
Connection Limits
Conversations Limits

The Conversations API has a few limits that you should be aware of when building conversational messaging features.
These limits are enforced at the Conversation, Participant, Message, and Operation levels.

Length limits
Resource: Conversation
Field:
FriendlyName
Maximum length/size:
256 characters
Field:
Attributes
Maximum length/size:
16KB
Resource: Conversation Message
Field:
Body
Maximum length/size:
Inbound: 32KB Outbound: depends on channel
WhatsApp and SMS: 1600 Characters
Chat: 32KB
Field:
Attributes
Maximum length/size:
4KB
Resource: Conversation Participant
Field:
Identity
Maximum length/size:
256 characters
Field:
MessagingBinding.Address
Maximum length/size:
256 characters
Field:
MessagingBinding.ProxyAddress
Maximum length/size:
256 characters
Field:
Attributes
Maximum length/size:
4KB

Counter limits
Participants per Conversation
A Conversation can have up to 1000 Participants, including up to 50 non-chat Participants (e.g., SMS and WhatsApp). The non-chat Participants will receive a blast-type Message from the group in the Conversation. For example, an SMS-based Participant will receive Messages from a single phone number and won't experience the group-style Conversation. When the SMS Participant responds, their Message will go to all Participants.
To create a group Conversation for SMS Participants, refer to our guide, Group Texting in Conversations.
Note: Group MMS can have up to 10 Participants.
Maximum channels/conversations per identity
A Chat identity (Chat user) can be part of 1000 active or inactive Conversations and Chat Channels. Adding a participant whose identity already belongs to 1000 or more Conversations/Chat Channels will result in an error.
Channels per Service Instance
Unlimited — each Service Instance can hold as many channels as you wish!

Media limits
Media limits from Chat Participants
Any media file type of up to 150MB is supported between chat-based participants. The Chat client must contain logic for Chat members to consume media of the various types.
JPG, PNG, MP3, AMR, MP4, and PDF files with a filesize of less than 5MB will be delivered from Chat participants to SMS. If a message originating from a Chat SDK client contains a media file that is greater than 5MB in size, it will not be fanned out as an MMS message. However, Chat SDK consumers will still be able to retrieve the media file. Chat participants are also able to send and receive multiple pieces of media in addition to a text body in the same message, while SMS and WhatsApp participants will only receive a single piece of media and the text body will be dropped.
WhatsApp messages are currently limited to media files of up to 16MB in size.
Media limits from non-Chat participants
For non-Chat participants, the channel's own limits apply. Examples of channels include MMS and WhatsApp.
A single MMS message can contain no more than ten media files, and the total size of all media within the message cannot exceed 5MB. Please see Accepted Content Types for Media to learn what media types are supported by MMS.
Any single file cannot exceed 2MB, but you should note that a carrier may impose additional limits on file size.
A single WhatsApp message may contain one piece of media, of maximum size 16MB. Supported filetypes include JPG, PNG, MP3, AMR, MP4, and PDF.

Operational limits
APS ("Actions per Second")
An action is an operation that mutates the state of a Conversation and other resources, such as sending a message, updating the friendly_name of a Conversation, or adding/removing a participant, etc. Read actions are not limited under APS.
All operations are rate-limited with a default maximum set at 30 APS. Some operations are rate-limited globally, ie. per Service, while others are limited per conversation. Refer to the table below to see whether a given resource is limited per Service or per Conversation.
Resource
Create
Update
Delete
Conversation
Service
Conversation
Service
Participant
Conversation
Conversation
Conversation
Message
Conversation
Conversation
Conversation
User
Service
Service
Service
Role
Service
Service
Service


Connection Limits
Twilio Conversations also apply rate limits to the actions (reads/writes/updates) in order to ensure quality of service for all our customers.
The following tables summarize the various connection limits that are applied for SDKs:.
Limited Quantity
Prescribed Limit
Notes
Number of Concurrent Connections
up to 7,000 in each Twilio Subaccount and 100,000 overall, shared among all your Subaccounts.
The number of concurrent connections through Twilio's internal websockets
Rate of Connection Establishment
up to 110/s in each Twilio Subaccount and 1,000/s overall, shared among all your Subaccounts.
The number of new or re-established connections per second through Twilio's internal websockets
Rate of Upstream Requests
up to 500/s per connection and up to 20,000/s per Subaccounts
The number of upstream requests per second that pass through Twilio's internal websockets. Conversations internal upstream systems help with responses for a particular request


Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Conversations Limits | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations Fundamentals
Conversations Limits
Media Support in Conversations
Conversations Webhooks
Using WhatsApp with Conversations
Using States and Timers in Conversations
Delivery Receipts in Conversations
Group Texting in Conversations
Inbound Message Handling & Autocreation
Push Notification Configuration for Conversations
Push Notifications on Android for Conversations
Push Notifications on iOS for Conversations
Push Notifications on Web
A2P 10DLC Registration in Conversations
Reachability Indicator
Send Rich Content Messages with Conversations
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Using Media Messaging with the client-side SDKs (iOS, Android and JavaScript)
Media Content Security
Platform Differences for Media Messaging
JavaScript
iOS
Android
Creating a Media Message
Checking for Media Content
Retrieving Media Message Content
Using Media Messaging via the Conversations REST API
Sending a Media Message
Limitations
Media Support in Conversations

Twilio Conversations supports media messages, allowing your users to add photos, videos, and other file types to their conversations. The media display seamlessly between channels.
Remember that Chat-based participants are different from SMS- or WhatsApp-based participants in a Conversation.
This guide will cover sending and displaying media in the Chat-based portion of a Conversation using the client-side SDKs as well as using the REST Media Content Service (MCS) API.

Using Media Messaging with the client-side SDKs (iOS, Android and JavaScript)
Creation of a media message for a Chat-based Conversations participant includes the following general steps, with details dependent upon the client platform:
Create a new message, passing in the media source and its mime content-type.
Optionally specify a default download filename to help your application display the media to other Conversation participants.
Programmable Chat provides feedback on the media upload progress, as well as an indication your media file has been successfully saved. (iOS and Android only)
The message is created in a specific Conversation and the Conversation Participants receive a notification.
When receiving a media message from a Conversation, your application will:
Receive a Conversation message that includes a media SID
Ask for a temporary, time-limited download media content URL from the message object
Display or otherwise make available the message's media content to the user
Media on Conversation messages are attachments and live separately from your Conversation message. A media SID associates the media file with its corresponding Conversation message.
Media files cannot exist without an owning message, and deletion of a message results in the cleanup of its associated media. Once created, media files are immutable; you can modify other supported attributes of a message that has media content, but the media itself is not changeable.

Media Content Security
Media content is encrypted and can not be downloaded directly. When required only authenticated users can generate temporary/expiring URLs to download the media content.

Platform Differences for Media Messaging
The media creation and download methods within the client-side SDKs take a stream or file as their parameter. How the media is expressed in the client-side SDK will depend on your platform:
JavaScript
For JavaScript, you can provide the following as the source for the new media message sent by a Chat-based Conversation Participant:
A new FormData object containing file information: filename, content-type, size, and all FormData-required information
A String or Node.js Buffer containing a media byte stream
iOS
Media files are uploaded by providing an InputStream or NSInputStream-compliant stream or NSData to TCHMessageBuilder for the new message.
Android
For Android, you can provide any java.io.InputStream-compliant stream as the source for a new media message.
For all platforms, when receiving a Conversation message, the media is accessible through a temporary URL. This URL is invalidated after 300 seconds. You can request a new temporary URL at any time.

Creating a Media Message
Adding a media-enriched message to a Conversation is very similar to creating a new text-only message. You start by creating a message and adding a media file to a message builder.
Creating a Media Message
Node.jsJavaObjective-CSwift
Report code block
Copy code block
// example for sending media message as FormData


// ---------------------------------------------


const formData = new FormData();


formData.append('file', $('#formInputFile')[0].files[0]);


// get desired channel (for example, with getChannelBySid promise)


chatClient.getChannelBySid(channelSid).then(function(channel) {


 // send media with all FormData parsed atrtibutes


 channel.sendMessage(formData);


});





// example for sending media message as String


// -------------------------------------------


// get desired channel (for example, with getChannelBySid promise)


chatClient.getChannelBySid(channelSid).then(function(channel) {


 // send SVG image as string with content type image/svg+xml; charset=utf-8


 channel.sendMessage({


   contentType: 'image/svg+xml; charset=utf-8',


   media:


     '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +


     '<path d="M50,3l12,36h38l-30,22l11,36l-31-21l-31,21l11-36l-30-22h38z"' +


     ' fill="#FF0" stroke="#FC0" stroke-width="2"/></svg>',


 });


});





// example for sending media message as Buffer


// -------------------------------------------


// get desired channel (for example, with getChannelBySid promise)


chatClient.getChannelBySid(channelSid).then(function(channel) {


 // send PNG image as Buffer with content type image/png


 channel.sendMessage({


   contentType: 'image/png',


   media: fs.readFileSync(pngFile),


 });


});

Checking for Media Content
The message will have non-empty attachedMedia array.
Checking for Media Content
Node.jsJavaObjective-CSwift
Report code block
Copy code block
// get desired channel (for example, with getChannelBySid promise)


chatClient.getChannelBySid(channelSid).then(function(channel) {


 // get channel's messages paginator


 channel.getMessages().then(function(messagesPaginator) {


   // check the first message type


   const message = messagesPaginator.items[0];


   if (message.type === 'media') {


     console.log('Message is media message');


     // log media properties


     console.log('Media properties', message.media);


   }


 });


});

Retrieving Media Message Content
If a Conversation message has media content, you can ask for a short-lived, temporary URL to download that content.
The function that returns the temporary URL is asynchronous, so you will need to get the URL as an argument in a closure, completion block, or listener, depending on the client-side platform. An example of what that would look like is in the code sample.
On iOS or Android, you do need to write your own code (or use an existing library) to download the binary contents of the media and then display or play the media.
Retrieving Message Media Content
Node.jsJavaObjective-CSwift
Report code block
Copy code block
// get desired channel (for example, with getChannelBySid promise)


chatClient.getChannelBySid(channelSid).then(function(channel) {


 // get channel's messages paginator


 channel.getMessages().then(function(messagesPaginator) {


   // check the first message type


   const message = messagesPaginator.items[0];


   if (message.type === 'media') {


     console.log('Message is media message');


     // log media properties


     console.log('Media attributes', message.media);


     // get media temporary URL for displaying/fetching


     message.media.getContentTemporaryUrl().then(function(url) {


       // log media temporary URL


       console.log('Media temporary URL is ' + url);


     });


   }


 });


});

Using Media Messaging via the Conversations REST API
Your backend services can also add media to Conversations by uploading and attaching files to Conversations Messages. This section provides a brief overview of the typical Media flow using the REST API. For a more detailed API description, please refer to Conversations Media REST API documentation.
Note: Currently, Media Content Service (MCS) provides the underlying Media REST endpoint used to create (upload) the media (files). It is a separate endpoint and not supported in the Twilio Helper Libraries or the Twilio CLI.
Sending a Media Message
Sending a Media Message via the REST API is a two-step process:
First, upload the media file to Twilio's Media Content Service (MCS) via the REST API
Send a media message to the Conversation by attaching the media instance that you created in Step 1 to a new Conversation Message
Uploading media should be done directly from the source machine, using native HTTP facilities. Using cURL, the equivalent request looks like this:
Copy code block
curl -u “<account_sid>:<account_secret>” --data-binary “@<filename>” https://mcs.us1.twilio.com/v1/Services/<chat_service_sid>/Media
The response to your POST request to create a Media instance via MCS contains a Media SID. You can attach the newly uploaded Media file to a Conversation message using that returned Media SID. You can consult the Conversation Message Resource documentation for more information about creating a new Conversation Message with the REST API that includes the media parameter.
Copy code block
curl -u "<account_sid>:<account_secret>" -X POST https://conversations.twilio.com/v1/Conversations/<conversation_sid>/Messages -d MediaSid=<media_sid>


Uploaded media will be automatically garbage-collected by Twilio unless it is attached to a Conversations message within five minutes. If you attempt to send a media message after it is garbage collected, the operation will fail (no media with the given SID exists anymore).

Limitations
Conversations is a cross-channel messaging product, so each channel has a different set of limitations about incoming media files. Please refer to the Media Limits documentation for channel-specific information and supported file types.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Media Support in Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations Fundamentals
Conversations Limits
Media Support in Conversations
Conversations Webhooks
Using WhatsApp with Conversations
Using States and Timers in Conversations
Delivery Receipts in Conversations
Group Texting in Conversations
Inbound Message Handling & Autocreation
Push Notification Configuration for Conversations
Push Notifications on Android for Conversations
Push Notifications on iOS for Conversations
Push Notifications on Web
A2P 10DLC Registration in Conversations
Reachability Indicator
Send Rich Content Messages with Conversations
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Conversations Webhooks vs. Event Streams
Configuring Webhook Targets and Filtering
Webhook Filtering
Webhook Action Triggers
Triggering Webhooks for REST API Events
Using Pre-Action Webhooks to Modify or Reject Changes
Modifiable Fields
Configuring Webhooks with the REST API
Webhook Bodies by Event Type
Pre-action Webhooks Request Parameters
Post Action Webhooks request parameters
Conversations Webhooks

Conversations sends pre-action and post-action webhooks for many events that happen in your application. These webhooks allow you to monitor and react to user actions in your own backend service, in a Function, or in a Studio flow. You can also use these webhooks to store activity logs in a system of record or in a logging server as part of your own application.
(information)
Info
Conversations webhooks have a maximum timeout of 5 seconds.
(information)
Info
Twilio can send your web application an HTTP request when certain events happen, such as an incoming text message to one of your Twilio phone numbers. These requests are called webhooks, or status callbacks. For more, check out our guide to Getting Started with Twilio Webhooks. Find other webhook pages, such as a security guide and an FAQ in the Webhooks section of the docs.

Conversations Webhooks vs. Event Streams
Twilio Event Streams supports subscribing to Conversations post-action events. All post-action events are supported, except for onDeliveryUpdated. Event Streams provides a reliable way to consume these events, with up to four hours of queuing if your system is down. Event Streams is the recommended way to consume Conversations events for monitoring or logging use cases. Check out the list of available events types in the Event Streams documentation.

Configuring Webhook Targets and Filtering
You can configure the global (Account-level) webhook target and service-level webhook target through the Console, or through the REST API.
For the global webhook target, go to Conversations > Global webhooks.
For the service-level webhook target, select your Conversation Service, then go to Webhooks.

Expand image
Note: The Conversation-scoped webhooks may only be modified via the REST API.
Webhook Filtering
In addition to configuring the URLs for pre-action and post-action webhooks, you can also choose to send only certain webhooks to your servers. This helps avoid unnecessarily burdening your web application with traffic.
These can also be configured at an account level (globally) or at the service level in the Twilio Console:
For the global webhook target, go to Conversations > Global webhooks and scroll down to Webhook Filtering.
For the service-level webhook target, select your Conversation Service, then go to Webhooks. Scroll down to Webhook Filtering.

Expand image

Webhook Action Triggers
Most actions — but not all of them — have both a pre-action and a post-action webhook. The former is fired before the action has been published, and Twilio waits for a response before publishing it. The latter is fired after publication, assuming the action was not rejected by your pre-action webhook response.
The below table enumerates all Conversations webhook actions in corresponding pairs.
Pre-Action
Post-Action
Description (incl. Post-Action)
onMessageAdd
onMessageAdded
Fires when a new message is posted to a conversation.
onMessageRemove
onMessageRemoved
Fires when a message is deleted from a conversation.
onMessageUpdate
onMessageUpdated
Fires when a posted message's body or any attribute is changed.
onConversationAdd
onConversationAdded
Fires when a new conversation is created.
onConversationRemove
onConversationRemoved
Fires when a conversation is removed from the Service.
onConversationUpdate
onConversationUpdated
Fires when any attribute of a conversation is changed.
onParticipantAdd
onParticipantAdded
Fires when a Participant has joined a Conversation as a Member.
onParticipantRemove
onParticipantRemoved
Fires when a User is removed from the set of Conversation Members.
onParticipantUpdate
onParticipantUpdated
Fires when any configurable attribute of a User is changed. Will not be fired for reachability events.
---
onConversationStateUpdated
Fires when the state of a Conversation is updated, e.g., from "active" to "inactive"
---
onDeliveryUpdated
Fires when delivery receipt status is updated
---
onUserAdded
Fires when a new user is added
onUserUpdate
onUserUpdated
Fires when a user is changed

Triggering Webhooks for REST API Events
Upon configuration, only actions from SDK-driven clients (like mobile phones or browsers) or SMS-based Participants will cause webhooks without further action on your part. This includes both Service-level webhooks and Conversation-Scoped Webhooks. This is a default behavior to help avoid infinite feedback loops.
Your Post-Event Webhook target, however, may be an important tool for archiving. In this case, you may also want to enable webhook "echoes" from actions you take on the REST API. To do so, you can add a header X-Twilio-Webhook-Enabled=true to any such request. Requests bearing this header will yield webhooks to the configured Post-Event webhook target.
Using Pre-Action Webhooks to Modify or Reject Changes
In the case of Pre-Action webhooks, Twilio will wait for a response from your service before publishing a result. The arrival, HTTP status code, and content of your response determines how Conversations will proceed.
Response Status Code
Body
Result
HTTP 200 OK
{}(or no content)
Conversations will publish the change unmodified.
HTTP 200 OK
{ "body": "modified message" }

(See the list of modifiable fields.)
Conversations will publish the change with modifications as given in the response.

All values are optional, and missing fields will be left unmodified from the original event. See below for which fields can be modified for each data type (Conversations or Messages).

If modified values fail validation, the error will be returned to the SDK (or REST client) that triggered the event.
HTTP 40x (any error condition)
N/A
Conversations will reject the change and no publication will be made.
HTTP 50x (any error condition)
N/A
Conversations will reject the change and no publication will be made.
(no response or timeout)


Conversations will publish the change unmodified after a timeout of 5 seconds; your messages will be delayed accordingly.

Modifiable Fields
Conversation Actions
In response to the onConversationAdd and onConversationUpdate actions, your Pre-Action Webhook response may modify the following property of the conversation:
friendly_name
An example response modifying a conversation
Copy code block
HTTP 200 OK


Content-Type: application/json


{


   "friendly_name": "friendly name of conversation"


}
Message Actions
In response to onMessageAdd and onMessageUpdate actions, your Pre-Action Webhook response may modify the following properties of the message:
body
author
attributes
An example response modifying a message.
Copy code block
HTTP 200 OK


Content-Type: application/json


{


   "body": "modified message text",


   "author": "modified author name",


   "attributes": "{\"key\" : \"value\"}"


}

Configuring Webhooks with the REST API
Your Conversations service can have global webhooks that apply to every conversation within the service, or you can specify webhooks per conversation.
Post-action webhooks are available for all three types of webhooks (global, service-level and conversation-scoped). Pre-action webhooks are only available for two types of webhooks (global and service-level).
Retrieve Existing Global Webhook Configuration for a Conversation Service
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchConfigurationWebhook() {


 const webhook = await client.conversations.v1.configuration


   .webhooks()


   .fetch();





 console.log(webhook.accountSid);


}





fetchConfigurationWebhook();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "pre_webhook_url": "https://example.com/pre",


 "post_webhook_url": "https://example.com/post",


 "method": "GET",


 "filters": [


   "onMessageSend",


   "onConversationUpdated"


 ],


 "target": "webhook",


 "url": "https://conversations.twilio.com/v1/Configuration/Webhooks"


}
Update Global Webhook Configuration for a Conversation Service
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateConfigurationWebhook() {


 const webhook = await client.conversations.v1.configuration


   .webhooks()


   .update({


     filters: ["onMessageAdd", "onMessageUpdate", "onMessageRemove"],


     method: "POST",


     postWebhookUrl: "https://YOUR_APPLICATION.com/webhook",


     preWebhookUrl: "https://YOUR_APPLICATION.com/webhook",


     target: "webhook",


   });





 console.log(webhook.accountSid);


}





updateConfigurationWebhook();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "pre_webhook_url": "https://YOUR_APPLICATION.com/webhook",


 "post_webhook_url": "https://YOUR_APPLICATION.com/webhook",


 "method": "POST",


 "filters": [


   "onConversationUpdated"


 ],


 "target": "webhook",


 "url": "https://conversations.twilio.com/v1/Configuration/Webhooks"


}
List the Scoped Webhooks for a Conversation
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function listConversationScopedWebhook() {


 const webhooks = await client.conversations.v1


   .conversations("ConversationSid")


   .webhooks.list({ limit: 20 });





 webhooks.forEach((w) => console.log(w.sid));


}





listConversationScopedWebhook();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "meta": {


   "page": 0,


   "page_size": 5,


   "first_page_url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks?PageSize=5&Page=0",


   "previous_page_url": null,


   "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks?PageSize=5&Page=0",


   "next_page_url": null,


   "key": "webhooks"


 },


 "webhooks": [


   {


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "sid": "WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "target": "webhook",


     "configuration": {


       "url": "https://example.com",


       "method": "get",


       "filters": [


         "onMessageSent",


         "onConversationDestroyed"


       ]


     },


     "date_created": "2016-03-24T21:05:50Z",


     "date_updated": "2016-03-24T21:05:50Z",


     "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks/WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


   },


   {


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "sid": "WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "target": "trigger",


     "configuration": {


       "url": "https://example.com",


       "method": "post",


       "filters": [


         "keyword1",


         "keyword2"


       ]


     },


     "date_created": "2016-03-24T21:05:50Z",


     "date_updated": "2016-03-24T21:05:50Z",


     "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks/WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


   },


   {


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "sid": "WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "target": "studio",


     "configuration": {


       "flow_sid": "FWaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


     },


     "date_created": "2016-03-24T21:05:50Z",


     "date_updated": "2016-03-24T21:05:50Z",


     "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks/WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


   }


 ]


}
Retrieve the Configuration for a Specific Webhook
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchConversationScopedWebhook() {


 const webhook = await client.conversations.v1


   .conversations("ConversationSid")


   .webhooks("WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .fetch();





 console.log(webhook.sid);


}





fetchConversationScopedWebhook();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "target": "studio",


 "configuration": {


   "flow_sid": "FWaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


 },


 "date_created": "2016-03-24T21:05:50Z",


 "date_updated": "2016-03-24T21:05:50Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks/WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}
Create New Scoped Webhook Configuration
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationScopedWebhook() {


 const webhook = await client.conversations.v1


   .conversations("ConversationSid")


   .webhooks.create({


     "configuration.filters": ["onMessageAdded", "onMessageUpdated"],


     "configuration.url": "https://YOUR_APPLICATION.com/webhook",


     target: "webhook",


   });





 console.log(webhook.sid);


}





createConversationScopedWebhook();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "target": "webhook",


 "configuration": {


   "url": "https://example.com",


   "method": "get",


   "filters": [


     "onMessageSent",


     "onConversationDestroyed"


   ]


 },


 "date_created": "2016-03-24T21:05:50Z",


 "date_updated": "2016-03-24T21:05:50Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks/WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}

Webhook Bodies by Event Type
When Twilio makes an HTTP request to your server, it includes information about the action that triggered the webhook call to your web application. Each action has its own event type.
In addition to the event-specific parameters, each request also contains the following parameters and information:
parameter name
type
description
AccountSid
string, SID
The Twilio Account SID that the Conversation belongs to
EventType
string
The type of action that triggered this webhook event (see details for each event type below)
Source
string
The source of the action that created this event - possible values are SDK or API
ClientIdentity
string
The identity of the user that performed the action (SDK-originating events only)

Note: Each HTTP request is issued with the Content-Type header application/x-www-form-urlencoded.
Pre-action Webhooks Request Parameters
onConversationAdd
You may modify the FriendlyName of this conversation by replying to this webhook with a JSON object that contains the new friendly name.
parameter name
type
description
EventType
string
Always onConversationAdd
FriendlyName
string, optional
The friendly name of the conversation, if set
UniqueName
string
The unique name of the conversation
Attributes
string
Conversation metadata as set by the customer, represented as stringified JSON
ChatServiceSid
string, SID
Conversation Service SID
MessagingServiceSid
string, SID
Messaging Service instance SID
MessagingBinding.ProxyAddress
string, optional (see note)
Twilio Brand phone number used by channel creator
MessagingBinding.Address
string, optional (see note)
Originating phone number of the channel creator
MessagingBinding.ProjectedAddress
string, optional*
The address of the Twilio phone number that is used in Group MMS. Communication mask for the Conversation participant with Identity
MessagingBinding.AuthorAddress
string, optional*
Number of the message author when auto-creating Group MMS
MessageBody
string, optional
Initial conversation message string
Media
string, JSON, optional
Stringified JSON array of attached media objects
State
string
Enumerated type representing state of the conversation

Note: MessagingBinding.ProxyAddress and MessagingBinding.Address attributes are null if the Conversation is created from the REST API and there are no participants yet. Note: When auto-creating Group MMS Conversation, MessagingBinding.Address is shown as a list of Addresses.
onConversationRemove
parameter name
type
description
EventType
string
Always onConversationRemove
ConversationSid
string, SID
Conversation String Identifier
DateCreated
string, ISO8601 time
The date of creation of the conversation
DateUpdated
string, ISO8601 time
The last modification date of the conversation
FriendlyName
string, optional
The friendly name of the conversation, if set
UniqueName
string
The unique name of the conversation
Attributes
string
Conversation metadata as set by the customer, represented as stringified JSON
ChatServiceSid
string, SID
Conversation Service SID
MessagingServiceSid
string, SID
Messaging Service instance SID
State
string
Enumerated type representing state of the conversation

onConversationUpdate
You may modify the FriendlyName of this conversation by replying to this webhook with a JSON object that contains the new friendly name.
parameter name
type
description
EventType
string
Always onConversationUpdate
ConversationSid
string, SID
Conversation String Identifier
DateCreated
string, ISO8601 time
The date of creation of the conversation
DateUpdated
string, ISO8601 time
The last modification date of the conversation
FriendlyName
string, optional
The friendly name of the conversation, if set
UniqueName
string
The unique name of the conversation
Attributes
string
Conversation metadata as set by the customer, represented as stringified JSON
ChatServiceSid
string, SID
Conversation Service SID
MessagingServiceSid
string, SID
Messaging Service instance SID
State
string
Enumerated type representing state of the conversation

onMessageAdd
Your application may modify the Body and Author parameters in the pre-event webhook. To update these parameters, reply to the webhook with a JSON object that contains the relevant keys and values.
parameter name
type
description
EventType
string
Always onMessageAdd
ConversationSid
string
Conversation SID identifier for the conversation the message is being added to.
Body
string
The body of the message
Author
string
The author of the message
ParticipantSid
string, optional
Participant SID of the message author
Attributes
string
Message metadata as set by customer, represented as stringified JSON
Media
string, JSON, optional
Stringified JSON array of attached media objects

onMessageRemove
parameter name
type
description
EventType
string
Always onMessageRemove
ConversationSid
string
Conversation SID identifier for the conversation the message is being removed from.
MessageSid
string
Message sid identifier
Index
int
Message index in the messages stream
DateCreated
string, ISO8601 time
Creation date of the message
DateUpdated
string, ISO8601 time
Last modification date of the message
Body
string
The body of the message
Author
string
The author of the message
ParticipantSid
String, optional
Participant SID of the message author
Attributes
string
Message metadata as set by customer, represented as stringified JSON
Media
string, JSON, optional
Stringified JSON array of attached media objects

onMessageUpdate
Your application may modify the Body and Authorparameters in the pre-event webhook. To update these parameters, reply to the webhook with a JSON object that contains the relevant keys and values.
parameter name
type
description
EventType
string
Always onMessageUpdate
ConversationSid
string
Conversation SID identifier for the conversation the message is in.
MessageSid
string
Message sid identifier
Index
int
Message index in the messages stream
DateCreated
string, ISO8601 time
Creation date of the message
DateUpdated
string, ISO8601 time
Last modification date of the message
Body
string
The body of the message
Author
string
The author of the message
ParticipantSid
string, optional
Participant SID of the message author
Attributes
string
Message metadata as set by customer, represented as stringified JSON
Media
string, JSON, optional
Stringified JSON array of attached media objects

onParticipantAdd
parameter name
type
description
EventType
string
Always onParticipantAdd
ConversationSid
string, SID
Conversation String Identifier
Identity
string, optional (see note)
The Identity of the user being added to the conversation
RoleSid
string
Role of user that is being added to the conversation
Attributes
string
Participant metadata as set by the customer, represented as stringified JSON
MessagingBinding.ProxyAddress
string, optional (see note)
Twilio Brand phone number used by participant
MessagingBinding.Address
string, optional (see note)
Originating phone number of the participant
MessagingBinding.ProjectedAddress
string, optional*
The address of the Twilio phone number that is used in Group MMS. Communication mask for the Conversation participant with Identity
MessagingBinding.Type
string
Type of the participant, one of: SMS, CHAT, WHATSAPP

Note: A Conversation Participant has either the Identity (and MessagingBinding ProjectedAddress for GroupMMS Participant) or MessagingBinding ProxyAddress and Address attributes filled in. In case the added participant is SMS or WhatsApp, Identity is null and both addresses are supplied. If the added participant is Chat-only, the Identity value is provided, and both MessagingBinding addresses (MessagingBinding ProxyAddress and Address) are null.
onParticipantRemove
parameter name
type
description
EventType
string
Always onParticipantRemove
ConversationSid
string, SID
Conversation String Identifier
ParticipantSid
string, SID
Participant String Identifier
DateCreated
string, ISO8601 time
Creation date of the participant
DateUpdated
string, ISO8601 time
The last modification date of the participant
Identity
string, optional (see note)
The Identity of the user being removed from the conversation
RoleSid
string
Role of user that is being removed from the conversation
Attributes
string
Participant metadata as set by the customer, represented as stringified JSON
MessagingBinding.ProxyAddress
string, optional (see note)
Twilio Brand phone number used by participant
MessagingBinding.Address
string, optional (see note)
Originating phone number of the participant
MessagingBinding.ProjectedAddress
string, optional*
The address of the Twilio phone number that is used in Group MMS. Communication mask for the Conversation participant with Identity
MessagingBinding.Type
string
Type of the participant, one of: SMS, CHAT, WHATSAPP

Note: A Conversation Participant has either the Identity (and MessagingBinding ProjectedAddress for GroupMMS Participant) or MessagingBinding ProxyAddress and Address attributes filled in. In case the added participant is SMS or WhatsApp, Identity is null and both addresses are supplied. If the added participant is Chat-only, the Identity value is provided, and both MessagingBinding addresses (MessagingBinding ProxyAddress and Address) are null.
onParticipantUpdate
parameter name
type
description
EventType
string
Always onParticipantUpdate
ConversationSid
string, SID
Conversation String Identifier
ParticipantSid
string, SID
Participant String Identifier
DateCreated
string, ISO8601 time
Creation date of the participant
DateUpdated
string, ISO8601 time
The last modification date of the participant
Identity
string, optional (see note)
The Identity of the user being added to the conversation
RoleSid
string
Role of the user that is being added to the conversation
Attributes
string
Participant metadata as set by the customer, represented as stringified JSON
MessagingBinding.ProxyAddress
string, optional (see note)
Twilio Brand phone number used by participant
MessagingBinding.Address
string, optional (see note)
Originating phone number of the participant
MessagingBinding.ProjectedAddress
string, optional*
The address of the Twilio phone number that is used in Group MMS. Communication mask for the Conversation participant with Identity
MessagingBinding.Type
string
Type of the participant, one of: SMS, CHAT, WHATSAPP

Note: A Conversation Participant has either the Identity (and MessagingBinding ProjectedAddress for GroupMMS Participant) or MessagingBinding ProxyAddress and Address attributes filled in. In case the added participant is SMS or WhatsApp, Identity is null and both addresses are supplied. If the added participant is Chat-only, the Identity value is provided, and both MessagingBinding addresses (MessagingBinding ProxyAddress and Address) are null.
onUserUpdate
parameter name
type
description
EventType
string
Always onUserUpdate
ChatServiceSid
string, SID
Conversation Service String Identifier
UserSid
String, SID
User String Identifier
DateUpdated
string, ISO8601 time
User modification date
Identity
string, optional (see note)
The Identity of the user being updated
RoleSid
string
Role of the user being updated
Attributes
string
User metadata, as set by the customer, represented as stringified JSON
FriendlyName
string
Friendly name of the User

Post Action Webhooks request parameters
onConversationAdded
parameter name
type
description
EventType
string
Always onConversationAdded
ConversationSid
string, SID
Conversation Sid identifier
DateCreated
string, ISO8601 time
The date of creation of the conversation
DateUpdated
string, ISO8601 time
The last modification date of the conversation
FriendlyName
string, optional
The friendly name of the conversation, if set
UniqueName
string, optional
The unique name of the conversation
Attributes
string
Conversation metadata as set by the customer, represented as stringified JSON
ChatServiceSid
string, SID
Conversation Service SID
MessagingServiceSid
string, SID
Messaging Service instance SID
MessagingBinding.ProxyAddress
string, optional (see note)
Twilio Brand phone number used by channel creator
MessagingBinding.Address
string, optional (see note)
Originating phone number of the channel creator
MessagingBinding.ProjectedAddress
string, optional*
The address of the Twilio phone number that is used in Group MMS. Communication mask for the Conversation participant with Identity
MessagingBinding.AuthorAddress
string, optional*
Number of the message author when auto-creating Group MMS
State
string
Enumerated type representing state of the conversation

onConversationRemoved
parameter name
type
description
EventType
string
Always onConversationRemoved
ConversationSid
string, SID
Conversation String Identifier
DateCreated
string, ISO8601 time
The date of creation of the conversation
DateUpdated
string, ISO8601 time
The last modification date of the conversation
DateRemoved
string, ISO8601 time
The date the conversation was removed
FriendlyName
string, optional
The friendly name of the conversation, if set
UniqueName
string, optional
The unique name of the conversation
Attributes
string
Conversation metadata as set by the customer, represented as stringified JSON
ChatServiceSid
string, SID
Conversation Service SID
MessagingServiceSid
string, SID
Messaging Service instance SID
State
string
Enumerated type representing state of the conversation

onConversationUpdated
You may modify the FriendlyName of this conversation by replying to this webhook with a JSON object that contains the new friendly name.
parameter name
type
description
EventType
string
Always onConversationUpdated
ConversationSid
string, SID
Conversation String Identifier
DateCreated
string, ISO8601 time
The date of creation of the conversation
DateUpdated
string, ISO8601 time
The last modification date of the conversation
FriendlyName
string, optional
The friendly name of the conversation, if set
UniqueName
string, optional
The unique name of the conversation
Attributes
string
Conversation metadata as set by the customer, represented as stringified JSON
ChatServiceSid
string, SID
Conversation Service SID
MessagingServiceSid
string, SID
Messaging Service instance SID
State
string
Enumerated type representing state of the conversation

onConversationStateUpdated
parameter name
type
description
EventType
string
onConversationStateUpdated
ChatServiceSid
string, SID
Conversation Service SID
StateUpdated
string, ISO8601 time
Modification date of the state
StateFrom
String
State that conversation was transitioned from, e.g. "active", "inactive" or "closed".
StateTo
String
State that conversation was transitioned to, e.g. "active", "inactive" or "closed".
ConversationSid
String, SID
Conversation String Identifier
Reason
String
Source of the state change, e.g., "API", "TIMER", "EVENT"
MessagingServiceSid
String, SID
Messaging Service SID

onMessageAdded
parameter name
type
description
EventType
string
Always onMessageAdded
ConversationSid
string
Conversation SID identifier for the conversation the message is being added to.
MessageSid
string
Message sid identifier
MessagingServiceSid
string, SID
The Messaging Service SID attached to the conversation this message is being added to.
Index
int
Message index in the messages stream
DateCreated
string, ISO8601 time
Creation date of the message
Body
string
The body of the message
Author
string
The author of the message
ParticipantSid
string, optional
Participant SID of the message author
Attributes
string
Message metadata as set by customer, represented as stringified JSON
Media
string, JSON, optional
Stringified JSON array of attached media objects

onMessageUpdated
parameter name
type
description
EventType
string
Always onMessageUpdated
ConversationSid
string
Conversation SID identifier for the conversation the message is in.
MessageSid
string
Message sid identifier
Index
int
Message index in the messages stream
DateCreated
string, ISO8601 time
Creation date of the message
DateUpdated
string, ISO8601 time
Last modification date of the message
Body
string
The body of the message
Author
string
The author of the message
ParticipantSid
string, optional
Participant SID of the message author
Attributes
string
Message metadata as set by customer, represented as stringified JSON
Media
string, JSON, optional
Stringified JSON array of attached media objects

onMessageRemoved
parameter name
type
description
EventType
string
Always onMessageRemoved
ConversationSid
string
Conversation SID identifier for the conversation the message was removed from.
MessageSid
string
Message sid identifier
Index
int
Message index in the messages stream
DateCreated
string, ISO8601 time
Creation date of the message
DateUpdated
string, ISO8601 time
Last modification date of the message
DateRemoved
string, ISO8601 time
Date that the message was removed from the conversation
Body
string
The body of the message
Author
string
The author of the message
ParticipantSid
string, optional
Participant SID of the message author
Attributes
string
Message metadata as set by customer, represented as stringified JSON
Media
string, JSON, optional
Stringified JSON array of attached media objects

onParticipantAdded
parameter name
type
description
EventType
string
Always onParticipantAdded
ConversationSid
string, SID
Conversation String Identifier
ParticipantSid
string, SID
Participant String Identifier
DateCreated
string, ISO8601 time
The date of creation of the participant
Identity
string, optional (see note)
The Identity of the user being added to the conversation
RoleSid
string
Role of user that is being added to the conversation
Attributes
string
Participant metadata as set by the customer, represented as stringified JSON
MessagingBinding.ProxyAddress
string, optional (see note)
Twilio Brand phone number used by participant
MessagingBinding.Address
string, optional (see note)
Originating phone number of the participant
MessagingBinding.ProjectedAddress
string, optional*
The address of the Twilio phone number that is used in Group MMS
MessagingBinding.Type
string
Type of the participant, one of: SMS, CHAT, WHATSAPP

Note: A Conversation Participant has either the Identity (and MessagingBinding ProjectedAddress for GroupMMS Participant) or MessagingBinding ProxyAddress and Address attributes filled in. In case the added participant is SMS or WhatsApp, Identity is null and both addresses are supplied. If the added participant is Chat-only, the Identity value is provided, and both MessagingBinding addresses (MessagingBinding ProxyAddress and Address) are null.
onParticipantRemoved
parameter name
type
description
EventType
string
Always onParticipantRemoved
ConversationSid
string, SID
Conversation String Identifier
ParticipantSid
string, SID
Participant String Identifier
DateCreated
string, ISO8601 time
Creation date of the participant
DateUpdated
string, ISO8601 time
The last modification date of the participant
DateRemoved
string, ISO8601 time
The date the participant was removed
Identity
string, optional (see note)
The Identity of the user being removed from the conversation
RoleSid
string
Role of user that is being removed from the conversation
Attributes
string
Participant metadata as set by the customer, represented as stringified JSON
MessagingBinding.ProxyAddress
string, optional (see note)
Twilio Brand phone number used by participant
MessagingBinding.Address
string, optional (see note)
Originating phone number of the participant
MessagingBinding.ProjectedAddress
string, optional*
The address of the Twilio phone number that is used in Group MMS
MessagingBinding.Type
string
Type of the participant, one of: SMS, CHAT, WHATSAPP

Note: A Conversation Participant has either the Identity (and MessagingBinding ProjectedAddress for GroupMMS Participant) or MessagingBinding ProxyAddress and Address attributes filled in. In case the added participant is SMS or WhatsApp, Identity is null and both addresses are supplied. If the added participant is Chat-only, the Identity value is provided, and both MessagingBinding addresses (MessagingBinding ProxyAddress and Address) are null.
onParticipantUpdated
parameter name
type
description
EventType
string
Always onParticipantUpdated
ConversationSid
string, SID
Conversation String Identifier
ParticipantSid
string, SID
Participant String Identifier
DateCreated
string, ISO8601 time
Creation date of the participant
DateUpdated
string, ISO8601 time
The last modification date of the participant
Identity
string, optional (see note)
The Identity of the user being added to the conversation
RoleSid
string
Role of user that is being added to the conversation
Attributes
string
Participant metadata as set by the customer, represented as stringified JSON
MessagingBinding.ProxyAddress
string, optional (see note)
Twilio Brand phone number used by participant
MessagingBinding.Address
string, optional (see note)
Originating phone number of the participant
MessagingBinding.ProjectedAddress
string, optional*
The address of the Twilio phone number that is used in Group MMS
MessagingBinding.Type
string
Type of the participant, one of: SMS, CHAT, WHATSAPP
LastReadMessageIndex
int
Index of last "read" message in the Conversation for the participant

Note: A Conversation Participant has either the Identity (and MessagingBinding ProjectedAddress for GroupMMS Participant) or MessagingBinding ProxyAddress and Address attributes filled in. In case the added participant is SMS or WhatsApp, Identity is null and both addresses are supplied. If the added participant is Chat-only, the Identity value is provided, and both MessagingBinding addresses (MessagingBinding ProxyAddress and Address) are null.
onDeliveryUpdated
parameter name
type
description
EventType
string
onDeliveryUpdated
AccountSid
string, SID
SID of the account that the message belongs to, ACxx
ConversationSid
string, SID
Conversation String Identifier, CHxx
ChatServiceSid
string, SID
Conversation Service SID, ISxx
MessageSid
string, SID
Identifier of Conversation Message, IMxxx
DeliveryReceiptSid
string, SID
SID of the Delivery Receipt, DYxx
ChannelMessageSid
string, SID
SID of the 'channel' message e.g WAxx for WhatsApp, SMxx for SMS
ParticipantSid
string, SID
Participant String Identifier, MBxx
Status
string, enum
Status of the message, one of "read", "failed", "delivered", "undelivered", "sent"
ErrorCode
integer
Twilio documented numeric error code
DateCreated
string, ISO8601 time
Date delivery receipt was created
DateUpdated
string, ISO8601 time
Date that delivery receipt was last created

onUserAdded
parameter name
type
description
EventType
string
Always onUserAdded
ChatServiceSid
string, SID
Conversation Service String Identifier
UserSid
string, SID
String identifier of newly created User
DateCreated
string, ISO8601 time
The date of creation of the User
Identity
string, optional (see note)
The Identity of the user being added to the conversation
RoleSid
string
Role of the user that is being added to the conversation
Attributes
string
User metadata as set by the customer, represented as stringified JSON
FriendlyName
string
Friendly name of the User

onUserUpdated
parameter name
type
description
EventType
string
Always onUserUpdated
ChatServiceSid
string, SID
Conversation Service String Identifier
UserSid
string, SID
User String Identifier
DateCreated
string, ISO8601 time
The date of creation of the User
DateUpdated
string, ISO8601 time
User modification date
Identity
string, optional (see note)
The Identity of the user being added to the conversation
RoleSid
string
Role of the user that was updated
Attributes
string
User metadata as set by the customer, represented as stringified JSON
FriendlyName
string
Friendly name of the User
isOnline
Boolean
Whether the User is actively connected to this Conversations Service and online
isNotifiable
Boolean
Whether the User has a potentially valid Push Notification registration (APN or GCM) for this Conversations Service


Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Conversations Webhooks | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations Fundamentals
Conversations Limits
Media Support in Conversations
Conversations Webhooks
Using WhatsApp with Conversations
Using States and Timers in Conversations
Delivery Receipts in Conversations
Group Texting in Conversations
Inbound Message Handling & Autocreation
Push Notification Configuration for Conversations
Push Notifications on Android for Conversations
Push Notifications on iOS for Conversations
Push Notifications on Web
A2P 10DLC Registration in Conversations
Reachability Indicator
Send Rich Content Messages with Conversations
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Get your WhatsApp templates approved
Cross-Channel Masking: Connecting WhatsApp to SMS
Step 1. Create a Conversation
Step 2: Create the WhatsApp Participant
Step 3: Create the SMS Participant
Step 4: Send a message from WhatsApp
Masked Communication: Connecting Two WhatsApp Participants
Setting Up the Conversation
Starting More Professionally: Using Template Messages
What's Next
Using WhatsApp with Conversations

WhatsApp is increasingly the world's #1 conversational messaging platform as well as an absolutely critical engagement tool across South America, Middle East, Africa and many parts of Europe and Asia. Twilio Conversations supports WhatsApp out of the box and can help you address a number of patterns:
Delivery Coordination: Let your drivers reach out to the customer to make sure the last 100 yards of each delivery are successful.
Clienteling: Allow your employees to have long-term relationships (e.g. personal shoppers, wealth managers, or real estate agents) with your customers without using their personal devices.
Masked Communication: Facilitate communication between your employees and your customers without sharing private numbers.
This guide will show you how to set up a few common patterns that pair WhatsApp with other channels.

Prerequisites
(information)
Info
WhatsApp onboarding generally takes 1-2 weeks. WhatsApp has a thorough vetting process that requires business verification in the Meta Business Manager in order to protect the WhatsApp ecosystem.
We advise planning accordingly when setting up your WhatsApp Sender for Twilio. For more information, please read our guide to connecting your WhatsApp Business Profile with your Twilio number.
WhatsApp is a highly-regulated channel, requiring documentation and approval from Meta to get your business started. Specifically, you will need to secure an approved WhatsApp Business Profile, which gives you a Twilio WhatsApp Number to represent your business.
Get your WhatsApp templates approved
(information)
Info
The last section of the tutorial uses templates to initiate contact between two separate WhatsApp participants. If you follow the steps chronologically, you will still be able to complete the tutorial because you will have opted into the WhatsApp's 24-hour window. However, the screenshots will looks lightly different from what you see in the WhatsApp interface.
Depending on your use-case, you may need to secure some approved WhatsApp templates. This is specifically required if you want to send a message to a new user on WhatsApp, or send a message more than 24 hours after the last response.
Note: If your use case can function such that you always receive WhatsApp messages first from your customers, you can skip the template registration step.
Now, you're ready to go!

Cross-Channel Masking: Connecting WhatsApp to SMS
SMS is the easiest channel to connect to WhatsApp in a Twilio Conversation. To do this we'll use:
A Twilio SMS-capable phone number (hereafter "TWI-SMS-NUMBER")
Your Twilio WhatsApp number (hereafter "TWI-WA-NUMBER")
The Twilio CLI
We recommend the Twilio CLI for experimenting, but these guides will work in any language in Twilio. Pick your favorite on the right and follow along.
Let's get down to it; our SMS-to-WhatsApp conversation will take four steps to set up.
Step 1. Create a Conversation
Create a Conversation
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversation() {


 const conversation = await client.conversations.v1.conversations.create({


   friendlyName: "SMS-to-WhatsApp Example",


 });





 console.log(conversation.sid);


}





createConversation();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "SMS-to-WhatsApp Example",


 "unique_name": "unique_name",


 "attributes": "{ \"topic\": \"feedback\" }",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "state": "inactive",


 "timers": {


   "date_inactive": "2015-12-16T22:19:38Z",


   "date_closed": "2015-12-16T22:28:38Z"


 },


 "bindings": {},


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "participants": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",


   "messages": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",


   "webhooks": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks",


   "export": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Export"


 }


}
Step 2: Create the WhatsApp Participant
Create the WhatsApp Participant
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationParticipant() {


 const participant = await client.conversations.v1


   .conversations("CHxxxx")


   .participants.create({


     "messagingBinding.address": "whatsapp:YOUR_WHATSAPP_NUMBER",


     "messagingBinding.proxyAddress": "whatsapp:TWI_WA_NUMBER",


   });





 console.log(participant.accountSid);


}





createConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "CHxxxx",


 "sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "identity": null,


 "attributes": "{ \"role\": \"driver\" }",


 "messaging_binding": {


   "type": "sms",


   "address": "+15558675310",


   "proxy_address": "+15017122661"


 },


 "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}
Step 3: Create the SMS Participant
Create the SMS Participant
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationParticipant() {


 const participant = await client.conversations.v1


   .conversations("CHxxxx")


   .participants.create({


     "messagingBinding.address": "YOUR_SMS_NUMBER",


     "messagingBinding.proxyAddress": "TWI_SMS_NUMBER",


   });





 console.log(participant.accountSid);


}





createConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "CHxxxx",


 "sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "identity": null,


 "attributes": "{ \"role\": \"driver\" }",


 "messaging_binding": {


   "type": "sms",


   "address": "+15558675310",


   "proxy_address": "+15017122661"


 },


 "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}
Step 4: Send a message from WhatsApp
Because you've set up this conversation to proxy with SMS, you'll see the messages flowing back and forth automatically between your two channels.
Note: The WhatsApp user kicks off this conversation by sending the first message. By starting from an inbound WhatsApp message, we've avoided any need to use WhatsApp Templates to start the Conversation. These messages and media will flow just fine for the next 24 hours.

Expand image

Masked Communication: Connecting Two WhatsApp Participants
When you connect two WhatsApp participants, you'll have to solve two business problems:
Who is speaking with whom?
This is probably the bread-and-butter of your business idea: if you're a two-sided marketplace, you're probably connecting a buyer and a seller (or a passenger and a rider). The buyer is the most critical personality: the brand they see in WhatsApp is important and must establish enough trust to proceed with the conversation. When you create your WhatsApp Business Profile, keep that buyer personality in mind first.
How will you get opt-in from both participants?
Unsolicited outbound messages to WhatsApp are highly restricted. Until your customer replies, you can only send messages conforming to approved templates. In this scenario, both sides are on WhatsApp, so we will need to use one of those templates to get the conversation moving.
We'll start by setting up the Conversation and later show how to use templates to improve the customer experience.
Setting Up the Conversation
We'll need the following to set up our WhatsApp-to-WhatsApp Conversation:
A Twilio WhatsApp number; we'll call this "TWI_WA_NUMBER." You could use more than one, but it's not necessary.
Two consumer WhatsApp accounts. Choose yourself and a friend who won't mind. These are typically your personal device numbers.
The Twilio CLI
.
(warning)
Warning
If you're going through this guide in chronological order and re-using your WhatsApp numbers to test out all of the use cases, you should remove the previous Conversation first. Each number pair (twilio+personal) can only appear in one conversation at a time.
Copy code block
twilio api:conversations:v1:conversations:remove --sid CHxxxx
With that, connecting two WhatsApp participants in a Conversation will take five steps:
Step 1: Create the Conversation
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversation() {


 const conversation = await client.conversations.v1.conversations.create();





 console.log(conversation.sid);


}





createConversation();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "friendly_name",


 "unique_name": "unique_name",


 "attributes": "{ \"topic\": \"feedback\" }",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "state": "inactive",


 "timers": {


   "date_inactive": "2015-12-16T22:19:38Z",


   "date_closed": "2015-12-16T22:28:38Z"


 },


 "bindings": {},


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "participants": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",


   "messages": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",


   "webhooks": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks",


   "export": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Export"


 }


}
Steps 2 and 3: Add two different WhatsApp Participants
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationParticipant() {


 const participant = await client.conversations.v1


   .conversations("CHxxxx")


   .participants.create({


     "messagingBinding.address": "whatsapp:YOUR_WHATSAPP_NUMBER",


     "messagingBinding.proxyAddress": "whatsapp:TWI_WA_NUMBER",


   });





 console.log(participant.accountSid);


}





createConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "CHxxxx",


 "sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "identity": null,


 "attributes": "{ \"role\": \"driver\" }",


 "messaging_binding": {


   "type": "sms",


   "address": "+15558675310",


   "proxy_address": "+15017122661"


 },


 "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}
Step 4: Send a message from one side
From your phone, send the first message in WhatsApp. Send the message to your TWI_WA_NUMBER (not directly to your friend's number.)
Step 5: Send a message from the other side
Have your good-natured friend send a message to your TWI_WA_NUMBER (not directly to your phone number).

Expand image
Congratulations, it's working!
… Mostly. You may notice that after steps four and five, you have two different conversations ongoing. After this awkward introduction, everything proceeds as expected, but that's not the professional experience we want.
In this scenario, both WhatsApp-based parties must reply before the Twilio can send outbound messages to both parties. Receiving an incoming message from both Conversation participants kicks off the "24-hour session" in which Twilio can send outbound free-form WhatsApp messages.
Starting More Professionally: Using Template Messages
(warning)
Warning
WhatsApp templates need to be submitted and approved before they are effective. Before you proceed to below, learn how to create WhatsApp templates and submit them for approval. Once your templates are approved, use the appropriate body text in the steps below.
Note: Without approved WhatsApp templates, these outbound messages will be swallowed by the system.
If you have followed the tutorial chronologically, you can complete the tutorial because you and your good-natured friend have opted into receiving WhatsApp messages for 24 hours. However, the screenshots will differ from what you see in the WhatsApp interface.
Let's carry the example above a little further, and use approved WhatsApp Template Messages to make it happen. We're going to pick two template messages that we've already gotten approved:
A templated message that our food courier will understand
A templated message that will invite the customer to opt into the contact.
Copy code block
TEMPLATE 1:


Hello {{1}}, your food delivery is almost there but {{2}} (your rider) needs help finding your door. Are you willing to chat with them?





TEMPLATE 2:


Your customer has agreed to chat over WhatsApp to get this delivery sorted. You're now connected. Say hello!
We'll send these messages one after another, waiting for a response from the first before sending the second.
Using templates to smooth out our customer experience, let's follow two more steps:
Step 6: Invite the Customer to Engage.
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationMessage() {


 const message = await client.conversations.v1


   .conversations("CHxxxx")


   .messages.create({


     author: "whatsapp:COURIER_WA_NUMBER",


     body: "Hello Robert, your food delivery is almost there but Alicia (your rider) needs help finding your door. Are you willing to chat with them?",


   });





 console.log(message.accountSid);


}





createConversationMessage();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "CHxxxx",


 "body": "Hello Robert, your food delivery is almost there but Alicia (your rider) needs help finding your door. Are you willing to chat with them?",


 "media": null,


 "author": "whatsapp:COURIER_WA_NUMBER",


 "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "attributes": "{ \"importance\": \"high\" }",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "index": 0,


 "delivery": {


   "total": 2,


   "sent": "all",


   "delivered": "some",


   "read": "some",


   "failed": "none",


   "undelivered": "none"


 },


 "content_sid": null,


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",


   "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"


 }


}
The following is what the customer will see after you send the first templated message as the courier/rider:

Expand image
You'll notice when you do this that the customer receives a message, but the courier does not. We're using the rules of WhatsApp's 24-hour opt-in window in our favor: securing one participant's opt-in (from the customer) before we reach out to the other (the courier).
In the picture above, you notice that we included an automated reply: "Great! Just a moment…" This picture is a step ahead. To actually execute this — and at the same time to opt-in our courier — we're going to need a Twilio function and a Conversations webhook.
Create a Twilio Function to send the templates
Let's start with the former.
First, navigate to the Twilio Functions section of the Console
 and click on "Configure." Confirm that the version listed for the twilio NPM module is up-to-date
, such as 3.66.1 or higher.

Expand image
Next, create a Twilio Function in the console
 with the following code, which will set us up to capture the onMessageAdded event.
Copy code block
exports.handler = function (context, event, callback) {


 const customer = event.Author;


 let thisConversation = context


   .getTwilioClient()


   .conversations.v1.conversations.get(event.ConversationSid);





 // This system message will reach the customer, but our rider


 // will still need to be opted-in.


 let justAMoment = thisConversation.messages.create({


   body: "Great! Just a moment while we connect you…",


 });





 // Use Template #2 for the rider.


 let riderOptIn = thisConversation.messages.create({


   author: customer,


   body: "Your customer has agreed to chat over WhatsApp to get this delivery sorted. You're now connected. Say hello!",


 });





 // Remove all scoped webhooks; we only want this once.


 let webhooks = [];


 thisConversation.webhooks.each((hook) => webhooks.push(hook.remove()));





 // Critically important: wait for the messages to resolve.


 Promise.all([justAMoment, riderOptIn, ...webhooks]).finally(() =>


   callback(null)


 );


};
To power this, we'll add a Conversation Scoped webhook that we can remove later.
Step 7: Set up a Conversation Scoped Webhook to field the reply.
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationScopedWebhook() {


 const webhook = await client.conversations.v1


   .conversations("CHxxxx")


   .webhooks.create({


     "configuration.filters": ["onMessageAdded"],


     "configuration.method": "POST",


     "configuration.url": "http://funny-dunkin-3838.twil.io/customer-optin",


     target: "webhook",


   });





 console.log(webhook.sid);


}





createConversationScopedWebhook();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "CHxxxx",


 "sid": "WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "target": "webhook",


 "configuration": {


   "url": "https://example.com",


   "method": "get",


   "filters": [


     "onMessageSent",


     "onConversationDestroyed"


   ]


 },


 "date_created": "2016-03-24T21:05:50Z",


 "date_updated": "2016-03-24T21:05:50Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks/WHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


}
Now let's start again by sending the initial opt-in message to test the whole flow.

Expand image
With all this setup, we've created the ideal experience for two-sided WhatsApp Conversations. Notice how system messaging manages expectations while we're still opting-in the second party. And after the initial setup, notice that we're not forwarding messages one-by-one among the parties: all of that happens automatically via Twilio Conversations platform. It only ends if/when you DELETE the conversation later on.
Note: Our templates fit neatly in WhatsApp's guidelines: they are not promotional, but rather they facilitate an active transaction. By following these patterns, your business could benefit from the same pattern.

What's Next
Ready to learn more about Conversations and WhatsApp? Learn more with the following resources:
Send WhatsApp Notification Messages with Templates
Connecting your Twilio Number with your WhatsApp Business Profile
The Conversations API Reference
The Conversations Scoped Webhook Resource

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Using WhatsApp with Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations Fundamentals
Conversations Limits
Media Support in Conversations
Conversations Webhooks
Using WhatsApp with Conversations
Using States and Timers in Conversations
Delivery Receipts in Conversations
Group Texting in Conversations
Inbound Message Handling & Autocreation
Push Notification Configuration for Conversations
Push Notifications on Android for Conversations
Push Notifications on iOS for Conversations
Push Notifications on Web
A2P 10DLC Registration in Conversations
Reachability Indicator
Send Rich Content Messages with Conversations
Conversations SDK Guides
Tutorials
Client-side SDKs
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
What are states and timers in Conversations?
Conversation States
Active and Inactive Conversations
Closed Conversations
Conversations Timers
Use case examples for Conversations States and Timers
Handling inbound contacts from your customers
Building and managing long-term relationships with customers
Scenario #1: Both timers are configured
Scenario #2: No timers configured
Scenario #3: Only inactive timer configured
Scenario #4: Only closed timer configured
Best practices for States and Timers configuration
What's Next?
Using States and Timers in Conversations

With Twilio Conversations' states and timers features, you can manage, store, and archive your application's Conversations.
By using these features, your Conversations participants can focus on active (ongoing) Conversations. You can also close out old or inactive Conversations to make sure you're not exceeding the Participants-per-Conversation limit.
This guide provides an overview of states and timers, as well as how to configure them.
For the best end-user experience, we highly recommend that you read the complete Twilio Conversations documentation and tailor our general recommendations provided for your specific use case.
(information)
Info
Note: States and Timers for specific Conversations are only modifiable via the REST API. Global Timers can be configured for all Conversations created in your account through the Console under the Defaults tab.

What are states and timers in Conversations?
Conversations States and Timers are default features that appear in a Conversation's Properties.
There are two configurable timers to automatically transition Conversations between active to inactive as well as from inactive to closed states.

Expand image
Note: We recommend leaving the default Conversation state as active unless you need to change it for your specific use case.
There are three ways to transition between Conversations states:
Use a configured timer (see below). The state will change once the timer elapses.
Manipulate state using a REST API call.
The Conversation will automatically move from an inactive to active state when a new text or media message arrives.

Conversation States
A Conversation can have one of three states:
active
inactive
closed
Active and Inactive Conversations
A newly created Conversation has the active state by default. Active and inactive states are considered as "hot" storage and can be manipulated back and forth. The transition between these two states is instantaneous; there will be no delay.
Be aware that active and inactive conversations count towards the participant-per-conversation limit: 50 non-Chat (SMS, WhatsApp, etc) and up to 1000 native Chat participants.
Update a Conversation's state
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateConversation() {


 const conversation = await client.conversations.v1


   .conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .update({ state: "inactive" });





 console.log(conversation.accountSid);


}





updateConversation();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab",


 "friendly_name": "friendly_name",


 "unique_name": "unique_name",


 "attributes": "{ \"topic\": \"feedback\" }",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "state": "inactive",


 "timers": {


   "date_inactive": "2015-12-16T22:19:38Z",


   "date_closed": "2015-12-16T22:28:38Z"


 },


 "bindings": {},


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "participants": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",


   "messages": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",


   "webhooks": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks",


   "export": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Export"


 }


}
Closed Conversations
The closed state is a little bit more special: once a Conversation is closed, it cannot be restarted. In other words, you cannot add new Participants to a Conversation in the closed state.
If a new non-chat (e.g., SMS) message comes into closed Conversation, a new Conversation will be auto-created with the Participant who initiated the Conversation. At this point, there is no automatic addition of other Participants, so you should add them to the newly created Conversation.
Be aware that closed Conversations do not count towards the Conversations-per-Identity limit.

Conversations Timers
There are no default timers configured at the time of account creation. Instead, you choose whether or not to set timers for individual Conversations or a global default for all Conversations created in your account.
There are two configurable timers to transition between Conversation states:
timers.inactive
timers.closed
Timers are optional functionality, but we highly recommend enabling them to manage Conversations efficiently and avoid encountering the Conversations-per-Identity limit. Setting timers allows you to see the specific date and times when a Conversation transitions between activate and inactive as well as inactive and closed states.
All timer values are represented in ISO 8601
 duration format.
(information)
Info
Note: When configuring timers, durations must be specified in days or smaller units (hours, minutes, seconds). Using months P6M or years P1Y will result in an invalid format error. For instance, to set a timer for 6 months, use P180D (assuming an average month has 30 days), and for 1 year, use P365D
In the following example, the Conversation has two timers set:
Copy code block
"timers": {


   "date_inactive": "2015-12-16T22:19:38Z",


   "date_closed": "2015-12-16T22:28:38Z"


}
Note: If you wish to disable one or both timers, use PT0S to set them to zero.
A few things to be aware of when configuring Conversations Timers:
If both timers are set, they automatically support active-to-inactive and inactive-to-closed transitions
Timers have precision of one second (1 second)
The minimum time for the inactive timer is 60 seconds (one minute). For a closed timer, the minimum time is 600 seconds (ten minutes).
When you manually change the state of a Conversation, for example by REST API call, the timer counter resets to zero.
Create timers for a Conversation
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateConversation() {


 const conversation = await client.conversations.v1


   .conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .update({


     "timers.closed": "PT60000S",


     "timers.inactive": "PT5M",


   });





 console.log(conversation.accountSid);


}





updateConversation();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab",


 "friendly_name": "friendly_name",


 "unique_name": "unique_name",


 "attributes": "{ \"topic\": \"feedback\" }",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "state": "inactive",


 "timers": {


   "date_inactive": "2015-12-16T22:19:38Z",


   "date_closed": "2015-12-16T22:28:38Z"


 },


 "bindings": {},


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "participants": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",


   "messages": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",


   "webhooks": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks",


   "export": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Export"


 }


}

Use case examples for Conversations States and Timers
At their core, states and timers in Conversations provide basic functionality to handle customers' requests promptly and to better manage time for service providers, such as customer service agents, tutors, healthcare workers, and wealth advisors.
Examples of how to use states and timers include:
Handling inbound contacts from your customers
To handle inbound customer contacts, we recommend setting the inactive timer to roughly the human attention span, or a few minutes. This way, the person fielding the inbound requests can stay focused and manage the incoming messages more efficiently. Once the inactive timer has elapsed on a given Conversation, the new active Conversation kicks in, waiting for a response.
To determine the timer for transitioning to the closed state, determine the length of your average conversation; this is the best indicator of how long to wait before an inactive Conversation should be archived and moved to closed state.
Building and managing long-term relationships with customers
Some use cases involve long-term relationships with your customers, such as those that a wealth manager or a personal shopper develops. In this case, you can use primarily inactive timers. Ideally, Conversations go to the closed state after years--rather than minutes--of inactivity so that customers are assured that their important conversations are handled with care.
Consider the following four scenarios for how to configure states and timers
Scenario #1: Both timers are configured
With the following settings, the Conversation's state changes to inactive if there has been no update for 300 seconds. At this point, the clock on timers.closed starts to tick. If after 30,000 seconds, there is still no activity, the clock on timers.closed elapses, and the Conversation state changes to closed.
set timers.inactive = 300 seconds
set timers.closed = 30,000 seconds
Scenario #2: No timers configured
In this case, the Conversation's state never changes to inactive because the timers.inactive property has not been set. Likewise, the clock on timers.closed never starts to increment because timers.closed was also not configured. The Conversation's state is always active.
set timers.inactive = not configured
set timers.closed = not configured
Scenario #3: Only inactive timer configured
With these settings, the Conversation never transitions to the closed state because timers.closed is not configured. The Conversation's state becomes inactive if there has been no updating activity for 600 seconds; inactive is the last possible state that the Conversation can have.
Note: Because this Conversation never achieves the closed state, it will be always counted into Conversation-per-User limit.
set timers.inactive = 600 seconds
set timers.closed = not configured
Scenario #4: Only closed timer configured
With these settings, the Conversation never becomes inactive because timers.inactive is not set. The Conversation's state remains active for its entire duration. Finally, timers.closed closes the Conversation after 30 days of inactivity.
set timers.inactive = not configured
set timers.closed = 30 days
(information)
Info
Currently, you can only control the post-webhook onConversationStateUpdated via the REST API.

Best practices for States and Timers configuration
With Conversations, there is no need to set any default state. All Conversations are in an active state as soon as they are created.
We advise setting your timers and state transitions based on your unique use case, taking into account your end users' behavior and the number of Conversations you expect to create. Based on the analysis of Conversations data, we suggest the following "rule of thumb" as common values that will work for timers in many use cases:
Transition to inactive after 30 days of inactivity in active state
Transition to closed after one (1) year in the inactive state with no activity (new text or media messages)
Keep in mind that your use case may benefit from shorter timers, but the above suggestions are a good starting place.

What's Next?
Setting states and timers for your Conversations helps you seamlessly manage interactions with your end users based, clearing out inactivated Conversations and staying within the limits of Conversations-per-Participant.
Ready to build feature-rich Conversations? Check out the following resources:
Conversations Limits documentation
Using WhatsApp with Conversations
The Twilio Conversations API Resource
Media Support in Conversations

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Using States and Timers in Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations Fundamentals
Conversations Limits
Media Support in Conversations
Conversations Webhooks
Using WhatsApp with Conversations
Using States and Timers in Conversations
Delivery Receipts in Conversations
Group Texting in Conversations
Inbound Message Handling & Autocreation
Push Notification Configuration for Conversations
Push Notifications on Android for Conversations
Push Notifications on iOS for Conversations
Push Notifications on Web
A2P 10DLC Registration in Conversations
Reachability Indicator
Send Rich Content Messages with Conversations
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Why use Delivery Receipts in Conversations?
What are the possible message statuses?
Delivery Status for SMS Messages in Conversations
Delivery Status for WhatsApp Messages in Conversations
How to get Delivery Receipts information in Conversations
Use the Conversations REST API to get Delivery Receipts
What is a Webhook?
Set up Webhooks for Delivery Receipts
Use case examples for Delivery Receipts
Example 1: An Agent on Chat and an SMS or WhatsApp End User
Example 2: Tracking non-Chat Message Statuses
Limitations for Delivery Receipts in Conversations
No Delivery Receipts for Messages originating from Chat Participants
Statuses for SMS Messages are tentative
What's Next?
Delivery Receipts in Conversations

With Delivery Receipts in Twilio Conversations, you gain visibility into the messages sent to your Participants in non-Chat channels, specifically SMS and WhatsApp. You can automatically keep track of whether a message in a Conversation has been delivered to a non-Chat Participant.
This guide provides an overview of Delivery Receipts in Conversations as well as how to set them up to keep track of the status of your messages.

Why use Delivery Receipts in Conversations?
You can use Delivery Receipts to check the Message Status of the Conversations Messages. This information is a quick way to gauge if your messages reach your end users. If the delivery receipt indicates that the message wasn't delivered, you'll know to look into carrier disruptions or issues with mobile connectivity or availability.
Unlike the Message Status of individual SMS and WhatsApp messages, Delivery Receipts in Conversations correlate the Message Status information with your Conversation SID as well as relevant error code information. Rather than tracking individual messages, you can see both aggregated delivery information as well as the most recent status for messages in a particular Conversation.

What are the possible message statuses?
Delivery Receipts in Conversations support the following message statuses:
sent: Twilio has sent the message
delivered: Twilio has received confirmation of message delivery from the carrier (and, where available, the destination handset). See below for more information.
read: The user has opened the message on their device, and the read status has been reported back to Twilio. This applies only to over-the-top, or OTT, channels, such as WhatsApp.
failed: The message could not be sent.
undelivered: Twilio has received a delivery receipt indicating that the message was not delivered.
null: The message has been created, but it's still within Twilio.
For failed and undelivered statuses, Twilio provides an error code with the reason that the Message was not delivered.
Delivery Status for SMS Messages in Conversations
Note: SMS statuses received via Delivery Receipts are tentative. (Read more on SMS-specific message statuses
.) For SMS, the last possible status is "delivered," which indicates that the carrier has accepted the SMS message as sent from Twilio. If the carrier has not yet accepted the Message, its status remains "sent."
Delivery Status for WhatsApp Messages in Conversations
Delivery Receipts for WhatsApp messages are more granular. A "delivered" status indicates that the WhatsApp application has accepted the message. Otherwise, the status remains as "sent," for example if the mobile device is off. WhatsApp messages can also have the "read" status, indicating that the recipient has consumed the message on their device.

How to get Delivery Receipts information in Conversations
There are two ways that you can consume Delivery Receipts information:
Use the Conversations REST API to get Delivery Receipts
Delivery Receipts information is available at two levels: a summary with aggregated totals for a given Message and a detailed view, broken down by recipient for a given Message.
Get a summary of delivery information from the Conversation Message Resource
The Delivery property of the Conversations Message resource contains an aggregated summary delivery information. This provides a high-level overview of the Message Status information for the Conversation, including count breakdowns by status of the Conversational messages.
Fetch Aggregated Delivery Receipts Information for a Conversation Message
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchConversationMessage() {


 const message = await client.conversations.v1


   .conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .messages("IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .fetch();





 console.log(message.delivery);


}





fetchConversationMessage();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "body": "Welcome!",


 "media": null,


 "author": "system",


 "participant_sid": null,


 "attributes": "{ \"importance\": \"high\" }",


 "date_created": "2016-03-24T20:37:57Z",


 "date_updated": "2016-03-24T20:37:57Z",


 "index": 0,


 "delivery": {


   "total": 2,


   "sent": "all",


   "delivered": "some",


   "read": "some",


   "failed": "none",


   "undelivered": "none"


 },


 "content_sid": null,


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",


   "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"


 }


}
For example, imagine the following sample delivery object returned as part of a fetched Message:
Copy code block
"delivery": {


   "total": 5,


   "sent": "all",


   "delivered": "some",


   "read": "some",


   "failed": "none",


   "undelivered": "none"


}
This information indicates that of the five delivery receipts for a given message, the message was sent to all of the Participants. Some messages are delivered, indicating that Twilio has received delivery confirmation from a carrier. The some next to read indicates that some of the messages--those sent over an OTT channel--have been opened or read by the Participants. No messages have the failed or undelivered status.
For a more granular view of message delivery status, you can make a request to the Receipts resource, described below.
Get detailed information from the Receipts Resource
A request to the Delivery Receipt resource returns individual statuses for each Message, by each recipient. This is a more detailed view of Message Status information; it includes Channel SIDs for the Conversation Participants.
Retrieve detailed Delivery Receipt Information for a Conversation Message
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function listConversationMessageReceipt() {


 const deliveryReceipts = await client.conversations.v1


   .conversations("ConversationSid")


   .messages("IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .deliveryReceipts.list({ limit: 20 });





 deliveryReceipts.forEach((d) => console.log(d.accountSid));


}





listConversationMessageReceipt();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "meta": {


   "page": 0,


   "page_size": 50,


   "first_page_url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts?PageSize=50&Page=0",


   "previous_page_url": null,


   "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts?PageSize=50&Page=0",


   "next_page_url": null,


   "key": "delivery_receipts"


 },


 "delivery_receipts": [


   {


     "sid": "DYaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "message_sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "channel_message_sid": "SMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "status": "failed",


     "error_code": 3000,


     "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "date_created": "2016-03-24T20:37:57Z",


     "date_updated": "2016-03-24T20:37:57Z",


     "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts/DYaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


   },


   {


     "sid": "DYaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "message_sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "channel_message_sid": "SMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "status": "failed",


     "error_code": 3000,


     "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "date_created": "2016-03-24T20:37:57Z",


     "date_updated": "2016-03-24T20:37:57Z",


     "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts/DYaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


   },


   {


     "sid": "DYaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "conversation_sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "message_sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "channel_message_sid": "SMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "status": "failed",


     "error_code": 3000,


     "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "date_created": "2016-03-24T20:37:57Z",


     "date_updated": "2016-03-24T20:37:57Z",


     "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts/DYaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"


   }


 ]


}
In the response, delivery_receipts is a list of individual statuses for each Message that was sent to an individual recipient or Participant in the Conversation.
For example, if a Chat user is corresponding with one SMS Participant and one WhatsApp Participant, delivery_receipts will contain two different objects, one for each Message sent to a specific Participant:
Copy code block
{


  “delivery_receipts” : [


        {


           "sid": "DYXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


           "message_sid": "IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


           "channel_message_sid": "SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


           "participant_sid": "MBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


           "status": "sent",


           "error_code": null,


           "date_created": "2020-03-23T18:45:17Z",


           "date_updated": "2020-03-23T18:45:17Z"


        },


        {


           "sid": "DYXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


           "message_sid": "IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


           "channel_message_sid": "WAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


           "participant_sid": "MBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


           "status": "read",


           "error_code": null,


           "date_created": "2020-03-23T19:45:17Z",


           "date_updated": "2020-03-23T18:45:17Z"


        }


    ]


}


In the sample output, we see that for the Message for the SMS Participant (the SMXXX Channel SID), the most recent status is sent, meaning that Twilio has passed the message on to the appropriate carrier. However, for the WhatsApp Participant, the most recent status is read, indicating that the Participant has consumed the message in their WhatsApp application.
(information)
Info
The information returned from the Delivery Receipt resource does not include historic data; the most recent status information overrides the previous status. For example, if a WhatsApp Message has been sent, delivered, and read, a request to this resource will display only the "read" status for that specific message. Likewise, the "undelivered" status of a message overrides the previous "sent" status once the message delivery fails.
To see the dates for all status events (i.e., the changes between sent, delivered, and read statuses), you must set up Webhooks, which we'll cover in the next section.

What is a Webhook?
Webhooks are user-defined HTTP
 callbacks. They are usually triggered by some event, such as receiving an SMS message or an incoming phone call. When that event occurs, Twilio makes an HTTP request (usually a POST or a GET
) to the URL configured for the webhook.
To handle a webhook, you only need to build a small web application that can accept the HTTP requests. Almost all server-side programming languages offer some framework for you to do this. Examples across languages include ASP.NET MVC
 for C#, Servlets
 and Spark
 for Java, Express
 for Node.js, Django
 and Flask
 for Python, and Rails
 and Sinatra
 for Ruby. PHP
 has its own web app framework built in, although frameworks like Laravel
, Symfony
 and Yii
 are also popular.
Whichever framework and language you choose, webhooks function the same for every Twilio application. They will make an HTTP request to a URI that you provide to Twilio. Your application performs whatever logic you feel necessary - read/write from a database, integrate with another API or perform some computation - then replies to Twilio with a TwiML response with the instructions you want Twilio to perform.
Set up Webhooks for Delivery Receipts
As mentioned above, the information retrieved via the REST API and the Delivery Receipt Resource displays the last or most recent update for a given Message. However, what if you want automatic updates on a message's status, as it passes through Twilio's systems and onto the carrier or OTT application? For this, you'll set up your webhook URL.
Each Delivery Receipt event that you receive on your webhook URL represents a status change for a given message.
A new post-webhook event called onDeliveryUpdated is executed for every delivery receipt notification received by Twilio. For every delivery receipt event, Twilio will send a request to your post-event URL that you have configured for Conversations. (Read more about using Webhooks in Conversations.)
Twilio sends the same information found in the Receipt resource to your post-event URL for every onDeliveryUpdated event.
You can turn on webhooks and configure the post-event URL for Delivery Receipts using the Conversations REST API:
Update the onDeliveryUpdated Webhook URL
curl
Report code block
Copy code block
curl -X POST "https://conversations.twilio.com/v1/Conversations/Webhooks" \


--data-urlencode "PostWebhookUrl=https://www.example.com/postWebhook" \


-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
Output
Copy output
{


 "account_sid": "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "pre_webhook_url": "https://example.com/pre",


 "post_webhook_url": "https://www.example.com/postWebhook",


 "method": "GET",


 "filters": [


   "onConversationUpdated"


 ],


 "target": "webhook",


 "url": "https://conversations.twilio.com/v1/Conversations/Webhooks"


}
You can also configure the onDeliveryUpdated webhook through the Twilio Console
 in the Conversations section. (Read more about Conversations Webhooks and how to configure them.)

Use case examples for Delivery Receipts
Delivery Receipts in Conversations provide visibility into the statuses of messages sent across different channels. Let's look at two common use cases for Delivery Receipts.
Example 1: An Agent on Chat and an SMS or WhatsApp End User
The primary use case for Delivery Receipts involves an agent on a Chat interface sending messages to an SMS or WhatsApp end user. In this case, the agent on Chat wants to know if their message has been received by the SMS user or read by the WhatsApp (OTT) user.
First, use the aggregated status on the Message resource to get a quick overview of the situation. This aggregated view is often sufficient to see that all of the messages have the delivered status. Twilio works with carriers to ensure a high rate of message deliverability, so you can use delivered: "all" as a quick indicator that the messages are reaching your end users successfully.
If necessary, you can take a deeper dive into the Message status for a specific Participant in the Conversation. An example of this would be the aggregated delivery object indicating that only some or none of the messages were delivered.
In this case, you can utilize Webhooks or the Receipts resource to examine individual message statuses. Make a request to the Receipts resource to find the SIDs and error codes for specific Messages that have undelivered or failed statuses.
Example 2: Tracking non-Chat Message Statuses
It is also possible to track the status of any message sent between non-Chat Participants in a Conversation. In other words, you can use Delivery Receipts to answer the question "Where is the message between two SMS Participants in my Conversation?"
For example, imagine a Conversation between an Agent on Chat and two SMS Participants (end users). You can verify that a message sent from one SMS end user reached the other. These details are available through Webhooks (as a onDeliveryUpdated event) or via the Conversations REST API.

Limitations for Delivery Receipts in Conversations
No Delivery Receipts for Messages originating from Chat Participants
When a Message is delivered to another Chat Participant, it does not emit any Delivery Receipt information. Therefore, Delivery Receipts information is only available for messages sent to non-Chat (SMS or WhatsApp) Participants.
(information)
Info
Because messages sent to Chat Participants do not emit delivery information, the default status for these Messages is always delivered. Thus, messages to Chat Participants do not affect the all value in the aggregated deliveries property of a Message Resource.
Messages sent to Chat Participants do not appear in the delivery_receipts sub-resource.
Statuses for SMS Messages are tentative
SMS delivery statuses have limited reliability, and Twilio cannot guarantee against last-leg disruptions from the carrier. This is the same reliability as seen in SMS status callbacks. In most cases, these statuses are accurate.
In addition, SMS statuses in Delivery Receipts do not reveal whether the end user's mobile handset is turned on or off. If the end user's mobile device is switched off, the status of this SMS message is delivered.
Barring any carrier disruptions, the message will be delivered when the end user's handset is switched on and can once again receive messages. For example, a handset would be able to receive messages again upon re-entering a coverage area or turning off Airplane Mode.

What's Next?
In this guide, we covered using Delivery Receipts to check the status of messages in Conversations.
Check out the following resources to continue building rich conversational experiences for your customers:
The Conversations Quickstart
Setting up Webhooks in Conversations
Configuring WhatsApp and Conversations
Message Statuses for SMS Messages

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Delivery Receipts in Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations Fundamentals
Conversations Limits
Media Support in Conversations
Conversations Webhooks
Using WhatsApp with Conversations
Using States and Timers in Conversations
Delivery Receipts in Conversations
Group Texting in Conversations
Inbound Message Handling & Autocreation
Push Notification Configuration for Conversations
Push Notifications on Android for Conversations
Push Notifications on iOS for Conversations
Push Notifications on Web
A2P 10DLC Registration in Conversations
Reachability Indicator
Send Rich Content Messages with Conversations
Conversations SDK Guides
Tutorials
Client-side SDKs
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
What is Group Texting?
Leveraging Group MMS in Conversations for group texting
Projected Addresses vs. Proxy Addresses
Sharing a Projected Address in group texts
Using standalone Projected Addresses in group texts
Conversation autocreation with Group Texting
Walkthrough of two Group Texting examples
Get started: Acquire an MMS-capable Twilio Phone Number
Scenario 1: Set up a group message with one Chat participant and two SMS participants
Step 1: Create the Conversation
Step 2: Add the real estate agent
Step 3: Add the first homebuyer
Step 4: Send a 1:1 message
Step 5: Add the second homebuyer to the group text
Step 6: Send another message
Scenario 2: Set up a group message with two Chat and one SMS participants
Use one projected address to transfer between agents
Optional: Clean up the first Conversation
Step 1: Create the Conversation
Step 2: Add the financial advisor
Step 3: Add the end-user (the advisee) by SMS
Step 4: Send a 1:1 message
Step 5: Add the assistant to the group text
Step 6: Send a group text message
What next?
Group Texting in Conversations

Using Twilio Conversations, you can build rich conversations between more than two parties over multiple channels, such as SMS and Chat.
In high-value interactions, such as buying a house, financial advising, and coordinating deliveries, customers expect communication involving a group of participants to be seamless. Good news! Twilio Conversations natively supports Group MMS for you to build these experiences for your end-users.
In this guide, we'll walk you through creating a Conversation that supports group texting.

What is Group Texting?
Group texting, or more specifically Group MMS, uses the MMS (Multimedia Messaging Service) protocol to exchange ordinary text messages among a group of three or more people, rather than as a one-to-one interaction.
In a Twilio-powered group texting Conversation, all of the Participants are visible, and each Participant can see the author of each message. In other words, each message can be displayed with the person who sent it to the group text. This is the type of functionality that many users already expect from applications such as WhatsApp, Slack, and iMessage.
Even if you have Participants joining across different channels, Twilio Conversations does all of the message routing and media handling.

Leveraging Group MMS in Conversations for group texting
If you're operating in the US or Canada (Group MMS only works on +1 numbers), you can send messages from a projected address to create group texts. This number becomes that Participant's address — the projection of that Participant — into a group MMS Conversation.
You can have the following types of Participants in a group text:
A Participant joining from their native texting experience with a messaging address (their personal mobile number).
A Chat participant, who has a Chat Identity (like a username) and a projected address (Twilio phone number).
An unattached Projected Address (Twilio phone number) with no backing Chat Identity. In this case, the projected address acts like a "gateway" number for a customer to participate in the group text.
(warning)
Warning
Group Texting is only supported on +1 (US+Canada) long code numbers. Toll-free numbers and short codes cannot exchange group texts from Twilio.
(information)
Info
There is a limit of 10 total Participants in a Group MMS Conversation.

Projected Addresses vs. Proxy Addresses
If you have built a one-to-one Conversation (like in our Conversations Quickstart), you are probably familiar with the term proxy address: the Twilio phone number that routes all of the messages to the native SMS conversation. The proxy address "sticks" to the mobile-based participant on SMS. You can think of it as their window into the Conversation, which may include another SMS or Chat participant. Notably, the SMS participant receives all of the messages through one proxy address number and doesn't know how many people it represents.
To set up Group texting with Conversations, you should instead use a projected address to represent every Participant who does not join the Conversation through a native channel such as SMS. You can think of the projected address as the "avatar" of a Chat participant in the MMS conversation. The projected address "sticks" to the Chat participant, so in the group text, every Participant can see who said what by way of the attached phone number. The projected address, often used to represent an employee or company representative, is the number that you might put on your business card, for example.
For example, in the following screenshot, you can see the interaction of three unique Participants:
The first SMS Participant(1), interacting through the native SMS app on their mobile device.
The Projected Address(1), representing a Chat participant.
The second SMS Participant(2), represents a different SMS participant and interacts through the native SMS app on their mobile device.

Expand image
Sharing a Projected Address in group texts
You can share one Projected Address between multiple participants in the group text Conversation and update the backing identity as necessary. This functionality supports use cases such as transferring between support agents representing a business in a group text.
For example, let's say you need to create a group text with one Projected Address that will represent your business, staffed by multiple agents on Chat. In this case, you add a standalone Projected Address as a Participant and update it with the identity of the first agent. Later, when that agent escalates the issue to their supervisor, you update the Projected Address to the supervisor's Chat identity. From the end-user's viewpoint, they are still communicating with the same phone number (Projected Address) that represents your business.
Using standalone Projected Addresses in group texts
A Projected Address that has no backing Chat identity can still be part of your Conversation.
You can use a standalone Projected Address if you want to send and receive messages in the group text Conversation only through the Twilio Conversations REST API. In this case, when you send messages using the REST API, you'll need to specify the projected address itself as the author parameter.

Conversation autocreation with Group Texting
The Conversations API automatically creates a new Conversation when a group message reaches a projected address and there is no existing Conversation with the same group of Participants.
Please see our guide to inbound messaging handling and autocreation in Conversations for more details.
For example, a real estate agent and prospective homebuyer are chatting one-on-one about prospective homes. The homebuyer, wanting to include their partner in the discussion, sends a message to their partner's mobile number as well as the real estate agent, whose avatar in the Conversation is a projected address/Twilio number. No Conversation yet exists between these three numbers, so this creates a new Conversation with all three numbers as separate Participants. In this newly created Conversation, all members see the original message from the homebuyer to the second homebuyer and the real estate agent as the first message.

Walkthrough of two Group Texting examples
Now that we've covered the concepts of group texting, let's take a look at how we'd set it up for two common scenarios.
(information)
Info
Twilio Conversations is built on top of several Twilio products. It may be useful to pull up a document or sticky note to keep track of the various values that you'll need throughout this documentation. For the examples requiring two SMS Participants, we recommend keeping a friend (or just their phone) handy for testing.
Get started: Acquire an MMS-capable Twilio Phone Number
If you haven't already done so, you'll want to purchase a Twilio Phone Number to complete the rest of this guide. If you have a Twilio Phone Number already, you can skip to the next section.
In the Twilio console
, search for and purchase an available phone number capable of sending MMS. This Phone Number will serve as the projected address for the Chat participant.

Expand image

Scenario 1: Set up a group message with one Chat participant and two SMS participants
This is a common scenario in real estate, where the purchase of a single-family home is often a family decision. We will set up group texting for three Participants:
The real estate agent, chatting from within a dedicated real estate customer relations management application.
Homebuyer 1, over SMS.
Homebuyer 2, over SMS.
To do this, you'll need a Twilio Phone Number and you'll need access to the REST API. We have included code samples in supported programming languages, as well as curl and the Twilio CLI, which makes experimenting a snap.
Step 1: Create the Conversation
First, we need to create the Conversation by making a request to the Twilio REST API.
Create a Conversation
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversation() {


 const conversation = await client.conversations.v1.conversations.create({


   friendlyName: "Home-buying journey",


 });





 console.log(conversation.accountSid);


}





createConversation();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "Home-buying journey",


 "unique_name": null,


 "attributes": "{}",


 "date_created": "2020-07-01T22:18:37Z",


 "date_updated": "2020-07-01T22:18:37Z",


 "state": "active",


 "timers": {},


 "bindings": {},


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "participants": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",


   "messages": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",


   "webhooks": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks",


   "export": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Export"


 }


}
Step 2: Add the real estate agent
Now that we have the Conversation, we can add the real estate agent as a Participant. In this guide, we are representing the Chat Participant's messages with the Conversations REST API to get up and running. At the end of this guide, we'll provide links to documentation to get you started on building a custom CRM.
Add a Chat Participant (Real Estate Agent)
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationParticipant() {


 const participant = await client.conversations.v1


   .conversations("ConversationSid")


   .participants.create({


     identity: "realEstateAgent",


     "messagingBinding.projectedAddress": "+15017122661",


   });





 console.log(participant.accountSid);


}





createConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "identity": "realEstateAgent",


 "attributes": "{}",


 "messaging_binding": {


   "type": "sms",


   "projected_address": "+15017122661"


 },


 "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "date_created": "2020-07-01T22:18:37Z",


 "date_updated": "2020-07-01T22:18:37Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}
Step 3: Add the first homebuyer
The Chat participant (the real estate agent) has been added to the Conversation, but it's pretty lonely in there with no clients. Next, we need to add the first homebuyer, who joins via the native texting (SMS) app on their phone.
(information)
Info
You only have to specify the SMS participant's own personal phone number in MessagingBinding.Address. When using group texting, you won't need to specify proxy addresses.
Add an SMS participant (Homebuyer 1)
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationParticipant() {


 const participant = await client.conversations.v1


   .conversations("ConversationSid")


   .participants.create({ "messagingBinding.address": "+15558675310" });





 console.log(participant.accountSid);


}





createConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "identity": null,


 "attributes": "{}",


 "messaging_binding": {


   "type": "sms",


   "address": "+15017122661"


 },


 "role_sid": null,


 "date_created": "2020-07-01T22:18:37Z",


 "date_updated": "2020-07-01T22:18:37Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}
Step 4: Send a 1:1 message
Before our third Participant joins, we can start by sending messages between the two connected Participants. Let's send a message from the agent to the homebuyer using the REST API.
Send a Conversational Message
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationMessage() {


 const message = await client.conversations.v1


   .conversations("ConversationSid")


   .messages.create({


     author: "realEstateAgent",


     body: "Hi there. What did you think of the listing I sent?",


   });





 console.log(message.accountSid);


}





createConversationMessage();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "body": "Hi there. What did you think of the listing I sent?",


 "media": null,


 "author": "realEstateAgent",


 "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "attributes": "{}",


 "date_created": "2020-07-01T22:18:37Z",


 "date_updated": "2020-07-01T22:18:37Z",


 "index": 0,


 "delivery": {


   "total": 2,


   "sent": "all",


   "delivered": "some",


   "read": "some",


   "failed": "none",


   "undelivered": "none"


 },


 "content_sid": null,


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",


   "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"


 }


}
Once the homebuyer receives the message, you'll be able to verify that from the REST API. Using Conversations Webhooks, you can also capture those responses for whatever you need, such as logging or adding helpful chatbots. If you've built an app out of our Chat SDK, you'll get those messages in real time via Twilio's secure WebSocket gateways.
Step 5: Add the second homebuyer to the group text
Now it's time to turn this into a true group texting experience by adding the second homebuyer. Just like when we added the first homebuyer to the Conversation, we'll add the second using a REST API call.
Add a second SMS participant to the group text (Homebuyer 2)
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationParticipant() {


 const participant = await client.conversations.v1


   .conversations("ConversationSid")


   .participants.create({ "messagingBinding.address": "+15558675310" });





 console.log(participant.accountSid);


}





createConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "identity": null,


 "attributes": "{}",


 "messaging_binding": {


   "type": "sms",


   "address": "+15017122661"


 },


 "role_sid": null,


 "date_created": "2020-07-01T22:18:37Z",


 "date_updated": "2020-07-01T22:18:37Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}
Step 6: Send another message
Let's welcome the second homebuyer to the group text with one more message from the real estate agent.
Send a second Conversational Message
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationMessage() {


 const message = await client.conversations.v1


   .conversations("ConversationSid")


   .messages.create({


     author: "realEstateAgent",


     body: "Glad you could join us, homebuyer 2. I really love these granite countertops and think you will as well.",


   });





 console.log(message.accountSid);


}





createConversationMessage();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "body": "Glad you could join us, homebuyer 2. I really love these granite countertops and think you will as well.",


 "media": null,


 "author": "realEstateAgent",


 "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "attributes": "{}",


 "date_created": "2020-07-01T22:18:37Z",


 "date_updated": "2020-07-01T22:18:37Z",


 "index": 0,


 "delivery": {


   "total": 2,


   "sent": "all",


   "delivered": "some",


   "read": "some",


   "failed": "none",


   "undelivered": "none"


 },


 "content_sid": null,


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",


   "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"


 }


}
Now you can see that all three Participants (the real estate agent and the two homebuyers) are part of the Conversation representing our group text. We've been simulating the Chat participant (the real estate agent) using the REST API. However, notice that you and the second homebuyer (or your friend) can use your native texting application to participate in the Conversation as well. The messages flow freely back and forth:

Expand image

Scenario 2: Set up a group message with two Chat and one SMS participants
In the first scenario, we created a group texting Conversation between one real estate agent on Chat participant and two SMS participants.
The second scenario is more common when you have one end-user and two employees, as you may see in financial consultations. For this example, we'll set up a Conversation for:
The financial advisor, joining from a dedicated application built with Chat.
The assistant, also chatting from the same application.
The end-user/client, connecting to the Conversation via SMS.
Because this group text involves two different Chat Participants—the financial advisor and the assistant—we will need two projected addresses, one for each of them. If you haven't already done so, purchase an additional Twilio phone number to use as the second projected address.
Use one projected address to transfer between agents
In this scenario, we include one assistant on Chat, who is represented with a Projected Address in the Conversation. If you need to transfer seamlessly, you can update the Projected Address's backing Chat identity to the new assistant. The end-user/client will consistently see the same Projected Address (Twilio Phone Number), even if the assistant on Chat changes behind the scenes.
Optional: Clean up the first Conversation
If you continue to the second example in this guide, you'll need two Twilio Phone Numbers. To free up the number you've already purchased, we can delete the Conversation from the first example.
Alternatively, you can purchase two new Twilio Phone Numbers to use as projected addresses in this second example.
Delete the Conversation
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function deleteConversation() {


 await client.conversations.v1


   .conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .remove();


}





deleteConversation();
Step 1: Create the Conversation
We'll begin this example by making a request to the Twilio REST API to create a new Conversation for the financial consultation.
Create a Conversation
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversation() {


 const conversation = await client.conversations.v1.conversations.create({


   friendlyName: "Your Wealth Management Options",


 });





 console.log(conversation.accountSid);


}





createConversation();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "Your Wealth Management Options",


 "unique_name": null,


 "attributes": "{}",


 "date_created": "2020-07-01T22:18:37Z",


 "date_updated": "2020-07-01T22:18:37Z",


 "state": "active",


 "timers": {},


 "bindings": {},


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "participants": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",


   "messages": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",


   "webhooks": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks",


   "export": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Export"


 }


}
Step 2: Add the financial advisor
With the Conversation created, we'll next add the financial advisor. This will be a Chat participant, so we need to assign them a projected address. Use one of your Twilio Phone Numbers for this.
Add a Chat Participant (Financial Advisor)
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationParticipant() {


 const participant = await client.conversations.v1


   .conversations("ConversationSid")


   .participants.create({


     identity: "YourFinancialAdvisor",


     "messagingBinding.projectedAddress": "+15017122661",


   });





 console.log(participant.accountSid);


}





createConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "identity": "YourFinancialAdvisor",


 "attributes": "{}",


 "messaging_binding": {


   "type": "sms",


   "projected_address": "+15017122661"


 },


 "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "date_created": "2020-07-01T22:18:37Z",


 "date_updated": "2020-07-01T22:18:37Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}
Step 3: Add the end-user (the advisee) by SMS
In this example, we will be adding the end-user (the client being advised) to the group texting experience by making another REST API call.
Because this Participant is joining via the native SMS experience on their device, we'll use their mobile number as the Messaging Binding Address.
Add an SMS Participant (Advisee)
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationParticipant() {


 const participant = await client.conversations.v1


   .conversations("ConversationSid")


   .participants.create({ "messagingBinding.address": "+141586753093" });





 console.log(participant.accountSid);


}





createConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "identity": null,


 "attributes": "{}",


 "messaging_binding": {


   "type": "sms",


   "address": "+15017122661"


 },


 "role_sid": null,


 "date_created": "2020-07-01T22:18:37Z",


 "date_updated": "2020-07-01T22:18:37Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}
Step 4: Send a 1:1 message
Before we add our third Participant to the Conversation, we can make sure the two Participants are connected. We'll use the Conversations REST API to send a message from the Chat-based Financial Advisor to the SMS-based advisee.
Send a Message to the Conversation
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationMessage() {


 const message = await client.conversations.v1


   .conversations("ConversationSid")


   .messages.create({


     author: "YourFinancialAdvisor",


     body: "Hello, what questions did you have about your portfolio?",


   });





 console.log(message.accountSid);


}





createConversationMessage();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "body": "Hello, what questions did you have about your portfolio?",


 "media": null,


 "author": "YourFinancialAdvisor",


 "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "attributes": "{}",


 "date_created": "2020-07-01T22:18:37Z",


 "date_updated": "2020-07-01T22:18:37Z",


 "index": 0,


 "delivery": {


   "total": 2,


   "sent": "all",


   "delivered": "some",


   "read": "some",


   "failed": "none",


   "undelivered": "none"


 },


 "content_sid": null,


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",


   "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"


 }


}
Step 5: Add the assistant to the group text
It's time to add the assistant to the group text as a Chat participant. Recall that every non-SMS participant needs a projected address to join in on the group texting fun.
(information)
Info
In this case, we're adding the projected address with an attached Chat Participant all at once, but you could also create the Conversation with an unattached or "gateway" projected address. When you're reading for the assistant to jump into the group text, you can update the projected address by attaching the assistant's chat identity.
Add a second Chat Participant (Assistant)
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationParticipant() {


 const participant = await client.conversations.v1


   .conversations("ConversationSid")


   .participants.create({


     identity: "theAssistant",


     "messagingBinding.projectedAddress": "+15017122661",


   });





 console.log(participant.accountSid);


}





createConversationParticipant();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "identity": "theAssistant",


 "attributes": "{}",


 "messaging_binding": {


   "type": "sms",


   "projected_address": "+15017122661"


 },


 "role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "date_created": "2020-07-01T22:18:37Z",


 "date_updated": "2020-07-01T22:18:37Z",


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants/MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "last_read_message_index": null,


 "last_read_timestamp": null


}
Step 6: Send a group text message
Now that all of the Participants are in our Conversation, we'll send one more message, this time from the assistant to the rest of the group.
Send another message to the Conversation
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationMessage() {


 const message = await client.conversations.v1


   .conversations("ConversationSid")


   .messages.create({


     author: "theAssistant",


     body: "I've just emailed you some documents. Could you please review them?",


   });





 console.log(message.accountSid);


}





createConversationMessage();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "body": "I've just emailed you some documents. Could you please review them?",


 "media": null,


 "author": "theAssistant",


 "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "attributes": "{}",


 "date_created": "2020-07-01T22:18:37Z",


 "date_updated": "2020-07-01T22:18:37Z",


 "index": 0,


 "delivery": {


   "total": 2,


   "sent": "all",


   "delivered": "some",


   "read": "some",


   "failed": "none",


   "undelivered": "none"


 },


 "content_sid": null,


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",


   "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"


 }


}
At this point, you should have received a message from two separate Twilio phone numbers, each representing a Chat participant in the group text. It may look like a 1:1 Conversation, but when you send messages back and forth, you can see that all parties are uniquely identified.
Try sending an SMS back from your personal device as the advisee.
Send another message from the Financial Advisor using the REST API to see all three Participants in the Conversation.
Send one more Conversational Message
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function createConversationMessage() {


 const message = await client.conversations.v1


   .conversations("ConversationSid")


   .messages.create({


     author: "YourFinancialAdvisor",


     body: "Excellent. We both look forward to working with you.",


   });





 console.log(message.accountSid);


}





createConversationMessage();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "conversation_sid": "ConversationSid",


 "body": "Excellent. We both look forward to working with you.",


 "media": null,


 "author": "YourFinancialAdvisor",


 "participant_sid": "MBaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "attributes": "{}",


 "date_created": "2020-07-01T22:18:37Z",


 "date_updated": "2020-07-01T22:18:37Z",


 "index": 0,


 "delivery": {


   "total": 2,


   "sent": "all",


   "delivered": "some",


   "read": "some",


   "failed": "none",


   "undelivered": "none"


 },


 "content_sid": null,


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Receipts",


   "channel_metadata": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/IMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/ChannelMetadata"


 }


}

Expand image

What next?
Twilio Conversations' native support of group MMS allows you to create rich, multi-channel interactions with your users. In this guide, we walked through creating two different group texting scenarios with different ratios of SMS and Chat participants using the projected address.
Now that you can create group texting experiences for your customers, you can also take advantage of the other features in Twilio Conversations:
Review how to create 1-1 interactions with the Conversations Quickstart.
Explore the Chat SDKs for building custom applications.
Connect WhatsApp to Conversations.
Configure Webhooks to monitor and modify Conversations.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Group Texting in Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations Fundamentals
Conversations Limits
Media Support in Conversations
Conversations Webhooks
Using WhatsApp with Conversations
Using States and Timers in Conversations
Delivery Receipts in Conversations
Group Texting in Conversations
Inbound Message Handling & Autocreation
Push Notification Configuration for Conversations
Push Notifications on Android for Conversations
Push Notifications on iOS for Conversations
Push Notifications on Web
A2P 10DLC Registration in Conversations
Reachability Indicator
Send Rich Content Messages with Conversations
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Key Principle: the To/From number pair
Conversations vs. Programmable Messaging Inbound
Inbound Autocreation
Settings for enabling Autocreation in Conversations
Webhooks on Autocreation
Guidance for migrating to Conversations with Autocreate
How Group MMS handles inbound messages
Autocreation in Group MMS
What's Next?
Inbound Message Handling & Autocreation

Twilio Conversations is built for two-way messaging, so handling inbound messages is critical for your end-user experience. This guide describes the rules that determine where an inbound message goes, as well as how you can use the Conversations API to change that outcome.

Key Principle: the To/From number pair
In all supported messaging channels (SMS, MMS, WhatsApp), a Participant in a Conversation is defined by their number pair. This is essentially the To/From pair on the Message:
the sender, or From number, corresponds to a MessagingBinding.Address (a consumer's number)
the receiver, or To number, corresponds to a ProxyAddress (a Twilio number)
You can think of a ProxyAddress as a Participant's window into a given Conversation, which may include another SMS or chat Participant. The sender sends Messages from their mobile number to the Twilio number in order to participate in the Conversation. Notably, the SMS Participant receives all of the messages through that one proxy address number, and they don't know how many people it represents.
Note: Only one Conversation — that is, one Participant in an Active Conversation — can bind a number pair together. In other words, a Participant's to/from number pair can only be in one active Conversation at the same time.
Because that number pair is unique, it determines the Conversation where an inbound SMS or WhatsApp Message goes. And this constraint applies to the entire pair, meaning:
The same consumer can be in contact with multiple Twilio numbers (different Participants, and different Conversations). For example, a consumer can be part of different Conversations by binding their personal mobile number to different ProxyAddresses (one ProxyAddress for each Conversation).
The same Twilio number can be in contact with any number of consumers. For example, a single Twilio Proxy number can represent multiple customer service agents, each chatting with different end users in separate Conversations.
Once a Participant is created, that number-pair is bound together until one of the following happens:
that Participant is removed,
the Conversation is deleted, or
the Conversation State is set to closed.

Conversations vs. Programmable Messaging Inbound
If you're already familiar with Twilio Programmable Messaging
, Conversations also uses webhooks to trigger actions. You can use Conversations webhooks to do things like add chatbots, add automatic replies, and implement spam filtering. However, Conversations has one significant difference: it does not send incoming SMS webhooks like Programmable Messaging does. Those webhooks fire independently.
There are two things determining how Conversations handles inbound messages. The first is the "to/from number pair" principle described above.
The second key factor is a rule: If the Message belongs in a Conversation, the Conversation captures it first.
Specifically, if the number-pair matches a Participant in an active Conversation, that Message is delivered to the Conversation. This triggers Conversations Webhooks and commits that Message to the Conversation Messages list. The message will also appear in the Programmable Messaging logs and will be processed as a normal SMS.

Inbound Autocreation

Expand image
A Console redesign is planned to allow selecting both the Programmable Messaging webhook and the Conversations Autocreation feature as per the flowchart above. Currently, you can select only one or the other.
If the Message does not belong to a Conversation, one of two things could happen. Either:
The ordinary Programmable Messaging webhooks are invoked (with the Incoming Message Webhook) or
Conversation Autocreation is invoked
For the second option, you can use the Address Configuration API to enable the Conversation Autocreation feature, or you can set the configuration in your Messaging Service. The latter takes effect for any Message to any numbers in that Messaging Service. For that reason, there's a separate opt-in switch in the Conversations console that you need to "unlock" first.
If the phone number's own webhook is set, it will always fire regardless of whether the number is tied to any Conversation.
Settings for enabling Autocreation in Conversations
You can enable Autocreation through either the Address Configuration API or the Twilio Console.
Enabling Autocreation through the Address Configuration API
You can now use the Address Configuration API to specify which unique address (i.e. WhatsApp or SMS phone number) should enable the Conversations Autocreation feature upon receiving an inbound message, independent of the usage of the Messaging Service. With this API, you can enable and configure inbound messaging for individual addresses to support your use case.
Enabling Autocreation through the Twilio Console
You can also configure Autocreation for your Messaging Service in the Twilio Console so that any Message that does not already belong to a Conversation (as identified by the number-pair) will automatically have one created.
First, in the Messaging Service, the Handle Inbound Messages with Conversations option should be toggled to Unlocked.

Expand image
Second, in the Integration Section of Programmable Messaging in the Console, the Autocreate a Conversation option should be selected. (You can select Autocreate a Conversation only if the Handle Inbound Messages with Conversations toggle is set to Unlocked.)

Expand image
Make sure to click Save to implement your changes!
(warning)
Warning
After enabling or disabling Autocreation in the Twilio Console, your changes may take up to 60 seconds to take effect. During these 60 seconds, the previous setting will be in effect.
Webhooks on Autocreation
Autocreation creates several resources in rapid succession, all of which produce webhooks:
onConversationAdd (pre-action webhook) will fire, containing the Message body and the complete number pair. You can either accept this Conversation (triggering the remaining webhooks) or reject this request to prevent Conversation autocreation. If you reject this, the Message will be dropped, as specified for this webhook.

Expand image
If your server code responds with 200 OK:
onConversationAdded will fire, indicating the successful creation of a new Conversation.
onParticipantAdded will fire, describing the number pair above.
onMessageAdded will fire, describing the Message body.
Note: onParticipantAdd and onMessageAdddo not fire during autocreation. The only opportunity to reject this Message is upon the creation of the Conversation itself. In other words, with Autocreation enabled, you can only reject a Conversation Message by stopping the entire creation of the Conversation.
(information)
Info
Webhooks will not fire if you disable them globally or at the service level. If a webhook is not firing as expected, check your Webhook Filtering settings in the Twilio Console at the global level or Conversation Service level to make sure that the relevant webhooks are enabled.
Example: How Webhooks and Conversation Participants interact
Let's say that you have already purchased a Twilio Phone Number and have set up the incoming SMS URL to point to your web application, as described in the SMS documentation. At this point, when you receive incoming SMS Messages on your Twilio Phone Number, Twilio will send a request to the webhook URL that you specified.
Next, suppose you create a Conversation Participant (with a to/from number pair, as described above) that binds a mobile number A to your Twilio Phone Number. That particular to/from number pair (and only that pair) is now bound to Conversations, but Messages from any other mobile numbers (B, C, D) remain unbound and continue to trigger webhooks to the SMS URL that you set above.
Effectively, you've moved a single relationship (mobile number A to your Twilio Phone Number) onto Conversations, but the rest of your customers (mobile numbers B, C, and D) remain on the pre-established setup.
As soon as you delete that Conversation Participant (mobile number A and Twilio Phone number), you start getting incoming SMS webhooks again, rather than having the Messages routed to Conversations.
Guidance for migrating to Conversations with Autocreate
With Twilio Conversations, you can automatically create new Conversations for inbound messages. If you are already using Programmable Messaging to process inbound messages, we recommend that your switch to Conversations follow the following pattern.
1. Create Conversations explicitly via REST
Initially, you should leave Autocreate disabled and migrate one Conversation at a time, creating those Conversations using the Conversations REST API. The rules described above work in your favor here: Your existing Programmable Messaging logic (i.e., your incoming SMS webhook) will hold for all inbound Messages except those for which you create a Conversation Participant that binds to that number pair.
By doing this, you can test your logic on individual Conversations, which likely means one consumer-agent relationship at a time. Those migrated Conversations immediately receive full support from the browser and mobile SDKs, and Conversations webhooks fire specifically for those Conversations. This keeps risk low while you explore and develop.
2. Start with an empty Messaging Service, then enable Autocreation
Usually, to handle inbound Messages in customer service use-cases (where consumers reach out unsolicited), you'll want to enable Autocreation. In order to mitigate risk while migrating from Programmable Messaging, we recommend starting from an empty Messaging Service, i.e. remove all Senders from the Conversations Messaging Service. After doing so, it will be safe to enable Autocreation for Conversations.
With an empty Messaging Service sender pool attached to a Conversation, you can enable Autocreate without affecting your existing SMS applications and Phone Number webhook logic.
3. Migrate one Phone Number at a Time
At this point, your logic is in place, so you can begin moving over Phone Numbers to your Conversations Messaging Service slowly, ensuring that the logic is correct.
One at a time, add your Twilio Phone Numbers to the Conversations Messaging Service. Autocreate will immediately take hold for those numbers that you add to the sender pool — and only those numbers. We recommend observing and spot-testing between the first migrations, looking for any incidental errors.
4. Use the REST API to complete the migration
Once it's clear that no bugs are emerging, you can accelerate your migration by using the Messaging Service REST API to add phone numbers to your Messaging Service from a script. Once all the numbers are on the Messaging Service, Autocreation applies immediately to the full set of numbers in the Service's Sender Pool.

How Group MMS handles inbound messages
If you're using our public-beta Group MMS support (from the US or Canada) the same rules apply as above: if the Message is destined for a Conversation, the Conversations API will deliver it to the correct Conversation, as well as fire the appropriate webhooks.
Otherwise, as above, either inbound Autocreation or ordinary (non-Conversations) Programmable Messaging webhooks take hold. (Note that Twilio Programmable Messaging does not support Group MMS). The switch to enable Autocreation for Group MMS is exactly the same.
Autocreation in Group MMS
However, there are a few differences in inbound handling and Autocreation for Group MMS.
The "Number Pair" becomes the "Number Group"
When managing 1:1 Conversations, it generally makes sense to use Address+ProxyAddress number pairs, with both numbers (the Twilio Phone Number and the personal mobile number) assigned to the SMS Participant in question. This is what we saw above.
In Group MMS Conversations, Participants look different:
Participants on SMS only have Address (noProxyAddress).
Application-side Participants ("chat" Participants) will have a ProjectedAddress.
You may have up to twenty (20) total Addresses and ProjectedAddresses in a Group MMS Conversation.
Therefore, for Group MMS, the "number pair" principle described above no longer applies. Instead, the inbound target of a Group MMS Message is the "number group." To arrive at a Conversation, the sorted set of all senders (From=) and receivers (To=) on the Message must match the sorted set of Addresses and ProjectedAddresses on some existing Conversation.
Autocreation Webhooks for Group Texts
When autocreating a Group MMS Conversation, the order of webhooks has two important nuances:
First, onConversationAdd contains a complete list of all Participants across MessagingBinding.Address (the receivers) and MessagingBinding.AuthorAddress (the sender).
Second, the state of the Conversation remains at initializing — meaning that the Conversation cannot be changed except to accept or reject changes — until the onConversationStateUpdated webhook indicates that all the resources have been created.

What's Next?
With inbound message handling and autocreation, you can create seamless conversational messaging for your end users. Check out some of our other resources to continue building with Twilio Conversations:
Group Texting in Conversations
Migrating to Conversations from Programmable Chat
Using WhatsApp with Conversations

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Inbound Message Handling & Autocreation | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations Fundamentals
Conversations Limits
Media Support in Conversations
Conversations Webhooks
Using WhatsApp with Conversations
Using States and Timers in Conversations
Delivery Receipts in Conversations
Group Texting in Conversations
Inbound Message Handling & Autocreation
Push Notification Configuration for Conversations
Push Notifications on Android for Conversations
Push Notifications on iOS for Conversations
Push Notifications on Web
A2P 10DLC Registration in Conversations
Reachability Indicator
Send Rich Content Messages with Conversations
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Push Notification Types
Push Notification Templates
Template Variables
Default Templates
Configure Push Notifications
Badge Count
Push Notification Configuration for Conversations

Using push notifications with your Conversations implementation drives your customers to re-engage with your app. With Twilio Conversations, you can configure pushes for:
New Messages
New Media Messages (new since October 2021)
Conversations you've joined
Conversations you've left
Conversations integrates Apple Push Notifications (iOS) and Firebase Cloud Messaging (Android and browsers) using the Push credentials configured on your Twilio account. The content and payload of your push notifications will be different depending on the event that precipitates them.
Conversations Service instances provide some configuration options that allow push notification configuration on a per Service instance basis. These options allow for:
Selecting which of the eligible Conversations events should trigger push notifications
Specifying the payload template for each message type (overriding the default template)
Table of Contents
Push Notification Types
Push Notification Templates
Configuring Push Notifications

Push Notification Types
The following push notifications can be configured for a Conversations Service instance:
Push Notification Type
Description
New Message
This is sent to each chat participant in a Conversation whenever a new Message is posted.
New Media Message
This is sent to each chat participant in a Conversation whenever a new message is posted with Media (instead of text).
Added to Conversation
This is sent to chat participants that have been added to a Conversation
Removed from Conversation
This is sent to chat participants that have been removed from a Conversation

(information)
Info
The default enabled flag for new Service instances for all push notifications is false. This means that push notifications will be disabled until you explicitly set the flag to true.

Push Notification Templates
Each of the push notification types has a default template for the payload (or notification body). Each of these templates can be overridden per Service instance via the push notification configuration. The templating employs markup for a limited set of variables:
Template Variables
Template Variable
Description
${PARTICIPANT}
Will be replaced with the FriendlyName of the Participant's underlying User who triggered the push notification (if any). The User's Identity will be used if no FriendlyName has been set. For Proxy Participants engaged via a non-chat channel, the MessagingBinding.Address will be used instead. When group texting, the MessagingBinding.Address will be used, or the MessagingBinding.ProjectedAddress if the Participant uses a Twilio phone number and has no underlying User.
${PARTICIPANT_FRIENDLY_NAME}
Synonym of ${PARTICIPANT}.
${PARTICIPANT_IDENTITY}
Synonym of ${PARTICIPANT}.
${PARTICIPANT_SID}
Will be replaced with the Sid of the Participant who triggered the push notification (if any). The Participant's Identity will be used if no Sid is available.
${CONVERSATION}
Will be replaced with the UniqueName, FriendlyName or ConversationSid (if they exist, in that order of priority). These properties are tied to the Conversation related to the push notification.
${CONVERSATION_FRIENDLY_NAME}
Will be replaced with the FriendlyName, UniqueName or ConversationSid (if they exist, in that order of priority). These properties are tied to the Conversation related to the push notification.
${CONVERSATION_SID}
Will be replaced with the ConversationSid. This property is tied to the Conversation related to the push notification.
${CONVERSATION_UNIQUE_NAME}
Will be replaced with the UniqueName, or the FriendlyName, or ConversationSid (in that order) of the conversation to which this push pertains.
${MESSAGE}
Will be replaced with the body of the actual Message. Only used for notifications of type: New Message
${MEDIA_COUNT}
Sent exclusively for New Media Message pushes; counts the number of media files included. Presently, this will never be higher than 1; support for multiple media on the same message is coming soon.
${MEDIA}
Sent exclusively for New Media Message pushes; presents the filename of the first media attached to the message.

(information)
Info
The maximum length of the entire notification payload is 178 characters. This limit is applied after the notification payload is constructed and the variable data is applied. Thus, freeform text and the variable data are compiled into a string and the first 178 characters are then used as the notification payload.
(information)
Info
Variables can be used multiple times within a template, but each variable will contribute to the maximum number of available characters.
Default Templates
Push Notification Type
Default Template
New Message
${CONVERSATION}:${PARTICIPANT}: ${MESSAGE}
New Media Message
You have a new message in ${CONVERSATION} with ${MEDIA_COUNT} media files: ${MEDIA}
Added to Conversation
You have been added to the conversation ${CONVERSATION} by ${PARTICIPANT}
Removed from Conversation
${PARTICIPANT} has removed you from the conversation ${CONVERSATION}


Configure Push Notifications
Each push notification type can be configured for a Service instance. The configuration allows each notification type to be enabled or disabled. This also handles custom template configuration as per the templating mechanism described above.
The following are the eligible notification type names:
NewMessage
AddedToConversation
RemovedFromConversation
The following are the configuration parameters used:
parameter name
description
[type].Enabled
Set true to send this type of push notification. Default: false
[type].Template
The customer template string for the notification type.
[type].Sound
The sound push payload parameter that will be set for this notification type, appropriately to the target platform.
NewMessage.BadgeCountEnabled
true if the NewMessage notification type should send a badge count value in the push payload. This parameter is only applicable to the NewMessage type. This is currently only used by the iOS APNS push notification type.
NewMessage.WithMedia.Enabled
Set true to send pushes for media messages. Default: false.
NewMessage.WithMedia.Template
A specific template for new media message pushes, different and independent of NewMessage.Template.

Badge Count
Badge count refers to a counter on an app's icon that displays how many unread notifications there are for that app. Currently, only APNS push notifications for iOS will use this and include the badge property in the payload.
The badge count setting applies only to the NewMessage notification type. If enabled, the value of this property will represent the count of one-to-one Conversations the User participates in where there are unread Messages for the User.
If NewMessage.BadgeCountEnabled is set to true, decrements to the count of Conversations with unread messages will be sent to all registered iOS endpoints for that User.
Configure New Message Push Notifications
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateServiceNotification() {


 const notification = await client.conversations.v1


   .services("ISXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .configuration.notifications()


   .update({


     "addedToConversation.enabled": true,


     "addedToConversation.sound": "default",


     "addedToConversation.template":


       "There is a new message in ${CONVERSATION} from ${PARTICIPANT}: ${MESSAGE}",


   });





 console.log(notification.addedToConversation);


}





updateServiceNotification();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "log_enabled": true,


 "added_to_conversation": {


   "enabled": false,


   "template": "You have been added to a Conversation: ${CONVERSATION}",


   "sound": "ring"


 },


 "new_message": {


   "enabled": false,


   "template": "You have a new message in ${CONVERSATION} from ${PARTICIPANT}: ${MESSAGE}",


   "badge_count_enabled": true,


   "sound": "ring",


   "with_media": {


     "enabled": false,


     "template": "You have a new message in ${CONVERSATION} with ${MEDIA_COUNT} media files: ${MEDIA}"


   }


 },


 "removed_from_conversation": {


   "enabled": false,


   "template": "You have been removed from a Conversation: ${CONVERSATION}",


   "sound": "ring"


 },


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Configuration/Notifications"


}
Enable Media Pushes
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateServiceNotification() {


 const notification = await client.conversations.v1


   .services("ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


   .configuration.notifications()


   .update({


     "newMessage.withMedia.enabled": true,


     "newMessage.withMedia.template":


       "${PARTICIPANT} sent you a file: ${MEDIA}",


   });





 console.log(notification.newMessage);


}





updateServiceNotification();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "log_enabled": true,


 "added_to_conversation": {


   "enabled": false,


   "template": "You have been added to a Conversation: ${CONVERSATION}",


   "sound": "ring"


 },


 "new_message": {


   "enabled": false,


   "template": "You have a new message in ${CONVERSATION} from ${PARTICIPANT}: ${MESSAGE}",


   "badge_count_enabled": true,


   "sound": "ring",


   "with_media": {


     "enabled": false,


     "template": "You have a new message in ${CONVERSATION} with ${MEDIA_COUNT} media files: ${MEDIA}"


   }


 },


 "removed_from_conversation": {


   "enabled": false,


   "template": "You have been removed from a Conversation: ${CONVERSATION}",


   "sound": "ring"


 },


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Configuration/Notifications"


}
Setting additional notification types requires including them in your configuration request. For instance, to include the AddedToConversation push notification type, you can add the following 3 rows to your curl request.
Copy code block
'AddedToConversation.Enabled=true'


'AddedToConversation.Template=You are now a participant of ${CONVERSATION}!  Added by ${PARTICIPANT}'


'AddedToConversation.Sound=default'

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Push Notification Configuration for Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations Fundamentals
Conversations Limits
Media Support in Conversations
Conversations Webhooks
Using WhatsApp with Conversations
Using States and Timers in Conversations
Delivery Receipts in Conversations
Group Texting in Conversations
Inbound Message Handling & Autocreation
Push Notification Configuration for Conversations
Push Notifications on Android for Conversations
Push Notifications on iOS for Conversations
Push Notifications on Web
A2P 10DLC Registration in Conversations
Reachability Indicator
Send Rich Content Messages with Conversations
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Step 1: Enable push notifications for your Service instance
Step 2: Create a configuration file
Step 3: Set up your Android app with Firebase
Step 4: Add Firebase Cloud Messaging to your Android application
Step 5: Upload your API Key to Twilio
Step 6: Pass the Push Credential Sid in your Access Token
Step 7: Use the Registration API in the Twilio ConversationsClient
Push Notifications on Android for Conversations

Your end users can get push notifications when another participant in a conversation sends a message, joins the conversation, or leaves the conversation. You can configure which of these events send push notifications, as well as the message template used and any sound that plays.
Twilio uses the Firebase Cloud Messaging (FCM) service to send push notifications. You need to set up your Android app to use push notifications if you have not done so already. You also need to share an FCM API key with Twilio so that push notifications can be sent to your application.

Step 1: Enable push notifications for your Service instance
IMPORTANT: The default enabled flag for new Service instances for all Push Notifications is false. This means that push notifications will be disabled until you explicitly enable them. Follow this guide to do so.

Step 2: Create a configuration file
The Firebase Cloud Messaging (FCM) library looks for a file named google-services.json in your Android app to identify push configuration details. Google provides a web interface for generating this file that you can find in the Firebase Console
.
Copy the google-services.json file you download in the step below into the app/ directory of your Android Studio project.

Expand image
Once you've entered your app credentials, you can download the generated file to your desktop. Save the API Key that is displayed on the last page, as you will need it in a later step.

Step 3: Set up your Android app with Firebase
As the version numbers for the Firebase libraries are always changing, please refer to the Add Firebase to your Android project
 documentation guide for setup instructions. You can add Firebase manually to Gradle, or use the Firebase Assistant in the Android Studio IDE.

Step 4: Add Firebase Cloud Messaging to your Android application
Adding Firebase Cloud Messaging is described in the Set up a Firebase Cloud Messaging client app on Android
 guide on the Firebase site. Be sure to add the com.google.firebase:firebase-messaging library to your dependencies.
Be sure to follow the steps to modify the app's AndroidManifest.xml file, and add the Java or Kotlin code to Access the device token
. You will need to send that device token to Twilio, which we describe in a later step of this guide.
As a quick check at this point, you can send a push notification through Firebase Cloud Messaging to your app using the Firebase Web Console. Verify that you have Firebase Cloud Messaging working correctly with your server and that you can retrieve a device token before proceeding with the Twilio integration steps in this guide.

Step 5: Upload your API Key to Twilio
Now that you have your app configured to receive push notifications, upload your API Key by creating a Credential resource. Visit the Push Credentials Creation
 page to generate a FCM credential SID using the API key. You can also get to the Credentials page by clicking on the Account dropdown in the top left corner of the Twilio Console and then clicking on Credentials from the dropdown Account menu. Once on the Credentials page, click the Push Credentials tab.
On the Push Credentials Page, create a new Push Credential. Give the credential a name and make sure the credential's type is "FCM Push Credentials". Under "FCM Secret", paste your API Key from the end of Step 2. Then, click Create.
The next screen you see after creating the credential includes the new push credential's SID. Keep that credential SID handy for the next step.

Step 6: Pass the Push Credential Sid in your Access Token
For this step, you will modify your server application to add the push credential SID from the previous step into your server's Access Token generation.
Your Access Token needs to include the Push Credential SID that you got in Step 5. See below for examples in each Twilio Helper Library of how to generate an Access Token with a ChatGrant that contains a Push Credential SID.
Creating an Access Token (Chat) with Push Credentials
Node.jsPythonC#JavaGoPHPRuby
Report code block
Copy code block
const AccessToken = require('twilio').jwt.AccessToken;


const ChatGrant = AccessToken.ChatGrant;





// Used when generating any kind of tokens


// To set up environmental variables, see http://twil.io/secure


const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;


const twilioApiKey = process.env.TWILIO_API_KEY;


const twilioApiSecret = process.env.TWILIO_API_SECRET;





// Used specifically for creating Chat tokens


const serviceSid = process.env.TWILIO_CHAT_SERVICE_SID;


const pushCredentialSid = process.env.TWILIO_PUSH_CREDENTIAL_SID;


const identity = 'user@example.com';





// Create a "grant" which enables a client to use Chat as a given user,


// on a given device


const chatGrant = new ChatGrant({


 serviceSid: serviceSid,


 push_credential_sid: pushCredentialSid


});





// Create an access token which we will sign and return to the client,


// containing the grant we just created


const token = new AccessToken(


 twilioAccountSid,


 twilioApiKey,


 twilioApiSecret,


 {identity: identity}


);





token.addGrant(chatGrant);





// Serialize the token to a JWT string


console.log(token.toJwt());

Step 7: Use the Registration API in the Twilio ConversationsClient
You will need to call the ConversationsClient API methods, registerFCMToken and unregisterFCMToken, to send the individual Android device's FCM token to Twilio, so that Twilio can send push notifications to the right device. See the Twilio Conversations Android SDK documentation
 for details.
Nice! That's all you need to do to make sure the Conversations Client can use Firebase Cloud Messaging to send push notifications.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Push Notifications on Android for Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations Fundamentals
Conversations Limits
Media Support in Conversations
Conversations Webhooks
Using WhatsApp with Conversations
Using States and Timers in Conversations
Delivery Receipts in Conversations
Group Texting in Conversations
Inbound Message Handling & Autocreation
Push Notification Configuration for Conversations
Push Notifications on Android for Conversations
Push Notifications on iOS for Conversations
Push Notifications on Web
A2P 10DLC Registration in Conversations
Reachability Indicator
Send Rich Content Messages with Conversations
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Enable push notifications for your Service instance
Managing your push credentials
Provisioning Apple Developer credentials for APN Pushes
Integrating Push Notifications
Receiving Notifications
Integration upon client startup
Update badge count
Push Notifications on iOS for Conversations

Your iOS app users can receive push notifications from Twilio Conversations when important events occur, such as a new message in the conversation.
You will need to do some configuration and integration to get push notifications working with your app, and this guide will walk you through the necessary steps:
Your Twilio Conversations Service
The Apple Push Notification Service credential
Your Conversations Access Token server
Your iOS application

Enable push notifications for your Service instance
IMPORTANT: The default enabled flag for new Service instances for all Push Notifications is false. This means that Push will be disabled until you explicitly enable it. To do so, please follow our Push Notification Configuration Guide.
Note: You will need to configure the sound setting value for each push notification type you want the sound payload parameter to present for, with required value. More information can be found in the previously mentioned Push Notification Configuration Guide.

Managing your push credentials
Managing your push credentials will be necessary, as your device token is required for the Conversations SDK to be able to send any notifications through APNS. Let's go through the process of managing your push credentials.
Your iOS project's AppDelegate class contains a series of application lifecycle methods. These methods include event listeners such as your app moving to the background or foreground.
When working with push notifications in your iOS application, it is quite likely you will find yourself needing to process push registrations or received events prior to the initialization of your Conversations client. For this reason, we recommend you create a spot to store any registrations or push messages your application receives prior to the client being fully initialized.
The best option for this is to store the registrations or push messages in an instance of a helper class. This way, your Conversations client can process these values post-initialization if necessary or real-time otherwise. If you are doing a quick proof of concept, you could even define these on the application delegate itself but we recommend you refrain from doing this as storing state on the application delegate is not considered a best practice on iOS.
We will assume that you have defined the following properties in a way that makes them accessible to your application delegate method and Conversations client initialization:
Conversations Push State Variables
Objective-CSwift
Report code block
Copy code block
@property (nonatomic, strong) NSData *updatedPushToken;


@property (nonatomic, strong) NSDictionary *receivedNotification;


@property (nonatomic, strong) TwilioConversationsClient *conversationsClient;
Your users can choose to authorize notifications or not - if they have authorized notifications, you can register the application for remote notifications from Twilio. Typically, you would do this in AppDelegate.swift in the didFinishLaunchingWithOptions function.
User Notification Settings
Objective-CSwift
Report code block
Copy code block
// Add this to the didFinishLaunchingWithOptions function or a similar place


// once you get granted permissions


UNUserNotificationCenter *currentNotificationCenter = [UNUserNotificationCenter currentNotificationCenter];


[currentNotificationCenter getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings *settings) {


   if (settings.authorizationStatus == UNAuthorizationStatusAuthorized) {


       [UIApplication.sharedApplication registerForRemoteNotifications];


   }


}];
After successfully registering for remote notifications, the Apple Push Notification Service (APNS) will send back a unique device token that identifies this app installation on this device. The Twilio Conversations Client will take that device token (as a Data object), and pass it to Twilio's servers to use to send push notifications to this device.
Store Registration
Objective-CSwift
Report code block
Copy code block
- (void)application:(UIApplication*)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData*)deviceToken {


   if (self.conversationsClient && self.conversationsClient.user) {


       [self.conversationsClient registerWithNotificationToken:deviceToken


                                           completion:^(TCHResult *result) {


                                               if (![result isSuccessful]) {


                                                   // try registration again or verify token


                                               }


                                           }];


   } else {


       self.updatedPushToken = deviceToken;


   }


}





- (void)application:(UIApplication*)application didFailToRegisterForRemoteNotificationsWithError:(NSError*)error {


   NSLog(@"Failed to get token, error: %@", error);


   self.updatedPushToken = nil;


}
We print an error if it fails, but if it succeeds, we either update the Conversations client directly or save the token for later use.

Provisioning Apple Developer credentials for APN Pushes
Make sure you have created an "Apple Push Notification service SSL (Sandbox & Production)" certificate on the Apple Developer Portal
 for your application first.
We're going to need to export both a certificate and a private key from Keychain Access:
Start the "Keychain Access" application on your Mac
Pick the "My Certificates" Category in the left hand sidebar
Right-click the "Apple Development iOS Push Services" certificate for your application's bundle identifier
In the popup menu choose "Export…"
Save it as "cred.p12" without protecting it with password (leave the password blank)
Extract the certificate from "cred.p12" into a "cert.pem" file - run the following command in terminal:
Copy code block
openssl pkcs12 -in cred.p12 -nokeys -out cert.pem -nodes
In the cert.pem file, strip anything outside of "-----BEGIN CERTIFICATE-----" and "-----END CERTIFICATE-----" boundaries, such as the "Bag Attributes"
Extract your private key from the "cred.p12" (PKCS#12) into the "key.pem" (PKCS#1) file using the following command in terminal
Copy code block
openssl pkcs12 -in cred.p12 -nocerts -out key.pem -nodes
The resulting file should contain "-----BEGIN RSA PRIVATE KEY-----". If the file contains "-----BEGIN PRIVATE KEY-----" and run the following command:
Copy code block
openssl rsa -in key.pem -out key.pem
Strip anything outside of "-----BEGIN RSA PRIVATE KEY-----" and "-----END RSA PRIVATE KEY-----" boundaries and upload your credentials into the Twilio Platform through the Console.
To store your Credential, visit your Credentials Page
 and click on the Create New Credential button.
The Credential SID for your new Credential is in the detail page labeled 'Credential SID.'
When you create your access token for the iOS clients, be sure to add your credential SID to the chat grant.
Each of the Twilio Helper Libraries makes provisions to add the push_credential_sid. Please see the relevant documentation for your preferred Helper Library for details.
Copy code block
var chatGrant = new ChatGrant({


   serviceSid: ChatServiceSid,


   pushCredentialSid: APNCredentialSid,


});
This is all of the integration you need on the server side to make push notifications work with Twilio Conversations. The next step is to set up your iOS application.

Integrating Push Notifications
Let's go through the process for integrating push notifications into your iOS app.
The AppDelegate class contains a series of application lifecycle methods. Many important events that occur like your app moving to the background or foreground have event listeners in this class. One of those is the applicationDidFinishLaunchingWithOptions method.
Did Finish Launching
Objective-CSwift
Report code block
Copy code block
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
In this method, we're going to want to integrate push notifications for our app
Notification Types
Objective-CSwift
Report code block
Copy code block
UNUserNotificationCenter *currentNotificationCenter = [UNUserNotificationCenter currentNotificationCenter];


[currentCenter requestAuthorizationWithOptions:UNAuthorizationOptionBadge | UNAuthorizationOptionAlert | UNAuthorizationOptionSound


                               completionHandler:^(BOOL granted, NSError *error) {


   // Add here your handling of granted or not granted permissions


}];


currentNotificationCenter.delegate = self;
The above code snippet asks the user's permission for notifications, and if granted, registers for remote (push) notifications. That's it! We're now registered for notifications.

Receiving Notifications
Receiving notifications in our app lets us react to whatever event just occurred. It can trigger our app to update a view, change a status, or even send data to a server. Whenever the app receives a notification, the method didReceiveRemoteNotification is fired
Did Receive Notification
Objective-CSwift
Report code block
Copy code block
// Do not forget to set up a delegate for UNUserNotificationCenter


- (void)userNotificationCenter:(UNUserNotificationCenter *)center


didReceiveNotificationResponse:(UNNotificationResponse *)response


        withCompletionHandler:(void (^)(void))completionHandler {


   NSDictionary *userInfo = response.notification.request.content.userInfo;


   // If your application supports multiple types of push notifications, 


   // you may wish to limit which ones you send to the TwilioConversationsClient here


   if (self.conversationsClient) {


       // If your reference to the Conversations client exists and is initialized, 


       // send the notification to it


       [self.conversationsClient handleNotification:userInfo completion:^(TCHResult *result) {


           if (![result isSuccessful]) {


               // Handling of notification was not successful, retry?


           }


       }];


   } else {


        // Store the notification for later handling


        self.receivedNotification = userInfo;


    }


}
We will pass the notification directly on to the Conversations client if it is initialized or store the event for later processing if not.
The userInfo parameter contains the data that the notification passes in from APNS. We can update our Conversations client by passing it into the singleton via the receivedNotification method. The manager wraps the Conversations client methods that process the notifications appropriately.

Integration upon client startup
Once your Conversations client is up and available, you can provide the push token your application received:
Register Notifications
Objective-CSwift
Report code block
Copy code block
if (self.updatedPushToken) {


   [self.conversationsClient registerWithNotificationToken:self.updatedPushToken


                                                completion:^(TCHResult *result) {


       if (![result isSuccessful]) {


           // try registration again or verify token


       }


   }];


}





if (self.receivedNotification) {


   [self.conversationsClient handleNotification:self.receivedNotification


                                     completion:^(TCHResult *result) {


       if (![result isSuccessful]) {


           // Handling of notification was not successful, retry?


       }


   }];


}

Update badge count
To update badge count on an application icon, you should pass badge count from the Conversations Client delegate to the application:
Update Badge Count
Objective-CSwift
Report code block
Copy code block
- (void)conversationsClient:(TwilioConversationsClient *)client notificationUpdatedBadgeCount:(NSUInteger)badgeCount {


   [UIApplication.currentApplication setApplicationIconBadgeNumber:badgeCount];


}

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Push Notifications on iOS for Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations Fundamentals
Conversations Limits
Media Support in Conversations
Conversations Webhooks
Using WhatsApp with Conversations
Using States and Timers in Conversations
Delivery Receipts in Conversations
Group Texting in Conversations
Inbound Message Handling & Autocreation
Push Notification Configuration for Conversations
Push Notifications on Android for Conversations
Push Notifications on iOS for Conversations
Push Notifications on Web
A2P 10DLC Registration in Conversations
Reachability Indicator
Send Rich Content Messages with Conversations
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Push Notifications on the Web
Step 1 - Enable push notifications for your Service instance
Step 2 - Configure Firebase
Create a project on Firebase
Get the project's configuration
Step 3 - Upload your API Key to Twilio
Step 4 - Pass the API Credential Sid in your Access Token
Step 5 - Initialize Firebase in your web app
Step 6 - Request push permissions from the user and get your FCM token
Step 7 - Pass the FCM token to the Conversations JS SDK and register an event listener for new push arrival
Push Notifications on the Web for Conversations

Push Notifications on the Web
Push notifications are an important part of the web experience. Users have grown accustomed to push notifications being part of virtually every app that they use. The Twilio Conversations JavaScript SDK can integrate Firebase Cloud Messaging (FCM) for push notifications.
Managing your push credentials is necessary, as your registration token is required for the Conversations SDK to be able to send any notifications through FCM. Let's go through the process of managing your push credentials.

Step 1 - Enable push notifications for your Service instance
The default enabled flag for new Service instances for all Push Notifications is false. This means that Push will be disabled until you explicitly enable it. You can follow this guide to do so.

Step 2 - Configure Firebase
The developer must configure Firebase Cloud Messaging (FCM) before configuring notifications. Google provides a Firebase Console
 to manage Firebase services and configurations.
Create a project on Firebase
To use push notifications for your JavaScript app, you will need to create a project on the Firebase Console
:

Expand image
Get the project's configuration
The Firebase Cloud Messaging (FCM) requires configuration to initialize. The Firebase console has a way to create this configuration.
After you create a Firebase project, you can select the option to add Firebase to your web app. From the project overview page, under the text "Get started by adding Firebase to your app", select the Web icon.

Expand image
As a next step, register your app. Give the app a nickname and click the Register app button.

Expand image
Once the app is registered, a customized code snippet will be displayed.

Expand image
This dialog contains sample JavaScript code with filled-in parameters that you can use in your newly created project.
Save this sample code with configuration - we will use it later in this guide.

Step 3 - Upload your API Key to Twilio
Now that we have our app configured to receive push notifications, let's upload our API Key by creating a Credential resource. Check out the Credentials page in the Twilio console
 page to generate a credential SID using your API key. Click the Create button.

Expand image

Step 4 - Pass the API Credential Sid in your Access Token
This step is to ensure that your Conversations JS SDK client Access Token includes the correct credential_sid - the one you created in Step 3 above. Each of the Twilio Helper Libraries enables you to add the push_credential_sid. You can see the relevant documentation for your preferred Helper Library for the details. Here is an example using the Node.js Twilio helper Library:
Copy code block
const chatGrant = new ChatGrant({ 


serviceSid: ConversationServiceSid, 


pushCredentialSid: FCM_Credential_Sid 


});



Step 5 - Initialize Firebase in your web app
Now it's time to initialize the Firebase with the sample code from Step 2 above.
In your web app's early initialization sequence, use the sample code (and do not forget to include/import the Firebase library provided by Google). We recommend including an additional check for the correct import of the Firebase libraries.
Copy code block
 // Initialize Firebase


 var config = {


   apiKey: "...",


   authDomain: "...",


   projectId: "...",


   storageBucket: "...",


   messagingSenderId: "...",


   appId: "..."


 };


 if (firebase) {


   firebase.initializeApp(config);


 }

Step 6 - Request push permissions from the user and get your FCM token
In this step, we are requesting permission from the user to subscribe to and to display notifications. We recommend adding checks for the correct initialization of Firebase.
Copy code block
if (firebase && firebase.messaging()) {


     // requesting permission to use push notifications


     firebase.messaging().requestPermission().then(() => {


       // getting FCM token


       firebase.messaging().getToken().then((fcmToken) => {


         // continue with Step 7 here 


         // ... 


         // ... 


       }).catch((err) => {


         // can't get token


       });


     }).catch((err) => {


       // can't request permission or permission hasn't been granted to the web app by the user


     });


   } else {


     // no Firebase library imported or Firebase library wasn't correctly initialized


   }

Step 7 - Pass the FCM token to the Conversations JS SDK and register an event listener for new push arrival
If you got to this step, then you have Firebase correctly configured and an FCM token ready to be registered with Conversations SDK.
This step assumes that you have Conversation's Client created with the correct Access Token from Step 4.
Copy code block
// passing FCM token to the `conversationClientInstance` to register for push notifications


conversationClientInstance.setPushRegistrationId('fcm', fcmToken);





// registering event listener on new message from Firebase to pass it to the Conversations SDK for parsing


firebase.messaging().onMessage(payload => {


   conversationClientInstance.handlePushNotification(payload);


});

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Push Notifications on the Web for Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations Fundamentals
Conversations Limits
Media Support in Conversations
Conversations Webhooks
Using WhatsApp with Conversations
Using States and Timers in Conversations
Delivery Receipts in Conversations
Group Texting in Conversations
Inbound Message Handling & Autocreation
Push Notification Configuration for Conversations
Push Notifications on Android for Conversations
Push Notifications on iOS for Conversations
Push Notifications on Web
A2P 10DLC Registration in Conversations
Reachability Indicator
Send Rich Content Messages with Conversations
Conversations SDK Guides
Tutorials
Client-side SDKs
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
What is A2P 10DLC?
I think I'm a "small" use-case that doesn't need to register. Would carriers agree?
A2P 10DLC Registration in Conversations

In this guide, you will find answers to common questions about A2P 10DLC and how it relates to Twilio Conversations in the U.S.
Note that this regulation applies only to messaging sent from 10DLC numbers to receiving numbers in the U.S. 10DLC format means a 'local' number such as (415) 123-4567, which is a format found only in the United States and Canada. 10DLC excludes Toll-Free numbers, which are subject to a different set of regulations
, as well as short-code SMS numbers.
A2P has no impact on WhatsApp
 or any other Messaging channel, so those channels don't require A2P registration.

What is A2P 10DLC?
U.S. Application-to-Person 10-digit long code (A2P 10DLC) messaging is the latest offering from U.S. carriers to help support the growing ecosystem of businesses texting their customers while protecting end users from unwanted messages. 10-digit long codes have traditionally been designed for Person-to-Person (P2P) traffic only, causing businesses to be constrained by limited throughput and heightened filtering.
The launch and support of A2P 10DLC across all carriers in the United States provides good actors with increased deliverability and throughput, but also requires additional registration to build trust with carriers. There are associated fees with this registration process and also per-message carrier fees.
The major U.S. carriers, acting through an entity called The Campaign Registry (TCR), have formalized regulations to make explicit throughput allowances, and to reduce filtering rates in exchange for pre-registration and compliance by customers.
Please see this A2P 10DLC Registration overview document, which contains links to specific registration procedures based on your customer type or use case.
As a Twilio Conversations user, A2P 10DLC applies to you if you are sending Conversations messages from a 10DLC phone number to a U.S. cell phone number.
Is Conversations traffic subject to A2P governance?
Yes! As of September 1, 2023, any A2P messaging traffic to U.S. recipients using Twilio 10DLC numbers that has not been appropriately registered will be blocked.
I think I'm a "small" use-case that doesn't need to register. Would carriers agree?
No they would not. All SMS messages sent from a Twilio 10DLC number to US cell phone numbers are subject to the A2P regulations, regardless of volume. However, The Campaign Registry had defined different registration tiers or Brand types based on volume: Sole Proprietor Brand, Low-Volume Standard Brand and Standard Brand. See our Overview for details on these three tiers/brand types.
How do I map my Conversations to A2P Campaigns?
For A2P registration, you will register a Brand (Sole Proprietor, LVS or Standard) and then one or more Campaigns for that Brand, where each Campaign is defined around a single use case, and is associated with a single Messaging Service.
Add any 10DLC numbers from your Conversations implementation to the A2P Campaign's Messaging Service. This can be done before or after the Brand and Campaign are submitted for approval by TCR. Again, see the overview document for detailed walkthroughs of this registration process.
Once the Brand and Campaign have been approved, all 10DLC phone numbers in that Messaging Service are considered registered for A2P with The Campaign Registry. At this point the relevant carriers (such as T-Mobile) will be notified to add such numbers to their A2P whitelist; this process can take a few more days but does not require any further customer action (use the Console tool documented here to check the current status of your phone numbers).
Once the individual numbers in the Campaign's Messaging Service have been registered with the carriers, the new A2P Campaign is ready for use. For each outbound message, the A2P Campaign is selected based on your Twilio Number's Sender Pool membership. Newly created conversations will be assigned to the default Messaging Service configured in your project, as well as any auto-created conversations.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
A2P 10DLC Registration in Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations Fundamentals
Conversations Limits
Media Support in Conversations
Conversations Webhooks
Using WhatsApp with Conversations
Using States and Timers in Conversations
Delivery Receipts in Conversations
Group Texting in Conversations
Inbound Message Handling & Autocreation
Push Notification Configuration for Conversations
Push Notifications on Android for Conversations
Push Notifications on iOS for Conversations
Push Notifications on Web
A2P 10DLC Registration in Conversations
Reachability Indicator
Send Rich Content Messages with Conversations
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Enable the Reachability Indicator
User Reachability Properties
REST API
Client SDKs
Reachability Indicator

Your Conversations applications can display a chat user's online or offline status to other users of the application. This feature is called the Reachability Indicator, and the Conversations service automatically manages the online or offline state for each user if it is activated.
This feature also provides the User's reachability by Push Notification within the Conversations Service instance.
The reachability state is automatically updated and synchronized by the Conversations service, provided the feature is enabled. The feature is enabled on a "per Service instance" basis.
Note: It is important to note that Users exist within the scope of a Conversations Service instance. Thus, the Reachability indicators are also within the same scope.

Enable the Reachability Indicator
Each Service instance can have Reachability enabled or disabled. The default is disabled. The reachability state will not be updated if the feature is disabled for a given Service instance. Once enabled, the state will update and synchronize.
You must set the ReachabilityEnabled property using the Service Configuration REST resource to configure the Reachability Indicator feature.
Enable the Reachability Indicator
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function updateServiceConfiguration() {


 const configuration = await client.conversations.v1


   .services("ISXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .configuration()


   .update({ reachabilityEnabled: true });





 console.log(configuration.chatServiceSid);


}





updateServiceConfiguration();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "chat_service_sid": "ISXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "default_conversation_creator_role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "default_conversation_role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "default_chat_service_role_sid": "RLaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "reachability_enabled": true,


 "url": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Configuration",


 "links": {


   "notifications": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Configuration/Notifications",


   "webhooks": "https://conversations.twilio.com/v1/Services/ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Configuration/Webhooks"


 }


}
If you choose to enable Reachability Indicators and later wish to return to disabled, set the ReachabilityEnabled property back to false.

User Reachability Properties
The Reachability indicators are exposed for Users in two places:
REST API - Users resource
Client SDKs - User objects
REST API
The following read-only properties within the Users REST resource provide Reachability information for Users:
is_online
is_notifiable
These properties are set by the Conversations system if the Reachability Indicator feature is enabled for a User's Service instance.
Note: These properties can be null under the following conditions:
The Reachability Indicator feature is disabled for the Service Instance
The User has not been online since the Reachability indicator has been enabled
LIST GET resource representations only have a true or false value for specific GET requests
Please see the REST Users resource documentation for more information.
Client SDKs
Within the Conversations Client SDKs, the Reachability Indicator properties are exposed in the User objects.
Real-time updates to other Users' Reachability Indicator states are communicated via the update event mechanism for subscribed User objects. Please see the specific SDK API documentation for details, as each SDK/platform handles this update a little differently.
An indicator of your Service instance's Reachability status (reachability_enabled ) is also exposed at the SDK client level.
The read only client SDK properties exposed are:
ConversationsClient.reachabilityEnabled
User.isOnline
User.isNotifiable
Note: The above are representations. The specifics of how these properties are accessed are distinct for each language/SDK.
Note: These user properties are read only and cannot be set. Conversations will update these settings and synchronize them as necessary. The Service Configuration REST resource manages the Service-level Reachability feature from the back-end code.
Handle Reachability updates
Handle an UpdateReason change and process the Reachability Indicators
Copy code block
// function called after client init to set up event handlers


function registerEventHandlers() {


 user = conversationsClient.user;


 // Register User updated event handler


 user.on('updated', function(event) {


   handleUserUpdate(event.user, event.updateReasons)


 });


}





// function to handle User updates


function handleUserUpdate(user, updateReasons) {


 // loop over each reason and check for reachability change


 updateReasons.forEach(function(reason) {


   if (reason == 'online') {


     //do something


   }


 });


}

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Reachability Indicator | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations Fundamentals
Conversations Limits
Media Support in Conversations
Conversations Webhooks
Using WhatsApp with Conversations
Using States and Timers in Conversations
Delivery Receipts in Conversations
Group Texting in Conversations
Inbound Message Handling & Autocreation
Push Notification Configuration for Conversations
Push Notifications on Android for Conversations
Push Notifications on iOS for Conversations
Push Notifications on Web
A2P 10DLC Registration in Conversations
Reachability Indicator
Send Rich Content Messages with Conversations
Conversations SDK Guides
Tutorials
Client-side SDKs
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
Overview
The Content Template Builder
Step 1: Create Content Template via Content API
POST API
Optional: Retrieve a Content Template SID from the Content Template Builder
Step 2: Create a Conversation
POST API
Step 3: Add a WhatsApp Participant to the Conversation
POST API
Step 4: Send a Rich Message via the Conversations API
POST API
What's Next?
Send Rich Content Messages with Conversations

Overview
In this tutorial, you will learn how to send rich messages to WhatsApp using Conversations and the Content Template Builder. The Content Template Builder lets users build rich content templates programmatically through an API or with no code in a graphical user interface in the console. "Rich content" or "Rich messaging" refers to messages with additional visual or interactive elements such as buttons or selectable lists.
The Content Template Builder
With Twilio's Content Template Builder, you can create message templates to send over any Twilio-supported messaging channel. It supports text and media as well as richer content types like location, quick-replies, and list-pickers. The templates also support variables, so you can leverage the same content across multiple conversations while personalizing each message.
Below is an overview of the content types currently supported by Conversations. See the individual content type documentation for additional details about each type's parameters and input requirements.
Content Type
Data parameter
Type
Description
twilio/text
body [required]
string
The text of the message you want to send. Maximum 1,600 characters.
twilio/media
body [required]
string
The text of the message you want to send. Maximum 1,600 characters.


media [optional]
string[]
The URL of the media you want to send. - The URL must resolve to a publicly accessible media file. - The media URL must contain a valid file type.
twilio/location
longitude [required]
numbers
The longitude value of the location pin you want to send.


latitude [required]
numbers
The latitude value of the location pin you want to send.


label [optional]
string
Label to be displayed alongside the location pin.
twilio/quick-reply
body [required]
string
The text of the message you want to send. Maximum 1,024 characters.


actions [required]
array[actions]
Predefined buttons that a customer could use as the response. It needs the "type", "title", and "id" fields.
twilio/call-to-action
body [required]
string
The text of the message you want to send. Maximum 640 characters.


actions [required]
array[actions]
Buttons that recipients can tap to act on the message. It requires the "type" and "title" actions.
twilio/list-picker
body [required]
string
The text of the message you want to send. Maximum 1,024 characters.


button [required]
string
Display value for the primary button.


items [required]
array[list items]
Array of list item objects.
twilio/card
title [required]
string
Title of the card. Maximum 1,024 characters.


subtitle [optional]
string
Subtitle of the card. Maximum 60 characters.


media [optional]
string[]
The URL of the media to send with the message.


actions [optional]
array[actions]
Buttons that recipients can tap on to act on the message.


Step 1: Create Content Template via Content API
(information)
Info
The Content Template Builder supports an unlimited number of templates, however, WhatsApp limits users to 6000 approved templates across all languages.
To send a rich message, you'll first need to create a content template using the Content Template Builder.
In the following example, we'll use the "quick-reply" template, which allows the recipient to respond by clicking on one of the options that you pre-define in the template. To see how the template layout looks, go to Step 4.
After creating your template, take note of the ContentSid (HXXXXXX) found in the response as we'll be using that SID throughout this tutorial.
POST API
Request:
Copy code block
curl -X POST 'https://content.twilio.com/v1/Content' \


-H 'Content-Type: application/json' \


-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN \


-d '{


   "friendly_name": "flight_replies",


   "language": "en",


   "variables": {"1":"name"},


   "types": {


       "twilio/quick-reply": {


                   "body": "Hi, {{ 1 }}. \n Thanks for contacting Owl Air Support. How can I help?",


                   "actions": [


                       {


                           "title": "Check flight status",


                           "id": "flightid1"


                       },


                       {


                           "title": "Check gate number",


                           "id": "gateid1"


                       },


                       {


                           "title": "Speak with an agent",


                           "id": "agentid1"


                       }


                   ]


               },


       "twilio/text": {


           "body": "Hi, {{ 1 }}. \n Thanks for contacting Owl Air Support. How can I help?."


       }


   }


}'


Response:
Copy code block
{


 "language": "en",


 "date_updated": "2022-08-29T10:43:20Z",


 "variables": {


   "1": "name"


 },


 "friendly_name": "flight_replies",


 "account_sid": "ACXXXXXXXXXXXXXXXXXXX",


 "url": "https://content.twilio.com/v1/Content/HXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "sid": "HXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "date_created": "2022-08-29T10:43:20Z",


 "types": {


   "twilio/text": {


     "body": "Hi, {{ 1 }}. \n Thanks for contacting Owl Air Support. How can I help?."


   },


   "twilio/quick-reply": {


     "body": "Hi, {{ 1 }}. \n Thanks for contacting Owl Air Support. How can I help?",


     "actions": [


       {


         "id": "flightid1",


         "title": "Check flight status"


       },


       {


         "id": "gateid1",


         "title": "Check gate number"


       },


       {


         "id": "agentid1",


         "title": "Speak with an agent"


       }


     ]


   }


 },


 "links": {


   "approval_fetch": "https://content.twilio.com/v1/Content/HXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/ApprovalRequests",


   "approval_create": "https://content.twilio.com/v1/Content/HXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/ApprovalRequests/whatsapp"


 }


}
Optional: Retrieve a Content Template SID from the Content Template Builder
You can make a GET request to the Content API to fetch a list of all the content templates that you have created.
GET API
Request:
Copy code block
curl -X GET "https://content.twilio.com/v1/Content?PageSize=2" \


-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
Response:
Copy code block
{


 "meta": {


   "page": 0,


   "page_size": 2,


   "first_page_url": "https://content.twilio.com/v1/Content?PageSize=2&Page=0",


   "previous_page_url": null,


   "url": "https://content.twilio.com/v1/Content?PageSize=2&Page=0",


   "next_page_url": "https://content.twilio.com/v1/Content?PageSize=2&Page=1&PageToken=PAHXXXXXXXXXXXX",


   "key": "contents"


 },


 "contents": [


   {


     "language": "en",


     "date_updated": "2023-03-07T14:46:13Z",


     "variables": {


       "1": "flight_number",


       "3": "departure_time",


       "2": "arrival_city",


       "5": "url_suffix",


       "4": "gate_number"


     },


     "friendly_name": "flight_departure_update",


     "account_sid": "ACXXXXXXXXXX",


     "url": "https://content.twilio.com/v1/Content/HXXXXXXXXXXXXX",


     "sid": "HXXXXXXXXXXXX",


     "date_created": "2023-03-07T14:46:13Z",


     "types": {


       "twilio/call-to-action": {


         "body": "Owl Air: We will see you soon! Flight {{ 1 }} to {{ 2 }} departs at {{ 3 }} from Gate {{ 4 }}.",


         "actions": [


           {


             "url": "https://owlair.com/{{ 5 }}",


             "type": "URL",


             "title": "Check Flight Status"


           },


           {


             "phone": "+18005551234",


             "type": "PHONE_NUMBER",


             "title": "Call Support"


           }


         ]


       }


     },


     "links": {


       "approval_fetch": "https://content.twilio.com/v1/Content/HXXXXXXXXXXXX/ApprovalRequests",


       "approval_create": "https://content.twilio.com/v1/Content/HXXXXXXXXXXX/ApprovalRequests/whatsapp"


     }


   },


   {


     "language": "en",


     "date_updated": "2023-02-24T14:25:37Z",


     "variables": {


       "1": "name"


     },


     "friendly_name": "flight_replies",


     "account_sid": "ACXXXXXXXXXX",


     "url": "https://content.twilio.com/v1/Content/HXXXXXXXXXX",


     "sid": "HXXXXXXXXXXX",


     "date_created": "2023-02-24T14:25:37Z",


     "types": {


       "twilio/text": {


         "body": "Hi, {{ 1 }}. \n Thanks for contacting Owl Air Support. How can I help?."


       },


       "twilio/quick-reply": {


         "body": "Hi, {{ 1 }}. \n Thanks for contacting Owl Air Support. How can I help?",


         "actions": [


           {


             "id": "flightid1",


             "title": "Check flight status"


           },


           {


             "id": "gateid1",


             "title": "Check gate number"


           },


           {


             "id": "agentid1",


             "title": "Speak with an agent"


           }


         ]


       }


     },


     "links": {


       "approval_fetch": "https://content.twilio.com/v1/Content/HXXXXXXXXXXX/ApprovalRequests",


       "approval_create": "https://content.twilio.com/v1/Content/HXXXXXXXXXXX/ApprovalRequests/whatsapp"


     }


   }


 ]


}

Step 2: Create a Conversation
Now, let's create a Conversation that we'll use in the next step to send a rich content message. In the sample code below, replace the Account SID and Auth Token with the values from your Twilio Console. Copy down the Conversation SID (It starts with CHXXXXX). We'll be using this value in the next step when we add a WhatsApp participant to the Conversation you just created.
POST API
Request:
Copy code block
curl -X POST "https://conversations.twilio.com/v1/Conversations" \


--data-urlencode "FriendlyName=Send Rich content messages with Conversations" \


-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
Response:
Copy code block
{


 "unique_name": null,


 "date_updated": "2023-02-13T12:31:50Z",


 "friendly_name": "Send rich content messages with Conversations",


 "timers": {},


 "account_sid": "ACXXXXXXXXXXXXX",


 "url": "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXXXXX",


 "state": "active",


 "date_created": "2023-02-13T12:31:50Z",


 "messaging_service_sid": "MGXXXXXXXXXXXX",


 "sid": "CHXXXXXXXXXXXXX",


 "attributes": "{}",


 "bindings": null,


 "chat_service_sid": "ISXXXXXXXXXX",


 "links": {


   "participants": "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXX/Participants",


   "messages": "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXX/Messages",


   "webhooks": "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXXX/Webhooks"


 }


}

Step 3: Add a WhatsApp Participant to the Conversation
Let's add a WhatsApp Participant to the Conversation. For the code sample below, replace the placeholder values for:
CHXXXXXXX: use the Conversation SID you just copied
YOUR_WHATSAPP_NUMBER: your WhatsApp phone number, in E.164 format
TWI_WA_NUMBER: Your Twilio enabled WhatsApp phone number, in E.164 format
TWILIO_ACCOUNT_SID: Your Twilio Account SID
TWILIO_AUTH_TOKEN: Your Twilio Auth Token
POST API
Request:
Copy code block
curl -X POST "https://conversations.twilio.com/v1/Conversations/CHxxxx/Participants" \


--data-urlencode "MessagingBinding.Address=whatsapp:YOUR_WHATSAPP_NUMBER" \


--data-urlencode "MessagingBinding.ProxyAddress=whatsapp:TWI_WA_NUMBER" \


-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
Response:
Copy code block
{


 "last_read_message_index": null,


 "date_updated": "2023-02-17T16:45:32Z",


 "last_read_timestamp": null,


 "conversation_sid": "CHXXXXXXXXX",


 "account_sid": "ACXXXXXXXXXX",


 "url": "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXX/Participants/MBXXXXXXXXX",


 "date_created": "2023-02-17T16:45:32Z",


 "role_sid": "RLXXXXXXXXXX",


 "sid": "MBXXXXXXXXXXX",


 "attributes": "{}",


 "identity": null,


 "messaging_binding": {


   "proxy_address": "whatsapp:TWI_WA_NUMBER",


   "type": "whatsapp",


   "address": "whatsapp:YOUR_WHATSAPP_NUMBER"


 }


}

Step 4: Send a Rich Message via the Conversations API
(information)
Info
If the customer representative wants to send rich content messages prior to the end user messaging them on WhatsApp, then this content template will need to be approved before it can be sent out. Some content types (e.g., Cards and CTA buttons) require prior approval regardless of whether the template is sent in the context of a session or not.
So far you've created a content template, and a Conversation with a WhatsApp participant. Now we're ready to send a rich message to the participant. This example uses the Conversations API, but content templates are also available through the Conversations SDKs for JavaScript, Android, and iOS.
In our POST request example, you'll pass the ContentVariables parameter (optional), which allows you to customize the message content with dynamic values. For this example, "name" will be replaced with the value ("Alice").
Replace:
CHXXXXXXXXXXXXXXXXXXX with the Conversation SID in the request URL
HXXXXXXXXXXXXXXXXXXXX value in the Content SID parameter
Request parameters:
Parameter
Required
Description
ContentSid
Yes
The unique ID of the multi-channel Content template, required for template-generated message. Note that if this field is set, the Body and MediaSid parameters are ignored.
ContentVariables
Optional
A structurally valid JSON string that contains values to determine Content template variables.

POST API
Request:
Copy code block
curl -X POST "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXXXXXXXXXXXX/Messages" \


--data-urlencode 'ContentSid=HXXXXXXXXXXXXXXXXXXXX' \


--data-urlencode 'ContentVariables={ "1": "Alice" }' \


-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN


Response:
Copy code block
{


 "body": "Hi, Alice. \n Thanks for contacting Owl Air Support. How can I help?",


 "index": 0,


 "author": "system",


 "date_updated": "2023-02-09T17:44:30Z",


 "media": null,


 "participant_sid": null,


 "conversation_sid": "CHXXXXXXXXXXXXXXXXXXX",


 "account_sid": "ACXXXXXXXXXXXXXXXXXXX",


 "delivery": null,


 "url": "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXXXXXXXXXXXX0/Messages/IMXXXXXXXXXXXXXXXXXXX",


 "date_created": "2023-02-09T17:44:30Z",


 "content_sid": "HXXXXXXXXXXXXXXXXXXXX",


 "sid": "IMXXXXXXXXXXXXXXXXXXX",


 "attributes": "{}",


 "links": {


   "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXXXXXXXXXXXX/Messages/IMXXXXXXXXXXXXXXXXXXX/Receipts"


 }


}

Expand image
Well done! You've successfully sent your first rich content message to your WhatsApp Participant using Twilio Conversations.

What's Next?
As a following step, you can:
Check out our Conversations Quickstart
Learn more about the Content Template Builder

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Send Rich Content Messages with Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations Fundamentals
Conversations Limits
Media Support in Conversations
Conversations Webhooks
Using WhatsApp with Conversations
Using States and Timers in Conversations
Delivery Receipts in Conversations
Group Texting in Conversations
Inbound Message Handling & Autocreation
Push Notification Configuration for Conversations
Push Notifications on Android for Conversations
Push Notifications on iOS for Conversations
Push Notifications on Web
A2P 10DLC Registration in Conversations
Reachability Indicator
Send Rich Content Messages with Conversations
Conversations SDK Guides
Getting Started
SDK Overview
Event Handling
Working with Conversations
Sending Messages and Media
User Reachability Indicator
Read Horizon and Read Status Overview
Delivery Receipts Overview
Conversations Attributes
Modifying a Conversation, Message, or Participant
More SDK Resources
Migration Guides
Tutorials
Client-side SDKs
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
Overview
The Content Template Builder
Step 1: Create Content Template via Content API
POST API
Optional: Retrieve a Content Template SID from the Content Template Builder
Step 2: Create a Conversation
POST API
Step 3: Add a WhatsApp Participant to the Conversation
POST API
Step 4: Send a Rich Message via the Conversations API
POST API
What's Next?
Send Rich Content Messages with Conversations

Overview
In this tutorial, you will learn how to send rich messages to WhatsApp using Conversations and the Content Template Builder. The Content Template Builder lets users build rich content templates programmatically through an API or with no code in a graphical user interface in the console. "Rich content" or "Rich messaging" refers to messages with additional visual or interactive elements such as buttons or selectable lists.
The Content Template Builder
With Twilio's Content Template Builder, you can create message templates to send over any Twilio-supported messaging channel. It supports text and media as well as richer content types like location, quick-replies, and list-pickers. The templates also support variables, so you can leverage the same content across multiple conversations while personalizing each message.
Below is an overview of the content types currently supported by Conversations. See the individual content type documentation for additional details about each type's parameters and input requirements.
Content Type
Data parameter
Type
Description
twilio/text
body [required]
string
The text of the message you want to send. Maximum 1,600 characters.
twilio/media
body [required]
string
The text of the message you want to send. Maximum 1,600 characters.


media [optional]
string[]
The URL of the media you want to send. - The URL must resolve to a publicly accessible media file. - The media URL must contain a valid file type.
twilio/location
longitude [required]
numbers
The longitude value of the location pin you want to send.


latitude [required]
numbers
The latitude value of the location pin you want to send.


label [optional]
string
Label to be displayed alongside the location pin.
twilio/quick-reply
body [required]
string
The text of the message you want to send. Maximum 1,024 characters.


actions [required]
array[actions]
Predefined buttons that a customer could use as the response. It needs the "type", "title", and "id" fields.
twilio/call-to-action
body [required]
string
The text of the message you want to send. Maximum 640 characters.


actions [required]
array[actions]
Buttons that recipients can tap to act on the message. It requires the "type" and "title" actions.
twilio/list-picker
body [required]
string
The text of the message you want to send. Maximum 1,024 characters.


button [required]
string
Display value for the primary button.


items [required]
array[list items]
Array of list item objects.
twilio/card
title [required]
string
Title of the card. Maximum 1,024 characters.


subtitle [optional]
string
Subtitle of the card. Maximum 60 characters.


media [optional]
string[]
The URL of the media to send with the message.


actions [optional]
array[actions]
Buttons that recipients can tap on to act on the message.


Step 1: Create Content Template via Content API
(information)
Info
The Content Template Builder supports an unlimited number of templates, however, WhatsApp limits users to 6000 approved templates across all languages.
To send a rich message, you'll first need to create a content template using the Content Template Builder.
In the following example, we'll use the "quick-reply" template, which allows the recipient to respond by clicking on one of the options that you pre-define in the template. To see how the template layout looks, go to Step 4.
After creating your template, take note of the ContentSid (HXXXXXX) found in the response as we'll be using that SID throughout this tutorial.
POST API
Request:
Copy code block
curl -X POST 'https://content.twilio.com/v1/Content' \


-H 'Content-Type: application/json' \


-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN \


-d '{


   "friendly_name": "flight_replies",


   "language": "en",


   "variables": {"1":"name"},


   "types": {


       "twilio/quick-reply": {


                   "body": "Hi, {{ 1 }}. \n Thanks for contacting Owl Air Support. How can I help?",


                   "actions": [


                       {


                           "title": "Check flight status",


                           "id": "flightid1"


                       },


                       {


                           "title": "Check gate number",


                           "id": "gateid1"


                       },


                       {


                           "title": "Speak with an agent",


                           "id": "agentid1"


                       }


                   ]


               },


       "twilio/text": {


           "body": "Hi, {{ 1 }}. \n Thanks for contacting Owl Air Support. How can I help?."


       }


   }


}'


Response:
Copy code block
{


 "language": "en",


 "date_updated": "2022-08-29T10:43:20Z",


 "variables": {


   "1": "name"


 },


 "friendly_name": "flight_replies",


 "account_sid": "ACXXXXXXXXXXXXXXXXXXX",


 "url": "https://content.twilio.com/v1/Content/HXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "sid": "HXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "date_created": "2022-08-29T10:43:20Z",


 "types": {


   "twilio/text": {


     "body": "Hi, {{ 1 }}. \n Thanks for contacting Owl Air Support. How can I help?."


   },


   "twilio/quick-reply": {


     "body": "Hi, {{ 1 }}. \n Thanks for contacting Owl Air Support. How can I help?",


     "actions": [


       {


         "id": "flightid1",


         "title": "Check flight status"


       },


       {


         "id": "gateid1",


         "title": "Check gate number"


       },


       {


         "id": "agentid1",


         "title": "Speak with an agent"


       }


     ]


   }


 },


 "links": {


   "approval_fetch": "https://content.twilio.com/v1/Content/HXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/ApprovalRequests",


   "approval_create": "https://content.twilio.com/v1/Content/HXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/ApprovalRequests/whatsapp"


 }


}
Optional: Retrieve a Content Template SID from the Content Template Builder
You can make a GET request to the Content API to fetch a list of all the content templates that you have created.
GET API
Request:
Copy code block
curl -X GET "https://content.twilio.com/v1/Content?PageSize=2" \


-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
Response:
Copy code block
{


 "meta": {


   "page": 0,


   "page_size": 2,


   "first_page_url": "https://content.twilio.com/v1/Content?PageSize=2&Page=0",


   "previous_page_url": null,


   "url": "https://content.twilio.com/v1/Content?PageSize=2&Page=0",


   "next_page_url": "https://content.twilio.com/v1/Content?PageSize=2&Page=1&PageToken=PAHXXXXXXXXXXXX",


   "key": "contents"


 },


 "contents": [


   {


     "language": "en",


     "date_updated": "2023-03-07T14:46:13Z",


     "variables": {


       "1": "flight_number",


       "3": "departure_time",


       "2": "arrival_city",


       "5": "url_suffix",


       "4": "gate_number"


     },


     "friendly_name": "flight_departure_update",


     "account_sid": "ACXXXXXXXXXX",


     "url": "https://content.twilio.com/v1/Content/HXXXXXXXXXXXXX",


     "sid": "HXXXXXXXXXXXX",


     "date_created": "2023-03-07T14:46:13Z",


     "types": {


       "twilio/call-to-action": {


         "body": "Owl Air: We will see you soon! Flight {{ 1 }} to {{ 2 }} departs at {{ 3 }} from Gate {{ 4 }}.",


         "actions": [


           {


             "url": "https://owlair.com/{{ 5 }}",


             "type": "URL",


             "title": "Check Flight Status"


           },


           {


             "phone": "+18005551234",


             "type": "PHONE_NUMBER",


             "title": "Call Support"


           }


         ]


       }


     },


     "links": {


       "approval_fetch": "https://content.twilio.com/v1/Content/HXXXXXXXXXXXX/ApprovalRequests",


       "approval_create": "https://content.twilio.com/v1/Content/HXXXXXXXXXXX/ApprovalRequests/whatsapp"


     }


   },


   {


     "language": "en",


     "date_updated": "2023-02-24T14:25:37Z",


     "variables": {


       "1": "name"


     },


     "friendly_name": "flight_replies",


     "account_sid": "ACXXXXXXXXXX",


     "url": "https://content.twilio.com/v1/Content/HXXXXXXXXXX",


     "sid": "HXXXXXXXXXXX",


     "date_created": "2023-02-24T14:25:37Z",


     "types": {


       "twilio/text": {


         "body": "Hi, {{ 1 }}. \n Thanks for contacting Owl Air Support. How can I help?."


       },


       "twilio/quick-reply": {


         "body": "Hi, {{ 1 }}. \n Thanks for contacting Owl Air Support. How can I help?",


         "actions": [


           {


             "id": "flightid1",


             "title": "Check flight status"


           },


           {


             "id": "gateid1",


             "title": "Check gate number"


           },


           {


             "id": "agentid1",


             "title": "Speak with an agent"


           }


         ]


       }


     },


     "links": {


       "approval_fetch": "https://content.twilio.com/v1/Content/HXXXXXXXXXXX/ApprovalRequests",


       "approval_create": "https://content.twilio.com/v1/Content/HXXXXXXXXXXX/ApprovalRequests/whatsapp"


     }


   }


 ]


}

Step 2: Create a Conversation
Now, let's create a Conversation that we'll use in the next step to send a rich content message. In the sample code below, replace the Account SID and Auth Token with the values from your Twilio Console. Copy down the Conversation SID (It starts with CHXXXXX). We'll be using this value in the next step when we add a WhatsApp participant to the Conversation you just created.
POST API
Request:
Copy code block
curl -X POST "https://conversations.twilio.com/v1/Conversations" \


--data-urlencode "FriendlyName=Send Rich content messages with Conversations" \


-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
Response:
Copy code block
{


 "unique_name": null,


 "date_updated": "2023-02-13T12:31:50Z",


 "friendly_name": "Send rich content messages with Conversations",


 "timers": {},


 "account_sid": "ACXXXXXXXXXXXXX",


 "url": "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXXXXX",


 "state": "active",


 "date_created": "2023-02-13T12:31:50Z",


 "messaging_service_sid": "MGXXXXXXXXXXXX",


 "sid": "CHXXXXXXXXXXXXX",


 "attributes": "{}",


 "bindings": null,


 "chat_service_sid": "ISXXXXXXXXXX",


 "links": {


   "participants": "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXX/Participants",


   "messages": "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXX/Messages",


   "webhooks": "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXXX/Webhooks"


 }


}

Step 3: Add a WhatsApp Participant to the Conversation
Let's add a WhatsApp Participant to the Conversation. For the code sample below, replace the placeholder values for:
CHXXXXXXX: use the Conversation SID you just copied
YOUR_WHATSAPP_NUMBER: your WhatsApp phone number, in E.164 format
TWI_WA_NUMBER: Your Twilio enabled WhatsApp phone number, in E.164 format
TWILIO_ACCOUNT_SID: Your Twilio Account SID
TWILIO_AUTH_TOKEN: Your Twilio Auth Token
POST API
Request:
Copy code block
curl -X POST "https://conversations.twilio.com/v1/Conversations/CHxxxx/Participants" \


--data-urlencode "MessagingBinding.Address=whatsapp:YOUR_WHATSAPP_NUMBER" \


--data-urlencode "MessagingBinding.ProxyAddress=whatsapp:TWI_WA_NUMBER" \


-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
Response:
Copy code block
{


 "last_read_message_index": null,


 "date_updated": "2023-02-17T16:45:32Z",


 "last_read_timestamp": null,


 "conversation_sid": "CHXXXXXXXXX",


 "account_sid": "ACXXXXXXXXXX",


 "url": "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXX/Participants/MBXXXXXXXXX",


 "date_created": "2023-02-17T16:45:32Z",


 "role_sid": "RLXXXXXXXXXX",


 "sid": "MBXXXXXXXXXXX",


 "attributes": "{}",


 "identity": null,


 "messaging_binding": {


   "proxy_address": "whatsapp:TWI_WA_NUMBER",


   "type": "whatsapp",


   "address": "whatsapp:YOUR_WHATSAPP_NUMBER"


 }


}

Step 4: Send a Rich Message via the Conversations API
(information)
Info
If the customer representative wants to send rich content messages prior to the end user messaging them on WhatsApp, then this content template will need to be approved before it can be sent out. Some content types (e.g., Cards and CTA buttons) require prior approval regardless of whether the template is sent in the context of a session or not.
So far you've created a content template, and a Conversation with a WhatsApp participant. Now we're ready to send a rich message to the participant. This example uses the Conversations API, but content templates are also available through the Conversations SDKs for JavaScript, Android, and iOS.
In our POST request example, you'll pass the ContentVariables parameter (optional), which allows you to customize the message content with dynamic values. For this example, "name" will be replaced with the value ("Alice").
Replace:
CHXXXXXXXXXXXXXXXXXXX with the Conversation SID in the request URL
HXXXXXXXXXXXXXXXXXXXX value in the Content SID parameter
Request parameters:
Parameter
Required
Description
ContentSid
Yes
The unique ID of the multi-channel Content template, required for template-generated message. Note that if this field is set, the Body and MediaSid parameters are ignored.
ContentVariables
Optional
A structurally valid JSON string that contains values to determine Content template variables.

POST API
Request:
Copy code block
curl -X POST "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXXXXXXXXXXXX/Messages" \


--data-urlencode 'ContentSid=HXXXXXXXXXXXXXXXXXXXX' \


--data-urlencode 'ContentVariables={ "1": "Alice" }' \


-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN


Response:
Copy code block
{


 "body": "Hi, Alice. \n Thanks for contacting Owl Air Support. How can I help?",


 "index": 0,


 "author": "system",


 "date_updated": "2023-02-09T17:44:30Z",


 "media": null,


 "participant_sid": null,


 "conversation_sid": "CHXXXXXXXXXXXXXXXXXXX",


 "account_sid": "ACXXXXXXXXXXXXXXXXXXX",


 "delivery": null,


 "url": "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXXXXXXXXXXXX0/Messages/IMXXXXXXXXXXXXXXXXXXX",


 "date_created": "2023-02-09T17:44:30Z",


 "content_sid": "HXXXXXXXXXXXXXXXXXXXX",


 "sid": "IMXXXXXXXXXXXXXXXXXXX",


 "attributes": "{}",


 "links": {


   "delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHXXXXXXXXXXXXXXXXXXX/Messages/IMXXXXXXXXXXXXXXXXXXX/Receipts"


 }


}

Expand image
Well done! You've successfully sent your first rich content message to your WhatsApp Participant using Twilio Conversations.

What's Next?
As a following step, you can:
Check out our Conversations Quickstart
Learn more about the Content Template Builder

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Send Rich Content Messages with Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Getting Started
SDK Overview
Event Handling
Working with Conversations
Sending Messages and Media
User Reachability Indicator
Read Horizon and Read Status Overview
Delivery Receipts Overview
Conversations Attributes
Modifying a Conversation, Message, or Participant
More SDK Resources
Migration Guides
Tutorials
Client-side SDKs
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
Initialization
Token Events
Client Connection State
Enable Debugging
What's Next?
SDK Overview

Twilio provides a client-side SDK for browser-based development, as well as SDKs for native development on iOS and Android.
Our SDKs provide a convenient collection of objects, methods, and events to connect your client-side application to Conversations.
For the most up-to-date installation methods, version history, and documentation, check out:
The JavaScript, Android, or iOS download page
The JavaScript, Android, or iOS changelogs
The JavaScript
, Android
, or iOS
 auto-generated documentation

Initialization
Initializing the Conversations SDKs is an important step to ensure your client is ready to use on an end user's mobile or web device.
To get started, you'll need to initialize a new Client object. You'll need to pass a valid Access Token to the client creation method as the first parameter.
After that, you should listen for the client to inform you when it's fully initialized/synchronized.
Once you receive this confirmation, the client is ready to use.
Client Initialization
Node.jsTypescript
Report code block
Copy code block
/* Initialization */


import {Client} from "@twilio/conversations";





const client = new Client("token");


client.on("stateChanged", (state) => {


   if (state === "failed") {


       // The client failed to initialize


       return;


   }





   if (state === "initialized") {


       // Use the client


   }


});

Token Events
(information)
Info
If the token expires before you renew it, the client's connection state will change to disconnected, and you'll need to initialize a new client object.
All tokens have a limited lifetime to protect you from abuse. The maximum and default lifetime is 24 hours, but you should make it as short as possible for your application. Therefore, you may need to renew the token during your SDK session. The SDK will notify you when the token is "about to expire" and when it "has expired".
To avoid needing to instantiate a new client, you should get a new token from your server and pass it to the client's updateToken method before the old one expires. This method will update the authentication token for your client and re-register with the Conversations services.
Token Events
Node.jsTypescript
Report code block
Copy code block
/* Handling token expiration/expiration warning events */





client.on("tokenAboutToExpire", (time) => {


   // token is about to expire. get a new token


   try {


       const token = (await fetch("https://placekitten.com/getToken?username=username&password=password")).data();


   } catch {


       return Error("Unable to get a token");


   }





   // update the client with new token


   client = await client.updateToken(token);





   // use updated client


});





client.on("tokenExpired", () => {


   // get a new token


   try {


       const token = (await fetch("https://placekitten.com/getToken?username=username&password=password")).data();


   } catch {


       return Error("Unable to get a token");


   }





   // token expired. create a new client


   client = new Client(token);


});





// update the token used by the client and re-register with the Conversations services


await client.updateToken("token");

Client Connection State
(information)
Info
There is a reconnection attempt period when the network connectivity is lost before the client switches to the disconnected state.
During use, the connection state of your SDK client may change.
These are the possible client connection states:
connecting- the client is offline and a connection attempt is in progress
connected - the client is online and ready
disconnecting - the client is going offline as disconnection is in progress
disconnected - the client is offline and no connection attempt is in progress
denied - the client connection is denied because of an invalid JSON Web Token access token. The user must refresh the token in order to proceed
The above-mentioned states are also documented in our SDK reference docs.
The client state changes are due to different factors. For instance, let's take the disconnected state as an example. This could happen due to a network disruption, expired token, or other error. You can listen to the client's connection state events to detect this and respond accordingly.
Handling Client State
Node.jsTypescript
Report code block
Copy code block
/* Handle client state change */





client.on("connectionStateChanged", ({state}) => {


   // handle new connection state


});

Enable Debugging
As you build out your Conversations application, you might find it helpful to check the Twilio Console debugger
. This service aggregates all additional errors or warnings that may be triggered from Twilio's webhooks to your server, as well as token errors.
You can also enable debug logging by passing an option for increased log verbosity to your client when you create it. Check the auto-generated docs or Error Handling and Diagnostics for platform-specific examples.

What's Next?
Congratulations, you have learned how to configure your Conversations SDK client. As a following step, you can:
Learn how to Handle Events in our next guide, or
Check out our Working with Conversations guide

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
SDK Overview | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Getting Started
SDK Overview
Event Handling
Working with Conversations
Sending Messages and Media
User Reachability Indicator
Read Horizon and Read Status Overview
Delivery Receipts Overview
Conversations Attributes
Modifying a Conversation, Message, or Participant
More SDK Resources
Migration Guides
Tutorials
Client-side SDKs
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
Which objects emit events?
Best practices and tips for listening to events
What's Next?
Event Handling

The Conversations SDK is event-driven. Objects from the SDK will emit real-time events based on state changes in your Conversations instance. You can use these events to update your application's state and UI.

Which objects emit events?
The SDK emits events on several objects (i.e. Client, Conversation, User, etc.).
These events are emitted, for example, when:
A new Message is added to a Conversation that you are participating in
The connection state of your Client changes
A Participant leaves a Conversation
A User comes online
Your Access Token is about to expire
The friendlyName of a Conversation is updated
A full list of events and objects can be found by referring to our generated SDK documentation:
JavaScript


Android


iOS


Event Handling
Node.jsTypescript
Report code block
Copy code block
/* event handler examples */





client.on("conversationUpdated", ({conversation, updateReasons}) => {


   // Fired when the attributes or the metadata of a conversation have been updated


});





conversation.on("messageUpdated", ({message, updateReasons}) => {


   // Fired when data of a message has been updated.


});





participant.on("updated", ({participant, updateReasons}) => {


   // Fired when the fields of the participant have been updated.


});

Best practices and tips for listening to events
For the JavaScript SDK, you can receive most events from the Client object. This is more performant in browsers and recommended over setting up duplicate handlers on each Conversation/User. You can also set up handlers on specific objects (e.g. Conversation, User) as needed.
For the iOS SDK, all events are emitted at the top level TwilioConversationsClientDelegate.
For the Android SDK, only some events are emitted from the ConversationsClientListener. Other events are available from the ConversationListener and MediaUploadListener.

What's Next?
As a next step, you can visit the following guides:
Learn How to work with Conversations.
Check out our Conversations JavaScript Quickstart to test the code by yourself.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Event Handling | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Getting Started
SDK Overview
Event Handling
Working with Conversations
Sending Messages and Media
User Reachability Indicator
Read Horizon and Read Status Overview
Delivery Receipts Overview
Conversations Attributes
Modifying a Conversation, Message, or Participant
More SDK Resources
Migration Guides
Tutorials
Client-side SDKs
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
Create your first Conversation
Join or Leave a Conversation
Add a Participant
Add chat participant (user)
Add non-chat participant
List all Participants
List new Messages
List all Conversations
What's Next?
Working with Conversations

A Conversation is a distinct omni-channel messaging thread (i.e. a place where users from multiple channels can exchange messages), in which Participants from any channel Conversations supports (e.g. SDK, SMS, WhatsApp) can communicate with each other.
You can create and manage new Conversations using either the Conversations REST API or the client-side Conversations SDK (what we're covering here). Let's start to dive in!

Create your first Conversation
You'll create a new Conversation using the Conversation creation (JS, iOS) or Conversation Builder methods on your new initialized Client object. Optionally, you can pass in the following parameters:attributes, friendlyName, and uniqueName.
Create Conversation
Node.jsTypescript
Report code block
Copy code block
/* Creating Conversation */





// create new conversation, all the parameters are optional


await client.createConversation({


   attributes: {},


   friendlyName: "new conversation",


   uniqueName: "new conversation",


});

Join or Leave a Conversation
After creating the Conversation, you'll need to join it to participate. Joining will create a Participant object in the Conversation that is associated with your User. This also subscribes you to events from the Conversation.
If you'd like to stop receiving events from this Conversation and remove your Participant, you can call the appropriate method to leave the Conversation.
Join or Leave a Conversation
Node.jsTypescript
Report code block
Copy code block
//join the Conversation


await conversation.join();





//leave the Conversation


await conversation.leave();

Add a Participant
There are two types of Participants:
Chat (SDK-based) Participants, or
Non-chat (e.g. SMS, WhatsApp) Participant
SDK-based (chat) Participant objects have a many-to-one relationship with User objects. A User represents a human using the SDK, and that User can be associated with multiple Participant objects: a unique Participant object for each Conversation they are participating in. In contrast, non-chat Participants (i.e. SMS, WhatsApp, etc.) are not linked by a User object even when they are the same human participating in multiple Conversations.
Add chat participant (user)
Users are uniquely identified by the identity property in the Access Token they initialized their Client with. You can create a Chat Participant belonging to that User in the Conversation by specifying their User's identity in the corresponding creation method.
Add non-chat participant
To add a non-chat Participant to the Conversation, you'll have to pass the proxyAddress and address parameters to the specific creation method on the Conversation object. The proxyAddress parameter is a Twilio address (e.g. Twilio phone number, WhatsApp sender) and the address parameter is the real-world phone number or address that the non-chat Participant is using.
The following code sample shows how to add both chat and non-chat Participants to a conversation.
Add a Participant
Node.jsTypescript
Report code block
Copy code block
/* Adding Participants (chat and non-chat) */





// add chat participant to the conversation by its identity


await conversation.add("identity");





// add a non-chat participant to the conversation


const proxyAddress = "+11222333";


const address = "+12345678";


await conversation.addNonChatParticipant(proxyAddress, address);





// adds yourself as a conversations sdk user to this conversation


// use after creating the conversation from the SDK


await conversation.join();





conversation.on("participantJoined", (participant) => {


   // fired when a participant has joined the conversation


});

List all Participants
You can get the list of all Participants within the Conversation by invoking the corresponding method on the Conversation object.
List Participants
Node.jsTypescript
Report code block
Copy code block
/* Get participants of the conversation */





let participants = await conversation.getParticipants();

List new Messages
To list the latest messages of a Conversation, call the appropriate method on the Conversation object and optionally specify the index of a specific Message to start from.
There are a few options, you can review the auto-generated documentation to familiarize yourself with the parameters you can use to modify this behavior.
List Messages
Node.jsTypescript
Report code block
Copy code block
/* get the latest messages of the conversation. optional arguments:


 pageSize | 30,


 anchor | "end",


 direction | "backwards"


*/





// get the messages paginator the latest 30 messages


let messagesPaginator = await conversation.getMessages(30, 0, "backwards");





// get messages


const messages = messagesPaginator.items;

List all Conversations
Because all Conversations are private, listing Conversations will only return Conversations that you are participating in. Call the appropriate method to retrieve them.
List Conversations
Node.jsTypescript
Report code block
Copy code block
// get the conversations paginator


let conversationsPaginator = await client.getSubscribedConversations();





// get conversations


const conversations = conversationsPaginator.items;

What's Next?
Well done! You've just learned how to create your first Conversation, add a Participant and list your conversations. To learn more, check out these helpful links:
Learn How to Send Text and Media Messageswith Conversations
Check out the User Reachability Indicator guide

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Working with Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Getting Started
SDK Overview
Event Handling
Working with Conversations
Sending Messages and Media
User Reachability Indicator
Read Horizon and Read Status Overview
Delivery Receipts Overview
Conversations Attributes
Modifying a Conversation, Message, or Participant
More SDK Resources
Migration Guides
Tutorials
Client-side SDKs
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
Send a text Message
Message Builder
Media Message
Send a Media Message
Send Multiple Media Messages
Retrieve Media Message Content
Media Limits
Security
What's Next?
Sending Messages and Media

Using the SDK, you can craft messages with text and/or media attachments and send them to other participants in your Conversation.

Send a text Message
If you'd like to send your Message as a one-shot method call, you can use this basic method.
Send a text Message
Node.jsTypescript
Report code block
Copy code block
//send a basic message into the Conversation


await conversation.sendMessage('hello world');
We also provide a more flexible method that allows you to programmatically build your message. This method is more robust and is typically ideal for most use cases.
Message Builder
The Message Builder class allows you to build a new text and/or media Message and makes the Message ready to be sent to the Conversation.
When creating the MessageBuilder object, you'll set each property of the message individually. For example, you'll set the body and the message attributes separately.
Using Message Builder
Node.jsTypescript
Report code block
Copy code block
/* Using MessageBuilder */


// Message builder. Allows the message to be built and sent via method chaining.





await testConversation.prepareMessage()


   .setBody('Hello!')


   .setAttributes({foo: 'bar'})


   .addMedia(media1)


   .addMedia(media2)


   .build()


   .send();

Media Message
You can add photos, videos, and other types of media files to your Conversation. Media is displayed seamlessly between all participating channels.
Send a Media Message
To add a media Message (i.e. photos, videos) to your Conversation, you'll need to create a Message and add a media file, filename and content type to the Message Builder.
Send Media Message
Node.jsTypescript
Report code block
Copy code block
const file = await fetch("https://v.fastcdn.co/u/ed1a9b17/52533501-0-logo.svg");


const fileBlob = await file.blob();





// Send a media message


const sendMediaOptions = {


   contentType: file.headers.get("Content-Type"),


   filename: "twilio-logo.svg",


   media: fileBlob


};





await conversation.prepareMessage().addMedia(sendMediaOptions);
Each SDK accepts media input differently:
For JS, use:
A String or Node.js Buffer containing a media byte stream
A new FormData object containing file information: filename, content-type, size, and all required FormData information
For iOS, use:
an InputStream
an NSInputStream-compliant stream
an NSData buffer
For Android, use:
any java.io.InputStream-compliant stream
Send Multiple Media Messages
(information)
Info
The maximum combined size of attachments is 150 MB.
You can also attach multiple media items to a single message by using the Message Builder.
Send multiple Media Messages
Node.jsTypescript
Report code block
Copy code block
/* Send multiple media */





const file = await fetch("https://v.fastcdn.co/u/ed1a9b17/52533501-0-logo.svg");


const fileBlob = await file.blob();





const mediaFormData = new FormData();


mediaFormData.set("twilio-logo", fileBlob, "twilio-logo.svg");





const sendMediaOptions = {


   contentType: file.headers.get("Content-Type"),


   filename: "twilio-logo.svg",


   media: fileBlob


};





await testConversation.prepareMessage()


   .setBody("Hello!")


   // add multiple media


   .addMedia(mediaFormData)


   .addMedia(sendMediaOptions)


   // ...


   .addMedia(mediaN)


   .build()


   .send();
Retrieve Media Message Content
You can get a short-lived, temporary URL to download the media content in a Conversation.
If a message has more than one attachment, an array of media Messages can be retrieved, but it has to match the specific category of media.
(information)
Info
media is currently the only category available
You can use your preferred method to retrieve the content from the temporary URL and render it in your UI.
Retrieve Media Message
Node.jsTypescript
Report code block
Copy code block
/* Check and update Media samples */





// Return all media attachments, without temporary urls


const media = message.attachedMedia;





// Return a (possibly empty) array of media matching a specific set of categories. Allowed category is so far only 'media'


const categorizedMedia = await message.getMediaByCategory(["media"]);





//Get a temporary URL for the first media returned by the previous method


const mediaUrl = await categorizedMedia[0].getContentTemporaryUrl();
Media Limits
Conversations is a cross-channel messaging product, so each channel has a different set of limitations about incoming media files. Please refer to theMedia Limits documentation for channel-specific information and supported file types.
Security
Media content is encrypted and can not be downloaded directly. When required, only authenticated users can generate temporary/expiring URLs to download the media content. The temporary URLs are valid for 300 seconds, after which a new temporary URL must be requested.

What's Next?
Let's learn other features in Twilio Conversations:
Explore the User Reachability Indicator guide
Learn How to Receive and Send Typing Indicators

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Sending Messages and Media | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Getting Started
SDK Overview
Event Handling
Working with Conversations
Sending Messages and Media
User Reachability Indicator
Read Horizon and Read Status Overview
Delivery Receipts Overview
Conversations Attributes
Modifying a Conversation, Message, or Participant
More SDK Resources
Migration Guides
Tutorials
Client-side SDKs
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
Enable the Reachability Indicator
Check the state of the Reachability Indicator
What's Next?
User Reachability Indicator

The Conversations SDKs include optional built-in presence functionality. You can use the Reachability Indicator feature to:
Check a Chat (SDK) User's status (i.e. online or offline)
Check if a User is notifiable via Push Notification
Receive SDK events when these statuses change
These properties will be available when you enable the Reachability Indicator feature.

Enable the Reachability Indicator
(information)
Info
By default, the Reachability Indicator state is disabled.
To turn on the Reachability Indicator, you'll need to use the REST API.
Once you enable the feature, Twilio will automatically update and synchronize the state. The Reachability Indicator properties are exposed on the User resource in the REST API and on User objects in the SDKs. They are "read-only", which means you can't modify these properties.

Check the state of the Reachability Indicator
You can check User objects to determine their current reachability status and push notification availability.
Updates to other User's Reachability Indicator states are also communicated via the update event on User objects and the userUpdated event on the Client object.
Any of the following events can change the Reachability Indicator state:
When a User goes online
When a User goes offline
When a User registers for push notifications
When a User unregisters from push notifications
(information)
Info
Online/Offline status may take up to a couple of minutes to become consistent with a user's actual state.
Listening for Reachability status
Node.jsTypescript
Report code block
Copy code block
/* Checking/listening to reachability */





// check if reachability function is enabled


if (!client.reachabilityEnabled) {


   // reachability function is disabled for the client


   return;


}





// listen to user reachability status updates


client.on("userUpdated", ({ user, updateReasons}) => {


   if (updateReasons.includes("reachabilityOnline")) {


       // user reachability status was updated


   }





   if (updateReasons.includes("reachabilityNotifiable")) {


       // user notifications status was updated


   }


})





const participants = await conversation.getParticipants();





participants.forEach(async (participant) => {


   const user = await participant.getUser();





   if (user.isOnline) {


       // conversation participant is online


   }





   if (user.isNotifiable) {


       // user has push notifications active


   }


});

What's Next?
Well done! You have learned about the User Reachability Indicator feature. As a following step, you can:
Explore the Read Horizon and Read Status Overview, or
Check the Delivery Receipts Overview guide.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
User Reachability Indicator | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Getting Started
SDK Overview
Event Handling
Working with Conversations
Sending Messages and Media
User Reachability Indicator
Read Horizon and Read Status Overview
Delivery Receipts Overview
Conversations Attributes
Modifying a Conversation, Message, or Participant
More SDK Resources
Migration Guides
Tutorials
Client-side SDKs
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
Set a Chat Participant's Read Horizon
Display a Participant's Read Horizon
What's Next?
Read Horizon and Read Status Overview

The Read Horizon feature helps to indicate how far along a particular Chat (SDK) Participant is in the Conversation.

Set a Chat Participant's Read Horizon
(information)
Info
The Read Horizon feature is not automatically set. You'll need to set it within your application.
You can mark all of a Conversation's Messages as read by calling the specific method on the Conversation object. For most implementations, marking all messages as read when a user views a particular Conversation in your application is sufficient.
You can also call a different method to set all messages in the Conversation to unread.
To set a Chat Participant's Read Horizon to a specific message, you'll need to retrieve the index property of the Message you want to set the horizon to and then call the appropriate method.
(information)
Info
Message indices are sequential (later messages will have a greater index than previous messages), but are not necessarily consecutive (indices between two messages may increment by more than 1).
You can also use an alternate method to advance the index of the last read message in a conversation to a specific index. This method only changes the Read Horizon if the index you provided is greater than the index that the Read Horizon is currently set to.
This action doesn't change the order of messages in the conversation. It only influences which messages are considered as having been viewed by a participant and which messages are still considered "unread."
Set Read Horizon
Node.jsTypescript
Report code block
Copy code block
/*


  Setting Read Horizon (all forms, like setAllRead, setNoneRead, advanceIndex, etc)


*/





// get a message from conversation


const message = await conversation.getMessages().items[5];





// advance the conversation's last read message index to the current read horizon - won't allow you to move the marker backwards


await conversation.advanceLastReadMessageIndex(message.index);





// set last read message index of the conversation to a specific message


await conversation.updateLastReadMessageIndex(message.index);





// Mark all messages read


await conversation.setAllMessagesRead();





// Mark all messages unread


await conversation.setAllMessagesUnread();

Display a Participant's Read Horizon
The Conversation SDK will report the Participant's read status and share it with other Participants in the Conversation.
To display how far a specific Participant has read in a Conversation, you will need to get the "last read message" value for that Participant within a Conversation. Once you have this value, you can render this however you want in your UI. For 1:1 messages, some type of checkmark or other visual indicator works well. For group conversations, you'll need to decide how to represent different read positions in the Conversation for each Participant.
From a Conversations list, you can get a specific content (Message) that another Participant has read, by referencing their last read message index.
You can count the number of unread Messages in a Conversation for a specific Participant. This is useful for displaying unread message counters in a list of Conversations.
Retrieve Read Horizon
Node.jsTypescript
Report code block
Copy code block
/*


  Retrieving/checking Read Horizon for rendering


*/





// get last read message index of your participant in the conversation


conversation.lastReadMessageIndex();





// get last read message index of another participant in the conversation


participant.lastReadMessageIndex();





// check the index of a message


message.index;





// get unread messages count for the user, that is, count of all the messages after message


await conversation.getUnreadMessagesCount();

What's Next?
You have finished reading the Read Horizon Overview guide. Let's continue learning more about Conversations:
Check out our advanced guide for Read Horizon and Read Status
Explore the Delivery Receipts Overview guide

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Read Horizon and Read Status Overview | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Getting Started
SDK Overview
Event Handling
Working with Conversations
Sending Messages and Media
User Reachability Indicator
Read Horizon and Read Status Overview
Delivery Receipts Overview
Conversations Attributes
Modifying a Conversation, Message, or Participant
More SDK Resources
Migration Guides
Tutorials
Client-side SDKs
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
What are Delivery Receipts?
Types of Delivery Receipt Message Statuses
Aggregated Delivery Receipts
Detailed Delivery Receipts
Delivery Receipts Error Handling
What's Next?
Delivery Receipts Overview

With the Delivery Receipts feature, you can obtain information about the status of Conversations Messages sent to non-Chat Participants (i.e. SMS and WhatsApp channels).
You can verify if the Messages were sent, delivered or even read (for OTT
) by other Conversations Participants.
Let's get started!

What are Delivery Receipts?
Delivery Receipts are summaries that contain detailed information about the messages sent to Participants in non-Chat channels.
This feature includes information about:
A summary of the Message's delivery statuses
The number of Messages sent
The number of Conversation Participants the message(s) was sent to

Types of Delivery Receipt Message Statuses
Delivery Receipts can contain the following message statuses:
sent
delivered
read
failed
undelivered

Aggregated Delivery Receipts
An Aggregated Delivery Receipt contains a general summary of the delivery statuses of a Message to all non-Chat Participants in the Conversation.
Use aggregated receipts to represent the overall delivery status of a Message.
You can retrieve the Aggregated Delivery Receipts summaries from any Message object in a Conversation that contains non-Chat recipients. This is often enough to confirm successful delivery of the message.
Aggregated Delivery Receipts
Node.jsTypescript
Report code block
Copy code block
/* Retrieving Delivery Receipts (aggregated and detailed) for rendering */





const aggregatedDeliveryReceipt = message.aggregatedDeliveryReceipt;





// get amount (DeliveryAmount) of participants with particular delivery status


const deliveredReceipts = aggregatedDeliveryReceipt?.delivered;


const failedReceipts = aggregatedDeliveryReceipt?.failed;


const readReceipts = aggregatedDeliveryReceipt?.read;


const sentReceipts = aggregatedDeliveryReceipt?.sent;


const undeliveredReceipts = aggregatedDeliveryReceipt?.undelivered;


// get the amount of participants which have the status for the message


const totalReceipts = aggregatedDeliveryReceipt?.total;





if (undeliveredReceipts !== "none") {


   // some delivery problems


   alert(`Out of ${totalReceipts} sent messages, ${deliveredReceipts} were delivered, ${failedReceipts} have failed.`);


}

Detailed Delivery Receipts
A Detailed Delivery Receipt represents the Message delivery status to a specific non-Chat Participant in the Conversation.
Use detailed receipts when you want to show the specific recipient who didn't receive the message.
You can also get a list of the Detailed Delivery Receipts by calling the correct method on the same object. This is useful if you want to render separate sent/delivered/read statuses for specific Participants.
Detailed Delivery Receipts
Node.jsTypescript
Report code block
Copy code block
// get the list of of delivery receipts


const detailedDeliveryReceipts = await message.getDetailedDeliveryReceipts();





const statusMap = {};





detailedDeliveryReceipts.map((detailedDeliveryReceipt) => {


   // get status of the delivery receipts


   const receiptStatus = detailedDeliveryReceipt.status;


   const participantSid = detailedDeliveryReceipt.participantSid;


   statusMap[participantSid] = receiptStatus;





});

Delivery Receipts Error Handling
Retrieving detailed receipts is necessary for error retrieval and handling. Each detailed receipt for a message that failed will contain a Twilio error code indicating the failure reason.
If the message status is failed or undelivered, you can handle the error code accordingly.
Read more in the Troubleshooting Undelivered Twilio SMS Messages support article.
Delivery Receipt Error Handling
Node.jsTypescript
Report code block
Copy code block
/* Checking delivery receipts for errors */





// get the list of aggregated delivery receipts


const aggregatedDeliveryReceipt = message.aggregatedDeliveryReceipt;





// retrieve delivery receipt status


if (aggregatedDeliveryReceipt.failed !== "none" || aggregatedDeliveryReceipt.undelivered !== "none") {


   // handle error


}





// get the list of delivery receipts


const detailedDeliveryReceipts = await message.getDetailedDeliveryReceipts();





detailedDeliveryReceipts.map((detailedDeliveryReceipt) => {


   // check delivery receipt status


   if (!detailedDeliveryReceipt.status === "undelivered" && !detailedDeliveryReceipt.status === "failed") {


       return;


   }





   // handle error. the error codes page: https://www.twilio.com/docs/sms/api/message-resource#delivery-related-errors


   if (detailedDeliveryReceipt.errorCode === 30006) {


       alert("The destination number is unable to receive this message.");


       return;


   }





   if (detailedDeliveryReceipt.errorCode === 30007) {


       alert("Your message was flagged as objectionable by the carrier.");


   }


});

What's Next?
Great work! You've learned the foundations of Delivery Receipts, you can continue with any of the following guides:
Learn about Conversations Attributes.
Explore the Modifying a Conversation, Message or Participant guide.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Delivery Receipts Overview | Twilio
 Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Getting Started
SDK Overview
Event Handling
Working with Conversations
Sending Messages and Media
User Reachability Indicator
Read Horizon and Read Status Overview
Delivery Receipts Overview
Conversations Attributes
Modifying a Conversation, Message, or Participant
More SDK Resources
Migration Guides
Tutorials
Client-side SDKs
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
Updating
Deleting
What's Next?
Modifying a Conversation, Message, or Participant

You can modify certain objects in the Conversations SDK (i.e. Conversation, Message, Participant) for connected Users with appropriate permissions.

Updating
You can update a Conversation object by calling one of the appropriate methods for your chosen language.
For the Conversation, Message, or Participant data object, you could update some specific properties. Please refer to Update a Conversation, Message or Participant code sample.
Update a Conversation, Message or Participant
Node.jsTypescript
Report code block
Copy code block
/* Updating Conversations/Messages/Participants */





/* Conversations */





await conversation.updateAttributes({});


await conversation.updateFriendlyName("foo");


await conversation.updateLastReadMessageIndex(0);


await conversation.updateUniqueName("foo");





/* Messages */





await message.updateAttributes([1, {foo: "bar"}]);


await message.updateBody("bar");





/* Participants */





await participant.updateAttributes({foo: 8});

Deleting
You can delete a Conversation object by calling the appropriate method for your chosen language. When you remove a Conversation object, all its Messages, attached Media, and Participants will be deleted.
If you want to only delete a Message from a Conversation, call the specific method to remove it from the Conversation, and destroy any attached Media.
If you want to only delete a Participant from a Conversation, call the specific method to remove them from the Conversation.
Delete a Conversation, Message or Participant
Node.jsTypescript
Report code block
Copy code block
/* Deleting and updating Conversations/Messages/Participants */





/* Conversations */





// destroys the conversation, with all its messages and attached media and removes all participants


await conversation.delete();





/* Messages */





// remove a message from the conversation, destroying any attached media


await message.remove();





/* Participants */





// remove participant from the conversation


await participant.remove();
When you delete a parent object, you will also delete its child object. For example, if you remove a Conversation, then all Messages and Participants will be automatically deleted. Once deleted, these resources are unrecoverable.
Check out our auto-generated documentation for more information about Conversations SDK methods and properties: JavaScript
, Android
 or iOS
.

What's Next?
Congratulations! 🎉 You've finished the getting started guides. Now, let's explore more Conversations SDK guides:
Learn about the Best Practices using the Conversations SDK.
Read about Error Handling and Diagnostic to help you debug your application.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Modifying a Conversation, Message, or Participant | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Getting Started
More SDK Resources
Initializing Conversations SDK Clients
Create Access Tokens for Conversations
User Identity & Active Users
Read Horizon and Read Status
Typing Indicator
Best Practices using the Conversations SDK
Error Handling and Diagnostics
Migration Guides
Tutorials
Client-side SDKs
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
Mobile SDKs (Android and iOS)
The JavaScript client
Knowing when the SDK is ready for use
JavaScript
iOS
Android
Troubleshooting
Access Tokens
What's Next?
Initializing Conversations SDK Clients

Initializing Conversations SDKs is an important step to ensure your client is ready for use on an end user's mobile or web device. The Conversations SDKs put necessary data in place and set up event handlers for new Messages and other events.
This guide covers how to initialize the Conversations SDKs, both for mobile and web.

Mobile SDKs (Android and iOS)
Once your Conversations Client is fully synchronized at client startup, the following is applicable:
The client is subscribed to events for all of the Participant's Conversations.
The Messages and Participants collections are available for querying.
(information)
Info
You must maintain a strong reference to the client object you received, keeping it in scope for the entirety of your usage of the Conversations Client.
Before releasing the client, it is important to release references to all objects created and returned by this Conversations Client (i.e., set all objects to nil) and to call the client's shutdown method to ensure proper cleanup of shared resources.
No previously existing Messages are fetched for the client on load. These will be loaded when you call the getMessages method to fetch Messages on demand. Messages are then cached and updated after loading.
Note: For the getMessages method, the default pageSize value is 30 and the maximum pageSize value is 100.
You receive feedback on client startup in two ways:
You will receive an asynchronous callback from the create client method when the client has been successfully created and is being synchronized.
You will receive an event to the client's listener or delegate via the synchronizationStatusUpdated method with a value of StatusCompleted. This is your indication that the client is ready for business and that all of the Participant's Conversations have been obtained and subscribed to.

The JavaScript client
Once a user logs into the client, the JavaScript client will retrieve the list of Subscribed Conversations in which the user is a Participant.
Some additional details on the JavaScript SDK behavior:
It will subscribe to notifications for changes to the Subscribed Conversations list itself
It will subscribe to events from each Subscribed Conversation in the list
It will retrieve the FriendlyName , UniqueName, and Attributes for each Subscribed Conversation in the list
It will not retrieve any Messages for individual Conversation
It will retrieve Participant lists for Conversations
It will not retrieve, nor subscribe to Users linked to Participants of Subscribed Conversations
It will retrieve a currently logged-in User object and subscribe to this User's events
To load Messages for a Subscribed Conversation and subscribe to other Conversation-level events you will need to load individual Conversations manually.

Knowing when the SDK is ready for use
It is important to know when the SDK Client has completed its initialization and is ready for use. Once the client is connected, you can configure your listeners, event handlers, and other logic.
This manifests slightly differently for each SDK as detailed below:
JavaScript
The Conversations Client is instantiated in one of two ways:
You can use promises directly:
Copy code block
Conversations.Client.create(token).then(client => {


// Use client


});
Or using the async/await pattern:
Copy code block
let client = await Twilio.Conversations.Client.create(token);


// Use client
iOS
First, we initialize the Conversations Client. Here we provide an initial Access Token:
Copy code block
NSString *token = <token goes here>;


__weak typeof(self) weakSelf = self;


[TwilioConversationsClient conversationsClientWithToken:token


   properties:nil


     delegate:<delegate>


   completion:^(TCHResult *result, TwilioConversationsClient *convoClient) {


       weakSelf.client = convoClient;


... }];
The iOS Conversations SDK then provides a TCHClientSynchronizationStatus delegate callback:
Copy code block
- (void)conversationsClient:(TwilioConversationsClient *)client


synchronizationStatusUpdated:(TCHClientSynchronizationStatus)status {


   if (status == TCHClientSynchronizationStatusCompleted) {


       // Client is now ready for business


   }


}
Android
The Android Conversations SDK provides a Listener Interface which you must implement to check the init status and completion of the SDK client.
Copy code block
ConversationsClient.Properties props = ConversationsClient.Properties.newBuilder().createProperties();





ConversationsClient.create(context.getApplicationContext(),


 accessToken,


 props,


 new CallbackListener<ChatClient>() {


   @Override


   public void onSuccess(final ConversationsClient client) {


     // save client for future use here


     client.addListener(new ConversationsClientListener() {


       @Override


       public void onClientSynchronization(ConversationsClient.SynchronizationStatus status) {


         if (status == ConversationsClient.SynchronizationStatus.COMPLETED) {


           // Client is now ready for business, start working


         }


       }


     });


   }


 });

Troubleshooting
Before we dive deeper into showing how to get your Participants engaged through different channels, it's important to know where to look for logs and additional information if you need it. We have a guide about Error Handling and Diagnostics that you may find helpful as you build your Conversations integration.

Access Tokens
All Conversations SDK clients need a valid Access Token in order to authenticate and interact with the Chat Service instance. You should generate the Access Token on your server. You can learn more about how to do that in the Access Token guide.
When instantiating the SDK client, you should use the Access Token that is returned by your backend. You will pass the Token string directly to the SDK Client constructor method.
The SDK also provides a method to update the Access Token, which is used when you need to update the Access Token before expiration. Please see the Creating Access Tokens guide for more information.

What's Next?
Now that you've gotten your SDK initialized on the client, check out the rest of the Conversations documentation.
Conversations Fundamentals
Creating Access Tokens
The Conversations REST API

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Initializing Conversations SDK Clients | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Getting Started
More SDK Resources
Initializing Conversations SDK Clients
Create Access Tokens for Conversations
User Identity & Active Users
Read Horizon and Read Status
Typing Indicator
Best Practices using the Conversations SDK
Error Handling and Diagnostics
Migration Guides
Tutorials
Client-side SDKs
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
Create an Access Token
Create Access Tokens for Conversations

This guide covers creating Access Tokens for use with the mobile and web Conversations SDK clients. An Access Token is the credential that your SDK client endpoints must use to identify and authenticate themselves with the default Chat Service instance underneath any Conversation.
If you haven't already, please read our guide on Conversations SDK client initialization mechanics, which introduces the need for a generated Access Token.
Your server or backend generates this Access Token when you authenticate a chat Participant in a Conversation. The Conversations SDK client then uses the token to authorize with the underlying Chat Service.

Create an Access Token
On your server, you must decide the two following things based on the token request that was sent from the SDK:
who the Participant is
what they should be allowed to do.
To figure out who the chat Participant is (their identity), you can use your existing login system, session cookies, an API token, or whatever mechanism you use to secure API requests or pages today. Who the chat Participant is and how you authorize their use will vary, depending on your specific application.
Once you determine that the chat Participant should indeed be allowed to access your Conversations application, you can grant that Participant access to Conversations by generating an Access Token as part of your authentication flow. You will then return the token to the user client for use in the Conversations SDK.
When creating an Access Token for Conversation, you will need the following information:
A Twilio Account SID
This is the Account SID of your Twilio account and must be the account in which you have created your Conversations Chat Service. (You can manage your Chat Services in the Twilio Console.)
Chat Service SID
This SID is the unique identifier for a Chat Service instance, where your Participants, Conversations, Messages and other Conversations-related data reside. This is the Chat Service you grant the SDK client access to.
Twilio API Key SID
This is the SID of an API Key created for your Twilio Account, which is used to sign the Access Token cryptographically. You can create these API keys in the console.
Twilio API Secret
This is the secret part of the API Key above, also managed in the Twilio console.
Identity
The identity of your chat Participant. For example, user@some-domain.com. For more details around Conversations' use of identity for Chat Participant, please refer to User Identity & Access Tokens.
We recommend following the standard URI specification and avoid the following reserved characters ! * ' ( ) ; : @ & = + $ , / ? % # [ ] for values such as identity and friendly name.
Creating an Access Token (Chat)
Node.jsPythonC#JavaGoPHPRuby
Report code block
Copy code block
const AccessToken = require('twilio').jwt.AccessToken;


const ChatGrant = AccessToken.ChatGrant;





// Used when generating any kind of tokens


// To set up environmental variables, see http://twil.io/secure


const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;


const twilioApiKey = process.env.TWILIO_API_KEY;


const twilioApiSecret = process.env.TWILIO_API_SECRET;





// Used specifically for creating Chat tokens


const serviceSid = process.env.TWILIO_CHAT_SERVICE_SID;


const identity = 'user@example.com';





// Create a "grant" which enables a client to use Chat as a given user,


// on a given device


const chatGrant = new ChatGrant({


 serviceSid: serviceSid,


});





// Create an access token which we will sign and return to the client,


// containing the grant we just created


const token = new AccessToken(


 twilioAccountSid,


 twilioApiKey,


 twilioApiSecret,


 {identity: identity}


);





token.addGrant(chatGrant);





// Serialize the token to a JWT string


console.log(token.toJwt());
Optional: TTL (Time To Live)
Access Tokens are only valid for a period of time, given in seconds. The default is 3600 seconds (1 hour), but we recommend adjusting it to several hours. The maximum TTL for a token is 24 hours.
Once your client receives an Access Token from your server, you can initialize the Twilio Conversations SDK and start sending and receiving messages, as covered in our guide to Initializing SDK Clients.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Create Access Tokens for Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Getting Started
More SDK Resources
Initializing Conversations SDK Clients
Create Access Tokens for Conversations
User Identity & Active Users
Read Horizon and Read Status
Typing Indicator
Best Practices using the Conversations SDK
Error Handling and Diagnostics
Migration Guides
Tutorials
Client-side SDKs
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
Determining User Identity
How many identities to use in Twilio Conversations
Active Users in Conversations
SDK Operations (i.e. from Browser, Mobile)
REST API Operations
Channel Operations
Minimizing Your Costs
User Identity & Access Tokens for Conversations

(information)
Info
The operations described in the Active Users in Conversations section yield charges because they register Users as "active."
In Twilio Conversations, an identity is unique to a User and may be signed in on multiple devices simultaneously.
For example, the identity "alice@example.com" for a given User will stay synchronized on a number of endpoints, including their iPhone, Android tablet and in-browser application. All destinations for the same User will receive identical Conversation and Message notifications, as well as display the same message history.
We recommend following the standard URI specification and avoid the following reserved characters ! * ' ( ) ; : @ & = + $ , / ? % # [ ] for values such as identity and friendly name.

Determining User Identity
On the server, you must decide two things based on the token request that you received:
who the User is
what they should be allowed to do
To figure out who the user is (their identity), you might use your existing login system or identity provider. You can use session cookies, an API token, or whatever mechanism you use to secure API requests or pages today.
You might not care who a User is at all, and assign them a temporary identity. Who the User is, what their role is, and how you determine that will vary from application to application.
If you determine that the User should indeed be allowed to access your Conversations application, you must grant your User access to a Conversation and supply an identity. Here are the guidelines on how to generate JWT access tokens: Creating Access Tokens.
How many identities to use in Twilio Conversations
Twilio Conversations also uses identity to track monthly usage and generate accounting reports. Therefore, you should be mindful about provisioning a reasonable amount of unique identities. Reusing identities too frequently and keeping uniqueness low may cause conflicts in the User and application logic. On the other hand, using only random identities will result in a large number of redundant unique Users, which also impacts monthly billing.

Active Users in Conversations
Twilio Conversations tracks unique User identities each month, and each unique identity connecting to a Conversation Service will create a User record. During a calendar month, if a User registers activity, they are considered "active." The following activities register Users as "active Users":
SDK Operations (i.e. from Browser, Mobile)
These apply specifically to the user identity described in the Conversations Token. A user is considered "active" and billed when:
Authenticating & connecting to Twilio infrastructure
Sending a Message
Joining or leaving a Conversation
REST API Operations
These apply equally to our backend helper libraries (Java, C#, Ruby, etc.). A User is considered "active" and billed when:
The User record is created or updated.
A Message is created, specifying this User as the "Author"
The User is added or removed as a Conversation Participant.
Channel Operations
We consider any native messaging address — e.g., phone numbers, WhatsApp numbers — an Active User when:
a message from that phone number (or other address) arrives in a Twilio Conversation.
a number or address is added to a Conversation

Minimizing Your Costs
The Twilio Conversations API is the infrastructure for your application. Your application's messaging experience uses this infrastructure to allow Users to exchange messages, to read old messages, or to check whether they have any new messages today. When optimizing your application for cost, your primary consideration should be whether the User gets value from participating in your messaging experience.
To that end:
Avoid creating the Conversations Client object (in the SDK) unless the user is getting value. Creating the Client object establishes a connection for the user and authenticates the User, making them "active" per the above.
Avoid unnecessary REST API updates to Users, such as changing User attributes that aren't actually visible to your users.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
User Identity & Access Tokens for Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Getting Started
More SDK Resources
Initializing Conversations SDK Clients
Create Access Tokens for Conversations
User Identity & Active Users
Read Horizon and Read Status
Typing Indicator
Best Practices using the Conversations SDK
Error Handling and Diagnostics
Migration Guides
Tutorials
Client-side SDKs
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
Setting an in-app chat Participant's Read Horizon
Explicitly set the Read Horizon for new Participants
Configure the interval time for read reports
How to display other Participants' Read Messages
What's next?
Read Horizon and Read Status in Conversations

In a Conversation, Participants often expect to see how far in the series of messages they and other Participants have read. The Read Horizon feature in Twilio Conversations allows the Read Status of a chat or WhatsApp Participant's Message to synchronize across devices and endpoints. By implementing the Read Horizon, your Conversations UI can indicate the last "read" message by a Participant in a Conversation.
(information)
Info
This guide applies to setting the Read Horizon for chat-based Conversations Participants. For non-chat Participants, consult our guide to Delivery Receipts in Conversations.

Setting an in-app chat Participant's Read Horizon
Using the Read Horizon feature, you can mark messages as "read" for a Participant in a Conversation. Within a Conversation, every chat Participant has their own Read Horizon, which indicates how far they have read; that horizon is under the control of your application.
Whenever you move the Read Horizon in the application, Twilio reacts by informing other Conversation SDKs that the horizon has advanced. This way, they can display how far the Participant has read.
The Conversations API provides the required information and methods for indicating and reading the status of Messages. These are used for building the Read Horizon into your application's UI.
In the browser and on mobile, detecting the moment a Participant has "read" a message depends on your application's user experience. For example, a Participant using a Conversations-backed chat application on their phone or in the browser will scroll through the messages as they read them. Using scrolling as a proxy for reading messages, your application's UI advances the Read Horizon, updating where the Participant has read with the UI indicator of your choice (e.g., a horizon line). Once the Read Horizon is updated, the SDKs will deliver that information to other Participants in the Conversation.
The Participant's lastReadMessageIndex determines their Read Horizon in a Conversation. This Participant property references the index property of a Message.
The same lastReadMessageIndex is also available from the REST API and can also be changed from your backend service.
Each client SDK provides a method that allows the Participant to send a Read Report; this supplies the Participant's last-read Message index for the Conversation.
Copy code block
// advance consumption horizon to arbitrary index


activeConversation.getMessages().then(function (messages) {


 if (messages.items.length > 10) {


   // Assume the UI displays the first 5 messages out of many


   // and client wants to mark those as read


   var someMessageIndex = messages.items[4].index;


   activeConversation


     .updateLastReadMessageIndex(someMessageIndex)


     .then(function () {


       // updated


     });


 }


});
In addition, there are two helper methods for the most commonly used operations in the Read Horizon feature:
Marking all Messages as read
You can use the setAllMessagesRead method to mark all Conversations Messages read.
Copy code block
// Mark all messages read


await activeConversation.setAllMessagesRead();
Marking read Messages back as unread
Use the setAllMessagesUnread method to mark all Conversations Messages as unread.
Copy code block
// Mark all messages unread


await activeConversation.setAllMessagesUnread();
Once you've started using the Read Horizons, you can also start counting unread messages. The Participant's unreadMessagesCount indicates the number of unread Messages in a Conversation for a Participant. This is useful for custom badge counts on your mobile app or for your background notifications.
Note: Indexes are not always consecutive, but they are always sequential.
Explicitly set the Read Horizon for new Participants
The Conversations SDKs do not automatically set the Read Horizon for chat Participants. If you do not explicitly set this within your application, no Read Horizon will exist for a chat Participant within a Conversation.
In other words, no messages will display a read or unread status. Additionally, without a Read Horizon, your Participant's read status (Read Horizon) will not synchronize across clients.
If a Participant in a Conversation has no read status, their last-read index and timestamp will be null or 0. If the Read Horizon hasn't been set, the following methods will return null on all platforms (Android, iOS, JavaScript):
Conversation.getLastReadMessageIndex for Android SDK and Conversation.lastReadMessageIndex for iOS and JavaScript SDKs
Conversation.getUnreadMessagesCount (asynchronous, so null is passed to the listener)
Participant.getLastReadMessageIndex for Android SDK and Participant.lastReadMessageIndex for iOS and JavaScript SDKs
Note: getUnreadMessageCount() returns a max count of 1000. If the active Participant has 1000 or more unread messages, you can render it as 1000+ in your UI.
Configure the interval time for read reports
Remember that chat-based Conversations Participants do not emit delivery receipt information automatically. Therefore, the Read Horizon must be set manually from the Conversations SDK.
Implementing the Read Horizon in your chat UI allows you to show a chat Participant how far they have read in the Conversation. Once you implement the Read Horizon, this consumption information is also batched and fanned out via the SDK client to other Participants.
The Conversations client SDKs batch read reports; they do not send them with every report submission API call. Instead, the batch sends are time-based with a default submission every 10 seconds.

How to display other Participants' Read Messages
You probably want to display how far other Participants have read in a Conversation. You can do this by referencing the "last read message" values on those other Participants. This allows you to build Conversations-backed applications that show who has seen which Messages.
Your Conversations SDK-based application will receive real-time notification whenever a Participant's Read Horizon advances. How this happens depends on the platform used by the remote Participant:
For WhatsApp Participants, Twilio advances the Read Horizon automatically when they observe a message in the WhatsApp application.
For browser- or mobile-based chat Participants, the application must tell Twilio when a Participant has scrolled far enough to indicate reading a message. From there, Twilio will trigger the real-time notification towards other Participants.
In other words, when you set the Read Horizon for a given Conversation Participant, the SDK will report that read status, fanning it out to other Participants in the Conversation.
For example, imagine a Conversation between two chat Participants: one joining from their chat application on their mobile device and another from a web-based chat interface.
Each Participant has their own Read Horizon. First and foremost, this tells each of them how far they themselves have read in the Conversation
That Read Horizon information is also published to all other Participants. Using that information, each Participant also can see how far the other Participants have read in the Conversation.
The following code is a sample of how you might display how far other Participants have read by using the Message Status.
Copy code block
// retrieve the list of members for the active channel


var participants = activeConversation.getParticipants();


// for each Participant, set up a listener for when the Participant is updated


participants.then(function (currentParticipants) {


 currentParticipants.forEach(function (participant) {


   // handle the read status information for this Participant


   // note: this UI method uses the provided information to render


   // this to the given Participant in the UI.


   updateParticipantMessageReadStatus(


     participant.identity,


     participant.lastReadMessageIndex,


     participant.lastReadTimestamp


   );


 });


});
To determine which content (Message) another Participant has read, reference their last_read_message_index. It is also possible to show when a Participant last set their Read Horizon by referencing their last_read_timestamp property. These are both properties on the Participant instance.
For real-time display, you can also use these two properties to show changes to all Participants' Read Horizons by listening to the participantUpdated event on a Conversation instance. When the participantUpdated event fires, your application can check the Participant's identity, lastReadMessageIndex, and lastReadTimestamp via the SDK. For example, this could be displayed with the following code sample:
Copy code block
// this code assumes you have a variable named activeConversation for


// the currently active channel in the chat UI


activeConversation.on("participantUpdated", function (event) {


 // your own UI method


 updateAppUI(


   event.participant.identity,


   event.participant.lastReadMessageIndex,


   event.participant.lastReadTimestamp


 );


});
Note: If the Read Horizon is not set for a Participant's Conversation Messages, other Conversation Participants will not know up to which message that Participant has read within the Conversation.

What's next?
This guide covers the basics of implementing a Read Horizon in Conversations-backed chat applications. For more information:
Read about delivery receipts for SMS and WhatsApp Participants
Learn more about Conversations Webhooks
Read up on Best Practices for using the Conversations SDKs

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Read Horizon and Read Status in Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Getting Started
More SDK Resources
Initializing Conversations SDK Clients
Create Access Tokens for Conversations
User Identity & Active Users
Read Horizon and Read Status
Typing Indicator
Best Practices using the Conversations SDK
Error Handling and Diagnostics
Migration Guides
Tutorials
Client-side SDKs
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
Sending Typing Indicator
Consuming Typing Indicator
What's Next?
Typing Indicator

The Conversations Typing Indicator feature enables typing signals to be sent for Participants from their client endpoints when they are typing within a Conversation.
These signals are then sent to all other connected Participants of the Conversation, allowing for UI features to be implemented, such as showing "User is typing..." style messages or indicators for Conversation Participants. Typing is always within the context of a Conversation and a Participant.
The Typing Indicator feature follows a producer/consumer model, with the Conversations SDKs exposing API methods to set when the User is typing in a Conversation. This is signaled via Conversations in real-time with other Participants of the Conversation, where events are fired for the typing event.
Sending Typing Indicator
Consuming Typing Indicator

Sending Typing Indicator
The Conversations Typing Indicator is always in relation to a Conversation - allowing Typing to be correctly indicated within the Conversation where the Participant is typing.
The Typing Indicator signal is not automatically sent by Conversations. The Typing Indicator must be explicitly sent using the relevant SDK API methods.
(warning)
Warning
To optimize network traffic, Conversations client endpoints will only send a Typing signal once every 5 seconds by default, even if the Typing API command is called more frequently. The send threshold value can be configured for a Service instance by setting the TypingIndicatorTimeout property of the Services resource. Note that reducing this value will cause more network traffic to be generated by client endpoints calling the Typing API.
To send the Typing Indicator from a web-based front end, the following JavaScript code can be used:
Copy code block
// intercept the keydown event


inputBox.on('keydown', function(e) {


 // if the RETURN/ENTER key is pressed, send the message


 if (e.keyCode === 13) {


   sendButton.click();


 } else {


   // else send the Typing Indicator signal


   activeConversation.typing();


 }


});

Consuming Typing Indicator
In order to display the Typing Indicator when other Participants are typing within a Conversation, the Typing Indicator Events must be consumed and processed by the clients. This is done by listening for the relevant Typing Indicator events/callbacks and processing these appropriately.
The Typing Indicator signal is not automatically sent by Conversations. Typing events will not be received if the Participant does not send them explicitly (see the section above on Receiving typing indicators).
Here is an example of listening for the Typing event and then processing this to display a "typing" message for the relevant Participant. You would implement your own updateTypingIndicator method:
Copy code block
//set up the listener for the typing started Conversation event


activeConversation.on('typingStarted', function(participant) {


   //process the participant to show typing


   updateTypingIndicator(participant, true);


});





//set  the listener for the typing ended Conversation event


activeConversation.on('typingEnded', function(participant) {


   //process the participant to stop showing typing


   updateTypingIndicator(participant, false);


});

What's Next?
Continue learning with the following guides:
Explore the advanced Read Horizon and Read Status guide
Learn How to enable Delivery Receipts

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Typing Indicator | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Getting Started
More SDK Resources
Initializing Conversations SDK Clients
Create Access Tokens for Conversations
User Identity & Active Users
Read Horizon and Read Status
Typing Indicator
Best Practices using the Conversations SDK
Error Handling and Diagnostics
Migration Guides
Tutorials
Client-side SDKs
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
The SDK lifecycle
Push registration and lifecycle
The JWT / JWE token lifecycle
JavaScript
Mobile SDKs specifics
Best Practices using the Conversations SDK

Twilio Conversations is a highly customizable and flexible product with powerful features, like cross-channel messaging and group texting. We've learned a lot from our customers, and this guide provides some known best practices to make implementation easier and reliable.
The Conversations client-side SDKs (JavaScript, Android, and iOS) operate by sending commands to the backend and by receiving updates from the backend over an independent channel, such as SMS, WhatsApp, or chat. This means that most asynchronous operations require you to asynchronously wait for an update event before you can see actual updated values on the front end.
(warning)
Warning
The Conversations client-side SDKs receive event-based updates regularly and need to be connected to the internet to function correctly. For a reasonable user experience, clients should have a minimum network bandwidth of 100kbps with lower than 200ms latency.

The SDK lifecycle
There is no need to implement a shutdown/create cycle on network drops because the SDK reconnects automatically after regaining network access.
There is no need to implement a shutdown/create cycle for going to the background and then returning to foreground. The SDK reconnects automatically after becoming the foreground app.
You only need to call shutdown when doing logout / login within the same SDK session.
It is highly recommended to create a new Conversations SDK instance: do not reuse the old instance for the new SDK initialization after shutting down inside the same session.

Push registration and lifecycle
Register for push notifications on every application start in order to avoid the cumbersome logic of checking whether registration for push notifications exists or not. To avoid excessive registrations, you can preserve the current device token as provided by the OS in the persistent memory. Then compare the token values on startup and re-register only if the tokens differ.
React to device token changes provided by the OS events (iOS, Android, and FCM in browsers support these events) and re-register with a new token.
Push registration Time-To-Live (TTL) is 1 (one) year of idle time; it is worth unregistering from push notifications using SDK methods when re-launching applications with a different chat identity. Otherwise, your app might receive pushes for the previously logged-in user.
Unregistering push notifications when uninstalling the application is still not fully solved. We rely on the OS to stop providing push notifications for the apps that are no longer installed. Currently, the guidance is to deregister push notifications once daily.
We recommend that you reallocate and release all objects referencing the old SDK instances as this may complicate the troubleshooting process.

The JWT / JWE token lifecycle
It is highly recommended to use several hours (up to 24H) for a token's TTL.
Tokens with TTL under five minutes (300 seconds) will not work reliably in the Twilio Conversations infrastructure. We recommend setting token TTL from at least 20 minutes and until 24 hours.
Implement any update token methods in whichever SDK you are working with, reacting to the token expiration events provided by SDKs.
We recommend that you pre-fetch the token and store it in temporary storage in case you would need faster startup. This way, you can save the round-trip time that it takes to fetch it from your token generator.
A token is the authorization to use your Conversations Service instance (and thus charge you for your Conversations API usage), so make sure to secure it properly.

JavaScript
Here are some additional details about the JavaScript SDK behavior:
The promise to create a Client is resolved after we start all connections, but not all Conversations are fetched.
Fetching of a user's subscribed Conversations starts asynchronously and continues after Client instance is resolved in the promise.
Due to points (1) and (2) above, in order to get the list of subscribed Conversations, you should first subscribe to the Client#conversationAdded event, and only after that, call the getSubscribedConversations method.
getSubscribedConversations is paginated. Hence, duplicated Conversations might arrive from two sources: from events and from this method call, it is up to the developer to resolve this duplication.
Note: for the getSubscribedConversations method, the pagination is set to 100 items per page.
A Conversation's Messages are not fetched on Conversation load automatically - so, only the Conversation#messageAdded event is emitted on new Messages.
If a customer deliberately fetched some messages, then Conversation#messageUpdated and Conversation#messageRemoved events are emitted only on those fetched messages.
Some methods are semi-real-time, i.e. guarded by caching with some lifetime. Calling them rapidly might not reflect their actual value, but will catch up after cached value expires:
Conversation.getParticipantCount()
Conversation.getMessagesCount()
Conversation.getUnreadMessagesCount()

Mobile SDKs specifics
The following practices apply to Android and iOS SDKs.
You could perform ConversationsClient operations only after the client has fully synchronized (you should have received the ConversationsClient.onClientSynchronization callback with status equivalent to .ALL → this means the synchronization operation has completed).
Similarly, you can perform operations on the Conversation only after the Conversation has completed the synchronization process.
When updating various attributes, you need to wait for the corresponding Updated event; otherwise, you may get stale data. All operations that take a listener or a delegate are asynchronous, so when you receive the successful result in the listener/delegate, it means the SDK has merely sent the command. And you must now wait for the actual Update event to arrive before you can see actual updated values.
All references to Conversations objects (Conversations, Participants, Messages, Users, etc) must be released prior to releasing ConversationsClient.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Best Practices using the Conversations SDK | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Getting Started
More SDK Resources
Initializing Conversations SDK Clients
Create Access Tokens for Conversations
User Identity & Active Users
Read Horizon and Read Status
Typing Indicator
Best Practices using the Conversations SDK
Error Handling and Diagnostics
Migration Guides
Tutorials
Client-side SDKs
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
Token and Connection Errors
Error Handling in the SDK
iOS Error Handling - Objective-C, Swift
Android Error Handling - Java
JavaScript Error Handling
Logging
iOS Logging (Objective C or Swift)
Android Logging - Java
JavaScript Logging
Evaluating Logs
Error Handling and Diagnostics

If you encounter issues with Twilio Conversations, we've provided the following diagnostics tips to help get you back on track. These tips are also valuable in providing logs and details to Twilio Support.

Token and Connection Errors
Two of the most common problems that we encounter with Conversations are bad credentials and webhook errors. Your best resource to debug these issues is to use the Twilio Error Logs
in your Twilio console. The Error Logs contain detailed information about your activity within your application. This log can help you understand which Twilio resources were impacted.
To get the Error Logs, open the Twilio console,
 click on Monitor, then on Logs and finally Error logs:

Expand image
In the Error logs screen, you can see the detailed logs filtered by dates. You can click on an event in the Error Logs and see the properties of the message that encountered an error, such as your resource SID, timestamp and any warnings or errors thrown by Twilio. This page also includes possible causes and resolutions, a detailed error description and a request inspector.
The errors listed here will often be more helpful and specific than the errors returned by the SDK, so it may help debug situations happening at a distance.

Error Handling in the SDK
It's always challenging and frustrating to confront an unclear or ambiguous error. To avoid this, make sure that your SDK is handling errors properly: make the error visible either by printing to the console or by rendering a message in the UI. Error handling varies by SDK platform, but each platform gives feedback about the success of operations and the client's state in one or more of the following ways:
Callback blocks or listeners provided when you call methods on the SDK
Exceptions raised or thrown by SDK methods
Delegates or listeners associated with either your SDK client or individual SDK-provided objects
You should ensure you are verifying the success of any result objects returned through completion blocks or handlers. It is also important to implement error handling for unexpected errors in addition to errors that are not the direct result of a call to the SDK.
We recommend that you implement the client's connection state update method to detect when the client loses network connectivity. Today, operations performed while the client is not connected will fail unless connectivity returns it quickly. Preventing your application from operating on the client while it is offline is a best practice for ensuring your operations succeed as expected.
As Twilio Conversations and Programmable Chat SDKs share the same infrastructure, you may see some errors described in a "chatty" way. If you see the error message containing Channel or Member-related information, it means you are dealing with Conversation or Participant, respectively.
iOS Error Handling - Objective-C, Swift
Objective-C and Swift both use the same approach to error reporting and handling, though the syntax differs by language.
The Conversations client's errorReceived method is the first diagnostic method you should implement. This method will be called during client creation if any error occurs. If client initialization fails and a nil client is returned, this method will be called with an explanation of why the creation failed.
You must pass in a delegate
 on client creation in iOS even if your application changes this delegate later. This ensures that you receive this callback, since it may be called before the initial client creation method completes.
Most operations that can be performed on objects in Conversations for iOS return a TCHResult object to their completion block. This includes operations against Conversations, Messages, and Participants. This object contains an isSuccessful method as well as an error property which will be populated with an error should the operation fail. Your application should check for this error and never disregard it. Provide a completion block to methods, even if you do not need a reference to the resulting object, to verify that your request was successful.
On iOS, connection state changes are sent to the client's delegate with the connectionStateChanged method.
Android Error Handling - Java
On Android, all asynchronous functions receive a StatusListener whose onError(ErrorInfo) method must be implemented in order to receive error information. Check for these errors during your application's runtime. You should always provide a StatusListener to methods, even if you do not intend to use the resulting object, to verify that your request was successful.
The Client creation method does not return a new Client instance right away - instead, the instance gets returned in the CallbackListener's onSuccess() callback to prevent misuse.
Connection state changes are sent to the client's ConversationClientListener (which you can set with client.setListener()) with the onConnectionStateChange method.
JavaScript Error Handling
General error handling uses standard JavaScript mechanisms. Most of these library methods are asynchronous and return promises.
In the case of an error, the promise will pass an instance of the JS Error class (or its ancestor) to the catch handler if specified. Additionally, Twilio error classes provide a numeric error code property to make it easier to identify specific problems.
The standard way to handle errors in promise-based syntax looks like this:
Copy code block
client.getMessages()


 .then(messagesPage => { do something here })


 .catch(e => { console.error('Got an error:', e.code, e.message); });
Connection state changes are surfaced via the client#connectionStateChanged event. Denied is the most important state to pay attention to, since it indicates a problem with the Access Token. The Denied state necessitates a new token.

Logging
Conversations default log level is SILENT, which is often appropriate for production. However, when evaluating errors during development or building a log for Twilio support, we'll need more information. The Conversations Team at Twilio suggests changing this level to DEBUG in such situations (VERBOSE is often too distracting.).
How you set the Conversations log level depends on your platform.
(information)
Info
When reporting logs to Twilio Support, it is essential that logs not be truncated or filtered. Information before or after the lines displaying a particular fault is often critical for reproducing the issue. If you have sensitive application information in the log unrelated to Twilio, you may remove or obfuscate it, but otherwise, we recommend unmodified logs.
Given full logs may contain still-valid access tokens, we do *not* recommend posting logs in public forums and instead suggest either 1:1 messages to Twilio support or opening a ticket
.
iOS Logging (Objective C or Swift)
Since logging starts as soon as the client is created, we expose the log level as a static value on the client. We recommend calling this before accessing TwilioConversationsClient the first time.
Copy code block
// Objective C


[TwilioConversationsClient setLogLevel:TCHLogLevelDebug];





// Swift


TwilioConversationsClient.setLogLevel(.debug)
Android Logging - Java
Copy code block
// Before creating a new ConversationsClient with ConversationsClient.create() add this line:


ConversationsClient.setLogLevel(ConversationsClient.LogLevel.VERBOSE);
If you wish to send log information to Twilio, see our Android guidelines for collecting logs
.
JavaScript Logging
JavaScript passes a clientOptions variable object to the Conversations client at the time of creation specifying the log level:
Copy code block
let clientOptions = { logLevel: 'debug' };


Twilio.Conversations.Client.create(token, clientOptions).then(conversationsClient => {


   // Use Conversations client


});

Evaluating Logs
Often you can track down issues by evaluating your logs.
In particular, searching your log for 4xx and 5xx errors such as 401 can be helpful in troubleshooting issues. Generally speaking, a 401 error will indicate a permissions issue - either for the particular object you are interacting with or your entire session if the 401 is related to your access token.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Error Handling and Diagnostics | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Getting Started
More SDK Resources
Migration Guides
Migrating from Programmable Chat
Migrating your Chat Android SDK to Conversations
Migrating your Chat iOS SDK to Conversations
Tutorials
Client-side SDKs
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
Conceptual differences between Conversations and Programmable Chat
Conversations is multichannel
Chat Services become Conversation Services
All Conversations are private
Invite Permission are not available in Conversations
Vocabulary changes between Programmable Chat and Conversations
What happens to my data when I move to Twilio Conversations?
Updating your application code for Conversations
Move from Programmable Chat Channels to Conversations
Upgrade to the Conversations SDK
Use helper library versions that include the Conversations resources
Referencing renamed features
Available features in Programmable Chat and Conversations
What's next?
Migrating to Conversations from Programmable Chat

So, you've decided to build with the Twilio Conversations API. If you've already built applications with Twilio Programmable Chat, many of the concepts, resources, and metaphors in Conversations are already familiar to you.
For existing customers, the good news is that the Conversations API is built on the Programmable Chat foundation, and most of your existing messaging and user data is going to be made available automatically, with no data migration required. However, there are a few key changes you'll want to make to your application in order to migrate as smoothly as possible.
(information)
Working on a Flex Application?
Good news, you can stop here! Flex applications don't need to be migrated to Conversations today. The Chat API will continue to work for Flex applications beyond the scheduled EOL.

Conceptual differences between Conversations and Programmable Chat
Twilio Conversations and Programmable Chat share many of the same concepts and even method calls, but in order to support cross-channel messaging, there are a handful of key differences to keep in mind as you build.
Conversations is multichannel
In Conversations, chat becomes one of many "channels" for communication. A channel in Conversations is not a resource; it is the method by which a Participant joins a Conversation, such as SMS, WhatsApp, or chat.
Unlike in Programmable Chat, in Conversations, you can build messaging experiences that connect users from multiple channels. For example, a customer on their phone can send SMS messages that a customer service agent receives through a web chat interface on their computer. On the other hand, you can build single-channel Conversations, such as Conversations between only chat Participants or SMS Participants.
To add SMS or WhatsApp Participants to a Conversation that was previously a Chat Channel, you will need to update the Conversation with a Messaging Service SID. A Messaging Service is a Messaging Resource that is required to enable the usage of Conversations Webhooks and bundle multiple sender types together.
Chat Services become Conversation Services
As part of this migration, Programmable Chat Services become "Conversation Services." You can fetch these Services through the REST API with the same Service SIDs (ISXXX…) and Conversations (CHXXX…), just like before.
As with Programmable Chat, you can use any number of Services in Conversations. The same rules apply: the data is not shared between Services.
For convenience, Twilio Conversations introduces a single "default" Service that appears in the REST API at the account level, linked to your Account SID (ACXXX…) If your app only relies on a single Conversation Service instance, you could choose that Service as the default. In order to set your migrated service as the default, accessible via the REST API at the account level, select it from the "Default Conversations Service" list in Developer Console
, or switch the DefaultChatServiceSid parameter using the Configuration API resource. To separate your Conversations by use case, you can also create sub-accounts.
You can read more about Conversations Services in our guide to Conversations Fundamentals.
All Conversations are private
All Conversations are private; this is a change from the concept of public vs. private Channels in Twilio Chat.
Public Chat Channels do not exist in the Conversations API. This means that existing public Chat Channels are not visible in Conversations. Please plan accordingly. If there are any public Chat Channels that you wish to use in Conversations, you can migrate them to Conversations using this API.
If you no longer need public Channels in Conversations, you can leave them; public Channels won't be visible in Conversations.
Invite Permission are not available in Conversations
Roles in Conversations do not have the inviteMember permission from a Chat Role. However, a Conversation Participant with sufficient permissions can add another Participant to a Conversation.

Vocabulary changes between Programmable Chat and Conversations
Please be aware of the following vocabulary changes in your migration from Programmable Chat to Conversations:
Programmable Chat
Conversations
Channels
Conversations
Members
Participants
Messages
Messages
Users
Users
Roles
Roles
Chat Service
Conversation Service


What happens to my data when I move to Twilio Conversations?
Most customer data from Programmable Chat (such as Services, Channels, Users, and Roles) are available in Conversations automatically.
For example, Programmable Chat Channels become Conversations. You can retrieve them by making a GET request to the Conversations resource or fetching a single Conversation by its SID. Conveniently, the Conversation SID is the same as the Chat Channel SID; it will look like CHXXX...
If you are building a chat-only Conversations (not connecting SMS Participants, for example), all of your data is already available in Conversations. There is no migration required.
To learn more about migrating from Twilio Programmable Messaging to Conversations, please see our guide about Inbound Message Handling and Autocreation.
Read all Conversations
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function listConversation() {


 const conversations = await client.conversations.v1.conversations.list({


   limit: 20,


 });





 conversations.forEach((c) => console.log(c.accountSid));


}





listConversation();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "conversations": [


   {


     "sid": "CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "friendly_name": "Home Repair Visit",


     "unique_name": null,


     "attributes": "{ \"topic\": \"feedback\" }",


     "date_created": "2015-12-16T22:18:37Z",


     "date_updated": "2015-12-16T22:18:38Z",


     "state": "active",


     "timers": {


       "date_inactive": "2015-12-16T22:19:38Z",


       "date_closed": "2015-12-16T22:28:38Z"


     },


     "bindings": {},


     "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


     "links": {


       "participants": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",


       "messages": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",


       "webhooks": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks",


       "export": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Export"


     }


   }


 ],


 "meta": {


   "page": 0,


   "page_size": 50,


   "first_page_url": "https://conversations.twilio.com/v1/Conversations?PageSize=50&Page=0",


   "previous_page_url": null,


   "url": "https://conversations.twilio.com/v1/Conversations?PageSize=50&Page=0",


   "next_page_url": null,


   "key": "conversations"


 }


}
Fetch a single Conversation
Node.jsPythonC#JavaGoPHPRubytwilio-clicurl
Report code block
Copy code block
// Download the helper library from https://www.twilio.com/docs/node/install


const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";





// Find your Account SID and Auth Token at twilio.com/console


// and set the environment variables. See http://twil.io/secure


const accountSid = process.env.TWILIO_ACCOUNT_SID;


const authToken = process.env.TWILIO_AUTH_TOKEN;


const client = twilio(accountSid, authToken);





async function fetchConversation() {


 const conversation = await client.conversations.v1


   .conversations("CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")


   .fetch();





 console.log(conversation.accountSid);


}





fetchConversation();
Response
Note: This shows the raw API response from Twilio. Responses from SDKs (Java, Python, etc.) may look a little different.
Copy response
{


 "sid": "CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",


 "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "chat_service_sid": "ISaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "friendly_name": "My First Conversation",


 "unique_name": "first_conversation",


 "attributes": "{ \"topic\": \"feedback\" }",


 "date_created": "2015-12-16T22:18:37Z",


 "date_updated": "2015-12-16T22:18:38Z",


 "state": "active",


 "timers": {


   "date_inactive": "2015-12-16T22:19:38Z",


   "date_closed": "2015-12-16T22:28:38Z"


 },


 "bindings": {},


 "url": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",


 "links": {


   "participants": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Participants",


   "messages": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages",


   "webhooks": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Webhooks",


   "export": "https://conversations.twilio.com/v1/Conversations/CHaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Export"


 }


}

Updating your application code for Conversations
Move from Programmable Chat Channels to Conversations
Your existing Channels in Programmable Chat will migrate to Twilio Conversations; all Channels are visible in Conversations.
However, there are two things to keep in mind:
Public Chat Channels will not be visible or available through the Conversations REST API because all Conversations are private.
Before you can include non-chat Participants (SMS or WhatsApp), you'll need to attach a Messaging Service SID to the newly migrated Conversation.
Upgrade to the Conversations SDK
If you are currently building with one of the Chat SDKs (JavaScript, Android, or iOS), update your dependency file by replacing it with the corresponding version of the Conversations SDK:
JavaScript SDK


iOS SDK


Android SDK


Use helper library versions that include the Conversations resources
To access the Conversations REST API, make sure that you update our helper libraries ("server-side SDKs") to at least these versions:
Python
 6.45.3
NodeJS
 3.49.3
Java
 7.55.3
PHP
 6.10.3
Ruby
 5.40.3
C#
 5.47.1
Referencing renamed features
As mentioned above, some features in Chat have been renamed in Conversations. For example, rather than referencing a Channel, Conversations calls the equivalent resource a Conversation.
In your application code, we suggest the following adjustments:
Instead of ChatClient, you should import and refer to a ConversationsClient when you use one of the client-side SDKs (JavaScript, iOS, and Android)
Wherever you used to refer to Channels, you should refer to Conversations (REST API).
Where you had a Chat Member object, you will now have a Conversations Participant object (REST API)

Available features in Programmable Chat and Conversations
Feature
Chat
Conversations
In-App chat functionality Build chat-based experiences for the browser and mobile using our SDKs
✅
✅
Public Channels/Conversations A public Channel is seen and can be joined by non-members. All Conversations are private; the Participant must be a part of Conversation to view the messages.
✅
No
Invites With this feature participants are asked to join a conversation and must approve the request before being added.
✅
No
Multichannel Messaging Conversations supports cross-channel messaging over SMS, MMS, chat, and WhatsApp
No
✅
Delivery Receipts Status of the Message: sent, delivered, read, failed, undelivered. These are rendered in Messaging Insights and via webhook for troubleshooting and understanding message engagement.
No
✅
States & Timers State of the conversation: active, inactive and closed. Timers are set to automatically transition from state to state. These features allow employees to focus on active threads and limit the number of unused conversations.
No
✅
Group MMS ("Group Texting") Supports a native group texting conversation of up to four participants using MMS. This feature is only available in the US and Canada.
No
✅
Multiple Services Support Businesses may wish to use multiple Services for different use cases or, in the case of ISVs developing on Conversations, a different Service for each organization.
✅
✅
Push (+ related bindings and credentials) This feature allows chat participants to be notified with mobile push notifications.
✅
✅
Reachability Reachability indicates the availability of a chat participant. Participants can toggle between available and unavailable for message routing purposes.
✅
✅
Consumption Horizon (now "Read Horizon and Read Status") The Conversations API will automatically synchronize "read" status among participants. This replaces Chat's "consumption horizon", and adds automatic read statuses from channels that provide them, like WhatsApp.
✅
✅
Unread Message Counts Programmable Chat displays the number of unread messages per channel. The Conversations API displays the number of Conversations with unread messages.
✅
✅
Per-Service Webhook Configuration Conversations allows one webhook target to be assigned globally for your account, as well as unique per-Conversation webhooks. Chat had scoped webhooks and per-service webhook targets (no global option).
✅
✅


What's next?
With Twilio Conversations, you can still build the Programmable Chat experiences that your end users know and love...but with more features and the ability to connect participants over SMS, WhatsApp, and chat.
After migrating, take a look at the following documentation to build more feature-rich Conversations today:
Using WhatsApp with Conversations
Group Texting in Conversations
The Conversations Quickstart
Using States & Timers in Conversations

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Migrating to Conversations from Programmable Chat | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Getting Started
More SDK Resources
Migration Guides
Migrating from Programmable Chat
Migrating your Chat Android SDK to Conversations
Migrating your Chat iOS SDK to Conversations
Tutorials
Client-side SDKs
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
Update supported Java version
Rename imports
Rename entities
Remove or replace not supported methods
Refactor method calls
Rename consumptionHorizon to readHorizon
Update Listeners syntax in Kotlin
Migrate your Chat Android SDK to Conversations

We are happy you decided to migrate your Programmable Chat Android SDK to Conversations. It is a great decision and this guide will simplify the process a lot. You will need to perform several rather mechanical changes to convert your existing application code utilizing Twilio Chat to Conversations. One thing is important here, you will need to use Programmable Chat Android SDK 6.0.0 as a minimal version to be able to migrate without any breaking changes.

Update supported Java version
Add to your project's build.gradle the following compile options, necessary to use Java8 syntax features:
Copy code block
compileOptions {


   sourceCompatibility JavaVersion.VERSION_1_8


   targetCompatibility JavaVersion.VERSION_1_8


}





// Also if kotlin is used in the project


kotlinOptions {


   jvmTarget = '1.8'


}

Rename imports
Rename java package imports from com.twilio.chat to com.twilio.conversations

Rename entities
ChatClient to ConversationsClient
Channel to Conversation
Member to Participant

Remove or replace not supported methods
Public channels: ConversationsClient.getConversation(sid) now returns error code CONVERSATION_NOT_FOUND if channel with the given SID is public.
Media.download() is removed, use Message.getMediaContentTemporaryUrl() instead.
getSubscribedChannelsSortedBy() method. Sort list returned by ConversationsClient.getMyConversations() instead.
ChannelDescriptor, UserDescriptor are not needed anymore and removed. Use Conversation and User objects instead.
Paginator class is not used anymore and is removed.
Invites to a channel are not supported. Use Conversation.addParticipantByIdentity() and addParticipantByAddress() instead.
onConversationJoined() callback is temporarily removed. Use onConversationAdded() instead.
Conversation doesn't implement Parcelable interface anymore. Instead store Conversation objects in your ViewModel or Repository following the Recommended app architecture
. Use Conversation.sid as unique key if necessary to pass around and retrieve the Conversation information.

Refactor method calls
someMethod() here indicates any of the methods existing previously on certain objects, now they are slightly moved to make API more convenient to use.
ChatClient.getChannels().someMethod() becomes ConversationsClient.someMethod()
Channel.getMembers().somMethod() becomes Conversation.someMethod()
Channel.getMessages().someMethod() becomes Conversation.someMethod()
Message.getMedia().someMethod() becomes Message.getMediaSomeMethod()
ChatClient.getUsers().someMethod() becomes ConversationsClient.someMethod()
ChatClient.getSubscribedChannels() becomes ConversationsClient.getMyConversations()

Rename consumptionHorizon to readHorizon
This highlights the fact that this horizon is best useful for implementing messages that have been read. Delivery horizon could be implemented through a combination of delivery receipts and custom attributes on messages.
getLastConsumedMessageIndex() → getLastReadMessageIndex()
setNoMessagesConsumedWithResult() → setAllMessagesUnread()
setAllMessagesConsumedWithResult() → setAllMessagesRead()
setLastConsumedMessageIndexWithResult() → setLastReadMessageIndex()
advanceLastConsumedMessageIndexWithResult() → advanceLastReadMessageIndex()
getUnconsumedMessagesCount() → getUnreadMessagesCount()
getLastConsumedMessageIndex() → getLastReadMessageIndex()
getLastConsumptionTimestamp() → getLastReadTimestamp()
UpdateReason.LAST_CONSUMED_MESSAGE_INDEX → UpdateReason.LAST_READ_MESSAGE_INDEX
UpdateReason.LAST_CONSUMED_MESSAGE_TIMESTAMP → UpdateReason.LAST_READ_TIMESTAMP

Update Listeners syntax in Kotlin
CallbackListener, StatusListener and ProgressListener are now interfaces (not abstract classes). Remove constructor invocation in Kotlin code to make it compile:
Copy code block
object : StatusListener() { … }
becomes
Copy code block
object : StatusListener { … }

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Migrate your Chat Android SDK to Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Getting Started
More SDK Resources
Migration Guides
Migrating from Programmable Chat
Migrating your Chat Android SDK to Conversations
Migrating your Chat iOS SDK to Conversations
Tutorials
Client-side SDKs
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
Update your CocoaPods or Carthage dependency
Rename project imports
Rename entities
Refactor method calls
Client
Users
Channel
Channels
Members
Messages
Remove or replace unsupported methods
New APIs
Added aggregated delivery receipts
Added conversation state
Rename consumptionHorizon to readHorizon
Media changes
Other changes
Migrate your Chat iOS SDK to Conversations

(information)
Info
If you are not using >=4.0.0 of our Chat SDK (or later), please follow the appropriate migration guides to get to v4+ before following this guide.
We are happy you decided to migrate your Programmable Chat iOS SDK to Conversations. It is a great decision and this guide will simplify the process a lot. The bulk of the work is primarily renaming, which will be covered here. You should also review this companion guide that covers the high-level changes and new APIs in Conversations.

Update your CocoaPods or Carthage dependency
CocoaPodsCarthage
Copy code block
# Replace





pod "TwilioChatClient"





# with





pod "TwilioConversationsClient"



Rename project imports
SwiftObjective-C
Copy code block
import TwilioChatClient





// becomes





import TwilioConversationsClient



Rename entities
TCHTwilioChatClient becomes TCHTwilioConversationsClient
TCHChannel becomes TCHConversation
TCHMember becomes TCHParticipant
TCHClientSynchronizationStatusChannelsListCompleted becomes TCHClientSynchronizationStatusConversationsListCompleted

Refactor method calls
Intermediate accessor objects were removed so your code will look cleaner.
Client
SwiftObjective-C
Copy code block
TwilioChatClient.chatClient(withToken:properties:delegate:completion:)





// becomes





TwilioConversationsClient.conversationsClient(withToken:properties:delegate:completion:)





Users
SwiftObjective-C
Copy code block
TwilioChatClient.users.subscribedUser(withIdentity:completion:)





// becomes





TwilioConversationsClient.subscribedUser(withIdentity:completion:)


Channel
SwiftObjective-C
Copy code block
Channel.member(withIdentity:)





// becomes





Conversation.participant(withIdentity:)


Channels
SwiftObjective-C
Copy code block
TwilioChatClient.channels.subscribedChannels()


// becomes


TwilioConversationsClient.myConversations()





//-------------------------------------------------------------





TwilioChatClient.channels.createChannel(options:completion:)


// becomes


TwilioConversationsClient.createConversation(options:completion:)





//-------------------------------------------------------------





TwilioChatClient.channels.channel(withSidOrUniqueName:completion:)


// becomes


TwilioConversationsClient.conversation(withSidOrUniqueName:completion:)


Members
SwiftObjective-C
Copy code block
Channel.members.members(completion:)


// becomes


Conversation.participants()





//-------------------------------------------------------------





Channel.members.add(byIdentity:completion:)


// becomes


Conversation.addParticipant(byIdentity:attributes:completion:)





//-------------------------------------------------------------





Channel.members.remove(_:completion:)


// becomes


Conversation.removeParticipant(_:completion:)


Messages
SwiftObjective-C
Copy code block
Channel.messages. sendMessage(with:completion:)


// becomes


Conversation.sendMessage(with:completion:)





//-------------------------------------------------------------





Channel.messages.removeMessage(_:completion:)


// becomes


Conversation.removeMessage(_:completion:)





//-------------------------------------------------------------





Channel.messages.getLastMessages(withCount:completion:)


// becomes


Conversation.getLastMessages(withCount:completion:)





//-------------------------------------------------------------





Channel.messages.getMessagesBefore(_:withCount:completion:)


// becomes


Conversation.getMessagesBefore(_:withCount:completion:)





//-------------------------------------------------------------





Channel.messages.getMessagesAfter(_:withCount:completion:)


// becomes


Conversation.getMessagesAfter(_:withCount:completion:)





//-------------------------------------------------------------





Channel.messages.message(withIndex:completion:)


// becomes


Conversation.message(withIndex:completion:)





//-------------------------------------------------------------





Channel.messages.message(forConsumptionIndex:completion:)


// becomes


Conversation.message(forReadIndex:completion:)





//-------------------------------------------------------------





Channel.messages.lastConsumedMessageIndex


// becomes


Channel.lastReadMessageIndex





//-------------------------------------------------------------





Channel.messages.setLastConsumedMessageIndex(_:completion:)


// becomes


Conversation.setLastReadMessageIndex(_:completion:)





//-------------------------------------------------------------





Channel.messages.advanceLastConsumedMessageIndex(_:completion:)


// becomes


Conversation.advanceLastReadMessageIndex(_:completion:)





//-------------------------------------------------------------





Channel.messages.setAllMessagesConsumedWithCompletion(_:)


// becomes


Conversation.setAllMessagesReadWithCompletion(_:)





//-------------------------------------------------------------





Channel.messages.setNoMessagesConsumedWithCompletion(_:)


// becomes


Conversation.setAllMessagesUnreadWithCompletion(_:)

Remove or replace unsupported methods
Channels subscribedChannelsSortedBy
Channels userChannelDescriptorsWithCompletion
Channels publicChannelDescriptorsWithCompletion
Members inviteByIdentity:completion:

New APIs
SwiftObjective-C
Copy code block
// added


Conversation.addParticipant(byAddress:proxyAddress:attributes:completion:)





// added


Conversation.removeParticipant(byIdentity:completion:)



Added aggregated delivery receipts
You can get delivery receipts for each SMS or WhatsApp message to understand the current status of delivery.

Added conversation state
Conversations now have state.
Added update reason TCHConversationUpdateState.
Current state of conversation you can get by calling Conversation.state()

Rename consumptionHorizon to readHorizon
Update reasons
TCHChannelUpdateLastConsumedMessageIndex becomes TCHConversationUpdateLastReadMessageIndex
TCHParticipantUpdateLastConsumedMessageIndex becomes TCHParticipantUpdateLastReadMessageIndex
TCHParticipantUpdateLastConsumedTimestamp becomes TCHParticipantUpdateLastReadTimestamp
Channel.getUnconsumedMessagesCountWithCompletion becomes Conversation.getUnreadMessagesCountWithCompletion
Member.lastConsumedMessageIndex becomes Participant.lastReadMessageIndex
Member.lastConsumptionTimestamp becomes Participant.lastReadTimestamp
Member.lastConsumptionTimestampAsDate becomes Participant.lastReadTimestampAsDate

Media changes
There are no more streams used to download media. Instead, you'll retrieve a temporary data URL to download it.
SwiftObjective-C
Copy code block
getMediaContentTemporaryUrl(completion:)



Other changes
Public conversations are unavailable for Conversations SDK, conversationWithSidOrUniqueName returns an error if the conversation is public.
TCHChannelType is removed.
Instead of removed subscribedChannelsSortedBy method, sort the list returned from myConversations.
TCHChannelDescriptor, TCHUserDescriptor were removed. Use TCHConversation and TCHUser objects instead.
Paginators were removed
Invites are not supported by Conversations SDK. Use addParticipantByIdentity and addParticipantByAddress instead.
TCHConversationStatus could be now either joined or notParticipating.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Migrate your Chat iOS SDK to Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Connecting Twilio Studio to Conversations
Using Facebook Messenger with Conversations
Trying Out WhatsApp with Conversations
Using Google Dialogflow with Conversations
Client-side SDKs
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
Building a Studio Flow
Add Widgets to the Canvas
Connecting to Conversations
Autocreating Conversations
Existing Conversations
Optional: Importing Flow Data from JSON
What's Next?
Connecting Twilio Studio to Conversations

Twilio Studio is a flexible low-code/no-code application builder for creating your own chatbots and interaction flows triggered by an incoming message from an end-user. You can leverage Studio to automate some level of interaction with your users.
By connecting to Studio via Conversations, you create a distinct message thread for that interaction and unlock the possibility of adding human Participants from other channels after you complete your automated handling. For example, you could add an agent from a web or mobile app that implements the Conversations SDK, or you could connect them to someone via SMS or WhatsApp.
Let's get started!

Building a Studio Flow
First, let's create a basic Studio Flow:
Log into your Twilio account in the Twilio Console
Navigate to the Studio Flow section
 in the Console
Click the + icon underneath the Flows heading to create a new Flow

Expand image
Name your Flow and click Next

Expand image
You'll see a list of possible templates you can use. Select the Start from scratch option and click Next

Expand image
Once you've created the Flow, you'll see the Flow's Canvas. Let's build out the rest of the project's logic.

Add Widgets to the Canvas
Studio Flows are built from Widgets. These items represent pieces of logic that allow you to handle incoming actions and respond accordingly by performing specific tasks, like sending a message.
Let's start by adding a Send & Wait For Reply Widget to the "Incoming Conversation" Trigger.

Expand image
Then, click on the Send & Wait For Reply Widget to show its Inspector Panel. In the Config tab, add a message body (i.e. "Hi, do you like bots?") and click Save. This tells Studio to receive the incoming message, and then reply with the message you see there in the Widget.

Expand image
Next, add to the "Reply" transition the "Split Based On…" Widget to parse the user response.
Then, open the Split Based On... Widget Inspect Panel and in the Config tab, select the "inbound.Body" option for the "Variable to test" field. Click Save.

Expand image
In the Split Based On... Transitions tab, let's add conditions that match the possible responses you want to test for:

Expand image
The Split Based On... Widget lets you access a variable and test conditions on it to determine how to react. In this case, we're testing the body of the message the user sent in response to your "Hi, do you like bots?" message.
Finally, let's add Send Message Widgets on each transition with the response you want to send:

Expand image
This will reply with different messages depending on how the user replied to your initial message. Your Canvas is now set up! To publish the Flow, click Publish from the top Canvas menu.

Connecting to Conversations
There are two ways to connect Twilio Studio to Conversations. First, you can set a particular "sender" (e.g. Twilio SMS number or Twilio WhatsApp sender) to automatically create a new Conversation when it receives a message that wouldn't be mapped to an existing Conversation. Second, you can add the Studio Flow to a Conversation that already exists.
Autocreating Conversations
(information)
Info
You'll need your Studio Flow's SID (FWXXX). You can get this in a few places, like the Studio Flow Console page
 or in the URL when you're editing the Flow.
(information)
Info
Your Twilio Phone Number should be in E.164 format, like this: +12345678901
For this example, we'll use the Address Configuration API. We're using SMS here, but you could also use other channels we support, like WhatsApp or Messenger.
Copy code block
twilio api:conversations:v1:configuration:addresses:create \


--type sms \


--address your_twilio_number \


--auto-creation.enabled \


--auto-creation.type studio \


--auto-creation.studio-flow-sid FWXXXXXXX


Well done! Now, inbound messages to this address (Twilio phone number) will create a new Conversation (if there isn't one for that number pair) and add the Studio Flow to it.
Note: To disable inbound conversation autocreation, delete the Address Configuration.
Existing Conversations
Alternatively, you can set this up manually on a specific Conversation. First, create a Conversation:
Copy code block
twilio api:conversations:v1:conversations:create \


—-friendly-name "studio_test"


Next, add an external Participant (for this example, we'll use SMS, but it could be any channel):
(information)
Info
Make sure to replace CHXXXXX with your Conversations SID for the Conversation you created in the step above.
Copy code block
twilio api:conversations:v1:conversations:participants:create \


--conversation-sid CHXXXXXXXXXXXXX \


--messaging-binding.address +15558675310 \


--messaging-binding.proxy-address your_twilio_number
Finally, add a Conversation-Scoped Webhook that points to Studio:
Copy code block
twilio api:conversations:v1:conversations:webhooks:create \


--target studio \


--conversation-sid CHXXXXXXXXXXX \


--configuration.flow-sid FWXXXXXXXXXXX
Send a text to the ProxyAddress you specified in your MessagingBinding using the phone number you used as the Address and watch the magic happen! 🎉

Expand image

Optional: Importing Flow Data from JSON
Instead of adding Widgets to the Canvas, you can import this basic tutorial Flow. You can do this by creating a new Flow, selecting Import from JSON from the list of templates in the selection modal, and pasting the JSON Flow definition into the import window.
Example JSON Flow definition:
Copy code block
{


 "description": "A New Flow",


 "states": [


   {


     "name": "Trigger",


     "type": "trigger",


     "transitions": [


       {


         "event": "incomingMessage"


       },


       {


         "event": "incomingCall"


       },


       {


         "next": "send_and_reply_1",


         "event": "incomingConversationMessage"


       },


       {


         "event": "incomingRequest"


       },


       {


         "event": "incomingParent"


       }


     ],


     "properties": {


       "offset": {


         "x": 0,


         "y": 0


       }


     }


   },


   {


     "name": "send_and_reply_1",


     "type": "send-and-wait-for-reply",


     "transitions": [


       {


         "next": "split_1",


         "event": "incomingMessage"


       },


       {


         "event": "timeout"


       },


       {


         "event": "deliveryFailure"


       }


     ],


     "properties": {


       "offset": {


         "x": 70,


         "y": 170


       },


       "service": "{{trigger.message.InstanceSid}}",


       "channel": "{{trigger.message.ChannelSid}}",


       "from": "{{flow.channel.address}}",


       "body": "Hi, do you like bots?",


       "timeout": "3600"


     }


   },


   {


     "name": "send_message_1",


     "type": "send-message",


     "transitions": [


       {


         "event": "sent"


       },


       {


         "event": "failed"


       }


     ],


     "properties": {


       "offset": {


         "x": -280,


         "y": 600


       },


       "service": "{{trigger.message.InstanceSid}}",


       "channel": "{{trigger.message.ChannelSid}}",


       "from": "{{flow.channel.address}}",


       "to": "{{contact.channel.address}}",


       "body": "👻"


     }


   },


   {


     "name": "send_message_2",


     "type": "send-message",


     "transitions": [


       {


         "event": "sent"


       },


       {


         "event": "failed"


       }


     ],


     "properties": {


       "offset": {


         "x": 30,


         "y": 600


       },


       "service": "{{trigger.message.InstanceSid}}",


       "channel": "{{trigger.message.ChannelSid}}",


       "from": "{{flow.channel.address}}",


       "to": "{{contact.channel.address}}",


       "body": "🤖"


     }


   },


   {


     "name": "send_message_3",


     "type": "send-message",


     "transitions": [


       {


         "event": "sent"


       },


       {


         "event": "failed"


       }


     ],


     "properties": {


       "offset": {


         "x": 340,


         "y": 590


       },


       "service": "{{trigger.message.InstanceSid}}",


       "channel": "{{trigger.message.ChannelSid}}",


       "from": "{{flow.channel.address}}",


       "to": "{{contact.channel.address}}",


       "body": "👽"


     }


   },


   {


     "name": "split_1",


     "type": "split-based-on",


     "transitions": [


       {


         "next": "send_message_1",


         "event": "noMatch"


       },


       {


         "next": "send_message_2",


         "event": "match",


         "conditions": [


           {


             "friendly_name": "If value matches_any_of yes,Yes",


             "arguments": [


               "{{widgets.send_and_reply_1.inbound.Body}}"


             ],


             "type": "matches_any_of",


             "value": "yes,Yes"


           }


         ]


       },


       {


         "next": "send_message_3",


         "event": "match",


         "conditions": [


           {


             "friendly_name": "If value matches_any_of no,No",


             "arguments": [


               "{{widgets.send_and_reply_1.inbound.Body}}"


             ],


             "type": "matches_any_of",


             "value": "no,No"


           }


         ]


       }


     ],


     "properties": {


       "input": "{{widgets.send_and_reply_1.inbound.Body}}",


       "offset": {


         "x": -100,


         "y": 370


       }


     }


   }


 ],


 "initial_state": "Trigger",


 "flags": {


   "allow_concurrent_calls": true


 }


}



What's Next?
Well done! You've learned how to connect Twilio Studio with Conversations. To continue, check out these other resources:
Learn how to use Facebook Messenger with Twilio Conversations
Explore Conversations API Quickstart

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Connecting Twilio Studio to Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Connecting Twilio Studio to Conversations
Using Facebook Messenger with Conversations
Trying Out WhatsApp with Conversations
Using Google Dialogflow with Conversations
Client-side SDKs
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
Setting up the Facebook Messenger channel
Setting up Conversation autocreation
Create a Conversation and do nothing else
Create a Conversation and notify your server-side integration
Create a Conversation, notify your server-side integration, and send all subsequent Messages to it
Create a Conversation and connect it to a Studio Flow
What's next?
Using Facebook Messenger with Twilio Conversations

In this tutorial, you'll learn how to set up the Facebook Messenger channel in your Twilio account, and how to automatically create new Conversations when someone messages your Facebook page.
Let's get started!

Setting up the Facebook Messenger channel
Before you can receive messages from Facebook, you'll need to link your Facebook page to the Messenger channel in the Twilio Console. To set it up, navigate to Channels > Facebook Messenger
.

Expand image
Click New Messenger Sender, then click Log in with Facebook in the modal. A pop-up window will open that will allow you to sign in to your Facebook account.

Expand image
Once you've logged in, your Facebook Pages will be listed. Select the one you'd like to link to your Twilio account and click Submit.

Expand image
Now, the sender will appear in the main configuration window.

Expand image
Make a note of the Facebook Messenger Page ID. It's in the middle column (Facebook Page ID) and should be a string of numbers. You will need this later to create a Conversation.

Setting up Conversation autocreation
Using Conversations to handle your Messenger communications is very productive. Conversations will maintain distinct threads for each customer and also allows you to receive messages and replies from your channel of choice. You can connect your server-side integration and reply via REST API, connect chatbots or Studio Flows to handle communication in an automated fashion, use our SDK to connect via client-side mobile or web apps, or connect SMS or WhatsApp to receive Messenger chats and reply natively.
To automatically create a new Conversation when a new user messages you on Facebook, you'll need to create a rule using the Address Configuration API. When a message comes into your Facebook page, we'll check to see if there's an existing Conversation with the sender already. If there is, we'll copy the message into the Conversation. If there isn't, and you have autocreation enabled, we'll create a new Conversation and follow any webhook rule you've added using this API.
In this tutorial we'll use the twilio-cli, but you can use the REST API directly or one of our helper libraries for Java, Node.js, PHP, Ruby, C#, or Python. Below are several examples of different rules you could create, depending on your workflow. Keep in mind that you'll ultimately only create one Conversations autocreation rule per Facebook page - these examples show different ways that you could choose to handle autocreation.
Create a Conversation and do nothing else
This example only shows you how to set up autocreation for incoming messages. That won't be particularly useful for most use cases, but it's helpful to see the basic construction of the API request.
Copy code block
twilio api:conversations:v1:configuration:addresses:create \


--type messenger \


--address messenger:your_messenger_page_id \


--auto-creation.enabled \


--auto-creation.type default


This rule will:
Create a new Conversation if one doesn't exist for this page that matches the user who messaged
Add the user who messaged your page as a Participant
As you can see, this doesn't help you to connect an agent or bot to the person who messaged your page. You can monitor for new Conversations by pointing the global webhook at your server and setting it to send your server onConversationAdded events. Based on that event, you could apply your own business logic to add a Participant or kick off other actions. However, as you'll see in subsequent examples, the Address Configuration API will allow you greater flexibility if you'd like.
Note: Behind the scenes, each of these next examples specifies a Conversation-Scoped Webhook that will be added to each autocreated Conversation.
Create a Conversation and notify your server-side integration
This example shows you how to enable autocreation and notify a webhook so that you can trigger your business logic. This could be a good starting example for adding an SDK-based Participant or connecting Participants from SMS/WhatsApp.
Copy code block
twilio api:conversations:v1:configuration:addresses:create \


--type messenger \


--address messenger:your_messenger_page_id \


--auto-creation.enabled \


--auto-creation.type webhook \


--auto-creation.webhook-filters onConversationAdded \


--auto-creation.webhook-url https://your.server.com/webhook \


--auto-creation.webhook-method POST (you can also use GET)


Your webhook will be notified when a Conversation is autocreated due to this rule and will receive the onConversationAdded payload. You can then add additional logic depending on your goal. For example, you can add another Participant (connect them to a human on another channel like SDK, SMS, or WhatsApp).
Create a Conversation, notify your server-side integration, and send all subsequent Messages to it
This example shows you how to enable autocreation, notify a server-side webhook, and send all subsequent messages to the webhook as they're added. This could be good if you want to reply to the user with the REST API or if you want to connect an external chatbot.
Copy code block
twilio api:conversations:v1:configuration:addresses:create \


--type messenger \


--address messenger:your_messenger_page_id \


--auto-creation.enabled \


--auto-creation.type webhook \


--auto-creation.webhook-filters onConversationAdded onMessageAdded \


--auto-creation.webhook-url https://your.server.com/webhook \


--auto-creation.webhook-method POST (you can also use GET)


As you can see, this is quite similar to the last rule. The difference here is the --autocreation.webhook-filtersfield.
We're adding a second event that your server will receive, onMessageAdded. This will contain the body of the message and several other parameters.
From here, you can respond using the Conversations Message API. You could also pass the body to an integration you've written with a third-party service (i.e. Dialogflow or Lex) and then add the response from your integration using the same Conversations Message API.
Tip: You could even use this to integrate with a channel Twilio doesn't support natively, like Slack.
Create a Conversation and connect it to a Studio Flow
This example shows you how to enable autocreation and connect it to a Studio Flow. Twilio Studio provides you with a visual tool to design interactive customer experiences. You could use this for basic automated handling of incoming chats, or kick off more complex actions using Studio's Run Functionwidget.
Note: You'll need to create a Studio Flow before you can connect it here. Check out our Studio documentation to learn more.
Copy code block
twilio api:conversations:v1:configuration:addresses:create \


--type messenger \


--address messenger:your_messenger_page_id \


--auto-creation.enabled \


--auto-creation.type studio \


--auto-creation.studio-flow-sid FWXXXXXXXXXXXXX
Any Conversations autocreated with this rule will be connected to your Studio Flow. This can be a great way to filter incoming chats with some basic handling. You could even gather an issue type from the customer and add the appropriate agent to the Conversation using that information and Studio's Run Function widget.

What's next?
Congratulations on handling inbound Messenger chats! Continue learning more about Conversations with the following resources:
Conversations Fundamentals
Inbound Message Handling & Autocreation

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Using Facebook Messenger with Twilio Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Connecting Twilio Studio to Conversations
Using Facebook Messenger with Conversations
Trying Out WhatsApp with Conversations
Using Google Dialogflow with Conversations
Client-side SDKs
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
Step 1: Opt-in to the Twilio Sandbox for WhatsApp
Optional: Remove the Inbound URL in the WhatsApp sandbox settings in the Twilio Console
Step 2: Create a Conversation
Step 3: Add a WhatsApp Participant to the Conversation
Step 4: Add a chat Participant to the Conversation
Step 5: Send a Message from WhatsApp to the Sandbox number
Step 6: Reply to the message
Step 7: Twilio Conversations Logs
What's Next?
Trying Out WhatsApp with Conversations

In this tutorial, we'll explore how you can use Twilio's Conversations with Twilio's Sandbox for WhatsApp. Twilio controls a dedicated WhatsApp phone number that you can use to test WhatsApp with Conversations.
You will need a few things before you start this tutorial:
A Twilio Account - sign up here
 if you don't have one yet.
The Twilio CLI.
Note: We're using the Twilio CLI to make API requests to Twilio's Conversations service, but you can choose another method such as a helper library.
Let's get started!

Step 1: Opt-in to the Twilio Sandbox for WhatsApp
You can test your application in a developer environment by connecting to Twilio Sandbox for WhatsApp.
Navigate to the Conversations > Try it out
 section in the Twilio Console. Choose a use case - then, send the "join <your Sandbox keyword>" WhatsApp message from your device to the Twilio Sandbox for a WhatsApp phone number to connect to your sandbox.

Expand image
Once you've joined Twilio WhatsApp Sandbox, you'll receive a confirmation message. To disconnect from the sandbox, you can reply to the message from WhatsApp with the word "stop".
Optional: Remove the Inbound URL in the WhatsApp sandbox settings in the Twilio Console
In this tutorial, we won't need to set a webhook URL for inbound messaging. Let's remove the existing testing webhook URL configured in the WhatsApp Sandbox's settings section. Not doing so would result in an automatic reply requesting to update the configuration for your WhatsApp Sandbox's Inbound URL when you send your first message.
To update the WhatsApp Sandbox inbound URL, go to the Messaging > Settings > WhatsApp sandbox settings
 section in the Twilio Console and remove the webhook URL. Click Save.

Step 2: Create a Conversation
Now that you have your Twilio Sandbox for WhatsApp configured, it's time to create your first Conversation!
Let's make a Conversation using the Twilio CLI (but remember that you can choose another tool for making the API requests):
Copy code block
# Install the twilio-cli from https://twil.io/cli





twilio api:conversations:v1:conversations:create \


   --friendly-name "sandbox-test"
Copy down the Conversation SID - it starts with CHXXXXXXX. You'll use this value in the next steps.

Step 3: Add a WhatsApp Participant to the Conversation
You've created a Conversation, which you can think of as a virtual space that users can join using a channel of their choice.
Next, you'll add yourself as a WhatsApp Participant. The following code sample does this for you. You'll need to replace the following information:
CHXXXXXXXXXXX - the Conversation SID.
YOUR_WHATSAPP_NUMBER - your own mobile phone number in E.164 format.
TWI_SANDBOX_WA_NUMBER - the Twilio Sandbox WhatsApp phone number in E.164 format.
Copy code block
# Install the twilio-cli from https://twil.io/cli





twilio api:conversations:v1:conversations:participants:create \


   --conversation-sid CHXXXXXXX \


   --messaging-binding.address whatsapp:YOUR_WHATSAPP_NUMBER \


   --messaging-binding.proxy-address whatsapp:TWI_SANDBOX_WA_NUMBER

Step 4: Add a chat Participant to the Conversation
For this step, you'll add a chat Participant to the Conversation (remember that you can also add an SMS Participant).
The following code sample does this for you. You'll need to replace the following information:
CHXXXXXXXXXX - the Conversation SID.
<Chat_User_Identity> - the identity of your chat user. In this tutorial, we'll use "chat-user".
Copy code block
# Install the twilio-cli from https://twil.io/cli





twilio api:conversations:v1:conversations:participants:create \


   --conversation-sid CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX \


   --identity "<Chat_User_Identity>"
New Conversation? Check. Two Participants? Check.
Now it's time to start talking!

Step 5: Send a Message from WhatsApp to the Sandbox number
Let's start a Conversation by sending a WhatsApp message to the Twilio sandbox phone number.

Expand image

Step 6: Reply to the message
Let's reply to the previous message from the REST API. Remember that you can do it from the SDK or SMS (if that's how you added the second Participant).
Make sure to replace CHXXXXXXX for your Conversation SID, the <Chat_User_Identity> with "chat-user" and add the content of the message that you'd like to send. For example, we'll use "Hello from the other side 👋🏼".
The following code sample does this for you:
Copy code block
# Install the twilio-cli from https://twil.io/cli





twilio api:conversations:v1:conversations:messages:create \


   --conversation-sid CHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX \


   --author "<Chat_User_Identity>" \


   --body "Hello from the other side 👋🏼"



Expand image
Well done! You've successfully connected your Twilio's WhatsApp Sandbox Number with Conversations.

Step 7: Twilio Conversations Logs
To check if the WhatsApp message arrived in the Conversation, navigate to Monitor > Logs > Errors > Conversations
 and click the Conversation you created previously. You'll see on the top of the page the name of the Conversation you created. Click the Messages tab to see, for example, the WhatsApp phone number and chat identity that was used in the Conversation and the content of the message.

Expand image

What's Next?
Congratulations! 🎉 You have learned how to connect the Twilio's Sandbox for WhatsApp with Conversations. As a following step, you can:
Learn more about how to Use WhatsApp with Conversations
Check out our Conversations Quickstart

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Trying Out WhatsApp with Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Connecting Twilio Studio to Conversations
Using Facebook Messenger with Conversations
Trying Out WhatsApp with Conversations
Using Google Dialogflow with Conversations
Client-side SDKs
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
Twilio products used
Step 1: Configure Twilio Conversations
Step 2: Create a Dialogflow CX agent
Step 3: Connect Dialogflow CX to Twilio
Step 4: Create a Studio Flow
Step 5: Link Incoming Messages to Studio
For SMS
For chat and other custom integrations
Step 6: Chat with your Dialogflow CX agent
Next Steps
Products used
Conversations
Studio
Serverless
Phone numbers
Messaging
Using Google Dialogflow CX with Conversations

In this tutorial, we'll show you how to integrate a Google Dialogflow CX agent with Conversations using our native integration.
(new)
Private Beta
This feature is in Private Beta. The information in this document could change. We might add or update features before the product becomes Generally Available. Beta products don't have a Service Level Agreement (SLA). Learn more about beta product support
.

Prerequisites
Before you get started, you will need to have:
A Twilio account. Sign up for a free account
 or log into an existing account


A Google Cloud account


Depending on how you wish to communicate with your agent, you may also want either:
For SMS: An SMS-capable Twilio phone number. See how to buy a Twilio phone number
 if you don't have one yet.
For chat: The Conversations react demo app
 set up.

Twilio products used
We're going to be using the following Twilio products:
Required:
Conversations: To relay messages back and forth from your Dialogflow agent and users across multiple channels.
Studio: To manage Dialogflow agents in your conversations through the Connect Virtual Agent widget.
Marketplace: Where the integrations configuration lives.
Optional:
Functions: To create a Conversations Scoped Webhooks to connect your conversations to Studio Flows.
Phone Numbers: To enable your Dialogflow agents to communicate with your users via SMS.

Step 1: Configure Twilio Conversations
If you've never used Twilio Conversations, please navigate to Conversations > Defaults
 in the Console. Visiting this page will trigger some initial setup on your Twilio account for Conversations. You can skip ahead if you already use Conversations.

Step 2: Create a Dialogflow CX agent
If you already have an agent set up, you can skip to the next step.
To create a new Dialogflow CX agent, first log in to the Dialogflow Console
. Once in the Console, select your Google Cloud Project, then click either:
Use pre-built agents, the start with a template.
Create Agent to start from scratch.
For this tutorial, we recommend you use one of the pre-built agents. "Small Talk" is a good one to start with.

Expand image

Step 3: Connect Dialogflow CX to Twilio
Now that you have a Dialogflow CX agent, you can connect it to Twilio via the One-Click Telephony Integration.
To do so, please follow to steps on this Dialogflow CX Onboarding Guide.
When your reach the Configuration steps in the Twilio Console, some of the required fields are only relevant to Voice applications. You can set "Welcome Intent Friendly Name" to "Welcome" and leave "Bot Voice" as "default." If you are only using Conversations for this integration, they will not impact the behavior of your agent.
If you ever need to update this configuration, you can find it in the Marketplace -> Installed section of the Twilio Console
.

Step 4: Create a Studio Flow
After connecting your Dialogflow CX agent to Twilio, you can create a Studio Flow to add virtual agents to your conversations. To create a new Studio Flow, navigate to Studio
.
From a new flow, add the "Connect Virtual Agent" widget from the Voice section of the widget library. On the widget, set the "Channel" to "conversations", select the "Connector Instance" you connected in the previous step, and click Save. Finally, connect the widget to the Incoming Conversation Trigger and Publish the flow.

Expand image

Step 5: Link Incoming Messages to Studio
Depending on the channel you are using to connect users with your agent, you can link incoming messages to your Studio in different ways.
For SMS
If you are using SMS, you can link incoming messages to your Studio Flow by configuring a Conversations Address. Addresses give you the option to automatically create conversations when a message is sent to a Twilio number and integrate those conversations directly with Studio.
To configure an Address, navigate to Conversations -> Addresses
 in the Twilio Console and edit one of your existing addresses. Enable "Autocreate Conversations" for new message, set the integration to Studio, and select the flow you created in the previous step.

Expand image
For chat and other custom integrations
If you are using the Conversations React demo app or another custom API or SDK integration for chat, you can link incoming messages to your Studio Flow by creating a Conversations-scoped webhook.
We will use Conversations Global (or Service Scoped) Webhook events to create a Conversations Scoped Webhook for each new conversation. In this tutorial, we will use a Twilio Function to create the Conversations-scoped webhook, which conveniently executes the code within your Twilio account, but any backend server will work.
The setup works like this:
Conversations Global (or Service-scoped) webhooks will trigger a function on the event onConversationAdded.
The function will create a Conversations-scoped webhook targeted at the Studio flow.
The Conversations-scoped webhook will send onMessageAdded events to the Studio Flow for the virtual agent to handle.
Serverless Function
Learn how to get started with Twilio Functions here.
This is the code for the function to set up the Conversations-scoped webhook:
Copy code block
exports.handler = async function(context, event, callback) {


const conversationSid = event.ConversationSid;


const twilioClient = context.getTwilioClient();


try {    





 // Creates a webhook for the conversation targeted at our Studio Flow SID 


 const webhook = await twilioClient.conversations.v1.conversations(conversationSid)


   .webhooks


   .create({


     target: 'studio',


     'configuration.flowSid': 'FWfXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // This is the SID of your Studio Flow


     'configuration.filters': ['onMessageAdded']


   });


 


  return callback(null, {});


} catch (error) {


  console.error(error);


  return callback(error);


}


};
This function uses the Twilio Node.js helper library, which is available by default in Twilio Functions. To set this up in your own server and preferred programming language, check out Twilio's Server Side SDKs.
Global Webhooks
With your function set up and published, you can now create a Global Webhook in the Twilio Console.
Set the Post-Event URL to the URL of your function and select the event onConversationAdded.

Expand image
Note: Global Webhooks create events for all conversations available in your account. If you want to limit the scope of the webhook to a specific conversations service, you can create a Service Scoped Webhook instead.

Step 6: Chat with your Dialogflow CX agent
The integration is now ready! 🎉
For SMS: Send a message from any phone to your Twilio phone number to start chatting with your Dialogflow agent.
For Conversations API or SDK: You can create a new conversation and add a message to the conversation to start chatting with your Dialogflow agent.
The Conversations react demo app
 is a good way to get starting with the Conversations SDK.
For API only integrations, be sure to set the X-Twilio-Webhook-Enabled=true header in your request so that Webhook events trigger.

Next Steps
Here are some ideas for next steps to take your integration further:
Add a welcome message for chat users: You can add a default welcome message to the conversations before connecting it to the Studio Flow. This creates the effect of the virtual agent greeting the user.
Live Agent Handoff: Dialogflow CX agents can recognize when user needs to speak to a human. The Connect Virtual Agent Studio widget has a route that is triggered when the agent recognizes this intent. You can use this route to connect the user to a live agent.
Try other channels: Conversations also supports WhatsApp and Facebook Messenger. You can connect your Dialogflow agent to these channels as well.
Try Voice integrations: If your Dialogflow agent is configured with voice capabilities, you can connect it to Twilio Voice using the same integration.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Using Google Dialogflow CX with Conversations | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
Versioning and Support Lifecycle
Android
iOS
JavaScript
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
Versioning and Support Lifecycle
JavaScript SDK Releases
iOS SDK Releases
Android SDK Releases
Versioning and Support Lifecycle

Versioning and Support Lifecycle
Conversations SDKs versioning is based on semantic versioning
 in numbered MAJOR.MINOR.PATCH releases:
MAJOR: Releases that introduce new features incompatible with earlier versions.
MINOR: Releases that introduce new, optional features that are backward compatible.
PATCH: Releases dedicated to backward-compatible fixes.
Twilio supports the Conversations SDKs based on these lifecycle stages:
Latest: The most recent major version. Fully supported, receiving new features and bug fixes.
Support: Prior major versions are given limited support for 12 months from the date the succeeding major version is released. During this phase, only bug and security fixes are provided.
Deprecated: Once a prior major version completes its 12-month support phase, no further updates will be provided.
End of Life (EOL): 12 months after being deprecated, the version transitions to EOL. From this point on, its continued operation is not guaranteed. Twilio reserves the right to modify supporting systems without prior notification, which could potentially disrupt or terminate the SDK's functionality.

JavaScript SDK Releases
See the JavaScript SDK Changelog for the latest version.
Version
Status
Release Date
End of Support
End of Life
2.X
Latest
19 October 2021




1.X
End of Life
28 September 2020
19 October 2022
19 October 2023


iOS SDK Releases
See the iOS SDK Changelog for the latest version.
Version
Status
Release Date
End of Support
End of Life
4.X
Latest
6 June 2023




3.X
Support
3 April 2023
6 June 2024
6 June 2025
2.X
Deprecated
19 October 2021
3 April 2024
3 April 2025
1.X
End of Life


19 October 2022
19 October 2023


Android SDK Releases
See the Android SDK Changelog for the latest version.
Version
Status
Release Date
End of Support
End of Life
6.X
Latest
2 September 2024




5.X
Support
8 February 2023
13 June 2024
13 June 2025
4.X
Deprecated
18 August 2022
8 February 2024
8 February 2025
3.X
Deprecated
4 January 2022
18 August 2023
18 August 2024
2.X
End of Life
19 October 2021
4 January 2023
4 January 2024
1.X
End of Life


19 October 2022
19 October 2023


Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Versioning and Support Lifecycle | Twilio
Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
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
JavaScript SDK
Android SDK
Direct download
Maven Central
Gradle
iOS SDK
Swift Package Manager
Twilio Conversations Client SDKs

Twilio provides client-side Conversations SDKs for browser-based web applications, as well as for native iOS and Android applications.

JavaScript SDK
The latest version of the JavaScript SDK for Conversations is available on Twilio's CDN. To include it on your web page, follow the instructions in the SDK documentation
.
The Twilio.Conversations namespace will then be available in the window scope of your JavaScript application.
The JS Conversations SDK is also available from NPM
.
Want to see the JS Conversations SDK in action? Check our Conversations React Demo App
! The app demonstrates a basic conversations client application with the ability to create and join conversations, add other participants into the conversations, and exchange messages.

Android SDK
The Twilio Conversations Android SDK is distributed as a direct download from Twilio's CDN. It can also be installed via Maven or directly within a Gradle build file using Maven Central.
Direct download
Download the Twilio Conversations Client library for Android from the Twilio CDN
. The download's SHA-256 is:
Copy code block
0941553efaf1737e6877aa1a7af4e7bffad69b382d8bf478613f5c1a8c69f192
Maven Central
Twilio Conversations is available from Maven Central
.
Gradle
To install via Gradle, include the following in your Gradle build file:
Copy code block
allprojects {


 repositories {


   mavenCentral()


 }


}





/**


* Declare dependencies


* @see http://www.gradle.org/docs/current/userguide/userguide_single.html#sec:how_to_declare_your_dependencies


*/


dependencies {


 implementation 'com.twilio:conversations-android:6.1.1'


}
(information)
Info
Your Android project needs compatibility with Java 8 language features
. If you have not already done so, add the following section to the android module in your build.gradle file:
Copy code block
android {


 ...


 compileOptions {


   sourceCompatibility JavaVersion.VERSION_1_8


   targetCompatibility JavaVersion.VERSION_1_8


 }


 ...


}
Want to see the Android Conversations SDK in action? Check our Conversations Kotlin Demo App
! The app demonstrates a basic conversations client application with the ability to create and join conversations, add other participants into the conversations, and exchange messages.

iOS SDK
The Conversations SDK for iOS is available through the Swift Package Manager
 dependency manager.
(warning)
Warning
Package manager support for iOS SDK has shifted from CocoaPods and Carthage towards Swift Package Manager as the universal and the best-supported option.
We do not currently support the Carthage package manager and/or CocoaPods.
Swift Package Manager
To install the SDK with Swift Package Manager, add the following dependency to your project:
Copy code block
https://github.com/twilio/conversations-ios
Open your project in Xcode.
Select File > Add Packages....
Enter https://github.com/twilio/conversations-ios into the search field.
Choose the appropriate version and click Add Package.
That's it!
Want to see the iOS Conversations SDK in action? Check our Conversations Swift Demo App
! The app demonstrates a basic conversations client application with the ability to create and join conversations, add other participants into the conversations, and exchange messages.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Twilio Conversations Client SDKs | Twilio
@twilio/conversations
All






 Inherited Only exported
AggregatedDeliveryReceipt
CancellablePromise
ChannelMetadata
Client
ContentTemplate
ContentTemplateVariable
Conversation
DetailedDeliveryReceipt
Media
Message
MessageBuilder
Participant
PushNotification
RestPaginator
UnsentMessage
User
ClientOptions
ConversationBindings
ConversationEmailBinding
ConversationLimits
ConversationState
ConversationUpdatedEventArgs
CreateConversationOptions
LastMessage
Paginator
ParticipantBindings
ParticipantEmailBinding
PushNotificationData
SendEmailOptions
SendMediaOptions
ConnectionState
ContentData
ContentDataAction
ContentDataActionOther
ContentDataActionPhone
ContentDataActionReply
ContentDataActionUrl
ContentDataCallToAction
ContentDataCard
ContentDataListItem
ContentDataListPicker
ContentDataLocation
ContentDataMedia
ContentDataOther
ContentDataQuickReply
ContentDataReply
ContentDataText
ConversationStatus
ConversationUpdateReason
DeliveryAmount
DeliveryStatus
JSONArray
JSONObject
JSONValue
MediaCategory
MessageType
MessageUpdateReason
NotificationLevel
NotificationsChannelType
ParticipantEmailLevel
ParticipantType
ParticipantUpdateReason
State
UserUpdateReason
Twilio Conversations client library
Twilio Conversations: Create meaningful connections with customers across various communication channels. Visit our official site for more detalis: https://www.twilio.com/conversations
Instantiating and using
To use the library you need to generate a token and pass it to the Conversations Client constructor.
NPM
npm install --save @twilio/conversations


Using this method, you can require twilio-conversations and then use the client:
const { Client } = require('@twilio/conversations');

const client = new Client(token);

// Before you use the client, subscribe to the `'initialized'` event.
client.on('initialized', () => {
  // Use the client.
});

// To catch client initialization errors, subscribe to the `'initFailed'` event.
client.on('initFailed', ({ error }) => {
  // Handle the error.
});


The SDK could also be imported using the ES module syntax:
import { Client } from '@twilio/conversations';

const client = new Client(token);

// Before you use the client, subscribe to the `'initialized'` event.
client.on('initialized', () => {
  // Use the client.
});

// To catch client initialization errors, subscribe to the `'initFailed'` event.
client.on('initFailed', ({ error }) => {
  // Handle the error.
});


CDN
Releases of twilio-conversations.js are hosted on a CDN, and you can include these directly in your web app using a <script> tag.
<script src="https://media.twiliocdn.com/sdk/js/conversations/v2.4/twilio-conversations.min.js"></script>


Using this method, twilio-conversations.js will set a browser global Twilio.Conversations through which you can use the client:
const client = new Twilio.Conversations.Client(token);


Security
The CDN consumption described above allows you to consume latest bug fixed versions automatically, but does not prevent from detecting malicious modifications in the SDK code.
If you require more security you will have to consume SDK by using SRI and using an exact version number. While less flexible it is significantly more secure, which is required by some applications.
To consume securely use the following script snippet format:
<script
  src="https://media.twiliocdn.com/sdk/js/conversations/releases/2.4.0/twilio-conversations.min.js"
  integrity="sha256-<HASH FROM THE CHANGELOGS PAGE>"
  crossorigin="anonymous"
></script>


Find the hash of each release published on the Changelog page.
Supported Browsers
Browser
Supported Versions
Chrome for Android
112
Firefox for Android
110
UC Browser for Android
13.4
Chrome
112, 111, 110
Edge
112, 111, 110
Firefox
112, 111, 110
Internet Explorer
11
Safari for iOS
16.4, 16.3
Safari
16.4, 16.3, 16.2
Samsung Internet
20, 19.0

Changelog
See this link.
Index
Classes
AggregatedDeliveryReceipt
CancellablePromise
ChannelMetadata
Client
ContentTemplate
ContentTemplateVariable
Conversation
DetailedDeliveryReceipt
Media
Message
MessageBuilder
Participant
PushNotification
RestPaginator
UnsentMessage
User
Interfaces
ClientOptions
ConversationBindings
ConversationEmailBinding
ConversationLimits
ConversationState
ConversationUpdatedEventArgs
CreateConversationOptions
LastMessage
Paginator
ParticipantBindings
ParticipantEmailBinding
PushNotificationData
SendEmailOptions
SendMediaOptions
Type aliases
ConnectionState
ContentData
ContentDataAction
ContentDataActionOther
ContentDataActionPhone
ContentDataActionReply
ContentDataActionUrl
ContentDataCallToAction
ContentDataCard
ContentDataListItem
ContentDataListPicker
ContentDataLocation
ContentDataMedia
ContentDataOther
ContentDataQuickReply
ContentDataReply
ContentDataText
ConversationStatus
ConversationUpdateReason
DeliveryAmount
DeliveryStatus
JSONArray
JSONObject
JSONValue
MediaCategory
MessageType
MessageUpdateReason
NotificationLevel
NotificationsChannelType
ParticipantEmailLevel
ParticipantType
ParticipantUpdateReason
State
UserUpdateReason
Type aliases
ConnectionState
ConnectionState: TwilsockConnectionState
Connection state of the client. Possible values are as follows:
'connecting' - client is offline and connection attempt is in process
'connected' - client is online and ready
'disconnecting' - client is going offline as disconnection is in process
'disconnected' - client is offline and no connection attempt is in process
'denied' - client connection is denied because of invalid JWT access token. User must refresh token in order to proceed
ContentData
ContentData: ContentDataText | ContentDataMedia | ContentDataLocation | ContentDataQuickReply | ContentDataCallToAction | ContentDataListPicker | ContentDataCard | ContentDataOther
A union of possible data types in rich content templates.
ContentDataAction
ContentDataAction: ContentDataActionUrl | ContentDataActionPhone | ContentDataActionReply | ContentDataActionOther
A union of possible actions used in ContentDataCallToAction and ContentDataCard.
ContentDataActionOther
ContentDataActionOther: { rawData: string; type: "other" }
Used for unknown action types which aren't present in the current version of the Conversations SDK.
Type declaration
Readonly rawData: string
Full data as a stringified JSON. This could be used for future content types and fields which are not yet supported by the newest version of the Conversations SDK, or for using newer types in the older versions of the SDK.
Readonly type: "other"
The type discriminant.
ContentDataActionPhone
ContentDataActionPhone: { phone: string; rawData: string; title: string; type: "phone" }
Shows a button that calls a phone number.
Type declaration
Readonly phone: string
Phone number to call when the recipient taps the button.
Readonly rawData: string
Full data as a stringified JSON. This could be used for future content types and fields which are not yet supported by the newest version of the Conversations SDK, or for using newer types in the older versions of the SDK.
Readonly title: string
Display value for the action.
Readonly type: "phone"
The type discriminant.
ContentDataActionReply
ContentDataActionReply: { id?: string; index: number; rawData: string; title: string; type: "reply" }
Shows a button that sends back a predefined text.
Type declaration
Optional Readonly id?: string
Postback payload. This field is not visible to the end user.
Readonly index: number
Index for the action.
Readonly rawData: string
Full data as a stringified JSON. This could be used for future content types and fields which are not yet supported by the newest version of the Conversations SDK, or for using newer types in the older versions of the SDK.
Readonly title: string
Display value for the action. This is the message that will be sent back when the user taps on the button.
Readonly type: "reply"
The type discriminant.
ContentDataActionUrl
ContentDataActionUrl: { rawData: string; title: string; type: "url"; url: string }
Shows a button that redirects recipient to a predefined URL.
Type declaration
Readonly rawData: string
Full data as a stringified JSON. This could be used for future content types and fields which are not yet supported by the newest version of the Conversations SDK, or for using newer types in the older versions of the SDK.
Readonly title: string
Display value for the action.
Readonly type: "url"
The type discriminant.
Readonly url: string
URL to direct to when the recipient taps the button.
ContentDataCallToAction
ContentDataCallToAction: { actions: ContentDataAction[]; body: string; rawData: string; type: "callToAction" }
Buttons that let recipients tap to trigger actions such as launching a website or making a phone call. Represents the twilio/call-to-action content type.
Type declaration
Readonly actions: ContentDataAction[]
Buttons that recipients can tap on to act on the message.
Readonly body: string
The text of the message you want to send. This is included as a regular text message.
Readonly rawData: string
Full data as a stringified JSON. This could be used for future content types and fields which are not yet supported by the newest version of the Conversations SDK, or for using newer types in the older versions of the SDK.
Readonly type: "callToAction"
The type discriminant.
ContentDataCard
ContentDataCard: { actions: ContentDataAction[]; media: string[]; rawData: string; subtitle?: string; title: string; type: "card" }
Shows a menu of up to 10 options, which offers a simple way for users to make a selection. Represents the twilio/card content type.
Type declaration
Readonly actions: ContentDataAction[]
Buttons that the recipients can tap on to act on the message.
Readonly media: string[]
URLs of the media to send with the message.
Readonly rawData: string
Full data as a stringified JSON. This could be used for future content types and fields which are not yet supported by the newest version of the Conversations SDK, or for using newer types in the older versions of the SDK.
Optional Readonly subtitle?: string
Subtitle of the card.
Readonly title: string
Title of the card.
Readonly type: "card"
The type discriminant.
ContentDataListItem
ContentDataListItem: { description?: string; id: string; item: string }
Represents an item in the ContentDataListPicker.
Type declaration
Optional Readonly description?: string
Description of the item.
Readonly id: string
Unique item identifier. Not visible to the recipient.
Readonly item: string
Display value of the item.
ContentDataListPicker
ContentDataListPicker: { body: string; button: string; items: ContentDataListItem[]; rawData: string; type: "listPicker" }
Shows a menu of up to 10 options, which offers a simple way for users to make a selection. Represents the twilio/list-picker content type.
Type declaration
Readonly body: string
The text of the message you want to send. This is rendered as the body of the message.
Readonly button: string
Display value of the primary button.
Readonly items: ContentDataListItem[]
List item objects displayed in the list. See ContentDataListItem.
Readonly rawData: string
Full data as a stringified JSON. This could be used for future content types and fields which are not yet supported by the newest version of the Conversations SDK, or for using newer types in the older versions of the SDK.
Readonly type: "listPicker"
The type discriminant.
ContentDataLocation
ContentDataLocation: { label?: string; latitude: number; longitude: number; rawData: string; type: "location" }
Contains a location pin and an optional label, which can be used to enhance delivery notifications or connect recipients to physical experiences you offer. Represents the twilio/location content type.
Type declaration
Optional Readonly label?: string
The label to be displayed to the end user alongside the location pin.
Readonly latitude: number
The latitude value of the location pin you want to send.
Readonly longitude: number
The longitude value of the location pin you want to send.
Readonly rawData: string
Full data as a stringified JSON. This could be used for future content types and fields which are not yet supported by the newest version of the Conversations SDK, or for using newer types in the older versions of the SDK.
Readonly type: "location"
The type discriminant.
ContentDataMedia
ContentDataMedia: { body?: string; media: string[]; rawData: string; type: "media" }
Used to send file attachments, or to send long texts via MMS in the US and Canada. Represents the twilio/media content type.
Type declaration
Optional Readonly body?: string
The text of the message you want to send.
Readonly media: string[]
URLs of the media you want to send.
Readonly rawData: string
Full data as a stringified JSON. This could be used for future content types and fields which are not yet supported by the newest version of the Conversations SDK, or for using newer types in the older versions of the SDK.
Readonly type: "media"
The type discriminant.
ContentDataOther
ContentDataOther: { rawData: string; type: "other" }
Used for unknown content types which aren't present in the current version of the Conversations SDK.
Type declaration
Readonly rawData: string
Full data as a stringified JSON. This could be used for future content types and fields which are not yet supported by the newest version of the Conversations SDK, or for using newer types in the older versions of the SDK.
Readonly type: "other"
The type discriminant.
ContentDataQuickReply
ContentDataQuickReply: { body: string; rawData: string; replies: ContentDataReply[]; type: "quickReply" }
Let recipients tap, rather than type, to respond to the message. Represents the twilio/quick-reply content type.
Type declaration
Readonly body: string
The text of the message you want to send. This is included as a regular text message.
Readonly rawData: string
Full data as a stringified JSON. This could be used for future content types and fields which are not yet supported by the newest version of the Conversations SDK, or for using newer types in the older versions of the SDK.
Readonly replies: ContentDataReply[]
Up to 3 buttons can be created for quick reply. See ContentDataReply.
Readonly type: "quickReply"
The type discriminant.
ContentDataReply
ContentDataReply: { id?: string; title: string }
Shows a button that sends back a predefined text. Used in ContentDataQuickReply.
Type declaration
Optional Readonly id?: string
Postback payload. This field is not visible to the end user.
Readonly title: string
Display value of the action. This is the message that will be sent back when the user taps on the button.
ContentDataText
ContentDataText: { body: string; rawData: string; type: "text" }
Contains only the plain text-based content. Represents the twilio/text content type.
Type declaration
Readonly body: string
The text of the message you want to send.
Readonly rawData: string
Full data as a stringified JSON. This could be used for future content types and fields which are not yet supported by the newest version of the Conversations SDK, or for using newer types in the older versions of the SDK.
Readonly type: "text"
The type discriminant.
ConversationStatus
ConversationStatus: "notParticipating" | "joined"
Status of the conversation, relative to the client: whether the conversation has been joined or the client is notParticipating in the conversation.
ConversationUpdateReason
ConversationUpdateReason: "attributes" | "createdBy" | "dateCreated" | "dateUpdated" | "friendlyName" | "lastReadMessageIndex" | "state" | "status" | "uniqueName" | "lastMessage" | "notificationLevel" | "bindings"
Reason for the updated event emission by a conversation.
DeliveryAmount
DeliveryAmount: "none" | "some" | "all"
Signifies the amount of participants which have the status for the message.
DeliveryStatus
DeliveryStatus: "sent" | "delivered" | "failed" | "read" | "undelivered" | "queued"
Message delivery status.
JSONArray
JSONArray: JSONValue[]
Represents a JSON array.
JSONObject
JSONObject: {}
Represents a JSON object.
Type declaration
[x: string]: JSONValue
JSONValue
JSONValue: null | string | number | boolean | JSONObject | JSONArray
Represents a JSON value.
MediaCategory
MediaCategory: McsMediaCategory
Category of media. Possible values are as follows:
'media'
'body'
'history'
MessageType
MessageType: "text" | "media"
Type of a message.
MessageUpdateReason
MessageUpdateReason: "body" | "lastUpdatedBy" | "dateCreated" | "dateUpdated" | "attributes" | "author" | "deliveryReceipt" | "subject"
The reason for the updated event being emitted by a message.
NotificationLevel
NotificationLevel: "default" | "muted"
User's notification level for the conversation. Determines whether the currently logged-in user will receive pushes for events in this conversation. Can be either muted or default, where default defers to the global service push configuration.
NotificationsChannelType
NotificationsChannelType: ChannelType
Notifications channel type. Possible values are as follows:
'fcm'
'apn'
ParticipantEmailLevel
ParticipantEmailLevel: "to" | "cc"
Email participation level. to = to/from cc = cc
ParticipantType
ParticipantType: "chat" | "sms" | "whatsapp" | "email" | string
Participant type. The string variant can be used to denote new types of participant that aren't supported by this version of the SDK.
ParticipantUpdateReason
ParticipantUpdateReason: "attributes" | "dateCreated" | "dateUpdated" | "roleSid" | "lastReadMessageIndex" | "lastReadTimestamp" | "bindings"
The reason for the updated event being emitted by a participant.
State
State: "failed" | "initialized"
State of the client. Possible values are as follows:
'failed' - the client failed to initialize
'initialized' - the client successfully initialized
UserUpdateReason
UserUpdateReason: "friendlyName" | "attributes" | "reachabilityOnline" | "reachabilityNotifiable"
The reason for the updated event being emitted by a user.
Legend
Constructor
Property
Method
Accessor
 
Property
Method
 
Static property
Static method
Skip to content
Navigation Menu
twilio
twilio-conversations-demo-react
Type / to search
Code
Issues9
Pull requests9
Actions
Projects
Security
Insights

twilio-conversations-demo-react
Public
twilio/twilio-conversations-demo-react
t
Name




kmorope
Merge pull request #151 from kmorope/main
f953093 · 3 months ago
.circleci
feat: Run automation tests
2 years ago
.devcontainer
[RTDSDK-4114] Integrate with GitHub Codespaces (#106)
2 years ago
.husky
feat: Add husky git hooks
2 years ago
AutomationTests
fix: Improve test runner to wait for app startup before launching tests
2 years ago
public
fix: Fix push notification displaying type and unregister service wor…
3 years ago
src
Merge branch 'main' into main
last year
tools/circle-config-generator
feat: Run linting job first
2 years ago
.dockerignore
Added the option to run the demo app locally via Docker
2 years ago
.env.example
feature: Conversations Web Demo App 1.0.0
4 years ago
.eslintrc.json
feature: Conversations Web Demo App 1.0.0
4 years ago
.gitignore
feat: Run automation tests
2 years ago
.prettierrc
chore: Update README.md
3 years ago
Dockerfile
Added the option to run the demo app locally via Docker
2 years ago
LICENSE
Initial commit
4 years ago
README.md
Better explain user management in README.md (#153)
last year
commitlint.config.js
feat: Add husky git hooks
2 years ago
docker-compose.yml
Added the option to run the demo app locally via Docker
2 years ago
package.json
feat: Update Paste library (#154)
last year
tsconfig.json
Disable useUnknownInCatchVariables
2 years ago
tsconfig.tools.json
feat: Run automation tests
2 years ago
webpack.config.js
chore: Bump to the latest version of react-scripts
3 years ago
yarn.lock
feat: Update Paste library (#154)
last year

Repository files navigation
README
Code of conduct
MIT license
Conversations Demo Web Application Overview
SDK version of this demo app: 
The latest available SDK version of this demo app: 
Getting Started
Welcome to the Conversations Demo Web application. This application demonstrates a basic Conversations client application with the ability to create and join conversations, add other participants into the conversations and exchange messages.
You can try out one of our 1-click deploys to test the app out prior to jumping to Next Steps:
Deploy
Test out on Github Codespaces

Note: This deployment requires a token service url.
Deploy to Vercel
Automatically clone this repo and deploy it through Vercel.
Note: This deployment requires a token service url. Vercel will ask for the REACT_APP_ACCESS_TOKEN_SERVICE_URL env variable.

Next Steps
What you'll need to get started:
A fork of this repo to work with.
A way to generate Conversations access tokens.
Optional: A Firebase project to set up push notifications.
Generating Access Tokens
Client apps need access tokens to authenticate and connect to the Conversations service as a user. These tokens should be generated by your backend server using your private Twilio API Keys. If you already have a service that does this, skip to setting the token service URL.
For testing purposes, you can quickly set up a Twilio Serverless Functions to generate access tokens. Note that this is not a production ready implementation.
Generating Access Tokens with Twilio Functions
Create a Twilio Functions Service from the console and add a new function using the Add+ button.
Set the function path name to /token-service
Set the function visibility to Public.
Insert the following code:
// If you do not want to pay for other people using your Twilio service for their benefit,
// generate a username and password pair different from what is presented below.

//The 1st value [user00] acts as your Username for the Demo app Login. The 2nd value within double qoutes will act as your Password for the login.
//This method is not advised to be used in production. This is ONLY for testing. In production, please utilize your own server side application to handle your users. 

let users = {
    user00: "", !!! SET NON-EMPTY PASSWORD AND REMOVE THIS NOTE, THIS GENERATOR WILL NOT WORK WITH EMPTY PASSWORD !!!
    user01: ""  !!! SET NON-EMPTY PASSWORD AND REMOVE THIS NOTE, THIS GENERATOR WILL NOT WORK WITH EMPTY PASSWORD !!!
};

let response = new Twilio.Response();
let headers = {
    'Access-Control-Allow-Origin': '*',
  };

exports.handler = function(context, event, callback) {
    response.setHeaders(headers);
    if (!event.identity || !event.password) {
        response.setStatusCode(401);
        response.setBody("No credentials");
        callback(null, response);
        return;
    }

    if (users[event.identity] != event.password) {
        response.setStatusCode(401);
        response.setBody("Wrong credentials");
        callback(null, response);
        return;
    }
    
    let AccessToken = Twilio.jwt.AccessToken;
    let token = new AccessToken(
      context.ACCOUNT_SID,
      context.TWILIO_API_KEY_SID,
      context.TWILIO_API_KEY_SECRET, {
        identity: event.identity,
        ttl: 3600
      });

    let grant = new AccessToken.ChatGrant({ serviceSid: context.SERVICE_SID });
    if(context.PUSH_CREDENTIAL_SID) {
      // Optional: without it, no push notifications will be sent
      grant.pushCredentialSid = context.PUSH_CREDENTIAL_SID; 
    }
    token.addGrant(grant);
    response.setStatusCode(200);
    response.setBody(token.toJwt());

    callback(null, response);
};
Save the function.
Open the Environment Variables tab from the Settings section and:
Check the "Add my Twilio Credentials (ACCOUNT_SID) and (AUTH_TOKEN) to ENV" box, so that you get ACCOUNT_SID automatically.
Add SERVICE_SID
Open Conversations Services
Copy the SID for Default Conversations Service, or the service you want to set up.
Add TWILIO_API_KEY_SID and TWILIO_API_KEY_SECRET. Create API Keys in the console.
Optionally add PUSH_CREDENTIAL_SID, for more info see Setting up Push Notifications
Copy URL from the "kebab" three dot menu next to it and and use it as REACT_APP_ACCESS_TOKEN_SERVICE_URL .env variable below.
Click Deploy All.
Set the Token Service URL
If you don't have your own .env, rename this repo's .env.example file to .env. Set the value of REACT_APP_ACCESS_TOKEN_SERVICE_URL to point to a valid Access Token server. If you used Twilio Functions for generating tokens, get the value from Copy URL in step 7 above.
REACT_APP_ACCESS_TOKEN_SERVICE_URL=http://example.com/token-service/


NOTE: No need for quotes around the URL, they will be added automatically.
This demo app expects your access token server to provide a valid token for valid credentials by URL:
$REACT_APP_ACCESS_TOKEN_SERVICE_URL?identity=<USER_PROVIDED_USERNAME>&password=<USER_PROVIDED_PASSWORD>


And return HTTP 401 in case of invalid credentials.
Setting up Push Notifications
This demo app uses Firebase for processing notifications. This setup is optional. Note: Support may be limited for some browsers.
Set up Firebase
Create a Firebase project
Go to the Project Settings
Got to the Cloud Messaging and enable Cloud Messaging API (Legacy) through the "kebab" menu besides it.
Note or copy the Server Key token for creating push credentials.
Create Push Credential
Create a push credential to add a push grant to our access token.
Go to the Credentials section of the console.
Create a new FCM Push Credential and set the Firebase Cloud Message Server Key Token as the FCM Secret.
Note or copy the CREDENTIAL SID to set as PUSH_CREDENTIAL_SID env variable in your token creation Function.
Create Firebase App set config
From the Firebase Project Settings General tab, add a web app to get the firebaseConfig, it should look like this:
var firebaseConfig = {
  apiKey: "sample__key12345678901234567890",
  authDomain: "convo-demo-app-internal.firebaseapp.com",
  projectId: "convo-demo-app-internal",
  storageBucket: "convo-demo-app-internal.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:1234abcd",
  measurementId: "EXAMPLE_ID"
};
Note: Firebase API Keys aren't like Twilio API keys and don't need to be kept secret.
Replace this project's firebase-config.example in the public folder with a firebase-config.js containing your specific config.
Enable Push Notification in Conversations Service
Select your conversations service, navigate to the Push Notifications section, and check the Push notifications enabled boxes for the push notifications you want.
Build & Run
Deploy on Github Codespaces
Click 
Wait for the pop-up message to let you know that the port forwarding is done. Then, click "Open in Browser".
If the pop-up message isn't displayed, you can always open "PORTS" tab and click on "Open in Browser" button manually.
Run Application Locally
Run yarn to fetch project dependencies.
Run yarn build to fetch Twilio SDK files and build the application.
Run yarn start to run the application locally.
Run Application Inside Docker
Run docker compose up --build to build and locally run the application inside a Docker container.
License
MIT
About
Twilio Conversations Demo Web Application
Resources
 Readme
License
 MIT license
Code of conduct
 Code of conduct
 Activity
 Custom properties
Stars
 112 stars
Watchers
 15 watching
Forks
 362 forks
Report repository
Releases
No releases published
Packages
No packages published
Contributors29














+ 15 contributors
Languages
TypeScript91.8% 
JavaScript6.7% 
Other1.5%
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
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
Versioning and Support Lifecycle
Android
iOS
JavaScript
Download
SDK Docs
React Demo App
Changelog
Supported Browsers for the JavaScript SDK
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
Changelog
Conversations 2.6.2 (March 13, 2025)
Conversations 2.6.1 (February 17, 2025)
Conversations 2.6.0 (August 8, 2024)
Conversations 2.5.0 (October 25, 2023)
Changes
Conversations 2.4.0 (April 25, 2023)
Conversations 2.3.0 (March 21, 2023)
Conversations 2.2.2 (February 22, 2023)
Conversations 2.2.1 (November 24, 2022)
Conversations 2.2.0 (September 22, 2022)
Conversations 2.1.0 (March 3, 2022)
Conversations 2.0.1 (January 26, 2022)
Conversations 2.0.0 (October 19, 2021)
Conversations 1.2.3 (July 26, 2021)
Conversations 1.2.1 (July 2, 2021)
Conversations 1.2.0 (May 17, 2021)
Conversations 1.1.0 (Oct 16, 2020)
Conversations 1.0.0 (Sep 28, 2020)
Conversations 0.1.0 (Sep 3, 2020)
Changelog: Twilio Conversations JavaScript SDK

Latest release documentation
.
Versioning and Support Lifecycle.
(warning)
Warning
The non-secure script link does not validate Sub-Resource Integrity
 but will download bug fix releases automatically.
The secure link provides cryptographic protection against any changes in the Twilio SDK code, which may be critical in some applications.

Changelog
Conversations 2.6.2 (March 13, 2025)
.js
: non-minified Conversations SDK bundled for browsers.
SHA-256 for non-minified version 2.6.2: sha256-PJwrSjCr5IQ01/uCJ7/yqGlhRG7Kntzfez979vgp92w=
.min.js
: minified Conversations SDK bundled for browsers.
Base64 SHA-256 for minified version 2.6.2: sha256-V5Ed2AkRSkVVlFhtk5lzCHhaW6YapKUFCi9APY5Pqqs=
npm
 Conversations Node.js SDK package.
Docs
 JS SDK documentation.
Secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/releases/2.6.2/twilio-conversations.min.js"


 integrity="sha256-V5Ed2AkRSkVVlFhtk5lzCHhaW6YapKUFCi9APY5Pqqs="


 crossorigin="anonymous"></script>
Non-secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/v2.6/twilio-conversations.min.js"></script>
Changes
Features
Twilsock: Upgraded ws
 to version 8.18.1.
Conversations 2.6.1 (February 17, 2025)
.js
 Non-minified Conversations SDK bundled for browsers.
SHA-256 for non-minified version 2.6.1: sha256-E1sb0oVeQjvTtZ+S9L7vxoYQdZ12F4pay81+SUtqdhE=
.min.js
 Minified Conversations SDK bundled for browsers.
Base64 SHA-256 for minified version 2.6.1: sha256-dvIsyBhuA90h9qTVN37CZ1kLwp+JZRqeV/lxv8X0SoA=
npm
 Conversations Node.js SDK package.
Docs
 JS SDK documentation.
Secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/releases/2.6.1/twilio-conversations.min.js"


 integrity="sha256-dvIsyBhuA90h9qTVN37CZ1kLwp+JZRqeV/lxv8X0SoA="


 crossorigin="anonymous"></script>
Non-secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/v2.6/twilio-conversations.min.js"></script>
Changes
Features
Added a new option for conversation creation: Introduced the Access parameter with a restricted option, enabling the creation of conversations with restricted access.
Bug Fixes
Fixed a React Native compilation issue: Resolved an unexpected } that caused a build error.
Conversations 2.6.0 (August 8, 2024)
.js
 Non-minified Conversations SDK bundled for browsers.
SHA-256 for non-minified version 2.6.0: sha256-uJB2mytJUimQ4CydQTCvw4ImbDaAUhBhMM9gdRfGpaw=
.min.js
 Minified Conversations SDK bundled for browsers.
Base64 SHA-256 for minified version 2.6.0: sha256-xPEivoMXimPOKythl5xUKOfcCMcVg8DVl0I2BmKfmqc=
npm
 Conversations Node.js SDK package.
Docs
 JS SDK documentation.
Secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/releases/2.6.0/twilio-conversations.min.js"


 integrity="sha256-xPEivoMXimPOKythl5xUKOfcCMcVg8DVl0I2BmKfmqc="


 crossorigin="anonymous"></script>
Non-secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/v2.6/twilio-conversations.min.js"></script>
Changes
Features
ESM configuration for Rollup: Implemented support for ECMAScript Modules (ESM) in Rollup, enhancing compatibility and performance.
Bug Fixes
ensureReady: Removed unnecessary catch and reset actions when Twilsock disconnects, improving stability.
Twilsock: Updated the ws package to the latest version, addressing compatibility issues.
Conversations 2.5.0 (October 25, 2023)
.js
 Non-minified Conversations SDK bundled for browsers.
SHA-256 for non-minified version 2.5.0: sha256-LmJX51wpqOKimCPhYCdDGnQZJWpytnArJ+cLdSd/Mk8=
.min.js
 Minified Conversations SDK bundled for browsers.
Base64 SHA-256 for minified version 2.5.0: sha256-aBKm/Hjylgtmr/XtFMSDbUWf+2VlRHBbj4jdgy/KhRc=
npm
 Conversations Node.js SDK package.
Docs
 JS SDK documentation.
Secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/releases/2.5.0/twilio-conversations.min.js"


 integrity="sha256-aBKm/Hjylgtmr/XtFMSDbUWf+2VlRHBbj4jdgy/KhRc="


 crossorigin="anonymous"></script>
Non-secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/v2.5/twilio-conversations.min.js"></script>
Changes
Features
Added support for Email in Flex
Conversations 2.4.0 (April 25, 2023)
.js
 Non-minified Conversations SDK bundled for browsers.
SHA-256 for non-minified version 2.4.0: sha256-aiDMoL8+BoPxRZL8bszYZ1vkXlYNfu+UexlzKijbO1c=
.min.js
 Minified Conversations SDK bundled for browsers.
Base64 SHA-256 for minified version 2.4.0: sha256-n/6RCcuNipqtzWOWjJ1D+UQuQ6jjm66Nu5z6FR5m/a4=
npm
 Conversations Node.js SDK package.
Docs
 JS SDK documentation.
Secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/releases/2.4.0/twilio-conversations.min.js"


 integrity="sha256-n/6RCcuNipqtzWOWjJ1D+UQuQ6jjm66Nu5z6FR5m/a4="


 crossorigin="anonymous"></script>
Non-secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/v2.4/twilio-conversations.min.js"></script>
Features
Added support for message channel metadata
Internal improvements and bugfixes
Conversations 2.3.0 (March 21, 2023)
.js
 Non-minified Conversations SDK bundled for browsers.
SHA-256 for non-minified version 2.3.0: sha256-bAwsIGWPAjLYtyaL7ChBTyiTE4R4/UT3WbR3BbBi+uQ=
.min.js
 Minified Conversations SDK bundled for browsers.
Base64 SHA-256 for minified version 2.3.0: sha256-k37Hx/3U6wN1/ai4gc1FedSzTYAyn1kW3oxTGv+EqLY=
npm
 Conversations Node.js SDK package.
Docs
 JS SDK documentation.
Secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/releases/2.3.0/twilio-conversations.min.js"


 integrity="sha256-k37Hx/3U6wN1/ai4gc1FedSzTYAyn1kW3oxTGv+EqLY="


 crossorigin="anonymous"></script>
Non-secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/v2.3/twilio-conversations.min.js"></script>
Features
Added support for Content API
Conversations 2.2.2 (February 22, 2023)
.js
 Non-minified Conversations SDK bundled for browsers.
SHA-256 for non-minified version 2.2.2: sha256-77sdaO4FcNy2mV29PskLC1rwZjNkv+LwDn/TE4EBgPU=
.min.js
 Minified Conversations SDK bundled for browsers.
Base64 SHA-256 for minified version 2.2.2: sha256-KrOF3nMhorDCOFmy8Lpwz/Du0SElgV4KMyBvW76r0U8=
npm
 Conversations Node.js SDK package.
Docs
 JS SDK documentation.
Secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/releases/2.2.2/twilio-conversations.min.js"


 integrity="sha256-KrOF3nMhorDCOFmy8Lpwz/Du0SElgV4KMyBvW76r0U8="


 crossorigin="anonymous"></script>
Non-secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/v2.2/twilio-conversations.min.js"></script>
Bug fixes
Methods Conversation.leave and Conversation.removeParticipant will now properly work for participants with identities containing special characters.
Conversations 2.2.1 (November 24, 2022)
.js
 Non-minified Conversations SDK bundled for browsers.
SHA-256 for non-minified version 2.2.1: sha256-NRCg6xEOzCTaac5AV0SVT/Ob63Q+nILys+Ac6RmMIp0=
.min.js
 Minified Conversations SDK bundled for browsers.
Base64 SHA-256 for minified version 2.2.1: sha256-BfGQUsDAH2A06f2v117v7T+4qPiRUKbjCFvu/MhNDBg=
npm
 Conversations Node.js SDK package.
Docs
 JS SDK documentation.
Secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/releases/2.2.1/twilio-conversations.min.js"


 integrity="sha256-BfGQUsDAH2A06f2v117v7T+4qPiRUKbjCFvu/MhNDBg="


 crossorigin="anonymous"></script>
Non-secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/v2.2/twilio-conversations.min.js"></script>
Bug fixes
Client.getConversationBySid will no longer throw a deprecation warning when it shouldn't.
Conversations 2.2.0 (September 22, 2022)
.js
 Non-minified Conversations SDK bundled for browsers.
SHA-256 for non-minified version 2.2.0: sha256-IfSb09n9X6nFaXYpr5AKyMfOWyOz0lKHHO3xhzI8JaE=
.min.js Minified Conversations SDK bundled for browsers.
Base64 SHA-256 for minified version 2.2.0: sha256-IVvvlFjCqVxfaKZj7uHAVoOwBtl5q5EjGz4KScEIN+4=
npm
 Conversations Node.js SDK package.
Docs
 JS SDK documentation.
Secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/releases/2.2.0/twilio-conversations.min.js"


 integrity="sha256-IVvvlFjCqVxfaKZj7uHAVoOwBtl5q5EjGz4KScEIN+4="


 crossorigin="anonymous"></script>
Non-secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/v2.2/twilio-conversations.min.js"></script>
Deprecations (will be removed in 3.0):
Client.token getter has been deprecated.
Client.create has been deprecated, use new Client instead.
Message.getMediaByCategory has been deprecated, use Message.getMediaByCategories instead.
Message.attachTemporaryUrlsFor has been deprecated, use getTemporaryContentUrlsForMedia instead.
Event Client.stateChanged has been deprecated, use Client.initialized and Client.initFailed events instead.
New features
Change multiple media interfaces to match the mobile platform SDKs.
Bug fixes
Client initialization no longer fails with broken conversations.
Class name SyncError will no longer get minified in minified bundles.
Attribute parsing has been fixed for SMS participants.
Conversations 2.1.0 (March 3, 2022)
.js
 Non-minified Conversations SDK bundled for browsers.
SHA-256 for non-minified version 2.1.0: sha256-RN+13KZsLo5IcGpk1KPyAdHEZhQSVd66Di4tYINSv+g=
.min.js
 Minified Conversations SDK bundled for browsers.
Base64 SHA-256 for minified version 2.1.0: sha256-v2SFLWujVq0wnwHpcxct7bzTP8wII7sumEhAKMEqgHQ=
npm
 Conversations Node.js SDK package.
Docs
 JS SDK documentation.
Secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/releases/2.1.0/twilio-conversations.min.js"


 integrity="sha256-v2SFLWujVq0wnwHpcxct7bzTP8wII7sumEhAKMEqgHQ="


 crossorigin="anonymous"></script>
Non-secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/v2.1/twilio-conversations.min.js"></script>
New features:
Improved client synchronization time for users with many Conversations and Participants.
Added bindings property to Participant and Conversation.
Added email body and history accessors to Message.
Updated MessageBuilder to support email payload.
Bug fixes
Attempting to use FormData in a non-browser environment will now throw an exception.
Fixed null exceptions are thrown when attempting to execute Message.getEmailBody when no body is attached or when attempting to execute Message.getEmailHistory when no history is attached.
Improved type-checking errors thrown in Message.attachTemporaryUrlsFor.
Fixed bindings update always coming in participantUpdated reasons.
Various documentation improvements.

Conversations 2.0.1 (January 26, 2022)
.js
 Non-minified Conversations SDK bundled for browsers.
SHA-256 for non-minified version 2.0.1: sha256-qh6mHMySA1dWklWKE8GLSfL0vKvTTL4rppgJBU6GIcQ=
.min.js
 Minified Conversations SDK bundled for browsers.
Base64 SHA-256 for minified version 2.0.1: sha256-wvZyrbfbpP/U/l7WRmkS7lPBjsDcNg2Ib7SzKlF4SZo=
npm
 Conversations Node.js SDK package.
Docs
 JS SDK documentation.
Secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/releases/2.0.1/twilio-conversations.min.js"


 integrity="sha256-qh6mHMySA1dWklWKE8GLSfL0vKvTTL4rppgJBU6GIcQ="


 crossorigin="anonymous"></script>
Non-secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/v2.0/twilio-conversations.min.js"></script>
Fixed a post-install script causing issues on some platforms.
Fixed an issue with Client.getConversationBySid returning wrong conversations.
Bumped required Node.js version to 14.

Conversations 2.0.0 (October 19, 2021)
.js
 Non-minified Conversations SDK bundled for browsers.
SHA-256 for non-minified version 2.0.0: sha256-Zi+sUnqbLqAWgi1ckoSa9ym+lCfVY6xOZvDR+/ToHgM=
.min.js
 Minified Conversations SDK bundled for browsers.
Base64 SHA-256 for minified version 2.0.0: sha256-/pQ4lYklKpRl6E4ruYcKqTUcLsfM2FQLUarDWVA9I0o=
npm
 Conversations Node.js SDK package.
Docs
 JS SDK documentation.
Secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/releases/2.0.0/twilio-conversations.min.js"


 integrity="sha256-/pQ4lYklKpRl6E4ruYcKqTUcLsfM2FQLUarDWVA9I0o="


 crossorigin="anonymous"></script>
Non-secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/v2.0/twilio-conversations.min.js"></script>
Breaking changes
null can no longer be passed in place of ClientOptions for client instantiation.
null can no longer be passed to Conversations.updateFriendlyName.
null can no longer be passed to User.updateFriendlyName.
Passing null to Conversation.sendMessage will result in the message body being an empty string.
Client is now considered fully initialized only when the new stateChanged event is emitted with the value "initialized".
Accessing Client.reachabilityEnabled before the client is fully initialized will now throw an error.
Accessing Client.user before the client is fully initialized will now return a non-initialized user. On client initialization, the user will initialize and receive the updated event with all the update reasons.
Default exports have been removed. The SDK now only supports named exports, e.g., import { Client } from "@twilio/conversations";.
New features
Migrated to the Sessionless protocol.
Added support for multiple media.
Conversation.prepareMessage could now be used to send multiple media messages.
Added support for init registrations.
The client should now be created using the constructor. The stateChanged event should be utilized to react to client initialization.
The factory method Client.create is now deprecated. Use the constructor instead.
If a client is created using the deprecated factory method, then Client.onWithReplay should be used to subscribe to its events.
If Client.on is used instead, then some events that are triggered on client initialization will get lost.
Client.unsetPushRegistrationId is now deprecated. Use Client.removePushRegistrations instead.
Other changes
Conversation.addNonChatParticipant now allows all valid JSON values to be passed as attributes.
Fixed type resolution issues on Angular.
Fixed initialization problems on React Native.
The SDK now additionally exports the following types: ParticipantUpdatedEventArgs, MessageUpdatedEventArgs, UserUpdatedEventArgs, Paginator, and NotificationTypes.
All events are now strictly typed when using TypeScript.

Conversations 1.2.3 (July 26, 2021)
.js
 Non-minified Conversations SDK bundled for browsers.
SHA-256 for non-minified version 1.2.3: sha256-fCxO5CJdh4ylmCrBWCTzsqhpE6aIbJ3L0cmt6FGGiDU=
.min.js
 Minified Conversations SDK bundled for browsers.
Base64 SHA-256 for minified version 1.2.3: sha256-fGJzzkCU7845NUd6g0dG6/p0vm5aAIIAi0Vmsply9II=
npm
 Conversations Node.js SDK package.
Docs
 JS SDK documentation.
Secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/releases/1.2.3/twilio-conversations.min.js"


 integrity="sha256-fGJzzkCU7845NUd6g0dG6/p0vm5aAIIAi0Vmsply9II="


 crossorigin="anonymous"></script>
Non-secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/v1.2/twilio-conversations.min.js"></script>
Changes
Fix compilation of TS with type exports, broken since 1.2.1.

Conversations 1.2.1 (July 2, 2021)
.js
 Non-minified Conversations SDK bundled for browsers.
SHA-256 for non-minified version 1.2.1: sha256-/ni6qklORrIc+z+QcqdgxSOlmaczOFLq85cJfKqoKGE=
.min.js
 Minified Conversations SDK bundled for browsers.
Base64 SHA-256 for minified version 1.2.1: sha256-2UkMXiUMrGQwt95PXoLiklv9Hgl87uLXA3G6q/9HP7I=
npm
 Conversations Node.js SDK package.
Docs
 JS SDK documentation.
Secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/releases/1.2.1/twilio-conversations.min.js"


 integrity="sha256-2UkMXiUMrGQwt95PXoLiklv9Hgl87uLXA3G6q/9HP7I="


 crossorigin="anonymous"></script>
Non-secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/v1.2/twilio-conversations.min.js"></script>
Changes
Fix IE11 issues: the SDK should now properly load and work on IE11.
Upgraded to a modern build toolchain, reducing the bundle size.

Conversations 1.2.0 (May 17, 2021)
.js
 Non-minified Conversations SDK bundled for browsers.
SHA-256 for non-minified version 1.2.0: sha256-f48Ke76doR3wMUykEyccmedAUfDqMAaEH7fe4limPAo=
.min.js
 Minified Conversations SDK bundled for browsers.
Base64 SHA-256 for minified version 1.2.0: sha256-lYzPQyaIqs8RXkKxfQnkDbfiosIrDKs/OsJ2VjCcMc8=
npm
 Conversations Node.js SDK package.
Docs
 JS SDK documentation.
Secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/releases/1.2.0/twilio-conversations.min.js"


 integrity="sha256-lYzPQyaIqs8RXkKxfQnkDbfiosIrDKs/OsJ2VjCcMc8="


 crossorigin="anonymous"></script>
Non-secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/v1.2/twilio-conversations.min.js"></script>
Changes
Fix Conversation.lastReadMessageIndex not being set during client initialization.
TypeScript typing for Conversation.lastReadMessageIndex got changed to number \| null.
Dependency bumps.
Documentation improvements.

Conversations 1.1.0 (Oct 16, 2020)
js
 Non-minified Conversations SDK bundled for browsers.
SHA-256 for non-minified version 1.1.0: sha256-DFmUiLiTxQM3i9TCRl8DKUHEm48e6egBi7KlXQ5engc=
.min.js
 Minified Conversations SDK bundled for browsers.
Base64 SHA-256 for minified version 1.1.0: sha256-CyaWtQO775FKI8f8jyY9Oj2w97RC9r6WHooi8OzgSgE=
npm
 Conversations Node.js SDK package.
Docs
 JS SDK documentation.
Secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/releases/1.1.0/twilio-conversations.min.js"


 integrity="sha256-CyaWtQO775FKI8f8jyY9Oj2w97RC9r6WHooi8OzgSgE="


 crossorigin="anonymous"></script>
Non-secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/v1.0/twilio-conversations.min.js"></script>
Changes
Added support for detailed delivery receipts
.

Conversations 1.0.0 (Sep 28, 2020)
First official release for the new Conversations
 product
.js
 Non-minified Conversations SDK bundled for browsers.
SHA-256 for non-minified version 1.0.0: WpAJSSVar1v0rQ89XYLt4MLAOuK+kZ4Brxbadl62p9c=
.min.js
 Minified Conversations SDK bundled for browsers.
Base64 SHA-256 for minified version 1.0.0: wwGP7TgNRaTpRZj6r7CM/ZPMa/mMj44/QRLQNnQMJjU=
npm
 Conversations Node.js SDK package.
Docs
 JS SDK documentation.
Secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/releases/1.0.0/twilio-conversations.min.js"


 integrity="sha256-wwGP7TgNRaTpRZj6r7CM/ZPMa/mMj44/QRLQNnQMJjU="


 crossorigin="anonymous"></script>
Non-secure browser script link
Copy code block
<script src="https://sdk.twilio.com/js/conversations/v1.0/twilio-conversations.min.js"></script>

Conversations 0.1.0 (Sep 3, 2020)
First public release for the new Conversations
 product
This release was for testing only, please do not use it.

Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Changelog: Twilio Conversations JavaScript SDK | Twilio

Skip to contentSkip to navigationSkip to topbar
Twilio Docs
Twilio Conversations
Getting Started
API Reference
Developer/REST API Guides
Conversations SDK Guides
Tutorials
Client-side SDKs
Versioning and Support Lifecycle
Android
iOS
JavaScript
Download
SDK Docs
React Demo App
Changelog
Supported Browsers for the JavaScript SDK
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
Supported Browsers for the Conversations JavaScript SDK

The list of supported browsers by the Conversations JavaScript SDK may vary depending on the SDK version. Please read the release docs
 for detailed info.
Browser
Supported Versions
Chrome for Android
94
Firefox for Android
92
UC Browser for Android
12.12
Chrome
94, 93, 92
Edge
94, 93, 92
Firefox
93, 92, 91
Safari for iOS
15, 14.5-14.8
Safari
15, 14.1, 14
Samsung Internet
15.0, 14.0


Need some help?
We all do sometimes; code is hard. Get help now from our support team
, or lean on the wisdom of the crowd by browsing the Twilio tag
 on Stack Overflow.
Terms of service
Privacy Policy
Copyright © 2025 Twilio Inc.
Supported Browsers for the Conversations JavaScript SDK | Twilio


