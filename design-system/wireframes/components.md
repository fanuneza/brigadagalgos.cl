# Wireframes — Global components

ASCII sketches and notes for components reused across pages. All measurements assume the spacing tokens in `tokens.css`.

---

## 1. Navbar (sticky)

### Mobile (≤ 1023px) — height 64px

```
┌──────────────────────────────────────────────────────────┐
│ [LOGO 40px]                                       [≡]   │
└──────────────────────────────────────────────────────────┘
   ↑ links to /                                       ↑ hamburger
```

Open hamburger drawer (from right, full height):

```
                        ┌──────────────────────────┐
                        │                      [×] │
                        │                          │
                        │  Adoptar                 │
                        │  Hogar temporal          │
                        │  Donar                   │
                        │  Quiénes somos           │
                        │  Contacto                │
                        │  Prensa & aliados        │
                        │                          │
                        │  ──────────────          │
                        │                          │
                        │  [ Donar ahora ]   ←CTA  │
                        │                          │
                        │  IG · FB · WhatsApp      │
                        └──────────────────────────┘
```

### Desktop (≥ 1024px) — height 72px

```
┌────────────────────────────────────────────────────────────────────────────┐
│ [LOGO 48px]    Adoptar  Hogar temporal  Donar  Quiénes  Contacto  Prensa   │
│                                                              [ Donar ahora ]│
└────────────────────────────────────────────────────────────────────────────┘
```

**Component inventory:** Logo lockup, primary button (Donar ahora).

**Content notes:**
- Logo links to `/`. Wordmark + mark visible at desktop; mark only at very narrow viewports.
- Active nav link gets cyan underline (2px, `--color-primary`).

**Interactions:**
- Sticky to top; subtle shadow appears on scroll (`--shadow-sm`).
- Hamburger animates to × on open. ESC closes.
- "Donar ahora" links to `/donar`.

---

## 2. Footer

### Mobile

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  [LOGO inverso 40px]                                     │
│                                                          │
│  Rescatamos galgos en Chile y los acompañamos hasta su  │
│  hogar definitivo.                                       │
│                                                          │
│  ─────────────────                                       │
│                                                          │
│  CONTACTO                                                │
│  ✉  brigadagalgos@gmail.com                              │
│  📱  +56 9 8707 6101  (WhatsApp)                          │
│                                                          │
│  ENLACES                                                 │
│  Adoptar · Hogar temporal · Donar                        │
│  Quiénes somos · Prensa                                  │
│                                                          │
│  SÍGUENOS                                                │
│  [IG]  [FB]                                              │
│                                                          │
│  ─────────────────                                       │
│                                                          │
│  © 2026 Fundación Brigada Galgos                         │
│  RUT [PENDIENTE]                                         │
└──────────────────────────────────────────────────────────┘
```

### Desktop — 3 columns

```
┌────────────────────────────────────────────────────────────────────────────┐
│  [LOGO inv]                CONTACTO              ENLACES                   │
│                            ✉ brigadagalgos@…    Adoptar                    │
│  Rescatamos galgos en      📱 +56 9 8707 6101    Hogar temporal             │
│  Chile y los acompañamos                         Donar                     │
│  hasta su hogar definitivo. SÍGUENOS             Quiénes somos             │
│                            [IG]  [FB]            Prensa                    │
│                                                                            │
│  ────────────────────────────────────────────────────────────────────────  │
│  © 2026 Fundación Brigada Galgos · RUT [PENDIENTE]    [ Donar en eSponsor ]│
└────────────────────────────────────────────────────────────────────────────┘
```

**Component inventory:** Logo (inverse), social icons, secondary button.

**Content notes:**
- Tagline: "Rescatamos galgos en Chile y los acompañamos hasta su hogar definitivo."
- Email and WhatsApp only — **no physical address**, no team names.
- RUT to be added when foundation legal data confirmed (`[PENDIENTE: RUT]`).

**Interactions:**
- WhatsApp link uses `https://wa.me/56987076101` deep-link.
- "Donar en eSponsor" → `https://esponsor.com/brigadagalgos` (new tab).

---

## 3. Dog card (`/adoptar`)

### Single card — mobile (full width with 24px gutters) and desktop (3-up grid)

```
┌──────────────────────────────────────┐
│                                      │
│         [ DOG PHOTO 1:1 ]            │
│         object-fit: cover            │
│                                      │
│                                      │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  LUCHO                               │  ← display, 22px, bold
│                                      │
│  [♂ Macho] [4 años] [28 kg]          │  ← chips: cyan/magenta/orange
│                                      │
│  Tranquilo, sociable con otros       │  ← 14px charcoal, 2-line clamp
│  galgos. Busca una familia paciente. │
│                                      │
│  [   Me interesa Lucho   ] →        │  ← primary button, full width
│                                      │
└──────────────────────────────────────┘
```

**Component inventory:** Photo placeholder, chip × 3, primary button.

**Content notes per dog:**
- Name (display font, uppercase, 22px).
- Three chips: sex (♂/♀), age, weight. Chip color rotates per category — sex=cyan, age=magenta, weight=orange.
- Personality: 2-line summary, max ~140 chars. Clamped with `-webkit-line-clamp: 2`.
- Photo: 1:1 ratio. `[FOTO: nombre del perro]` placeholder if missing.

**Interactions:**
- "Me interesa [nombre]" opens WhatsApp with prefilled text:
  `https://wa.me/56987076101?text=Hola,%20me%20interesa%20adoptar%20a%20[NOMBRE]`
- Whole card NOT clickable — only the button — because there are no dog detail pages.
- Hover (desktop): card lifts 2px, shadow `--shadow-md`.

---

## 4. Process stepper

### Horizontal (desktop) — 4 steps

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   ┌─┐         ┌─┐         ┌─┐         ┌─┐                                │
│   │1│─────────│2│─────────│3│─────────│4│                                │
│   └─┘         └─┘         └─┘         └─┘                                │
│   Conocés     Visita      Acuerdo     Llevamos                           │
│   al galgo    en casa     de adopción a tu galgo                         │
│   Coordinas   Verificamos Firmamos    Acompañamiento                     │
│   visita por  espacio y   compromiso  durante el primer                  │
│   WhatsApp    rutina      y cuidados  mes en casa                        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Vertical (mobile)

```
   ┌─┐
   │1│  Conocés al galgo
   └─┘  Coordinas visita por WhatsApp
    │
    │
   ┌─┐
   │2│  Visita en casa
   └─┘  Verificamos espacio y rutina
    │
    │
   ┌─┐
   │3│  Acuerdo de adopción
   └─┘  Firmamos compromiso y cuidados
    │
    │
   ┌─┐
   │4│  Llevamos a tu galgo
   └─┘  Acompañamiento durante el primer mes
```

**Component inventory:** Numbered circle badge, connector line, label, sub-label.

**Content notes:**
- Number circle: 48px, `--radius-full`, rotating rainbow fill (1=cyan, 2=magenta, 3=orange, 4=green). White numeral (Barlow Condensed Black, 24px).
- Connector: 2px line, `--color-border`. Becomes solid color of preceding step on completed flows (not used on public pages).
- Label: display font, 18px, uppercase, semi-bold.
- Sub-label: 14px Inter, charcoal-muted.

**Interactions:** None — pure informational.

---

## 5. Donation CTA banner (full-width)

Appears on Home and About.

### Mobile

```
┌──────────────────────────────────────────────────────────┐
│ ████████████████████████████████████████████████████████ │  ← magenta bg
│                                                          │
│                                                          │
│   Cada galgo rescatado depende                           │
│   de gente como vos.                                     │  ← 36px, white
│                                                          │
│   El 100% de tus aportes va a comida,                    │
│   atención veterinaria y traslados.                      │  ← 18px, white
│                                                          │
│                                                          │
│   [   Donar mensual en eSponsor   ]   ← orange button    │
│                                                          │
│   También recibimos transferencia.                       │
│   Ver datos →                                            │  ← inline link
│                                                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Desktop — split 2-up

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ███████████████████████████████████████████████████████████████████████████│
│                                                                            │
│   Cada galgo rescatado            [   Donar mensual en eSponsor   ]        │
│   depende de gente                                                         │
│   como vos.                       También recibimos transferencia.         │
│                                   Ver datos →                              │
│   El 100% de tus aportes va a                                              │
│   comida, atención veterinaria                                             │
│   y traslados.                                                             │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

**Component inventory:** Section padding `--space-12` desktop / `--space-9` mobile. Primary button.

**Content notes:**
- Background: `--color-secondary` (magenta). Headline + body in white.
- ⚠️ Body text on magenta is borderline — keep body **18px minimum** and **weight ≥ 500** to satisfy AA for large text.
- Headline display font (Barlow Condensed 900).

**Interactions:**
- Primary button → `https://esponsor.com/brigadagalgos` (new tab).
- "Ver datos →" anchors to `#datos-transferencia` on `/donar`.

---

## 6. Section divider (rainbow rule)

Used between major Home sections only. Decorative.

```
████████████████████████████████████████████████████████████████   ← 4px tall
[  cyan  ][  magenta  ][  orange  ][  green  ][  purple  ]        ← equal stops
```

`role="presentation"`, `aria-hidden="true"`.
