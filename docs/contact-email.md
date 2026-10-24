# Contact email: Resend setup

The Contact form posts JSON to `/api/contact`. The Node.js endpoint sends an HTML email with a plain-text alternative through the Resend HTTPS API. The destination can remain your Gmail inbox. The visitor's address is Reply-To, so replying goes directly to the visitor. Blog topic suggestions open a `mailto:` draft and do not call this endpoint.

## Local development

For a first test before domain verification, sign in to Resend, create an API key with **Sending access**, and put the key in `.env.local`. Use `CONTACT_FROM_EMAIL=onboarding@resend.dev` and set `CONTACT_TO_EMAIL` to the email address used for your Resend account. The test sender is restricted to your own account address. It is not your Gmail address or a branded production sender. Restart the server after saving the configuration, then submit a deliberate test through the Contact form and inspect Resend's email logs and your inbox.

For production:

1. Verify a sending domain in your Resend account and create a sending API key. Resend's test domain has recipient restrictions; use a verified domain for production delivery.
2. Copy `.env.example` to `.env.local` only if the file does not exist. Otherwise, add the new variables without overwriting existing configuration.
3. Set `RESEND_API_KEY` to the API key, `CONTACT_FROM_EMAIL` to a bare sender address on the verified domain, and `CONTACT_TO_EMAIL` to your destination inbox. The recipient defaults to the public portfolio email when omitted.
4. Restart the server after configuration changes.

All variables are server-only. Do not use a `NEXT_PUBLIC_` prefix or commit the key. Gmail SMTP credentials (`GMAIL_USER` and `GMAIL_APP_PASSWORD`) are no longer used. Remove those obsolete variables from local and hosting settings when migrating; a Google App Password is no longer required.

## Hosting and rate limiting

Deploy with a Node.js runtime and outbound HTTPS access to `api.resend.com`. Static HTML export cannot run the Contact endpoint. Set the same Resend variables in your hosting environment and redeploy.

The application allows **five attempts per 15 minutes** in each running server instance. The sixth returns HTTP 429 with `Retry-After`. Failed provider calls count toward the allowance. Counters expire after 15 minutes and reset when the process restarts.

- **Vercel:** When Vercel supplies `VERCEL=1`, use its `x-vercel-forwarded-for` client-address header. Ordinary caller-supplied `X-Forwarded-For` does not select a bucket. Vercel documents its forwarding-header behavior in its [request headers reference](https://vercel.com/docs/headers/request-headers#x-vercel-forwarded-for).
- **Another reverse proxy:** Set `CONTACT_TRUSTED_IP_HEADER` only after ensuring the proxy overwrites that header with a single real client IP and direct access to the app is blocked. Merely naming a header does not make it trustworthy. IPv4 and IPv6 are accepted; address chains and malformed values are not trusted.
- **Local or unknown deployment:** Leave that variable empty. Requests without a trusted address share one conservative per-instance bucket. This prevents callers rotating arbitrary headers to reset the allowance, but also means unrelated visitors can share the allowance.

This in-memory limit is basic protection, not a distributed quota. Multiple serverless instances each have their own counters. For enforcement across instances, configure a platform/WAF rate-limit rule on POST requests to `/api/contact`, keyed by the platform's actual client address, and verify it on the deployed host. The repository does not configure a hosting account or a shared external store.

## Message behavior

- The server validates required fields, lengths, and supported topics/timelines before calling Resend.
- The sender and destination come from server configuration; visitor input cannot override them.
- The HTML template includes visitor details, the topic, optional organization/timeline, and message. Visitor text is HTML-escaped; the plain-text alternative preserves the original text.
- Success requires a successful Resend response with a message ID. Provider acceptance does not guarantee inbox placement.
- Missing configuration returns 503. Provider rejection, network failure, or timeout returns 502. The form preserves the visitor's draft on failure.
- No automatic confirmation email is sent to visitor-supplied addresses. A hidden field rejects simple automated submissions without contacting the provider.

## Verification

Run `node scripts/qa.mjs --contact-only` for isolated handler checks. Resend requests use a mocked transport with synthetic configuration; the test never sends an email. For production HTTP checks, start the app locally on port 3000 and run `npm run qa`.

A live delivery check requires a configured Resend account and verified sender domain. Send one deliberate message from the form, check the Resend dashboard and Gmail inbox, and verify Reply-To and HTML/plain-text rendering. Live delivery is separate from the mocked checks.

## If an email does not arrive

- Note whether the form reports success or an error, and whether the test was on localhost or a deployed website. Local `.env.local` settings do not configure the hosting environment; add the variables to the host and redeploy there.
- With `onboarding@resend.dev`, the destination must match the Resend account email. Open Resend's **Emails** page for the request's delivery status and check the recipient inbox/spam folder.
- The server logs acceptance with the Resend message ID, provider failure with its HTTP status, or missing/invalid configuration with boolean flags. It does not log credentials, recipient addresses, or message content. Acceptance confirms a provider request, not inbox placement.
- A sending-only API key cannot list sent emails through the API. Inspect the Resend dashboard rather than increasing the application's API-key permissions just for diagnosis.
- The sending modal reflects the actual pending request. A failure closes it, shows the form error, restores focus, and preserves the draft for retry. Closing the progress dialog with Escape hides progress without cancelling an already-running request.

References: [Resend sending API](https://resend.com/docs/api-reference/emails/send-email), [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction).
