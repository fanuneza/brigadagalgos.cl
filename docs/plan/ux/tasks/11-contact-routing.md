# T11 — Contact routing

| Field      | Value                                                        |
| ---------- | ------------------------------------------------------------ |
| Wave       | 4 — Decision support                                         |
| Branch     | `ux/wave-04-t11-contact-routing`                             |
| Mode       | Safe to run in the Wave 4 swarm                              |
| Depends on | T01, T02                                                     |
| Commit     | `ux(T11): reduce contact detours and clarify response paths` |

## Objective

Help a visitor start the right conversation without scanning five equal cards
or repeating choices they already made elsewhere.

## Ownership

- `src/pages/contacto.astro`
- `src/components/sections/ContactChannels.astro`
- `src/components/sections/ContactForm.astro`
- `src/styles/components/contact-channels.css`
- `src/styles/components/form.css`
- `src/scripts/form.ts`
- contact-form tests

## Implementation

1. Make WhatsApp and the form the two clear contact methods.
2. Replace the five equal route cards with a compact intent selector/list that
   pre-fills or anchors the form for adoption, foster, donation, alliance, or
   another question.
3. Keep direct links to full adoption/foster/donation information as supporting
   context, not parallel contact CTAs.
4. Preserve press/alliance email routing without giving it equal weight to the
   primary audience.
5. Confirm whether displayed hours mean monitoring hours or expected response
   hours. If the repository cannot prove the claim, remove it rather than
   implying a service-level promise.
6. Improve error summary, field association, pending state, success state, and
   recovery while preserving Web3Forms behavior.
7. Keep form labels visible and placeholders supplemental.

## Acceptance

- A visitor can start WhatsApp or focus the correct form in one activation.
- Selecting an intent never deletes typed input.
- Validation errors identify the field, explain the correction, and receive
  focus appropriately.
- Submit remains the only primary action in the form section.
- The experience works without analytics consent.

## Verification

```bash
npx playwright test tests/a11y.spec.ts
npm run build
npm run test:lighthouse
```

Add contact tests for intent routing, validation, pending, success, and failure.
