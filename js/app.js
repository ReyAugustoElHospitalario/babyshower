(() => {
  const C = window.INVITACION;
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const get = path => path.split('.').reduce((o, k) => (o == null ? o : o[k]), C);
  const escapar = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const SVG = 'http://www.w3.org/2000/svg';

  // Las fuentes "Happy" no traen letras acentuadas: se escribe la letra base y la tilde se dibuja encima
  const TILDES = { '́': '´', '̀': '`', '̃': '~', '̈': '¨' };
  const separarTilde = ch => {
    const [base, marca] = ch.normalize('NFD');
    return marca && TILDES[marca] ? [base, TILDES[marca]] : [ch, null];
  };

  // ---------- Textos ----------
  function textoHTML(el, valor) {
    const conTildes = el.classList.contains('sin-acentos');
    el.innerHTML = String(valor).split('\n').map(linea => [...linea].map(ch => {
      const [base, tilde] = conTildes ? separarTilde(ch) : [ch, null];
      if (!tilde) return escapar(ch);
      const clase = tilde === '´' ? 'acento' : 'acento glifo';
      return `<span class="${clase}${base === 'i' ? ' sobre-i' : ''}" data-tilde="${tilde}">${escapar(base)}</span>`;
    }).join('')).join('<br>');
  }

  // Texto curvo (SVG textPath): una <tspan> por letra para animarlas y tildes superpuestas
  function textoCurvo(textPath, valor) {
    const svg = textPath.closest('svg');
    const sinAcentos = textPath.parentNode.classList.contains('f-happy-selfie');
    const letras = [...String(valor).replace(/\n/g, ' ')].map(ch => (sinAcentos ? separarTilde(ch) : [ch, null]));
    textPath.textContent = '';
    letras.forEach(([base], i) => {
      const t = document.createElementNS(SVG, 'tspan');
      t.setAttribute('class', 'letra');
      t.style.setProperty('--i', i);
      t.textContent = base;
      textPath.appendChild(t);
    });
    svg.dataset.tildes = JSON.stringify(letras.map(([, tilde], i) => tilde && [i, tilde]).filter(Boolean));
  }

  // Necesita que el SVG esté visible para medir la posición de cada letra
  function dibujarTildesCurvas(raiz) {
    $$('svg.curvo[data-tildes]', raiz).forEach(svg => {
      $$('.tilde', svg).forEach(t => t.remove());
      const texto = svg.querySelector('text');
      const fs = parseFloat(texto.getAttribute('font-size'));
      JSON.parse(svg.dataset.tildes).forEach(([i, tilde]) => {
        let a, b, giro;
        try {
          a = texto.getStartPositionOfChar(i);
          b = texto.getEndPositionOfChar(i);
          giro = texto.getRotationOfChar(i);
        } catch (e) { return; }
        const rad = giro * Math.PI / 180;
        const sube = fs * 0.68; // desde la línea base hasta el centro de la tilde
        const cx = (a.x + b.x) / 2 + Math.sin(rad) * sube + Math.cos(rad) * fs * 0.06;
        const cy = (a.y + b.y) / 2 - Math.cos(rad) * sube + Math.sin(rad) * fs * 0.06;
        let t;
        if (tilde === '´') {
          // trazo redondeado, parecido a la tilde manuscrita del diseño original
          t = document.createElementNS(SVG, 'path');
          const dx = fs * 0.085, dy = fs * 0.11;
          t.setAttribute('d', `M${(cx - dx).toFixed(2)} ${(cy + dy).toFixed(2)}L${(cx + dx).toFixed(2)} ${(cy - dy).toFixed(2)}`);
          t.setAttribute('stroke', texto.getAttribute('fill'));
          t.setAttribute('stroke-width', (fs * 0.1).toFixed(2));
          t.setAttribute('stroke-linecap', 'round');
        } else {
          t = document.createElementNS(SVG, 'text');
          t.setAttribute('x', cx.toFixed(2));
          t.setAttribute('y', (cy + fs * 0.35).toFixed(2));
          t.setAttribute('font-size', (fs * 0.8).toFixed(2));
          t.setAttribute('fill', texto.getAttribute('fill'));
          t.setAttribute('text-anchor', 'middle');
          t.textContent = tilde;
        }
        t.setAttribute('class', 'tilde');
        t.setAttribute('transform', `rotate(${giro.toFixed(2)} ${cx.toFixed(2)} ${cy.toFixed(2)})`);
        t.style.setProperty('--i', i);
        svg.appendChild(t);
      });
    });
  }

  $$('[data-campo]').forEach(el => {
    const valor = get(el.dataset.campo);
    if (valor == null) return;
    if (el.tagName.toLowerCase() === 'textpath') textoCurvo(el, valor);
    else textoHTML(el, valor);
  });

  document.title = C.tituloPagina;

  // ---------- Fotos ----------
  $$('[data-foto]').forEach(el => {
    const src = C.fotos[el.dataset.foto];
    if (el.tagName.toLowerCase() === 'image') el.setAttribute('href', src);
    else el.src = src;
  });

  // ---------- Enlaces ----------
  $$('[data-enlace]').forEach(a => { a.href = get(a.dataset.enlace); });

  $$('iframe[data-mapa]').forEach(f => {
    f.src = `https://maps.google.com/maps?q=${encodeURIComponent(C.lugar.mapaBusqueda)}&z=16&output=embed`;
  });

  // ---------- Música ----------
  const audio = new Audio(C.musica);
  audio.loop = true;
  audio.preload = 'auto';
  const actualizarMusica = () => document.body.classList.toggle('sonando', !audio.paused);
  audio.addEventListener('play', actualizarMusica);
  audio.addEventListener('pause', actualizarMusica);
  const reproducir = () => audio.play().catch(() => {});
  const alternarMusica = () => (audio.paused ? reproducir() : audio.pause());
  $$('.boton-musica, .musica-flotante').forEach(b => b.addEventListener('click', alternarMusica));

  // ---------- Lista de regalos (Google Sheets vía Apps Script) ----------
  const R = C.regalos;
  const modal = document.querySelector('.modal-regalos');
  const pasos = {
    nombre: modal.querySelector('.paso-nombre'),
    lista: modal.querySelector('.paso-lista'),
    gracias: modal.querySelector('.paso-gracias'),
  };
  const campoNombre = pasos.nombre.querySelector('input');
  const listaRegalos = modal.querySelector('.lista-regalos');
  const botonAceptar = modal.querySelector('.aceptar');
  const miRegalo = modal.querySelector('.mi-regalo');
  const conInvitado = texto => texto.replace('{invitado}', invitado);
  let invitado = '';
  let regalos = [];

  // El nombre se recuerda en este navegador para no pedirlo cada vez
  const recordado = { leer() { try { return localStorage.getItem('invitado') || ''; } catch (e) { return ''; } },
    guardar(v) { try { localStorage.setItem('invitado', v); } catch (e) { /* sin almacenamiento */ } } };

  // Los regalos elegidos desde este navegador, para mostrárselos al invitado cuando vuelva
  const misRegalos = {
    leer() { try { return JSON.parse(localStorage.getItem('misRegalos')) || []; } catch (e) { return []; } },
    guardar(lista) { try { localStorage.setItem('misRegalos', JSON.stringify(lista)); } catch (e) { /* sin almacenamiento */ } },
  };
  const esMio = (r, mios) => r.elegido && mios.some(m => m.fila === r.fila && m.nombre === r.nombre);
  const unir = nombres => (nombres.length > 1 ? `${nombres.slice(0, -1).join(', ')} y ${nombres.at(-1)}` : nombres[0]);

  // Sin número de destino: WhatsApp deja elegir el chat (por ejemplo, el propio "Tú")
  function enlaceWhatsapp(nombres) {
    const f = C.fecha;
    const texto = R.whatsapp
      .replace('{bebe}', C.bebe.nombre.trim())
      .replace('{regalo}', unir(nombres))
      .replace('{fecha}', `${f.diaSemana} ${f.dia} de ${f.mes} de ${f.anio}`)
      .replace('{hora}', f.hora)
      .replace('{lugar}', `${C.lugar.nombre} – ${C.lugar.direccion.replace(/\s*\n\s*/g, ' ')}`);
    return `https://wa.me/?text=${encodeURIComponent(texto)}`;
  }

  function error(paso, mensaje = '') {
    const linea = paso.querySelector('.modal-error');
    if (linea) linea.textContent = mensaje;
  }

  function mostrarPaso(nombre) {
    Object.entries(pasos).forEach(([k, el]) => { el.hidden = k !== nombre; error(el); });
  }

  async function pedir(opciones) {
    if (!R.urlScript) throw new Error('Falta configurar regalos.urlScript en js/config.js');
    const respuesta = await fetch(R.urlScript, opciones);
    const datos = await respuesta.json();
    if (!datos.ok) throw Object.assign(new Error(datos.error), { codigo: datos.error });
    return datos;
  }

  // Primero los disponibles, luego los elegidos; cada grupo en orden alfabético
  const ordenar = (a, b) => a.elegido - b.elegido || a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base', numeric: true });

  function pintarMiRegalo(mios) {
    miRegalo.hidden = !mios.length;
    if (!mios.length) return;
    const nombres = mios.map(m => m.nombre);
    miRegalo.querySelector('.mi-regalo-nombre').textContent = unir(nombres);
    miRegalo.querySelector('.mi-regalo-whatsapp').href = enlaceWhatsapp(nombres);
  }

  function pintarLista() {
    // Si los papás liberaron un regalo en la hoja, deja de recordarse como propio
    const mios = misRegalos.leer().filter(m => regalos.some(r => esMio(r, [m])));
    misRegalos.guardar(mios);
    pintarMiRegalo(mios);
    const disponibles = regalos.filter(r => !r.elegido).length;
    listaRegalos.innerHTML = [...regalos].sort(ordenar).map(r => {
      const mio = esMio(r, mios);
      return `
      <li><label class="regalo${r.elegido ? ' elegido' : ''}${mio ? ' mio' : ''}">
        <input type="radio" name="regalo" value="${r.fila}"${r.elegido ? ' disabled' : ''}>
        <span class="regalo-nombre">${escapar(r.nombre)}</span>
        ${r.elegido ? `<span class="regalo-estado">${escapar(mio ? R.tuEleccion : R.yaElegido)}</span>` : ''}
      </label></li>`;
    }).join('');
    if (!disponibles) listaRegalos.insertAdjacentHTML('afterbegin', `<li class="lista-aviso">${escapar(R.sinRegalos)}</li>`);
    botonAceptar.disabled = true;
  }

  async function cargarLista() {
    listaRegalos.innerHTML = '<li class="lista-aviso">Cargando regalos…</li>';
    miRegalo.hidden = true;
    botonAceptar.disabled = true;
    try {
      regalos = (await pedir()).regalos;
      pintarLista();
    } catch (e) {
      console.error(e);
      listaRegalos.innerHTML = '<li class="lista-aviso">No pudimos cargar la lista. <button type="button" class="modal-enlace reintentar">Reintentar</button></li>';
    }
  }

  function abrirRegalos() {
    campoNombre.value = invitado || recordado.leer();
    mostrarPaso('nombre');
    modal.showModal();
    document.body.classList.add('modal-abierto');
    campoNombre.focus();
  }

  pasos.nombre.addEventListener('submit', e => {
    e.preventDefault();
    invitado = campoNombre.value.trim().replace(/\s+/g, ' ');
    if (invitado.length < 2) {
      error(pasos.nombre, 'Por favor, escribe tu nombre.');
      campoNombre.focus();
      return;
    }
    recordado.guardar(invitado);
    pasos.lista.querySelector('.saludo').textContent = conInvitado(R.eligeRegalo);
    mostrarPaso('lista');
    cargarLista();
  });

  listaRegalos.addEventListener('change', () => { botonAceptar.disabled = false; error(pasos.lista); });
  listaRegalos.addEventListener('click', e => { if (e.target.closest('.reintentar')) cargarLista(); });
  modal.querySelector('.cambiar-nombre').addEventListener('click', () => { mostrarPaso('nombre'); campoNombre.focus(); });

  pasos.lista.addEventListener('submit', async e => {
    e.preventDefault();
    const marcado = listaRegalos.querySelector('input:checked');
    if (!marcado) return;
    const regalo = regalos.find(r => String(r.fila) === marcado.value);
    botonAceptar.disabled = true;
    pasos.lista.setAttribute('aria-busy', 'true');
    try {
      // Cuerpo como texto plano: así el navegador no hace la consulta previa (CORS) que Apps Script no admite
      await pedir({ method: 'POST', body: JSON.stringify({ fila: regalo.fila, regalo: regalo.nombre, invitado }) });
      regalo.elegido = true;
      misRegalos.guardar([...misRegalos.leer(), { fila: regalo.fila, nombre: regalo.nombre }]);
      pasos.gracias.querySelector('.boton-whatsapp').href = enlaceWhatsapp([regalo.nombre]);
      pasos.gracias.querySelector('.gracias-texto').innerHTML = escapar(conInvitado(R.gracias)).replace(/\n/g, '<br>');
      pasos.gracias.querySelector('.regalo-elegido').textContent = regalo.nombre;
      mostrarPaso('gracias');
    } catch (err) {
      console.error(err);
      if (err.codigo === 'ya-elegido' || err.codigo === 'no-encontrado') {
        await cargarLista();
        error(pasos.lista, '¡Ups! Alguien acaba de elegir ese regalo. Por favor, elige otro.');
      } else {
        botonAceptar.disabled = false;
        error(pasos.lista, 'No pudimos guardar tu elección. Revisa tu conexión e inténtalo de nuevo.');
      }
    } finally {
      pasos.lista.removeAttribute('aria-busy');
    }
  });

  const abrir = document.querySelector('.abrir-regalos');
  abrir.setAttribute('aria-label', R.boton.replace(/\n/g, ' '));
  abrir.addEventListener('click', abrirRegalos);
  $$('[data-cerrar]', modal).forEach(b => b.addEventListener('click', () => modal.close()));
  // Tocar fuera del recuadro también cierra
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
  modal.addEventListener('close', () => document.body.classList.remove('modal-abierto'));

  // ---------- Animaciones al entrar en pantalla ----------
  const animables = sel => $$('.anim-entrar-izq, .anim-letras, .anim-flotar, .anim-latido', document.querySelector(sel));
  const observador = new IntersectionObserver(entradas => {
    entradas.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      observador.unobserve(e.target);
    });
  }, { threshold: 0.15 });

  // ---------- Navegación sobre → invitación ----------
  const portada = document.getElementById('portada');
  const invitacion = document.getElementById('invitacion');

  function mostrar(pantalla) {
    const verInvitacion = pantalla === invitacion;
    portada.classList.toggle('activa', !verInvitacion);
    invitacion.classList.toggle('activa', verInvitacion);
    document.body.classList.toggle('en-invitacion', verInvitacion);
    window.scrollTo(0, 0);
    dibujarTildesCurvas(pantalla);
    if (verInvitacion) animables('#invitacion').forEach(el => observador.observe(el));
    else {
      portada.querySelector('.escenario').classList.remove('abriendo');
      audio.pause();
    }
  }

  function abrirSobre() {
    reproducir(); // dentro del clic, así el navegador permite el audio
    portada.querySelector('.escenario').classList.add('abriendo');
    setTimeout(() => portada.classList.add('saliendo'), 450);
    setTimeout(() => {
      portada.classList.remove('saliendo');
      history.pushState(null, '', '#invitacion');
      mostrar(invitacion);
    }, 1050);
  }

  document.querySelector('.abrir-sobre').addEventListener('click', abrirSobre);
  window.addEventListener('popstate', () => mostrar(location.hash === '#invitacion' ? invitacion : portada));

  document.fonts.ready.then(() => {
    mostrar(location.hash === '#invitacion' ? invitacion : portada);
    requestAnimationFrame(() => animables('#portada').forEach(el => el.classList.add('visible')));
  });
})();
