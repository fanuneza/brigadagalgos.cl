# Brigada Galgos

Public website of **Brigada Galgos Chile**, an organization that rescues, rehabilitates, and rehomes galgos in Chile. An Astro 7 static site deployed to Cloudflare Pages from GitHub.

## Stack

- Astro 7 with `output: "static"` — every page, endpoint, and image variant is generated at build time; there is no server runtime.
- TypeScript, site CSS (`src/styles/`, no Tailwind), and Markdown content collections (`dogs`, `supporters`, `blog`).
- Vitest for unit and source-hygiene tests, Playwright for browser and build-output specs, Lighthouse CI for performance, accessibility, and SEO budgets.

## Requirements and setup

- Node.js 22+ (`.nvmrc` pins the expected major) and npm, with the committed `package-lock.json`.

```bash
npm ci
npm run dev
```

## Commands

`package.json` is the command authority; this table mirrors its scripts.

| Command                                                   | What it does                                                               |
| --------------------------------------------------------- | -------------------------------------------------------------------------- |
| `npm run dev`                                             | Start the Astro dev server (telemetry disabled via `cross-env`).           |
| `npm run build`                                           | `astro check` + production build into `dist/`.                             |
| `npm run preview`                                         | Serve the production build locally.                                        |
| `npm run check`                                           | Run `astro check` only (type and template diagnostics).                    |
| `npm run lint`                                            | ESLint + Stylelint + text-quality check + `dog-images:check`.              |
| `npm run lint:fix`                                        | Autofix ESLint and Stylelint findings.                                     |
| `npm run format` / `npm run format:check`                 | Prettier write / check.                                                    |
| `npm test`                                                | Full suite: Vitest, then Playwright against a locally built preview.       |
| `npm run test:source`                                     | Only the repository invariants in `tests/source-hygiene.test.ts` (Vitest). |
| `npm run test:text`                                       | Text-quality rules on site copy (part of `npm run lint`).                  |
| `npm run test:lighthouse`                                 | Lighthouse CI budgets over `dist/` (run `npm run build` first).            |
| `npm run capture:local` / `:home` / `:adoptar` / `:donar` | On-demand visual-parity screenshots; never run by `npm test`.              |
| `npm run dog-images:check` / `:write`                     | Verify / normalize dog image filenames and extensions.                     |
| `npm run dog-collections:migrate`                         | Run `scripts/migrate-dog-collections.mjs` for dog collection migrations.   |

## Environment variables

Typed via the `env.schema` in `astro.config.mjs` and documented in `.env.example`:

- `PUBLIC_GTM_ID` — Google Tag Manager container id. Optional; falls back to `SITE.gtmContainerId` in `src/config/site.ts`.
- `PUBLIC_WEB3FORMS_KEY` — web3forms access key for the contact form. Optional; falls back to `SITE.web3forms.accessKey` in `src/config/site.ts`.
- `ENABLE_INDEXNOW` — set to `"true"` only in deploys that should ping IndexNow after the build; defaults to `false`.

## Repository map

| Path              | What lives here                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------- |
| `src/pages/`      | Routes plus endpoints (RSS `feed.xml`, schema maps, verification files).                     |
| `src/layouts/`    | `BaseLayout.astro` document shell and `PageLayout.astro` page wrapper.                       |
| `src/components/` | Shared UI components, with page sections under `sections/`.                                  |
| `src/config/`     | Site URLs, nav/footer menus, and FAQ copy.                                                   |
| `src/utils/`      | Collection queries and card shaping, JSON-LD builders, analytics helpers.                    |
| `src/scripts/`    | Client scripts: cookie consent, analytics events, navbar, galleries, forms.                  |
| `src/styles/`     | `global.css`, `tokens.css`, and modular component CSS under `components/`.                   |
| `src/assets/`     | Optimized images: dog galleries, blog art, inline SVG icons, supporter logos.                |
| `src/content/`    | Markdown collections: `dogs/`, `supporters/`, `blog/`.                                       |
| `public/`         | Static files served as-is, including `_headers` and `_redirects` for Cloudflare Pages.       |
| `scripts/`        | Repo tooling: text-quality checks, image normalization, migrations, preview server.          |
| `tests/`          | Vitest unit/source-hygiene tests and Playwright browser specs, plus `helpers/` and `stubs/`. |
| `capture/`        | Visual-parity screenshot specs, run only on demand via the `capture:*` scripts.              |
| `docs/`           | Product, architecture, quality, maintenance, content, and voice documentation.               |

## Deploy and CI

Cloudflare Pages deploys the static build from GitHub. Three workflows live in `.github/workflows/`:

- `ci.yml` — gates every push and PR to `main`: format, lint, build, and the full test suite. It checks out with `fetch-depth: 0` because `tests/source-hygiene.test.ts` derives retired dog profile slugs from git history to enforce `_redirects` coverage.
- `deploy-smoke.yml` — after a successful deployment, runs `npm test` against the deployed URL via `PLAYWRIGHT_BASE_URL`.
- `lychee.yml` — link checker on push/PR and weekly: builds the site, then runs lychee over `dist/` and the Markdown/Astro sources.

## Documentation index

| File                     | Owns                                                                                |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `README.md`              | This file: purpose, stack, setup, commands, repo map, env vars, deploy.             |
| `AGENTS.md`              | Operational guidance for AI agents working in the repo.                             |
| `PRODUCT.md`             | Product intent: audience, purpose, positioning, conversion and proof.               |
| `DESIGN.md`              | Visual design system: colors, typography, components.                               |
| `docs/architecture.md`   | Mechanism: how the static site is assembled (build, routing, images, integrations). |
| `docs/quality.md`        | Requirements: the invariants that must hold and how they are enforced.              |
| `docs/maintenance.md`    | Procedures: how to add dogs, supporters, posts, and perform editorial workflows.    |
| `docs/content-model.md`  | The three content collections: schemas, fields, and authoring rules.                |
| `docs/voice-and-tone.md` | Source of truth for site copy: voice, tone, and per-page copy patterns.             |
| `docs/glossary.md`       | Bilingual map of the Spanish domain terms used in schemas, routes, and copy.        |
