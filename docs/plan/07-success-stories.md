# Stage 07: Success-story presentation

## Objective

Give adopted-dog stories an editorial outcome-focused presentation that is clearly distinct from active adoption listings, while preserving content rules, galleries, and attribution.

## Required files and documentation to inspect

Read completely:

- `AGENTS.md`
- This stage file
- `docs/plan/audit.md`: success-story photography, `/casos-de-exito/`, card-family separation, content/performance constraints
- `PRODUCT.md`
- `DESIGN.md`
- `docs/site-brief.md`
- `docs/voice-and-tone.md`
- `docs/content-model.md`
- `docs/feature-inventory.md`
- `docs/spec.md`

Run the required jCodeMunch opening sequence and inspect:

- Integrated stages 02, 03, and 05
- `src/pages/casos-de-exito.astro`
- `src/components/StoryCard.astro`
- `src/components/StoriesSection.astro`
- `src/styles/components/stories.css`
- `src/utils/story-card-copy.ts`
- Success-dog collection schema/content flow
- `tests/stories-section.spec.ts`, source-hygiene, gallery, a11y, and smoke coverage

## Exact scope

- Change the archive to one column on mobile and two editorial columns on desktop.
- Use the shared portrait gallery ratio and quieter gallery controls.
- Flatten the story presentation to image, natural-name heading, readable story, restrained adopted marker, and quiet Instagram attribution.
- Remove glow, gradient, routine shadow, hover lift, uppercase names, and product-card cues.
- Keep the archive ending adoption CTA subordinate to active-dog routes.
- Establish the base `StoryCard`/`stories.css` contract that homepage stage 09 will compose without redefining the card.

## Explicit non-goals

- Do not edit story content, summaries, collection schema, story limits, adoption-outcome wording, order/shuffle behavior, Instagram URLs, or gallery data.
- Do not redesign homepage section sequencing.
- Do not make completed stories as visually urgent as active dogs.
- Do not change the shared gallery implementation owned by stage 05.

## Implementation requirements

- The adopted marker may use restrained green text but not a large celebratory badge.
- Full archive stories remain readable and must not be hidden behind interaction.
- Preserve `story-card-copy.ts` behavior and the 260-character UI/content contract.
- Maintain lightbox, Instagram, alt text, and no-JavaScript first-image behavior.
- Use neutral alternate surfaces and spacing/separators instead of elevation.

## Constraints and invariants

- Do not invent outcomes, dates, compatibility, or testimonials.
- Preserve collection loading, three-image limit, static rendering, SEO, tracking, and external-link semantics.
- Maintain one `h1`, logical headings, WCAG AA, focus visibility, and both themes.

## Relevant tests and visual checks

Run scoped format/lint, build, `tests/stories-section.spec.ts`, relevant source-hygiene/gallery/a11y checks, and add focused coverage only where the new stable contract needs it.

Inspect archive cards with one/two/three images at 320, 768, and 1280px in light/dark themes. Verify full story readability, quiet controls, natural names, and clear outcome distinction.

Do not run full regression or Lighthouse.

## Acceptance criteria

- Completed stories read as individual outcomes, not available-dog products.
- Desktop uses two editorial columns, mobile one.
- Story limits/outcome rules, gallery, Instagram, and content behavior are unchanged.
- Active adoption remains visually more urgent.
- `StoryCard` is ready for homepage composition without duplicate visual rules.

## Required commit message guidance

Create one focused commit:

`style: give success stories an editorial treatment`
