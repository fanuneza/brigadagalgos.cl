# Brigada Galgos

Sitio estático desarrollado con Astro para **Brigada Galgos**, una organización chilena sin fines de lucro dedicada al rescate, rehabilitación y adopción de galgos.

El sitio es completamente responsivo, accesible, compatible con temas claro y oscuro, e implementa analítica bajo un flujo de consentimiento estricto.

## Stack Tecnológico

- **Astro 7**: Framework principal con generación estática (SSG) y navegación mediante `ClientRouter`.
- **TypeScript**: Tipado estático para robustez del código.
- **CSS Moderno**: Diseño modular con tokens personalizados de diseño (colores, tipografía, espaciados).
- **Astro Assets (Sharp)**: Optimización y generación automática de variantes de imágenes responsivas (AVIF/WebP).
- **Playwright / Axe-core**: Pruebas de integración, regresión visual y auditoría automatizada de accesibilidad (A11y).
- **Vitest**: Entorno rápido para pruebas unitarias.

---

## Requisitos Previos

- **Node.js** >= 22 (especificado en el archivo [.nvmrc](.nvmrc))
- **npm** (gestor de paquetes nativo)

---

## Inicio Rápido

1. **Instalar dependencias:**

   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo:**

   ```bash
   npm run dev
   ```

   Abre [http://localhost:4321](http://localhost:4321) en tu navegador.

3. **Compilar para producción:**

   ```bash
   npm run build
   ```

   Valida tipos de TypeScript y compila el sitio de producción en la carpeta `dist/`.

4. **Visualizar la compilación de producción localmente:**
   ```bash
   npm run preview
   ```

---

## Comandos Principales

| Comando                    | Descripción                                                                         |
| :------------------------- | :---------------------------------------------------------------------------------- |
| `npm run dev`              | Inicia el entorno local de desarrollo en tiempo real.                               |
| `npm run build`            | Ejecuta verificación de tipos y construye el sitio estático para producción.        |
| `npm run preview`          | Sirve localmente los archivos compilados de la carpeta `dist/`.                     |
| `npm run lint`             | Corre ESLint, Stylelint y comprobaciones de calidad de texto.                       |
| `npm run lint:fix`         | Resuelve automáticamente problemas de linter corregibles.                           |
| `npm run format`           | Aplica formato Prettier a todo el código.                                           |
| `npm test`                 | Corre la suite de pruebas unitarias (Vitest) y de integración (Playwright).         |
| `npm run test:smoke`       | Ejecuta pruebas rápidas de humo sobre las rutas y páginas críticas.                 |
| `npm run test:lighthouse`  | Ejecuta auditorías locales de rendimiento y accesibilidad de Lighthouse CI.         |
| `npm run dog-images:write` | Normaliza los nombres de archivos de las imágenes de galgos en `src/assets/casos/`. |
| `npm run prepare:casos`    | Prepara y actualiza los endpoints e información local de casos de adopción.         |

---

## Estructura del Proyecto

Una vista general simplificada del código fuente en `src/`:

- **`src/pages/`**: Rutas y páginas públicas del sitio (Inicio, Adoptar, Donar, Hogar Temporal, Colaboradores, etc.).
- **`src/components/`**: Componentes interactivos y reutilizables de UI.
  - **`sections/`**: Secciones modulares específicas que componen cada una de las páginas.
- **`src/content/`**: Colecciones de datos basadas en Markdown (`adoption-dogs`, `success-dogs`, `supporters`).
- **`src/scripts/`**: JavaScript de cliente (flujos de consentimiento de cookies, filtros de galgos, formularios de contacto, etc.).
- **`src/styles/`**: Hojas de estilo modularizadas y tokens de diseño personalizados.
- **`src/utils/`**: Helpers y funciones auxiliares para analítica, Schema.org/SEO, y galerías de imágenes.

---

## Guías y Documentación Relacionada

- **Pautas de Redacción:** Para asegurar la coherencia en la comunicación y los textos del sitio, consulta la [Guía de Voz y Tono](docs/voice-and-tone.md).
- **Referencia Técnica:** Para conocer los detalles del modelo de datos de las colecciones, optimización de imágenes, analítica web de GTM/GA4 y más especificaciones de desarrollo, lee la [Referencia Técnica para Desarrolladores](docs/developer-reference.md).
