# Task 08 — Final review and integration (orchestrator)

- **Wave:** 6 (no new branch — review happens on `main` after wave 5 merges; fixes land on
  `wave-6/review-fixes` if needed)
- **Depends on:** waves 1–5 merged, all task branches deleted
- **Performed by:** the orchestrating agent itself, not a subagent

## Goal

Verify the whole program as one change, not as five isolated diffs, and leave the
repository clean.

## Steps

1. **Branch hygiene.** `git branch` shows no `wave-*` branches; `git log --oneline main`
   shows one commit per task (01–07), each with its specified message.
2. **Full verification:**

   ```bash
   npm run format:check
   npm run lint
   npm run build
   npm test
   npm run test:lighthouse
   ```

3. **Holistic code review** of `git diff` across the merged range. Check specifically:
   - No file references `adoption-dogs`, `success-dogs`, `casos/adopcion`, or
     `casos/exito` outside intentional historical prose
     (`rg "adoption-dogs|success-dogs|casos/(adopcion|exito)"` repo-wide).
   - `src/content.config.ts` has exactly one dog collection; the `status` discriminated
     union validates both variants and the hidden-dog refinement still applies.
   - Gallery JS: only the small lightbox module remains; `carousel.ts`, `dom.ts`, and
     `init-shared-gallery.ts` are gone; no `data-gallery-payload` in `dist/` output.
   - No new dependencies were added to `package.json` / `package-lock.json`.
   - `transition:name` morphing still works card → profile (`dog-photo-<id>` present in
     both `DogCard`/`SharedPhotoGallery` output and `adoptar/[slug].astro`).
   - Analytics: `gallery_open` fires for both contexts; consent flow untouched
     (`tests/analytics-consent.spec.ts` green).
   - Redirects: `public/_redirects` still covers the 10 retired slugs; the updated
     hygiene test detects hidden dogs and status transitions.
4. **Editorial dry-run.** Simulate the old pain point end-to-end: pick an active adoption
   dog, flip `status` to `"exito"`, add a valid `story`, remove profile-only fields, add
   the redirect. Confirm `npm run lint && npm run build && npm test` pass, then revert the
   simulation. This validates that the migration actually removed the pain.
5. **Docs consistency.** `AGENTS.md`, `docs/content-model.md`, `docs/spec.md`,
   `docs/prd.md`, `README.md`, and `DESIGN.md` describe the system as it now exists; this
   `docs/plan/` directory remains as the record of the program (add a one-line "Status:
   completed" note at the top of this README when done).
6. **Fix or file.** Any finding that is small and safe → fix on `wave-6/review-fixes`, run
   the full suite, merge, delete the branch. Anything larger → write it up as a follow-up
   issue/list in the final report instead of expanding scope.

## Done when

- The full verification suite is green on `main`.
- The editorial dry-run proves the adoption → success move is a frontmatter edit.
- No `wave-*` branches remain; the plan's README is marked completed.
