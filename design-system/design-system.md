# Brigada Galgos — Design System

**Version 0.1 · April 2026**
*Foundation for the public website. Pairs with `tokens.css`.*

---

## 1. Brand voice in design

Brigada Galgos rescues galgos from neglect and abuse. The visual system has to hold two emotional poles at once:

- **Warm and joyful** — adoption is celebration. The dogs that come out the other side of rescue deserve a website that feels like a wagging tail, not a hospital.
- **Trustworthy and serious** — donors and adopters need to feel the foundation is real, careful, and accountable.

The logo already does this work: a precise blocky wordmark anchored by a riotous pop-art galgo. The system below mirrors that structure — disciplined typographic and layout grid, with the rainbow palette deployed as small, intentional bursts.

---

## 2. Color

### 2.1 Brand colors (sampled from the logo)

| Token | Hex | Use |
|---|---|---|
| `--color-primary` | `#00BCD4` | Primary brand. Links, secondary buttons, focus rings, headers. |
| `--color-secondary` | `#E91E8C` | Section accents, dog-card chips, "donate" emphasis. |
| `--color-accent-warm` | `#FFA726` | **CTA fill.** "Adoptar", "Donar", "Postular". |

### 2.2 Tertiary rainbow set

`--color-rainbow-red / yellow / green / purple`. Use these only for:
- Decorative dividers (multi-stripe rule under section headers)
- Process-stepper number badges (rotating through the set)
- Illustration borders

**Never** for: body text, large background fills, button fills, table rows.

### 2.3 Neutrals & semantic

Charcoal `#1F2328` over white `#FFFFFF` — body text contrast ratio **15.4 : 1** (WCAG AAA). Semantic colors track standard expectations (success green, warning orange, danger red).

### 2.4 Contrast — flagged combinations

| Combo | Ratio | Verdict |
|---|---|---|
| Charcoal text on white | 15.4 : 1 | ✅ AAA |
| Charcoal text on `--color-surface` | 14.1 : 1 | ✅ AAA |
| White text on `--color-primary` (cyan) | 2.6 : 1 | ⚠️ **Fails AA** — never use white text on cyan. Use charcoal instead (8.2 : 1). |
| White text on `--color-secondary` (magenta) | 4.9 : 1 | ✅ AA for large text only (≥18px bold). Avoid for body. |
| Charcoal text on `--color-accent-warm` (orange) | 9.1 : 1 | ✅ AAA — preferred CTA combo. |
| White text on `--color-accent-warm` | 1.7 : 1 | ❌ **Fails everything.** Never. |

**Rule:** when in doubt, charcoal-on-color, not white-on-color. The CTA button is therefore **charcoal text on warm orange**, not white-on-orange.

---

## 3. Typography

### 3.1 Family

- **Display — Barlow Condensed** (700, 900). For h1, h2, hero headlines, section eyebrows. Condensed letters echo the logo wordmark.
- **Body — Inter** (400, 500, 600, 700). Everything else.
- **Mono — JetBrains Mono** (400). Reserved for `[PENDIENTE: ...]` placeholder badges in wireframes and for small technical labels (e.g. transfer reference).

Both display and body load from Google Fonts; mono is optional and only appears in wireframe artifacts.

### 3.2 Scale

| Token | Size | Line | Weight | Use |
|---|---|---|---|---|
| `--font-size-4xl` | 68px | 1.05 | 900 | Hero h1 (desktop) |
| `--font-size-3xl` | 48px | 1.05 | 900 | Hero h1 (mobile) / page h1 |
| `--font-size-2xl` | 36px | 1.15 | 700 | Section h2 |
| `--font-size-xl`  | 28px | 1.25 | 700 | Section h3 |
| `--font-size-lg`  | 22px | 1.3  | 600 | Card title, lead paragraph |
| `--font-size-md`  | 18px | 1.5  | 400 | Lead body |
| `--font-size-base`| 16px | 1.55 | 400 | Body |
| `--font-size-sm`  | 14px | 1.45 | 400 | Caption, helper |
| `--font-size-xs`  | 12px | 1.4  | 600 | Eyebrow, chip, meta (uppercase + tracking 0.12em) |

### 3.3 Pairing rules

- Display font is always uppercase OR `font-stretch: condensed`. Never sentence-case Barlow Condensed at small sizes — it loses identity.
- Body copy is sentence-case, regular weight. Use 600/700 for emphasis sparingly (no italics in body).

---

## 4. Spacing & layout

### 4.1 8-pixel grid

Spacing tokens `--space-1` through `--space-16` map to multiples of 8 (with `--space-1` = 4px as a half-step for tight inline UI like chip padding).

### 4.2 Container

- `--content-max: 1200px` — capped page width.
- `--content-narrow: 760px` — long-form prose (e.g. "Quiénes somos" body, contact form).
- Default horizontal padding: `--gutter: 24px` (mobile), `--gutter-lg: 48px` (desktop).

### 4.3 Breakpoints — mobile-first

- `≥ 640px` — small (large phone, narrow tablet)
- `≥ 1024px` — medium (tablet landscape, small laptop)
- `≥ 1280px` — large (desktop)

All wireframes specify mobile layout first, then desktop variation.

### 4.4 Vertical rhythm

- Section vertical padding: `--space-9` (64px) mobile, `--space-12` (96px) desktop.
- Headline → body gap: `--space-4`.
- Body → CTA gap: `--space-6`.

---

## 5. Components

### 5.1 Buttons

Three variants only. Min height **48px** for tap targets. Radius `--radius-full` (pill).

| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| **Primary** | `--color-accent-warm` (orange) | charcoal | none | The single most important action on the page. **One per section, max.** |
| **Secondary** | transparent | `--color-primary-700` cyan | 2px cyan | "Saber más", secondary actions. |
| **Ghost** | transparent | charcoal | none | Tertiary inline actions. |

Hover states defined in `tokens.css`. Focus state is a 3px cyan ring (`--shadow-focus`).

### 5.2 Cards

- `background: var(--color-bg)` on white pages, `var(--color-bg)` on gray sections (cards "rise" off `--color-surface`).
- Radius `--radius-lg` (20px).
- Border `1px solid var(--color-border)`.
- Shadow `--shadow-sm` at rest, `--shadow-md` on hover (lifts 2px).
- Padding `--space-5` (24px) interior.

### 5.3 Chips / badges

For dog-card metadata (sex, age, weight) and section eyebrows.

- Pill shape, `--radius-full`.
- Padding `4px 12px`.
- Font: 12px, weight 600, uppercase, tracking 0.04em.
- Background: `--color-primary-100` / `--color-secondary-100` / `--color-accent-warm-100` (rotate by category).
- Text: matching `*-700` shade for AA contrast.

### 5.4 Inputs

- Min height **48px**.
- Border `1px solid var(--color-border)`, radius `--radius-md`.
- Focus: cyan border + `--shadow-focus`.
- Label always above input, never inside as placeholder-only.

### 5.5 Navbar

- Sticky, white, 1px bottom border.
- Height 72px desktop, 64px mobile.
- Logo left (40px tall), nav links right (Inter 600, 16px).
- Mobile: hamburger opens a full-height drawer from the right.

### 5.6 Footer

- Background `--color-text` charcoal.
- Text `--color-text-inverse` white.
- 3-column desktop, single-column mobile.

### 5.7 Section dividers

A 4-stripe rule using the rainbow set, 4px tall. Optional; used between major sections on the home page only.

```
[cyan][magenta][orange][green]   ← 4px tall, 100% width
```

---

## 6. Imagery

- Dog photographs — square or 4:5, full bleed inside their card. No filters; preserve real fur tone.
- When a photo is missing, show a striped placeholder labeled `[FOTO: nombre del perro]` in mono font.
- Logo lockups: never recolor, never stretch, minimum height 32px.

---

## 7. Iconography

A single line-icon set (24×24, 1.5px stroke). Used sparingly — process steppers, contact details (WhatsApp, email, Instagram). No decorative icons in body text.

---

## 8. Voice & content rules (for copy placeholder writing)

- Spanish, voseo/tuteo neutral (Chilean Spanish but readable Latin-American-wide).
- First person plural ("rescatamos", "buscamos") for foundation actions.
- Verb-first CTAs: "Adoptar", "Postular", "Donar", "Conocer la historia".
- Avoid sentimental clichés ("mejores amigos", "ángeles peludos"). The dogs are dignified, not pitied.
- All unconfirmed copy wrapped as `[PENDIENTE: descripción]`.

---

## 9. Privacy constraints (apply across all pages)

The following must **never** appear in any layout:

- Names or photos of team members / volunteers.
- Physical addresses or shelter location.
- Direct phone numbers other than the foundation WhatsApp (`+56 9 8707 6101`).

The contact channel pattern is **WhatsApp deep links** (`https://wa.me/56987076101`) plus the foundation email.

---

## 10. File structure

```
brigada-galgos/
├── tokens.css           ← all CSS custom properties
├── design-system.md     ← this file
├── wireframes/
│   ├── home.md
│   ├── adoptar.md
│   ├── hogar-temporal.md
│   ├── donar.md
│   ├── quienes-somos.md
│   ├── contacto.md
│   ├── prensa.md
│   └── components.md    ← Navbar, Footer, Dog Card, Process Stepper, Donation Banner
└── assets/
    ├── brigada-galgos-logo.png
    └── brigada-galgos-mark.png
```
