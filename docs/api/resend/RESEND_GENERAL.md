# Resend General Documentation
# Managing Audiences

> Learn how to add, update, retrieve, and remove contacts that you send Broadcasts to.

Managing subscribers and unsubscribers is a critical part of any email implementation. It's important to respect your users' preferences and ensure that they're receiving the right emails at the right time.

Resend Audiences allow you to group and manage your [contacts](/dashboard/audiences/contacts) in a simple and intuitive way.

<img src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/audiences-intro-5.png" alt="Audience" class="extraWidth" />

## Send emails to your Audience

Audiences were designed to be used in conjunction with [Broadcasts](https://resend.com/broadcasts). You can send a Broadcast to an Audience from the Resend dashboard or from the Broadcast API.

### From Resend's no-code editor

You can send emails to your Audience by creating a new Broadcast and selecting the Audience you want to send it to.

![Send emails to your Audience](https://mintlify.s3.us-west-1.amazonaws.com/resend/images/audiences-intro-2.png)

You can include the Unsubscribe Footer in your Broadcasts, which will be automatically replaced with the correct link for each contact.

### From the Broadcast API

You can also use our [Broadcast API](/api-reference/broadcasts/create-broadcast) to create and send a Broadcast to your Audience.

### How to customize the unsubscribe link in my Broadcast?

Resend generates a unique link for each recipient and each Broadcast. You can use `{{{RESEND_UNSUBSCRIBE_URL}}}` as the link target.

![Unsubscribe Link](https://mintlify.s3.us-west-1.amazonaws.com/resend/images/audiences-intro-3.png)

## Automatic Unsubscribes

When you send emails to your Audience, Resend will automatically handle the unsubscribe flow for you.

If a contact unsubscribes from your emails, they will be skipped when sending a future Broadcast to this same audience.

![Automatic Unsubscribes](https://mintlify.s3.us-west-1.amazonaws.com/resend/images/audiences-intro-4.png)

Learn more about managing your unsubscribe list [here](https://resend.com/docs/dashboard/audiences/managing-unsubscribe-list).

# Send emails with Node.js

> Learn how to send your first email using the Resend Node.js SDK.

## Prerequisites

To get the most out of this guide, you'll need to:

* [Create an API key](https://resend.com/api-keys)
* [Verify your domain](https://resend.com/domains)

## 1. Install

Get the Resend Node.js SDK.

<CodeGroup>
  ```bash npm
  npm install resend
  ```

  ```bash yarn
  yarn add resend
  ```

  ```bash pnpm
  pnpm add resend
  ```
</CodeGroup>

## 2. Send email using HTML

The easiest way to send an email is by using the `html` parameter.

```js server.ts
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

(async function () {
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['delivered@resend.dev'],
    subject: 'Hello World',
    html: '<strong>It works!</strong>',
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
})();
```

## 3. Try it yourself

<Card title="Node.js Example" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-node-example">
  See the full source code.
</Card>

# Send emails with Next.js

> Learn how to send your first email using Next.js and the Resend Node.js SDK.

## Prerequisites

To get the most out of this guide, you'll need to:

* [Create an API key](https://resend.com/api-keys)
* [Verify your domain](https://resend.com/domains)

Prefer watching a video? Check out our video walkthrough below.

<div className="aspect-video">
  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/UqQxfpTQBaE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</div>

## 1. Install

Get the Resend Node.js SDK.

<CodeGroup>
  ```bash npm
  npm install resend
  ```

  ```bash yarn
  yarn add resend
  ```

  ```bash pnpm
  pnpm add resend
  ```
</CodeGroup>

## 2. Create an email template

Start by creating your email template on `components/email-template.tsx`.

```tsx components/email-template.tsx
import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export function EmailTemplate({ firstName }: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {firstName}!</h1>
    </div>
  );
}
```

## 3. Send email using React

Create an API file under `pages/api/send.ts` if you're using the [Pages Router](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) or create a route file under `app/api/send/route.ts` if you're using the [App Router](https://nextjs.org/docs/app/building-your-application/routing/router-handlers).

Import the React email template and send an email using the `react` parameter.

<CodeGroup>
  ```ts pages/api/send.ts
  import type { NextApiRequest, NextApiResponse } from 'next';
  import { EmailTemplate } from '../../components/EmailTemplate';
  import { Resend } from 'resend';

  const resend = new Resend(process.env.RESEND_API_KEY);

  export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'Hello world',
      react: EmailTemplate({ firstName: 'John' }),
    });

    if (error) {
      return res.status(400).json(error);
    }

    res.status(200).json(data);
  };
  ```

  ```ts app/api/send/route.ts
  import { EmailTemplate } from '../../../components/EmailTemplate';
  import { Resend } from 'resend';

  const resend = new Resend(process.env.RESEND_API_KEY);

  export async function POST() {
    try {
      const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: ['delivered@resend.dev'],
        subject: 'Hello world',
        react: EmailTemplate({ firstName: 'John' }),
      });

      if (error) {
        return Response.json({ error }, { status: 500 });
      }

      return Response.json(data);
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }
  }
  ```
</CodeGroup>

## 4. Try it yourself

<CardGroup>
  <Card title="Next.js Example (Pages Router)" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-nextjs-pages-router-example">
    See the full source code.
  </Card>

  <Card title="Next.js Example (App Router)" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-nextjs-app-router-example">
    See the full source code.
  </Card>
</CardGroup>

# Send emails with Next.js

> Learn how to send your first email using Next.js and the Resend Node.js SDK.

## Prerequisites

To get the most out of this guide, you'll need to:

* [Create an API key](https://resend.com/api-keys)
* [Verify your domain](https://resend.com/domains)

Prefer watching a video? Check out our video walkthrough below.

<div className="aspect-video">
  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/UqQxfpTQBaE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</div>

## 1. Install

Get the Resend Node.js SDK.

<CodeGroup>
  ```bash npm
  npm install resend
  ```

  ```bash yarn
  yarn add resend
  ```

  ```bash pnpm
  pnpm add resend
  ```
</CodeGroup>

## 2. Create an email template

Start by creating your email template on `components/email-template.tsx`.

```tsx components/email-template.tsx
import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export function EmailTemplate({ firstName }: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {firstName}!</h1>
    </div>
  );
}
```

## 3. Send email using React

Create an API file under `pages/api/send.ts` if you're using the [Pages Router](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) or create a route file under `app/api/send/route.ts` if you're using the [App Router](https://nextjs.org/docs/app/building-your-application/routing/router-handlers).

Import the React email template and send an email using the `react` parameter.

<CodeGroup>
  ```ts pages/api/send.ts
  import type { NextApiRequest, NextApiResponse } from 'next';
  import { EmailTemplate } from '../../components/EmailTemplate';
  import { Resend } from 'resend';

  const resend = new Resend(process.env.RESEND_API_KEY);

  export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'Hello world',
      react: EmailTemplate({ firstName: 'John' }),
    });

    if (error) {
      return res.status(400).json(error);
    }

    res.status(200).json(data);
  };
  ```

  ```ts app/api/send/route.ts
  import { EmailTemplate } from '../../../components/EmailTemplate';
  import { Resend } from 'resend';

  const resend = new Resend(process.env.RESEND_API_KEY);

  export async function POST() {
    try {
      const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: ['delivered@resend.dev'],
        subject: 'Hello world',
        react: EmailTemplate({ firstName: 'John' }),
      });

      if (error) {
        return Response.json({ error }, { status: 500 });
      }

      return Response.json(data);
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }
  }
  ```
</CodeGroup>

## 4. Try it yourself

<CardGroup>
  <Card title="Next.js Example (Pages Router)" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-nextjs-pages-router-example">
    See the full source code.
  </Card>

  <Card title="Next.js Example (App Router)" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-nextjs-app-router-example">
    See the full source code.
  </Card>
</CardGroup>

# Send emails with Nuxt

> Learn how to send your first email using Nuxt and the Resend Node.js SDK.

## Prerequisites

To get the most out of this guide, you'll need to:

* [Create an API key](https://resend.com/api-keys)
* [Verify your domain](https://resend.com/domains)

## 1. Install

Get the Resend Node.js SDK.

<CodeGroup>
  ```bash npm
  npm install resend
  ```

  ```bash yarn
  yarn add resend
  ```

  ```bash pnpm
  pnpm add resend
  ```
</CodeGroup>

## 2. Send email using HTML

Create a [Server Route](https://nuxt.com/docs/guide/directory-structure/server) under `server/api/send.ts`.

The easiest way to send an email is by using the `html` parameter.

<CodeGroup>
  ```ts server/api/send.ts
  import { Resend } from 'resend';

  const resend = new Resend(process.env.RESEND_API_KEY);

  export default defineEventHandler(async () => {
    try {
      const data = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: ['delivered@resend.dev'],
        subject: 'Hello world',
        html: '<strong>It works!</strong>',
      });

      return data;
    } catch (error) {
      return { error };
    }
  });
  ```
</CodeGroup>

## 4. Try it yourself

<Card title="Nuxt Example" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-nuxt-example">
  See the full source code.
</Card>

# Send emails with Nuxt

> Learn how to send your first email using Nuxt and the Resend Node.js SDK.

## Prerequisites

To get the most out of this guide, you'll need to:

* [Create an API key](https://resend.com/api-keys)
* [Verify your domain](https://resend.com/domains)

## 1. Install

Get the Resend Node.js SDK.

<CodeGroup>
  ```bash npm
  npm install resend
  ```

  ```bash yarn
  yarn add resend
  ```

  ```bash pnpm
  pnpm add resend
  ```
</CodeGroup>

## 2. Send email using HTML

Create a [Server Route](https://nuxt.com/docs/guide/directory-structure/server) under `server/api/send.ts`.

The easiest way to send an email is by using the `html` parameter.

<CodeGroup>
  ```ts server/api/send.ts
  import { Resend } from 'resend';

  const resend = new Resend(process.env.RESEND_API_KEY);

  export default defineEventHandler(async () => {
    try {
      const data = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: ['delivered@resend.dev'],
        subject: 'Hello world',
        html: '<strong>It works!</strong>',
      });

      return data;
    } catch (error) {
      return { error };
    }
  });
  ```
</CodeGroup>

## 4. Try it yourself

<Card title="Nuxt Example" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-nuxt-example">
  See the full source code.
</Card>

# Send emails with RedwoodJS

> Learn how to send your first email using Redwood.js and the Resend Node.js SDK.

### Prerequisites

To get the most out of this guide, you'll need to:

* [Create an API key](https://resend.com/api-keys)
* [Verify your domain](https://resend.com/domains)

### 1. Install

Get the Resend Node.js SDK.

<CodeGroup>
  ```bash yarn
  yarn workspace api add resend
  ```
</CodeGroup>

### 2. Send email using HTML

```bash
yarn rw g function send
```

The easiest way to send an email is by using the `html` parameter.

```ts api/src/functions/send/send.ts
import { Resend } from 'resend';
import type { APIGatewayEvent, Context } from 'aws-lambda';

const resend = new Resend('re_xxxxxxxxx');

export const handler = async (event: APIGatewayEvent, context: Context) => {
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['delivered@resend.dev'],
    subject: 'hello world',
    html: '<strong>it works!</strong>',
  });

  if (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error }),
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  };
};
```

### 3. Try it yourself

<Card title="Redwood.js Example" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-redwoodjs-example">
  See the full source code.
</Card>

# Send emails with RedwoodJS

> Learn how to send your first email using Redwood.js and the Resend Node.js SDK.

### Prerequisites

To get the most out of this guide, you'll need to:

* [Create an API key](https://resend.com/api-keys)
* [Verify your domain](https://resend.com/domains)

### 1. Install

Get the Resend Node.js SDK.

<CodeGroup>
  ```bash yarn
  yarn workspace api add resend
  ```
</CodeGroup>

### 2. Send email using HTML

```bash
yarn rw g function send
```

The easiest way to send an email is by using the `html` parameter.

```ts api/src/functions/send/send.ts
import { Resend } from 'resend';
import type { APIGatewayEvent, Context } from 'aws-lambda';

const resend = new Resend('re_xxxxxxxxx');

export const handler = async (event: APIGatewayEvent, context: Context) => {
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['delivered@resend.dev'],
    subject: 'hello world',
    html: '<strong>it works!</strong>',
  });

  if (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error }),
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  };
};
```

### 3. Try it yourself

<Card title="Redwood.js Example" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-redwoodjs-example">
  See the full source code.
</Card>

# Send emails with RedwoodJS

> Learn how to send your first email using Redwood.js and the Resend Node.js SDK.

### Prerequisites

To get the most out of this guide, you'll need to:

* [Create an API key](https://resend.com/api-keys)
* [Verify your domain](https://resend.com/domains)

### 1. Install

Get the Resend Node.js SDK.

<CodeGroup>
  ```bash yarn
  yarn workspace api add resend
  ```
</CodeGroup>

### 2. Send email using HTML

```bash
yarn rw g function send
```

The easiest way to send an email is by using the `html` parameter.

```ts api/src/functions/send/send.ts
import { Resend } from 'resend';
import type { APIGatewayEvent, Context } from 'aws-lambda';

const resend = new Resend('re_xxxxxxxxx');

export const handler = async (event: APIGatewayEvent, context: Context) => {
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['delivered@resend.dev'],
    subject: 'hello world',
    html: '<strong>it works!</strong>',
  });

  if (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error }),
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  };
};
```

### 3. Try it yourself

<Card title="Redwood.js Example" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-redwoodjs-example">
  See the full source code.
</Card>

# Send emails with Astro

> Learn how to send your first email using Astro, Resend, and Node.js.

## Prerequisites

To get the most out of this guide, you'll need to:

* [Create an API key](https://resend.com/api-keys)
* [Verify your domain](https://resend.com/domains)

If you prefer to watch a video, check out our video walkthrough below.

<iframe width="100%" class="aspect-video" src="https://www.youtube.com/embed/OzDg4QPmmac" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />

## 1. Install

Install Resend for Node.js.

<CodeGroup>
  ```bash npm
  npm install resend
  ```

  ```bash yarn
  yarn add resend
  ```

  ```bash pnpm
  pnpm add resend
  ```
</CodeGroup>

## 2. Install an SSR adapter

Because Astro builds a static site by default, [install an SSR adapter](https://docs.astro.build/en/guides/server-side-rendering/) to enable on-demand rendering of routes.

## 3. Add your API key

[Create an API key](https://resend.com/api-keys) in Resend and add it to your `.env` file to keep your API key secret.

```ini .env
RESEND_API_KEY="re_xxxxxxxxx"
```

## 4. Send email using HTML

Create an [Astro Action](https://docs.astro.build/en/guides/actions/) under `actions/index.ts`.

The easiest way to send an email is with the `html` parameter.

<CodeGroup>
  ```ts src/actions/index.ts
  import { ActionError, defineAction } from 'astro:actions';
  import { Resend } from 'resend';

  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  export const server = {
    send: defineAction({
      accept: 'form',
      handler: async () => {
        const { data, error } = await resend.emails.send({
          from: 'Acme <onboarding@resend.dev>',
          to: ['delivered@resend.dev'],
          subject: 'Hello world',
          html: '<strong>It works!</strong>',
        });

        if (error) {
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: error.message,
          });
        }

        return data;
      },
    }),
  };
  ```
</CodeGroup>

Call the `send` action from any frontmatter route, script, or component.

## 5. Try it yourself

<Card title="Astro Example" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-astro-example">
  See the full source code.
</Card>

# Send emails with Supabase Edge Functions

> Learn how to send your first email using Supabase Edge Functions.

## Prerequisites

To get the most out of this guide, you'll need to:

* [Create an API key](https://resend.com/api-keys)
* [Verify your domain](https://resend.com/domains)

Make sure you have the latest version of the [Supabase CLI](https://supabase.com/docs/guides/cli#installation) installed.

## 1. Create Supabase function

Create a new function locally:

```bash
supabase functions new resend
```

## 2. Edit the handler function

Paste the following code into the `index.ts` file:

```js index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = 're_xxxxxxxxx';

const handler = async (_request: Request): Promise<Response> => {
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
            from: 'Acme <onboarding@resend.dev>',
            to: ['delivered@resend.dev'],
            subject: 'hello world',
            html: '<strong>it works!</strong>',
        })
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

serve(handler);
```

## 3. Deploy and send email

Run function locally:

```bash
supabase functions start
supabase functions serve resend --no-verify-jwt
```

Deploy function to Supabase:

```bash
supabase functions deploy resend
```

Open the endpoint URL to send an email:

<img alt="Supabase Edge Functions - Deploy Function" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/supabase-edge-functions-deploy-function.png" />

## 4. Try it yourself

<Card title="Supabase Edge Functions Example" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-supabase-edge-functions-example">
  See the full source code.
</Card>

# Send emails with Vercel Functions

> Learn how to send your first email using Vercel Functions.

## Prerequisites

To get the most out of this guide, you'll need to:

* [Create an API key](https://resend.com/api-keys)
* [Verify your domain](https://resend.com/domains)

Make sure you have the latest version of the [Vercel CLI](https://vercel.com/docs/cli#installing-vercel-cli) installed.

## 1. Create a Next.js function

Create a route file under `app/api/send/route.ts` if you're using the [App Router](https://nextjs.org/docs/app/building-your-application/routing/router-handlers).

```js route.ts
const RESEND_API_KEY = 're_xxxxxxxxx';

export async function POST() {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Acme <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'hello world',
      html: '<strong>it works!</strong>',
    }),
  });

  if (res.ok) {
    const data = await res.json();
    return Response.json(data);
  }
}
```

## 2. Send email locally

Run function locally:

```bash
npx next dev
```

Open the endpoint URL to send an email: `http://localhost:3000/api/send`

## 3. Send email in production

Deploy function to Vercel:

```bash
vercel
```

Open the endpoint URL to send an email: `https://your-project.vercel.app/api/send`

## 4. Try it yourself

<Card title="Vercel Functions Example" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-vercel-functions-example">
  See the full source code.
</Card>

# Send emails with Cloudflare Workers

> Learn how to send your first email using Cloudflare Workers.

## Prerequisites

To get the most out of this guide, you'll need to:

* [Create an API key](https://resend.com/api-keys)
* [Verify your domain](https://resend.com/domains)
* Have a Cloudflare worker with a bundling setup
  * Recommended to be bootstrapped with `npm create cloudflare`

## 1. Install

Get the Resend Node.js SDK.

<CodeGroup>
  ```bash npm
  npm install resend
  ```

  ```bash yarn
  yarn add resend
  ```

  ```bash pnpm
  pnpm add resend
  ```
</CodeGroup>

## 2. Create an email template

Start by creating your email template on `src/emails/email-template.tsx`:

```tsx src/emails/email-template.tsx
import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export function EmailTemplate({ firstName }: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {firstName}!</h1>
    </div>
  );
}

export default EmailTemplate;
```

## 3. Send the email using React and the SDK

Change the file extension of the worker's main file to `tsx` and modify your configurations.

After that, you can send your email using the `react` parameter:

```tsx src/index.tsx
import { Resend } from 'resend';
import { EmailTemplate } from './emails/email-template';

export default {
  async fetch(request, env, context): Promise<Response> {
    const resend = new Resend('re_xxxxxxxxx');

    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'hello world',
      react: <EmailTemplate firstName="John" />,
    });

    return Response.json(data);
  },
} satisfies ExportedHandler<Env, ExecutionContext>;
```

## 4. Deploy and send email

Run `wrangler deploy` and wait for it to finish. Once it's done, it will
give you a URL to try out, like `https://my-worker.your_name.workers.dev`,
that you can open and verify that your email has been sent.

## 5. Try it yourself

<Card title="Cloudflare Workers Example" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-cloudflare-workers-example">
  See the full source code.
</Card>

# Send emails with Deno Deploy

> Learn how to send your first email using Deno Deploy.

## Prerequisites

To get the most out of this guide, you'll need to:

* [Create an API key](https://resend.com/api-keys)
* [Verify your domain](https://resend.com/domains)

## 1. Create a Deno Deploy project

Go to [dash.deno.com/projects](https://dash.deno.com/projects) and create a new playground project.

<img alt="Deno Deploy - New Project" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/deno-deploy-new-project.png" />

## 2. Edit the handler function

Paste the following code into the browser editor:

```js index.ts
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = 're_xxxxxxxxx';

const handler = async (_request: Request): Promise<Response> => {
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
            from: 'Acme <onboarding@resend.dev>',
            to: ['delivered@resend.dev'],
            subject: 'hello world',
            html: '<strong>it works!</strong>',
        })
    });

    if (res.ok) {
        const data = await res.json();

        return new Response(data, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};

serve(handler);
```

## 3. Deploy and send email

Click on `Save & Deploy` at the top of the screen.

<img alt="Deno Deploy - Playground" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/deno-deploy-playground.png" />

## 4. Try it yourself

<Card title="Deno Deploy Example" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-deno-deploy-example">
  See the full source code.
</Card>

# Send emails with AWS Lambda

> Learn how to send your first email using AWS Lambda.

## Prerequisites

To get the most out of this guide, you'll need to:

* [Create an API key](https://resend.com/api-keys)
* [Verify your domain](https://resend.com/domains)

## 1. Create a AWS Lambda function

Go to [aws.amazon.com](https://aws.amazon.com) and create a new Lambda function using the Node.js 18.x runtime.

<img alt="AWS Lambda - New Function" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/aws-lambda-new-function.png" />

## 2. Edit the handler function

Paste the following code into the browser editor:

```js index.mjs
const RESEND_API_KEY = 're_xxxxxxxxx';

export const handler = async (event) => {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Acme <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'hello world',
      html: '<strong>it works!</strong>',
    }),
  });

  if (res.ok) {
    const data = await res.json();

    return {
      statusCode: 200,
      body: data,
    };
  }
};
```

## 3. Deploy and send email

Click on `Deploy` and then `Test` at the top of the screen.

<img alt="AWS Lambda - Edit Function" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/aws-lambda-edit-function.png" />

## 4. Try it yourself

<Card title="AWS Lambda Example" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-aws-lambda-example">
  See the full source code.
</Card>

# Managing Emails

> Learn how to view and manage all sent emails on the Resend Dashboard.

## View email details

See all the metadata associated with an email, including the sender address, recipient address, subject, and more from the [Emails](https://resend.com/emails) page. Select any email to view its details.

<img alt="Email Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-emails-item.png" />

Each email contains a **Preview**, **Plain Text**, and **HTML** version to visualize the content of your sent email in its various formats.

## Understand email events

Here are all the events that can be associated with an email:

* `bounced` - The recipient's mail server rejected the email. ([Learn more about bounced emails](/dashboard/emails/email-bounces))
* `canceled` - The scheduled email was canceled (by user).
* `clicked` - The recipient clicked on a link in the email.
* `complained` - The email was successfully delivered to the recipient's mail server, but the recipient marked it as spam.
* `delivered` - Resend successfully delivered the email to the recipient's mail server.
* `delivery_delayed` - The email couldn't be delivered to the recipient's mail server because a temporary issue occurred. Delivery delays can occur, for example, when the recipient's inbox is full, or when the receiving email server experiences a transient issue.
* `failed` - The email failed to be sent.
* `opened` - The recipient opened the email.
* `queued` - The email created from Broadcasts or Batches is queued for delivery.
* `scheduled` - The email is scheduled for delivery.
* `sent` - The email was sent successfully.

## Share email link

You can share a public link of a sent email, which is valid for 48 hours. Anyone with the link can visualize the email.

To share a link, click on the **dropdown menu** <Icon icon="ellipsis" iconType="solid" />, and select **Share email**.

<img alt="Email - Share Link Option" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-emails-share-option.png" />

Then copy the URL and share it with your team members.

<img alt="Email - Share Link Modal" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-emails-share-modal.png" />

Anyone with the link can visualize the email without authenticating for 48 hours.

<img alt="Email - Share Link Item" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-emails-share-item.png" />

## See associated logs

You can check all the logs associated with an email. This will help you troubleshoot any issues with the request itself.

To view the logs, click on the dropdown menu, and select "View log".

<img alt="Email - View Logs Option" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-emails-log-option.png" />

This will take you to logs, where you can see all the logs associated with the email.

<img alt="Email - View Logs Item" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-emails-log-item.png" />

# Attachments

> Send emails with attachments.

There are two ways to send attachments:

1. [From a remote file](#send-attachments-from-a-remote-file)
2. [From a local file](#send-attachments-from-a-local-file)

<Info>
  We currently do not support sending attachments [when using our batching
  endpoint](/api-reference/emails/send-batch-emails).
</Info>

## Send attachments from a remote file

Include the `path` parameter to send attachments from a remote file. This parameter accepts a URL to the file you want to attach.

Define the file name that will be attached using the `filename` parameter.

<CodeGroup>
  ```ts Node.js {12-13}
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['delivered@resend.dev'],
    subject: 'Receipt for your payment',
    html: '<p>Thanks for the payment</p>',
    attachments: [
      {
        path: 'https://resend.com/static/sample/invoice.pdf',
        filename: 'invoice.pdf',
      },
    ],
  });
  ```

  ```php PHP {10-11}
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->emails->send([
    'from' => 'Acme <onboarding@resend.dev>',
    'to' => ['delivered@resend.dev'],
    'subject' => 'Receipt for your payment',
    'html' => '<p>Thanks for the payment</p>',
    'attachments' => [
      [
        'path' => 'https://resend.com/static/sample/invoice.pdf',
        'filename' => 'invoice.pdf'
      ]
    ]
  ]);
  ```

  ```python Python {6-7}
  import resend

  resend.api_key = "re_xxxxxxxxx"

  attachment: resend.Attachment = {
    "path": "https://resend.com/static/sample/invoice.pdf",
    "filename": "invoice.pdf",
  }

  params: resend.Emails.SendParams = {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "Receipt for your payment",
    "html": "<p>Thanks for the payment</p>",
    "attachments": [attachment],
  }

  resend.Emails.send(params)
  ```

  ```rb Ruby {12-13}
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  params = {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "Receipt for your payment",
    "html": "<p>Thanks for the payment</p>",
    "attachments": [
      {
        "path": "https://resend.com/static/sample/invoice.pdf",
        "filename": 'invoice.pdf',
      }
    ]
  }

  Resend::Emails.send(params)
  ```

  ```go Go {12-13}
  import (
  	"fmt"

  	"github.com/resend/resend-go/v2"
  )

  func main() {
    ctx := context.TODO()
    client := resend.NewClient("re_xxxxxxxxx")

    attachment := &resend.Attachment{
      Path:  "https://resend.com/static/sample/invoice.pdf",
      Filename: "invoice.pdf",
    }

    params := &resend.SendEmailRequest{
        From:        "Acme <onboarding@resend.dev>",
        To:          []string{"delivered@resend.dev"},
        Subject:     "Receipt for your payment",
        Html:        "<p>Thanks for the payment</p>",
        Attachments: []*resend.Attachment{attachment},
    }

    sent, err := client.Emails.SendWithContext(ctx, params)

    if err != nil {
      panic(err)
    }
    fmt.Println(sent.Id)
  }
  ```

  ```rust Rust {12-13}
  use resend_rs::types::{Attachment, CreateEmailBaseOptions};
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let from = "Acme <onboarding@resend.dev>";
    let to = ["delivered@resend.dev"];
    let subject = "Receipt for your payment";

    let path = "https://resend.com/static/sample/invoice.pdf";
    let filename = "invoice.pdf";

    let email = CreateEmailBaseOptions::new(from, to, subject)
      .with_html("<p>Thanks for the payment</p>")
      .with_attachment(Attachment::from_path(path).with_filename(filename));

    let _email = resend.emails.send(email).await?;

    Ok(())
  }
  ```

  ```java Java {8-9}
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          Attachment att = Attachment.builder()
                  .path("https://resend.com/static/sample/invoice.pdf")
                  .fileName("invoice.pdf")
                  .build();

          CreateEmailOptions params = CreateEmailOptions.builder()
                  .from("Acme <onboarding@resend.dev>")
                  .to("delivered@resend.dev")
                  .subject("Receipt for your payment")
                  .text("<p>Thanks for the payment</p>")
                  .attachments(att)
                  .build();

          CreateEmailResponse data = resend.emails().send(params);
      }
  }
  ```

  ```csharp .NET {14-18}
  using Resend;
  using System.Collections.Generic;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var message = new EmailMessage()
  {
      From = "Acme <onboarding@resend.dev>",
      To = "delivered@resend.dev",
      Subject = "Receipt for your payment",
      HtmlBody = "<p>Thanks for the payment</p>",
  };

  message.Attachments = new List<EmailAttachment>();
  message.Attachments.Add( new EmailAttachment() {
    Filename = "invoice.pdf",
    Path = "https://resend.com/static/sample/invoice.pdf",
  } );

  var resp = await resend.EmailSendAsync( message );
  Console.WriteLine( "Email Id={0}", resp.Content );
  ```

  ```bash cURL {11-12}
  curl -X POST 'https://api.resend.com/emails' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "Receipt for your payment",
    "html": "<p>Thanks for the payment</p>",
    "attachments": [
      {
        "path": "https://resend.com/static/sample/invoice.pdf",
        "filename": "invoice.pdf"
      }
    ]
  }'
  ```
</CodeGroup>

## Send attachments from a local file

Include the `content` parameter to send attachments from a local file. This parameter accepts the Base64 encoded content of the file you want to attach.

Define the file name that will be attached using the `filename` parameter.

<CodeGroup>
  ```ts Node.js {16-17}
  import { Resend } from 'resend';
  import fs from 'fs';

  const resend = new Resend('re_xxxxxxxxx');

  const filepath = `${__dirname}/static/invoice.pdf`;
  const attachment = fs.readFileSync(filepath).toString('base64');

  await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['delivered@resend.dev'],
    subject: 'Receipt for your payment',
    text: '<p>Thanks for the payment</p>',
    attachments: [
      {
        content: attachment,
        filename: 'invoice.pdf',
      },
    ],
  });
  ```

  ```php PHP {10-11}
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->emails->send([
    'from' => 'Acme <onboarding@resend.dev>',
    'to' => ['delivered@resend.dev'],
    'subject' => 'Receipt for your payment',
    'html' => '<p>Thanks for the payment</p>',
    'attachments' => [
      [
        'filename' => 'invoice.pdf',
        'content' => $invoiceBuffer
      ]
    ]
  ]);
  ```

  ```python Python {10}
  import os
  import resend

  resend.api_key = "re_xxxxxxxxx"

  f: bytes = open(
    os.path.join(os.path.dirname(__file__), "../static/invoice.pdf"), "rb"
  ).read()

  attachment: resend.Attachment = {"content": list(f), "filename": "invoice.pdf"}

  params: resend.Emails.SendParams = {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "Receipt for your payment",
    "html": "<p>Thanks for the payment</p>",
    "attachments": [attachment],
  }

  resend.Emails.send(params)
  ```

  ```rb Ruby {14-15}
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  file = IO.read("invoice.pdf")

  params = {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "Receipt for your payment",
    "html": "<p>Thanks for the payment</p>",
    "attachments": [
      {
        "content": file.bytes,
        "filename": 'invoice.pdf',
      }
    ]
  }

  Resend::Emails.send(params)
  ```

  ```go Go {19-20}
  import (
  	"fmt"
  	"os"

  	"github.com/resend/resend-go/v2"
  )

  func main() {
    ctx := context.TODO()
    client := resend.NewClient("re_xxxxxxxxx")

    pwd, _ := os.Getwd()
    f, err := os.ReadFile(pwd + "/static/invoice.pdf")
    if err != nil {
      panic(err)
    }

    attachment := &resend.Attachment{
      Content:  f,
      Filename: "invoice.pdf",
    }

    params := &resend.SendEmailRequest{
        From:        "Acme <onboarding@resend.dev>",
        To:          []string{"delivered@resend.dev"},
        Subject:     "Receipt for your payment",
        Html:        "<p>Thanks for the payment</p>",
        Attachments: []*resend.Attachment{attachment},
    }

    sent, err := client.Emails.SendWithContext(ctx, params)

    if err != nil {
      panic(err)
    }
    fmt.Println(sent.Id)
  }
  ```

  ```rust Rust {22}
  use std::fs::File;
  use std::io::Read;

  use resend_rs::types::{Attachment, CreateEmailBaseOptions};
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let from = "Acme <onboarding@resend.dev>";
    let to = ["delivered@resend.dev"];
    let subject = "Receipt for your payment";

    let filename = "invoice.pdf";
    let mut f = File::open(filename).unwrap();
    let mut invoice = Vec::new();
    f.read_to_end(&mut invoice).unwrap();

    let email = CreateEmailBaseOptions::new(from, to, subject)
      .with_html("<p>Thanks for the payment</p>")
      .with_attachment(Attachment::from_content(invoice).with_filename(filename));

    let _email = resend.emails.send(email).await?;

    Ok(())
  }
  ```

  ```java Java {8-9}
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          Attachment att = Attachment.builder()
                  .fileName("invoice.pdf")
                  .content("invoiceBuffer")
                  .build();

          CreateEmailOptions params = CreateEmailOptions.builder()
                  .from("Acme <onboarding@resend.dev>")
                  .to("delivered@resend.dev")
                  .subject("Receipt for your payment")
                  .html("<p>Thanks for the payment</p>")
                  .attachments(att)
                  .build();

          CreateEmailOptions params = CreateEmailOptions.builder()
      }
  }
  ```

  ```csharp .NET {15-19}
  using Resend;
  using System.Collections.Generic;
  using System.IO;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var message = new EmailMessage()
  {
      From = "Acme <onboarding@resend.dev>",
      To = "delivered@resend.dev",
      Subject = "Receipt for your payment",
      HtmlBody = "<p>Thanks for the payment</p>",
  };

  message.Attachments = new List<EmailAttachment>();
  message.Attachments.Add( new EmailAttachment() {
    Filename = "invoice.pdf",
    Content = await File.ReadAllBytesAsync( "invoice.pdf" ),
  } );

  var resp = await resend.EmailSendAsync( message );
  Console.WriteLine( "Email Id={0}", resp.Content );
  ```

  ```bash cURL {11-12}
  curl -X POST 'https://api.resend.com/emails' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "Receipt for your payment",
    "html": "<p>Thanks for the payment</p>",
    "attachments": [
      {
        "content": "UmVzZW5kIGF0dGFjaG1lbnQgZXhhbXBsZS4gTmljZSBqb2Igc2VuZGluZyB0aGUgZW1haWwh%",
        "filename": "invoice.txt"
      }
    ]
  }'
  ```
</CodeGroup>

## Attachment Limitations

* Emails can be no larger than 40MB (including attachments after Base64 encoding).
* Not all file types are supported. See the list of [unsupported file types](/knowledge-base/what-attachment-types-are-not-supported).
* Emails with attachments cannot be scheduled.
* Emails with attachments cannot be sent using our [batching endpoint](/api-reference/emails/send-batch-emails).

## Examples

<CardGroup>
  <Card title="Attachments with Next.js (remote file)" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-examples/tree/main/with-attachments">
    See the full source code.
  </Card>

  <Card title="Attachments with Next.js (local file)" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-examples/tree/main/with-attachments-content">
    See the full source code.
  </Card>
</CardGroup>

# Schedule Email

> Send emails at a specific time without additional complexity.

While some emails need to be delivered as soon as possible, like password resets or magic links, others can be scheduled for a specific time.

Here are some examples of when you might want to schedule an email:

* Send welcome email **5 minutes after** signup
* Trigger a reminder email **24 hours before** an event
* Schedule a weekly digest email for the **next day at 9am PST**

Before, you had to use external services to handle the scheduling logic, but now you can use the new Resend API to schedule emails.

<Info>Emails can be scheduled up to 30 days in advance.</Info>

There are two ways to schedule an email:

1. [Using natural language](#1-schedule-using-natural-language)
2. [Using date format](#2-schedule-using-date-format)

## 1. Schedule using natural language

You can use the various Resend SDKs to schedule emails.

The date can be defined using natural language, such as `"in 1 hour"`, `"tomorrow at 9am"`, or `"Friday at 3pm ET"`.

<CodeGroup>
  ```ts Node.js {10}
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['delivered@resend.dev'],
    subject: 'hello world',
    html: '<p>it works!</p>',
    scheduledAt: 'in 1 min',
  });
  ```

  ```php PHP {8}
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->emails->send([
    'from' => 'Acme <onboarding@resend.dev>',
    'to' => ['delivered@resend.dev'],
    'subject' => 'hello world',
    'html' => '<p>it works!</p>',
    'scheduled_at' => 'in 1 min'
  ]);
  ```

  ```python Python {10}
  import resend

  resend.api_key = "re_xxxxxxxxx"

  params: resend.Emails.SendParams = {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "hello world",
    "html": "<p>it works!</p>",
    "scheduled_at": "in 1 min"
  }

  resend.Emails.send(params)
  ```

  ```rb Ruby {10}
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  params = {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "hello world",
    "html": "<p>it works!</p>",
    "scheduled_at": "in 1 min"
  }

  Resend::Emails.send(params)
  ```

  ```go Go {16}
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
      Html:        "<p>it works!</p>",
      ScheduledAt: "in 1 min"
    }

    sent, err := client.Emails.SendWithContext(ctx, params)

    if err != nil {
      panic(err)
    }
    fmt.Println(sent.Id)
  }
  ```

  ```rust Rust {14}
  use resend_rs::types::CreateEmailBaseOptions;
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let from = "Acme <onboarding@resend.dev>";
    let to = ["delivered@resend.dev"];
    let subject = "hello world";

    let email = CreateEmailBaseOptions::new(from, to, subject)
      .with_html("<p>it works!</p>")
      .with_scheduled_at("in 1 min");

    let _email = resend.emails.send(email).await?;

    Ok(())
  }
  ```

  ```java Java {12}
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          CreateEmailOptions params = CreateEmailOptions.builder()
                  .from("Acme <onboarding@resend.dev>")
                  .to("delivered@resend.dev")
                  .subject("hello world")
                  .html("<p>it works!</p>")
                  .scheduledAt("in 1 min")
                  .build();

          CreateEmailResponse data = resend.emails().send(params);
      }
  }
  ```

  ```csharp .NET {11}
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.EmailSendAsync( new EmailMessage()
  {
      From = "Acme <onboarding@resend.dev>",
      To = "delivered@resend.dev",
      Subject = "hello world",
      HtmlBody = "<p>it works!</p>",
      MomentSchedule = "in 1 min",
  } );
  Console.WriteLine( "Email Id={0}", resp.Content );
  ```

  ```bash cURL {9}
  curl -X POST 'https://api.resend.com/emails' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "hello world",
    "html": "<p>it works!</p>",
    "scheduled_at": "in 1 min"
  }'
  ```
</CodeGroup>

## 2. Schedule using date format

You can also use a date in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format (e.g: `2024-08-05T11:52:01.858Z`).

<CodeGroup>
  ```ts Node.js {5}
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  const oneMinuteFromNow = new Date(Date.now() + 1000 * 60).toISOString();

  await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['delivered@resend.dev'],
    subject: 'hello world',
    html: '<p>it works!</p>',
    scheduledAt: oneMinuteFromNow,
  });
  ```

  ```php PHP {3}
  $resend = Resend::client('re_xxxxxxxxx');

  $oneMinuteFromNow = (new DateTime())->modify('+1 minute')->format(DateTime::ISO8601);

  $resend->emails->send([
    'from' => 'Acme <onboarding@resend.dev>',
    'to' => ['delivered@resend.dev'],
    'subject' => 'hello world',
    'html' => '<p>it works!</p>',
    'scheduled_at' => $oneMinuteFromNow
  ]);
  ```

  ```python Python {6}
  import resend
  from datetime import datetime, timedelta

  resend.api_key = "re_xxxxxxxxx"

  one_minute_from_now = (datetime.now() + timedelta(minutes=1)).isoformat()

  params: resend.Emails.SendParams = {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "hello world",
    "html": "<p>it works!</p>",
    "scheduled_at": one_minute_from_now
  }

  resend.Emails.send(params)
  ```

  ```rb Ruby {5}
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  one_minute_from_now = (Time.now + 1 * 60).strftime("%Y-%m-%dT%H:%M:%S.%L%z")

  params = {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "hello world",
    "html": "<p>it works!</p>",
    "scheduled_at": one_minute_from_now
  }

  Resend::Emails.send(params)
  ```

  ```go Go {12}
  import (
  	"fmt"

  	"github.com/resend/resend-go/v2"
  )

  func main() {
    ctx := context.TODO()
    client := resend.NewClient("re_xxxxxxxxx")

    oneMinuteFromNow := time.Now().Add(time.Minute * time.Duration(1))
    oneMinuteFromNowISO := oneMinuteFromNow.Format("2006-01-02T15:04:05-0700")

    params := &resend.SendEmailRequest{
      From:        "Acme <onboarding@resend.dev>",
      To:          []string{"delivered@resend.dev"},
      Subject:     "hello world",
      Html:        "<p>it works!</p>",
      ScheduledAt: oneMinuteFromNowISO
    }

    sent, err := client.Emails.SendWithContext(ctx, params)

    if err != nil {
      panic(err)
    }
    fmt.Println(sent.Id)
  }
  ```

  ```rust Rust {12-15}
  use chrono::{Local, TimeDelta};
  use resend_rs::types::CreateEmailBaseOptions;
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let from = "Acme <onboarding@resend.dev>";
    let to = ["delivered@resend.dev"];
    let subject = "hello world";
    let one_minute_from_now = Local::now()
      .checked_add_signed(TimeDelta::minutes(1))
      .unwrap()
      .to_rfc3339();

    let email = CreateEmailBaseOptions::new(from, to, subject)
      .with_html("<p>it works!</p>")
      .with_scheduled_at(&one_minute_from_now);

    let _email = resend.emails.send(email).await?;

    Ok(())
  }
  ```

  ```java Java {7-10}
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          String oneMinuteFromNow = Instant
            .now()
            .plus(1, ChronoUnit.MINUTES)
            .toString();

          CreateEmailOptions params = CreateEmailOptions.builder()
                  .from("Acme <onboarding@resend.dev>")
                  .to("delivered@resend.dev")
                  .subject("hello world")
                  .html("<p>it works!</p>")
                  .scheduledAt(oneMinuteFromNow)
                  .build();

          CreateEmailResponse data = resend.emails().send(params);
      }
  }
  ```

  ```csharp .NET {11}
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.EmailSendAsync( new EmailMessage()
  {
      From = "Acme <onboarding@resend.dev>",
      To = "delivered@resend.dev",
      Subject = "hello world",
      HtmlBody = "<p>it works!</p>",
      MomentSchedule = DateTime.UtcNow.AddMinutes( 1 ),
  } );
  Console.WriteLine( "Email Id={0}", resp.Content );
  ```

  ```bash cURL {9}
  curl -X POST 'https://api.resend.com/emails' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "hello world",
    "html": "<p>it works!</p>",
    "scheduled_at": "2024-08-20T11:52:01.858Z"
  }'
  ```
</CodeGroup>

## View an scheduled email

Once you schedule an email, you can see the scheduled time in the Resend dashboard.

<video autoPlay muted loop playsInline className="w-full" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/schedule-email-api-1.mp4" />

## Reschedule an email

After scheduling an email, you might need to update the scheduled time.

You can do so with the following method:

<CodeGroup>
  ```ts Node.js {3}
  resend.emails.update({
    id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
    scheduledAt: 'in 1 min',
  });
  ```

  ```php PHP {2}
  $resend->emails->update('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794', [
    'scheduled_at' => 'in 1 min'
  ]);
  ```

  ```python Python {3}
  update_params: resend.Emails.UpdateParams = {
    "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",
    "scheduled_at": "in 1 min"
  }

  resend.Emails.update(params=update_params)
  ```

  ```rb Ruby {3}
  update_params = {
    "email_id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",
    "scheduled_at": "in 1 min"
  }

  updated_email = Resend::Emails.update(update_params)
  ```

  ```go Go {3}
  updateParams := &resend.UpdateEmailRequest{
    Id:          "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",
    ScheduledAt: "in 1 min",
  }

  updatedEmail, err := client.Emails.Update(updateParams)

  if err != nil {
    panic(err)
  }
  fmt.Printf("%v\n", updatedEmail)
  ```

  ```rust Rust {2}
  let update = UpdateEmailOptions::new()
    .with_scheduled_at("in 1 min");

  let _email = resend
    .emails
    .update("49a3999c-0ce1-4ea6-ab68-afcd6dc2e794", update)
    .await?;
  ```

  ```java Java {2}
  UpdateEmailOptions updateParams = UpdateEmailOptions.builder()
    .scheduledAt("in 1 min")
    .build();

  UpdateEmailResponse data = resend.emails().update("49a3999c-0ce1-4ea6-ab68-afcd6dc2e794", updateParams);
  ```

  ```csharp .NET {7}
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  await resend.EmailRescheduleAsync(
    new Guid( "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" ),
    "in 1 min"
  );
  ```

  ```bash cURL {5}
  curl -X PATCH 'https://api.resend.com/emails/49a3999c-0ce1-4ea6-ab68-afcd6dc2e794' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "scheduled_at": "in 1 min"
  }'
  ```
</CodeGroup>

You can also reschedule an email directly in the Resend dashboard.

<video autoPlay muted loop playsInline className="w-full" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/schedule-email-api-2.mp4" />

## Cancel a scheduled email

<Warning>Once an email is canceled, it cannot be rescheduled.</Warning>

If you need to cancel a scheduled email, you can do so with the following code:

<CodeGroup>
  ```ts Node.js
  resend.emails.cancel('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794');
  ```

  ```php PHP
  $resend->emails->cancel('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794');
  ```

  ```python Python
  resend.Emails.cancel(email_id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794")
  ```

  ```rb Ruby
  Resend::Emails.cancel("49a3999c-0ce1-4ea6-ab68-afcd6dc2e794")
  ```

  ```go Go
  canceled, err := client.Emails.Cancel("49a3999c-0ce1-4ea6-ab68-afcd6dc2e794")
  if err != nil {
    panic(err)
  }
  fmt.Println(canceled.Id)
  ```

  ```rust Rust
  let _canceled = resend
    .emails
    .cancel("49a3999c-0ce1-4ea6-ab68-afcd6dc2e794")
    .await?;
  ```

  ```java Java
  CancelEmailResponse canceled = resend
      .emails()
      .cancel("49a3999c-0ce1-4ea6-ab68-afcd6dc2e794");
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  await resend.EmailCancelAsync( new Guid( "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" ) );
  ```

  ```bash cURL
  curl -X POST 'https://api.resend.com/emails/49a3999c-0ce1-4ea6-ab68-afcd6dc2e794/cancel' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json'
  ```
</CodeGroup>

You can also cancel a scheduled email in the Resend dashboard.

<video autoPlay muted loop playsInline className="w-full" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/schedule-email-api-3.mp4" />

## Limitations

* Batch emails cannot be scheduled
* Emails sent via SMTP cannot be scheduled
* Emails with attachments cannot be scheduled

# Send Test Emails

> Simulate different events by sending test emails.

## How to send test emails

During development, it's important to test different deliverability scenarios.

> **Example**: When an email hard bounces or is marked as spam, it's important to stop sending emails to the recipient, as continuing to send emails to those addresses will damage your domain reputation. We recommend [creating a webhook endpoint](/dashboard/webhooks/introduction) to capture these events and remove the addresses from your mailing lists.

When testing, avoid:

* sending to fake email addresess
* setting up a fake SMTP server

We provide the following test email addresses to help you simulate different email events without damaging your domain reputation. These test emails enable the safe use of Resend's Dashboard, Webhooks, and API when developing your application.

## Test delivered emails

To test that your emails are being successfully delivered, you can send an email to:

```
delivered@resend.dev
```

## Test bounced emails

To test that the recipient's email provider rejected your email, you can send an email to:

```
bounced@resend.dev
```

This will generate a SMTP 550 5.1.1 ("Unknown User") response code.

## Test "Marked as Spam" emails

To test that your emails are being received but marked as spam, you can send an email to:

```
complained@resend.dev
```

# Custom Headers

> Customize how emails are sent with your own headers.

Email headers are typically hidden from the end user but are crucial for deliverability. They include information about the sender, receiver, timestamp, and more.

Resend already includes all the necessary headers for you, but now you can also add your own custom headers.

This is a fairly advanced feature, but it can be useful for a few things:

* Prevent threading on Gmail with the **`X-Entity-Ref-ID`** header ([Example](https://github.com/resend/resend-examples/tree/main/with-prevent-thread-on-gmail))
* Include a shortcut for users to unsubscribe with the **`List-Unsubscribe`** header ([Example](https://github.com/resend/resend-examples/tree/main/with-unsubscribe-url-header))

Here's how you can add custom headers to your emails:

<CodeGroup>
  ```ts Node.js {11}
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['delivered@resend.dev'],
    subject: 'hello world',
    text: 'it works!',
    headers: {
      'X-Entity-Ref-ID': 'xxx_xxxx',
    },
  });
  ```

  ```php PHP {9}
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->emails->send([
    'from' => 'Acme <onboarding@resend.dev>',
    'to' => ['delivered@resend.dev'],
    'subject' => 'hello world',
    'text' => 'it works!',
    'headers' => [
      'X-Entity-Ref-ID' => 'xxx_xxxx',
    ]
  ]);
  ```

  ```python Python {11}
  import resend

  resend.api_key = "re_xxxxxxxxx"

  params: resend.Emails.SendParams = {
    "from": "onboarding@resend.dev",
    "to": ["delivered@resend.dev"],
    "subject": "hi",
    "text": "<strong>hello, world!</strong>",
    "headers": {
      "X-Entity-Ref-ID": "xxx_xxxx"
    }
  }

  email = resend.Emails.send(params)
  print(email)
  ```

  ```rb Ruby {11}
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  params = {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "hello world",
    "text": "it works!",
    "headers": {
      "X-Entity-Ref-ID": "123"
    },
  }

  sent = Resend::Emails.send(params)
  puts sent
  ```

  ```go Go {17}
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
        Text:        "it works!",
        Subject:     "hello world",
        Headers:     map[string]string{
          "X-Entity-Ref-ID": "xxx_xxxx",
        }
    }

    sent, err := client.Emails.SendWithContext(ctx, params)

    if err != nil {
      panic(err)
    }
    fmt.Println(sent.Id)
  }
  ```

  ```rust Rust {14}
  use resend_rs::types::{Attachment, CreateEmailBaseOptions, Tag};
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let from = "Acme <onboarding@resend.dev>";
    let to = ["delivered@resend.dev"];
    let subject = "hello world";

    let email = CreateEmailBaseOptions::new(from, to, subject)
      .with_text("it works!")
      .with_header("X-Entity-Ref-ID", "xxx_xxxx");

    let _email = resend.emails.send(email).await?;

    Ok(())
  }
  ```

  ```java Java {13}
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          CreateEmailOptions params = CreateEmailOptions.builder()
                  .from("Acme <onboarding@resend.dev>")
                  .to("delivered@resend.dev")
                  .subject("hello world")
                  .text("it works!")
                  .headers(Map.of(
                      "X-Entity-Ref-ID", "xxx_xxxx"
                  ))
                  .build();

          CreateEmailResponse data = resend.emails().send(params);
      }
  }
  ```

  ```csharp .NET {12-15}
  using Resend;
  using System.Collections.Generic;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var message = new EmailMessage()
  {
      From = "Acme <onboarding@resend.dev>",
      To = "delivered@resend.dev",
      Subject = "Receipt for your payment",
      HtmlBody = "<p>Thanks for the payment</p>",
      Headers = new Dictionary<string, string>()
      {
          { "X-Entity-Ref-ID", "xxx_xxxx" },
      },
  };

  var resp = await resend.EmailSendAsync( message );
  Console.WriteLine( "Email Id={0}", resp.Content );
  ```

  ```bash cURL {10}
  curl -X POST 'https://api.resend.com/emails' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "hello world",
    "text": "it works!",
    "headers": {
      "X-Entity-Ref-ID": "xxx_xxxx"
    }
  }'
  ```
</CodeGroup>

# Custom Headers

> Customize how emails are sent with your own headers.

Email headers are typically hidden from the end user but are crucial for deliverability. They include information about the sender, receiver, timestamp, and more.

Resend already includes all the necessary headers for you, but now you can also add your own custom headers.

This is a fairly advanced feature, but it can be useful for a few things:

* Prevent threading on Gmail with the **`X-Entity-Ref-ID`** header ([Example](https://github.com/resend/resend-examples/tree/main/with-prevent-thread-on-gmail))
* Include a shortcut for users to unsubscribe with the **`List-Unsubscribe`** header ([Example](https://github.com/resend/resend-examples/tree/main/with-unsubscribe-url-header))

Here's how you can add custom headers to your emails:

<CodeGroup>
  ```ts Node.js {11}
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['delivered@resend.dev'],
    subject: 'hello world',
    text: 'it works!',
    headers: {
      'X-Entity-Ref-ID': 'xxx_xxxx',
    },
  });
  ```

  ```php PHP {9}
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->emails->send([
    'from' => 'Acme <onboarding@resend.dev>',
    'to' => ['delivered@resend.dev'],
    'subject' => 'hello world',
    'text' => 'it works!',
    'headers' => [
      'X-Entity-Ref-ID' => 'xxx_xxxx',
    ]
  ]);
  ```

  ```python Python {11}
  import resend

  resend.api_key = "re_xxxxxxxxx"

  params: resend.Emails.SendParams = {
    "from": "onboarding@resend.dev",
    "to": ["delivered@resend.dev"],
    "subject": "hi",
    "text": "<strong>hello, world!</strong>",
    "headers": {
      "X-Entity-Ref-ID": "xxx_xxxx"
    }
  }

  email = resend.Emails.send(params)
  print(email)
  ```

  ```rb Ruby {11}
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  params = {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "hello world",
    "text": "it works!",
    "headers": {
      "X-Entity-Ref-ID": "123"
    },
  }

  sent = Resend::Emails.send(params)
  puts sent
  ```

  ```go Go {17}
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
        Text:        "it works!",
        Subject:     "hello world",
        Headers:     map[string]string{
          "X-Entity-Ref-ID": "xxx_xxxx",
        }
    }

    sent, err := client.Emails.SendWithContext(ctx, params)

    if err != nil {
      panic(err)
    }
    fmt.Println(sent.Id)
  }
  ```

  ```rust Rust {14}
  use resend_rs::types::{Attachment, CreateEmailBaseOptions, Tag};
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let from = "Acme <onboarding@resend.dev>";
    let to = ["delivered@resend.dev"];
    let subject = "hello world";

    let email = CreateEmailBaseOptions::new(from, to, subject)
      .with_text("it works!")
      .with_header("X-Entity-Ref-ID", "xxx_xxxx");

    let _email = resend.emails.send(email).await?;

    Ok(())
  }
  ```

  ```java Java {13}
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          CreateEmailOptions params = CreateEmailOptions.builder()
                  .from("Acme <onboarding@resend.dev>")
                  .to("delivered@resend.dev")
                  .subject("hello world")
                  .text("it works!")
                  .headers(Map.of(
                      "X-Entity-Ref-ID", "xxx_xxxx"
                  ))
                  .build();

          CreateEmailResponse data = resend.emails().send(params);
      }
  }
  ```

  ```csharp .NET {12-15}
  using Resend;
  using System.Collections.Generic;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var message = new EmailMessage()
  {
      From = "Acme <onboarding@resend.dev>",
      To = "delivered@resend.dev",
      Subject = "Receipt for your payment",
      HtmlBody = "<p>Thanks for the payment</p>",
      Headers = new Dictionary<string, string>()
      {
          { "X-Entity-Ref-ID", "xxx_xxxx" },
      },
  };

  var resp = await resend.EmailSendAsync( message );
  Console.WriteLine( "Email Id={0}", resp.Content );
  ```

  ```bash cURL {10}
  curl -X POST 'https://api.resend.com/emails' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "hello world",
    "text": "it works!",
    "headers": {
      "X-Entity-Ref-ID": "xxx_xxxx"
    }
  }'
  ```
</CodeGroup>

# Email Bounces

> Understanding and resolving delivery issues.

## Why does an email bounce?

A bounce happens when an email cannot be delivered to the person it was meant for, and is returned to the sender. It essentially "bounces" back to the person who sent it.

Some reasons include invalid email addresses, full mailboxes, technical issues with email servers, spam filters, message size restrictions, or blacklisting of the sender's email server.

## Bounce Types and Subtypes

When an email bounces, Resend receives a message from the recipient's mail server. The bounce message explains why the delivery failed so the sender can fix the issue.

There are three types of bounces:

1. `Permanent` - also known as "hard bounce,” where the recipient's mail server rejects the email and will never be delivered.

   * `General` - The recipient's email provider sent a hard bounce message.
   * `NoEmail` - It was not possible to retrieve the recipient email address from the bounce message.
   * `Suppressed` - The recipient's email address is on the suppression list because it has a history of producing hard bounces.
   * `OnAccountSuppressionList` - Resend has suppressed sending to this address because it has previously "hard bounced."
   * `General` - The recipient's email provider sent a general bounce message. You might be able to send a message to the same recipient in the future if the issue that caused the message to bounce is resolved.

2. `Transient` - also known as "soft bounce,” where the recipient's mail server rejects the email but it could be delivered in the future.

   * `General` - The recipient's email provider sent a general bounce message. You might be able to send a message to the same recipient in the future if the issue that caused the message to bounce is resolved.
   * `MailboxFull` - The recipient's email provider sent a bounce message because the recipient's inbox was full. You might be able to send to the same recipient in the future when the mailbox is no longer full.
   * `MessageTooLarge` - The recipient's email provider sent a bounce message because message you sent was too large. You might be able to send a message to the same recipient if you reduce the size of the message.
   * `ContentRejected` - The recipient's email provider sent a bounce message because the message you sent contains content that the provider doesn't allow. You might be able to send a message to the same recipient if you change the content of the message.
   * `AttachmentRejected` - The recipient's email provider sent a bounce message because the message contained an unacceptable attachment. For example, some email providers may reject messages with attachments of a certain file type, or messages with very large attachments. You might be able to send a message to the same recipient if you remove or change the content of the attachment.

<Tip>
  Sometimes, inboxes use autoresponders to signal a bounce. A `transient` status
  could mean it's related to the autoresponder, and it's not a permanent issue.
</Tip>

3. `Undetermined` - where the recipient's email server bounced, but the bounce message didn't contain enough information for Resend to determine the underlying reason.
   * `Undetermined` - The recipient's email provider sent a bounce message. The bounce message didn't contain enough information for Resend to determine the reason for the bounce.

## Viewing Bounce Details in Resend

You can see the bounce details by clicking on the email, and hovering over the `Bounced` label.

<img alt="Email Bounce Notification" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/email-bounce-details-1.png" />

Once you click **See Details**, the drawer will open on the right side of your screen with the bounce type, subtype, along with suggestions on how to proceed.

If the email is on the suppression list, you can click **Remove from Suppression List** to remove it.

<img alt="Email Bounce Drawer" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/email-suppression-list-2.png" />

# Email Templates

> Use high quality, unstyled components for your transactional emails using React and Typescript

While you can generate HTML for your emails using any method, we recommend [React Email](https://react.email/) for React developers. It makes it easy to create email templates with React and TailwindCSS.

* [Getting started quickguide](https://react.email/docs/getting-started/automatic-setup)
* [Email components](https://react.email/components)
* [Email examples](https://react.email/templates)

Each example includes a preview, the React code, the rendered HTML, and the plain text version of the email.

<video autoPlay muted loop src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/email-templates.mp4" />

# Deliverability Insights

> Improve your deliverability with tailored insights based on your sending.

When you view your email within Resend, there is a "Insights" option. When selected, this will run eight deliverability best practice checks on your email and recommend possible changes to improve deliverability.

<img alt="Deliverability Insights" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/deliverability-insights-1.jpg" />

If a check passes, you'll get a nice green check. Resend will provide advice if it fails. We break these into two categories: Attention and Improvements.

## Attention Insights

Changes to your email that can improve deliverability.

<img alt="Attention Insights" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/deliverability-insights-2.jpg" />

#### Link URLs match sending domain

Ensure that the URLs in your email match the sending domain. Mismatched URLs can trigger spam filters.

For example, if your sending domain is `@widgets.com`, ensure links within the message point back to `https://widgets.com`.

#### DMARC Record is Valid

DMARC is a TXT record published in the DNS that specifies how email receivers should handle messages from your domain that don’t pass SPF or DKIM validation. [A valid DMARC record](/dashboard/domains/dmarc) can help improve email deliverability.

Starting in 2024, Gmail and Yahoo require senders to have a DMARC record published. When [viewing your domain](https://resend.com/domains) in Resend, we provide a suggested DMARC record if you’re unsure what to publish.

#### Include Plain Text Version

Including a plain text version of your email ensures that your message is accessible to all recipients, including those who have email clients that do not support HTML.

If you're using Resend's API, [plain text is passed via the `text` parameter](https://resend.com/docs/api-reference/emails/send-email).

This can also generate plain text using [React Email](https://react.email/docs/utilities/render#4-convert-to-plain-text).

#### Don't use "no-reply"

Indicating that this is a one-way communication decreases trust. Some email providers use engagement (email replies) when deciding how to filter your email. A valid email address allows you to communicate with your recipients easily if they have questions.

#### Keep email body size small

Gmail limits the size of each email message to 102 KB. Once that limit is reached, the remaining content is clipped and hidden behind a link to view the entire message. Keep your email body size small to avoid this issue.

This check will show the current size of your email.

## Improvement Insights# Add an unsubscribe link to transactional emails

> Learn how to give email recipients the ability to unsubscribe without searching for the unsubscribe link.

Resend currently doesn't manage contact lists for transactional emails.

If you manage your own list, you can add the `List-Unsubscribe: https://example.com/unsubscribe` header when sending emails using the Resend API.

As of Febuary 2024, your bulk messages must include a URL version in your list-unsubscribe header, `List-Unsubscribe-Post: List-Unsubscribe=One-Click`, and to allow for a `POST` request from the same URL.

When receiving a `POST`, it should return a blank page with `200 (OK)` or `202 (Accepted)`, and should show the regular unsubscribe page with the `GET` method. Ensure that users stop receiving email within 48 hours of this request.

This header allows email clients to offer an easy “Unsubscribe” option in their UI, enhancing user experience and decreasing spam complaints.

You can read more about this requirement in our [Bulk Sending Requirements blog post.](https://resend.com/blog/gmail-and-yahoo-bulk-sending-requirements-for-2024#one-click-unsubscribe)

```ts Node.js {11}
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

await resend.emails.send({
  from: 'Acme <onboarding@resend.dev>',
  to: ['delivered@resend.dev'],
  subject: 'hello world',
  text: 'it works!',
  headers: {
    'List-Unsubscribe': '<https://example.com/unsubscribe>',
  },
});
```

## Example

<Card title="Unsubscribe url header" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-examples/tree/main/with-unsubscribe-url-header">
  See the full source code.
</Card>

# Managing Tags

> Add unique identifiers to emails sent.

Tags are unique identifiers you can add to your emails. They help associate emails with your application. They are passed in key/value pairs. After the email is sent, the tag is included in the webhook event. Tags can include ASCII letters, numbers, underscores, or dashes.

Some examples of when to use a tag:

* Associate the email a "customer ID" from your application
* Add a label from your database like "free" or "enterprise"
* Note the category of email sent, like "welcome" or "password reset"

Here's how you can add custom tags to your emails:

<CodeGroup>
  ```ts Node.js {10-15}
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['delivered@resend.dev'],
    subject: 'hello world',
    html: '<p>it works!</p>',
    tags: [
      {
        name: 'category',
        value: 'confirm_email',
      },
    ],
  });
  ```

  ```php PHP {8-13}
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->emails->send([
    'from' => 'Acme <onboarding@resend.dev>',
    'to' => ['delivered@resend.dev'],
    'subject' => 'hello world',
    'html' => '<p>it works!</p>',
    'tags' => [
      [
        'name' => 'category',
        'value' => 'confirm_email',
      ],
    ]
  ]);
  ```

  ```python Python {10-12}
  import resend

  resend.api_key = "re_xxxxxxxxx"

  params: resend.Emails.SendParams = {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "hello world",
    "html": "<p>it works!</p>",
    "tags": [
      {"name": "category", "value": "confirm_email"},
    ],
  }

  email = resend.Emails.send(params)
  print(email)
  ```

  ```rb Ruby {10-12}
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  params = {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "hello world",
    "html": "<p>it works!</p>",
    "tags": [
      {"name": "category", "value": "confirm_email"}
    ]
  }

  sent = Resend::Emails.send(params)
  puts sent
  ```

  ```go Go {16}
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
        Text:        "<p>it works!</p>",
        Subject:     "hello world",
        Tags:        []resend.Tag{{Name: "category", Value: "confirm_email"}},
    }

    sent, err := client.Emails.SendWithContext(ctx, params)

    if err != nil {
      panic(err)
    }
    fmt.Println(sent.Id)
  }
  ```

  ```rust Rust {14}
  use resend_rs::types::{CreateEmailBaseOptions, Tag};
  use resend_rs::{Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let from = "Acme <onboarding@resend.dev>";
    let to = ["delivered@resend.dev"];
    let subject = "hello world";

    let email = CreateEmailBaseOptions::new(from, to, subject)
      .with_html("<p>it works!</p>")
      .with_tag(Tag::new("category", "confirm_email"));

    let _email = resend.emails.send(email).await?;

    Ok(())
  }
  ```

  ```java Java {17}
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          Tag tag = Tag.builder()
                  .name("category")
                  .value("confirm_email")
                  .build();

          SendEmailRequest sendEmailRequest = SendEmailRequest.builder()
                  .from("Acme <onboarding@resend.dev>")
                  .to("delivered@resend.dev")
                  .subject("hello world")
                  .html("<p>it works!</p>")
                  .tags(tag)
                  .build();

          SendEmailResponse data = resend.emails().send(sendEmailRequest);
      }
  }
  ```

  ```bash cURL {9-14}
  curl -X POST 'https://api.resend.com/emails' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "hello world",
    "html": "<p>it works!</p>",
    "tags": [
      {
        "name": "category",
        "value": "confirm_email"
      }
    ]
  }'
  ```
</CodeGroup>

# Managing Domains

> Visualize all the domains on the Resend Dashboard.

<Warning>
  Domain not verifying? [Try
  this](/knowledge-base/what-if-my-domain-is-not-verifying).
</Warning>

## Verifying a domain

Resend sends emails using a domain you own.

We recommend using subdomains (e.g., `updates.yourdomain.com`) to isolate your sending reputation and communicate your intent. Learn more about [using subdomains](/knowledge-base/is-it-better-to-send-emails-from-a-subdomain-or-the-root-domain).

In order to verify a domain, you must set two DNS entries:

1. [SPF](#what-are-spf-records): list of IP addresses authorized to send email on behalf of your domain
2. [DKIM](#what-are-dkim-records): public key used to verify email authenticity

These two DNS entries grant Resend permission to send email on your behalf. Once SPF and DKIM verify, you can optionally add a [DMARC record](/dashboard/domains/dmarc) to build additional trust with mailbox providers.

<Info>
  Resend requires you own your domain (i.e., not a shared or public domain).
</Info>

## View domain details

The [Domains dashboard](https://resend.com/domains) shows information about your domain name, its verification status, and history.

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-resend.png" />

<Info>
  Need specific help with a provider? View our [knowledge base DNS
  Guides](/knowledge-base).
</Info>

## What are SPF records

Sender Policy Framework (SPF) is an email authentication standard that allows you to list all the IP addresses that are authorized to send email on behalf of your domain.

The SPF configuration is made of a TXT record that lists the IP addresses approved by the domain owner. It also includes a MX record that allows the recipient to send bounce and complaint feedback to your domain.

<img alt="SPF Records" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-resend-spf.png" />

## Custom Return Path

By default, Resend will use the `send` subdomain for the Return-Path address. You can change this by setting the optional `custom_return_path` parameter when [creating a domain](/api-reference/domains/create-domain) via the API or under **Advanced options** in the dashboard.

<img alt="Custom Return Path" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-resend-custom-return-path.png" />

For the API, optionally pass the custom return path parameter.

<CodeGroup>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  resend.domains.create({ name: 'example.com', customReturnPath: 'outbound' });
  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->domains->create([
    'name' => 'example.com',
    'custom_return_path' => 'outbound'
  ]);
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"

  params: resend.Domains.CreateParams = {
    "name": "example.com",
    "custom_return_path": "outbound"
  }

  resend.Domains.create(params)
  ```

  ```ruby Ruby
  Resend.api_key = ENV["RESEND_API_KEY"]

  params = {
    name: "example.com",
    custom_return_path: "outbound"
  }
  domain = Resend::Domains.create(params)
  puts domain
  ```

  ```go Go
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  params := &resend.CreateDomainRequest{
      Name: "example.com",
      CustomReturnPath: "outbound",
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
      .add(CreateDomainOptions::new("example.com").with_custom_return_path("outbound"))
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
                  .name("example.com")
                  .customReturnPath("outbound")
                  .build();

          CreateDomainResponse domain = resend.domains().create(params);
      }
  }
  ```

  ```csharp .NET
  using Resend;

  IResend resend = ResendClient.Create( "re_xxxxxxxxx" ); // Or from DI

  var resp = await resend.DomainAddAsync( "example.com", new DomainAddOptions { CustomReturnPath = "outbound" } );
  Console.WriteLine( "Domain Id={0}", resp.Content.Id );
  ```

  ```bash cURL
  curl -X POST 'https://api.resend.com/domains' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "name": "example.com",
    "custom_return_path": "outbound"
  }'
  ```
</CodeGroup>

Custom return paths must adhere to the following rules:

* Must be 63 characters or less
* Must start with a letter, end with a letter or number, and contain only letters, numbers, and hyphens

Avoid setting values that could undermine credibility (e.g. `testing`), as they may be exposed to recipients in some email clients.

## What are DKIM records

DomainKeys Identified Mail (DKIM) is an email security standard designed to make sure that an email that claims to have come from a specific domain was indeed authorized by the owner of that domain.

The DKIM configuration is made of a TXT record that contains a public key that is used to verify the authenticity of the email.

<img alt="DKIM Records" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-resend-dkim.png" />

## Understand a domain status

Domains can have different statuses, including:

* `not_started`: You've added a domain to Resend, but you haven't clicked on `Verify DNS Records` yet.
* `pending`: Resend is still trying to verify the domain.
* `verified`: Your domain is successfully verified for sending in Resend.
* `failed`: Resend was unable to detect the DNS records within 72 hours.
* `temporary_failure`: For a previously verified domain, Resend will periodically check for the DNS record required for verification. If at some point, Resend is unable to detect the record, the status would change to "Temporary Failure". Resend will recheck for the DNS record for 72 hours, and if it's unable to detect the record, the domain status would change to "Failure". If it's able to detect the record, the domain status would change to "Verified".

## Open and Click Tracking

Open and click tracking is disabled by default for all domains. You can enable it by clicking on the toggles within the domain settings.

<img alt="Open and Click Tracking" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-open-and-click-tracking.png" />

<Info>
  For best deliverability, we recommend disabling click and open tracking [for
  sensitive transactional
  emails](/dashboard/emails/deliverability-insights#disable-click-tracking).
</Info>

## How Open Tracking Works

A 1x1 pixel transparent GIF image is inserted in each email and includes a unique reference to this image file. When the image is downloaded, Resend can tell exactly which message was opened and by whom.

## How Click Tracking Works

To track clicks, Resend modifies each link in the body of the HTML email. When recipients open a link, they are sent to a Resend server, and are immediately redirected to the URL destination.



If you're diagnosing a deliverability issue, changing your email practices could be helpful.

<img alt="Improvement Insights" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/deliverability-insights-3.jpg" />

#### Use a Subdomain

Using a subdomain instead of the root domain helps segment your sending by purpose. This protects different types of sending from impacting the reputation of others and clearly shows the sending purpose.

#### Disable Click Tracking

Click tracking modifies links, sometimes causing spam filters to flag emails as suspicious or phishing attempts. Disabling click tracking can help with email deliverability, especially for sensitive transactional emails like login or email verification.

If on, you can [disable click tracking on your domain in Resend](https://resend.com/domains).

#### Disable Open Tracking

Spam filters are sensitive to tracking pixels, flagging them as potential spam. Without these tracking elements, emails may bypass these filters more effectively, especially for sensitive transactional emails like login or email verification.

If on, you can [disable open tracking on your domain in Resend](https://resend.com/domains).

# Choosing a Region

> Resend offers sending from multiple regions

Resend users have the option to send transactional and marketing emails from four different regions:

* North Virginia (us-east-1)
* Ireland (eu-west-1)
* São Paulo (sa-east-1)
* Tokyo (ap-northeast-1)

No matter where your users are, you can ensure that they receive your emails in a timely and efficient manner. You can visualize the different regions in the Resend dashboard:

<img alt="Multi Region Domains" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/multi-region-1.png" />

## Why is this important?

Especially for transactional emails like magic links, password resets, and welcome messages, users expect to receive them right away. If they don't, they might not be able to access your service right away, which could be a missed opportunity for your organization.

Here are some of the other benefits of using our multi-region email sending feature:

1. **Faster delivery:** By sending emails from the region closest to your user, you can reduce latency and ensure a faster time-to-inbox. This can be the difference between people using/buying your product or not.
2. **Easier account management:** Instead of having to maintain different accounts for each region, we're providing multi-region within the same account. That way, you aren't juggling different login credentials.
3. **Increased resilience:** In case of disruption in one region, our multi-region feature enables you to send emails from a backup domain in a separate region, guaranteeing maximum uptime.

## Get Started

To start using our multi-region email sending feature, go to **[Domains](https://resend.com/domains)**, then select the option to add a new domain.

Finally, select the region you want to send your emails.

## How to set up multi-region for the same domain

For advanced needs, you can set up multiple regions for the same domain. We recommend setting a unique subdomain for each region (e.g., us.domain.com, eu.domain.com). When sending transactional emails or marketing emails, choose the right domain for your users.

## Changing Domain Region

If you'd like to switch the region your domain is currently set to:

1. Delete your current domain in the [Domain's page](https://resend.com/domains).
2. Add the same domain again, selecting the new region.
3. Update your DNS records to point to the new domain.

For more help, please reach out to [Support](https://resend.com/help), and we can help you out.

# Implementing DMARC

> Implement DMARC to build trust in your domain and protect against email spoofing and unauthorized use of your domain in email messages.

## Prerequisites

Since DMARC relies on DKIM AND SPF, first ensure your existing emails are passing SPF and DKIM.

* DKIM verifies the email wasn't altered in transit using cryptographic authentication.
* SPF authorizes IP addresses to send email for a domain.

If you have a [verified](/dashboard/domains/introduction) domain with Resend, it means you are already passing SPF and DKIM

## What is DMARC?

DMARC ([Domain-based Message Authentication, Reporting, and Conformance](https://dmarc.org/overview/)) is an email authentication protocol that instructs mail servers what to do if an email message fails SPF and DKIM, preventing email spoofing (forged headers). DMARC is added to a domain through a TXT record added to the domain at `_dmarc`.

By preventing spoofing, a domain can build trust with mailbox providers, as it allows them to verify that emails are authorized to send on behalf of that domain.

An email must pass either SPF or DKIM checks (but not necessarily both) to achieve DMARC compliance and be considered authenticated. A message fails DMARC if both SPF and DKIM fail on the message.

## Implementing DMARC

### 1. Add a TXT `_dmarc` Record

To start, add a flexible DMARC record to your domain.

| Name                | Type | Value                                                       |
| ------------------- | ---- | ----------------------------------------------------------- |
| \_dmarc.example.com | TXT  | `v=DMARC1; p=none; rua=mailto:dmarcreports@yourdomain.com;` |

This record is specifying a few parameters (see [Reference](#reference) section for more details):

* `v` - Version:
  This is the version of DMARC
* `p` - Policy:
  This is telling the inbox how to process messages that fail DMARC. Options are `none`, `quarantine`, `reject`. It's a best practice to use `quarantine` or `reject`, but you should only do it once you know your messages are delivering and fully passing DMARC.
* `rua` - Reporting URI of Aggregate:
  Provide a **valid address** that can receive email. The address can be a different domain than the one on which you set the DMARC policy. The aggregate report comes as an email with a `.xml` file attached that shares the IP sources of your messages and if they passed SPF or DKIM.

To ensure you don't accidentally introduce breaking changes to your email sending, we suggest starting with a policy of `p=none;` before moving to a stricter policy.

### 2. Test to Confirm Delivery and Passing

To test emails, send an email from all the applications and services your domain uses. Confirm that the messages are delivered to the inbox and that the headers show DMARC passing. Spending a few at this step is a good rule of thumb to ensure you're checking all sources of email from your domain and catch email that is sent at a different cadence than daily.

To confirm DMARC passed, you can inspect the email headers and confirm there is `dmarc=pass`.

<Tip>
  Gradually identify email sources using tools like [Google Postmaster
  Tools](https://gmail.com/postmaster/), which provides DKIM/SPF feedback.
  [DMARC monitoring
  services](https://dmarc.org/resources/products-and-services/) can aggregate
  your email sources by collecting DMARC reports, helping you discover any
  services sending email on your domain's behalf.
</Tip>

### 3. Upgrade Policy

Once you have verified DMARC is passing across all your sending, you should upgrade your Policy to `p=quarantine;`. This policy gives mailbox providers greater confidence in your domain since your domain only allows authenticated email.

| Policy        | Value                                            |
| ------------- | ------------------------------------------------ |
| p=none;       | Allow all email. Monitoring for DMARC failures.  |
| p=quarantine; | Send messages that fail DMARC to the spam folder |
| p=reject;     | Bounce delivery of emails that fail DMARC.       |

Once your policy is `p=quarantine;` or `p=reject;` you can explore setting up [BIMI](/dashboard/domains/bimi), which can provide established brands even greater sending credibility by displaying a logo as an avatar in an email client.

## Reference

<Tip>
  While the DMARC protocol includes both `pct` and `ruf` parameters, they are
  not widely followed by mailbox providers. These settings may not be respected
  or followed.
</Tip>

| Parameter | Purpose                                       | Example                           |
| --------- | --------------------------------------------- | --------------------------------- |
| `v`       | Protocol version                              | `v=DMARC1`                        |
| `pct`     | Percentage of messages subjected to filtering | `pct=20`                          |
| `ruf`     | Reporting URI for forensic reports            | `ruf=mailto:authfail@example.com` |
| `rua`     | Reporting URI of aggregate reports            | `rua=mailto:aggrep@example.com`   |
| `p`       | Policy for organizational domain              | `p=quarantine`                    |
| `sp`      | Policy for subdomains of the OD               | `sp=reject`                       |
| `adkim`   | Alignment mode for DKIM                       | `adkim=s`                         |
| `aspf`    | Alignment mode for SPF                        | `aspf=r`                          |

<Note>
  Having issues setting up DMARC? [We can help](https://resend.com/help).
</Note>

# Implementing BIMI

> Set up BIMI to gain brand recognition by displaying your logo in the inbox.

## Prerequisites

To get the most out of this guide, you will need to:

* Establish verifiable use of your logo
  * Obtain a registered trademark for your logo
  * Or, use your logo for over one year
* [Add a DMARC record on your domain](/dashboard/domains/dmarc)

## What is BIMI?

BIMI ([Brand Indicators for Message Identification](https://bimigroup.org/)) is a standard that allows you to specify a logo (and sometimes a checkmark) to display next to your email in the inbox. These indicators can increase brand recognition and trust and improve engagement.

![bimi-example](https://mintlify.s3.us-west-1.amazonaws.com/resend/images/bimi-example.png)

Though this standard is newer, most major mailbox providers now support it. This gives BIMI adoption a competitive edge for brand recognition in the inbox. Most mailbox providers show brand indicators for those who purchase a certificate, of which there are two types: a Common Mark Certificate (CMC) and a Verified Mark Certificate (VMC).

Here's an overview of current email client support:

| Client                                                | BIMI w/a CMC | BIMI w/a VMC | BIMI w/out a VMC or CMC |
| ----------------------------------------------------- | ------------ | ------------ | ----------------------- |
| [Apple Mail](https://support.apple.com/en-us/108340)  | X            | ✓            | X                       |
| [Gmail](https://support.google.com/a/answer/10911320) | ✓            | ✓            | X                       |
| Outlook                                               | X            | X            | X                       |
| [Yahoo](https://senders.yahooinc.com/bimi/)           | ✓            | ✓            | ✓                       |

## Implementing BIMI

### 1. Configure DMARC

<Note>
  If you haven't set up DMARC yet, follow our [DMARC Setup
  Guide](/dashboard/domains/dmarc).
</Note>

BIMI requires a DMARC policy of `p=quarantine;` or `p=reject;`. This policy assures that your emails are properly authenticated and that no one else can spoof your domain and send them with your logo.

Here's an overview of the required parameters:

| Parameter | Purpose    | Required Value                 |
| --------- | ---------- | ------------------------------ |
| `p`       | Policy     | `p=quarantine;` or `p=reject;` |
| `pct`     | Percentage | `pct=100;`                     |

Here is an example of an adequate DMARC record:

```
"v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarcreports@example.com"
```

<Note>
  For BIMI on a subdomain, the root or APEX domain must also have a DMARC policy
  of `p=quarantine` or `p=reject` in addition to the subdomain. If not, the
  subdomain will not be compliant to display a BIMI logo.
</Note>

### 2. Establish verifiable use of your logo

To display your logo in most email clients using BIMI, you need to prove ownership of your logo by obtaining a mark certificate. This process is similar to acquiring an SSL certificate for your website. You can purchase a mark certificate from various authorized vendors. We recommend [DigiCert](https://www.digicert.com/).

There are two possible mark Certificate's to verify the use of your logo:

* **Verified Mark Certificate (VMC)**: A certificate issued by a Certificate Authority (CA) that is used to verify that you are the owner of the logo you are trying to display. A VMC is avaiable if you have a trademark of your logo. With a VMC, Gmail will display a blue checkmark.
* **Common Mark Certificate (CMC)**: A certificate also issued by Certificate Authority (CA) to verify you. A CMC is available to you if you can establish that you’ve used your logo for one year. Currently, only Gmail supports a CMC.

A VMC offers the widest email client support, though the barrier of a trademark means a CMC is an easier path if you have eastablished use of your logo for one year.

Here are a some things to know before starting the certificate purchase process:

* If you don't hold a trademark for your logo or have not used your logo for a year, you will not be able to purchase a certiifcate.
* The process could take weeks, so start early and respond to their requests quickly.
* You will need to provide a [SVG Tiny P/S formatted logo](https://bimigroup.org/creating-bimi-svg-logo-files/).
* You will need to prove you own the domain by adding a DNS record.
* You will need to prove you are the owner of the trademark or logo by providing identification.
* You will need publicly available proof that your business exists. For newer startups, recommend [Yellow Pages](https://marketing.yellowpages.com/en/) or [Google Business Profiles](https://support.google.com/business/answer/3039617?hl=en) as the easiest method for proving your existence

## 3. Set your BIMI DNS Record

Once you have your VMC, you can set your BIMI DNS record. This TXT record points to the location of your VMC and your logo.

| Name           | Type | Value                                               |
| -------------- | ---- | --------------------------------------------------- |
| default.\_bimi | TXT  | v=BIMI1; l=link\_to\_logo; a=link\_to\_certificate; |

Here is an example of a BIMI record:

```
v=BIMI1; l=https://vmc.digicert.com/00-00.svg; a=https://vmc.digicert.com/00-00.pem;
```

<Tip>
  Ensure your logo uses an HTTPS URL. Mailbox providers will not display the
  logo if served from an HTTP URL.
</Tip>

It contains a publicly and programmatically accessible link to your verified logo (.svg) and a link to your VMC (.pem).

To confirm that your BIMI record is published correctly, the [BIMI working group offers a tool](https://bimigroup.org/bimi-generator/) to check it.

It often takes a few days for your logo to display in inboxes after this record propagates. Mailbox providers will also conditionally decide to show the logo based on the domain's sending email volume and reputation. A domain with a high spam or bounce rate may not have their avatar displayed.

## Reference

| Parameter | Purpose             | Example                                |
| --------- | ------------------- | -------------------------------------- |
| `v`       | The version of BIMI | `v=BIMI1`                              |
| `l`       | Logo                | `l=https://vmc.digicert.com/00-00.svg` |
| `a`       | Certificate         | `a=https://vmc.digicert.com/00-00.pem` |
| `s`       | Selector            | `s=springlogo`                         |

<Tip>
  The BIMI standard allows for multiple logos using the [selector
  parameter](https://bimigroup.org/how-and-why-to-implement-bimi-selectors/).
</Tip>

<Note>
  Having issues setting up BIMI? [We can help](https://resend.com/help).
</Note>

# Introduction

> Visualize all the API Keys on the Resend Dashboard.

## What is an API Key

API Keys are secret tokens used to authenticate your requests. They are unique to your account and should be kept confidential.

## Add API Key

You can create a new API Key from the [API Key Dashboard](https://resend.com/api-keys).

1. Click **Create API Key**.
2. Give your API Key a name.
3. Select **Full access** or **Sending access** as the permission.
4. If you select **Sending access**, you can choose the domain you want to restrict access to.

<img alt="Add API Key" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-api-keys-add.png" height={450} width={720} />

<Note>
  For security reasons, you can only view the API Key once. Learn more about
  [API key best practices](/knowledge-base/how-to-handle-api-keys).
</Note>

## Set API Key permissions

There are two different permissions of API Keys:

1. **Full access**: grants access to create, delete, get, and update any resource.
2. **Sending access**: grants access only to send emails.

With API Key permissions, you can isolate different application actions to different API Keys. Using multiple keys, you can view logs per key, detect possible abuse, and control the damage that may be done accidentally or maliciously.

## View all API Keys

The [API Dashboard](https://resend.com/api-keys) shows you all the API Keys you have created along with their details, including the **last time you used** an API Key.

Different color indicators let you quickly scan and detect which API Keys are being used and which are not.

<img alt="View All API Keys" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-api-keys-view-all.jpg" />

## Edit API Key details

After creating an API Key, you can edit the following details:

* Name
* Permission
* Domain

To edit an API Key, click the **More options** <Icon icon="ellipsis" iconType="solid" /> button and then **Edit API Key**.

<img alt="View Inactive API Key" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-api-keys-edit.jpeg" />

<Info>You cannot edit an API Key value after it has been created.</Info>

## Delete inactive API Keys

If an API Key **hasn't been used in the last 30 days**, consider deleting it to keep your account secure.

<img alt="View Inactive API Key" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-api-keys-view-inactive.jpg" />

You can delete an API Key by clicking the **More options** <Icon icon="ellipsis" iconType="solid" /> button and then **Remove API Key**.

<img alt="Delete API Key" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-api-keys-remove.jpeg" />

## View API Key logs

When visualizing an active API Key, you can see the **total number of requests** made to the key. For more detailed logging information, select the underlined number of requests to view all logs for that API Key.

<img alt="View Active API Key" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-api-keys-view-active.jpg" />

# Managing Webhooks

> Use webhooks to notify your application about email events.

## What is a webhook?

Resend uses webhooks to push real-time notifications to you about your email sending. All webhooks use HTTPS and deliver a JSON payload that can be used by your application. You can use webhook feeds to do things like:

* Automatically remove bounced email addresses from mailing lists
* Create alerts in your messaging or incident tools based on event types
* Store all send events in your own database for custom reporting/retention

## Steps to receive webhooks

You can start receiving real-time events in your app using the steps:

1. Create a local endpoint to receive requests
2. Register your development webhook endpoint
3. Test that your webhook endpoint is working properly
4. Deploy your webhook endpoint to production
5. Register your production webhook endpoint

## 1. Create a local endpoint to receive requests

In your local application, create a new route that can accept POST requests.

For example, you can add an API route on Next.js:

```js pages/api/webhooks.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const payload = req.body;
    console.log(payload);
    res.status(200);
  }
};
```

On receiving an event, you should respond with an `HTTP 200 OK` to signal to Resend that the event was successfully delivered.

## 2. Register your development webhook endpoint

Register your publicly accessible HTTPS URL in the Resend dashboard.

<Tip>
  You can create a tunnel to your localhost server using a tool like
  [ngrok](https://ngrok.com/download). For example:
  `https://8733-191-204-177-89.sa.ngrok.io/api/webhooks`
</Tip>

<img alt="Add Webhook" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-webhooks-add.png" />

## 3. Test that your webhook endpoint is working properly

Send a few test emails to check that your webhook endpoint is receiving the events.

<img alt="Webhook Events List" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-webhook-events-list.png" />

## 4. Deploy your webhook endpoint

After you're done testing, deploy your webhook endpoint to production.

## 5. Register your production webhook endpoint

Once your webhook endpoint is deployed to production, you can register it in the Resend dashboard.

## FAQ

<AccordionGroup>
  <Accordion title="What is the retry schedule?">
    If Resend does not receive a 200 response from a webhook server, we will retry the webhooks.

    Each message is attempted based on the following schedule, where each period is started following the failure of the preceding attempt:

    * 5 seconds
    * 5 minutes
    * 30 minutes
    * 2 hours
    * 5 hours
    * 10 hours
  </Accordion>

  <Accordion title="What happens after all the retries fail?">
    After the conclusion of the above attempts the message will be marked as failed, and you will get a webhook of type `message.attempt.exhausted` notifying you of this error.
  </Accordion>

  <Accordion title="What IPs do webhooks POST from?">
    If your server requires an allowlist, our webhooks come from the following IP addresses:

    * `44.228.126.217`
    * `50.112.21.217`
    * `52.24.126.164`
    * `54.148.139.208`
    * `2600:1f24:64:8000::/52`
  </Accordion>
</AccordionGroup>

## Try it yourself

<Card title="Webhook Code Example" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-examples/tree/main/with-webhooks">
  See an example of how to receive webhooks events for Resend emails.
</Card>

# Event Types

> List of supported event types and their payload.

### `email.sent`

Occurs whenever the **API request was successful**. Resend will attempt to deliver the message to the recipient's mail server.

<Accordion title="Sample Request Body">
  <Snippet file="email-sent-webhook.mdx" />
</Accordion>

### `email.delivered`

Occurs whenever Resend **successfully delivered the email** to the recipient's mail server.

<Accordion title="Sample Request Body">
  <Snippet file="email-delivered-webhook.mdx" />
</Accordion>

### `email.delivery_delayed`

Occurs whenever the **email couldn't be delivered due to a temporary issue**.

Delivery delays can occur, for example, when the recipient's inbox is full, or when the receiving email server experiences a transient issue.

<Accordion title="Sample Request Body">
  <Snippet file="email-delivery-delayed-webhook.mdx" />
</Accordion>

### `email.complained`

Occurs whenever the email was successfully **delivered, but the recipient marked it as spam**.

<Accordion title="Sample Request Body">
  <Snippet file="email-complained-webhook.mdx" />
</Accordion>

### `email.bounced`

Occurs whenever the recipient's mail server **permanently rejected the email**.

<Accordion title="Sample Request Body">
  <Snippet file="email-bounced-webhook.mdx" />
</Accordion>

### `email.opened`

Occurs whenever the **recipient opened the email**.

<Accordion title="Sample Request Body">
  <Snippet file="email-opened-webhook.mdx" />
</Accordion>

### `email.clicked`

Occurs whenever the **recipient clicks on an email link**.

<Accordion title="Sample Request Body">
  <Snippet file="email-clicked-webhook.mdx" />
</Accordion>

### `email.failed`

Occurs whenever the **email failed to send due to an error**.

This event is triggered when there are issues such as invalid recipients, API key problems, domain verification issues, quota limits, or other sending failures.

<Accordion title="Sample Request Body">
  <Snippet file="email-failed-webhook.mdx" />
</Accordion>

### `contact.created`

Occurs whenever a **contact was successfully created**.

*Note: When importing multiple contacts using CSV, these events won't be triggered. [Contact support](https://resend.com/contact) if you have any questions.*

<Accordion title="Sample Request Body">
  <Snippet file="contact-created-webhook.mdx" />
</Accordion>

### `contact.updated`

Occurs whenever a **contact was successfully updated**.

<Accordion title="Sample Request Body">
  <Snippet file="contact-updated-webhook.mdx" />
</Accordion>

### `contact.deleted`

Occurs whenever a **contact was successfully deleted**.

<Accordion title="Sample Request Body">
  <Snippet file="contact-deleted-webhook.mdx" />
</Accordion>

### `domain.created`

Occurs when a **domain was successfully created**.

<Accordion title="Sample Request Body">
  <Snippet file="domain-created-webhook.mdx" />
</Accordion>

### `domain.updated`

Occurs when a **domain was successfully updated**.

<Accordion title="Sample Request Body">
  <Snippet file="domain-updated-webhook.mdx" />
</Accordion>

### `domain.deleted`

Occurs when a **domain was successfully deleted**.

<Accordion title="Sample Request Body">
  <Snippet file="domain-deleted-webhook.mdx" />
</Accordion>

# Verify Webhooks Requests

> Learn how to use the signing secret to verify your webhooks.

Webhook signing secrets are used to validate the payload data sent to your application from Resend. You can find the signing secret in the webhook detail page.

<img alt="Signing Secret" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/webhooks-secret-1.png" />

To verify the webhook request, you have to use the secret and deconstruct the Svix headers, and Base64-decode the Resend secret. The example below is for Javascript. [Learn more and view all supported languages here.](https://docs.svix.com/receiving/verifying-payloads/how)

First, install the Svix libaries.

<CodeGroup>
  ```sh npm
  npm install svix
  ```

  ```sh yarn
  yarn add svix
  ```
</CodeGroup>

Then, verify the webhooks using the code below. The payload is the raw (string) body of the request, and the headers are the headers passed in the request.

<Tip>
  Make sure that you're using the raw request body when verifying webhooks,
  since the crypotgraphic signature is sensitive to even the slightest change.
  Watch out for frameworks that parse the request as JSON and then stringify it,
  since this too will break the signature verification.
</Tip>

```js
import { Webhook } from 'svix';

const secret = process.env.WEBHOOK_SECRET;

// These were all sent from the server
const headers = {
  'svix-id': 'msg_p5jXN8AQM9LWM0D4loKWxJek',
  'svix-timestamp': '1614265330',
  'svix-signature': 'v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=',
};
const payload = '{"test": 2432232314}';

const wh = new Webhook(secret);
// Throws on error, returns the verified content on success
wh.verify(payload, headers);
```

If you prefer, you can also [manually verify the headers as well.](https://docs.svix.com/receiving/verifying-payloads/how-manual)

## Why should I verify webhooks?

Webhooks are vulnerable because attackers can send fake HTTP POST requests to endpoints, pretending to be legitimate services. This can lead to security risks or operational issues.

To mitigate this, each webhook and its metadata are signed with a unique key specific to the endpoint. This signature helps verify the source of the webhook, allowing only authenticated webhooks to be processed.

Another security concern is replay attacks, where intercepted valid payloads, complete with their signatures, are resent to endpoints. These payloads would pass the signature verification and be executed, posing a potential security threat.

# Managing Audiences

> Learn how to add, update, retrieve, and remove contacts that you send Broadcasts to.

Managing subscribers and unsubscribers is a critical part of any email implementation. It's important to respect your users' preferences and ensure that they're receiving the right emails at the right time.

Resend Audiences allow you to group and manage your [contacts](/dashboard/audiences/contacts) in a simple and intuitive way.

<img src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/audiences-intro-5.png" alt="Audience" class="extraWidth" />

## Send emails to your Audience

Audiences were designed to be used in conjunction with [Broadcasts](https://resend.com/broadcasts). You can send a Broadcast to an Audience from the Resend dashboard or from the Broadcast API.

### From Resend's no-code editor

You can send emails to your Audience by creating a new Broadcast and selecting the Audience you want to send it to.

![Send emails to your Audience](https://mintlify.s3.us-west-1.amazonaws.com/resend/images/audiences-intro-2.png)

You can include the Unsubscribe Footer in your Broadcasts, which will be automatically replaced with the correct link for each contact.

### From the Broadcast API

You can also use our [Broadcast API](/api-reference/broadcasts/create-broadcast) to create and send a Broadcast to your Audience.

### How to customize the unsubscribe link in my Broadcast?

Resend generates a unique link for each recipient and each Broadcast. You can use `{{{RESEND_UNSUBSCRIBE_URL}}}` as the link target.

![Unsubscribe Link](https://mintlify.s3.us-west-1.amazonaws.com/resend/images/audiences-intro-3.png)

## Automatic Unsubscribes

When you send emails to your Audience, Resend will automatically handle the unsubscribe flow for you.

If a contact unsubscribes from your emails, they will be skipped when sending a future Broadcast to this same audience.

![Automatic Unsubscribes](https://mintlify.s3.us-west-1.amazonaws.com/resend/images/audiences-intro-4.png)

Learn more about managing your unsubscribe list [here](https://resend.com/docs/dashboard/audiences/managing-unsubscribe-list).

# Managing Contacts

> How to manage and import contacts to your audiences.

Resend has [Audiences](/dashboard/audiences/introduction) made up of Contacts. You can send [Broadcasts](/dashboard/broadcasts/introduction) to your Audiences. When adding a Contact, you can assign it an email address and first and last name to personalize your Broadcast to them.

You can add your Contacts to an Audience in three different ways: via API, CSV upload, or manually.

## 1. Adding Contacts programmatically via API

You can add contacts to an Audience programmatically. For instance, after someone makes a purchase, you can add them to your "Paying Customers" audience. Resend's SDKs have support for the [contacts](/api-reference/contacts/create-contact) endpoint.

<CodeGroup>
  ```ts Node.js
  import { Resend } from 'resend';

  const resend = new Resend('re_xxxxxxxxx');

  resend.contacts.create({
  email: 'steve.wozniak@gmail.com',
  firstName: 'Steve',
  lastName: 'Wozniak',
  unsubscribed: false,
  audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
  });

  ```

  ```php PHP
  $resend = Resend::client('re_xxxxxxxxx');

  $resend->contacts->create(
    audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
    [
      'email' => 'steve.wozniak@gmail.com',
      'first_name' => 'Steve',
      'last_name' => 'Wozniak',
      'unsubscribed' => false
    ]
  );
  ```

  ```python Python
  import resend

  resend.api_key = "re_xxxxxxxxx"

  params: resend.Contacts.CreateParams = {
    "email": "steve.wozniak@gmail.com",
    "first_name": "Steve",
    "last_name": "Wozniak",
    "unsubscribed": False,
    "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  }

  resend.Contacts.create(params)
  ```

  ```ruby Ruby
  require "resend"

  Resend.api_key = "re_xxxxxxxxx"

  params = {
    "email": "steve.wozniak@gmail.com",
    "first_name": "Steve",
    "last_name": "Wozniak",
    "unsubscribed": false,
    "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  }

  Resend::Contacts.create(params)
  ```

  ```go Go
  import 	"github.com/resend/resend-go/v2"

  client := resend.NewClient("re_xxxxxxxxx")

  params := &resend.CreateContactRequest{
    Email:        "steve.wozniak@gmail.com",
    FirstName:    "Steve",
    LastName:     "Wozniak",
    Unsubscribed: false,
    AudienceId:   "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  }

  contact, err := client.Contacts.Create(params)
  ```

  ```rust Rust
  use resend_rs::{types::ContactData, Resend, Result};

  #[tokio::main]
  async fn main() -> Result<()> {
    let resend = Resend::new("re_xxxxxxxxx");

    let contact = ContactData::new("steve.wozniak@gmail.com")
      .with_first_name("Steve")
      .with_last_name("Wozniak")
      .with_unsubscribed(false);

    let _contact = resend
      .contacts
      .create("78261eea-8f8b-4381-83c6-79fa7120f1cf", contact)
      .await?;

    Ok(())
  }
  ```

  ```java Java
  import com.resend.*;

  public class Main {
      public static void main(String[] args) {
          Resend resend = new Resend("re_xxxxxxxxx");

          CreateContactOptions params = CreateContactOptions.builder()
                  .email("steve.wozniak@gmail.com")
                  .firstName("Steve")
                  .lastName("Wozniak")
                  .unsubscribed(false)
                  .audienceId("78261eea-8f8b-4381-83c6-79fa7120f1cf")
                  .build();

          CreateContactResponseSuccess data = resend.contacts().create(params);
      }
  }
  ```

  ```bash cURL
  curl -X POST 'https://api.resend.com/audiences/78261eea-8f8b-4381-83c6-79fa7120f1cf/contacts' \
       -H 'Authorization: Bearer re_xxxxxxxxx' \
       -H 'Content-Type: application/json' \
       -d $'{
    "email": "steve.wozniak@gmail.com",
    "first_name": "Steve",
    "last_name": "Wozniak",
    "unsubscribed": false
  }'
  ```
</CodeGroup>

## 2. Adding Contacts by uploading a .csv

<Steps>
  <Step title="Go to Audiences">
    Go to the [Audiences](https://resend.com/audiences) page, and select **Add Contacts**.

    ![Adding Contacts](https://mintlify.s3.us-west-1.amazonaws.com/resend/images/audiences-intro-6.png)
  </Step>

  <Step title="Select Import">
    Select **Import CSV**.
  </Step>

  <Step title="Upload CSV">
    Upload your CSV file from your computer.

    ![Adding Contacts](https://mintlify.s3.us-west-1.amazonaws.com/resend/images/audiences-intro-6.png)
  </Step>

  <Step title="Map Fields">
    After uploading your CSV file, you're able to map the fields you want to use. Currently, the supported mapping fields are `email`, `first_name`, `last_name`, and `unsubscribed`.

    <img src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/audiences-intro-1.png" alt="Import Contacts via CSV" class="extraWidth" />

    Finally, select **Continue**, review the contacts, and finish the upload.
  </Step>
</Steps>

## 3. Adding Contacts manually

<Steps>
  <Step title="Go to Audiences">
    Go to the [Audiences](https://resend.com/audiences) page, and select **Add Contacts**.

    ![Adding Contacts](https://mintlify.s3.us-west-1.amazonaws.com/resend/images/audiences-intro-6.png)
  </Step>

  <Step title="Choose Manual">
    Select **Add Manually**.
  </Step>

  <Step title="Add Contacts">
    You can then add either one, or multiple email addresses into the text field, separating multiple email addresses with commas.

    ![Adding Contacts Manually](https://mintlify.s3.us-west-1.amazonaws.com/resend/images/audiences-intro-7.png)
  </Step>
</Steps>

# Managing Unsubscribed Contacts

> Learn how to check and remove recipients who have unsubscribed to your marketing emails.

It's essential to update your contact list when someone unsubscribes to maintain a good sender reputation. This reduces the likelihood of your emails being marked as spam, and can also improve deliverability for any other marketing or transactional emails you send.

When a contact unsubscribes from your emails, Resend will automatically handle the unsubscribe flow for you, and they will be skipped when sending the next Broadcast to that same audience.

## Checking Unsubcribed Contacts

To see which contacts have unsubscribed, first navigate to the [Audiences page](https://resend.com/audiences). Then, select the Audience that you want to check.

Click on the **All Statuses** filter next to the search bar, then select **Unsubscribed**.

<img alt="Managing Unsubscribe List" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/manage-unsubscriptions-1.png" />

# Managing Broadcasts

> Send marketing emails efficiently without code.

Broadcasts allow you to send email blasts to your customers using a no-code editor on Resend, or from our [Broadcast API](/api-reference/broadcasts/create-broadcast).

You can use this to send email blasts such as:

* Newsletters
* Product Launches
* Investor Updates
* Promotions
* Changelogs

## Sending a Broadcast from Resend

Our Broadcasts feature was made to enable your entire team to send email campaigns without having to ask for help from developers.

### No-Code Editor

<video autoPlay muted loop playsinline className="w-full aspect-video" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/broadcasts-intro-1.mp4" />

### Markdown Support

You can also write your emails using Markdown. This works with headings, lists, italic, bold, links, and quotes.

You can easily copy and paste content from applications like Notion, Google Docs, iA Writter and many others maintaining formatting consistency.

<video autoPlay muted loop src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/broadcasts-intro-2.mp4" />

### Custom Styling

You can customize the look and feel of your email by changing **global styles** such as the background color, link color, and container size, allowing you to create emails aligned with your brand identity.

To do this, click on **Styles** at the top left of the Broadcast editor. You can edit specific images or lines of texts by selecting or highlighting them prior to clicking on **Styles**.

<video autoPlay muted loop playsinline className="w-full aspect-video" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/broadcasts-intro-3.mp4" />

You can also edit individual styles for each component, including the font size, font weight, and text alignment. You can also set custom properties for each component, such as image alt, button links, and social links,

<video autoPlay muted loop playsinline className="w-full aspect-video" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/broadcasts-intro-4.mp4" />

### Personalize your content

When creating broadcasts, you can include dynamic audience data to personalize the email content.

* `{{{FIRST_NAME|fallback}}}`
* `{{{LAST_NAME|fallback}}}`
* `{{{EMAIL}}}`
* `{{{RESEND_UNSUBSCRIBE_URL}}}`

When you include the `{{{RESEND_UNSUBSCRIBE_URL}}}` placeholder in the call, Resend includes an unsubscribe link in the email to automatically handle unsubscribe requests.

### Testing & Sending

Once you're finished writing your email, you can preview it in your personal inbox or send it to your team for feedback.

To do this, click on **Test Email** on the top right of your screen. Enter in the email address you'd like to send your email to, and then click on **Send Test Email** to complete.

Once you're ready to send your email to your Audience, click on **Send**, and slide to confirm.

<video autoPlay muted loop playsinline className="w-full aspect-video" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/broadcasts-intro-5.mp4" />

**Note**: Test emails do not include any custom Reply-To address that may have been configured. This behavior is limited to test mode and does not affect actual email sends.

## Sending a Broadcast from the Broadcast API

We also offer the option to send your Broadcasts from our [Broadcast API](/api-reference/broadcasts/create-broadcast).

The Broadcast API offers 6 endpoints for programmatically creating, updating, and sending broadcasts.

## Understand broadcast statuses

Here are all the statuses that can be associated with a broadcast:

* `draft` - The broadcast is a draft (note: if a broadcast is scheduled, it will be in the `draft` status until the scheduled time).
* `sent` - The broadcast was sent.
* `queued` - The broadcast is queued for delivery.

# Performance Tracking

> Track your Broadcasts email performance in real-time

Once your broadcast is sent, you can track its performance right away. The insights you can view are emails delivered, unsubscribed, click rate, and open rate.

You can view these insights by clicking on [Broadcast](https://resend.com/broadcasts) in the left column, and then clicking on the Broadcast that you want to view.

<video autoPlay muted loop playsinline className="w-full aspect-video" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/broadcasts-performance-tracking-1.mp4" />

Please note, at times, open rates can be inaccurate for a number of reasons due to the way inbox providers handle incoming emails. You can [read more about this here.](https://resend.com/docs/knowledge-base/why-are-my-open-rates-not-accurate)

# Managing Teams

> Manage your account across multiple teams

Resend allows multiple teams to be managed under a single email address. Each team is distinct, with its own API keys, billing, and usage.

## Inviting new members to a team

1. Navigate to your [**Team Settings**](https://resend.com/settings/team).
2. Click **Invite**. Input an email address and select a role (**Admin** or **Member**).
   * **Members** have access to manage emails, domains and webhooks.
   * **Admins** have all Member permissions plus the ability to invite users, update payments, and delete the team.
3. The new member will receive an email invitation to join the team.

## Add a team avatar

1. Navigate to your [**Team Settings**](https://resend.com/settings/team).
2. Click **Upload Image** next to the avatar placeholders.
3. Upload an image file to use as the team avatar.

<video autoPlay muted loop playsinline className="w-full aspect-video" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/team-avatars.mp4" />

## Switching between teams

After accepting an invite from the account owner, users can switch between teams:

1. Click on the **team name** in the top left corner of any Resend page.
2. A dropdown menu will appear, listing all the teams you belong to.
3. Select a team to switch between them.

![image](https://mintlify.s3.us-west-1.amazonaws.com/resend/images/teams-toggle.png)

## Change the team member roles

As an admin of your team, you can change the role of members in your team.

1. Navigate to your [**Team Settings**](https://resend.com/settings/team).
2. Find the user you want to change.
3. Select the more options button <span className="inline-block align-middle"><Icon icon="ellipsis" iconType="solid" /></span> and choose **Change role**.

<img alt="Change role popover visible for team member" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/how-can-i-change-team-roles-1.png" />

Upon confirmation, your team member will be given the new role.

## Leave your Resend team

If your team has another admin, you can leave your team by following these steps:

1. Navigate to your [**Team Settings**](https://resend.com/settings/team).
2. Under members, click on <span className="inline-block align-middle"><Icon icon="ellipsis" iconType="solid" /></span> next to your name for more options.
3. Select the **Leave Team** button.

Upon confirmation, you will leave your team.

# Examples

> Explore sample apps for different use cases.

<CardGroup>
  <Card title="Attachments" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-examples/tree/main/with-attachments">
    Send emails with attachments
  </Card>

  <Card title="NextAuth" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-examples/tree/main/with-nextauth">
    Send emails with NextAuth
  </Card>

  <Card title="React Email" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-examples/tree/main/with-react-email">
    Send emails with React Email
  </Card>

  <Card title="Webhooks" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-examples/tree/main/with-webhooks">
    A Slack app using Resend webhooks
  </Card>

  <Card title="Prevent thread on Gmail" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-examples/tree/main/with-prevent-thread-on-gmail">
    Prevent threading on Gmail
  </Card>

  <Card title="Unsubscribe url header" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-examples/tree/main/with-unsubscribe-url-header">
    Add a shortcut for users to unsubscribe
  </Card>
</CardGroup>

# Official SDKs

> Open source client libraries for your favorite platforms.

## Official SDKs

<CardGroup cols={2}>
  <Card title="Node.js" icon="github" href="https://github.com/resend/resend-node">
    github.com/resend/resend-node
  </Card>

  <Card title="PHP" icon="github" href="https://github.com/resend/resend-php">
    github.com/resend/resend-php
  </Card>

  <Card title="Laravel" icon="github" href="https://github.com/resend/resend-laravel">
    github.com/resend/resend-laravel
  </Card>

  <Card title="Python" icon="github" href="https://github.com/resend/resend-python">
    github.com/resend/resend-python
  </Card>

  <Card title="Ruby" icon="github" href="https://github.com/resend/resend-ruby">
    github.com/resend/resend-ruby
  </Card>

  <Card title="Go" icon="github" href="https://github.com/resend/resend-go">
    github.com/resend/resend-go
  </Card>

  <Card title="Java" icon="github" href="https://github.com/resend/resend-java">
    github.com/resend/resend-java
  </Card>

  <Card title="Rust" icon="github" href="https://github.com/resend/resend-rust">
    github.com/resend/resend-rust
  </Card>

  <Card title=".NET" icon="github" href="https://github.com/resend/resend-dotnet">
    github.com/resend/resend-dotnet
  </Card>
</CardGroup>

## Community SDKs

<CardGroup cols={2}>
  <Card title="Elixir" icon="github" href="https://github.com/elixir-saas/resend-elixir">
    github.com/elixir-saas/resend-elixir
  </Card>

  <Card title="NestJS" icon="github" href="https://github.com/jiangtaste/nestjs-resend">
    github.com/jiangtaste/nestjs-resend
  </Card>

  <Card title="Dart" icon="github" href="https://github.com/coderaveHQ/dart_resend">
    github.com/coderaveHQ/dart\_resend
  </Card>
</CardGroup>

## OpenAPI

<CardGroup cols={2}>
  <Card title="OpenAPI" icon="github" href="https://github.com/resend/resend-openapi">
    github.com/resend/resend-openapi
  </Card>
</CardGroup>

# Security

> An overview of Resend security features and practices.

## Governance

Resend establishes policies and controls, monitors compliance with those controls, and proves the security and compliance to third-party auditors.

Our policies are based on the following **foundational principles**:

<CardGroup cols={2}>
  <Card title="Least Privilege" icon="square-1">
    Access should be limited to only those with a legitimate business needs,
    based on the principle of least privilege.
  </Card>

  <Card title="Consistency" icon="square-2">
    Security controls should be applied consistently across all areas of the
    enterprise.
  </Card>

  <Card title="Defense in Depth" icon="square-3">
    Security controls should be implemented and layered according to the
    principle of defense-in-depth.
  </Card>

  <Card title="Continuous Improvement" icon="square-4">
    The implementation of controls should be iterative, continuously improving
    effectiveness and decreasing friction.
  </Card>
</CardGroup>

### Compliance Standards

<AccordionGroup>
  <Accordion title="SOC 2 Type II" icon="hourglass-clock">
    Resend is SOC 2 Type II compliant. The audit was completed by Vanta & Advantage Partners.
    You can download a copy of the report on the [Documents](https://resend.com/settings/documents) page.
  </Accordion>

  <Accordion title="GDPR" icon="hourglass-clock">
    Resend is GDPR compliant. You can learn more about our [GDPR compliance](https://resend.com/security/gdpr) or view our [DPA](https://resend.com/legal/dpa).
  </Accordion>
</AccordionGroup>

## Data Protection

<CardGroup cols={1}>
  <Card title="Data at rest" icon="server">
    All datastores are encrypted at rest. Sensitive collections and tables also
    use row-level encryption.
  </Card>

  <Card title="Data in transit" icon="network-wired">
    Resend uses TLS 1.3 or higher everywhere data is transmitted over
    potentially insecure networks.
  </Card>

  <Card title="Data backup" icon="database">
    Resend backs-up all production data using a point-in-time approach. Backups
    are persisted for 30 days, and are globally replicated for resiliency
    against regional disasters.
  </Card>
</CardGroup>

## Product Security

### Penetration testing

Resend engages with third-party firms to conduct penetration testing at least annually.

All areas of the Resend product and cloud infrastructure are in-scope for these assessments, and source code is fully available to the testers in order to maximize the effectiveness and coverage.

You can download the latest penetration test report on the [Documents](https://resend.com/settings/documents) page.

### Vulnerability scanning

Resend uses multiple vulnerability monitoring techniques including code-level scanning, dependency scanning, and security reviews to identify and remediate vulnerabilities.

Vulnerabilities are prioritized based on severity and risk, and are remediated according to the following schedule:

* Critical: 15 Days
* High: 30 Days
* Medium: 90 Day
* Low: 180 Days
* Informational: As needed

## Enterprise Security

<CardGroup cols={1}>
  <Card title="Endpoint protection" icon="computer">
    All company devices are equipped with anti-malware protection. Endpoint security alerts are monitored with 24/7/365 coverage. We use MDM software to enforce secure configuration of endpoints, such as disk encryption, screen lock configuration, and software updates.
  </Card>

  <Card title="Security education" icon="graduation-cap">
    Resend provides comprehensive security training to all employees upon onboarding and annually.

    Resend's conducts threat briefings with employees to inform them of important security and safety-related updates that require special attention or action.
  </Card>

  <Card title="Identity and access management" icon="id-badge">
    Resend employees are granted access to applications based on their role, and automatically deprovisioned upon termination of their employment. Further access must be approved according to the policies set for each application.

    Multi-factor authentication is required for all employees to access company applications.
  </Card>
</CardGroup>

## Responsible Disclosure

To report a vulnerability, please check the guidelines on the [Responsible Disclosure](https://resend.com/security/responsible-disclosure) page.

# Integrations

> Integrate Resend with the tools you already use.

## AI

<CardGroup>
  <Card
    title="Lovable"
    href="https://docs.lovable.dev/integrations/resend"
    icon={
    <svg
      className="h-6 w-6"
      viewBox="0 0 78 69"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M38.768 69C37.9927 69 37.2119 68.8597 36.4255 68.5791C35.6398 68.2993 34.9562 67.8684 34.3747 67.2869L28.7204 62.0831C21.096 55.0378 14.4033 48.2348 8.64237 41.6741C2.88079 35.1136 0 28.1383 0 20.7484C0 14.8451 1.98137 9.91108 5.94412 5.94627C9.90752 1.98209 14.8181 0 20.676 0C24.0146 0 27.2669 0.770147 30.4329 2.31044C33.599 3.85139 36.3774 6.24845 38.768 9.50161C41.3739 6.24845 44.1953 3.85139 47.232 2.31044C50.2688 0.770147 53.4785 0 56.8602 0C62.7179 0 67.6288 1.98209 71.5921 5.94627C75.555 9.91108 77.5361 14.8451 77.5361 20.7484C77.5361 28.1383 74.6611 35.119 68.9103 41.6906C63.1595 48.2624 56.4504 55.0708 48.783 62.1161L43.1614 67.2869C42.5799 67.8684 41.8964 68.2993 41.1106 68.5791C40.3244 68.8597 39.5435 69 38.768 69Z"
        fill="currentColor"
      />
    </svg>
  }
  >
    Tell the Lovable AI to send emails
  </Card>

  <Card
    title="Create"
    href="https://www.create.xyz/docs/integrations/resend"
    icon={
    <svg
      className="h-6 w-6"
      viewBox="0 0 41 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M29.65 0H11.402C5.106 0 0 5.099 0 11.389V29.61C0 35.901 5.106 41 11.403 41H29.65c6.298 0 11.404-5.099 11.404-11.389V11.39C41.053 5.099 35.947 0 29.649 0Z"
          fill="currentColor"
          fillOpacity="0"
        />
        <path
          d="M39.439 5H2v32.278h37.439V5Z"
          fill="currentColor"
          fillOpacity="0"
        />
        <g fill="currentColor">
          <path d="m36.015 24.943-2.008.877.042-.018c1.27-.953 1.972-1.487.297-2.813l-5.728-3.242-10.957-6.179L18.088 5s12.058 6.335 16.698 9.417c4.64 3.094 6.306 7.794 1.229 10.526Z" />
          <path d="m24.466 8.426-.51 8.692L12.5 22.283l-5.743-3.187c-1.686-1.314-.979-1.852.28-2.814l.033-.026-.178.078.072-.031 10.802-4.815 6.699-3.062Z" />
          <path d="m23.52 28.391-.094 2.091-.28 6.48-6.565-3.458c-3.622-1.956-7.845-4.295-10.196-5.838-4.661-3.053-6.367-7.75-1.302-10.515l1.81-.817.178-.078-.033.026c-1.259.962-1.966 1.5-.28 2.814l5.743 3.186 4.65 2.578 6.368 3.531Z" />
          <path d="m34.047 25.803-9.281 4.078-1.114.497-.228.104-6.846 3.021.572-8.642 11.468-5.113 5.732 3.239c1.674 1.325.967 1.865-.303 2.816Z" />
        </g>
      </g>
    </svg>
  }
  >
    Add email capabilities to your Create projects
  </Card>

  <Card
    title="Wildcard"
    href="https://github.com/wild-card-ai/agents-json/blob/master/examples/resend.ipynb"
    icon={
    <svg
      className="h-6 w-6"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs fill="currentColor" id="defs1" />
      <path
        d="m44,32l11.78,6.8-6,10.39-11.78-6.8v13.61h-12v-13.61l-11.78,6.8-6-10.39,11.78-6.8-11.78-6.8,6-10.39,11.78,6.8v-13.61h12v13.61l11.78-6.8,6,10.39-11.78,6.8Z"
        fill="currentColor"
      />
    </svg>
  }
  >
    Send natural language emails using Wildcard
  </Card>

  <Card
    title="mcp.run"
    href="https://www.mcp.run/nilslice/resend"
    icon={
    <svg
      className="h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 570 126"
    >
      <g>
        <g>
          <g>
            <rect class="cls-2" x="0" y="0" width="18" height="18" />
            <rect class="cls-2" y="18" width="18" height="18" />
            <rect class="cls-2" x="0" y="36" width="18" height="18" />
            <rect class="cls-2" x="0" y="54" width="18" height="18" />
            <rect class="cls-2" y="72" width="18" height="18" />
            <rect class="cls-2" x="36" y="0" width="18" height="18" />
            <rect class="cls-2" x="36" y="18" width="18" height="18" />
            <rect class="cls-2" x="36" y="36" width="18" height="18" />
            <rect class="cls-2" x="36" y="54" width="18" height="18" />
            <rect class="cls-2" x="36" y="72" width="18" height="18" />
            <rect class="cls-2" x="72" y="0" width="18" height="18" />
            <rect class="cls-2" x="72" y="18" width="18" height="18" />
            <rect class="cls-2" x="72" y="36" width="18" height="18" />
            <rect class="cls-2" x="72" y="54" width="18" height="18" />
            <rect class="cls-2" x="72" y="72" width="18" height="18" />
            <polygon class="cls-2" points="11.12 18 36 18 36 0 11.12 18" />
            <polygon class="cls-2" points="47.12 18 72 18 72 0 47.12 18" />
          </g>
          <g>
            <rect
              class="cls-2"
              x="126"
              y="0"
              width="18"
              height="18"
              transform="translate(126 144) rotate(-90)"
            />
            <rect
              class="cls-2"
              x="126"
              y="72"
              width="18"
              height="18"
              transform="translate(54 216) rotate(-90)"
            />
            <rect
              class="cls-2"
              x="144"
              y="0"
              width="18"
              height="18"
              transform="translate(144 162) rotate(-90)"
            />
            <rect
              class="cls-2"
              x="144"
              y="72"
              width="18"
              height="18"
              transform="translate(72 234) rotate(-90)"
            />
            <rect
              class="cls-2"
              x="162"
              y="0"
              width="18"
              height="18"
              transform="translate(162 180) rotate(-90)"
            />
            <rect
              class="cls-2"
              x="162"
              y="72"
              width="18"
              height="18"
              transform="translate(90 252) rotate(-90)"
            />
            <rect class="cls-2" x="99" y="18" width="18" height="18" />
            <rect class="cls-2" x="99" y="36" width="18" height="18" />
            <rect class="cls-2" x="99" y="54" width="18" height="18" />
            <polygon class="cls-2" points="99 18 126 18 126 0 99 18" />
            <polygon class="cls-2" points="99 72 126 72 126 90 99 72" />
          </g>
          <g>
            <rect
              class="cls-2"
              x="189"
              y="0"
              width="18"
              height="18"
              transform="translate(189 207) rotate(-90)"
            />
            <rect
              class="cls-2"
              x="207"
              y="0"
              width="18"
              height="18"
              transform="translate(207 225) rotate(-90)"
            />
            <rect
              class="cls-2"
              x="225"
              y="0"
              width="18"
              height="18"
              transform="translate(225 243) rotate(-90)"
            />
            <rect
              class="cls-2"
              x="189"
              y="72"
              width="18"
              height="18"
              transform="translate(117 279) rotate(-90)"
            />
            <rect
              class="cls-2"
              x="207"
              y="72"
              width="18"
              height="18"
              transform="translate(135 297) rotate(-90)"
            />
            <rect
              class="cls-2"
              x="225"
              y="72"
              width="18"
              height="18"
              transform="translate(153 315) rotate(-90)"
            />
            <rect class="cls-2" x="189" y="18" width="18" height="18" />
            <rect class="cls-2" x="189" y="36" width="18" height="18" />
            <rect class="cls-2" x="189" y="54" width="18" height="18" />
            <rect class="cls-2" x="189" y="90" width="18" height="18" />
            <rect class="cls-2" x="189" y="108" width="18" height="18" />
            <rect class="cls-2" x="252" y="18" width="18" height="18" />
            <rect class="cls-2" x="252" y="36" width="18" height="18" />
            <rect class="cls-2" x="252" y="54" width="18" height="18" />
            <polygon class="cls-2" points="270 18 243 18 243 0 270 18" />
            <polygon class="cls-2" points="270 72 243 72 243 90 270 72" />
          </g>
          <g>
            <rect class="cls-2" x="552" y="18" width="18" height="18" />
            <rect class="cls-2" x="552" y="36" width="18" height="18" />
            <rect class="cls-2" x="489" y="18" width="18" height="18" />
            <rect class="cls-2" x="489" y="36" width="18" height="18" />
            <rect
              class="cls-2"
              x="552"
              y="0"
              width="18"
              height="18"
              transform="translate(570 -552) rotate(90)"
            />
            <rect
              class="cls-2"
              x="529.5"
              y="-4.5"
              width="18"
              height="27"
              transform="translate(547.5 -529.5) rotate(90)"
            />
            <rect
              class="cls-2"
              x="552"
              y="54"
              width="18"
              height="18"
              transform="translate(624 -498) rotate(90)"
            />
            <rect
              class="cls-2"
              x="507"
              y="0"
              width="18"
              height="18"
              transform="translate(525 -507) rotate(90)"
            />
            <rect
              class="cls-2"
              x="489"
              y="54"
              width="18"
              height="18"
              transform="translate(561 -435) rotate(90)"
            />
            <rect
              class="cls-2"
              x="552"
              y="72"
              width="18"
              height="18"
              transform="translate(642 -480) rotate(90)"
            />
            <rect
              class="cls-2"
              x="489"
              y="72"
              width="18"
              height="18"
              transform="translate(579 -417) rotate(90)"
            />
            <polygon class="cls-2" points="516 18 489 18 489 0 516 18" />
          </g>
          <g>
            <polygon class="cls-2" points="399 72 426 72 426 90 399 72" />
            <rect
              class="cls-2"
              x="399"
              y="54"
              width="18"
              height="18"
              transform="translate(816 126) rotate(180)"
            />
            <rect
              class="cls-2"
              x="399"
              y="36"
              width="18"
              height="18"
              transform="translate(816 90) rotate(180)"
            />
            <rect
              class="cls-2"
              x="462"
              y="54"
              width="18"
              height="18"
              transform="translate(942 126) rotate(180)"
            />
            <rect
              class="cls-2"
              x="462"
              y="36"
              width="18"
              height="18"
              transform="translate(942 90) rotate(180)"
            />
            <polygon
              class="cls-2"
              points="435 72 435 90 417 81 417 72 435 72"
            />
            <rect
              class="cls-2"
              x="430.5"
              y="67.5"
              width="18"
              height="27"
              transform="translate(358.5 520.5) rotate(-90)"
            />
            <rect
              class="cls-2"
              x="399"
              y="18"
              width="18"
              height="18"
              transform="translate(381 435) rotate(-90)"
            />
            <polygon
              class="cls-2"
              points="462 72 462 81 444 90 444 72 462 72"
            />
            <rect
              class="cls-2"
              x="462"
              y="0"
              width="18"
              height="18"
              transform="translate(462 480) rotate(-90)"
            />
            <rect
              class="cls-2"
              x="399"
              width="18"
              height="18"
              transform="translate(399 417) rotate(-90)"
            />
            <rect
              class="cls-2"
              x="462"
              y="18"
              width="18"
              height="18"
              transform="translate(444 498) rotate(-90)"
            />
            <polygon class="cls-2" points="480 72 453 72 453 90 480 72" />
          </g>
          <g>
            <rect
              class="cls-2"
              x="336"
              y="0"
              width="18"
              height="18"
              transform="translate(336 354) rotate(-90)"
            />
            <rect
              class="cls-2"
              x="354"
              y="0"
              width="18"
              height="18"
              transform="translate(354 372) rotate(-90)"
            />
            <rect
              class="cls-2"
              x="372"
              y="0"
              width="18"
              height="18"
              transform="translate(372 390) rotate(-90)"
            />
            <rect
              class="cls-2"
              x="318"
              y="72"
              width="18"
              height="18"
              transform="translate(246 408) rotate(-90)"
            />
            <rect class="cls-2" x="318" y="18" width="18" height="18" />
            <rect class="cls-2" x="318" y="36" width="18" height="18" />
            <rect class="cls-2" x="318" y="54" width="18" height="18" />
            <polygon class="cls-2" points="345 18 318 18 318 0 345 18" />
          </g>
        </g>
        <rect
          class="cls-1"
          x="280.88"
          y="50.37"
          width="25.26"
          height="25.26"
          transform="translate(-6.32 77.77) rotate(-14.93)"
        />
      </g>
    </svg>
  }
  >
    Build email AI agents using mcp.run
  </Card>
</CardGroup>

## No-code

<CardGroup>
  <Card
    title="Zapier"
    href="https://zapier.com/apps/resend/integrations"
    icon={
    <svg className="h-6 w-6" width="68" height="68" viewBox="0 0 256 256">
      <title>Zapier</title>
      <g>
        <path
          d="M128.080089,-0.000183105 C135.311053,0.0131003068 142.422517,0.624138494 149.335663,1.77979593 L149.335663,1.77979593 L149.335663,76.2997796 L202.166953,23.6044907 C208.002065,27.7488446 213.460883,32.3582023 218.507811,37.3926715 C223.557281,42.4271407 228.192318,47.8867213 232.346817,53.7047992 L232.346817,53.7047992 L179.512985,106.400063 L254.227854,106.400063 C255.387249,113.29414 256,120.36111 256,127.587243 L256,127.587243 L256,127.759881 C256,134.986013 255.387249,142.066204 254.227854,148.960282 L254.227854,148.960282 L179.500273,148.960282 L232.346817,201.642324 C228.192318,207.460402 223.557281,212.919983 218.523066,217.954452 L218.523066,217.954452 L218.507811,217.954452 C213.460883,222.988921 208.002065,227.6115 202.182208,231.742607 L202.182208,231.742607 L149.335663,179.04709 L149.335663,253.5672 C142.435229,254.723036 135.323765,255.333244 128.092802,255.348499 L128.092802,255.348499 L127.907197,255.348499 C120.673691,255.333244 113.590195,254.723036 106.677048,253.5672 L106.677048,253.5672 L106.677048,179.04709 L53.8457596,231.742607 C42.1780766,223.466917 31.977435,213.278734 23.6658953,201.642324 L23.6658953,201.642324 L76.4997269,148.960282 L1.78485803,148.960282 C0.612750404,142.052729 0,134.946095 0,127.719963 L0,127.719963 L0,127.349037 C0.0121454869,125.473817 0.134939797,123.182933 0.311311815,120.812834 L0.36577283,120.099764 C0.887996182,113.428547 1.78485803,106.400063 1.78485803,106.400063 L1.78485803,106.400063 L76.4997269,106.400063 L23.6658953,53.7047992 C27.8076812,47.8867213 32.4300059,42.4403618 37.4769335,37.4193681 L37.4769335,37.4193681 L37.5023588,37.3926715 C42.5391163,32.3582023 48.0106469,27.7488446 53.8457596,23.6044907 L53.8457596,23.6044907 L106.677048,76.2997796 L106.677048,1.77979593 C113.590195,0.624138494 120.688946,0.0131003068 127.932622,-0.000183105 L127.932622,-0.000183105 L128.080089,-0.000183105 Z M128.067377,95.7600714 L127.945335,95.7600714 C118.436262,95.7600714 109.32891,97.5001809 100.910584,100.661566 C97.7553011,109.043534 96.0085811,118.129275 95.9958684,127.613685 L95.9958684,127.733184 C96.0085811,137.217594 97.7553011,146.303589 100.923296,154.685303 C109.32891,157.846943 118.436262,159.587052 127.945335,159.587052 L128.067377,159.587052 C137.576449,159.587052 146.683802,157.846943 155.089415,154.685303 C158.257411,146.290368 160.004131,137.217594 160.004131,127.733184 L160.004131,127.613685 C160.004131,118.129275 158.257411,109.043534 155.089415,100.661566 C146.683802,97.5001809 137.576449,95.7600714 128.067377,95.7600714 Z"
          fill="currentColor"
          fillRule="currentColor"
        />
      </g>
    </svg>
  }
  >
    Automate emails using Zapier
  </Card>

  <Card
    title="Pipedream"
    href="https://pipedream.com/apps/resend"
    icon={
    <svg
      className="h-6 w-6"
      width="78"
      height="78"
      viewBox="0 0 78 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Pipedream</title>
      <path
        d="M47.7519 30.1241C48.0541 31.7495 48.2068 33.8016 48.2068 36.2869C48.2068 39.0588 48.0096 41.316 47.6119 43.0587C47.2142 44.8013 46.667 46.1661 45.9671 47.1433C45.2672 48.1237 44.4273 48.7914 43.4475 49.1497C42.3892 49.5211 41.2764 49.7029 40.1579 49.6872C38.4304 49.6872 36.9861 49.3289 35.8185 48.6123C34.6509 47.8957 33.741 47.013 33.0888 45.9609V27.3294C33.881 26.2317 34.8959 25.3685 36.1334 24.7497C37.4558 24.1088 38.9051 23.7899 40.3679 23.8181C41.5671 23.7939 42.7618 23.9756 43.9024 24.3555C44.9024 24.7112 45.7623 25.3903 46.3521 26.2903C46.982 27.2219 47.4497 28.4988 47.7519 30.1241Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.61933 8.11214C0 11.2903 0 15.4506 0 23.7714V54.2286C0 62.5493 0 66.7097 1.61933 69.8879C3.04374 72.6834 5.31659 74.9563 8.11214 76.3807C11.2903 78 15.4506 78 23.7714 78H54.2286C62.5493 78 66.7097 78 69.8879 76.3807C72.6834 74.9563 74.9563 72.6834 76.3807 69.8879C78 66.7097 78 62.5493 78 54.2286V23.7714C78 15.4506 78 11.2903 76.3807 8.11214C74.9563 5.31659 72.6834 3.04374 69.8879 1.61933C66.7097 0 62.5493 0 54.2286 0H23.7714C15.4506 0 11.2903 0 8.11214 1.61933C5.31659 3.04374 3.04374 5.31659 1.61933 8.11214ZM58.2855 46.3192C59.0776 43.5017 59.4753 40.1793 59.4753 36.3585C59.4753 32.2023 59.1254 28.6909 58.4255 25.8246C57.7256 22.9582 56.6884 20.652 55.3109 18.9094C53.9333 17.1635 52.2408 15.8997 50.2366 15.1115C48.2291 14.3232 45.9194 13.9291 43.3075 13.9291C41.1569 13.9128 39.0217 14.3014 37.0083 15.0756C35.0995 15.8082 33.3425 16.9021 31.829 18.3003L29.7293 14.5024L22.1003 15.004V69.1786H33.0888V61.2244L32.9489 55.4199L33.1588 55.3483C34.5109 56.7326 36.0189 57.6642 37.6732 58.143C39.4174 58.6327 41.2191 58.8738 43.0275 58.8596C45.4995 58.8596 47.7519 58.4068 49.7816 57.4981C51.8113 56.5893 53.5388 55.205 54.9609 53.3418C56.383 51.4787 57.4901 49.1367 58.2855 46.3192Z"
        fill="currentColor"
      />
    </svg>
  }
  >
    Build workflows using Pipedream
  </Card>

  <Card
    title="Activepieces"
    href="https://www.activepieces.com/pieces/resend"
    icon={
    <svg
      className="h-6 w-6"
      width="56"
      height="50"
      viewBox="0 0 56 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Activepieces</title>
      <path
        d="M17.3113 15.3098C14.2791 10.8144 15.4653 4.7122 19.9607 1.68001C24.456 -1.35215 30.5583 -0.165992 33.5904 4.3294L54.0697 34.6911C57.1018 39.1864 55.9157 45.2887 51.4203 48.3209C46.9249 51.353 40.8227 50.1669 37.7905 45.6715L28.9117 32.5081C27.7703 31.0698 25.4468 31.2937 24.0517 32.6888C22.8948 33.8457 22.516 36.8053 22.1881 39.3679C22.14 39.7436 22.093 40.1108 22.0448 40.4625C21.8669 42.1398 21.2877 43.7992 20.2789 45.2948C16.9823 50.1823 10.346 51.4707 5.4586 48.1741C0.571158 44.8775 -0.720183 38.2418 2.57644 33.3544C4.28615 30.8197 6.89414 29.2529 9.69057 28.7918L9.68663 28.7878C17.7665 27.6159 19.2645 18.4973 17.7858 16.0133L17.3113 15.3098Z"
        fill="currentColor"
      />
    </svg>
  }
  >
    Build workflows using Activepieces
  </Card>

  <Card
    title="Swishjam"
    href="https://swishjam.com/integrations/resend"
    icon={
    <svg className="h-6 w-6" fill="none" viewBox="0 0 51 57">
      <title>Swishjam</title>
      <path
        d="M15.2077 22.8737L2.08203 30.4137V15.3789L15.2077 22.8737Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25.5029 43.7917L25.4286 55.4013L2 42.0282L12.1886 36.1895L25.5029 43.7917Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M48.999 30.4141V42.0293L25.4219 55.408L25.5019 43.7928L48.999 30.4141Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M49.002 30.4128L38.6877 36.2854L25.5049 43.7915L12.1906 36.1893L2.08203 30.4128L15.2077 22.8728V22.8672L25.5049 28.5L35.6992 22.8898L35.7335 22.9124L49.002 30.4128Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M48.7735 15.3787L25.5049 28.7517L2.08203 15.3787L25.3506 2L48.7735 15.3787Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  }
  >
    Send automated emails using Swishjam
  </Card>

  <Card
    title="Monkedo"
    href="https://monkedo.com/integrations/app/resend"
    icon={
<svg
      className="h-6 w-6"
      width="70"
      height="70"
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
    <title>Monkedo</title>
<path id="Selection"
      fill="currentColor"
      d="M 155.00,254.00
         C 130.11,254.00 106.02,248.09 83.00,238.80
           76.96,236.36 60.67,229.07 56.00,225.47
           45.10,217.07 46.03,210.07 40.79,205.42
           40.79,205.42 25.00,197.53 25.00,197.53
           16.15,192.04 10.40,182.12 8.46,172.00
           5.59,157.09 9.59,142.41 22.00,132.90
           31.50,125.62 34.73,127.48 38.30,122.87
           38.30,122.87 44.26,110.00 44.26,110.00
           47.64,103.06 52.39,95.99 57.26,90.00
           79.24,62.94 109.53,48.32 144.00,45.91
           144.00,45.91 156.00,45.01 156.00,45.01
           184.47,45.66 213.18,58.56 232.96,79.00
           232.96,79.00 254.04,105.77 254.04,105.77
           259.66,110.61 263.92,108.01 272.00,111.99
           284.97,118.39 291.62,132.07 292.68,146.00
           293.42,155.73 286.99,170.24 279.96,176.83
           279.96,176.83 267.70,186.21 267.70,186.21
           264.36,190.49 264.91,200.02 258.54,211.00
           255.42,216.37 250.59,222.69 246.00,226.83
           236.44,235.44 214.56,245.62 202.00,249.00
           206.82,243.15 212.17,239.55 215.47,232.00
           217.99,226.23 217.53,219.24 219.17,216.00
           221.75,210.93 228.79,207.78 233.01,201.00
           237.57,193.66 239.19,176.84 239.82,168.00
           240.11,163.85 238.61,155.08 237.41,151.00
           230.85,128.72 213.47,115.38 190.00,120.66
           183.84,122.05 177.23,124.84 172.00,128.36
           169.07,130.33 164.14,135.17 161.00,135.48
           157.70,135.79 148.45,130.39 145.00,128.78
           137.64,125.34 124.96,122.77 117.00,124.93
           97.13,130.30 82.56,154.01 83.01,174.00
           83.24,183.73 87.95,196.78 93.06,205.00
           96.24,210.10 101.12,215.87 106.00,219.37
           109.65,221.98 113.42,222.92 116.89,226.21
           122.67,231.69 120.74,236.83 130.00,244.79
           139.84,253.24 149.23,251.68 155.00,254.00 Z
         M 259.00,161.00
         C 256.67,161.61 254.41,162.04 253.02,164.27
           251.15,167.28 252.14,172.90 256.11,173.58
           260.96,174.41 267.84,168.49 270.61,165.00
           279.10,154.30 278.11,134.86 265.99,127.14
           258.29,122.24 243.87,123.88 245.98,132.00
           248.00,139.80 252.88,136.77 258.00,138.74
           263.60,140.89 269.57,149.89 268.43,156.00
           267.64,160.19 260.70,171.33 259.00,161.00 Z
         M 41.00,142.30
         C 32.91,143.88 29.22,146.35 25.74,154.00
           18.25,170.42 29.20,191.14 48.00,191.96
           62.66,192.60 64.03,182.57 65.28,171.00
           67.08,154.40 59.52,140.51 41.00,142.30 Z" />
</svg>
}
  >
    Automate emails using Monkedo
  </Card>

  <Card
    title="Make.com"
    href="https://www.make.com/en/integrations/resend"
    icon={
    <svg className="h-6 w-6" width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Make.com</title>
      <rect x="34" y="8" width="9" height="28" rx="0.75" fill="currentColor"/>
      <rect x="24.8215" y="8" width="9" height="28" rx="0.75" transform="rotate(12 24.8215 8)" fill="currentColor"/>
      <rect x="15.1452" y="8" width="9" height="28" rx="0.75" transform="rotate(28 15.1452 8)" fill="currentColor"/>
    </svg>
  }
  >
    Build workflows using Make.com
  </Card>

  <Card
    title="Lindy"
    href="https://www.lindy.ai/integrations/resend"
    icon={
    <svg className="h-6 w-6" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Lindy</title>
      <path d="M10.8029 1.11017L9.10941 2.81543C8.96353 2.96232 8.96353 3.20182 9.10941 3.35192L16.4382 10.7318C16.584 10.8787 16.584 11.1182 16.4382 11.2683L9.10941 18.6481C8.96353 18.795 8.96353 19.0345 9.10941 19.1846L10.8029 20.8899C10.9487 21.0367 11.1866 21.0367 11.3356 20.8899L20.8906 11.2683C21.0365 11.1214 21.0365 10.8819 20.8906 10.7318L11.3356 1.11017C11.1898 0.963276 10.9519 0.963276 10.8029 1.11017Z" fill="currentColor"/>
      <path d="M5.78281 10.2325L9.88188 6.33183C10.0349 6.18619 10.0349 5.94874 9.88188 5.79993L8.10517 4.10923C7.95213 3.96359 7.70259 3.96359 7.54621 4.10923L1.11479 10.2325C0.961738 10.3781 0.961738 10.6156 1.11479 10.7644L7.54954 16.8907C7.70259 17.0364 7.95213 17.0364 8.1085 16.8907L9.88521 15.2001C10.0383 15.0544 10.0383 14.817 9.88521 14.6681L5.78281 10.7644C5.62976 10.6187 5.62976 10.3813 5.78281 10.2325Z" fill="currentColor"/>
    </svg>
  }
  >
    Build workflows using Lindy
  </Card>

  <Card
    title="BuildShip"
    href="https://buildship.com/integrations/resend"
    icon={
    <svg className="h-6 w-6" width="106" height="149" viewBox="0 0 106 149" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M31.9923 104.997C19.6877 104.938 15.5862 101.925 9.58646 95.9192C-2.90892 83.4342 -3.22369 63.4663 8.87108 51.3752C14.6037 45.6447 22.4156 42.4644 30.6282 42.4939H41.1301V29.9992H41.1492C41.6929 13.3396 55.8003 -0.00195312 73.1317 -0.00195312C90.7874 -0.00195312 105.133 13.891 105.133 31.0036C105.133 48.126 90.7874 62.462 73.1126 62.462L61.1322 62.4915V84.9998H72.1301C89.2516 84.9998 103.13 99.326 103.13 117C103.13 134.664 89.2421 149 72.1301 149C55.991 149 42.5513 136.259 41.0824 119.983L41.1301 104.997C41.1301 104.997 35.0446 105.086 31.9923 104.997ZM31.315 62.4915L31.3245 62.5407C28.2818 62.4915 25.3917 63.6533 23.2741 65.7703C18.8674 70.1715 18.9914 77.4282 23.5317 81.9771C25.6969 84.1432 28.5298 85.0589 31.5534 85.118L41.1301 84.9998V62.4915H31.315ZM61.1322 31.0036V42.4939L73.1412 42.4743C79.5702 42.4743 84.7686 37.2263 84.7686 31.0036C84.7686 24.7808 79.5511 19.7198 73.1317 19.7198C66.7028 19.7198 61.1322 24.771 61.1322 31.0036ZM72.2064 105.056L61.1322 104.997V119.57C62.2673 124.759 66.7599 128.638 72.1301 128.638C78.3587 128.638 83.4045 123.429 83.4045 117C83.4045 110.57 78.435 105.056 72.2064 105.056Z" fill="currentColor"/>
  </svg>
  }
  >
    Build workflows using BuildShip
  </Card>

  <Card
    title="viaSocket"
    href="https://viasocket.com/integrations/resend"
    icon={
   <svg class="h-6 w-6" width="32" height="32" viewBox="128 128 300 300" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="Selection"
      fill="currentColor"
      d="M 397.00,409.89
         C 396.84,411.94 396.90,413.90 395.40,415.40
           390.55,420.26 375.32,413.65 371.33,409.67
           371.33,409.67 365.62,402.60 365.62,402.60
           363.57,400.98 361.47,401.05 359.00,401.00
           359.00,401.00 223.00,401.00 223.00,401.00
           223.00,401.00 192.00,401.00 192.00,401.00
           188.86,400.95 185.82,400.96 183.43,398.57
           180.64,395.78 181.01,391.62 181.00,388.00
           181.00,388.00 181.00,228.00 181.00,228.00
           181.00,228.00 181.00,194.00 181.00,194.00
           181.01,190.74 180.71,186.98 182.74,184.21
           185.93,179.87 191.19,180.01 196.00,180.00
           196.00,180.00 365.00,180.00 365.00,180.00
           365.00,180.00 401.00,180.00 401.00,180.00
           405.00,180.01 409.52,179.73 412.77,182.51
           416.37,185.58 415.99,189.73 416.00,194.00
           416.00,194.00 416.00,321.00 416.00,321.00
           415.99,324.19 416.29,328.09 414.26,330.77
           411.04,335.05 403.46,335.27 400.17,328.98
           398.79,326.34 399.00,322.91 399.00,320.00
           399.00,320.00 399.00,198.00 399.00,198.00
           399.00,198.00 198.00,198.00 198.00,198.00
           198.00,198.00 198.00,384.00 198.00,384.00
           198.00,384.00 305.00,384.00 305.00,384.00
           305.00,384.00 359.00,384.00 359.00,384.00
           361.50,383.95 363.55,384.02 365.63,382.40
           365.63,382.40 372.04,375.10 372.04,375.10
           376.12,371.22 390.25,364.74 395.26,369.74
           396.75,371.22 396.77,373.08 397.00,375.00
           400.73,375.00 412.11,374.58 414.96,375.74
           417.36,376.72 419.67,379.06 418.60,381.86
           416.77,386.64 401.53,385.00 397.00,385.00
           397.00,385.00 397.00,400.07 397.00,400.07
           397.00,400.07 413.98,400.07 413.98,400.07
           416.60,400.56 419.14,401.97 419.14,404.98
           419.14,407.91 416.51,409.30 413.98,409.89
           413.98,409.89 397.00,409.89 397.00,409.89 Z
         M 257.00,236.56
         C 278.40,236.00 275.68,266.44 257.00,264.15
           242.05,262.32 238.93,240.39 257.00,236.56 Z
         M 340.00,236.64
         C 359.92,236.95 358.53,262.96 342.00,264.36
           331.15,265.28 323.80,253.49 328.69,244.02
           331.22,239.09 334.83,237.55 340.00,236.64 Z
         M 270.04,311.74
         C 276.05,310.26 295.44,313.01 304.00,313.00
           304.00,313.00 329.00,311.43 329.00,311.43
           337.08,313.66 338.57,325.00 329.00,328.86
           324.67,330.60 318.61,330.71 314.00,331.17
           302.01,332.37 285.79,331.96 274.00,329.54
           263.08,327.29 262.18,316.32 270.04,311.74 Z
         M 387.00,379.00
         C 373.52,380.44 371.64,393.77 376.72,400.90
           379.24,404.42 383.12,405.64 387.00,407.00
           387.00,407.00 387.00,379.00 387.00,379.00 Z" />
</svg>

  }
  >
    Build automations using viaSocket
  </Card>
</CardGroup>

## Notifications

<CardGroup>
  <Card
    title="Courier"
    href="https://www.courier.com/docs/guides/providers/email/resend/"
    icon={
    <svg
      className="h-6 w-6"
      width="68"
      height="68"
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Courier</title>
      <path
        d="M63.5245 30.6744C63.6695 30.4568 63.7421 30.1668 63.7421 29.9492C61.1315 14.8658 47.9335 3.40823 32.125 3.40823C14.3585 3.40823 -0.0722441 17.9115 0.00027211 35.7505C0.145305 53.0819 14.7211 67.5851 31.9799 67.5851C46.7007 67.6576 59.101 57.7954 62.9444 44.3799C63.0894 43.9448 62.7993 43.4372 62.3642 43.2197L61.059 42.712C55.9103 40.8991 50.1815 41.5518 45.613 44.525C43.51 45.9028 41.9872 46.9905 41.9872 46.9905C39.3766 48.7309 36.1859 49.8186 32.8501 49.8186C23.7856 49.8186 17.4767 42.422 16.4615 33.43L15.7363 28.4989C15.5188 26.976 14.5035 25.7432 13.0532 25.1631L11.2403 24.4379C10.9502 24.2929 10.8052 23.9303 11.0228 23.6403C18.782 13.2705 28.2816 15.5185 28.2816 15.5185C29.9495 15.6635 31.3998 16.3161 32.5601 17.1138C34.2279 18.2741 35.5332 19.942 36.3309 21.8274C39.2316 28.4989 45.9031 33.2124 53.6623 33.2124C53.6623 33.2124 61.059 33.5025 63.5245 30.6744Z"
        fill="currentColor"
      />
      <path
        d="M19.7247 22.9151C20.766 22.9151 21.6101 22.071 21.6101 21.0297C21.6101 19.9884 20.766 19.1443 19.7247 19.1443C18.6834 19.1443 17.8393 19.9884 17.8393 21.0297C17.8393 22.071 18.6834 22.9151 19.7247 22.9151Z"
        fill="currentColor"
      />
      <path
        d="M20.0873 32.7048C20.5224 35.6054 22.8429 44.8875 33.1402 46.5554C33.2852 46.5554 33.3578 46.3379 33.2127 46.2653C30.8197 45.1776 24.5833 41.5518 20.3773 32.5598C20.3048 32.4872 20.0873 32.5598 20.0873 32.7048Z"
        fill="currentColor"
      />
    </svg>
  }
  >
    Trigger messages using Courier
  </Card>

  <Card
    title="Novu"
    href="https://docs.novu.co/platform/integrations/email/resend"
    icon={
    <svg
      viewBox="0 0 102 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-6"
    >
      <title>Novu</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.64 12.826c0 .86-1.044 1.286-1.646.671L10.676.907A15.974 15.974 0 0 1 16 0c3.183 0 6.148.93 8.64 2.531v10.295Zm4.48-5.986v5.986c0 4.875-5.919 7.289-9.328 3.804L6.545 3.091C2.576 6.003 0 10.701 0 16c0 3.407 1.065 6.565 2.88 9.16v-5.954c0-4.875 5.919-7.289 9.328-3.804l13.229 13.52C29.416 26.012 32 21.308 32 16c0-3.407-1.065-6.565-2.88-9.16ZM9.006 18.535 21.301 31.1C19.642 31.683 17.858 32 16 32c-3.182 0-6.148-.93-8.64-2.531V19.206c0-.86 1.045-1.286 1.646-.671Z"
        fill="currentColor"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.64 12.826c0 .86-1.044 1.286-1.646.671L10.676.907A15.974 15.974 0 0 1 16 0c3.183 0 6.148.93 8.64 2.531v10.295Zm4.48-5.986v5.986c0 4.875-5.919 7.289-9.328 3.804L6.545 3.091C2.576 6.003 0 10.701 0 16c0 3.407 1.065 6.565 2.88 9.16v-5.954c0-4.875 5.919-7.289 9.328-3.804l13.229 13.52C29.416 26.012 32 21.308 32 16c0-3.407-1.065-6.565-2.88-9.16ZM9.006 18.535 21.301 31.1C19.642 31.683 17.858 32 16 32c-3.182 0-6.148-.93-8.64-2.531V19.206c0-.86 1.045-1.286 1.646-.671Z"
        fill="currentColor"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.64 12.826c0 .86-1.044 1.286-1.646.671L10.676.907A15.974 15.974 0 0 1 16 0c3.183 0 6.148.93 8.64 2.531v10.295Zm4.48-5.986v5.986c0 4.875-5.919 7.289-9.328 3.804L6.545 3.091C2.576 6.003 0 10.701 0 16c0 3.407 1.065 6.565 2.88 9.16v-5.954c0-4.875 5.919-7.289 9.328-3.804l13.229 13.52C29.416 26.012 32 21.308 32 16c0-3.407-1.065-6.565-2.88-9.16ZM9.006 18.535 21.301 31.1C19.642 31.683 17.858 32 16 32c-3.182 0-6.148-.93-8.64-2.531V19.206c0-.86 1.045-1.286 1.646-.671Z"
        fill="currentColor"
      ></path>
    </svg>
  }
  >
    Send notifications using Novu
  </Card>

  <Card
    title="Knock"
    href="https://docs.knock.app/integrations/email/resend"
    icon={
    <svg
      className="h-6 w-6"
      width="14"
      height="20"
      viewBox="0 0 14 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Knock</title>
      <path
        d="M0 20V0.075058H4.19706V11.5013H4.31447L8.92243 5.90189H13.6184L8.51153 11.7003L14 20H9.33333L6.04612 14.5142L4.19706 16.5323V20H0Z"
        fill="currentColor"
      />
      <path
        d="M13.6748 2.45476C13.6748 3.81049 12.5399 4.90953 11.14 4.90953C9.74009 4.90953 8.60522 3.81049 8.60522 2.45476C8.60522 1.09904 9.74009 0 11.14 0C12.5399 0 13.6748 1.09904 13.6748 2.45476Z"
        fill="currentColor"
      />
    </svg>
  }
  >
    Send notifications using Knock
  </Card>

  <Card
    title="Engagespot"
    href="https://docs.engagespot.co/docs/features/channels/email/resend/"
    icon={
    <svg className="h-6 w-6" fill="none" viewBox="0 0 38 35">
      <title>Engagespot</title>
      <g clipPath="url(#clip0_1_2)">
        <mask
          id="mask0_1_2"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="38"
          height="35"
        >
          <path d="M38 0H0V35H38V0Z" fill="currentColor" />
        </mask>
        <g mask="url(#mask0_1_2)">
          <mask
            id="mask1_1_2"
            style={{ maskType: 'alpha' }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="39"
            height="35"
          >
            <path
              d="M36.9851 6.29843L28.4354 0.606125C27.3381 -0.131766 25.9208 -0.131766 24.8235 0.606125L19.2456 4.29559L19.1541 4.24287H19.1084L13.5762 0.553417C12.4789 -0.184472 11.0616 -0.184472 9.96426 0.553417L1.4145 6.24571C0.68297 6.72008 0.271484 7.61608 0.271484 8.56481V19.3696C0.271484 21.2144 1.14018 22.901 2.51179 23.797L19.1541 34.8127L35.8423 23.797C37.2137 22.901 38.0826 21.1616 38.0826 19.3169V8.56481C38.1283 7.61608 37.7168 6.77278 36.9851 6.29843Z"
              fill="currentColor"
            />
          </mask>
          <g mask="url(#mask1_1_2)">
            <path
              d="M12.7274 34.8008L-1.21742 26.2624L-1.62891 7.9206L11.8587 -1.88281L25.8035 6.65565L26.215 24.9975L12.7274 34.8008Z"
              fill="currentColor"
            />
            <path
              d="M27.5262 35.5996L13.6271 27.114L13.1699 8.77214L26.7033 -1.03125L40.6481 7.50719L41.0596 25.7963L27.5262 35.5996Z"
              fill="#B22977"
            />
            <path
              d="M19.9286 40.9787L6.02947 32.493L5.57228 14.151L19.1056 4.34766L29.5877 11.8891V31.0365L19.9286 40.9787Z"
              fill="currentColor"
            />
            <path
              opacity="0.36"
              d="M40.5925 21.2415L18.3265 37.2642L17.915 18.9751L41.0904 4.96094L40.5925 21.2415Z"
              fill="currentColor"
            />
            <path
              d="M-3.61505 22.8555L19.291 36.77L18.8795 18.4809L-4.07227 4.56641L-3.61505 22.8555Z"
              fill="currentColor"
            />
          </g>
          <mask
            id="mask2_1_2"
            style={{ maskType: 'alpha' }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="39"
            height="35"
          >
            <path
              d="M36.9851 6.29843L28.4354 0.606125C27.3381 -0.131766 25.9208 -0.131766 24.8235 0.606125L19.2456 4.29559L19.1541 4.24287H19.1084L13.5762 0.553417C12.4789 -0.184472 11.0616 -0.184472 9.96426 0.553417L1.4145 6.24571C0.68297 6.72008 0.271484 7.61608 0.271484 8.56481V19.3696C0.271484 21.2144 1.14018 22.901 2.51179 23.797L19.1541 34.8127L35.8423 23.797C37.2137 22.901 38.0826 21.1616 38.0826 19.3169V8.56481C38.1283 7.61608 37.7168 6.77278 36.9851 6.29843Z"
              fill="currentColor"
            />
          </mask>
          <g mask="url(#mask2_1_2)">
            <path
              d="M12.7274 34.8008L-1.21742 26.2624L-1.62891 7.9206L11.8587 -1.88281L25.8035 6.65565L26.215 24.9975L12.7274 34.8008Z"
              fill="currentColor"
            />
            <path
              d="M27.5262 35.5996L13.6271 27.114L13.1699 8.77214L26.7033 -1.03125L40.6481 7.50719L41.0596 25.7963L27.5262 35.5996Z"
              fill="currentColor"
            />
            <path
              d="M19.9286 40.9787L6.02947 32.493L5.57228 14.151L19.1056 4.34766L29.5877 11.8891V31.0365L19.9286 40.9787Z"
              fill="currentColor"
            />
            <path
              d="M40.5925 21.2415L18.3265 37.2642L17.915 18.9751L41.0904 4.96094L40.5925 21.2415Z"
              fill="currentColor"
            />
            <path
              d="M-3.61505 22.8555L19.291 36.77L18.8795 18.4809L-4.07227 4.56641L-3.61505 22.8555Z"
              fill="currentColor"
            />
          </g>
        </g>
      </g>
      <defs>
        <clipPath id="clip0_1_2">
          <rect width="38" height="35" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  }
  >
    Send notifications using Engagespot
  </Card>

  <Card
    title="Dittofeed"
    href="https://docs.dittofeed.com/integrations/channels/resend"
    icon={
    <svg className="h-6 w-6" viewBox="0 0 40 38" fill="none">
      <title>Dittofeed</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.5907 33.1617C27.229 27.0472 24.4917 21.0012 19.4767 19.6575C14.4617 18.3138 9.06812 22.1811 7.42981 28.2953C5.93843 33.8613 9.318 34.724 13.7192 35.8477C14.1529 35.9585 14.5965 36.0716 15.0463 36.1922C15.4961 36.3127 15.9369 36.4365 16.3678 36.5574C20.7411 37.785 24.0994 38.7274 25.5907 33.1617ZM21.5024 30.5195C22.3244 27.4521 20.9385 24.4156 18.4071 23.7373C15.8756 23.059 13.1571 24.9957 12.3352 28.0633C11.5627 30.946 13.3777 31.4228 15.7003 32.0329C15.8491 32.0718 15.9999 32.1114 16.1522 32.1522C16.3046 32.1931 16.455 32.2342 16.6034 32.2748C18.9198 32.9078 20.73 33.4025 21.5024 30.5195ZM13.8755 4.33377C12.2371 10.4481 14.9745 16.494 19.9895 17.8378C25.0046 19.1816 30.3982 15.3143 32.0365 9.19999C33.5278 3.63409 30.1482 2.77127 25.7471 1.64761C25.3133 1.53691 24.8699 1.42365 24.42 1.30314C23.9702 1.1826 23.5293 1.05888 23.0985 0.937938C18.7251 -0.289572 15.3669 -1.23214 13.8755 4.33377ZM17.9636 6.97574C17.1416 10.0433 18.5275 13.0798 21.059 13.7582C23.5905 14.4365 26.309 12.4996 27.1308 9.4321C27.9032 6.54919 26.0883 6.07253 23.7657 5.46254C23.617 5.42348 23.4662 5.38387 23.3137 5.34303C23.1614 5.30222 23.011 5.26111 22.8626 5.22057C20.5462 4.58752 18.7361 4.09283 17.9636 6.97574ZM2.51398 23.1191C6.37268 24.1531 10.5065 21.2378 11.7471 16.6078C12.9878 11.9777 10.8654 7.38613 7.00667 6.35219C3.49407 5.41099 2.68583 8.52804 1.63326 12.5874C1.52956 12.9874 1.42348 13.3965 1.31219 13.8118C1.20091 14.227 1.08823 14.6344 0.97806 15.0326C-0.140057 19.0744 -0.998623 22.1779 2.51398 23.1191ZM4.85546 18.5831C6.47756 19.0177 8.22079 17.7718 8.74908 15.8001C9.27738 13.8285 8.39069 11.8778 6.76859 11.4432C5.24412 11.0347 4.87063 12.4477 4.39264 14.2559C4.36203 14.3717 4.33099 14.4891 4.2992 14.6078C4.26742 14.7265 4.23559 14.8437 4.20419 14.9592C3.71403 16.7642 3.33099 18.1746 4.85546 18.5831ZM36.9296 14.3759C33.0707 13.3419 28.937 16.2572 27.6964 20.8872C26.4558 25.5174 28.5781 30.1088 32.4367 31.1428C35.9494 32.084 36.7576 28.967 37.8102 24.9078C37.9139 24.5078 38.02 24.0986 38.1313 23.6834C38.2425 23.268 38.3552 22.8607 38.4654 22.4624C39.5835 18.4206 40.4421 15.3171 36.9296 14.3759ZM34.5879 18.912C32.9659 18.4773 31.2226 19.7233 30.6945 21.6949C30.1661 23.6665 31.0528 25.6173 32.6748 26.0519C34.1993 26.4603 34.5728 25.0474 35.0508 23.2391C35.0814 23.1234 35.1124 23.0059 35.1443 22.8872C35.176 22.7685 35.2078 22.6515 35.2393 22.5358C35.7293 20.7309 36.1124 19.3204 34.5879 18.912Z"
        fill="currentColor"
      />
    </svg>
  }
  >
    Send automated emails using Dittofeed
  </Card>

  <Card
    title="Suprsend"
    href="https://docs.suprsend.com/docs/resend"
    icon={
    <svg className="h-6 w-6"  width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Suprsend</title>
      <path d="M26.5777 4.65928L19.5223 8.79046L19.5364 0.585938L26.5777 4.65928Z" fill="currentColor"/>
      <path d="M19.5222 8.79164L12.2794 12.6862L12.478 4.58008L19.5222 8.79164Z" fill="currentColor"/>
      <path d="M12.3217 12.6661L5.19641 16.614L5.39497 8.50781L12.3217 12.6661Z" fill="currentColor"/>
      <path d="M5.19037 16.6146L12.3024 20.8912L12.3149 12.6621L5.19037 16.6146Z" fill="currentColor"/>
      <path d="M19.5233 8.79147L12.48 4.5799L19.538 0.587891L19.5233 8.79147Z" fill="currentColor"/>
      <path d="M12.3187 12.668L5.39081 8.51372L12.4814 4.58008L12.3187 12.668Z" fill="currentColor"/>
      <path d="M5.31079 27.7316L12.3206 23.5234L12.3962 31.7277L5.31079 27.7316Z" fill="currentColor"/>
      <path d="M12.3195 23.5263L19.5191 19.5527L19.4092 27.6606L12.3195 23.5263Z" fill="currentColor"/>
      <path d="M19.4817 19.5724L26.5634 15.5469L26.4535 23.6546L19.4817 19.5724Z" fill="currentColor"/>
      <path d="M26.5614 15.5442L19.4031 11.3457L19.4805 19.5745L26.5614 15.5442Z" fill="currentColor"/>
      <path d="M12.3188 23.5254L19.4077 27.6596L12.3939 31.7286L12.3188 23.5254Z" fill="currentColor"/>
      <path d="M19.4808 19.5703L26.4537 23.6486L19.4067 27.6596L19.4808 19.5703Z" fill="currentColor"/>
    </svg>
  }
  >
    Send notifications using Suprsend
  </Card>
</CardGroup>

## Developer tools

<CardGroup>
  <Card
    title="Inngest"
    href="https://www.inngest.com/docs/guides/resend-webhook-events"
    icon={
    <svg className="h-6 w-6" fill="none" viewBox="0 0 270 270">
      <title>Inngest</title>
      <mask
        id="mask0_680_113"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="21"
        y="2"
        width="228"
        height="265"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M145.841 5.0459L238.431 60.6531C244.777 64.506 248.73 71.3788 248.626 78.8764V189.987C248.626 197.484 244.777 204.357 238.327 208.21L145.737 263.817C141.783 266.421 133.669 269.44 123.89 263.817L31.2994 208.21C24.9533 204.357 21 197.484 21 189.987V78.8764C21 71.3788 24.8492 64.506 31.2994 60.6531L123.994 5.0459C130.756 0.9847 139.078 0.9847 145.841 5.0459ZM77.9258 134.5C67.446 134.5 58.9504 142.996 58.9504 153.475C58.9504 163.955 67.446 172.451 77.9258 172.451C82.9583 172.451 87.7848 170.452 91.3433 166.893C94.9019 163.334 96.9011 158.508 96.9011 153.475C96.9011 142.996 88.4055 134.5 77.9258 134.5ZM134.852 115.525C124.372 115.525 115.876 124.02 115.876 134.5C115.876 144.98 124.372 153.475 134.852 153.475C139.884 153.475 144.711 151.476 148.269 147.918C151.828 144.359 153.827 139.533 153.827 134.5C153.827 124.02 145.331 115.525 134.852 115.525ZM191.778 96.5494C181.298 96.5494 172.802 105.045 172.802 115.525C172.802 126.005 181.298 134.5 191.778 134.5C196.81 134.5 201.637 132.501 205.195 128.942C208.754 125.384 210.753 120.557 210.753 115.525C210.753 105.045 202.257 96.5494 191.778 96.5494Z"
          fill="currentColor"
        />
      </mask>
      <g mask="url(#mask0_680_113)">
        <rect x="21" y="2" width="227.704" height="265" fill="currentColor" />
      </g>
    </svg>
  }
  >
    Send drip campaigns using Inngest
  </Card>

  <Card
    title="Upstash"
    href="https://upstash.com/docs/qstash/integrations/resend"
    icon={
    <svg
      className="h-6 w-6"
      width="354"
      height="472"
      viewBox="0 0 354 472"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Upstash</title>
      <path
        d="M0.421875 412.975C78.5269 491.079 205.16 491.079 283.265 412.975C361.369 334.87 361.369 208.237 283.265 130.132L247.909 165.487C306.488 224.066 306.488 319.041 247.909 377.619C189.331 436.198 94.3559 436.198 35.7769 377.619L0.421875 412.975Z"
        fill="currentColor"
      />
      <path
        d="M71.1328 342.264C110.185 381.316 173.501 381.316 212.554 342.264C251.606 303.212 251.606 239.895 212.554 200.843L177.199 236.198C196.725 255.724 196.725 287.382 177.199 306.909C157.672 326.435 126.014 326.435 106.488 306.909L71.1328 342.264Z"
        fill="currentColor"
      />
      <path
        d="M353.974 59.4209C275.869 -18.6836 149.236 -18.6836 71.1315 59.4209C-6.97352 137.526 -6.97352 264.159 71.1315 342.264L106.486 306.909C47.9085 248.33 47.9085 153.355 106.486 94.7769C165.065 36.1979 260.04 36.1979 318.618 94.7769L353.974 59.4209Z"
        fill="currentColor"
      />
      <path
        d="M283.264 130.132C244.212 91.08 180.894 91.08 141.842 130.132C102.789 169.185 102.789 232.501 141.842 271.553L177.197 236.198C157.671 216.672 157.671 185.014 177.197 165.487C196.723 145.961 228.381 145.961 247.908 165.487L283.264 130.132Z"
        fill="currentColor"
      />
    </svg>
  }
  >
    Send emails using Upstash
  </Card>

  <Card
    title="Trigger.dev"
    href="https://trigger.dev/docs/guides/examples/resend-email-sequence"
    icon={
    <svg
      className="h-6 w-6"
      width="199"
      height="174"
      viewBox="0 0 199 174"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Trigger.dev</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M59.3512 70.3883L99.5 0.849602L199 173.191H0L40.1488 103.65L68.5493 120.048L56.8032 140.394H142.197L99.5 66.4424L87.7539 86.7881L59.3512 70.3883Z"
        fill="currentColor"
      />
    </svg>
  }
  >
    Send drip campaigns using Trigger.dev
  </Card>

  <Card
    title="Infisical"
    href="https://infisical.com/docs/self-hosting/configuration/envars#resend"
    icon={
    <svg
      className="h-6 w-6"
      width="91"
      height="43"
      viewBox="0 0 91 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Infisical</title>
      <path
        d="M21.9734 0C24.8526 0 27.4793 0.412021 29.8535 1.23606C32.2528 2.06011 34.4123 3.13386 36.3318 4.45732C38.2766 5.75581 39.9814 7.10424 41.4463 8.50261C42.2545 9.25174 42.987 9.98839 43.6436 10.7125C44.3003 11.4367 44.9317 12.1609 45.5379 12.885C46.0935 12.1609 46.6618 11.4617 47.2427 10.7875C47.8489 10.0883 48.6066 9.32665 49.5158 8.50261C51.7132 6.38008 54.4409 4.43235 57.699 2.65941C60.9824 0.886471 64.7835 0 69.1024 0C73.1435 0 76.8183 0.97387 80.127 2.92161C83.4609 4.84437 86.1002 7.42886 88.045 10.6751C90.015 13.9213 91 17.5171 91 21.4625C91 24.4591 90.4317 27.2683 89.2952 29.8902C88.1586 32.4872 86.5927 34.7721 84.5974 36.7448C82.6021 38.6925 80.2785 40.2282 77.6266 41.3519C74.9746 42.4506 72.1332 43 69.1024 43C66.2231 43 63.5712 42.6005 61.1465 41.8014C58.7472 40.9774 56.5751 39.9286 54.6303 38.6551C52.7108 37.3815 51.0186 36.0706 49.5537 34.7221C48.7202 33.8981 47.9752 33.124 47.3185 32.3998C46.6871 31.6507 46.0935 30.9141 45.5379 30.1899C44.9065 30.9141 44.2624 31.6507 43.6057 32.3998C42.9491 33.149 42.2166 33.9231 41.4084 34.7221C39.9688 36.0706 38.2766 37.3815 36.3318 38.6551C34.4123 39.9036 32.2528 40.9399 29.8535 41.7639C27.4793 42.588 24.8526 43 21.9734 43C17.8818 43 14.1817 42.0386 10.873 40.1159C7.56439 38.1931 4.92506 35.6086 2.95504 32.3624C0.985013 29.0912 0 25.4579 0 21.4625C0 18.491 0.555648 15.7192 1.66694 13.1472C2.8035 10.5502 4.36941 8.26539 6.3647 6.29269C8.38523 4.31998 10.7215 2.78427 13.3734 1.68554C16.0507 0.561848 18.9173 0 21.9734 0ZM10.4563 21.4625C10.4563 23.5351 10.974 25.4204 12.0096 27.1185C13.0451 28.8165 14.4342 30.1649 16.1769 31.1638C17.9197 32.1626 19.8518 32.662 21.9734 32.662C24.3475 32.662 26.5322 32.1376 28.5275 31.0889C30.5228 30.0401 32.3791 28.7166 34.0966 27.1185C35.1826 26.0947 36.1171 25.1083 36.9001 24.1594C37.683 23.2105 38.365 22.3116 38.9459 21.4625C38.3397 20.6635 37.6199 19.777 36.7864 18.8031C35.9782 17.8043 35.0816 16.8554 34.0966 15.9564C32.4802 14.3833 30.649 13.0598 28.6032 11.9861C26.5575 10.8873 24.3475 10.338 21.9734 10.338C19.8518 10.338 17.9197 10.8499 16.1769 11.8737C14.4342 12.8725 13.0451 14.221 12.0096 15.919C10.974 17.592 10.4563 19.4399 10.4563 21.4625ZM80.4679 21.4625C80.4679 19.4399 79.9502 17.592 78.9146 15.919C77.9044 14.221 76.5405 12.8725 74.8231 11.8737C73.1056 10.8499 71.1987 10.338 69.1024 10.338C67.486 10.338 65.9453 10.5877 64.4804 11.0871C63.0155 11.5865 61.639 12.2607 60.351 13.1098C59.0881 13.9588 57.9263 14.9077 56.8655 15.9564C55.729 17.0052 54.7313 18.079 53.8726 19.1777C53.0139 20.2515 52.3951 21.0131 52.0162 21.4625C52.6477 22.3365 53.3549 23.248 54.1378 24.1969C54.9208 25.1208 55.83 26.0947 56.8655 27.1185C58.5577 28.7166 60.4015 30.0401 62.3968 31.0889C64.4173 32.1376 66.6525 32.662 69.1024 32.662C71.1987 32.662 73.1056 32.1626 74.8231 31.1638C76.5405 30.1649 77.9044 28.8165 78.9146 27.1185C79.9502 25.4204 80.4679 23.5351 80.4679 21.4625Z"
        fill="currentColor"
      />
    </svg>
  }
  >
    Send email when self-hosting Infisical
  </Card>

  <Card
    title="Fastgen"
    href="https://docs.fastgen.com/actions/integrations/resend"
    icon={
    <svg
      className="h-6 w-6"
      width="341"
      height="639"
      viewBox="0 0 341 639"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Fastgen</title>
      <path
        d="M124.055 281.936C85.4199 323.452 41.1491 402.46 167.61 525.124C169.054 525.852 169.226 525.647 167.799 522.085C162.896 509.841 148.76 473.417 147.658 441.383C146.236 400.028 165.156 370.923 174.248 360.761C198.862 333.247 276.425 258.605 309.11 226.217C341.795 193.829 342.822 131.017 339.915 95.628C337.589 67.3167 334.499 72.6184 331.23 75.8291C286.8 120.721 167.035 239.46 124.055 281.936Z"
        fill="currentColor"
      />
      <path
        d="M191.752 543.303C190.004 541.192 166.79 490.436 166.415 451.524C165.007 427.954 168.397 412.593 170.652 401.957C171.473 400.141 172.512 399.788 173.489 400.748C198.436 425.247 260.074 494.383 264.655 499.052C270.399 504.904 276.598 517.658 276.598 517.658C286.61 536.3 298.531 570.561 295.876 608.76C293.891 637.323 292.119 639.736 289.687 638.817C288.292 638.29 272.502 622.982 258.003 608.925C247.209 598.461 237.131 588.69 234.238 586.226C227.46 580.451 208.67 562.084 194.368 546.421C193.493 545.462 193.501 545.413 191.752 543.303Z"
        fill="currentColor"
      />
      <path
        d="M40.6974 208.722C2.06224 250.238 -43.3264 322.115 83.1343 444.78C84.5784 445.508 84.7501 445.302 83.3235 441.74C78.4202 429.497 65.4019 400.203 64.3002 368.169C62.8779 326.814 81.7983 297.709 90.8898 287.547C115.504 260.033 193.067 185.392 225.752 153.003C258.437 120.615 259.464 57.8032 256.557 22.4142C254.232 -5.89712 251.142 -0.59542 247.872 2.61528C203.442 47.507 83.6775 166.246 40.6974 208.722Z"
        fill="currentColor"
      />
    </svg>
  }
  >
    Build workflows using Fastgen
  </Card>

  <Card
    title="Medusa"
    href="https://docs.medusajs.com/resources/integrations/guides/resend"
    icon={
    <svg
      className="h-6 w-6"
      width="488"
      height="488"
      viewBox="0 0 488 488"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Medusa</title>
      <path
        d="M394.468 97.5239L296.258 41.013C264.125 22.4774 224.751 22.4774 192.618 41.013L93.9554 97.5239C62.2748 116.06 42.3613 150.418 42.3613 187.037V300.511C42.3613 337.582 62.2748 371.489 93.9554 390.024L192.165 446.987C224.298 465.523 263.673 465.523 295.806 446.987L394.015 390.024C426.149 371.489 445.61 337.582 445.61 300.511V187.037C446.515 150.418 426.601 116.06 394.468 97.5239ZM244.212 344.816C188.544 344.816 143.287 299.607 143.287 244C143.287 188.393 188.544 143.185 244.212 143.185C299.879 143.185 345.589 188.393 345.589 244C345.589 299.607 300.332 344.816 244.212 344.816Z"
        fill="currentColor"
      />
    </svg>
  }
  >
    Send e-commerce emails using Medusa
  </Card>

  <Card
    title="OpenMeter"
    href="https://openmeter.io/docs/reporting/email"
    icon={
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <title>OpenMeter</title>
      <path
        d="M10.238 8.44 7.28 6.519l-4.909 9.565.06.04h3.863l3.944-7.684ZM15.786 8.44 12.83 6.519l-4.91 9.565.061.04h3.863l3.943-7.684ZM21.335 8.44l-2.957-1.921-4.91 9.565.06.04h3.864l3.943-7.684Z"
        fill="currentColor"
        clipRule="evenodd"
      />
    </svg>
  }
  >
    Send usage emails using OpenMeter
  </Card>

  <Card
    title="Invopop"
    href="https://docs.invopop.com/guides/features/email"
    icon={
    <svg className="h-6 w-6" fill="none" viewBox="0 0 40 41">
      <title>Invopop</title>
      <path
        d="M38.7166 38.5342L37.8332 37.7778H10.2562C10.0628 37.7782 9.87562 37.7081 9.72878 37.5802L2.17692 31.1328H1.82092C1.65297 31.1324 1.48897 31.1845 1.35122 31.2821C1.21347 31.3797 1.10866 31.518 1.05103 31.6782C0.993406 31.8384 0.985766 32.0127 1.02915 32.1775C1.07253 32.3422 1.16484 32.4895 1.29351 32.5991L9.72878 39.8231C9.87668 39.9487 10.0634 40.0175 10.2562 40.0172H38.1859C38.3582 40.0228 38.5277 39.9731 38.6703 39.875C38.813 39.777 38.9216 39.6355 38.9804 39.4711C39.0393 39.3067 39.0454 39.1275 38.998 38.9592C38.9507 38.7911 38.8522 38.6422 38.7166 38.5342Z"
        fill="currentColor"
      />
      <path
        d="M38.7166 34.0882L37.8332 33.3316H10.2562C10.0628 33.3321 9.87562 33.2619 9.72878 33.1341L2.17692 26.6699H1.82092C1.65297 26.6696 1.48897 26.7216 1.35122 26.8192C1.21347 26.9168 1.10866 27.0551 1.05103 27.2154C0.993406 27.3755 0.985766 27.5499 1.02915 27.7146C1.07253 27.8794 1.16484 28.0266 1.29351 28.1362L9.72878 35.3569C9.87562 35.4848 10.0628 35.5549 10.2562 35.5545H38.1859C38.3542 35.5555 38.5186 35.5039 38.6569 35.4066C38.7952 35.3094 38.9004 35.1711 38.9586 35.0106C39.0166 34.8504 39.0244 34.6756 38.9812 34.5106C38.9379 34.3455 38.8454 34.1979 38.7166 34.0882Z"
        fill="currentColor"
      />
      <path
        d="M38.7164 16.3087L37.833 15.5522H10.256C10.0629 15.5538 9.8757 15.4849 9.72854 15.3581L2.17668 8.89387H1.82068C1.64876 8.88903 1.47971 8.93936 1.33758 9.03772C1.19546 9.13609 1.0875 9.27746 1.02908 9.44175C0.970657 9.60602 0.96474 9.78482 1.01217 9.95272C1.0596 10.1206 1.15797 10.269 1.29327 10.3768L9.95598 17.7749L20.1087 26.4787C20.2574 26.6049 20.4454 26.6738 20.6394 26.6728H27.4529L28.3363 27.4294C28.4643 27.5395 28.5561 27.6869 28.5991 27.8517C28.6421 28.0164 28.6344 28.1907 28.5769 28.3508C28.5194 28.5109 28.415 28.6494 28.2777 28.7474C28.1403 28.8454 27.9767 28.8982 27.8089 28.8989H20.6394C20.4477 28.8945 20.2634 28.8222 20.1186 28.6947L12.537 22.2238H1.82068C1.65273 22.2234 1.48873 22.2755 1.35098 22.3731C1.21323 22.4707 1.10842 22.6089 1.05079 22.7692C0.993168 22.9294 0.985528 23.1038 1.02891 23.2685C1.0723 23.4332 1.1646 23.5805 1.29327 23.6901L9.72854 30.9108C9.87539 31.0387 10.0625 31.1087 10.256 31.1082H38.1857C38.3539 31.1084 38.5179 31.0559 38.6557 30.9582C38.7936 30.8604 38.8986 30.7221 38.9564 30.5618C39.0143 30.4015 39.0224 30.2269 38.9794 30.0618C38.9364 29.8968 38.8447 29.7491 38.7164 29.6387L27.4529 19.9978H20.6394C20.449 19.9949 20.2654 19.9265 20.1186 19.8035L17.7451 17.7749H38.1824C38.3509 17.7768 38.5159 17.7257 38.6546 17.6287C38.7934 17.5315 38.8993 17.3934 38.9577 17.2328C39.0163 17.0722 39.0244 16.8974 38.9811 16.7319C38.938 16.5665 38.8454 16.4187 38.7164 16.3087ZM20.1186 22.0264C20.2673 22.1527 20.4553 22.2215 20.6493 22.2205H27.4561L28.3363 22.9737C28.4637 23.0837 28.5549 23.2307 28.5974 23.3948C28.64 23.5589 28.6321 23.7324 28.5746 23.8918C28.5171 24.0512 28.4129 24.1889 28.276 24.2864C28.139 24.3838 27.976 24.4362 27.8089 24.4367H20.6394C20.4496 24.4371 20.2656 24.3709 20.1186 24.2491L12.537 17.7749H15.1345L20.1186 22.0264Z"
        fill="currentColor"
      />
      <path
        d="M38.7165 11.8635L37.8331 11.107H10.2561C10.0633 11.1072 9.87657 11.0384 9.72869 10.9128L2.17681 4.44531H1.82081C1.65296 4.44594 1.48934 4.49884 1.352 4.59684C1.21466 4.69484 1.11021 4.83326 1.05273 4.99341C0.995257 5.15357 0.987512 5.32777 1.03054 5.49254C1.07358 5.65731 1.16532 5.80471 1.2934 5.91488L9.72869 13.1356C9.87585 13.2625 10.063 13.3314 10.2561 13.3297H38.1858C38.354 13.3308 38.5185 13.2792 38.6568 13.1819C38.7951 13.0846 38.9004 12.9463 38.9584 12.786C39.0165 12.6256 39.0244 12.451 38.9811 12.2859C38.9378 12.1208 38.8454 11.9733 38.7165 11.8635Z"
        fill="currentColor"
      />
      <path
        d="M1.29387 1.46623L9.72916 8.70366C9.87704 8.82927 10.0638 8.89801 10.2566 8.89781H38.1863C38.3545 8.89893 38.519 8.84731 38.6573 8.75C38.7955 8.65269 38.9009 8.51443 38.9589 8.35407C39.0169 8.19371 39.0249 8.01907 38.9816 7.85399C38.9383 7.68889 38.8459 7.54139 38.717 7.43159L30.2817 0.194161C30.1332 0.069775 29.9469 0.00120419 29.7543 2.55058e-06H1.82128C1.65334 -0.000420119 1.48934 0.0516987 1.35159 0.149271C1.21384 0.246844 1.10902 0.385136 1.0514 0.545339C0.993773 0.705541 0.986132 0.879881 1.02952 1.04465C1.0729 1.20942 1.1652 1.35662 1.29387 1.46623Z"
        fill="currentColor"
      />
      <path
        d="M38.7166 38.5342L37.8332 37.7778H10.2562C10.0628 37.7782 9.87562 37.7081 9.72878 37.5802L2.17692 31.1328H1.82092C1.65297 31.1324 1.48897 31.1845 1.35122 31.2821C1.21347 31.3797 1.10866 31.518 1.05103 31.6782C0.993406 31.8384 0.985766 32.0127 1.02915 32.1775C1.07253 32.3422 1.16484 32.4895 1.29351 32.5991L9.72878 39.8231C9.87668 39.9487 10.0634 40.0175 10.2562 40.0172H38.1859C38.3582 40.0228 38.5277 39.9731 38.6703 39.875C38.813 39.777 38.9216 39.6355 38.9804 39.4711C39.0393 39.3067 39.0454 39.1275 38.998 38.9592C38.9507 38.7911 38.8522 38.6422 38.7166 38.5342Z"
        fill="currentColor"
      />
      <path
        d="M38.7166 34.0882L37.8332 33.3316H10.2562C10.0628 33.3321 9.87562 33.2619 9.72878 33.1341L2.17692 26.6699H1.82092C1.65297 26.6696 1.48897 26.7216 1.35122 26.8192C1.21347 26.9168 1.10866 27.0551 1.05103 27.2154C0.993406 27.3755 0.985766 27.5499 1.02915 27.7146C1.07253 27.8794 1.16484 28.0266 1.29351 28.1362L9.72878 35.3569C9.87562 35.4848 10.0628 35.5549 10.2562 35.5545H38.1859C38.3542 35.5555 38.5186 35.5039 38.6569 35.4066C38.7952 35.3094 38.9004 35.1711 38.9586 35.0106C39.0166 34.8504 39.0244 34.6756 38.9812 34.5106C38.9379 34.3455 38.8454 34.1979 38.7166 34.0882Z"
        fill="currentColor"
      />
      <path
        d="M38.7164 16.3087L37.833 15.5522H10.256C10.0629 15.5538 9.8757 15.4849 9.72854 15.3581L2.17668 8.89387H1.82068C1.64876 8.88903 1.47971 8.93936 1.33758 9.03772C1.19546 9.13609 1.0875 9.27746 1.02908 9.44175C0.970657 9.60602 0.96474 9.78482 1.01217 9.95272C1.0596 10.1206 1.15797 10.269 1.29327 10.3768L9.95598 17.7749L20.1087 26.4787C20.2574 26.6049 20.4454 26.6738 20.6394 26.6728H27.4529L28.3363 27.4294C28.4643 27.5395 28.5561 27.6869 28.5991 27.8517C28.6421 28.0164 28.6344 28.1907 28.5769 28.3508C28.5194 28.5109 28.415 28.6494 28.2777 28.7474C28.1403 28.8454 27.9767 28.8982 27.8089 28.8989H20.6394C20.4477 28.8945 20.2634 28.8222 20.1186 28.6947L12.537 22.2238H1.82068C1.65273 22.2234 1.48873 22.2755 1.35098 22.3731C1.21323 22.4707 1.10842 22.6089 1.05079 22.7692C0.993168 22.9294 0.985528 23.1038 1.02891 23.2685C1.0723 23.4332 1.1646 23.5805 1.29327 23.6901L9.72854 30.9108C9.87539 31.0387 10.0625 31.1087 10.256 31.1082H38.1857C38.3539 31.1084 38.5179 31.0559 38.6557 30.9582C38.7936 30.8604 38.8986 30.7221 38.9564 30.5618C39.0143 30.4015 39.0224 30.2269 38.9794 30.0618C38.9364 29.8968 38.8447 29.7491 38.7164 29.6387L27.4529 19.9978H20.6394C20.449 19.9949 20.2654 19.9265 20.1186 19.8035L17.7451 17.7749H38.1824C38.3509 17.7768 38.5159 17.7257 38.6546 17.6287C38.7934 17.5315 38.8993 17.3934 38.9577 17.2328C39.0163 17.0722 39.0244 16.8974 38.9811 16.7319C38.938 16.5665 38.8454 16.4187 38.7164 16.3087ZM20.1186 22.0264C20.2673 22.1527 20.4553 22.2215 20.6493 22.2205H27.4561L28.3363 22.9737C28.4637 23.0837 28.5549 23.2307 28.5974 23.3948C28.64 23.5589 28.6321 23.7324 28.5746 23.8918C28.5171 24.0512 28.4129 24.1889 28.276 24.2864C28.139 24.3838 27.976 24.4362 27.8089 24.4367H20.6394C20.4496 24.4371 20.2656 24.3709 20.1186 24.2491L12.537 17.7749H15.1345L20.1186 22.0264Z"
        fill="currentColor"
      />
      <path
        d="M38.7165 11.8635L37.8331 11.107H10.2561C10.0633 11.1072 9.87657 11.0384 9.72869 10.9128L2.17681 4.44531H1.82081C1.65296 4.44594 1.48934 4.49884 1.352 4.59684C1.21466 4.69484 1.11021 4.83326 1.05273 4.99341C0.995257 5.15357 0.987512 5.32777 1.03054 5.49254C1.07358 5.65731 1.16532 5.80471 1.2934 5.91488L9.72869 13.1356C9.87585 13.2625 10.063 13.3314 10.2561 13.3297H38.1858C38.354 13.3308 38.5185 13.2792 38.6568 13.1819C38.7951 13.0846 38.9004 12.9463 38.9584 12.786C39.0165 12.6256 39.0244 12.451 38.9811 12.2859C38.9378 12.1208 38.8454 11.9733 38.7165 11.8635Z"
        fill="currentColor"
      />
      <path
        d="M1.29387 1.46623L9.72916 8.70366C9.87704 8.82927 10.0638 8.89801 10.2566 8.89781H38.1863C38.3545 8.89893 38.519 8.84731 38.6573 8.75C38.7955 8.65269 38.9009 8.51443 38.9589 8.35407C39.0169 8.19371 39.0249 8.01907 38.9816 7.85399C38.9383 7.68889 38.8459 7.54139 38.717 7.43159L30.2817 0.194161C30.1332 0.069775 29.9469 0.00120419 29.7543 2.55058e-06H1.82128C1.65334 -0.000420119 1.48934 0.0516987 1.35159 0.149271C1.21384 0.246844 1.10902 0.385136 1.0514 0.545339C0.993773 0.705541 0.986132 0.879881 1.02952 1.04465C1.0729 1.20942 1.1652 1.35662 1.29387 1.46623Z"
        fill="currentColor"
      />
    </svg>
  }
  >
    Send invoice emails using Invopop
  </Card>

  <Card
    title="Payload CMS"
    href="https://payloadcms.com/docs/email/overview#resend-configuration"
    icon={
    <svg className="h-6 w-6" viewBox="0 0 40 40" fill="none">
      <title>Payload CMS</title>
      <path
        d="M18.4469 0L36.8 11.0415V31.9965L22.9773 40V19.0451L4.61523 8.01243L18.4469 0Z"
        fill="currentColor"
      />
      <path
        d="M17.0495 38.8363V22.4829L3.20001 30.5042L17.0495 38.8363Z"
        fill="currentColor"
      />
    </svg>
  }
  >
    Send emails using Payload CMS
  </Card>

  <Card
    title="Tinybird"
    href="https://www.tinybird.co/docs/get-data-in/guides/ingest-from-resend"
    icon={
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M9.971 18.125 0 14.556l13.967-4.88L16.507 4 24 6.055l-4.407 1.669-2.735 12.754.097.039L5.946 28l4.025-9.875Z"
        fill="currentColor"
        transform="translate(0 -4)"
      />
    </svg>
  }
  >
    Analyze your email data in real time
  </Card>

  <Card
    title="Coolify"
    href="https://coolify.io/docs/knowledge-base/notifications#resend-configuration"
    icon={
    <svg
      className="h-6 w-6"
      width="66"
      height="66"
      viewBox="0 0 66 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Coolify</title>
      <path
        d="M18.8298 18.8316H7.28729V53.4593H18.8298V18.8316ZM18.8298 65.0018H65V53.4593H18.8298V65.0018ZM18.8298 18.8316H65V7.28906H18.8298V18.8316Z"
        fill="currentColor"
        fill-opacity="0.51"
      />
      <path
        d="M15.1862 15.1871H3.64368V49.8147H15.1862V15.1871ZM15.1862 61.3573H61.3564V49.8147H15.1862V61.3573ZM15.1862 15.1871H61.3564V3.64453H15.1862V15.1871Z"
        fill="#CCCCCC"
      />
      <path
        d="M11.5426 11.5426H0V46.1702H11.5426V11.5426ZM11.5426 57.7128H57.7128V46.1702H11.5426V57.7128ZM11.5426 11.5426H57.7128V0H11.5426V11.5426Z"
        fill="currentColor"
      />
    </svg>
  }
  >
    Send email notifications using Coolify
  </Card>

  <Card
    title="Courrier"
    href="https://railsdesigner.com/courrier/"
    icon={
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="256"
      height="256"
      viewBox="0 0 256 256"
      className="h-6 w-6"
      fill="none"
    >
      <path
        fill="currentColor"
        d="M128 3c69.036 0 125 55.964 125 125s-55.964 125-125 125S3 197.036 3 128 58.964 3 128 3m.49 51q-16.204 0-29.679 5.485-13.379 5.485-23.271 15.51-9.799 10.024-15.17 23.736Q55 112.444 55 128.898q0 21.752 9.233 38.206t25.627 25.723Q106.255 202 127.831 202q12.343 0 22.989-3.404 10.741-3.406 21.67-10.876l7.537 12.294H187v-51.918h-8.386q-1.224 6.903-3.674 12.861-2.356 5.863-5.653 10.497-6.218 9.173-15.546 14.186-9.233 5.011-20.728 5.011-20.823 0-31.846-16.265-10.93-16.36-10.93-47.379 0-30.83 10.93-46.339 11.024-15.604 32.6-15.604 11.682 0 20.633 4.824 8.951 4.727 15.453 14.846 2.355 3.5 4.334 7.755 2.072 4.255 3.957 9.268H187v-45.77h-5.653l-8.103 9.55h-.754q-9.139-5.58-20.727-8.51Q140.173 54 128.49 54"
      ></path>
    </svg>
  }
  >
    API-powered email delivery for Ruby apps
  </Card>

  <Card
    title="Kinde"
    href="https://docs.kinde.com/integrate/third-party-tools/kinde-resend-custom-smtp/"
    icon={
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M 12.93 24 L 3.77 12.29 L 3.77 24 L 0 24 L 0 0 L 3.77 0 L 3.77 11.37 L 12.58 0 L 17.01 0 L 7.82 11.66 L 17.66 24 L 12.93 24 Z"
        fill="currentColor"
      />
    </svg>
  }
  >
    Send auth and billing emails using Kinde
  </Card>
</CardGroup>

## Build your own integration

Here's how to build your own integration with Resend:

1. Read the documentation on [how to send emails](/api-reference/emails/send-email).
2. Integrate with your product offering.
3. [Reach out to us](https://resend.com/contact) to feature your product on this page.


