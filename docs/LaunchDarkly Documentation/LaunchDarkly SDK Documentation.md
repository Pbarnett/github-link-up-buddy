# LaunchDarkly SDK Documentation
Get started
Welcome to LaunchDarkly!
Hello and welcome to LaunchDarkly! We’re excited to meet you. LaunchDarkly serves a suite of tools that help you ship your code safer, faster, and more effectively with whatever language and frameworks you use today.
This guide explains why feature flags are useful and then takes you through steps to accomplish the following:
Sign up for a free LaunchDarkly trial
Install a LaunchDarkly software development kit (SDK)
Create your first feature flag
Retrieve the value of the feature flag from your code
Create and target an audience with the feature flag
First, let’s talk about what a feature flag is and why it is useful.

An illustration describing a feature flag.
What is a feature flag?
A feature flag is a small piece of code used in software development to enable or disable a feature without modifying your source code or redeploying your app. Feature flags let you reduce the risk of releasing new features by rolling them out progressively across subsets of your users over time. You can enable or disable a feature flag with one click of a toggle in the LaunchDarkly user interface (UI). Turn feature flags on or off for targeted sets of users, which you can identify by context or attribute like email, user type, organization, or any other context you can describe.
How feature flags work
A feature flag is defined in LaunchDarkly through the UI. The feature flag describes different variations of a feature and the targeting rules that specify which end users should receive which variations. Your application provides the context of a user when requesting the value of the feature flag. Using targeting rules, LaunchDarkly returns the value of the feature flag based on the user context your application supplies. Your application can then provide different experiences to each user based on the value of the feature flag.
Here’s what that flow looks like:

A diagram describing the interaction between your app and LaunchDarkly.
Why are feature flags useful?
Conditionally releasing software to small, targeted audiences of users reduces risk in your software development cycle, accelerates the pace with which you can deploy new code, and preserves the quality of your users’ app experience. Smaller audiences can surface unanticipated problems with new features quickly while reducing your support load for each new deployment.
Feature flags are necessary for teams that want to ship fast and safely. Using feature flags for a new release enables a single-click rollback, end-to-end testing in production, and targeted exposure of new features to key customers.
Getting excited? Let’s create your first feature flag.
1. Sign up for a free trial
First, let’s create your LaunchDarkly account and start a free trial. Your free trial gives you 14 days to try all of LaunchDarkly’s tools, including the core unit of work in LaunchDarkly: feature flags.
After 14 days have elapsed, your trial automatically converts to a developer tier plan. This plan tier is free up to 1,000 users or contexts per month and 10,000 experiment keys.
Sign up for a free trial.
Try the LaunchDarkly sandbox
After you sign up for a trial, you can also use the LaunchDarkly demo sandbox.
Here is what a typical Flags list in LaunchDarkly looks like:

The Flags list in LaunchDarkly.
You won’t have any flags in your LaunchDarkly account yet, but you will soon add your first flag.
2. Install an SDK for your codebase
Next, let’s install a LaunchDarkly SDK in the language or framework that you use today.
Open your command line interface (CLI) and use your package manager of choice to install a LaunchDarkly SDK. The SDK will help you retrieve your first feature flag quickly and easily.
To install, select your package manager and copy and paste the command into your CLI:
Java (XML)
Java (Gradle)
JavaScript (yarn)
JavaScript (npm)
.NET (client-side) (C#)
Node.js (server-side) (yarn)
Node.js (server-side) (npm)
Python
React (yarn)
React (npm)
<dependency>
<groupId>com.launchdarkly</groupId>
<artifactId>launchdarkly-java-server-sdk</artifactId>
<version>[7.0.0,8.0.0)</version>
</dependency>

To learn more about every LaunchDarkly SDK, read the SDK documentation.
3. Create your first feature flag
Awesome! You’re ready to create your first feature flag. In this section, you will:
Create a feature flag.
Build your first context.
Retrieve the value of the feature flag.
Integrate the feature flag into the demo code.
First, navigate to the Flags list in the LaunchDarkly UI. The Flags list is empty because this LaunchDarkly project doesn’t have any feature flags yet. In this section, you will make your first one.
Click Create Flag. The flag create page opens.
In the flag create page, give the flag a name and write a description explaining what it does. The flag key automatically populates based on the name you enter.
After you enter a name and description, click Create flag:

The "Create flag" dialog in the LaunchDarkly UI with relevant fields highlighted.
Turning on the flag won't work until you complete the other setup steps
Before you turn on the feature flag, make sure you’ve signed in to LaunchDarkly and created a feature flag. If these steps aren’t complete, clicking On underneath “Targeting configuration for Test” will not work.
Now, turn on the feature flag by clicking On underneath “Targeting configuration for Test.”
Click Review and save to save this setting.

The toggle button to turn on the feature flag.
You are prompted to leave a comment explaining your change. Enter a comment for the feature flag change in the Comment field. To save the comment, click Save changes.
Great! Your first feature flag is created and turned on. Now let’s write some code.
4. Retrieve the value of your first feature flag

An illustration of retrieving a feature flag.
Initialize your LaunchDarkly client
Return to the software project where you installed the LaunchDarkly SDK. Now you can configure the LaunchDarkly client to your account. After you have authenticated, you can retrieve the feature flag you created in Step 3.
Different credentials are available in LaunchDarkly. Here are their names and how they are used:
Environment key: a unique string that identifies each environment in your project. By default, your account is configured with “Production” and “Test” environments. This key is not used in the LaunchDarkly SDKs.
SDK key: this string authorizes a LaunchDarkly client to connect from your server. It is a secret that you should import into your code securely. A common way of doing this is by importing it into your code as an environment variable.
Mobile key: this string authorizes a LaunchDarkly client in a mobile SDK, like iOS or Android. Mobile keys can be reset, so they do not need to be kept secret.
Client-side ID: this string authorizes a LaunchDarkly client for client-side and edge SDKs. The client-side ID does not need to be kept secret. Unlike the mobile key, it cannot be reset.
Expand Implementing LaunchDarkly on the server

Expand Implementing LaunchDarkly in the client

Expand Implementing LaunchDarkly on mobile

Follow security best practices with your SDK keys
For your convenience, the code samples below use placeholder SDK keys in plaintext. Never use a plaintext SDK key in a public repo or a production environment. Use an environment variable to import SDK keys instead.
Now that you have the appropriate credential, initialize the LaunchDarkly client. Import a few dependencies from the LaunchDarkly SDK you installed earlier. Then initialize the client by passing a Config with the SDK key passed as a string:
Java
JavaScript (require)
JavaScript (es2015)
JavaScript (TypeScript)
.NET (client-side)
Node.js (server-side)
Python
React
import com.launchdarkly.sdk.*;
import com.launchdarkly.sdk.server.*;


LDConfig config = new LDConfig.Builder().build();


// Set your LaunchDarkly SDK key.
// This is inlined as example only for onboarding.
// Never hardcode your SDK key in production.
final LDClient client = new LDClient("copy-your-sdk-key-here", config);


if (client.isInitialized()) {
 System.out.println("SDK successfully initialized!");
} else {
 System.out.println("There was an issue initializing - is the SDK key correct?");
}

Execute the code and observe the output:
SDK successfully initialized!
Getting an authentication error?
If you’re having trouble authenticating, make sure you are copying the SDK credential from your Test environment. Credentials from other environments or projects won’t work.
Great! Now you can build your first context.
Build your first context
When you use the LaunchDarkly client to retrieve a feature flag, you need to pass LaunchDarkly a context that describes the audience encountering the feature flag. A context can include any attribute of an audience that your app has captured: email address, user type, company or organization, device type, screen size, demography, geography, or any other descriptor you can define. If you need to, you can pass more than one context to LaunchDarkly simultaneously when retrieving a feature flag.
For the purposes of this example, start by defining a context as a user.
Using the code samples below, expand the test code from earlier in this tutorial by creating the first context with a demo user called “Sandy.” The code samples define the user’s kind, name, email address, and a demo user ID string.
Java
JavaScript (require)
JavaScript (es2015)
JavaScript (TypeScript)
.NET (client-side)
Node.js (server-side)
Python
React
import com.launchdarkly.sdk.*;
import com.launchdarkly.sdk.server.*;


LDConfig config = new LDConfig.Builder().build();


// Set your LaunchDarkly SDK key.
// This is inlined as example only for onboarding.
// Never hardcode your SDK key in production.
final LDClient client = new LDClient("copy-your-sdk-key-here", config);


if (client.isInitialized()) {
 System.out.println("SDK successfully initialized!");
} else {
 System.out.println("There was an issue initializing - is the SDK key correct?");
}


final LDContext context = LDContext.builder("user-id-123abc")
 .name("Sandy")
 .set("email", "sandy@testcorp.com")
 .build()

Perfect! Now that you have authenticated the client and identified the user with a context, you can get the value of your first feature flag.
Retrieving your first feature flag
Now you can retrieve the value of the feature flag. To write this code, return to the feature flag you created earlier and copy the feature flag’s key to your clipboard.

The menu for your first feature flag illustrating the location of the feature flag key.
Next, get the value of the feature flag in the code. Pass the LaunchDarkly client the flag key you just copied, the user context you created in the previous step, and the flag’s fallback value, which you can declare as False:
Java
JavaScript (require)
JavaScript (es2015)
JavaScript (TypeScript)
.NET (client-side)
Node.js (server-side)
Python
React
import com.launchdarkly.sdk.*;
import com.launchdarkly.sdk.server.*;


LDConfig config = new LDConfig.Builder().build();


// Set your LaunchDarkly SDK key.
// This is inlined as example only for onboarding.
// Never hardcode your SDK key in production.
final LDClient client = new LDClient("copy-your-sdk-key-here", config);


if (client.isInitialized()) {
 System.out.println("SDK successfully initialized!");
} else {
 System.out.println("There was an issue initializing - is the SDK key correct?");
}


final LDContext context = LDContext.builder("user-id-123abc")
 .name("Sandy")
 .set("email", "sandy@testcorp.com")
 .build()


boolean flagValue = client.boolVariation('my-first-feature-flag', context, false);


System.out.println("Our first feature flag is: " + flagValue)

Now, if you run the code, you will see the value of the flag is True. Let’s see what happens if you turn your feature flag off.
Returning to the flags list in the LaunchDarkly UI, find the feature flag you created, click Off underneath “Targeting configuration for Test” and then click Review and save.

The menu for your first feature flag illustrating the location of the feature flag key.
Explain the change in the Comment field and click Save changes.
Finally, execute the code again and see what the feature flag returns:
Our first feature flag is: False
The flag you just turned off now has a value of False.
Next, let’s explore how you can leverage a feature flag’s value in more realistic code.
Integrate your first feature flag
The demo code you created earlier is intended to introduce you to the three important concepts of LaunchDarkly: feature flags, authenticated clients, and contexts. Now we can explore how you can integrate them in a more realistic software project.
Imagine that you have a new template you wish to deploy. Using a feature flag will let you deploy this template to a small subset of users first before rolling it out progressively to the entire user base.
Explore this pseudocode that describes how such an implementation could look in production:
Java
JavaScript (require)
JavaScript (es2015)
JavaScript (TypeScript)
.NET (client-side)
Node.js (server-side)
Python
React
import com.launchdarkly.sdk.*;
import com.launchdarkly.sdk.server.*;


LDConfig config = new LDConfig.Builder().build();


// Set your LaunchDarkly SDK key.
// This is inlined as example only for onboarding.
// Never hardcode your SDK key in production.
final LDClient client = new LDClient("copy-your-sdk-key-here", config);


if (client.isInitialized()) {
 System.out.println("SDK successfully initialized!");
} else {
 System.out.println("There was an issue initializing - is the SDK key correct?");
}


final LDContext context = LDContext.builder("user-id-123abc")
 .name("Sandy")
 .set("email", "sandy@testcorp.com")
 .build()


boolean flagValue = client.boolVariation('my-first-feature-flag', context, false);


System.out.println("Our first feature flag is: " + flagValue)


if (flagValue) {
 // Return new template here.
} else {
 // Return old template here.
}

You can imagine implementing your app’s behavior in many different ways depending on what features you want to deploy to your users.
Let’s explore how you would do that by creating an audience.
5. Targeting the audience for your first feature flag
Great! You’re ready to target an audience. In this step, you will:
Create your first audience.
Add your first targeting rule.
Confirm your targeting rule works.
Create your first audience
Here is some code to create some more demonstration users you can target with the feature flag.
This code creates three new users: Alice, Bob, and Carlos. Alice and Bob will share the same context kind as Sandy, who you created earlier. Carlos will be a new kind of context you will define as beta-user:
Java
JavaScript (require)
JavaScript (es2015)
JavaScript (TypeScript)
.NET (client-side)
Node.js (server-side)
Python
import com.launchdarkly.sdk.*;
import com.launchdarkly.sdk.server.*;


LDConfig config = new LDConfig.Builder().build();


// Set your LaunchDarkly SDK key.
// This is inlined as example only for onboarding.
// Never hardcode your SDK key in production.
final LDClient client = new LDClient("copy-your-sdk-key-here", config);


if (client.isInitialized()) {
 System.out.println("SDK successfully initialized!");
} else {
 System.out.println("SDK failed to initialize.  Please check your internet connection and SDK credential for any typo.");
}


final LDContext alice = LDContext.builder("user-id-123abc1")
 .name("Alice")
 .set("email", "alice@testcorp.com")
 .build()


boolean flagValue = client.boolVariation('my-first-feature-flag', alice, false);


System.out.println("Alice's flag value is: " + flagValue)


final LDContext bob = LDContext.builder("user-id-123abc2")
 .name("Bob")
 .set("email", "bob@testcorp.com")
 .build()


boolean flagValue = client.boolVariation('my-first-feature-flag', bob, false);


System.out.println("Bob's flag value is: " + flagValue)


final LDContext carlos = LDContext.builder("user-id-123abc3")
 .name("Carlos")
 .set("email", "carlos@testcorp.com")
 .set("kind", "beta-user")
 .build()


boolean flagValue = client.boolVariation('my-first-feature-flag', carlos, false);


System.out.println("Carlos' flag value is: " + flagValue)

Are you a React or Vue user?
Use the JavaScript example in your console or Node.js to build your first audience. You can also jump to the SDK documentation for the LaunchDarkly React or Vue SDKs.
When you execute the code, observe that all three of the contexts receive False from the feature flag.
Alice's flag value is: False
Bob's flag value is: False
Carlos' flag value is: False
Return to the LaunchDarkly UI to target the feature flag on Carlos, the beta tester.
Add your first targeting rule
Return to the feature flag in the LaunchDarkly UI, then set the feature flag to only target contexts with the kind “beta-user.”
First, click the View targeting rules to display the flag’s existing default rule:

The "View targeting rules" option on a feature flag.
Then, click the + button and select Build a custom rule:

The dropdown menu to add a custom rule to a feature flag.
Next, add a rule disabling the flag for all users with kind “user.” Describe the rule by typing an explanation in the Description field. Then switch the Context kind to Context kind. Finally, target all users with the “user” kind by changing the Values to user:

The menu to target a specific context kind called user.
Change the Serve value to false:

The dropdown menu to set the feature flag's return for the targeted audience to false.
Click Review and save. Leave a comment in the Comment text area and click Save changes.
Next, turn on the feature flag and then click Review and save. Then, add another comment and click Save changes.

The toggle to turn on the feature flag for the beta users.
Terrific! Your feature flag now serves False to all contexts with the “user” kind, while contexts with the “beta-tester” kind receive True.
Return to your demo code to see this in action.
Confirm your targeting rule
Return to the code and execute it again.
Alice and Bob now receive False while Carlos, the context with the “beta-tester” kind, receives True:
Alice's flag value is: False
Bob's flag value is: False
Carlos' flag value is: True
Targeting rules can use multiple contexts to build tightly narrowed subsets with extensible flexibility. Imagine targeting only mobile devices, only users with Gmail addresses, or only users in a certain geography. Each of these can be described with multiple contexts, allowing for granular control on who does and does not get the new feature.
By describing your users with a Context and building targeting rules in your feature flags, your new features can target the precise audience you intend.
And with that, you’re done!
6. What’s next
Let’s review what you accomplished:
With some demonstration code, you installed a LaunchDarkly SDK, created a feature flag, retrieved the value of the flag, explored integrating the feature flag in production, and targeted your first audience of users with your first feature flag.
Congratulations on taking the first steps toward a safer, faster, and more effective methodology for deploying new code with LaunchDarkly. This is only the beginning.

An illustration of feature flags, experiments, and progressive and guarded rollouts.
What’s next?
Learn more about contexts to describe your users and target them with rules
Learn to create your first experiment to A/B test new features
Manage your deployment with a release
Create your first custom metric to measure the effectiveness of your new features
Debug your integration with your SDK’s API reference
Take a course in LaunchDarkly Academy

LaunchDarkly CLI
Overview
This topic describes how to get started with the LaunchDarkly CLI.
LaunchDarkly provides a command line interface (CLI) so that you can set up and manage your feature flags, account members, projects, environments, teams, and other resources directly from the command line.
Installation
The LaunchDarkly CLI is available for macOS, Windows, and Linux.
To install the LaunchDarkly CLI:
Install on macOS with Homebrew
Install on macOS, Windows, or Linux with npm
Pull from Docker
Build from source
Download executable from GitHub
brew tap launchdarkly/homebrew-tap
brew install ldcli

To update to the latest version of the LaunchDarkly CLI:
Update to latest version using Homebrew
Update to latest version using npm
brew upgrade ldcli

Get started
To get started with the LaunchDarkly CLI, you need to authenticate yourself. Then, you can use setup to create and set up your first flag, run any of the ldcli commands.
Authentication
Before you run commands in the LaunchDarkly CLI, you need to authenticate yourself. You have a few options:
Authenticate with your email and password. The login command provides a login link to the LaunchDarkly UI, requests your approval for the LaunchDarkly CLI to access your account information, and then stores an appropriate access token in the LaunchDarkly CLI’s configuration file.
Authenticate with an access token that you create, and use the config command to set the token for your session. The config command to controls authorization and other configuration values.
Authenticate with an access token that you create, and pass the access token each command you run.
Here’s how:
Authenticate with your login
Authenticate with an access token, once
Authenticate with an access token, per command
# you only need to run this once
ldcli login

To learn how to create an access token, read Creating API access tokens.
Setup
The setup command provides a step-by-step guide to create a flag, install an SDK, and toggle that flag:
Run ldcli setup
ldcli setup

Additional documentation
LaunchDarkly provides the following additional documentation:
For more information about common commands, read LaunchDarkly CLI commands.
For details on how to use the LaunchDarkly CLI to perform local testing and development, read Using the LaunchDarkly CLI for local testing and read LaunchDarkly CLI dev-server reference.
You can also use the ldcli [command] --help command to view usage information for all commands for the LaunchDarkly CLI.
To view and contribute to the LaunchDarkly CLI source code, or to file issues for our team, visit the LaunchDarkly CLI GitHub repository.
LaunchDarkly CLI commands
Overview
This topic describes common commands and configuration options in the LaunchDarkly CLI.
The commands included here require you to authenticate yourself, either by logging in to LaunchDarkly or by setting or passing in an access token. To learn how, read Authentication.
View available commands
The majority of the LaunchDarkly CLI commands are resource commands. These commands provide direct access to LaunchDarkly APIs.
To view available commands:
View common commands
View all commands
ldcli

Set input and output formats
For each LaunchDarkly CLI resource command, you can use command line arguments, or use your shell to provide an input file.
For example, here’s how to create a flag using data from the command line:
Create a new flag using data from the command line
ldcli flags create --project default -d '{"name": "Example flag", "key": "example-flag"}'

Here’s how to create the same flag using data from a file:
Create a new flag using data from a file
Example data.json file
ldcli flags create --project default -d "$(cat data.json)"

By default, resource commands return a simplified plaintext output. For example, the default output message for creating the new flag in the example above is Successfully created Example flag (example-flag).
To view the full JSON response from any resource command, use the --output json flag. Optionally, pipe the result through jq for improved formatting. Here’s how:
Create a new flag and display extended, formatted output
ldcli flags create --project default -d '{"name": "Example flag", "key": "example-flag"}' --output json | jq

If you prefer a particular output format, you can use the config command to set that preference:
Configure output format
ldcli config --set output json  # or plaintext

Access SDK credentials
You can access the SDK credentials for a specific project and environment using the environments resource. You need different SDK credentials depending on which SDK you’re working with. To learn more about SDK credentials, read Keys.
Here’s how:
Get SDK key
Get mobile key
Get client-side ID
# use the SDK key for authorization in server-side SDKs


ldcli environments get --project <your project> --environment <your environment> | jq '.apiKey'

Use ldcli for local development
The LaunchDarkly CLI includes a dev-server command that you can use to start a local server, retrieve flag values from a LaunchDarkly source environment, and update those flag values locally. This means you can test your code locally, without having to coordinate with other developers in your organization who are using the same LaunchDarkly source environment.
To learn more, use ldcli dev-server --help or read our guides, Using the LaunchDarkly CLI for local testing and LaunchDarkly CLI dev-server reference.
Use ldcli for uploading sourcemaps
The LaunchDarkly CLI includes a sourcemaps command that you can use to upload JavaScript sourcemaps to LaunchDarkly. This means your sourcemaps are available when you access error monitoring in the LaunchDarkly UI. You must be using the Observability plugin with the JavaScript SDK to use the error monitoring feature.
Here’s how to upload your JavaScript sourcemap:
Upload JavaScript sourcemap
ldcli sourcemaps upload \
--app-version <the current version of your deploy> \
--path <directory where sourcemaps are located locally> \
--base-path <directory where application code runs> \
--project <project key>

The sourcemaps upload command uploads a local version of your sourcemap to LaunchDarkly. To use the command, you must have generated sourcemaps for your project. Exactly how to do this depends on your target environment and JavaScript configuration. Bundlers such as babel, webpack, esbuild, and rollup all provide different ways to enable sourcemap generation. Refer to the documentation for your specific bundler to generate production-ready sourcemaps.
The app-version option takes a string that should match the version you include in the observability plugin options.
The path option defaults to ./build. The command uploads any .map files in the directory specified here.
The base-path option ensures that LaunchDarkly stores the sourcemaps at an appropriate location corresponding to your application’s deployment. For example, suppose your sourcemap file is in ./build/myApp and that when you deploy your app, your code runs from ./dist/myApp. You should provide --path ./build/myApp --basePath ./dist/myApp.
The project option is the LaunchDarkly project key.
If your sourcemap is inline, meaning it’s already shipped as part of your application, then you do not need to upload anything to LaunchDarkly.
To learn more, use ldcli sourcemaps --help.
Find additional documentation
LaunchDarkly provides the following additional documentation:
For information on how to get started with the LaunchDarkly CLI, read LaunchDarkly CLI.
For details on how to use the LaunchDarkly CLI to perform local testing and development, read Using the LaunchDarkly CLI for local testing and LaunchDarkly CLI dev-server reference.
You can also use the ldcli [command] --help command to view usage information for all commands for the LaunchDarkly CLI.
To view and contribute to the LaunchDarkly CLI source code, or to file issues for our team, visit the LaunchDarkly CLI GitHub repository.
LaunchDarkly MCP server
Overview
This topic describes how to get started with the LaunchDarkly Model Context Protocol (MCP) server.
Model-context protocol (MCP) is an open protocol that lets you interact with REST APIs using natural language. The LaunchDarkly MCP server lets you set up and manage feature flags and AI Configs from within your integrated development environment (IDE) or AI client. The REST APIs exposed by the MCP server are called MCP tools.
Get started
To get started, you need an API access token with permission to execute any of the MCP tools available. Then, you need to add the MCP server definition to your AI client.
You also need a JavaScript runtime that support ECMAScript 2020 or newer.
Authentication
First, create an API access token:
Click the gear icon in the left sidenav to view Organization settings.
Click Authorization.
In the “Access tokens” section, click Create token.
Give your token a human-readable Name.
Assign a Role to the token by choosing one from the menu.
The LaunchDarkly MCP server provides tools for managing flags and AI Configs, so your token should have permission to create, read, update, and delete flags and AI Configs in the projects you want to work in. You could use a token with a Writer base role, a LaunchDarkly Developer preset role, or another role that provides this access.
Click Save token. The new token appears in the Authorization page.
Copy and save the token somewhere secure. After you leave this page, the token is obscured.
To learn more, read Creating API access tokens.
Expand Example roles recommended for MCP server access tokens



































Installation
You can install the LaunchDarkly MCP server in any AI client that supports the MCP protocol. For most AI clients, this means creating or updating an MCP server .json configuration file. Refer to your client’s instructions for where this configuration is located.
Here’s how:
Cursor: Update './cursor/mcp.json'
Claude: Update 'claude_desktop_config.json'
{
 "mcpServers": {
   "LaunchDarkly": {
     "command": "npx",
     "args": [
       "-y", "--package", "@launchdarkly/mcp-server", "--", "mcp", "start",
       "--api-key", "api-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
     ]
   }
 }
}

Replace api-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx with your API access token.
Run the MCP server from a local build
Optionally, you can run LaunchDarkly’s MCP server from a local build, instead of from your AI client.
First, install and build the MCP server:
Install LaunchDarkly's MCP server locally
git clone git@github.com:launchdarkly/mcp-server.git


npm install
npm run build

Then, configure your server definition to reference your local clone. For example:
Configure MCP server definition
{
 "mcpServers": {
   "LaunchDarkly": {
     "command": "node",
     "args": [
       "/path/to/mcp-server/bin/mcp-server.js", "start",
       "--api-key", "api-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
     ]
   }
 }
}

Enable the MCP server
Depending on your client, after you update your .json configuration file, you may have additional steps to enable the LaunchDarkly MCP server:
You may need to restart your AI client in order for the updates to the configuration file to take effect.
You may need to toggle on the LaunchDarkly MCP server configuration. For example, in Cursor you must enable each MCP server separately:

A list of MCP servers in Cursor, with the LaunchDarkly MCP server toggled on.


Interaction
After you install the LaunchDarkly MCP server in your AI client, you can prompt your agent to create or manage your flags and AI Configs. Typically you need to click Run tool or similar in your AI client to execute the result.
For example, you could try asking
Create a feature flag called “example feature” in my default project
or
Turn the “example feature” flag ON in all environments
or
Update the targeting rules for “example feature” so it’s only enabled for users in Canada
For additional examples of prompts and responses, read the tutorial Create a feature flag in your IDE in 5 minutes with LaunchDarkly’s MCP server.
Review available MCP tools
The LaunchDarkly MCP server provides the following MCP tools, which correspond to the linked REST API endpoints:
Feature flags
List feature flags
Create a feature flag
Get feature flag
Update feature flag
Delete feature flag
AI Configs
List AI Configs
Create new AI Config
Delete AI Config
Get AI Config
Update AI Config
Create AI Config variation
Delete AI Config variation
Get AI Config variation
Update AI Config variation
Restrict usage
You can specify additional options in your server configuration if you want to restrict the MCP server’s access to your LaunchDarkly account.
To give the MCP server only read-only access, we recommend using both of the following options:
When you create your API access token, specify a Reader base role, or another role with read-only access.
In your server configuration, add "--scope", "read" to the args array.
To enable only specific tools, in your server configuration, add "--tool", "<tool>" to the args array for each tool you want to enable. For example:
Enable only specific MCP tools
{
 "mcpServers": {
   "LaunchDarkly": {
     "command": "npx",
     "args": [
       "-y", "--package", "@launchdarkly/mcp-server", "--", "mcp", "start",
       "--tool", "create-feature-flag", "--tool", "update-feature-flag",
       "--api-key", "api-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
     ]
   }
 }
}

You can find the tools provided by the LaunchDarkly MCP server by reviewing the “Tools” list in your IDE:

A list of tools provided by the LaunchDarkly MCP server.

Setting up an SDK
Overview
This topic explains how to set up an SDK to begin using LaunchDarkly.
Prefer to set up your SDK interactively?
Try our Quickstart guide or CLI to set up your first flag, SDK, and sample application.
Setting up an SDK
The steps to integrate your application with LaunchDarkly are similar across all SDKs. We provide a variety of server-side, client-side, mobile, and edge SDKs to choose from. To learn more about choosing an SDK, read Client-side, server-side, and edge SDKs.
We provide reference documentation for all SDKs under SDKs, including how to get started with each SDK and where to find SDK API documentation, sample applications, public GitHub repositories, and published modules.
Setting up an SDK is similar no matter which SDK you choose. Find specifics in the reference documentation for each SDK. You can also go quickly through an abbreviated setup process in the LaunchDarkly quickstart.
To incorporate a LaunchDarkly SDK into your application:
Install the LaunchDarkly SDK in your application using your project’s dependency manager. This lets your application access the LaunchDarkly SDK.
Initialize the LaunchDarkly client in your application code. This client is the primary way your application uses the SDK and communicates with LaunchDarkly.
Configure the LaunchDarkly client with the appropriate key for your environment. Your SDK key, client-side ID, and mobile key uniquely identify your project and environment, and they authorize your application to connect to LaunchDarkly. In most SDKs, you set this configuration during the initialization step. To learn how to find the appropriate SDK credential, read SDK credentials.
Evaluate each feature flag for a specific context. A context is a generalized way of referring to the people, services, machines, or other resources that encounter feature flags in your product. You can set the attributes for each context in your application. Every feature flag is uniquely identified by a feature flag key. Each SDK provides methods to take the flag key and context and determine which flag variation each context should receive.
Adding contexts to LaunchDarkly
You don’t have to send contexts to LaunchDarkly in advance. After you create contexts in your SDK, you can target them with feature flags before they appear on your Contexts list. Contexts that exist in your SDK appear in the Contexts list automatically after they encounter feature flags.
Shut down the LaunchDarkly client when your application is about to terminate. The client releases the resources it is using and sends pending analytics events to LaunchDarkly, if any. If your application quits without this shutdown step, requests and the Contexts list may not be populated, because they are derived from analytics events.
Editor support
SDK documentation appears in your editor if the editor supports surfacing doc comments. LaunchDarkly offers further integrations for VSCode or IntelliJ IDEA.
These integrations have extended functionality based on Code References aliases. If your team uses aliases to find all flag usage throughout your codebase, you will also have hover documentation wherever those aliases appear. To learn more, read Code references.
Flag evaluations are always available
If the SDK you use loses the connection with LaunchDarkly, your feature flags will still work. The SDK relies on its stored state to evaluate flags. No network communication is required when you evaluate a flag.
By default, an SDK initializes with an empty state. When the SDK first initializes, it opens a streaming connection to LaunchDarkly. The response from LaunchDarkly contains the SDK’s current state, which your SDK uses to make any necessary changes to feature flags. After the initial update, the SDK keeps a streaming connection open to LaunchDarkly. If you make a change in the Flags list or with the REST API, LaunchDarkly sends these changes to all connected SDKs automatically.
If you evaluate a flag before the SDK receives its initial state, or if you try to fetch a flag which otherwise doesn’t exist, or if the SDK is unable to initialize, then the SDK returns a fallback value. You can specify the fallback value in your flag evaluation code. To increase connection resiliency for server-side SDKs, multiple options are available. They are:
use a persistent feature store,
use the Relay Proxy, or
use daemon mode.
SDKs may periodically drop streaming connections. When an SDK loses connectivity to LaunchDarkly, it continues to try to reestablish a streaming connection until it succeeds. If an SDK had a connection to LaunchDarkly at some point, it retains its last known flag values if LaunchDarkly is unavailable.
To learn more about how SDKs handle receiving updates, read Receiving updates from LaunchDarkly.
All SDKs provide synchronous and asynchronous ways of waiting for the SDK’s state to initialize.
Next steps
After you have set up an SDK, you can manage features on your Flags list. To learn more, read The Flags list.
When you’re ready to test your application, use the Live events page to get a real-time view of your feature flag requests as they’re received. To learn more, read Live events.
As you begin using feature flags, here are some useful features you can use without re-deploying your application:
Target with flags
Percentage rollouts
Experimentation
Joining an account
Overview
This topic explains how to join LaunchDarkly as a new account member.
LaunchDarkly is for groups and organizations
You cannot sign up for LaunchDarkly if your email address is not associated with your organization’s account. Instead, an administrator or account owner from your organization must send you an invitation email.
If you want to sign up for LaunchDarkly as an individual, you can sign up for a free trial.
Join your organization’s existing account
You can join your organization’s LaunchDarkly account in one of two ways:
An admin can invite you to your organization’s account
You can request access if your organization has enabled domain matching
You can use the same email address across multiple LaunchDarkly accounts. To learn more, read Using one email for multiple accounts.
Joining through an invitation from a LaunchDarkly Admin
When an Admin invites you to your organization’s LaunchDarkly account, you will receive an email from LaunchDarkly. Follow the instructions in the email to create your account and join your organization.
Joining through domain matching
To request access through domain matching:
Navigate to the Signup page.
Complete and submit the signup form. LaunchDarkly sends a verification email to the email address you provided.
Click the verification link.
If your organization has domain matching enabled, a list of organizations to which you can request access appears.
Select your organization from the list and click “Request access.”
If your organization does not have domain matching enabled, completing the signup form in step 1 will create a new account with a 14-day trial. To learn more, read Enable domain matching.
Email addresses are case sensitive
You must use your email address to join a LaunchDarkly account. The email address you enter during initial setup is case sensitive. Future attempts to log in with that email address will fail if you use different casing.
For example, if you sign up as example@your-work-email.com and later log in as EXAMPLE@Your-Work-Email.com, the login attempt will fail.
Inviting other members to LaunchDarkly
To learn how to invite other members to LaunchDarkly as an Admin, read Add members to LaunchDarkly.
Logging in with SSO
Overview
This topic explains how to use a third-party single sign-on (SSO) provider or identity provider (IdP) to log into LaunchDarkly for the first time.
Logging in using SSO
If your organization has enabled single sign-on (SSO), you will log in to LaunchDarkly using your SSO provider. Your SSO login experience will differ slightly depending on whether your organization initiates the login through LaunchDarkly or through your identity provider (IdP).
Initiating login through LaunchDarkly
To log in through LaunchDarkly:
Navigate to the LaunchDarkly login page.
Enter your work email address.
Click Continue. You are automatically logged in through your SSO provider.
Initiating login through your IdP
To log in through your IdP:
Navigate to your IdP, such as Google, Okta, or OneLogin.
Click on the LaunchDarkly button or tile. You are automatically logged in through your IdP.
For a list of SSO providers LaunchDarkly supports, read Supported external identity providers.
Getting started in different roles
Overview
This topic includes suggested paths through the LaunchDarkly documentation specific to your role.
Get started as a software developer
As a software developer, you’re responsible for creating and implementing feature flags in code. You can use feature flags in any aspect of your application, from the customer-facing user interface (UI) to the backend.
First, you must set up a LaunchDarkly SDK to integrate LaunchDarkly with your code. To learn more, read Setting up an SDK. For information about how to choose an SDK, read Client-side, server-side, and edge SDKs. After you’ve set up a LaunchDarkly SDK, you can create your first feature flag.
For a guided example of these steps, try the Quickstart guide or the LaunchDarkly CLI.
After you have a basic understanding of flags, you can work with others in your organization to determine how you want to target flag variations to contexts or segments. To learn more, read Target with flags.
As you add more flags, you can start organizing your flags across different environments. To learn more, read Organize your flags. This is also a good time to start thinking about managing the lifecycle of each flag. To learn more, read Flags in your codebase. You can also explore our integrations to help you make LaunchDarkly a seamless part of your workflow. Integrations let you configure the product, receive LaunchDarkly events, or use triggers to perform actions on feature flags from third-party tools. To learn more, read Integrations.
As a software developer, you may also be responsible for other engineering work related to feature management, including automatically toggling feature flags, building custom integrations, or exporting data to destinations outside of LaunchDarkly. You can perform these and other operations using the LaunchDarkly REST API. To learn more, read the tutorial Using the LaunchDarkly REST API. For complete reference materials, read the API documentation.
For more ideas on what comes next, read Additional resources.
Get started as a product manager
As a product manager or release manager, you are likely responsible for coordinating deployments and feature releases.
First, learn how to turn feature flags on and off. Then, start thinking about how you’d like to target flag variations.
As a product manager, you may also build and monitor experiments to understand the impact of features you roll out. Each experiment is a set of actions used to test a hypothesis. You can use feature flags to send flag variations to portions of your user base, and compare your end users’ different reactions. You can use this for A/B/n testing, acceptance testing, and stress testing. To learn more, read Experimentation.
For more ideas on what comes next, read Additional resources.
Get started as a systems architect
As a systems architect, you’re responsible for designing services and processes for your organization’s engineering team.
Now that your engineering team is using LaunchDarkly, you can make LaunchDarkly a seamless part of your workflow. Integrations let you configure the product, receive LaunchDarkly events, or use triggers to perform actions on feature flags from third-party tools. For example, LaunchDarkly integrates with various application performance management (APM) tools, with collaboration tools like Slack, with IDE connectors, with workflow management tools, and with several other productivity and management applications. To learn more, read Integrations.
To learn about common problems integrations can help solve, read Integrations use cases. For best practices to help you succeed with LaunchDarkly on specific platforms, read our platform-specific guides.
For more ideas on what comes next, read Additional resources.
Get started as an account administrator
As an account administrator, you are likely responsible for managing account members, monitoring billing and usage, and facilitating any integrations.
First, learn about how to set up and manage account members. Each member must have one of the built-in base roles: No access, Reader, Writer, Admin, Owner. If you would like to set up more precise access control, you can configure custom roles for your members, or use any of several LaunchDarkly-provided roles. To learn more, read Roles.
Next, make sure you understand the options for securing your account, including how to precisely manage which account members can perform certain actions and how to enable multi-factor authentication and single sign-on in your LaunchDarkly account. To learn more, read Secure your account.
If you are in a larger organization, you may also think about grouping your account members into teams. Teams allow you to control permissions for groups of account members, rather than for individuals. Additionally, teams allow you to map permissions in LaunchDarkly to your organizational structure. For example, you can give mobile flag permissions to the mobile team and desktop flag permissions to the desktop team.
Once your account is set up and your organization has started using feature flags, you can use LaunchDarkly’s data visualization tools to understand your monthly billing metrics.
For more ideas on what comes next, read Additional resources.
Launch Insights
Overview
This topic describes the Launch Insights dashboard.
Launch Insights is an executive-level dashboard that summarizes how your organization is adopting the best practices associated with risk-free releases. It gives you visibility across your projects as well as calls to action that help you improve your velocity and release safely.
To view the Launch Insights dashboard, navigate to Insights. The dashboard appears.
By default, the dashboard displays data from the last 60 days for all projects.
To adjust the timeframe, click the Last 60 days dropdown and choose another date range.
To compare data for multiple projects, or review data from a single project, click the Filter by… dropdown. Select the projects you want to compare.
Best practices data and scores
Launch Insights groups best practices into the following categories:
The Release category considers your total flags created, and how many of those flags are using segments, custom rules, and release pipelines. These factors are primary indicators of how well your organization is minimizing risk and providing consistent governance in your releases.
The Monitor category considers how frequently you are using guarded rollouts. Guarded rollouts help you proactively identify any issues with a release. You can use them to monitor a rollout for regressions based on metrics you select, and then manually or automatically roll back if a regression is detected. Open the Total rollouts dropdown to switch between reviewing data on all rollouts, completed rollouts, automatic rollbacks, and manual rollbacks.
The Optimize category considers how frequently you are using Experimentation to ensure your releases consistently deliver the best outcomes. Experimentation lets you connect metrics you create to flags in LaunchDarkly. This way, you can measure the changes in your customers’ behavior based on what flags they evaluate.
For each category, use the accompanying metrics and charts to help determine the best next steps for your organization. Here’s an example:

The Release category chart, metrics, and score for two projects.
To review data for other projects, click the Filter by… dropdown and choose the projects to review. You can choose up to four projects.
Scoring
Launch Insights provides scores (Excellent, Good, Fair, At risk) to summarize how your organization is adopting best practices.
The scores are calculated over 30-day ranges. When you select a date range:
The overall score and individual project scores are based on the 30 days that end with the last date in the selected range. For example, if you select a date range ending on November 15, you will see a score calculated for the dates between October 16 and November 15.
The chart and table for each category (release, monitor, optimize) display data from your selected range, regardless of how long or short the range is.
The overall score is a rating for your adoption of best practices. It is calculated as an average of your scores for the release, monitor, and optimize categories, across your account, weighted by project. Each project’s weight is based on its percentage of overall daily flag evaluations.

Overall score on the Launch Insights dashboard.
You can view adoption scores for each project in the tables underneath the release, monitor, and optimize categories. These scores are an hourly aggregation of metric values for the release, monitor, and optimize categories, respectively.

The release category on the Launch Insights dashboard, with the category score for each project called out.
Activity
The “Activity” section displays additional information on recent changes in your projects, including flag activity and active members. To learn more about flags that are ready for code removal or ready to archive, read Flag lifecycle stages.
By default, the “Activity” section displays activity from all projects in your account. To review activity from just one project, click the All projects dropdown and choose a single project.

The Activity section on the Launch Insights dashboard.
Was this page helpful?
Yes

LaunchDarkly architecture
Overview
This topic gives a high-level explanation of LaunchDarkly’s platform architecture. You may want to read this topic if you are a developer considering implementing LaunchDarkly in your project, or an administrator who wants to understand how LaunchDarkly interacts with your app. If you’re an end user of the LaunchDarkly user interface (UI), you may not need to know what’s explained in this topic.
How LaunchDarkly connects to your application
Your application uses a LaunchDarkly SDK to connect to LaunchDarkly’s flag delivery network, and uses that connection to evaluate and serve specific feature flag variations to specific contexts with any attributes you specify. You can use context attributes to target individuals, device types, geographic regions, infrastructure components, operating system versions, and more. This is true regardless of whether LaunchDarkly serves the flag variation to a desktop, laptop, or mobile device. LaunchDarkly SDKs are available in dozens of languages. To learn more, read SDKs.
The flag delivery network is comprised of a third-party content delivery network (CDN) and LaunchDarkly's distributed core architecture components. LaunchDarkly's core architecture is secure, highly available, and spans multiple cloud availability zones, which enables fast responses and consistent experiences anywhere in the world.
How your application receives flag values
When you integrate a LaunchDarkly SDK with your app, flag evaluation can begin. After the application launches, the LaunchDarkly SDK initializes within that application code. When it initializes, the SDK pulls down the initial feature flag payload and makes it available to the application. This payload is stored and evaluated in your application memory, which lets the app serve feature flag variations near-instantly. The SDK then sends information about that flag evaluation back to LaunchDarkly. If LaunchDarkly is unreachable, the SDK can access in-app fallback flag values that you specify.

A diagram showing the end-to-end connection between LaunchDarkly's flag delivery network and your application. LaunchDarkly's Federal and EU instances have slightly different topology.
When you update a flag’s targeting rules, the update streams to all connected SDKs. Updates stream by default, but sometimes streaming isn’t available, or you do not want your app to maintain long-lived connections to LaunchDarkly. This may be the case if your applications are primarily available on mobile devices, where long-lived connections can consume their end users’ limited data. To support those use cases, LaunchDarkly SDKs can also use polling connections to send and receive flag updates.
There are several different types of LaunchDarkly SDKs that can connect your application to LaunchDarkly, including server-side SDKs, client-side SDKs, edge SDKs, AI SDKs, and more. Client-side SDKs also include SDKs that support mobile devices. To learn more about how each type of SDK works, read Client-side, server-side, and edge SDKs.
Optional components of a LaunchDarkly installation
In addition to LaunchDarkly’s built-in core architecture, two optional components are available for you to configure. You do not have to use either of these components, but if you do, you can use either or both. Whatever you choose, you install and configure the components, and you control the data that flows in or out of them.
The Relay Proxy is an optional component that provides a cache of flag values for a LaunchDarkly environment. To learn more, read The Relay Proxy.

A diagram showing the end-to-end connection between LaunchDarkly's flag delivery network and your application, including an optional Relay Proxy. LaunchDarkly's Federal and EU instances have slightly different topology.
Data Export is an optional feature that allows you to stream event data to different destination services so you can analyze information using your preferred tools. To learn more, read Data Export.

A diagram showing the end-to-end connection between LaunchDarkly's flag delivery network and your application, including an optional Data Export destination. LaunchDarkly's Federal and EU instances have slightly different topology.
LaunchDarkly vocabulary
Overview
This topic defines common words used in the LaunchDarkly application and documentation. While many of these words may be familiar to you, in some cases they have nuances specific to LaunchDarkly.
The following definitions may be useful as you work in LaunchDarkly:
A
AI Config
An AI Config is a LaunchDarkly resource that you create when your application uses artificial intelligence (AI) model generation. It manages the model configurations and messages you use in your application. When you use a LaunchDarkly AI SDK to customize an AI Config, the SDK determines which message and model your application should serve to which contexts. The SDK also customizes the message based on context attributes that you provide.
To learn more, read AI Configs and AI SDKs.
Analysis method
A metric’s analysis method is the mathematical technique by which you want to analyze its results. You can analyze results by mean, median, or percentile.
To learn more, read Analysis method.
Application
An application is a LaunchDarkly resource that describes what you are delivering to a customer. LaunchDarkly automatically creates applications when it establishes a connection with a LaunchDarkly SDK that contains application information. After an application is created, you can build flag targeting rules based on application name, version, or other properties, such as whether or not a particular application version is supported.
To learn more, read Applications and application versions.
Arm averages graph
In LaunchDarkly experiment results, the arm averages graph displays the average value over time for each variation. This graph is useful for investigating trends that impact all experiment variations equally over time.
To learn more, read Bayesian experiment results and Frequentist experiment results.
Attribute
An attribute is a field in a context that you can use in targeting rules for flags and segments. Each context that encounters a feature flag in your product can have a different value for a given attribute.
To learn more, read Context attributes.
Audience
An experiment’s audience is the combination of the targeting rule you’re experimenting on and the number of contexts you allocate to each flag variation.
To learn more, read Allocating experiment audiences.
B
Base role
A base role is a set of permissions that describes the access a member has. LaunchDarkly provides Reader, Writer, Admin, and Owner base roles. Some customers also have a restricted No access role.
To learn more, read Base roles. For details on the permissions in each base role, read Organization roles.
Bayesian statistics
In LaunchDarkly Experimentation, Bayesian statistics is a results analysis option good for experiments with small sample sizes. The other analysis option is frequentist statistics.
To learn more, read Bayesian versus frequentist statistics.
C
Cohort
A cohort can refer to a group of contexts in Amplitude synced with a LaunchDarkly segment, or to the targeting rules on a migration flag.
To learn more about Amplitude cohorts, read Syncing segments with Amplitude cohorts.
Migration flag cohorts are analogous to the targeting rules for other types of feature flags. The default cohort is analogous to the default rule.
To learn more, read Targeting with migration flags.
Confidence interval
In frequentist statistics, the confidence interval is the range of values within which the true metric value is likely to fall if you were to repeat the experiment many times. For example, a 95% confidence interval means that, in repeated experiments, 95% of the calculated intervals would contain the true value of the metric. To learn more, read Frequentist experiment results.
Context
A context is a generalized way of referring to the people, services, machines, or other resources that encounter feature flags in your product.
To learn more, read Contexts.
Context instance
A context instance is a unique combination of one or more contexts that have encountered a feature flag in your product.
To learn more, read Context instances.
Context kind
A context kind organizes your contexts into different types based on the kinds of resources encountering flags. Each context has one kind with a unique set of corresponding attributes that you can use for targeting and Experimentation.
Some customers are billed by contexts. This billing method uses Monthly active users (MAU).
To learn more, read Context kinds.
Control variation
An experiment’s control variation is the flag variation that you are comparing the treatment variation to. The comparison determines if the treatment has a negative or positive effect on the metric you’re measuring.
To learn more, read Experimentation.
Conversion rate
In Bayesian results, the conversion rate column displays:
for count conversion metrics: the total number of times a context triggered a conversion event
for binary conversion metrics: the percentage of contexts that triggered at least one conversion event
To learn more, read Bayesian experiment results and Frequentist experiment results.
Conversions
In experiment results, the conversions column displays the total number of times a context triggered a conversion event measured by a conversion metric.
To learn more, read Bayesian experiment results and Frequentist experiment results.
Credible interval
In Bayesian statistics, the credible interval is the range of values within which the true metric value is likely to fall, given the observed data and prior beliefs. For example, a 90% credible interval means that there is a 90% probability that the true value lies within this range, based on the posterior distribution. To learn more, read Bayesian experiment results.
D
Default rule
A default rule describes the feature flag variation to serve to the contexts that don’t match any of the individual targets or rules you have previously specified for the flag. It is sometimes called the “fallthrough” rule because all of the rules preceding it have been evaluated, and the context encountering the flag has “fallen through” to this last rule. To learn more, read Set the default rule.
The default rule only applies when the flag is toggled on. If the flag is toggled off, then LaunchDarkly will serve the “default off variation” for the flag. In the LaunchDarkly user interface (UI), the default off variation is specified in the field labeled “If targeting is off, serve.” To learn more, read The off variation.
E
Environment
An environment is an organizational unit contained within a project. You can create multiple environments within each project. Environments in LaunchDarkly typically correspond to the environments in which your code is deployed, such as development, staging, and production. All environments in a single project contain the same flags. However, the flags can have different states, targets, and rules in each environment.
To learn more, read Environments.
Evaluation
An evaluation is what happens when:
your application’s code sends the LaunchDarkly SDK information about a particular flag or AI Config and a particular context that has encountered it, and
the SDK sends back the value of the variation that the context should receive.
We say that the SDK evaluates the flag, or that the flag has been evaluated for a particular context or customer. We say that the SDK customizes the AI Config, because for AI Configs the SDK both sends back the value of the variation and also customizes that value based on context attributes.

Try it in your SDK: Evaluating flags, Customizing AI Configs
Event
An event refers to data that LaunchDarkly SDKs send to LaunchDarkly when a user or other context takes an action in your app. Server-side, client-side, and edge SDKs send analytics events to LaunchDarkly as a result of feature flag evaluations and certain SDK calls.
To learn more, read Analytics events and Metric events.
Event key
An event key is a unique identifier you set for a particular kind of event within your app. Metrics use event keys to identify events for performance tracking. Events are environment-specific.
To learn more, read Metric events.
Expected loss
The expected loss for a variation within an experiment is the risk, expressed as a percentage, that the variation will not actually be an improvement over the control variation due to the margin of error in metric results. Expected loss displays only for metrics that use an “Average” analysis method.
To learn more, read Bayesian experiment results and Frequentist experiment results.
Experiment
An experiment is a LaunchDarkly feature that connects a flag or AI Config with one or more metrics to measure end-user behavior. Experiments track how different variations affect end-user interactions with your app, and determine the winning variation. You can run an experiment for one or more iterations.
To learn more, read Experimentation.
Experiment flag
An experiment flag is a temporary flag that has an experiment running on one of its targeting rules.
To learn more, read Flag templates.
Experimentation key
An experimentation key is a unique context key from a from server-side, client-side, AI, or edge SDK, that is included in each experiment:
if the same context key is in one experiment multiple times, LaunchDarkly counts it as one Experimentation key
if the same context key is in two different experiments, LaunchDarkly counts it as two Experimentation keys
Some customers are billed by Experimentation keys. To learn more, read Experimentation keys.
Exposures
In LaunchDarkly experiments, exposures are the total number of contexts included in the experiment over time.
To learn more, read Bayesian experiment results and Frequentist experiment results.
F
Fallback value
The fallback value is the value your application should use for a feature flag or AI Config in error situations.
Specifically, for the client-side, server-side, and edge SDKs, the fallback value is the flag variation that LaunchDarkly serves in the following two situations:
If your application cannot connect to LaunchDarkly.
If your application can connect to LaunchDarkly, but the flag is toggled off and you have not specified a default off variation. To learn more, read The off variation.
For the AI SDKs, the fallback value is the value of the variation of your AI Config to use if the AI Config is not found or if any errors occur during processing.
Regardless of how you configure variations or targeting rules, each time you evaluate a flag or customize an AI Config from the LaunchDarkly SDK, you must include a fallback value as one of the parameters.

Try it in your SDK: Evaluating flags, Customizing AI Configs
Fallthrough rule
A fallthrough rule is a synonym for default rule.
Feature change experiment
A feature change experiment lets you measure the effect different flag variations have on a metric.
To learn more, read Experiment types.
Flag
A flag is the basic unit of feature management. It describes the different variations of a feature and the rules that allow different entities to access them. Different entities that access your features could be a percentage of your application’s traffic, individuals, or people or software entities who share common characteristics like location, email domain, or type of mobile device. The entities that encounter feature flags in your product are called contexts.
To learn more, read Using feature management.
Forest plot
In LaunchDarkly frequentist experiment results, the forest plot displays shows the confidence interval for each treatment variation with respect to the control variation. The forest plot should be your main decision-making tool when deciding on a winning variation for frequentist experiments.
To learn more, read Frequentist experiment results.
Frequentist statistics
In LaunchDarkly Experimentation, frequentist statistics is a results analysis option good for experiments with larger sample sizes. The other analysis option is Bayesian statistics.
Funnel metric group
A funnel metric group is reusable, ordered list of metrics you can use with funnel optimization experiments to measure end user progression through a number of steps, typically from the awareness stage to the purchasing stage of your marketing funnel.
To learn more, read Metric groups.
Funnel optimization experiment
A funnel optimization experiment uses multiple metrics within a funnel metric group to track the performance of each of the steps in a marketing funnel over time.
To learn more, read Experiment types.
G
Guarded release/guarded rollout
A guarded release or guarded rollout is a type of flag rollout in which LaunchDarkly gradually increases the percentage of contexts that are receiving a particular flag variation, while monitoring for regressions. To perform this monitoring, you must attach one or more metrics to your flag. You can configure LaunchDarkly to notify you or automatically roll back a release when it detects a regression.
To learn more, read Guarded rollouts and Releasing features with LaunchDarkly.
H
Holdout
A holdout is a group of contexts that you have temporarily excluded from all or a selected set of your experiments. Holdouts allow you to measure the effectiveness of your Experimentation program.
To learn more, read Holdouts.
Hypothesis
In LaunchDarkly, a hypothesis is a theory or assumption that can be tested with an experiment. A hypothesis should be specific and answer a single question. You can phrase a hypothesis for a LaunchDarkly experiment as:
If [I make a specific change to our codebase], then [one or more measurable metrics will improve] because [the change had this effect].
To learn more, read Formulate a hypothesis.
I
Iteration
An iteration is a defined time period that you run an experiment for. An iteration can be any length that you choose, and you can run multiple iterations of the same experiment.
To learn more, read Managing experiments.
K
Kill switch
A kill switch is a permanent flag used to shut off tools or functionality in the case of an emergency.
To learn more, read Flag templates.
L
Layer
A layer is a set of experiments that cannot share traffic with each other. All of the experiments within a layer are mutually exclusive, which means that if a context is included in one experiment, LaunchDarkly will exclude it from any other experiments in the same layer.
To learn more, read Mutually exclusive experiments.
M
Mean
In frequentist experiment results, the mean is a flag variation’s average numeric value that you should expect in an experiment, based on the data collected so far. Only numeric metrics measure the posterior mean.
To learn more, read Frequentist experiment results.
Member
A member or account member is a person who uses LaunchDarkly at your organization. These people work at your organization or have access rights to your organization’s LaunchDarkly environment for another reason, such as contractors or part-time employees.
To learn more, read Members.
Metric
LaunchDarkly uses different kinds of metrics to do things like measure the impact of variation changes, gauge application performance, track account usage, and more.
The different kinds of metrics within LaunchDarkly include:
Experimentation and guarded rollout metrics: these metrics allow you to measure specific end-user behaviors as part of an experiment or guarded rollout. Metrics can measure things like links clicked, money spent, or response time. When combined with a flag or an AI Config in an experiment, metrics determine which variation is the winning variation. Metrics send metric events to LaunchDarkly. To learn more, read Metrics.
AI Config metrics: these metrics are automatically created by LaunchDarkly AI SDKs and monitor the performance of an AI Config. AI Config metrics are available in the LaunchDarkly user interface if you track AI metrics in your SDK.
Migration flag metrics: these metrics track the progress of a migration flag. To learn more, read Migration flag metrics.
Application adoption metrics: these metrics track the adoption percentage for an application version. To learn more, read Adoption metrics.
Account metrics: these metrics help you understand your monthly active users (MAU) usage, Experimentation key usage, Data Export usage, and server usage for billing purposes. To learn more, read Account usage metrics.
Launch Insights metrics: these metrics summarize how your organization is adopting the best practices associated with risk-free releases. To learn more, read Launch Insights.
Migration flag
A migration flag is a temporary flag used to migrate data or systems while keeping your application available and disruption free. Migration flags break up the switch from an old to a new implementation into a series of recommended stages where movement from one stage to the next is done in incremental steps.
To learn more, read Flag templates.
Monthly active users (MAU)
MAU is a billing metric that measures the number of user contexts your flags encounter from client-side and edge SDKs over a particular month. MAU includes user contexts that are both single contexts and those that are part of a multi-context. These user contexts appear on the Contexts list, and expire from the list after 30 days of inactivity.
To learn more, read Account usage metrics.
Mutually exclusive experiment
A mutually exclusive experiment is an experiment configured to prevent its contexts from being included in other experiments. Experiments are mutually exclusive from each other when they are contained within the same layer.
To learn more, read Mutually exclusive experiments.
O
Organization role
An organization role is a type of role. It is a set of permissions that you can assign to an account member. LaunchDarkly provides several of these as preset roles, including Billing Admin, Admin, Architect, and Member.
To learn more, read Roles, Organization roles, and Member role concepts.
P
P-value
In frequentist experiment results, a treatment variation’s probability value, or p-value, is the likelihood that the observed difference from the control variation is due to random chance. A p-value of less than or equal to 0.05 is statistically significant. The lower the p-value, the less likely the relative difference is due to chance alone.
Percentage rollout
A percentage rollout is a rollout option for a targeting rule that serves a given flag variation to a specified percentage of contexts that encounter the flag. A common use case for percentage rollouts is to manually increment the percentage of customers targeted by a flag over time until 100% of the customers receive one variation of a flag.
To learn more, read Percentage rollouts and Releasing features with LaunchDarkly.
Policy (custom role)
A policy is part of a custom role. A policy combines resources and actions into a set of statements that define what members can or cannot do in LaunchDarkly. You can create policies using the policy builder or the advanced editor.
To learn more, read Roles, and Using policies.
Posterior distribution
In Bayesian statistics, the posterior distribution is the expected range of outcomes for a treatment variation based on prior beliefs about your data gathered from the control variation.
To learn more, read Bayesian versus frequentist statistics.
Posterior mean
In Bayesian experiment results, the posterior mean is a flag variation’s average numeric value that you should expect in an experiment, based on the data collected so far. Only numeric metrics measure the posterior mean.
To learn more, read Bayesian experiment results.
Preset roles
A preset role refers to a project role or organization role that LaunchDarkly provides for customers on select plans. You can assign a preset role to members or teams in your account. You can also add policy statements to a preset role. However, you cannot remove existing policy statements from a preset role.
To learn more, read Preset roles. For details on the permissions in each preset role, read Project roles and Organization roles.
Prerequisite
You can make flags depend on other flags being enabled to take effect. A prerequisite flag is one on which a second flag depends. When the second flag is evaluated, the prerequisite flag must be on, and the target must be receiving the variation of the prerequisite flag that you specify. If the prerequisite flag is toggled off, the target will receive the default off variation of the dependent flag.
To learn more, read Flag prerequisites.
Primary context kind
The primary context kind is the context kind with the highest volume of monthly activity. For most customers, the primary context kind is user.
For billing purposes, LaunchDarkly only charges for contexts from the primary context kind, called MAU. LaunchDarkly calculates this as the context kind with the largest number of unique contexts that evaluate, initialize, or identify any flag from a client-side SDK over a given calendar month.
To learn more about context kinds, read Context kinds. To learn more about billing by contexts, read Calculating billing.
Probability density graph
In LaunchDarkly Bayesian experiment results, the probability density graph displays fine differences in probability for each experiment variation over time.
To learn more, read Bayesian experiment results.
Probability to be best
In Bayesian experiment results, the variation with the highest probability to be best is the variation that had the largest positive impact on the metric you’re measuring. Probability to be best displays only for metrics that use an “Average” analysis method.
To learn more, read Bayesian experiment results.
Probability to beat control
In experiment results, a treatment variation’s probability to beat control is the likelihood that the variation is better than the control variation, and can be considered the winning variation.
To learn more, read Bayesian experiment results.
Progressive rollout
A progressive rollout is a type of flag rollout in which LaunchDarkly gradually increases the percentage of contexts that are receiving a particular flag variation. You can specify the duration and how the percentage increases. A common use case for progressive rollouts is to automatically increment the percentage of customers targeted by a flag over time until 100% of the customers receive one variation of a flag.
To learn more, read Progressive rollouts and Releasing features with LaunchDarkly.
Project
A project is an organizational unit in your LaunchDarkly account. Many LaunchDarkly resources, such as flags and AI Configs, are unique at the project level. Customers on plans that allow creating your own roles can choose to limit access for members or teams based on project.
You can define projects in any way you like. A common pattern is to create one project in your LaunchDarkly account for each product your company makes. Each project has multiple environments, and may include multiple views.
To learn more, read Projects.
Project role
A project role is a type of role. It is a set of permissions that you can assign to an account member. LaunchDarkly provides several of these as preset roles, including Project Admin, Contributor, Developer, Maintainer, and Viewer. Customers on select plans can also create their own project roles.
To learn more, read Roles, Project roles, and Member role concepts.
R
Randomization unit
An experiment’s randomization unit is the context kind that the experiment uses to randomly sort contexts into each variation by, according to the experiment’s traffic allocation. To learn more, read Randomization units.
A guarded rollout’s randomization unit is the context kind that the rollout’s flag and metrics use when tracking a flag variation’s performance over time. To learn more, read Randomization unit.
Regression
A regression is when LaunchDarkly detects a negative effect on your application performance as a result of a flag change or rollout. You can use guarded rollouts to notify you or automatically roll back a release when it detects a regression.
To learn more, read Guarded rollouts.
Relative difference graph
In LaunchDarkly experiment results, the relative difference graph displays a time series of the relative difference between the treatment variation and the control. This graph is helpful for investigating trends in relative differences over time.
To learn more, read Bayesian experiment results and Frequentist experiment results.
Relative difference from control
In experiment results, the relative difference from control column displays how much a metric in the treatment variation differs from the control variation, expressed as a proportion of the control’s estimated value.
To learn more, read Bayesian experiment results and Frequentist experiment results.
Release flag
A release flag is a temporary flag that initially serves “Unavailable” (false) to most or all of its targets, then gradually rolls out the “Available” (true) variation until it reaches 100%.
To learn more, read Flag templates.
Release pipeline
A release pipeline lets you move flags through a series of phases, rolling out flags to selected environments and audiences following automated steps. You can use release pipelines to view the status of ongoing releases across all flags within a project, enforcing a standardized process and ensuring they are following best practices.
To learn more, read Release pipelines.
Role, custom role
A role is a description of the access that a member or team has within LaunchDarkly. Every LaunchDarkly account comes with several built-in base roles, including Reader, Writer, Admin, and Owner.
Customers on select plans additionally have:
access to a No access base role.
access to several organization roles and project roles provided by LaunchDarkly. These provide different sets of permissions that are commonly grouped together, designed around typical personas. For example, LaunchDarkly provides a Developer project role that can perform all flag actions within projects they are assigned, and a Contributor project role that can make changes to flag status but cannot perform destructive actions on it.
the ability to create their own roles, sometimes called custom roles. When you create your own role, you define the access using a set of statements called a policy.
Every member must have at least one role assigned to them, either directly or through a team. This is true even if the role explicitly prohibits them from accessing any information within LaunchDarkly.
To learn more, read Roles, and Member role concepts.
Role attribute
A role attribute is a key that you may use to parameterize a role. When you define a role, you can optionally specify a role scope and corresponding role attributes. Some preset roles also include role scope.
For example, suppose Member A should have access to all actions on flags in Project A, and Member B should have access to all actions on flags in Project B. You can create one role with access to all actions on flags, and set a role scope of project, using a role attribute of developerProjectKey.
When you assign this role to Member A, you can specify “Project A” as the value of the developerProjectKey role attribute. This gives Member A access to all actions on flags in Project A. When you assign the same role to Member B, you can specify “Project B” as the value of the developerProjectKey role attribute to give Member B access to all actions on flags in Project B.
To learn more, read Member role concepts.
Role scope
A role scope is a resource type by which a role may be parameterized. When you define a role, you can optionally specify a role scope and the parameter, which is called a role attribute. Some preset roles also include role scope.
For example, suppose Member A should have access to all actions on flags in Project A, and Member B should have access to all actions on flags in Project B. You can create one role with access to all actions on flags, and set a role scope of project. Then, you can specify Project A when you assign this role to Member A, and specify Project B when you assign this role to Member B.
To learn more, read Member role concepts.
Rule
A rule or targeting rule is a description of which contexts should be included for a given outcome. In flags, targeting rules determine which flag variations your application should serve to which contexts. In segments, targeting rules determine which contexts are part of the segment. In AI Configs, targeting rules determine which variations your application should serve to which contexts.
Targeting rules can have one or more conditions. Each condition has three parts:
A context kind and attribute, which defines the scope of the condition’s impact, such as only targeting an email address for the selected context kind.
An operator, which sets differentiating characteristics of the attribute, such as limiting the condition to emails that end with certain extensions.
A value, which identifies the attribute by a value you specify, such as .edu.
To learn more, read Target with flags, Segment targeting for rule-based and smaller list-based segments, Segment targeting for larger list-based segments, and Target with AI Configs.
S
SDK
The LaunchDarkly SDK is the software development kit that you use to integrate LaunchDarkly with your application’s code.
We provide more than two dozen LaunchDarkly SDKs, in different languages and frameworks. Our client-side SDKs are designed for single-user desktop, mobile, and embedded applications. They are intended to be used in a potentially less secure environment, such as a personal computer or mobile device. Our server-side SDKs are designed for multi-user systems. They are intended to be used in a trusted environment, such as inside a corporate network or on a web server.
When your application starts, your code should initialize the LaunchDarkly SDK you’re working with. When a customer encounters a feature flag in your application, your code should use the SDK to evaluate the feature flag and retrieve the appropriate flag variation for that customer.
To learn more, read Setting up an SDK and Client-side, server-side, and edge SDKs. For more information about the differences between the LaunchDarkly SDK and the LaunchDarkly REST API, read Comparing LaunchDarkly’s SDKs and REST API.
Segment
A segment is a list of contexts that you can use to manage flag targeting behavior in bulk. Segments are useful for keeping groups of contexts, like beta-users or enterprise-customers, up to date. They are environment-specific.
LaunchDarkly supports:
rule-based segments, which let you target groups of contexts individually or by attributes,
list-based segments, which let you target individual contexts or uploaded lists of contexts, and
synced segments, which let you target groups of contexts backed by an external data store.
To learn more, read Segments.
Segment is also the name of a third-party software application that collects and integrates customer data across tools. LaunchDarkly integrates with Segment in the following ways:
You can use Segment as a destination for LaunchDarkly’s Data Export feature. To learn more, read Segment.
You can use Segment as a source for metric events. To learn more, read Segment for metrics.
Segment Audiences is one of several tools you can use to create synced segments. To learn more, read Segments synced from external tools.
Significance level
The significance level of a frequentist experiment is the configured allowable rate of false positives for an experiment. This is sometimes called the “false positive rate.” The significance level is usually represented by the Greek letter “alpha.”
Standard metric group
A standard metric group is reusable set of metrics you can use with feature change experiments to standardize metrics across multiple experiments.
To learn more, read Metric groups.
Statistical significance
In frequentist experiments, statistical significance indicates the likelihood that the observed relationship or effect in the data is not due to random chance. When an experiment result is statistically significant, it means the observed effect is unlikely to have occurred purely by random variation.
T
Target
To target (verb) is to specify that specific contexts that encounter feature flags or AI Configs in your application should receive a specific variation of that resource. A target (noun) is an individual context or a set of contexts described by a targeting rule.
To learn more, read Target with flags, Segment targeting for rule-based and smaller list-based segments, Segment targeting for larger list-based segments, and Target with AI Configs.
Team
A team is a group of members in your LaunchDarkly account. To learn more, read Teams.
Threshold
In Bayesian experiments, the threshold indicates how confident you’d like to be in the experiment’s results before making a decision. A standard threshold is 90%, which means that you want an experiment treatment variation to have a probability to beat the control variation of at least 90% before declaring it a winning variation.
If you require higher confidence, such as 95% or 99%, it will typically take more time to gather enough data to reach that level of certainty. To learn more, read Bayesian experiment results.
Total value
In experiment results, the total value column displays the sum total of all the numbers returned by a numeric metric.
To learn more, read Bayesian experiment results and Frequentist experiment results.
Traffic allocation
An experiment’s traffic allocation is the amount of contexts you assign to each flag variation you’re experimenting on.
To learn more, read Allocating experiment audiences.
Treatment variation
In an experiment, the treatment variation is the flag variation that you are comparing against the control variation, to determine if the treatment has a negative or positive effect on the metric you’re measuring.
To learn more, read Experimentation.
U
Unit aggregation method
The unit aggregation method for a metric is the mathematical method you want to aggregate event values by for the metric’s results. You can aggregate either by sum or by average.
To learn more, read Unit aggregation method.
User
Previously, a user was the only way to refer to an entity that encountered feature flags in your product.
Newer versions of the LaunchDarkly SDKs replace users with contexts. Contexts are a more powerful and flexible way of referring to the people, services, machines, or other resources that encounter feature flags in your product. A user is just one kind of context.
People who are logged in to the LaunchDarkly user interface are called members.
V
Variation
A variation is a description of a possible value that a flag or AI Config can have.
For flags, each variation must contain the possible flag value. It may also contain a name and description. For AI Configs, each variation must contain a model and one or more messages. It must also have a name.
Both flags and AI Configs share variations across environments within a project. However, they can have different states, targets, and rules in each environment.
When you create a flag, you must decide whether it is a boolean flag or a multivariate flag. Boolean flags have exactly two variations, with values of “true” and “false.” Multivariate flags can have more than two variations. Each of the variations must have a value of the same type, for example, a string.
AI Config variations all have the same structure: a name, model configuration, and one or more messages.
To learn more, read Creating flag variations and Create and manage AI Config variations.
In migration flags, variations are built-in and cannot be edited because they are linked to the migration’s stages. To learn more, read Targeting with migration flags.
View
A view is a resource that logically groups flags within a project. You can create multiple views within each project. For example, you can use views to group flags according to the teams in your organization and the features they work on. A given flag can be linked to more than one view.
Views let you restrict access to sets of flags. For example, you can create a role that only allows access to flags in certain views.
To learn more, read Views. For an example of using a view in a role policy, read Example: View-specific permissions.
W
Winning variation
An experiment’s winning variation is the variation that performed the best out of all the variations tested.
For Bayesian experiments, every experiment iteration displays each variation’s probability to beat control. The variation with the highest probability to beat control in tandem with probability to be best is the winning variation.
For frequentist experiments, every experiment iteration displays each variation’s p-value. The variation with the highlighted p-value is the winning variation.
To learn more, read Analyzing experiments.
Create flags
Overview
This category explains how to use LaunchDarkly to create your feature flags.
The topics in this category explain how to create flags and variations, turn targeting on and off, and update flag settings.
Creating new flags
Turning flags on and off
Creating flag variations
Cloning existing flags
Importing flags
Environment-level flag settings

You can also use the REST API: Feature flags
Feature flags and AI ConfigsCreate flags
Creating new flags
Overview
This topic explains how to create new feature flags in LaunchDarkly. You can use feature flags in any aspect of your application, from the customer-facing user interface (UI) to the backend.
The procedures in this topic assume that you have already configured a LaunchDarkly SDK and are ready to use the LaunchDarkly UI.
You must indicate if you are using either mobile or client-side SDKs
By default, flags are only available to server-side SDKs. If you don’t check the SDKs using Mobile Key and/or SDKs using client-side ID boxes when creating a flag, then your mobile and client-side SDKs will not be able to evaluate the flag. To learn more, read Make flags available to client-side and mobile SDKs.
In the LaunchDarkly UI, you can create a new flag, clone and modify an existing flag to create new ones, and set default values for flags.
Create a feature flag
You can create and modify feature flags from the Flags list. To learn more, read The Flags list.
To create a feature flag:
Click Create and choose Flag. The “Create flag” page appears.
Enter a unique, human-readable Name.
(Optional) Update the flag Key. You’ll use this key to reference the flag in your code. A suggested key auto-populates from the name you enter, but you can customize it if you wish.
Flag keys are important and permanent
After you save the flag key, you cannot modify it. You can change a flag’s name, however, whenever you want.
If your organization requires a specific convention for flag keys, you can configure that in the project settings. To learn more, read Flag key conventions.
Whether your organization uses a specific convention or not, be sure to designate flag keys with naming conventions that the SDKs you use support. For example, if your SDK does not use dot notation, you may not want to use dot notation in your flag keys. If you do, LaunchDarkly automatically converts the key to a format your SDK can use, but this can cause collisions if two flags have similar keys. There are configuration options at the SDK level that help you avoid these issues. To learn more, read Flag keys in the React Web SDK.
(Optional) Enter a Description of the flag. A brief, human-readable description helps your account members understand what the flag is for. Flag descriptions can include Markdown and inline Confluence links. To learn more about LaunchDarkly’s integration with Confluence, read Confluence embedded pages.
Set or confirm the Maintainer of the flag.
(Optional) Use the Add views dropdown to add this flag to one or more views. Depending on your project settings, this may be required.
Choose a flag template in the Configuration section. The options are:
Custom: A flag that you can configure exactly how you wish.
Release: A temporary boolean flag designed for feature releases. By default, it serves false to all targets. Although it supports release use cases, it does not configure any rollout or targeting behavior automatically. You can add that behavior after the flag is created.
Kill switch: A permanent flag that enables or disables non-core functionality.
Experiment: A flag that you can use to test a hypothesis and improve on your findings.
Migration: A temporary flag used to migrate data or systems while keeping your application available.
Choose whether the flag should be temporary.
(Optional) If applicable, follow the instructions for the flag template you chose:
For a kill switch, experiment, or release flag, select a Flag variations template:
Choose whether the flag is temporary or permanent.
Boolean: optionally update the Name of the true and false variations.
String: enter a Value for each variation, and optionally update the Name of each variation. To add more variations, click +Add variation.
Number: enter a Value for each variation, and optionally update the Name of each variation. To add more variations, click +Add variation.
JSON: enter a Value for each variation, and optionally update the Name of each variation. To add more variations, click +Add variation.
For a migration flag, choose a two-, four-, or six-stage migration.
(Optional) Update the default variations.
(Optional, Enterprise plans only) Add one or more prerequisite flags. These prerequisites apply to all environments. You can update them for individual environments after you create the flag.
(Optional) Choose one or more tags from the Tags menu.
Tags let you sort flags into groups
Tags are useful for managing flag permissions using custom roles. For example, you can use a specific tag to determine who has read or write access for the flag. To learn more, read Roles.
Check the SDKs using Mobile Key and/or SDKs using client-side ID boxes to indicate which client-side SDKs you will use to evaluate this flag. If you are using a server-side SDK, leave these boxes unchecked.
Click Create flag.
The new flag appears in the Flags list.

You can also use the REST API: Create a feature flag
Feature flag limits
By default, LaunchDarkly allows you to create 5,000 feature flags per project. You can create more upon request. To learn more, read How to right size when you are over LaunchDarkly system resource count limits.
Make flags available to client-side and mobile SDKs
By default, flags are only available to server-side SDKs. When you create a flag, you can choose to expose the flag to SDKs which use client-side IDs, SDKs which use mobile keys, or both. If you’re using a client-side or mobile SDK, you must expose your feature flags for the client-side or mobile SDKs to evaluate them.
You can choose which SDKs flags are available to on the flag’s “Settings” page:

The "Client-side SDK availability" section of a flag's "Settings" page.
If an SDK tries to evaluate a feature flag that is not available, LaunchDarkly serves the fallback value for that flag.
You can also set the client-side availability for all new flags in a project. To learn how, read Client-side availability.
Security implications of making flags available to mobile SDKs
SDKs for mobile devices use mobile SDK keys, which are readily available to mobile apps. A leaked mobile SDK key allows the holder to circumvent JavaScript’s Secure Mode. This can give the holder access to the value of every flag for any context, even without knowing the SDK key that hashes the context key in Secure Mode.
To learn more, read Client-side, server-side, and edge SDKs.
Configure the same flag in different environments
All environments within a project have the same set of feature flags. When you create a new feature flag, it is created in every environment in your LaunchDarkly project. That flag is scoped to your entire project.
Understanding flag scopes
Flag scoping refers to the parts of LaunchDarkly where a flag is available or used. If a flag is scoped at the project level, it is available to all environments within the project, because projects contain environments. To learn more about projects, read Projects.
To learn more about environments, read Environments.
Flag configuration settings are specific to each environment. The changes you make in one environment do not apply to the same flag in any other environment. If you want to, you can configure the same flag in a unique way for every environment you have.
To configure a flag in a different environment:
Navigate to the Flags list.
Click the name of the flag you want to modify.
Click on the environment you want to edit the flag in.
If the environment is not displayed, click the + to display the list of environments, and select the environment you want:

The environment selection menu.


Make any edits as needed.
Click Review and save.
Set default values
When you create a feature flag, some of its variations are designated as default values. You can accept the defaults or change them. When you change default values for a new flag, LaunchDarkly creates the flag across all environments in your project with the new variations set as its default on and off values.

The default variations when creating a flag.
To learn more about default flag values, read Change default flag values.
You can enforce project-level default flag settings
You can optionally configure default flag settings for a project, which LaunchDarkly will apply to any new flags you create within that project. To learn how, read Flag templates.
Turning flags on and off
Overview
This topic explains how to enable and disable flags in the LaunchDarkly platform.
The flag toggle button is a circuit breaker for any feature
The flag button lets you turn off a feature that’s misbehaving without needing to touch any code or re-deploy your application. Wrap the entire feature in a feature flag to control or revoke its rollout seamlessly.
Turn on flags
When you create a new flag, it is turned Off by default. You can turn the flag On by clicking the flag toggle button on the flag’s Targeting tab.
To turn on a flag:
From the Flags list, click on the name of the flag you want to turn on. The flag’s Targeting tab opens.
Click on the tab for the environment you want to turn on the flag for.
If the tab for the environment is not displayed, click the + to display the list of environments, and select the environment you want:

The environment selection menu.


Click the flag toggle. The toggle turns green and displays the word On.

The flag toggle on the targeting tab.


Click Review and save.
To learn more about creating flags, read Creating new flags.
Turn off flags
When you turn a flag to Off, you disable the targeting rules for that flag. Instead of serving an active variation, you serve the off variation.
On the flag’s Targeting tab, you can set an off variation for both boolean and multivariate flags. Boolean feature flags default to false when the feature flag is Off.
To turn a flag Off:
From the Flags list, click on the name of the flag you want to turn on. The flag’s Targeting tab opens.
Click on the tab for the environment you want to turn off the flag for.
If the tab for the environment is not displayed, click the + to display the list of environments, and select the environment you want:

The environment selection menu.


Set the toggle to Off. The variation the flag will serve when you save your changes appears:

The "Off" value for a flag.


Click Review and save.
If you don’t specify an explicit default off variation, LaunchDarkly serves the fallback value for the flag. You can specify the fallback value in your code’s variation calls. View the fallback value in the flag’s Targeting tab.
Planning feature flags for future events
You can schedule a flag for a particular date using scheduled flag changes, or you can use targeting rules to control what it affects and when. For example, you can serve false to deprecate a feature after a date of your choosing, or you can target a specific context or segment to be removed from the flag’s targeting settings. To learn more, read Target with flags.
Watch for changes in your application
When you turn a flag on and off, you should immediately see the corresponding changes in your application. You can try this yourself by following the in-app Quickstart or running ldcli setup in the LaunchDarkly CLI.
If you do not see changes in your application when you turn the flag on and off, try checking the following:
Does your SDK successfully initialize? Look in your application logs for a message that says SDK successfully initialized. If you find SDK failed to initialize instead, check your SDK credentials. You may be using an invalid SDK key, mobile key, or client-side ID.
Does your application use a valid feature flag key and SDK credential? If you are using the in-app Quickstart or running ldcli setup in the LaunchDarkly CLI, the flag key and SDK key, mobile key, or client-side ID for your environment are automatically inserted into the sample code that you are prompted to copy. If you are working directly from one of our Sample applications, you will need to do this manually. Review the README file in the sample application repository for details on where to update your flag key and SDK credential.
Does your organization’s network close long-lived streaming connections? You will not see flag updates if you are no longer connected to LaunchDarkly. Try restarting your application to re-open the connection. If this solves the problem, work with your organization to allow longer-lived streaming connections.
Does your organization’s network use an https proxy? If all of your network traffic is going through a proxy, your application may take longer to update when you turn flags on and off.
Does your organization’s network require additional authorization to allow outbound connections? For example, some organizations require bearer authentication for outbound traffic. You may need to update your application code to include this authorization.
Creating flag variations
Overview
This topic explains how to create and edit your feature flag’s variations and outlines the different types of flag variations.
Flag variations are the same across all environments in a project. Flag targeting is environment-specific. For example, if you add a new flag variation, it is immediately available in all environments in your project. If you change the default targeting rule to serve a different variation, the targeting change only applies to the current environment. To learn more, read Configure the same flag in different environments.
Feature flag variations determine what a context or user receives when they encounter a feature flag.

Try it in your SDK: Evaluating flags
Flag variations
LaunchDarkly supports boolean and multivariate flags. From the flag’s Variations tab, you can add, edit, or delete variations of existing flags:
Boolean flags have two variations: true or false.
Multivariate flags can have more than two variations. The allowed variations depend on the type of flag. Multivariate flags can have string, number, or JSON variations. To learn more, read Multivariate flags.
Changing variation types
After a feature flag has been created, you cannot change the type of its variations. For example, you can’t edit a feature flag that returns numbers to make it return strings instead. To learn more about creating flags, read Creating new flags.
Here is the Variations tab of a multivariate flag:

The "Variations" tab of a flag.
When you add, edit, or delete a feature flag’s variations, the change impacts all environments within the project.
Deleting variations
When you delete a variation, individual targeting and custom rules that return that variation are also deleted. If a custom rule has a percentage rollout, the rollout for that variation is set to zero. If the default rule returns the deleted variation, it will change to return the default off value instead.
LaunchDarkly allows you to delete variations that are designated to be served when targeting is off. Make sure that your application is able to handle a null value when targeting is off in case this happens.
Change default flag values
When you create a feature flag, some of its values are designated as defaults. A flag’s default values are the values that are served when targeting is on or off, unless you specify otherwise. The default value when a flag is On can be either a single variation or a rollout. The default value when a flag is Off can be only a single variation.
For example, a boolean flag could have true set as its default rule when on and false set as its default off variation. A multivariate flag could have variation 2 set as its default rule when on and variation 1 set as its default off variation, with variation 3 and variation 4 configured to appear when contexts match certain targeting rules.
Default values are designated automatically every time you create a feature flag. You can accept the default values or change them. When you change the default values and save a flag, you create the flag across all environments in your project with these values set as its defaults.
Here is an image of a flag’s default values:

The default variations when creating a flag.
To change a flag’s default values for new environments:
Click the pencil icon next to “Variations” in the flag’s right sidebar. The Variations tab opens.
In the “Default variations for new environments” section, update the variations as needed.
Click Review and save.
Editing default values only impacts new environments
If you modify a flag’s default values, the updated defaults only apply to new environments. You can not change the default values in environments that already exist.
Multivariate flags
Multivariate flags let you use one flag to serve more than two variations of a feature simultaneously. There is no limit to the number of variations you can add to a multivariate flag, making it useful for complex use cases and for managing multiple variations of a feature.
Do not edit flag variations that are in use
Do not edit the values of flag variations that are in use. Flag variations are global across all environments within a project. This means that editing the value of a flag variation can have unexpected consequences in other environments, particularly your production environments.
Instead, create a new variation with the new value, and update your targeting rules to serve the new variation where needed.
Multivariate flag variation types include string, number, and JSON. To learn more, read Understanding flag types in the SDK documentation.
You can use multivariate flags to target multiple sets of contexts and provide different variations to each. In the following example, the first rule serves Two-click checkout to all customers whose country is US. The second rule serves One-click checkout to all customers whose email ends with .edu. All customers not targeted in the custom rules are served the default rule.
Here is an image of a flag with custom rules:

A multivariate flag with custom rules.
To learn more about targeting rules, read Target with flags.
You can also use multivariate flags to perform testing with LaunchDarkly’s Experimentation feature. To learn more, read Creating Experiments.
Cloning existing flags
Overview
You can create new flags by cloning existing flags. When you clone a flag, LaunchDarkly makes a new flag and copies the original flag’s targeting configuration for all environments, including default values and whether the flag is toggled on or off. You can then modify the clone’s configuration if needed.
To clone a flag:
Navigate to the Flags list and open the flag you wish to clone.
Click the gear icon. The flag’s “Settings” page appears.
In the “Clone flag” section, click Clone this flag.
The “Clone feature flag” dialog appears:

The "Clone feature flag" dialog.


Enter a unique, human-readable Name.
(Optional) Update the unique flag Key. You’ll use this key to reference the flag in your code. A suggested key auto-populates from the name you enter, but you can customize it if you wish.
(Optional) Enter a Description of the new flag. A brief, human-readable description helps your account members understand what the flag is for.
(Optional) Click into the Tags menu and choose one or more tags for your flag.
Tags sort flags into groups
Tags are useful for managing flag permissions using custom roles. For example, you can tag a flag as “Marketing” and “DevOps,” and then use these tags to determine who has read or write access for the flag. To learn more, read Roles.
Click Save flag. You are taken to the new flag’s Targeting tab.
The new flag appears in the Flags list.
Restrictions on rollouts
If the flag you are cloning has an active guarded rollout or progressive rollout, the rollout is not cloned.

You can also use the REST API: Copy feature flag
Importing flags
Overview
This topic explains how to import flags from other feature management tools into LaunchDarkly. You can import flags from Split.io or Unleash.
When you import flags from another system, the following properties are imported:
Name, key, and description
Variations
Default rule, for when targeting is On and contexts don’t match any targeting rules
Default off variation, for when targeting is Off
Tags
Other flag properties for imported flags are set based on your settings for all environments.
If any flags in the other system have the same flag key as an existing flag in LaunchDarkly, those flags are skipped. They are not imported to LaunchDarkly.
The imported flags are toggled off in all environments in LaunchDarkly, regardless of their state in the other system.
Targeting rules are not imported
When you import flags from another system, the flag prerequisites, individual targets, and targeting rules are not imported. You’ll need to recreate these in LaunchDarkly for each environment. To learn how, read Target with flags.
Import flags
You can import flags, and monitor each import, from the Integrations page in LaunchDarkly. After the import is complete, you can view the imported flags on the Flags list.
Configure flag import
To import flags:
Click the gear icon in the left sidenav to view Organization settings.
Click Integrations and search for “Import.”
Find the integration for the system from which you are importing flags, for example, the “Split” integration or the “Unleash” integration.
Click Add integration. A “Create configuration” panel appears.
(Optional) Enter a Name for this configuration. For example, you might include which systems or projects you are importing from.
Select the Project to import flags into.
You cannot edit this part of the configuration after creation. To import flags into a different project later, create a new flag import configuration.
Enter identifying information for the flags you want to import.
Expand for Split








Expand for Unleash










Enter a LaunchDarkly API Key that has create flag permissions in this LaunchDarkly project. To learn more, read Creating API access tokens.
(Optional) Enter a LaunchDarkly Tag. All flags imported to LaunchDarkly using this configuration will have this tag, which defaults to imported-from-<external tool>. All imported flags will also retain any tags they have in the source system.
Confirm or update the LaunchDarkly Maintainer.
After reading the Integration Terms and Conditions, check the I have read and agree to the Integration Terms and Conditions checkbox.
Click Save configuration.
The import process for your flags begins immediately.
View import status
To view the status of your flag import:
Click the gear icon in the left sidenav to view Organization settings.
Click Integrations and search for “Import.”
Find the integration for the system from which you are importing flags, for example, the “Split” integration or the “Unleash” integration.
From here, you can review the configuration information for this import. This includes the following information:
“Configuration name” column with the configuration name and project.
“State” column with information on the import progress:
A state of “completed” means that all flags selected in this configuration have been imported to LaunchDarkly.
Click See error to view details of any errors for “partial” or “failed” imports. You can also find this information by clicking the overflow menu and choosing “View error log.” If you would like help addressing an error, start a Support ticket.
“Last successful import” column with a timestamp of when the most recent full or partial import occurred.

The list of flag import configurations for the Split integration.
Trigger import
To re-import flags using an existing configuration:
Click the gear icon in the left sidenav to view Organization settings.
Click Integrations and search for “Import.”
Find the integration for the system from which you are importing flags, for example, the “Split” integration or the “Unleash” integration.
Click the expand icon to view the list of flag import configurations. Locate the flag import you want to re-run.
Click the pencil icon. The Edit Split configuration panel appears.
Click Trigger import.
View flags
To view your imported flags, navigate to the Flags list. Optionally, filter the list based on the LaunchDarkly tag you specified during the import configuration.
Imported flags are toggled off in all environments in LaunchDarkly, regardless of their state in the other system. Additionally, flag prerequisites, individual targets, and targeting rules are not imported. You’ll need to recreate these in LaunchDarkly for each environment.
Was this page helpful?
Yes

Environment-level flag settings
Overview
This topic explains how to edit a feature flag’s environment-specific settings and settings for all environments.
Changes you make to a flag’s settings do not apply to other flags, even if they share the same template as the flag you modify. To learn more, read Flag templates.
For information on how to edit a feature flag’s project-level settings, read Project-level flag settings.
Environment-specific settings
To view a flag’s environment-specific settings:
Navigate to the Flags list and open the flag you wish to view settings for.
Click the three-dot overflow menu for the environment you want.

The environment overflow menu.
Select Configuration in environment. The “Environment configuration” screen appears.
Data Export
If you use Data Export, by default LaunchDarkly summarizes flag evaluation events to minimize data use, and limits events transmission to 100 MBps. If you want to send more detailed information instead, you can enable sending detailed events to Data Export destinations. You can adjust this setting for each environment in the project.
To learn more, read Data Export.
Consistency check ratio for migrations
This field lets you adjust how frequently LaunchDarkly checks for differences between old and new data sources during migrations. It defaults to 1, which means it runs for every invocation where the old and new systems run simultaneously.
To learn more, read Migration flags.
Triggers
Flag triggers let you make changes to flag targeting remotely from a third-party application, such as an application performance monitoring (APM) tool. You can use triggers to turn flag targeting on or off. You can enable flag triggers for each environment in the project.
To learn more, read Flag triggers.
Metrics
You can attach metrics to flags as part of a guarded rollout. You can view metrics in the flag’s right sidebar.
To learn more, read Metrics and Guarded rollouts.
Experiments
You can run experiments on flags to find out which flag variation performs better according to metrics you specify. You can view experiments in the flag’s right sidebar.
To learn more, read Experimentation.
Settings for all environments
To view a flag’s settings for all environments:
Navigate to the Flags list and open the flag you wish to view.
Click into the flag’s Settings tab.
Name and description
You can update a flag’s name and description at any time. Updating a flag’s name does not update its key.
The description can include Markdown and inline Confluence links. To learn more about the LaunchDarkly’s integration with Confluence, read Confluence embedded pages.
Flag keys are permanent
In addition to the descriptors, every flag has a unique key which you set during flag creation. Be thoughtful when you create a new flag key. You cannot change it after you save the flag.
Temporary and permanent flags
You can mark flags as temporary or permanent. Use temporary flags for releases or short-term controls. Use permanent flags if the flags are intended to exist in your codebase long-term, for example, a flag that enables a site-wide maintenance mode.
Client-side SDK availability
If you’re using a client-side or mobile SDK, you must expose your feature flags for the client-side or mobile SDKs to evaluate them. To learn more, read Make flags available to client-side and mobile SDKs.
Custom properties
You can use custom properties to connect individual flags to some LaunchDarkly integrations. To learn more, read Custom properties.
Clone flag
You can create new flags by cloning existing flags. When you clone a flag, LaunchDarkly makes a new flag and copies the original flag’s targeting configuration for all environments. To learn more, read Clone flags.
Deprecate flag
You can deprecate a flag to mark it as not ready to be archived or deleted, but are no longer actively supported by your organization. To learn more, read Deprecating flags.
Archive flag
You can archive a flag if you want to retire it from LaunchDarkly without deleting it. Archived flags are archived across all environments. To learn more, read Archiving flags.
Maintainer
The flag maintainer is the account member who is primarily responsible for the flag. You can view and edit the maintainer in the right side bar.
By default, the maintainer is set to the member who created the flag, but you can assign any member of your team as the maintainer for a particular flag. You can update the flag’s maintainer in the flag’s right sidebar.
Enterprise customers using Teams can assign a team as the flag’s maintainer. This offers the additional benefit of shared accountability and also ensures that if one member leaves the team, the flag still has other maintainers.
Tags
Tags are labels that help you categorize flags. They’re especially helpful for managing flag permissions with custom roles. For example, you can tag flags with marketing flags or devOps tags, and then use these tags to determine who has read or write access for the flag. You can update a flag’s tags from the right sidebar.
To learn more, read Tags.
Variations
To edit a flag’s variations, click the pencil icon next to the “Variations” section in the flag’s right sidebar. To learn more, read Creating flag variations.
Code references
Click on the code reference link in the flag’s right sidebar to view the code reference. To learn more, read Code references.
Event tracking
You can enable detailed event tracking for multiple feature flags in a project using the LaunchDarkly REST API. To learn how, read the Knowledge Base article How to bulk enable detailed event tracking for existing flags.
Target with flags
Overview
This category explains how to use flag targeting to control which of your customers receive which variation of a feature flag. Configuring flags to serve different variations to different end users, or “contexts,” is called “flag targeting.”
LaunchDarkly contexts are data objects representing users, devices, organizations, and other entities that interact with your app. These data objects contain context attributes that describe what you know about that context, such as their name, location, device type, or organization they are associated with. LaunchDarkly SDKs can pass any context attributes you want to LaunchDarkly, where you can then use those attributes in flag targeting.
In addition to targeting specific context attributes, you can target individuals, segments, or specific mobile apps and devices. You can also release features based on custom rules you create. You can even set expiration dates for flag targeting if you know you only want customers to receive a flag for a specific period of time.
Here are example targeting rules on a feature flag:

Targeting rules on a feature flag.
Each feature flag can include a combination of prerequisites, individual targets, and targeting rules. Each feature flag must include a default rule.
To learn more about how your application and LaunchDarkly SDKs work together to serve feature flag variations, read LaunchDarkly architecture.
Migration flags are different
Migration flags show different information on their Targeting tab than feature flags do. A migration flag’s Targeting tab shows information about the migration’s health and the cohorts it is targeted to. To learn more, read Migration flags.
The topics in this category explain how to create and manage different types of targeting rules and default flag variations:
Targeting rules
Flag prerequisites
The off variation
The default rule
Targeting rules
Overview
This topic explains how to use flag targeting rules to serve flag variations to different contexts based on their attributes.
About targeting rules
Targeting rules, including the default rule, are all listed on a feature flag’s Targeting tab. You can also use the quick add buttons at the top of the Targeting tab to start different kinds of rollouts or a new experiment.
Each targeting rule includes a description, one or more conditions, and a rollout.
Each condition has three parts:
Context kind and attribute information, which defines the scope of the condition’s impact.
For segment rules, this is always “context,” because segment rules check whether a context is part of a segment.
For mobile rules, this is always the application or device context kind, and then an attribute that you select.
For custom rules, this is the context kind and attribute that you select, such as “user” and “email address.” To learn more, read Attributes.
An operator, which sets differentiating characteristics of the attribute, such as limiting the condition to emails that end with certain extensions. If a condition specifies multiple values for the operator to track, the operator iterates over the array. To learn more, read Operators.
A value, which identifies the attribute by a value you specify. such as .edu or v1. For segment rules, this is the segments that you select.
Rollouts
The rollout describes what variation of the flag to serve when the end user matches the targeting rule. You can set this to any of the variations of the flag, or to a percentage rollout. If you want to roll out the selected variation gradually, you can add a progressive rollout or guarded rollout to the targeting rule. To learn more, read Releasing features with LaunchDarkly.
Here is an image of a targeting rule:

A targeting rule that serves "Available" to all user contexts that contain an "email" attribute with a value that ends in ".edu".
By default, all the targeting rules on the flag’s Targeting tab are expanded, so that you can view their names and a summary of their conditions. To view only the names of the targeting rules, click the collapse icon from the top of the page.
Targeting rules limitations
There is not a specific limit on the number of targeting rules you can have on a flag. As a general rule, the SDK initialization time scales with the combination of the total number of flags in the project, the size of the flag variations, and the number and complexity of targeting rules across all flags in the environment. To discuss specifics for your account, start a Support ticket.
Attributes
LaunchDarkly allows you to create your own attributes. For instance, you might want to target contexts based on plan, group, role, or location.
Here is an example of a context with custom attribute values, though each SDK sends context data to LaunchDarkly in a slightly different format:
A context with custom attributes
{
 "kind": "user",
 "name": "Sandy",
 "email": "sandy@example.com",
 "gymMember": "true"
}

Using attributes, you could show some features to customers on your regular plan, and additional features to customers on your premium plan. Or you could roll out a new feature to 30% of end users at a particular location, rather than 30% of all end users. To learn more, read Context attributes.
In each targeting rule, you can choose an attribute specific to your chosen context kind using the “Attribute” menu.

The "Attribute" menu, showing attributes for a user context.
If an attribute is an object, then in your targeting you can use / as a delimiter to refer to specific object fields. For example, if you have an “address” attribute that includes “city,” “state,” and several other fields, then you can use /address/city in your targeting.
From here, you can also select whether to include or exclude all contexts of a particular context kind based on whether they are part of a segment. To learn more, read Segments.
Operators
LaunchDarkly supports the following operators:
Operator
Attribute type
Meaning
JSON value
is one of (=), is not one of (!=)
string, number, boolean, date
Exact match
in
ends with, does not end with
string
String suffix match
endsWith
starts with, does not start with
string
String prefix match
startsWith
matches regex, does not match regex
string
Regular expression match
matches
contains, does not contain
string
Substring match
contains
greater than (>), less than (<), greater than or equal to (>=), less than or equal to (<=)
number
Numeric comparisons
greaterThan
lessThan
greaterThanOrEqual
lessThanOrEqual
before, after
date
Date comparisons. Dates must be formatted in UNIX milliseconds or a string in RFC-3339 format. To learn more, read Representations of data/time values.
before
after
semantic version is one of (=), is not one of (!=), greater than (>), less than (<), greater than or equal to (>=), less than or equal to (<=)
string
Semantic version comparison. Valid string attributes must follow the semantic versioning specification, although LaunchDarkly allows you to omit the PATCH version. For example, 2.0 is a valid semantic version. To learn more, read Semantic versioning.

For semantic versions, “greater than or equal” (>=) is persisted as “not less than.” Similarly, “less than or equal” (<=) is persisted as “not greater than.” To learn more, read Operators.
semVarEqual
semVarGreaterThan
semVarLessThan
For semantic version is greater than or equal to, use semVarLesThan and set negate to true
For semantic version is less than or equal to, use semVarGreaterThan and set negate to true
is in, is not in (segments only)
segment name
Exact match. If you list more than one segment, LaunchDarkly considers the condition met if the context is in/is not in at least one of the segments.
segmentMatch

Types of targeting
LaunchDarkly supports the following targeting types:
Segment targeting
Individual targeting
Bulk targeting
Mobile targeting
Custom rules
Converting rules into segments
Testing flag targeting
Each flag can include up to 5,000 targeting rules and 50,000 values across all rules.
You can also set flag prerequisites to make flags depend on other flags being enabled to take effect. To learn more, read Flag prerequisites.
Evaluation order
Flags evaluate flag prerequisites and rules from top to bottom.
This diagram represents rule matching behavior:

A tree diagram showing rule matching behavior.
At each step in the process, if the context instance matches the rule, it receives the appropriate variation. If it does not match the rule, it moves on to the next rule.

Configure your SDK: Evaluating flags
Here is how a context instance moves through a flag evaluation:
If your app can’t connect to LaunchDarkly, the context receives the fallback value. Otherwise, it moves to the next step.
If targeting is off, the context receives the default off variation. Otherwise, it moves to the next step. To learn more, read Set default values.
If the flag has prerequisites, and the context doesn’t meet the prerequisites, it receives the default off variation. Otherwise, it moves to the next step. To learn more, read Flag prerequisites.
If the context is individually targeted, it receives the chosen variation in the individual targeting rule. Otherwise, it moves to the next step. To learn more, read Individual targeting.
If the context meets a flag rule, it receives the chosen variation. Otherwise, it moves to the next step. If there are multiple flag rules, the context moves through the rules from top to bottom.
If the context doesn’t meet any of the previous criteria, it receives the default on variation. To learn more, read Set default values.
Here is an image of two targeting rules:

Two rules, targeting a segment and an organization context.
In this example, the first rule (if the segment is not in Beta users) is evaluated before the second rule (if the organization key is Beta).
You can re-order rules by clicking and dragging them into different positions. Alternatively, you can click the overflow menu of the flag targeting rule you want to move. Then, select Move rule up or Move rule down.
Rule duplication
You can create new targeting rules by duplicating a flag’s existing targeting rule and modifying the new rule.
To duplicate an existing targeting rule:
Click on the flag rule’s three-dot overflow menu and choose “Duplicate rule.” A new rule appears.
If the flag is off and the rules are hidden, click View targeting rules.
Make at least one change to the existing rule or the new rule.
Click Review and save.
Here is an image of the “Duplicate rule” option in the rule menu:

A feature flag's "Duplicate rule" option.
The new rule appears below the original rule. You must make at least one change to either the existing rule or the new rule before saving your changes, to prevent two exact duplicate rules on the same flag.
Was this page helpful?
Yes

Segment targeting
Overview
This topic explains how to control which segments receive a variation of a feature flag.
Target segments
Segments are lists of contexts that you can use to manage flag targeting behavior in bulk. You can target segments to release features to groups of contexts or end users at once.
We recommend using a segment when you want to target the same group of contexts using multiple flags. You can target the segment in each flag, rather than recreating a targeting rule or set of rules for many flags.
To target segments:
From the flag’s Targeting tab, click the + button between existing rules.
If the flag is off and the rules are hidden, click View targeting rules.
Select “Target segments”:

The "+" menu, with targeting options.
(Optional) Enter a name for the rule.
In the Operator menu, select whether you want contexts in these segments or not in these segments to match the targeting rule.
In the Segments menu, enter or select the segments you want to target.
(Optional) Click the + to add additional clauses to your targeting rule.
From the Select… menu, select either the variation to serve, a manual percentage rollout, a progressive rollout, or a guarded rollout.
Click Review and save.
Here is an example of a targeting rule for segments:

A targeting rule for segments.
To reference this rule when working with other members of your organization, click the three-dot overflow menu and choose Copy link to rule.
To learn more, read Segments.
On this page
Overview
Target segments
Feature flags and AI ConfigsTarget with flagsTargeting rules
Segment targeting
Overview
This topic explains how to control which segments receive a variation of a feature flag.
Target segments
Segments are lists of contexts that you can use to manage flag targeting behavior in bulk. You can target segments to release features to groups of contexts or end users at once.
We recommend using a segment when you want to target the same group of contexts using multiple flags. You can target the segment in each flag, rather than recreating a targeting rule or set of rules for many flags.
To target segments:
From the flag’s Targeting tab, click the + button between existing rules.
If the flag is off and the rules are hidden, click View targeting rules.
Select “Target segments”:

The "+" menu, with targeting options.
(Optional) Enter a name for the rule.
In the Operator menu, select whether you want contexts in these segments or not in these segments to match the targeting rule.
In the Segments menu, enter or select the segments you want to target.
(Optional) Click the + to add additional clauses to your targeting rule.
From the Select… menu, select either the variation to serve, a manual percentage rollout, a progressive rollout, or a guarded rollout.
Click Review and save.
Here is an example of a targeting rule for segments:

A targeting rule for segments.
To reference this rule when working with other members of your organization, click the three-dot overflow menu and choose Copy link to rule.
To learn more, read Segments.
Individual targeting
Overview
This topic explains how to control which individual contexts receive a variation of a feature flag, based on the context key.
Target individual contexts
The flag’s Targeting tab allows you to assign individual contexts to a particular flag variation, based on the context key. You can target individual users or any custom context kind that exists in your project.
Opt in to the new context targeting experience
You can opt in to the new context targeting experience in the Feature preview menu. To do this, click your member icon in the left sidenav and choose Feature preview. Then, toggle On “Improved context targeting experience.”
To individually target contexts:
In the flags dashboard, scroll or search to find the flag you want.
Click the flag’s name to open the flag’s Targeting tab.
Click the + button beneath the toggle section and select Target individuals.
If the flag is off and the rules are hidden, click View targeting rules.

The "+" menu, with targeting options.


In the “Select or add a context” field, search for and select the context you want to target.
Alternatively, you can create a new context from the search menu. To do so:
Enter the new context key.
Click Click to target context with the key….
Select a context kind from the context kind menu.
Select a variation to Serve.
To add more contexts, repeat steps 4-6.
Click Review and save.
Contexts that LaunchDarkly has evaluated within the last 30 days are indicated by a solid circle icon. Contexts that LaunchDarkly has not evaluated within the last 30 days are indicated by a dotted circle icon. Click on an individual context name to view its context details.
You can search for individually targeted contexts using the search bar, or filter the list of individually targeted contexts by Context kind or Variation:

The filter options for individually targeted contexts.
Only target small numbers of contexts individually
We recommend using individual targeting only for very small numbers of individual contexts. Individually targeting more than 10,000 contexts per environment may cause performance degradation, because the SDK takes longer to initialize when the targeting rules payload is large.
Instead, we recommend using targeting rules or segments to target large numbers of contexts. To learn how, read Custom targeting rules and Segment targeting.
If your application is already sending data back to LaunchDarkly, you can search for any context kind by name or key. These strings are case sensitive.
If you need to target a context that LaunchDarkly doesn’t know about, you can enter its key manually. These contexts display in yellow until they encounter a feature flag.
In the screenshot below, specific contexts are receiving the “True” variation of a flag:

A flag with a user context individually targeted.
You can also use the JSON editor
To learn how to create individual targeting rules using JSON, read Individual targeting.

You can also use the REST API: Individual context targets
Remove individual targets
Opt in to the new context targeting experience
You can opt in to the new context targeting experience in the Feature preview menu. To do this, click your member icon in the left sidenav and choose Feature preview. Then, toggle On “Improved context targeting experience.”
You can remove individual targets from a flag:
Navigate to the flag’s Targeting tab.
Find the individual targeting rule and click Edit.
If the flag is off and the rules are hidden, click View targeting rules.
Click the trash icon next to the context you want to remove:

An individually targeted user context with the trash icon called out.


(Optional) If you need to undo the changes you just made, click the undo arrow icon to discard all changes:

A targeting rule's "undo arrow" button called out.
A “Discard unsaved changes” dialog appears. Click Discard changes to undo all the changes you have made, or Cancel to return to the details page.
Click Review and save.
Schedule removal dates for individual targeting
Scheduling removal dates is available to customers on select plans
Scheduling removal dates is only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
You can schedule a removal date and time for each individual context that is targeted by a flag. By doing this, you can specify a future date and time after which the context will no longer be targeted for the specific flag. You can do this when you add a new individual target, or for existing individual targets.
This is useful if you want to give customers trial access to a feature, run a controlled beta test, or just keep your flags organized by not having too many flags working at once.
You can also schedule a context to be removed from a segment, rather than from flag targeting. To learn more, read Scheduling removal from segments.
Opt in to the new context targeting experience
You can opt in to the new context targeting experience in the Feature preview menu. To do this, click your member icon in the left sidenav and choose Feature preview. Then, toggle On “Improved context targeting experience.”
To schedule a removal date for an individual target:
Navigate to the Flags list and select the flag for which you want to configure a removal date. The flag’s Targeting tab opens.
If the flag is off and the rules are hidden, click View targeting rules.
Find the individual targeting rule and click Edit.
Click the calendar icon next to the context you want to schedule a removal date for:

An individual target with the calendar icon called out.


Set a date and time for the context to be removed from the flag.
Click Save.
(Optional) If you need to undo the changes you just made, click the undo arrow icon to discard all changes.
Click Review and save.
The individual targets are now scheduled for removal on the date and time you specified.
Edit existing scheduled removal dates
Individual targets that already have a removal date scheduled appear with a red calendar icon.
To edit a scheduled removal date:
Click Edit next to the individual targeting rule.
Click the red calendar icon next to the individual context.
Update the removal date, and click Save. To remove the date completely, click Remove.
The removal date is now updated.

You can also use the REST API: Update expiring context targets for feature flag
Bulk targeting
Bulk targeting is available to customers on select plans
Bulk targeting is only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
Overview
This topic explains how to perform edits on groups of contexts with the “Bulk edit” option, or export all the contexts a flag is targeted to with the “Export as CSV” option.
The bulk edit option lets you manage all of your individual targets for a single feature flag variation. You can use bulk editing with the “user” context kind to make changes in large numbers, such as adding or removing contexts from a flag variation. The export as CSV option lets you export all the context keys for a flag’s targeting settings as a spreadsheet.
Bulk targeting limitations
We recommend using individual targeting only for very small numbers of individual contexts. Individually targeting more than 10,000 contexts per environment may cause performance degradation, because the SDK takes longer to initialize when the targeting rules payload is large.
Instead, we recommend using targeting rules or segments to target large numbers of contexts. To learn how, read Custom targeting rules and Segment targeting.
Bulk edit targets
If you have a long list of contexts you want to add, remove, or replace within a individual targeting rule, you can bulk edit these contexts from a flag’s Targeting tab.
Opt in to the new context targeting experience
You can opt in to the new context targeting experience in the Feature preview menu. To do this, click your member icon in the left sidenav and choose Feature preview. Then, toggle On “Improved context targeting experience.”
To add, edit, or remove contexts in bulk:
Navigate to the Flags list and choose the flag you wish to modify. The flag’s Targeting tab opens.
If the flag is off and the rules are hidden, click View targeting rules.
Click Edit in the individual targeting section.
If the flag does not yet have an individual targeting section, click the + button beneath the toggle section and select Target individuals.

The "+" menu, with targeting options.


Click the three-dot overflow menu:

The overflow menu in the individual targets section.


Select Bulk edit. A “Bulk editing” dialog appears.
Choose Add, Remove, or Replace from the menu.
Use the menu to do one of the following actions:
Add adds the selected contexts as targets to the variation
Remove removes the selected contexts from the target variation
Replace replaces all currently targeted contexts with the selected contexts
Enter a list of context keys in the these users field, separated by a comma or new line. LaunchDarkly looks up contexts with a “user” context kind by key and displays them by name in the list on the right. If you want to target a context that has not yet been encountered by LaunchDarkly, you must enter the key.

The "Bulk editing" dialog.
You can update the list on the right before you perform the selected action. The options for updating the list include the following:
All represents all of the contexts that may be impacted by the action, whether they are added or removed. Check the checkbox for the action to apply.
The checkmark represents inputted context keys that currently match contexts in the system. For example, if you enter the key user-key-123-abc, and a user context with that key already exists in LaunchDarkly, it will show up by name in this list.
The question mark represents contexts with no matching records in LaunchDarkly. If you are adding contexts and the contexts do not currently exist in LaunchDarkly, they will be added to the targeting list.
Current lists all of the currently targeted contexts for the variation.
Click Add N targets, Remove N targets, or Replace N targets to perform the selected action.
If you want to target the same large numbers of user contexts in multiple flags, you can create a segment, set up targeting rules for the segment, and target the segment instead. To learn how, read Segments.
Export a list of contexts to CSV
You can download a list of all the contexts a flag variation is targeted to from the flag’s Targeting tab.
To export a list of contexts to a CSV file:
Navigate to the Flags list and choose the flag you wish to export contexts for.
Find the individual targeting rule and click Edit.
If the flag is toggled off and the rules are hidden, click View targeting rules.
Click the three-dot overflow menu:

The overflow menu in the individual targets section.


Click Export CSV. A CSV file including the list of contexts keys a flag variation is targeted to downloads to your machine.
Mobile targeting
Overview
This topic explains how to control which mobile apps and devices receive a variation of a feature flag.
Target mobile apps and devices
If you are using a mobile SDK that supports environment attributes, you can target your mobile applications based on automatically collected details about your application, application version, and device. You can also target mobile applications based on whether the application version is supported or unsupported. To learn more about configuring your mobile SDKs to enable this targeting, read Automatic environment attributes.
Mobile environment attributes must be collected first
You can only create a “Mobile” targeting rule, and target mobile apps and devices based on automatically collected mobile environment attributes, if you have completed the following:
your feature flag has its Client-side SDK availability set to include “SDKs using Mobile key.” To learn more, read Creating new flags.
you have already started to collect mobile environment attributes in the ld_application and ld_device context kinds. LaunchDarkly must receive these context kinds before it enables the option to create a mobile targeting rule.
If you are using other mobile SDKs, you can target your mobile applications using custom targeting rules. With custom targeting rules, you can target your mobile applications based on any attributes that you have manually added to your contexts.
To target mobile apps and devices:
Click the + button between existing rules, and select “Target mobile”.
If the flag is off and the rules are hidden, click View targeting rules.

The "+" menu, with targeting options.


(Optional) Enter a name for the rule.
In the Attribute menu, select the application or device attribute that you want to target on. By default, mobile targeting rules include clauses for the application version support status and for device information.
For a complete list of attributes, read About the automatically added environment attributes.
The os attribute includes properties for family, name, and version. To create targeting rules for these, use / as a delimiter to refer to specific fields. For example, you can create a targeting rule based on /os/family.
In the Operator menu, select the operator for your clause.
In the Application ID or Values menu, enter the values to check against.
(Optional) Click + to add additional clauses to your targeting rule, or click - to remove existing clauses from your targeting rule.
From the Select… menu, select either the variation to serve, a manual percentage rollout, a progressive rollout, or a guarded rollout.
Click Review and save.
Here is an example of a targeting rule for mobile apps:

A targeting rule for mobile apps.
To reference this rule when working with other members of your organization, click the three-dot overflow menu and choose Copy link to rule.
Was this page helpful?
Yes

Custom rules
Overview
This topic explains how to use custom rules to target contexts based on their attributes.
Target contexts with custom rules
You can create custom targeting rules using any context kinds and any context attributes.
To create a custom targeting rule:
In the flags dashboard, scroll or search to find the flag you want.
Click the flag’s name to open the flag’s Targeting tab.
If the flag is off and the rules are hidden, click View targeting rules.
Click the + button between existing rules, and select “Build a custom rule”:

The "+" menu, with targeting options.
(Optional) Enter a name for the rule.
Select an option from the Context kind menu:
Choosing a specific context kind lets you target on attributes for contexts of that kind.
Choosing “Context kind” lets you target one or more context kinds. If you choose “Context kind,” skip to step 5.
Context kinds are included in this menu after either you create them from the Contexts list or evaluate a context using a LaunchDarkly SDK.
In the Attribute menu, select one of this context’s attributes.
In the Operator menu, select the operator for your clause.
In the Values menu, enter one or more values to check against.
(Optional) Click the + to add additional clauses to your targeting rule.
From the Select… menu, select either the variation to serve, a manual percentage rollout, a progressive rollout, or a guarded rollout.
Click Review and save.
Custom targeting rules can include mobile application data
If you are using a mobile SDK that supports environment attributes, you can target your mobile applications based on details about your application, application version, and device using a mobile targeting rule. To create custom targeting rules using this same context information, use the ld_application and ld_device context kinds.
If you are using other mobile SDKs, you can target your mobile applications using any context attributes that you have created.
If a targeting rule references any context kinds or attributes with null values, or that do not exist for a given context, then the flag skips that rule. For example, in a rule that checks “region is one of Canada,” any context whose region attribute is not set or is set to null does not match the rule. Similarly, in a rule that checks “region is not one of Canada,” any context whose region attribute is not set or is set to null does not match the rule. This behavior ensures that your rules only target contexts for which you explicitly have attribute information.
Multiple conditions and values
You can add multiple conditions to a rule. Here is how rules handle multiple conditions and values:
Contexts must meet all the conditions in a rule to match the rule. If any of the conditions are not met, the context will not match the rule.
If a condition has multiple values, LaunchDarkly considers the condition met if there is a match on any of the values.
If an attribute has an array value, LaunchDarkly treats it as multiple values and allows any of the values within the array to match a rule.
To reference this rule when working with other members of your organization, click the three-dot overflow menu and choose Copy link to rule.

You can also use the REST API: Update feature flag
JSON targeting
Overview
This topic explains how to create and edit flag targeting rules using JSON.
Editing flag rules using JSON follows the same model as the JSON response from the Get feature flag endpoint in the REST API.
View JSON targeting rules
To view a flag’s targeting rules in JSON, navigate to the Targeting tab and click the icon in the “Targeting configuration” section:

The JSON targeting option on a flag's Targeting tab.
Basic JSON structure
Below is an example of the basic JSON structure for a boolean feature flag:
Boolean feature flag
{
 "on": false, // the flag is toggled off
 "prerequisites": [], // the flag has no prerequisites
 "contextTargets": [], // the flag has no individual targeting rules
 "rules": [], // the flag has no custom targeting rules
 "fallthrough": {
   "variation": 0 // the fallthrough, or default, variation is true
 },
 "offVariation": 1 // the off variation is false
}

This example flag:
is toggled off
has no prerequisites
has no targeting rules besides the default rule
has true (0) as the default rule
has false (1) as the off variation
Variation IDs
For boolean flags, the ID of the true variation is always 0, and the ID of the false variation is always 1.
For multivariate flags, the ID of the first variation is 0, the ID of the second variation is 1, and so on.
Flag on/off status
To toggle a flag on or off, set on to true or false.
Here is what a flag toggle looks like in the user interface (UI):

The flag toggle on the targeting tab.
Here is an example of how to toggle a flag on:
Flag on/off status
{
 "on": true
}

To learn about toggling flags on and off in the UI, read Turning flags on and off.
Off variation
The off variation is the variation served to all contexts when a flag is off.
Here is an example of how to set the off variation:
Off variation
{
 "offVariation": 1 // the off variation is false
}

To learn how to set the off variation in the UI, read The off variation.
Default rule or variation
The default, or fallthrough, rule is the rollout or variation that a flag serves when a context doesn’t match any other targeting rules on the flag.
Here is what a default rule looks like in the UI:

A flag's default rule.
To set a default variation, use fallthrough and set variation to the ID of the flag variation you want to use as the default variation.
Here is an example of setting the default variation on a boolean flag:
Default variation
{
 "fallthrough": {
   "variation": 1 // the default variation is false
 }
}

You can also set a rollout, instead of a single variation, as the default rule. To learn how, read Rollouts.
To learn how to set the default rule in the UI, read The default rule.
Prerequisites
To set a prerequisite, use prerequisites with the following key/value pairs:
key: the prerequisite flag key.
variation: the ID of the prerequisite flag’s variation you want to require.
Here is what a prerequisite rule looks like in the UI:

The "Prerequisites" section of the dependent flag with a prerequisite flag added.
Here is an example prerequisite rule requiring the prerequisite variation for the flag alt-sort-order to be true:
Prerequisites
{
 "prerequisites": [
   {
   "key": "alt-sort-order", // the prerequisite flag key
   "variation": 0 // the prerequisite flag variation must be true
   }
 ]
}

In the above example, if the prerequisite flag is on: true, and a context encountering this flag is receiving the true (0) variation of the prerequisite flag, then the context is subject to this flag’s targeting rules.
If the prerequisite flag is on: false, or the context is receiving a variation other than true (0), then the context will receive this flag’s offVariation of false (1).
To learn how to use prerequisite flags in the UI, read Flag prerequisites.
Individual targeting
Individual targeting lets you serve chosen variations to specific contexts.
Here is what an individual targeting rule looks like in the UI:

A flag with a user context individually targeted.
To individually target a context, use contextTargets with the following key/value pairs:
variation: the ID of the variation you want to serve.
values: the context keys you want to target.
contextKind: the context kind of the contexts you want to target.
Here is an example individual targeting rule for a user context:
Individual targeting
{
 "contextTargets": [{
   "variation": 0, // this individual targeting rule serves the true variation
   "values": [
     "user-key-123abc" // the context key
   ],
   "contextKind": "user" // the context kind is user
 }]
}

To learn how to target individual contexts in the UI, read Individual targeting.
Target multiple context kinds
You can use multiple rules if you need to target multiple context kinds.
This example flag targets both user and organization contexts:
Individual targeting multiple context kinds
{
 "contextTargets": [{
   "variation": 0, // this individual targeting rule serves the true variation
   "values": [
     "user-key-123abc", // the first user context key
     "user-key-456def" // the second user context key
   ],
   "contextKind": "user" // the context kind is user for both contexts
 },
 {
   "variation": 0, // this individual targeting rule serves the true variation
   "values": [
     "org-key-123abc", // the first organization context key
     "org-key-456def" // the second organization context key
   ],
   "contextKind": "organization" // the context kind is organization for both contexts
 }]
}

Target different variations
You can use multiple rules if some individually targeted contexts should receive different variations than others.
This example flag serves true to some contexts and false to others:
Individual targeting multiple context kinds
{
 "contextTargets": [{
   "variation": 0, // this individual targeting rule serves the true variation
   "values": [
     "user-key-123abc", // the first user context key


   ],
   "contextKind": "user" // the context kind is user
 },
 {
   "variation": 1, // this individual targeting rule serves the false variation
   "values": [
     "user-key-456def" // the second user context key
   ],
   "contextKind": "user" // the context kind is user
 }]
}

Segment targeting
Segment targeting rules let you serve chosen variations to specific LaunchDarkly segments.
Here is what a segment targeting rule looks like in the UI:

A targeting rule for segments.
To target a segment, use clauses with the following key/value pairs:
attribute: segmentMatch or not-SegmentMatch, depending on whether or not you want the rule to target contexts in the chosen segment, or not in the chosen segment
op: segmentMatch
negate: set to false if you set attribute to segmentMatch. Set to true if you set attribute to not-segmentMatch.
values: the segment keys you want to target in the rule
Segment targeting
{
 "rules": [
   {
     "clauses": [
       {
         "attribute": "segmentMatch", // this rule will target contexts in the segment
         "contextKind": "", // leave the contextKind blank for segment targeting
         "negate": false, // the attribute is segmentMatch, so this is set to false
         "op": "segmentMatch", // op is always segmentMatch
         "values": [
           "internal-testers", // the segment key of the segment you want to target
         ]
       }
     ],
     "description": "Include internal testers", // the rule description, optional
     "variation": 0 // this rule is serving true
   }
 ]
}

After you save a segment targeting rule, LaunchDarkly automatically assigns a read-only _id value to each rule clause. You do not need to supply this ID yourself, and you cannot edit the ID after it has been assigned.
To learn how to build segment targeting rules in the UI, read Segment targeting.
Mobile targeting
Mobile targeting rules let you control which mobile apps and devices receive a variation of a feature flag.
Here is an example of a mobile targeting rule in the UI:

A targeting rule for mobile apps.
To target mobile devices, use rules with the following key/value pairs:
description (optional): the description of the rule.
variation: the ID of the variation you want to serve.
clauses with the following key/value pairs:
contextKind: either ld_application or ld_device, depending on if you want to target mobile applications or mobile devices in this rule.
attribute: the context attribute you want to use in the rule.
op: the operators available depend on your context kind and attribute:
if your contextKind is ld_application, and your attribute is version support status, then applicationVersionSupported is the only available operator.
otherwise, use the standard operator you want to use in the rule.
negate: set to true to use the inverse of the operator. For example, if op is set to in, use "negate": true to use “is not in” as the operator. Otherwise, set to false.
values: the attribute values you want to use in the rule.
Mobile targeting
{
 "rules": [
   {
     "description": "Support for versions 12.5 and higher", // the rule description, optional
     "variation": 0, // this mobile rule serves the true variation
     "clauses": [
       {"contextKind": "ld_application",
         "attribute": "version_support_status",
         "op": "applicationVersionSupported",
         "negate": false,
         "attribute": "version_support_status", // the application attribute is "version support status"
         "contextKind": "device", // the context kind is device
         "negate": false,
         "op": "applicationVersionSupported", // the operator is "is supported for"
         "values": [
           "12.5" // the application version number is 12.5
         ]
       }
     ]
   }
 ]
}

After you save a mobile targeting rule, LaunchDarkly automatically assigns a read-only _id value to each rule clause. You do not need to supply this ID yourself, and you cannot edit the ID after it has been assigned.
To learn how to build mobile targeting rules in the UI, read Mobile targeting.
Custom targeting rules
Custom targeting rules let you target contexts based on their context kind and attributes.
Here is an example of a custom targeting rule in the UI:

Two custom targeting rules.
To target custom context kinds and attributes, use rules with the following key/value pairs:
description (optional): the description of the rule.
variation: the ID of the variation you want to serve.
values: the context keys you want to target.
clauses, with the following key/value pairs:
contextKind: the context kind of the contexts you want to target.
attribute: the context attribute you want to use in the rule.
op: the standard operator you want to use in the rule.
negate: leave set to true, or set to false to use the inverse of the operator. For example, if op is set to in, use "negate": true to use “is not in” as the operator.
values: the attribute values you want to use in the rule.
trackEvents (optional): true or false depending on whether or not you want to send feature events to LaunchDarkly.
Here is an example custom targeting rule that targets customers with an email address that ends in .edu:
Custom targeting rule for students
{
 "rules": [{
   "description": "Student customers", // the rule description, optional
   "variation": 0, // this custom rule serves the true variation
   "clauses": [{
     "contextKind": "user", // the context kind is user
     "attribute": "email", // the context attribute is "email"
     "op": "endsWith", // the rule operator is "ends with"
     "negate": false, // the operator is not negated
     "values": [
       ".edu" // the attribute value
     ]
   }],
   "trackEvents": false // the flag is not sending feature events to LaunchDarkly, optional
 }]
}

Here is an example targeting rule that targets accounts for an Early Access Program (EAP):
Custom targeting rule for an EAP
{
 "rules": [{
   "description": "Early access accounts", // the rule description, optional
   "variation": 0, // this custom rule serves the true variation
   "clauses": [{
     "contextKind": "account", // the context kind is account
     "attribute": "eap-account", // the context attribute is "eap-account"
     "op": "in", // the rule operator is "is one of"
     "negate": false, // the operator is not negated
     "values": [
       "true" // the attribute value is true
     ]
   }],
   "trackEvents": true // the flag is sending feature events to LaunchDarkly, optional
 }]
}

After you save a custom targeting rule, LaunchDarkly automatically assigns a read-only _id value to each rule clause. You do not need to supply this ID yourself, and you cannot edit the ID after it has been assigned.
To learn how to build custom targeting rules in the UI, read Custom rules.
Rollouts
When you create a custom rule or default rule, you can choose to serve a rollout instead of a single variation.
There are three kinds of rollouts:
Manual percentage rollout
Progressive rollout
Guarded rollout
Manual percentage rollout
Percentage rollouts let you roll out your feature to a small percentage of contexts and, as you become more confident your feature is working as intended, manually increase the percentage over time.
Here is what a percentage rollout looks like in the UI:

A 50/50 percentage rollout for a boolean flag.
To create a manual percentage rollout, use percentageRolloutConfig with the following key/value pairs:
contextKind (optional): the context kind you want to roll out by. Defaults to your default context kind.
bucketBy (optional): the attribute value you want to roll out by. Defaults to key.
variations, with the following key/value pairs:
variation: the ID of the variation you want to serve.
weight: the percentage of contexts you want to include in that variation. Include three decimal places in the percentage, with no . or ,. Do not include leading 0s. For example:
to include 5.5% of contexts in a variation, set the weight to 5500.
to include 75.5% of contexts in a variation, set the weight to 75500. The weight must add up to 100% between all of the variations.
The below example shows how to rollout the true variation to 50% of contexts and the false variation to 50% of contexts on the default rule of a flag.
Here is how to set the rollout using JSON:
Default percentage rollout
{
 "percentageRolloutConfig": {
   "contextKind": "user", // rolling out to user contexts,
   "bucketBy": "key", // by user key
   "variations": [
     {
       "variation": 0, // this part of the rollout serves the true variation
       "weight": 50000 // 50% of contexts will be served this variation
     },
     {
       "variation": 1, // this part of the rollout serves the false variation
       "weight": 50000 // 50% of contexts will be served this variation
     }
   ]
 }
}

To learn how to create percentage rollouts in the UI, read Percentage rollouts.
Progressive rollout
A progressive rollout lets you serve a given flag variation to a specified percentage of contexts, and gradually increases that percentage over a specified time.
Here is what a progressive rollout looks like in the UI:

A progressive rollout.
To create a progressive rollout, use progressiveRolloutConfig with the following key/value pairs:
contextKind: the context kind you want to roll out by. Defaults to your default context kind.
controlVariation: the variation ID of the variation you want to serve at the beginning of the rollout. For boolean flags, this variation is automatically set based on the value the flag is currently serving, usually the off variation or the default variation.
endVariation: the variation ID of the variation you want to roll out over time. For boolean flags, this variation is automatically set based on the variation not currently being served.
steps, with the following key/value pairs:
rolloutWeight: the percentage of contexts you want to include in that rollout step. Include three decimal places in the percentage, with no . or ,. Do not include leading 0s. For example, to include 5.5% of contexts in a rollout step, set the rolloutWeight to 5500. To include 10.5% of contexts in a variation, set the rolloutWeight to 10500. The weight must add up to 100% between all of the rollout steps.
duration with the following key/value pairs:
quantity: the length of time you want that step in the rollout to last, in the units specified in unit.
unit: the unit of time you want to use in the rollout. Options include:
day
hour
minute
The below example shows a progressive rollout over 20 hours on the default rule of a flag.
Here is how to set the rollout using JSON:
Default progressive rollout
{
 "fallthrough": {
   "progressiveRolloutConfig": {
       "contextKind": "user", // rolling out by user context kind
       "controlVariation": 1, // the starting variation is false. Not required for boolean flags
       "endVariation": 0, // the flag is rolling out to true. Not required for boolean flags
       "steps": [
         {
           "rolloutWeight": 1000, // 1% of contexts are in the first step
           "duration": {
               "quantity": 4,
               "unit": "hour" // each step will take four hours
           }
         },
         {
           "rolloutWeight": 5000, // 5% of contexts are in the second step
           "duration": {
               "quantity": 4,
               "unit": "hour"
           }
         },
         {
           "rolloutWeight": 10000, // 10% of contexts are in the third step
           "duration": {
               "quantity": 4,
               "unit": "hour"
           }
         },
         {
           "rolloutWeight": 25000, // 25% of contexts are in the fourth step
           "duration": {
               "quantity": 4,
               "unit": "hour"
           }
         },
         {
             "rolloutWeight": 50000, // 50% of contexts are in the fourth step
             "duration": {
                 "quantity": 4,
                 "unit": "hour"
         }
       }
     ]
   }
 }
}

To learn how to build progressive rollouts in the UI, read Progressive rollouts.
Guarded rollout
Guarded rollouts let you attach a metric to a rollout to monitor the performance of a flag over time, and to take action on the results.
Here is what a guarded rollout setup looks like in the UI:

The guarded rollout setup options on a flag rule.
To create a guarded rollout, use guardedRolloutConfig with the following key/value pairs:
randomizationUnit: the context kind you want to target by.
stages with the following key/value pairs:
monitoringWindowMilliseconds: the length of time you want that step in the rollout to last, in milliseconds.
rolloutWeight: the percentage of contexts you want to include in that rollout step. Include three decimal places in the percentage, with no . or ,. Do not include leading 0s. For example, to include 5.5% of contexts in a rollout step, set the rolloutWeight to 5500. To include 10.5% of contexts in a variation, set the rolloutWeight to 10500. The weight must add up to 100% between all of the rollout steps.
metrics with the following key/value pairs:
metricKey: the key of the metric you want to monitor.
onRegression with the following key/value pair:
rollback: whether or not you want LaunchDarkly to automatically roll back the release in the event of a regression. Options include true or false.
regressionThreshold: the regression threshold you want for the metric.
The below example shows a guarded rollout over 24 hours on the default rule of a flag, using a metric called sentry-errors.
Here is how to set the guarded rollout using JSON:
Guarded rollout
{
 "guardedRolloutConfig": {
   "randomizationUnit": "request", // the context kind to target by
   "controlVariation": 1, // the starting variation is false. Not required for boolean flags
   "endVariation": 0, // the flag is rolling out to true. Not required for boolean flags
   "stages": [
     {
       "monitoringWindowMilliseconds": 17280000, // this stage lasts 4.8 hours
       "rolloutWeight": 1000 // 1% of contexts are in the first stage
     },
     {
       "monitoringWindowMilliseconds": 17280000, // this stage lasts 4.8 hours
       "rolloutWeight": 5000 // 5% of contexts are in the second stage
     },
     {
       "monitoringWindowMilliseconds": 17280000, // this stage lasts 4.8 hours
       "rolloutWeight": 10000 // 10% of contexts are in the third stage
     },
     {
       "monitoringWindowMilliseconds": 17280000, // this stage lasts 4.8 hours
       "rolloutWeight": 25000 // 25% of contexts are in the fourth stage
     },
     {
       "monitoringWindowMilliseconds": 17280000, // this stage lasts 4.8 hours
       "rolloutWeight": 50000 // 50% of contexts are in the fifth stage
     }
   ],
   "metrics": [
     {
       "metricKey": "sentry-errors", // the metric key
       "onRegression": { // if a regression is detected, then
           "rollback": true, // LaunchDarkly will automatically roll back the release
       },
       "regressionThreshold": 0.01 // the custom regression threshold for the metric is set to 1%
     }
   ]
 }
}

To learn how to build guarded rollouts in the UI, read Guarded rollouts.
Example JSON targeting
This section includes an example of a flag with several targeting rules.
This flag:
is toggled on
has one prerequisite flag
is targeting two individuals
is targeting a segment
has an active guarded rollout
Here is what the targeting rules look like in the UI:

A flag with several targeting rules.
Here are the flag targeting rules in JSON:
Example flag targeting
{
 "offVariation": 1, // the off variation is false
 "on": true, // the flag is on
 "prerequisites": [ // requires a prerequisite flag that must serve true
   {
     "key": "enable-cloud-database",
     "variation": 1
   }
 ],
 "contextTargets": [ // individually targets two user contexts
   {
     "values": [
       "context-key-123abc",
       "context-key-456def"
     ],
     "contextKind": "user",
     "variation": 0
   }
 ],
 "rules": [
   {
     "clauses": [ // targets a segment
       {
         "attribute": "segmentMatch",
         "contextKind": "user",
         "negate": false,
         "op": "segmentMatch",
         "values": [
           "internal-testers-on-production"
         ]
       }
     ],
     "description": "",
     "variation": 0
   }
 ],
 "fallthrough": { // the default rule is a guarded rollout
   "guardedRolloutConfig": {
     "stages": [
       {
         "rolloutWeight": 1000, // rolling out to 1%
         "monitoringWindowMilliseconds": 17280000
       },
       {
         "rolloutWeight": 5000, // rolling out to 5%
         "monitoringWindowMilliseconds": 17280000
       },
       {
         "rolloutWeight": 10000, // rolling out to 10%
         "monitoringWindowMilliseconds": 17280000
       },
       {
         "rolloutWeight": 25000, // rolling out to 25%
         "monitoringWindowMilliseconds": 17280000
       },
       {
         "rolloutWeight": 50000, // rolling out to 50%
         "monitoringWindowMilliseconds": 17280000
       }
     ],
   "metrics": [
     {
       "metricKey": "cart-purchases",
       "regressionThreshold": 0,
       "onRegression": {
         "rollback": false,
         "notify": true
       }
     }
     ],
     "randomizationUnit": "user"
   }
 }
}

Converting rules into segments
Overview
This topic explains how convert targeting rules into reusable segments.
Convert rules into segments
You may require complex targeting rules to successfully perform feature launches. You can convert a targeting rule into a reusable standard segment from the flag’s Targeting tab.
To convert a rule into a segment:
In the flags dashboard, scroll or search to find the flag you want.
Click the flag’s name to open the flag’s Targeting tab.
Find the custom targeting rule you want to convert and click the three-dot overflow menu. The overflow menu appears.
If the flag is off and the rules are hidden, click View targeting rules.
Click Convert to segment. The “Convert targeting rule to segment” dialog appears.
Give your segment a human-readable Name and a Key.
(Optional) Add a Description.
(Optional) Select a tag or create a new tag from the Tags menu.
Click Save segment. A confirmation appears indicating that you’ve created a new segment.
Testing flag targeting
Overview
This topic explains how to use the test run feature to find out which variation a particular context will receive for a given feature flag. Testing flag targeting helps ensure that contexts receive the flag variations you expect after you make targeting changes.
Test flag targeting
To test a flag’s targeting:
From the Flags list, open the flag you want to preview.
Make any needed changes to the flag rules.
If the flag is off and the rules are hidden, click View targeting rules.
Click the fingerprint test run icon. The “Test run a context” section appears.
Search for and select the context you want to preview, or edit the JSON object to supply the context kind and key.

The "Test run a context" section, populated with an example context kind and key.


The “Test run a context” section populates with the variation that the context is receiving based on current targeting, and the variation it will receive after you save your targeting changes.
Flag templates
Overview
This topic explains the different types of flags available in LaunchDarkly. Flag templates are project-wide default settings for different types of flags.
Modifying flag templates requires specific permissions
You can only modify flag templates if you have a role that allows the updateProjectFlagDefaults action. The LaunchDarkly Project Admin and Maintainer roles, as well as the Admin and Owner base roles, have this ability. To learn how to customize flag templates, read Flag templates.
If you need to make changes to one flag, you may be able to make the changes you need in the flag’s Settings tab. To learn more, read Environment-level flag settings.
Available flag templates
LaunchDarkly supports the following types of flag templates:
Custom flags
Release flags
Kill switch flags
Experiment flags
AI prompt flags
AI model flags
Migration flags
Custom flags
Overview
This topic explains how to get started with custom flags.
While LaunchDarkly provides flag creation templates for the common flag templates discussed in this category, we expect that you will need other flags as well. For ideas and examples of other flags and their use cases, read our guide on Creating flags.
Default flag settings only apply to custom flags
When you create a new flag in the LaunchDarkly UI, you can choose to start with a flag template, or create a custom flag. Each flag template has its own custom default settings that you cannot alter. Only custom flags are affected by the default flag settings you configure at the project level.
To learn more about default flag settings, read Projects.
Create custom flags
To create a custom flag:
Click Create and choose Flag. The “Create new flag” page appears.
Enter a unique, human-readable Name.
(Optional) Update the flag Key. You’ll use this key to reference the flag in your code. A suggested key auto-populates from the name you enter, but you can customize it if you wish.
(Optional) Enter a Description of the flag. A brief, human-readable description helps your account members understand what the flag is for.
(Optional) Check the Include flag in this project’s release pipeline box. To learn more, read Release pipelines.
(Optional) Choose any Metrics to monitor in the Metrics section. To learn more, read Metrics.
Choose the Custom flag template in the Configuration section:

The "Configuration" section of the "Create new flag" page.
Choose Yes or No to indicate whether this flag is temporary.
Select a flag type:
Boolean: optionally update the Name of the true and false variations.
String: enter a Value for each variation, and optionally update the Name of each variation. To add more variations, click +Add variation.
Number: enter a Value for each variation, and optionally update the Name of each variation. To add more variations, click +Add variation.
JSON: enter a Value for each variation, and optionally update the Name of each variation. To add more variations, click +Add variation.
(Optional) In the “Variations” section, create variations as needed.
(Optional) Update the default variations.
Choose one or more tags from the Tags menu.
Check the SDKs using Mobile Key and/or SDKs using client-side ID boxes to indicate which client-side SDKs you will use to evaluate this flag. If you are using a server-side SDK, leave these boxes unchecked.
Click Create flag.
To learn more, read Creating new flags.
Then, set up the targeting rules for your flag. To learn how, read Target with flags.
Modify the custom flag template
To modify your custom flag template:
Click the project dropdown. The project menu appears:

The project menu.
Select Project settings.
Select Flags. The Flags settings list appears.
In the “Flag templates section, click the pencil icon next to “Custom.”
Choose Yes or No to mark all custom flags as temporary or permanent.
In the “Variations” section, edit the flag variation Names.
In the “Default variations” section, choose which default variations to serve when the flag is toggled On or Off.
In the “Tags” section, type to add tags to each new flag by default.
Click Save.
Verify that the updated default template settings are correct by navigating to the Flags list and creating a new custom flag.
Release flags
Overview
This topic explains how you can use release flags to progressively roll out functionality. Release flags are temporary flags that initially do not serve the new functionality, then are used to progressively roll out the functionality until they reach 100%.
About release flags
Release flags, sometimes called rollout flags, are temporary boolean flags with two variations: “Available” (true) and “Unavailable” (false).
In the most common use case, you wrap a release flag around code for a new or improved feature, and use the flag to release the new feature to your customers in increments. Release flags are temporary. After you verify the new code is stable and roll out the feature to 100% of your customers, you should delete the flag.
Using a release flag does not initiate a rollout
Using a flag created with the Release template does not automatically configure a rollout or any targeting behavior. To use the flag to progressively roll out a feature, you must manually configure those rules. To learn more, read Progressive rollouts.
Create release flags
To create a release flag:
Click Create and choose Flag. The “Create new flag” page appears.
Enter a unique, human-readable Name.
(Optional) Update the flag Key. You’ll use this key to reference the flag in your code. A suggested key auto-populates from the name you enter, but you can customize it if you wish.
(Optional) Enter a Description of the flag. A brief, human-readable description helps your account members understand what the flag is for.
(Optional) Update the Maintainer for the flag.
(Optional) Check the Include flag in this project’s release pipeline box. To learn more, read Release pipelines.
(Optional) Choose any Metrics to monitor in the Metrics section. To learn more, read Metrics.
Choose the Release flag template in the Configuration section:

The "Configuration" section of the "Create new flag" page.
Choose Yes or No to indicate whether this flag is temporary. Release flags are usually temporary.
Select the Boolean flag type.
(Optional) In the “Variations” section, update variations as needed.
(Optional) Update the default variations.
Choose one or more tags from the Tags menu.
Check the SDKs using Mobile Key and/or SDKs using client-side ID boxes to indicate which client-side SDKs you will use to evaluate this flag. If you are using a server-side SDK, leave these boxes unchecked.
Click Create flag.
To learn more, read Creating new flags.
Because release or rollout flags are used to release a new feature in increments, they typically do not use complex targeting rules. Instead, they serve a percentage rollout in their default rule. To learn more, read Percentage rollouts.
If you have a well-defined process for releasing new features gradually, we recommend using a workflow with your release flag. A workflow is a set of actions that you can schedule in advance to make changes to a feature flag. For a release flags, you can schedule a gradual increase in the percentage of contexts targeted by the flag. To learn more, read Workflows.
Modify the release flag template
To modify your release flag template:
Click the project dropdown. The project menu appears:

The project menu.
Select Project settings.
Select Flags. The Flags settings list appears.
In the “Flag templates section, click the pencil icon next to “Release.”
Choose Yes or No to mark all release flags as temporary or permanent. Release flags are usually temporary.
In the “Variations” section, edit the flag variation Names.
In the “Default variations” section, choose which default variations to serve when the flag is toggled On or Off.
In the “Tags” section, type to add tags to each new flag by default.
Click Save.
Verify that the updated default template settings are correct by navigating to the Flags list and creating a new release flag.
Kill switch flags
Overview
This topic explains how you can use kill switch or circuit breaker flags to shut off functionality. These flags are permanent safety mechanisms that you can use to turn off non-core functionality or third-party tools in an emergency.
About kill switch flags
Kill switch flags, sometimes called circuit breaker flags, are permanent boolean flags with two variations: “Enabled” (true) and “Disabled” (false).
Kill switch flags are operational flags that control or change how your app or service operates. Often, these changes happen in response to unplanned events, such as traffic spikes or third-party service failures. You can use these flags to quickly turn off functionality when needed. You can also integrate these flags with observability or application performance management (APM) tools to automate flag shut off. To learn more, read Observability tools.
Create kill switch flags
To create a kill switch flag:
Click Create and choose Flag. The “Create new flag” page appears.
Enter a unique, human-readable Name.
(Optional) Update the flag Key. You’ll use this key to reference the flag in your code. A suggested key auto-populates from the name you enter, but you can customize it if you wish.
(Optional) Enter a Description of the flag. A brief, human-readable description helps your account members understand what the flag is for.
(Optional) Update the Maintainer for the flag.
(Optional) Check the Include flag in this project’s release pipeline box. To learn more, read Release pipelines.
(Optional) Choose any Metrics to monitor in the Metrics section. To learn more, read Metrics.
Choose the Kill switch flag template in the Configuration section:

The "Configuration" section of the "Create new flag" page.
Choose Yes or No to indicate whether this flag is temporary. Kill switch flags are usually permanent.
Select the Boolean flag type.
(Optional) In the “Variations” section, update variations as needed.
(Optional) Update the default variations.
Choose one or more tags from the Tags menu.
Check the SDKs using Mobile Key and/or SDKs using client-side ID boxes to indicate which client-side SDKs you will use to evaluate this flag. If you are using a server-side SDK, leave these boxes unchecked.
Click Create flag.
To learn more, read Creating new flags.
Because kill switch or circuit breaker flags are used to shut off functionality or third-party tools completely, they typically do not use complex targeting rules. Instead, they serve “Enabled” by default when targeting is on, and “Disabled” when targeting is off. To learn more about targeting, read Target with flags.
Modify the kill switch flag template
To modify your kill switch flag template:
Click the project dropdown. The project menu appears:

The project menu.
Select Project settings.
Select Flags. The Flags settings list appears.
In the “Flag templates section, click the pencil icon next to “Kill switch.”
Choose Yes or No to mark all kill switch flags as temporary or permanent. Kill switch flags are usually permanent.
In the “Variations” section, edit the flag variation Names.
In the “Default variations” section, choose which default variations to serve when the flag is toggled On or Off.
In the “Tags” section, type to add tags to each new flag by default.
Click Save.
Verify that the updated default template settings are correct by navigating to the Flags list and creating a new kill switch flag.
Experiment flags
Overview
This topic explains how you can use experiment flags to test a hypothesis. These flags help you validate the impact of features you roll out to your app or infrastructure.
About experiment flags
Experiment flags are temporary flags. In the most common use case, you wrap an experiment flag around code for a new or improved feature that impacts end users. Experiment flags can be either boolean or multivariate, so that the experiment can test multiple values. You can pair flags with metrics to compare context or system behavior between two or more flag variations. To learn more, read Experimentation.
Create experiment flags
To create an experiment flag:
Click Create and choose Flag. The “Create new flag” page appears.
Enter a unique, human-readable Name.
(Optional) Update the flag Key. You’ll use this key to reference the flag in your code. A suggested key auto-populates from the name you enter, but you can customize it if you wish.
(Optional) Enter a Description of the flag. A brief, human-readable description helps your account members understand what the flag is for.
(Optional) Update the Maintainer for the flag.
(Optional) Check the Include flag in this project’s release pipeline box. To learn more, read Release pipelines.
(Optional) Choose any Metrics to monitor in the Metrics section. To learn more, read Metrics.
Choose the Experiment flag template in the Configuration section:

The "Configuration" section of the "Create new flag" page.
Choose Yes or No to indicate whether this flag is temporary. Experiment flags are usually temporary.
Select a flag type:
Boolean: optionally update the Name of the true and false variations.
String: enter a Value for each variation, and optionally update the Name of each variation. To add more variations, click +Add variation.
Number: enter a Value for each variation, and optionally update the Name of each variation. To add more variations, click +Add variation.
JSON: enter a Value for each variation, and optionally update the Name of each variation. To add more variations, click +Add variation.
(Optional) In the “Variations” section, create variations for the control and each experiment treatment.
(Optional) Update the default variations.
Choose one or more tags from the Tags menu.
Check the SDKs using Mobile Key and/or SDKs using client-side ID boxes to indicate which client-side SDKs you will use to evaluate this flag. If you are using a server-side SDK, leave these boxes unchecked.
Click Create flag.
The new flag appears in the Flags list.
To learn more, read Creating new flags.
Then, run experiments on the flag. To get started, click Add experiment the flag’s right sidebar. To learn more, read Creating experiments.
Modify the experiment flag template
To modify your experiment flag template:
Click the project dropdown. The project menu appears:

The project menu.
Select Project settings.
Select Flags. The Flags settings list appears.
In the “Flag templates section, click the pencil icon next to “Experiment.”
In the “Tags” section, type to add tags to each new flag by default.
Click Save.
Verify that the updated default template settings are correct by navigating to the Flags list and creating a new experiment flag.
AI prompt flags
Use AI Configs for your generative AI applications
LaunchDarkly’s AI Configs manage your AI prompt and model configuration. You can use AI Configs to roll out and test new large language models (LLMs) and prompts within your generative AI applications. To learn more, read AI Configs.
Earlier releases of LaunchDarkly provided AI prompt flag templates to help with this use case. AI prompt flags are no longer available.
Was this page helpful?
Yes

AI model flags
Use AI Configs for your generative AI applications
LaunchDarkly’s AI Configs manage your AI prompt and model configuration. You can use AI Configs to roll out and test new large language models (LLMs) and prompts within your generative AI applications. To learn more, read AI Configs.
Earlier releases of LaunchDarkly provided AI model flag templates to help with this use case. AI model flags are no longer available.
Migration flags
Overview
This topic explains how you can use migration flags to take the complexity and risk out of migrations when you need to change or modernize your database infrastructure. Migration flags require a server-side SDK.
Supported SDKs
Migration flags are available for the following server-side SDKs:
.NET (server-side)
Go
Java
Node.js (server-side)
PHP
Python
Ruby
Rust
Migration flags are also available for the following edge SDKs:
Akamai
Cloudflare
Vercel
About migration feature flags
A migration feature flag is a temporary flag you can use to migrate data or systems while keeping your application available and disruption free. Migration flags break the transition from an old to a new implementation into a series of two to six stages. Movement between stages occurs in discrete steps. Migration flags also let you split traffic across two or more cohorts. Cohorts can also move between stages independently from each other and in incremental steps.
Migration flags help you understand more about how your migrations progress, their health, and how to mitigate risks if unintended behavior occurs.

The flag creation modal, listing the two-, four-, and six-stage migration options.
To learn more about when to use different types of migrations, read Performing multi-stage migrations with migration flags.
How migration flags affect migration stages
A migration flag’s variations are associated with the migration’s stages. To learn more, read Targeting variations and stages.

A six-stage migration flag with the flag variations displayed
About cohorts
Migration flag cohorts are analogous to a standard feature flag’s rules. The default cohort is analogous to a feature flag’s default rule. Cohorts always serve a rollout release type. To learn more, read Targeting cohorts and Percentage rollouts.
Creating migration flags
Overview
This topic explains how to create migration flags. Migration flags are temporary flags you can use to migrate data or tech systems without causing outages or downtime.
Migration flags can have two, four, or six stages. To learn more about when to use different types of migrations, read Performing multi-stage migrations with migration flags.
Not all SDKs support migration flags
Not all SDKs are compatible with migration flags. For a full list of compatible SDKs, read supported SDKs.
Create migration flags
Here’s how to create a migration flag:
Click Create and choose Flag. The “Create new flag” page appears.
Enter a unique, human-readable Name.
(Optional) Update the flag Key. You’ll use this key to reference the flag in your code. A suggested key auto-populates from the name you enter, but you can customize it if you wish.
(Optional) Enter a Description of the flag. A brief, human-readable description helps your account members understand what the flag is for.
(Optional) Update the Maintainer for the flag.
(Optional) Check the Include flag in this project’s release pipeline box. To learn more, read Release pipelines.
(Optional) Choose any Metrics to monitor in the Metrics section. To learn more, read Metrics.
Choose the Migration flag template in the Configuration section:

The "Configuration" panel of the flag creation page, with the "Migration" option selected.
Choose how many stages your migration will need. Use the descriptions to identify the migration type that best meets your needs.

The "Configuration" panel of the flag creation page, listing the three different migration options.
a. If you choose a six-stage migration, select a context kind from the Targeting dropdown.
Migrations with six stages require a context kind
You must choose a context kind to create a six-stage migration. The context kind you choose should indicate how the migrated data is partitioned. It determines how rollouts are bucketed and which context kind to reference when you create cohorts.
You cannot update default on and off variations for migration flags
A migration flag’s default variation is always off. This ensures that migrations always begin in the correct stage.
(Optional) In the “Additional configuration” panel, update optional additional settings:
Choose one or more tags from the Tags menu.
Disregard the SDKs using Mobile Key and/or SDKs using client-side ID boxes. Migration flags are only available for server-side SDKs.
Tags let you sort flags into groups
Tags are useful for managing flag permissions using custom roles. For example, you can tag a flag as “Marketing” and “DevOps,” and then use these tags to determine who has read or write access for the flag. To learn more, read Roles.
Click Create flag.
This procedure explains how to create a migration flag, but targeting and rolling them out is more complex. We recommend you also read Targeting with migration flags.
Modify the migration flag template
To modify your migration flag template:
Click the project dropdown. The project menu appears:

The project menu.
Select Project settings.
Select Flags. The Flags settings list appears.
In the “Flag templates section, click the pencil icon next to “Migration.”
In the “Tags” section, type to add tags to each new flag by default.
Click Save.
Verify that the updated default template settings are correct by navigating to the Flags list and creating a new migration flag.
Targeting with migration flags
Overview
This topic explains how to target contexts with migration flags.
Targeting variations and stages
The different stages of a migration flag are expressed by the flag’s variations. Migration flags have built-in variations that you cannot edit, because they are linked to the migration’s stages. To progress through stages in a migration, adjust the percentage rollout to serve a different variation to a larger group, until 100% of contexts receive the same variation. We recommend progressing through the stages in the order they’re presented.
Targeting cohorts
Migration flag cohorts are analogous to the targeting rules for other types of feature flags. The default cohort is analogous to the default rule.
You can target cohorts in mostly the same ways you target rules, but cohorts always serve a percentage rollout. This helps visualize the progress of a migration. To learn more about rollouts, read Percentage rollouts.
You must specify a default cohort that this flag targets when the contexts specified in it are not a part of any other cohort. We recommend allocating 100% of this cohort in the “off” stage.
Here’s how to create a cohort:
Navigate to a migration flag’s Targeting tab.
Click the + icon and choose “Target segments” or “Build a custom rule.”
Configure the cohort’s targeting information. To learn more, read Target with flags.
In the “Serve” section, allocate the cohort into flag variations by percentages between 0 and one hundred. The total number in all stages must equal one hundred.

The cohort creation menu for a six-stage migration flag.
Targeting contexts
You cannot target individual contexts with a migration flag. If you need to target an individual context, create a cohort that contains only that context.
Migration flags’ off variations
The off variation for a migration flag is always off. This ensures that migrations always begin in the correct stage.
Understanding restrictions for migration flags with six stages
Migrations with six stages require you to specify a context kind to represent how the migrated data is partitioned. This context kind only targets contexts for the migration flag.
Migration flags with six stages have the following restrictions:
When you adjust a rollout, it will only affect keys for the context kind you designated for the six-stage migration
You can only create cohort clauses that reference that context kind
Cohorts cannot use the segmentMatch operator because segments can reference other context kinds
You cannot add prerequisites, because they can reference other context kinds
To learn more about when to use two, four, or six-stage migrations, read Performing multi-stage migrations with migration flags.
Understanding potential migration issues
Some targeting actions may create issues that could impact your data integrity. If a scenario like this occurs, a warning appears when you try to save.
Examples of actions that may cause safety issues are:
Adding a cohort that causes reads from the new system when a later cohort is not backfilled or in the off stage
Removing a cohort that is not backfilled or in the off stage when a later cohort causes reads
Reordering a cohort that is not backfilled or in the off stage when a later cohort (from its old position) causes reads from the new system

You can also use the REST API: Get migration safety issues
Migration flag metrics
Overview
Three metrics are available for migration flags: consistency rate, p99 latency, and error rate. You can use these metrics to track the progress of a migration flag. LaunchDarkly reports metrics at the flag and cohort level to provide fine-grained insight into your migration. Flag level metrics can include metrics not reflected in current cohorts. For example, you may see metrics from recently deleted cohorts, evaluations from while the flag was turned off, or if the prerequisite check failed.
Your SDK automatically tracks these metrics for you, with two exceptions:
Migration metrics are not tracked if you disable them in your SDK.
Migration metrics are not tracked in SDKs that do not support events, such as the Akamai SDK.
All migration metrics are updated hourly. They are unrelated to experimentation metrics.

Three charts, each displaying a healthy metric.
Consistency rate
The consistency rate metric shows how often two sets of compared data match each other. It is measured as a representative rate of total consistent invocations, where both invocations return the same results, against total number of invocations.
The consistency rate metric is not available for two-stage migrations, because it is only available when new and old systems can be run at the same time.
You must define what “same results” means for your systems. When you configure your SDK, you provide a validation function that compares the results of the old system and the new system and returns true if the systems are returning the same data. This validation function runs each time you read data while a cohort is in a stage that reads from both new and old systems, for example, the live stage.
In the LaunchDarkly user interface (UI), consistency rates lower than 99% display in red.
Changing the sampling ratio
If you’d like to run the consistency function less frequently, you can modify the consistency check interval in your flag settings for a specific environment. It defaults to 1, which means it will run for every invocation where there are old and new systems running simultaneously.
Latency
You can configure your SDK to return custom latency amounts, which are displayed in the UI as a p99 value. This number relies on the sampling ratio.
In the LaunchDarkly UI, unhealthy latency rates display in red. An unhealthy latency rate is ten percent or greater. Neutral rates of between zero and ten percent display in gray. Latency rates of less than ten percent are healthy, and display in green.
Error rate
The SDK you use reports errors as a rate per system. You can configure your SDK to log errors. This number relies on the sampling ratio.
In the LaunchDarkly UI, unhealthy error rates display in red. An unhealthy error rate is ten percent or greater. Neutral rates of between zero and ten percent display in gray. Latency rates of less than ten percent are healthy, and display in green.
Setting up metrics in the SDK
You can configure migration flag metrics in your SDK. To learn more, read Migration configuration.
Manage flags
Overview
This category explains how to organize your flags across different environments in your LaunchDarkly project. From the Flags list, you can view all the environments a flag exists in, and make changes that you can apply across multiple environments.
In addition, this category has content about the major organizational structures LaunchDarkly uses: projects and environments.
The Flags list
Comparing and copying flag settings
Viewing flags across environments
Deprecating flags
Archiving flags
Deleting flags
Code references
Code references are available to customers on select plans
Code references are only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
Overview
This topic explains how to use code references in LaunchDarkly to find and manage references to your feature flags.
The code references feature makes it easy to determine which projects reference your feature flags, and simplifies removal of technical debt.
LaunchDarkly uses an open-source utility called ld-find-code-refs that scans your code and pushes code reference information to LaunchDarkly. You can integrate this utility into your CI/CD process, or use other trigger mechanisms like GitHub code references, cron jobs, or commit-triggered Lambda functions.
Integrate ld-find-code-refs with your toolchain
LaunchDarkly services do not need direct access to your source code to use code references. The ld-find-code-refs utility is agnostic to where your code is hosted. You can push references to LaunchDarkly whether you’re using GitHub, GitHub Enterprise, Bitbucket, Bitbucket Enterprise, GitLab, Azure DevOps, or any other Git code hosting tool.
If your workflow does not have a direct integration, you can use an ld-find-code-refs Docker container on Docker Hub.
LaunchDarkly offers built-in configurations for common trigger mechanisms and CI/CD providers, including:
Bitbucket code references
CircleCI code references
Custom configuration with ld-find-code-refs
GitHub code references
GitLab code references
You can also invoke the ld-find-code-refs utility from the command line. Run this utility in any custom workflow, such as a bash script or cron job.
LaunchDarkly transmits code references-related information through LaunchDarkly’s REST API, which uses the HTTPS protocol with a minimum TLS version of 1.2. LaunchDarkly encrypts data at rest using AWS encryption features based on their Key Management Service. LaunchDarkly uses strong forms of cryptography like AES256-GCM with access-controlled keys that are regularly audited and rotated.
Prerequisites
To set up code references in LaunchDarkly, you must have the following prerequisites:
You must have an API access token with write permissions for the code-reference-repository resource, either through a base role, a LaunchDarkly-provided project role, or another role that you have created. Create an API access token on the Authorization page. We recommend using a service token. To learn more, read API access tokens and Code reference actions.
You must have a role that allows all actions on code references, such as the LaunchDarkly Project Admin, Maintainer, or Developer project roles, or the Writer, Admin, or Owner base roles.
You must allow ld-find-code-refs to run in environment that has access to your source code.
The creator of the API access token must have an appropriate role
To create an API access token with a role that allows all actions on code references, the member creating the access token must also have a role that allows all actions on code references.
View code references for flags
You can view existing code references for a specific feature flag from the flag’s right sidebar.
To view details for existing code references, navigate to the flag’s Targeting tab and click the name of the repository from the right sidebar. The Code references page for the flag appears.
The screenshot below shows the Code references page displaying an active code reference:

The "Code references" page for a feature flag.
The Flags list also indicates if a flag is ready for code removal: From the Flags list, open the Display menu. Then, select Archive checks.
When archive checks are displayed, each flag that is ready for code removal has a “Ready for code removal” indicator in the Flags list. Click the indicator to open the “Ready for code removal” dialog and review the checks to confirm that the flag is read for code removal. Then, click View code references to view existing code references for the flag.

You can also use the REST API: Code references
About extinction events
After you remove all code references mentioning that flag from the codebase and rerun the scanning tool, LaunchDarkly creates an extinction event. This event appears as a message on the Code references page for the feature flag. It indicates that all code references for the flag have been removed from the codebase as of a specified commit.

You can also use the REST API: List extinctions
Here is an image of an extinction event on the Code references page of a feature flag:

The "Code references" for a feature flag, with an extinction event.
To disable extinctions, set lookback to 0 in the ld-find-code-refs configuration settings.
You can toggle a repository on or off to allow or forbid code reference triggers from pushing new data to it.
Code references in federal environments
If you are using ld-find-code-refs in an environment that requires the use of FIPS 140-2 validated encryption modules, such as the LaunchDarkly federal instance, you may need to take additional steps to ensure compliance. To learn more, read LaunchDarkly in environments requiring FIPS 140-2 validated encryption modules.
Manage code references
Manage code references on the Integrations page for your project. Code references are organized into repositories, which the ld-find-code-refs tool creates automatically.
After a repository appears on the Integrations page, you can either temporarily disable it, which prevents new code references from being added to LaunchDarkly, or delete all code references associated with the repository.
To disable the repository, click the toggle switch to Off.
To delete the repository, click Delete.
If you click Delete, LaunchDarkly purges all data associated with that repository. It will no longer have any record of the code reference or any source context lines. Deleting is permanent and cannot be undone.
Remove code references before you click Delete
If you want to remove a connection permanently, be sure to remove any ld-find-code-refs triggers from your code. If you’re not sure how or where the trigger is invoked, you can also delete the access token your trigger uses. If you delete a repository with automated code reference updates enabled, the connection is recreated the next time an automated code reference trigger executes.
Configure context lines
The ld-find-code-refs utility sends two lines of surrounding source context to LaunchDarkly. Two lines of code appear above and two lines appear below the actual reference.
Having a few lines of context can make it easier to understand references to a feature flag. However, these lines are optional. You can disable this feature when you configure ld-find-code-refs.
Send metadata only
You can disable contextLines as shown in Configure context lines. When you disable contextLines no snippets of code leave your repository. All code scanning always happens within infrastructure your team manages as outlined in Integrate ld-find-code-refs with your toolchain
Metadata sent to LaunchDarkly:
Organization name, if applicable
Repository name
Commit ID
Synced time
File name
Line number
Metadata sent to LaunchDarkly if extinctions are enabled and an extinction is found:
All of the metadata listed in the section above
Commit message when extinction was recorded
ld-find-code-refs is open source and available for review. Code reference give your team additional insights, such as surfacing flag usage in the codebase to provide additional safety checks when archiving flags, during the lifecycle of the flag while still maintaining a secure SDLC.
Find flag aliases
Aliases help you find indirect references to feature flags, such as flag keys stored in variables or in wrapped SDK code.
Here’s how to find references to firstFeatureFlag throughout your codebase:
Example flag variable
var firstFeatureFlag = 'first-flag-key-123abc'

coderefs.yaml
aliases:
 - type: camelcase

This identifies all references to firstFeatureFlag in your codebase.
To learn more about aliases, read the aliases documentation.
Using ld-find-code-refs with a monorepo
ld-find-code-refs version 2.5.0+ provides support for monorepos. This means a single scan of code references can find feature flags and aliases from multiple LaunchDarkly projects stored in the same repository. You can specify an optional starting subdirectory for each project, which limits your scan to directories below the initial subdirectory only. The required top-level dir value should still be the overall git repository root directory.
To learn more about monorepo support, read Projects in the ld-find-code-refs configuration documentation.
Limitations
The LaunchDarkly code references API asserts various limits to limit the number of “false positive” code references. ld-find-code-refs logs warning messages if you exceed any of these limits. Above certain values, LaunchDarkly may ignore some files and references.
These limits include:
LaunchDarkly does not scan code references for flags with keys that have fewer than three characters.
LaunchDarkly stores up to 10,000 files with code references per repository. Additional files are ignored.
LaunchDarkly allows up to 500 characters per line of source code stored. Additional characters are truncated.
LaunchDarkly allows up to 25,000 code references per file. Additional references are ignored.
If you’ve encountered any of these limits, or are noticing a large number of false positives being detected by ld-find-code-refs, you can configure an .ldignore file in your repository with rules matching the files and directories you’d like to exclude.
To learn more about .ldignore files, read the ld-find-code-refs documentation.
Using ld-find-code-refs with the React Web SDK
The code references feature scans your source code for occurrences of your flag keys. This process requires your source code to reference flag keys exactly as they appear in LaunchDarkly.
However, by default, the React Web SDK changes all flag keys to camel-case for easier access with dot notation. To use the code references feature in conjunction with the React Web SDK, configure ld-find-code-refs to generate camel-case aliases for the flag keys, or configure the React Web SDK to disable this camel-casing feature. To learn more, read Flag keys transposed to common casing conventions in the ld-find-code-refs documentation and Flag keys in the React Web SDK.
Was this page helpful?
Yes

Bitbucket code references
Code references are available to customers on select plans
Code references are only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
Overview
This topic explains how to use the ld-find-code-refs utility with Bitbucket code references to create code references in LaunchDarkly.
You can use the ld-find-code-refs utility with Bitbucket Pipelines to automatically populate code references in LaunchDarkly. To do this, you must create a Pipes configuration using LaunchDarkly’s code reference pipe.
Prerequisites
To set up Bitbucket Pipes, you must have the following prerequisite:
A Bitbucket Pipelines configuration file. To create one, navigate to the Pipelines section of your Bitbucket repository.
An API access token with write permissions for the code-reference-repository resource, either through a base role, a LaunchDarkly-provided project role, or another role that you have created. To learn more, read API access tokens and Code reference actions.
API tokens can also use custom roles
Alternatively, you can give the access token access to a role with the code-reference-repository resource specifier. To learn more, read Roles.
Set up the Pipes configuration
To set up the Bitbucket Pipes configuration:
Create a new Pipeline configuration in your Bitbucket repository.
Configure the Pipeline to run on push using the default configuration. Include the following variables:
LD_ACCESS_TOKEN: This secured variable should be your API access token.
LD_PROJ_KEY: This should be your LaunchDarkly project key. To learn how to find your project key, read Project keys.
Here’s an example of a minimal Pipeline configuration:

An example Pipeline configuration.
You can copy and paste the following code into a blank Pipelines configuration if you have set the LD_PROJ_KEY and LD_ACCESS_TOKEN environment variables as repository variables:
YAML
pipelines:
 default:
   - step:
       script:
         - pipe: launchdarkly/ld-find-code-refs-pipe:2.12.0
           environment:
             LD_ACCESS_TOKEN: $LD_ACCESS_TOKEN
             LD_PROJ_KEY: $LD_PROJ_KEY

To learn more about repository variables, read Atlassian’s documentation.
Confirm that the pipeline is working by creating a new pull request with the workflow file and visiting the Pipelines page on your repository’s webpage. If your pipeline fails, there may be a problem with your configuration. To investigate, check the pipeline’s logs to view any error messages.
Pipeline configuration
You may configure the code reference pipe with additional environment variables to enable more functionality. For additional configuration options, read the ld-find-code-refs-pipe repository.
CircleCI code references
Code references are available to customers on select plans
Code references are only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
Overview
This topic explains how you can use the ld-find-code-refs utility with CircleCI to automatically populate code references in LaunchDarkly.
Prerequisites
To complete this procedure, you must have the following prerequisites:
An API access token with write permissions for the code-reference-repository resource, either through a base role, a LaunchDarkly-provided project role, or another role that you have created. To learn more, read API access tokens and Code reference actions.
The LaunchDarkly CircleCI Orb.
Circle Workflow version 2.1 or higher is required
To use CircleCI code references, you must be using a Circle Workflow version of 2.1 or higher. If you’re using an earlier version, try manually using the utility binary or docker image to create your own workflow job. To learn more, read Execution via CLI in the ld-find-code-refs documentation.
Set up the LaunchDarkly CircleCI integration
To set up the LaunchDarkly orb in CircleCI:
Save your API access token as an environment variable titled LD_ACCESS_TOKEN in your CircleCI project settings. To learn more, read CircleCI’s documentation.
Create a YAML file in CircleCI with configuration including LaunchDarkly’s Orb. Here’s an example minimal configuration using LaunchDarkly’s Orb:
YAML
version: 2.1


orbs:
 launchdarkly: launchdarkly/ld-find-code-refs@2.12.0


workflows:
 main:
   jobs:
     - launchdarkly/find-code-references:
         proj_key: $YOUR_LAUNCHDARKLY_PROJECT_KEY
         repo_type: github # can be 'bitbucket', 'custom', 'github', or 'gitlab'
         repo_url: $YOUR_REPO_URL # used to generate links to your repository

Additional configuration options
There are additional configuration options for the code references orb.
To skip searching files and directories, use an .ldignore file.
To configure custom delimiters and aliases for your flag keys, or to set other advanced configuration, use the .launchdarkly/coderefs.yaml file.
Custom configuration with ld-find-code-refs
Code references are available to customers on select plans
Code references are only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
Overview
This topic gives a high-level explanation of how to use the ld-find-code-refs script to perform other functions.
Custom ld-find-code-refs configuration
If you need a trigger mechanism other than one of the supported mechanisms, you can execute the ld-find-code-refs utility directly from your own trigger. For example, you can execute it from a cron job or a webhook.
You can configure ld-find-code-refs to detect and push code references to LaunchDarkly from a Git repository.
You can also use ld-find-code-refs to test the flag finder before setting up an automated trigger. To learn more, read the GitHub documentation for ld-find-code-refs.
GitHub code references
Code references are available to customers on select plans
Code references are only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
On a Developer or Foundation plan?
If you’re on a Developer or Foundation plan, instead you can use the Flag Code References in Pull Request GitHub Action.
Additional GitHub Action integrations are also available
LaunchDarkly has multiple integrations with GitHub Actions. To learn more, read about the LaunchDarkly integrations Find Code References in Pull Request and Flag Evaluations.
Overview
This topic explains how to use the ld-find-code-refs utility with GitHub Actions to automatically populate code references in LaunchDarkly. To learn more about the utility and check for the latest version, read LaunchDarkly Code References with GitHub code references.
Prerequisites
To complete this procedure, you must have the following prerequisites:
An API access token with write permissions for the code-reference-repository resource, either through a base role, a LaunchDarkly-provided project role, or another role that you have created. The token must be stored as a repository secret titled LD_ACCESS_TOKEN. To learn more, read API access tokens and Code reference actions.
Set up GitHub code references
To set up GitHub code references:
Log into GitHub and navigate to your repo.
Navigate to Settings then Secrets and click Add a new secret.
Paste in your access token to the field that appears and click Save secret.
Return to your GitHub repository to create a new Actions workflow.
If you already have an action.yml file: Copy and paste the launchDarklyCodeReferences job declaration below into the jobs section in your action.yml file.
If you don’t already have a workflow file: Create a new file titled action.yml in the .github/workflows directory of your repository. Paste the following code in the Edit file section:
YAML
name: Find LaunchDarkly flag code references
on: push
# cancel in-flight workflow run if another push was triggered
concurrency:
   group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}
   cancel-in-progress: true


jobs:
 launchDarklyCodeReferences:
   name: LaunchDarkly Code References
   runs-on: ubuntu-latest
   steps:
   - uses: actions/checkout@v4
     with:
       fetch-depth: 11 # This value must be set if the lookback configuration option is not disabled for find-code-references. Read more: https://github.com/launchdarkly/ld-find-code-refs#searching-for-unused-flags-extinctions
   - name: LaunchDarkly Code References
     uses: launchdarkly/find-code-references@v2
     with:
       accessToken: ${{ secrets.LD_ACCESS_TOKEN }}
       projKey: YOUR_PROJECT_KEY

Best practices for configuring an Actions file
We strongly recommend that you update the second uses attribute value to reference the most recent tag in the launchdarkly/find-code-references repository. This pins your workflow to a particular version of the launchdarkly/find-code-references action.
Commit this file under a new branch and submit as a PR to your code reviewers to be merged into your main branch.
Code references are not blocked by PR approval
You do not need to have this branch merged into the main branch for code references to appear in the LaunchDarkly user interface (UI). Code references will appear for this newly created branch.
As shown in the example above, the workflow should run on the push event and contain an action provided by the launchdarkly/find-code-references repository.
Include the LD_ACCESS_TOKEN as a secret, and include a new environment variable containing your LaunchDarkly project key. This is represented by YOUR_PROJECT_KEY in the above example. Do not use an environment’s SDK key, mobile key, or client-side ID for this purpose. To learn how to find your project key, read Project keys.
Troubleshooting
After you create the workflow, you can confirm that it’s working correctly by creating a new pull request with the workflow file and verifying that the newly created action succeeds.
If the action fails, there may be a problem with your configuration. To investigate, review the action’s logs to view any error messages.
Additional configuration options
You can configure find-code-references with additional inputs to enable more functionality. You can find additional configuration options at the bottom of the LaunchDarkly Code References marketplace page.
In addition to inputs, you can skip searching files and directories using a .ldignore file.
You can also use the .launchdarkly/coderefs.yaml file for advanced configuration options, such as configuring custom delimiters and aliases for your flag keys.
GitLab code references
Code references are available to customers on select plans
Code references are only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
Overview
This topic explains how to set up and configure the GitLab code references to use with LaunchDarkly.
You can use the ld-find-code-refs utility with GitLab CI to automatically populate code references in LaunchDarkly.
Follow the procedure below to create a GitLab code references configuration using LaunchDarkly’s code references executable.
Prerequisites
To complete this procedure, you must have the following prerequisites:
An API access token with write permissions for the code-reference-repository resource, either through a base role, a LaunchDarkly-provided project role, or another role that you have created. To learn more, read API access tokens and Code reference actions.
Set up GitLab code references
Here’s how to set up the GitLab code references:
Navigate to your GitLab project’s CI / CD settings by clicking through Your project, then Settings, then CI/CD.
Expand Variables.
Create a variable called LD_ACCESS_TOKEN. Use the same value as your LaunchDarkly access token. Click the toggle to set the variable to Masked.
Create a variable called LD_PROJECT_KEY. Use your LaunchDarkly project’s key as the value. To learn how to find your project key, read Project keys. To learn more about setting variables, read GitLab’s documentation.

The GitLab Variables dialog with masked "LD_ACCESS_TOKEN" and "LD_PROJECT_KEY" created.
Open your .gitlab-ci.yml file. This file defines your project’s CI/CD pipeline. To learn more about getting started with GitLab code references, read GitLab’s documentation.
Copy and paste the following into .gitlab-ci.yml. No changes to the script are needed if your pipeline runs on Alpine Linux. If apk is unavailable in your environment then you’ll need to modify the first three steps to use a different package manager:
YAML
find-launchdarkly-code-refs:
 stage: deploy
 image:
   name: launchdarkly/ld-find-code-refs:latest
   entrypoint: [""]
 script:
   - ld-find-code-refs
      --accessToken $LD_ACCESS_TOKEN
      --projKey $LD_PROJECT_KEY
      --dir $CI_PROJECT_DIR
      --repoName $CI_PROJECT_NAME
      --repoUrl $CI_PROJECT_URL
      --repoType gitlab
      --branch $CI_COMMIT_REF_NAME
      --updateSequenceId $CI_PIPELINE_IID
      --userAgent gitlab-pipeline

How the script works
When executed, this script downloads and runs the ld-find-code-refs docker image.
This script runs the docker image with previously-set variables, as well as GitLab-specific configurations.
The find-launchdarkly-code-refs script runs in GitLab’s deploy phase. As written, find-launchdarkly-code-refs runs concurrent to other scripts in the deploy stage. We positioned the script this way so problems running ld-find-code-refs won’t block the deployment pipeline.
In the example .gitlab-ci.yml below, the find-launchdarkly-code-refs script runs as a part of a project’s pipeline:
YAML
image: alpine:latest


build1:
 stage: build
 script:
   - echo "Build something"


test1:
 stage: test
 script:
   - echo "Test something"


deploy1:
 stage: deploy
 script:
   - echo "Deploy something"


find-launchdarkly-code-refs:
 stage: deploy
 image:
   name: launchdarkly/ld-find-code-refs:latest
   entrypoint: [""]
 script:
   - ld-find-code-refs
      --accessToken $LD_ACCESS_TOKEN
      --projKey $LD_PROJECT_KEY
      --dir $CI_PROJECT_DIR
      --repoName $CI_PROJECT_NAME
      --repoUrl $CI_PROJECT_URL
      --repoType gitlab
      --branch $CI_COMMIT_REF_NAME
      --updateSequenceId $CI_PIPELINE_IID
      --userAgent gitlab-pipeline

When the jobs run in the pipeline, they display like this:

A screenshot of the jobs running.
Additional configuration options
There are more configuration options for ld-find-code-refs.
You can exclude files and directories from searches with an .ldignore file.
You can use the .launchdarkly/coderefs.yaml file for advanced configuration, such as configuring custom delimiters and aliases for your flag keys.
To learn more, read the configuration documentation.
AI Configs
Overview
This category explains how to use LaunchDarkly to manage your AI Configs. An AI Config is a resource that you create in LaunchDarkly. You can use AI Configs to customize, test, and roll out new large language models (LLMs) within your generative AI applications.
With AI Configs, you can:
Manage your model configuration outside of your application code. This means you can update model details and messages at runtime, without deploying changes. Teammates who have LaunchDarkly access but no codebase familiarity can collaborate and iterate on messages.
Upgrade your app to the latest model version as soon as it’s available, then roll out the change gradually and safely.
Add a configuration for a new model provider and progressively shift production traffic to that provider.
Compare variations to determine which performs better based on satisfaction, cost, or other metrics. You can compare messages across models or compare the same model across providers.
Run experiments to measure the impact of generative AI features in your application.
AI Configs also support advanced use cases such as retrieval-augmented generation (RAG) and evaluation in production. You can:
Track which knowledge base or vector index is active for a given model or audience.
Experiment with different chunking strategies, retrieval sources, or prompt structures.
Evaluate outputs using side-by-side comparisons or AI Config-as-judge methods implemented in your application.
Build guardrail logic into your runtime configs, such as models, prompts, and filters, and use targeting rules to block risky generations or switch to fallback behavior.
Apply different safety filters by user type, geography, or application context.
Use live metrics for satisfaction, factuality, and hallucination detection to guide rollouts.
These capabilities let you build safety controls, run targeted experiments, and evaluate model behavior in production without being locked into a single model provider or manual workflow.
How AI Configs work
Every AI Config contains one or more variations. Each variation includes a model configuration and, optionally, one or more messages. You can also define targeting rules, just like you do with feature flags, to make sure that particular messages and model configurations are served to particular end users of your application.
Then, within your application, you use one of LaunchDarkly’s AI SDKs. The SDK determines which messages and model your application should serve to which contexts. The SDK can also customize the messages based on context attributes and other variables that you provide. This means both the messages and the model evaluation are modified to be specific to each end user at runtime. You can update your messages, specific to each end user, without redeploying your application.
After you use this customized config in your AI model generation, you can use the SDK to record various metrics, including generation count, tokens, and satisfaction rate. These appear in the LaunchDarkly user interface for each AI Config variation.
The topics in this category explain how to create AI Configs and variations, update targeting rules, monitor related metrics, and incorporate AI Configs in your application.
Additional resources
In this section:
Quickstart for AI Configs
Create AI Configs and variations
Target with AI Configs
Monitor AI Configs
Manage AI Configs
Run experiments with AI Configs
AI Configs and information privacy
In our guides:
Managing AI model configuration outside of code
Using targeting to manage AI model usage by tier
In our SDK documentation:
.NET AI SDK reference
Go AI SDK reference
Node.js (server-side) AI SDK reference
Python AI SDK reference
Ruby AI SDK reference
Quickstart for AI Configs
Overview
This topic explains how to get started with the LaunchDarkly AI Configs product.
You can use AI Configs to customize, test, and roll out new large language models (LLMs) within your generative AI applications. AI Configs may be right for you if you want to:
Manage your model configuration and messages outside of your application code
Upgrade your app to the newest model version, then gradually release to your customers
Start using a new model provider, and progressively move your production traffic to the new provider
Compare the performance of different messages and models
With AI Configs, both the messages and the model evaluation are specific to each end user, at runtime. You can update your messages, specific to each end user, without redeploying your application.
Working with AI Configs is available to members with a role that allows AI Config actions. The LaunchDarkly Project Admin, Maintainer, and Developer project roles, as well as the Admin and Owner base roles, include this permission.
Follow the steps below to incorporate AI Configs into your app, or use the in-app onboarding experience to set up your first AI Config directly in the LaunchDarkly UI.
If you’d prefer to learn from an example that’s built on a specific generative AI application, read one of our guides:
Managing AI model configuration outside of code with the Node.js AI SDK
Using targeting to manage AI model usage by tier with the Python AI SDK
Try the LaunchDarkly sandbox
After you sign up for a trial, you can also use the LaunchDarkly demo sandbox.
Step 1, in your app: Install an AI SDK
First, install one of the LaunchDarkly AI SDKs in your app:
.NET AI SDK
Go AI SDK
Node.js AI SDK (TypeScript)
Python AI SDK
Ruby AI SDK
Install-Package LaunchDarkly.ServerSdk
Install-Package LaunchDarkly.ServerSdk.Ai

Next, import the LaunchDarkly AI client in your app and initialize a single, shared instance of it:
.NET AI SDK
Go AI SDK
Node.js AI SDK (TypeScript)
Python AI SDK
Ruby AI SDK
using LaunchDarkly.Sdk.Server.Ai;
using LaunchDarkly.Sdk.Server.Ai.Adapters;
using LaunchDarkly.Sdk.Server.Ai.Config;


var baseClient = new LdClient(Configuration.Builder("sdk-key-123").StartWaitTime(TimeSpan.FromSeconds(5)).Build()));
var aiClient = new LdAiClient(new LdClientAdapter(baseClient));

The AI SDKs each require that you specify your SDK key to authorize your application to connect to a particular environment within LaunchDarkly. SDK keys are specific to each project and environment. They are available from Project settings, on the Environments list in the LaunchDarkly UI. To learn more, read Keys.
Then, set up the context. Contexts are the people or resources who will encounter generated AI content in your application. The context attributes determine which variation of the AI Config LaunchDarkly serves to the end user, based on the targeting rules in your AI Config. If you are using template variables in the messages in your AI Config’s variations, the context attributes also fill in values for the template variables.
Here’s how:
.NET AI SDK
Go AI SDK
Node.js AI SDK (TypeScript)
Python AI SDK
Ruby AI SDK
var context = Context.Builder("example-user-key")
 .Name("Sandy")
 .Build();

Step 2, in LaunchDarkly: Create an AI Config
Next, create an AI Config in LaunchDarkly:
Click Create and choose AI Config.
In the “Create AI Config” dialog, give your AI Config a human-readable Name and, optionally, a Maintainer.
Click Create.
The empty Variations tab of your new AI Config displays:

The Variations tab of a newly-created AI Config.
Then, create a variation. Every AI Config has one or more variations. Each variation includes a model configuration and, optionally, one or more messages.
Here’s how:
In the create panel in the Variations tab, replace “Untitled variation” with a variation Name. You’ll use this to refer to the variations when you set up targeting rules, below.
Click Select a model and choose the model to use.
LaunchDarkly provides a list of common models, and updates it frequently.
You can also choose + Add a model and create your own. To learn more, read Create AI model configurations.
(Optional) Select a message role and enter the message for the variation. If you’d like to customize the message at runtime, use {{ example_variable }} or {{ ldctx.example_context_attribute }} within the message. The LaunchDarkly AI SDK will substitute the correct values when you customize the AI Config from within your app.
To learn more about how variables and context attributes are inserted into messages at runtime, read Customizing AI Configs.
Click Review and save.
You can also select Import from playground in your variation to bring your model, model parameters, and messages from an external playground.
Here’s an example of a completed variation:

The Variations tab of an AI Config with one variation.
Expand to copy variation message



Step 3, in LaunchDarkly: Set up targeting rules
Next, set up targeting rules for your AI Config. These rules determine which of your customers receive a particular variation of your AI Config.
To specify the AI Config variation to use by default when the AI Config is toggled on:
Select the Targeting tab for your AI Config.
In the “Default rule” section, click Edit.
Configure the default rule to serve a specific variation.
Click Review and save.
Here is an example of a default rule:

An AI Config's default rule.
The AI Config is enabled by default. After you’ve added code to your application to pull the customized messages and model configuration from LaunchDarkly, your AI Config will be active.
When an end user opens your application, they’ll get the AI Config variation you’ve defined, either in the default rule or in a custom targeting rule. Your app’s AI content generation will use the model and messages from the AI Config variation, and the messages will be customized for each end user.
When you’re ready to add more AI Config variations, come back to this step and set up additional targeting rules. If you are familiar with LaunchDarkly’s flag targeting, the process is very similar: with AI Configs, you can target individuals or segments, or target contexts with custom rules. To learn how, read Target with AI Configs.
Step 4, in your app: Customize the AI Config, call your generative AI model, track metrics
Now that your AI Config is set up, you can use it in your app:
Customize the AI Config: First, use the config function from the LaunchDarkly AI SDK to customize the AI Config. The config function returns the customized messages and model configuration along with a tracker instance for recording metrics.
Call your generative AI model, track metrics: Then, call your generative AI model, passing in the result of the config function. In the LaunchDarkly AI SDKs, you use a track[Model]Metrics function to record metrics from your AI model generation. This function takes a completion from your AI model generation.
Customize the AI Config
In your code, use the config function from the LaunchDarkly AI SDK to customize the AI Config. You need to call config each time you generate content from your AI model.
The config function returns the customized messages and model configuration along with a tracker instance for recording metrics. Customization means that any variables you include in the AI Config variation’s messages have their values set to the context attributes and variables you pass to the config function. Then, you can pass the customized messages directly to your AI. You should also set up a fallback value to use in case of an error.
Here’s how:
.NET AI SDK
Go AI SDK
Node.js AI SDK
Python AI SDK
Ruby AI SDK
var fallbackConfig = LdAiConfig.New()
 .SetModelName("my-default-model")
 .SetModelParam("temperature", LdValue.Of(0.8))
 .AddMessage("", Role.system)
 .SetModelProviderName('my-default-provider')
 .SetEnabled(true)
 .Build()


var tracker = aiClient.Config(
 "ai-config-key-123abc",
 context,
 fallbackConfig,
 new Dictionary<string, object> {
   { "example_variable", "puppy" }
 }
);


// Based on the example AI Config variation shown in step 2,
// tracker.Config.Messages[0].Content will be:
// "You are a model designed to tell knock-knock jokes. Each joke should be addressed to Sandy and include at least one puppy."

Call your generative AI model, track metrics
Next, make a call to your generative AI model and pass in the result of the config function.
Use one of the track[Model]Metrics or TrackRequest functions to record metrics from your AI model generation. This function takes a completion from your AI model generation. Remember that you need to call config each time you generate content from your AI model.
LaunchDarkly provides specific functions for completions for several common AI model families, and an option to record this information yourself.
Here’s how to use a provider-specific track[Model]Metrics function to call OpenAI or Bedrock providers and record metrics from your AI model generation:
Node.js AI SDK (TypeScript), OpenAI model
Node.js AI SDK (TypeScript), Bedrock model
Python AI SDK, OpenAI model
Python AI SDK, Bedrock model
Ruby AI SDK, OpenAI model
Ruby AI SDK, Bedrock model
Ruby AI SDK, Bedrock helper function
const { tracker } = aiConfig;


// Pass in the result of the OpenAI operation.
// When you call the OpenAI operation, use details from aiConfig.
// For instance, you can pass aiConfig.messages
// and aiConfig.model to your specific OpenAI operation.
//
// CAUTION: If the call inside of trackOpenAIMetrics throws an exception,
// the SDK will re-throw that exception


const completion = await tracker.trackOpenAIMetrics(async () =>
 client.chat.completions.create({
   messages: aiConfig.messages || [],
   model: aiConfig.model?.name || 'gpt-4',
   temperature: (aiConfig.model?.parameters?.temperature as number) ?? 0.5,
   maxTokens: (aiConfig.model?.parameters?.maxTokens as number) ?? 4096,
 }),
);


// Call config() again each time you want to call the OpenAI operation


const aiConfig = aiClient.config(
 'ai-config-key-123abc',
 context,
 fallbackConfig,
 { 'example_variable': 'elephant' },
);


const { tracker } = aiConfig;
const completion = await tracker.trackOpenAIMetrics(...)

Here’s how to use the general TrackRequest function to call any AI model provider and record metrics from your AI model generation:
.NET AI SDK, any model
Go AI SDK, any model
var response = tracker.TrackRequest(Task.Run(() =>
 {
   // Make request to a provider, which automatically tracks metrics in LaunchDarkly.
   // When sending the request to a provider, use details from tracker.Config.
   // For instance, you can pass tracker.Config.Model and tracker.Config.Messages.
   // Optionally, return response metadata, for example to do your own additional logging.
   //
   // CAUTION: If the call inside of Task.Run() throws an exception,
   // the SDK will re-throw that exception.


   return new Response
   {
     Usage = new Usage { Total = 1, Input = 1, Output = 1 }, /* Token usage data */
     Metrics = new Metrics { LatencyMs = 100 } /* Metrics data */
   };
 }
));


// Call Config() again each time you want to call the generative AI operation.
var tracker = aiClient.Config(
 "ai-config-key-123abc",
 context,
 fallbackConfig,
 new Dictionary<string, object> {
   { "example_variable", "elephant" }
 }
);


var response = tracker.TrackRequest(...)

Whether you use track[Model]Metrics or TrackRequest, the SDK automatically flushes these pending analytics events to LaunchDarkly at regular intervals. If you have a short-lived application, such as a script or unit test, you may need to explicitly request that the underlying LaunchDarkly client deliver any pending analytics events to LaunchDarkly, using flush() or close().
Here’s how:
.NET AI SDK
Go AI SDK
Node.js AI SDK
Python AI SDK
Ruby AI SDK
baseClient.Flush();

You can also track metrics yourself
LaunchDarkly provides specific functions for completions for several common AI model families, including OpenAI and Bedrock, and an option to record this information yourself.
If you are using another provider, or want to record additional metrics, each AI SDK also includes individual track* methods to record duration, token usage, generation success, generation error, time to first token, output satisfaction, and more. To learn more, read AI metrics.
LaunchDarkly AI SDK sample applications
For a complete example application, you can review some of our sample applications:
Node.js AI SDK, using OpenAI
Node.js AI SDK, using Bedrock
Python AI SDK, using OpenAI
Python AI SDK, using Bedrock
Ruby AI SDK, using Bedrock
Ruby AI SDK, using OpenAI
Step 5, in LaunchDarkly: Monitor the AI Config
Select the Monitoring tab for your AI Config. As end users use your application, LaunchDarkly monitors the performance of your AI Configs. Metrics are updated approximately every minute.
Learn more about AI Configs
The following sections provide answers to common questions about working with AI Configs.
Integration with AI providers
In the AI Configs product, LaunchDarkly is not handling the integration to the AI provider. The LaunchDarkly AI SDKs provide your application with model configuration details, including customized messages, and model parameters such as temperature and tokens. It is your application’s responsibility to pass this information to the AI provider.
The LaunchDarkly AI SDKs provide methods to help you track how your AI model generation is performing, and in some cases, these methods take the completion from common AI providers as a parameter. However, it is still your application’s responsibility to call the AI provider. To learn more, read Tracking AI metrics.
Privacy and personally identifiable information (PII)
LaunchDarkly does not send any of the information you provide to any models, and does not use any of the information to fine tune any models.
You should follow your own organization’s policies regarding if or when it may be acceptable to send end-user data either to LaunchDarkly or to an AI provider. To learn more, read AI Configs and information privacy.
Availability of new models
When you create a new AI Config variation, you can select a model from the provided list. LaunchDarkly updates this list regularly. To request a new model, click the Give feedback option and let us know what models you’d like to have included.
You can also add your own model at any time. To learn how, read Create AI model configurations.
Create AI Configs
Overview
This topic explains how to create and update AI Configs.
Working with AI Configs is available to members with a role that allows AI Config actions. The LaunchDarkly Project Admin, Maintainer, and Developer project roles, as well as the Admin and Owner base roles, include this permission.
Create an AI Config
An AI Config is a resource that you create in LaunchDarkly. You can use AI Configs to customize, test, and roll out new large language models (LLMs) within your generative AI applications.
Follow the steps below to create an AI Config, or use the in-app onboarding experience to set up your first AI Config directly in the LaunchDarkly UI.
Click Create and choose AI Config to open the “Create AI Config” dialog:

The "Create an AI Config" dialog.


Give your AI Config a human-readable Name.
An AI Config contains a set of variations. Each variation includes a model configuration and, optionally, one or more messages. The Name you choose should reflect what this set of variations will do. You can update it later.
(Optional) Click Edit key and update the AI Config Key. You’ll use this key to reference the AI Config in your code. A suggested key is auto-populated from the name you enter, but you can change it.
AI Config keys cannot be modified
After you create the AI Config, you cannot modify its key, but you can still change its name.
Set or confirm the Maintainer of the AI Config.
Click Create.
Now that you have an AI Config, you can start creating variations. You can also update additional details.
Update AI Config details
When you create an AI Config, only the name and key are required initially. You can also add or update other details, including the AI Config’s description and tags.
To update an AI Config’s details:
Navigate to the details page for the AI Config.
In the right sidebar, click Choose maintainer to add a maintainer. To remove an existing maintainer, click the x next to the maintainer’s name.
In the right sidebar, click the pencil icon next to the other details you want to change.
You can update the Name and Description by editing the text of each.
You can update the Tags by adding or removing tags. When you add a tag to an AI Config, you can use an existing tag or create a new one.
Use tags to group and manage AI Configs
Tags are useful for managing permissions using custom roles. For example, you can use a specific tag to determine who can update this AI Config. To learn more, read Roles.
Create and manage AI Config variations
Overview
This topic explains how to create and manage AI Config variations.
An AI Config is a resource that you create in LaunchDarkly. You can use AI Configs to customize, test, and roll out new large language models (LLMs) within your generative AI applications.
Within each AI Config, you define one or more variations. Each variation includes a model configuration and, optionally, one or more messages. A variation can be in one of two states: “published” or “archived.”
Create AI Config variations
You can create variations for an AI Config using the LaunchDarkly UI. Each variation defines a unique combination of model settings and prompt messages. You can create multiple variations in the UI at the same time.
To create one or more variations in the LaunchDarkly UI:
In LaunchDarkly, click AI Configs.
Click the name of the AI Config you want to edit.
Select the Variations tab:

The Variations tab of a newly-created AI Config.


Enter a variation Name. You’ll use this name to refer to the variation when setting up targeting rules.
Import from external playgrounds
If you have already used an external playground to set up a model, model parameters, and messages, you can import that configuration into your AI Config variation. Here’s how:
Click Import from playground.
In the “Import from playground” dialog, select a provider from the Which playground are you using? menu.
Paste the output from your provider’s playground into the text box.
Click Import.
Skip to step 10 in the main procedure.
Click Select a model and choose a model to use.
LaunchDarkly provides a frequently updated list of common models.
You can also choose Add a model and create your own. To learn more, read Create AI model configurations.
LaunchDarkly does not send any data to these models
LaunchDarkly does not transmit any information you provide when creating an AI Config and its variations to external models. We do not use any of this data to fine-tune or train any models. Your model selection is solely used to suggest parameter values and help you organize which messages are associated with each model. This list of available models is updated regularly. If you want us to add a new model, click the Give feedback option to share your request.
After you assign a model to a variation, an Add parameters button appears. Use this button to configure model or custom parameters for the variation. To learn more, read Add parameters.
(Optional) Use the dropdown to select the message role for the first message in this variation. The default value is “system” but you can also choose “assistant” or “user.” Not all model providers support every role.
(Optional) Enter the text of the message. You can use standard Markdown formatting within the message.
(Optional) Use double curly braces to indicate variables that you’ll set at runtime from your application. For example, enter This is an {{ example }} message if you want to replace {{ example }} with some other value in your application code when an end user encounters this variation.
(Optional) Use double curly braces, the ldctx prefix, and dot (.) notation to indicate context attributes whose values you want to use at runtime. For example, enter Describe the typical weather in {{ ldctx.city }} to replace {{ ldctx.city }} with the city attribute from each context that encounters this AI Config.
To learn more about how variables and context attributes are inserted into messages at runtime, read Customizing AI Configs.
(Optional) Click + Add another message and repeat steps 7 and 8 to include another message in this variation.
Click Review and save to save the AI Config variation.

You can also use the REST API: Create AI Config variation. The REST API supports creating individual variations only.
After creating an AI Config and its variations, you can set up targeting rules and use the AI Config in your SDK.
(Optional) Add parameters
After you assign a model to a variation, an Add parameters button appears. Use this button to configure model or custom parameters for the variation.
To add parameters:
Click Add parameters to see the Model parameters and Custom parameters options.
To add model parameters:
Click Model parameters.
Click + Add model parameters.
Select a model parameter, such as temperature or max_tokens, from the list. The available parameters vary depending on the model you select.
In the configuration panel for the selected parameter, view the “Base value” and optionally enter an “Override value” for this variation.
To add more parameters, click + Add model parameters again.
To add custom parameters:
Click Custom parameters.
In the JSON editor that appears, enter your custom parameters as key-value pairs inside the curly braces ({}).
You can continue creating or editing additional variations, or complete the variation creation process:
Click Review and save. The “Save changes” dialog lists all the variations you’ve created. You can view your changes in a unified or split view, and expand or collapse individual variations as needed.
(Optional) Enter a comment describing your changes.
Click Save to add all variations to the AI Config. Each new variation receives a version number, and the version numbers of existing variations are incremented.
Parameters display next to Add parameters
Any parameters you’ve added appear next to Add parameters in the variation.
Edit AI Config variations
You can update variations for an AI Config using the LaunchDarkly UI. You can edit multiple variations in the UI at the same time.
To update one or more variations in the LaunchDarkly UI:
In LaunchDarkly, click AI Configs.
Click the name of the AI Config you want to edit.
Make changes to any of the AI Config’s variations. You can expand or collapse individual variations to help you focus on specific updates.
Click Review and save. The “Save changes” dialog lists the updates for each variation. You can view your changes in a unified or split view, and collapse or expand individual variations as needed.
(Optional) Enter a comment describing the changes.
Click Save to create a new version of the AI Config that includes all the updates. Each updated variation receives a new version number.

You can also use the REST API: Update AI Config variation. The REST API supports updating individual variations only.
Duplicate an AI Config variation
Often, when you create a new variation for an AI Config, you want the new variation to be very similar to an existing variation. You may only be changing the messages slightly or adjusting the model parameters. Instead of creating a new AI Config from scratch, you can duplicate an existing AI Config variation and make changes to the copy.
To duplicate an existing AI Config variation:
Navigate to the detail page for the AI Config.
Select the Variations tab.
Find the variation you want to duplicate.
Click the three-dot overflow menu for the variation and select Duplicate:

The overflow menu for a variation


The new variation has the same name as the one you duplicated, appended with “(Copy)”. Update the new variation as needed.
Click Review and save.
Working with archived AI Config variations
Each AI Config variation can be in one of two states: “published” or “archived.”
By default, all variations are published. You can only use published variations in targeting rules.
You can mark a variation as archived if you want to keep it for reference or comparison purposes, but no longer need to use it in targeting rules or running experiments.
Archive AI Config variations
To archive an AI Config variation:
Navigate to the detail page for the AI Config.
Select the Variations tab.
Find the variation you want to archive.
Click the three-dot overflow menu and choose Archive.
The variation moves to the archived view on the Variations tab, and its version number is incremented. If you compare the new variation version to the previous one, there will be no differences in the model configuration or messages. The only difference between the two variation versions is the publication state.
View archived AI Config variations
To view archived AI Config variations:
Navigate to the detail page for the AI Config.
Select the Variations tab.
From the Published dropdown, select Archived to open the list of archived variations.
Restore archived AI Config variations
To restore an archived AI Config variation:
Navigate to the detail page for the AI Config.
Select the Variations tab.
From the Published dropdown, select Archived to open the list of archived variations.
Find the variation you want to restore.
Click the three-dot overflow menu and choose Restore.
The variation moves to the published view on the Variations tab, and its version number is incremented. If you compare the new variation version to the previous one, there will be no differences in the model configuration or messages. The only difference between the two variation versions is the publication state.
Delete an AI Config variation
To delete an AI Config variation:
Navigate to the detail page for the AI Config.
Select the Variations tab.
Find the variation you want to delete. Use the Published dropdown to switch between the published and archived views if needed to find the variation.
Click the three-dot overflow menu and choose Delete variation.
Compare AI Config variation versions
Overview
This topic explains how to compare versions of an AI Config variation.
Within each AI Config, you define one or more variations. Each variation includes a model configuration and, optionally, one or more messages.
In many applications, you’ll frequently update those variations as you change model parameters or adjust the language in the messaging. You can view the history of each variation and compare differences between variations in the LaunchDarkly user interface.
View variation history
To view the history of an AI Config variation:
Navigate to the detail page for the AI Config.
Select the Variations tab.
Click the three-dot overflow menu for the variation and select View history:

The overflow menu for a variation.


The “Variation history” panel appears, listing all versions of the variation.
Compare variation versions
To compare two versions of an AI Config variation:
Follow the procedure to view variation history for an AI Config variation, above.
From the “Variation history” panel, click the version of the variation that you want to compare to the current version.
The version comparison page appears, showing the selected version of the variation compared to the current version of the variation:

The version comparison page for an AI Config variation.


Review the differences between the versions. The “Model configuration” section displays the model configuration in JSON. The “Messages” section displays the message information as text.
Use the version dropdown to compare a different version to the current version.
If you select the current version from the dropdown, the page displays only the current version. There are no differences.
Restore previous version
To restore a previous version of an AI Config variation:
Follow the procedure to compare two versions of an AI Config variation, above.
From the version comparison page, use the version dropdown to select the version of this variation that you want to restore.
Click Promote vX to current, where “X” is the version number that you want to restore.
LaunchDarkly returns you to the Variations tab, with the variation details updated based on the version you selected to promote.
Click Review and save to create a new version of the variation with these updates.
Was this page helpful?
Yes

Create and manage AI model configurations
Overview
This topic explains how to create and manage custom models to use in AI Configs.
An AI Config is a resource that you create in LaunchDarkly. You can use AI Configs to customize, test, and roll out new large language models (LLMs) within your generative AI applications. Within each AI Config, you define one or more variations. Each variation includes a model configuration and, optionally, one or more messages. When you create a variation, you have the option to use a standard model, also called a “global” model, from the list provided by LaunchDarkly.
You can also add your own model and set up its parameters. This is called an AI model configuration. After you create an AI model configuration, you can use it in any variation for any AI Config in your project.
You can set both global models and custom models as restricted, which means that no one in your organization can use those model configurations in any AI Config variations. This lets you effectively limit the models that are available in each LaunchDarkly project.
This topic covers the following topics:
Create an AI model configuration
View AI model configurations
Restrict an AI model configuration
Delete an AI model configuration
Create an AI model configuration
You can create an AI model configuration while either creating an AI Config variation or from the AI model configs tab under Project settings.
Create an AI model configuration from a variation
To create an AI model configuration from an AI Config variation:
Navigate to the Variations tab of the AI Config and select a variation. Some sections in the interface may be collapsed. Expand the section you want to edit before continuing.
Open the Select a model menu.
Choose + Add a model.
Follow the steps for completing the “Add custom model” dialog, below.
Create an AI model configuration from project settings
To create an AI model configuration from your Project settings page:
Click the project dropdown to open the project menu.
Select Project settings.
Select AI model configs to open the AI model configs list.
Click Add AI model config.
Follow the steps for completing the “Add custom model” dialog, below.
Complete the “Add custom model” dialog
To complete the “Add custom model” dialog:
Enter a Name for your AI model configuration.
The name appears in the Select a model dropdown when you create a variation for an AI Config.
You also need the name if you want to create a role that allows or denies access to this AI model configuration.
Select a Provider.
Enter a Model ID.
The model ID is the identifier for the model that the LLM provider uses. This must exactly match the identifier from the provider.
You also need the model ID if you want to create a role that allows or denies access to this AI model configuration.
Enter the token costs:
Enter the Input token cost per million tokens.
Enter the Output token cost per million tokens.
Token costs cannot be adjusted
The token costs are fixed for each model configuration. If model pricing changes, you must create a new model configuration with the new cost. Then update any AI Config variations that use this model.
(Optional) Click + Add suggested parameters. The menu displays model parameters, their types, and their default values.
Select a model parameter from the list.
Set its value in the dialog. This will be the default value when you choose this model in an AI Config variation. You can set a different value in the AI Config variation if needed.
When you customize an AI Config in your SDK, you can access these parameters in the model section of the LDAIConfig.
(Optional) Click + Add custom parameters.
Enter any additional parameters you want to include as a valid JSON object.
LaunchDarkly always applies these parameters and their values when you select this model in an AI Config variation.
When you customize an AI Config in your SDK, you can access these parameters in the model.custom section of the LDAIConfig.
Click Save.
Here is an example:

The "Add custom model" dialog.
View AI model configurations
To view all of the AI model configurations in a project:
Click the project dropdown to open the project menu.
Select Project settings.
Select AI model configs to open the AI model configs list.
You can filter the list by model type and availability:

The "Filters" menu for the AI model configs list.
You can use the search box to find models by entering all or part of the model name or ID.
Restrict an AI model configuration
You can mark any AI model configuration as restricted, which prevents anyone in your organization from using it in any AI Config variations. This lets you effectively limit the models that are available in each LaunchDarkly project.
To restrict an AI model configuration:
Click the project dropdown to open the project menu.
Select Project settings.
Select AI model configs to open the AI model configs list.
Click the three-dot overflow menu and select Restrict.
To make an AI model configuration available again, click the three-dot overflow menu and select Make available.
Delete an AI model configuration
To delete an AI model configuration:
Click the project dropdown to open the project menu.
Select Project settings.
Select AI model configs to open the AI model configs list.
For the model you want to delete, click the three-dot overflow menu and select Delete.
Alternatively, click the name of the AI model config you want to delete, then click Delete AI model config from the detail page.
You can only delete custom AI model configurations. You cannot delete the global AI model configs provided by LaunchDarkly.
You cannot delete an AI model configuration if it is currently used in a variation for an AI Config.
Target with AI Configs
Overview
This topic explains how to use AI Config targeting to control which of your customers receive a particular variation of an AI Config, based on their context. Targeting is enabled by default for all AI Configs. You can turn targeting off if you want every context to receive the off variation.
LaunchDarkly contexts are data objects representing users, devices, organizations, and other entities that interact with your application. These data objects contain context attributes that describe what you know about that context, such as their name, location, device type, or organization they are associated with. LaunchDarkly AI SDKs can pass any context attributes you want to LaunchDarkly, where you can then use those attributes in AI Config targeting, as well as in the AI Config variation’s messages.
If you are familiar with LaunchDarkly’s flag targeting, this process is very similar: with AI Configs, you can target individuals or segments, or target contexts with custom rules.
Additionally, every AI Config has a default rule and an off variation.
Targeting rules are specific to each environment. You can update targeting rules if your role includes the updateAIConfigTargeting action.
Target individuals
You can target specific contexts based on their context key. If you are targeting more than one or two individuals, we recommend targeting a segment instead, because segments are reusable across AI Configs and flags.
To target individuals:
Navigate to the Targeting tab for the AI Config.
At the top of the tab, select the environment for which you want to create targeting rules. Targeting rules are specific to each environment.
To add targeting rules to an environment that’s not shown, click the + icon to add another environment to the Targeting tab.
Click the + button between existing rules, and select Target individuals.
If the AI Config is off and the rules are hidden, click View targeting rules.
In the “Individual targeting” section, search for and select the context you want to target.
Alternatively, you can also create a new context from the search menu. To do so:
Enter the new context name.
Click Create new.
Select a context kind from the context kind menu.
Select a variation to Serve.
To add more contexts, click Add individual context.
Click Review and save.
Contexts that LaunchDarkly has evaluated within the last 30 days are indicated by a green eye icon.
Target segments
Segments are lists of contexts that you can use to manage AI Config targeting behavior in bulk. You can target segments to release specific AI Config variations to different groups of contexts or end users at once.
We recommend using a segment when you want to target the same group of contexts in multiple AI Configs. You can target the segment in each AI Config, rather than recreating a targeting rule or set of rules for many AI Configs.
To target segments:
Navigate to the Targeting tab for the AI Config.
At the top of the tab, select the environment for which you want to create targeting rules. Targeting rules are specific to each environment.
To add targeting rules to an environment that’s not shown, click the + icon to add another environment to the Targeting tab.
Click the + button between existing rules, and select Target segments.
If the AI Config is off and the rules are hidden, click View targeting rules.
(Optional) Enter a name for the rule.
In the Operator menu, select whether you want contexts in these segments or not in these segments to match the targeting rule.
In the Segments menu, enter or select the segments you want to target.
(Optional) Click the + to add additional clauses to your targeting rule.
From the Select… menu, select the variation to serve, or set a percentage rollout.
Click Review and save.
Here is an example of a targeting rule for segments:

A targeting rule for segments.
To reference this rule when working with other members of your organization, click the three-dot overflow menu and choose Copy link to rule.
To learn more, read Segments.
Target contexts with custom rules
You can create custom targeting rules using any context kinds and any context attributes.
To create a custom targeting rule:
Navigate to the Targeting tab for the AI Config.
At the top of the tab, select the environment for which you want to create targeting rules. Targeting rules are specific to each environment.
To add targeting rules to an environment that’s not shown, click the + icon to add another environment to the Targeting tab.
Click the + button between existing rules, and select Build a custom rule.
If the AI Config is off and the rules are hidden, click View targeting rules.
(Optional) Enter a name for the rule.
Select an option from the Context kind menu:
Choosing a specific context kind lets you target on attributes for contexts of that kind.
Choosing “Context kind” lets you target one or more context kinds. If you choose “Context kind,” skip to step 7.
Context kinds are included in this menu after either you create them from the Contexts list or customize an AI Config using a LaunchDarkly AI SDK.
In the Attribute menu, select one of this context’s attributes.
In the Operator menu, select the operator for your clause.
In the Values menu, enter one or more values to check against.
(Optional) Click the + to add additional clauses to your targeting rule.
From the Select… menu, select the variation to serve, or set a percentage rollout.
Click Review and save.
If a targeting rule references any context kinds or attributes with null values, or that do not exist for a given context, then the AI Config skips that rule. For example, in a rule that checks “region is one of Canada,” any context whose region attribute is not set or is set to null does not match the rule. Similarly, in a rule that checks “region is not one of Canada,” any context whose region attribute is not set or is set to null does not match the rule. This behavior ensures that your rules only target contexts for which you explicitly have attribute information.
To reference this rule when working with other members of your organization, click the three-dot overflow menu and choose Copy link to rule.
To learn more about how to construct targeting rules, read About targeting rules. Although that topic applies specifically to feature flag targeting, the “About targeting rules” section discusses the components of targeting rules, including their descriptions, conditions, rollouts, attributes, and operators. These elements are common to both feature flags and AI Configs.
Set the default rule
Each AI Config automatically includes a default rule. It describes which AI Config variation should be served to contexts that don’t match any of the previous targeting rules on the AI Config.
The default rule is different from the fallback value, which is set in your application’s code and is the value that contexts receive if your application can’t connect to LaunchDarkly. To learn more, read Fallback value.
The default rule is also different from the off variation, which is the value LaunchDarkly serves when the flag is off. To learn more, read The off variation, below.
To set the default rule:
Navigate to the Targeting tab for the AI Config.
At the top of the tab, select the environment for which you want to create targeting rules. Targeting rules are specific to each environment.
To add targeting rules to an environment that’s not shown, click the + icon to add another environment to the Targeting tab.
Find the last rule on the Targeting tab, which is labeled “Default rule.”
If the AI Config is off and the rules are hidden, click View targeting rules.
Click Edit to configure the default rule to serve a specific variation, or apply a percentage rollout to any remaining contexts.
Here is an image of a default rule:

An AI Config's default rule.
The off variation
Each AI Config has a special “disabled” variation, which is created automatically. It is served when the AI Config is toggled off.
Monitor AI Configs
Overview
This topic explains how to monitor the performance of your AI Configs. Performance metrics for AI Configs are available in the LaunchDarkly user interface if you track AI metrics in your SDK.
Collect data for AI Config variations
Data appears on the Monitoring tab for an AI Config when you record metrics from your AI model generation. For each AI SDK, the function to record metrics takes a completion from your AI model generation, so you can make the call to your AI model provider and record metrics from model generation in one step. You can record duration, token usage, generation success and error, time to first token, output satisfaction, and more.
To learn how, read Tracking AI metrics. For a detailed example, refer Step 4 in the Quickstart for AI Configs.
Monitor an AI Config
To monitor the performance of an AI Config:
Navigate to the detail page for the AI Config. Select the Monitoring tab.
At the top of the tab, use the controls to specify the monitoring data you want to view:
Use the Environment dropdown to select the environment you want to monitor. Performance metrics are specific to each environment.
Select a date range.
Use the Charts dropdown to select which set of charts to view.
Review charts of the available monitoring data. The data in each chart applies to the selected environment and is split out by variation:
The Tokens charts show include average input and output tokens used by the AI Config in this environment, by variation.
The Satisfaction chart is the percentage of “thumbs up” ratings provided by end users who have encountered the AI Config in this environment, by variation.
The Generations is the average number of successful generations completed using the AI Config in this environment, by variation.
The Time to generate is the average duration per generation. In other words, this is the total duration of calls to your LLM provider divided by the number of total generations using the AI Config in this environment, by variation.
Error rate is the percentage of errors out of the total number of generations attempted for the AI Config in this environment, by variation.
Time to first token is the mean time it takes to generate the initial token.
Costs charts show the sum of the input token cost and output tokens cost used by the AI Config in this environment, by variation.
Review the table of available monitoring data. The table includes the data displayed in the charts as well as additional data. For example, the table includes both the average and the total input and output tokens.
(Optional) In the table, select the variations or versions for which you want to view data. The charts update based on your selection.
(Optional) Click Export data as CSV to download a CSV file for further analysis.
For the data on the Monitoring tab to appear, you must record the metrics in your application, using a track call from any of the LaunchDarkly AI SDKs. To learn more, read Tracking AI metrics.
The data on the Monitoring tab updates approximately each minute. For each metric, the results are broken out by AI Config variation. Metrics with no results display “No data.” If there is no data for a particular variation, that variation is not included in the total displayed at the top of the metric card.
Here is a partial image of the Monitoring tab:

The "Monitoring" tab for an AI Config.
Manage AI Configs
Overview
This topic explains how to view and manage AI Configs.
All of your AI Configs within a project appear on the AI Configs list. Creating a new AI Config adds it to the list and all environments within your project, and deleting an AI Config removes it from the list and all environments within your project.

You can also use the REST API: List AI Configs
To learn how to create a new AI Config, read Create AI Configs.
View AI Configs
Use the search bar to find an AI Config by name, key, or description. By default, the most recently created AI Configs appear first.
Filter AI Configs
You can filter the list of AI Configs to view only those that share a particular, project-wide attribute. To filter your AI Configs, use the Filters menu at the top of the AI Configs list:

The filter menu for project-wide AI Configs attributes.
Within a project, you can filter by:
Tags
Maintainer
Creation date
To filter your AI Configs:
Click Filters.
Choose an attribute for a filtering option. The AI Configs list automatically updates.
(Optional) Click Filters again and choose an additional attribute. Repeat as many times as needed.
Remove filters
To clear filters, click Filters, then click Clear.
Sort AI Configs
You can sort the list of visible AI Configs by creation date, by name, or by last modified date. To sort the AI Configs list, click Sort and choose a sorting option:

The "Sort" option on the AI Configs list.
Delete AI Configs
You can delete an AI Config when you no longer need it.
If you delete an AI Config, its targeting rules will be deleted. Should it be requested again, the fallback value defined in code will be returned for all contexts. Remove any references to the AI Config from your application code before you delete it.
Deleted AI Configs are gone forever
If you delete an AI Config, you cannot restore it. Be absolutely certain you do not need an AI Config anymore before you delete it.
To delete an AI Config:
Navigate to the detail page for the AI Config you want to delete.
In right sidebar, click the trash can icon to open the “Delete this AI Config?” dialog.
Click Delete AI Config.
The AI Config is deleted permanently.

You can also use the REST API: Delete AI Config
Run experiments with AI Configs
Overview
This topic introduces the role of AI Configs in LaunchDarkly Experimentation. LaunchDarkly’s Experimentation feature lets you measure the effect of features on end users by tracking metrics your team cares about. By connecting metrics you create to AI Configs in your LaunchDarkly environment, you can measure changes in customer behavior based on the different AI Config variations your application serves. This helps you make more informed decisions and ensures that the features your development team ships align with your business objectives.
Monitoring and Experimentation
Each AI Config includes a Monitoring tab in the LaunchDarkly user interface (UI). This tab displays performance data if you track AI metrics in your SDK, such as input and output tokens or total call duration to your LLM provider. To learn more, read Monitor AI Configs.
In contrast, Experimentation lets you measure how your application changes affect end user behavior, based on signals like page views and clicks. For example, you might use the Monitoring tab of an AI Config to identify which variation consumes the fewest output tokens. But to determine which variation results in the most clicks in your chatbot, you need to run an experiment.
To get started with Experimentation in the context of AI Configs, explore the following resources:
Experimentation reference
Metrics reference
Experimentation guides, including best practices and background on statistical methods
AI Configs and information privacy
Overview
This topic describes how the LaunchDarkly AI Configs product treats personally identifiable information (PII).
Privacy and PII in LaunchDarkly
End-user data is information about your customers that your application sends to LaunchDarkly as part of a context. End user data can include personally identifiable information (PII), including names, email addresses, or other unique identifiers, depending on how you define your context attributes.
The AI Configs product works similarly to LaunchDarkly feature flags with respect to personally identifiable information (PII) in end-user data. Specifically:
We recommend that you use private attributes when you target on personally identifiable information (PII) or other sensitive data. To learn more, read Minimizing LaunchDarkly’s access to end user data.
If your organization prohibits sending PII to AI providers, then you must take care not to include PII in any of the context attributes that you reference in the messages in your AI Config variations. LaunchDarkly does not have guardrails that prevent you from sending PII from your application to LaunchDarkly, or from LaunchDarkly to a third party, such as an AI model.
LaunchDarkly and AI models
LaunchDarkly is not integrating directly into the response from any AI provider.
When you work with AI Configs, LaunchDarkly does not send any information you provide to any AI provider or model, and does not use any information you provide as part of an AI Config to fine-tune any models. This includes information you provide when you create an AI Config and its variations, as well as the information you provide in context attributes.
If you use variables within your AI Config variation messages, either from a context attribute or directly from your application, LaunchDarkly substitutes the values of those variables into the message. If your organization prohibits sending PII to AI providers, then you must take care not to include PII in any of the variables that you reference in the messages in your AI Config variations.
Contexts
Overview
This category has documentation topics about LaunchDarkly contexts.
Most, but not all, LaunchDarkly SDKs support contexts. Some older SDKs rely on legacy user objects. To learn which SDKs are available to use with contexts, read SDKs.
About contexts
LaunchDarkly contexts are data objects that represent users, devices, organizations, and other entities. Feature flags use these contexts during evaluation to determine which variation to use, based on your flag targeting rules. Each context contains attributes that describe what you know about that context, such as their name, location, device type, or organization they are associated with.
You can manage how contexts interact with your app by targeting flag variations to specific contexts, based on their context attributes. When a flag is evaluated, LaunchDarkly uses the provided context to determine which variation of the flag to serve. This is known as the evaluation context. You can be as specific as targeting a flag to a single end user, or as broad as targeting your entire customer base. You can even use anonymous contexts and private attributes to control what data to include or exclude in the information you collect about your end users.
Only the context attributes you provide are available for targeting
The SDK only evaluates flags based on the context you provide in the evaluation call. You must provide all applicable attributes for each evaluation in the SDK for your targeting rules to apply correctly. To learn more, read Evaluating flags.
Example context: Anna at Global Health Services
As an example, let’s assume Anna is one of your end users. She is a doctor who works for a hospital chain called Global Health Services. Anna has two mobile devices, an Android phone and an iPad tablet. Anna uses your application on both devices as part of her work.
Given this information, you may know the following things about Anna:
her name, email, and job function (“doctor”),
her organization’s name (“Global Health Services”),
her device’s type (“iPad”)
Here is an example of what the data structure for Anna’s context object might look like. Each SDK sends context data to LaunchDarkly in a slightly different format, but the core structure includes a kind, a key, and one or more attributes:
Example user context
{
 "kind": "user",
 "key": "user-key-123abc",
 "name": "Anna",
 "email": "anna@globalhealthexample.com",
 "organization": "Global Health Services",
 "jobFunction": "doctor",
 "device": "iPad"
}

Context kinds
Each context has one kind with a unique set of corresponding attributes that you can use for flag targeting and other features.
The most common context kind is user. Contexts of the user kind often represent individual people and include attributes such as “name,” “email address,” or “location.” However, you can create other context kinds like organization or device. Contexts of an organization kind might include attributes like “name” or “address”, and the context of a “device” kind might include attributes like “type” or “operating system.”
To learn more, read Context kinds.
Related content
Here are the topics in this category:
The Contexts list
Context kinds
Context attributes
Multi-contexts
Anonymous contexts
The Contexts list
Overview
This topic explains what the Contexts list is, how it is populated, and how to use it.
The Contexts list shows you contexts that have encountered feature flags in your application, with two exceptions:
The list does not display anonymous contexts.
In high-volume environments, the list includes a significant sample of the contexts, but is not comprehensive. To learn more, read Context storage, below.
You can select any context to view its context detail page, which gives you a summary view of how the context experiences all of the features in your app, and lets you customize their experience from one screen. To learn more, read The context details page.
About the Contexts list
The Contexts list populates automatically when different contexts encounter a feature flag and are evaluated by a LaunchDarkly SDK. The data in the list is populated from the data you send in variation calls, as well as data from identify calls. To learn more about contexts and attributes, read Context attributes.

Try it in your SDK: Evaluating flags
Here is an image of the Contexts list:

The "Contexts" list.
Multi-contexts appear individually in the Contexts list
Your application may evaluate a feature flag for a multi-context, that is, one that contains multiple context kinds. For example, your application may send a multi-context that contains the “user,” “organization,” and “device” context kinds, all in one evaluation call in the LaunchDarkly SDK. When you do this, all three individual contexts appear separately in your Contexts list. You can use the context kind filters to search for them separately.
From the list, you can filter contexts by name, kind, or attribute. To learn how, read Filtering the Contexts list.
Create contexts
You cannot create contexts from the Contexts list in the LaunchDarkly user interface (UI). The list only includes contexts that have already been evaluated by a LaunchDarkly SDK.

Configure your SDK: Context configuration
Send the context name in the variation call
You must send the context name in the variation call in the LaunchDarkly SDK for the name to display in the LaunchDarkly UI. To learn more, read Context attributes.
To learn how to create context kinds, read Create context kinds.
Sort the Contexts list
You can sort the Contexts list to identify the oldest or most recent contexts evaluated in your LaunchDarkly account. By default, the most recently active contexts appear first. Click the toggle arrow on the “Last seen” column to sort the list by least recently active contexts.
If a context is re-evaluated, and its attributes change within five minutes of the previous evaluation, and the context key stays the same, the list deduplicates the context and does not reflect the latest evaluation. This does not affect variation calls, which always use the attribute values passed to them.
The SDK does not use the attributes on the Contexts list to evaluate flags
The SDK only evaluates flags based on the context you provide in the evaluation call. The SDK does not use the attributes shown on the Contexts list, and context attributes are not synchronized across SDK instances. You must provide all applicable attributes for each evaluation in the SDK for your targeting rules to apply correctly. To learn more, read Evaluating flags and Context configuration.

You can also use the REST API: Get contexts, Get context instances
To learn how to retrieve expected flag variations for contexts programmatically, read How to use REST API to fetch variations served by a flag.
Customize the Contexts list
You can customize which attributes appear on the Contexts list. To start, click the Attributes button:

The "Attributes" menu on the "Contexts" list.
The Attributes menu lets you choose attributes to appear on the Contexts list. After you choose specific attributes, that view persists when you visit the list in the future.
You can also filter the context list and save filtered lists. To learn how, read Filtering the Contexts list.
Modify feature flags for a context instance
Click a context to manage the feature flags that apply to it, view the context instances that have encountered your flags, view the segments that the context is in, and view a full list of context attributes. To learn more, read The context details page.
Context storage
The Contexts list shows only cached context information. A context will appear on the list for 30 days after an SDK sends an identify event or evaluates a feature flag for that context. Each time an SDK sends a new event for the context, the 30-day period starts over.
After 30 days with no new identify or flag evaluation events, contexts age out of the system and their information no longer appears on the list. After a context ages out of the system, it will reappear on the list if an SDK sends an identify or flag evaluation event for it again.
If you want to keep contexts on the list for longer than 30 days between flags sending identify or flag evaluation events, you can manually call identify for all of the contexts that you wish to retain.
In high-volume environments, events may be sampled. This means the Contexts list includes a significant sample of the contexts that have encountered feature flags in your application, but is not comprehensive.

Try it in your SDK: Identifying and changing contexts
Each environment in your account is limited to 3,000,000 context instances for a given 30-day period. If you reach this context instance limit, flag evaluations will still work for new contexts. However, LaunchDarkly will begin deleting the oldest context instances on the list to make room for new context instances, even if they are not yet more than 30 days old. LaunchDarkly continues to delete old context instances as new ones are added to keep the list at no more than 3,000,000.
To learn more about how you might exceed the 3,000,000 context limit when using anonymous contexts, read Context account limits.
If you want to increase this limit, start a Support ticket.
Remove a context instance
You can delete individual context instances from the Contexts list by clicking the overflow menu and choosing “Delete instance.” Deleting a context instance deletes all versions of that instance.
The overflow menu only appears if there is exactly one context instance, due to the risks of deleting multiple instances at once.
You can also delete context instances from the context details page. To learn how, read Delete context instances.
To learn more about context instances, read Context instances.
Filtering the Contexts list
Overview
This topic explains how to filter contexts on the Contexts list. You can filter contexts on the Contexts list by context kind, name, key, or attribute.
Filter contexts
To filter contexts:
Click the filter icon and filter the list by context kind or attribute:

The "Filter by" dialog on the "Contexts" list.
Alternatively, in the filter field, enter all or the beginning of a context kind, name, key, or attribute.
To filter by an attribute for a specific context kind, separate the context kind and its attribute with a period (.). For example, to search the “state” attribute of “user” contexts, use user.state.

A search query for "user" context kinds.
Press enter. Only contexts with matching attribute values now display on the Contexts list.

You can also use the REST API: Search for contexts, Search for context instances
Advanced filter strings
In addition to filtering by context kind, name, or attribute, you can create advanced filter strings to search for specific values in specific fields.
This table contains examples of advanced filter strings and what they search for:
Filter string
Description
location equals Springfield
Searches for all context kinds for a location attribute with the value of “Springfield”
organization.location anyOf [“Springfield”,“Midway”]
Searches for all organization contexts that have a location attribute with the value of “Springfield” or “Midway”
device.type startsWith “Samsung”
Searches for all device contexts that have a type attribute that starts with “Samsung”

Elements of a filter string
A filter string contains three elements:
Field: The field is the first part of the filter string. It is a field in the contexts that you want to filter based on.
If you’re searching an attribute for a specific context kind, separate the context kind and its attribute with a period (.).
Field names are always strings. If they appear within double quotes ("), then they are encoded as if they were a JSON string. Unquoted strings must escape commas ,, pipes |, parentheses (), exclamation points !, slashes \, and whitespace by prefixing the character with \.
Operator: The operator is the second part of the filter string. It describes the conditions by which the filter identifies the match value. To learn about all of the available operators, view the “Operators” table below.
Match value: The match value is the third part of the filter string. It describes the values that the filter will identify.
A match value must be formatted as a JSON value or an unquoted string.
Unquoted strings must escape commas ,, pipes |, parentheses (), exclamation points !, slashes \, and whitespace by prefixing the character with \.
Operators
This table lists all of the available operators and related examples:
Operator
Description
Example
after
Returns true if any of the values in a field, which should be dates, are after or equal to the provided datetime. Valid match values should be numbers in unix epoch milliseconds, or date time strings in RFC-3339 format.
user.signup after “2022-09-21T19:03:15+00:00”
anyOf
Returns true if any of the values in a field match any of the values in the match value. This operator is only available for the following fields: applicationId, id, key, kind, kindKey, kindKeys.
applicationId anyOf [44]
kind anyOf [“device”,“org”]
key anyOf [1,2,3,4]
before
Returns true if any of the values in a field, which should be dates, are before or equal to the provided datetime. Valid match values should be numbers in unix epoch milliseconds, or date time strings in RFC-3339 format.
user.signup before “2022-09-21T19:03:15+00:00”
contains
Returns true if all the match values are also found in the values of the field. This operator is only available for the following fields: kindKeys, kinds.
kindKeys contains [“Sandy”,“Jesse”]
kinds contains [“s”]
equals
Returns true if there is an exact match on the entire field.
organization.number equals 44
”kind” equals “device”
device.option equals true
organization.number equals [1,2,3,4]
user.name equals [“Sandy”, “Jesse”]
exists
Returns true if the field matches the specified existence. For example, if you pass true and the field exists, this returns the context. This operator is available for name and for custom attributes.
organization.name exists true
device.option exists false
notEquals
Returns true if there is not an exact match on the entire field.
organization.number notEquals 44
”user.name” notEquals Sandy
device.option notEquals true
organization.number notEquals [1,2,3,4]
user.name notEquals [“Sandy”, “Jesse”]
startsWith
Returns true if the value in a field, which should be a singular string, begins with the provided substring.
user.name startsWith San
device.os startsWith “iOS”

Save filtered contexts lists
You can create shortcuts to filtered contexts lists, and save them in the left sidenav to return to at any time. When you create a shortcut, it is only visible to you.
To create a shortcut to a filtered contexts list:
Navigate to the Contexts list.
Add your desired environments to the Contexts list following the instructions in Open environments.
Add any context filters you need such as kind or attribute.
Click the bolt icon above the Contexts list to create a shortcut:

The Contexts list with the bolt icon called out.
Add a Name for your shortcut.
(Optional) Choose an Icon to represent your shortcut in the left sidenav.
Click Save.
Your shortcut appears in the left sidenav.

A list of shortcuts in the left sidenav.
The context details page
Overview
This topic explains what the context details page is. The context details page gives you a detailed view of a context and lets you customize its experience from one screen.
To open the details page for a context, click on the context name from the Contexts list.
This is an example of a multi-context details page:

The details page for a multi-context.
Attributes
The “Attributes” section displays all of the context attributes associated with the selected context instance version. A context instance version is a context instance that’s recorded from a unique source application or LaunchDarkly SDK. It includes only the context attributes you provide in the evaluation call. To learn more, read Context instances.
This illustration shows a flag evaluating two instance versions of the same context:

Two instance versions of the same context.
To view attributes from a different context instance version, choose a different version from the “From source” menu:

The "From source" menu with two context instance versions displayed.
To learn more, read Context attributes.

You can also use the REST API: Get context attribute names, Get context attribute values
Segments
The “Segments” section lists any segments the context is a part of. Click on the segment name to open the segment’s details page. To learn more, read Segments.
Instances
The “Instances” section lists the instances in which the context has appeared, and when LaunchDarkly last encountered each instance:

The "Instances" section with two instances.
Click on an individual instance name to open the instance details page. The instance details page lists the context kinds, attributes, segments, and expected flag variations for that particular context instance. To learn more, read Context instances.

You can also use the REST API: Get context instances
Delete context instances
To delete a context instance:
From the Contexts list, click on the name of the context with an instance you want to delete. The context details page opens.
In the “Instances” section, click on an instance. The instance details page opens.
Click Delete:

A context instance detail page with the "Delete" button called out.
Deleting a context instance deletes all versions of that instance. Deleting context instances from the Contexts list does not decrease your account usage.

You can also use the REST API: Delete context instances
Expected variations
The “Expected variations” section lists the variation you can expect that context instance to receive for each flag or AI Config within your current project and environment.

The "Expected variations" on the details page for a context.
For each flag, you can use your SDK’s flag evaluation reason feature to get more information about the flag variations LaunchDarkly serves.

Try it in your SDK: Flag evaluation reasons
Modify variations for a context
You can modify the variation a context receives for a feature flag or an AI Config. To do this:
Find the “Entity name” you want to modify in the “Expected variations” section.
Select a new variation from the Variation menu next to the flag:

The "Expected variations" section with a variation called out.
(Optional) To remove individual targeting, either:
change to the variation from the Variation dropdown, or
click the “Evaluation reason” link to remove the individual target from the flag’s Targeting tab.
Click Save changes.
Targeting changes are only available for individual contexts.
You cannot make targeting changes to context instances with multiple contexts. That option is not available on the instance details page with multiple contexts.
Context instances
Overview
This topic includes information about context instances. Contexts are people, services, machines, or other resources that encounter feature flags in your product.
We refer to any unique combination of one or more contexts that have encountered a feature flag as a context instance.
Example context: Anna at Global Health Services
For example, suppose a hospital’s employee app uses organization, device, and user contexts. When Anna from Global Health Services logs into your application from her Android in Springfield, that’s recorded as one instance. When Anna logs into your app from her iPad in Midway, that’s recorded as second instance. Even though Anna’s user context appears in both, LaunchDarkly considers these two different context instances because they contain different combinations of context keys.
The two context instances are the combination of their associated contexts:
Anna, Springfield, Android device
Anna, Midway, iPad
Here is an example of what the data structure might look like for these two context instances, though each SDK sends context data to LaunchDarkly in a slightly different format:
Two context instances
// The first context instance
{
 "kind": "multi",
 "user": {
   "key": "user-key-123abc",
   "name": "Anna",
   "email": "anna@globalhealthexample.com",
   "jobFunction": "doctor"
 },
 "organization": {
   "key": "org-key-123abc",
   "name": "Springfield Global Health Services",
   "address": {
     "street": "123 Main Street",
     "city": "Springfield"
     }
 },
 "device": {
   "key": "device-key-123abc",
   "name": "Pixel 7",
   "os": "Android 13"
 }
}


// The second context instance
{
 "kind": "multi",
 "user": {
   "key": "user-key-123abc",
   "name": "Anna",
   "email": "anna@globalhealthexample.com",
   "jobFunction": "doctor"
 },
 "organization": {
   "key": "org-key-456def",
   "name": "Midway Global Health Services",
   "address": {
     "street": "456 1st Ave",
     "city": "Midway"
     }
 },
 "device": {
   "key": "device-key-456def",
   "name": "iPad",
   "os": "iOS"
 }
}

A context appearing alone, without any other associated contexts, is also considered a context instance.
For example, this stand-alone context and this multi-context also represent two context instances:
Two context instances
// The first context instance
{
 "kind": "user",
 "key": "user-key-123abc",
 "name": "Anna",
 "email": "anna@globalhealthexample.com",
 "jobFunction": "doctor"
}


// The second context instance
{
 "kind": "multi",
 "user": {
   "key": "user-key-123abc",
   "name": "Anna",
   "email": "anna@globalhealthexample.com",
   "jobFunction": "doctor"
 },
 "organization": {
   "key": "org-key-456def",
   "name": "Midway Global Health Services",
   "address": {
     "street": "456 1st Ave",
     "city": "Midway"
     }
 },
 "device": {
   "key": "device-key-456def",
   "name": "iPad",
   "os": "iOS"
 }
}

Context instance versions
Two different SDKs might encounter the same context, as defined by their unique combination of kind and key, with different context attributes. Because they have the same unique combination of kind and key, the contexts are not considered separate contexts or separate context instances. Instead, they are two different versions of the same context instance.
For example, depending on how your application is set up, LaunchDarkly may record one or more context instance versions each time Anna logs in. If your application uses both the Android SDK and the JavaScript SDK in different places, and Anna logs in from both places, then you’ll see two different context instance versions: one from Anna from the Android SDK, and another from Anna from the JavaScript SDK.
This illustration shows example contexts, context instances, and context instance versions:

An example of associated contexts, context instances, and context instance versions.
You can view context instances, context instance versions, and expected flag variations on the Context details page.
Here is what Anna’s context details page would look like. Two instances display in the “Instances” section, and this context instance version is from “JSClient”:

An image of the context details page.
To learn more, read The context details page.
Context kinds
Overview
This topic explains what context kinds are and how to use them. Context kinds let you group context attributes together conceptually. When you create individual targets or add targeting rules for a flag or a segment, the available context attributes are organized by context kind.
To learn how to create and manage context kinds, read Creating and editing context kinds and Archiving context kinds.
About context kinds
Contexts are people, services, machines, or other resources that encounter feature flags in your product.
Each context has one or more context kinds that you can use to categorize context instances for targeting and Experimentation.
The most common context kind is user. User contexts often include context attributes like name, email address, location, and so on. However, you can create other context kinds like organization or device. An organization context kind might include attributes like “name” or “address,” and a device context kind might include attributes like “type” or “operating system.”
Example context: Anna at Global Health Services
Anna is a doctor who works for a hospital chain called Global Health Services. Anna has two mobile devices, an Android phone and an iPad tablet. Anna uses your application on both devices as part of her work.
We can describe the information about Anna using three different context kinds:
her name, email, and job function (“doctor”) are part of a “user” context,
her organization’s name (“Global Health Services”) and address are part of an “organization” context,
her device’s type, operating system, and device ID are part of a “device” context.
Here is an example of what the data structure for a user, an organization, and a device context object might look like, though each SDK sends context data to LaunchDarkly in a slightly different format:
Example organization and device contexts
// a user context
{
 "kind": "user",
 "key": "user-key-123abc",
 "name": "Anna",
 "email": "anna@globalhealthexample.com",
 "jobFunction": "doctor"
}


// an organization context
{
 "kind": "organization",
 "key": "org-key-123abc",
 "name": "Global Health Services",
 "address": {
   "street": "123 Main Street",
   "city": "Springfield"
 }
}


// a device context
{
 "kind": "device",
 "key": "device-key-123abc",
 "type": "iPad",
 "operating_system": "iPadOS 15",
 "deviceId": 12345
}

Create new context kinds
When you create a new context kind, you provide only a name, key, and description. When your SDKs send a context object of that kind to LaunchDarkly, any attributes the SDK sends are automatically stored with the context.
You do not need to define any context attributes associated with a context kind when you create it. Instead, your SDK will send context attributes to LaunchDarkly along with the context object. To learn more, read Context attributes.
Context kinds are specific to LaunchDarkly projects. After you create them in a project, they are available in any of the environments within that project.
To learn how to create context kinds, read Creating and editing context kinds.
Grouping context kinds together into multi-contexts
You can combine multiple contexts of different kinds together into a multi-context. Multi-contexts allow you to evaluate different, but related, contexts together.
For example, using multi-contexts a flag could target all doctors (a user context kind) using iPads (a device context kind) in Springfield (an organization context kind). To learn how, read Multi-contexts.
Built-in context kinds
The only built-in default context kind is user. This is the context kind targeting rules use by default and, if you use Experimentation, the default randomization unit for experiments.
Automatic environment attributes enable additional built-in context kinds
If you enable automatic environment attributes in a mobile SDK, the built-in context kinds ld_device and ld_application also become available after your SDK begins sending this information to LaunchDarkly. To learn how to enable automatic environment attributes, read Automatic environment attributes.
Context keys
Each context has a key. Each combination of kind and key must be unique across all your contexts. Other context attributes can be strings, booleans, numbers, arrays, or JSON objects. When you evaluate a feature flag within your application, the flag’s targeting rules use information from one or more kinds of contexts. When you build your targeting rules, the attributes are automatically organized by context kind. To learn more, read Target with flags.
When you use the LaunchDarkly SDK to evaluate a flag, you provide an evaluation context to that call.

Configure your SDK: Context configuration, Evaluating flags
After different contexts encounter your application, you can view them on the Contexts list. To learn more, read The Contexts list.
Viewing context kinds
Overview
This topic explains how to view context kinds in LaunchDarkly.
View context kinds
You can view and manage the context kinds list by navigating to the Contexts list and clicking the gear icon on the right.
The context kinds list includes all of the built-in and manually created context kinds within your project.

The context kinds list.
Each context kind description includes:
The kind’s name.
The kind’s creation date.
Whether or not the kind is in use. A context kind is considered in use if an SDK has ever sent a context with this kind to LaunchDarkly.
Whether or not the kind is available for experiments. Available means you can use this context kind as a randomization unit in experiments. To learn more, read Randomization units.
You can filter contexts by selecting the associated context kind in the Contexts list. To learn more, read Filtering the Contexts list.
Contexts appear individually in the Contexts list
Your application may evaluate a feature flag using a multi-context. A multi-context includes multiple context kinds in a single evaluation. For example, your application may send a single multi-context with “user,” “organization,” and “device” context kinds, all in one evaluation call in the LaunchDarkly SDK. When you do this, all three individual contexts appear separately in your Contexts list. You can use the context kind filters to search for them separately.
You can view the context kind for a particular context on the context details page, in the “Attributes” section. You can view the context kind for a context instance on the instance details page, in the “Attributes” section. To learn more, read The context details page.

You can also use the REST API: Get context kinds
Archived context kinds
Archived context kinds are automatically hidden from the list. To display them, select the Show archived checkbox.

The context kinds list with the "Show archived" checkbox called out.
Creating and editing context kinds
Overview
This topic explains how to create and edit context kinds.
Create context kinds
Creating context kinds requires specific permissions
You can only create new context kinds in the LaunchDarkly user interface (UI) if have a role that allows the createContextKind action. The LaunchDarkly Project Admin, Maintainer, and Developer project roles, as well as the Admin and Owner base roles, all have this ability. To learn more, read About member roles and Context kind actions.
You can create context kinds in the LaunchDarkly UI, or automatically when you evaluate a context using a LaunchDarkly SDK.
To create a context kind in the LaunchDarkly UI:
Navigate to the Contexts list.
Click the gear icon on the right. The context kinds list appears.
Click Add kind.
The “New context kind” dialog appears.
Enter a Name for the context kind. This appears in the context kind list, and as a filter option in the Contexts list.
Enter a Key for the context kind. You cannot change this later. It appears in the Contexts list and on the context details page in the “Attributes” section.
(Optional) Enter a Description for the context kind.
(Optional) Check the Available for experiments checkbox if you want to be able to use this context kind as a randomization unit in experiments. To learn more, read Randomization units.
Select an industry-standard randomization unit to map the context kind to.
(Optional) Check the “Set as the default for experiments” checkbox if you want new experiments to default to this context kind as the randomization unit.
Context kinds available for experiments must use valid randomization units
Using invalid randomization units will result in invalid experiment results. To learn more, read Randomization units. If you’re unsure of which randomization unit to use, start a Support ticket to get help determining valid context kind selections.
Click Create kind.
To create a context kind automatically, create a context object in your LaunchDarkly SDK. When you evaluate a flag for the context, LaunchDarkly automatically creates a new context kind for that context’s kind, if one of the same name does not already exist.

Try it in your SDK: Evaluating flags

You can also use the REST API: Create or update context kind
Edit context kinds
You can edit existing context kinds from the context kinds list by clicking on the pencil icon next to the contest kind you want to edit.
You can edit the name and description of the context kind, but you cannot edit the key.
If you use Experimentation, you can also edit whether the context kind is available for experiments, the standard randomization unit the context kind maps to, and whether the context kind should be the default for experiments. To learn more, read Randomization units.
Archiving context kinds
Overview
This topic explains how to archive and restore archived context kinds.
Archive context kinds
Archiving a context kind makes it unavailable for flag and segment targeting and unavailable for use in experiments.
To archive a context kind:
Navigate to the Contexts list.
Click the gear icon on the right. The context kinds list appears.
Click the pencil icon next to the context kind you want to archive. The “Edit context kind” dialog appears.
Click Archive.
The context kind is now hidden from the contexts kinds list and is not available in flag and segment targeting rules.
Restore archived context kinds
To restore an archived context kind:
Navigate to the Contexts list.
Click the gear icon on the right. The context kinds list appears.
Check the Show archived context kinds checkbox at the top of the context kinds list.
Click the pencil icon next to the context kind you want to restore. The “Edit context kind” dialog appears.
Click Restore.
The context kind displays on the context kinds list and is available for targeting.
Context attributes
Overview
This topic explains what context attributes are, how to configure them, and how LaunchDarkly uses them to evaluate flags and display flag variations to your customers.
About context attributes
Contexts are people, services, machines, or other resources that encounter feature flags in your product.
Each context has a context kind that you can use to categorize context instances for targeting and Experimentation. For example, you may know:
the username, first name, last name, and email address of a person. You might include these context attributes in contexts with a “user” context kind.
the size, region, and location of an office. You might include these context attributes in contexts with an “organization” context kind.
the configuration details of an environment. You might include these attributes in contexts with a “device” context kind.
To learn more, read Context kinds.
A more precise way to refer to a context when you are using it to evaluate a feature flag is an “evaluation context.” An evaluation context is the object that the SDK uses to evaluate a feature flag. It can contain a single context or a multi-context. It includes all of the information about a context that LaunchDarkly can use for a feature flag evaluation. To learn more, read Contexts.
By default, the Contexts list displays a context’s attribute values. If you mark a context attribute as private within your SDK, it will not display in the LaunchDarkly user interface (UI) but you can still use it in flag evaluations. To learn more, read Using private context attributes.
Target based on context attributes
You can use context attributes in targeting rules for flags and segments. For example, imagine you want a flag to serve the Enabled variation to user contexts that have a plan type of Beta tester and are in the segment example segment.
Here is an example of that rule:

A rule with two conditions.
After you have set up the conditions for your rule, you can decide to roll out one variation to all your contexts, or do a percentage rollout across several variations. To learn more, read Target with flags.
View and manage context attributes
By default, SDKs send all of a context’s attributes to LaunchDarkly. This data lets LaunchDarkly determine the expected flag variations for contexts and powers the autocomplete functionality throughout the LaunchDarkly UI. You can change the value of an attribute for a context at any time by sending new attributes values to LaunchDarkly from your SDK.

Try it in your SDK: Identifying and changing contexts
You can access context detail pages from the Contexts list. To learn how, read The Contexts list.
Here is a context details page in the LaunchDarkly UI:

A context's details page.
The SDK does not use the attributes in the Contexts list to evaluate flags
The SDK only evaluates flags based on the evaluation context you provide in the evaluation call. The SDK does not use the attributes shown on the Contexts list, and context attributes are not synchronized across SDK instances. You must provide all applicable context attributes for your targeting rules to apply correctly. To learn more, read Evaluating flags and Context configuration.
Feature flags and AI ConfigsContextsContext attributes
Built-in attributes
Overview
This topic explains what LaunchDarkly’s built-in attributes are and how to configure them.
LaunchDarkly allows you to target contexts based on built-in attributes. To learn more, read Target with flags.
Use built-in attributes
The built-in attributes are kind, key, name, and anonymous. Kind, key, and name attributes must be strings, and anonymous attributes must be booleans. You can define additional attributes for a context by passing in a name and value for each.
The context kind and key are the only mandatory attributes. All other attributes are optional.
Some SDKs will automatically set the kind to “user” if you do not provide a value. Some client-side SDKs will automatically generate the key if the anonymous attribute is set to true.
Here is a table explaining LaunchDarkly’s built-in attributes:
Attribute name
Attribute example value
Notes
kind
”user”
The context kind. Required for evaluation. The combination of kind and key must be unique for each context. You can create context kinds either from the Contexts list or by evaluating a context using a LaunchDarkly SDK.
key
”context-key-123abc”
Required for evaluation. The combination of kind and key must be unique for each context. Some client-side SDKs will generate this for you if anonymous is set to true.
name
”Sandy Smith”
This attribute is optional, but we recommend including it if you need to target flags to individual contexts.
anonymous
true
This attribute is optional. If set, this boolean attribute prevents the context from appearing in the Contexts list. If the anonymous attribute is set to true, LaunchDarkly treats the context as anonymous.

Here is an example of a context with built-in attribute values, though each SDK sends context data to LaunchDarkly in a slightly different format:
A context with built-in attribute values
{
 "kind": "user",
 "key": "user-key-123abc",
 "name": "Sandy"
}

Creating searchable context keys
You can structure your context keys so they are both searchable and unique. To do this, we suggest adding a searchable term to the beginning of the key, followed by a unique ID. For example, if you wanted to easily search users that encountered a specific service, you could structure the key as follows: service_name:uuid.
Alternatively, you can set unique identifiers for contexts in your SDK configuration. To learn more, read Application metadata configuration.
You can view a context’s attributes by clicking on the individual context from the Contexts list.

You can also use the REST API: Get contexts, Search for contexts, Get context attribute names, Get context attribute values
Custom attributes
Overview
This topic explains what custom attributes are and how to configure them.
LaunchDarkly allows you to target contexts based on arbitrary custom attributes, which means you can control who receives features based on any criteria that you send to us.
Here are example contexts containing custom attributes, though each SDK sends context data to LaunchDarkly in a slightly different format:
Contexts with custom attributes
// A single context
{
 "kind": "user",
 "name": "Anna",
 "key": "user-key-123abc",
 "email": "anna@globalhealthexample.com",
 "jobFunction": "doctor"
}


// A multi-context
{
 "kind": "multi",
 "user": {
   "key": "user-key-456def",
   "name": "Jesse",
   "city": "Springfield"
 },
 "organization": {
   "key": "organization-key-123abc",
   "name": "Acme, Inc",
   "city": "Midway"
 }
}

Custom attributes are environment-specific. They are not shared between environments or projects.
There is no limit to the number of custom attributes you can have. However, adding custom attributes does increase the size of the context object. JavaScript-based client-side SDKs send the context during initialization, so a large number of custom attributes may mean it takes longer for the SDK to initialize. To learn more, read Initialize the client.
Create custom attributes
Custom and built-in attributes cannot share names
If you create a custom attribute with a name already in use by a built-in attribute, the SDK will behave unpredictably during feature flag evaluation. For a list of built-in attributes and their names, read Built-in attributes.
You can create custom attributes in two ways:
By configuring them within your SDK, or
by adding them from a flag’s Targeting tab.
Configure attributes within your SDK
When you configure attributes in your SDK, they will appear as an option in targeting rules after the SDK has passed those attributes to LaunchDarkly.

Configure your SDK: Context configuration
Attributes that you have configured in your SDK may not appear in the Contexts list or in a flag’s targeting rules yet for the following reasons:
The SDK has not yet passed events containing the attribute to your current environment in LaunchDarkly.
The SDK sent the events very recently and LaunchDarkly has not processed them yet.
Ad blockers or proxies are preventing the events from reaching LaunchDarkly. If so, the SDK will still evaluate contexts correctly.
Your SDK is not configured to send events to LaunchDarkly.

Configure your SDK: Configuration
Projects and environments do not share custom attributes or values because the SDK key, mobile key, or client-side ID you configured the SDK with is environment-specific. To learn more about configuring these, read the “Getting started” section for your SDK.
Add attributes from a flag’s Targeting tab
To add custom attributes from a flag’s Targeting tab, manually enter the name of the attribute in the “Attribute” field within a targeting rule:

Creating a custom "Location" user context attribute from a flag's "Targeting" tab.
To learn more, read Target with flags.
If you add a custom attribute from a flag’s Targeting tab, flag evaluations won’t be able to use the attribute until you also configure it within your SDK.
Set custom attribute values
The value of a custom attribute can be of the following types:
boolean
number
string
array
JSON object
Null JSON values
null is a valid JSON type, but it is not a valid attribute value in LaunchDarkly. In LaunchDarkly, null is equivalent to the attribute being undefined. For example, in a JSON representation of a context, "name": null is equivalent to omitting the name attribute value completely. This applies to both built-in attributes and custom attributes.
Using private context attributes
Overview
This topic explains how to create targeting rules that target contexts based on attributes that may or may not be stored in LaunchDarkly.
About private context attributes
You may not want to send all attributes back to, or store all attributes in, LaunchDarkly. The security or data protection requirements of your organization may require you to limit what customer data is transmitted to or stored within a third-party platform like LaunchDarkly. For example, you may want to target customers by their personally identifiable information (PII), such as their email address. You can mark the email address attribute as private, but still use it in targeting rules and segments.
You can’t mark attributes as private from within the LaunchDarkly UI. Instead, you must configure them within your SDK.
Configure private attribute settings in your SDK
There are multiple ways you can mark attributes as private:
You can mark an attribute as private across all contexts of any context kind. You might use this if you want to ensure that an “email” attribute is never sent to LaunchDarkly, no matter whether it occurs in a user context, an organization context, or something else.
You can mark an attribute as private within a particular context or context kind. You might use this if you want an “email” attribute to be private in a user context, but not in an organization context.
You can mark some portions of an attribute as private. For example, if you have one attribute for address, you could mark the “street” field of the address attribute as private, but not the “city” field. You can still use all parts of the address in targeting rules, but only the city would appear in the LaunchDarkly UI.
On the context details page, private attributes appear under a _meta section. The values of these attributes are not displayed.
Here is a context details page that includes private attributes:

The "Attributes" section of the context details page, showing private attributes in a "_meta" section.

Configure your SDK: Private attributes
Implications of using private attributes
If a feature flag contains targeting rules that reference private attributes, context pages may not be able to calculate flag settings for your contexts. Each context page indicates when it is unable to calculate flag settings because of private attributes.
When creating a targeting rule, LaunchDarkly cannot autocomplete the values for attributes you have made private.
Using private context attributes
Overview
This topic explains how to create targeting rules that target contexts based on attributes that may or may not be stored in LaunchDarkly.
About private context attributes
You may not want to send all attributes back to, or store all attributes in, LaunchDarkly. The security or data protection requirements of your organization may require you to limit what customer data is transmitted to or stored within a third-party platform like LaunchDarkly. For example, you may want to target customers by their personally identifiable information (PII), such as their email address. You can mark the email address attribute as private, but still use it in targeting rules and segments.
You can’t mark attributes as private from within the LaunchDarkly UI. Instead, you must configure them within your SDK.
Configure private attribute settings in your SDK
There are multiple ways you can mark attributes as private:
You can mark an attribute as private across all contexts of any context kind. You might use this if you want to ensure that an “email” attribute is never sent to LaunchDarkly, no matter whether it occurs in a user context, an organization context, or something else.
You can mark an attribute as private within a particular context or context kind. You might use this if you want an “email” attribute to be private in a user context, but not in an organization context.
You can mark some portions of an attribute as private. For example, if you have one attribute for address, you could mark the “street” field of the address attribute as private, but not the “city” field. You can still use all parts of the address in targeting rules, but only the city would appear in the LaunchDarkly UI.
On the context details page, private attributes appear under a _meta section. The values of these attributes are not displayed.
Here is a context details page that includes private attributes:

The "Attributes" section of the context details page, showing private attributes in a "_meta" section.

Configure your SDK: Private attributes
Implications of using private attributes
If a feature flag contains targeting rules that reference private attributes, context pages may not be able to calculate flag settings for your contexts. Each context page indicates when it is unable to calculate flag settings because of private attributes.
When creating a targeting rule, LaunchDarkly cannot autocomplete the values for attributes you have made private.
Multi-contexts
Overview
This topic includes information about multi-contexts. Contexts are people, services, machines, or other resources that encounter feature flags in your product. Multi-contexts are combinations of several context kinds into one context. Multi-contexts allow your feature flags to target entities based on data from multiple contexts. For multi-contexts, the context kind is set to multi.
This is a representation of what two multi-contexts might look like:

Two multi-contexts with three contexts each of "user," "organization," and "location."
Example multi-context: Anna at Global Health Services
For example, imagine Anna is a doctor who works for a hospital chain called Global Health Services. Anna works at two different locations, Springfield and Midway. Jesse is a nurse that works with Anna at the Springfield location.
Maybe you want to serve one variation of a flag to doctors working at the Global Health Services Springfield location, and a different variation to nurses at the Springfield location, and you want to serve a third variation to doctors at the Midway location. In this situation, you can have the LaunchDarkly SDK send multiple contexts at once during the flag evaluation, so that LaunchDarkly can evaluate targeting rules using data from both the “user” and “organization” contexts at the same time.
In this example, the multi-contexts contain two associated contexts: one for user, and one for organization.
Here is an example of what the data structure might look like for these two multi-contexts, though each SDK sends context data to LaunchDarkly in a slightly different format:
Example multi-contexts
// Anna's multi-context
{
 "kind": "multi",
 "user": {
   "key": "user-key-123abc",
   "name": "Anna",
   "email": "anna@globalhealthexample.com",
   "jobFunction": "doctor"
 },
 "organization": {
   "key": "org-key-123abc",
   "name": "Global Health Services",
   "address": {
     "street": "123 Main Street",
     "city": "Springfield"
   }
 }
}


// Jesse's multi-context
{
 "kind": "multi",
 "user": {
   "key": "user-key-456def",
   "name": "Jesse",
   "email": "jesse@globalhealthexample.com",
   "jobFunction": "nurse"
 },
 "organization": {
   "key": "org-key-123abc",
   "name": "Global Health Services",
   "address": {
     "street": "123 Main Street",
     "city": "Springfield"
   }
 }
}

This configuration allows you to target the user and organization together to ensure you serve the correct variation. This helps eliminate risk and ensure accuracy in complex deliveries.
The multiple contexts that appear in a multi-context are called “associated contexts.” For example, the Anna user context and the Global Health Services organization context are associated contexts.
Anonymous contexts
Overview
This topic explains what anonymous contexts are, how their information is handled in LaunchDarkly, and how they contribute to your monthly account usage.
You can designate any context as an anonymous context. Anonymous contexts work just like other contexts, except that they don’t appear on your Contexts list in LaunchDarkly. You can’t search for anonymous contexts on your Contexts list, and you can’t search or autocomplete by anonymous context keys. Anonymous contexts still count toward your limit for monthly contexts or monthly active users (MAU).
Here is an example of an anonymous context:
An anonymous user context
"context" = {
 "kind": 'user',
 "anonymous": true,
 "key": 'anon-user-key-123abc' // some SDKs will generate this for you
}

Designating anonymous contexts prevents unauthenticated users from diluting useful data on user contexts in the Contexts list. You can set the key attribute to a unique value for each context. Alternatively, some client-side SDKs can generate a unique, random value for each anonymous context and set the key attribute for you.

Configure your SDK: Anonymous contexts and users
Ensuring customer privacy
You can use anonymous contexts to hide personally identifiable information (PII), but we recommend using private attributes instead. To learn more, read Using private context attributes.
Consider using multi-contexts
On a sign-in page in a single-page app, you could represent the same person as an anonymous user before they log in, and a different user after they log in. You can initialize the client with an anonymous context with a context kind of “user.” After the person logs in, you can update the user context so that it’s no longer anonymous using your SDK’s identify feature.

Try it in your SDK: Identifying and changing contexts
Alternatively, you could use a multi-context, that is, a set of several different contexts that you want to evaluate together. For example, as soon as an end user visits your app, you may initialize the client with a context using a context kind of “device.” When the end user logs in, you now also have their user information. To learn more, read Associate anonymous contexts with logged-in end users.
Context account limits
Each environment in your account is limited to 3,000,000 contexts per 30-day period. You may hit this limit accidentally if you use too many unique keys. If you feel like you hit this limit too frequently, you may be creating more contexts than you realize, including anonymous contexts.
Here are some examples of ways you may unintentionally create unique context keys:
By creating contexts that include request IDs. When you do this, each context generates a new context key every time it requests against the server. Contexts do not need a unique key to use a request ID. For example, an unauthenticated API might only give you a request ID, not a context key.
By creating contexts from server-to-server communication where there are no human operators, just software components interacting.
By using LaunchDarkly to configure log levels or tracing. When you do this, you may use a different type of ID, like a timestamp. LaunchDarkly classifies each of those IDs as unique IDs.
To learn how to delete a context instance, read Remove a context instance.
Manage anonymous contexts
LaunchDarkly identifies all contexts by their unique key, including anonymous contexts. Using unique keys for anonymous contexts allows you to observe anonymous traffic interacting with your application, target anonymous traffic with percentage rollouts, and use Experimentation.
Anonymous contexts can raise your MAU count, but there are actions you can take to manage your MAU when using anonymous contexts. To learn more about MAU, read Account usage metrics.
Store anonymous keys locally
If you provide the anonymous context key yourself, you must ensure that the context uses that same key on each subsequent visit to avoid inflating how many contexts you evaluate.
One strategy to make sure that you’re using the same anonymous context key each time is to store the unique identifier yourself in a cookie or local storage. Because this is such a common strategy, we’ve implemented it directly into many of our client-side SDKs. If you use a client-side SDK and want to use a unique key for your anonymous contexts, you can defer key generation onto the SDK. To do this, build a context object and omit the key completely. The SDK generates a unique identifier for the context and persists this unique identifier in local storage. (LaunchDarkly SDKs do not store information in cookies.) Each subsequent context evaluation without a context key uses that saved unique identifier. Check your SDK’s documentation to confirm whether it will generate a unique key for your anonymous contexts.

Configure your SDK: Anonymous contexts and users
A challenge from using cookies or local storage is that they are optional. End users can turn them off. They are also often not observed by bots and site crawlers.
Wait to initialize your SDK
If you don’t need to expose flags to anonymous contexts, don’t initialize the SDK client for anonymous contexts. Instead, wait to initialize the client until after you know who your audience is. To learn more about SDK client initialization, read the Getting started documentation for your SDK.
Use a shared key between anonymous contexts
Using a shared key prevents the use of some LaunchDarkly features
It is possible to use one, shared key between anonymous contexts. However, we do not recommend this. Using a shared key between anonymous contexts means that percentage rollouts, Experimentation, individual targeting, and other features will be limited or will not work as expected.
Click to expand details on using a shared key






Associate anonymous contexts with logged-in end users
Before they log in, an end user might be represented by a device context. After they log in, they might be represented by two contexts, with one context kind based on their device and the second context kind based on their user information. This one person is now represented by two unique context keys.
If you want to associate two contexts with each other, you should identify a multi-context that includes both individual contexts when you want the association to occur. Unlike the aliasing method, the association doesn’t persist between calls. You must send the contexts you want to associate in each variation or identify call and each track call.

Try it in your SDK: Identifying and changing contexts
Depending on your billing model, you may be billed by MAU. To learn more, read Calculating billing.
Anonymous users and aliasing
If you are not yet using an SDK version that supports contexts, you can associate an anonymous user with a specific, logged-in user using the alias method.
To learn more, read How to use contexts instead of alias.
Click to expand details on the deprecated alias method
Was this page helpful?
YesNo
Previous
Segments
Next
Built with
Anonymous contexts | LaunchDarkly | Documentation
Segments
Overview
This topic introduces the concept of segments. Segments let you target groups of contexts individually or by attribute.
Segments are useful for keeping groups of contexts up to date. They let you more quickly turn features on or off for certain groups with confidence. For example, segments are helpful when you want to target a specific group of customers, like beta-users or enterprise-customers, across many different flags, or in an experiment. Like contexts, segments are environment-specific.
We recommend using tags on your segments to help you understand quickly which segments are associated with which projects or teams. To learn more, read Tags.
View segments
You can view segments from the Segments list:

The "Segments" list.
From the list, you can filter segments to display only those matching the criteria you select. You can filter based on tags or segment kind using the Tags and Kind menus.
Save filtered Segments lists
You can create shortcuts to filtered Segments lists, and save them in the left sidenav to return to at any time.
To create a shortcut to a filtered Segments list:
Navigate to the Segments list.
Add your desired environments to the Segments list following the instructions in Open environments.
Add any segment filters you need such as tags or segment kind.
Click the bolt icon above the Segments list to create a shortcut:

The Segments list with the "bolt" shortcut icon called out.
Add a Name for your shortcut.
(Optional) Choose an Icon to represent your shortcut in the left sidenav.
Click Save.
Your shortcut appears in the left sidenav.

A list of shortcuts in the left sidenav.
View segment details
To view a segment’s details:
Navigate to the Segments list.
Click the Name of the segment.
The segment details page appears.
The segment details page displays information about:
which flags use this segment in their targeting rules
which flag variations are served to the contexts in this segment
which individual targets are included or excluded from this segment
the targeting rules for this segment

A segment's details page.
For each segment, contexts may be specified individually, by rules, by an uploaded file, or by a third-party application that is synced with LaunchDarkly. If the contexts are specified by a file or if they are synced, you can search for specific contexts that are included in this segment.
Target a segment from multiple flags
You can target the same segment from multiple feature flags. If you have many flags that need the same targeting rules, it may be easier to set up a single segment with those rules for your flags to target, rather than setting up the rules repeatedly in each flag.
If you target only a percentage of contexts that match your segment targeting rule, each flag that targets that segment will include the same contexts in its targeting, assuming there are no other differences between the flags’ targeting rules.
For example, imagine you configure a segment to target 50% of user contexts that match its rule. As a result, the segment includes user contexts Adrian, Bailey, and Cristiano, and excludes user contexts DJ, Ellis, and Felicia. If there are no other differences between the flags’ targeting rules, each flag that targets that segment will also include user contexts Adrian, Bailey, and Cristiano in its targeting, while excluding user contexts DJ, Ellis, and Felicia.
To learn more, read Segment targeting.
Related content
Read the topics in this category to learn how to create, manage, and delete segments:
Segment types
Creating segments
Managing segments
SDK and integration configuration for segments
Segments synced from external tools
Segment types
Overview
This topic explains different segment types and when to use them.
Types of segments
Each time you create a segment, you can choose from different segment types depending on your needs.
You can include contexts in a segment in the following ways:
Using targeting rules. For example, you could create a segment for everyone with an email ending in “.edu”, or for all contexts with a “tier” attribute of “enterprise.” When you define a segment using targeting, you can include and exclude individual targets and include targets that match specific rules.
Using a smaller list. For example, if you are collecting the emails of customers who want to participate in beta testing in a spreadsheet, you can define a segment by adding individual targets.
Using a larger list. For example, if you have large lists of contexts, you can define a segment by uploading a CSV file.
Syncing a list from a third-party application. For example, if you already keep a list of customers in another application, you can define a segment that automatically stays in sync with your external definition.
Rule-based and smaller list-based segments
Rule-based segments and smaller-list based segments can support targeting rules and lists of contexts where the number of individual contexts targeted is 15,000 or fewer.
Rule-based segments
Rule-based segments work well when you have a relatively small or well-defined group that you want to target. For example, you might create a rule-based segment when you want to target the following groups:
Everyone who uses your application and has an email ending in “.edu”
Employees in your company who have volunteered to participate in internal testing of new features
All contexts with a “tier” attribute of “enterprise”
You may notice that it’s also possible to target each of these groups of contexts using targeting rules in a feature flag. However, it can simplify your configuration if you define the targeting rules in a segment, and then set up each flag to target the segment. If you create a segment, then you only have to define the targeting rules once. If your targeting rules ever change, you only have to change them in the segment. All of your feature flags that target the segment will automatically pick up the changes.
For some additional examples of working with rule-based segments, read Using entitlements to manage customer experience.
To learn how to create rule-based segments, read Create rule-based and smaller list-based segments.
Smaller list-based segments
Smaller list-based segments work well when you have lists of contexts you want to target that number 15,000 or fewer. Smaller list-based segments also support targeting rules.
To learn how to create smaller list-based segments, read Create rule-based and smaller list-based segments.
Larger list-based segments
Larger list-based segments are available to customers on select plans
Larger list-based segments are only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
Larger list-based segments work well when you have lists of contexts you want to target that number more than 15,000. Larger list-based segments can include only one targeted context kind. These segments were previously called “big segments.”
If you are working with server-side SDKs, larger list-based segments require persistent storage integration. You must configure this integration for each environment where you create larger list-based segments. To learn how, read SDK and integration configuration for segments.
List-based segments do not support targeting rules.
Synced segments
Synced segments are available to customers on select plans
Segments synced from external tools are only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
Synced segments are segments that sync can their context targeting list with an external tool. Synced segments can support massive numbers of targets. The exact number is only limited by the persistent store you configure. All of the contexts within a synced segment must be of the same context kind.
To learn how to create synced segments, read Segments synced from external tools.
Implementation considerations with larger list-based segments and synced segments
You may be familiar with the concept of a “big segment,” which is a term we previously emphasized in the LaunchDarkly documentation and user interface to describe some segments.
These segments are either:
a synced segment, or
a list-based segment with more than 15,000 entries that includes only one targeted context kind.
LaunchDarkly uses different implementations for different types of segments so that all of your segments have good performance.
Most of the time, you don’t need to keep track of whether your segment is one of these two kinds or not. For example, you don’t need to be aware of this when you are working with existing segments, or when you are using segments in your flag targeting rules.
There are two situations where you need to know whether you are using one of these two segment kinds or not:
If you are working with the REST API. Some of the REST API endpoints are specific to these segment kinds. To learn more, read Segments in the API documentation.
If you are using server-side SDKs and you are about to create your first synced segment or larger list-based segment in a new environment. LaunchDarkly SDKs refer to these as “big segments.” Some additional configuration is required. To learn more, read SDK and integration configuration for segments.
Creating segments
Overview
This topic explains how to create rule-based, smaller list-based, larger list-based, and synced segments. To learn about the differences between these, read Segment types.
Create rule-based and smaller list-based segments
To create a new rule-based or smaller list-based segment:
Click Create and choose Segment. The “Create a segment” dialog appears.
If you’re on an Enterprise or Guardian plan, choose Rule based-segments or List-based segments.
If you’re on a Developer or Foundation plan, or on an older Pro plan, continue entering the segment’s details.
Give your segment a human-readable Name.
Enter a Key for your segment. This field auto-populates based on the segment name, but you can change it if you like.
(Optional) Add a Description.
(Optional) Select or create Tags. Tags help you identify segments used by different teams or for different purposes within your organization.
If you chose List-based segments in step 2, under “How many individual targets will be in your list?” select 15,000 or fewer:

A portion of the "Create a segment" dialog, showing a question about the size of the list-based segment.
Click Save segment. The segment’s details page appears.
After you create the segment, you can add contexts in the following ways:
To add targeting rules, read Target contexts with rules.
To add or change the individual targets one at a time, read Target individual contexts.
To add or change the individual targets in sets of up to 1500, read Bulk edit individual contexts.
Create larger list-based segments
Before you create a larger list-based segment, you must create a comma-separated values (CSV) file containing the list of context keys you wish to include.
The CSV file has the following requirements:
All of the contexts in the CSV file must be of the same context kind.
The context keys must be in the first column of the CSV file.
The CSV file must not contain a header row.
The CSV file must not exceed 40MB in size.
The CSV file must not contain more than 1 million contexts.
If you want to add more than 1 million contexts, you can use the “Merge” option with multiple sequential file uploads. To learn more, read Segments with existing contexts.
You must upload multiple CSV files one at a time, as you cannot perform concurrent imports within a single environment.
To create a new larger list-based segment:
Click Create and choose Segment. The “Create a segment” dialog appears.

The "Select a segment kind" step of the "Create a new segment" dialog
In the “Select a segment kind” step, choose List-based segments. The “Enter segment details” step appears.
Give your segment a human-readable Name.
Enter a Key for your segment. This field auto-populates based on the segment name, but you can change it if you like.
(Optional) Add a Description.
(Optional) Select or create Tags. Tags help you identify segments used by different teams or for different purposes within your organization.
Under “How many individual targets will be in your list?”, select “More than 15,000”:

A portion of the "Create a segment" dialog, showing a question about the size of the list-based segment.
Select the Context kind from the menu.
Click Save segment. The segment’s details page and the “Upload CSV” dialog appear.
In the “Upload CSV” dialog, click Select file to browse for a CSV file that lists context keys for the selected context kind in its first column.
In the “Upload CSV” dialog:
To add the file immediately, click Upload file.
To request approval, check the Request approval checkbox. Enter a Reason to add details that help your reviewers understand the changes you made. Next, choose one or more reviewers from the Reviewers menu. Then, click Request approval. To learn more about the approval process, read Requesting approvals.
The import process begins in the background. When the import completes successfully, you receive an email notification. Depending on the number of contexts in the CSV, this may take several minutes or hours.
Alternatively, you can click Cancel from the “Upload CSV” dialog and upload your CSV at a later time.

You can also use the REST API: Create big segment import
Create synced segments
To learn how to create synced segments, read Segments synced from external tools.
Segment targeting for rule-based and smaller list-based segments
Overview
This topic explains how to target contexts in rule-based and smaller list-based segments. Smaller list-based segments are segments where the number of individual contexts targeted is 15,000 or fewer.
Target contexts with rules
You can use custom targeting rules in a segment to include targets that match specific rules. Segment targeting rules function the same way as flag targeting rules. To learn more, read Target with flags.
To customize a segment’s targeting rules:
Navigate to the details page of the segment you wish to modify.
Click + Add rule at the top of the page, or click the + button between existing rules. Then choose which kind of rule to add:
Select Target segments to create a targeting rule based on an existing segment.
In the Operator menu, select whether you want contexts in these segments or not in these segments to match the targeting rule.
In the Segments menu, enter or select the segments you want to target.
Select “Build a custom rule” to create a targeting rule based on contexts and their attributes.
Specify a Context kind, Attribute, Operator, and Values for the rule.
(Optional) Enter a name for the rule.
If you want to add more criteria, click the + beside the rule criteria.

A rule on a segment.
Select whether to include in the segment all contexts that match the rule, or a percentage of contexts that match the rule.
If you select a percentage of contexts, select a context kind and enter the percentage to include in the segment.
Click Save or, if your environment requires approvals, click Request approval.
To reference this rule when working with other members of your organization, click the three-dot overflow menu and choose Copy link to rule.
To remove a targeting rule from a segment, click Edit. Then click the overflow menu and select “Delete rule.”
Understanding segment rule logic
When you specify rules for a segment, LaunchDarkly parses them in order of appearance from top to bottom. You can change how segment targeting applies based on the order of the rules you create.
After you add targeting rules, you can also add individual contexts. To learn how, read Target individual contexts, below.
Each segment can include up to 5,000 targeting rules and 50,000 values across all rules.
Differences between flag targeting and segment targeting
There are some differences between flag targeting and segment targeting:
Segments are environment-specific. They do not populate in environments other than the one you created them in.
Segment targeting can reference another segment only if both segments exist in the same environment, and if you’re using a version of an SDK that supports contexts.
Like flags, you cannot create a circular reference between two segments, for example, where segment A targets segment B and segment B targets segment A.
Target individual contexts
You can individually target contexts for inclusion in or exclusion from a segment. You can also edit individually targeted contexts in bulk, and schedule the removal of individually targeted contexts from a segment.
To individually target a context:
Navigate to the details page of the segment you wish to modify.
Click the + Add rule button and select “Include individuals” or “Exclude individuals.”
Choose the context kind for the contexts you want to target.
By default, the context kind is “user.”
To update this, click Edit context. In the “Select context kinds” dialog, choose one or more context kinds and click Save.

The "Select context kinds" dialog with two context kinds selected.


The “Included targets” or “Excluded targets” section updates to display the context kinds you selected.
Choose contexts to include in or exclude from the segment.
You can search for contexts by name or key. Then, click the context name or key.
If you want to target a context that has not yet been encountered by LaunchDarkly, you can enter its key.
You cannot both include and exclude the same context.
Click Save changes or, if your environment requires approvals, click Request approval. The contexts are now individually targeted within the segment.
Here is an image of an individually targeted context:

An individually targeted context included in a segment.
To remove all included or excluded contexts from a segment, click Edit in the header of the “Included targets” or “Excluded targets” section. Then, click the overflow menu and select “Clear.”

The overflow menu for the individually targeted contexts.
After you add contexts to a list-based segment, you can also add rules. To learn how, read Target contexts with rules, above.
Bulk edit individual contexts
If you have a long list of contexts you want to add, remove, or replace within a segment, you can bulk edit contexts from a segment’s details page. You can only perform bulk editing tasks for one context kind at a time.
To edit individual targets in bulk:
Navigate to the details page of the segment you wish to modify.
In the “Included targets” or “Excluded targets” section, click Edit in the header of the section. Then, click the overflow menu.
Select Bulk edit. The “Bulk edit targets for this segment” dialog appears.
Use the action menu to select one of the following actions for the selected context kind:
“Add” adds the selected contexts as targets
“Remove” removes the selected contexts as targets
“Replace” replaces all currently targeted contexts with the selected contexts
Use the context kind menu to select the context kind of the contexts you are targeting.
Enter a list of context keys or email addresses in the Paste target keys field, separated by a comma or new line. LaunchDarkly looks up contexts by key or email and displays them in the list on the right. If you want to target a context that has not yet been encountered by LaunchDarkly, you must enter its key.

The "Bulk edit targets for this segment" dialog.
You can update the list on the right before you perform the selected action. The options for updating the list include the following:
All represents all of the contexts that may be impacted by the action, whether they are added or removed. Check the context’s checkbox for the action to apply.
The checkmark represents inputted context keys that currently match contexts in the system. For example, if you enter the context key context-key-123abc, and context-key-123abc already exists in LaunchDarkly, it will show up in this list.
The question mark represents contexts with no matching records in LaunchDarkly. If you are adding contexts and the contexts do not currently exist in LaunchDarkly, they will be added to the targeting list.
The exclamation mark represents context key inputs with multiple matching records. For example, if you enter the email address sandy@example.com, but there are multiple context keys that have sandy@example.com as an email address, the system may return multiple matching records. You can select the correct record by clicking the checkbox.
Current lists all of the currently targeted contexts for the segment.
Click Add targets, Remove targets, or Replace targets to perform the selected action.
Schedule context removal from segments
Scheduling removal dates is available to customers on select plans
Scheduling removal dates is only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
You can schedule an expiration date and time on which LaunchDarkly removes a context from a segment. You can do this for existing contexts, or when you add a context to a segment.
This is useful if you want to give contexts temporary access to a feature that has their segment targeted. The ability to remove contexts from segments, instead of flag targeting, allows you to keep your flag’s targeting rules permanent and clean.
To set a targeting removal date:
Navigate to the details page of the segment you wish to modify.
In the “Included targets” or “Excluded targets” section, click the calendar icon on the context you want to remove:

A context with the calendar icon called out.
In the “Schedule removal” dialog, set a date and time for the context to be removed from the segment.
Click Save or, if your environment requires approvals, click Request approval.
Additionally, when you add a context to a segment, you can schedule it for removal later by clicking Add and schedule removal.
Here is an image of the targeting field:

The targeting field with the "Add and schedule removal" option called out.

You can also use the REST API: Update expiring targets for segment
Segment targeting for larger list-based segments
Larger list-based segments are available to customers on select plans
Larger list-based segments are only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
Overview
This topic explains how to target contexts within larger list-based segments.
Larger list-based segments are segments where the number of individual contexts targeted may be greater than 15,000. Larger list-based segments can include only one targeted context kind. These segments were previously called “big segments.”
If you are working with server-side SDKs, larger list-based segments require a persistent storage integration. You must configure this integration for each environment where you create larger list-based segments. To learn how, read SDK and integration configuration for segments.
Larger list-based segments do not support targeting rules. To learn how to target contexts by rule within a segment, read Rule-based segments.

Configure your SDK: Big segments
Target contexts with a CSV file
To add contexts to a larger list-based segment, create a comma-separated values (CSV) file containing the list of context keys you wish to include.
The CSV file has the following requirements:
All of the contexts in the CSV file must be of the same context kind.
The context keys must be in the first column of the CSV file.
The CSV file must not contain a header row.
The CSV file must not exceed 40MB in size.
The CSV file must not contain more than 1 million contexts.
If you want to add more than 1 million contexts, you can use the “Merge” option with multiple sequential file uploads. To learn more, read Segments with existing contexts.
You must upload multiple CSV files one at a time, as you cannot perform concurrent imports within a single environment.
Then, follow the segment creation instructions under Create larger list-based segments and add your CSV file in the “Upload CSV” dialog.
Segments with existing contexts
If you are on the details page of a segment that already contains contexts, you have the option to merge or overwrite the existing contexts with the contexts from the CSV file. If you are merging contexts, they must all be of the same context kind.
Select “Overwrite” to replace all existing contexts in the segment
Select “Merge” to add to the existing contexts in the segment
Add and remove individual targets
After you add context targets to a list-based segment using a CSV file, you can then add or remove individual contexts.
To add or remove individual contexts to or from a larger list-based segment:
Navigate to the desired segment’s details page.
In the Included targets search box, enter the key of the context you want to add or remove. If the context is present in the segment, a Remove target button appears. If the user is not present in the segment, an Add target button appears.

Adding an individual context to a list-based segment.
Click Add target or Remove target.
Click Review and save. A “Review and save” dialog appears.
Click Save changes or, if your environment requires approvals, click Request approval.
Export lists of contexts from list-based segments
To export the contexts from a list-based segment into a CSV file:
Navigate to the desired segment’s details page.
Find the “Included targets” section and click Edit.
Click on the overflow menu.
Select Export as CSV.

The overflow menu for a list-based segment with the "Export as CSV" option displayed.
The export process runs in the background. When it completes, you receive an email notification containing a link to where you can download your CSV file.
LaunchDarkly does not support exporting segments with more than 10 million contexts.

You can also use the REST API: Create big segment export
Managing segments
Overview
This topic explains how to edit and delete segments. You can update a segment’s details, update its targeting, and target segments within flags.
Update segment details
To update a segment’s details:
Navigate to the segment detail page for the segment you want to update.
Click the gear icon to open the segment’s settings page.
Edit the Name, Description, and Tags for each segment.
Click Save.
Update segment targeting
To update a segment’s targeting:
Navigate to the segment detail page for the segment you want to update.
Update the segment’s targeting based on the kind of segment:
For rule-based segments, add, remove, or edit the segment’s targeting rules. To learn more, read Rule-based segments.
For list-based segments, add or remove individual targets or upload a new CSV to overwrite or merge with the existing targets. To learn more, read List-based segments.
For synced segments, you cannot change segment targeting within LaunchDarkly. Instead, edit the segment in the source application. To learn more, read Segments synced from external tools.
Test segment targeting
You can use the test run feature to test a segment’s targeting rules to find out whether or not a particular context will be included in the segment. Testing segment targeting helps ensure that contexts are included or excluded from segments as you expect.
To test a segment’s targeting:
From the Segments list, open the segment you want to test.
Make any needed changes to the segment rules and save your changes.
Click the fingerprint test run icon. The “Test run a context” section appears.
In the contexts field, search for and select the context you want to preview.

The "Test run a context" section, populated with an example context kind and key.


The “Test run a context” section populates with whether or not the context is included in the segment.
Target segments in flags
To target the segment in a flag:
Navigate to the segment detail page for the segment you want to update.
Click the > icon to expand the “N flags referencing this segment” callout. “N” is the number of flags currently targeting this segment.
Click Target this segment.
In the “Target this segment with a flag rule” dialog, select the flag where you want to use the segment. Then click Target this segment.
Alternatively, you can navigate to the Flags list and add a new targeting rule directly from the flag’s Targeting tab.
Delete segments
To delete a segment:
Navigate to the segment detail page for the segment you want to update.
Click the gear icon to open the segment’s settings page.
Click Delete this segment.
In the “Delete segment?” dialog, click Delete.
You cannot delete a segment if one or more flags is using it.

You can also use the REST API: Delete segment
SDK and integration configuration for segments
Synced segments and larger list-based segments are available to customers on select plans
Segments synced from external tools and larger list-based segments are the two kinds of “big segment.” These segments are only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
Overview
This topic explains the configuration process and requirements for synced segments and larger list-based segments.
You may be familiar with the concept of a “big segment,” which is a term we previously emphasized in the LaunchDarkly documentation and user interface (UI) to describe some segments.
These segments are either:
a synced segment, or
a list-based segment with more than 15,000 entries that includes only one targeted context kind.
LaunchDarkly uses different implementations for different types of segments so that all of your segments have good performance. Because the implementation for these segments is different than for rule-based segments and smaller list-based segments, there is some additional configuration work that you must complete before you can create one of these segments for the first time. This topic describes that configuration work.
You only need to perform the configuration steps in this topic if you wish to use these segments with a server-side SDK. Client-side SDKs support these types of segments by default. These types of segments are not supported on edge SDKs.
Set up a synced or list-based segment for use with a server-side SDK
For server-side SDKs, these segments require a persistent store within your infrastructure. LaunchDarkly keeps the persistent store up to date and consults it during flag evaluation.
To configure and use a persistent store to use segments with a server-side SDK, you must complete the following steps:
Configure a persistent store
Configure a persistent store integration or Configure the Relay Proxy
Configure server-side SDKs
Review and edit the integration as needed, including reviewing its connection status
Configure a persistent store
If you are using server-side SDKs, synced segments and larger list-based segments require a persistent store within your infrastructure. You can use either Redis or DynamoDB. We recommend using a dedicated Redis database or DynamoDB table.
LaunchDarkly stores the segments’ context keys in the persistent store, keeps the persistent store up to date, and consults it during flag evaluation.
If you are using Redis, you will need to know:
Your Redis host
Your Redis port
Your Redis username, if any
Your Redis password
Whether or not LaunchDarkly should connect using TLS.
Expand Redis user permissions


















If you are using DynamoDB, you will need to know:
Your DynamoDB table name. The table must have the following schema:
Partition key: namespace (string)
Sort key: key (string)
Your DynamoDB Amazon Web Services (AWS) region.
Your AWS role Amazon Resource Name (ARN). This is the role that LaunchDarkly will assume to manage your DynamoDB table.
An External Id to connect your AWS role with LaunchDarkly. LaunchDarkly provides this when you configure the persistent store integration.
Expand Creating the AWS role



















Whichever persistent store you use, you may also need to add the outboundAddresses from the LaunchDarkly public IP list to your infrastructure’s firewall. To learn more, read Public IP list.
LaunchDarkly keeps the persistent store up to date, using either a persistent store integration or the Relay Proxy. You must configure one or the other. Then, LaunchDarkly consults the persistent store during flag evaluation.
Implementation considerations when using a persistent store
There are a few implementation considerations to keep in mind when you are using a persistent store for segments:
We recommend using a dedicated Redis database or DynamoDB table. The persistent store integration will have read and write access to this.
If you are using AWS, we recommend using DynamoDB as your persistent feature store, rather than Redis, because DynamoDB is fully managed by AWS. This means any provisioning of larger hosts happens automatically as your segment data scales.
The feature store and persistent store configurations for your SDK are separate. If you are using a feature store for your SDK, you can use either the same or a different persistent store for your segments. For example, if you configure your SDK to use Redis for a feature store, you can still configure it to use DynamoDB for the persistent store for segments. To learn more, read Storing data and Big segments in the SDK features documentation.
There are also a few performance considerations to keep in mind when you are using a persistent store for segments:
LaunchDarkly uses the persistent store to hold the context keys of the contexts in your segments.
For synced segments, the set of context keys is updated regularly. The cadence of this update is determined by the external tool you are using, such as Amplitude or Twilio Segment Audiences. The persistent store integration displays when the most recent sync occurred. To learn more, read Review and edit the persistent store integration and Update synced segments.
For performance reasons, we recommend that your persistent store is co-located with your application. You can use multiple persistent stores if you host your application in multiple regions.
Configure a persistent store integration
Configuring a persistent store integration is the easiest way to ensure that LaunchDarkly keeps your synced segments and larger list-based segments up to date.
Here’s how:
Click the gear icon in the left sidenav to view Organization settings.
Click Integrations.
Find the integration for your persistent store. You can search for “DynamoDB” or “Redis.”
Click Add integration. A “Create configuration” panel appears.
Set the Status of the integration to On.
(Optional) Enter a Name for the integration.
Choose an environment from the Environment menu. This should match the environment where your segments are created. It cannot be changed after you create the integration.
Enter information specific to your persistent store.
For Redis, this includes the Redis host, port, username, password, and whether LaunchDarkly should connect using TLS.
For DynamoDB, this includes the DynamoDB table name, AWS region, and AWS role ARN.
After reading the Integration Terms and Conditions, check the I have read and agree to the Integration Terms and Conditions checkbox.
Click Save configuration.

The "Create configuration" panel for a DynamoDB integration.

After your persistent store integration is configured, LaunchDarkly automatically keeps the persistent store up to date. For larger list-based segments, LaunchDarkly writes the segment contents to your persistent store when you create or update segments. For synced segments, LaunchDarkly writes the segment contents from your external tool to your persistent store. The segment data that is persisted to your infrastructure contains hashed values of context keys and LaunchDarkly segment keys. In both cases, the segment contents are readily available within your infrastructure, and LaunchDarkly consults your persistent store automatically during flag evaluation.
Flag evaluations are dependent on synced segments
Flag evaluation references the segment contents in your persistent store. If your application evaluates flags that target segments while those segments are in the process of being synced with the external tool, the flag evaluation may be out of date for the time it takes to complete the syncing process. The LaunchDarkly SDKs log a warning in this situation.
Configure the Relay Proxy
You are not required to use the Relay Proxy to configure synced segments or larger list-based segments. You can use a persistent store integration instead.
We recommend using the Relay Proxy in certain situations. The Relay Proxy is not appropriate for all customer configurations. To learn more about if using the Relay Proxy is right for you, read Determining whether to use the Relay Proxy.
If you are already using the Relay Proxy with DynamoDB or Redis, you may decide to use it for your segments infrastructure as well. To learn how, read Configuring the Relay Proxy for segments.
Configure server-side SDKs
If you are using server-side SDKs, you must use an SDK version that supports big segments, and you must configure your SDK to use the persistent store that you have configured above, either through a persistent store integration or through the Relay Proxy.

Configure your SDK: Big segments
If you are using client-side SDKs, no persistent store, integration, or additional setup is required.
Review and edit the persistent store integration
You can review the status of your persistent store integration, and edit the configuration if needed. Here’s how:
Click the gear icon in the left sidenav to view Organization settings.
Click Integrations.
Find the integration for your persistent store. You can search for “DynamoDB” or “Redis,” or for the name of your persistent store integration.
From here, you can review the configuration for this integration. This includes the following information:
“Configuration name” column with the configuration name, project, and environment.
“State” column with information on whether the persistent store integration is currently in sync with the segments in the LaunchDarkly environment.
A state of “Healthy” means that the data in your persistent store matches the data in LaunchDarkly.
Click “See error” to view details of any error. You can also find this information by clicking the overflow menu and choosing “View error log.”
“Last successful sync” column with a timestamp of when the most recent sync occurred between the persistent store integration and the LaunchDarkly environment.

The configuration for a Redis persistent store integration.
To edit the integration:
Click the overflow menu for your persistent store integration and choose “Edit integration configuration.”
In the panel, you can update the Status, Name, and some details specific to your persistent store integration.
When you are finished, click Save configuration.
To delete the integration:
Click the overflow menu for your persistent store integration and choose “Edit integration configuration.”
In the panel, find the “Delete configuration” section.
Click Delete.
Segments synced from external tools
Syncing segments is available to customers on select plans
Syncing segments with external tools is only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
Overview
This topic explains how to create segments that sync with an external tool. These are called synced segments. Then, you can use these segments in your flag targeting rules within LaunchDarkly. You manage the membership of these segments in the external tool.
All of the contexts within a synced segment must be of the same context kind. All of the segment’s included targets will be associated with that context kind.
Synced segments can support massive numbers of targets. The exact number is only limited by the persistent store you configure. LaunchDarkly uses your persistent store to hold the context keys of the contexts in your segments.
Prerequisites
To use synced segments, you must complete the following prerequisites:
Configure persistent storage for synced segments
If you are using server-side SDKs, then when you create a synced segment, the segment membership information is synced from an external tool to a persistent store within your infrastructure. LaunchDarkly manages the syncing process, and then consults the persistent store during flag evaluation.
You must configure the persistent storage and the integration to it for each environment where you create synced segments. To learn how, read SDK and integration configuration for segments.
Configure an access token
For segments that are synced with external tools, in most cases you must provide the external tool with a LaunchDarkly access token that has appropriate permissions in your LaunchDarkly project. To learn how to create an access token, read Creating API access tokens.
Your access token must have access to create segments and update their included targets. The LaunchDarkly Project Admin, Maintainer, and Developer roles, as well as the Writer, Admin, and Owner base roles, all include this access.

An access token with the Writer role called out.
If your access token has another role, that role must have the actions createSegment and updateIncluded to sync a segment from an external tool.
Below is an example of the permissions needed:
Example token policy
[
 {
   "effect": "allow",
   "actions": [
     "createSegment",
     "updateIncluded"
   ],
   "resources": ["proj/*:env/*:segment/*"]
 }
]

To learn more, read Roles and Segment actions.
Update synced segments
Synced segments are created by external tools prior to the first sync. After they are created, you can update the synced segment targets only in the external tool. You can update segment details such as name and description directly in LaunchDarkly.
Update synced segment targets
To change the contexts that a synced segment is targeting, update the segment membership in the external tool. For example, if your segment is synced from an Amplitude cohort, update the segment membership in Amplitude.
Updating the segment, cohort, or audience in the external tool might be something you do manually in that tool. Or, it might happen when a customer performs an action in your application, for example, if your customer clicks an “Enroll in beta” button.
After the segment is updated in the external tool, the changes automatically sync to LaunchDarkly, and any flags in LaunchDarkly that use this synced segment in their targeting rules automatically use the updated segment. The exact length of time from when a customer is added to a segment, cohort, or audience in the external tool to when the segment is synced with LaunchDarkly varies depending on the external tool. We have found that this typically takes around 30 seconds, but is dependent on the external tool, as well as other factors such as network conditions.
Update synced segment details
When you create a synced segment, the external tool provides the segment’s name, key, and description. In some cases, you may want to update the name and description to something more meaningful to your team. Additionally, you may want to add one or more tags to the synced segment.
To update a synced segment’s name or description:
Navigate to the segment detail page for the synced segment you want to update.
Select the Settings tab.
Edit the Name, Description, and Tags.
Click Save.
Subsequent targeting syncs will not override any manual changes to the synced segment’s name, description, or tags. As with all segment types, you cannot modify a synced segment’s key.
Supported external tools
LaunchDarkly supports syncing segments with the following tools:
Syncing segments with Amplitude cohorts
Syncing segments with Census
Syncing segments with Heap
Syncing segments with Hightouch
Syncing segments with RudderStack Audiences
Syncing segments with Tealium Audiences
Syncing segments with Twilio Segment Audiences
Syncing segments with Zeotap
Syncing segments with Amplitude cohorts
Overview
This topic explains how to create segments that sync with an Amplitude cohort. Segment syncing lets you import audiences from Amplitude to LaunchDarkly to more efficiently target and deliver feature flags. You manage the membership of these segments in Amplitude.
The primary benefit of syncing segments with Amplitude is the automatic syncing between Amplitude and LaunchDarkly. This lets you concentrate more on deploying features and less on managing end users between platforms.
Prerequisites
The general prerequisites for synced segments apply to syncing segments with Amplitude cohorts.
In order to sync segments with Amplitude cohorts, you must additionally meet the following prerequisites:
You must have an Amplitude account with the LaunchDarkly integration enabled. Contact your Amplitude Customer Success Manager to enable the LaunchDarkly integration.
You must have a LaunchDarkly access token with write access for the project you want to connect to Amplitude. To learn more, read Configuring your access token.
You must have a LaunchDarkly client-side ID for the environment you want to connect to Amplitude. To learn more, read Copying your LaunchDarkly client-side ID.
If you are using server-side SDKs, or client-side SDKs with the Relay Proxy, there are additional prerequisites.
Synced segments
With synced segments, you can connect a new or existing Amplitude cohort to LaunchDarkly. LaunchDarkly interprets this cohort as a synced segment, which makes it convenient for you to target flags to specific context groups or demographics.
You can configure segments to sync automatically in LaunchDarkly at regular intervals, which keeps them current with the existing cohort. We recommend setting up your segment to sync every hour. The process for doing this is documented below.
By syncing segments, you can deliver flags to the right context groups precisely and on time.
Create a segment that syncs with Amplitude
To configure a segment that syncs with an Amplitude cohort, you must choose a cohort in Amplitude and tell it to send data to LaunchDarkly. When you do this correctly, the cohort appears as a segment in LaunchDarkly.
To do this, first add LaunchDarkly as a destination and then sync the cohort to the LaunchDarkly destination.
Add LaunchDarkly as a destination
To create a destination in Amplitude, you must have Admin or Manager credentials.
To add LaunchDarkly as a destination:
Log in to Amplitude and navigate to Data Destinations:

The Amplitude dashboard with the "Data Destinations" button called out.
Scroll to the “Add More Destinations” section and click View All Destinations:

The "Add More Destinations" section with the "View All Destinations" button called out.
Select the LaunchDarkly Destination:

The "Add Destination" list with LaunchDarkly called out.
If LaunchDarkly is not on the destinations list, contact your Amplitude Customer Success Manager to enable the LaunchDarkly integration. If you do not have Admin or Manager credentials Amplitude displays an error message:

A permission error message in Amplitude.
Enter a destination name and add the access token and client-side ID for your LaunchDarkly project and environment.
Select a matching user property in Amplitude to map to LaunchDarkly’s User Key. This will most likely be your Amplitude user ID but it depends on your Amplitude configuration:

The "Connect to LaunchDarkly" screen.
Users in Amplitude must have a value in the field you map to the LaunchDarkly User Key to be included in a LaunchDarkly segment.
Click save.
Verify that LaunchDarkly shows as “Connected”:

The "Cohort Destinations" screen.
LaunchDarkly is now an Amplitude data destination.
Sync cohort to LaunchDarkly
To connect a cohort to LaunchDarkly:
Navigate to the cohort you wish to connect to LaunchDarkly.
Click Sync to… to open a new tab with a dialog:

The SuccessCohort screen with the "Sync to..." button called out.
Select Experiment then LaunchDarkly. If LaunchDarkly is not a destination, make sure you have added LaunchDarkly as a destination:

The "Select Sync Type" screen.
Click next. The destination configuration screen appears.
Select your LaunchDarkly destination and set the scheduled sync frequency. An hourly sync frequency ensures your segments are kept up to date with your Amplitude cohorts. A one-time sync exports the cohort into a segment once:

The Amplitude destination configuration screen.
Click Sync.
The sync process begins and might take a few minutes to complete:

The Amplitude cohort destinations screen.
When the sync finishes Amplitude sends you an email and LaunchDarkly appears in the list of Destinations connected to that cohort.
Check for missing user IDs
Users missing a user ID in Amplitude are not included in the segment
Users in Amplitude must have a value in the field you map to the LaunchDarkly User Key field, typically the Amplitude user ID, to be included in a LaunchDarkly segment. The value in the LaunchDarkly User Key field becomes the context key in LaunchDarkly. Any Amplitude users missing a value in the mapped field are not included in the LaunchDarkly segment. To learn how to view the contexts in a segment synced with Amplitude, read View synced Amplitude cohorts in LaunchDarkly.
To check for users in your Amplitude cohort missing user IDs, you can download a CSV file with user ID information. Here’s how:
While viewing your cohort in Amplitude, click on the export CSV button:

The Amplitude top menu with the export CSV button called out.
Open the file. The second column is user_id. If you mapped user_id to the LaunchDarkly User Key, any user without a value in this column is not included in the LaunchDarkly segment.
View synced Amplitude cohorts in LaunchDarkly
You can view your synced Amplitude cohort as a segment in LaunchDarkly. It appears on the Segments list with the Amplitude logo next to its name.
Click into that segment’s details page for more information about its targeting. You can’t edit rules for a segment synced with an Amplitude cohort because they are managed by Amplitude.
Syncing segments with Census
Overview
This topic links to Census’s documentation for its LaunchDarkly integration.
Census provides a reverse extract, transform, load (ETL) platform that makes it easy to connect your data warehouse into sales, marketing, and other customer facing tools that drive your business.
You can use this integration to sync Census segments with LaunchDarkly.
Census manages this integration. To learn how to use it, read Census’s LaunchDarkly Synced Segments.
To learn more about synced segments in LaunchDarkly, read Synced segments.
Syncing segments with Heap
Overview
This topic links to Heap’s documentation for its LaunchDarkly synced segments integration.
Heap helps you identify patterns in user behavior so you can group users accordingly and engage them based on their actual experience. Segment syncing lets you import users from Heap to LaunchDarkly to more efficiently target and deliver features.
You can use this integration to sync Heap segments with LaunchDarkly.
Heap manages this integration. To learn how to use it, read Heap’s documentation, LaunchDarkly Integration.
To learn more about synced segments in LaunchDarkly, read Synced segments.
Syncing segments with Hightouch
Overview
This topic links to Hightouch’s documentation for its LaunchDarkly integration.
Hightouch syncs data from any data warehouse into the tools that your business runs on. It allows anyone in your organization to explore customer data and sync it into marketing, advertising, sales, and customer success tools, without engineering effort.
You can use this integration to sync models defined in Hightouch with LaunchDarkly.
Hightouch manages this integration. To learn how to use it, read Hightouch’s Syncing synced segments.
To learn more about synced segments in LaunchDarkly, read Synced segments.
Syncing segments with RudderStack Audiences
Overview
This topic links to RudderStack’s documentation for its LaunchDarkly integration.
RudderStack is an open-source Customer Data Platform (CDP), providing data pipelines that allow you to easily collect data from every application, website, and SaaS platform to activate in your warehouse and business tools.
You can use this integration to sync audiences defined in your warehouse with LaunchDarkly.
RudderStack manages this integration. To learn how to use it, read RudderStack’s LaunchDarkly Segments.
To learn more about synced segments in LaunchDarkly, read Synced segments.
Was this page helpful?
Yes

Syncing segments with Tealium Audiences
Overview
This topic links to Tealium’s documentation for its LaunchDarkly integration.
Tealium connects customer data across web, mobile, offline, and IoT so businesses can better connect with their customers.
You can use this integration to sync audiences defined in your warehouse with LaunchDarkly.
Tealium manages this integration. To learn how to use it, read Tealium’s LaunchDarkly Audience Cohorting Connector Setup Guide.
To learn more about synced segments in LaunchDarkly, read Synced segments.
Syncing segments with Twilio Segment Audiences
Overview
This topic explains how to create segments that sync with a Twilio Segment Audience. Segment syncing lets you import audiences from Twilio Segment to LaunchDarkly to more efficiently target and deliver feature flags. You manage the membership of these segments in Twilio.
The primary benefit of syncing segments with Twilio Segment is the automatic syncing between Twilio Segment and LaunchDarkly. This lets you concentrate more on deploying features and less on managing end users between platforms. You can connect a new or existing Twilio Segment Audience to LaunchDarkly. LaunchDarkly interprets each Audience as a segment.
Prerequisites
The general prerequisites for synced segments apply to syncing segments with Twilio Segment Audiences.
In order to sync segments with Twilio Segment Audiences, you must additionally meet the following prerequisites:
You must have a Twilio Segment account with the Engage Audiences feature enabled. Contact your Twilio Segment Customer Success Manager to enable the Engage Audiences feature.
You must have a Twilio Segment role that allows you to create destination connections and Engage Audiences. To learn more, read Roles.
You must have a LaunchDarkly access token with write access for the project you want to connect to Twilio Segment. To learn more, read Configure an access token.
You must have a LaunchDarkly client-side ID for the environment you want to connect to Twilio Segment. To learn more, read Copying your LaunchDarkly client-side ID.
If you are using server-side SDKs, or client-side SDKs with the Relay Proxy, there are additional prerequisites.
Create a segment that syncs with Twilio Segment
To configure a segment that syncs with a Twilio Segment Audience, you must choose an Audience in Twilio Segment and configure it to use the LaunchDarkly Audiences destination. When you do this, the cohort appears as a segment in LaunchDarkly.
To do this, your will need to first configure the LaunchDarkly Audiences destination and then add the LaunchDarkly Audiences destination as a Twilio Segment Audience.
Configure the LaunchDarkly Audiences destination
To add LaunchDarkly as an Audiences destination:
Sign in to Twilio Segment and navigate to the Connections tab.
Navigate to the Catalog tab and search for LaunchDarkly Audiences.
Click Add destination.
Select an existing Engage space as the data source. If you do not have an existing Engage space, follow Twilio Engage Foundations Onboarding Guide.
Click Confirm source.
On the Basic settings page, provide a human-readable Name for the destination. Because each instance of a LaunchDarkly Audiences destination can only sync to a single project and environment in LaunchDarkly, we recommend including project and environment information in the name.
Enter the service token you created previously in the LaunchDarkly Service Token field.
In the LaunchDarkly client-side ID field, enter the client-side ID corresponding to the environment where your synced segment will be created in LaunchDarkly. To learn more, read Copying your LaunchDarkly client-side ID.
Click the Enable Destination toggle.

The LaunchDarkly Audiences destination "Basic settings" page in Twilio Segment.


Navigate to the Mappings tab of your LaunchDarkly Audiences destination configuration.
Click New Mapping.
Select the Sync Engage Audience to LaunchDarkly pre-built mapping.

The "Add Mapping" modal in Twilio Segment with the "Sync Engage Audience to LaunchDarkly" mapping highlighted.


Scroll to Select mappings and modify the following settings as needed:
Context kind: The LaunchDarkly context kind for the LaunchDarkly synced segment. The default value is user. For more information, read Context kinds.
Context key: The Twilio Segment audience property that will be used as the context key. For most customers, the default value of Use Segment UserId only is recommended.
Enable batching: Select Yes.

The "Select mappings" section of the "Edit: Sync Engage Audience to LaunchDarkly" in Twilio Segment configured with recommended settings.


Click Save.
Ensure the Status toggle on the Mappings tab is enabled.

The "Mappings" tab of the LaunchDarkly Audiences page in Twilio segment with the "Sync Engage Audience to LaunchDarkly mapping" enabled.


Add the LaunchDarkly Audiences destination as a Twilio Segment Audience
To add the LaunchDarkly Audiences destination to your Twilio Segment Audience:
Navigate to the Audiences page in Twilio Segment and select the Audience you would like to sync with LaunchDarkly.
In the Destinations section of the Audience page, select Add destination.
Select the LaunchDarkly Audiences destination that you configured previously.
Click Save. The default values for Send Identify and Send Track are appropriate.
Click Add 1 destination.
Verify that your Audience now displays your LaunchDarkly Audiences destination as a synced destination.

An example Twilio Segment Audience page configured with a successfully configured LaunchDarkly Audiences destination highlighted.


The first sync will start about ten minutes after adding the LaunchDarkly Audiences destination. A new LaunchDarkly segment will be created automatically. Navigate to the Segments page in LaunchDarkly to verify that your new synced segment exists in LaunchDarkly. The segment’s name will be the same as the Twilio Segment Audience’s name.
Syncing segments with Zeotap
Syncing segments is available to customers on select plans
Syncing segments from Zeotap is only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
Overview
This topic links to Zeotap’s documentation for its LaunchDarkly synced segment integration.
The Zeotap customer data platform (CDP) integration with LaunchDarkly allows you to send segments you create in Zeotap to LaunchDarkly. You can then use these segments in LaunchDarkly feature flag targeting.
Zeotap manages this integration. To learn how to use it, read Zeotap’s LaunchDarkly.
To learn more about synced segments in LaunchDarkly, read Segments synced from external tools.
Releasing features with LaunchDarkly
Overview
This topic compares several options LaunchDarkly provides for releasing features to production safely and gradually.
Release options comparison
The following table compares functionality that LaunchDarkly provides for releasing features:
Release option
Description
Example use case
Availability
Percentage rollouts
This option on a flag’s targeting rule serves a given flag variation to a specified percentage of contexts.

The percentage of customers receiving a variation does not change over time. To automatically increase the percentage, use progressive rollouts, described below.

Affects one targeting rule in one environment.
Use percentage rollouts if you want to randomly allocate traffic by context kind and attribute, for example, if you want to test a new feature on a subset of end users in production.

If you later change the percentage in the percentage rollout, the flag variation that any particular customer receives may change each time you change the percentage. To learn more, read Percentage rollout logic.
Percentage rollouts are available to all plans and work with all flag types.
Progressive rollouts
This option on a flag’s targeting rule serves a given flag variation to a specified percentage of contexts, and gradually increases that percentage over a specified time.

With this option, the percentage of customers receiving a variation automatically increases over time.

Affects one targeting rule in one environment, over time.
Use progressive rollouts if you want to randomly allocate traffic by context kind, and automatically increase the amount of traffic to a specific flag variation over time.

As the rollout progresses, the flag variation that any particular customer receives changes only once.
Progressive rollouts are available to all plans and work with all flag types.
Guarded rollouts
This option on a flag’s targeting rule serves a given flag variation to a specified percentage of contexts, and gradually increases that percentage over a specified time.

This option monitors the rollout for regressions based on metrics you select, and can automatically notify you and roll back if a regression is detected.

Guarded rollouts are one of the rollout strategies available in each release pipeline phase.

Affects one targeting rule in one environment, over time.
Use guarded rollouts if you want to randomly allocate traffic by context kind, and automatically increase the amount of traffic to a specific flag variation over time, while monitoring selected metrics. For example, this option can monitor latency and error rates specific to the traffic receiving the selected flag variation. LaunchDarkly notifies you or automatically reverts the rollout if regressions are detected.
Guarded rollouts is only available on a Guardian plan.

Guarded rollouts are available for all flag types except migration flags.
Release pipelines
Release pipelines let you move flags through a series of phases, rolling out flags to selected environments and audiences following automated steps. Other release options work for a single flag targeting rule, whereas a release pipeline standardizes your release process across flags and environments.

For each phase, you select the environment, audience, and rollout strategy, as well as whether approvals are required.

Affects one targeting rule across multiple environments over time.
Use release pipelines in combination with guarded rollouts to standardize and automate the release process for your flags across multiple environments.
Release pipelines are only available on an Enterprise plan.

Release pipelines are available for boolean flags only.

Additional release management tools
In addition to release pipelines and several rollout options, LaunchDarkly provides tools for managing the steps of your release. Choose the tools that work best for your release and change management processes.
The topics in the Release management tools category describe these tools in detail:
Approvals
Flag triggers
Feature monitoring
Required comments
Required confirmation
Scheduled flag changes
Workflows
Percentage rollouts
Overview
This topic explains how to use percentage rollouts to release new features incrementally.
Percentage rollouts let you manage the risk of deployment by releasing a feature gradually. You can roll out your feature to a small percentage of contexts and, as you become more confident your feature is working as intended, manually increase the percentage over time.
Percentage rollouts are one of several options that LaunchDarkly provides to help you release features to production safely and gradually. To learn about other options for releasing features, read Releasing features with LaunchDarkly.
Create percentage rollouts
You can create a percentage rollout in a flag’s targeting rule or a flag’s default rule.
Here is an image of a percentage rollout in a default rule:

The percentage rollout section.
In this example, 50% of user contexts will receive the new feature. If the new feature works as expected, you can increase the percentage of contexts receiving the new feature incrementally, until it eventually reaches 100%.
If you want to roll out a variation to a very small percentage of contexts, you can assign less than 1% to a variation. You can use up to three decimal places, for example, 0.125%.
Percentage rollouts require both a context kind and a context attribute. To learn more about which context attribute you might want to use in which situation, read Percentage rollouts by context attribute.
You can use progressive rollouts to automate the process of changing rollout percentages over time. To learn how, read Progressive rollouts.
To learn more about contexts, read Contexts.
Percentage rollout logic
Expand the section below to read about the details of LaunchDarkly’s percentage rollout logic.
Expand Percentage rollout logic


Target the same contexts in multiple percentage rollouts
Different flags with percentage rollouts assign contexts to their variations independently from each other, even if the targeting rules and percentage rollouts are the same. If you want two flags to target the exact same set of contexts as part of their percentage rollouts, you must target a segment instead.
For example, if you have two flags that you want to serve “true” to 10% of your contexts and “false” to 90% of your contexts, create a segment that includes 10% of your contexts. To learn how, read Creating segments.
Then, in each of your flags, serve “true” to all contexts in that segment. Each flag that targets that segment will include the same contexts in its targeting, assuming there are no other differences between the flags’ targeting rules.
Was this page helpful?
Yes

Percentage rollouts by context attribute
Overview
This topic explains how to perform percentage rollouts by associating flag variations with context attributes, whether the user context is in an anonymous or logged-in state.
Roll out by context attribute
You can assign variations to contexts through a percentage rollout based on any attribute in the “Context kind” and “Attribute” menus.
For example, when you roll out a feature to 25% of user contexts, you can specify that each end user be assigned to a variation based on the value of the “country” attribute in their user context, rather than being assigned to a variation based on their context key. This ensures that LaunchDarkly assigns all customers with matching attribute-value pairs to the same variation. To learn more about attributes, read Context attributes.
In this example, the feature will be rolled out to a percentage of users whose organization is in Canada.
Here is an image of a rollout by the “country” attribute for a user context:

A percentage rollout by the "country" attribute for a user context.
The attribute must have either string values or integer numeric values. If you use an attribute with a numeric value that includes a fraction, or has a value type besides string or number, then the SDK cannot use the attribute value and assigns the context to an arbitrary variation.
Target and roll out by different context attributes
When you use a percentage rollout on a flag’s targeting rule, you can target on one context kind, but roll out the feature based on a different context kind. We only recommend doing this if you are using multi-contexts. For example, if your app is evaluating all flags using a multi-context that includes both user and organization context kinds, you might target by an organization attribute but roll out the feature based on a user attribute.
In this example, the feature will be rolled out to a percentage of users whose organization is in Canada.
Here is an image of a rule targeting the “country” attribute for an organization context, rolling out by user:

A flag targeting rule that targets on an organization attribute and uses a percentage rollout on a user attribute.
Other context kinds may not receive the default variation
Use caution with this approach, as it may have unintended consequences if not all of the contexts that encounter this flag are multi-contexts containing both context kinds.
If a context matches the targeting rule that uses a percentage rollout, but its context kind is not the one by which the rollout occurs, then LaunchDarkly serves the first variation listed in the percentage rollout configuration with a percentage greater than zero. This may not be the default variation. To learn more, read Percentage rollout logic.
Maintaining customer experience across anonymous and logged-in states
Contexts are designed to let you target different types of entities, such as devices and organizations, precisely. However, if your application requires a user login, you will probably use a “user” context, at least for some of the attributes you are storing. When your application has both anonymous and logged-in states, you want to maintain the customer experience across both states.
There are two approaches to maintaining the customer experience across pre-login (anonymous end user) and post-login (known end user) states: single contexts and multi-contexts.
Single contexts
The first approach uses single contexts. You can set an attribute in a user context and set your percentage rollouts to roll out based on that attribute.
Here’s how to do this:
Store a unique identifier for the anonymous end user. A session ID or UUID works well.
You can store this identifier in local storage or a cookie.
If you are using a mobile SDK, the SDK can generate the unique identifier for you and use it as the context key.

Configure your SDK: Anonymous contexts in client-side SDKs
Use this unique identifier as both the context’s key and an attribute in the user context until the end user logs in. The attribute can be named anything, for example, uniqueId.
While the end user is logged in, set the context’s key to their real (primary) context key, but continue to use the stored unique identifier as the context’s uniqueId attribute.
For all flags, or for those that may affect logged out users, set your flags to serve percentage rollouts based on the uniqueId attribute.
To learn more about anonymous contexts, read Anonymous contexts.
One disadvantage to this approach is that using a uniqueId attribute, rather than context key, means that you cannot easily convert the rollout strategy from percentage rollout to experiment. To learn more, read Allocate audiences.
Multi-contexts
The second approach uses multi-contexts. You can use an attribute, such as the context key, in a non-user context and set flags’ percentage rollouts based on that attribute.
Here’s how to do this:
Store a unique identifier for the anonymous end user as the context key in a different kind of context, such as a device context. A device ID or UUID works well.
Target the end user based on this context key while they are not yet logged in.
After the end user logs in, store their user information in a user context. Associate the device context and the user context with each other. To do this, identify a multi-context that includes both individual contexts when you want the association to occur.
For all flags, or for those that may affect logged out users, set your flags to serve percentage rollouts based on the unique identifier in the device context.
To learn more, read Multi-contexts and context instances.

Try it in your SDK: Identifying and changing contexts
Progressive rollouts
Overview
This topic explains what progressive rollouts are and why you might use them to release new features incrementally.
To learn how to create a progressive rollout, read Creating and managing progressive rollouts.
What happens when a progressive or guarded rollout starts or stops
Progressive rollouts and guarded rollouts use randomized traffic allocation to determine which contexts receive a new variation. Before you create a rollout, it’s important to understand how context targeting behaves when stopping and restarting the rollout.
If you stop a progressive rollout or guarded rollout and later create a new one on the same flag and variation, LaunchDarkly may serve the variation to a different set of contexts than in the original rollout. This happens because each new progressive or guarded rollout independently assigns contexts to receive the variation, based on the selected randomization unit.
This behavior is different from percentage rollouts, which retain the same set of contexts when you stop and restart them. The same contexts continue to receive the variation, provided the flag configuration and context kind remain unchanged.
About progressive rollouts
Progressive rollouts are an option on a flag’s targeting rule in a given environment. A progressive rollout serves a given flag variation to a specified percentage of contexts, and gradually increases that percentage over a specified time.
Use progressive rollouts if you want to randomly allocate traffic by context kind, and automatically increase the amount of traffic to a specific flag variation over time. For example, if you are changing the color scheme on your landing page from a “red” variation to a “purple” variation, you might use progressive rollouts to gradually increase the percentage of customers receiving “purple” from 1% up to 100% in a series of steps over 20 hours:

A progressive rollout configuration on a default rule.
As the rollout progresses, the flag variation that any particular customer receives changes only once. Customers who are not yet part of a rollout step receive the From that you set. In the example above, all customers are initially receiving the “blue” variation, and they will all eventually receive the “yellow” variation. You do not have control over when in the course of the rollout this occurs for a specific customer. After they start receiving the “yellow” variation, they will never receive the “blue” variation again, unless you explicitly stop the progressive rollout and update your flag rule to serve “blue” to everyone.
You can create a progressive rollout on any flag targeting rule, as long as there are no other progressive rollouts, guarded rollouts, or experiments running on the flag and the flag is not a migration flag.
Progressive rollouts are one of several options that LaunchDarkly provides to help you release features to production safely and gradually. To learn about other options for releasing features, read Releasing features with LaunchDarkly.
Creating and managing progressive rollouts
Overview
This topic explains how to create and manage progressive rollouts to release new features incrementally.
Create a progressive rollout
You can create a progressive rollout on any flag targeting rule, as long as there are no other progressive rollouts, guarded rollouts, or experiments running on the flag and the flag is not a migration flag. You need a role with the ability to update flag rules in order to create a progressive rollout. The LaunchDarkly Project Admin, Maintainer, and Developer project roles, as well as the Writer, Admin, and Owner base roles, all include this ability.
To create a progressive rollout:
Navigate to the flag’s Targeting tab.
Find the flag targeting rule for which you want to create a progressive rollout and click Edit.
From the Serve menu select “Progressive rollout.” The progressive rollout configuration options appear.
The Progressive rollout option is disabled if there is already a progressive or guarded rollout on another targeting rule, or if there is an experiment running.
For boolean flags, or other flags with only two variations:
The Variation field specifies the variation to serve. All customers receive this variation when the variation is complete. You do not have control over when in the course of the rollout a specific customer starts receiving this variation.
For multivariate flags:
Select the From variation to serve. All customers who are not yet part of a rollout step receive this variation.
Select the To variation to serve. All customers receive this variation when the variation is complete. You do not have control over when in the course of the rollout a specific customer starts receiving the To variation.
Select the Context kind to roll out by.
If you are adding the progressive rollout to the default rule, this can be any context kind.
If you are adding the progressive rollout to a targeting rule, we strongly recommend setting this to the same context kind selected in the targeting rule.
Fill in the progression you would like for the rollout.
(Optional) Adjust the percentage of traffic and the duration of each step.
(Optional) Click the three-dot overflow menu next to a step to add a new step or delete the current step.
Click Review and save.
The progressive rollout begins immediately after you save your changes. It continues for the total duration you have specified. To learn how to stop the rollout before it is complete, read Stop a progressive rollout, below.
Here is an image of the default progressive rollout configuration options:

The progressive rollout configuration options for a flag targeting rule.
View progress of a progressive rollout
When a progressive rollout is active, a progress icon appears on the Flags list:

The Flags list, showing a flag that has a progressive rollout, with the progress icon called out.
You can view details from the flag’s Targeting tab. LaunchDarkly displays the rollout steps on the flag targeting rule:

A progressive rollout in progress on a flag targeting rule.
You cannot edit a flag targeting rule that is currently part of a rollout.
When a progressive rollout completes, you receive an email notification if you started the rollout or if you are following the flag.
Stop a progressive rollout
To stop a progressive rollout that is in progress:
Navigate to the flag’s Targeting tab.
Find the flag targeting rule with a progressive rollout.
Click Stop:

A flag targeting rule with a progressive rollout, with the "Stop" button called out.
In the “Stop progressive rollout” dialog, choose whether to serve the Current percentage or a particular variation.
Choose a specific variation to serve that variation to all traffic for this rule.
Choose Current percentage to serve a percentage rollout for this rule. With this option, LaunchDarkly will reallocate traffic using the standard percentage rollout logic. This means a customer who is receiving one variation as part of the progressive rollout may start receiving a different variation when the progressive rollout stops. The overall percentage of customers receiving each variation will remain at the current levels.
Click Next.
Review the changes you are making to the rule.
(Optional) Enter a Comment about your change. This may be required if your environment requires comments.
Click Save changes.
When a progressive rollout is stopped, the member who started the rollout and any members who are following the flag receive an email notification.
Was this page helpful?
Yes

Guarded rollouts
Guarded rollouts availability
Guarded rollouts are available to customers on a Guardian plan. To learn more, read about our pricing. To upgrade your plan, contact Sales.
All LaunchDarkly accounts include a limited number of guarded rollouts. Use these to evaluate the feature in real-world deployments.
Overview
This topic explains how to use metrics with guarded rollouts to monitor the performance of flag releases and configure LaunchDarkly to take action on the results.

An active guarded rollout on a flag change.
When you begin serving a new flag variation, such as when you toggle a flag on or update the default rule variation, you can select to add a guarded rollout. A guarded rollout progressively increases traffic to the new variation over time while monitoring chosen metrics for regressions, until 100% of your audience is receiving the new variation. If LaunchDarkly detects a regression before you reach 100%, it can stop the release and send you a notification.
Minimum context requirement for guarded rollouts
A new flag variation must be evaluated by a minimum number of contexts during each step of a guarded rollout. If this minimum sample size for guarded rollouts isn’t met, LaunchDarkly automatically rolls back the change.
Guarded rollouts are one of several options that LaunchDarkly provides to help you release features to production safely and gradually. To learn about other options for releasing features, read Releasing features with LaunchDarkly.
View flags with guarded rollouts
To view a list of flags that are currently using or have previously used a guarded rollout, click Guarded rollouts in the left nav. Hover on a flag’s heart icon to view more information about the guarded rollout:

A flag on the Guarded rollouts list with information about its rollout displayed.
You can use the Filters menu to filter the list by rollout status. Navigate to the flag’s Monitoring tab to view and manage the rollout.
You can create a guarded rollout on any flag targeting rule, as long as there are no other guarded rollouts, progressive rollouts, or experiments running on the flag and the flag is not a migration flag.
Metrics and guarded rollouts
You can use metrics to track a variety of system health indicators and end-user behaviors, from engineering metrics like errors and latencies, to product metrics like clicks and conversions. When you combine metrics with a flag change to create a guarded rollout, you can monitor how your flag change impacts those metrics.
You can connect metrics to LaunchDarkly using any of the following methods:
Use one of our metrics integrations
Call the metric import API
Use a LaunchDarkly SDK to send custom events, and connect them to metrics
Enable OpenTelemetry in a LaunchDarkly SDK and send the OpenTelemetry traces to LaunchDarkly to autogenerate metrics
To learn more, read Metrics.
Regressions
When you attach metrics to a flag and then start a guarded rollout, LaunchDarkly detects if the change is having a negative impact on your app or audience. This negative effect is called a “regression.” You can configure LaunchDarkly to either notify you of the regression, or notify you of the regression as well as automatically roll back the release.
Was this page helpful?
Yes

Guarded rollouts
Guarded rollouts availability
Guarded rollouts are available to customers on a Guardian plan. To learn more, read about our pricing. To upgrade your plan, contact Sales.
All LaunchDarkly accounts include a limited number of guarded rollouts. Use these to evaluate the feature in real-world deployments.
Overview
This topic explains how to use metrics with guarded rollouts to monitor the performance of flag releases and configure LaunchDarkly to take action on the results.

An active guarded rollout on a flag change.
When you begin serving a new flag variation, such as when you toggle a flag on or update the default rule variation, you can select to add a guarded rollout. A guarded rollout progressively increases traffic to the new variation over time while monitoring chosen metrics for regressions, until 100% of your audience is receiving the new variation. If LaunchDarkly detects a regression before you reach 100%, it can stop the release and send you a notification.
Minimum context requirement for guarded rollouts
A new flag variation must be evaluated by a minimum number of contexts during each step of a guarded rollout. If this minimum sample size for guarded rollouts isn’t met, LaunchDarkly automatically rolls back the change.
Guarded rollouts are one of several options that LaunchDarkly provides to help you release features to production safely and gradually. To learn about other options for releasing features, read Releasing features with LaunchDarkly.
View flags with guarded rollouts
To view a list of flags that are currently using or have previously used a guarded rollout, click Guarded rollouts in the left nav. Hover on a flag’s heart icon to view more information about the guarded rollout:

A flag on the Guarded rollouts list with information about its rollout displayed.
You can use the Filters menu to filter the list by rollout status. Navigate to the flag’s Monitoring tab to view and manage the rollout.
You can create a guarded rollout on any flag targeting rule, as long as there are no other guarded rollouts, progressive rollouts, or experiments running on the flag and the flag is not a migration flag.
Metrics and guarded rollouts
You can use metrics to track a variety of system health indicators and end-user behaviors, from engineering metrics like errors and latencies, to product metrics like clicks and conversions. When you combine metrics with a flag change to create a guarded rollout, you can monitor how your flag change impacts those metrics.
You can connect metrics to LaunchDarkly using any of the following methods:
Use one of our metrics integrations
Call the metric import API
Use a LaunchDarkly SDK to send custom events, and connect them to metrics
Enable OpenTelemetry in a LaunchDarkly SDK and send the OpenTelemetry traces to LaunchDarkly to autogenerate metrics
To learn more, read Metrics.
Regressions
When you attach metrics to a flag and then start a guarded rollout, LaunchDarkly detects if the change is having a negative impact on your app or audience. This negative effect is called a “regression.” You can configure LaunchDarkly to either notify you of the regression, or notify you of the regression as well as automatically roll back the release.
Creating guarded rollouts
Overview
This topic explains how to create a guarded rollout. Guarded rollouts let you progressively increase traffic to a flag variation over time while monitoring chosen metrics for regressions. If LaunchDarkly detects a regression, it can stop the release and send you a notification.
Guarded rollouts availability
All LaunchDarkly accounts include a limited number of guarded rollouts. Use these to evaluate the feature in real-world deployments.
What happens when a guarded or progressive rollout starts or stops
Guarded rollouts and progressive rollouts use randomized traffic allocation to determine which contexts receive a new variation. Before you create a rollout, understand how context targeting behaves when stopping and restarting the rollout.
If you stop a guarded rollout or progressive rollout and later create a new one on the same flag and variation, LaunchDarkly may serve the variation to a different set of contexts than in the original rollout. This happens because each new guarded or progressive rollout independently assigns contexts to receive the variation, based on the selected randomization unit.
This behavior is different from percentage rollouts, which retain the same set of contexts when you stop and restart them. The same contexts continue to receive the variation, provided the flag configuration and context kind remain unchanged.
Prerequisites
To create a guarded rollout, you should first complete the following prerequisites:
Choose a context kind
You must choose a context kind for the rollout to gradually ramp up traffic to the new flag variation.
If this is your first guarded rollout, read Setting up contexts for guarded rollouts to learn more about best practices for setting up and choosing contexts.
Create metrics
Before you begin a guarded rollout, choose one or more existing metrics or create new ones to monitor. To learn how, read Creating and managing metrics.
Determine regression thresholds
For each metric you use in the guarded rollout, you can use the LaunchDarkly default regression threshold or set a custom one:
The Default option uses LaunchDarkly’s standard regression threshold. This option is appropriate for most guarded rollouts.
The Set custom thresholds option lets you define how much underperformance you’re willing to tolerate in the new variation. LaunchDarkly employs a Bayesian statistical model to assess the probability of a new variation performing worse than the original variation. This model applies to all metrics, whether they use average or percentile analysis methods.
To learn more, read Regression thresholds for guarded rollouts.
Rollout duration
LaunchDarkly evaluates how the treatment variation is performing over a specified time period. You can use the default duration or set a custom schedule. If the variation isn’t exposed to enough contexts during this period, LaunchDarkly will roll back the change.
Create a guarded rollout
You can create a guarded rollout and begin monitoring metrics:
When you toggle the flag on and begin serving a new variation, or
if the flag is already toggled on, when you make a change to a flag variation.
You can create a guarded rollout on any flag targeting rule, as long as there are no other guarded rollouts, progressive rollouts, or experiments running on the flag and the flag is not a migration flag.
When you begin the guarded rollout creation process, a health check status appears at the top of your guarded rollout setup. The health check status indicates if there are any problems with your flag or metric that will prevent LaunchDarkly from monitoring the health of your rollout. To learn more, read Health checks for guarded rollouts.

A guarded rollout with a health warning.
Custom context kinds must be available for experiments
If you want to use a custom context kind as a randomization unit in a guarded rollout, you must edit the context and check the Available for experiments checkbox.
To create a guarded rollout and begin monitoring metrics on a flag:
Navigate to the flag’s Targeting tab.
Find the flag targeting rule for which you want to create a guarded rollout and click Edit.
From the Serve menu, select “Guarded rollout.” The guarded rollout setup options appear.
If the flag is a multivariate flag, choose the new Variation to roll out.
The new variation for boolean flags is the variation not currently being served, by default.
If the flag is a multivariate flag, select a Control variation that the flag can revert to in the event of a regression.
The control variation for boolean flags is the current variation, by default.
Select one or more Metrics to monitor.
Guarded rollouts cannot use Snowflake metrics
If you use Snowflake native Experimentation, you may have configured LaunchDarkly metrics to receive events from Snowflake. You cannot use metrics that receive events from Snowflake with a guarded rollout.
Select a randomization unit to Target by.
Select a regression detection threshold of the LaunchDarkly Default, or Set custom thresholds for each metric.

The guarded rollout setup options on a flag rule.
(Optional) Check the Automatic rollback option if you want LaunchDarkly to automatically revert your change when it detects a regression, in addition to a notification. LaunchDarkly will always roll back a release automatically if it detects a sample ratio mismatch (SRM) or if the release has not been exposed to enough contexts at the end of the rollout period.
Select a Rollout duration. You can use the default duration or set a custom schedule. LaunchDarkly automatically increases the percentage of contexts receiving the new variation over the course of the rollout duration, until it reaches 100%.
Click Review and save.
(Optional) To set the start date and time of the rollout:
Click Schedule + on the “Save changes” modal.
Select a date, time, and timezone.
In the “Comment” field, add a comment to describe the changes.
In the “Confirm” field, enter the environment name or key.
If you selected a date and time, click Schedule changes. Otherwise, click Review and save.

The guarded rollout scheduling option.
The rule displays the percentage of contexts that have been exposed to the new variation:

A flag rule with a guarded rollout.
Minimum context requirement for guarded rollouts
A new flag variation must be evaluated by a minimum number of contexts during each step of a guarded rollout. If this minimum sample size for guarded rollouts isn’t met, LaunchDarkly automatically rolls back the change.
The top of the flag’s targeting tab also displays the status of the guarded rollout. To view more details about the guarded rollout, click on the flag’s Monitoring tab. To learn more, read Managing guarded rollouts.
If LaunchDarkly detects a regression, LaunchDarkly sends you an email, an in-app notification, and, if you have the integration configured, a Slack, Microsoft Teams, or PagerDuty notification. To learn how to set up these integrations, read Setting up Slack accounts and permissions, Setting up the Microsoft Teams integration, and PagerDuty for guarded rollouts.

You can also use the REST API: Update feature flag
Setting up contexts for guarded rollouts
Overview
This topic explains how to set up context kinds for use in guarded rollouts.
Guarded rollouts availability
All LaunchDarkly accounts include a limited trial of guarded rollouts. Use them to see how well the feature supports your release process in production.
Randomization units
A guarded rollout uses a single context kind, called a randomization unit, to determine how to assign traffic to flag variations.
Most guarded rollouts use the request or user context kind as the randomization unit. This means the rollout assigns variations based on the request or user evaluating the flag. You can also use a different context kind, such as device or organization, depending on how your application is configured.
Deciding the randomization unit
A randomization unit must be available both in the flag and in any metrics you want to monitor.
We recommend choosing a randomization unit that has a lot of unique contexts evaluating the flag, so LaunchDarkly can determine more quickly whether or not the new variation has impacted performance.
Minimum context requirement for guarded rollouts
A new flag variation must be evaluated by a minimum number of contexts to be able to progress to the next stage of the rollout. If this minimum sample size for guarded rollouts isn’t met, LaunchDarkly automatically rolls back the change.
Requests
For backend-only changes, a request context kind is often the best choice because systems generate many distinct requests, and backend metrics such as latency and error rate are typically measured per request.
To use request contexts, configure a context with the kind set to "request" and a key that’s some unique value that stays consistent throughout the request:
{
 "kind": "request",
 "key": "request-key-abc-123"
}

Users
A user randomization unit is often the best choice for:
frontend-only changes
backend changes that may affect frontend metrics
backend changes that may impact performance outside the scope of the current request
Confirm that your user context represents a distinct user
If you use LaunchDarkly, you likely already use user contexts, as this is the default context kind used in LaunchDarkly SDKs. However, be sure that your user keys represent distinct users of your application. If they represent something else, like organizations or requests, your rollouts may not behave the way you expect.
To use user contexts, configure a context with the kind set to "user" and a key that uniquely identifies the user across all interactions:
{
 "kind": "user",
 "key": "user-key-123abc",
 "name": "Anna"
}

If your application supports logged-in and logged-out end users, you should ensure that every logged-in and logged-out user gets a distinct key that stays consistent throughout their experience. To learn more, read Managing experiments with logged-out and logged-in end users.
Multi-contexts
Making a context kind available in your guarded rollouts requires consistent instrumentation throughout any of your application code that uses LaunchDarkly. To make this easier, we recommend using multi-contexts to include more than one context kind in each evaluation.
For example, if your application has both a frontend and a backend service:
On the client side, set the current context to a multi-context containing all the contexts the frontend knows about, such as user and device.
On the server side, create a multi-context containing all the contexts the backend knows about, such as user and request. Then use the multi-context as the context when evaluating flags.
If you use custom events to track backend metrics, make sure any event tracking calls use the same multi-context as the flag evaluations.
In larger codebases, a common approach is to create middleware for your service that sets the LaunchDarkly context for each request consistently.
Making context kinds available in guarded rollouts
Before you can use a particular context kind as a randomization unit, you must make it available.
First, when editing or creating the context kind, mark it as Available for experiments. You must also select an industry-standard randomization unit to associate with the context kind.

The "New context kind" dialog with the "Available for experiments" checkbox and randomization unit mapping field called out.
After that, you can configure any metrics that can be measured for that context kind to use it

The "Metric definition" section of a new metric with the randomization unit called out.
When creating a guarded rollout, you must select a randomization unit that is supported by every metric you want to monitor. The available context kinds are based on the randomization units supported by the metrics you select.
Health checks for guarded rollouts
Overview
This topic explains how to use health checks for guarded rollouts to verify that you set up your guarded rollout correctly and fix any problems with your configuration.
Guarded rollouts availability
All LaunchDarkly accounts include a limited number of guarded rollouts. Use these to evaluate the feature in real-world deployments.
Health check statuses
When you create a guarded rollout, LaunchDarkly provides a health check status at the top of your guarded rollout setup.
The health check statuses include:
Health check waiting: LaunchDarkly does not have enough information yet about your guarded rollout configuration to determine its health status
Healthy: Your flag is receiving evaluations, your metrics are tracking events, and your flag and metrics are encountering the same context kinds
Health check warnings: There is at least one problem with your guarded rollout configuration
Hover on the status to view your rollout’s health checks:

A guarded rollout with a health warning.
The individual health checks are explained below.
Flag evaluations
The flag evaluation health check can have a status of:
Flag is receiving evaluations: Contexts are encountering your flag, and your SDKs are sending flag evaluation information to LaunchDarkly.
Flag is not receiving evaluations: Either your flag is not configured correctly in your code, or your SDK is not set up correctly.
You can expand the Evaluations graph at the top of the flag Targeting tab to view how many contexts are encountering the flag and which variation they are receiving.
Flag context kinds
Your flag should be encountering context kinds that match the randomization unit that you chose in the Target by menu for the guarded rollout. If a flag encounters other context kinds, LaunchDarkly will not be able to measure the performance of the rollout.
The flag context kind health check can have a status of:
Flag is seeing [context kind]: The flag is being evaluated by contexts with the same kind as the guarded rollout’s randomization unit.
Flag is not seeing [context kind]: The flag is being evaluated by contexts with a different context kind than the one you selected for the guarded rollout. Either update the guarded rollout’s randomization unit, or investigate why your flag is not encountering the context kinds you expect.
To learn more, read Randomization unit and Context kinds.
Metric randomization units
The metric randomization units health check only appears if LaunchDarkly is receiving events for the metric.
Your selected metrics should use the same randomization unit that you chose in the Target by menu for the guarded rollout. If a metric is tracking a different randomization unit, LaunchDarkly will not be able to measure the performance of the rollout.
The metric randomization unit health check can have a status of:
[Randomization unit] is tracked by [Metric name]: The metric shares the same randomization unit as the one you selected for the guarded rollout.
[Randomization unit] is not tracked by [Metric name]: The metric uses a different randomization unit than the one you selected for the guarded rollout. This can occur because randomization units are based on how the metric was configured, not on actual data sent to LaunchDarkly.
For example, you might select Member as the randomization unit because it was available during setup. If your SDK does not send context data for Member, the metric cannot be evaluated.
To fix this, choose a different metric, change the randomization unit for the rollout, or edit your metric configuration.
Metric events
The metric events health check can have a status of:
Recently seen events for [metric name]: Your metric has sent metric events to LaunchDarkly within the last 90 days. This means your metric was active and correctly sending data.
No recently seen events for [metric name]: Your metric has not sent any metric events to LaunchDarkly within the last 90 days. This may indicate a misconfiguration or inactivity.
You can also check if a metric is sending events to LaunchDarkly by viewing its Activity tab.
Regression thresholds for guarded rollouts
This topic includes advanced concepts
This section includes an explanation of advanced statistical concepts. We provide them for informational purposes, but you do not need to understand these concepts to use guarded rollouts.
Overview
This topic explains how to determine a custom regression threshold for a guarded rollout.
Guarded rollouts availability
All LaunchDarkly accounts include a limited number of guarded rollouts. Use these to evaluate the feature in real-world deployments.
For each metric you use in a guarded rollout, you can use the LaunchDarkly default regression threshold or a custom threshold:
The Default option uses LaunchDarkly’s standard regression threshold, appropriate for most use cases.
The Set custom thresholds option lets you define how much underperformance you’re willing to tolerate. This option requires familiarity with statistical concepts, which are explained below.
Minimum context requirement for guarded rollouts
A new flag variation must be evaluated by a minimum number of contexts during each step of a guarded rollout. If this minimum sample size isn’t met, LaunchDarkly automatically rolls back the change.
Regression thresholds
When you create a guarded rollout, the regression threshold represents the level of underperformance you’re willing to tolerate in the new variation you’re rolling out, called the “treatment,” as compared to the original variation, called the “control.” The threshold value ranges from 0% to 100%.
Here’s what the values mean:
Thresholds closer to 0%: A more conservative approach with minimal tolerance for performance drops. This indicates little tolerance for risk that the new variation performs worse than the original.
Thresholds closer to 100%: A less conservative approach with greater tolerance for potential regressions. This indicates greater tolerance for risk, meaning you are more willing to accept the possibility of the new variation performing worse than the original.
If you want to prioritize detecting even small regressions, set the threshold lower. If you’re comfortable with some performance degradation, you can increase the threshold to a value greater than 0%.
How regression thresholds work
Regression thresholds are relative, not absolute. They compare the performance of the new variation to the original variation.
LaunchDarkly considers a regression to have occurred when the relative difference between the new and original variations exceeds your specified threshold:
How regression threshold is used for lower-is-better metric
( (New - Original) / Original ) > threshold

How regression threshold is used for higher-is-better metric
( (New - Original) / Original ) < - threshold

Where:
New is the metric value for the new variation
Original is the metric value for the original variation
LaunchDarkly compares the relative difference between the two values. For example, if the original error rate is 5%, a 10% threshold means the new variation must exceed 5.5% before it’s flagged as a regression.
Example
Consider an error rate metric, where the lower is better. If the original’s error rate is 5% and the regression threshold is set to 10%, LaunchDarkly detects a regression when the new error rate exceeds 5.5% with high probability, as calculated here:
Calculation of highest acceptable error rate for the new variation
5% × (1 + 0.10) = 5.5%

LaunchDarkly uses a probability to be worse model to evaluate this condition. This means LaunchDarkly calculates the likelihood that the new variation performs worse than the original variation by more than the specified threshold. If that probability exceeds 95%, LaunchDarkly detects a regression.
Risk tolerance and threshold selection
The regression threshold acts as a tuning parameter for your risk tolerance:
Use lower thresholds to detect regressions quickly and be more conservative.
Use higher thresholds to allow for more variability in metric performance before detecting a regression.
Common misconceptions
For a deeper explanation of how regression thresholds work in practice, read the blog post Defining regression thresholds for guarded rollouts.
Regression thresholds can be misunderstood. Consider an error rate metric, where the lower is better. Here are some common incorrect interpretations:
“If I set the regression threshold to 10%, LaunchDarkly will detect a regression when the metric reaches 10%.” This is False.
“A 10% threshold means the new variation must be 10% of the original value to count as a regression.” This is False.
Correct interpretation:
“A 10% regression threshold means the new variation must be more than 10% worse relative to the original variation.”
For example, if the original variation’s error rate is 5%, a regression is detected only if the new variation’s error rate exceeds 5.5%.
Direction of improvement and the concept of “worse”
Metrics may have different “success criteria,” defined in the metric configuration:
For metrics where lower is better (for example: latency, error rate), an increase may indicate a regression.
For metrics where higher is better (for example: conversions, revenue), a decrease may indicate a regression.
The regression threshold defines how much deviation from the original variation you’re willing to accept.
LaunchDarkly uses a “probability to be worse” method to detect regressions. This represents the likelihood that the new variation is worse than the original variation by more than the allowed threshold. If this probability exceeds 95%, LaunchDarkly detects a regression.
Custom threshold calculation methods
LaunchDarkly uses a Bayesian statistical model to assess the probability of a new variation performing worse than the original variation. You can customize the threshold if needed. LaunchDarkly uses the custom threshold to determine what constitutes “worse” by comparing the relative difference between the new and original variations. Then, LaunchDarkly calculates the probability of the new variation being worse. If this probability surpasses 95%, LaunchDarkly identifies a regression.
For examples of customized thresholds with metrics using different analysis methods, read Analysis method.
Example: A metric using the “Average” analysis method
Imagine you are using a metric with the “Average” analysis method in a guarded rollout, and the metric represents conversion rate, so the higher is better. The true conversion rate of the original variation is 2%, and you set the regression threshold to 10%.
In this example, LaunchDarkly detects a regression when 
P(true conversion rate of new variation<2%⋅(100%−10%))=P(true conversion rate of new variation<1.8%)>95%
P(true conversion rate of new variation<2%⋅(100%−10%))=P(true conversion rate of new variation<1.8%)>95%.
In other words, LaunchDarkly detects a regression when there is a 95% probability that the true, unknown conversion rate of the new variation would be smaller than 1.8%, given the evidence provided by the observed data. The threshold is with respect to the relative difference of the new variation’s mean and original variation’s mean.
Example: A metric using the “Percentile” analysis method
This example follows the same structure as the “Average” analysis method example, but applies to a percentile-based metric where lower values are better.
Imagine you are using a metric with the “Percentile” analysis method in a guarded rollout that measures 90th percentile of latency, so the lower is better. The percentile of the original variation is 1,000 ms, and you set the regression threshold to 10%.
In this example, LaunchDarkly detects a regression when 
P(true 90th percentile of new variation>1000⋅(100%+10%))=P(true 90th percentile of new variation>1100)>95%
P(true 90th percentile of new variation>1000⋅(100%+10%))=P(true 90th percentile of new variation>1100)>95%.
In other words, LaunchDarkly detects a regression when there is a 95% probability that the new variation’s true 90th percentile latency exceeds 1,100 ms, based on the observed data. The threshold is with respect to the relative difference of the new variation’s 90th percentile and original variation’s 90th percentile.
Bayesian evaluation behavior for percentile metrics
When all data points in a rollout include Bayesian regression data, LaunchDarkly uses a Bayesian approach to evaluate percentile metrics. This method assesses the probability that the treatment variation is worse than the control variation, rather than comparing interval boundaries. If any data point is missing Bayesian data, LaunchDarkly uses the original credible interval comparison instead.
Managing guarded rollouts
Overview
This topic explains how to manage guarded rollouts.
Guarded rollouts availability
All LaunchDarkly accounts include a limited number of guarded rollouts. Use these to evaluate the feature in real-world deployments.
Monitor a guarded rollout
You can monitor a guarded rollout on a flag’s Monitoring tab. The Monitoring tab displays the monitoring progression, how many contexts have been exposed to the new variation, and how each variation is performing against the control variation:

Guarded rollout results on a flag's Monitoring tab.
From the Monitoring tab, you can:
Use the date range picker to view results over a selected period of time
Hover on a graph to view more details about each metric
Manually roll back the release
Dismiss a regression alert and continue with the rollout
Stop monitoring the rollout early
Monitoring charts
The charts on the Monitoring tab displays the following information for each metric you included in the guarded rollout:
Metric: the metric name
Graph: a chart showing the metric’s performance over time
Treatment estimate: the point estimate of the metric for the treatment variation
Diff. from control: the relative difference from the control variation
Auto rollback: whether you enabled auto-rollback for that metric in the case of a regression
In LaunchDarkly, hover over the metric performance graph to view more information about that metric and any regressions detected:

A guarded rollout chart for a metric with a regression.
Why metric results might differ across rollouts
Treatment estimates
“Treatment estimates” are point estimates of the metric value for the treatment variation. A point estimate uses sample data to calculate a single value that serves as the best approximation of the metric’s true value.
For metrics that use a percentile analysis method, such as latency at the 99th percentile, the “Treatment estimate” column displays the estimated percentile value for contexts that received the treatment variation.
For metrics that use the average analysis method, such as average response time or conversion rate, the “Treatment estimate” column displays the average metric value for contexts that received the treatment variation.
Relative difference from control
The relative difference from the control variation measures how much a metric in the treatment variation differs from the control variation, expressed as a proportion of the control’s estimated value. LaunchDarkly calculates this by taking the difference between the treatment variation’s estimated value and the control variation’s estimated value, then dividing that difference by the control variation’s estimated value.
Roll back releases
To manually roll back a release after LaunchDarkly has detected a regression:
Navigate to the flag’s Targeting or Monitoring tab.
Click Roll back. The “Stop rollout early” dialog appears.
Choose which Variation to serve to all contexts after you stop monitoring. The field defaults to the control variation.
Click Stop.
If you are using a guarded rollout on a prerequisite flag and you roll back the change, LaunchDarkly will not also roll back any changes on the dependent flags. You must roll back changes on dependent flags separately.
Automatic rollback behavior
LaunchDarkly automatically rolls back a guarded rollout in these scenarios:
If LaunchDarkly detects a regression at any time during the rollout, and you have automatic rollback enabled.
If LaunchDarkly detects a sample ratio mismatch (SRM) any time during the rollout. LaunchDarkly will roll back a release with an SRM whether or not you have automatic rollback enabled. To learn how to fix SRMs, read Understanding sample ratios.
If too few contexts see the new variation by the end of the rollout, LaunchDarkly cannot detect a regression. In this case, it rolls back the release, even if automatic rollback is off. To improve results, try the rollout again with a longer duration.
When LaunchDarkly automatically rolls back a rollout, it sends an email and, if you use the LaunchDarkly Slack or Microsoft Teams app, a Slack or Teams notification.

A guarded rollout with insufficient context exposure.
If you are using a guarded rollout on a prerequisite flag and LaunchDarkly automatically rolls back the change, it will not also roll back any changes on the dependent flags. You must roll back changes on dependent flags separately.
Dismiss regression alerts
If LaunchDarkly detects a regression, but you want to continue with the release, you can dismiss the regression alert.
To dismiss an alert:
Navigate to the flag’s Targeting or Monitoring tab.
Click Dismiss alert. The “Dismiss alert” dialog appears.
Click Dismiss alert.
If LaunchDarkly detects another regression, you will receive another alert. If LaunchDarkly does not detect any additional regressions, the release will continue.
Stop monitoring early
To stop monitoring before the monitoring window is over:
Navigate to the flag’s Targeting or Monitoring tab.
Click Stop monitoring. The “Stop monitoring” dialog appears.
Choose which Variation to serve to all contexts after you stop monitoring. The field defaults to the control variation.
Click Stop.

You can also use the REST API: Update feature flag
Feature monitoring
LaunchDarkly observability features are available for early access
LaunchDarkly’s observability features are publicly available in early access.
They currently require the LaunchDarkly observability plugins and the JavaScript, React Web, or Vue SDK.
If you are interested participating in the Early Access Program for our upcoming observability plugins for server-side SDKs, sign up here.
Overview
This topic explains how to use feature monitoring to evaluate the performance of a feature flag. Feature monitoring gives you visibility into whether a newly-released flag variation is having any negative impacts on user experience by monitoring front-end LaunchDarkly metrics, including including front-end errors, Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift.
This functionality is available through an observability plugin to LaunchDarkly client-side SDKs. You can enable these when you initialize the LaunchDarkly client in your app. To learn how, read about LaunchDarkly’s Observability plugin.
To learn how to view information about flag evaluations, read Flag evaluations. To learn how to view incoming flag events, read Live events.
Feature monitoring charts
To view feature monitoring charts, navigate to the “System-wide” section of a flag’s Monitoring tab:

The system-wide charts on a flag's monitoring tab.
These charts are system-wide, which means that they measure changes related to all flags withing the project. Therefore, any metric changes aren’t necessarily directly related to your specific flag change. For example, if you rolled out two new variations of two different flags at the same time, and you saw a spike in errors, you might not know which flag change caused the error spike.
Vertical dotted lines indicate a flag change, and can help you associate flag changes with changes to system-wide metrics. Hover on a dotted line to view the flag change.
For example, the spike in INP time here may be due to changing the default variation for this flag:

An INP chart with an associated flag change.
Total errors
Total errors measures the number of front-end errors users encountered in your app. The event key is $ld:telemetry:error.
Largest Contentful Paint
This feature is available to customers on select plans
The Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS) charts are available to customers on a Guardian plan. To learn more, read about our pricing. To upgrade your plan, contact Sales.
Largest Contentful Paint (LCP) measures how quickly a website renders the largest piece of visible content of a webpage. It uses the “Average Largest Contentful Paint (LCP) per context (LaunchDarkly)” metric autogenerated from observability events. The event key is $ld:telemetry:metric:lcp.
Interaction to Next Paint
Interaction to Next Paint (INP) measures how quickly a website responds to user interactions. It uses the “Average Interaction to Next Paint (INP) per context (LaunchDarkly)” metric autogenerated from observability events. The event key is $ld:telemetry:metric:inp.
Cumulative Layout Shift
Cumulative Layout Shift (CLS) measures how much content on a page shifts unexpectedly while loading. It uses the “Average Cumulative Layout Shift (CLS) per context (LaunchDarkly)” metric autogenerated from observability events. The event key is $ld:telemetry:metric:cls.
Share feature monitoring charts
To share a direct link to a chart, click the three-dot overflow menu and select “Copy link”:

The three-dot overflow menu on a system-wide chart.
To save a .png version of a chart, click the three-dot overflow menu and select “Save as PNG.”
Flag history
You can use the Flag history tab to view recent changes and help associate flag changes with any changes to system-wide metrics.
You can also view a flag’s change history by clicking the clock icon from any page. To learn more, read Change history.
Was this page helpful?
Yes

Flag evaluations
Overview
This topic explains how to use flag evaluations graphs to observe flag evaluations over time. Flag evaluations graphs give your engineering and product teams insight into how many times different contexts are receiving each variation of a flag over time, as well as any changes to the flag that could have affected how many times each flag was evaluated.
About flag evaluations
The flag evaluations graph on a flag’s Targeting tab gives your engineering and product teams insight into how many times different contexts are receiving each version of a flag over time, as well as any changes to the flag that could have affected how many times each flag was evaluated.
To view a flag’s evaluations graph:
Navigate to the Flags list.
Click the name of the flag you want to view evaluations over time for. The flag’s Targeting tab appears.
Click Evaluations to expand the section.
The flag evaluations graph displays flag evaluations over time. Hover on a specific date to view the number of flag evaluations and any changes you made to the flag on that date:

The flag evaluations graph.
The default date range is the last seven days. To change the date range, click Last 7 days and select a new date range.
Only flag evaluations are recorded
LaunchDarkly generates the flag evaluations graph based on analytics events, which are sent from variation calls from the LaunchDarkly SDKs. To learn more, read Evaluating flags.
Other SDK methods, such as getting all flags, typically do not populate the flag evaluations graph. To learn more and review the exceptions to this, read About the all flags feature.
Evaluation display
LaunchDarkly generates the flag evaluations graph on a per-flag evaluation basis, not a per-context instance basis. This means that if the same context instance is evaluated 20 times, the flag evaluations graph records and displays all 20 evaluations. New evaluations appear on the flag evaluations graph within one to two minutes.
Enhanced flag evaluations charts
The enhanced flag evaluations chart on a flag’s Monitoring tab gives you deeper insights to how different variations are performing over time.
To view a flag’s enhanced evaluations chart:
Navigate to the Flags list.
Click the name of the flag you want to view evaluations over time for. The flag’s Targeting tab appears.
Click the Monitoring tab.
The flag evaluations charts appear in the “Flag-specific” section.
The default evaluations chart displays the total number of flag evaluations for each flag variation over time. You can change the time range from the previous hour, to the previous three months:

The enhanced flag evaluations chart on a flag's monitoring tab.
You can use the All variations menu to view a single variation at time.
To share a direct link to the chart, click the three-dot overflow menu and select “Copy link.” To save a .png version of a chart, select “Save as PNG.”
View evaluations by application or SDK
Depending on your SDK and its configuration, you can view flag evaluations by specific applications or specific SDKs. To do this:
In the evaluations chart, click Breakdown.
Select Application or SDK.
Individual charts appear for each application or SDK that is sending flag evaluations to LaunchDarkly. Each chart lists the percentage of overall evaluations coming from that specific app or SDK.
To learn how to configure your SDK to send application metadata to LaunchDarkly, read Automatic environment attributes and application metadata configuration.

Flag evaluations broken down by SDK.
Was this page helpful?
Yes

Live events
Overview
This topic explains how to use live events.
The Live events page gives you real-time insight into the events your application is sending to LaunchDarkly, so you can ensure that you’ve set up LaunchDarkly correctly. Different types of events appear, in detail or in summary, depending on what you want to view.
About live events
The Live events page shows you a real-time stream of events arriving in LaunchDarkly from your app. When you first open the page, it connects to the event stream to show events as they appear. Establishing the connection can take up to 30 seconds, but the connection state updates to show you the connection process status. In high-volume environments, it may display sampled events, rather than 100% of events.
Click Filters and choose from the Flags, Contexts, and Metrics filters to view subsets of your live events. Use the search bar to search for specific events by context or event type, key, or kind.
The Live events page must be active to work
The Live events page does not process new events when it is not the active tab in your browser. Leave it open and visible to view new events as they occur. If you need to click around in your app to generate events, open your app in a second window.
The Live events page will time out after ten minutes of inactivity. After the timeout, click the prompt to keep loading events.
The connection state for the Live events page indicates if events have occurred in your environment recently:
Connected and waiting for events, last flag evaluation occurred N days/minutes/seconds ago: LaunchDarkly is connected to a live event stream with recent events.
Connected and waiting for events, but we haven’t seen any events in this environment before: LaunchDarkly is connected to a live event stream, with no events received yet. If you receive this status frequently, it may mean that you have configured your SDK incorrectly. To learn more, read SDKs.
Disconnected from event stream: LaunchDarkly is not connected to a live event stream. This may appear because of an internal error or network disruptions. Refresh your browser, or click the Resume button to reconnect:

The "Resume" button on the Live events page.
If you don’t see the events you expect on the Live events page, read the troubleshooting article in the LaunchDarkly Customer Knowledge Base.
Flag events
To view live events by flag, use the Flags filter:

The "Flags" filter on the Live events page.
There are three types of events that can appear on the Live events page when you filter by flags:
Feature events
Summary events
Debug events
Feature events
Feature events include specific flag evaluation details. For more information about the contexts used in the flag evaluation, click View attributes. A dialog appears listing the context’s attributes and includes a link to the context details page. To view an example, read Feature events.
Summary events
Summary events display a summary of flag evaluation events. This saves data load. To view an example, read Summary events.
Older SDK versions send detailed events for every evaluation, rather than summary events.
Click to expand the minimum required SDK version to use summary events
























Debug events
Debug events describe feature flag evaluations. The information can help you to troubleshoot feature flag evaluations.
To enable debug events, click Full fidelity details next to the summary event for a flag. This sends an update to the LaunchDarkly SDK. Then, the SDK sets the debugEventsUntilDate field and temporarily generates debug events for that flag. To view the details of a generated debug event, click View attributes next to the debug event for a flag.
To view an example, read Debug events.
Context events
To view only live events related to specific contexts, use the Contexts filter.
There are two types of context events that display on the Live events page:
Identify events are explicitly triggered by your application code
Index events are automatically triggered by the LaunchDarkly SDK based on flag evaluations
To view examples, read Identify events and Index events.
For more information about the context, click View attributes. A dialog appears listing the context’s attributes and includes a link to the context details page.
Context events do not display information about the specific flag that was evaluated for this context. To find the corresponding flag, you can copy the context key from the “Key” column, and then search for that key under the Flags filter.

The list of context events, with the "Copy to clipboard" button and the search field called out.
Metric events
To view only live events related to metrics, use the Metrics filter.
There are three types of metric events that display on the Live events page::
Click events
Page view events
Custom events
These events correspond to the kind of metric that triggered the event. To view examples, read Click events, Page view events, and Custom events.
For more information about the metric that sent the event, click the event key in the “Event” column.
For more information about the context that encountered the metric, click View attributes. A dialog appears listing the context’s attributes and includes a link to the context details page.
To learn how to view more information about metric events, read View incoming events.
Event schema
For details on the JSON schema for each type of event described in this topic, read Data Export schema reference.
Release pipelines
Release pipelines are available to customers on select plans
Release pipelines are only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
Overview
This topic explains how you can use LaunchDarkly’s release assistant capabilities, including release pipelines, to standardize and automate the release process for your feature flags. Release pipelines let you move flags through a series of phases, rolling out flags to selected environments and audiences following automated steps. This combination of release pipelines and automated steps is called Release assistant in the LaunchDarkly user interface.
Release strategies
You can set up one or more release strategies for each phase, determining:
The environment to roll out to
The audience to roll out to within the environment, including either everyone, or only selected segments
Whether approvals are required
Whether to release immediately, or use a guarded rollout to roll out gradually and prevent regressions
When you add a flag to a release pipeline, LaunchDarkly automatically performs the actions you set up as the flag moves through each phase.
Automated releases is available for boolean flags only
JSON, string, and number flags cannot be added to a release pipeline.
View release pipelines
Click on Release assistant in the left nav to view the default release pipeline within a project:

The default release pipeline. This one is named "Primary release pipeline."
Each project can have up to 20 release pipelines.
Click the dropdown menu with the release pipeline name and choose Manage release pipelines to view the list of release pipelines within a project:

The "Release pipelines" list.

You can also use the REST API: Get all release pipelines, Get release pipeline by key
When a flag is included in a release pipeline, you can view each phase in the pipeline in the flag’s right sidebar.
To see the steps required for each phase, click the expand arrows for the phase:

An expanded phase in a release pipeline in a flag's sidebar with the expand arrows called out.

You can also use the REST API: Get release for flag
Release pipelines are one of several options that LaunchDarkly provides to help you release features to production safely and gradually. To learn more about options for releasing features gradually and safely, read Releasing features with LaunchDarkly.
To learn how to create, manage, and delete release pipelines, read the topics in this category:
Creating release pipelines
Adding and removing flags from release pipelines
Managing release pipelines
Deleting release pipelines
Creating release pipelines
Overview
This topic explains how to create and configure release pipelines to use in automated releases.
After you create a release pipeline, you can create a release strategy by configuring automation unique to each phase in the pipeline. Then, you can add flags to your pipeline. To learn how, read Adding and removing flags from release pipelines.
Create release pipelines
Creating release pipelines requires specific permissions
You can only create and delete release pipelines if you have a role that allows the createReleasePipeline and deleteReleasePipeline actions. The LaunchDarkly Project Admin and Maintainer project roles, as well as the Admin and Owner base roles, all have this ability. To learn more, read About member roles and Release pipeline actions.
You can create up to ten phases in a release pipeline.
To create a release pipeline:
Navigate to Release assistant.
If you have one or more release pipelines set up for your project, the default release pipeline and its releases appear. Click the release pipeline name, and select Manage release pipelines.
Click Create release pipeline.
(Optional) Click into the title field to update the name.
(Optional) Click into the key field to update the automatically-generated key.
(Optional) Click Add description to add a description for this release pipeline.
(Optional) Click Add tags to choose from available tags.
The release pipeline automatically includes two phases: Testing and Production. You can add additional phases as needed, and configure release strategies for each phase.
If this is the first release pipeline in your project, it will be used as the default for all new flags created in this project.
After you create a release pipeline, you can edit any of its information, except for the release pipeline key, until you add flag s to it. After you add flags to a release pipeline, you can only edit the pipeline name, description, tags, and phase names. This ensures that all flags are going through the same standardized release process.

You can also use the REST API: Create a release pipeline
Configure release strategies
Each phase in a pipeline can include multiple release strategies.
You can specify details on automation, approvals, and guarded rollouts for each phase:

A phase within a release pipeline.
To configure a release strategy:
Select the Environment for the release strategy.
Select the Audience to decide if flags should be enabled for either:
everyone targeted in each flag’s default rules, or
only certain segments. If you choose to release the flag to only certain segments, LaunchDarkly will automatically create a rule on your flag to target those segments when you start the release.
(Optional) Check Require approval to start to require approvals.
Under Reviewers, click + and select approvers from the list.
Select a release Strategy of one of the following:
an immediate rollout
a guarded rollout. If you choose a guarded rollout, a guarded rollout will be added to the rule for the audience you selected in step 2.
Click Done.
(Optional) Click Add another release strategy to add an additional strategy.
To reorder phases, click the left and right arrows to “Move phase left” or “Move phase right.”
To delete a phase, click the three-dot overflow menu and select Delete phase.
When you are finished adding phases and configuring release strategies, click Create release pipeline.

A complete release pipeline.
Was this page helpful?
Yes

Adding and removing flags from release pipelines
Overview
This topic explains how to add, remove, and move flags between existing release pipelines.
After you have created a release pipeline, you are redirected to the releases view to add your first flags to the pipeline. You can add only boolean flags to release pipelines.
Add flags to release pipelines
To add a flag to a release pipeline:
From the flags list, navigate to the boolean flag you want to add to a release pipeline.
Click Start release in the right sidebar. If there is more than one release available, select the release you want to add the flag to.

The "Start release" option.
The release appears in the right sidebar.

You can also use the REST API: Create a new release for flag
Begin phases
After you have set up the automation for each of your phases, you can begin a phase for an individual flag. This activates the automation within that phase for that flag.
To begin a phase for a flag:
From the flag’s right sidebar, find the phase you want to begin.
Click the start arrow for the phase. A “Start phase” dialog appears
Click Start.
Release pipelines run the following automated steps when you start the phase for a flag:
If the phase includes an approval, starting the phase sends an approval request to toggle the flag on. When the approval request is approved and applied, then LaunchDarkly automatically toggles the flag.
If the phase includes a guarded rollout, starting the phase automatically begins the monitoring process for the traffic allocation and duration specified in the phase.
When the phase is complete, the next phase in the release pipeline is marked as “Ready to start.”

A release pipeline's phases in a flag's sidebar.
When you’re ready for the flag to move through the next phase, click the start arrow for that phase.
Each time a flag begins or completes a phase, anyone following the flag receives an email notification and, if you have the Slack integration configured, a Slack notification.

You can also use the REST API: Update phase status for release
Move flags between release pipelines
If a flag is already assigned to a release pipeline, you can move it to another pipeline.
To move a flag:
From the flag’s right sidebar, click the three-dot overflow menu for the release.
Hover over Move to pipeline and select the release you want to move the flag to.
Enter the name or key of the release to confirm.
Click Move.
Remove flags from release pipelines
To remove a flag from a release pipeline, navigate to the flag’s right sidebar, click the three-dot overflow menu for the release, and then click Cancel release.

You can also use the REST API: Delete a release for flag
Managing release pipelines
Overview
This topic explains how to duplicate and manage release pipelines.
Duplicate release pipelines
As an alternative to creating a new pipeline, you can duplicate an existing one and edit it to make it unique. This may be faster if you wish to create multiple similar release pipelines.
To duplicate an existing release pipeline:
Navigate to Release assistant. The default release pipeline and its releases appear.
Click the release pipeline name, and select Manage release pipelines. The release pipeline list appears.
Find the release pipeline you wish to duplicate. Select its three-dot overflow menu.
Choose Duplicate. The new release pipeline opens in a new tab. You can identify it because it has the same name as the original release pipeline with (copy) appended to the end.
Modify the new release pipeline as needed.

The release pipeline "Duplicate" option.
After you create a release pipeline, you can edit any of its information, except for the release pipeline key, until you add releases to it. After you add releases to a release pipeline, you can only edit the pipeline name, description, tags, and phase names. This ensures that all flags are going through the same standardized release process.
Update release pipelines
You can update both the default release pipeline other release pipelines that are not the default.
Update default release pipelines
To update the default release pipeline:
Navigate to Release assistant. The default release pipeline and its releases appear.
Click the release pipeline name, and select Edit release pipeline.
Modify the release pipeline as needed.
If there are no releases, you can edit the name, description, tags, phase names, phases, and audiences.
If there are releases in the pipeline, you can edit the name, description, and tags.
Click Save release pipeline.
Update other release pipelines
To update a release pipeline that is not the default:
Navigate to Release assistant. The default release pipeline and its releases appear.
Click the release pipeline name, and select Manage release pipelines. The release pipeline list appears.
Find the release pipeline you wish to duplicate. Select its three-dot overflow menu and choose Edit.
Modify the release pipeline as needed.
If there are no releases, you can edit the name, description, tags, phase names, phases, and audiences.
If there are releases in the pipeline, you can edit the name, description, and tags.
Click Save release pipeline.
Set a default release pipeline
The first release pipeline you create automatically becomes your project’s default release pipeline. If you have more than one pipeline, you can change the default.
To change a default release pipeline:
Navigate to Release assistant. The default release pipeline and its releases appear.
Click the release pipeline name, and select Manage release pipelines. The release pipeline list appears.
Find the release pipeline you wish to make the default release pipeline for this project. Select its three-dot overflow menu.
Choose Make default.

A release pipeline's overflow menu with the "Make default" option called out.

You can also use the REST API: Update a release pipeline
Deleting release pipelines
Overview
This topic explains how to delete release pipelines.
Delete release pipelines
You can only delete release pipelines that do not have any active releases. If there are any flags in any phase of a release pipeline, you cannot delete the pipeline.
To delete a release pipeline:
Navigate to Release assistant. The default release pipeline and its releases appear.
Click the release pipeline name, and select Manage release pipelines. The release pipelines list appears.
Click the three-dot overflow menu next to the release pipeline you want to delete and select Delete.

The "Delete release pipeline" option.
Enter the pipeline’s name or key to confirm.
Click Delete.
Release management tools
Release management tools are available to customers on select plans
Release management tools are only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
Overview
This category explains how you can more finely control your use of feature flags by release management tools within LaunchDarkly. Release management tools map to how your teams build, ship, and control software. You can also define custom release strategies that integrate LaunchDarkly with your organization’s existing tools and processes.
To learn about other features LaunchDarkly provides for releasing features to production gradually and safely, read Releasing features with LaunchDarkly.
Here are the topics on release management tools:
Approvals
Flag triggers
Feature monitoring
Required comments
Required confirmation
Scheduled flag changes
Workflows
Approvals
Overview
This topic introduces LaunchDarkly’s approvals feature. It explains what approvals are and how to configure them.
About approvals
When an account member plans a change to a feature flag or segment, they have the option to request approval for that change from a member or team in their LaunchDarkly project. Approvals let more people have input on planned changes. These review-style approvals mimic common code review workflows, such as pull request (PR) reviews in GitHub.
Anyone with the reviewApprovalRequest permission can approve a change, regardless of whether or not their review has been requested. The LaunchDarkly Project Admin, Maintainer, Developer, and Contributor project roles, as well as the Writer, Admin, and Owner base roles, all include this ability. Account members and team members who the requester chooses receive an email notifying them that their review has been requested, and, if applicable, a notification in the LaunchDarkly Slack or Teams app.
Working with approvals
Segment approvals are available to customers on select plans
Segment approvals and requiring approvals for either flags or segments are only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
You can request approval on changes to a flag’s targeting or variations, or to a segment’s targeting, any time after you create it. To learn more, read Requesting approvals. Enterprise customers can require approval requests for specific environments. To learn more, read Configuring approvals for an environment.
If someone requests your approval on a flag or segment change, the request appears in the Approvals dashboard, in your email, and in your in-app inbox. Depending on the approval request, it also appears in the following places:
For flags, the approval request appears in the flag’s “Pending changes” panel and, if you use the LaunchDarkly Slack or Microsoft Teams app, in a Slack or Teams notification.
For segments, the approval request appears in the segment’s details page and, if you use the LaunchDarkly Slack app, in a Slack notification.
To learn more, read Reviewing approval requests.
Segment approvals do not appear in Microsoft Teams
If someone requests your approval on a flag change and you use the LaunchDarkly Slack or Microsoft Teams app, you will receive a Slack or Teams notification. Segment approvals are also sent through Slack, but are not sent through Microsoft Teams.
To learn how to customize approval request settings, read Approval request settings.
Flag triggers
Flag triggers are available to customers on select plans
Flag triggers are only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
Overview
This topic explains how to use LaunchDarkly’s flag triggers feature, which lets you make changes to flag targeting remotely from a third-party application, like an APM tool. You can use triggers to turn flag targeting on or off.

You can also use the REST API: Flag triggers
About flag triggers
A trigger lets you initiate flag changes remotely using a unique webhook URL. Triggers integrate with your existing tools to let you enable or disable flags when you hit specific operational health thresholds or receive certain alerts. A flag can have multiple triggers attached to multiple tools or alerts.
Triggers work by creating unique URLs to connect feature flags to third-party tools. When the third-party tool generates a specific alert, the trigger sets the flag’s targeting to On or Off.
Each URL controls one action, and the URLs are distinct from each other. Subsequent requests to the flag’s On URL will not change the flag’s state after the initial contact turns the flag On.
Triggers are environment-specific
Triggers are unique to each flag within a given environment. This means that you can add multiple tools and multiple triggers to every flag, but if you wish to use the same trigger in multiple environments, you must create a new trigger for each flag in each environment as flags do not share URLs across environments.
Flag triggers are rate limited to prevent a flag turning on and off indefinitely if the triggering metric changes frequently.
To learn how to create and manage flag triggers, read Creating flag triggers and Managing flag triggers.
Flag trigger security
Although flag triggers use public URLs, they’re still a very secure way to initiate changes to your feature flags. Here’s why:
Triggers use unguessable URLs, and
Only some people in your LaunchDarkly project can create or modify triggers.
An unguessable URL is functionally similar to an access token in that it does not require an active connection between LaunchDarkly and other services to work. To learn more about unguessable URLs, read Google’s Unguessable URLs.
When you create a new trigger, its URL only displays once and prompts you to copy it locally. After the initial display, URLs are obscured so future viewers of the flag’s Settings tab cannot view them.
If you lose a trigger’s URL, you can reset it from the trigger’s overflow menu. To learn more, read Managing flag triggers.
Additionally, not all LaunchDarkly account members can interact with triggers. To modify existing triggers or create new ones, account members must have the LaunchDarkly Project Admin or Maintainer project role, or the Writer, Admin, or Owner base role, or another role with the createTriggers and updateTriggers permission.
If you use custom roles to manage your team, every account member who needs to manage triggers must be able to use the createTriggers, updateTriggers and deleteTriggers actions. To learn more, read Roles.
Integrations that use flag triggers
Triggers are available on the following tools. Read each tool’s documentation to learn how to set up triggers for them.
The tools are:
Datadog
Dynatrace
Honeycomb
New Relic One
Splunk Observability Cloud
LaunchDarkly also supports generic triggers that you can use with other tools. To learn more, read Creating flag triggers.
Generic triggers can connect to anything that fires a webhook. If a tool or service accepts an inbound connection from a webhook, you can use that service to turn flag targeting on or off. For example, if your company has an in-house monitoring application, you can use a generic trigger to turn flags on or off directly from your application.
Generic triggers work without any request body, but if you want to enhance the flag’s change history with more information, you can add different attributes. Any combination of properties will return information, and every attribute is optional.
To do this, send a JSON payload with the following shape:
JSON
{
   "eventName": "system CPU at 90%", // a name or description associated with the event
   "url": "https://yourlinkhere.com" // put a link here to direct a member to more inform

Creating flag triggers
Overview
This topic explains how to create flag triggers.
Create flag triggers
To create a trigger:
Navigate to the feature flag for which you wish to create a trigger.
Click on the three-dot overflow menu for the environment you want to create a trigger in.

The environment overflow menu.
Select Configuration in environment. The “Environment configuration” screen appears.
Find the “Triggers” section and click + Add trigger. The “Create trigger” dialog appears.
Choose the tool you wish to use from the Trigger type menu. You can also choose Generic trigger to create a trigger that is not associated with any specific tool.
Choose an action you wish to perform with the trigger from the Action menu.
Click Save trigger. A confirmation appears and the trigger appears in the flag’s configuration.
Copy and save the unique trigger URL. You must do this now. After you leave this page, the trigger URL will be obscured and you will not be able to view it again:

A trigger with the URL obscured.
You have created a new trigger for your flag. You can create more triggers if necessary by clicking Add trigger.

You can also use the REST API: Create flag trigger
Managing flag triggers
Overview
This topic explains how to disable, reset, and delete flag triggers.
Manage existing flag triggers
You can modify existing triggers from the flag’s Settings tab. After you create a trigger, you can disable, reset, or delete it.
To modify an existing trigger:
Navigate to the feature flag for which you wish to edit a trigger.
Click on the three-dot overflow menu for the environment you want to edit a trigger in.

The environment overflow menu.
Select Configuration in environment. The “Environment configuration” screen appears.
Find the trigger you wish to modify and click the overflow menu. The trigger options appear:

The overflow menu, expanded.
Choose the option you wish from the options menu:
Disable trigger: If you choose this option, the trigger configuration is saved but the trigger stops working. To re-enable the trigger, open the overflow menu and choose “Enable trigger.”
Reset trigger URL: If you choose this option, LaunchDarkly generates a new URL for this trigger. Use this option if you lose a URL for an existing trigger. You must update any clients using this URL to use the new URL. Type the trigger’s type and click Reset to confirm.
Delete trigger: If you choose this option, the trigger and its URL are deleted permanently. Type the trigger’s type and click Delete to confirm.

You can also use the REST API: Update flag trigger, Delete flag trigger
Required comments
Required comments are available to customers on select plans
Required comments are only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
Overview
This topic explains how to use required comments for feature flag and segment changes.
Comments help establish a change history for a flag or segment. Requiring members to leave comments when they change flags or segments helps your organization understand why flags or segments look and behave certain ways.
Required comments are only enforced from the user interface
When Require comments is enabled, members must leave a comment to explain their changes when they make changes from the Flags list or the Segments list in the LaunchDarkly user interface (UI). Comments are not required for changes made with the LaunchDarkly API.
When you require comments in an environment, members must leave a comment when saving any changes to a flag:

The "Save changes" dialog with the "Comment" field called out.
Require comments
To require comments in a new environment:
Click the project dropdown. The project menu appears:

The project menu.
Select Project settings.
Select Environments. The Environments list appears.
Click Add environment. The “Create an environment” panel appears.
Give your environment a human-readable Name.
Select the Require comments for flag and segment changes checkbox:

The "Create an environment" panel with the "Require comments" checkbox called out.
Click Create environment.
To learn more, read Create environments and Environment settings.
To require comments in an existing environment:
Click the project dropdown. The project menu appears:

The project menu.
Select Project settings.
Select Environments. The Environments list appears.
Next to the environment you want to edit, click the overflow menu and choose Edit environment. The Edit environment panel appears.

The environment overflow menu, including the "Edit environment" option.
Select the Require comments for flag and segment changes checkbox.
Click Save environment.
Comments on changes are now required for your environment.
Required confirmation
Required confirmation is available to customers on select plans
Required confirmation is only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
Overview
This topic explains how to use required confirmation for feature flag and segment changes.
Requiring members to confirm that they wish to make changes may help them from changing the wrong flag or segment inadvertently.
Required confirmation is only enforced from the user interface
When Require confirmation is enabled, members must enter the environment name or key when they make changes from the Flags list or Segments list in the LaunchDarkly user interface (UI). Confirmation is not required for changes made with the LaunchDarkly API.
When you require confirmation in an environment, members must enter the environment name or key when saving any changes to a flag:

The "Save changes" dialog with the "Confirm" field called out.
Requiring confirmation
To require confirmation on changes in a new environment:
Click the project dropdown. The project menu appears:

The project menu.
Select Project settings.
Select Environments. The Environments list appears.
Click Add environment. The “Create an environment” panel appears.
Give your environment a human-readable Name.
Select the Require confirmation for flag and segment changes checkbox:

The "Create an environment" panel with the "Require confirmation" checkbox called out.
Click Create environment.
To learn more, read Create environments and Environment settings.
To require confirmation in an existing environment:
Click the project dropdown. The project menu appears:

The project menu.
Select Project settings.
Select Environments. The Environments list appears.
Next to the environment you want to edit, click the overflow menu and choose Edit environment. The Edit environment panel appears.

The environment overflow menu, including the "Edit environment" option.
Select the Require confirmation for flag and segment changes checkbox.
Click Save environment.
Confirmation of flag changes is now required for your environment.
Scheduled flag changes
Scheduled flag changes are available to customers on select plans
Scheduled flag changes are only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
Overview
This topic explains what scheduled flag changes are and how to use them to manage your releases.
Scheduling flag changes lets you define and schedule changes to your flag’s targeting rules for future points in time. You can create a progressive delivery strategy by scheduling the incremental steps to release your feature to 100% of your user base.
For example, you can schedule a feature to turn on for internal testing two days from today, then enable it for your ‘beta’ customer segment four days later, and finally start an automated rollout increasing to 100% over the following five days.
Consider release pipelines
You can also support this example use case using release pipelines. Release pipelines let you move flags through a series of phases, rolling out flags to selected environments and audiences following automated steps. For each phase, you select the environment, audience, and rollout strategy, as well as whether approvals are required. However, you cannot explicitly schedule when each release pipeline phase starts.
We recommend using release pipelines if they meet your needs, because they are easier to set up and are repeatable across flags. This can help you standardize your release process across your organization.
To learn more, read Release pipelines.

You can also use the REST API: Scheduled changes
Benefits of scheduling flag changes
Benefits of scheduling flag changes include:
Timing an early launch: Scheduling your flag to turn on or off on a specified date/time lets you plan your release without having to manually make changes at desired release times.
Progressive feature rollouts: Scheduled flag changes are one of several ways you can create a set of scheduled changes to your flag, and have LaunchDarkly slowly release the feature for you. For example, you can schedule your flag to roll out to 20% of your user base tomorrow, 35% the day after, 50% the day after that, and increase that percentage until it reaches 100%.
For this use case, we generally recommend the separate progressive rollouts feature instead, because it is easier to set up, and because the flag variation that any particular customer encounters changes only once over the course of the rollout.
Temporary access: You can schedule rules that target certain contexts and segments to be added to or removed from your flag’s targeting to better manage customer access.
Flag hygiene: You can schedule your flag’s targeting rules to clean up once your flag has been rolled out to 100% of your user base.
To learn how to create and manage scheduled flag changes, read Creating scheduled flag changes and Managing scheduled flag changes.
View scheduled flag changes
To view all the scheduled changes for a flag:
Navigate to the Flags list and select the flag for which you want to view the scheduled changes. The flag’s Targeting tab appears.
The number of scheduled changes appear in the upper right corner:

The number of pending changes for a flag.
To view the complete list of changes, click on the progress check icon. A panel appears that displays all the pending changes that are scheduled for this flag. The changes are listed chronologically, with the earliest upcoming change listed first.

You can also use the REST API: List scheduled changes.
Creating scheduled flag changes
Overview
This topic explains how to create scheduled flag changes to take effect at a date in the future.
Create scheduled flag changes
To schedule a set of flag changes:
Navigate to the Flags list and select the flag for which you want to schedule targeting changes. The flag’s Targeting tab appears.
Make the changes you want to the flag’s targeting.
Click the dropdown icon in the Review and save button and select Schedule changes:

The "Schedule changes" option below the "Review and save" button.
In the “Schedule” section, select a date, time, and timezone for when you want the changes to execute, or click on the calendar icon to expand a calendar view:

The change scheduling calendar.
Click Apply.
Review and confirm the changes displayed in the dialog.
If your environment requires approvals for flag changes, enter a description and choose one or more reviewers.
(Optional) Enter a comment.
Click Schedule changes.
Your changes have now been scheduled.
You can schedule multiple changes for different dates and times for a single flag. For example, you can implement a progressive rollout strategy by scheduling multiple sequential changes to targeting rules.
Here is an image of a flag with multiple changes scheduled:

A flag with multiple changes scheduled.
If you use scheduled flag changes to schedule context removal dates, but an approver approves the request after the scheduled date and time of the context removal, LaunchDarkly prevents you from applying the change. To learn more about scheduling, read Schedule context removal from segments.

You can also use the REST API: Create scheduled changes workflow.
Create scheduled flag changes that require approvals
Enterprise customers can require approvals for scheduled flag changes. If approvals are required, the change is marked “Pending Review” in the “Pending changes” panel.
If there are conflicts between changed flags and requested changes, approved and applied changes take precedence over pending or requested changes. To learn more, read Manage conflicts with scheduled changes.
Workflows
Workflows are available to customers on select plans
Workflows are only available to customers on select plans. To learn more, read about our pricing. To upgrade your plan, contact Sales.
You cannot use workflows with the ServiceNow integration
You cannot use LaunchDarkly workflows in any environment that uses the ServiceNow integration. Workflows are still available in other environments that don’t use ServiceNow. To learn more about the ServiceNow integration, read ServiceNow.
Overview
This topic explains how to build, start, and view workflows in LaunchDarkly. A workflow is a set of actions that you can schedule in advance to make changes to a feature flag.
About workflows
Workflows can automate some of the manual tasks required to manage a feature flag. These tasks often take place in stages. For example, a feature flag workflow that gradually releases a flag to more contexts might look like this:

A workflow that progressively rolls out a flag over time.
Workflows support consistent release practices and let you automatically release a feature based on your release process.

You can also use the REST API: Workflows
Use cases for workflows
You can set up three kinds of workflows, which correspond to three common use cases: progressive rollout workflows, maintenance window workflows, and custom workflows.
If you are interested in gradually rolling out a particular flag variation to more contexts over a defined period of time, we recommend that you use the separate progressive rollout feature instead of setting up a progressive rollout workflow.
Progressive rollouts are an option on a flag’s targeting rule to serve a given flag variation to a specified percentage of contexts, and gradually increase that percentage over a specified time. They are a built-in feature that supports the most common use case for workflows. We recommend using progressive rollouts instead of workflows if they meet your needs, because progressive rollouts are easier to set up, and because the flag variation that any particular customer encounters changes only once over the course of the rollout. To learn more, read Progressive rollouts.
Prerequisites
To use workflows, you should understand the following features:
Approvals
Scheduled flag changes
Create workflows
Read the following topics to learn how to create different kinds of workflows:
Progressive rollout workflows gradually increase the percentage of contexts targeted by a flag.
Maintenance windows let you temporarily toggle targeting on or off.
Custom workflows manage a specific rollout process that you define.
You can also save a workflow as a template to reuse later. To learn how, read Workflow templates.
Permissions in workflows
A LaunchDarkly member must have permission to make flag changes to create workflows because workflows inherit permissions from flags. To learn more about how to configure the right permissions for members, read Resources.
Creating workflows
Overview
This topic explains how to create and view workflows in LaunchDarkly.
You can create three kinds of workflows:
Progressive rollout workflows gradually increase the percentage of contexts targeted by a flag.
Maintenance windows let you temporarily toggle targeting on or off.
Custom workflows manage a specific rollout process that you define.
You can also save a workflow as a template to reuse later. To learn how, read Workflow templates.

You can also use the REST API: Workflows
Create progressive rollout workflows
Progressive rollouts are also a built-in feature of LaunchDarkly
If you are interested in gradually rolling out a particular flag variation to more contexts over a defined period of time, we recommend that you use the separate progressive rollout feature instead of setting up a progressive rollout workflow.
Progressive rollouts are an option on a flag’s targeting rule to serve a given flag variation to a specified percentage of contexts, and gradually increase that percentage over a specified time. They are a built-in feature that supports the most common use case for workflows. We recommend using progressive rollouts instead of workflows if they meet your needs, because progressive rollouts are easier to set up, and because the flag variation that any particular customer encounters changes only once over the course of the rollout. To learn more, read Progressive rollouts.
To create a progressive rollout workflow:
Navigate to a feature flag.
Click Manage workflows in the right sidebar.
Click Progressive rollout. A “Configure progressive rollout” dialog appears.
Configure your progressive rollout:
Choose when to start the workflow.
Choose the default variation to roll out to contexts.
Choose how much to increase the percentage of the rollout, starting at 0%. This setting overwrites any previously-defined rollouts for the default variation, so you should check to ensure that the default variation will not be reduced. Each increase is a step change, just as if you changed the percentage manually.
Choose how frequently to increase the rollout percentage.
Choose which context attribute to roll out by.

The "Configure progressive rollout" workflow dialog.
Click Review workflow. An overview of the workflow appears.
(Optional) Click the pencil icon next to the title to edit the title.
(Optional) Click the pencil icon next to “Add a description” to add a description.
(Optional) If you have an approvals process, you can remove the first “Schedule” step, add an approval step, and then re-add the schedule step.
Click to expand details on adding an approval step










Click Start workflow.
For multivariate workflows, LaunchDarkly decreases and recalculates the variations that are not selected for the rollout. You should confirm the auto-calculated percentage rollouts and adjust them to your preferences if needed.
Create maintenance window workflows
You can use workflows to create maintenance windows that toggle a flag’s targeting on or off, and then back off or on, during a scheduled date and time.
To create a maintenance window workflow:
Navigate to the Flags list and select the flag you want to create a workflow for.
Click Manage workflows in the right sidebar.
Click Maintenance window. A “Configure a maintenance window” dialog appears.
Configure your maintenance window:
Choose whether to toggle the flag’s targeting on or off during the maintenance.
Choose when to start the maintenance.
Choose the length of the maintenance period.

The "Configure maintenance window" workflow dialog.
Click Review workflow. An overview of the workflow appears.
(Optional) Click the pencil icon next to the title to edit the title.
(Optional) Click the pencil icon next to “Add a description” to add a description.
(Optional) If you have an approvals process, you can remove the first “Schedule” step, add an approval step, and then re-add the schedule step.
Create custom workflows
To create a custom workflow:
Navigate to the Flags list and select the flag you want to create a workflow for.
Click Manage workflows in the right sidebar.
Click Custom build. A “Name the workflow” dialog appears.
Add a Name and an optional Description.
Click Next.
(Optional) If you have an approvals process, click Request approval.
Click into the Reviewers menu and choose an approver.
Enter a description in the Description field.
You must add approval steps before you add schedule steps. If you accidentally add a schedule step first, delete the schedule step, and then add the approval step as the first step of that stage.

The "Approval Request" step of a custom workflow.
If you don’t need to request approval, click Schedule date and time.
Choose Later to schedule the stage to begin a specified amount of time after the previous stage, for example, one hour after the previous stage
Choose Specific date and time to schedule the stage to begin at a specific time, for example, 4:00 PM on January 3, 2025
Click plus (+) to add another step to your workflow.
Add additional flag changes you want to make.
Add another approval or schedule condition step to create another stage of the workflow.
When you have added all of your release steps to the workflow, click Start workflow.
LaunchDarkly now processes the workflow steps for you based on the timeline and actions that you defined.
View workflows
To view workflow details:
Navigate to the Flags list and select the flag with the workflow you want to view. The flag’s Targeting tab appears.
Click Manage workflows in the right sidebar.
In the Workflows table, use the menu to show a table of Active or Completed workflows.
Click the name of the workflow you’d like to view.
Was this page helpful?
Yes

Deleting workflows
Overview
This topic explains how to delete LaunchDarkly workflows in LaunchDarkly.
Delete workflows
Deleting a workflow stops any further stages from executing. It does not undo any changes that the workflow has already made.
To delete a workflow:
Navigate to the Flags list and select the flag with the workflow you want to view.
Click Manage workflows in the right sidebar.
Click the name of the workflow you’d like to delete.
Click Delete workflow.
Enter the flag name or key to confirm the deletion.
Click Delete.
Workflow templates
Overview
This topic explains how to create and use workflow templates to automate your rollouts at scale. It describes how to save workflows as templates that can be reused with other flags.
About workflow templates
If your organization follows a standard procedure for progressive rollout workflows, maintenance window workflows, or other custom workflows, you can turn that workflow into a template so other account members can use it. Workflow templates are saved versions of workflows that you can apply and use with any flags in your account.
Progressive rollouts are also a built-in feature of LaunchDarkly
If you are interested in gradually rolling out a particular flag variation to more contexts over a defined period of time, we recommend that you use the separate progressive rollout feature instead of setting up a template for a progressive rollout workflow.
Progressive rollouts are an option on a flag’s targeting rule to serve a given flag variation to a specified percentage of contexts, and gradually increase that percentage over a specified time. They are a built-in feature that supports the most common use case for workflows. We recommend using progressive rollouts instead of workflows or workflow templates if they meet your needs, because progressive rollouts are easier to set up, and because the flag variation that any particular customer encounters changes only once over the course of the rollout. To learn more, read Progressive rollouts.
How workflow templates are applied across flags
You can apply workflow templates to any flag in any environment or project, regardless of which environment or project you create them in.
When you apply a template to a different flag or environment from where it was created, any environment or flag specific pieces of the workflow, such as variations, segments, or contexts are cleared. LaunchDarkly prompts you to fill in these blanks with appropriate values for the new flag and environment.
Save a workflow as a template
Here is how to save a workflow as a template:
Navigate to a feature flag.
Click Manage workflows in the right sidebar.
Click Custom build.
Build the workflow with the steps that you’d like each flag to follow.
Click Save as template.
Give the template a name, a key, and add an optional description. Then click Next.
Click Start workflow if you would also like to run the workflow on the flag.
Apply templates to flags
Here is how to apply a template to a flag:
Navigate to a feature flag.
Click Manage workflows in the right sidebar.
Click Existing template.
Search for the template that you would like to use on the feature flag.
Review the workflow and enter any missing details.
Click Start workflow to begin the workflow.
Delete templates
Templates can only be deleted through the API.

Observability
This feature is in Early Access
LaunchDarkly’s observability features are publicly available in early access.
They currently require the LaunchDarkly observability plugins and the JavaScript, React Web, or Vue SDK.
If you are interested participating in the Early Access Program for our upcoming observability plugins for server-side SDKs, sign up here.
Overview
This section contains documentation on LaunchDarkly’s observability features.
LaunchDarkly’s observability features let you understand how your application is performing and how end users are interacting with it. You can use the features to identify bugs, troubleshoot issues, and optimize performance.
Before you can use LaunchDarkly’s observability features, you must configure specific plugins in the SDK. To learn more, read the SDK documentation on Observability.
There are four main observability features. You can find them in the LaunchDarkly UI in the left navigation, under the “Monitor” heading:
Session replay
Errors
Logs
Traces
To learn more about the search specification for all of the observability features, read Search specification.
To learn how to configure project-level settings for the observability features, read Monitoring settings.
Was this page helpful?
Yes

Session replay
This feature is in Early Access
LaunchDarkly’s observability features are publicly available in early access.
They currently require the LaunchDarkly observability plugins and the JavaScript, React Web, or Vue SDK.
If you are interested participating in the Early Access Program for our upcoming observability plugins for server-side SDKs, sign up here.
Overview
This topic explains how to use LaunchDarkly’s observability features to perform session replays. The Sessions view displays a list of recorded sessions. Use this view to perform session replays, which are repeatable explorations of an end user’s session in your application. You can visually replay each recorded session to watch and play back how users interact with a website, digital product, or mobile app. Session replays give your organization visibility into how customers use your application, and can provide insight into why errors occur.
Get started
To instrument your application to capture session replay, read the SDK documentation on Observability. The functionality is available through plugins to the LaunchDarkly JavaScript SDK.
LaunchDarkly supports both Shadow DOM and Web Components as part of this instrumentation.
View session replays
To view a session replay, click Sessions in the left navigation menu, and then select a session from the list. Press the Play button to start the replay. Hover over or click on the colorful columns at the bottom of the screen to see different events in the session.

A session replay with event details expanded.
Search
To learn more about the search capabilities, read Search specification.
When you search on the Sessions page, the following behaviors apply by default:
The Sessions page displays completed sessions that have been fully processed. This is equivalent to searching by completed=true. You can use completed=false to find live sessions and sessions that are not yet fully processed.
The default search key is assumed to include the end user’s identifier and location. This could be the end user’s email, device_id, or given identifier, as well as their city or country. For example, if you enter an expression without a key, such as search-term, then LaunchDarkly automatically expands that to email=*search-term* OR city=*search-term*.
Additionally, by default, the session replay SDK plugin automatically injects several attributes, to provide additional help with searching for sessions. To learn more, read Session replay.
Search by end user clicks
When you search on the Sessions page, you can search for sessions where an end user clicked a certain HTML element:
clickSelector looks at the HTML element’s target’s selector, concatenating the element’s tag, id, and class values.
clickTextContent looks at the HTML element’s target’s textContent property. Only the first 2000 characters are considered.
Here is an example:
Example query
clickSelector=svg
clickTextContent="Last 30 days"

Search by visited URL
When you search on the Sessions page, you can search for sessions where an end user visited a particular URL, using the visited-url filter. Use quotations around the value for this search to avoid any errors due to special characters in the the URL.
Here’s how:
Example query
visited-url="https://app.example.com/"

As with other filters, you can use contains and matches regex expressions with visited-url. The following example retrieves all sessions where the end user visited the “sessions” page:
Example query
visited-url=*sessions*
visited-url=/.+\d/sessions.+/

Search attributes
By default, the session replay SDK plugin automatically injects the following attributes to provide additional help with searching for sessions:
Attribute
Description
Example
active_length
Time the end user was active. Defaults to milliseconds. Use s, m, or h suffixes to designate seconds, minutes, or hours.
10m
browser_name
Browser the end user was using.
Chrome
browser_version
Browser version the end user was using.
124.0.0.0
city
City the end user was in.
San Francisco
completed
Whether the session has finished recording.
true
country
Country the end user was in.
Greece
device_id
Fingerprint of the end user’s device.
1018613574
environment
The environment key, based on the SDK credentials used in the SDK plugin.
production
first_time
Whether this is the end user’s first session.
false
has_comments
Whether a LaunchDarkly member has commented on the session.
true
has_errors
Whether the session contains linked errors.
true
has_rage_clicks
Whether the end user rage clicked in the session.
true
identified
Whether the session successfully identified the end user.
false
ip
The IP address of the end user.
127.0.0.1
length
The total length of the session. Defaults to milliseconds. Use s, m, or h suffixes to designate seconds, minutes, or hours.
10m
os_name
The end user’s operating system.
Mac OS X
os_version
The end user’s operating system version.
10.15.7
pages_visited
The number of pages visited in the session.
10
sample
A unique order by which to sample sessions.
c1c9b1137183cbb1
service_version
The version of the service specified in the session replay SDK plugin. To learn more, read Versioning sessions and errors.
e1845285cb360410aee05c61dd0cc57f85afe6da
state
The state the end user was in.
Virginia
viewed_by_anyone
Whether the session has been viewed by any LaunchDarkly member.
true
viewed_by_me
Whether you have viewed the session.
false

Filter
You can filter out sessions that you do not want to view in LaunchDarkly. This is useful for sessions that you know are not relevant to your application, or that are not actionable. Filtered sessions do not count against your sessions quota.
Ingestion filters
You can set up ingestion filters to limit the number of sessions recorded in the following ways:
Sample a percentage of all data. For example, you may configure ingestion of 1% of all sessions. For each session LaunchDarkly receives, it makes a randomized decision that results in storing only 1% of all sessions.
Rate limit the maximum number of data points ingested in a one minute window. For example, you may configure a rate limit of 100 sessions per minute. This lets you limit the number of sessions recorded in case of a significant spike in use of your application.
Exclude sessions from particular end users, based on their context key or email address.
You can configure these filters from your project settings. To learn how, read Monitoring settings.
Custom filters
To use filter logic that is not available in the project settings, use the session replay plugin’s options for starting and stopping sessions at your discretion. To learn how, read Manually control session recording.
Privacy
Session replay supports privacy features, including data obfuscation and redaction. This ensures that sensitive data is not captured or displayed in the session replays. All of this functionality happens client-side, which means that no sensitive data is sent to LaunchDarkly servers. To learn more about the privacy options for session replay, read Privacy in the SDK documentation.
Session content
For images, videos, and other external assets, LaunchDarkly does not make a copy at record time. Instead, LaunchDarkly makes a request for the asset at replay time. If a request fails, some parts of the session may appear blank. Most commonly this occurs because of an authorization failure, or because the asset no longer exists.
For iframes, LaunchDarkly recreates an iframe with the same src. To learn more, read Working with iframes.
How is a session defined?
After a session starts, LaunchDarkly continues recording in the same session for up to four hours. Each browser tab or instance will start a distinct session, so if your web app is opened in two tabs at once, LaunchDarkly records two sessions.
However, after a session starts, it can be resumed. If your web app is opened in a single tab, closed, and then reopened within 15 minutes of closing, LaunchDarkly resumes the existing session. If more than 15 minutes have passed, LaunchDarkly starts a new session.
“Active time” is the time when an end user is interacting with your application with no more than a 10-second gap in activity. For example, if an end user is moving their mouse, typing, or clicking for 30 seconds with no gaps of longer than 10 seconds, that counts as 30 seconds of active time.
Was this page helpful?
Yes

Session replay
This feature is in Early Access
LaunchDarkly’s observability features are publicly available in early access.
They currently require the LaunchDarkly observability plugins and the JavaScript, React Web, or Vue SDK.
If you are interested participating in the Early Access Program for our upcoming observability plugins for server-side SDKs, sign up here.
Overview
This topic explains how to use LaunchDarkly’s observability features to perform session replays. The Sessions view displays a list of recorded sessions. Use this view to perform session replays, which are repeatable explorations of an end user’s session in your application. You can visually replay each recorded session to watch and play back how users interact with a website, digital product, or mobile app. Session replays give your organization visibility into how customers use your application, and can provide insight into why errors occur.
Get started
To instrument your application to capture session replay, read the SDK documentation on Observability. The functionality is available through plugins to the LaunchDarkly JavaScript SDK.
LaunchDarkly supports both Shadow DOM and Web Components as part of this instrumentation.
View session replays
To view a session replay, click Sessions in the left navigation menu, and then select a session from the list. Press the Play button to start the replay. Hover over or click on the colorful columns at the bottom of the screen to see different events in the session.

A session replay with event details expanded.
Search
To learn more about the search capabilities, read Search specification.
When you search on the Sessions page, the following behaviors apply by default:
The Sessions page displays completed sessions that have been fully processed. This is equivalent to searching by completed=true. You can use completed=false to find live sessions and sessions that are not yet fully processed.
The default search key is assumed to include the end user’s identifier and location. This could be the end user’s email, device_id, or given identifier, as well as their city or country. For example, if you enter an expression without a key, such as search-term, then LaunchDarkly automatically expands that to email=*search-term* OR city=*search-term*.
Additionally, by default, the session replay SDK plugin automatically injects several attributes, to provide additional help with searching for sessions. To learn more, read Session replay.
Search by end user clicks
When you search on the Sessions page, you can search for sessions where an end user clicked a certain HTML element:
clickSelector looks at the HTML element’s target’s selector, concatenating the element’s tag, id, and class values.
clickTextContent looks at the HTML element’s target’s textContent property. Only the first 2000 characters are considered.
Here is an example:
Example query
clickSelector=svg
clickTextContent="Last 30 days"

Search by visited URL
When you search on the Sessions page, you can search for sessions where an end user visited a particular URL, using the visited-url filter. Use quotations around the value for this search to avoid any errors due to special characters in the the URL.
Here’s how:
Example query
visited-url="https://app.example.com/"

As with other filters, you can use contains and matches regex expressions with visited-url. The following example retrieves all sessions where the end user visited the “sessions” page:
Example query
visited-url=*sessions*
visited-url=/.+\d/sessions.+/

Search attributes
By default, the session replay SDK plugin automatically injects the following attributes to provide additional help with searching for sessions:
Attribute
Description
Example
active_length
Time the end user was active. Defaults to milliseconds. Use s, m, or h suffixes to designate seconds, minutes, or hours.
10m
browser_name
Browser the end user was using.
Chrome
browser_version
Browser version the end user was using.
124.0.0.0
city
City the end user was in.
San Francisco
completed
Whether the session has finished recording.
true
country
Country the end user was in.
Greece
device_id
Fingerprint of the end user’s device.
1018613574
environment
The environment key, based on the SDK credentials used in the SDK plugin.
production
first_time
Whether this is the end user’s first session.
false
has_comments
Whether a LaunchDarkly member has commented on the session.
true
has_errors
Whether the session contains linked errors.
true
has_rage_clicks
Whether the end user rage clicked in the session.
true
identified
Whether the session successfully identified the end user.
false
ip
The IP address of the end user.
127.0.0.1
length
The total length of the session. Defaults to milliseconds. Use s, m, or h suffixes to designate seconds, minutes, or hours.
10m
os_name
The end user’s operating system.
Mac OS X
os_version
The end user’s operating system version.
10.15.7
pages_visited
The number of pages visited in the session.
10
sample
A unique order by which to sample sessions.
c1c9b1137183cbb1
service_version
The version of the service specified in the session replay SDK plugin. To learn more, read Versioning sessions and errors.
e1845285cb360410aee05c61dd0cc57f85afe6da
state
The state the end user was in.
Virginia
viewed_by_anyone
Whether the session has been viewed by any LaunchDarkly member.
true
viewed_by_me
Whether you have viewed the session.
false

Filter
You can filter out sessions that you do not want to view in LaunchDarkly. This is useful for sessions that you know are not relevant to your application, or that are not actionable. Filtered sessions do not count against your sessions quota.
Ingestion filters
You can set up ingestion filters to limit the number of sessions recorded in the following ways:
Sample a percentage of all data. For example, you may configure ingestion of 1% of all sessions. For each session LaunchDarkly receives, it makes a randomized decision that results in storing only 1% of all sessions.
Rate limit the maximum number of data points ingested in a one minute window. For example, you may configure a rate limit of 100 sessions per minute. This lets you limit the number of sessions recorded in case of a significant spike in use of your application.
Exclude sessions from particular end users, based on their context key or email address.
You can configure these filters from your project settings. To learn how, read Monitoring settings.
Custom filters
To use filter logic that is not available in the project settings, use the session replay plugin’s options for starting and stopping sessions at your discretion. To learn how, read Manually control session recording.
Privacy
Session replay supports privacy features, including data obfuscation and redaction. This ensures that sensitive data is not captured or displayed in the session replays. All of this functionality happens client-side, which means that no sensitive data is sent to LaunchDarkly servers. To learn more about the privacy options for session replay, read Privacy in the SDK documentation.
Session content
For images, videos, and other external assets, LaunchDarkly does not make a copy at record time. Instead, LaunchDarkly makes a request for the asset at replay time. If a request fails, some parts of the session may appear blank. Most commonly this occurs because of an authorization failure, or because the asset no longer exists.
For iframes, LaunchDarkly recreates an iframe with the same src. To learn more, read Working with iframes.
How is a session defined?
After a session starts, LaunchDarkly continues recording in the same session for up to four hours. Each browser tab or instance will start a distinct session, so if your web app is opened in two tabs at once, LaunchDarkly records two sessions.
However, after a session starts, it can be resumed. If your web app is opened in a single tab, closed, and then reopened within 15 minutes of closing, LaunchDarkly resumes the existing session. If more than 15 minutes have passed, LaunchDarkly starts a new session.
“Active time” is the time when an end user is interacting with your application with no more than a 10-second gap in activity. For example, if an end user is moving their mouse, typing, or clicking for 30 seconds with no gaps of longer than 10 seconds, that counts as 30 seconds of active time.
Error monitoring
This feature is in Early Access
LaunchDarkly’s observability features are publicly available in early access.
They currently require the LaunchDarkly observability plugins and the JavaScript, React Web, or Vue SDK.
If you are interested participating in the Early Access Program for our upcoming observability plugins for server-side SDKs, sign up here.
Overview
This topic explains how to use LaunchDarkly’s observability features to understand and view errors in your application. The Errors view displays a list of recorded errors.
Get started
To instrument your application to capture errors, read the SDK documentation on Observability. The functionality is available through plugins to the LaunchDarkly JavaScript SDK.
View errors
To view a errors, click Errors in the left navigation menu.
To view details about a specific error, click the error in the list. The error details page appears. The page displays details about how many times the error has occurred, how many users have been affected, and when the error was first and most recently observed. The page opens to the Instances tab.
The Instances tab
Use this tab to get an overview of the error’s impact and see stack traces on per-instance occurrences. You can see details about a specific occurrence of an error, like what browser the user encountered it in, what URL they had loaded when it occurred, and more.
This tab includes a “Stacktrace” section, which LaunchDarkly populates:
if your sourcemap is inline, meaning it’s shipped as part of your application, or
if you have uploaded your sourcemap to LaunchDarkly. To learn how to upload your sourcemap, read Use ldcli for uploading sourcemaps].

A detailed view of an error.
The Metrics tab
An error’s Metrics tab shows you details about how the error has occurred over time and across different environments. You can see the number of times an error has occurred in a given second, the environments and browsers the error has occurred in, and more.

A detailed view of an error.
Group errors
LaunchDarkly groups errors together based on their error message and stack trace. When your application throws an error, LaunchDarkly finds the closest matching error and adds the new error instance to it.
An error matches if:
it has the same error message, or
it has the same top stack frame and three of the next four stack frames are the same, in any order
A stack frame matches if:
it has the same file name, function name, line number, and column number, or
it has the same source code and context, if sourcemaps are enabled
If there is no match with an existing error, LaunchDarkly creates a new error group.
Manage errors
As you review errors, you can change their status.
To change the status of an error:
Navigate to the Errors view.
Click to select an individual error. New errors start with an “Open” status.
Click the status dropdown to change the status:
Select a new status from the menu. You can change an error’s status to “Ignored” or “Resolved.”
Select Snooze to snooze the error until the specified time.

The status dropdown menu for an error.
You can also configure LaunchDarkly to automatically resolve errors that have not appeared for a given time period. To learn how, read Monitoring settings.
Search
To learn more about the search specification for the errors view, read Search specification.
Search attributes
By default, the observability SDK plugin automatically injects the following attributes to provide additional help with searching for traces:
Attribute
Description
Example
browser
Browser the end user was using.
Chrome
client_id
ID associated with the error, added by LaunchDarkly. This can serve as a unique identifier if there is no context associated with the error.
DQbQCEHN0FLuwCeW50AeLI0cH6C4
environment
The environment key, based on the SDK credentials used in the SDK plugin.
production
event
The title of the error.
Maximum call stack size exceeded
has_session
Whether the error is tied to a session.
true
secure_session_id
Session ID that contains the error.
wh1jcuN5F9G6Ra5CKeCjdIk6Rbyd
service_name
Name of the service specified in the SDK plugin. To learn more, read Versioning sessions and errors.
private-graph
service_version
Version of the service specified in the observability SDK plugin. To learn more, read Versioning sessions and errors.
e1845285cb360410aee05c61dd0cc57f85afe6da
status
Status of the error group.
RESOLVED
tag
Tag applied to the error.
example error
trace_id
Trace ID that contains this log.
7654ff38c4631d5a51b26f7e637eea3c
type
General type of the error.
React.ErrorBoundary
visited_url
URL where the error occurred.
https://app.example.com/1/errors

Filter
You can filter out errors that you do not want to view in LaunchDarkly. This is useful for errors that you know are not relevant to your application, or that are not actionable. Filtered errors do not count against your errors quota.
Ingestion filters
You can set up ingestion filters to limit the number of errors recorded in the following ways:
Sample a percentage of all data. For example, you may configure ingestion of 1% of all errors. For each error LaunchDarkly receives, it makes a randomized decision that results in storing only 1% of all errors.
Rate limit the maximum number of data points ingested in a one minute window. For example, you may configure a rate limit of 100 errors per minute. This lets you limit the number of errors recorded in case of a significant spike in use of your application.
Filter specific errors by a regex pattern match against the error body.
You can configure these filters from your project settings. To learn how, read Monitoring settings.
Logs
This feature is in Early Access
LaunchDarkly’s observability features are publicly available in early access.
They currently require the LaunchDarkly observability plugins and the JavaScript, React Web, or Vue SDK.
If you are interested participating in the Early Access Program for our upcoming observability plugins for server-side SDKs, sign up here.
Overview
This topic explains how to use LaunchDarkly’s observability features to view session logs. The Logs page displays a list of logs for your application. You can use the page to view the logs for a specific time range. Logs have different levels: Debug, Info, Warn, and Error.

A view of the Logs page, with a specific log highlighted.
Click any log entry to see more details about the event, such as the session ID, the source of the event, and more. Click Related session to see the session replay for the log entry.

A detailed view of a log entry.
Get started
To instrument your application to capture logs, read the SDK documentation on Observability. The functionality is available through plugins to the LaunchDarkly JavaScript SDK.
To view a logs for your application, click Logs in the left navigation menu, and then select a log from the list.
Search
To learn more about the search specification for the logs view, read Search specification.
Search attributes
By default, the observability SDK plugin automatically injects the following attributes to provide additional help with searching for traces:
Attribute
Description
Example
code.filepath
File path emitting the log.
/build/backend/worker/worker.go
code.function
Function emitting the log.
github.com/acme-org/acme/backend/worker.(*Worker).Start.func3
code.lineno
Line number of the file where the log was emitted.
20
environment
The environment key, based on the SDK credentials used in the SDK plugin.
production
host.name
The hostname.
ip-172-31-5-211.us-east-2.compute.internal
level
The log level.
info
message
The log message.
public-graph graphql request failed
os.description
Description of the operation system.
Alpine Linux 3.17.2 (Linux ip-172-31-5-211.us-east-2.compute.internal 5.10.167-147.601.amzn2.aarch64 #1 SMP Tue Feb 14 21:50:23 UTC 2023 arch64)
os.type
Type of operating system.
linux
secure_session_id
Session ID that contains the log.
wh1jcuN5F9G6Ra5CKeCjdIk6Rbyd
service_name
Name of the service specified in the SDK plugin. To learn more, read Versioning sessions and errors.
private-graph
service_version
Version of the service specified in the observability SDK plugin. To learn more, read Versioning sessions and errors.
e1845285cb360410aee05c61dd0cc57f85afe6da
source
General origin of the log.
backend
span_id
Span ID that contains this log.
528a54addf6f91cc
trace_id
Trace ID that contains this log.
7654ff38c4631d5a51b26f7e637eea3c

Traces
This feature is in Early Access
LaunchDarkly’s observability features are publicly available in early access.
They currently require the LaunchDarkly observability plugins and the JavaScript, React Web, or Vue SDK.
If you are interested participating in the Early Access Program for our upcoming observability plugins for server-side SDKs, sign up here.
Overview
This topic explains how to use LaunchDarkly’s observability features to trace session activity through your application. Traces let you filter on spans of traces in your product based on a query. The Traces view shows a summary of traces, including the number of traces and the latency associated with them over time.

A detailed view of a log entry.
Hover on any span and click Open to view more details about it, including the span duration, details about the initiating event, and information about the telemetry. Click View session or View logs to see the span’s related session or logs.

A detailed view of a log entry.
Get started
To instrument your application to capture traces, read the SDK documentation on Observability. The functionality is available through plugins to the LaunchDarkly JavaScript SDK.
To view traces, click Traces in the left navigation menu, and then select a trace from the list.
Search
To learn more about the search specification for the Traces view, read Search specification.
When you search on the Traces view, the following behaviors apply by default:
The default search key is span_name. For example, if you enter an expression without a key, such as search-term, then LaunchDarkly automatically expands that to span_name=*search-term*.
Search attributes
By default, the observability SDK plugin automatically injects the following attributes to provide additional help with searching for traces:
Attribute
Description
Example
duration
Time length of the span. Defaults to nanoseconds. Use s, m, or h suffixes to designate seconds, minutes, or hours.
10s
environment
The environment key, based on the SDK credentials used in the SDK plugin.
production
has_errors
Whether the span has an error tied to its ID.
true
parent_span_id
Span ID of the span’s parent.
327611203ec5b0a1
secure_session_id
Session ID that contains the span.
wh1jcuN5F9G6Ra5CKeCjdIk6Rbyd
service_name
Name of the service specified in the SDK plugin. To learn more, read Versioning sessions and errors.
private-graph
service_version
Version of the service specified in the observability SDK plugin. To learn more, read Versioning sessions and errors.
e1845285cb360410aee05c61dd0cc57f85afe6da
span_kind
Broad source of the span.
Browser
span_name
Title of the span.
POST https://app.launchdarkly.com
trace_id
Trace ID of the spans.
7654ff38c4631d5a51b26f7e637eea3c

Alerts
This feature is in Early Access
LaunchDarkly’s observability features are publicly available in early access.
They currently require the LaunchDarkly observability plugins and the JavaScript, React Web, or Vue SDK.
If you are interested participating in the Early Access Program for our upcoming observability plugins for server-side SDKs, sign up here.
Overview
This topic explains how to set alerts for LaunchDarkly’s observability features. Alerts are a way to keep members of your organization aware of what is happening in your application. You can set alerts based on sessions, errors, logs, or traces, or when important conditions are met.
Add an alert
To add a new alert based on your LaunchDarkly observability data:
Navigate to Alerts in the left sidenav.
Click + Add Alert.
Enter an Alert title.
Select a Source to query. You can add alerts based on sessions, errors, logs, traces, or events. In the alert configuration, “events” refers to track, click, and navigate events that occur in a session replay.
(Optional) Enter Filters to filter out data points from your selected source before aggregating. For example, if you only want alerts from data in the production environment, set the environment filter. To learn more about the filter syntax, read Search specification.
(Optional) Select a Function from the dropdown to determine how data points are aggregated. If you choose a function, such as “Min,” that requires a parameter, select the attribute to use as well. Functions are not available for all sources.
(Optional) Enable the Group by toggle to group your query results into separate series. For example, you might group your logs by level. Grouping is not available for all sources.
Configure the threshold for your alert:
Select whether the Alert conditions are met above or below your threshold.
Set the Alert threshold to a number of your choice.
Set the Alert window. This is the time range for which data points are searched and aggregated. Shorter windows can help if you need to be alerted quickly about an issue, while longer windows can help reduce noise by aggregating across a longer time range.
Set the Cooldown period. After the initial notification, additional alert notifications will not be sent for this amount of time. If the alert is still in an alert state after the cooldown, another notification will be sent.
(Optional) Click + Add notification. Select the members of your organization who will receive a notification when the threshold is met. Notifications are sent through email.
Click Save.
Here is an example of the configuration panel for an alert:

The configuration panel for an alert.
Configure an alert
To change the configuration for an alert:
Navigate to Alerts in the left sidenav. A list of all alerts appears.
Click Configure on the panel for that alert.
The Edit page appears. Update the source, threshold, or notification.
Click Save.
View and manage alerts
You can view and manage alerts from the Alerts list.
View an alert
To view a particular alert:
Navigate to Alerts in the left sidenav. A list of all alerts appears.
Click the title of the alert you want to view.
The alert details appear, including the number of active alerts and history of alerts for this configuration.
From here, you can select to pause the alert or change its configuration.
Enable or disable an alert
To enable or disable a particular alert, click the toggle next to any of the alerts in the Alerts list. Only enabled alerts send notifications.
To pause an alert without disabling it, click the title of an alert on the Alerts list to view its details page. Then click Pause alert.
Delete an alert
To delete an alert:
Find the alert you want to delete in the Alerts list.
Click Configure on the panel for that alert. The Edit page appears.
Click Delete alert.
Dashboards
This feature is in Early Access
LaunchDarkly’s observability features are publicly available in early access.
They currently require the LaunchDarkly observability plugins and the JavaScript, React Web, or Vue SDK.
If you are interested participating in the Early Access Program for our upcoming observability plugins for server-side SDKs, sign up here.
Overview
This topic explains how to use dashboards in LaunchDarkly observability.
Dashboards let you visualize what’s happening in your app. They can show error rates, APM trends, user engagement, and more. Dashboards are comprised of graphs, which are visualizations of data that you can create and configure to show the data you want.

An example dashboard.
Create a dashboard
Here’s how to create a dashboard:
In the LaunchDarkly UI, click Dashboards in the left sidenav.
Click Create new dashboard.
Give your dashboard a human-readable Name.
Click the dropdown to choose the Dashboard type:
A Blank dashboard is initially empty. Use the Add graphs to a dashboard procedure, below, to populate it.
A Frontend metrics dashboard is configured to include graphs for web vitals, browser memory, HTTP response size, HTTP request size, HTTP errors, and HTTP request latency.
Click Create.
The new dashboard appears. For each Dashboard type, you can customize or remove graphs, and add additional graphs, to meet your reporting needs.
Add graphs to a dashboard
You can add graphs to a dashboard to visualize different data.
First, name the graph and specify how you want the data to display. Here’s how:
In a dashboard, click + Add graph. The “New graph” page appears.
Give your graph a human-readable Graph title.
Choose the “View type” to specify how you want the graph to display data. The options are a line chart, a bar chart / histogram, or a table.
(Optional) Select how to stack visualizations, which lets you compare amounts from multiple sources.
For line charts, click Stack area to display multiple areas stacked on top of each other.
For bar charts, click Stack bars to display multiple bars stacked on top of each other.
(Optional) Specify how to handle Nulls or empty values. For line charts, nulls can be graphed as hidden, connected, or zero. For tables, nulls can be displayed as hidden, blank, or zero.
Hidden means nulls are not displayed.
Connected means if two non-empty values have empty or null values between them, the two non-empty values are graphed with a connecting line.
Blank means nulls are displayed as blank rows in a table.
Zero means nulls or empty values are displayed as having a zero value.

The name and visualization section of the add graph panel.
Next, build a query to populate the graph with data. Here’s how:
Select how to build a query:
Choose Query Builder to use the graph editor UI to query the data for your graph.
Choose SQL Editor to write a custom query with SQL. If you use this option, disregard steps 2 though 5. After you write a query, click Run query. To learn more, read SQL Editor, below.
Choose a Source from the dropdown. You can populate each graph with data from sessions, errors, logs, or traces.
(Optional) Enter Filters to select which data points to include in your graph. For example, if you only want to include data from the production environment, set the environment filter. To learn more about the filter syntax, read Search specification.
(Optional) Select a Function from the dropdown to determine how data points are aggregated. “Count” is selected by default. If you choose a function, such as “Min,” that requires a parameter, select the attribute to use as well.
(Optional) To add an additional function, click Add function.

The query builder section of the add graph panel.
Then, choose options to group the data. Here’s how:
(Optional) Enable the Group by toggle to group your query results into separate series. Use the dropdown to choose the category by which to group results. For example, you might group your logs by level.
(Optional) Specify a Limit to restrict the number of groups displayed, and a function type by which to determine if a group should be included in the graph.
(Optional) Toggle Bucket by to use buckets in your graph. Then select Interval or Count to indicate how bucket sizes should be determined.
Bucketing by interval requires that you set a Bucket interval. A higher value displays more granular buckets.
Bucketing by count requires that you set a Bucket field and number of Buckets to group by.
For example, you might choose to bucket by Count with a Bucket field of “Timestamp” if you want to aggregate data points within consecutive time ranges. Or you might choose to bucket by Count with a Bucket field of “duration” if you want to examine the distribution of latency for a particular API endpoint. Or you might toggle Bucket by off to disable bucketing and aggregate data across your entire time range.

The grouping section of the add graph panel.
Finally, click Save. The new graph appears in the dashboard.
Advanced graph creation tools
The graph editor provides two advanced graph creation tools: the SQL Editor, which you can use to query data for your graph, and dashboard variables, which you can use to parameterize graphs.
SQL Editor
The SQL editor lets you write custom queries to retrieve your data and aggregate as you wish. Using the SQL editor is an alternative to using the graphical query builder.
Expand Use SQL Editor to retrieve graph data






































Dashboard variables
Dashboard variables let you parameterize filters, bucketing, and grouping across multiple graphs. This makes it easier to make changes to sets of graphs at one time. After you create a dashboard variable, you can reference it in any of the filter, function, grouping, or bucketing rules components of the graph editor.
Expand Use dashboard variables in your graphs




































View graph details
For each graph, you can always take a closer look at the underlying data. Here’s how:
Click Dashboards in the left sidenav.
Find the dashboard you want to update and click its name.
Find the graph you want to examine and hover over its graphed data. A tooltip of the current datapoints appears.
Click to freeze the tooltip and show links to the details for each data point:

A graph on a dashboard. The tooltip displays information on the current datapoints, and the details links are called out.


Click any of the details links to open a panel with the relevant sessions, errors, logs, or traces. The data points in the panel are filtered using the graph’s filters and the grouping, time range, or metric bucket for the specific data point that you selected.
From the detail panel, you can:
Search the underlying data using the search specification for the LaunchDarkly observability features.
Click Copy link and share the data with other members of your organization.
Click a data row to review additional details.
Manage dashboards
After you create a dashboard, you can review, update, and share it. You can also add additional graphs or make changes to existing graphs.
Share a dashboard
To share a dashboard, click Dashboards in the left sidenav. Find the dashboard you want to update and click its name. From here, you can share the dashboard’s data in the following ways:
To share a link to the dashboard, click Share. The URL for the dashboard is copied to your clipboard.
To share the data behind a particular graph, find the graph and hover on its name. Click the overflow menu and choose “Download CSV.”
Update a dashboard
To update a dashboard, click Dashboards in the left sidenav. Find the dashboard you want to update and click its name. From here, you can make the following updates:
To update the dashboard’s name or default time range, click Settings. Make the changes in the “Dashboard settings” dialog. Then click Save.
To add a new graph, follow the Add graphs to a dashboard procedure, above.
To clone an existing graph, find the graph you want to remove and hover on its name. Click the overflow menu and choose “Clone graph.”
To remove a graph, find the graph you want to remove and hover on its name. Click the overflow menu and choose “Delete graph.”
To update a graph, find the graph you want to remove and hover on its name. Click the pencil icon to edit the graph. For more information on the fields you can change in the graph setup, read the Add graphs to a dashboard procedure, above.
Delete a dashboard
To delete a dashboard:
Click Dashboards in the left sidenav.
Find the dashboard you want to delete.
Click the overflow menu.
Select Delete dashboard.
Deleted dashboards cannot be restored. Please be certain.
Search specification
This feature is in Early Access
LaunchDarkly’s observability features are publicly available in early access.
They currently require the LaunchDarkly observability plugins and the JavaScript, React Web, or Vue SDK.
If you are interested participating in the Early Access Program for our upcoming observability plugins for server-side SDKs, sign up here.
Overview
This topic explains how to use LaunchDarkly’s observability search feature to query and filter data across your application. The search functionality allows you to find specific sessions, errors, logs, and traces by composing queries with different properties and attributes.

The session replay search pane, with options expanded.
Compose search queries
Compose your search query with one or more expressions. Each expression can be a comparison between a key and a value, or a logical combination of other expressions.
Here are some examples of search queries:
Example query
span_name=gorm.Query

Enter a search value without a key to search on a default key. For logs, the default key is the message, and for traces it is the span_name.
Example query
gorm.Query

You can also filter for custom attributes you send in sessions, logs, and traces.
Example filter
user_id=42

Keys and values
Keys are identifiers, which can include any combination of alphanumeric characters, underscores (_), periods (.), dashes (-), and wildcards, which are indicated by asterisks (*).
Values are strings with any character. To use spaces or special characters, you must enclose the string in quotes (", ').
You can use wildcards (*) in values to match on part of a pattern. For example:
span_name=gorm.* matches all span_name values that start with gorm.
span_name=*.Query matches all span_name values that end with .Query
span_name=*orm* matches all values that contain orm
If you want to use a value with a space or special character, you must wrap the value in quotations.
Example query
tag="*query error*"
visited-url="https://app.launchdarkly.com/*"

Regex expressions
You can search with regex expressions by using the matches query operator: =\[your regex here]\. For example:
clickTextContent=/\w.+\w/ matches all clickTextContent that start and end with any word
browser_version=/\d\.\d\.\d/ matches all browser_versions in the form [0-9].[0-9].[0-9]
If you want to use a regex expression with a space or special character, you must wrap the value in quotations. For example:
tag="/\w \w/"
visited-url="/https://app.launchdarkly.com/\d/.+/"
Comparisons
Use operators to compare two different elements in your search query. The following operators are supported:
=: Equals
!=: Does not equal
<: Less than
<=: Less than or equal to
>: Greater than
>=: Greater than or equal to
Exist and does not exist
You can search if a key exists or does not exist with the exists operator. For example, to return all the traces with a connected session, use the following query:
Example query
secure_session_id exists

exists also works with the not keyword. For example, when you only want the root level spans when searching traces, use this query:
Example query
parent_span_id not exists

You can combine expressions with the logical operators AND, OR, and NOT:
AND: Both expressions must be true
OR: At least one of the expressions must be true
NOT: The following expression must be false
There is an implicit AND between all filters unless you specify an OR directly. For example:
Example query
service_name=private-graph span_name=gorm.Query

This is equivalent to:
Example query
service_name=private-graph AND span_name=gorm.Query

You can also use parentheses ( AND ) to group values in an expression. For example:
Example query
(key1=value1 AND key2=value2) OR key3=value3

You can also use parentheses to group values in an expression:
Example query
service_name=(private-graph OR public-graph)

Saved searches
Saved searches are a set of search filters that apply to sessions or errors. Saved searches are useful if you want to quickly view sessions or errors that relate to a certain population of your end users.
To save a search, click the Save button below the search bar.
The searches you build are reflected in the URL parameters when you’re accessing sessions through the LaunchDarkly UI. You can share these URLs with others to deep link to search results, or create them programmatically.
Session-specific searching
To learn more about search terms and defaults specific to session replays, read Search in the Session replay topic.
Configure error views
You can configure the Errors page to display different subsets of errors. Use the date dropdown to select a time range, and search in the search bar to filter the errors.
Monitoring settings
This feature is in Early Access
LaunchDarkly’s observability features are publicly available in early access.
They currently require the LaunchDarkly observability plugins and the JavaScript, React Web, or Vue SDK.
If you are interested participating in the Early Access Program for our upcoming observability plugins for server-side SDKs, sign up here.
Overview
This topic describes the project-level settings available for sessions, errors, logs, and traces.
You can find LaunchDarkly’s observability features in the LaunchDarkly UI in the left navigation, under the “Monitor” heading.
To view or update project-level settings for these features:
Click the project dropdown to open the project menu.
Select Project settings.
Click Monitoring. The Monitoring settings page appears.
The following sections describe the available settings.
Session settings
You can configure the following settings for sessions in your project:
Excluded users. This setting excludes sessions from particular end users, based on their context key or email address.
Rage clicks. These settings adjust the sensitivity for detecting “rage clicks,” or occasions when end users repeatedly click an element in your application, indicating frustration. You can set the Elapsed time, Radius, and Minimum clicks. These settings control whether a search for session replays that uses the has_rage_clicks attribute will return a given session. By default, LaunchDarkly considers end-user activity a rage click when there exists a two second or longer period in which an end user clicks five or more times within a radius of eight pixels.
Click Save to save your settings.
Error settings
You can configure the following settings for errors in your project:
Sourcemaps. If you have uploaded sourcemaps, you can view them here.
Auto-resolve stale errors. When enabled, this setting automatically sets the status of an error to “Resolved” after the time period you select.
Click Save to save your settings.
Filters
You can filter out sessions, errors, logs, or traces that you do not want to view in LaunchDarkly before they are ingested. This is useful if you know the data is not relevant to your application, or is not actionable. Filtered sessions, errors, logs, and traces do not count against your observability quotas.
To set up ingestion filtering:
Navigate to the Monitoring settings page.
From the Filters section, click Edit next to the type of filter you want to set.
Alternatively, click Session filters or Error filters from the Sessions or Errors sections, respectively.
(Optional) Set the Sampling %. For each session, error, log, or trace record that LaunchDarkly receives, it makes a randomized decision that results in storing only the indicated percentage of all records.
(Optional) Set the Max ingest per minute. This setting rate limits the maximum number of data points ingested in a one-minute window. For example, you may configure a rate limit of 100 per minute. This lets you limit the number of data points recorded in case of a significant spike in use of your application.
(Optional) Set a rule to exclude certain sessions, errors, logs, or traces based on available attributes.
Click the Search… placeholder and select an attribute from the dropdown. For example, you can exclude sessions based on active_length.
For details on the available attributes, read Search attributes for session replay, Search attributes for errors, Search attributes for logs, and Search attributes for traces.
Select an operator from the dropdown. For example, you can filter by greater than, >.
Enter a value for your expression. For example, you can enter 8s for eight seconds.
Here is an example of a session filter rule:

A session filter by active length.


Click Save changes.
Connect apps and services to LaunchDarkly
This category has documentation topics about different methods to connect your services and applications to LaunchDarkly. If you’re building an integration for LaunchDarkly, you can store data for your integration with a LaunchDarkly feature flag with a custom property, or authorize and revoke access of OAuth apps.
Read the content in this category to understand how to use different options to connect to LaunchDarkly.
Custom properties
OAuth applications
Webhooks
The LaunchDarkly API
Custom properties
Overview
This topic explains how to set up and use custom properties in LaunchDarkly.
If you’re building an integration for LaunchDarkly, it might be helpful to store data for your integration with a LaunchDarkly feature flag. Custom properties allow you to do this.
Each custom property you add to a feature flag can contain a list of associated values. For example, if you create an integration with an issue tracking service, you may want to associate a flag with a list of issues related to a feature’s development.
Setting a custom property
To add a custom property to a flag:
Navigate to the flag’s list.
Hover on the flag you want to edit, and click the three-dot overflow menu.
Click Manage flag settings. The flag’s Settings tab appears.
Click + Add custom property.
Choose a property type from the menu.
If you choose an existing property type, enter Values associated with the custom property.
If you choose “New,” enter a Name and Key for the new custom property. Then enter Values associated with the custom property.
Click Save:

A flag's custom property configuration fields, for the existing "Jira issues" property.

You can also use the REST API: Create a feature flag
Custom property restrictions
Custom properties have the following restrictions:
You can set a maximum of 64 custom properties
Each custom property’s name and key must be at most 64 characters
Was this page helpful?
Yes

OAuth applications
Overview
This topic explains how to authorize or revoke access of an OAuth app.
OAuth apps may require extensive permissions
It is critically important to only authorize applications you trust to use your LaunchDarkly account. Read the permissions required by the app carefully and use your own best judgment about whether you trust an app enough to use it.
Connect an OAuth app to LaunchDarkly
You can connect your LaunchDarkly account to external applications, such as the LaunchDarkly Slack app, using the OAuth 2.0 protocol. When you authorize an OAuth application, you grant the application access to information and actions an account member might take. Some applications can act on your behalf, such as by turning feature flags on and off.
Your LaunchDarkly credentials and billing information will never be shared with any OAuth application you authorize.
If you are interested in developing your own OAuth application, read Registering a LaunchDarkly OAuth client.
OAuth app permissions
On initial authorization, an OAuth app shows you a complete list of permissions it requires in order to work. While the app may have the capability to perform many actions in LaunchDarkly, the app’s ability to do anything is limited by the abilities of the account member who authorizes it.
Additionally, if your own permissions are reduced, applications you have previously authorized will have reduced permissions as will.
When you authorize an OAuth app, it can never do more than you can do
For example, if you are have a Writer base role and authorize an app, and then are downgraded to a Reader base role, your app will only have Reader-level permissions.
Disconnect an OAuth app
We care about the security of your information. You or an Administrator can revoke an app’s permission to use your account at any time.
Administrators can revoke any app
If you are a LaunchDarkly administrator, you can revoke access of any app added to LaunchDarkly, regardless of which account member added it.
To disconnect an app:
Click the gear icon in the left sidenav to view Organization settings.
Click Authorization from the left sidenav.
In the “Authorized applications” section, locate the app you would like to disconnect.
Click Review. The “Application access” panel appears.
Click Revoke. A confirmation dialog appears.
Enter “yes” in the Type yes to confirm field.
Click Revoke.
The application’s access is revoked.
Webhooks
Overview
This topic explains how to create and use webhooks in LaunchDarkly.
LaunchDarkly’s webhooks allow you to build your own integrations that subscribe to changes in LaunchDarkly. When something changes, like when a feature flag is updated, or when an account member is invited to LaunchDarkly, LaunchDarkly sends an HTTP POST payload to the webhook’s configured URL.
Use webhooks to update external issue trackers, update support tickets, notify customers of new feature rollouts, and more.

You can also use the REST API: Webhooks
Create a webhook
To create a webhook:
Click the gear icon in the left sidenav to view Organization settings.
Click Integrations and navigate to the “Webhooks” section.
Click Add integration. The “Create a webhook” panel appears.
(Optional) Give the webhook a human-readable Name.
Enter an absolute URL.
If you want the webhook to be signed, check the Sign this webhook checkbox. To learn more, read Sign a webhook.
Add a policy if you want to select and filter the events sent to the webhook. To learn more, read Add a policy filter.
After reading the Terms and Conditions, check the I have read and agree to the Integration Terms and Conditions checkbox.
Click Save settings.

You can also use the REST API: Create a webhook
Sign a webhook
When creating a webhook, you can define an optional secret. If defined, the webhook POST request will include an X-LD-Signature header, whose value will contain an HMAC SHA256 hex digest of the webhook payload, using the secret as the key.
Compute the signature of the payload using the same shared secret in your code to verify that the webhook was triggered by LaunchDarkly. You can use the auto-generated secret, or supply your own when creating or editing a webhook.
Add a policy filter
LaunchDarkly sends all flag change events in the production environment to a webhook by default. To customize the events LaunchDarkly sends to a webhook, use the policy editor in the webhook creation panel.
For example, to receive events only when a change is made to one of your production feature flags, add one of the following policies to your webhook:
Example: receive all events from prod
Example: receive only certain events from prod
[
 {
   "effect": "allow",
   "actions": ["*"],
   "resources": ["proj/*:env/production:flag/*"]
 }
]

To learn more about creating a policy, read Example roles and policies.

You can also use the REST API: Update webhook
Payload format
The webhook payload format is identical to the entry format for the change history. Read our REST API Documentation for an example payload.
Webhook delivery order
Note that webhooks may not be delivered in chronological order. We recommend using the payload’s “date” field as a timestamp to reorder webhooks as they are received.
Retries
If LaunchDarkly receives a non-2xx response to a webhook POST, it attempts to retry the delivery once. Webhook delivery is not guaranteed, and integrations built on webhooks should be tolerant of delivery failures.
Disable a webhook
You can temporarily disable a webhook by hitting the On/Off switch on the Integrations page.
Test a webhook
If you need to generate a test URL, we recommend using Pipedream or Insomnia.
Deleting webhooks
You can delete a webhook when you no longer need it.
To delete a webhook:
Click the gear icon in the left sidenav to view Organization settings.
Click Integrations and navigate to the “Webhooks” section.
Click the expand arrow next to the Add integration button.

The "Add integration" button with the expand arrow called out.
Click the pencil icon next to the webhook you want to delete. The “Edit webhook” panel appears.
Click Delete webhook. A confirmation dialog appears.
Click Delete.
The LaunchDarkly API
Overview
This topic explains how to authenticate to the LaunchDarkly API and access LaunchDarkly’s API documentation.
Every LaunchDarkly feature begins as an API endpoint. You can use the LaunchDarkly API to perform any action that’s available in the LaunchDarkly product itself.
For example, with the LaunchDarkly REST API you can perform the following:
Create, update, and search for account members, teams, projects, environments, and feature flags
Toggle feature flags
Query data about contexts that have evaluated feature flags in your application
Build custom integrations
Export raw data to destinations outside of LaunchDarkly
The LaunchDarkly REST API is not designed to evaluate feature flags from within your application. For that, you should use the LaunchDarkly SDKs. To learn more about the differences between these offerings, read Comparing LaunchDarkly’s REST API and SDK.
Prerequisites
To access the REST API, you must have the following prerequisites:
An API access token, which you can generate in LaunchDarkly’s Authorization page. Depending on your use case, you may prefer a personal access token or a service token. To learn more, read API access tokens.
Access the LaunchDarkly API
To access the LaunchDarkly API, you have several options:
Explore the available REST endpoints in our API docs.
Download our OpenAPI specification to use in an API-based tool, such as Postman or Insomnia.
Visit our collection of client libraries on GitHub. We auto-generate client libraries in several common languages based on our OpenAPI specification. To learn more, read OpenAPI and client libraries.
To authenticate to the LaunchDarkly API, add an Authorization header with your access token to your requests. While we recommend accessing the API using a request header, you can also perform API calls from the browser when you’re logged in to LaunchDarkly. To learn more, read the Authentication section of the API documentation.
Access the API documentation
To get started using our API, read the tutorial Using the LaunchDarkly REST API. To learn more, read the API documentation.
Public IP list
Overview
This topic explains how to access LaunchDarkly through one of our public IPs. If you’re using a firewall, add a LaunchDarkly IP range to your firewall settings.
If you want to configure access by domain instead, read the Domain list.
To learn how to obtain the IP list for just the required domains associated with a specific SDK, read How to get IPs LaunchDarkly uses.
Access LaunchDarkly through a public IP range
To help you access LaunchDarkly services through your firewall, we provide a list of LaunchDarkly’s public IP ranges.
Access the list of public IP ranges from this URL:
Access public IP ranges
 https://app.launchdarkly.com/api/v2/public-ip-list

The public IP endpoint returns a JSON object with two attributes:
addresses: This element contains the IP addresses LaunchDarkly uses. These IP addresses receive HTTPS connections your SDKs initiate through port 443. Configure your firewalls and proxies to allow persistent outbound connections so your SDKs can subscribe to updates.
outboundAddresses: This element contains the IP addresses LaunchDarkly uses for outbound webhook-based notifications and integrations. LaunchDarkly uses these addresses when making calls to your network. Add each outbound address to your allow list individually.
Updates
We update this list from time to time. You can automate calls to this API to detect when the IP ranges change.
We also post upcoming changes to this list in advance on our status page. Normally we post the update two weeks in advance of the change taking effect. However, in certain exceptional circumstances the notification window may be shorter.

You can also use the REST API: Get the public IP list
Product analytics
Contact us to enable product analytics
LaunchDarkly product analytics is available for all customers but requires an extra step to enable. To learn more, contact us.
Overview
LaunchDarkly offers a warehouse-native product analytics solution that allows you to compose your own dashboards out of different events and user data. Product analytics lets you analyze your product data and get insights.
Warehouse-native product analytics
Warehouse-native product analytics solutions are analytics platforms built to work directly with your existing data warehouse. Unlike traditional analytics platforms that come with their own database and require ETL (Extract, Transform, Load) processes to move data into that database, warehouse-native solutions access the data where it resides. You don’t need to move or copy data from your warehouse to another database. This saves time and resources.
Product analytics supports evolving data sources and scales with the event volumes associated with large amounts of data. You can filter and visualize your product data precisely the way you want. LaunchDarkly product analytics offer powerful capabilities that can help you go deep into your data and know more about customer behavior.
Prerequisites
In order to use product analytics, you must have the following prerequisites:
Events populating LaunchDarkly’s event stream
Access to a supported data warehouse, such as Snowflake, BigQuery, or Databricks
(Optional) Access to LaunchDarkly’s Data Export feature
Product analytics components
There are several key concepts behind LaunchDarkly product analytics. Each of these components is described in its own tab in the product analytics UI.
Events: Unique actions on your product. For example, a user clicking a checkout button or a user signing up.
Cohorts: Specific groups of users segmented by properties or behaviors. For example, all users who signed up in the past 30 days.
Attributes: Identifying traits that describe events. For example, the country a user was located in when they signed up.
User activity: User activity over time. For example, the number of users who signed up each day.
Ready to get started? Read Setting up product analytics.
Controlling access to product analytics
Members with a Reader base role can view product analytics dashboards, but cannot create, delete, or modify anything in product analytics. Members with a Writer, Admin, or Owner base role can view, create, delete, and modify product analytics dashboards.
To learn more, read Organization roles.
Setting up product analytics
Overview
This topic explains how to set up LaunchDarkly product analytics. LaunchDarkly product analytics is a feature that allows you to track and analyze user events in your product.
You can use different data warehouses with LaunchDarkly product analytics. The available warehouses are:
Snowflake
BigQuery
Databricks
Some warehouses have minor feature limitations
Not all of the features available in LaunchDarkly product analytics are available on all data warehouses. To learn more, read the documentation for each warehouse.
Was this page helpful?
Yes

Setting up product analytics in BigQuery
Overview
This topic explains how to set up LaunchDarkly product analytics in BigQuery.
BigQuery is Google Cloud’s managed serverless enterprise data warehouse. It integrates with LaunchDarkly product analytics to provide a warehouse-native analytics solution that lets you visualize and analyze your data.
BigQuery does not support all product analytics features
Not all of the features available in LaunchDarkly product analytics are available in BigQuery. User activity, some trends features, and some funnel conversion criteria are not supported. To learn more, read Using product analytics charts.
Prerequisites
Before completing this procedure, you must have the following:
Access to a BigQuery data warehouse
The ability to create and modify new datasets in BigQuery
The ability to create new service accounts in BigQuery
Configure Google Cloud and BigQuery
In Google Cloud and BigQuery, create a new service account and give it the BigQuery Job User role:
Navigate to IAM and Admin, then click Service Accounts. The “Service accounts” page appears.
Click Create service account. The “Create service account” page appears.
In the “Service account details” section, enter a Service account name. Optionally, enter a Description.
Copy and save the Email ID for the service account. You will use it in the next procedure.
Click Create and continue. The “Grant this service account access to project resource” menu opens.
In the “Role” menu, type to find and select the BigQuery Job User role. This role gives the service account permission to do jobs.
Click Continue, then click Done. You are returned to the “Service accounts” page.
In BigQuery, set up the dataset permissions required for the service account.
Click to expand Set up BigQuery permissions for LaunchDarkly Data Export












Follow these steps whether you use the Data Export destination or a custom SDK implementation to send events:
In BigQuery, locate or create the dataset where you want the allevents table to be stored, and click the three-dot overflow menu next to its name. The menu opens.
Click Share, then Manage Permissions. The “Manage permissions” page appears.
Click Add principal. The “Add principals” menu opens.
In the “New principals” field, paste the Email ID for the service account.
In the “Select a role” menu, click to expand and choose the BigQuery Data Editor role. This permission is required to create and manage the allevents table.
Click Save.
Now, test the integration:
Download the service account JSON key:
Navigate to IAM and Admin, then click Service Accounts. The “Service accounts” page appears.
Find the service account you created in the previous procedure, and click its name to open it.
Click Keys, then Add Key.
Choose Create new key from the dropdown. The “Create private key” dialog opens with JSON selected.
Click Create. The JSON key automatically downloads to your computer.
Set up product analytics with BigQuery
You can set up product analytics with BigQuery if you are using a third-party customer data platform (CDP) to import your own events. To use the BigQuery Data Export destination, contact us.
Use a third-party customer data platform (CDP) to import your own events
Before you configure product analytics in LaunchDarkly, send the event data in your CDP to BigQuery and run a transformation to shape it into the format Launchdarkly requires.
Configure your custom SDK or CDP to send events to a table in your BigQuery project. These events must be transformed to match LaunchDarkly’s required schema in an allevents table. Here is the structure to use:
Column name
Type
Description
device_id
STRING
Unique identifier for the device
user_id
STRING
Unique identifier for the user
event_name
STRING
Name of tracked event
event_id
STRING
Unique identifier for the event
server_ts
TIMESTAMP
Server-side timestamp of when the event was received
device_ts
TIMESTAMP
Client-side timestamp of when the event occurred
properties
JSON
Event-specific properties of a JSON object
user_properties
JSON
User-specific properties of a JSON object

Use the dataset you created in the previous procedure as the destination for the allevents table.
After you have configured your CDP or custom SDK, return to the “Configure BigQuery warehouse” screen in LaunchDarkly. Complete the following steps:
To use LaunchDarkly product analytics, you must first enable LaunchDarkly’s BigQuery Native product analytics integration. Here’s how:
Click Product analytics in the left navigation, or find it by searching “BigQuery native product analytics” on the Integrations page.
Click Configure. The “Configure BigQuery Native Product Analytics” menu opens.
Choose an environment to set up the integration in. Click Next step.
Select “Use CDP/Custom SDK” as an event tracking method. Click Next step. The “Configure BigQuery warehouse” menu opens.
Give your BigQuery warehouse a human-readable Name.
Enter your project ID in the Project ID field.
Drag and drop the JSON file with your BigQuery credentials into the BigQuery credentials (JSON file) field.
Read and click to acknowledge the Integration Terms and Conditions. Click Save configuration.
On the Product analytics screen in LaunchDarkly, the landing page will update to show a “Waiting for data…” status. Events and other information will begin to populate the screen within 15 minutes. Events from the last 30 days will be available within an hour. Load time varies based on the volume of data you’re importing from BigQuery.
To verify that data is loading, refresh the page. The Dashboards tab will not have any information in it until you create a dashboard, but you can confirm that setup was successful by checking the Events and Attributes tabs. After the import completes, both of those tabs display pre-populated data.
After the event data appears, you will be able to access different aspects of the product analytics UI.
Was this page helpful?
Yes

Setting up product analytics in Databricks
Overview
This topic explains how to set up LaunchDarkly product analytics in Databricks.
Databricks is a cloud-based data processing and analysis platform that lets you work with large sets of data.
Databricks does not support all product analytics features
Not all of the features available in LaunchDarkly product analytics are available in Databricks. User activity, some cohorts features, and some funnel conversion criteria are not supported. To learn more, read Using product analytics charts.
Prerequisites
Before completing this procedure, you must have the following:
Access to a Databricks workspace, including a cluster and application ID.
Find Databricks configuration information
In order to connect LaunchDarkly product analytics to Databricks, you must provide some information about your Databricks workspace to LaunchDarkly. To do this, you must create a service principal and SQL warehouse in Databricks.
Here’s how to create a new service principal:
Log into the Databricks workspace you want to connect to LaunchDarkly.
Navigate to the workspace’s Settings, then Identify and access.
Find the “Service principals” section, then click Manage. The “Service principals” page opens.
Click Add service principal. The “Add service principal” dialog opens.
Click Add new, then enter a Service principal name in the text field. Click Add. The new service principal appears in the “Service principals” page.
Click the new service principal’s name to open its details.
In the “Configurations” tab, verify that the service principal has the following entitlements: Databricks SQL access, and Workspace access. Then click into the “Secrets” tab.
In the “Secrets” tab, click “Generate secret”. The “Generate OAuth secret” menu opens.
Specify a duration for the secret, then click Generate. The secret and client ID appear. Copy both of them and save them somewhere safe.
Now, create a new serverless SQL warehouse and connect it to the service principal. Here’s how:
In Databricks, navigate to the SQL Warehouses page.
Click Create SQL warehouse. The “New serverless SQL warehouse” dialog opens.
Configure a serverless SQL warehouse
You must use a serverless SQL warehouse with LaunchDarkly product analytics.
Enter a Name for the warehouse.
Specify a Cluster size for the warehouse. We recommend choosing the “medium” size.
Click Create. The new warehouse appears in the SQL Warehouses page.
Click the warehouse’s name to open its details.
Click Permissions. The “Manage permissions” dialog opens.
Search for the service principal you created earlier, then select it.
Choose can monitor from the permissions dropdown, then click Add.
Now, find and save the warehouse connection information. You will need it for a step later. a. Navigate to the “SQL Warehouses” page and click into the “Connection details” tab. b. Copy the “Server hostname” and “HTTP path” values and save them somewhere safe.
Now you have a SQL warehouse and an agent that can access it. You also need an allevents table in the warehouse. Here’s how to create it:
In Databricks, navigate to the Catalog page.
Find your organization’s database and the schema within that database. The name and location of these things are unique to your Databricks organization workspace. The database schema contains the allevents table.
Use the correct naming schema
Name these items correctly. The catalog should be named as ld_product_analytics_<project_key>__<environment_key> and the schema as product_analytics_<project_key>__<environment_key>.
Click into the database, then into its “Permissions” tab.
Click Grant. The “Grant on…” dialog opens.
In the “Principals” field, type to find the name of the service principal you created earlier, then click to select it.
In the “Privilege presets” field, type to find the Data Editor privilege, then click to select it. Click Grant.
Set up product analytics with Databricks
Before you configure product analytics in LaunchDarkly, send the event data in your CDP to Databricks and run a transformation to shape it into the format Launchdarkly requires.
Configure your custom SDK or CDP to send events to a table in your Databricks project. These events must be transformed to match LaunchDarkly’s required schema in an allevents table. Here is the structure to use:
Column name
Type
Description
device_id
STRING
Unique identifier for the device
user_id
STRING
Unique identifier for the user
event_name
STRING
Name of tracked event
event_id
STRING
Unique identifier for the event
server_ts
TIMESTAMP
Server-side timestamp of when the event was received
device_ts
TIMESTAMP
Client-side timestamp of when the event occurred
properties
VARIANT
Event-specific properties in JSON format
user_properties
VARIANT
User-specific properties in JSON format

Use the dataset you created in the previous procedure as the destination for the allevents table.
Now, enable LaunchDarkly’s Databricks Native product analytics integration. Here’s how:
Click Product analytics in the left navigation, or find it by searching “Databricks native product analytics” on the Integrations page.
Click Configure. The “Configure Databricks Native Product Analytics” menu opens.
Click Manage integration. The “Configure Databricks Native Product Analytics” menu opens.
Choose an environment to set up the integration in. Click Next step.
Select “Use CDP/Custom SDK” as an event tracking method. Event tracking with a LaunchDarkly SDK is not supported. Click Next step.
Give your Databricks warehouse a human-readable Name.
Enter the server hostname of your Databricks workspace in the Host field.
Enter the Databricks SQL Warehouse HTTP path in the Cluster Path field.
Enter the Databricks client ID in the Client ID field.
Enter the client secret in the Client Secret field.
Read and click to acknowledge the Integration Terms and Conditions. Click Save configuration.
On the Product analytics screen in LaunchDarkly, the landing page will update to show a “Waiting for data…” status. Events and other information will begin to populate the screen within 15 minutes. Events from the last 30 days will be available within an hour. Load time varies based on the volume of data you’re importing from Databricks.
To verify that data is loading, refresh the page. The Dashboards tab will not have any information in it until you create a dashboard, but you can confirm that setup was successful by checking the Events and Attributes tabs. After the import completes, both of those tabs display pre-populated data.
After the event data appears, you will be able to access different aspects of the product analytics UI.
Setting up product analytics in Snowflake
Overview
This topic explains how to set up LaunchDarkly product analytics in Snowflake.
To set up product analytics, you must first connect LaunchDarkly’s Snowflake Native Product Analytics integration to import event and other data to LaunchDarkly. To do this, you provide some information to connect your Snowflake account to LaunchDarkly.
Prerequisites
Before completing this procedure, you must have the following prerequisites:
You should be tracking event data in your application
An active Snowflake account with the SECURITYADMIN and SYSADMIN privileges
Access to Snowflake
Set up product analytics with Snowflake
There are two ways to set up product analytics with Snowflake:
Using the Snowflake Data Export destination
Using a third-party customer data platform (CDP) to import your own events
Click to expand Using the Snowflake Data Export destination





















Click to expand Using a third-party customer data platform (CDP) to import your own events




























































































































































































































































































After you complete the setup steps, the landing page on the Product analytics screen in LaunchDarkly will update to show a “Waiting for data…” status. Events and other information will begin to populate the screen within 15 minutes. Events from the last 30 days will be available within an hour. Load time varies based on the volume of data you’re importing from Snowflake.
To verify that data is loading, refresh the page. The Dashboards tab will not have any information in it until you create a dashboard, but you can confirm that setup was successful by checking the Events and Attributes tabs. After the import completes, both of those tabs display pre-populated data.
After the event data appears, you will be able to access different aspects of the product analytics UI.
To learn more, read Dashboards, Events, Cohorts, and Attributes.

