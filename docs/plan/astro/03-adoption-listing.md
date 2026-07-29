# T03 — Make `/adoptar/` an assessment surface, not an action pile

**Wave 2** · branch `wave/2-dog-surfaces` · runs in parallel with [T04](04-dog-profile.md)

## Outcome

The listing helps a visitor **compare and choose** a galgo. Each card carries one primary action —
open the profile — and stops competing with the profile for the conversion.

## Problem being fixed

Audit finding 2, verified in the repo. Today each grid card
(`AdoptionGrid.astro` + `DogCard.astro`, `variant="grid"`) renders, in one card:

- an Instagram link (`InstagramLink`, `location="dog_card"`),
- a **primary** "Postular" button going straight to `SITE.adoptionForm` (`adoption_apply_click`),
- a **secondary** WhatsApp button (`Más información`),
- a ghost "Ver ficha de {name}" link in the footer,
- the dog's name as a third link to the same profile,
- plus `details` and `characterSketch` paragraphs and an interactive gallery.

Three competing next actions fire before the visitor has opened the profile, and the profile —
the surface that actually informs the decision — is the weakest of them.

## Owned files

Exclusive.

- `src/components/sections/AdoptionGrid.astro`
- `src/components/DogCard.astro`
- `src/styles/components/dog-card.css`
- `src/styles/components/adoption-grid.css`
- `src/styles/components/filter-chips.css`
- `src/pages/adoptar.astro`
- `src/scripts/filter-chips.ts` — only if the filter markup you change requires it

## Read-only files

`src/utils/dog-content.ts` (**frozen** — no new derived fields), `src/content.config.ts`,
`src/components/SharedPhotoGallery.astro`, `src/components/sections/FeaturedAdoptionDogs.astro`,
`src/styles/components/featured-adoption-dogs.css`, `src/pages/adoptar/[slug].astro`,
`tests/filter-chips.spec.ts`, `tests/dog-profile.spec.ts`, `DESIGN.md`.

`DogCard.astro` has a `featured` variant used by the homepage. You own the file, so you may
change it — but the `featured` branch must keep its current structure and its
`homepage_featured_adoptions` tracking. [T05](05-homepage-hierarchy.md) depends on it in wave 3.

## Scope

1. **One primary action per card.** The card's primary action becomes "Ver ficha de {name}".
   Remove the in-card "Postular" button — direct application moves to the profile, which
   [T04](04-dog-profile.md) is making the conversion surface. Remove the `dog-card__actions`
   block from `AdoptionGrid.astro`.

2. **Keep exactly one restrained contact fallback**, or none, on the listing. Do not keep a
   per-card WhatsApp button: it is the second competing action. Options, in order of preference:
   (a) drop per-card WhatsApp entirely and rely on the page-level WhatsApp CTA that
   `adoptar.astro` already renders in its `CtaCard`; (b) if you judge a fallback is genuinely
   needed at card level, make it a tertiary text link, never a filled button. Pick one, state
   which, and say why in your report.

3. **Analytics.** Removing card CTAs removes `adoption_apply_click` /
   WhatsApp events at `location="dog_card"`. That is intended. Preserve `dog_profile_click` at
   `dog_card` on the card's primary action, and do not leave orphaned `data-track-*` attributes.
   List every removed event in your report so T08 can update `docs/spec.md`.

4. **Make the card scannable.** The comparison facts (`sex`, `age`, `weight`, `currentNeed`) should
   lead; long prose should not. `details` and `characterSketch` are both present today and both
   full paragraphs — keep the more evocative one at card level and let the profile carry the rest,
   or clamp one to a short lead-in. Use only existing fields; invent nothing.

5. **Card weight.** Adopt the plainer card variant from `DESIGN.md` (T01) if the grid reads as a
   wall of equal-weight elevated boxes. The photo and the name should be what draws the eye.

6. **Whole-card affordance without JavaScript.** Make the card comfortably clickable using the
   stretched-link pattern (the profile link gets a `::after` overlay covering the card) so the
   name stays the accessible link text and the card stays keyboard-navigable with one tab stop
   per card. No click handlers. Verify text inside the card is still selectable and that the
   gallery controls remain reachable above the overlay — if the overlay fights the gallery, keep
   the plain link and say so.

7. **Filters.** Keep the current filter chips and their behavior. Verify the listing still works
   with JavaScript disabled: all dogs visible, accurate count, no dead controls. Only fix what is
   broken; do not redesign filtering.

8. **`adoptar.astro`.** Re-check the page tail now that cards are lighter: `AdoptionProcess` plus a
   `CtaCard` with both a form link and a WhatsApp link. Keep the process, but let the page-level
   CTA be the single clear fallback. Apply section weights (T01) so the listing outranks the tail.

## Constraints

- Everything in `README.md` §5 applies.
- `src/utils/dog-content.ts` and the content schema are **frozen**. No new fields, no schema edits.
- The 3-image gallery cap and `transitionName` requirements stay.
- The `featured` variant of `DogCard` keeps its current structure and tracking.
- No new client JavaScript. The listing must be fully usable without JS.
- Empty-state block and post-adoption support note stay.
- Do not touch `tokens.css` / `global.css` — consume what T01 shipped.

## Acceptance criteria

- Each grid card exposes one primary action (profile) and at most one tertiary fallback.
- No `adoption_apply_click` fires from `location="dog_card"`.
- `dog_profile_click` still fires from the listing.
- The card is keyboard-reachable with a sensible accessible name, one meaningful tab stop per card.
- With JS off: all dogs render, gallery shows its first image, filters degrade harmlessly.
- Heading levels unchanged (`h1` on the page, `h3` per card). No heading skips.
- `tests/filter-chips.spec.ts` still passes against your markup (read it first; adapt markup, not
  the test — if the test itself is wrong, stop and report).

## Verification

```bash
npx prettier --check src/components/sections/AdoptionGrid.astro src/components/DogCard.astro src/pages/adoptar.astro src/styles/components/dog-card.css src/styles/components/adoption-grid.css src/styles/components/filter-chips.css
npx eslint src/components/sections/AdoptionGrid.astro src/components/DogCard.astro src/pages/adoptar.astro
npx stylelint src/styles/components/dog-card.css src/styles/components/adoption-grid.css src/styles/components/filter-chips.css
npm run test:text
```

Do not run `npm run build`, `astro check`, or Playwright — a sibling agent shares this directory.

## Commit

```
feat(adoptar): make the listing an assessment surface with one primary card action
```

## Report to orchestrator

Which contact-fallback option you chose and why; every analytics event removed or relocated;
whether the stretched-link pattern survived the gallery; anything `[slug].astro` (T04) must match.
