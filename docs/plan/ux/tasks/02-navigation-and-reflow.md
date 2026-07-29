# T02 — Navigation and narrow reflow

| Field      | Value                                                           |
| ---------- | --------------------------------------------------------------- |
| Wave       | 1 — Trustworthy shell                                           |
| Branch     | `ux/wave-01-t02-navigation-reflow`                              |
| Mode       | Safe to run in the Wave 1 swarm                                 |
| Depends on | None                                                            |
| Commit     | `ux(T02): align navigation with adoption and fix narrow reflow` |

## Objective

Make the global route hierarchy support adoption decisions and make the shared
shell work without horizontal page scrolling at 320px or enlarged text.

## Ownership

- `src/config/site.ts`
- `src/components/Navbar.astro`
- `src/components/Footer.astro`
- `src/styles/components/navbar.css`
- `src/styles/components/footer.css`
- navigation and reflow tests

Do not modify route sections, consent, or design tokens.

## Implementation

1. Reorder and label navigation around the primary visitor journey:
   adoption, living with galgos/FAQ, foster, stories, then organization/contact.
   Keep donation reachable but visually subordinate to the route’s primary
   adoption action using an existing action style.
2. Ensure desktop, drawer, and footer derive from the same canonical entries
   while retaining intentionally different subsets/orders.
3. Add “Por qué galgos” and “Preguntas frecuentes” to a discoverable navigation
   surface before the footer. Do not create an oversized desktop menu; use a
   compact “Información” grouping only if direct links cannot fit at 1024px.
4. Fix the 320px overflow. The brand mark, brand name, theme control, and menu
   control must remain visible without relying on `overflow-x: hidden`.
5. Verify 200% text size and browser zoom. It is acceptable to hide the written
   brand name at the narrowest width if the logo keeps an accessible name.
6. Raise visually small menu/theme controls to the existing minimum target
   where layout permits.

## Acceptance

- `documentElement.scrollWidth === clientWidth` at 320px on every shared-shell
  route.
- Navigation fits at 1024px and the drawer works at 810px and 390px.
- The current route remains announced with `aria-current`.
- Donation no longer competes as an orange primary beside an adoption primary.
- FAQ and “Por qué galgos” are reachable without going to the footer.
- No item disappears without an accessible alternative.

## Verification

```bash
npx playwright test tests/nav.spec.ts
npm run test:a11y
npm run build
npm run test:lighthouse
```

Add automated 320px and enlarged-text checks rather than relying only on
screenshots.
