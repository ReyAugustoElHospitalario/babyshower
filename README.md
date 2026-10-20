# Invitación Baby Shower

Réplica en HTML/CSS/JS puro de la invitación de Canva
(`susideasinvitaciones.com/baby-shower-artah` → `/demo-pooh`).

## Verla en local

```bash
python3 -m http.server 8080
```

Luego abre <http://localhost:8080>. Hace falta un servidor (no basta con abrir el
archivo con doble clic) para que carguen las fuentes y el mapa.

## Personalizar

Todos los datos están en [`js/config.js`](js/config.js): nombre del bebé, papás, fecha,
lugar, textos, números de WhatsApp, fotos y música. Usa `\n` para forzar un salto de línea.

- **WhatsApp**: reemplaza los números de ejemplo (`59170000001` / `59170000002`) por los
  reales, con código de país y sin `+` ni espacios. El mensaje prellenado está en
  `confirmacion.mensaje`.
- **Fotos**: copia tus imágenes en `assets/img/` y actualiza `fotos`. Se recortan solas
  para llenar su marco.
- **Música**: reemplaza `assets/audio/musica.m4a` o cambia la ruta en `musica`.
- **Fecha**: los campos de la fecha se escriben a mano. En el demo dice
  "Sábado 14 de diciembre de 2025", pero ese día cae en domingo.

## Cómo funciona

- `index.html` contiene las dos pantallas: **portada** (el sobre) e **invitación**.
  Al tocar el sobre, el sello se abre, empieza la música y se muestra la invitación
  (la URL cambia a `#invitacion`; el botón "atrás" vuelve al sobre).
- El diseño usa un lienzo de 375 unidades de ancho. Cada elemento tiene su posición
  en variables CSS (`--x`, `--y`, `--w`, `--h`, `--r` = giro) y todo escala con el
  ancho de la pantalla. En escritorio se muestra centrado con un ancho máximo de 480px.
- Las fuentes "Happy Selfie" y "Happy Beige" no traen letras con tilde. `app.js` dibuja
  la tilde encima de la letra, así que puedes escribir "José" o "Confirmación" normalmente.
- Animaciones: el nombre aparece letra por letra, los títulos entran deslizándose,
  las abejas flotan y la foto "late". Se desactivan si el sistema pide reducir movimiento.

## Estructura

```
index.html          Marcado de las dos pantallas
css/estilos.css     Fuentes, lienzo escalable, botones, animaciones
js/config.js        Datos editables de la invitación
js/app.js           Rellena textos, enlaces, fotos, música y transición
assets/img|gif      Imágenes y GIF animados del diseño original
assets/fonts        Tipografías del diseño original
assets/audio        Música de fondo
```
