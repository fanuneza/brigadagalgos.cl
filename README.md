# Brigada Galgos

Sitio web oficial de **Brigada Galgos Chile**, una organización dedicada al rescate, recuperación y adopción de galgos.

El repo contiene el sitio público donde se muestran perros en adopción, casos de éxito, formas de apoyar a la fundación, preguntas frecuentes, contacto y colaboradores. La idea central del proyecto es simple: contar bien cada caso, facilitar la ayuda y hacerlo con una experiencia clara, rápida y accesible.

## Qué hay aquí

- Páginas públicas hechas con Astro.
- Fichas de galgos en adopción y casos de éxito cargados desde archivos Markdown.
- Imágenes optimizadas para web.
- Flujo de consentimiento para analítica antes de cargar GTM/GA4.
- Pruebas que cuidan accesibilidad, contenido, build y comportamiento visual básico.

## Cómo se organiza el contenido

- `src/content/adoption-dogs/`: perros que buscan adopción o hogar temporal.
- `src/content/success-dogs/`: historias de galgos adoptados.
- `src/content/supporters/`: instituciones y personas que apoyan a Brigada Galgos.
- `src/assets/`: imágenes del sitio y galerías.

## Levantar el proyecto

Requisitos:

- Node.js 22 o superior
- npm

Comandos principales:

```bash
npm install
npm run dev
```

Eso inicia el sitio en desarrollo local.

## Antes de publicar cambios

Las validaciones principales del repo son:

```bash
npm run format:check
npm run lint
npm run build
npm test
```

## Notas útiles

- La redacción del sitio sigue una voz cercana, clara y en español de Chile.
- Las historias de casos de éxito tienen reglas editoriales y de longitud para que funcionen bien en las tarjetas del sitio.
- La analítica está protegida por consentimiento: no se carga antes de que la persona usuaria la acepte.

## Documentación relacionada

- [Guía de voz y tono](docs/voice-and-tone.md)
- [Referencia técnica](docs/developer-reference.md)
- [Instrucciones para agentes](AGENTS.md)
