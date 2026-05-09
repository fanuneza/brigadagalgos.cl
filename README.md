# Brigada Galgos

Sitio estático desarrollado con Astro para Brigada Galgos, organización dedicada al rescate, rehabilitación y adopción de galgos en Chile.

## Stack

- `Astro 6` con output estático
- `TypeScript`
- `@astrojs/sitemap` para generación de sitemap
- `astro:assets` con `sharp` para optimización de imágenes
- `Playwright` + `@axe-core/playwright` para testing de accesibilidad
- `@lhci/cli` para Lighthouse CI

## Requisitos

- `Node.js` >= 20
- `npm`

## Comandos

| Comando                   | Descripción                                           |
| ------------------------- | ----------------------------------------------------- |
| `npm install`             | Instala las dependencias del proyecto.                |
| `npm run dev`             | Levanta el entorno local de desarrollo.               |
| `npm run build`           | Genera la versión de producción en `dist/`.           |
| `npm run preview`         | Sirve localmente la compilación de producción.        |
| `npm run prepare:casos`   | Ejecuta el script de preparación de casos.            |
| `npm run test:lighthouse` | Ejecuta Lighthouse CI sobre `dist/`.                  |
| `npm run capture:local`   | Ejecuta capturas visuales con Playwright.             |
| `npm run capture:home`    | Ejecuta capturas visuales de la página de inicio.     |
| `npm run capture:adoptar` | Ejecuta capturas visuales de la página de adopción.   |
| `npm run capture:donar`   | Ejecuta capturas visuales de la página de donaciones. |
| `npm run lint:fix`        | Corrige automáticamente errores de lint.              |
| `npm run format`          | Formatea todos los archivos con Prettier.             |

## Estructura del proyecto

```
src/
  pages/                    # Rutas del sitio
    adoptar.astro           # Página de adopción
    colaboradores.astro     # Página de colaboradores y auspiciadores
    contacto.astro          # Página de contacto
    donar.astro             # Página de donaciones
    hogar-temporal.astro    # Página de hogar temporal
    index.astro             # Página de inicio
    por-que-galgos.astro    # Por qué adoptar un galgo
  layouts/                  # Layouts compartidos
    BaseLayout.astro        # Layout base del sitio
  components/               # Componentes reutilizables de interfaz
    DonationBanner.astro
    Footer.astro
    HelpCards.astro
    Hero.astro
    MissionSection.astro
    Navbar.astro
    PageHero.astro
    ProcessStepper.astro
    RainbowDivider.astro
    RequirementCard.astro
    SharedGalleryLightbox.astro
    SharedPhotoGallery.astro
    StoriesSection.astro
  content/                  # Colecciones de contenido
    adoption-dogs/*.md      # Perfiles de galgos en adopción
    success-dogs/*.md       # Historias de éxito
    supporters/*.md         # Colaboradores y auspiciadores
  content.config.ts         # Esquema de las colecciones de contenido
  config/
    site.ts                 # Configuración del sitio (contacto, redes)
  scripts/                  # Scripts de cliente
    analytics-events.ts     # Capa liviana de eventos para GTM/GA4 via dataLayer
    copy-data.ts
    cookie-consent.ts       # Controla consentimiento y carga diferida de GTM
    filter-chips.ts
    form.ts
    navbar.ts
    shared-gallery.ts
    stories-section.ts
  styles/                   # Estilos del sitio
    global.css              # Punto de entrada de estilos
    tokens.css              # Tokens de diseño
    components/*.css        # Estilos por componente
  assets/                   # Imágenes procesadas por Astro
    images/                 # Imágenes generales
    casos/                  # Fotos de casos de adopción y éxito
public/                     # Archivos estáticos publicados sin procesamiento
```

## Modelo de contenido

### Galgos en adopción (`src/content/adoption-dogs/`)

Cada perfil se define como un archivo Markdown con frontmatter:

- `name` — Nombre del galgo
- `sex` — Sexo (`Macho` | `Hembra`)
- `age` — Edad (string descriptiva)
- `weight` — Peso (string descriptiva)
- `details` — Descripción del perfil
- `order` — Orden de aparición (número, opcional)
- `gallery` — Array de imágenes (procesadas por `astro:assets`)

### Historias de éxito (`src/content/success-dogs/`)

Cada historia se define como un archivo Markdown con frontmatter:

- `name` — Nombre del galgo
- `story` — Texto de la historia
- `gallery` — Array de imágenes (procesadas por `astro:assets`)

### Colaboradores (`src/content/supporters/`)

Cada colaborador se define como un archivo Markdown con frontmatter:

- `name` — Nombre de la organización
- `description` — Descripción del aporte
- `thanksLabel` — Texto del enlace de agradecimiento
- `thanksUrl` — URL del enlace de agradecimiento
- `website` — Sitio web del colaborador
- `kind` — Tipo (`Empresa` | `Clínica` | etc.)
- `order` — Orden de aparición (número)
- `logo` — Logo (procesado por `astro:assets`)
- `logoAlt` — Texto alternativo del logo

## Testing

El proyecto incluye tres capas de testing automatizado:

1. **Accesibilidad** — `tests/visual/a11y.spec.ts` escanea todas las páginas con axe-core buscando violaciones WCAG 2.1 AA.
2. **Capturas visuales** — `tests/visual/capture.spec.ts` genera screenshots full-page en 4 viewports (1440, 1200, 810, 390) para validación visual.
3. **Lighthouse CI** — `.lighthouserc.cjs` audita performance, accesibilidad, best practices y SEO contra umbrales definidos.

### Requisitos para tests

```powershell
npm install
npx playwright install chromium
```

### Ejecutar tests

```powershell
# Accesibilidad y capturas visuales (requiere build previo)
$env:ASTRO_TELEMETRY_DISABLED='1'; npm run build
npm run capture:local

# Lighthouse CI (requiere build previo)
$env:ASTRO_TELEMETRY_DISABLED='1'; npm run build
npm run test:lighthouse
```

## Analitica

- GTM ya esta instalado y se carga solo despues de consentimiento aceptado.
- Contenedor GTM: `GTM-M2RN5B38`
- GA4 vive dentro de GTM: `G-97CD3EJYML`
- No se debe cargar `gtag.js` directo desde el sitio.
- Los eventos del sitio se empujan a `window.dataLayer` desde `src/scripts/analytics-events.ts`.
- La capa de eventos es privacy-safe: no envia nombres, emails, telefonos ni texto libre ingresado por usuarios.

### Eventos custom actuales

- `cta_click`
- `navigation_click`
- `social_click`
- `outbound_click`
- `section_view`
- `scroll_depth`
- `story_click`
- `gallery_open`
- `gallery_next`
- `gallery_previous`
- `stories_load_more`

### Como extender tracking

1. Agrega atributos `data-track-*` al link, boton o bloque relevante.
2. Si necesitas visibilidad de una seccion, agrega `data-track-section="nombre_estable"`.
3. Si la interaccion vive en un script mas complejo, emite un `CustomEvent("brigada:analytics", { detail: ... })`.
4. Mantén nombres de evento en `snake_case` y evita datos personales o sensibles.

### Nota GTM

- En GTM conviene crear variables de Data Layer para `event_category`, `event_label`, `event_location`, `destination_url`, `section_name`, `percent`, `story_id`, `story_name`, `link_domain` y `link_url`.
- Luego puedes mapear cada `event` custom a una etiqueta GA4 Event, o usar una estrategia generica basada en el nombre del evento.
- Evita doble conteo de scroll si GA4 Enhanced Measurement ya esta registrando scroll.

## Flujo de trabajo recomendado

1. Instala dependencias con `npm install`.
2. Trabaja localmente con `npm run dev`.
3. Si cambias rutas, contenido o estilos, valida el resultado en navegador.
4. Antes de cerrar tu cambio, ejecuta `$env:ASTRO_TELEMETRY_DISABLED='1'; npm run build`.
5. Para cambios visibles, considera correr `npm run capture:local` y `npm run test:lighthouse`.

## Notas

- `dist/`, caches, logs, resultados de pruebas y otros archivos generados no forman parte de la fuente de verdad del proyecto.
- No subas secretos ni archivos `.env` reales al repositorio.
- El sitio está configurado en español.
