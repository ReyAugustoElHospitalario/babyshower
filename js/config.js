/*
 * Datos de la invitación. Edita este archivo para personalizarla.
 * - "\n" fuerza un salto de línea en el texto.
 * - Los números de WhatsApp van con código de país y sin "+", espacios ni guiones
 *   (ejemplo Bolivia: "59171234567").
 */
window.INVITACION = {
  tituloPagina: 'Baby Shower de José Arath',

  bebe: {
    nombre: 'José Arath',
  },

  titulo: 'Mi Baby Shower',
  intro: 'La dulce espera está por\nterminar, te invito a:',

  padres: {
    etiqueta: 'Mis Papis',
    nombres: 'David & Belén',
  },

  fecha: {
    diaSemana: 'Sábado',
    dia: '14',
    mes: 'diciembre',
    anio: '2025',
    hora: '14:00 hrs',
  },

  lugar: {
    titulo: 'Recepción',
    nombre: '“Lavie eventos infantiles”',
    direccion: 'Daniel Pena San 2764,\nCochabamba, Bolivia',
    // Enlace del botón "Mapa de ubicación"
    mapaUrl: 'https://maps.app.goo.gl/vphJ8iuBeoLSiiw78',
    // Lo que se busca en el mapa incrustado
    mapaBusqueda: 'Daniel Pena San 2764, Cochabamba, Bolivia',
  },

  confirmacion: {
    titulo: 'Confirmación',
    texto: 'Nos encantará saber que nos acompañarás, permítenos preparar los detalles confirmando tu asistencia.',
    // {nombre} se reemplaza por el nombre del bebé
    mensaje: '¡Hola! 🐝 Confirmo mi asistencia al Baby Shower de {nombre}. Mi nombre es: ',
    mama: {
      etiqueta: 'Confirmar\nasistencia a mamá',
      whatsapp: '59170000001', // TODO: reemplazar por el número real
    },
    papa: {
      etiqueta: 'Confirmar\nasistencia a papá',
      whatsapp: '59170000002', // TODO: reemplazar por el número real
    },
  },

  regalo: 'Si te gustaría hacer la llegada de\nnuestro bebito mas cómoda puedes\ntraer un presente.',

  gracias: {
    titulo: 'Gracias',
    texto: 'por ser parte de este\ndía especial',
  },

  // Las fotos nuevas se recortan automáticamente para llenar su marco
  fotos: {
    portada: 'assets/img/foto-papas-1.jpg',
    papas: 'assets/img/foto-papas-2.jpg',
    ecografia: 'assets/img/ecografia.jpg',
  },

  musica: 'assets/audio/musica.m4a',
};
