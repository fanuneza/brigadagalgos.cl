# T01 — Consent without obstruction

| Field      | Value                                                         |
| ---------- | ------------------------------------------------------------- |
| Wave       | 1 — Trustworthy shell                                         |
| Branch     | `ux/wave-01-t01-consent`                                      |
| Mode       | Safe to run in the Wave 1 swarm                               |
| Depends on | None                                                          |
| Commit     | `ux(T01): keep consent visible without covering core actions` |

## Objective

Preserve the current denied-by-default, accept/reject consent behavior while
preventing the banner from covering the active decision area on any core
route.

## Ownership

- `src/components/sections/CookieBanner.astro`
- `src/styles/components/cookie-banner.css`
- consent UI behavior in `src/scripts/`
- consent-specific cases in `tests/analytics-consent.spec.ts`
- a new focused visual/geometry test if needed

Do not edit navigation, route content, GTM policy, or analytics event names.

## Implementation

1. Measure the rendered banner on 320, 390, 768, 1024, and 1440px.
2. Replace the full-width obstructive treatment with a compact pattern using
   current tokens and buttons. Accept and reject must keep equal semantic
   availability; reject may not be hidden behind another panel.
3. Ensure the page’s primary CTA and the first actionable content are visible
   and operable with the banner present. Do not solve this by loading analytics
   early or by preselecting consent.
4. Support safe-area insets, long translated text, keyboard focus, zoom, and
   dark mode.
5. Keep the policy link visible and make the region announcement concise.
6. Test first visit, accept, reject, manage preferences, reload, and
   ClientRouter navigation.

## Acceptance

- No core CTA or focused element is visually covered at the audited sizes.
- Accept and reject are reachable in the first keyboard pass and meet the
  existing button target size.
- GTM remains absent before acceptance and after rejection.
- Cookie cleanup and manage-preferences behavior remain unchanged.
- No new color, radius, shadow, or button variant is introduced.

## Verification

```bash
npx playwright test tests/analytics-consent.spec.ts
npm run capture:home
npm run capture:adoptar
npm run capture:donar
npm run build
```

Capture at least one mobile first-visit state and attach its path in the commit
body or handoff.
