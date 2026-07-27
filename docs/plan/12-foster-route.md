# Stage 12: Foster route

## Objective

Make `/hogar-temporal/` feel supportive and immediately understandable by replacing repeated boxes with structured guidance, a clear responsibility comparison, and one focused application area.

## Required files and documentation to inspect

Read completely:

- `AGENTS.md`
- This stage file
- `docs/plan/audit.md`: Foster page, process, forms, mobile/dark requirements
- `PRODUCT.md`
- `DESIGN.md`
- `docs/site-brief.md`
- `docs/voice-and-tone.md`
- `docs/prd.md`
- `docs/feature-inventory.md`
- `docs/spec.md`

Run the required jCodeMunch opening sequence and inspect:

- Integrated stages 02–04 and 06
- `src/pages/hogar-temporal.astro`
- `src/components/sections/FosterRequirements.astro`
- `src/components/RequirementCard.astro`
- `src/styles/components/hogar-temporal.css`
- `src/styles/components/requirement-card.css`
- `src/components/ProcessStepper.astro`
- `src/styles/components/stepper.css`
- `src/components/sections/FosterPostular.astro`
- Relevant form, a11y, analytics, and smoke tests

## Exact scope

- Use the start-aligned conversion hero and keep the foster CTA dominant.
- Convert requirement cards into a three-part guidance row/list for safety, time, and coexistence/supplies with simple unfilled line icons and separators.
- Consolidate safety notes into one clearly labeled, non-alarmist advisory block.
- Present “Brigada cubre” and “Tú aportas” as a strong two-column comparison with neutral differentiation and central separator; stack coherently on mobile.
- Simplify the process to the shared restrained numbered sequence.
- End with one clearly framed application/contact area using stage 06 form/action contracts.

## Explicit non-goals

- Do not change requirements, policies, responsibility details, process order, contact destinations, form fields/endpoints, or substantive copy.
- Do not change the shared form system or global ProcessStepper API unless the orchestrator explicitly reassigns that boundary.
- Do not make foster visually identical to adoption.
- Do not communicate any requirement only through color/iconography.

## Implementation requirements

- Mobile requirements use separators, not stacked decorative cards.
- Comparison labels and content remain immediately comparable and preserve exact policy facts.
- Safety treatment is distinct but calm and accessible.
- Primary CTA is full width on narrow mobile; other actions remain visibly secondary.
- Avoid colored icon circles, shadows, saturated tones, and icon-heavy layouts.

## Constraints and invariants

- Preserve form/analytics behavior, route metadata, static output, consent, external links, and all confirmed policy content.
- Maintain both themes, WCAG AA, reduced motion, 44px targets, semantic headings, and no horizontal overflow.

## Relevant tests and visual checks

Run scoped format/lint, build, relevant form/a11y/analytics/smoke checks.

Inspect at 320, 430, 768, 1024, and 1280px in both themes. Verify quick comparison of responsibilities, logical reading order, process visibility, advisory contrast, and the complete application path.

Do not run full regression or Lighthouse.

## Acceptance criteria

- The page feels supportive rather than bureaucratic.
- “Brigada cubre” and “Tú aportas” compare immediately on desktop and mobile.
- Requirement/policy content and form behavior are unchanged.
- No requirement relies on color alone.
- One application/contact area clearly ends the route.

## Required commit message guidance

Create one focused commit:

`style: clarify the foster guidance route`
