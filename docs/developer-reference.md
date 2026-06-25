# Referencia Técnica - Brigada Galgos

Este documento contiene especificaciones técnicas detalladas sobre la arquitectura, el modelo de datos, la analítica y las optimizaciones del sitio web de Brigada Galgos.

## Modelo de Contenido

### 1. Galgos en Adopción (`src/content/adoption-dogs/`)

Perfiles definidos en Markdown con frontmatter:

- `name` — Nombre del galgo.
- `sex` — Sexo (`Macho` | `Hembra`).
- `age` — Edad (string descriptiva).
- `weight` — Peso (string descriptiva).
- `details` — Descripción del perfil.
- `instagramUrl` — URL de Instagram del perfil (opcional).
- `order` — Orden de aparición (número, opcional).
- `gallery` — Array de imágenes (máximo 3, procesadas por `astro:assets`).

### 2. Historias de Éxito (`src/content/success-dogs/`)

Casos de éxito en Markdown con frontmatter:

- `name` — Nombre del galgo.
- `story` — Texto de la historia.
- `instagramUrl` — URL de Instagram de la historia (opcional).
- `gallery` — Array de imágenes (máximo 3, procesadas por `astro:assets`).

_Nota:_ En `/por-que-galgos`, se seleccionan 3 historias aleatorias en cada build. En el Home, `StoriesSection.astro` renderiza las iniciales y carga las restantes mediante la API `/casos/exito-home.json`.

### 3. Colaboradores (`src/content/supporters/`)

Colaboradores y auspiciadores en Markdown con frontmatter:

- `name` — Nombre de la organización.
- `description` — Descripción del aporte.
- `thanksLabel` — Texto del enlace de agradecimiento.
- `thanksUrl` — URL del enlace de agradecimiento.
- `website` — Sitio web del colaborador.
- `kind` — Tipo (`Institución` | `Empresa` | `Persona` | `Fundación` | `Colectivo` | `Veterinaria`).
- `order` — Orden de aparición (número).
- `logo` — Logo (procesado por `astro:assets`).
- `logoAlt` — Texto alternativo del logo.

---

## Imágenes y Optimización

Las imágenes de los galgos se almacenan en `src/assets/casos/`.

### Reglas de Optimización:

- **Límite de imágenes:** Máximo 3 imágenes por galgo (validado por esquema en `src/content.config.ts` y controlado en `src/utils/dog-content.ts`).
- **Cards (Tarjetas):** Se generan 3 variantes AVIF (`360w`, `480w`, `640w`) mediante `src/utils/responsive-gallery-images.ts`. El fallback para navegadores antiguos es WebP (`480w`).
- **Lightbox:** Imagen AVIF de `1200w`.
- **Héroe (Hero):**
  - Retrato: `360w`, `540w`, `720w`.
  - Paisaje: `640w`, `960w`, `1120w`.
- **Sección Editorial (`/por-que-galgos`):** `400w`, `600w`, `728w`.
- **Logos Colaboradores:** `240w`, `360w`, `480w`.

---

## Tema Claro/Oscuro (Dark Mode)

Implementación nativa sin dependencias externas:

- **Preferencia por defecto:** `prefers-color-scheme`.
- **Persistencia:** `localStorage` bajo la clave `brigada-galgos-theme`.
- **Aplicación:** Atributo `data-theme="light"` o `data-theme="dark"` en el tag `<html>`.
- **Anti-flash:** Script `is:inline` en `<head>` que lee el almacenamiento local antes del renderizado inicial.
- **ClientRouter (Astro):** Para preservar el tema durante transiciones de página, `theme.ts` gestiona tres eventos:
  - `astro:before-swap`: Aplica el tema al nuevo documento antes del intercambio.
  - `astro:after-swap`: Aplica el tema como red de seguridad.
  - `astro:page-load`: Re-aplica el tema e inicializa los botones del navbar (utilizando la bandera `data-theme-toggle-initialized` para evitar duplicidad de event listeners).

---

## SEO y Datos Estructurados

Cada página incluye `StructuredData.astro`, inyectando Schema.org en formato JSON-LD:

- **Organization** (`NGO`): Información de la fundación, redes sociales y RUT/taxID.
- **WebSite**: Datos del sitio en español chileno (`es-CL`).
- **WebPage**: Información específica de la ruta y su imagen OG (`og:image`).
- **BreadcrumbList**: Migas de pan para navegación interna.
- **FAQPage**: Preguntas frecuentes específicas en `/por-que-galgos/`.

Además, se genera un archivo `site.webmanifest` e imágenes para favicon y redes sociales en `public/`.

---

## Analítica y GTM

La carga de analíticas es estrictamente opt-in bajo consentimiento del usuario.

- **Contenedores:** GTM (`GTM-M2RN5B38`) y GA4 (`G-97CD3EJYML`).
- **Consentimiento:** Administrado por `src/scripts/cookie-consent.ts`. Bloquea la inyección de GTM hasta recibir el consentimiento del usuario y despacha `cookie_consent_update` junto al evento de Consent Mode v2 correspondiente.
- **Privacy-safe:** No se envían correos, nombres, teléfonos ni datos personales.
- **Eventos personalizados (`dataLayer`):**
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

### Extender el Tracking:

1. Añadir atributos `data-track-*` a los elementos HTML.
2. Usar `data-track-section="nombre"` para secciones específicas.
3. Emitir el evento personalizado `brigada:analytics` con detalles en scripts complejos.

---

## Pruebas de Integración y E2E (Playwright)

El proyecto cuenta con las siguientes suites de pruebas en `/tests`:

- `analytics-consent.spec.ts`: Consentimiento, CSP, GTM y eventos.
- `nav.spec.ts`: Accesibilidad y comportamiento del menú móvil.
- `filter-chips.spec.ts`: Filtros de búsqueda en la página `/adoptar`.
- `stories-section.spec.ts`: Paginación y galerías optimizadas en testimonios.
- `a11y.spec.ts`: Escaneo de accesibilidad automatizada con `axe-core`.
- `smoke.spec.ts`: Pruebas de humo en páginas críticas.

---

## Indexación y Herramientas (jCodeMunch)

Este repositorio está optimizado para jCodeMunch:

- **Exclusiones recomendadas al indexar:** `dist`, `.astro`, `.cache`, `.lighthouseci`, `test-results`, `node_modules`.
- La lógica de negocio pesada, estructuración de datos y transformación de imágenes se extraen a `src/utils/*.ts` para facilitar la navegación estática y el análisis de dependencias.
