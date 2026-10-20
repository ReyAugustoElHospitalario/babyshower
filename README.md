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
lugar, textos, lista de regalos, fotos y música. Usa `\n` para forzar un salto de línea.
Si comentas (`//`) o dejas vacío un texto, no se muestra en la invitación.

- **Lista de regalos**: ver la sección siguiente. Los textos del modal están en `regalos`.
- **Fotos**: copia tus imágenes en `assets/img/` y actualiza `fotos`. Se recortan solas
  para llenar su marco.
- **Música**: reemplaza `assets/audio/musica.m4a` o cambia la ruta en `musica`.
- **Fecha**: los campos de la fecha se escriben a mano. En el demo dice
  "Sábado 14 de diciembre de 2025", pero ese día cae en domingo.

## Lista de regalos (Google Sheets)

El botón "Ver lista de regalos" abre un modal: el invitado escribe su nombre, elige un
regalo disponible y acepta. Su nombre y la fecha se guardan en la hoja de Google y el
regalo queda desactivado para los demás (que solo ven "Ya elegido", no quién lo eligió).
La lista muestra primero los disponibles y luego los elegidos, cada grupo en orden alfabético.

Para que el invitado recuerde qué eligió:

- Su elección se guarda en su navegador: al volver a abrir la lista ve "Ya elegiste: …" y
  ese regalo marcado como "Tu elección". Solo funciona en el mismo teléfono y navegador;
  si ustedes liberan el regalo en la hoja, deja de mostrarse.
- El botón "Guardar en WhatsApp" abre WhatsApp con un mensaje (regalo, fecha, hora y lugar)
  para que se lo envíe a sí mismo. El texto está en `regalos.whatsapp`.

La hoja usa estas columnas (la fila 1 son los encabezados):

| A     | B      | C                      | D     |
|-------|--------|------------------------|-------|
| orden | regalo | invitado (vacío = libre) | fecha |

Para conectarla (una sola vez):

1. Abre la hoja y ve a **Extensiones → Apps Script**.
2. Borra el contenido de `Código.gs` y pega el de [`apps-script/Codigo.gs`](apps-script/Codigo.gs).
   Si la lista no está en la primera pestaña, escribe su nombre en `PESTANA`.
3. **Implementar → Nueva implementación**, tipo **Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
4. Autoriza los permisos que pide Google y copia la **URL de la aplicación web**
   (termina en `/exec`).
5. Pégala en `regalos.urlScript` de [`js/config.js`](js/config.js).

Para liberar un regalo, borra su invitado y su fecha en la hoja. Si cambias el código del
script, usa **Implementar → Gestionar implementaciones → Editar → Nueva versión** para
conservar la misma URL.

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
js/app.js           Rellena textos, enlaces, fotos, música, transición y lista de regalos
apps-script/        Script de Google Sheets para la lista de regalos
assets/img|gif      Imágenes y GIF animados del diseño original
assets/fonts        Tipografías del diseño original
assets/audio        Música de fondo
```
