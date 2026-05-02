# Brigada Galgos — Sitio web

Sitio estático construido con **Astro 6**. Target: PageSpeed Insights ≥ 95 en mobile y desktop.

## Desarrollo

```bash
npm install
npm run dev       # servidor local en http://localhost:4321
npm run build     # build de producción en dist/
npm run preview   # previsualizar el build
```

## Cómo agregar un galgo en adopción

1. **Agrega las fotos** a `src/assets/casos/adopcion/[dog-id]/`
   - Nombra los archivos en orden: `01.jpg`, `02.jpg`, etc.
   - La primera imagen será la portada de la tarjeta.
   - Astro genera automáticamente variantes optimizadas (mobile, desktop, lightbox) a partir de estos archivos.

2. **Crea el archivo Markdown** en `src/content/adoption-dogs/[dog-id].md`:

   ```markdown
   ---
   name: Nombre del galgo
   sex: Hembra        # o Macho
   age: "3 años aprox."
   weight: "22 kg"
   details: "Historia breve del galgo (máx. ~210 caracteres)."
   order: 7           # número entero para controlar el orden antes del shuffle
   gallery:
     - ../../assets/casos/adopcion/[dog-id]/01.jpg
     - ../../assets/casos/adopcion/[dog-id]/02.jpg
     - ../../assets/casos/adopcion/[dog-id]/03.jpg
   ---
   ```

3. **Corre `npm run build`** y verifica que compile sin errores.

### Para retirar un galgo

Elimina o mueve su archivo `.md` de `src/content/adoption-dogs/`. Las imágenes en `src/assets/` pueden eliminarse después.

## Estructura relevante

```
src/
  assets/casos/adopcion/   # imágenes fuente de galgos en adopción
  content/
    adoption-dogs/         # un .md por galgo en adopción (fuente de verdad)
    dogs/                  # registros de historias de éxito (sistema separado)
  pages/
    adoptar.astro          # página /adoptar — lee desde adoption-dogs collection
  components/
    SharedPhotoGallery.astro
    SharedGalleryLightbox.astro

public/
  casos/
    exito.json             # feed de éxitos, leído en runtime por StoriesSection
    adopcion.json          # OBSOLETO — ver public/casos/adopcion-OBSOLETE.txt
```

## Scripts

| Comando | Uso |
|---------|-----|
| `npm run prepare:casos` | Regenera `public/casos/exito.json` desde fuente externa. Requiere acceso al directorio de fotos en el escritorio del desarrollador. |
