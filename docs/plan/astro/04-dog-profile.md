# T04 — Dog profile: suitability hierarchy and conversion

**Wave 2** · branch `wave/2-dog-surfaces` · runs in parallel with [T03](03-adoption-listing.md)

## Outcome

`/adoptar/<slug>/` becomes the page where a visitor decides. Existing content is separated into
clear reading groups, and direct application becomes the profile's unmistakable primary action.

## Problem being fixed

Audit finding 3, verified in the repo. `src/pages/adoptar/[slug].astro` compresses everything into
a single `dog-profile__info` column: eyebrow, `h1`, four chips, `details`, `characterSketch`,
Instagram link, three side-by-side CTAs (Postular / WhatsApp / Compartir, all `.btn`), a share
live region, and the reassurance paragraph. Below that, `AdoptionProcess` repeats the generic
adoption process already shown on `/adoptar/`.

Everything needed is there. It is the **grouping and weighting** that is missing.

## Owned files

Exclusive.

- `src/pages/adoptar/[slug].astro`
- `src/styles/components/dog-profile.css`
- `src/components/sections/AdoptionProcess.astro`
- `src/styles/components/adoption-process.css`
- `src/scripts/share-dog.ts` — only if your markup change requires it

## Read-only files

`src/utils/dog-content.ts` (**frozen**), `src/content.config.ts`, `src/content/dogs/*.md`,
`src/components/DogCard.astro` and `src/styles/components/dog-card.css` (**T03 owns them this
wave — do not edit, even though `[slug].astro` imports `dog-card.css` for the chips**),
`src/components/SharedPhotoGallery.astro`, `src/utils/structured-data.ts`,
`tests/dog-profile.spec.ts`, `DESIGN.md`.

## Scope

1. **Three reading groups**, built from existing fields only:
   - **Datos clave** — the practical facts: `sex`, `age`, `weight`, and the other verified
     attributes already rendered as chips. Present them so they can be scanned in seconds.
   - **Sobre {name}** — the character and rescue context, from `characterSketch` and `details`.
     This is where humane storytelling lives. Do not shorten it into a spec sheet.
   - **Lo que necesita ahora** — the current need (`currentNeed`), today buried as a fourth chip
     among the physical attributes even though it is the most decision-relevant fact on the page.
     Give it its own visible weight.

   Use whichever of the three headings the actual data supports. If a dog has no content for a
   group, the group must not render an empty shell.

   **Verify field availability before designing the layout**: read `src/utils/dog-content.ts` and
   several files in `src/content/dogs/` to confirm which fields are consistently populated across
   dogs. A group that is empty for most dogs is not a group. Report what you found.

2. **Conversion hierarchy.** "Postular" is the single primary action, visible without scrolling on
   mobile or reachable via a clearly-signposted position. WhatsApp becomes secondary. "Compartir"
   becomes tertiary — it is a share utility, not a conversion, and should not sit at button weight
   beside the application CTA. Keep all three; change their weight (T01's action vocabulary).

3. **Preserve the reassurance copy** ("Te preguntamos por tu rutina y tu casa para que {name} esté
   seguro…"). Place it near the application action, where it does its job — that is
   post-adoption/anti-anxiety messaging and it stays.

4. **`AdoptionProcess` on the profile.** It currently repeats `/adoptar/`'s generic process at full
   weight. Either render a compact variant on the profile (add an optional `variant` prop,
   defaulting to today's full rendering so `/adoptar/` is unaffected) or replace it on the profile
   with a short reassurance + link to `/adoptar/#proceso`. Do not delete the component and do not
   change how `/adoptar/` renders it — T03 owns that page this wave.

5. **Gallery.** Keep `SharedPhotoGallery` and its `transitionName={`dog-photo-${dog.id}`}` exactly
   as-is: the ClientRouter image morph from the listing card depends on it. Do not change the
   gallery component or its props contract.

6. **Structured data, canonical, OG image, breadcrumbs.** All preserved. `buildDogMetaDescription`
   and `breadcrumbNames` keep working unchanged.

## Constraints

- Everything in `README.md` §5 applies.
- **Content model frozen.** No new fields. No new frontmatter. No invented facts about any dog.
  If a group truly cannot be built from existing data, drop the group and report it — do not
  extend the schema.
- Exactly one `h1` (the dog's name). Group headings are `h2`. No heading skips.
- Keep the share button's `aria-live` region and `data-share-dog` contract; `share-dog.ts` must
  keep working. It is the only client script on this page — do not add another.
- Redirect coverage for retired/hidden dogs stays untouched.
- Do not edit `dog-card.css` (T03 owns it). If a chip style must change for the profile, do it in
  `dog-profile.css` with a profile-scoped selector.

## Acceptance criteria

- The profile reads as three (or documented fewer) labeled groups, not one column.
- `currentNeed` is visible as a distinct, weighted element rather than a fourth attribute chip.
- One primary action; WhatsApp secondary; share tertiary.
- The generic adoption process no longer repeats at full weight on the profile.
- Reassurance copy present and adjacent to the application action.
- Structured data, canonical URL, OG image, and breadcrumbs unchanged in output.
- No new client JavaScript. Page fully readable with JS off.
- `tests/dog-profile.spec.ts` passes against your markup (read it first; adapt markup, not the
  test — if the test is genuinely wrong, stop and report).

## Verification

```bash
npx prettier --check "src/pages/adoptar/[slug].astro" src/components/sections/AdoptionProcess.astro src/styles/components/dog-profile.css src/styles/components/adoption-process.css
npx eslint "src/pages/adoptar/[slug].astro" src/components/sections/AdoptionProcess.astro
npx stylelint src/styles/components/dog-profile.css src/styles/components/adoption-process.css
npm run test:text
```

Do not run `npm run build`, `astro check`, or Playwright — a sibling agent shares this directory.

## Commit

```
feat(dog-profile): group profile content and clarify the conversion action
```

## Report to orchestrator

Which fields are reliably populated across dogs and which groups you could therefore build; how
you handled `AdoptionProcess`; any dog whose content leaves a group thin; anything T03 must match.
