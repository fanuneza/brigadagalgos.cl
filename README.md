# Brigada Galgos

Sitio estático desarrollado con Astro para Brigada Galgos, organización dedicada al rescate, rehabilitación y adopción de galgos en Chile.

## Stack

- `Astro 6` con output estático y `ClientRouter` para navegación client-side
- `TypeScript`
- `@astrojs/sitemap` para generación de sitemap
- `astro:assets` con `sharp` para optimización de imágenes
- `@fontsource/barlow-condensed` para tipografía display
- `Playwright` para testing funcional e integración
- `@axe-core/playwright` para testing de accesibilidad
- `@lhci/cli` para Lighthouse CI

## Requisitos

- `Node.js` >= 22
- `npm`

## Comandos

| Comando                    | Descripción                                                      |
| -------------------------- | ---------------------------------------------------------------- |
| `npm install`              | Instala las dependencias del proyecto.                           |
| `npm run dev`              | Levanta el entorno local de desarrollo.                          |
| `npm run build`            | Verifica tipos con `astro check` y genera producción en `dist/`. |
| `npm run preview`          | Sirve localmente la compilación de producción.                   |
| `npm run prepare:casos`    | Ejecuta el script de preparación de casos.                       |
| `npm run dog-images:check` | Valida la normalización de nombres de imágenes de galgos.        |
| `npm run dog-images:write` | Normaliza los nombres de archivo de imágenes de galgos.          |
| `npm run lint`             | Ejecuta ESLint y Stylelint.                                      |
| `npm run lint:fix`         | Corrige automáticamente errores de lint.                         |
| `npm run format`           | Formatea todos los archivos con Prettier.                        |
| `npm run format:check`     | Verifica el formato sin modificar archivos.                      |
| `npm run test:lighthouse`  | Ejecuta Lighthouse CI sobre `dist/`.                             |
| `npm run test:e2e`         | Ejecuta todos los tests de Playwright.                           |
| `npm run test:smoke`       | Ejecuta los smoke tests de rutas críticas.                       |
| `npm run capture:local`    | Ejecuta todos los tests de Playwright en local.                  |
| `npm run capture:home`     | Ejecuta tests marcados con `@home`.                              |
| `npm run capture:adoptar`  | Ejecuta tests marcados con `@adoptar`.                           |
| `npm run capture:donar`    | Ejecuta tests marcados con `@donar`.                             |

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
    politica-de-cookies.astro # Página de política de cookies
    404.astro               # Página de error 404
    casos/
      exito-home.json.ts    # Endpoint JSON para historias de éxito
  layouts/
    BaseLayout.astro        # Layout base: head, cookie banner, scripts globales
  components/               # Componentes reutilizables de interfaz
    DonationBanner.astro
    Footer.astro
    HelpCards.astro
    Hero.astro
    InstagramLink.astro     # Link a Instagram con tracking y label accesible
    MissionSection.astro
    Navbar.astro            # Incluye el toggle de tema claro/oscuro
    PageHero.astro
    ProcessStepper.astro
    RainbowDivider.astro
    RequirementCard.astro
    SharedGalleryLightbox.astro
    SharedPhotoGallery.astro
    TrackedLink.astro       # Wrapper genérico para links instrumentados
    StoriesSection.astro
    StructuredData.astro    # Schema.org JSON-LD para SEO
    WhatsAppLink.astro      # Link a WhatsApp con mensaje prellenado y tracking
    sections/*.astro        # Bloques reutilizables que componen las páginas internas
  content/                  # Colecciones de contenido
    adoption-dogs/*.md      # Perfiles de galgos en adopción
    success-dogs/*.md       # Historias de éxito
    supporters/*.md         # Colaboradores y auspiciadores
  content.config.ts         # Esquema de las colecciones de contenido
  config/
    site.ts                 # Configuración global (contacto, redes, GTM)
  scripts/                  # Scripts de cliente (todos usan astro:page-load)
    analytics-events.ts     # Capa de eventos para GTM/GA4 via dataLayer
    cookie-consent.ts       # Controla consentimiento y carga diferida de GTM
    copy-data.ts            # Copia datos bancarios al portapapeles
    filter-chips.ts         # Filtro de galgos en /adoptar
    form.ts                 # Envío y validación del formulario de contacto
    navbar.ts               # Menú móvil y comportamiento del navbar
    shared-gallery.ts       # Galería de fotos y lightbox
    stories-section.ts      # Carga de historias en la sección de éxitos
    theme.ts                # Toggle y persistencia del tema claro/oscuro
  styles/
    global.css              # Punto de entrada: estilos base, botones, cookie banner
    tokens.css              # Tokens de diseño (colores, tipografía, espaciado, sombras)
    components/*.css        # Estilos por componente
  assets/                   # Imágenes procesadas por Astro
    images/                 # Imágenes generales
    casos/                  # Fotos de casos de adopción y éxito
  utils/
    analytics.ts            # Helpers compartidos para consentimiento y dataLayer
    html-escape.ts          # Escape seguro para HTML generado en cliente
    instagram.ts            # Extracción de handle de Instagram desde URL
    responsive-gallery-images.ts
    shuffle.ts
scripts/                    # Scripts de build y utilidades (root)
  normalize-dog-images.mjs  # Normalización de nombres de imágenes de galgos
  prepare-casos-site.mjs    # Preparación de casos
public/                     # Archivos estáticos publicados sin procesamiento
  _headers                  # Headers HTTP (CSP, cache control)
  site.webmanifest          # Manifest para PWA
  images/                   # Logos, favicons e imagen OG
```

## Modelo de contenido

### Galgos en adopción (`src/content/adoption-dogs/`)

Cada perfil se define como un archivo Markdown con frontmatter:

- `name` — Nombre del galgo
- `sex` — Sexo (`Macho` | `Hembra`)
- `age` — Edad (string descriptiva)
- `weight` — Peso (string descriptiva)
- `details` — Descripción del perfil
- `instagramUrl` — URL de Instagram del perfil (opcional)
- `order` — Orden de aparición (número, opcional)
- `gallery` — Array de imágenes (procesadas por `astro:assets`)

### Historias de éxito (`src/content/success-dogs/`)

Cada historia se define como un archivo Markdown con frontmatter:

- `name` — Nombre del galgo
- `story` — Texto de la historia
- `instagramUrl` — URL de Instagram de la historia (opcional)
- `gallery` — Array de imágenes (procesadas por `astro:assets`)

En `/por-que-galgos`, se seleccionan 3 historias al azar de esta colección en cada build.
En home, `StoriesSection.astro` renderiza una tanda inicial y completa el resto vía `/casos/exito-home.json` con paginación client-side.

### Colaboradores (`src/content/supporters/`)

Cada colaborador se define como un archivo Markdown con frontmatter:

- `name` — Nombre de la organización
- `description` — Descripción del aporte
- `thanksLabel` — Texto del enlace de agradecimiento
- `thanksUrl` — URL del enlace de agradecimiento
- `website` — Sitio web del colaborador
- `kind` — Tipo (`Institución` | `Empresa` | `Persona` | `Fundación` | `Colectivo` | `Veterinaria`)
- `order` — Orden de aparición (número)
- `logo` — Logo (procesado por `astro:assets`)
- `logoAlt` — Texto alternativo del logo

## Tema claro/oscuro

El sitio implementa dark mode sin librerías externas.

**Comportamiento:**

- Sin preferencia guardada, el sitio sigue `prefers-color-scheme` del sistema operativo.
- El usuario puede fijar su preferencia con el toggle del navbar. Se persiste en `localStorage` bajo la clave `brigada-galgos-theme`.
- La preferencia se aplica como `data-theme="light"` o `data-theme="dark"` en `<html>`.

**Anti-flash:** Un script inline en `<head>` (`is:inline`) lee `localStorage` y aplica `data-theme` antes del primer paint, evitando el destello de tema incorrecto.

**Tokens de diseño:** Los overrides de dark mode viven exclusivamente en `src/styles/tokens.css`, en dos bloques paralelos:

```css
:root[data-theme="dark"] { … }
@media (prefers-color-scheme: dark) { :root:not([data-theme]) { … } }
```

Tokens clave para superficies de contraste fijo (no cambian con el tema):

| Token                                  | Valor                        | Uso                                                                   |
| -------------------------------------- | ---------------------------- | --------------------------------------------------------------------- |
| `--color-text-on-dark`                 | `#f4f7fb`                    | Texto sobre fondos siempre oscuros (footer, banners)                  |
| `--color-text-on-brand`                | `#1f2328`                    | Texto sobre superficies de color de marca (badges, chips, pills)      |
| `--color-footer-bg`                    | `#1f2328` / `#0d0f14`        | Fondo del footer en cada modo                                         |
| `--color-cta-band-bg`                  | `#b8156d`                    | Fondo del banner de donación (magenta fijo para garantizar contraste) |
| `--on-primary` … `--on-rainbow-purple` | `var(--color-text-on-brand)` | Texto sobre cada color de badge/chip                                  |

**ClientRouter:** Astro's ClientRouter retains the live `document` and swaps in the incoming page's `<html>` content, which arrives without `data-theme`. The `theme.ts` script registers three listeners to handle this:

- `astro:before-swap` — injects the stored theme into `event.newDocument.documentElement` before the swap so the incoming document arrives pre-themed (no flash).
- `astro:after-swap` — calls `applyStoredTheme()` on the now-live document as a safety net.
- `astro:page-load` — reapplies the stored theme and reinitializes toggle buttons after each navigation.

Toggle initialization is idempotent via a `data-theme-toggle-initialized` guard on each button element, preventing duplicate click handlers across repeated navigations.

## Arquitectura de páginas

- Las páginas internas (`/adoptar`, `/donar`, `/contacto`, `/hogar-temporal`, `/por-que-galgos`, `/colaboradores`) se ensamblan con bloques en `src/components/sections/`, lo que separa copy, layout y comportamiento por tramo.
- `PageHero.astro` concentra el patrón de héroe interior; `Hero.astro` queda reservado para la portada.
- Las CTAs y enlaces instrumentados usan wrappers dedicados:
  - `TrackedLink.astro` para links internos o externos con atributos `data-track-*`.
  - `WhatsAppLink.astro` para abrir WhatsApp con texto prellenado y metadatos analíticos consistentes.
  - `InstagramLink.astro` para perfiles de casos con label accesible derivado del handle.
- La experiencia de historias y fichas usa una galería compartida (`SharedPhotoGallery.astro` + `src/scripts/shared-gallery.ts`) con lightbox, navegación por teclado, swipe y tracking.

## Accesibilidad

- **Skip-to-content:** Un link invisible hasta recibir foco (`skip-to-content.css`) permite a usuarios de teclado saltar directamente al contenido principal.
- **Contraste:** Los tokens `--color-text-on-dark` y `--color-text-on-brand` garantizan contraste WCAG 2.1 AA sobre superficies de color fijo.
- **Focus management:** El navbar móvil, lightbox y formularios gestionan foco y trampa de foco para usuarios de teclado y lectores de pantalla.

## SEO y datos estructurados

Cada página incluye `StructuredData.astro`, que inyecta JSON-LD con Schema.org:

- **Organization** (`NGO`) — datos de la fundación, redes, taxID.
- **WebSite** — información del sitio en español chileno (`es-CL`).
- **WebPage** — metadatos de la página actual e imagen principal.
- **BreadcrumbList** — migas de pan en páginas internas.
- **FAQPage** — preguntas frecuentes en `/por-que-galgos/`.

Además, el sitio cuenta con `site.webmanifest`, favicons en múltiples tamaños e imagen OG (`og:image`) para compartir en redes sociales.

## Testing

El proyecto tiene las siguientes suites de tests bajo `tests/visual/`, todas ejecutadas con Playwright sobre la build de producción servida localmente:

| Archivo                     | Descripción                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| `analytics-consent.spec.ts` | Verifica el flujo de consentimiento de cookies, carga de GTM, CSP headers y eventos de dataLayer. |
| `nav.spec.ts`               | Verifica el comportamiento del navbar (drawer móvil, foco, escape).                               |
| `filter-chips.spec.ts`      | Verifica el filtrado de galgos en `/adoptar`.                                                     |
| `stories-section.spec.ts`   | Verifica la carga y paginación de historias de éxito.                                             |
| `a11y.spec.ts`              | Escanea todas las páginas con axe-core buscando violaciones WCAG 2.1 AA.                          |
| `capture.spec.ts`           | Genera screenshots full-page en 4 viewports (1440, 1200, 810, 390). Se omite en CI.               |
| `smoke.spec.ts`             | Smoke tests de rutas críticas (`/`, `/adoptar/`, `/contacto/`, `/donar/`).                        |

### Requisitos para tests

```powershell
npm install
npx playwright install chromium
```

### Ejecutar tests localmente

```powershell
# Requiere build previa
npm run build
npm run test:e2e

# O solo smoke tests
npm run test:smoke

# Screenshots visuales
npm run capture:local

# Lighthouse CI
npm run build
npm run test:lighthouse
```

### Variables de entorno para Playwright

| Variable              | Descripción                                          | Default            |
| --------------------- | ---------------------------------------------------- | ------------------ |
| `PLAYWRIGHT_BASE_URL` | URL base externa para correr tests contra un deploy. | `http://127.0.0.1` |
| `PLAYWRIGHT_PORT`     | Puerto para el servidor de preview local.            | `4325`             |

### CI

Los tests corren en GitHub Actions en el job `validate`, que ejecuta en secuencia: lint → format-check → build → lighthouse → e2e. Playwright browsers se cachean entre runs.

## Analítica

- GTM se carga únicamente después de consentimiento aceptado.
- Contenedor GTM: `GTM-M2RN5B38`
- GA4 vive dentro de GTM: `G-97CD3EJYML`
- No se debe cargar `gtag.js` directo desde el sitio.
- Los eventos se empujan a `window.dataLayer` desde `src/scripts/analytics-events.ts`.
- `src/scripts/cookie-consent.ts` administra el banner, persiste la preferencia, emite `cookie_consent_update` y solo entonces inicializa GTM.
- `src/utils/analytics.ts` centraliza helpers de consentimiento, `dataLayer` y dispatch de eventos personalizados (`brigada:analytics`).
- La capa de eventos es privacy-safe: no envía nombres, emails, teléfonos ni texto libre ingresado por usuarios.

### Eventos custom actuales

- `cta_click`
- `navigation_click`
- `social_click`
- `whatsapp_click`
- `outbound_click`
- `section_view`
- `scroll_depth`
- `story_click`
- `gallery_open`
- `gallery_next`
- `gallery_previous`
- `stories_load_more`
- `dog_filter_click`
- `dog_interest_click`
- `foster_apply_click`
- `donation_esponsor_click`
- `bank_data_copy`
- `contact_form_submit`
- `contact_form_invalid`
- `contact_form_success`
- `contact_form_error`
- `cookie_consent_action`
- `cookie_consent_update`

### Cómo extender el tracking

1. Agrega atributos `data-track-*` al link, botón o bloque relevante.
2. Si necesitas visibilidad de una sección, agrega `data-track-section="nombre_estable"`.
3. Si la interacción vive en un script más complejo, emite un `CustomEvent("brigada:analytics", { detail: … })`.
4. Mantén nombres de evento en `snake_case` y evita datos personales o sensibles.

### Nota GTM

- Crea variables de Data Layer para `event_category`, `event_label`, `event_location`, `destination_url`, `section_name`, `percent`, `story_id`, `story_name`, `link_domain` y `link_url`.
- Mapea cada evento custom a una etiqueta GA4 Event, o usa una estrategia genérica basada en el nombre del evento.
- Evita doble conteo de scroll si GA4 Enhanced Measurement ya está registrando scroll.

## Flujo de trabajo recomendado

1. Instala dependencias con `npm install`.
2. Trabaja localmente con `npm run dev`.
3. Si cambias rutas, contenido o estilos, valida el resultado en navegador en ambos temas (claro y oscuro).
4. Antes de cerrar tu cambio, ejecuta `npm run build` (incluye verificación de tipos).
5. Para cambios visibles, considera correr `npm run test:e2e`, `npm run capture:local` y `npm run test:lighthouse`.

## Indexación con jCodemunch

Este repo está preparado para navegarse con `jcodemunch-mcp >= 1.108.23`, versión que incluye soporte para archivos Astro (`.astro`).

Configuración recomendada al indexar la carpeta local:

- Indexar desde la raíz del repo: `C:\Users\fanun\Code\brigadagalgos.cl`.
- Excluir rutas generadas o de caché: `dist`, `.astro`, `.cache`, `.lighthouseci`, `test-results`, `node_modules`.
- Validar la sesión con `resolve_repo`, `plan_turn`, `get_repo_outline`, `get_file_tree`, `get_file_outline`, `search_symbols` y `search_text`.

La lógica reusable de datos estructurados, imágenes responsivas del hero y transformación de galgos vive en `src/utils/*.ts` para que aparezca como símbolos TypeScript nombrados. Los archivos `.astro` se mantienen enfocados en composición y markup.

## Notas

- `dist/`, caches, logs, resultados de pruebas y otros archivos generados no forman parte de la fuente de verdad del proyecto.
- No subas secretos ni archivos `.env` reales al repositorio.
- El sitio está configurado en español chileno.
