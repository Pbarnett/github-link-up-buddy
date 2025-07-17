# Supabase Edge Function Documentation

Edge Functions
Globally distributed TypeScript functions.

Edge Functions are server-side TypeScript functions, distributed globally at the edge—close to your users. They can be used for listening to webhooks or integrating your Supabase project with third-parties like Stripe. Edge Functions are developed using Deno, which offers a few benefits to you as a developer:
It is open source.
It is portable. Supabase Edge Functions run locally, and on any other Deno-compatible platform (including self-hosted infrastructure).
It is TypeScript first and supports WASM.
Edge Functions are globally distributed for low-latency.
Get started
Examples#
Check out the Edge Function Examples in our GitHub repository.

With supabase-js
Use the Supabase client inside your Edge Function.

Type-Safe SQL with Kysely
Combining Kysely with Deno Postgres gives you a convenient developer experience for interacting directly with your Postgres database.

Monitoring with Sentry
Monitor Edge Functions with the Sentry Deno SDK.

With CORS headers
Send CORS headers for invoking from the browser.

React Native with Stripe
Full example for using Supabase and Stripe, with Expo.

Flutter with Stripe
Full example for using Supabase and Stripe, with Flutter.

Building a RESTful Service API
Learn how to use HTTP methods and paths to build a RESTful service for managing tasks.

Working with Supabase Storage
An example on reading a file from Supabase Storage.

Open Graph Image Generation
Generate Open Graph images with Deno and Supabase Edge Functions.

OG Image Generation & Storage CDN Caching
Cache generated images with Supabase Storage CDN.

Get User Location
Get user location data from user's IP address.

Cloudflare Turnstile
Protecting Forms with Cloudflare Turnstile.

Connect to Postgres
Connecting to Postgres from Edge Functions.

Github Actions
Deploying Edge Functions with GitHub Actions.

Oak Server Middleware
Request Routing with Oak server middleware.

Hugging Face
Access 100,000+ Machine Learning models.

Amazon Bedrock
Amazon Bedrock Image Generator

OpenAI
Using OpenAI in Edge Functions.

Stripe Webhooks
Handling signed Stripe Webhooks with Edge Functions.

Send emails
Send emails in Edge Functions with Resend.

Web Stream
Server-Sent Events in Edge Functions.

Puppeteer
Generate screenshots with Puppeteer.

Discord Bot
Building a Slash Command Discord Bot with Edge Functions.

Telegram Bot
Building a Telegram Bot with Edge Functions.

Upload File
Process multipart/form-data.

Upstash Redis
Build an Edge Functions Counter with Upstash Redis.

Rate Limiting
Rate Limiting Edge Functions with Upstash Redis.

Slack Bot Mention Edge Function
Slack Bot handling Slack mentions in Edge Function


Developing Edge Functions with Supabase
Get started with Edge Functions on the Supabase dashboard.

In this guide we'll cover how to create a basic Edge Function on the Supabase dashboard, and access it using the Supabase CLI.
Deploy from Dashboard#
Go to your project > Edge Functions > Deploy a new function > Via Editor

This will scaffold a new function for you. You can choose from Templates some of the pre-defined functions for common use cases.

Modify the function as needed, name it, and click Deploy function.
Your function is now active. Navigate to the function's details page, and click on the test button.
You can test your function by providing the expected HTTP method, headers, query parameters, and request body. You can also change the authorization token passed (e.g., anon key or a user key).

Access deployed functions via Supabase CLI#
CLI not installed?
Check out the CLI Docs to learn how to install the Supabase CLI on your local machine.
Now that your function is deployed, you can access it from your local development environment.
Here's how:
Link your project to your local environment.
You can find your project reference ID in the URL of your Supabase dashboard or in the project settings.
supabase link --project-ref your-project-ref
List all Functions in the linked Supabase project.
supabase functions list
Access the specific function you want to work on.
supabase functions download function-name
Make local edits to the function code as needed.
Run your function locally before redeploying.
supabase functions serve function-name
Redeploy when you're ready with your changes.
supabase functions deploy function-name
Deploy via Assistant#
You can also leverage the Supabase Assistant to help you write and deploy edge functions.
Go to your project > Edge Functions > Click on the Assistant icon to Create with Supabase Assistant

This brings up an assistant window with a pre-filled prompt for generating edge functions.
Write up your Edge Function requirement, and let Supabase Assistant do the rest.

Click Deploy and the Assistant will automatically deploy your function.
This function requires an OpenAI API key. You can add the key in your Edge Functions secrets page, or ask Assistant for help.
Navigate to your Edge Functions > Secrets page.
Look for the option to add environment variables.
Add a new environment variable with the key OPENAI_API_KEY and set its value to your actual OpenAI API key.
Once you've set this environment variable, your edge functions will be able to access the OPENAI_API_KEY securely without hardcoding it into the function code. This is a best practice for keeping sensitive information safe.
With your variable set, you can test by sending a request via the dashboard. Navigate to the function's details page, and click on the test button. Then provide a Request Body your function expects.

Editing functions from the Dashboard#
Be careful: there is currently no version control for edits
The Dashboard's Edge Function editor currently does not support versioning or rollbacks. We recommend using it only for quick testing and prototypes. When you’re ready to go to production, store Edge Functions code in a source code repository (e.g., git) and deploy it using one of the CI integrations.
From the functions page, click on the function you want to edit. From the function page, click on the Code tab.
This opens up a code editor in the dashboard where you can see your deployed function's code.
Modify the code as needed, then click Deploy updates. This will overwrite the existing deployment with the newly edited function code.
Next steps#
Check out the Local development guide for more details on working with Edge Functions.
Read on for some common development tips.

Developing Edge Functions locally
Get started with Edge Functions on your local machine.

Let's create a basic Edge Function on your local machine and then invoke it using the Supabase CLI.
Initialize a project#
Create a new Supabase project in a folder on your local machine:
supabase init
CLI not installed?
Check out the CLI Docs to learn how to install the Supabase CLI on your local machine.
If you're using VS code you can have the CLI automatically create helpful Deno settings when running supabase init. Select y when prompted "Generate VS Code settings for Deno? [y/N]"!
If you're using an IntelliJ IDEA editor such as WebStorm, you can use the --with-intellij-settings flag with supabase init to create an auto generated Deno config.
Create an Edge Function#
Let's create a new Edge Function called hello-world inside your project:
supabase functions new hello-world
This creates a function stub in your supabase folder:
└── supabase
   ├── functions
   │   └── hello-world
   │   │   └── index.ts ## Your function code
   └── config.toml
How to write the code#
The generated function uses native Deno.serve to handle requests. It gives you access to Request and Response objects.
Here's the generated Hello World Edge Function, that accepts a name in the Request and responds with a greeting:
Deno.serve(async (req) => {
 const { name } = await req.json()
 const data = {
   message: `Hello ${name}!`,
 }
 return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
})
Running Edge Functions locally#
You can run your Edge Function locally using supabase functions serve:
supabase start # start the supabase stack
supabase functions serve # start the Functions watcher
The functions serve command has hot-reloading capabilities. It will watch for any changes to your files and restart the Deno server.
Invoking Edge Functions locally#
While serving your local Edge Function, you can invoke it using curl or one of the client libraries.
To call the function from a browser you need to handle CORS requests. See CORS.
cURL
JavaScript
curl --request POST 'http://localhost:54321/functions/v1/hello-world' \
 --header 'Authorization: Bearer SUPABASE_ANON_KEY' \
 --header 'Content-Type: application/json' \
 --data '{ "name":"Functions" }'
Where is my SUPABASE_ANON_KEY?
Run supabase status to see your local credentials.
You should see the response { "message":"Hello Functions!" }.
If you execute the function with a different payload, the response will change.
Modify the --data '{"name":"Functions"}' line to --data '{"name":"World"}' and try invoking the command again.
Deploy to Production
Deploy your Edge Functions to your remote Supabase Project.

Once you have developed your Edge Functions locally, you can deploy them to your Supabase project.
Login to the CLI#
Log in to the Supabase CLI if necessary:
supabase login
CLI not installed?
See the CLI Docs to learn how to install the Supabase CLI on your local machine.
Get your project ID#
Get the project ID associated with your function by running:
supabase projects list
Need a new project?
If you haven't yet created a Supabase project, you can do so by visiting database.new.
Link your local project#
Link your local project to your remote Supabase project using the ID you just retrieved:
supabase link --project-ref your-project-id
Deploy your Edge Functions#
Docker required
Since Supabase CLI version 1.123.4, you must have Docker Desktop installed to deploy Edge Functions.
You can deploy all of your Edge Functions with a single command:
supabase functions deploy
You can deploy individual Edge Functions by specifying the name of the function in the deploy command:
supabase functions deploy hello-world
By default, Edge Functions require a valid JWT in the authorization header. If you want to use Edge Functions without Authorization checks (commonly used for Stripe webhooks), you can pass the --no-verify-jwt flag when deploying your Edge Functions.
supabase functions deploy hello-world --no-verify-jwt
Be careful when using this flag, as it will allow anyone to invoke your Edge Function without a valid JWT. The Supabase client libraries automatically handle authorization.
Invoking remote functions#
You can now invoke your Edge Function using the project's ANON_KEY, which can be found in the API settings of the Supabase Dashboard.
cURL
JavaScript
curl --request POST 'https://<project_id>.supabase.co/functions/v1/hello-world' \
 --header 'Authorization: Bearer ANON_KEY' \
 --header 'Content-Type: application/json' \
 --data '{ "name":"Functions" }'
You should receive the response { "message":"Hello Functions!" }.

Local development
Setup local development environment for Edge Functions.

We recommend installing the Deno CLI and related tools for local development.
Deno support#
You can follow the Deno guide for setting up your development environment with your favorite editor/IDE.
Deno with Visual Studio Code#
When using VSCode, you should install both the Deno CLI and the the Deno language server via this link or by browsing the extensions in VSCode and choosing to install the Deno extension.
The Supabase CLI can automatically create helpful Deno settings when running supabase init. Select y when prompted "Generate VS Code settings for Deno? [y/N]"!
Deno support in subfolders#
You can enable the Deno language server for specific sub-paths in a workspace, while using VSCode's built-in JavaScript/TypeScript language server for all other files.
For example if you have a project like this:
project
├── app
└── supabase
 └── functions
To enable the Deno language server only for the supabase/functions folder, add ./supabase/functions to the list of Deno: Enable Paths in the configuration. In your .vscode/settings.json file add:
{
 "deno.enablePaths": ["./supabase/functions"],
 "deno.importMap": "./supabase/functions/import_map.json"
}
Multi-root workspaces in VSCode#
We recommend using deno.enablePaths mentioned above as it's easier to manage, however if you like multi-root workspaces you can use these as an alternative.
For example, see this edge-functions.code-workspace configuration for a CRA (create react app) client with Supabase Edge Functions. You can find the complete example on GitHub.
{
 "folders": [
   {
     "name": "project-root",
     "path": "./"
   },
   {
     "name": "client",
     "path": "app"
   },
   {
     "name": "supabase-functions",
     "path": "supabase/functions"
   }
 ],
 "settings": {
   "files.exclude": {
     "node_modules/": true,
     "app/": true,
     "supabase/functions/": true
   },
   "deno.importMap": "./supabase/functions/import_map.json"
 }
}

Development tips
Tips for getting started with Edge Functions.

Here are a few recommendations when you first start developing Edge Functions.
Skipping authorization checks#
By default, Edge Functions require a valid JWT in the authorization header. If you want to use Edge Functions without Authorization checks (commonly used for Stripe webhooks), you can pass the --no-verify-jwt flag when serving your Edge Functions locally.
supabase functions serve hello-world --no-verify-jwt
Be careful when using this flag, as it will allow anyone to invoke your Edge Function without a valid JWT. The Supabase client libraries automatically handle authorization.
Using HTTP methods#
Edge Functions support GET, POST, PUT, PATCH, DELETE, and OPTIONS. A Function can be designed to perform different actions based on a request's HTTP method. See the example on building a RESTful service to learn how to handle different HTTP methods in your Function.
HTML not supported
HTML content is not supported. GET requests that return text/html will be rewritten to text/plain.
Naming Edge Functions#
We recommend using hyphens to name functions because hyphens are the most URL-friendly of all the naming conventions (snake_case, camelCase, PascalCase).
Organizing your Edge Functions#
We recommend developing "fat functions". This means that you should develop few large functions, rather than many small functions. One common pattern when developing Functions is that you need to share code between two or more Functions. To do this, you can store any shared code in a folder prefixed with an underscore (_). We also recommend a separate folder for Unit Tests including the name of the function followed by a -test suffix.
We recommend this folder structure:
└── supabase
   ├── functions
   │   ├── import_map.json # A top-level import map to use across functions.
   │   ├── _shared
   │   │   ├── supabaseAdmin.ts # Supabase client with SERVICE_ROLE key.
   │   │   └── supabaseClient.ts # Supabase client with ANON key.
   │   │   └── cors.ts # Reusable CORS headers.
   │   ├── function-one # Use hyphens to name functions.
   │   │   └── index.ts
   │   └── function-two
   │   │   └── index.ts
   │   └── tests
   │       └── function-one-test.ts
   │       └── function-two-test.ts
   ├── migrations
   └── config.toml
Using config.toml#
Individual function configuration like JWT verification and import map location can be set via the config.toml file.
[functions.hello-world]
verify_jwt = false
import_map = './import_map.json'
Not using TypeScript#
When you create a new Edge Function, it will use TypeScript by default. However, it is possible to write and deploy Edge Functions using pure JavaScript.
Save your Function as a JavaScript file (e.g. index.js) and then update the supabase/config.toml as follows:
entrypoint is available only in Supabase CLI version 1.215.0 or higher.
[functions.hello-world]
# other entries
entrypoint = './functions/hello-world/index.js' # path must be relative to config.toml
You can use any .ts, .js, .tsx, .jsx or .mjs file as the entrypoint for a Function.
Error handling#
The supabase-js library provides several error types that you can use to handle errors that might occur when invoking Edge Functions:
import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from '@supabase/supabase-js'
const { data, error } = await supabase.functions.invoke('hello', {
 headers: { 'my-custom-header': 'my-custom-header-value' },
 body: { foo: 'bar' },
})
if (error instanceof FunctionsHttpError) {
 const errorMessage = await error.context.json()
 console.log('Function returned an error', errorMessage)
} else if (error instanceof FunctionsRelayError) {
 console.log('Relay error:', error.message)
} else if (error instanceof FunctionsFetchError) {
 console.log('Fetch error:', error.message)
}
Database Functions vs Edge Functions#
For data-intensive operations we recommend using Database Functions, which are executed within your database and can be called remotely using the REST and GraphQL API.
For use-cases which require low-latency we recommend Edge Functions, which are globally-distributed and can be written in TypeScript.

Managing dependencies
Managing packages and dependencies.

Importing dependencies#
Supabase Edge Functions support several ways to import dependencies:
JavaScript modules from npm (https://docs.deno.com/examples/npm/)
Built-in Node APIs
Modules published to JSR or deno.land/x
NPM modules#
You can import npm modules using the npm: specifier:
import { createClient } from 'npm:@supabase/supabase-js@2'
Node.js built-ins#
For Node.js built-in APIs, use the node: specifier:
import process from 'node:process'
Learn more about npm specifiers and Node built-in APIs in Deno's documentation.
JSR#
You can import JS modules published to JSR (e.g.: Deno's standard library), using the jsr: specifier:
import path from 'jsr:@std/path@1.0.8'
Managing dependencies#
Developing with Edge Functions is similar to developing with Node.js, but with a few key differences.
In the Deno ecosystem, each function should be treated as an independent project with its own set of dependencies and configurations. This "isolation by design" approach:
Ensures each function has explicit control over its dependencies
Prevents unintended side effects between functions
Makes deployments more predictable and maintainable
Allows for different versions of the same dependency across functions
For these reasons, we recommend maintaining separate configuration files (deno.json, .npmrc, or import_map.json) within each function's directory, even if it means duplicating some configurations.
There are two ways to manage your dependencies in Supabase Edge Functions:
Using deno.json (recommended)#
This feature requires Supabase CLI version 1.215.0 or higher.
Each function should have its own deno.json file to manage dependencies and configure Deno-specific settings. This ensures proper isolation between functions and is the recommended approach for deployment. For a complete list of supported options, see the official Deno configuration documentation.
{
 "imports": {
   "lodash": "https://cdn.skypack.dev/lodash"
 }
}
The recommended file structure for deployment:
└── supabase
   ├── functions
   │   ├── function-one
   │   │   ├── index.ts
   │   │   ├─- deno.json    # Function-specific Deno configuration
   │   │   └── .npmrc       # Function-specific npm configuration (if needed)
   │   └── function-two
   │       ├── index.ts
   │       ├─- deno.json    # Function-specific Deno configuration
   │       └── .npmrc       # Function-specific npm configuration (if needed)
   └── config.toml
While it's possible to use a global deno.json in the /supabase/functions directory for local
development, this approach is not recommended for deployment. Each function should maintain its
own configuration to ensure proper isolation and dependency management.
Using import maps (legacy)#
Import Maps are a legacy way to manage dependencies, similar to a package.json file. While still supported, we recommend using deno.json. If both exist, deno.json takes precedence.
Each function should have its own import_map.json file for proper isolation:
{
 "imports": {
   "lodash": "https://cdn.skypack.dev/lodash"
 }
}
The recommended file structure:
└── supabase
   ├── functions
   │   ├── function-one
   │   │   ├── index.ts
   │   │   └── import_map.json    # Function-specific import map
   │   └── function-two
   │       ├── index.ts
   │       └── import_map.json    # Function-specific import map
   └── config.toml
While it's possible to use a global import_map.json in the /supabase/functions directory for
local development, this approach is not recommended for deployment. Each function should maintain
its own import map to ensure proper isolation.
If using import maps with VSCode, update your .vscode/settings.json to point to your function-specific import map:
{
 "deno.enable": true,
 "deno.unstable": [
   "bare-node-builtins",
   "byonm"
   // ... other flags ...
 ],
 "deno.importMap": "./supabase/functions/my-function/import_map.json"
}
You can override the default import map location using the --import-map <string> flag with serve and deploy commands, or by setting the import_map property in your config.toml file:
[functions.my-function]
import_map = "./supabase/functions/my-function/import_map.json"
Importing from private registries#
This feature requires Supabase CLI version 1.207.9 or higher.
To use private npm packages, create a .npmrc file within your function directory. This ensures proper isolation and dependency management for each function.
└── supabase
   └── functions
       └── my-function
           ├── index.ts
           ├── deno.json
           └── .npmrc       # Function-specific npm configuration
Add your registry details in the .npmrc file. Follow this guide to learn more about the syntax of npmrc files.
@myorg:registry=https://npm.registryhost.com
//npm.registryhost.com/:_authToken=VALID_AUTH_TOKEN
While it's possible to use a global .npmrc in the /supabase/functions directory for local
development, we recommend using function-specific .npmrc files for deployment to maintain proper
isolation.
After configuring your .npmrc, you can import the private package in your function code:
import MyPackage from 'npm:@myorg/private-package@v1.0.1'
// use MyPackage
Using a custom NPM registry#
This feature requires Supabase CLI version 2.2.8 or higher.
Some organizations require a custom NPM registry for security and compliance purposes. In such instances, you can specify the custom NPM registry to use via NPM_CONFIG_REGISTRY environment variable.
You can define it in the project's .env file or directly specify it when running the deploy command:
NPM_CONFIG_REGISTRY=https://custom-registry/ supabase functions deploy my-function
Importing types#
If your environment is set up properly and the module you're importing is exporting types, the import will have types and autocompletion support.
Some npm packages may not ship out of the box types and you may need to import them from a separate package. You can specify their types with a @deno-types directive:
// @deno-types="npm:@types/express@^4.17"
import express from 'npm:express@^4.17'
To include types for built-in Node APIs, add the following line to the top of your imports:
/// <reference types="npm:@types/node" />

Managing Secrets (Environment Variables)
Managing secrets and environment variables.

It's common that you will need to use environment variables or other sensitive information in Edge Functions. You can manage secrets using the CLI or the Dashboard.
You can access these using Deno's built-in handler
Deno.env.get('MY_SECRET_NAME')
Default secrets#
Edge Functions have access to these secrets by default:
SUPABASE_URL: The API gateway for your Supabase project.
SUPABASE_ANON_KEY: The anon key for your Supabase API. This is safe to use in a browser when you have Row Level Security enabled.
SUPABASE_SERVICE_ROLE_KEY: The service_role key for your Supabase API. This is safe to use in Edge Functions, but it should NEVER be used in a browser. This key will bypass Row Level Security.
SUPABASE_DB_URL: The URL for your Postgres database. You can use this to connect directly to your database.
Local secrets#
You can load environment variables in two ways:
Through an .env file placed at supabase/functions/.env, which is automatically loaded on supabase start
Through the --env-file option for supabase functions serve, for example: supabase functions serve --env-file ./path/to/.env-file
Let's create a local file for storing our secrets, and inside it we can store a secret MY_NAME:
echo "MY_NAME=Yoda" >> ./supabase/.env.local
This creates a new file ./supabase/.env.local for storing your local development secrets.
Never check your .env files into Git!
Now let's access this environment variable MY_NAME inside our Function. Anywhere in your function, add this line:
console.log(Deno.env.get('MY_NAME'))
Now we can invoke our function locally, by serving it with our new .env.local file:
supabase functions serve --env-file ./supabase/.env.local
When the function starts you should see the name “Yoda” output to the terminal.
Production secrets#
You will also need to set secrets for your production Edge Functions. You can do this via the Dashboard or using the CLI.
Using the Dashboard#
Visit Edge Function Secrets Management page in your Dashboard.
Add the Key and Value for your secret and press Save.
Note that you can paste multiple secrets at a time.

Using the Management API#
You can also manage secrets programmatically using the Management API:
# First, get your access token from https://supabase.com/dashboard/account/tokens
export SUPABASE_ACCESS_TOKEN="your-access-token"
export PROJECT_REF="your-project-ref"
# Create a secret
curl -X POST "https://api.supabase.com/v1/projects/$PROJECT_REF/secrets" \
 -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
 -H "Content-Type: application/json" \
 -d '[{
   "name": "MY_SECRET_NAME",
   "value": "my-secret-value"
 }]'
# List all secrets
curl -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
 "https://api.supabase.com/v1/projects/$PROJECT_REF/secrets"
# Delete a secret
curl -X DELETE "https://api.supabase.com/v1/projects/$PROJECT_REF/secrets" \
 -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
 -H "Content-Type: application/json" \
 -d '["MY_SECRET_NAME"]'
Using the CLI#
Let's create a .env to help us deploy our secrets to production. In this case we'll just use the same as our local secrets:
cp ./supabase/.env.local ./supabase/.env
This creates a new file ./supabase/.env for storing your production secrets.
Never check your .env files into Git! You only use the .env file to help deploy your secrets to production. Don't commit it to your repository.
Let's push all the secrets from the .env file to our remote project using supabase secrets set:
supabase secrets set --env-file ./supabase/.env
# You can also set secrets individually using:
supabase secrets set MY_NAME=Chewbacca
You don't need to re-deploy after setting your secrets.
To see all the secrets which you have set remotely, use supabase secrets list:
supabase secrets list

Integrating With Supabase Auth
Supabase Edge Functions and Auth.

Edge Functions work seamlessly with Supabase Auth.
Auth context#
When a user makes a request to an Edge Function, you can use the Authorization header to set the Auth context in the Supabase client:
import { createClient } from 'npm:@supabase/supabase-js@2'
Deno.serve(async (req: Request) => {
 const supabaseClient = createClient(
   Deno.env.get('SUPABASE_URL') ?? '',
   Deno.env.get('SUPABASE_ANON_KEY') ?? '',
   // Create client with Auth context of the user that called the function.
   // This way your row-level-security (RLS) policies are applied.
   {
     global: {
       headers: { Authorization: req.headers.get('Authorization')! },
     },
   }
 );
 // Get the session or user object
 const authHeader = req.headers.get('Authorization')!;
 const token = authHeader.replace('Bearer ', '');
 const { data } = await supabaseClient.auth.getUser(token);
})
Importantly, this is done inside the Deno.serve() callback argument, so that the Authorization header is set for each request.
Fetching the user#
By getting the JWT from the Authorization header, you can provide the token to getUser() to fetch the user object to obtain metadata for the logged in user.
import { createClient } from 'npm:@supabase/supabase-js@2'
Deno.serve(async (req: Request) => {
 const supabaseClient = createClient(
   Deno.env.get('SUPABASE_URL') ?? '',
   Deno.env.get('SUPABASE_ANON_KEY') ?? '',
   {
     global: {
       headers: { Authorization: req.headers.get('Authorization') },
     },
   }
 )
 // Get the session or user object
 const authHeader = req.headers.get('Authorization')!
 const token = authHeader.replace('Bearer ', '')
 const { data } = await supabaseClient.auth.getUser(token)
 const user = data.user
 return new Response(JSON.stringify({ user }), {
   headers: { 'Content-Type': 'application/json' },
   status: 200,
 })
})
Row Level Security#
After initializing a Supabase client with the Auth context, all queries will be executed with the context of the user. For database queries, this means Row Level Security will be enforced.
import { createClient } from 'npm:@supabase/supabase-js@2'
Deno.serve(async (req: Request) => {
 const supabaseClient = createClient(
   Deno.env.get('SUPABASE_URL') ?? '',
   Deno.env.get('SUPABASE_ANON_KEY') ?? '',
   // Create client with Auth context of the user that called the function.
   // This way your row-level-security (RLS) policies are applied.
   {
     global: {
       headers: { Authorization: req.headers.get('Authorization')! },
     },
   }
 );
 // Get the session or user object
 const authHeader = req.headers.get('Authorization')!;
 const token = authHeader.replace('Bearer ', '');
 const { data: userData } = await supabaseClient.auth.getUser(token);
 const { data, error } = await supabaseClient.from('profiles').select('*');
 return new Response(JSON.stringify({ data }), {
   headers: { 'Content-Type': 'application/json' },
   status: 200,
 })
})



// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'npm:supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log(`Function "select-from-table-with-auth-rls" up and running!`)

Deno.serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // First get the token from the Authorization header
    const token = req.headers.get('Authorization').replace('Bearer ', '')

    // Now we can get the session or user object
    const {
      data: { user },
    } = await supabaseClient.auth.getUser(token)

    // And we can run queries in the context of our authenticated user
    const { data, error } = await supabaseClient.from('users').select('*')
    if (error) throw error

    return new Response(JSON.stringify({ user, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/select-from-table-with-auth-rls' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
Connecting directly to Postgres
Connecting to Postgres from Edge Functions.

Connect to your Postgres database from an Edge Function by using the supabase-js client.
You can also use other Postgres clients like Deno Postgres
Using supabase-js#
The supabase-js client is a great option for connecting to your Supabase database since it handles authorization with Row Level Security, and it automatically formats your response as JSON.
import { createClient } from 'npm:@supabase/supabase-js@2'
Deno.serve(async (req) => {
 try {
   const supabase = createClient(
     Deno.env.get('SUPABASE_URL') ?? '',
     Deno.env.get('SUPABASE_ANON_KEY') ?? '',
     { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
   )
   const { data, error } = await supabase.from('countries').select('*')
   if (error) {
     throw error
   }
   return new Response(JSON.stringify({ data }), {
     headers: { 'Content-Type': 'application/json' },
     status: 200,
   })
 } catch (err) {
   return new Response(String(err?.message ?? err), { status: 500 })
 }
})
Using a Postgres client#
Because Edge Functions are a server-side technology, it's safe to connect directly to your database using any popular Postgres client. This means you can run raw SQL from your Edge Functions.
Here is how you can connect to the database using Deno Postgres driver and run raw SQL.
Check out the full example.
import * as postgres from 'https://deno.land/x/postgres@v0.17.0/mod.ts'
// Get the connection string from the environment variable "SUPABASE_DB_URL"
const databaseUrl = Deno.env.get('SUPABASE_DB_URL')!
// Create a database pool with three connections that are lazily established
const pool = new postgres.Pool(databaseUrl, 3, true)
Deno.serve(async (_req) => {
 try {
   // Grab a connection from the pool
   const connection = await pool.connect()
   try {
     // Run a query
     const result = await connection.queryObject`SELECT * FROM animals`
     const animals = result.rows // [{ id: 1, name: "Lion" }, ...]
     // Encode the result as pretty printed JSON
     const body = JSON.stringify(
       animals,
       (key, value) => (typeof value === 'bigint' ? value.toString() : value),
       2
     )
     // Return the response with the correct content type header
     return new Response(body, {
       status: 200,
       headers: { 'Content-Type': 'application/json; charset=utf-8' },
     })
   } finally {
     // Release the connection back into the pool
     connection.release()
   }
 } catch (err) {
   console.error(err)
   return new Response(String(err?.message ?? err), { status: 500 })
 }
})
Using Drizzle#
You can use Drizzle together with Postgres.js. Both can be loaded directly from npm:
{
 "imports": {
   "drizzle-orm": "npm:drizzle-orm@0.29.1",
   "drizzle-orm/": "npm:/drizzle-orm@0.29.1/",
   "postgres": "npm:postgres@3.4.3"
 }
}
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { countries } from '../_shared/schema.ts'
const connectionString = Deno.env.get('SUPABASE_DB_URL')!
Deno.serve(async (_req) => {
 // Disable prefetch as it is not supported for "Transaction" pool mode
 const client = postgres(connectionString, { prepare: false })
 const db = drizzle(client)
 const allCountries = await db.select().from(countries)
 return Response.json(allCountries)
})
You can find the full example on GitHub.
SSL connections#
Deployed edge functions are pre-configured to use SSL for connections to the Supabase database. You don't need to add any extra configurations.
If you want to use SSL connections during local development, follow these steps:
Download the SSL certificate from Database settings
In your local .env file, add these two variables:
SSL_CERT_FILE=/path/to/cert.crt # set the path to the downloaded cert
DENO_TLS_CA_STORE=mozilla,system

Handling Routing in Functions
How to handle custom routing within Edge Functions.

Usually, an Edge Function is written to perform a single action (e.g. write a record to the database). However, if your app's logic is split into multiple Edge Functions requests to each action may seem slower.
This is because each Edge Function needs to be booted before serving a request (known as cold starts). If an action is performed less frequently (e.g. deleting a record), there is a high-chance of that function experiencing a cold-start.
One way to reduce the cold starts and increase performance of your app is to combine multiple actions into a single Edge Function. This way only one instance of the Edge Function needs to be booted and it can handle multiple requests to different actions.
For example, we can use a single Edge Function to create a typical CRUD API (create, read, update, delete records).
To combine multiple endpoints into a single Edge Function, you can use web application frameworks such as Express, Oak, or Hono.
Let's dive into some examples.
Routing with frameworks#
Here's a simple hello world example using some popular web frameworks.
Create a new function called hello-world using Supabase CLI:
supabase functions new hello-world
Copy and paste the following code:
Express
Oak
Hono
Deno
import { Hono } from 'jsr:@hono/hono';
const app = new Hono();
app.post('/hello-world', async (c) => {
 const { name } = await c.req.json();
 return new Response(`Hello ${name}!`)
});
app.get('/hello-world', (c) => {
 return new Response('Hello World!')
});
Deno.serve(app.fetch);
You will notice in the above example, we created two routes - GET and POST. The path for both routes are defined as /hello-world.
If you run a server outside of Edge Functions, you'd usually set the root path as / .
However, within Edge Functions, paths should always be prefixed with the function name (in this case hello-world).
You can deploy the function to Supabase via:
supabase functions deploy hello-world
Once the function is deployed, you can try to call the two endpoints using cURL (or Postman).
# https://supabase.com/docs/guides/functions/deploy#invoking-remote-functions
curl --request GET 'https://<project_ref>.supabase.co/functions/v1/hello-world' \
 --header 'Authorization: Bearer ANON_KEY' \
This should print the response as Hello World!, meaning it was handled by the GET route.
Similarly, we can make a request to the POST route.
# https://supabase.com/docs/guides/functions/deploy#invoking-remote-functions
curl --request POST 'https://<project_ref>.supabase.co/functions/v1/hello-world' \
 --header 'Authorization: Bearer ANON_KEY' \
 --header 'Content-Type: application/json' \
 --data '{ "name":"Foo" }'
We should see a response printing Hello Foo!.
Using route parameters#
We can use route parameters to capture values at specific URL segments (e.g. /tasks/:taskId/notes/:noteId).
Here's an example Edge Function implemented using the Framework for managing tasks using route parameters.
Keep in mind paths must be prefixed by function name (i.e. tasks in this example). Route parameters can only be used after the function name prefix.
Express
Oak
Hono
Deno
URL patterns API#
If you prefer not to use a web framework, you can directly use URL Pattern API within your Edge Functions to implement routing.
This is ideal for small apps with only couple of routes and you want to have a custom matching algorithm.
Here is an example Edge Function using URL Patterns API: https://github.com/supabase/supabase/blob/master/examples/edge-functions/supabase/functions/restful-tasks/index.ts

Background Tasks
How to run background tasks in an Edge Function outside of the request handler

Edge Function instances can process background tasks outside of the request handler. Background tasks are useful for asynchronous operations like uploading a file to Storage, updating a database, or sending events to a logging service. You can respond to the request immediately and leave the task running in the background.
How it works#
You can use EdgeRuntime.waitUntil(promise) to explicitly mark background tasks. The Function instance continues to run until the promise provided to waitUntil completes.
The maximum duration is capped based on the wall-clock, CPU, and memory limits. The Function will shutdown when it reaches one of these limits.
You can listen to the beforeunload event handler to be notified when Function invocation is about to be shut down.
Example#
Here's an example of using EdgeRuntime.waitUntil to run a background task and using beforeunload event to be notified when the instance is about to be shut down.
async function longRunningTask() {
 // do work here
}
// Mark the longRunningTask's returned promise as a background task.
// note: we are not using await because we don't want it to block.
EdgeRuntime.waitUntil(longRunningTask())
// Use beforeunload event handler to be notified when function is about to shutdown
addEventListener('beforeunload', (ev) => {
 console.log('Function will be shutdown due to', ev.detail?.reason)
 // save state or log the current progress
})
// Invoke the function using a HTTP request.
// This will start the background task
Deno.serve(async (req) => {
 return new Response('ok')
})
Starting a background task in the request handler#
You can call EdgeRuntime.waitUntil in the request handler too. This will not block the request.
async function fetchAndLog(url: string) {
 const response = await fetch(url)
 console.log(response)
}
Deno.serve(async (req) => {
 // this will not block the request,
 // instead it will run in the background
 EdgeRuntime.waitUntil(fetchAndLog('https://httpbin.org/json'))
 return new Response('ok')
})
Testing background tasks locally#
When testing Edge Functions locally with Supabase CLI, the instances are terminated automatically after a request is completed. This will prevent background tasks from running to completion.
To prevent that, you can update the supabase/config.toml with the following settings:
[edge_runtime]
policy = "per_worker"
When running with per_worker policy, Function won't auto-reload on edits. You will need to manually restart it by running supabase functions serve.

Ephemeral Storage
Read and write from temporary directory

Edge Functions provides ephemeral file storage. You can read and write files to the /tmp directory.
Ephemeral storage will reset on each function invocation. This means the files you write during an invocation can only be read within the same invocation.
Use cases#
Here are some use cases where ephemeral storage can be useful:
Unzip an archive of CSVs and then add them as records to the DB
Custom image manipulation workflows (using magick-wasm)
You can use Background Tasks to handle slow file processing outside of a request.
How to use#
You can use Deno File System APIs or the node:fs module to access the /tmp path.
Example#
Here is an example of how to write a user-uploaded zip file into temporary storage for further processing.
Deno.serve(async (req) => {
 if (req.headers.get('content-type') !== 'application/zip') {
   return new Response('file must be a zip file', {
     status: 400,
   })
 }
 const uploadId = crypto.randomUUID()
 await Deno.writeFile('/tmp/' + uploadId, req.body)
 // do something with the written zip file
 return new Response('ok')
})
Unavailable APIs#
Currently, the synchronous APIs (e.g. Deno.writeFileSync or Deno.mkdirSync) for creating or writing files are not supported.
You can use sync variations of read APIs (e.g. Deno.readFileSync).
Limits#
In the hosted platform, a free project can write up to 256MB of data to ephemeral storage. A paid project can write up to 512MB.

Running AI Models
How to run AI models in Edge Functions.

Supabase Edge Runtime has a built-in API for running AI models. You can use this API to generate embeddings, build conversational workflows, and do other AI related tasks in your Edge Functions.
Setup#
There are no external dependencies or packages to install to enable the API.
You can create a new inference session by doing:
const model = new Supabase.ai.Session('model-name')
To get type hints and checks for the API you can import types from functions-js at the top of your file:
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
Running a model inference#
Once the session is instantiated, you can call it with inputs to perform inferences. Depending on the model you run, you may need to provide different options (discussed below).
const output = await model.run(input, options)
How to generate text embeddings#
Now let's see how to write an Edge Function using the Supabase.ai API to generate text embeddings. Currently, Supabase.ai API only supports the gte-small model.
gte-small model exclusively caters to English texts, and any lengthy texts will be truncated to a maximum of 512 tokens. While you can provide inputs longer than 512 tokens, truncation may affect the accuracy.
const model = new Supabase.ai.Session('gte-small')
Deno.serve(async (req: Request) => {
 const params = new URL(req.url).searchParams
 const input = params.get('input')
 const output = await model.run(input, { mean_pool: true, normalize: true })
 return new Response(JSON.stringify(output), {
   headers: {
     'Content-Type': 'application/json',
     Connection: 'keep-alive',
   },
 })
})
Using Large Language Models (LLM)#
Inference via larger models is supported via Ollama and Mozilla Llamafile. In the first iteration, you can use it with a self-managed Ollama or Llamafile server. We are progressively rolling out support for the hosted solution. To sign up for early access, fill up this form.
Running locally#
Ollama
Mozilla Llamafile
Install Ollama and pull the Mistral model
ollama pull mistral
Run the Ollama server locally
ollama serve
Set a function secret called AI_INFERENCE_API_HOST to point to the Ollama server
echo "AI_INFERENCE_API_HOST=http://host.docker.internal:11434" >> supabase/functions/.env
Create a new function with the following code
supabase functions new ollama-test
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
const session = new Supabase.ai.Session('mistral')
Deno.serve(async (req: Request) => {
 const params = new URL(req.url).searchParams
 const prompt = params.get('prompt') ?? ''
 // Get the output as a stream
 const output = await session.run(prompt, { stream: true })
 const headers = new Headers({
   'Content-Type': 'text/event-stream',
   Connection: 'keep-alive',
 })
 // Create a stream
 const stream = new ReadableStream({
   async start(controller) {
     const encoder = new TextEncoder()
     try {
       for await (const chunk of output) {
         controller.enqueue(encoder.encode(chunk.response ?? ''))
       }
     } catch (err) {
       console.error('Stream error:', err)
     } finally {
       controller.close()
     }
   },
 })
 // Return the stream to the user
 return new Response(stream, {
   headers,
 })
})
Serve the function
supabase functions serve --env-file supabase/functions/.env
Execute the function
curl --get "http://localhost:54321/functions/v1/ollama-test" \
--data-urlencode "prompt=write a short rap song about Supabase, the Postgres Developer platform, as sung by Nicki Minaj" \
-H "Authorization: $ANON_KEY"
Deploying to production#
Once the function is working locally, it's time to deploy to production.
Deploy an Ollama or Llamafile server and set a function secret called AI_INFERENCE_API_HOST to point to the deployed server
supabase secrets set AI_INFERENCE_API_HOST=https://path-to-your-llm-server/
Deploy the Supabase function
supabase functions deploy
Execute the function
curl --get "https://project-ref.supabase.co/functions/v1/ollama-test" \
--data-urlencode "prompt=write a short rap song about Supabase, the Postgres Developer platform, as sung by Nicki Minaj" \
-H "Authorization: $ANON_KEY"
As demonstrated in the video above, running Ollama locally is typically slower than running it in on a server with dedicated GPUs. We are collaborating with the Ollama team to improve local performance.
In the future, a hosted LLM API, will be provided as part of the Supabase platform. Supabase will scale and manage the API and GPUs for you. To sign up for early access, fill up this form.
Using Wasm modules
How to use WebAssembly in Edge Functions.

Edge Functions supports running WebAssembly (Wasm) modules. WebAssembly is useful if you want to optimize code that's slower to run in JavaScript or require low-level manipulation.
It also gives you the option to port existing libraries written in other languages to be used with JavaScript. For example, magick-wasm, which does image manipulation and transforms, is a port of an existing C library to WebAssembly.
Writing a Wasm module#
You can use different languages and SDKs to write Wasm modules. For this tutorial, we will write a simple Wasm module in Rust that adds two numbers.
Follow this guide on writing Wasm modules in Rust to setup your dev environment.
Create a new Edge Function called wasm-add.
supabase functions new wasm-add
Create a new Cargo project for the Wasm module inside the function's directory:
cd supabase/functions/wasm-add
cargo new --lib add-wasm
Add the following code to add-wasm/src/lib.rs.
use wasm_bindgen::prelude::*;
#[wasm_bindgen]
pub fn add(a: u32, b: u32) -> u32 {
   a + b
}
View source
Update the add-wasm/Cargo.toml to include the wasm-bindgen dependency.
[package]
name = "add-wasm"
version = "0.1.0"
description = "A simple wasm module that adds two numbers"
license = "MIT/Apache-2.0"
edition = "2021"
[lib]
crate-type = ["cdylib"]
[dependencies]
wasm-bindgen = "0.2"
View source
After that we can build the package, by running:
wasm-pack build --target deno
This will produce a Wasm binary file inside add-wasm/pkg directory.
Calling the Wasm module from the Edge Function#
Now let's update the Edge Function to call add from the Wasm module.
import { add } from "./add-wasm/pkg/add_wasm.js";
Deno.serve(async (req) => {
 const { a, b } = await req.json();
 return new Response(
   JSON.stringify({ result: add(a, b) }),
   { headers: { "Content-Type": "application/json" } },
 );
});
View source
Supabase Edge Functions currently use Deno 1.46. From Deno 2.1, importing Wasm
modules will require even less boilerplate code.
Bundle and deploy the Edge Function#
Before deploying the Edge Function, we need to ensure it bundles the Wasm module with it. We can do this by defining it in the static_files for the function in superbase/config.toml.
You will need update Supabase CLI to 2.7.0 or higher for the static_files support.
[functions.wasm-add]
static_files = [ "./functions/wasm-add/add-wasm/pkg/*"]
Deploy the function by running:
supabase functions deploy wasm-add

Deploying with CI / CD pipelines
Use GitHub Actions, Bitbucket, and GitLab CI to deploy your Edge Functions.

You can use popular CI / CD tools like GitHub Actions, Bitbucket, and GitLab CI to automate Edge Function deployments.
GitHub Actions#
You can use the official setup-cli GitHub Action to run Supabase CLI commands in your GitHub Actions.
The following GitHub Action deploys all Edge Functions any time code is merged into the main branch:
name: Deploy Function
on:
 push:
   branches:
     - main
 workflow_dispatch:
jobs:
 deploy:
   runs-on: ubuntu-latest
   env:
     SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
     PROJECT_ID: your-project-id
   steps:
     - uses: actions/checkout@v4
     - uses: supabase/setup-cli@v1
       with:
         version: latest
     - run: supabase functions deploy --project-ref $PROJECT_ID
GitLab CI#
Here is the sample pipeline configuration to deploy via GitLab CI.
image: node:20
# List of stages for jobs, and their order of execution
stages:
 - setup
 - deploy
# This job runs in the setup stage, which runs first.
setup-npm:
 stage: setup
 script:
   - npm i supabase
 cache:
   paths:
     - node_modules/
 artifacts:
   paths:
     - node_modules/
# This job runs in the deploy stage, which only starts when the job in the build stage completes successfully.
deploy-function:
 stage: deploy
 script:
   - npx supabase init
   - npx supabase functions deploy --debug
 services:
   - docker:dind
 variables:
   DOCKER_HOST: tcp://docker:2375
Bitbucket Pipelines#
Here is the sample pipeline configuration to deploy via Bitbucket.
image: node:20
pipelines:
 default:
   - step:
       name: Setup
       caches:
         - node
       script:
         - npm i supabase
   - parallel:
       - step:
           name: Functions Deploy
           script:
             - npx supabase init
             - npx supabase functions deploy --debug
           services:
             - docker
Declarative configuration#
Individual function configuration like JWT verification and import map location can be set via the config.toml file.
[functions.hello-world]
verify_jwt = false

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

Using Deno 2
Everything you need to know about the Deno 2 runtime

This feature is in Public Alpha. Submit a support ticket if you have any issues.
What is Deno 2?#
Deno 2 is a major upgrade to the Deno runtime that powers Supabase Edge Functions. It focuses on scalability and seamless ecosystem compatibility while maintaining Deno's core principles of security, simplicity, and developer experience.
Key improvements include
Node.js and npm compatibility: Dramatically improved support for npm packages and Node.js code
Better dependency management: New tools like deno install, deno add, and deno remove for simplified package management
Improved performance: Enhanced runtime execution and startup times
Workspace and monorepo support: Better handling of complex project structures
Framework compatibility: Support for Next.js, SvelteKit, Remix, and other popular frameworks
Full package.json support: Works seamlessly with existing Node.js projects and npm workspaces
While these improvements are exciting, they come with some changes that may affect your existing functions. We'll support Deno 1.x functions for a limited time, but we recommend migrating to Deno 2 within the next few months to ensure continued functionality.
How to use Deno 2#
Deno 2 will soon become the default choice for creating new functions. For now, Deno 2 is available in preview mode for local development.
Here's how you can build and deploy a function with Deno 2:
Install Deno 2.1 or newer version on your machine
Go to your Supabase project. cd my-supabase-project
Open supabase/config.toml and set deno_version = 2
[edge_runtime]
deno_version = 2
All your existing functions should work as before.
To scaffold a new function as a Deno 2 project:
deno init --serve hello-world
Open supabase/config.toml and add the following:
[functions.hello-world]
entrypoint = "./functions/hello-world/main.ts"
Open supabase/functions/hello-world/main.ts and modify line 10 to:
if (url.pathname === "/hello-world") {
Use npx supabase@beta functions serve --no-verify-jwt to start the dev server.
Visit http://localhost:54321/functions/v1/hello-world.
To run built-in tests, cd supabase/functions/hello-world; deno test
How to migrate existing functions from Deno 1 to Deno 2#
For a comprehensive migration guide, see the official Deno 1.x to 2.x migration guide.
Most Deno 1 Edge Functions will be compatible out of the box with Deno 2, and no action needs to be taken. When we upgrade our hosted runtime, your functions will automatically be deployed on a Deno 2 cluster.
However, for a small number of functions, this may break existing functionality.
The most common issue to watch for is that some Deno 1 API calls are incompatible with Deno 2 runtime.
For instance if you are using:
Deno.Closer
Use Closer from the Standard Library instead.
+ import type { Closer } from "jsr:@std/io/types";
- function foo(closer: Deno.Closer) {
+ function foo(closer: Closer) {
 // ...
}
The best way to validate your APIs are up to date is to use the Deno lint, which has rules to disallow deprecated APIs.
deno lint
For a full list of API changes, see the official Deno 2 list.
Local Debugging with DevTools
How to use Chrome DevTools to debug Edge Functions.

Since v1.171.0 the Supabase CLI supports debugging Edge Functions via the v8 inspector protocol, allowing for debugging via Chrome DevTools and other Chromium-based browsers.
Inspect with Chrome Developer Tools#
You can use the Chrome DevTools to set breakpoints and inspect the execution of your Edge Functions.
Serve your functions in inspect mode: supabase functions serve --inspect-mode brk. This will set a breakpoint at the first line to pause script execution before any code runs.
In your Chrome browser navigate to chrome://inspect.
Click the "Configure..."" button to the right of the Discover network targets checkbox.
In the Target discovery settings dialog box that opens, enter 127.0.0.1:8083 in the blank space and click the "Done" button to exit the dialog box.
Click "Open dedicated DevTools for Node" to complete the preparation for debugging. The opened DevTools window will now listen to any incoming requests to edge-runtime.
Send a request to your function running locally, e.g. via curl or Postman. The DevTools window will now pause script execution at first line.
In the "Sources" tab navigate to file:// > home/deno/functions/<your-function-name>/index.ts.
Use the DevTools to set breakpoints and inspect the execution of your Edge Function.


Logging
How to access logs for your Edge Functions.

Logs are provided for each function invocation, locally and in hosted environments.
How to access logs#
Hosted#
You can access both tools from the Functions section of the Dashboard. Select your function from the list, and click Invocations or Logs:
Invocations: shows the Request and Response for each execution. You can see the headers, body, status code, and duration of each invocation. You can also filter the invocations by date, time, or status code.
Logs: shows any platform events, uncaught exceptions, and custom log events. You can see the timestamp, level, and message of each log event. You can also filter the log events by date, time, or level.

Local#
When developing locally you will see error messages and console log statements printed to your local terminal window.
Events that get logged#
Uncaught exceptions: Uncaught exceptions thrown by a function during execution are automatically logged. You can see the error message and stack trace in the Logs tool.
Custom log events: You can use console.log, console.error, and console.warn in your code to emit custom log events. These events also appear in the Logs tool.
Boot and Shutdown Logs: The Logs tool extends its coverage to include logs for the boot and shutdown of functions.
A custom log message can contain up to 10,000 characters. A function can log up to 100 events
within a 10 second period.
Here is an example of how to use custom logs events in your function:
Deno.serve(async (req) => {
 try {
   const { name } = await req.json()
   if (!name) {
     console.warn('Empty name provided')
   }
   const data = {
     message: `Hello ${name || 'Guest'}!`, // Provide a default value if name is empty
   }
   console.log(`Name: ${name}`)
   return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
 } catch (error) {
   console.error(`Error processing request: ${error}`)
   return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
     status: 500,
     headers: { 'Content-Type': 'application/json' },
   })
 }
})
Logging tips#
Logging request headers#
When debugging Edge Functions, a common mistake is to try to log headers to the developer console via code like this:
Deno.serve(async (req) => {
 const headers = JSON.stringify(req.headers)
 console.log(`Request headers: ${headers}`)
 // OR
 console.log(`Request headers: ${JSON.stringify(req.headers)}`)
 return new Response('ok', {
   headers: {
     'Content-Type': 'application/json',
   },
   status: 200,
 })
})
Both attempts will give as output the string "{}", even though retrieving the value using request.headers.get("Your-Header-Name") will indeed give you the correct value. This behavior mirrors that of browsers.
The reason behind this behavior is that Headers objects don't store headers in JavaScript properties that can be enumerated. As a result, neither the developer console nor the JSON stringifier can properly interpret the names and values of the headers. Essentially, it's not an empty object, but rather an opaque one.
However, Headers objects are iterable. You can utilize this feature to craft a couple of succinct one-liners for debugging and printing headers.
Convert headers into an object with Object.fromEntries:#
You can use Object.fromEntries which is a call to convert the headers into an object:
Deno.serve(async (req) => {
 let headersObject = Object.fromEntries(req.headers)
 let requestHeaders = JSON.stringify(headersObject, null, 2)
 console.log(`Request headers: ${requestHeaders}`)
 return new Response('ok', {
   headers: {
     'Content-Type': 'application/json',
   },
   status: 200,
 })
})
This results in something like:
Request headers: {
   "accept": "*/*",
   "accept-encoding": "gzip",
   "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1cGFuYWNobyIsInJvbGUiOiJhbm9uIiwieW91IjoidmVyeSBzbmVha3ksIGh1aD8iLCJpYXQiOjE2NTQ1NDA5MTYsImV4cCI6MTk3MDExNjkxNn0.cwBbk2tq-fUcKF1S0jVKkOAG2FIQSID7Jjvff5Do99Y",
   "cdn-loop": "cloudflare; subreqs=1",
   "cf-ew-via": "15",
   "cf-ray": "8597a2fcc558a5d7-GRU",
   "cf-visitor": "{\"scheme\":\"https\"}",
   "cf-worker": "supabase.co",
   "content-length": "20",
   "content-type": "application/x-www-form-urlencoded",
   "host": "edge-runtime.supabase.com",
   "my-custom-header": "abcd",
   "user-agent": "curl/8.4.0",
   "x-deno-subhost": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6InN1cGFiYXNlIn0.eyJkZXBsb3ltZW50X2lkIjoic3VwYW5hY2hvX2M1ZGQxMWFiLTFjYmUtNDA3NS1iNDAxLTY3ZTRlZGYxMjVjNV8wMDciLCJycGNfcm9vdCI6Imh0dHBzOi8vc3VwYWJhc2Utb3JpZ2luLmRlbm8uZGV2L3YwLyIsImV4cCI6MTcwODYxMDA4MiwiaWF0IjoxNzA4NjA5MTgyfQ.-fPid2kEeEM42QHxWeMxxv2lJHZRSkPL-EhSH0r_iV4",
   "x-forwarded-host": "edge-runtime.supabase.com",
   "x-forwarded-port": "443",
   "x-forwarded-proto": "https"
}

Troubleshooting Common Issues
How to solve common problems and issues related to Edge Functions.

If you encounter any problems or issues with your Edge Functions, here are some tips and steps to help you resolve them.
Unable to deploy Edge Function#
Make sure you're on the latest version of the Supabase CLI.
If the output from the commands above does not help you to resolve the issue, open a support ticket via the Supabase Dashboard (by clicking the "Help" button at the top right) and include all output from the commands mentioned above.
Unable to call Edge Function#
If you’re unable to call your Edge Function or are experiencing any CORS issues:
Make sure you followed the CORS guide. This guide explains how to enable and configure CORS for your Edge Functions, and how to avoid common pitfalls and errors.
Check your function logs. Navigate to the Functions section in your dashboard, select your function from the list, and click Logs. Check for any errors or warnings that may indicate the cause of the problem.
There are two debugging tools available: Invocations and Logs. Invocations shows the Request and Response for each execution, while Logs shows any platform events, including deployments and errors.
Edge Function takes too long to respond#
If your Edge Function takes too long to respond or times out:
Navigate to the Functions section in your dashboard, select your function from the list, and click Logs.
In the logs, look for the booted event and check if they have consistent boot times.
If the boot times are similar, it’s likely an issue with your function’s code, such as a large dependency, a slow API call, or a complex computation. You can try to optimize your code, reduce the size of your dependencies, or use caching techniques to improve the performance of your function.
If only some of the booted events are slow, find the affected region in the metadata and submit a support request via the "Help" button at the top.
Receiving 546 Error Response#
The 546 error response might occur because:
Memory or CPU Limits: The function might have exhausted its memory or encountered CPU limits enforced during execution.
Event Loop Completion: If you observe "Event loop completed" in your error logs, it's likely your function is not implemented correctly. You should check your function code for any syntax errors, infinite loops, or unresolved promises that might cause this error. Or you can try running the function locally (using Supabase CLI functions serve) to see if you can debug the error. The local console should give a full stack trace on the error with line numbers of the source code. You can also refer to Edge Functions examples for guidance.
Issues serving Edge Functions locally with the Supabase CLI#
Make sure you're on the latest version of the Supabase CLI.
Run the serve command with the -debug flag.
Support engineers can then try to run the provided sample code locally and see if they can reproduce the issue.
Search the Edge Runtime and CLI repos for the error message, to see if it has been reported before.
If the output from the commands above does not help you to resolve the issue, open a support ticket via the Supabase Dashboard (by clicking the "Help" button at the top right) and include all output and details about your commands.
Advanced techniques#
Monitoring Edge Function resource usage#
To determine how much memory and CPU your Edge Function consumes, follow these steps:
Navigate to the Supabase Dashboard.
Go to Edge Functions.
Select the specific function by clicking on its name.
View the resource usage Metrics on the charts provided.
Edge Functions have limited resources (CPU, memory, and execution time) compared to traditional
servers. Make sure your functions are optimized for performance and don't exceed the allocated
resources.
Understanding CPU soft and hard limits#
An isolate is like a worker that can handle multiple requests for a function. It works until a time limit of 400 seconds is reached. Now, there are two types of limits for the CPU.
Soft Limit: When the isolate hits the soft limit, it retires. This means it won't take on any new requests, but it will finish processing the ones it's already working on. It keeps going until it either hits the hard limit for CPU time or reaches the 400-second time limit, whichever comes first.
Hard Limit: If there are new requests after the soft limit is reached, a new isolate is created to handle them. The original isolate continues until it hits the hard limit or the time limit. This ensures that existing requests are completed, and new ones will be managed by a newly created isolate.
Checking function boot time#
Check the logs for the function. In the logs, look for a "Booted" event and note the reported boot time. If available, click on the event to access more details, including the regions from where the function was served. Investigate if the boot time is excessively high (longer than 1 second) and note any patterns or regions where it occurs. You can refer to this guide for troubleshooting regional invocations.
Finding bundle size#
To find the bundle size of a function, run the following command locally:
deno info /path/to/function/index.ts
Look for the "size" field in the output which represents the approximate bundle size of the function. You can find the accurate bundle size when you deploy your function via Supabase CLI. If the function is part of a larger application, consider examining the bundle size of the specific function independently.
The source code of a function is subject to 10MB site limit.
Analyze dependencies#
When analyzing dependencies for your Supabase Edge Functions, it's essential to review both Deno and NPM dependencies to ensure optimal performance and resource utilization.
By selectively importing only the required submodules, you can effectively reduce the size of your function's dependencies and optimize its performance.
Before finalizing your imports, ensure to review both Deno and NPM dependencies, checking for any unnecessary or redundant dependencies that can be removed. Additionally, check for outdated dependencies and update to the latest versions if possible.
Deno dependencies#
Run deno info, providing the path to your input map if you use one.
Review the dependencies listed in the output. Pay attention to any significantly large dependencies, as they can contribute to increased bundle size and potential boot time issues.
Examine if there are any unnecessary or redundant dependencies that can be removed. Check for outdated dependencies and update to the latest versions if possible.
deno info --import-map=/path/to/import_map.json /path/to/function/index.ts
NPM dependencies#
Additionally, if you utilize NPM modules in your Edge Functions, it's crucial to be mindful of their size and impact on the overall bundle size. While importing NPM modules, consider using the notation import { submodule } from 'npm:package/submodule' to selectively import specific submodules rather than importing the entire package. This approach can help minimize unnecessary overhead and streamline the execution of your function.
For example, if you only need the Sheets submodule from the googleapis package, you can import it like this:
import { Sheets } from 'npm:@googleapis/sheets'
Testing your Edge Functions
Writing Unit Tests for Edge Functions using Deno Test

Testing is an essential step in the development process to ensure the correctness and performance of your Edge Functions.
Testing in Deno#
Deno has a built-in test runner that you can use for testing JavaScript or TypeScript code. You can read the official documentation for more information and details about the available testing functions.
Folder structure#
We recommend creating your testing in a supabase/functions/tests directory, using the same name as the Function followed by -test.ts:
└── supabase
   ├── functions
   │   ├── function-one
   │   │   └── index.ts
   │   └── function-two
   │   │   └── index.ts
   │   └── tests
   │       └── function-one-test.ts  # Tests for function-one
   │       └── function-two-test.ts  # Tests for function-two
   └── config.toml
Example script#
The following script is a good example to get started with testing your Edge Functions:
// Import required libraries and modules
import { assert, assertEquals } from 'jsr:@std/assert@1'
import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@2'
// Will load the .env file to Deno.env
import 'jsr:@std/dotenv/load'
// Set up the configuration for the Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
const options = {
 auth: {
   autoRefreshToken: false,
   persistSession: false,
   detectSessionInUrl: false,
 },
}
// Test the creation and functionality of the Supabase client
const testClientCreation = async () => {
 var client: SupabaseClient = createClient(supabaseUrl, supabaseKey, options)
 // Verify if the Supabase URL and key are provided
 if (!supabaseUrl) throw new Error('supabaseUrl is required.')
 if (!supabaseKey) throw new Error('supabaseKey is required.')
 // Test a simple query to the database
 const { data: table_data, error: table_error } = await client
   .from('my_table')
   .select('*')
   .limit(1)
 if (table_error) {
   throw new Error('Invalid Supabase client: ' + table_error.message)
 }
 assert(table_data, 'Data should be returned from the query.')
}
// Test the 'hello-world' function
const testHelloWorld = async () => {
 var client: SupabaseClient = createClient(supabaseUrl, supabaseKey, options)
 // Invoke the 'hello-world' function with a parameter
 const { data: func_data, error: func_error } = await client.functions.invoke('hello-world', {
   body: { name: 'bar' },
 })
 // Check for errors from the function invocation
 if (func_error) {
   throw new Error('Invalid response: ' + func_error.message)
 }
 // Log the response from the function
 console.log(JSON.stringify(func_data, null, 2))
 // Assert that the function returned the expected result
 assertEquals(func_data.message, 'Hello bar!')
}
// Register and run the tests
Deno.test('Client Creation Test', testClientCreation)
Deno.test('Hello-world Function Test', testHelloWorld)
This test case consists of two parts. The first part tests the client library and verifies that the database can be connected to and returns values from a table (my_table). The second part tests the edge function and checks if the received value matches the expected value. Here's a brief overview of the code:
We import various testing functions from the Deno standard library, including assert, assertExists, and assertEquals.
We import the createClient and SupabaseClient classes from the @supabase/supabase-js library to interact with the Supabase client.
We define the necessary configuration for the Supabase client, including the Supabase URL, API key, and authentication options.
The testClientCreation function tests the creation of a Supabase client instance and queries the database for data from a table. It verifies that data is returned from the query.
The testHelloWorld function tests the "Hello-world" Edge Function by invoking it using the Supabase client's functions.invoke method. It checks if the response message matches the expected greeting.
We run the tests using the Deno.test function, providing a descriptive name for each test case and the corresponding test function.
Make sure to replace the placeholders (supabaseUrl, supabaseKey, my_table) with the actual values relevant to your Supabase setup.
Running Edge Functions locally#
To locally test and debug Edge Functions, you can utilize the Supabase CLI. Let's explore how to run Edge Functions locally using the Supabase CLI:
Ensure that the Supabase server is running by executing the following command:
supabase start
In your terminal, use the following command to serve the Edge Functions locally:
supabase functions serve
This command starts a local server that runs your Edge Functions, enabling you to test and debug them in a development environment.
Create the environment variables file:
# creates the file
touch .env
# adds the SUPABASE_URL secret
echo "SUPABASE_URL=http://localhost:54321" >> .env
# adds the SUPABASE_ANON_KEY secret
echo "SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" >> .env
# Alternatively, you can open it in your editor:
open .env
To run the tests, use the following command in your terminal:
deno test --allow-all supabase/functions/tests/function-one-test.ts
Resources#
Full guide on Testing Supabase Edge Functions on Mansueli's tips


Testing Supabase Edge Functions with Deno Test


Rodrigo Mansueli
·
Jul 11, 2023
Table of contents
Setting up Supabase and PostgreSQL
Overview of Supabase Edge Functions
Understanding the hello-world Edge Function with CORS
Testing Supabase Edge Functions
Running Edge Functions Locally
Conclusion
Backend development requires robust and reliable tools in today's rapidly evolving technology landscape. While Firebase has been a go-to choice for many developers, there is now an open-source alternative called Supabase that offers a PostgreSQL-based backend. Supabase combines the robustness of PostgreSQL with the ease of use and scalability of Firebase, providing a compelling solution for backend development.
One crucial aspect of utilizing Supabase is testing its Edge Functions, which play a vital role in extending the functionality of your application while ensuring its reliability. In this blog post, we will explore the process of setting up Supabase, delve into the world of Supabase Edge Functions, and learn how to write and test a simple hello-world function and run Edge Functions locally for efficient development. I previously wrote about testing Supabase-JS in your terminal which can also help to build a foundation.
Setting up Supabase and PostgreSQL
To get started with Supabase, we must first install and set it up using the Command Line Interface (CLI). The CLI offers a convenient way to initialize and manage Supabase projects effortlessly. Let's walk through the steps to install Supabase CLI and set up a Supabase project:
Install Docker: Supabase relies on Docker for local development. Install Docker by following the instructions on the official Docker website.
Install Supabase CLI: Open your terminal and run the following command to install the Supabase CLI:
Copy
Copy
npm install -g supabase


Initialize a Supabase project: In your terminal, navigate to the desired directory and run the following command to initialize a new Supabase project:
Copy
Copy
supabase init
This command sets up a new Supabase project and creates the necessary configuration files.
Start the Supabase server: Once the initialization is complete, start the Supabase server using the following command:
Copy
Copy
supabase start
This command starts the Supabase server locally on your machine, allowing you to interact with the Supabase backend.
PostgreSQL as the underlying database: Supabase leverages PostgreSQL as its underlying database. This powerful and reliable database management system ensures the stability and scalability of your backend. You can interact with PostgreSQL using Supabase's intuitive APIs and tools.
Overview of Supabase Edge Functions
Supabase Edge Functions are an integral part of the Supabase ecosystem, empowering developers to extend the functionality of their applications with serverless computing. These functions run at the edge of the Supabase infrastructure, ensuring optimal performance and reduced latency. Let's explore the advantages of using Supabase Edge Functions:
Serverless computing: Supabase Edge Functions provide a serverless architecture, allowing you to focus on writing code without the need to manage server infrastructure. This results in reduced operational overhead and improved scalability.
TypeScript support: Edge Functions can be written in TypeScript, a statically-typed superset of JavaScript. TypeScript brings type safety to your code, enabling early detection of potential errors and improving overall code quality.
Seamless integration with Supabase client: Edge Functions seamlessly integrates with the Supabase client, enabling easy communication with your Supabase backend. This integration allows you to leverage the full power of Supabase's APIs and functionalities within your Edge Functions.
Understanding the hello-world Edge Function with CORS
Now, let's dive into the details of the "Hello-world" Edge Function written in TypeScript and explore its functionality along with Cross-Origin Resource Sharing (CORS) implementation. We'll break down the code step by step, providing a clear understanding of each section and its interaction with the Supabase client.
Here's the code snippet for the hello-world Edge Function:
Copy
Copy
// Import the serve function from the Deno standard library
import {
    serve
} from "https://deno.land/std@0.192.0/http/server.ts"

// Print a greeting message to the console
console.log("Hello from Functions!")

// Define the headers to handle CORS (Cross-Origin Resource Sharing)
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Start the server and define the request handler
serve(async(req) => {
    // If the HTTP method is OPTIONS, return a response with CORS headers
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: corsHeaders
        })
    }
    // Extract the name from the request body
    const {
        name
    } = await req.json()
    // Prepare the response data
    const data = {
        message: `Hello ${name}!`,
    }

    // Return a response with the data and headers
    return new Response(
        JSON.stringify(data), {
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json"
            },
        }
    )
})

In this section, we'll analyze the different aspects and functionalities of the Hello-world Edge Function, providing insights into each segment's purpose and its seamless integration with the Supabase client.
We import the serve function from the Deno standard library to create a server that listens for incoming HTTP requests.
The console.log statement is for logging purposes and will be displayed in the console when the function is executed.
We define the corsHeaders object to handle Cross-Origin Resource Sharing (CORS) headers, allowing requests from any origin and specifying the allowed headers.
The serve function takes an asynchronous callback function as a parameter, which handles the incoming requests.
In the callback function, we check if the request method is OPTIONS. If it is, we return a response with a status of 'ok' and the CORS headers.
If the request method is not OPTIONS, we parse the JSON data from the request body and extract the name field.
We construct a response object with a JSON payload containing a dynamic greeting message using the provided name.
Finally, we return the response object along with the CORS headers.
Now, we need to run the function locally :
Copy
Copy
supabase functions serve

Testing Supabase Edge Functions
Testing is a crucial step in the development process to ensure the correctness and performance of your Edge Functions. Let's discuss the importance of testing and examining the code in the deno-test.ts file, which demonstrates how to test the Supabase client and the hello-world function.
Copy
Copy
// deno-test.ts
// This imported is needed to load the .env file:
import "https://deno.land/x/dotenv/load.ts";
// Import necessary libraries and modules
import {
  assert,
  assertExists,
  assertEquals,
} from "https://deno.land/std@0.192.0/testing/asserts.ts";
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.23.0";
import { delay } from 'https://deno.land/x/delay@v0.2.0/mod.ts';

// Setup the Supabase client configuration
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const options = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
};

// Test the creation and functionality of the Supabase client
const testClientCreation = async () => {
  var client: SupabaseClient = createClient(supabaseUrl, supabaseKey, options);

  // Check if the Supabase URL and key are provided
  if (!supabaseUrl) throw new Error('supabaseUrl is required.')
  if (!supabaseKey) throw new Error('supabaseKey is required.')

  // Test a simple query to the database
  const { data: table_data, error: table_error } = await client.from('my_table').select('*').limit(1);
  if (table_error) {
    throw new Error('Invalid Supabase client: ' + table_error.message);
  }
  assert(table_data, "Data should be returned from the query.");
};

// Test the 'hello-world' function
const testHelloWorld = async () => {
  var client: SupabaseClient = createClient(supabaseUrl, supabaseKey, options);

  // Invoke the 'hello-world' function with a parameter
  const { data: func_data, error: func_error } = await client.functions.invoke('hello-world', {
    body: { name: 'bar' }
  });

  // Check for errors from the function invocation
  if (func_error) {
    throw new Error('Invalid response: ' + func_error.message);
  }

  // Log the response from the function
  console.log(JSON.stringify(func_data, null, 2));

  // Assert that the function returned the expected result
  assertEquals(func_data.message, 'Hello bar!');
};

// Register and run the tests
Deno.test("Client Creation Test", testClientCreation);
Deno.test("Hello-world Function Test", testHelloWorld);

This is a test case with two parts. The first tests the client library and check that the database is connectable and returning values from a table (my_table). The second part is testing the edge function and checks if the value received is expected. Here's a brief overview of the code:
We import various testing functions from the Deno standard library, including assert, assertExists, and assertEquals.
We import the createClient and SupabaseClient classes from the @supabase/supabase-js library to interact with the Supabase client.
We define the necessary configuration for the Supabase client, including the Supabase URL, API key, and authentication options.
The testClientCreation function tests the creation of a Supabase client instance and queries the database for data from a table. It asserts that data is returned from the query.
The testHelloWorld function tests the "Hello-world" Edge Function by invoking it using the Supabase client's functions.invoke method. It checks if the response message matches the expected greeting.
We run the tests using the Deno.test function, providing a descriptive name for each test case and the corresponding test function.
Note: Please make sure to replace the placeholders (supabaseUrl, supabaseKey, my_table) with the actual values relevant to your Supabase setup.
Running Edge Functions Locally
To test and debug Edge Functions locally, you can utilize the Supabase CLI. Let's explore how to run Edge Functions locally using the Supabase CLI:
Ensure that the Supabase server is running by executing the following command:
Copy
Copy
supabase start


In your terminal, use the following command to serve the Edge Functions locally:
Copy
Copy
supabase functions serve
This command starts a local server that runs your Edge Functions, allowing you to test and debug them in a development environment.
Create the environment variables file:
Copy
Copy
# creates the file
 touch .env.local
 # adds the SUPABASE_URL secret
 echo "SUPABASE_URL=http://localhost:54321" >> .env.local
 # adds the SUPABASE_ANON_KEY secret
 echo "SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" >> .env.local
 #Alternatively, you can open in your editor:
 open .env.local


To run the tests, use the following command in your terminal:
Copy
Copy
#Place the .env file in the same directory as deno-test.ts
 deno test --allow-all deno-test.ts
Here's an example of what this would look like:

Conclusion
In this blog post, we covered the process of setting up Supabase and PostgreSQL for backend development. We explored the concept of Supabase Edge Functions and their advantages in extending the functionality of your application. We also walked through the process of writing a simple "Hello-world" function and discussed the importance of testing Supabase Edge Functions for ensuring their correctness and performance. Lastly, we learned how to run Edge Functions locally using the Supabase CLI. By incorporating Supabase and PostgreSQL into your backend stack and thoroughly testing your Edge Functions, you can maintain the reliability and functionality of your application.
To learn more about Supabase and its features, consult the official Supabase documentation. For information on Deno and its testing framework, refer to the Deno documentation. Additionally, you can explore the Supabase GitHub repository.
Monitoring with Sentry

Add the Sentry Deno SDK to your Supabase Edge Functions to track exceptions and get notified of errors or performance issues.
Prerequisites#
Create a Sentry account.
Make sure you have the latest version of the Supabase CLI installed.
1. Create Supabase function#
Create a new function locally:
supabase functions new sentryfied
2. Add the Sentry Deno SDK#
Handle exceptions within your function and send them to Sentry.
import * as Sentry from 'https://deno.land/x/sentry/index.mjs'
Sentry.init({
 // https://docs.sentry.io/product/sentry-basics/concepts/dsn-explainer/#where-to-find-your-dsn
 dsn: SENTRY_DSN,
 defaultIntegrations: false,
 // Performance Monitoring
 tracesSampleRate: 1.0,
 // Set sampling rate for profiling - this is relative to tracesSampleRate
 profilesSampleRate: 1.0,
})
// Set region and execution_id as custom tags
Sentry.setTag('region', Deno.env.get('SB_REGION'))
Sentry.setTag('execution_id', Deno.env.get('SB_EXECUTION_ID'))
Deno.serve(async (req) => {
 try {
   const { name } = await req.json()
   // This will throw, as `name` in our example call will be `undefined`
   const data = {
     message: `Hello ${name}!`,
   }
   return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
 } catch (e) {
   Sentry.captureException(e)
   // Flush Sentry before the running process closes
   await Sentry.flush(2000)
   return new Response(JSON.stringify({ msg: 'error' }), {
     status: 500,
     headers: { 'Content-Type': 'application/json' },
   })
 }
})
3. Deploy and test#
Run function locally:
supabase start
supabase functions serve --no-verify-jwt
Test it: http://localhost:54321/functions/v1/sentryfied
Deploy function to Supabase:
supabase functions deploy sentryfied --no-verify-jwt
4. Try it yourself#
Find the complete example on GitHub.
Working with scopes#
Sentry Deno SDK currently do not support Deno.serve instrumentation, which means that there is no scope separation between requests. Because of that, when the Edge Functions runtime is reused between multiple requests, all globally captured breadcrumbs and contextual data will be shared, which is not the desired behavior. To work around this, all default integrations in the example code above are disabled, and you should be relying on withScope to encapsulate all Sentry SDK API calls, or pass context directly to the captureException or captureMessage calls.
Regional Invocations
How to execute an Edge Function in a particular region.

Edge Functions are executed in the region closest to the user making the request. This helps to reduce network latency and provide faster responses to the user.
However, if your Function performs lots of database or storage operations, invoking the Function in the same region as your database may provide better performance. Some situations where this might be helpful include:
Bulk adding and editing records in your database
Uploading files
Supabase provides an option to specify the region when invoking the Function.
Using the x-region header#
Use the x-region HTTP header when calling an Edge Function to determine where the Function should be executed:
cURL
JavaScript
# https://supabase.com/docs/guides/functions/deploy#invoking-remote-functions
curl --request POST 'https://<project_ref>.supabase.co/functions/v1/hello-world' \
 --header 'Authorization: Bearer ANON_KEY' \
 --header 'Content-Type: application/json' \
 --header 'x-region: eu-west-3' \
 --data '{ "name":"Functions" }'
You can verify the execution region by looking at the x-sb-edge-region HTTP header in the response. You can also find it as metadata in Edge Function Logs.
Available regions#
These are the currently supported region values you can provide for x-region header.
ap-northeast-1
ap-northeast-2
ap-south-1
ap-southeast-1
ap-southeast-2
ca-central-1
eu-central-1
eu-west-1
eu-west-2
eu-west-3
sa-east-1
us-east-1
us-west-1
us-west-2
Using the client library#
You can also specify the region when invoking a Function using the Supabase client library:
import { createClient, FunctionRegion } from '@supabase/supabase-js'
const supabase = createClient('SUPABASE_URL', 'SUPABASE_ANON_KEY')
const { data: ret, error } = await supabase.functions.invoke('my-function-name', {
 headers: { 'Content-Type': 'application/json' },
 method: 'GET',
 body: {},
 region: FunctionRegion.UsEast1,
})
Handling regional outages#
If you explicitly specify the region via x-region header, requests will NOT be automatically re-routed to another region and you should consider temporarily changing regions during the outage.
Status codes
Edge Functions can return following status codes.

2XX Success#
A successful Edge Function Response
3XX Redirect#
The Edge Function has responded with a Response.redirect API docs
4XX Client Errors#
401 Unauthorized#
If the Edge Function has Verify JWT option enabled, but the request was made with an invalid JWT.
404 Not Found#
Requested Edge Function was not found.
405 Method Not Allowed#
Edge Functions only support these HTTP methods: 'POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'
5XX Server Errors#
500 Internal Server Error#
Edge Function threw an uncaught exception (WORKER_ERROR). Check Edge Function logs to find the cause.
503 Service Unavailable#
Edge Function failed to start (BOOT_ERROR). Check Edge Function logs to find the cause.
504 Gateway Timeout#
Edge Function didn't respond before the request idle timeout.
546 Resource Limit (Custom Error Code)#
Edge Function execution was stopped due to a resource limit (WORKER_LIMIT). Edge Function logs should provide which resource limit was exceeded.

Limits
Limits applied Edge Functions in Supabase's hosted platform.

Runtime limits#
Maximum Memory: 256MB
Maximum Duration (Wall clock limit): This is the duration an Edge Function worker will stay active. During this period, a worker can serve multiple requests or process background tasks.
Free plan: 150s
Paid plans: 400s
Maximum CPU Time: 2s (Amount of actual time spent on the CPU per request - does not include async I/O.)
Request idle timeout: 150s (If an Edge Function doesn't send a response before the timeout, 504 Gateway Timeout will be returned)
Platform limits#
Maximum Function Size: 20MB (After bundling using CLI)
Maximum no. of Functions per project:
Free: 100
Pro: 500
Team: 1000
Enterprise: Unlimited
Maximum log message length: 10,000 characters
Log event threshold: 100 events per 10 seconds
Other limits & restrictions#
Outgoing connections to ports 25 and 587 are not allowed.
Serving of HTML content is only supported with custom domains (Otherwise GET requests that return text/html will be rewritten to text/plain).
Web Worker API (or Node vm API) are not available.
Node Libraries that require multithreading are not supported. Examples: libvips, sharp.


Pricing

$2 per 1 million invocations. You are only charged for usage exceeding your subscription
plan's quota.
Plan
Quota
Over-Usage
Free
500,000
-
Pro
2 million
$2 per 1 million invocations
Team
2 million
$2 per 1 million invocations
Enterprise
Custom
Custom

For a detailed explanation of how charges are calculated, refer to Manage Edge Function Invocations usage.

Custom Auth Emails with React Email and Resend

Use the send email hook to send custom auth emails with React Email and Resend in Supabase Edge Functions.
Prefer to jump straight to the code? Check out the example on GitHub.
Prerequisites#
To get the most out of this guide, you’ll need to:
Create a Resend API key
Verify your domain
Make sure you have the latest version of the Supabase CLI installed.
1. Create Supabase function#
Create a new function locally:
supabase functions new send-email
2. Edit the handler function#
Paste the following code into the index.ts file:
import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { MagicLinkEmail } from './_templates/magic-link.tsx'
const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string
Deno.serve(async (req) => {
 if (req.method !== 'POST') {
   return new Response('not allowed', { status: 400 })
 }
 const payload = await req.text()
 const headers = Object.fromEntries(req.headers)
 const wh = new Webhook(hookSecret)
 try {
   const {
     user,
     email_data: { token, token_hash, redirect_to, email_action_type },
   } = wh.verify(payload, headers) as {
     user: {
       email: string
     }
     email_data: {
       token: string
       token_hash: string
       redirect_to: string
       email_action_type: string
       site_url: string
       token_new: string
       token_hash_new: string
     }
   }
   const html = await renderAsync(
     React.createElement(MagicLinkEmail, {
       supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
       token,
       token_hash,
       redirect_to,
       email_action_type,
     })
   )
   const { error } = await resend.emails.send({
     from: 'welcome <onboarding@resend.dev>',
     to: [user.email],
     subject: 'Supa Custom MagicLink!',
     html,
   })
   if (error) {
     throw error
   }
 } catch (error) {
   console.log(error)
   return new Response(
     JSON.stringify({
       error: {
         http_code: error.code,
         message: error.message,
       },
     }),
     {
       status: 401,
       headers: { 'Content-Type': 'application/json' },
     }
   )
 }
 const responseHeaders = new Headers()
 responseHeaders.set('Content-Type', 'application/json')
 return new Response(JSON.stringify({}), {
   status: 200,
   headers: responseHeaders,
 })
})
3. Create React Email templates#
Create a new folder _templates and create a new file magic-link.tsx with the following code:
import {
 Body,
 Container,
 Head,
 Heading,
 Html,
 Link,
 Preview,
 Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'
interface MagicLinkEmailProps {
 supabase_url: string
 email_action_type: string
 redirect_to: string
 token_hash: string
 token: string
}
export const MagicLinkEmail = ({
 token,
 supabase_url,
 email_action_type,
 redirect_to,
 token_hash,
}: MagicLinkEmailProps) => (
 <Html>
   <Head />
   <Preview>Log in with this magic link</Preview>
   <Body style={main}>
     <Container style={container}>
       <Heading style={h1}>Login</Heading>
       <Link
         href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
         target="_blank"
         style={{
           ...link,
           display: 'block',
           marginBottom: '16px',
         }}
       >
         Click here to log in with this magic link
       </Link>
       <Text style={{ ...text, marginBottom: '14px' }}>
         Or, copy and paste this temporary login code:
       </Text>
       <code style={code}>{token}</code>
       <Text
         style={{
           ...text,
           color: '#ababab',
           marginTop: '14px',
           marginBottom: '16px',
         }}
       >
         If you didn&apos;t try to login, you can safely ignore this email.
       </Text>
       <Text style={footer}>
         <Link
           href="https://demo.vercel.store/"
           target="_blank"
           style={{ ...link, color: '#898989' }}
         >
           ACME Corp
         </Link>
         , the famouse demo corp.
       </Text>
     </Container>
   </Body>
 </Html>
)
export default MagicLinkEmail
const main = {
 backgroundColor: '#ffffff',
}
const container = {
 paddingLeft: '12px',
 paddingRight: '12px',
 margin: '0 auto',
}
const h1 = {
 color: '#333',
 fontFamily:
   "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
 fontSize: '24px',
 fontWeight: 'bold',
 margin: '40px 0',
 padding: '0',
}
const link = {
 color: '#2754C5',
 fontFamily:
   "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
 fontSize: '14px',
 textDecoration: 'underline',
}
const text = {
 color: '#333',
 fontFamily:
   "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
 fontSize: '14px',
 margin: '24px 0',
}
const footer = {
 color: '#898989',
 fontFamily:
   "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
 fontSize: '12px',
 lineHeight: '22px',
 marginTop: '12px',
 marginBottom: '24px',
}
const code = {
 display: 'inline-block',
 padding: '16px 4.5%',
 width: '90.5%',
 backgroundColor: '#f4f4f4',
 borderRadius: '5px',
 border: '1px solid #eee',
 color: '#333',
}
You can find a selection of React Email templates in the React Email Examples.
4. Deploy the Function#
Deploy function to Supabase:
supabase functions deploy send-email --no-verify-jwt
Note down the function URL, you will need it in the next step!
5. Configure the Send Email Hook#
Go to the Auth Hooks section of the Supabase dashboard and create a new "Send Email hook".
Select HTTPS as the hook type.
Paste the function URL in the "URL" field.
Click "Generate Secret" to generate your webhook secret and note it down.
Click "Create" to save the hook configuration.
Store these secrets in your .env file.
RESEND_API_KEY=your_resend_api_key
SEND_EMAIL_HOOK_SECRET=<base64_secret>
You can generate the secret in the Auth Hooks section of the Supabase dashboard. Make sure to remove the v1,whsec_ prefix!
Set the secrets from the .env file:
supabase secrets set --env-file supabase/functions/.env
Now your Supabase Edge Function will be triggered anytime an Auth Email needs to be sent to the user!
CORS (Cross-Origin Resource Sharing) support for Invoking from the browser

To invoke edge functions from the browser, you need to handle CORS Preflight requests.
See the example on GitHub.
Recommended setup#
We recommend adding a cors.ts file within a _shared folder which makes it easy to reuse the CORS headers across functions:
export const corsHeaders = {
 'Access-Control-Allow-Origin': '*',
 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
You can then import and use the CORS headers within your functions:
import { corsHeaders } from '../_shared/cors.ts'
console.log(`Function "browser-with-cors" up and running!`)
Deno.serve(async (req) => {
 // This is needed if you're planning to invoke your function from a browser.
 if (req.method === 'OPTIONS') {
   return new Response('ok', { headers: corsHeaders })
 }
 try {
   const { name } = await req.json()
   const data = {
     message: `Hello ${name}!`,
   }
   return new Response(JSON.stringify(data), {
     headers: { ...corsHeaders, 'Content-Type': 'application/json' },
     status: 200,
   })
 } catch (error) {
   return new Response(JSON.stringify({ error: error.message }), {
     headers: { ...corsHeaders, 'Content-Type': 'application/json' },
     status: 400,
   })
 }
})

Scheduling Edge Functions

The hosted Supabase Platform supports the pg_cron extension, a recurring job scheduler in Postgres.
In combination with the pg_net extension, this allows us to invoke Edge Functions periodically on a set schedule.
To access the auth token securely for your Edge Function call, we recommend storing them in Supabase Vault.
Examples#
Invoke an Edge Function every minute#
Store project_url and anon_key in Supabase Vault:
select vault.create_secret('https://project-ref.supabase.co', 'project_url');
select vault.create_secret('YOUR_SUPABASE_ANON_KEY', 'anon_key');
Make a POST request to a Supabase Edge Function every minute:
select
 cron.schedule(
   'invoke-function-every-minute',
   '* * * * *', -- every minute
   $$
   select
     net.http_post(
         url:= (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/function-name',
         headers:=jsonb_build_object(
           'Content-type', 'application/json',
           'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'anon_key')
         ),
         body:=concat('{"time": "', now(), '"}')::jsonb
     ) as request_id;
   $$
 );
Resources#
pg_net extension
pg_cron extension
Sending Push Notifications

Push notifications are an important part of any mobile app. They allow you to send notifications to your users even when they are not using your app. This guide will show you how to send push notifications to different mobile app frameworks from your Supabase edge functions.
Expo Push Notifications
Firebase Cloud Messaging
Expo makes implementing push notifications easy. All the hassle with device information and communicating with Firebase Cloud Messaging (FCM) or Apple Push Notification Service (APNs) is done behind the scenes. This allows you to treat Android and iOS notifications in the same way and save time both on the frontend and backend.
Find the example code on GitHub.
Supabase setup#
Create a new Supabase project.
Link your project: supabase link --project-ref your-supabase-project-ref
Start Supabase locally: supabase start
Push up the schema: supabase db push (schema is defined in supabase/migrations)
Expo setup#
To utilize Expo's push notification service, you must configure your app by installing a set of libraries, implementing functions to handle notifications, and setting up credentials for Android and iOS. Follow the official Expo Push Notifications Setup Guide to get the credentials for Android and iOS. This project uses Expo's EAS build service to simplify this part.
Install the dependencies: npm i
Create a new Expo project
Link this app to your project: npm install --global eas-cli && eas init --id your-expo-project-id
Create a build for your physical device
Start the development server for your project: npx expo start --dev-client
Scan the QR code shown in the terminal with your physical device.
Sign up/in to create a user in Supabase Auth.
Enhanced security for push notifications#
Navigate to your Expo Access Token Settings.
Create a new token for usage in Supabase Edge Functions.
Toggle on "Enhanced Security for Push Notifications".
Create the local .env file: cp .env.local.example .env.local
In the newly created .env.local file, set your EXPO_ACCESS_TOKEN value.
Deploy the Supabase Edge Function#
The database webhook handler to send push notifications is located in supabase/functions/push/index.ts. Deploy the function to your linked project and set the EXPO_ACCESS_TOKEN secret.
supabase functions deploy push
supabase secrets set --env-file .env.local
import { createClient } from 'npm:@supabase/supabase-js@2'
console.log('Hello from Functions!')
interface Notification {
 id: string
 user_id: string
 body: string
}
interface WebhookPayload {
 type: 'INSERT' | 'UPDATE' | 'DELETE'
 table: string
 record: Notification
 schema: 'public'
 old_record: null | Notification
}
const supabase = createClient(
 Deno.env.get('SUPABASE_URL')!,
 Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)
Deno.serve(async (req) => {
 const payload: WebhookPayload = await req.json()
 const { data } = await supabase
   .from('profiles')
   .select('expo_push_token')
   .eq('id', payload.record.user_id)
   .single()
 const res = await fetch('https://exp.host/--/api/v2/push/send', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json',
     Authorization: `Bearer ${Deno.env.get('EXPO_ACCESS_TOKEN')}`,
   },
   body: JSON.stringify({
     to: data?.expo_push_token,
     sound: 'default',
     body: payload.record.body,
   }),
 }).then((res) => res.json())
 return new Response(JSON.stringify(res), {
   headers: { 'Content-Type': 'application/json' },
 })
})
Create the database webhook#
Navigate to the Database Webhooks settings in your Supabase Dashboard.
Enable and create a new hook.
Conditions to fire webhook: Select the notifications table and tick the Insert event.
Webhook configuration: Supabase Edge Functions.
Edge Function: Select the push edge function and leave the method as POST and timeout as 1000.
HTTP Headers: Click "Add new header" > "Add auth header with service key" and leave Content-type: application/json.
Click "Create webhook".
Send push notification#
Navigate to the table editor in your Supabase Dashboard.
In your notifications table, insert a new row.
Watch the magic happen 🪄
Semantic Search
Semantic Search with pgvector and Supabase Edge Functions

Semantic search interprets the meaning behind user queries rather than exact keywords. It uses machine learning to capture the intent and context behind the query, handling language nuances like synonyms, phrasing variations, and word relationships.
Since Supabase Edge Runtime v1.36.0 you can run the gte-small model natively within Supabase Edge Functions without any external dependencies! This allows you to generate text embeddings without calling any external APIs!
In this tutorial you're implementing three parts:
A generate-embedding database webhook edge function which generates embeddings when a content row is added (or updated) in the public.embeddings table.
A query_embeddings Postgres function which allows us to perform similarity search from an Edge Function via Remote Procedure Call (RPC).
A search edge function which generates the embedding for the search term, performs the similarity search via RPC function call, and returns the result.
You can find the complete example code on GitHub
Create the database table and webhook#
Given the following table definition:
create extension if not exists vector with schema extensions;
create table embeddings (
 id bigint primary key generated always as identity,
 content text not null,
 embedding vector (384)
);
alter table embeddings enable row level security;
create index on embeddings using hnsw (embedding vector_ip_ops);
You can deploy the following edge function as a database webhook to generate the embeddings for any text content inserted into the table:
const model = new Supabase.ai.Session('gte-small')
Deno.serve(async (req) => {
 const payload: WebhookPayload = await req.json()
 const { content, id } = payload.record
 // Generate embedding.
 const embedding = await model.run(content, {
   mean_pool: true,
   normalize: true,
 })
 // Store in database.
 const { error } = await supabase
   .from('embeddings')
   .update({ embedding: JSON.stringify(embedding) })
   .eq('id', id)
 if (error) console.warn(error.message)
 return new Response('ok')
})
Create a Database Function and RPC#
With the embeddings now stored in your Postgres database table, you can query them from Supabase Edge Functions by utilizing Remote Procedure Calls (RPC).
Given the following Postgres Function:
-- Matches document sections using vector similarity search on embeddings
--
-- Returns a setof embeddings so that we can use PostgREST resource embeddings (joins with other tables)
-- Additional filtering like limits can be chained to this function call
create or replace function query_embeddings(embedding vector(384), match_threshold float)
returns setof embeddings
language plpgsql
as $$
begin
 return query
 select *
 from embeddings
 -- The inner product is negative, so we negate match_threshold
 where embeddings.embedding <#> embedding < -match_threshold
 -- Our embeddings are normalized to length 1, so cosine similarity
 -- and inner product will produce the same query results.
 -- Using inner product which can be computed faster.
 --
 -- For the different distance functions, see https://github.com/pgvector/pgvector
 order by embeddings.embedding <#> embedding;
end;
$$;
Query vectors in Supabase Edge Functions#
You can use supabase-js to first generate the embedding for the search term and then invoke the Postgres function to find the relevant results from your stored embeddings, right from your Supabase Edge Function:
const model = new Supabase.ai.Session('gte-small')
Deno.serve(async (req) => {
 const { search } = await req.json()
 if (!search) return new Response('Please provide a search param!')
 // Generate embedding for search term.
 const embedding = await model.run(search, {
   mean_pool: true,
   normalize: true,
 })
 // Query embeddings.
 const { data: result, error } = await supabase
   .rpc('query_embeddings', {
     embedding,
     match_threshold: 0.8,
   })
   .select('content')
   .limit(3)
 if (error) {
   return Response.json(error)
 }
 return Response.json({ search, result })
})
You now have AI powered semantic search set up without any external dependencies! Just you, pgvector, and Supabase Edge Functions!
CAPTCHA support with Cloudflare Turnstile

Cloudflare Turnstile is a friendly, free CAPTCHA replacement, and it works seamlessly with Supabase Edge Functions to protect your forms. View on GitHub.
Setup#
Follow these steps to set up a new site: https://developers.cloudflare.com/turnstile/get-started/
Add the Cloudflare Turnstile widget to your site: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
Code#
Create a new function in your project:
supabase functions new cloudflare-turnstile
And add the code to the index.ts file:
import { corsHeaders } from '../_shared/cors.ts'
console.log('Hello from Cloudflare Trunstile!')
function ips(req: Request) {
 return req.headers.get('x-forwarded-for')?.split(/\s*,\s*/)
}
Deno.serve(async (req) => {
 // This is needed if you're planning to invoke your function from a browser.
 if (req.method === 'OPTIONS') {
   return new Response('ok', { headers: corsHeaders })
 }
 const { token } = await req.json()
 const clientIps = ips(req) || ['']
 const ip = clientIps[0]
 // Validate the token by calling the
 // "/siteverify" API endpoint.
 let formData = new FormData()
 formData.append('secret', Deno.env.get('CLOUDFLARE_SECRET_KEY') ?? '')
 formData.append('response', token)
 formData.append('remoteip', ip)
 const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
 const result = await fetch(url, {
   body: formData,
   method: 'POST',
 })
 const outcome = await result.json()
 console.log(outcome)
 if (outcome.success) {
   return new Response('success', { headers: corsHeaders })
 }
 return new Response('failure', { headers: corsHeaders })
})
Deploy the server-side validation Edge Functions#
https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
supabase functions deploy cloudflare-turnstile
supabase secrets set CLOUDFLARE_SECRET_KEY=your_secret_key
Invoke the function from your site#
const { data, error } = await supabase.functions.invoke('cloudflare-turnstile', {
 body: { token },
})

Rate Limiting Edge Functions

Redis is an open source (BSD licensed), in-memory data structure store used as a database, cache, message broker, and streaming engine. It is optimized for atomic operations like incrementing a value, for example for a view counter or rate limiting. We can even rate limit based on the user ID from Supabase Auth!
Upstash provides an HTTP/REST based Redis client which is ideal for serverless use-cases and therefore works well with Supabase Edge Functions.
Find the code on GitHub.


