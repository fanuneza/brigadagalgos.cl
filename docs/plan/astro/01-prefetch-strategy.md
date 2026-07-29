# Task 01 — Fix the dead prefetch configuration

## Goal

Make prefetching actually work. Today it is configured but effectively disabled.

## Current state

- `astro.config.mjs` sets `prefetch: { prefetchAll: false, defaultStrategy: "hover" }`.
- `src/layouts/BaseLayout.astro` renders `<ClientRouter />` (view transitions), which per Astro docs enables prefetching **by default with `prefetchAll: true`** — the explicit config overrides that default and turns it off.
- Only one link in the entire site carries `data-astro-prefetch` (`src/components/sections/ContactForm.astro:96`). Every other navigation link gets no prefetch.

## Astro docs reference

- https://docs.astro.build/en/guides/prefetch/ — "When you use Astro's `<ClientRouter />` on a page, prefetching will also be enabled by default. It sets a default configuration of `{ prefetchAll: true }`."
- `defaultStrategy: 'hover'` prefetches on hover/focus and automatically falls back to `tap` on data-saver/slow connections, so enabling `prefetchAll` is bandwidth-safe.

## Changes

1. In `astro.config.mjs`, delete the explicit `prefetch` block entirely (inherit the ClientRouter default of `{ prefetchAll: true, defaultStrategy: 'hover' }`). Alternatively keep `prefetch: { defaultStrategy: "hover" }` without `prefetchAll: false` — but the simplest correct state is no block at all.
2. Audit opt-outs: any internal link that should NOT be prefetched (e.g. links with side effects) gets `data-astro-prefetch="false"`. Expected: none on this site, but check anchor lists in `Navbar.astro` and `Footer.astro`.
3. Remove the now-redundant explicit `data-astro-prefetch` in `ContactForm.astro` (it becomes the default behavior) — optional, harmless to keep.

## Acceptance criteria

- Built HTML includes the prefetch script and nav/footer links prefetch on hover (verify in `astro preview` with devtools network tab, or assert the prefetch script exists in `dist/` output).
- `npm run build`, `npm test` green. `npm run test:lighthouse` shows no regression (TBT/interaction metrics on `/` and `/adoptar/`).
