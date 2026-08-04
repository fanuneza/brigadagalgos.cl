# Agent Guidance

This repository is the public Astro 7 static site for **Brigada Galgos Chile**, deployed to Cloudflare Pages from GitHub. It is a content-driven site (Astro, TypeScript, CSS, Markdown content collections) with strict editorial, accessibility, and source-hygiene constraints.

The organizing rule: **every rule has exactly one owner document; change a rule only in its owner.** Read only the owners relevant to the task.

## Documentation ownership

| Domain                                                                        | Owner                    |
| ----------------------------------------------------------------------------- | ------------------------ |
| Purpose, stack, setup, commands, repo map, env vars, deploy, doc index        | `README.md`              |
| Recipes and agent invariants                                                  | `AGENTS.md` (this file)  |
| Audience, purpose, conversion flows, key flows, success metrics, out-of-scope | `PRODUCT.md`             |
| Visual system: tokens, hierarchy weights, components                          | `DESIGN.md`              |
| **Mechanism** — how the site is built                                         | `docs/architecture.md`   |
| **Requirements** — what must be true                                          | `docs/quality.md`        |
| **Procedures** — how to change things                                         | `docs/maintenance.md`    |
| Collection schemas, field tables, authoring rules                             | `docs/content-model.md`  |
| Copy voice, banned words, per-page patterns                                   | `docs/voice-and-tone.md` |
| Spanish domain terms → meaning → code location                                | `docs/glossary.md`       |
| Command authority (the scripts)                                               | `package.json`           |
| Redirect authority                                                            | `public/_redirects`      |

## Recipes

Each recipe is the short version: the goal, the key steps, and the command that proves it. The full procedure lives in `docs/maintenance.md`.

### Add a dog

Create `src/content/dogs/<slug>.md` with `status: "adopcion"` and 1–3 images in `src/assets/casos/<slug>/`. Fill the required frontmatter (`name`, `sex`, `age`, `weight`, `details`, `characterSketch`, `gallery`) and set `adoptionFacts.compatibility` with all four keys — the build fails without them.

```bash
npm run test:source
```

Full procedure: [Add a dog](docs/maintenance.md#add-a-dog).

### Move a dog to success

The markdown file and its `src/assets/casos/<slug>/` assets never move. In `src/content/dogs/<slug>.md`, change `status` to `"exito"`, drop the adoption-only fields, and add a `story` (≤260 characters, must mention the adoption outcome). Add `/adoptar/<slug>/ /casos-de-exito/ 301` to `public/_redirects` — retired profile URLs must not 404.

```bash
npm run test:source
```

Full procedure: [Move a dog to success](docs/maintenance.md#move-a-dog-to-success).

### Hide a dog temporarily

For `status: "adopcion"` only: set `active: false` plus `hiddenSince` and `hiddenReason` in the dog's frontmatter (the schema rejects `active: false` without them). Add the `/adoptar/<slug>/` redirect to `public/_redirects` for the duration of the hide and remove it on reactivation. Hides older than 90 days fail the suite.

```bash
npm run test:source
```

Full procedure: [Hide a dog temporarily](docs/maintenance.md#hide-a-dog-temporarily).

### Add a supporter

Put the logo in `src/assets/images/supporters/`, then create `src/content/supporters/<slug>.md` with the required fields (`name`, `description`, `website`, `kind`, `logo`, `logoAlt`) per `src/content.config.ts`.

```bash
npm run build
```

Full procedure: [Add a supporter](docs/maintenance.md#add-a-supporter).

### Add a blog post

Create `src/content/blog/<slug>.md` with `title`, `pubDate`, `author`, `description`; optional hero image from `src/assets/blog/<slug>/`. Start body headings at `##` — the page renders the only `h1` from `title`. Set `draft: true` to keep the post out of `/blog/` and the RSS feed until ready.

```bash
npm run build
```

Full procedure: [Add a blog post](docs/maintenance.md#add-a-blog-post).

### Add or replace dog images

Dog images live in `src/assets/casos/<slug>/` — one flat directory per slug, no status split. Never rename files ad hoc: run the normalizer, then fix the `gallery` paths in the dog's markdown to match. Galleries are capped at 3 images.

```bash
npm run dog-images:write && npm run dog-images:check
```

Full procedure: [Add or replace dog images](docs/maintenance.md#add-or-replace-dog-images).

### Add a page

Create `src/pages/<name>.astro` wrapped in `src/layouts/PageLayout.astro` (it provides `Navbar`, `<main>`, `Footer`). Give the page exactly one meaningful `h1` and a unique title and meta description — the seo-graph integration validates all three at build time. Add nav labels and URLs only in `src/config/site.ts`.

```bash
npm run build
```

Full procedure: [Add a page](docs/maintenance.md#add-a-page).

### Change published copy

Follow `docs/voice-and-tone.md`. FAQ copy lives in `src/config/faq.ts` and feeds both the visible section and the JSON-LD in `src/utils/structured-data.ts` — grep for the phrase across `src/` before calling the change done.

```bash
npm run test:text
```

Full procedure: [Change published copy](docs/maintenance.md#change-published-copy).

## Invariants agents violate without a second read

- No absolute filesystem paths in `src/`, `public/`, `scripts/`, `tests/`, or root-level Markdown — repo-relative paths only. Enforced by `tests/source-hygiene.test.ts`.
- Preserve UTF-8; never introduce mojibake, replacement characters, or broken accents (`npm run test:text` checks).
- No Tailwind — it was removed; extend the modular CSS in `src/styles/` (`docs/architecture.md`, `DESIGN.md`).
- Never hand-edit dependency versions into `package.json`; use npm commands.
- Do not delete framework entrypoints because a dead-code tool flags them as unused.
- Server-rendered by default; no ad hoc client JS beyond the sanctioned set in `src/scripts/` (`docs/architecture.md`).
- GTM is the only analytics path, never loaded before consent; no standalone `gtag.js` (`docs/quality.md`).
- Dog galleries are capped at 3 images — schema and UI helpers (`docs/content-model.md`).
- No remote image CDNs for dog photography; images live in `src/assets/casos/<slug>/`.
- Supporter logos go in `src/assets/images/supporters/` — there is no separate colaboradores asset directory.
- Nav labels and URLs are edited only in `src/config/site.ts` (`NAV_ENTRIES`), never in `Navbar.astro` or `Footer.astro`.
- External organizational URLs (forms, social, donation platforms) live in `SITE` in `src/config/site.ts`; do not hardcode them in components.
- FAQ and "por qué galgos" copy is duplicated into structured data (`src/config/faq.ts`, `src/utils/structured-data.ts`) — update all copies, not just the visible one.
- A build can pass while Lighthouse still fails on semantics. Touching headings, buttons, labels, or link names means running `npm run test:lighthouse` (budgets in `.lighthouserc.cjs`; re-run once before treating a failure as real).

## Documentation updates

- Git history is the archive: no historical narrative, no stage/wave/task numbering in docs.
- Do not hardcode counts the build derives (route counts, test counts, asset counts).
- When you change a rule, change it in its owner document only (see the ownership table).
