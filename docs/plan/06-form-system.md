# Stage 06: Form system

## Objective

Establish one accessible, theme-aware form-state system for contact and foster-related forms without changing submission endpoints, privacy behavior, analytics, or field content.

## Required files and documentation to inspect

Read completely:

- `AGENTS.md`
- This stage file
- `docs/plan/audit.md`: “Forms,” shared-component forms, contact accessibility requirements
- `PRODUCT.md`
- `DESIGN.md`
- `docs/site-brief.md`
- `docs/voice-and-tone.md`
- `docs/spec.md`
- `docs/developer-reference.md`

After the required jCodeMunch opening sequence, inspect:

- `src/styles/components/form.css`
- `src/components/sections/ContactForm.astro`
- `src/components/sections/FosterPostular.astro`
- `src/scripts/form.ts`
- All form importers, field markup, endpoints, analytics hooks, and current browser/a11y tests
- Current native select styling and autofill overrides

## Exact scope

- Standardize 1px resting borders, 8px radius, neutral surfaces, 48px minimum control height, and minimum 16px input text.
- Implement theme-aware select indicators without a fixed light-theme encoded color.
- Define visible focus, invalid, helper, disabled, submitting, success, server/network-error, and autofill states.
- Ensure errors connect through `aria-describedby`, do not rely on color alone, and guide focus to the first invalid field.
- Ensure successful submission moves/announces focus appropriately and duplicate submission is prevented.
- Keep shared behavior reusable by the later foster and contact composition stages.

## Explicit non-goals

- Do not redesign the contact page layout; stage 15 owns it.
- Do not recompose the foster page or application area; stage 12 owns it.
- Do not change field labels, requiredness, endpoints, privacy copy, analytics events, or external contact destinations without an audited defect.
- Do not replace native controls with custom widgets.

## Implementation requirements

- Preserve native labels, autocomplete, keyboard behavior, and usable autofill.
- If `novalidate` remains, custom handling must fully cover required validation and accessible error association.
- Submitting state must disable duplicate submits without trapping focus.
- Success and failure live announcements must be concise.
- Form states must work in both explicit themes and at 200% zoom.
- Any markup/API change must be migrated across all form consumers in this commit.

## Constraints and invariants

- Preserve submission and analytics behavior, CSP, static route output, consent rules, and contact details.
- Maintain WCAG 2.2 AA, visible focus, 44px targets, and no horizontal overflow.
- Do not add dependencies or custom-control JavaScript.

## Relevant tests and visual checks

Run scoped format/lint, build, and focused browser/a11y tests for:

- Empty/invalid submission and first-invalid focus
- Error association and announcements
- Submitting/disabled behavior and duplicate-submit prevention
- Success and network/server failure
- Keyboard-only completion
- Autofill/select visibility in both themes

Inspect at 320, 768, and 1280px plus 200% zoom. Do not run the full suite or Lighthouse.

## Acceptance criteria

- All shared form states are visually and semantically defined in both themes.
- Errors remain understandable without color and are associated with the correct fields.
- Success/failure focus and announcements are usable.
- Duplicate submission is prevented.
- Existing endpoints, field content, privacy behavior, and analytics remain unchanged.

## Required commit message guidance

Create one focused commit:

`style: harden shared form states`
