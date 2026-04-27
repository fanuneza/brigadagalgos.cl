# Wireframe — Donar (`/donar`)

Goal: convert visitors into donors. Two paths: recurring (eSponsor) and one-off (bank transfer). Reinforce trust with value promises.

---

## Mobile layout

```
┌──────────────────────────────────────────────────────────┐
│ [LOGO]                                            [≡]   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── DONAR ──                                            │
│                                                          │
│   Sostené el rescate.                                    │  ← h1 48px
│                                                          │
│   El 100% de tus aportes va a comida, atención            │
│   veterinaria y traslados de los galgos rescatados.      │  ← lead 18px
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  ◯ Recomendado                               │      │  ← chip
│   │                                              │      │
│   │  DONAR MENSUAL                               │      │  ← display 28px
│   │                                              │      │
│   │  Aportá una cantidad fija cada mes a través   │      │
│   │  de eSponsor. Es la forma más útil porque     │      │
│   │  nos permite planificar.                     │      │
│   │                                              │      │
│   │  Sugerencias: $5.000 · $10.000 · $20.000     │      │
│   │                                              │      │
│   │  [  Donar en eSponsor  ↗ ]                    │      │  ← primary
│   │                                              │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   #datos-transferencia                                   │  ← anchor
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  TRANSFERENCIA ÚNICA                         │      │
│   │                                              │      │
│   │  Banco           [PENDIENTE]                 │      │
│   │  Tipo de cuenta  [PENDIENTE]                 │      │
│   │  Nº de cuenta    [PENDIENTE]                 │      │
│   │  RUT             [PENDIENTE]                 │      │
│   │  Nombre          Fundación Brigada Galgos     │      │
│   │  Email           brigadagalgos@gmail.com      │      │
│   │                                              │      │
│   │  [ Copiar datos ]   ← ghost button           │      │
│   │                                              │      │
│   │  ⓘ Mandanos el comprobante por WhatsApp      │      │
│   │     para confirmarte la recepción.           │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── COMPROMISO ──                                       │
│                                                          │
│   En qué se usa cada peso.                               │  ← h2 36px
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  100%                                        │      │  ← display 60px
│   │  va a los galgos                             │      │
│   │                                              │      │
│   │  Comida, vacunas, esterilización, traslados, │      │
│   │  prótesis y rehabilitación.                  │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  0$                                          │      │
│   │  en sueldos                                  │      │
│   │                                              │      │
│   │  Somos un equipo voluntario. Nadie cobra.    │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  ✓                                           │      │
│   │  Cuentas a la vista                          │      │
│   │                                              │      │
│   │  Publicamos un balance trimestral en          │      │
│   │  Instagram con totales de ingresos y          │      │
│   │  egresos.                                    │      │
│   │                                              │      │
│   │  [PENDIENTE: confirmar cadencia y formato]   │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── OTRAS FORMAS DE AYUDAR ──                           │
│                                                          │
│   Sin plata también se ayuda.                            │  ← h2
│                                                          │
│   • Donar comida, mantas, medicamentos                   │
│   • Ofrecer servicios (veterinario, transporte,           │
│     fotografía)                                          │
│   • Difundir adopciones en redes                         │
│                                                          │
│   [ Coordinar por WhatsApp ]   ← secondary               │
│                                                          │
├──────────────────────────────────────────────────────────┤
│   [ FOOTER ]                                             │
└──────────────────────────────────────────────────────────┘
```

---

## Desktop layout

- Hero centered, max-width 760px.
- Two donation cards (mensual + transferencia) become a **2-up grid** side-by-side.
- "Compromiso" cards become a **3-up grid**.
- Otras formas section keeps single column, centered.

---

## Component inventory

- Navbar, Footer
- Card × 5 (mensual, transferencia, 3× compromiso)
- Primary button (eSponsor)
- Ghost button (copiar datos)
- Secondary button (coordinar WhatsApp)
- "Recomendado" chip badge

---

## Content notes

- **Hero h1:** "Sostené el rescate."
- **Mensual card:** points to `https://esponsor.com/brigadagalgos`. Suggested amounts in CLP.
- **Transferencia card:** all bank fields are `[PENDIENTE]` until the foundation provides them.
- **Compromiso "100% / 0$ / Cuentas":** the three numbers/symbols are display-font, large, in cyan/magenta/orange respectively. Visually anchors the trust message.
- **Otras formas:** bullet list, simple. `[PENDIENTE: validar lista con la fundación]`.

---

## Interaction notes

- Primary CTA `[Donar en eSponsor ↗]` → opens `https://esponsor.com/brigadagalgos` in a new tab (`target="_blank" rel="noopener"`).
- `[Copiar datos]` button → copies a multiline string with all bank fields to clipboard, shows toast "Datos copiados". When fields are still `[PENDIENTE]`, the button is disabled with helper text "Disponibles pronto".
- `[Coordinar por WhatsApp]` → `https://wa.me/56987076101?text=Hola,%20quiero%20ayudar%20de%20otra%20forma`.
- Anchor `#datos-transferencia` is the target of the home-page donation banner's "Ver datos →" link.
