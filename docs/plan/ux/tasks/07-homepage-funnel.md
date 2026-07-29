# T07 — Homepage funnel

| Field      | Value                                                  |
| ---------- | ------------------------------------------------------ |
| Wave       | 3 — Adoption journey                                   |
| Branch     | `ux/wave-03-t07-homepage-funnel`                       |
| Mode       | Safe to run in the Wave 3 swarm                        |
| Depends on | T04                                                    |
| Commit     | `ux(T07): shorten the homepage around adoption intent` |

## Objective

Keep the homepage adoption-first while reducing repetition, interaction
density, and the distance from emotion to a qualified dog/profile visit.

## Ownership

- `src/pages/index.astro`
- `src/components/sections/Hero.astro`
- `src/components/sections/FeaturedAdoptionDogs.astro`
- `src/components/sections/MissionSection.astro`
- `src/components/sections/WhyGalgosSection.astro`
- `src/components/sections/HelpCards.astro`
- their component CSS
- homepage-specific tests

Do not edit `DogCard.astro`, `StoryCard.astro`, navigation, or the design tokens.

## Implementation

1. Preserve the required section order and three-dog build-time shuffle, but
   reduce repeated copy/actions inside those sections.
2. Keep the hero’s single primary adoption action. Make foster a calm secondary
   route and donation a later quiet route.
3. Ensure featured dogs carry the strongest post-hero weight and one clear
   profile action each.
4. Compress mission/trust/rescue flow into proof that directly answers “who are
   you and will you stay with me?”.
5. Make “¿Un galgo podría vivir conmigo?” a short decision bridge to FAQ/why
   content, not another long page within the homepage.
6. Remove or reshape the redundant three-route help-card grid. Adoption must
   not be introduced a third time with equal visual weight.
7. Keep stories as proof, not a second catalogue.

## Acceptance

- Homepage remains six post-hero sections in the documented order/weights.
- It still previews exactly three active dogs and three success stories.
- Mobile height and interactive count are materially lower than 10,350px/87.
- Adoption remains the only primary product action.
- No factual stats or quotes are invented.

## Verification

```bash
npx playwright test tests/stories-section.spec.ts
npm run capture:home
npm run test:lighthouse
npm run build
```

Include before/after height, interactive count, and primary-action inventory in
the handoff.
