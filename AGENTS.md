# Agent Guidance

This repository is the public Astro site for **Brigada Galgos Chile**. It is a static site deployed to Cloudflare Pages from GitHub, written primarily in Astro, TypeScript, CSS, and Markdown content collections.

The repo mixes product code, structured content, image assets, SEO/analytics rules, and a fairly strict test suite. Treat it as a content-driven site with strong editorial, accessibility, and source-hygiene constraints.

## Primary Goal

- Keep the site correct, fast, accessible, and maintainable.
- Preserve the organization voice in Chilean Spanish.
- Respect the content model for dogs, supporters, and story cards.
- Keep verification green: formatting, linting, build, unit tests, browser tests, and Lighthouse when relevant.

## Required Opening Moves

- Use Astro Docs MCP for Astro framework questions, integrations, routing, content collections, image handling, and current best practices.
- Verify current Astro APIs before changing areas that drift across versions: content collections, image handling, integrations, adapters, actions, and view transitions.
- Use jCodeMunch for code navigation when the repo is indexed. Prefer indexed discovery, outlines, symbol lookups, references, and blast-radius checks over blind searching.
- If the repo is not indexed, index it before broad code navigation work.
- Start every code session with:
  1. `resolve_repo { "path": "." }`
  2. `plan_turn { "repo": "...", "query": "your task", "model": "<your-model-id>" }`
- If the repo is unfamiliar, use `suggest_queries` after `resolve_repo`.

## Project Snapshot

- Framework: Astro 7, static output only.
- Hosting: Cloudflare Pages.
- Package manager: npm with committed `package-lock.json`.
- Runtime: Node 22+ via `.nvmrc`.
- Images: Astro assets with responsive AVIF/WebP generation.
- Styling: site CSS remains the main styling layer. Tailwind has been removed from the project and should not be reintroduced casually.
- Analytics: GTM-delivered GA4 only after consent, plus Cloudflare Web Analytics.
- SEO: `@astrojs/sitemap` and `@jdevalk/astro-seo-graph`.
- Feed: RSS is generated at `src/pages/feed.xml.ts` from the `blog` collection.
- Tests: Vitest for source/unit tests, Playwright for browser, regression, and build-output checks.

## Repo Layout

- `src/pages/`: public routes.
- `src/layouts/`: page shells and document-level layout code.
- `src/components/`: shared UI components.
- `src/components/sections/`: page-specific section components.
- `src/content/`: Markdown content collections.
  - `adoption-dogs/`
  - `success-dogs/`
  - `supporters/`
  - `blog/`
- `src/utils/`: content shaping, analytics helpers, schema builders, image helpers.
- `src/scripts/`: client scripts such as consent, analytics, navbar, theme, and filters.
- `src/styles/`: design tokens and modular CSS.
- `src/assets/`: imported images that Astro processes.
- `public/`: static assets, headers, redirects, icons, and manifest-adjacent files.
- `scripts/`: maintenance scripts for dog data, text quality, Playwright server bootstrapping, and related workflows.
- `tests/`: Vitest and Playwright coverage, including source hygiene, accessibility, smoke, content, consent, and capture suites.
- `docs/`: voice, site brief, PRD, technical spec, feature inventory, content model, architecture map, and reference material.

## Architecture Essentials

### Layouts and page shells

- `src/layouts/BaseLayout.astro` owns the document shell: global styles, SEO graph, canonical metadata, GTM noscript fallback, cookie banner, and client bootstrap scripts.
- `src/layouts/PageLayout.astro` is the standard shell for most top-level pages. It wraps `BaseLayout` with `Navbar`, `main`, and `Footer`.
- Prefer `PageLayout` for regular site pages instead of repeating `Navbar` and `Footer`.
- Use the `afterShell` slot in `PageLayout` for page-level UI that must render outside `<main>`, such as `SharedGalleryLightbox`.

### Links and outbound tracking

- Reuse link helpers instead of hand-rolling outbound-link behavior:
  - `src/components/TrackedLink.astro`
  - `src/components/ExternalLink.astro`
  - `src/components/WhatsAppLink.astro`
  - `src/components/InstagramLink.astro`
- `TrackedLink` is the shared primitive for outbound analytics metadata and optional new-tab handling.
- `ExternalLink` is for simple external links that should open in a new tab without analytics metadata.
- Keep new-tab semantics and external indicators consistent. Do not duplicate `target`, `rel`, or tracking attributes inline unless there is a clear exception.

### Styling strategy

- The site is still primarily styled with `src/styles/global.css` plus modular CSS files in `src/styles/components/`.
- Tailwind is no longer part of this project.
- Prefer existing patterns in the surrounding code and keep styling changes within the established CSS architecture instead of introducing a second styling system.
- Preserve the current visual language and avoid “one-off” utility-heavy rewrites when editing established components.

### Content-driven behavior

- Dog cards and galleries are shaped through `src/utils/dog-content.ts`.
- Success-story card summaries are derived through `src/utils/story-card-copy.ts`.
- FAQ and structured-data copy are centralized in config and utility files. Prefer updating shared sources over duplicating text inside pages.
- The blog collection powers the RSS feed. There is no markdown-alternate endpoint for blog posts right now.

## Non-Negotiable Standards

- Never use absolute filesystem paths in repo files or docs. Use repo-relative paths.
- Preserve UTF-8 everywhere. Never introduce mojibake, replacement characters, or broken accents.
- Prefer small, named, typed helpers over duplicated inline logic.
- Do not hand-edit dependency versions into `package.json`; use npm commands when dependencies change.
- Do not delete framework entrypoints because a generic dead-code tool labels them unused.
- Avoid ad hoc client JS. If an interaction can stay server-rendered, keep it server-rendered.

## Content and Voice

- Follow `docs/site-brief.md` for audience and language defaults.
- Follow `docs/voice-and-tone.md` for site voice. This is the source of truth for rhythm, phrasing, tone, and CTA style.
- Spanish copy must use correct Chilean Spanish spelling, accents, punctuation, and natural phrasing.
- Avoid generic NGO copy. Keep writing specific, humane, and grounded.
- Keep repetition under control. If a wording update is requested across the site, vary nearby phrasing where needed so the copy still sounds natural.

## Content Collections

### Adoption Dogs

Defined in `src/content.config.ts`.

Required frontmatter fields:

- `name`
- `sex`
- `age`
- `weight`
- `details`
- `currentNeed`
- `characterSketch`
- `gallery`

Optional fields:

- `location`
- `instagramUrl`
- `order`
- `active`
- `hiddenSince`
- `hiddenReason`

Rules:

- `gallery` accepts at most 3 images.
- If `active: false`, both `hiddenSince` and `hiddenReason` are required.
- Hidden dogs expire after 90 days; `tests/source-hygiene.test.ts` enforces this.

### Success Dogs

Defined in `src/content.config.ts`.

Required frontmatter fields:

- `name`
- `story`
- `gallery`

Optional fields:

- `instagramUrl`

Rules:

- `gallery` accepts at most 3 images.
- Every success-dog `story` must be **260 characters or fewer**.
- Every success-dog `story` must explicitly mention the adoption outcome. `tests/source-hygiene.test.ts` enforces this with `/adopt/i`.
- Keep stories general enough to avoid inventing facts, but specific enough not to sound templated.
- Card summaries are derived from `story` through `src/utils/story-card-copy.ts`. The helper default is also 260 characters and should stay aligned with the content rule unless the product requirement changes.
- `tests/stories-section.spec.ts` also guards the summary limit at the UI level.

### Supporters

- Keep logos local.
- Include accessible `logoAlt`.
- Prefer consistent `kind` values already defined in the schema.

## Managing Dog Statuses

### Moving a Dog to Success

When an adopted dog moves from `adoption-dogs` to `success-dogs`:

1. Use `git mv` for the markdown file and asset folder:
   ```bash
   git mv src/content/adoption-dogs/name.md src/content/success-dogs/name.md
   git mv src/assets/casos/adopcion/name src/assets/casos/exito/name
   ```
2. Rewrite the content:
   - Remove adoption-only fields such as `sex`, `age`, `weight`, `details`, `location`, `currentNeed`, `characterSketch`, and `order`.
   - Add a `story` string in the site voice.
   - Keep the `story` at 260 characters or fewer.
   - Mention the adoption outcome explicitly.
   - Keep `gallery` paths pointed to `../../assets/casos/exito/name/...`.
3. Update data prep scripts if needed:
   - Remove the dog ID from `ADOPTION_IDS` and `ADOPTION_OVERRIDES` in `scripts/prepare-casos-site.mjs` when applicable.

### Hiding a Dog Temporarily

To hide a dog from adoption without deleting the record:

```yaml
active: false
hiddenSince: YYYY-MM-DD
hiddenReason: "Hogar temporal planea adoptar (no confirmado)"
```

Rules:

- Hidden entries remain in the collection.
- `tests/source-hygiene.test.ts` fails if tracking metadata is missing.
- Hidden entries older than 90 days also fail the test suite.

## Images and Asset Handling

- Prefer imported images inside `src/assets/` so Astro can optimize them.
- Dog galleries are intentionally capped at 3 images in both schema and UI helpers.
- When normalizing dog image filenames or extensions, use the provided scripts instead of ad hoc renames:
  - `npm run dog-images:check`
  - `npm run dog-images:write`
- Keep file extensions consistent within a dog’s folder. The repo currently normalizes to `.jpg` where applicable.
- Do not add remote image dependencies or CDNs for dog photography.

## SEO, Accessibility, and Performance

- Every indexable page must have a unique title and meta description.
- Keep one meaningful `h1` per page.
- Maintain canonical and social metadata.
- Keep JSON-LD generated from shared builders rather than duplicated literals.
- Preserve accessible image alt text and decorative-image handling.
- Respect heading hierarchy. Lighthouse will catch semantic skips that may still “look fine” visually.
- The site targets 100 in Lighthouse categories for the checked pages; avoid regressions that add unnecessary JS, layout instability, or weak semantics.
- `astro.config.mjs` currently uses `build.inlineStylesheets = "auto"` to avoid over-inlining CSS into HTML. Do not revert that casually.

## Analytics and Consent

- GTM is the only allowed delivery path for GA4.
- Never add standalone `gtag.js`.
- Do not load GTM before consent.
- Push denied consent by default and granted consent after acceptance.
- Rejection should clear known GA/GTM cookies.
- `tests/analytics-consent.spec.ts` and `tests/source-hygiene.test.ts` protect these rules.

## Security and Deployment

- `public/_headers` is required for Cloudflare Pages.
- `public/_redirects` handles URL migration and permanent redirects.
- Keep CSP strict. Document each third-party allowance.
- Maintain HTTPS-only assumptions and modern browser security headers.

## Testing and Verification

Run these before delivery unless the task clearly does not touch the relevant surface:

```bash
npm run format:check
npm run lint
npm run build
npm test
```

For major UX, SEO, or performance changes, also run:

```bash
npm run test:lighthouse
```

Notes:

- `npm run lint` includes ESLint, Stylelint, and text-quality checks.
- `npm test` runs Vitest and Playwright.
- Playwright uses `scripts/run-playwright-server.mjs` to build and start `astro preview` on `127.0.0.1`.
- In CI, `capture.spec.ts` is ignored by Playwright config.
- If a required check is skipped, state that explicitly and explain why.

## Key Files Worth Knowing

- `astro.config.mjs`
  - Static build config, sitemap integration, SEO graph integration, and current Astro build behavior.
  - `indexNow` is intentionally gated behind `ENABLE_INDEXNOW === "true"`.
  - `markdownAlternate` is intentionally disabled.
- `src/layouts/BaseLayout.astro`
  - Document shell, metadata, RSS link, cookie banner, and client bootstrap.
- `src/layouts/PageLayout.astro`
  - Shared page wrapper for `Navbar`, `<main>`, `Footer`, and the optional `afterShell` slot.
- `src/components/TrackedLink.astro`
  - Shared tracked outbound-link primitive.
- `src/components/ExternalLink.astro`
  - Shared simple external-link primitive.
- `src/content.config.ts`
  - Canonical content schemas.
- `src/utils/dog-content.ts`
  - Shapes collection entries for cards and galleries.
- `src/utils/story-card-copy.ts`
  - Builds success-story card excerpts and carries the 260-character default.
- `src/utils/structured-data.ts`
  - Centralized JSON-LD builders, breadcrumbs, and FAQ structured data.
- `tests/source-hygiene.test.ts`
  - Enforces repository invariants that linters do not catch.
- `playwright.config.ts`
  - Browser test orchestration and preview server behavior.

## Known Gotchas

- Do not recreate blog markdown alternate routes unless the product requirement changes. The site keeps `markdownAlternate: false`, and an old `.md` endpoint was intentionally removed because it became a build breaker on Astro 7.
- Reuse `PageLayout` for ordinary pages instead of rebuilding the shell page by page.
- Reuse the shared link components for WhatsApp, Instagram, tracked outbound CTAs, and simple external links.
- When touching FAQ or “why galgos” copy, remember that similar text may also exist in structured data.
- A build can pass while Lighthouse still fails on semantics. If you touch headings, buttons, labels, or link names, run Lighthouse.

## Code Navigation Rules

Always prefer jCodeMunch over raw shell exploration for repo understanding.

Use:

- `search_symbols` for named code entities.
- `search_text` for strings, comments, config values, and frontmatter patterns.
- `get_repo_outline` or `get_file_tree` for structure.
- `get_file_outline` before opening a file.
- `get_symbol_source` and `get_context_bundle` for implementation context.
- `find_references`, `find_importers`, and `get_blast_radius` before changing reused modules.

If `plan_turn` confidence is:

- `high`: follow the recommended files and use minimal supplementary reads.
- `medium`: inspect recommended files, then broaden carefully.
- `low`: report that the feature likely does not exist; do not keep thrashing.

## Editing Behavior

- Respect existing user changes.
- Do not revert unrelated work.
- Keep comments sparse and useful.
- Keep changes small and defensible.
- If PostToolUse hooks are unavailable and cache invalidation matters, register edited paths.

## Documentation Expectations

- `AGENTS.md` is the operational source for agents. Keep it specific and updated when workflows change.
- `README.md` is for humans. Keep it illustrative, clear, and lighter on internal implementation detail.
- `docs/site-brief.md` is the product-intent reference for scope decisions.
- `docs/prd.md` captures the current functional requirements.
- `docs/spec.md` describes architecture, data flow, integrations, and key implementation decisions.
- `docs/feature-inventory.md` lists every page, section, and capability.
- `docs/content-model.md` documents schemas, editorial rules, and content workflows.
- `docs/architecture-map.md` maps component and content flow.
- `docs/developer-reference.md` contains the detailed content model, image sizes, analytics events, and SEO/structured-data notes.
- `docs/voice-and-tone.md` is the source of truth for site copy.
