# Stage 11: Dog profile

## Objective

Make each `/adoptar/[slug]/` page read as an individual portrait whose photograph and character lead before a single primary application action.

## Required files and documentation to inspect

Read completely:

- `AGENTS.md`
- This stage file
- `docs/plan/audit.md`: profile photography, action hierarchy, `/adoptar/[slug]/`
- `PRODUCT.md`
- `DESIGN.md`
- `docs/site-brief.md`
- `docs/voice-and-tone.md`
- `docs/content-model.md`
- `docs/spec.md`
- `docs/developer-reference.md`

Run the required jCodeMunch opening sequence and inspect:

- Integrated stage 10 listing/fact/action contract and stage 05 gallery
- `src/pages/adoptar/[slug].astro`
- `src/styles/components/dog-profile.css`
- Relevant `src/styles/components/dog-card.css` shared selectors
- `src/components/sections/AdoptionProcess.astro`
- `src/styles/components/adoption-process.css`
- `src/scripts/share-dog.ts`
- `src/utils/dog-content.ts`, responsive gallery helpers, structured-data builders
- `tests/dog-profile.spec.ts`, filter/gallery/source-hygiene/a11y/smoke coverage

Use Astro Docs MCP before changing `getStaticPaths`, image generation, or route behavior.

## Exact scope

- Increase portrait gallery dominance using a safe 7/5 or similar desktop relationship and stage 05’s portrait ratio.
- Use a sticky information column only on sufficiently tall/wide desktop where it does not obscure focus/content.
- Lead with name/current need, structured neutral facts, character sketch, then details.
- Keep application as the sole filled action, WhatsApp outlined, share/Instagram quiet utilities, and support reassurance directly beneath the primary actions.
- Reduce/remove the profile rainbow divider and make the repeated adoption process a compact follow-on section.
- Implement the audit’s mobile reading order without a fixed bottom bar.

## Explicit non-goals

- Do not change `getStaticPaths`, active-status logic, dog content, metadata, structured data, external form destination, WhatsApp text, tracking, sharing payload, or collection schema.
- Do not alter listing cards established by stage 10.
- Do not hide facts behind tabs/disclosures or add a fixed action bar.
- Do not change shared gallery internals.

## Implementation requirements

- One `h1`; sticky layout must not reorder/trap focus.
- Practical facts are scannable within five seconds and retain complete source values.
- Character sketch receives stronger hierarchy than generic details.
- Share success/failure remains announced through `aria-live`.
- Gallery/lightbox keyboard behavior and no-JavaScript first image remain intact.
- Support reassurance remains adjacent to actions.

## Constraints and invariants

- Preserve SEO/canonical/social metadata, structured data, generated routes, tracking, external-link primitives, static output, and image optimization.
- Do not invent or soften dog facts.
- Maintain WCAG AA, 44px targets, both themes, reduced motion, and no CLS.

## Relevant tests and visual checks

Run scoped format/lint, build, `tests/dog-profile.spec.ts`, relevant filter/gallery/source-hygiene/a11y/smoke checks.

Use the orchestrator-selected active profile plus one one-image and one multi-image profile if available. Inspect at 320, 430, 768, 1024, and 1280px in both themes. Test application, WhatsApp, share success/failure, Instagram, lightbox, sticky focus visibility, and mobile order.

Do not run full regression or Lighthouse.

## Acceptance criteria

- The page reads as an individual portrait, not an enlarged listing card.
- Photograph and character establish identity before the action stack.
- Application is the only filled action and facts scan quickly.
- Gallery, sharing, tracking, metadata, structured data, and support reassurance remain intact.
- Sticky behavior, if used, never obscures focus/content.

## Required commit message guidance

Create one focused commit:

`style: strengthen individual dog profiles`
