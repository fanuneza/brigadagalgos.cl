# Build Checklist

## Build Preferences

- **Build mode:** Step-by-step
- **Comprehension checks:** No
- **Git:** Do not commit automatically during this repro. Make edits only and report them.
- **Verification:** Yes. Verify each item with the relevant command or artifact check before marking it complete.
- **Check-in cadence:** Balanced

## Checklist

- [x] **11.1 Finalize README and AGENTS documentation**
      Spec ref: `spec.md > File structure` + `prd.md > Non-functional requirements`
      What to build: Review `README.md` and `AGENTS.md`, update any stale setup, command, and documentation references so they match the current Astro 7 project and the docs bundle.
      Acceptance: `README.md` and `AGENTS.md` accurately describe setup, key commands, and the related docs without stale references.
      Verify: Run `npm run check` and confirm documentation-related references used during the edits still match the current project structure.

- [x] **11.2 Clean up docs cross-references**
      Spec ref: `spec.md > File structure` + `prd.md > Related documents`
      What to build: Review the `docs/` bundle for stale cross-references, duplicated guidance, or outdated workflow notes and align them with the current project state.
      Acceptance: The docs set is internally consistent, has no obvious stale cross-references, and reflects the current repo structure.
      Verify: Open the edited docs and confirm referenced files still exist in the repo.

- [x] **11.3 Dependency and security review**
      Spec ref: `spec.md > External dependencies` + `prd.md > Non-functional requirements`
      What to build: Review dependency/security status for the current repo state, including `npm audit`, secrets exposure, and deployment/security notes relevant to the static Astro site.
      Acceptance: Findings are documented or remediated as appropriate, with no unreported critical issues introduced by the review.
      Verify: Run `npm audit` and confirm the result is captured accurately.

- [x] **11.4 Final verification run**
      Spec ref: `spec.md > Testing` + `prd.md > Non-functional requirements`
      What to build: Run the repo verification commands needed for a handoff-ready state and summarize whether the current site is green.
      Acceptance: `npm run format:check`, `npm run lint`, `npm run build`, and `npm test` are run or explicitly reported if skipped/blocked, with outcomes captured clearly.
      Verify: Run the listed commands and confirm which passed, failed, or were intentionally deferred.

## Iteration 1

- [x] **1. Fix devDependency vulnerabilities via `npm audit fix`**
      Spec ref: New — not in original spec (follow-up to 11.3/11.4 findings)
      What to build: Run `npm audit fix` to update the vulnerable devDependencies flagged during 11.4 (`@lhci/cli`'s `tmp`/`inquirer` chain, `js-yaml`, `vite`) without pulling in breaking changes (i.e. do not use `--force`). Re-run `npm audit` afterward to confirm what got cleared vs. what still needs a breaking upgrade.
      Acceptance: `npm audit` shows fewer vulnerabilities (ideally 0 non-breaking-fixable ones remain), any still-open items are documented with why they were deferred, and the full verification suite still passes after the fix.
      Verify: Run `npm audit`, then `npm run format:check`, `npm run lint`, `npm run build`, and `npm test`, and confirm all still pass.

---

# Brigada Galgos — Build Checklist

## Scope

This legacy phase/table section remains as planning source material for maintainers. The plugin-compatible header above is the active `/build` execution queue for this repro.

This document turns the technical specification into an ordered build plan. Each item includes its dependencies, acceptance criteria, and rough effort. The audience is future maintainers and AI agents who need to understand the work sequence.

## Legend

- **Effort:** S = small (≤1 day), M = medium (1–3 days), L = large (3–7 days), XL = extra large (1–2 weeks).
- **Dependencies:** Items that must be completed before this item can start.
- **Acceptance criteria:** The conditions that define done for the item.

## Build phases

### 1. Documentation & scoping foundation

**Goal:** Establish the single source of truth before any code work.

| #   | Task                               | Effort | Dependencies                               | Acceptance criteria                                                                |
| --- | ---------------------------------- | ------ | ------------------------------------------ | ---------------------------------------------------------------------------------- |
| 1.1 | Create `docs/site-brief.md`        | S      | `docs/builder-profile.md`, `docs/scope.md` | Product intent, audience, goals, flows, and success metrics documented             |
| 1.2 | Create `docs/prd.md`               | S      | 1.1                                        | User stories, acceptance criteria, edge cases, and prioritization documented       |
| 1.3 | Create `docs/spec.md`              | S      | 1.2                                        | Stack, file structure, data flow, dependencies, and submission approach documented |
| 1.4 | Create `docs/feature-inventory.md` | S      | 1.1                                        | All pages, sections, and capabilities listed                                       |
| 1.5 | Create `docs/content-model.md`     | S      | 1.2                                        | Schemas, editorial rules, and workflows documented                                 |
| 1.6 | Create `docs/architecture-map.md`  | S      | 1.3                                        | Component and content flow mapped                                                  |
| 1.7 | Update `README.md` and `AGENTS.md` | S      | 1.1–1.6                                    | Documentation cross-references are current                                         |

**Status:** Completed.

### 2. Core site structure

**Goal:** Get the Astro project, layouts, routing, and shared shell in place.

| #   | Task                                          | Effort | Dependencies | Acceptance criteria                                                                                      |
| --- | --------------------------------------------- | ------ | ------------ | -------------------------------------------------------------------------------------------------------- |
| 2.1 | Initialize Astro 7 project with static output | S      | None         | `astro.config.mjs` uses `output: "static"`, `site`, `trailingSlash: "always"`                            |
| 2.2 | Configure Astro integrations                  | S      | 2.1          | sitemap, RSS, and SEO graph integrations installed and configured                                        |
| 2.3 | Create `BaseLayout.astro`                     | M      | 2.1          | Document shell, global styles, SEO graph, GTM noscript fallback, cookie banner, client bootstrap scripts |
| 2.4 | Create `PageLayout.astro`                     | S      | 2.3          | Wraps `BaseLayout` with `Navbar`, `<main>`, `Footer`, and optional `afterShell` slot                     |
| 2.5 | Create `Navbar.astro`                         | M      | 2.4          | Navigation links, mobile menu, theme toggle, accessible markup                                           |
| 2.6 | Create `Footer.astro`                         | S      | 2.4          | Links, social links, legal/cookie links                                                                  |
| 2.7 | Configure `public/` assets                    | S      | 2.1          | `_headers`, `_redirects`, `robots.txt`, `site.webmanifest`, favicon, icons, images, `llms.txt` in place  |

### 3. Styling and design system

**Goal:** Establish a maintainable, accessible visual system.

| #   | Task                           | Effort | Dependencies | Acceptance criteria                                                                           |
| --- | ------------------------------ | ------ | ------------ | --------------------------------------------------------------------------------------------- |
| 3.1 | Create `src/styles/tokens.css` | S      | 2.1          | Design tokens for colors, spacing, typography, radii                                          |
| 3.2 | Create `src/styles/global.css` | M      | 3.1          | Global reset, typography, utilities, dark/light theme variables                               |
| 3.3 | Create modular component CSS   | M      | 3.2          | One CSS file per major component in `src/styles/components/`                                  |
| 3.4 | Implement dark/light theme     | M      | 3.1, 2.5     | `prefers-color-scheme` default, `localStorage` persistence, no flash, ClientRouter-safe       |
| 3.5 | Preserve CSS architecture      | S      | 3.1          | Existing modular CSS patterns are kept consistent without creating a competing styling system |

### 4. Content collections and schemas

**Goal:** Define the data model and validate content at build time.

| #   | Task                            | Effort | Dependencies | Acceptance criteria                                                                |
| --- | ------------------------------- | ------ | ------------ | ---------------------------------------------------------------------------------- |
| 4.1 | Define `adoption-dogs` schema   | M      | 2.1          | Required fields, optional fields, image limit (max 3), active/hidden validation    |
| 4.2 | Define `success-dogs` schema    | S      | 2.1          | Name, story, gallery (max 3), optional Instagram URL                               |
| 4.3 | Define `supporters` schema      | S      | 2.1          | Name, description, website, kind, logo, logoAlt, optional order/thanks fields      |
| 4.4 | Define `blog` schema            | S      | 2.1          | Title, pubDate, author, description, optional category/heroImage                   |
| 4.5 | Create content utility shapers  | M      | 4.1–4.4      | `dog-content.ts`, `story-card-copy.ts` transform collection entries into card data |
| 4.6 | Create responsive image helpers | M      | 4.5          | `responsive-gallery-images.ts`, `hero-images.ts` generate correct srcsets          |

### 5. Pages and content rendering

**Goal:** Build all public pages and content-driven routes.

| #    | Task                                                   | Effort | Dependencies       | Acceptance criteria                                                                      |
| ---- | ------------------------------------------------------ | ------ | ------------------ | ---------------------------------------------------------------------------------------- |
| 5.1  | Home page                                              | M      | 2.4, 3.2, 4.5      | Hero, mission, CTAs, featured dogs, success stories, help cards, donation banner, footer |
| 5.2  | Adoption page (`/adoptar`)                             | L      | 2.4, 3.2, 4.5, 4.6 | Dog grid, filter chips, dog card, lightbox with WhatsApp/form CTAs                       |
| 5.3  | Why galgos page (`/por-que-galgos`)                    | M      | 2.4, 3.2, 4.5      | Editorial sections, FAQ group, 3 random success stories per build                        |
| 5.4  | Foster page (`/hogar-temporal`)                        | M      | 2.4, 3.2           | Requirements, what Brigada covers, CTA, non-guilt tone                                   |
| 5.5  | Donate page (`/donar`)                                 | M      | 2.4, 3.2           | Impact amounts, bank details with copy, eSponsor card, transparency notes                |
| 5.6  | Collaborators page (`/colaboradores`)                  | S      | 2.4, 3.2, 4.4      | Supporter logo grid, accessible alt text, ordering by kind/order                         |
| 5.7  | Contact page (`/contacto`)                             | M      | 2.4, 3.2           | WhatsApp, email, social links, contact form with validation                              |
| 5.8  | FAQ page (`/preguntas-frecuentes`)                     | M      | 2.4, 3.2           | Grouped FAQ, expand/collapse, FAQ structured data                                        |
| 5.9  | Cookie policy page (`/politica-de-cookies`)            | S      | 2.4, 3.2           | Plain explanation of cookies and consent                                                 |
| 5.10 | 404 page (`/404`)                                      | S      | 2.4                | Friendly message with links to main pages                                                |
| 5.11 | RSS feed (`/feed.xml`)                                 | S      | 4.4                | Generated from blog collection                                                           |
| 5.12 | Sitemap and schema map                                 | S      | 2.2                | Sitemap index and schema map generated                                                   |
| 5.13 | Success-story JSON endpoint (`/casos/exito-home.json`) | S      | 4.5                | Paginated JSON for home load-more                                                        |

### 6. Client-side interactivity

**Goal:** Add progressive enhancement for filters, gallery, consent, form, theme, and load-more.

| #   | Task                               | Effort | Dependencies | Acceptance criteria                                                                                        |
| --- | ---------------------------------- | ------ | ------------ | ---------------------------------------------------------------------------------------------------------- |
| 6.1 | Cookie consent banner              | M      | 2.4          | Accept/reject buttons, GTM injection only after accept, clear cookies on reject, dataLayer consent updates |
| 6.2 | Analytics events                   | M      | 6.1          | `data-track-*` and `brigada:analytics` event listeners wired to `dataLayer`                                |
| 6.3 | Adoption filter chips              | M      | 5.2          | Filter by sex and current need, update visible cards, handle empty state                                   |
| 6.4 | Dog gallery lightbox               | M      | 5.2          | Open from card, navigate images, close, handle 1–3 images, keyboard accessible                             |
| 6.5 | Home success-story load-more       | S      | 5.1          | Fetches additional stories from `/casos/exito-home.json`, preserves accessibility                          |
| 6.6 | Contact form validation            | S      | 5.7          | Field validation, success/error states, analytics events                                                   |
| 6.7 | Copy-to-clipboard for bank details | S      | 5.5          | Copy button updates on success/failure, details remain selectable                                          |
| 6.8 | Theme toggle                       | S      | 3.4          | Toggle button updates theme, persists across ClientRouter transitions                                      |
| 6.9 | Mobile navigation                  | S      | 2.5          | Menu toggle, focus trap, accessible markup                                                                 |

### 7. SEO, structured data, and metadata

**Goal:** Make every page discoverable and shareable correctly.

| #   | Task                        | Effort | Dependencies | Acceptance criteria                                                                    |
| --- | --------------------------- | ------ | ------------ | -------------------------------------------------------------------------------------- |
| 7.1 | Centralize site config      | S      | 2.1          | `src/config/site.ts` contains name, URL, contact links, IDs                            |
| 7.2 | JSON-LD builders            | M      | 7.1          | `structured-data.ts` generates Organization, WebSite, WebPage, BreadcrumbList, FAQPage |
| 7.3 | Page-level metadata         | M      | 7.1, 2.3     | Every page has unique title, description, canonical, OG image                          |
| 7.4 | Sitemap and RSS integration | S      | 2.2, 5.11    | Sitemap excludes `.json` routes; RSS is valid                                          |

### 8. Content migration and hygiene

**Goal:** Populate the site with real content and enforce rules.

| # | Task | Effort | Dependencies | Acceptance criteria |
|---|---|---|---|
| 8.1 | Migrate adoption dog profiles | L | 4.1 | All active dogs in `src/content/adoption-dogs/` with valid frontmatter and images |
| 8.2 | Migrate success stories | M | 4.2 | Stories ≤260 chars, mention adoption, max 3 images |
| 8.3 | Migrate supporters | S | 4.3 | Logos local, `logoAlt` present, kinds consistent |
| 8.4 | Migrate blog posts (if any) | S | 4.4 | Posts have required frontmatter |
| 8.5 | Implement source-hygiene tests | M | 4.1–4.4 | Tests enforce image limits, story length, hidden-dog expiration, no absolute paths, no `gtag.js` |
| 8.6 | Dog image normalization scripts | S | 8.1 | `npm run dog-images:check` and `npm run dog-images:write` work |

### 9. Quality assurance and testing

**Goal:** Keep the site correct, accessible, fast, and secure.

| #   | Task                                     | Effort | Dependencies | Acceptance criteria                                       |
| --- | ---------------------------------------- | ------ | ------------ | --------------------------------------------------------- |
| 9.1 | Configure ESLint + Stylelint + Prettier  | S      | 2.1          | `format:check` and `lint` scripts pass                    |
| 9.2 | Vitest source-hygiene tests              | M      | 4.1–4.4      | `npm run test:source` passes                              |
| 9.3 | Playwright configuration and smoke tests | M      | 2.1          | `npm run test:smoke` passes on critical pages             |
| 9.4 | Accessibility tests                      | M      | 5.1–5.10     | `npm run test:a11y` passes with axe-core                  |
| 9.5 | Analytics and consent tests              | M      | 6.1, 6.2     | `npm run test:consent` passes                             |
| 9.6 | Build-output tests                       | M      | 5.1–5.13     | `npm run test:build` validates generated output           |
| 9.7 | Lighthouse CI                            | S      | 5.1–5.10     | `npm run test:lighthouse` passes for checked pages        |
| 9.8 | Filter and stories tests                 | M      | 6.3, 6.5     | `filter-chips.spec.ts` and `stories-section.spec.ts` pass |

### 10. Deployment and hosting

**Goal:** Ship to production with security headers and redirects.

| #    | Task                               | Effort | Dependencies | Acceptance criteria                                           |
| ---- | ---------------------------------- | ------ | ------------ | ------------------------------------------------------------- |
| 10.1 | Configure Cloudflare Pages project | S      | 2.1          | GitHub repo connected, build command and output directory set |
| 10.2 | Set up `public/_headers`           | S      | 2.1          | Security headers present (CSP, HSTS, X-Frame-Options, etc.)   |
| 10.3 | Set up `public/_redirects`         | S      | 2.1          | Old URLs redirect permanently to new URLs                     |
| 10.4 | Verify build and deploy pipeline   | S      | 9.1–9.8      | Every push builds and deploys successfully                    |
| 10.5 | Configure custom domain            | S      | 10.1         | `brigadagalgos.cl` serves the site                            |

### 11. Documentation & security verification

**Goal:** Ensure the project is handoff-ready, secure, and well-documented.

| #    | Task                                 | Effort | Dependencies | Acceptance criteria                                                          |
| ---- | ------------------------------------ | ------ | ------------ | ---------------------------------------------------------------------------- |
| 11.1 | Finalize `README.md`                 | S      | 1.7          | Human-facing overview, setup, commands, related docs                         |
| 11.2 | Finalize `AGENTS.md`                 | S      | 1.7          | Operational guidance for agents, updated workflows, doc references           |
| 11.3 | Clean up `docs/`                     | S      | 1.1–1.6      | No stale docs, cross-references valid, no duplicate content                  |
| 11.4 | Secrets scan                         | S      | 10.4         | No API keys, tokens, or credentials in repo (except public IndexNow key)     |
| 11.5 | Dependency audit                     | S      | 10.4         | `npm audit` reviewed; no unaddressed high/critical vulnerabilities           |
| 11.6 | Deployment security review           | S      | 10.2–10.5    | CSP strict, HTTPS-only, headers validated, redirects correct                 |
| 11.7 | Accessibility and performance review | S      | 9.4, 9.7     | Lighthouse 100 on checked pages, no axe-core regressions                     |
| 11.8 | Final verification run               | S      | 9.1–9.8      | `npm run format:check`, `npm run lint`, `npm run build`, `npm test` all pass |

## Current status

- Phases 1 is complete.
- Phases 2–10 represent the historical build of the site. For future work, start from phase 11 if only documentation changes are needed, or from the relevant phase if new features are added.
- Phase 11 should be run before any significant release or handoff.

## How to use this checklist

1. For a new feature, identify the relevant phase and tasks.
2. Update dependencies if the feature changes the data model, routing, or shared components.
3. Add the feature’s acceptance criteria to the checklist or a linked PR description.
4. Run the final verification in phase 11 before merging.

## Related documents

- `docs/scope.md` — project scope
- `docs/site-brief.md` — product intent
- `docs/prd.md` — functional requirements
- `docs/spec.md` — technical specification
- `docs/feature-inventory.md` — current features
- `docs/content-model.md` — content schemas and workflows
- `docs/architecture-map.md` — component and content flow
- `AGENTS.md` — operational guidance

## Last updated

2026-07-05
