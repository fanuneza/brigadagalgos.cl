# T05 — Homepage hierarchy

**Wave 3** · branch `wave/3-journeys` · runs in parallel with [T06](06-foster-and-contact.md)

## Outcome

The homepage tells one story instead of stacking eight equal-weight pitches: understand the
foundation → meet active galgos → assess whether adoption or foster care fits → see credible
outcomes → choose a supporting action.

## Problem being fixed

Audit finding 1, verified in the repo. `src/pages/index.astro` renders, after the hero and
divider: `FeaturedAdoptionDogs`, `MissionSection`, `TrustStatsSection`, `WhyGalgosSection`,
`StoriesSection`, `ProcessStepper` (a five-step rescue process defined inline in the page),
`HelpCards`, `DonationBanner`. Eight substantial sections, near-identical vertical rhythm and
headline treatment, with adoption, institutional proof, education, stories, process, foster care,
and donation all competing at the same weight.

## Owned files

Exclusive.

- `src/pages/index.astro`
- `src/styles/components/home.css`
- `src/components/sections/MissionSection.astro` + `src/styles/components/mission.css`
- `src/components/sections/WhyGalgosSection.astro`
- `src/components/sections/TrustStatsSection.astro` + `src/styles/components/trust-stats.css`
- `src/components/sections/HelpCards.astro` + `src/styles/components/help-cards.css`
- `src/components/sections/DonationBanner.astro` + `src/styles/components/donation-banner.css`
- `src/components/sections/FeaturedAdoptionDogs.astro` + `src/styles/components/featured-adoption-dogs.css`
- `src/components/sections/StoriesSection.astro` + `src/styles/components/stories.css`
- `src/components/sections/Hero.astro` + `src/styles/components/hero.css`

`TrustStatsSection` is also rendered by `/donar/`. You own it; [T07](07-donation.md) runs in a
later wave and will consume whatever you leave. If you add a variant prop, **default it to
today's rendering** so `/donar/` is unaffected, and say so in your report.

## Read-only files

`src/components/DogCard.astro` and `src/styles/components/dog-card.css` (T03 shipped these in
wave 2 — consume as-is), `src/components/sections/ProcessStepper.astro` and
`src/styles/components/stepper.css` (**T06 owns them this wave — you may stop rendering the
stepper or change the `steps` data you pass from `index.astro`, but you must not edit the
component or its CSS**), `src/utils/dog-content.ts`, `src/pages/por-que-galgos.astro`,
`src/pages/casos-de-exito.astro`, `src/pages/hogar-temporal.astro`, `src/pages/donar.astro`,
`DESIGN.md`, `docs/prd.md`, `docs/voice-and-tone.md`.

## Scope

1. **Keep hero → divider → `FeaturedAdoptionDogs` exactly where it is.** This is fixed by
   `AGENTS.md` and by the audit. Do not turn it into the full catalogue; it stays at three dogs.

2. **Consolidate mission and trust evidence.** `MissionSection` and `TrustStatsSection` currently
   make the same argument in two separate full-weight sections. Merge them into one "who we are and
   what we have done" block, or make one clearly subordinate to the other. Preserve every factual
   statistic exactly as written — you may drop a repeated stat, never alter a number.

3. **Reduce the rescue process.** The five-step `rescueSteps` array lives inline in
   `index.astro`. Per the audit: compress it to a compact proof block or remove it from the
   homepage. `/adoptar/` already carries `AdoptionProcess` and `/hogar-temporal/` carries the
   foster process, so the homepage does not need a full stepper. If you remove it, the
   `rescueSteps` data goes with it — check first whether any other file imports it (it does not
   today, but verify) and report the removal so T08 can update `docs/spec.md`.

4. **`WhyGalgosSection`.** Education is genuinely valuable but not a primary homepage decision.
   Make it a secondary-weight section that clearly points to `/por-que-galgos/`, which already
   holds the full argument.

5. **`StoriesSection`.** Outcomes are the strongest credibility signal on the page. Keep the
   three-story preview, keep its link to `/casos-de-exito/`, and place it where it supports the
   decision rather than competing with it. Do not restore pagination, `/casos/exito-home.json`,
   or `src/scripts/stories-section.ts` — explicitly forbidden by `AGENTS.md`.

6. **Subordinate exits.** `HelpCards` (foster care and other help routes) and `DonationBanner`
   currently sit at full weight at the end. Give them **distinct but subordinate** treatment:
   clearly separate exits, visibly lighter than the adoption path. One of them should not
   out-shout the featured galgos.

7. **Apply the weight vocabulary from T01** (`DESIGN.md`) rather than inventing per-section
   spacing. The final order should show at least three distinct section weights.

8. **Verify the result at 390px first.** Count the vertical screens from hero to footer and report
   the number before and after. If the page is not meaningfully shorter and more differentiated on
   mobile, the task is not done.

## Constraints

- Everything in `README.md` §5 applies.
- **No route deletions.** Every section you shorten or remove keeps its dedicated page:
  `/por-que-galgos/`, `/casos-de-exito/`, `/hogar-temporal/`, `/donar/`, `/adoptar/`. Homepage
  entry points to each must still exist somewhere on the page, even if smaller.
- The hero's art-directed `<picture>`, its preload links, and `buildHeroImageSources` stay exactly
  as they are. Do not touch the hero image pipeline or LCP behavior.
- Exactly one `h1`. Section headings are `h2`. No heading skips after reordering — Lighthouse
  catches these even when the page looks fine.
- Preserve `SharedGalleryLightbox` in the `afterShell` slot and the featured-card gallery contract.
- Preserve analytics events; report any whose `location` changes or that disappear with a removed
  section.
- Do not edit `ProcessStepper.astro` or `stepper.css` (T06 owns them this wave).
- Do not add client JavaScript.
- Copy edits follow `docs/voice-and-tone.md`. Keep it specific and humane; no generic NGO filler.

## Acceptance criteria

- Homepage section count after the hero is reduced (target: five to six, from eight).
- At least three distinct section weights are visible at 390px, not just on desktop.
- `FeaturedAdoptionDogs` is the first content block after the hero divider and is the visually
  dominant section on the page.
- Foster and donation are present, distinct, and clearly subordinate.
- Every removed or compressed section still has a working link to its dedicated route.
- No statistic altered; no fact invented.
- One `h1`, clean heading order, no new JS, hero LCP path untouched.

## Verification

```bash
npx prettier --check src/pages/index.astro src/components/sections/MissionSection.astro src/components/sections/WhyGalgosSection.astro src/components/sections/TrustStatsSection.astro src/components/sections/HelpCards.astro src/components/sections/DonationBanner.astro src/components/sections/FeaturedAdoptionDogs.astro src/components/sections/StoriesSection.astro src/components/sections/Hero.astro
npx eslint src/pages/index.astro src/components/sections/
npx stylelint src/styles/components/home.css src/styles/components/mission.css src/styles/components/trust-stats.css src/styles/components/help-cards.css src/styles/components/donation-banner.css src/styles/components/featured-adoption-dogs.css src/styles/components/stories.css src/styles/components/hero.css
npm run test:text
```

Do not run `npm run build`, `astro check`, or Playwright — a sibling agent shares this directory.
`tests/stories-section.spec.ts` covers this page; read it before changing story markup.

## Commit

```
feat(home): restructure homepage hierarchy around one decision path
```

## Report to orchestrator

Final section order with its assigned weight; sections removed and where their content still
lives; mobile screen count before/after; any change to `TrustStatsSection`'s props that T07 must
know about; analytics events affected.
