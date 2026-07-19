---
target: my site (post-redesign)
total_score: 32
p0_count: 0
p1_count: 3
timestamp: 2026-07-11T06-18-08Z
slug: src-pages-index-astro
---

Method: dual-agent (A: /root/post_design_review · B: /root/post_evidence_review)

## Design Health Score

| #         | Heuristic                       |     Score | Key issue                                                                        |
| --------- | ------------------------------- | --------: | -------------------------------------------------------------------------------- |
| 1         | Visibility of system status     |       3/4 | Filter recovery is clear; gallery position is tiny and consent overlays content. |
| 2         | Match to real world             |       4/4 | Chilean copy, real dogs and concrete rescue language remain excellent.           |
| 3         | User control and freedom        |       3/4 | Filters and galleries work; fixed consent occupies mobile viewport.              |
| 4         | Consistency and standards       |       3/4 | Components are coherent; adoption and donation verbs remain fragmented.          |
| 5         | Error prevention                |       3/4 | Empty-filter recovery works; postulation arrives before fit confidence.          |
| 6         | Recognition rather than recall  |       4/4 | Dog facts, filters and visible labels are strong.                                |
| 7         | Flexibility and efficiency      |       3/4 | First-adopter FAQ route helps, but no direct suitability shortcut exists.        |
| 8         | Aesthetic and minimalist design |       2/4 | Six similar carousel cards and repeated visual grammar still dominate.           |
| 9         | Error recovery                  |       3/4 | Filter recovery is credible; application progress/recovery is absent.            |
| 10        | Help and documentation          |       4/4 | Practical reassurance and guidance are strong.                                   |
| **Total** |                                 | **32/40** | **Clear improvement; composition and high-stakes conversion remain unfinished.** |

## Anti-Patterns Verdict

The site is materially less AI-coded than the previous run. The hero now has one clear action and adoption cards behave as scan tools. It still has one remaining tell: a strong rescue-site component system applied too uniformly. Rounded dark cards, pills, image carousels, colored rules and condensed display headings repeat until the page reads as a themed catalogue rather than a composed story.

The deterministic scan found 19 findings: two warnings and 17 advisories. These are primarily system-documentation issues: seven undocumented colors, two radii, eight type sizes and the undeclared Barlow Fallback font. The JavaScript-populated lightbox image at `src/components/SharedGalleryLightbox.astro:29` remains a likely false positive, but needs no-JavaScript verification. Form-error, backdrop and dynamic-radius values should be documented or tokenized, not blindly removed.

Headless screenshots disagreed about the mobile adoption header: one capture showed blank space; the existing 390px regression capture showed logo, theme and menu controls. Treat this as a capture/race condition until it can be reproduced in a real browser, rather than calling it a confirmed regression.

## Overall Impression

The homepage now starts in the right order: meet a dog, then discover alternatives, then receive reassurance. The next ceiling is editorial judgment. It needs fewer proof cards and more confidence that one human story, one available dog, and one next step can carry a page.

## What's Working

- “Conoce a los galgos” is correctly singular and dominant.
- The simplified adoption cards are a major improvement: photo, facts, one next step.
- The first-adopter guidance is useful, naturally written and placed near the grid.
- Photography and tone still make the organisation feel local and trustworthy.

## Priority Issues

### [P1] Proof overload arrives before a story

**What:** “Historias con final de hogar” immediately renders six near-identical carousel cards.

**Why it matters:** On mobile, repeated image/arrows/dots/name/text blocks consume the emotional momentum created by the hero and delay the next useful action.

**Fix:** Feature one success story as an editorial moment and show at most two supporting stories. Move the rest behind a deliberate “Ver historias de adopción” route.

### [P1] Adoption language still commits too early

**What:** The adoption page hero says “Postular,” while cards say “Conocer a {nombre}”.

**Why it matters:** Uncertain adopters need exploration and fit confidence before an application ask.

**Fix:** Change the page-hero action to scroll toward the dogs or frame it as finding a compatible galgo. Reserve “Postular” for a dog profile after eligibility context.

### [P1] Consent is still a viewport obstruction

**What:** The fixed mobile consent banner obscures the lower portion of the active card/content.

**Why it matters:** It makes emotional content and gallery controls feel physically constrained.

**Fix:** Use a compact, temporary consent sheet with equal actions and clearer vertical economy; retain legal clarity without treating the banner as permanent chrome.

### [P2] Visual grammar is still mechanically uniform

**What:** Hero → colored rule → eyebrow → display heading → rounded surface repeats across routes.

**Why it matters:** The identity is coherent but too predictable to feel art-directed.

**Fix:** Preserve cards for dog listings. Make mission, process and trust sections flatter, more typographic and spatially distinct; use the divider once per narrative rather than as global punctuation.

### [P2] Interaction furniture competes with dog photography

**What:** Listing galleries expose large arrow controls and a dot tray on every multi-image card.

**Why it matters:** The controls compete with the dogs’ faces and make authentic photography read like a stock carousel module.

**Fix:** Reveal arrows on hover/focus for desktop, retain swipe/keyboard support, and use a single representative image on summary listings where a gallery is not essential.

## Persona Red Flags

**Jordan, first-time adopter:** “Postular” remains the adoption-page hero action before compatibility has been established.

**Camila, apartment/cat household:** The FAQ route helps, but suitability remains a secondary text link instead of a guided first action.

**Diego, donor:** “Donar” and “Voy a apoyar un galgo” still split the same mental model before one-off versus recurring support becomes clear.

## Questions to Consider

- Would showing one dog who needs a family now convert better than six dogs already home?
- Is Brigada a catalogue of proof, or a calm companion helping someone take a difficult first step?
- Where should the site earn color and giant type, rather than use them as the default grammar?
