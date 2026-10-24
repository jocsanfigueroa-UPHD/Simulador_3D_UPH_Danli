// Interfaz e interacción: Andrea Celeste Cubas Rodríguez.
import { aplicarTraslacion, aplicarRotacion, aplicarEscala, restablecer, restablecerTodos } from './transformaciones.js';
export function iniciarInterfaz(mapa) {
 const $=id=>document.getElementById(id), sel=$('selectorObjeto'), info=$('infoPanel');
 const grupos=[['traslacion',aplicarTraslacion],['rotacion',aplicarRotacion],['escala',aplicarEscala]];
 const etiquetas={puerta:'Puerta principal',escalones:'Escalones de acceso',edificioCompleto:'Edificio completo · global',estructuraPrincipal:'Muros principales',techo:'Techo principal',plataforma:'Plataforma',detalles:'Molduras',fachadaSur:'Fachada principal',fachadaEste:'Fachada lateral',fachadaNorte:'Fachada posterior',fachadaOeste:'Corredor amarillo',columnasCorredor:'Columnas del corredor',rejasCorredor:'Rejas del corredor',techoCorredor:'Cubierta del corredor'};
 for(const [key,obj] of Object.entries(mapa)) {
  const op=document.createElement('option');op.value=key;op.textContent=etiquetas[key]||obj.name;sel.append(op);
 }
 const actual=()=>mapa[sel.value]||mapa.edificioCompleto;
 function valores(obj,tipo){const i=obj.userData.ini;
  if(tipo==='traslacion')return ['x','y','z'].map(a=>obj.position[a]-i.pos[a]);
  if(tipo==='rotacion')return ['x','y','z'].map(a=>(obj.rotation[a]-i.rot[a])*180/Math.PI);
  return ['x','y','z'].map(a=>obj.scale[a]/i.esc[a]);
 }
 function sincronizar(){for(const [tipo] of grupos)valores(actual(),tipo).forEach((v,i)=>{
  const id=tipo+'XYZ'[i];$(id).value=Number(v.toFixed(3));const range=$(id+'R');
  range.min=Math.min(Number(range.dataset.min),v);range.max=Math.max(Number(range.dataset.max),v);range.value=v;
 });mostrar();}
 function mostrar(){const o=actual();info.textContent=`${etiquetas[sel.value]||o.name} · posición local (${o.position.x.toFixed(2)}, ${o.position.y.toFixed(2)}, ${o.position.z.toFixed(2)}) · ${o.visible?'visible':'oculto'}`;}
 function aplicar(){
  const values=grupos.map(([tipo])=>'XYZ'.split('').map(a=>{const e=$(tipo+a);return e.value.trim()?Number(e.value):NaN;}));
  if(!values.flat().every(Number.isFinite)||values[2].some(v=>v<=0)){info.textContent='Ingrese números finitos; la escala debe ser mayor que cero.';return;}
  grupos.forEach(([,fn],i)=>fn(actual(),...values[i]));mostrar();
 }
 for(const [tipo] of grupos)for(const a of 'XYZ'){
  const input=$(tipo+a),range=$(tipo+a+'R');
  range.addEventListener('input',()=>{input.value=range.value;aplicar();});
  input.addEventListener('input',()=>{if(input.value.trim()&&Number.isFinite(Number(input.value))){const v=Number(input.value);range.min=Math.min(Number(range.dataset.min),v);range.max=Math.max(Number(range.dataset.max),v);range.value=v;}aplicar();});
 }
 sel.addEventListener('change',sincronizar);$('btnAplicar').onclick=aplicar;
 $('btnRestablecer').onclick=()=>{restablecer(actual());sincronizar();};
 const controles=[];
 function efectivo(o){for(let n=o;n;n=n.parent)if(!n.visible)return false;return true;}
 function actualizarVisibilidad(){
  let visibles=0;
  for(const {obj,check,estado,row} of controles){
   const seVe=efectivo(obj);check.checked=obj.visible;
   estado.textContent=seVe?'Visible':obj.visible?'Oculto por grupo':'Oculto';
   row.dataset.visible=String(seVe);row.title=obj.visible&&!seVe?'Su grupo padre está oculto. Muestre el grupo para ver esta pieza.':'';
   if(seVe)visibles++;
  }
  $('resumenVisibilidad').textContent=`${visibles} de ${controles.length} componentes habilitados en la escena`;
  mostrar();
 }
 $('btnRestablecerTodos').onclick=()=>{restablecerTodos(mapa);for(const o of Object.values(mapa))o.visible=true;sincronizar();actualizarVisibilidad();};
 for(const [key,o] of Object.entries(mapa)){
  const row=document.createElement('label');row.className='visibility-row';
  const check=document.createElement('input');check.type='checkbox';check.checked=o.visible;check.setAttribute('aria-label','Mostrar '+(etiquetas[key]||o.name));
  const texto=document.createElement('span');texto.className='visibility-copy';
  const label=document.createElement('span');label.className='visibility-name';label.textContent=etiquetas[key]||o.name;
  const estado=document.createElement('span');estado.className='visibility-state';texto.append(label,estado);
  check.onchange=()=>{o.visible=check.checked;actualizarVisibilidad();};row.append(check,texto);$('partesList').append(row);
  controles.push({obj:o,check,estado,row});
 }
 $('btnMostrarTodo').onclick=()=>{for(const o of Object.values(mapa))o.visible=true;actualizarVisibilidad();};
 $('btnOcultarTodo').onclick=()=>{for(const o of Object.values(mapa))o.visible=false;actualizarVisibilidad();};
 $('btnSoloSeleccionado').onclick=()=>{
  const elegido=actual();for(const o of Object.values(mapa))o.visible=false;
  elegido.traverse(o=>{if(!o.userData.auxiliar)o.visible=true;});for(let n=elegido.parent;n;n=n.parent)n.visible=true;
  actualizarVisibilidad();
 };
 actualizarVisibilidad();
 sincronizar();
}
