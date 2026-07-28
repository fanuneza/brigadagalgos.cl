# Agent Guidance

This repository is the public Astro site for **Brigada Galgos Chile**. It is a static site deployed to Cloudflare Pages from GitHub, written primarily in Astro, TypeScript, CSS, and Markdown content collections.

The repo mixes product code, structured content, image assets, SEO/analytics rules, and a fairly strict test suite. Treat it as a content-driven site with strong editorial, accessibility, and source-hygiene constraints.

## Primary Goal

- Keep the site correct, fast, accessible, and maintainable.
- Preserve the organization voice in Chilean Spanish.
- Respect the content model for dogs, supporters, and story cards.
- Keep verification green: formatting, linting, build, unit tests, browser tests, and Lighthouse when relevant.

## Working with Astro

- Use Astro Docs MCP for Astro framework questions, integrations, routing, content collections, image handling, and current best practices.
- Verify current Astro APIs before changing areas that drift across versions: content collections, image handling, integrations, adapters, actions, and view transitions.

## Codex model routing

- Default: the root Terra agent handles ordinary work. Do not spawn subagents for simple, clear, single-file, or mechanical tasks. The parent Terra agent owns the final decision and the final user-facing answer.
- `luna_heartbeat`: cheap read-only checks (repo status, file or dependency presence, small-file summaries, simple classification, yes/no routing, change detection).
- `terra_worker`: bounded implementation (clear small features, straightforward bug fixes, small refactors, tests, documentation tied to code changes).
- `sol_escalation`: hard reasoning only (architecture decisions, complex debugging, security- or performance-sensitive review, risky multi-file refactors, unclear failures, final review before risky implementation).
- `sol_max_review`: only when explicitly requested or when `sol_escalation` was insufficient.
- Cost discipline: prefer no subagent, then Luna, then Terra, then Sol. Never spawn several tiers together unless the task explicitly benefits from parallel division. Subagents must return compact summaries, not raw logs, and must not spawn other subagents.

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

For the repo layout and full file tree, see `docs/spec.md`.

## Architecture Essentials

### Homepage and success stories

- The homepage places `FeaturedAdoptionDogs` immediately after the hero divider. It selects active `adoption-dogs` deterministically by `order`, then name.
- `/adoptar/` remains the complete active listing. Do not turn the homepage preview into the full catalogue.
- `success-dogs` powers a three-story homepage preview, the complete `/casos-de-exito/` archive and selected stories on `/por-que-galgos/`.
- The archive is static and server-rendered. Do not restore homepage story pagination, `/casos/exito-home.json`, or `src/scripts/stories-section.ts` without a new product requirement.

### Layouts and page shells

- `src/layouts/BaseLayout.astro` owns the document shell: global styles, SEO graph, canonical metadata, GTM noscript fallback, cookie banner, and client bootstrap scripts.
- `src/layouts/PageLayout.astro` is the standard shell for most top-level pages. It wraps `BaseLayout` with `Navbar`, `main`, and `Footer`.
- Prefer `PageLayout` for regular site pages instead of repeating `Navbar` and `Footer`.
- Use the `afterShell` slot in `PageLayout` for page-level UI that must render outside `<main>`, such as `SharedGalleryLightbox`.

### Links and outbound tracking

- Reuse the link helpers (`src/components/TrackedLink.astro`, `ExternalLink.astro`, `WhatsAppLink.astro`, `InstagramLink.astro`) instead of hand-rolling outbound-link behavior.
- `TrackedLink` is the shared primitive for outbound analytics metadata and optional new-tab handling; `ExternalLink` is for simple external links that open in a new tab without analytics metadata.
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
- The blog collection powers the RSS feed and the `/blog/` listing and `/blog/<id>/` post pages. Posts with `draft: true` are excluded from both the pages and the feed. There is no markdown-alternate endpoint for blog posts right now.

## Non-Negotiable Standards

- Never use absolute filesystem paths in repo files or docs. Use repo-relative paths. Enforced by `tests/source-hygiene.test.ts` for `src/`, `public/`, `scripts/`, `tests/`, and root-level Markdown.
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

The canonical schemas live in `src/content.config.ts`; the editorial rules and field tables live in `docs/content-model.md`. Key rules (gallery caps, story length, hidden-dog metadata and expiry, redirect coverage) are enforced by the schema and `tests/source-hygiene.test.ts` — keep those the source of truth instead of restating them here.

## Managing Dog Statuses

The full editorial workflows, with examples, are in `docs/content-model.md`. The operational essentials:

### Moving a Dog to Success

1. `git mv` the markdown file from `adoption-dogs/` to `success-dogs/` and the asset folder from `src/assets/casos/adopcion/<slug>` to `src/assets/casos/exito/<slug>`.
2. Rewrite the frontmatter: drop the adoption-only fields, add a `story` (≤260 characters, mentions the adoption outcome), and point `gallery` at the new asset path.
3. Add a permanent redirect for the retired profile URL in `public/_redirects`:

   ```
   /adoptar/<slug>/ /casos-de-exito/ 301
   ```

Profile URLs are shared on social media and must not 404 after the dog is adopted. `tests/source-hygiene.test.ts` fails the build when a retired or hidden profile is missing its redirect.

### Hiding a Dog Temporarily

```yaml
active: false
hiddenSince: YYYY-MM-DD
hiddenReason: "Hogar temporal planea adoptar (no confirmado)"
```

- Hidden entries remain in the collection but lose their `/adoptar/<slug>/` page. Add the same `public/_redirects` entry for the duration of the hide, and remove it once the dog is active again.
- Hidden entries older than 90 days fail the test suite.

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

- `npm run lint` includes ESLint, Stylelint, text-quality checks, and `dog-images:check`.
- `npm test` runs Vitest and Playwright.
- Playwright uses `scripts/run-playwright-server.mjs` to build and start `astro preview` on `127.0.0.1`.
- In CI, `capture.spec.ts` is ignored by Playwright config.
- If a required check is skipped, state that explicitly and explain why.

## Key Files Worth Knowing

- `astro.config.mjs` — static build config, sitemap and SEO graph integrations. `indexNow` is intentionally gated behind `ENABLE_INDEXNOW === "true"`; `markdownAlternate` is intentionally disabled.
- `src/layouts/BaseLayout.astro` — document shell, metadata, RSS link, cookie banner, and client bootstrap.
- `src/layouts/PageLayout.astro` — shared page wrapper for `Navbar`, `<main>`, `Footer`, and the optional `afterShell` slot.
- `src/components/TrackedLink.astro` / `ExternalLink.astro` — shared outbound-link primitives.
- `src/content.config.ts` — canonical content schemas.
- `src/utils/dog-content.ts` — shapes collection entries for cards and galleries.
- `src/utils/story-card-copy.ts` — builds success-story card excerpts and carries the 260-character default.
- `src/utils/structured-data.ts` — centralized JSON-LD builders, breadcrumbs, and FAQ structured data.
- `tests/source-hygiene.test.ts` — enforces repository invariants that linters do not catch.
- `playwright.config.ts` — browser test orchestration and preview server behavior.

## Known Gotchas

- Do not recreate blog markdown alternate routes unless the product requirement changes. The site keeps `markdownAlternate: false`, and an old `.md` endpoint was intentionally removed because it became a build breaker on Astro 7.
- Reuse `PageLayout` for ordinary pages instead of rebuilding the shell page by page.
- Reuse the shared link components for WhatsApp, Instagram, tracked outbound CTAs, and simple external links.
- When touching FAQ or “why galgos” copy, remember that similar text may also exist in structured data.
- A build can pass while Lighthouse still fails on semantics. If you touch headings, buttons, labels, or link names, run Lighthouse.

## Editing Behavior

- Respect existing user changes. Do not revert unrelated work.
- Keep comments sparse and useful.
- Keep changes small and defensible.

## Documentation Expectations

- `AGENTS.md` is the operational source for agents. Keep it specific and updated when workflows change.
- `README.md` is for humans. Keep it illustrative, clear, and lighter on internal implementation detail.
- `DESIGN.md` is the visual design system (colors, typography, components). Keep it aligned with `src/styles/tokens.css`.
- `docs/site-brief.md` is the product-intent reference for scope decisions.
- `docs/prd.md` captures the current functional requirements, shared components, and capabilities.
- `docs/spec.md` describes architecture, file tree, data flow, integrations, analytics events, and image variants.
- `docs/content-model.md` documents schemas, editorial rules, and content workflows.
- `docs/voice-and-tone.md` is the source of truth for site copy.
