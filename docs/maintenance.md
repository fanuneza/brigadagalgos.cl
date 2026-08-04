# Maintenance

How to change things on the site. For how things work, see `docs/architecture.md`; for what must hold, see `docs/quality.md`. `src/content.config.ts` is the canonical schema; this file only describes the procedures around it.

## Add a dog

1. Create `src/content/dogs/<slug>.md` with `status: "adopcion"`.
2. Add 1–3 images to `src/assets/casos/<slug>/` (see "Add or replace dog images").
3. Fill the required frontmatter: `name`, `sex` (`Macho` or `Hembra`), `age`, `weight`, `details`, `characterSketch`, and `gallery`. `currentNeed` defaults to `"Adopción"`; set it to `"Hogar temporal"` or `"Adopción u hogar temporal"` when that is the actual need.
4. Add `adoptionFacts.compatibility` with all four keys — `children`, `cats`, `femaleDogs`, `maleDogs` — each set to `sí`, `no`, `caso a caso`, or `sin información confirmada`. `tests/source-hygiene.test.ts` fails the build when an active adoption dog is missing any of them.
5. Prove it:

```bash
npm run test:source
```

## Move a dog to success

The markdown file and `src/assets/casos/<slug>/` do not move; only the frontmatter changes.

1. Edit `src/content/dogs/<slug>.md`:
   - Change `status` to `"exito"`.
   - Add `story`: at most 260 characters and explicitly mentioning the adoption outcome (enforced with `/adopt/i`).
   - Drop the adoption-only fields: `sex`, `age`, `weight`, `details`, `location`, `adoptionFacts`, `currentNeed`, `characterSketch`, `order`, `active`, `hiddenSince`, `hiddenReason`.
   - Keep `name`, `instagramUrl`, and `gallery` unchanged.
2. Add a permanent redirect for the retired profile URL to `public/_redirects`:

   ```
   /adoptar/<slug>/ /casos-de-exito/ 301
   ```

   Profile URLs are shared on social media and must not 404 after the dog is adopted.

3. Prove it (`tests/source-hygiene.test.ts` derives retired slugs from git history and checks story length, adoption mention, and redirect coverage):

```bash
npm run test:source
```

## Hide a dog temporarily

Applies only to dogs with `status: "adopcion"`.

1. Set the frontmatter in `src/content/dogs/<slug>.md`:

   ```yaml
   active: false
   hiddenSince: 2026-01-15
   hiddenReason: "Hogar temporal planea adoptar (no confirmado)"
   ```

   The schema itself rejects `active: false` without `hiddenSince` and `hiddenReason`.

2. A hidden dog stays in the collection but loses its `/adoptar/<slug>/` page, so add the same `/adoptar/<slug>/ /casos-de-exito/ 301` entry to `public/_redirects` for the duration of the hide — and remove it once the dog is active again (the suite fails when an active profile is redirected).
3. Hidden entries older than 90 days fail the suite; reactivate or move the dog to success before that.
4. Prove it:

```bash
npm run test:source
```

## Add a supporter

1. Put the logo file in `src/assets/images/supporters/` (the only supporter-logo directory).
2. Create `src/content/supporters/<slug>.md` with the required fields per `src/content.config.ts`: `name`, `description`, `website`, `kind` (one of `Institución`, `Empresa`, `Persona`, `Fundación`, `Colectivo`, `Veterinaria`), `logo`, and `logoAlt`. Optional: `thanksLabel`, `thanksUrl`, `order`.
3. Prove it (the build validates the schema and resolves the logo image):

```bash
npm run build
```

## Add a blog post

1. Create `src/content/blog/<slug>.md` with the required frontmatter: `title`, `pubDate`, `author`, `description`. Optional: `category`, `heroImage` (from `src/assets/blog/<slug>/`), `heroImageAlt`.
2. Start body headings at `##` — the post page renders the only `h1` from `title`.
3. Set `draft: true` to keep the post out of `/blog/`, `/blog/<id>/`, and `/feed.xml` until it is ready.
4. Prove it (validates frontmatter and regenerates the listing and feed):

```bash
npm run build
```

## Add or replace dog images

1. Dog images live in `src/assets/casos/<slug>/` — one flat directory per slug, no `adopcion/` or `exito/` split. Nothing moves when a dog changes status.
2. Keep file extensions consistent within a dog's folder; the repo normalizes to `.jpg` where applicable.
3. Never rename files ad hoc. Run the normalizer, then fix the `gallery` paths in the dog's markdown to match:

```bash
npm run dog-images:write
```

4. Galleries are capped at 3 images by both the schema and the UI helpers.
5. Prove it:

```bash
npm run dog-images:check
```

## Add a page

1. Create `src/pages/<name>.astro` wrapped in `src/layouts/PageLayout.astro` (it provides `Navbar`, `<main>`, and `Footer`); use the `afterShell` slot for UI that must render outside `<main>`.
2. Give the page exactly one meaningful `h1` and a unique title and meta description — the seo-graph integration validates all three at build time.
3. Add navigation labels and URLs only in `src/config/site.ts` (`NAV_ENTRIES`; `NAVBAR_LINKS` and `FOOTER_LINKS` derive from it). Never edit menus inside `Navbar.astro` or `Footer.astro`.
4. Prove it:

```bash
npm run build
```

## Change published copy

1. Follow `docs/voice-and-tone.md`; the "encajar" rule, voseo, and mojibake are enforced mechanically.
2. FAQ copy is centralized in `src/config/faq.ts`, which feeds both the visible `FaqSection` and the FAQ JSON-LD built in `src/utils/structured-data.ts` — edit it there, not in the page. Similar wording (for example "por qué galgos" copy) can also live in the structured-data builders, so grep for the phrase across `src/` before considering the change done.
3. Prove it:

```bash
npm run test:text
```

## Deploy

1. Push to `main`. Cloudflare Pages builds the static output and applies `public/_headers` and `public/_redirects`.
2. The GitHub workflows then cover:
   - `ci.yml` — on push/PR to `main`: `format:check`, `lint`, `build`, `npm test`, with `fetch-depth: 0` because the redirect-coverage test derives retired slugs from git history.
   - `deploy-smoke.yml` — after a successful deployment, runs `npm test` against the deployed URL.
   - `lychee.yml` — link checker on push/PR and a weekly cron; builds the site, then runs lychee.
3. Ship it:

```bash
git push origin main
```

## Run the checks

| Step          | Command                   | What it proves                                                                                  |
| ------------- | ------------------------- | ----------------------------------------------------------------------------------------------- |
| Format        | `npm run format:check`    | Prettier-clean formatting across the repo, including Markdown tables                            |
| Lint          | `npm run lint`            | Chains ESLint + Stylelint + `npm run test:text` + `npm run dog-images:check`                    |
| Build         | `npm run build`           | `astro check` types, content-schema validation, seo-graph checks, and a successful static build |
| Test          | `npm test`                | Vitest (including the source-hygiene invariants) plus Playwright against `astro preview`        |
| Lighthouse    | `npm run test:lighthouse` | Budgets in `.lighthouserc.cjs`; run for major UX, SEO, or performance changes only              |
| Visual parity | `npm run capture:local`   | Screenshots from `capture/` on demand; never part of `npm test`, locally or in CI               |

## Read a failure

| Symptom                                                                          | Owning check                                                             |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Missing redirect for a retired or hidden profile (or an active one redirected)   | `tests/source-hygiene.test.ts` — fix `public/_redirects`                 |
| Hidden dog without `hiddenSince`/`hiddenReason`, or hidden over 90 days          | `tests/source-hygiene.test.ts`                                           |
| Success story over 260 characters or not mentioning the adoption                 | `tests/source-hygiene.test.ts`                                           |
| Active adoption dog missing `adoptionFacts.compatibility` entries                | `tests/source-hygiene.test.ts`                                           |
| Dog image naming or extension mismatch                                           | `scripts/normalize-dog-images.mjs` — fix with `npm run dog-images:write` |
| "encajar", voseo, or mojibake in site copy                                       | `scripts/check-text-quality.mjs` (`npm run test:text`)                   |
| CSP regression in `public/_headers`                                              | `tests/source-hygiene.test.ts`                                           |
| Absolute filesystem path in `src/`, `public/`, `scripts/`, `tests/`, root `*.md` | `tests/source-hygiene.test.ts`                                           |
| Prettier wants to reformat (for example table alignment)                         | `npm run format`                                                         |
