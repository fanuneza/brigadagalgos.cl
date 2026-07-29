# Task 06 — Replace hand-built gallery HTML strings with Astro components

## Goal

Eliminate the `set:html` + manual string-escaping gallery pipeline in favor of real Astro components — the component model is the idiomatic Astro pattern and removes a whole class of escaping bugs.

## Current state

- `src/utils/gallery.ts` builds gallery markup as HTML STRINGS (manual `escapeAttribute`, hand-written `<picture>`/`<img>` markup with fixed `width="350" height="350"`).
- `src/components/SharedPhotoGallery.astro` injects those strings via `<Fragment set:html={...} />`.
- `src/components/SharedGalleryLightbox.astro` consumes the same pipeline; `src/scripts/gallery/*` and `init-shared-gallery.ts` attach behavior to the generated DOM (selectors matter!).
- Fixed 350×350 dimensions assume an aspect ratio the source photos may not have.

## Astro docs reference

- https://docs.astro.build/en/guides/images/ — `<Image>`/`<Picture>` are the supported way to emit optimized images; escaping, width/height, loading/decoding are handled by the framework.
- `set:html` docs warn it bypasses Astro's escaping and component model — reserve for trusted CMS content, which this is not.

## Changes

1. Refactor `SharedPhotoGallery.astro` to accept typed props (`images: { src: ImageMetadata; alt: string }[]` plus gallery id/options) and render items in an `.astro` loop with `<Image>` (or `<Picture>`), emitting the SAME DOM structure/classes/data-attributes the client scripts query.
2. Keep `src/utils/gallery.ts` only for non-HTML logic (data shaping, alt derivation); delete string-building and `escapeAttribute` usage.
3. Update `init-shared-gallery.ts` / `gallery/dom.ts` ONLY if selectors change — prefer keeping selectors byte-identical so no JS change is needed.
4. Emit real intrinsic `width`/`height` from the image metadata (or preserve the 350×350 crop via `widths`/explicit `width`/`height` on `<Image>`) — do not silently change visual sizing.
5. Verify `SharedGalleryLightbox` still receives correct full-size URLs (data attributes or however it currently discovers them).

## Acceptance criteria

- No `set:html` remains in `src/components/SharedPhotoGallery.astro` (grep proves it).
- Gallery behavior unchanged: lightbox opens, carousel navigates, keyboard/focus behavior intact — covered by existing Playwright specs (`tests/dog-profile.spec.ts` and gallery-related specs) plus manual preview.
- `npm run build && npm test && npm run test:lighthouse` green.
- HTML output validates (seo-graph `validateImageAlt` still passes; alt text preserved).
