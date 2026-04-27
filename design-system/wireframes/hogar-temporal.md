# Wireframe — Hogar Temporal (`/hogar-temporal`)

Goal: convert volunteers into foster homes. Explain what fostering is, the requirements, and the application steps. End on a form.

---

## Mobile layout

```
┌──────────────────────────────────────────────────────────┐
│ [LOGO]                                            [≡]   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── HOGAR TEMPORAL ──                                   │
│                                                          │
│   Recibí un galgo                                        │  ← h1 48px
│   en tu casa.                                            │
│                                                          │
│   Un hogar temporal aloja a un galgo recién rescatado    │
│   mientras se recupera y encuentra familia definitiva.   │  ← lead
│                                                          │
│   Nosotros cubrimos comida, veterinario y traslados.     │  ← lead, weight 600
│   Vos aportás techo, paseos y cariño.                    │
│                                                          │
│   [   Quiero postular   ]   ← primary, anchors to #form  │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── ¿QUÉ NECESITO? ──                                   │
│                                                          │
│   Requisitos.                                            │  ← h2
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  🏠  Espacio                                 │      │
│   │                                              │      │
│   │  Casa con patio cerrado, O bien depto         │      │
│   │  con malla protectora en ventanas y          │      │
│   │  balcones. Los galgos pueden saltar 2m.      │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  ⏱  Tiempo                                   │      │
│   │                                              │      │
│   │  Disponibilidad para 2 paseos al día y       │      │
│   │  presencia en casa la mayor parte de la       │      │
│   │  semana.                                     │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  📋  Compromiso                              │      │
│   │                                              │      │
│   │  Mantener al galgo por el tiempo que          │      │
│   │  acordamos (mínimo 1 mes), llevarlo a las    │      │
│   │  citas veterinarias, enviar fotos y          │      │
│   │  reportes semanales.                         │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── EL PROCESO ──                                       │
│                                                          │
│   Cómo postular.                                         │  ← h2
│                                                          │
│   [ PROCESS STEPPER · vertical · 4 pasos ]               │
│     1. Llenás el formulario abajo                        │
│     2. Te llamamos por WhatsApp                          │
│     3. Visita en tu casa                                 │
│     4. Llegada del galgo                                 │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   #form                                                  │  ← anchor
│                                                          │
│   ── POSTULAR ──                                         │
│                                                          │
│   Postulación a hogar temporal.                          │  ← h2
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  Nombre completo *                           │      │
│   │  ┌────────────────────────────────────┐     │      │
│   │  │                                    │     │      │
│   │  └────────────────────────────────────┘     │      │
│   │                                              │      │
│   │  Email *                                    │      │
│   │  ┌────────────────────────────────────┐     │      │
│   │  │                                    │     │      │
│   │  └────────────────────────────────────┘     │      │
│   │                                              │      │
│   │  WhatsApp *                                  │      │
│   │  ┌────────────────────────────────────┐     │      │
│   │  │ +56                                │     │      │
│   │  └────────────────────────────────────┘     │      │
│   │                                              │      │
│   │  Comuna *                                    │      │
│   │  ┌────────────────────────────────────┐     │      │
│   │  │ ▼                                  │     │      │
│   │  └────────────────────────────────────┘     │      │
│   │                                              │      │
│   │  Tipo de vivienda *                          │      │
│   │  ( ) Casa con patio                          │      │
│   │  ( ) Depto con malla protectora              │      │
│   │  ( ) Depto sin malla aún                     │      │
│   │                                              │      │
│   │  ¿Tenés otras mascotas? *                    │      │
│   │  ┌────────────────────────────────────┐     │      │
│   │  │                                    │     │      │
│   │  │ (textarea — 3 líneas)              │     │      │
│   │  └────────────────────────────────────┘     │      │
│   │                                              │      │
│   │  ¿Por qué querés ser hogar temporal? *        │      │
│   │  ┌────────────────────────────────────┐     │      │
│   │  │                                    │     │      │
│   │  │ (textarea — 5 líneas)              │     │      │
│   │  │                                    │     │      │
│   │  └────────────────────────────────────┘     │      │
│   │                                              │      │
│   │  ☐ Acepto que me contacten por WhatsApp.    │      │
│   │                                              │      │
│   │  [   Enviar postulación   ]                  │      │
│   │                                              │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
│   ¿Preferís hablar antes? Escribinos                      │
│   directo por WhatsApp →                                 │
│                                                          │
├──────────────────────────────────────────────────────────┤
│   [ FOOTER ]                                             │
└──────────────────────────────────────────────────────────┘
```

---

## Desktop layout

- Hero is single-column, centered, max-width 760px.
- "Requisitos" cards become a 3-up grid.
- Process stepper goes horizontal.
- Form stays single-column, max-width 640px, centered.

---

## Component inventory

- Navbar, Footer
- Process Stepper (4 steps, vertical mobile / horizontal desktop)
- Card × 3 (requisitos — no buttons, icon + title + body)
- Form (text input × 3, select × 1, radio group × 1, textarea × 2, checkbox × 1, primary submit)
- Primary button (hero CTA + form submit)
- WhatsApp inline link

---

## Content notes

- **Hero h1:** "Recibí un galgo en tu casa."
- **Lead:** as written above; second paragraph is bolded for emphasis on what the foundation covers.
- **Requirements:** 3 cards (Espacio / Tiempo / Compromiso). Copy is provisional; `[PENDIENTE: validar específicos con la fundación, especialmente "mínimo 1 mes"]`.
- **Form fields:** name, email, WhatsApp, comuna (select all comunas RM + "otra"), tipo de vivienda (radio), otras mascotas (textarea), motivación (textarea), consent checkbox. Mark `*` required.
- **Form backend:** `[PENDIENTE: decidir entre Formspree, Netlify Forms, o Google Form embebido]`.

---

## Interaction notes

- Hero CTA `[Quiero postular]` → smooth-scroll to `#form`.
- WhatsApp inline link → `https://wa.me/56987076101?text=Hola,%20quisiera%20ser%20hogar%20temporal`.
- Form validation: client-side required-field check; HTML5 type="email" for email; pattern check for WhatsApp.
- Submit success → inline confirmation card replaces form: "¡Recibimos tu postulación! Te contactamos en 48h." with a secondary button to return to home.
- Submit error → toast top-right, form retains values.
- Form fields stack on every breakpoint (single column always — mobile-first form pattern).
