# Task 01 — Unified `dogs` collection schema and query layer

- **Wave:** 1 (branch `wave-1/unify-dog-collections`, off `main`)
- **Depends on:** nothing
- **Commit message:** `feat(content): add unified dogs collection schema and query layer`

## Goal

Introduce the new `dogs` collection (schema + query/shaping functions) **alongside** the
existing collections, without touching any content files or consumers yet. Task 02 migrates
the content; wave 2 switches consumers. After this task, the site builds exactly as before.

## Background

Current schemas live in `src/content.config.ts:5-40`. `adoption-dogs` has 14 fields with a
refinement requiring `hiddenSince`/`hiddenReason` when `active === false`; `success-dogs` has
4 fields (`name`, `story`, `instagramUrl?`, `gallery` default `[]`). Shared: `name`,
`instagramUrl`, `gallery` (max 3, via `image()`).

`src/utils/dog-content.ts` (147 lines) exposes two parallel pipelines. The new query layer
replaces them with one pipeline filtered by `status`, while re-exporting the old function
names as thin adapters so consumers keep compiling until wave 2.

## Files owned

- `src/content.config.ts`
- `src/utils/dog-content.ts`
- `scripts/migrate-dog-collections.mjs` (new)
- `tests/dog-content.test.ts` (extend only; do not change existing assertions)

Do not touch: content files, assets, pages, components, other tests, docs.

## Steps

1. **Schema.** In `src/content.config.ts`, add a `dogs` collection:
   - `loader: glob({ pattern: "**/*.md", base: "./src/content/dogs" })`.
   - `schema: ({ image }) => z.discriminatedUnion("status", [adoptionSchema, successSchema])`
     where both variants share a base object: `name`, `instagramUrl: z.url().optional()`,
     `gallery: z.array(image()).max(3)`.
   - Adoption variant: `status: z.literal("adopcion")`, plus all current profile fields
     (`sex`, `age`, `weight`, `details`, `location?`, `currentNeed` default `"Adopción"`,
     `characterSketch`, `order?`, `active` default `true`, `hiddenSince?`, `hiddenReason?`),
     `gallery` required, and the existing hidden-dog refinement (`.superRefine` on the
     variant — refinement applies only when `active === false`).
   - Success variant: `status: z.literal("exito")`, `story: z.string()`, `gallery`
     default `[]` (preserve current behavior).
   - Keep the existing `adoption-dogs` and `success-dogs` definitions in place for now;
     task 03 removes them.
2. **Query layer.** In `src/utils/dog-content.ts`, add new canonical functions typed on
   `CollectionEntry<"dogs">`:
   - `getDogs(status)` / `getActiveAdoptionDogs()` reimplemented over `dogs`
     (`status === "adopcion"` && `active !== false`).
   - `buildAdoptionDogCards` and `buildStoryDogSummaries` reimplemented to accept the new
     entry type; keep the exported `AdoptionDogCard` and `StoryDogSummary` shapes
     byte-identical (consumers and tests depend on them).
   - Keep `MAX_DOG_GALLERY_IMAGES`, `META_DESCRIPTION_MAX`, `STORY_CARD_MAX_CHARACTERS`,
     `truncateAtWordBoundary`, `buildDogMetaDescription`, `getEntriesWithGallery` as-is.
   - The old collection-backed functions must keep working until wave 2: keep them, but
     implement the new ones as the source of truth and make old ones delegate where cheap.
     Ordering behavior (shuffled selection) stays as-is throughout this plan.
3. **Migration script.** Write `scripts/migrate-dog-collections.mjs` (Node, ESM, no new
   dependencies — use `node:fs`/`node:path` and regex-based frontmatter rewriting; the repo
   has no YAML parser dependency, so keep the transformation textual and conservative):
   - For each `src/content/adoption-dogs/*.md`: insert `status: "adopcion"` after `name:`;
     move file to `src/content/dogs/<slug>.md` via `git mv`.
   - For each `src/content/success-dogs/*.md`: insert `status: "exito"` after `name:`;
     move to `src/content/dogs/<slug>.md` via `git mv`.
   - For each dog: `git mv src/assets/casos/{adopcion,exito}/<slug> src/assets/casos/<slug>`
     and rewrite `gallery` paths in the moved markdown from
     `../../assets/casos/(adopcion|exito)/<slug>/` to `../../assets/casos/<slug>/`.
   - Fail loudly on: duplicate slugs across the two collections, missing asset folders
     referenced by `gallery`, or unexpected frontmatter keys.
   - Support `--dry-run` (print the planned moves/rewrites, change nothing).
   - Add npm script `"dog-collections:migrate": "node scripts/migrate-dog-collections.mjs"`
     via `npm pkg set` (do not hand-edit versions, but scripts may be added via npm).
4. **Unit tests.** Extend `tests/dog-content.test.ts` with tests for the new functions using
   fixture entries (the file already tests pure helpers; follow its style): status filtering,
   hidden-dog exclusion, story shaping from `status: "exito"` entries.

## Acceptance checks

```bash
npm run format:check
npm run lint
npm run build       # existing collections still feed the site; build unchanged
npx vitest run tests/dog-content.test.ts
node scripts/migrate-dog-collections.mjs --dry-run   # prints plan, exits 0
```

## Done when

- `dogs` collection compiles and validates (test with one temporary fixture entry under
  `src/content/dogs/` if needed, then remove it — task 02 adds the real content).
- New query functions exist and are unit-tested; old exports untouched in behavior.
- Migration script is committed, `--dry-run` output is sane for all 34 dogs.
- No page, component, or existing test was modified.
