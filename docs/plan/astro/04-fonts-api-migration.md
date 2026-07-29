# Task 04 — Migrate to the Astro Fonts API

## Goal

Replace the hand-wired Fontsource CSS imports + manual `?url` preloads + hand-tuned fallback `@font-face` with Astro's stable Fonts API (stable since Astro 6). Gain: automatic optimized metric-matched fallbacks for BOTH font families (the display font currently has none → CLS risk on headings), automatic preloads, and one config-level source of truth.

## Current state

- `src/styles/global.css` (top): `@import url(...)` for `@fontsource/barlow` latin-400 and `@fontsource/barlow-condensed` latin-700/900.
- `src/layouts/BaseLayout.astro`: imports three woff2 files with `?url` and emits `<link rel="preload" crossorigin>` for each.
- `src/styles/global.css:79`: hand-written metrics-matched `@font-face "Barlow Fallback"` (Arial, size-adjust/ascent-override) wired into `--font-body` in `src/styles/tokens.css:77`.
- `--font-display` (Barlow Condensed) has NO fallback metrics — headings can shift.
- Fonts are self-hosted; no Google Fonts links. `fontProviders.fontsource()` exists and resolves the same packages already in `package.json`.

## Astro docs reference

- https://docs.astro.build/en/guides/fonts/ and https://docs.astro.build/en/reference/configuration-reference/#fonts — `fonts: [{ provider, name, cssVariable, weights, styles, subsets, fallbacks, optimizedFallbacks }]`; `optimizedFallbacks: true` (default) generates metric-matched fallbacks automatically.
- https://docs.astro.build/en/reference/font-provider-reference/#fontsource — built-in Fontsource provider.
- Consumption: `<Font cssVariable="--font-body" />` component from `astro:assets` in the layout head emits the `@font-face` rules and preload links.

## Changes

1. `astro.config.mjs` (import `fontProviders` from `astro/config`):
   ```js
   fonts: [
     {
       provider: fontProviders.fontsource(),
       name: "Barlow",
       cssVariable: "--font-body",
       weights: [400],
       styles: ["normal"],
       subsets: ["latin"],
     },
     {
       provider: fontProviders.fontsource(),
       name: "Barlow Condensed",
       cssVariable: "--font-display",
       weights: [700, 900],
       styles: ["normal"],
       subsets: ["latin"],
     },
   ],
   ```
   Verify the exact Fontsource family names against the installed packages (`@fontsource/barlow`, `@fontsource/barlow-condensed`).
2. `src/layouts/BaseLayout.astro`: remove the three `?url` font imports and their `<link rel="preload">` tags; add `<Font cssVariable="--font-body" preload />` and `<Font cssVariable="--font-display" preload />` (import `Font` from `astro:assets`) in `<head>`.
3. `src/styles/global.css`: remove the `@fontsource` `@import`s and the hand-written `"Barlow Fallback"` `@font-face`.
4. `src/styles/tokens.css`: change `--font-body`/`--font-display` stacks to `var(--font-body)`/`var(--font-display)` families provided by the API (the API defines these custom properties including fallbacks — adjust token definitions to not double-wrap; e.g. `font-family: var(--font-body), sans-serif;` at usage sites or redefine tokens as plain consumers). Match the existing usage pattern in the CSS; keep the visual result identical.
5. Keep the exact same weights/subsets in use today (latin-400 body, latin-700/900 display). Do not add new weights.

## Acceptance criteria

- Visual parity: headings and body render in Barlow Condensed/Barlow; no FOUT regression (fallbacks are now optimized for both families).
- Lighthouse: CLS on `/` and `/adoptar/` does not regress (target: improves or stays ~0).
- `dist/_astro/` contains the font files served locally; no external font requests (check built HTML + network tab in preview).
- `npm run build && npm test && npm run test:lighthouse` green.
- Update `docs/spec.md` (font pipeline description) and `DESIGN.md` if it documents the fallback `@font-face`.
