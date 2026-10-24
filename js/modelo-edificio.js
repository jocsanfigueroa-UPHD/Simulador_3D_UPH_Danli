// Modelado: Jocsan Yair Zelaya Figueroa
import * as THREE from 'three';
const C = {
  muro        : 0xeeeae0,   // muros principales blancos/crema
  muroGris    : 0xe0dcd4,   // fachada este (gris claro)
  teja        : 0x996348,   // tejas de barro, marrón oscuro
  fascia      : 0x2e1a0a,   // fascia/alero, casi negro
  marco       : 0xcfaa7a,   // marcos de puertas y ventanas, arenisca beige
  marcoOsc    : 0xb8924f,   // moldura interior del arco
  reja        : 0x181818,   // rejas de hierro, negro
  puerta      : 0x3a2518,   // hojas de puerta, madera oscura
  vidrio      : 0x263638,   // vidrio, azul grisáceo
  amarillo    : 0xe9bc2e,   // muros del corredor amarillo
  columna     : 0xf4efe6,   // columnas del corredor, blanco
  banqueta    : 0xb0a890,   // banqueta de hormigón
  escalon     : 0x9a9278,   // escalones
  rodapie     : 0xd4c8a8,   // rodapié
  cumbrera    : 0x2e1a0a,   // cumbrera del techo
};

// ══════════════════════════════════════════════════════════════════════════════
// UTILIDADES DE GEOMETRÍA
// ══════════════════════════════════════════════════════════════════════════════

function mkMat(color) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.86, metalness: color===C.reja ? 0.35 : 0 });
}

/** Caja posicionada */
function box(w, h, d, color, name, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mkMat(color));
  m.name = name;
  m.position.set(x, y, z);
  return m;
}

/** Cilindro posicionado */
function cyl(rT, rB, h, segs, color, name, x = 0, y = 0, z = 0, phi = Math.PI * 2) {
  const geo = new THREE.CylinderGeometry(rT, rB, h, segs, 1, false, 0, phi);
  const m = new THREE.Mesh(geo, mkMat(color));
  m.name = name;
  m.position.set(x, y, z);
  return m;
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENTES ARQUITECTÓNICOS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Ventana con arco colonial — marco beige, reja interior, medallón.
 * Se crea mirando hacia Z+ y se gira externamente para otras fachadas.
 */
// Contorno arqueado en el plano XY. Aberturas simuladas sobre el muro, sin corte booleano.
function contornoArco(w,h) {
  const r=w/2, y=h/2-r;
  const s=new THREE.Shape();s.moveTo(-r,-h/2);s.lineTo(r,-h/2);s.lineTo(r,y);
  s.absarc(0,y,r,0,Math.PI,false);s.lineTo(-r,-h/2);return s;
}
function huecoArco(g,w,h,x,y,z,color,nombre) {
  const m=new THREE.Mesh(new THREE.ShapeGeometry(contornoArco(w,h),24),mkMat(color));
  m.position.set(x,y,z);m.name=nombre;g.add(m);return m;
}
function marcoArco(g,w,h,t,nombre) {
  const s=contornoArco(w+2*t,h+2*t);
  const hole=contornoArco(w,h);s.holes.push(new THREE.Path(hole.getPoints(32)));
  const m=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.10,bevelEnabled:true,bevelSize:.012,bevelThickness:.012,bevelSegments:1,steps:1,curveSegments:24}),mkMat(C.marco));
  m.position.z=.10;m.name=nombre;g.add(m);
}
function voluta(g,x,y,z,radio=.075) {
  const m=new THREE.Mesh(new THREE.TorusGeometry(radio,.012,4,16,Math.PI*1.7),mkMat(C.reja));
  m.position.set(x,y,z);g.add(m);
}
function abertura(nombre,w,h,esPuerta=false) {
  const g=new THREE.Group();g.name=nombre;
  marcoArco(g,w,h,.13,nombre+'_marco');
  huecoArco(g,w,h,0,0,.145,0x202b2d,nombre+'_fondo');
  const yArco=h/2-w/2;
  // División central y barrotes ajustados al arco.
  for(let i=0;i<=6;i++) {
    const x=-w/2+w*i/6;
    const top=yArco+Math.sqrt(Math.max(0,(w/2)**2-x*x));
    const alto=top+h/2;
    g.add(box(.024,alto,.028,C.reja,nombre+'_barra'+i,x,(top-h/2)/2,.19));
    if(i>0&&i<6)for(const y of (esPuerta?[-h*.30,-h*.08,h*.16]:[-h*.18,h*.12]))voluta(g,x,y,.21,w*.07);
  }
  g.add(box(w,.035,.03,C.reja,nombre+'_travesano',0,yArco,.195));
  if(esPuerta)g.add(box(.045,h*.75,.04,C.reja,nombre+'_division',0,-h*.1,.20));
  // Umbral y remate inferior.
  g.add(box(w+.32,.08,.25,C.marco,nombre+'_umbral',0,-h/2-.09,.15));
  return g;
}
function ventana(nombre) {return abertura(nombre,.85,1.70);}
function puertaTriple(nombre) {
  // Referencia fotográfica: acceso de dos hojas dentro de un arco amplio.
  const g=abertura(nombre,1.65,2.75,true);
  g.add(box(.08,2.1,.07,C.marco,nombre+'_parteluz',0,-.28,.22));
  const med=cyl(.12,.12,.07,24,C.marcoOsc,nombre+'_medallon',0,1.20,.24);med.rotation.x=Math.PI/2;g.add(med);
  return g;
}
function puertaReja(nombre) {return abertura(nombre,1.0,2.6,true);}

/**
 * Panel de reja vertical para el corredor.
 */
function panelReja(nombre, ancho, alto) {
  const g = new THREE.Group();
  g.name = nombre;
  const n = Math.max(4, Math.round(ancho * 4.5));
  const sep = ancho / n;
  for (let i = 0; i < n; i++) {
    const x = -ancho / 2 + sep * i + sep / 2;
    g.add(box(0.042, alto, 0.042, C.reja, nombre + `_b${i}`, x, 0, 0));
  }
  g.add(box(ancho, 0.055, 0.055, C.reja, nombre + '_ts', 0,  alto / 2 - 0.03, 0));
  g.add(box(ancho, 0.055, 0.055, C.reja, nombre + '_tc', 0,  0, 0));
  g.add(box(ancho, 0.055, 0.055, C.reja, nombre + '_ti', 0, -alto / 2 + 0.03, 0));
  return g;
}

/**
 * Columna cuadrada del corredor (fuste + capitel + base).
 */
function columna(nombre,x,y,z) {
 const g=new THREE.Group();g.name=nombre;g.position.set(x,y,z);
 g.add(box(.23,2.8,.23,C.columna,nombre+'_f',0,0,0));
 g.add(box(.32,.12,.32,C.columna,nombre+'_cap',0,1.44,0));
 g.add(box(.30,.12,.30,C.columna,nombre+'_base',0,-1.44,0));return g;
}

// ══════════════════════════════════════════════════════════════════════════════
// MODELO DEL EDIFICIO
// ══════════════════════════════════════════════════════════════════════════════
/**
 * Crea todas las piezas del edificio y devuelve un objeto con referencias.
 * Responsable: Jocsan Yair Zelaya Figueroa (modelo-edificio.js)
 *
 * SISTEMA DE EJES:
 *   X+ → Este    Y+ → Arriba    Z+ → Sur (fachada principal)
 *
 * DIMENSIONES ACADÉMICAS (proporcionales, no medidas reales):
 *   Cuerpo: 16u (X) × 3.4u (Y) × 8u (Z)
 */
function crearModeloEdificio() {
  const W = 16, H = 3.4, D = 8;   // ancho, alto, profundidad
  const zS = D / 2;                // cara sur (Z+)
  const zN = -D / 2;               // cara norte (Z-)
  const xE = W / 2;                // cara este (X+)
  const xO = -W / 2;               // cara oeste (X-)
  const yM = H / 2;                // mitad de altura

  // ── CUERPO PRINCIPAL ──────────────────────────────────────────────────
  const cuerpo = box(W, H, D, C.muro, 'estructuraPrincipal', 0, yM, 0);

  // ── TECHO A DOS AGUAS ─────────────────────────────────────────────────
  // Caballete sobre el eje X (largo). Dos vertientes inclinadas + tapaguas.
  const alero  = 0.85;
  const cabH   = 1.55;   // altura del caballete
  const largo  = W + 2 * alero;
  const semip  = D / 2 + alero;
  const incl   = Math.atan2(cabH, semip);           // ángulo de inclinación
  const lviert = Math.sqrt(cabH * cabH + semip * semip);  // longitud de la vertiente

  const techoGrupo = new THREE.Group();
  techoGrupo.name = 'techo';

  // Techo a cuatro aguas: dos trapecios y dos extremos triangulares.
  // Seis triángulos sin base, con cumbrera más corta que el alero.
  const X=largo/2,Z=semip,R=W/2-2;
  const A=[-X,H,-Z],B=[X,H,-Z],C1=[X,H,Z],D1=[-X,H,Z],E=[-R,H+cabH,0],F=[R,H+cabH,0];
  const caras=[[A,E,F],[A,F,B],[D1,C1,F],[D1,F,E],[A,D1,E],[B,F,C1]];
  const posiciones=[],uv=[];
  for(const cara of caras)for(const v of cara){posiciones.push(...v);uv.push((v[0]+X)/(2*X),(v[2]+Z)/(2*Z));}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(posiciones,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.computeVertexNormals();
  const cubierta=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0xa87753,roughness:.95,side:THREE.DoubleSide}));cubierta.name='techoVS';techoGrupo.add(cubierta);
  techoGrupo.add(box(R*2,.12,.15,C.cumbrera,'cumbrera',0,H+cabH+.05,0));

  // Fascias del alero (banda oscura bajo el borde del techo, perimetral)
  const fH = 0.22;
  const yF = H - fH / 2 + 0.02;
  techoGrupo.add(box(largo, fH, 0.13, C.fascia, 'fasciaS',  0, yF,  zS + alero));
  techoGrupo.add(box(largo, fH, 0.13, C.fascia, 'fasciaN',  0, yF,  zN - alero));
  techoGrupo.add(box(0.13, fH, D + 2 * alero, C.fascia, 'fasciaE',  xE + alero, yF, 0));
  techoGrupo.add(box(0.13, fH, D + 2 * alero, C.fascia, 'fasciaO',  xO - alero, yF, 0));

  // ── PLATAFORMA / BANQUETA ─────────────────────────────────────────────
  const plataforma = box(W + 6, 0.16, D + 4.5, C.banqueta, 'plataforma', -1.5, -0.08, 0);

  // Rodapié perimetral (moldura baja del muro)
  const rodapies = new THREE.Group();
  rodapies.name = 'rodapies';
  rodapies.add(box(W + 0.06, 0.22, 0.12, C.rodapie, 'rpS', 0, 0.11,  zS + 0.01));
  rodapies.add(box(W + 0.06, 0.22, 0.12, C.rodapie, 'rpN', 0, 0.11,  zN - 0.01));
  rodapies.add(box(0.12, 0.22, D + 0.06, C.rodapie, 'rpE', xE + 0.01, 0.11, 0));
  rodapies.add(box(0.12, 0.22, D + 0.06, C.rodapie, 'rpO', xO - 0.01, 0.11, 0));

  // Cornisa superior (moldura alta del muro, bajo la fascia)
  const cornisas = new THREE.Group();
  cornisas.name = 'cornisas';
  cornisas.add(box(W + 0.06, 0.12, 0.17, C.marco, 'cnS', 0, H - 0.06, zS + 0.085));
  cornisas.add(box(W + 0.06, 0.12, 0.17, C.marco, 'cnN', 0, H - 0.06, zN - 0.085));
  cornisas.add(box(0.17, 0.12, D + 0.06, C.marco, 'cnE', xE + 0.085, H - 0.06, 0));
  cornisas.add(box(0.17, 0.12, D + 0.06, C.marco, 'cnO', xO - 0.085, H - 0.06, 0));

  // ── FACHADA SUR (Z+) ─ entrada principal ─────────────────────────────
  // Puerta triple arco — tercio izquierdo
  const prtPpal = puertaTriple('puerta');
  prtPpal.position.set(-W * 0.22, yM - 0.15, zS + 0.02);

  // 3 ventanas con arco — centro y derecha de la fachada
  const yV = yM + 0.14;
  const vF1 = ventana('vF1'); vF1.position.set( W * 0.06, yV, zS + 0.02);
  const vF2 = ventana('vF2'); vF2.position.set( W * 0.24, yV, zS + 0.02);
  const vF3 = ventana('vF3'); vF3.position.set( W * 0.40, yV, zS + 0.02);

  // Pilar de esquina Sur-Este (visible en foto 1)
  const pilarSE = box(0.30, H, 0.30, C.marco, 'pilarSE', xE, yM, zS);

  // Escalones de acceso frente a la puerta principal
  const xEsc = -W * 0.22;
  const escGroup = new THREE.Group();
  escGroup.name = 'escalones';
  escGroup.add(box(2.8, 0.11, 0.36, C.escalon, 'esc1', xEsc, 0.055, zS + 0.80));
  escGroup.add(box(2.6, 0.11, 0.36, C.escalon, 'esc2', xEsc, 0.165, zS + 0.44));
  escGroup.add(box(2.4, 0.11, 0.36, C.escalon, 'esc3', xEsc, 0.275, zS + 0.08));

  // ── FACHADA ESTE (X+) ─ lateral larga ────────────────────────────────
  // 5 ventanas distribuidas a lo largo de Z
  const posZE = [-3.3, -2.1, -.9, .3, 1.5];
  const ventE = posZE.map((pz, i) => {
    const v = ventana(`vE${i + 1}`);
    v.rotation.y = Math.PI / 2;
    v.position.set(xE + 0.02, yV, pz);
    return v;
  });

  // Puerta lateral con reja — extremo sur de la fachada este
  const prtE = puertaReja('puertaEste');
  prtE.rotation.y = Math.PI / 2;
  prtE.position.set(xE + 0.02, yM - 0.15, zS - .7);

  // ── FACHADA NORTE (Z-) ─ posterior ───────────────────────────────────
  // Muro liso (sin aberturas en el modelo)
  // 2 ventanas pequeñas visibles en la foto posterior
  const vN1 = ventana('vN1'); vN1.rotation.y = Math.PI; vN1.position.set(-W * 0.25, yV, zN - 0.02);
  const vN2 = ventana('vN2'); vN2.rotation.y = Math.PI; vN2.position.set( W * 0.25, yV, zN - 0.02);

  // ── FACHADA OESTE (X-) ─ corredor amarillo ────────────────────────────
  // Corredor adosado: muros amarillos + 4 columnas + rejas + techo propio
  const cAlt  = 3.0;     // altura del corredor
  const cProf = 3.5;     // profundidad (saliente hacia X-)
  const cLarg = W * 0.55; // longitud del corredor (a lo largo de Z)
  const xCExt = xO - cProf;           // cara exterior del corredor
  const zCC   = zS - cLarg / 2;       // centro Z del corredor

  // Muro posterior del corredor (pared amarilla adosada al edificio)
  const mCorrPost = box(0.20, cAlt, cLarg, C.amarillo, 'mCorrPost', xO, cAlt / 2, zCC);
  // Muro exterior del corredor
  const mCorrExt  = box(0.20, 0.35, cLarg, C.muro, 'mCorrExt',  xCExt, 0.175, zCC);
  // Muro cierre sur del corredor
  const mCorrSur  = box(cProf, .35, .20, C.muro, 'mCorrSur', xO-cProf/2, .175, zS);
  // Muro cierre norte del corredor
  const mCorrNor  = box(cProf, cAlt, 0.20, C.amarillo, 'mCorrNor',  xO - cProf / 2, cAlt / 2, zS - cLarg);

  // Techo del corredor (inclinado levemente hacia el exterior)
  const inclC = 0.12;
  const lVC   = Math.sqrt(cProf * cProf + (cProf * inclC) * (cProf * inclC));
  const techoC = box(lVC + 0.5, 0.17, cLarg + 0.5, C.teja, 'techoCorredor',
    xO - cProf / 2, cAlt + 0.08, zCC);
  techoC.rotation.z = inclC;

  // Fascia del corredor
  const fasciaC = box(cProf + 0.5, 0.20, 0.12, C.fascia, 'fasciaCorr',
    xO - cProf / 2, cAlt - 0.08, zCC - cLarg / 2 + 0.06);

  // 4 columnas blancas espaciadas a lo largo del corredor
  const colsGrupo = new THREE.Group();
  colsGrupo.name = 'columnasCorredor';
  for (let i = 0; i < 4; i++) {
    const zc = zS - (cLarg / 3) * i;
    colsGrupo.add(columna(`col${i + 1}`, xCExt + 0.25, cAlt / 2, zc));
  }

  // 3 paneles de reja vertical entre columnas
  const rejasGrupo = new THREE.Group();
  rejasGrupo.name = 'rejasCorredor';
  for (let i = 0; i < 3; i++) {
    const zr = zS - (cLarg / 3) * i - cLarg / 6;
    const pancho = cLarg / 3 - 0.32;
    const rj = panelReja(`rj${i + 1}`, pancho, 2.55);
    rj.rotation.y = Math.PI / 2;
    rj.position.set(xCExt + 0.25, cAlt / 2, zr);
    rejasGrupo.add(rj);
  }

  // Centrar pivotes de grupos sin alterar su ensamblaje inicial.
  techoGrupo.position.set(0,H+cabH/2,0);
  for(const c of techoGrupo.children)c.position.sub(techoGrupo.position);
  // Letrero como textura 2D sobre el muro; es hijo del cuerpo y hereda sus cambios.
  if(typeof document!=='undefined') {
    const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=128;
    const ctx=canvas.getContext('2d');ctx.clearRect(0,0,1536,128);
    ctx.fillStyle='#24221e';ctx.font='bold 64px Arial';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('UNIVERSIDAD POLITÉCNICA DE HONDURAS',768,64,1490);
    const tx=new THREE.CanvasTexture(canvas);tx.colorSpace=THREE.SRGBColorSpace;
    const rotulo=new THREE.Mesh(new THREE.PlaneGeometry(10.5,.23),new THREE.MeshBasicMaterial({map:tx,transparent:true,depthWrite:false}));
    rotulo.name='rotuloInstitucional';rotulo.position.set(-1,H-.48-yM,zS+.075);cuerpo.add(rotulo);
  }

  // ── RETORNAR TODAS LAS PIEZAS ─────────────────────────────────────────
  return {
    estructuraPrincipal : cuerpo,
    techo               : techoGrupo,
    plataforma,
    rodapies,
    cornisas,
    pilarSE,

    // Fachada Sur
    puerta     : prtPpal,
    ventana_F1 : vF1, ventana_F2 : vF2, ventana_F3 : vF3,
    escalones  : escGroup,

    // Fachada Este
    ventana_E1 : ventE[0], ventana_E2 : ventE[1], ventana_E3 : ventE[2],
    ventana_E4 : ventE[3], ventana_E5 : ventE[4],
    puertaEste : prtE,

    // Fachada Norte
    ventana_N1 : vN1, ventana_N2 : vN2,

    // Corredor Oeste
    mCorrPost, mCorrExt, mCorrSur, mCorrNor,
    techoCorredor : techoC,
    fasciaCorr    : fasciaC,
    columnasCorredor : colsGrupo,
    rejasCorredor    : rejasGrupo,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// JERARQUÍA  (Tatiana Vaytares Ochoa Aguilar — jerarquia.js)
// ══════════════════════════════════════════════════════════════════════════════

export { crearModeloEdificio };

// Textura de tejas procedural: aspecto de barro sin miles de piezas adicionales.
export function aplicarAcabados(raiz) {
 if(typeof document==='undefined') return;
 const c=document.createElement('canvas');c.width=512;c.height=512;const x=c.getContext('2d');
 x.fillStyle='#aa7251';x.fillRect(0,0,512,512);
 for(let row=0;row<8;row++)for(let col=0;col<8;col++) {
   const xx=col*64, yy=row*64;
   const g=x.createLinearGradient(xx,0,xx+64,0);g.addColorStop(0,'#704734');g.addColorStop(.35,'#b67e57');g.addColorStop(.65,'#be8b65');g.addColorStop(1,'#79503a');
   x.fillStyle=g;x.fillRect(xx,yy,64,64);x.strokeStyle='#684630';x.lineWidth=3;x.beginPath();x.moveTo(xx,yy+62);x.lineTo(xx+64,yy+62);x.stroke();
 }
 const textura=new THREE.CanvasTexture(c);textura.colorSpace=THREE.SRGBColorSpace;textura.wrapS=textura.wrapT=THREE.RepeatWrapping;textura.repeat.set(4,2);
 for(const name of ['techoVS','techoVN','techoCorredor']) {
  const m=raiz.getObjectByName(name);if(m){m.material=new THREE.MeshStandardMaterial({map:textura,color:0xffffff,roughness:.98,side:THREE.DoubleSide});}
 }
}
