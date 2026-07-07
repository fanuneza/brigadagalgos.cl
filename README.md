# Brigada Galgos

Sitio web oficial de **Brigada Galgos**, una organización dedicada al rescate, recuperación y adopción responsable de galgos en Chile.

Este repositorio contiene el sitio público donde Brigada Galgos muestra perros en adopción, casos de éxito, formas de ayudar, preguntas frecuentes, contacto, colaboradores y el blog. El foco del proyecto es contar bien cada caso, facilitar el apoyo a la fundación y ofrecer una experiencia clara, rápida y accesible.

## Qué se puede hacer en este sitio

- Conocer galgos que hoy buscan familia, incluyendo la ficha individual de cada uno.
- Leer historias de adopción y recuperación.
- Revisar preguntas frecuentes antes de adoptar o ser hogar temporal.
- Encontrar formas de donar o colaborar.
- Contactar al equipo por WhatsApp, correo o redes sociales.
- Leer el blog de la fundación.

## Dónde vive la información

- `src/content/adoption-dogs/`: fichas de galgos en adopción.
- `src/content/success-dogs/`: historias de galgos ya adoptados.
- `src/content/supporters/`: instituciones, marcas y personas que apoyan a Brigada Galgos.
- `src/content/blog/`: publicaciones del blog.
- `src/assets/`: imágenes del sitio y galerías.

## Levantar el proyecto

Requisitos:

- Node.js 22 (`.nvmrc` fija la versión mayor esperada)
- npm

Instalación y desarrollo local:

```bash
npm ci
npm run dev
```

Otros comandos útiles:

```bash
npm run check
npm run build
npm run preview
```

`npm ci` es la opción preferida para mantener el árbol de dependencias alineado con `package-lock.json`.

El sitio se compila como Astro estático y se despliega en Cloudflare Pages.

## Antes de publicar cambios

Las validaciones principales del repo son:

```bash
npm run format:check
npm run lint
npm run build
npm test
```

Si el cambio afecta rendimiento, accesibilidad o estructura visual de páginas clave, también conviene correr:

```bash
npm run test:lighthouse
```

## Notas útiles

- La redacción del sitio sigue una voz cercana, clara y en español de Chile.
- La analítica se carga solo después del consentimiento de la persona usuaria.
- Las historias y fichas tienen reglas editoriales para que el contenido se vea bien en tarjetas, buscadores y datos estructurados.
- El sitio está pensado para mantenerse rápido, accesible y fácil de navegar tanto en escritorio como en móvil.

## Documentación relacionada

- [Brief del sitio](docs/site-brief.md)
- [Requisitos del producto](docs/prd.md)
- [Especificación técnica](docs/spec.md)
- [Inventario de funcionalidades](docs/feature-inventory.md)
- [Modelo de contenido](docs/content-model.md)
- [Mapa de arquitectura](docs/architecture-map.md)
- [Guía de voz y tono](docs/voice-and-tone.md)
- [Referencia técnica](docs/developer-reference.md)
- [Instrucciones para agentes](AGENTS.md)
