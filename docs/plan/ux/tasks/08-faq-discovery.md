# T08 — FAQ discovery

| Field      | Value                                                  |
| ---------- | ------------------------------------------------------ |
| Wave       | 4 — Decision support                                   |
| Branch     | `ux/wave-04-t08-faq-discovery`                         |
| Mode       | Safe to run in the Wave 4 swarm                        |
| Depends on | T02, T06                                               |
| Commit     | `ux(T08): make adoption answers easy to find and scan` |

## Objective

Turn FAQ from a long reading page into a low-friction answer system that can be
entered from profiles, process steps, search results, and navigation.

## Ownership

- `src/config/faq.ts`
- `src/components/sections/FaqSection.astro`
- `src/styles/components/faq.css`
- `src/pages/preguntas-frecuentes.astro`
- FAQ structured-data wiring and focused tests

Do not add a search library or a client framework.

## Implementation

1. Preserve canonical answer copy and structured-data parity.
2. Add an above-the-fold topic index with stable anchors for adoption,
   coexistence, home/department, costs, foster, donation, and guarantees.
3. Use native `<details>` only if progressive disclosure improves the mobile
   scan and all answers remain indexable/printable. Otherwise keep answers open
   and add a sticky-free table of contents.
4. Put the direct answer in the first sentence and move reassurance/details
   after it.
5. Add contextual cross-links to active dogs, adoption process, foster, and
   contact where they resolve the next likely question.
6. Ensure deep links land below the sticky header with a visible heading.

## Acceptance

- A user can reach any FAQ group in one activation from the top.
- Deep links work with and without ClientRouter navigation.
- Structured FAQ data matches visible answers.
- Keyboard and screen-reader users can operate any disclosure.
- The page remains useful with JavaScript disabled.

## Verification

```bash
npx playwright test tests/a11y.spec.ts tests/build-output.spec.ts
npm run build
npm run test:lighthouse
```

Add tests for anchors, disclosure state if used, and structured-data parity.
