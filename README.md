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

## Estructura del proyecto

```
src/
  pages/                    # Rutas del sitio
    adoptar.astro           # Página de adopción
    contacto.astro          # Página de contacto
    donar.astro             # Página de donaciones
    hogar-temporal.astro    # Página de hogar temporal
    index.astro             # Página de inicio
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
  content.config.ts         # Esquema de las colecciones de contenido
  config/
    site.ts                 # Configuración del sitio (contacto, redes)
  scripts/                  # Scripts de cliente
    copy-data.ts
    filter-chips.ts
    form.ts
    navbar.ts
    shared-gallery.ts
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
npm run build
npm run capture:local

# Lighthouse CI (requiere build previo)
npm run build
npm run test:lighthouse
```

## Flujo de trabajo recomendado

1. Instala dependencias con `npm install`.
2. Trabaja localmente con `npm run dev`.
3. Si cambias rutas, contenido o estilos, valida el resultado en navegador.
4. Antes de cerrar tu cambio, ejecuta `npm run build`.
5. Para cambios visibles, considera correr `npm run capture:local` y `npm run test:lighthouse`.

## Notas

- `dist/`, caches, logs, resultados de pruebas y otros archivos generados no forman parte de la fuente de verdad del proyecto.
- No subas secretos ni archivos `.env` reales al repositorio.
- El sitio está configurado en español.
