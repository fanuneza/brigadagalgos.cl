# Stage 05: Gallery and photography system

## Objective

Make photography the primary visual asset by giving the shared gallery flexible portrait/editorial ratios and quieter controls while preserving responsive images, progressive enhancement, gestures, and lightbox accessibility.

## Required files and documentation to inspect

Read completely:

- `AGENTS.md`
- This stage file
- `PRODUCT.md`
- `DESIGN.md`
- `docs/site-brief.md`
- `docs/spec.md`
- `docs/content-model.md`
- `docs/architecture-map.md`
- `docs/developer-reference.md`

Run the required jCodeMunch opening sequence and inspect:

- `src/components/SharedPhotoGallery.astro`
- `src/components/SharedGalleryLightbox.astro`
- `src/styles/components/shared-gallery.css`
- `src/scripts/gallery/` and `src/scripts/init-shared-gallery.ts`
- `src/utils/responsive-gallery-images.ts`
- `src/utils/dog-content.ts`
- All gallery importers and tests in `filter-chips.spec.ts`, `stories-section.spec.ts`, dog-profile/browser/a11y coverage

Use Astro Docs MCP before changing Astro image handling, responsive sources, or asset APIs.

## Exact scope

- Add a typed ratio/presentation contract that supports adoption listing 4:5, profile portrait, success story 4:5 or 3:4, and editorial supporting media without duplicated markup.
- Reduce arrow/pagination chrome and support a compact image count where it reduces noise.
- Render navigation/count only when multiple images exist.
- Keep 44px control targets while reducing visual weight.
- Remove routine gallery/media shadows and idle `will-change` where safe.
- Preserve the server-rendered first image and no-JavaScript visibility.
- Verify touch gestures do not block vertical scrolling.

## Explicit non-goals

- Do not recompose adoption cards, profiles, story cards, or homepage sections.
- Do not rename, recrop, replace, or add dog assets.
- Do not change the three-image content limit, alt text sources, captions, or image transformation quality without a documented need.
- Do not add a carousel library, client framework, CDN, or hydration.

## Implementation requirements

- Ratio differences must be expressed through props/custom properties with one shared implementation.
- Preserve responsive AVIF/WebP generation, intrinsic dimensions, focal positioning, and zero-CLS image loading.
- Lightbox keyboard path, focus restoration, Escape, backdrop behavior, and accessible names must remain intact.
- One-image galleries must not expose inert arrows/count controls.
- Multi-image controls must work with keyboard, pointer, and touch.
- Content remains usable if JavaScript fails.

## Constraints and invariants

- Preserve collection-driven galleries, local imported assets, gallery payload shape unless safely migrated across all consumers, and analytics behavior.
- Do not dim photographs automatically in dark mode or add decorative overlays.
- Maintain performance, static rendering, and reduced-motion support.

## Relevant tests and visual checks

Run scoped format/lint, build, and the existing gallery-related browser tests. Add or update focused tests for ratio variants, one/two/three images, no-JavaScript first image, control conditionality, and lightbox keyboard behavior when current coverage is insufficient.

Visually check portrait and landscape source images at 320, 768, and 1280px in both themes. Verify face visibility, control contrast, vertical scroll gestures, no clipping, and no CLS.

Do not run full regression or Lighthouse; record any LCP/CLS concern for the orchestrator’s final validation.

## Acceptance criteria

- Adoption, profile, success, and editorial ratios are supported without duplicated gallery markup.
- Photography is visually stronger than its controls or container treatment.
- First images remain available without JavaScript.
- Controls meet target size, appear only when useful, and lightbox keyboard behavior remains intact.
- No image-loading layout shift or new client dependency is introduced.

## Required commit message guidance

Create one focused commit:

`style: refine shared gallery and photo ratios`
