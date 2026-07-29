# Simplification Plan

Status: implemented (all six stages landed on `main`). Each stage was independently
executable and independently committable.

## Why

The site works and is well tested, but the repo carries more explanation than code:

- ~4,050 lines of prose (AGENTS.md + docs/) describe rules that the zod schema and
  `tests/source-hygiene.test.ts` already enforce — stated in up to 6 places each.
- Dead code ships: a 556-line one-off migration script reading a hardcoded Windows
  path, a JSON-LD builder emitting another project's organization ("Pepito Perez",
  "Compostaje", `knowsAbout: Permacultura`) on every blog page.
- Config contradicts itself: stylelint allowlists Tailwind at-rules although Tailwind
  was removed; `_headers` caches `/casos/*` and allows Google Fonts although neither
  exists; `_redirects` sends four adopted dogs to `/adoptar/` instead of the success
  archive, against the repo's own rule.
- Tests assert the same invariants at up to three layers, hardcode volatile counts
  (29 story cards), and run a 32-screenshot capture suite inside local `npm test`.

## Global invariants (every stage)

- All current routes keep working: `/`, `/adoptar/`, `/adoptar/<slug>/`,
  `/casos-de-exito/`, `/blog/`, `/blog/<id>/`, `/por-que-galgos/`, `/donar/`,
  `/hogar-temporal/`, `/contacto/`, `/colaboradores/`, `/feed.xml`, `/schema/*`, 404. No visible rendering changes (HTML structure, classes, copy, order).
- Content rules unchanged: gallery ≤3, story ≤260 chars mentioning adoption,
  hidden dogs need `hiddenSince`/`hiddenReason` and expire at 90 days.
- Consent, analytics (GTM-only GA4), accessibility, SEO/JSON-LD semantics,
  redirects, performance budgets, and visual identity are preserved byte-for-byte
  in behavior, even when the code producing them moves.
- `npm run format:check && npm run lint && npm run build && npm test` green at
  every commit boundary. `npm run test:lighthouse` when headings, links, buttons,
  labels, or layout shells move (stages 4–5).
- Chilean Spanish copy and `docs/voice-and-tone.md` are untouched by refactors.

## Measurable targets

| Metric                            | Before  | After (goal)              |
| --------------------------------- | ------- | ------------------------- |
| Prose lines (AGENTS.md + docs/)   | ~4,050  | ~1,500                    |
| Files in `docs/`                  | 14      | 6                         |
| `src/utils/` files                | 12      | 9                         |
| `src/components/**` files         | 42      | ~34                       |
| `scripts/` files                  | 4       | 3                         |
| `package.json` scripts            | 24      | ~16                       |
| CSS files                         | 35      | ~29                       |
| Test files                        | 11      | 9                         |
| Sources of truth per content rule | up to 6 | 1 (code/test) + 1 pointer |

Net effect must be fewer files and fewer lines; no stage may add a net new
abstraction. Each stage report includes the before/after file and line counts.

---

## Stage 1 — Delete dead code and fix configuration drift

No behavior changes intended; removes what nothing uses and fixes what contradicts
the repo's own rules.

### Scope

- Delete `scripts/prepare-casos-site.mjs` (556 lines): one-off migration reading a
  hardcoded `C:\Users\...` path, writing to `public/casos/` which no longer exists;
  its `ADOPTION_IDS` list is stale (huayca, foxy are already success dogs). Remove
  the `prepare:casos` npm script and all references (AGENTS.md "Moving a Dog to
  Success" step 3, `docs/content-model.md`, `docs/spec.md`).
- Fix `src/utils/schema.ts`: remove the leftover "Pepito Perez" Person node
  (`url: /nosotros/`, `knowsAbout: [Compostaje, Permacultura, Biología del Suelo]`,
  lines ~56–65) or consolidate with `structured-data.ts` if Stage 5 is pulled
  forward. This is a live content bug on every blog page.
- `public/_redirects`: repoint `/adoptar/baco|barry|arepita|loica/` from
  `/adoptar/` to `/casos-de-exito/ 301` — all four are success dogs; AGENTS.md
  already mandates this destination.
- `public/_headers`: delete the `/casos/*` cache block (directory gone) and the
  `fonts.googleapis.com` / `fonts.gstatic.com` CSP allowances (fonts are
  self-hosted via `@fontsource/*`). Update the duplicated CSP strings inside
  `tests/analytics-consent.spec.ts` in the same commit (see Stage 6 for the real fix).
- `.stylelintrc.json`: remove the Tailwind at-rule allowlist (`theme`, `utility`,
  `apply`, `custom-variant`, …) — Tailwind is gone. Consider dropping to
  `stylelint-config-recommended` plus the few rules actually wanted.
- `astro.config.mjs`: delete the empty `vite: {}` key.
- Git: untrack and gitignore `.impeccable/` (agent tooling, same category as the
  already-ignored `.claude/`); remove the pending `AGENTS.md.bak`; trim the
  ~230-line generic Node `.gitignore` template to what this Astro repo needs.

### Likely files

`scripts/prepare-casos-site.mjs`, `package.json`, `src/utils/schema.ts`,
`public/_redirects`, `public/_headers`, `.stylelintrc.json`, `astro.config.mjs`,
`.gitignore`, `tests/analytics-consent.spec.ts` (CSP string copy only), AGENTS.md
and docs references to the deleted script.

### Non-goals

- No component, layout, or style refactors.
- No test reorganization beyond the forced CSP-string update.
- No docs consolidation (Stage 3) — only delete references to the dead script.

### Validation

```bash
npm run format:check && npm run lint && npm run build && npm test
grep -ri "pepito\|compostaje" dist/   # expect no matches
grep -c "prepare-casos" package.json  # expect 0
```

### Commit boundary

One commit, message scoped as `chore: remove dead code and stale config`. If the
`_redirects` repoint is wanted deployable independently, split it into its own
commit first — it is user-facing (shared profile links).

### Context capsule for a fresh agent

Astro 7 static site, Cloudflare Pages. Ground truth: `src/content.config.ts`
(schemas), `tests/source-hygiene.test.ts` (hygiene rules). The four redirected
dogs exist under `src/content/success-dogs/{baco,barry,arepita,loica}.md`.
`public/casos/` does not exist; images live in `src/assets/casos/`. Verify
`schema.ts` consumers are only `src/pages/blog/[id].astro` and
`src/pages/schema/post.json.ts` before editing; the sibling builder
`src/utils/structured-data.ts` is the correct reference for org metadata.

---

## Stage 2 — Move enforceable prose rules into code and tests

Make the rules self-enforcing so Stage 3 can delete their prose copies without
losing protection.

### Scope

- Add to `tests/source-hygiene.test.ts`:
  - A check that no repo source file contains an absolute filesystem path
    (AGENTS.md, `content-model.md:230`, and `prd.md:307` all claim this test
    exists; it does not).
  - A check that every dog slug absent from active `adoption-dogs` has a
    `/adoptar/<slug>/` entry in `public/_redirects` — enforcing the
    move-to-success / hiding redirect workflow instead of documenting it.
- Add a unit test asserting the story-card excerpt default equals the content
  rule (260 chars) so `story-card-copy.ts` (or its Stage 5 merge target) and the
  schema rule cannot drift apart.
- Wire `npm run dog-images:check` into `npm run lint` (one line) so image naming
  invariants are enforced, not just documented.
- Un-hardcode the "29 story cards" assertion in `tests/stories-section.spec.ts:42`
  — derive the count from the collection or assert `>= 1`.

### Likely files

`tests/source-hygiene.test.ts`, `tests/dog-content.test.ts` (or a new small
vitest file), `tests/stories-section.spec.ts`, `package.json`.

### Non-goals

- No new testing framework, no coverage tooling, no CI workflow changes.
- Do not relax any existing assertion while parametrizing.

### Validation

```bash
npm run lint && npm test
# negative check: temporarily point a redirect wrong / add an absolute path and
# confirm the new tests fail, then revert
```

### Commit boundary

One commit: `test: enforce hygiene rules currently only documented`.

### Context capsule for a fresh agent

Vitest runs `tests/*.test.ts`; Playwright runs `tests/*.spec.ts`
(`playwright.config.ts`). `tests/source-hygiene.test.ts` already reads content
collections and greps `src/` — extend it in that style. Redirects live in
`public/_redirects`, one per line: `/adoptar/<slug>/ /casos-de-exito/ 301`.
Active adoption dogs are those without `active: false` in
`src/content/adoption-dogs/*.md`. The 260-char rule lives in
`src/content.config.ts` consumers and `src/utils/story-card-copy.ts`
(`DEFAULT_MAX_STORY_CARD_CHARACTERS`).

---

## Stage 3 — Consolidate documentation to one source of truth per topic

From ~4,050 prose lines and 15 files (AGENTS.md + docs/) to ~1,500 lines and 7.
Every deleted rule must either be enforced by code/tests (Stages 1–2) or survive
in exactly one doc.

### Scope

- Delete historical docs: `docs/deep-research.md` (600, input to
  voice-and-tone), `docs/scope.md`, `docs/reflection.md`, `docs/checklist.md`
  (finished build plan), `docs/claude-next-steps.md`, `docs/builder-profile.md`
  (duplicates AGENTS.md's snapshot). Harvest the 2–3 still-open items from
  `claude-next-steps.md` into issues or the spec before deleting.
- Merge: `docs/feature-inventory.md` into `docs/prd.md` (~70% overlap);
  `docs/architecture-map.md`'s two unique diagrams into `docs/spec.md`;
  `docs/developer-reference.md`'s analytics event list and image srcset table
  (after correcting them) into `docs/spec.md`. Delete the merged sources.
- Regenerate `docs/spec.md`'s file tree from reality — it currently omits all 24
  `sections/` components, `adoptar/[slug].astro`, blog routes, two test files,
  and lists a nonexistent `shared-gallery.ts`.
- AGENTS.md: 490 → ~200 lines. Keep Architecture Essentials, Non-Negotiable
  Standards, Content/Voice pointers, dog-status workflows, Known Gotchas, Key
  Files, Testing. Delete: content rules now enforced by schema/tests (replace
  with one pointer line), sections duplicating docs, and the ~200 lines of
  generic jcodemunch/MCP routing boilerplate (move to user-level agent config —
  it is not project-specific).
- Remove the "Related documents" trailer from every doc except README and
  site-brief; it is maintained-in-N-places churn.
- Link `DESIGN.md` from AGENTS.md/README — it is current but orphaned.
- Fix the stale claim "no absolute paths is test-enforced" (true after Stage 2).

### Resulting doc set

`README.md` (as-is), `AGENTS.md` (~200), `docs/voice-and-tone.md` (as-is),
`docs/site-brief.md`, `docs/content-model.md` (single editorial/workflows doc),
`docs/prd.md` (absorbs feature-inventory), `docs/spec.md` (absorbs
architecture-map + developer-reference; tree regenerated), `DESIGN.md` (linked).

### Likely files

All of `docs/`, `AGENTS.md`, `README.md`, `DESIGN.md`.

### Non-goals

- No rewriting of voice-and-tone or site-brief content.
- No new documentation; this stage only deletes, merges, and corrects.
- No code changes.

### Validation

```bash
npm run format:check
grep -rn "prepare-casos\|feature-inventory\|architecture-map\|developer-reference\|deep-research\|builder-profile\|claude-next-steps\|checklist.md\|scope.md\|reflection.md" \
  AGENTS.md README.md docs/ --include="*.md"   # expect no dangling references
```

### Commit boundary

Two commits: (1) `docs: delete historical and duplicated documents`, (2)
`docs: slim AGENTS.md to project-specific rules`. Split so a doc-merge mistake
is bisectable.

### Context capsule for a fresh agent

Truth hierarchy after this stage: code and tests enforce rules; `content-model.md`
owns editorial workflows; `spec.md` owns technical description; `prd.md` owns
requirements; `voice-and-tone.md` owns copy style; AGENTS.md owns agent operations
and points at the others. When merging, prefer the doc whose facts match the code
(several specs are stale — verify against `src/` before copying any claim). Keep
all docs in English (developer-reference is Spanish; translate the bits that
survive into spec.md). Never use absolute filesystem paths in docs.

---

## Stage 4 — Consolidate components and layouts

Pure structural moves; rendered HTML must stay identical.

### Scope

- Collapse the four near-identical CTA-tail sections
  (`sections/NextStepCta.astro` 47 LOC / 3 importers, `AdoptionTailCta.astro`,
  `HelpTailCta.astro`, `SupportersCtaSection.astro` — ~170 LOC total) into one
  parameterized `CtaCard` section (eyebrow, heading, body, actions slot).
- Merge `ExternalLink.astro` (22 LOC, 3 importers; lines 9–13 byte-identical to
  `TrackedLink`) into `TrackedLink.astro` with optional tracking props.
- Deduplicate `PageLayout.astro`'s Props interface (verbatim copy of
  BaseLayout's ~20 fields) via `ComponentProps<typeof BaseLayout>`. Do not merge
  the two layouts — the split is fine, the duplicated interface is not.
- Inline the four sub-16-line static single-use sections into their pages:
  `AdoptionIntro.astro`, `SupportersIntro.astro`, `NotFoundLinks.astro`,
  `PressSection.astro`. Fold their CSS into the consuming page's CSS.
- Move the six homepage-only components (`Hero`, `MissionSection`, `HelpCards`,
  `ProcessStepper`, `StoriesSection`, `DonationBanner`) from `src/components/`
  into `src/components/sections/` so one placement rule covers everything.
- Extract a shared `DogCard` from the duplicated card markup in
  `FeaturedAdoptionDogs.astro` (124) and `AdoptionGrid.astro` (134) — gallery,
  name link, `data-track-event="dog_profile_click"`, "Ver ficha de {name}".
- Move the repeated Instagram icon + handle markup at InstagramLink call sites
  (StoryCard, AdoptionGrid, CasesBand) into `InstagramLink.astro`, which already
  computes the handle.
- Decide `RainbowDivider.astro` (5 LOC, 12 importers): keep or replace with the
  raw `<hr class="rainbow-divider">`; either is defensible, pick one rule.
- Merge single-use tiny CSS into consumers: `adoption-intro.css`,
  `supporters-intro.css`, `home.css`; fold one-rule globals (`mission.css`,
  `motion.css`, `rainbow-divider.css`, `skip-to-content.css`) into `global.css`
  where already imported globally.

### Likely files

`src/components/**` (~42 → ~34 files), `src/layouts/PageLayout.astro`,
`src/styles/components/` (35 → ~29), the consuming pages.

### Non-goals

- No visual or copy changes; no class renames that affect CSS selectors.
- No changes to `TrackedLink` analytics attribute semantics or consent flow.
- No merging of the two steppers (`ProcessStepper` vs `AdoptionProcess`) —
  different styling, noted overlap only.
- No Tailwind or utility-class introduction.

### Validation

```bash
npm run format:check && npm run lint && npm run build && npm test
npm run test:lighthouse   # links, headings, landmarks touched
# optional: diff dist/ HTML against a pre-stage build for the affected pages
```

### Commit boundary

Three commits: (1) CTA-card consolidation, (2) link components + layout props +
DogCard extraction, (3) section inlining + file moves + CSS merges. Each is
independently revertible; file moves use `git mv`.

### Context capsule for a fresh agent

Astro components; styling is plain CSS in `src/styles/components/` imported per
component (no Tailwind). Shared primitives: `TrackedLink` (tracked outbound,
~20 importers), `WhatsAppLink`, `InstagramLink`. Page shell:
`BaseLayout` → `PageLayout` (Navbar/main/Footer, `afterShell` slot). Dog cards
are shaped by `src/utils/dog-content.ts`; galleries render through
`SharedPhotoGallery.astro`. Analytics events are delegated in
`src/scripts/analytics-events.ts` via `data-track-event` attributes — preserve
those attributes exactly. Verify visual identity with `npm run capture:local`
screenshots if unsure.

---

## Stage 5 — Consolidate utils and gallery scripts

### Scope

- Fix the JSON-LD duplication: `src/utils/structured-data.ts` (hand-rolled,
  used by BaseLayout) vs `src/utils/schema.ts` (seo-graph-core, used by blog
  pages + schema endpoint). Consolidate on one builder for WebSite/Organization/
  WebPage nodes; keep the seo-graph integration point in `astro.config.mjs`
  working. (Stage 1 already removed the bogus Person node.)
- Restructure `src/scripts/gallery/` (6 files, 514 LOC): `markup.ts` runs at
  build time inside an Astro component — move it and `types.ts` to
  `src/utils/gallery*`; delete the 4-line `index.ts` barrel (1 importer, already
  bypassed by the real client entry); keep client code (`dom`, `carousel`,
  `lightbox`) together under `src/scripts/`.
- Attach the `init-shared-gallery` script import to `SharedGalleryLightbox.astro`
  and delete the five duplicated `<script> import ...` blocks (index,
  por-que-galgos, casos-de-exito, adoptar/[slug], AdoptionGrid).
- Merge `story-card-copy.ts` (1 importer) into `dog-content.ts`; unify the two
  word-boundary truncators (`clampAtWordBoundary` + `buildCardStoryExcerpt`)
  into one helper; unexport what becomes internal.
- Add `getActiveAdoptionDogCards()` / `getShuffledStorySummaries()` to
  `dog-content.ts` to replace the getCollection → filter → shuffle → build
  boilerplate repeated across index, adoptar, adoptar/[slug], casos-de-exito,
  por-que-galgos.
- Delete dead exports: `escapeHtml` in `html-escape.ts` (0 importers).
- Consider folding `hero-images.ts` (33 LOC, 2 importers) into the homepage.

### Likely files

`src/utils/*` (12 → 9 files), `src/scripts/gallery/*`, `src/scripts/init-shared-gallery.ts`,
`src/components/SharedGalleryLightbox.astro`, `src/components/SharedPhotoGallery.astro`,
the five pages with duplicated gallery init, `src/pages/blog/[id].astro`,
`src/pages/schema/*`, `src/layouts/BaseLayout.astro`.

### Non-goals

- No changes to emitted JSON-LD node types, page metadata, or RSS output.
- No rewrite of carousel/lightbox behavior — only file placement and imports.
- No new dependencies; prefer dropping one of the two schema paths over adding.

### Validation

```bash
npm run format:check && npm run lint && npm run build && npm test
grep -o '"@type":"[A-Za-z]*"' dist/blog/*/index.html | sort -u   # compare to pre-stage
curl -s <preview>/schema/post.json | head                         # schema endpoint intact
# gallery: manual or Playwright check that lightbox opens on /casos-de-exito/ and a dog profile
```

### Commit boundary

Two commits: (1) schema-builder consolidation, (2) gallery restructure +
dog-content merge + dead-export deletion.

### Context capsule for a fresh agent

`SharedPhotoGallery.astro` renders markup built server-side (currently
`src/scripts/gallery/markup.ts`) via `set:html`; interactivity is initialized
client-side by `init-shared-gallery.ts` importing `gallery/carousel` and
`gallery/lightbox`. `BaseLayout.astro` injects the default JSON-LD graph from
`structured-data.ts` and accepts a `schema` prop override — index.astro uses it,
blog posts use `schema.ts` + `@jdevalk/astro-seo-graph`. Content-shaping helpers
live in `src/utils/dog-content.ts`; tests are `tests/dog-content.test.ts` and
`tests/source-hygiene.test.ts`. Keep `story-card-copy`'s 260-char default
aligned with the content rule (Stage 2 added a test for this).

---

## Stage 6 — Consolidate tests and commands

### Scope

- Merge `tests/smoke.spec.ts` (20 LOC) into `build-output.spec.ts` — its routes
  and assertions are a subset of build-output + a11y.
- Parametrize `nav.spec.ts`'s identical tablet/mobile tests into a viewport loop.
- Move the static CSP-string test out of `analytics-consent.spec.ts` into a
  Vitest file, and make it assert invariants (no `gtag.js`, required sources
  present) instead of duplicating the full CSP string verbatim — one file to
  edit when `_headers` legitimately changes.
- Keep the "no direct GA4" invariant at two layers (static grep in
  source-hygiene + one runtime check), not three.
- Share one parametrized helper for the gallery ≤3 browser assertions in
  `filter-chips.spec.ts` and `stories-section.spec.ts`.
- Stop `capture.spec.ts` riding inside local `npm test`: move it out of
  `testDir` or always `testIgnore` it, keeping the `capture:*` commands working.
- Prune `package.json` scripts: remove `test:e2e` (identical to the second half
  of `test`) or `capture:local` (its `--config` flag is the default); remove the
  four thin per-file Playwright aliases if unused, keep `test:source`. Document
  surviving scripts in README.
- Single-source the a11y disabled-rule list shared by `tests/a11y.spec.ts` and
  `.lighthouserc.cjs` (one constant imported by both, or a comment pointing at
  the owner).

### Likely files

`tests/` (11 → 9 files), `playwright.config.ts`, `package.json`,
`.lighthouserc.cjs`, `README.md`.

### Non-goals

- No reduction in what is asserted — only in how many places and files assert it.
- No CI workflow changes (`.github/`), no Lighthouse threshold changes.
- Keep capture screenshots available on demand; only remove them from the
  default test path.

### Validation

```bash
npm test                 # green, and produces no .cache/parity/ screenshots
npm run capture:local    # still works on demand
npm run lint && npm run build && npm run test:lighthouse
```

### Commit boundary

One commit: `test: deduplicate specs and prune npm scripts`.

### Context capsule for a fresh agent

Runner split: Vitest = `*.test.ts` (source-hygiene, dog-content); Playwright =
`*.spec.ts` via `scripts/run-playwright-server.mjs` on 127.0.0.1 (builds and
previews). `capture.spec.ts` is a manual visual-parity screenshotter writing to
`.cache/parity/`, currently ignored only when `CI` is set
(`playwright.config.ts:11`). CSP lives in `public/_headers`. The a11y exceptions
(`color-contrast`, `label-content-name-mismatch`, `heading-order`) exist in both
`tests/a11y.spec.ts` and `.lighthouserc.cjs`. Playwright specs must keep working
with `npm test` and in CI where capture is skipped.

---

## Suggested execution order

1 → 2 → 3 → 4 → 5 → 6, but any stage can ship alone. Stage 1 carries the only
user-facing fixes (redirects, bogus JSON-LD) and should land first. Stages 2→3
are coupled (tests protect doc deletion). Stages 4 and 5 are independent of each
other; run 5 before 6 so test dedup reflects the final module layout.
