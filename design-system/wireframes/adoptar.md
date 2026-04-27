# Wireframe — Adopciones (`/adoptar`)

Goal: a flat, scrollable list of every galgo currently available for adoption. No detail pages. Each card → WhatsApp deep link.

---

## Mobile layout

```
┌──────────────────────────────────────────────────────────┐
│ [LOGO]                                            [≡]   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── ADOPTA ──                                           │  ← eyebrow
│                                                          │
│   Galgos buscando                                        │  ← h1 48px
│   familia.                                               │
│                                                          │
│   Estos son los galgos en hogares temporales que ya       │
│   están listos para conocer a su familia definitiva.      │  ← lead 18px
│                                                          │
│   [ Ver requisitos para adoptar ↓ ]   ← ghost / anchor   │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   FILTROS (chips)                                        │
│   [ Todos ] [ Macho ] [ Hembra ] [ Adultos ] [ Cachorros]│
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   12 galgos disponibles                                  │  ← count, 14px
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  [ DOG CARD — Lucho ]                        │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  [ DOG CARD — Tina ]                         │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  [ DOG CARD — Olmo ]                         │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
│   …                                                      │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   #requisitos                                            │  ← anchor
│                                                          │
│   ── REQUISITOS ──                                       │
│                                                          │
│   Antes de empezar.                                      │  ← h2 36px
│                                                          │
│   ✓  Casa con patio cerrado o depto con malla            │
│      protectora en ventanas y balcones.                  │
│   ✓  Compromiso de paseos diarios.                       │
│   ✓  Mayoría de edad y autorización de quien arrienda.    │
│   ✓  Visita en casa antes de la entrega.                 │
│   ✓  Firma de acuerdo de adopción.                       │
│                                                          │
│   [PENDIENTE: validar lista final con fundación]         │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ¿No ves un galgo que te haga clic?                     │  ← h3
│                                                          │
│   Escribinos por WhatsApp y conversemos. A veces hay     │
│   galgos en proceso que aún no aparecen acá.             │
│                                                          │
│   [ Hablar por WhatsApp ]   ← primary CTA                │
│                                                          │
├──────────────────────────────────────────────────────────┤
│   [ FOOTER ]                                             │
└──────────────────────────────────────────────────────────┘
```

---

## Desktop layout

Hero shrinks to a single-column header (no split). Filters pin under the header. Cards become a **3-up grid** at ≥1024px. Requirements section is a 2-column list. Tail section spans full width.

```
┌────────────────────────────────────────────────────────────────────────────┐
│   ── ADOPTA ── · Galgos buscando familia.                                  │
│   [lead] [Ver requisitos ↓]                                                │
├────────────────────────────────────────────────────────────────────────────┤
│   [ Todos ][ Macho ][ Hembra ][ Adultos ][ Cachorros ]    12 disponibles  │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   ┌────────┐  ┌────────┐  ┌────────┐                                       │
│   │ Lucho  │  │ Tina   │  │ Olmo   │                                       │
│   └────────┘  └────────┘  └────────┘                                       │
│   ┌────────┐  ┌────────┐  ┌────────┐                                       │
│   │ Bruna  │  │ Coco   │  │ Indio  │                                       │
│   └────────┘  └────────┘  └────────┘                                       │
│   …                                                                        │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│   ── REQUISITOS ──                                                         │
│   ✓ ...           ✓ ...                                                    │
│   ✓ ...           ✓ ...                                                    │
├────────────────────────────────────────────────────────────────────────────┤
│   ¿No ves un galgo que te haga clic?  [ Hablar por WhatsApp ]              │
├────────────────────────────────────────────────────────────────────────────┤
│   [ FOOTER ]                                                               │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Component inventory

- Navbar
- Footer
- Dog card × N (see `components.md`)
- Filter chips
- Primary button (WhatsApp tail CTA)
- Ghost button (anchor to #requisitos)
- Section eyebrow

---

## Content notes

- **Page h1:** "Galgos buscando familia."
- **Filter chips:** Todos / Macho / Hembra / Adultos / Cachorros. Active chip uses `--color-primary` fill. Filtering is purely client-side; no URL params for v1 unless requested.
- **Dog data per card:** name, sex, age, weight, 2-line personality, photo. Source TBD — `[PENDIENTE: dataset de galgos disponibles, idealmente como JSON o CMS]`.
- **Empty / loading states:**
  - Loading: 3 skeleton cards with shimmering placeholder.
  - Empty (no dogs available): "Por ahora no hay galgos en adopción. Postulá igual y te avisamos cuando llegue el indicado." + WhatsApp button.
- **Requisitos:** placeholder list above. `[PENDIENTE: lista oficial]`.

---

## Interaction notes

- "Me interesa [nombre]" button on each card → `https://wa.me/56987076101?text=Hola,%20me%20interesa%20adoptar%20a%20[NOMBRE]`. URL-encode the name server-side / build-time so accents survive.
- "Hablar por WhatsApp" tail CTA → `https://wa.me/56987076101?text=Hola,%20quisiera%20saber%20m%C3%A1s%20sobre%20adopci%C3%B3n`.
- Filter chips are toggle buttons (only one active at a time). Animation: 150ms fill swap.
- Anchor link `[Ver requisitos ↓]` smooth-scrolls to `#requisitos`.
- No individual dog detail pages — explicitly out of scope.
