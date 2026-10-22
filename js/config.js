/*
 * Datos de la invitación. Edita este archivo para personalizarla.
 * - "\n" fuerza un salto de línea en el texto.
 */
window.INVITACION = {
  tituloPagina: 'Baby Shower de Yarek Elías',

  bebe: {
    nombre: 'Yarek Elías ',
  },

  titulo: 'Mi Baby Shower',
  intro: 'La dulce espera está por\nterminar, te invito a:',

  padres: {
    etiqueta: 'Mis Papis',
    nombres: 'Iván & Katherine',
  },

  fecha: {
    diaSemana: 'Domingo',
    dia: '08',
    mes: 'noviembre',
    anio: '2026',
    hora: '04:00 pm',
  },

  lugar: {
    titulo: 'Recepción',
    // nombre: '“Lavie eventos infantiles”',
    direccion: 'Jirón Manco Segundo 550,\nSan Miguel',
    // Enlace del botón "Mapa de ubicación"
    mapaUrl: 'https://maps.app.goo.gl/m3dajDVcLEF53yGZ6',
    // Lo que se busca en el mapa incrustado
    mapaBusqueda: 'Jirón Manco Segundo 550, San Miguel, Lima',
  },

  regalos: {
    titulo: 'Lista de regalos',
    texto: 'mami y papi han preparado una lista de cositas que necesitaré cuando llegue, puedes seleccionar un regalito para mi, gracias por tanto amor',
    boton: 'Ver lista\nde regalos',
    // URL de la aplicación web de Google Apps Script (termina en /exec). Ver README → "Lista de regalos".
    urlScript: 'https://script.google.com/macros/s/AKfycbzKjkGNcDjCAuJeoEhIF1DCspGD31q0x9Ia8HtziVgzUKIsYLXfI6BePecWhDrtwX1s/exec', // TODO: pegar la URL de la implementación
    // Textos del modal. {invitado} se reemplaza por el nombre que escribe el invitado.
    pideNombre: 'Para comenzar, dime tu nombre y apellido:',
    eligeRegalo: '¡Hola, {invitado}! Elige el regalo que te gustaría traer:',
    yaElegido: 'Ya elegido',
    sinRegalos: '¡Todos los regalos ya fueron elegidos! Gracias por tu cariño.',
    gracias: '¡Gracias, {invitado}! 🐝\nRegistramos que traerás:',
    recordatorio: 'Envia un rocordatorio del regalo que elegí a mi mamita o papito en WhatsApp:',
    // Al volver a abrir la lista, el invitado ve lo que eligió desde su teléfono
    miRegalo: 'Ya elegiste:',
    tuEleccion: 'Tu elección',
    botonWhatsapp: 'Enviar a WhatsApp',
    // Mensaje que el invitado se envía a sí mismo. {bebe}, {regalo}, {fecha}, {hora} y {lugar} se completan solos.
    whatsapp: '🎁 Mi regalo para el Baby Shower de {bebe}: {regalo}\n📅 {fecha}, {hora}\n📍 {lugar}',
  },

  gracias: {
    titulo: 'Gracias',
    texto: 'por ser parte de este\ndía especial',
  },

  // Las fotos nuevas se recortan automáticamente para llenar su marco.
  // Si reemplazas una foto con el mismo nombre, sube el número de "?v=" para que
  // los navegadores no sigan mostrando la versión anterior guardada en caché.
  fotos: {
    portada: 'assets/img/foto-papas-1.jpg?v=3',
    papas: 'assets/img/foto-papas-2.jpg?v=3',
    ecografia: 'assets/img/ecografia.jpg?v=2',
  },

  musica: 'assets/audio/musica.m4a',
};
