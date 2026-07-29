# Task 03 — Single source of truth for the site URL

## Goal

Eliminate hardcoded `https://brigadagalgos.cl` literals in code; derive them from `site` in `astro.config.mjs` (exposed as `import.meta.env.SITE` / `Astro.site`) or the existing `SITE` config constant — one canonical accessor everywhere.

## Current state

- `site: "https://brigadagalgos.cl"` is set in `astro.config.mjs`, and a `SITE.siteUrl` constant exists (used correctly by `src/layouts/BaseLayout.astro` and `src/pages/feed.xml.ts` via `context.site || SITE.siteUrl`).
- Hardcoded literals remain in:
  - `src/pages/schemamap.xml.ts:7`
  - `src/pages/schema/post.json.ts:9`
  - `src/pages/.well-known/api-catalog.ts:4`
  - `astro.config.mjs` (IndexNow `host`/`siteUrl` key config)
- The IndexNow key string is also duplicated between `astro.config.mjs` and the `src/pages/591c2b87….txt.ts` endpoint filename.

## Astro docs reference

- https://docs.astro.build/en/guides/environment-variables/#default-environment-variables — `import.meta.env.SITE` is set from the `site` config option.
- Endpoints receive `context.site` (`Astro.site`); prefer it so the value always matches the build config.

## Changes

1. In the three endpoints (`schemamap.xml.ts`, `schema/post.json.ts`, `.well-known/api-catalog.ts`), replace literal URLs with `context.site` (falling back to the shared `SITE.siteUrl` constant, mirroring `feed.xml.ts`).
2. In `astro.config.mjs`, derive the IndexNow `host`/`siteUrl` from the existing `site` value (define `const siteUrl = "https://brigadagalgos.cl"` once at the top and reuse for both `site:` and the indexNow config).
3. Extract the IndexNow key into a single shared constant (e.g. in `src/config/` next to `SITE`) used by the `astro.config.mjs` indexNow integration; the `591c2b87….txt.ts` endpoint should import and serve that same constant. Do NOT rename the endpoint file — the URL must stay stable.
4. Grep for remaining `brigadagalgos.cl` literals in `src/` after the change: only constants files, content, and tests may retain them.

## Acceptance criteria

- `grep -r "brigadagalgos.cl" src/ --include="*.ts" --include="*.astro"` shows hits only in the config/constants file(s).
- `dist/schemamap.xml`, `dist/schema/post.json`, `dist/.well-known/api-catalog` render identical URLs to before.
- `npm run build && npm test` green (build-output and source-hygiene tests cover this).
