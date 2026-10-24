// Jerarquía: Tatiana Vaytares Ochoa Aguilar
import * as THREE from 'three';
function construirJerarquia(piezas) {
  const raiz = new THREE.Group(); raiz.name = 'edificioCompleto';

  // Grupos por fachada
  const fSur   = new THREE.Group(); fSur.name   = 'fachadaSur';
  const fEste  = new THREE.Group(); fEste.name  = 'fachadaEste';
  const fNorte = new THREE.Group(); fNorte.name = 'fachadaNorte';
  const fOeste = new THREE.Group(); fOeste.name = 'fachadaOeste';
  const detalle= new THREE.Group(); detalle.name= 'detalles';

  // Fachada Sur
  fSur.add(piezas.puerta);
  fSur.add(piezas.ventana_F1); fSur.add(piezas.ventana_F2); fSur.add(piezas.ventana_F3);
  fSur.add(piezas.escalones); fSur.add(piezas.pilarSE);

  // Fachada Este
  fEste.add(piezas.ventana_E1); fEste.add(piezas.ventana_E2); fEste.add(piezas.ventana_E3);
  fEste.add(piezas.ventana_E4); fEste.add(piezas.ventana_E5); fEste.add(piezas.puertaEste);

  // Fachada Norte
  fNorte.add(piezas.ventana_N1); fNorte.add(piezas.ventana_N2);

  // Corredor Oeste
  fOeste.add(piezas.mCorrPost); fOeste.add(piezas.mCorrExt);
  fOeste.add(piezas.mCorrSur);  fOeste.add(piezas.mCorrNor);
  fOeste.add(piezas.techoCorredor); fOeste.add(piezas.fasciaCorr);
  fOeste.add(piezas.columnasCorredor); fOeste.add(piezas.rejasCorredor);

  // Detalles
  detalle.add(piezas.rodapies); detalle.add(piezas.cornisas);

  // Ensamblar raíz
  raiz.add(piezas.estructuraPrincipal);
  raiz.add(piezas.techo);
  raiz.add(piezas.plataforma);
  raiz.add(detalle);
  raiz.add(fSur);
  raiz.add(fEste);
  raiz.add(fNorte);
  raiz.add(fOeste);

  // Mapa de selección para la interfaz
  const mapa = {
    edificioCompleto : raiz,
    estructuraPrincipal : piezas.estructuraPrincipal,
    techo               : piezas.techo,
    plataforma          : piezas.plataforma,
    detalles            : detalle,
    puerta              : piezas.puerta,
    escalones           : piezas.escalones,
    fachadaSur          : fSur,
    fachadaEste         : fEste,
    fachadaNorte        : fNorte,
    fachadaOeste        : fOeste,
    columnasCorredor    : piezas.columnasCorredor,
    rejasCorredor       : piezas.rejasCorredor,
    techoCorredor       : piezas.techoCorredor,
  };

  return { raiz, mapa };
}

// ══════════════════════════════════════════════════════════════════════════════
// TRANSFORMACIONES  (Eliezer Yair Reyes Ávila — transformaciones.js)
// ══════════════════════════════════════════════════════════════════════════════

export { construirJerarquia };
