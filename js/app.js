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

  $$('[data-whatsapp]').forEach(a => {
    const datos = C.confirmacion[a.dataset.whatsapp];
    const mensaje = C.confirmacion.mensaje.replace('{nombre}', C.bebe.nombre);
    a.href = `https://wa.me/${datos.whatsapp}?text=${encodeURIComponent(mensaje)}`;
  });

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
