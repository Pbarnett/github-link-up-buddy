# Resend Knowledge Base

# Introduction

> A collection of answers to frequently asked questions.

<CardGroup cols={1}>
  <Card title="Can I receive emails with Resend?" href="/knowledge-base/how-can-i-receive-emails-with-resend">
    Resend does not offer the functionality to receive email but there are a few
    workarounds that could help.
  </Card>

  <Card title="How do Dedicated IPs Work?" href="/knowledge-base/how-do-dedicated-ips-work">
    Learn how Dedicated IPs work and how to request them.
  </Card>

  <Card title="How do I avoid conflicts with my MX records?" href="/knowledge-base/how-do-i-avoid-conflicting-with-my-mx-records">
    Learn how to avoid conflicts with your existing MX records when setting up a
    Resend domain.
  </Card>

  <Card title="How do I avoid Gmail's spam folder?" href="/knowledge-base/how-do-i-avoid-gmails-spam-folder">
    Learn how to improve inbox placement in Gmail.
  </Card>

  <Card title="How do I avoid Outlook's spam folder?" href="/knowledge-base/how-do-i-avoid-outlooks-spam-folder">
    Learn how to improve inbox placement in Outlook.
  </Card>

  <Card title="How do I ensure sensitive data isn't stored on Resend?" href="/knowledge-base/how-do-i-ensure-sensitive-data-isnt-stored-on-resend">
    Information on how we can help you protect your customer's information.
  </Card>

  <Card title="How do I fix CORS issues?" href="/knowledge-base/how-do-i-fix-cors-issues">
    Information on recommended options to avoid CORS errors when sending emails.
  </Card>

  <Card title="How do I maximize deliverability for Supabase Auth emails?" href="/knowledge-base/how-do-i-maximize-deliverability-for-supabase-auth-emails">
    Everything you should do before you start sending authentication emails with
    Resend and Supabase.
  </Card>

  <Card title="How do I send with an avatar?" href="/knowledge-base/how-do-i-send-with-an-avatar">
    Learn how to show your avatar in the inbox of your recipients.
  </Card>

  <Card title="Is it better to send emails from a subdomain or the root domain?" href="/knowledge-base/is-it-better-to-send-emails-from-a-subdomain-or-the-root-domain">
    Discover why sending emails from a subdomain can be better than using a root
    domain.
  </Card>

  <Card title="What if an email says delivered but the recipient hasn't received it?" href="/knowledge-base/what-if-an-email-says-delivered-but-the-recipient-has-not-received-it">
    Learn the steps to take when an email is delivered, but the recipient does not
    receive it.
  </Card>

  <Card title="What if my domain is not verifying?" href="/knowledge-base/what-if-my-domain-is-not-verifying">
    Learn what steps to take when your domain doesn't seem to verifying.
  </Card>

  <Card title="What is Resend Pricing?" href="/knowledge-base/what-is-resend-pricing">
    Learn more about Resend's pricing plans.
  </Card>

  <Card title="Why are my open rates not accurate?" href="/knowledge-base/why-are-my-open-rates-not-accurate">
    Learn why your open rate statistics are not accurate and what you can do about
    it.
  </Card>

  <Card title="How can I delete my Resend account?" href="/knowledge-base/how-can-i-delete-my-resend-account">
    Learn how to permanently delete your Resend account and data.
  </Card>

  <Card title="Should I add an unsubscribe link to all of my emails sent with Resend?" href="/knowledge-base/should-i-add-an-unsubscribe-link">
    Learn when to add unsubscribe links to your transactional and marketing
    emails.
  </Card>

  <Card title="Why are my emails landing on the suppression list?" href="/knowledge-base/why-are-my-emails-landing-on-the-suppression-list">
    Learn why your emails land on the suppression list, and how to remove them.
  </Card>
</CardGroup>

# How do I avoid conflicts with my MX records?

> Learn how to avoid conflicts with your existing MX records when setting up a Resend domain.

## What is an MX record?

MX (Mail Exchanger) records specify where incoming mail should be delivered on behalf of a domain. Every MX value has a unique priority (also known as preference) value. The lower the number, the higher the priority.

Resend requires that you setup an MX record on send.yourdomain.com to establish a return-path for bounce/complaint reports from Inbox Providers. We set this return path in the email headers of every email you send through Resend.

## Won't this conflict with my existing Inbox Provider?

Let's look at an example. Say you're using G Suite for your email. You'll have an MX record that looks something like this:

```
resend.com     MX    1 alt3.aspmx.l.google.com.
```

The records specifies that incoming mail to any address on the `@resend.com` domain should be delivered to the google servers.

Now, let's say you want to use Resend to send emails from `@yourdomain.com`. You'll need to add an MX record for `send.yourdomain.com` that looks something like this:

```
send.resend.com     MX    10 feedback-smtp.us-east-1.amazonses.com
```

Two things to note here:

* **The MX record is for `send.yourdomain.com`, not `yourdomain.com`**. MX records only impact the subdomain they are associated to, so the Resend MX record will not affect your existing records on the root domain.
* **The priority value is 10**. Though we suggest a priority of 10, this can be changed to lower or higher as needed to avoid conflicts.

## Solving common conflicts

<AccordionGroup>
  <Accordion title="Conflicts with existing records">
    If you already have a MX record set for `send.yourdomain.com`, you will need to remove it before adding the Resend MX record.

    If you need to keep the existing record, you can add a subdomain to your domain (e.g. `sub.yourdomain.com`) which will move the Resend MX location to `send.sub.yourdomain.com`.
  </Accordion>

  <Accordion title="Conflicts with existing priority">
    Each MX should have a unique priority value. We suggest using 10 for your MX record on `send.yourdomain.com`, but you can use a higher number if 10 is already in use.
  </Accordion>
</AccordionGroup>

# How do I avoid conflicts with my MX records?

> Learn how to avoid conflicts with your existing MX records when setting up a Resend domain.

## What is an MX record?

MX (Mail Exchanger) records specify where incoming mail should be delivered on behalf of a domain. Every MX value has a unique priority (also known as preference) value. The lower the number, the higher the priority.

Resend requires that you setup an MX record on send.yourdomain.com to establish a return-path for bounce/complaint reports from Inbox Providers. We set this return path in the email headers of every email you send through Resend.

## Won't this conflict with my existing Inbox Provider?

Let's look at an example. Say you're using G Suite for your email. You'll have an MX record that looks something like this:

```
resend.com     MX    1 alt3.aspmx.l.google.com.
```

The records specifies that incoming mail to any address on the `@resend.com` domain should be delivered to the google servers.

Now, let's say you want to use Resend to send emails from `@yourdomain.com`. You'll need to add an MX record for `send.yourdomain.com` that looks something like this:

```
send.resend.com     MX    10 feedback-smtp.us-east-1.amazonses.com
```

Two things to note here:

* **The MX record is for `send.yourdomain.com`, not `yourdomain.com`**. MX records only impact the subdomain they are associated to, so the Resend MX record will not affect your existing records on the root domain.
* **The priority value is 10**. Though we suggest a priority of 10, this can be changed to lower or higher as needed to avoid conflicts.

## Solving common conflicts

<AccordionGroup>
  <Accordion title="Conflicts with existing records">
    If you already have a MX record set for `send.yourdomain.com`, you will need to remove it before adding the Resend MX record.

    If you need to keep the existing record, you can add a subdomain to your domain (e.g. `sub.yourdomain.com`) which will move the Resend MX location to `send.sub.yourdomain.com`.
  </Accordion>

  <Accordion title="Conflicts with existing priority">
    Each MX should have a unique priority value. We suggest using 10 for your MX record on `send.yourdomain.com`, but you can use a higher number if 10 is already in use.
  </Accordion>
</AccordionGroup>

# AWS Route 53

> Verify your domain on Route 53 with Resend.

<Snippet file="domain-guide-add-domain.mdx" />

## Login to Route 53

Then, login to your [AWS Management Console, and open Route 53 console](https://console.aws.amazon.com/route53/), then click on your domain name. From there, click on `Create Record`.

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-route53-createrecord.png" />

## Add MX SPF Record

1. Type in `send` for the `Record name`.
2. Select the `Record type` dropdown, and choose `MX`.
3. Copy the MX Value from your domain in Resend into the `Value` field.
4. Be sure to include the `10` in the `Value` field, as seen in the screenshot.

<Info>
  Omit your domain from the record values in Resend when you paste. Instead of
  `send.example.com`, paste only `send` (or `send.subdomain` if you're using a
  subdomain).
</Info>

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-resend-spf-mx.png" />

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-route53-spf-mx.png" />

Below is a mapping of the record fields from Resend to Route 53:

| Route 53       | Resend           | Example Value                              |
| -------------- | ---------------- | ------------------------------------------ |
| Record Type    | Type             | `MX Record`                                |
| Record name    | Name             | `send`                                     |
| Value          | Value & Priority | `10 feedback-smtp.us-east-1.amazonses.com` |
| TTL            | -                | `Use Route 53 Default (300)`               |
| Routing policy | -                | `Simple routing`                           |

<Info>
  Route 53 does not label the `priority` column, and you will need to add this
  in to the `Value` section, as shown in the screenshot. Do not use the same
  priority for multiple records. If Priority `10` is already in use, try a
  number slightly higher like `11` or `12`.
</Info>

## Add TXT SPF Record

In the same section, choose `Add another record`:

1. Type in `send` for the `Record name`.
2. Click the `Record type` dropdown.
3. Select the `Record type` dropdown, and choose `TXT`.
4. Copy TXT Value from your domain in Resend into the `Value` field.

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-resend-spf-txt.png" />

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-route53-spf-txt.png" />

Below is a mapping of the record fields from Resend to Route 53:

| Route 53       | Resend | Example Value                         |
| -------------- | ------ | ------------------------------------- |
| Record type    | Type   | `TXT Record`                          |
| Record name    | Name   | `send`                                |
| Value          | Value  | `"v=spf1 include:amazonses.com ~all"` |
| TTL            | -      | `Use Route 53 Default (300)`          |
| Routing policy | -      | `Simple routing`                      |

<Info>
  Omit your domain from the record values in Resend when you paste. Instead of
  `send.example.com`, paste only `send` (or `send.subdomain` if you're using a
  subdomain).
</Info>

## Add TXT DKIM Records

In the same section, choose `Add another record`:

1. Type in `resend._domainkey` for the the `Record name`.
2. Change the `Record Type` to `TXT`.
3. Copy the TXT Value value from your domain in Resend to the `Value` text box.
4. Click on `Create Records`.

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-resend-dkim.png" />

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-route53-dkim-txt.png" />

Below is a mapping of the record fields from Resend to Route 53:

| Route 53       | Resend | Example Value                                      |
| -------------- | ------ | -------------------------------------------------- |
| Record type    | Type   | `TXT Record`                                       |
| Record name    | Name   | `resend._domainkey`                                |
| Value          | Value  | `p=MIGfMA0GCSqGSIbRL/a21QojogA+rYqIQXB/3DQEBDAQAB` |
| TTL            | -      | `Use Route 53 Default (300)`                       |
| Routing policy | -      | `Simple routing`                                   |

<Info>
  Omit your domain from the record values in Resend when you paste. Instead of
  `resend._domainkey.example.com`, paste only `resend._domainkey` (or
  `resend._domainkey.subdomain` if you're using a subdomain).
</Info>

## Complete Verification

Now click [Verify DNS Records](https://resend.com/domains) on your Domain in Resend. It may take up to 5 hours to complete the verification process (often much faster).

## Troubleshooting

If your domain is not successfully verified, these are some common troubleshooting methods.

<AccordionGroup>
  <Accordion title="Resend shows my domain verification failed.">
    Review the records you added to Route 53 to rule out copy and paste errors.
  </Accordion>

  <Accordion title="It has been longer than 72 hours and my domain is still Pending.">
    [Review our guide on a domain not verifying](/knowledge-base/what-if-my-domain-is-not-verifying).
  </Accordion>
</AccordionGroup>

# Namecheap

> Verify your domain on Namecheap with Resend.

<Snippet file="domain-guide-add-domain.mdx" />

## Login to Namecheap

Then, login to your [Namecheap account](https://ap.www.namecheap.com), and go to the `Advanced DNS` page for the domain you want to verify.

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-namecheap-main.png" />

## Add MX SPF Record

<Warning>
  If you are changing the MX configuration from `Gmail` to `Custom MX`, you need
  to [setup new MX records for
  Gmail](https://support.google.com/a/answer/174125). If you don't setup new
  records, receiving mail in your gmail inboxes will stop.
</Warning>

Under the `Mail Settings` section, click the dropdown and select `Custom MX`:

1. Type `send` for the `Host` of the record.
2. Copy the MX Value from Resend into the `Value` field.
3. Use the `Automatic` TTL.
4. Select `Save all changes`.

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-resend-spf-mx.png" />

<br />

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-namecheap-spf-mx.png" />

Below is a mapping of the record fields from Resend to Namecheap:

| Namecheap | Resend   | Example Value                           |
| --------- | -------- | --------------------------------------- |
| Type      | Type     | `MX Record`                             |
| Host      | Name     | `send`                                  |
| TTL       | -        | `Automatic`                             |
| Value     | Value    | `feedback-smtp.us-east-1.amazonses.com` |
| -         | Priority | `10`                                    |

<Info>
  Omit your domain from the record values in Resend when you paste. Instead of
  `send.example.com`, paste only `send` (or `send.subdomain` if you're using a
  subdomain).
</Info>

<Info>
  Namecheap does not label the `priority` column. It is the empty column after
  `Value`. Do not use the same priority for multiple records. If Priority `10`
  is already in use, try a number slightly higher like `11` or `12`.
</Info>

## Add TXT SPF Record

Under the `Host Records` section, click `Add New Record`:

1. Set the `Type` to `TXT Record`.
2. Enter `send` into the `Host` field.
3. Copy the TXT Value from Resend into the `Value` field.
4. Use the `Automatic` TTL.
5. Select `Save all changes`.

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-resend-spf-txt.png" />

<br />

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-namecheap-spf-txt.png" />

Below is a mapping of the record fields from Resend to Namecheap:

| Namecheap | Resend | Example Value                         |
| --------- | ------ | ------------------------------------- |
| Type      | Type   | `TXT Record`                          |
| Host      | Name   | `send`                                |
| TTL       | -      | `Automatic`                           |
| Value     | Value  | `"v=spf1 include:amazonses.com ~all"` |

<Info>
  Omit your domain from the record values in Resend when you paste. Instead of
  `send.example.com`, paste only `send` (or `send.subdomain` if you're using a
  subdomain).
</Info>

## Add TXT DKIM Records

In that same `Host Records` section, click `Add New Record`.

1. Set the `Type` to `TXT Record`.
2. Enter `resend._domainkey` into the `Host` field.
3. Copy the TXT Value from Resend into the `Value` field.
4. Use the `Automatic` TTL.
5. Select `Save all changes`.

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-resend-dkim.png" />

<br />

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-namecheap-dkim-txt.png" />

Below is a mapping of the record fields from Resend to Namecheap:

| Namecheap | Resend | Example Value                                      |
| --------- | ------ | -------------------------------------------------- |
| Type      | Type   | `TXT Record`                                       |
| Host      | Name   | `resend._domainkey`                                |
| TTL       | -      | `Automatic`                                        |
| Value     | Value  | `p=MIGfMA0GCSqGSIbRL/a21QojogA+rYqIQXB/3DQEBDAQAB` |

<Info>
  Omit your domain from the record values in Resend when you paste. Instead of
  `resend._domainkey.example.com`, paste only `resend._domainkey` (or
  `resend._domainkey.subdomain` if you're using a subdomain).
</Info>

## Complete Verification

Now click [Verify DNS Records](https://resend.com/domains) on your Domain in Resend. It may take up to 72 hours to complete the verification process (often much faster).

## Troubleshooting

If your domain is not successfully verified, these are some common troubleshooting methods.

<AccordionGroup>
  <Accordion title="Resend shows my domain verification failed.">
    Review the records you added to Namecheap to rule out copy and paste errors.
  </Accordion>

  <Accordion title="It has been longer than 72 hours and my domain is still Pending.">
    [Review our guide on a domain not verifying](/knowledge-base/what-if-my-domain-is-not-verifying).
  </Accordion>
</AccordionGroup>

# Vercel

> Verify your domain on Vercel with Resend.

<Note>
  This guide helps you verify your domain on Vercel with Resend. We also have
  [an official integration for
  Vercel](https://resend.com/blog/vercel-integration) that helps you set up your
  API keys on Vercel projects so you can start sending emails with Resend. [View
  the integration here](https://vercel.com/resend/~/integrations/resend).
</Note>

<Snippet file="domain-guide-add-domain.mdx" />

## Login to Vercel

Login to your [Vercel account](https://vercel.com/login) and select the `Domains` tab.

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-vercel-domains.png" />

## Add MX SPF Record

Copy and paste the values in Resend to Vercel.

1. Type `send` for the `Name` of the record in Vercel.
2. Expand the `Type` dropdown and select `MX`.
3. Copy the record value from Resend into the `Value` field in Vercel.
4. Add `10` for the `Priority`.
5. Select `Add`.

<Info>
  Omit your domain from the record values in Resend when you paste. Instead of
  `send.example.com`, paste only `send` (or `send.subdomain` if you're using a
  subdomain).
</Info>

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-resend-spf-mx.png" />

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-vercel-spf-mx.png" />

Below is a mapping of the record fields from Resend to Vercel:

| Vercel   | Resend   | Example Value                           |
| -------- | -------- | --------------------------------------- |
| Type     | Type     | `MX Record`                             |
| Name     | Name     | `send`                                  |
| Value    | Value    | `feedback-smtp.us-east-1.amazonses.com` |
| TTL      | -        | `Use Vercel default (60)`               |
| Priority | Priority | `10`                                    |

<Info>
  Do not use the same priority for multiple records. If Priority `10` is already
  in use on another record, try a number slightly higher like `11` or `12`.
</Info>

## Add TXT SPF Record

In the same section, add another record in Vercel.

1. Type `send` for the `Name` of the record.
2. Expand the `Type` dropdown and select `TXT`.
3. Copy the `TXT` record value from Resend into the `Value` field in Vercel.
4. Use the default TTL of `60`.
5. Select `Add`.

<Info>
  Omit your domain from the record values in Resend when you paste. Instead of
  `send.example.com`, paste only `send` (or `send.subdomain` if you're using a
  subdomain).
</Info>

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-resend-spf-txt.png" />

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-vercel-spf-txt.png" />

Below is a mapping of the record fields from Resend to Vercel:

| Vercel | Resend | Example Value                         |
| ------ | ------ | ------------------------------------- |
| Type   | Type   | `TXT Record`                          |
| Name   | Name   | `send`                                |
| Value  | Value  | `"v=spf1 include:amazonses.com ~all"` |
| TTL    | -      | `Use Vercel default (60)`             |

## Add TXT DKIM Records

In the same section, add another record in Vercel.

1. Type `resend._domainkey` for the `Name` of the record.
2. Expand the `Type` dropdown and select `TXT`.
3. Copy the record value from Resend into the `Value` field in Vercel.

<Info>
  Omit your domain from the record values in Resend when you paste. Instead of
  `resend._domainkey.example.com`, paste only `resend._domainkey` (or
  `resend._domainkey.subdomain` if you're using a subdomain).
</Info>

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-resend-dkim.png" />

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-vercel-dkim-txt.png" />

Below is a mapping of the record fields from Resend to Vercel:

| Vercel | Resend | Example Value                                      |
| ------ | ------ | -------------------------------------------------- |
| Type   | Type   | `TXT Record`                                       |
| Name   | Name   | `resend._domainkey`                                |
| Value  | Value  | `p=MIGfMA0GCSqGSIbRL/a21QojogA+rYqIQXB/3DQEBDAQAB` |
| TTL    | -      | `Use Vercel default (60)`                          |

## Complete Verification

Now click [Verify DNS Records](https://resend.com/domains) on your Domain in Resend. It may take a few hours to complete the verification process (often much faster).

## Troubleshooting

If your domain is not successfully verified, these are some common troubleshooting methods.

<AccordionGroup>
  <Accordion title="Resend shows my domain verification failed.">
    Review the records you added to Vercel to rule out copy and paste errors.
  </Accordion>

  <Accordion title="It has been longer than 72 hours and my domain is still Pending.">
    [Review our guide on a domain not verifying](/knowledge-base/what-if-my-domain-is-not-verifying).
  </Accordion>
</AccordionGroup>

# Hostinger

> Verify your domain on Hostinger with Resend.

<Snippet file="domain-guide-add-domain.mdx" />

## Login to Hostinger

Login to your [Hostinger account](https://auth.hostinger.com/login):

1. Select the `Domains` tab
2. Choose your Domain from the `Domain portfolio` list.
3. Select the `DNS / Nameservers` to get to the page to manage DNS records.

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-hostinger-domains.png" />

## Add MX SPF Record

Copy and paste the values MX in Resend to Hostinger.

1. Set the Type to `MX`.
2. Type `send` for the `Name` of the record.
3. Copy the MX Value from Resend into the `Mail Server` field.
4. Add `10` for the `Priority`.
5. Set the TTL to `3600`.
6. Select `Add Record`.

<Info>
  Omit your domain from the record values in Resend when you paste. Instead of
  `send.example.com`, paste only `send` (or `send.subdomain` if you're using a
  subdomain).
</Info>

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-resend-spf-mx.png" />

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-hostinger-spf-mx.png" />

Below is a mapping of the record fields from Resend to Hostinger:

| Hostinger   | Resend   | Example Value                           |
| ----------- | -------- | --------------------------------------- |
| Type        | Type     | `MX Record`                             |
| Name        | Name     | `send`                                  |
| Mail Server | Value    | `feedback-smtp.us-east-1.amazonses.com` |
| TTL         | -        | `Set to 3660`                           |
| Priority    | Priority | `10`                                    |

<Info>
  Do not use the same priority for multiple records. If Priority `10` is already
  in use on another record, try a number slightly higher like `11` or `12`.
</Info>

## Add TXT SPF Record

In the same section, add another record in Hostinger.

1. Set the Type to `TXT`.
2. Type `send` for the `Name` of the record.
3. Copy the TXT Value Resend into the `TXT value` field.
4. Set the TTL to `3600`.
5. Select `Add Record`.

<Info>
  Omit your domain from the record values in Resend when you paste. Instead of
  `send.example.com`, paste only `send` (or `send.subdomain` if you're using a
  subdomain).
</Info>

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-resend-spf-txt.png" />

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-hostinger-spf-txt.png" />

Below is a mapping of the record fields from Resend to Hostinger:

| Hostinger | Resend | Example Value                         |
| --------- | ------ | ------------------------------------- |
| Type      | Type   | `TXT Record`                          |
| Name      | Name   | `send`                                |
| TXT value | Value  | `"v=spf1 include:amazonses.com ~all"` |
| TTL       | -      | `Set to 3600`                         |

## Add TXT DKIM Records

In the same section, add another record in Hostinger.

1. Set the Type to `TXT`.
2. Type `resend._domainkey` for the `Name` of the record.
3. Copy the record value from Resend into the `TXT value` field.
4. Set the TTL to `3600`.
5. Select `Add Record`.

<Info>
  Omit your domain from the record values in Resend when you paste. Instead of
  `resend._domainkey.example.com`, paste only `resend._domainkey` (or
  `resend._domainkey.subdomain` if you're using a subdomain).
</Info>

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-resend-dkim.png" />

<img alt="Domain Details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/dashboard-domains-hostinger-dkim-txt.png" />

Below is a mapping of the record fields from Resend to Hostinger:

| Hostinger | Resend | Example Value                                      |
| --------- | ------ | -------------------------------------------------- |
| Type      | Type   | `TXT Record`                                       |
| Name      | Name   | `send`                                             |
| TXT value | Value  | `p=MIGfMA0GCSqGSIbRL/a21QojogA+rYqIQXB/3DQEBDAQAB` |
| TTL       | -      | `Set to 3600`                                      |

## Complete Verification

Now click [Verify DNS Records](https://resend.com/domains) on your Domain in Resend. It may take a few hours to complete the verification process (often much faster).

## Troubleshooting

If your domain is not successfully verified, these are some common troubleshooting methods.

<AccordionGroup>
  <Accordion title="Resend shows my domain verification failed.">
    Review the records you added to Hostinger to rule out copy and paste errors.
  </Accordion>

  <Accordion title="It has been longer than 72 hours and my domain is still Pending.">
    [Review our guide on a domain not verifying](/knowledge-base/what-if-my-domain-is-not-verifying).
  </Accordion>
</AccordionGroup>

# How do I maximize deliverability for Supabase Auth emails?

> Everything you should do before you start sending authentication emails with Resend and Supabase.

<Note>
  If you haven't yet, [configure your own Supabase
  integration](https://resend.com/settings/integrations)!
</Note>

Below are **five steps to improve the deliverability of your authentication emails**.

Prefer watching a video? Check out our video walkthrough below.

<div className="aspect-video">
  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/51vzcGEmjRI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</div>

## 1. Setup a custom domain on Supabase

By default, Supabase generates a `supabase.co` domain for your project, and uses that domain for the links in your authentication emails (e.g., verify email, reset password).

Once you are ready to go live, though, it is important to setup a custom domain. The key benefit here is to align the domains used in your `from` address and the links in your emails. Especially for something as sensitive as email verification and magic links, **giving confidence to the inbox providers that the origin of the email and the links in the body are the same** can be very impactful.

This changes your links from:

```
https://039357829384.supabase.co/auth/v1/{code}
```

To something like this:

```
https://auth.yourdomain.com/auth/v1/{code}
```

Supabase has a helpful guide for [Setting up a custom domain](https://supabase.com/docs/guides/platform/custom-domains).

## 2. Setup a dedicated subdomain

There are many benefits to using a subdomain vs your root domain for sending, one being that you can isolate the reputation of the subdomain from your root domain.

For authentication emails, using a subdomain is particularly helpful because it is a way to **signal your intention to the inbox provider**. For example, if you use `auth.yourdomain.com` for your authentication emails, you are communicating to the inbox provider that all emails from this subdomain are related to sending authentication emails.

This clarity is essential because it helps the inbox provider understand that this subdomain is not used for sending marketing emails, which are more likely to be marked as spam.

<Note>
  If you don't want a subdomain just for auth, you can also achieve this by
  establishing one subdomain for all your transactional emails (e.g.,
  `notifications.yourdomain.com`).
</Note>

To add a subdomain to Resend, you can [add it as a domain on the dashboard](https://resend.com/domains).

<img alt="Create auth subdomain" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/kb-create-auth-subdomain.png" />

## 3. Disable link and open tracking

Link and open tracking can be great for marketing emails but not for transactional emails. This kind of **tracking can actually hurt your deliverability**. Open tracking embeds a 1x1 pixel image in the email, and link tracking rewrites the links in the email to point to Resend's servers first. Both types can be seen as suspicious by the inbox provider and hurt your deliverability.

Also, Supabase has noted that link tracking is [known for corrupting verification links](https://supabase.com/docs/guides/platform/going-into-prod), making them unusable for your users.

You can disable link and open tracking by clicking on your domain and disabling at the bottom.

<img alt="Disable link and open tracking" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/kb-disable-tracking.png" />

## 4. Prepare for link scanners

Some inbox providers or enterprise systems have email scanners that run a `GET` request on all links in the body of the email. This type of scan can be problematic since Supabase Auth links are single-use.

To get around this problem, consider altering the email template to replace the original magic link with a link to a domain you control. The domain can present the user with a "Sign-in" button, which redirects the user to the original magic link URL when clicked.

## 5. Setup DMARC

Like our human relationships, email deliverability is built on trust. The more inboxes can trust your emails, your domain, and your sending, the more likely your emails will be delivered to the inbox. This makes [Email Authentication a critical pillar](https://resend.com/blog/email-authentication-a-developers-guide) in the journey to excellent deliverability.

That is where DMARC comes in. As the industry standard for email authentication, **DMARC is a way to tell the inbox provider that you are who you say you are**. It is a way to signal to the inbox provider that you are a legitimate sender and that your emails should be delivered to the inbox.

Following security best practices like DMARC will show your validity and authenticity.

<img alt="DMARC policy details" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/kb-dmarc.png" />

You can use our [DMARC setup guide to get started](/dashboard/domains/dmarc).

# How do I set up Apple Branded Mail?

> Learn how to implement Apple Branded Mail to display your logo in Apple Mail clients.

## Prerequisites

To get the most out of this guide, you will need to:

* [Create an Apple Business Connect account](https://www.apple.com/business/connect/)
* [Setup DMARC on your domain](/dashboard/domains/dmarc)
* A company identification number for Apple to verify your company

Prefer watching a video? Check out our video walkthrough below.

<div className="aspect-video">
  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/zLDRvWVPqxk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</div>

## What is Apple Branded Mail?

Apple Branded Mail is a proprietary Apple format that displays your logo as an avatar in the inbox of Apple Mail. Displaying your logo can increase brand recognition and trust and improve engagement.

There are a few benefits of Apple Branded mail over BIMI:

* Since it's an Apple format, it does not require a certificate like [BIMI does](/dashboard/domains/bimi).
* The image support is broader, supporting `.png`, `.heif`, and `.jpg` logos.

Since Apple Branded Mail works only with Apple Mail on new iOS, iPadOS, and macOS versions, your logo will not show in other mail clients or older versions of Apple Mail.

For this reason, we recommend following all possible methods for adding your logo to your emails, including Apple Branded Mail, [our general guide](/knowledge-base/how-do-i-send-with-an-avatar), and [BIMI](/dashboard/domains/bimi) if it fits your needs.

## Implementing Apple Branded Mail

### 1. Configure DMARC

<Note>
  If you haven't set up DMARC yet, follow our [DMARC Setup
  Guide](/dashboard/domains/dmarc).
</Note>

To ensure your logo appears with Apple Branded Mail, set your DMARC policy to either `p=quarantine;` or `p=reject;`. This policy guarantees that your emails are authenticated and prevents others from spoofing your domain and sending emails with your logo.

Here's an overview of the required parameters:

| Parameter | Purpose    | Required Value                 |
| --------- | ---------- | ------------------------------ |
| `p`       | Policy     | `p=quarantine;` or `p=reject;` |
| `pct`     | Percentage | `pct=100;`                     |

Here is an example of an adequate DMARC record:

```
"v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarcreports@example.com"
```

As we mention in our [DMARC Setup Guide](/dashboard/domains/dmarc), be sure to test your emails to make sure they are passing DMARC before changing your DMARC policy to `p=quarantine;` or `p=reject;`.

### 2. Create an Apple Business Connect account

Apple displays the logo you set in your Business Connect account. [Create an account](https://www.apple.com/business/connect/) if your company does not already have one. Make sure to use your company details when signing up.

### 3. Add your company details

Apple will prompt you to provide details like your company address and name.

### 4. Add your brand details

Once your company account is created, in Apple Business Connect, select the **Branded Mail** option in the left sidebar and provide details on your brand. Add details like the brand name and your brand website.

![Add your brand details](https://mintlify.s3.us-west-1.amazonaws.com/resend/images/abm-step-4-add-brand-details-1.png)

![Add your brand details](https://mintlify.s3.us-west-1.amazonaws.com/resend/images/abm-step-4-add-brand-details-2.png)

### 5. Add your logo

Once you fill out the brand details, upload your logo. Apple requires the logo to be at least 1024 x 1024 px in a `.png`, `.heif`, or `.jpeg` format.

![Add your logo](https://mintlify.s3.us-west-1.amazonaws.com/resend/images/abm-step-5-add-your-logo.png)

### 6. Add your domain

Confirm the domains or email addresses where you want your brand logo to appear.

You can register your logo for your root domain or a subdomain. If you don't set a specific logo for a subdomain, the root domain logo will automatically display for any email sent from your subdomains.

### 7. Verify your company

Apple requires details to confirm your company identity.

If you're in the United States, provide a Federal Taxpayer Identification Number. Other countries will use a local equivalent for this step. Apple also asks that you add a DNS record to verify DNS access.

### 8. Verify with Apple

After you submit all your information, Apple will verify your details. This process may take up to seven business days.

Once the logo is verified, Apple will send an email notification and note the verified status in Branded Mail. Your logo will start to display in compatible Apple Mail versions.

![Verified logo](https://mintlify.s3.us-west-1.amazonaws.com/resend/images/abm-step-8-verify-with-apple.png)

<Tip>
  See Apple's documentation on [Apple Branded
  Mail](https://support.apple.com/en-au/guide/apple-business-connect/abcb761b19d2/web)
  for any detailed questions on adding your logo.
</Tip>

# How do I send with an avatar?

> Learn how to show your avatar in the inbox of your recipients.

[Recent studies](https://www.businesswire.com/news/home/20210720005361/en/Red-Sift-and-Entrust-Survey-Showing-a-Logo-Positively-Affects-Consumer-Interaction-With-Emails-Open-Rates-Buying-Behavior-Brand-Recall-and-Confidence) are showing meaningful benefits of displaying your logo in the inbox:

* Increases brand recall by 18%.
* Improves open rate by 21%.
* Boosts purchase likelihood by 34%.
* Reinforces confidence in email by 90%.

![Email with an avatar](https://mintlify.s3.us-west-1.amazonaws.com/resend/images/sender-avatar.png)

## Gmail

Follow these steps to add an avatar to your Gmail inbox:

1. Go to your [Google Account Settings](https://myaccount.google.com/personal-info)
2. Upload a profile picture

Avatars in Gmail only display in the mobile app (including in push notifications) and inside opened emails on desktop.

## Outlook

Follow these steps to add an avatar to your Outlook inbox:

1. Go to your [Outlook Profile Settings](https://account.microsoft.com/profile/)
2. Upload a profile picture

Avatars in Outlook only display in the mobile app and inside opened emails on desktop.

## Yahoo

Follow these steps to add an avatar to your Yahoo inbox:

1. Go to your [Yahoo Account Setting](https://login.yahoo.com/account/personalinfo)
2. Upload a profile picture

Avatars in Yahoo only display in the mobile app and inside an opened email on desktop.

## Apple Mail

Apple Mail only shows avatars if recipients have added images to contacts. Alternatively, you can set up [Apple Branded Mail](/knowledge-base/how-do-i-set-set-up-apple-branded-mail), a proprietary Apple format that displays your logo as an avatar in the inbox of Apple Mail, or [set up BIMI](/dashboard/domains/bimi#what-is-bimi) with a Verified Mark Certificate (Apple Mail does not support CMC).

## Using Gravatar

Some inbox service providers or email clients (e.g. Thunderbird, Airmail, and Postbox) rely on [Gravatar](https://gravatar.com/) to display an image.

You can set up a free Gravatar account, add your avatar, and verify your addresses you're sending from to that account to have your avatar displayed.

## Limitations

Almost every email provider has its own way of adding a profile picture to an inbox.

This means **you can only**:

1. Add your avatar to a real inbox, limiting it only to that provider
2. Send mail from the same address that you set the avatar on

The way around this is [BIMI (Brand Indicators for Message Identification)](/dashboard/domains/bimi). It is much more difficult to obtain, but supports by nearly all providers and allows you to send from any address on that domain.

<Note>
  Need assistance setting up BIMI? [We can help](https://resend.com/help).
</Note>

# How to set up E2E testing with Playwright

> End to end testing ensures your entire app flow is fully functioning.

Below is a basic guide on setting up E2E testing with NextJS, Resend, and Playwright.

Prefer watching a video? Check out our video walkthrough below.

<div className="aspect-video">
  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/lzozXSMKl6E" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
</div>

## 1. Create an endpoint.

For simplicity, we'll create a GET endpoint that sends an email to the testing account, `delivered@resend.dev` on fetch.

```ts app/api/send/route.ts
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'Hello world',
      html: '<h1>Hello world</h1>',
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
```

## 2. Write the test spec file

Create a test spec file at `e2e/app.spec.ts`. You can test in two ways:

### Option 1: Call the Resend API

Calling the Resend API tests the entire API flow, including Resend's API responses, but counts towards your account's sending quota.

```ts e2e/app.spec.ts
import { test, expect } from '@playwright/test';

test('does not mock the response and calls the Resend API', async ({
  page,
}) => {
  // Go to the page
  await page.goto('http://localhost:3000/api/send');

  // Assert that the response is visible
  await expect(page.getByText('id')).toBeVisible();
});
```

### Option 2: Mock a response

Mocking the response lets you test *your* app's flow without calling the Resend API and impacting your account's sending quota.

```ts e2e/app.spec.ts
import { test, expect } from '@playwright/test';

test("mocks the response and doesn't call the Resend API", async ({ page }) => {
  // Sample response from Resend
  const body = JSON.stringify({
    data: {
      id: '621f3ecf-f4d2-453a-9f82-21332409b4d2',
    },
  });

  // Mock the api call before navigating
  await page.route('*/**/api/send', async (route) => {
    await route.fulfill({
      body,
      contentType: 'application/json',
      status: 200,
    });
  });
});
```

<Note>
  However you test, it's important to test using a test email address (e.g.,
  [delivered@resend.dev](mailto:delivered@resend.dev)) so your tests don't impact your deliverability. Resend's
  [test accounts](/dashboard/emails/send-test-emails) run through the entire API
  flow without harming your reputation.
</Note>

## 3. Create a Playwright config file

Write your config file, paying special attention to a few properties:

* `testDir`: the directory containing your test files
* `outputDir`: the directory to store test results
* `webServer`: provide instructions for Playwright to run your app before starting the tests
* `projects`: an array of the browsers you want to test

```ts playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const baseURL = 'http://localhost:3000';

export default defineConfig({
  timeout: 30 * 1000,
  testDir: path.join(__dirname, 'e2e'),
  retries: 2,
  outputDir: 'test-results/',
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },

  use: {
    baseURL,
    // Retry a test if its failing with enabled tracing. This allows you to analyze the DOM, console logs, network traffic etc.
    trace: 'retry-with-trace',
  },

  projects: [
    // Test against desktop browsers.
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'Desktop Firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'Desktop Safari',
      use: {
        ...devices['Desktop Safari'],
      },
    },
    // Test against mobile viewports.
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'Mobile Safari',
      use: devices['iPhone 12'],
    },
  ],
});
```

[See the Playwright docs](https://playwright.dev/docs/intro) for more help.

## 4. Run the test

You can run the test by installing Playwright and running the tests.

```bash
npx playwright install
npx playwright test
```

Playwright will run the tests in the browsers of your choice and show you the results.

<Card title="Example repo" icon="arrow-up-right-from-square" href="https://github.com/resend/resend-nextjs-playwright-example">
  See the full source code.
</Card>

# What email addresses to use for testing?

> Learn what email addresses are safe to use for testing with Resend

## Safe email addresses for testing

When testing email functionality, it's important to use designated test addresses to avoid unintended consequences like deliverability issues or spam complaints.

Resend provides a set of safe email addresses specifically designed for testing, ensuring that you can simulate different email events without affecting your domain's reputation.

### Why not use @example.com or @test.com?

Many developers attempt to use domains like `@example.com` or `@test.com` for testing purposes. However, these domains are not designed for email traffic and often reject messages, leading to bounces.

A high bounce rate can negatively impact your sender reputation and affect future deliverability. To prevent this, Resend blocks such addresses and returns a `422 Unprocessable Entity` error if you attempt to send to them.

### List of addresses to use

To help you safely test email functionality, Resend provides the following test addresses, each designed to simulate a different delivery event:

| Address                | Delivery event simulated |
| ---------------------- | ------------------------ |
| `delivered@resend.dev` | Email being delivered    |
| `bounced@resend.dev`   | Email bouncing           |

Using these addresses in your tests allows you to validate email flows without risking real-world deliverability problems. For more help sending test emails, see our [testing documentation](/dashboard/emails/send-test-emails).

Whether you need to confirm that an email has been sent, track engagement events, or simulate a bounce scenario, these addresses provide a controlled and predictable way to test your email integration with Resend.

# How do I avoid Gmail's spam folder?

> Learn how to improve inbox placement in Gmail.

<Note>
  This guide is adapted from Google's article to [Prevent mail from being
  blocked or sent to
  spam](https://support.google.com/mail/answer/81126?hl=en\&vid=1-635789122382665739-3305764358\&sjid=4594872399309427672-NA#thirdparty)
</Note>

## Authenticate Your Email

All communication is built on trust, and email is no different. When you send an email, you want to be sure that the recipient (and Gmail) knows who you are and that you are a legitimate sender. Email authentication is a way to prove that an email is really from you. It also helps to prevent your email from being spoofed or forged.

| Authentication                    | Requires Setup | Purpose                                                      |
| --------------------------------- | -------------- | ------------------------------------------------------------ |
| **SPF**                           | No             | Proves you are allowed to send from this domain              |
| **DKIM**                          | No             | Proves your email originated from you                        |
| [DMARC](/dashboard/domains/dmarc) | Yes            | Proves you own the domain and instructs how to handle spoofs |
| [BIMI](/dashboard/domains/bimi)   | Yes            | Proves you are the brand you say you are                     |

**SPF** and **DKIM** are baseline requirements for all sending which is why both are automatically setup when you verify your domain with Resend. [DMARC](/dashboard/domains/dmarc) and [BIMI](/dashboard/domains/bimi) are both additional authentication methods that can build trust and further improve inbox placement.

**Action Items**

1. [Setup DMARC](/dashboard/domains/dmarc) for your domain
2. [Setup BIMI](/dashboard/domains/bimi) for your domain

## Legitimize Your Domain

Gmail is using many methods to identify who you are as a sender, and one way they do that is by looking at your domain. You should make sure that the domain you send with is the same domain where your website is hosted. If you send from `@example.com` but your website is hosted at `example.net`, Gmail won't be able to use your site to help legitimize you.

You can regularly check if your domain is listed as unsafe with [Google Safe Browsing](https://transparencyreport.google.com/safe-browsing/search?hl=en) to make sure Google isn't classifying your domain as suspicious.

**Action Items**

1. Host your website at the domain that you send from (especially for new domains)
2. Check if your domain is listed as unsafe with [Google Safe Browsing](https://transparencyreport.google.com/safe-browsing/search?hl=en)

## Manage your Mailing List

Gmail monitors your sending across all Gmail inboxes to see if recipients want to receive your emails. This is mainly measured by their engagement with your messages (opens, clicks, replies). If Gmail doesn't see this engagement, they will start to move your inbox placement towards promotional or even spam.

It would seem like adding open and click tracking would be ideal to gather this information, but this has been seen to negatively impact your inbox placement. Instead, focus on sending to recipients who want to receive your emails.

**Prevent sending to recipients who**:

* Didn't ask to be sent to (opt-in)
* Show no signs of engagement with your emails or product
* Requested to be unsubscribed
* Marked your emails as spam (complained)
* Never received your email (bounced)

**Action Items**

1. Make it easy to opt-out to your emails (including the [Unsubscribe Headers](https://resend.com/docs/dashboard/emails/add-unsubscribe-to-transactional-emails))
2. Use [Webhooks](/dashboard/webhooks/introduction) to remove bounced or complained recipients from your list
3. Use [Gmail's Postmaster Tool](https://support.google.com/mail/answer/9981691?sjid=4594872399309427672-NA\&visit_id=638259770782293948-1913697299\&rd=1) to monitor your spam reports

## Monitor Affiliate Marketers

Affiliate marketing programs offer rewards to companies or individuals that send visitors to your website. However, spammers can take advantage of these programs. If your brand is associated with marketing spam, other messages sent by you might be marked as spam.

We recommend you regularly monitor affiliates, and remove any affiliates that send spam.

**Action Items**

1. Monitor your affiliate marketers for any spam

## Make Content People Want to Read

Trust is not only built with the domain, but also in the message. Sending content that people want to read and that is not misleading will help build trust with Gmail.

A few good rules for content:

* Less is more (keep it simple and to the point)
* Plain text over complex HTML
* Links should be visible and match the sending domain
* No content should be hidden or manipulative

**Action Items**

1. Reduce and simplify your email content
2. Make sure your links are using your sending domain

## Establish Sending Patterns

This is especially true for new domains since Gmail doesn't have any history of trust. Sending a large volume of emails from a new domain will likely result in poor inbox placement. Instead, start small and build up your sending volume over time.

A great way to start is by sending regular person-to-person email with your gmail account. These messages will have high engagement and built trust quickly, which will carry over when you start integrating with a sending service like Resend.

It can also be very helpful to segment your sending by sending address to give Gmail more indication of what type of sending you are doing. This allows Gmail to place your emails in the correct inbox tab (Primary, Promotions, etc.).

Some examples of helpful email addresses:

* **Personal emails** should come from an address with a name like [marissa@domain.com](mailto:marissa@domain.com)
* **Transactional emails** should come from an address like [notifications@domain.com](mailto:notifications@domain.com)
* **Marketing emails** should come from an address like [updates@domain.com](mailto:updates@domain.com).

**Action Items**

1. Send emails from your gmail account before sending transactional
2. Send transactional emails before sending marketing emails
3. Choose dedicated sending addresses for each type of email

## Summary

Email deliverability is overwhelming. One way to simplify it is to think: **what would a phisher do?**

**Then do the opposite!**

Gmail's goal is to only show emails that their users want to see and malicious emails are at the very bottom of the list. Reverse engineer phishing sending habits and consider how you could prove to Gmail at each step that you clearly have no malicious intent.

<Info>Anything we missed? [Let us know](https://resend.com/help).</Info>

# How do I avoid Outlook's spam folder?

> Learn how to improve inbox placement in Outlook.

<Note>
  This guide is adapted from Microsoft's article to [Improve your spam
  reputation](https://support.microsoft.com/en-us/office/sender-support-in-outlook-com-05875e8d-1950-4d89-a5c3-adc355d0d652)
</Note>

* **Add your sender name**. Set your `from` like this: `"Name <name.domain.com>"`.

* **Engage with your own email**. Send an email to yourself, open it, and reply to it.

* **Add yourself as a contact**. See how to add contacts in [Outlook.com](https://support.microsoft.com/en-us/office/create-view-and-edit-contacts-and-contact-lists-in-outlook-com-5b909158-036e-4820-92f7-2a27f57b9f01).

* **Ask your recipients to add you in their contacts**. This can be done in [Outlook](https://support.microsoft.com/en-us/office/add-recipients-of-my-email-messages-to-the-safe-senders-list-be1baea0-beab-4a30-b968-9004332336ce) or [outlook.com](https://support.microsoft.com/en-us/office/safe-senders-in-outlook-com-470d4ee6-e3b6-402b-8cd9-a6f00eda7339).

* **Don't blast to a BCC list**. Send separate emails if you are sending to a large number of recipients.

* **Prevent over sending**. Limits are impacted on historical engagements and sending volumes, but you should be hesitent to send too many emails at once. If you think this is an issue, reduce the frequency or volume.

* **Send to engaged recipients**. Don't keep sending if there is no engagement from your recipients. This is especially true if a recipient has requested to unsubscribe or an address is bouncing.

* **Limit use of HTML**. Keep emails as close to plain text as possible.

# How do I fix CORS issues?

> Information on recommended options to avoid CORS errors when sending emails.

## Problem

It's common for people to hit CORS (Cross-Origin Resource Sharing) issues when using the Resend API. This error typically shows as:

```
Access to XMLHttpRequest at 'https://api.resend.com/emails'
from origin 'http://localhost:3000' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Solution

Usually CORS errors happens when you're sending emails from the **client-side**.

We recommend you to send the emails on the **server-side** to not expose your API keys and avoid CORS issues.

# Why are my emails landing on the Suppression List?

> Learn why your emails land on the Suppression List and how to remove them.

When sending to an email address results in a hard bounce, Resend places this address on the Suppression List. Emails placed on the list cannot be sent to until they are removed.

<Info>
  We place emails on the Suppression List to protect domain reputation, both
  yours and ours. Sending an email to a known hard bounce recipient can damage
  domain reputation and affect email deliverability.
</Info>

## Reasons emails are placed on the Suppression List

Here are some possible reasons an email address is placed on the Suppression List:

* The recipient's email address **contains a typo**.
* The recipient's email address **doesn't exist**.
* The recipient's email server has **permanently blocked delivery**.

## View email bounce details

You can view the reason an email bounced on the [Emails](https://resend.com/emails) page. Open the [Emails](https://resend.com/emails) page and search for the recipient's email address in question.

A human-readable summary of the reason for the bounce displays. For more technical details and suggested next steps, click the **See details** button.

<img alt="Email Bounced button" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/email-suppression-list-1.png" />

## Removing an email address from the Suppression List

You may be able to send a message to the same recipient in the future if the issue that caused the message to bounce is resolved and the email address is removed from the Suppression List.

<Warning>
  Remember, if you do not address the issue that caused the email to bounce, the
  email address will return to the Suppression List the next time you attempt to
  send to it.
</Warning>

To remove your recipient from the Suppression List, click on the email in the [emails dashboard](https://resend.com/emails), and click **Remove from suppression list**.

<img alt="Email Bounced button" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/email-suppression-list-2.png" />

# Can I receive emails with Resend?

> Resend does not offer the functionality to receive email but there are a few workarounds that could help.

You can't receive emails within Resend (yet), but you can [set a Reply To Address](api-reference/emails/send-email) (`reply_to`) on your email to direct any responses to a different location like an existing inbox, slack channel, etc.

Until we add email receiving within Resend, here are a few workarounds that could help:

* **Sending to existing inbox**: You could set the `reply_to` as your personal email address. If any recipient replies to your email, it will be sent to the `reply_to` address. This could be a different address on the same domain, or a different domain entirely.
* **Sending to Slack**: You could set the `reply_to` as a [channel email address in Slack](https://slack.com/help/articles/206819278-Send-emails-to-Slack). This will create a new message in slack with the contents of the reply.

# Is it better to send emails from a subdomain or the root domain?

> Discover why sending emails from a subdomain can be better than using a root domain.

We recommend sending emails from a subdomain (`notifications.acme.com`) instead of your root/apex domain (`acme.com`).

There are **two main goals you should achieve with your domain setup**:

* Reputation Isolation
* Sending Purpose Transparency

## Reputation Isolation

Things happen. Maybe someone decides to DDOS your signup page and you get stuck sending tens of thousands of bounced verification emails to burner addresses. Or maybe a cold outreach campaign gets out of hand and your sending gets pegged as spam.

Whatever it is, you want to be consistently hedging your reputation. One way to do this is by not using your root domain. This allows you to quarantine a compromised subdomain if needed. If your root domain ends up with a jeopardized reputation, it can be a long road to recovery.

## Sending Purpose Transparency

All of us want all of our emails to go right to the top of the priority folder of the inbox, but the reality is, not all of our email should. A password reset email should have higher priority than a monthly product update. Inbox providers like Outlook and Gmail are constantly trying to triage incoming mail to put only the most important stuff in that priority spot, and move the rest towards Promotional or even Spam.

By segmenting your sending purposes by subdomain, you are giving Inbox Providers clear indication of how they should place your emails, which will build trust and confidence.

## Avoid "Lookalike" Domains

Never use domains that look like your main brand but aren’t actually your main brand. These brand-adjacent domains like `getacme-mail.com` or `acme-alerts.com` can appear suspicious to spam filters and confusing to your recipients. Inbox providers may flag them as phishing or spoofing attempts, and your users are more likely to ignore, delete, or even report the emails as spam.

If you’re launching a new project or sending for a different purpose, again use a subdomain of your main domain. Sticking with clear, consistent subdomains helps reinforce your brand identity and builds trust with inbox providers and recipients alike.

<Note>
  We cover this in depth in our [deliverability
  guide](/knowledge-base/how-do-i-avoid-gmails-spam-folder#establish-sending-patterns).
</Note>

# What if an email says delivered but the recipient has not received it?

> Learn the steps to take when an email is delivered, but the recipient does not receive it.

Some emails may be marked as `Delivered` but not reach the recipient's inbox due to various inbox sorting variables. This guide provides reasons for and advice on avoiding such issues.

## Why does this happen

When an email is sent, it is marked as `Delivered` once the recipient server accepts it with a `250 OK` response. However, the server can then direct the email to the inbox, queue it for later, route it to the spam folder, or even discard it. This is done by major inbox providers (e.g., Gmail, Yahoo, Outlook), as well as by IT departments and individual users who set up firewalls or filtering rules.

As a result, even though most legitimate emails should land in the intended inboxes, your message might end up in the spam/junk folder or, in rare cases, be deleted.

**Inbox Providers do not share any information on how the messages are later filtered.** Resend is only notified about the initial acceptance and marks the email as `Delivered`. Any subsequent events (e.g., open/click events, unsubscribes) require recipient engagement.

## How to avoid this

### If you are in contact with the user

The easiest way to solve this is by cooperating with the end user. If you have direct communication with the recipient, you can ask them to **check these places for your email**:

* Corporate spam filters or firewalls
* Personal inbox filtering
* Promotional, spam, or deleted folders
* Group inboxes or queues

If they find it, ask them to mark the email as `Not Spam` or add your domain to an allowlist.

### If you are not in contact with the user

Debugging without direct contact with the user is challenging. However, there are some optimizations that can **improve your chances of delivering to their inbox next time**:

* [Configure DMARC](/dashboard/domains/dmarc) to build trust with the inbox provider
* Warm up new domains slowly before sending large volumes
* Change all links in your email to use your own domain (matching your sender domain)
* Turn off open and click tracking
* Reduce the number of images in your email
* Improve wording to be succinct, clear, and avoid spammy words

We have an [extensive but practical deliverability guide](/knowledge-base/how-do-i-avoid-gmails-spam-folder) that covers these topics in more detail.

# Why are my open rates not accurate?

> Learn why your open rate statistics are not accurate and what you can do about it.

## How are open rates tracked?

A 1x1 pixel transparent GIF image is inserted in each email and includes a unique reference. When the image is downloaded, an open event is triggered.

## Why are my open rates not accurate?

Open tracking is generally not accurate because each inbox handles incoming email differently.

**Clipped messages in Gmail** happen when you send a message over 102KB. A message over this size won’t be counted as an open unless the recipient views the entire message. Resend’s Deliverability Insights on the email will note if a message exceeds this threshold.

**Some inboxes do not download images by default** or block/cache assets with a corporate firewall. This approach can prevent the open event from being tracked.

**Other inboxes open the email prior to delivering** in order to scan for malware or to [protect user privacy](https://www.apple.com/newsroom/2021/06/apple-advances-its-privacy-leadership-with-ios-15-ipados-15-macos-monterey-and-watchos-8/). This approach can trigger an open event without the recipient reading your email.

Because of this, open tracking is **not a statistically accurate way** of detecting if your users are engaging with your content.

## Does open tracking impact inbox placement?

Though open tracking should not impact if your email is delivered, it most likely will impact your inbox placement. Trackers are generally **used by marketers and even spammers**. Because of this, inbox providers will often use open tracking as a signal that your email is promotional, or even spam, and categorize accordingly.

**We suggest disabling open rates for transactional email**, to maximize inbox placement.

## What's the alternative?

Instead of relying on open rates, there are a few other ways to still understand your sending.

1. **Track Clicks:** Monitoring the link clicks is an even more granular way to know how a recipient engaged with your email. By knowing if they clicked, you also know that they read parts of your email and took action.
2. **Track Outside the Inbox:** Often emails are sent as a means to an end. Maybe it's to increase page visits of an announcement or convert free users to paid. Tracking your sending by metrics outside of the inbox can be a great way to understand the true impact of your sending.

# Audience Hygiene: How to keep your Audiences in good shape?

> Learn strategies for maintaining good audience hygiene and maximizing email deliverability.

Audience hygiene (*also known as list hygiene*) refers to the practice of keeping your email list clean, valid, and engaged.

Maintaining proper audience hygiene is crucial for ensuring that your emails reach their intended recipients, maximizing your deliverability, and improving your sender reputation.

By removing invalid, outdated, or disengaged contacts, you can improve the effectiveness of your email campaigns and avoid issues like high bounce rates, low engagement, and even being marked as spam.

***

# How to ensure emails are valid?

To keep your list healthy, it's essential to ensure that the email addresses you collect are valid, accurate, and belong to recipients who are truly interested in hearing from you. Here are a few strategies to help you achieve this:

### Prevent undesired or bot signups with CAPTCHA

Bots can easily sign up for your emails, inflating your list with fake or low-quality contacts. To prevent this, implement CAPTCHA systems during your sign-up process. CAPTCHA challenges help ensure that sign-ups are coming from human users and not automated scripts.

Some popular CAPTCHA services include:

* **[Google reCAPTCHA](https://developers.google.com/recaptcha)**: One of the most widely used CAPTCHA services, offering both simple and advanced protection options.
* **[hCaptcha](https://www.hcaptcha.com/)**: An alternative to Google reCAPTCHA, providing similar protection but with a different user experience.
* **[Friendly Captcha](https://friendlycaptcha.com/)**: A privacy-focused CAPTCHA solution that doesn’t require users to click on anything, reducing friction in the sign-up process.

Using these tools will help reduce bot sign-ups and ensure your email list consists of real users.

### Ensure the recipient is consenting with Double Opt-In

Double opt-in is the process of confirming a user's subscription after they’ve signed up for your emails.

When a user submits their email address, you send them a confirmation email with a link they must click to complete the subscription process.

This step ensures that the person who entered the email address is the one who actually wants to receive your communications.

This is important to ensure:

* **Compliance with local regulations**: Double opt-in helps ensure that you comply with email marketing regulations such as the **CAN-SPAM Act** (U.S.) and **CASL** (Canada). Both of these laws require clear consent from subscribers before you can send them marketing emails.
* **Improved deliverability**: Double opt-in helps you maintain a clean list of genuinely interested users. This reduces bounce rates and prevents spam complaints, which in turn helps maintain your sender reputation with ISPs and inbox providers.
* **Verification of accuracy**: Double opt-in ensures the email addresses you collect are valid, accurate, and up to date, reducing the risk of sending to invalid addresses and impacting your deliverability.

### Use a third-party service to verify an address' deliverability

While you can verify that an email address follows the correct syntax (e.g., [user@example.com](mailto:user@example.com)) (also known as RFC 5322), you also need to ensure that the address is deliverable—that is, it’s an active inbox that can receive emails.

Third-party email verification services can help you identify whether an email address is valid, reachable, or likely to result in a bounce.

This reduces the risk of sending to addresses that won’t receive your emails and improves your overall deliverability.

Some email verification services include:

* **[Emailable](https://emailable.com/partners/resend)**
* **ZeroBounce**
* **Kickbox**

By using these services, you can clean up your existing email lists or prevent undeliverable emails to be added to them. This helps prevent unnecessary deliverability issues.

***

# How to proactively remove emails from your Audiences

Over time, certain recipients may become disengaged with your content. It's important to manage your audience by removing inactive or unengaged users.

Regularly filtering your audiences ensures that you're sending to only those who are actively interested, which in turn boosts engagement and deliverability.

A healthy email list is one that is continuously nurtured with relevant and timely content. Instead of sporadic communication, maintain consistent engagement with your audience to keep them interested.

### Filter on engagement

To keep your email list in top shape, focus on sending to engaged users. Major inbox providers like Gmail and Microsoft expect you to send emails to recipients who have recently opened or clicked on your emails.

As a best practice, you should limit non-transactional email sends to recipients who have opened or clicked an email in the past 6 months.

<Info>
  The exact timeframe may vary depending on your industry, sending frequency,
  and audience behavior, but 6 months is a generally accepted standard.
</Info>

Regularly cleaning your list of disengaged recipients helps maintain a positive sender reputation and boosts your chances of landing in the inbox instead of the spam folder.

### Automatically remove bounced recipients

Using our [Webhooks](/dashboard/webhooks/introduction), you can be notified when a delivery bounces or gets marked as spam by the recipient.

This is an opportunity to proactively unsubscribe the recipient and prevent further sending. Indeed, while Resend will automatically suppress further deliveries to that email address, we don't automatically unsubscribe it.

### Sunset unengaged recipients

If certain recipients have not engaged with your emails over an extended period (e.g., 6+ months), consider removing them from your Marketing sends.

Continuing to send to these unengaged users can harm your deliverability by increasing bounce rates and decreasing your open rates.

To re-engage these users, you may want to send a re-engagement campaign or offer an incentive for them to stay on your list. If they don't respond, it's often best to remove them to keep your list healthy and avoid wasting resources on inactive contacts.

***

By maintaining strong audience hygiene practices—including validating email addresses, ensuring consent, verifying deliverability, and removing unengaged recipients—you'll improve your email deliverability and foster better relationships with your subscribers.

This will help you achieve better engagement rates and a healthier sender reputation with inbox providers.

# Domain and/or IP Warm-up Guide

> Learn how to warm up a domain or IP to avoid deliverability issues.

Warming up a domain or IP refers to the practice of progressively increasing your sending volume to maximize your deliverability. The goal is to send at a consistent rate and avoid any spikes in email volume that might be concerning to inbox service providers.

Whenever you change your sending patterns—whether because you're using a new domain, a new IP, or a new vendor, or because your volume will increase—you should warm-up your domain and/or IP.

A thought-out warm-up plan limits greylisting and delivery throttling, as well as helping establish a good domain and IP reputation.

As your volume increases, you'll need to monitor your bounce rate to ensure it remains below 4%, and your spam rate below 0.08%. An increase in these rates would be a sign that your warm-up plan needs to be slowed down and an investigation into the root causes of the increases started.

Following these rules and metrics will establish a good domain reputation.

<Info>
  Each sender has different constraints and needs, so these numbers are meant as
  a baseline. Our [Support team](https://resend.com/help) can work with you on
  devising a plan adapted to your needs.
</Info>

# Existing domain

If you're already sending from an existing domain with established reputation and volumes, you can use the following guidelines to start sending with Resend.

| **Day** | **Messages per day** | **Messages per hour** |
| ------- | -------------------- | --------------------- |
| **1**   | Up to 1,000 emails   | 100 Maximum           |
| **2**   | Up to 2,500 emails   | 300 Maximum           |
| **3**   | Up to 5,000 emails   | 600 Maximum           |
| **4**   | Up to 5,000 emails   | 800 Maximum           |
| **5**   | Up to 7,500 emails   | 1,000 Maximum         |
| **6**   | Up to 7,500 emails   | 1,500 Maximum         |
| **7**   | Up to 10,000 emails  | 2,000 Maximum         |

# New domain

Before you start sending emails with a brand new domain, it's especially important to have a warm-up plan so you can maximize your deliverability right from the start.

| **Day** | **Messages per day** | **Messages per hour** |
| ------- | -------------------- | --------------------- |
| **1**   | Up to 150 emails     |                       |
| **2**   | Up to 250 emails     |                       |
| **3**   | Up to 400 emails     |                       |
| **4**   | Up to 700 emails     | 50 Maximum            |
| **5**   | Up to 1,000 emails   | 75 Maximum            |
| **6**   | Up to 1,500 emails   | 100 Maximum           |
| **7**   | Up to 2,000 emails   | 150 Maximum           |

# Warming up your Dedicated IP with Resend

In order for a Dedicated IP to be beneficial or useful, you first need to establish a certain sending volume and patterns. Once you've established this volume and these patterns, our [Support team](https://resend.com/help) can set it up for you.

We provide an automatic warm-up process so that you can simply focus on sending.

[Learn more about requesting a Dedicated IP](https://resend.com/docs/knowledge-base/how-do-dedicated-ips-work#how-to-request-a-dedicated-ip).

# What about third-party warm-up services?

We know email deliverability is important, and it can be tempting to use services promising quick fixes. However, using tools that artificially boost engagement can harm your long-term sender reputation. These services often rely on manipulating anti-spam filters, which can backfire as email providers like Gmail adjust their systems.

Instead, we recommend focusing on sustainable practices—such as sending relevant content, maintaining a clean list, and using proper authentication. These methods build trust with email providers and improve your deliverability over time.

# What are Resend account sending limits?

> Learn what different sending limits apply to accounts.

Resend regulates sending emails in two ways:

1. sending volume
2. sending rate

These limits help improve your deliverability and likelihood of reaching your recipient's inbox.

## Free Account Daily and Monthly Sending Limits

Free accounts have a daily sending limit of 100 emails/day and 3,000 emails/month. Multiple `To`, `CC`, or `BCC` recipients count towards this limit.

## Paid Plan Limit

* Transactional Pro and Scale plans have no daily limits, though the plan tier will dictate the monthly limit. To see your current month usage, view the [**Usage page**](https://resend.com/settings/usage). Multiple `To`, `CC`, or `BCC` recipients count towards the monthly limit.
* Marketing Pro plans have no sending limits.

## Rate Limits

All accounts start with a rate limit of 2 requests per second. The [rate limits](/api-reference/introduction#rate-limit) follow the [IETF standard](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers) for stating the rate limit in the response header. If you have specific requirements, [contact support](https://resend.com/help) to request a rate increase.

## Bounce Rate

All accounts must maintain a bounce rate of under **4%**. The [**Metrics page**](https://resend.com/metrics) within an account and/or [webhooks](https://resend.com/docs/dashboard/webhooks/event-types#email-bounced) allow you to monitor your account bounce rates.

Maintaining a bounce rate above 4% may result in a temporary pause in sending until the bounce rate is reduced.

Tips to keep a bounce rate low:

* Remove inactive user email addresses from email lists.
* Only send to recipients who have given consent to receive email.
* When testing, avoid sending to fake email addresses. Use Resend's [test email addresses](/dashboard/emails/send-test-emails) instead.
* If you are using open/click tracking, periodically remove recipients who are not engaging with your emails from your email lists.

## Spam Rate

All accounts must have a spam rate of under **0.08%**. The [**Metrics page**](https://resend.com/metrics) within an account and/or [webhooks](https://resend.com/docs/dashboard/webhooks/event-types#email-complained) allow you to monitor your account spam rates.

Maintaining a spam rate over 0.08% may result in a temporary pause in sending until the spam rate is reduced.

Tips to keep a spam rate low:

* Give recipients an easy way to opt-out of emails.
* Send relevant and timely emails.
* Only send to recipients who have given consent to receive email.

# What sending feature should I be using?

> How to pick between our different sending features depending on your number of recipients and the nature of the message.

Resend allows you to send both **Transactional** and **Marketing** emails.

## What's the difference between Transactional and Marketing emails?

### What is a Transactional email?

A **Transactional email** is a message triggered by a user action or required for legal compliance. These emails are essential communications that users **cannot unsubscribe** from. Common examples include:

* Order confirmations
* Password reset emails
* Account notifications

Typically, transactional emails are **1-to-1** messages sent in response to a specific event.

### What is a Marketing email?

A **Marketing email** is any email that is not transactional. These can be **promotional**, **informative**, or **general communication** messages.

Marketing emails are regulated by laws like **CAN-SPAM** (US) and **CASL** (Canada), and **recipients must have the option to unsubscribe**.

Examples of marketing emails:

* Promotional offers and discounts
* Newsletters
* Product updates

Marketing emails can be **1-to-1** (e.g., abandoned cart reminders) or **1-to-many** (e.g., newsletters).

## Should I be sending a Transactional or a Marketing email?

While not exhaustive, here's a table listing different examples of emails and the most appropriate type for each example.

| Type of Message    | Type of Recipient | Transactional | Marketing |
| ------------------ | ----------------- | ------------- | --------- |
| Order confirmation | Single            | ✓             | ⨯         |
| Password reset     | Single            | ✓             | ⨯         |
| Abandoned cart     | Single            | ⨯             | ✓         |
| Newsletter         | Multiple          | ⨯             | ✓         |
| Promotional offer  | Multiple          | ⨯             | ✓         |

## How to send an email with Resend?

### How to send a Transactional email?

You can send a Transactional email using:

* Our [Send Email API](/api-reference/emails/send-email)
* Our [Batch Send API](/api-reference/emails/send-batch-emails) (send up to 100 transactional emails in one API call)

### How to send a Marketing email?

You can send Marketing emails using:

* [Resend no-code Editor](/dashboard/broadcasts/introduction) – a collaborative interface for designing emails
* [Broadcast API](/api-reference/broadcasts/create-broadcast) – for programmatic sending

# Should I add an unsubscribe link to all of my emails sent with Resend?

> Learn best practices about using unsubscribe links.

Transactional emails are generally exempt from including an unsubscribe link. Unlike marketing emails, transactional emails serve a functional purpose, such as account confirmation, password resets, and order confirmations.

As a best practice, we recommend telling recipients how to opt out of receiving future email from you if the content is more related to nurturing relationships with your customers, rather than pragmatic, action-oriented emails.

Laws enforced by the FTC and GDPR prioritize giving recipients an easy way to give and withdraw their consent to recieving email marketing content. Additionally, not having an option for opting out of emails risks recipients complaining or marking the email as spam, which can hurt your reputation as a sender.

Here is more on how to [manually add and manage unsubscribe links](https://resend.com/docs/dashboard/emails/add-unsubscribe-to-transactional-emails).

If you're using [Resend Broadcasts](https://resend.com/docs/dashboard/audiences/managing-unsubscribe-list), the unsubscribe headers are added automatically to your emails. You can include the Unsubscribe Footer in your Broadcasts, which will be automatically replaced with the correct link for each contact or use `{{{RESEND_UNSUBSCRIBE_URL}}}` as a link target should you want to customize the unsubscribe footer.

# How do Dedicated IPs work?

> When are Dedicated IPs helpful, and how can they be requested.

## What is a Dedicated IP?

In email delivery, the sending IP address serves as a key identifier. Inbox Providers like Gmail track the reputation of these IPs based on the quality and quantity of emails sent from them, factoring this information into filtering and inbox placement decisions.

By default, all Resend users utilize our shared IPs, which are a collection of IPs shared across many senders. Optionally, you can purchase a dedicated IP pool so a range of IPs are exclusively assigned to your sending.

Resend goes one step further and exclusively provisions "Managed Dedicated IP Pools". These managed pools handle multiple delicate and time consuming aspects of dedicated IPs:

* **Automatic warmup**: New IPs have no reputation and are therefore under scrutiny by inbox providers. We carefully migrate your sending over from the shared pool to your dedicated pool.
* **Automatic scaling**: IPs can only send at a certain rate based on the specifications of each inbox provider. We scale your pool dynamically based on the inbox provider feedback, without you lifting a finger.
* **Continuous monitoring**: Resend continuously monitors the reputation and performance of your dedicated IPs.
* **Fully dedicated**: You can segregate your emails from sending on shared pools to reduce risk of "noisy neighbors".

<Note>
  Resend only provisions Managed Dedicated IP Pools, but we will refer to them
  as **Dedicated IPs** in this article to be succinct.
</Note>

## When are Dedicated IPs helpful?

Historically, Dedicated IPs were seen as the primary ingredient to great deliverability. This is not true anymore as Inbox Providers have incorporated dozens of other factors like sending history, domain reputation, and sending feedback (bounces and complaints) more predominantly than IP reputation.

Though Dedicated IPs are not a deliverability silver bullet, they maintain a very helpful benefit: **removing risk of noisy neighbors**.

There is power in numbers, and for many senders it can be very helpful to leverage the positive reputation of other senders in an IP pool. For some senders though, they want to maintain their own IP reputation without any chance of being impacted, positively or negatively, by other senders. For them, Dedicated IPs are a helpful solution.

## When are Dedicated IPs not helpful?

Dedicated IPs can be very helpful, but there are some situations where they can actually hinder your ability to reach the inbox. If any of these situations match your use case, Dedicated IPs may hinder more than help:

* **Low email volume**: Sending less than 30k emails a month may not be enough to keep the IPs warm.
* **Inconsistent sending**: Sudden changes in email volume can hurt your IP reputation.
* **Poor email practices**: A Dedicated IP simply exposes your sending behavior even more.
* **New sender**: If you're just starting out and have no sending history.
* **IP Allowlisting**: Resend does not expose the IPs included in your dedicated pool.

## How does IP warmup work?

With Resend's Managed Dedicated IP Pools, the warmup process is handled automatically:

1. **Automatic scaling**: Add or remove IP addresses based on your sending volume.
2. **Gradual increase**: Gradually increase the volume of emails sent through new IPs over time.
3. **Traffic distribution**: During warmup, traffic is distributed across shared and dedicated IPs.
4. **Reputation monitoring**: Continuously monitor the reputation of your dedicated IPs.
5. **Adaptive warmup**: Adapt the warmup process to your sending patterns.

Often IP warmup is a highly manual process and requires great care if you don't want a deliverability degradation in the process. With this automatic warmup process, we handle that for you so you can simply focus on sending.

<Note>
  Because Managed Dedicated IP Pools are dynamically scaled, **we do not expose
  the list of IPs** in your dedicated pool.
</Note>

## Requirements for a Dedicated IP

Before we can provision a Dedicated IP, **we require** that:

* Your domains are in the same region (Dedicated IPs are provisioned per region).
* Your sending volume exceeds 500 emails sent per day.
* You already have an active Transactional Scale or Marketing Pro subscription.
* All domains you want added to the Dedicated IP are already verified on Resend.

## How to request a Dedicated IP

You can request a Dedicated IP by [chatting with support](https://resend.com/help).

**We will request the following information**:

* What types of emails are you sending?
* How many emails are you sending per day and month on average?
* Is your sending consistent every day, or do you send in bursts?
* Which domains do you want included in your Dedicated IP?

 # How do I ensure sensitive data isn't stored on Resend?

> Information on how we can help you protect your customer's information.

Resend can turn off message content storage for teams with additional compliance requirements. This is available to customers who meet the following criteria:

1. The team has been a Resend Pro or Scale subscriber for at least 1 month.
2. The team is sending from a domain with an active website.
3. The team has sent over 3,000 emails with a \< 5% bounce rate.

This feature requires a \$50/mo add-on. If your account meets these requirements and you would like this turned on, contact our support team for help.

# What attachment types are not supported?

> Learn which file attachment extensions are unsupported.

Resend accepts all file attachment types except for those in the following list.

|          |       |       |         |           |
| -------- | ----- | ----- | ------- | --------- |
| .adp     | .app  | .asp  | .bas    | .bat      |
| .cer     | .chm  | .cmd  | .com    | .cpl      |
| .crt     | .csh  | .der  | .exe    | .fxp      |
| .gadget  | .hlp  | .hta  | .inf    | .ins      |
| .isp     | .its  | .js   | .jse    | .ksh      |
| .lib     | .lnk  | .mad  | .maf    | .mag      |
| .mam     | .maq  | .mar  | .mas    | .mat      |
| .mau     | .mav  | .maw  | .mda    | .mdb      |
| .mde     | .mdt  | .mdw  | .mdz    | .msc      |
| .msh     | .msh1 | .msh2 | .mshxml | .msh1xml  |
| .msh2xml | .msi  | .msp  | .mst    | .ops      |
| .pcd     | .pif  | .plg  | .prf    | .prg      |
| .reg     | .scf  | .scr  | .sct    | .shb      |
| .shs     | .sys  | .ps1  | .ps1xml | .ps2      |
| .ps2xml  | .psc1 | .psc2 | .tmp    | .url      |
| .vb      | .vbe  | .vbs  | .vps    | .vsmacros |
| .vss     | .vst  | .vsw  | .vxd    | .ws       |
| .wsc     | .wsf  | .wsh  | .xnk    |           |

# MCP Server

> Learn how to use the MCP Server to send emails.

## What is an MCP Server?

MCP is an open protocol that standardizes how applications provide context to LLMs. Among other benefits, it provides LLMs tools to act on your behalf.

If you prefer to watch a video, check out our video walkthrough below.

<iframe width="100%" class="aspect-video" src="https://www.youtube.com/embed/5QHOhvT-AFg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />

## What can Resend's MCP Server do?

Currently, Resend's MCP Server is a simple server you must build locally that can send emails using Resend's API on your behalf.

* Send plain text and HTML emails
* Schedule emails for future delivery
* Add CC and BCC recipients
* Configure reply-to addresses
* Customizable sender email (requires verification)

As an example, you could use this to run local scripts, chat with Claude, or process data and send the results to yourself or your team.

<video autoPlay muted loop playsInline className="w-full" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/mcp-server.mp4" />

## How to use Resend's MCP Server

Build the project locally to use this MCP server to use it in a [supported MCP client](#mcp-client-integrations).

<Steps>
  <Step title="Clone this project locally.">
    ```bash
    git clone https://github.com/resend/mcp-send-email.git
    ```
  </Step>

  <Step title="Build the project">
    ```
    npm install
    npm run build
    ```
  </Step>

  <Step title="Setup Resend">
    1. [Create an API Key](https://resend.com/api-keys): copy this key to your clipboard
    2. [Verify your own domain](https://resend.com/domains): to send to email addresses other than your own
  </Step>
</Steps>

## MCP Client Integrations

With the MCP server built, you can now add it to a supported MCP client.

### Cursor

<Steps>
  <Step title="Open Cursor Settings">
    Open the command palette (`cmd`+`shift`+`p` on macOS or `ctrl`+`shift`+`p` on Windows) and choose **Cursor Settings**.
  </Step>

  <Step title="Add the MCP server">
    Select **MCP** from the left sidebar and click **Add new global MCP server** and add the following config:

    ```json
    {
      "mcpServers": {
        "resend": {
          "type": "command",
          "command": "node ABSOLUTE_PATH_TO_MCP_SEND_EMAIL_PROJECT/build/index.js --key=YOUR_RESEND_API_KEY"
        }
      }
    }
    ```

    You can get the absolute path to your build script by right-clicking on the `/build/index.js` file in Cursor and selecting `Copy Path`.

    **Possible arguments**

    * `--key`: Your Resend API key (required)
    * `--sender`: Your sender email address from a verified domain (optional)
    * `--reply-to`: Your reply-to email address (optional)

    <Info>
      If you don't provide a sender email address, the MCP server will ask you to
      provide one each time you call the tool.
    </Info>

    Adding the MCP server to Cursor's global settings will let you send emails from any project on your machine using Cursor's Agent mode.
  </Step>

  <Step title="Test the sending">
    Test sending emails by going to `email.md` in the cloned project.

    * Replace the to: email address with your own
    * Select all text in `email.md`, and press `cmd+l`
    * Tell cursor to "send this as an email" in the chat (make sure cursor is in Agent mode by selecting "Agent" on lower left side dropdown).

    <img width="541" alt="Cursor chat with email.md file selected and Agent mode enabled" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/mcp-server-1.png" />
  </Step>
</Steps>

### Claude Desktop

<Steps>
  <Step title="Open Claude Desktop settings">
    Open Claude Desktop settings and navigate to the "Developer" tab. Click `Edit Config`.
  </Step>

  <Step title="Add the MCP server">
    Add the following config:

    ```json
    {
      "mcpServers": {
        "resend": {
          "command": "node",
          "args": ["ABSOLUTE_PATH_TO_MCP_SEND_EMAIL_PROJECT/build/index.js"],
          "env": {
            "RESEND_API_KEY": "YOUR_RESEND_API_KEY"
          }
        }
      }
    }
    ```

    You can get the absolute path to your build script by right-clicking on the `/build/index.js` file in your IDE and selecting `Copy Path`.

    **Possible environment variables**

    * `RESEND_API_KEY`: Your Resend API key (required)
    * `SENDER_EMAIL_ADDRESS`: Your sender email address from a verified domain (optional)
    * `REPLY_TO_EMAIL_ADDRESS`: Your reply-to email address (optional)

    <Info>
      If you don't provide a sender email address, the MCP server will ask you to
      provide one each time you call the tool.
    </Info>
  </Step>

  <Step title="Test the server">
    Close and reopen Claude Desktop. Verify that the `resend` tool is available in the Claude developer settings.

    <img alt="Claude Desktop developer settings with Resend MCP server showing" width="541" src="https://mintlify.s3.us-west-1.amazonaws.com/resend/images/mcp-server-2.png" />

    Chat with Claude and tell it to send you an email using the `resend` tool.
  </Step>
</Steps>

# How to add the Resend integration to your Create.xyz project

> Learn how to add the Resend integration to your Create.xyz project.

[Create](https://create.xyz) is a platform for building web sites, tools, apps, and projects via chat. With their [Resend integration](https://www.create.xyz/docs/integrations/resend), you can send emails from your Create project.
If you prefer to watch a video, check out our video walkthrough below.

<iframe width="100%" class="aspect-video" src="https://www.youtube.com/embed/Avp1OOMH2Z0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />

## 1. Call the Resend integration in Create

Type `/Resend` in the chat and select the integration, and ask Create to add email functionality to your project.

![adding the Resend integration to a Create chat](https://mintlify.s3.us-west-1.amazonaws.com/resend/images/create-xyz-integration.png)

## 2. Add your Resend API key

Create usually prompts you for a Resend API key, which you can add in the [Resend Dashboard](https://resend.com/api-keys). If Create doesn't prompt you for a Resend API key, click the **More options** <Icon icon="ellipsis-vertical" iconType="solid" /> button and select **Secrets**.

Click the <Icon icon="plus" iconType="solid" /> **Add new secret** button.

* **Name:** `RESEND_API_KEY`
* **Value:** Your Resend API key (e.g., `re_xxxxxxxxx0`)

Learn more about [Secrets in Create](https://www.create.xyz/docs/builder/functions#secrets).

## 3. Add a custom domain to your Resend account

By default, you can only send emails to your own email address.

To send emails to other email addresses:

1. Add a [custom domain to your Resend account](https://resend.com/domains).
2. Add the custom domain to the `from` field in the `resend` function in Create.

Learn more about [Functions in Create](https://www.create.xyz/docs/builder/functions).

# Send emails with Lovable and Resend

> Learn how to add the Resend integration to your Lovable project.

[Lovable](https://lovable.dev) is a platform for building web sites, tools, apps, and projects via chat. You can add Resend in a Lovable project by asking the chat to add email sending with Resend.

## 1. Add your Resend API key

To use Resend with Lovable, you'll need to add a Resend API key, which you can create in the [Resend Dashboard](https://resend.com/api-keys). Do not share your API key with others or expose it in the browser or other client-side code.

Lovable may integrate Resend in a few different ways:

* Use the Supabase integration to store the API key **(highly recommended)**
* Ask users to provide their own API key
* Add the API key directly in the code

You may need to prompt Lovable to store the API key for Resend using Supabase. Clicking **Add API key** will open a modal where you can add the API key.

![adding the Resend integration to a Lovable chat](https://mintlify.s3.us-west-1.amazonaws.com/resend/images/lovable-integration.png)

<Info>
  At the time of writing, Lovable does not securely handle API keys
  independently. Instead, it uses the [Supabase integration to store
  secrets](https://docs.lovable.dev/integrations/supabase#storing-secrets-api-keys-%26-config).
</Info>

## 2. Add a custom domain to your Resend account

By default, you can only send emails to your own email address.

To send emails to other email addresses:

1. Add a [custom domain to your Resend account](https://resend.com/domains).
2. Add the custom domain to the `from` field in the `resend` function in Lovable (or ask the chat to update these fields).

Get more help adding a custom domain in [Resend's documentation](/dashboard/domains/introduction).

# Send emails with v0 and Resend

> Learn how to add the Resend integration to your v0 project.

[v0](https://v0.dev) by Vercel is a platform for building web sites, tools, apps, and projects via chat. You can add Resend in a v0 project by asking the chat to add email sending with Resend.

## 1. Add your Resend API key

To use Resend with v0, you'll need to add a Resend API key, which you can create in the [Resend Dashboard](https://resend.com/api-keys).

<Note>
  Do not share your API key with others or expose it in the browser or other
  client-side code.
</Note>

![adding the Resend integration to a v0 chat](https://mintlify.s3.us-west-1.amazonaws.com/resend/images/v0-integration.png)

## 2. Add a custom domain to your Resend account

By default, you can only send emails to your own email address.

To send emails to other email addresses:

1. Add a [custom domain to your Resend account](https://resend.com/domains).
2. Add the custom domain to the `from` field in the `resend` function in v0 (or ask the chat to update these fields).

Get more help adding a custom domain in [Resend's documentation](/dashboard/domains/introduction).

# How can I delete my Resend account?

> How to request your Resend account and data to be deleted.

To delete your Resend account:

1. [Leave the team](/dashboard/settings/team#leave-your-resend-team) associated with your Resend account.
2. Select the **Delete account** button.

Upon confirmation, Resend will delete your account and all account data.

<Warning>
  Please note that this action is not reversible, so please proceed with
  caution.
</Warning>

# What is Resend Pricing

> Learn more about Resend's pricing plans.

You can learn more about Resend's pricing at [resend.com/pricing](https://resend.com/pricing).

# What's the difference between Opportunistic TLS vs Enforced TLS?

> Understand the different TLS configurations available.

Resend supports TLS 1.2, TLS 1.1 and TLS 1.0 for TLS connections.

There are two types of TLS configurations available:

* Opportunistic TLS
* Enforced TLS

## What is Opportunistic TLS?

Opportunistic TLS means that Resend always attempts to make a secure connection to the receiving mail server.

If the receiving server does not support TLS, the fallback is sending the message unencrypted.

## What is Enforced TLS?

Enforced TLS means that the email communication must use TLS no matter what.

If the receiving server does not support TLS, the email will not be sent.

## Is Enforced TLS better than Opportunistic TLS?

One strategy is not necessarily better than the other.

The decision is less about one option being safe and the other being unsafe, and more about one option being safe and the other being safer.

When you have Enforced TLS enabled, you might see an increase in bounce rates because some outdated mail servers do not support TLS.

So it's important to understand the different use cases for each configuration. If you're sending sensitive information like authentication emails, you might want to use Enforced TLS. If you're sending marketing emails, you might want to use Opportunistic TLS.

In simple terms, with Opportunistic TLS, delivery is more important than security. On the other hand, with Enforced TLS, security is more important than delivery.

# How to Handle API Keys

> Learn our suggested practices for handling API keys.

API Keys are secret tokens used to authenticate your requests. They are unique to your account and should be kept confidential. You can create API keys in two ways:

* [via the Resend Dashboard](/dashboard/api-keys/introduction)
* [via the API](/api-reference/api-keys/create-api-key)

<Info>
  For more help creating, deleting, and managing API keys, see the [API Keys
  documentation](/dashboard/api-keys/introduction).
</Info>

## Best Practices

It's crucial you handle your API keys securely. Do not share your API key with others or expose it in the browser or other client-side code.

Here are some general guidelines:

* Store API keys in environment variables.
* Never commit API keys to version control.
* Never hard-code API keys in your code or share them publicly.
* Rotate API keys regularly. If an API key hasn't been used in the last 30 days, consider deleting it to keep your account secure.

<Info>
  When you create an API key in Resend, you can view the key only once. This
  practice helps encourage these best practices.
</Info>

## Example

Many programming languages have built-in support for environment variables. Here's an example of how to store an API key in an environment variable in a Node.js application.

<Steps>
  <Step title="Create an environment variable">
    Once you create the API key, you can store it in an environment variable in a `.env` file.

    ```ts .env
    RESEND_API_KEY = 're_xxxxxxxxx';
    ```
  </Step>

  <Step title="Add the file to your gitignore">
    Add the `.env` file to your `.gitignore` file to prevent it from being committed to version control. Many frameworks already add `.env` to the `.gitignore` file by default.

    ```ts .gitignore
    .env
    ```
  </Step>

  <Step title="Use the environment variable in your code">
    `ts const resend = new Resend(process.env.RESEND_API_KEY); `
  </Step>
</Steps>


