# Stage 16: Collaborators and supporter trust

## Objective

Present collaborators as sourced institutional support on calm neutral stages, not a decorative card grid or commercial sponsor wall.

## Required files and documentation to inspect

Read completely:

- `AGENTS.md`
- This stage file
- `docs/plan/audit.md`: “Foundation and trust presentation,” collaborators/supporters requirements, color/depth policy
- `PRODUCT.md`
- `DESIGN.md`
- `docs/site-brief.md`
- `docs/voice-and-tone.md`
- `docs/content-model.md`
- `docs/feature-inventory.md`
- `docs/spec.md`

Run the required jCodeMunch opening sequence and inspect:

- Integrated stages 02–04
- `src/pages/colaboradores.astro`
- `src/styles/components/colaboradores.css`
- `src/components/sections/SupportersIntro.astro`
- `src/styles/components/supporters-intro.css`
- `src/components/sections/SupportersCtaSection.astro`
- Supporter collection schema/content and local logo assets
- UTM/tracking helpers in the collaborators route
- Relevant source-hygiene, analytics, a11y, and smoke tests

## Exact scope

- Use a calm, start-aligned introduction consistent with the shared hero system.
- Replace decorative supporter cards/shadows with neutral logo stages, restrained borders/separators, and consistent intrinsic logo sizing.
- Preserve source grouping/kind distinctions when present without assigning a saturated color to every kind.
- Keep supporting copy/captions clear about what the logos represent.
- Normalize the ending support CTA to the shared action hierarchy without competing with page-specific donation paths.

## Explicit non-goals

- Do not add/remove/reorder supporters, change collection schema, edit names, logo files, `logoAlt`, URLs, kind values, UTM parameters, tracking, or claims.
- Do not modify homepage statistics or mission; stage 08 owns them.
- Do not modify Footer legal identity; stage 04 owns it.
- Do not turn the page into a commercial sponsor wall or introduce remote logos/CDNs.

## Implementation requirements

- Logos keep intrinsic ratio and remain legible on neutral stages in both themes.
- Alt text and linked-logo accessible names remain correct and non-duplicative.
- Single-supporter and multi-supporter layouts remain intentional.
- External links retain centralized semantics and partner UTM behavior.
- Visual hierarchy comes from spacing, type, and grouping rather than shadows or multiple accent colors.

## Constraints and invariants

- Keep logos local and content collection–driven.
- Preserve all source facts, `logoAlt`, kinds, destinations, tracking, static rendering, and responsive behavior.
- Maintain WCAG AA, visible focus, 44px linked targets where applicable, and no image distortion.

## Relevant tests and visual checks

Run scoped format/lint, build, and relevant source-hygiene/analytics/a11y/smoke checks.

Inspect single and multiple-logo states where fixtures/current content permit, at 320, 768, and 1280px in both themes. Verify intrinsic sizing, contrast, linked focus, alt/accessibility names, UTM destinations, and no commercial-card appearance.

Do not run full regression or Lighthouse.

## Acceptance criteria

- Collaborators read as sourced institutional trust rather than promotional products.
- Logos remain local, undistorted, accessible, and consistently staged.
- Names, `logoAlt`, kinds, destinations, UTM/tracking, and content behavior are unchanged.
- The route fits the shared visual system without taking ownership of homepage or Footer trust content.

## Required commit message guidance

Create one focused commit:

`style: refine collaborator and supporter trust`
