# Task 03 — Switch pages and components to the `dogs` collection

- **Wave:** 2 (branch `wave-2/consumers`, off `main` after wave 1 is merged) — **swarm, task A**
- **Depends on:** wave 1 merged
- **Parallel with:** task 04 (disjoint file sets — do not touch its files)
- **Commit message:** `feat(content): render site from unified dogs collection`

## Goal

Every page and component reads from the unified `dogs` collection via the new query layer.
The public site stays byte-for-byte equivalent: same URLs, same sections, same counts. The
old `adoption-dogs`/`success-dogs` collection definitions are removed.

## Files owned

- `src/pages/index.astro`
- `src/pages/adoptar.astro`
- `src/pages/adoptar/[slug].astro`
- `src/pages/casos-de-exito.astro`
- `src/pages/por-que-galgos.astro`
- `src/components/sections/TrustStatsSection.astro`
- `src/components/sections/FeaturedAdoptionDogs.astro` (only if it queries content itself)
- `src/content.config.ts` (remove the two old collections only)
- `src/utils/dog-content.ts` (remove deprecated old-collection functions only)

Do not touch: tests, scripts, docs, `public/_redirects`, card/gallery components
(`DogCard.astro`, `StoryCard.astro`, `SharedPhotoGallery.astro`, …) — those are tasks 04–07.

## Steps

1. Replace every `getCollection("adoption-dogs")` / `getCollection("success-dogs")` call
   site with the new `dogs`-based functions from task 01:
   - `src/pages/index.astro:81-90` — active adoption dogs (count + hero image),
     featured cards, story summaries.
   - `src/pages/adoptar.astro:14` — full active adoption grid.
   - `src/pages/adoptar/[slug].astro:17-29` — `getStaticPaths` over active adoption
     entries; card building; meta description; OG image from `gallery[0]`.
   - `src/pages/casos-de-exito.astro:11` — full story archive.
   - `src/pages/por-que-galgos.astro:12` — 3 stories with `requireGallery: true`.
   - `src/components/sections/TrustStatsSection.astro:3,5` — active adoption count.
2. **Ordering stays as-is.** The homepage featured selection is intentionally shuffled
   (documented in `AGENTS.md` and `docs/spec.md`); do not change it. The optional `order`
   field remains in the schema but unused. If you rename `getShuffledStorySummaries` to
   something less misleading (e.g. `getStorySummaries` with a `shuffle` option), keep a
   deprecated alias if call sites are shared with task 04's files — if so, keep the old
   name to avoid cross-task conflicts. Renaming is optional; behavior must not change.
3. Remove `adoption-dogs` and `success-dogs` from `src/content.config.ts` and delete the
   now-dead old-collection code paths in `src/utils/dog-content.ts`. The `dogs` collection
   is now the only dog collection.
4. Grep for leftovers: `rg "adoption-dogs|success-dogs" src/` must return nothing outside
   comments you intentionally keep (there should be none).

## Acceptance checks

```bash
npm run format:check
npm run lint
npm run build
npx vitest run                       # unit tests
npx playwright test tests/stories-section.spec.ts tests/filter-chips.spec.ts tests/dog-profile.spec.ts
```

Note: task 04 updates the test _sources_ in parallel; if a test fails only because of an
edit task 04 is making, coordinate via the orchestrator rather than editing tests here.

## Done when

- No source file references the old collection names.
- Rendered pages are unchanged in structure: homepage (3 featured + 3 stories),
  `/adoptar/` (5 profiles + grid), `/casos-de-exito/` (29 cards), profile pages intact.
- The homepage featured selection is unchanged (shuffled per build).
- Old collection definitions and dead query code are gone.
