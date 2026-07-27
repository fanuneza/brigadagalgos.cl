# Stage 02: Typography, rhythm, and page heroes

## Objective

Create clear typographic roles and relationship-based section rhythm, then expose restrained `PageHero` variants so top-level routes can opt into content-driven introductions.

## Required files and documentation to inspect

Read completely:

- `AGENTS.md`
- This stage file
- `PRODUCT.md`
- `DESIGN.md`
- `docs/site-brief.md`
- `docs/voice-and-tone.md`
- `docs/feature-inventory.md`
- `docs/spec.md`
- `docs/architecture-map.md`

After the required jCodeMunch opening sequence, inspect:

- Stage 01’s integrated token/global contract
- `src/styles/global.css`
- `src/components/PageHero.astro`
- `src/styles/components/page-hero.css`
- Every current importer of `PageHero.astro`, including 404 and blog routes
- Shared section-title utilities and route CSS that overrides page-hero alignment or spacing
- Heading/a11y/build tests

## Exact scope

- Remove the global uppercase/black treatment from `h1`, `h2`, and `h3`.
- Apply explicit type roles using Barlow Condensed selectively and Barlow for humane supporting hierarchy.
- Implement reading/lead widths, balanced short display headings, and pretty wrapping for prose where supported.
- Replace universal section padding assumptions with compact, standard, and generous relationship classes/tokens.
- Add typed `PageHero` presentation variants equivalent to `editorial`, `conversion`, and `compact`, plus start/center alignment.
- Map routes intentionally: adoption/foster/donation to start-aligned conversion, success/why-galgos to start-aligned editorial, and contact to start-aligned compact.
- Preserve safe defaults for unaffected routes such as 404, FAQ, and blog.
- Remove default decorative PageHero gradients.

## Explicit non-goals

- Do not rewrite substantive copy merely to improve wrapping.
- Do not redesign the homepage `Hero.astro`; stages 08–09 own homepage content.
- Do not recompose route bodies.
- Do not restyle buttons, Navbar, Footer, galleries, forms, or cards.
- Do not introduce route-specific positioning overrides when a shared variant can express the requirement.

## Implementation requirements

- Sentence case must be the default; uppercase remains limited to genuine eyebrows, compact metadata, and short display labels.
- Page titles and major section titles may use Barlow Condensed; subsection/card/form/navigation headings use Barlow unless this stage explicitly grants a display role.
- Keep prose near 62–68ch and hero leads near 54–60ch.
- Maintain one meaningful `h1` per route and preserve semantic heading order.
- Variants must be typed, content-driven, and stable with or without CTA content.
- Verify all current importers before changing the props interface.

## Constraints and invariants

- Keep the existing font families, local delivery, fallback metrics, and performance behavior.
- Preserve route titles, metadata, structured data, page content, and PageLayout shell behavior.
- Do not use typography as decoration disconnected from content hierarchy.
- Do not create horizontal overflow at 320px or with long Spanish headings.

## Relevant tests and visual checks

Run scoped format/lint checks, a production build, and relevant accessibility/smoke checks.

Inspect every top-level route using `PageHero` at 320px, 768px, and 1280px in both themes. Verify:

- One `h1`, logical heading order, stable wrapping, no clipped words
- Sentence case outside intentional labels
- Appropriate start alignment and variant mapping
- Prose remains readable at 200% zoom
- Flat hero surfaces and consistent grid alignment

Do not run full regression or Lighthouse.

## Acceptance criteria

- Hierarchy remains understandable without relying on colored backgrounds or card frames.
- `PageHero` variants cover the specified route needs without one-off route positioning.
- All existing PageHero importers compile and unaffected routes retain safe behavior.
- No display heading overflows from 320px through wide desktop.
- Light and dark modes use the same typographic hierarchy.

## Required commit message guidance

Create one focused commit:

`style: define typography rhythm and page heroes`
