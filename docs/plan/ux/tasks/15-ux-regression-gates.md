# T15 — UX regression gates

| Field      | Value                                                         |
| ---------- | ------------------------------------------------------------- |
| Wave       | 6 — Measurement and gates                                     |
| Branch     | `ux/wave-06-t15-ux-regression-gates`                          |
| Mode       | Serial after T14                                              |
| Depends on | T14                                                           |
| Commit     | `test(T15): lock the improved UX across routes and viewports` |

## Objective

Convert the audit’s manual checks into stable repository gates so future work
cannot quietly restore obstruction, overflow, weak hierarchy, or incomplete
coverage.

## Ownership

- Playwright tests and helpers
- capture configuration/specs
- `.lighthouserc.cjs`
- test documentation/scripts in `package.json` only when needed

Do not change product UI to make a brittle screenshot pass; coordinate any real
defect with the orchestrator.

## Implementation

1. Add a 320px reflow test for every shared route template.
2. Add enlarged-text coverage for nav, headings, CTA groups, forms, cards, and
   footer. Use a browser-supported method and assert no loss of content or
   horizontal page scroll.
3. Assert that the unresolved consent UI does not geometrically overlap the
   route’s primary CTA or first decision surface.
4. Expand accessibility coverage to light/dark and all route templates.
5. Add keyboard journey tests: navigation, dog listing/profile, FAQ, lightbox,
   foster CTA, donation copy, contact form, and consent.
6. Expand Lighthouse URLs to include a profile, FAQ, story/blog template,
   cookie policy, and 404 where appropriate.
7. Review currently disabled Lighthouse audits. Re-enable `target-size`,
   `aria-hidden-focus`, `dom-size`, and other audits that now pass. Keep only
   precise, documented exceptions.
8. Make local captures scroll enough to load lazy images before full-page
   screenshots and include mobile/desktop plus a focused dark-mode set.

## Acceptance

- All public templates have at least one automated accessibility/reflow path.
- A 321px-wide shell, consent overlap, broken deep link, or lost keyboard focus
  produces a clear test failure.
- Lighthouse retains ≥0.99 performance and 1.00 accessibility, best practices,
  and SEO for the configured routes.
- Visual captures contain loaded offscreen images and no consent-state
  ambiguity.
- Test runtime remains reasonable and visual captures stay opt-in.

## Verification

```bash
npm run format:check
npm run lint
npm run build
npm test
npm run test:lighthouse
npm run capture:local
```

The task agent commits the gates. The orchestrator then performs the final
manual review described in `docs/plan/ux/README.md`.
