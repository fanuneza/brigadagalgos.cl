# Wireframe — Prensa & Aliados (`/prensa`)

Goal: a placeholder grid for press mentions and partner organizations (clinics, municipalities, companies). Most content is TBD; this page is structural.

---

## Mobile layout

```
┌──────────────────────────────────────────────────────────┐
│ [LOGO]                                            [≡]   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── PRENSA & ALIADOS ──                                 │
│                                                          │
│   Quiénes nos apoyan                                     │  ← h1 48px
│   y qué se ha dicho.                                     │
│                                                          │
│   Esta página reúne la cobertura periodística sobre el    │
│   trabajo de la fundación y a las organizaciones que      │
│   colaboran con nosotros.                                │  ← lead
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── EN LA PRENSA ──                                     │
│                                                          │
│   Nos han mencionado.                                    │  ← h2 36px
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  [LOGO MEDIO]                                │      │
│   │                                              │      │
│   │  "Cita o titular del artículo aquí."          │      │
│   │                                              │      │
│   │  Nombre del medio · Mes 2025                  │      │
│   │                                              │      │
│   │  Leer artículo ↗                             │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  [PENDIENTE: artículo 2]                     │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  [PENDIENTE: artículo 3]                     │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
│   [PENDIENTE: lista completa de menciones de prensa]     │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── ALIADOS ──                                          │
│                                                          │
│   Organizaciones que                                     │  ← h2
│   colaboran con nosotros.                                │
│                                                          │
│   CLÍNICAS VETERINARIAS                                  │  ← eyebrow
│   ┌─────────┐ ┌─────────┐ ┌─────────┐                    │
│   │ [LOGO]  │ │ [LOGO]  │ │ [LOGO]  │  ← 2-up mobile     │
│   │ [TBD]   │ │ [TBD]   │ │ [TBD]   │     3-up desktop   │
│   └─────────┘ └─────────┘ └─────────┘                    │
│                                                          │
│   MUNICIPALIDADES                                        │
│   ┌─────────┐ ┌─────────┐                                │
│   │ [LOGO]  │ │ [LOGO]  │                                │
│   └─────────┘ └─────────┘                                │
│                                                          │
│   EMPRESAS Y MARCAS                                      │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐                    │
│   │ [LOGO]  │ │ [LOGO]  │ │ [LOGO]  │                    │
│   └─────────┘ └─────────┘ └─────────┘                    │
│                                                          │
│   [PENDIENTE: lista oficial de aliados con permisos      │
│    de uso de logos]                                      │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── ¿QUIERES SER ALIADO? ──                             │
│                                                          │
│   Necesitamos veterinarios, transportes, fotógrafos,      │
│   medios y empresas que apoyen el rescate.               │
│                                                          │
│   [ Escribinos ]   ← primary, → /contacto?asunto=prensa  │
│                                                          │
├──────────────────────────────────────────────────────────┤
│   [ FOOTER ]                                             │
└──────────────────────────────────────────────────────────┘
```

---

## Desktop layout

- Press cards: **3-up grid** at ≥1024px.
- Ally logos: **3-up grid mobile / 6-up grid desktop**, organized by category with eyebrow labels.
- Tail "ser aliado" CTA spans full width.

---

## Component inventory

- Navbar, Footer
- Press card × N (logo, quote, source, date, link)
- Logo tile × N (organized in named groups)
- Primary CTA button
- Section eyebrow

---

## Content notes

- **Press cards:** logo of media outlet, headline or quote, name + date, link to article.
- **Ally categories:** Clínicas veterinarias / Municipalidades / Empresas y marcas. `[PENDIENTE: lista oficial y permisos de uso]`.
- **Empty state:** if no press yet, swap section for "Esta sección se actualiza pronto. Si sos periodista interesadx, escribinos." + Contact button. Mention to design team.

---

## Interaction notes

- Press card click → opens article in new tab.
- Logo tiles are not clickable (no destination needed) **unless** the partner provides a URL — then make the tile a link (new tab).
- "Escribinos" CTA → `/contacto` with subject pre-selected to "Prensa".
