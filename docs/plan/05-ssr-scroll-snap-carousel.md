# Task 05 — Server-rendered scroll-snap carousel

- **Wave:** 3 (branch `wave-3/ssr-carousel`, off `main` after wave 2 is merged)
- **Depends on:** wave 2 merged
- **Commit message:** `feat(gallery): server-render carousel with CSS scroll-snap`

## Goal

Replace the client-built carousel with fully server-rendered slides navigated by CSS
`scroll-snap`. The gallery works end-to-end with JavaScript disabled; the per-card
`data-gallery-payload` JSON blob disappears from the HTML (29 payloads on
`/casos-de-exito/` today). This task deliberately keeps a functional lightbox — task 06
rebuilds it — so the old lightbox script may be trimmed but the open interaction must not
regress mid-wave.

## Background (current implementation)

- `src/components/SharedPhotoGallery.astro` SSRs only slide 1 and embeds all photos as
  JSON in `data-gallery-payload`; prev/next buttons and an empty dots pill are always
  rendered and only hidden by JS for single-photo galleries (dead UI without JS).
- `src/scripts/gallery/carousel.ts` (228 lines) builds slides 2..n via
  `track.replaceChildren`, wires dots/swipe/prev-next, and lazy-inits via
  IntersectionObserver.
- `src/scripts/gallery/dom.ts` (108 lines) builds `<picture>` markup through `innerHTML`
  string interpolation with manual escaping.
- `src/utils/responsive-gallery-images.ts` generates per photo: `cardAvifSrcSet` (AVIF
  q50, widths 360/480/640), `cardFallbackSrc` (WebP 480w), `lightbox` (AVIF 1200w).
  **Keep this pipeline and its variants exactly as-is.**
- Tests: `tests/helpers/shared-gallery.ts` parses the JSON payloads;
  `tests/filter-chips.spec.ts:86-99` asserts the payload shape.

## Files owned

- `src/components/SharedPhotoGallery.astro`
- `src/styles/components/shared-gallery.css` (carousel portion, lines ~1-126)
- `src/utils/responsive-gallery-images.ts` (types only, if the payload type goes away)
- `src/scripts/gallery/carousel.ts` (delete)
- `src/scripts/gallery/dom.ts` (delete)
- `src/scripts/init-shared-gallery.ts` (slim down to lightbox-only init; task 06 replaces it)
- `src/scripts/gallery/lightbox.ts` (minimal edits only, to survive without carousel.ts)
- `tests/helpers/shared-gallery.ts`
- `tests/filter-chips.spec.ts` (payload-shape test only)

Do not touch: `SharedGalleryLightbox.astro` markup (task 06), `DogCard.astro`,
`StoryCard.astro`, `dog-card.css`, `stories.css` (task 07), pages.

## Steps

1. **SSR all slides.** `SharedPhotoGallery` renders every photo as a
   `<picture>` (AVIF srcset + WebP fallback `<img>`) inside the track. Only the first
   slide gets `fetchpriority="high"`/eager per the existing `loadingPriority` prop;
   later slides use `loading="lazy"`. Keep `width`/`height` attributes and the square
   `aspect-ratio` viewport (no CLS). Keep `transition:name` on the **first slide's**
   `<img>` only (`dog-photo-<id>` morph to the profile page must survive).
2. **Scroll-snap track.** CSS: `overflow-x: auto; scroll-snap-type: x mandatory` on the
   viewport, `scroll-snap-align: start` on slides, `scroll-behavior: smooth` gated behind
   `@media (prefers-reduced-motion: no-preference)`. Hide the scrollbar visually while
   keeping it keyboard/scroll accessible. Remove `will-change: transform` and the
   `translateX` transition machinery.
3. **Controls without JS.**
   - Single-photo galleries: render **no** controls at all (fix the dead-UI problem at
     the source).
   - Multi-photo: prev/next become anchor `<a href="#<gallery-id>-slide-N">` links that
     jump the snap position natively; wrap-around logic (last → first) is dropped in the
     no-JS path. Dots become a row of the same anchors, each pointing at its slide id.
     Style the active dot with `:target`-adjacent techniques if cheap; otherwise accept
     static dots — task 06's small enhancement script may add active-state tracking via
     IntersectionObserver as progressive enhancement.
4. **Delete** `carousel.ts` and `dom.ts`. Slim `init-shared-gallery.ts` to only boot the
   lightbox against the new SSR markup (slide click still opens the lightbox at that
   index). Make the smallest possible edits to `lightbox.ts` so it reads slide data from
   the DOM (e.g. `data-full` attributes carrying the 1200px AVIF URL on each slide)
   instead of the deleted JSON payload. The lightbox visual/a11y rebuild is task 06 —
   here it only needs to keep working.
5. **Update tests.** `tests/helpers/shared-gallery.ts`: assert on SSR'd slides instead of
   JSON payloads (≥1 gallery, 1–3 slides each, AVIF srcset with exactly 3 entries per
   slide, WebP fallback, lazy loading on slides > 1). `tests/filter-chips.spec.ts`:
   retarget the payload-shape assertions to the SSR markup equivalents.
6. Verify HTML weight: view-source (or `dist/` grep) on `/casos-de-exito/` must contain
   zero `data-gallery-payload` attributes.

## Acceptance checks

```bash
npm run format:check
npm run lint
npm run build
npm test
npm run test:lighthouse     # performance surface changed; must not regress
```

Manual smoke (report findings in the subagent summary): with JS disabled in the browser,
carousel navigation works via scroll and anchor controls; with JS enabled, lightbox still
opens from any slide.

## Done when

- All slides are SSR'd; no JSON payloads in emitted HTML.
- Carousel is fully functional with JS disabled; controls exist only for multi-photo
  galleries.
- ~330 lines of carousel/DOM JS deleted; lightbox still opens (old implementation,
  DOM-fed).
- Test suite green; Lighthouse performance on `/casos-de-exito/` equal or better.
