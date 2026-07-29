# Task 09 — SVG components + build-time SVG optimization

## Goal

Move inline/icon SVG usage to Astro's SVG component imports and turn on build-time optimization, cutting SVG payload and removing `/icons/*.svg` HTTP requests where the icon is decorative and static.

## Current state

- Icons are served as static files from `public/icons/*.svg` and referenced with `<img src="/icons/....svg" alt="">` (correctly decorative) in components like `RequirementCard.astro`, `Footer.astro`, `Navbar.astro` social icons.
- `public/` assets are never optimized and each `<img>` is an extra request; inline SVGs also inherit `currentColor`, enabling theme-aware coloring.
- No `experimental.svgOptimizer` configured.

## Astro docs reference

- https://docs.astro.build/en/guides/images/#svg-components — importing an `.svg` from `src/assets/` yields an inline component.
- https://docs.astro.build/en/reference/experimental-flags/svg-optimization/ — `experimental: { svgOptimizer: svgoOptimizer() }` from `astro/config` (astro >= 5.16); production-only optimization, zero runtime cost. Use `preset-default` + `removeXMLNS` for inline use; preserve `<style>` only if any icon relies on it.

## Changes

1. Move icon SVGs used as UI icons from `public/icons/` to `src/assets/icons/` (keep in `public/` only files that must stay URL-addressable: favicon, manifest icons, anything referenced from `_headers`/`site.webmanifest`/CSS `url()`).
2. Convert `<img src="/icons/x.svg" alt="">` usages to component imports (`import XIcon from "../assets/icons/x.svg"`), rendering `<XIcon aria-hidden="true" />` with the same sizing classes. Preserve decorative semantics (`aria-hidden`, no `alt` concept needed inline; add `role="img"` + `<title>` ONLY where the icon is meaningful — audit per usage).
3. Enable in `astro.config.mjs`:
   ```js
   import { defineConfig, svgoOptimizer } from "astro/config";
   experimental: {
     svgOptimizer: svgoOptimizer({ plugins: ["preset-default", "removeXMLNS"] });
   }
   ```
   Verify visually that no icon breaks (SVGO can strip needed attrs); adjust plugin overrides if so.
4. Delete now-unused files from `public/icons/`; update `tests/build-output.spec.ts` if it asserts their presence.

## Acceptance criteria

- Fewer requests on key pages (compare network counts in preview before/after); icons render identically in light/dark themes.
- `dist/` smaller or equal; optimized SVGs present inline.
- `npm run build && npm test` green; a11y specs (`tests/a11y.spec.ts`) still pass with inline SVGs.
- Update `docs/spec.md` asset documentation (icons moved to `src/assets/icons/`).
