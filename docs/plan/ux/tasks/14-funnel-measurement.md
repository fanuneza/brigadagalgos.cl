# T14 — Funnel measurement

| Field      | Value                                                            |
| ---------- | ---------------------------------------------------------------- |
| Wave       | 6 — Measurement and gates                                        |
| Branch     | `ux/wave-06-t14-funnel-measurement`                              |
| Mode       | Serial before T15                                                |
| Depends on | Waves 1–5                                                        |
| Commit     | `analytics(T14): document and verify the adoption intent funnel` |

## Objective

Create a small, consent-safe measurement model that shows where adoption intent
advances or stalls without adding trackers or collecting sensitive dog-fit
answers.

## Ownership

- existing analytics helpers/scripts
- tracking props on adoption journey components
- `tests/analytics-consent.spec.ts`
- `docs/spec.md` analytics-event documentation

Do not add GA4 directly, load GTM before consent, or send form contents.

## Funnel

Use existing event conventions where possible and document a canonical
sequence:

1. adoption listing viewed;
2. dog profile opened, with non-sensitive dog slug/name metadata;
3. adoption process/FAQ support viewed;
4. WhatsApp conversation intent;
5. application-form outbound click;
6. contact-form submit success where applicable.

Section visibility is supporting context, not a conversion by itself.

## Implementation

1. Inventory current payloads and remove duplicate names for the same action.
2. Add only missing milestones. Keep labels stable across homepage, listing,
   profile, FAQ, and tail actions.
3. Ensure events fire once per meaningful activation and survive ClientRouter
   navigation.
4. Queue or discard pre-consent events according to the existing policy; never
   transmit them before consent.
5. Test accept/reject/default states and ensure no PII, free text, email,
   compatibility answers, or form field values enter `dataLayer`.
6. Document event name, trigger, parameters, consent behavior, and intended
   question answered.

## Acceptance

- One event taxonomy covers the complete adoption-intent journey.
- Default/rejected states make no network request to GTM/GA.
- Accepted state emits each milestone once with no sensitive payload.
- Visual changes are unnecessary unless an accessible status is missing.

## Verification

```bash
npx playwright test tests/analytics-consent.spec.ts
npm run build
npm test
```

Handoff must include the final event table and any intentionally unmeasured
step.
