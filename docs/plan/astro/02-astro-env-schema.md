# Task 02 — Type-safe environment variables with `astro:env`

## Goal

Replace ad-hoc `import.meta.env` / hardcoded public keys with a validated `env.schema` in `astro.config.mjs`.

## Current state

- Public runtime values are scattered: GTM container id and consent cookie name are passed via `data-gtm-id` / `data-consent-cookie` attributes on `<html>` in `src/layouts/BaseLayout.astro` and read by `src/scripts/cookie-consent.ts`; the web3forms access key is hardcoded in `src/components/sections/ContactForm.astro`; the IndexNow key is hardcoded twice (`astro.config.mjs` and `src/pages/591c2b87….txt.ts` — the filename IS the key).
- `.env.example` exists; check which variables it documents and align the schema with it.

## Astro docs reference

- https://docs.astro.build/en/guides/environment-variables/#type-safe-environment-variables — `env.schema` with `envField`, consumed via `astro:env/client` and `astro:env/server`.
- Client-safe values must be `context: "client", access: "public"`. Never mark anything `access: "secret"` for this static site — there is no server runtime.

## Changes

1. Add to `astro.config.mjs` (import `envField` from `astro/config`):
   ```js
   env: {
     schema: {
       PUBLIC_GTM_ID: envField.string({ context: "client", access: "public", optional: true }),
       PUBLIC_WEB3FORMS_KEY: envField.string({ context: "client", access: "public", optional: true }),
       ENABLE_INDEXNOW: envField.boolean({ context: "server", access: "public", default: false }),
     },
   },
   ```
   (Exact variable names: match/extend `.env.example`. Keep `ENABLE_INDEXNOW` semantics identical to the current `process.env.ENABLE_INDEXNOW === "true"` gate.)
2. `src/scripts/cookie-consent.ts`: read `PUBLIC_GTM_ID` from `astro:env/client` instead of (or with fallback to) the `data-gtm-id` attribute. Keep the `data-consent-cookie` mechanism if it is not secret — it is fine as-is.
3. `ContactForm.astro`: replace the hardcoded web3forms key with `import { PUBLIC_WEB3FORMS_KEY } from "astro:env/client"`.
4. `astro.config.mjs` indexNow gate: use the schema-backed boolean instead of the raw `process.env` string comparison.
5. Update `.env.example` with the new variables and their defaults.

## Acceptance criteria

- `astro check` passes (schema types are generated at build).
- Consent flow still works: `tests/analytics-consent.spec.ts` passes unchanged (GTM loads only after consent).
- Contact form still submits (Playwright form test green).
- `npm run lint && npm run build && npm test` green.
