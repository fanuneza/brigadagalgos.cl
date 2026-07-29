# Task 07 — Dog card visual redesign

- **Wave:** 5 (branch `wave-5/card-redesign`, off `main` after wave 4 is merged)
- **Depends on:** wave 4 merged
- **Commit message:** `feat(cards): redesign dog and story cards`

## Goal

Make the dog cards worth the new gallery: a deliberate visual refresh of `DogCard` and
`StoryCard` that stays inside the existing CSS architecture and design tokens. This is the
"ugly" half of the user's complaint — the lightbox half is tasks 05–06.

## Background (current implementation)

- `src/components/DogCard.astro` (104 lines): variants `featured` (homepage) and `grid`
  (`/adoptar/`). The grid variant reuses `story-card__*` classes — an accidental coupling
  between adoption and story card styling that constrains any redesign.
- `src/components/StoryCard.astro` (56 lines): `data-story-card`, quote body, Instagram
  link.
- CSS: `src/styles/components/dog-card.css` (139 lines), `stories.css` (181 lines, owns
  the `story-card` base), `featured-adoption-dogs.css` (131 lines),
  `adoption-grid.css` (75 lines). Tokens in `src/styles/tokens.css`; visual language
  documented in `DESIGN.md`.
- `stories.css` uses `content-visibility: auto` + `contain-intrinsic-size: auto 500px`
  on `.story-card` — keep this; it is a real performance feature.
- Chips (`.dog-chip*` for sex/age/weight/need) exist only in the grid variant.

## Files owned

- `src/components/DogCard.astro`
- `src/components/StoryCard.astro`
- `src/components/sections/CasesBand.astro` (it inlines story-card markup — keep in sync)
- `src/styles/components/dog-card.css`
- `src/styles/components/stories.css`
- `src/styles/components/featured-adoption-dogs.css`
- `src/styles/components/adoption-grid.css`
- `DESIGN.md` (only if component patterns change materially)

Do not touch: `SharedPhotoGallery.astro`, `SharedGalleryLightbox.astro`,
`shared-gallery.css`, `src/scripts/**`, pages, tests (unless a `data-*` hook you rename
breaks one — prefer keeping all existing `data-*` attributes stable).

## Steps

1. **Read `DESIGN.md` and `src/styles/tokens.css` first.** Every color, spacing, radius,
   shadow, and type choice must come from tokens; no new one-off values.
2. **Decouple the class systems.** Give `DogCard` its own `dog-card__*` structure for the
   grid variant instead of borrowing `story-card__*`; move the shared base (photo frame,
   body padding) into either `dog-card.css` or a clearly-shared block in `shared-gallery.css`'s
   adjacent layer — but do not edit `shared-gallery.css` in this task; duplicate the few
   needed rules into `dog-card.css` instead. Update `CasesBand.astro`'s inline markup to
   match the `StoryCard` structure.
3. **Redesign the cards** with the same structure across all three surfaces (homepage
   featured, `/adoptar/` grid, `/casos-de-exito/` + `/por-que-galgos/` story cards):
   - Consistent photo treatment (radius, aspect, hover zoom gated behind
     `prefers-reduced-motion: no-preference` and `@media (hover: hover)`).
   - Clear hierarchy: name, chip row / quote, CTA. Chips readable at a glance; the
     `currentNeed` eyebrow visually distinct from meta chips.
   - Card-level affordance: make the whole card feel clickable where it links (use the
     existing stretched-link pattern if one exists in the codebase; otherwise a subtle
     hover/focus elevation). Never nest interactive elements illegally.
   - Focus-visible styles for every interactive element, matching the site's existing
     focus language.
4. **Keep every behavioral hook**: all existing `data-*` attributes
   (`data-story-card`, `data-featured-adoption-card`, `data-track-*`, filter-chip hooks),
   `transition:name` wiring, and `loadingPriority` behavior. Playwright tests key off
   these — rename nothing.
5. **Copy untouched.** No text changes; voice rules are out of scope here.
6. Visual QA: run the dev server and inspect homepage, `/adoptar/`, `/casos-de-exito/`,
   `/por-que-galgos/`, and one `/adoptar/<slug>/` at mobile and desktop widths. Optionally
   use the on-demand capture scripts (`npm run capture:*`) — do not wire them into tests.

## Acceptance checks

```bash
npm run format:check
npm run lint            # Stylelint included
npm run build
npm test
npm run test:lighthouse # semantics/a11y can regress silently when headings/buttons change
```

## Done when

- Adoption and story cards have independent, coherent class systems; no `story-card__*`
  classes inside `DogCard`.
- The three card surfaces share one deliberate visual language built from tokens.
- All `data-*` hooks, tests, and Lighthouse scores are intact.
