# T10 — Donation confidence

| Field      | Value                                           |
| ---------- | ----------------------------------------------- |
| Wave       | 4 — Decision support                            |
| Branch     | `ux/wave-04-t10-donation-confidence`            |
| Mode       | Safe to run in the Wave 4 swarm                 |
| Depends on | T01                                             |
| Commit     | `ux(T10): streamline donation proof and action` |

## Objective

Let a donor choose transfer or recurring support quickly, understand concrete
impact, and trust the organization without reading the same claim four times.

## Ownership

- `src/pages/donar.astro`
- `src/components/sections/DonationCards.astro`
- `src/components/sections/ImpactSection.astro`
- donation-related component CSS and scripts
- donation-specific tests

Do not change bank details, eSponsor URL, or monetary claims without matching
the current source.

## Implementation

1. Keep transfer and recurring support as the two lead choices.
2. Ensure “Copiar datos” gives immediate, accessible feedback and works on
   narrow screens.
3. Consolidate suggested amounts, impact categories, and transparency
   exclusions so each fact appears once in the strongest format.
4. Add one local dog/care image or source-backed case connection near impact;
   avoid decorative stock and invented cost attribution.
5. Keep “other ways to help” quiet and secondary.
6. Fix “a traves” to “a través” and run the text-quality check.
7. Verify dark-mode contrast for bank rows, muted explanations, and copy
   feedback.

## Acceptance

- Transfer details and recurring donation are reachable without scrolling
  through proof first.
- Every displayed amount keeps its current meaning and qualification.
- Repetition decreases while transparency claims remain visible.
- Copy feedback is announced by the existing live region.
- Donation remains secondary on adoption-led routes.

## Verification

```bash
npm run capture:donar
npx playwright test tests/a11y.spec.ts
npm run test:text
npm run build
npm run test:lighthouse
```

Add a focused copy-to-clipboard test if one does not already exist.
