---
name: builder-profile
description: Unified builder profile for the Brigada Galgos website. Captures the builder’s identity, project goals, constraints, and working mode for the Vibe Cartographer workflow.
metadata:
  type: project
  created: 2026-07-05
  builder: Fabián Núñez
  persona: designer-developer
  mode: craftsman
---

# Builder Profile — Brigada Galgos

## 1. Builder Identity

- **Name:** Fabián Núñez
- **Role:** Designer-developer, solo maintainer of the site.
- **Team size:** Solo builder, with the possibility of occasional contributors.
- **Communication:** English with me; Spanish copy is used only for site content.

## 2. Project in One Sentence

> A fast, accessible, and emotionally clear website that helps Brigada Galgos find adopters, foster homes, and donors for rescued greyhounds in Chile.

## 3. Audience & Users

- **Primary:** Potential adopters, temporary foster homes, and donors in Chile.
- **Secondary:** Volunteers, supporters, and anyone curious about the organization.

## 4. Core Problem & Value

- **Problem:** The organization needs to show dogs in adoption, share success stories, explain the adoption process, and collect support — all without a dedicated engineering team.
- **Value:** A low-maintenance, content-driven site that turns visitors into adopters, foster homes, and donors through clear copy and trustworthy design.

## 5. Tech Stack & Hosting

- **Framework:** Astro 7, static output only.
- **Hosting:** Cloudflare Pages from GitHub.
- **Languages:** TypeScript, Astro, Markdown, CSS.
- **Styling:** Modular CSS (`src/styles/`) with incremental Tailwind adoption.
- **Images:** Astro assets with responsive AVIF/WebP generation.
- **Package manager:** npm with committed `package-lock.json`.
- **Runtime:** Node 22+ via `.nvmrc`.
- **Analytics:** GTM-delivered GA4 after consent, plus Cloudflare Web Analytics.
- **SEO:** `@astrojs/sitemap` and `@jdevalk/astro-seo-graph`.
- **Feed:** RSS at `src/pages/feed.xml.ts` from the `blog` collection.
- **Tests:** Vitest for unit tests, Playwright for browser and build-output checks.

## 6. Constraints & Non-Negotiables

- Node 22+ and npm; committed lockfile.
- Static build only; no server-side runtime.
- Accessibility and semantic correctness are mandatory.
- Lighthouse 100 target for checked pages.
- Strict CSP, HTTPS-only, modern security headers.
- Chilean Spanish voice and tone; correct spelling, accents, and tuteo.
- Content collection rules:
  - Dog gallery max 3 images.
  - Success stories max 260 characters.
  - Hidden dogs expire after 90 days.
  - Confirmed facts only; no invented stats or quotes.
- No standalone `gtag.js`; GTM only after consent.
- No markdown-alternate blog routes unless the requirement changes.
- Prefer server-rendered Astro; avoid ad hoc client JS.

## 7. Success / Definition of Done

- `npm run format:check` passes.
- `npm run lint` passes (ESLint, Stylelint, text-quality checks).
- `npm run build` passes.
- `npm test` passes (Vitest + Playwright).
- Lighthouse 100 maintained for checked pages when relevant.
- Copy respects the voice and tone guide.
- No accessibility or semantic regressions.

## 8. Working Cadence & Communication Style

- Prefer concise, well-scoped work with clear rationale.
- Iterate toward polished output rather than shipping rough drafts.
- Use English for all discussion; Spanish only for site copy.
- Rely on existing docs and agent guidance; update them when workflows change.

## 9. Quality & Risk Tolerance

- **Quality bar:** High. Accessibility, performance, content hygiene, and design craft matter.
- **Risk tolerance:** Low. Prefer incremental, well-tested changes over sweeping rewrites.
- **Attitude:** Preserve what works; improve only when the improvement is clearly better and safe.

## 10. Existing Assets

- `docs/site-brief.md` — product-intent reference for scope decisions.
- `docs/prd.md` — functional requirements document.
- `docs/spec.md` — technical architecture and data-flow specification.
- `docs/feature-inventory.md` — list of pages, sections, and capabilities.
- `docs/content-model.md` — content schemas, editorial rules, and workflows.
- `docs/architecture-map.md` — component and content flow map.
- `docs/voice-and-tone.md` — copy and brand voice rules.
- `docs/developer-reference.md` — technical architecture, content model, analytics, and tests.
- `docs/deep-research.md` — background research material.
- `astro.config.mjs`, `src/content.config.ts`, `src/layouts/`, `src/components/`, `src/content/`, `src/utils/`, `src/styles/`, `tests/` — core codebase.

## 11. Handoff & Maintenance

- Solo maintainer for now; occasional contributors may appear.
- Documentation should be clear enough for a contributor to follow the content model, tests, and deployment flow without direct guidance.
- Operational source for agents is `AGENTS.md`; human overview is `README.md`; this profile is the builder context for Vibe Cartographer workflows.

## Working Mode

- **Persona:** Designer-developer.
- **Mode:** Craftsman — prioritize polish, clarity, and maintainability over speed.
