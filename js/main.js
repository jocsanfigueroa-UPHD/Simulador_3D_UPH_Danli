import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { crearModosDibujo } from './modos-dibujo.js';
import { crearModeloEdificio, aplicarAcabados } from './modelo-edificio.js';
import { construirJerarquia } from './jerarquia.js';
import { registrarTodos } from './transformaciones.js';
import { iniciarInterfaz } from './interfaz.js';
const escena = new THREE.Scene();
escena.background = new THREE.Color(0xe5e8eb);
escena.fog = new THREE.Fog(0xe5e8eb, 90, 180);

// ── Cámara ───────────────────────────────────────────────────────────────────
const contenedor = document.getElementById('visor3D');
const W0 = contenedor.clientWidth  || 800;
const H0 = contenedor.clientHeight || 600;

const camara = new THREE.PerspectiveCamera(52, W0 / H0, 0.1, 300);
camara.position.set(22, 11, 20);   // vista angular sur-este, como foto 1
camara.lookAt(0, 1.8, 0);

// ── Renderizador ─────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(W0, H0);
renderer.shadowMap.enabled = true;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
contenedor.appendChild(renderer.domElement);

new ResizeObserver(() => {
  const w = Math.max(1, contenedor.clientWidth), h = Math.max(1, contenedor.clientHeight);
  camara.aspect = w / h;
  camara.updateProjectionMatrix();
  renderer.setSize(w, h, false);
}).observe(contenedor);

// ── Iluminación ──────────────────────────────────────────────────────────────
escena.add(new THREE.HemisphereLight(0xf5f6ff,0x9b8d71,1.8));

const sol = new THREE.DirectionalLight(0xfff2e3, 2.5);
sol.position.set(18, 30, 22);
sol.castShadow = true;
sol.shadow.mapSize.set(2048, 2048);
sol.shadow.camera.near = 1;  sol.shadow.camera.far  = 100;
sol.shadow.camera.left = -25; sol.shadow.camera.right = 25;
sol.shadow.camera.top  = 25;  sol.shadow.camera.bottom = -25;
sol.shadow.bias = -0.001;
escena.add(sol);

const relleno = new THREE.DirectionalLight(0xc8daff, 0.42);
relleno.position.set(-14, 10, -16);
escena.add(relleno);

const luzCorr = new THREE.PointLight(0xffe8a0, 0.55, 18);
luzCorr.position.set(-11, 2.5, 3.0);
escena.add(luzCorr);

// ── Suelo ────────────────────────────────────────────────────────────────────
const suelo = new THREE.Mesh(
  new THREE.PlaneGeometry(130, 130),
  new THREE.MeshStandardMaterial({ color: 0xd9dde1,roughness:1 }),
);
suelo.rotation.x = -Math.PI / 2;
suelo.position.y = -0.18;
suelo.receiveShadow = true;
escena.add(suelo);

// ── Ejes auxiliares ──────────────────────────────────────────────────────────
const ejes = new THREE.AxesHelper(8);
ejes.visible = false;
escena.add(ejes);

// ── Modelo del edificio ───────────────────────────────────────────────────────
const piezas = crearModeloEdificio();
const { raiz, mapa } = construirJerarquia(piezas);

// Activar sombras en todas las mallas
raiz.traverse(obj => {
  if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; }
});
escena.add(raiz);
aplicarAcabados(raiz);
const modos=crearModosDibujo(raiz);

// ── Etiquetas flotantes de fachada ────────────────────────────────────────────
function crearEtiqueta(texto, x, y, z) {
  const c = document.createElement('canvas');
  c.width = 480; c.height = 88;
  const ctx = c.getContext('2d');
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.beginPath(); ctx.roundRect(2, 2, c.width-4, c.height-4, 12); ctx.fill();
  ctx.strokeStyle = '#1c145c'; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = '#1c145c'; ctx.font = 'bold 26px Arial';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(texto, c.width/2, c.height/2);
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(c), depthTest: false
  }));
  spr.scale.set(4.2, 0.77, 1);
  spr.position.set(x, y, z);
  return spr;
}

const etiqGrupo = new THREE.Group();
etiqGrupo.name = 'etiquetas';
etiqGrupo.add(crearEtiqueta('▲ FACHADA SUR — Entrada principal',  0, 7.2,  6.5));
etiqGrupo.add(crearEtiqueta('◀ FACHADA ESTE — Lateral',          11, 7.2,  0));
etiqGrupo.add(crearEtiqueta('▼ FACHADA NORTE — Posterior',        0, 7.2, -6.5));
etiqGrupo.add(crearEtiqueta('▶ FACHADA OESTE — Corredor',       -13, 7.2,  1));
etiqGrupo.visible = false;
escena.add(etiqGrupo);  // fuera del edificio para que las transformaciones no las muevan

// ── Registrar estados iniciales ───────────────────────────────────────────────
registrarTodos(mapa);

// ── OrbitControls ─────────────────────────────────────────────────────────────
const ctrl = new OrbitControls(camara, renderer.domElement);
ctrl.enableDamping = true;
ctrl.dampingFactor = 0.08;
ctrl.target.set(0, 1.8, 0);
ctrl.minDistance = 4;
ctrl.maxDistance = 90;
ctrl.update();

// ── Interfaz ──────────────────────────────────────────────────────────────────
iniciarInterfaz(mapa, escena);

// ── Botones de vista ─────────────────────────────────────────────────────────
const sueloMaterial=suelo.material;
const cuadricula=new THREE.GridHelper(70,70,0x61718a,0xa8b2c3);cuadricula.position.y=-.18;cuadricula.visible=false;escena.add(cuadricula);
function actualizarModo(modo){
 modos.cambiar(modo);document.getElementById('modoDibujo').value=modo;
 escena.background.set(modo==='solido'?0xe5e8eb:0x101827);escena.fog.color.copy(escena.background);
 suelo.visible=modo==='solido';cuadricula.visible=modo!=='solido'||document.getElementById('btnCuadricula').getAttribute('aria-pressed')==='true';
 document.getElementById('btnModoAlambre').textContent=modo==='lineas'?'Volver a sólido':'Modo alámbrico';
}
document.getElementById('modoDibujo').onchange=e=>actualizarModo(e.target.value);
document.getElementById('btnModoAlambre').onclick=()=>actualizarModo(modos.modo==='lineas'?'solido':'lineas');
document.getElementById('btnCuadricula').onclick=e=>{const visible=e.currentTarget.getAttribute('aria-pressed')!=='true';e.currentTarget.setAttribute('aria-pressed',String(visible));cuadricula.visible=visible;};
const btnEjes = document.getElementById('btnEjes');
if (btnEjes) {
  btnEjes.addEventListener('click', () => {
    ejes.visible = !ejes.visible;
    btnEjes.classList.toggle('active', ejes.visible);
  });
}

// ── Botón ocultar/mostrar etiquetas ──────────────────────────────────────────
// (Se controla desde el selector de visibilidad)
// Las etiquetas son auxiliares externos y no se restablecen con el modelo.

// ── Ciclo de renderizado ──────────────────────────────────────────────────────
(function animar() {
  requestAnimationFrame(animar);
  ctrl.update();
  renderer.render(escena, camara);
})();

function encuadrar(vista='general') {
  raiz.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(raiz);
  if(bounds.isEmpty()) return;
  const centro=bounds.getCenter(new THREE.Vector3());
  const radio=bounds.getBoundingSphere(new THREE.Sphere()).radius;
  const fov=THREE.MathUtils.degToRad(camara.fov);

  const direcciones={general:[1,.55,1.35],corredor:[-1,.45,1],frontal:[0,.15,1]};
  const direccion=new THREE.Vector3(...(direcciones[vista]||direcciones.general)).normalize();
  const derecha=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),direccion).normalize();
  const arriba=new THREE.Vector3().crossVectors(direccion,derecha).normalize();
  const tanV=Math.tan(fov/2)*.83,tanH=tanV*camara.aspect;let distancia=0;
  for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){
   const v=new THREE.Vector3(x,y,z).sub(centro);const profundidad=v.dot(direccion);
   distancia=Math.max(distancia,profundidad+Math.abs(v.dot(derecha))/tanH,profundidad+Math.abs(v.dot(arriba))/tanV);
  }
  camara.position.copy(centro).addScaledVector(direccion,distancia);
  camara.near=Math.max(.01,radio/1000);camara.far=distancia+radio*20;camara.updateProjectionMatrix();
  ctrl.target.copy(centro);ctrl.maxDistance=Math.max(90,distancia*4);ctrl.update();
}
for(const vista of ['general','corredor','frontal']) document.getElementById('vista-'+vista).onclick=()=>encuadrar(vista);
document.getElementById('btnEtiquetas').onclick=()=>{etiqGrupo.visible=!etiqGrupo.visible;};
encuadrar();
let triangulos=0,mallas=0;
raiz.traverse(o=>{if(o.isMesh){mallas++;triangulos+=(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3;}});
document.getElementById('estadoVisor').textContent=`Modelo cargado · ${mallas} mallas · ${triangulos} triángulos`;
window.UPH_DEBUG={escena,raiz,mapa,camara,ctrl,renderer,encuadrar,modos,actualizarModo};
