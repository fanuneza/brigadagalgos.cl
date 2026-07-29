# Task 02 — Execute the content and asset migration

- **Wave:** 1 (branch `wave-1/unify-dog-collections`, continues task 01)
- **Depends on:** task 01 merged into the wave branch
- **Commit message:** `feat(content): migrate dogs into unified collection and asset root`

## Goal

Move all 34 dogs into `src/content/dogs/` and all asset folders into
`src/assets/casos/<slug>/`, with `status` set and gallery paths rewritten. After this task
the new collection holds all content; the old collections still render the site (consumers
switch in wave 2).

## Files owned

- `src/content/adoption-dogs/*.md` → `src/content/dogs/*.md` (moved)
- `src/content/success-dogs/*.md` → `src/content/dogs/*.md` (moved)
- `src/assets/casos/adopcion/*` → `src/assets/casos/*` (moved)
- `src/assets/casos/exito/*` → `src/assets/casos/*` (moved)
- `scripts/normalize-dog-images.mjs`

Do not touch: `src/content.config.ts` collection definitions, pages, components, tests,
docs, `public/_redirects`.

## Steps

1. Run `node scripts/migrate-dog-collections.mjs --dry-run` and review the plan: 5 adoption
   dogs, 29 success dogs, no slug collisions, every gallery path resolves.
2. Run `node scripts/migrate-dog-collections.mjs` for real. Verify with `git status` that
   every move is tracked as a rename (`R`) where possible — use `git mv` semantics so
   history (needed by the redirect-coverage test's `git log --diff-filter=D`) survives.
3. Update `scripts/normalize-dog-images.mjs`:
   - Replace the hardcoded `contentRoots` (`adopcion`/`exito` pair) with a single
     `src/content/dogs` root and a single `src/assets/casos` assets root.
   - Keep the filename convention `<slug>-NN.jpg` and the slugify-based canonicalization
     (including its ability to rename a `.md` whose filename drifts from `slugify(name)`).
   - Drop all logic that derives the asset kind from the collection directory.
4. Sanity-check the moved content:
   - Every `src/content/dogs/*.md` has `status` and gallery paths under
     `../../assets/casos/<slug>/`.
   - `npm run dog-images:check` passes against the new layout.
5. Build twice and compare: `npm run build` must succeed, and the emitted pages under
   `dist/adoptar/` and `dist/casos-de-exito/` must be identical to `main` (the site still
   renders from the old collections — diff a couple of pages to confirm nothing changed).
   Note: the old collection directories no longer exist, so the old `glob` loaders must not
   error on empty/missing bases. If the glob loader errors on a missing base, that is
   expected and acceptable only if the build still passes — otherwise report it and
   temporarily point the old loaders at `src/content/dogs` with a `status`-based pattern
   filter (e.g. pattern `**/*.md` cannot filter; use a small custom filter in
   `getCollection` call sites is NOT allowed here). Prefer: verify actual behavior first;
   Astro's glob loader tolerates empty results from an existing directory, so leaving
   empty `adoption-dogs/` and `success-dogs/` dirs with a `.gitkeep` is the fallback.

## Acceptance checks

```bash
npm run format:check
npm run lint                # includes dog-images:check against the new layout
npm run build
npm test                    # full suite still green on old collection path
```

## Done when

- `src/content/dogs/` contains all 34 dogs with correct `status`; old content dirs are
  empty or gone (per step 5 decision, documented in the commit body).
- `src/assets/casos/<slug>/` holds all 34 asset folders; no `adopcion`/`exito` dirs remain.
- `normalize-dog-images.mjs` works against the unified layout (`npm run dog-images:check`
  green).
- Full test suite passes unmodified — proof the migration changed no rendered output.
