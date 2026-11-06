# Portfolio

Reynald Quijano’s portfolio, built with Next.js App Router, TypeScript, Tailwind CSS, and ESLint. Implements the original Figma Page 1.

## Run locally

```powershell
cd D:\projects\portfolio
npm run dev
```

Open http://localhost:3000.

## Checks

```powershell
npm run lint
npm run build
npm run qa:contact
npm run qa:images
```

For production HTTP checks, run `npm run start -- --hostname 127.0.0.1 --port 3000` in another terminal after building, then `npm run qa`. The QA script checks page responses, server-rendered content, local assets, and Contact behavior with email delivery mocked.

Run `npm run qa:cache` against the production server to check asset revalidation and cache boundaries. Set `QA_BASE_URL` when using a different port. `qa:images` uses a simulated DOM to check image lifecycles and keyboard tabs; it is not a visual browser test.

See [Caching policy](docs/caching.md) for freshness and deployment behavior, and [Enhancement QA](docs/qa/enhancements-2026-10-23.md) for measured bundle changes and remaining visual checks.

## Structure

- `src/app/`: routes, metadata, root layout, global design styles
- `src/components/layout/`: shared header and footer
- `src/components/ui/`: shared design primitives
- `src/features/`: page implementations and page-specific interactions
- `src/content/portfolio.ts`: editable profile, navigation, projects, organizations, services, upcoming posts
- `src/content/profile.ts` and `navigation.ts`: shared profile and navigation values, kept separate from image-heavy content for smaller client bundles
- `public/figma/`: exact local image and SVG assets exported from the original design

## Design reference

[Original Figma Page 1](https://www.figma.com/design/htPgB4X3o9UtycpH6bcYss/Portfolio-1.0?node-id=0-1)

Preserves the original cream, black, blue, orange, and yellow palette, Archivo Black headings, DM Sans body text, bold borders, grids, portrait, and organization photo. Approved content changes: fourth-year on Home, Blog coming soon, and freelance web development with quotes discussed by contact.

Fonts are downloaded by Next.js during the build and served locally at runtime. The responsive layout stacks the original sections on smaller screens.

## Personalize before publishing

Edit `src/content/portfolio.ts` to maintain your projects, organizations, links, and profile information. Review the Home statistics and latest updates before publication. Add a real resume under `public/` and set `profile.resume` to its path to enable downloading. Blog topics are a preview of upcoming writing, and the internship photo is still a placeholder.

The Contact form submits to a server endpoint and sends through **Resend**, using an HTML template and plain-text alternative. Configure the API key, verified sender address, destination inbox, and trusted proxy as described in [Contact email setup](docs/contact-email.md). The endpoint needs a Node.js server and server-only email configuration. Blog topic suggestions open a `mailto:` draft in the visitor's email application.
