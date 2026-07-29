# Task 06 — Native `<dialog>` lightbox

- **Wave:** 4 (branch `wave-4/native-lightbox`, off `main` after wave 3 is merged)
- **Depends on:** wave 3 merged
- **Commit message:** `feat(gallery): rebuild lightbox on native dialog element`

## Goal

Rebuild the lightbox on the native `<dialog>` element with `showModal()`: correct
semantics, backdrop, Escape handling, and focus containment come from the platform. The
rewrite fixes today's concrete defects: no focus trap, no focus return, no loading state,
blank area while the 1200px image downloads, and mislabeled analytics for adoption dogs.

## Background (current implementation)

- `src/components/SharedGalleryLightbox.astro` (47 lines): a hidden div + backdrop +
  `role="dialog"` with close/prev/next buttons, one plain `<img>`, loaded on 5 pages via
  `PageLayout`'s `afterShell` slot. Its `<script>` tag is the sole loader of all gallery JS.
- `src/scripts/gallery/lightbox.ts` (102 lines): module-level state, `img.src` swap,
  `hidden` toggle, `.has-lightbox-open` scroll-lock class, backdrop/Escape/arrow
  listeners. No focus management.
- Analytics defect: `getStoryContext` only finds `[data-story-card]` ancestors, so
  adoption-dog galleries (homepage featured, `/adoptar/` grid, profile) fire no
  `gallery_open` event and default to `location: "success_stories"`.

## Files owned

- `src/components/SharedGalleryLightbox.astro`
- `src/scripts/gallery/lightbox.ts` (full rewrite; may be renamed/moved, e.g.
  `src/scripts/gallery-lightbox.ts`)
- `src/scripts/init-shared-gallery.ts` (rewire or delete)
- `src/styles/components/shared-gallery.css` (lightbox portion, lines ~128-227)
- `src/components/SharedPhotoGallery.astro` (only `data-*` attributes the lightbox reads:
  full-image URL, alt, gallery label, and a context attribute for analytics)
- `tests/helpers/shared-gallery.ts` (extend only, if useful)

Do not touch: carousel CSS/markup from task 05, card components/CSS (task 07), pages,
analytics consent code.

## Steps

1. **Markup.** One `<dialog>` per page (keep the single shared instance in
   `SharedGalleryLightbox`, rendered via `afterShell`): `<figure>` with `<img>` +
   `<figcaption>`, prev/next/close buttons. Style the backdrop with `::backdrop`; open
   animation via CSS `@starting-style` + `transition` on `dialog[open]` (opacity/scale),
   gated behind `prefers-reduced-motion: no-preference`.
2. **Script (~60 lines, no dependencies).** Event-delegated, bound once on
   `astro:page-load`:
   - Click on a gallery slide → read `data-full`, `data-alt`, index, and the gallery's
     context (`data-gallery-context="adopcion" | "exito"` set on the SSR gallery root in
     task 05's component — add it here if missing) → `dialog.showModal()`.
   - Prev/next swap within the current gallery's slides; Escape and backdrop click close
     natively (`showModal` + `click` on dialog bounding-box check); arrows via `keydown`
     on the dialog.
   - **Preloading:** on gallery hover/focus/touchstart (delegated, passive, once), create
     `new Image()` for the slide's `data-full` so the 1200px AVIF is warm before the
     click; while it loads, show the card-size image already in the DOM as a placeholder
     (blur-up) instead of a blank area.
   - **Focus:** `showModal()` gives containment for free; on `close`, return focus to the
     originating slide button/anchor explicitly.
   - **Scroll lock:** `showModal()` blocks background interaction; keep or drop
     `.has-lightbox-open` based on what the CSS actually needs — remove it if redundant.
   - **Analytics:** fire the existing `gallery_open` event (see `analytics-events.ts`
     conventions) for **all** galleries with the correct `location`
     (`"adopcion"`/`"exito"` from `data-gallery-context`), fixing the mislabeling. GTM
     stays consent-gated — reuse the existing event push helper; do not add new tags.
3. **CSS.** Rebuild the lightbox styles: centered dialog, `max-width: min(1100px, 92vw)`,
   image `object-fit: contain` with a stable aspect box to avoid layout jump while the
   full image loads, visible focus styles on all controls, mobile layout (controls
   reachable with thumbs). Delete the old `.stories-lightbox*` rules being replaced.
4. **Cleanup.** Delete leftover exports/dead code from the old `lightbox.ts`; if
   `init-shared-gallery.ts` becomes a one-line import, inline it into
   `SharedGalleryLightbox.astro`'s script tag and delete the file.
5. Add a Playwright assertion to an existing spec (pick the lightest, e.g.
   `tests/stories-section.spec.ts` or create `tests/lightbox.spec.ts` if cleaner):
   click a slide on `/casos-de-exito/` → dialog is open with the full AVIF image and
   caption; Escape closes and focus returns to the slide; same flow on `/adoptar/`
   verifies the adoption analytics context attribute is present.

## Acceptance checks

```bash
npm run format:check
npm run lint
npm run build
npm test
npm run test:lighthouse     # a11y + performance must not regress (target stays 100)
```

## Done when

- Lightbox is a native `<dialog>`; focus trap/return, Escape, and backdrop are correct.
- No blank flash: full image preloads on intent, placeholder shown while loading.
- `gallery_open` fires with the correct context for both dog kinds.
- Gallery JS is now a single small module (~60 lines); total gallery JS is roughly an
  order of magnitude smaller than the original ~440 lines.
