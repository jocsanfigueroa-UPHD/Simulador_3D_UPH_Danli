import * as THREE from 'three';
export function crearModosDibujo(raiz) {
 const originales=[];raiz.traverse(o=>{if(o.isMesh)originales.push({obj:o,material:o.material});});
 const lineaMat=new THREE.LineBasicMaterial({color:0xb5c8ed});
 const puntoMat=new THREE.PointsMaterial({color:0xf1bd4d,size:.065,sizeAttenuation:true});
 const proxies=new Map();let modo='solido';
 function cambiar(nuevo){
  if(!['solido','lineas','puntos'].includes(nuevo))throw Error('Modo desconocido');modo=nuevo;
  for(const {obj,material} of originales){
   for(const m of (Array.isArray(material)?material:[material])) {m.visible=nuevo==='solido';m.wireframe=false;}
   let p=proxies.get(obj);
   if(!p&&nuevo!=='solido'){
    const lineas=new THREE.LineSegments(new THREE.WireframeGeometry(obj.geometry),lineaMat);
    const puntos=new THREE.Points(obj.geometry,puntoMat);
    lineas.userData.auxiliar=true;puntos.userData.auxiliar=true;
    obj.add(lineas,puntos);p={lineas,puntos};proxies.set(obj,p);
   }
   if(p){p.lineas.visible=nuevo==='lineas';p.puntos.visible=nuevo==='puntos';}
  }
 }
 return {cambiar,get modo(){return modo;}};
}
