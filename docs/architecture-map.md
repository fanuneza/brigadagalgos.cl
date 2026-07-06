# Brigada Galgos — Architecture Map

## Overview

This document shows how content, components, utilities, and third-party services connect to produce the Brigada Galgos website. It is a map of the system at a medium level, suitable for onboarding and planning.

## High-level flow

```
┌────────────────────────────────────────────────────────────────────┐
│                        Content sources                              │
│  ┌────────────────┐ ┌────────────────┐ ┌──────────────────────┐  │
│  │ Markdown       │ │ Images         │ │ Config / copy        │  │
│  │ collections    │ │ (src/assets)   │ │ (src/config)         │  │
│  └───────┬────────┘ └───────┬────────┘ └───────────┬────────────┘  │
└──────────┼──────────────────┼──────────────────────┼───────────────┘
           │                  │                      │
           ▼                  ▼                      ▼
┌────────────────────────────────────────────────────────────────────┐
│                      Build-time processing (Astro 7)               │
│  ┌──────────────────┐ ┌──────────────────┐ ┌────────────────────┐    │
│  │ Content loader   │ │ Astro image      │ │ Zod schema       │    │
│  │ (glob)           │ │ service          │ │ validation       │    │
│  └─────────┬────────┘ └─────────┬────────┘ └─────────┬────────┘    │
│            │                    │                      │            │
│            ▼                    ▼                      ▼            │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Utility shaping                                            │    │
│  │ dog-content.ts  ·  story-card-copy.ts  ·  structured-data.ts│    │
│  └─────────────────────────┬──────────────────────────────────┘    │
│                            │                                        │
│                            ▼                                        │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Components and layouts                                     │    │
│  │ PageLayout  ·  BaseLayout  ·  sections  ·  shared UI        │    │
│  └─────────────────────────┬──────────────────────────────────┘    │
│                            │                                        │
│                            ▼                                        │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Static output                                              │    │
│  │ HTML · CSS · JSON · RSS · sitemap · images · headers       │    │
│  └─────────────────────────┬──────────────────────────────────┘    │
└──────────────────────────┼─────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────────┐
│                      Cloudflare Pages (CDN)                         │
│  ┌──────────────────┐ ┌──────────────────┐ ┌────────────────────┐    │
│  │ Public site      │ │ Security headers │ │ Redirects          │    │
│  └──────────────────┘ └──────────────────┘ └────────────────────┘    │
└────────────────────────────────────────────────────────────────────┘
```

## Page composition map

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
    │       ├── MissionSection
    │       ├── StoriesSection
    │       ├── ProcessStepper
    │       ├── RequirementCard
    │       ├── HelpCards
    │       ├── DonationBanner
    │       ├── SharedPhotoGallery
    │       └── ...
    │
    └── Footer
        ├── Links
        ├── Social links
        └── Legal / cookies

Optional afterShell slot:
└── SharedGalleryLightbox
```

## Content to page routing

```
src/content/adoption-dogs/  ──→  /adoptar  +  Home
src/content/success-dogs/   ──→  /por-que-galgos  +  /casos/exito-home.json  +  Home
src/content/supporters/     ──→  /colaboradores
src/content/blog/             ──→  /feed.xml (RSS)
```

## Data flow for a dog card

```
Markdown file
    │
    ▼
Astro content loader (glob)
    │
    ▼
Zod schema validation
    │
    ▼
src/utils/dog-content.ts
    │
    ▼
src/utils/responsive-gallery-images.ts
    │
    ▼
DogCard or lightbox component
    │
    ▼
Static HTML + responsive srcset
```

## Client-side script map

```
HTML page load
    │
    ├── cookie-consent.ts
    │       ├── Show banner if no consent cookie
    │       ├── On accept: inject GTM
    │       └── On reject: clear GA/GTM cookies
    │
    ├── analytics-events.ts
    │       ├── Track [data-track-*] elements
    │       ├── Track section views
    │       └── Dispatch custom `brigada:analytics` events
    │
    ├── theme.ts
    │       ├── Read saved theme / prefers-color-scheme
    │       ├── Apply data-theme attribute
    │       └── Handle ClientRouter transitions
    │
    ├── navbar.ts
    │       ├── Mobile menu toggle
    │       └── Theme toggle init guard
    │
    └── filters.ts (on /adoptar only)
            ├── Filter dog cards by sex
            └── Filter dog cards by current need
```

## Third-party integrations

```
┌─────────────────────┐      ┌─────────────────────┐
│   GTM / GA4         │      │   Cloudflare        │
│   (after consent)   │      │   Web Analytics     │
└──────────┬──────────┘      └─────────────────────┘
           │
           ▼
┌─────────────────────┐
│   dataLayer events  │
└─────────────────────┘
```

- **GTM/GA4** loads only after user consent. Events are pushed to `dataLayer` from tracked links, custom events, and form submissions.
- **Cloudflare Web Analytics** is loaded via DNS/beacon (privacy-focused, no cookie required).

## SEO / metadata pipeline

```
src/config/site.ts
    │
    ├── Site name, URL, contact links, social links
    │
    ▼
Page frontmatter / component props
    │
    ▼
BaseLayout.astro + SEO Graph integration
    │
    ├── <title> and <meta name="description">
    ├── Open Graph tags
    ├── Canonical URL
    └── JSON-LD via StructuredData.astro
            ├── Organization
            ├── WebSite
            ├── WebPage
            ├── BreadcrumbList
            └── FAQPage (where applicable)
```

## Image pipeline

```
src/assets/casos/adopcion/<dog>/<image>.jpg
    │
    ▼
astro:assets image service
    │
    ├── Cards: 360w, 480w, 640w AVIF + 480w WebP fallback
    ├── Lightbox: 1200w AVIF
    └── Hero: portrait 360w/540w/720w, landscape 640w/960w/1120w
```

## Testing layers

```
Source / Markdown
    │
    ├── Vitest
    │       ├── source-hygiene.test.ts (content rules)
    │       └── unit tests
    │
    ├── Playwright
    │       ├── a11y.spec.ts
    │       ├── analytics-consent.spec.ts
    │       ├── smoke.spec.ts
    │       ├── nav.spec.ts
    │       ├── filter-chips.spec.ts
    │       ├── stories-section.spec.ts
    │       └── build-output.spec.ts
    │
    └── Lighthouse CI
            └── Performance, a11y, best practices, SEO
```

## Deployment flow

```
GitHub push
    │
    ▼
Cloudflare Pages build
    │
    ├── npm install
    ├── npm run build
    └── deploy static files
    │
    ▼
Cloudflare edge
    │
    ├── public/_headers applied
    ├── public/_redirects applied
    └── global CDN distribution
```

## Key decisions captured

- **Static-only:** No server runtime; everything is generated at build time.
- **Content-first:** Dog profiles, stories, supporters, and blog posts are Markdown, not database entries.
- **Consent-first analytics:** GTM/GA4 do not load until the user explicitly consents.
- **CSS-first styling:** Existing modular CSS patterns are preserved and remain the primary styling system.
- **Image cap:** 3 images per dog/story to keep pages light and galleries manageable.
- **No markdown-alternate blog routes:** Disabled because it was a build breaker on Astro 7.

## Related documents

- `docs/site-brief.md` — product intent
- `docs/prd.md` — functional requirements
- `docs/spec.md` — technical specification
- `docs/feature-inventory.md` — current pages and features
- `docs/content-model.md` — content schemas and editorial rules
- `docs/developer-reference.md` — detailed content model, image sizes, and analytics events
- `AGENTS.md` — operational guidance

## Last updated

2026-07-05
