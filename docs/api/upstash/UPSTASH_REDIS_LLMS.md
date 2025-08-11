========================
CODE SNIPPETS
========================
TITLE: Install and Import Upstash Ratelimit
DESCRIPTION: Instructions for installing the `@upstash/ratelimit` package using npm for Node.js projects and importing the `Ratelimit` class for Deno environments.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted.mdx

LANGUAGE: bash
CODE:
```
npm install @upstash/ratelimit
```

LANGUAGE: ts
CODE:
```
import { Ratelimit } from "https://cdn.skypack.dev/@upstash/ratelimit@latest";
```

----------------------------------------

TITLE: Install Upstash Ratelimit Python Package
DESCRIPTION: Instructions to install the `upstash-ratelimit` Python package using pip, which is required to use the library.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-py/gettingstarted.mdx

LANGUAGE: bash
CODE:
```
pip install upstash-ratelimit
```

----------------------------------------

TITLE: Install Upstash Redis Python Client
DESCRIPTION: This snippet demonstrates how to install the `upstash-redis` Python client library using pip, the standard Python package installer. Executing this command in your terminal or command prompt will add the necessary library to your Python environment, making it available for use in your projects.

SOURCE: https://upstash.com/docs/redis/sdks/py/gettingstarted.mdx

LANGUAGE: bash
CODE:
```
pip install upstash-redis
```

----------------------------------------

TITLE: Install Upstash Redis Package
DESCRIPTION: These snippets provide instructions for installing the `@upstash/redis` package using popular Node.js package managers: npm, yarn, and pnpm. Choose the command that matches your project's package manager.

SOURCE: https://upstash.com/docs/redis/sdks/ts/getstarted.mdx

LANGUAGE: bash
CODE:
```
npm install @upstash/redis
```

LANGUAGE: bash
CODE:
```
yarn add @upstash/redis
```

LANGUAGE: bash
CODE:
```
pnpm add @upstash/redis
```

----------------------------------------

TITLE: Install and Initialize Serverless Framework
DESCRIPTION: Instructions for installing the Serverless Framework globally via npm and initializing a new AWS Node.js project, demonstrating the interactive setup process.

SOURCE: https://upstash.com/docs/redis/tutorials/auto_complete_with_serverless_redis.mdx

LANGUAGE: text
CODE:
```
>> serverless

Serverless: No project detected. Do you want to create a new one? Yes
Serverless: What do you want to make? AWS Node.js
Serverless: What do you want to call this project? test-upstash

Project successfully created in 'test-upstash' folder.

You can monitor, troubleshoot, and test your new service with a free Serverless account.

Serverless: Would you like to enable this? No
You can run the “serverless” command again if you change your mind later.
```

----------------------------------------

TITLE: Initialize and Use Upstash Ratelimit with Python
DESCRIPTION: Demonstrates how to initialize the `Ratelimit` class with a `FixedWindow` limiter and an Upstash Redis instance. It shows how to apply a rate limit to an identifier and handle the `allowed` status from the response. This example assumes `upstash-redis` is also installed and configured.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-py/gettingstarted.mdx

LANGUAGE: python
CODE:
```
from upstash_ratelimit import Ratelimit, FixedWindow
from upstash_redis import Redis

# Create a new ratelimiter, that allows 10 requests per 10 seconds
ratelimit = Ratelimit(
    redis=Redis.from_env(),
    limiter=FixedWindow(max_requests=10, window=10),
    # Optional prefix for the keys used in Redis. This is useful
    # if you want to share a Redis instance with other applications
    # and want to avoid key collisions. The default prefix is
    # "@upstash/ratelimit"
    prefix="@upstash/ratelimit",
)

# Use a constant string to limit all requests with a single ratelimit
# Or use a user ID, API key or IP address for individual limits.
identifier = "api"
response = ratelimit.limit(identifier)

if not response.allowed:
    print("Unable to process at this time")
else:
    do_expensive_calculation()
    print("Here you go!")
```

----------------------------------------

TITLE: Perform Basic Redis Operations (Set/Get) with Upstash Client
DESCRIPTION: This example demonstrates how to perform fundamental Redis `set` and `get` operations using both synchronous and asynchronous `upstash-redis` clients. It shows the process of initializing the client, typically from environment variables, and then executing commands. Pay close attention to the use of the `await` keyword for handling asynchronous operations correctly.

SOURCE: https://upstash.com/docs/redis/sdks/py/gettingstarted.mdx

LANGUAGE: python
CODE:
```
from upstash_redis import Redis

redis = Redis.from_env()

def main():
  redis.set("a", "b")
  print(redis.get("a"))

# or for async context:

from upstash_redis.asyncio import Redis

redis = Redis.from_env()

async def main():
  await redis.set("a", "b")
  print(await redis.get("a"))
```

----------------------------------------

TITLE: Connect to Upstash Redis using redis-cli
DESCRIPTION: This snippet demonstrates how to connect to an Upstash Redis database using the `redis-cli` command-line interface. It shows examples of basic Redis commands like `set`, `get`, and `incr` to interact with the database. Users need to replace placeholders like PASSWORD, ENDPOINT, and PORT with their actual database credentials.

SOURCE: https://upstash.com/docs/redis/overall/getstarted.mdx

LANGUAGE: bash
CODE:
```
> redis-cli --tls -a PASSWORD -h ENDPOINT -p PORT
ENDPOINT:PORT> set counter 0
OK
ENDPOINT:PORT> get counter
"0"
ENDPOINT:PORT> incr counter
(int) 1
ENDPOINT:PORT> incr counter
(int) 2
```

----------------------------------------

TITLE: Project Setup: Create SST Next.js Application
DESCRIPTION: Initializes a new SST project using the standard Next.js template, navigates into the newly created project directory, and installs all required Node.js dependencies.

SOURCE: https://upstash.com/docs/redis/quickstarts/sst-v2.mdx

LANGUAGE: shell
CODE:
```
npx create-sst@latest --template standard/nextjs
cd my-sst-app
npm install
```

----------------------------------------

TITLE: Initialize Node.js Project
DESCRIPTION: Initializes a new Node.js project in the current directory, creating a `package.json` file to manage project metadata and dependencies.

SOURCE: https://upstash.com/docs/redis/howto/getstartedawslambda.mdx

LANGUAGE: shell
CODE:
```
npm init
```

----------------------------------------

TITLE: Install ioredis Redis Client
DESCRIPTION: Installs the `ioredis` client library, a high-performance Redis client for Node.js, as a project dependency. This allows the Lambda function to interact with the Upstash Redis database.

SOURCE: https://upstash.com/docs/redis/howto/getstartedawslambda.mdx

LANGUAGE: shell
CODE:
```
npm install ioredis
```

----------------------------------------

TITLE: Python Example for Redis GET
DESCRIPTION: Demonstrates setting a key and then retrieving its value using the `GET` command in Python with the Upstash Redis client. This example verifies that the retrieved value matches the one previously set.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/string/get.mdx

LANGUAGE: py
CODE:
```
redis.set("key", "value")

assert redis.get("key") == "value"
```

----------------------------------------

TITLE: TypeScript Redis BITPOS Usage Examples
DESCRIPTION: Practical TypeScript examples demonstrating how to use the `bitpos` method with the Upstash Redis client. Includes a basic usage example and an example showing how to specify start and end range parameters.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/bitmap/bitpos.mdx

LANGUAGE: typescript
CODE:
```
await redis.bitpos("key", 1);
```

LANGUAGE: typescript
CODE:
```
await redis.bitpos("key", 1, 5, 20);
```

----------------------------------------

TITLE: Project Setup: Install Upstash Redis Package
DESCRIPTION: Installs the official `@upstash/redis` client library, which is necessary for interacting with the Upstash Redis database from your application.

SOURCE: https://upstash.com/docs/redis/quickstarts/sst-v2.mdx

LANGUAGE: shell
CODE:
```
npm install @upstash/redis
```

----------------------------------------

TITLE: Launch Fly.io Application
DESCRIPTION: Initiates the deployment process for a Fly.io application. This command will guide you through initial setup, including organization, app name, region, and resource allocation.

SOURCE: https://upstash.com/docs/redis/quickstarts/elixir.mdx

LANGUAGE: Shell
CODE:
```
fly launch
```

----------------------------------------

TITLE: Getting Started with Next.js Edge Functions
DESCRIPTION: Learn how to use Upstash Redis with Next.js Edge Functions deployed on Vercel. This tutorial covers setting up your environment for edge computing.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: Next.js Edge
CODE:
```
export async function GET(request) {
  return new Response('Hello from Next.js Edge!');
}
```

----------------------------------------

TITLE: Initialize Upstash Redis with Explicit Credentials
DESCRIPTION: This TypeScript example demonstrates how to initialize the Upstash Redis client by directly providing the URL and token, offering an alternative to using environment variables via `Redis.fromEnv()`.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted.mdx

LANGUAGE: ts
CODE:
```
new Redis({
  url: "https://****.upstash.io",
  token: "********",
});
```

----------------------------------------

TITLE: Building a Serverless Notification API with Redis
DESCRIPTION: Guides on building a serverless notification API for web applications using Redis. This example covers creating real-time notification systems with Upstash Redis.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: jsx
CODE:
```
<TagFilters.Item
    externalLink
    type="Article"
    tags={["REST-API", "Backendless"]
    url="https://docs.upstash.com/redis/tutorials/notification">
    Building a Serverless Notification API for Your Web Application with Redis
  </TagFilters.Item>
```

----------------------------------------

TITLE: Set Environment Variables for Local Next.js Project
DESCRIPTION: Instructions for configuring `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in a `.env.local` file for a local Next.js development environment.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted.mdx

LANGUAGE: bash
CODE:
```
UPSTASH_REDIS_REST_URL=****
UPSTASH_REDIS_REST_TOKEN=****
```

----------------------------------------

TITLE: Add Start Script to package.json
DESCRIPTION: This JSON snippet shows how to add a `start` script to the `package.json` file. This script allows the application to be easily started using `npm start`, which executes the `index.js` file with Node.js.

SOURCE: https://upstash.com/docs/redis/tutorials/cloud_run_sessions.mdx

LANGUAGE: json
CODE:
```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index"
  }
```

----------------------------------------

TITLE: Next.js Project Setup and Upstash Redis Installation
DESCRIPTION: Commands to initialize a new Next.js application with the Pages Router and install the necessary `@upstash/redis` package for database interaction.

SOURCE: https://upstash.com/docs/redis/quickstarts/nextjs-pages-router.mdx

LANGUAGE: shell
CODE:
```
npx create-next-app@latest
cd my-app
npm install @upstash/redis
```

----------------------------------------

TITLE: Next.js Project Setup with Upstash Redis
DESCRIPTION: This code block provides the necessary commands to initialize a new Next.js application using the App Router and install the `@upstash/redis` package. These steps are foundational for setting up the project environment before integrating Redis.

SOURCE: https://upstash.com/docs/redis/tutorials/nextjs_with_redis.mdx

LANGUAGE: shell
CODE:
```
npx create-next-app@latest
cd my-app
npm install @upstash/redis
```

----------------------------------------

TITLE: Create Dockerfile for Node.js Application
DESCRIPTION: Provides a multi-stage Dockerfile for building and running a Node.js application, including dependency installation, user setup, and port exposure.

SOURCE: https://upstash.com/docs/redis/quickstarts/koyeb.mdx

LANGUAGE: dockerfile
CODE:
```
FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
COPY --from=deps /app/node_modules ./node_modules
COPY . .
USER node
EXPOSE 3000
ENV PORT 3000
CMD ["npm", "run", "start"]
```

----------------------------------------

TITLE: Import Upstash Redis in Deno
DESCRIPTION: This snippet demonstrates how to import the `@upstash/redis` library directly from deno.land for use in Deno projects.

SOURCE: https://upstash.com/docs/redis/sdks/ts/getstarted.mdx

LANGUAGE: ts
CODE:
```
import { Redis } from "https://deno.land/x/upstash_redis/mod.ts";
```

----------------------------------------

TITLE: Slackbot with AWS Chalice and Upstash Redis
DESCRIPTION: Guides on building a Slackbot using AWS Chalice and Upstash Redis. This example demonstrates creating serverless applications that interact with Slack and Redis.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: jsx
CODE:
```
<TagFilters.Item
    externalLink
    type="Article"
    tags={["AWS Chalice", "Slackbot"]
    url="https://blog.upstash.com/chalice-event-reminder-slackbot">
    Slackbot with AWS Chalice and Upstash Redis
  </TagFilters.Item>
```

----------------------------------------

TITLE: Initialize Upstash Redis Client with Explicit Credentials
DESCRIPTION: This code demonstrates how to initialize both synchronous and asynchronous `upstash-redis` clients by explicitly providing the Redis REST URL and token. These essential credentials must be securely obtained from your Upstash console. This initialization method is suitable when your credentials are known at compile time or are passed directly into your application.

SOURCE: https://upstash.com/docs/redis/sdks/py/gettingstarted.mdx

LANGUAGE: python
CODE:
```
# for sync client
from upstash_redis import Redis

redis = Redis(url="UPSTASH_REDIS_REST_URL", token="UPSTASH_REDIS_REST_TOKEN")

# for async client
from upstash_redis.asyncio import Redis

redis = Redis(url="UPSTASH_REDIS_REST_URL", token="UPSTASH_REDIS_REST_TOKEN")
```

----------------------------------------

TITLE: Basic Usage of Upstash Redis Client
DESCRIPTION: This TypeScript example illustrates how to initialize the Upstash Redis client with your REST URL and token, and then perform various common Redis operations including string manipulation (SET, GET), sorted sets (ZADD, ZRANGE), lists (LPUSH, LRANGE), hashes (HSET, HGET), and sets (SADD, SPOP).

SOURCE: https://upstash.com/docs/redis/sdks/ts/getstarted.mdx

LANGUAGE: ts
CODE:
```
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: <UPSTASH_REDIS_REST_URL>,
  token: <UPSTASH_REDIS_REST_TOKEN>,
})

// string
await redis.set('key', 'value');
let data = await redis.get('key');
console.log(data)

await redis.set('key2', 'value2', {ex: 1});

// sorted set
await redis.zadd('scores', { score: 1, member: 'team1' })
data = await redis.zrange('scores', 0, 100 )
console.log(data)

// list
await redis.lpush('elements', 'magnesium')
data = await redis.lrange('elements', 0, 100 )
console.log(data)

// hash
await redis.hset('people', {name: 'joe'})
data = await redis.hget('people', 'name' )
console.log(data)

// sets
await redis.sadd('animals', 'cat')
data  = await redis.spop('animals', 1)
console.log(data)
```

----------------------------------------

TITLE: Implement Basic Rate Limiting with Upstash Ratelimit
DESCRIPTION: This TypeScript example demonstrates how to initialize `@upstash/ratelimit` with an Upstash Redis instance, configure a sliding window limiter, and apply it to an endpoint to control request rates. It shows how to check for rate limit success and handle blocked requests.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted.mdx

LANGUAGE: ts
CODE:
```
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

// Use a constant string to limit all requests with a single ratelimit
// Or use a userID, apiKey or ip address for individual limits.
const identifier = "api";
const { success } = await ratelimit.limit(identifier);

if (!success) {
  return "Unable to process at this time";
}
doExpensiveCalculation();
return "Here you go!";
```

----------------------------------------

TITLE: Interactive Fly.io Launch Prompt Example
DESCRIPTION: An example of the interactive output from the `fly launch` command, demonstrating the default settings detected and prompting the user to confirm or tweak these settings before proceeding with the deployment.

SOURCE: https://upstash.com/docs/redis/quickstarts/elixir.mdx

LANGUAGE: Shell
CODE:
```
>>> fly launch

Detected a Phoenix app
Creating app in /Users/examples/redix_demo
We're about to launch your Phoenix app on Fly.io. Here's what you're getting:

Organization: C. Arda                (fly launch defaults to the personal org)
Name:         redix_demo             (derived from your directory name)
Region:       Bucharest, Romania     (this is the fastest region for you)
App Machines: shared-cpu-1x, 1GB RAM (most apps need about 1GB of RAM)
Postgres:     <none>                 (not requested)
Redis:        <none>                 (not requested)
Sentry:       false                  (not requested)

? Do you want to tweak these settings before proceeding? (y/N)
```

----------------------------------------

TITLE: Install Node.js Project Dependencies
DESCRIPTION: Command to install all defined Node.js dependencies from `package.json` into the project's `node_modules` directory.

SOURCE: https://upstash.com/docs/redis/tutorials/using_serverless_framework.mdx

LANGUAGE: shell
CODE:
```
npm install
```

----------------------------------------

TITLE: Building React Native Apps Backed by AWS Lambda and Serverless Redis
DESCRIPTION: Guides on building React Native applications powered by AWS Lambda and Upstash Redis. This example focuses on creating serverless mobile backends.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: jsx
CODE:
```
<TagFilters.Item
    externalLink
    type="Article"
    tags={["React Native", "Mobile"]
    url="https://blog.upstash.com/serverless-react-native">
    Building React Native Apps Backed by AWS Lambda and Serverless Redis
  </TagFilters.Item>
```

----------------------------------------

TITLE: Using Serverless Redis with Next.js
DESCRIPTION: This video tutorial guides viewers on how to integrate and utilize Serverless Redis within a Next.js application.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: javascript
CODE:
```
// Example usage within a Next.js API route or component
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

async function getData() {
  const data = await redis.get('mykey');
  return data;
}
```

----------------------------------------

TITLE: Initialize Node.js Project and Install ioredis
DESCRIPTION: Commands to initialize a new Node.js project using 'npm init' and install the 'ioredis' client library, which is used for interacting with Redis.

SOURCE: https://upstash.com/docs/redis/tutorials/auto_complete_with_serverless_redis.mdx

LANGUAGE: text
CODE:
```
npm init

npm install ioredis
```

----------------------------------------

TITLE: Next.js Project Setup with Upstash Redis
DESCRIPTION: Initializes a new Next.js application using `create-next-app` and installs the `@upstash/redis` package, preparing the project for Redis integration.

SOURCE: https://upstash.com/docs/redis/quickstarts/vercel-functions-pages-router.mdx

LANGUAGE: shell
CODE:
```
npx create-next-app@latest
cd my-app
npm install @upstash/redis
```

----------------------------------------

TITLE: Create and navigate to application directory
DESCRIPTION: These bash commands create a new directory for the demo application and then change the current working directory into it, preparing the environment for project setup.

SOURCE: https://upstash.com/docs/redis/quickstarts/koyeb.mdx

LANGUAGE: bash
CODE:
```
mkdir example-koyeb-upstash
cd example-koyeb-upstash
```

----------------------------------------

TITLE: AWS SAM Project Initialization
DESCRIPTION: Initializes a new AWS Serverless Application Model (SAM) project. This command starts an interactive process to select a quick start template, Go 1.x runtime, and define the project name, setting up the basic directory structure.

SOURCE: https://upstash.com/docs/redis/tutorials/goapi.mdx

LANGUAGE: Shell
CODE:
```
sam init
```

----------------------------------------

TITLE: Add Development and Start Scripts to package.json
DESCRIPTION: This diff snippet shows how to modify the `package.json` file to include `dev` and `start` scripts. The `dev` script runs the application in debug mode, while the `start` script starts it normally, facilitating local development and production deployment.

SOURCE: https://upstash.com/docs/redis/quickstarts/koyeb.mdx

LANGUAGE: diff
CODE:
```
{
  "name": "example-koyeb-upstash",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
+   "dev": "DEBUG=express:* node index.js",
+   "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@upstash/redis": "^1.20.6",
    "express": "^4.18.2"
  }
}
```

----------------------------------------

TITLE: Install Serverless Framework Globally
DESCRIPTION: This command installs the Serverless Framework CLI globally using npm, specifying version 3.39.0. It's a prerequisite for deploying serverless applications.

SOURCE: https://upstash.com/docs/redis/tutorials/serverless_java_redis.mdx

LANGUAGE: shell
CODE:
```
npm i serverless@3.39.0 -g
```

----------------------------------------

TITLE: Initialize Serverless Node.js Project
DESCRIPTION: Command-line interaction to initialize a new Serverless project for AWS Node.js, creating a project folder named 'histogram-api'. This step guides the user through the initial setup questions for the Serverless Framework.

SOURCE: https://upstash.com/docs/redis/tutorials/histogram.mdx

LANGUAGE: text
CODE:
```
>> serverless

Serverless: No project detected. Do you want to create a new one? Yes
Serverless: What do you want to make? AWS Node.js
Serverless: What do you want to call this project? histogram-api

Project successfully created in 'histogram-api' folder.

You can monitor, troubleshoot, and test your new service with a free Serverless account.

Serverless: Would you like to enable this? No
You can run the “serverless” command again if you change your mind later.
```

----------------------------------------

TITLE: Initialize Next.js Project and Install Redis Client
DESCRIPTION: These commands set up a new Next.js application and install 'ioredis', a popular Redis client library, which is necessary for interacting with the Redis database from the Next.js application.

SOURCE: https://upstash.com/docs/redis/tutorials/roadmapvotingapp.mdx

LANGUAGE: Shell
CODE:
```
npx create-next-app nextjs-with-redis
```

LANGUAGE: Shell
CODE:
```
npm install ioredis
```

----------------------------------------

TITLE: TypeScript Examples for Upstash Redis BITCOUNT
DESCRIPTION: Practical TypeScript examples demonstrating how to use the `redis.bitcount` method. The first example shows basic usage to count bits in an entire key, while the second illustrates how to specify a `start` and `end` byte range for the operation.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/bitmap/bitcount.mdx

LANGUAGE: ts
CODE:
```
const bits = await redis.bitcount(key);
```

LANGUAGE: ts
CODE:
```
const bits = await redis.bitcount(key, 5, 10);
```

----------------------------------------

TITLE: Application Run: Start Next.js Development Server
DESCRIPTION: Navigates into the `packages/web` directory and starts the Next.js development server, making your web application accessible locally, typically at `http://localhost:3000`.

SOURCE: https://upstash.com/docs/redis/quickstarts/sst-v2.mdx

LANGUAGE: shell
CODE:
```
cd packages/web
npm run dev
```

----------------------------------------

TITLE: Python Example for Redis BITOP
DESCRIPTION: Demonstrates how to use the `BITOP` command in Python with a Redis client, including setting bits and asserting results.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/bitmap/bitop.mdx

LANGUAGE: Python
CODE:
```
# key1 = 00000001
# key2 = 00000010
redis.setbit("key1", 0, 1)
redis.setbit("key2", 0, 0)
redis.setbit("key2", 1, 1)

assert redis.bitop("AND", "dest", "key1", "key2") == 1

# result = 00000000
assert redis.getbit("dest", 0) == 0
assert redis.getbit("dest", 1) == 0
```

----------------------------------------

TITLE: Initialize Upstash Redis Client from Environment Variables
DESCRIPTION: This snippet illustrates how to initialize both synchronous and asynchronous `upstash-redis` clients by automatically loading credentials from environment variables. The client expects `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to be set in the environment. This approach is highly recommended for cleaner code, enhanced security, and easier management of credentials across different deployment environments.

SOURCE: https://upstash.com/docs/redis/sdks/py/gettingstarted.mdx

LANGUAGE: python
CODE:
```
# for sync use
from upstash_redis import Redis
redis = Redis.from_env()

# for async use
from upstash_redis.asyncio import Redis
redis = Redis.from_env()
```

----------------------------------------

TITLE: Nuxt.js with Redis
DESCRIPTION: Learn how to use Upstash Redis with Nuxt.js applications. This guide provides examples and best practices for integrating Redis into your Nuxt.js projects.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: Nuxt.js
CODE:
```
console.log('This is a placeholder for Nuxt.js code.');
```

----------------------------------------

TITLE: Python Bitfield Get Operation Example
DESCRIPTION: Illustrates how to retrieve multiple 8-bit unsigned integer values from a Redis bitfield using the `get` command. The example initializes a key with specific byte values and then fetches them at designated offsets, asserting the retrieved data.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/bitmap/bitfield.mdx

LANGUAGE: py
CODE:
```
redis.set("mykey", "\x05\x06\x07")

result = redis.bitfield("mykey") \
    .get("u8", 0) \
    .get("u8", 8) \
    .get("u8", 16) \
    .execute()

assert result == [5, 6, 7]
```

----------------------------------------

TITLE: TypeScript Example: Get Substring from Redis Key
DESCRIPTION: Illustrates how to use the `redis.getrange` method in TypeScript to retrieve a substring from a specified key, given start and end indices. This example assumes an initialized Redis client.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/string/getrange.mdx

LANGUAGE: TypeScript
CODE:
```
const substring = await redis.getrange("key", 2, 4);
```

----------------------------------------

TITLE: Fullstack Serverless App with Flutter and Upstash Redis
DESCRIPTION: Develop a fullstack serverless application using Flutter, Serverless Framework, and Upstash Redis. This tutorial, part 1, covers the initial setup and architecture.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: Flutter
CODE:
```
// This is a placeholder for Flutter code.
```

----------------------------------------

TITLE: Initialize Node.js Project and Install Dependencies
DESCRIPTION: Commands to initialize a new Node.js project using npm and install the 'ioredis' library, which is essential for connecting to the Redis database.

SOURCE: https://upstash.com/docs/redis/tutorials/aws_app_runner_with_redis.mdx

LANGUAGE: Shell
CODE:
```
npm init

npm install ioredis
```

----------------------------------------

TITLE: Start Serverless Development Session
DESCRIPTION: Command to run the Serverless service locally for development and testing purposes, allowing you to interact with your functions before deployment.

SOURCE: https://upstash.com/docs/redis/tutorials/using_serverless_framework.mdx

LANGUAGE: shell
CODE:
```
serverless dev
```

----------------------------------------

TITLE: Initialize Serverless Framework Project
DESCRIPTION: Command to create a new Serverless Framework project, selecting the AWS Node.js HTTP API template and naming the service 'counter-serverless'. This output shows the interactive prompts and successful project creation.

SOURCE: https://upstash.com/docs/redis/tutorials/using_serverless_framework.mdx

LANGUAGE: shell
CODE:
```
➜  tutorials > ✗ serverless
Serverless ϟ Framework

Welcome to Serverless Framework V.4

Create a new project by selecting a Template to generate scaffolding for a specific use-case.

✔ Select A Template: · AWS / Node.js / HTTP API

✔ Name Your Project: · counter-serverless

✔ Template Downloaded

✔ Create Or Select An Existing App: · Create A New App

✔ Name Your New App: · counter-serverless

Your new Service "counter-serverless" is ready. Here are next steps:

• Open Service Directory: cd counter-serverless
• Install Dependencies: npm install (or use another package manager)
• Deploy Your Service: serverless deploy
```

----------------------------------------

TITLE: SvelteKit TODO App with Redis
DESCRIPTION: Demonstrates building a TODO application using SvelteKit and Upstash Redis. This example highlights how to integrate Redis for data persistence in a SvelteKit project.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: jsx
CODE:
```
import TagFilters from "../../src/components/Filter.js"

<TagFilters>
  <TagFilters.Item
    externalLink
    type="Article"
    tags={["Svelte"]
    url="https://blog.upstash.com/sveltekit-todo-redis">
    SvelteKit TODO App with Redis
  </TagFilters.Item>
</TagFilters>
```

----------------------------------------

TITLE: Using Upstash Redis with Remix
DESCRIPTION: Provides instructions on how to use Upstash Redis with the Remix framework. This example covers general integration patterns for Redis in Remix projects.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: jsx
CODE:
```
<TagFilters.Item
    externalLink
    type="Article"
    tags={["Remix", "Node.js"]
    url="https://blog.upstash.com/redis-with-remix">
    Using Upstash Redis with Remix
  </TagFilters.Item>
```

----------------------------------------

TITLE: Initialize Git Repository and Push to GitHub
DESCRIPTION: These bash commands initialize a new Git repository, configure a `.gitignore` file to exclude `node_modules`, stage all project files, commit them, add a remote origin, and push the changes to a specified GitHub repository. This prepares the project for git-driven deployment.

SOURCE: https://upstash.com/docs/redis/quickstarts/koyeb.mdx

LANGUAGE: bash
CODE:
```
git init
echo 'node_modules' >> .gitignore
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```

----------------------------------------

TITLE: Install Next.js and Upstash Redis Packages
DESCRIPTION: Commands to initialize a new Next.js project using the App Router and install the `@upstash/redis` client library.

SOURCE: https://upstash.com/docs/redis/quickstarts/vercel-functions-app-router.mdx

LANGUAGE: shell
CODE:
```
npx create-next-app@latest
cd my-app
npm install @upstash/redis
```

----------------------------------------

TITLE: Install Upstash Strapi Ratelimit Plugin
DESCRIPTION: Commands to install the Upstash Strapi Ratelimit plugin using npm or yarn package managers.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-ts/integrations/strapi/getting-started.mdx

LANGUAGE: bash
CODE:
```
npm install --save @upstash/strapi-plugin-upstash-ratelimit
```

LANGUAGE: bash
CODE:
```
yarn add @upstash/strapi-plugin-upstash-ratelimit
```

----------------------------------------

TITLE: Python Example for JSON.STRAPPEND
DESCRIPTION: Demonstrates how to use the `JSON.STRAPPEND` command with a Python Redis client, showing a typical invocation with example arguments.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/strappend.mdx

LANGUAGE: python
CODE:
```
redis.json.strappend("key", "$.path.to.str", "abc")
```

----------------------------------------

TITLE: Slackbot with Vercel and Upstash Redis
DESCRIPTION: Shows how to build a Slackbot using Vercel and Upstash Redis. This example covers deploying serverless Slackbots on Vercel with Redis as a backend.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: jsx
CODE:
```
<TagFilters.Item
    externalLink
    type="Article"
    tags={["Slackbot", "Vercel"]
    url="https://blog.upstash.com/vercel-note-taker-slackbot">
    Slackbot with Vercel and Upstash Redis
  </TagFilters.Item>
```

----------------------------------------

TITLE: Initialize Node.js Project and Install Dependencies
DESCRIPTION: This snippet initializes a new Node.js project and installs necessary packages: `express` for the web framework, `redis` for Redis client, `connect-redis` for Redis session store, and `express-session` for session management middleware. These are crucial for building the web application and integrating with Redis.

SOURCE: https://upstash.com/docs/redis/tutorials/cloud_run_sessions.mdx

LANGUAGE: bash
CODE:
```
npm init

npm install express redis connect-redis express-session
```

----------------------------------------

TITLE: Initialize Node.js project
DESCRIPTION: This bash command initializes a new Node.js project, creating a `package.json` file with default settings, which is essential for managing project dependencies.

SOURCE: https://upstash.com/docs/redis/quickstarts/koyeb.mdx

LANGUAGE: bash
CODE:
```
npm init -y
```

----------------------------------------

TITLE: Upstash Ratelimit Core Methods
DESCRIPTION: This section outlines the primary methods available for interacting with the Upstash Ratelimit service, beyond the basic `limit` method. These methods provide functionalities for controlling request processing, resetting state, and querying remaining limits.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted.mdx

LANGUAGE: APIDOC
CODE:
```
Ratelimit Methods:
  - limit(id: string): Promise<{ pending: Promise<void>, ... }>
    description: Initiates a rate limit check for a given identifier, returning a promise for pending background operations.
  - blockUntilReady(): void
    description: Process a request only when the rate-limiting algorithm allows it.
  - resetUsedTokens(identifier: string): void
    description: Reset the rate limiter state for some identifier.
  - getRemaining(identifier: string): number
    description: Get the remaining tokens/requests left for some identifier.
```

----------------------------------------

TITLE: Python Example for JSON.ARRTRIM
DESCRIPTION: A Python code example demonstrating how to use the `redis.json.arrtrim` method to trim a JSON array at a specified path within a key, using start and stop indices.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/arrtrim.mdx

LANGUAGE: python
CODE:
```
length = redis.json.arrtrim("key", "$.path.to.array", 2, 10)
```

----------------------------------------

TITLE: Upstash Ratelimit Configurable Features
DESCRIPTION: This section details various configurable features that allow users to customize the Upstash Ratelimit behavior according to specific application needs, enhancing performance, observability, and security.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted.mdx

LANGUAGE: APIDOC
CODE:
```
Ratelimit Features:
  - Caching: Handle blocked requests without having to call your Redis Database
  - Timeout: If the Redis call of the ratelimit is not resolved in some timeframe, allow the request by default
  - Analytics & Dashboard: Collect information on which identifiers made how many requests and how many were blocked
  - Traffic Protection: Create a deny list to block requests based on user agents, countries, IP addresses and more
  - Custom Rates: Consume different amounts of tokens in different requests (example: limiting based on request/response size)
  - Multi Region: Utilize several Redis databases in different regions to serve users faster
  - Multiple Limits: Use different limits for different kinds of requests (example: paid and free users)
```

----------------------------------------

TITLE: Initialize Project Directory
DESCRIPTION: Commands to create a new directory for the project and navigate into it, setting up the basic workspace.

SOURCE: https://upstash.com/docs/redis/tutorials/aws_app_runner_with_redis.mdx

LANGUAGE: Shell
CODE:
```
mkdir app_runner_example

cd app_runner_example
```

----------------------------------------

TITLE: Rate Limiting with AWS Lambda and Node.js
DESCRIPTION: Discover how to implement rate limiting for your AWS Lambda functions using Upstash Redis. This guide explains the concepts and provides code examples for Node.js.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: Node.js
CODE:
```
console.log('This is a placeholder for Node.js code related to rate limiting.');
```

----------------------------------------

TITLE: Create new Laravel project using CLI
DESCRIPTION: Creates a new Laravel application named 'example-app' using the globally installed Laravel CLI. After creation, it navigates into the project directory, preparing for further development.

SOURCE: https://upstash.com/docs/redis/quickstarts/laravel.mdx

LANGUAGE: shell
CODE:
```
laravel new example-app
cd example-app
```

----------------------------------------

TITLE: Sample AWS Lambda Test Event JSON
DESCRIPTION: A JSON object representing a typical input event structure for testing the AWS Lambda function. This example shows a simple key-value pair that could be passed to the function, often configured in the AWS Lambda console's test event feature.

SOURCE: https://upstash.com/docs/redis/howto/getstartedawslambda.mdx

LANGUAGE: json
CODE:
```
{
  "key": "foo",
  "value": "bar"
}
```

----------------------------------------

TITLE: Using Render with Redis
DESCRIPTION: Illustrates how to use Upstash Redis with Render, a cloud platform for hosting applications. This example focuses on deploying applications with Redis integration on Render.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: jsx
CODE:
```
<TagFilters.Item
    externalLink
    type="Article"
    tags={["Render"]
    url="https://blog.upstash.com/render-serverless-redis">
    Using Render with Redis
  </TagFilters.Item>
```

----------------------------------------

TITLE: Connect to Upstash Redis using redis-py (Python)
DESCRIPTION: This example illustrates connecting to an Upstash Redis database using the `redis-py` library in Python. It initializes a Redis client with the host, port, password, and enables SSL, then performs a `set` and `get` operation.

SOURCE: https://upstash.com/docs/redis/howto/connectclient.mdx

LANGUAGE: python
CODE:
```
import redis
r = redis.Redis(
host= 'YOUR_ENDPOINT',
port= 'YOUR_PORT',
password= 'YOUR_PASSWORD', 
ssl=True)
r.set('foo','bar')
print(r.get('foo'))
```

----------------------------------------

TITLE: Basic SCAN Usage in TypeScript
DESCRIPTION: A TypeScript example demonstrating how to initiate a `SCAN` operation using a starting cursor of '0' and a wildcard match pattern to retrieve all keys.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/generic/scan.mdx

LANGUAGE: ts
CODE:
```
const [cursor, keys] = await redis.scan(0, { match: "*" });
```

----------------------------------------

TITLE: Python Example: Get All Keys with SCAN
DESCRIPTION: Illustrates how to use the SCAN command in Python to retrieve all keys from a Redis database by iterating through the cursor until all results are fetched.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/scan.mdx

LANGUAGE: python
CODE:
```
# Get all keys

cursor = 0
results = []

while True:
    cursor, keys = redis.scan(cursor, match="*")

    results.extend(keys)
    if cursor == 0:
        break
```

----------------------------------------

TITLE: Building SvelteKit Applications with Serverless Redis
DESCRIPTION: Learn how to build SvelteKit applications and deploy them on Netlify using Upstash Serverless Redis. This tutorial covers frontend and backend integration.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: Svelte
CODE:
```
// This is a placeholder for SvelteKit code.
```

----------------------------------------

TITLE: Roadmap Voting App with Next.js and Vercel
DESCRIPTION: Create a roadmap voting application using Next.js and Upstash Redis, deployed on Vercel. This tutorial guides you through building a full-stack application with real-time updates.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: Next.js
CODE:
```
console.log('This is a placeholder for Next.js code related to roadmap voting app.');
```

----------------------------------------

TITLE: Python Example: Redis BITPOS with Range Parameters
DESCRIPTION: Illustrates the usage of the Redis BITPOS command in Python with explicit start and end range parameters, allowing for searching within a specific segment of the string.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/bitmap/bitpos.mdx

LANGUAGE: python
CODE:
```
redis.bitpos("key", 1, 5, 20)
```

----------------------------------------

TITLE: Upstash on AWS Lambda Using Golang
DESCRIPTION: This video provides a guide on integrating Upstash Redis with AWS Lambda functions written in Golang.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: go
CODE:
```
package main

import (
	"fmt"
	"github.com/redis/go-redis/v9"
	"context"
)

func main() {
	ctx := context.Background()
	r := redis.NewClient(&redis.Options{
		Addr:     "<UPSTASH_REDIS_URL>",
		Password: "", // no password set
		DB:       0,    // use default DB
	})

	err := r.Set(ctx, "mykey", "Hello from Go!", 0).Err()
	if err != nil {
		panic(err)
	}

	val, err := r.Get(ctx, "mykey").Result()
	if err != nil {
		panic(err)
	}
	fmt.Println("mykey", val)
}
```

----------------------------------------

TITLE: TypeScript Examples for RPUSHX Command
DESCRIPTION: Illustrative TypeScript examples demonstrating the usage of the RPUSHX command with an existing list and when the list does not exist.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/rpushx.mdx

LANGUAGE: ts
CODE:
```
await redis.lpush("key", "a", "b", "c"); 
const length = await redis.rpushx("key", "d"); 
console.log(length); // 4
```

LANGUAGE: ts
CODE:
```
const length = await redis.rpushx("key", "a"); 
console.log(length); // 0
```

----------------------------------------

TITLE: Deploy Google Cloud Function with gcloud CLI
DESCRIPTION: This shell command uses the `gcloud functions deploy` utility to deploy the `helloGET` function. It specifies Node.js 14 as the runtime, configures an HTTP trigger, and allows unauthenticated access for testing purposes.

SOURCE: https://upstash.com/docs/redis/howto/getstartedgooglecloudfunctions.mdx

LANGUAGE: shell
CODE:
```
gcloud functions deploy helloGET \
--runtime nodejs14 --trigger-http --allow-unauthenticated
```

----------------------------------------

TITLE: Remix TODO App with Redis
DESCRIPTION: Details building a TODO application using Remix and Upstash Redis. This example demonstrates integrating Redis for data management in a Remix project.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: jsx
CODE:
```
<TagFilters.Item
    externalLink
    type="Article"
    tags={["Remix"]
    url="https://blog.upstash.com/remix-todo-redis">
    Remix TODO App with Redis
  </TagFilters.Item>
```

----------------------------------------

TITLE: Prepare Environment Variables File
DESCRIPTION: Copies the example environment variables file (`.env.example`) to `.env` for local configuration, which is typically ignored by version control.

SOURCE: https://upstash.com/docs/redis/tutorials/nuxtjs_with_redis.mdx

LANGUAGE: bash
CODE:
```
cp .env.example .env
```

----------------------------------------

TITLE: Get Database Size in Python
DESCRIPTION: Example of how to use the DBSIZE command with a Python Redis client to retrieve the total number of keys in the database.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/server/dbsize.mdx

LANGUAGE: python
CODE:
```
redis.dbsize()
```

----------------------------------------

TITLE: Python FLUSHDB Usage Examples
DESCRIPTION: Provides Python code examples demonstrating how to execute the FLUSHDB command using the `redis` client, showcasing both synchronous and asynchronous execution modes.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/server/flushdb.mdx

LANGUAGE: python
CODE:
```
redis.flushall()
```

LANGUAGE: python
CODE:
```
redis.flushall(flush_type="ASYNC")
```

----------------------------------------

TITLE: Zip Lambda Function for AWS Deployment
DESCRIPTION: Creates a zip archive named `app.zip` containing all files in the current project directory. This archive is then uploaded to AWS Lambda, allowing the function to include its `node_modules` dependencies like `ioredis`.

SOURCE: https://upstash.com/docs/redis/howto/getstartedawslambda.mdx

LANGUAGE: shell
CODE:
```
zip -r app.zip .
```

----------------------------------------

TITLE: Initialize Cloudflare Worker Project with C3
DESCRIPTION: These commands utilize `create-cloudflare` (C3) to scaffold a new Cloudflare Worker application. C3 streamlines the project setup process and automatically installs essential tools like Wrangler, preparing your environment for development.

SOURCE: https://upstash.com/docs/redis/quickstarts/cloudflareworkers.mdx

LANGUAGE: shell
CODE:
```
npm create cloudflare@latest
```

LANGUAGE: shell
CODE:
```
yarn create cloudflare@latest
```

----------------------------------------

TITLE: Install Upstash Ratelimit Plugin for Strapi
DESCRIPTION: Instructions to install the Upstash Ratelimit plugin into a Strapi project using either npm or yarn package managers.

SOURCE: https://upstash.com/docs/redis/integrations/ratelimit/strapi/getting-started.mdx

LANGUAGE: bash
CODE:
```
npm install --save @upstash/strapi-plugin-upstash-ratelimit
```

LANGUAGE: bash
CODE:
```
yarn add @upstash/strapi-plugin-upstash-ratelimit
```

----------------------------------------

TITLE: Install Python Libraries for Chat Application
DESCRIPTION: This command installs the necessary Python libraries: Flask for the web framework, Flask-SocketIO for WebSocket communication, and redis for interacting with Redis.

SOURCE: https://upstash.com/docs/redis/tutorials/python_realtime_chat.mdx

LANGUAGE: bash
CODE:
```
pip install flask flask-socketio redis
```

----------------------------------------

TITLE: To-Do List with Blitz.js & Redis
DESCRIPTION: Details the creation of a to-do list application using Blitz.js and Upstash Redis. This example showcases integrating Redis for backend functionality in a Blitz.js project.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: jsx
CODE:
```
<TagFilters.Item
    externalLink
    type="Article"
    tags={["Blitz.js"]
    url="https://blog.upstash.com/blitzjs-todo-redis">
    To-Do List with Blitz.js & Redis
  </TagFilters.Item>
```

----------------------------------------

TITLE: TypeScript Example for XRANGE Command Usage
DESCRIPTION: Illustrates how to use the `xrange` method with a TypeScript Redis client, showing the basic invocation with start and end IDs, and the expected console output format of the stream entries.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/stream/xrange.mdx

LANGUAGE: ts
CODE:
```
const entries = redis.xrange(key, "-", "+");
console.log(entries)
// {
//   "1548149259438-0": {
//     "field1": "value1",
//     "field2": "value2"
//   },
//   "1548149259438-1": {
//     "field1": "value3",
//     "field2": "value4"
//   }
// }
```

----------------------------------------

TITLE: Fastly Project Initialization
DESCRIPTION: This command initializes a new Fastly Compute@Edge project. It prompts the user to select a language (JavaScript in this case) and a starter kit, setting up the basic project structure for development.

SOURCE: https://upstash.com/docs/redis/quickstarts/fastlycompute.mdx

LANGUAGE: shell
CODE:
```
> fastly compute init

Creating a new Compute@Edge project.

Press ^C at any time to quit.

Name: [fastly-upstash]
Description:
Author: [enes@upstash.com]
Language:
[1] Rust
[2] JavaScript
[3] AssemblyScript (beta)
[4] Other ('bring your own' Wasm binary)
Choose option: [1] 2
Starter kit:
[1] Default starter for JavaScript
    A basic starter kit that demonstrates routing, simple synthetic responses and
    overriding caching rules.
    https://github.com/fastly/compute-starter-kit-javascript-default
[2] Empty starter for JavaScript
    An empty application template for the Fastly Compute@Edge environment which simply
    returns a 200 OK response.
    https://github.com/fastly/compute-starter-kit-javascript-empty
Choose option or paste git URL: [1] 2
```

----------------------------------------

TITLE: Start AWS SAM Local API Gateway
DESCRIPTION: Launches a local emulation of API Gateway and AWS Lambda, allowing you to test the serverless API on your local machine before deploying it to the cloud. The API will be accessible at `http://127.0.0.1:3000/hello`.

SOURCE: https://upstash.com/docs/redis/tutorials/goapi.mdx

LANGUAGE: Shell
CODE:
```
sam local start-api
```

----------------------------------------

TITLE: Install Node.js Dependencies
DESCRIPTION: Executes the npm install command to download and install all dependencies listed in the `package.json` file into the project's `node_modules` directory.

SOURCE: https://upstash.com/docs/redis/tutorials/rate-limiting.mdx

LANGUAGE: shell
CODE:
```
npm install
```

----------------------------------------

TITLE: Redis SMEMBERS Command API and Python Example
DESCRIPTION: Comprehensive documentation and example for the Redis `SMEMBERS` command, which retrieves all members from a specified set. Includes API details for arguments and response, alongside a Python usage example.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/set/smembers.mdx

LANGUAGE: APIDOC
CODE:
```
SMEMBERS:
  Description: Return all the members of a set
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the set.
  Response:
    Type: set[str]
    Required: true
    Description: The members of the set.
```

LANGUAGE: py
CODE:
```
redis.sadd("set", "a", "b", "c"); 
assert redis.smembers("set") == {"a", "b", "c"}
```

----------------------------------------

TITLE: Start Flask Application Server
DESCRIPTION: This command starts the Flask application server, making the chat interface accessible via a web browser at the specified local address.

SOURCE: https://upstash.com/docs/redis/tutorials/python_realtime_chat.mdx

LANGUAGE: Bash
CODE:
```
python app.py
```

----------------------------------------

TITLE: Install Go Redis Client Library
DESCRIPTION: Installs the `go-redis/redis/v8` client library, which is the sole dependency for interacting with Redis from the Go application. This command fetches the package and adds it to your Go module dependencies.

SOURCE: https://upstash.com/docs/redis/tutorials/goapi.mdx

LANGUAGE: Shell
CODE:
```
go get github.com/go-redis/redis/v8
```

----------------------------------------

TITLE: TypeScript Examples for Redis KEYS Command
DESCRIPTION: Illustrative TypeScript code snippets demonstrating how to use the `redis.keys()` method to retrieve keys based on a pattern, including an example for matching all keys.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/generic/keys.mdx

LANGUAGE: ts
CODE:
```
const keys = await redis.keys("prefix*");
```

LANGUAGE: ts
CODE:
```
const keys = await redis.keys("*");
```

----------------------------------------

TITLE: Set Up Upstash Redis Environment Variables
DESCRIPTION: Example of setting Upstash Redis REST token and URL in the .env file, which are required for the plugin's configuration.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-ts/integrations/strapi/getting-started.mdx

LANGUAGE: shell
CODE:
```
UPSTASH_REDIS_REST_TOKEN="<YOUR_TOKEN>"
UPSTASH_REDIS_REST_URL="<YOUR_URL>"
```

----------------------------------------

TITLE: Get string length using STRLEN in Python
DESCRIPTION: This example demonstrates how to use the STRLEN command via a Python Redis client to get the length of a string stored at a key. It first sets a key with a string value and then asserts the correct length returned by STRLEN.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/string/strlen.mdx

LANGUAGE: python
CODE:
```
redis.set("key", "Hello World")

assert redis.strlen("key") == 11
```

----------------------------------------

TITLE: Set Environment Variables for Cloudflare Worker (Wrangler)
DESCRIPTION: Commands to set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` as secrets in a Cloudflare Worker project using the `wrangler secret put` command-line tool.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted.mdx

LANGUAGE: bash
CODE:
```
npx wrangler secret put UPSTASH_REDIS_REST_URL

```

LANGUAGE: bash
CODE:
```
npx wrangler secret put UPSTASH_REDIS_REST_TOKEN
```

----------------------------------------

TITLE: Install Upstash Redis Client
DESCRIPTION: This command installs the `@upstash/redis` package using npm, making the client library available for use in your JavaScript or TypeScript project.

SOURCE: https://upstash.com/docs/redis/howto/connectwithupstashredis.mdx

LANGUAGE: bash
CODE:
```
npm install @upstash/redis
```

----------------------------------------

TITLE: Configure Upstash Strapi Ratelimit Plugin
DESCRIPTION: Configuration examples for the Upstash Strapi Ratelimit plugin in Strapi's plugin configuration files. This includes enabling the plugin, resolving its path, and setting up the Upstash token, URL, and a rate limiting strategy (e.g., fixed-window with specific methods, path, tokens, and window).

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-ts/integrations/strapi/getting-started.mdx

LANGUAGE: typescript
CODE:
```
export default () => ({
  "strapi-plugin-upstash-ratelimit": {
    enabled: true,
    resolve: "./src/plugins/strapi-plugin-upstash-ratelimit",
    config: {
      enabled: true,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
      url: process.env.UPSTASH_REDIS_REST_URL,
      strategy: [
        {
          methods: ["GET", "POST"],
          path: "*",
          limiter: {
            algorithm: "fixed-window",
            tokens: 10,
            window: "20s"
          }
        }
      ],
      prefix: "@strapi"
    }
  }
});
```

LANGUAGE: javascript
CODE:
```
module.exports = () => ({
  "strapi-plugin-upstash-ratelimit": {
    enabled: true,
    resolve: "./src/plugins/strapi-plugin-upstash-ratelimit",
    config: {
      enabled: true,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
      url: process.env.UPSTASH_REDIS_REST_URL,
      strategy: [
        {
          methods: ["GET", "POST"],
          path: "*",
          limiter: {
            algorithm: "fixed-window",
            tokens: 10,
            window: "20s"
          }
        }
      ],
      prefix: "@strapi"
    }
  }
});
```

----------------------------------------

TITLE: Python Example for GETSET Command
DESCRIPTION: This Python example demonstrates how to use the `GETSET` command. It first sets a key with an 'old-value', then calls `getset` to replace it with 'newvalue' and asserts that the returned value is the original 'old-value'.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/string/getset.mdx

LANGUAGE: py
CODE:
```
redis.set("key", "old-value")

assert redis.getset("key", "newvalue") == "old-value"
```

----------------------------------------

TITLE: Connect to Upstash Redis using redigo (Go)
DESCRIPTION: This example shows how to connect to an Upstash Redis database using the `redigo` library in Go. It dials a TCP connection with TLS, authenticates with the password, and then performs `SET` and `GET` commands.

SOURCE: https://upstash.com/docs/redis/howto/connectclient.mdx

LANGUAGE: go
CODE:
```
func main() {
  c, err := redis.Dial("tcp", "YOUR_ENDPOINT:YOUR_PORT", redis.DialUseTLS(true))
  if err != nil {
      panic(err)
  }

  _, err = c.Do("AUTH", "YOUR_PASSWORD")
  if err != nil {
      panic(err)
  }

  _, err = c.Do("SET", "foo", "bar")
  if err != nil {
      panic(err)
  }

  value, err := redis.String(c.Do("GET", "foo"))
  if err != nil {
      panic(err)
  }

  println(value)
}
```

----------------------------------------

TITLE: TypeScript Example for JSON.STRLEN Command
DESCRIPTION: Demonstrates how to use the `JSON.STRLEN` command in TypeScript with the Upstash Redis client to get the length of a JSON string at a specific path.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/strlen.mdx

LANGUAGE: ts
CODE:
```
await redis.json.strlen("key", "$.path.to.str", "a");
```

----------------------------------------

TITLE: Initialize Upstash Redis Client with Direct Configuration
DESCRIPTION: This TypeScript example demonstrates how to initialize the Upstash Redis client by directly providing the REST URL and token. It then performs an asynchronous `get` operation to retrieve data from Redis, logging the result or any encountered errors.

SOURCE: https://upstash.com/docs/redis/howto/connectwithupstashredis.mdx

LANGUAGE: typescript
CODE:
```
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "UPSTASH_REDIS_REST_URL",
  token: "UPSTASH_REDIS_REST_TOKEN"
});

(async () => {
  try {
    const data = await redis.get("key");
    console.log(data);
  } catch (error) {
    console.error(error);
  }
})();
```

----------------------------------------

TITLE: Install Node.js dependencies
DESCRIPTION: This bash command installs the required Node.js packages: `@upstash/redis` for connecting to the Redis database and `express` for building the web application.

SOURCE: https://upstash.com/docs/redis/quickstarts/koyeb.mdx

LANGUAGE: bash
CODE:
```
npm install @upstash/redis express
```

----------------------------------------

TITLE: Build Java Project with Maven
DESCRIPTION: Executes the Maven 'clean install' command to compile the Java code, run tests, and package the application into a JAR file, preparing it for deployment.

SOURCE: https://upstash.com/docs/redis/tutorials/serverless_java_redis.mdx

LANGUAGE: shell
CODE:
```
mvn clean install
```

----------------------------------------

TITLE: Install React Toastify
DESCRIPTION: Command to install the `react-toastify` library, a popular component for displaying toast notifications in React applications.

SOURCE: https://upstash.com/docs/redis/tutorials/notification.mdx

LANGUAGE: shell
CODE:
```
npm install --save react-toastify
```

----------------------------------------

TITLE: Python RPOP Examples
DESCRIPTION: Examples demonstrating the usage of the RPOP command in Python, showing how to pop single or multiple elements from a Redis list.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/rpop.mdx

LANGUAGE: Python
CODE:
```
redis.rpush("mylist", "one", "two", "three")

assert redis.rpop("mylist") == "three"
```

LANGUAGE: Python
CODE:
```
redis.rpush("mylist", "one", "two", "three")

assert redis.rpop("mylist", 2) == ["three", "two"]
```

----------------------------------------

TITLE: Using AWS SAM with AWS Lambda
DESCRIPTION: Deploy serverless applications with Upstash Redis using AWS SAM (Serverless Application Model) and AWS Lambda. This guide focuses on efficient deployment strategies.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: AWS Lambda
CODE:
```
console.log('This is a placeholder for AWS SAM code.');
```

----------------------------------------

TITLE: Python Example for JSON.OBJKEYS
DESCRIPTION: An example demonstrating how to invoke the JSON.OBJKEYS command using the Upstash Redis Python client, showing a typical usage pattern.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/objkeys.mdx

LANGUAGE: python
CODE:
```
keys = redis.json.objkeys("key", "$.path")
```

----------------------------------------

TITLE: Import Upstash Redis for Edge Environments
DESCRIPTION: This TypeScript snippet shows specific import paths for the Upstash Redis client when deploying to Cloudflare Workers or Fastly Compute@Edge, allowing `Ratelimit` to connect to Redis in these environments.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted.mdx

LANGUAGE: ts
CODE:
```
import { Redis } from "@upstash/redis/cloudflare"; // for cloudflare workers and pages
import { Redis } from "@upstash/redis/fastly"; // for fastly compute@edge
```

----------------------------------------

TITLE: Python Example: Redis BITPOS Basic Usage and Assertions
DESCRIPTION: Demonstrates how to use the Redis BITPOS command in Python. It includes setting bits on a key, then using BITPOS to find the position of specific bits, asserting the results. Examples cover both basic usage and searching within a specified range.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/bitmap/bitpos.mdx

LANGUAGE: python
CODE:
```
redis.setbit("mykey", 7, 1)
redis.setbit("mykey", 8, 1)

assert redis.bitpos("mykey", 1) == 7
assert redis.bitpos("mykey", 0) == 0

# With a range
assert redis.bitpos("mykey", 1, 0, 2) == 0
assert redis.bitpos("mykey", 1, 2, 3) == -1
```

----------------------------------------

TITLE: Install Python Dependencies for Upstash Redis
DESCRIPTION: This command installs the necessary Python packages, `upstash-redis` for interacting with the Redis database and `python-dotenv` for managing environment variables, which are required to run the URL shortener application.

SOURCE: https://upstash.com/docs/redis/tutorials/python_url_shortener.mdx

LANGUAGE: shell
CODE:
```
pip install upstash-redis
```

----------------------------------------

TITLE: DBSIZE Command API Reference and Example
DESCRIPTION: Documents the DBSIZE command, its arguments, response type, and provides a TypeScript example for usage with a Redis client.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/server/dbsize.mdx

LANGUAGE: APIDOC
CODE:
```
DBSIZE:
  Arguments: None
  Response:
    type: integer
    description: The number of keys in the database
```

LANGUAGE: ts
CODE:
```
const keys = await redis.dbsize();
console.log(keys) // 20
```

----------------------------------------

TITLE: Install FastAPI and Upstash Redis Libraries
DESCRIPTION: Installs the necessary Python packages, FastAPI for web framework and upstash-redis for Redis client, using the pip package manager.

SOURCE: https://upstash.com/docs/redis/quickstarts/fastapi.mdx

LANGUAGE: shell
CODE:
```
pip install fastapi
pip install upstash-redis
```

----------------------------------------

TITLE: Python Example: Get JSON Object Length
DESCRIPTION: Illustrates how to use the `redis.json.objlen` method in Python to retrieve the number of keys within a JSON object at a specified path.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/objlen.mdx

LANGUAGE: python
CODE:
```
lengths = redis.json.objlen("key", "$.path")
```

----------------------------------------

TITLE: Connect to Upstash Redis using upstash-redis (TypeScript)
DESCRIPTION: This example demonstrates how to connect to an Upstash Redis database using the `@upstash/redis` library in TypeScript. It initializes a Redis client with the REST URL and token, then performs a basic `get` operation to retrieve data.

SOURCE: https://upstash.com/docs/redis/howto/connectclient.mdx

LANGUAGE: typescript
CODE:
```
import { Redis } from '@upstash/redis';

const redis = new Redis({ url: 'UPSTASH_REDIS_REST_URL', token: 'UPSTASH_REDIS_REST_TOKEN' });

(async () => {
  try {
    const data = await redis.get('key');
    console.log(data);
  } catch (error) {
    console.error(error);
  }
})();
```

----------------------------------------

TITLE: Initialize Nuxt.js Project
DESCRIPTION: Command to create a new Nuxt.js application using the `nuxi` CLI tool.

SOURCE: https://upstash.com/docs/redis/tutorials/nuxtjs_with_redis.mdx

LANGUAGE: bash
CODE:
```
npx nuxi@latest init nuxtjs-with-redis
```

----------------------------------------

TITLE: Python Example for HSTRLEN
DESCRIPTION: A Python code snippet demonstrating how to call the HSTRLEN command using a Redis client to get the string length of a field within a hash.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hstrlen.mdx

LANGUAGE: python
CODE:
```
length = redis.hstrlen("key", "field")
```

----------------------------------------

TITLE: Install Upstash Redis Client
DESCRIPTION: This command installs the `@upstash/redis` client library from npm. This library is essential for the JavaScript application to interact with the Upstash Redis database.

SOURCE: https://upstash.com/docs/redis/quickstarts/fastlycompute.mdx

LANGUAGE: shell
CODE:
```
npm install @upstash/redis
```

----------------------------------------

TITLE: Python Example for SUNIONSTORE Command
DESCRIPTION: Illustrates how to use the `SUNIONSTORE` command in Python. This example first populates two sets and then performs a union operation, storing the result in a new destination set.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/set/sunionstore.mdx

LANGUAGE: python
CODE:
```
redis.sadd("set1", "a", "b", "c"); 
redis.sadd("set2", "c", "d", "e"); 
redis.sunionstore("destination", "set1", "set2")
```

----------------------------------------

TITLE: Get Bit from Redis in Python
DESCRIPTION: Demonstrates how to use the `getbit` method with a Redis client in Python to retrieve a single bit at a specific offset from a given key. This example assumes 'redis' is an initialized Redis client instance.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/bitmap/getbit.mdx

LANGUAGE: Python
CODE:
```
bit = redis.getbit(key, 4)
```

----------------------------------------

TITLE: Initialize Cloudflare Worker Project with Wrangler
DESCRIPTION: This command initializes a new Cloudflare Worker project using the `wrangler init` CLI tool, guiding the user through setup options like directory, template, and language (TypeScript).

SOURCE: https://upstash.com/docs/redis/tutorials/cloudflare_workers_with_redis.mdx

LANGUAGE: shell
CODE:
```
npx wrangler init
╭ Create an application with Cloudflare Step 1 of 3
│
├ In which directory do you want to create your application?
│ dir ./greetings-cloudflare
│
├ What would you like to start with?
│ category Hello World example
│
├ Which template would you like to use?
│ type Hello World Worker
│
├ Which language do you want to use?
│ lang TypeScript
│
├ Copying template files
│ files copied to project directory
│
├ Updating name in `package.json`
│ updated `package.json`
│
├ Installing dependencies
│ installed via `npm install`
│
╰ Application created

╭ Configuring your application for Cloudflare Step 2 of 3
│
├ Installing @cloudflare/workers-types
│ installed via npm
│
├ Adding latest types to `tsconfig.json`
│ added @cloudflare/workers-types/2023-07-01
│
├ Retrieving current workerd compatibility date
│ compatibility date 2024-10-22
│
├ Do you want to use git for version control?
│ no git
│
╰ Application configured
```

----------------------------------------

TITLE: Upstash Ratelimit Response Data Class Definition
DESCRIPTION: API documentation for the `Response` dataclass, which is returned by the `limit` method of the `Ratelimit` class. It details the metadata attributes available: `allowed`, `limit`, `remaining`, and `reset`.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-py/gettingstarted.mdx

LANGUAGE: APIDOC
CODE:
```
Response (dataclass):
  Attributes:
    allowed (bool): Whether the request may pass (True) or exceeded the limit (False).
    limit (int): Maximum number of requests allowed within a window.
    remaining (int): How many requests the user has left within the current window.
    reset (float): Unix timestamp in seconds when the limits are reset.
```

----------------------------------------

TITLE: Create Project Directory
DESCRIPTION: This snippet demonstrates how to create a new directory for the project and navigate into it using standard shell commands. This is the initial step for setting up the project structure.

SOURCE: https://upstash.com/docs/redis/tutorials/cloud_run_sessions.mdx

LANGUAGE: bash
CODE:
```
mkdir cloud-run-sessions

cd cloud-run-sessions
```

----------------------------------------

TITLE: Get List Length using LLEN in Python
DESCRIPTION: This Python example demonstrates how to use the `llen` command with a Redis client. It first populates a list using `rpush` and then asserts the correct length using `llen`.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/llen.mdx

LANGUAGE: python
CODE:
```
redis.rpush("key", "a", "b", "c")

assert redis.llen("key") == 3
```

----------------------------------------

TITLE: Initialize Django Project with Vercel Template
DESCRIPTION: This command uses `npx create-next-app` to scaffold a new Django project named `vercel-django` from a Vercel example template, followed by navigating into the new project directory.

SOURCE: https://upstash.com/docs/redis/quickstarts/vercel-python-runtime.mdx

LANGUAGE: shell
CODE:
```
npx create-next-app vercel-django --example "https://github.com/vercel/examples/tree/main/python/django"
cd vercel-django
```

----------------------------------------

TITLE: Navigate to Project Directory
DESCRIPTION: Command to change the current directory to the newly created Serverless project folder, 'counter-serverless'.

SOURCE: https://upstash.com/docs/redis/tutorials/using_serverless_framework.mdx

LANGUAGE: shell
CODE:
```
cd counter-serverless
```

----------------------------------------

TITLE: Create new Laravel project using Composer
DESCRIPTION: Creates a new Laravel application named 'example-app' directly via Composer, offering an alternative to installing the Laravel CLI. The command also navigates into the newly created project directory.

SOURCE: https://upstash.com/docs/redis/quickstarts/laravel.mdx

LANGUAGE: shell
CODE:
```
composer create-project laravel/laravel example-app
cd example-app
```

----------------------------------------

TITLE: Application Run: Start SST Development Server
DESCRIPTION: Initiates the SST development server, which monitors your project for changes and automatically deploys updates to your local AWS environment or mock services.

SOURCE: https://upstash.com/docs/redis/quickstarts/sst-v2.mdx

LANGUAGE: shell
CODE:
```
npm run dev
```

----------------------------------------

TITLE: Test Nuxt API Endpoint with cURL
DESCRIPTION: An example cURL command to send an HTTP GET request to the locally running Nuxt API endpoint (`/api/increment`) and observe its response.

SOURCE: https://upstash.com/docs/redis/tutorials/nuxtjs_with_redis.mdx

LANGUAGE: bash
CODE:
```
curl http://localhost:3000/api/increment
```

----------------------------------------

TITLE: Python Example for ZPOPMAX
DESCRIPTION: Illustrates how to use the ZPOPMAX command in Python. It demonstrates adding elements to a sorted set and then asserting the correct retrieval of the highest-scoring member.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zpopmax.mdx

LANGUAGE: py
CODE:
```
redis.zadd("myset", {"a": 1, "b": 2, "c": 3})

assert redis.zpopmax("myset") == [("c", 3)]
```

----------------------------------------

TITLE: TypeScript Example: Using redis.touch
DESCRIPTION: An example demonstrating how to use the `redis.touch` method in TypeScript to update the last access time for multiple keys.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/generic/touch.mdx

LANGUAGE: ts
CODE:
```
await redis.touch("key1", "key2", "key3");
```

----------------------------------------

TITLE: Run Node.js Application with Local Redis Tunnel
DESCRIPTION: This command is used to start a Node.js application locally. When the `fly redis connect` tunnel is active, the application will seamlessly connect to the Redis instance through this tunnel, simulating a local Redis setup for development and testing.

SOURCE: https://upstash.com/docs/redis/quickstarts/fly.mdx

LANGUAGE: shell
CODE:
```
npm start
```

----------------------------------------

TITLE: Next.js App Router Project Initialization and Upstash Redis Installation
DESCRIPTION: This snippet provides the shell commands to create a new Next.js application using the App Router. It also includes the command to install the `@upstash/redis` package, which is necessary for interacting with Upstash Redis.

SOURCE: https://upstash.com/docs/redis/quickstarts/nextjs-app-router.mdx

LANGUAGE: shell
CODE:
```
npx create-next-app@latest
cd my-app
npm install @upstash/redis
```

----------------------------------------

TITLE: Redis GET Command API Documentation
DESCRIPTION: Documents the `GET` command for Upstash Redis, outlining its required arguments and the expected response format.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/string/get.mdx

LANGUAGE: APIDOC
CODE:
```
Command: GET
Description: Return the value of the specified key or `None` if the key doesn't exist.

Arguments:
  key (str, required): The key to get.

Response:
  (any, required): The response is the value stored at the key or `None` if the key doesn't exist.
```

----------------------------------------

TITLE: Get Hash Field String Length in TypeScript
DESCRIPTION: An example demonstrating how to use the `hstrlen` method with a Redis client in TypeScript to retrieve the string length of a specified field within a hash.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hstrlen.mdx

LANGUAGE: ts
CODE:
```
const length = await redis.hstrlen("key", "field")
```

----------------------------------------

TITLE: Python Example for HMSET
DESCRIPTION: An example demonstrating how to use the HMSET command in Python to set multiple fields in a Redis hash.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hmset.mdx

LANGUAGE: py
CODE:
```
# Set multiple fields
assert redis.hset("myhash"{
  "field1": "Hello",
  "field2": "World"
}) == 2
```

----------------------------------------

TITLE: Python Example for Redis LPUSHX Command
DESCRIPTION: Illustrates the usage of the `lpushx` command with a Python Redis client, showing how to initialize a list, push elements conditionally, and handle cases where the list does not exist.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/lpushx.mdx

LANGUAGE: python
CODE:
```
# Initialize the list
redis.lpush("mylist", "one")

assert redis.lpushx("mylist", "two", "three") == 3

assert lrange("mylist", 0, -1) == ["three", "two", "one"]

# Non existing key
assert redis.lpushx("non-existent-list", "one") == 0
```

----------------------------------------

TITLE: Deploy AWS SAM Application
DESCRIPTION: Initiates a guided deployment of the AWS SAM application to AWS. The `--guided` flag prompts the user for necessary environment variables (like Upstash Redis credentials) and configuration details, simplifying the deployment process.

SOURCE: https://upstash.com/docs/redis/tutorials/using_aws_sam.mdx

LANGUAGE: shell
CODE:
```
sam deploy --guided
```

----------------------------------------

TITLE: TypeScript Example: Setting Hash Field Expiration
DESCRIPTION: Demonstrates how to use the `hpexpireat` command in TypeScript with an Upstash Redis client to set an expiration time for a hash field, including a basic setup and logging the result.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hpexpireat.mdx

LANGUAGE: ts
CODE:
```
await redis.hset("my-key", "my-field", "my-value");
const expirationSet = await redis.hpexpireat("my-key", "my-field", Date.now() + 1000);

console.log(expirationSet); // [1]
```

----------------------------------------

TITLE: Initialize Upstash Redis Client from Environment Variables
DESCRIPTION: This TypeScript example shows how to initialize the Upstash Redis client by automatically loading configuration from environment variables (`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`). It then performs an asynchronous `get` operation to retrieve data from Redis, logging the result or any encountered errors.

SOURCE: https://upstash.com/docs/redis/howto/connectwithupstashredis.mdx

LANGUAGE: typescript
CODE:
```
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv()();

(async () => {
  try {
    const data = await redis.get("key");
    console.log(data);
  } catch (error) {
    console.error(error);
  }
})();
```

----------------------------------------

TITLE: Google Cloud Function Deployment URL Output
DESCRIPTION: This snippet illustrates the relevant output from a successful `gcloud functions deploy` command, specifically showing the `httpsTrigger` section which contains the public URL of the deployed Google Cloud Function.

SOURCE: https://upstash.com/docs/redis/howto/getstartedgooglecloudfunctions.mdx

LANGUAGE: shell
CODE:
```
httpsTrigger:
securityLevel: SECURE_OPTIONAL
url: https://us-central1-functions-317005.cloudfunctions.net/helloGET
```

----------------------------------------

TITLE: Serverless Golang API with Redis
DESCRIPTION: Develop a serverless Golang API using Upstash Redis. This tutorial is geared towards AWS Lambda and provides examples for building efficient Go applications.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: Go
CODE:
```
package main

import "fmt"

func main() {
	fmt.Println("This is a placeholder for Go code.")
}
```

----------------------------------------

TITLE: Serverless Redisson
DESCRIPTION: Explore the use of Redisson with Upstash Redis for Java applications. This tutorial focuses on leveraging Redisson's features in a serverless context.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: Java
CODE:
```
System.out.println("This is a placeholder for Redisson Java code.");
```

----------------------------------------

TITLE: Python Example for XRANGE Command
DESCRIPTION: Demonstrates how to use the `xrange` method with a Redis client in Python to retrieve stream entries, showing the typical output format.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/stream/xrange.mdx

LANGUAGE: python
CODE:
```
entries = redis.xrange(key, "-", "+")
print(entries)
# {
#   "1548149259438-0": {
#     "field1": "value1",
#     "field2": "value2"
#   },
#   "1548149259438-1": {
#     "field1": "value3",
#     "field2": "value4"
#   }
# }
```

----------------------------------------

TITLE: Building a Survey App with Upstash Redis and Next.js
DESCRIPTION: Details building a survey application using Upstash Redis and Next.js. This example demonstrates using Redis for data collection and management in a Next.js app.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: jsx
CODE:
```
<TagFilters.Item
    externalLink
    type="Article"
    tags={["Next.js"]
    url="https://blog.upstash.com/survey-serverless-redis">
    Building a Survey App with Upstash Redis and Next.js
  </TagFilters.Item>
```

----------------------------------------

TITLE: TypeScript Example for GETDEL Command
DESCRIPTION: Demonstrates how to use the `getdel` method with a type definition in TypeScript, showing an example return value.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/string/getdel.mdx

LANGUAGE: ts
CODE:
```
type MyType = {
    a: number;
    b: string;
}
await redis.getdel<MyType>("key");
// returns {a: 1, b: "2"}
```

----------------------------------------

TITLE: Install Upstash Redis Client Library
DESCRIPTION: Installs the official `@upstash/redis` client package for Node.js projects, enabling interaction with Upstash Redis databases.

SOURCE: https://upstash.com/docs/redis/tutorials/nuxtjs_with_redis.mdx

LANGUAGE: bash
CODE:
```
npm install @upstash/redis
```

----------------------------------------

TITLE: Create Serverless Project
DESCRIPTION: Demonstrates how to initialize a new Serverless project for an AWS Node.js application using the `serverless` CLI command, including prompts for project name and enabling Serverless account integration.

SOURCE: https://upstash.com/docs/redis/tutorials/job_processing.mdx

LANGUAGE: Shell
CODE:
```
➜  serverless

Serverless: No project detected. Do you want to create a new one? Yes

Serverless: What do you want to make? AWS Node.js

Serverless: What do you want to call this project? producer

Project successfully created in 'producer' folder.

You can monitor, troubleshoot, and test your new service with a free Serverless account.

Serverless: Would you like to enable this? No

You can run the “serverless” command again if you change your mind later.
```

----------------------------------------

TITLE: Python Example for LINSERT Command
DESCRIPTION: Demonstrates how to use the LINSERT command in Python to insert an element into a Redis list.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/linsert.mdx

LANGUAGE: python
CODE:
```
redis.rpush("key", "a", "b", "c")
redis.linsert("key", "before", "b", "x")
```

----------------------------------------

TITLE: Python Example for JSON.TYPE
DESCRIPTION: An example demonstrating how to call the `JSON.TYPE` command using a Python Redis client, specifying the key and path.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/type.mdx

LANGUAGE: python
CODE:
```
myType = redis.json.type("key", "$.path.to.value")
```

----------------------------------------

TITLE: Python Example for HGETALL Redis Command
DESCRIPTION: This Python snippet demonstrates how to use the `hset` method to populate a Redis hash and then `hgetall` to retrieve all its fields. It includes an assertion to verify the correctness of the retrieved data.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hgetall.mdx

LANGUAGE: python
CODE:
```
redis.hset("myhash", values={
"field1": "Hello",
"field2": "World"
})

assert redis.hgetall("myhash") == {"field1": "Hello", "field2": "World"}
```

----------------------------------------

TITLE: TypeScript Example for LINSERT Command
DESCRIPTION: Illustrates how to use the LINSERT command with an Upstash Redis client in TypeScript. The example first populates a list using RPUSH and then demonstrates inserting a new element 'x' before 'b' using LINSERT.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/linsert.mdx

LANGUAGE: ts
CODE:
```
await redis.rpush("key", "a", "b", "c");
await redis.linsert("key", "before", "b", "x");
```

----------------------------------------

TITLE: Install Upstash Redis client package
DESCRIPTION: Installs the `@upstash/redis` npm package, which is the client library required for interacting with Upstash Redis.

SOURCE: https://upstash.com/docs/redis/quickstarts/ion.mdx

LANGUAGE: shell
CODE:
```
npm install @upstash/redis
```

----------------------------------------

TITLE: Mapping Redis Commands to Upstash REST API URLs
DESCRIPTION: Provides several examples demonstrating how various Redis commands (SET, GET, MGET, HGET, ZADD) are translated into corresponding URL paths for the Upstash REST API, following the Redis Protocol convention.

SOURCE: https://upstash.com/docs/redis/features/restapi.mdx

LANGUAGE: shell
CODE:
```
- `SET foo bar` -> `REST_URL/set/foo/bar`
- `SET foo bar EX 100` -> `REST_URL/set/foo/bar/EX/100`
- `GET foo` -> `REST_URL/get/foo`
- `MGET foo1 foo2 foo3` -> `REST_URL/mget/foo1/foo2/foo3`
- `HGET employee:23381 salary` -> `REST_URL/hget/employee:23381/salary`
- `ZADD teams 100 team-x 90 team-y` -> `REST_URL/zadd/teams/100/team-x/90/team-y`
```

----------------------------------------

TITLE: TypeScript Example for PERSIST
DESCRIPTION: A TypeScript code example demonstrating how to use the `persist` method with the Upstash Redis client.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/generic/persist.mdx

LANGUAGE: ts
CODE:
```
await redis.persist(key);
```

----------------------------------------

TITLE: Test Laravel Todo API Endpoints with cURL Commands
DESCRIPTION: Provides a collection of cURL commands to interact with and test the Laravel Todo API. These examples cover GET, POST, PUT, and DELETE requests, demonstrating how to retrieve, create, update, and delete todo items from the command line.

SOURCE: https://upstash.com/docs/redis/tutorials/laravel_caching.mdx

LANGUAGE: shell
CODE:
```
# Get all todos
curl http://todo-cache.test/api/todos

# Get a specific todo
curl http://todo-cache.test/api/todos/1

# Create a new todo
curl -X POST http://todo-cache.test/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"New Todo"}'

# Update a todo
curl -X PUT http://todo-cache.test/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Todo"}'

# Delete a todo
curl -X DELETE http://todo-cache.test/api/todos/1
```

----------------------------------------

TITLE: Python Upstash Redis FLUSHALL Examples
DESCRIPTION: Provides Python code examples for using the `flushall` method with the Upstash Redis client. Demonstrates both synchronous and asynchronous calls for deleting all keys in the database.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/server/flushall.mdx

LANGUAGE: python
CODE:
```
redis.flushall()
```

LANGUAGE: python
CODE:
```
redis.flushall(flush_type="ASYNC")
```

----------------------------------------

TITLE: Build Stateful Applications with AWS App Runner and Serverless Redis
DESCRIPTION: Illustrates building stateful applications using AWS App Runner and Upstash Redis. This example focuses on leveraging Redis for managing application state in a serverless environment.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: jsx
CODE:
```
<TagFilters.Item
    externalLink
    type="Article"
    tags={["AWS App Runner", "Node.js"]
    url="https://docs.upstash.com/redis/tutorials/aws_app_runner_with_redis">
    Build Stateful Applications with AWS App Runner and Serverless Redis
  </TagFilters.Item>
```

----------------------------------------

TITLE: Remix on Cloudflare with Upstash Redis
DESCRIPTION: Explains how to deploy Remix applications on Cloudflare Workers with Upstash Redis. This example focuses on building fast, edge-deployed applications.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: jsx
CODE:
```
<TagFilters.Item
    externalLink
    type="Article"
    tags={["Remix", "Cloudflare Workers"]
    url="https://blog.upstash.com/fast_websites_with_Remix_on_Cloudflare_and_Upstash_Redis">
    Remix on Cloudflare with Upstash Redis
  </TagFilters.Item>
```

----------------------------------------

TITLE: Create Upstash Redis Instance with Fly CLI
DESCRIPTION: This command-line interface snippet demonstrates how to provision an Upstash Redis database directly within the Fly.io platform using `flyctl`. It guides the user through selecting an organization, naming the database, choosing a primary region, deciding on eviction policies, and selecting a Redis plan. The output provides the connection string for the newly created Redis instance.

SOURCE: https://upstash.com/docs/redis/quickstarts/fly.mdx

LANGUAGE: shell
CODE:
```
> flyctl redis create
? Select Organization: upstash (upstash)
? Choose a Redis database name (leave blank to generate one):
? Choose a primary region (can't be changed later) San Jose, California (US) (sjc)

Upstash Redis can evict objects when memory is full. This is useful when caching in Redis. This setting can be changed later.
Learn more at https://fly.io/docs/reference/redis/#memory-limits-and-object-eviction-policies
? Would you like to enable eviction? No
? Optionally, choose one or more replica regions (can be changed later):
? Select an Upstash Redis plan 3G: 3 GB Max Data Size

Your Upstash Redis database silent-tree-6201 is ready.
Apps in the upstash org can connect to at redis://default:978ba2e07tyrt67598acd8ac916a@fly-silent-tree-6201.upstash.io
If you have redis-cli installed, use fly redis connect to connect to your database.
```

----------------------------------------

TITLE: Get Set Cardinality with Upstash Redis (TypeScript)
DESCRIPTION: Demonstrates how to use the `SCARD` command with Upstash Redis in TypeScript to retrieve the number of members in a set. The example first populates a set using `SADD` and then queries its cardinality using `SCARD`.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/set/scard.mdx

LANGUAGE: ts
CODE:
```
await redis.sadd("key", "a", "b", "c");
const cardinality = await redis.scard("key");
console.log(cardinality); // 3
```

----------------------------------------

TITLE: Python Example for LMOVE Redis Command
DESCRIPTION: This Python example demonstrates how to use the LMOVE command with a Redis client. It shows initial list population, moving an element from the 'source' list to the 'destination' list, and verifying the state of the lists after the operation.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/lmove.mdx

LANGUAGE: python
CODE:
```
redis.rpush("source", "one", "two", "three")
redis.lpush("destination", "four", "five", "six")

assert redis.lmove("source", "destination", "RIGHT", "LEFT") == "three"

assert redis.lrange("source", 0, -1) == ["one", "two"]
```

----------------------------------------

TITLE: Initialize Ruby Project and Add Sidekiq Gem
DESCRIPTION: Demonstrates the initial steps to set up a Ruby project using Bundler and add the Sidekiq gem as a dependency.

SOURCE: https://upstash.com/docs/redis/integrations/sidekiq.mdx

LANGUAGE: bash
CODE:
```
bundle init 
bundle add sidekiq
```

----------------------------------------

TITLE: Navigate to Project Directory
DESCRIPTION: Changes the current directory to the newly created serverless project folder, 'aws-java-counter-api', to continue with project setup.

SOURCE: https://upstash.com/docs/redis/tutorials/serverless_java_redis.mdx

LANGUAGE: shell
CODE:
```
cd aws-java-counter-api
```

----------------------------------------

TITLE: TypeScript HDEL Usage Example
DESCRIPTION: Example demonstrating how to use the HDEL command with the Upstash Redis client in TypeScript.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hdel.mdx

LANGUAGE: ts
CODE:
```
await redis.hdel(key, 'field1', 'field2');
// returns 5
```

----------------------------------------

TITLE: Create a new Next.js application
DESCRIPTION: Initializes a new Next.js project using `create-next-app` and navigates into the newly created directory.

SOURCE: https://upstash.com/docs/redis/quickstarts/ion.mdx

LANGUAGE: shell
CODE:
```
npx create-next-app@latest
cd my-app
```

----------------------------------------

TITLE: Install and Initialize Cloudflare Workers Project
DESCRIPTION: Commands to install Wrangler CLI, authenticate with Cloudflare, and generate a new Cloudflare Workers project.

SOURCE: https://upstash.com/docs/redis/tutorials/edge_leaderboard.mdx

LANGUAGE: shell
CODE:
```
npm install -g @cloudflare/wrangler
```

LANGUAGE: shell
CODE:
```
wrangler login
```

LANGUAGE: shell
CODE:
```
wrangler generate edge-leaderboard
```

----------------------------------------

TITLE: GET Command
DESCRIPTION: Get the value of a key.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
GET
```

----------------------------------------

TITLE: Create and Navigate to Project Directory
DESCRIPTION: Initializes the project directory 'counter-cdk' and navigates into it. This directory name is used by CDK for naming resources.

SOURCE: https://upstash.com/docs/redis/tutorials/api_with_cdk.mdx

LANGUAGE: shell
CODE:
```
mkdir counter-cdk && cd counter-cdk
```

----------------------------------------

TITLE: Retrieve Value from Upstash Redis with TypeScript
DESCRIPTION: This TypeScript example demonstrates how to use the `redis.get` method to retrieve a value from an Upstash Redis instance. It includes type definition for the expected data structure and shows how to handle cases where the key might not exist.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/string/get.mdx

LANGUAGE: ts
CODE:
```
type MyType = {
    a: number;
    b: string;
}
const value = await redis.get<MyType>("key");
if (!value) {
    // key doesn't exist
} else {
    // value is of type MyType
}
```

----------------------------------------

TITLE: Python Example for MSETNX
DESCRIPTION: Illustrates how to use the MSETNX command with the Upstash Redis Python client, setting multiple key-value pairs.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/string/msetnx.mdx

LANGUAGE: python
CODE:
```
redis.msetnx({
    key1: 1,
    key2: "hello",
    key3: { a: 1, b: "hello" }
})
```

----------------------------------------

TITLE: Install Flask and Upstash Redis Python Libraries
DESCRIPTION: This command installs the necessary Python packages: Flask, a micro web framework, and `upstash-redis`, the client library for interacting with Upstash Redis databases. These are essential dependencies for building the web application.

SOURCE: https://upstash.com/docs/redis/quickstarts/flask.mdx

LANGUAGE: shell
CODE:
```
pip install flask
pip install upstash-redis
```

----------------------------------------

TITLE: TypeScript Example for JSON.OBJKEYS
DESCRIPTION: An example demonstrating how to use the `redis.json.objkeys` method in TypeScript to retrieve keys from a JSON object at a specified path.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/objkeys.mdx

LANGUAGE: ts
CODE:
```
const keys = await redis.json.objkeys("key", "$.path");
```

----------------------------------------

TITLE: Python Example for SISMEMBER
DESCRIPTION: Illustrates how to use the SISMEMBER command in Python. This example first adds elements to a Redis set and then asserts the presence of a specific member using `sismember`.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/set/sismember.mdx

LANGUAGE: python
CODE:
```
redis.sadd("set", "a", "b", "c")

assert redis.sismember("set", "a") == True
```

----------------------------------------

TITLE: Separate Client Instances for Read and Write Operations
DESCRIPTION: Demonstrates a common pattern where write and read requests might originate from different client instances or API endpoints. This setup, without explicit sync token management, can lead to read-after-write consistency issues on read replicas. The example shows a write function, a read function, and their sequential invocation.

SOURCE: https://upstash.com/docs/redis/howto/readyourwrites.mdx

LANGUAGE: TypeScript
CODE:
```
export const writeRequest = async () => {
  const redis = Redis.fromEnv();
  const randomKey = nanoid();
  await redis.set(randomKey, "value");
  return randomKey;
};

export const readRequest = async (randomKey: string) => {
  const redis = Redis.fromEnv();
  const value = await redis.get(randomKey);
  return value;
};

const randomKey = await writeRequest();
await readRequest(randomKey);
```

----------------------------------------

TITLE: Redis GET Command API Reference
DESCRIPTION: This section outlines the API specification for the Redis GET command. It details the required parameters and the structure of the expected response when querying a key in Redis.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/string/get.mdx

LANGUAGE: APIDOC
CODE:
```
GET Command:
  Description: Return the value of the specified key or `null` if the key doesn't exist.
  Arguments:
    key:
      Type: string
      Required: true
      Description: The key to get.
  Response:
    Description: The value stored at the key or `null` if the key doesn't exist.
    Required: true
```

----------------------------------------

TITLE: Install upstash-redis-dump CLI tool
DESCRIPTION: Installs the `upstash-redis-dump` command-line interface globally using npm, which is required for exporting and importing Redis data.

SOURCE: https://upstash.com/docs/redis/howto/migratefromregionaltoglobal.mdx

LANGUAGE: bash
CODE:
```
npm install -g upstash-redis-dump
```

----------------------------------------

TITLE: TypeScript Example for ZREMRANGEBYRANK
DESCRIPTION: An example demonstrating how to use the ZREMRANGEBYRANK command with the Upstash Redis client in TypeScript.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/zset/zremrangebyrank.mdx

LANGUAGE: ts
CODE:
```
await redis.zremrangebyrank("key", 4, 20)
```

----------------------------------------

TITLE: Example Console Output of URL Shortener
DESCRIPTION: This snippet displays a typical console output after successfully running the `url_shortener.py` script. It shows the generated shortened URL and confirms the successful retrieval of the original URL using the short code.

SOURCE: https://upstash.com/docs/redis/tutorials/python_url_shortener.mdx

LANGUAGE: shell
CODE:
```
Shortened URL: https://short.url/0lSLFI
Original URL: https://example.com/my-very-long-url
```

----------------------------------------

TITLE: Upstash Redis SET Command Examples (TypeScript)
DESCRIPTION: Practical TypeScript examples demonstrating various ways to use the `redis.set` command, including basic key-value assignment, setting expirations, and conditional updates.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/string/set.mdx

LANGUAGE: ts
CODE:
```
await redis.set("my-key", {my: "value"});
```

LANGUAGE: ts
CODE:
```
await redis.set("my-key", {my: "value"}, {
  ex: 60
});
```

LANGUAGE: ts
CODE:
```
await redis.set("my-key", {my: "value"}, {
  xx: true
});
```

----------------------------------------

TITLE: Install Python Libraries for FastAPI and Redis
DESCRIPTION: Installs the necessary Python packages including FastAPI for the web framework, Upstash Redis for database interaction, Uvicorn for the ASGI server, and python-dotenv for environment variable management.

SOURCE: https://upstash.com/docs/redis/tutorials/python_session.mdx

LANGUAGE: Bash
CODE:
```
pip install fastapi upstash-redis uvicorn python-dotenv
```

----------------------------------------

TITLE: Example: Using RENAMENX in Python
DESCRIPTION: This Python example demonstrates the usage of the `renamenx` command with a Redis client. It shows scenarios where the rename operation succeeds and fails based on the existence of the destination key, and verifies the state of keys after the operations.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/renamenx.mdx

LANGUAGE: python
CODE:
```
redis.set("key1", "Hello")
redis.set("key2", "World")

# Rename failed because "key2" already exists.
assert redis.renamenx("key1", "key2") == False

assert redis.renamenx("key1", "key3") == True

assert redis.get("key1") is None
assert redis.get("key2") == "World"
assert redis.get("key3") == "Hello"
```

----------------------------------------

TITLE: Python Example for SDIFFSTORE
DESCRIPTION: Demonstrates how to use the `sdiffstore` command with a Python Redis client. It shows adding elements to sets, performing the difference operation, and verifying the result in the destination set.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/set/sdiffstore.mdx

LANGUAGE: python
CODE:
```
redis.sadd("key1", "a", "b", "c")

redis.sadd("key2", "c", "d", "e")

# Store the result in a new set
assert redis.sdiffstore("res", "key1", "key2") == 2

assert redis.smembers("set") == {"a", "b"}
```

----------------------------------------

TITLE: Python Example for JSON.RESP Command
DESCRIPTION: A Python code example demonstrating how to call the JSON.RESP command using a Redis client to retrieve a value from a JSON entry.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/resp.mdx

LANGUAGE: python
CODE:
```
resp = redis.json.resp("key", "$.path")
```

----------------------------------------

TITLE: Python Example for HVALS Command
DESCRIPTION: Demonstrates how to use the `hset` method to populate a hash and then retrieve all its values using the `hvals` method with the Upstash Redis client in Python, including an assertion for verification.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hvals.mdx

LANGUAGE: python
CODE:
```
redis.hset("myhash", values={
  "field1": "Hello",
  "field2": "World"
})

assert redis.hvals("myhash") == ["Hello", "World"]
```

----------------------------------------

TITLE: Install BullMQ and Upstash Redis Packages
DESCRIPTION: This command installs the necessary npm packages, 'bullmq' for the queue library and 'upstash-redis' for the Redis client, required to use BullMQ with Upstash Redis.

SOURCE: https://upstash.com/docs/redis/integrations/bullmq.mdx

LANGUAGE: bash
CODE:
```
npm install bullmq upstash-redis
```

----------------------------------------

TITLE: TypeScript Example for SISMEMBER
DESCRIPTION: An example demonstrating how to use the SISMEMBER command with the `upstash-redis` client in TypeScript, including adding members to a set and checking for existence.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/set/sismember.mdx

LANGUAGE: ts
CODE:
```
await redis.sadd("set", "a", "b", "c"); 
const isMember =  await redis.sismember("set", "a");
console.log(isMember); // 1
```

----------------------------------------

TITLE: TypeScript Example for HLEN Command
DESCRIPTION: A TypeScript example demonstrating how to use the HLEN command with Upstash Redis. It shows setting a hash and then retrieving the number of fields within it.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hlen.mdx

LANGUAGE: ts
CODE:
```
await redis.hset("key", {
  id: 1,
  username: "chronark",
  });
const fields = await redis.hlen("key");
console.log(fields); // 2
```

----------------------------------------

TITLE: TypeScript Example for INCRBY
DESCRIPTION: An example demonstrating how to use the INCRBY command with a TypeScript Redis client, showing a set operation followed by an increment.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/string/incrby.mdx

LANGUAGE: ts
CODE:
```
await redis.set("key", 6);
await redis.incrby("key", 4);
// returns 10
```

----------------------------------------

TITLE: Create Django Project and App
DESCRIPTION: This sequence of commands initializes a new Django project named `myproject` and then creates a new application within it called `myapp`. This sets up the foundational directory structure required for a Django web application, separating project-wide settings from application-specific logic.

SOURCE: https://upstash.com/docs/redis/quickstarts/django.mdx

LANGUAGE: shell
CODE:
```
django-admin startproject myproject
cd myproject
python manage.py startapp myapp
```

----------------------------------------

TITLE: Install FastAPI and Upstash Redis Client
DESCRIPTION: Installs the necessary Python packages including FastAPI, the Upstash Redis client library, and Uvicorn, which is an ASGI server required to run the FastAPI application.

SOURCE: https://upstash.com/docs/redis/tutorials/python_fastapi_caching.mdx

LANGUAGE: shell
CODE:
```
pip install fastapi upstash-redis uvicorn[standard]
```

----------------------------------------

TITLE: Set Up Conda Environment and Install Dependencies
DESCRIPTION: These commands create a new Conda environment named `vercel-django` with Python 3.12, activate it, and then install the project dependencies listed in `requirements.txt` using pip.

SOURCE: https://upstash.com/docs/redis/quickstarts/vercel-python-runtime.mdx

LANGUAGE: shell
CODE:
```
conda create --name vercel-django python=3.12
conda activate vercel-django
pip install -r requirements.txt
```

----------------------------------------

TITLE: Elixir with Redis
DESCRIPTION: This article provides a tutorial on how to use Redis within Elixir applications, covering common patterns and best practices.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: elixir
CODE:
```
defmodule MyApp.Repo do
  use Redis

  def get_user(id) do
    Redis.get("user:#{id}")
  end

  def set_user(id, user_data) do
    Redis.set("user:#{id}", Jason.encode!(user_data))
  end
end
```

----------------------------------------

TITLE: Build a Leaderboard API at Edge Using Cloudflare Workers and Redis
DESCRIPTION: Details building a leaderboard API at the edge using Cloudflare Workers and Upstash Redis. This example showcases creating performant, distributed leaderboards.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: jsx
CODE:
```
<TagFilters.Item
    externalLink
    type="Article"
    tags={["Cloudflare Workers"]
    url="https://docs.upstash.com/redis/tutorials/edge_leaderboard">
    Build a Leaderboard API at Edge Using Cloudflare Workers and Redis
  </TagFilters.Item>
```

----------------------------------------

TITLE: Python PEXPIRE Usage Examples
DESCRIPTION: Examples demonstrating how to use the PEXPIRE command in Python, showing both setting a timeout with a raw millisecond value and using a datetime.timedelta object.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/pexpire.mdx

LANGUAGE: python
CODE:
```
# With milliseconds
redis.set("mykey", "Hello")
redis.expire("mykey", 500)

# With a timedelta
redis.set("mykey", "Hello")
redis.expire("mykey", datetime.timedelta(milliseconds=500))
```

----------------------------------------

TITLE: Install Laravel CLI globally
DESCRIPTION: Installs the Laravel command-line interface globally using Composer. This allows developers to easily create and manage new Laravel projects from their terminal.

SOURCE: https://upstash.com/docs/redis/quickstarts/laravel.mdx

LANGUAGE: shell
CODE:
```
composer global require laravel/installer
```

----------------------------------------

TITLE: Python Example for JSON.MGET
DESCRIPTION: An example demonstrating how to use the JSON.MGET command with a Python Redis client to retrieve values from multiple JSON documents at a specified path.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/mget.mdx

LANGUAGE: python
CODE:
```
values = redis.json.mget(["key1", "key2"],  "$.path.to.somewhere")
```

----------------------------------------

TITLE: TypeScript Example for JSON.ARRAPPEND
DESCRIPTION: An example demonstrating how to use the JSON.ARRAPPEND command with a TypeScript Redis client to append a value to a JSON array.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/arrappend.mdx

LANGUAGE: ts
CODE:
```
await redis.json.arrappend("key", "$.path.to.array", "a");
```

----------------------------------------

TITLE: Python Examples for Redis SET Command
DESCRIPTION: Illustrative Python code snippets demonstrating various ways to use the Redis `SET` command, including basic usage, conditional setting (NX/XX), setting expirations, and retrieving old values.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/string/set.mdx

LANGUAGE: python
CODE:
```
assert redis.set("key", "value") == True

assert redis.get("key") == "value"
```

LANGUAGE: python
CODE:
```
# Only set the key if it does not already exist.
assert redis.set("key", "value", nx=True) == False

# Only set the key if it already exists.
assert redis.set("key", "value", xx=True) == True
```

LANGUAGE: python
CODE:
```
# Set the key to expire in 10 seconds.
assert redis.set("key", "value", ex=10) == True

# Set the key to expire in 10000 milliseconds.
assert redis.set("key", "value", px=10000) == True
```

LANGUAGE: python
CODE:
```
# Get the old value stored at the key.
assert redis.set("key", "new-value", get=True) == "old-value"
```

----------------------------------------

TITLE: Serverless Redis Caching for Strapi
DESCRIPTION: Explains how to implement serverless Redis caching for Strapi, a headless CMS. This example focuses on improving performance by caching API responses with Upstash Redis.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: jsx
CODE:
```
<TagFilters.Item
    externalLink
    type="Article"
    tags={["Strapi"]
    url="https://blog.upstash.com/redis-strapi">
    Serverless Redis Caching for Strapi
  </TagFilters.Item>
```

----------------------------------------

TITLE: Python Example for DECRBY Command
DESCRIPTION: Illustrates how to use the DECRBY command with a Python Redis client. This example sets an initial value for a key and then decrements it, asserting the final result.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/string/decrby.mdx

LANGUAGE: Python
CODE:
```
redis.set("key", 6)

assert redis.decrby("key", 4) == 2
```

----------------------------------------

TITLE: Python Example for RPUSH Command
DESCRIPTION: Illustrates how to use the RPUSH command in Python to add elements to a Redis list and verify the list's contents.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/rpush.mdx

LANGUAGE: python
CODE:
```
assert redis.rpush("mylist", "one", "two", "three") == 3

assert lrange("mylist", 0, -1) == ["one", "two", "three"]
```

----------------------------------------

TITLE: Python Example for Redis RANDOMKEY Command
DESCRIPTION: This Python code snippet demonstrates how to use the Redis `randomkey()` method. It illustrates scenarios where the database is initially empty, and then shows its behavior after keys have been set, asserting that a key is returned.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/randomkey.mdx

LANGUAGE: py
CODE:
```
assert redis.randomkey() is None

redis.set("key1", "Hello")
redis.set("key2", "World")

assert redis.randomkey() is not None
```

----------------------------------------

TITLE: Run the SST application locally
DESCRIPTION: Starts the SST development server, making the Next.js application accessible locally for testing and development.

SOURCE: https://upstash.com/docs/redis/quickstarts/ion.mdx

LANGUAGE: shell
CODE:
```
npm run dev
```

----------------------------------------

TITLE: Use Redis in Fastly Compute
DESCRIPTION: Illustrates how to use Upstash Redis within Fastly Compute@Edge. This example focuses on leveraging Redis for edge computing use cases.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: jsx
CODE:
```
<TagFilters.Item
    externalLink
    type="Article"
    tags={["Fastly Compute", "upstash-redis", "REST-API"]
    url="https://blog.upstash.com/fastly-compute-edge-with-redis">
    Use Redis in Fastly Compute
  </TagFilters.Item>
```

----------------------------------------

TITLE: TypeScript Example for HEXISTS
DESCRIPTION: An example demonstrating how to use the `hexists` method with an Upstash Redis client in TypeScript, including a preceding `hset` operation to set up the data.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hexists.mdx

LANGUAGE: typescript
CODE:
```
await redis.hset("key", "field", "value");
const exists = await redis.hexists("key", "field");

console.log(exists); // 1
```

----------------------------------------

TITLE: Upstash Redis FLUSHALL Command Usage Examples
DESCRIPTION: Examples demonstrating how to use the FLUSHALL command in TypeScript for Upstash Redis, covering both synchronous and asynchronous execution.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/server/flushall.mdx

LANGUAGE: ts
CODE:
```
await redis.flushall();
```

LANGUAGE: ts
CODE:
```
await redis.flushall({async: true})
```

----------------------------------------

TITLE: Run Nuxt Development Server
DESCRIPTION: Command to start the Nuxt.js application in development mode, making it accessible locally for testing and development.

SOURCE: https://upstash.com/docs/redis/tutorials/nuxtjs_with_redis.mdx

LANGUAGE: bash
CODE:
```
npm run dev
```

----------------------------------------

TITLE: Define Dockerfile for Application Container
DESCRIPTION: Specifies the instructions for building a Docker image, including copying application source code into the container and defining the command to execute when the container starts.

SOURCE: https://upstash.com/docs/redis/tutorials/cloud_run_sessions.mdx

LANGUAGE: Dockerfile
CODE:
```
COPY . ./
CMD [ "npm", "start" ]
```

----------------------------------------

TITLE: Configure Upstash Redis Credentials in Cloudflare Worker
DESCRIPTION: Appends the Upstash Redis REST API URL and token as environment variables within the `wrangler.toml` configuration file for a Cloudflare Worker project. These variables enable the Worker to securely connect to the Redis database.

SOURCE: https://upstash.com/docs/redis/howto/getstartedcloudflareworkers.mdx

LANGUAGE: toml
CODE:
```
# wrangler.toml

# existing config

[vars]
UPSTASH_REDIS_REST_TOKEN = "AX_sASQgODM5ZjExZGEtMmI3Mi00Mjcwk3NDIxMmEwNmNkYjVmOGVmZTk5MzQ="
UPSTASH_REDIS_REST_URL = "https://us1-merry-macaque-31458.upstash.io/"
```

----------------------------------------

TITLE: Fastly Service Deployment and Backend Configuration
DESCRIPTION: This command publishes the Fastly Compute service. It guides the user through creating a new service, defining a domain, and configuring a backend for Upstash Redis, including its hostname and port, to enable communication between the Fastly service and the Redis database.

SOURCE: https://upstash.com/docs/redis/quickstarts/fastlycompute.mdx

LANGUAGE: shell
CODE:
```
> fastly compute publish
✓ Initializing...
✓ Verifying package manifest...
✓ Verifying local javascript toolchain...
✓ Building package using javascript toolchain...
✓ Creating package archive...

SUCCESS: Built package 'fastly-upstash' (pkg/fastly-upstash.tar.gz)


There is no Fastly service associated with this package. To connect to an existing service
add the Service ID to the fastly.toml file, otherwise follow the prompts to create a
service now.

Press ^C at any time to quit.

Create new service: [y/N] y

✓ Initializing...
✓ Creating service...

Domain: [supposedly-included-corgi.edgecompute.app]

Backend (hostname or IP address, or leave blank to stop adding backends): global-concise-scorpion-30984.upstash.io
Backend port number: [80] 443
Backend name: [backend_1] upstash

Backend (hostname or IP address, or leave blank to stop adding backends):

✓ Creating domain 'supposedly-smart-corgi.edgecompute.app'...
✓ Creating backend 'upstash' (host: global-concise-scorpion-30984.upstash.io, port: 443)...
✓ Uploading package...
✓ Activating version...
```

----------------------------------------

TITLE: Retrieve Upstash Redis Responses in RESP2 Format
DESCRIPTION: Demonstrates how to use `curl` to send commands to Upstash Redis and receive responses in RESP2 binary format by setting the `Upstash-Response-Format` header to `resp2`. Shows examples for SET and GET commands and their respective RESP2 outputs.

SOURCE: https://upstash.com/docs/redis/features/restapi.mdx

LANGUAGE: shell
CODE:
```
curl https://us1-merry-cat-32748.upstash.io/SET/foo/bar \
 -H "Authorization: Bearer 2553feg6a2d9842h2a0gcdb5f8efe9934" \
 -H "Upstash-Reponse-Format: resp2"

# +OK\r\n
curl https://us1-merry-cat-32748.upstash.io/GET/foo \
 -H "Authorization: Bearer 2553feg6a2d9842h2a0gcdb5f8efe9934" \
 -H "Upstash-Reponse-Format: resp2"

# $3\r\nbar\r\n
```

----------------------------------------

TITLE: Python XADD with Trimming Example
DESCRIPTION: Illustrates how to use the XADD command in Python with stream trimming options. This example uses MAXLEN trimming to keep the stream size below a specified threshold.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/stream/xadd.mdx

LANGUAGE: py
CODE:
```
redis.xadd(key, "*", { name: "John Doe", age: 30 }, {
  trim: {
    type: "MAXLEN",
    threshold: 1000,
    comparison: "=",
  },
})
```

----------------------------------------

TITLE: Configure Upstash Ratelimit Plugin in Strapi
DESCRIPTION: Example configuration for the Upstash Ratelimit plugin in Strapi, demonstrating how to enable it, resolve its path, and set up rate limiting strategies with specific methods, paths, algorithms (e.g., fixed-window), tokens, window duration, and a custom prefix.

SOURCE: https://upstash.com/docs/redis/integrations/ratelimit/strapi/getting-started.mdx

LANGUAGE: typescript
CODE:
```
export default () => ({
  "strapi-plugin-upstash-ratelimit": {
    enabled: true,
    resolve: "./src/plugins/strapi-plugin-upstash-ratelimit",
    config: {
      enabled: true,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
      url: process.env.UPSTASH_REDIS_REST_URL,
      strategy: [
        {
          methods: ["GET", "POST"],
          path: "*",
          limiter: {
            algorithm: "fixed-window",
            tokens: 10,
            window: "20s"
          }
        }
      ],
      prefix: "@strapi"
    }
  }
});
```

LANGUAGE: javascript
CODE:
```
module.exports = () => ({
  "strapi-plugin-upstash-ratelimit": {
    enabled: true,
    resolve: "./src/plugins/strapi-plugin-upstash-ratelimit",
    config: {
      enabled: true,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
      url: process.env.UPSTASH_REDIS_REST_URL,
      strategy: [
        {
          methods: ["GET", "POST"],
          path: "*",
          limiter: {
            algorithm: "fixed-window",
            tokens: 10,
            window: "20s"
          }
        }
      ],
      prefix: "@strapi"
    }
  }
});
```

----------------------------------------

TITLE: Create React Application
DESCRIPTION: Command to initialize a new React application using `create-react-app` for the serverless notification API project.

SOURCE: https://upstash.com/docs/redis/tutorials/notification.mdx

LANGUAGE: shell
CODE:
```
npx create-react-app serverless-notification-api
```

----------------------------------------

TITLE: Python Example for ZSCORE
DESCRIPTION: Demonstrates how to use the ZSCORE command in Python. This example first adds members to a sorted set and then asserts the score of a specific member.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zscore.mdx

LANGUAGE: py
CODE:
```
redis.zadd("myset", {"a": 1, "b": 2, "c": 3})

assert redis.zscore("myset", "a") == 1
```

----------------------------------------

TITLE: Set Location-Based Greetings in Upstash Redis
DESCRIPTION: Connects to the Upstash Redis database using `redis-cli` and sets greeting messages for various country codes (GB, US, TR, DE). These greetings are later retrieved by the Cloudflare Worker based on the client's geographical location.

SOURCE: https://upstash.com/docs/redis/howto/getstartedcloudflareworkers.mdx

LANGUAGE: shell
CODE:
```
usw1-selected-termite-30690.upstash.io:30690> set GB "Ey up?"
OK
usw1-selected-termite-30690.upstash.io:30690> set US "Yo, what’s up?"
OK
usw1-selected-termite-30690.upstash.io:30690> set TR "Naber dostum?"
OK
usw1-selected-termite-30690.upstash.io:30690> set DE "Was ist los?"
```

----------------------------------------

TITLE: Deploy AWS SAM Application to Cloud (Guided)
DESCRIPTION: Initiates a guided deployment process for the AWS SAM application to your AWS account. This command prompts for stack name, AWS region, and confirms changes before deploying the Lambda function and API Gateway endpoint.

SOURCE: https://upstash.com/docs/redis/tutorials/goapi.mdx

LANGUAGE: Shell
CODE:
```
sam deploy --guided
```

----------------------------------------

TITLE: Python Example for JSON.NUMMULTBY
DESCRIPTION: A practical Python code example demonstrating how to invoke the `JSON.NUMMULTBY` command using a Redis client to multiply a specific numeric value within a JSON document.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/nummultby.mdx

LANGUAGE: Python
CODE:
```
newValue = redis.json.nummultby("key", "$.path.to.value", 2)
```

----------------------------------------

TITLE: Implement Location-Aware Greeting Worker with Upstash Redis
DESCRIPTION: Defines a Cloudflare Worker in JavaScript that leverages the `@upstash/redis/cloudflare` library. It extracts the client's country from the `cf-ipcountry` header, fetches a corresponding greeting from Upstash Redis, and returns it as a response. A default 'Hello!' is returned if no country-specific greeting is found.

SOURCE: https://upstash.com/docs/redis/howto/getstartedcloudflareworkers.mdx

LANGUAGE: javascript
CODE:
```
// src/index.js

import { Redis } from "@upstash/redis/cloudflare";

export default {
  async fetch(request, env) {
    const redis = Redis.fromEnv(env);

    const country = request.headers.get("cf-ipcountry");
    if (country) {
      const greeting = await redis.get(country);
      if (greeting) {
        return new Response(greeting);
      }
    }

    return new Response("Hello!");
  }
}
```

----------------------------------------

TITLE: Initialize AWS SAM Project
DESCRIPTION: This command interactively initializes a new AWS SAM application, guiding the user through selecting a template, runtime, and optional features like X-Ray tracing or CloudWatch Application Insights. It sets up the basic project structure for a serverless application.

SOURCE: https://upstash.com/docs/redis/tutorials/using_aws_sam.mdx

LANGUAGE: shell
CODE:
```
➜  tutorials > ✗ sam init
Which template source would you like to use?
	1 - AWS Quick Start Templates
	2 - Custom Template Location
Choice: 1

Choose an AWS Quick Start application template
	1 - Hello World Example
	2 - Data processing
	3 - Hello World Example with Powertools for AWS Lambda
	4 - Multi-step workflow
	5 - Scheduled task
	6 - Standalone function
	7 - Serverless API
	8 - Infrastructure event management
	9 - Lambda Response Streaming
	10 - Serverless Connector Hello World Example
	11 - Multi-step workflow with Connectors
	12 - GraphQLApi Hello World Example
	13 - Full Stack
	14 - Lambda EFS example
	15 - DynamoDB Example
	16 - Machine Learning
Template: 1

Use the most popular runtime and package type? (Python and zip) [y/N]: y

Would you like to enable X-Ray tracing on the function(s) in your application?  [y/N]: N

Would you like to enable monitoring using CloudWatch Application Insights?
For more info, please view https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html [y/N]: N

Would you like to set Structured Logging in JSON format on your Lambda functions?  [y/N]: N
```

----------------------------------------

TITLE: Python JSON.ARRPOP Example
DESCRIPTION: An example demonstrating how to use `redis.json.arrpop` in Python to remove and retrieve the last element from a specified JSON array path.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/arrpop.mdx

LANGUAGE: py
CODE:
```
element = redis.json.arrpop("key", "$.path.to.array")
```

----------------------------------------

TITLE: TypeScript Example for SCRIPT EXISTS
DESCRIPTION: An example demonstrating how to use the `scriptExists` method with the Upstash Redis client in TypeScript, showing input and expected output.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/scripts/script_exists.mdx

LANGUAGE: ts
CODE:
```
await redis.scriptExists("<sha1>", "<sha2>")

// Returns 1 
// [1, 0]
```

----------------------------------------

TITLE: Python JSON.ARRPOP First Element Example
DESCRIPTION: An example demonstrating how to use `redis.json.arrpop` in Python to remove and retrieve the first element from a specified JSON array path by providing an explicit index.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/arrpop.mdx

LANGUAGE: py
CODE:
```
firstElement = redis.json.arrpop("key", "$.path.to.array", 0)
```

----------------------------------------

TITLE: Scan a Redis Set with SSCAN in TypeScript
DESCRIPTION: This example demonstrates how to use the `SSCAN` command with Upstash Redis in TypeScript to scan a set, filter members using a glob pattern, and retrieve results. It shows initial setup with `sadd`, then calling `sscan` with a cursor and a `match` option, and finally logging the new cursor and the retrieved fields.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/set/sscan.mdx

LANGUAGE: TypeScript
CODE:
```
await redis.sadd("key", "a", "ab","b", "c");
const [newCursor, fields] = await redis.sscan("key", 0, { match: "a*"});
console.log(newCursor); // likely `0` since this is a very small set
console.log(fields); // ["a", "ab"]
```

----------------------------------------

TITLE: TypeScript JSON.GET Usage Examples
DESCRIPTION: Examples demonstrating how to retrieve a value from a JSON document using `redis.json.get` in TypeScript, covering basic path-based retrieval and advanced usage with formatting options.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/get.mdx

LANGUAGE: ts
CODE:
```
const value = await redis.json.get("key", "$.path.to.somewhere");
```

LANGUAGE: ts
CODE:
```
const value = await redis.json.get("key", {
    indent: "  ",
    newline: "\n",
    space: " "
}, "$.path.to.somewhere");
```

----------------------------------------

TITLE: Install Upstash Redis Client Library
DESCRIPTION: Installs the '@upstash/redis' npm package, which is required for interacting with the Upstash Redis database from the AWS Lambda function.

SOURCE: https://upstash.com/docs/redis/tutorials/api_with_cdk.mdx

LANGUAGE: shell
CODE:
```
npm install @upstash/redis
```

----------------------------------------

TITLE: Global Cache for Netlify Graph with Upstash Redis
DESCRIPTION: Illustrates how to implement a global cache for Netlify Graph using Upstash Redis. This example focuses on optimizing API performance for Netlify Graph deployments.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: jsx
CODE:
```
<TagFilters.Item
    externalLink
    type="Article"
    tags={["GraphQL", "Netlify"]
    url="https://blog.upstash.com/netlify-graph-upstash">
    Global Cache for Netlify Graph with Upstash Redis
  </TagFilters.Item>
```

----------------------------------------

TITLE: Python Example for HGET Usage
DESCRIPTION: Demonstrates how to use the HGET command in Python with a Redis client. This example shows setting a hash field and then retrieving both an existing field and a non-existing field, asserting the expected outcomes for each case.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hget.mdx

LANGUAGE: python
CODE:
```
redis.hset("myhash", "field1", "Hello")

assert redis.hget("myhash", "field1") == "Hello"
assert redis.hget("myhash", "field2") is None
```

----------------------------------------

TITLE: Install DrizzleORM Cache Package
DESCRIPTION: Instructions to install the DrizzleORM cache package, which provides the necessary helper functions for connecting with Upstash Redis.

SOURCE: https://upstash.com/docs/redis/integrations/drizzle.mdx

LANGUAGE: bash
CODE:
```
npm install drizzle-orm@cache
```

----------------------------------------

TITLE: Install Laravel API Scaffolding
DESCRIPTION: Artisan command to install the necessary scaffolding for Laravel's API features. This command sets up the basic structure and configurations required for building an API.

SOURCE: https://upstash.com/docs/redis/tutorials/laravel_caching.mdx

LANGUAGE: shell
CODE:
```
php artisan install:api
```

----------------------------------------

TITLE: Python Example for Redis GETDEL Command
DESCRIPTION: Demonstrates the usage of the `GETDEL` command in Python, showing how it retrieves a key's value and then deletes the key, verifying its subsequent absence.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/string/getdel.mdx

LANGUAGE: py
CODE:
```
redis.set("key", "value")

assert redis.getdel("key") == "value"

assert redis.get("key") == None
```

----------------------------------------

TITLE: Using Upstash Redis as a Session Store for Remix
DESCRIPTION: Details how to use Upstash Redis as a session store for Remix applications. This example focuses on managing user sessions securely and efficiently with Redis.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: jsx
CODE:
```
<TagFilters.Item
    externalLink
    type="Article"
    tags={["Remix", "Node.js"]
    url="https://blog.upstash.com/redis-session-remix">
    Using Upstash Redis as a Session Store for Remix
  </TagFilters.Item>
```

----------------------------------------

TITLE: Use Redis in Cloudflare Workers
DESCRIPTION: Provides instructions on using Upstash Redis within Cloudflare Workers. This example covers integrating Redis for serverless functions at the edge.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: jsx
CODE:
```
<TagFilters.Item
    externalLink
    type="Article"
    tags={["Cloudflare Workers", "upstash-redis", "REST-API"]
    url="https://docs.upstash.com/redis/tutorials/cloudflare_workers_with_redis">
    Use Redis in Cloudflare Workers
  </TagFilters.Item>
```

----------------------------------------

TITLE: Next.js Authentication with NextAuth and Serverless Redis
DESCRIPTION: Shows how to integrate Next.js authentication using NextAuth and Upstash Redis. This example covers secure user authentication in Next.js applications with Redis.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: jsx
CODE:
```
<TagFilters.Item
    externalLink
    type="Article"
    tags={["Next.js", "NextAuth"]
    url="https://blog.upstash.com/next-auth-serverless-redis">
    Next.js Authentication with NextAuth and Serverless Redis
  </TagFilters.Item>
```

----------------------------------------

TITLE: Using Serverless Framework with AWS Lambda
DESCRIPTION: Integrate Upstash Redis into your projects using the Serverless Framework with AWS Lambda. This tutorial covers deployment and configuration best practices.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: AWS Lambda
CODE:
```
console.log('This is a placeholder for Serverless Framework code.');
```

----------------------------------------

TITLE: Google Cloud Function: ioredis Redis Counter
DESCRIPTION: This JavaScript code defines a Google Cloud Function (`helloGET`) that connects to an Upstash Redis instance using the `ioredis` client. It increments a 'counter' key in Redis with each invocation and returns the updated value as a page view count. Requires Redis connection details (endpoint, password, port).

SOURCE: https://upstash.com/docs/redis/howto/getstartedgooglecloudfunctions.mdx

LANGUAGE: javascript
CODE:
```
var Redis = require("ioredis");

if (typeof client === "undefined") {
  var client = new Redis("rediss://:YOUR_PASSWORD@YOUR_ENDPOINT:YOUR_PORT");
}

exports.helloGET = async (req, res) => {
  let count = await client.incr("counter");
  res.send("Page view:" + count);
};
```

----------------------------------------

TITLE: Python Example for Redis TYPE Command Usage
DESCRIPTION: Illustrates how to use the `type` method with the Upstash Redis client in Python. Examples include checking the type of a string, a list, and a non-existent key, demonstrating the expected return values.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/type.mdx

LANGUAGE: python
CODE:
```
redis.set("key1", "Hello")

assert redis.type("key1") == "string"

redis.lpush("key2", "Hello")

assert redis.type("key2") == "list"

assert redis.type("non-existent-key") == "none"
```

----------------------------------------

TITLE: Python Example for JSON.MSET
DESCRIPTION: Demonstrates how to use the JSON.MSET command with the Python Redis client, setting multiple JSON values across different keys and paths.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/mset.mdx

LANGUAGE: python
CODE:
```
redis.json.mset([(key, "$.path", value), (key2, "$.path2", value2)])
```

----------------------------------------

TITLE: Node.js AWS Lambda Function for Upstash Redis
DESCRIPTION: This Node.js code defines an AWS Lambda handler that connects to an Upstash Redis database using `ioredis`. It demonstrates setting a key-value pair ('foo'/'bar'), retrieving it, and returning the result in a JSON response. Users must replace the placeholder Redis URL with their actual Upstash Redis connection string.

SOURCE: https://upstash.com/docs/redis/howto/getstartedawslambda.mdx

LANGUAGE: javascript
CODE:
```
var Redis = require("ioredis");

if (typeof client === "undefined") {
  var client = new Redis("rediss://:YOUR_PASSWORD@YOUR_ENDPOINT:YOUR_PORT");
}
exports.handler = async (event) => {
  await client.set("foo", "bar");
  let result = await client.get("foo");
  let response = {
    statusCode: 200,
    body: JSON.stringify({
      result: result,
    }),
  };
  return response;
};
```

----------------------------------------

TITLE: Install Upstash Redis Client
DESCRIPTION: Installs the `@upstash/redis` client library into the `greetings-cloudflare` project directory using npm, enabling interaction with Upstash Redis.

SOURCE: https://upstash.com/docs/redis/tutorials/cloudflare_workers_with_redis.mdx

LANGUAGE: shell
CODE:
```
cd greetings-cloudflare
npm install @upstash/redis
```

----------------------------------------

TITLE: TypeScript Examples for LPOS Command
DESCRIPTION: Demonstrates various usages of the LPOS command in TypeScript, including basic usage, using the 'rank' option, and using the 'count' option.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/lpos.mdx

LANGUAGE: ts
CODE:
```
await redis.rpush("key", "a", "b", "c"); 
const index = await redis.lpos("key", "b");
console.log(index); // 1
```

LANGUAGE: ts
CODE:
```
await redis.rpush("key", "a", "b", "c", "b"); 
const index = await redis.lpos("key", "b", { rank: 2 });
console.log(index); // 3
```

LANGUAGE: ts
CODE:
```
await redis.rpush("key", "a", "b", "b");
const positions = await redis.lpos("key", "b", { count: 2 });
console.log(positions); // [1, 2]
```

----------------------------------------

TITLE: JSON.ARRPOP API Reference
DESCRIPTION: Detailed documentation for the `JSON.ARRPOP` command, outlining its arguments, their types, default values, and the structure of its response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/arrpop.mdx

LANGUAGE: APIDOC
CODE:
```
JSON.ARRPOP(key: str, path: str = "$", index: int = -1)
  key (str, required): The key of the json entry.
  path (str, default: "$"): The path of the array.
  index (int, default: -1): The index of the element to pop.

Returns: List[TValue | null] (required)
  Description: The popped element or null if the array is empty.
```

----------------------------------------

TITLE: Install Python Libraries for Web Scraping and Redis
DESCRIPTION: This command installs the required Python libraries: `requests` for HTTP requests, `upstash-redis` for Redis interaction, and `python-dotenv` for loading environment variables. The `threading` module is part of Python's standard library.

SOURCE: https://upstash.com/docs/redis/tutorials/python_multithreading.mdx

LANGUAGE: bash
CODE:
```
pip install threading requests upstash-redis python-dotenv
```

----------------------------------------

TITLE: Install FastAPI and Upstash Rate Limiting Dependencies
DESCRIPTION: This command installs the necessary Python packages for building a FastAPI application with Upstash Redis for rate limiting, including the ASGI server Uvicorn.

SOURCE: https://upstash.com/docs/redis/tutorials/python_rate_limiting.mdx

LANGUAGE: shell
CODE:
```
pip install fastapi upstash-redis upstash-ratelimit uvicorn[standard]
```

----------------------------------------

TITLE: Python Example for Redis LSET Usage
DESCRIPTION: A Python code example demonstrating how to use the LSET command with a Redis client. It illustrates pushing elements to a list, setting a value at a valid index, and verifying the list content, as well as handling attempts to set values at out-of-range indices.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/lset.mdx

LANGUAGE: python
CODE:
```
redis.rpush("mylist", "one", "two", "three")

assert redis.lset("mylist", 1, "Hello") == True

assert redis.lrange("mylist", 0, -1) == ["one", "Hello", "three"]

assert redis.lset("mylist", 5, "Hello") == False

assert redis.lrange("mylist", 0, -1) == ["one", "Hello", "three"]
```

----------------------------------------

TITLE: Session Management on Google Cloud Run with Serverless Redis
DESCRIPTION: Details session management on Google Cloud Run using Upstash Redis. This example focuses on implementing robust session handling for applications deployed on Google Cloud.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: jsx
CODE:
```
<TagFilters.Item
    externalLink
    type="Article"
    tags={["Google Cloud"]
    url="https://docs.upstash.com/redis/tutorials/cloud_run_sessions">
    Session Management on Google Cloud Run with Serverless Redis
  </TagFilters.Item>
```

----------------------------------------

TITLE: TypeScript Example for JSON.STRAPPEND
DESCRIPTION: An example demonstrating how to use the JSON.STRAPPEND command with the Upstash Redis client in TypeScript, appending a string value to a specified path within a JSON key.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/strappend.mdx

LANGUAGE: ts
CODE:
```
await redis.json.strappend("key", "$.path.to.str", "abc");
```

----------------------------------------

TITLE: Python Example for ZRANDMEMBER Redis Command
DESCRIPTION: Illustrative Python code demonstrating how to use the ZRANDMEMBER command with the Upstash Redis client, showing examples for retrieving a single random member and multiple random members from a sorted set.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zrandmember.mdx

LANGUAGE: python
CODE:
```
redis.zadd("myset", {"one": 1, "two": 2, "three": 3})

# "one"
redis.zrandmember("myset")

# ["one", "three"]
redis.zrandmember("myset", 2)
```

----------------------------------------

TITLE: Copy .env file for Supabase Function
DESCRIPTION: Copies the example environment file to the active .env file for the Supabase function, preparing it for configuration with Redis credentials.

SOURCE: https://upstash.com/docs/redis/quickstarts/supabase.mdx

LANGUAGE: shell
CODE:
```
cp supabase/functions/upstash-redis-counter/.env.example supabase/functions/upstash-redis-counter/.env
```

----------------------------------------

TITLE: Ensuring Ratelimit Operations Complete in Serverless Environments
DESCRIPTION: This snippet demonstrates how to use the `pending` promise returned by `ratelimit.limit()` in conjunction with `context.waitUntil` to ensure that asynchronous background operations (like multi-region synchronization or analytics sending) initiated by the ratelimiter complete before the serverless function's runtime ends. This is crucial for reliable rate limiting in environments like Cloudflare Workers or Vercel Edge.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted.mdx

LANGUAGE: ts
CODE:
```
const { pending } = await ratelimit.limit("id");
context.waitUntil(pending);
```

----------------------------------------

TITLE: RPUSHX Command Usage Example (Python)
DESCRIPTION: Illustrates the usage of the RPUSHX command in Python, demonstrating how to add elements to an existing list and the behavior when attempting to push to a non-existent key, which results in a return value of 0.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/rpushx.mdx

LANGUAGE: python
CODE:
```
assert redis.rpushx("mylist", "one", "two", "three") == 3

assert lrange("mylist", 0, -1) == ["one", "two", "three"]

# Non existing key
assert redis.rpushx("non-existent-list", "one") == 0
```

----------------------------------------

TITLE: Install Node.js Dependencies for Redis and Histogram
DESCRIPTION: Commands to install the necessary Node.js packages: `ioredis` for interacting with the Redis database and `hdr-histogram-js` for building and manipulating histogram data. These libraries are crucial for the API's functionality.

SOURCE: https://upstash.com/docs/redis/tutorials/histogram.mdx

LANGUAGE: text
CODE:
```
npm install ioredis

npm install hdr-histogram-js
```

----------------------------------------

TITLE: Python Example for SMOVE Command
DESCRIPTION: Demonstrates the usage of the SMOVE command in Python using a Redis client. This example shows how to add members to sets, move a member from a source set to a destination set, and then verify the state of both sets after the operation.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/set/smove.mdx

LANGUAGE: python
CODE:
```
redis.sadd("src", "one", "two", "three")

redis.sadd("dest", "four")

assert redis.smove("src", "dest", "three") == True

assert redis.smembers("source") == {"one", "two"}

assert redis.smembers("destination") == {"three", "four"}
```

----------------------------------------

TITLE: Redis SET Command API Reference
DESCRIPTION: Detailed API documentation for the Redis SET command, outlining all supported arguments, their types, descriptions, and the command's expected response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/string/set.mdx

LANGUAGE: APIDOC
CODE:
```
Command: SET
Description: Set a key to hold a string value.

Arguments:
  key (str, required): The key
  value (TValue, required): The value, if this is not a string, we will use `JSON.stringify` to convert it
  get (bool, optional): Instead of returning `True`, this will cause the command to return the old value stored at key, or `None` when key did not exist.
  ex (int, optional): Sets an expiration (in seconds) to the key.
  px (int, optional): Sets an expiration (in milliseconds) to the key.
  exat (int, optional): Set the UNIX timestamp in seconds until the key expires.
  pxat (int, optional): Set the UNIX timestamp in milliseconds until the key expires.
  keepttl (bool, optional): Keeps the old expiration if the key already exists.
  nx (bool, optional): Only set the key if it does not already exist.
  xx (bool, optional): Only set the key if it already exists.

Response:
  (bool/TValue): `True` if the key was set. If `get` is specified, this will return the old value stored at key, or `None` when the key did not exist.
```

----------------------------------------

TITLE: Python Example for Redis SETRANGE
DESCRIPTION: Demonstrates how to use the SETRANGE command in Redis with a Python client, including setting an initial value, applying SETRANGE, and verifying the result.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/string/setrange.mdx

LANGUAGE: Python
CODE:
```
redis.set("key", "Hello World")

assert redis.setrange("key", 6, "Redis") == 11

assert redis.get("key") == "Hello Redis"
```

----------------------------------------

TITLE: Initialize SST in the application
DESCRIPTION: Sets up SST (Serverless Stack) within the current project directory, preparing it for serverless deployment.

SOURCE: https://upstash.com/docs/redis/quickstarts/ion.mdx

LANGUAGE: shell
CODE:
```
sst init
```

----------------------------------------

TITLE: TypeScript Example for LINDEX Command
DESCRIPTION: Illustrates how to use the LINDEX command with Upstash Redis in TypeScript, demonstrating how to push elements to a list and then retrieve a specific element by its index.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/lindex.mdx

LANGUAGE: TypeScript
CODE:
```
await redis.rpush("key", "a", "b", "c");
const element = await redis.lindex("key", 0);
console.log(element); // "a"
```

----------------------------------------

TITLE: Deploy Serverless API with AWS CDK and Lambda
DESCRIPTION: Learn to deploy a serverless API using AWS CDK and AWS Lambda with Upstash Redis. This tutorial covers infrastructure as code for serverless architectures.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: AWS Lambda
CODE:
```
console.log('This is a placeholder for AWS CDK code.');
```

----------------------------------------

TITLE: Python LPOS Usage Examples
DESCRIPTION: Illustrates various ways to use the LPOS command in Python, including basic usage to find the first occurrence, using the 'rank' parameter to find subsequent occurrences, and using the 'count' parameter to retrieve multiple matching indices.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/lpos.mdx

LANGUAGE: python
CODE:
```
redis.rpush("key", "a", "b", "c"); 

assert redis.lpos("key", "b") == 1
```

LANGUAGE: python
CODE:
```
redis.rpush("key", "a", "b", "c", "b"); 

assert redis.lpos("key", "b", rank=2) == 3
```

LANGUAGE: python
CODE:
```
redis.rpush("key", "a", "b", "b")

assert redis.lpos("key", "b", count=2) == [1, 2]
```

----------------------------------------

TITLE: TypeScript ZRANGE Usage Examples
DESCRIPTION: Illustrative TypeScript examples demonstrating how to use the ZRANGE command with Upstash Redis, including basic range retrieval, retrieving with scores, and sorting by score.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/zset/zrange.mdx

LANGUAGE: ts
CODE:
```
await redis.zadd("key", 
    { score: 1, member: "m1" },
    { score: 2, member: "m2" },
)
const res = await redis.zrange("key", 1, 3)
console.log(res) // ["m2"]
```

LANGUAGE: ts
CODE:
```
await redis.zadd("key", 
    { score: 1, member: "m1" },
    { score: 2, member: "m2" },
)
const res = await redis.zrange("key", 1, 3, { withScores: true })
console.log(res) // ["m2", 2]
```

LANGUAGE: ts
CODE:
```
await redis.zadd("key", 
    { score: 1, member: "m1" },
    { score: 2, member: "m2" },
    { score: 3, member: "m3" },
)
const res = await redis.zrange("key", 1, 2, { byScore: true })
console.log(res) // ["m1", "m2"]
```

----------------------------------------

TITLE: Initialize Token Bucket Ratelimit with Upstash Redis
DESCRIPTION: Demonstrates the setup of a token bucket ratelimiter using `upstash_ratelimit` and `upstash_redis`. It defines the maximum number of tokens, the refill rate, and the interval for token replenishment.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-py/algorithms.mdx

LANGUAGE: python
CODE:
```
from upstash_ratelimit import Ratelimit, TokenBucket
from upstash_redis import Redis

ratelimit = Ratelimit(
    redis=Redis.from_env(),
    limiter=TokenBucket(max_tokens=10, refill_rate=5, interval=10),
)
```

----------------------------------------

TITLE: Python Examples for Redis ZUNION Command
DESCRIPTION: Illustrates various usages of the `redis.zunion` command in Python, including simple union, aggregation, and weighted union operations on sorted sets.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zunion.mdx

LANGUAGE: python
CODE:
```
redis.zadd("key1", {"a": 1, "b": 2, "c": 3})

redis.zadd("key2", {"c": 3, "d": 4, "e": 5})

result = redis.zunion(["key1", "key2"])

assert result == ["a", "b", "c", "d", "e"]
```

LANGUAGE: python
CODE:
```
redis.zadd("key1", {"a": 1, "b": 2, "c": 3})

redis.zadd("key2", {"a": 3, "b": 4, "c": 5})

result = redis.zunion(["key1", "key2"], withscores=True, aggregate="SUM")

assert result == [("a", 4), ("b", 6), ("c", 8)]
```

LANGUAGE: python
CODE:
```
redis.zadd("key1", {"a": 1})

redis.zadd("key2", {"a": 1})

result = redis.zunion(["key1", "key2"],
                      withscores=True,
                      aggregate="SUM",
                      weights=[2, 3])

assert result == [("a", 5)]
```

----------------------------------------

TITLE: TypeScript Example for ZREVRANK
DESCRIPTION: An example demonstrating how to use the ZREVRANK command with the Upstash Redis client in TypeScript to retrieve the rank of a member.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/zset/zrevrank.mdx

LANGUAGE: ts
CODE:
```
const rank = await redis.rank("key", "member");
```

----------------------------------------

TITLE: Python Example for SETBIT
DESCRIPTION: A Python code snippet demonstrating how to call the `setbit` method on a Redis client, passing the key, offset, and value to set a bit and capture the original bit value.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/bitmap/setbit.mdx

LANGUAGE: py
CODE:
```
original_bit = redis.setbit(key, 4, 1)
```

----------------------------------------

TITLE: Execute Python URL Shortener Application
DESCRIPTION: This shell command is used to run the `url_shortener.py` script. Executing this command will initiate the URL shortening process, demonstrate the application's functionality, and print the resulting shortened and retrieved original URLs to the console.

SOURCE: https://upstash.com/docs/redis/tutorials/python_url_shortener.mdx

LANGUAGE: shell
CODE:
```
python url_shortener.py
```

----------------------------------------

TITLE: TypeScript Example for INCR Command
DESCRIPTION: Illustrates how to use the INCR command with an Upstash Redis client in TypeScript, demonstrating key initialization and subsequent incrementation.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/string/incr.mdx

LANGUAGE: TypeScript
CODE:
```
await redis.set("key", 6);
await redis.incr("key");
// returns 7
```

----------------------------------------

TITLE: Python Example for ZREMRANGEBYRANK Command
DESCRIPTION: An example demonstrating how to call the ZREMRANGEBYRANK command using a Python Redis client, specifying the key and the rank range to remove members from the sorted set.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zremrangebyrank.mdx

LANGUAGE: python
CODE:
```
redis.zremrangebyrank("key", 4, 20)
```

----------------------------------------

TITLE: Redis BITOP Command API Reference
DESCRIPTION: Detailed API documentation for the Redis BITOP command, including its operations, arguments, and return values.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/bitmap/bitop.mdx

LANGUAGE: APIDOC
CODE:
```
BITOP Command:
  Description: Perform bitwise operations on multiple keys and store the result in a destination key.
  Arguments:
    operation: AND | OR | XOR | NOT (required)
      Description: Specifies the type of bitwise operation to perform.
    destkey: str (required)
      Description: The key to store the result of the operation in.
    keys: *List[str] (required)
      Description: One or more keys to perform the operation on.
  Response:
    type: int (required)
      Description: The size of the string stored in the destination key.
```

----------------------------------------

TITLE: Serverless Python API with Redis
DESCRIPTION: Create a serverless Python API with Upstash Redis, commonly used with AWS Lambda. This tutorial offers practical examples for Python developers.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: Python
CODE:
```
print("This is a placeholder for Python code.")
```

----------------------------------------

TITLE: Python Example for ZCARD Command
DESCRIPTION: Demonstrates how to use the ZCARD command with the Upstash Redis client in Python. This example first adds elements to a sorted set and then asserts that ZCARD correctly returns the count of elements.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zcard.mdx

LANGUAGE: python
CODE:
```
redis.zadd("myset", {"one": 1, "two": 2, "three": 3})

assert redis.zcard("myset") == 3
```

----------------------------------------

TITLE: Install Upstash Redis Client
DESCRIPTION: Installs the `@upstash/redis` package, a client library for interacting with Upstash Redis, into the project. This dependency is crucial for connecting to the Redis database from the Azure Function.

SOURCE: https://upstash.com/docs/redis/quickstarts/azure-functions.mdx

LANGUAGE: shell
CODE:
```
npm install @upstash/redis
```

----------------------------------------

TITLE: TypeScript Example for LPUSH Command
DESCRIPTION: Demonstrates how to use the LPUSH command with the Upstash Redis client in TypeScript, showing multiple pushes and the resulting list length.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/lpush.mdx

LANGUAGE: TypeScript
CODE:
```
const length1 = await redis.lpush("key", "a", "b", "c"); 
console.log(length1); // 3
const length2 = await redis.lpush("key", "d"); 
console.log(length2); // 4
```

----------------------------------------

TITLE: Set Up Upstash Redis Environment Variables
DESCRIPTION: Guide to configure the Upstash Redis REST token and URL as environment variables in the .env file for Strapi, essential for connecting to your Upstash Redis database.

SOURCE: https://upstash.com/docs/redis/integrations/ratelimit/strapi/getting-started.mdx

LANGUAGE: shell
CODE:
```
UPSTASH_REDIS_REST_TOKEN="<YOUR_TOKEN>"
UPSTASH_REDIS_REST_URL="<YOUR_URL>"
```

----------------------------------------

TITLE: HTTL Usage Example in TypeScript
DESCRIPTION: Demonstrates how to use the HTTL command with the `upstash-redis` client in TypeScript. This example shows setting a hash field, applying an expiration, and then retrieving its remaining TTL.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/httl.mdx

LANGUAGE: typescript
CODE:
```
await redis.hset("my-key", "my-field", "my-value");
await redis.hexpire("my-key", "my-field", 10);
const ttl = await redis.httl("my-key", "my-field");

console.log(ttl); // e.g., [9]
```

----------------------------------------

TITLE: TypeScript Example for HSETNX Command
DESCRIPTION: Demonstrates how to use the HSETNX command in TypeScript with an async Redis client.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hsetnx.mdx

LANGUAGE: ts
CODE:
```
await redis.hsetnx("key", "id", 1)
```

----------------------------------------

TITLE: Install Django and Upstash Redis Client
DESCRIPTION: This command installs the core Django framework and the official Upstash Redis client library for Python. These packages are essential dependencies for building the web application and interacting with the Redis database.

SOURCE: https://upstash.com/docs/redis/quickstarts/django.mdx

LANGUAGE: shell
CODE:
```
pip install django
pip install upstash-redis
```

----------------------------------------

TITLE: Minimalist Next.js TODO App with Upstash Redis
DESCRIPTION: This article presents a minimalist TODO application built with Next.js and Upstash Redis, showcasing a simple yet effective integration.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: javascript
CODE:
```
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

export async function GET() {
  const todos = await redis.lrange('todos', 0, -1);
  return Response.json(todos);
}

export async function POST(request) {
  const { text } = await request.json();
  await redis.rpush('todos', text);
  return Response.json({ message: 'Todo added' });
}
```

----------------------------------------

TITLE: Next.js with Redis
DESCRIPTION: Integrate Upstash Redis into your Next.js applications. This tutorial covers common use cases and best practices for using Redis with Next.js.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: Next.js
CODE:
```
console.log('This is a placeholder for Next.js code.');
```

----------------------------------------

TITLE: Run Node.js Application in Development Mode
DESCRIPTION: This bash command executes the `dev` script defined in `package.json`, starting the Node.js application in debug mode. This allows for local testing and debugging of the application.

SOURCE: https://upstash.com/docs/redis/quickstarts/koyeb.mdx

LANGUAGE: bash
CODE:
```
npm run dev
```

----------------------------------------

TITLE: Example Redis Commands for Pipelining
DESCRIPTION: Provides a set of standard Redis commands (`SET`, `SETEX`, `INCR`, `ZADD`) that are intended to be sent together using the Upstash pipelining API.

SOURCE: https://upstash.com/docs/redis/features/restapi.mdx

LANGUAGE: redis
CODE:
```
SET key1 valuex
SETEX key2 13 valuez
INCR key1
ZADD myset 11 item1 22 item2
```

----------------------------------------

TITLE: Install Node.js Dependencies for Express Session
DESCRIPTION: Installs the required Node.js packages including 'express', 'redis', 'connect-redis', and 'express-session' to enable Redis-backed session management in an Express application.

SOURCE: https://upstash.com/docs/redis/tutorials/express_session.mdx

LANGUAGE: bash
CODE:
```
npm install express redis connect-redis express-session
```

----------------------------------------

TITLE: Python Example for Redis TTL Usage
DESCRIPTION: Illustrates how to use the `redis.ttl` method in Python to check the time-to-live of a key. This example covers scenarios where a key has no expiration, a set expiration, and when the key does not exist.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/ttl.mdx

LANGUAGE: Python
CODE:
```
# Get the TTL of a key
redis.set("my-key", "value")

assert redis.ttl("my-key") == -1

redis.expire("my-key", 10)

assert redis.ttl("my-key") > 0

# Non existent key
assert redis.ttl("non-existent-key") == -2
```

----------------------------------------

TITLE: Python Example for MSET Command
DESCRIPTION: Demonstrates how to use the MSET command with the Upstash Redis client in Python, setting multiple key-value pairs.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/string/mset.mdx

LANGUAGE: Python
CODE:
```
redis.mset({
  "key1": "value1",
  "key2": "value2"
})
```

----------------------------------------

TITLE: Python Example for RENAME Command Usage
DESCRIPTION: This Python snippet demonstrates how to use the `rename` command with a Redis client. It shows setting an initial key, renaming it, verifying the old key is gone and the new key holds the value, and illustrates that renaming a nonexistent key raises an exception.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/rename.mdx

LANGUAGE: python
CODE:
```
redis.set("key1", "Hello")
redis.rename("key1", "key2")

assert redis.get("key1") is None
assert redis.get("key2") == "Hello"

# Renaming a nonexistent key throws an exception
redis.rename("nonexistent", "key3")
```

----------------------------------------

TITLE: Python ZRANGE Usage Examples
DESCRIPTION: Practical Python examples demonstrating how to use the ZRANGE command with Upstash Redis, covering basic range queries, reverse order, sorting by score, and retrieving scores along with members.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zrange.mdx

LANGUAGE: py
CODE:
```
redis.zadd("myset", {"a": 1, "b": 2, "c": 3})

assert redis.zrange("myset", 0, 1) == ["a", "b"]
```

LANGUAGE: py
CODE:
```
redis.zadd("myset", {"a": 1, "b": 2, "c": 3})

assert redis.zrange("myset", 0, 1, rev=True) == ["c", "b"]
```

LANGUAGE: py
CODE:
```
redis.zadd("myset", {"a": 1, "b": 2, "c": 3})

assert redis.zrange("myset", 0, 1, sortby="BYSCORE") == ["a", "b"]
```

LANGUAGE: py
CODE:
```
redis.zadd("myset", {"a": 1, "b": 2, "c": 3})

assert redis.zrange("myset", 0, 1, withscores=True) == [("a", 1), ("b", 2)]
```

----------------------------------------

TITLE: PTTL Command Usage Example (Python)
DESCRIPTION: Demonstrates the usage of the PTTL command in Python with a Redis client. This example shows how to set a key, check its initial PTTL (which is -1 for no expiration), set an expiration, check PTTL again (which will be positive), and then persist the key to remove expiration, returning PTTL to -1.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/pttl.mdx

LANGUAGE: python
CODE:
```
redis.set("key1", "Hello")

assert redis.pttl("key1") == -1

redis.expire("key1", 1000)

assert redis.pttl("key1") > 0

redis.persist("key1")

assert redis.pttl("key1") == -1
```

----------------------------------------

TITLE: Initialize New AWS CDK TypeScript Project
DESCRIPTION: Uses the AWS CDK CLI to initialize a new application project with TypeScript as the chosen language, setting up the basic project structure.

SOURCE: https://upstash.com/docs/redis/tutorials/api_with_cdk.mdx

LANGUAGE: shell
CODE:
```
cdk init app --language typescript
```

----------------------------------------

TITLE: Serverless API with Java and Redis
DESCRIPTION: Build a serverless API using Java and Upstash Redis, often deployed with AWS Lambda. This tutorial covers setting up a Java environment for serverless development.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: Java
CODE:
```
System.out.println("This is a placeholder for Java code.");
```

----------------------------------------

TITLE: Initialize Node.js Project
DESCRIPTION: Command to initialize a new Node.js project within the created folder. This generates a `package.json` file, which is essential for managing project dependencies.

SOURCE: https://upstash.com/docs/redis/tutorials/histogram.mdx

LANGUAGE: text
CODE:
```
npm init
```

----------------------------------------

TITLE: Python Example for Redis TOUCH Command
DESCRIPTION: Demonstrates how to use the `redis.touch` method in Python to update the last access time for multiple specified keys.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/touch.mdx

LANGUAGE: py
CODE:
```
redis.touch("key1", "key2", "key3")
```

----------------------------------------

TITLE: Python Example for HEXPIREAT Command Usage
DESCRIPTION: Illustrates how to interact with the `HEXPIREAT` command using a Python Redis client. This example first sets a value in a hash and then demonstrates setting an expiration time for that specific field.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hexpireat.mdx

LANGUAGE: python
CODE:
```
redis.hset(hash_name, field, value)

assert redis.hexpireat(hash_name, field, int(time.time()) + 10) == [1]
```

----------------------------------------

TITLE: Python ZADD Command Usage Examples
DESCRIPTION: Illustrative Python examples demonstrating how to use the ZADD command with various options like adding new elements, preventing additions with 'nx', preventing updates with 'xx', and conditional updates with 'gt'.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zadd.mdx

LANGUAGE: python
CODE:
```
# Add three elements
assert redis.zadd("myset", {
    "one": 1,
    "two": 2,
    "three": 3
}) == 3

# No element is added since "one" and "two" already exist
assert redis.zadd("myset", {
    "one": 1,
    "two": 2
}, nx=True) == 0

# New element is not added since it does not exist
assert redis.zadd("myset", {
    "new-element": 1
}, xx=True) == 0

# Only "three" is updated since new score was greater
assert redis.zadd("myset", {
    "three": 10, "two": 0
}, gt=True) == 1

# Only "three" is updated since new score was greater
assert redis.zadd("myset", {
    "three": 10,
    "two": 0
}, gt=True) == 1
```

----------------------------------------

TITLE: Survey App with Upstash Redis
DESCRIPTION: Build a survey application using only Upstash Redis. This tutorial focuses on Next.js and demonstrates how to manage survey data and responses efficiently.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: Next.js
CODE:
```
console.log('This is a placeholder for Next.js code related to survey app.');
```

----------------------------------------

TITLE: MSETNX Command API Documentation
DESCRIPTION: Detailed API documentation for the MSETNX command, including arguments, response, and billing information.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/string/msetnx.mdx

LANGUAGE: APIDOC
CODE:
```
MSETNX Command:
  Description: Set multiple keys in one go unless they exist already. Counts as a single command for billing.

  Arguments:
    ParamField:
      type: Record<string, TValue>
      required: true
      description: An object where the keys are the keys to set, and the values are the values to set.

  Response:
    ResponseField:
      type: boolean
      required: true
      description: True if all keys were set, False if at least one key was not set.
```

----------------------------------------

TITLE: Python Example for EVAL_RO with Key Access
DESCRIPTION: Demonstrates how to use `eval_ro` in Python to execute a Lua script that retrieves a value from a specified key, asserting the correct return value. This example sets a key first and then evaluates a script that reads it.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/scripts/eval_ro.mdx

LANGUAGE: python
CODE:
```
script = """
local value = redis.call("GET", KEYS[1])
return value
"""

redis.set("mykey", "Hello")

assert redis.eval_ro(script, keys=["mykey"]) == "Hello"
```

----------------------------------------

TITLE: Python Example for JSON.MERGE
DESCRIPTION: A Python code example demonstrating how to use the `redis.json.merge` method to merge a new JSON value into an existing JSON structure at a specified path within a Redis key.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/merge.mdx

LANGUAGE: Python
CODE:
```
redis.json.merge("key", "$.path.to.value", {"new": "value"})
```

----------------------------------------

TITLE: TypeScript Example for GETSET Command
DESCRIPTION: Illustrates how to use the GETSET command in a TypeScript application with an Upstash Redis client to retrieve an old value and set a new one.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/string/getset.mdx

LANGUAGE: TypeScript
CODE:
```
const oldValue = await redis.getset("key", newValue);
```

----------------------------------------

TITLE: TypeScript XADD Basic Usage Example
DESCRIPTION: Demonstrates how to append a new entry to a Redis stream using the `xadd` command with a generated ID and simple key-value data.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/stream/xadd.mdx

LANGUAGE: ts
CODE:
```
await redis.xadd(key, "*", { name: "John Doe", age: 30 });
```

----------------------------------------

TITLE: MSETNX Command API Reference
DESCRIPTION: Detailed API documentation for the MSETNX command, including its arguments and expected response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/string/msetnx.mdx

LANGUAGE: APIDOC
CODE:
```
MSETNX Command:
  Description: Set multiple keys in one go unless they exist already. Counts as a single command for billing.
  Arguments:
    - name: keysAndValues
      type: Record<str, TValue>
      required: true
      description: An object where the keys are the keys to set, and the values are the values to set.
  Response:
    type: number
    description: '1' if all keys were set, '0' if at least one key was not set.
```

----------------------------------------

TITLE: Adding Feature Flags to Next.js with Upstash Redis
DESCRIPTION: This video explains how to implement feature flags in a Next.js application using Upstash Redis, allowing dynamic feature toggling.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: javascript
CODE:
```
// Example feature flag check
async function isFeatureEnabled(featureName) {
  const enabled = await redis.get(`feature:${featureName}`);
  return enabled === 'true';
}

// Usage in a component
if (await isFeatureEnabled('new_dashboard')) {
  // Show new dashboard
} else {
  // Show old dashboard
}
```

----------------------------------------

TITLE: Python Example for Redis BITCOUNT Usage
DESCRIPTION: Illustrates how to use the `BITCOUNT` command in Python to count set bits, demonstrating usage with and without a specified byte range.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/bitmap/bitcount.mdx

LANGUAGE: python
CODE:
```
redis.setbit("mykey", 7, 1)
redis.setbit("mykey", 8, 1)
redis.setbit("mykey", 9, 1)

# With range
assert redis.bitcount("mykey", 0, 10) == 3

# Without range
assert redis.bitcount("mykey") == 3
```

----------------------------------------

TITLE: Python Example for Redis PERSIST Command
DESCRIPTION: Demonstrates how to use the `persist` command in Python with an Upstash Redis client. The example sets a key, applies an expiration, then removes the expiration using `persist`, verifying the time-to-live (TTL) before and after the operation.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/persist.mdx

LANGUAGE: Python
CODE:
```
redis.set("key1", "Hello")
redis.expire("key1", 10)

assert redis.ttl("key1") == 10

redis.persist("key1")

assert redis.ttl("key1") == -1
```

----------------------------------------

TITLE: TypeScript Example for Redis SUNION Operation
DESCRIPTION: Demonstrates how to use the `sunion` command with the `upstash-redis` client in TypeScript. This example shows adding elements to two sets and then performing a union operation to retrieve all unique members.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/set/sunion.mdx

LANGUAGE: TypeScript
CODE:
```
await redis.sadd("set1", "a", "b", "c"); 
await redis.sadd("set2", "c", "d", "e"); 
const union =  await redis.sunion("set1", "set2");
console.log(union); // ["a", "b", "c", "d", "e"]
```

----------------------------------------

TITLE: Example of STRLEN command with Upstash Redis in TypeScript
DESCRIPTION: Demonstrates setting a string value to a Redis key and then retrieving its length using the `STRLEN` command with the `upstash-redis` client in TypeScript. The example shows the full flow from setting the key to logging the length.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/string/strlen.mdx

LANGUAGE: ts
CODE:
```
await redis.set("key", "helloworld")
const length = await redis.strlen("key");
console.log(length); // 10
```

----------------------------------------

TITLE: Python Example for HSETNX Redis Command
DESCRIPTION: Demonstrates the usage of the HSETNX command in Python, showing how it returns `True` when a field is successfully set for the first time and `False` when attempting to set an already existing field.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hsetnx.mdx

LANGUAGE: python
CODE:
```
assert redis.hsetnx("myhash", "field1", "Hello") == True
assert redis.hsetnx("myhash", "field1", "World") == False
```

----------------------------------------

TITLE: Python Example for LRANGE Command
DESCRIPTION: Illustrates the usage of the LRANGE command in Python, demonstrating how to push elements to a list and then retrieve specific ranges using both positive and negative indices.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/lrange.mdx

LANGUAGE: python
CODE:
```
redis.rpush("mylist", "one", "two", "three")

assert redis.lrange("mylist", 0, 1) == ["one", "two"]

assert redis.lrange("mylist", 0, -1) == ["one", "two", "three"]
```

----------------------------------------

TITLE: Install Upstash Redis NPM Package
DESCRIPTION: Installs the `@upstash/redis` client library into the project's `node_modules` directory. This package provides the necessary functionalities to interact with the Upstash Redis database from the Lambda function.

SOURCE: https://upstash.com/docs/redis/quickstarts/aws-lambda.mdx

LANGUAGE: shell
CODE:
```
npm install @upstash/redis
```

----------------------------------------

TITLE: Python EXPIREAT Usage Examples
DESCRIPTION: Illustrates how to use the `expireat` method in Python. Examples include setting an expiration using a `datetime` object for a future time and using a Unix timestamp to specify the expiration.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/expireat.mdx

LANGUAGE: python
CODE:
```
# With a datetime object
redis.set("mykey", "Hello")
redis.expireat("mykey", datetime.datetime.now() + datetime.timedelta(seconds=5))

# With a unix timestamp
redis.set("mykey", "Hello")
redis.expireat("mykey", int(time.time()) + 5)
```

----------------------------------------

TITLE: TypeScript Examples for Upstash Redis DEL Command
DESCRIPTION: Illustrative TypeScript code examples demonstrating how to use the `redis.del` method to remove keys, including basic usage with multiple arguments and spreading an array of keys.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/generic/del.mdx

LANGUAGE: ts
CODE:
```
await redis.del("key1", "key2");
```

LANGUAGE: ts
CODE:
```
const keys = ["key1", "key2"];
await redis.del(...keys)
```

----------------------------------------

TITLE: Create Serverless Framework Project
DESCRIPTION: Command-line interaction to create a new Serverless Framework project, selecting the AWS Node.js HTTP API template and naming the project 'ratelimit-serverless'. This output guides the user through the initial project scaffolding.

SOURCE: https://upstash.com/docs/redis/tutorials/rate-limiting.mdx

LANGUAGE: shell
CODE:
```
➜  tutorials > ✗ serverless
Serverless ϟ Framework

Welcome to Serverless Framework V.4

Create a new project by selecting a Template to generate scaffolding for a specific use-case.

✔ Select A Template: · AWS / Node.js / HTTP API

✔ Name Your Project: · ratelimit-serverless

✔ Template Downloaded

✔ Create Or Select An Existing App: · Create A New App

✔ Name Your New App: · ratelimit-serverless

Your new Service "ratelimit-serverless" is ready. Here are next steps:

• Open Service Directory: cd ratelimit-serverless
• Install Dependencies: npm install (or use another package manager)
• Deploy Your Service: serverless deploy
```

----------------------------------------

TITLE: Building a Cache with Upstash Redis in Next.js
DESCRIPTION: This video demonstrates how to implement a caching layer in a Next.js application using Upstash Redis for improved performance.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: javascript
CODE:
```
// Example caching logic
async function getCachedData(key, fetcher) {
  const cached = await redis.get(key);
  if (cached) {
    return cached;
  }
  const data = await fetcher();
  await redis.set(key, data, 'EX', 3600); // Cache for 1 hour
  return data;
}
```

----------------------------------------

TITLE: Connect to Upstash Redis with @upstash/redis
DESCRIPTION: This JavaScript code snippet demonstrates how to initialize the `@upstash/redis` client using a URL and token, and perform a simple `set` operation. It's typically used for quick testing or demonstration purposes.

SOURCE: https://upstash.com/docs/redis/quickstarts/koyeb.mdx

LANGUAGE: javascript
CODE:
```
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "<YOUR_UPSTASH_REDIS_REST_URL>",
  token: "<YOUR_UPSTASH_REDIS_REST_TOKEN>",
});

const data = await redis.set("foo", "bar");
```

----------------------------------------

TITLE: Python Example for EVALSHA Command Usage
DESCRIPTION: Illustrates how to use the `evalsha` method in a Python Redis client to execute a pre-cached Lua script. The example demonstrates passing a SHA1 hash and arguments, then asserting the returned result.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/scripts/evalsha.mdx

LANGUAGE: Python
CODE:
```
result = redis.evalsha("fb67a0c03b48ddbf8b4c9b011e779563bdbc28cb", args=["hello"])
assert result = "hello"
```

----------------------------------------

TITLE: TypeScript Example for Redis EVAL Command
DESCRIPTION: A TypeScript code example demonstrating how to use the `redis.eval` method to execute a simple Lua script. It shows how to define the script, pass keys and arguments, and handle the returned result.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/scripts/eval.mdx

LANGUAGE: typescript
CODE:
```
const script = `
    return ARGV[1]
`
const result = await redis.eval(script, [], ["hello"]);
console.log(result) // "hello"
```

----------------------------------------

TITLE: HMGET Command API Reference and Usage Example
DESCRIPTION: Documents the Upstash Redis HMGET command, detailing its required arguments (key, fields), expected response format, and provides a TypeScript example demonstrating how to set hash fields and then retrieve specific ones using HMGET.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hmget.mdx

LANGUAGE: APIDOC
CODE:
```
HMGET API Documentation:
  Arguments:
    key: string (required)
      Description: The key of the hash.
    fields: ...string[] (required)
      Description: One or more fields to get.
  Response:
    type: Record<string, unknown> (required)
      Description: An object containing the fields and their values.
```

LANGUAGE: ts
CODE:
```
await redis.hset("key", {
  id: 1,
  username: "chronark",
  name: "andreas"
  });
const fields = await redis.hmget("key", "username", "name");
console.log(fields); // { username: "chronark", name: "andreas" }
```

----------------------------------------

TITLE: Python Example for HMGET Command Usage
DESCRIPTION: Illustrates how to use the `hmget` command in Python with `upstash-redis`, including setting initial hash values using `hset` and verifying the `hmget` output.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hmget.mdx

LANGUAGE: py
CODE:
```
redis.hset("myhash", values={
    "field1": "Hello",
    "field2": "World"
})

assert redis.hmget("myhash", "field1", "field2") == ["Hello", "World"]
```

----------------------------------------

TITLE: LINSERT Command API Reference
DESCRIPTION: Detailed API documentation for the LINSERT command, including its parameters, return values, and behavior.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/linsert.mdx

LANGUAGE: APIDOC
CODE:
```
LINSERT Command:
  Description: Inserts an element before or after another element in a list.
  Arguments:
    - key: str (required)
      Description: The key of the list.
    - direction: "BEFORE" | "AFTER" (required)
      Description: Whether to insert the element before or after pivot.
    - pivot: Any (required)
      Description: The element to insert before or after.
    - value: Any (required)
      Description: The element to insert.
  Response:
    - type: int (required)
      Description: The list length after insertion, 0 when the list doesn't exist or -1 when pivot was not found.
```

----------------------------------------

TITLE: Install Upstash Redis SDK
DESCRIPTION: This command installs the `@upstash/redis` SDK, which is a crucial dependency for interacting with your Upstash Redis database from within your Cloudflare Worker application. It enables programmatic access to Redis functionalities.

SOURCE: https://upstash.com/docs/redis/quickstarts/cloudflareworkers.mdx

LANGUAGE: bash
CODE:
```
npm install @upstash/redis
```

----------------------------------------

TITLE: TypeScript Example for EVALSHA Command
DESCRIPTION: Demonstrates how to use the EVALSHA command in TypeScript with the redis client, showing a basic execution and logging the result.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/scripts/evalsha.mdx

LANGUAGE: ts
CODE:
```
const result = await redis.evalsha("fb67a0c03b48ddbf8b4c9b011e779563bdbc28cb", [], ["hello"]);
console.log(result) // "hello"
```

----------------------------------------

TITLE: Navigate into the newly created Phoenix project directory
DESCRIPTION: After creating the Phoenix application, use this command to change the current working directory to the newly generated project folder, `redix_demo`. This is a necessary step before proceeding with further configurations and dependency installations within the project.

SOURCE: https://upstash.com/docs/redis/quickstarts/elixir.mdx

LANGUAGE: Shell
CODE:
```
cd redix_demo
```

----------------------------------------

TITLE: Bitmap Commands API Reference
DESCRIPTION: Documentation for bitmap-related commands available in the @upstash/redis SDK.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: APIDOC
CODE:
```
BITCOUNT:
  description: Count set bits in a string.
```

LANGUAGE: APIDOC
CODE:
```
BITOP:
  description: Perform bitwise operations between strings.
```

LANGUAGE: APIDOC
CODE:
```
BITPOS:
  description: Find first bit set or clear in a string.
```

LANGUAGE: APIDOC
CODE:
```
GETBIT:
  description: Returns the bit value at offset in the string value stored at key.
```

LANGUAGE: APIDOC
CODE:
```
SETBIT:
  description: Sets or clears the bit at offset in the string value stored at key.
```

----------------------------------------

TITLE: JSON.MSET API Reference
DESCRIPTION: Detailed API documentation for the JSON.MSET command, outlining its required arguments and expected response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/mset.mdx

LANGUAGE: APIDOC
CODE:
```
JSON.MSET:
  Description: Sets multiple JSON values at multiple paths in multiple keys.
  Arguments:
    - key_path_value_tuples: List[Tuple[string, string, TValue]] (required)
      Description: A list of tuples where each tuple contains a key, a path, and a value.
  Response:
    - Type: boolean (required)
      Description: Returns true if the operation was successful.
```

----------------------------------------

TITLE: SDIFFSTORE Command API Reference
DESCRIPTION: Detailed documentation for the SDIFFSTORE command, outlining its required arguments and the structure of its response.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/set/sdiffstore.mdx

LANGUAGE: APIDOC
CODE:
```
SDIFFSTORE Command:
  Description: Write the difference between sets to a new set

  Arguments:
    destination:
      Type: string
      Required: true
      Description: The key of the set to store the resulting set in.
    keys:
      Type: ...string[]
      Required: true
      Description: The keys of the sets to perform the difference operation on.

  Response:
    Type: TValue[]
    Required: true
    Description: The members of the resulting set.
```

----------------------------------------

TITLE: ZINTER with Weights Example (Python)
DESCRIPTION: Shows how to apply custom weights to input sets during a ZINTER operation in Python, demonstrating how weights influence the final aggregated scores.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zinter.mdx

LANGUAGE: python
CODE:
```
redis.zadd("key1", {"a": 1})

redis.zadd("key2", {"a": 1})

result = redis.zinter(["key1", "key2"],
                      withscores=True,
                      aggregate="SUM",
                      weights=[2, 3])

assert result == [("a", 5)]
```

----------------------------------------

TITLE: SDIFFSTORE Command API Reference
DESCRIPTION: Detailed API documentation for the `SDIFFSTORE` command, outlining its required arguments and the structure of its integer response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/set/sdiffstore.mdx

LANGUAGE: APIDOC
CODE:
```
SDIFFSTORE:
  description: Write the difference between sets to a new set
  arguments:
    destination:
      type: str
      required: true
      description: The key of the set to store the resulting set in.
    keys:
      type: List[str]
      required: true
      description: The keys of the sets to perform the difference operation on.
  response:
    type: int
    required: true
    description: The number of elements in the resulting set.
```

----------------------------------------

TITLE: Python Example for HEXPIRE Usage
DESCRIPTION: Demonstrates how to use the `hexpire` command in Python with the `upstash-redis` client. This example shows a basic hash set operation followed by setting an expiry of 1 second on a specific field within the hash.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hexpire.mdx

LANGUAGE: python
CODE:
```
redis.hset(hash_name, field, value)

assert redis.hexpire(hash_name, field, 1) == [1]
```

----------------------------------------

TITLE: Python Example: Using redis.echo
DESCRIPTION: A Python code snippet demonstrating how to use the `redis.echo` method to send a message and assert the returned value, useful for connection debugging.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/auth/echo.mdx

LANGUAGE: py
CODE:
```
assert redis.echo("hello world") == "hello world"
```

----------------------------------------

TITLE: GETSET Command API Reference
DESCRIPTION: Detailed API documentation for the GETSET command, including its arguments and expected response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/string/getset.mdx

LANGUAGE: APIDOC
CODE:
```
GETSET Command:
  Description: Return the value of the specified key and replace it with a new value.
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key to get.
    value:
      Type: Any
      Required: true
      Description: The new value to store.
  Response:
    Type: Any
    Description: The response is the value stored at the key or `None` if the key doesn't exist.
```

----------------------------------------

TITLE: TypeScript Example for JSON.NUMMULTBY
DESCRIPTION: Demonstrates how to use the `json.nummultby` command with the Upstash Redis client in TypeScript.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/nummultby.mdx

LANGUAGE: ts
CODE:
```
const newValue = await redis.json.nummultby("key", "$.path.to.value", 2);
```

----------------------------------------

TITLE: Python Example for HKEYS Command
DESCRIPTION: Illustrates how to use the `hset` and `hkeys` commands with the Upstash Redis client in Python to set hash fields and then retrieve all field names.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hkeys.mdx

LANGUAGE: py
CODE:
```
redis.hset("myhash", values={
    "field1": "Hello",
    "field2": "World"
})

assert redis.hkeys("myhash") == ["field1", "field2"]
```

----------------------------------------

TITLE: Install Celery with Redis Dependencies
DESCRIPTION: Installs the Celery library along with its Redis backend dependencies using pip, preparing the environment for asynchronous task processing.

SOURCE: https://upstash.com/docs/redis/integrations/celery.mdx

LANGUAGE: bash
CODE:
```
pip install "celery[redis]"
```

----------------------------------------

TITLE: Redis BITPOS Command API Reference
DESCRIPTION: Detailed documentation for the Redis BITPOS command, including its arguments (key, bit, start, end), their types, requirements, and the structure of the integer response.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/bitmap/bitpos.mdx

LANGUAGE: APIDOC
CODE:
```
BITPOS Command:
  Description: Find the position of the first set or clear bit (bit with a value of 1 or 0) in a Redis string key.
  Arguments:
    key:
      Type: string
      Required: true
      Description: The key to search in.
    bit:
      Type: 0 | 1
      Required: true
      Description: The key to store the result of the operation in.
    start:
      Type: number
      Required: false
      Description: The index to start searching at.
    end:
      Type: number
      Required: false
      Description: The index to stop searching at.
  Response:
    Type: integer
    Required: true
    Description: The index of the first occurrence of the bit in the string.
```

----------------------------------------

TITLE: Connect to Upstash Redis using ioredis (JavaScript)
DESCRIPTION: This example shows how to connect to an Upstash Redis database using the `ioredis` library in Node.js. It establishes a secure connection using the provided endpoint, port, and password, then demonstrates setting and retrieving a key-value pair.

SOURCE: https://upstash.com/docs/redis/howto/connectclient.mdx

LANGUAGE: javascript
CODE:
```
const Redis = require("ioredis");

let client = new Redis("rediss://:YOUR_PASSWORD@YOUR_ENDPOINT:YOUR_PORT");
await client.set("foo", "bar");
let x = await client.get("foo");
console.log(x);
```

----------------------------------------

TITLE: TypeScript Example for ZREMRANGEBYSCORE
DESCRIPTION: An example demonstrating how to invoke the ZREMRANGEBYSCORE command using the Upstash Redis client in TypeScript, removing elements from 'key' with scores between 2 and 5.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/zset/zremrangebyscore.mdx

LANGUAGE: ts
CODE:
```
await redis.zremrangebyscore("key", 2, 5)
```

----------------------------------------

TITLE: TypeScript Example for SDIFFSTORE Usage
DESCRIPTION: Illustrates how to use the SDIFFSTORE command with Upstash Redis in TypeScript, demonstrating the process of adding members to sets, calculating the difference, and storing the result.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/set/sdiffstore.mdx

LANGUAGE: ts
CODE:
```
await redis.sadd("set1", "a", "b", "c");
await redis.sadd("set2", "c", "d", "e");
await redis.sdiff("dest", "set1", "set2");
console.log(diff); // ["a", "b"]
```

----------------------------------------

TITLE: Run FastAPI Application using Uvicorn
DESCRIPTION: This command starts the FastAPI application using Uvicorn, an ASGI server, enabling live reloading for development.

SOURCE: https://upstash.com/docs/redis/tutorials/python_rate_limiting.mdx

LANGUAGE: shell
CODE:
```
uvicorn main:app --reload
```

----------------------------------------

TITLE: Waiting Room with Cloudflare Workers and Serverless Redis
DESCRIPTION: Build a custom waiting room for your website using Cloudflare Workers and Upstash Serverless Redis. This tutorial explains how to manage traffic spikes effectively.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: Cloudflare Workers
CODE:
```
export default {
  async fetch(request) {
    return new Response("Hello from Cloudflare Workers!");
  }
};
```

----------------------------------------

TITLE: Implement Fixed Window Ratelimiting with Upstash Redis
DESCRIPTION: Demonstrates how to create a ratelimiter using the fixed window algorithm, allowing 10 requests per 10 seconds. Examples are provided for both regional and multi-regional Upstash Redis configurations.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-ts/algorithms.mdx

LANGUAGE: ts
CODE:
```
const ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.fixedWindow(10, "10 s"),
    });
```

LANGUAGE: ts
CODE:
```
const ratelimit = new MultiRegionRatelimit({
      redis: [
        new Redis({
          /* auth */
        }),
        new Redis({
          /* auth */
        })
      ],
      limiter: MultiRegionRatelimit.fixedWindow(10, "10 s"),
    });
```

----------------------------------------

TITLE: Generic Commands API Reference
DESCRIPTION: Documentation for generic key-value commands available in the @upstash/redis SDK.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: APIDOC
CODE:
```
DEL:
  description: Delete one or multiple keys.
```

LANGUAGE: APIDOC
CODE:
```
EXISTS:
  description: Determine if a key exists.
```

LANGUAGE: APIDOC
CODE:
```
EXPIRE:
  description: Set a key's time to live in seconds.
```

LANGUAGE: APIDOC
CODE:
```
EXPIREAT:
  description: Set the expiration for a key as a UNIX timestamp.
```

LANGUAGE: APIDOC
CODE:
```
KEYS:
  description: Find all keys matching the given pattern.
```

LANGUAGE: APIDOC
CODE:
```
PERSIST:
  description: Remove the expiration from a key.
```

LANGUAGE: APIDOC
CODE:
```
PEXPIRE:
  description: Set a key's time to live in milliseconds.
```

LANGUAGE: APIDOC
CODE:
```
PEXPIREAT:
  description: Set the expiration for a key as a UNIX timestamp specified in milliseconds.
```

LANGUAGE: APIDOC
CODE:
```
PTTL:
  description: Get the time to live for a key in milliseconds.
```

LANGUAGE: APIDOC
CODE:
```
RANDOMKEY:
  description: Return a random key from the keyspace.
```

LANGUAGE: APIDOC
CODE:
```
RENAME:
  description: Rename a key.
```

LANGUAGE: APIDOC
CODE:
```
RENAMENX:
  description: Rename a key, only if the new key does not exist.
```

LANGUAGE: APIDOC
CODE:
```
SCAN:
  description: Incrementally iterate the keys space.
```

LANGUAGE: APIDOC
CODE:
```
TOUCH:
  description: Alters the last access time of a key(s). Returns the number of existing keys specified.
```

LANGUAGE: APIDOC
CODE:
```
TTL:
  description: Get the time to live for a key.
```

LANGUAGE: APIDOC
CODE:
```
TYPE:
  description: Determine the type stored at key.
```

LANGUAGE: APIDOC
CODE:
```
UNLINK:
  description: Delete one or more keys.
```

----------------------------------------

TITLE: SRANDMEMBER Usage Examples in TypeScript
DESCRIPTION: Practical TypeScript examples demonstrating how to use the `srandmember` command to retrieve random members from a Redis set, both with and without specifying a count.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/set/srandmember.mdx

LANGUAGE: typescript
CODE:
```
await redis.sadd("set", "a", "b", "c"); 
const member = await redis.srandmember("set");
console.log(member); // "a"
```

LANGUAGE: typescript
CODE:
```
await redis.sadd("set", "a", "b", "c"); 
const members = await redis.srandmember("set", 2);
console.log(members); // ["a", "b"]
```

----------------------------------------

TITLE: Upstash Redis Plan Comparison
DESCRIPTION: A comparison of different Upstash Redis plans, detailing their pricing, data size limits, bandwidth, request limits per second, request size, record size, and connection limits.

SOURCE: https://upstash.com/docs/redis/overall/pricing.mdx

LANGUAGE: APIDOC
CODE:
```
Plan | Price | Read Region Price | Max Data Size | Max Bw GB Monthly | Max Req Per Sec | Max Request Size | Max Record | Max Connections
Free | $0 | $0 | 256MB | 10G | 10000 | 10MB | 100MB | 10000
Pay-as-you-go | $0 | $0 | 100GB | Unlimited | 10000 | 10MB | 100MB | 10000
Fixed 250MB | $10 | $5 | 250MB | 50GB | 10000 | 10MB | 100MB | 10000
Fixed 1GB | $20 | $10 | 1GB | 100GB | 10000 | 10MB | 200MB | 10000
Fixed 5GB | $100 | $50 | 5GB | 500GB | 10000 | 20MB | 300MB | 10000
Fixed 10GB | $200 | $100 | 10GB | 1TB | 10000 | 30MB | 400MB | 10000
Fixed 50GB | $400 | $200 | 50GB | 5TB | 10000 | 50MB | 500MB | 10000
Fixed 100GB | $800 | $400 | 100GB | 10TB | 16000 | 75MB | 1GB | 10000
Fixed 500GB | $1500 | $750 | 500GB | 20TB | 16000 | 100MB | 5GB | 100000
```

----------------------------------------

TITLE: TypeScript Example: Setting PEXPIRE on a Redis Key
DESCRIPTION: An example demonstrating how to use the `pexpire` method in TypeScript to set a 1-minute expiration on a Redis key using the Upstash Redis client.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/generic/pexpire.mdx

LANGUAGE: ts
CODE:
```
await redis.pexpire(key, 60_000); // 1 minute
```

----------------------------------------

TITLE: Python Examples for Redis EVAL Command
DESCRIPTION: Demonstrates how to use the `redis.eval` method in Python, including evaluating a script that retrieves a key's value and passing arguments to a Lua script.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/scripts/eval.mdx

LANGUAGE: python
CODE:
```
script = """
local value = redis.call("GET", KEYS[1])
return value
"""

redis.set("mykey", "Hello")

assert redis.eval(script, keys=["mykey"]) == "Hello"
```

LANGUAGE: python
CODE:
```
assert redis.eval("return ARGV[1]", args=["Hello"]) == "Hello"
```

----------------------------------------

TITLE: Autocomplete API with Serverless Redis
DESCRIPTION: Implement an autocomplete API powered by Upstash Redis. This tutorial is tailored for AWS Lambda and Node.js environments, showing how to provide fast and relevant suggestions.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: Node.js
CODE:
```
console.log('This is a placeholder for Node.js code related to autocomplete API.');
```

----------------------------------------

TITLE: Execute Flask Web Application
DESCRIPTION: This command runs the `app.py` script, starting the Flask development server. Once running, the application will be accessible locally, allowing users to interact with the Redis-backed counter functionality.

SOURCE: https://upstash.com/docs/redis/quickstarts/flask.mdx

LANGUAGE: shell
CODE:
```
python app.py
```

----------------------------------------

TITLE: TypeScript Example for LTRIM
DESCRIPTION: Demonstrates how to use the `lpush` and `ltrim` commands with Upstash Redis in TypeScript to initialize a list and then trim it to a specific range.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/ltrim.mdx

LANGUAGE: ts
CODE:
```
await redis.lpush("key", "a", "b", "c", "d"); 
await redis.ltrim("key", 1, 2); 
// the list is now ["b", "c"]
```

----------------------------------------

TITLE: TypeScript Example for JSON.MGET
DESCRIPTION: Demonstrates how to use the `redis.json.mget` method in TypeScript to retrieve values from multiple JSON documents at a specified path.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/mget.mdx

LANGUAGE: ts
CODE:
```
const values = await redis.json.mget(["key1", "key2"],  "$.path.to.somewhere");
```

----------------------------------------

TITLE: Python Example for Redis INCRBY Usage
DESCRIPTION: Illustrates the usage of the `incrby` method in Python with a Redis client. It demonstrates setting an initial value for a key, incrementing it by a specified amount, and asserting the correct resulting value.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/string/incrby.mdx

LANGUAGE: Python
CODE:
```
redis.set("key", 6)

assert redis.incrby("key", 4) == 10
```

----------------------------------------

TITLE: Upstash Transaction Example Response
DESCRIPTION: Shows the expected JSON response for the example transaction, including successful results and an error for the INCR command on a non-integer value.

SOURCE: https://upstash.com/docs/redis/features/restapi.mdx

LANGUAGE: json
CODE:
```
[
  { "result": "OK" },
  { "result": "OK" },
  { "error": "ERR value is not an int or out of range" },
  { "result": 2 }
]
```

----------------------------------------

TITLE: Python Example for PEXPIREAT Command
DESCRIPTION: Demonstrates how to use the PEXPIREAT command in Python, setting key expiration with both Unix timestamps and datetime objects.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/pexpireat.mdx

LANGUAGE: py
CODE:
```
# With a unix timestamp
redis.set("mykey", "Hello")
redis.pexpireat("mykey", int(time.time() * 1000) )

# With a datetime object
redis.set("mykey", "Hello")
redis.pexpireat("mykey", datetime.datetime.now() + datetime.timedelta(seconds=5))
```

----------------------------------------

TITLE: Python Example for Upstash Redis JSON.MSET
DESCRIPTION: Demonstrates how to use the `json.mset` method in Python with the Upstash Redis client. This example shows how to pass a list of dictionaries, each specifying a key, a JSON path, and the value to be set, to perform a multi-key, multi-path JSON set operation.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/mset.mdx

LANGUAGE: python
CODE:
```
await redis.json.mset([
  { key: key, path: "$.path", value: value}, 
  { key: key2, path: "$.path2", value: value2}
])
```

----------------------------------------

TITLE: Python Example for JSON.STRLEN
DESCRIPTION: Illustrates how to invoke the JSON.STRLEN command using the `redis.json.strlen` method in a Python client, specifying the key and the JSON path.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/strlen.mdx

LANGUAGE: python
CODE:
```
redis.json.strlen("key", "$.path.to.str")
```

----------------------------------------

TITLE: Demonstrate Auto-Pipelining with Async and Batch Operations
DESCRIPTION: This example illustrates how auto-pipelining handles asynchronous Redis commands and batch requests. Commands like `hincrby` are added to the pipeline, and multiple `hget` calls are batched using `Promise.all`, resulting in a single Redis `PIPELINE` command execution upon `await`.

SOURCE: https://upstash.com/docs/redis/sdks/ts/pipelining/auto-pipeline.mdx

LANGUAGE: TypeScript
CODE:
```
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv({
  latencyLogging: false,
  enableAutoPipelining: true
});

// async call to redis. Not executed right away, instead
// added to the pipeline
redis.hincrby("Brooklyn", "visited", 1);

// making requests in batches
const brooklynInfo = Promise.all([
  redis.hget("Brooklyn", "coordinates"),
  redis.hget("Brooklyn", "population")
]);

// when we call await, the three commands are executed
// as a pipeline automatically. A single PIPELINE command
// is executed instead of three requests and the results
// are returned:
const [ coordinates, population ] = await brooklynInfo;
```

----------------------------------------

TITLE: SUNIONSTORE Command
DESCRIPTION: No description

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
SUNIONSTORE
```

----------------------------------------

TITLE: Python Example for Setting Redis Key Expiry
DESCRIPTION: Demonstrates how to use the `redis.expire()` method in Python to set a timeout on a Redis key. Examples include setting expiry with an integer number of seconds and a `datetime.timedelta` object, verifying key deletion after the timeout.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/expire.mdx

LANGUAGE: python
CODE:
```
# With seconds
redis.set("mykey", "Hello")
redis.expire("mykey", 5)

assert redis.get("mykey") == "Hello"

time.sleep(5)

assert redis.get("mykey") is None

# With a timedelta
redis.set("mykey", "Hello")
redis.expire("mykey", datetime.timedelta(seconds=5))
```

----------------------------------------

TITLE: Python Bitfield Set Operation Example
DESCRIPTION: Demonstrates how to set multiple 4-bit unsigned integer values within a Redis bitfield using the `set` command. The example initializes an empty key and then sets two distinct 4-bit segments, verifying the operation's outcome.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/bitmap/bitfield.mdx

LANGUAGE: py
CODE:
```
redis.set("mykey", "")

result = redis.bitfield("mykey") \
    .set("u4", 0, 16) \
    .set("u4", 4, 1) \
    .execute()
  
assert result == [0, 1]
```

----------------------------------------

TITLE: TypeScript Example for SUNIONSTORE Command
DESCRIPTION: Illustrates how to use the `redis.sadd` and `redis.sunionstore` methods in TypeScript to perform a set union and store the result.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/set/sunionstore.mdx

LANGUAGE: ts
CODE:
```
await redis.sadd("set1", "a", "b", "c");
await redis.sadd("set2", "c", "d", "e");
await redis.sunionstore("destination", "set1", "set2");
```

----------------------------------------

TITLE: ZPOPMAX Command API Documentation
DESCRIPTION: Detailed API documentation for the ZPOPMAX command, outlining its required and optional arguments, and the structure of its returned response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zpopmax.mdx

LANGUAGE: APIDOC
CODE:
```
ZPOPMAX:
  Arguments:
    key: str (required) - The key of the sorted set
    count: int (optional) - The number of members to pop
  Response:
    List[Tuple[str, float]] - A list of tuples containing the popped members and their scores
```

----------------------------------------

TITLE: React Scoreboard with Upstash Redis
DESCRIPTION: This video demonstrates building a React scoreboard that uses Upstash Redis to store and retrieve scores.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: javascript
CODE:
```
// Example score update and retrieval
async function updateScore(playerName, score) {
  await redis.zadd('scoreboard', { score: score, value: playerName });
}

async function getTopScores(count) {
  return await redis.zrevrange('scoreboard', 0, count - 1, { withScores: true });
}
```

----------------------------------------

TITLE: MGET Command
DESCRIPTION: Get the values of all the given keys.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
MGET
```

----------------------------------------

TITLE: TypeScript Example for JSON.ARRTRIM
DESCRIPTION: Demonstrates how to use the `JSON.ARRTRIM` command with the Upstash Redis client in TypeScript, showing a typical asynchronous call.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/arrtrim.mdx

LANGUAGE: ts
CODE:
```
const length = await redis.json.arrtrim("key", "$.path.to.array", 2, 10);
```

----------------------------------------

TITLE: LTRIM Redis Command API Documentation
DESCRIPTION: Detailed API documentation for the LTRIM Redis command, outlining its required arguments (key, start, stop), their types, and the boolean response indicating successful trimming.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/ltrim.mdx

LANGUAGE: APIDOC
CODE:
```
LTRIM Command:
  Description: Trim a list to the specified range
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the list.
    start:
      Type: int
      Required: true
      Description: The index of the first element to keep.
    stop:
      Type: int
      Required: true
      Description: The index of the first element to keep.
  Response:
    Type: bool
    Required: true
    Description: Returns `True` if the list was trimmed, `False` otherwise.
```

----------------------------------------

TITLE: TypeScript Example: LPUSHX with Pre-existing List
DESCRIPTION: Demonstrates how to use `lpushx` in TypeScript with an existing Redis list. It first populates a list using `lpush` and then adds an element with `lpushx`, showing the updated list length.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/lpushx.mdx

LANGUAGE: TypeScript
CODE:
```
await redis.lpush("key", "a", "b", "c"); 
const length = await redis.lpushx("key", "d"); 
console.log(length); // 4
```

----------------------------------------

TITLE: TypeScript Example for DECRBY
DESCRIPTION: Demonstrates how to use the DECRBY command with the Upstash Redis client in TypeScript, showing key initialization, decrementing, and the resulting value.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/string/decrby.mdx

LANGUAGE: typescript
CODE:
```
await redis.set("key", 6);
await redis.decrby("key", 4);
// returns 2
```

----------------------------------------

TITLE: Python Example: Basic JSON.SET Usage
DESCRIPTION: Demonstrates the basic usage of the `redis.json.set` method to set a JSON value at a specified path within a given key.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/set.mdx

LANGUAGE: python
CODE:
```
redis.json.set(key, "$.path", value)
```

----------------------------------------

TITLE: TypeScript Example for ZPOPMIN Command
DESCRIPTION: Demonstrates how to use the ZPOPMIN command with the Upstash Redis client in TypeScript to remove and retrieve elements from a sorted set.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/zset/zpopmin.mdx

LANGUAGE: typescript
CODE:
```
const popped = await redis.zpopmin("key", 4);
```

----------------------------------------

TITLE: TypeScript Example for HKEYS Usage
DESCRIPTION: Demonstrates how to use the `hset` command to set a hash and then retrieve all its field names using `hkeys` in TypeScript, showing the expected output.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hkeys.mdx

LANGUAGE: ts
CODE:
```
await redis.hset("key", {
  id: 1,
  username: "chronark",
  });
const fields = await redis.hkeys("key");
console.log(fields); // ["id", "username"]
```

----------------------------------------

TITLE: Redis TOUCH Command API Reference
DESCRIPTION: Detailed API documentation for the Redis TOUCH command, outlining its required arguments and the structure of its response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/touch.mdx

LANGUAGE: APIDOC
CODE:
```
TOUCH Command:
  Description: Alters the last access time of one or more keys
  Arguments:
    keys:
      Type: *List[str]
      Required: true
      Description: One or more keys.
  Response:
    Type: int
    Description: The number of keys that were touched.
```

----------------------------------------

TITLE: ZPOPMAX TypeScript Example
DESCRIPTION: Illustrates how to call the ZPOPMAX command using the Upstash Redis client in TypeScript, retrieving a specified number of elements.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/zset/zpopmax.mdx

LANGUAGE: ts
CODE:
```
const popped = await redis.zpopmax("key", 4);
```

----------------------------------------

TITLE: Python Example for ZREVRANK Usage
DESCRIPTION: Demonstrates how to use the ZREVRANK command with the Upstash Redis Python client. This example first adds members to a sorted set and then asserts the reverse rank of a specific member.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zrevrank.mdx

LANGUAGE: python
CODE:
```
redis.zadd("myset", {"a": 1, "b": 2, "c": 3})

assert redis.zrevrank("myset", "a") == 2
```

----------------------------------------

TITLE: JSON.ARRINSERT Command API Reference
DESCRIPTION: Comprehensive documentation for the `JSON.ARRINSERT` command, outlining its required parameters, their data types, default values, and a description of the command's functionality and expected return value.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/arrinsert.mdx

LANGUAGE: APIDOC
CODE:
```
JSON.ARRINSERT
  Description: Insert the json values into the array at path before the index (shifts to the right).

  Arguments:
    key:
      Type: string
      Required: true
      Description: The key of the json entry.
    path:
      Type: string
      Default: $
      Description: The path of the array.
    index:
      Type: integer
      Required: true
      Description: The index where to insert the values.
    values:
      Type: ...TValue[]
      Required: true
      Description: One or more values to append to the array.

  Response:
    Type: integer[]
    Required: true
    Description: The length of the array after the insertion.
```

----------------------------------------

TITLE: Example: Sending SET Command as JSON Array in POST Body
DESCRIPTION: Provides a concrete example of sending a Redis `SET` command with arguments (`foo`, `bar`, `EX`, `100`) as a JSON array in the request body of an HTTP POST request to the Upstash REST API.

SOURCE: https://upstash.com/docs/redis/features/restapi.mdx

LANGUAGE: shell
CODE:
```
curl -X POST -d '["SET", "foo", "bar", "EX", 100]' https://us1-merry-cat-32748.upstash.io \
 -H "Authorization: Bearer 2553feg6a2d9842h2a0gcdb5f8efe9934"
```

----------------------------------------

TITLE: Python Example for HPTTL Usage
DESCRIPTION: Illustrates how to set a hash field, apply a millisecond expiration to it, and then retrieve its remaining TTL using the `hpttl` command in Python.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hpttl.mdx

LANGUAGE: python
CODE:
```
redis.hset(hash_name, field, value)
redis.hpexpire(hash_name, field, 1000)

assert redis.hpttl(hash_name, field) == [950]
```

----------------------------------------

TITLE: Serverless Redis on Google Cloud Functions
DESCRIPTION: Learn how to integrate Upstash Redis with Google Cloud Functions. This tutorial provides guidance for deploying serverless applications on Google Cloud.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: Google Cloud
CODE:
```
console.log('This is a placeholder for Google Cloud Functions code.');
```

----------------------------------------

TITLE: Build AWS SAM Application
DESCRIPTION: Compiles and packages the Go Lambda function and other resources defined in the `template.yaml` file. This step prepares the application for local testing or deployment to AWS.

SOURCE: https://upstash.com/docs/redis/tutorials/goapi.mdx

LANGUAGE: Shell
CODE:
```
sam build
```

----------------------------------------

TITLE: Python Example: Setting and Retrieving Hash Field Expiration
DESCRIPTION: This Python example demonstrates how to set a hash field, assign an expiration time to it using `hexpireat`, and then retrieve its expiration time using `hexpiretime`.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hexpiretime.mdx

LANGUAGE: Python
CODE:
```
redis.hset(hash_name, field, value)
redis.hexpireat(hash_name, field, int(time.time()) + 10)

assert redis.hexpiretime(hash_name, field) == [1697059200]
```

----------------------------------------

TITLE: Run Django Development Server
DESCRIPTION: This command starts Django's built-in development server. Once running, the web application becomes accessible locally, typically at `http://127.0.0.1:8000/`, allowing developers to test and interact with the application during development.

SOURCE: https://upstash.com/docs/redis/quickstarts/django.mdx

LANGUAGE: shell
CODE:
```
python manage.py runserver
```

----------------------------------------

TITLE: TypeScript Example for HVALS Command
DESCRIPTION: Demonstrates how to use the HVALS command with Upstash Redis in TypeScript, showing how to set hash fields and then retrieve all values from the hash.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hvals.mdx

LANGUAGE: ts
CODE:
```
await redis.hset("key", {
  field1: "Hello",
  field2: "World"
})
const values = await redis.hvals("key")
console.log(values) // ["Hello", "World"]
```

----------------------------------------

TITLE: Navigate to Project Directory
DESCRIPTION: Changes the current working directory to the newly created 'ratelimit-serverless' project directory, which is a prerequisite for further project setup steps.

SOURCE: https://upstash.com/docs/redis/tutorials/rate-limiting.mdx

LANGUAGE: shell
CODE:
```
cd ratelimit-serverless
```

----------------------------------------

TITLE: Simple ZINTER Usage Example (Python)
DESCRIPTION: Demonstrates basic usage of the ZINTER command in Python to find the intersection of two sets without applying weights or aggregation functions.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zinter.mdx

LANGUAGE: python
CODE:
```
redis.zadd("key1", {"a": 1, "b": 2, "c": 3})

redis.zadd("key2", {"c": 3, "d": 4, "e": 5})

result = redis.zinter(["key1", "key2"])

assert result == ["c"]
```

----------------------------------------

TITLE: TypeScript Example for LLEN Command
DESCRIPTION: Illustrates how to use the `llen` command in TypeScript with the Upstash Redis client. It shows pushing elements to a list and then retrieving its length.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/llen.mdx

LANGUAGE: typescript
CODE:
```
await redis.rpush("key", "a", "b", "c");
const length = await redis.llen("key");
console.log(length); // 3
```

----------------------------------------

TITLE: Python Example for ZRANK Command
DESCRIPTION: Demonstrates how to use the ZRANK command with a Python Redis client. It shows adding members to a sorted set and then asserting the ranks of existing and non-existing members.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zrank.mdx

LANGUAGE: python
CODE:
```
redis.zadd("myset", {"a": 1, "b": 2, "c": 3})

assert redis.zrank("myset", "a") == 0

assert redis.zrank("myset", "d") == None

assert redis.zrank("myset", "b") == 1

assert redis.zrank("myset", "c") == 2
```

----------------------------------------

TITLE: Python Example for HTTL Command Usage
DESCRIPTION: Demonstrates how to use the `httl` command in Python. It first sets a hash field, then applies an expiration, and finally asserts the remaining TTL using `httl`.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/httl.mdx

LANGUAGE: python
CODE:
```
redis.hset(hash_name, field, value)
redis.hexpire(hash_name, field, 10)

assert redis.httl(hash_name, field) == [9]
```

----------------------------------------

TITLE: Python Example for HLEN Redis Command
DESCRIPTION: Demonstrates how to use the HLEN command in Python to retrieve the number of fields in a Redis hash. It includes setting hash fields and then asserting the correct count.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hlen.mdx

LANGUAGE: python
CODE:
```
assert redis.hlen("myhash") == 0

redis.hset("myhash", values={
    "field1": "Hello",
    "field2": "World"
})

assert redis.hlen("myhash") == 2
```

----------------------------------------

TITLE: Apply Multiple Rate Limits with Upstash Ratelimit
DESCRIPTION: This example illustrates how to implement different rate-limiting policies for various user groups, such as free versus paid users. It shows the creation of multiple `Ratelimit` instances, each configured with distinct limits and prefixes, allowing for flexible, tiered access control.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-py/features.mdx

LANGUAGE: python
CODE:
```
from upstash_ratelimit import Ratelimit, SlidingWindow
from upstash_redis import Redis

class MultiRL:
    def __init__(self) -> None:
        redis = Redis.from_env()
        self.free = Ratelimit(
            redis=redis,
            limiter=SlidingWindow(max_requests=10, window=10),
            prefix="ratelimit:free",
        )

        self.paid = Ratelimit(
            redis=redis,
            limiter=SlidingWindow(max_requests=60, window=10),
            prefix="ratelimit:paid",
        )

# Create a new ratelimiter, that allows 10 requests per 10 seconds
ratelimit = MultiRL()

ratelimit.free.limit("userIP")
ratelimit.paid.limit("userIP")
```

----------------------------------------

TITLE: Vercel Edge Function URL Shortener with Upstash Redis
DESCRIPTION: This video shows how to build a URL shortener using Vercel Edge Functions and Upstash Redis, highlighting edge computing capabilities.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: javascript
CODE:
```
// Example logic for an Edge Function
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

export default async function handler(req) {
  const { url } = await req.json();
  const shortCode = Math.random().toString(36).substring(2, 8);
  await redis.set(`url:${shortCode}`, url, 'EX', 86400); // Store for 1 day
  return new Response(JSON.stringify({ shortUrl: `https://your.domain/${shortCode}` }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

----------------------------------------

TITLE: HSET TypeScript Usage Example
DESCRIPTION: Demonstrates how to use the HSET command with the Upstash Redis client in TypeScript, setting multiple fields on a hash key.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hset.mdx

LANGUAGE: typescript
CODE:
```
await redis.hset("key", {
  id: 1,
  username: "chronark",
  name: "andreas"
  });
```

----------------------------------------

TITLE: TypeScript Example for MGET
DESCRIPTION: Demonstrates how to use the `mget` method with Upstash Redis in TypeScript, including type definition and an asynchronous call to retrieve multiple keys.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/string/mget.mdx

LANGUAGE: TypeScript
CODE:
```
type MyType = {
    a: number;
    b: string;
}
const values = await redis.mget<MyType>("key1", "key2", "key3");
// values.length -> 3
```

----------------------------------------

TITLE: Configure Redis Connection URL
DESCRIPTION: Example of setting the 'REDIS_URL' environment variable in a '.env' file, which is used by the application to connect to the Upstash Redis database.

SOURCE: https://upstash.com/docs/redis/tutorials/auto_complete_with_serverless_redis.mdx

LANGUAGE: text
CODE:
```
REDIS_URL=YOUR_REDIS_URL
```

----------------------------------------

TITLE: Python Example for JSON.NUMINCRBY
DESCRIPTION: Demonstrates how to use the `redis.json.numincrby` method in Python to increment a numeric value at a specified path within a JSON document.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/numincrby.mdx

LANGUAGE: Python
CODE:
```
newValue = redis.json.numincrby("key", "$.path.to.value", 2)
```

----------------------------------------

TITLE: ZPOPMIN Redis Command API Reference
DESCRIPTION: Detailed API documentation for the ZPOPMIN command, outlining its arguments, their types and requirements, and the structure of the response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zpopmin.mdx

LANGUAGE: APIDOC
CODE:
```
ZPOPMIN:
  Description: Removes and returns up to count members with the lowest scores in the sorted set stored at key.
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the sorted set
    count:
      Type: int
      Required: false
      Description: The number of members to pop
  Response:
    Type: List[Tuple[str, float]]
    Description: A list of tuples containing the popped members and their scores
```

----------------------------------------

TITLE: ZPOPMIN Redis Command API Reference
DESCRIPTION: Detailed API documentation for the ZPOPMIN command, outlining its purpose, required arguments, and the structure of its response.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/zset/zpopmin.mdx

LANGUAGE: APIDOC
CODE:
```
ZPOPMIN:
  description: Removes and returns up to count members with the lowest scores in the sorted set stored at key.
  arguments:
    key:
      type: string
      required: true
      description: The key of the sorted set
  response:
    count:
      type: integer
      description: The number of elements removed. Defaults to 1.
```

----------------------------------------

TITLE: Python Example for EVALSHA_RO Command
DESCRIPTION: Demonstrates how to use the `evalsha_ro` method in Python to execute a cached read-only Lua script with a given SHA1 hash and arguments.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/scripts/evalsha_ro.mdx

LANGUAGE: py
CODE:
```
result = redis.evalsha_ro("fb67a0c03b48ddbf8b4c9b011e779563bdbc28cb", args=["hello"])
assert result = "hello"
```

----------------------------------------

TITLE: Publish Message to Redis Channel (TypeScript)
DESCRIPTION: An example demonstrating how to publish a message to a Redis channel using the `redis.publish` method in TypeScript, capturing the number of listeners.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/pubsub/publish.mdx

LANGUAGE: typescript
CODE:
```
const listeners = await redis.publish("my-topic", "my-message");
```

----------------------------------------

TITLE: LPUSH Command Usage Example in Python
DESCRIPTION: Demonstrates how to use the LPUSH command with a Redis client in Python to add multiple elements to the head of a list, and then verifies the list's content and order using LRANGE.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/lpush.mdx

LANGUAGE: Python
CODE:
```
assert redis.lpush("mylist", "one", "two", "three") == 3

assert lrange("mylist", 0, -1) == ["three", "two", "one"]
```

----------------------------------------

TITLE: TOUCH Command API Reference
DESCRIPTION: Detailed API documentation for the Redis TOUCH command, outlining its required arguments and the structure of its response.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/generic/touch.mdx

LANGUAGE: APIDOC
CODE:
```
TOUCH Command:
  Description: Alters the last access time of one or more keys

  Arguments:
    keys:
      Type: ...string[]
      Required: true
      Description: One or more keys.

  Response:
    Type: integer
    Required: true
    Description: The number of keys that were touched.
```

----------------------------------------

TITLE: Python Example for UNLINK Command
DESCRIPTION: Demonstrates how to use the UNLINK command with the Upstash Redis client in Python, asserting the number of keys unlinked.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/unlink.mdx

LANGUAGE: python
CODE:
```
assert redis.unlink("key1", "key2", "key3") == 3
```

----------------------------------------

TITLE: Python Example for DECR Command
DESCRIPTION: Demonstrates how to use the DECR command in Python with the 'redis' client, including setting an initial value and asserting the decremented result.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/string/decr.mdx

LANGUAGE: python
CODE:
```
redis.set("key", 6)

assert redis.decr("key") == 5
```

----------------------------------------

TITLE: Python Example for LTRIM Redis Command
DESCRIPTION: Demonstrates how to use the LTRIM command with a Python Redis client. It shows pushing elements to a list, trimming it, and then verifying the list's content after trimming.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/ltrim.mdx

LANGUAGE: Python
CODE:
```
redis.rpush("mylist", "one", "two", "three")

assert redis.ltrim("mylist", 0, 1) == True

assert redis.lrange("mylist", 0, -1) == ["one", "two"]
```

----------------------------------------

TITLE: TypeScript Example for SADD Command
DESCRIPTION: Illustrates how to use the SADD command with the Upstash Redis client in TypeScript, showing the expected return values for different scenarios.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/set/sadd.mdx

LANGUAGE: typescript
CODE:
```
// 3
await redis.sadd("key", "a", "b", "c"); 

// 0
await redis.sadd("key", "a", "b");
```

----------------------------------------

TITLE: TypeScript Example for ZCOUNT
DESCRIPTION: This example demonstrates how to use the `zcount` command with the `upstash-redis` client in TypeScript. It shows adding elements to a sorted set and then counting elements within a specific score range.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/zset/zcount.mdx

LANGUAGE: TypeScript
CODE:
```
await redis.zadd("key", 
    { score: 1, member: "one"}, 
    { score: 2, member: "two" }
);
const elements = await redis.zcount("key", "(1", "+inf");
console.log(elements); // 1
```

----------------------------------------

TITLE: XRANGE Command API Reference
DESCRIPTION: Detailed API documentation for the XRANGE command, outlining its parameters (key, start, end, count) with their types and descriptions, and specifying the structure of the returned stream entries.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/stream/xrange.mdx

LANGUAGE: APIDOC
CODE:
```
XRANGE Command:
  Description: Returns stream entries matching a given range of IDs.
  Arguments:
    key (string, required): The key of the stream.
    start (string, required): The stream entry ID to start from.
    end (string, required): The stream entry ID to end at.
    count (integer, optional): The maximum number of entries to return.
  Response:
    Type: Record<streamId, Record<field, value>>
    Description: An object of stream entries, keyed by their stream ID.
```

----------------------------------------

TITLE: Python Example: Using SDIFF with Upstash Redis
DESCRIPTION: Illustrates how to use the SDIFF command in Python with the Upstash Redis client. It demonstrates adding elements to two sets and then asserting the correct difference between them.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/set/sdiff.mdx

LANGUAGE: py
CODE:
```
redis.sadd("set1", "a", "b", "c");
redis.sadd("set2", "c", "d", "e");

assert redis.sdiff("set1", "set2") == {"a", "b"}
```

----------------------------------------

TITLE: Publish Messages with Upstash QStash Client
DESCRIPTION: This example shows how to create an Upstash QStash client and publish a JSON message. The client is initialized with a token from `process.env.QSTASH_TOKEN`. It demonstrates publishing a message to a specified URL with a JSON body.

SOURCE: https://upstash.com/docs/redis/howto/vercelintegration.mdx

LANGUAGE: ts
CODE:
```
import { Client } from "@upstash/qstash";

const c = new Client({
  token: process.env.QSTASH_TOKEN,
});

const res = await c.publishJSON({
  url: "https://my-api...",
  body: {
    hello: "world",
  },
});
```

----------------------------------------

TITLE: Rate Limiting Serverless Functions with Upstash Redis
DESCRIPTION: This video covers implementing rate limiting for serverless functions using Upstash Redis, preventing abuse and managing load.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: javascript
CODE:
```
// Example rate limiting logic
const MAX_REQUESTS = 100;
const WINDOW_SECONDS = 60;

async function checkRateLimit(userId) {
  const key = `rate_limit:${userId}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }
  return count <= MAX_REQUESTS;
}
```

----------------------------------------

TITLE: Create Upstash Redis Database
DESCRIPTION: This snippet demonstrates how to create a new Upstash Redis database using the Upstash API. It includes both a CURL command example for direct execution and a structured API documentation outlining the endpoint, method, authentication, and request body parameters required for database creation.

SOURCE: https://upstash.com/docs/redis/help/integration.mdx

LANGUAGE: bash
CODE:
```
curl -X POST \
  https://api.upstash.com/v2/redis/database \
  -u 'EMAIL:API_KEY' \
  -d '{"name":"myredis", "region":"global", "primary_region":"us-east-1", "read_regions":["us-west-1","us-west-2"], "tls": true}'
```

LANGUAGE: APIDOC
CODE:
```
Endpoint: POST https://api.upstash.com/v2/redis/database
Authentication: Basic (EMAIL:API_KEY)
Request Body (application/json):
  name: string (required) - The name of the database.
  region: string (required) - The global region for the database (e.g., "global").
  primary_region: string (required) - The primary AWS region for the database (e.g., "us-east-1").
  read_regions: array of strings (optional) - List of AWS regions for read replicas (e.g., ["us-west-1","us-west-2"]).
  tls: boolean (optional) - Enable TLS for the database connection.
```

----------------------------------------

TITLE: TypeScript Example for JSON.MERGE
DESCRIPTION: An example demonstrating how to use the `JSON.MERGE` command with the Upstash Redis client in TypeScript. This snippet shows merging a new object into a specific path within a JSON document stored in Redis.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/merge.mdx

LANGUAGE: ts
CODE:
```
await redis.json.merge("key", "$.path.to.value", {"new": "value"})
```

----------------------------------------

TITLE: Python Example for GETRANGE Command
DESCRIPTION: Illustrates how to use the GETRANGE command in Python with the Upstash Redis client. It demonstrates setting a key with a string value and then retrieving a substring using `redis.getrange`, followed by an assertion to verify the result.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/string/getrange.mdx

LANGUAGE: python
CODE:
```
redis.set("key", "Hello World")

assert redis.getrange("key", 0, 4) == "Hello"
```

----------------------------------------

TITLE: Python Example for JSON.GET Usage
DESCRIPTION: Demonstrates how to invoke the JSON.GET method using a Python Redis client to retrieve a value from a JSON document at a specified path.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/get.mdx

LANGUAGE: Python
CODE:
```
value = redis.json.get("key", "$.path.to.somewhere")
```

----------------------------------------

TITLE: TypeScript Example for HEXPIRE Usage
DESCRIPTION: Illustrates how to use the `hexpire` method with an Upstash Redis client in TypeScript. This example demonstrates setting a value in a hash and then applying an expiration to a specific field, showing the expected output.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hexpire.mdx

LANGUAGE: TypeScript
CODE:
```
await redis.hset("my-key", "my-field", "my-value");
const expirationSet = await redis.hexpire("my-key", "my-field", 1);

console.log(expirationSet); // 1
```

----------------------------------------

TITLE: TypeScript Examples for HRANDFIELD Command
DESCRIPTION: Illustrative TypeScript code snippets demonstrating how to use the `hrandfield` command with different parameters, including basic usage, retrieving multiple fields, and retrieving fields with their corresponding values.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hrandfield.mdx

LANGUAGE: ts
CODE:
```
await redis.hset("key", {
  id: 1,
  username: "chronark",
  name: "andreas"
 });
const randomField = await redis.hrandfield("key");
console.log(randomField); // one of "id", "username" or  "name"
```

LANGUAGE: ts
CODE:
```
await redis.hset("key", {
  id: 1,
  username: "chronark",
  name: "andreas",
});
const randomFields = await redis.hrandfield("key", 2);
console.log(randomFields); // ["id", "username"] or any other combination
```

LANGUAGE: ts
CODE:
```
await redis.hset("key", {
  id: 1,
  username: "chronark",
  name: "andreas",
});
const randomFields = await redis.hrandfield("key", 2, true);
console.log(randomFields); // { id: "1", username: "chronark" } or any other combination
```

----------------------------------------

TITLE: Python Example for SADD Command
DESCRIPTION: Illustrates how to use the SADD command in Python to add multiple members to a Redis set and assert the number of added elements.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/set/sadd.mdx

LANGUAGE: python
CODE:
```
assert redis.sadd("key", "a", "b", "c") == 3
```

----------------------------------------

TITLE: Redis SCRIPT LOAD Command API Reference
DESCRIPTION: Detailed API documentation for the Redis `SCRIPT LOAD` command, outlining its required arguments and the structure of its response.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/scripts/script_load.mdx

LANGUAGE: APIDOC
CODE:
```
SCRIPT LOAD Command:
  Description: Load the specified Lua script into the script cache.
  Arguments:
    script:
      Type: string
      Required: true
      Description: The script to load.
  Response:
    Type: string
    Required: true
    Description: The sha1 of the script.
```

----------------------------------------

TITLE: Start Serverless Development Session
DESCRIPTION: Provides the command to initiate a local development session for the Serverless service. This allows for testing and debugging the Lambda function locally before deployment.

SOURCE: https://upstash.com/docs/redis/tutorials/rate-limiting.mdx

LANGUAGE: shell
CODE:
```
serverless dev
```

----------------------------------------

TITLE: Python URL Shortener Application Core Logic
DESCRIPTION: This comprehensive Python script defines the main functionalities of the URL shortener. It includes functions for generating unique short codes, storing original URLs in Redis with an optional expiration time, and retrieving the original URL based on a given short code. The script also demonstrates example usage within its `if __name__ == "__main__":` block.

SOURCE: https://upstash.com/docs/redis/tutorials/python_url_shortener.mdx

LANGUAGE: python
CODE:
```
import string
import random
from upstash_redis import Redis
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Redis connection
redis = Redis.from_env()

# Characters to generate the short URL from
CHARS = string.ascii_letters + string.digits
BASE_URL = "https://short.url/"

# Function to generate a random string for the short URL
def generate_short_code(length=6):
    return ''.join(random.choices(CHARS, k=length))

# Function to shorten the URL with an expiration time
def shorten_url(url, expiration=3600):
    # Generate a random short code
    short_code = generate_short_code()
    # Save the short code in Redis
    redis.set(short_code, url, ex=expiration)
    return BASE_URL + short_code

# Function to get the original URL from the short URL
def get_original_url(short_code):
    return redis.get(short_code)

# Example usage
if __name__ == "__main__":
    original_url = "https://example.com/my-very-long-url"

    # Shorten the URL
    short_url = shorten_url(original_url, expiration=600)
    print(f"Shortened URL: {short_url}")

    # Get the original URL
    original_url = get_original_url(short_url.split("/")[-1])

    if original_url:
        print(f"Original URL: {original_url}")
    else:
        print("Short URL expired or not found")
```

----------------------------------------

TITLE: API Reference: RENAMENX Command
DESCRIPTION: Detailed API documentation for the RENAMENX command, outlining its arguments, expected response, and behavior.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/renamenx.mdx

LANGUAGE: APIDOC
CODE:
```
RENAMENX Command:
  Description: Renames a key, only if the new key does not exist. Throws an exception if the key does not exist.
  Arguments:
    source:
      Type: str
      Required: true
      Description: The original key.
    destination:
      Type: str
      Required: true
      Description: A new name for the key.
  Response:
    Type: bool
    Required: true
    Description: True if key was renamed
```

----------------------------------------

TITLE: XRANGE Command API Reference
DESCRIPTION: Documents the XRANGE command for Redis streams, detailing its required arguments (key, start, end) and optional arguments (count), along with the structure of its response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/stream/xrange.mdx

LANGUAGE: APIDOC
CODE:
```
XRANGE Command:
  Description: Returns stream entries matching a given range of IDs.
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the stream.
    start:
      Type: str
      Required: true
      Description: The stream entry ID to start from.
    end:
      Type: str
      Required: true
      Description: The stream entry ID to end at.
    count:
      Type: int
      Required: false
      Description: The maximum number of entries to return.
  Response:
    Type: Record<streamId, Record<field, value>>
    Description: An object of stream entries, keyed by their stream ID.
```

----------------------------------------

TITLE: TypeScript Example: LPUSHX on Non-existent List
DESCRIPTION: Illustrates the behavior of `lpushx` when attempting to push to a Redis list that does not exist. The command returns 0, indicating no elements were pushed and the list was not created.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/lpushx.mdx

LANGUAGE: TypeScript
CODE:
```
const length = await redis.lpushx("key", "a"); 
console.log(length); // 0
```

----------------------------------------

TITLE: Python Example for HDEL Command
DESCRIPTION: Illustrates how to use the HDEL command in Python to delete multiple fields from a Redis hash and verify the number of deleted fields.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hdel.mdx

LANGUAGE: py
CODE:
```
redis.hset("myhash", "field1", "Hello")
redis.hset("myhash", "field2", "World")

assert redis.hdel("myhash", "field1", "field2") == 2
```

----------------------------------------

TITLE: Python Example for ZDIFFSTORE Command
DESCRIPTION: Demonstrates how to use the ZDIFFSTORE command with a Redis client in Python. It first adds elements to two sorted sets, then calculates the difference between them and stores the result in a new destination key, asserting the correct count of elements.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zdiffstore.mdx

LANGUAGE: python
CODE:
```
redis.zadd("key1", {"a": 1, "b": 2, "c": 3})

redis.zadd("key2", {"c": 3, "d": 4, "e": 5})

# a and b
assert redis.zdiffstore("dest", ["key1", "key2"]) == 2
```

----------------------------------------

TITLE: ZINTERSTORE API Reference
DESCRIPTION: Comprehensive documentation for the ZINTERSTORE command, detailing its arguments, their types, default values, and the expected response structure.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zinterstore.mdx

LANGUAGE: APIDOC
CODE:
```
ZINTERSTORE:
  Description: Calculates the intersection of sets and stores the result in a key.
  Arguments:
    destination (str, required): The key to store the result in.
    keys (List[str], required): The keys of the sets to compare.
    weights (List[float], optional, default=None): The weights to apply to the sets.
    aggregate ("SUM" | "MIN" | "MAX", optional, default="sum"): The aggregation function to apply to the sets.
    withscores (bool, optional, default=false): Whether to include scores in the result.
  Response:
    (integer, required): The number of elements in the resulting set.
```

----------------------------------------

TITLE: Initialize BullMQ Queue with Upstash Redis Connection
DESCRIPTION: This JavaScript snippet demonstrates how to import the Queue class from 'bullmq' and initialize a new queue. It configures the queue to connect to an Upstash Redis instance using provided host, port, and password. The example also shows an asynchronous function to add multiple jobs to the created queue.

SOURCE: https://upstash.com/docs/redis/integrations/bullmq.mdx

LANGUAGE: javascript
CODE:
```
import { Queue } from 'bullmq';

const myQueue = new Queue('foo', { connection: {
        host: "UPSTASH_REDIS_ENDPOINT",
        port: 6379,
        password: "UPSTASH_REDIS_PASSWORD",
        tls: {}
    }});

async function addJobs() {
    await myQueue.add('myJobName', { foo: 'bar' });
    await myQueue.add('myJobName', { qux: 'baz' });
}

await addJobs();
```

----------------------------------------

TITLE: Configure Upstash Redis Environment Variables
DESCRIPTION: Example `.env` file configuration for storing Upstash Redis connection details, including the REST URL and Token, which are essential for the application to connect to the database.

SOURCE: https://upstash.com/docs/redis/quickstarts/vercel-functions-app-router.mdx

LANGUAGE: shell
CODE:
```
UPSTASH_REDIS_REST_URL=<YOUR_URL>
UPSTASH_REDIS_REST_TOKEN=<YOUR_TOKEN>
```

----------------------------------------

TITLE: Initialize Sliding Window Ratelimit with Upstash Redis
DESCRIPTION: Shows how to configure a sliding window ratelimiter using `upstash_ratelimit` and `upstash_redis`. This setup defines a limit of 10 requests per 10-second window, leveraging the rolling window concept.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-py/algorithms.mdx

LANGUAGE: python
CODE:
```
from upstash_ratelimit import Ratelimit, SlidingWindow
from upstash_redis import Redis

ratelimit = Ratelimit(
    redis=Redis.from_env(),
    limiter=SlidingWindow(max_requests=10, window=10),
)
```

----------------------------------------

TITLE: ZINTER with Aggregation Example (Python)
DESCRIPTION: Illustrates how to use the ZINTER command with the 'SUM' aggregation function and 'withscores' option in Python to sum scores of intersecting elements.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zinter.mdx

LANGUAGE: python
CODE:
```
redis.zadd("key1", {"a": 1, "b": 2, "c": 3})

redis.zadd("key2", {"a": 3, "b": 4, "c": 5})

result = redis.zinter(["key1", "key2"], withscores=True, aggregate="SUM")

assert result == [("a", 4), ("b", 6), ("c", 8)]
```

----------------------------------------

TITLE: TypeScript Example for Redis TTL
DESCRIPTION: A TypeScript code snippet demonstrating how to use the `ttl` method with the Upstash Redis client to retrieve the time-to-live for a specified key.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/generic/ttl.mdx

LANGUAGE: ts
CODE:
```
const seconds = await redis.ttl(key);
```

----------------------------------------

TITLE: Python XADD Basic Usage Example
DESCRIPTION: Demonstrates how to use the XADD command in Python to append a new entry to a Redis stream. It shows adding a simple key-value pair with an auto-generated ID.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/stream/xadd.mdx

LANGUAGE: py
CODE:
```
redis.xadd(key, "*", { name: "John Doe", age: 30 })
```

----------------------------------------

TITLE: Connect to Upstash Redis using jedis (Java)
DESCRIPTION: This example demonstrates connecting to an Upstash Redis database using the `jedis` library in Java. It creates a Jedis instance with the endpoint, port, and SSL enabled, authenticates with the password, and then sets and retrieves a string value.

SOURCE: https://upstash.com/docs/redis/howto/connectclient.mdx

LANGUAGE: java
CODE:
```
Jedis jedis = new Jedis("YOUR_ENDPOINT", "YOUR_PORT", true);
jedis.auth("YOUR_PASSWORD");
jedis.set("foo", "bar");
String value = jedis.get("foo");
System.out.println(value);
```

----------------------------------------

TITLE: HPTTL Usage Example (TypeScript)
DESCRIPTION: Illustrates a practical use case of the `hpttl` command in TypeScript, showing how to set a hash field, set its expiration, and then retrieve its remaining TTL.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hpttl.mdx

LANGUAGE: typescript
CODE:
```
await redis.hset("my-key", "my-field", "my-value");
await redis.hpexpire("my-key", "my-field", 1000);
const ttl = await redis.hpttl("my-key", "my-field");

console.log(ttl); // e.g., [950]
```

----------------------------------------

TITLE: Upstash Pipelining API Example Response
DESCRIPTION: Illustrates a sample JSON response from the Upstash pipelining API for the previously shown batch of commands, showing individual results and an error for the `INCR` command on a non-integer value.

SOURCE: https://upstash.com/docs/redis/features/restapi.mdx

LANGUAGE: json
CODE:
```
[
  { "result": "OK" },
  { "result": "OK" },
  { "error": "ERR value is not an int or out of range" },
  { "result": 2 }
]
```

----------------------------------------

TITLE: Example Usage of MSETNX in TypeScript
DESCRIPTION: This code snippet demonstrates how to use the MSETNX command with the Upstash Redis client in TypeScript. It shows setting multiple key-value pairs in a single operation.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/string/msetnx.mdx

LANGUAGE: TypeScript
CODE:
```
redis.msetnx({
  "key1": "value1",
  "key2": "value2"
})
```

----------------------------------------

TITLE: Pipeline REST API on Serverless Redis
DESCRIPTION: This article explains how to leverage the pipeline feature of Redis through a REST API, enhancing performance for multiple operations.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: REST-API
CODE:
```
APIDOC:
  Endpoint: /pipeline
  Method: POST
  Description: Execute multiple Redis commands in a single request.
  Request Body:
    commands: Array of command objects
      command: string (e.g., 'SET', 'GET')
      args: Array of strings (command arguments)
  Response:
    status: success
    results: Array of command results
```

----------------------------------------

TITLE: Redis BITPOS Command API Documentation
DESCRIPTION: Documents the Redis BITPOS command, including its required and optional arguments (key, bit, start, end) and the expected integer response, representing the index of the first occurrence of the specified bit.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/bitmap/bitpos.mdx

LANGUAGE: APIDOC
CODE:
```
BITPOS Command:
  Description: Find the position of the first set or clear bit (bit with a value of 1 or 0) in a Redis string key.
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key to search in.
    bit:
      Type: 0 | 1
      Required: true
      Description: The bit value (0 or 1) to search for.
    start:
      Type: int
      Required: false
      Description: The index to start searching at.
    end:
      Type: int
      Required: false
      Description: The index to stop searching at.
  Response:
    Type: int
    Required: true
    Description: The index of the first occurrence of the bit in the string.
```

----------------------------------------

TITLE: Serverless Histogram API with Redis
DESCRIPTION: Build a serverless histogram API using Upstash Redis. This tutorial focuses on AWS Lambda and Node.js, detailing how to create and query histograms efficiently.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: Node.js
CODE:
```
console.log('This is a placeholder for Node.js code related to histogram API.');
```

----------------------------------------

TITLE: Python Example for Sorted Set Operations
DESCRIPTION: Illustrates common sorted set operations in Python, specifically adding members with `redis.zadd` and then verifying the count of elements using `redis.zlexcount`. This example is related to sorted set management.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zmscore.mdx

LANGUAGE: Python
CODE:
```
redis.zadd("myset", {"a": 1, "b": 2, "c": 3})

assert redis.zlexcount("myset", "-", "+") == 3
```

----------------------------------------

TITLE: Create New Serverless Java Project
DESCRIPTION: Initializes a new serverless project named 'counter-api' using the 'aws-java-maven' template. This sets up the basic project structure for a Java-based AWS Lambda function.

SOURCE: https://upstash.com/docs/redis/tutorials/serverless_java_redis.mdx

LANGUAGE: shell
CODE:
```
serverless create --template aws-java-maven --name counter-api -p aws-java-counter-api
```

----------------------------------------

TITLE: TypeScript Example for SMEMBERS Command Usage
DESCRIPTION: Illustrates how to interact with the `SMEMBERS` command using an Upstash Redis client in TypeScript. It shows adding elements to a set and then fetching all members.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/set/smembers.mdx

LANGUAGE: ts
CODE:
```
await redis.sadd("set", "a", "b", "c"); 
const members =  await redis.smembers("set");
console.log(members); // ["a", "b", "c"]
```

----------------------------------------

TITLE: Hash Commands API Reference
DESCRIPTION: Documentation for hash-related commands available in the @upstash/redis SDK.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: APIDOC
CODE:
```
HDEL:
  description: 
```

LANGUAGE: APIDOC
CODE:
```
HEXISTS:
  description: 
```

LANGUAGE: APIDOC
CODE:
```
HEXPIRE:
  description: 
```

LANGUAGE: APIDOC
CODE:
```
HEXPIREAT:
  description: 
```

LANGUAGE: APIDOC
CODE:
```
HEXPIRETIME:
  description: 
```

LANGUAGE: APIDOC
CODE:
```
HGET:
  description: 
```

LANGUAGE: APIDOC
CODE:
```
HGETALL:
  description: 
```

LANGUAGE: APIDOC
CODE:
```
HINCRBY:
  description: 
```

LANGUAGE: APIDOC
CODE:
```
HINCRBYFLOAT:
  description: 
```

LANGUAGE: APIDOC
CODE:
```
HKEYS:
  description: 
```

LANGUAGE: APIDOC
CODE:
```
HLEN:
  description: 
```

LANGUAGE: APIDOC
CODE:
```
HMGET:
  description: 
```

LANGUAGE: APIDOC
CODE:
```
HPERSIST:
  description: 
```

LANGUAGE: APIDOC
CODE:
```
HPEXPIRE:
  description: 
```

LANGUAGE: APIDOC
CODE:
```
HPEXPIREAT:
  description: 
```

LANGUAGE: APIDOC
CODE:
```
HPEXPIRETIME:
  description: 
```

LANGUAGE: APIDOC
CODE:
```
HPTTL:
  description: 
```

LANGUAGE: APIDOC
CODE:
```
HRANDFIELD:
  description: 
```

----------------------------------------

TITLE: Implement Sliding Window Ratelimiting with Upstash Redis
DESCRIPTION: Shows how to create a ratelimiter using the sliding window algorithm, allowing 10 requests per 10 seconds. Examples are provided for regional and multi-regional Upstash Redis configurations, with a warning about multi-regional usage.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-ts/algorithms.mdx

LANGUAGE: ts
CODE:
```
const ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "10 s"),
    });
```

LANGUAGE: ts
CODE:
```
const ratelimit = new MultiRegionRatelimit({
      redis: [
        new Redis({
          /* auth */
        }),
        new Redis({
          /* auth */
        })
      ],
      limiter: MultiRegionRatelimit.slidingWindow(10, "10 s"),
    });
```

----------------------------------------

TITLE: Python Example for JSON.ARRINDEX
DESCRIPTION: Demonstrates how to use the `json.arrindex` method in Python with the Upstash Redis client to find the index of a value within a JSON array.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/arrindex.mdx

LANGUAGE: python
CODE:
```
index = redis.json.arrindex("key", "$.path.to.array", "a")
```

----------------------------------------

TITLE: Redis BitFieldCommands API Reference
DESCRIPTION: Detailed API documentation for the `BitFieldCommands` instance, which facilitates chained bitfield operations in Redis. It includes definitions for the `get`, `set`, and `incr` methods, along with general arguments and response structure for the bitfield command.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/bitmap/bitfield.mdx

LANGUAGE: APIDOC
CODE:
```
BitFieldCommands:
  description: Instance returned by the `redis.bitfield()` function for executing multiple bitfield operations.
  arguments:
    key:
      type: str
      required: true
      description: The string key to operate on.
  response:
    type: List[int]
    required: true
    description: A list of integers, one for each operation executed.
  methods:
    get(type: str, offset: int)
      description: Returns a value from the bitfield at the given offset.
      parameters:
        type: str (e.g., 'u4', 'i8')
        offset: int
    set(type: str, offset: int, value: int)
      description: Sets a value and returns the old value.
      parameters:
        type: str
        offset: int
        value: int
    incr(type: str, offset: int, increment: int)
      description: Increments a value and returns the new value.
      parameters:
        type: str
        offset: int
        increment: int
```

----------------------------------------

TITLE: Deploy Serverless Service to AWS
DESCRIPTION: Command to deploy the configured Serverless service and its functions to AWS Lambda, making them accessible via the defined HTTP API endpoint.

SOURCE: https://upstash.com/docs/redis/tutorials/using_serverless_framework.mdx

LANGUAGE: shell
CODE:
```
serverless deploy
```

----------------------------------------

TITLE: ZPOPMIN Command
DESCRIPTION: No description

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
ZPOPMIN
```

----------------------------------------

TITLE: Start Celery Worker for Task Execution
DESCRIPTION: Command to start the Celery worker process, which listens for and executes tasks defined in the `tasks.py` module. The `--loglevel=info` flag provides detailed output during execution.

SOURCE: https://upstash.com/docs/redis/integrations/celery.mdx

LANGUAGE: bash
CODE:
```
celery -A tasks worker --loglevel=info
```

----------------------------------------

TITLE: TypeScript XADD with Trimming Options
DESCRIPTION: Illustrates appending an entry to a Redis stream while simultaneously applying trimming rules. This example uses `MAXLEN` to limit the stream's length to 1000 entries.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/stream/xadd.mdx

LANGUAGE: ts
CODE:
```
await redis.xadd(key, "*", { name: "John Doe", age: 30 }, {
  trim: {
    type: "MAXLEN",
    threshold: 1000,
    comparison: "=",
  },
});
```

----------------------------------------

TITLE: Auth Commands API Reference
DESCRIPTION: Documentation for authentication-related commands available in the @upstash/redis SDK.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: APIDOC
CODE:
```
ECHO:
  description: Echo the given string.
```

LANGUAGE: APIDOC
CODE:
```
PING:
  description: Ping the server.
```

----------------------------------------

TITLE: Run Python Script
DESCRIPTION: This snippet provides the command-line instruction to execute the main Python script associated with the project. Ensure Python is installed and the script file 'your_script_name.py' is accessible in the current directory.

SOURCE: https://upstash.com/docs/redis/tutorials/python_multithreading.mdx

LANGUAGE: bash
CODE:
```
python your_script_name.py
```

----------------------------------------

TITLE: Run Express Application
DESCRIPTION: Executes the 'index.js' file using Node.js to start the Express server, making the application accessible on the configured port (e.g., 3000).

SOURCE: https://upstash.com/docs/redis/tutorials/express_session.mdx

LANGUAGE: bash
CODE:
```
node index.js
```

----------------------------------------

TITLE: TypeScript LPOP Usage Examples
DESCRIPTION: Demonstrates how to use the LPOP command in TypeScript with Upstash Redis to pop single or multiple elements from a list, showing the expected output for each scenario.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/lpop.mdx

LANGUAGE: ts
CODE:
```
await redis.rpush("key", "a", "b", "c");
const element = await redis.lpop("key");
console.log(element); // "a"
```

LANGUAGE: ts
CODE:
```
await redis.rpush("key", "a", "b", "c");
const element = await redis.lpop("key", 2);
console.log(element); // ["a", "b"]
```

----------------------------------------

TITLE: Job Processing with AWS Lambda and Node.js
DESCRIPTION: Learn how to implement job processing and event queues using Upstash Redis with AWS Lambda and Node.js. This tutorial covers setting up the environment and handling asynchronous tasks.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: Node.js
CODE:
```
console.log('This is a placeholder for Node.js code related to job processing.');
```

----------------------------------------

TITLE: Initialize AWS CDK Project
DESCRIPTION: Initializes a new AWS CDK application within the current directory, setting up the basic project structure with TypeScript as the chosen language.

SOURCE: https://upstash.com/docs/redis/tutorials/pythonapi.mdx

LANGUAGE: shell
CODE:
```
cdk init app --language typescript
```

----------------------------------------

TITLE: Python Example for SUNION Command
DESCRIPTION: Demonstrates how to use the `SUNION` command with a Python Redis client. It adds elements to two sets and then performs a union operation, asserting the correct combined set as the result.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/set/sunion.mdx

LANGUAGE: py
CODE:
```
redis.sadd("key1", "a", "b", "c")

redis.sadd("key2", "c", "d", "e")

assert redis.sunion("key1", "key2") == {"a", "b", "c", "d", "e"}
```

----------------------------------------

TITLE: Start FastAPI Development Server
DESCRIPTION: This command initiates the FastAPI application in development mode. The --reload flag enables automatic server restarts upon code changes, facilitating rapid development and testing.

SOURCE: https://upstash.com/docs/redis/tutorials/python_session.mdx

LANGUAGE: bash
CODE:
```
uvicorn main:app --reload
```

----------------------------------------

TITLE: HPTTL API Documentation
DESCRIPTION: Comprehensive documentation for the HPTTL command, outlining its required parameters, expected response format, and specific return values for different scenarios.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hpttl.mdx

LANGUAGE: APIDOC
CODE:
```
HPTTL Command:
  Description: Retrieves the remaining time-to-live (TTL) for field(s) in a hash in milliseconds.
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the hash.
    fields:
      Type: Union[str, List[str]]
      Required: true
      Description: The field or list of fields to retrieve the TTL for.
  Response:
    Type: List[int]
    Required: true
    Description: A list of integers representing the remaining TTL in milliseconds for each field.
      - -2 if the field does not exist in the hash or if the key doesn't exist.
      - -1 if the field exists but has no associated expiration.
    See Also: https://redis.io/commands/hpttl
```

----------------------------------------

TITLE: Python Example for HPEXPIRE Usage
DESCRIPTION: Illustrates how to use the `hpexpire` command in a Python application with the `upstash-redis` client, including a preceding `hset` operation for context.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hpexpire.mdx

LANGUAGE: python
CODE:
```
redis.hset(hash_name, field, value)

assert redis.hpexpire(hash_name, field, 1000) == [1]
```

----------------------------------------

TITLE: Python Example: JSON.SET with XX Option
DESCRIPTION: Shows how to use the `xx=true` option with `redis.json.set` to set a JSON value only if the specified path already exists within the key.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/set.mdx

LANGUAGE: python
CODE:
```
value = ...
redis.json.set(key, "$.path", value, xx=true)
```

----------------------------------------

TITLE: ZINTERSTORE Command
DESCRIPTION: No description

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
ZINTERSTORE
```

----------------------------------------

TITLE: TypeScript Example: Set and Expire Key with EXPIREAT
DESCRIPTION: Illustrates how to use the `expireat` command in TypeScript to set an expiration timestamp on a Redis key. This example first sets a key and then applies an expiration 10 seconds from the current time.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/generic/expireat.mdx

LANGUAGE: typescript
CODE:
```
await redis.set("mykey", "Hello");
const tenSecondsFromNow = Math.floor(Date.now() / 1000) + 10;
await redis.expireat("mykey", tenSecondsFromNow);
```

----------------------------------------

TITLE: SPOP Command
DESCRIPTION: No description

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
SPOP
```

----------------------------------------

TITLE: GETRANGE Command API Documentation
DESCRIPTION: Detailed API documentation for the GETRANGE Redis command, outlining its required arguments (key, start, end indices) and the expected string response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/string/getrange.mdx

LANGUAGE: APIDOC
CODE:
```
GETRANGE:
  Description: Return a substring of value at the specified key.
  Arguments:
    key:
      type: str
      required: true
      description: The key to get.
    start:
      type: int
      required: true
      description: The start index of the substring.
    end:
      type: int
      required: true
      description: The end index of the substring.
  Response:
    type: str
    required: true
    description: The substring.
```

----------------------------------------

TITLE: LRANGE Command API Documentation
DESCRIPTION: Defines the LRANGE command, its required parameters (key, start, end indices), and the structure of its response, including type and description for each element.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/lrange.mdx

LANGUAGE: APIDOC
CODE:
```
LRANGE Command:
  Description: Returns the specified elements of the list stored at key.
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the list.
    start:
      Type: int
      Required: true
      Description: The starting index of the range to return. Use negative numbers to specify offsets starting at the end of the list.
    end:
      Type: int
      Required: true
      Description: The ending index of the range to return. Use negative numbers to specify offsets starting at the end of the list.
  Response:
    Type: List[str]
    Description: The list of elements in the specified range.
```

----------------------------------------

TITLE: RPUSH Command API Reference and Usage
DESCRIPTION: Comprehensive API documentation for the RPUSH command, including its required arguments (key, elements), the type of response (list length), and a TypeScript example demonstrating how to use the command with an Upstash Redis client.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/rpush.mdx

LANGUAGE: APIDOC
CODE:
```
RPUSH Command:
  Description: Push an element at the end of the list.
  Arguments:
    key:
      Type: string
      Required: true
      Description: The key of the list.
    elements:
      Type: ...TValue[]
      Required: true
      Description: One or more elements to push at the end of the list.
  Response:
    Type: number
    Required: true
    Description: The length of the list after the push operation.
```

LANGUAGE: TypeScript
CODE:
```
const length1 = await redis.rpush("key", "a", "b", "c"); 
console.log(length1); // 3
const length2 = await redis.rpush("key", "d"); 
console.log(length2); // 4
```

----------------------------------------

TITLE: SUNIONSTORE Command API Reference
DESCRIPTION: Detailed API documentation for the `SUNIONSTORE` command, outlining its parameters and the structure of its response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/set/sunionstore.mdx

LANGUAGE: APIDOC
CODE:
```
SUNIONSTORE Command:
  Arguments:
    destination: str (required)
      The key of the set to store the resulting set in.
    keys: *List[str] (required)
      The keys of the sets to perform the union operation on.
  Response:
    type: set[str] (required)
      The members of the resulting set.
```

----------------------------------------

TITLE: Python Example for JSON.ARRINSERT
DESCRIPTION: Illustrates how to use the `redis.json.arrinsert` method in Python to insert multiple values ('a', 'b') into a JSON array at a specific index (2) within a given path ('$.path.to.array') for a key named 'key'.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/arrinsert.mdx

LANGUAGE: py
CODE:
```
length = redis.json.arrinsert("key", "$.path.to.array", 2, "a", "b")
```

----------------------------------------

TITLE: Create and Navigate to Project Directory
DESCRIPTION: This command creates a new directory named `counter-cdk` and then navigates into it. This directory will serve as the root for the AWS CDK project, where all project files and configurations will reside.

SOURCE: https://upstash.com/docs/redis/quickstarts/aws-lambda.mdx

LANGUAGE: shell
CODE:
```
mkdir counter-cdk && cd counter-cdk
```

----------------------------------------

TITLE: Ratelimit blockUntilReady Usage Example
DESCRIPTION: Illustrates how to use `ratelimit.blockUntilReady` to create a ratelimiter and wait for a request to be allowed. It shows initializing a ratelimiter and handling the success or failure of the `blockUntilReady` call. Note: `Date.now()` behavior differs in Cloudflare Workers.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-ts/methods.mdx

LANGUAGE: ts
CODE:
```
// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
});

// `blockUntilReady` returns a promise that resolves as soon as the request is allowed to be processed, or after 30 seconds
const { success } = await ratelimit.blockUntilReady("id", 30_000);

if (!success) {
  return "Unable to process, even after 30 seconds";
}
doExpensiveCalculation();
return "Here you go!";
```

----------------------------------------

TITLE: Retrieve Keys with Upstash Redis Python SDK
DESCRIPTION: Illustrates how to use the `redis.keys()` method in Python to fetch keys from Upstash Redis. Examples include matching keys by a specific prefix and retrieving all keys.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/keys.mdx

LANGUAGE: py
CODE:
```
keys = redis.keys("prefix*")
```

LANGUAGE: py
CODE:
```
keys = redis.keys("*")
```

----------------------------------------

TITLE: Example Usage of ZLEXCOUNT in TypeScript
DESCRIPTION: Demonstrates how to use the ZLEXCOUNT command with Upstash Redis in TypeScript. This example first adds elements to a sorted set using ZADD, then counts elements within a specified lexicographical range using ZLEXCOUNT.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/zset/zlexcount.mdx

LANGUAGE: ts
CODE:
```
await redis.zadd("key", 
    { score: 1, member: "one"}, 
    { score: 2, member: "two" }
);
const elements = await redis.zlexcount("key", "two", "+");
console.log(elements); // 1
```

----------------------------------------

TITLE: Redis BITOP Command API Reference
DESCRIPTION: Detailed API documentation for the Redis `BITOP` command, including its supported operations, required keys, and the format of its response.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/bitmap/bitop.mdx

LANGUAGE: APIDOC
CODE:
```
BITOP Command:
  description: Perform bitwise operations on multiple keys (or Redis strings) and store the result in a destination key.
  Arguments:
    operation:
      type: AND | OR | XOR | NOT
      required: true
      description: Specifies the type of bitwise operation to perform, which can be one of the following: AND, OR, XOR, or NOT.
    destinationKey:
      type: string
      required: true
      description: The key to store the result of the operation in.
    sourceKeys:
      type: ...string[]
      required: true
      description: One or more keys to perform the operation on.
  Response:
    type: integer
    required: true
    description: The size of the string stored in the destination key.
```

----------------------------------------

TITLE: Clear JSON Entry in Upstash Redis with TypeScript
DESCRIPTION: Examples demonstrating how to use the `json.clear` method of the Upstash Redis client in TypeScript. The first example clears the root path of a JSON entry, while the second clears a specific nested path.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/clear.mdx

LANGUAGE: ts
CODE:
```
await redis.json.clear("key");
```

LANGUAGE: ts
CODE:
```
await redis.json.clear("key", "$.my.key");
```

----------------------------------------

TITLE: Create Project Directory
DESCRIPTION: Creates a new directory named `counter-cdk` and navigates into it. This directory will serve as the root for the AWS CDK project.

SOURCE: https://upstash.com/docs/redis/tutorials/pythonapi.mdx

LANGUAGE: shell
CODE:
```
mkdir counter-cdk && cd counter-cdk
```

----------------------------------------

TITLE: Run Supabase Function Locally
DESCRIPTION: Starts the Supabase local development environment and serves the 'upstash-redis-counter' function locally, allowing for testing without JWT verification and using a specific environment file.

SOURCE: https://upstash.com/docs/redis/quickstarts/supabase.mdx

LANGUAGE: bash
CODE:
```
supabase start
supabase functions serve upstash-redis-counter --no-verify-jwt --env-file supabase/functions/upstash-redis-counter/.env
```

----------------------------------------

TITLE: LLEN Redis Command API Reference
DESCRIPTION: Detailed API documentation for the Redis LLEN command, outlining its purpose, required arguments, and the structure of its response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/llen.mdx

LANGUAGE: APIDOC
CODE:
```
LLEN Command:
  Description: Returns the length of the list stored at key.
  Arguments:
    - Name: key
      Type: str
      Required: true
      Description: The key of the list.
  Response:
    Type: int
    Required: true
    Description: The length of the list at key.
```

----------------------------------------

TITLE: Example ZINCRBY Usage in Python
DESCRIPTION: Demonstrates how to use the ZINCRBY command with an Upstash Redis client in Python, including adding initial members to a sorted set and asserting the incremented score.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zincrby.mdx

LANGUAGE: python
CODE:
```
redis.zadd("myset", {"one": 1, "two": 2, "three": 3})

assert redis.zincrby("myset", 2, "one") == 3
```

----------------------------------------

TITLE: TypeScript Example for JSON.OBJLEN Usage
DESCRIPTION: A practical TypeScript code snippet demonstrating how to call the `json.objlen` method using the Upstash Redis client to retrieve the number of keys in a JSON object.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/objlen.mdx

LANGUAGE: ts
CODE:
```
const lengths = await redis.json.objlen("key", "$.path");
```

----------------------------------------

TITLE: JSON Response for GET Command with Base64 Encoded Value
DESCRIPTION: Expected JSON response for a `GET` command when `Upstash-Encoding: base64` header is used. The `result` field contains the base64 encoded value of 'bar' (YmFy).

SOURCE: https://upstash.com/docs/redis/features/restapi.mdx

LANGUAGE: json
CODE:
```
{"result":"YmFy"}
```

----------------------------------------

TITLE: Database Setup: Configure Upstash Redis Environment Variables
DESCRIPTION: Sets the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` as secure secrets using the SST CLI. These secrets will be securely injected into your application at runtime.

SOURCE: https://upstash.com/docs/redis/quickstarts/sst-v2.mdx

LANGUAGE: shell
CODE:
```
npx sst secrets set UPSTASH_REDIS_REST_URL <YOUR_URL>
npx sst secrets set UPSTASH_REDIS_REST_TOKEN <YOUR_TOKEN>
```

----------------------------------------

TITLE: Express Session with Serverless Redis
DESCRIPTION: Manage user sessions in Express.js applications using Upstash Redis. This tutorial is suitable for Node.js environments and focuses on session management.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: Node.js
CODE:
```
console.log('This is a placeholder for Node.js code related to Express Session.');
```

----------------------------------------

TITLE: Dockerfile for Node.js Express Application on Cloud Run
DESCRIPTION: This Dockerfile defines the steps to build a Docker image for the Node.js Express application. It uses a lightweight Node.js base image, sets the working directory, copies `package.json` files, installs dependencies, and prepares the environment for running the application in a containerized manner suitable for Google Cloud Run.

SOURCE: https://upstash.com/docs/redis/tutorials/cloud_run_sessions.mdx

LANGUAGE: dockerfile
CODE:
```
# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:12-slim

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install dependencies.
RUN npm install
```

----------------------------------------

TITLE: JSON.GET API Reference
DESCRIPTION: Detailed documentation for the `JSON.GET` command, outlining its required and optional parameters, their types, descriptions, and the structure of the returned response.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/get.mdx

LANGUAGE: APIDOC
CODE:
```
JSON.GET:
  Arguments:
    - key: string (required)
      Description: The key of the json entry.
    - options: object (optional)
      Description: Formatting options for the JSON output.
      Properties:
        - indent: string
          Description: Sets the indentation string for nested levels.
        - newline: string
          Description: Sets the string that's printed at the end of each line.
        - space: string
          Description: Sets the string that is put between a key and a value.
    - paths: ...string[] (optional, default: "$")
      Description: One or more paths to retrieve from the JSON document.
  Response:
    - type: (TValue | null)[] (required)
      Description: The value at the specified path or `null` if the path does not exist.
```

----------------------------------------

TITLE: Initialize Upstash Redis Database with Coin Data
DESCRIPTION: This shell command populates the 'coins' Redis list with initial cryptocurrency data. Each entry is a JSON string containing the coin's name, price, and image URL, which will be retrieved later via the Upstash GraphQL API.

SOURCE: https://upstash.com/docs/redis/tutorials/coin_price_list.mdx

LANGUAGE: shell
CODE:
```
rpush coins '{ "name" : "Bitcoin", "price": 56819, "image": "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png"}' '{ "name" : "Ethereum", "price": 2130, "image": "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png"}' '{ "name" : "Cardano", "price": 1.2, "image": "https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png"}' '{ "name" : "Polkadot", "price": 35.96, "image": "https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png"}' '{ "name" : "Stellar", "price": 0.506, "image": "https://s2.coinmarketcap.com/static/img/coins/64x64/512.png"}'
```

----------------------------------------

TITLE: Example XReadGroup Cancellation Error Message
DESCRIPTION: An example of the `ReplyError` received by a client when a Redis stream consumer's Pending Entries List (PEL) reaches its configured limit, indicating that messages delivered to the consumer have not yet been acknowledged.

SOURCE: https://upstash.com/docs/redis/troubleshooting/stream_pel_limit.mdx

LANGUAGE: console
CODE:
```
ReplyError: ERR XReadGroup is cancelled. Pending Entries List limit per consumer is about to be reached. Limit: 1000, Current PEL size: 90, Requested Read: 20, Key: mstream, Group: group1, Consumer: consumer1.
```

----------------------------------------

TITLE: GETRANGE Command API Reference
DESCRIPTION: Documents the GETRANGE command, including its required arguments (key, start index, end index), their types, and the expected return value (the substring).

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/string/getrange.mdx

LANGUAGE: APIDOC
CODE:
```
Command: GETRANGE
Description: Return a substring of value at the specified key.
Arguments:
  - Name: key
    Type: string
    Required: true
    Description: The key to get.
  - Name: start
    Type: integer
    Required: true
    Description: The start index of the substring.
  - Name: end
    Type: integer
    Required: true
    Description: The end index of the substring.
Response:
  Type: string
  Required: true
  Description: The substring.
```

----------------------------------------

TITLE: TypeScript Example for JSON.ARRINSERT
DESCRIPTION: This TypeScript code snippet demonstrates how to use the `redis.json.arrinsert` method to insert multiple values into a JSON array at a specified path and index within a Redis key. It shows how to capture the returned array length.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/arrinsert.mdx

LANGUAGE: ts
CODE:
```
const length = await redis.json.arrinsert("key", "$.path.to.array", 2, "a", "b");
```

----------------------------------------

TITLE: Python Example for ZLEXCOUNT Usage
DESCRIPTION: Illustrates how to use the `zadd` command to populate a sorted set and subsequently apply `zlexcount` to retrieve the number of elements within a specified lexicographical range using a Python Redis client.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zlexcount.mdx

LANGUAGE: Python
CODE:
```
redis.zadd("myset", {"a": 1, "b": 2, "c": 3})

assert redis.zlexcount("myset", "-", "+") == 3
```

----------------------------------------

TITLE: Example Usage of ZPOPMIN in Python
DESCRIPTION: Demonstrates how to add members to a sorted set using `redis.zadd` and then use `redis.zpopmin` to remove and retrieve the member with the lowest score, asserting the expected outcome.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zpopmin.mdx

LANGUAGE: python
CODE:
```
redis.zadd("myset", {"a": 1, "b": 2, "c": 3})

assert redis.zpopmin("myset") == [("a", 1)]
```

----------------------------------------

TITLE: MSET Command Usage Example (TypeScript)
DESCRIPTION: Demonstrates how to use the `mset` command with the Upstash Redis client in TypeScript, setting multiple key-value pairs including numbers, strings, and objects in a single operation.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/string/mset.mdx

LANGUAGE: ts
CODE:
```
await redis.mset({
    key1: 1,
    key2: "hello",
    key3: { a: 1, b: "hello" }
});
```

----------------------------------------

TITLE: Configure Upstash MCP Stdio Server
DESCRIPTION: JSON configuration for setting up the Upstash MCP server in `stdio` mode, ideal for local development. This snippet provides configurations for both Claude/Cursor and Copilot clients, allowing them to run the MCP server locally and interact with your Upstash account using natural language. Remember to replace placeholders with your Upstash email and API key.

SOURCE: https://upstash.com/docs/redis/integrations/mcp.mdx

LANGUAGE: json
CODE:
```
{
  "mcpServers": {
    "upstash": {
      "command": "npx",
      "args": [
        "-y",
        "@upstash/mcp-server",
        "run",
        "<UPSTASH_EMAIL>",
        "<UPSTASH_API_KEY>"
      ]
    }
  }
}
```

LANGUAGE: json
CODE:
```
{
  "servers": {
    "upstash": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@upstash/mcp-server",
        "run",
        "<UPSTASH_EMAIL>",
        "<UPSTASH_API_KEY>"
      ]
    }
  }
}
```

----------------------------------------

TITLE: Execute Redis GET Command with Base64 Encoded Response
DESCRIPTION: Demonstrates how to request a base64 encoded response from the Upstash REST API for a `GET` command by including the `Upstash-Encoding: base64` header. The actual value will be base64 encoded.

SOURCE: https://upstash.com/docs/redis/features/restapi.mdx

LANGUAGE: shell
CODE:
```
curl https://us1-merry-cat-32748.upstash.io/GET/foo \
 -H "Authorization: Bearer 2553feg6a2d9842h2a0gcdb5f8efe9934" \
 -H "Upstash-Encoding: base64"
```

----------------------------------------

TITLE: Configure Serverless Service and Functions
DESCRIPTION: Serverless Framework configuration in `serverless.yml`. It defines the AWS provider, Node.js runtime, passes Upstash Redis environment variables, and configures the `counter` function to be triggered by a GET request to the root path.

SOURCE: https://upstash.com/docs/redis/tutorials/using_serverless_framework.mdx

LANGUAGE: yaml
CODE:
```
service: counter-serverless

provider:
  name: aws
  runtime: nodejs20.x
  environment:
    UPSTASH_REDIS_REST_URL: ${env:UPSTASH_REDIS_REST_URL}
    UPSTASH_REDIS_REST_TOKEN: ${env:UPSTASH_REDIS_REST_TOKEN}

functions:
  counter:
    handler: handler.counter
    events:
      - httpApi:
          path: /
          method: get
```

----------------------------------------

TITLE: API Documentation for RANDOMKEY Command
DESCRIPTION: Defines the structure and behavior of the RANDOMKEY command, including its arguments, return type, and conditions for returning null.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/generic/randomkey.mdx

LANGUAGE: APIDOC
CODE:
```
RANDOMKEY:
  Description: Returns a random key from database
  Arguments: No arguments
  Response:
    Type: string
    Required: true
    Description: A random key from database, or `null` when database is empty.
```

----------------------------------------

TITLE: Python Example for ZREM Command
DESCRIPTION: Demonstrates how to use the ZREM command in Python with the Upstash Redis client. It shows adding initial members to a sorted set and then removing specific members, asserting the count of successfully removed members.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zrem.mdx

LANGUAGE: python
CODE:
```
redis.zadd("myset", {"one": 1, "two": 2, "three": 3})

assert redis.zrem("myset", "one", "four") == 1
```

----------------------------------------

TITLE: TypeScript Example for LREM Usage
DESCRIPTION: A TypeScript code example demonstrating how to use the LREM command with an Upstash Redis client. It shows pushing multiple elements to a list and then removing specific occurrences of an element, logging the count of removed items.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/lrem.mdx

LANGUAGE: ts
CODE:
```
await redis.lpush("key", "a", "a", "b", "b", "c");
const removed = await redis.lrem("key", 4, "b");
console.log(removed) // 2
```

----------------------------------------

TITLE: Redis SET Command API Reference
DESCRIPTION: Detailed documentation for the Redis SET command, outlining its required and optional arguments, their types, descriptions, and the expected response.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/string/set.mdx

LANGUAGE: APIDOC
CODE:
```
SET Command:
  Description: Set a key to hold a string value.
  Arguments:
    key:
      Type: string
      Required: true
      Description: The key to set.
    value:
      Type: TValue
      Required: true
      Description: The value to store. Non-string values are JSON.stringify'd.
    opts (Optional):
      Type: object
      Description: Options to modify SET behavior.
      Options:
        get:
          Type: boolean
          Description: Returns the old value at key, or null if key did not exist, instead of 'OK'.
        ex:
          Type: integer
          Description: Sets an expiration in seconds.
        px:
          Type: integer
          Description: Sets an expiration in milliseconds.
        exat:
          Type: integer
          Description: Sets an expiration at a specific Unix timestamp (seconds).
        pxat:
          Type: integer
          Description: Sets an expiration at a specific Unix timestamp (milliseconds).
        keepTtl:
          Type: boolean
          Description: Preserves the existing TTL if the key already exists.
        nx:
          Type: boolean
          Description: Only sets the key if it does not already exist.
        xx:
          Type: boolean
          Description: Only sets the key if it already exists.
  Response:
    Type: string
    Value: "OK" (default) or old value (if 'get' option is used)
    Description: Returns 'OK' on success, or the old value if 'get' option is specified.
```

----------------------------------------

TITLE: Create a new Phoenix Elixir application without Ecto
DESCRIPTION: This command initializes a new Phoenix application named `redix_demo`. The `--no-ecto` flag is used to disable the default Ecto datastore setup, as the application will exclusively use Redis for data storage, simplifying the project configuration.

SOURCE: https://upstash.com/docs/redis/quickstarts/elixir.mdx

LANGUAGE: Shell
CODE:
```
mix phx.new redix_demo --no-ecto
```

----------------------------------------

TITLE: Python Example for EVAL_RO with Arguments
DESCRIPTION: Shows how to use `eval_ro` in Python to execute a simple Lua script that returns an argument passed to it. This illustrates passing dynamic data to the Lua script via the `args` parameter.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/scripts/eval_ro.mdx

LANGUAGE: python
CODE:
```
assert redis.eval_ro("return ARGV[1]", args=["Hello"]) == "Hello"
```

----------------------------------------

TITLE: Monitor Upstash Redis Commands with ioredis
DESCRIPTION: This TypeScript example demonstrates how to use the `ioredis` client to connect to an Upstash Redis database and set up a real-time monitor. It listens for the 'monitor' event, logging details of each executed command, including timestamp, arguments, source, and database, to the console.

SOURCE: https://upstash.com/docs/redis/howto/monitoryourusage.mdx

LANGUAGE: ts
CODE:
```
const monitor = await redis.monitor()

monitor.on("monitor", (time, args, source, database) => {
  console.log(time, args, source, database)
})
```

----------------------------------------

TITLE: Waiting Room for Next.js App with Edge Functions
DESCRIPTION: Implement a waiting room for your Next.js application using Edge Functions and Upstash Redis. This tutorial helps manage high traffic on your Next.js site.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: Next.js Edge
CODE:
```
export async function GET(request) {
  // Logic for waiting room
  return new Response('Waiting Room');
}
```

----------------------------------------

TITLE: TypeScript Examples for JSON.SET
DESCRIPTION: Illustrates various ways to use the `redis.json.set` method in TypeScript, including basic usage and conditional setting with `NX` (set if not exists) and `XX` (set if exists) options.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/set.mdx

LANGUAGE: ts
CODE:
```
Set the JSON value at path in key.
redis.json.set(key, "$.path", value);
```

LANGUAGE: ts
CODE:
```
const value = ...
redis.json.set(key, "$.path", value, { nx:true });
```

LANGUAGE: ts
CODE:
```
const value = ...
redis.json.set(key, "$.path", value, { xx:true });
```

----------------------------------------

TITLE: Define Node.js Dependencies in package.json
DESCRIPTION: Configuration for `package.json` to include `@upstash/redis` as a dependency. This ensures the Upstash Redis client library is available for the project.

SOURCE: https://upstash.com/docs/redis/tutorials/using_serverless_framework.mdx

LANGUAGE: json
CODE:
```
{
    "dependencies": {
      "@upstash/redis": "latest"
    }
  }
```

----------------------------------------

TITLE: Execute Custom Redis Commands in Python
DESCRIPTION: This example illustrates how to execute Redis commands that are not explicitly implemented in the `upstash-redis` client. The `execute` function of the client instance can be used by passing the command and its arguments as a Python list.

SOURCE: https://upstash.com/docs/redis/sdks/py/features.mdx

LANGUAGE: python
CODE:
```
redis.execute(["XLEN", "test_stream"])
```

----------------------------------------

TITLE: Set Multiple Fields with HSET (Python)
DESCRIPTION: Illustrates how to set multiple fields and their values simultaneously in a Redis hash using the `hset` command in Python, by passing a dictionary of key-value pairs. The example asserts the total number of fields added.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hset.mdx

LANGUAGE: python
CODE:
```
assert redis.hset("myhash", values={
  "field1": "Hello",
  "field2": "World"
}) == 2
```

----------------------------------------

TITLE: Python Example: Removing Elements with LREM
DESCRIPTION: Illustrates the usage of the `lrem` method in Python with the Upstash Redis client. This example demonstrates pushing elements to a list, then using `lrem` to remove specific occurrences of an element, and finally asserting the modified list content.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/lrem.mdx

LANGUAGE: py
CODE:
```
redis.rpush("mylist", "one", "two", "three", "two", "one")

assert redis.lrem("mylist", 2, "two") == 2

assert redis.lrange("mylist", 0, -1) == ["one", "three", "one"]
```

----------------------------------------

TITLE: JSON.ARRAPPEND API Reference
DESCRIPTION: Detailed API documentation for the JSON.ARRAPPEND command, outlining its arguments, their types, default values, and the expected response.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/arrappend.mdx

LANGUAGE: APIDOC
CODE:
```
JSON.ARRAPPEND:
  Description: Append values to the array at path in the JSON document at key.
  Note: To specify a string as an array value to append, wrap the quoted string with an additional set of single quotes. Example: '"silver"'.
  Arguments:
    key (string, required): The key of the json entry.
    path (string, default="$"): The path of the array.
    value (...TValue[], required): One or more values to append to the array.
  Returns:
    integer[] (required): The length of the array after the appending.
```

----------------------------------------

TITLE: Generate REST Token for ACL User (Error Example)
DESCRIPTION: Example demonstrating an error response from the `ACL RESTTOKEN` command when the provided username does not exist or the password does not match. The command returns an 'ERR Wrong password or user' message.

SOURCE: https://upstash.com/docs/redis/features/restapi.mdx

LANGUAGE: shell
CODE:
```
redis-cli> ACL RESTTOKEN upstash fakepass
(error) ERR Wrong password or user "upstash" does not exist
```

----------------------------------------

TITLE: API Documentation for JSON.STRAPPEND Command
DESCRIPTION: Comprehensive documentation for the `JSON.STRAPPEND` command, outlining its required parameters, their types, and the expected response structure.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/strappend.mdx

LANGUAGE: APIDOC
CODE:
```
JSON.STRAPPEND:
  description: Append the json-string values to the string at path.
  Arguments:
    key:
      type: str
      required: true
      description: The key of the json entry.
    path:
      type: str
      required: true
      description: The path of the string.
    value:
      type: str
      required: true
      description: The value to append to the existing string.
  Response:
    type: List[int]
    required: true
    description: The length of the string after the appending.
```

----------------------------------------

TITLE: Load and Execute Lua Script with Python
DESCRIPTION: This Python example demonstrates how to use the `script_load` method to load a Lua script into Redis and then execute it using `evalsha`, asserting the correct return value.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/scripts/script_load.mdx

LANGUAGE: python
CODE:
```
sha1 = redis.script_load("return 1")

assert redis.evalsha(sha1) == 1
```

----------------------------------------

TITLE: Check Redis Key Existence with Python
DESCRIPTION: Demonstrates how to use the `exists` command with a Python Redis client. This example shows setting keys, checking their existence, deleting a key, and then re-checking existence to verify the command's behavior.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/exists.mdx

LANGUAGE: Python
CODE:
```
redis.set("key1", "Hello")
redis.set("key2", "World")

assert redis.exists("key1", "key2") == 2

redis.delete("key1")

assert redis.exists("key1", "key2") == 1
```

----------------------------------------

TITLE: Pop Element from JSON Array using Upstash Redis in TypeScript
DESCRIPTION: TypeScript examples demonstrating how to use the `redis.json.arrpop` method to remove and retrieve elements from a JSON array. Includes examples for popping the last element (default behavior) and the first element by specifying the index.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/arrpop.mdx

LANGUAGE: ts
CODE:
```
const element = await redis.json.arrpop("key", "$.path.to.array");
```

LANGUAGE: ts
CODE:
```
const firstElement = await redis.json.arrpop("key", "$.path.to.array", 0);
```

----------------------------------------

TITLE: Connect to Upstash Redis with Redisson and Perform Basic Operations
DESCRIPTION: This Java code snippet demonstrates how to initialize the Redisson client, connect to an Upstash Redis instance using a password and endpoint, and perform a basic `put` and `get` operation on a distributed map (`RMap`). Remember to replace placeholders for password and endpoint, and use `rediss://` for SSL connections.

SOURCE: https://upstash.com/docs/redis/tutorials/redisson.mdx

LANGUAGE: Java
CODE:
```
public class Main {

    public static void main(String[] args) {
        Config config = new Config();
        config.useSingleServer().setPassword("YOUR_PASSWORD")
                // use "rediss://" for SSL connection
                .setAddress("YOUR_ENDPOINT");
        RedissonClient redisson = Redisson.create(config);
        RMap<String, String> map = redisson.getMap("map");
        map.put("foo", "bar");
        System.out.println(map.get("foo"));
    }
}
```

----------------------------------------

TITLE: Example Usage of LRANGE with Upstash Redis in TypeScript
DESCRIPTION: Demonstrates how to use the `lpush` command to populate a Redis list and then retrieve a specific range of elements using the `lrange` command with an Upstash Redis client in TypeScript.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/lrange.mdx

LANGUAGE: ts
CODE:
```
await redis.lpush("key", "a", "b", "c");
const elements = await redis.lrange("key", 1, 2);
console.log(elements) // ["b", "c"]
```

----------------------------------------

TITLE: API Reference for JSON.NUMMULTBY Command
DESCRIPTION: Detailed documentation for the `JSON.NUMMULTBY` command, outlining its required arguments, their types, descriptions, and the structure of the expected response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/nummultby.mdx

LANGUAGE: APIDOC
CODE:
```
JSON.NUMMULTBY:
  Description: Multiply the number value stored at 'path' by number.
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the json entry.
    path:
      Type: str
      Required: true
      Description: The path of the number.
    multiply:
      Type: number
      Required: true
      Description: The number to multiply by.
  Response:
    Type: List[int]
    Required: true
    Description: The new value after multiplying
```

----------------------------------------

TITLE: Python Example for HPEXPIREAT Usage
DESCRIPTION: This Python example demonstrates how to use the `hpexpireat` command to set an expiration time for a field within a Redis hash. It first sets a value using `hset` and then asserts that `hpexpireat` successfully sets an expiration 1 second in the future.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hpexpireat.mdx

LANGUAGE: Python
CODE:
```
redis.hset(hash_name, field, value)

assert redis.hpexpireat(hash_name, field, int(time.time() * 1000) + 1000) == [1]
```

----------------------------------------

TITLE: Redis RANDOMKEY Command API Reference
DESCRIPTION: Official API documentation for the Redis RANDOMKEY command. This section outlines the command's purpose, specifies that it takes no arguments, and describes the expected string response, including the case for an empty database.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/randomkey.mdx

LANGUAGE: APIDOC
CODE:
```
Command: RANDOMKEY
Description: Returns a random key from database.
Arguments: No arguments.
Response:
  Type: str
  Description: A random key from the database, or `None` when the database is empty.
```

----------------------------------------

TITLE: Generate REST Token for ACL User (Success Example)
DESCRIPTION: Example of successfully using the `ACL RESTTOKEN` command via `redis-cli` to generate a REST token. The command takes a username and password, returning the new REST token as a string.

SOURCE: https://upstash.com/docs/redis/features/restapi.mdx

LANGUAGE: shell
CODE:
```
redis-cli> ACL RESTTOKEN default 35fedg8xyu907d84af29222ert
"AYNgAS2553feg6a2d9842h2a0gcdb5f8efe9934DQ="
```

----------------------------------------

TITLE: SMISMEMBER Command
DESCRIPTION: No description

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
SMISMEMBER
```

----------------------------------------

TITLE: API Documentation for JSON.OBJLEN Command
DESCRIPTION: Comprehensive documentation for the `JSON.OBJLEN` command, detailing its purpose, required and optional arguments, and the structure of its return value.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/objlen.mdx

LANGUAGE: APIDOC
CODE:
```
Command: JSON.OBJLEN
Description: Report the number of keys in the JSON object at `path` in `key`.

Arguments:
  key:
    Type: string
    Required: true
    Description: The key of the json entry.
  path:
    Type: string
    Default: $
    Description: The path of the object.

Response:
  Type: integer[]
  Required: true
  Description: The number of keys in the objects.
```

----------------------------------------

TITLE: LRANGE Redis Command API Documentation
DESCRIPTION: Detailed API documentation for the Redis LRANGE command, outlining its required parameters (key, start, end indices) and the expected array response, including type information and descriptions for each field.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/lrange.mdx

LANGUAGE: APIDOC
CODE:
```
LRANGE:
  description: Returns the specified elements of the list stored at key.
  Arguments:
    key:
      type: string
      required: true
      description: The key of the list.
    start:
      type: integer
      required: true
      description: The starting index of the range to return. Use negative numbers to specify offsets starting at the end of the list.
    end:
      type: integer
      required: true
      description: The ending index of the range to return. Use negative numbers to specify offsets starting at the end of the list.
  Response:
    type: TValue[]
    required: true
    description: The list of elements in the specified range.
```

----------------------------------------

TITLE: Python Bitfield Increment Operation Example
DESCRIPTION: Shows how to increment multiple 4-bit unsigned integer values within a Redis bitfield using the `incr` command. The example initializes an empty key and then increments two distinct 4-bit segments, asserting the resulting values.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/bitmap/bitfield.mdx

LANGUAGE: py
CODE:
```
redis.set("mykey", "")

# Increment offset 0 by 16, return 
# Increment offset 4 by 1

result = redis.bitfield("mykey") \
    .incr("u4", 0, 16) \
    .incr("u4", 4, 1) \
    .execute()

assert result == [0, 1]
```

----------------------------------------

TITLE: Redis KEYS Command API Documentation
DESCRIPTION: Detailed API documentation for the Redis `KEYS` command, including its purpose, arguments, and response format. It also highlights a critical warning about its performance implications in production environments, advising the use of `SCAN` instead.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/generic/keys.mdx

LANGUAGE: APIDOC
CODE:
```
KEYS Command:
  Description: Returns all keys matching pattern.
  Warning: This command may block the DB for a long time, depending on its size. We advice against using it in production. Use SCAN instead.
  Arguments:
    match:
      Type: string
      Required: true
      Description: A glob-style pattern. Use * to match all keys.
  Response:
    Type: string[]
    Required: true
    Description: Array of keys matching the pattern.
```

----------------------------------------

TITLE: Configure different rate limit algorithms for specific routes (JSON)
DESCRIPTION: This example demonstrates how to configure multiple rate limiting strategies for different API routes. It applies a fixed-window limit to '/api/restaurants/:id' and a token bucket limit to '/api/restaurants', both identified by the 'x-author' header, showcasing flexibility in rate limit management.

SOURCE: https://upstash.com/docs/redis/integrations/ratelimit/strapi/configurations.mdx

LANGUAGE: json
CODE:
```
{
  "strapi-plugin-upstash-ratelimit": {
    "enabled": true,
    "resolve": "./src/plugins/strapi-plugin-upstash-ratelimit",
    "config": {
      "enabled": true,
      "token": "process.env.UPSTASH_REDIS_REST_TOKEN",
      "url": "process.env.UPSTASH_REDIS_REST_URL",
      "strategy": [
        {
          "methods": ["GET", "POST"],
          "path": "/api/restaurants/:id",
          "identifierSource": "header.x-author",
          "limiter": {
            "algorithm": "fixed-window",
            "tokens": 10,
            "window": "20s"
          }
        },
        {
          "methods": ["GET"],
          "path": "/api/restaurants",
          "identifierSource": "header.x-author",
          "limiter": {
            "algorithm": "tokenBucket",
            "tokens": 10,
            "window": "20s",
            "refillRate": 1
          }
        }
      ],
      "prefix": "@strapi"
    }
  }
}
```

----------------------------------------

TITLE: ZPOPMAX Command
DESCRIPTION: No description

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
ZPOPMAX
```

----------------------------------------

TITLE: SMEMBERS Command
DESCRIPTION: No description

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
SMEMBERS
```

----------------------------------------

TITLE: Upstash Redis Environment Variables Configuration
DESCRIPTION: Example of environment variables required to connect to an Upstash Redis database. These credentials should be obtained from the Upstash Console or CLI and stored in a `.env` file.

SOURCE: https://upstash.com/docs/redis/quickstarts/nextjs-pages-router.mdx

LANGUAGE: plaintext
CODE:
```
UPSTASH_REDIS_REST_URL=<YOUR_URL>
UPSTASH_REDIS_REST_TOKEN=<YOUR_TOKEN>
```

----------------------------------------

TITLE: LMOVE Redis Command API Reference
DESCRIPTION: Detailed API documentation for the Redis LMOVE command, outlining its required arguments, their types, and the expected response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/lmove.mdx

LANGUAGE: APIDOC
CODE:
```
LMOVE Command:
  Description: Move an element from one list to another.
  Arguments:
    source:
      Type: str
      Required: true
      Description: The key of the source list.
    destination:
      Type: str
      Required: true
      Description: The key of the destination list.
    wherefrom:
      Type: "left" | "right"
      Required: true
      Description: The side of the source list from which the element was popped.
    whereto:
      Type: "left" | "right"
      Required: true
      Description: The side of the destination list to which the element was pushed.
  Response:
    Type: str
    Required: true
    Description: The element that was moved.
```

----------------------------------------

TITLE: Deploy Application with Koyeb CLI
DESCRIPTION: Deploys an application to Koyeb using the CLI, configuring the Git repository, branch, ports, routes, and essential environment variables for Upstash Redis integration.

SOURCE: https://upstash.com/docs/redis/quickstarts/koyeb.mdx

LANGUAGE: bash
CODE:
```
koyeb app init example-koyeb-upstash \
  --git github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME> \
  --git-branch main \
  --ports 3000:http \
  --routes /:3000 \
  --env PORT=3000 \
  --env UPSTASH_REDIS_REST_URL="<YOUR_UPSTASH_REDIS_REST_URL>" \
  --env UPSTASH_REDIS_REST_TOKEN="<YOUR_UPSTASH_REDIS_REST_TOKEN>"
```

----------------------------------------

TITLE: Example Usage of HEXPIREAT with Upstash Redis in TypeScript
DESCRIPTION: This TypeScript example demonstrates how to use the `hexpireat` command with the Upstash Redis client. It first sets a value in a hash, then applies an expiration to a specific field using a Unix timestamp calculated for 10 seconds in the future, and finally logs the result of the operation.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hexpireat.mdx

LANGUAGE: ts
CODE:
```
await redis.hset("my-key", "my-field", "my-value");
const expirationSet = await redis.hexpireat("my-key", "my-field", Math.floor(Date.now() / 1000) + 10);

console.log(expirationSet); // [1]
```

----------------------------------------

TITLE: Initialize Upstash Redis Client in Vercel
DESCRIPTION: This code snippet demonstrates how to initialize an Upstash Redis client within a Vercel application using `Redis.fromEnv()`. It automatically reads `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from environment variables, allowing for seamless connection and basic data operations like setting and getting a key.

SOURCE: https://upstash.com/docs/redis/howto/vercelintegration.mdx

LANGUAGE: ts
CODE:
```
const { Redis } = require("@upstash/redis");

module.exports = async (req, res) => {
  /**
   * Redis.fromEnv() will read the following from environment variables:
   * - UPSTASH_REDIS_REST_URL
   * - UPSTASH_REDIS_REST_TOKEN
   */
  const redis = Redis.fromEnv();
  await redis.set("foo", "bar");
  const bar = await redis.get("foo");

  res.json({
    body: `foo: ${bar}`,
  });
};
```

----------------------------------------

TITLE: STRLEN Command
DESCRIPTION: Get the length of the value stored in a key.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
STRLEN
```

----------------------------------------

TITLE: GETRANGE Command
DESCRIPTION: Get a substring of the string stored at a key.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
GETRANGE
```

----------------------------------------

TITLE: GETDEL Command
DESCRIPTION: Get the value of a key and delete the key.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
GETDEL
```

----------------------------------------

TITLE: ZUNIONSTORE Command
DESCRIPTION: No description

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
ZUNIONSTORE
```

----------------------------------------

TITLE: TypeScript Example for Redis Sorted Set Operations
DESCRIPTION: Illustrates adding members to a sorted set using `redis.zadd` and then attempting to retrieve a value using `redis.zrank`. Note: The example's output comment `// 2` is inconsistent with `zrank`'s typical return value, which is a member's rank, not the set's cardinality.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/zset/zcard.mdx

LANGUAGE: ts
CODE:
```
await redis.zadd("key", 
    { score: 1, member: "one"}, 
    { score: 2, member: "two" }
);
const elements = await redis.zrank("key");
console.log(elements); // 2
```

----------------------------------------

TITLE: SETRANGE Command
DESCRIPTION: Overwrite part of a string at key starting at the specified offset.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
SETRANGE
```

----------------------------------------

TITLE: Retrieve Multiple Keys with MGET in Python
DESCRIPTION: Demonstrates how to use the MGET command in Python to retrieve multiple keys from Redis. This example shows setting two keys and then asserting that MGET correctly returns their corresponding values in a list.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/string/mget.mdx

LANGUAGE: Python
CODE:
```
redis.set("key1", "value1")

redis.set("key2", "value2")

assert redis.mget("key1", "key2") == ["value1", "value2"]
```

----------------------------------------

TITLE: Set Bit in Redis using TypeScript
DESCRIPTION: Example demonstrating how to use the `setbit` method with the Upstash Redis client in TypeScript.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/bitmap/setbit.mdx

LANGUAGE: ts
CODE:
```
const originalBit = await redis.setbit(key, 4, 1);
```

----------------------------------------

TITLE: Connect to Redis via Fly.io Tunnel in Node.js
DESCRIPTION: This Node.js example demonstrates how to configure a Redis client to connect using the local address provided by the `fly redis connect` tunnel during development. It dynamically switches to a production environment variable for deployment, ensuring flexibility.

SOURCE: https://upstash.com/docs/redis/quickstarts/fly.mdx

LANGUAGE: javascript
CODE:
```
const redis = require("redis");

// Local Redis URL for development
const LOCAL_REDIS_URL = 'redis://localhost:10000'; // Replace with your actual local address
const REDIS_URL = process.env.NODE_ENV === 'development' ? LOCAL_REDIS_URL : process.env.REDIS_URL;

const client = redis.createClient({
    url: REDIS_URL
});

client.on("error", function(error) {
  console.error(error);
});

// Rest of your Redis-related code
```

----------------------------------------

TITLE: XADD Command API Reference
DESCRIPTION: Detailed API documentation for the XADD command, outlining its parameters, nested options for stream management and trimming, and the structure of the returned value.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/stream/xadd.mdx

LANGUAGE: APIDOC
CODE:
```
XADD Command:
  Description: Appends one or more new entries to a stream.
  Arguments:
    key: string (required)
      Description: The key of the stream.
    id: string | * (required)
      Description: The stream entry ID. If * is passed, a new ID will be generated automatically.
    entries: Record<string, unknown> (required)
      Description: Key-value data to be appended to the stream.
    options: object (optional)
      nomkStream: boolean
        Description: Prevent creating the stream if it does not exist.
      trim: object
        type: 'MAXLEN' | 'MINID' (required)
          Description: The trim mode.
        threshold: number | string (required)
          Description: The threshold value for the trim mode.
        comparison: ~ | = (required)
          Description: The comparison operator for the trim mode.
        limit: number
          Description: Limit how many entries will be trimmed at most.
  Response:
    string
      Description: The ID of the newly added entry.
```

----------------------------------------

TITLE: Python Example for ZREMRANGEBYSCORE
DESCRIPTION: Demonstrates how to use the `zremrangebyscore` method with the Upstash Redis client in Python to remove elements from a sorted set.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zremrangebyscore.mdx

LANGUAGE: python
CODE:
```
redis.zremrangebyscore("key", 2, 5)
```

----------------------------------------

TITLE: JSON.SET Command API Documentation
DESCRIPTION: Detailed API documentation for the `JSON.SET` command, outlining its required and optional arguments, their types, and the expected response upon successful execution.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/set.mdx

LANGUAGE: APIDOC
CODE:
```
JSON.SET:
  description: Set the JSON value at path in key.
  Arguments:
    key: string (required)
      description: The key of the json entry.
    path: string (default: "$")
      description: The path of the value to set.
    value: TValue (required)
      description: The value to set.
  Response:
    OK: string (required)
      description: Returns 'OK' on success.
```

----------------------------------------

TITLE: JSON.ARRINSERT API Reference
DESCRIPTION: Detailed API documentation for the JSON.ARRINSERT command, including its required arguments, their types, and the expected response format.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/arrinsert.mdx

LANGUAGE: APIDOC
CODE:
```
JSON.ARRINSERT
Description: Insert the json values into the array at path before the index (shifts to the right).

Arguments:
- key (str, required): The key of the json entry.
- path (str, required): The path of the array.
- index (int, required): The index where to insert the values.
- values (...TValue[], required): One or more values to append to the array.

Response:
- List[int] (required): The length of the array after the insertion.
```

----------------------------------------

TITLE: SMOVE Command
DESCRIPTION: No description

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
SMOVE
```

----------------------------------------

TITLE: Redis DBSIZE Command API Reference
DESCRIPTION: Detailed API documentation for the Redis DBSIZE command, including its purpose, arguments, and expected response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/server/dbsize.mdx

LANGUAGE: APIDOC
CODE:
```
Command: DBSIZE
Description: Count the number of keys in the database.
Arguments: None
Response:
  Type: int
  Description: The number of keys in the database.
```

----------------------------------------

TITLE: Configure Django URL Pattern for View
DESCRIPTION: This Python code configures the URL routing for the Django project. It maps the root URL path (`''`) to the `index` view function defined in `myapp/views.py`. This setup ensures that when a user visits the homepage, the `index` function is executed.

SOURCE: https://upstash.com/docs/redis/quickstarts/django.mdx

LANGUAGE: python
CODE:
```
from django.urls import path
from myapp import views

urlpatterns = [
    path('', views.index),
]
```

----------------------------------------

TITLE: LPUSHX Command API Reference
DESCRIPTION: Detailed API documentation for the Redis LPUSHX command, including its arguments, their types, requirements, and the structure of the command's response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/lpushx.mdx

LANGUAGE: APIDOC
CODE:
```
LPUSHX Command:
  Description: Push an element at the head of the list only if the list exists.
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the list.
    elements:
      Type: *List[str]
      Required: true
      Description: One or more elements to push at the head of the list.
  Response:
    Type: number
    Required: true
    Description: The length of the list after the push operation. 0 if the list did not exist and thus no element was pushed.
```

----------------------------------------

TITLE: TypeScript Example for JSON.FORGET
DESCRIPTION: Illustrates how to call the `json.forget` method using a TypeScript Redis client, specifying the key and the JSON path to be deleted.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/forget.mdx

LANGUAGE: ts
CODE:
```
await redis.json.forget("key", "$.path.to.value");
```

----------------------------------------

TITLE: Upstash Pipelining API Request Syntax Example
DESCRIPTION: Illustrates the `curl` command syntax for sending multiple Redis commands as a batch to the Upstash `/pipeline` endpoint. Commands are sent as a two-dimensional JSON array in the request body.

SOURCE: https://upstash.com/docs/redis/features/restapi.mdx

LANGUAGE: shell
CODE:
```
curl -X POST https://us1-merry-cat-32748.upstash.io/pipeline \
 -H "Authorization: Bearer $TOKEN" \
 -d '
    [
      ["CMD_A", "arg0", "arg1", ..., "argN"],
      ["CMD_B", "arg0", "arg1", ..., "argM"],
      ...
    ]
    '
```

----------------------------------------

TITLE: HGET Example in TypeScript
DESCRIPTION: Demonstrates how to use the `hget` command with Upstash Redis in TypeScript to retrieve a field from a hash, after setting it for illustration purposes.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hget.mdx

LANGUAGE: ts
CODE:
```
await redis.hset("key", {field: "value"});
const field = await redis.hget("key", "field");
console.log(field); // "value"
```

----------------------------------------

TITLE: Python Example for ZREMRANGEBYLEX
DESCRIPTION: Demonstrates how to use the ZREMRANGEBYLEX command in Python to remove elements from a sorted set within a specified lexicographical range.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zremrangebylex.mdx

LANGUAGE: python
CODE:
```
redis.zremrangebylex("key", "alpha", "omega")
```

----------------------------------------

TITLE: Change Directory to SAM Application
DESCRIPTION: Navigates into the newly created `sam-app` directory, which is the root of the serverless project initialized by the `sam init` command. This is a necessary step before further project configuration or development.

SOURCE: https://upstash.com/docs/redis/tutorials/using_aws_sam.mdx

LANGUAGE: shell
CODE:
```
cd sam-app
```

----------------------------------------

TITLE: Access Koyeb Application Deployment Logs
DESCRIPTION: Monitors the application deployment process on Koyeb by displaying real-time build logs for a specified service.

SOURCE: https://upstash.com/docs/redis/quickstarts/koyeb.mdx

LANGUAGE: bash
CODE:
```
koyeb service logs example-koyeb-upstash/example-koyeb-upstash -t build
```

----------------------------------------

TITLE: Initialize Upstash Redis in Fastly Compute@Edge
DESCRIPTION: Demonstrates how to manually create an Upstash Redis instance for Fastly Compute@Edge. This includes specifying the `backend` parameter, which is required for Fastly's backend configuration. This manual approach is recommended until the Fastly API stabilizes.

SOURCE: https://upstash.com/docs/redis/sdks/ts/deployment.mdx

LANGUAGE: ts
CODE:
```
import { Redis } from "@upstash/redis/fastly"

const redis = new Redis({
  url: <UPSTASH_REDIS_REST_URL>,
  token: <UPSTASH_REDIS_REST_TOKEN>,
  backend: <BACKEND_NAME>,
})
```

----------------------------------------

TITLE: Integrate Serverless Redis HTTP (SRH) into GitHub Actions CI
DESCRIPTION: This GitHub Actions workflow demonstrates how to set up SRH and a Redis server as services within a job. It allows running tests against the SRH proxy, simulating an Upstash Redis environment for CI/CD pipelines without external dependencies, ensuring compatibility and reducing test setup overhead.

SOURCE: https://upstash.com/docs/redis/sdks/ts/developing.mdx

LANGUAGE: yml
CODE:
```
name: Test @upstash/redis compatibility
on:
  push:
  workflow_dispatch:

env:
  SRH_TOKEN: example_token

jobs:
  container-job:
    runs-on: ubuntu-latest
    container: denoland/deno
    services:
      redis:
        image: redis/redis-stack-server:6.2.6-v6 # 6.2 is the Upstash compatible Redis version
      srh:
        image: hiett/serverless-redis-http:latest
        env:
          SRH_MODE: env # We are using env mode because we are only connecting to one server.
          SRH_TOKEN: ${{ env.SRH_TOKEN }}
          SRH_CONNECTION_STRING: redis://redis:6379

    steps:
      # You can place your normal testing steps here. In this example, we are running SRH against the upstash/upstash-redis test suite.
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          repository: upstash/upstash-redis

      - name: Run @upstash/redis Test Suite
        run: deno test -A ./pkg
        env:
          UPSTASH_REDIS_REST_URL: http://srh:80
          UPSTASH_REDIS_REST_TOKEN: ${{ env.SRH_TOKEN }}
```

----------------------------------------

TITLE: TypeScript Example for INCRBYFLOAT
DESCRIPTION: Demonstrates how to use the `incrbyfloat` command in TypeScript with an Upstash Redis client, showing setting a key and then incrementing its float value.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/string/incrbyfloat.mdx

LANGUAGE: ts
CODE:
```
await redis.set("key", 6);
await redis.incrbyfloat("key", 4,5);
// returns 10.5
```

----------------------------------------

TITLE: Initialize AWS CDK TypeScript Project
DESCRIPTION: Initializes a new AWS CDK application project using TypeScript as the primary language. This command sets up the basic project structure, including `package.json`, `tsconfig.json`, and initial stack files, preparing the environment for CDK development.

SOURCE: https://upstash.com/docs/redis/quickstarts/aws-lambda.mdx

LANGUAGE: shell
CODE:
```
cdk init app --language typescript
```

----------------------------------------

TITLE: Deploy Serverless Application to AWS
DESCRIPTION: Deploys the serverless application to AWS using the Serverless Framework. This command provisions necessary AWS resources like Lambda functions and API Gateway endpoints.

SOURCE: https://upstash.com/docs/redis/tutorials/serverless_java_redis.mdx

LANGUAGE: shell
CODE:
```
serverless deploy
```

----------------------------------------

TITLE: TypeScript Example: SPOP Single Member
DESCRIPTION: Demonstrates how to use the SPOP command in TypeScript to remove and return a single random member from a Redis set.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/set/spop.mdx

LANGUAGE: TypeScript
CODE:
```
await redis.sadd("set", "a", "b", "c"); 
const popped = await redis.spop("set");
console.log(popped); // "a"
```

----------------------------------------

TITLE: TypeScript Example for JSON.DEL
DESCRIPTION: Illustrates how to use the `redis.json.del` method in TypeScript to delete a specific path within a JSON document stored in Upstash Redis.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/del.mdx

LANGUAGE: ts
CODE:
```
await redis.json.del("key", "$.path.to.value");
```

----------------------------------------

TITLE: Run Serverless Redis HTTP (SRH) via Docker Command
DESCRIPTION: This command starts an SRH container, mapping port 8080 to its internal port 80. It configures SRH to use environment variables for mode and token, and connects to a specified Redis server, ideal for quick local testing.

SOURCE: https://upstash.com/docs/redis/sdks/ts/developing.mdx

LANGUAGE: bash
CODE:
```
docker run \
    -it -d -p 8080:80 --name srh \
    -e SRH_MODE=env \
    -e SRH_TOKEN=your_token_here \
    -e SRH_CONNECTION_STRING="redis://your_server_here:6379" \
    hiett/serverless-redis-http:latest
```

----------------------------------------

TITLE: TypeScript Example for JSON.ARRLEN
DESCRIPTION: A TypeScript code snippet demonstrating how to use the `json.arrlen` method with the Upstash Redis client to retrieve the length of a JSON array.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/arrlen.mdx

LANGUAGE: ts
CODE:
```
const length = await redis.json.arrlen("key", "$.path.to.array");
```

----------------------------------------

TITLE: JSON.SET Command API Reference
DESCRIPTION: Detailed API documentation for the `JSON.SET` command, including its arguments, their types, requirements, default values, and the command's return type and description.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/set.mdx

LANGUAGE: APIDOC
CODE:
```
JSON.SET Command:
  Description: Set the JSON value at path in key.
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the json entry.
    path:
      Type: str
      Required: true
      Description: The path of the value to set.
    value:
      Type: TValue
      Required: true
      Description: The value to set.
    nx:
      Type: boolean
      Default: None
      Description: Sets the value at path only if it does not exist.
    xx:
      Type: boolean
      Default: None
      Description: Sets the value at path only if it does exist.
  Response:
    Type: true
    Required: true
    Description: Returns true if the value was set.
```

----------------------------------------

TITLE: TypeScript Example for JSON.ARRINDEX Usage
DESCRIPTION: Illustrates how to use the `JSON.ARRINDEX` command with the Upstash Redis client in TypeScript to find the index of a value in a JSON array.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/arrindex.mdx

LANGUAGE: ts
CODE:
```
const index = await redis.json.arrindex("key", "$.path.to.array", "a");
```

----------------------------------------

TITLE: API Documentation for JSON.GET Method
DESCRIPTION: Comprehensive documentation for the JSON.GET method, outlining its required and optional parameters, their types, and the structure of the expected response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/get.mdx

LANGUAGE: APIDOC
CODE:
```
Method: JSON.GET
Description: Get a single value from a JSON document.

Arguments:
- key (str, required): The key of the json entry.
- paths (*List[str], default=$): One or more paths to retrieve from the JSON document.

Response:
- List[TValue | null] (required): The value at the specified path or null if the path does not exist.
```

----------------------------------------

TITLE: TypeScript Example for PEXPIREAT Command
DESCRIPTION: Demonstrates how to use the `pexpireat` command in TypeScript to set an expiration time for a Redis key, calculating a future timestamp.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/generic/pexpireat.mdx

LANGUAGE: ts
CODE:
```
const 10MinutesFromNow = Date.now() + 10 * 60 * 1000;
 await redis.pexpireat(key, 10MinutesFromNow);
```

----------------------------------------

TITLE: JSON.OBJKEYS Command API Reference
DESCRIPTION: Detailed API documentation for the JSON.OBJKEYS command, outlining its required parameters, their types, descriptions, and the expected return type.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/objkeys.mdx

LANGUAGE: APIDOC
CODE:
```
JSON.OBJKEYS:
  Arguments:
    key: string (required)
      Description: The key of the json entry.
    path: string (default: "$")
      Description: The path of the array.
  Response:
    Type: string[][]
    Description: The keys of the object at the path.
```

----------------------------------------

TITLE: TypeScript Example for Redis ECHO Command
DESCRIPTION: Demonstrates how to use the Redis ECHO command in TypeScript with an Upstash Redis client to send and receive a message.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/auth/echo.mdx

LANGUAGE: typescript
CODE:
```
const response = await redis.echo("hello world");
console.log(response); // "hello world"
```

----------------------------------------

TITLE: GETBIT Command API Reference
DESCRIPTION: Comprehensive documentation for the GETBIT command, outlining its required input parameters (key and offset) and the expected integer return value, which represents the bit at the specified position.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/bitmap/getbit.mdx

LANGUAGE: APIDOC
CODE:
```
GETBIT Command:
  Description: Retrieve a single bit.
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the bitset
    offset:
      Type: int
      Required: true
      Description: Specify the offset at which to get the bit.
  Response:
    Type: int
    Required: true
    Description: The bit value stored at offset.
```

----------------------------------------

TITLE: Python Example for HPEXPIRETIME Usage
DESCRIPTION: Demonstrates how to use the `hpexpiretime` command in Python to retrieve the expiration time of a hash field after setting it and applying an expiration.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hpexpiretime.mdx

LANGUAGE: py
CODE:
```
redis.hset(hash_name, field, value)
redis.hpexpireat(hash_name, field, int(time.time() * 1000) + 1000)

assert redis.hpexpiretime(hash_name, field) == [1697059200000]
```

----------------------------------------

TITLE: TypeScript Example for ZMSCORE and ZADD
DESCRIPTION: Demonstrates adding members to a sorted set using `redis.zadd` and then retrieving their scores using `redis.zmscore` from an Upstash Redis instance.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/zset/zmscore.mdx

LANGUAGE: ts
CODE:
```
await redis.zadd("key", 
    { score: 1, member: "m1" },
    { score: 2, member: "m2" },
    { score: 3, member: "m3" },
    { score: 4, member: "m4" },
)

const scores = await redis.zmscore("key", ["m2", "m4"])
console.log(scores) // [2, 4]
```

----------------------------------------

TITLE: Run and Deploy Next.js Application
DESCRIPTION: Shell commands to run the Next.js application locally for development and to deploy it to Vercel.

SOURCE: https://upstash.com/docs/redis/quickstarts/vercel-functions-app-router.mdx

LANGUAGE: shell
CODE:
```
npm run dev
vercel
```

----------------------------------------

TITLE: Configure Google Cloud Project and Enable Services
DESCRIPTION: This snippet configures the Google Cloud SDK to set the active project and enable the necessary services for Google Cloud Run deployment. It enables `run.googleapis.com` for Cloud Run and `cloudbuild.googleapis.com` for container image builds.

SOURCE: https://upstash.com/docs/redis/tutorials/cloud_run_sessions.mdx

LANGUAGE: bash
CODE:
```
gcloud config set project cloud-run-sessions

gcloud services enable run.googleapis.com

gcloud services enable cloudbuild.googleapis.com
```

----------------------------------------

TITLE: PEXPIREAT Command API Documentation
DESCRIPTION: Detailed API documentation for the Redis PEXPIREAT command, including arguments, their types, descriptions, and the command's response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/pexpireat.mdx

LANGUAGE: APIDOC
CODE:
```
PEXPIREAT:
  Arguments:
    key:
      type: str
      required: true
      description: The key to expire.
    unix_time_milliseconds:
      type: int | datetime.datetime
      required: true
      description: The timeout in unix milliseconds timestamp as int or a datetime.datetime object.
    nx:
      type: bool
      required: false
      description: Set expiry only when the key has no expiry
    xx:
      type: bool
      required: false
      description: Set expiry only when the key has an existing expiry
    gt:
      type: bool
      required: false
      description: Set expiry only when the new expiry is greater than current one
    lt:
      type: bool
      required: false
      description: Set expiry only when the new expiry is less than current one
  Response:
    type: bool
    description: `True` if the timeout was set
```

----------------------------------------

TITLE: TypeScript Example for HINCRBYFLOAT Usage
DESCRIPTION: Illustrates how to use the `hset` and `hincrby` methods with a Redis client in TypeScript to set an initial field value and then increment it by a float.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hincrbyfloat.mdx

LANGUAGE: ts
CODE:
```
await redis.hset("key", {
  field: 20,
  });
const after = await redis.hincrby("key", "field", 2.5);
console.log(after); // 22.5
```

----------------------------------------

TITLE: LINDEX Command API Reference
DESCRIPTION: Detailed API documentation for the LINDEX command, outlining its required arguments (key, index) and the expected response type and behavior.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/lindex.mdx

LANGUAGE: APIDOC
CODE:
```
Command: LINDEX
Description: Returns the element at index index in the list stored at key.

Arguments:
  key:
    Type: string
    Required: true
    Description: The key of the list.
  index:
    Type: number
    Required: true
    Description: The index of the element to return, zero-based.

Response:
  Type: TValue | null
  Required: true
  Description: The value of the element at index index in the list. If the index is out of range, `null` is returned.
```

----------------------------------------

TITLE: Initialize Fixed Window Ratelimit with Upstash Redis
DESCRIPTION: Demonstrates how to set up a fixed window ratelimiter using the `upstash_ratelimit` library, connected to an Upstash Redis instance. It configures a limit of 10 requests per 10-second window.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-py/algorithms.mdx

LANGUAGE: python
CODE:
```
from upstash_ratelimit import Ratelimit, FixedWindow
from upstash_redis import Redis

ratelimit = Ratelimit(
    redis=Redis.from_env(),
    limiter=FixedWindow(max_requests=10, window=10),
)
```

----------------------------------------

TITLE: TypeScript Example for Redis EXISTS Usage
DESCRIPTION: Illustrates how to use the `redis.exists` method in a TypeScript application to check for key existence and retrieve the count of existing keys.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/generic/exists.mdx

LANGUAGE: TypeScript
CODE:
```
await redis.set("key1", "value1")
await redis.set("key2", "value2")
const keys = await redis.exists("key1", "key2", "key3");
console.log(keys) // 2
```

----------------------------------------

TITLE: SMISMEMBER API Reference
DESCRIPTION: Detailed API documentation for the SMISMEMBER command, outlining its required arguments and the structure of its response.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/set/smismember.mdx

LANGUAGE: APIDOC
CODE:
```
SMISMEMBER:
  Arguments:
    key:
      type: string
      required: true
      description: The key of the set to check.
    members:
      type: TMember[]
      description: The members to check
  Response:
    type: (0 | 1)[]
    required: true
    description: An array of `0` and `1` values. `1` if the member exists in the set, `0` if not.
```

----------------------------------------

TITLE: RPOP Command API Reference
DESCRIPTION: Detailed API documentation for the RPOP command, including its arguments and response structure.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/rpop.mdx

LANGUAGE: APIDOC
CODE:
```
RPOP Command API:
  Arguments:
    key (str, required): The key of the list.
    count (int, optional): How many elements to pop. If not specified, a single element is popped.
  Response:
    type: TValue | TValue[] | null
    description: The popped element(s). If `count` was specified, an array of elements is returned, otherwise a single element is returned. If the list is empty, `null` is returned.
```

----------------------------------------

TITLE: JSON.NUMMULTBY API Reference
DESCRIPTION: Detailed documentation for the `JSON.NUMMULTBY` command, including its parameters and return value.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/nummultby.mdx

LANGUAGE: APIDOC
CODE:
```
JSON.NUMMULTBY(
  key: string, 
  path: string = "$", 
  multiply: number
):
  key: The key of the json entry.
  path: The path of the array. (Default: $)
  multiply: The number to multiply by.

Response:
  integer[]: The new value after multiplying
```

----------------------------------------

TITLE: Configure Upstash Redis Environment Variables
DESCRIPTION: Environment variables required to connect to the Upstash Redis database. These should be placed in a `.env` file and replaced with your actual Upstash Redis URL and token.

SOURCE: https://upstash.com/docs/redis/tutorials/using_serverless_framework.mdx

LANGUAGE: shell
CODE:
```
UPSTASH_REDIS_REST_URL=<YOUR_URL>
UPSTASH_REDIS_REST_TOKEN=<YOUR_TOKEN>
```

----------------------------------------

TITLE: Python Example for JSON.FORGET
DESCRIPTION: Illustrates how to use the `JSON.FORGET` command with the Python client for Upstash Redis, demonstrating how to delete a specific path within a JSON document.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/forget.mdx

LANGUAGE: python
CODE:
```
redis.json.forget("key", "$.path.to.value")
```

----------------------------------------

TITLE: Create New Laravel Project and Navigate
DESCRIPTION: Commands to initialize a new Laravel application named 'todo-cache' and change the current directory into the newly created project. This is the first step in setting up the development environment.

SOURCE: https://upstash.com/docs/redis/tutorials/laravel_caching.mdx

LANGUAGE: shell
CODE:
```
laravel new todo-cache
cd todo-cache
```

----------------------------------------

TITLE: Build Container Image with Google Cloud Build
DESCRIPTION: Submits the current directory to Google Cloud Build to create a container image. The image is tagged and pushed to Google Container Registry, making it available for deployment.

SOURCE: https://upstash.com/docs/redis/tutorials/cloud_run_sessions.mdx

LANGUAGE: Bash
CODE:
```
gcloud builds submit --tag gcr.io/cloud-run-sessions/main
```

----------------------------------------

TITLE: Python Example for JSON.DEL
DESCRIPTION: Demonstrates how to use the `redis.json.del` method in Python to delete a specific path within a JSON document stored in Redis.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/del.mdx

LANGUAGE: py
CODE:
```
redis.json.del("key", "$.path.to.value")
```

----------------------------------------

TITLE: Python Example for HPERSIST Usage
DESCRIPTION: Demonstrates the usage of `redis.hset`, `redis.hpexpire`, and `redis.hpersist` functions in Python, asserting the expected outcome of removing expiration.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hpersist.mdx

LANGUAGE: python
CODE:
```
redis.hset(hash_name, field, value)
redis.hpexpire(hash_name, field, 1000)

assert redis.hpersist(hash_name, field) == [1]
```

----------------------------------------

TITLE: HINCRBYFLOAT Python Usage Example
DESCRIPTION: Illustrates how to use the `hincrbyfloat` method with a Redis client in Python to increment a specific field within a hash by a floating-point value.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hincrbyfloat.mdx

LANGUAGE: Python
CODE:
```
redis.hset("myhash", "field1", 5.5)

assert redis.hincrbyfloat("myhash", "field1", 10.1) - 15.6 < 0.0001
```

----------------------------------------

TITLE: Python Example for Redis DEL Command
DESCRIPTION: Demonstrates how to use the `delete` method with a Python Redis client to remove multiple keys and verify their successful removal.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/del.mdx

LANGUAGE: python
CODE:
```
redis.set("key1", "Hello")
redis.set("key2", "World")
redis.delete("key1", "key2")

assert redis.get("key1") is None
assert redis.get("key2") is None
```

----------------------------------------

TITLE: HGETALL Redis Command API (APIDOC)
DESCRIPTION: API documentation for the HGETALL command, detailing its required arguments and the structure of the response, which is an object containing all fields and values from the specified hash.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hgetall.mdx

LANGUAGE: APIDOC
CODE:
```
HGETALL:
  Arguments:
    key:
      type: string
      required: true
      description: The key to get.
  Response:
    type: TValue | null
    required: true
    description: An object with all fields in the hash.
```

----------------------------------------

TITLE: RPUSHX Command API Reference
DESCRIPTION: Detailed API documentation for the RPUSHX command, including its arguments, types, and return values.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/rpushx.mdx

LANGUAGE: APIDOC
CODE:
```
RPUSHX Command:
  Description: Push an element at the end of the list only if the list exists.
  Arguments:
    key:
      Type: string
      Required: true
      Description: The key of the list.
    elements:
      Type: ...TValue[]
      Required: true
      Description: One or more elements to push at the end of the list.
  Response:
    Type: number
    Required: true
    Description: The length of the list after the push operation. 0 if the list did not exist and thus no element was pushed.
```

----------------------------------------

TITLE: HINCRBY API Reference
DESCRIPTION: Detailed API documentation for the HINCRBY command, including its purpose, required arguments with their types and descriptions, and the expected response type.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hincrby.mdx

LANGUAGE: APIDOC
CODE:
```
HINCRBY:
  Description: Increments the value of a hash field by a given amount.
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the hash.
    field:
      Type: str
      Required: true
      Description: The field to increment.
    increment:
      Type: int
      Required: false
      Description: How much to increment the field by. Can be negative to subtract.
  Response:
    Type: int
    Required: true
    Description: The new value of the field after the increment.
```

----------------------------------------

TITLE: TypeScript Example: SPOP Multiple Members
DESCRIPTION: Illustrates using the SPOP command with a count parameter in TypeScript to remove and return multiple random members from a Redis set.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/set/spop.mdx

LANGUAGE: TypeScript
CODE:
```
await redis.sadd("set", "a", "b", "c"); 
const popped = await redis.spop("set", 2);
console.log(popped); // ["a", "b"]
```

----------------------------------------

TITLE: TypeScript Example for JSON.TYPE
DESCRIPTION: Demonstrates how to use the `JSON.TYPE` command with the Upstash Redis client in TypeScript to retrieve the type of a JSON value at a specific path within a key.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/type.mdx

LANGUAGE: typescript
CODE:
```
const myType = await redis.json.type("key", "$.path.to.value");
```

----------------------------------------

TITLE: Ping Redis Server with TypeScript Client
DESCRIPTION: Example demonstrating how to send a PING command to the Upstash Redis server using the TypeScript client and log the 'PONG' response.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/auth/ping.mdx

LANGUAGE: ts
CODE:
```
const response = await redis.ping();
console.log(response); // "PONG"
```

----------------------------------------

TITLE: ZINTER Command API Reference
DESCRIPTION: Defines the arguments, their types, default values, and the expected response format for the ZINTER command.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zunion.mdx

LANGUAGE: APIDOC
CODE:
```
ZINTER Command:
  Arguments:
    - keys: List[str] (required)
      Description: The keys of the sets to compare.
    - weights: List[float] (default: None)
      Description: The weights to apply to the sets.
    - aggregate: "SUM" | "MIN" | "MAX" (default: "sum")
      Description: The aggregation function to apply to the sets.
    - withscores: bool (default: false)
      Description: Whether to include scores in the result.
  Response:
    - Type: List[str] | List[Tuple[str, float]]
      Description: The number of elements in the resulting set.
```

----------------------------------------

TITLE: ZINCRBY Command
DESCRIPTION: No description

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
ZINCRBY
```

----------------------------------------

TITLE: Python Example: JSON.SET with NX Option
DESCRIPTION: Illustrates how to use the `nx=true` option with `redis.json.set` to set a JSON value only if the specified path does not already exist within the key.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/set.mdx

LANGUAGE: python
CODE:
```
value = ...
redis.json.set(key, "$.path", value, nx=true)
```

----------------------------------------

TITLE: Python Example for JSON.ARRLEN
DESCRIPTION: Demonstrates how to use the `json.arrlen` method with the Upstash Redis client in Python to obtain the length of a JSON array stored under a specific key and path.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/arrlen.mdx

LANGUAGE: python
CODE:
```
length = redis.json.arrlen("key", "$.path.to.array")
```

----------------------------------------

TITLE: ZADD Command API Reference
DESCRIPTION: Detailed API documentation for the ZADD command, including its parameters, their types, descriptions, and the command's return value.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zadd.mdx

LANGUAGE: APIDOC
CODE:
```
ZADD(key: str, scores: Dict[str, float], xx: bool = False, nx: bool = False, gt: bool = False, lt: bool = False, ch: bool = False, incr: bool = False) -> int

Arguments:
  key (str, required): The key of the sorted set.
  scores (Dict[str, float], required): A dictionary of elements and their scores.
  xx (bool, optional): Only update elements that already exist. Never add elements.
  nx (bool, optional): Only add new elements. Never update elements.
  gt (bool, optional): Update scores if the new score is greater than the old score.
  lt (bool, optional): Update scores if the new score is less than the old score.
  ch (bool, optional): Return the number of elements changed instead.
  incr (bool, optional): When this option is specified ZADD acts like ZINCRBY. Only one score-element pair can be specified in this mode.

Returns:
  int: The number of elements added to the sorted sets, not including elements already existing for which the score was updated.
       If `ch` was specified, the number of elements that were updated.
       If `incr` was specified, the new score of `member`.
```

----------------------------------------

TITLE: Python Example for JSON.ARRAPPEND
DESCRIPTION: Illustrates how to use the `redis.json.arrappend` method in Python to append a single value to a specified array path within a JSON document stored in Redis.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/arrappend.mdx

LANGUAGE: python
CODE:
```
redis.json.arrappend("key", "$.path.to.array", "a")
```

----------------------------------------

TITLE: HDEL Command API Reference
DESCRIPTION: Detailed API documentation for the HDEL command, outlining its parameters and return value.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hdel.mdx

LANGUAGE: APIDOC
CODE:
```
HDEL(key: str, fields: *List[str]) -> int
  key: The key to get.
  fields: One or more fields to delete.
Returns: The number of fields that were removed from the hash.
```

----------------------------------------

TITLE: Python Examples for HRANDFIELD Command
DESCRIPTION: Illustrates how to use the `hrandfield` method with the Upstash Redis Python client to retrieve single, multiple, or value-paired random fields from a hash.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hrandfield.mdx

LANGUAGE: python
CODE:
```
redis.hset("myhash", values={
    "field1": "Hello",
    "field2": "World"
})

assert redis.hrandfield("myhash") in ["field1", "field2"]
```

LANGUAGE: python
CODE:
```
redis.hset("myhash", values={
    "field1": "Hello",
    "field2": "World"
})

assert redis.hrandfield("myhash", count=2) in [
    ["field1", "field2"],
    ["field2", "field1"]
]
```

LANGUAGE: python
CODE:
```
redis.hset("myhash", values={
    "field1": "Hello",
    "field2": "World"
})

assert redis.hrandfield("myhash", count=1, withvalues=True) in [
    {"field1": "Hello"},
    {"field2": "World"}
]
```

----------------------------------------

TITLE: LINDEX Redis Command API Documentation
DESCRIPTION: Detailed API documentation for the Redis LINDEX command, including arguments, their types, and the expected response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/lindex.mdx

LANGUAGE: APIDOC
CODE:
```
LINDEX Command:
  Description: Returns the element at index index in the list stored at key.
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the list.
    index:
      Type: int
      Required: true
      Description: The index of the element to return, zero-based.
  Response:
    Type: Optional[str]
    Required: true
    Description: The value of the element at index index in the list. If the index is out of range, None is returned.
```

----------------------------------------

TITLE: Real-Time Chat Interface (HTML, CSS, JavaScript)
DESCRIPTION: This HTML file (`chat.html`) provides the complete front-end for the real-time chat application. It includes the structural elements (HTML), visual styling (CSS) for the chat box, messages, and input controls, and client-side logic (JavaScript) to connect to the Socket.IO server, handle user input, send messages, and display incoming messages in real-time.

SOURCE: https://upstash.com/docs/redis/tutorials/python_realtime_chat.mdx

LANGUAGE: HTML
CODE:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Real-Time Chat</title>
    <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background-color: #f4f6f9;
        }

        #chat-container {
            width: 90%;
            max-width: 600px;
            height: 70%;
            border: 1px solid #ddd;
            border-radius: 10px;
            background-color: #fff;
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        #chat-box {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            border-bottom: 1px solid #ddd;
            scrollbar-width: thin;
            scrollbar-color: #ccc #f4f6f9;
        }

        #chat-box::-webkit-scrollbar {
            width: 8px;
        }

        #chat-box::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 5px;
        }

        .message {
            margin: 10px 0;
            padding: 10px 15px;
            border-radius: 15px;
            max-width: 70%;
            word-wrap: break-word;
        }

        .message.sent {
            align-self: flex-end;
            background-color: #007BFF;
            color: white;
        }

        .message.received {
            align-self: flex-start;
            background-color: #f1f1f1;
            color: black;
        }

        #input-container {
            display: flex;
            padding: 10px;
            gap: 10px;
            background-color: #f4f6f9;
            border-radius: 0 0 10px 10px;
        }

        #message-input {
            flex: 1;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        #send-button {
            padding: 10px 20px;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            background-color: #007BFF;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        #send-button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div id="chat-container">
        <div id="chat-box"></div>
        <div id="input-container">
            <input id="message-input" type="text" placeholder="Type your message...">
            <button id="send-button">Send</button>
        </div>
    </div>

    <script>
        const socket = io();

        const chatBox = document.getElementById("chat-box");
        const messageInput = document.getElementById("message-input");
        const sendButton = document.getElementById("send-button");

        // Generate or retrieve a random username for this tab
        function getUsername() {
            let username = sessionStorage.getItem("username");
            if (!username) {
                username = "User" + Math.floor(Math.random() * 1000); // Temporary random username
                sessionStorage.setItem("username", username);
            }
            return username;
        }

        const username = getUsername();

        // Append message to chat box
        function addMessage(message, type = "received") {
            const messageElement = document.createElement("div");
            messageElement.textContent = message;
            messageElement.classList.add("message", type);
            chatBox.appendChild(messageElement);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        // Receive messages from server
        socket.on("message", (data) => {
            addMessage(`${data.user}: ${data.message}`, "received");
        });

        // Send message to server
        sendButton.addEventListener("click", () => {
            const message = messageInput.value.trim();
            if (message) {

```

----------------------------------------

TITLE: JSON Response for Array Redis Result
DESCRIPTION: Example of a JSON response from the Upstash REST API when a Redis command returns an array value.

SOURCE: https://upstash.com/docs/redis/features/restapi.mdx

LANGUAGE: json
CODE:
```
{ "result": ["value1", null, "value2"] }
```

----------------------------------------

TITLE: JSON Response for String Redis Result
DESCRIPTION: Example of a JSON response from the Upstash REST API when a Redis command returns a string value.

SOURCE: https://upstash.com/docs/redis/features/restapi.mdx

LANGUAGE: json
CODE:
```
{ "result": "value" }
```

----------------------------------------

TITLE: SUNION Command API Reference
DESCRIPTION: Detailed API documentation for the `SUNION` command, outlining its required arguments and the structure of its response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/set/sunion.mdx

LANGUAGE: APIDOC
CODE:
```
Command: SUNION
Description: Return the union between sets

Arguments:
  - name: keys
    type: *List[str]
    required: true
    description: The keys of the sets to perform the union operation on.

Response:
  - type: set[str]
    required: true
    description: The resulting set
```

----------------------------------------

TITLE: JSON Response for Integer Redis Result
DESCRIPTION: Example of a JSON response from the Upstash REST API when a Redis command returns an integer value.

SOURCE: https://upstash.com/docs/redis/features/restapi.mdx

LANGUAGE: json
CODE:
```
{ "result": 137 }
```

----------------------------------------

TITLE: JSON Response for Null Redis Result
DESCRIPTION: Example of a JSON response from the Upstash REST API when a Redis command returns a `null` value.

SOURCE: https://upstash.com/docs/redis/features/restapi.mdx

LANGUAGE: json
CODE:
```
{ "result": null }
```

----------------------------------------

TITLE: Redis SCRIPT LOAD Command API Reference
DESCRIPTION: Detailed API documentation for the Redis SCRIPT LOAD command, outlining its required arguments and the expected response format.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/scripts/script_load.mdx

LANGUAGE: APIDOC
CODE:
```
SCRIPT LOAD:
  Arguments:
    script (str, required): The script to load.
  Response:
    (str, required): The sha1 of the script.
```

----------------------------------------

TITLE: SUNION Command
DESCRIPTION: No description

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
SUNION
```

----------------------------------------

TITLE: Initialize AWS CDK Project Directory
DESCRIPTION: Creates a new directory for the CDK project and navigates into it. This directory name is used by CDK CLI for naming resources.

SOURCE: https://upstash.com/docs/redis/quickstarts/python-aws-lambda.mdx

LANGUAGE: shell
CODE:
```
mkdir counter-cdk && cd counter-cdk
```

----------------------------------------

TITLE: Retrieve Koyeb Application Public Domain
DESCRIPTION: Fetches and displays key details of a deployed Koyeb application, including its unique ID, name, public access domains, and creation timestamp.

SOURCE: https://upstash.com/docs/redis/quickstarts/koyeb.mdx

LANGUAGE: bash
CODE:
```
$ koyeb app get example-koyeb-upstash
ID      	NAME         	        DOMAINS                          	        CREATED AT
85c78d9a	example-koyeb-upstash	["example-koyeb-upstash-myorg.koyeb.app"]	31 May 23 13:08 UTC
```

----------------------------------------

TITLE: TypeScript: Execute EVALSHA_RO Command
DESCRIPTION: Example demonstrating how to use the `evalshaRo` method with the Upstash Redis client in TypeScript to execute a cached read-only Lua script by its SHA1 hash.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/scripts/evalsha_ro.mdx

LANGUAGE: ts
CODE:
```
const result = await redis.evalshaRo("fb67a0c03b48ddbf8b4c9b011e779563bdbc28cb", [], ["hello"]);
console.log(result) // "hello"
```

----------------------------------------

TITLE: RPUSHX Command API Reference
DESCRIPTION: Detailed API specification for the RPUSHX command, outlining its required arguments, their types, and the structure of the command's integer response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/rpushx.mdx

LANGUAGE: APIDOC
CODE:
```
RPUSHX Command:
  Description: Push an element at the end of the list only if the list exists.
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the list.
    elements:
      Type: *List[str]
      Required: true
      Description: One or more elements to push at the end of the list.
  Response:
    Type: int
    Required: true
    Description: The length of the list after the push operation. 0 if the list did not exist and thus no element was pushed.
```

----------------------------------------

TITLE: TypeScript Example for HPEXPIRETIME Usage
DESCRIPTION: Demonstrates how to use the `hset`, `hpexpireat`, and `hpexpiretime` commands with Upstash Redis in TypeScript to set a field, set its expiration, and then retrieve its expiration time.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hpexpiretime.mdx

LANGUAGE: ts
CODE:
```
await redis.hset("my-key", "my-field", "my-value");
await redis.hpexpireat("my-key", "my-field", Date.now() + 1000);
const expireTime = await redis.hpexpiretime("my-key", "my-field");

console.log(expireTime); // e.g., 1697059200000
```

----------------------------------------

TITLE: Example Usage of HEXPIRETIME in TypeScript
DESCRIPTION: Illustrates how to use the `hexpiretime` command with Upstash Redis in a TypeScript application, including setting a key, expiring a field, and retrieving its expiration time.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hexpiretime.mdx

LANGUAGE: ts
CODE:
```
await redis.hset("my-key", "my-field", "my-value");
await redis.hexpireat("my-key", "my-field", Math.floor(Date.now() / 1000) + 10);
const expireTime = await redis.hexpiretime("my-key", "my-field");

console.log(expireTime); // e.g., [1697059200]
```

----------------------------------------

TITLE: SPOP Command API Reference
DESCRIPTION: Detailed API documentation for the SPOP command, including its arguments, types, and expected response structure.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/set/spop.mdx

LANGUAGE: APIDOC
CODE:
```
SPOP Command:
  Description: Removes and returns one or more random members from a set.
  Arguments:
    key:
      type: string
      required: true
      description: The key of the set.
    count:
      type: number
      default: 1
      description: How many members to remove and return.
  Response:
    type: TMember | TMember[]
    required: true
    description: The popped member. If `count` is specified, an array of members is returned.
```

----------------------------------------

TITLE: JSON.OBJKEYS Command API Reference
DESCRIPTION: Detailed API documentation for the JSON.OBJKEYS command, outlining its required arguments, their types, default values, and the structure of the expected response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/objkeys.mdx

LANGUAGE: APIDOC
CODE:
```
JSON.OBJKEYS:
  Arguments:
    key:
      type: str
      required: true
      description: The key of the json entry.
    path:
      type: str
      default: "$"
      description: The path of the object.
  Response:
    type: List[List[str]]
    required: true
    description: The keys of the object at the path.
```

----------------------------------------

TITLE: Deploy Serverless Functions
DESCRIPTION: This command deploys the serverless functions defined in the project, making them accessible via generated API endpoints.

SOURCE: https://upstash.com/docs/redis/tutorials/histogram.mdx

LANGUAGE: bash
CODE:
```
serverless deploy
```

----------------------------------------

TITLE: SCRIPT EXISTS Command API Documentation
DESCRIPTION: Detailed API documentation for the SCRIPT EXISTS command, including its purpose, required arguments, and expected response format.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/scripts/script_exists.mdx

LANGUAGE: APIDOC
CODE:
```
SCRIPT EXISTS:
  Description: Check if scripts exist in the script cache.
  Arguments:
    hashes:
      Type: string[]
      Required: true
      Description: The sha1 of the scripts to check.
  Response:
    Type: number[]
    Required: true
    Description: An array of numbers. 1 if the script exists, otherwise 0.
```

----------------------------------------

TITLE: JSON.ARRLEN Command API Reference
DESCRIPTION: Detailed API documentation for the `JSON.ARRLEN` command, outlining its required arguments, their types, default values, and the expected response structure.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/arrlen.mdx

LANGUAGE: APIDOC
CODE:
```
JSON.ARRLEN:
  description: Report the length of the JSON array at `path` in `key`.
  arguments:
    key:
      type: string
      required: true
      description: The key of the json entry.
    path:
      type: string
      default: $
      description: The path of the array.
  response:
    type: integer[]
    required: true
    description: The length of the array.
```

----------------------------------------

TITLE: Get Single Random Member from Redis Set (Python)
DESCRIPTION: Demonstrates how to retrieve a single random member from a Redis set using `redis.srandmember()` in Python.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/set/srandmember.mdx

LANGUAGE: py
CODE:
```
redis.sadd("myset", "one", "two", "three")

assert redis.srandmember("myset") in {"one", "two", "three"}
```

----------------------------------------

TITLE: Fastly Local Server Backend Configuration
DESCRIPTION: This TOML configuration snippet adds a backend entry to `fastly.toml` specifically for local development. It maps the 'upstash' backend to the Upstash Redis REST URL, allowing the local Fastly server to correctly route requests to the Redis instance.

SOURCE: https://upstash.com/docs/redis/quickstarts/fastlycompute.mdx

LANGUAGE: toml
CODE:
```
[local_server.backends.upstash]
url = "UPSTASH_REDIS_REST_URL"
```

----------------------------------------

TITLE: GETSET Command API Reference
DESCRIPTION: Defines the GETSET command, outlining its required arguments (key, newValue) and the expected return value, which is the old value of the key or null if it didn't exist.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/string/getset.mdx

LANGUAGE: APIDOC
CODE:
```
GETSET:
  description: Return the value of the specified key and replace it with a new value.
  arguments:
    key:
      type: string
      required: true
      description: The key to get.
    newValue:
      type: any
      required: true
      description: The new value to store.
  response:
    type: string | null
    required: true
    description: The value stored at the key or null if the key doesn't exist.
```

----------------------------------------

TITLE: Perform ZINTERSTORE with aggregation in TypeScript
DESCRIPTION: Shows how to use the `aggregate` option with `redis.zinterstore` to specify how scores are combined when multiple input sets contain the same member. This example uses 'sum' aggregation.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/zset/zinterstore.mdx

LANGUAGE: ts
CODE:
```
await redis.zadd(
    "key1", 
    { score: 1, member: "member1" },
)
await redis.zadd(
    "key2",
    { score: 1, member: "member1" },
    { score: 2, member: "member2" },
)
const res = await redis.zinterstore(
    "destination",
    2,
    ["key1", "key2"],
    { aggregate: "sum" },
);
console.log(res) // 1
```

----------------------------------------

TITLE: SDIFF Command API Reference
DESCRIPTION: Detailed API documentation for the SDIFF command, outlining its required arguments and the structure of its response.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/set/sdiff.mdx

LANGUAGE: APIDOC
CODE:
```
Command: SDIFF
Description: Return the difference between sets

Arguments:
  keys:
    Type: ...string[]
    Required: true
    Description: The keys of the sets to perform the difference operation on.

Response:
  Type: TValue[]
  Required: true
  Description: The members of the resulting set.
```

----------------------------------------

TITLE: LPOP Command API Reference
DESCRIPTION: Defines the arguments and response structure for the LPOP Redis command, detailing input parameters, their types, and the format of the returned data.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/lpop.mdx

LANGUAGE: APIDOC
CODE:
```
LPOP Command:
  Description: Remove and return the first element(s) of a list

  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the list.
    count:
      Type: int
      Required: false
      Description: How many elements to pop. If not specified, a single element is popped.

  Response:
    Type: str | List[str] | None
    Required: true
    Description: The popped element(s). If `count` was specified, an array of elements is returned, otherwise a single element is returned. If the list is empty, `None` is returned.
```

----------------------------------------

TITLE: Flush Redis Script Cache in TypeScript
DESCRIPTION: Examples demonstrating how to use the `redis.scriptFlush()` method to remove scripts from the Redis cache, showing both basic usage and usage with the `async` option.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/scripts/script_flush.mdx

LANGUAGE: ts
CODE:
```
await redis.scriptFlush();
```

LANGUAGE: ts
CODE:
```
await redis.scriptFlush({
  async: true,
});
```

----------------------------------------

TITLE: Generic Upstash REST API Command Structure
DESCRIPTION: Illustrates the general structure for constructing Upstash REST API commands, mapping Redis commands and their arguments to URL paths.

SOURCE: https://upstash.com/docs/redis/features/restapi.mdx

LANGUAGE: shell
CODE:
```
curl REST_URL/COMMAND/arg1/arg2/../argN
```

----------------------------------------

TITLE: RPOP Command Usage Examples in TypeScript
DESCRIPTION: Illustrative TypeScript code snippets demonstrating the RPOP command's functionality for popping a single element or multiple elements from a Redis list.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/rpop.mdx

LANGUAGE: typescript
CODE:
```
await redis.rpush("key", "a", "b", "c"); 
const element = await redis.rpop("key");
console.log(element); // "c"
```

LANGUAGE: typescript
CODE:
```
await redis.rpush("key", "a", "b", "c"); 
const element = await redis.rpop("key", 2);
console.log(element); // ["c", "b"]
```

----------------------------------------

TITLE: PEXPIREAT Command API Reference
DESCRIPTION: Detailed API documentation for the PEXPIREAT command, including its parameters and expected return values.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/generic/pexpireat.mdx

LANGUAGE: APIDOC
CODE:
```
PEXPIREAT:
  description: Sets a timeout on key. After the timeout has expired, the key will automatically be deleted.
  arguments:
    key:
      type: string
      required: true
      description: The key to expire.
    unixmilli:
      type: integer
      required: false
      description: The unix timestamp in milliseconds at which the key will expire.
  response:
    type: integer
    description: '1 if the timeout was applied, 0 if key does not exist.'
```

----------------------------------------

TITLE: HDEL Command API Documentation
DESCRIPTION: Detailed API documentation for the HDEL command, including its arguments, return type, and purpose.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hdel.mdx

LANGUAGE: APIDOC
CODE:
```
HDEL Command:
  Description: Deletes one or more hash fields.
  Arguments:
    key:
      Type: string
      Required: true
      Description: The key to get.
    fields:
      Type: string[]
      Required: true
      Description: One or more fields to delete.
  Response:
    Type: integer
    Required: true
    Description: The number of fields that were removed from the hash.
```

----------------------------------------

TITLE: Toggle JSON Boolean Value in TypeScript
DESCRIPTION: An example demonstrating how to use the `redis.json.toggle` method in TypeScript. This snippet shows how to toggle a boolean value at a specific JSON path within a key.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/toggle.mdx

LANGUAGE: typescript
CODE:
```
const bool = await redis.json.toggle("key", "$.path.to.bool");
```

----------------------------------------

TITLE: Initialize Upstash Redis in Deno
DESCRIPTION: Shows how to initialize an Upstash Redis client in Deno environments, including Deno Deploy and Netlify Edge. Configuration can be provided explicitly or loaded directly from environment variables, using the Deno-specific import path.

SOURCE: https://upstash.com/docs/redis/sdks/ts/deployment.mdx

LANGUAGE: ts
CODE:
```
import { Redis } from "https://deno.land/x/upstash_redis/mod.ts"

const redis = new Redis({
  url: <UPSTASH_REDIS_REST_URL>,
  token: <UPSTASH_REDIS_REST_TOKEN>,
})

// or
const redis = Redis.fromEnv();
```

----------------------------------------

TITLE: Deploy Fly.io Application
DESCRIPTION: Deploys the application to Fly.io, pushing the latest code changes and making them live. This command initiates the build and release process for the application.

SOURCE: https://upstash.com/docs/redis/quickstarts/elixir.mdx

LANGUAGE: Shell
CODE:
```
fly deploy
```

----------------------------------------

TITLE: HVALS Command API Reference
DESCRIPTION: Detailed API documentation for the HVALS command, outlining its required arguments, expected return types, and behavior under different conditions.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hvals.mdx

LANGUAGE: APIDOC
CODE:
```
HVALS Command:
  Description: Returns all values in the hash stored at key.
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the hash.
  Response:
    Type: List[str]
    Required: true
    Description: All values in the hash, or an empty list when key does not exist.
```

----------------------------------------

TITLE: ZDIFFSTORE Command
DESCRIPTION: No description

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
ZDIFFSTORE
```

----------------------------------------

TITLE: SISMEMBER Command
DESCRIPTION: No description

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
SISMEMBER
```

----------------------------------------

TITLE: Redis @ Edge with Cloudflare Workers
DESCRIPTION: This article explores using Redis at the edge with Cloudflare Workers, enabling low-latency data access for global applications.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: javascript
CODE:
```
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN,
});

export default {
  async fetch(request, env) {
    await redis.set('edge_data', 'hello from the edge');
    const data = await redis.get('edge_data');
    return new Response(data);
  },
};
```

----------------------------------------

TITLE: SPOP Command API Reference
DESCRIPTION: Detailed API documentation for the SPOP command, including its arguments (key, count), their types and requirements, and the structure of the command's response (single string or set of strings).

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/set/spop.mdx

LANGUAGE: APIDOC
CODE:
```
SPOP Command:
  Description: Removes and returns one or more random members from a set.
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the set.
    count:
      Type: int
      Required: false
      Description: How many members to remove and return.
  Response:
    Type: str | set[str]
    Required: true
    Description: The popped member. If `count` is specified, a set of members is returned.
```

----------------------------------------

TITLE: JSON.STRAPPEND Command API Reference
DESCRIPTION: Detailed API documentation for the JSON.STRAPPEND command, outlining its required and optional parameters, their types, and the expected return value.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/strappend.mdx

LANGUAGE: APIDOC
CODE:
```
JSON.STRAPPEND(key: string, path: string = "$", value: string): integer[]
  key: The key of the json entry. (required)
  path: The path of the value. (default: "$")
  value: The value to append to the existing string. (required)
Returns: The length of the array after the appending.
```

----------------------------------------

TITLE: ZUNIONSTORE API Reference
DESCRIPTION: Detailed API documentation for the ZUNIONSTORE command, outlining its parameters, available options (like aggregation and weights), and the expected return value.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/zset/zunionstore.mdx

LANGUAGE: APIDOC
CODE:
```
ZUNIONSTORE:
  description: Writes the union between sets to a new key.
  parameters:
    destination:
      type: string
      required: true
      description: The key to write the union to.
    numkeys:
      type: integer
      required: true
      description: The number of keys to compare.
    keys:
      type: string | string[]
      required: true
      description: The keys to compare.
    options:
      aggregate:
        type: sum | min | max
        description: The aggregation method.
      weight:
        type: number
        description: The weight to apply to each key.
      weights:
        type: number[]
        description: The weights to apply to each key.
  returns:
    type: integer
    description: The number of elements in the resulting set.
```

----------------------------------------

TITLE: TypeScript Usage Example for ZREMRANGEBYLEX
DESCRIPTION: Illustrates how to invoke the `zremrangebylex` command using the Upstash Redis client in TypeScript, demonstrating the removal of elements from a sorted set within a specified lexicographical range.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/zset/zremrangebylex.mdx

LANGUAGE: TypeScript
CODE:
```
await redis.zremrangebylex("key", "alpha", "omega")
```

----------------------------------------

TITLE: HSCAN Usage Examples (TypeScript)
DESCRIPTION: Demonstrates various ways to use the HSCAN command with Upstash Redis in TypeScript, including basic scanning, filtering by pattern, and limiting the number of returned fields.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hscan.mdx

LANGUAGE: ts
CODE:
```
await redis.hset("key", {
  id: 1,
  username: "chronark",
  name: "andreas"
 });
const [newCursor, fields] = await redis.hscan("key", 0);
console.log(newCursor); // likely `0` since this is a very small hash
console.log(fields); // ["id", 1, "username", "chronark", "name", "andreas"]
```

LANGUAGE: ts
CODE:
```
await redis.hset("key", {
  id: 1,
  username: "chronark",
  name: "andreas",
});
const [newCursor, fields] = await redis.hscan("key", 0, { match: "user*" });
console.log(newCursor); // likely `0` since this is a very small hash
console.log(fields); // ["username", "chronark"]
```

LANGUAGE: ts
CODE:
```
await redis.hset("key", {
  id: 1,
  username: "chronark",
  name: "andreas",
});
const [newCursor, fields] = await redis.hscan("key", 0, { count: 2 });
console.log(fields); // ["id", 1, "name", "andreas", "username", "chronark"]
```

----------------------------------------

TITLE: HTTL Command API Reference
DESCRIPTION: Detailed API documentation for the HTTL command, including its required arguments, expected response types, and specific return values indicating field existence or expiration status.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/httl.mdx

LANGUAGE: APIDOC
CODE:
```
HTTL Command:
  Description: Retrieves the remaining time-to-live (TTL) for field(s) in a hash in seconds.
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the hash.
    fields:
      Type: Union[str, List[str]]
      Required: true
      Description: The field or list of fields to retrieve the TTL for.
  Response:
    Type: List[int]
    Required: true
    Description: A list of integers representing the remaining TTL in seconds for each field.
    Special Values:
      -2: If the field does not exist in the hash or if the key doesn't exist.
      -1: If the field exists but has no associated expiration.
    See Also: https://redis.io/commands/httl
```

----------------------------------------

TITLE: Python Example: Iterate All Fields in a Redis Hash with HSCAN
DESCRIPTION: Demonstrates how to use the `hscan` method in Python to retrieve all fields from a Redis hash iteratively until the cursor returns to 0.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hscan.mdx

LANGUAGE: python
CODE:
```
# Get all members of a hash.

cursor = 0
results = []

while True:
    cursor, keys = redis.hscan("myhash", cursor, match="*")

    results.extend(keys)
    if cursor == 0:
        break
```

----------------------------------------

TITLE: Dump and Import Redis Data using upstash-redis-dump
DESCRIPTION: This snippet demonstrates how to use the `upstash-redis-dump` tool to export data from a Redis instance. It shows the command-line arguments required to connect to a specific Redis host, port, database, and password, with TLS enabled, and redirect the output to a local file named `redis.dump`. The output also confirms the number of keys dumped.

SOURCE: https://upstash.com/docs/redis/howto/importexport.mdx

LANGUAGE: shell
CODE:
```
$ upstash-redis-dump -db 0 -host eu1-moving-loon-6379.upstash.io -port 6379 -pass PASSWORD -tls > redis.dump
Database 0: 9 keys dumped
```

----------------------------------------

TITLE: Redis GETDEL Command API Documentation
DESCRIPTION: Detailed API documentation for the Redis `GETDEL` command, outlining its arguments and the expected response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/string/getdel.mdx

LANGUAGE: APIDOC
CODE:
```
GETDEL Command:
  Description: Return the value of the specified key and delete the key.
  Arguments:
    key: str (required)
      Description: The key to get.
  Response:
    Type: string or None
    Description: The value stored at the key or `None` if the key doesn't exist.
```

----------------------------------------

TITLE: IP Address Allow/Deny with Cloudflare Workers and Upstash Redis
DESCRIPTION: This video explains how to implement IP address filtering using Cloudflare Workers and Upstash Redis.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: javascript
CODE:
```
// Similar logic to the article, focusing on the video's explanation
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN,
});

export default {
  async fetch(request, env) {
    const ip = request.headers.get('cf-connecting-ip');
    const isDenied = await redis.sismember('denied_ips', ip);

    if (isDenied) {
      return new Response('Access Denied', { status: 403 });
    }

    return fetch(request);
  },
};
```

----------------------------------------

TITLE: JSON.ARRTRIM API Documentation
DESCRIPTION: Detailed API documentation for the JSON.ARRTRIM command, outlining its required parameters, their types, descriptions, and the structure of the command's response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/arrtrim.mdx

LANGUAGE: APIDOC
CODE:
```
JSON.ARRTRIM:
  Arguments:
    key:
      type: str
      required: true
      description: The key of the json entry.
    path:
      type: str
      required: true
      description: The path of the array.
    start:
      type: int
      required: true
      description: The start index of the range.
    stop:
      type: int
      required: true
      description: The stop index of the range.
  Response:
    type: List[int]
    required: true
    description: The length of the array after the trimming.
```

----------------------------------------

TITLE: Get Multiple Random Members from Redis Set (Python)
DESCRIPTION: Illustrates how to retrieve multiple random members from a Redis set by specifying the `count` argument with `redis.srandmember()` in Python.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/set/srandmember.mdx

LANGUAGE: py
CODE:
```
redis.sadd("myset", "one", "two", "three")

assert redis.srandmember("myset", 2) in {"one", "two", "three"}
```

----------------------------------------

TITLE: Upstash Redis String Commands
DESCRIPTION: Enables manipulation of string values stored in Upstash Redis. This includes appending, incrementing/decrementing, getting substrings, and setting values with various options.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/overview.mdx

LANGUAGE: python
CODE:
```
append(key: str, value: str)
decr(key: str)
decrby(key: str, decrement: int)
get(key: str)
getdel(key: str)
getrange(key: str, start: int, end: int)
getset(key: str, value: str)
incr(key: str)
incrby(key: str, increment: int)
incrbyfloat(key: str, increment: float)
mget(keys: list[str])
mset(mapping: dict[str, str])
msetnx(mapping: dict[str, str])
set(key: str, value: str)
setrange(key: str, offset: int, value: str)
strlen(key: str)
```

----------------------------------------

TITLE: LPOS Command API Documentation
DESCRIPTION: Detailed API specification for the Redis LPOS command, including arguments, optional parameters, and response types.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/lpos.mdx

LANGUAGE: APIDOC
CODE:
```
LPOS Command:
  Description: Returns the index of matching elements inside a list.

  Arguments:
    key:
      Type: string
      Required: true
      Description: The key of the list.
    element:
      Type: unknown
      Required: true
      Description: The element to match.
    opts (Optional):
      Type: object
      Properties:
        rank:
          Type: number
          Description: The rank of the element to match. If specified, the element at the given rank is matched instead of the first element.
        count:
          Type: number
          Description: The maximum number of elements to match. If specified, an array of elements is returned instead of a single element.
        maxLen:
          Type: number
          Description: Limit the number of comparisons to perform.

  Response:
    Type: number | number[]
    Required: true
    Description: The index of the matching element or an array of indexes if opts.count is specified.
```

----------------------------------------

TITLE: ZCARD Command
DESCRIPTION: No description

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
ZCARD
```

----------------------------------------

TITLE: HEXISTS Command API Reference
DESCRIPTION: Detailed API documentation for the HEXISTS command, outlining its arguments, expected response, and behavior.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hexists.mdx

LANGUAGE: APIDOC
CODE:
```
HEXISTS Command:
  Description: Checks if a field exists in a hash.
  Arguments:
    key:
      Type: string
      Required: true
      Description: The key to get.
    field:
      Type: string
      Required: true
      Description: The field to check.
  Response:
    Type: integer
    Required: true
    Description: '1' if the hash contains 'field'. '0' if the hash does not contain 'field', or 'key' does not exist.
```

----------------------------------------

TITLE: ZRANK Usage Example in TypeScript
DESCRIPTION: Demonstrates how to call the ZRANK command using the Upstash Redis client in TypeScript. It shows a simple asynchronous call to retrieve the rank of a member within a specified key.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/zset/zrank.mdx

LANGUAGE: ts
CODE:
```
const rank = await redis.rank("key", "member");
```

----------------------------------------

TITLE: Initialize Upstash Redis in Node.js/Browser
DESCRIPTION: Demonstrates how to initialize an Upstash Redis client in Node.js or browser environments. Configuration can be loaded from explicit URL/token environment variables or directly using `Redis.fromEnv()`. This method is suitable for platforms like Vercel, Netlify, and AWS Lambda.

SOURCE: https://upstash.com/docs/redis/sdks/ts/deployment.mdx

LANGUAGE: ts
CODE:
```
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: <UPSTASH_REDIS_REST_URL>,
  token: <UPSTASH_REDIS_REST_TOKEN>,
})

// or load directly from env
const redis = Redis.fromEnv()
```

----------------------------------------

TITLE: Example Usage of Redis TYPE in TypeScript
DESCRIPTION: Illustrates how to use the `upstash-redis` client in TypeScript to set a key with a string value and then retrieve its data type using the `type` command, logging the result to the console.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/generic/type.mdx

LANGUAGE: typescript
CODE:
```
await redis.set("key", "value");
const t = await redis.type("key");
console.log(t) // "string"
```

----------------------------------------

TITLE: SCAN Command API Documentation
DESCRIPTION: Detailed API documentation for the `SCAN` command, outlining its required and optional arguments, their types, descriptions, and the structure of the returned response.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/generic/scan.mdx

LANGUAGE: APIDOC
CODE:
```
SCAN Command:
  Description: Scan the database for keys.

  Arguments:
    cursor: string (required)
      Description: The cursor value. Start with "0" on the first call, then use the cursor returned by each call for the next. It's a string to safely support large numbers that might exceed JavaScript's number limits.
    options: Object (optional)
      Description: Optional parameters to filter the scan.
      Properties:
        match: string (optional)
          Description: Glob-style pattern to filter by field names.
        count: number (optional)
          Description: Number of fields to return per call.
        type: string (optional)
          Description: Filter by type. For example `string`, `hash`, `set`, `zset`, `list`, `stream`.

  Response: [string, string[]] (required)
    Description: Returns the next cursor and the list of matching keys. When the returned cursor is "0", the scan is complete.
```

----------------------------------------

TITLE: TypeScript Example: Retrieve Bit with Upstash Redis Client
DESCRIPTION: Illustrates how to use the `getbit` method with the Upstash Redis client in TypeScript to asynchronously retrieve a single bit from a specified key at a given offset.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/bitmap/getbit.mdx

LANGUAGE: ts
CODE:
```
const bit = await redis.getbit(key, 4);
```

----------------------------------------

TITLE: Python ZUNIONSTORE with Weights
DESCRIPTION: Shows how to apply custom weights to input sets when using ZUNIONSTORE. This example demonstrates how weights influence the final scores of members in the resulting set, affecting the aggregated score.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zunionstore.mdx

LANGUAGE: py
CODE:
```
redis.zadd("key1", {"a": 1})

redis.zadd("key2", {"a": 1})

result = redis.zunionstore(["key1", "key2"],
                      withscores=True,
                      aggregate="SUM",
                      weights=[2, 3])

assert result == [("a", 5)]
```

----------------------------------------

TITLE: SREM Command
DESCRIPTION: No description

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
SREM
```

----------------------------------------

TITLE: Initialize Azure Functions Project
DESCRIPTION: Initializes a new Azure Functions project with TypeScript support using the Azure Functions Core Tools. This command sets up the basic project structure and configuration.

SOURCE: https://upstash.com/docs/redis/quickstarts/azure-functions.mdx

LANGUAGE: shell
CODE:
```
func init --typescript
```

----------------------------------------

TITLE: JSON Response for Redis Command Error
DESCRIPTION: Examples of JSON responses from the Upstash REST API when a Redis command fails or is rejected, showing the `error` field with an explanatory message.

SOURCE: https://upstash.com/docs/redis/features/restapi.mdx

LANGUAGE: json
CODE:
```
{"error":"WRONGPASS invalid password"}

{"error":"ERR wrong number of arguments for 'get' command"}
```

----------------------------------------

TITLE: Successful Redis Command JSON Response
DESCRIPTION: Example of a successful JSON response from the Upstash REST API after executing a command like `SET`. The `result` field indicates the outcome.

SOURCE: https://upstash.com/docs/redis/features/restapi.mdx

LANGUAGE: json
CODE:
```
{ "result": "OK" }
```

----------------------------------------

TITLE: PEXPIRE API Reference
DESCRIPTION: Detailed documentation for the PEXPIRE command, including its arguments, their types, requirements, and descriptions, as well as the expected response type and its meaning.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/pexpire.mdx

LANGUAGE: APIDOC
CODE:
```
PEXPIRE:
  description: Sets a timeout on key. After the timeout has expired, the key will automatically be deleted.
  arguments:
    - name: key
      type: str
      required: true
      description: The key to expire.
    - name: milliseconds | datetime.timedelta
      type: int
      required: true
      description: The timeout in milliseconds as int or datetime.timedelta
    - name: nx
      type: bool
      required: false
      description: Set expiry only when the key has no expiry
    - name: xx
      type: bool
      required: false
      description: Set expiry only when the key has an existing expiry
    - name: gt
      type: bool
      required: false
      description: Set expiry only when the new expiry is greater than current one
    - name: lt
      type: bool
      required: false
      description: Set expiry only when the new expiry is less than current one
  response:
    type: bool
    description: "True if the timeout was set"
```

----------------------------------------

TITLE: Retrieve Random Key using Upstash Redis (TypeScript)
DESCRIPTION: Illustrates how to call the `randomkey()` method using the Upstash Redis client in TypeScript to get a random key from the connected database.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/generic/randomkey.mdx

LANGUAGE: typescript
CODE:
```
const key = await redis.randomkey();
```

----------------------------------------

TITLE: LINSERT Redis Command API Reference
DESCRIPTION: Detailed API documentation for the Redis LINSERT command, outlining its required arguments (key, direction, pivot, value) with their types and descriptions, and specifying the integer response type along with its meaning.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/linsert.mdx

LANGUAGE: APIDOC
CODE:
```
LINSERT Command:
  Description: Insert an element before or after another element in a list.

  Arguments:
    key:
      Type: string
      Required: true
      Description: The key of the list.
    direction:
      Type: before | after
      Required: true
      Description: Whether to insert the element before or after pivot.
    pivot:
      Type: TValue
      Required: true
      Description: The element to insert before or after.
    value:
      Type: TValue
      Required: true
      Description: The element to insert.

  Response:
    Type: integer
    Required: true
    Description: The list length after insertion, 0 when the list doesn't exist or -1 when pivot was not found.
```

----------------------------------------

TITLE: HSETNX Redis Command API Documentation
DESCRIPTION: Documents the HSETNX command, including its required arguments (key, field, value) and the integer response indicating whether the field was set.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hsetnx.mdx

LANGUAGE: APIDOC
CODE:
```
HSETNX Command:
  Description: Write a field to a hash but only if the field does not exist.
  Arguments:
    key: string (required) - The key of the hash.
    field: string (required) - The name of the field.
    value: TValue (required) - Any value, if it's not a string it will be serialized to JSON.
  Response:
    integer (required) - 1 if the field was set, 0 if it already existed.
```

----------------------------------------

TITLE: RPUSH Command API Reference
DESCRIPTION: Detailed API specification for the RPUSH command, outlining its parameters, types, and return value.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/rpush.mdx

LANGUAGE: APIDOC
CODE:
```
Command: RPUSH
Description: Push an element at the end of the list.

Arguments:
- key (str, required): The key of the list.
- elements (*List[str], required): One or more elements to push at the end of the list.

Response:
- int (required): The length of the list after the push operation.
```

----------------------------------------

TITLE: Example Usage with Upstash Redis (TypeScript)
DESCRIPTION: Demonstrates how to use the SINTERSTORE command with the Upstash Redis client in TypeScript to add members to two sets, then find their intersection and store the result in a new destination set.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/set/sinterstore.mdx

LANGUAGE: TypeScript
CODE:
```
await redis.sadd("set1", "a", "b", "c"); 
await redis.sadd("set2", "c", "d", "e"); 
await redis.sinterstore("destination", "set1", "set2");
```

----------------------------------------

TITLE: Example Usage of LSET with Upstash Redis in TypeScript
DESCRIPTION: Illustrates how to use the `lpush` command to initialize a list and then the `lset` command to modify a specific element within that list using the Upstash Redis client in TypeScript.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/lset.mdx

LANGUAGE: typescript
CODE:
```
await redis.lpush("key", "a", "b", "c"); 
await redis.lset("key", 1, "d"); 

// list is now ["a", "d", "c"]
```

----------------------------------------

TITLE: HPERSIST Command API Reference
DESCRIPTION: Comprehensive API documentation for the HPERSIST command, outlining its parameters, return types, and possible response values.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hpersist.mdx

LANGUAGE: APIDOC
CODE:
```
HPERSIST:
  Description: Remove the expiration from one or more hash fields.
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the hash.
    fields:
      Type: Union[str, List[str]]
      Required: true
      Description: The field or list of fields within the hash to remove the expiry from.
  Response:
    Type: List[int]
    Required: true
    Description: A list of integers indicating the result for each field.
    Possible Values:
      -2: if the field does not exist in the hash or if the key doesn't exist.
      -1: if the field exists but has no associated expiration set.
      1: if the expiration was successfully removed.
```

----------------------------------------

TITLE: HSET Command API Reference
DESCRIPTION: Detailed API specification for the Redis HSET command, outlining its required and optional arguments, their types, and the expected return value.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hset.mdx

LANGUAGE: APIDOC
CODE:
```
HSET Command:
  Description: Write one or more fields to a hash.
  Arguments:
    key (str, required): The key of the hash.
    field (str, optional): Field to set.
    value (str, optional): Value to set.
    fields (Dict[str, Any], optional): An object of fields and their values.
  Response:
    (int, required): The number of fields that were added.
```

----------------------------------------

TITLE: EXPIREAT API Method Documentation
DESCRIPTION: Detailed documentation for the `EXPIREAT` method, outlining its required and optional arguments, their types, and the expected boolean response indicating whether the timeout was successfully set.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/expireat.mdx

LANGUAGE: APIDOC
CODE:
```
Method: EXPIREAT
Description: Sets a timeout on key. The key will automatically be deleted.

Arguments:
- key (str, required): The key to set the timeout on.
- unix_time_seconds (int | datetime.datetime, required): The timeout in unix seconds timestamp as int or a datetime.datetime object.
- nx (bool, optional): Set expiry only when the key has no expiry
- xx (bool, optional): Set expiry only when the key has an existing expiry
- gt (bool, optional): Set expiry only when the new expiry is greater than current one
- lt (bool, optional): Set expiry only when the new expiry is less than current one

Response:
- (bool): True if the timeout was set
```

----------------------------------------

TITLE: Python ZUNIONSTORE with Aggregation
DESCRIPTION: Illustrates how to use the ZUNIONSTORE command with the 'aggregate' option set to 'SUM' and 'withscores' enabled. This example shows how scores from common members are combined and returned as a list of (member, score) tuples.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zunionstore.mdx

LANGUAGE: py
CODE:
```
redis.zadd("key1", {"a": 1, "b": 2, "c": 3})

redis.zadd("key2", {"a": 3, "b": 4, "c": 5})

result = redis.zunionstore(["key1", "key2"], withscores=True, aggregate="SUM")

assert result == [("a", 4), ("b", 6), ("c", 8)]
```

----------------------------------------

TITLE: Perform SINTER Operation with Python
DESCRIPTION: Demonstrates how to use the `sinter` command with the Upstash Redis client in Python. This example shows adding elements to two sets and then asserting the correct intersection result.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/set/sinter.mdx

LANGUAGE: py
CODE:
```
redis.sadd("set1", "a", "b", "c");
redis.sadd("set2", "c", "d", "e");

assert redis.sinter("set1", "set2") == {"c"}
```

----------------------------------------

TITLE: Apply Different Ratelimits for Free and Paid Users
DESCRIPTION: This snippet demonstrates how to configure and apply distinct ratelimits for different user groups, such as free and paid users. It utilizes separate `Ratelimit` instances, each with its own prefix and `slidingWindow` configuration, allowing for flexible rate management based on user attributes.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-ts/features.mdx

LANGUAGE: ts
CODE:
```
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = Redis.fromEnv();

const ratelimit = {
  free: new Ratelimit({
    redis,
    analytics: true,
    prefix: "ratelimit:free",
    limiter: Ratelimit.slidingWindow(10, "10s"),
  }),
  paid: new Ratelimit({
    redis,
    analytics: true,
    prefix: "ratelimit:paid",
    limiter: Ratelimit.slidingWindow(60, "10s"),
  }),
};

await ratelimit.free.limit(ip);
// or for a paid user you might have an email or userId available:
await ratelimit.paid.limit(userId);
```

----------------------------------------

TITLE: APIDOC: EVAL_RO Command Reference
DESCRIPTION: Detailed API documentation for the EVAL_RO command, outlining its required parameters (script, keys, args) and the structure of its response.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/scripts/eval_ro.mdx

LANGUAGE: APIDOC
CODE:
```
EVAL_RO Command:
  Description: Evaluate a read-only Lua script server side.
  Arguments:
    script: string (required)
      Description: The read-only lua script to run.
    keys: string[] (required)
      Description: All of the keys accessed in the script.
    args: unknown[] (required)
      Description: All of the arguments you passed to the script.
  Response:
    type: any (required)
      Description: The result of the script.
```

----------------------------------------

TITLE: JSON.ARRTRIM Command API Reference
DESCRIPTION: Detailed API documentation for the `JSON.ARRTRIM` command, including its parameters, types, requirements, default values, and return value.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/arrtrim.mdx

LANGUAGE: APIDOC
CODE:
```
JSON.ARRTRIM:
  Description: Trim an array so that it contains only the specified inclusive range of elements.
  Arguments:
    key:
      Type: string
      Required: true
      Description: The key of the json entry.
    path:
      Type: string
      Default: $
      Description: The path of the array.
    start:
      Type: integer
      Required: true
      Description: The start index of the range.
    stop:
      Type: integer
      Required: true
      Description: The stop index of the range.
  Response:
    Type: integer[]
    Required: true
    Description: The length of the array after the trimming.
```

----------------------------------------

TITLE: Redis EXISTS Command API Reference
DESCRIPTION: Detailed API documentation for the Redis `EXISTS` command, outlining its required arguments and the structure of its integer response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/generic/exists.mdx

LANGUAGE: APIDOC
CODE:
```
EXISTS Command:
  Description: Check if a key exists.
  Arguments:
    keys:
      Type: *List[str]
      Required: true
      Description: One or more keys to check.
  Response:
    Type: int
    Required: true
    Description: The number of keys that exist
```

----------------------------------------

TITLE: HLEN Command API Documentation
DESCRIPTION: Detailed API documentation for the HLEN command, outlining its required arguments and the expected response type.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hlen.mdx

LANGUAGE: APIDOC
CODE:
```
HLEN Command:
  Description: Returns the number of fields contained in the hash stored at key.
  Arguments:
    key:
      Type: string
      Required: true
      Description: The key of the hash.
  Response:
    Type: integer
    Required: true
    Description: How many fields are in the hash.
```

----------------------------------------

TITLE: HKEYS Command API Reference
DESCRIPTION: Detailed API documentation for the HKEYS command, outlining its arguments, response types, and descriptions.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hkeys.mdx

LANGUAGE: APIDOC
CODE:
```
HKEYS Command:
  Description: Return all field names in the hash stored at key.
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the hash.
  Response:
    Type: List[str]
    Required: true
    Description: The field names of the hash
```

----------------------------------------

TITLE: Redis Commands for Upstash Transaction Example
DESCRIPTION: Illustrates a sequence of Redis commands (SET, SETEX, INCR, ZADD) intended to be executed within a single Upstash REST API transaction.

SOURCE: https://upstash.com/docs/redis/features/restapi.mdx

LANGUAGE: Redis
CODE:
```
MULTI
SET key1 valuex
SETEX key2 13 valuez
INCR key1
ZADD myset 11 item1 22 item2
EXEC
```

----------------------------------------

TITLE: Stateful AWS Lambda with Redis REST API
DESCRIPTION: This article demonstrates how to create stateful AWS Lambda functions using Redis for data persistence. It focuses on integrating with a REST API.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: REST-API
CODE:
```
APIDOC:
  Endpoint: /items
  Method: POST
  Description: Add a new item to Redis.
  Request Body:
    item_name: string
    item_value: string
  Response:
    status: success
    id: string (newly created item ID)

  Endpoint: /items/{id}
  Method: GET
  Description: Retrieve an item from Redis by its ID.
  Path Parameters:
    id: string (ID of the item to retrieve)
  Response:
    item_name: string
    item_value: string
```

----------------------------------------

TITLE: ZPOPMAX API Reference
DESCRIPTION: Defines the arguments and response structure for the ZPOPMAX command, including parameter types and descriptions.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/zset/zpopmax.mdx

LANGUAGE: APIDOC
CODE:
```
Arguments:
  key: string (required)
    The key of the sorted set

Response:
  count: integer
    The number of elements removed. Defaults to 1.
```

----------------------------------------

TITLE: ZREM Command
DESCRIPTION: No description

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
ZREM
```

----------------------------------------

TITLE: Set Upstash Redis Environment Variables (Shell)
DESCRIPTION: These shell commands set the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` environment variables. These variables are crucial for the Python application to establish a connection with the Upstash Redis database.

SOURCE: https://upstash.com/docs/redis/tutorials/python_url_shortener.mdx

LANGUAGE: shell
CODE:
```
export UPSTASH_REDIS_REST_URL=<YOUR_URL>
export UPSTASH_REDIS_REST_TOKEN=<YOUR_TOKEN>
```

----------------------------------------

TITLE: ZRANK Command
DESCRIPTION: No description

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
ZRANK
```

----------------------------------------

TITLE: Run Cloudflare Worker Locally
DESCRIPTION: Starts a local development server for the Cloudflare Worker using `npx wrangler dev`, allowing for testing and debugging the worker's functionality before deployment.

SOURCE: https://upstash.com/docs/redis/tutorials/cloudflare_workers_with_redis.mdx

LANGUAGE: shell
CODE:
```
npx wrangler dev
```

----------------------------------------

TITLE: GETBIT Command API Reference
DESCRIPTION: Comprehensive API documentation for the GETBIT command, outlining its required parameters (key and offset) and the expected integer response, representing the bit value at the specified offset.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/bitmap/getbit.mdx

LANGUAGE: APIDOC
CODE:
```
GETBIT Command:
  Arguments:
    key: string (required)
      The key of the bitset.
    offset: integer (required)
      Specify the offset at which to get the bit.
  Response:
    integer (required)
      The bit value stored at offset.
```

----------------------------------------

TITLE: Execute Laravel Database Seeder
DESCRIPTION: Artisan command to run the database seeders. This command populates the database with initial or sample data, such as the 50 todo items defined in the DatabaseSeeder.

SOURCE: https://upstash.com/docs/redis/tutorials/laravel_caching.mdx

LANGUAGE: shell
CODE:
```
php artisan db:seed
```

----------------------------------------

TITLE: Set Request Timeout for Ratelimit
DESCRIPTION: This example shows how to set an optional timeout for the `Ratelimit` instance. If the timeout is reached, the request will be allowed to pass, preventing network issues from rejecting requests. The default timeout is 5 seconds.

SOURCE: https://upstash.com/docs/redis/sdks/ratelimit-ts/features.mdx

LANGUAGE: TypeScript
CODE:
```
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  timeout: 1000, // 1 second
  analytics: true,
});
```

----------------------------------------

TITLE: SCARD Redis Command API Reference
DESCRIPTION: Detailed API documentation for the Redis `SCARD` command, outlining its arguments, their types, and the structure of the command's response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/set/scard.mdx

LANGUAGE: APIDOC
CODE:
```
SCARD Command:
  Description: Return how many members are in a set
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the set.
  Response:
    Type: int
    Required: true
    Description: How many members are in the set.
```

----------------------------------------

TITLE: General Plugin Configuration Parameters
DESCRIPTION: Parameters to enable or disable the Upstash Ratelimit Strapi plugin.

SOURCE: https://upstash.com/docs/redis/integrations/ratelimit/strapi/configurations.mdx

LANGUAGE: APIDOC
CODE:
```
enabled: boolean (default: true) - Enable or disable the plugin.
```

----------------------------------------

TITLE: Increment Redis Key Float Value with Python
DESCRIPTION: This Python example demonstrates how to use the `incrbyfloat` method to increment a Redis key's float value. It shows setting an initial value and then performing an increment operation.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/string/incrbyfloat.mdx

LANGUAGE: python
CODE:
```
redis.set("key", 6)

# returns 10.5
redis.incrbyfloat("key", 4,5)
```

----------------------------------------

TITLE: HEXPIREAT Command API Documentation
DESCRIPTION: Detailed API documentation for the `HEXPIREAT` command, outlining its required and optional arguments, their types, and a comprehensive explanation of the possible return values indicating the success or failure of setting the expiration.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hexpireat.mdx

LANGUAGE: APIDOC
CODE:
```
HEXPIREAT Command:
  Description: Sets an expiration time for field(s) in a hash in seconds since the Unix epoch.

  Arguments:
    key:
      Type: string
      Required: true
      Description: The key of the hash.
    fields:
      Type: string | number | (string | number)[]
      Required: true
      Description: The field(s) to set an expiration time for.
    timestamp:
      Type: number
      Required: true
      Description: The expiration time as a Unix timestamp in seconds.
    option:
      Type: string
      Required: false
      Description: Optional condition for setting the expiration.
      Options:
        - NX: Set the expiration only if the field does not already have an expiration.
        - XX: Set the expiration only if the field already has an expiration.
        - GT: Set the expiration only if the new TTL is greater than the current TTL.
        - LT: Set the expiration only if the new TTL is less than the current TTL.

  Response:
    Type: number[]
    Required: true
    Description: A list of integers indicating whether the expiry was successfully set.
    Possible Values:
      - -2: If the field does not exist in the hash or if key doesn't exist.
      - 0: If the expiration was not set due to the condition.
      - 1: If the expiration was successfully set.
      - 2: If called with 0 seconds/milliseconds or a past Unix time.
    See Also: https://redis.io/commands/hexpireat
```

----------------------------------------

TITLE: Deploy Serverless Function to AWS
DESCRIPTION: Executes the Serverless Framework deployment command to provision and deploy the defined function to AWS Lambda.

SOURCE: https://upstash.com/docs/redis/tutorials/auto_complete_with_serverless_redis.mdx

LANGUAGE: shell
CODE:
```
serverless deploy
```

----------------------------------------

TITLE: ZADD API Reference
DESCRIPTION: Detailed API documentation for the ZADD command, including arguments, options, and response types.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/zset/zadd.mdx

LANGUAGE: APIDOC
CODE:
```
ZADD API Reference:
  Arguments:
    key:
      type: string
      required: true
      description: The key of the sorted set.
    options:
      xx:
        type: boolean
        description: Only update elements that already exist. Never add elements.
      nx:
        type: boolean
        description: Only add new elements. Never update elements.
      ch:
        type: boolean
        description: Return the number of elements added or updated.
      incr:
        type: boolean
        description: When this option is specified ZADD acts like ZINCRBY. Only one score-element pair can be specified in this mode.
  Response:
    type: integer
    required: true
    description: The number of elements added to the sorted sets, not including elements already existing for which the score was updated. If `ch` was specified, the number of elements that were updated. If `incr` was specified, the new score of `member`.
```

----------------------------------------

TITLE: JSON.OBJLEN API Specification
DESCRIPTION: Detailed API documentation for the JSON.OBJLEN command, outlining its required and optional arguments, their types, and the structure of the expected response.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/objlen.mdx

LANGUAGE: APIDOC
CODE:
```
JSON.OBJLEN:
  Arguments:
    key:
      type: str
      required: true
      description: The key of the json entry.
    path:
      type: str
      default: "$"
      description: The path of the object.
  Response:
    type: List[int]
    required: true
    description: The number of keys in the objects.
```

----------------------------------------

TITLE: Resolve ReferenceError: fetch is not defined in Node.js
DESCRIPTION: Addresses the 'ReferenceError: fetch is not defined' issue in Node.js environments (v17 and earlier) where `fetch` is not natively supported. It provides a solution by installing and importing `isomorphic-fetch` as a polyfill.

SOURCE: https://upstash.com/docs/redis/sdks/ts/troubleshooting.mdx

LANGUAGE: bash
CODE:
```
npm i isomorphic-fetch
```

LANGUAGE: ts
CODE:
```
import { Redis } from "@upstash/redis";
import "isomorphic-fetch";

const redis = new Redis({
  /*...*/
});
```

----------------------------------------

TITLE: Deploy Application to Google Cloud Run
DESCRIPTION: Deploys a container image to Google Cloud Run. This command specifies the service name, the image to deploy, the platform (managed), the region, and allows unauthenticated access to the deployed service.

SOURCE: https://upstash.com/docs/redis/tutorials/cloud_run_sessions.mdx

LANGUAGE: Bash
CODE:
```
gcloud run deploy cloud-run-sessions \

  --image gcr.io/cloud-run-sessions/main:v0.1 \

  --platform managed \

  --region us-central1 \

  --allow-unauthenticated
```

----------------------------------------

TITLE: EVALSHA Redis Command API Reference
DESCRIPTION: Documents the `EVALSHA` Redis command, detailing its purpose, required arguments (SHA1 hash, keys, and additional arguments), and the expected return type. This command is used for efficient execution of pre-loaded Lua scripts.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/scripts/evalsha.mdx

LANGUAGE: APIDOC
CODE:
```
EVALSHA:
  description: Evaluate a cached Lua script server side.
  arguments:
    sha:
      type: str
      required: true
      description: The sha1 hash of the script.
    keys:
      type: List[str]
      required: true
      description: All of the keys accessed in the script
    args:
      type: List[str]
      required: true
      description: All of the arguments you passed to the script
  response:
    type: "?"
    required: true
    description: The result of the script.
```

----------------------------------------

TITLE: Redis Error Example
DESCRIPTION: Illustrates the ReplyError exception received when the database capacity quota is exceeded. This error indicates that write operations are being rejected due to the database size limit.

SOURCE: https://upstash.com/docs/redis/troubleshooting/db_capacity_quota_exceeded.mdx

LANGUAGE: redis
CODE:
```
ReplyError: ERR DB capacity quota exceeded
```

----------------------------------------

TITLE: Initialize Upstash Redis in Cloudflare Workers
DESCRIPTION: Illustrates how to create an Upstash Redis instance for Cloudflare Workers. It covers initializing with explicit URL/token or loading from the global environment, providing examples for both service worker and module worker contexts.

SOURCE: https://upstash.com/docs/redis/sdks/ts/deployment.mdx

LANGUAGE: ts
CODE:
```
import { Redis } from "@upstash/redis/cloudflare"

const redis = new Redis({
  url: <UPSTASH_REDIS_REST_URL>,
  token: <UPSTASH_REDIS_REST_TOKEN>,
})


// or load directly from global env

// service worker
const redis = Redis.fromEnv()


// module worker
export default {
  async fetch(request: Request, env: Bindings) {
    const redis = Redis.fromEnv(env)
    // ...
  }
}
```

----------------------------------------

TITLE: JSON.NUMINCRBY API Reference
DESCRIPTION: Documents the `JSON.NUMINCRBY` command, including its required arguments (`key`, `path`, `increment`) and the structure of its response.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/numincrby.mdx

LANGUAGE: APIDOC
CODE:
```
JSON.NUMINCRBY:
  description: Increment the number value stored at 'path' by number.
  arguments:
    key:
      type: string
      required: true
      description: The key of the json entry.
    path:
      type: string
      default: "$"
      description: The path of the array.
    increment:
      type: number
      required: true
      description: The number to increment by.
  response:
    type: integer[]
    required: true
    description: The new value after incrementing
```

----------------------------------------

TITLE: ZREMRANGEBYLEX Command
DESCRIPTION: No description

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
ZREMRANGEBYLEX
```

----------------------------------------

TITLE: Append value to Redis key using TypeScript
DESCRIPTION: Demonstrates how to use the `append` method with the Upstash Redis client in TypeScript to add a value to an existing string key. The example shows the method call and its expected return value.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/string/append.mdx

LANGUAGE: ts
CODE:
```
await redis.append(key, "Hello");
// returns 5
```

----------------------------------------

TITLE: Increment JSON Number Value (TypeScript)
DESCRIPTION: Example of using the `redis.json.numincrby` command in TypeScript to increment a number value within a JSON document stored in Upstash Redis. It demonstrates how to specify the key, the JSON path, and the increment value.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/json/numincrby.mdx

LANGUAGE: typescript
CODE:
```
const newValue = await redis.json.numincrby("key", "$.path.to.value", 2);
```

----------------------------------------

TITLE: SCRIPT FLUSH Command Arguments
DESCRIPTION: Documents the arguments for the `SCRIPT FLUSH` command, including parameter names, types, and descriptions.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/scripts/script_flush.mdx

LANGUAGE: APIDOC
CODE:
```
SCRIPT FLUSH Arguments:
  flush_type: "ASYNC" | "SYNC" (required)
    Description: Whether to perform the flush asynchronously or synchronously.
```

----------------------------------------

TITLE: Iterate All Members of a Sorted Set with ZSCAN (Python)
DESCRIPTION: This Python example demonstrates how to use the `ZSCAN` command to retrieve all members and their scores from a sorted set. It handles pagination by iteratively calling `ZSCAN` with the returned cursor until the iteration is complete.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zscan.mdx

LANGUAGE: python
CODE:
```
# Get all elements of an ordered set.

cursor = 0
results = []

while True:
    cursor, keys = redis.zscan("myzset", cursor, match="*")

    results.extend(keys)
    if cursor == 0:
        break

for key, score in results:
    print(key, score)
```

----------------------------------------

TITLE: Python Example for Iterating Redis SSCAN
DESCRIPTION: This Python code snippet demonstrates how to use the Redis SSCAN command to retrieve all members from a set. It shows the iterative process of calling SSCAN with a cursor until all members have been fetched.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/set/sscan.mdx

LANGUAGE: python
CODE:
```
# Get all members of a set.

cursor = 0
results = set()

while True:
    cursor, keys = redis.sscan("myset", cursor, match="*")

    results.extend(keys)
    if cursor == 0:
        break
```

----------------------------------------

TITLE: Toggle JSON Boolean in Python
DESCRIPTION: Demonstrates how to use the `redis.json.toggle` method in Python to toggle a boolean value at a specific path within a JSON document stored in Redis. The example shows calling the method with a key and a JSON path.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/json/toggle.mdx

LANGUAGE: python
CODE:
```
bool = redis.json.toggle("key", "$.path.to.bool")
```

----------------------------------------

TITLE: LPUSH Command API Reference
DESCRIPTION: Documents the LPUSH command for Upstash Redis, detailing its arguments, return value, and overall behavior.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/lpush.mdx

LANGUAGE: APIDOC
CODE:
```
LPUSH Command:
  Description: Push an element at the head of the list.
  Arguments:
    key:
      Type: string
      Required: true
      Description: The key of the list.
    elements:
      Type: ...TValue[]
      Required: true
      Description: One or more elements to push at the head of the list.
  Response:
    Type: number
    Required: true
    Description: The length of the list after the push operation.
```

----------------------------------------

TITLE: Upstash Redis Hash Commands
DESCRIPTION: This section lists commands for interacting with Redis Hash data structures. These commands allow for operations such as getting and setting fields, checking field existence, and managing hash fields.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/overview.mdx

LANGUAGE: python
CODE:
```
HPTTL
HSCAN
HSET
HMSET
HSETNX
HSTRLEN
HTTL
HVALS
```

----------------------------------------

TITLE: SISMEMBER API Reference
DESCRIPTION: Detailed API documentation for the SISMEMBER command, outlining its required arguments and the expected response.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/set/sismember.mdx

LANGUAGE: APIDOC
CODE:
```
SISMEMBER Command:
  Arguments:
    key: string (required)
      The key of the set to check.
    member: TMember
      The member to check for.
  Response:
    type: 0 | 1 (required)
      Description: `1` if the member exists in the set, `0` if not.
```

----------------------------------------

TITLE: Upstash Prometheus Metrics API Endpoint
DESCRIPTION: This is the HTTP endpoint that Prometheus uses to scrape monitoring metrics from your Upstash Redis databases. It must be configured as the data source address in your Prometheus or Grafana setup.

SOURCE: https://upstash.com/docs/redis/integrations/prometheus.mdx

LANGUAGE: APIDOC
CODE:
```
https://api.upstash.com/monitoring/prometheus
```

----------------------------------------

TITLE: MSETNX Command
DESCRIPTION: Set multiple keys to multiple values, only if none of the keys exist.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
MSETNX
```

----------------------------------------

TITLE: ZUNIONSTORE Command Usage Examples (TypeScript)
DESCRIPTION: Illustrates various use cases of the ZUNIONSTORE command in TypeScript, including basic set union, applying custom weights to input sets, and using different aggregation methods like 'sum'.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/zset/zunionstore.mdx

LANGUAGE: ts
CODE:
```
await redis.zadd(
    "key1", 
    { score: 1, member: "member1" },
)
await redis.zadd(
    "key2",
    { score: 1, member: "member1" },
    { score: 2, member: "member2" },
)

const res = await redis.zunionstore("destination", 2, ["key1", "key2"]);
console.log(res) // 2
```

LANGUAGE: ts
CODE:
```
await redis.zadd(
    "key1", 
    { score: 1, member: "member1" },
)
await redis.zadd(
    "key2",
    { score: 1, member: "member1" },
    { score: 2, member: "member2" },
)
const res = await redis.zunionstore(
    "destination",
    2,
    ["key1", "key2"],
    { weights: [2, 3] },
);
console.log(res) // 2
```

LANGUAGE: ts
CODE:
```
await redis.zadd(
    "key1", 
    { score: 1, member: "member1" },
)
await redis.zadd(
    "key2",
    { score: 1, member: "member1" },
    { score: 2, member: "member2" },
)
const res = await redis.zunionstore(
    "destination",
    2,
    ["key1", "key2"],
    { aggregate: "sum" },
);
console.log(res) // 2
```

----------------------------------------

TITLE: ZUNIONSTORE Command API Reference
DESCRIPTION: Detailed API documentation for the ZUNIONSTORE command, including its arguments, types, default values, and return value.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/zset/zunionstore.mdx

LANGUAGE: APIDOC
CODE:
```
ZUNIONSTORE Command:
  Description: Writes the union between sets to a new key.

  Arguments:
    destination (str, required):
      Description: The key to store the resulting set in.
    keys (List[str], required):
      Description: The keys of the sets to compare.
    weights (List[float], optional, default=None):
      Description: The weights to apply to the sets.
    aggregate ("SUM" | "MIN" | "MAX", optional, default="SUM"):
      Description: The aggregation function to apply to the sets.
    withscores (bool, optional, default=false):
      Description: Whether to include scores in the result.

  Response:
    Type: Integer (number of elements) or List[Tuple[str, float]] (if withscores=true)
    Description: The number of elements in the resulting set, or a list of (member, score) tuples if 'withscores' is true.
```

----------------------------------------

TITLE: Remove Expiration from Hash Field (TypeScript)
DESCRIPTION: This TypeScript example demonstrates how to use the `hpersist` command with Upstash Redis. It shows the sequence of setting a hash field, applying an expiration, and then successfully removing that expiration using `hpersist`, logging the result.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hpersist.mdx

LANGUAGE: ts
CODE:
```
await redis.hset("my-key", "my-field", "my-value");
await redis.hpexpire("my-key", "my-field", 1000);

const expirationRemoved = await redis.hpersist("my-key", "my-field");

console.log(expirationRemoved); // [1]
```

----------------------------------------

TITLE: Configure Apollo Client for Upstash GraphQL in Next.js
DESCRIPTION: This JavaScript code sets up the Apollo Client within a Next.js application's `_app.js` file. It configures an `HttpLink` to connect to the Upstash GraphQL endpoint, including an authorization header with a read-only access token, and initializes an `InMemoryCache`. The `ApolloProvider` then wraps the application, making the client accessible to all components.

SOURCE: https://upstash.com/docs/redis/tutorials/coin_price_list.mdx

LANGUAGE: javascript
CODE:
```
import "../styles/globals.css";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";

const link = createHttpLink({
  uri: "https://graphql-us-east-1.upstash.io/",
  headers: {
    Authorization: "Bearer YOUR_ACCESS_TOKEN",
  },
});
const client = new ApolloClient({
  uri: "https://graphql-us-east-1.upstash.io/",
  cache: new InMemoryCache(),
  link,
});

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />{" "}
    </ApolloProvider>
  );
}

export default MyApp;
```

----------------------------------------

TITLE: Retrieve All Fields from Redis Hash (TypeScript)
DESCRIPTION: Demonstrates how to set multiple fields in a Redis hash using `redis.hset` and then retrieve all fields and their values using `redis.hgetall` in TypeScript. The example shows the expected object output.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hgetall.mdx

LANGUAGE: TypeScript
CODE:
```
await redis.hset("key", {
  field1: "value1",
  field2: "value2",
  });
const hash = await redis.hgetall("key");
console.log(hash); // { field1: "value1", field2: "value2" }
```

----------------------------------------

TITLE: SRANDMEMBER API Reference
DESCRIPTION: Detailed documentation for the SRANDMEMBER command, outlining its arguments, their types, default values, and the structure of the command's response.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/set/srandmember.mdx

LANGUAGE: APIDOC
CODE:
```
SRANDMEMBER:
  Description: Returns one or more random members from a set.
  Arguments:
    key:
      Type: string
      Required: true
      Description: The key of the set.
    count:
      Type: number
      Default: 1
      Description: How many members to return.
  Response:
    Type: TMember | TMember[]
    Required: true
    Description: The random member. If `count` is specified, an array of members is returned.
```

----------------------------------------

TITLE: ZADD Command
DESCRIPTION: No description

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/overview.mdx

LANGUAGE: Redis
CODE:
```
ZADD
```

----------------------------------------

TITLE: Set Single Field with HSET (Python)
DESCRIPTION: Demonstrates how to set a single field and its corresponding value within a Redis hash using the `hset` command in Python. The example asserts the return value, which is the number of fields added.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hset.mdx

LANGUAGE: python
CODE:
```
assert redis.hset("myhash", "field1", "Hello") == 1
```

----------------------------------------

TITLE: Google Cloud Run Deployment Console Output
DESCRIPTION: Illustrates the typical console output displayed after successfully deploying a service to Google Cloud Run. It shows the deployment progress, revision creation, traffic routing, IAM policy updates, and the final service URL.

SOURCE: https://upstash.com/docs/redis/tutorials/cloud_run_sessions.mdx

LANGUAGE: Text
CODE:
```
Deploying container to Cloud Run service [cloud-run-sessions] in project [cloud-run-sessions] region [us-central1]

  ✓ Deploying... Done.

  ✓ Creating Revision...

  ✓ Routing traffic...

  ✓ Setting IAM Policy...

Done.

Service [cloud-run-sessions] revision [cloud-run-sessions-00006-dun] has been deployed and is serving 100 percent of traffic.

Service URL: https://cloud-run-sessions-dr7fcdmn3a-uc.a.run.app
```

----------------------------------------

TITLE: IP Allow/Deny List with Cloudflare Workers and Upstash Redis
DESCRIPTION: This article details the implementation of an IP address allow/deny list using Cloudflare Workers and Upstash Redis, providing edge-level access control.

SOURCE: https://upstash.com/docs/redis/examples.mdx

LANGUAGE: javascript
CODE:
```
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN,
});

export default {
  async fetch(request, env) {
    const ip = request.headers.get('cf-connecting-ip');
    const isAllowed = await redis.sismember('allowed_ips', ip);

    if (!isAllowed) {
      return new Response('Forbidden', { status: 403 });
    }

    return fetch(request);
  },
};
```

----------------------------------------

TITLE: Configure Upstash Redis Environment Variables (.env)
DESCRIPTION: This snippet illustrates the content of a `.env` file, which is used by the `python-dotenv` library to load Redis connection credentials, specifically `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, into the application's environment at runtime.

SOURCE: https://upstash.com/docs/redis/tutorials/python_url_shortener.mdx

LANGUAGE: text
CODE:
```
UPSTASH_REDIS_REST_URL=<YOUR_URL>
UPSTASH_REDIS_REST_TOKEN=<YOUR_TOKEN>
```

----------------------------------------

TITLE: Hash Commands for Upstash Redis
DESCRIPTION: Manages hash data structures in Upstash Redis. Supports operations like deleting fields, checking existence, setting expiration, getting values, incrementing numbers, and retrieving keys.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/overview.mdx

LANGUAGE: python
CODE:
```
from upstash_redis import Redis

r = Redis(url="your_redis_url", token="your_redis_token")

# HDEL command
response = r.hdel("myhash", "field1")
print(response)

# HEXISTS command
response = r.hexists("myhash", "field1")
print(response)

# HEXPIRE command
response = r.hexpire("myhash", 60)
print(response)

# HEXPIREAT command
import time
response = r.hexpireat("myhash", int(time.time()) + 60)
print(response)

# HEXPIRETIME command
response = r.hexpiretime("myhash")
print(response)

# HGET command
response = r.hget("myhash", "field1")
print(response)

# HGETALL command
response = r.hgetall("myhash")
print(response)

# HINCRBY command
response = r.hincrby("myhash", "counter", 1)
print(response)

# HINCRBYFLOAT command
response = r.hincrbyfloat("myhash", "floatcounter", 1.5)
print(response)

# HKEYS command
response = r.hkeys("myhash")
print(response)

# HLEN command
response = r.hlen("myhash")
print(response)

# HMGET command
response = r.hmget("myhash", "field1", "field2")
print(response)

# HRANDFIELD command
response = r.hrandfield("myhash")
print(response)

# HPERSIST command
response = r.hpersist("myhash")
print(response)

# HPEXPIRE command
response = r.hpexpire("myhash", 60000)
print(response)

# HPEXPIREAT command
response = r.hpexpireat("myhash", int(time.time() * 1000) + 60000)
print(response)

# HPEXPIRETIME command
response = r.hpexpiretime("myhash")
print(response)
```

----------------------------------------

TITLE: LPOS Command API Reference
DESCRIPTION: Detailed API documentation for the LPOS command, outlining its arguments, their types, descriptions, and the expected response format. This command helps locate elements within a Redis list.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/lpos.mdx

LANGUAGE: APIDOC
CODE:
```
LPOS Command:
  Description: Returns the index of matching elements inside a list.
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the list.
    element:
      Type: unknown
      Required: true
      Description: The element to match.
    rank:
      Type: int
      Required: false
      Description: Which match to return. 1 to return the first match, 2 to return the second match, and so on. 1 by default.
    count:
      Type: int
      Required: false
      Description: The maximum number of elements to match. If specified, an array of elements is returned instead of a single element.
    maxlen:
      Type: int
      Required: false
      Description: Limit the number of comparisons to perform.
  Response:
    Type: int | List[int]
    Required: true
    Description: The index of the matching element or an array of indexes if `count` is specified.
```

----------------------------------------

TITLE: Invoke and Retrieve Result of Celery Task
DESCRIPTION: Demonstrates how to call a Celery task asynchronously using `delay()` and retrieve its result using `get()`. It shows the initial pending state and the final computed output of the `add` task.

SOURCE: https://upstash.com/docs/redis/integrations/celery.mdx

LANGUAGE: python
CODE:
```
from tasks import add

result = add.delay(4, 6)
print(f"Task state: {result.state}")  # Outputs 'PENDING' initially

# Wait for the result
output = result.get(timeout=10)
print(f"Task result: {output}")  # Outputs '10'
```

----------------------------------------

TITLE: HGET Command API Reference
DESCRIPTION: Detailed API documentation for the HGET command, including its arguments, their types and descriptions, and the expected response type and its meaning.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/hash/hget.mdx

LANGUAGE: APIDOC
CODE:
```
HGET Command:
  Description: Retrieves the value of a hash field.
  Arguments:
    - name: key
      type: string
      required: true
      description: The key to get.
    - name: field
      type: string
      required: true
      description: The field to get.
  Response:
    type: TValue | null
    required: true
    description: The value of the field, or `null`, when field is not present in the hash or key does not exist.
```

----------------------------------------

TITLE: Build AWS SAM Application
DESCRIPTION: Executes the `sam build` command to compile and prepare the serverless application for deployment. This step resolves dependencies, packages the Lambda function code, and creates the necessary deployment artifacts.

SOURCE: https://upstash.com/docs/redis/tutorials/using_aws_sam.mdx

LANGUAGE: shell
CODE:
```
sam build
```

----------------------------------------

TITLE: Remove Members from Redis Set (TypeScript)
DESCRIPTION: This TypeScript example demonstrates how to first add members to a Redis set using `sadd` and then remove specific members using the `srem` command. It also shows the returned count of successfully removed members.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/set/srem.mdx

LANGUAGE: ts
CODE:
```
await redis.sadd("set", "a", "b", "c");
const removed = await redis.srem("set", "a", "b", "d");
console.log(removed); // 2
```

----------------------------------------

TITLE: TypeScript Example for LMOVE Redis Command
DESCRIPTION: Demonstrates how to use the LMOVE command with the Upstash Redis client in TypeScript. It shows pushing elements to a source list and then moving an element from the left side of the source list to the left side of the destination list.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/list/lmove.mdx

LANGUAGE: ts
CODE:
```
await redis.rpush("source", "a", "b", "c"); 
const element = await redis.move("source", "destination", "left", "left");
```

----------------------------------------

TITLE: Redis ECHO Command API Documentation
DESCRIPTION: Detailed API documentation for the Redis ECHO command, specifying its arguments and expected response.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/auth/echo.mdx

LANGUAGE: APIDOC
CODE:
```
ECHO Command:
  Description: Returns a message back to you. Useful for debugging the connection.
  Arguments:
    message:
      Type: string
      Required: true
      Description: A message to send to the server.
  Response:
    Type: string
    Required: true
    Description: The same message you sent.
```

----------------------------------------

TITLE: Rename Redis Key Conditionally in TypeScript
DESCRIPTION: This TypeScript example demonstrates how to use the `renamenx` method with an Upstash Redis client. It attempts to rename a key named 'old' to 'new', but only if 'new' does not already exist, returning a boolean indicating success or failure.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/generic/renamenx.mdx

LANGUAGE: ts
CODE:
```
const renamed = await redis.renamenx("old", "new");
```

----------------------------------------

TITLE: HLEN Redis Command API Documentation
DESCRIPTION: Detailed API specification for the HLEN command, including its arguments, their types and descriptions, and the expected response type.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hlen.mdx

LANGUAGE: APIDOC
CODE:
```
HLEN Command:
  Description: Returns the number of fields contained in the hash stored at key.
  Arguments:
    key:
      Type: str
      Required: true
      Description: The key of the hash.
  Response:
    Type: int
    Required: true
    Description: How many fields are in the hash.
```

----------------------------------------

TITLE: Increment Hash Field Value in Python
DESCRIPTION: Demonstrates how to use the HINCRBY command with a Python Redis client. This example first sets an initial value for a hash field and then increments it by a specified amount, asserting the correct new value.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/hash/hincrby.mdx

LANGUAGE: python
CODE:
```
redis.hset("myhash", "field1", 5)

assert redis.hincrby("myhash", "field1", 10) == 15
```

----------------------------------------

TITLE: PTTL Command API Reference
DESCRIPTION: Detailed API documentation for the PTTL command, outlining its required arguments, expected integer response, and behavior regarding key expiration status.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/generic/pttl.mdx

LANGUAGE: APIDOC
CODE:
```
Command: PTTL
Description: Return the expiration in milliseconds of a key.

Arguments:
  key: string (required)
    Description: The key

Response:
  Type: integer (required)
  Description: The number of milliseconds until this expires, negative if the key does not exist or does not have an expiration set.
```

----------------------------------------

TITLE: Deployment: Deploy SST Application to Production Stage
DESCRIPTION: Deploys the entire SST application, including the Next.js site and all configured AWS resources, to the specified production stage. This command provisions and updates your cloud infrastructure.

SOURCE: https://upstash.com/docs/redis/quickstarts/sst-v2.mdx

LANGUAGE: shell
CODE:
```
npx sst deploy --stage prod
```

----------------------------------------

TITLE: Get Number of Members in Redis Set (SCARD) with Python
DESCRIPTION: Demonstrates how to use the `SCARD` command with `sadd` to add members to a set and then retrieve the count of members in that set using Python. It shows a basic assertion to validate the count.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/set/scard.mdx

LANGUAGE: py
CODE:
```
redis.sadd("key", "a", "b", "c"); 

assert redis.scard("key") == 3
```

----------------------------------------

TITLE: ZINCRBY Command API Reference
DESCRIPTION: Detailed API documentation for the ZINCRBY command, outlining its required arguments (key, increment, member) and the integer response representing the new score.

SOURCE: https://upstash.com/docs/redis/sdks/ts/commands/zset/zincrby.mdx

LANGUAGE: APIDOC
CODE:
```
ZINCRBY:
  Arguments:
    key:
      type: string
      required: true
      description: The key of the sorted set.
    increment:
      type: integer
      required: true
      description: The increment to add to the score.
    member:
      type: TMember
      required: true
      description: The member to increment.
  Response:
    type: integer
    required: true
    description: The new score of `member` after the increment operation.
```

----------------------------------------

TITLE: LSET Command API Reference
DESCRIPTION: Detailed API documentation for the LSET command, outlining its required parameters and the expected boolean response indicating whether the value was successfully set at the specified index.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/list/lset.mdx

LANGUAGE: APIDOC
CODE:
```
LSET Command:
  Description: Set a value at a specific index in a list.
  Arguments:
    key (str, required): The key of the list.
    index (number, required): At which index to set the value.
    element (str, required): The value to set.
  Response:
    (bool, required): Returns True if the index was in range and the value was set.
```

----------------------------------------

TITLE: SINTER Redis Command API Reference
DESCRIPTION: Detailed API documentation for the Redis SINTER command, including its required parameters and expected return value.

SOURCE: https://upstash.com/docs/redis/sdks/py/commands/set/sinterstore.mdx

LANGUAGE: APIDOC
CODE:
```
SINTER Command:
  Description: Return the intersection between sets and store the resulting set in a key
  Arguments:
    destination:
      Type: str
      Required: true
      Description: The key of the set to store the resulting set in.
    keys:
      Type: *List[str]
      Required: true
      Description: The keys of the sets to perform the intersection operation on.
  Response:
    Type: int
    Required: true
    Description: The number of elements in the resulting set.
```

----------------------------------------

TITLE: Define Python Dependencies in requirements.txt
DESCRIPTION: This `requirements.txt` file specifies the Python packages required for the project, including `Django` at version 4.1.3 and the `upstash-redis` client library.

SOURCE: https://upstash.com/docs/redis/quickstarts/vercel-python-runtime.mdx

LANGUAGE: txt
CODE:
```
Django==4.1.3
upstash-redis
```