# brigadagalgos.cl

Sitio web de **Brigada Galgos**, una fundacion chilena dedicada al rescate, rehabilitacion y reubicacion de galgos abandonados.

## Stack

- **Framework:** Astro 6
- **Salida:** sitio estatico
- **Estilos:** CSS plano con tokens propios en `design-system/tokens.css`
- **Deploy:** Cloudflare Pages
- **Fuentes:** Google Fonts

## Requisitos

- Node.js 20 o superior
- npm

## Desarrollo local

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:4321`.

## Scripts

- `npm run dev` inicia el servidor local de Astro
- `npm run build` genera la version de produccion en `dist/`
- `npm run preview` sirve localmente la salida compilada
- `npm run prepare:casos` genera el sitio de casos desde `scripts/prepare-casos-site.mjs`

## Paginas

- `/` Inicio
- `/adoptar`
- `/hogar-temporal`
- `/donar`
- `/contacto`

## Estructura

- `src/pages/` rutas del sitio
- `src/components/` componentes reutilizables
- `src/layouts/` layouts base
- `src/styles/` estilos globales y por componente
- `src/config/` configuracion del sitio
- `src/scripts/` scripts de interaccion en cliente
- `public/` assets estaticos servidos directamente
- `design-system/` tokens, documentacion y wireframes
- `scripts/` utilidades de soporte

## Sistema de diseno

Los tokens visuales viven en `design-system/tokens.css` y se importan desde la hoja global. Si necesitas ajustar colores, espaciado o tipografia, modifica primero los tokens y luego revisa los componentes que los consumen.

La documentacion del sistema esta en `design-system/design-system.md`.

## Despliegue

El sitio esta pensado para Cloudflare Pages con:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node version:** `20`

## Notas

- El sitio usa assets estaticos desde `public/`.
- Los componentes de layout y footer centralizan la navegacion y el credito del proyecto.
- Si agregas una nueva pagina, crea el archivo correspondiente en `src/pages/` y valida el build con `npm run build`.
