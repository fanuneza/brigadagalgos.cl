# Plan: Unified Dog Collection + Gallery/Lightbox Revamp

This directory contains a modular execution plan for two coupled initiatives:

1. **Unify `adoption-dogs` and `success-dogs` into a single `dogs` collection** with a
   `status` discriminator, so moving a dog from adoption to success becomes a frontmatter
   edit instead of a cross-directory `git mv` + asset move + frontmatter rewrite.
2. **Rebuild the dog card gallery and lightbox** to be server-rendered, faster, and
   nearly JS-free: CSS scroll-snap carousel + native `<dialog>` lightbox, deleting most
   of `src/scripts/gallery/`.

Each numbered file is one task, sized for a single subagent. Tasks are grouped into
**waves**; waves run in order, tasks within a swarm wave run in parallel.

## Current state (verified against the codebase)

- Two collections in `src/content.config.ts`: `adoption-dogs` (14 fields, profile-oriented,
  `active`/`hiddenSince`/`hiddenReason` rules) and `success-dogs` (4 fields, `story`-oriented).
- 5 adoption dogs in `src/content/adoption-dogs/`, 29 success dogs in `src/content/success-dogs/`.
- Assets mirror the split: `src/assets/casos/adopcion/<slug>/` and `src/assets/casos/exito/<slug>/`.
- `src/utils/dog-content.ts` exposes two parallel query/shaping pipelines
  (`getActiveAdoptionDogCards` / `getShuffledStorySummaries`, `AdoptionDogCard` / `StoryDogSummary`).
- The gallery SSRs only the first slide; slides 2–3, dots, swipe, and the lightbox are built
  client-side by ~440 lines across `src/scripts/gallery/{carousel,dom,lightbox}.ts`, driven by a
  per-card JSON payload in `data-gallery-payload`. `/casos-de-exito/` embeds that payload 29 times.
- The lightbox swaps a single 1200px AVIF into a static hidden div: no focus trap, no focus
  return, no loading state, mislabeled analytics for adoption dogs.
- No test asserts carousel/lightbox interaction — only the payload JSON shape, card counts,
  and link structure are locked by tests, so the interaction redesign is test-safe.
- The homepage picks featured dogs at random: `getActiveAdoptionDogCards` shuffles and
  ignores the optional `order` field. `AGENTS.md` and `docs/spec.md` document this; the
  plan keeps the shuffle behavior as-is.

## Key decisions

- **One collection: `dogs`** (`src/content/dogs/`), discriminated by
  `status: "adopcion" | "exito"`. Zod `discriminatedUnion` inside the `schema: ({ image }) =>`
  context function (Astro 7 supports full Zod 4; `image()` requires the context form).
  Profile fields (`sex`, `age`, …) are required only when `status` is `adopcion`;
  `story` is required only when `status` is `exito`. The hidden-dog refinement applies
  only to adoption entries.
- **One asset root: `src/assets/casos/<slug>/`.** The `adopcion`/`exito` split is the
  mechanical pain; it disappears. Existing image URLs change only at the source level —
  generated output URLs are content-hashed by Astro anyway.
- **Editorial workflow after migration:** adoption → success = change `status`, add `story`,
  drop profile fields, add the `/adoptar/<slug>/` redirect. No file moves. Hiding a dog is
  unchanged (`active: false` + metadata) and only applies to `status: adopcion`.
- **Public site is unchanged:** `/adoptar/`, `/adoptar/<slug>/`, `/casos-de-exito/`,
  homepage sections, and `/por-que-galgos/` keep their URLs and behavior. The distinction
  is rendered from `status`, not from the collection.
- **Carousel:** all slides server-rendered; navigation via CSS `scroll-snap` +
  anchor-link dots (progressively enhanced). Works with JS disabled; no dead controls.
- **Lightbox:** native `<dialog>` + `showModal()` — built-in top layer, `::backdrop`,
  Escape-to-close, and focus containment. One small JS module (~60 lines) replaces
  `carousel.ts` + `dom.ts` + `lightbox.ts` (~440 lines).
- **Keep** `transition:name` morphing (`dog-photo-<id>`) between cards and profile pages;
  it is orthogonal to the JS being removed. `story-photo-<id>` names are dropped — nothing
  consumes them.
- **Keep** the responsive image pipeline (`src/utils/responsive-gallery-images.ts`) and its
  AVIF/WebP variants; the redesign changes markup and delivery, not the image variants. The
  per-card JSON payload is removed — all data is SSR'd into markup instead.

## Orchestration protocol

The orchestrating agent runs this plan as follows:

1. **One branch per wave** off `main`: `wave-N/<slug>`. For swarm waves, one branch per
   task: `wave-N/<task-slug>`, all off `main` (after the previous wave is merged).
2. **Dispatch one subagent per task file.** For swarm waves, dispatch the tasks as a
   parallel swarm. Each subagent must read its task file plus `AGENTS.md` and
   `docs/content-model.md` before starting.
3. **Subagent commits its own work** on its branch with the commit message specified in the
   task file, runs the acceptance checks listed there, and reports: files changed, check
   results, and any deviations. The orchestrator does not re-do the work; it reviews the diff
   (`git diff main...HEAD`) and the check output.
4. **Merge to `main` when the wave is green**, then delete the wave/task branches
   (`git branch -d`). Never start a wave before the previous one is merged.
5. **Final review (task 08)** is performed by the orchestrator itself after the last wave:
   full verification suite, a self-contained code review of the whole diff, and cleanup of
   any remaining branches.

Rules for every subagent:

- Follow `AGENTS.md` non-negotiables: repo-relative paths only, UTF-8 intact, no new
  dependencies without surfacing it, no hand-edited `package.json` versions.
- Touch only the files listed under **Files owned** in the task. If a change outside that
  set is unavoidable, stop and report instead of improvising.
- Chilean Spanish copy follows `docs/voice-and-tone.md`; do not rewrite copy unless the
  task says so.
- Run the acceptance checks before committing. A red check means the task is not done.

## Waves

| Wave | Branch | Tasks | Mode |
| --- | --- | --- | --- |
| 1 — Unified schema & migration | `wave-1/unify-dog-collections` | 01 → 02 | Sequential |
| 2 — Consumers, tests, docs | `wave-2/consumers` + `wave-2/tests-docs` | 03 ∥ 04 | Swarm (2) |
| 3 — SSR carousel | `wave-3/ssr-carousel` | 05 | Single |
| 4 — Native lightbox | `wave-4/native-lightbox` | 06 | Single |
| 5 — Card visual redesign | `wave-5/card-redesign` | 07 | Single |
| 6 — Review & integration | — | 08 | Orchestrator |

Waves 3–5 are sequential because they share `shared-gallery.css` and the card components;
do not parallelize them. Wave 2 is a swarm because tasks 03 and 04 own disjoint file sets.

## Verification baseline

Every task runs the subset of this suite that its files affect; task 08 runs all of it:

```bash
npm run format:check
npm run lint        # ESLint + Stylelint + text-quality + dog-images:check
npm run build
npm test            # Vitest + Playwright
npm run test:lighthouse   # waves 3–6 only (UX/performance surface)
```
