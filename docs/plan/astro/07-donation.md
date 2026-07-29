# T07 — Donation: one clear decision, proof kept but compressed

**Wave 4** · branch `wave/4-donation` · single agent, no parallel sibling

## Outcome

`/donar/` makes one-time transfer and monthly support immediately comparable and easy to complete.
Transparency stays — it is the page's real strength — but stops diluting the decision.

## Problem being fixed

Audit finding 5, verified in the repo. `src/pages/donar.astro` renders `PageHero` →
`DonationCards` → `ImpactSection` → `TrustStatsSection` → a tail `CtaCard` with three "otras
formas de ayudar" items. Inside those:

- `DonationCards`: suggested amounts, a "Recomendado" transfer card with six copyable bank rows
  and a copy-all button, an eSponsor monthly card, and a transparency note.
- `ImpactSection`: four "en qué se transforma tu ayuda" cards **plus** three "en qué no gastamos"
  cards — seven cards, two `h2`s, in one section.
- `TrustStatsSection`: four organizational stats (`años activas`, `mujeres coordinando`,
  `rescates`, `galgos en adopción`) — the same block the homepage shows.

Credible, but the primary donation decision is buried under consecutive proof sections, and the
stats block duplicates the homepage verbatim.

## Owned files

Exclusive.

- `src/pages/donar.astro`
- `src/components/sections/DonationCards.astro` + `src/styles/components/donation-cards.css`
- `src/components/sections/ImpactSection.astro` + `src/styles/components/impact-section.css`
- `src/scripts/copy-data.ts` — only if a markup change requires it

## Read-only files

`src/components/sections/TrustStatsSection.astro` + `src/styles/components/trust-stats.css`
(**[T05](05-homepage-hierarchy.md) owns these; wave 3 is already merged — consume whatever shape
they now have, including any variant prop T05 added, but do not edit them**),
`src/components/sections/CtaCard.astro` (T01 owns it — consume its variants),
`src/config/site.ts`, `DESIGN.md`, `docs/prd.md`.

Read T05's report before starting: if `TrustStatsSection` gained a variant prop, use it here
instead of restyling.

## Scope

1. **Make the two donation paths one comparable decision.** Transfer and monthly support should
   sit side by side, visually parallel, immediately after the hero — same card weight, same visual
   language, differing only in the label that says which is which. Today the transfer card carries
   a "Recomendado" badge and a dense bank table while the eSponsor card is short; they do not read
   as two options of one choice. Balance them without hiding the bank data.

2. **Keep the bank data usable.** All six rows stay verbatim (Nombre, RUT, Banco, Tipo de cuenta,
   Número de cuenta, Correo). The per-row `data-copy-value` copy affordance and the copy-all button
   stay working, along with the `aria-live` confirmation. If the table dominates the layout,
   consider a `<details>` disclosure that is **open by default** — never one that hides the data
   behind a required click, and never JavaScript-gated.

3. **Compress the impact proof.** `ImpactSection` is doing two jobs. Keep "en qué se transforma tu
   aporte" as concise, scannable evidence directly after the decision. Move "en qué no gastamos"
   below it at lower weight — the exclusions are excellent transparency but they are secondary
   proof, not a co-equal `h2` section. Preserve every claim's wording; you are re-weighting, not
   rewriting.

4. **Deduplicate the statistics.** The four stats already appear on the homepage. On `/donar/`,
   keep only what actually supports a donation decision and drop the rest, or drop the section
   entirely if the impact evidence above already carries it. Do not alter any number. `años
activas` and `galgos en adopción` are computed (`new Date().getFullYear() - 2023`,
   `getActiveDogs().length`) — if you drop the section here, that computation must still work on
   the homepage.

5. **Keep alternative help subordinate.** The tail `CtaCard` with materials / services / difusión
   stays, but at clearly lower weight than the donation decision. Use `CtaCard`'s weight variant
   from T01.

6. **Hero anchor.** `PageHero` links `ctaHref="#datos-transferencia"`. That `id` lives on the
   transfer card — it must survive any restructuring.

## Constraints

- Everything in `README.md` §5 applies.
- **No payment processing.** No new provider, no embedded checkout, no client-side payment JS.
  eSponsor stays an outbound `TrackedLink`.
- **No invented financial claims.** Do not add amounts, percentages, cost breakdowns, tax-benefit
  statements, or impact figures that are not already on the page. Removing a repeated claim is
  allowed; adding one is not. Numbers are copied character for character.
- Bank details must remain complete and copyable, and readable with JavaScript disabled — the copy
  buttons are an enhancement, not the access path.
- Preserve `donation_*` analytics events and the eSponsor outbound tracking (`trackOutbound`).
- Do not edit `TrustStatsSection.astro` or `trust-stats.css` — remove or keep its usage in
  `donar.astro` only.
- One `h1` (the hero). Section headings `h2`, card titles `h3`. Watch for skips after
  re-weighting the exclusions block.
- No new client JavaScript beyond what `copy-data.ts` already does.

## Acceptance criteria

- One-time transfer and monthly support are visually parallel and comparable above the fold on
  desktop and within the first screen-and-a-half at 390px.
- Full bank data visible without interaction; copy affordances still work; `aria-live` intact.
- `#datos-transferencia` anchor resolves from the hero CTA.
- Impact evidence is concise; exclusions present but clearly secondary.
- Statistics no longer duplicate the homepage at equal weight.
- Alternative help is present and subordinate.
- Every figure on the page is byte-identical to before, or absent.
- No payment integration added; no new JS; page fully usable with JS off.

## Verification

```bash
npx prettier --check src/pages/donar.astro src/components/sections/DonationCards.astro src/components/sections/ImpactSection.astro src/styles/components/donation-cards.css src/styles/components/impact-section.css
npx eslint src/pages/donar.astro src/components/sections/DonationCards.astro src/components/sections/ImpactSection.astro
npx stylelint src/styles/components/donation-cards.css src/styles/components/impact-section.css
npm run test:text
npm run build
```

This wave has no parallel sibling, so `npm run build` is safe and **required** here.

## Commit

```
feat(donar): lead with the donation decision and compress secondary proof
```

## Report to orchestrator

The final section order; what you removed from the stats and why; confirmation that every figure
and bank field is unchanged; anything that needs a `docs/prd.md` update.
