# T05 — Adoption listing

| Field      | Value                                                     |
| ---------- | --------------------------------------------------------- |
| Wave       | 3 — Adoption journey                                      |
| Branch     | `ux/wave-03-t05-adoption-listing`                         |
| Mode       | Safe to run in the Wave 3 swarm                           |
| Depends on | T04                                                       |
| Commit     | `ux(T05): make adoption discovery clear and low friction` |

## Objective

Turn `/adoptar/` into a clear sequence: meet dogs, compare confirmed needs,
open a profile, understand the process, then apply.

## Ownership

- `src/pages/adoptar.astro`
- `src/components/DogCard.astro`
- `src/components/sections/AdoptionGrid.astro`
- `src/styles/components/adoption-grid.css`
- `src/styles/components/dog-card.css`
- `src/styles/components/filter-chips.css`
- adoption listing/filter tests

Do not edit dog profiles, homepage sections, or shared gallery internals.

## Implementation

1. Change the hero action from premature external “Postular” to an in-page
   “Ver galgos en adopción” destination.
2. Present one decisive image per listing card. Keep full galleries for the
   profile/lightbox rather than multiplying carousel controls in the grid.
3. Add an explicit, dog-specific “Conocer a [nombre]” action with a robust
   target. The card name may remain linked, but the path cannot depend on it.
4. Show only the highest-value confirmed facts and a concise compatibility
   summary from T04. Do not turn cards into dense checklists.
5. Reassess filters against five dogs. Keep only filters that help and never
   imply compatibility from missing data. Preserve a clear result count and
   empty state.
6. Explain the external form’s purpose, approximate content, and new-tab
   behavior immediately before application CTAs.

## Acceptance

- A first-time visitor can reach a dog profile without interacting with a
  carousel or external form.
- Each card has one obvious next action and a unique accessible name.
- Listing interaction count and mobile page length decrease materially from the
  audit baseline.
- Filters remain keyboard operable and update count/state correctly.
- Post-adoption support remains visible on the route.

## Verification

```bash
npx playwright test tests/filter-chips.spec.ts tests/dog-profile.spec.ts
npm run capture:adoptar
npm run test:lighthouse
npm run build
```

Record before/after interactive-element count and mobile page height.
