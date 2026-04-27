# Wireframe — Home (`/`)

Goal: in 3 scrolls, a first-time visitor understands what Brigada Galgos does, who it helps, and how they can help (adopt / foster / donate).

---

## Mobile layout (≤ 1023px)

```
┌──────────────────────────────────────────────────────────┐
│ [LOGO]                                            [≡]   │  ← Navbar
├──────────────────────────────────────────────────────────┤
│                                                          │
│   RESCATAMOS GALGOS                                      │  ← Hero h1
│   EN CHILE.                                              │     display 48px
│                                                          │
│   Sacamos a galgos del abandono, los curamos             │  ← lead 18px
│   y buscamos la familia que se merecen.                  │
│                                                          │
│   [   Quiero adoptar   ]      ← primary CTA              │
│   [  Quiero ser hogar temporal  ]   ← secondary          │
│   [  Donar  ]                       ← ghost              │
│                                                          │
│   ┌────────────────────────────────────────────────┐    │
│   │                                                │    │
│   │       [ HERO PHOTO — galgo de perfil ]         │    │
│   │                                                │    │
│   │       4:5 ratio · object-cover                 │    │
│   │                                                │    │
│   └────────────────────────────────────────────────┘    │
│                                                          │
├──────────────────────────────────────────────────────────┤  ← rainbow divider
│                                                          │
│   ── NUESTRA MISIÓN ──                                   │  ← eyebrow
│                                                          │
│   Cada galgo merece una                                  │
│   segunda chance.                                        │  ← h2 36px
│                                                          │
│   Somos una fundación chilena dedicada a rescatar,       │
│   rehabilitar y reubicar galgos abandonados o            │
│   maltratados. No tenemos refugio fijo: trabajamos       │
│   con una red de hogares temporales.                     │  ← body
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── CÓMO AYUDAR ──                                      │
│                                                          │
│   Hay tres formas.                                       │  ← h2
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  ◯ ADOPTAR                                   │      │  ← card
│   │                                              │      │
│   │  Conocé los galgos disponibles y              │      │
│   │  empezá el proceso.                          │      │
│   │                                              │      │
│   │  Ver galgos →                                │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  ◯ HOGAR TEMPORAL                            │      │
│   │                                              │      │
│   │  Recibí un galgo en tu casa mientras         │      │
│   │  encuentra familia definitiva.               │      │
│   │                                              │      │
│   │  Postular →                                  │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  ◯ DONAR                                     │      │
│   │                                              │      │
│   │  Tu aporte cubre comida, vacunas y            │      │
│   │  traslados.                                  │      │
│   │                                              │      │
│   │  Donar ahora →                               │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── EL PROCESO ──                                       │
│                                                          │
│   Así rescatamos un galgo.                               │  ← h2
│                                                          │
│   [ PROCESS STEPPER · vertical · 5 steps ]               │
│     1. Recibimos el aviso                                │
│     2. Lo evaluamos y rescatamos                         │
│     3. Atención veterinaria completa                     │
│     4. Hogar temporal y rehabilitación                   │
│     5. Adopción definitiva                               │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── HISTORIAS ──                                        │
│                                                          │
│   Salieron adelante.                                     │  ← h2
│                                                          │
│   ┌────────────────┐ ┌────────────────┐                  │
│   │ [FOTO ROCKO]   │ │ [FOTO LUNA]    │  ← horizontal    │
│   │                │ │                │     scroll       │
│   │ ROCKO          │ │ LUNA           │                  │
│   │ "Llegó con     │ │ "Hoy duerme    │                  │
│   │  miedo a..."   │ │  en cama..."   │                  │
│   └────────────────┘ └────────────────┘  → arrastrar     │
│                                                          │
│   [PENDIENTE: 4–6 historias reales con fotos y texto]    │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   [ DONATION CTA BANNER · magenta · full bleed ]         │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   [ FOOTER ]                                             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Desktop layout (≥ 1024px)

Hero shifts to 2-column split. Photo on the right (5:4), text + CTAs on the left. "Cómo ayudar" cards become a 3-up grid. Process stepper goes horizontal. Stories become a 3-up grid (still scrollable to a 4th if added).

```
┌────────────────────────────────────────────────────────────────────────────┐
│ [LOGO]   Adoptar  Hogar temporal  Donar  Quiénes  Contacto  [Donar ahora] │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   RESCATAMOS GALGOS              ┌──────────────────────────────────────┐ │
│   EN CHILE.                      │                                      │ │
│                                  │     [ HERO PHOTO — galgo perfil ]    │ │
│   Sacamos a galgos del           │                                      │ │
│   abandono, los curamos          │     5:4 · object-cover               │ │
│   y buscamos la familia          │                                      │ │
│   que se merecen.                │                                      │ │
│                                  │                                      │ │
│   [Quiero adoptar]               │                                      │ │
│   [Hogar temporal] [Donar]       │                                      │ │
│                                  └──────────────────────────────────────┘ │
│                                                                            │
├ ████████████████████████████████ rainbow divider ████████████████████████ ─┤
│                                                                            │
│   ── NUESTRA MISIÓN ──                                                     │
│   Cada galgo merece una segunda chance.                                    │
│   [body text 760px max-width, centered or left-aligned]                    │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   ── CÓMO AYUDAR ── · Hay tres formas.                                     │
│                                                                            │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                       │
│   │ ADOPTAR     │  │ HOGAR TEMP. │  │ DONAR       │                       │
│   │ ...         │  │ ...         │  │ ...         │                       │
│   │ Ver galgos →│  │ Postular →  │  │ Donar →     │                       │
│   └─────────────┘  └─────────────┘  └─────────────┘                       │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   ── EL PROCESO ── · Así rescatamos un galgo.                              │
│                                                                            │
│   ┌─┐ ── ┌─┐ ── ┌─┐ ── ┌─┐ ── ┌─┐                                          │
│   │1│    │2│    │3│    │4│    │5│   ← horizontal stepper                  │
│   └─┘    └─┘    └─┘    └─┘    └─┘                                          │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   ── HISTORIAS ── · Salieron adelante.                                     │
│                                                                            │
│   ┌────────┐ ┌────────┐ ┌────────┐                                         │
│   │ ROCKO  │ │ LUNA   │ │ TONI   │   ← 3-up grid                           │
│   └────────┘ └────────┘ └────────┘                                         │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│   [ DONATION CTA BANNER ]                                                  │
├────────────────────────────────────────────────────────────────────────────┤
│   [ FOOTER ]                                                               │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Component inventory

- Navbar
- Footer
- Process Stepper (5 steps)
- Donation CTA Banner
- Section divider (rainbow rule)
- Card × 3 ("Cómo ayudar")
- Story card × 3–6 (variant of dog card, no chips, no CTA — quote underneath)
- Primary, secondary, ghost buttons

---

## Content notes

- **Hero h1:** "Rescatamos galgos en Chile."
- **Hero lead:** "Sacamos a galgos del abandono, los curamos y buscamos la familia que se merecen."
- **Mission section:** 1 paragraph, ~50 words. `[PENDIENTE: copia final aprobada por la fundación]`.
- **3 cards:** verb headlines (Adoptar / Hogar temporal / Donar), 1 sentence each, link arrow.
- **Process stepper:** 5 steps with sub-labels (see ASCII above).
- **Stories:** `[PENDIENTE: 4–6 historias reales — nombre del perro, foto, cita corta de la familia adoptante]`.
- **Donation banner:** see `components.md`.

---

## Interaction notes

- Primary CTA "Quiero adoptar" → `/adoptar`.
- "Quiero ser hogar temporal" → `/hogar-temporal`.
- "Donar" → `/donar`.
- 3 help cards link to their respective pages.
- Story cards are **not** clickable (no dog detail pages); they are visual-only.
- Donation banner primary button → `https://esponsor.com/brigadagalgos` (new tab).
- Hero photo respects `prefers-reduced-motion`; no parallax.
