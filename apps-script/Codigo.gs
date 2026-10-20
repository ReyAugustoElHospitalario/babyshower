/**
 * Lista de regalos del Baby Shower — Google Apps Script.
 *
 * Se pega en la hoja de regalos (Extensiones → Apps Script) y se publica como
 * "Aplicación web". La invitación lee la lista con GET y registra una elección con POST.
 *
 * Columnas de la hoja (la fila 1 son los encabezados):
 *   A = orden · B = regalo · C = invitado · D = fecha
 * Un regalo está disponible mientras la columna C esté vacía. Para liberarlo,
 * borra su invitado y su fecha.
 */

const PESTANA = '';      // Nombre de la pestaña con la lista. Vacío = la primera pestaña.
const PRIMERA_FILA = 2;  // Primera fila con regalos (la 1 tiene los encabezados)
const COL_REGALO = 2;    // B
const COL_INVITADO = 3;  // C
const COL_FECHA = 4;     // D

function hoja_() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  return PESTANA ? libro.getSheetByName(PESTANA) : libro.getSheets()[0];
}

function responder_(datos) {
  return ContentService.createTextOutput(JSON.stringify(datos)).setMimeType(ContentService.MimeType.JSON);
}

// No se envía quién eligió cada regalo: los invitados solo ven si está disponible
function leerRegalos_(hoja) {
  const ultima = hoja.getLastRow();
  if (ultima < PRIMERA_FILA) return [];
  return hoja.getRange(PRIMERA_FILA, COL_REGALO, ultima - PRIMERA_FILA + 1, 2).getDisplayValues()
    .map(([regalo, invitado], i) => ({ fila: PRIMERA_FILA + i, nombre: regalo.trim(), elegido: invitado.trim() !== '' }))
    .filter(r => r.nombre);
}

function doGet() {
  return responder_({ ok: true, regalos: leerRegalos_(hoja_()) });
}

function doPost(e) {
  let datos;
  try {
    datos = JSON.parse(e.postData.contents);
  } catch (err) {
    return responder_({ ok: false, error: 'datos-invalidos' });
  }
  const invitado = String(datos.invitado || '').trim().replace(/\s+/g, ' ').slice(0, 60);
  const fila = Number(datos.fila);
  if (invitado.length < 2 || !Number.isInteger(fila) || fila < PRIMERA_FILA) {
    return responder_({ ok: false, error: 'datos-invalidos' });
  }

  // El candado evita que dos invitados elijan el mismo regalo al mismo tiempo
  const candado = LockService.getScriptLock();
  if (!candado.tryLock(10000)) return responder_({ ok: false, error: 'ocupado' });
  try {
    const hoja = hoja_();
    if (fila > hoja.getLastRow()) return responder_({ ok: false, error: 'no-encontrado' });
    const [regalo, elegidoPor] = hoja.getRange(fila, COL_REGALO, 1, 2).getDisplayValues()[0];
    // Si la hoja se reordenó desde que el invitado abrió la lista, esa fila ya es otro regalo
    if (regalo.trim() !== String(datos.regalo || '').trim()) return responder_({ ok: false, error: 'no-encontrado' });
    if (elegidoPor.trim()) return responder_({ ok: false, error: 'ya-elegido' });

    // Un apóstrofo delante evita que un nombre como "=..." se interprete como fórmula
    const texto = /^[=+\-@]/.test(invitado) ? "'" + invitado : invitado;
    hoja.getRange(fila, COL_INVITADO).setValue(texto);
    hoja.getRange(fila, COL_FECHA).setValue(new Date()).setNumberFormat('dd/mm/yyyy hh:mm');
    SpreadsheetApp.flush();
    return responder_({ ok: true });
  } finally {
    candado.releaseLock();
  }
}
