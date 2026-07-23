# Brigada Galgos — Technical Specification

## Scope

This document is the technical specification for the Brigada Galgos website. It describes the stack, file structure, data flow, external dependencies, submission approach, and key implementation decisions. It complements `docs/developer-reference.md`, which contains the detailed content model, image sizes, and analytics event list.

## Stack choices

| Layer           | Choice                                                     | Rationale                                                                                         |
| --------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Framework       | Astro 7 (static output)                                    | Content-driven, static-first, fast builds, excellent image optimization, no server runtime needed |
| Language        | TypeScript                                                 | Type safety across components, utilities, and tests                                               |
| Templating      | Astro components (`.astro`)                                | Server-rendered HTML with scoped JS/TS where needed                                               |
| Styling         | Modular CSS (`src/styles/`)                                | Existing CSS patterns are preserved without maintaining a second styling system                   |
| Content         | Markdown + YAML frontmatter in Astro content collections   | Easy for non-developers to edit; validated at build time                                          |
| Images          | `astro:assets` + Sharp                                     | Responsive AVIF/WebP generation from local assets                                                 |
| Hosting         | Cloudflare Pages                                           | Native static-site hosting, global CDN, security headers via `_headers`                           |
| CI/CD           | GitHub → Cloudflare Pages                                  | Deploy on push; build and test run on the platform                                                |
| Analytics       | GTM-delivered GA4 after consent + Cloudflare Web Analytics | Privacy-first, consent-gated, no standalone `gtag.js`                                             |
| SEO             | `@astrojs/sitemap`, `@jdevalk/astro-seo-graph`             | Sitemap and validated SEO graph / JSON-LD                                                         |
| Feed            | `@astrojs/rss`                                             | RSS from blog collection                                                                          |
| Testing         | Vitest + Playwright + Lighthouse CI                        | Unit/source hygiene, browser/E2E, accessibility, performance                                      |
| Package manager | npm with committed `package-lock.json`                     | Reproducible installs                                                                             |
| Runtime         | Node 22+                                                   | Matches `.nvmrc` and Astro 7 requirements                                                         |

## Architecture overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Build-time (Astro 7)                    │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────────────┐  │
│  │ Content      │   │ Astro pages  │   │ Shared components  │  │
│  │ collections  │→  │ & layouts    │→  │ (sections, UI)     │  │
│  │ (Markdown)   │   │              │   │                    │  │
│  └──────────────┘   └──────────────┘   └────────────────────┘  │
│          │                 │                      │              │
│          ▼                 ▼                      ▼              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Static HTML, CSS, JSON, RSS, and images           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            ▼                                     │
│                  Cloudflare Pages (CDN)                          │
└─────────────────────────────────────────────────────────────────┘
```

The site is a static Astro 7 site. All pages are generated at build time from Markdown content collections and Astro components. There is no server-side runtime.

## Framework and hosting

- **Framework:** Astro 7, static output only (`output: "static"`).
- **Site URL:** `https://brigadagalgos.cl`
- **Trailing slash:** always on.
- **Hosting:** Cloudflare Pages from GitHub.
- **Node runtime:** 22+ via `.nvmrc`.
- **Package manager:** npm with committed `package-lock.json`.

## Integrations

- `@astrojs/sitemap` — generates `sitemap.xml` and `sitemap-index.xml`.
- `@astrojs/rss` — generates `feed.xml` from the blog collection.
- `@jdevalk/astro-seo-graph` — validates and generates SEO graph metadata and JSON-LD.

## File structure

```
brigadagalgos.cl/
├── README.md
├── AGENTS.md
├── astro.config.mjs
├── package.json
├── package-lock.json
├── .nvmrc
├── public/
│   ├── _headers
│   ├── _redirects
│   ├── favicon.ico
│   ├── robots.txt
│   ├── site.webmanifest
│   ├── llms.txt
│   ├── icons/
│   └── images/
├── src/
│   ├── assets/
│   │   ├── casos/
│   │   │   ├── adopcion/        # Dog profile photos
│   │   │   └── exito/           # Success story photos
│   │   └── colaboradores/        # Supporter logos
│   ├── components/
│   │   ├── DonationBanner.astro
│   │   ├── ExternalLink.astro
│   │   ├── Footer.astro
│   │   ├── HelpCards.astro
│   │   ├── Hero.astro
│   │   ├── InstagramLink.astro
│   │   ├── MissionSection.astro
│   │   ├── Navbar.astro
│   │   ├── PageHero.astro
│   │   ├── ProcessStepper.astro
│   │   ├── RainbowDivider.astro
│   │   ├── RequirementCard.astro
│   │   ├── SharedGalleryLightbox.astro
│   │   ├── SharedPhotoGallery.astro
│   │   ├── StoriesSection.astro      # Home preview
│   │   ├── StoryCard.astro           # Shared success-story card
│   │   ├── StructuredData.astro
│   │   ├── TrackedLink.astro
│   │   └── WhatsAppLink.astro
│   ├── components/sections/      # Page-specific sections (if any)
│   ├── config/
│   │   ├── faq.ts                # FAQ data and grouping
│   │   └── site.ts               # Site metadata, contact links, IDs
│   ├── content/
│   │   ├── adoption-dogs/        # Markdown dog profiles
│   │   ├── success-dogs/         # Markdown success stories
│   │   ├── supporters/           # Markdown supporter entries
│   │   └── blog/                 # Markdown blog posts
│   ├── content.config.ts          # Astro content collection schemas
│   ├── env.d.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro      # Document shell
│   │   └── PageLayout.astro      # Standard page wrapper
│   ├── pages/
│   │   ├── index.astro
│   │   ├── adoptar.astro
│   │   ├── casos-de-exito.astro      # Full success-story archive
│   │   ├── por-que-galgos.astro
│   │   ├── hogar-temporal.astro
│   │   ├── donar.astro
│   │   ├── colaboradores.astro
│   │   ├── contacto.astro
│   │   ├── preguntas-frecuentes.astro
│   │   ├── politica-de-cookies.astro
│   │   ├── 404.astro
│   │   ├── feed.xml.ts
│   │   ├── schemamap.xml.ts
│   │   ├── schema/
│   │   │   └── post.json.ts
│   │   ├── .well-known/
│   │   │   └── api-catalog.ts
│   │   └── 591c2b87f0b68c44f260215f5d8e9da3.txt.ts
│   ├── scripts/
│   │   ├── analytics-events.ts   # Tracked element and section event listeners
│   │   ├── cookie-consent.ts     # Consent banner and GTM lifecycle
│   │   ├── copy-data.ts          # Copy-to-clipboard helper (bank details, etc.)
│   │   ├── filter-chips.ts       # Adoption page filters
│   │   ├── form.ts               # Contact form validation and submission
│   │   ├── init-shared-gallery.ts
│   │   ├── navbar.ts             # Mobile menu and theme toggle
│   │   ├── shared-gallery.ts
│   │   ├── theme.ts              # Dark/light theme persistence
│   │   └── gallery/              # Lightbox implementation modules
│   │       ├── carousel.ts
│   │       ├── dom.ts
│   │       ├── index.ts
│   │       ├── lightbox.ts
│   │       ├── markup.ts
│   │       └── types.ts
│   ├── styles/
│   │   ├── global.css             # Global styles and imports
│   │   ├── tokens.css             # Design tokens
│   │   └── components/            # Modular component CSS
│   ├── types/
│   │   └── global.d.ts
│   └── utils/
│       ├── analytics.ts           # Analytics helpers and types
│       ├── dog-content.ts         # Dog/story card shaping
│       ├── hero-images.ts         # Hero image resolution
│       ├── html-escape.ts         # HTML escape utilities
│       ├── instagram.ts           # Instagram URL handling
│       ├── responsive-gallery-images.ts  # Responsive image generation
│       ├── schema.ts              # Schema helpers
│       ├── shuffle.ts             # Randomization utilities
│       ├── story-card-copy.ts     # Success-story excerpt builder
│       └── structured-data.ts     # JSON-LD builders
├── scripts/                       # Maintenance and workflow scripts
│   ├── check-text-quality.mjs
│   ├── normalize-dog-images.mjs
│   ├── prepare-casos-site.mjs
│   └── run-playwright-server.mjs
├── tests/                         # Playwright specs and Vitest tests
│   ├── a11y.spec.ts
│   ├── analytics-consent.spec.ts
│   ├── build-output.spec.ts
│   ├── capture.spec.ts
│   ├── filter-chips.spec.ts
│   ├── nav.spec.ts
│   ├── smoke.spec.ts
│   ├── source-hygiene.test.ts
│   └── stories-section.spec.ts
├── docs/                          # Project documentation
│   ├── builder-profile.md
│   ├── scope.md
│   ├── site-brief.md
│   ├── prd.md
│   ├── spec.md
│   ├── feature-inventory.md
│   ├── content-model.md
│   ├── architecture-map.md
│   ├── voice-and-tone.md
│   ├── developer-reference.md
│   └── deep-research.md
└── .claude/                       # Claude Code configuration
    └── CLAUDE.md
```

## Content architecture

Content is stored as Markdown files with frontmatter in `src/content/`. Astro content collections validate frontmatter at build time through `src/content.config.ts`.

| Collection      | Location                     | Schema source           |
| --------------- | ---------------------------- | ----------------------- |
| `adoption-dogs` | `src/content/adoption-dogs/` | `src/content.config.ts` |
| `success-dogs`  | `src/content/success-dogs/`  | `src/content.config.ts` |
| `supporters`    | `src/content/supporters/`    | `src/content.config.ts` |
| `blog`          | `src/content/blog/`          | `src/content.config.ts` |

Images referenced by collections live in `src/assets/` and are processed by `astro:assets`.

## Layout hierarchy

```
BaseLayout.astro
  └── PageLayout.astro (most pages)
        ├── Navbar
        ├── <main>
        │     └── page content
        └── Footer
```

- `BaseLayout.astro` — document shell, global styles, SEO graph, GTM noscript fallback, cookie banner, client bootstrap scripts.
- `PageLayout.astro` — wraps `BaseLayout` with `Navbar`, `<main>`, and `Footer`. Provides an `afterShell` slot for components like `SharedGalleryLightbox`.

## Component organization

| Directory                  | Responsibility                            |
| -------------------------- | ----------------------------------------- |
| `src/components/`          | Shared UI components used across pages    |
| `src/components/sections/` | Page-specific section components (if any) |

Key shared primitives:

- `TrackedLink.astro` — outbound link with analytics metadata.
- `ExternalLink.astro` — simple external new-tab link.
- `WhatsAppLink.astro` — WhatsApp CTA with phone and message.
- `InstagramLink.astro` — Instagram link helper.
- `SharedGalleryLightbox.astro` — image gallery lightbox.
- `SharedPhotoGallery.astro` — photo grid with responsive images.
- `StructuredData.astro` — injects JSON-LD.

## Utility modules

| Module                                   | Responsibility                                                      |
| ---------------------------------------- | ------------------------------------------------------------------- |
| `src/utils/dog-content.ts`               | Shapes adoption-dog and success-dog entries for cards and galleries |
| `src/utils/story-card-copy.ts`           | Builds success-story card excerpts with the 260-character default   |
| `src/utils/structured-data.ts`           | Centralized JSON-LD builders, breadcrumbs, FAQ structured data      |
| `src/utils/responsive-gallery-images.ts` | Generates responsive AVIF/WebP srcsets for dog images               |
| `src/utils/hero-images.ts`               | Hero image resolution helpers                                       |
| `src/utils/analytics.ts`                 | Analytics helpers and event typing                                  |
| `src/utils/schema.ts`                    | Schema-related helpers                                              |
| `src/utils/shuffle.ts`                   | Randomization helpers                                               |
| `src/utils/html-escape.ts`               | HTML escape utilities                                               |
| `src/utils/instagram.ts`                 | Instagram URL handling                                              |

## Client scripts

- `src/scripts/cookie-consent.ts` — consent banner, GTM injection, consent state updates.
- `src/scripts/analytics-events.ts` — event listeners for tracked links and sections.
- `src/scripts/navbar.ts` — mobile navigation and theme toggle.
- `src/scripts/theme.ts` — dark/light theme persistence across page transitions.
- `src/scripts/filter-chips.ts` — adoption page filter chips.
- `src/scripts/form.ts` — contact form validation and submission handling.
- `src/scripts/copy-data.ts` — copy-to-clipboard for bank details and similar.
- `src/scripts/gallery/*.ts` — modular lightbox implementation (carousel, DOM, markup, lightbox, types).

## Styling strategy

- The site is primarily styled with `src/styles/global.css` and modular CSS files in `src/styles/components/`.
- The site relies on modular CSS rather than a second utility-first styling layer.
- When editing existing components, prefer the surrounding pattern rather than introducing utility-heavy rewrites.
- Design tokens live in `src/styles/tokens.css` and are imported where needed.

## Data flow

```
Markdown content
       │
       ▼
Astro content loader (glob)
       │
       ▼
Zod schema validation
       │
       ▼
Utility shaping (dog-content.ts, story-card-copy.ts)
       │
       ▼
Components render HTML + responsive images
       │
       ▼
Build output (static files)
```

### Content-to-render pipeline

1. **Source:** Markdown files in `src/content/` with YAML frontmatter.
2. **Loading:** Astro's `glob` loader reads each file into a collection entry.
3. **Validation:** Zod schemas in `src/content.config.ts` enforce types, required fields, and image limits.
4. **Shaping:** `src/utils/dog-content.ts` and `src/utils/story-card-copy.ts` transform entries into card-friendly data.
5. **Image generation:** `src/utils/responsive-gallery-images.ts` and `astro:assets` generate responsive srcsets.
6. **Rendering:** Astro components produce server-rendered HTML, JSON endpoints, and RSS.
7. **Deployment:** Static files are uploaded to Cloudflare Pages.

## Adoption and success-story routes

- The homepage renders up to three active entries from `adoption-dogs` immediately after the hero, ordered by `order` and then name.
- `/adoptar/` remains the full active listing with filters and conversion actions; `/adoptar/<slug>/` remains the active profile route.
- The homepage renders a fixed three-story `success-dogs` preview. `/casos-de-exito/` statically renders the complete success-story collection using `StoryCard.astro` and shared galleries.
- The old homepage JSON pagination endpoint and its client script are intentionally absent.

## Image pipeline

- Dog photos are stored in `src/assets/casos/adopcion/` and `src/assets/casos/exito/`.
- Astro's image service generates responsive AVIF and WebP variants.
- Cards use 360w/480w/640w AVIF with a 480w WebP fallback.
- Lightbox uses 1200w AVIF.
- Hero images use portrait and landscape sizes.
- All dog galleries are capped at 3 images.

## Analytics and consent flow

```
User visits page
       │
       ▼
Cookie banner shown (no GTM loaded yet)
       │
       ▼
User accepts → GTM injected → dataLayer consent granted
User rejects → known cookies cleared → dataLayer consent denied
```

Analytics events are emitted via `dataLayer` from tracked elements, custom events, and form interactions. The full event list is in `docs/developer-reference.md`.

### Consent state machine

| State    | GTM          | GA4 cookies | dataLayer      |
| -------- | ------------ | ----------- | -------------- |
| Default  | Not loaded   | Cleared     | Default denied |
| Accepted | Injected     | Allowed     | Granted        |
| Rejected | Not loaded   | Cleared     | Denied         |
| Changed  | Re-evaluated | Updated     | Updated        |

## SEO and structured data

Every page includes:

- Unique `<title>` and meta description.
- Canonical URL and Open Graph metadata.
- JSON-LD for Organization, WebSite, WebPage, and BreadcrumbList.
- FAQ pages include FAQPage structured data.

`src/config/site.ts` centralizes site metadata, contact links, and third-party IDs.

## External dependencies

### Runtime dependencies

| Package                        | Purpose                           |
| ------------------------------ | --------------------------------- |
| `astro`                        | Framework and static build        |
| `@astrojs/rss`                 | RSS feed generation               |
| `@astrojs/sitemap`             | Sitemap generation                |
| `@jdevalk/astro-seo-graph`     | SEO graph and JSON-LD integration |
| `@jdevalk/seo-graph-core`      | SEO graph core utilities          |
| `@fontsource/barlow-condensed` | Web font                          |

### Development dependencies

| Package                                   | Purpose                              |
| ----------------------------------------- | ------------------------------------ |
| `@astrojs/check`                          | Astro type checking                  |
| `@axe-core/playwright`                    | Accessibility testing                |
| `@lhci/cli`                               | Lighthouse CI                        |
| `@playwright/test`                        | Browser and E2E testing              |
| `@typescript-eslint/*`                    | TypeScript ESLint rules              |
| `cross-env`                               | Cross-platform environment variables |
| `eslint` + `eslint-plugin-astro`          | Linting                              |
| `prettier` + `prettier-plugin-astro`      | Formatting                           |
| `sharp`                                   | Image processing backend             |
| `stylelint` + `stylelint-config-standard` | CSS linting                          |
| `typescript`                              | Type checking                        |
| `vitest`                                  | Unit and source-hygiene tests        |

### Third-party services

| Service                  | Purpose                 | Notes                         |
| ------------------------ | ----------------------- | ----------------------------- |
| Cloudflare Pages         | Hosting and CDN         | Static deployment from GitHub |
| Cloudflare Web Analytics | Privacy-first analytics | No cookie required            |
| GTM / GA4                | Behavioral analytics    | Only loads after consent      |
| WhatsApp API (`wa.me`)   | Direct messaging        | Outbound link                 |
| Google Forms             | Adoption form           | Outbound link                 |
| eSponsor                 | Recurring donations     | Outbound link                 |
| Instagram / Facebook     | Social proof            | Outbound links                |

## Security and deployment

- `public/_headers` provides security headers for Cloudflare Pages.
- `public/_redirects` handles permanent redirects and URL migration.
- CSP is strict; third-party allowances are documented in code and headers.
- HTTPS-only assumptions throughout.

## Testing strategy

- **Vitest** — source-hygiene checks, unit tests, content validation.
- **Playwright** — browser tests, accessibility scans, smoke tests, analytics-consent tests, build-output checks.
- **Lighthouse CI** — performance, accessibility, best practices, SEO.

Minimum delivery checks:

```bash
npm run format:check
npm run lint
npm run build
npm test
```

For major UX/SEO/performance changes, also run `npm run test:lighthouse`.

## Submission approach

For any change that touches the site, the submission path is:

1. **Branch** from `main`.
2. **Implement** the change following existing patterns in the surrounding code.
3. **Run local verification** unless the task is documentation-only:
   ```bash
   npm run format:check
   npm run lint
   npm run build
   npm test
   ```
4. **For major UX/SEO/performance changes**, also run `npm run test:lighthouse`.
5. **Open a pull request** to `main`.
6. **Cloudflare Pages builds and deploys** the preview; the test suite is expected to pass.
7. **Merge** after review.

### Exception: documentation-only changes

Markdown-only changes to `docs/`, `README.md`, or `AGENTS.md` may skip the full build/test pipeline, but `format:check` and `lint` should still pass when the docs are touched before the end of the session.

## Content workflow for dog status changes

### Moving a dog from adoption to success

1. `git mv src/content/adoption-dogs/name.md src/content/success-dogs/name.md`
2. `git mv src/assets/casos/adopcion/name src/assets/casos/exito/name`
3. Rewrite frontmatter: remove adoption-only fields, add `story` (≤260 chars, mentions adoption).
4. Update `scripts/prepare-casos-site.mjs` if the dog is in `ADOPTION_IDS` or `ADOPTION_OVERRIDES`.

### Hiding a dog temporarily

Set `active: false`, provide `hiddenSince` and `hiddenReason`, and ensure the entry is not older than 90 days.

## Extensibility notes

- To add a new static page, create an Astro file in `src/pages/` and use `PageLayout` if it fits the standard shell.
- To add a new content field, update `src/content.config.ts` and any UI utilities that consume it.
- To add a new analytics event, emit `brigada:analytics` with details or add `data-track-*` attributes.
- To add a new style, prefer extending existing modular CSS over creating competing utility patterns.
- To add a new client interaction, keep it small, server-rendered by default, and progressive-enhancement friendly.

## Key decisions captured

- **Static-only:** No server runtime; everything is generated at build time.
- **Content-first:** Dog profiles, stories, supporters, and blog posts are Markdown, not database entries.
- **Consent-first analytics:** GTM/GA4 do not load until the user explicitly consents.
- **CSS-first styling:** Existing modular CSS patterns are preserved without maintaining a parallel utility-first styling layer.
- **Image cap:** 3 images per dog/story to keep pages light and galleries manageable.
- **No markdown-alternate blog routes:** Disabled because it was a build breaker on Astro 7.
- **Local-first assets:** No remote image CDNs for dog photography.
- **Accessibility as a hard constraint:** Lighthouse and axe-core tests are part of the delivery pipeline.

## Related documents

- `docs/site-brief.md` — product intent
- `docs/prd.md` — functional requirements
- `docs/feature-inventory.md` — current pages and features
- `docs/content-model.md` — content schemas and editorial rules
- `docs/architecture-map.md` — component and content flow
- `docs/developer-reference.md` — detailed content model, image sizes, and analytics events
- `AGENTS.md` — operational guidance

## Last updated

2026-07-05
