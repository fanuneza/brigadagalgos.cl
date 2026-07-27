# Stage 03: Actions and links

## Objective

Make only genuine actions look like controls by establishing one restrained, accessible button/link hierarchy without changing destinations, analytics, or conversion logic.

## Required files and documentation to inspect

Read completely:

- `AGENTS.md`
- This stage file
- `PRODUCT.md`
- `DESIGN.md`
- `docs/site-brief.md`
- `docs/voice-and-tone.md`
- `docs/spec.md`
- `docs/developer-reference.md`

Run the required jCodeMunch opening sequence and inspect:

- Stages 01–02’s integrated `src/styles/tokens.css` and `src/styles/global.css`
- `src/components/TrackedLink.astro`
- `src/components/ExternalLink.astro`
- `src/components/WhatsAppLink.astro`
- `src/components/InstagramLink.astro`
- Route/component-specific `.btn` and link overrides and their importers
- Analytics/source-hygiene tests that protect outbound-link behavior

## Exact scope

- Flatten primary buttons to orange with dark text, modest radius, no gradient, default shadow, lift, or translate animation.
- Standardize secondary and tertiary treatments, disabled/loading states, icon sizing, minimum heights, and focus rings.
- Keep body links underlined and make isolated tertiary actions meet target-size requirements.
- Remove broad component-specific button overrides only when the shared semantic hierarchy fully replaces them.
- Preserve centralized external indicators and new-tab behavior.

## Explicit non-goals

- Do not change CTA wording, hrefs, UTM values, tracking labels, form endpoints, WhatsApp messages, or analytics metadata.
- Do not choose which route action is primary; route stages own contextual hierarchy.
- Do not restyle Navbar/Footer compositions; stage 04 owns them.
- Do not implement form state behavior; stage 06 owns it.
- Do not replace shared link primitives with inline anchors.

## Implementation requirements

- Primary controls: flat orange, dark foreground, 48px minimum height, 8px radius, no routine shadow/translation.
- Secondary controls: transparent or neutral surface with strong neutral/cyan border and equivalent target size.
- Tertiary actions: visible underline and at least 44px interaction area when isolated.
- Focus must remain obvious in both themes and not depend on color alone.
- Loading/disabled states must be explicit and must not create accidental duplicate interaction.
- Shared link components’ semantic and tracking contracts must be unchanged.

## Constraints and invariants

- GTM remains the only GA4 delivery path and consent behavior is untouched.
- External/new-tab indicators, `rel`, and analytics attributes remain centralized.
- Do not introduce decorative JavaScript or dependencies.
- Maintain WCAG 2.2 AA contrast and 44px minimum targets.

## Relevant tests and visual checks

Run scoped formatting/linting, build, and relevant source-hygiene/analytics checks. Inspect representative buttons and links on `/`, `/adoptar/`, `/donar/`, and `/contacto/` at mobile and desktop widths in both themes.

Verify focus, hover, active, disabled, and loading appearances; external indicators; icon alignment; and no layout shifts. Do not run full regression or Lighthouse.

## Acceptance criteria

- No shared primary button uses a gradient, pill radius, routine shadow, or translate animation.
- Secondary and tertiary actions remain clearly distinct and accessible.
- Focus rings and targets meet requirements in both themes.
- Existing outbound tracking, destinations, and new-tab semantics are unchanged.
- Later route stages can express one primary action without inventing new button systems.

## Required commit message guidance

Create one focused commit:

`style: clarify shared action and link hierarchy`
