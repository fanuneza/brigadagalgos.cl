# Stage 09: Homepage guidance and conversion

## Objective

Complete the homepage with distinct editorial compositions for education, outcomes, process, help choices, and donation—without returning to repeated equal card grids or competing actions.

## Required files and documentation to inspect

Read completely:

- `AGENTS.md`
- This stage file
- `PRODUCT.md`
- `DESIGN.md`
- `docs/site-brief.md`
- `docs/voice-and-tone.md`
- `docs/prd.md`
- `docs/feature-inventory.md`

Run the required jCodeMunch opening sequence and inspect:

- Stage 08’s integrated homepage
- `src/pages/index.astro`
- `src/components/sections/WhyGalgosSection.astro`
- `src/components/StoriesSection.astro`
- Stage 07’s `StoryCard` contract
- `src/components/ProcessStepper.astro`
- `src/styles/components/stepper.css`
- `src/components/HelpCards.astro`
- `src/styles/components/help-cards.css`
- `src/components/DonationBanner.astro`
- `src/styles/components/donation-banner.css`
- `src/components/RainbowDivider.astro` usages on the homepage
- Homepage story/order, analytics, a11y, and smoke tests

## Exact scope

- Present Why galgos as concise editorial subsections separated by space/rules, optionally paired with current sourced imagery; avoid another equal-card grid.
- Compose homepage success stories as a two-column desktop editorial feature using stage 07’s shared story contract.
- Render process as a restrained numbered sequence with a continuous rule: vertical mobile, horizontal desktop, all text visible.
- Replace three differently colored help cards with a neutral border-separated composition distinguished by headings and action hierarchy.
- Flatten the donation ending into one decisive dark/neutral band with one primary action.
- Remove residual homepage glows, gradients, repeated rainbow dividers, universal lift, and competing CTA-card treatments within this owned sequence.

## Explicit non-goals

- Do not change process facts, help paths, story selection/count, substantive copy, donation destination, or analytics labels.
- Do not edit the homepage hero, featured dogs, mission, or evidence strip from stage 08.
- Do not change base `StoryCard`, shared gallery, or global controls.
- Do not add new imagery unless it is a current local/source-backed project asset and all existing content remains unchanged.

## Implementation requirements

- Active adoption stays more prominent than completed stories.
- Process order must remain semantic and visible without interaction.
- Adoption, foster, and donation options differ by purpose and copy, not three saturated card colors.
- Each grouping has one dominant action and accessible tertiary links.
- Mobile has no horizontally scrolling core content; process becomes a vertical sequence.
- Dark mode uses neutral surface shifts with no glow.

## Constraints and invariants

- Preserve section order, story rules, routes, tracking, external-link primitives, responsive images, and static rendering.
- Do not invent proof, outcomes, or claims.
- Maintain reduced motion, 44px targets, visible focus, and WCAG AA.

## Relevant tests and visual checks

Run scoped format/lint, build, `tests/stories-section.spec.ts`, and relevant analytics/a11y/smoke checks.

Inspect the full homepage at 320, 768, 1024, 1280, and 1440px in both themes. Confirm at least three major homepage sections use compositions other than equal rounded-card grids, the process is readable, actions remain ordered, and no routine container lifts on hover.

Do not run full regression or Lighthouse.

## Acceptance criteria

- The complete homepage reads as one directed narrative, not a stack of independent framed components.
- Why, stories, process, help, and donation are visibly distinct content types.
- No owned section uses decorative glow or routine elevation.
- All routes, story selection, copy, tracking, and outcomes remain unchanged.

## Required commit message guidance

Create one focused commit:

`style: refine homepage guidance and conversion`
