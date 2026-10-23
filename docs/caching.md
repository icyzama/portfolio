# Public resource caching

The portfolio uses Next.js 16.4.2's existing caching facilities. There is no service worker, Redis store, or new application-wide data cache. Repository content changes are published by rebuilding and deploying.

| Resource | Policy and owner | Update behavior |
| --- | --- | --- |
| Prerendered public pages | Next.js owns the response policy and deployment output. Locally the Home response reports `s-maxage=31536000` and an ETag. | Rebuild/redeploy to publish content changes. The host must deploy the matching HTML, RSC output, and assets together and invalidate its deployment-owned page cache. Do not add a separate permanent CDN HTML cache. |
| Experiences tab URLs | Request-rendered by Next.js; `private, no-cache, no-store, max-age=0, must-revalidate`. | Each request selects its own tab; cached HTML from one tab cannot become another tab's selected state. |
| Content-hashed JavaScript, CSS and fonts | Next.js retains its immutable asset caching. The local server returns a one-year max-age for these resources. | New bytes produce a new URL. Old URLs can remain cached safely for older documents. |
| Project photos, organization photos, and the About portrait | Static imports produce content-versioned URLs; optimized variants retain Next.js's immutable policy. | Replacing the imported source image and rebuilding changes its URL. Do not replace bytes under an existing hashed URL. |
| Original public files under figma, skills, projects and experiences | Explicit `public, max-age=0, must-revalidate`, with Next.js/static-server validators. | Cached copies must be revalidated. A matching ETag yields 304; an obsolete validator yields the current representation. Public route URLs themselves are not matched by these asset rules. |
| Contact POST and outbound Resend calls | `no-store`; no form data or provider result is put in a shared cache. | Each deliberate submission runs validation, rate limiting and delivery. Requests are not cached or replayed. |

Remaining unversioned image-optimizer URLs use the installed framework's default minimum TTL (four hours), so any future changeable image should use a static import/content-versioned URL instead of increasing that TTL. Do not add long-lived immutable headers to an unversioned public file.

## Verification

After `npm run build`, start a production server and run `npm run qa:cache`. Use `QA_BASE_URL` if the server is not at `http://127.0.0.1:3000`. `node scripts/audit-cache.mjs current` records the observed response policies and conditional-request results.

The automated checks exercise explicit revalidation, 304 responses, obsolete ETags, immutable framework assets, versioned organization images, tab isolation, and uncached Contact responses. The Contact handler tests also assert that Resend fetches use `cache: no-store`. No real emails are sent by these checks.

The recorded local before/after observations are in `docs/qa/cache-before.json` and `cache-after.json`. These are HTTP checks against a local production build, not evidence of browser cache hits or a hosting CDN's deployed behavior. On the chosen host, repeat the audit, test a real content/image deployment, and inspect browser repeat visits before signing off CDN reuse and invalidation.

Next.js reference: the installed caching guide for projects without Cache Components, static image imports, and custom response headers. No Cache Components migration is required for these policies.
