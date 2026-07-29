# Task 08 — Named view transitions and persistence for key UI elements

## Goal

The site already uses `<ClientRouter />` globally (default crossfade only). Add named transitions and `transition:persist` where they measurably improve perceived continuity — conservatively, without animation bloat.

## Current state

- `src/layouts/BaseLayout.astro`: `<ClientRouter />` in `<head>`; no `transition:name` or `transition:persist` anywhere in the codebase.
- Client scripts are already transition-safe (`astro:page-load`, `astro:before-swap`, `data-initialized` guards).
- Candidate continuities:
  - Dog card image on `/adoptar/` → same photo on `/adoptar/<slug>/` (morph).
  - `Navbar` (identical across pages) — persist to avoid re-layout flicker.
  - Hero divider / `PageHero` shared chrome.

## Astro docs reference

- https://docs.astro.build/en/guides/view-transitions/ — `transition:name` for element morphing, `transition:persist` for keeping elements/state across navigations, `transition:animate` to customize.
- Named elements must be UNIQUE per page; for lists, derive names from the content slug (e.g. `transition:name={\`dog-photo-${slug}\`}`).

## Changes

1. `src/components/Navbar.astro`: add `transition:persist` (with a stable `data-astro-transition-scope`/id if required by the version) after verifying mobile drawer state resets correctly on `astro:page-load`. If drawer state leaks, skip persist and ship only task items 2–3.
2. Dog card → profile morph: add matching `transition:name={`dog-photo-${dogSlug}`}` to the primary card image in `DogCard.astro` and the lead gallery image in `src/pages/adoptar/[slug].astro`. Only when the same source image renders on both pages (it does: gallery[0]).
3. Optionally `transition:name` for story cards → `/casos-de-exito/` anchors, same pattern, only if trivial.
4. Do NOT add global custom animations; keep the default crossfade elsewhere. Respect `prefers-reduced-motion` (ClientRouter handles this by default — verify no custom CSS re-enables motion).

## Acceptance criteria

- Navigating `/adoptar/` → a dog profile morphs the photo; back-navigation morphs back.
- No layout shift or duplicated-element flashes in Playwright (`tests/nav.spec.ts`, `tests/dog-profile.spec.ts` stay green).
- Lighthouse: no INP/TBT regression; `npm run test:lighthouse` green.
- Reduced-motion users get instant swaps (manual check or emulated media in Playwright if a spec exists).
