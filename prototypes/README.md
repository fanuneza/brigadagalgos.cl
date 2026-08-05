# Content pack: Brigada Galgos homepage prototypes

This file is the single source of content for the five homepage prototypes.
All dog facts, stories and organizational data are copied verbatim from the
Astro repository. Any connecting copy follows the site's voice and tone
(Chilean-Spanish neutral tuteo, first-person plural for Brigada, no
"encajar", no em dashes).

## Prototype directions

1. `editorial-documental`
2. `calido-domestico`
3. `tipografico-audaz`
4. `clinico-transparente`
5. `territorial-chileno`

---

## Shared asset map

Photos live under `prototypes/assets/<slug>/`. From an individual prototype
folder such as `prototypes/editorial-documental/`, use relative paths like
`../assets/<slug>/<file>`.

### Featured galgo

- `assets/luciano/luciano-01.jpg`
- `assets/luciano/luciano-02.jpg`
- `assets/luciano/luciano-03.jpg`

### Active galgos

- `assets/turron/turron-01.jpg`
- `assets/turron/turron-02.jpg`
- `assets/fito/fito-01.jpg`
- `assets/fito/fito-02.jpg`
- `assets/blue/blue-01.jpg`
- `assets/blue/blue-02.jpg`

### Rescue-story galgo (`exito`)

- `assets/mora/mora-01.jpg`
- `assets/mora/mora-02.jpg`
- `assets/mora/mora-03.jpg`

---

## Mission line

> Rescatamos, rehabilitamos y reubicamos galgos en Chile hasta encontrarles una familia segura.

---

## Organizational facts

- Legal name: Fundación Brigada Galgos
- RUT: 65.132.425-4
- WhatsApp: +56 9 8707 6101
- Email: contacto@brigadagalgos.cl
- Adoption form: https://forms.gle/4P7SnC229PHzXuRG6
- Foster form: https://forms.gle/3YHPo8KKnCiySbCo6
- eSponsor: https://esponsor.com/brigadagalgos
- Instagram: https://www.instagram.com/brigadagalgos/
- Facebook: https://www.facebook.com/p/Brigada-Galgos-100090629653797/
- Site URL: https://brigadagalgos.cl

### Bank transfer details

Copied from `src/scripts/copy-data.ts` and `src/components/sections/DonationCards.astro`:

- Nombre: Fundación Brigada Galgos
- RUT: 65.132.425-4
- Banco: Mercado Pago
- Tipo de cuenta: Cuenta Vista
- Número de cuenta: 1073480715

---

## Featured galgo: Luciano

Frontmatter copied verbatim from `src/content/dogs/luciano.md`.

- **name:** Luciano
- **status:** adopcion
- **sex:** Macho
- **age:** 10 meses
- **weight:** Talla mediana
- **details:** Luciano fue rescatado junto a Fito en Peralillo, donde los abandonaron. Fue un rescate de emergencia justo antes del temporal.
- **location:** Hogar temporal
- **currentNeed:** Adopción
- **characterSketch:** Luciano es alegre y muy amoroso. Está a salvo en hogar temporal y busca una familia.
- **adoptionFacts.compatibility:**
  - children: sin información confirmada
  - cats: sin información confirmada
  - femaleDogs: sin información confirmada
  - maleDogs: sin información confirmada
- **adoptionFacts.medicalOrSafetyNeeds:** Está sano.
- **adoptionFacts.personalityBehavior:** Es alegre y muy amoroso.
- **gallery:**
  - `assets/luciano/luciano-01.jpg`
  - `assets/luciano/luciano-02.jpg`
  - `assets/luciano/luciano-03.jpg`

---

## Active galgos

### Turrón

Frontmatter copied verbatim from `src/content/dogs/turron.md`.

- **name:** Turrón
- **status:** adopcion
- **sex:** Macho
- **age:** 6 años aprox.
- **weight:** Talla grande
- **details:** A Turrón lo arrojaron desde una camioneta en Isla de Maipo y hubo que operar su fractura.
- **location:** Isla de Maipo
- **currentNeed:** Adopción
- **characterSketch:** Turrón necesita una rutina tranquila, sin sobresaltos.
- **adoptionFacts.compatibility:**
  - children: caso a caso
  - cats: no
  - femaleDogs: sí
  - maleDogs: no
- **adoptionFacts.homeGuidance:** Necesita un ambiente tranquilo, sin niños pequeños, gatos ni perros machos.
- **adoptionFacts.medicalOrSafetyNeeds:** Tuvo una fractura que requirió una operación. Hoy está recuperado y castrado.
- **adoptionFacts.personalityBehavior:** Necesita una rutina tranquila, sin sobresaltos.
- **gallery:**
  - `assets/turron/turron-01.jpg`
  - `assets/turron/turron-02.jpg`

### Fito

Frontmatter copied verbatim from `src/content/dogs/fito.md`.

- **name:** Fito
- **status:** adopcion
- **sex:** Macho
- **age:** 1 año y medio
- **weight:** Talla mediana
- **details:** Fito fue rescatado junto a Luciano en Peralillo, donde los abandonaron. Fue un rescate de emergencia justo antes del temporal.
- **location:** Hogar temporal
- **currentNeed:** Adopción
- **characterSketch:** Fito es tranquilo y sociable. Está a salvo en hogar temporal y busca una familia.
- **adoptionFacts.compatibility:**
  - children: sin información confirmada
  - cats: sin información confirmada
  - femaleDogs: sin información confirmada
  - maleDogs: sin información confirmada
- **adoptionFacts.personalityBehavior:** Es tranquilo y se lleva bien con todos.
- **gallery:**
  - `assets/fito/fito-01.jpg`
  - `assets/fito/fito-02.jpg`

### Blue

Frontmatter copied verbatim from `src/content/dogs/blue.md`.

- **name:** Blue
- **status:** adopcion
- **sex:** Hembra
- **age:** 3 años aprox.
- **weight:** Talla grande
- **details:** Blue estaba deambulando en Isla de Maipo antes de ser rescatada.
- **location:** Isla de Maipo
- **currentNeed:** Adopción
- **characterSketch:** Blue se muestra amigable y sociable con otros perros y animales.
- **adoptionFacts.compatibility:**
  - children: sin información confirmada
  - cats: sin información confirmada
  - femaleDogs: sin información confirmada
  - maleDogs: sin información confirmada
- **adoptionFacts.medicalOrSafetyNeeds:** Ya está esterilizada.
- **adoptionFacts.personalityBehavior:** Se muestra amigable y sociable con otros perros y animales.
- **gallery:**
  - `assets/blue/blue-01.jpg`
  - `assets/blue/blue-02.jpg`

---

## Rescue-story galgo: Mora (`exito`)

Frontmatter copied verbatim from `src/content/dogs/mora.md`.

- **name:** Mora
- **status:** exito
- **story:** Mora llegó desde Los Andes muy debilitada, con garrapatas, diferencias entre sus riñones y una limitación visible en la cola. En hogar temporal recibió tratamiento y volvió a confiar. Después fue adoptada y hoy es parte de esa misma familia.
- **gallery:**
  - `assets/mora/mora-01.jpg`
  - `assets/mora/mora-02.jpg`
  - `assets/mora/mora-03.jpg`

---

## FAQ answers (verbatim)

From `src/config/faq.ts`.

### ¿Qué es un galgo y por qué adoptar uno?

Un galgo es un perro sensible, tranquilo en casa y muy compañero. Rescatamos galgos porque vemos de cerca un abandono que se repite demasiado, pero también vemos lo que pasa después. Con cuidado, rutina y una familia segura, vuelven a confiar. Adoptar uno es abrirle la puerta a un perro que puede hacer la vida diaria más bonita.

### ¿Cuánto ejercicio necesita un galgo?

Menos de lo que mucha gente imagina. Son atletas de carrera corta, rápidos por momentos y tranquilos en casa. Para la mayoría, dos caminatas al día y una rutina clara son suficientes. No necesitan horas de ejercicio ni un patio enorme. Necesitan paseos seguros, descanso y compañía.

### ¿Puedo tener un galgo si vivo en departamento?

Sí. Muchos galgos se adaptan muy bien a vivir en departamento porque pasan gran parte del día descansando y no ocupan mucho espacio. Lo importante no es tener una casa grande. Es ofrecer un lugar seguro, una camita cómoda, paseos diarios y compañía.

### ¿Cómo es el proceso de adopción paso a paso?

El proceso tiene cuatro pasos. De tu primer mensaje al galgo en tu sillón, estamos contigo en cada etapa.

1. Nos escribes por WhatsApp o completas el formulario.
2. Conversamos sobre tu rutina, tu espacio y tus expectativas.
3. Buscamos un galgo que pueda estar bien contigo.
4. Empiezas un período de prueba en casa y seguimos acompañándote paso a paso.

### ¿Cuánto cuesta adoptar un galgo y qué incluye?

Adoptar un galgo con nosotros no tiene costo. No pedimos un aporte obligatorio ni condicionamos la adopción a una donación. Lo que sí necesitamos es compromiso, cuidados, tiempo, paciencia y una vida segura. Si después quieres donar para ayudar a otros rescates, puedes hacerlo, pero es completamente voluntario.

### ¿Qué pasa si la adopción no funciona?

Si la adopción no funciona, no te dejamos solo con el problema. Trabajamos juntos para encontrar la mejor solución para ti y para el galgo. Preferimos que nos escribas temprano, aunque sea por una duda pequeña, antes de que la preocupación crezca en silencio.

---

## Content gaps

- No foster-story first-person account exists in the repository. Any
  first-person foster quote in the prototypes must be marked as
  **contenido pendiente** until a real quote is provided.
