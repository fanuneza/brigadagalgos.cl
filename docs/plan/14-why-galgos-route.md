# Stage 14: Why galgos route

## Objective

Make `/por-que-galgos/` a calm, authoritative, reading-focused explanation where caveats remain visible and success cases support rather than interrupt the argument.

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
- `docs/content-model.md`

Run the required jCodeMunch opening sequence and inspect:

- Integrated stages 02–05 and 07
- `src/pages/por-que-galgos.astro`
- `src/components/sections/WhyGalgosEditorial.astro`
- `src/styles/components/por-que-galgos.css`
- `src/components/sections/CasesBand.astro`
- `src/components/sections/NextStepCta.astro`
- Shared story/gallery contracts and structured-data/config sources containing related facts
- Relevant story, source-hygiene, a11y, and smoke tests

## Exact scope

- Use the start-aligned editorial PageHero and aggressive but readable line-length limits.
- Visually differentiate daily life, compatibility caveats, and rescue-focus rationale through spacing, rules, hierarchy, and current sourced photography—not repeated cards.
- Keep essential caveats visible without JavaScript/disclosures.
- Present selected success cases as supporting evidence using stage 07’s editorial story contract.
- Give the final adoption/contact choice one dominant, non-coercive treatment.

## Explicit non-goals

- Do not alter substantive claims, caveats, FAQs, structured-data copy, case selection/count, dog stories, or routes.
- Do not universalize breed behavior or invent compatibility/medical information.
- Do not edit base story/gallery/global components owned by earlier stages.
- Do not add a new editorial content system or route.

## Implementation requirements

- Body reading width remains approximately 62–68ch and headings stay compact on mobile.
- Supporting images remain close to the text they evidence and preserve sourced alt text.
- Case stories support the argument and remain less urgent than active adoption.
- Final action is clear, singular, and uses existing link/tracking primitives.
- Dark mode uses neutral surfaces and borders with no glow.

## Constraints and invariants

- Preserve all current caveats, claims, collection behavior, structured data, metadata, galleries, external links, and static rendering.
- Maintain one `h1`, semantic heading order, WCAG AA, reduced motion, both themes, and no essential hidden content.

## Relevant tests and visual checks

Run scoped format/lint, build, relevant story/source-hygiene/a11y/smoke checks.

Read the entire route at 320, 430, 768, 1024, and 1280px in both themes and at 200% zoom. Verify caveats remain visible, paragraphs do not become overwide, images remain contextually attached, and the case band does not read as a catalogue.

Do not run full regression or Lighthouse.

## Acceptance criteria

- The route feels authoritative, calm, and readable.
- Daily life, caveats, and rescue rationale are clearly differentiated without card proliferation.
- Case stories support rather than interrupt the argument.
- Content, caveats, claims, structured data, and case behavior remain unchanged.

## Required commit message guidance

Create one focused commit:

`style: focus the why galgos editorial route`
