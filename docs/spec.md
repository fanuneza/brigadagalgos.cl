# Brigada Galgos — Technical Specification

## Scope

This document is the technical specification for the Brigada Galgos website. It describes the stack, file structure, data flow, external dependencies, submission approach, and key implementation decisions. Editorial rules and content workflows live in `docs/content-model.md`; functional requirements live in `docs/prd.md`.

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
├── DESIGN.md
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
│   │   └── colaboradores/       # Supporter logos
│   ├── components/              # Shared UI components
│   │   ├── DogCard.astro             # Shared adoption-dog card (featured + grid variants)
│   │   ├── Footer.astro
│   │   ├── InstagramLink.astro
│   │   ├── Navbar.astro
│   │   ├── PageHero.astro
│   │   ├── RainbowDivider.astro
│   │   ├── RequirementCard.astro
│   │   ├── SharedGalleryLightbox.astro
│   │   ├── SharedPhotoGallery.astro
│   │   ├── StoryCard.astro           # Shared success-story card
│   │   ├── TrackedLink.astro
│   │   └── WhatsAppLink.astro
│   ├── components/sections/     # Page-specific section components
│   │   ├── AdoptionGrid.astro
│   │   ├── AdoptionProcess.astro
│   │   ├── CasesBand.astro
│   │   ├── ContactChannels.astro
│   │   ├── ContactForm.astro
│   │   ├── CookieBanner.astro
│   │   ├── CookiePolicyArticle.astro
│   │   ├── CtaCard.astro             # Shared end-of-page CTA card
│   │   ├── DonationBanner.astro
│   │   ├── DonationCards.astro
│   │   ├── FaqSection.astro
│   │   ├── FeaturedAdoptionDogs.astro
│   │   ├── FosterPostular.astro
│   │   ├── FosterRequirements.astro
│   │   ├── HelpCards.astro
│   │   ├── Hero.astro
│   │   ├── ImpactSection.astro
│   │   ├── MissionSection.astro
│   │   ├── ProcessStepper.astro
│   │   ├── StoriesSection.astro      # Home success-story preview
│   │   ├── TrustStatsSection.astro
│   │   ├── WhyGalgosEditorial.astro
│   │   └── WhyGalgosSection.astro
│   ├── config/
│   │   ├── faq.ts               # FAQ data and grouping
│   │   └── site.ts              # Site metadata, contact links, IDs
│   ├── content/
│   │   ├── adoption-dogs/       # Markdown dog profiles
│   │   ├── success-dogs/        # Markdown success stories
│   │   ├── supporters/          # Markdown supporter entries
│   │   └── blog/                # Markdown blog posts
│   ├── content.config.ts        # Astro content collection schemas
│   ├── env.d.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro     # Document shell
│   │   └── PageLayout.astro     # Standard page wrapper
│   ├── pages/
│   │   ├── index.astro
│   │   ├── adoptar.astro
│   │   ├── adoptar/
│   │   │   └── [slug].astro     # Per-dog profile page
│   │   ├── casos-de-exito.astro # Full success-story archive
│   │   ├── por-que-galgos.astro
│   │   ├── hogar-temporal.astro
│   │   ├── donar.astro
│   │   ├── colaboradores.astro
│   │   ├── contacto.astro
│   │   ├── preguntas-frecuentes.astro
│   │   ├── politica-de-cookies.astro
│   │   ├── 404.astro
│   │   ├── blog/
│   │   │   ├── index.astro      # Blog listing
│   │   │   └── [id].astro       # Blog post page
│   │   ├── feed.xml.ts
│   │   ├── schemamap.xml.ts
│   │   ├── schema/
│   │   │   └── post.json.ts
│   │   ├── .well-known/
│   │   │   └── api-catalog.ts
│   │   └── 591c2b87f0b68c44f260215f5d8e9da3.txt.ts
│   ├── scripts/
│   │   ├── analytics-events.ts  # Tracked element and section event listeners
│   │   ├── cookie-consent.ts    # Consent banner and GTM lifecycle
│   │   ├── copy-data.ts         # Copy-to-clipboard helper (bank details, etc.)
│   │   ├── filter-chips.ts      # Adoption page filters
│   │   ├── form.ts              # Contact form validation and submission
│   │   ├── init-shared-gallery.ts # Gallery/lightbox bootstrap
│   │   ├── navbar.ts            # Mobile menu and theme toggle
│   │   ├── share-dog.ts         # Native share button with clipboard fallback
│   │   ├── theme.ts             # Dark/light theme persistence
│   │   └── gallery/             # Lightbox implementation modules
│   │       ├── carousel.ts
│   │       ├── dom.ts
│   │       └── lightbox.ts
│   ├── styles/
│   │   ├── global.css           # Global styles and imports
│   │   ├── tokens.css           # Design tokens
│   │   └── components/          # Modular component CSS
│   ├── types/
│   │   └── global.d.ts
│   └── utils/
│       ├── analytics.ts         # Analytics helpers and types
│       ├── blog-content.ts      # Blog entry shaping
│       ├── dog-content.ts       # Dog/story collection queries and card shaping
│       ├── gallery.ts           # Shared gallery types and build-time markup
│       ├── html-escape.ts       # HTML escape utilities
│       ├── instagram.ts         # Instagram URL handling
│       ├── reading-time.ts      # Blog reading-time estimate
│       ├── responsive-gallery-images.ts # Responsive image generation
│       ├── shuffle.ts           # Randomization utilities
│       └── structured-data.ts   # JSON-LD builders
├── scripts/                     # Maintenance and workflow scripts
│   ├── check-text-quality.mjs
│   ├── normalize-dog-images.mjs
│   └── run-playwright-server.mjs
├── tests/                       # Playwright specs and Vitest tests
│   ├── a11y.spec.ts
│   ├── analytics-consent.spec.ts
│   ├── build-output.spec.ts
│   ├── capture.spec.ts
│   ├── dog-content.test.ts
│   ├── dog-profile.spec.ts
│   ├── filter-chips.spec.ts
│   ├── nav.spec.ts
│   ├── smoke.spec.ts
│   ├── source-hygiene.test.ts
│   └── stories-section.spec.ts
└── docs/                        # Project documentation
    ├── site-brief.md
    ├── prd.md
    ├── spec.md
    ├── content-model.md
    ├── voice-and-tone.md
    └── plan/
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

Content-to-page routing:

```
src/content/adoption-dogs/  ──→  Home featured selection + /adoptar/ + /adoptar/<slug>/
src/content/success-dogs/   ──→  Home preview + /casos-de-exito/ + /por-que-galgos/
src/content/supporters/     ──→  /colaboradores/
src/content/blog/           ──→  /blog/ + /blog/<id>/ + /feed.xml (RSS)
```

## Layout hierarchy

```
BaseLayout.astro
│
├── Document shell
│   ├── Global styles (global.css + components)
│   ├── Theme init script (anti-flash, localStorage)
│   ├── SEO graph + JSON-LD (StructuredData.astro)
│   ├── GTM noscript fallback (only if consent given)
│   └── Cookie banner (server-rendered)
│
└── PageLayout.astro (most pages)
    │
    ├── Navbar
    │   ├── Logo + navigation links
    │   ├── Mobile menu toggle
    │   └── Theme toggle
    │
    ├── <main>
    │   └── Page-specific content
    │       ├── Hero / PageHero
    │       ├── Section components (src/components/sections/)
    │       └── Shared UI (StoriesSection, HelpCards, DonationBanner, ...)
    │
    └── Footer
        ├── Links
        ├── Social links
        └── Legal / cookies

Optional afterShell slot:
└── SharedGalleryLightbox
```

- `BaseLayout.astro` — document shell, global styles, SEO graph, GTM noscript fallback, cookie banner, client bootstrap scripts.
- `PageLayout.astro` — wraps `BaseLayout` with `Navbar`, `<main>`, and `Footer`. Provides an `afterShell` slot for components like `SharedGalleryLightbox`.

## Component organization

| Directory                  | Responsibility                         |
| -------------------------- | -------------------------------------- |
| `src/components/`          | Shared UI components used across pages |
| `src/components/sections/` | Page-specific section components       |

Key shared primitives:

- `TrackedLink.astro` — outbound link with analytics metadata.
- `WhatsAppLink.astro` — WhatsApp CTA with phone and message.
- `InstagramLink.astro` — Instagram link helper.
- `SharedGalleryLightbox.astro` — image gallery lightbox (also attaches the gallery init script).
- `SharedPhotoGallery.astro` — photo grid with responsive images.

## Utility modules

| Module                                   | Responsibility                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------- |
| `src/utils/dog-content.ts`               | Collection queries plus card/story shaping; 260-character excerpt default |
| `src/utils/gallery.ts`                   | Shared gallery types and build-time gallery markup                        |
| `src/utils/blog-content.ts`              | Shapes blog entries for listing and post pages                            |
| `src/utils/reading-time.ts`              | Estimates blog post reading time                                          |
| `src/utils/structured-data.ts`           | Centralized JSON-LD builders, breadcrumbs, FAQ structured data            |
| `src/utils/responsive-gallery-images.ts` | Generates responsive AVIF/WebP srcsets for dog images                     |
| `src/utils/analytics.ts`                 | Analytics helpers and event typing                                        |
| `src/utils/shuffle.ts`                   | Randomization helpers                                                     |
| `src/utils/html-escape.ts`               | HTML escape utilities                                                     |
| `src/utils/instagram.ts`                 | Instagram URL handling                                                    |

## Client scripts

- `src/scripts/cookie-consent.ts` — consent banner, GTM injection, consent state updates.
- `src/scripts/analytics-events.ts` — event listeners for tracked links and sections.
- `src/scripts/navbar.ts` — mobile navigation and theme toggle.
- `src/scripts/theme.ts` — dark/light theme persistence across page transitions.
- `src/scripts/filter-chips.ts` — adoption page filter chips.
- `src/scripts/form.ts` — contact form validation and submission handling.
- `src/scripts/copy-data.ts` — copy-to-clipboard for bank details and similar.
- `src/scripts/share-dog.ts` — native share button with clipboard fallback on dog profiles.
- `src/scripts/init-shared-gallery.ts` — gallery/lightbox bootstrap.
- `src/scripts/gallery/*.ts` — modular lightbox implementation (carousel, DOM, lightbox).

## Styling strategy

- The site is primarily styled with `src/styles/global.css` and modular CSS files in `src/styles/components/`.
- The site relies on modular CSS rather than a second utility-first styling layer.
- When editing existing components, prefer the surrounding pattern rather than introducing utility-heavy rewrites.
- Design tokens live in `src/styles/tokens.css` and are imported where needed.
- The visual design system (colors, typography, components) is documented in `DESIGN.md`.

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
Utility shaping (dog-content.ts)
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
4. **Shaping:** `src/utils/dog-content.ts` transforms entries into card-friendly data.
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
- Astro's image service generates responsive AVIF and WebP variants via `getImage`.
- All dog galleries are capped at 3 images (schema-validated).

Responsive variants generated per surface (verified against `src/utils/responsive-gallery-images.ts`, the hero sources builder in `src/pages/index.astro`, and the consuming components):

| Surface                               | Widths            | Formats and fallback                          |
| ------------------------------------- | ----------------- | --------------------------------------------- |
| Dog/story cards                       | 360w, 480w, 640w  | AVIF srcset + single 480w WebP fallback `src` |
| Lightbox                              | 1200w             | AVIF only                                     |
| Hero portrait                         | 360w, 540w, 720w  | AVIF + WebP srcsets; 540w WebP fallback `src` |
| Hero landscape                        | 640w, 960w, 1120w | AVIF + WebP srcsets                           |
| Editorial section (`/por-que-galgos`) | 400w, 600w, 728w  | AVIF + WebP via `Picture`                     |
| Supporter logos (`/colaboradores`)    | 240w, 360w, 480w  | `Image` srcset, quality 72                    |

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

Analytics is delivered through a single GTM container (`GTM-M2RN5B38`, configured in `src/config/site.ts`) that loads GA4; there is no standalone `gtag.js`. Events are pushed to `dataLayer` from `data-track-*` attributes, tracked sections, and the custom `brigada:analytics` DOM event. No personal data (emails, names, phone numbers) is sent.

### Consent state machine

| State    | GTM          | GA4 cookies | dataLayer      |
| -------- | ------------ | ----------- | -------------- |
| Default  | Not loaded   | Cleared     | Default denied |
| Accepted | Injected     | Allowed     | Granted        |
| Rejected | Not loaded   | Cleared     | Denied         |
| Changed  | Re-evaluated | Updated     | Updated        |

### Tracked events

Full event list, verified against `src/scripts/` and the `trackEvent` props in components:

- Navigation and links: `cta_click`, `navigation_click`, `social_click`, `whatsapp_click`, `outbound_click`
- Engagement: `section_view`, `scroll_depth`, `story_click`
- Gallery: `gallery_open`, `gallery_next`, `gallery_previous`
- Dogs: `dog_filter_click`, `dog_profile_click`, `dog_share_click`, `adoption_apply_click`, `foster_apply_click`
- Donations: `donation_esponsor_click`, `bank_data_copy`
- Contact form: `contact_form_submit`, `contact_form_invalid`, `contact_form_success`, `contact_form_error`
- Consent: `cookie_consent_action`, `cookie_consent_update`

To extend tracking:

1. Add `data-track-event` / `data-track-location` attributes to elements, or pass `trackEvent`/`trackLocation` to the shared link components.
2. Use `data-track-section="name"` for section view tracking.
3. Dispatch the custom `brigada:analytics` event with details from complex scripts (see `src/utils/analytics.ts`).

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

Deployment flow:

```
GitHub push
    │
    ▼
Cloudflare Pages build (npm install, npm run build, deploy static files)
    │
    ▼
Cloudflare edge (_headers and _redirects applied, global CDN)
```

## Testing strategy

- **Vitest** — source-hygiene checks (`tests/source-hygiene.test.ts`), unit tests (`tests/dog-content.test.ts`).
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

The editorial workflows for adding, hiding, and moving dogs (including the required `public/_redirects` entries) are documented in `docs/content-model.md`. `tests/source-hygiene.test.ts` enforces the tracking metadata and the redirect for every retired or hidden profile.

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

## Open items

Carried over from the retired follow-up notes; none of these block shipping.

- **Lighthouse local flakiness:** `.lighthouserc.cjs` runs with `numberOfRuns: 1` and a performance `minScore` of `0.99`. The page-hero LCP sits near a scoring-curve boundary, so a single local run can flake on one page. If exactly one page fails at the boundary, re-run once before treating it as a regression. Durable fixes, not yet applied: aggregate with `numberOfRuns: 3` (median), or relax only the performance category on documented borderline-LCP pages.
- **Blog post semantic structure:** in `src/pages/blog/[id].astro`, the `<article>` wraps only the post header; the body (`<Content />`) renders in a sibling `<section>`. Semantically the article should wrap both. Fix when the first real blog post ships.
- **`dog_share_click` timing:** the event fires when the share button is clicked, before the share completes (see `src/scripts/share-dog.ts`). This is an accepted trade-off — it measures intent, which is the useful funnel signal.

## Last updated

2026-07-28
