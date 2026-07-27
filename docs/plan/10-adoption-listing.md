# Stage 10: Adoption listing

## Objective

Make `/adoptar/` easy to scan for suitability and identity, with profile viewing dominant and the gallery/actions quieter, while preserving all dog data, filters, tracking, and generated URLs.

## Required files and documentation to inspect

Read completely:

- `AGENTS.md`
- This stage file
- `PRODUCT.md`
- `DESIGN.md`
- `docs/site-brief.md`
- `docs/voice-and-tone.md`
- `docs/content-model.md`
- `docs/feature-inventory.md`
- `docs/spec.md`
- `docs/developer-reference.md`

Run the required jCodeMunch opening sequence and inspect:

- Integrated stages 02, 03, and 05
- `src/pages/adoptar.astro`
- `src/components/sections/AdoptionIntro.astro`
- `src/components/sections/AdoptionGrid.astro`
- `src/styles/components/adoption-intro.css`
- `src/styles/components/adoption-grid.css`
- `src/styles/components/filter-chips.css`
- `src/styles/components/dog-card.css`
- `src/scripts/filter-chips.ts`
- `src/utils/dog-content.ts`
- `tests/filter-chips.spec.ts`, dog-content/profile, source-hygiene, gallery, a11y, and smoke coverage

## Exact scope

- Increase filter targets to at least 44px, use modest radius/resting border, preserve `aria-pressed`, and keep result count adjacent.
- Make grid wrapping preserve approximately 340px card width; avoid forced narrow three-column layouts.
- Use the shared 4:5 listing gallery ratio and quieter image count/navigation.
- Replace four colored chips with a neutral sex/age/weight fact row or definition list plus one distinct current-need status.
- Make image/name/profile link and “Ver ficha de [nombre]” dominant; application secondary; WhatsApp assistance tertiary; Instagram metadata-level.
- Use border-only modest-radius surfaces with no routine shadow or lift.

## Explicit non-goals

- Do not change filter categories/logic, active/hidden status behavior, result semantics, dog copy, facts, URLs, application/WhatsApp/Instagram destinations, tracking labels, or collection schema.
- Do not infer compatibility, health, urgency, or medical information.
- Do not redesign the dog profile; stage 11 owns it.
- Do not change gallery internals owned by stage 05.

## Implementation requirements

- Cards remain semantic `article` elements and hidden cards are neither announced nor focusable.
- Preserve `content-visibility` only if keyboard navigation and intrinsic sizing remain correct.
- Description treatment must not create inaccessible truncation.
- Name and image clearly lead to the profile.
- No card contains more than one saturated status treatment.
- Gallery controls must retain 44px targets without obscuring the dog’s face.

## Constraints and invariants

- All active dogs, source facts, status logic, generated profile URLs, tracking, external-link behavior, and three-image limits remain unchanged.
- Maintain static rendering, responsive image optimization, no-JavaScript first images, both themes, and WCAG AA.

## Relevant tests and visual checks

Run scoped format/lint, build, `tests/filter-chips.spec.ts`, `tests/dog-content.test.ts`, relevant dog-profile/source-hygiene/gallery/a11y/smoke checks.

Test filters, count announcements, empty state, keyboard order, and every current card at 320, 375, 680, 768, 1024, 1280, and 1440px in both themes. Verify no narrow forced three-column layout, no face-obscuring controls, and stable focus after filtering.

Do not run full regression or Lighthouse.

## Acceptance criteria

- Filter targets meet 44px and filtering/count behavior is unchanged.
- Cards no longer resemble e-commerce product tiles.
- Profile viewing is unmistakably dominant and only one saturated status appears.
- Gallery remains usable without becoming the strongest interface element.
- All dogs, facts, status logic, tracking, and URLs remain exact.

## Required commit message guidance

Create one focused commit:

`style: recompose the adoption listing`
