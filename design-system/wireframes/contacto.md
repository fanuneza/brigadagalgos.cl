# Wireframe — Contacto (`/contacto`)

Goal: give visitors a clear way to reach the foundation. Three channels: WhatsApp, email, social. Plus a fallback contact form.

**Privacy:** no physical address; no team names.

---

## Mobile layout

```
┌──────────────────────────────────────────────────────────┐
│ [LOGO]                                            [≡]   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── CONTACTO ──                                         │
│                                                          │
│   Conversemos.                                           │  ← h1 48px
│                                                          │
│   Estamos en Chile. Si querés adoptar, ser hogar          │
│   temporal o aliarte con la fundación, escribinos.        │  ← lead
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   CANALES DIRECTOS                                       │  ← eyebrow
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  📱  WHATSAPP                                │      │
│   │                                              │      │
│   │  +56 9 8707 6101                             │      │
│   │  Lun a Vie · 10:00 – 19:00                   │      │
│   │                                              │      │
│   │  [   Abrir WhatsApp   ↗ ]                    │      │  ← primary
│   └──────────────────────────────────────────────┘      │
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  ✉  EMAIL                                    │      │
│   │                                              │      │
│   │  brigadagalgos@gmail.com                     │      │
│   │  Respondemos en 48h hábiles.                 │      │
│   │                                              │      │
│   │  [ Escribir email ]                          │      │  ← secondary
│   └──────────────────────────────────────────────┘      │
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  ◯  REDES                                    │      │
│   │                                              │      │
│   │  Las novedades de los galgos viven en         │      │
│   │  Instagram.                                  │      │
│   │                                              │      │
│   │  [ Instagram ↗ ]   [ Facebook ↗ ]            │      │  ← ghost × 2
│   └──────────────────────────────────────────────┘      │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── FORMULARIO ──                                       │
│                                                          │
│   ¿Preferís escribir desde acá?                          │  ← h2
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │  Nombre *                                    │      │
│   │  [_____________________________________]     │      │
│   │                                              │      │
│   │  Email *                                    │      │
│   │  [_____________________________________]     │      │
│   │                                              │      │
│   │  Asunto *                                    │      │
│   │  [ ▼  Adopción / Hogar temporal /            │      │
│   │       Donar / Prensa / Otro              ]   │      │
│   │                                              │      │
│   │  Mensaje *                                   │      │
│   │  [_____________________________________]     │      │
│   │  [_____________________________________]     │      │
│   │  [_____________________________________]     │      │
│   │                                              │      │
│   │  ☐ Acepto que respondan a este email.        │      │
│   │                                              │      │
│   │  [   Enviar mensaje   ]                       │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ── PRENSA Y ALIANZAS ──                                │
│                                                          │
│   Si sos medio de comunicación, clínica veterinaria,      │
│   municipalidad o empresa que quiere apoyarnos,           │
│   visitá la página de Prensa & Aliados →                  │
│                                                          │
├──────────────────────────────────────────────────────────┤
│   [ FOOTER ]                                             │
└──────────────────────────────────────────────────────────┘
```

---

## Desktop layout

- Hero centered, narrow.
- Three direct-channel cards become a **3-up grid**.
- Form keeps single column, centered, max-width 640px.
- Press teaser as a single-row banner.

---

## Component inventory

- Navbar, Footer
- Card × 3 (WhatsApp / Email / Redes)
- Form (inputs × 2, select × 1, textarea × 1, checkbox × 1, primary button)
- Primary, secondary, ghost buttons
- Section eyebrow

---

## Content notes

- **Page h1:** "Conversemos."
- **WhatsApp hours:** `[PENDIENTE: confirmar horario real de atención]`. Default placeholder: Lun–Vie 10:00–19:00.
- **Email:** `brigadagalgos@gmail.com` (confirmed).
- **Form backend:** same decision as `/hogar-temporal`. `[PENDIENTE]`.
- **Subject options:** Adopción / Hogar temporal / Donar / Prensa / Otro.

---

## Interaction notes

- WhatsApp button → `https://wa.me/56987076101` (no prefilled text — generic).
- Email button → `mailto:brigadagalgos@gmail.com`.
- Instagram/Facebook → `[PENDIENTE: URLs reales]`.
- Form submit success → inline confirmation: "¡Recibimos tu mensaje! Te respondemos pronto." with secondary button "Volver al inicio".
- Form submit error → toast.
- "Página de Prensa & Aliados →" link → `/prensa`.
- Privacy: response time stated honestly (48h hábiles) so expectations are managed.
