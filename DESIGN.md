---
name: Brigada Galgos
description: Sistema visual cercano, enérgico y confiable para rescate y adopción responsable de galgos en Chile.
colors:
  primary-cyan: "#00bcd4"
  primary-cyan-deep: "#006d78"
  primary-cyan-soft: "#cff4f8"
  secondary-magenta: "#e91e8c"
  secondary-magenta-deep: "#b8156d"
  secondary-magenta-soft: "#fcdcec"
  action-orange: "#ffa726"
  action-orange-deep: "#a85400"
  action-orange-soft: "#ffe7c2"
  rescue-green: "#43a047"
  rescue-purple: "#8e24aa"
  background: "#ffffff"
  surface: "#f5f6f8"
  surface-raised: "#eceef2"
  ink: "#1f2328"
  muted-ink: "#424a54"
  border: "#dadde3"
typography:
  display:
    fontFamily: '"Barlow Condensed", "Impact", sans-serif'
    fontSize: "clamp(3rem, 8vw, 4.25rem)"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "0em"
  headline:
    fontFamily: '"Barlow Condensed", "Impact", sans-serif'
    fontSize: "clamp(2.5rem, 4vw, 3rem)"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "0em"
  body:
    fontFamily: '"Barlow", "Segoe UI Variable", sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  lead:
    fontFamily: '"Barlow", "Segoe UI Variable", sans-serif'
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.75
rounded:
  sm: "6px"
  md: "12px"
  lg: "20px"
  xl: "28px"
  full: "9999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "24px"
  6: "32px"
  7: "40px"
  8: "48px"
  9: "64px"
  10: "80px"
  12: "96px"
  16: "128px"
components:
  button-primary:
    backgroundColor: "{colors.action-orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.primary-cyan-soft}"
    textColor: "{colors.primary-cyan-deep}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
    height: "48px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
    height: "48px"
  story-card:
    backgroundColor: "{colors.background}"
    rounded: "{rounded.lg}"
---

# Design System: Brigada Galgos

## 1. Overview

**Creative North Star: "El refugio en movimiento"** (the shelter in motion)

The system combines the warm energy of a rescue organization with the calm needed by someone considering adopting, donating, or opening their home temporarily. Each galgo's photography is the primary point of contact; color directs action, and the condensed typeface makes the voice feel human, determined, and recognizable.

The interface must be clear from the first scroll and built for mobile without becoming small or timid on large screens. It uses a clean neutral base, very soft flashes of cyan and magenta, and orange for the primary decisions. It rejects any appearance of a distant NGO, guilt-driven campaigns, empty drama, and any ornament that overshadows the dogs or complicates the next step.

**Key Characteristics:**

- Close, optimized photography as emotional and practical proof.
- Compact, expressive type for headings, with a warm, highly legible body face.
- A controlled pop palette: cyan, magenta, and orange serve distinct functions.
- Direct, large CTAs with human language.
- Curved surfaces, soft elevation, and accessible navigation.

## 2. Colors

The palette draws the brand's energy without turning every screen into a rainbow: color always clarifies an action, a hierarchy, or a state.

### Primary

- **Companion cyan:** carries active links, secondary actions, focus rings, and background accents. It is the wayfinding color, not the dominant fill.
- **Deep cyan:** supports text and borders on light backgrounds when real contrast is needed.

### Secondary

- **Momentum magenta:** marks callout bands, editorial moments, and high-impact accents. Use it to focus attention, not as a substitute for cyan.
- **Deep magenta:** reserved for sustained CTA surfaces and higher-contrast states.

### Tertiary

- **Action orange:** the only primary fill for CTAs that ask for a decision. Keep dark text on top.
- **Journey green and purple:** distinguish milestones, chips, and illustrations; they must not become body text or page backgrounds.

### Neutral

- **White and cool surface:** support reading, photography, and separation between sections.
- **Ink and muted ink:** carry all normal reading; never replace muted ink with paler grays.
- **Cool border:** separates cards, fields, and controls with a hairline.

**The Purposeful Palette Rule.** Every saturated color must have a job: guide, request action, mark a milestone, or accompany an image. If it has no job, it is not used.

## 3. Typography

**Display Font:** Barlow Condensed, with Impact as fallback.
**Body Font:** Barlow, with a system stack as fallback.

Both families load through the Astro Fonts API (see `fonts` in `astro.config.mjs`), which automatically generates metric-matched optimized fallbacks for the two families, so the font swap causes no layout shift.

**Character:** Barlow Condensed brings a strong, direct, street-sign voice to headlines. Barlow keeps the rest of the conversation clear, warm, and easy to read. The pairing keeps the logo's energy without dressing the content up as an institutional campaign.

### Hierarchy

- **Display:** 900 weight, fluid scale. Only for the page title or the message that must be seen before reading; uses uppercase and `text-wrap: balance`.
- **Headline:** 900 weight, fluid scale. For section titles, with the same condensed voice and uppercase.
- **Title:** weight 700 to 900 between 1.125rem and 1.375rem. For galgo names, cards, and featured controls.
- **Body:** weight 400 at 1rem with 1.55 line height. Keep reading text in narrow containers and avoid blocks longer than 75 characters per line.
- **Lead:** 1.125rem with 1.75 line height. It clears up doubts and sets up a CTA; it does not repeat the headline.

**The Human Headline Rule.** Headlines may be emphatic, but the body must answer the practical question that follows. Never use display type as decoration disconnected from a real decision.

## 4. Elevation

Depth is soft and structural. Cards, the featured photo, the mobile menu, and the sticky bar may lift to clarify hierarchy or interaction; the rest of the page stays flat and lets the images breathe. Light is built with low-opacity bluish shadows and surface layers, not decorative glass.

### Shadow Vocabulary

- **Light contact:** a short shadow for controls or surfaces just separating from the background.
- **Card and active bar:** a medium shadow for cards on interaction and navigation on scroll.
- **Panel and modal:** a wide shadow for the mobile drawer and layers that must sit unambiguously above the document.
- **Focus ring:** a 3px cyan halo. Mandatory on keyboard-navigable controls.

**The Earned Elevation Rule.** Every shadow must explain a spatial relationship or a state. Diffuse glow used only to look modern is forbidden.

## 5. Components

### Buttons

Buttons are rounded, sturdy, and verbal. They keep a 48px minimum height so the action feels easy to tap.

- **Shape:** full pill (9999px), with 12px by 24px internal padding.
- **Primary:** orange fill with dark ink. Use it for adopting, applying, donating, or sending.
- **Secondary:** soft cyan background, deep cyan border and text. Use it for alternative routes that still matter.
- **Ghost:** no permanent fill or border. Use it for low-pressure details, like viewing a profile.
- **Hover / Focus:** fast transitions with a pronounced ease-out curve; visible focus via the cyan halo, never by color alone.

### Chips

Filters and short data points use compact capsules to allow exploration without turning the page into a table.

- **Style:** surface or functional-tint background, legible text, and a hairline border when separation is needed.
- **State:** the active chip must change color and `aria-pressed`; do not communicate selection through a subtle tone shift alone.

### Cards / Containers

Cards are containers for a real case, not repeated decoration.

- **Corner Style:** generous curve (20px) and a 1px border, the same across adoption, featured, and success-story cards.
- **Background:** white fill over slightly cool surfaces.
- **Shadow Strategy:** discreet elevation at rest (`--shadow-sm`) and a gentle lift on hover.
- **Internal Padding:** 24px for textual content (16px on mobile).
- **Image Behavior:** the photo fills a clear, cropped region with `object-fit: cover`; gallery controls overlay it with high contrast. On hover (or keyboard focus) the photo zooms subtly, always gated on `prefers-reduced-motion: no-preference` and a real hover-capable pointer.
- **Hierarchy:** the galgo's current need reads as an uppercase eyebrow above the name; the sex, age, and weight chips are metadata and do not mix with that eyebrow. The profile opens from the name and from the ghost CTA.
- **Class Systems:** `DogCard` uses only `dog-card__*` classes and `StoryCard` only `story-card__*`; each card family is styled independently even when they share tokens.

### Inputs / Fields

Contact fields must feel simple and safe: visible label, legible content, and a clear path from name to message.

- **Style:** label before the control, clean surface, single-line border, and medium radius.
- **Focus:** visible cyan halo with sufficient contrast. An error may never depend on color alone.
- **Error / Disabled:** explain the state with text and semantic association in addition to visual styling.

### Navigation

Navigation keeps the visitor oriented without competing with the cause.

- **Style:** 64px sticky bar with a translucent surface background and a fine bottom line.
- **Desktop:** clear text links and a visible donation CTA.
- **Mobile:** a 40px circular button that opens a 320px side panel as a modal dialog, with an explicit close and a locked background.
- **Theme:** the theme control lives in the bar, and tokens must respond in both light and dark.

### Shared gallery

The gallery lets visitors get to know each galgo without leaving the profile or card context.

- **Style:** a leading image, dark circular controls, and progress dots over the photography.
- **Behavior:** images open for detail viewing; text alternatives and keyboard control are mandatory.

## 6. Hierarchy: section, card, and action

A page cannot have eight sections that weigh the same. This vocabulary exists so each route
declares what is primary, what supports it, and what is a marginal note, by picking a variant
instead of inventing per-page CSS. Everything is optional: without a modifier, nothing changes.

### Section weight

Modifiers layered onto `.section-padding`. Three levels, no exceptions.

- **`.section--lead`** — the page's decision. Generous vertical rhythm (80px mobile / 96px
  desktop). At most one or two per route.
- **`.section--support`** — content that backs that decision: proof, process, context. It
  exactly reproduces the historical rhythm (64px / 80px), so adding it changes nothing.
- **`.section--quiet`** — asides, footnotes, service links. A short rhythm (40px / 48px) over
  a barely perceptible tint (`--section-quiet-bg`) that sets it apart without lighting it up.

### Heading and eyebrow weight

The eyebrow + heading pair follows the same axis, so a support section does not shout like a
lead one.

- **`.section-heading--lead`** — fluid headline scale, uppercase display.
- **`.section-heading--support`** — one step down, same condensed voice.
- **`.section-heading--quiet`** — 1.75rem in sentence case, no uppercase.
- **`.eyebrow--lead` / `--support` / `--quiet`** — deep cyan, muted ink, and lighter muted
  ink, respectively.

**The selective uppercase rule.** Uppercase is reserved for eyebrows, short labels, and display
headings. Never for body copy. Spanish uppercase keeps its accents always: `ADOPCIÓN`, never
`ADOPCION`.

### Card weight

Two levels. Elevation is a scarce resource; if everything floats, nothing stands out.

- **`.card` + `.card--elevated`** — its own background, hairline border, and contact shadow.
  For a real case that invites a decision: a galgo, a story, a contact path.
- **`.card` + `.card--plain`** — flat, no fill, just a hairline. For supporting information:
  requirements, facts, comparisons, dense listings.

`.cta-card--plain` applies the same flat weight to the closing CTA when that is not the page's
real conversion. Route cards (`dog-card`, `story-card`) keep their own class systems and adopt
these weights where appropriate.

### Action weight

Three levels, and only three. A grouping with one primary action plus a tertiary one must read
as a single decision.

- **`.btn--primary`** — orange fill. One per grouping: adopt, apply, donate, send.
- **`.btn--secondary`** — soft cyan with border. An alternative route that still matters.
- **`.btn--ghost`** — no fill or border. Low-pressure details: view a profile, go back.

**One primary per route.** Not per section: per whole page. If two sections compete for the
same attention, one of them drops to secondary. Repeating the _same_ action (the hero CTA and
the closing CTA pointing at the same form) does not count as competition: it reinforces.

**Inverted secondary on dark backgrounds.** On dark bands like `.donation-banner`, the
secondary is drawn with light border and ink over a transparent background. It keeps AA
contrast without reclaiming the weight of a primary.

## 7. Do's and Don'ts

### Do:

- **Do** use orange for a single primary action per grouping and cyan for secondary routes, focus, and wayfinding.
- **Do** give every galgo photograph useful alt text and framing that preserves the dog's presence.
- **Do** keep body copy in ink or muted ink on light backgrounds, with text contrast of at least 4.5:1.
- **Do** use uppercase Barlow Condensed headings for hierarchy, but keep decisions and explanations in legible Barlow.
- **Do** respect reduced motion and keep content visible even when an animation cannot run.
- **Do** keep CTAs in concrete verbs and clear routes: adopt, foster, donate, or write.

### Don't:

- **Don't** look like a distant, institutional, or generic NGO.
- **Don't** use guilt, empty urgency, or dead-end suffering narratives to ask for an action.
- **Don't** trade clarity for decorative gradients, gradient text, ornamental glass, or functionless shadows.
- **Don't** use colored side borders, endless grids of identical cards, or small uppercase eyebrows over every section.
- **Don't** reduce text contrast to make the interface look softer.
- **Don't** hide keyboard focus, a field's label, or the meaning of a state just because color already hints at it.

## 8. Open questions

- **Should section headings stay uppercase?** `src/styles/global.css` applies
  `text-transform: uppercase` to every `h1`–`h3`, and §6's `.section-heading--quiet` is the
  opt-in escape hatch that drops to sentence case. During the UX hierarchy pass, the task text
  asked for selective uppercase (eyebrows and short labels only, never section headings), but
  removing uppercase globally was the largest visual change available and conflicted with that
  pass's zero-visual-regression success condition — so uppercase headings shipped as a
  deliberate deviation. The brand question underneath was never actually decided. Reversing it
  means removing `text-transform: uppercase` from the `h1, h2, h3` rule in
  `src/styles/global.css` and inverting `.section-heading--quiet` (it becomes the uppercase
  opt-in, or is deleted) — a genuine redesign touching every page. Either way, Spanish accents
  must survive: `ADOPCIÓN`, never `ADOPCION`.
