# Open decisions from the Astro UX hierarchy pass

Two items from the wave-based UX hierarchy implementation (`docs/plan/astro/`) that shipped
deliberately but are not settled. Both are reversible. Neither blocks anything today.

Recorded 2026-07-29, against `main` at `59c9b74`.

---

## 1. Uppercase section headings were kept, against the task text

**Status:** shipped as a deliberate deviation from [T01](astro/01-section-rhythm.md). Needs a
product call to close.

### What the task asked for

T01 scope item 3 said, verbatim:

> Apply **selective** uppercase: reserve uppercase for eyebrows and short labels, never for
> section headings or body copy.

### What shipped

Uppercase on headings stayed global. `src/styles/global.css` still carries:

```css
h1,
h2,
h3 {
  font-family: var(--font-display);
  text-transform: uppercase;
  /* … */
}
```

Instead of removing it, T01 added an **opt-in escape hatch**: `.section-heading--quiet` sets
`text-transform: none` and drops to sentence case at 1.75rem. Nine headings across the site
currently opt in, out of 211 `h1`–`h3` elements inside `<main>` across 20 pages.

### Why the implementing agent deviated, and why I let it stand

Three reasons, in order of weight:

1. **The backwards-compatibility constraint outranked the scope item.** T01's own acceptance
   criteria required that "no existing page changed its rendered output" and stated "zero visual
   regressions is the success condition, not a redesign." Removing uppercase from every `h2` and
   `h3` on the site is the single largest visual change available in that file — it would have
   violated the task's own success condition to satisfy one of its scope bullets.

2. **`DESIGN.md` §3 defines uppercase display type as brand identity**, not as decoration:
   - _Display:_ "peso 900 y escala fluida… usa mayúsculas"
   - _Headline:_ "Para títulos de sección, con la misma voz condensada y mayúsculas"

   The invariant list in the plan's README requires preserving "the established identity."

3. **`DESIGN.md` §6, as written, permits it.** The shipped rule reads: "Las mayúsculas se reservan
   para cejas, etiquetas breves y titulares display. Nunca para texto corrido." Display headings
   are explicitly allowed. The rule that shipped is narrower than T01's task text — it bans
   uppercase for body copy, not for section headings.

So the deviation is real, but it is a conflict _between two instructions in the same task file_,
resolved in favor of the one T01 labelled non-negotiable.

### What is genuinely unresolved

Whether uppercase `h2`/`h3` is right for this site is a **typography and brand question that was
never actually decided** — it was inherited, and the audit did not challenge it directly. The
audit's finding was that section headings were _undifferentiated_, which the weight vocabulary
fixed independently of casing.

### To close this

Pick one:

- **Keep it (status quo).** No work. Optionally tighten T01's wording in the task file so the
  archive does not read as an unaddressed miss.
- **Reverse it.** Remove `text-transform: uppercase` from the `h1, h2, h3` rule in
  `src/styles/global.css`, then invert `.section-heading--quiet` (it becomes the _uppercase_
  opt-in, or is deleted). This is a genuine redesign touching every page: re-run
  `npm run build`, all captures, and Lighthouse, and expect real visual diffs on all 20 pages.
  Accents must survive — `ADOPCIÓN`, never `ADOPCION`.

Related: `.btn--ghost` uses full-strength `--color-text` at bold weight and reads louder than
ideal beside a primary. Toning it to `--color-text-muted` would touch roughly ten call sites.
Left alone for the same backwards-compatibility reason; worth bundling into whichever choice
above is made.

---

## 2. `TrustStatsSection`'s `full` variant was unreferenced

**Status:** resolved 2026-07-29 — pruned in T13.

### How it happened

[T05](astro/05-homepage-hierarchy.md) added `variant?: "full" | "compact"` to
`src/components/sections/TrustStatsSection.astro`, defaulting to `"full"` so the existing
consumers kept byte-identical output. At that moment there were two consumers: the homepage
(which moved to `compact`, rendered inside `MissionSection`'s slot) and `/donar/`.

[T07](astro/07-donation.md) then removed the stats block from `/donar/` entirely, on the grounds
that none of the four figures supports a donation decision specifically and the impact section
above already carries the proof.

The two agents ran in different waves and neither could see the other's outcome. The result is
correct on both counts — and leaves the default branch with no callers.

### State when recorded

```
src/pages/index.astro:105:    <TrustStatsSection variant="compact" />
```

That is the only usage in the repository. The `full` branch, and the `.trust-stats` /
`.stat-card` CSS in `src/styles/components/trust-stats.css` that serves it, render nowhere.

There is also a **stale comment** inside the component's `Props` interface:

```ts
/**
 * `full` is the standalone section (default, unchanged — `/donar/` relies on it).
 */
```

`/donar/` no longer relies on it. This sentence is false as written and should be corrected
regardless of which option below is chosen.

### Why it was not pruned during integration

Deleting a component branch plus its CSS is a behavior-affecting change, not a coherence fix. It
belongs in a deliberate cleanup with its own verification, not appended to the tail of an
eight-commit refactor whose stated goal was hierarchy. The four figures (`{yearsActive}+`, `6`,
`100+`, `{adoptionDogCount}`) and the derived `getActiveDogs()` / `yearsActive` logic all still
compute correctly for the compact path, so nothing is broken.

### Resolution

T13 removed the unused full branch, its `variant` prop and its unreferenced
`.trust-stats` / `.stat-card` CSS. The homepage remains the sole consumer and now renders the
compact strip directly. A future standalone statistics section can be rebuilt from the content
and visual evidence that supports the route where it is needed.
