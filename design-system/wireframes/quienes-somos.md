# Wireframe — Quiénes Somos (`/quienes-somos`)

Goal: explain who Brigada Galgos is and what it stands for, **without** exposing team names, photos or addresses (privacy/security constraint).

---

## Mobile layout

```
┌──────────────────────────────────────────────────────────┐
│ [LOGO]                                            [≡]   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── QUIÉNES SOMOS ──                                    │
│                                                          │
│   Una fundación chilena                                  │  ← h1 48px
│   por los galgos.                                        │
│                                                          │
│   Brigada Galgos nació en 2023 para responder a un        │
│   problema invisible: la cantidad de galgos                │
│   abandonados, heridos o usados para carreras             │
│   clandestinas en distintas regiones de Chile.            │  ← lead 18px
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── MISIÓN ──                                           │
│                                                          │
│   Rescatamos, rehabilitamos                              │  ← h2 36px
│   y reubicamos.                                          │
│                                                          │
│   Sacamos a galgos del abandono, les damos atención       │
│   veterinaria completa y los acompañamos hasta su         │
│   familia definitiva. Trabajamos con una red de hogares   │
│   temporales: no tenemos refugio fijo.                   │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── VISIÓN ──                                           │
│                                                          │
│   Un Chile sin galgos                                    │  ← h2
│   abandonados.                                           │
│                                                          │
│   Trabajamos para que la tenencia de galgos en Chile      │
│   sea responsable, informada y libre de explotación.      │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── LO QUE PROMETEMOS ──                                │
│                                                          │
│   Nuestros valores.                                      │  ← h2
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  ◯  TRANSPARENCIA                            │      │
│   │                                              │      │
│   │  Publicamos balances trimestrales y           │      │
│   │  reportes anuales. Cada peso tiene destino.   │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  ◯  ATENCIÓN VETERINARIA COMPLETA            │      │
│   │                                              │      │
│   │  Cada galgo entra al programa con todas       │      │
│   │  sus vacunas, esterilización, desparasitación │      │
│   │  y atención de heridas o secuelas.            │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  ◯  ADOPCIÓN RESPONSABLE                     │      │
│   │                                              │      │
│   │  Visitamos cada casa antes y firmamos          │      │
│   │  acuerdo. Acompañamos el primer mes.          │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  ◯  EQUIPO 100% VOLUNTARIO                   │      │
│   │                                              │      │
│   │  Nadie en la fundación recibe sueldo. El      │      │
│   │  100% de los aportes va a los galgos.        │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── HISTORIA ──                                         │
│                                                          │
│   Cómo empezamos.                                        │  ← h2
│                                                          │
│   [PENDIENTE: 1–2 párrafos sobre el origen de la         │
│    fundación, sin mencionar nombres ni ubicaciones.      │
│    Validar con dirigencia.]                              │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── EN NÚMEROS ──                                       │
│                                                          │
│   Nuestro impacto.                                       │  ← h2
│                                                          │
│   ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│   │ [PENDIENTE]│  │ [PENDIENTE]│  │ [PENDIENTE]│        │
│   │            │  │            │  │            │        │
│   │ galgos     │  │ hogares    │  │ adopciones │        │
│   │ rescatados │  │ temporales │  │ definitivas│        │
│   └────────────┘  └────────────┘  └────────────┘        │
│                                                          │
│   [PENDIENTE: cifras al cierre del último trimestre]     │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   [ DONATION CTA BANNER ]                                │
│                                                          │
├──────────────────────────────────────────────────────────┤
│   [ FOOTER ]                                             │
└──────────────────────────────────────────────────────────┘
```

---

## Desktop layout

- Misión, Visión and Historia sections keep narrow column (760px), centered.
- "Lo que prometemos" cards become a **2×2 grid**.
- "En números" stats become a **3-up row** with the numbers in display font, 80px+ (cyan/magenta/orange respectively).
- Donation banner spans full width.

---

## Component inventory

- Navbar, Footer
- Card × 4 (value promises)
- Stat card × 3 (numbers TBD)
- Donation CTA Banner
- Section eyebrow

---

## Content notes

- **Page h1:** "Una fundación chilena por los galgos."
- **Lead paragraph:** founding context (2023, Chile, problem of abandonment + carreras clandestinas).
- **Misión / Visión:** as written. Approved tone, but `[PENDIENTE: copia final aprobada]`.
- **Valores:** four cards with title + 1-sentence body. Icons are placeholder `◯`.
- **Historia:** explicitly **no names, no photos, no locations**. Just narrative arc — what the founders saw, why the foundation exists.
- **En números:** `[PENDIENTE: cifras reales]`. Each number gets display font and a brand color: rescued=cyan, foster=magenta, adopted=orange.

---

## Interaction notes

- All links go to home, contact, or donate. Page is mostly informational, no forms.
- Donation banner CTA → eSponsor (new tab).
- Privacy guard: confirm with the team that nothing in this layout exposes individual identities.
