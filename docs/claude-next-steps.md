# Claude Next Steps — Post-Fable-Plan

**Last updated:** 2026-07-06 (after plan merge into main)

This document captures findings from the 16-task Fable Plan implementation that warrant follow-up work or human review.

---

## Open Decisions (Require Your Input)

### Copy: Profile CTA "Me interesa {name}" (Verb-First Question)

**Context:** The profile page CTA copy is `"Me interesa {name}"` — this matches the plan's literal requirement and the existing adoption-grid card pattern, but it's not strictly verb-first per the site's voice constraints (verb-first would be something like `"Adopta a {name}"` or `"Escríbenos por {name}"`).

**Action:** Either:
- Accept the current copy as a deliberate exception (shared pattern with the card), or
- Change **both** the profile CTA and the adoption-grid card to verb-first (consistency across both contexts).

**Files:** `src/pages/adoptar/[slug].astro:174` (profile) and `src/components/sections/AdoptionGrid.astro:90` (card).

---

## External Commits on main (Not Part of Plan)

Two commits were authored outside this plan workflow and landed on main during session gaps:

### Commit d32d944 (2026-07-06 11:19)
- **Message:** `refactor: enhance AdoptionIntro component for improved user experience`
- **What:** Contains the plan file commit (`docs/fable-plan.md`).
- **Status:** Verify this was intentional and the plan doc is on main as you wanted.

### Commit c7bf8ac (2026-07-06 18:39)
- **Message:** `refactor: clean up code formatting and improve component structure across various files`
- **What:** Prettier rewraps mixed with semantic changes:
  - Removed `hideExternalIndicator` from the eSponsor `TrackedLink` in `DonationBanner.astro:32`
  - Wrapped `SupportersCtaSection` content in a `.cta-card` div and deleted the `.supporters-cta .container--narrow` card CSS
  - Removed `max-width: 640px; margin-inline: auto` from hogar-temporal CTA block styling
- **Verify:** Confirm these structural changes were intentional. Note: the eSponsor link now displays both the global `↗` CSS indicator AND the `sr-only` "(abre en una nueva pestaña)" span — check if that's the desired outcome.

---

## Pending Human Visual Verification

The following were verified by cascade analysis and automated tests, but need human eyeball confirmation in the browser:

1. **Theme toggle (`light-dark()` refactor)**
   - Verify navbar theme button still works and all colors flip correctly in both light and dark modes
   - Check: footer, magic CTA band, cookie banner, all sections
   - Test at `/`, `/adoptar/`, `/donar/`

2. **Hero layout (mobile / desktop)**
   - Mobile (390px): photo should appear between lead text and CTAs (new source order)
   - Desktop (1440px): photo stays right, text+actions stay left
   - Command: `npm run capture:home` and compare against `.cache/parity/` references

3. **Scroll reveals (motion.css)**
   - Visit `/` and `/adoptar/` at 1440px, scroll slowly and watch cards fade+rise as they enter viewport
   - Visit with OS reduced-motion enabled: cards should NOT animate, render static
   - Test on devices/browsers that don't support `animation-timeline: view()` (older Safari, older Chrome) — page should degrade to static cards with no errors

4. **Share button clipboard fallback**
   - Desktop (no Web Share API): Click "Compartir a {name}" on a profile page
   - Expected: URL copied to clipboard, a toast appears "Enlace copiado. Compártelo donde quieras."
   - Command: `npm run preview` and navigate to any dog profile

---

## Gate & Performance Tweaks (Optional Improvements)

### Lighthouse Local Flakiness

`npm run test:lighthouse` flakes at performance 0.99 on **one page per run** (the failing page moves between runs: `/`, `/donar/`, `/hogar-temporal/` observed). The page-hero LCP sits near a scoring-curve boundary (~1650–1850 ms) and single runs are load-sensitive.

**Current:** `.lighthouserc.cjs` has `numberOfRuns: 1` and `minScore: 1`.

**Durable fix (not yet applied):** Either:
- Option A: `numberOfRuns: 3` in `.lighthouserc.cjs` — lhci will aggregate by median, eliminating the noise.
- Option B: Relax only the performance category to `["error", { minScore: 0.98 }]` on documented borderline-LCP pages.

**For now:** If a local run shows exactly one page at 0.99, re-run once before treating it as a regression. If the same page fails again or CLS warns appear, investigate.

### Unused CSS Rules (Already Handled)

`.lighthouserc.cjs` has `"unused-css-rules": "warn"` (demoted from error). This is intentional — global component CSS bundling trips this audit by design. It remains visible but non-blocking.

---

## Deferred Minors (Fine to Leave, Not Blockers)

These were flagged during review but judged safe to defer:

1. **Regex escape style in voice guard** (`scripts/check-text-quality.mjs:34,38-39`)
   - Uses `á`/`é` instead of literal accents; functionally identical and keeps the file trivially ASCII-safe.
   - Fix: Optional refactor to literal characters next time the file is touched.

2. **Unconsumed `data-dog-name` attribute** (`src/pages/adoptar/[slug].astro:176`)
   - On the WhatsApp link; inert now but consumable by GTM DOM variables or future analytics.
   - Fix: No action needed; it's a hook for later.

3. **`dog_share_click` analytics fires before share completes** (`src/scripts/share-dog.ts`)
   - Plan-mandated; measures intent (which is the useful funnel signal anyway).
   - Fix: Accepted trade-off; no action needed.

4. **Stale `docs/developer-reference.md`** 
   - Event list is missing `dog_profile_click`, `dog_share_click`, and new locations (`dog_profile`, `blog_empty`).
   - Fix: Add these entries next time the file is touched (not a build blocker).

5. **Interleaved type-role rules in global.css**
   - Role classes are contiguous in their own block; remaining interleaving is pre-existing structure.
   - Fix: Optional housekeeping; no functional impact.

6. **Blog post semantic structure** (`src/pages/blog/[id].astro`)
   - The `<article>` contains only the header; the body `<Content />` lives in a sibling `<section>`. Semantically the article should wrap both.
   - Fix: Worth fixing when the first real blog post ships (not a blocker for launch).

---

## Summary

The plan shipped successfully; all 16 tasks are in `main` and tested. The above captures what remains for polish, verification, and future iteration. None of these items block shipping or pose correctness risks.
