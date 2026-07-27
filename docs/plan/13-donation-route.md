# Stage 13: Donation route

## Objective

Turn `/donar/` into a documentary trust and financial-information experience where direct transfer is obvious, copy controls are accessible, and impact amounts do not resemble pricing tiers.

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
- `docs/spec.md`
- `docs/developer-reference.md`

Run the required jCodeMunch opening sequence and inspect:

- Integrated stages 02–04
- `src/pages/donar.astro`
- `src/components/sections/DonationCards.astro`
- `src/styles/components/donation-cards.css`
- `src/components/sections/ImpactSection.astro`
- `src/styles/components/impact-section.css`
- `src/components/sections/TrustStatsSection.astro` usage without taking homepage ownership
- `src/components/sections/HelpTailCta.astro`
- `src/scripts/copy-data.ts`
- Relevant analytics, copy, a11y, source-hygiene, and smoke coverage

## Exact scope

- Convert suggested amount cards into an impact ledger: four separated columns wide, two tablet, rows mobile.
- Remove multicolor rules, nested promotion cards, routine shadows/gradients, and pricing-tier cues.
- Make direct transfer the primary 7/5-style financial panel and recurring eSponsor secondary.
- Present bank details semantically, keep rows copyable, expose persistent 44px copy controls, and keep “Copiar todos los datos” the panel’s primary utility.
- Show visible success/failure near the triggering control while retaining concise `aria-live` announcements.
- Present impact/transparency with documentary headings, plain lists, separators, and confirmed figures; avoid another marketing CTA directly after financial details.

## Explicit non-goals

- Do not change amounts, bank values, RUT/account details, transparency claims, “Recomendado” status, eSponsor destination/logo asset, outbound tracking, or alternative support routes.
- Do not turn amounts into selectable packages.
- Do not alter homepage `TrustStatsSection` presentation owned by stage 08.
- Do not add payment processing or new donation channels.

## Implementation requirements

- Transfer details appear first on mobile; no horizontal bank table.
- Labels/values stay distinct, selectable, wrapping-safe, and exact.
- Copy controls work with mouse, touch, and keyboard and are never hover-only.
- Both single-row and copy-all success/failure behavior remain accessible.
- eSponsor contrast is verified in both themes.
- Orange remains reserved for the page’s principal conversion action, not every utility.

## Constraints and invariants

- Financial accuracy is absolute; compare rendered values against source before commit.
- Preserve analytics, external-link semantics, static rendering, CSP, consent, and confirmed organizational claims.
- Maintain WCAG AA, 44px targets, visible focus, both themes, and no duplicate copy actions.

## Relevant tests and visual checks

Run scoped format/lint, build, focused copy interaction tests, and relevant analytics/a11y/source-hygiene/smoke checks.

Inspect at 320, 430, 768, 1024, and 1280px in both themes. Test each copy control and copy-all with mouse, touch emulation, and keyboard; success/failure announcements; long value wrapping; and eSponsor contrast.

Do not run full regression or Lighthouse.

## Acceptance criteria

- Main donation method and complete copy path are obvious without visual searching.
- Amounts read as impact evidence, not pricing plans.
- Direct transfer clearly outranks recurring support.
- Copy interactions are persistent, keyboard-accessible, and visibly/semantically confirmed.
- Every financial detail, claim, destination, and tracking attribute remains exact.

## Required commit message guidance

Create one focused commit:

`style: clarify donation trust and transfer details`
