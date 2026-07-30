# T03 — Accessibility truth

| Field      | Value                                                        |
| ---------- | ------------------------------------------------------------ |
| Wave       | 1 — Trustworthy shell                                        |
| Branch     | `ux/wave-01-t03-accessibility-truth`                         |
| Mode       | Safe to run in the Wave 1 swarm                              |
| Depends on | None                                                         |
| Commit     | `test(T03): make accessibility gates reflect the whole site` |

## Objective

Fix the confirmed cookie-policy keyboard failure and make green accessibility
checks represent all route templates, themes, and currently excluded rules.

## Ownership

- `src/components/sections/CookiePolicyArticle.astro`
- `src/styles/components/cookie-policy.css`
- `tests/a11y.spec.ts`
- `tests/a11y-disabled-rules.json`
- `.lighthouserc.cjs`
- accessibility test helpers only

Do not redesign unrelated components or weaken an assertion to pass.

## Implementation

1. Make `.cookie-policy__table-wrap` keyboard accessible with a clear label and
   visible focus, or replace horizontal scrolling with a semantic narrow-screen
   layout.
2. Add representative active dog profile, FAQ, blog index, blog article,
   cookie policy, and 404 coverage.
3. Run each template in light and dark modes at mobile and desktop where the
   rule can differ.
4. Remove `color-contrast`, `label-content-name-mismatch`, and `heading-order`
   from the blanket disabled-rules file when the full scan is clean. Delete the
   file and spread logic if no exception remains.
5. Document any unavoidable exception next to a precise selector and route;
   global rule suppression is not allowed.
6. Keep Axe tags at WCAG 2 A/AA and 2.1 AA or broaden them if the installed Axe
   version supports the project target without noise.

## Acceptance

- Full Axe run has no serious or critical violations on all public templates.
- Cookie-policy table is reachable and scrollable with keyboard at 320px.
- Lighthouse accessibility assertions no longer depend on stale global
  exclusions.
- A deliberate heading or accessible-name regression makes CI fail.

## Verification

```bash
npx playwright test tests/a11y.spec.ts
npm run test:lighthouse
npm run build
```

Include the removed exclusions and expanded route matrix in the commit body.
