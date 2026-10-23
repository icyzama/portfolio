# Project context

## Glossary

- **Lazy loading**: Deferring a non-critical image request until the image is near the viewport, while allowing an image needed for the initial view to load promptly.
- **Resend**: The transactional email service used to deliver Contact form submissions over HTTPS; the configured Gmail inbox can remain the destination.
- **Contact email template**: The formatted email sent to the portfolio owner when someone submits the Contact form, including the sender's details, topic, and message.
- **Trusted client address**: A single IP supplied by a deployment proxy that overwrites the address header and prevents callers from reaching the app directly. An arbitrary caller-supplied forwarding header is not trusted.
- **Expected graduation**: September 2027, confirmed by the portfolio owner on 23 October 2026. Profile copy and the About page use the shared profile date.
- **Skeleton preview**: A decorative placeholder inside an image's reserved frame while that image is pending. It clears on load or failure; server HTML remains usable without JavaScript.
- **Versioned asset**: A public resource whose URL contains a hash of its contents, allowing long-lived immutable caching without retaining an old image after an update.
