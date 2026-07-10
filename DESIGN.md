---
name: Brigada Galgos
description: Sistema visual cercano, enérgico y confiable para rescate y adopción responsable de galgos en Chile.
colors:
  primary-cyan: "#00bcd4"
  primary-cyan-deep: "#006d78"
  primary-cyan-soft: "#cff4f8"
  secondary-magenta: "#e91e8c"
  secondary-magenta-deep: "#b8156d"
  secondary-magenta-soft: "#fcdcec"
  action-orange: "#ffa726"
  action-orange-deep: "#a85400"
  action-orange-soft: "#ffe7c2"
  rescue-green: "#43a047"
  rescue-purple: "#8e24aa"
  background: "#ffffff"
  surface: "#f5f6f8"
  surface-raised: "#eceef2"
  ink: "#1f2328"
  muted-ink: "#424a54"
  border: "#dadde3"
typography:
  display:
    fontFamily: '"Barlow Condensed", "Impact", sans-serif'
    fontSize: "clamp(3rem, 8vw, 4.25rem)"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "0em"
  headline:
    fontFamily: '"Barlow Condensed", "Impact", sans-serif'
    fontSize: "clamp(2.5rem, 4vw, 3rem)"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "0em"
  body:
    fontFamily: '"Barlow", "Segoe UI Variable", sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  lead:
    fontFamily: '"Barlow", "Segoe UI Variable", sans-serif'
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.75
rounded:
  sm: "6px"
  md: "12px"
  lg: "20px"
  xl: "28px"
  full: "9999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "24px"
  6: "32px"
  7: "40px"
  8: "48px"
  9: "64px"
  10: "80px"
  12: "96px"
  16: "128px"
components:
  button-primary:
    backgroundColor: "{colors.action-orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.primary-cyan-soft}"
    textColor: "{colors.primary-cyan-deep}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
    height: "48px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
    height: "48px"
  story-card:
    backgroundColor: "{colors.background}"
    rounded: "{rounded.lg}"
---

# Design System: Brigada Galgos

## 1. Overview

**Creative North Star: "El refugio en movimiento"**

El sistema combina la energía afectuosa de una organización de rescate con la calma que necesita quien está pensando en adoptar, donar o abrir su casa temporalmente. La fotografía de cada galgo es el punto de contacto principal; el color dirige la acción y la tipografía condensada hace que la voz se sienta humana, decidida y reconocible.

La interfaz debe ser clara desde el primer scroll y estar hecha para móvil sin volverse pequeña ni tímida en pantallas grandes. Usa una base neutra limpia, destellos muy suaves de cian y magenta, y naranjo para las decisiones principales. Rechaza toda apariencia de ONG distante, las campañas que apelan a la culpa, el dramatismo vacío y cualquier adorno que opaque a los perros o complique el siguiente paso.

**Key Characteristics:**

- Fotografía cercana y optimizada como prueba emocional y práctica.
- Tipografía compacta y expresiva para títulos, con cuerpo amable y muy legible.
- Paleta pop controlada: cian, magenta y naranjo cumplen funciones distintas.
- CTA directas, grandes y con lenguaje humano.
- Superficies curvas, elevación suave y navegación accesible.

## 2. Colors

La paleta toma la energía de la marca sin convertir cada pantalla en un arcoíris: el color siempre aclara una acción, jerarquía o estado.

### Primary

- **Cian de compañía:** lleva enlaces activos, acciones secundarias, anillos de foco y destellos de fondo. Es el color de orientación, no el relleno dominante.
- **Cian profundo:** sostiene texto y bordes sobre fondos claros cuando se necesita contraste real.

### Secondary

- **Magenta de impulso:** marca bandas de llamada, momentos editoriales y acentos de alto impacto. Úsalo para concentrar atención, no como sustituto del cian.
- **Magenta profundo:** reserva para superficies de CTA sostenidas y estados de mayor contraste.

### Tertiary

- **Naranjo de acción:** es el único relleno principal de las CTA que piden una decisión. Conserva texto oscuro encima.
- **Verde y púrpura de recorrido:** distinguen hitos, chips e ilustraciones; no deben convertirse en texto corrido ni en fondos de página.

### Neutral

- **Blanco y superficie fría:** sostienen lectura, fotografía y separación entre secciones.
- **Tinta y tinta atenuada:** llevan toda la lectura normal; nunca reemplaces la tinta atenuada por grises más pálidos.
- **Borde frío:** separa tarjetas, campos y controles con una línea fina.

**The Purposeful Palette Rule.** Cada color saturado debe tener una tarea: orientar, pedir acción, señalar un hito o acompañar una imagen. Si no tiene una tarea, no se usa.

## 3. Typography

**Display Font:** Barlow Condensed, con Impact como reserva.
**Body Font:** Barlow, con Barlow Fallback y una pila de sistema como reserva.

**Character:** Barlow Condensed aporta una voz fuerte, directa y de rótulo popular para los titulares. Barlow deja el resto de la conversación clara, cálida y fácil de leer. La combinación mantiene la energía del logo sin disfrazar el contenido como una campaña institucional.

### Hierarchy

- **Display:** peso 900 y escala fluida. Solo para el título de página o el mensaje que debe verse antes de leer; usa mayúsculas y `text-wrap: balance`.
- **Headline:** peso 900 y escala fluida. Para títulos de sección, con la misma voz condensada y mayúsculas.
- **Title:** peso 700 a 900 entre 1.125rem y 1.375rem. Para nombres de galgos, tarjetas y controles destacados.
- **Body:** peso 400 a 1rem con interlineado 1.55. Mantén el texto de lectura en contenedores estrechos y evita bloques de más de 75 caracteres por línea.
- **Lead:** 1.125rem con interlineado 1.75. Sirve para despejar dudas y preparar una CTA, no para repetir el titular.

**The Human Headline Rule.** Los títulos pueden ser enfáticos, pero el cuerpo debe responder la duda práctica que sigue. Nunca uses el display como decoración desconectada de una decisión real.

## 4. Elevation

La profundidad es suave y estructural. Las tarjetas, la foto principal, el menú móvil y la barra fija pueden elevarse para aclarar jerarquía o interacción; el resto de la página permanece plano y deja respirar las imágenes. La luz se construye con sombras azuladas de baja opacidad y capas de superficie, no con vidrio decorativo.

### Shadow Vocabulary

- **Contacto leve:** sombra corta para controles o superficies que recién se separan del fondo.
- **Tarjeta y barra activa:** sombra media para tarjetas al interactuar y navegación al desplazarse.
- **Panel y modal:** sombra amplia para el drawer móvil y capas que deben estar inequívocamente encima del documento.
- **Anillo de foco:** halo cian de 3px. Es obligatorio en controles navegables por teclado.

**The Earned Elevation Rule.** Toda sombra debe explicar una relación espacial o un estado. El brillo difuso usado solo para verse moderno está prohibido.

## 5. Components

### Buttons

Los botones son redondeados, robustos y verbales. Mantienen una altura mínima de 48px para que la acción se sienta fácil de tocar.

- **Shape:** píldora completa (9999px), con espaciado interno de 12px por 24px.
- **Primary:** relleno naranjo con tinta oscura. Úsalo para adoptar, postular, donar o enviar.
- **Secondary:** fondo cian suave, borde cian profundo y texto cian profundo. Úsalo para rutas alternativas que siguen siendo importantes.
- **Ghost:** sin relleno ni borde permanente. Úsalo para detalles de baja presión, como ver una ficha.
- **Hover / Focus:** transiciones rápidas con curva de salida pronunciada; foco visible mediante halo cian y nunca solo por color.

### Chips

Los filtros y datos breves usan cápsulas compactas para permitir exploración sin transformar la página en una tabla.

- **Style:** fondo de superficie o tinte funcional, texto legible y borde fino cuando hace falta separar.
- **State:** el chip activo debe cambiar color y `aria-pressed`; no comuniques la selección solo por una diferencia sutil de tono.

### Cards / Containers

Las tarjetas son contenedores para un caso real, no decoración repetida.

- **Corner Style:** curva generosa (20px) y borde de 1px.
- **Background:** fondo blanco sobre superficies ligeramente frías.
- **Shadow Strategy:** elevación discreta al reposo y un levantamiento de 2px al pasar el cursor.
- **Internal Padding:** 24px para el contenido textual.
- **Image Behavior:** la foto ocupa una región clara y recortada con `object-fit: cover`; los controles de galería se superponen con contraste alto.

### Inputs / Fields

Los campos de contacto deben sentirse simples y seguros: etiqueta visible, contenido legible y un recorrido claro desde nombre hasta mensaje.

- **Style:** etiqueta antes del control, superficie limpia, borde de una línea y radio medio.
- **Focus:** halo cian visible y contraste suficiente. El error nunca puede depender solo del color.
- **Error / Disabled:** explicar el estado con texto y asociación semántica además del estilo visual.

### Navigation

La navegación mantiene al visitante orientado sin competir con la causa.

- **Style:** barra fija de 64px con fondo translúcido de superficie y línea inferior fina.
- **Desktop:** enlaces de texto claros y CTA de donación visible.
- **Mobile:** botón circular de 40px que abre un panel lateral de 320px como diálogo modal, con cierre explícito y fondo bloqueado.
- **Theme:** el control de tema está presente en la barra y los tokens deben responder en claro y oscuro.

### Galería compartida

La galería permite conocer a cada galgo sin sacar al visitante del contexto de la ficha o tarjeta.

- **Style:** imagen protagonista, controles circulares oscuros y puntos de avance sobre la fotografía.
- **Behavior:** las imágenes se abren para ver detalles; las alternativas de texto y el control por teclado son obligatorios.

## 6. Do's and Don'ts

### Do:

- **Do** usar el naranjo para una sola acción principal por agrupación y el cian para rutas secundarias, foco y orientación.
- **Do** dar a cada fotografía de galgo un texto alternativo útil y un encuadre que preserve la presencia del perro.
- **Do** mantener el cuerpo en tinta o tinta atenuada sobre fondos claros, con contraste de texto de al menos 4.5:1.
- **Do** usar títulos Barlow Condensed en mayúsculas para jerarquía, pero mantener las decisiones y explicaciones en Barlow legible.
- **Do** respetar la reducción de movimiento y dejar el contenido visible incluso cuando una animación no pueda ejecutarse.
- **Do** mantener las CTA en verbos concretos y rutas claras: adoptar, dar hogar temporal, donar o escribir.

### Don't:

- **Don't** parecer una ONG distante, institucional o genérica.
- **Don't** usar culpa, urgencia vacía o relatos de sufrimiento sin salida para pedir una acción.
- **Don't** reemplazar la claridad por gradientes decorativos, texto en gradiente, vidrio ornamental o sombras sin función.
- **Don't** usar bordes laterales de color, rejillas interminables de tarjetas idénticas ni cejas pequeñas en mayúsculas sobre cada sección.
- **Don't** reducir el contraste de texto para que la interfaz se vea más suave.
- **Don't** ocultar el foco de teclado, la etiqueta de un campo o el significado de un estado solo porque el color ya lo sugiere.
