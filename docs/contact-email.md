# Contact form: Gmail setup

The Contact page sends JSON to `/api/contact`. The Node.js route sends a plain-text email through Gmail SMTP. Visitors do not sign in to Google, and their address is used as Reply-To so you can reply directly.

## Local development

1. Enable 2-Step Verification on the sending Google account.
2. Create an App Password named `Portfolio contact form` at https://myaccount.google.com/apppasswords.
3. Copy `.env.example` to `.env.local` if that file does not already exist. If it exists, add the three variables without overwriting other configuration.
4. Set `GMAIL_USER` to the sending Gmail account, `GMAIL_APP_PASSWORD` to the generated App Password, and `CONTACT_TO_EMAIL` to the destination inbox.
5. Restart the development server after updating environment variables.

Use the App Password, not your normal Google password. Keep `.env.local` out of Git. These variables must not have a `NEXT_PUBLIC_` prefix.

## Hosting

Add the same three variables in your hosting provider's server environment settings and redeploy. The app needs a Node.js server/runtime and outbound SMTP on port 465; a static HTML export cannot run this endpoint.

## Behavior

- Required fields and maximum lengths are validated on the server.
- The sender and destination are controlled by server configuration, not by visitor input.
- The form shows success only after Gmail accepts the email. SMTP acceptance does not guarantee inbox placement.
- Missing configuration or failed sending shows an error and preserves the visitor's draft.
- A hidden field and a best-effort limit of five attempts per client address per 15 minutes reduce basic abuse. This limit is per running instance and resets on restart; use your host's shared rate limiting for stronger protection across deployments.
- No automatic confirmation emails are sent to visitor-supplied addresses.

Google setup: https://support.google.com/accounts/answer/185833

Nodemailer Gmail guide: https://nodemailer.com/usage/using-gmail/
