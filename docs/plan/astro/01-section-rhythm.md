# T01 — Section rhythm, typography, and action hierarchy

**Wave 1** · branch `wave/1-foundation` · runs in parallel with [T02](02-navigation-and-links.md)

## Outcome

Sections stop reading as an undifferentiated stack. The shared foundation gains a small,
explicit vocabulary for **section weight** (primary / secondary / quiet), **card weight**
(elevated / plain), and **action weight** (primary / secondary / tertiary), so later waves can
express hierarchy by choosing a variant instead of inventing one-off CSS per route.

This is the enabling change for the entire plan. Every later task consumes it.

## Problem being fixed

Audit finding 1: the homepage renders eight substantial sections after the hero, all with the
same global vertical spacing and near-identical headline treatment, so adoption, institutional
proof, education, stories, process, foster care, and donation compete at nearly equal weight.
The same uniformity flattens `/donar/` and `/adoptar/`.

## Owned files

Exclusive. No other agent in this wave touches these.

- `src/styles/tokens.css`
- `src/styles/global.css`
- `src/components/PageHero.astro`
- `src/styles/components/page-hero.css`
- `src/components/sections/CtaCard.astro`
- `DESIGN.md`

## Read-only files

Read for context; never edit. `src/pages/index.astro`, `src/pages/donar.astro`,
`src/pages/adoptar.astro`, `src/styles/components/home.css`, `src/styles/components/hero.css`,
`src/styles/components/dog-card.css`, `src/styles/components/stories.css`.

## Scope

1. **Audit the current rhythm first.** Read `tokens.css` and `global.css` and write down what
   already exists: the spacing scale, `.section-padding`, `.container`, heading sizes, `.btn`
   variants. Build on these names. Do not introduce a parallel scale.

2. **Section weight.** Add a small set of modifier classes (e.g. `.section--lead`,
   `.section--support`, `.section--quiet`) on top of the existing section padding, differing in
   vertical rhythm and, where it helps, background treatment. Three levels maximum. Every level
   must be visibly distinct at 390px, not only on desktop.

3. **Section heading treatment.** Give the section eyebrow/heading pair a matching set of weights
   so a supporting section does not shout like a lead section. Apply **selective** uppercase:
   reserve uppercase for eyebrows and short labels, never for section headings or body copy.
   Uppercase Spanish must keep its accents (`ADOPCIÓN`, not `ADOPCION`).

4. **Card weight.** Today most cards get the same elevated treatment, which is a large part of the
   density problem. Add a plainer card variant (flat or hairline-bordered) alongside the existing
   elevated one, and document when each applies. Do not restyle any route-specific card component
   — later waves opt in.

5. **Action hierarchy.** Confirm `.btn` has exactly three usable weights (primary, secondary,
   tertiary/ghost-or-link) with a clear visual gap between them, and that the tertiary weight is
   quiet enough that a card carrying one primary plus one tertiary action reads as a single
   decision. Adjust only what is missing; do not rename existing classes that routes depend on.

6. **`PageHero.astro`.** Make lead/eyebrow/CTA emphasis follow the same weights. Keep the props
   API backwards compatible — every current caller (`/adoptar/`, `/donar/`, `/hogar-temporal/`,
   `/contacto/`, and others) must keep working unchanged. New props must be optional with a
   default matching today's rendering.

7. **`CtaCard.astro`.** Same: a weight/variant prop so a page-tail CTA can be subordinate to the
   page's real conversion action. Default must be the current appearance.

8. **Document it in `DESIGN.md`** — the three section weights, the two card weights, the three
   action weights, and one line each on when to use them. Later waves will be told to follow this
   section, so it must be readable and decisive.

## Constraints

- Everything in `README.md` §5 applies.
- **Backwards compatibility is mandatory.** After this task, every existing page must render
  essentially as it does today unless it opts into a new variant. You are adding vocabulary,
  not applying it. Zero visual regressions is the success condition, not a redesign.
- Preserve the established identity: existing colors, fonts, and the rainbow-divider language stay.
- No component rewrites. No new component files.
- No JavaScript.
- Respect `prefers-reduced-motion`; `src/styles/components/motion.css` stays authoritative.
- Keep dark-theme parity — check any new surface color in both themes.

## Acceptance criteria

- Three section weights, two card weights, three action weights exist, are named consistently,
  and are documented in `DESIGN.md`.
- No existing page changed its rendered output, other than intentional, described refinements to
  the shared heading/eyebrow treatment.
- New props on `PageHero` and `CtaCard` are optional and default to current behavior.
- Contrast passes AA for every new or adjusted foreground/background pair, in both themes.
- No new client JavaScript. No new CSS file. No token renames that break existing selectors.

## Verification

```bash
npx prettier --check src/styles/tokens.css src/styles/global.css src/styles/components/page-hero.css src/components/PageHero.astro src/components/sections/CtaCard.astro DESIGN.md
npx stylelint src/styles/tokens.css src/styles/global.css src/styles/components/page-hero.css
npx eslint src/components/PageHero.astro src/components/sections/CtaCard.astro
npm run test:text
```

Do not run `npm run build`, `astro check`, or Playwright — a sibling agent shares this directory.

## Commit

```
refactor(styles): add section, card, and action weight vocabulary
```

## Report to orchestrator

The exact class/prop names introduced, so W2–W4 briefs can reference them; anything you found
that looks like a regression risk; anything you left alone deliberately.
