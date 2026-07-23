# Brigada Galgos — Feature Inventory

## Scope

This document lists every page, section, and capability of the current site. It is intended as a quick reference for future planning, onboarding, and scope decisions.

## Public pages

### Home (`/`)

- Hero with mission statement and primary CTAs.
- Mission / value proposition.
- Featured active adoption dogs immediately after the hero (cards link to `/adoptar/<slug>/` and the section links to `/adoptar/`).
- Three-story success preview after the mission, trust and educational content, with a link to `/casos-de-exito/`.
- How to help (adopt, foster, donate).
- Donation callout / impact card.
- Footer with links and social channels.

### Adoptar (`/adoptar/`)

- Filter chips for sex and current need.
- Grid of active dog cards.
- Dog card: photo, name, sex, age, weight, character sketch.
- Shared lightbox: gallery (max 3 images), details, WhatsApp CTA, adoption form link.
- Process explanation (4 steps).
- Reassurance about post-adoption support.
- Cards link to a full profile page at `/adoptar/<slug>/` (name link + "Conocer a {name}" button).

### Dog profile (`/adoptar/<slug>/`)

- One page per adoption dog with `active !== false`.
- Per-dog title, meta description (via `buildDogMetaDescription`), and OG image (first gallery image, 1200×630).
- Breadcrumb name override for the dog's name.
- WhatsApp CTA and link to the adoption form.
- Native share button with clipboard fallback.

### Por qué galgos (`/por-que-galgos/`)

- Editorial sections about galgo lifestyle.
- FAQ group: “Sobre los galgos”.
- 3 randomly selected success stories per build.
- CTA to adoption or contact.

### Hogar temporal (`/hogar-temporal/`)

- What foster care means and how long it lasts.
- What Brigada covers vs. what the foster provides.
- Requirement cards or checklist.
- CTA to WhatsApp / contact.

### Donar (`/donar/`)

- Impact amounts with concrete outcomes.
- Bank transfer details with copy action.
- eSponsor recurring donation card.
- Transparency statement: no state funding, all volunteers, no salaries/rent/ad buying.
- CTA to contact for other support.

### Colaboradores (`/colaboradores/`)

- Supporter grid with logos.
- Grouping by kind and custom order.
- Accessible logo alt text.
- Links to supporter websites.

### Contacto (`/contacto/`)

- WhatsApp button with phone number.
- Email link.
- Social links (Instagram, Facebook).
- Contact form with validation and analytics events.
- Low-pressure invitation to ask questions.

### Preguntas frecuentes (`/preguntas-frecuentes/`)

- Grouped FAQ list.
- Expand/collapse answers.
- FAQ structured data for SEO.

### Política de cookies (`/politica-de-cookies/`)

- Cookie explanation.
- How to change consent.
- Link to cookie banner action.

### 404 (`/404/`)

- Friendly not-found message.
- Links to main pages.

## Content-driven features

### Adoption dogs

- Source: `src/content/adoption-dogs/`.
- Rendered as cards on `/adoptar` and home.
- Hidden via `active: false` with required `hiddenSince` and `hiddenReason`.
- Expire after 90 days (enforced by tests).
- Max 3 images per profile.

### Success dogs

- Source: `src/content/success-dogs/`.
- Rendered as a three-story home preview, the complete `/casos-de-exito/` archive, and `/por-que-galgos` (3 random).
- Stories max 260 characters and must mention adoption outcome.
- Max 3 images per story.

### Supporters

- Source: `src/content/supporters/`.
- Rendered on `/colaboradores`.
- Local logo images with `logoAlt`.

### Blog

- Source: `src/content/blog/`.
- Powers `/feed.xml` RSS feed and the `/blog/` listing + `/blog/<id>/` post pages.
- Posts with `draft: true` are excluded from both the pages and the feed.
- Post bodies start headings at `##`; the page renders the only `h1` from `title`.
- No markdown-alternate routes (`markdownAlternate: false`).

## Shared components

- `Navbar` — site navigation, mobile menu, theme toggle.
- `Footer` — links, social, legal.
- `Hero` — homepage hero.
- `PageHero` — hero for inner pages.
- `MissionSection` — mission/value proposition.
- `StoriesSection` — success-story preview with archive route.
- `ProcessStepper` — adoption/foster steps.
- `RequirementCard` — checklist item component.
- `HelpCards` — CTA cards (adopt, foster, donate).
- `DonationBanner` — donation callout.
- `RainbowDivider` — decorative divider.
- `SharedPhotoGallery` / `SharedGalleryLightbox` — image gallery and lightbox.
- `StructuredData` — JSON-LD injection.
- `TrackedLink`, `ExternalLink`, `WhatsAppLink`, `InstagramLink` — link primitives.

## Interactive capabilities

- Dark / light theme toggle (persisted in `localStorage`, respects `prefers-color-scheme`).
- Mobile navigation menu.
- Cookie consent banner with accept / reject.
- Adoption filter chips (sex, current need).
- Dog gallery lightbox with next/previous/close.
- Bank details copy-to-clipboard.
- Contact form validation and submission feedback.
- Smooth scrolling / anchor links.

## SEO and metadata features

- Unique title and meta description per page.
- Canonical URLs and Open Graph tags.
- JSON-LD: Organization, WebSite, WebPage, BreadcrumbList, FAQPage.
- Sitemap index and RSS feed.
- Responsive images with `srcset` and `sizes`.
- Prefetch on hover.

## Analytics and consent features

- GTM-delivered GA4 after consent.
- Consent Mode v2 dataLayer updates.
- Cookie rejection clears known GA/GTM cookies.
- Cloudflare Web Analytics.
- Tracked events for CTAs, navigation, social, WhatsApp, outbound links, gallery, filters, stories, forms, and consent.

## Build and quality features

- Astro check, build, and static output.
- Prettier formatting check.
- ESLint + Stylelint + custom text-quality checker.
- Vitest source hygiene and unit tests.
- Playwright browser, accessibility, smoke, and consent tests.
- Lighthouse CI.
- Dog image normalization scripts.
- Case preparation scripts for dog data.

## Utility / feed outputs

- `/blog/` — blog listing (published posts only).
- `/blog/<id>/` — individual blog post page.
- `/feed.xml` — RSS feed.
- `/sitemap.xml` / `/sitemap-index.xml` — sitemap.
- `/schemamap.xml` — schema map index.
- `/schema/post.json` — post schema metadata.
- `/591c2b87f0b68c44f260215f5d8e9da3.txt` — IndexNow verification.

## Not yet implemented

- Individual success story detail pages (rendered via lightbox/card only).
- Search across content.
- Multi-language support.
- Server-side forms or APIs.
- Admin/dashboard interface.

## Related documents

- `docs/site-brief.md` — product intent
- `docs/prd.md` — functional requirements
- `docs/spec.md` — technical specification
- `docs/content-model.md` — content schemas and editorial rules
- `docs/architecture-map.md` — component and content flow
- `AGENTS.md` — operational guidance

## Last updated

2026-07-06
