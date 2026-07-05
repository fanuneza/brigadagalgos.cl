# Brigada Galgos

Sitio web oficial de **Brigada Galgos**, una organización dedicada al rescate, recuperación y adopción responsable de galgos en Chile.

Este repositorio contiene el sitio público donde Brigada Galgos muestra perros en adopción, casos de éxito, formas de ayudar, preguntas frecuentes, contacto, colaboradores y el blog. El foco del proyecto es contar bien cada caso, facilitar el apoyo a la fundación y ofrecer una experiencia clara, rápida y accesible.

## Qué se puede hacer en este sitio

- Conocer galgos que hoy buscan familia.
- Leer historias de adopción y recuperación.
- Revisar preguntas frecuentes antes de adoptar o ser hogar temporal.
- Encontrar formas de donar o colaborar.
- Contactar al equipo por WhatsApp, correo o redes sociales.

## Dónde vive la información

- `src/content/adoption-dogs/`: fichas de galgos en adopción.
- `src/content/success-dogs/`: historias de galgos ya adoptados.
- `src/content/supporters/`: instituciones, marcas y personas que apoyan a Brigada Galgos.
- `src/content/blog/`: publicaciones del blog.
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
