# Stage 15: Contact route

## Objective

Integrate direct contact channels and the form into one coherent communication surface so visitors can choose the right path immediately, with press information clearly secondary.

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

- Integrated stages 02–04 and 06
- `src/pages/contacto.astro`
- `src/components/sections/ContactChannels.astro`
- `src/styles/components/contact-channels.css`
- `src/components/sections/ContactForm.astro`
- `src/styles/components/form.css`
- `src/scripts/form.ts`
- `src/components/sections/PressSection.astro`
- Relevant form, analytics, consent, a11y, and smoke coverage

## Exact scope

- Use the start-aligned compact PageHero.
- Compose desktop as a 4/8 or 5/7 channel-context/form relationship; mobile channels first, then form.
- Replace promotional channel cards with direct rows containing channel, best use, and action.
- Align form heading/fields to the same grid and consume stage 06’s states without creating route-local variants.
- Keep press information visibly separate and lower priority.
- Ensure direct actions and form feel like one system with one clear submit action.

## Explicit non-goals

- Do not change contact details, channel destinations, response promises, form fields, labels, requiredness, endpoint, privacy copy, analytics, consent, or press content.
- Do not modify shared form behavior unless a verified defect is escalated to the orchestrator.
- Do not turn social channels into promotional cards.

## Implementation requirements

- Visitors can distinguish the best use of each channel without opening it.
- Channel actions use existing WhatsApp/external/tracked link primitives.
- Form states and focus/error behavior from stage 06 remain intact.
- Mobile reading/focus order is channels, form, then press.
- The submit button is the sole filled action within the form.
- Both themes preserve select indicator, autofill, validation, and network-error legibility.

## Constraints and invariants

- Preserve submission, analytics, consent, privacy, external-link semantics, labels, autocomplete, and static rendering.
- Maintain one `h1`, WCAG AA, 44px targets, visible focus, 200% zoom, and no horizontal overflow.

## Relevant tests and visual checks

Run scoped format/lint, build, focused form tests from stage 06, and relevant analytics/consent/a11y/smoke checks.

Inspect at 320, 430, 768, 1024, and 1280px in both themes and 200% zoom. Complete keyboard-only invalid, network-error, and success paths; verify first-invalid/success focus, channel ordering, and press de-emphasis.

Do not run full regression or Lighthouse.

## Acceptance criteria

- A visitor can immediately choose the appropriate channel or form.
- Direct channels and form read as one communication system.
- All form states remain functional and accessible in both themes.
- Press content is available but secondary.
- Submission, analytics, privacy, and contact details remain unchanged.

## Required commit message guidance

Create one focused commit:

`style: integrate contact channels and form`
