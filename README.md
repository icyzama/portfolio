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
```

## Structure

- `src/app/`: routes, metadata, root layout, global design styles
- `src/components/layout/`: shared header and footer
- `src/components/ui/`: shared design primitives
- `src/features/`: page implementations and page-specific interactions
- `src/content/portfolio.ts`: editable profile, navigation, sample projects, organizations, services, upcoming posts
- `public/figma/`: exact local image and SVG assets exported from the original design

## Design reference

[Original Figma Page 1](https://www.figma.com/design/htPgB4X3o9UtycpH6bcYss/Portfolio-1.0?node-id=0-1)

Preserves the original cream, black, blue, orange, and yellow palette, Archivo Black headings, DM Sans body text, bold borders, grids, portrait, and organization photo. Approved content changes: fourth-year on Home, Blog coming soon, and freelance web development with quotes discussed by contact.

Fonts are downloaded by Next.js during the build and served locally at runtime. The responsive layout stacks the original sections on smaller screens.

## Personalize before publishing

Edit `src/content/portfolio.ts` to replace the five sample projects and bracketed experience placeholders. Existing statistics and the latest strip are source-design content; review them before publication. Add a real resume under `public/` and set `profile.resume` to its path to enable downloading.

The Contact form and Blog contact form open email drafts through `mailto:`. They do not send messages automatically or store submissions. Direct delivery requires an email provider or backend, to be chosen with the owner before integration.
