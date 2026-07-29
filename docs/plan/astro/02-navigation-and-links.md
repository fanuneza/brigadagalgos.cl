# T02 — Centralize navigation, outbound-link behavior, and external URLs

**Wave 1** · branch `wave/1-foundation` · runs in parallel with [T01](01-section-rhythm.md)

## Outcome

One source of truth for site navigation, one path for outbound-link behavior, and zero external
URLs hardcoded inside components. Bounded and mechanical — this is the DRY-leak cleanup the
audit asks for, explicitly **not** a broad abstraction campaign.

## Problem being fixed

Audit finding 6, verified in the repo:

- `src/components/Navbar.astro` defines its `nav` array locally (lines ~8–14) and the drawer
  hand-rolls `target="_blank"` / `rel="noopener noreferrer"` on its social links (~lines 186, 201, 216) despite `AGENTS.md` requiring the shared outbound-link primitives.
- `src/components/Footer.astro` maintains its own hardcoded `<li><a href="…">` navigation list
  (~lines 79–86), overlapping the navbar's set.
- `src/components/sections/FosterPostular.astro` hardcodes `https://forms.gle/3YHPo8KKnCiySbCo6`
  three times (href, `trackDestination`, `data-application-form-url`) while
  `src/config/site.ts` already centralizes `adoptionForm`, `whatsapp`, `instagram`, `facebook`,
  and `esponsor`.

## Owned files

Exclusive.

- `src/config/site.ts`
- `src/components/Navbar.astro`
- `src/components/Footer.astro`
- `src/styles/components/navbar.css`
- `src/styles/components/footer.css`
- `src/components/TrackedLink.astro`
- `src/components/WhatsAppLink.astro`
- `src/components/InstagramLink.astro`
- `src/components/sections/FosterPostular.astro` — **URL substitution only** (see scope 4)
- `src/scripts/navbar.ts` — only if a markup change requires it

## Read-only files

`src/pages/**`, `tests/nav.spec.ts`, `tests/source-hygiene.test.ts`, `AGENTS.md`,
every other consumer of the link components.

## Scope

1. **Navigation source of truth.** Move the navigation entries into `src/config/site.ts` (or a
   sibling `src/config/navigation.ts` if that reads better) as a typed export. Model the fact that
   the two surfaces legitimately differ: the navbar shows a short primary set, the footer shows a
   longer set including `/por-que-galgos/`, `/preguntas-frecuentes/`, and `/blog/`. Express that as
   one list with per-entry placement flags, or two named lists derived from one entry set —
   whichever is clearer. Do **not** force the two menus to become identical; the goal is one place
   to edit a label or URL, not a uniform menu.

2. **Navbar and footer consume it.** Both render from the shared source. Preserve the current
   active-state logic (`Astro.url.pathname`), ARIA labels, drawer semantics, `transition:persist`,
   and every `data-track-*` attribute with its existing `location` value
   (`navbar`, `desktop_nav`, and the mobile-drawer equivalent).

3. **Outbound links via the shared primitives.** Replace hand-rolled `target`/`rel` in the mobile
   drawer with `WhatsAppLink` / `InstagramLink` / `TrackedLink`. If a primitive cannot express
   what the drawer needs (icon slot, drawer-specific class), extend the primitive with an optional
   prop rather than falling back to raw anchors — and keep the prop optional so no other caller
   changes. Sweep `Navbar.astro` and `Footer.astro` for any remaining raw external anchors,
   including the footer credit link, and route them through `TrackedLink` too.

4. **Foster form URL.** Add `fosterForm: "https://forms.gle/3YHPo8KKnCiySbCo6"` to `SITE` and
   replace all three occurrences in `FosterPostular.astro` with the config reference. **Change
   nothing else in that file** — its layout and copy belong to [T06](06-foster-and-contact.md) in
   a later wave. Do not restructure, do not re-order, do not touch its CSS.

5. **Check for other hardcoded external URLs** in `src/components/` and `src/pages/`. Report what
   you find. Move only the unambiguous organizational ones (forms, social, donation platforms).
   Leave editorial/press/blog links, which belong to their content, exactly where they are.

## Constraints

- Everything in `README.md` §5 applies.
- **Zero rendered-output change.** This task must be behavior-identical: same links, same order,
  same labels, same `rel`/`target`, same analytics events and locations. Only the source of the
  data moves.
- Do not start a general abstraction campaign. Navigation data, outbound-link attributes, and
  external URLs only.
- Do not touch `dog-card.css`, `global.css`, or `tokens.css` — T01 owns those this wave.
- No new client JavaScript. Keep `src/scripts/navbar.ts` behavior intact.

## Acceptance criteria

- Editing a nav label or URL requires exactly one edit, in config.
- `grep -rn "forms.gle" src/` returns hits only in `src/config/site.ts`.
- No hand-rolled `target="_blank"` or `rel="noopener` remains in `Navbar.astro` or `Footer.astro`.
- Navbar and footer link sets, order, and labels are byte-for-byte what they render today.
- Every `data-track-event` / `data-track-location` value is preserved.
- `tests/nav.spec.ts` expectations still describe the rendered markup (read it; if your markup
  change would break it, adjust the markup, not the test — and if the test is genuinely wrong,
  stop and report instead of editing it).

## Verification

```bash
npx prettier --check src/config/site.ts src/components/Navbar.astro src/components/Footer.astro src/components/TrackedLink.astro src/components/WhatsAppLink.astro src/components/InstagramLink.astro src/components/sections/FosterPostular.astro
npx eslint src/config/site.ts src/components/Navbar.astro src/components/Footer.astro src/components/TrackedLink.astro src/components/WhatsAppLink.astro src/components/InstagramLink.astro src/components/sections/FosterPostular.astro
npx stylelint src/styles/components/navbar.css src/styles/components/footer.css
npm run test:text
grep -rn "forms.gle" src/
```

Do not run `npm run build`, `astro check`, or Playwright — a sibling agent shares this directory.

## Commit

```
refactor(nav): centralize navigation data and outbound-link behavior
```

## Report to orchestrator

The shape and location of the navigation export; any remaining hardcoded URLs you deliberately
left in place and why; anything in `tests/nav.spec.ts` that looked fragile.
