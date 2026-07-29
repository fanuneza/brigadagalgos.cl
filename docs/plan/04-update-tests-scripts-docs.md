# Task 04 — Update tests, scripts, and documentation for the unified collection

- **Wave:** 2 (branch `wave-2/tests-docs`, off `main` after wave 1 is merged) — **swarm, task B**
- **Depends on:** wave 1 merged
- **Parallel with:** task 03 (disjoint file sets — do not touch its files)
- **Commit message:** `chore(content): align tests, scripts, and docs with unified dogs collection`

## Goal

All guards and docs speak the new model: one `dogs` collection, `status` discriminator,
single asset root. The editorial workflow docs gain the simplified "move to success"
procedure.

## Files owned

- `tests/source-hygiene.test.ts`
- `tests/stories-section.spec.ts`
- `tests/dog-content.test.ts` (imports/fixtures only, if they reference old collections)
- `tests/filter-chips.spec.ts` (collection-path references only, if any)
- `public/_redirects` (only if the redirect test's expectations change format — see step 2)
- `docs/content-model.md`
- `docs/spec.md`
- `docs/prd.md`
- `AGENTS.md`
- `README.md`

Do not touch: `src/pages/**`, `src/components/**`, `src/utils/dog-content.ts`,
`src/content.config.ts`, `scripts/normalize-dog-images.mjs` (task 02), card/gallery code.

## Steps

1. **`tests/source-hygiene.test.ts`** — port the three dog rules to the new layout:
   - Hidden dogs (currently lines 138-174): scan `src/content/dogs/*.md`; the rule applies
     only to files with `status: "adopcion"`. Keep: `active: false` ⇒ valid `hiddenSince`
     + non-empty `hiddenReason`, max 90 days hidden.
   - Story rule (176-192): applies to files with `status: "exito"`. Keep: double-quoted
     `story`, ≤260 chars, matches `/adopt/i`.
   - Redirect coverage (194-238): the current heuristic lists slugs via
     `git log --diff-filter=D` on `src/content/adoption-dogs/` — after the migration that
     directory is empty/gone, so replace the deleted-file heuristic: retired slugs are now
     detectable as files that **changed `status` from `adopcion` to `exito`**
     (`git log -p -- src/content/dogs/` is acceptable but slow; simpler and more robust:
     keep scanning git history for `status: "adopcion"` → `status: "exito"` transitions
     and deleted `src/content/dogs/*.md` files). Keep the existing invariants: every
     retired-or-hidden adoption slug has `/adoptar/<slug>/ /casos-de-exito/ 301` in
     `public/_redirects`, and no active adoption slug appears there. Preserve the
     shallow-clone degradation path.
   - The 10 existing retired slugs in `public/_redirects` (baco, barry, arepita, loica,
     aurora, dante, foxy, huayca, nina, olga) must keep passing — their dogs now live in
     `src/content/dogs/` with `status: "exito"`.
2. **`tests/stories-section.spec.ts`** — count story cards from
   `src/content/dogs/*.md` files with `status: "exito"` instead of the old directory.
3. **Docs.** Rewrite the affected sections:
   - `docs/content-model.md`: one schema table with `status` and per-variant fields; new
     "Moving a dog to success" workflow = edit frontmatter (`status`, add `story`, drop
     profile-only fields) + add redirect — no `git mv`, no asset move; hiding workflow
     unchanged but adoption-only; asset convention now `src/assets/casos/<slug>/`.
   - `AGENTS.md`: update "Content Collections", "Managing Dog Statuses", and the
     homepage-selection bullet (it already documents the shuffle; make it reference the
     unified `dogs` collection and keep noting that `order` is unused).
   - `docs/spec.md` (lines ~131-132, 231-232, 241-242, 368-370): collection names, asset
     paths, data flow.
   - `docs/prd.md` (~line 102) and `README.md` (~lines 19-20): collection references.
4. Grep sweep: `rg "adoption-dogs|success-dogs|casos/adopcion|casos/exito" tests/ docs/ scripts/ AGENTS.md README.md public/` — no stale references remain (historical prose
   like "previously split into two collections" is fine where it aids understanding).

## Acceptance checks

```bash
npm run format:check
npm run lint
npm run build
npm test            # full suite: updated guards green against the new layout
```

## Done when

- All dog guards in `source-hygiene.test.ts` operate on `src/content/dogs/` with
  `status`-based scoping, including the new status-transition redirect detection.
- Playwright story-count test reads the unified directory.
- Docs describe only the unified model and the simplified workflows.
- No stale collection/asset-path references anywhere outside `src/pages`/`src/components`
  (task 03's territory).
