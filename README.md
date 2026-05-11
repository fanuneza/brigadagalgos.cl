# Brigada Galgos

Sitio estático desarrollado con Astro para Brigada Galgos, organización dedicada al rescate, rehabilitación y adopción de galgos en Chile.

## Stack

- `Astro 6` con output estático y `ClientRouter` para navegación client-side
- `TypeScript`
- `@astrojs/sitemap` para generación de sitemap
- `astro:assets` con `sharp` para optimización de imágenes
- `Playwright` para testing funcional e integración
- `@axe-core/playwright` para testing de accesibilidad
- `@lhci/cli` para Lighthouse CI

## Requisitos

- `Node.js` >= 20
- `npm`

## Comandos

| Comando                   | Descripción                                                      |
| ------------------------- | ---------------------------------------------------------------- |
| `npm install`             | Instala las dependencias del proyecto.                           |
| `npm run dev`             | Levanta el entorno local de desarrollo.                          |
| `npm run build`           | Verifica tipos con `astro check` y genera producción en `dist/`. |
| `npm run preview`         | Sirve localmente la compilación de producción.                   |
| `npm run prepare:casos`   | Ejecuta el script de preparación de casos.                       |
| `npm run lint`            | Ejecuta ESLint y Stylelint.                                      |
| `npm run lint:fix`        | Corrige automáticamente errores de lint.                         |
| `npm run format`          | Formatea todos los archivos con Prettier.                        |
| `npm run format:check`    | Verifica el formato sin modificar archivos.                      |
| `npm run test:lighthouse` | Ejecuta Lighthouse CI sobre `dist/`.                             |
| `npm run capture:local`   | Ejecuta todos los tests de Playwright en local.                  |
| `npm run capture:home`    | Ejecuta tests marcados con `@home`.                              |
| `npm run capture:adoptar` | Ejecuta tests marcados con `@adoptar`.                           |
| `npm run capture:donar`   | Ejecuta tests marcados con `@donar`.                             |

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
  layouts/
    BaseLayout.astro        # Layout base: head, cookie banner, scripts globales
  components/               # Componentes reutilizables de interfaz
    DonationBanner.astro
    Footer.astro
    HelpCards.astro
    Hero.astro
    MissionSection.astro
    Navbar.astro            # Incluye el toggle de tema claro/oscuro
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
    responsive-gallery-images.ts
    shuffle.ts
public/                     # Archivos estáticos publicados sin procesamiento
  _headers                  # Headers HTTP (CSP, cache control)
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

En `/por-que-galgos`, se seleccionan 3 historias al azar de esta colección en cada build.

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

### Requisitos para tests

```powershell
npm install
npx playwright install chromium
```

### Ejecutar tests localmente

```powershell
# Requiere build previa
npm run build
npm run capture:local

# Lighthouse CI
npm run build
npm run test:lighthouse
```

### CI

Los tests corren en GitHub Actions en el job `test`, que depende del job `lint-and-build`. El artifact `dist/` generado en el primer job se descarga en el segundo, evitando reconstruir las imágenes de Astro.

## Analítica

- GTM se carga únicamente después de consentimiento aceptado.
- Contenedor GTM: `GTM-M2RN5B38`
- GA4 vive dentro de GTM: `G-97CD3EJYML`
- No se debe cargar `gtag.js` directo desde el sitio.
- Los eventos se empujan a `window.dataLayer` desde `src/scripts/analytics-events.ts`.
- La capa de eventos es privacy-safe: no envía nombres, emails, teléfonos ni texto libre ingresado por usuarios.

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
5. Para cambios visibles, considera correr `npm run capture:local` y `npm run test:lighthouse`.

## Notas

- `dist/`, caches, logs, resultados de pruebas y otros archivos generados no forman parte de la fuente de verdad del proyecto.
- No subas secretos ni archivos `.env` reales al repositorio.
- El sitio está configurado en español chileno.
