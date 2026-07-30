# T13 — Visual grammar

| Field      | Value                                                             |
| ---------- | ----------------------------------------------------------------- |
| Wave       | 5 — Cross-site coherence                                          |
| Branch     | `ux/wave-05-t13-visual-grammar`                                   |
| Mode       | Serial after T12                                                  |
| Depends on | T12                                                               |
| Commit     | `refactor(T13): apply the existing visual hierarchy consistently` |

## Objective

Remove templated repetition and implementation drift after the route work,
without changing the design system.

## Ownership

- `src/components/PageHero.astro`
- `src/components/sections/CtaCard.astro`
- `src/styles/global.css`
- `src/styles/tokens.css` only to reuse/document existing values, not add a new
  visual direction
- remaining component CSS with detector findings
- `src/components/sections/TrustStatsSection.astro`
- `docs/plan/open-decisions.md`, `DESIGN.md` only when documentation becomes
  stale because of the cleanup

## Implementation

1. Inventory every remaining eyebrow. Keep it only where it adds information;
   do not mechanically delete all brand labels.
2. Use lead/support/quiet heading roles consistently so dense informational
   sections do not shout like page titles.
3. Reduce repeated centered PageHero + boxed-tail CTA grammar where the route
   work already provides a clear decision.
4. Replace literal colors/type sizes/radii with the nearest existing semantic
   token when the visual result is equivalent.
5. Remove the duplicate `a:not([class])` selector.
6. Resolve the unused `TrustStatsSection` full variant as recommended in
   `docs/plan/open-decisions.md`: prune it after confirming no consumer remains.
7. Run Impeccable detection and classify remaining warnings. Document valid
   client-populated image false positives instead of altering correct markup.
8. Preserve the current uppercase brand decision unless a route-specific quiet
   role already calls for sentence case.

## Acceptance

- No new token, font, palette role, radius, shadow, or component family.
- Repeated eyebrows/card containers decrease measurably.
- Lead, support, and quiet sections are visually distinguishable on every core
  route.
- Detector output contains only reviewed intentional exceptions/false
  positives.
- No existing page loses a meaningful heading or action.

## Verification

```bash
node .claude/skills/impeccable/scripts/detect.mjs --json src
npm run format:check
npm run lint
npm run build
npm run test:lighthouse
```

Run all route captures and review diffs; this task is explicitly visual.
