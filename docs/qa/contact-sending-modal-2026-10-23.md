# Contact sending modal

The Contact form opens a native progress dialog when a submission begins. It follows the actual request, without a minimum display delay. Duplicate submissions remain blocked. Acceptance closes progress and opens the existing success dialog; a rejection or network failure closes progress, preserves the draft, displays the form error, and restores focus to the submit button after it is enabled.

The dialog has a labelled title, description/status text and a decorative spinner. Reduced-motion CSS stops the spinner animation. Native Escape dismissal hides the progress dialog without aborting an email request already in flight. The progress dialog is closed in the request's finally block, including failures.

## Verification

Four React/jsdom tests failed before implementation and pass afterward:

1. Pending request opens progress, disables submission, and prevents a duplicate request.
2. Accepted request replaces progress with success, clears the form, and returns focus when success is dismissed.
3. Rejection closes progress, preserves draft fields, displays the server error, and restores submit focus.
4. Network failure closes progress and preserves the draft.

The tests mock delivery and model dialog open/close/focus because jsdom does not implement the browser's native top layer. They do not verify real visual presentation or native dialog keyboard behavior. Run `npm run qa:contact-ui` to repeat them.

Production build (including TypeScript) and lint passed. The final automated suite passed 88 checks: 71 HTTP/handler, five cache, eight image/tab DOM, and four Contact UI checks. No real email was sent by the agent or by these tests.

## Email delivery diagnosis

The owner reported a missing test email. Local Resend key, sender and recipient settings are present. A read-only request to Resend's sent-email list returned 401 with `restricted_api_key`, consistent with a sending-only key that cannot read delivery logs. No delivery status was inferred from that result.

Server diagnostics now log provider acceptance with its message ID, provider failure with HTTP status (or null for a failure before receiving a response), and missing/invalid configuration as boolean flags. They do not log the API key, message content, or recipient addresses. Provider acceptance still does not guarantee inbox placement.

Diagnosis of the owner's specific test remains pending the form result, whether it was localhost or deployed, and the Resend dashboard's delivery status. Local environment variables do not configure the deployed host. Resend's test sender requires the destination to match the account email. See `docs/contact-email.md` for the setup and troubleshooting steps.
