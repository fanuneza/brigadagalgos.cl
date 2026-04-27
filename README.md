# brigadagalgos.cl

Sitio web de **Brigada Galgos** — fundación chilena que rescata, rehabilita y reubica galgos abandonados.

## Stack

- **Framework:** Astro 6.1.9 (SSG — salida estática pura)
- **Estilos:** CSS plano con tokens de `design-system/tokens.css`
- **Deploy:** Cloudflare Pages (push-triggered desde `main`)
- **Fuentes:** Google Fonts (Barlow Condensed + Inter)

## Desarrollo local

```bash
npm install
npm run dev        # http://localhost:4321
```

## Build

```bash
npm run build      # genera dist/
npm run preview    # sirve dist/ localmente
```

## Deploy

El sitio se despliega automáticamente en Cloudflare Pages con cada push a `main`.

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node version:** 20 (variable de entorno `NODE_VERSION=20`)

## Sistema de diseño

Todos los tokens visuales (colores, tipografía, espaciado) viven en `design-system/tokens.css`.
La hoja de estilos global los importa con una ruta relativa — nunca copies los valores directamente.

Las especificaciones de componentes y las reglas de contraste están en `design-system/design-system.md`.
Los wireframes por página están en `design-system/wireframes/`.

## Páginas (Stage 1)

| Ruta | Estado |
|---|---|
| `/` | ✅ Live |
| `/adoptar` | Stage 2 |
| `/hogar-temporal` | Stage 2 |
| `/donar` | Stage 2 |
| `/quienes-somos` | Stage 2 |
| `/prensa` | Stage 2 |
| `/contacto` | Stage 2 |
