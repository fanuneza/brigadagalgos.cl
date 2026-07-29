# Task 05 — Adopt responsive image layouts (`image.responsiveStyles`, `layout`)

## Goal

Replace hand-rolled `getImage()` srcset plumbing with Astro's built-in responsive images where the manual code adds no value, and enable global responsive styles. Keep bespoke code only where it is genuinely bespoke (art-directed hero, lightbox).

## Current state

- `src/utils/responsive-gallery-images.ts` manually calls `getImage()` to build card AVIF srcsets (360/480/640 q50, WebP 480 fallback q72) and lightbox AVIF 1200 q65.
- `src/pages/index.astro` hand-builds hero portrait/landscape AVIF+WebP srcsets plus `<link rel="preload" as="image" imagesrcset>` with `fetchpriority="high"`.
- `<Image>` used in `colaboradores.astro`, `blog/index.astro`, `blog/[id].astro`; `<Picture>` in `WhyGalgosEditorial.astro` — without `layout`, so no automatic srcset/sizes.
- No `image` block in `astro.config.mjs` (no `responsiveStyles`).

## Astro docs reference

- https://docs.astro.build/en/guides/images/#responsive-image-behavior — `layout="constrained" | "full-width" | "fixed"` on `<Image>`/`<Picture>` auto-generates srcset + sizes (astro >= 5.10).
- https://docs.astro.build/en/guides/images/#responsive-image-styles — `image.responsiveStyles: true` applies zero-specificity (`:where()`) global resize styles; trivially overridable by site CSS.

## Changes

1. `astro.config.mjs`: add `image: { responsiveStyles: true }`.
2. Dog/story cards (`DogCard.astro`, `StoryCard.astro` and the helpers in `responsive-gallery-images.ts` feeding them): switch to `<Image layout="constrained" widths={[360, 480, 640]} sizes="..." formats={['avif','webp']}>` (or `<Picture>`), preserving current quality targets and emitted widths so LCP/bandwidth do not regress. Delete the dead parts of `responsive-gallery-images.ts`.
3. `blog/index.astro` and `blog/[id].astro` hero images: add `layout="constrained"` with explicit `widths`/`sizes` matching current breakpoints.
4. `colaboradores.astro` supporter logos: keep small fixed-size `<Image>` but verify width/height attributes remain (CLS).
5. Homepage hero: KEEP the art-directed manual `<picture>` + preload (portrait/landscape crops are a legitimate bespoke case), but reconcile it with the new global styles (ensure no double `width:100%` conflicts).
6. Lightbox large image: keep or migrate at implementer's discretion; if kept manual, add a short comment saying why.

## Acceptance criteria

- `dist/` page weight for `/adoptar/` and `/` does not increase materially (compare before/after `_astro` image bytes per page).
- No CLS regression: `npm run test:lighthouse` green.
- Card grid renders identically (visual check via `npm run capture:*` if available, otherwise manual preview).
- `npm run build && npm test` green; dead helper code removed without breaking imports (`npm run lint`).
