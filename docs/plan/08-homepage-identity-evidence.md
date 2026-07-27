# Stage 08: Homepage identity and evidence

## Objective

Recompose the homepage opening through the mission/evidence sequence so photography, identity, practical facts, and one clear adoption action establish trust without decorative overload.

## Required files and documentation to inspect

Read completely:

- `AGENTS.md`
- This stage file
- `docs/plan/audit.md`: Homepage hero, featured dogs, mission, trust statistics, photography, action hierarchy
- `PRODUCT.md`
- `DESIGN.md`
- `docs/site-brief.md`
- `docs/voice-and-tone.md`
- `docs/prd.md`
- `docs/feature-inventory.md`
- `docs/architecture-map.md`

Run the required jCodeMunch opening sequence and inspect:

- Integrated stages 02–05 and 07
- `src/pages/index.astro`
- `src/components/Hero.astro`
- `src/styles/components/hero.css`
- `src/components/sections/FeaturedAdoptionDogs.astro`
- `src/styles/components/featured-adoption-dogs.css`
- `src/components/MissionSection.astro`
- `src/styles/components/mission.css`
- `src/components/sections/TrustStatsSection.astro`
- `src/styles/components/trust-stats.css`
- `src/styles/components/home.css`
- Homepage story/order tests, dog-content utilities, responsive image helpers, a11y/smoke coverage

Use Astro Docs MCP before changing image handling.

## Exact scope

- Flatten the homepage hero; remove layered gradients, multicolor photo glow, rotation/lift, paw emoji, floating pill treatment, and decorative entrance motion.
- Preserve the split composition but increase photo prominence and use the shared media-radius/ratio contract.
- Keep adoption primary, foster secondary, and support reassurance attached to the actions.
- Preserve the three-dog preview; use portrait imagery, quieter facts, profile-first action hierarchy, and no elevation.
- Recompose mission as a left-aligned 4/7-style desktop heading/prose relationship and replace value tags with a restrained line/list.
- Replace homepage statistic cards with one evidence strip using separators, consistent values, and neutral/one-accent treatment.

## Explicit non-goals

- Do not change homepage section order, featured-dog selection logic, hero-dog selection, dog data, URLs, alt text sources, or substantive copy.
- Do not modify lower homepage why/stories/process/help/donation sections; stage 09 owns them.
- Do not change base story cards owned by stage 07 or gallery behavior owned by stage 05.
- Do not turn the preview into the full adoption catalogue.

## Implementation requirements

- Mobile hero order: title, lead, image, actions, support.
- Exactly one action reads primary in the opening viewport.
- Dog preview facts must not use four saturated chips; preserve source facts without inventing compatibility.
- Profile viewing is dominant on preview cards, application secondary, assistance tertiary.
- Evidence strip uses vertical separators on desktop and horizontal separated rows on mobile.
- Maintain deterministic homepage preview requirements currently protected by the project; do not introduce pagination or client rendering.

## Constraints and invariants

- Preserve static rendering, content collections, active-status logic, tracking, responsive images, structured data, and post-adoption support messaging.
- No decorative JavaScript, new dependency, layout shift, or image dimming.
- Both themes and all focus/target requirements remain first-class.

## Relevant tests and visual checks

Run scoped format/lint, build, homepage story/order tests, dog-content tests, relevant gallery/a11y/smoke checks.

Compare baseline at 320, 375, 768, 1024, 1280, and 1440px in both themes. Verify the initial viewport contains no blur/multicolor gradient, photography dominates its frame, only adoption is primary, dog preview remains three items, and evidence reflows to rows.

Do not run full regression or Lighthouse.

## Acceptance criteria

- Homepage opening feels photographic and editorial rather than effect-driven.
- One primary action is unambiguous.
- Featured dogs remain a three-dog preview and read as individual profiles.
- Mission and evidence use different compositions from card grids.
- Selection logic, content, tracking, images, and routes are unchanged.

## Required commit message guidance

Create one focused commit:

`style: recompose homepage identity and evidence`
