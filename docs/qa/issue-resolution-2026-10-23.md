# Portfolio issue implementation and verification

Date: 23 October 2026. The original findings and baseline are preserved in `2026-10-23.md` and `2026-10-23-results.json`.

## Changes

| Issue | Implementation | Verification / remaining checks |
| --- | --- | --- |
| #1 Images | Project backdrops use embedded blur data instead of separate optimized-image requests. Foreground sizes account for the four-column desktop grid. SmartFlood's Experiences preview uses a lazy Next.js Image instead of the original PNG in CSS. Organization and project photos have sizes for their respective grids. | HTTP image audit below. Actual browser request timing, mobile appearance and crops still need visual verification. |
| #2 Resend | Contact POST uses the Resend HTTPS API, server-controlled sender/recipient, visitor Reply-To, escaped HTML, and plain text. Removed Nodemailer and Gmail App Password requirements. | Isolated tests cover successful acceptance, missing configuration, rejection, network failure, missing message IDs, optional fields and HTML escaping. Live delivery requires a Resend key and verified sender. |
| #3 Documentation | README reflects actual Contact delivery and Blog mailto behavior; stale project counts and placeholder instructions were replaced. Setup guide describes current server configuration and migration. | Documentation reviewed against the endpoint and example configuration. |
| #4 Graduation | Pending owner confirmation of August versus September 2027. No month was guessed. | Shared-date implementation remains blocked on the factual answer. |
| #5 Client address | Use Vercel's address header only when the server is on Vercel, or an explicitly configured trusted-proxy header. Validate a single IPv4/IPv6 address. Untrusted/missing addresses share a conservative bucket. | Mocked tests show changing ordinary forwarding headers cannot reset the bucket. Trusted-proxy behavior and expiry pass. Deployed proxy sanitization and any platform-wide rate-limit rule still require host verification. |
| #6 Enum validation | Topic and timeline labels require own-property membership. | All four reproduced invalid cases now return 400 without a provider call. Supported values still pass. |
| #7 Experiences HTML | Read tab selection in the server page, pass it to the interactive view, and use navigable tab links. Remove the shared route-loading boundary so content is not hidden behind client-only stream reveal scripts. | Default, valid, invalid and repeated tab queries pass. The primary heading is present outside hidden containers. Browser keyboard and responsive checks remain unverified. |

The limiter remains five attempts per 15 minutes per client bucket per running instance. Unknown clients share a bucket, and counters reset on restart. It is not a distributed quota.

## Automated checks

- `npm run build`: passed on Next.js 16.4.2, including TypeScript.
- `npm run lint`: passed.
- `npm run qa`: 71 checks passed after the fixes; captured in `issue-resolution-results.json`.
- The Contact tests execute the handler and email renderer source with synthetic environment variables, a mocked Resend fetch, and a controllable clock. They do not send real email.
- All seven page routes, direct Experiences tab URLs, internal links, and server-referenced assets respond successfully.
- A stronger no-JavaScript test caught that merely including a heading in streamed HTML was insufficient: it was inside a hidden container. That test failed before removing the shared route-loading boundary and passed afterward.

## Image audit

`node scripts/audit-images.mjs before` and `after` capture HTTP response sizes for source-set candidates at 390px and 1440px with DPR 2. This models the page's sizes attributes; it is not a browser network trace, viewport screenshot, total page download measurement, or visual-quality approval. JSON evidence is in `images-before.json` and `images-after.json`.

| Metric | Before | After |
| --- | ---: | ---: |
| Project image elements requiring network sources | 8 | 4 |
| Project image bytes, 390px / DPR 2 | 77,522 | 76,476 |
| Project image bytes, 1440px / DPR 2 | 113,074 | 76,476 |
| Projects HTML body bytes (decoded, before compression) | 33,057 | 28,975 |

The original SmartFlood PNG response is 1,206,251 bytes. A 640px WebP response from the optimizer is 18,780 bytes. The Experiences view now uses the optimizer; the actual selected width depends on the viewport and pixel ratio. Embedded backdrop data preserves the blurred backdrop approach. Matching foreground/backdrop URLs in organization photos remain reusable rather than introducing an extra variant.

## Dependencies and review

The existing Next.js 16.3.8 dependency was reported vulnerable during installation. Next.js and eslint-config-next were updated together to 16.4.2. `npm audit --omit=dev` reports zero vulnerabilities. Five high advisory entries remain in the development lint chain through braces/micromatch/fast-glob; npm proposes a major downgrade of eslint-config-next rather than a compatible fix. That downgrade was not applied.

References: [Next.js image optimization advisory](https://github.com/advisories/GHSA-2464-fhr4-w9xw), [Next.js cache advisory](https://github.com/advisories/GHSA-673q-mjm6-r5xr), [Vercel request headers](https://vercel.com/docs/headers/request-headers#x-vercel-forwarded-for), [Resend sending API](https://resend.com/docs/api-reference/emails/send-email).

Standards review: changes follow the existing feature modules, keep secrets on the server, and introduce no runtime email dependency. Tests exercise HTTP responses and the Contact POST interface with the provider mocked.

Acceptance review: code and automated behavior are covered for #1, #2, #3, #5, #6, and #7. #4 remains pending. The environment did not expose a usable browser, so visual and interactive acceptance checks are not claimed. Current local configuration has Gmail variables but no Resend key or sender; live delivery has not been verified. Hosting has not been confirmed, so shared/platform enforcement is not configured.
