# Architecture — how the site is built

This file owns the **mechanism** axis: how the static site is assembled. Requirements live in `docs/quality.md`; procedures live in `docs/maintenance.md`.

Brigada Galgos is an Astro 7 site with `output: "static"`: every page, endpoint, and image variant is generated at build time and deployed to Cloudflare Pages from GitHub. There is no server runtime.

## Entry points

| Entry point             | Role                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| `astro.config.mjs`      | Build config: output mode, integrations, fonts, image options, typed env schema                   |
| `src/pages/`            | Route tree; file-based routing emits one HTML page or endpoint per file                           |
| `src/content.config.ts` | Content-collection schemas (Zod); validates frontmatter at build time                             |
| `src/config/site.ts`    | `SITE` (metadata, contact URLs, third-party IDs), `NAV_ENTRIES` and derived menus, `INDEXNOW_KEY` |
| `package.json` scripts  | Command authority: `build`, `lint`, `test`, `format`, `test:lighthouse`, capture scripts          |

## Build pipeline

`npm run build` runs `astro check && astro build` (telemetry disabled via `cross-env`). Type checking is part of the build, not an optional gate.

`astro.config.mjs` sets `build.inlineStylesheets: "auto"`. Astro decides per stylesheet whether to inline into HTML or emit a linked file, which avoids over-inlining the site's CSS into every page. This is deliberate; do not revert it.

The site deploys as static files to Cloudflare Pages; `public/_headers` and `public/_redirects` are Cloudflare Pages conventions applied at the edge.

## Route model

`trailingSlash: "always"` — every URL ends in `/`, and redirects in `public/_redirects` follow the same convention.

Static pages in `src/pages/`: `index.astro`, `adoptar.astro`, `casos-de-exito.astro`, `colaboradores.astro`, `contacto.astro`, `donar.astro`, `hogar-temporal.astro`, `por-que-galgos.astro`, `preguntas-frecuentes.astro`, `politica-de-cookies.astro`, `404.astro`, and `blog/index.astro`.

Dynamic routes:

- `src/pages/adoptar/[slug].astro` — one profile page per active adoption dog.
- `src/pages/blog/[id].astro` — one page per non-draft blog post.

Endpoints (also in `src/pages/`):

- `feed.xml.ts` — RSS feed built from the `blog` collection via `@astrojs/rss`; drafts are excluded.
- `schemamap.xml.ts` and `schema/post.json.ts` — SEO graph endpoints; `.json` pages are filtered out of the sitemap.
- `.well-known/api-catalog.ts` — well-known API catalog endpoint.
- `591c2b87f0b68c44f260215f5d8e9da3.txt.ts` — IndexNow key verification file; the filename must keep matching `INDEXNOW_KEY` in `src/config/site.ts`.

## Content collections

Three collections in `src/content.config.ts`, all Markdown loaded with the `glob` loader: `dogs` (`src/content/dogs/`), `supporters` (`src/content/supporters/`), and `blog` (`src/content/blog/`).

`dogs` is a Zod discriminated union on `status`:

- `status: "adopcion"` — adoption profile fields (`sex`, `age`, `weight`, `details`, `characterSketch`, optional `adoptionFacts` with a four-axis `compatibility` object, `currentNeed`, hide-tracking fields). A `superRefine` requires `hiddenSince` and `hiddenReason` whenever `active: false`.
- `status: "exito"` — success story: a required `story` string; `gallery` defaults to `[]`.

Both variants share `name`, optional `instagramUrl`, and a `gallery` of images capped at 3. The `supporters` schema requires a `logo` image and `logoAlt`; `blog` posts carry `pubDate`, `author`, `description`, and a `draft` flag.

Collection queries and card/story shaping live in `src/utils/dog-content.ts` (including the 260-character story-card excerpt default, `STORY_CARD_MAX_CHARACTERS`). Pages consume shaped data from there rather than querying collections inline.

Content-to-route flow: adoption-status dogs feed the homepage featured selection, `/adoptar/`, and `/adoptar/<slug>/`; success-status dogs feed the homepage preview, `/casos-de-exito/`, and selected stories on `/por-que-galgos/`; supporters feed `/colaboradores/`; blog feeds `/blog/`, `/blog/<id>/`, and the RSS feed.

## Layout hierarchy

- `src/layouts/BaseLayout.astro` — the document shell: global styles, SEO graph metadata, `<Font>` preloads, the GTM `<noscript>` fallback, the server-rendered `CookieBanner`, the default `<slot />`, and the client bootstrap scripts.
- `src/layouts/PageLayout.astro` — wraps `BaseLayout` with `Navbar`, `<main id="main-content">` (id overridable via `mainId`), and `Footer`, plus an `afterShell` named slot rendered after the shell for page-level UI that must live outside `<main>` (e.g. `SharedGalleryLightbox`). Ordinary pages should use `PageLayout` rather than repeating the navbar/footer wiring.

## Navigation and external URLs

`src/config/site.ts` is the single source of navigation: `NAV_ENTRIES` holds one entry per href/label, and `NAVBAR_LINKS`, `NAVBAR_DESKTOP_LINKS`, `NAVBAR_INFORMATION_LINKS`, and `FOOTER_LINKS` are independently ordered lists of references into it. Edit a label or URL once in `NAV_ENTRIES`; never inside `Navbar.astro` or `Footer.astro`.

External organizational URLs — `adoptionForm`, `fosterForm`, `whatsapp`, `instagram`, `facebook`, `esponsor`, the `web3forms` endpoint/key — live in `SITE`. Components read them from there rather than hardcoding.

## Styling

The styling layer is `src/styles/tokens.css` (design tokens), `src/styles/global.css`, and modular per-component files under `src/styles/components/`. Tailwind was removed from the project and must not be reintroduced; extend the existing modular CSS instead of adding a second styling system. The hierarchy-weight vocabulary (`.section--lead` / `.section--support` / `.section--quiet`, heading/eyebrow/card/action weights) is documented in `DESIGN.md`.

## Image pipeline

Dog photography lives in `src/assets/casos/<slug>/` (flat per-slug directories) and is processed by `astro:assets`/Sharp into responsive AVIF/WebP variants; `image.responsiveStyles: true` is enabled so constrained/constrained-layout images get their styles generated. Dog galleries are capped at 3 images in both the collection schema and the UI helpers. Responsive srcsets for gallery surfaces are built by `src/utils/responsive-gallery-images.ts`. UI icons live in `src/assets/icons/` and are imported as inline SVG components, optimized at build by `experimental.svgOptimizer` (svgo `preset-default` + `removeXMLNS`); they are never rendered as `<img>` or placed under the public directory.

## Font pipeline

Fonts use the Astro Fonts API in `astro.config.mjs` with the `fontProviders.fontsource()` provider: Barlow 400 (`--font-body`, body) and Barlow Condensed 700/900 (`--font-display`, display), latin subset, with declared fallback stacks. `BaseLayout.astro` renders `<Font cssVariable="--font-body" preload />` and `<Font cssVariable="--font-display" preload />` in `<head>`, which emits the `@font-face` rules and preload links. There are no manual woff2 preloads and no `@fontsource` CSS imports; font files are self-hosted in the build output.

## Environment variables

Three variables are typed through the `env.schema` in `astro.config.mjs` (`astro:env`) and documented in `.env.example`: `PUBLIC_GTM_ID` and `PUBLIC_WEB3FORMS_KEY` (client, public, optional overrides for the defaults in `SITE`), and `ENABLE_INDEXNOW` (server, boolean, default `false`).

`astro.config.mjs` itself cannot use `astro:env` — Astro evaluates the config before the virtual module exists — so it reads `ENABLE_INDEXNOW` with Vite's `loadEnv` (the Astro-documented pattern for config files) and gates on `ENABLE_INDEXNOW === "true"`. The schema default and the `loadEnv` gate stay in sync by convention.

## The seoGraph integration

`@jdevalk/astro-seo-graph` runs with all validators enabled: `validateH1`, `validateUniqueMetadata`, `validateImageAlt`, `validateMetadataLength`, and `validateInternalLinks` with a skip list for `/api/`, `/feed.xml`, `/sitemap.xml`, `/schemamap.xml`, and `/schema/` (endpoint URLs that are not navigable pages).

Two options are deliberately constrained:

- `markdownAlternate: false` — a removed blog `.md` alternate endpoint was a build breaker on Astro 7. Do not recreate markdown-alternate blog routes.
- `indexNow` — configured only when `ENABLE_INDEXNOW === "true"`, using `INDEXNOW_KEY` and the site host from `SITE.siteUrl`. It is gated because pinging IndexNow is an outward-facing side effect that should not happen from casual builds.

`@astrojs/sitemap` generates the sitemap with a filter that excludes `*.json` pages.

## Client scripts

Server-rendered is the default; client JS is progressive enhancement only. The sanctioned set is the nine scripts in `src/scripts/`: `analytics-events.ts`, `cookie-consent.ts`, `copy-data.ts`, `filter-chips.ts`, `form.ts`, `gallery-lightbox.ts`, `navbar.ts`, `share-dog.ts`, and `theme.ts`. New interactions should stay server-rendered where possible rather than adding to this set ad hoc.

## Analytics mechanism

Analytics is delivered through a single GTM container (default `GTM-M2RN5B38` in `SITE.gtmContainerId`, overridable via `PUBLIC_GTM_ID`) that loads GA4; there is no standalone `gtag.js`. `src/scripts/cookie-consent.ts` owns the lifecycle: GTM is not injected until the user accepts, consent state is stored in a first-party `document.cookie` (`SITE.consentCookie`, `SameSite=Lax`) — never `localStorage` — and rejection clears known GA/GTM cookies. Events reach the `dataLayer` through `data-track-*` attributes and the `brigada:analytics` custom event (helpers in `src/utils/analytics.ts`). The consent contract and event taxonomy are requirements; they live in `docs/quality.md`.
