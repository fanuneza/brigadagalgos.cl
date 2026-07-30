# T09 — Foster confidence

| Field      | Value                                            |
| ---------- | ------------------------------------------------ |
| Wave       | 4 — Decision support                             |
| Branch     | `ux/wave-04-t09-foster-confidence`               |
| Mode       | Safe to run in the Wave 4 swarm                  |
| Depends on | T04                                              |
| Commit     | `ux(T09): add human proof to the foster journey` |

## Objective

Answer the practical and emotional questions that prevent a suitable person
from offering temporary care.

## Ownership

- `src/pages/hogar-temporal.astro`
- foster components in `src/components/sections/`
- `src/styles/components/hogar-temporal.css`
- `src/styles/components/requirement-card.css`
- foster-specific tests

Use existing local imagery and confirmed repository facts only.

## Implementation

1. Lead with who this is for and what Brigada provides, not a wall of
   requirements.
2. Replace one generic card cluster with a simpler responsibilities comparison
   or checklist using existing plain-card/list patterns.
3. Add one decisive local photo or confirmed success/foster example that shows
   a galgo living in a home. Do not imply a named adopter quote unless one is
   sourced.
4. Answer duration, supplies/cost, other animals, daily contact, emergencies,
   and how the transition out of foster care works.
5. Explain the external form before the handoff and keep WhatsApp as the
   low-pressure secondary path.
6. Retain the “never off leash” safety requirement without making the entire
   route feel punitive.

## Acceptance

- The first content section clarifies commitment and support in under one
  mobile viewport after the hero.
- A real dog/home image provides proof without adding a remote dependency.
- Responsibilities are understandable without reading duplicate boxes.
- No unconfirmed policy, duration, supply, or funding claim is added.

## Verification

```bash
npx playwright test tests/a11y.spec.ts
npm run build
npm run test:lighthouse
```

Capture the full route at 390px and 1440px, with consent already resolved.
