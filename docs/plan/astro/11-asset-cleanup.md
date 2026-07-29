# Task 11 — Remove dead assets and leftover routes

## Goal

Delete files that ship to `dist/` (or sit in `src/`) with no consumer, reducing deploy weight and confusion.

## Current state

- `public/images/brigada-galgos-og-image.webp` (157 KB): unreferenced — only the `.jpg` variant is used via `SITE.ogImagePath`.
- `public/images/brigada-galgos-logo.png` (60 KB): used only as JSON-LD logo + webmanifest icon; check whether a smaller size suffices (webmanifest already has 192/512 variants — verify which file the manifest actually points to before deleting anything).
- `src/pages/casos/`: empty leftover directory (the archive lives at `src/pages/casos-de-exito.astro`).
- Double-check `public/` for other orphans with a reference sweep before deleting.

## Astro docs reference

- Astro copies everything in `public/` verbatim into the build; unreferenced files there are pure dead weight — https://docs.astro.build/en/basics/project-structure/#public

## Changes

1. Reference-sweep each candidate (`Grep` for the filename across `src/`, `public/`, `astro.config.mjs`, `tests/`):
   - Delete `public/images/brigada-galgos-og-image.webp` if truly unreferenced.
   - For `brigada-galgos-logo.png`: if webmanifest/JSON-LD need it, replace with a right-sized version (e.g. 512px) via the existing image pipeline or a one-off sharp script — do NOT add new npm scripts; keep it simple.
   - Delete the empty `src/pages/casos/` directory.
2. Verify no `_redirects`/`_headers` entries point at deleted files.
3. Update `tests/build-output.spec.ts` only if it asserted existence of a deleted file.

## Acceptance criteria

- `npm run build` output smaller; no 404s introduced (Playwright nav/build-output specs green).
- `grep -r "brigada-galgos-og-image.webp" .` (excluding `.git/`, `node_modules/`, `dist/`) returns nothing.
- `npm run lint && npm test` green.
