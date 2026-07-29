# T06 — Dog profiles

| Field      | Value                                       |
| ---------- | ------------------------------------------- |
| Wave       | 3 — Adoption journey                        |
| Branch     | `ux/wave-03-t06-dog-profiles`               |
| Mode       | Safe to run in the Wave 3 swarm             |
| Depends on | T04                                         |
| Commit     | `ux(T06): make dog profiles decision ready` |

## Objective

Help a person picture daily life with an individual dog, understand known
constraints, and choose conversation or application without pressure.

## Ownership

- `src/pages/adoptar/[slug].astro`
- `src/styles/components/dog-profile.css`
- profile-specific scripts and tests

Read the T04 helpers; do not edit content schemas, active dog files,
`DogCard.astro`, or listing CSS.

## Implementation

1. Reorder the profile around the decision: identity/personality, compatibility
   and care, current need/location, reassurance/process, actions.
2. Replace oversized generic group headings with concise, scannable labels
   using existing type roles.
3. Render T04 states honestly. Negative constraints must be as visible as
   positive compatibility; unknown must invite a conversation.
4. Keep the gallery rich on the profile, with keyboard/lightbox behavior and
   unique transition names.
5. Clarify “Más información” as a dog-specific conversation action.
6. Explain what happens after “Postular” and keep share as a tertiary action.
7. Confirm that the CTA group remains visible with consent, narrow layout,
   enlarged text, and long dog names.

## Acceptance

- All active profiles show distinct, non-repetitive portraits.
- Location/current care setting appears when confirmed.
- Compatibility states are understandable without color or icons alone.
- The primary and secondary actions are dog-specific and preserve tracking.
- One H1 and correct heading order remain.

## Verification

```bash
npx playwright test tests/dog-profile.spec.ts tests/lightbox.spec.ts
npx playwright test tests/a11y.spec.ts
npm run build
npm run test:lighthouse
```

Capture at least one constrained and one broadly compatible profile at mobile
and desktop.
