# Skeletons, caching and performance follow-up

## Scope and outcome

Implements the code changes for issues #9, #10 and #11 on top of PR #8. Production build (including TypeScript), lint, 71 HTTP/Contact checks, five cache checks and eight rendered-DOM checks pass. This totals 84 automated checks; it is not a visual browser sign-off.

### Skeleton previews — #9

Project previews and experience photos share a small client image layer. The containing figure continues to reserve the dimensions. It keeps native lazy loading and the existing embedded blur backdrops.

The server renders an idle, visible image with its decorative skeleton hidden. On hydration the image ref checks `complete` and `naturalWidth`: cached images become ready immediately, failed cached images expose a readable fallback, and pending images show the skeleton until load/error. There is no minimum display duration or loading timer. A changed source starts a new lifecycle. Skeletons are hidden from assistive technology, errors have meaningful alternatives, and reduced-motion CSS disables the shimmer.

Seven rendered-DOM lifecycle checks cover pending, loaded, cached, error, pre-hydration error, source replacement and server HTML. A separate DOM check covers tab links, selection, arrow/Home/End navigation and focus. The tests use React and jsdom with the Next.js Image/Link interfaces mocked; they do not simulate real browser fetching or rendering.

### Cache policy — #10

Existing hashed JS/CSS/font caching was already immutable; the audit records that behavior rather than replacing it. Original public assets now explicitly require revalidation. Organization photos and the About portrait now use static-import content hashes so image changes get new URLs. Contact replies and outbound Resend requests remain uncached. Experiences remains request-rendered with private/no-store responses to preserve tab state.

The cache suite verifies matching ETags produce 304, obsolete validators receive 200 with current bytes, immutable framework headers survive, organization image URLs contain versions, selected tabs remain isolated, and invalid Contact requests remain no-store. These are server-response checks, not a browser/CDN trace. See `docs/caching.md` for ownership and update behavior.

### Measured JavaScript optimization — #11

The production baseline was captured after skeleton and cache changes and before splitting the client content boundary. It identified Experiences as the heaviest initial JavaScript route. Inspecting the Home chunk list showed a shared chunk containing project and organization copy, pulled in by the header's navigation import.

Navigation and profile values now live in lightweight modules with compatibility re-exports. The client header and profile consumers import those modules directly. Experiences cards render on the server; only the tab controls and preview image lifecycles need client components. Existing URL selection and visible no-JavaScript content are preserved.

| Initial HTML-referenced JS body bytes | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Home | 615,386 | 594,732 | 20,654 (3.36%) |
| Experiences | 627,972 | 597,974 | 29,998 (4.78%) |

CSS stayed at 100,936 decoded bytes in this audit. No CSS, paint-time, interaction-time, Lighthouse, or field-metric improvement is claimed. Projects is now the heaviest measured route at 617,128 decoded JS bytes.

Evidence: `performance-before.json` and `performance-after.json`. `node scripts/audit-performance.mjs LABEL` gathers production HTML and resource bodies with the same settings. Node fetch runs locally with no CPU/network throttling. The metric counts initial HTML script/link references; it excludes browser prefetches, CSS-discovered resources, response-header preload links and execution costs. Brotli sizes in the JSON are estimates at quality 5, not measured transfer sizes. Local response-header timings are diagnostic and not browser performance metrics. Image byte optimization remains documented separately in the prior image audit.

## Review and remaining checks

Standards review: the loading layer is shared, no runtime dependency was introduced, Next.js owns its framework caches, and client boundaries contain only the interactions that need them. jsdom is a development test dependency. Profile/date content remains centralized.

Acceptance review: code and automated coverage satisfy the observable loading/error/cache/SSR behavior. No browser is connected to this session. Actual cold-cache throttling, warm browser reuse, desktop/mobile crops, reduced-motion rendering and the intended hosting CDN still need manual verification. The report does not substitute jsdom or HTTP checks for those browser requirements.

During this work the owner added a Resend key locally, and the missing sender was set to `onboarding@resend.dev` for account-only testing. No credentials are committed or printed. Live email delivery was not invoked by the agent. The test recipient must match the Resend account email; production branding still requires a verified domain.

To repeat: build, start the production server, then run `npm run qa`, `npm run qa:cache` and `npm run qa:images`. Set `QA_BASE_URL` when using a different port. Full HTTP/Contact results from this run are saved in `enhancements-results.json`; DOM/cache test summaries are recorded above.
